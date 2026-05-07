// src/data/fintechKnowledge.js
//
// U.S. FinTech deep knowledge layer.
// Covers: BaaS, neobanks, lending, wealthtech, insurtech, regtech,
// crypto, sponsor bank dynamics, vertical SaaS + fintech convergence,
// unit economics, and regulatory landscape.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const FINTECH_DEEP_INJECTION = `
FINTECH DEEP CONTEXT (use when target or seller is in fintech, embedded finance, BaaS, or digital banking):

MARKET: Post-correction, consolidation-phase. 2021 valuations passed; survivors run stronger unit economics, deeper bank partnerships, rigorous compliance. Landscape: consumer (Chime 38M, Cash App 57M, SoFi 10M chartered), business (Brex, Ramp, Mercury, Bill.com), embedded (Toast Capital, Shopify Capital), infrastructure (Stripe $70-90B, Plaid, Marqeta, Unit), regulated rails (ACH, RTP, FedNow).

VERTICAL SAAS FINTECH SHIFT: Biggest structural trend — vertical SaaS (Toast, Square, ServiceTitan, Procore) became primary financial services providers. Financial services often 40-60% of total revenue and 60-80% of incremental margin. Competes with horizontal fintechs.

SPONSOR BANKS: Cross River, Coastal, Column, Lead, Choice, Sutton, Pathward provide charter + deposits + regulatory framework. Post-Synapse (April 2024, $95M+ unreconciled): regulatory crackdown, sponsor exits, dramatically raised bars. Direct-to-bank model growing.

BAAS ECONOMICS: Setup + monthly + per-account + transaction + revenue share on interchange (15-50%). Market $35-45B, growing to $75-90B by 2030. Gross margins: 70-85% pure SaaS, 50-70% platforms, 30-50% BaaS.

PAYMENTS: $13T+ annual TPV. Interchange split: ~70% issuing bank, 10-15% networks, 15-20% acquirers. Take rates: 2-5% embedded platforms, 0.1-0.5% acquirers, 1.5-3% card issuers.

LENDING: BNPL $120B+ (Affirm, Klarna dominant). CFPB ruled BNPL is "credit." Personal lending (Upstart, SoFi), SMB (OnDeck, Shopify Capital), earned wage access (DailyPay, Branch).

CAPITAL & M&A (Q2 2026 REFRESH): PE holds $3.6T+ in dry powder globally, accounting for ~30% of fintech M&A deals in 2025. Strategic buyers dominate at ~68.3% of deal volume — led by private strategics (45.8%) vertically integrating competitors. Total global fintech investment hit $116B in 2025 (up from $95.5B in 2024), but deal volume fell to 4,719 — capital concentrating in larger, more selective deals. Financial-services M&A deal value rose ~40% to $499B in 2025; average transaction size climbed from $590M to $815M. PE pays ~3 turns of EBITDA more than strategic buyers — a tailwind for operator-led platforms with proven unit economics. Fintech multiples compressed from 20-40x revenue (2021) to 5-15x (2025). IPO window thawed: Chime $18.4B, Klarna $15B, Circle $6B. PayPal, Ripple, Circle, Affirm pursuing bank charters. License acquisitions now an explicit M&A fast-track for regulatory compliance. Anchor PE: GTCR ($40B+ AUM), Silver Lake, Blackstone, Centerbridge ($2.0B MeridianLink), Clearlake ($4.1B D&B). Anchor strategic: Global Payments/Worldpay (~$17B), FIS ($13.5B Issuer Solutions), Capital One ($35.3B Discover + Brex), Xero ($2.5B Melio).

AI ADOPTION IN FINTECH: Financial services leads regulated-industry AI adoption — 52% of financial institutions use GenAI (up from 40% in 2023). Work-related GenAI adoption among finance employees is 63% (highest of any sector per Federal Reserve RTPS). Financial sector AI growth 127% YoY through Sept 2025. Global AI spend in financial services exceeds $20B in 2025. Dominant use cases: real-time fraud detection, predictive AML (replacing reactive flagging), KYC/identity onboarding, dispute resolution. AI-driven AML saves operations teams ~15 hours/week in manual audits.

