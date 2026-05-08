// api/enrich.js
//
// Server-side company + people enrichment via Apollo.io.
// Called before brief generation to ground prompts with verified data.
//
// GET  /api/enrich?domain=company.com  → org firmographics + top people
// POST /api/enrich { action: "reveal", person_id: "..." } → email/phone (costs Apollo credits)
//
// Results cached in-memory per domain for 24 hours to minimize API calls.

import { verifyJwt, decodeJwtPayload, isAllowedOrigin, checkRateLimit } from "./_guard.js";

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_BASE = "https://api.apollo.io/api/v1";

// In-memory cache — domain → { data, timestamp }
const cache = new Map();
const CACHE_TTL = 86400000; // 24 hours

function apolloHeaders() {
  return {
    "x-api-key": APOLLO_API_KEY,
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  };
}

// Clean domain input
function cleanDomain(d) {
  if (!d) return "";
  return d.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];
}

// Org enrichment — returns company firmographics
async function enrichOrg(domain) {
  const r = await fetch(`${APOLLO_BASE}/organizations/enrich?domain=${encodeURIComponent(domain)}`, {
    headers: apolloHeaders(),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const org = data.organization;
  if (!org) return null;
  return {
    name: org.name || null,
    domain: org.primary_domain || org.website_url || domain,
    industry: org.industry || null,
    subIndustry: org.sub_industry || null,
    description: org.short_description || org.seo_description || null,
    employeeCount: org.estimated_num_employees || null,
    revenue: org.annual_revenue_printed || null,
    revenueRange: org.annual_revenue || null,
    founded: org.founded_year || null,
    headquarters: [org.city, org.state, org.country].filter(Boolean).join(", ") || null,
    phone: org.phone || null,
    linkedIn: org.linkedin_url || null,
    facebook: org.facebook_url || null,
    twitter: org.twitter_url || null,
    logo: org.logo_url || null,
    technologies: (org.current_technologies || []).map(t => t.name || t).slice(0, 20),
    keywords: (org.keywords || []).slice(0, 10),
    fundingTotal: org.total_funding_printed || org.total_funding || null,
    latestFundingRound: org.latest_funding_round_type || null,
    latestFundingAmount: org.latest_funding_amount || null,
    latestFundingDate: org.latest_funding_round_date || null,
    publiclyTraded: org.publicly_traded_symbol ? `${org.publicly_traded_exchange || ""}:${org.publicly_traded_symbol}` : null,
    alexaRanking: org.alexa_ranking || null,
    source: "apollo",
  };
}

// People search — find key contacts at a company (free, no credits)
async function searchPeople(domain, limit = 10) {
  const r = await fetch(`${APOLLO_BASE}/mixed_people/api_search`, {
    method: "POST",
    headers: apolloHeaders(),
    body: JSON.stringify({
      q_organization_domains_list: [domain],
      person_seniorities: ["owner", "founder", "c_suite", "partner", "vp", "head", "director"],
      per_page: limit,
      page: 1,
    }),
  });
  if (!r.ok) return [];
  const data = await r.json();
  return (data.people || []).map(p => ({
    id: p.id || null,
    firstName: p.first_name || null,
    lastName: p.last_name || null,
    name: p.name || [p.first_name, p.last_name].filter(Boolean).join(" "),
    title: p.title || null,
    seniority: p.seniority || null,
    department: p.departments?.[0] || null,
    linkedIn: p.linkedin_url || null,
    city: p.city || null,
    state: p.state || null,
    country: p.country || null,
    photoUrl: p.photo_url || null,
    // Email/phone NOT returned by search — requires enrichment (costs credits)
    emailStatus: p.email_status || null,
    hasEmail: !!p.email,
    hasPhone: !!(p.phone_numbers?.length),
  }));
}

// People enrichment — reveal email/phone for a specific person (costs credits)
async function enrichPerson(personId) {
  const r = await fetch(`${APOLLO_BASE}/people/match`, {
    method: "POST",
    headers: apolloHeaders(),
    body: JSON.stringify({
      id: personId,
      reveal_personal_emails: true,
      reveal_phone_number: false, // phone requires webhook — skip for now
    }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const p = data.person;
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    title: p.title,
    email: p.email || null,
    personalEmails: p.personal_emails || [],
    phone: p.organization_phone || null,
    linkedIn: p.linkedin_url || null,
  };
}

export default async function handler(req, res) {
  if (!APOLLO_API_KEY) return res.status(501).json({ error: "Apollo not configured" });

  // Origin + rate limit
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Origin not allowed" });
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Too many requests" });

  // Auth
  if (!await verifyJwt(req)) return res.status(401).json({ error: "Authentication required" });

  // GET — company enrichment + people search (cached)
  if (req.method === "GET") {
    const domain = cleanDomain(req.query?.domain);
    if (!domain) return res.status(400).json({ error: "domain parameter required" });

    // Check cache
    const cached = cache.get(domain);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return res.json({ ...cached.data, _cached: true });
    }

    // Parallel: org enrichment + people search
    const [org, people] = await Promise.all([
      enrichOrg(domain).catch(() => null),
      searchPeople(domain).catch(() => []),
    ]);

    const result = {
      organization: org,
      people: people,
      domain,
      enrichedAt: new Date().toISOString(),
    };

    // Cache
    cache.set(domain, { data: result, timestamp: Date.now() });
    // Prune cache if too large
    if (cache.size > 500) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) cache.delete(oldest[0]);
    }

    return res.json(result);
  }

  // POST — person reveal (costs Apollo credits)
  if (req.method === "POST") {
    const { action, person_id } = req.body || {};
    if (action !== "reveal" || !person_id) return res.status(400).json({ error: "action=reveal and person_id required" });

    const person = await enrichPerson(person_id).catch(() => null);
    if (!person) return res.status(404).json({ error: "Person not found or enrichment failed" });

    return res.json({ person });
  }

  return res.status(405).end();
}
