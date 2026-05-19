// api/hubspot.js
//
// Unified HubSpot CRM integration endpoint.
// Combines OAuth flow, status, and data push into one serverless function
// to stay within Vercel Hobby plan's 12-function limit.
//
// GET  /api/hubspot?code=...&state=...  → OAuth callback
// POST /api/hubspot { action: "start" | "status" | "disconnect" | "push_postcall" | "push_brief" }

import { isAllowedOrigin, verifyJwt, decodeJwtPayload, checkRateLimit } from "./_guard.js";
import {
  isConfigured, buildAuthUrl, signState, verifyState,
  exchangeCodeForTokens, getPortalInfo, saveTokenForUser,
  getTokenForUser, deleteTokenForUser, hubspotFetch,
} from "./_hubspot.js";

const APP_URL = process.env.VITE_APP_URL || "https://www.cambriancatalyst.ai";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DEAL_STAGE_MAP = {
  FAST_TRACK: "qualifiedtobuy",
  NURTURE: "appointmentscheduled",
  DISQUALIFY: "closedlost",
};

function cleanDomain(d) {
  if (!d) return "";
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].split("?")[0];
}

// ── HubSpot CRM helpers ────────────────────────────────────────────────

async function findCompanyByDomain(userId, domain) {
  const r = await hubspotFetch(userId, "/crm/v3/objects/companies/search", {
    method: "POST",
    body: { filterGroups: [{ filters: [{ propertyName: "domain", operator: "EQ", value: domain }] }], properties: ["name", "domain"], limit: 1 },
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data?.results?.[0] || null;
}

async function upsertCompany(userId, company) {
  const domain = cleanDomain(company.domain);
  const properties = { name: company.name || "", domain };
  if (company.industry) properties.industry = company.industry;
  if (company.employees) properties.numberofemployees = String(company.employees).replace(/[^0-9]/g, "");
  if (company.revenue) { const rev = String(company.revenue).replace(/[^0-9.]/g, ""); if (rev) properties.annualrevenue = rev; }

  const existing = await findCompanyByDomain(userId, domain);
  if (existing) {
    const r = await hubspotFetch(userId, `/crm/v3/objects/companies/${existing.id}`, { method: "PATCH", body: { properties } });
    return { id: (r.ok ? (await r.json()).id : existing.id), created: false };
  }
  const r = await hubspotFetch(userId, "/crm/v3/objects/companies", { method: "POST", body: { properties } });
  if (!r.ok) { console.error("[hubspot] Company create failed:", r.status); return null; }
  return { id: (await r.json()).id, created: true };
}

async function createDeal(userId, { companyName, dealRoute, confidence, companyId }) {
  const properties = { dealname: `${companyName} — Cambrian`, dealstage: DEAL_STAGE_MAP[dealRoute] || "appointmentscheduled", pipeline: "default" };
  if (confidence) properties.hs_deal_score = String(confidence);
  const associations = companyId ? [{ to: { id: companyId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 5 }] }] : [];
  const r = await hubspotFetch(userId, "/crm/v3/objects/deals", { method: "POST", body: { properties, associations } });
  if (!r.ok) { console.error("[hubspot] Deal create failed:", r.status); return null; }
  return { id: (await r.json()).id };
}

async function createNote(userId, { body, companyId, dealId }) {
  const associations = [];
  if (companyId) associations.push({ to: { id: companyId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 190 }] });
  if (dealId) associations.push({ to: { id: dealId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 214 }] });
  const r = await hubspotFetch(userId, "/crm/v3/objects/notes", { method: "POST", body: { properties: { hs_timestamp: new Date().toISOString(), hs_note_body: body }, associations } });
  if (!r.ok) { console.error("[hubspot] Note create failed:", r.status); return null; }
  return { id: (await r.json()).id };
}

async function createTasks(userId, { steps, dealId, companyId }) {
  let created = 0;
  for (const step of (steps || []).slice(0, 10)) {
    if (!step || typeof step !== "string" || step.length < 3) continue;
    const associations = [];
    if (dealId) associations.push({ to: { id: dealId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }] });
    if (companyId) associations.push({ to: { id: companyId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 192 }] });
    const r = await hubspotFetch(userId, "/crm/v3/objects/tasks", { method: "POST", body: { properties: { hs_timestamp: new Date().toISOString(), hs_task_subject: step.slice(0, 200), hs_task_status: "NOT_STARTED", hs_task_priority: "MEDIUM", hs_task_type: "TODO" }, associations } });
    if (r.ok) created++;
  }
  return created;
}

// ── Main handler ───────────────────────────────────────────────────────

