// src/data/healthcareSaasKnowledge.js
//
// U.S. Healthcare SaaS deep knowledge layer.
// Covers: EHR landscape, payers, providers, pharma SaaS, RCM,
// clinical validation, reimbursement, integration patterns,
// healthcare-specific SaaS economics, and AI in healthcare.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const HEALTHCARE_SAAS_INJECTION = `
HEALTHCARE SAAS CONTEXT (use when target or seller is in healthcare, health tech, clinical, or medical):

MARKET: U.S. healthcare is ~$4.9T annual spend (17-18% of GDP). The person consuming care rarely pays directly — insurance and government programs intermediate nearly every dollar, creating labyrinthine billing and reimbursement.

EHR LANDSCAPE: Epic dominates (42% acute hospitals, 55% bed share, ~305M patients). Oracle Health/Cerner 23%. Meditech 15%. Athena/eClinicalWorks ambulatory-focused. Epic ecosystem controls whether third-party software survives in installed base. Cerner-to-Epic conversions dominate 2024-2026.

PAYERS: UnitedHealth (~50M), Elevance/Anthem (~46M), Centene (~28M), CVS/Aetna (~25M), Humana (~17M). Top 3 PBMs (CVS Caremark, Express Scripts, OptumRx) control ~80% of pharmacy.

PROVIDERS: HCA (~190 hospitals, $70B), Kaiser (~$110B), CommonSpirit (~140), Ascension (~140). ~6,100 hospitals, ~250K practices. 50% of physicians now employed by health systems.

BUYING DYNAMICS: Committees include CIO/CMIO, CFO, Chief Compliance, clinical sponsors, procurement, CISO, legal. Sales cycles: hospitals 12-24+ months ($250K-$2M ACV), practices 6-12 months, enterprise 18-36 months. Reference-driven: first 10 customers brutal, flywheel at ~25. GPOs (Vizient, Premier, HealthTrust) aggregate purchasing.

REIMBURSEMENT: Fee-for-service (volume-driven, CPT/ICD-10) vs value-based care (~40% of revenue now). CMS is the single most important rule-maker. IRA (2022) created Medicare drug price negotiation (effective Jan 2026).

INTEGRATION: FHIR APIs are standard. SMART-on-FHIR embeds apps into EHRs. Epic App Orchard gatekeeps. EHR switching costs: $100M+ over 2-3 years.

HEALTHCARE SAAS ECONOMICS: Revenue models vary — per-provider (ambulatory), per-bed/encounter (hospitals), per-claim (RCM), PMPM (capitated), % of collections (outsourced). Gross margins: pure software 65-80%, software+payments 50-65%, clinical services 30-50%.

AI IN HEALTHCARE (2026): 50% of organizations implemented GenAI. Ambient clinical documentation (Abridge, DAX) crossed chasm. Coding automation (Fathom, AKASA), prior auth AI (Cohere, Cedar), RCM AI scaling.

VERTICAL SAAS: modMed (specialty EHR), PointClickCare (LTPAC), WellSky (post-acute), Phreesia (access), Waystar (RCM, IPO'd 2024), Veeva (~80% pharma CRM share).
`;

export const HEALTHCARE_SAAS_SCORING = {
  highFitSegments: [
    { segment: "Revenue Cycle Management / RCM SaaS", avgFit: "75-90%", reason: "Direct ROI, recurring revenue, massive TAM (~$130B), AI coding/prior auth automation accelerating" },
    { segment: "Specialty vertical SaaS (EHR+RCM+practice management)", avgFit: "75-85%", reason: "Workflow specificity, PE roll-up tailwind, embedded payments, specialty billing complexity" },
    { segment: "Ambient clinical documentation & coding AI", avgFit: "70-80%", reason: "Clearest ROI (physician time), rapid adoption, provider margin crisis makes labor-productivity software easier sell" },
    { segment: "Behavioral health B2B2C platforms (employer-channeled)", avgFit: "70-80%", reason: "Proven clinical model, clear employer channel, documented ROI on attrition/productivity" },
  ],
  highFrictionSegments: [
    { segment: "Consumer digital health / general wellness apps", avgFit: "20-35%", reason: "Engagement dropout brutal, reimbursement unclear, CAC inflation, consumer health thesis matured into skepticism" },
    { segment: "Population health & VBC tech (ACO-focused)", avgFit: "35-50%", reason: "Buyer fragmentation, long VBC ROI cycles, EHR data dependency, CMS program changes threaten revenue" },
    { segment: "Standalone interoperability / FHIR (non-EHR-embedded)", avgFit: "25-40%", reason: "Absorbed by EHRs, Epic/Oracle increasingly building native interop" },
  ],
};

export const HEALTHCARE_SAAS_DISCOVERY = `
HEALTHCARE SAAS DISCOVERY (use when prospect is in health tech, clinical, or medical SaaS):

REALITY:
- Walk me through your installed base by health system size, geography, and EHR platform (% Epic, Cerner, others).
- How many customers would you describe as "reference-ready"? What percentage actively refer?

IMPACT:
- What's your sales cycle variance by segment — hospital vs ambulatory vs payer? Where does pipeline stall?
- How does CAC break down by channel (direct, GPO, reseller, integrated within health system)?

VISION:
- How are you positioning against the specific EHR your customer is on? Native integration or FHIR-only?
- What's the typical ROI metric — staff hours saved, claim recovery, patient throughput, or margin expansion?

ENTRY POINTS:
- What's the buyer committee makeup? Where are clinical vs financial vs IT stakeholders, and who holds budget?
- Walk me through your reference engineering process — how do you turn happy customers into active sales assets?

ROUTE:
- What's NRR by segment, and what are the top 3 reasons customers expand vs churn?
- What's the gap between booked ACV and recognized revenue? How long does implementation run?
`;
