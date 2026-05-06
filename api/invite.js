// api/invite.js — Send org invitations
//
// POST { email, role } with admin JWT → creates invitation row +
// sends Supabase invite email with acceptance link.

import { isAllowedOrigin, verifyJwt, decodeJwtPayload } from "./_guard.js";

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const APP_URL = process.env.VITE_APP_URL || "https://www.cambriancatalyst.ai";

// Stricter rate limit for invites — 10 per minute per IP
const inviteRateBuckets = new Map();
function checkInviteRateLimit(ip) {
  const now = Date.now();
  const bucket = inviteRateBuckets.get(ip);
  if (!bucket || (now - bucket.windowStart) > 60_000) {
    inviteRateBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  bucket.count++;
  return bucket.count <= 10;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function sbFetch(path, method = "GET", body = null, token = SB_KEY) {
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  if (method === "POST") headers.Prefer = "return=representation";
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!SB_KEY) return res.status(500).json({ error: "Server not configured for invitations" });

  // Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "origin not allowed" });

  // Rate limiting — strict for invite endpoint (email bombing prevention)
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"]
           || req.socket?.remoteAddress || "unknown";
  if (!checkInviteRateLimit(ip)) {
    return res.status(429).json({ error: "Too many invitations — try again in a minute" });
  }

  // Verify caller identity — use consolidated JWT verification from _guard.js
  if (!verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });
  const authToken = (req.headers.authorization || "").slice(7);
  const payload = decodeJwtPayload(authToken);
  if (!payload?.sub) return res.status(401).json({ error: "Authentication required" });

  const { email, role, orgId: overrideOrgId } = req.body || {};
  if (!email || !EMAIL_RE.test(email.trim())) return res.status(400).json({ error: "Valid email required (user@domain.tld)" });
  if (role && !["rep", "manager", "admin"].includes(role)) return res.status(400).json({ error: "Invalid role" });

  // Verify the caller is an admin of their org (or superuser for cross-org invites)
  const users = await sbFetch(`users?id=eq.${payload.sub}&select=org_id,role,email`);
  const caller = users?.[0];
  const isSuperuser = caller?.email === (process.env.SUPERUSER_EMAIL || "itsjoegalano@gmail.com");

  // Superuser can specify any orgId; regular admins use their own org
  const targetOrgId = (isSuperuser && overrideOrgId) ? overrideOrgId : caller?.org_id;

  if (!targetOrgId) return res.status(403).json({ error: "You must belong to an organization" });
  if (!isSuperuser && caller.role !== "admin") return res.status(403).json({ error: "Only admins can invite users" });

  // Check if already a member of this org
  const existingMembers = await sbFetch(`users?org_id=eq.${targetOrgId}&email=eq.${encodeURIComponent(email)}&select=id`);
  if (existingMembers?.length > 0) return res.status(400).json({ error: "This person is already a member of that organization. No invite needed." });

  // Delete any existing pending invitation for this email (allows resend)
  await fetch(`${SB_URL}/rest/v1/invitations?org_id=eq.${targetOrgId}&email=eq.${encodeURIComponent(email.trim().toLowerCase())}&accepted_at=is.null`, {
    method: "DELETE",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });

  // Create fresh invitation record
  const invResult = await sbFetch("invitations", "POST", {
    org_id: targetOrgId,
    email: email.trim().toLowerCase(),
    role: role || "rep",
    invited_by: payload.sub,
  });

  if (invResult?.code || invResult?.message) {
    return res.status(400).json({ error: "Failed to create invitation. Please try again." });
  }

  const token = invResult?.[0]?.token;
  if (!token) return res.status(500).json({ error: "Failed to generate invitation token" });

  // Send invite email via Supabase Auth admin API
  try {
    const authRes = await fetch(`${SB_URL}/auth/v1/invite`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        data: { invitation_token: token },
      }),
    });
    const authData = await authRes.json();

    if (authRes.status >= 400) {
      console.warn("[invite] Supabase auth invite failed:", authData);
      // Still return success — the invitation row exists, user can sign up manually
      return res.json({ ok: true, invitation_id: invResult[0].id, email_sent: false, note: "Invitation created but email may not have sent. Share the signup link directly." });
    }
  } catch (e) {
    console.warn("[invite] Email send error:", e.message);
  }

  res.json({ ok: true, invitation_id: invResult[0].id, email_sent: true });
}
