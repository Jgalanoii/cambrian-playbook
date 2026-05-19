// api/hubspot-push.js
//
// Push Cambrian outputs to HubSpot CRM.
// POST with JWT + action:
//   - push_postcall: company + deal + note + tasks from post-call analysis
//   - push_brief:    company + contacts + note from brief (Phase 2)
//   - push_accounts: batch company upsert with fit scores (Phase 3)

import { isAllowedOrigin, verifyJwt, decodeJwtPayload, checkRateLimit } from "./_guard.js";
import { isConfigured, hubspotFetch } from "./_hubspot.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Map Cambrian deal routes to default HubSpot pipeline stages
const DEAL_STAGE_MAP = {
  FAST_TRACK: "qualifiedtobuy",
  NURTURE: "appointmentscheduled",
  DISQUALIFY: "closedlost",
};

// ── Search for company by domain ───────────────────────────────────────
async function findCompanyByDomain(userId, domain) {
  const r = await hubspotFetch(userId, "/crm/v3/objects/companies/search", {
    method: "POST",
    body: {
      filterGroups: [{
        filters: [{ propertyName: "domain", operator: "EQ", value: domain }],
      }],
      properties: ["name", "domain"],
      limit: 1,
    },
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data?.results?.[0] || null;
}

// ── Create or update company ───────────────────────────────────────────
async function upsertCompany(userId, company) {
  const domain = cleanDomain(company.domain);
  const properties = {
    name: company.name || "",
    domain: domain,
  };
  if (company.industry) properties.industry = company.industry;
  if (company.employees) properties.numberofemployees = String(company.employees).replace(/[^0-9]/g, "");
  if (company.revenue) {
    const rev = String(company.revenue).replace(/[^0-9.]/g, "");
    if (rev) properties.annualrevenue = rev;
  }

  // Try to find existing
  const existing = await findCompanyByDomain(userId, domain);
  if (existing) {
    const r = await hubspotFetch(userId, `/crm/v3/objects/companies/${existing.id}`, {
      method: "PATCH",
      body: { properties },
    });
    if (r.ok) {
      const data = await r.json();
      return { id: data.id, created: false };
    }
    return { id: existing.id, created: false };
  }

  // Create new
  const r = await hubspotFetch(userId, "/crm/v3/objects/companies", {
    method: "POST",
    body: { properties },
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    console.error("[hubspot-push] Company create failed:", r.status, err);
    return null;
  }
  const data = await r.json();
  return { id: data.id, created: true };
}

// ── Create a deal ──────────────────────────────────────────────────────
async function createDeal(userId, { companyName, dealRoute, dealRisk, confidence, companyId }) {
  const dealstage = DEAL_STAGE_MAP[dealRoute] || "appointmentscheduled";
  const properties = {
    dealname: `${companyName} — Cambrian`,
    dealstage,
    pipeline: "default",
  };
  if (confidence) properties.hs_deal_score = String(confidence);

  const associations = companyId ? [{
    to: { id: companyId },
    types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 5 }],
  }] : [];

  const r = await hubspotFetch(userId, "/crm/v3/objects/deals", {
    method: "POST",
    body: { properties, associations },
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    console.error("[hubspot-push] Deal create failed:", r.status, err);
    return null;
  }
  const data = await r.json();
  return { id: data.id };
}

// ── Create a note ──────────────────────────────────────────────────────
async function createNote(userId, { body, companyId, dealId }) {
  const associations = [];
  if (companyId) {
    associations.push({
      to: { id: companyId },
      types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 190 }],
    });
  }
  if (dealId) {
    associations.push({
      to: { id: dealId },
      types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 214 }],
    });
  }

  const r = await hubspotFetch(userId, "/crm/v3/objects/notes", {
    method: "POST",
    body: {
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: body,
      },
      associations,
    },
  });
  if (!r.ok) {
    console.error("[hubspot-push] Note create failed:", r.status);
    return null;
  }
  const data = await r.json();
  return { id: data.id };
}

