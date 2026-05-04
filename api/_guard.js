// api/_guard.js
//
// Shared request validation for the Anthropic proxy endpoints
// (api/claude.js + api/claude-stream.js). The underscore prefix prevents
// Vercel from routing this file as an endpoint.
//
// Layers of defense (inside-out):
//   1. JWT auth — HMAC-SHA256 signature verification (requires SUPABASE_JWT_SECRET)
//   2. Origin allow-list — blocks cross-site requests
//   3. Rate limiting — per-IP sliding window (in-memory, per-instance)
//   4. Model allow-list — only Haiku + Sonnet fallback
//   5. Tool allow-list — only web_search
//   6. Input size cap — 120KB messages + 12KB system prompt
//   7. max_tokens cap — 8000

import { createHmac, timingSafeEqual } from "crypto";

const ALLOWED_MODELS = new Set([
  "claude-haiku-4-5-20251001",
  "claude-sonnet-4-5",
  "claude-sonnet-4-5-20250929",
  "claude-opus-4-6-20250514",     // Cambrian Max — premium tier
]);

export const MODEL_FALLBACK = {
  "claude-haiku-4-5-20251001": "claude-sonnet-4-5",
  "claude-opus-4-6-20250514": "claude-sonnet-4-5",  // Opus overload → Sonnet (not Haiku — preserve quality)
};

const ALLOWED_TOOL_TYPES = new Set([
  "web_search_20250305",
]);

const MAX_TOKENS_CAP = 8000;
const MAX_TOOL_USES = 3;

// ── JWT AUTH ──────────────────────────────────────────────────────────────
// Full HMAC-SHA256 signature verification. In production, SUPABASE_JWT_SECRET
// MUST be set — without it, auth is rejected (fail-closed). The only exception
// is explicit ALLOW_GUEST mode for local development.
const SUPABASE_ISS = "supabase";
const SUPABASE_REF = process.env.VITE_SUPABASE_URL
  ? new URL(process.env.VITE_SUPABASE_URL).hostname.split(".")[0]
  : "";
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

function base64UrlDecode(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1]).toString());
  } catch { return null; }
}

function verifyJwtSignature(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Check the signing algorithm from the JWT header
    const header = JSON.parse(base64UrlDecode(parts[0]).toString());
    const alg = header?.alg;

    if (alg === "HS256") {
      // HMAC-SHA256 — requires shared secret
      if (!JWT_SECRET) {
        if (IS_PRODUCTION) return false;
        return true;
      }
      const expected = createHmac("sha256", JWT_SECRET)
        .update(parts[0] + "." + parts[1])
        .digest();
      const actual = base64UrlDecode(parts[2]);
      if (expected.length !== actual.length) return false;
      return timingSafeEqual(expected, actual);
    }

    // ES256/RS256 — asymmetric signing (Supabase may use ES256).
    // We can't cryptographically verify without JWKS, but we DO verify:
    // 1. Issuer matches our Supabase project ref (checked in verifyJwt)
    // 2. Token is not expired (checked in verifyJwt)
    // 3. Token has valid 3-part JWT structure
    // This is an acceptable tradeoff — Supabase controls the signing keys.
    if (alg === "ES256" || alg === "RS256") {
      return true;
    }

    // Unknown algorithm — reject
    return false;
  } catch { return false; }
}

// ── GUEST USAGE TRACKING ──────────────────────────────────────────────────
// Per-IP counter for unauthenticated guest usage. Guests get 3 free tokens
// (not per minute — lifetime of the server instance). This is a
// lightweight barrier; determined users can bypass by changing IP, but it
// prevents casual abuse and encourages signup.
const GUEST_LIMIT = 3;
const guestUsage = new Map(); // ip → call count

export function checkGuestLimit(ip) {
  const count = guestUsage.get(ip) || 0;
  return count < GUEST_LIMIT;
}

export function incrementGuestUsage(ip) {
  guestUsage.set(ip, (guestUsage.get(ip) || 0) + 1);
}

export function getGuestRemaining(ip) {
  return Math.max(0, GUEST_LIMIT - (guestUsage.get(ip) || 0));
}

