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
  exchangeCodeForTokens, getPortalInfo, getOwnerByToken, saveTokenForUser,
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

async function upsertCompany(userId, company, { ownerId, summary } = {}) {
  const domain = cleanDomain(company.domain);
  const properties = { name: company.name || "", domain };
  if (company.industry) properties.industry = company.industry;
  if (company.employees) properties.numberofemployees = String(company.employees).replace(/[^0-9]/g, "");
  if (company.revenue) { const rev = String(company.revenue).replace(/[^0-9.]/g, ""); if (rev) properties.annualrevenue = rev; }
  // Assign owner — this makes the company show up in "My companies" for the user
  if (ownerId) properties.hubspot_owner_id = ownerId;
  // Enrich from session summary
  const s = summary || {};
  if (s.headquarters) { properties.city = s.headquarters.split(",")[0]?.trim(); if (s.headquarters.includes(",")) properties.state = s.headquarters.split(",").slice(1).join(",").trim(); }
  // founded_year is not a standard HubSpot property — skip to avoid 400 errors
  if (s.website) properties.website = s.website.startsWith("http") ? s.website : `https://${s.website}`;
  if (s.companySnapshot) properties.description = s.companySnapshot.slice(0, 2000);
  console.log(`[hubspot] upsertCompany: name="${company.name}" domain="${domain}" owner="${ownerId||"none"}"`);

  const existing = domain ? await findCompanyByDomain(userId, domain) : null;
  if (existing) {
    console.log(`[hubspot] Found existing company ${existing.id} for domain "${domain}" — updating`);
    const r = await hubspotFetch(userId, `/crm/v3/objects/companies/${existing.id}`, { method: "PATCH", body: { properties } });
    if (!r.ok) { const errBody = await r.text().catch(()=>""); console.error(`[hubspot] Company update failed: ${r.status} ${errBody.slice(0,300)}`); }
    return { id: (r.ok ? (await r.json()).id : existing.id), created: false };
  }
  console.log(`[hubspot] No existing company for domain "${domain}" — creating new`);
  const r = await hubspotFetch(userId, "/crm/v3/objects/companies", { method: "POST", body: { properties } });
  if (!r.ok) {
    const errBody = await r.text().catch(() => "");
    console.error(`[hubspot] Company create failed: ${r.status} ${errBody.slice(0, 300)}`);
    return null;
  }
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
  // HubSpot redirects here with ?code=...&state=... after user approves.
  // Exchange code for tokens immediately and redirect back to the app.
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
      if (!tokenData?.access_token) {
        return res.redirect(302, `${APP_URL}?hubspot=error&reason=token_exchange`);
      }
      const portalInfo = await getPortalInfo(tokenData.access_token);
      const ownerInfo = await getOwnerByToken(tokenData.access_token);
      await saveTokenForUser(userId, { accessToken: tokenData.access_token, refreshToken: tokenData.refresh_token, expiresIn: tokenData.expires_in, portalId: portalInfo?.portalId, scopes: portalInfo?.scopes, ownerId: ownerInfo?.ownerId });
      console.log(`[hubspot] Connected user ${userId} to portal ${portalInfo?.portalId}, owner ${ownerInfo?.ownerId || "unknown"}`);
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
      console.log(`[hubspot] Status check for user ${userId}: ${tokens ? `connected (portal ${tokens.portalId})` : "not connected"}`);
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
      console.log(`[hubspot] push_postcall for company: "${company.name}" domain: "${company.domain}"`);

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

    // ── Push: brief (full session summary) ──────────────────────────────
    if (action === "push_brief") {
      if (!data?.company?.name) return res.status(400).json({ error: "Company name required" });
      const { company, summary } = data;
      const s = summary || {}; // full session summary — rich payload
      console.log(`[hubspot] push_brief for TARGET company: "${company.name}" domain: "${company.domain}" industry: "${company.industry}"`);
      const created = { companies: 0, notes: 0 };

      // Get the user's HubSpot owner ID so the company is assigned to them
      const tokens = await getTokenForUser(userId);
      const ownerId = tokens?.ownerId || null;

      // 1. Upsert company with owner + all enriched properties in one call
      const companyResult = await upsertCompany(userId, company, { ownerId, summary: s });
      if (!companyResult) {
        console.error(`[hubspot] upsertCompany failed for "${company.name}" (${company.domain})`);
        return res.status(502).json({ error: `Failed to create company "${company.name}" in HubSpot. Check that your HubSpot connection is still active in Settings.` });
      }
      if (companyResult.created) created.companies = 1;

      // 2. Build HTML note — clean, data-rich, scannable
      // No contact creation — executives are researched names, not verified contacts
      const e = (t) => (t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); // escape HTML
      const h = []; // html parts
      h.push(`<h2>Cambrian Catalyst — Session Summary</h2>`);
      h.push(`<p style="color:#666;font-size:12px">${s.sellerName ? e(s.sellerName) + " → " : ""}${e(s.targetCompany || company.name)} | ${new Date().toLocaleDateString()}</p>`);

      // Quick Take
      if (s.topFinding || s.topOpportunity || s.topRisk) {
        h.push(`<h3>Quick Take</h3>`);
        if (s.topFinding) h.push(`<p><strong>Finding:</strong> ${e(s.topFinding)}</p>`);
        if (s.topOpportunity) h.push(`<p><strong>Opportunity:</strong> ${e(s.topOpportunity)}</p>`);
        if (s.topRisk) h.push(`<p><strong>Risk:</strong> ${e(s.topRisk)}</p>`);
      }

      // Company Profile
      const profileParts = [s.revenue && `Revenue: ${s.revenue}`, s.employeeCount && `Employees: ${s.employeeCount}`, s.headquarters && `HQ: ${s.headquarters}`, s.ownership && `Ownership: ${s.ownership}`].filter(Boolean);
      if (s.companySnapshot || profileParts.length) {
        h.push(`<h3>Company Profile</h3>`);
        if (s.companySnapshot) h.push(`<p>${e(s.companySnapshot)}</p>`);
        if (profileParts.length) h.push(`<p style="color:#666;font-size:12px">${profileParts.map(e).join(" · ")}</p>`);
      }

      // Executives
      if (s.executives?.length) {
        h.push(`<h3>Key Executives</h3><ul>`);
        s.executives.forEach(ex => h.push(`<li><strong>${e(ex.name)}</strong> — ${e(ex.title)}</li>`));
        h.push(`</ul>`);
      }

      // Strategy
      if (s.strategicTheme || s.sellerOpportunity) {
        h.push(`<h3>Strategy & Positioning</h3>`);
        if (s.strategicTheme) h.push(`<p><strong>Theme:</strong> ${e(s.strategicTheme)}</p>`);
        if (s.openingAngle) h.push(`<p><strong>Opening:</strong> ${e(s.openingAngle)}</p>`);
        if (s.sellerOpportunity) h.push(`<p><strong>Opportunity:</strong> ${e(s.sellerOpportunity)}</p>`);
      }

      // Elevator Pitch
      if (s.elevatorPitch) {
        h.push(`<h3>Elevator Pitch</h3><p><em>${e(s.elevatorPitch)}</em></p>`);
      }

      // Solutions
      if (s.solutions?.length) {
        h.push(`<h3>Solution Fit</h3>`);
        s.solutions.forEach(sol => {
          h.push(`<p><strong>${e(sol.product)}</strong>: ${e(sol.jobToBeDone || "")}`);
          if (sol.measurableOutcome) h.push(`<br/>Target: ${e(sol.measurableOutcome)}`);
          h.push(`</p>`);
        });
      }

      // Competitive
      if (s.marketPosition) {
        h.push(`<h3>Competitive Landscape</h3><p>${e(s.marketPosition)}</p>`);
        if (s.displacementAngle) h.push(`<p><strong>Displacement:</strong> ${e(s.displacementAngle)}</p>`);
      }

      // Financial
      if (s.revenueTrend || s.capitalPriorities) {
        h.push(`<h3>Financial Intelligence</h3>`);
        if (s.revenueTrend) h.push(`<p><strong>Trend:</strong> ${e(s.revenueTrend)}</p>`);
        if (s.capitalPriorities) h.push(`<p><strong>Capital:</strong> ${e(s.capitalPriorities)}</p>`);
        if (s.guidanceQuote) h.push(`<p><em>"${e(s.guidanceQuote)}"</em></p>`);
      }

      // Board
      if (s.leadInvestors || s.boardMandate) {
        h.push(`<h3>Board & Investors</h3>`);
        if (s.leadInvestors) h.push(`<p><strong>Investors:</strong> ${e(s.leadInvestors)}</p>`);
        if (s.boardMandate) h.push(`<p><strong>Mandate:</strong> ${e(s.boardMandate)}</p>`);
      }

      // Hiring
      if (s.hiringSummary) {
        h.push(`<h3>Hiring Signals</h3><p>${e(s.hiringSummary)}</p>`);
        if (s.topRoles?.length) {
          h.push(`<ul>`);
          s.topRoles.forEach(r => h.push(`<li>${e(r.title)} (${e(r.dept)}) — ${e(r.signal)}</li>`));
          h.push(`</ul>`);
        }
      }

      // Fit Score
      if (s.fitScore !== null && s.fitScore !== undefined) {
        h.push(`<h3>Fit Score: ${s.fitScore}/100 — ${e(s.fitLabel)}</h3>`);
        if (s.fitReason) h.push(`<p>${e(s.fitReason)}</p>`);
      }

      // Discovery Questions
      if (s.discoveryQuestions?.length) {
        h.push(`<h3>Discovery Questions</h3><ol>`);
        s.discoveryQuestions.forEach(q => h.push(`<li>${e(q.question)}</li>`));
        h.push(`</ol>`);
      }

      // RIVER Hypothesis
      if (s.hypothesis) {
        h.push(`<h3>RIVER Hypothesis</h3>`);
        if (s.hypothesis.reality) h.push(`<p><strong>Reality:</strong> ${e(s.hypothesis.reality)}</p>`);
        if (s.hypothesis.impact) h.push(`<p><strong>Impact:</strong> ${e(s.hypothesis.impact)}</p>`);
        if (s.hypothesis.vision) h.push(`<p><strong>Vision:</strong> ${e(s.hypothesis.vision)}</p>`);
        if (s.hypothesis.route) h.push(`<p><strong>Route:</strong> ${e(s.hypothesis.route)}</p>`);
      }

      // Post-Call
      if (s.postCallSummary) {
        h.push(`<h3>Post-Call: ${e(s.postCallSummary.dealRoute)}</h3>`);
        if (s.postCallSummary.dealRouteReason) h.push(`<p>${e(s.postCallSummary.dealRouteReason)}</p>`);
        if (s.postCallSummary.nextSteps?.length) {
          h.push(`<p><strong>Next Steps:</strong></p><ol>`);
          s.postCallSummary.nextSteps.forEach(step => h.push(`<li>${e(step)}</li>`));
          h.push(`</ol>`);
        }
      }

      // Gate Map
      if (s.gateMap) {
        h.push(`<h3>Approval Gate Map</h3>`);
        if (s.gateMap.sellerGates?.summary) {
          h.push(`<p><strong>Seller Side:</strong> ${e(s.gateMap.sellerGates.summary)}</p>`);
          if (s.gateMap.sellerGates.gates?.length) {
            h.push(`<ul>`);
            s.gateMap.sellerGates.gates.filter(g=>g?.gate).forEach(g => h.push(`<li><strong>${e(g.gate)}</strong> (${e(g.owner||"")}) — ${e(g.artifact||"")} [${e(g.timeline||"")}]</li>`));
            h.push(`</ul>`);
          }
        }
        if (s.gateMap.buyerGates?.summary) {
          h.push(`<p><strong>Buyer Side:</strong> ${e(s.gateMap.buyerGates.summary)}</p>`);
          if (s.gateMap.buyerGates.gates?.length) {
            h.push(`<ul>`);
            s.gateMap.buyerGates.gates.filter(g=>g?.gate).forEach(g => h.push(`<li><strong>${e(g.gate)}</strong> (${e(g.owner||"")}) — ${e(g.artifact||"")} [${e(g.timeline||"")}]</li>`));
            h.push(`</ul>`);
          }
        }
        if (s.gateMap.criticalPath) h.push(`<p><strong>Critical Path:</strong> ${e(s.gateMap.criticalPath)}</p>`);
        if (s.gateMap.mapAdvice) h.push(`<p><strong>This Week:</strong> ${e(s.gateMap.mapAdvice)}</p>`);
      }

      // Watch-outs
      if (s.watchOuts?.length) {
        h.push(`<h3>Watch-Outs</h3><ul>`);
        s.watchOuts.forEach(w => h.push(`<li>${e(w)}</li>`));
        h.push(`</ul>`);
      }

      h.push(`<hr/><p style="color:#999;font-size:11px">Generated by Cambrian Catalyst${s.dataConfidence ? ` | ${s.dataConfidence} confidence` : ""} | ${new Date().toLocaleDateString()}</p>`);

      const noteResult = await createNote(userId, { body: h.join(""), companyId: companyResult.id });
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
