// api/_hubspot.js
//
// Shared HubSpot token management for OAuth integration.
// Underscore prefix prevents Vercel from routing as endpoint.
//
// Handles: encryption, token CRUD, auto-refresh, authenticated fetch.
// All tokens are AES-256-GCM encrypted at rest in Supabase.

import { createCipheriv, createDecipheriv, randomBytes, createHmac, timingSafeEqual } from "crypto";

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

const HS_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HS_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const TOKEN_KEY = process.env.HUBSPOT_TOKEN_KEY; // 32 bytes as hex (64 chars)

const HS_AUTH_URL = "https://app.hubspot.com/oauth/authorize";
const HS_TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";
const HS_API_BASE = "https://api.hubapi.com";

// SCOPES MUST EXACTLY MATCH HubSpot Developer App → Auth tab → Required scopes.
// If "scope mismatch" error: compare this list 1:1 with the Auth tab.
//
// HOW TO ADD/REMOVE SCOPES (both sides must match):
// 1. Add/remove in HubSpot App → Auth tab → Required scopes → Save
// 2. Add/remove the same scope here → commit + push
// 3. Users disconnect + reconnect to get the new permissions
//
// Last synced: 2026-05-26 (14 scopes)
const SCOPES = [
  // Core CRM (always needed)
  "oauth",
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.companies.read",
  "crm.objects.companies.write",
  "crm.objects.deals.read",
  "crm.objects.deals.write",
  // Extended (for full data mapping)
  "crm.objects.leads.read",       // push fit-scored accounts as leads
  "crm.objects.leads.write",
  "crm.objects.owners.read",      // assign companies/deals to the rep
  "crm.schemas.companies.read",   // discover custom properties for fit score
  "crm.schemas.deals.read",       // discover deal pipeline stages
  "crm.lists.read",               // create cohort lists from fit scoring
  "crm.lists.write",
].join(" ");

// ── Encryption helpers ─────────────────────────────────────────────────
function getKeyBuffer() {
  if (!TOKEN_KEY || TOKEN_KEY.length !== 64) throw new Error("HUBSPOT_TOKEN_KEY must be 64 hex chars (32 bytes)");
  return Buffer.from(TOKEN_KEY, "hex");
}

export function encrypt(text) {
  const key = getKeyBuffer();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return { encrypted: encrypted + ":" + tag, iv: iv.toString("hex") };
}

export function decrypt(encrypted, ivHex) {
  const key = getKeyBuffer();
  const iv = Buffer.from(ivHex, "hex");
  const parts = encrypted.split(":");
  const encData = parts[0];
  const tag = Buffer.from(parts[1], "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ── HMAC state signing for OAuth CSRF protection ───────────────────────
export function signState(payload) {
  const data = JSON.stringify(payload);
  const sig = createHmac("sha256", HS_CLIENT_SECRET).update(data).digest("hex");
  const encoded = Buffer.from(data).toString("base64url");
  return `${encoded}.${sig}`;
}

export function verifyState(state) {
  const [encoded, sig] = state.split(".");
  if (!encoded || !sig) return null;
  const data = Buffer.from(encoded, "base64url").toString();
  const expected = createHmac("sha256", HS_CLIENT_SECRET).update(data).digest("hex");
  // Timing-safe comparison to prevent HMAC side-channel attacks
  const sigBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  try { return JSON.parse(data); } catch { return null; }
}

// ── Supabase REST helper ───────────────────────────────────────────────
async function sbFetch(path, method = "GET", body = null) {
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    "Content-Type": "application/json",
  };
  if (method === "POST") headers.Prefer = "return=representation";
  if (method === "PATCH") headers.Prefer = "return=minimal";
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ── Token CRUD ─────────────────────────────────────────────────────────
export async function getTokenForUser(userId) {
  const r = await sbFetch(`hubspot_tokens?user_id=eq.${userId}&select=*`);
  const rows = await r.json();
  if (!rows?.length) return null;
  const row = rows[0];
  try {
    return {
      accessToken: decrypt(row.access_token, row.token_iv),
      refreshToken: decrypt(row.refresh_token, row.token_iv),
      expiresAt: new Date(row.expires_at),
      portalId: row.portal_id,
      scopes: row.scopes,
      ownerId: row.owner_id || null,
    };
  } catch {
    return null; // corrupted tokens — treat as disconnected
  }
}

export async function saveTokenForUser(userId, { accessToken, refreshToken, expiresIn, portalId, scopes, ownerId }) {
  const atEnc = encrypt(accessToken);
  // CRITICAL: Use the SAME IV for both tokens so getTokenForUser can decrypt
  // both with the single stored token_iv. Previously rtReenc used a different
  // IV which caused decrypt to fail → getTokenForUser returned null → button
  // never showed.
  const iv = atEnc.iv;
  const ivBuf = Buffer.from(iv, "hex");
  const rtCipher = createCipheriv("aes-256-gcm", Buffer.from(TOKEN_KEY, "hex"), ivBuf);
  let rtEncrypted = rtCipher.update(refreshToken, "utf8", "hex");
  rtEncrypted += rtCipher.final("hex");
  const rtTag = rtCipher.getAuthTag().toString("hex");
  const rtEncStr = rtEncrypted + ":" + rtTag;

  const expiresAt = new Date(Date.now() + (expiresIn || 1800) * 1000).toISOString();

  // Check if row exists
  const existing = await sbFetch(`hubspot_tokens?user_id=eq.${userId}&select=id`);
  const rows = await existing.json();

  if (rows?.length) {
    // Update existing
    await sbFetch(`hubspot_tokens?user_id=eq.${userId}`, "PATCH", {
      access_token: atEnc.encrypted,
      refresh_token: rtEncStr,
      token_iv: iv,
      portal_id: portalId || null,
      scopes: scopes || null,
      expires_at: expiresAt,
      owner_id: ownerId || null,
      updated_at: new Date().toISOString(),
    });
  } else {
    // Insert new
    await sbFetch("hubspot_tokens", "POST", {
      user_id: userId,
      access_token: atEnc.encrypted,
      refresh_token: rtEncStr,
      token_iv: iv,
      portal_id: portalId || null,
      scopes: scopes || null,
      expires_at: expiresAt,
      owner_id: ownerId || null,
    });
  }
}

export async function deleteTokenForUser(userId) {
  await sbFetch(`hubspot_tokens?user_id=eq.${userId}`, "DELETE");
}

// ── Token refresh ──────────────────────────────────────────────────────
export async function refreshAccessToken(userId) {
  const tokens = await getTokenForUser(userId);
  if (!tokens) return null;

  const r = await fetch(HS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: HS_CLIENT_ID,
      client_secret: HS_CLIENT_SECRET,
      refresh_token: tokens.refreshToken,
    }),
  });

  if (!r.ok) {
    const errBody = await r.text().catch(() => "");
    console.error(`[hubspot] Token refresh failed: ${r.status} ${errBody.slice(0, 200)}`);
    // If refresh fails with 400/401, the refresh token is revoked — delete stored tokens
    if (r.status === 400 || r.status === 401) {
      console.warn("[hubspot] Refresh token rejected — deleting stored tokens. User must reconnect.");
      await deleteTokenForUser(userId);
    }
    return null;
  }

  const data = await r.json();
  await saveTokenForUser(userId, {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    portalId: tokens.portalId,
    scopes: tokens.scopes,
  });

  return data.access_token;
}

