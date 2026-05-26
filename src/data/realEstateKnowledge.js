// src/data/realEstateKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// U.S. Real Estate & Land Development knowledge layer.
// Covers: residential, commercial, land wholesaling, BTR, builders,
// REITs, proptech, property management, mortgage, and capital markets.
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
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
//   Mordor Intelligence, PropTech Market (2026-2031)
//   CBRE US Real Estate Market Outlook 2026
//   Deloitte 2026 CRE Outlook
//   Federal Reserve, "Commissions and Omissions" FEDS Note (May 2025)
//   HousingWire, NAR Settlement Commission Impact Analysis

export const REAL_ESTATE_INDUSTRY_INJECTION = `
REAL ESTATE & LAND DEVELOPMENT CONTEXT (use when target or seller is in real estate, land, homebuilding, commercial development, proptech, or property):

---

## 1. Snapshot and market sizing

### Residential market (2026)
- 30yr fixed mortgage: ~6.1-6.3% [verified 05/2026, Freddie Mac PMMS]. Lock-in effect fading but not gone (~50% of mortgages still sub-4%) [verified 05/2026, FHFA].
- Structural housing deficit: 3.5-4.7M units short [verified 05/2026, NAR / Freddie Mac / NAHB]. This is THE macro fact for any land-related business.
- Home price growth: 0-2% national consensus [verified 05/2026, NAR / CoreLogic]. Resale > new home pricing (unusual inversion from builder incentives).
- Inventory: still ~17% below pre-pandemic levels despite improvement [verified 05/2026, NAR].
- Existing home sales: ~4.0-4.3M annualized, still well below 2019's 5.3M [verified 05/2026, NAR].
- New home sales: ~680K annualized, propped up by builder incentives (rate buydowns, closing cost credits) [verified 05/2026, Census Bureau].
- Construction costs: 40-50% above early-2020 levels, compressing what builders pay for land [verified 05/2026, NAHB].

### Commercial real estate (2026)
- CRE investment volume: $562B forecast for 2026, up 16% YoY, nearly matching pre-pandemic (2015-2019) average [verified 05/2026, CBRE 2026 Outlook].
- Q4 2025 investment surged 29% to $171.6B with improved lending [verified 05/2026, CBRE].
- Total commercial mortgage originations forecast: ~$805B in 2026, up 27% from 2025 [verified 05/2026, Mortgage Bankers Association].
- Industrial: vacancy peaked ~7.6%, new starts down 62% from 2022 — tightening [verified 05/2026, CBRE]. Reshoring supports demand.
- Multifamily: absorbed 1.1M units in 2024-2025 [verified 05/2026, RealPage]; Sun Belt oversupply through 2027; coastal markets tighter. 2025 vacancy ending at 4.9%, rent growth 2.6% [verified 05/2026, CBRE].
- Office: ~23% national vacancy (structural decline) [verified 05/2026, Moody's / CBRE]; trophy assets strong, Class B/C obsolete in many markets.
- Data centers: ALL new supply pre-leased; constrained by power/zoning, not demand. AI capex reshaping markets. Data center REIT P/FFO multiples expanding to 25-40x [verified 05/2026, NAREIT].
- Retail: quietly best-performing core sector; years of underbuilding = structurally tight conditions.

### PropTech market
- Global proptech market: $45-53B (2025-2026), growing at 16-18% CAGR to $120-165B by 2031-2035 [verified 05/2026, Mordor Intelligence / Precedence Research / SNS Insider].
- US share: ~$40B, the largest single-country proptech market [verified 05/2026, TechBullion / Mordor Intelligence].
- CoStar acquired Matterport for $1.6B (Feb 2025) — property data + 3D digital-twin convergence [verified 05/2026, CoStar press release].

### REIT market
- North America REIT market: $285-293B (2025-2026), growing to $337B by 2031 at 2.9% CAGR [verified 05/2026, Mordor Intelligence].
- Industrial REITs lead with 25.2% market share [verified 05/2026, Mordor Intelligence].
- Residential REITs fastest CAGR at 5.05% [verified 05/2026, Mordor Intelligence].

---

## 2. What makes this vertical distinct as a sales target

**1. Capital stack complexity creates multi-buyer deals.** Every real estate transaction involves a capital stack: equity (LP/GP), senior debt, mezzanine, preferred equity, construction loans, permanent financing. Each layer has different players, different timelines, and different approval gates. A B2B vendor selling into real estate isn't selling to "a company" — they're selling into a relationship web of sponsors, lenders, servicers, brokers, and property managers. Understanding where in the capital stack a prospect operates determines every sales conversation.

**2. Interest rate sensitivity dominates every commercial decision.** A 100bp move in the 10-year Treasury reprices every asset in the market. Unlike SaaS or services businesses where revenue is relatively rate-insensitive, real estate businesses see their economics change quarter-to-quarter with rate movements. Sellers must understand that "when" a real estate company buys is as important as "what" — and rate environment drives timing. SOFR moved 530 bps from 0.05% (Jan 2022) to 5.35% (Jan 2024); borrowing costs are now roughly 40% off their wides [verified 05/2026, Federal Reserve / Blackstone Q4 2025 Earnings].

**3. The NAR settlement is restructuring residential brokerage.** The $418M NAR settlement (March 2024) eliminated MLS-based offers of buyer-agent compensation and requires written buyer representation agreements before home tours [verified 05/2026, NAR Settlement]. Average buyer-agent commissions were 2.4% in Q1 2025, with experts projecting 30-40% declines over 2-3 years [verified 05/2026, HousingWire / Federal Reserve FEDS Note May 2025]. This is compressing brokerage economics and accelerating technology adoption as brokerages seek efficiency gains.

**4. Proptech adoption is still early despite massive TAM.** Despite a $40B+ US proptech market, adoption is concentrated in enterprise property management (Yardi, RealPage) and construction (Procore). Residential brokerages, small commercial operators, and land businesses remain heavily manual. The adoption curve is steep, not flat — meaning both opportunity and friction for tech vendors.

---

## 3. Sub-categorization of buyer segments

| Sub-category | Scale | Key Players | Buyer Profile |
|---|---|---|---|
| **National homebuilders** | Top 10 do ~65% of new SF sales | D.R. Horton, Lennar, PulteGroup, NVR, Toll Brothers, Meritage, Taylor Morrison, KB Home, M/I Homes, Century Communities | VP Land, VP Ops, CIO — enterprise procurement |
| **Regional homebuilders** (ranks 50-200) | 500-5,000 closings/year | Hundreds of local/regional brands | CEO/COO directly — relationship-driven |
| **Land wholesalers / investors** | $200K-$10M+ annual fees | Fragmented; founder-led | Founder/owner — vibe-based buying |
| **BTR (build-to-rent) developers** | Institutional, 20-500+ unit projects | Blackstone, Carlyle, AMH, Invitation Homes, Pretium/Progress | VP Development, Head of Acquisitions |
| **Commercial brokerages** | $15-30B+ revenue (top 3) | CBRE, JLL, Cushman & Wakefield, Newmark, Colliers, Marcus & Millichap | Managing Director, Head of Tech |
| **Residential brokerages** | Top 5 by transaction volume | Compass, eXp, Keller Williams, RE/MAX, Anywhere (Coldwell Banker/Century 21) | Regional VP, Head of Agent Tech |
| **REITs** | $200B+ public equity combined | Prologis, Equinix, Digital Realty, Simon, Equity Residential, Welltower | CIO, Head of Asset Management |
| **Property management** | Enterprise PM tech market ~$20B+ | Yardi, RealPage, AppFolio, Buildium, Entrata | VP Property Operations, CTO |
| **Construction tech** | ~$10B+ US construction tech | Procore, PlanGrid (Autodesk), Bluebeam, Fieldwire | VP Construction, Project Manager |
| **Mortgage / lending** | $4T+ outstanding residential mortgage | Rocket, UWM, loanDepot, PennyMac, nonbank servicers | CTO, Head of Originations |
| **CRE lenders / CMBS** | $2.7T+ CRE bank loans | National & regional banks, CMBS conduits, debt funds | Head of CRE Lending, Chief Credit Officer |

---

## 4. Major companies (named, with market positions)

### Commercial brokerages
- **CBRE Group** (NYSE: CBRE) — #1 CRE services firm globally. Investment sales, leasing, property management, project management, valuations. $33B+ revenue.
- **JLL (Jones Lang LaSalle)** (NYSE: JLL) — #2 globally. Strong in corporate occupier services, capital markets, property management. $22B+ revenue.
- **Cushman & Wakefield** (NYSE: CWK) — #3 globally. CRE advisory, brokerage, GOS services. $9B+ revenue.
- **Newmark Group** (NASDAQ: NMRK) — Growing share via investment sales and capital markets.
- **Colliers International** (NASDAQ: CIGI) — Investment management + brokerage.
- **Marcus & Millichap** (NYSE: MMI) — Dominant in middle-market multifamily and commercial brokerage.

### Residential brokerages (post-NAR settlement landscape)
- **Compass** (NYSE: COMP) — Tech-forward; 21,550+ agents; ~67,886 transactions Q3 2025 [verified 05/2026, Compass 10-Q]. Negotiated commission splits; high-production agent focus.
- **eXp Realty** (NASDAQ: EXPI) — Cloud-based; 80/20 split with $16K cap; fastest agent growth in recent years. Revenue-share model drives recruiting.
- **Keller Williams** — Largest by agent count (180K+); franchise model; profit-sharing culture.
- **RE/MAX** (NYSE: RMAX) — Franchise model; 100% commission to agents, agents pay desk fees.
- **Anywhere Real Estate** (NYSE: HOUS) — Parent of Coldwell Banker, Century 21, Sotheby's International. Largest by brand portfolio.
- **The Real Brokerage** (NASDAQ: REAX) — Fast-growing tech brokerage; stock-based agent incentives.

### Proptech and property management
- **CoStar Group** (NASDAQ: CSGP) — CRE data monopoly. Owns CoStar, LoopNet, Apartments.com. Acquired Matterport ($1.6B, Feb 2025) [verified 05/2026, CoStar].
- **Zillow Group** (NASDAQ: Z) — Residential real estate marketplace. ShowingTime, dotloop, Zillow Premier Agent.
- **Redfin** (NASDAQ: RDFN) — Discount brokerage + portal. Adjusted model post-NAR settlement.
- **Yardi Systems** — Private. Dominant enterprise property management platform. Voyager suite. Launched Yardi Energy AI (2024) [verified 05/2026, Yardi].
- **RealPage** (Thoma Bravo) — Multifamily property management and revenue management. PE-owned since 2021 ($10.2B). DOJ antitrust scrutiny over revenue management algorithms [verified 05/2026, DOJ filings].
- **AppFolio** (NASDAQ: APPF) — Cloud PM for SMB property managers. Strong in 1-1,000 unit segment.
- **Buildium** (RealPage) — SMB property management (50-5,000 units).
- **Entrata** — Multifamily property management. Competitor to Yardi/RealPage in enterprise.
- **Procore Technologies** (NYSE: PCOR) — Construction management platform. $1B+ ARR. Dominant in commercial construction.
- **MRI Software** — Enterprise commercial and residential PM. PE-backed (TA Associates/GIC).

### Institutional investors and capital allocators
- **Blackstone** — Invested $42B of equity in real estate since early 2024 [verified 05/2026, Blackstone Q4 2025 Earnings]. $2.3B Alexander & Baldwin acquisition (Hawaii commercial REIT). Largest alternative real estate manager globally.
- **Brookfield** ($1T+ AUM) — Aggressive across housing, logistics, data centers, hospitality [verified 05/2026, Brookfield]. Acquired remaining ~26% interest in Oaktree (Oct 2025).
- **Prologis** (NYSE: PLD) — Largest industrial REIT. 95.3% occupancy. Pivoting to data centers: $4-5B in development for 2026, ~40% data-center allocation; $25-50B data center commitment over next decade [verified 05/2026, Prologis Q4 2025 Earnings / Commercial Observer].
- **Equinix** (NASDAQ: EQIX) — Largest data center REIT. 9-10% revenue growth forecast 2026. Record $1.6B annualized bookings in 2025 (+27% YoY) [verified 05/2026, Equinix Q4 2025 Earnings].
- **Simon Property Group** (NYSE: SPG) — Largest retail REIT.
- **Equity Residential** (NYSE: EQR) — Largest apartment REIT.
- **Welltower** (NYSE: WELL) — Largest healthcare REIT.
- **Innovative Industrial Properties (IIPR)** — Cannabis REIT; sale-leaseback model.

---

## 5. Regulatory overlay

### Federal
- **Dodd-Frank / CFPB** — Mortgage origination and servicing regulation. Qualified Mortgage (QM) rules shape lending.
- **FinCEN BOI Reporting** — Beneficial ownership information reporting as of March 2026 [verified 05/2026, FinCEN]. Affects LLCs used in real estate transactions.
- **1031 Exchange (IRC Section 1031)** — Tax-deferred exchange for like-kind real property. Perennial legislative target; currently intact. Drives significant CRE transaction volume.
- **Opportunity Zones (IRC Section 1400Z)** — Tax incentives for investment in designated low-income communities. QOF (Qualified Opportunity Fund) structure.
- **FIRPTA** — Foreign Investment in Real Property Tax Act; affects cross-border RE investment.
- **Fair Housing Act** — Advertising, lending, and sales discrimination prohibitions.
- **CRA (Community Reinvestment Act)** — Bank lending obligations in underserved areas.
- **IRS Section 199A (QBI Deduction)** — 20% pass-through deduction impacts REIT and RE partnership structures.

### State and local
- **Licensing** — Every state licenses RE agents, brokers, appraisers differently. Land wholesaling: IL, OK, AZ require licensing above 1-2 assignments/year [verified 05/2026, state statute review].
- **Transfer taxes** — Vary by state/county; significant in NY, CT, IL, FL.
- **Rent control / stabilization** — Active in CA, NY, OR, DC, and expanding. Impacts multifamily investment thesis.
- **Zoning and entitlements** — Local jurisdiction; the primary friction point for development.
- **Environmental (NEPA, Phase I/II)** — Environmental assessment required for most commercial transactions.
- **Property tax** — Varies dramatically by jurisdiction; primary operating cost for property owners.

### NAR Settlement impact (Aug 2024 effective)
- MLS-based offers of buyer-agent compensation eliminated [verified 05/2026, NAR].
- Written buyer representation agreements required before touring homes [verified 05/2026, NAR].
- Average buyer-agent commission: 2.4% in Q1 2025 [verified 05/2026, HousingWire / Clever].
- Most sellers still offering 2.5-3% but 2% offers increasing [verified 05/2026, HousingWire].
- Experts project 30-40% buyer-agent commission decline over 2-3 years [verified 05/2026, RealTrends / Federal Reserve FEDS Note].
- Impact varies by price point: $1M+ homes averaging 2.17% buyer-agent commission [verified 05/2026, HousingWire].

---

## 6. Technology stack and vendor landscape

### Enterprise property management
| Vendor | Segment | Position |
|---|---|---|
| **Yardi Systems** | Enterprise commercial + multifamily | Market leader; Voyager platform; Energy AI module |
| **RealPage** (Thoma Bravo) | Multifamily + revenue management | #2; DOJ antitrust scrutiny on pricing algorithms |
| **MRI Software** (TA/GIC) | Commercial + residential enterprise | Flexible; strong in commercial |
| **AppFolio** (NASDAQ: APPF) | SMB property management | Cloud-native; 1-1K units |
| **Buildium** (RealPage) | SMB residential PM | 50-5K units |
| **Entrata** | Multifamily enterprise | Challenger to Yardi/RealPage |

### CRE data and analytics
| Vendor | Function |
|---|---|
| **CoStar Group** | CRE data monopoly; comps, analytics, listings (LoopNet) |
| **MSCI Real Capital Analytics** | CRE transaction data and analytics |
| **Trepp** | CMBS research, loan data, delinquency tracking |
| **Green Street** | REIT and CRE advisory research |
| **Reonomy** | CRE property intelligence and owner data |

### Residential tech
| Vendor | Function |
|---|---|
| **Zillow Group** | Consumer portal, ShowingTime (scheduling), dotloop (transaction management) |
| **Redfin** | Discount brokerage + portal |
| **Inside Real Estate (kvCORE)** | CRM and marketing platform for brokerages |
| **Lone Wolf** | Transaction management, back-office |
| **Matterport** (CoStar) | 3D virtual tours and digital twins |
| **Offerpad / Opendoor** | iBuyer (both scaled back from peak) |

### Construction tech
| Vendor | Function |
|---|---|
| **Procore** (NYSE: PCOR) | Construction management platform; $1B+ ARR |
| **Autodesk (PlanGrid, BIM 360)** | Design + construction |
| **Bluebeam** (Nemetschek) | PDF markup and construction collaboration |
| **Fieldwire** (Hilti) | Field management |
| **Buildertrend** | Residential construction management |

### Mortgage tech
| Vendor | Function |
|---|---|
| **ICE Mortgage Technology** (Encompass) | Loan origination system; dominant |
| **Black Knight** (ICE) | Mortgage servicing, data, analytics |
| **Blend** | Digital lending platform |
| **Snapdocs** | Digital mortgage closing |

---

## 7. ICP patterns by buyer type

### Highest-fit Cambrian prospects

**Land wholesalers doing $1M+ annual fees with builder relationships:**
- Fit: 75-85%. Revenue ops problems at scale — pipeline math, CRM, channel attribution.
- Discovery: deal flow sources, buyer concentration, cost per signed contract, cycle time.

**BTR developers with 500+ unit pipeline:**
- Fit: 70-80%. New category, building sales/leasing operations from scratch.
- Discovery: pipeline fill rate, capital partner requirements, lease-up velocity.

**Regional homebuilders (top 50-200 by closings):**
- Fit: 65-75%. GTM complexity increasing as they compete with nationals for land and buyers.
- Discovery: land acquisition pipeline, community count growth, sales per community per month.

**Commercial developers with multi-market operations:**
- Fit: 60-70%. Complex stakeholder selling, capital raises, tenant acquisition.
- Discovery: development pipeline, capital stack, leasing velocity.

**Proptech vendors selling into RE operators:**
- Fit: 70-85%. B2B SaaS selling motion into a fragmented, relationship-driven market.
- Discovery: target segment, sales cycle length, competitive displacement dynamics.

### Lower-fit segments

**National homebuilders (D.R. Horton, Lennar, PulteGroup):**
- Fit: 10-20%. Enterprise procurement; internal land teams; 12-18 month sales cycles.

**Institutional REITs (Prologis, Simon, Equity Residential):**
- Fit: 5-15%. Internal resources; consultant-heavy; relationship-driven procurement.

**Solo land flippers doing <$200K/year:**
- Fit: 15-25%. Too small for consulting engagement; need education, not architecture.

---

## 8. Buying committee and decision dynamics

| Role | What They Care About | Their Lens |
|---|---|---|
| **CEO / Managing Principal** | Portfolio strategy, capital deployment, market selection | "Does this improve our cost basis or deal velocity?" |
| **VP Land / Head of Acquisitions** | Land pipeline, lot costs, entitlement timelines | "Will this help me find and close lots faster?" |
| **VP Construction / Head of Operations** | Build costs, schedule adherence, subcontractor management | "Does this reduce variance and keep us on schedule?" |
| **VP Sales / Head of Leasing** | Absorption pace, buyer/tenant pipeline, conversion rates | "Will my team actually use this? Does it increase velocity?" |
| **CFO / Controller** | Capital allocation, draw schedules, JV accounting, tax | "What's the ROI and how does it show up in our financials?" |
| **CIO / Head of Technology** | Platform integration, data quality, security | "Does this integrate with Yardi/RealPage/our existing stack?" |
| **Capital Partner / LP** | Reporting, transparency, return metrics | "Does this improve our reporting and visibility?" |

### Decision patterns by company type

- **Land wholesalers**: Founder decides alone or with operations manager. 1-14 day cycle. Vibe-based.
- **Regional builders**: CEO + VP Land + CFO. 30-90 days. Reference-driven.
- **BTR developers**: Head of Acquisitions + VP Development + capital partner input. 60-120 days.
- **Commercial brokerages**: Managing Director champion + regional approval + IT review. 90-180 days.
- **REITs and institutional**: Full committee + board for material spend. 6-12 months.

---

## 9. Trigger events

| Trigger | What It Signals | Sales Implication |
|---|---|---|
| **Interest rate cut cycle** | Transaction volume accelerates; capital unlocks | Vendors selling into CRE transactions see pipeline expand |
| **CMBS maturity wave** ($957B matured in 2025 — ~3x 20yr avg) [verified 05/2026, Trepp] | Forced sales, refinancing, recapitalization | Distressed-acquisition tooling; lender relationship management |
| **New state/market entry by builder** | Operational scaling pain | Land acquisition tech, construction management, new-market GTM |
| **NAR settlement commission adjustment** | Brokerage economics compressed | Tech adoption accelerates for efficiency gains |
| **PE/institutional capital deployment** (Blackstone $42B since early 2024) | New acquisitions need operations | Property management, asset management tech |
| **"Extend and pretend" ending** — lenders forcing resolution | Distressed asset sales | Workout advisory, transaction management tech |
| **New BTR community launch** | Build-out + lease-up operations needed | Leasing tech, property management, marketing |
| **Proptech M&A** (CoStar/Matterport, RealPage/Thoma Bravo) | Competitive landscape shift | Vendor displacement opportunity |
| **Zoning change or entitlement approval** | Development project greenlit | Construction tech, financing, sales/leasing |
| **Interest rate spike** | Transaction freeze; defensive posture | Cost-reduction and efficiency pitches |

---

## 10. Common failure modes

1. **Treating "real estate" as one market.** A land wholesaler, a national homebuilder, a multifamily REIT, a CRE brokerage, and a proptech vendor are five completely different businesses. Generic real estate pitches fail immediately.

2. **Ignoring the capital stack.** Every real estate decision is shaped by who provides the capital. A developer with LP commitments has different constraints than a self-funded operator. Not asking about the capital stack in discovery is a fundamental miss.

3. **Missing the rate-sensitivity timing.** Real estate buying is cyclical and rate-driven. Pitching discretionary tech spend during a rate-spike freeze is a timing error, not a product error. Calendar awareness is essential.

4. **Underestimating relationship dynamics.** Real estate is the most relationship-driven B2B vertical. Broker relationships, builder relationships, lender relationships drive deal flow. A vendor that can't get a warm introduction faces 3-5x longer sales cycles.

5. **Confusing residential and commercial.** Different economics, different buyers, different tech stacks, different regulatory environments. A residential CRM (Follow Up Boss) has nothing in common with a CRE analytics platform (CoStar).

6. **Pitching to property managers without Yardi/RealPage integration.** Enterprise property management runs on Yardi or RealPage. A vendor without integration into these platforms cannot sell into enterprise PM. Period.

7. **Ignoring the NAR settlement.** Post-August 2024, residential brokerage economics are being restructured. Sellers who don't understand commission compression, buyer representation agreements, and MLS decoupling are a year behind.

8. **Over-indexing on proptech innovation.** Most real estate operators are not early adopters. They buy technology when pain exceeds friction. "Cool tech" pitches fail; "this solves your specific pain at a price you can measure" wins.

---

## 11. GTM implications

### For Cambrian sellers prospecting RE companies

- **Sub-categorize immediately.** "What type of real estate?" is the first question. Land wholesaler vs. builder vs. REIT vs. brokerage vs. proptech — each requires a completely different brief.
- **Map the capital stack.** "Who provides your capital? LP/GP? Debt structure? Construction vs. permanent financing?" This determines decision-making authority and buying timeline.
- **Reference the rate environment.** Every real estate conversation in 2026 must acknowledge where rates are and where they're headed. Rate-oblivious selling is instantly disqualifying.
- **Understand the distressed opportunity.** $957B in CMBS loans matured in 2025 [verified 05/2026, Trepp]. "Extend and pretend" is ending. Forced sales are increasing. This creates a procurement window for workout-adjacent tools and services.
- **Know the geographic hotspots.** Land and development opportunity varies dramatically by market:
  - Tier 1: Dallas-Fort Worth, Houston, Atlanta, Phoenix, Charlotte, Tampa/Orlando
  - Tier 2: Raleigh-Durham, Nashville, Salt Lake/Boise, Columbus/Indianapolis
  - Emerging: Greenville SC, Huntsville AL, Knoxville TN, Wilmington NC, Reno NV
  - Soft: California metros, Pacific NW urban, Northeast urban, parts of FL coast (insurance crisis)

### For Cambrian sellers selling FROM RE/proptech companies

- Account briefs must reflect the prospect's position in the real estate ecosystem — operator vs. investor vs. service provider vs. tech vendor.
- Builder briefs should include lot inventory, community count, and geographic concentration.
- CRE briefs should include asset class focus, capital structure, and transaction velocity.
- The investor intelligence overlay is critical — Blackstone, Brookfield, KKR, Starwood, Apollo, Carlyle dynamics drive portfolio-company buying behavior.

---

## 12. Cross-references to sister layers

| Layer | How It Applies |
|---|---|
| \`investorIntelligenceKnowledge.js\` | PE/institutional dynamics (Blackstone, Brookfield, KKR); REIT public-company archetypes; LP/GP relationship patterns |
| \`accountingFinanceKnowledge.js\` | JV accounting (ASU 2023-05), EBITDA/FFO valuation, 1031 exchange tax treatment, depreciation schedules |
| \`peHoldcoKnowledge.js\` | PE-backed proptech (RealPage/Thoma Bravo, MRI/TA Associates); portfolio-company GTM patterns |
| \`b2bSalesKnowledge.js\` | Enterprise selling motion into CRE brokerages and REITs; multi-stakeholder buying committee |
| \`approvalGatesKnowledge.js\` | Capital partner approval, investment committee, board-level approval for material RE spend |
| \`paymentsKnowledge.js\` | Mortgage payments infrastructure, rent payment platforms, construction draw processing |
| \`insuranceKnowledge.js\` | Property and casualty insurance crisis (FL coast); title insurance; builder risk |

---

## CAPITAL & INVESTMENT (Q2 2026 REFRESH)

- Blackstone invested $42B of equity in real estate since early 2024, Q4 2025 deal screening activity up >25% YoY [verified 05/2026, Blackstone Q4 2025 Earnings]. Blackstone $2.3B Alexander & Baldwin acquisition (Hawaii commercial REIT) — privatization streak is dominant 2026 structural pattern [verified 05/2026, Blackstone Investor Day].
- Brookfield ($1T+ AUM) positioning aggressively across housing, logistics, data centers, hospitality [verified 05/2026, Brookfield]. Announced Oct 2025 acquisition of remaining ~26% interest in Oaktree [verified 05/2026, Brookfield].
- Real estate values fell 22% over two years ending 2024, only 7% above trough as of late 2025 [verified 05/2026, Blackstone Q4 2025 Earnings] — Blackstone framing as one of most attractive entry points in years.
- $957B in CRE loans matured in 2025 — nearly triple the 20-year average [verified 05/2026, Trepp]. CMBS delinquency 7.29% (~6x bank-loan rates) [verified 05/2026, Trepp]. The "extend and pretend" lender posture from 2023-2024 is now ending — forced sales increasing.
- Multifamily transactions grew 39.5% YoY in 2025; Q1 2025 absorption more than doubled to 82,500 units [verified 05/2026, CBRE].
- Construction costs up 50% over last five years [verified 05/2026, NAHB]. New starts in logistics and rental housing down ~2/3 [verified 05/2026, Census Bureau] — major supply tailwind for existing assets.
- Prologis pivoting to data centers: ~40% of $4-5B 2026 development allocation; $25-50B data center commitment over next decade [verified 05/2026, Prologis Q4 2025 / Commercial Observer].
- Equinix: 9-10% revenue growth forecast 2026; record $1.6B annualized bookings in 2025 (+27%) [verified 05/2026, Equinix Q4 2025].
- NBER WP 31970 (Bidder, Krainer, Shapiro): CRE loans ~25% of average bank assets (~$2.7T at start of 2022 tightening). [verified 05/2026, NBER WP 31970]
- Other major allocators: Starwood, KKR, Apollo, Carlyle, Franklin Templeton (acquired Apera Oct 2025).
- BTR institutional capital: Blackstone, Carlyle, Cerberus, AMH, Invitation Homes, Pretium/Progress.

---

## KNOWN TRAPS — DATA THAT GOES STALE FASTEST (re-verify quarterly)

- Mortgage rates: move weekly; 30yr fixed can shift 50+ bps in a quarter. Always hedge with "as of [date]." [verified 05/2026, Freddie Mac PMMS]
- Cap rates: lag transactions by 1-2 quarters; CBRE and NCREIF report on different cycles. Never cite a cap rate without specifying vintage.
- CRE transaction volumes: quarterly swing wildly on a few mega-deals; YoY comparisons mislead when base quarter was anomalous.
- Vacancy rates: industrial and multifamily vacancies are moving targets — pipeline deliveries shift them 50-100 bps per quarter.
- Construction costs: NAHB indices update quarterly; lumber/steel spot prices move faster.
- BTR/SFR stats: this sub-sector is young and data sources disagree (NAHB vs. John Burns vs. RealPage); always specify the source.
- PE allocations & dry powder: Blackstone/Brookfield/KKR report quarterly with different fiscal calendars.
- CMBS delinquency: Trepp updates monthly; the rate is volatile because the denominator is also changing.
- Sun Belt multifamily oversupply: absorption is racing deliveries — the narrative can flip in two quarters.
- Housing deficit estimates: range from 1.5M to 7M+ depending on methodology; the 3.5-4.7M range is consensus but contested.
- NAR commission data: still evolving post-settlement; quarterly updates from multiple sources with different methodologies.
- PropTech market sizing: ranges from $34B to $53B for 2025-2026 depending on source and scope definition.
`;

