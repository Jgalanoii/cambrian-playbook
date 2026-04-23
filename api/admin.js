// api/admin.js — Superuser analytics dashboard
//
// GET with admin JWT → returns aggregated engagement data across all
// users, orgs, and sessions. Locked to SUPERUSER_EMAIL only.

import { createHmac, timingSafeEqual } from "crypto";

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";
const SUPERUSER_EMAIL = "itsjoegalano@gmail.com";

function decodeAndVerifyJwt(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    const parts = auth.slice(7).split(".");
    if (parts.length !== 3) return null;
    const header = JSON.parse(Buffer.from(parts[0].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    if (header?.alg === "HS256" && JWT_SECRET) {
      const expected = createHmac("sha256", JWT_SECRET).update(parts[0] + "." + parts[1]).digest();
      const actual = Buffer.from(parts[2].replace(/-/g, "+").replace(/_/g, "/"), "base64");
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    }
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch { return null; }
}

async function sbFetch(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!SB_KEY) return res.status(500).json({ error: "Not configured" });

  // Verify JWT and check superuser
  const payload = decodeAndVerifyJwt(req);
  if (!payload?.sub) return res.status(401).json({ error: "Authentication required" });

  // Look up the caller's email — must match superuser
  const userRes = await sbFetch(`users?id=eq.${payload.sub}&select=email`);
  const callerEmail = userRes?.[0]?.email;
  if (callerEmail !== SUPERUSER_EMAIL) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    // Fetch all data in parallel
    const [users, orgs, sessions] = await Promise.all([
      sbFetch("users?select=id,email,name,role,org_id,created_at&order=created_at.desc"),
      sbFetch("orgs?select=id,name,seller_url,plan,run_count,run_limit,max_run_count,max_run_limit,created_at&order=created_at.desc"),
      sbFetch("sessions?select=id,name,seller_url,user_id,updated_at,created_at,data&order=updated_at.desc&limit=500"),
    ]);

    // Build user activity map
    const now = Date.now();
    const userMap = {};
    (users || []).forEach(u => {
      userMap[u.id] = {
        email: u.email,
        name: u.name,
        role: u.role,
        org_id: u.org_id,
        created_at: u.created_at,
        session_count: 0,
        last_active: null,
        seller_urls: [],
      };
    });

    // Enrich with session data
    let totalMiltonMessages = 0;
    (sessions || []).forEach(s => {
      const miltonCount = Number(s.data?.miltonMsgCount) || 0;
      totalMiltonMessages += miltonCount;
      if (userMap[s.user_id]) {
        userMap[s.user_id].session_count++;
        userMap[s.user_id].milton_messages = (userMap[s.user_id].milton_messages || 0) + miltonCount;
        if (!userMap[s.user_id].last_active || new Date(s.updated_at) > new Date(userMap[s.user_id].last_active)) {
          userMap[s.user_id].last_active = s.updated_at;
        }
        if (s.seller_url && !userMap[s.user_id].seller_urls.includes(s.seller_url)) {
          userMap[s.user_id].seller_urls.push(s.seller_url);
        }
      }
    });

    // Build org map
    const orgMap = {};
    (orgs || []).forEach(o => {
      orgMap[o.id] = {
        name: o.name,
        seller_url: o.seller_url,
        plan: o.plan,
        run_count: o.run_count,
        run_limit: o.run_limit,
        max_run_count: o.max_run_count,
        max_run_limit: o.max_run_limit,
        member_count: 0,
      };
    });

    // Count members per org
    (users || []).forEach(u => {
      if (u.org_id && orgMap[u.org_id]) orgMap[u.org_id].member_count++;
    });

    // Environment status
    const guestFlag = (process.env.ALLOW_GUEST || "").replace(/^["']|["']$/g, "").trim().toLowerCase();
    const envStatus = {
      guest_mode: guestFlag === "true" || guestFlag === "1" || guestFlag === "yes" ? "ENABLED" : "disabled",
      environment: process.env.VERCEL_ENV || "unknown",
      jwt_secret_set: !!process.env.SUPABASE_JWT_SECRET,
      api_key_set: !!process.env.ANTHROPIC_API_KEY,
    };

    // Summary stats
    const activeToday = Object.values(userMap).filter(u => u.last_active && (now - new Date(u.last_active).getTime()) < 86400000).length;
    const activeWeek = Object.values(userMap).filter(u => u.last_active && (now - new Date(u.last_active).getTime()) < 604800000).length;
    const totalRuns = (orgs || []).reduce((sum, o) => sum + (o.run_count || 0), 0);
    const totalMaxRuns = (orgs || []).reduce((sum, o) => sum + (o.max_run_count || 0), 0);

    // Recent activity feed (last 50 sessions with user info)
    const recentActivity = (sessions || []).slice(0, 50).map(s => ({
      session_name: s.name || "Untitled",
      seller_url: s.seller_url || "",
      user_name: userMap[s.user_id]?.name || userMap[s.user_id]?.email || "Unknown",
      user_email: userMap[s.user_id]?.email || "",
      updated_at: s.updated_at,
      created_at: s.created_at,
      milton_messages: Number(s.data?.miltonMsgCount) || 0,
    }));

    // All unique seller URLs being researched
    const allSellerUrls = [...new Set((sessions || []).map(s => s.seller_url).filter(Boolean))];

    res.setHeader("Cache-Control", "private, no-cache");
    res.json({
      summary: {
        total_users: (users || []).length,
        active_today: activeToday,
        active_this_week: activeWeek,
        total_sessions: (sessions || []).length,
        total_runs: totalRuns,
        total_max_runs: totalMaxRuns,
        total_orgs: (orgs || []).length,
        unique_seller_urls: allSellerUrls.length,
        total_milton_messages: totalMiltonMessages,
      },
      environment: envStatus,
      users: Object.entries(userMap).map(([id, u]) => ({
        id,
        ...u,
        org_name: u.org_id && orgMap[u.org_id] ? orgMap[u.org_id].name : null,
        org_plan: u.org_id && orgMap[u.org_id] ? orgMap[u.org_id].plan : null,
      })),
      orgs: Object.entries(orgMap).map(([id, o]) => ({ id, ...o })),
      recent_activity: recentActivity,
      seller_urls: allSellerUrls,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
