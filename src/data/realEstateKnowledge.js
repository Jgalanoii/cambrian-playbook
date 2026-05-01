// src/data/realEstateKnowledge.js
//
// U.S. Real Estate & Land Development knowledge layer.
// Covers: residential, commercial, land wholesaling, BTR, builders,
// REITs, capital markets, geographic hotspots, and tech stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const REAL_ESTATE_INDUSTRY_INJECTION = `
REAL ESTATE & LAND DEVELOPMENT CONTEXT (use when target or seller is in real estate, land, homebuilding, commercial development, or property):

MARKET SNAPSHOT (2026):
- 30yr fixed mortgage: ~6.1-6.3%. Lock-in effect fading but not gone (~50% of mortgages still sub-4%).
- Structural housing deficit: 3.5-4.7M units short. This is THE macro fact for any land-related business.
- Home price growth: 0-2% national consensus. Resale > new home pricing (unusual inversion from builder incentives).
- Inventory: still ~17% below pre-pandemic levels despite improvement.
- CRE transaction volume: +15-20% forecast (recovery from 2022-2024 freeze).
- Construction costs: 40%+ above early-2020 levels (compresses what builders pay for land).

RESIDENTIAL KEY FACTS:
- Top 100 builders now do ~50% of all new SF home sales (up from ~33% two decades ago).
- D.R. Horton: 13.6% national share (93K closings, #1 for 23 years). Lennar: 11.7% (73K). PulteGroup: 4.6%.
- 2/3 of new SF construction is in South + Mountain West (TX, FL, Carolinas, GA, AZ, TN).
- BTR (build-to-rent): surged 102%+ since 2019; now ~6.3-7% of SF starts; $50B+ institutional capital deployed.
- Lot sizes shrinking: median under 9,000 sqft nationally; Phoenix/Houston pushing under 5,000 sqft.

COMMERCIAL KEY FACTS:
- Industrial: vacancy peaked ~7.6%, new starts down 62% from 2022 — tightening. Reshoring supports demand.
- Multifamily: absorbed 1.1M units in 2024-2025; Sun Belt oversupply through 2027; coastal markets tighter.
- Office: ~23% national vacancy (structural decline); trophy assets strong, Class B/C obsolete in many markets.
- Data centers: ALL new supply pre-leased; constrained by power/zoning, not demand. AI capex reshaping markets.
- Retail: quietly best-performing core sector; years of underbuilding = structurally tight conditions.

LAND WHOLESALING (if prospect is a wholesaler or land investor):
- Model: tie up land with assignable PSA at 40-60% of FMV; assign to builder/developer for fee.
- Economics: mid-market deals $50K-$300K purchase, $7K-$15K fee, 45-90 day cycle.
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

CAPITAL & INVESTMENT:
- Blackstone is largest global CRE owner. Other major allocators: Brookfield, Starwood, KKR, Apollo, Carlyle.
- BTR institutional capital: Blackstone, Carlyle, Cerberus, AMH, Invitation Homes, Pretium/Progress.
- REITs by sector: Industrial (Prologis), Multifamily (Equity Residential, Greystar), Retail (Simon), Office (BXP).
- Data center: Equinix, Digital Realty, QTS (Blackstone), CyrusOne (KKR).
`;

export const REAL_ESTATE_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Land wholesalers doing $1M+ annual fees with builder relationships", avgFit: "65-75%", reason: "Revenue ops problems at scale — pipeline math, CRM, channel attribution" },
    { segment: "Regional homebuilders (top 50-200 by closings)", avgFit: "55-65%", reason: "GTM complexity increasing as they compete with nationals for land and buyers" },
    { segment: "BTR developers with 500+ unit pipeline", avgFit: "60-70%", reason: "New category, building sales/leasing operations from scratch" },
    { segment: "Commercial developers with multi-market operations", avgFit: "50-60%", reason: "Complex stakeholder selling, capital raises, tenant acquisition" },
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
