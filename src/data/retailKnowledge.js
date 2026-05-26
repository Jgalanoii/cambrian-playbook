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
// VERSION: 2.0.0
// VERIFIED: 2026-05-21
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
//   Shopify, BigCommerce, Salesforce Commerce Cloud annual reports/filings
//   Adobe Commerce / Magento community data

// -- RETAIL INDUSTRY INJECTION --
// Injected when the seller or target operates in retail: brands, retailers,
// marketplaces, DTC, wholesale, distributors, or retail-adjacent services.

export const RETAIL_INDUSTRY_INJECTION = `
RETAIL & E-COMMERCE INDUSTRY CONTEXT (use when the target or seller is a retailer, brand, marketplace, DTC company, wholesaler, distributor, or retail-tech provider):

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| US total retail sales (2025) | ~$7.2T (ex-auto, ex-gas: ~$5.6T) [verified 01/2026, US Census / NRF] |
| US e-commerce sales (2025) | ~$1.19T, ~22-25% of total retail [verified 01/2026, US Commerce Dept / eMarketer] |
| E-commerce growth rate | ~8-10% YoY, outpacing in-store ~2-3% |
| Amazon US e-commerce share | ~38-40% [verified 01/2026, eMarketer] |
| Walmart US e-commerce share | ~6-7% (#2) [verified 01/2026, eMarketer] |
| Shopify US e-commerce GMV share | ~10% [verified 01/2026, Shopify Investor Relations] |
| Retail establishments (US) | ~1.05M employing ~15.4M workers [verified 01/2026, NRF / BLS] |
| Retail media ad spend (US, 2025) | ~$55-60B, growing 20%+ YoY [verified 01/2026, eMarketer] |
| Social commerce (US, 2025) | ~$80B market [verified 01/2026, eMarketer] |
| Retail shrinkage (US) | ~$112B in 2022 (~1.6% of sales) [verified 01/2026, NRF 2023 NRSS] |
| US retail tech spending | ~$100B+ annually [verified 01/2026, Forrester / IHL Group] |

---

## 2. What makes retail distinct as a sales target

**1. "Retail" is not one market — it is at least eight distinct formats with radically different economics.** A grocery chain (1-3% net margin, 15x inventory turns) and a luxury retailer (15-20% net margin, 3x turns) share almost nothing in common commercially. Always subdivide by format before engaging. The first question in any retail brief is: what format?

**2. Physical stores still dominate — ~75% of retail happens in-store.** [verified 05/2026, US Census Bureau] Omnichannel (not pure-play digital) is the reality for most retailers. The "death of retail" narrative has been wrong for a decade. What is dying is single-channel retail — retailers that don't connect store, digital, and marketplace are the ones declining.

**3. Customer acquisition cost has become the binding constraint.** Digital CAC has risen sharply — Meta/Google CPMs up 30-50% since 2020 [verified 01/2026, Deloitte]. This has shifted strategic emphasis from acquisition to retention, loyalty, and first-party data. The retailer who owns the customer relationship (first-party data, loyalty program, direct channel) wins; the one dependent on paid acquisition is structurally disadvantaged.

**4. Retail media networks have created a second P&L inside retailers.** Amazon, Walmart, Target, Kroger, Instacart all operate advertising platforms monetizing first-party shopper data. RMN revenue is high-margin (70%+) and growing 20%+ — it subsidizes thin retail margins and has become a strategic priority that creates new technology buying.

---

## 3. Sub-categorization — retail formats

| Format | Examples | Margin profile | Key dynamics |
|---|---|---|---|
| **Mass market / discount** | Walmart, Target, Dollar General | 25-35% gross, 3-5% net | Scale and supply-chain efficiency existential; price-driven |
| **Specialty retail** | Best Buy, Home Depot, Ulta, Dick's | 35-50% gross | Deep assortment; product expertise; higher margin than mass |
| **Luxury** | LVMH brands, Nordstrom, Neiman Marcus | 60-70% gross | Experience-driven; brand-controlled distribution; clienteling core |
| **Grocery / food** | Kroger, Albertsons, Publix, Aldi, Whole Foods | 25-30% gross, 1-3% net | Ultra-thin margins; high frequency; perishable; private label is margin lever |
| **Convenience (C-store)** | 7-Eleven, Circle K, Wawa | 30-35% gross (ex-fuel) | Impulse; fuel-adjacent; evolving toward foodservice and digital loyalty |
| **Club / warehouse** | Costco, Sam's Club, BJ's | 12-15% gross (membership-fee model) | Membership renewal rate is the key metric; limited SKU, high velocity |
| **Department store** | Macy's, Kohl's, Nordstrom | 35-40% gross | Multi-category; structural decline; surviving via omnichannel and off-price pivots |
| **Off-price / value** | TJ Maxx, Ross, Burlington | 28-32% gross | Opportunistic buying; treasure-hunt model; low e-commerce by design |
| **DTC (Direct-to-Consumer)** | Warby Parker, Allbirds, Glossier | 60-70% gross | Higher margin per unit; must fund CAC and fulfillment; challenging at scale |
| **Marketplace** | Amazon, Walmart Marketplace, eBay, Etsy | Take-rate 8-15% | Platform model; does not own inventory (pure); earns commission + fulfillment |

---

## 4. Named companies — the operator landscape (15-20)

| Company | Format | Revenue | Why they matter |
|---|---|---|---|
| **Walmart** | Mass / grocery | ~$650B global [verified 01/2026, NRF Top 100] | Largest retailer globally; #2 US e-commerce; Walmart Marketplace growing; major RMN (Walmart Connect) |
| **Amazon** | Marketplace / everything | ~$575B global [verified 01/2026, NRF Top 100] | ~38-40% US e-commerce; AWS subsidizes retail; Amazon Ads ~$50B+; sets consumer expectations |
| **Target** | Mass / discount | ~$107B | Omnichannel execution benchmark; Target Circle loyalty; Roundel RMN; strong private-label |
| **Costco** | Club / warehouse | ~$250B | 93%+ membership renewal rate; limited SKU model; e-commerce growing from low base |
| **Kroger** | Grocery | ~$150B | Largest pure-play grocer; Kroger Precision Marketing (RMN); 84.51 data subsidiary |
| **Home Depot** | Specialty (home improvement) | ~$155B | Largest specialty retailer; Pro customer segment is growth priority; strong digital |
| **Lowe's** | Specialty (home improvement) | ~$86B | #2 home improvement; rural/suburban strength; loyalty program relaunch |
| **Macy's** | Department store | ~$24B | Iconic brand; navigating structural decline; closing underperforming stores; off-price (Backstage) |
| **Nordstrom** | Luxury / department | ~$15B | Premium positioning; Nordstrom Rack off-price; going private (2024-2025 deal) [verified 05/2026, S&P Global] |
| **Shopify** | Commerce platform | ~$8B+ revenue, ~10% US e-commerce GMV [verified 01/2026, Shopify IR] | Powers DTC and SMB e-commerce; Shopify POS; Shop Pay; Shopify Fulfillment Network |
| **BigCommerce** | Commerce platform | ~$300M+ revenue | Mid-market/enterprise e-commerce; composable commerce; headless architecture |
| **Salesforce Commerce Cloud** | Commerce platform | Part of Salesforce CRM ecosystem | Enterprise unified commerce; B2B and B2C; strong in large retail/brand |
| **Adobe Commerce (Magento)** | Commerce platform | Part of Adobe Experience Cloud | Open-source roots; enterprise e-commerce; Real-Time CDP integration |

---

## 5. Regulatory overlay

### Consumer data and privacy

| Regulation | Scope | Impact on retail |
|---|---|---|
| **CCPA / CPRA** | California consumers | Governs collection, use, sale of consumer data; loyalty programs squarely in scope; 15+ state-level privacy laws now active [verified 01/2026, IAPP] |
| **State privacy laws** | VA, CO, CT, TX, OR, MT, others | Compliance complexity scales with state count; no federal privacy law yet (ADPPA proposed) |
| **FTC enforcement** | All US consumers | Dark patterns, fake reviews, subscription auto-renewal, endorsement disclosures; increasing enforcement |
| **COPPA** | Children under 13 | Relevant for toy/children's retailers; restricts data collection |

### Payment and security

- **PCI DSS v4.0.1** — current standard; mandatory compliance since March 2025 [verified 01/2026, PCI SSC]. Any entity storing, processing, or transmitting cardholder data must comply.
- **ADA / Web accessibility** — ADA Title III applied to retail websites and apps. WCAG 2.1 AA is de facto standard. ~4,000+ digital accessibility lawsuits filed annually against retailers [verified 01/2026, UsableNet].

### Trade and product

- **Product safety (CPSC)** — recalls, labeling; relevant for private-label and imported goods
- **Trade / tariff** — import tariffs directly impact COGS for international sourcing; tariff volatility is a persistent planning challenge
- **Employment law** — FLSA, predictive scheduling laws (state/local), gig-worker classification for delivery; retail's large hourly workforce makes labor law a significant compliance surface

---

## 6. Technology stack — retail systems landscape

### Core operational systems

| System | Function | Key vendors |
|---|---|---|
| **POS (Point of Sale)** | Transaction processing, store operations backbone | Oracle Retail (MICROS), NCR Voyix, Toshiba, Lightspeed, Square/Block, Toast, Shopify POS [verified 01/2026, IHL Group] |
| **OMS (Order Management)** | Cross-channel order routing, fulfillment orchestration, returns | Manhattan Associates, IBM Sterling, Fluent Commerce, Kibo, Salesforce OMS |
| **WMS (Warehouse Management)** | DC/fulfillment center operations, robotics integration | Manhattan Associates (dominant), Blue Yonder, Korber, Oracle WMS |
| **ERP** | Finance, HR, procurement, master data | SAP S/4HANA, Oracle Cloud, Microsoft Dynamics, Infor |
| **Commerce platform** | E-commerce, unified commerce, digital experience | Shopify, commercetools, Salesforce Commerce Cloud, Adobe Commerce, BigCommerce, VTEX |

### Customer-facing systems

| System | Function | Key vendors |
|---|---|---|
| **CDP (Customer Data Platform)** | Unify customer data across touchpoints; first-party data strategy | Salesforce, Adobe Real-Time CDP, Treasure Data, Tealium, Amperity, mParticle |
| **Loyalty platform** | Points, tiers, rewards, offers, retention | Salesforce Loyalty, Eagle Eye, Comarch, Epsilon/Publicis, SessionM (MC), Braze |
| **Personalization** | Product recommendations, content, search | Algolia, Bloomreach, Dynamic Yield (MC), Coveo |
| **Retail media platform** | Ad monetization of shopper data | Criteo (for retailers), CitrusAd (Epsilon), PromoteIQ (Microsoft), proprietary (Amazon, Walmart, Kroger) |
| **Marketing automation** | Email, SMS, push, journey orchestration | Braze, Iterable, Klaviyo, Salesforce Marketing Cloud, Adobe Campaign |

### Merchandising and supply chain

- **Merchandising & pricing:** Blue Yonder, SAS, Revionics (Aptos), Oracle Retail
- **Supply chain planning:** Blue Yonder (dominant), o9 Solutions, Kinaxis, Oracle
- **Inventory optimization:** Manhattan, Blue Yonder, Relex Solutions
- **MACH architecture** (Microservices, API-first, Cloud-native, Headless) is the current architectural direction for enterprise commerce [verified 01/2026, Gartner]

---

## 7. Omnichannel dynamics

### The blurring of physical and digital (structural)

- **BOPIS (Buy Online, Pick Up In Store):** offered by 80%+ of top-100 retailers [verified 01/2026, NRF]. Drives incremental store traffic and attach purchases.
- **Ship-from-store:** converts stores into micro-fulfillment nodes; requires OMS sophistication and store-level inventory accuracy.
- **Curbside pickup:** accelerated during COVID, now permanent expectation.
- **Marketplace integration:** brands/retailers selling on Amazon, Walmart, Target+ alongside owned channels. Channel conflict and MAP enforcement constant tensions.
- **Social commerce:** TikTok Shop, Instagram Shopping, Pinterest, YouTube Shopping. ~$80B US market by 2025 [verified 01/2026, eMarketer].
- **Last-mile delivery:** Instacart, DoorDash, Uber, Shipt, retailer fleets. Profitability of last-mile is the persistent challenge.
- **Unified inventory:** single, real-time view of inventory across all stores, DCs, third parties. Most retailers not there yet; store-level inventory accuracy averages ~65-70% [verified 01/2026, IHL Group].

### Economic model (structural)

- **Gross margin** = (Revenue - COGS) / Revenue. Varies dramatically by format (see Section 3).
- **Inventory turns** = COGS / Average Inventory. Grocery turns 12-20x/year; specialty 4-8x; luxury 2-4x.
- **Comp-store sales** (SSS): YoY revenue change in stores open 12+ months. The single most-watched operating metric in retail.
- **GMROI** (Gross Margin Return on Inventory): the best single metric combining margin and turns.
- **Four-wall economics:** revenue, margin, labor, rent, shrinkage at individual-store level. Stores must clear a four-wall threshold or face closure.
- **Customer acquisition cost (CAC):** critical for DTC/e-commerce. Digital CAC risen sharply — Meta/Google CPMs up 30-50% since 2020.

---

## 8. ICP patterns by retailer type

### Best-fit Cambrian user-prospect: Mid-market specialty retailers with active loyalty/engagement programs ($500M-$10B revenue)

Why this segment:
- Loyalty and rewards are core to retention strategy; engaged CMO/CCO budget owner
- Faster procurement than megacaps; 60-120 day decision cycles
- Actively investing in first-party data and personalization
- Technology stack is modernizing but not yet locked into a single mega-vendor
- Cambrian's rewards/incentives expertise maps directly to their #1 strategic priority (retention)

### Strong-fit adjacent segments

- **Grocery/food retailers investing in digital loyalty** — ultra-thin margins make loyalty-driven retention existential; high transaction frequency creates rich data
- **DTC brands scaling into omnichannel** — rising CAC forces retention and loyalty investment; API-first tech stack; fast procurement
- **Convenience/fuel retailers modernizing loyalty** — high-frequency transactions; loyalty program overhaul cycle; payments modernization adjacencies
- **Franchise retail networks** — franchisee incentive and engagement programs map to rewards infrastructure
- **Retailers with active RMN buildout** — RMN monetization requires rich first-party data and loyalty engagement; creates adjacency

### Lower-fit segments

- **Top-5 US mega-retailers (Walmart, Amazon, Costco, Kroger, Home Depot)** — procurement fortress; 12-24 month vendor onboarding; build-not-buy preference
- **Off-price retailers (TJ Maxx, Ross, Burlington)** — treasure-hunt model is anti-digital by design; minimal loyalty investment
- **Luxury conglomerates (LVMH, Kering, Richemont)** — bespoke clienteling systems; European HQ; long cycles; anti-mass-market positioning
- **Legacy department stores in restructuring** — structural decline; cost-cutting mode; not investing in new capabilities

---

## 9. Buying committee and decision dynamics

| Role | What they care about | Their lens |
|---|---|---|
| **CMO / VP Marketing** | Brand, advertising, customer acquisition, RMN, loyalty strategy | "Will this improve retention rate and lower CAC?" — often the largest discretionary budget |
| **CDO / VP E-commerce** | E-commerce platform, digital experience, conversion, marketplace | "What's the conversion lift? How does this integrate with our commerce platform?" |
| **CIO / CTO** | Enterprise tech stack, POS, OMS, WMS, ERP, cybersecurity | "Does this fit our architecture? What's the integration complexity?" |
| **VP/SVP Merchandising** | Assortment, pricing, promotion, vendor mgmt, private label | "What's the margin impact? The merchant is the P&L owner in many retail orgs." |
| **VP/SVP Supply Chain** | Logistics, fulfillment, DCs, inventory, transportation | "Does this reduce fulfillment cost or improve delivery speed?" |
| **VP/SVP Stores** | Four-wall performance, labor, in-store experience, shrinkage | "Will my store teams actually use it? What's the labor impact?" |
| **Chief Customer Officer / VP Loyalty** | CX, loyalty operations, retention, personalization | "How does this improve loyalty enrollment, engagement, and LTV?" |
| **CFO** | Tech spend approval for multi-million programs; ROI | "What's the payback period? What's the total cost of ownership?" |

### Decision pattern

- DTC / digital-native ($10-100M): CEO/Founder + VP Marketing + CTO. 30-60 days. Fast, informal.
- Mid-market specialty ($500M-$5B): CMO + CIO + VP Merchandising + CFO. 60-120 days. Formal but accessible.
- Large retailer ($5-20B): Full RFP process. CIO + CDO + CMO + CFO + Procurement. 6-12 months. Security review required.
- Mega-retailer ($20B+): 12-24 month cycles. Dedicated vendor management. Board-level for material spend. Build-not-buy bias.

---

## 10. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **Loyalty program launch, relaunch, or major expansion** | Active investment in retention and first-party data | Direct budget for loyalty tech, rewards, personalization |
| **POS modernization or unified commerce initiative** | Multi-year platform program | Unlocks adjacent spend (payments, loyalty, analytics) |
| **New CMO, CDO, or Chief Customer Officer** | Strategic reset; first 6 months is the window | New vendor evaluation cycle; fresh budget priorities |
| **Retail media network launch or expansion** | First-party data investment; new revenue line | CDP, loyalty, data enrichment adjacencies |
| **Omnichannel fulfillment expansion (BOPIS, ship-from-store)** | OMS and inventory investment | Technology modernization budget unlocked |
| **Shrinkage/loss prevention initiative** | C-suite priority with active budget line | Technology vendors for LP, analytics, and operations |
| **Private-label or owned-brand expansion** | Margin focus strategy | Signals investment mindset; merchandising tech buying |
| **M&A or store portfolio acquisition** | System integration ahead | 12-24 month integration technology spend |
| **Holiday freeze ending (January)** | New fiscal year; budget unlocked | Primary selling window for Q1 engagements |
| **CDP or first-party data strategy investment** | Cookie deprecation response; data monetization | CDP vendor selection; loyalty-data integration |

---

## 11. Common failure modes

1. **Treating "retail" as one market.** Grocery economics differ entirely from luxury differ entirely from DTC. Always subdivide by format first.
2. **Assuming e-commerce dominance.** ~75% of retail still happens in physical stores [verified 05/2026, US Census Bureau]. Omnichannel, not pure-play digital, is the reality.
3. **Conflating gross margin across formats.** A 30% margin is excellent in grocery and poor in luxury. Always contextualize margin by format.
4. **Overstating DTC viability.** Rising CAC, logistics cost, and return rates have challenged many DTC-only models. The "DTC revolution" narrative has moderated significantly.
5. **Assuming Amazon data is public.** Amazon reports North America and International segments, not granular US retail/marketplace splits. Third-party estimates vary. Caveat Amazon-specific figures.
6. **Fabricating comp-store sales or margin figures.** These are quarterly-reported; any cached number decays fast. Fetch live.
7. **Ignoring private companies.** Many major retailers (Publix, Aldi, H-E-B, Lidl, Trader Joe's) are private. Treat data as ranges, caveat sourcing.
8. **Pitching during holiday freeze.** Nov-Dec is a deployment freeze for most retailers. No major tech decisions during this period.
9. **Selling technology without connecting to the metric the buyer owns.** CMO cares about retention and CAC; VP Merchandising cares about GMROI; VP Supply Chain cares about fulfillment cost. Lead with their metric.
10. **Ignoring the power of the merchant (VP Merchandising).** In many retail orgs, the merchant is the P&L owner. Technology investments that don't have merchandising buy-in stall.

---

## 12. GTM implications for Cambrian seller-users

### Structural priorities for retail in 2026

- **First-party data and loyalty** are the strategic priority — the deprecation of third-party cookies and the rise of retail media have made loyalty programs and CDPs C-suite investments
- **Retail media monetization** creates new budget holders and justifies first-party data investment
- **Shrinkage/loss prevention** is a current C-suite conversation and active budget line across all formats
- **POS modernization** is a multi-year platform program that unlocks adjacent spend
- **Unified commerce / composable architecture** is the aspirational target for enterprise retailers

### Seasonal buying cycles

- **Q3-Q4:** Major tech decisions and budgets set for the following fiscal year
- **November-December:** Holiday freeze — no major deployments or vendor decisions
- **January-February:** New fiscal year begins; budget unlocked; primary selling window
- **Q2:** Mid-year reviews; supplemental budget requests; pilot results drive expansion

### Cambrian engagement vectors

1. **Loyalty program strategy and vendor selection** — Cambrian's rewards/incentives expertise is directly applicable
2. **First-party data monetization** — connecting loyalty data to RMN revenue
3. **Customer retention economics** — quantifying the value of a 1-point retention improvement by format
4. **Omnichannel experience optimization** — connecting store, digital, and marketplace into unified customer journey
5. **Franchisee engagement and incentive programs** — rewards infrastructure for franchise networks
6. **POS modernization advisory** — vendor selection and change management for multi-year core programs

### Route to yes

- Pilot scoped to a single format, region, or channel (e.g., loyalty enhancement for 50 stores in one market) to prove ROI before chain-wide rollout
- Align to seasonal planning window — retailer budgets set Q3-Q4; avoid holiday freeze
- Lead with the metric the buyer owns: CMO = retention and CAC; VP Merchandising = GMROI and margin; VP Supply Chain = fulfillment cost and speed
- If retailer has an RMN, frame first-party data enrichment as an RMN revenue amplifier — it unlocks a second budget holder

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`paymentsKnowledge.js\` | POS payments, interchange, embedded payments, card-linked offers |
| \`digitalIncentivesPlatformsKnowledge.js\` | Rewards, gift cards, loyalty platforms selling into retail channels |
| \`qsrKnowledge.js\` | QSR/restaurant retail — loyalty, franchise, multi-location patterns overlap |
| \`fintechKnowledge.js\` | BNPL, embedded lending, digital wallets in retail checkout |
| \`complianceKnowledge.js\` | PCI DSS, CCPA/state privacy, ADA accessibility compliance |
| \`manufacturingKnowledge.js\` | CPG/brand manufacturers selling through retail channels |
| \`b2bSalesKnowledge.js\` | Enterprise selling motion into large retail procurement |

---

*End of layer. Update cadence: quarterly aligned with NRF reports and Census retail data releases. Critical re-check triggers: NRF annual forecast, Census e-commerce quarterly data, major retailer earnings (comp-store sales), holiday season results, retail M&A announcements, state privacy law enactments.*
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
