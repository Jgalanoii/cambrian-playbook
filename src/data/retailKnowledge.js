// src/data/retailKnowledge.js
//
// U.S. Retail & E-commerce industry knowledge layer — brands, retailers,
// marketplaces, DTC, wholesale, distributors, omnichannel operations,
// and the consumer-facing technology stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_RETAIL (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// VERSION: 1.0.0
// VERIFIED: 2026-05-20
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   US Census Bureau, Monthly Retail Trade Survey (2026):
//     census.gov/retail
//   NRF (National Retail Federation), State of Retail & the Consumer (2026):
//     nrf.com/research
//   eMarketer / Insider Intelligence, US Retail & E-commerce Forecast (2026):
//     insiderintelligence.com/content/us-retail-ecommerce-forecast
//   Statista, Retail & E-commerce in the United States (2026):
//     statista.com/outlook/emo/ecommerce/united-states
//   US Department of Commerce, Quarterly Retail E-Commerce Sales (Q4 2025):
//     census.gov/retail/mrts/www/data/pdf/ec_current.pdf
//   McKinsey & Company, The State of Retail (2026):
//     mckinsey.com/industries/retail
//   Deloitte, Retail Industry Outlook (2026):
//     deloitte.com/us/en/industries/retail-distribution.html
//   Forrester, US Retail Tech Spend Forecast (2026):
//     forrester.com/research
//   IHL Group, POS/Retail IT Market Study (2025/2026):
//     ihlservices.com
//   Gartner, Market Guide for Unified Commerce Platforms (2025):
//     gartner.com
//   FTC, Consumer Protection & Privacy Reports (ongoing):
//     ftc.gov/enforcement
//   PCI Security Standards Council, PCI DSS v4.0.1 (2025):
//     pcisecuritystandards.org

// -- RETAIL INDUSTRY INJECTION --
// Injected when the seller or target operates in retail: brands, retailers,
// marketplaces, DTC, wholesale, distributors, or retail-adjacent services.

