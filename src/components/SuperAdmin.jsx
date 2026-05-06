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
  const [openMenu, setOpenMenu] = useState(null);

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

  // Close action menu on click outside
  useEffect(() => {
    if (openMenu === null) return;
    const handler = () => setOpenMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenu]);

  // Superuser check — after all hooks
  if (!isSuperuser) return null;

  if (loading) return (
    <div className="admin-shell" style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 40, fontSize: 14 }}>Loading analytics...</div>
    </div>
  );

  if (error) return (
    <div className="admin-shell" style={{ alignItems: "center", justifyContent: "center" }}>
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

  // ── Sidebar nav config ──
  const navGroups = [
    {
      items: [{ id: "overview", label: "Overview" }],
    },
    {
      label: "PEOPLE",
      items: [
        { id: "users", label: "Members", count: s.total_users },
        { id: "orgs", label: "Organizations", count: s.total_orgs },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        { id: "sessions", label: "Sessions", count: s.total_sessions },
        { id: "costs", label: "Costs", count: `$${(c.cost || 0).toFixed(2)}` },
        { id: "activity", label: "Activity" },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { id: "usage", label: "Usage" },
        { id: "pricing", label: "Pricing" },
        { id: "learnings", label: "Learnings" },
        { id: "urls", label: "URLs", count: s.unique_seller_urls },
      ],
    },
  ];

  // ── Render filters per section ──
  const renderFilters = () => {
    const clearBtn = hasActiveFilters && (
      <button onClick={() => { setDateRange("all"); setUserTypeFilter("all"); setRoleFilter(""); setPlanFilter(""); setSearchQuery(""); }}
        style={{ fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, border: "1.5px solid var(--amber)", background: "var(--surface)", color: "var(--amber)", cursor: "pointer", whiteSpace: "nowrap" }}>
        Clear filters
      </button>
    );

    if (tab === "users") {
      return (
        <div className="admin-filters">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search members..."
            onKeyDown={e => e.stopPropagation()} />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">Any role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="rep">Rep</option>
          </select>
          <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
            <option value="">Any plan</option>
            <option value="trial">Trial</option>
            <option value="paid">Paid</option>
            <option value="enterprise">Enterprise</option>
            <option value="suspended">Suspended</option>
          </select>
          {clearBtn}
          {hasActiveFilters && <span style={{ fontSize: 10, color: "var(--amber)", fontWeight: 600 }}>{filteredUsers.length} of {data.users.length}</span>}
        </div>
      );
    }
    if (tab === "orgs") {
      return (
        <div className="admin-filters">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search organizations..."
            onKeyDown={e => e.stopPropagation()} />
          <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
            <option value="">Any plan</option>
            <option value="trial">Trial</option>
            <option value="paid">Paid</option>
            <option value="enterprise">Enterprise</option>
            <option value="suspended">Suspended</option>
          </select>
          {clearBtn}
          {hasActiveFilters && <span style={{ fontSize: 10, color: "var(--amber)", fontWeight: 600 }}>{filteredOrgs.length} of {data.orgs.length}</span>}
        </div>
      );
    }
    if (tab === "sessions" || tab === "activity") {
      return (
        <div className="admin-filters">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search sessions..."
            onKeyDown={e => e.stopPropagation()} />
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          {clearBtn}
          {hasActiveFilters && <span style={{ fontSize: 10, color: "var(--amber)", fontWeight: 600 }}>{filteredActivity.length} activities</span>}
        </div>
      );
    }
    if (tab === "costs") {
      return (
        <div className="admin-filters">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search costs..."
            onKeyDown={e => e.stopPropagation()} />
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)}>
            <option value="all">All users</option>
            <option value="authenticated">Authenticated</option>
            <option value="guest">Guests only</option>
          </select>
          {clearBtn}
        </div>
      );
    }
    if (tab === "urls") {
      return (
        <div className="admin-filters">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search URLs..."
            onKeyDown={e => e.stopPropagation()} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-shell">
      {/* ── Header ── */}
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "Lora,serif", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>Admin Dashboard</div>
          <span className="admin-badge" style={{ background: "var(--violet-bg)", color: "var(--violet)", fontSize: 9, letterSpacing: "0.5px", textTransform: "uppercase" }}>Superuser</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => fetchData(false)} disabled={refreshing}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid var(--line-0)", background: "var(--surface)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--ink-2)" }}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button onClick={onClose}
            style={{ padding: "6px 16px", borderRadius: 8, border: "1.5px solid var(--ink-0)", background: "var(--ink-0)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--surface)" }}>
            &larr; Back to App
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && <div className="admin-sidebar-group">{group.label}</div>}
              {group.items.map(item => (
                <button key={item.id}
                  className={`admin-sidebar-item${tab === item.id ? " active" : ""}`}
                  onClick={() => setTab(item.id)}>
                  {item.label}
                  {item.count !== undefined && <span className="admin-sidebar-count">{item.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Main content */}
        <main className="admin-content">
          {renderFilters()}

          {/* ═══ OVERVIEW ═══ */}
          {tab === "overview" && (
            <div>
              {/* Primary metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Users", value: s.total_users, color: "var(--navy)", click: () => setTab("users") },
                  { label: "Active Today", value: s.active_today, color: "var(--green)" },
                  { label: "Active This Week", value: s.active_this_week, color: "var(--amber)" },
                  { label: "Sessions", value: s.total_sessions, color: "var(--ink-0)", click: () => setTab("sessions") },
                  { label: "Runs Used", value: s.total_runs, color: "var(--tan-0)" },
                  { label: "Cost", value: `$${(c.cost || 0).toFixed(2)}`, color: "var(--ink-0)", click: () => setTab("costs") },
                ].map(m => (
                  <div key={m.label} className="admin-metric" style={{ cursor: m.click ? "pointer" : "default" }} onClick={m.click}>
                    <div className="admin-metric-num" style={{ color: m.color }}>{m.value}</div>
                    <div className="admin-metric-label">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick insights */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {/* Attention items */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--line-0)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 8 }}>Needs Attention</div>
                  {(() => {
                    const neverActive = (data.users || []).filter(u => !u.last_active).length;
                    const atLimit = (data.orgs || []).filter(o => o.run_count >= o.run_limit && o.run_limit > 0).length;
                    const personalOrgs = (data.orgs || []).filter(o => !o.seller_url && o.member_count <= 1).length;
                    const items = [];
                    if (neverActive > 0) items.push({ text: `${neverActive} users never active`, color: "var(--amber)", click: () => setTab("users") });
                    if (atLimit > 0) items.push({ text: `${atLimit} orgs at run limit`, color: "var(--red)", click: () => setTab("orgs") });
                    if (personalOrgs > 0) items.push({ text: `${personalOrgs} personal workspaces to clean up`, color: "var(--ink-2)", click: () => setTab("orgs") });
                    if (s.guest_api_calls > 0) items.push({ text: `${s.guest_api_calls} guest API calls`, color: "var(--ink-3)", click: () => setTab("activity") });
                    return items.length > 0 ? items.map((item, i) => (
                      <div key={i} onClick={item.click} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", cursor: "pointer", fontSize: 12 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                        <span style={{ color: "var(--ink-1)" }}>{item.text}</span>
                      </div>
                    )) : <div style={{ fontSize: 12, color: "var(--ink-3)" }}>All clear</div>;
                  })()}
                </div>

                {/* Pipeline funnel mini */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--line-0)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 8 }}>Pipeline</div>
                  {data.sessionFunnel && [
                    { label: "ICP Built", value: data.sessionFunnel.with_icp, total: data.sessionFunnel.total, color: "var(--navy)" },
                    { label: "Brief Generated", value: data.sessionFunnel.with_brief, total: data.sessionFunnel.total, color: "var(--green)" },
                    { label: "Hypothesis", value: data.sessionFunnel.with_hypothesis, total: data.sessionFunnel.total, color: "var(--amber)" },
                    { label: "Post-Call", value: data.sessionFunnel.with_post_call, total: data.sessionFunnel.total, color: "var(--violet)" },
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 12 }}>
                      <span style={{ width: 70, color: "var(--ink-2)", fontSize: 11 }}>{step.label}</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg-2)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 3, background: step.color, width: step.total > 0 ? `${Math.round(step.value / step.total * 100)}%` : "0%" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-1)", width: 30, textAlign: "right" }}>{step.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity — as a table, not a list */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 8 }}>Recent Activity</div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>User</th>
                    <th>Researching</th>
                    <th>Depth</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_activity.slice(0, 15).map((a, i) => {
                    const displayName = a.session_name === "Untitled" || a.session_name === "research-only"
                      ? (a.selected_account || a.seller_url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "Quick Brief")
                      : a.session_name;
                    const depthDots = [a.hasICP, a.hasBrief, a.hasHypo, a.hasPostCall, a.hasSolutionFit];
                    const depthLabels = ["I", "B", "H", "P", "S"];
                    return (
                      <tr key={i}>
                        <td>
                          <span style={{ fontWeight: 600, color: "var(--ink-0)" }}>{displayName}</span>
                        </td>
                        <td style={{ fontSize: 11, color: "var(--ink-2)" }}>{a.user_name}</td>
                        <td style={{ fontSize: 11, color: "var(--ink-3)" }}>
                          {a.seller_url === "research-only" ? (a.selected_account || "Quick Brief") : (a.seller_url?.replace(/^https?:\/\//, "") || "—")}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 2 }}>
                            {depthDots.map((filled, j) => (
                              <span key={j} style={{
                                width: 14, height: 14, borderRadius: 3, fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                background: filled ? "var(--green)" : "var(--bg-2)", color: filled ? "var(--surface)" : "var(--ink-3)"
                              }}>{depthLabels[j]}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{timeAgo(a.updated_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                      <div key={m.label} className="admin-metric">
                        <div className="admin-metric-num" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
                        <div className="admin-metric-label">{m.label}</div>
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

              {/* Uploaded documents across all sessions */}
              {(()=>{
                const allDocs = filteredActivity.filter(a => a.docs?.length > 0 || a.products?.length > 0 || a.proof_points?.length > 0);
                return allDocs.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                      Uploaded Content ({allDocs.reduce((s,a) => s + (a.docs?.length||0) + (a.products?.length||0) + (a.proof_points?.length||0), 0)} items across {allDocs.length} sessions)
                    </div>
                    <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid var(--line-0)", borderRadius: 8 }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Preview</th>
                            <th>User</th>
                            <th>Session</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allDocs.flatMap(a => [
                            ...(a.docs||[]).map((d,i) => ({ type: "Doc", name: d.label, preview: d.contentPreview, user: a.user_name, session: a.session_name, key: `doc-${a.id}-${i}` })),
                            ...(a.products||[]).map((p,i) => ({ type: "Product", name: p.name, preview: p.description, user: a.user_name, session: a.session_name, key: `prod-${a.id}-${i}` })),
                            ...(a.proof_points||[]).map((pp,i) => ({ type: pp.type, name: pp.label || pp.type, preview: pp.content, user: a.user_name, session: a.session_name, key: `pp-${a.id}-${i}` })),
                          ]).map(row => (
                            <tr key={row.key}>
                              <td style={{ whiteSpace: "nowrap", color: "var(--tan-0)", fontWeight: 600 }}>{row.type}</td>
                              <td style={{ fontWeight: 600, color: "var(--ink-0)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.name}</td>
                              <td style={{ color: "var(--ink-3)", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.preview || "\u2014"}</td>
                              <td style={{ color: "var(--ink-2)" }}>{row.user}</td>
                              <td style={{ color: "var(--ink-3)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.session}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* All sessions table */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                All Sessions {hasActiveFilters && <span style={{ fontWeight: 400, color: "var(--amber)" }}>({filteredActivity.length} of {data.recent_activity.length})</span>}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table" style={{ minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>User</th>
                      <th>Seller</th>
                      <th>Depth</th>
                      <th>Accounts</th>
                      <th>Route</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivity.map((a, i) => {
                      const depthDots = [a.hasICP, a.hasBrief, a.hasHypo, a.hasPostCall, a.hasSolutionFit];
                      const depthLabels = ["ICP", "Brief", "Hypo", "Post", "SA"];
                      return (
                        <tr key={i}>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--ink-0)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.session_name}</div>
                            {a.selected_account && <div style={{ fontSize: 10, color: "var(--ink-3)" }}>Target: {a.selected_account}</div>}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--ink-0)" }}>{a.user_name?.split(" ")[0] || "\u2014"}</div>
                            <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{a.user_role}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--ink-1)" }}>{a.seller_url || "\u2014"}</div>
                            {a.products_count > 0 && <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{a.products_count} products &middot; {a.docs_count} docs</div>}
                          </td>
                          <td>
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
                          <td style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 700, color: "var(--ink-0)" }}>{a.companies_scored > 0 ? a.companies_scored : "\u2014"}</div>
                            {a.companies_queued > 0 && <div style={{ fontSize: 9, color: "var(--ink-3)" }}>{a.companies_queued} queued</div>}
                          </td>
                          <td>
                            {a.deal_route ? (
                              <span className="admin-badge" style={{
                                background: a.deal_route === "FAST_TRACK" ? "var(--green-bg)" : a.deal_route === "NURTURE" ? "var(--amber-bg)" : "var(--red-bg)",
                                color: a.deal_route === "FAST_TRACK" ? "var(--green)" : a.deal_route === "NURTURE" ? "var(--amber)" : "var(--red)",
                              }}>{a.deal_route.replace("_", " ")}</span>
                            ) : <span style={{ fontSize: 10, color: "var(--ink-3)" }}>{"\u2014"}</span>}
                            {a.deal_value && <div style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 2 }}>${Number(a.deal_value).toLocaleString()}</div>}
                          </td>
                          <td style={{ fontSize: 10, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
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

          {/* ═══ MEMBERS (users tab) ═══ */}
          {tab === "users" && (
            <div>
              {/* Invite form */}
              <div className="admin-filters" style={{ background: "var(--bg-1)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", whiteSpace: "nowrap" }}>Invite &rarr;</span>
                <input id="sa-invite-email" placeholder="email@company.com" type="email"
                  onKeyDown={e => e.stopPropagation()} />
                <select id="sa-invite-org" defaultValue="">
                  <option value="" disabled>Org...</option>
                  {data.orgs.filter(o => o.seller_url || o.member_count > 1).sort((a,b) => (a.name||"").localeCompare(b.name||"")).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  {data.orgs.filter(o => !o.seller_url && o.member_count <= 1).length > 0 && <optgroup label="Personal">
                    {data.orgs.filter(o => !o.seller_url && o.member_count <= 1).sort((a,b) => (a.name||"").localeCompare(b.name||"")).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </optgroup>}
                </select>
                <select id="sa-invite-role" defaultValue="rep">
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

              {/* Members table */}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name / Email</th>
                    <th>Role</th>
                    <th>Organization</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ width: 50 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.sort((a, b) => (b.session_count || 0) - (a.session_count || 0)).map(u => {
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
                      try {
                        const r = await fetch("/api/admin-action", {
                          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                          body: JSON.stringify({ action: "update_user", userId: u.id, email: u.email, fields }),
                        });
                        const d = await r.json();
                        setPlanSaveMsg(d.ok ? msg : `Error: ${d.error}`);
                      } catch { setPlanSaveMsg("Failed to save"); }
                      setTimeout(() => setPlanSaveMsg(""), 3000);
                      setTimeout(fetchData, 500);
                    };

                    const companyOrgs = data.orgs.filter(o => o.seller_url || o.member_count > 1).sort((a,b) => (a.name||"").localeCompare(b.name||""));
                    const personalOrgs = data.orgs.filter(o => !o.seller_url && o.member_count <= 1).sort((a,b) => (a.name||"").localeCompare(b.name||""));

                    return (
                      <tr key={u.id} style={u.email === SUPERUSER_EMAIL ? { background: "var(--bg-1)" } : undefined}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--ink-0)", display: "flex", alignItems: "center", gap: 6 }}>
                            {u.name || u.email?.split("@")[0]}
                            {u.email === SUPERUSER_EMAIL && <span className="admin-badge" style={{ background: "var(--violet-bg)", color: "var(--violet)" }}>SUPER</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{u.email}</div>
                        </td>
                        <td>
                          <select value={u.role || "rep"} onChange={e => patchUser({ role: e.target.value }, `${u.email} \u2192 ${e.target.value}`)}>
                            <option value="rep">Rep</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <select value={u.org_id || ""} onChange={e => patchUser({ org_id: e.target.value || null }, `${u.email} \u2192 ${e.target.value ? data.orgs.find(o => o.id === e.target.value)?.name : "no org"}`)}>
                            <option value="">No org</option>
                            {companyOrgs.length > 0 && <optgroup label="Companies">
                              {companyOrgs.map(o => <option key={o.id} value={o.id}>{o.name}{o.seller_url ? ` \u00b7 ${o.seller_url.replace(/^https?:\/\//, "")}` : ""} ({o.plan})</option>)}
                            </optgroup>}
                            {personalOrgs.length > 0 && <optgroup label="Personal Workspaces">
                              {personalOrgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.plan})</option>)}
                            </optgroup>}
                          </select>
                        </td>
                        <td>
                          {u.last_active ? (
                            <span className="admin-badge" style={{ background: "var(--green-bg)", color: "var(--green)" }}>Active</span>
                          ) : (
                            <span className="admin-badge" style={{ background: "var(--bg-2)", color: "var(--ink-3)" }}>Never active</span>
                          )}
                        </td>
                        <td style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                          {u.last_active ? timeAgo(u.last_active) : "\u2014"}
                        </td>
                        <td style={{ position: "relative" }}>
                          <button className="admin-dot-menu" onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === u.id ? null : u.id); }}>
                            &#x22EF;
                          </button>
                          {openMenu === u.id && (
                            <div className="admin-action-menu" onClick={e => e.stopPropagation()}>
                              <button className="admin-action-item" onClick={() => { adminAction("reset_password"); setOpenMenu(null); }}>
                                Send Password Reset
                              </button>
                              <button className="admin-action-item" onClick={() => { adminAction("resend_invite"); setOpenMenu(null); }}>
                                Resend Invite
                              </button>
                              {u.email !== SUPERUSER_EMAIL && (
                                <button className="admin-action-item danger" onClick={async () => {
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
                                  setOpenMenu(null);
                                }}>
                                  Delete User
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: 20 }}>No members match the current filters.</div>}
            </div>
          )}

          {/* ═══ ORGANIZATIONS ═══ */}
          {tab === "orgs" && (
            <div>
              {/* ── Create New Org ── */}
              <div style={{ background: "var(--bg-1)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", whiteSpace: "nowrap" }}>New Org →</span>
                  <input id="sa-new-org-name" placeholder="Company name" onKeyDown={e => e.stopPropagation()}
                    style={{ flex: "1 1 140px", fontSize: 12, padding: "6px 10px", border: "1.5px solid var(--line-0)", borderRadius: 6, background: "var(--surface)" }} />
                  <input id="sa-new-org-url" placeholder="company.com (optional)" onKeyDown={e => e.stopPropagation()}
                    style={{ flex: "1 1 140px", fontSize: 12, padding: "6px 10px", border: "1.5px solid var(--line-0)", borderRadius: 6, background: "var(--surface)" }} />
                  <select id="sa-new-org-plan" defaultValue="trial"
                    style={{ fontSize: 11, padding: "6px 8px", border: "1.5px solid var(--line-0)", borderRadius: 6, background: "var(--surface)" }}>
                    <option value="trial">Trial (3 runs)</option>
                    <option value="starter">Starter (25)</option>
                    <option value="pro">Pro (100)</option>
                    <option value="team">Team (250)</option>
                    <option value="enterprise">Enterprise (1K)</option>
                  </select>
                  <button onClick={async () => {
                    const name = document.getElementById("sa-new-org-name")?.value?.trim();
                    if (!name) { setPlanSaveMsg("Org name required"); setTimeout(() => setPlanSaveMsg(""), 3000); return; }
                    const url = document.getElementById("sa-new-org-url")?.value?.trim();
                    const plan = document.getElementById("sa-new-org-plan")?.value || "trial";
                    const limits = { trial: { run_limit: 3, max_run_limit: 0 }, starter: { run_limit: 25, max_run_limit: 5 }, pro: { run_limit: 100, max_run_limit: 20 }, team: { run_limit: 250, max_run_limit: 50 }, enterprise: { run_limit: 1000, max_run_limit: 200 } };
                    const body = { name, plan, ...(limits[plan] || {}) };
                    if (url) body.seller_url = url.startsWith("http") ? url : `https://${url}`;
                    try {
                      const r = await fetch("/api/admin-action", {
                        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                        body: JSON.stringify({ action: "create_org", email: "org", orgData: body }),
                      });
                      const d = await r.json();
                      if (d.ok) {
                        setPlanSaveMsg(`✓ Created org "${name}"`);
                        document.getElementById("sa-new-org-name").value = "";
                        document.getElementById("sa-new-org-url").value = "";
                        setTimeout(fetchData, 500);
                      } else { setPlanSaveMsg(`Error: ${d.error}`); }
                    } catch { setPlanSaveMsg("Failed to create org"); }
                    setTimeout(() => setPlanSaveMsg(""), 3000);
                  }}
                    style={{ padding: "6px 14px", borderRadius: 6, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    Create
                  </button>
                </div>
              </div>

              {/* ── Company Organizations ── */}
              {(() => {
                const companyOrgs = filteredOrgs.filter(o => o.seller_url || o.member_count > 1).sort((a,b) => (a.name||"").localeCompare(b.name||""));
                return companyOrgs.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tan-0)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Company Organizations ({companyOrgs.length})</div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Plan</th>
                          <th>Website</th>
                          <th>Runs</th>
                          <th>Members</th>
                          <th style={{ width: 50 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyOrgs.map(o => {
                          const members = data.users.filter(u => u.org_id === o.id);
                          const patchOrg = async (fields, msg) => {
                            try {
                              const r = await fetch("/api/admin-action", {
                                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                                body: JSON.stringify({ action: "update_org", orgId: o.id, email: "org", fields }),
                              });
                              const d = await r.json();
                              setPlanSaveMsg(d.ok ? msg : `Error: ${d.error}`);
                            } catch { setPlanSaveMsg("Failed to save"); }
                            setTimeout(() => setPlanSaveMsg(""), 3000);
                            setTimeout(fetchData, 500);
                          };
                          const menuKey = `org-${o.id}`;
                          return (
                            <tr key={o.id}>
                              <td>
                                <input defaultValue={o.name}
                                  onBlur={e => { const v = e.target.value.trim(); if (v && v !== o.name) patchOrg({ name: v }, `✓ Renamed to ${v}`); }}
                                  onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                                  style={{ border: "1px solid var(--line-0)", background: "var(--surface)", fontWeight: 600, fontSize: 13, width: "100%", padding: "4px 8px", borderRadius: 4, color: "var(--ink-0)" }} />
                              </td>
                              <td>
                                <select defaultValue={o.plan} onChange={e => {
                                  const plan = e.target.value;
                                  const limits = { trial: { run_limit: 3, max_run_limit: 0 }, starter: { run_limit: 25, max_run_limit: 5 }, pro: { run_limit: 100, max_run_limit: 20 }, team: { run_limit: 250, max_run_limit: 50 }, enterprise: { run_limit: 1000, max_run_limit: 200 } };
                                  patchOrg({ plan, ...(limits[plan] || {}) }, `${o.name} \u2192 ${plan}${limits[plan]?.run_limit ? ` (${limits[plan].run_limit} runs)` : ""}`);
                                }}>
                                  <option value="trial">Trial</option>
                                  <option value="starter">Starter</option>
                                  <option value="pro">Pro</option>
                                  <option value="team">Team</option>
                                  <option value="enterprise">Enterprise</option>
                                  <option value="paid">Paid</option>
                                  <option value="suspended">Suspended</option>
                                </select>
                              </td>
                              <td>
                                <input defaultValue={o.seller_url || ""} placeholder="https://company.com"
                                  onBlur={e => { const v = e.target.value.trim(); if (v !== (o.seller_url || "")) patchOrg({ seller_url: v || null }, `✓ Website → ${v || "cleared"}`); }}
                                  onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }}
                                  style={{ border: "1px solid var(--line-0)", background: "var(--surface)", fontSize: 11, width: "100%", padding: "4px 8px", borderRadius: 4, color: "var(--ink-1)" }} />
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                <span style={{ fontWeight: 600 }}>{o.run_count}</span>
                                <span style={{ color: "var(--ink-3)" }}>/{o.run_limit}</span>
                                {o.run_count >= o.run_limit && <span style={{ color: "var(--red)", fontWeight: 700, marginLeft: 4 }}>LIMIT</span>}
                              </td>
                              <td style={{ textAlign: "center" }}>{members.length}</td>
                              <td style={{ position: "relative" }}>
                                <button className="admin-dot-menu" onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === menuKey ? null : menuKey); }}>
                                  &#x22EF;
                                </button>
                                {openMenu === menuKey && (
                                  <div className="admin-action-menu" onClick={e => e.stopPropagation()}>
                                    <button className="admin-action-item" onClick={() => { patchOrg({ run_count: 0, max_run_count: 0 }, `${o.name} runs reset to 0`); setOpenMenu(null); }}>
                                      Reset Runs
                                    </button>
                                    <button className="admin-action-item danger" onClick={async () => {
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
                                        setPlanSaveMsg(d.ok ? `Deleted ${o.name}` : `Error: ${d.error}`);
                                      } catch { setPlanSaveMsg("Failed to delete org"); }
                                      setTimeout(fetchData, 1000);
                                      setOpenMenu(null);
                                    }}>
                                      Delete Org
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* ── Personal Workspaces ── */}
              {(() => {
                const personalOrgs = filteredOrgs.filter(o => !o.seller_url && o.member_count <= 1).sort((a,b) => (a.name||"").localeCompare(b.name||""));
                const companyOrgList = (data.orgs || []).filter(o => o.seller_url || o.member_count > 1);
                const patchOrgApi = async (orgId, fields, msg) => {
                  try {
                    const r = await fetch("/api/admin-action", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                      body: JSON.stringify({ action: "update_org", orgId, email: "org", fields }) });
                    const d = await r.json();
                    setPlanSaveMsg(d.ok ? msg : `Error: ${d.error}`);
                  } catch { setPlanSaveMsg("Failed"); }
                  setTimeout(() => setPlanSaveMsg(""), 3000); setTimeout(fetchData, 500);
                };
                const moveUserToOrg = async (userId, email, targetOrgId, targetOrgName) => {
                  try {
                    const r = await fetch("/api/admin-action", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
                      body: JSON.stringify({ action: "update_user", userId, email, fields: { org_id: targetOrgId } }) });
                    const d = await r.json();
                    setPlanSaveMsg(d.ok ? `✓ Moved ${email} → ${targetOrgName}` : `Error: ${d.error}`);
                  } catch { setPlanSaveMsg("Failed"); }
                  setTimeout(() => setPlanSaveMsg(""), 3000); setTimeout(fetchData, 500);
                };
                return personalOrgs.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>
                      Personal Workspaces ({personalOrgs.length})
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 10 }}>
                      Move users to a company org, or add a website to convert a workspace into a company org.
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Member</th>
                          <th>Move to Company Org</th>
                          <th>Or Set Website</th>
                          <th style={{ width: 60 }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personalOrgs.map(o => {
                          const members = data.users.filter(u => u.org_id === o.id);
                          const member = members[0];
                          return (
                            <tr key={o.id}>
                              <td style={{ fontWeight: 600, color: "var(--ink-1)" }}>{o.name}</td>
                              <td style={{ fontSize: 11, color: "var(--ink-3)" }}>
                                {member ? (member.name || member.email?.split("@")[0]) : "Empty"}
                                {member?.email && <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{member.email}</div>}
                              </td>
                              <td>
                                {member && companyOrgList.length > 0 ? (
                                  <select defaultValue="" onChange={e => {
                                    const targetId = e.target.value;
                                    if (!targetId) return;
                                    const targetOrg = companyOrgList.find(co => co.id === targetId);
                                    moveUserToOrg(member.id, member.email, targetId, targetOrg?.name || "org");
                                  }} style={{ fontSize: 11, padding: "3px 6px", borderRadius: 4 }}>
                                    <option value="">Move to...</option>
                                    {companyOrgList.map(co => <option key={co.id} value={co.id}>{co.name}</option>)}
                                  </select>
                                ) : <span style={{ fontSize: 10, color: "var(--ink-3)" }}>—</span>}
                              </td>
                              <td>
                                <input placeholder="company.com" style={{ fontSize: 11, padding: "3px 6px", border: "1px solid var(--line-0)", borderRadius: 4, width: 120 }}
                                  onBlur={e => { const v = e.target.value.trim(); if (v) patchOrgApi(o.id, { seller_url: v.startsWith("http") ? v : `https://${v}` }, `✓ ${o.name} → company org (${v})`); }}
                                  onKeyDown={e => { if (e.key === "Enter") e.target.blur(); e.stopPropagation(); }} />
                              </td>
                              <td>
                                <button style={{ fontSize: 10, padding: "2px 8px", border: "1px solid var(--red)", borderRadius: 4, background: "var(--red-bg)", color: "var(--red)", cursor: "pointer", fontWeight: 600 }}
                                  onClick={async () => {
                                    if (!window.confirm(`Delete "${o.name}"?${members.length > 0 ? ` ${members.length} member(s) will be unassigned.` : ""}`)) return;
                                    try {
                                      const r = await fetch("/api/admin-action", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` }, body: JSON.stringify({ action: "delete_org", orgId: o.id, email: "org" }) });
                                      const d = await r.json();
                                      setPlanSaveMsg(d.ok ? `✓ Deleted ${o.name}` : `Error: ${d.error}`);
                                    } catch { setPlanSaveMsg("Failed"); }
                                    setTimeout(fetchData, 1000);
                                  }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {filteredOrgs.length === 0 && <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: 20 }}>No orgs match the current filters.</div>}
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
                  <div key={m.label} className="admin-metric">
                    <div className="admin-metric-num" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
                    <div className="admin-metric-label">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Cost by user */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Cost by User</div>
              <table className="admin-table" style={{ marginBottom: 20 }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Cost</th>
                    <th>Calls</th>
                    <th>Input</th>
                    <th>Output</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCostsByUser.map((u, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.user_name}</div>
                        {u.user_email && <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{u.user_email}</div>}
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--ink-0)" }}>${u.cost.toFixed(3)}</td>
                      <td>{u.calls}</td>
                      <td style={{ fontSize: 11, color: "var(--ink-3)" }}>{(u.input / 1000).toFixed(1)}K</td>
                      <td style={{ fontSize: 11, color: "var(--ink-3)" }}>{(u.output / 1000).toFixed(1)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cost by model */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Cost by Model</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {(data.costs.by_model || []).map((m, i) => (
                  <div key={i} className="admin-metric" style={{ minWidth: 180, textAlign: "left" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-0)", marginBottom: 4 }}>{m.model}</div>
                    <div className="admin-metric-num" style={{ color: m.model.includes("opus") ? "var(--violet)" : "var(--green)", fontSize: 18 }}>${m.cost.toFixed(3)}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{m.calls} calls &middot; {(m.input / 1000).toFixed(0)}K in &middot; {(m.output / 1000).toFixed(0)}K out</div>
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

          {/* ═══ ACTIVITY ═══ */}
          {tab === "activity" && (
            <div>
              {/* Guest activity summary */}
              {data.guestActivity?.total_calls > 0 && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Guest Sessions (unauthenticated)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 10 }}>
                    <div className="admin-metric" style={{ background: "var(--surface)" }}>
                      <div className="admin-metric-num" style={{ fontSize: 22 }}>{data.guestActivity.total_calls}</div>
                      <div className="admin-metric-label">API Calls</div>
                    </div>
                    <div className="admin-metric" style={{ background: "var(--surface)" }}>
                      <div className="admin-metric-num" style={{ color: "var(--amber)", fontSize: 22 }}>${data.guestActivity.total_cost?.toFixed(2) || "0.00"}</div>
                      <div className="admin-metric-label">Cost</div>
                    </div>
                  </div>
                  {data.guestActivity.by_endpoint?.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--ink-2)", marginBottom: 6 }}>
                      <strong>By endpoint:</strong> {data.guestActivity.by_endpoint.map(e => `${e.endpoint} (${e.count})`).join(" \u00b7 ")}
                    </div>
                  )}
                  {data.guestActivity.by_day?.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--ink-2)" }}>
                      <strong>Recent days:</strong> {data.guestActivity.by_day.slice(0, 7).map(d => `${d.day.slice(5)} (${d.count})`).join(" \u00b7 ")}
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
                      {a.seller_url && <span> &middot; {a.seller_url}</span>}
                      {a.milton_messages > 0 && <span style={{ color: "var(--red)" }}> &middot; {a.milton_messages} Milton msgs</span>}
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
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Org</th>
                    <th>Plan</th>
                    <th>Members</th>
                    <th>Tokens</th>
                    <th>Max Tokens</th>
                    <th>Seller URL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.sort((a, b) => (b.run_count || 0) - (a.run_count || 0)).map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>{o.name}</td>
                      <td>
                        <span className="admin-badge" style={{
                          background: o.plan === "paid" ? "var(--green-bg)" : o.plan === "suspended" ? "var(--red-bg)" : "var(--amber-bg)",
                          color: o.plan === "paid" ? "var(--green)" : o.plan === "suspended" ? "var(--red)" : "var(--amber)",
                        }}>{o.plan}</span>
                      </td>
                      <td>{o.member_count}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{o.run_count}</span>
                        <span style={{ color: "var(--ink-3)" }}>/{o.run_limit}</span>
                        {o.run_count >= o.run_limit && <span style={{ color: "var(--red)", fontWeight: 700, marginLeft: 4 }}>LIMIT</span>}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "var(--violet)" }}>{o.max_run_count}</span>
                        <span style={{ color: "var(--ink-3)" }}>/{o.max_run_limit}</span>
                      </td>
                      <td style={{ fontSize: 11, color: "var(--ink-3)" }}>{o.seller_url || "\u2014"}</td>
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
              <table className="admin-table" style={{ marginBottom: 16 }}>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Tokens/mo</th>
                    <th>Max Tokens</th>
                    <th>Price/mo</th>
                    <th>Your Cost</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, i) => {
                    const cost = plan.tokens * plan.costPerToken;
                    const margin = plan.price > 0 ? Math.round((1 - cost / plan.price) * 100) : -100;
                    return (
                      <tr key={plan.id}>
                        <td>
                          <input value={plan.name} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, name: e.target.value } : pl))}
                            style={{ border: "none", background: "transparent", fontWeight: 600, fontSize: 13, width: 100, outline: "none" }} />
                        </td>
                        <td>
                          <input type="number" value={plan.tokens} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, tokens: Number(e.target.value) } : pl))}
                            style={{ width: 60, border: "1px solid var(--line-0)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
                        </td>
                        <td>
                          <input type="number" value={plan.maxTokens} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, maxTokens: Number(e.target.value) } : pl))}
                            style={{ width: 60, border: "1px solid var(--line-0)", borderRadius: 4, padding: "3px 6px", fontSize: 12, color: "var(--violet)" }} />
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <span style={{ fontSize: 11, color: "var(--ink-3)" }}>$</span>
                            <input type="number" value={plan.price} onChange={e => setPlans(p => p.map((pl, j) => j === i ? { ...pl, price: Number(e.target.value) } : pl))}
                              style={{ width: 70, border: "1px solid var(--line-0)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: "var(--ink-1)" }}>
                          ${cost.toFixed(0)}
                        </td>
                        <td>
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
                      Current: {o.plan} &middot; {o.run_count}/{o.run_limit} tokens &middot; {o.max_run_count}/{o.max_run_limit} max
                    </div>
                  </div>
                  <select defaultValue={o.plan}
                    onChange={e => applyPlanToOrg(o.id, e.target.value)}
                    style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: "1.5px solid var(--line-0)" }}>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.tokens} tokens, ${p.price}/mo)</option>)}
                  </select>
                </div>
              ))}

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
                  <div key={m.label} className="admin-metric">
                    <div className="admin-metric-num" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
                    <div className="admin-metric-label">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Top edited ICP fields */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                Most Corrected ICP Fields
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Fields users edit most often -- signals where AI output needs improvement</span>
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

              {/* Intel adjustments */}
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
                      <span style={{ color: "var(--ink-3)", flex: 1 }}>{adj.reason || "\u2014"}</span>
                      <span style={{ color: "var(--ink-3)", fontSize: 10 }}>{adj.user}</span>
                    </div>
                  ))}
                </div>
              )}
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
                      {sessionCount} session{sessionCount !== 1 ? "s" : ""} &middot; {users.join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {planSaveMsg && <div className="admin-toast">{planSaveMsg}</div>}
    </div>
  );
}
