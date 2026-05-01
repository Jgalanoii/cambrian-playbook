// src/data/charitableGivingKnowledge.js
//
// Charitable giving, donor-advised funds (DAFs), and charity gift cards
// deep knowledge layer. Covers: 501(c)(3) infrastructure, DAF mechanics,
// IRS regulatory framework (§4966/4967/170), charity gift card operating
// models, corporate philanthropy, workplace giving, and unit economics.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const CHARITABLE_GIVING_INJECTION = `
CHARITABLE GIVING & DAF CONTEXT (use when target or seller is in charitable giving, donor-advised funds, philanthropy, nonprofit infrastructure, or charity gift cards):

MARKET: U.S. charitable giving ~$560-580B annually. Individual giving ~67% (~$370B), corporate ~7% (~$40B), foundation ~19% (~$100B+), bequests ~8% (~$45B). ~1.8M registered 501(c)(3) public charities. Half of charitable dollars flow through intermediaries (DAFs, private foundations, community foundations, charity gift card platforms), with intermediary share growing rapidly.

DAF ECOSYSTEM: ~3M+ active DAF accounts across ~1,500 sponsoring organizations. Total DAF assets ~$280-300B, annual contributions ~$85B, annual grants ~$55-65B. DAFs capture ~16% of individual giving. National sponsors (Fidelity Charitable ~$50B+, Schwab Charitable ~$30B+, Vanguard Charitable ~$20B+, NPT ~$25B+) represent only 3% of sponsors but hold 70% of assets. Median DAF account: ~$21K (not just ultra-rich). Two-thirds of contributions are non-cash (appreciated stock primary). Tax efficiency: immediate deduction at higher AGI limits than private foundations, no capital gains on appreciated assets, tax-free growth, estate planning benefits, bunching strategy (concentrate multi-year giving for itemization benefit).

REGULATORY: Pension Protection Act 2006 created modern DAF framework. §4966: 20% excise tax on taxable distributions from DAFs. §4967: 125% excise tax on distributions providing donor benefit. November 2023 proposed regulations expanded definitions of DAF, distribution, and donor-advisor — final regs still pending as of 2026. Expenditure responsibility required for non-public-charity recipients. Compliance stack: charity verification at every distribution, donor benefit screening, quid-pro-quo screening, Form 990 with Schedule D disclosures, state charitable registration in 40+ states.

CHARITY GIFT CARDS: Niche but growing — combines prepaid card mechanics with DAF-like liability accounting. Model: buyer purchases card (gets tax deduction at purchase), card delivered to recipient, recipient selects charity from verified database (~2M charities), platform distributes funds. Key: gift card sales are NOT revenue — recorded as liabilities (funds held for charitable distribution). Platform revenue is the operational fee margin only. This creates apparent size mismatch (GMV >> reported revenue) by deliberate design.

PRIVATE FOUNDATIONS VS DAFs: PFs have 5% mandatory annual payout, 30% AGI cash deduction limit, 1.39% excise tax on investment income, and full board control. DAFs have no payout requirement (politically controversial), 60% AGI cash limit, no excise tax, and advisory-only control. PFs practical above ~$2M assets; DAFs practical from $0. Growing concern: PF-to-DAF transfers ($3.2B+ in 2022) and DAF-to-DAF transfers ($4.4B in 2023) may overstate apparent payout rates.

CORPORATE PHILANTHROPY: ~$40B annually. Forms: direct gifts, corporate foundations, matching gifts, volunteer programs, cause marketing, corporate gift cards. Corporate gifting market ~$240B overall; charity gift cards serve the values-aligned niche. Corporate buyers: HR/People teams (employee recognition), Marketing (client gifting), Office managers, Procurement. Higher AOV ($5K-$500K+ vs consumer $25-$100), predictable repeat business, strong reference value.

WORKPLACE GIVING PLATFORMS: Benevity (~$15B+ cumulative), YourCause (Blackbaud), Bright Funds, Millie. Offer: employee giving portals, matching administration, volunteer tracking, charity verification, reporting.

2026 TRENDS: DAF reform debate (payout mandates, transparency, transfer rules — no legislation passed). DAF democratization (Daffy, Charityvest, Chariot — $0 minimums, mobile-first). Embedded charitable giving (checkout donations, subscription-attached, loyalty-to-charity). Decline of umbrella organizations (United Way). Corporate ESG volatility (recipient-choice models neutralize ideological risk for buyers). AI in charity verification and donor matching.
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
