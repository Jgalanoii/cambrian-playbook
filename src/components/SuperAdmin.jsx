// src/components/SuperAdmin.jsx — Superuser engagement dashboard
// Locked to superuser email only. Shows engagement metrics across all users.

import { useState, useEffect } from "react";
import { timeAgo } from "../lib/utils.js";

const SUPERUSER_EMAIL = "itsjoegalano@gmail.com";
const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function SuperAdmin({ sbUser, sbToken, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview"); // overview | users | activity | urls
  const [plans, setPlans] = useState([
    { id: "trial", name: "Trial", tokens: 3, maxTokens: 0, price: 0, costPerToken: 1.16 },
    { id: "starter", name: "Starter", tokens: 25, maxTokens: 5, price: 99, costPerToken: 1.16 },
    { id: "pro", name: "Pro", tokens: 100, maxTokens: 20, price: 349, costPerToken: 1.16 },
    { id: "team", name: "Team", tokens: 250, maxTokens: 50, price: 799, costPerToken: 1.16 },
    { id: "enterprise", name: "Enterprise", tokens: 1000, maxTokens: 200, price: 2500, costPerToken: 1.16 },
  ]);
  const [opusRatio, setOpusRatio] = useState(75);
  const [planSaveMsg, setPlanSaveMsg] = useState("");
  // ── GLOBAL FILTERS ──
  const [dateRange, setDateRange] = useState("all"); // today | 7d | 30d | 90d | all
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // all | authenticated | guest
  const [roleFilter, setRoleFilter] = useState(""); // "" | admin | manager | rep
  const [planFilter, setPlanFilter] = useState(""); // "" | trial | paid | enterprise | suspended
  const [searchQuery, setSearchQuery] = useState("");
  const isSuperuser = sbUser?.email === SUPERUSER_EMAIL;

  const [refreshing, setRefreshing] = useState(false);
  const fetchData = (showSpinner) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    fetch("/api/admin", {
      headers: { Authorization: `Bearer ${sbToken}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else { setData(d); setError(""); }
      })
      .catch(() => setError("Failed to load"))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => {
    if (!isSuperuser) return;
    fetchData(true); // initial load shows spinner
  }, [sbToken]);

  // Superuser check — after all hooks
  if (!isSuperuser) return null;

  if (loading) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 40, fontSize: 14 }}>Loading analytics...</div>
    </div>
  );

  if (error) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 40 }}>
        <div style={{ color: "var(--red)", marginBottom: 12 }}>Error: {error}</div>
        <button onClick={onClose} className="btn btn-secondary">Close</button>
      </div>
    </div>
  );

  if (!data) return null;

  const s = data.summary;
  const c = data.costs?.total || {};
  const l = data.learnings || {};

  // ── Filter helpers ──
  const dateRangeCutoff = () => {
    const now = Date.now();
    if (dateRange === "today") return now - 86400000;
    if (dateRange === "7d") return now - 7 * 86400000;
    if (dateRange === "30d") return now - 30 * 86400000;
    if (dateRange === "90d") return now - 90 * 86400000;
    return 0; // "all"
  };
  const cutoff = dateRangeCutoff();
  const inDateRange = (dateStr) => !dateStr || dateRange === "all" || new Date(dateStr).getTime() >= cutoff;
  const matchesSearch = (u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.org_name || "").toLowerCase().includes(q);
  };

  // Filtered datasets
  const filteredUsers = (data.users || []).filter(u => {
    if (userTypeFilter === "guest") return false; // guests aren't in users table
    if (roleFilter && u.role !== roleFilter) return false;
    if (planFilter && u.org_plan !== planFilter) return false;
    if (!matchesSearch(u)) return false;
    if (dateRange !== "all" && u.last_active && !inDateRange(u.last_active)) return false;
    return true;
  });
  const filteredActivity = (data.recent_activity || []).filter(a => {
    if (!inDateRange(a.updated_at)) return false;
    if (userTypeFilter === "guest") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(a.user_name || "").toLowerCase().includes(q) && !(a.user_email || "").toLowerCase().includes(q) && !(a.session_name || "").toLowerCase().includes(q) && !(a.seller_url || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const filteredCostsByUser = (data.costs?.by_user || []).filter(u => {
    if (userTypeFilter === "guest" && u.user_id !== "guest") return false;
    if (userTypeFilter === "authenticated" && u.user_id === "guest") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(u.user_name || "").toLowerCase().includes(q) && !(u.user_email || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const filteredCostsByDay = (data.costs?.by_day || []).filter(d => {
    if (dateRange === "all") return true;
    return new Date(d.day).getTime() >= cutoff;
  });
  const filteredOrgs = (data.orgs || []).filter(o => {
    if (planFilter && o.plan !== planFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(o.name || "").toLowerCase().includes(q) && !(o.seller_url || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const hasActiveFilters = dateRange !== "all" || userTypeFilter !== "all" || roleFilter || planFilter || searchQuery;

  // Cost calculation based on Opus ratio
  const calcCostPerToken = () => {
    const haikuCost = 0.20; // per brief, Haiku
    const opusCost = 1.48;  // per brief, Opus
    return (opusRatio / 100) * opusCost + ((100 - opusRatio) / 100) * haikuCost;
  };

  const applyPlanToOrg = async (orgId, planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    try {
      await fetch(`${SB_URL}/rest/v1/orgs?id=eq.${orgId}`, {
        method: "PATCH",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ plan: plan.id, run_limit: plan.tokens, max_run_limit: plan.maxTokens }),
      });
      setPlanSaveMsg(`Applied "${plan.name}" to org ${orgId}`);
      setTimeout(() => setPlanSaveMsg(""), 3000);
    } catch { setPlanSaveMsg("Error applying plan"); }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sessions", label: `Sessions (${s.total_sessions})` },
    { id: "users", label: `Users (${s.total_users})` },
    { id: "orgs", label: `Orgs (${s.total_orgs})` },
    { id: "costs", label: `Costs ($${(c.cost||0).toFixed(2)})` },
    { id: "learnings", label: "Learnings" },
    { id: "activity", label: "Activity" },
    { id: "usage", label: "Usage" },
    { id: "pricing", label: "Pricing" },
    { id: "urls", label: `URLs (${s.unique_seller_urls})` },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg-0)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--line-0)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "Lora,serif", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>Admin Dashboard</div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--violet-bg)", color: "var(--violet)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Superuser</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => fetchData(false)} disabled={refreshing} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid var(--line-0)", background: "var(--surface)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--ink-2)" }}>
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button onClick={onClose} style={{ padding: "6px 16px", borderRadius: 8, border: "1.5px solid var(--ink-0)", background: "var(--ink-0)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--surface)" }}>
              ← Back to App
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line-0)", padding: "0 20px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, border: "none", background: "none", cursor: "pointer",
                color: tab === t.id ? "var(--ink-0)" : "var(--ink-3)",
                borderBottom: tab === t.id ? "2px solid var(--tan-0)" : "2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Global filter bar */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--line-0)", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", background: hasActiveFilters ? "var(--amber-bg)" : "var(--bg-1)" }}>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users, orgs, URLs..."
            style={{ flex: "1 1 160px", minWidth: 120, fontSize: 12, padding: "6px 10px", border: "1.5px solid var(--line-0)", borderRadius: 6, background: "var(--surface)" }} />
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            style={{ fontSize: 11, padding: "6px 8px", borderRadius: 6, border: "1.5px solid var(--line-0)", fontWeight: 600, background: "var(--surface)" }}>
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)}
            style={{ fontSize: 11, padding: "6px 8px", borderRadius: 6, border: "1.5px solid var(--line-0)", fontWeight: 600, background: "var(--surface)" }}>
            <option value="all">All users</option>
            <option value="authenticated">Authenticated</option>
            <option value="guest">Guests only</option>
          </select>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            style={{ fontSize: 11, padding: "6px 8px", borderRadius: 6, border: "1.5px solid var(--line-0)", fontWeight: 600, background: "var(--surface)" }}>
            <option value="">Any role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="rep">Rep</option>
          </select>
          <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
            style={{ fontSize: 11, padding: "6px 8px", borderRadius: 6, border: "1.5px solid var(--line-0)", fontWeight: 600, background: "var(--surface)" }}>
            <option value="">Any plan</option>
            <option value="trial">Trial</option>
            <option value="paid">Paid</option>
            <option value="enterprise">Enterprise</option>
            <option value="suspended">Suspended</option>
          </select>
          {hasActiveFilters && (
            <button onClick={() => { setDateRange("all"); setUserTypeFilter("all"); setRoleFilter(""); setPlanFilter(""); setSearchQuery(""); }}
              style={{ fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, border: "1.5px solid var(--amber)", background: "var(--surface)", color: "var(--amber)", cursor: "pointer", whiteSpace: "nowrap" }}>
              Clear filters
            </button>
          )}
          {hasActiveFilters && (
            <span style={{ fontSize: 10, color: "var(--amber)", fontWeight: 600 }}>
              {filteredUsers.length} users · {filteredActivity.length} activities · {filteredOrgs.length} orgs
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>

          {/* ═══ OVERVIEW ═══ */}
          {tab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Total Users", value: s.total_users, color: "var(--navy)" },
                  { label: "Active Today", value: s.active_today, color: "var(--green)" },
                  { label: "Active This Week", value: s.active_this_week, color: "var(--amber)" },
                  { label: "Total Sessions", value: s.total_sessions, color: "var(--ink-0)" },
                ].map(m => (
                  <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Tokens Used", value: s.total_runs, color: "var(--ink-0)" },
                  { label: "Max Tokens", value: s.total_max_runs, color: "var(--violet)" },
                  { label: "Organizations", value: s.total_orgs, color: "var(--navy)" },
                  { label: "Unique Sellers", value: s.unique_seller_urls, color: "var(--green)" },
                  { label: "Milton Messages", value: s.total_milton_messages || 0, color: "var(--red)" },
                  { label: "Guest API Calls", value: s.guest_api_calls || 0, color: "var(--ink-2)" },
                ].map(m => (
                  <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Recent Activity</div>
              {data.recent_activity.slice(0, 15).map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: (Date.now() - new Date(a.updated_at).getTime()) < 86400000 ? "var(--green)" : "var(--line-0)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.session_name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      {a.user_name} · {a.seller_url || "no URL"} · {timeAgo(a.updated_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ SESSIONS ═══ */}
          {tab === "sessions" && (
            <div>
              {/* Session funnel */}
              {data.sessionFunnel && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Pipeline Funnel</div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {[
                      { label: "Sessions", value: data.sessionFunnel.total, color: "var(--ink-0)" },
                      { label: "Built ICP", value: data.sessionFunnel.with_icp, color: "var(--navy)" },
                      { label: "Generated Brief", value: data.sessionFunnel.with_brief, color: "var(--green)" },
                      { label: "Hypothesis", value: data.sessionFunnel.with_hypothesis, color: "var(--amber)" },
                      { label: "Post-Call", value: data.sessionFunnel.with_post_call, color: "var(--violet)" },
                      { label: "Solution Fit", value: data.sessionFunnel.with_solution_fit, color: "var(--red)" },
                    ].map((step, i) => {
                      const pct = data.sessionFunnel.total > 0 ? Math.round(step.value / data.sessionFunnel.total * 100) : 0;
                      return (
                        <div key={i} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ height: 40, background: "var(--bg-2)", borderRadius: 6, position: "relative", overflow: "hidden", marginBottom: 4 }}>
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${pct}%`, background: step.color, borderRadius: 6, opacity: 0.2 }} />
                            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 16, fontWeight: 700, color: step.color, fontFamily: "Lora,serif" }}>{step.value}</div>
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase" }}>{step.label}</div>
                          <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{pct}%</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aggregate stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
                    {[
                      { label: "Companies Scored", value: data.sessionFunnel.total_companies_scored, color: "var(--green)" },
                      { label: "Companies Queued", value: data.sessionFunnel.total_companies_queued, color: "var(--navy)" },
                      { label: "Avg per Session", value: data.sessionFunnel.avg_companies_per_session, color: "var(--ink-0)" },
                      { label: "Fast Track", value: data.sessionFunnel.deal_routes?.fast_track || 0, color: "var(--green)" },
                      { label: "Nurture", value: data.sessionFunnel.deal_routes?.nurture || 0, color: "var(--amber)" },
                      { label: "Disqualify", value: data.sessionFunnel.deal_routes?.disqualify || 0, color: "var(--red)" },
                    ].map(m => (
                      <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Top industries */}
                  {data.sessionFunnel.top_industries?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Top Industries Researched</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {data.sessionFunnel.top_industries.map((ind, i) => (
                          <span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "var(--navy-bg)", color: "var(--navy)", fontWeight: 600 }}>
                            {ind.industry} ({ind.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seller stages */}
                  {data.sessionFunnel.top_seller_stages?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Seller Stages</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {data.sessionFunnel.top_seller_stages.map((st, i) => (
                          <span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "var(--green-bg)", color: "var(--green)", fontWeight: 600 }}>
                            {st.stage} ({st.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* All sessions table */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                All Sessions {hasActiveFilters && <span style={{ fontWeight: 400, color: "var(--amber)" }}>({filteredActivity.length} of {data.recent_activity.length})</span>}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--line-0)", textAlign: "left" }}>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Session</th>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>User</th>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Seller</th>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Depth</th>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Accounts</th>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Route</th>
                      <th style={{ padding: "6px", fontSize: 9, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivity.map((a, i) => {
                      const depthDots = [a.hasICP, a.hasBrief, a.hasHypo, a.hasPostCall, a.hasSolutionFit];
                      const depthLabels = ["ICP", "Brief", "Hypo", "Post", "SA"];
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--line-0)" }}>
                          <td style={{ padding: "8px 6px" }}>
                            <div style={{ fontWeight: 600, color: "var(--ink-0)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.session_name}</div>
                            {a.selected_account && <div style={{ fontSize: 10, color: "var(--ink-3)" }}>Target: {a.selected_account}</div>}
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <div style={{ fontWeight: 600, color: "var(--ink-0)" }}>{a.user_name?.split(" ")[0] || "—"}</div>
                            <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{a.user_role}</div>
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <div style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--ink-1)" }}>{a.seller_url || "—"}</div>
                            {a.products_count > 0 && <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{a.products_count} products · {a.docs_count} docs</div>}
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <div style={{ display: "flex", gap: 2 }}>
                              {depthDots.map((filled, j) => (
                                <span key={j} title={depthLabels[j]} style={{
                                  width: 14, height: 14, borderRadius: 3, fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                  background: filled ? "var(--green)" : "var(--bg-2)", color: filled ? "var(--surface)" : "var(--ink-3)"
                                }}>{depthLabels[j][0]}</span>
                              ))}
                            </div>
                            {a.gates_filled > 0 && <div style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 2 }}>{a.gates_filled}G {a.discovery_filled}D</div>}
                          </td>
                          <td style={{ padding: "8px 6px", textAlign: "center" }}>
                            <div style={{ fontWeight: 700, color: "var(--ink-0)" }}>{a.companies_scored > 0 ? a.companies_scored : "—"}</div>
                            {a.companies_queued > 0 && <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{a.companies_queued} queued</div>}
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            {a.deal_route ? (
                              <span style={{
                                fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10,
                                background: a.deal_route === "FAST_TRACK" ? "var(--green-bg)" : a.deal_route === "NURTURE" ? "var(--amber-bg)" : "var(--red-bg)",
                                color: a.deal_route === "FAST_TRACK" ? "var(--green)" : a.deal_route === "NURTURE" ? "var(--amber)" : "var(--red)",
                              }}>{a.deal_route.replace("_", " ")}</span>
                            ) : <span style={{ fontSize: 10, color: "var(--ink-3)" }}>—</span>}
                            {a.deal_value && <div style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 2 }}>${Number(a.deal_value).toLocaleString()}</div>}
                          </td>
                          <td style={{ padding: "8px 6px", fontSize: 10, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                            {timeAgo(a.updated_at)}
                            {a.milton_messages > 0 && <div style={{ fontSize: 9, color: "var(--red)" }}>{a.milton_messages} Milton</div>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredActivity.length === 0 && <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: 20 }}>No sessions match the current filters.</div>}
            </div>
          )}

          {/* ═══ PRICING ═══ */}
          {tab === "pricing" && (
            <div>
              {/* Opus ratio slider */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-0)" }}>Opus Usage Ratio</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--violet)" }}>{opusRatio}% Opus / {100 - opusRatio}% Haiku</div>
                </div>
                <input type="range" min={0} max={100} step={5} value={opusRatio}
                  onChange={e => { const v = Number(e.target.value); setOpusRatio(v); setPlans(p => p.map(pl => ({ ...pl, costPerToken: (v / 100) * 1.48 + ((100 - v) / 100) * 0.20 }))); }}
                  style={{ width: "100%", accentColor: "var(--violet)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-3)" }}>
                  <span>100% Haiku ($0.20/brief)</span>
                  <span>Blended: ${calcCostPerToken().toFixed(2)}/brief</span>
                  <span>100% Opus ($1.48/brief)</span>
                </div>
              </div>

              {/* Plan configuration table */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Plan Configuration</div>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 16 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--line-0)", textAlign: "left" }}>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Plan</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Tokens/mo</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Max Tokens</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Price/mo</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Your Cost</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, i) => {
                    const cost = plan.tokens * plan.costPerToken;
                    const margin = plan.price > 0 ? Math.round((1 - cost / plan.price) * 100) : -100;
                    return (
                      <tr key={plan.id} style={{ borderBottom: "1px solid var(--line-0)" }}>
                        <td style={{ padding: "8px 6px", fontWeight: 600 }}>
                          <input value={plan.name} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, name: e.target.value } : pl))}
                            style={{ border: "none", background: "transparent", fontWeight: 600, fontSize: 13, width: 100, outline: "none" }} />
                        </td>
                        <td style={{ padding: "8px 6px" }}>
                          <input type="number" value={plan.tokens} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, tokens: Number(e.target.value) } : pl))}
                            style={{ width: 60, border: "1px solid var(--line-0)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
                        </td>
                        <td style={{ padding: "8px 6px" }}>
                          <input type="number" value={plan.maxTokens} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, maxTokens: Number(e.target.value) } : pl))}
                            style={{ width: 60, border: "1px solid var(--line-0)", borderRadius: 4, padding: "3px 6px", fontSize: 12, color: "var(--violet)" }} />
                        </td>
                        <td style={{ padding: "8px 6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>$</span>
                            <input type="number" value={plan.price} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, price: Number(e.target.value) } : pl))}
                              style={{ width: 70, border: "1px solid var(--line-0)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
                          </div>
                        </td>
                        <td style={{ padding: "8px 6px", fontWeight: 600, color: "var(--ink-1)" }}>
                          ${cost.toFixed(0)}
                        </td>
                        <td style={{ padding: "8px 6px" }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: margin > 70 ? "var(--green)" : margin > 50 ? "var(--amber)" : margin > 0 ? "var(--red)" : "var(--red)" }}>
                            {plan.price > 0 ? `${margin}%` : "Free"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button onClick={() => setPlans(p => [...p, { id: `custom-${Date.now()}`, name: "Custom", tokens: 50, maxTokens: 10, price: 199, costPerToken: calcCostPerToken() }])}
                style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 8, border: "1.5px solid var(--line-0)", background: "var(--surface)", cursor: "pointer", color: "var(--ink-2)" }}>
                + Add Plan
              </button>

              {/* Margin visualization */}
              <div style={{ marginTop: 20, fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Margin by Plan</div>
              {plans.filter(p => p.price > 0).map(plan => {
                const cost = plan.tokens * plan.costPerToken;
                const margin = Math.round((1 - cost / plan.price) * 100);
                return (
                  <div key={plan.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line-0)" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-0)", width: 80 }}>{plan.name}</div>
                    <div style={{ flex: 1, height: 10, borderRadius: 5, background: "var(--bg-2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 5, background: margin > 70 ? "var(--green)" : margin > 50 ? "var(--amber)" : "var(--red)", width: Math.max(0, margin) + "%" }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, width: 40, textAlign: "right", color: margin > 70 ? "var(--green)" : margin > 50 ? "var(--amber)" : "var(--red)" }}>{margin}%</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", width: 100, textAlign: "right" }}>${plan.price} - ${cost.toFixed(0)} = ${(plan.price - cost).toFixed(0)}</div>
                  </div>
                );
              })}

              {/* Apply plan to org */}
              <div style={{ marginTop: 20, fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Apply Plan to Organization</div>
              {data.orgs.map(o => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{o.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      Current: {o.plan} · {o.run_count}/{o.run_limit} tokens · {o.max_run_count}/{o.max_run_limit} max
                    </div>
                  </div>
                  <select defaultValue={o.plan}
                    onChange={e => applyPlanToOrg(o.id, e.target.value)}
                    style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: "1.5px solid var(--line-0)" }}>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.tokens} tokens, ${p.price}/mo)</option>)}
                  </select>
                </div>
              ))}
              {planSaveMsg && <div style={{ marginTop: 8, fontSize: 12, color: "var(--green)", fontWeight: 600 }}>{planSaveMsg}</div>}

              {/* Revenue projections */}
              <div style={{ marginTop: 20, fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Revenue Projections</div>
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                  {[10, 25, 50, 100].map(users => {
                    const avgPrice = plans.filter(p => p.price > 0).reduce((s, p) => s + p.price, 0) / plans.filter(p => p.price > 0).length;
                    const avgCost = plans.filter(p => p.price > 0).reduce((s, p) => s + p.tokens * p.costPerToken, 0) / plans.filter(p => p.price > 0).length;
                    const mrr = Math.round(users * avgPrice * 0.6); // assume 60% on avg paid plan
                    const cost = Math.round(users * avgCost * 0.6);
                    return (
                      <div key={users} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 4 }}>{users} users</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", fontFamily: "Lora,serif" }}>${(mrr / 1000).toFixed(1)}K</div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)" }}>MRR</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-1)", marginTop: 4 }}>${((mrr - cost) / 1000).toFixed(1)}K gross</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ LEARNINGS ═══ */}
          {tab === "learnings" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Sessions Analyzed", value: l.sessions_analyzed || 0, color: "var(--ink-0)" },
                  { label: "Fast Track Rate", value: `${l.fastTrackRate || 0}%`, color: "var(--green)" },
                  { label: "Disqualify Rate", value: `${l.disqualifyRate || 0}%`, color: "var(--red)" },
                  { label: "Avg Gate Completion", value: `${l.avgGateCompletion || 0}%`, color: "var(--navy)" },
                ].map(m => (
                  <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Top edited ICP fields — what the AI gets wrong */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                Most Corrected ICP Fields
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Fields users edit most often — signals where AI output needs improvement</span>
              </div>
              {(l.topEditedFields || []).length > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  {(l.topEditedFields || []).map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line-0)" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-0)", flex: 1 }}>{f.field}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ height: 6, borderRadius: 3, background: "var(--amber)", width: Math.min(200, f.count * 20) }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)" }}>{f.count}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 20 }}>No ICP edits recorded yet.</div>
              )}

              {/* Deal routing distribution */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Deal Routing Distribution</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Fast Track", count: l.dealRoutes?.FAST_TRACK || 0, color: "var(--green)", bg: "var(--green-bg)" },
                  { label: "Nurture", count: l.dealRoutes?.NURTURE || 0, color: "var(--amber)", bg: "var(--amber-bg)" },
                  { label: "Disqualify", count: l.dealRoutes?.DISQUALIFY || 0, color: "var(--red)", bg: "var(--red-bg)" },
                ].map(r => (
                  <div key={r.label} style={{ flex: 1, background: r.bg, borderRadius: 10, padding: "12px 14px", textAlign: "center", border: `1px solid ${r.color}33` }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: r.color, fontFamily: "Lora,serif" }}>{r.count}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: r.color }}>{r.label}</div>
                  </div>
                ))}
              </div>

              {/* Intel adjustments — what insider knowledge users are adding */}
              {(l.intelAdjustments || []).length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Intel Adjustments
                    <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Insider knowledge users are adding to fit scores</span>
                  </div>
                  {(l.intelAdjustments || []).slice(0, 20).map((adj, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--line-0)", fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--ink-0)", minWidth: 120 }}>{adj.company}</span>
                      <span style={{ fontWeight: 700, color: adj.modifier > 0 ? "var(--green)" : "var(--red)", minWidth: 40 }}>{adj.modifier > 0 ? "+" : ""}{adj.modifier}</span>
                      <span style={{ color: "var(--ink-3)", flex: 1 }}>{adj.reason || "—"}</span>
                      <span style={{ color: "var(--ink-3)", fontSize: 10 }}>{adj.user}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ COSTS ═══ */}
          {tab === "costs" && data.costs && (
            <div>
              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Total Cost", value: `$${c.cost?.toFixed(2)}`, color: "var(--ink-0)" },
                  { label: "API Calls", value: c.api_calls?.toLocaleString(), color: "var(--navy)" },
                  { label: "Input Tokens", value: `${(c.input_tokens / 1000).toFixed(0)}K`, color: "var(--green)" },
                  { label: "Output Tokens", value: `${(c.output_tokens / 1000).toFixed(0)}K`, color: "var(--amber)" },
                  { label: "Web Searches", value: c.web_searches, color: "var(--violet)" },
                ].map(m => (
                  <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Cost by user */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Cost by User</div>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 20 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--line-0)", textAlign: "left" }}>
                    <th style={{ padding: "6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>User</th>
                    <th style={{ padding: "6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Cost</th>
                    <th style={{ padding: "6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Calls</th>
                    <th style={{ padding: "6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Input</th>
                    <th style={{ padding: "6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Output</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCostsByUser.map((u, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--line-0)" }}>
                      <td style={{ padding: "6px" }}>
                        <div style={{ fontWeight: 600 }}>{u.user_name}</div>
                        {u.user_email && <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{u.user_email}</div>}
                      </td>
                      <td style={{ padding: "6px", fontWeight: 700, color: "var(--ink-0)" }}>${u.cost.toFixed(3)}</td>
                      <td style={{ padding: "6px" }}>{u.calls}</td>
                      <td style={{ padding: "6px", fontSize: 11, color: "var(--ink-3)" }}>{(u.input / 1000).toFixed(1)}K</td>
                      <td style={{ padding: "6px", fontSize: 11, color: "var(--ink-3)" }}>{(u.output / 1000).toFixed(1)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cost by model */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Cost by Model</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {(data.costs.by_model || []).map((m, i) => (
                  <div key={i} style={{ background: "var(--bg-1)", borderRadius: 8, padding: "10px 14px", minWidth: 180 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-0)", marginBottom: 4 }}>{m.model}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.model.includes("opus") ? "var(--violet)" : "var(--green)", fontFamily: "Lora,serif" }}>${m.cost.toFixed(3)}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{m.calls} calls · {(m.input / 1000).toFixed(0)}K in · {(m.output / 1000).toFixed(0)}K out</div>
                  </div>
                ))}
              </div>

              {/* Cost by day */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Daily Cost</div>
              {filteredCostsByDay.slice(0, 30).map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <div style={{ fontSize: 12, color: "var(--ink-1)", width: 90, fontWeight: 600 }}>{d.day}</div>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "var(--green)", width: Math.min(100, c.cost > 0 ? (d.cost / c.cost * 100 * (data.costs.by_day || []).length) : 0) + "%" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, width: 60, textAlign: "right" }}>${d.cost.toFixed(3)}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-3)", width: 50, textAlign: "right" }}>{d.calls} calls</div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ USERS ═══ */}
          {tab === "users" && (
            <div>
              {/* Quick actions bar */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                  {hasActiveFilters ? `${filteredUsers.length} of ${data.users.length}` : data.users.length} users · {filteredOrgs.length} orgs
                </div>
              </div>
              {planSaveMsg && <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginBottom: 10, padding: "6px 12px", background: "var(--green-bg)", borderRadius: 8 }}>✓ {planSaveMsg}</div>}

              {/* Invite to specific org */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", whiteSpace: "nowrap" }}>Invite →</span>
                  <input id="sa-invite-email" placeholder="email@company.com" type="email"
                    style={{ flex: "1 1 160px", fontSize: 12, padding: "6px 10px", border: "1.5px solid var(--line-0)", borderRadius: 6 }}
                    onKeyDown={e => e.stopPropagation()} />
                  <select id="sa-invite-org" defaultValue=""
                    style={{ fontSize: 11, padding: "6px 8px", border: "1.5px solid var(--line-0)", borderRadius: 6 }}>
                    <option value="" disabled>Org...</option>
                    {data.orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select id="sa-invite-role" defaultValue="rep"
                    style={{ fontSize: 11, padding: "6px 8px", border: "1.5px solid var(--line-0)", borderRadius: 6 }}>
                    <option value="rep">Rep</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={async () => {
                    const email = document.getElementById("sa-invite-email")?.value?.trim();
                    const orgId = document.getElementById("sa-invite-org")?.value;
                    const role = document.getElementById("sa-invite-role")?.value || "rep";
                    if (!email || !orgId) { setPlanSaveMsg("Email and org required"); setTimeout(() => setPlanSaveMsg(""), 3000); return; }
                    try {
                      const r = await fetch("/api/invite", {
                        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                        body: JSON.stringify({ email, role, orgId }),
                      });
                      const d = await r.json();
                      setPlanSaveMsg(d.ok ? `Invited ${email} to org` : `Error: ${d.error}`);
                      if (d.ok) document.getElementById("sa-invite-email").value = "";
                    } catch { setPlanSaveMsg("Failed to invite"); }
                    setTimeout(() => setPlanSaveMsg(""), 4000);
                  }}
                    style={{ padding: "6px 14px", borderRadius: 6, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    Send Invite
                  </button>
                </div>
              </div>

              {/* User cards */}
              {filteredUsers.sort((a, b) => (b.session_count || 0) - (a.session_count || 0)).map(u => {
                const org = data.orgs.find(o => o.id === u.org_id);
                const rc = u.role === "admin" ? "var(--navy)" : u.role === "manager" ? "var(--amber)" : "var(--green)";
                const rb = u.role === "admin" ? "var(--navy-bg)" : u.role === "manager" ? "var(--amber-bg)" : "var(--green-bg)";
                const adminAction = async (action, extra = {}) => {
                  try {
                    const r = await fetch("/api/admin-action", {
                      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                      body: JSON.stringify({ action, email: u.email, userId: u.id, ...extra }),
                    });
                    const d = await r.json();
                    setPlanSaveMsg(d.ok ? d.message || `${action} done` : `Error: ${d.error}`);
                  } catch { setPlanSaveMsg(`Failed: ${action}`); }
                  setTimeout(() => setPlanSaveMsg(""), 4000);
                };
                const patchUser = async (fields, msg) => {
                  await fetch(`${SB_URL}/rest/v1/users?id=eq.${u.id}`, {
                    method: "PATCH", headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
                    body: JSON.stringify(fields),
                  });
                  setPlanSaveMsg(msg); setTimeout(() => setPlanSaveMsg(""), 3000);
                };
                return (
                  <div key={u.id} style={{ border: "1px solid var(--line-0)", borderRadius: 10, marginBottom: 8, background: u.email === SUPERUSER_EMAIL ? "var(--bg-1)" : "var(--surface)", overflow: "hidden" }}>
                    {/* Header row — always visible */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: rc, color: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "Lora,serif", flexShrink: 0 }}>
                        {(u.name || u.email || "").split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "··"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-0)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          {u.name || u.email?.split("@")[0]}
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: rb, color: rc }}>{u.role}</span>
                          {u.email === SUPERUSER_EMAIL && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "var(--violet-bg)", color: "var(--violet)" }}>SUPER</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{u.email}</div>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--ink-3)", textAlign: "right", flexShrink: 0 }}>
                        <div>{u.session_count} sessions</div>
                        <div>Active {timeAgo(u.last_active)}</div>
                      </div>
                    </div>

                    {/* Management panel — user-level only (org settings live in Orgs tab) */}
                    <div style={{ borderTop: "1px solid var(--line-0)", padding: "10px 14px", background: "var(--bg-1)" }}>
                      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 120px" }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Role</label>
                          <select value={u.role || "rep"} onChange={e => { patchUser({ role: e.target.value }, `✓ ${u.email} → ${e.target.value}`); setTimeout(fetchData, 500); }}
                            style={{ width: "100%", fontSize: 12, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--line-0)", background: rb, color: rc, fontWeight: 700 }}>
                            <option value="rep">Rep</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div style={{ flex: "1 1 180px" }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Organization</label>
                          <select value={u.org_id || ""} onChange={e => { patchUser({ org_id: e.target.value || null }, `✓ ${u.email} → ${e.target.value ? data.orgs.find(o => o.id === e.target.value)?.name : "no org"}`); setTimeout(fetchData, 500); }}
                            style={{ width: "100%", fontSize: 12, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--line-0)" }}>
                            <option value="">No org</option>
                            {data.orgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.plan})</option>)}
                          </select>
                        </div>
                        <div style={{ flex: "1 1 140px" }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Display Name</label>
                          <input defaultValue={u.name || ""} placeholder="Full name"
                            onBlur={e => { const v = e.target.value.trim(); if (v !== (u.name || "")) patchUser({ name: v }, `✓ Name → ${v}`); }}
                            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                            style={{ width: "100%", fontSize: 12, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--line-0)", boxSizing: "border-box" }} />
                        </div>
                      </div>

                      {/* Org summary (read-only — manage in Orgs tab) */}
                      {org && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "var(--ink-2)", marginBottom: 10, padding: "6px 10px", background: "var(--surface)", borderRadius: 6, flexWrap: "wrap" }}>
                          <strong>{org.name}</strong>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20,
                            background: ["paid","starter","pro","team","enterprise"].includes(org.plan) ? "var(--green-bg)" : org.plan === "suspended" ? "var(--red-bg)" : "var(--amber-bg)",
                            color: ["paid","starter","pro","team","enterprise"].includes(org.plan) ? "var(--green)" : org.plan === "suspended" ? "var(--red)" : "var(--amber)" }}>{org.plan}</span>
                          <span>{org.run_count}/{org.run_limit} runs</span>
                          {(org.max_run_limit||0)>0 && <span style={{color:"var(--violet)"}}>{org.max_run_count||0}/{org.max_run_limit} max</span>}
                          <button onClick={()=>setTab("orgs")} style={{marginLeft:"auto",fontSize:10,color:"var(--tan-0)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Manage org →</button>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button onClick={() => adminAction("reset_password")}
                          style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--line-0)", background: "var(--surface)", color: "var(--ink-1)", cursor: "pointer", fontWeight: 600 }}>
                          Send Password Reset
                        </button>
                        <button onClick={() => adminAction("resend_invite")}
                          style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--line-0)", background: "var(--surface)", color: "var(--ink-1)", cursor: "pointer", fontWeight: 600 }}>
                          Resend Invite Email
                        </button>
                        {u.email !== SUPERUSER_EMAIL && <button onClick={async () => {
                            if (!window.confirm(`Delete ${u.email}? This removes their auth account AND user record. They'll need to sign up again from scratch.`)) return;
                            try {
                              const r = await fetch("/api/admin-action", {
                                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                                body: JSON.stringify({ action: "delete_user", userId: u.id, email: u.email }),
                              });
                              const d = await r.json();
                              setPlanSaveMsg(d.ok ? `Deleted ${u.email}` : `Error: ${d.error}`);
                              if (d.ok) setTimeout(fetchData, 1500);
                            } catch { setPlanSaveMsg("Failed to delete user"); }
                            setTimeout(() => setPlanSaveMsg(""), 4000);
                          }}
                            style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, border: "1px solid var(--red)", background: "var(--red-bg)", color: "var(--red)", cursor: "pointer", fontWeight: 600 }}
                            title="Delete user account completely">
                            Delete
                          </button>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ ORGS ═══ */}
          {tab === "orgs" && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>
                All Organizations {hasActiveFilters && <span style={{ fontWeight: 400, color: "var(--amber)" }}>({filteredOrgs.length} of {data.orgs.length})</span>}
              </div>

              {filteredOrgs.sort((a, b) => (b.run_count || 0) - (a.run_count || 0)).map(o => {
                const members = data.users.filter(u => u.org_id === o.id);
                const nonMembers = data.users.filter(u => u.org_id !== o.id);
                const patchOrg = async (fields, msg) => {
                  await fetch(`${SB_URL}/rest/v1/orgs?id=eq.${o.id}`, {
                    method: "PATCH", headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
                    body: JSON.stringify(fields),
                  });
                  setPlanSaveMsg(`✓ ${msg}`); setTimeout(() => setPlanSaveMsg(""), 3000);
                };
                const moveUser = async (userId, userName) => {
                  await fetch(`${SB_URL}/rest/v1/users?id=eq.${userId}`, {
                    method: "PATCH", headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
                    body: JSON.stringify({ org_id: o.id }),
                  });
                  setPlanSaveMsg(`✓ ${userName} added to ${o.name}`); setTimeout(() => setPlanSaveMsg(""), 3000);
                  setTimeout(fetchData, 500);
                };
                const removeUser = async (userId, userName) => {
                  await fetch(`${SB_URL}/rest/v1/users?id=eq.${userId}`, {
                    method: "PATCH", headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}`, "Content-Type": "application/json", Prefer: "return=minimal" },
                    body: JSON.stringify({ org_id: null }),
                  });
                  setPlanSaveMsg(`✓ ${userName} removed from ${o.name}`); setTimeout(() => setPlanSaveMsg(""), 3000);
                  setTimeout(fetchData, 500);
                };
                const isPaid = ["paid","starter","pro","team","enterprise"].includes(o.plan);
                return (
                  <div key={o.id} style={{ border: "1.5px solid var(--line-0)", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
                    {/* ── Header ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "var(--surface)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--tan-0)", color: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: "Lora,serif", flexShrink: 0 }}>
                        {(o.name || "O").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-0)" }}>{o.name}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{o.seller_url || "No company website set"}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: isPaid ? "var(--green-bg)" : o.plan === "suspended" ? "var(--red-bg)" : "var(--amber-bg)",
                          color: isPaid ? "var(--green)" : o.plan === "suspended" ? "var(--red)" : "var(--amber)" }}>{o.plan}</span>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-0)", marginTop: 4 }}>{o.run_count} / {o.run_limit} runs</div>
                      </div>
                    </div>

                    {/* ── Settings ── */}
                    <div style={{ borderTop: "1px solid var(--line-0)", padding: "14px 16px", background: "var(--bg-1)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Org Settings</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Company Name</label>
                          <input defaultValue={o.name} onBlur={e => { const v = e.target.value.trim(); if (v && v !== o.name) patchOrg({ name: v }, `Renamed to ${v}`); }}
                            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                            style={{ width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1.5px solid var(--line-0)", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Plan & Limits</label>
                          <select defaultValue={o.plan} onChange={e => {
                            const plan = e.target.value;
                            const limits = { trial: { run_limit: 3, max_run_limit: 0 }, starter: { run_limit: 25, max_run_limit: 5 }, pro: { run_limit: 100, max_run_limit: 20 }, team: { run_limit: 250, max_run_limit: 50 }, enterprise: { run_limit: 1000, max_run_limit: 200 } };
                            patchOrg({ plan, ...(limits[plan] || {}) }, `${o.name} → ${plan}${limits[plan]?.run_limit ? ` (${limits[plan].run_limit} runs)` : ""}`);
                          }}
                            style={{ width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1.5px solid var(--line-0)", fontWeight: 600 }}>
                            <option value="trial">Trial — 3 runs/mo</option>
                            <option value="starter">Starter — 25 runs/mo ($99)</option>
                            <option value="pro">Pro — 100 runs/mo ($349)</option>
                            <option value="team">Team — 250 runs/mo ($799)</option>
                            <option value="enterprise">Enterprise — 1,000 runs/mo ($2,500)</option>
                            <option value="paid">Paid — custom limits</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Company Website</label>
                          <input defaultValue={o.seller_url || ""} placeholder="https://company.com" onBlur={e => { const v = e.target.value.trim(); if (v !== (o.seller_url || "")) patchOrg({ seller_url: v || null }, `Website → ${v || "cleared"}`); }}
                            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                            style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 8, border: "1.5px solid var(--line-0)", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", display: "block", marginBottom: 2 }}>Run Limit (override)</label>
                          <input type="number" defaultValue={o.run_limit} onBlur={e => { const v = Number(e.target.value); if (v !== o.run_limit) patchOrg({ run_limit: v }, `Run limit → ${v}`); }}
                            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                            style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 8, border: "1.5px solid var(--line-0)", boxSizing: "border-box", textAlign: "center" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 600, color: "var(--violet)", display: "block", marginBottom: 2 }}>Max Run Limit</label>
                          <input type="number" defaultValue={o.max_run_limit || 0} onBlur={e => { const v = Number(e.target.value); if (v !== (o.max_run_limit || 0)) patchOrg({ max_run_limit: v }, `Max limit → ${v}`); }}
                            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                            style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 8, border: "1.5px solid var(--violet)", boxSizing: "border-box", textAlign: "center", color: "var(--violet)" }} />
                        </div>
                      </div>

                      {/* ── Members ── */}
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                        Members ({members.length})
                      </div>
                      {members.length === 0 && <div style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic", marginBottom: 8 }}>No members in this org</div>}
                      {members.map(m => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--line-1)" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-0)", flex: 1 }}>{m.name || m.email?.split("@")[0]}</span>
                          <span style={{ fontSize: 10, color: "var(--ink-3)" }}>{m.email}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20,
                            background: m.role === "admin" ? "var(--navy-bg)" : m.role === "manager" ? "var(--amber-bg)" : "var(--green-bg)",
                            color: m.role === "admin" ? "var(--navy)" : m.role === "manager" ? "var(--amber)" : "var(--green)" }}>{m.role}</span>
                          <button onClick={() => removeUser(m.id, m.name || m.email)} title="Remove from this org"
                            style={{ fontSize: 9, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "2px 4px" }}>✕</button>
                        </div>
                      ))}

                      {/* Add member */}
                      <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
                        <select id={`add-member-${o.id}`} defaultValue=""
                          style={{ flex: 1, fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid var(--line-0)", color: "var(--ink-2)" }}>
                          <option value="" disabled>Add a user to this org...</option>
                          {nonMembers.map(u => <option key={u.id} value={u.id}>{u.name || u.email?.split("@")[0]} ({u.email})</option>)}
                        </select>
                        <button onClick={() => {
                          const sel = document.getElementById(`add-member-${o.id}`);
                          const uid = sel?.value;
                          if (!uid) return;
                          const u = data.users.find(x => x.id === uid);
                          moveUser(uid, u?.name || u?.email || uid);
                          sel.value = "";
                        }}
                          style={{ fontSize: 10, padding: "5px 12px", borderRadius: 6, background: "var(--ink-0)", color: "var(--surface)", border: "none", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                          Add
                        </button>
                      </div>

                      {/* ── Actions ── */}
                      <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line-0)" }}>
                        <button onClick={() => patchOrg({ run_count: 0, max_run_count: 0 }, `${o.name} runs reset to 0`)}
                          style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--amber)", background: "var(--amber-bg)", color: "var(--amber)", cursor: "pointer" }}>
                          Reset Runs
                        </button>
                        <button onClick={async () => {
                          const msg = members.length > 0
                            ? `Delete "${o.name}"? ${members.length} member${members.length > 1 ? "s" : ""} will be unassigned.`
                            : `Delete "${o.name}"?`;
                          if (!window.confirm(msg)) return;
                          try {
                            const r = await fetch("/api/admin-action", {
                              method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                              body: JSON.stringify({ action: "delete_org", orgId: o.id, email: "org" }),
                            });
                            const d = await r.json();
                            setPlanSaveMsg(d.ok ? `✓ Deleted ${o.name}` : `Error: ${d.error}`);
                          } catch { setPlanSaveMsg("Failed to delete org"); }
                          setTimeout(fetchData, 1000);
                        }}
                          style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--red)", background: "var(--red-bg)", color: "var(--red)", cursor: "pointer" }}>
                          Delete Org
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredOrgs.length === 0 && <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: 20 }}>No orgs match the current filters.</div>}
            </div>
          )}

          {/* ═══ ACTIVITY ═══ */}
          {tab === "activity" && (
            <div>
              {/* Guest activity summary */}
              {data.guestActivity?.total_calls > 0 && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Guest Sessions (unauthenticated)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 10 }}>
                    <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-0)", fontFamily: "Lora,serif" }}>{data.guestActivity.total_calls}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase" }}>API Calls</div>
                    </div>
                    <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)", fontFamily: "Lora,serif" }}>${data.guestActivity.total_cost?.toFixed(2) || "0.00"}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase" }}>Cost</div>
                    </div>
                  </div>
                  {data.guestActivity.by_endpoint?.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--ink-2)", marginBottom: 6 }}>
                      <strong>By endpoint:</strong> {data.guestActivity.by_endpoint.map(e => `${e.endpoint} (${e.count})`).join(" · ")}
                    </div>
                  )}
                  {data.guestActivity.by_day?.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--ink-2)" }}>
                      <strong>Recent days:</strong> {data.guestActivity.by_day.slice(0, 7).map(d => `${d.day.slice(5)} (${d.count})`).join(" · ")}
                    </div>
                  )}
                </div>
              )}

              {/* Authenticated user activity */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                Authenticated Activity {hasActiveFilters && <span style={{ fontWeight: 400, color: "var(--amber)" }}>({filteredActivity.length} of {data.recent_activity.length})</span>}
              </div>
              {filteredActivity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: (Date.now() - new Date(a.updated_at).getTime()) < 86400000 ? "var(--green)" : "var(--line-0)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{a.session_name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{a.user_name}</span>
                      {a.user_email && <span> ({a.user_email})</span>}
                      {a.seller_url && <span> · {a.seller_url}</span>}
                      {a.milton_messages > 0 && <span style={{ color: "var(--red)" }}> · {a.milton_messages} Milton msgs</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{timeAgo(a.updated_at)}</div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ USAGE ═══ */}
          {tab === "usage" && (
            <div>
              {/* Environment status */}
              {data.environment && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Environment</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                    {[
                      { label: "Guest Mode", value: data.environment.guest_mode, ok: data.environment.guest_mode === "disabled" },
                      { label: "Environment", value: data.environment.environment, ok: data.environment.environment === "production" },
                      { label: "JWT Secret", value: data.environment.jwt_secret_set ? "Set" : "MISSING", ok: data.environment.jwt_secret_set },
                      { label: "API Key", value: data.environment.api_key_set ? "Set" : "MISSING", ok: data.environment.api_key_set },
                    ].map(e => (
                      <div key={e.label} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, background: e.ok ? "var(--green-bg)" : "var(--red-bg)", color: e.ok ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                        {e.label}: {e.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-org usage */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Usage by Organization</div>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--line-0)", textAlign: "left" }}>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Org</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Plan</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Members</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Tokens</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Max Tokens</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Seller URL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.sort((a, b) => (b.run_count || 0) - (a.run_count || 0)).map(o => (
                    <tr key={o.id} style={{ borderBottom: "1px solid var(--line-0)" }}>
                      <td style={{ padding: "8px 6px", fontWeight: 600 }}>{o.name}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10,
                          background: o.plan === "paid" ? "var(--green-bg)" : o.plan === "suspended" ? "var(--red-bg)" : "var(--amber-bg)",
                          color: o.plan === "paid" ? "var(--green)" : o.plan === "suspended" ? "var(--red)" : "var(--amber)" }}>
                          {o.plan}
                        </span>
                      </td>
                      <td style={{ padding: "8px 6px" }}>{o.member_count}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ fontWeight: 600 }}>{o.run_count}</span>
                        <span style={{ color: "var(--ink-3)" }}>/{o.run_limit}</span>
                        {o.run_count >= o.run_limit && <span style={{ color: "var(--red)", fontWeight: 700, marginLeft: 4 }}>LIMIT</span>}
                      </td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ fontWeight: 600, color: "var(--violet)" }}>{o.max_run_count}</span>
                        <span style={{ color: "var(--ink-3)" }}>/{o.max_run_limit}</span>
                      </td>
                      <td style={{ padding: "8px 6px", fontSize: 11, color: "var(--ink-3)" }}>{o.seller_url || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: "flex", gap: 16, marginTop: 16, padding: "12px 16px", background: "var(--bg-1)", borderRadius: 10 }}>
                <div><span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Lora,serif" }}>{s.total_runs}</span> <span style={{ fontSize: 11, color: "var(--ink-3)" }}>total tokens</span></div>
                <div><span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Lora,serif", color: "var(--violet)" }}>{s.total_max_runs}</span> <span style={{ fontSize: 11, color: "var(--ink-3)" }}>max tokens</span></div>
                <div><span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Lora,serif" }}>{s.total_orgs}</span> <span style={{ fontSize: 11, color: "var(--ink-3)" }}>orgs</span></div>
              </div>
            </div>
          )}

          {/* ═══ SELLER URLS ═══ */}
          {tab === "urls" && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>
                All Seller URLs Being Researched ({data.seller_urls.length})
              </div>
              {data.seller_urls.map((url, i) => {
                const sessionCount = data.recent_activity.filter(a => a.seller_url === url).length;
                const users = [...new Set(data.recent_activity.filter(a => a.seller_url === url).map(a => a.user_name))];
                return (
                  <div key={i} style={{ padding: "8px 12px", background: "var(--bg-1)", borderRadius: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{url}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      {sessionCount} session{sessionCount !== 1 ? "s" : ""} · {users.join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
