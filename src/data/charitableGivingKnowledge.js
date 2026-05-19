// src/data/charitableGivingKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// Charitable giving, donor-advised funds (DAFs), and charity gift cards
// deep knowledge layer. Covers: 501(c)(3) infrastructure, DAF mechanics,
// IRS regulatory framework (§4966/4967/170), charity gift card operating
// models, corporate philanthropy, workplace giving, and unit economics.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// SOURCES:
// - DAFRC (Heist, Vance-McMullen, Williams, Shaker, Sumsion, 2025, DOI: 10.4087/XUGU3656)
// - DAFgiving360 FY2025 Annual Report
// - IPS Independent Report on DAF payout rates
// - Giving USA 2025 (individual/corporate/foundation/bequest splits)
// - IRS §4966/§4967/§170 regulatory framework
// - Pension Protection Act of 2006
// - November 2023 Proposed DAF Regulations (Treasury/IRS)
// - OBBBA (One Big Beautiful Bill Act, passed 2025)
// - Inside Philanthropy editorial coverage
// - CCS Fundraising reports

export const CHARITABLE_GIVING_INJECTION = `
CHARITABLE GIVING & DAF CONTEXT (use when target or seller is in charitable giving, donor-advised funds, philanthropy, nonprofit infrastructure, or charity gift cards):

MARKET: U.S. charitable giving ~$560-580B annually [verified 05/2026, Giving USA 2025]. Individual giving ~67% (~$370B), corporate ~7% (~$40B), foundation ~19% (~$100B+), bequests ~8% (~$45B) [verified 05/2026, Giving USA 2025]. ~1.8M registered 501(c)(3) public charities [verified 05/2026, IRS BMF Data]. Half of charitable dollars flow through intermediaries (DAFs, private foundations, community foundations, charity gift card platforms), with intermediary share growing rapidly.

DAF ECOSYSTEM (Q2 2026 REFRESH — DAFRC is now the canonical primary source, replacing NPT):
The DAF Research Collaborative (Heist, Vance-McMullen, Williams, Shaker, Sumsion, 2025, DOI: 10.4087/XUGU3656) is the independent successor to the NPT report. Analyzes 1,485 DAF sponsors (99 national, 788 community foundations, 598 single-issue charities) — this is now the ONLY credible primary citation for DAF aggregate data. Replace any lingering NPT references.

~3M+ active DAF accounts across ~1,500 sponsoring organizations [verified 05/2026, DAFRC 2025]. Total DAF assets ~$280-300B, annual contributions ~$85B, annual grants ~$55-65B [verified 05/2026, DAFRC 2025]. DAFs capture ~16% of individual giving. National sponsors (Fidelity Charitable ~$50B+, Schwab Charitable ~$30B+, Vanguard Charitable ~$20B+, NPT ~$25B+) represent only 3% of sponsors but hold 70% of assets [verified 05/2026, DAFRC 2025]. Median DAF account: ~$21K (not just ultra-rich). 74% of FY2024 contributions to DAFgiving360 were noncash assets (ETFs, index funds, real estate, crypto) [verified 05/2026, DAFgiving360 FY2025 Report] — this stat is THE most important talking point for platform-economics framing where digital incentives and DAF infrastructure intersect. Tax efficiency: immediate deduction at higher AGI limits than private foundations, no capital gains on appreciated assets, tax-free growth, estate planning benefits, bunching strategy (concentrate multi-year giving for itemization benefit).

DAFgiving360 FY2025: 155,000 charities supported via 1.4M grants (19% YoY growth); $24M+ granted per day; 38% scheduled recurring; 78% within own state; 85% to previously-supported charities, 15% net-new [verified 05/2026, DAFgiving360 FY2025 Report]. Julie Sunwoo (DAFgiving360/Schwab president) is a key voice.

Donation-processor segment (GoFundMe entered DAF market in 2025) is structurally distinct: 168% payout rate in FY2024 vs 24% for all other DAFs [verified 05/2026, DAFRC 2025]. Growth rate for non-processor accounts has been slowing. IPS Independent Report: median payout rates around 9-10%, well above the 5% required for private foundations, but with no mandated minimum [verified 05/2026, IPS Independent Report].

REGULATORY: Pension Protection Act 2006 created modern DAF framework. §4966: 20% excise tax on taxable distributions from DAFs. §4967: 125% excise tax on distributions providing donor benefit. November 2023 proposed regulations expanded definitions of DAF, distribution, and donor-advisor — final regs still pending as of 2026. OBBBA (passed 2025): starting 2026, itemizers can only deduct charitable contributions above 0.5% of AGI; top-rate value reduced from 37% to 35%. This will likely compress the number of DAF accounts while DAF assets continue to grow — the dominant 2026 regulatory input reshaping donor behavior. Expenditure responsibility required for non-public-charity recipients. Compliance stack: charity verification at every distribution, donor benefit screening, quid-pro-quo screening, Form 990 with Schedule D disclosures, state charitable registration in 40+ states. [verified 05/2026, IRS §4966/§4967 / OBBBA legislative text 2025]

VOICES: DAFRC team (Heist, Vance-McMullen, Williams, Shaker, Sumsion), Julie Sunwoo (DAFgiving360/Schwab), IPS Independent Report team, Inside Philanthropy editorial, CCS Fundraising. The COTF/IGCC board relationship + digital incentives + DAF rails is Cambrian's highest-leverage intersection vector given Joe's BHN history.

CHARITY GIFT CARDS: Niche but growing — combines prepaid card mechanics with DAF-like liability accounting. Model: buyer purchases card (gets tax deduction at purchase), card delivered to recipient, recipient selects charity from verified database (~2M charities), platform distributes funds. Key: gift card sales are NOT revenue — recorded as liabilities (funds held for charitable distribution). Platform revenue is the operational fee margin only. This creates apparent size mismatch (GMV >> reported revenue) by deliberate design.

PRIVATE FOUNDATIONS VS DAFs: PFs have 5% mandatory annual payout, 30% AGI cash deduction limit, 1.39% excise tax on investment income [verified 05/2026, IRS §4940/§4942], and full board control. DAFs have no payout requirement (politically controversial), 60% AGI cash limit, no excise tax, and advisory-only control. PFs practical above ~$2M assets; DAFs practical from $0. Growing concern: PF-to-DAF transfers ($3.2B+ in 2022) and DAF-to-DAF transfers ($4.4B in 2023) may overstate apparent payout rates.

CORPORATE PHILANTHROPY: ~$40B annually. Forms: direct gifts, corporate foundations, matching gifts, volunteer programs, cause marketing, corporate gift cards. Corporate gifting market ~$240B overall; charity gift cards serve the values-aligned niche. Corporate buyers: HR/People teams (employee recognition), Marketing (client gifting), Office managers, Procurement. Higher AOV ($5K-$500K+ vs consumer $25-$100), predictable repeat business, strong reference value. [verified 05/2026, Giving USA 2025 / Coresight Research]

WORKPLACE GIVING PLATFORMS: Benevity (~$15B+ cumulative), YourCause (Blackbaud), Bright Funds, Millie. Offer: employee giving portals, matching administration, volunteer tracking, charity verification, reporting. [verified 05/2026, Benevity corporate disclosures]

2026 TRENDS: DAF reform debate (payout mandates, transparency, transfer rules — no legislation passed). DAF democratization (Daffy, Charityvest, Chariot — $0 minimums, mobile-first). Embedded charitable giving (checkout donations, subscription-attached, loyalty-to-charity). Decline of umbrella organizations (United Way). Corporate ESG volatility (recipient-choice models neutralize ideological risk for buyers). AI in charity verification and donor matching.

KNOWN TRAPS:
- DAF payout rate stats vary wildly depending on whether donation-processor DAFs (168% payout) are included — always clarify which universe. [verified 05/2026, DAFRC 2025]
- "Total DAF assets" conflates national sponsors (70% of assets) with community foundations (very different economics) — segment before citing.
- Gift card "revenue" is almost entirely liability; quoting GMV as revenue misrepresents the business by 10-20x.
- OBBBA deduction compression (0.5% AGI floor) is new for 2026 — many practitioners are still citing pre-OBBBA rules. [verified 05/2026, OBBBA legislative text 2025]
- PF-to-DAF and DAF-to-DAF transfers inflate apparent payout rates — flag this when citing DAFRC payout data.
- November 2023 proposed DAF regs are still pending as of 2026 — do not cite as final rules.
`;