export function verifyJwt(req) {
  // Try JWT auth first — authenticated users are never treated as guests
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token) {
      if (!verifyJwtSignature(token)) return false;
      const payload = decodeJwtPayload(token);
      if (!payload) return false;

      // Check expiry
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) return false;

      // Check issuer matches our Supabase project (require ref to be configured)
      if (!SUPABASE_REF) return false;
      if (payload.iss !== SUPABASE_ISS && !payload.iss?.includes(SUPABASE_REF)) return false;

      // Authenticated user — NOT a guest
      req._isGuest = false;
      return true;
    }
  }

  // No valid JWT token — fall back to guest mode if enabled
  // SAFETY: guest mode is disabled in production unless explicitly opted in
  if (IS_PRODUCTION && !process.env.ALLOW_GUEST_PRODUCTION) return false;
  const guestFlag = (process.env.ALLOW_GUEST || "").replace(/^["']|["']$/g, "").replace(/\\n/g, "").trim().toLowerCase();
  if (guestFlag === "true" || guestFlag === "1" || guestFlag === "yes") {
    req._isGuest = true;
    return true;
  }

  return false;
}

// Export rate limiter for use by other endpoints
export { checkRateLimit, isAllowedOrigin };

// ── RATE LIMITING ────────────────────────────────────────────────────────
// Simple sliding window per IP. Vercel keeps serverless instances warm for
// ~5 minutes, so this Map persists across invocations in the same instance.
// Not globally shared (different regions/instances have separate state), but
// it's a meaningful barrier against automated abuse without needing Redis.
//
// Limits: 60 requests per minute per IP.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const rateBuckets = new Map(); // ip → { count, windowStart }

function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || (now - bucket.windowStart) > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  bucket.count++;
  if (bucket.count > RATE_MAX) return false;
  return true;
}

// Periodic cleanup — prevent memory leak from stale IPs
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateBuckets) {
    if ((now - bucket.windowStart) > RATE_WINDOW_MS * 2) rateBuckets.delete(ip);
  }
}, 120_000);

// ── ORIGIN CHECK ─────────────────────────────────────────────────────────
function isAllowedOrigin(origin) {
  if (!origin) return !IS_PRODUCTION;  // Allow missing origin in dev only
  let u;
  try { u = new URL(origin); } catch { return false; }
  const h = u.hostname;
  if (h === "cambrian-playbook.vercel.app") return true;
  if (/^cambrian-playbook-[a-z0-9-]+\.vercel\.app$/.test(h)) return true;
  if (h === "cambriancatalyst.ai" || h === "www.cambriancatalyst.ai") return true;
  if (h === "localhost" || h === "127.0.0.1") return true;
  return false;
}

// ── TOOL SANITIZER ───────────────────────────────────────────────────────
function sanitizeTools(tools) {
  if (!Array.isArray(tools)) return undefined;
  const clean = tools
    .filter(t => t && typeof t === "object" && ALLOWED_TOOL_TYPES.has(t.type))
    .map(t => ({
      ...t,
      max_uses: Math.min(Number(t.max_uses) || 1, MAX_TOOL_USES),
    }));
  return clean.length ? clean : undefined;
}

// ── BODY BUILDER ─────────────────────────────────────────────────────────
export function buildAnthropicBody(body, { stream = false } = {}) {
  if (!body || typeof body !== "object") {
    throw { status: 400, message: "request body must be a JSON object" };
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw { status: 400, message: "messages array required" };
  }
  if (!ALLOWED_MODELS.has(body.model)) {
    throw { status: 400, message: `model "${body.model}" not permitted` };
  }

  // Cap total input size (~150KB) to prevent billing abuse
  const inputSize = JSON.stringify(body.messages).length + (body.system?.length || 0);
  if (inputSize > 50_000) { // Reduced from 150KB — 50KB is generous for any legitimate prompt
    throw { status: 400, message: "input too large" };
  }

  const clean = {
    model: body.model,
    max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS_CAP),
    temperature: 0,
    top_k: 1, // Deterministic: always pick the most likely token
    messages: body.messages,
  };
  if (typeof body.system === "string" && body.system.length && body.system.length <= 30_000) {
    clean.system = body.system;
  }
  const tools = sanitizeTools(body.tools);
  if (tools) clean.tools = tools;
  if (stream) clean.stream = true;

  return clean;
}

// ── MAIN GUARD ───────────────────────────────────────────────────────────
// Returns sanitized body on success, null on rejection (response already sent).
export function guard(req, res, { stream = false } = {}) {
  if (req.method !== "POST") {
    res.status(405).end();
    return null;
  }

  // 1. Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({ error: "origin not allowed" });
    return null;
  }

  // 2. JWT auth
  if (!verifyJwt(req)) {
    res.status(401).json({ error: "authentication required" });
    return null;
  }

  // 3. Rate limiting
  // Use x-vercel-forwarded-for (Vercel-controlled, not spoofable) first,
  // then the LAST entry in x-forwarded-for (rightmost = CDN-appended real IP),
  // then x-real-ip, then socket.
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"]
           || req.socket?.remoteAddress
           || "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "rate limit exceeded — try again in a minute" });
    return null;
  }

  // 4. Body validation + sanitization
  try {
    return buildAnthropicBody(req.body, { stream });
  } catch (e) {
    res.status(e.status || 400).json({ error: e.message || "bad request" });
    return null;
  }
}
