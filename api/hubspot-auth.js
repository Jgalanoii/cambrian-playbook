// api/hubspot-auth.js
//
// HubSpot OAuth management endpoint.
// POST with JWT + action payload:
//   - start:      returns HubSpot authorization URL
//   - status:     checks if user has valid HubSpot connection
//   - disconnect:  deletes stored tokens

import { isAllowedOrigin, verifyJwt, decodeJwtPayload, checkRateLimit } from "./_guard.js";
import {
  isConfigured, buildAuthUrl, signState,
  getTokenForUser, deleteTokenForUser,
} from "./_hubspot.js";

const APP_URL = process.env.VITE_APP_URL || "https://www.cambriancatalyst.ai";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  // Rate limiting
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Too many requests" });

  // Verify JWT
  if (!await verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });
  const authToken = (req.headers.authorization || "").slice(7);
  const payload = decodeJwtPayload(authToken);
  if (!payload?.sub || !UUID_RE.test(payload.sub)) return res.status(401).json({ error: "Authentication required" });

  const userId = payload.sub;
  const { action } = req.body || {};

  if (!isConfigured()) return res.status(500).json({ error: "HubSpot integration not configured" });

  try {
    // ── START: generate authorization URL ──────────────────────────────
    if (action === "start") {
      const state = signState({ userId, ts: Date.now() });
      const redirectUri = `${APP_URL}/api/hubspot-callback`;
      const url = buildAuthUrl(redirectUri, state);
      return res.json({ url });
    }

    // ── STATUS: check connection ───────────────────────────────────────
    if (action === "status") {
      const tokens = await getTokenForUser(userId);
      if (!tokens) return res.json({ connected: false });
      return res.json({
        connected: true,
        portalId: tokens.portalId,
      });
    }

    // ── DISCONNECT: delete tokens ──────────────────────────────────────
    if (action === "disconnect") {
      await deleteTokenForUser(userId);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (e) {
    console.error("[hubspot-auth] Error:", e.message);
    return res.status(500).json({ error: "Internal error" });
  }
}
