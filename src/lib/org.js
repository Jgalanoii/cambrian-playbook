// src/lib/org.js — Org context loader
//
// Fetches the current user's org membership, role, and org settings.
// Called once on auth, cached in React state. Lightweight — two REST
// calls against Supabase (user row + org row), no heavy dependencies.

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function sbGet(path, token) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(r => r.json());
}

export function sbPatch(path, token, body) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    method: "PATCH",
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  }).then(r => r.json());
}

export function sbRpc(fn, token, params) {
  return fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then(r => r.json());
}

/**
 * Fetch the current user's org context.
 * Returns { id, name, seller_url, icp, products, ..., run_count, run_limit, plan, userRole }
 * or null if user has no org.
 */
export async function fetchOrgContext(userId, token) {
  try {
    // Get user's org_id and role
    const users = await sbGet(`users?id=eq.${userId}&select=org_id,role`, token);
    const user = users?.[0];
    if (!user?.org_id) return null;

    // Get org details
    const orgs = await sbGet(`orgs?id=eq.${user.org_id}&select=*`, token);
    const org = orgs?.[0];
    if (!org) return null;

    return { ...org, userRole: user.role };
  } catch (e) {
    console.warn("[org] Failed to fetch org context:", e.message);
    return null;
  }
}

/**
 * Fetch all members of the current user's org.
 * Returns array of { id, email, name, role }. Admin/manager only (RLS enforced).
 */
export async function fetchOrgMembers(orgId, token) {
  try {
    const members = await sbGet(`users?org_id=eq.${orgId}&select=id,email,name,role&order=role.asc,name.asc`, token);
    return members || [];
  } catch (e) {
    console.warn("[org] Failed to fetch members:", e.message);
    return [];
  }
}

/**
 * Fetch pending invitations for the org.
 */
export async function fetchOrgInvitations(orgId, token) {
  try {
    const invs = await sbGet(`invitations?org_id=eq.${orgId}&accepted_at=is.null&order=created_at.desc`, token);
    return invs || [];
  } catch (e) {
    console.warn("[org] Failed to fetch invitations:", e.message);
    return [];
  }
}
