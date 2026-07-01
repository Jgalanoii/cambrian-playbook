// api/_fetch-ssrf.js — SSRF validation for /api/fetch (HANDOFF_06 §2)
//
// All outbound-URL validation lives here so the test suite can import and
// exercise it in isolation with mocked DNS — no network required.
//
// The endpoint calls validateUrl() before making any outbound connection.
// Each helper is exported so the test suite can unit-test ranges directly.

import { promises as dnsPromises } from 'node:dns';

// ── Blocked host list ─────────────────────────────────────────────────────────
// linkedin.com: ToS prohibition + exec names come from the snippet path anyway
// (HANDOFF_05 §2). Expand cautiously — overly broad blocks degrade accuracy.
const BLOCKED_HOSTS = new Set([
  'linkedin.com',
  'www.linkedin.com',
  'lnkd.in',
]);

export function isBlockedHost(hostname) {
  const h = hostname.toLowerCase().replace(/\.+$/, ''); // strip trailing dots
  if (BLOCKED_HOSTS.has(h)) return true;
  // Suffix match: sub.linkedin.com is also blocked
  for (const blocked of BLOCKED_HOSTS) {
    if (h.endsWith('.' + blocked)) return true;
  }
  return false;
}

// ── Private/reserved IPv4 range check ────────────────────────────────────────
// Covers all SSRF-relevant private, loopback, link-local, and reserved ranges.
// Reference: RFC 1918, RFC 3927, RFC 6598, RFC 5771, RFC 919.
export function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return false;
  const [a, b] = parts;

  if (a === 10) return true;                          // 10.0.0.0/8  — RFC 1918 private
  if (a === 172 && b >= 16 && b <= 31) return true;  // 172.16.0.0/12 — RFC 1918 private
  if (a === 192 && b === 168) return true;            // 192.168.0.0/16 — RFC 1918 private
  if (a === 127) return true;                         // 127.0.0.0/8 — loopback (RFC 990)
  if (a === 169 && b === 254) return true;            // 169.254.0.0/16 — link-local + AWS IMDSv1
  if (a === 0) return true;                           // 0.0.0.0/8 — "this" network (RFC 791)
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 — CGNAT (RFC 6598)
  if (a >= 224 && a <= 239) return true;              // 224.0.0.0/4 — multicast (RFC 5771)
  if (a >= 240) return true;                          // 240.0.0.0/4 — reserved + broadcast
  return false;
}

// ── Private/reserved IPv6 range check ────────────────────────────────────────
// Reference: RFC 4291, RFC 4193, RFC 4007.
export function isPrivateIPv6(ip) {
  // Strip URL-form brackets: [::1] → ::1
  const addr = ip.toLowerCase().replace(/^\[|\]$/g, '');

  if (addr === '::1') return true;                      // loopback (RFC 4291)
  if (addr === '::') return true;                       // unspecified
  if (addr.startsWith('fc') || addr.startsWith('fd')) return true; // fc00::/7 unique-local (RFC 4193)
  if (/^fe[89ab]/i.test(addr)) return true;             // fe80::/10 link-local (RFC 4291)
  if (addr.startsWith('ff')) return true;               // ff00::/8 multicast (RFC 4291)
  return false;
}

// Dispatches to the correct checker based on whether the address contains ':'
export function isPrivateIp(ip) {
  return ip.includes(':') ? isPrivateIPv6(ip) : isPrivateIPv4(ip);
}

// ── validateUrl ───────────────────────────────────────────────────────────────
// Full SSRF validation for a single URL. Must pass before any outbound connection.
//
// Arguments:
//   rawUrl    — the URL string to validate
//   dnsLookup — optional override: async (hostname: string) => string[] | null
//               Returns array of resolved IP strings, or null on resolution failure.
//               Pass a mock in tests to avoid real DNS lookups.
//
// Returns:
//   { ok: true,  resolvedIps: string[] }           — safe to connect
//   { ok: false, reason: string, detail?: string }  — blocked; do not connect
export async function validateUrl(rawUrl, { dnsLookup } = {}) {
  // 1. Parse URL — reject malformed strings immediately
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: 'fetch_failed', detail: 'invalid URL' };
  }

  // 2. Scheme allowlist — only http / https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: 'disallowed_scheme' };
  }

  // 3. No userinfo (credentials embedded in URL — strips before we resolve)
  if (parsed.username || parsed.password) {
    return { ok: false, reason: 'disallowed_scheme', detail: 'credentials in URL' };
  }

  const hostname = parsed.hostname;

  // 4. Blocked host list (linkedin.com etc.) — before DNS to avoid unnecessary lookup
  if (isBlockedHost(hostname)) {
    return { ok: false, reason: 'blocked_host' };
  }

  // 5. Reject IP-literal hostnames in private ranges — no DNS lookup needed
  //    Handles: http://127.0.0.1, http://192.168.1.1, http://[::1], etc.
  if (isPrivateIp(hostname)) {
    return { ok: false, reason: 'blocked_private_ip' };
  }

  // 6. DNS-resolve then block if ANY resolved address is private.
  //    This is the DNS-rebinding guard: catches public hostnames that resolve
  //    to private IPs, and non-standard IP notations (octal, hex) that the
  //    URL parser passes through as opaque hostnames.
  const resolve = dnsLookup ?? (async (host) => {
    try {
      const records = await dnsPromises.lookup(host, { all: true });
      return records.map(r => r.address);
    } catch {
      return null; // null → resolution failure
    }
  });

  let addresses;
  try {
    addresses = await resolve(hostname);
  } catch {
    return { ok: false, reason: 'fetch_failed', detail: 'DNS lookup threw' };
  }

  if (!addresses || addresses.length === 0) {
    return { ok: false, reason: 'fetch_failed', detail: 'DNS resolution failed' };
  }

  // Block if ANY resolved IP is in a private/reserved range (all A/AAAA records)
  for (const addr of addresses) {
    if (isPrivateIp(addr)) {
      return { ok: false, reason: 'blocked_private_ip', detail: `resolved to ${addr}` };
    }
  }

  return { ok: true, resolvedIps: addresses };
}
