// lib/supabase.js — All Supabase interactions
// Canonical source. Imported by App.jsx.

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── TOKEN MANAGEMENT ─────────────────────────────────────────────────────
// Stores access + refresh tokens in sessionStorage. Auto-refreshes
// 2 minutes before expiry to prevent hard logouts.
let _refreshTimer = null;
let _refreshPromise = null; // dedup concurrent refresh calls
let _onTokenRefreshed = null; // callback to update App state

export function sbSetTokenCallback(cb) { _onTokenRefreshed = cb; }

export function sbStoreTokens(data) {
  if (data.access_token) sessionStorage.setItem('sb_token', data.access_token);
  if (data.refresh_token) sessionStorage.setItem('sb_refresh_token', data.refresh_token);
  if (data.expires_in) {
    const expiresAt = Date.now() + (data.expires_in * 1000);
    sessionStorage.setItem('sb_token_expires', String(expiresAt));
    _scheduleRefresh(data.expires_in);
  }
  // Clear legacy localStorage tokens
  localStorage.removeItem('sb_token');
}

function _scheduleRefresh(expiresInSecs) {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  // Refresh 2 minutes before expiry (minimum 10 seconds)
  const refreshIn = Math.max(10, (expiresInSecs - 120)) * 1000;
  _refreshTimer = setTimeout(() => { sbRefreshSession(); }, refreshIn);
}

export async function sbRefreshSession() {
  // Dedup: if a refresh is already in-flight, return the same promise
  if (_refreshPromise) return _refreshPromise;

  const refreshToken = sessionStorage.getItem('sb_refresh_token');
  if (!refreshToken) return null;

  _refreshPromise = (async () => {
    try {
      const r = await fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const d = await r.json();
      if (d.access_token) {
        sbStoreTokens(d);
        if (_onTokenRefreshed) _onTokenRefreshed(d.access_token);
        return d.access_token;
      }
      return null;
    } catch { return null; }
    finally { _refreshPromise = null; }
  })();

  return _refreshPromise;
}

export function sbRestoreSession() {
  const token = sessionStorage.getItem('sb_token') || localStorage.getItem('sb_token');
  if (!token) return null;

  // Check expiry
  const expiresAt = Number(sessionStorage.getItem('sb_token_expires') || 0);
  if (expiresAt && Date.now() > expiresAt) {
    // Token expired — try refresh
    const refreshToken = sessionStorage.getItem('sb_refresh_token');
    if (refreshToken) return { token: null, needsRefresh: true };
    return null;
  }

  // Schedule refresh for remaining time
  if (expiresAt) {
    const remaining = Math.floor((expiresAt - Date.now()) / 1000);
    if (remaining > 0) _scheduleRefresh(remaining);
  }

  // Migrate from localStorage to sessionStorage
  if (localStorage.getItem('sb_token')) {
    sessionStorage.setItem('sb_token', token);
    localStorage.removeItem('sb_token');
  }

  return { token, needsRefresh: false };
}

export function sbClearTokens() {
  sessionStorage.removeItem('sb_token');
  sessionStorage.removeItem('sb_refresh_token');
  sessionStorage.removeItem('sb_token_expires');
  localStorage.removeItem('sb_token');
  if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null; }
}

// ── AUTH & DATA ──────────────────────────────────────────────────────────

export async function sbAuth(path, body) {
  const r = await fetch(SB_URL + '/auth/v1/' + path, {
    method: 'POST',
    headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function sbGetUser(token) {
  const r = await fetch(SB_URL + '/auth/v1/user', {
    headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + token },
  });
  return r.ok ? r.json() : null;
}

export async function sbSessions(method, path, token, body) {
  const r = await fetch(SB_URL + '/rest/v1/' + path, {
    method,
    headers: {
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
