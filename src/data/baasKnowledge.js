// src/data/baasKnowledge.js
//
// Banking-as-a-Service deep knowledge layer.
// Covers: sponsor banks, middleware, post-Synapse regulatory reality,
// program architecture, economics, compliance, and 2026 trends.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const BAAS_INJECTION = `
BANKING-AS-A-SERVICE (BaaS) DEEP CONTEXT (use when target or seller is in BaaS, sponsor banking, embedded banking, or fintech infrastructure):

MARKET SHIFT: Pre-2024 BaaS was high-growth, loosely regulated (60+ sponsor banks, 30+ middleware). Post-Synapse (April 2024, $95M+ unreconciled), environment fundamentally shifted: sponsor banks collapsed to 25-35, middleware to 8-12, launch timelines from 3-6 months to 9-18 months, pricing up 30-60%, compliance investment table-stakes.

SYNAPSE COLLAPSE: Middleware connecting fintechs (Yotta, Juno, Copper) to four sponsor banks. Bankruptcy exposed three-party model risk: ledger fragmentation, no accountability clarity, bankruptcy law had no clean answer. Aftermath: sustained enforcement wave, consent orders against Evolve, Lineage, Blue Ridge. Key lesson: the BANK owns regulatory obligation even when outsourcing operations.

KEY PLAYERS:
- Top sponsor banks: Cross River, Coastal, Column, Lead, Choice, Sutton, Pathward (7-10 hold most capacity; many exited 2024-2026)
- Middleware survivors: Unit, Treasury Prime, Synctera, Increase, Stripe Treasury (shifted from "middleware in middle" to "orchestration on top of direct bank relationships")
- Issuer processors: Marqeta, Galileo, Lithic, Highnote (cards = highest-margin BaaS subdiscipline at 80-120 bps net)
- Fintech segments: consumer neobanks (Chime, Cash App), B2B (Mercury, Brex, Ramp — better economics), vertical SaaS embedded (Toast, ServiceTitan — fastest-growing), lending (Affirm, Klarna via WebBank)

MODEL ARCHITECTURES:
1. Three-party (Fintech ← Middleware ← Sponsor): post-Synapse disfavored due to ledger risk
2. Two-party direct (Fintech ← Sponsor): preferred post-Synapse, requires engineering depth
3. Vertical SaaS embedded (Platform ← Embedded Provider ← Sponsor): fastest-growing

ECONOMICS: Setup $50K-500K+. Monthly per-account $1-5. Card interchange share 80-120 bps at scale for consumer. CRITICAL: supply crunch — 3-5x more fintechs needing sponsorship than banks will accept. Survivors have pricing power. Sponsors now require 18-24 months runway, in-house CCO/BSA, independent compliance audits, multi-year commits.

COMPLIANCE: BSA/AML (FinCEN), KYC/CDD, OFAC, UDAAP. Serious program: $500K-$5M annually + CCO + BSA officer + 3-15+ AML analysts. Consent orders cite: inadequate transaction monitoring, weak third-party risk oversight, staffing gaps. "Compliance debt" (start minimal, catch up later) is the common failure path.

2026 TRENDS: Market bifurcating — well-capitalized fintechs with compliance maturity growing with top sponsors; under-resourced programs struggling/exiting. Vertical SaaS embedded expanding. Direct sponsor relationships gaining share. Regulatory bar raised permanently. Sponsor consolidation continuing; new entrants rare.
`;

export const BAAS_SCORING = {
  highFitSegments: [
    { segment: "B2B neobanks ($10-250M revenue, Mercury/Brex/Ramp tier)", avgFit: "82-90%", reason: "Strong unit economics, compliance maturity, need revenue ops and channel scaling" },
    { segment: "Sponsor banks with active BaaS programs ($5-50B assets)", avgFit: "80-88%", reason: "Need to scale fintech partnership commercial motion, risk management, relationship governance" },
    { segment: "Vertical SaaS adding embedded finance (Toast/ServiceTitan tier)", avgFit: "78-85%", reason: "Fastest-growing BaaS segment; non-financial founders need banking GTM + compliance strategy" },
    { segment: "Mid-stage BaaS middleware (Unit, Treasury Prime tier)", avgFit: "78-85%", reason: "Complex stakeholder ecosystems; need channel P&L, buyer journey design, reference engineering" },
  ],
  highFrictionSegments: [
    { segment: "Pure consumer neobanks (early stage, <$10M revenue)", avgFit: "30-45%", reason: "CAC inflation pressures unit economics; regulatory bar makes approval difficult; high failure rate" },
    { segment: "Crypto-adjacent BaaS programs", avgFit: "20-35%", reason: "Most sponsors declining crypto programs; regulatory uncertainty; limited consulting leverage" },
    { segment: "Programs in forced sponsor transition (undercapitalized)", avgFit: "35-50%", reason: "Operationally distressed; 25-50% capacity consumed by migration; limited budget" },
  ],
};

export const BAAS_DISCOVERY = `
BAAS-SPECIFIC DISCOVERY (use when prospect is a BaaS provider, sponsor bank, or fintech using BaaS):

REALITY:
- Is BaaS infrastructure central to your model or adjacent? Which players do you depend on and how concentrated?
- What changed for you post-Synapse? Sponsor bank pressure, longer timelines, renegotiated terms?

IMPACT:
- How is your fintech partner onboarding documented? Average time to live transactions? Biggest delays?
- How do you segment GTM across consumer fintechs, B2B platforms, embedded finance, and lending? Separate motions or shared?

VISION:
- What does your compliance infrastructure look like vs what sponsors are asking for? Where's the gap and who pays?
- What % of revenue/volume comes from top 5 partners? What happens if one leaves?

ENTRY POINTS:
- What's booked/contracted vs live transacting programs? What holds migrations?
- How are you structured commercially with each sponsor — flat fee, per-account, revenue share? Standardized or case-by-case?

ROUTE:
- If you built your BaaS strategy from scratch today vs 2 years ago, what would you do differently?
- Where is your moat against new entrants — fintech-as-service companies, new sponsors, consolidated middleware?
`;