// ── Create tasks from next steps ───────────────────────────────────────
async function createTasks(userId, { steps, dealId, companyId }) {
  let created = 0;
  for (const step of (steps || []).slice(0, 10)) {
    if (!step || typeof step !== "string" || step.length < 3) continue;
    const associations = [];
    if (dealId) {
      associations.push({
        to: { id: dealId },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }],
      });
    }
    if (companyId) {
      associations.push({
        to: { id: companyId },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 192 }],
      });
    }

    const r = await hubspotFetch(userId, "/crm/v3/objects/tasks", {
      method: "POST",
      body: {
        properties: {
          hs_timestamp: new Date().toISOString(),
          hs_task_subject: step.slice(0, 200),
          hs_task_status: "NOT_STARTED",
          hs_task_priority: "MEDIUM",
          hs_task_type: "TODO",
        },
        associations,
      },
    });
    if (r.ok) created++;
  }
  return created;
}

// ── Domain cleaner ─────────────────────────────────────────────────────
function cleanDomain(d) {
  if (!d) return "";
  return d.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];
}

// ── Main handler ───────────────────────────────────────────────────────
export default async function handler(req, res) {
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
  if (!data) return res.status(400).json({ error: "Data required" });

  try {
    // ── PUSH POST-CALL ─────────────────────────────────────────────────
    if (action === "push_postcall") {
      const { company, crmNote, dealRoute, dealRisk, nextSteps, confidence } = data;
      if (!company?.name) return res.status(400).json({ error: "Company name required" });

      const created = { companies: 0, deals: 0, notes: 0, tasks: 0 };

      // 1. Upsert company
      const companyResult = await upsertCompany(userId, company);
      if (!companyResult) return res.status(502).json({ error: "Failed to create company in HubSpot" });
      if (companyResult.created) created.companies = 1;

      // 2. Create deal
      const dealResult = await createDeal(userId, {
        companyName: company.name,
        dealRoute: dealRoute || "NURTURE",
        dealRisk,
        confidence,
        companyId: companyResult.id,
      });
      if (dealResult) created.deals = 1;

      // 3. Create CRM note
      if (crmNote) {
        const noteBody = `[Cambrian Catalyst — Post-Call Analysis]\n\n${crmNote}`;
        const noteResult = await createNote(userId, {
          body: noteBody,
          companyId: companyResult.id,
          dealId: dealResult?.id,
        });
        if (noteResult) created.notes = 1;
      }

      // 4. Create tasks from next steps
      if (nextSteps?.length) {
        created.tasks = await createTasks(userId, {
          steps: nextSteps,
          dealId: dealResult?.id,
          companyId: companyResult.id,
        });
      }

      return res.json({ ok: true, created });
    }

    // ── PUSH BRIEF (Phase 2) ───────────────────────────────────────────
    if (action === "push_brief") {
      const { company, executives, tldr, elevatorPitch, strategicTheme, fiveQuestions } = data;
      if (!company?.name) return res.status(400).json({ error: "Company name required" });

      const created = { companies: 0, contacts: 0, notes: 0 };

      // 1. Upsert company
      const companyResult = await upsertCompany(userId, company);
      if (!companyResult) return res.status(502).json({ error: "Failed to create company in HubSpot" });
      if (companyResult.created) created.companies = 1;

      // 2. Create contacts from executives
      if (executives?.length) {
        for (const exec of executives.slice(0, 10)) {
          if (!exec?.name) continue;
          const nameParts = exec.name.trim().split(/\s+/);
          const firstname = nameParts[0] || "";
          const lastname = nameParts.slice(1).join(" ") || "";
          const properties = { firstname, lastname };
          if (exec.title) properties.jobtitle = exec.title;

          const r = await hubspotFetch(userId, "/crm/v3/objects/contacts", {
            method: "POST",
            body: {
              properties,
              associations: [{
                to: { id: companyResult.id },
                types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 1 }],
              }],
            },
          });
          if (r.ok) created.contacts++;
        }
      }

      // 3. Create intelligence note
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
        fiveQuestions.slice(0, 5).forEach((q, i) => {
          const qText = typeof q === "string" ? q : q?.question || "";
          if (qText) noteParts.push(`${i + 1}. ${qText}`);
        });
      }

      const noteResult = await createNote(userId, {
        body: noteParts.join("\n"),
        companyId: companyResult.id,
      });
      if (noteResult) created.notes = 1;

      return res.json({ ok: true, created });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (e) {
    console.error("[hubspot-push] Error:", e.message);
    if (e.message?.includes("not_connected") || e.message?.includes("token_expired")) {
      return res.status(401).json({ error: "HubSpot connection expired. Please reconnect in Settings." });
    }
    return res.status(500).json({ error: "Failed to push to HubSpot" });
  }
}
