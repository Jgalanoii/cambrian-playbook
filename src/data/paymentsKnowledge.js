// src/data/paymentsKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// Deep payments industry knowledge layer — ISOs, acquiring banks, payment
// processing, networks, card economics, PayFac/embedded payments, and
// recent market events (Nov 2025 → Apr 2026).
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_PAYMENTS (populated by fetchKnowledgeLayer()).
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Nilson Report — https://nilsonreport.com (acquiring rankings, volume data)
//   Federal Reserve Payments Study — https://www.federalreserve.gov/paymentsystems/fr-payments-study.htm
//   Federal Reserve Biennial Report (Dec 2025) — https://www.federalreserve.gov/paymentsystems.htm
//   Federal Reserve Diary of Consumer Payment Choice (2025) — https://www.clevelandfed.org/en/newsroom-and-events/publications/diary-of-consumer-payment-choice.aspx
//   FedNow Service Data — https://www.frbservices.org/financial-services/fednow
//   The Clearing House (RTP Network) — https://www.theclearinghouse.org/payment-systems/rtp
//   Citizens Financial Group Instant Payments Survey (2025)
//   Association for Financial Professionals (AFP) Payments Fraud Survey (2025) — https://www.afponline.org
//   Stripe Annual Letter / Press Releases — https://stripe.com/newsroom
//   Adyen Earnings Reports — https://www.adyen.com/investor-relations
//   McKinsey Global Payments Report — https://www.mckinsey.com/industries/financial-services/our-insights/global-payments-report
//   Visa / Mastercard Published Interchange Schedules — https://usa.visa.com/support/merchant/library/visa-merchant-data-standards-manual.html
//   BIS Annual Economic Report (2025) — https://www.bis.org/publ/arpdf/ar2025e.htm
//   BIS Papers No. 167 (Cerutti, Chen & Hengge 2024) — https://www.bis.org/publ/bppdf/bispap167.htm
//   BIS Papers No. 159 (2024 CBDC Survey) — https://www.bis.org/publ/bppdf/bispap159.htm
//   CPMI 2025-2027 Work Programme — https://www.bis.org/cpmi/
//   IMF Stablecoins Paper (2025) — https://www.imf.org
//   S&P Global Market Intelligence (M&A data) — https://www.spglobal.com/marketintelligence
//   GENIUS Act (Public Law, signed Jul 2025)
//   Credit Card Competition Act (CCCA) bill text (reintroduced Jan 2026)
//   PACE Act bill text (introduced June 2025)
//   PayFac industry benchmarks — Infinicept, Payrix, Finix whitepapers

// ── PAYMENTS INDUSTRY INJECTION ─────────────────────────────────────────
// Injected into prompts when the seller or target operates in payments,
// fintech, banking, or card-related verticals. Provides grounding for
// fit scoring, brief generation, and discovery questions.

