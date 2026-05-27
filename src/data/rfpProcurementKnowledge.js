// src/data/rfpProcurementKnowledge.js
//
// Cross-cutting RFP & Procurement Intelligence layer -- powers the RFP search
// mechanism across ALL verticals. Unlike vertical-specific KLs, this layer is
// injected whenever a prospect or account has procurement/RFP signals, regardless
// of industry.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_RFP_PROCUREMENT (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// VERSION: 1.0.0
// VERIFIED: 2026-05-26
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   SAM.gov API documentation: sam.gov/data-services
//   Grants.gov API: grants.gov/web/grants/search-grants.html
//   USASpending.gov API: api.usaspending.gov
//   FPDS-NG: fpds.gov
//   TED Europa (Tenders Electronic Daily): ted.europa.eu
//   CanadaBuys (formerly BuyAndSell): canadabuys.canada.ca
//   UK Find a Tender: find-tender.service.gov.uk
//   AusTender: tenders.gov.au
//   GovWin IQ (Deltek): govwin.com
//   BidNet Direct: bidnet.com
//   BidPrime: bidprime.com
//   DemandStar: demandstar.com
//   Sourcewell cooperative: sourcewell-mn.gov
//   OMNIA Partners: omniapartners.com
//   GSA MAS Schedule: gsa.gov/buy-through-us/purchasing-programs/multiple-award-schedule
//   NASA SEWP: sewp.nasa.gov
//   NITAAC: nitaac.nih.gov
//   UN Global Marketplace: ungm.org
//   World Bank Procurement: projects.worldbank.org/en/projects-operations/procurement
//   SAP Ariba Discovery: discovery.ariba.com

/**
 * Signal strength scoring rubric for RFP/procurement signals.
 * Used by the scoring engine to weight procurement signals against
 * other intent data (hiring, technographic, etc.).
 */
export const RFP_SIGNAL_SCORING = {
  activeRfp:        { score: 1.0,  label: "Active RFP/RFQ/RFI published",       decayDays: 0,   decayRate: 0,    notes: "Binary -- open or closed. No decay while solicitation is open." },
  incumbentRfp:     { score: 0.85, label: "Incumbent contract up for re-bid",    decayDays: 180, decayRate: 0.05, notes: "Signal degrades as re-bid window passes without action." },
  rfiPublished:     { score: 0.70, label: "RFI / Sources Sought notice",         decayDays: 120, decayRate: 0.08, notes: "Often precedes formal RFP by 3-6 months." },
  federalForecast:  { score: 0.50, label: "Federal procurement forecast entry",  decayDays: 365, decayRate: 0.03, notes: "Agencies publish annual forecasts; slow decay." },
  boardMinutes:     { score: 0.50, label: "Board minutes mention procurement",   decayDays: 180, decayRate: 0.05, notes: "SLED entities publish board minutes; strong pre-RFP signal." },
  hiringSignal:     { score: 0.30, label: "Procurement/sourcing hiring activity",decayDays: 90,  decayRate: 0.10, notes: "Job postings for procurement officers, contract specialists." },
  newsSignal:       { score: 0.30, label: "News/press on planned initiative",    decayDays: 60,  decayRate: 0.15, notes: "Press releases about new programs, capital plans, budgets." },
  pastAward:        { score: 0.20, label: "Past award / contract history",       decayDays: 730, decayRate: 0.02, notes: "Historical patterns indicate future re-procurement cycles." },
  earningsCall:     { score: 0.40, label: "Earnings call / 10-K capex mention",  decayDays: 120, decayRate: 0.08, notes: "Public companies discussing planned technology spend." },
  conferenceSignal: { score: 0.25, label: "Conference session / panel mention",  decayDays: 90,  decayRate: 0.10, notes: "Speaker at industry event discussing planned projects." },
  foiaLitigation:   { score: 0.35, label: "FOIA request or litigation signal",   decayDays: 180, decayRate: 0.05, notes: "Protests, FOIA requests indicate active procurement." },
  patentFiling:     { score: 0.15, label: "Patent filing in target domain",      decayDays: 365, decayRate: 0.02, notes: "Weak signal; indicates R&D direction, not procurement." },
};

/**
 * Five-tier source hierarchy for RFP/procurement intelligence.
 * Priority 1 = check first; Priority 5 = check last.
 */