export const RETAIL_INDUSTRY_INJECTION = `
RETAIL & E-COMMERCE INDUSTRY CONTEXT (use when the target or seller is a retailer, brand, marketplace, DTC company, wholesaler, distributor, or retail-tech provider):

VALUE CHAIN -- WHO MAKES, WHO SELLS, WHO FULFILLS (structural):
- BRAND / MANUFACTURER: creates the product, owns the brand equity, sets MSRP. May sell direct (DTC), wholesale to retailers, or both. Increasingly going DTC to capture margin and first-party data.
- RETAILER: buys from brands/wholesalers, curates assortment, merchandises, sells to consumers. Owns the store footprint and/or e-commerce site. Earns gross margin on the buy-sell spread.
- MARKETPLACE: platform connecting third-party sellers with consumers. Earns take-rate (commission + fulfillment fees). Amazon, Walmart Marketplace, eBay, Shopify-powered storefronts. Does not own inventory (in pure marketplace model).
- DTC (Direct-to-Consumer): brand sells directly via owned channels (website, owned stores, social). Higher margin per unit but must fund customer acquisition and fulfillment.
- WHOLESALE / DISTRIBUTOR: aggregates products from many brands, sells in bulk to retailers. Operates on thin margins (2-8%), high volume. Logistics and credit-extension are core value.
- FRANCHISE: brand licenses its model; franchisee owns and operates locations. Split economics (royalty + ad fund fees). Technology decisions are partly centralized, partly franchisee-driven.

RETAIL FORMATS -- NOT ONE MARKET (structural -- subdivide first):
- MASS MARKET / DISCOUNT: Walmart, Target, Dollar General. High volume, low margin, price-driven. Scale and supply-chain efficiency are existential.
- SPECIALTY RETAIL: category-focused (Best Buy, Home Depot, Ulta, Dick's). Deep assortment, product expertise, often higher margin than mass.
- LUXURY: LVMH brands, Nordstrom, Neiman Marcus. High margin, low volume, experience-driven, brand-controlled distribution. Clienteling and personalization are core.
- GROCERY / FOOD RETAIL: Kroger, Albertsons, Publix, Aldi, Whole Foods. Ultra-thin margins (1-3%), high frequency, perishable inventory, loyalty-program-driven. Private label is a margin lever.
- CONVENIENCE (C-STORE): 7-Eleven, Circle K, Wawa. Impulse, fuel-adjacent, high transaction frequency, low ticket. Evolving toward foodservice and digital loyalty.
- CLUB / WAREHOUSE: Costco, Sam's Club, BJ's. Membership-fee economics, limited SKU count, high velocity, bulk format. Membership renewal rate is the key metric.
- DEPARTMENT STORE: Macy's, Kohl's, Nordstrom. Multi-category, in decline structurally; surviving via omnichannel and off-price pivots.
- OFF-PRICE / VALUE: TJ Maxx, Ross, Burlington. Opportunistic buying, treasure-hunt model, low e-commerce penetration by design.

ECONOMIC MODEL -- MARGIN, TURNS, AND COMP-STORE SALES (structural):
- GROSS MARGIN = (Revenue - COGS) / Revenue. Varies dramatically by format: luxury 60-70%, specialty 35-50%, mass/discount 25-35%, grocery 25-30%, convenience 30-35% (ex-fuel).
- INVENTORY TURNS = COGS / Average Inventory. Grocery turns 12-20x/year; specialty 4-8x; luxury 2-4x. Higher turns = less working-capital tied up, less markdown risk.
- COMP-STORE SALES (same-store sales / SSS): YoY revenue change in stores open 12+ months. The single most-watched operating metric in retail -- isolates organic growth from new-store openings.
- GMROI (Gross Margin Return on Inventory): Gross Margin $ / Average Inventory $. Measures how many gross-margin dollars generated per dollar of inventory invested. Best single metric combining margin and turns.
- SHRINKAGE: inventory loss from theft (internal + external), damage, administrative error, and vendor fraud. US retail shrinkage ~$112B in 2022 (~1.6% of sales) [verified 01/2026, NRF 2023 National Retail Security Survey]. Organized retail crime (ORC) has driven shrinkage increases and is a C-suite priority.
- FOUR-WALL ECONOMICS: revenue, margin, labor, rent, shrinkage at the individual-store level. Stores must clear a four-wall contribution threshold or face closure.
- CUSTOMER ACQUISITION COST (CAC): especially critical for DTC/e-commerce. Digital CAC has risen sharply -- Meta/Google CPMs up 30-50% since 2020 [verified 01/2026, Deloitte]. Retention and loyalty spend is the counter-strategy.

MARKET STRUCTURE & SIZE (cyclical -- dated):
- US total retail sales ~$7.2T in 2025 (ex-auto, ex-gas: ~$5.6T) [verified 01/2026, US Census / NRF].
- US e-commerce sales ~$1.19T in 2025, representing ~22-25% of total retail (narrower definitions ex-food/auto push this higher) [verified 01/2026, US Commerce Dept / eMarketer]. E-commerce growth ~8-10% YoY, outpacing in-store ~2-3%.
- Amazon accounts for ~38-40% of US e-commerce [verified 01/2026, eMarketer]. Walmart is the #2 e-commerce player (~6-7% share) and gaining. Shopify powers ~10% of US e-commerce by GMV.
- Top 10 US retailers by revenue: Walmart (~$650B global), Amazon (~$575B global), Costco (~$250B), Kroger (~$150B), Walgreens, Home Depot, Target, CVS, Lowe's, Albertsons [verified 01/2026, NRF Top 100]. Massive concentration at the top.
- ~1.05M retail establishments in the US employing ~15.4M workers [verified 01/2026, NRF / BLS]. Retail is the nation's largest private-sector employer.
- Retail media networks (RMNs) have become a major revenue line: US retail media ad spend ~$55-60B in 2025, growing 20%+ YoY [verified 01/2026, eMarketer]. Amazon, Walmart, Instacart, Kroger, Target all operate ad platforms monetizing first-party shopper data.

TECHNOLOGY LANDSCAPE (structural categories + dated vendor facts):
- POINT OF SALE (POS): the operational backbone of physical retail. Modern cloud POS replaces legacy on-premise terminals. Key vendors: Oracle Retail (MICROS), NCR Voyix, Toshiba, Lightspeed, Square/Block, Toast (restaurant-adjacent), Shopify POS. POS modernization is a multi-year program and a master buying trigger.
- ORDER MANAGEMENT SYSTEM (OMS): orchestrates orders across channels -- routes to optimal fulfillment node (store, DC, vendor), manages inventory promises, returns. Manhattan Associates, IBM Sterling, Fluent Commerce, Kibo, Salesforce OMS. Critical for omnichannel.
- WAREHOUSE MANAGEMENT SYSTEM (WMS): manages DC/fulfillment center operations. Manhattan Associates (dominant), Blue Yonder (JDA legacy), Körber, Oracle WMS. Increasingly includes robotics integration (Locus, 6 River Systems, Symbotic).
- CUSTOMER DATA PLATFORM (CDP) / CRM: unifies customer data across touchpoints. Salesforce, Adobe Real-Time CDP, Treasure Data, Tealium, Amperity, mParticle. Retailers investing heavily in first-party data as third-party cookies deprecate.
- LOYALTY PLATFORMS: manage points, tiers, rewards, offers. Salesforce Loyalty, Eagle Eye, Comarch, Epsilon/Publicis, SessionM (Mastercard), Braze (engagement + loyalty). Loyalty is the #1 retention lever -- nearly all top retailers have a program.
- UNIFIED COMMERCE / COMMERCE PLATFORM: single platform spanning e-commerce, POS, OMS, inventory. Shopify, commercetools, Salesforce Commerce Cloud, Adobe Commerce (Magento), BigCommerce, VTEX. Composable/MACH architecture (Microservices, API-first, Cloud-native, Headless) is the current architectural direction [verified 01/2026, Gartner].
- MERCHANDISING & PRICING: assortment planning, price optimization, promotion management. Blue Yonder, SAS, Revionics (Aptos), Oracle Retail.
- SUPPLY CHAIN PLANNING: demand forecasting, replenishment, allocation. Blue Yonder (dominant), o9 Solutions, Kinaxis, Oracle.
- US retail tech spending ~$100B+ annually [verified 01/2026, Forrester / IHL Group], with e-commerce, supply chain, and data/analytics as the top investment priorities.

OMNICHANNEL DYNAMICS -- THE BLURRING OF PHYSICAL AND DIGITAL (structural):
- BOPIS (Buy Online, Pick Up In Store): now offered by 80%+ of top-100 retailers [verified 01/2026, NRF]. Drives incremental store traffic and attach purchases.
- SHIP-FROM-STORE: converts stores into micro-fulfillment nodes to shorten delivery time and reduce shipping cost. Requires OMS sophistication and store-level inventory accuracy.
- CURBSIDE PICKUP: accelerated during COVID, now a permanent expectation.
- MARKETPLACE INTEGRATION: brands/retailers selling on Amazon, Walmart, Target+, etc. alongside owned channels. Channel conflict and MAP (Minimum Advertised Price) enforcement are constant tensions.
- SOCIAL COMMERCE: TikTok Shop, Instagram Shopping, Pinterest, YouTube Shopping. ~$80B US market by 2025 [verified 01/2026, eMarketer]. Emerging but growing rapidly.
- LAST-MILE DELIVERY: Instacart, DoorDash, Uber, Shipt, retailers' own fleets. Profitability of last-mile is the persistent challenge.
- UNIFIED INVENTORY: the holy grail -- a single, real-time view of inventory across all stores, DCs, and third-party locations. Most retailers are not there yet; inventory accuracy at store level averages ~65-70% [verified 01/2026, IHL Group].

BUYER-ROLE TAXONOMY (structural -- who owns budget):
- Chief Marketing Officer (CMO): brand, advertising, customer acquisition, retail media, loyalty program strategy. Often the largest discretionary budget.
- Chief Digital Officer (CDO) / VP E-commerce: e-commerce platform, digital experience, conversion optimization, marketplace strategy.
- Chief Information Officer (CIO) / Chief Technology Officer (CTO): enterprise tech stack, POS, OMS, WMS, ERP, data infrastructure, cybersecurity.
- VP / SVP Merchandising: assortment, pricing, promotion, vendor management, private label. The merchant is the P&L owner in many retail orgs.
- VP / SVP Supply Chain: logistics, fulfillment, distribution centers, inventory management, transportation.
- VP / SVP Stores / Store Operations: four-wall performance, labor, in-store experience, shrinkage.
- Chief Customer Officer / VP Loyalty: customer experience, loyalty program operations, retention, personalization.
- CFO: increasingly involved in tech spend approval, especially for multi-million-dollar platform programs.

REGULATORY LANDSCAPE (structural -- durable):
- CCPA / STATE PRIVACY LAWS: California Consumer Privacy Act (CCPA/CPRA) and 15+ state-level privacy laws (Virginia, Colorado, Connecticut, Texas, Oregon, etc.) govern collection, use, and sale of consumer data. Retailers with loyalty programs and CDPs are squarely in scope. No federal privacy law yet, but proposed (ADPPA). Compliance complexity scales with state count.
- PCI DSS (Payment Card Industry Data Security Standard): v4.0.1 is current [verified 01/2026, PCI SSC]. Any entity that stores, processes, or transmits cardholder data must comply. Non-compliance = fines, breach liability, and potential loss of card-acceptance privileges. PCI DSS v4.0 mandatory compliance deadline was March 2025.
- FTC (Federal Trade Commission): enforces consumer protection, advertising truth-in-labeling, endorsement disclosures, children's privacy (COPPA), and unfair/deceptive practices. FTC has increased enforcement on dark patterns, fake reviews, and subscription auto-renewal practices.
- ADA / WEB ACCESSIBILITY: ADA Title III has been applied to retail websites and apps. WCAG 2.1 AA is the de facto standard. Lawsuit volume is high -- ~4,000+ digital accessibility lawsuits filed annually against retailers [verified 01/2026, UsableNet].
- PRODUCT SAFETY (CPSC): Consumer Product Safety Commission regulates product recalls, labeling. Relevant for private-label and imported goods.
- TRADE / TARIFF: import tariffs and trade policy directly impact COGS for retailers sourcing internationally. Tariff volatility is a persistent planning challenge.
- EMPLOYMENT LAW: Fair Labor Standards Act, predictive scheduling laws (state/local), gig-worker classification for delivery. Retail's large hourly workforce makes labor law a significant compliance surface.

KNOWN TRAPS -- COMMON HALLUCINATION / REASONING ERRORS:
- Treating "retail" as one market -- grocery economics differ entirely from luxury differ entirely from DTC. Always subdivide by format first.
- Assuming e-commerce dominance -- ~75% of retail still happens in physical stores. Omnichannel, not pure-play digital, is the reality for most retailers.
- Conflating gross margin across formats -- a 30% margin is excellent in grocery and poor in luxury. Always contextualize margin by format.
- Overstating DTC viability -- rising CAC, logistics cost, and return rates have challenged many DTC-only models. The "DTC revolution" narrative has moderated significantly.
- Assuming Amazon data is public -- Amazon reports North America and International segments, not granular US retail/marketplace splits. Third-party estimates (eMarketer, Marketplace Pulse) vary. Caveat Amazon-specific figures.
- Fabricating comp-store sales or margin figures for specific retailers -- these are quarterly-reported; any cached number decays fast. Fetch live.
- Ignoring private companies -- many major retailers (Publix, Aldi, H-E-B, Lidl, Trader Joe's) are private. Treat data as ranges, caveat sourcing.

GTM IMPLICATIONS (structural):
- Subdivide by format before selling: mass, specialty, luxury, grocery, convenience, club, DTC are different ICPs with different economics, buyers, and tech stacks.
- Margin structure determines budget: grocery/mass retailers scrutinize every dollar (thin margins); luxury/specialty have more discretionary spend.
- Omnichannel is the master buying trigger -- any initiative that promises unified inventory, faster fulfillment, or seamless cross-channel experience opens budget.
- Loyalty and first-party data are the strategic priority -- the deprecation of third-party cookies and the rise of retail media have made loyalty programs and CDPs C-suite investments.
- Shrinkage/loss prevention is a current C-suite conversation and an active budget line.
- POS modernization is a multi-year platform program that unlocks adjacent spend (payments, loyalty, analytics, unified commerce).
- Seasonal buying cycles matter: major tech decisions and budgets are set in Q3-Q4 for the following fiscal year. Holiday (Nov-Dec) is a freeze period for most retailers -- no major deployments.
- Store operations leaders are powerful but often underleveraged -- they control labor, shrinkage, and four-wall economics.
`;

