// src/data/accountingFinanceKnowledge.js
//
// Accounting, P&L Architecture, and Financial Management knowledge.
// The financial substrate underneath revenue operations — GAAP, unit
// economics, SaaS metrics, EBITDA, working capital, and how to
// translate revenue work into enterprise value language.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

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
PE and acquirers value at EBITDA × multiple. Every $1 incremental EBITDA at 8-12x = $8-12M enterprise value. Adjusted EBITDA adds back one-time items, SBC, acquisition amortization. Quality matters: recurring "one-time" items and SBC at 25%+ of revenue signal earnings quality issues.

WORKING CAPITAL:
Cash Conversion Cycle = DSO + DIO - DPO. SaaS with annual upfront billing runs NEGATIVE working capital (collects before delivering) — structural advantage. Growing companies consume working capital; fast growth without cash-efficient billing = capital dependency.

FINANCIAL TOOLING MATURITY:
QuickBooks → Xero → Sage Intacct → NetSuite (mid-market standard, $25-500M revenue) → Workday (enterprise). Stack signals: QuickBooks = early/simple. NetSuite + Adaptive Planning + modern billing (Stripe/Chargebee) = ready for complex revenue ops.

KEY POSITIONING: Most consultants pitch in marketing/sales language. Your edge: translate pipeline improvements into EBITDA and multiple expansion — the language CFOs and PE owners speak. "12% conversion lift at 70% gross margin and 40% operating leverage = $X incremental EBITDA at 10x multiple." That's the conversation that wins CFO-led deals.
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
