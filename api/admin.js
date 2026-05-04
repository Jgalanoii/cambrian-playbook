// api/admin.js — Superuser analytics dashboard
//
// GET with admin JWT → returns aggregated engagement data across all
// users, orgs, and sessions. Locked to SUPERUSER_EMAIL only.

import { checkRateLimit, isAllowedOrigin, verifyJwt, decodeJwtPayload } from "./_guard.js";

const SB_URL = process.env.VITE_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL || "itsjoegalano@gmail.com";

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

  // Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "origin not allowed" });

  // Rate limiting
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "rate limit exceeded" });
  }

  // Verify JWT and check superuser — uses consolidated JWT from _guard.js
  if (!verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });
  const authToken = (req.headers.authorization || "").slice(7);
  const payload = decodeJwtPayload(authToken);
  if (!payload?.sub) return res.status(401).json({ error: "Authentication required" });

  // Look up the caller's email — must match superuser
  const userRes = await sbFetch(`users?id=eq.${payload.sub}&select=email`);
  const callerEmail = userRes?.[0]?.email;
  if (callerEmail !== SUPERUSER_EMAIL) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    // Audit log — record every admin access
    try {
      await fetch(`${SB_URL}/rest/v1/api_usage_log`, {
        method: "POST",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ user_id: payload.sub, model: "admin-dashboard", input_tokens: 0, output_tokens: 0, web_searches: 0, endpoint: "admin" }),
      });
    } catch {} // Best-effort audit — don't block the response

    // Fetch all data in parallel
    const [users, orgs, sessions, usageLogs] = await Promise.all([
      sbFetch("users?select=id,email,name,role,org_id,created_at&order=created_at.desc"),
      sbFetch("orgs?select=id,name,seller_url,plan,run_count,run_limit,max_run_count,max_run_limit,created_at&order=created_at.desc"),
      sbFetch("sessions?select=id,name,seller_url,user_id,updated_at,created_at,data&order=updated_at.desc&limit=500"),
      sbFetch("api_usage_log?select=user_id,model,input_tokens,output_tokens,web_searches,created_at&order=created_at.desc&limit=5000"),
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
    const guestFlag = (process.env.ALLOW_GUEST || "").replace(/^["']|["']$/g, "").replace(/\\n/g, "").trim().toLowerCase();
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

    // ── Cost tracking from api_usage_log ──
    const PRICING = {
      "claude-haiku-4-5-20251001": { input: 0.80, output: 4.00 },
      "claude-sonnet-4-5": { input: 3.00, output: 15.00 },
      "claude-sonnet-4-5-20250929": { input: 3.00, output: 15.00 },
      "claude-opus-4-6-20250514": { input: 15.00, output: 75.00 },
    };
    const DEFAULT_PRICING = { input: 1.00, output: 5.00 };

    const costByUser = {};
    const costByDay = {};
    const costByModel = {};
    let totalCost = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalWebSearches = 0;
    let totalApiCalls = 0;

    (usageLogs || []).forEach(log => {
      const pricing = PRICING[log.model] || DEFAULT_PRICING;
      const cost = (log.input_tokens * pricing.input + log.output_tokens * pricing.output) / 1_000_000;
      totalCost += cost;
      totalInputTokens += log.input_tokens || 0;
      totalOutputTokens += log.output_tokens || 0;
      totalWebSearches += log.web_searches || 0;
      totalApiCalls++;

      // By user
      const uid = log.user_id || "guest";
      if (!costByUser[uid]) costByUser[uid] = { cost: 0, calls: 0, input: 0, output: 0 };
      costByUser[uid].cost += cost;
      costByUser[uid].calls++;
      costByUser[uid].input += log.input_tokens || 0;
      costByUser[uid].output += log.output_tokens || 0;

      // By day
      const day = log.created_at?.slice(0, 10) || "unknown";
      if (!costByDay[day]) costByDay[day] = { cost: 0, calls: 0 };
      costByDay[day].cost += cost;
      costByDay[day].calls++;

      // By model
      const model = log.model || "unknown";
      if (!costByModel[model]) costByModel[model] = { cost: 0, calls: 0, input: 0, output: 0 };
      costByModel[model].cost += cost;
      costByModel[model].calls++;
      costByModel[model].input += log.input_tokens || 0;
      costByModel[model].output += log.output_tokens || 0;
    });

    const costs = {
      total: { cost: totalCost, api_calls: totalApiCalls, input_tokens: totalInputTokens, output_tokens: totalOutputTokens, web_searches: totalWebSearches },
      by_user: Object.entries(costByUser).map(([uid, d]) => ({
        user_id: uid,
        user_name: userMap[uid]?.name || userMap[uid]?.email || (uid === "guest" ? "Guest" : "Unknown"),
        user_email: userMap[uid]?.email || "",
        ...d,
      })).sort((a, b) => b.cost - a.cost),
      by_day: Object.entries(costByDay).map(([day, d]) => ({ day, ...d })).sort((a, b) => b.day.localeCompare(a.day)),
      by_model: Object.entries(costByModel).map(([model, d]) => ({ model, ...d })).sort((a, b) => b.cost - a.cost),
    };

    // ── Session learnings — aggregate user behavior patterns ──
    const learnings = { icpEdits: {}, dealRoutes: { FAST_TRACK: 0, NURTURE: 0, DISQUALIFY: 0 }, avgConfidence: 0, totalDeals: 0, intelAdjustments: [], topEditedFields: [], avgGateCompletion: 0, sessions_analyzed: 0 };
    let totalConf = 0, totalGates = 0, totalGatesFilled = 0;
    (sessions || []).forEach(s => {
      const d = s.data;
      if (!d) return;
      learnings.sessions_analyzed++;
      // ICP edits — which fields do users correct most?
      (d.icpEdits || []).forEach(e => {
        learnings.icpEdits[e.field] = (learnings.icpEdits[e.field] || 0) + 1;
      });
      // Deal routes
      if (d.postCall?.dealRoute) {
        learnings.dealRoutes[d.postCall.dealRoute] = (learnings.dealRoutes[d.postCall.dealRoute] || 0) + 1;
        learnings.totalDeals++;
      }
      // Intel adjustments — what insider knowledge are users adding?
      Object.entries(d.intelAdjustments || {}).forEach(([co, adj]) => {
        learnings.intelAdjustments.push({ company: co, modifier: adj.modifier, reason: adj.reason, user: userMap[s.user_id]?.name || "Unknown" });
      });
      // Gate completion
      if (d.gateAnswers) {
        const filled = Object.values(d.gateAnswers).filter(Boolean).length;
        const total = 15; // approximate total gates across RIVER
        totalGates += total;
        totalGatesFilled += filled;
      }
    });
    // Top edited ICP fields
    learnings.topEditedFields = Object.entries(learnings.icpEdits).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([field, count]) => ({ field, count }));
    learnings.avgGateCompletion = totalGates > 0 ? Math.round(totalGatesFilled / totalGates * 100) : 0;
    // Fast track rate
    learnings.fastTrackRate = learnings.totalDeals > 0 ? Math.round(learnings.dealRoutes.FAST_TRACK / learnings.totalDeals * 100) : 0;
    learnings.disqualifyRate = learnings.totalDeals > 0 ? Math.round(learnings.dealRoutes.DISQUALIFY / learnings.totalDeals * 100) : 0;

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
      costs,
      learnings,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