export const PAYMENTS_INDUSTRY_INJECTION = `
PAYMENTS INDUSTRY CONTEXT (use when the target or seller is in payments, fintech, card processing, banking, or merchant services):

FOUR-PARTY MODEL: Cardholder → Issuer (card-issuing bank) → Network (Visa/MC) → Acquirer (merchant's bank) → Merchant. Interchange flows from acquirer to issuer. The merchant funds it. AmEx and Discover operate three-party (issuer + network + acquirer in one).

ACQUIRING MARKET (2025-2026 ranking by volume):
1. JPMorgan Chase (~$2.61T) [verified 05/2026, Nilson Report] 2. Fiserv 3. Worldpay/Global Payments (merged Jan 2026, $24.25B deal) [verified 05/2026, S&P Global] 4. Wells Fargo 5. Stripe ($1.9T in 2025, +34% YoY) [verified 05/2026, Stripe Annual Letter] 6. BofA 7. Elavon/US Bank 8. Braintree/PayPal 9. Adyen (first top-10, €2.36B net rev) [verified 05/2026, Adyen Earnings] 10. Toast (dominant restaurant vertical).
Bank-owned acquiring is fading; growth is at tech-led acquirers (Stripe, Adyen, Toast, Square, Shift4).

ISO LANDSCAPE: ISOs (Independent Sales Organizations) are third-party sales entities sponsored by acquiring banks. Three models: Referral/Sub-ISO (earns residuals, no registration), Registered Sales-only ISO (50-70% rev-share on spread) [verified 05/2026, Cambrian operator knowledge], Full-Liability ISO (owns portfolio, highest margin/risk/exit value). ISOs are being squeezed by software-led distribution (~85% of merchants now choose payments with their software) [verified 05/2026, McKinsey Global Payments], direct merchant products (Stripe/Square self-serve), and margin compression (effective rates down from 3.5%+ to 2.6-2.9%) [verified 05/2026, Nilson Report].

PAYMENT ECONOMICS:
- Total merchant cost = Interchange + Network Assessments + Processor Markup
- U.S. average interchange: ~1.80%. Card-present: ~1.70%. Card-not-present: ~1.90%. Regulated debit: ~$0.22 flat. Premium rewards credit: 2.10-2.40%+. Commercial: 2.20-2.80%+. [verified 05/2026, Visa/MC Published Interchange Schedules]
- Network assessments: ~0.13-0.15% + per-txn fees [verified 05/2026, Visa/MC Published Fee Schedules]
- Pricing models: Interchange-Plus (transparent, mid-market+), Tiered (opaque, legacy ISO), Flat-Rate (Square/Stripe simplicity)
- On a $100 Visa rewards credit txn: issuer gets ~$2.10 (interchange), network gets ~$0.14 (assessments), processor gets ~$0.30 (markup), merchant pays ~$2.54. [verified 05/2026, derived from Visa Interchange + Assessment Schedules]

PAYFAC & EMBEDDED PAYMENTS: PayFac holds one master MID, onboards sub-merchants, takes liability. PayFac captures 3-6x the economics of an ISO residual [verified 05/2026, Infinicept/Payrix Benchmarks]. Becoming a full PayFac costs ~$500K-$1M setup + $50M+ volume to break even [verified 05/2026, Finix/Infinicept Whitepapers]. PayFac-as-a-Service (Stripe Connect, Adyen for Platforms, Finix, Rainforest) is the default for vertical SaaS — platform brands the experience, partner handles compliance/settlement.

PAYMENT RAILS & INSTANT PAYMENTS (Q2 2026 REFRESH — Federal Reserve data):
- Fed Biennial Report (Dec 2025): 100.7B debit and general-use prepaid card transactions valued at $4.7T in 2023; 4.6% annual growth, below the 7.8% volume / 9.5% value pace from 2009-2021. Interchange totaled $34.12B (3.9% annual growth since 2021). Canonical Fed source for stored-value/prepaid unit economics. [verified 05/2026, Federal Reserve Biennial Report Dec 2025]
- Prepaid debit cards grew 20.6% per year by value from 2018-2021 (highest of any card type), reaching $0.61T — still only 6.5% of total card payment value. Growth decelerating in volume but interchange revenue holding. [verified 05/2026, Federal Reserve Biennial Report Dec 2025]
- FedNow at Two Years (July 2025): 1,400+ participants (up from 900 a year earlier); transaction limit raised to $10M as of Sept 2025. Use cases: instant payroll, auto-loan disbursements, digital wallet defunding, insurance payouts, merchant refunds. [verified 05/2026, FedNow Service Data / Federal Reserve]
- Two-rail strategy (RTP + FedNow) is the new default for treasury and payments product roadmaps. ~85% of U.S. banks/credit unions still have not adopted any instant-payment solution — addressable greenfield. [verified 05/2026, Federal Reserve / FedNow Service Data]
- 73% of surveyed businesses report using instant payments [verified 05/2026, Citizens Financial Group Survey 2025]. RTP at 481 banks/CUs reaching 65% of U.S. checking accounts [verified 05/2026, The Clearing House RTP Network].
- 91% of businesses still using paper checks; checks remain the most fraud-affected payment type [verified 05/2026, AFP Payments Fraud Survey 2025]. FedNow fraud rates materially below ACH/wire/check.
- Consumer baseline: 48 payments per month per consumer in 2024; cash stable at ~7/month; credit and debit remain top two instruments. [verified 05/2026, Fed Diary of Consumer Payment Choice 2025]
- Use case maturation order: payroll → loan disbursements → wallet funding → insurance payouts → bill pay/RFP.

KEY REGULATORY:
- Durbin Amendment (2010): Caps debit interchange for $10B+ issuers at ~$0.22/txn; mandates dual-network routing. Exempt issuers (<$10B) and three-party networks (AmEx, Discover) not capped. [verified 05/2026, Federal Reserve Regulation II]
- Credit Card Competition Act (CCCA, reintroduced Jan 2026): Would require $100B+ issuers to enable 2+ unaffiliated networks on every credit card. Bipartisan support + presidential endorsement but has stalled legislatively. Structural threat to Visa/MC credit interchange. [verified 05/2026, CCCA Bill Text / Congress.gov]
- GENIUS Act (signed Jul 2025): First U.S. federal stablecoin framework. OCC NPRM Feb 2026. Stablecoins projected ~3% of USD payments in 2026, 10% by 2031. [verified 05/2026, GENIUS Act Public Law; projections via McKinsey Global Payments]
- PACE Act (introduced June 2025): Would expand fintech access to FedACH and FedNow rails. Fed "skinny account" proposal (Dec 2025) is the active 2026 regulatory file.

RECENT MARKET EVENTS (Nov 2025 - Apr 2026):
- Global Payments + Worldpay closed Jan 2026 ($24.25B) — largest pure-play merchant acquiring deal ever. GP divested Issuer Solutions to FIS for $13.5B. Combined: ~6M merchant locations, ~$3.7T volume, ~94B txns. [verified 05/2026, S&P Global / Company Press Releases]
- Capital One + Discover: Debit migration to Discover Network complete Q1 2026. Credit card origination on Discover began Feb 2026. Cap One now a vertically integrated triopoly member (issuer + closed-loop network + bank). Brex acquisition closed Apr 2026.
- Fiserv/Clover crisis: Stock down ~73% from peak [verified 05/2026, S&P Global Market Intelligence]. Class action over force-migration of ~200K merchants [verified 05/2026, Class Action Filing / SEC]. Clover GPV growth collapsed. Cautionary tale: aggressive pricing + lock-in fails when Stripe/Toast/Square exist.
- Agentic commerce: Visa Intelligent Commerce (100+ partners, live production) [verified 05/2026, Visa Press Release], Mastercard Agent Pay (agentic tokens with scoped credentials), Stripe Shared Payment Tokens. Networks embedding as trust layer for AI agent transactions.

CROSS-BORDER PAYMENTS & STABLECOIN REGULATORY (Q2 2026 REFRESH — BIS/CPMI/FSB):
BIS 2025 Annual Report: stablecoins perform poorly against the three tests for serving as monetary mainstay (singleness, elasticity, integrity) — BIS's clearest "stablecoins are not money" framing. Tokenisation, by contrast, can "improve the old" (smoothing payment frictions) and "enable the new" (programmable settlement). Use this dual framing — tokenisation favorable / stablecoins guarded — for any client touching stablecoins or tokenized deposits.

BIS Papers No. 167: ~$8T annually in DeFi-mediated illicit cross-border payments (Cerutti, Chen & Hengge 2024) [verified 05/2026, BIS Papers No. 167]. Stablecoin frameworks across jurisdictions remain "slower and uneven" — regulatory arbitrage opportunities. G20 cross-border payments program (2020-present) now operationalizing specific proposals. PayPal's stablecoin for remittances is canonical real-world use case.

BIS Papers No. 159 (2024 CBDC Survey): 91% of 93 central banks (85) exploring retail and/or wholesale CBDCs [verified 05/2026, BIS Papers No. 159]. Over 1 in 3 accelerated CBDC work due to stablecoin developments. Wholesale CBDC at more advanced stages than retail. CBDCs are preparing infrastructure for post-stablecoin world, not competing immediately.

CPMI 2025-2027 work program: programmable settlement (escrow, DVP, instant FX). G20 roadmap continues: longer FPS operating hours, FPS interlinkages, harmonized ISO 20022 data standards, persistent identifiers, programmatic sanctions screening — now table stakes for cross-border payments infrastructure clients.

IMF Stablecoins Paper (2025): stablecoins still require intermediaries (wallet providers, exchanges, validators) adding end-to-end costs. On/off-ramp and FX settlement costs must be factored in — counterweight against simplistic "stablecoins are cheaper" framing.

Operator pattern: tokenization of deposits is the favored direction; stablecoins tolerated where regulated; CBDC infrastructure being prepared. For any client with cross-border flows, payment routing intelligence (fee/FX/SLA/risk arbitrage in real time) is now the functional differentiator — not the rail itself.

STRUCTURAL THESIS: Software is eating payments distribution. ~85% of merchants choose payments with their software [verified 05/2026, McKinsey Global Payments]. ISO direct-sales is a shrinking channel. Vertical SaaS + embedded payments is the durable model. Anything enabling vertical SaaS (PFaaS, fraud/risk, compliance, embedded lending, rewards/incentives layered into software) is structurally favored.

KNOWN TRAPS — DATA THAT GOES STALE FASTEST (re-verify on every quarterly sweep):
- Interchange rates: Visa and Mastercard update schedules twice a year (April and October). Published rates shift by category; premium/rewards tiers creep up. Re-pull from published schedules each cycle.
- Network volume rankings: Acquiring volume shifts quarterly with merchant wins/losses and M&A. Nilson and Nilson-derived rankings lag 6-12 months. Cross-check with earnings releases from Fiserv, Global Payments, Stripe, Adyen, Toast.
- CCCA legislative status: Bill has been reintroduced multiple sessions. Track committee votes, floor scheduling, and any amendment riders each quarter. Status can shift from "stalled" to "passed committee" in weeks.
- Durbin Amendment thresholds: The Fed periodically adjusts the regulated debit cap [verified 05/2026, Federal Reserve Regulation II]. Any proposed rulemaking resets economics for large issuers above the statutory threshold.
- Section 1033 (Open Banking / CFPB): Final rule issued Oct 2024, phased compliance through 2030. Implementation timelines and legal challenges (bank trade group lawsuits) shift quarterly.
- Stablecoin legislation (GENIUS Act / OCC NPRM): Regulatory posture is evolving rapidly. OCC rulemaking, state-level frameworks, and enforcement actions change the landscape each quarter.
- FedNow / RTP adoption rates: Participant counts, transaction limits, and use-case maturity shift monthly. Federal Reserve publishes updated participant lists; The Clearing House publishes RTP stats.
- M&A activity: Payments M&A is cyclical and deal-heavy. Global Payments/Worldpay, Capital One/Discover, and Fiserv's strategic review can all generate follow-on deals. Track S&P Global and Nilson for announced/closed transactions.
- Fiserv/Clover stock and litigation: Stock price, class action status, and merchant migration numbers are fast-moving. Re-verify from SEC filings and earnings calls.
- Agentic commerce partnerships: Visa Intelligent Commerce and Mastercard Agent Pay partner counts and production status change quarterly. Verify from network press releases.
- Stablecoin market share projections: The ~3% (2026) and 10% (2031) figures are McKinsey estimates subject to revision. Cross-check with Chainalysis, BIS, and IMF updates. [verified 05/2026, McKinsey Global Payments Report]
- PayFac economics benchmarks: The 3-6x multiplier and $500K-$1M setup cost are industry estimates that shift with PFaaS pricing changes (Stripe Connect, Adyen for Platforms, Finix fee schedules). [verified 05/2026, Infinicept / Payrix / Finix]
`;

