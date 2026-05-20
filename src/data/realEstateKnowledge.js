// src/data/realEstateKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// U.S. Real Estate & Land Development knowledge layer.
// Covers: residential, commercial, land wholesaling, BTR, builders,
// REITs, capital markets, geographic hotspots, and tech stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Freddie Mac PMMS (Primary Mortgage Market Survey) — https://www.freddiemac.com/pmms
//   FHFA (Federal Housing Finance Agency) — https://www.fhfa.gov
//   NAR (National Association of Realtors) — https://www.nar.realtor/research-and-statistics
//   NAHB (National Association of Home Builders) — https://www.nahb.org/news-and-economics
//   CoreLogic Home Price Insights — https://www.corelogic.com/intelligence
//   CBRE Research — https://www.cbre.com/insights
//   Census Bureau (New Residential Construction / Survey of Construction) — https://www.census.gov/construction
//   Builder 100 / Builder Magazine — https://www.builderonline.com/builder-100
//   John Burns Research & Consulting — https://www.jbrec.com
//   RealPage Analytics — https://www.realpage.com/analytics
//   Moody's CRE / REIS — https://www.moodys.com
//   Blackstone Earnings / Investor Day — https://www.blackstone.com/shareholders
//   Brookfield Asset Management — https://www.brookfield.com
//   Trepp CMBS Research — https://www.trepp.com
//   NBER Working Papers — https://www.nber.org/papers
//   NAREIT (National Association of REITs) — https://www.reit.com/data-research
//   Federal Reserve (SOFR / rates) — https://www.newyorkfed.org/markets/reference-rates/sofr
//   FinCEN BOI Reporting — https://www.fincen.gov/boi

