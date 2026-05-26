// src/data/accountingFinanceKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// Accounting, Audit, Tax, Corporate Finance, and Financial Management knowledge.
// Covers: Big 4, mid-tier firms, CPA practices, corporate finance / FP&A,
// close management, audit technology, tax technology, and the financial
// substrate underneath revenue operations.
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
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
// - Statista, Big Four Accounting Firms Global Revenue (2025)
// - IE, Big 4 Companies 2026 overview
// - Gitnux, Accounting Industry Statistics 2026
// - Accounting Today, Tech Spending and AI Adoption (2026)
// - CPA Practice Advisor, Technology Trends for Accountants 2026
// - Wolters Kluwer, Top Challenges Facing Accounting Firms 2026
// - SkyQuest / Future Market Insights, Close Management Software Market
// - BlackLine, FloQast, Workiva competitive analysis (multiple sources)
// - RSM transatlantic partnership announcement (Oct 2025)
// - BDO UK-Ireland merger announcement (2025)
// - Grant Thornton PE-backed multinational expansion

export const ACCOUNTING_FINANCE_INJECTION = `
ACCOUNTING & FINANCE INDUSTRY CONTEXT (use when target or seller is in accounting, audit, tax, corporate finance, FP&A, close management, or financial services technology):

---

## 1. Snapshot and market sizing

### Global accounting services market
- Global accounting services market: $684.5B (2023), projected $908B by 2030 at 4.2% CAGR [verified 05/2026, Gitnux / industry estimates].
- Big 4 combined revenue: $219B (FY 2025), employing 1.5M+ people globally [verified 05/2026, Statista].
  - Deloitte: $70.5B (FY 2025), ~473,000 employees — largest by revenue [verified 05/2026, Statista / IE].
  - PwC: $55.4B (FY 2025), ~370,000 employees [verified 05/2026, Statista / IE].
  - EY: $53.2B (FY 2025), ~406,000 employees [verified 05/2026, Statista / IE].
  - KPMG: $39.8B (FY 2025), ~276,000 employees — smallest Big 4 [verified 05/2026, Statista / IE].
- Mid-tier firms growing through consolidation and transatlantic mergers (see Section 4).
- US accounting services: ~$200B market [verified 05/2026, IBISWorld / Gitnux].

### Corporate finance technology
- Close management / reconciliation software: ~$5.8B market, growing at 12% CAGR [verified 05/2026, industry analysis].
- BlackLine: 4,300+ customers, enterprise-dominant [verified 05/2026, BlackLine corporate site].
- FloQast: 2,800+ customers, mid-market-dominant [verified 05/2026, FloQast corporate site].
- Workiva: compliance and reporting focus (SOX, SEC filings, ESG) [verified 05/2026, Workiva corporate site].
- FP&A / EPM platforms: Anaplan (Thoma Bravo), Adaptive Planning (Workday), Planful, Vena, Pigment — $8-10B market.
- ERP mid-market: Sage Intacct ($15-30K/yr, SMB champion), NetSuite ($30-100K+/yr, mid-market standard), Workday (enterprise) [verified 05/2026, multiple vendor comparison sites].

### AI in accounting
- 64% of firms will invest in AI in 2026, up from 57% in 2024 [verified 05/2026, CPA Practice Advisor / CPA Trendlines].
- Only 22% of organizations have a defined AI strategy, yet 50%+ report seeing ROI from AI already [verified 05/2026, CPA Practice Advisor].
- McKinsey estimates GenAI could automate 60-70% of finance work activities [verified 05/2026, McKinsey / industry analysis].
- Billing rates for tax prep increasing 10.8% YoY, outpacing average fee increase of 4.5% [verified 05/2026, CPA Trendlines].

---

## 2. What makes this vertical distinct as a sales target

**1. The busy season buying freeze is real.** Accounting firms and corporate finance teams have a hard buying freeze from January through mid-April (tax season) and again during Q4 close and audit preparation. Enterprise technology purchases happen in May-September (post-busy-season, pre-close) and November-December (budget flush). Sellers who pitch during busy season get ghosted — not because the prospect isn't interested, but because they physically cannot evaluate vendors while filing returns or closing books. This is the single most important timing insight for any B2B seller targeting this vertical.

**2. Controller vs. CFO mandates create two distinct buying motions.** The Controller (or CAO) owns the close process, reconciliation, audit prep, and compliance reporting. They buy BlackLine, FloQast, Workiva, and close-automation tools. The CFO owns FP&A, strategic finance, capital allocation, and board reporting. They buy Anaplan, Adaptive Planning, and EPM platforms. These are different buyers with different budgets, different success metrics, and different evaluation criteria — even though they sit in the same "finance" function. A seller who conflates Controller and CFO needs is immediately disqualified.

**3. Audit cycle timing drives compliance-tech procurement.** Public companies operate on a Q4 close → Q1 audit → Q2 10-K filing cycle. Every year, the audit surfaces tool gaps, manual-process inefficiencies, and compliance findings. The post-audit debrief (typically March-May for calendar-year filers) is the #1 procurement trigger for close management, reconciliation, and compliance tools. Cambrian sellers should time outreach to the post-audit window.

**4. The talent crisis is the industry's defining constraint.** CPA pipeline has declined 33% since 2016 [verified 05/2026, AICPA estimates / Accounting Today]. The 150-credit-hour requirement to sit for the CPA exam discourages candidates. Firms are doing more work with fewer people — billing rates up 10.8% YoY but margins compressing because labor cost inflation outpaces fee growth. Technology adoption is no longer optional; it's an existential response to a structural labor shortage.

---

## 3. Sub-categorization of buyer segments

| Sub-category | Scale | Key Dynamics | Buyer Profile |
|---|---|---|---|
| **Big 4** (Deloitte, PwC, EY, KPMG) | $40-71B revenue each; 250-470K employees | Consulting + audit + tax + advisory; global; highly structured procurement | CTO/CIO-led; 12-18 month sales cycles; enterprise procurement gates |
| **Mid-tier national firms** (BDO, Grant Thornton, RSM, Crowe, CBIZ, Moss Adams, Baker Tilly, CohnReznick, Plante Moran, Marcum) | $1-15B revenue; 5-30K employees | Growing via M&A; increasingly tech-forward; advisory growing faster than audit/tax | Managing Partner or CTO-led; 6-12 month cycles |
| **Regional CPA firms** (top 100-500) | $50M-$1B revenue; 200-5,000 employees | Audit + tax + advisory; consolidating rapidly via PE roll-ups | Managing Partner decides; 60-120 day cycle |
| **Local CPA practices** (single office, <50 people) | $1-50M revenue | Tax preparation + bookkeeping + small-business advisory | Owner/partner decides alone; 7-30 day cycle |
| **Corporate finance / FP&A teams** | Inside every company $25M+ revenue | Close management, budgeting, forecasting, reporting | Controller or VP Finance; 60-180 day cycle |
| **Corporate accounting (controller function)** | Inside every company $10M+ revenue | General ledger, reconciliation, audit prep, compliance | Controller or CAO; 90-180 day cycle |
| **PE/VC operating teams** | Inside every fund with portfolio | Portfolio-company financial reporting, consolidation, value creation | Operating Partner or VP Finance; 60-90 day cycle |
| **Outsourced accounting / BPO** | $5-20B market | Bookkeeping, payroll, close-as-a-service | CTO or Head of Delivery; 30-90 day cycle |

---

## 4. Major companies (named, with market positions)

### Big 4
- **Deloitte** — $70.5B FY 2025. Largest by revenue. Consulting and advisory revenue exceeds audit/tax. North/South America generates 55%+ of revenue [verified 05/2026, Statista]. Strong in technology consulting, strategy (Monitor Deloitte), and risk/financial advisory.
- **PwC (PricewaterhouseCoopers)** — $55.4B FY 2025. Strongest audit practice by market share. Trust Solutions (audit + assurance) is the core. Strategy& (consulting). Global Tax practice.
- **EY (Ernst & Young)** — $53.2B FY 2025. Shelved the "Project Everest" audit/consulting split in 2023 — cultural overhang remains. Strong in managed services and technology consulting.
- **KPMG** — $39.8B FY 2025. Smallest Big 4. Europe/Middle East/Africa/India is most lucrative region (unlike other Big 4). Strong in financial services audit.

### Mid-tier firms (the consolidation wave)
- **BDO International** — $15B+ global revenue (FY 2024) [verified 05/2026, BDO]. BDO UK merging with BDO Ireland to create 1.1B GBP super-firm [verified 05/2026, The Finance Story].
- **Grant Thornton** — PE-backed multinational expansion across France, Spain, Belgium, Ireland, UAE, Luxembourg, Netherlands, Switzerland [verified 05/2026, industry reporting]. Evolving from traditional partnership to integrated multinational advisory platform.
- **RSM** — US + UK + Ireland transatlantic partnership announced Oct 2025; combined 23,000 employees, $5B annual revenues [verified 05/2026, Accountancy Age / RSM]. The transatlantic integration (leadership, investments, partner pay) is the most aggressive mid-tier consolidation move in recent memory.
- **Crowe** (Crowe Global) — Strong in financial services, healthcare, manufacturing audit. Growing advisory practice.
- **CBIZ** — Unique model: business services (insurance, benefits, payroll) + accounting/tax via Mayer Hoffman McCann alliance.
- **Moss Adams** — Largest West Coast-headquartered firm. Strong in technology, life sciences, real estate verticals.
- **Baker Tilly** — PE interest and international alignment (Baker Tilly International). Growing advisory.
- **CohnReznick** — Strong in real estate, cannabis, renewable energy.
- **Plante Moran** — Midwest-based; consistently ranked among best firms to work for.
- **Marcum** — Merged with Friedman in 2022 to reach top 15.

### Close management / financial automation
- **BlackLine** (NASDAQ: BL) — 4,300+ customers. Enterprise close automation. Pricing: $77K-$340K/yr. 5-6 month implementation. Built for SAP and Oracle environments [verified 05/2026, industry analysis / G2].
- **FloQast** — 2,800+ customers. Mid-market close management. Pricing: $30K-$80K/yr. 4-6 week implementation. Built for Excel-heavy teams [verified 05/2026, industry analysis / G2]. PE-backed (Norwest).
- **Workiva** (NYSE: WK) — Compliance and reporting. SOX, SEC filings, ESG reporting. Connected reporting platform. Public company.
- **Numeric** — Next-gen close management. Founded by ex-FloQast. AI-forward.
- **HighRadius** — AR/AP automation + close management (Treasury Management). Enterprise.
- **Sage Intacct** — Cloud accounting for mid-market ($15-30K/yr). 15-250 employees, $5-250M revenue sweet spot. Dimensional reporting is killer feature [verified 05/2026, SoftwareConnect / vendor comparison]. Best-in-class financial reporting for its segment.
- **NetSuite** (Oracle) — Mid-market ERP standard ($30-100K+/yr). Full platform: CRM, e-commerce, HCM, financials [verified 05/2026, vendor comparison].
- **Coupa** (Thoma Bravo) — Procurement and spend management platform. BSM (Business Spend Management). Enterprise.
- **Brex, Ramp, BILL** — Corporate card and spend management. SMB/mid-market. Growing into FP&A adjacency.

### FP&A / EPM
- **Anaplan** (Thoma Bravo) — Enterprise planning platform. PE-owned since 2022 ($10.7B take-private).
- **Adaptive Planning** (Workday) — Planning and budgeting. Part of Workday suite.
- **Planful** (fka Host Analytics) — Cloud FP&A for mid-market.
- **Vena Solutions** — Excel-native FP&A platform.
- **Pigment** — Next-gen business planning. European-origin.

### Audit technology
- **Wolters Kluwer** (TeamMate, CCH) — Audit management and tax software. Dominant in audit workpaper management.
- **Thomson Reuters** (ONESOURCE, CS Professional Suite, UltraTax) — Tax compliance and research. Massive installed base.
- **CaseWare** — Audit and financial reporting. International.
- **Casepoint / Relativity** — E-discovery and document review for audit support.
- **MindBridge** — AI-powered audit analytics.
- **Ideagen (Inflo)** — Cloud audit platform.

---

## 5. Regulatory overlay

### US GAAP and FASB
- **ASC 606 (Revenue Recognition)** — Revenue recognized when control transfers. SaaS subscriptions recognized over time (1/12 monthly for annual). $12M annual bookings in January = ~$1M Q1 reported revenue + $11M deferred. ARR does NOT equal reported revenue. Commissions capitalized and amortized over customer lifetime.
- **ASU 2023-07 (Segment Reporting, ASC 280)** — Effective for PBEs fiscal years after Dec 15, 2023 (first interim filings Q1 2025). The largest change to segment reporting since FAS 131 (1997). Core change: "significant expense principle" — must disclose significant segment expenses regularly provided to CODM, both annually and interim. ~7% of Fortune 500 voluntarily disclosed additional GAAP-consistent segment measures; ~1% disclosed non-GAAP [verified 05/2026, Deloitte March 2025 review]. SEC comment letter focus in H1 2025: R&D disaggregation, single-segment disclosures, how CODM uses profit/loss measures. NAIC rejected ASU 2023-07 for statutory accounting (Aug 2025) [verified 05/2026, NAIC] — flag for insurance vertical.
- **ASU 2023-08 (Crypto Assets, ASC 350-60)** — Effective for ALL entities fiscal years after Dec 15, 2024. Crypto assets now at FAIR VALUE (ASC 820) with changes in NET INCOME each period. CRITICAL TAX INTERACTION: 15% CAMT on adjusted financial statement income creates exposure — unrealized gains/losses from crypto fair value flow into AFSI. SAB 121 rescinded by SEC SAB 122 in 2025 [verified 05/2026, SEC.gov].
- **ASU 2023-05 (Joint Venture Formations)** — Effective for JVs formed after Jan 1, 2025. New basis of accounting — contributed net assets at fair value upon formation.
- **ASC 842 (Leases)** — Operating and finance leases on balance sheet. Still generating implementation questions for complex portfolios.

### SOX compliance
- Sarbanes-Oxley Section 404 requires internal control assessment for public companies.
- External audit of ICFR (Internal Control over Financial Reporting) for accelerated filers.
- Drives demand for control-testing automation (BlackLine, Workiva).
- SOX remediation is a reliable trigger event for close-management purchases.

### Tax regulatory
- **GILTI / BEAT / FDII** — International tax provisions (Tax Cuts and Jobs Act).
- **CAMT (Corporate Alternative Minimum Tax)** — 15% on adjusted financial statement income. Effective for large corporations ($1B+ average annual AFSI). Creates crypto-accounting exposure (ASU 2023-08).
- **Pillar Two (Global Minimum Tax)** — OECD 15% global minimum; many jurisdictions implementing. Major compliance burden for multinational corporations.
- **Section 174 (R&D Amortization)** — R&D expenses must be capitalized and amortized (5yr domestic, 15yr foreign) instead of expensed. Major cash-flow impact for tech companies. Bipartisan support for reversal but not yet enacted.
- **ERC (Employee Retention Credit)** — IRS moratorium on processing new claims; significant audit activity on past claims.

### Professional standards
- **AICPA / PCAOB** — Auditing standards, quality control, peer review.
- **150-credit-hour rule** — CPA licensure requires 150 credit hours (effectively a master's degree). Widely criticized for suppressing CPA pipeline. Minnesota and other states exploring alternatives [verified 05/2026, Accounting Today / AICPA].
- **CPA Evolution** — New CPA exam format (effective 2024): core + discipline. Choose from BAR, ISC, or TCP.

---

## 6. Technology stack and vendor landscape

### The accounting technology maturity ladder

| Stage | Tools | Revenue Range | Signal |
|---|---|---|---|
| **Stage 1: Starter** | QuickBooks Online / Xero, Excel, manual bank feeds | $0-5M | Early; simple; no close process |
| **Stage 2: Growing** | QuickBooks Advanced or Sage Intacct, basic payroll, simple AP automation | $5-25M | Outgrowing starter tools; pain emerging |
| **Stage 3: Mid-market** | Sage Intacct or NetSuite, FloQast for close, basic FP&A (Vena/Planful), Brex/Ramp for spend | $25-100M | Ready for structured close process; CFO hire |
| **Stage 4: Scale** | NetSuite + FloQast/BlackLine, Adaptive/Anaplan for planning, Coupa for procurement, Workiva for compliance | $100-500M | Multi-entity, possibly PE-backed; EBITDA-focused |
| **Stage 5: Enterprise** | SAP/Oracle + BlackLine, Workiva, Anaplan, Coupa, dedicated tax tech (ONESOURCE/Vertex) | $500M+ | Full finance stack; CAO/CFO split; SOX-compliant |

### Stack signals for Cambrian sellers
- QuickBooks = early/simple. Unlikely complex revenue ops.
- Sage Intacct = mid-market, finance-aware, probably has a real Controller.
- NetSuite + Adaptive Planning + modern billing (Stripe/Chargebee) = ready for complex revenue ops.
- BlackLine = enterprise, SAP/Oracle, likely public or PE-backed.
- FloQast = mid-market, Excel-heavy teams, Controller-champion.
- No close-management tool = manual close, high audit friction, strong purchase signal.

---

## 7. ICP patterns by buyer type

### Highest-fit Cambrian prospects

**Sellers AT accounting/finance tech vendors (BlackLine, FloQast, Workiva, Sage Intacct, Planful):**
- Fit: 80-90%. B2B SaaS selling motion into a well-defined buyer (Controller or CFO).
- Discovery: pipeline by segment (public vs. PE-backed vs. mid-market), competitive displacement dynamics, busy-season impact on pipeline.

**Sellers INTO PE-backed companies (post-investment, building finance function):**
- Fit: 75-85%. PE operating partners mandate financial infrastructure upgrades post-acquisition.
- Discovery: current ERP, close-process maturity, audit findings, EBITDA reporting cadence.

**Sellers AT mid-tier accounting firms (BDO, RSM, Grant Thornton, Crowe):**
- Fit: 70-80%. Advisory practice growing; technology-enabled service delivery.
- Discovery: advisory vs. audit/tax revenue mix, technology investment roadmap, talent constraints.

**CFO-led deals at companies $50-500M revenue:**
- Fit: 70-85%. CFO as economic buyer; EBITDA translation is the value prop.
- Discovery: gross margin by product line, S&M as % of revenue, NRR by cohort, adjusted EBITDA add-backs.

### Lower-fit segments

**Big 4 (Deloitte, PwC, EY, KPMG):**
- Fit: 15-25%. Enterprise procurement; 12-18 month cycles; internal resources for most needs.

**Local CPA practices (<50 people):**
- Fit: 20-30%. Too small for consulting engagement; need tools, not architecture.

**Pre-Series B startups without financial infrastructure:**
- Fit: 10-20%. Cannot articulate gross margin or CAC payback. On QuickBooks with manual revenue recognition.

---

## 8. Buying committee and decision dynamics

| Role | What They Care About | Their Lens |
|---|---|---|
| **CFO** | Capital allocation, EBITDA margin, board reporting, investor relations | "How does this translate to enterprise value?" |
| **Controller / CAO** | Close efficiency, audit-readiness, compliance, accuracy | "Will this reduce our close by 3 days and eliminate audit findings?" |
| **VP FP&A** | Forecast accuracy, scenario modeling, variance analysis | "Can I model this in our planning cadence?" |
| **Head of Tax** | Compliance, provision accuracy, rate optimization | "Does this reduce our effective rate or compliance risk?" |
| **Head of Internal Audit** | Control testing, SOX compliance, risk assessment | "Does this strengthen our control environment?" |
| **CIO / CTO** | Integration, security, data architecture | "Does this fit our stack without creating a data silo?" |
| **Managing Partner (at firms)** | Revenue per partner, realization rates, talent leverage | "Does this help us do more with fewer people?" |
| **PE Operating Partner** | Portfolio financial performance, reporting cadence, exit-readiness | "Does this make our portcos more auditable and more valuable?" |

### Decision patterns

- **Accounting firms**: Managing Partner + Practice Leaders + CTO. Budget cycle in July-September. 90-180 day cycle.
- **Mid-market corporate**: Controller + CFO. Post-audit window (March-June). 60-120 day cycle.
- **PE portfolio companies**: Operating Partner mandates → portfolio CFO executes. 30-60 day cycle (faster because mandate-driven).
- **Enterprise/public**: Controller + CFO + CIO + Internal Audit + Procurement. 6-12 month cycle. SOX implications elevate approval authority.

---

## 9. Trigger events

| Trigger | What It Signals | Sales Implication |
|---|---|---|
| **Post-audit debrief (March-May)** | Audit findings surface; process gaps identified | #1 procurement window for close management and compliance tools |
| **PE acquisition** | New ownership mandates financial infrastructure | 60-day window post-close for finance-stack upgrade |
| **IPO preparation (S-1 filing)** | SOX readiness, audit-grade financial reporting required | 6-12 month pre-IPO procurement cycle |
| **New CFO or Controller hire** | Leadership change triggers vendor review | 90-day window for outreach |
| **ERP migration** (QuickBooks → Intacct, Intacct → NetSuite) | Tech-stack rebuild | Adjacent-tool procurement (close management, FP&A, billing) |
| **Restatement or material weakness** | Compliance crisis | Urgent close-management and internal-control purchase |
| **M&A integration** | Multi-entity consolidation needed | ERP, close management, intercompany elimination tools |
| **Headcount freeze / talent departure** | Doing more with less; automation imperative | Technology adoption as labor substitute |
| **New FASB standard effective date** (ASU 2023-07 segment reporting already effective) | Mandatory compliance | Standard-specific tooling and advisory |
| **Busy season end (April 15 / extension deadline Oct 15)** | Team bandwidth frees up | Optimal outreach timing |
| **Budget flush (November-December)** | Use-it-or-lose-it annual budget | Quick-close procurement |

---

## 10. Common failure modes

1. **Pitching during busy season.** January through mid-April for tax-focused firms/teams; Q4 close + Q1 audit for corporate accounting. Sellers who pitch during these windows get ghosted. Not because the prospect isn't interested — because they literally cannot evaluate anything until filings are done.

2. **Conflating Controller and CFO.** The Controller buys close management, reconciliation, and compliance tools. The CFO buys FP&A, strategic planning, and board-reporting tools. Pitching BlackLine to a CFO or Anaplan to a Controller is a mismatch. Identify which buyer you are targeting.

3. **Speaking revenue language to finance audiences.** Finance buyers don't care about "pipeline velocity" or "conversion rates" — they care about EBITDA margin, operating leverage, CAC payback, and gross margin by product line. The value proposition must be translated into enterprise-value language.

4. **Ignoring the talent crisis context.** Accounting has a structural labor shortage. Every technology pitch should frame ROI partly in terms of "how many FTEs does this save or avoid hiring." The talent crisis is the reason firms are buying technology they would have resisted three years ago.

5. **Underestimating audit-firm procurement.** Big 4 and mid-tier firms have sophisticated procurement. They evaluate technology on partner leverage (revenue per partner), realization rates, and talent utilization — not typical SaaS metrics. A vendor who pitches to an accounting firm like a SaaS buyer will lose.

6. **Missing the PE operating-partner mandate.** PE-backed companies don't buy finance tools because the CFO wants to — they buy because the operating partner mandates it post-acquisition. Knowing whether a prospect is PE-backed changes the sales motion entirely: shorter cycle, mandate-driven, EBITDA-denominated ROI.

7. **Treating GAAP compliance as generic.** ASU 2023-07 segment reporting is effective NOW for PBEs — do not describe as "upcoming." ASU 2023-08 crypto fair value creates CAMT exposure. Each standard has specific implications that require vendor-specific responses. Generic "compliance" pitches fail.

8. **Not knowing the tool stack.** Asking "what ERP are you on?" in the first 5 minutes is essential. QuickBooks vs. Sage Intacct vs. NetSuite vs. SAP tells you everything about the prospect's maturity, budget, and adjacent-tool needs.

---

## 11. GTM implications

### For Cambrian sellers prospecting accounting/finance companies

- **Time outreach to post-busy-season windows.** May-September is prime. November-December for budget flush. January-April is a dead zone for accounting firms and tax-focused teams.
- **Lead with the talent crisis.** "How are you handling the CPA pipeline decline?" opens every accounting-firm conversation. Technology-as-labor-substitute is the macro thesis.
- **Speak EBITDA, not ARR.** Finance audiences evaluate everything through an enterprise-value lens. "Every $1 of incremental EBITDA at 8-12x multiple = $8-12M enterprise value" is the sentence that wins CFO-led deals.
- **Map to the maturity ladder.** QuickBooks → Sage Intacct → NetSuite → SAP/Oracle. Know where the prospect is on the ladder and what the next upgrade looks like.
- **Reference the consolidation wave.** Mid-tier firms (BDO, RSM, Grant Thornton) are merging, going transatlantic, and taking PE money. This is reshaping the advisory market and creating technology-procurement windows.

### For Cambrian sellers selling FROM accounting/finance tech

- Account briefs must identify whether the buyer is a Controller (close/compliance) or CFO (FP&A/strategic) — and brief accordingly.
- PE-backed prospects need EBITDA-frame value props. Non-PE prospects may respond better to efficiency/accuracy framing.
- Audit findings and restatements are public-record trigger events for public companies — reference them in outreach.
- The Grant Thornton compliance pedigree — especially in segment reporting (ASU 2023-07) and crypto accounting (ASU 2023-08) — is a genuine credibility differentiator in financial services and PE engagements.

### KEY POSITIONING

Most consultants pitch in marketing/sales language. Your edge: translate pipeline improvements into EBITDA and multiple expansion — the language CFOs and PE owners speak. "Conversion lift at gross margin and operating leverage = incremental EBITDA at market multiple." That's the conversation that wins CFO-led deals.

---

## 12. Cross-references to sister layers

| Layer | How It Applies |
|---|---|
| \`peHoldcoKnowledge.js\` | PE operating partner mandates drive finance-stack purchases at portfolio companies; EBITDA reporting cadence |
| \`investorIntelligenceKnowledge.js\` | Public accounting firms (none Big 4 are public, but Workiva, BlackLine, AppFolio are); PE-backed mid-tier firm dynamics |
| \`b2bSalesKnowledge.js\` | Enterprise selling motion into accounting firms; multi-stakeholder buying committee |
| \`approvalGatesKnowledge.js\` | Partner-committee approval at firms; board-level approval for enterprise close-management purchases |
| \`professionalServicesKnowledge.js\` | Sister layer covering law firms, consulting, staffing alongside accounting; utilization and realization metrics cross-apply |
| \`cryptoStablecoinKnowledge.js\` | ASU 2023-08 crypto fair value creates CAMT exposure; SAB 121/122 rescission impacts custodian accounting |
| \`realEstateKnowledge.js\` | ASU 2023-05 JV formation accounting; REIT FFO/AFFO valuation; 1031 exchange tax treatment |
| \`rewardsIncentivesKnowledge.js\` | 1099 reporting at scale; escheatment compliance; ASC 606 reward-revenue recognition |

---

## P&L ARCHITECTURE (reference framework)

Revenue - COGS = Gross Profit. Gross Profit - OpEx (S&M, R&D, G&A) = Operating Income. Gross margin defines how much of every dollar funds operations and growth. Operating leverage (revenue growing faster than opex) drives multiple expansion.

---

## UNIT ECONOMICS (reference framework)

- CAC = total S&M / new customers. LTV = ARPC x gross margin x (1/churn). LTV:CAC should be 3:1+.
- CAC payback: <12 months B2B, <6 months SMB.
- Burn multiple = net burn / net new ARR. <1.5x is efficient.

---

## SAAS METRICS (what CFOs and investors obsess over)

- ARR: annualized recurring contract value.
- NRR (Net Revenue Retention): >120% = exceptional. Revenue from same customers YoY.
- GRR (Gross Retention): ex-expansion. Measures churn severity.
- Magic Number: (QoQ new ARR x 4) / prior Q S&M spend. >0.7 = efficient.
- Rule of 40: revenue growth % + EBITDA margin %. >40 = best-in-class.

---

## EBITDA & VALUATION

PE and acquirers value at EBITDA x multiple. Every $1 incremental EBITDA at 8-12x = $8-12M enterprise value [verified 05/2026, standard PE valuation math]. Adjusted EBITDA adds back one-time items, SBC, acquisition amortization. Quality matters: recurring "one-time" items and SBC at 25%+ of revenue signal earnings quality issues.

---

## WORKING CAPITAL

Cash Conversion Cycle = DSO + DIO - DPO. SaaS with annual upfront billing runs NEGATIVE working capital (collects before delivering) — structural advantage. Growing companies consume working capital; fast growth without cash-efficient billing = capital dependency.

---

## FASB UPDATES (Q2 2026 REFRESH — detailed)

**ASU 2023-07 — SEGMENT REPORTING (ASC 280):** Effective for PBEs fiscal years after Dec 15, 2023 (first interim filings Q1 2025). The largest change to segment reporting since FAS 131 in 1997. Core change: the "significant expense principle" — must disclose significant segment expenses regularly provided to CODM, both annually and interim. ~7% of Fortune 500 voluntarily disclosed additional GAAP-consistent segment measures; ~1% disclosed non-GAAP (e.g., segment-adjusted EBITDA) [verified 05/2026, Deloitte March 2025 review]. SEC comment letter focus in H1 2025: R&D disaggregation by program, single-segment entity disclosures, how CODM uses profit/loss measures in resource allocation — "form vs. substance" is the SEC lens. NAIC rejected ASU 2023-07 for statutory accounting (Aug 2025) [verified 05/2026, NAIC proceedings] — flag for insurance-vertical work. Anchor citations: KPMG Handbook (Oct 2025 — most cited), Deloitte Roadmap (Aug 2025), BDO Blueprint (Dec 2025), Grant Thornton audit guidance.

**ASU 2023-08 — CRYPTO ASSETS (ASC 350-60):** Effective for ALL entities fiscal years after Dec 15, 2024. Eliminates prior cost-less-impairment model — crypto assets now measured at FAIR VALUE (ASC 820) with changes in NET INCOME each period. Scope: must be intangible, no enforceable claims on underlying assets, on distributed ledger, cryptographically secured, fungible, not created by reporting entity. OUT of scope: NFTs, stablecoins (backed by underlying claims), self-issued tokens. CRITICAL TAX INTERACTION: the 15% CAMT on adjusted financial statement income creates exposure — unrealized gains/losses from crypto fair value flow into AFSI after adoption. SAB 121 was rescinded by SEC SAB 122 in 2025 [verified 05/2026, SEC.gov]. Transition: modified-retrospective with cumulative-effect adjustment. Anchor citation: Deloitte Heads Up FAQ (July 2025 update), CPA Journal Dec 2024 (Owhoso).

**ASU 2023-05 — JOINT VENTURE FORMATIONS:** Effective for JVs formed after Jan 1, 2025. New basis of accounting — contributed net assets at fair value upon formation. Material for bank-fintech BaaS arrangements and real estate JV formations.

---

## KNOWN TRAPS

- ARR vs reported revenue: a common conflation. $12M ARR booked in January is ~$1M Q1 revenue. Never equate the two.
- "Adjusted EBITDA" add-backs vary wildly — recurring "one-time" items and SBC at 25%+ of revenue signal quality issues. Always ask what's in the bucket.
- ASU 2023-07 segment reporting is effective NOW for PBEs — do not describe as "upcoming."
- Crypto fair value (ASU 2023-08) creates CAMT exposure via unrealized gains flowing into AFSI — this is a tax trap many CFOs haven't modeled.
- NAIC rejection of ASU 2023-07 means insurance-vertical clients follow different segment rules — do not assume universal applicability.
- "Rule of 40" and "Magic Number" are heuristics, not standards — never cite without context on the company's stage and business model.
- Big 4 revenue figures are FY (typically ending June or September, not December). Pin to fiscal year, not calendar year.
- Mid-tier firm revenue and headcount figures change rapidly due to M&A (BDO, RSM, Grant Thornton mergers). Verify before citing.
- CPA pipeline decline figures (33% since 2016) are AICPA-sourced estimates — methodology debates exist. Directionally unambiguous but precise figures vary.
- BlackLine and FloQast customer counts are self-reported and may include free/trial accounts. Verify definition.
- Section 174 R&D capitalization is current law but bipartisan reversal efforts are active. Check status before counseling.
`;

