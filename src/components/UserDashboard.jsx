// src/components/UserDashboard.jsx — Full-page dashboard for regular users
// Combines OrgPanel (team, invites, settings) and ReportPanel (analytics, insights)
// into a single two-column layout using admin-* CSS classes from App.css.

import React, { useState, useEffect, useMemo } from "react";
import { fetchOrgMembers, fetchOrgInvitations, sbPatch } from "../lib/org.js";
import { timeAgo } from "../lib/utils.js";

// ── ReferralWidget (same as OrgPanel) ──
function ReferralWidget({ sbToken }) {
  const [info, setInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!sbToken) return;
    fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
      body: JSON.stringify({ action: "get_referral_info" }) })
      .then(r => r.json()).then(d => { if (d.ok) setInfo(d); }).catch(() => {});
  }, [sbToken]);
  if (!info) return <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Loading referral info...</div>;
  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
        <input readOnly value={info.referral_link} style={{ flex: 1, fontSize: 11, padding: "6px 10px", border: "1.5px solid var(--line-0)", borderRadius: 6, background: "var(--bg-1)", color: "var(--ink-1)" }} />
        <button onClick={() => { navigator.clipboard.writeText(info.referral_link); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ padding: "6px 12px", borderRadius: 6, border: "1.5px solid var(--tan-0)", background: copied ? "var(--green-bg)" : "var(--surface)", color: copied ? "var(--green)" : "var(--tan-0)", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--ink-2)" }}>
        <span><strong style={{ color: "var(--ink-0)" }}>{info.total_referred}</strong> referred</span>
        <span><strong style={{ color: "var(--green)" }}>{info.total_rewarded}</strong> earned runs</span>
        <span><strong style={{ color: "var(--tan-0)" }}>{info.bonus_runs_this_month}</strong>/{info.bonus_cap} bonus this month</span>
      </div>
    </div>
  );
}

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const ROLE_META = {
  admin: { label: "Admin", color: "var(--navy)", bg: "var(--navy-bg)" },
  manager: { label: "Manager", color: "var(--amber)", bg: "var(--amber-bg)" },
  rep: { label: "Rep", color: "var(--green)", bg: "var(--green-bg)" },
};
const r = (role) => ROLE_META[role] || ROLE_META.rep;

// Lazy import OrgPanel for no-org users
import OrgPanel from "./OrgPanel.jsx";

