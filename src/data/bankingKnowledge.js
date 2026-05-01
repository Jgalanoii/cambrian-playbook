// src/data/bankingKnowledge.js
//
// U.S. Banking & Capital Markets knowledge layer.
// Covers: G-SIBs, regionals, community banks, credit unions, PE/VC,
// private credit, hard money, family offices, neobanks, BaaS,
// payments, consumer credit, BNPL, digital incentives, crypto,
// insurance, and regulatory backdrop.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const BANKING_INDUSTRY_INJECTION = `
U.S. BANKING & CAPITAL MARKETS CONTEXT (use when target or seller is in banking, financial services, lending, PE, VC, credit, wealth management, or fintech):

MARKET SNAPSHOT (2026):
- ~3,917 FDIC-insured banks, ~$24.5T combined assets. Top 4 (JPM $4.43T, BAC $3.4T, C $2.4T, WFC $2.0T) hold more than the next 4,000+ combined.
- ~4,411 credit unions, ~$2.3T assets. Navy Federal alone: $192B, 15M members.
- Fed funds: ~3.5-3.75% projected through end of 2026. NIMs stabilizing.
- Bank M&A: ~40% of US banks expect to pursue acquisitions in next 12 months.
- Private credit AUM: ~$1.96T, growing 12-15% annually. First major redemption test survived Q1 2026.
- PE "Big Five" (Blackstone, Apollo, KKR, Ares, Carlyle): ~$3.5T combined AUM; 40% in perpetual capital.
- BaaS market: $35-45B globally, projected $75-90B by 2030-2031.

KEY STRUCTURAL THEMES:
- "Bank vs non-bank" line has dissolved at product level. Apollo extends credit. Stripe holds deposits. Apple issues cards. SoFi has a charter.
- Deposit franchise quality is the #1 strategic question post-SVB/First Republic.
- Middle-market lending moving off bank balance sheets into private credit (Ares, Golub, Blue Owl).
- Every institution running 5-10 generations of vendor systems — tech stack rationalization is constant.
- Cost-to-serve compression from digital competitors is universal.

BANKING TIERS:
- G-SIBs (8): JPM, BAC, C, WFC, GS, MS, BK, STT — dominant but rarely buy from boutique consultants directly.
- Super-regionals ($100B-$700B): USB, PNC, Truist, Capital One, Citizens, Fifth Third, KeyCorp, M&T, Regions, Huntington — SWEET SPOT for GTM consulting.
- Community banks (<$10B): ~4,000 banks. Relationship-driven, increasingly serving as BaaS sponsor banks.
- Credit unions: mission-driven, committee-governed, slower decisions. Digital experience gap is biggest strategic risk.

PRIVATE CAPITAL:
- PE mega-funds: Blackstone, Apollo, KKR, Ares, Carlyle. Middle-market: Audax, GTCR, Genstar, Vista, Thoma Bravo.
- VC: a16z, Sequoia, Tiger, Insight, General Catalyst, Thrive — top-tier funds increasingly backing fintech and AI infrastructure.
- Private credit: Blue Owl, Golub, HPS (BlackRock), Antares, Monroe. Asset-based finance (ABF) is fastest-growing sub-segment.
- Hard money / business purpose lending: Kiavi, RCN Capital, Lima One, Genesis (GS). Rates 9-13%, LTV 65-75%.
- Family offices: 4,500+ SFOs in US, $5T+ AUM. RIA aggregators (Focus, Mercer, Hightower, Mariner) backed by PE.

FINTECH/BAAS:
- Neobanks: Chime (~38M users), Cash App (~57M MAU), SoFi (chartered), Mercury, Brex, Ramp, Rho.
- BaaS middleware: Unit, Synctera, Treasury Prime, Stripe Treasury, Increase.
- Issuer processors: Galileo (SoFi), Marqeta, Lithic, Highnote.
- Post-Synapse regulatory reset: sponsor bank scrutiny dramatically higher. Bar for BaaS programs has risen.
- Vertical SaaS + embedded finance is the dominant structural trend.

DIGITAL INCENTIVES (Cambrian core competency):
- Blackhawk Network (BHN/Tango), InComm, Tremendous, Giftbit, Reward Gateway — B2B rewards-as-a-service.
- B2B incentives growing faster than consumer: research, recognition, partner programs, sales SPIFFs.
- Card-linked offers scaling through bank channels (Cardlytics, Augeo).
- Embedded loyalty: vertical SaaS platforms building rewards as features.

REGULATORY:
- OCC: national banks. Fed: BHCs. FDIC: insured banks. NCUA: credit unions. CFPB: consumer products.
- Basel III endgame substantially softened. Bank M&A window open through 2028.
- Synapse aftermath: BaaS/sponsor bank compliance bar dramatically higher.
- Open banking (Section 1033): consumer data portability being implemented through 2026.
- Stablecoin federal framework legislation likely in 2026.
`;

export const BANKING_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Digital incentives/rewards platforms", avgFit: "80-90%", reason: "Cambrian's BHN background is directly credible — bullseye ICP" },
    { segment: "BaaS/embedded fintech providers ($5-500M revenue)", avgFit: "75-85%", reason: "Direct domain overlap with Cambrian's payments + incentives expertise" },
    { segment: "PE-backed fintech portfolio companies", avgFit: "70-80%", reason: "Growth-pressured, typically understaffed on GTM, PE operating partners value consultants" },
    { segment: "Regional banks building digital/fintech capabilities", avgFit: "65-75%", reason: "Need GTM help translating fintech products for banking buyers" },
    { segment: "Credit unions building member acquisition programs", avgFit: "60-70%", reason: "Rewards/incentives expertise + digital experience gap = real fit" },
  ],
  highFrictionSegments: [
    { segment: "G-SIB / money center banks (JPM, BAC, C, WFC)", avgFit: "5-15%", reason: "Enterprise procurement fortress; rarely buy from sub-$10M boutiques" },
    { segment: "Hedge funds", avgFit: "5-10%", reason: "Almost no GTM consulting buyers" },
    { segment: "Pure crypto / DeFi protocols", avgFit: "10-20%", reason: "Different operating logic, not core competency" },
    { segment: "Wealth management broker-dealer infrastructure", avgFit: "15-25%", reason: "Saturated; specialized firms entrenched" },
  ],
};

export const BANKING_DISCOVERY_INJECTION = `
BANKING & FINANCIAL SERVICES DISCOVERY (use when prospect is in banking, fintech, payments, lending, or capital markets):

REALITY stage — understand their operation:
- How is your revenue split across direct, partner, and channel? How is each performing?
- What's your typical deal cycle for an enterprise financial institution buyer? Where does it stall?
- How much of your pipeline comes from existing accounts vs. new logos?
- What's your current relationship architecture for your top 10 partners or channels?

IMPACT stage — quantify the pain:
- What's your CAC and LTV by channel? When was the last time you stress-tested that math?
- Where's the biggest gap between your marketing performance and your sales performance?
- Walk me through your last 5 deals — what made the difference between closed and lost?
- How exposed are you to a single bank partner or sponsor relationship?

VISION stage — what does success look like:
- Where do you want to be in 18 months — what's the constraint?
- If you could fix one thing about how you acquire and retain financial institution customers, what would it be?
- What would it look like if your channel economics were fully transparent?

ENTRY POINTS — who decides:
- Who owns the bank/FI relationship? Is it founder-led or delegated?
- Is there a PE operating partner or board member influencing GTM decisions?
- Who controls the budget for sales/marketing infrastructure vs. headcount?
`;