// -- RETAIL SCORING CONTEXT --
// Calibrates ICP fit scoring when target/seller is retail-adjacent.
// Bands conform to the normalized scale: Strong Fit 65+, Potential 40-64,
// Poor <40.

export const RETAIL_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Mid-market specialty retailers with active loyalty/engagement programs", avgFit: "65-75%", reason: "Loyalty and rewards are core to retention strategy; engaged CMO/CCO budget owner; faster procurement than megacaps" },
    { segment: "Grocery/food retailers investing in digital loyalty and personalization", avgFit: "60-70%", reason: "Ultra-thin margins make loyalty-driven retention existential; high transaction frequency creates rich data; active investment cycle" },
    { segment: "DTC brands scaling beyond pure-play into omnichannel", avgFit: "60-70%", reason: "Rising CAC forces retention and loyalty investment; API-first tech stack; fast procurement cycles" },
    { segment: "Convenience/fuel retailers modernizing loyalty and payments", avgFit: "55-65%", reason: "High-frequency transactions, loyalty program overhaul cycle, payments modernization creates adjacencies" },
    { segment: "Franchise retail networks with franchisee engagement needs", avgFit: "55-65%", reason: "Franchisee incentive and engagement programs map to rewards infrastructure; distributed decision-making creates complexity but budget" },
    { segment: "Retailers with active retail media network (RMN) buildout", avgFit: "50-60%", reason: "RMN monetization requires rich first-party data and loyalty engagement -- creates adjacency for incentive/reward capabilities" },
  ],
  highFrictionSegments: [
    { segment: "Top-5 US mega-retailers (Walmart, Amazon, Costco, Kroger, Home Depot scale)", avgFit: "15-25%", reason: "Procurement fortress; 12-24 month vendor onboarding; massive internal teams; build-not-buy preference at scale" },
    { segment: "Off-price retailers (TJ Maxx, Ross, Burlington)", avgFit: "15-25%", reason: "Treasure-hunt model is anti-digital by design; minimal e-commerce; low loyalty-program investment; razor-thin tech spend" },
    { segment: "Luxury conglomerates (LVMH, Kering, Richemont)", avgFit: "20-30%", reason: "Brand-controlled distribution; bespoke clienteling systems; European HQ procurement; long cycles; anti-mass-market positioning" },
    { segment: "Legacy department stores in restructuring", avgFit: "20-30%", reason: "Structural decline, cost-cutting mode, reduced tech budgets, survival-focused -- not investing in new capabilities" },
  ],
  keySignals: {
    positive: [
      "Loyalty program launch, relaunch, or major expansion announced",
      "POS modernization or unified commerce platform initiative",
      "Omnichannel fulfillment expansion (BOPIS, ship-from-store, curbside)",
      "CDP or first-party data strategy investment",
      "Retail media network launch or expansion",
      "New CMO, CDO, or Chief Customer Officer (first 6 months)",
      "Shrinkage/loss prevention technology initiative",
      "Private-label or owned-brand expansion (signals margin focus)",
      "Customer retention, NPS, or engagement program under active investment",
      "Membership or subscription program launch (loyalty monetization)",
    ],
    negative: [
      "Locked into incumbent loyalty/engagement vendor with long contract",
      "Mid-POS or mid-ERP replacement (all budget and attention absorbed)",
      "Active restructuring, bankruptcy, or mass store closures",
      "Holiday freeze period (Nov-Dec for most retailers)",
      "Off-price or treasure-hunt model with no digital loyalty investment",
      "Mega-retailer with build-not-buy preference and 18+ month procurement",
    ],
  },
};