export const ACCOUNTING_FINANCE_SCORING = {
  highFitSignals: [
    "PE-backed, post-Series C, or approaching exit (values EBITDA translation)",
    "CFO or Controller is economic buyer or key influencer",
    "Can articulate gross margin, CAC payback, and cohort retention",
    "Uses NetSuite, Sage Intacct, Adaptive, or equivalent financial stack",
    "EBITDA margin 15%+; Rule of 40 > 30",
    "Post-audit debrief window (March-June)",
    "Recent PE acquisition or IPO preparation",
    "Mid-tier accounting firm in advisory-growth mode",
  ],
  highFrictionSignals: [
    "Pre-Series B or bootstrapped with no financial infrastructure",
    "Cannot articulate gross margin or CAC payback",
    "On QuickBooks with manual revenue recognition",
    "Revenue retention <85%; high churn, acquisition-driven growth",
    "Negative EBITDA with no path to profitability",
    "Busy season (January-April for tax; Q4 close for corporate)",
    "Big 4 as target (enterprise procurement, 12-18 month cycles)",
  ],
};

export const ACCOUNTING_FINANCE_DISCOVERY = `
ACCOUNTING & FINANCE DISCOVERY (use when speaking with CFOs, Controllers, PE operating partners, or accounting-firm leaders):

REALITY — understand their financial operation:
- What ERP are you on today? Where are you on the QuickBooks → Intacct → NetSuite → SAP ladder?
- Walk me through your month-end close process — how many days? How many manual steps?
- What did your last audit surface? Any material weaknesses or significant deficiencies?
- How are you handling the talent pipeline — hiring, outsourcing, or automating?

IMPACT — quantify the financial pain:
- What's your EBITDA margin today, and where does the board want it?
- Walk me through your gross margin by product line — how has the mix shifted in 18 months?
- What's your S&M as a % of revenue, and where should it be as you scale?
- Can you show me CAC payback by channel? Which channel is most efficient?
- What's your cash conversion cycle — improving or degrading?
- What's the gap between booked ARR and reported revenue? Is it widening?

VISION — where are they going:
- What's your NRR by cohort? Improving, flat, or declining?
- Walk me through the variance between your forecast four quarters ago and actual results.
- Are you preparing for an exit, a next round, or an IPO? What does the finance function need to look like to get there?
- How is the operating partner (if PE-backed) measuring your financial maturity?

ENTRY POINTS — who decides and when:
- Is the Controller or the CFO driving technology decisions for the finance stack?
- When is your next audit cycle? What's the post-audit debrief window?
- What's in your adjusted EBITDA bucket? What are you adding back and why?
- How is operating leverage showing up? Where are you losing it?
- Are you evaluating close-management tools, FP&A platforms, or both? (Signal: identifies Controller vs. CFO buyer.)
`;
