// api/_usage.js
//
// Server-side usage tracking for org-level playbook run limits.
// Tracks both standard (Haiku) and Max (Opus) runs separately.
// Uses the Supabase REST API with the service_role key (not the
// anon key) so it can read across RLS boundaries.
//
// Headers from client:
//   x-billable-run: "1" — this is a standard playbook run
//   x-billable-max: "1" — this is a Max (Opus) playbook run

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

function sbFetch(path, method = "GET", body = null) {
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    "Content-Type": "application/json",
    Prefer: method === "POST" ? "return=representation" : undefined,
  };
  Object.keys(headers).forEach(k => headers[k] === undefined && delete headers[k]);
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function sbRpc(fn, params) {
  return fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then(r => r.json());
}

export function extractUserId(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    const parts = auth.slice(7).split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    return payload.sub || null;
  } catch { return null; }
}

/**
 * Auto-provision a trial org for a user who has no org_id.
 * Returns the new org_id, or null on failure.
 */
async function provisionTrialOrg(userId) {
  try {
    // Get user email/name for the org name
    const userRes = await sbFetch(`users?id=eq.${userId}&select=email,name`);
    const users = await userRes.json();
    const user = users?.[0];
    const orgName = user?.name || user?.email || "My Organization";

    // Create a trial org with default limits (run_limit=5, max_run_limit=0)
    const createRes = await fetch(`${SB_URL}/rest/v1/orgs`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ name: orgName }),
    });
    const created = await createRes.json();
    const newOrgId = created?.[0]?.id;
    if (!newOrgId) return null;

    // Bind user to the new org as admin
    await fetch(`${SB_URL}/rest/v1/users?id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ org_id: newOrgId, role: "admin" }),
    });

    console.log(`[usage] Auto-provisioned trial org ${newOrgId} for user ${userId}`);
    return newOrgId;
  } catch (e) {
    console.warn("[usage] Failed to provision trial org:", e.message);
    return null;
  }
}

/**
 * Check if the user's org has remaining runs.
 * isMax=true checks max_run_count/max_run_limit (Opus).
 * isMax=false checks run_count/run_limit (Haiku, default).
 */
export async function checkOrgUsage(userId, { isMax = false } = {}) {
  if (!SB_URL || !SB_KEY) return { allowed: true };

  try {
    const userRes = await sbFetch(`users?id=eq.${userId}&select=org_id`);
    const users = await userRes.json();
    let orgId = users?.[0]?.org_id;

    // Auto-provision a trial org for users without one
    if (!orgId) {
      orgId = await provisionTrialOrg(userId);
      if (!orgId) {
        return { allowed: false, reason: "no_org", message: "Account setup failed. Please try again or contact support." };
      }
    }

    const orgRes = await sbFetch(`orgs?id=eq.${orgId}&select=run_count,run_limit,max_run_count,max_run_limit,plan`);
    const orgs = await orgRes.json();
    const org = orgs?.[0];
    if (!org) return { allowed: true };

    if (org.plan === "suspended") {
      return { allowed: false, reason: "suspended" };
    }

    if (isMax) {
      // Check Max (Opus) limit
      if (org.max_run_limit <= 0) {
        return { allowed: false, reason: "max_not_available", message: "Cambrian Max is not available on your plan. Upgrade to unlock premium intelligence." };
      }
      if (org.max_run_count >= org.max_run_limit) {
        return { allowed: false, reason: "max_limit_exceeded", max_run_count: org.max_run_count, max_run_limit: org.max_run_limit };
      }
      // Max runs also consume a regular run
      if (org.run_count >= org.run_limit) {
        return { allowed: false, reason: "limit_exceeded", run_count: org.run_count, run_limit: org.run_limit };
      }
      return { allowed: true, org_id: orgId, max_run_count: org.max_run_count, max_run_limit: org.max_run_limit, run_count: org.run_count, run_limit: org.run_limit };
    } else {
      // Check standard (Haiku) limit
      if (org.run_count >= org.run_limit) {
        return { allowed: false, reason: "limit_exceeded", run_count: org.run_count, run_limit: org.run_limit };
      }
      return { allowed: true, org_id: orgId, run_count: org.run_count, run_limit: org.run_limit, max_run_count: org.max_run_count, max_run_limit: org.max_run_limit };
    }
  } catch (e) {
    console.warn("[usage] check failed:", e.message);
    return { allowed: true };
  }
}

/** Increment standard run counter */
export async function incrementUsage(orgId) {
  if (!SB_URL || !SB_KEY) return;
  try {
    const result = await sbRpc("increment_run_count", { p_org_id: orgId });
    if (result?.error) console.warn("[usage] increment failed:", result.error);
    return result;
  } catch (e) {
    console.warn("[usage] increment error:", e.message);
  }
}

/** Increment Max run counter (also increments standard counter) */
export async function incrementMaxUsage(orgId) {
  if (!SB_URL || !SB_KEY) return;
  try {
    // Increment both counters — Max run costs a regular run too
    const [maxResult, stdResult] = await Promise.all([
      sbRpc("increment_max_run_count", { p_org_id: orgId }),
      sbRpc("increment_run_count", { p_org_id: orgId }),
    ]);
    if (maxResult?.error) console.warn("[usage] max increment failed:", maxResult.error);
    return maxResult;
  } catch (e) {
    console.warn("[usage] max increment error:", e.message);
  }
}
