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
  console.log(`[hubspot] upsertCompany: name="${company.name}" domain="${domain}" properties:`, JSON.stringify(properties));

  const existing = domain ? await findCompanyByDomain(userId, domain) : null;
  if (existing) {
    console.log(`[hubspot] Found existing company ${existing.id} for domain "${domain}" — updating`);
    const r = await hubspotFetch(userId, `/crm/v3/objects/companies/${existing.id}`, { method: "PATCH", body: { properties } });
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
      await saveTokenForUser(userId, { accessToken: tokenData.access_token, refreshToken: tokenData.refresh_token, expiresIn: tokenData.expires_in, portalId: portalInfo?.portalId, scopes: portalInfo?.scopes });
      console.log(`[hubspot] Connected user ${userId} to portal ${portalInfo?.portalId}`);
      res.setHeader("Content-Type", "text/html");
      return res.send(`<!DOCTYPE html><html><head><title>Connected</title></head>
        <body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f9f7f3">
        <div style="text-align:center"><h2 style="color:#2E6B2E;margin:0 0 8px">Connected to HubSpot</h2>
        <p style="color:#666;margin:0">Go back to Cambrian Catalyst and click <strong>"Done — check connection"</strong></p></div></body></html>`);
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
      const created = { companies: 0, contacts: 0, notes: 0 };

      // 1. Upsert company — this creates the TARGET company in HubSpot
      const companyResult = await upsertCompany(userId, company);
      if (!companyResult) {
        console.error(`[hubspot] upsertCompany failed for "${company.name}" (${company.domain})`);
        return res.status(502).json({ error: `Failed to create company "${company.name}" in HubSpot. Check that your HubSpot connection is still active in Settings.` });
      }
      if (companyResult.created) created.companies = 1;

      // 2. Update company with enriched properties from the session summary
      const enrichProps = {};
      if (s.headquarters) enrichProps.city = s.headquarters.split(",")[0]?.trim();
      if (s.headquarters?.includes(",")) enrichProps.state = s.headquarters.split(",").slice(1).join(",").trim();
      if (s.founded) enrichProps.founded_year = String(s.founded).replace(/[^0-9]/g, "").slice(0, 4);
      if (s.website) enrichProps.website = s.website.startsWith("http") ? s.website : `https://${s.website}`;
      if (s.companySnapshot) enrichProps.description = s.companySnapshot.slice(0, 2000);
      if (Object.keys(enrichProps).length) {
        await hubspotFetch(userId, `/crm/v3/objects/companies/${companyResult.id}`, { method: "PATCH", body: { properties: enrichProps } });
      }

      // 3. Create contacts for verified executives
      const execs = s.executives || data.executives || [];
      for (const exec of execs.slice(0, 6)) {
        if (!exec?.name) continue;
        const nameParts = exec.name.trim().split(/\s+/);
        const properties = { firstname: nameParts[0] || "", lastname: nameParts.slice(1).join(" ") || "" };
        if (exec.title) properties.jobtitle = exec.title;
        const r = await hubspotFetch(userId, "/crm/v3/objects/contacts", { method: "POST", body: { properties, associations: [{ to: { id: companyResult.id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }] }] } });
        if (r.ok) created.contacts++;
      }

      // 4. Build rich note from full session summary
      const n = []; // note lines
      const hr = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
      n.push("[Cambrian Catalyst — Full Session Summary]", "");

      // Quick Take
      if (s.topFinding || s.topOpportunity || s.topRisk) {
        n.push(hr, "QUICK TAKE", hr);
        if (s.topFinding) n.push(`FINDING: ${s.topFinding}`);
        if (s.topOpportunity) n.push(`OPPORTUNITY: ${s.topOpportunity}`);
        if (s.topRisk) n.push(`RISK: ${s.topRisk}`);
        n.push("");
      }

      // Strategy
      if (s.strategicTheme || s.sellerOpportunity || s.elevatorPitch) {
        n.push(hr, "STRATEGY & POSITIONING", hr);
        if (s.strategicTheme) n.push(`Strategic Theme: ${s.strategicTheme}`);
        if (s.openingAngle) n.push(`Opening: ${s.openingAngle}`);
        if (s.sellerOpportunity) n.push(`Seller Opportunity: ${s.sellerOpportunity}`);
        if (s.elevatorPitch) n.push("", `Elevator Pitch: ${s.elevatorPitch}`);
        n.push("");
      }

      // Solutions
      if (s.solutions?.length) {
        n.push(hr, "SOLUTION FIT", hr);
        s.solutions.forEach((sol, i) => {
          n.push(`${i + 1}. ${sol.product}: ${sol.jobToBeDone || ""}`);
          if (sol.measurableOutcome) n.push(`   Target outcome: ${sol.measurableOutcome}`);
          if (sol.provenWith) n.push(`   Proven with: ${sol.provenWith}`);
        });
        n.push("");
      }

      // Competitive
      if (s.marketPosition) {
        n.push(hr, "COMPETITIVE LANDSCAPE", hr);
        n.push(s.marketPosition);
        if (s.displacementAngle) n.push(`Displacement angle: ${s.displacementAngle}`);
        n.push("");
      }

      // Financial
      if (s.revenueTrend || s.capitalPriorities) {
        n.push(hr, "FINANCIAL INTELLIGENCE", hr);
        if (s.revenueTrend) n.push(`Revenue trend: ${s.revenueTrend}`);
        if (s.capitalPriorities) n.push(`Capital priorities: ${s.capitalPriorities}`);
        if (s.guidanceQuote) n.push(`Guidance: "${s.guidanceQuote}"`);
        n.push("");
      }

      // Board
      if (s.leadInvestors || s.boardMandate) {
        n.push(hr, "BOARD & INVESTORS", hr);
        if (s.leadInvestors) n.push(`Investors: ${s.leadInvestors}`);
        if (s.investmentThesis) n.push(`Thesis: ${s.investmentThesis}`);
        if (s.boardMandate) n.push(`Mandate: ${s.boardMandate}`);
        n.push("");
      }

      // Hiring
      if (s.hiringSummary) {
        n.push(hr, "HIRING SIGNALS", hr);
        n.push(s.hiringSummary);
        (s.topRoles || []).forEach(r => n.push(`  ${r.title} (${r.dept}) — ${r.signal}`));
        n.push("");
      }

      // Fit Score
      if (s.fitScore !== null && s.fitScore !== undefined) {
        n.push(hr, "FIT SCORE", hr);
        n.push(`${s.fitScore}/100 — ${s.fitLabel}`);
        if (s.fitReason) n.push(s.fitReason);
        n.push("");
      }

      // Discovery Questions
      if (s.discoveryQuestions?.length) {
        n.push(hr, "TOP DISCOVERY QUESTIONS", hr);
        s.discoveryQuestions.forEach((q, i) => n.push(`${i + 1}. ${q.question}`));
        n.push("");
      }

      // RIVER Hypothesis
      if (s.hypothesis) {
        n.push(hr, "RIVER HYPOTHESIS", hr);
        if (s.hypothesis.reality) n.push(`Reality: ${s.hypothesis.reality}`);
        if (s.hypothesis.impact) n.push(`Impact: ${s.hypothesis.impact}`);
        if (s.hypothesis.vision) n.push(`Vision: ${s.hypothesis.vision}`);
        if (s.hypothesis.route) n.push(`Route: ${s.hypothesis.route}`);
        n.push("");
      }

      // Post-Call
      if (s.postCallSummary) {
        n.push(hr, "POST-CALL ANALYSIS", hr);
        n.push(`Deal Route: ${s.postCallSummary.dealRoute} — ${s.postCallSummary.dealRouteReason}`);
        if (s.postCallSummary.callSummary) n.push(`Summary: ${s.postCallSummary.callSummary}`);
        if (s.postCallSummary.nextSteps?.length) {
          n.push("Next Steps:");
          s.postCallSummary.nextSteps.forEach((step, i) => n.push(`  ${i + 1}. ${step}`));
        }
        n.push("");
      }

      // Watch-outs
      if (s.watchOuts?.length) {
        n.push(hr, "WATCH-OUTS", hr);
        s.watchOuts.forEach(w => n.push(`- ${w}`));
        n.push("");
      }

      n.push(hr);
      n.push(`Generated by Cambrian Catalyst | ${s.dataConfidence || ""} confidence | ${new Date().toLocaleDateString()}`);

      const noteResult = await createNote(userId, { body: n.join("\n"), companyId: companyResult.id });
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