// ── PAYMENTS SCORING CONTEXT ────────────────────────────────────────────
// Used to calibrate ICP fit scoring when target/seller is payments-adjacent.

export const PAYMENTS_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Vertical SaaS with embedded payments", avgFit: "75-85%", reason: "Software-led distribution is dominant; payments attach-rate drives valuation; GTM complexity matches Cambrian" },
    { segment: "PayFac-as-a-Service providers", avgFit: "70-80%", reason: "Enabling the structural shift; durable demand from ISV/SaaS platforms" },
    { segment: "Regional banks with ISO/acquiring units", avgFit: "60-70%", reason: "Under pressure to modernize or divest; active M&A targets" },
    { segment: "Full-liability ISOs with vertical expertise", avgFit: "55-65%", reason: "Valuable portfolios but model under structural pressure; PE roll-up targets" },
  ],
  highFrictionSegments: [
    { segment: "Top-5 U.S. acquirers (Chase, Fiserv, GP/Worldpay)", avgFit: "10-20%", reason: "Procurement fortress; 12-18 month cycles; internal solutions" },
    { segment: "Visa/Mastercard (networks)", avgFit: "5-15%", reason: "Closed vendor ecosystems; regulatory sensitivity; extreme procurement" },
    { segment: "Generalist ISO portfolios without vertical focus", avgFit: "20-30%", reason: "Margin compression; no software moat; declining merchant adds" },
  ],
  keySignals: {
    positive: [
      "Merchant acquiring unit under strategic review or divestiture",
      "ISV/SaaS platform evaluating PayFac or PFaaS",
      "Bank exploring embedded payments or BaaS partnerships",
      "Company building agentic commerce capabilities",
      "Stablecoin or A2A payment infrastructure investment",
    ],
    negative: [
      "Locked into long-term processor contract (3+ years remaining)",
      "Legacy tiered pricing with high non-qualified surcharges",
      "No software differentiation — payments-only value prop",
      "Regulatory enforcement action pending",
    ],
  },
};