REGULATORY: Section 1033 (open banking) implementation through 2026. GENIUS Act (July 2025) — first federal stablecoin framework. PACE Act (June 2025) would expand fintech access to FedACH and FedNow. Fed "skinny account" proposal (Dec 2025) is the active 2026 regulatory file. DORA took effect Jan 2025 in EU (operational resilience for financial entities). MiCA transitional through mid-2026 in EU. OCC/FDIC tightening BaaS oversight. Durbin Amendment credit card extension contested. State MTL expensive and fragmented. Trump administration pro-competition executive orders structurally pro-M&A. Crypto-native firms receiving conditional national trust bank charter approvals.

GTM REALITIES: Compliance is ICP filter, not cost center. Volume-driven requirements mean CAC payback depends on transaction scale. Reference-driven buying critical. Co-brand programs split interchange with partners ($200B+ outstanding). BaaS concentration risk acute. Churn benchmark: <7% annual is strong for SaaS-based fintechs; both small and large report ~3.5% monthly through early 2026.

KEY ECONOMICS KILLERS: Charge-offs, interchange compression, compliance cost explosion, CAC inflation, fraud losses, sponsor bank cost increases, float collapse. Software-driven fintechs achieve 80%+ gross margins; payment processors evaluated on take rate and volume growth instead.
`;

export const FINTECH_DEEP_SCORING = {
  highFitSegments: [
    { segment: "Vertical SaaS adding fintech (payments, lending, banking)", avgFit: "75-85%", reason: "Horizontal scaling playbook + embedded finance monetization strategy" },
    { segment: "BaaS providers and infrastructure (Unit, Synctera, Lithic)", avgFit: "75-85%", reason: "Multi-bank, compliance-heavy, GTM complexity matches Cambrian's architecture" },
    { segment: "B2B fintech selling into banks/credit unions", avgFit: "75-85%", reason: "Bank buyer credibility from Cambrian's payments background" },
    { segment: "Embedded lending in vertical platforms", avgFit: "70-80%", reason: "Toast Capital model; horizontal scaling + partner GTM playbook" },
  ],
  highFrictionSegments: [
    { segment: "Pure consumer neobanks (Chime, Cash App competitors)", avgFit: "30-50%", reason: "Commoditized, saturated, CAC inflation — different GTM motion" },
    { segment: "Crypto-only or DeFi-native protocols", avgFit: "25-40%", reason: "Different operating logic; bank-side expertise less relevant" },
    { segment: "Insurtech direct-to-consumer", avgFit: "30-45%", reason: "Different GTM and underwriting talent profile" },
  ],
};

export const FINTECH_DEEP_DISCOVERY = `
FINTECH DISCOVERY (use when prospect is a fintech, BaaS, or embedded finance company):

REALITY:
- How much revenue comes from transaction volume (take rate) vs subscription/SaaS fees?
- Where do your customers sit — financial institutions, vertical SaaS, or end-consumers?

IMPACT:
- Walk me through your sponsor bank situation — how many banks, concentration risk, redundancy post-Synapse?
- What's the biggest pressure on gross margin — compliance scaling, sponsor bank costs, interchange compression, or CAC inflation?

VISION:
- What's your breakdown between direct sales, partner channel, and platform distribution? Where are unit economics best?
- For enterprise deals, what's the typical cycle and where do deals stall (qualification, POC, procurement, legal/compliance)?

ENTRY POINTS:
- How does your CS team handle compliance and operational onboarding burden for regulated entities?
- How are you handling state-level licensing, MTL maintenance, and AML/sanctions as you scale?

ROUTE:
- Where does the final business decision sit (CFO, COO, CRO, CCO)? How do you navigate business buyers vs risk/compliance gatekeepers?
- How do you measure attribution and prove contribution margin back to partners?
`;
