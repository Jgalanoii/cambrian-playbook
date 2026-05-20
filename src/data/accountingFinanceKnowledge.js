// src/data/accountingFinanceKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// Accounting, P&L Architecture, and Financial Management knowledge.
// The financial substrate underneath revenue operations — GAAP, unit
// economics, SaaS metrics, EBITDA, working capital, and how to
// translate revenue work into enterprise value language.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// SOURCES:
// - ASC 606 (Revenue Recognition) — FASB Codification
// - ASU 2023-07 (Segment Reporting, ASC 280) — KPMG Handbook Oct 2025, Deloitte Roadmap Aug 2025, BDO Blueprint Dec 2025, Grant Thornton audit guidance
// - ASU 2023-08 (Crypto Assets, ASC 350-60) — Deloitte Heads Up FAQ July 2025, CPA Journal Dec 2024 (Owhoso)
// - ASU 2023-05 (Joint Venture Formations) — FASB Codification
// - SEC SAB 121/122 (crypto custody rescission)
// - Deloitte March 2025 Fortune 500 segment reporting review
// - NAIC Aug 2025 statutory accounting rejection of ASU 2023-07

export const ACCOUNTING_FINANCE_INJECTION = `
FINANCIAL FLUENCY FOR REVENUE INTELLIGENCE (use to ground revenue recommendations in enterprise value language):

P&L ARCHITECTURE:
Revenue - COGS = Gross Profit. Gross Profit - OpEx (S&M, R&D, G&A) = Operating Income. Gross margin defines how much of every dollar funds operations and growth. Operating leverage (revenue growing faster than opex) drives multiple expansion.

REVENUE RECOGNITION (ASC 606):
Revenue recognized when control transfers — point-in-time or over-time. SaaS subscriptions recognize over time (1/12 monthly for annual). $12M annual bookings in January = ~$1M Q1 reported revenue + $11M deferred. ARR ≠ reported revenue. Commissions capitalized and amortized over customer lifetime.

UNIT ECONOMICS:
- CAC = total S&M / new customers. LTV = ARPC × gross margin × (1/churn). LTV:CAC should be 3:1+.
- CAC payback: <12 months B2B, <6 months SMB.
- Burn multiple = net burn / net new ARR. <1.5x is efficient.

SAAS METRICS (what CFOs and investors obsess over):
- ARR: annualized recurring contract value.
- NRR (Net Revenue Retention): >120% = exceptional. Revenue from same customers YoY.
- GRR (Gross Retention): ex-expansion. Measures churn severity.
- Magic Number: (QoQ new ARR × 4) / prior Q S&M spend. >0.7 = efficient.
- Rule of 40: revenue growth % + EBITDA margin %. >40 = best-in-class.

EBITDA & VALUATION:
PE and acquirers value at EBITDA × multiple. Every $1 incremental EBITDA at 8-12x = $8-12M enterprise value [verified 05/2026, standard PE valuation math]. Adjusted EBITDA adds back one-time items, SBC, acquisition amortization. Quality matters: recurring "one-time" items and SBC at 25%+ of revenue signal earnings quality issues.

WORKING CAPITAL:
Cash Conversion Cycle = DSO + DIO - DPO. SaaS with annual upfront billing runs NEGATIVE working capital (collects before delivering) — structural advantage. Growing companies consume working capital; fast growth without cash-efficient billing = capital dependency.

FINANCIAL TOOLING MATURITY:
QuickBooks → Xero → Sage Intacct → NetSuite (mid-market standard, $25-500M revenue) → Workday (enterprise) [verified 05/2026, Cambrian operator knowledge]. Stack signals: QuickBooks = early/simple. NetSuite + Adaptive Planning + modern billing (Stripe/Chargebee) = ready for complex revenue ops.

FASB UPDATES (Q2 2026 REFRESH — Grant Thornton pedigree makes this unusually credible for Cambrian):

ASU 2023-07 — SEGMENT REPORTING (ASC 280): Effective for PBEs fiscal years after Dec 15, 2023 (first interim filings Q1 2025). The largest change to segment reporting since FAS 131 in 1997. Core change: the "significant expense principle" — must disclose significant segment expenses regularly provided to CODM, both annually and interim. ~7% of Fortune 500 voluntarily disclosed additional GAAP-consistent segment measures; ~1% disclosed non-GAAP (e.g., segment-adjusted EBITDA) [verified 05/2026, Deloitte March 2025 review]. SEC comment letter focus in H1 2025: R&D disaggregation by program, single-segment entity disclosures, how CODM uses profit/loss measures in resource allocation — "form vs. substance" is the SEC lens. NAIC rejected ASU 2023-07 for statutory accounting (Aug 2025) [verified 05/2026, NAIC proceedings] — flag for insurance-vertical work. Anchor citations: KPMG Handbook (Oct 2025 — most cited), Deloitte Roadmap (Aug 2025), BDO Blueprint (Dec 2025), Grant Thornton audit guidance.

ASU 2023-08 — CRYPTO ASSETS (ASC 350-60): Effective for ALL entities fiscal years after Dec 15, 2024. Eliminates prior cost-less-impairment model — crypto assets now measured at FAIR VALUE (ASC 820) with changes in NET INCOME each period. Scope: must be intangible, no enforceable claims on underlying assets, on distributed ledger, cryptographically secured, fungible, not created by reporting entity. OUT of scope: NFTs, stablecoins (backed by underlying claims), self-issued tokens. CRITICAL TAX INTERACTION: the 15% CAMT on adjusted financial statement income creates exposure — unrealized gains/losses from crypto fair value flow into AFSI after adoption. Any client with material crypto holdings (including payments/BaaS with stablecoin reserves) needs CAMT modeling. SAB 121 was rescinded by SEC SAB 122 in 2025 [verified 05/2026, SEC.gov] — important for custodian-of-crypto clients. Transition: modified-retrospective with cumulative-effect adjustment. Anchor citation: Deloitte Heads Up FAQ (July 2025 update), CPA Journal Dec 2024 (Owhoso) for academic synthesis.

ASU 2023-05 — JOINT VENTURE FORMATIONS: Effective for JVs formed after Jan 1, 2025. New basis of accounting — contributed net assets at fair value upon formation. Material for bank-fintech BaaS arrangements where formation accounting becomes a diligence question.

KEY POSITIONING: Most consultants pitch in marketing/sales language. Your edge: translate pipeline improvements into EBITDA and multiple expansion — the language CFOs and PE owners speak. "12% conversion lift at 70% gross margin and 40% operating leverage = $X incremental EBITDA at 10x multiple." That's the conversation that wins CFO-led deals. The Grant Thornton compliance pedigree — especially in segment reporting (ASU 2023-07) and crypto accounting (ASU 2023-08) — is a genuine credibility differentiator in financial services and PE engagements.

KNOWN TRAPS:
- ARR vs reported revenue: a common conflation. $12M ARR booked in January is ~$1M Q1 revenue. Never equate the two.
- "Adjusted EBITDA" add-backs vary wildly — recurring "one-time" items and SBC at 25%+ of revenue signal quality issues. Always ask what's in the bucket.
- ASU 2023-07 segment reporting is effective NOW for PBEs — do not describe as "upcoming." Some practitioners are still unaware.
- Crypto fair value (ASU 2023-08) creates CAMT exposure via unrealized gains flowing into AFSI — this is a tax trap many CFOs haven't modeled.
- NAIC rejection of ASU 2023-07 means insurance-vertical clients follow different segment rules — do not assume universal applicability.
- "Rule of 40" and "Magic Number" are heuristics, not standards — never cite without context on the company's stage and business model.
`;

