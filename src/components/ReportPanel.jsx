// src/components/ReportPanel.jsx — Org-level reporting dashboard
// Available to all authenticated users. Shows org-scoped activity,
// usage, session insights, and deal routing analytics.
// Admin/superuser sees the full SuperAdmin dashboard instead.

import { useState, useMemo } from "react";

function timeAgo(dateStr) {
  if (!dateStr) return "never";
  const ago = Date.now() - new Date(dateStr).getTime();
  if (ago < 60000) return "just now";
  if (ago < 3600000) return `${Math.floor(ago / 60000)}m ago`;
  if (ago < 86400000) return `${Math.floor(ago / 3600000)}h ago`;
  if (ago < 604800000) return `${Math.floor(ago / 86400000)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ReportPanel({ orgCtx, savedSessions, sbUser, onClose }) {
  const [tab, setTab] = useState("overview");

  // Derive analytics from saved sessions (client-side, no API call needed)
  const analytics = useMemo(() => {
    const sessions = savedSessions || [];
    const now = Date.now();

    // Session stats
    const totalSessions = sessions.length;
    const activeLast7d = sessions.filter(s => (now - new Date(s.updated_at).getTime()) < 604800000).length;
    const activeLast30d = sessions.filter(s => (now - new Date(s.updated_at).getTime()) < 2592000000).length;

    // Unique seller URLs
    const sellerUrls = [...new Set(sessions.map(s => s.seller_url).filter(Boolean))];

    // Deal routing from session data
    const dealRoutes = { FAST_TRACK: 0, NURTURE: 0, DISQUALIFY: 0 };
    let totalDeals = 0;
    let totalMilton = 0;
    let totalGates = 0;
    let totalGatesFilled = 0;
    const icpEdits = {};
    const companiesScored = new Set();
    const intelAdj = [];

    sessions.forEach(s => {
      const d = s.data;
      if (!d) return;

      // Milton messages
      totalMilton += Number(d.miltonMsgCount) || 0;

      // Deal routing
      if (d.postCall?.dealRoute) {
        dealRoutes[d.postCall.dealRoute] = (dealRoutes[d.postCall.dealRoute] || 0) + 1;
        totalDeals++;
      }

      // Gate completion
      if (d.gateAnswers) {
        const filled = Object.values(d.gateAnswers).filter(Boolean).length;
        totalGates += 15;
        totalGatesFilled += filled;
      }

      // ICP edits
      (d.icpEdits || []).forEach(e => {
        icpEdits[e.field] = (icpEdits[e.field] || 0) + 1;
      });

      // Companies scored
      if (d.fitScores) {
        Object.keys(d.fitScores).forEach(co => companiesScored.add(co));
      }

      // Intel adjustments
      Object.entries(d.intelAdjustments || {}).forEach(([co, adj]) => {
        intelAdj.push({ company: co, modifier: adj.modifier, reason: adj.reason });
      });
    });

    const topEditedFields = Object.entries(icpEdits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([field, count]) => ({ field, count }));

    return {
      totalSessions,
      activeLast7d,
      activeLast30d,
      sellerUrls,
      dealRoutes,
      totalDeals,
      totalMilton,
      avgGateCompletion: totalGates > 0 ? Math.round(totalGatesFilled / totalGates * 100) : 0,
      fastTrackRate: totalDeals > 0 ? Math.round(dealRoutes.FAST_TRACK / totalDeals * 100) : 0,
      disqualifyRate: totalDeals > 0 ? Math.round(dealRoutes.DISQUALIFY / totalDeals * 100) : 0,
      companiesScored: companiesScored.size,
      topEditedFields,
      intelAdj,
    };
  }, [savedSessions]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sessions", label: "Sessions" },
    { id: "insights", label: "Insights" },
    { id: "usage", label: "Usage" },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9998 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ background: "#fff", borderRadius: 16, width: "90%", maxWidth: 800, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", pointerEvents: "auto", boxShadow: "0 8px 48px rgba(0,0,0,0.15)" }}>

          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-0)", fontFamily: "Lora,serif" }}>
                Reports — {orgCtx?.name || "Your Organization"}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                {orgCtx?.plan === "trial" ? "Trial" : orgCtx?.plan || "—"} plan · {orgCtx ? `${orgCtx.run_count}/${orgCtx.run_limit} tokens used` : ""} · {sbUser?.email}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--ink-3)" }}>×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line-0)", padding: "0 20px" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, border: "none", background: "none", cursor: "pointer",
                  color: tab === t.id ? "var(--ink-0)" : "var(--ink-3)",
                  borderBottom: tab === t.id ? "2px solid var(--ink-0)" : "2px solid transparent" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>

            {/* ═══ OVERVIEW ═══ */}
            {tab === "overview" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Total Sessions", value: analytics.totalSessions, color: "var(--ink-0)" },
                    { label: "Active This Week", value: analytics.activeLast7d, color: "var(--green)" },
                    { label: "Companies Scored", value: analytics.companiesScored, color: "var(--navy)" },
                    { label: "Seller URLs", value: analytics.sellerUrls.length, color: "var(--amber)" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Usage bar */}
                {orgCtx && (
                  <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-0)" }}>Tokens Used</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: orgCtx.run_count >= orgCtx.run_limit ? "var(--red)" : "var(--green)" }}>
                        {orgCtx.run_count} / {orgCtx.run_limit}
                      </div>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ height: "100%", borderRadius: 4, transition: "width 0.3s",
                        background: orgCtx.run_count >= orgCtx.run_limit ? "var(--red)" : orgCtx.run_count >= orgCtx.run_limit * 0.8 ? "var(--amber)" : "var(--green)",
                        width: Math.min(100, Math.round(orgCtx.run_count / orgCtx.run_limit * 100)) + "%" }} />
                    </div>
                    {(orgCtx.max_run_limit || 0) > 0 && (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6" }}>Cambrian Max Tokens</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6" }}>
                            {orgCtx.max_run_count || 0} / {orgCtx.max_run_limit}
                          </div>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 4, background: "#8B5CF6", transition: "width 0.3s",
                            width: Math.min(100, Math.round((orgCtx.max_run_count || 0) / (orgCtx.max_run_limit || 1) * 100)) + "%" }} />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Deal routing */}
                {analytics.totalDeals > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Deal Routing</div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                      {[
                        { label: "Fast Track", count: analytics.dealRoutes.FAST_TRACK, pct: analytics.fastTrackRate, color: "var(--green)", bg: "var(--green-bg)" },
                        { label: "Nurture", count: analytics.dealRoutes.NURTURE, pct: analytics.totalDeals > 0 ? Math.round(analytics.dealRoutes.NURTURE / analytics.totalDeals * 100) : 0, color: "var(--amber)", bg: "var(--amber-bg)" },
                        { label: "Disqualify", count: analytics.dealRoutes.DISQUALIFY, pct: analytics.disqualifyRate, color: "var(--red)", bg: "var(--red-bg)" },
                      ].map(r => (
                        <div key={r.label} style={{ flex: 1, background: r.bg, borderRadius: 10, padding: "14px", textAlign: "center", border: `1px solid ${r.color}22` }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: r.color, fontFamily: "Lora,serif" }}>{r.count}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: r.color }}>{r.label} ({r.pct}%)</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Recent sessions */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Recent Sessions</div>
                {(savedSessions || []).slice(0, 10).map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--line-0)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: (Date.now() - new Date(s.updated_at).getTime()) < 86400000 ? "var(--green)" : "var(--line-0)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name || "Untitled"}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{s.seller_url || "—"} · {timeAgo(s.updated_at)}</div>
                    </div>
                  </div>
                ))}
                {(savedSessions || []).length === 0 && (
                  <div style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: "24px 0" }}>No sessions yet. Start your first playbook to see activity here.</div>
                )}
              </div>
            )}

            {/* ═══ SESSIONS ═══ */}
            {tab === "sessions" && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>
                  All Sessions ({(savedSessions || []).length})
                </div>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--line-0)", textAlign: "left" }}>
                      <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Session</th>
                      <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Seller URL</th>
                      <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Last Active</th>
                      <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(savedSessions || []).map(s => (
                      <tr key={s.id} style={{ borderBottom: "1px solid var(--line-0)" }}>
                        <td style={{ padding: "8px 6px", fontWeight: 600, color: "var(--ink-0)" }}>{s.name || "Untitled"}</td>
                        <td style={{ padding: "8px 6px", fontSize: 11, color: "var(--ink-3)" }}>{s.seller_url || "—"}</td>
                        <td style={{ padding: "8px 6px", color: "var(--ink-3)" }}>{timeAgo(s.updated_at)}</td>
                        <td style={{ padding: "8px 6px", color: "var(--ink-3)", fontSize: 11 }}>{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Seller URLs summary */}
                {analytics.sellerUrls.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginTop: 20, marginBottom: 8 }}>
                      Seller URLs ({analytics.sellerUrls.length})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {analytics.sellerUrls.map((url, i) => (
                        <span key={i} style={{ fontSize: 11, background: "var(--bg-1)", borderRadius: 8, padding: "4px 10px", color: "var(--ink-1)", fontFamily: "monospace" }}>
                          {url.replace(/^https?:\/\//, "").slice(0, 30)}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ═══ INSIGHTS ═══ */}
            {tab === "insights" && (
              <div>
                {/* Summary cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Deals Routed", value: analytics.totalDeals, color: "var(--ink-0)" },
                    { label: "Fast Track Rate", value: `${analytics.fastTrackRate}%`, color: "var(--green)" },
                    { label: "Disqualify Rate", value: `${analytics.disqualifyRate}%`, color: "var(--red)" },
                    { label: "Avg Gate Completion", value: `${analytics.avgGateCompletion}%`, color: "var(--navy)" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: m.color, fontFamily: "Lora,serif" }}>{m.value}</div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top corrected ICP fields */}
                {analytics.topEditedFields.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                      Most Corrected ICP Fields
                      <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Fields you edit most — helps us improve accuracy</span>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      {analytics.topEditedFields.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line-0)" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-0)", flex: 1 }}>{f.field}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ height: 6, borderRadius: 3, background: "var(--amber)", width: Math.min(200, f.count * 20) }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)" }}>{f.count}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Intel adjustments */}
                {analytics.intelAdj.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                      Intel Adjustments
                      <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Fit score overrides applied by your team</span>
                    </div>
                    {analytics.intelAdj.slice(0, 15).map((adj, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--line-0)", fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--ink-0)", minWidth: 120 }}>{adj.company}</span>
                        <span style={{ fontWeight: 700, color: adj.modifier > 0 ? "var(--green)" : "var(--red)", minWidth: 40 }}>{adj.modifier > 0 ? "+" : ""}{adj.modifier}</span>
                        <span style={{ color: "var(--ink-3)", flex: 1 }}>{adj.reason || "—"}</span>
                      </div>
                    ))}
                  </>
                )}

                {analytics.totalDeals === 0 && analytics.topEditedFields.length === 0 && (
                  <div style={{ textAlign: "center", color: "#aaa", fontSize: 13, padding: "32px 0" }}>
                    Complete more sessions to see deal routing insights, ICP corrections, and intel adjustments here.
                  </div>
                )}
              </div>
            )}

            {/* ═══ USAGE ═══ */}
            {tab === "usage" && orgCtx && (
              <div>
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-0)", marginBottom: 12 }}>Organization Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 4 }}>Organization</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-0)" }}>{orgCtx.name || "—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 4 }}>Plan</div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 10,
                        background: orgCtx.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)",
                        color: orgCtx.plan === "paid" ? "var(--green)" : "var(--amber)" }}>
                        {orgCtx.plan || "trial"}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 4 }}>Your Role</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-0)", textTransform: "capitalize" }}>{orgCtx.userRole || "rep"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: 4 }}>Milton Messages</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: analytics.totalMilton > 0 ? "#cc2222" : "var(--ink-0)" }}>{analytics.totalMilton}</div>
                    </div>
                  </div>
                </div>

                {/* Usage bars */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)" }}>Standard Tokens</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: orgCtx.run_count >= orgCtx.run_limit ? "var(--red)" : "var(--green)" }}>
                        {orgCtx.run_count} / {orgCtx.run_limit}
                      </div>
                    </div>
                    <div style={{ height: 10, borderRadius: 5, background: "var(--bg-2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 5, transition: "width 0.3s",
                        background: orgCtx.run_count >= orgCtx.run_limit ? "var(--red)" : "var(--green)",
                        width: Math.min(100, Math.round(orgCtx.run_count / orgCtx.run_limit * 100)) + "%" }} />
                    </div>
                    <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>
                      {Math.max(0, orgCtx.run_limit - orgCtx.run_count)} tokens remaining this month
                    </div>
                  </div>
                  <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8B5CF6" }}>Max Tokens</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6" }}>
                        {orgCtx.max_run_count || 0} / {orgCtx.max_run_limit || 0}
                      </div>
                    </div>
                    <div style={{ height: 10, borderRadius: 5, background: "var(--bg-2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 5, background: "#8B5CF6", transition: "width 0.3s",
                        width: (orgCtx.max_run_limit || 0) > 0 ? Math.min(100, Math.round((orgCtx.max_run_count || 0) / orgCtx.max_run_limit * 100)) + "%" : "0%" }} />
                    </div>
                    <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>
                      {(orgCtx.max_run_limit || 0) > 0 ? `${Math.max(0, orgCtx.max_run_limit - (orgCtx.max_run_count || 0))} Max tokens remaining` : "Not available on current plan"}
                    </div>
                  </div>
                </div>

                {/* Activity by month */}
                {(savedSessions || []).length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Sessions by Month</div>
                    {(() => {
                      const byMonth = {};
                      (savedSessions || []).forEach(s => {
                        const m = new Date(s.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" });
                        byMonth[m] = (byMonth[m] || 0) + 1;
                      });
                      const months = Object.entries(byMonth).slice(0, 6);
                      const max = Math.max(...months.map(([, c]) => c), 1);
                      return months.map(([month, count]) => (
                        <div key={month} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line-0)" }}>
                          <div style={{ fontSize: 12, color: "var(--ink-1)", width: 70, fontWeight: 600 }}>{month}</div>
                          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 4, background: "var(--green)", width: Math.round(count / max * 100) + "%" }} />
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, width: 30, textAlign: "right" }}>{count}</div>
                        </div>
                      ));
                    })()}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