export default async function handler(req, res) {
  // ── GET: OAuth callback from HubSpot ─────────────────────────────────
  if (req.method === "GET") {
    if (!isConfigured()) return res.redirect(302, `${APP_URL}?hubspot=error&reason=not_configured`);
    const { code, state } = req.query || {};
    if (!state || !code) return res.redirect(302, `${APP_URL}?hubspot=error&reason=missing_params`);

    const statePayload = verifyState(state);
    if (!statePayload?.userId) return res.redirect(302, `${APP_URL}?hubspot=error&reason=invalid_state`);
    if (statePayload.ts && Date.now() - statePayload.ts > 600_000) return res.redirect(302, `${APP_URL}?hubspot=error&reason=expired`);

    const userId = statePayload.userId;
    const redirectUri = `${APP_URL}/api/hubspot`;

    try {
      const tokenData = await exchangeCodeForTokens(code, redirectUri);
      if (!tokenData?.access_token) return res.redirect(302, `${APP_URL}?hubspot=error&reason=token_exchange`);
      const portalInfo = await getPortalInfo(tokenData.access_token);
      await saveTokenForUser(userId, { accessToken: tokenData.access_token, refreshToken: tokenData.refresh_token, expiresIn: tokenData.expires_in, portalId: portalInfo?.portalId, scopes: portalInfo?.scopes });
      console.log(`[hubspot] Connected user ${userId} to portal ${portalInfo?.portalId}`);
      return res.redirect(302, `${APP_URL}?hubspot=connected`);
    } catch (e) {
      console.error("[hubspot] Callback error:", e.message);
      return res.redirect(302, `${APP_URL}?hubspot=error&reason=server_error`);
    }
  }

  // ── POST: all other actions ──────────────────────────────────────────
  if (req.method !== "POST") return res.status(405).end();

  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });

  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Too many requests" });

  if (!await verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });
  const authToken = (req.headers.authorization || "").slice(7);
  const payload = decodeJwtPayload(authToken);
  if (!payload?.sub || !UUID_RE.test(payload.sub)) return res.status(401).json({ error: "Authentication required" });

  const userId = payload.sub;
  if (!isConfigured()) return res.status(500).json({ error: "HubSpot integration not configured" });

  const { action, data } = req.body || {};

  try {
    // ── OAuth: start ───────────────────────────────────────────────────
    if (action === "start") {
      const state = signState({ userId, ts: Date.now() });
      const redirectUri = `${APP_URL}/api/hubspot`;
      const url = buildAuthUrl(redirectUri, state);
      return res.json({ url });
    }

    // ── OAuth: status ──────────────────────────────────────────────────
    if (action === "status") {
      const tokens = await getTokenForUser(userId);
      if (!tokens) return res.json({ connected: false });
      return res.json({ connected: true, portalId: tokens.portalId });
    }

    // ── OAuth: disconnect ──────────────────────────────────────────────
    if (action === "disconnect") {
      await deleteTokenForUser(userId);
      return res.json({ ok: true });
    }

    // ── Push: post-call ────────────────────────────────────────────────
    if (action === "push_postcall") {
      if (!data?.company?.name) return res.status(400).json({ error: "Company name required" });
      const { company, crmNote, dealRoute, dealRisk, nextSteps, confidence } = data;
      const created = { companies: 0, deals: 0, notes: 0, tasks: 0 };

      const companyResult = await upsertCompany(userId, company);
      if (!companyResult) return res.status(502).json({ error: "Failed to create company in HubSpot" });
      if (companyResult.created) created.companies = 1;

      const dealResult = await createDeal(userId, { companyName: company.name, dealRoute: dealRoute || "NURTURE", confidence, companyId: companyResult.id });
      if (dealResult) created.deals = 1;

      if (crmNote) {
        const noteResult = await createNote(userId, { body: `[Cambrian Catalyst — Post-Call Analysis]\n\n${crmNote}`, companyId: companyResult.id, dealId: dealResult?.id });
        if (noteResult) created.notes = 1;
      }

      if (nextSteps?.length) created.tasks = await createTasks(userId, { steps: nextSteps, dealId: dealResult?.id, companyId: companyResult.id });

      return res.json({ ok: true, created });
    }

    // ── Push: brief ────────────────────────────────────────────────────
    if (action === "push_brief") {
      if (!data?.company?.name) return res.status(400).json({ error: "Company name required" });
      const { company, executives, tldr, elevatorPitch, strategicTheme, fiveQuestions } = data;
      const created = { companies: 0, contacts: 0, notes: 0 };

      const companyResult = await upsertCompany(userId, company);
      if (!companyResult) return res.status(502).json({ error: "Failed to create company in HubSpot" });
      if (companyResult.created) created.companies = 1;

      if (executives?.length) {
        for (const exec of executives.slice(0, 10)) {
          if (!exec?.name) continue;
          const nameParts = exec.name.trim().split(/\s+/);
          const properties = { firstname: nameParts[0] || "", lastname: nameParts.slice(1).join(" ") || "" };
          if (exec.title) properties.jobtitle = exec.title;
          const r = await hubspotFetch(userId, "/crm/v3/objects/contacts", { method: "POST", body: { properties, associations: [{ to: { id: companyResult.id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }] }] } });
          if (r.ok) created.contacts++;
        }
      }

      const noteParts = ["[Cambrian Catalyst — Sales Brief]", ""];
      if (tldr) {
        if (tldr.topFinding) noteParts.push(`FINDING: ${tldr.topFinding}`);
        if (tldr.topOpportunity) noteParts.push(`OPPORTUNITY: ${tldr.topOpportunity}`);
        if (tldr.topRisk) noteParts.push(`RISK: ${tldr.topRisk}`);
        noteParts.push("");
      }
      if (strategicTheme) noteParts.push(`STRATEGIC THEME: ${strategicTheme}`, "");
      if (elevatorPitch) noteParts.push(`ELEVATOR PITCH: ${elevatorPitch}`, "");
      if (fiveQuestions?.length) {
        noteParts.push("TOP QUESTIONS:");
        fiveQuestions.slice(0, 5).forEach((q, i) => { const t = typeof q === "string" ? q : q?.question || ""; if (t) noteParts.push(`${i + 1}. ${t}`); });
      }
      const noteResult = await createNote(userId, { body: noteParts.join("\n"), companyId: companyResult.id });
      if (noteResult) created.notes = 1;

      return res.json({ ok: true, created });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (e) {
    console.error("[hubspot] Error:", e.message);
    if (e.message?.includes("not_connected") || e.message?.includes("token_expired")) {
      return res.status(401).json({ error: "HubSpot connection expired. Please reconnect in Settings." });
    }
    return res.status(500).json({ error: "Failed to push to HubSpot" });
  }
}
