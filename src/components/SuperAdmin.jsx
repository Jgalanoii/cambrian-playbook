// src/components/SuperAdmin.jsx — Superuser engagement dashboard
// Locked to superuser email only. Shows engagement metrics across all users.

import { useState, useEffect } from "react";

const SUPERUSER_EMAIL = "itsjoegalano@gmail.com";

function timeAgo(dateStr) {
  if (!dateStr) return "never";
  const ago = Date.now() - new Date(dateStr).getTime();
  if (ago < 60000) return "just now";
  if (ago < 3600000) return `${Math.floor(ago / 60000)}m ago`;
  if (ago < 86400000) return `${Math.floor(ago / 3600000)}h ago`;
  if (ago < 604800000) return `${Math.floor(ago / 86400000)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function SuperAdmin({ sbUser, sbToken, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview"); // overview | users | activity | urls

  // Only render for superuser
  if (sbUser?.email !== SUPERUSER_EMAIL) return null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin", {
      headers: { Authorization: `Bearer ${sbToken}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [sbToken]);

  if (loading) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, fontSize: 14 }}>Loading analytics...</div>
    </div>
  );

  if (error) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40 }}>
        <div style={{ color: "var(--red)", marginBottom: 12 }}>Error: {error}</div>
        <button onClick={onClose} className="btn btn-secondary">Close</button>
      </div>
    </div>
  );

  if (!data) return null;

  const s = data.summary;
  const c = data.costs?.total || {};
  const l = data.learnings || {};
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "learnings", label: "Learnings" },
    { id: "costs", label: `Costs ($${(c.cost||0).toFixed(2)})` },
    { id: "users", label: `Users (${s.total_users})` },
    { id: "usage", label: "Usage" },
    { id: "activity", label: "Activity" },
    { id: "urls", label: `URLs (${s.unique_seller_urls})` },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "90%", maxWidth: 900, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-0)" }}>Superuser Dashboard</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Real-time engagement analytics</div>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Tokens Used", value: s.total_runs, color: "var(--ink-0)" },
                  { label: "Max Tokens", value: s.total_max_runs, color: "#8B5CF6" },
                  { label: "Organizations", value: s.total_orgs, color: "var(--navy)" },
                  { label: "Unique Sellers", value: s.unique_seller_urls, color: "var(--green)" },
                  { label: "Milton Messages", value: s.total_milton_messages || 0, color: "#cc2222" },
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

          {/* ═══ LEARNINGS ═══ */}
          {tab === "learnings" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Total Cost", value: `$${c.cost?.toFixed(2)}`, color: "var(--ink-0)" },
                  { label: "API Calls", value: c.api_calls?.toLocaleString(), color: "var(--navy)" },
                  { label: "Input Tokens", value: `${(c.input_tokens / 1000).toFixed(0)}K`, color: "var(--green)" },
                  { label: "Output Tokens", value: `${(c.output_tokens / 1000).toFixed(0)}K`, color: "var(--amber)" },
                  { label: "Web Searches", value: c.web_searches, color: "#8B5CF6" },
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
                  {(data.costs.by_user || []).map((u, i) => (
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
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.model.includes("opus") ? "#8B5CF6" : "var(--green)", fontFamily: "Lora,serif" }}>${m.cost.toFixed(3)}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{m.calls} calls · {(m.input / 1000).toFixed(0)}K in · {(m.output / 1000).toFixed(0)}K out</div>
                  </div>
                ))}
              </div>

              {/* Cost by day */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Daily Cost</div>
              {(data.costs.by_day || []).slice(0, 14).map((d, i) => (
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
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--line-0)", textAlign: "left" }}>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>User</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Org</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Plan</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Sessions</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Last Active</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Milton</th>
                    <th style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase" }}>Seller URLs</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.sort((a, b) => (b.session_count || 0) - (a.session_count || 0)).map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--line-0)" }}>
                      <td style={{ padding: "8px 6px" }}>
                        <div style={{ fontWeight: 600, color: "var(--ink-0)" }}>{u.name || "—"}</div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{u.email}</div>
                      </td>
                      <td style={{ padding: "8px 6px", color: "var(--ink-1)" }}>{u.org_name || "—"}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10,
                          background: u.org_plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)",
                          color: u.org_plan === "paid" ? "var(--green)" : "var(--amber)" }}>
                          {u.org_plan || "trial"}
                        </span>
                      </td>
                      <td style={{ padding: "8px 6px", fontWeight: 600, color: "var(--ink-0)" }}>{u.session_count}</td>
                      <td style={{ padding: "8px 6px", color: "var(--ink-3)" }}>{timeAgo(u.last_active)}</td>
                      <td style={{ padding: "8px 6px", fontWeight: 600, color: u.milton_messages > 0 ? "#cc2222" : "var(--ink-3)" }}>{u.milton_messages || 0}</td>
                      <td style={{ padding: "8px 6px", fontSize: 11, color: "var(--ink-3)" }}>
                        {u.seller_urls.slice(0, 3).join(", ") || "—"}
                        {u.seller_urls.length > 3 && ` +${u.seller_urls.length - 3}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ═══ ACTIVITY ═══ */}
          {tab === "activity" && (
            <div>
              {data.recent_activity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: (Date.now() - new Date(a.updated_at).getTime()) < 86400000 ? "var(--green)" : "var(--line-0)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{a.session_name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{a.user_name}</span>
                      {a.user_email && <span> ({a.user_email})</span>}
                      {a.seller_url && <span> · {a.seller_url}</span>}
                      {a.milton_messages > 0 && <span style={{ color: "#cc2222" }}> · {a.milton_messages} Milton msgs</span>}
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
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
                  {data.orgs.sort((a, b) => (b.run_count || 0) - (a.run_count || 0)).map(o => (
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
                        <span style={{ fontWeight: 600, color: "#8B5CF6" }}>{o.max_run_count}</span>
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
                <div><span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Lora,serif", color: "#8B5CF6" }}>{s.total_max_runs}</span> <span style={{ fontSize: 11, color: "var(--ink-3)" }}>max tokens</span></div>
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
