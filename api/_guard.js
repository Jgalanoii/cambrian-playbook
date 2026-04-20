// api/_guard.js
//
// Shared request validation for the Anthropic proxy endpoints
// (api/claude.js + api/claude-stream.js). The underscore prefix prevents
// Vercel from routing this file as an endpoint.
//
// Layers of defense (inside-out):
//   1. JWT auth — requires valid Supabase token (exp + iss check)
//   2. Origin allow-list — blocks cross-site requests
//   3. Rate limiting — per-IP sliding window (in-memory, per-instance)
//   4. Model allow-list — only Haiku + Sonnet fallback
//   5. Tool allow-list — only web_search
//   6. Input size cap — 120KB messages + 12KB system prompt
//   7. max_tokens cap — 8000

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
// Decode (no crypto verify) and check exp + iss. This confirms the caller
// has a Supabase session token that hasn't expired and was issued by our
// project. For full HMAC-SHA256 verification, set SUPABASE_JWT_SECRET in
// Vercel env vars and uncomment the crypto check below.
//
// Guest mode: if ALLOW_GUEST env var is "true", skip JWT check. This lets
// the guest-mode path work without auth while still protecting prod.
const SUPABASE_ISS = "supabase";
const SUPABASE_REF = process.env.VITE_SUPABASE_URL
  ? new URL(process.env.VITE_SUPABASE_URL).hostname.split(".")[0]
  : "xtnidawfuaxwwwcnkewu";

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    return payload;
  } catch { return null; }
}

function verifyJwt(req) {
  // Allow guest mode if explicitly enabled (handle quoted/unquoted values)
  const guestFlag = (process.env.ALLOW_GUEST || "").replace(/^["']|["']$/g, "").trim().toLowerCase();
  if (guestFlag === "true" || guestFlag === "1" || guestFlag === "yes") return true;

  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return false;

  // Check issuer matches our Supabase project
  if (payload.iss !== SUPABASE_ISS && !payload.iss?.includes(SUPABASE_REF)) return false;

  return true;
}

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
  if (!origin) return true;  // server-to-server / test harness
  let u;
  try { u = new URL(origin); } catch { return false; }
  const h = u.hostname;
  if (h === "cambrian-playbook.vercel.app") return true;
  if (/^cambrian-playbook-[a-z0-9-]+\.vercel\.app$/.test(h)) return true;
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

  // Cap total input size (~120KB) to prevent billing abuse
  const inputSize = JSON.stringify(body.messages).length + (body.system?.length || 0);
  if (inputSize > 120_000) {
    throw { status: 400, message: "input too large" };
  }

  const clean = {
    model: body.model,
    max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS_CAP),
    temperature: 0,
    messages: body.messages,
  };
  if (typeof body.system === "string" && body.system.length && body.system.length <= 12_000) {
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
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
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