// -- RETAIL DISCOVERY QUESTIONS --
// Injected into discovery question generation for retail-vertical accounts.
// Organized by RIVER stage.

export const RETAIL_DISCOVERY_INJECTION = `
RETAIL & E-COMMERCE DISCOVERY ANGLES (use when the prospect is a retailer, brand, marketplace, DTC company, or retail-tech provider):

REALITY stage -- current state:
- What retail format(s) do you operate -- mass, specialty, luxury, grocery, convenience, club, DTC -- and which is your growth priority?
- What does your technology stack look like today -- POS, OMS, WMS, commerce platform, CDP/CRM, loyalty -- and where are you in any modernization roadmap?
- How do you sell today -- owned stores, e-commerce, marketplace (Amazon/Walmart/etc.), wholesale -- and how is the channel mix shifting?
- What does your loyalty or customer engagement program look like today, and how are you collecting and activating first-party data?
- How are you handling omnichannel fulfillment -- BOPIS, ship-from-store, curbside, last-mile -- and what's working vs. creating friction?

IMPACT stage -- quantify the cost:
- What's your current customer retention rate, and what does a 1-point improvement in retention translate to in revenue and margin?
- What does customer acquisition cost look like across channels, and how has it trended over the past 2-3 years?
- What's your shrinkage rate, and what's the annual dollar impact of inventory loss?
- Where are the biggest margin leaks in your fulfillment and returns operations?
- How much revenue are you leaving on the table from out-of-stocks or inventory misallocation across channels?

VISION stage -- frame the future:
- If you could redesign the customer experience across all touchpoints, what would unified commerce look like for your brand?
- What's your roadmap for first-party data, personalization, and retail media monetization?
- How are you thinking about loyalty as a strategic asset -- beyond points and discounts -- to drive lifetime value and differentiation?
- What role do you see AI/ML playing in merchandising, pricing, demand forecasting, or customer engagement in the next 2-3 years?

ENTRY POINTS -- who owns what:
- CMO / VP Marketing (brand, advertising, customer acquisition, loyalty strategy, retail media)
- CDO / VP E-commerce (digital platform, conversion, marketplace strategy)
- CIO / CTO (enterprise tech stack, POS, OMS, WMS, data infrastructure)
- VP / SVP Merchandising (assortment, pricing, promotion, vendor management -- the P&L owner)
- VP / SVP Supply Chain (logistics, fulfillment, distribution, inventory)
- VP / SVP Stores (four-wall performance, labor, in-store experience, shrinkage)
- Chief Customer Officer / VP Loyalty (CX, loyalty operations, retention, personalization)

ROUTE -- fastest path to yes:
- Pilot scoped to a single format, region, or channel (e.g., loyalty enhancement for 50 stores in one market) to prove ROI before chain-wide rollout.
- Align to a seasonal planning window -- retailer budgets are set Q3-Q4; avoid pitching during holiday freeze (Nov-Dec).
- Lead with the metric the buyer owns: CMO cares about retention and CAC; VP Merchandising cares about GMROI and margin; VP Supply Chain cares about fulfillment cost and speed.
- If the retailer has a retail media network, frame first-party data enrichment as an RMN revenue amplifier -- it unlocks a second budget holder.
`;
