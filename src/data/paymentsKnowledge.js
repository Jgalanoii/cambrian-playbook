// src/data/paymentsKnowledge.js
//
// Deep payments industry knowledge layer — ISOs, acquiring banks, payment
// processing, networks, card economics, PayFac/embedded payments, and
// recent market events (Nov 2025 → Apr 2026).
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_PAYMENTS (populated by fetchKnowledgeLayer()).

// ── PAYMENTS INDUSTRY INJECTION ─────────────────────────────────────────
// Injected into prompts when the seller or target operates in payments,
// fintech, banking, or card-related verticals. Provides grounding for
// fit scoring, brief generation, and discovery questions.

export const PAYMENTS_INDUSTRY_INJECTION = `
PAYMENTS INDUSTRY CONTEXT (use when the target or seller is in payments, fintech, card processing, banking, or merchant services):

FOUR-PARTY MODEL: Cardholder → Issuer (card-issuing bank) → Network (Visa/MC) → Acquirer (merchant's bank) → Merchant. Interchange flows from acquirer to issuer. The merchant funds it. AmEx and Discover operate three-party (issuer + network + acquirer in one).

ACQUIRING MARKET (2025-2026 ranking by volume):
1. JPMorgan Chase (~$2.61T) 2. Fiserv 3. Worldpay/Global Payments (merged Jan 2026, $24.25B deal) 4. Wells Fargo 5. Stripe ($1.9T in 2025, +34% YoY) 6. BofA 7. Elavon/US Bank 8. Braintree/PayPal 9. Adyen (first top-10, €2.36B net rev) 10. Toast (dominant restaurant vertical).
Bank-owned acquiring is fading; growth is at tech-led acquirers (Stripe, Adyen, Toast, Square, Shift4).

ISO LANDSCAPE: ISOs (Independent Sales Organizations) are third-party sales entities sponsored by acquiring banks. Three models: Referral/Sub-ISO (earns residuals, no registration), Registered Sales-only ISO (50-70% rev-share on spread), Full-Liability ISO (owns portfolio, highest margin/risk/exit value). ISOs are being squeezed by software-led distribution (~85% of merchants now choose payments with their software), direct merchant products (Stripe/Square self-serve), and margin compression (effective rates down from 3.5%+ to 2.6-2.9%).

PAYMENT ECONOMICS:
- Total merchant cost = Interchange + Network Assessments + Processor Markup
- U.S. average interchange: ~1.80%. Card-present: ~1.70%. Card-not-present: ~1.90%. Regulated debit: ~$0.22 flat. Premium rewards credit: 2.10-2.40%+. Commercial: 2.20-2.80%+.
- Network assessments: ~0.13-0.15% + per-txn fees
- Pricing models: Interchange-Plus (transparent, mid-market+), Tiered (opaque, legacy ISO), Flat-Rate (Square/Stripe simplicity)
- On a $100 Visa rewards credit txn: issuer gets ~$2.10 (interchange), network gets ~$0.14 (assessments), processor gets ~$0.30 (markup), merchant pays ~$2.54.

PAYFAC & EMBEDDED PAYMENTS: PayFac holds one master MID, onboards sub-merchants, takes liability. PayFac captures 3-6x the economics of an ISO residual. Becoming a full PayFac costs ~$500K-$1M setup + $50M+ volume to break even. PayFac-as-a-Service (Stripe Connect, Adyen for Platforms, Finix, Rainforest) is the default for vertical SaaS — platform brands the experience, partner handles compliance/settlement.

KEY REGULATORY:
- Durbin Amendment (2010): Caps debit interchange for $10B+ issuers at ~$0.22/txn; mandates dual-network routing. Exempt issuers (<$10B) and three-party networks (AmEx, Discover) not capped.
- Credit Card Competition Act (CCCA, reintroduced Jan 2026): Would require $100B+ issuers to enable 2+ unaffiliated networks on every credit card. Bipartisan support + presidential endorsement but has stalled legislatively. Structural threat to Visa/MC credit interchange.
- GENIUS Act (signed Jul 2025): First U.S. federal stablecoin framework. OCC NPRM Feb 2026. Stablecoins projected ~3% of USD payments in 2026, 10% by 2031.

RECENT MARKET EVENTS (Nov 2025 - Apr 2026):
- Global Payments + Worldpay closed Jan 2026 ($24.25B) — largest pure-play merchant acquiring deal ever. GP divested Issuer Solutions to FIS for $13.5B. Combined: ~6M merchant locations, ~$3.7T volume, ~94B txns.
- Capital One + Discover: Debit migration to Discover Network complete Q1 2026. Credit card origination on Discover began Feb 2026. Cap One now a vertically integrated triopoly member (issuer + closed-loop network + bank). Brex acquisition closed Apr 2026.
- Fiserv/Clover crisis: Stock down ~73% from peak. Class action over force-migration of ~200K merchants. Clover GPV growth collapsed. Cautionary tale: aggressive pricing + lock-in fails when Stripe/Toast/Square exist.
- Agentic commerce: Visa Intelligent Commerce (100+ partners, live production), Mastercard Agent Pay (agentic tokens with scoped credentials), Stripe Shared Payment Tokens. Networks embedding as trust layer for AI agent transactions.

STRUCTURAL THESIS: Software is eating payments distribution. ~85% of merchants choose payments with their software. ISO direct-sales is a shrinking channel. Vertical SaaS + embedded payments is the durable model. Anything enabling vertical SaaS (PFaaS, fraud/risk, compliance, embedded lending, rewards/incentives layered into software) is structurally favored.
`;

// ── PAYMENTS SCORING CONTEXT ────────────────────────────────────────────
// Used to calibrate ICP fit scoring when target/seller is payments-adjacent.

export const PAYMENTS_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Vertical SaaS with embedded payments", avgFit: "65-75%", reason: "Software-led distribution is dominant; payments attach-rate drives valuation" },
    { segment: "PayFac-as-a-Service providers", avgFit: "60-70%", reason: "Enabling the structural shift; durable demand from ISV/SaaS platforms" },
    { segment: "Regional banks with ISO/acquiring units", avgFit: "55-65%", reason: "Under pressure to modernize or divest; active M&A targets" },
    { segment: "Full-liability ISOs with vertical expertise", avgFit: "50-60%", reason: "Valuable portfolios but model under structural pressure; PE roll-up targets" },
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