export const REAL_ESTATE_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Land wholesalers doing $1M+ annual fees with builder relationships", avgFit: "75-85%", reason: "Revenue ops problems at scale — pipeline math, CRM, channel attribution" },
    { segment: "BTR developers with 500+ unit pipeline", avgFit: "70-80%", reason: "New category, building sales/leasing operations from scratch" },
    { segment: "Regional homebuilders (top 50-200 by closings)", avgFit: "65-75%", reason: "GTM complexity increasing as they compete with nationals for land and buyers" },
    { segment: "Proptech vendors selling into RE operators", avgFit: "70-85%", reason: "B2B SaaS selling motion into fragmented, relationship-driven market" },
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
- What type of real estate are you in — residential, commercial, land, development, brokerage, proptech?
- How many states/markets are you operating in? How do you decide which markets to enter?
- What's your split between builder buyers and retail/individual buyers?
- Walk me through your last 5 deals — source, buyer, cycle time.
- What's your current cost per signed contract by channel?
- Who provides your capital? What does the capital stack look like?

IMPACT stage — quantify the pain:
- How many active buyers can you call right now and place a parcel with in 7 days?
- Where do deals die in your pipeline? What % of contracts close vs. cancel?
- What's your earnest money exposure at any given time?
- How much do you spend monthly on lead gen across all channels?
- How has the NAR settlement changed your brokerage economics (if residential)?
- What's the rate-sensitivity of your current pipeline? How does a 50bp move change your deal flow?

VISION stage — what does success look like:
- Where do you want to be in 18 months — what's the constraint between here and there?
- If you could snap your fingers and fix one thing in your operation, what would it be?
- What would it look like if your first W-2 hire was ramping successfully?
- Are you building toward an exit? What does a buyer want to see in your operations?

ENTRY POINTS — who decides:
- Who's doing acquisitions, dispositions, transaction coordination?
- Who handles builder relationships? Is it the founder or delegated?
- Is there a capital partner or investor who influences operational decisions?
- What's your tech stack today — Yardi, RealPage, custom, Excel?
`;