export const RFP_SOURCE_TIERS = {
  tier1_freeGovApis: {
    priority: 1,
    label: "Free Government APIs & Portals",
    rationale: "Authoritative, structured, machine-readable, zero cost. Always check first.",
    sources: [
      { name: "SAM.gov", scope: "U.S. Federal", url: "sam.gov", apiAvailable: true, notes: "Primary federal opportunities portal; Entity API + Opportunities API [verified 05/2026, SAM.gov]" },
      { name: "Grants.gov", scope: "U.S. Federal grants", url: "grants.gov", apiAvailable: true, notes: "Federal grant opportunities; XML extract available [verified 05/2026, Grants.gov]" },
      { name: "USASpending.gov", scope: "U.S. Federal awards", url: "usaspending.gov", apiAvailable: true, notes: "Historical award data; spending analysis API [verified 05/2026, USASpending]" },
      { name: "FPDS-NG", scope: "U.S. Federal contracts", url: "fpds.gov", apiAvailable: true, notes: "Federal Procurement Data System; contract-level detail [verified 05/2026, FPDS]" },
      { name: "State procurement portals", scope: "U.S. SLED", url: "varies by state", apiAvailable: false, notes: "All 50 states maintain procurement portals; no unified API [verified 05/2026, NASPO]" },
    ],
  },
  tier2_sledAggregators: {
    priority: 2,
    label: "SLED Aggregators (State/Local/Education)",
    rationale: "Consolidate fragmented state/local/education bids into searchable feeds. Mix of free and paid.",
    sources: [
      { name: "GovWin IQ (Deltek)", scope: "U.S. Fed + SLED", url: "govwin.com", paid: true, notes: "Largest U.S. gov procurement intelligence platform; pre-RFP tracking [verified 05/2026, Deltek]" },
      { name: "BidNet Direct", scope: "U.S. SLED", url: "bidnet.com", paid: true, notes: "11,000+ agencies; strong local government coverage [verified 05/2026, BidNet]" },
      { name: "BidPrime", scope: "U.S. SLED", url: "bidprime.com", paid: true, notes: "AI-matched bid alerts; SLED focus; API available [verified 05/2026, BidPrime]" },
      { name: "DemandStar", scope: "U.S. SLED", url: "demandstar.com", paid: true, notes: "Local government focus; bid notification service [verified 05/2026, DemandStar]" },
      { name: "PublicBidTracker", scope: "U.S. SLED", url: "publicbidtracker.com", paid: false, notes: "Free aggregator; limited coverage but useful for initial scan" },
    ],
  },
  tier3_international: {
    priority: 3,
    label: "International Procurement Portals",
    rationale: "Required for prospects with global operations or international public-sector sales.",
    sources: [
      { name: "TED Europa", scope: "EU/EEA", url: "ted.europa.eu", apiAvailable: true, notes: "Tenders Electronic Daily; CPV codes; eForms standard since 2023 [verified 05/2026, EU Publications Office]" },
      { name: "CanadaBuys", scope: "Canada", url: "canadabuys.canada.ca", apiAvailable: true, notes: "Replaced BuyAndSell; federal + provincial opportunities [verified 05/2026, PSPC]" },
      { name: "UK Find a Tender", scope: "United Kingdom", url: "find-tender.service.gov.uk", apiAvailable: true, notes: "Post-Brexit replacement for TED UK notices [verified 05/2026, UK Cabinet Office]" },
      { name: "AusTender", scope: "Australia", url: "tenders.gov.au", apiAvailable: true, notes: "Australian federal procurement portal [verified 05/2026, Dept of Finance]" },
      { name: "UNGM", scope: "United Nations", url: "ungm.org", apiAvailable: false, notes: "UN Global Marketplace; UN agency procurement [verified 05/2026, UNGM]" },
      { name: "World Bank Procurement", scope: "Multilateral", url: "projects.worldbank.org", apiAvailable: true, notes: "World Bank-funded project procurement [verified 05/2026, World Bank]" },
      { name: "ADB Procurement", scope: "Asia-Pacific", url: "adb.org/business/opportunities", apiAvailable: false, notes: "Asian Development Bank-funded projects [verified 05/2026, ADB]" },
    ],
  },
  tier4_industrySpecific: {
    priority: 4,
    label: "Industry-Specific Procurement Networks",
    rationale: "Vertical-specific purchasing cooperatives and GPOs with unique procurement channels.",
    sources: [
      { name: "Vizient", scope: "Healthcare GPO", notes: "Largest U.S. healthcare GPO; ~$130B in annual purchasing [verified 05/2026, Vizient]" },
      { name: "Premier Inc.", scope: "Healthcare GPO", notes: "4,400+ hospitals; group purchasing + supply chain [verified 05/2026, Premier]" },
      { name: "HealthTrust (HCA)", scope: "Healthcare GPO", notes: "HCA-affiliated GPO; strong in acute care [verified 05/2026, HealthTrust]" },
      { name: "Sourcewell", scope: "Education/Gov cooperative", notes: "Government & education cooperative purchasing; NAICS-based [verified 05/2026, Sourcewell]" },
      { name: "OMNIA Partners", scope: "Public/Private cooperative", notes: "Largest U.S. purchasing cooperative; public + private [verified 05/2026, OMNIA]" },
      { name: "TIPS/TAPS", scope: "Education cooperative", notes: "Texas-based; nationwide K-12 + higher ed cooperative [verified 05/2026, TIPS]" },
      { name: "GSA MAS (Multiple Award Schedule)", scope: "U.S. Federal IT/services", notes: "Pre-competed federal contract vehicle; ~$50B annual spend [verified 05/2026, GSA]" },
      { name: "NASA SEWP VI", scope: "U.S. Federal IT", notes: "Solutions for Enterprise-Wide Procurement; IT hardware/software [verified 05/2026, NASA]" },
      { name: "NITAAC CIO-SP3/SP4", scope: "U.S. Federal IT", notes: "NIH IT acquisition center; GWAC for IT services [verified 05/2026, NITAAC]" },
      { name: "ConstructConnect", scope: "Construction", notes: "Commercial/public construction bid aggregation [verified 05/2026, ConstructConnect]" },
    ],
  },
  tier5_commercial: {
    priority: 5,
    label: "Commercial / Private-Sector Procurement Intel",
    rationale: "Private-sector RFPs are less visible; requires indirect signals and commercial databases.",
    sources: [
      { name: "RFPDB", scope: "Private-sector RFPs", url: "rfpdb.com", paid: true, notes: "Database of private-sector RFPs; limited but growing [verified 05/2026, RFPDB]" },
      { name: "FindRFP", scope: "Private-sector RFPs", url: "findrfp.com", paid: true, notes: "Curated private-sector RFP feed [verified 05/2026, FindRFP]" },
      { name: "SAP Ariba Discovery", scope: "Global commercial", url: "discovery.ariba.com", paid: false, notes: "Free posting; Ariba network buyer-supplier matching [verified 05/2026, SAP]" },
      { name: "Fortune 500 supplier portals", scope: "Enterprise", url: "varies", paid: false, notes: "Large enterprises publish supplier diversity and procurement pages" },
      { name: "LinkedIn procurement signals", scope: "All sectors", url: "linkedin.com", paid: false, notes: "Procurement manager activity, job postings, company updates as indirect signal" },
    ],
  },
};