// ── Authenticated HubSpot fetch ────────────────────────────────────────
// Resolves token, auto-refreshes if near expiry, retries once on 401.
export async function hubspotFetch(userId, path, options = {}) {
  let tokens = await getTokenForUser(userId);
  if (!tokens) return { ok: false, status: 401, error: "not_connected" };

  // Refresh if token expires within 60 seconds
  let accessToken = tokens.accessToken;
  if (tokens.expiresAt.getTime() < Date.now() + 60_000) {
    const refreshed = await refreshAccessToken(userId);
    if (!refreshed) return { ok: false, status: 401, error: "token_expired" };
    accessToken = refreshed;
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const r = await fetch(`${HS_API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Retry once on 401 (token may have been revoked mid-request)
  if (r.status === 401) {
    const refreshed = await refreshAccessToken(userId);
    if (!refreshed) return { ok: false, status: 401, error: "token_expired" };
    const retry = await fetch(`${HS_API_BASE}${path}`, {
      method: options.method || "GET",
      headers: { ...headers, Authorization: `Bearer ${refreshed}` },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    return retry;
  }

  return r;
}

// ── OAuth URL builder ──────────────────────────────────────────────────
export function buildAuthUrl(redirectUri, state) {
  const params = new URLSearchParams({
    client_id: HS_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: SCOPES,
    state,
  });
  return `${HS_AUTH_URL}?${params}`;
}

// ── Exchange auth code for tokens ──────────────────────────────────────
export async function exchangeCodeForTokens(code, redirectUri) {
  const r = await fetch(HS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: HS_CLIENT_ID,
      client_secret: HS_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code,
    }),
  });
  if (!r.ok) return null;
  return r.json();
}

// ── Get portal info from access token ──────────────────────────────────
export async function getPortalInfo(accessToken) {
  const r = await fetch(`${HS_API_BASE}/oauth/v1/access-tokens/${accessToken}`);
  if (!r.ok) return null;
  const data = await r.json();
  return { portalId: String(data.hub_id), scopes: (data.scopes || []).join(",") };
}

// ── Owner lookup — find the HubSpot owner ID for the authenticated user ──
export async function getOwnerByToken(accessToken) {
  // The /crm/v3/owners endpoint returns owners. Use the token's user info
  // to find the matching owner by email.
  try {
    // First get the token's user email
    const tokenInfo = await fetch(`${HS_API_BASE}/oauth/v1/access-tokens/${accessToken}`);
    if (!tokenInfo.ok) return null;
    const info = await tokenInfo.json();
    const userEmail = info.user;
    if (!userEmail) return null;

    // Search owners by email
    const ownersRes = await fetch(`${HS_API_BASE}/crm/v3/owners/?email=${encodeURIComponent(userEmail)}&limit=1`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!ownersRes.ok) return null;
    const owners = await ownersRes.json();
    if (owners.results?.length) {
      const owner = owners.results[0];
      console.log(`[hubspot] Found owner: ${owner.email} → ID ${owner.id}`);
      return { ownerId: String(owner.id), ownerEmail: owner.email, ownerName: `${owner.firstName || ""} ${owner.lastName || ""}`.trim() };
    }
    return null;
  } catch (e) {
    console.warn("[hubspot] Owner lookup failed:", e.message);
    return null;
  }
}

// ── Config check ───────────────────────────────────────────────────────
export function isConfigured() {
  return !!(HS_CLIENT_ID && HS_CLIENT_SECRET && TOKEN_KEY && SB_URL && SB_KEY);
}