// ── PAYMENTS DISCOVERY QUESTIONS ────────────────────────────────────────
// Injected into discovery question generation for payments-vertical accounts.

export const PAYMENTS_DISCOVERY_INJECTION = `
PAYMENTS-SPECIFIC DISCOVERY ANGLES (use when the prospect is in payments, acquiring, processing, or fintech):

REALITY stage questions to explore:
- What's your current merchant acquiring setup — direct bank relationship, ISO, or platform-embedded?
- How are you handling PayFac/sub-merchant onboarding today — registered, PFaaS partner, or referral?
- What's your interchange optimization strategy — IC+, tiered, flat-rate, or surcharge/cash-discount?
- How exposed are you to CCCA routing mandates if they pass? Do you have a dual-network credit strategy?

IMPACT stage questions to quantify:
- What's your effective take-rate after interchange and assessments? How has it trended over 24 months?
- How much merchant attrition are you seeing to vertical SaaS platforms that bundle payments?
- What's the revenue impact of the Durbin-exempt vs. regulated debit split in your portfolio?
- How much are you spending on PCI compliance, fraud, and chargeback management annually?

VISION stage questions to frame the future:
- If you could redesign your payments distribution from scratch, would you go ISO, PayFac, or embedded?
- What's your strategy for agentic commerce — AI agents initiating transactions on behalf of customers?
- How are you thinking about stablecoin/A2A rails as alternatives to card-based settlement?

ENTRY POINTS — who owns what:
- Head of Payments / VP Merchant Services (strategy + P&L)
- CTO / VP Engineering (platform, gateway, API integration)
- CFO / VP Finance (interchange optimization, take-rate, settlement)
- Chief Risk Officer (underwriting, fraud, compliance, PCI)
- Head of Partnerships / BD (ISV relationships, PayFac partnerships)
`;