/**
 * Concise prompt-injection string for the AI search mechanism.
 * Tells the model HOW to search for RFPs using this knowledge layer.
 * Kept under 50 lines for token efficiency in the prompt.
 */
export const RFP_SEARCH_GUIDANCE = `
RFP & PROCUREMENT SEARCH PROTOCOL
===================================
When searching for procurement opportunities for a prospect or account:

1. CLASSIFY the buyer sector: Federal | SLED | International | Private
2. IDENTIFY NAICS/CPV codes relevant to the seller's product/service
3. SEARCH in tier order (always start with Tier 1 free government sources):
   - Federal: SAM.gov Opportunities API -> FPDS history -> USASpending -> agency forecasts
   - SLED: State portal -> GovWin/BidNet/BidPrime -> board minutes -> news
   - International: TED Europa (CPV) -> CanadaBuys -> UK FaT -> AusTender -> UNGM
   - Private: RFPDB/FindRFP -> Ariba Discovery -> supplier portals -> LinkedIn signals

4. COMBINE with pre-RFP signals (strongest to weakest):
   - Active solicitation (1.0) > Incumbent re-bid (0.85) > RFI/Sources Sought (0.7)
   - Forecast (0.5) > Board minutes (0.5) > Earnings/10-K (0.4) > FOIA (0.35)
   - Hiring (0.3) > News (0.3) > Conference (0.25) > Past award (0.2) > Patent (0.15)

5. DEDUP by solicitation_number first, then buyer+date+title hash
6. MATCH to accounts via UEI (federal), CIK (SEC filers), or fuzzy name match
7. APPLY decay: each signal type has a decay rate per day past detection
8. RETURN top opportunities ranked by: signal_score * (1 - decay) * sector_relevance

QUERY OPTIMIZATION:
- Federal: Use NAICS code + keywords; filter by set-aside if applicable
- SLED: Search by state + category; check cooperative contracts (Sourcewell, OMNIA)
- International: Use CPV codes for TED; use UNSPSC for UN/World Bank
- Private: Combine company name + "RFP" OR "vendor selection" OR "supplier"
- Always check incumbent contract expiration dates via FPDS/USASpending

DO NOT fabricate solicitation numbers, award amounts, or deadlines.
Always cite the source portal for any specific opportunity returned.
`.trim();