export const REAL_ESTATE_INDUSTRY_INJECTION = `
REAL ESTATE & LAND DEVELOPMENT CONTEXT (use when target or seller is in real estate, land, homebuilding, commercial development, or property):

MARKET SNAPSHOT (2026):
- 30yr fixed mortgage: ~6.1-6.3% [verified 05/2026, Freddie Mac PMMS]. Lock-in effect fading but not gone (~50% of mortgages still sub-4%) [verified 05/2026, FHFA].
- Structural housing deficit: 3.5-4.7M units short [verified 05/2026, NAR / Freddie Mac / NAHB]. This is THE macro fact for any land-related business.
- Home price growth: 0-2% national consensus [verified 05/2026, NAR / CoreLogic]. Resale > new home pricing (unusual inversion from builder incentives).
- Inventory: still ~17% below pre-pandemic levels despite improvement [verified 05/2026, NAR].
- CRE transaction volume: +15-20% forecast (recovery from 2022-2024 freeze) [verified 05/2026, CBRE].
- Construction costs: 40%+ above early-2020 levels (compresses what builders pay for land) [verified 05/2026, NAHB].

RESIDENTIAL KEY FACTS:
- Top 100 builders now do ~50% of all new SF home sales (up from ~33% two decades ago) [verified 05/2026, Builder 100 / NAHB].
- D.R. Horton: 13.6% national share (93K closings, #1 for 23 years). Lennar: 11.7% (73K). PulteGroup: 4.6% [verified 05/2026, Builder 100 / company 10-Ks].
- 2/3 of new SF construction is in South + Mountain West (TX, FL, Carolinas, GA, AZ, TN) [verified 05/2026, Census Bureau].
- BTR (build-to-rent): surged 102%+ since 2019; now ~6.3-7% of SF starts; $50B+ institutional capital deployed [verified 05/2026, NAHB / John Burns Research].
- Lot sizes shrinking: median under 9,000 sqft nationally; Phoenix/Houston pushing under 5,000 sqft [verified 05/2026, Census Bureau Survey of Construction].

COMMERCIAL KEY FACTS:
- Industrial: vacancy peaked ~7.6%, new starts down 62% from 2022 — tightening [verified 05/2026, CBRE]. Reshoring supports demand.
- Multifamily: absorbed 1.1M units in 2024-2025 [verified 05/2026, RealPage]; Sun Belt oversupply through 2027; coastal markets tighter.
- Office: ~23% national vacancy (structural decline) [verified 05/2026, Moody's / CBRE]; trophy assets strong, Class B/C obsolete in many markets.
- Data centers: ALL new supply pre-leased; constrained by power/zoning, not demand. AI capex reshaping markets.
- Retail: quietly best-performing core sector; years of underbuilding = structurally tight conditions.

LAND WHOLESALING (if prospect is a wholesaler or land investor):
- Model: tie up land with assignable PSA at 40-60% of FMV; assign to builder/developer for fee. [verified 05/2026, Cambrian operator knowledge]
- Economics: mid-market deals $50K-$300K purchase, $7K-$15K fee, 45-90 day cycle. [verified 05/2026, Cambrian operator knowledge]
- Key edges: direct seller pipeline at scale, builder relationships ("Builder-First" model), or subdivide expertise.
- Pain points: lead quality/CAC inflation, disposition speed, buyer concentration, compliance, scaling beyond founder.
- Compliance: IL, OK, AZ require licensing above 1-2 assignments/year; FinCEN BOI reporting as of March 2026.
- Top lead channels: SMS/text, cold calling, direct mail, PPC/SEO, tax-delinquent lists.

GEOGRAPHIC HOTSPOTS FOR LAND:
- Tier 1: Dallas-Fort Worth, Houston, Atlanta, Phoenix, Charlotte, Tampa/Orlando
- Tier 2: Raleigh-Durham, Nashville, Salt Lake/Boise, Columbus/Indianapolis
- Emerging: Greenville SC, Huntsville AL, Knoxville TN, Wilmington NC, Reno NV
- Soft: California metros, Pacific NW urban, Northeast urban, parts of FL coast (insurance crisis)

BUILDER RELATIONSHIPS:
- Production builders want: specific lot dimensions, zoning, school district, utility availability, price band per lot.
- A parcel matching builder specs sells in days; one that doesn't sits for months.
- NVR (Ryan Homes) uses asset-light lot-option model — different buying behavior than D.R. Horton's land-heavy approach.
- BTR developers want larger contiguous parcels (20-80+ acres), renter-demand submarkets, density-friendly zoning.

CAPITAL & INVESTMENT (Q2 2026 REFRESH):
- Blackstone invested $42B of equity in real estate since early 2024, Q4 2025 deal screening activity up >25% YoY [verified 05/2026, Blackstone Q4 2025 Earnings]. Blackstone $2.3B Alexander & Baldwin acquisition (Hawaii commercial REIT) — privatization streak is dominant 2026 structural pattern [verified 05/2026, Blackstone Investor Day].
- Brookfield ($1T+ AUM) positioning aggressively across housing, logistics, data centers, hospitality [verified 05/2026, Brookfield]. Announced Oct 2025 acquisition of remaining ~26% interest in Oaktree [verified 05/2026, Brookfield]. Key voices: Bruce Flatt (CEO), Lowell Baron (Real Estate CEO).
- Real estate values fell 22% over two years ending 2024, only 7% above trough as of late 2025 [verified 05/2026, Blackstone Q4 2025 Earnings] — Blackstone framing as one of most attractive entry points in years.
- $957B in CRE loans matured in 2025 — nearly triple the 20-year average [verified 05/2026, Trepp]. CMBS delinquency 7.29% (~6x bank-loan rates) [verified 05/2026, Trepp]. Office vacancy hit record 19.6% in Q1 2025 [verified 05/2026, Moody's]. The "extend and pretend" lender posture from 2023-2024 is now ending — forced sales increasing.
- Multifamily transactions grew 39.5% YoY in 2025; Q1 2025 absorption more than doubled to 82,500 units [verified 05/2026, CBRE]. 2025 vacancy ending at 4.9%, rent growth 2.6% [verified 05/2026, CBRE]. Sun Belt and Mountain regions adding ~20% to inventory in three years [verified 05/2026, RealPage].
- Construction costs up 50% over last five years [verified 05/2026, NAHB]. New starts in logistics and rental housing down ~2/3 [verified 05/2026, Census Bureau] — major supply tailwind for existing assets.
- Data center REIT outlier: P/FFO multiples expanding to 25-40x as AI power demand drives construction [verified 05/2026, NAREIT]. Blackstone Infrastructure consortium acquired TXNM Energy at 1.8x rate base (~$11.5B) [verified 05/2026, Blackstone Investor Day] — representative AI-power-demand deal. AI infrastructure is now a discrete CRE sub-asset class.
- 2021-2022-vintage inexperienced multifamily buyers are the source of highest-quality distressed-acquisition opportunities.
- NBER WP 31970 (Bidder, Krainer, Shapiro): CRE loans ~25% of average bank assets (~$2.7T at start of 2022 tightening). Anchor academic citation for any CRE bank-exposure framing. [verified 05/2026, NBER WP 31970]
- SOFR moved 530 bps from 0.05% (Jan 2022) to 5.35% (Jan 2024) [verified 05/2026, Federal Reserve]; borrowing costs roughly 40% off their wides [verified 05/2026, Blackstone Q4 2025 Earnings]. Barrero, Bloom & Davis demonstrate persistence of elevated remote work — structural argument for sustained office-demand erosion.
- Other major allocators: Brookfield, Starwood, KKR, Apollo, Carlyle, Franklin Templeton (acquired Apera Oct 2025).
- BTR institutional capital: Blackstone, Carlyle, Cerberus, AMH, Invitation Homes, Pretium/Progress.
- REITs by sector: Industrial (Prologis), Multifamily (Equity Residential, Greystar), Retail (Simon), Office (BXP).
- Data center: Equinix, Digital Realty, QTS (Blackstone), CyrusOne (KKR).
- Voices to track: Jon Gray (Blackstone president — most-cited CRE recovery voice), Manus Clancy (Trepp — CMBS delinquency), CBRE Econometric Advisors, PIMCO real estate research, NAIOP.

KNOWN TRAPS — DATA THAT GOES STALE FASTEST (re-verify quarterly):
- Mortgage rates: move weekly; 30yr fixed can shift 50+ bps in a quarter. Always hedge with "as of [date]." [verified 05/2026, Freddie Mac PMMS]
- Cap rates: lag transactions by 1-2 quarters; CBRE and NCREIF report on different cycles. Never cite a cap rate without specifying vintage. [Source: CBRE, NCREIF]
- CRE transaction volumes: quarterly swing wildly on a few mega-deals; YoY comparisons mislead when base quarter was anomalous (e.g., Q4 2022 freeze). [Source: CBRE, MSCI Real Capital Analytics]
- Vacancy rates: industrial and multifamily vacancies are moving targets — pipeline deliveries shift them 50-100 bps per quarter. Office vacancy is structural and slower-moving but varies sharply by market. [Source: CBRE, Moody's, CoStar]
- Construction costs: NAHB indices update quarterly; lumber/steel spot prices move faster. A "40% above 2020" claim can be 45% or 35% next quarter. [verified 05/2026, NAHB / PPI]
- BTR/SFR stats: this sub-sector is young and data sources disagree (NAHB vs. John Burns vs. RealPage); always specify the source. Institutional capital deployed figures shift with each fund close. [Source: NAHB, John Burns Research]
- PE allocations & dry powder: Blackstone/Brookfield/KKR report quarterly with different fiscal calendars. Deployed figures shift materially after each earnings call. Pin to a specific quarter. [verified 05/2026, firm earnings transcripts]
- CMBS delinquency: Trepp updates monthly; the rate is volatile because the denominator (outstanding CMBS) is also changing. [Source: Trepp]
- Sun Belt multifamily oversupply: absorption is racing deliveries — the narrative can flip from "oversupplied" to "tightening" in two quarters. [Source: RealPage, CBRE]
- Housing deficit estimates: range from 1.5M (more conservative) to 7M+ (including quality-adjusted); the 3.5-4.7M range is consensus but contested. [verified 05/2026, NAR / Freddie Mac / Up for Growth]
`;

