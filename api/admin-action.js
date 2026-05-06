// api/admin-action.js
//
// Superuser admin actions: password reset, resend invite, etc.
// POST with admin JWT + action payload.

import { isAllowedOrigin, verifyJwt, decodeJwtPayload } from "./_guard.js";

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL || "itsjoegalano@gmail.com";

async function sbFetch(path, method = "GET", body = null) {
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
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
  if (!SB_KEY) return res.status(500).json({ error: "Not configured" });

  // Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  // Verify JWT
  if (!verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });
  const authToken = (req.headers.authorization || "").slice(7);
  const payload = decodeJwtPayload(authToken);
  if (!payload?.sub) return res.status(401).json({ error: "Authentication required" });

  // Verify superuser
  const userRes = await sbFetch(`users?id=eq.${payload.sub}&select=email`);
  const callerEmail = userRes?.[0]?.email;
  if (callerEmail !== SUPERUSER_EMAIL) return res.status(403).json({ error: "Forbidden" });

  const { action, email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    if (action === "reset_password") {
      // Send password recovery email via Supabase Auth admin API
      const r = await fetch(`${SB_URL}/auth/v1/recover`, {
        method: "POST",
        headers: { apikey: SB_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (r.ok) return res.json({ ok: true, message: `Password reset sent to ${email}` });
      const d = await r.json();
      return res.status(400).json({ error: d.error_description || d.msg || "Failed to send reset" });
    }

    if (action === "resend_invite") {
      // Re-send invite email via Supabase Auth admin invite API
      const r = await fetch(`${SB_URL}/auth/v1/invite`, {
        method: "POST",
        headers: {
          apikey: SB_KEY,
          Authorization: `Bearer ${SB_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (r.ok || r.status === 422) {
        // 422 = user already exists, which is fine for resend
        return res.json({ ok: true, message: `Invite resent to ${email}` });
      }
      const d = await r.json();
      return res.status(400).json({ error: d.error_description || d.msg || "Failed to resend invite" });
    }

    if (action === "delete_user") {
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ error: "userId required" });

      // 1. Delete from public.users table
      await fetch(`${SB_URL}/rest/v1/users?id=eq.${userId}`, {
        method: "DELETE",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      });

      // 2. Delete from Supabase Auth (auth.users)
      const authRes = await fetch(`${SB_URL}/auth/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          apikey: SB_KEY,
          Authorization: `Bearer ${SB_KEY}`,
        },
      });

      if (authRes.ok || authRes.status === 404) {
        console.log(`[admin] Deleted user ${userId} (${email})`);
        return res.json({ ok: true, message: `Deleted ${email}` });
      }
      const d = await authRes.json();
      return res.status(400).json({ error: d.error_description || d.msg || "Failed to delete auth user" });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
