// api/_guard.js
//
// Shared request validation + origin check for the Anthropic proxy endpoints
// (api/claude.js + api/claude-stream.js). The underscore prefix prevents
// Vercel from routing this file as an endpoint.
//
// Why this exists: prior to v104 the proxies forwarded req.body verbatim.
// Pen test confirmed an attacker could POST {"model":"claude-opus-4-5",
// "max_tokens":32000, "tools":[...]} and the proxy would forward it to
// Anthropic, billing us. This module allow-lists model, caps max_tokens,
// sanitizes tools, and validates Origin.

const ALLOWED_MODELS = new Set([
  "claude-haiku-4-5-20251001",
  // Sonnet 4.5 is permitted as an automatic fallback target when Haiku
  // returns 529/overloaded_error. The proxy substitutes server-side so
  // a client request specifying Haiku will get Sonnet on overload —
  // see api/claude.js. Clients are NOT expected to request Sonnet
  // directly today, but allowing it keeps the fallback path inside the
  // model allow-list.
  "claude-sonnet-4-5",
  "claude-sonnet-4-5-20250929",
]);

// Server-side fallback: if a request for a primary model returns 529, the
// proxy retries with the mapped fallback model exactly once. Lets us stay
// operational through Anthropic capacity blips on Haiku at the cost of a
// 3x token rate for that single request.
export const MODEL_FALLBACK = {
  "claude-haiku-4-5-20251001": "claude-sonnet-4-5",
};

const ALLOWED_TOOL_TYPES = new Set([
  "web_search_20250305",
]);

// Highest legitimate max_tokens across the app (ICP phase 2 uses 6000).
// Clients that request more get silently capped.
const MAX_TOKENS_CAP = 8000;
// Highest legitimate max_uses across the app: RFP intel needs a few
// searches to cover both private and government sources. ICP phase 1 and
// Brief p5 use 1. Cap bounds per-request search cost.
const MAX_TOOL_USES = 3;

// Origin allow-list. If Origin header is absent (server-to-server, including
// our own test harness at scripts/consistency/) we allow — the real defense
// against server-side abuse is the model/tool allow-list below, not Origin.
function isAllowedOrigin(origin) {
  if (!origin) return true;
  let u;
  try { u = new URL(origin); } catch { return false; }
  const h = u.hostname;
  if (h === "cambrian-playbook.vercel.app") return true;
  if (/^cambrian-playbook-[a-z0-9-]+\.vercel\.app$/.test(h)) return true; // Vercel previews
  if (h === "localhost" || h === "127.0.0.1") return true;                // dev
  return false;
}

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

// Validates the incoming body and returns a sanitized version safe to
// forward to Anthropic. Throws a structured error the handler can return.
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

  // Build a clean outbound body from scratch — do NOT spread req.body, which
  // would let unknown fields (e.g. service_tier, metadata, unrecognized
  // params) pass through.
  const clean = {
    model: body.model,
    max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS_CAP),
    temperature: 0, // hardcoded — app-wide consistency guarantee
    messages: body.messages,
  };
  if (typeof body.system === "string" && body.system.length) clean.system = body.system;
  const tools = sanitizeTools(body.tools);
  if (tools) clean.tools = tools;
  if (stream) clean.stream = true;

  return clean;
}

export function guard(req, res, { stream = false } = {}) {
  if (req.method !== "POST") {
    res.status(405).end();
    return null;
  }
  const origin = req.headers.origin || req.headers.referer || "";
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({ error: "origin not allowed" });
    return null;
  }
  try {
    return buildAnthropicBody(req.body, { stream });
  } catch (e) {
    res.status(e.status || 400).json({ error: e.message || "bad request" });
    return null;
  }
}