export const REAL_ESTATE_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Land wholesalers doing $1M+ annual fees with builder relationships", avgFit: "75-85%", reason: "Revenue ops problems at scale — pipeline math, CRM, channel attribution" },
    { segment: "BTR developers with 500+ unit pipeline", avgFit: "70-80%", reason: "New category, building sales/leasing operations from scratch" },
    { segment: "Regional homebuilders (top 50-200 by closings)", avgFit: "65-75%", reason: "GTM complexity increasing as they compete with nationals for land and buyers" },
    { segment: "Commercial developers with multi-market operations", avgFit: "60-70%", reason: "Complex stakeholder selling, capital raises, tenant acquisition" },
  ],
  highFrictionSegments: [
    { segment: "National homebuilders (D.R. Horton, Lennar, PulteGroup)", avgFit: "10-20%", reason: "Enterprise procurement; internal land teams; 12-18 month sales cycles" },
    { segment: "Institutional REITs (Prologis, Simon, Equity Residential)", avgFit: "5-15%", reason: "Internal resources; consultant-heavy; relationship-driven procurement" },
    { segment: "Solo land flippers doing <$200K/year", avgFit: "15-25%", reason: "Too small for consulting engagement; need education, not architecture" },
  ],
};

export const REAL_ESTATE_DISCOVERY_INJECTION = `
REAL ESTATE-SPECIFIC DISCOVERY ANGLES (use when prospect is in real estate, land, or development):

REALITY stage — understand their operation:
- How many states are you operating in? How do you decide which markets to enter?
- What's your split between builder buyers and retail/individual buyers?
- Walk me through your last 5 deals — source, buyer, cycle time.
- What's your current cost per signed contract by channel?

IMPACT stage — quantify the pain:
- How many active buyers can you call right now and place a parcel with in 7 days?
- Where do deals die in your pipeline? What % of contracts close vs. cancel?
- What's your earnest money exposure at any given time?
- How much do you spend monthly on lead gen across all channels?

VISION stage — what does success look like:
- Where do you want to be in 18 months — what's the constraint between here and there?
- If you could snap your fingers and fix one thing in your operation, what would it be?
- What would it look like if your first W-2 hire was ramping successfully?

ENTRY POINTS — who decides:
- Who's doing acquisitions, dispositions, transaction coordination?
- Who handles builder relationships? Is it the founder or delegated?
- Is there a capital partner or investor who influences operational decisions?
`;
