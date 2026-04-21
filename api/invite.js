// api/invite.js — Send org invitations
//
// POST { email, role } with admin JWT → creates invitation row +
// sends Supabase invite email with acceptance link.

import { createHmac, timingSafeEqual } from "crypto";

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const APP_URL = process.env.VITE_APP_URL || "https://cambrian-playbook.vercel.app";
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";
const SB_REF = SB_URL ? new URL(SB_URL).hostname.split(".")[0] : "";

function decodeJwt(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    const parts = auth.slice(7).split(".");
    if (parts.length !== 3) return null;
    // Signature verification
    if (JWT_SECRET) {
      const expected = createHmac("sha256", JWT_SECRET).update(parts[0] + "." + parts[1]).digest();
      const actual = Buffer.from(parts[2].replace(/-/g, "+").replace(/_/g, "/"), "base64");
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    }
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    // Expiry check
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    // Issuer check
    if (payload.iss !== "supabase" && !payload.iss?.includes(SB_REF)) return null;
    return payload;
  } catch { return null; }
}

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

  // Verify caller identity
  const payload = decodeJwt(req);
  if (!payload?.sub) return res.status(401).json({ error: "Authentication required" });

  const { email, role } = req.body || {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Valid email required" });
  if (role && !["rep", "manager", "admin"].includes(role)) return res.status(400).json({ error: "Invalid role" });

  // Verify the caller is an admin of their org
  const users = await sbFetch(`users?id=eq.${payload.sub}&select=org_id,role`);
  const caller = users?.[0];
  if (!caller?.org_id) return res.status(403).json({ error: "You must belong to an organization" });
  if (caller.role !== "admin") return res.status(403).json({ error: "Only admins can invite users" });

  // Check if already invited or already a member
  const existingMembers = await sbFetch(`users?org_id=eq.${caller.org_id}&email=eq.${encodeURIComponent(email)}&select=id`);
  if (existingMembers?.length > 0) return res.status(400).json({ error: "This person is already in your organization" });

  // Create invitation record
  const invResult = await sbFetch("invitations", "POST", {
    org_id: caller.org_id,
    email: email.trim().toLowerCase(),
    role: role || "rep",
    invited_by: payload.sub,
  });

  if (invResult?.code || invResult?.message) {
    // Handle duplicate constraint
    if (invResult.code === "23505") return res.status(400).json({ error: "This email already has a pending invitation" });
    return res.status(400).json({ error: invResult.message || "Failed to create invitation" });
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
