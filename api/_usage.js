// api/_usage.js
//
// Server-side usage tracking for org-level playbook run limits.
// Uses the Supabase REST API with the service_role key (not the
// anon key) so it can read across RLS boundaries.
//
// Called from api/claude.js and api/claude-stream.js when the
// client sends the x-billable-run header.

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY; // service_role — server-side only

function sbFetch(path, method = "GET", body = null) {
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    "Content-Type": "application/json",
    Prefer: method === "POST" ? "return=representation" : undefined,
  };
  // Remove undefined headers
  Object.keys(headers).forEach(k => headers[k] === undefined && delete headers[k]);
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Extract user ID from JWT payload (already decoded by _guard.js).
 * Re-decodes here for independence — the guard returns a boolean,
 * not the payload.
 */
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
 * Check if the user's org has remaining playbook runs.
 * Returns { allowed: true, org_id } or { allowed: false, run_count, run_limit }.
 * Returns { allowed: true } for users without an org (legacy/guest).
 */
export async function checkOrgUsage(userId) {
  if (!SB_URL || !SB_KEY) return { allowed: true }; // no service key = skip checks

  try {
    // Look up user's org_id
    const userRes = await sbFetch(`users?id=eq.${userId}&select=org_id`);
    const users = await userRes.json();
    const orgId = users?.[0]?.org_id;
    if (!orgId) return { allowed: true }; // no org = legacy user, allow

    // Check org limits
    const orgRes = await sbFetch(`orgs?id=eq.${orgId}&select=run_count,run_limit,plan`);
    const orgs = await orgRes.json();
    const org = orgs?.[0];
    if (!org) return { allowed: true };

    if (org.plan === "suspended") {
      return { allowed: false, reason: "suspended", run_count: org.run_count, run_limit: org.run_limit };
    }
    if (org.run_count >= org.run_limit) {
      return { allowed: false, reason: "limit_exceeded", run_count: org.run_count, run_limit: org.run_limit };
    }
    return { allowed: true, org_id: orgId, run_count: org.run_count, run_limit: org.run_limit };
  } catch (e) {
    console.warn("[usage] check failed:", e.message);
    return { allowed: true }; // fail open — don't block users on infra errors
  }
}

/**
 * Increment the org's run counter. Uses the atomic SQL function
 * to prevent race conditions between concurrent brief generations.
 */
export async function incrementUsage(orgId) {
  if (!SB_URL || !SB_KEY) return;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/rpc/increment_run_count`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_org_id: orgId }),
    });
    const result = await res.json();
    if (result?.error) console.warn("[usage] increment failed:", result.error);
    return result;
  } catch (e) {
    console.warn("[usage] increment error:", e.message);
  }
}