export const CHARITABLE_GIVING_SCORING = {
  highFitSegments: [
    { segment: "Charity gift card platforms (Charity On Top model)", avgFit: "85-92%", reason: "Direct digital incentives domain overlap with BHN; multi-stakeholder GTM; card mechanics + charitable compliance intersection" },
    { segment: "Mission-based DAF platforms (Daffy, Charityvest, Chariot tier)", avgFit: "78-86%", reason: "Fintech-meets-philanthropy; scaling consumer + corporate acquisition; mobile-first product GTM" },
    { segment: "Workplace giving platforms ($5-100M revenue)", avgFit: "75-83%", reason: "B2B SaaS selling into HR/CSR buyers; multi-stakeholder enterprise sales; recurring revenue ops" },
    { segment: "Community foundations with DAF programs ($100M+ assets)", avgFit: "65-75%", reason: "Scaling donor acquisition and corporate partnerships; geographic focus creates defined GTM territory" },
  ],
  highFrictionSegments: [
    { segment: "National commercial DAF sponsors (Fidelity Charitable, Schwab Charitable)", avgFit: "10-20%", reason: "Massive internal teams; financial services parent company resources; relationship-driven procurement" },
    { segment: "Religious/faith-based charitable organizations", avgFit: "20-35%", reason: "Mission-driven decision-making; volunteer-heavy; limited consulting budgets; relationship-based governance" },
    { segment: "Pure crowdfunding platforms (GoFundMe, individual fundraisers)", avgFit: "25-40%", reason: "Consumer marketplace dynamics; different GTM model than enterprise/B2B; thin margins" },
  ],
};