export default function UserDashboard({ orgCtx, setOrgCtx, sbUser, sbToken, savedSessions, onClose }) {
  // If user has no org, show the simplified OrgPanel (has "Create Organization" flow)
  if (!orgCtx) return <OrgPanel orgCtx={orgCtx} setOrgCtx={setOrgCtx} sbUser={sbUser} sbToken={sbToken} onClose={onClose} />;

  const [tab, setTab] = useState("dashboard");

  // ── Team data ──
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [teamSessions, setTeamSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionFilter, setSessionFilter] = useState("");

  // ── Invite state ──
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("rep");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");

  // ── Settings state ──
  const [orgName, setOrgName] = useState(orgCtx?.name || "");
  const [orgSellerUrl, setOrgSellerUrl] = useState(orgCtx?.seller_url || "");

  // ── UI state ──
  const [confirmAction, setConfirmAction] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const isAdmin = orgCtx?.userRole === "admin";
  const isManager = orgCtx?.userRole === "manager";
  const canViewTeam = isAdmin || isManager;

  // ── Load team data on mount ──
  useEffect(() => {
    if (!orgCtx?.id || !sbToken) return;
    if (canViewTeam) {
      fetchOrgMembers(orgCtx.id, sbToken).then(setMembers);
      fetchOrgInvitations(orgCtx.id, sbToken).then(setInvitations);
    }
  }, [orgCtx?.id, sbToken, canViewTeam]);

  // ── Load team sessions when Sessions tab is selected ──
  const loadTeamSessions = async () => {
    if (!canViewTeam) return;
    setSessionsLoading(true);
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/sessions?select=id,name,seller_url,updated_at,created_at,user_id&order=updated_at.desc&limit=200`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}` } }
      );
      const rows = await res.json();
      setTeamSessions(Array.isArray(rows) ? rows : []);
    } catch { setTeamSessions([]); }
    setSessionsLoading(false);
  };

  useEffect(() => {
    if (tab === "sessions" && canViewTeam && teamSessions.length === 0) loadTeamSessions();
  }, [tab]);

  // ── Close dot menu on outside click ──
  useEffect(() => {
    if (openMenu === null) return;
    const handler = () => setOpenMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenu]);

  // ── Helpers ──
  const memberName = (userId) => {
    const m = members.find(m => m.id === userId);
    return m ? (m.name || m.email) : userId?.slice(0, 8);
  };
  const memberLastActive = (userId) => {
    const s = teamSessions.filter(s => s.user_id === userId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
    return s?.updated_at || null;
  };

  const usagePct = Math.min(100, Math.round((orgCtx?.run_count || 0) / (orgCtx?.run_limit || 5) * 100));
  const usageColor = (orgCtx?.run_count || 0) >= (orgCtx?.run_limit || 5)
    ? "var(--red)"
    : (orgCtx?.run_count || 0) >= (orgCtx?.run_limit || 5) * 0.8
      ? "var(--amber)"
      : "var(--green)";

  // ── Settings actions ──
  const saveOrgName = async () => {
    if (!orgName.trim() || !isAdmin) return;
    const result = await sbPatch(`orgs?id=eq.${orgCtx.id}`, sbToken, { name: orgName.trim() });
    if (result?.[0]) setOrgCtx(prev => ({ ...prev, name: orgName.trim() }));
  };
  const saveOrgSellerUrl = async () => {
    if (!isAdmin) return;
    const result = await sbPatch(`orgs?id=eq.${orgCtx.id}`, sbToken, { seller_url: orgSellerUrl.trim() });
    if (result?.[0]) setOrgCtx(prev => ({ ...prev, seller_url: orgSellerUrl.trim() }));
  };

  // ── Invite actions ──
  const APP_URL = import.meta.env.VITE_APP_URL || "https://www.cambriancatalyst.ai";
  const getInviteLink = (token) => `${APP_URL}?token=${token}`;
  const copyInviteLink = (token) => {
    navigator.clipboard.writeText(getInviteLink(token));
    setInviteMsg("Invite link copied to clipboard");
    setTimeout(() => setInviteMsg(""), 3000);
  };

  const sendInvite = async (emailOverride) => {
    const email = emailOverride || inviteEmail.trim();
    if (!email || !isAdmin) return;
    setInviteLoading(true);
    if (!emailOverride) setInviteMsg("");
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
        body: JSON.stringify({ email: email.toLowerCase(), role: inviteRole }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.email_sent === false) {
          setInviteMsg("Invitation created -- use the invite link to share directly.");
        } else {
          setInviteMsg("Invitation sent to " + email);
        }
        if (!emailOverride) setInviteEmail("");
        fetchOrgInvitations(orgCtx.id, sbToken).then(setInvitations);
        return true;
      } else {
        setInviteMsg("Error: " + (data.error || "Failed to send invitation"));
        return false;
      }
    } catch (e) {
      setInviteMsg("Error: " + e.message);
      return false;
    } finally {
      setInviteLoading(false);
    }
  };

  const sendBulkInvites = async () => {
    const emails = bulkEmails.split(/[\n,;]+/).map(e => e.trim().toLowerCase()).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e));
    if (!emails.length) { setInviteMsg("No valid emails found. Enter one per line."); return; }
    setInviteLoading(true);
    setInviteMsg("");
    let sent = 0, failed = 0;
    for (const email of emails) {
      const ok = await sendInvite(email);
      if (ok) sent++; else failed++;
    }
    setInviteMsg(`Bulk invite complete: ${sent} sent${failed ? `, ${failed} failed` : ""}`);
    setBulkEmails("");
    setInviteLoading(false);
  };

  const changeRole = async (userId, newRole) => {
    if (!isAdmin) return;
    await sbPatch(`users?id=eq.${userId}`, sbToken, { role: newRole });
    fetchOrgMembers(orgCtx.id, sbToken).then(setMembers);
  };

  const removeUser = async (userId) => {
    if (!isAdmin) return;
    await sbPatch(`users?id=eq.${userId}`, sbToken, { org_id: null, role: "rep" });
    fetchOrgMembers(orgCtx.id, sbToken).then(setMembers);
    setConfirmAction(null);
  };

  const revokeInvite = async (invId) => {
    if (!isAdmin) return;
    await fetch(`${SB_URL}/rest/v1/invitations?id=eq.${invId}`, {
      method: "DELETE",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}` },
    });
    fetchOrgInvitations(orgCtx.id, sbToken).then(setInvitations);
  };

  const resendInvite = async (inv) => {
    if (!isAdmin) return;
    setInviteLoading(true);
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
        body: JSON.stringify({ email: inv.email, role: inv.role }),
      });
      const data = await res.json();
      setInviteMsg(data.ok ? `Re-sent to ${inv.email}` : "Error: " + (data.error || "Failed"));
    } catch { setInviteMsg("Error resending"); }
    setInviteLoading(false);
    setTimeout(() => setInviteMsg(""), 4000);
  };

  // ── Analytics (from ReportPanel) ──
  const analytics = useMemo(() => {
    const sessions = savedSessions || [];
    const now = Date.now();
    const totalSessions = sessions.length;
    const activeLast7d = sessions.filter(s => (now - new Date(s.updated_at).getTime()) < 604800000).length;

    const dealRoutes = { FAST_TRACK: 0, NURTURE: 0, DISQUALIFY: 0 };
    let totalDeals = 0;
    const icpEdits = {};
    const intelAdj = [];

    sessions.forEach(s => {
      const d = s.data;
      if (!d) return;
      if (d.postCall?.dealRoute) {
        dealRoutes[d.postCall.dealRoute] = (dealRoutes[d.postCall.dealRoute] || 0) + 1;
        totalDeals++;
      }
      (d.icpEdits || []).forEach(e => {
        icpEdits[e.field] = (icpEdits[e.field] || 0) + 1;
      });
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
      dealRoutes,
      totalDeals,
      fastTrackRate: totalDeals > 0 ? Math.round(dealRoutes.FAST_TRACK / totalDeals * 100) : 0,
      disqualifyRate: totalDeals > 0 ? Math.round(dealRoutes.DISQUALIFY / totalDeals * 100) : 0,
      topEditedFields,
      intelAdj,
    };
  }, [savedSessions]);

  // ── Sidebar nav ──
  const navGroups = [
    {
      label: "OVERVIEW",
      items: [{ id: "dashboard", label: "Dashboard" }],
    },
    {
      label: "MY COMPANY",
      items: [
        { id: "team", label: "Team", show: canViewTeam },
        { id: "invite", label: "Invite", show: isAdmin },
        { id: "settings", label: "Settings", show: true },
      ].filter(i => i.show),
    },
    {
      label: "ANALYTICS",
      items: [
        { id: "sessions", label: "Sessions", show: canViewTeam },
        { id: "insights", label: "Insights", show: true },
      ].filter(i => i.show),
    },
  ];

  return (
    <div className="admin-shell">
      {/* ── Header ── */}
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "Lora,serif", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>
            {orgCtx?.name || "Your Organization"}
          </div>
          <span className="admin-badge" style={{
            background: isAdmin ? "var(--navy-bg)" : isManager ? "var(--amber-bg)" : "var(--green-bg)",
            color: isAdmin ? "var(--navy)" : isManager ? "var(--amber)" : "var(--green)",
            fontSize: 9, letterSpacing: "0.5px", textTransform: "uppercase",
          }}>
            {isAdmin ? "Admin" : isManager ? "Manager" : "Rep"}
          </span>
          {orgCtx?.plan && (
            <span className="admin-badge" style={{
              background: orgCtx.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)",
              color: orgCtx.plan === "paid" ? "var(--green)" : "var(--amber)",
            }}>
              {orgCtx.plan}
            </span>
          )}
        </div>
        <button onClick={onClose}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1.5px solid var(--ink-0)", background: "var(--ink-0)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--surface)" }}>
          &larr; Back to App
        </button>
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

          {/* ═══ DASHBOARD ═══ */}
          {tab === "dashboard" && (
            <div>
              <div className="admin-section-title">Dashboard</div>
              <div className="admin-section-sub">Your organization at a glance</div>

              {/* Metric cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
                <div className="admin-metric">
                  <div className="admin-metric-num" style={{ color: usageColor }}>{orgCtx?.run_count || 0}/{orgCtx?.run_limit || 5}</div>
                  <div className="admin-metric-label">Runs Used</div>
                </div>
                <div className="admin-metric">
                  <div className="admin-metric-num" style={{ color: "var(--ink-0)" }}>{analytics.totalSessions}</div>
                  <div className="admin-metric-label">Sessions</div>
                </div>
                <div className="admin-metric">
                  <div className="admin-metric-num" style={{ color: "var(--green)" }}>{analytics.activeLast7d}</div>
                  <div className="admin-metric-label">Active This Week</div>
                </div>
                <div className="admin-metric">
                  <div className="admin-metric-num" style={{ color: "var(--navy)" }}>{members.length || 1}</div>
                  <div className="admin-metric-label">Team Members</div>
                </div>
              </div>

              {/* Run usage progress bar */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-0)" }}>Run Usage This Month</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: usageColor }}>{orgCtx?.run_count || 0} / {orgCtx?.run_limit || 5}</div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, transition: "width 0.3s", background: usageColor, width: usagePct + "%" }} />
                </div>
                {(orgCtx?.max_run_limit || 0) > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--violet)" }}>Max Runs</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--violet)" }}>{orgCtx?.max_run_count || 0} / {orgCtx.max_run_limit}</div>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, background: "var(--violet)", transition: "width 0.3s",
                        width: Math.min(100, Math.round((orgCtx.max_run_count || 0) / (orgCtx.max_run_limit || 1) * 100)) + "%" }} />
                    </div>
                  </>
                )}
              </div>

              {/* Recent sessions table */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Recent Sessions</div>
                {(savedSessions || []).length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Seller URL</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(savedSessions || []).slice(0, 8).map(s => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 600, color: "var(--ink-0)" }}>{s.name || "Untitled"}</td>
                          <td style={{ color: "var(--ink-3)", fontSize: 11 }}>{s.seller_url || "--"}</td>
                          <td style={{ color: "var(--ink-3)" }}>{timeAgo(s.updated_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "24px 0" }}>
                    No sessions yet. Run your first brief to see it here.
                  </div>
                )}
              </div>

              {/* Referral widget */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tan-0)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Refer & Earn</div>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 8 }}>
                  Share your referral link. When someone signs up and runs their first brief, your org gets <strong>+1 bonus run</strong> (up to 5/month).
                </div>
                <ReferralWidget sbToken={sbToken} />
              </div>
            </div>
          )}

          {/* ═══ TEAM ═══ */}
          {tab === "team" && canViewTeam && (
            <div>
              <div className="admin-section-title">Team</div>
              <div className="admin-section-sub">{members.length} member{members.length !== 1 ? "s" : ""} in your organization</div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name / Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    {isAdmin && <th style={{ width: 40 }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => {
                    const lastActive = memberLastActive(m.id);
                    const status = lastActive ? "Active" : "Never active";
                    return (
                      <tr key={m.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--ink-0)" }}>
                            {m.name || m.email?.split("@")[0]}
                            {m.id === sbUser?.id && <span style={{ fontSize: 9, color: "var(--ink-3)", fontWeight: 400, marginLeft: 4 }}>(you)</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.email}</div>
                        </td>
                        <td>
                          {isAdmin && m.id !== sbUser?.id ? (
                            <select value={m.role} onChange={e => changeRole(m.id, e.target.value)}
                              style={{ fontSize: 11, padding: "3px 6px", borderRadius: 4, border: "1px solid var(--line-0)", fontWeight: 600, cursor: "pointer", background: r(m.role).bg, color: r(m.role).color }}>
                              <option value="rep">Rep</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className="admin-badge" style={{ background: r(m.role).bg, color: r(m.role).color }}>
                              {r(m.role).label}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="admin-badge" style={{
                            background: lastActive ? "var(--green-bg)" : "var(--bg-2)",
                            color: lastActive ? "var(--green)" : "var(--ink-3)",
                          }}>
                            {status}
                          </span>
                        </td>
                        <td style={{ color: "var(--ink-3)" }}>{lastActive ? timeAgo(lastActive) : "--"}</td>
                        {isAdmin && (
                          <td style={{ position: "relative" }}>
                            {m.id !== sbUser?.id && (
                              <>
                                <button className="admin-dot-menu" onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === m.id ? null : m.id); }}>
                                  &#8943;
                                </button>
                                {openMenu === m.id && (
                                  <div className="admin-action-menu">
                                    <button className="admin-action-item danger"
                                      onClick={() => { setConfirmAction({ type: "remove", userId: m.id, name: m.name || m.email }); setOpenMenu(null); }}>
                                      Remove from org
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {members.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "24px 0" }}>No team members found.</div>
              )}
            </div>
          )}

          {tab === "team" && !canViewTeam && (
            <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "40px 0" }}>
              Team visibility is a manager or admin perk. Ask your admin to level you up if you need it.
            </div>
          )}

          {/* ═══ INVITE (admin only) ═══ */}
          {tab === "invite" && isAdmin && (
            <div>
              <div className="admin-section-title">Invite Team Members</div>
              <div className="admin-section-sub">Add colleagues to your organization</div>

              {/* Mode toggle */}
              <div style={{ display: "flex", gap: 0, border: "1.5px solid var(--line-0)", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
                <button onClick={() => setBulkMode(false)}
                  style={{ flex: 1, padding: "8px 12px", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                    background: !bulkMode ? "var(--ink-0)" : "var(--surface)", color: !bulkMode ? "var(--surface)" : "var(--ink-2)" }}>
                  Single Invite
                </button>
                <button onClick={() => setBulkMode(true)}
                  style={{ flex: 1, padding: "8px 12px", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                    background: bulkMode ? "var(--ink-0)" : "var(--surface)", color: bulkMode ? "var(--surface)" : "var(--ink-2)" }}>
                  Bulk Invite
                </button>
              </div>

              {/* Single invite */}
              {!bulkMode && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com" type="email"
                    style={{ width: "100%", fontSize: 14, padding: "10px 14px", border: "1.5px solid var(--line-0)", borderRadius: 8, boxSizing: "border-box", marginBottom: 10 }}
                    onKeyDown={e => { if (e.key === "Enter") sendInvite(); e.stopPropagation(); }} />
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      style={{ fontSize: 13, padding: "9px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8, flex: 1 }}>
                      <option value="rep">Rep</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => sendInvite()} disabled={inviteLoading || !inviteEmail.trim()}
                      style={{ padding: "9px 20px", borderRadius: 8, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: inviteLoading || !inviteEmail.trim() ? 0.5 : 1, whiteSpace: "nowrap" }}>
                      {inviteLoading ? "Sending..." : "Send Invite"}
                    </button>
                  </div>
                </div>
              )}

              {/* Bulk invite */}
              {bulkMode && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-1)", marginBottom: 6 }}>Enter email addresses (one per line, or comma-separated)</div>
                  <textarea value={bulkEmails} onChange={e => setBulkEmails(e.target.value)}
                    placeholder={"alice@company.com\nbob@company.com\ncharlie@company.com"}
                    rows={6} style={{ width: "100%", fontSize: 13, padding: "10px 14px", border: "1.5px solid var(--line-0)", borderRadius: 8, boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit", resize: "vertical" }}
                    onKeyDown={e => e.stopPropagation()} />
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      style={{ fontSize: 13, padding: "9px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }}>
                      <option value="rep">Rep</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div style={{ flex: 1, fontSize: 11, color: "var(--ink-3)" }}>
                      {bulkEmails.split(/[\n,;]+/).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())).length} valid emails
                    </div>
                    <button onClick={sendBulkInvites} disabled={inviteLoading || !bulkEmails.trim()}
                      style={{ padding: "9px 20px", borderRadius: 8, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: inviteLoading || !bulkEmails.trim() ? 0.5 : 1, whiteSpace: "nowrap" }}>
                      {inviteLoading ? "Sending..." : "Send All"}
                    </button>
                  </div>
                </div>
              )}

              {inviteMsg && (
                <div style={{ fontSize: 12, color: inviteMsg.startsWith("Error") ? "var(--red)" : "var(--green)", fontWeight: 600, padding: "8px 12px", background: inviteMsg.startsWith("Error") ? "var(--red-bg)" : "var(--green-bg)", borderRadius: 8, marginBottom: 16 }}>
                  {inviteMsg}
                </div>
              )}

              {/* Pending invitations */}
              {invitations.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Pending Invitations ({invitations.length})
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Expires</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map(inv => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 600, color: "var(--ink-0)" }}>{inv.email}</td>
                          <td>
                            <span className="admin-badge" style={{ background: r(inv.role).bg, color: r(inv.role).color }}>
                              {r(inv.role).label}
                            </span>
                          </td>
                          <td style={{ color: "var(--ink-3)", fontSize: 11 }}>{new Date(inv.expires_at).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => copyInviteLink(inv.token)}
                                style={{ fontSize: 10, color: "var(--navy)", background: "var(--navy-bg)", border: "1px solid var(--navy)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}>
                                Copy link
                              </button>
                              <button onClick={() => resendInvite(inv)} disabled={inviteLoading}
                                style={{ fontSize: 10, color: "var(--ink-1)", background: "none", border: "1px solid var(--line-0)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}>
                                Resend
                              </button>
                              <button onClick={() => revokeInvite(inv.id)}
                                style={{ fontSize: 10, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: "3px 4px" }}>
                                Revoke
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {invitations.length === 0 && (
                <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 16 }}>
                  No pending invitations. Invite your team -- they will thank you after their first brief.
                </div>
              )}
            </div>
          )}

          {/* ═══ SETTINGS ═══ */}
          {tab === "settings" && (
            <div>
              <div className="admin-section-title">Settings</div>
              <div className="admin-section-sub">Organization details and plan information</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Company name */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Company Name</div>
                  {isAdmin ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={orgName} onChange={e => setOrgName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveOrgName(); e.stopPropagation(); }}
                        style={{ flex: 1, fontSize: 14, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }} />
                      <button onClick={saveOrgName}
                        style={{ padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 14, color: "var(--ink-1)" }}>{orgCtx?.name || "--"}</div>
                  )}
                </div>

                {/* Company website */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>Company Website</div>
                  <div style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 6 }}>Your company's website -- pre-fills new sessions and helps match new teammates automatically</div>
                  {isAdmin ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={orgSellerUrl} onChange={e => setOrgSellerUrl(e.target.value)} placeholder="https://yourcompany.com"
                        style={{ flex: 1, fontSize: 13, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }}
                        onKeyDown={e => { if (e.key === "Enter") saveOrgSellerUrl(); e.stopPropagation(); }} />
                      <button onClick={saveOrgSellerUrl}
                        style={{ padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "var(--ink-1)" }}>{orgCtx?.seller_url || "Not set"}</div>
                  )}
                </div>

                {/* Your role */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Your Role</div>
                  <span className="admin-badge" style={{ background: r(orgCtx?.userRole).bg, color: r(orgCtx?.userRole).color }}>
                    {r(orgCtx?.userRole).label}
                  </span>
                </div>

                {/* Plan */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Plan</div>
                  <span className="admin-badge" style={{
                    background: orgCtx?.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)",
                    color: orgCtx?.plan === "paid" ? "var(--green)" : "var(--amber)",
                  }}>
                    {orgCtx?.plan || "trial"}
                  </span>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                    {orgCtx?.run_limit || 5} runs/month{(orgCtx?.max_run_limit || 0) > 0 ? ` + ${orgCtx.max_run_limit} Max runs` : ""}
                  </div>
                </div>

                {/* Run usage */}
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-0)" }}>Run Usage</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: usageColor }}>{orgCtx?.run_count || 0} / {orgCtx?.run_limit || 5}</div>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, transition: "width 0.3s", background: usageColor, width: usagePct + "%" }} />
                  </div>
                </div>

                {/* Refer & Earn */}
                <div style={{ borderTop: "1px solid var(--line-0)", paddingTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tan-0)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Refer & Earn</div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 8 }}>
                    Share your referral link. When someone signs up and runs their first brief, your org gets <strong>+1 bonus run</strong> (up to 5/month).
                  </div>
                  <ReferralWidget sbToken={sbToken} />
                </div>

                {/* Contact */}
                <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6, borderTop: "1px solid var(--line-0)", paddingTop: 12 }}>
                  Need more runs, a plan change, or just want to talk? <a href="mailto:info@cambriancatalyst.com" style={{ color: "var(--tan-0)" }}>info@cambriancatalyst.com</a> -- we reply fast.
                </div>
              </div>
            </div>
          )}

          {/* ═══ SESSIONS ═══ */}
          {tab === "sessions" && canViewTeam && (
            <div>
              <div className="admin-section-title">Sessions</div>
              <div className="admin-section-sub">All team sessions across your organization</div>

              {/* Filter by member */}
              {members.length > 1 && (
                <div className="admin-filters">
                  <select value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}
                    style={{ color: sessionFilter ? "var(--ink-0)" : "var(--ink-3)" }}>
                    <option value="">All team members ({teamSessions.length})</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name || m.email} ({teamSessions.filter(s => s.user_id === m.id).length})</option>
                    ))}
                  </select>
                </div>
              )}

              {sessionsLoading && (
                <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "24px 0" }}>Loading sessions...</div>
              )}

              {!sessionsLoading && teamSessions.length > 0 && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: 20 }}></th>
                      <th>Session</th>
                      <th>User</th>
                      <th>Seller URL</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamSessions
                      .filter(s => !sessionFilter || s.user_id === sessionFilter)
                      .map(s => {
                        const isRecent = (Date.now() - new Date(s.updated_at).getTime()) < 86400000;
                        const member = members.find(m => m.id === s.user_id);
                        return (
                          <tr key={s.id}>
                            <td style={{ textAlign: "center" }}>
                              {isRecent && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />}
                            </td>
                            <td style={{ fontWeight: 600, color: "var(--ink-0)" }}>{s.name || "Untitled"}</td>
                            <td>
                              <div style={{ fontSize: 12, color: "var(--ink-1)", fontWeight: 600 }}>{member?.name || member?.email || "Unknown"}</div>
                              {member?.role && (
                                <span className="admin-badge" style={{ background: r(member.role).bg, color: r(member.role).color, marginTop: 2 }}>
                                  {r(member.role).label}
                                </span>
                              )}
                            </td>
                            <td style={{ color: "var(--ink-3)", fontSize: 11 }}>{s.seller_url || "--"}</td>
                            <td style={{ color: "var(--ink-3)" }}>{timeAgo(s.updated_at)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}

              {!sessionsLoading && teamSessions.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "24px 0" }}>
                  No team sessions yet. Once your team starts running briefs, every session appears here.
                </div>
              )}
            </div>
          )}

          {tab === "sessions" && !canViewTeam && (
            <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "40px 0" }}>
              Team session visibility requires a manager or admin role.
            </div>
          )}

          {/* ═══ INSIGHTS ═══ */}
          {tab === "insights" && (
            <div>
              <div className="admin-section-title">Insights</div>
              <div className="admin-section-sub">Deal routing patterns, ICP accuracy, and intel adjustments</div>

              {/* Deal routing distribution */}
              {analytics.totalDeals > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 10 }}>Deal Routing Distribution</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[
                      { label: "Fast Track", count: analytics.dealRoutes.FAST_TRACK, pct: analytics.fastTrackRate, color: "var(--green)", bg: "var(--green-bg)" },
                      { label: "Nurture", count: analytics.dealRoutes.NURTURE, pct: analytics.totalDeals > 0 ? Math.round(analytics.dealRoutes.NURTURE / analytics.totalDeals * 100) : 0, color: "var(--amber)", bg: "var(--amber-bg)" },
                      { label: "Disqualify", count: analytics.dealRoutes.DISQUALIFY, pct: analytics.disqualifyRate, color: "var(--red)", bg: "var(--red-bg)" },
                    ].map(dr => (
                      <div key={dr.label} className="admin-metric" style={{ background: dr.bg, border: `1px solid ${dr.color}22` }}>
                        <div className="admin-metric-num" style={{ color: dr.color }}>{dr.count}</div>
                        <div className="admin-metric-label" style={{ color: dr.color }}>{dr.label} ({dr.pct}%)</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Most corrected ICP fields */}
              {analytics.topEditedFields.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Most Corrected ICP Fields
                    <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Fields you edit most -- helps us improve accuracy</span>
                  </div>
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
              )}

              {/* Intel adjustments */}
              {analytics.intelAdj.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Intel Adjustments Applied
                    <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--ink-3)" }}>Fit score overrides applied by your team</span>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Modifier</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.intelAdj.slice(0, 15).map((adj, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: "var(--ink-0)" }}>{adj.company}</td>
                          <td style={{ fontWeight: 700, color: adj.modifier > 0 ? "var(--green)" : "var(--red)" }}>
                            {adj.modifier > 0 ? "+" : ""}{adj.modifier}
                          </td>
                          <td style={{ color: "var(--ink-3)" }}>{adj.reason || "--"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {analytics.totalDeals === 0 && analytics.topEditedFields.length === 0 && analytics.intelAdj.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 13, padding: "32px 0" }}>
                  Complete more sessions and this fills up -- deal routing patterns, ICP corrections, intel adjustments.
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ── Confirm dialog ── */}
      {confirmAction && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "24px 28px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>Warning</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-0)", marginBottom: 8 }}>
              Remove {confirmAction.name}?
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 20 }}>
              They will lose access to this organization's sessions, data, and runs. This action can be reversed by re-inviting them.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmAction(null)}
                style={{ padding: "8px 20px", borderRadius: 8, border: "1.5px solid var(--line-0)", background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--ink-2)" }}>Cancel</button>
              <button onClick={() => removeUser(confirmAction.userId)}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--red)", color: "var(--surface)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
