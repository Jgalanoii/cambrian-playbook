// src/components/OrgPanel.jsx
// Enterprise-grade org settings, user management, and team administration.
// Renders as a slide-out drawer from the header.

import React, { useState, useEffect } from "react";
import { fetchOrgMembers, fetchOrgInvitations, sbPatch, sbRpc } from "../lib/org.js";
import { timeAgo } from "../lib/utils.js";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── ROLE DEFINITIONS ──
const ROLE_META = {
  admin: {
    label: "Admin", color: "var(--navy)", bg: "var(--navy-bg)",
    permissions: ["Build briefs & run the full playbook", "See how the team is prepping", "Invite & remove members", "Change roles", "Edit org settings", "Manage run limits"],
  },
  manager: {
    label: "Manager", color: "var(--amber)", bg: "var(--amber-bg)",
    permissions: ["Build briefs & run the full playbook", "See how the team is prepping"],
  },
  rep: {
    label: "Rep", color: "var(--green)", bg: "var(--green-bg)",
    permissions: ["Build briefs & run the full playbook"],
  },
};

export default function OrgPanel({ orgCtx, setOrgCtx, sbUser, sbToken, onClose }) {
  const [tab, setTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("rep");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");
  const [orgName, setOrgName] = useState(orgCtx?.name || "");
  const [orgSellerUrl, setOrgSellerUrl] = useState(orgCtx?.seller_url || "");
  const [teamSessions, setTeamSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionFilter, setSessionFilter] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [memberSearch, setMemberSearch] = useState("");

  const isAdmin = orgCtx?.userRole === "admin";
  const isManager = orgCtx?.userRole === "manager";
  const canViewTeam = isAdmin || isManager;

  useEffect(() => {
    if (!orgCtx?.id || !sbToken) return;
    if (canViewTeam) {
      fetchOrgMembers(orgCtx.id, sbToken).then(setMembers);
      fetchOrgInvitations(orgCtx.id, sbToken).then(setInvitations);
    }
  }, [orgCtx?.id, sbToken, canViewTeam]);

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
          setInviteMsg("Invitation created — use the invite link to share directly.");
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

  const memberName = (userId) => {
    const m = members.find(m => m.id === userId);
    return m ? (m.name || m.email) : userId?.slice(0, 8);
  };
  const memberSessionCount = (userId) => teamSessions.filter(s => s.user_id === userId).length;
  const memberLastActive = (userId) => {
    const s = teamSessions.filter(s => s.user_id === userId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
    return s?.updated_at || null;
  };

  const r = (role) => ROLE_META[role] || ROLE_META.rep;
  const filteredMembers = members.filter(m => {
    if (!memberSearch) return true;
    const q = memberSearch.toLowerCase();
    return (m.name || "").toLowerCase().includes(q) || (m.email || "").toLowerCase().includes(q) || (m.role || "").includes(q);
  });

  const tabs = [
    { id: "members", label: `Team (${members.length})`, show: canViewTeam },
    { id: "invite", label: `Invite${invitations.length ? ` (${invitations.length})` : ""}`, show: isAdmin },
    { id: "roles", label: "Roles & Access", show: canViewTeam },
    { id: "sessions", label: "Sessions", show: canViewTeam },
    { id: "settings", label: "Settings", show: true },
  ].filter(t => t.show);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />

      <div onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
        position: "relative", zIndex: 1, width: "min(520px, 94vw)", background: "var(--surface)",
        borderLeft: "1px solid var(--line-0)", display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.1)", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Lora,serif", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>Your Selling Organization</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
              {orgCtx?.name || "Your Company"} · {members.length === 1 ? "just you (for now)" : `${members.length} members`}
              {orgCtx?.plan && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: orgCtx.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)", color: orgCtx.plan === "paid" ? "var(--green)" : "var(--amber)" }}>{orgCtx.plan}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--ink-2)" }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--line-0)", padding: "0 16px", overflowX: "auto", gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "10px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                background: "none", border: "none", fontFamily: "inherit",
                color: tab === t.id ? "var(--ink-0)" : "var(--ink-3)",
                borderBottom: tab === t.id ? "2.5px solid var(--tan-0)" : "2.5px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>

          {/* ═══ TEAM TAB ═══ */}
          {tab === "members" && canViewTeam && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Search */}
              {members.length > 3 && (
                <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search members..." style={{ fontSize: 13, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8, width: "100%", boxSizing: "border-box" }}
                  onKeyDown={e => e.stopPropagation()} />
              )}

              {/* Summary bar */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["admin", "manager", "rep"].map(role => {
                  const count = members.filter(m => m.role === role).length;
                  if (!count) return null;
                  return (
                    <span key={role} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: r(role).bg, color: r(role).color }}>
                      {count} {r(role).label}{count !== 1 ? "s" : ""}
                    </span>
                  );
                })}
              </div>

              {/* Members list */}
              {filteredMembers.map(m => {
                const sessions = memberSessionCount(m.id);
                const lastActive = memberLastActive(m.id);
                return (
                  <div key={m.id} style={{
                    background: m.id === sbUser?.id ? "var(--bg-1)" : "var(--surface)",
                    border: "1px solid var(--line-0)", borderRadius: 10, padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: r(m.role).color, color: "var(--surface)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, fontFamily: "Lora,serif", flexShrink: 0,
                      }}>
                        {(m.name || m.email || "").split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "··"}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-0)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          {m.name || m.email?.split("@")[0]}
                          {m.id === sbUser?.id && <span style={{ fontSize: 9, color: "var(--ink-3)", fontWeight: 400 }}>(you)</span>}
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: r(m.role).bg, color: r(m.role).color }}>
                            {r(m.role).label}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{m.email}</div>

                        {/* Stats row */}
                        <div style={{ display: "flex", gap: 12, fontSize: 10, color: "var(--ink-2)", marginTop: 6, flexWrap: "wrap" }}>
                          <span>{sessions} session{sessions !== 1 ? "s" : ""}</span>
                          <span>Active {lastActive ? timeAgo(lastActive) : "never"}</span>
                          {m.created_at && <span>Joined {new Date(m.created_at).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      {isAdmin && m.id !== sbUser?.id && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                          <select value={m.role} onChange={e => changeRole(m.id, e.target.value)}
                            style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--line-0)", background: r(m.role).bg, color: r(m.role).color, fontWeight: 700 }}>
                            <option value="rep">Rep</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button onClick={() => setConfirmAction({ type: "remove", userId: m.id, name: m.name || m.email })}
                            style={{ fontSize: 10, color: "var(--red)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            Remove from org
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredMembers.length === 0 && memberSearch && (
                <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 20 }}>No members match "{memberSearch}"</div>
              )}

              {/* Usage summary */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                  Run Usage This Month
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-0)", fontFamily: "Lora,serif" }}>{orgCtx?.run_count || 0}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>/ {orgCtx?.run_limit || 5} standard runs</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "var(--bg-2)", overflow: "hidden", marginTop: 4 }}>
                  <div style={{
                    height: "100%", borderRadius: 3, transition: "width 0.3s",
                    width: Math.min(100, Math.round((orgCtx?.run_count || 0) / (orgCtx?.run_limit || 5) * 100)) + "%",
                    background: (orgCtx?.run_count || 0) >= (orgCtx?.run_limit || 5) ? "var(--red)"
                      : (orgCtx?.run_count || 0) >= (orgCtx?.run_limit || 5) * 0.8 ? "var(--amber)" : "var(--green)",
                  }} />
                </div>
                {(orgCtx?.max_run_limit || 0) > 0 && (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--violet)", fontFamily: "Lora,serif" }}>⚡ {orgCtx?.max_run_count || 0}</span>
                    <span style={{ fontSize: 11, color: "var(--ink-3)" }}>/ {orgCtx?.max_run_limit} Max runs</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ INVITE TAB ═══ */}
          {tab === "invite" && isAdmin && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Mode toggle */}
              <div style={{ display: "flex", gap: 0, border: "1.5px solid var(--line-0)", borderRadius: 8, overflow: "hidden" }}>
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
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px" }}>
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
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px" }}>
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
                <div style={{ fontSize: 12, color: inviteMsg.startsWith("Error") ? "var(--red)" : "var(--green)", fontWeight: 600, padding: "8px 12px", background: inviteMsg.startsWith("Error") ? "var(--red-bg)" : "var(--green-bg)", borderRadius: 8 }}>
                  {inviteMsg}
                </div>
              )}

              {/* Pending invitations */}
              {invitations.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Pending Invitations ({invitations.length})
                  </div>
                  {invitations.map(inv => (
                    <div key={inv.id} style={{ background: "var(--amber-bg)", border: "1px solid var(--amber)", borderRadius: 10, marginBottom: 6, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--amber)", color: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✉</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{inv.email}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                            {r(inv.role).label} · expires {new Date(inv.expires_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
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
                      </div>
                      {inv.token && (
                        <div style={{ marginTop: 8, fontSize: 10, color: "var(--ink-3)", background: "var(--surface)", borderRadius: 6, padding: "6px 10px", wordBreak: "break-all", cursor: "pointer" }}
                          onClick={() => copyInviteLink(inv.token)} title="Click to copy">
                          {getInviteLink(inv.token)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {invitations.length === 0 && (
                <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 16 }}>No pending invitations. Invite your team — they'll thank you after their first brief.</div>
              )}
            </div>
          )}

          {/* ═══ ROLES & ACCESS TAB ═══ */}
          {tab === "roles" && canViewTeam && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 }}>
                Who can see what, and who can change what. Only admins can adjust roles, invite members, or edit org settings.
              </div>

              {/* Role permission matrix */}
              {["admin", "manager", "rep"].map(role => {
                const meta = ROLE_META[role];
                const count = members.filter(m => m.role === role).length;
                return (
                  <div key={role} style={{ border: `1.5px solid ${meta.color}44`, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ background: meta.bg, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                        <span style={{ fontSize: 10, color: "var(--ink-3)" }}>{count} member{count !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div style={{ padding: "10px 14px" }}>
                      {meta.permissions.map((p, i) => (
                        <div key={i} style={{ fontSize: 12, color: "var(--ink-1)", padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: meta.color, fontSize: 10 }}>✓</span> {p}
                        </div>
                      ))}
                    </div>
                    {/* Members in this role */}
                    {count > 0 && (
                      <div style={{ borderTop: "1px solid var(--line-0)", padding: "8px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {members.filter(m => m.role === role).map(m => (
                          <span key={m.id} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "var(--bg-1)", color: "var(--ink-1)", fontWeight: 600 }}>
                            {m.name || m.email?.split("@")[0]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Access audit log */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginTop: 8 }}>
                Access Summary
              </div>
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px", fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ color: "var(--ink-2)" }}>Total members</span>
                  <span style={{ fontWeight: 700 }}>{members.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ color: "var(--ink-2)" }}>Pending invitations</span>
                  <span style={{ fontWeight: 700, color: invitations.length > 0 ? "var(--amber)" : "var(--ink-0)" }}>{invitations.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ color: "var(--ink-2)" }}>Active last 7 days</span>
                  <span style={{ fontWeight: 700, color: "var(--green)" }}>
                    {members.filter(m => { const la = memberLastActive(m.id); return la && (Date.now() - new Date(la).getTime()) < 7 * 86400000; }).length}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--line-0)" }}>
                  <span style={{ color: "var(--ink-2)" }}>Never active</span>
                  <span style={{ fontWeight: 700, color: members.filter(m => !memberLastActive(m.id)).length > 0 ? "var(--red)" : "var(--ink-0)" }}>
                    {members.filter(m => !memberLastActive(m.id)).length}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ color: "var(--ink-2)" }}>Total sessions (all users)</span>
                  <span style={{ fontWeight: 700 }}>{teamSessions.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SESSIONS TAB ═══ */}
          {tab === "sessions" && canViewTeam && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Team Sessions</div>
                <button onClick={loadTeamSessions} disabled={sessionsLoading}
                  style={{ fontSize: 11, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer" }}>
                  {sessionsLoading ? "Loading..." : "↻ Refresh"}
                </button>
              </div>

              {members.length > 1 && (
                <select value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}
                  style={{ width: "100%", fontSize: 12, padding: "7px 10px", border: "1.5px solid var(--line-0)", borderRadius: 8, marginBottom: 10, color: sessionFilter ? "var(--ink-0)" : "var(--ink-3)" }}>
                  <option value="">All team members ({teamSessions.length})</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name || m.email} ({memberSessionCount(m.id)})</option>
                  ))}
                </select>
              )}

              {teamSessions.length === 0 && !sessionsLoading && (
                <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 20 }}>No team sessions yet. Once your team starts running briefs, you'll see every session here.</div>
              )}
              {teamSessions
                .filter(s => !sessionFilter || s.user_id === sessionFilter)
                .map(s => {
                  const isRecent = (Date.now() - new Date(s.updated_at).getTime()) < 86400000;
                  const member = members.find(m => m.id === s.user_id);
                  return (
                    <div key={s.id} style={{ padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--line-0)", borderRadius: 8, marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isRecent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name || "Untitled"}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{member?.name || member?.email || "Unknown"}</span>
                            {member?.role && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 10, background: r(member.role).bg, color: r(member.role).color }}>{r(member.role).label}</span>}
                            <span>·</span>
                            <span>{s.seller_url || "no URL"}</span>
                            <span>·</span>
                            <span>{timeAgo(s.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* ═══ SETTINGS TAB ═══ */}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px", marginBottom: 4 }}>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 0 }}>
                  Your organization is your <strong style={{ color: "var(--ink-0)" }}>selling company</strong> — the company you represent when running briefs. Everyone in your org shares runs, sessions, and team features.
                </div>
              </div>
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
                  <div style={{ fontSize: 14, color: "var(--ink-1)" }}>{orgCtx?.name}</div>
                )}
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>Company Website</div>
                <div style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 6 }}>Your company's website — pre-fills new sessions and helps match new teammates automatically</div>
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

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Your Role</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: r(orgCtx?.userRole).bg, color: r(orgCtx?.userRole).color }}>
                    {r(orgCtx?.userRole).label}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{ROLE_META[orgCtx?.userRole]?.permissions?.length || 0} permissions</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Plan</div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: orgCtx?.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)", color: orgCtx?.plan === "paid" ? "var(--green)" : "var(--amber)" }}>
                  {orgCtx?.plan || "trial"}
                </span>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                  {orgCtx?.run_limit || 5} runs/month · {(orgCtx?.max_run_limit || 0) > 0 ? `${orgCtx.max_run_limit} Max runs` : "Max not included"}
                </div>
              </div>

              <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6, borderTop: "1px solid var(--line-0)", paddingTop: 12 }}>
                Need more runs, a plan change, or just want to talk? <a href="mailto:info@cambriancatalyst.com" style={{ color: "var(--tan-0)" }}>info@cambriancatalyst.com</a> — we reply fast.
              </div>
            </div>
          )}

          {!canViewTeam && tab !== "settings" && (
            <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 20 }}>
              Team visibility is a manager or admin perk. Ask your admin to level you up if you need it.
            </div>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmAction && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "24px 28px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
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