export const CHARITABLE_GIVING_DISCOVERY = `
CHARITABLE GIVING / DAF DISCOVERY (use when prospect operates charitable infrastructure, DAF platform, charity gift cards, or sells into philanthropy):

REALITY:
- How does money flow through your platform — from donor/buyer to working charity? What's the average time from contribution to distribution?
- What's your current customer mix between individual donors, corporate buyers, and institutional partners? How is it shifting?
- How do you handle charity verification at scale — IRS database sync, manual review, or vendor?

IMPACT:
- Where is the highest operational leverage in your business — where would $1 of additional capacity produce the most output?
- What's your biggest compliance burden right now — state registration, Form 990 reporting, charity verification, or something else?
- How exposed are you to the pending DAF regulatory changes (§4966 proposed regs)? What's your contingency?

VISION:
- If you could redesign your channel mix (direct vs broker vs partner vs embedded), what would it look like? What's stopping you?
- How do you think about the trade-off between scaling consumer acquisition vs building corporate programs?
- What does your corporate sales motion look like today vs where it needs to be?

ENTRY POINTS:
- Walk me through how a typical corporate gift card program comes in — from first conversation to delivery.
- What role do brokers, wholesalers, or channel partners play in your distribution? How are those relationships structured commercially?
- What's your relationship with major DAF sponsors — competitors, partners, or both?

ROUTE:
- Looking at your organization 3 years from now, what's the one capability gap that would most limit your growth?
- How are you thinking about the embedded giving trend — checkout donations, subscription-attached giving, loyalty-to-charity?
- What would you need from a GTM advisor that you can't build internally?
`;
