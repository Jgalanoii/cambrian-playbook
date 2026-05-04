// src/components/OrgPanel.jsx
// Combined org settings, user management, and team sessions panel.
// Renders as a slide-out drawer from the header.

import React, { useState, useEffect } from "react";
import { fetchOrgMembers, fetchOrgInvitations, sbPatch, sbRpc } from "../lib/org.js";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function OrgPanel({ orgCtx, setOrgCtx, sbUser, sbToken, onClose }) {
  const [tab, setTab] = useState("members"); // members | settings | sessions
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("rep");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");
  const [orgName, setOrgName] = useState(orgCtx?.name || "");
  const [orgSellerUrl, setOrgSellerUrl] = useState(orgCtx?.seller_url || "");
  const [teamSessions, setTeamSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionFilter, setSessionFilter] = useState(""); // user_id filter
  const [confirmAction, setConfirmAction] = useState(null); // {type, userId, name}

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

  const sendInvite = async () => {
    if (!inviteEmail.trim() || !isAdmin) return;
    setInviteLoading(true);
    setInviteMsg("");
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbToken}` },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const data = await res.json();
      if (data.ok) {
        setInviteMsg("Invitation sent to " + inviteEmail.trim());
        setInviteEmail("");
        fetchOrgInvitations(orgCtx.id, sbToken).then(setInvitations);
      } else {
        setInviteMsg("Error: " + (data.error || "Failed to send invitation"));
      }
    } catch (e) {
      setInviteMsg("Error: " + e.message);
    }
    setInviteLoading(false);
  };

  const changeRole = async (userId, newRole) => {
    if (!isAdmin) return;
    await sbPatch(`users?id=eq.${userId}`, sbToken, { role: newRole });
    fetchOrgMembers(orgCtx.id, sbToken).then(setMembers);
  };

  const removeUser = async (userId) => {
    if (!isAdmin) return;
    // Remove from org by setting org_id to null
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
      setInviteMsg(data.ok ? `Re-sent invitation to ${inv.email}` : "Error: " + (data.error || "Failed"));
    } catch { setInviteMsg("Error resending"); }
    setInviteLoading(false);
    setTimeout(() => setInviteMsg(""), 4000);
  };

  const loadTeamSessions = async () => {
    if (!canViewTeam) return;
    setSessionsLoading(true);
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/sessions?select=id,name,seller_url,updated_at,user_id&order=updated_at.desc&limit=100`,
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

  const roleColor = (r) =>
    r === "admin" ? "var(--navy)" : r === "manager" ? "var(--amber)" : "var(--green)";
  const roleBg = (r) =>
    r === "admin" ? "var(--navy-bg)" : r === "manager" ? "var(--amber-bg)" : "var(--green-bg)";

  const timeAgo = (dateStr) => {
    if (!dateStr) return "never";
    const ago = Date.now() - new Date(dateStr).getTime();
    if (ago < 60000) return "just now";
    if (ago < 3600000) return `${Math.floor(ago / 60000)}m ago`;
    if (ago < 86400000) return `${Math.floor(ago / 3600000)}h ago`;
    if (ago < 604800000) return `${Math.floor(ago / 86400000)}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const tabs = [
    { id: "members", label: `Team (${members.length})`, show: canViewTeam },
    { id: "settings", label: "Settings", show: true },
    { id: "sessions", label: "Sessions", show: canViewTeam },
  ].filter(t => t.show);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />

      <div onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
        position: "relative", zIndex: 1, width: 480, maxWidth: "90vw", background: "var(--surface)",
        borderLeft: "1px solid var(--line-0)", display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.1)", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Lora,serif", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>Organization</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              {orgCtx?.name || "Your Org"} · {members.length} member{members.length !== 1 ? "s" : ""}
              {orgCtx?.plan && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: orgCtx.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)", color: orgCtx.plan === "paid" ? "var(--green)" : "var(--amber)" }}>{orgCtx.plan}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--ink-2)" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--line-0)", padding: "0 20px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
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

          {/* ═══ MEMBERS TAB ═══ */}
          {tab === "members" && canViewTeam && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Invite form (admin only) */}
              {isAdmin && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-0)", marginBottom: 10 }}>Invite a Team Member</div>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com" type="email"
                    style={{ width: "100%", fontSize: 14, padding: "10px 14px", border: "1.5px solid var(--line-0)", borderRadius: 8, boxSizing: "border-box", marginBottom: 10 }}
                    onKeyDown={e => { if (e.key === "Enter") sendInvite(); e.stopPropagation(); }} />
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      style={{ fontSize: 13, padding: "9px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8, flex: 1 }}>
                      <option value="rep">Rep — build briefs, use playbook</option>
                      <option value="manager">Manager — view team sessions & reports</option>
                      <option value="admin">Admin — full access, invites & settings</option>
                    </select>
                    <button onClick={sendInvite} disabled={inviteLoading || !inviteEmail.trim()}
                      style={{ padding: "9px 20px", borderRadius: 8, background: "var(--ink-0)", color: "var(--surface)", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: inviteLoading || !inviteEmail.trim() ? 0.5 : 1, whiteSpace: "nowrap" }}>
                      {inviteLoading ? "Sending..." : "Send Invite"}
                    </button>
                  </div>
                  {inviteMsg && (
                    <div style={{ fontSize: 12, color: inviteMsg.startsWith("Error") ? "var(--red)" : "var(--green)", marginTop: 8, fontWeight: 600 }}>
                      {inviteMsg}
                    </div>
                  )}
                </div>
              )}

              {/* Members list */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                  Active Members
                </div>
                {members.map(m => {
                  const sessions = memberSessionCount(m.id);
                  const lastSession = teamSessions.filter(s => s.user_id === m.id).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
                  return (
                    <div key={m.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      background: m.id === sbUser?.id ? "var(--bg-1)" : "#fff",
                      border: "1px solid var(--line-0)", borderRadius: 10, marginBottom: 6,
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", background: roleColor(m.role), color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, fontFamily: "Lora,serif", flexShrink: 0,
                      }}>
                        {(m.name || m.email || "").split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "··"}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", display: "flex", alignItems: "center", gap: 6 }}>
                          {m.name || m.email?.split("@")[0]}
                          {m.id === sbUser?.id && <span style={{ fontSize: 9, color: "var(--ink-3)", fontWeight: 400 }}>(you)</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.email}</div>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2, display: "flex", gap: 8 }}>
                          {sessions > 0 && <span>{sessions} session{sessions !== 1 ? "s" : ""}</span>}
                          {lastSession && <span>Active {timeAgo(lastSession.updated_at)}</span>}
                          {!sessions && !lastSession && <span>No activity yet</span>}
                        </div>
                      </div>

                      {/* Role + actions */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        {isAdmin && m.id !== sbUser?.id ? (
                          <select value={m.role} onChange={e => changeRole(m.id, e.target.value)}
                            style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--line-0)", background: roleBg(m.role), color: roleColor(m.role), fontWeight: 700 }}>
                            <option value="rep">Rep</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: roleBg(m.role), color: roleColor(m.role) }}>
                            {m.role}
                          </span>
                        )}
                        {isAdmin && m.id !== sbUser?.id && (
                          <button onClick={() => setConfirmAction({ type: "remove", userId: m.id, name: m.name || m.email })}
                            style={{ fontSize: 10, color: "var(--red)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pending invitations */}
              {isAdmin && invitations.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Pending Invitations ({invitations.length})
                  </div>
                  {invitations.map(inv => (
                    <div key={inv.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      background: "var(--amber-bg)", border: "1px solid var(--amber)", borderRadius: 10, marginBottom: 6,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--amber)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                        ✉
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>{inv.email}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                          {inv.role} · expires {new Date(inv.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <button onClick={() => resendInvite(inv)} disabled={inviteLoading}
                          style={{ fontSize: 10, color: "var(--ink-1)", background: "none", border: "1px solid var(--line-0)", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontWeight: 600 }}>
                          Resend
                        </button>
                        <button onClick={() => revokeInvite(inv.id)}
                          style={{ fontSize: 10, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Usage summary */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                  Org Token Usage
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-0)", fontFamily: "Lora,serif" }}>{orgCtx?.run_count || 0}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>/ {orgCtx?.run_limit || 5} tokens this month</span>
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
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#8B5CF6", fontFamily: "Lora,serif" }}>⚡ {orgCtx?.max_run_count || 0}</span>
                    <span style={{ fontSize: 11, color: "var(--ink-3)" }}>/ {orgCtx?.max_run_limit} Max tokens</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ SETTINGS TAB ═══ */}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Organization Name</div>
                {isAdmin ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveOrgName(); e.stopPropagation(); }}
                      style={{ flex: 1, fontSize: 14, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }} />
                    <button onClick={saveOrgName}
                      style={{ padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: "var(--ink-1)" }}>{orgCtx?.name}</div>
                )}
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>Default Seller URL</div>
                <div style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 6 }}>Pre-fills new sessions for all team members</div>
                {isAdmin ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={orgSellerUrl} onChange={e => setOrgSellerUrl(e.target.value)} placeholder="https://yourcompany.com"
                      style={{ flex: 1, fontSize: 13, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }}
                      onKeyDown={e => { if (e.key === "Enter") saveOrgSellerUrl(); e.stopPropagation(); }} />
                    <button onClick={saveOrgSellerUrl}
                      style={{ padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--ink-1)" }}>{orgCtx?.seller_url || "Not set"}</div>
                )}
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Your Role</div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: roleBg(orgCtx?.userRole), color: roleColor(orgCtx?.userRole), border: `1px solid ${roleColor(orgCtx?.userRole)}44` }}>
                  {orgCtx?.userRole || "rep"}
                </span>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Plan</div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: orgCtx?.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)", color: orgCtx?.plan === "paid" ? "var(--green)" : "var(--amber)" }}>
                  {orgCtx?.plan || "trial"}
                </span>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                  {orgCtx?.run_limit || 5} tokens/month · {(orgCtx?.max_run_limit || 0) > 0 ? `${orgCtx.max_run_limit} Max tokens` : "Max not included"}
                </div>
              </div>

              <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6, borderTop: "1px solid var(--line-0)", paddingTop: 12 }}>
                Need to upgrade, add tokens, or change your plan? Contact <a href="mailto:info@cambriancatalyst.com" style={{ color: "var(--tan-0)" }}>info@cambriancatalyst.com</a>
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
                    <option key={m.id} value={m.id}>{m.name || m.email} ({teamSessions.filter(s => s.user_id === m.id).length})</option>
                  ))}
                </select>
              )}

              {teamSessions.length === 0 && !sessionsLoading && (
                <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 20 }}>
                  No team sessions yet.
                </div>
              )}
              {teamSessions
                .filter(s => !sessionFilter || s.user_id === sessionFilter)
                .map(s => {
                  const isRecent = (Date.now() - new Date(s.updated_at).getTime()) < 86400000;
                  const member = members.find(m => m.id === s.user_id);
                  return (
                    <div key={s.id} style={{ padding: "10px 12px", background: "#fff", border: "1px solid var(--line-0)", borderRadius: 8, marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isRecent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name || "Untitled"}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{member?.name || member?.email || "Unknown"}</span>
                            {member?.role && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 10, background: roleBg(member.role), color: roleColor(member.role) }}>{member.role}</span>}
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

          {!canViewTeam && tab !== "settings" && (
            <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 20 }}>
              Team features are available for managers and admins.
            </div>
          )}
        </div>
      </div>

      {/* Confirm dialog for destructive actions */}
      {confirmAction && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-0)", marginBottom: 8 }}>
              Remove {confirmAction.name}?
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 20 }}>
              This will remove them from your organization. They'll lose access to team sessions and shared resources. They can be re-invited later.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmAction(null)}
                style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid var(--line-0)", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => removeUser(confirmAction.userId)}
                style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--red)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
