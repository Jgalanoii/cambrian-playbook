// src/components/OrgPanel.jsx
// Combined org settings, user management, and team sessions panel.
// Renders as a slide-out drawer from the header.

import React, { useState, useEffect } from "react";
import { fetchOrgMembers, fetchOrgInvitations, sbPatch, sbRpc } from "../lib/org.js";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function OrgPanel({ orgCtx, setOrgCtx, sbUser, sbToken, onClose }) {
  const [tab, setTab] = useState("settings"); // settings | members | sessions
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sbToken}`,
        },
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

  const revokeInvite = async (invId) => {
    if (!isAdmin) return;
    await fetch(`${SB_URL}/rest/v1/invitations?id=eq.${invId}`, {
      method: "DELETE",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${sbToken}` },
    });
    fetchOrgInvitations(orgCtx.id, sbToken).then(setInvitations);
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

  const roleColor = (r) =>
    r === "admin" ? "var(--navy)" : r === "manager" ? "var(--amber)" : "var(--green)";
  const roleBg = (r) =>
    r === "admin" ? "var(--navy-bg)" : r === "manager" ? "var(--amber-bg)" : "var(--green-bg)";

  const tabs = [
    { id: "settings", label: "Settings", show: true },
    { id: "members", label: "Team", show: canViewTeam },
    { id: "sessions", label: "Sessions", show: canViewTeam },
  ].filter(t => t.show);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />

      {/* Panel — stopPropagation prevents backdrop click from stealing input focus */}
      <div onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
        position: "relative", zIndex: 1, width: 460, maxWidth: "90vw", background: "var(--surface)",
        borderLeft: "1px solid var(--line-0)", display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.1)", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Lora,serif", fontSize: 18, fontWeight: 700, color: "var(--ink-0)" }}>Organization</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{orgCtx?.name || "Your Org"}</div>
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

          {/* ═══ SETTINGS TAB ═══ */}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Org name */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Organization Name</div>
                {isAdmin ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)}
                      style={{ flex: 1, fontSize: 14, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }} />
                    <button onClick={saveOrgName}
                      style={{ padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: "var(--ink-1)" }}>{orgCtx?.name}</div>
                )}
              </div>

              {/* Default Seller URL */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>Default Seller URL</div>
                <div style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 6 }}>Pre-fills new sessions for all team members</div>
                {isAdmin ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={orgSellerUrl} onChange={e => setOrgSellerUrl(e.target.value)}
                      placeholder="https://yourcompany.com"
                      style={{ flex: 1, fontSize: 13, padding: "8px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8 }}
                      onKeyDown={e => e.key === "Enter" && saveOrgSellerUrl()} />
                    <button onClick={saveOrgSellerUrl}
                      style={{ padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--ink-1)" }}>{orgCtx?.seller_url || "Not set"}</div>
                )}
              </div>

              {/* Plan + Usage */}
              <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Usage</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px",
                    padding: "2px 8px", borderRadius: 20,
                    background: orgCtx?.plan === "paid" ? "var(--green-bg)" : "var(--amber-bg)",
                    color: orgCtx?.plan === "paid" ? "var(--green)" : "var(--amber)",
                    border: `1px solid ${orgCtx?.plan === "paid" ? "var(--green)" : "var(--amber)"}44`,
                  }}>
                    {orgCtx?.plan || "trial"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "var(--ink-0)", fontFamily: "Lora,serif" }}>{orgCtx?.run_count || 0}</span>
                  <span style={{ fontSize: 14, color: "var(--ink-3)" }}>/ {orgCtx?.run_limit || 5} tokens this month</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--bg-2)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, transition: "width 0.3s",
                    width: Math.min(100, Math.round((orgCtx?.run_count || 0) / (orgCtx?.run_limit || 5) * 100)) + "%",
                    background: (orgCtx?.run_count || 0) >= (orgCtx?.run_limit || 5) ? "var(--red)"
                      : (orgCtx?.run_count || 0) >= (orgCtx?.run_limit || 5) * 0.8 ? "var(--amber)" : "var(--green)",
                  }} />
                </div>
                {/* Max runs */}
                {(orgCtx?.max_run_limit || 0) > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#8B5CF6", fontFamily: "Lora,serif" }}>⚡ {orgCtx?.max_run_count || 0}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-3)" }}>/ {orgCtx?.max_run_limit} Max tokens</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "var(--bg-2)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 2, transition: "width 0.3s",
                        width: Math.min(100, Math.round((orgCtx?.max_run_count || 0) / (orgCtx?.max_run_limit || 1) * 100)) + "%",
                        background: (orgCtx?.max_run_count || 0) >= (orgCtx?.max_run_limit || 0) ? "var(--red)" : "#8B5CF6",
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
                      Cambrian Max uses Opus for deeper, richer intelligence on your most important deals.
                    </div>
                  </div>
                )}
                {(orgCtx?.max_run_limit || 0) === 0 && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink-3)", fontStyle: "italic" }}>
                    ⚡ Cambrian Max not included in your plan. Upgrade to unlock premium Opus intelligence.
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 5 }}>Your Role</div>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: roleBg(orgCtx?.userRole), color: roleColor(orgCtx?.userRole),
                  border: `1px solid ${roleColor(orgCtx?.userRole)}44`,
                }}>
                  {orgCtx?.userRole || "rep"}
                </span>
              </div>
            </div>
          )}

          {/* ═══ MEMBERS TAB ═══ */}
          {tab === "members" && canViewTeam && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Invite form (admin only) */}
              {isAdmin && (
                <div style={{ background: "var(--bg-1)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Invite a Team Member</div>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="email@company.com" type="email"
                    style={{ width: "100%", fontSize: 13, padding: "10px 12px", border: "1.5px solid var(--line-0)", borderRadius: 8, marginBottom: 8, boxSizing: "border-box" }}
                    onKeyDown={e => e.key === "Enter" && sendInvite()} />
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      style={{ fontSize: 12, padding: "8px 10px", border: "1.5px solid var(--line-0)", borderRadius: 8 }}>
                      <option value="rep">Rep</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={sendInvite} disabled={inviteLoading || !inviteEmail.trim()}
                      style={{
                        flex: 1, padding: "8px 16px", borderRadius: 8, background: "var(--ink-0)", color: "#fff",
                        border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        opacity: inviteLoading || !inviteEmail.trim() ? 0.5 : 1,
                      }}>
                      {inviteLoading ? "Sending..." : "Invite"}
                    </button>
                  </div>
                  {inviteMsg && (
                    <div style={{ fontSize: 12, color: inviteMsg.startsWith("Error") ? "var(--red)" : "var(--green)", marginTop: 4 }}>
                      {inviteMsg}
                    </div>
                  )}
                </div>
              )}

              {/* Members list */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                  Team Members ({members.length})
                </div>
                {members.map(m => (
                  <div key={m.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    background: m.id === sbUser?.id ? "var(--bg-1)" : "#fff",
                    border: "1px solid var(--line-0)", borderRadius: 8, marginBottom: 6,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", background: roleColor(m.role), color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, fontFamily: "Lora,serif", flexShrink: 0,
                    }}>
                      {(m.name || m.email || "").split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "··"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)" }}>
                        {m.name || m.email}{m.id === sbUser?.id ? " (you)" : ""}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.email}</div>
                    </div>
                    {isAdmin && m.id !== sbUser?.id ? (
                      <select value={m.role} onChange={e => changeRole(m.id, e.target.value)}
                        style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--line-0)" }}>
                        <option value="rep">Rep</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                        background: roleBg(m.role), color: roleColor(m.role),
                      }}>
                        {m.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Pending invitations */}
              {isAdmin && invitations.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>
                    Pending Invitations ({invitations.length})
                  </div>
                  {invitations.map(inv => (
                    <div key={inv.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                      background: "var(--amber-bg)", border: "1px solid var(--amber)", borderRadius: 8, marginBottom: 6,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{inv.email}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                          {inv.role} · expires {new Date(inv.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button onClick={() => revokeInvite(inv.id)}
                        style={{ fontSize: 11, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ SESSIONS TAB ═══ */}
          {tab === "sessions" && canViewTeam && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Team Sessions
                </div>
                <button onClick={loadTeamSessions} disabled={sessionsLoading}
                  style={{ fontSize: 11, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer" }}>
                  {sessionsLoading ? "Loading..." : "↻ Refresh"}
                </button>
              </div>

              {/* Filter by team member */}
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
                  No team sessions yet. Sessions appear here when team members save their work.
                </div>
              )}
              {teamSessions
                .filter(s => !sessionFilter || s.user_id === sessionFilter)
                .map(s => {
                  const ago = Date.now() - new Date(s.updated_at).getTime();
                  const isRecent = ago < 86400000; // 24 hours
                  const timeStr = ago < 60000 ? "just now"
                    : ago < 3600000 ? `${Math.floor(ago/60000)}m ago`
                    : ago < 86400000 ? `${Math.floor(ago/3600000)}h ago`
                    : ago < 604800000 ? `${Math.floor(ago/86400000)}d ago`
                    : new Date(s.updated_at).toLocaleDateString();
                  const member = members.find(m => m.id === s.user_id);
                  return (
                    <div key={s.id} style={{
                      padding: "10px 12px", background: "#fff", border: "1px solid var(--line-0)",
                      borderRadius: 8, marginBottom: 6,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isRecent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} title="Active in last 24h" />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.name || "Untitled"}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{member?.name || member?.email || "Unknown"}</span>
                            {member?.role && (
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 10, background: roleBg(member.role), color: roleColor(member.role) }}>
                                {member.role}
                              </span>
                            )}
                            <span>·</span>
                            <span>{s.seller_url || "no URL"}</span>
                            <span>·</span>
                            <span>{timeStr}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Rep role — no team access */}
          {!canViewTeam && tab !== "settings" && (
            <div style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", padding: 20 }}>
              Team features are available for managers and admins.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