export const RFP_PROCUREMENT_PLAYBOOK = {
  name: "RFP & Procurement Intelligence",
  keywords: [
    "RFP", "RFQ", "RFI", "procurement", "solicitation", "tender",
    "SAM.gov", "TED", "NAICS", "CPV", "SLED", "GovWin", "BidNet",
    "sources sought", "pre-RFP", "board minutes", "federal",
    "state", "local", "education", "GPO", "cooperative purchasing",
    "bid", "proposal", "government contract", "GWAC", "BPA",
    "IDIQ", "task order", "set-aside", "small business",
    "8(a)", "HUBZone", "SDVOSB", "WOSB", "sole source",
    "competitive bid", "sealed bid", "best value", "LPTA",
    "acquisition forecast", "vendor selection", "supplier diversity",
    "public tender", "eForms", "UNSPSC", "GSA Schedule",
    "MAS", "SEWP", "NITAAC", "CIO-SP", "Sourcewell", "OMNIA",
    "TIPS", "Vizient", "Premier", "HealthTrust",
    "SAP Ariba", "procurement officer", "contracting officer",
    "UEI", "CAGE code", "DUNS", "past performance",
  ],
  discovery: [
    "What percentage of your pipeline comes from formal RFPs versus proactive outreach, and how do you currently source those opportunities?",
    "Which government or public-sector tiers do you sell into -- federal, state/local, education, international -- and do you hold any existing contract vehicles (GSA MAS, SEWP, cooperative agreements)?",
    "How are you currently tracking pre-RFP signals like board minutes, acquisition forecasts, and sources-sought notices before the formal solicitation drops?",
    "What NAICS or CPV codes apply to your products/services, and are you registered in SAM.gov, TED Europa, or other relevant portals?",
    "Do you have a dedicated proposal/capture team, or does the sales team handle RFP responses alongside their pipeline work?",
    "How do you handle cooperative purchasing vehicles (Sourcewell, OMNIA, TIPS) and GPO relationships (Vizient, Premier) -- are those active revenue channels?",
    "When you lose an RFP, what's the most common reason -- price, technical score, past performance, incumbency advantage, or something else?",
  ],
  layerContent: `---
title: "RFP & Procurement Intelligence --- Cross-Cutting Knowledge Layer"
type: cross_cutting_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_b2b_sales_value_creation.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_compliance_knowledge.md
  - cambrian_investor_intelligence.md
tags: [RFP, RFQ, RFI, procurement, solicitation, tender, SAM.gov, TED, NAICS, CPV, SLED, GovWin, federal, state, local, education, GPO, cooperative, pre-RFP, signal-scoring]
last_updated: 2026-05-26
status: production
confidence: high (SAM.gov docs; TED Europa eForms spec; GovWin/BidNet product pages; GSA MAS/SEWP/NITAAC official portals; Sourcewell/OMNIA cooperative agreements; Bloomberg Government; Deltek GovWin market reports)
---

# RFP & Procurement Intelligence --- Cross-Cutting Knowledge Layer

> **Purpose.** This is NOT a vertical layer. It is a cross-cutting intelligence layer that powers the RFP search mechanism across every vertical Cambrian supports. When a seller-user's prospect participates in formal procurement (government, education, healthcare GPO, cooperative purchasing, or private-sector RFP), this layer provides the sourcing taxonomy, signal scoring rubric, search strategy, and deduplication logic needed to surface actionable procurement opportunities.

> **Why this matters.** Government and institutional procurement in the U.S. alone exceeds $2 trillion annually across federal (~$700B), state/local (~$1.2T), and education (~$200B) [verified 05/2026, Bloomberg Government + Census Bureau Annual Survey of State & Local Government Finances]. Private-sector RFP volume is unmeasured but substantial. For sellers in IT, cybersecurity, healthcare, construction, professional services, and defense, procurement signals are the highest-intent buying indicators available. An active RFP is a confirmed budget with a deadline.

═══════════════════════════════════════════════════════════
  SECTION 1: SOURCING LANDSCAPE --- THE 5-TIER HIERARCHY
═══════════════════════════════════════════════════════════

The procurement intelligence landscape is organized into five tiers by priority, cost, and reliability:

**Tier 1 -- Free Government APIs & Portals (ALWAYS CHECK FIRST)**
SAM.gov (federal), Grants.gov (federal grants), USASpending.gov (awards), FPDS-NG (contracts), and individual state portals. These are authoritative, structured, machine-readable, and free. SAM.gov's Opportunities API returns JSON with solicitation numbers, NAICS codes, set-aside types, response deadlines, and contracting officer contact info [verified 05/2026, SAM.gov API docs]. USASpending API provides historical award data for incumbent analysis [verified 05/2026, USASpending].

**Tier 2 -- SLED Aggregators (State/Local/Education)**
GovWin IQ (Deltek), BidNet Direct, BidPrime, DemandStar, and free options like PublicBidTracker and individual state portals. These consolidate fragmented state/local/education bids into searchable feeds. GovWin IQ is the most comprehensive, with pre-RFP intelligence and agency briefings [verified 05/2026, Deltek]. BidPrime offers AI-matched bid alerts with API access [verified 05/2026, BidPrime].

**Tier 3 -- International Portals**
TED Europa (EU/EEA tenders using CPV codes and the eForms standard adopted in 2023), CanadaBuys (replaced BuyAndSell), UK Find a Tender (post-Brexit), AusTender (Australia), UNGM (United Nations), World Bank Procurement, and Asian Development Bank [verified 05/2026, respective portals]. TED alone publishes ~700,000+ procurement notices annually [verified 05/2026, EU Publications Office].

**Tier 4 -- Industry-Specific Procurement Networks**
Healthcare GPOs (Vizient, Premier Inc., HealthTrust), education cooperatives (Sourcewell, OMNIA Partners, TIPS/TAPS), federal IT vehicles (GSA MAS, NASA SEWP, NITAAC CIO-SP), and construction aggregators (ConstructConnect). These represent pre-competed channels where procurement follows established contract vehicles rather than open-market RFPs [verified 05/2026, respective organizations].

**Tier 5 -- Commercial / Private-Sector Intel**
RFPDB, FindRFP, SAP Ariba Discovery, Fortune 500 supplier diversity portals, and LinkedIn signals. Private-sector procurement is far less visible than public-sector; requires indirect signal detection [verified 05/2026, respective platforms].

═══════════════════════════════════════════════════════════
  SECTION 2: FEDERAL U.S. SOURCES
═══════════════════════════════════════════════════════════

**SAM.gov (System for Award Management)**
- Primary portal for ALL federal contract opportunities above $25K (the micro-purchase threshold) [verified 05/2026, FAR Part 5]
- Opportunities API: GET /api/opportunities/v2/search -- returns JSON with solicitationNumber, title, type (o/p/k/r/s/i = solicitation/presolicitation/combined/result/sources-sought/intent-to-bundle), NAICS, set-aside, postedDate, responseDeadline, office, description [verified 05/2026, SAM.gov API docs]
- Entity API: Validates UEI (Unique Entity Identifier, replaced DUNS in 2022), CAGE codes, registration status [verified 05/2026, SAM.gov]
- Exclusions API: Debarred/suspended entity check
- Rate limits: 10 requests/second with API key (free registration) [verified 05/2026, SAM.gov]

**Grants.gov**
- Federal grant opportunities (distinct from contracts); ~1,000+ open at any time [verified 05/2026, Grants.gov]
- XML extract and REST API available; CFDA numbers for program identification

**USASpending.gov**
- Historical federal award data -- essential for incumbent analysis and spend pattern detection [verified 05/2026, USASpending]
- Award Search API: Filter by agency, NAICS, recipient, date range, award type
- Use case: "Who is the incumbent on this contract?" and "What has this agency spent on [category] in the last 5 years?"

**FPDS-NG (Federal Procurement Data System)**
- Contract-level detail including modifications, options exercised, and period of performance [verified 05/2026, FPDS]
- Atom feed API for programmatic access
- Key for tracking contract expiration dates to predict re-procurement timing

**Agency-Specific Portals & Forecasts**
- DoD: Defense.gov procurement forecasts; service-specific small business offices
- DHS: DHS procurement forecasts via Acquisition Innovation
- VA: VA eCMS; VETS GWAC for SDVOSB set-asides
- HHS: HHS Forecast of Contracting Opportunities (annual publication)
- GSA: GSA eBuy for RFQs against existing schedule holders [verified 05/2026, GSA]
- Many agencies publish annual acquisition forecasts (required for actions > $250K by FAR 7.104)

═══════════════════════════════════════════════════════════
  SECTION 3: SLED AGGREGATORS
═══════════════════════════════════════════════════════════

**GovWin IQ (Deltek)**
- Most comprehensive U.S. government procurement intelligence platform [verified 05/2026, Deltek]
- Federal + SLED coverage; pre-RFP tracking with "opportunity profiles"
- Analysts provide agency briefings, competitive landscape, and award predictions
- Paid tiers: Essential, Professional, Enterprise (~$3K-$25K+/year)

**BidNet Direct**
- 11,000+ state/local/education agencies [verified 05/2026, BidNet]
- Automatic bid matching by commodity code
- Paid subscription; varies by region and agency coverage

**BidPrime**
- AI-powered bid matching and alert system [verified 05/2026, BidPrime]
- SLED focus with API access for integration
- Keyword + NAICS matching with relevance scoring

**DemandStar**
- Local government focus; notification service [verified 05/2026, DemandStar]
- Strong in municipal and county procurement
- Integrated with many local government purchasing systems

**Free Options**
- PublicBidTracker: Free SLED bid aggregator; limited but useful for initial scan
- Individual state procurement portals (e.g., Cal eProcure, NY VendRep, TX ESBD, FL MyFloridaMarketPlace)
- Many states use BidSync, Periscope/Sciquest, or Bonfire as their eProcurement platform [verified 05/2026, NASPO survey]

═══════════════════════════════════════════════════════════
  SECTION 4: INTERNATIONAL PORTALS
═══════════════════════════════════════════════════════════

**TED Europa (Tenders Electronic Daily)**
- Official portal for EU/EEA public procurement notices; ~700,000+ notices/year [verified 05/2026, EU Publications Office]
- Uses CPV (Common Procurement Vocabulary) codes -- distinct from NAICS
- eForms standard adopted Oct 2023: structured XML/JSON replacing legacy forms [verified 05/2026, EU eForms Regulation 2019/1780]
- API: data.ted.europa.eu -- SPARQL endpoint + bulk download
- Thresholds (2024-2025): Services EUR 143K (central) / EUR 221K (sub-central); Works EUR 5.5M [verified 05/2026, EU Directive 2014/24]

**Other International Portals**
- CanadaBuys: Replaced BuyAndSell.gc.ca; GSIN codes; bilingual API [verified 05/2026, PSPC]
- UK Find a Tender: Post-Brexit; CPV codes; API available [verified 05/2026, UK Cabinet Office]
- AusTender: Australian Commonwealth; UNSPSC classification [verified 05/2026, Dept of Finance]
- UNGM: UN agency procurement registration and notifications [verified 05/2026, UNGM]
- World Bank: STEP system for funded-project procurement [verified 05/2026, World Bank]
- ADB: Asia-Pacific development bank procurement [verified 05/2026, ADB]

═══════════════════════════════════════════════════════════
  SECTION 5: INDUSTRY-SPECIFIC PROCUREMENT
═══════════════════════════════════════════════════════════

**Healthcare GPOs (Group Purchasing Organizations)**
- Vizient: Largest U.S. healthcare GPO; ~$130B in annual member purchasing; serves ~50% of U.S. hospitals [verified 05/2026, Vizient annual report]
- Premier Inc.: 4,400+ hospitals and health systems; ~$80B+ in purchasing volume [verified 05/2026, Premier SEC filings]
- HealthTrust (HCA Healthcare affiliated): ~1,800 hospitals; strong in acute care supplies [verified 05/2026, HealthTrust]
- GPO procurement follows contract cycles: multi-year agreements with committed volume; RFP-like processes run by GPO on behalf of members
- Sellers must be GPO-contracted to access member purchasing; "off-contract" sales are possible but face resistance

**Education Cooperatives**
- Sourcewell: Government & education cooperative purchasing; competitively solicited contracts available to 50,000+ member agencies nationwide [verified 05/2026, Sourcewell]
- OMNIA Partners: Largest U.S. purchasing cooperative; public + private sector; piggyback on competitively bid contracts [verified 05/2026, OMNIA]
- TIPS/TAPS: Texas-based cooperative; nationwide reach for K-12 + higher ed; vendor-friendly onboarding [verified 05/2026, TIPS]
- E&I Cooperative Services: Higher education focused [verified 05/2026, E&I]
- Cooperative advantage: once a seller wins the cooperative contract, individual member agencies can purchase without running their own RFP (piggyback purchasing)

**Federal IT Contract Vehicles**
- GSA MAS (Multiple Award Schedule): Pre-competed federal IT/services contract vehicle; ~$50B annual spend through schedules [verified 05/2026, GSA]
- NASA SEWP (Solutions for Enterprise-Wide Procurement): GWAC for IT products; V and VI iterations; ~$15B ceiling per iteration [verified 05/2026, NASA SEWP]
- NITAAC CIO-SP3 / CIO-SP4: NIH IT Acquisition and Assessment Center; GWAC for IT services; broad scope [verified 05/2026, NITAAC]
- Alliant 2 / Alliant 3 (GSA): Large-scale IT services GWAC [verified 05/2026, GSA]
- Sellers must be contract holders to receive task orders; becoming a prime or subcontractor on these vehicles is a strategic investment

**Construction**
- ConstructConnect: Commercial and public construction bid intelligence; plan rooms, bid documents [verified 05/2026, ConstructConnect]
- Dodge Construction Network: Project intelligence for commercial construction [verified 05/2026, Dodge]
- Construction procurement follows plan-spec-bid cycles distinct from IT/services procurement

═══════════════════════════════════════════════════════════
  SECTION 6: COMMERCIAL / PRIVATE-SECTOR PROCUREMENT
═══════════════════════════════════════════════════════════

**Dedicated Private-Sector RFP Databases**
- RFPDB: Curated database of private-sector RFPs across industries [verified 05/2026, RFPDB]
- FindRFP: Private-sector RFP aggregation; email alerts; category filtering [verified 05/2026, FindRFP]
- Limitations: Coverage is incomplete; many private-sector RFPs never reach these platforms

**SAP Ariba Discovery**
- Free buyer-supplier matching platform within the Ariba network [verified 05/2026, SAP]
- Buyers post sourcing events; suppliers respond; global reach
- Particularly strong for manufacturing, MRO, indirect procurement

**Fortune 500 Supplier Portals**
- Most large enterprises maintain supplier diversity and registration pages
- Look for: "Become a Supplier", "Supplier Registration", "Vendor Portal" on corporate websites
- Supplier diversity programs (MWBE, SDVOSB, HUBZone) create additional entry points

**LinkedIn as Procurement Signal**
- Procurement manager activity: connection requests, content sharing about initiatives
- Job postings for procurement/sourcing roles indicate active buying cycles
- Company updates mentioning vendor selection, digital transformation, or new programs
- Signal strength is low (0.3) but compounds with other signals

═══════════════════════════════════════════════════════════
  SECTION 7: PRE-RFP SIGNALS
═══════════════════════════════════════════════════════════

Pre-RFP intelligence is the most valuable competitive advantage in procurement. By the time a formal RFP is published, the incumbent and well-connected competitors have already shaped requirements. Detecting procurement intent BEFORE the solicitation drops is the goal.

**Signal sources ranked by strength:**

| Signal | Strength | Lead Time | Where to Find |
|--------|----------|-----------|---------------|
| Sources Sought / RFI | 0.70 | 3-6 months pre-RFP | SAM.gov (type=r/s), GovWin |
| Federal acquisition forecasts | 0.50 | 6-18 months pre-RFP | Agency forecast pages, GovWin |
| Board/council minutes | 0.50 | 3-12 months pre-RFP | Municipal/county/school board websites, Civic IQ |
| Earnings calls / 10-K filings | 0.40 | 3-12 months pre-RFP | SEC EDGAR, Bloomberg, earnings transcripts |
| FOIA requests / bid protests | 0.35 | 1-6 months pre/post-RFP | FOIA logs, GAO protest decisions |
| Job postings (procurement roles) | 0.30 | 2-9 months pre-RFP | LinkedIn, Indeed, government HR portals |
| News / press releases | 0.30 | 1-12 months pre-RFP | Google News, trade publications, PR Newswire |
| Conference sessions / panels | 0.25 | 3-12 months pre-RFP | Industry conference agendas, speaker bios |
| Past award patterns | 0.20 | Predictive | FPDS, USASpending, state award databases |
| Patent filings | 0.15 | 6-24 months | USPTO PAIR, Google Patents |

**Board Minutes (SLED gold mine)**
Municipal councils, county commissions, and school boards publish meeting minutes that often reveal planned procurements months before formal solicitations. Key phrases to scan: "authorized to issue RFP", "approved for procurement", "budget allocation for", "authorized staff to solicit", "approved contract extension" [verified 05/2026, structural -- all U.S. open-meeting laws require published minutes].

**Federal Acquisition Forecasts**
Agencies are required to publish forecasts for actions above $250K (FAR 7.104). These forecasts include estimated value, NAICS, planned solicitation date, and point of contact. Not all agencies comply consistently, but major agencies (DoD, DHS, VA, HHS, GSA) publish regularly [verified 05/2026, FAR].

**Earnings Calls & 10-K Analysis**
Public companies discussing planned capital expenditures, technology modernization, or vendor consolidation in earnings calls or 10-K filings are signaling procurement intent. Key phrases: "we plan to invest", "modernization initiative", "vendor rationalization", "digital transformation program", "capital allocation for" [verified 05/2026, structural -- SEC requires forward-looking disclosure].

**Job Postings as Procurement Signal**
When an organization hires procurement officers, contract specialists, or sourcing managers, it signals upcoming purchasing activity. A cluster of procurement hiring at a single organization is a strong leading indicator [verified 05/2026, structural].

═══════════════════════════════════════════════════════════
  SECTION 8: SIGNAL SCORING RUBRIC
═══════════════════════════════════════════════════════════

**Unified Signal Scoring Table**

| Signal Type | Base Score | Decay Start (days) | Decay Rate (/day) | Notes |
|-------------|-----------|-------------------|-------------------|-------|
| Active RFP/RFQ published | 1.00 | 0 (no decay while open) | 0.00 | Binary: open or closed. Highest priority. |
| Incumbent contract re-bid | 0.85 | 180 | 0.05 | Degrades as re-bid window passes. |
| RFI / Sources Sought | 0.70 | 120 | 0.08 | Precedes formal RFP by 3-6 months. |
| Federal forecast entry | 0.50 | 365 | 0.03 | Annual publication; slow decay. |
| Board minutes mention | 0.50 | 180 | 0.05 | SLED-specific; strong pre-RFP indicator. |
| Earnings call / 10-K capex | 0.40 | 120 | 0.08 | Quarterly refresh cycle. |
| FOIA / litigation signal | 0.35 | 180 | 0.05 | Protests and FOIA indicate active procurement. |
| Hiring signal (procurement) | 0.30 | 90 | 0.10 | Fast decay; hiring is time-bounded. |
| News / press signal | 0.30 | 60 | 0.15 | Fastest decay; news becomes stale quickly. |
| Conference signal | 0.25 | 90 | 0.10 | Seasonal; tied to event calendar. |
| Past award pattern | 0.20 | 730 | 0.02 | Historical; very slow decay; predictive. |
| Patent filing | 0.15 | 365 | 0.02 | Weak signal; R&D direction indicator. |

**Decay Function:**
effective_score = base_score * max(0, 1 - (days_since_detection - decay_start) * decay_rate)

When decay_start = 0 and the signal is still active (e.g., open RFP), no decay is applied.
When multiple signals exist for the same account, scores are combined using:
  composite_score = max(individual_scores) + 0.1 * sum(remaining_scores)
This prevents score inflation while rewarding signal convergence.

**Score Interpretation:**
- 0.8-1.0: Active opportunity -- immediate action required
- 0.5-0.79: Strong pre-RFP signal -- begin capture/positioning
- 0.3-0.49: Moderate signal -- monitor and prepare
- 0.1-0.29: Weak/historical signal -- awareness only
- < 0.1: Noise -- do not surface unless corroborated

═══════════════════════════════════════════════════════════
  SECTION 9: DATA SHAPE & DEDUPLICATION
═══════════════════════════════════════════════════════════

**Unified RFP_signal Schema**
Fields: signal_id (UUID), source_tier (1-5), source_name, signal_type (active_rfp | active_rfq | active_rfi | sources_sought | pre_solicitation | forecast | board_minutes | award_notice | hiring | news | earnings | conference | foia | patent), solicitation_number, title, description, buyer_name, buyer_entity_id (UEI for federal), buyer_sector (federal | state | local | education | healthcare | international | private), naics_codes[], cpv_codes[], set_aside, estimated_value, currency (default USD), posted_date (ISO8601), response_deadline, contract_start, contract_end, incumbent_name, incumbent_contract_number, signal_score (0.0-1.0), decay_applied, effective_score, url, detected_at, matched_account_id, dedup_hash.

**Deduplication Logic**
1. Primary key: solicitation_number (when available). Federal and many SLED solicitations have unique identifiers. If two records share a solicitation_number from different sources, merge and keep the highest-fidelity record.
2. Secondary key: SHA-256 hash of normalized(buyer_name + posted_date + first_100_chars_of_title). Catches duplicates across sources that lack solicitation numbers.
3. Cross-source merge: When the same opportunity appears in SAM.gov (Tier 1) and GovWin (Tier 2), prefer SAM.gov for structured fields (dates, NAICS, set-aside) but retain GovWin for analyst commentary and competitive intelligence.

**Account Matching**
- Federal: Match by UEI (Unique Entity Identifier) via SAM.gov Entity API
- SEC filers: Match by CIK (Central Index Key) via SEC EDGAR
- General: Fuzzy name matching with Levenshtein distance <= 3 or Jaccard similarity >= 0.8 on normalized company names
- DUNS numbers (legacy) should be cross-referenced to UEI where possible [verified 05/2026, SAM.gov -- DUNS to UEI transition completed April 2022]

═══════════════════════════════════════════════════════════
  SECTION 10: SEARCH STRATEGY
═══════════════════════════════════════════════════════════

**Optimal Query Patterns by Source Tier**
- Tier 1 (Federal): SAM.gov /api/opportunities/v2/search?naics={code}&postedFrom={date}&type=o,p,r; USASpending /api/v2/search/spending_by_award/ for incumbent analysis; FPDS Atom feed for contract history
- Tier 2 (SLED): State + commodity code; GovWin "opportunity stage" filter; BidPrime keyword + NAICS + state API
- Tier 3 (International): TED with CPV codes (no official NAICS crosswalk -- use keyword bridging, e.g., NAICS 541512 -> CPV 72000000); CanadaBuys GSIN codes (bilingual EN/FR)
- Tier 4 (Industry): Monitor GPO RFP calendars (Vizient, Premier); search Sourcewell/OMNIA/TIPS contract databases; GSA eBuy for MAS RFQs; SEWP/NITAAC task orders
- Tier 5 (Commercial): RFPDB/FindRFP keyword alerts; Ariba Discovery supplier registration; LinkedIn "RFP" OR "vendor selection" monitoring

**NAICS-to-Keyword Mapping**
NAICS codes are hierarchical (2-digit -> 6-digit). Identify seller's NAICS from SAM.gov registration, extract description keywords, use code for API queries and keywords for unstructured search. Common IT: 541511 (Custom Programming), 541512 (Computer Systems Design), 541519 (Other Computer Related), 518210 (Data Processing/Hosting), 511210 (Software Publishers) [verified 05/2026, Census Bureau NAICS].

**Combining Government + Commercial Signals**
Layer all five tiers + pre-RFP signals (Section 7), score per rubric (Section 8), apply decay, composite, and rank. The most complete account picture comes from convergence across multiple signal types and source tiers.

*End of layer. Update cadence: quarterly aligned with federal fiscal year (Q1 Oct-Dec, Q2 Jan-Mar, Q3 Apr-Jun, Q4 Jul-Sep). Critical re-check triggers: SAM.gov API version changes, TED eForms specification updates, new GWAC awards (SEWP, Alliant, CIO-SP iterations), major procurement regulation changes (FAR amendments), new state eProcurement platform adoptions.*
`,
};

// Required exports for knowledge-lint and the RFP search mechanism
export const RFP_PROCUREMENT_INJECTION = RFP_PROCUREMENT_PLAYBOOK.layerContent;