export const ACCOUNTING_FINANCE_SCORING = {
  highFitSignals: [
    "PE-backed, post-Series C, or approaching exit (values EBITDA translation)",
    "CFO is economic buyer or key influencer",
    "Can articulate gross margin, CAC payback, and cohort retention",
    "Uses NetSuite, Adaptive, or equivalent financial stack",
    "EBITDA margin 15%+; Rule of 40 > 30",
  ],
  highFrictionSignals: [
    "Pre-Series B or bootstrapped with no financial infrastructure",
    "Cannot articulate gross margin or CAC payback",
    "On QuickBooks with manual revenue recognition",
    "Revenue retention <85%; high churn, acquisition-driven growth",
    "Negative EBITDA with no path to profitability",
  ],
};

export const ACCOUNTING_FINANCE_DISCOVERY = `
FINANCIAL FLUENCY DISCOVERY (use when speaking with CFOs, PE operating partners, or financially-sophisticated buyers):

- What's your EBITDA margin today, and where does the board want it?
- Walk me through your gross margin by product line — how has the mix shifted in 18 months?
- What's your S&M as a % of revenue, and where should it be as you scale?
- Can you show me CAC payback by channel? Which channel is most efficient?
- What's your cash conversion cycle — improving or degrading?
- What's the gap between booked ARR and reported revenue? Is it widening?
- What's your NRR by cohort? Improving, flat, or declining?
- Walk me through the variance between your forecast four quarters ago and actual results.
- What's in your adjusted EBITDA bucket? What are you adding back and why?
- How is operating leverage showing up? Where are you losing it?
`;
