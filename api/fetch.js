// api/fetch.js — server-side rendered page fetch (HANDOFF_06)
//
// PRIMARY exec source: fetches and renders company leadership pages to populate
// verifiedPersons with real current executive names (Step 2 of Amendment G).
//
// Build order:
//   2a (this commit): SSRF defense + security skeleton — all checks in place,
//      fetch stubbed; SSRF suite green before any real outbound connection.
//   2b: two-stage plain-fetch → readability extraction → render escalation
//   2c: leadership-URL resolution + structured name extraction
//   2d: wire registry through all surfaces + post-generation scrub
//
// Contract:
//   POST { url: "https://…/leadership", render: "auto" | "never" | "always" }
//   Success 200: { url, finalUrl, httpStatus, renderUsed, title, text, … }
//   Any failure 200: { ok: false, reason, url } — NEVER a 500 that breaks the brief.
//   The exec engine treats ok:false as "source unavailable" → cascade continues.
//
// Security model: HANDOFF_06 §2. All SSRF validation in api/_fetch-ssrf.js.

import { verifyJwt, isAllowedOrigin } from './_guard.js';
import { validateUrl } from './_fetch-ssrf.js';

// Longer timeout than the default — 2b will use up to 15s budget (4s plain + 12s render)
export const config = { maxDuration: 30 };

// ── Per-IP fetch rate limit ───────────────────────────────────────────────────
// Separate from the AI endpoint rate limit — bounds fetch cost and abuse.
// 20 fetches/min per IP is generous for interactive use but blocks automation.
const FETCH_RATE_WINDOW_MS = 60_000;
const FETCH_RATE_MAX = 20;
const fetchRateBuckets = new Map();

// Periodic cleanup — same pattern as _guard.js
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of fetchRateBuckets) {
    if ((now - bucket.windowStart) > FETCH_RATE_WINDOW_MS * 2) fetchRateBuckets.delete(ip);
  }
}, 120_000);

function checkFetchRateLimit(ip) {
  const now = Date.now();
  const bucket = fetchRateBuckets.get(ip);
  if (!bucket || (now - bucket.windowStart) > FETCH_RATE_WINDOW_MS) {
    fetchRateBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  bucket.count++;
  return bucket.count <= FETCH_RATE_MAX;
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  return req.headers['x-vercel-forwarded-for']?.split(',')[0]?.trim()
      || (xff ? xff.split(',').pop().trim() : '')
      || req.headers['x-real-ip']
      || req.socket?.remoteAddress
      || 'unknown';
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Never throw past this point — all failures produce { ok: false, reason }
  // so the exec engine's cascade can continue without breaking the brief.

  // 1. Method
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, reason: 'fetch_failed' });
  }

  // 2. Origin guard — not a public open-proxy
  const origin = req.headers.origin || req.headers.referer || '';
  if (!isAllowedOrigin(origin)) {
    // Return 403 for origin failures (pre-auth — caller is not our app)
    return res.status(403).json({ ok: false, reason: 'fetch_failed' });
  }

  // 3. JWT auth
  if (!await verifyJwt(req)) {
    return res.status(401).json({ ok: false, reason: 'fetch_failed' });
  }

  // 4. Per-IP fetch rate limit
  const ip = getClientIp(req);
  if (!checkFetchRateLimit(ip)) {
    // Return 200 ok:false so the caller can fall through the cascade gracefully
    return res.status(200).json({ ok: false, reason: 'rate_limited', url: req.body?.url });
  }

  // 5. Input validation
  const { url: rawUrl, render = 'auto' } = req.body || {};
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.length > 2048) {
    return res.status(200).json({ ok: false, reason: 'fetch_failed', url: rawUrl ?? null });
  }
  if (!['auto', 'never', 'always'].includes(render)) {
    return res.status(200).json({ ok: false, reason: 'fetch_failed', url: rawUrl });
  }

  // 6. SSRF validation — must pass before any outbound connection is made.
  //    Validates: scheme allowlist, userinfo, blocked hosts (linkedin),
  //    IP-literal private ranges, DNS-resolved private ranges.
  const ssrfCheck = await validateUrl(rawUrl);
  if (!ssrfCheck.ok) {
    console.warn(`[/api/fetch] SSRF blocked (${ssrfCheck.reason}${ssrfCheck.detail ? ': ' + ssrfCheck.detail : ''}): ${rawUrl}`);
    return res.status(200).json({ ok: false, reason: ssrfCheck.reason, url: rawUrl });
  }

  // ── 2b: two-stage fetch placeholder ───────────────────────────────────────
  // Plain-fetch → readability extraction → render escalation not yet implemented.
  // The exec engine treats ok:false as "source unavailable" → cascade continues.
  // This lets the SSRF suite run green before real fetch logic is wired in (2b).
  console.log(`[/api/fetch] 2a stub — SSRF passed for ${rawUrl} — 2b fetch not yet implemented`);
  return res.status(200).json({ ok: false, reason: 'not_implemented', url: rawUrl });
}
