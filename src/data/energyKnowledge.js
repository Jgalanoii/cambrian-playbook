// src/data/energyKnowledge.js
//
// U.S. Energy & Utilities industry knowledge layer — power generation,
// transmission & distribution, renewables, oil & gas, grid modernization,
// energy storage, EV charging, hydrogen, carbon capture, and the full
// energy transition stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_ENERGY (populated by fetchKnowledgeLayer()).
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
//   EIA (U.S. Energy Information Administration):
//     eia.gov
//   IEA (International Energy Agency):
//     iea.org
//   FERC (Federal Energy Regulatory Commission):
//     ferc.gov
//   NERC (North American Electric Reliability Corporation):
//     nerc.com
//   Wood Mackenzie:
//     woodmac.com
//   BloombergNEF:
//     about.bnef.com
//   S&P Global Commodity Insights:
//     spglobal.com/commodityinsights
//   Lazard LCOE (Levelized Cost of Energy Analysis):
//     lazard.com/perspective/lcoe
//   DOE (U.S. Department of Energy):
//     energy.gov
//   NREL (National Renewable Energy Laboratory):
//     nrel.gov
//   Utility Dive:
//     utilitydive.com
//   Canary Media:
//     canarymedia.com
//   GTM (Greentech Media, now part of Wood Mackenzie):
//     greentechmedia.com

export const ENERGY_PLAYBOOK = {
  name: "Energy & Utilities",
  keywords: [
    "energy", "utilities", "solar", "wind", "natural gas", "oil & gas",
    "renewable", "grid", "transmission", "distribution", "nuclear",
    "hydrogen", "carbon capture", "EV charging", "ERCOT", "CAISO",
    "PJM", "NERC", "FERC", "IRA", "clean energy", "microgrid",
    "battery storage", "SCADA", "DER", "ESG", "decarbonization",
    "power generation", "midstream", "upstream", "downstream", "LNG",
    "utility-scale", "C&I solar", "community solar", "virtual power plant",
    "demand response", "energy storage", "offshore wind", "onshore wind",
    "smart grid", "smart meter", "AMI", "net metering", "rate case",
    "integrated resource plan", "IRP", "RPS", "clean energy standard",
    "interconnection queue", "power purchase agreement", "PPA",
    "CCUS", "carbon pricing", "emissions", "scope 1", "scope 2",
    "energy transition", "electrification", "heat pump", "grid edge",
    "distributed energy", "capacity market", "ancillary services",
    "energy trading", "ETRM", "ISO", "RTO",
  ],
  personas: [
    "VP Operations", "Chief Sustainability Officer", "VP Grid Operations",
    "Director of Procurement", "CTO", "VP Renewable Development",
    "Director of Asset Management", "VP Regulatory Affairs",
    "Head of Digital Transformation", "Chief Commercial Officer",
    "VP Power Trading", "VP Transmission Planning",
    "Director of Distribution Engineering", "VP Generation",
    "Head of Energy Storage", "Director of Distributed Energy Resources",
    "VP Strategy & Corporate Development", "Chief Risk Officer",
    "VP Environmental Compliance", "Director of Grid Modernization",
  ],
  discovery: [
    "Where are you in your decarbonization or energy transition roadmap -- what's been committed, what's under evaluation, and what's the timeline for next resource procurement?",
    "How is your organization approaching grid modernization and distributed energy resource integration -- and where are the biggest operational or technology gaps?",
    "What does your current technology stack look like for asset management, grid operations, and energy trading -- and how many legacy systems are you managing across those functions?",
    "How are regulatory drivers (IRA tax credits, state RPS mandates, rate case outcomes) shaping your capital investment priorities over the next 3-5 years?",
    "What's your biggest pain point around interconnection queue management, permitting timelines, or bringing new generation assets online?",
    "How are you thinking about the convergence of electrification (EVs, heat pumps, data centers) and grid capacity planning -- what keeps you up at night on load growth?",
    "What role does data analytics, AI, or digital twin technology play in your operations today -- and where do you see the biggest opportunity to improve reliability or reduce cost?",
  ],
  disqualifiers: [
    "No understanding of regulated vs. deregulated market structures and how they affect procurement authority and decision timelines",
    "Pitching technology without addressing utility commission approval requirements or rate recovery mechanisms",
    "Treating all utilities the same -- IOUs, munis, co-ops, and competitive generators have fundamentally different buying processes and incentive structures",
    "No awareness of the prospect's integrated resource plan (IRP) cycle or current rate case status",
    "Ignoring NERC CIP compliance requirements when selling OT/grid technology to utilities",
    "Proposing solutions without understanding the prospect's ISO/RTO market participation and wholesale market dynamics",
  ],
  triggerEvents: [
    "IRA tax credit guidance updates or new bonus credit qualifications (domestic content, energy community, low-income)",
    "Major grid reliability event or extreme weather incident (derecho, polar vortex, hurricane, wildfire) affecting the prospect's service territory",
    "State legislature passes or updates Renewable Portfolio Standard (RPS) or Clean Energy Standard (CES) with new compliance deadlines",
    "Utility files or receives approval on a new Integrated Resource Plan (IRP) with significant renewable or storage procurement targets",
    "FERC issues new interconnection reform rules or the prospect's ISO/RTO clears a major interconnection queue backlog",
    "Utility M&A announcement triggering technology stack consolidation and operational integration",
    "New rate case filing or approval that includes grid modernization capital investment authorization",
    "Data center load growth announcement in the prospect's service territory creating urgent capacity planning needs",
  ],
  layerContent: `---
title: "Energy & Utilities --- Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_ai_ml_knowledge_layer.md
  - cambrian_b2b_sales_value_creation.md
  - cambrian_compliance_knowledge.md
  - cambrian_manufacturing_knowledge.md
  - cambrian_pe_holdco_knowledge.md
tags: [energy, utilities, solar, wind, grid, renewables, oil-gas, storage, hydrogen, CCUS, FERC, NERC, IRA, DER, SCADA, decarbonization, EV-charging, power-generation, LNG, energy-transition]
last_updated: 2026-05-26
status: production
confidence: high (EIA 2025-2026; IEA World Energy Outlook 2025; FERC filings; NERC reliability assessments; BloombergNEF 2026; Wood Mackenzie; S&P Global Commodity Insights; Lazard LCOE v17; DOE/NREL)
---

# Energy & Utilities --- Knowledge Layer

> **Working thesis.** U.S. electricity generation capacity is ~1,300 GW with ~$150B+ in annual utility capital expenditure [verified 05/2026, EIA]. The Inflation Reduction Act (IRA) has unlocked an estimated $370B+ in energy and climate incentives over 10 years, fundamentally reshaping investment flows toward clean energy, storage, hydrogen, and CCUS [verified 05/2026, DOE]. Global energy transition investment exceeded $1.8T in 2024, with renewables, storage, and electrification accounting for the majority [verified 05/2026, BloombergNEF]. **The dominant 2026 dynamics are: (a) massive renewable and storage buildout driven by IRA economics; (b) grid reliability stress from extreme weather, load growth (data centers, EVs, electrification), and aging infrastructure; (c) interconnection queue reform as the critical bottleneck — over 2,600 GW sit in U.S. interconnection queues [verified 05/2026, Lawrence Berkeley National Lab]; (d) the convergence of decarbonization mandates and reliability imperatives; (e) utility-scale storage becoming economically competitive and grid-essential; and (f) the emergence of hydrogen, CCUS, and advanced nuclear as next-wave technologies.** For Cambrian's seller-users, energy is a vertical with massive capex budgets, long procurement cycles, regulatory complexity, and a generational technology transition underway.

> **What makes energy & utilities distinct.** Three things: (1) **regulation is the operating system** — investor-owned utilities earn returns approved by state public utility commissions; every major technology investment must survive a rate case to be recovered from ratepayers; this means procurement decisions are shaped by regulatory strategy, not just operational need; (2) **the buying cycle is measured in years, not quarters** — integrated resource plans span 15-20 years, infrastructure projects take 3-7 years from concept to commissioning, and vendor relationships last decades; (3) **reliability is existential** — a grid outage affects millions, triggers political and regulatory backlash, and can result in billions in liability (see: Texas winter storm 2021, PG&E wildfire liability); every technology decision is evaluated through a reliability-first lens.

---

═══ 1. MARKET SIZING & STRUCTURE ═══

| Metric | Value |
|---|---|
| U.S. electricity generation capacity | ~1,300 GW installed [verified 05/2026, EIA] |
| U.S. utility annual capex | ~$150B+ (T&D + generation) [verified 05/2026, EIA/S&P Global] |
| Global energy transition investment (2024) | ~$1.8T [verified 05/2026, BloombergNEF] |
| U.S. solar installations (2025) | ~40 GW added [verified 05/2026, Wood Mackenzie/SEIA] |
| U.S. battery storage installations (2025) | ~18 GW / ~55 GWh added [verified 05/2026, Wood Mackenzie] |
| U.S. wind installations (2025) | ~12 GW added (onshore + offshore) [verified 05/2026, AWEA/EIA] |
| IRA energy & climate incentives | ~$370B+ over 10 years [verified 05/2026, DOE] |
| U.S. interconnection queue backlog | ~2,600 GW across ISOs/RTOs [verified 05/2026, Lawrence Berkeley National Lab] |
| U.S. investor-owned utilities | ~170 IOUs serving ~70% of U.S. electricity customers [verified 05/2026, EIA] |
| U.S. electric cooperatives | ~900+ co-ops serving ~42M people in 48 states [verified 05/2026, NRECA] |
| U.S. municipal utilities | ~2,000+ munis serving ~15% of customers [verified 05/2026, APPA] |
| Average age of U.S. grid infrastructure | ~40 years for T&D assets [verified 05/2026, DOE Grid Deployment Office] |
| Levelized cost of utility-scale solar (unsubsidized) | ~$24-96/MWh [verified 05/2026, Lazard LCOE v17] |
| Levelized cost of onshore wind (unsubsidized) | ~$24-75/MWh [verified 05/2026, Lazard LCOE v17] |
| Levelized cost of battery storage (4-hour) | ~$120-180/MWh [verified 05/2026, Lazard LCOS] |

### Market segments

- **Generation:** Coal (declining), natural gas (bridge fuel/peaking), nuclear (existing fleet + SMR development), solar (utility-scale + distributed), wind (onshore + offshore), hydro, geothermal, battery storage, hydrogen (emerging)
- **Transmission & Distribution (T&D):** High-voltage transmission buildout, distribution grid modernization, smart grid, AMI/smart meters, grid hardening, undergrounding
- **Retail/Load-serving:** Regulated utilities, competitive retail electricity providers (ERCOT, PJM), community choice aggregation (CCA), behind-the-meter DER
- **Energy services:** ESCO (energy service companies), demand response, energy efficiency, C&I procurement, virtual PPAs
- **Oil & Gas:** Upstream (E&P), midstream (pipelines, processing, LNG), downstream (refining, petrochemicals) — increasingly investing in energy transition plays
- **Emerging:** Hydrogen (green, blue, pink), CCUS, advanced nuclear (SMRs), long-duration energy storage (LDES), virtual power plants (VPP), vehicle-to-grid (V2G)

---

═══ 2. NAMED COMPANY LANDSCAPE ═══

| Company | Segment | Scale | Why they matter |
|---|---|---|---|
| **NextEra Energy** | Utility + renewable developer | Largest U.S. utility by market cap; FPL (Florida IOU) + NextEra Energy Resources (largest wind/solar developer globally) [verified 05/2026, S&P Global] | Sets the pace for utility-scale renewables; aggressive growth strategy; benchmark for every utility's clean energy transition |
| **Duke Energy** | Regulated utility | ~7.9M electric customers across 6 states (Carolinas, Florida, Indiana, Ohio, Kentucky) [verified 05/2026, Duke Energy filings] | Major IRP filings with significant solar + storage targets; coal-to-clean transition case study; grid modernization investments |
| **Southern Company** | Regulated utility + generation | ~9M customers; operates in Southeast US; owns Vogtle nuclear units 3&4 [verified 05/2026, Southern Company filings] | Vogtle expansion (first new U.S. nuclear in decades) is landmark project; large regulated service territory; gas and electric |
| **AES Corporation** | Global power + renewables | Operations in 15+ countries; major renewable developer and energy storage pioneer [verified 05/2026, AES filings] | Fluence (AES + Siemens JV) is a leading global energy storage integrator; aggressive clean energy growth |
| **Enel** | Global utility + renewables | Largest European utility; U.S. operations via Enel North America, Enel Green Power, Enel X [verified 05/2026, Enel filings] | Global scale; DER/demand response via Enel X; demonstrates international utility operating models |
| **Engie** | Global utility + energy services | French multinational; renewable development, energy services, distributed energy in U.S. [verified 05/2026, Engie filings] | Large energy services/ESCO business; C&I solar + storage; district energy systems |
| **Dominion Energy** | Regulated utility | ~7M customers in Virginia, Carolinas, other states; major offshore wind investment (Coastal Virginia Offshore Wind — CVOW) [verified 05/2026, Dominion filings] | CVOW is the largest U.S. offshore wind project under construction; regulatory complexity case study |
| **Xcel Energy** | Regulated utility | ~3.7M electric customers across 8 states (MN, CO, WI, others) [verified 05/2026, Xcel Energy filings] | Early clean energy commitment (80% carbon reduction by 2030 target); progressive IRP process; Colorado clean energy leader |
| **ExxonMobil** | Oil major + energy transition | Largest U.S. oil company; expanding into CCUS, hydrogen, lithium [verified 05/2026, ExxonMobil filings] | Largest CCUS project portfolio among oil majors; signals how oil industry approaches energy transition |
| **Chevron** | Oil major + energy transition | Second-largest U.S. oil company; hydrogen, CCUS, renewable fuels investments [verified 05/2026, Chevron filings] | Renewable fuels (renewable diesel, SAF); hydrogen hubs; represents oil major transition investment |
| **First Solar** | Solar manufacturing | Largest U.S. solar module manufacturer; thin-film CdTe technology [verified 05/2026, First Solar filings] | IRA domestic content bonus beneficiary; U.S. manufacturing capacity expansion; supply chain de-risking |
| **SLB (Schlumberger)** | Oilfield services + energy tech | Largest oilfield services company globally; expanding into new energy (geothermal, CCUS, digital) [verified 05/2026, SLB filings] | Digital transformation of oil & gas operations; energy technology convergence |
| **Fluence** | Energy storage | Leading global energy storage technology and services provider (AES + Siemens JV, now public) [verified 05/2026, Fluence filings] | Battery storage system integrator; software + analytics platform; represents the storage value chain |
| **Sunrun / Sunnova** | Residential solar + storage | Two largest U.S. residential solar + battery companies [verified 05/2026, industry reports] | Distributed solar and VPP aggregation; residential DER market dynamics |
| **Pattern Energy / AES Clean Energy / Invenergy** | Independent power producers (IPP) | Among the largest U.S. independent wind, solar, and storage developers [verified 05/2026, industry reports] | Represent the IPP/developer buyer persona — different from regulated utilities in procurement and decision-making |

---

═══ 3. PROCUREMENT & BUYING PATTERNS ═══

### Regulated utility procurement (IOUs)

- **Integrated Resource Plan (IRP):** Utilities file IRPs with state PUCs every 2-5 years, forecasting load and proposing resource additions over 15-20 years. IRP approval is a prerequisite for major generation/storage procurement. Sellers must align with the IRP cycle.
- **Request for Proposals (RFP):** After IRP approval, utilities issue RFPs for specific resources (e.g., "500 MW solar + 200 MW/4h storage"). RFPs are governed by state rules; some states require independent monitors. Evaluation criteria include price (LCOE), reliability, diversity, local economic benefits.
- **Rate case recovery:** All utility investments must be approved for rate recovery by the state PUC. Technology vendors must understand that their buyer (the utility) must justify the purchase to regulators. "Prudency review" can retroactively disallow costs.
- **Power Purchase Agreements (PPAs):** Utilities contract with independent generators via PPAs (typically 15-25 years). PPA pricing is the benchmark for all generation economics. Sellers offering owned generation must compete against PPA alternatives.

### Deregulated/competitive market procurement

- **Competitive generators** (in ERCOT, PJM, ISO-NE, NYISO, CAISO, MISO, SPP) make investment decisions based on wholesale market economics, capacity market revenues, and ancillary services — not rate case approval.
- **C&I energy procurement:** Large commercial and industrial buyers procure energy through direct PPAs (virtual or physical), retail electricity contracts, or on-site generation. C&I buyers often have sustainability mandates driving renewable procurement.
- **Community Choice Aggregation (CCA):** Municipal-level procurement entities in California, Illinois, New York, and other states that aggregate retail load and procure on behalf of communities — growing buyer segment.

### Cycle lengths by segment

| Buyer type | Typical procurement cycle | Key factors |
|---|---|---|
| **Regulated IOU (generation/storage)** | 2-5 years (IRP → RFP → PUC approval → construction) | IRP filing cycle, PUC review timeline, FERC interconnection |
| **Regulated IOU (grid technology/software)** | 6-24 months | Rate case inclusion, pilot program, grid modernization docket |
| **Competitive generator/IPP** | 6-18 months (site → PPA → financial close → construction) | PPA pricing, interconnection timeline, tax credit qualification |
| **C&I buyer (energy procurement)** | 3-12 months | Contract expiration, sustainability targets, budget cycle |
| **Oil & gas (digital/technology)** | 3-18 months | Capex cycle, commodity price environment, technology maturity |
| **Municipal utility / co-op** | 6-24 months | Board approval, G&T cooperative requirements, federal funding |

---

═══ 4. BUYING COMMITTEES ═══

| Role | What they care about | Their lens |
|---|---|---|
| **VP Operations / VP Grid Operations** | Reliability, uptime, workforce safety, operational efficiency, system integration | "Does this improve reliability and integrate with our existing SCADA/EMS/ADMS? Can my team operate it?" |
| **VP Regulatory Affairs** | Rate recovery, commission approval, compliance, prudency | "Can I defend this to the PUC? Is it eligible for rate base inclusion? What's the regulatory risk?" |
| **Chief Sustainability Officer / VP ESG** | Decarbonization targets, ESG reporting, stakeholder commitments | "Does this advance our clean energy goals? How does it impact our emissions reporting?" |
| **VP Renewable Development** | Project pipeline, LCOE, PPA competitiveness, interconnection | "What's the all-in cost? How fast can we interconnect? What's the IRA credit qualification?" |
| **Director of Procurement / Supply Chain** | Vendor qualification, contract terms, domestic content, supply chain risk | "Does this meet our procurement standards? Is the supply chain secure? Domestic content eligible?" |
| **CTO / Head of Digital Transformation** | Technology architecture, cybersecurity, data analytics, cloud/edge | "How does this fit our technology roadmap? Is it OT-secure? Does it enable data-driven operations?" |
| **CFO / VP Finance** | Capital efficiency, rate of return, tax credit monetization, financing structure | "What's the rate-based return? How do we monetize IRA credits? What's the financing structure?" |
| **General Counsel / VP Legal** | Contract structure, regulatory exposure, environmental liability, land rights | "What are the regulatory and liability risks? Is the contract structure sound?" |
| **VP Power Trading / Chief Commercial Officer** | Market participation, hedging, revenue optimization, PPA structuring | "Does this improve our trading position? Can we optimize dispatch and revenue?" |
| **Board of Directors / Commissioners** | Fiduciary duty, ratepayer impact, political/community dynamics | "Is this in the best interest of ratepayers? What's the community impact?" |

### Decision patterns by investment type

- **Large generation/storage (>$100M):** Board + CEO + CFO + VP Generation + VP Regulatory + PUC approval. 2-5 year cycle. IRP-driven.
- **Grid modernization technology:** CTO/VP Grid Ops + VP Regulatory + CFO. 6-24 months. Rate case or grid mod docket.
- **Software/analytics platform:** CTO + VP Operations + Procurement. 3-12 months. Pilot-to-production pathway.
- **Energy trading/ETRM:** VP Trading + CTO + Risk + CFO. 6-18 months. RFP-driven.
- **C&I buyer energy procurement:** VP Sustainability + VP Procurement + CFO. 3-12 months. Contract-driven.

---

═══ 5. TRIGGER EVENTS ═══

| Trigger | What it signals | Sales implication |
|---|---|---|
| **IRA tax credit guidance update** | New qualifying criteria, bonus credits, or safe harbor deadlines shift project economics | Immediate impact on renewable/storage/hydrogen investment decisions; domestic content and energy community bonuses drive siting and sourcing changes |
| **Extreme weather event in service territory** | Grid reliability stress, infrastructure damage, political and regulatory pressure | Accelerates grid hardening, storage, and resilience investments; emergency procurement authority may bypass normal timelines |
| **State RPS or CES update** | New compliance deadlines, higher targets, technology carve-outs (e.g., storage mandate) | Triggers IRP update, RFP issuance, and technology evaluation for compliance resources |
| **IRP filing or approval** | Utility has committed to specific resource additions over next 5-15 years | Defines the procurement pipeline; align sales effort to approved resource types and timelines |
| **FERC interconnection reform (Order 2023 implementation)** | Queue processing changes, cluster study reforms, financial commitment requirements | Projects with interconnection progress gain advantage; creates urgency for queue-ready solutions |
| **Data center load growth announcement** | Hyperscaler or AI company announces large load in service territory (100 MW-1 GW+) | Forces capacity planning revision, generation procurement acceleration, T&D investment [verified 05/2026, Utility Dive] |
| **Rate case filing or approval** | New capex authorization, ROE determination, grid modernization rider | Signals what investments are approved for spending; technology vendors should align to authorized programs |
| **Utility M&A or restructuring** | Technology stack consolidation, operational integration, strategic reset | 12-36 month integration window; vendor rationalization creates displacement opportunities |
| **NERC CIP compliance deadline** | New or updated critical infrastructure protection requirements | Non-discretionary cybersecurity and OT security spend for bulk electric system assets |
| **Coal/gas plant retirement announcement** | Replacement capacity needed, community transition, new resource procurement | Triggers RFP for replacement resources (typically solar + storage); 3-5 year replacement timeline |

---

═══ 6. COMPETITIVE DYNAMICS ═══

### Platform and technology vendors

| Category | Key vendors | Competitive dynamics |
|---|---|---|
| **Grid management (SCADA/EMS/ADMS)** | GE Vernova (Grid Solutions), Siemens (Spectrum Power), Schneider Electric (ADMS), ABB (Ability), Honeywell, Oracle (OATI), OSIsoft/AVEVA | Deeply entrenched; 15-25 year replacement cycles; GE and Siemens dominate EMS; Schneider and GE compete in ADMS; vendor lock-in is extreme |
| **DERMS (DER Management Systems)** | GE Vernova, Schneider, Siemens, AutoGrid (Schneider), Opus One Solutions (GE), Smarter Grid Solutions | Emerging category driven by DER growth; utilities evaluating whether DERMS is standalone or integrated into ADMS |
| **Energy trading (ETRM)** | Openlink (ION), Allegro, Molecule, FIS (SunGard), Brady Technologies | ETRM replacement cycles are long (7-12 years); cloud migration underway; Molecule disrupting with modern architecture |
| **Asset performance management (APM)** | GE Vernova, Siemens, SparkCognition, Uptake, Bentley Systems | AI/ML for predictive maintenance of generation and T&D assets; GE Vernova strongest in generation; Bentley in T&D |
| **Customer information systems (CIS)** | Oracle (CCB), SAP (IS-U), Hansen (Sigmacom), Cayenta, Open International | CIS is the billing backbone; Oracle and SAP dominate large IOUs; replacement is rare and painful (3-5 year implementations) |
| **Outage management (OMS)** | GE Vernova, Schneider, ABB, Oracle, Milsoft | Often integrated with ADMS; restoration optimization is key differentiator |
| **Solar/storage project software** | Aurora Solar, PVsyst, Energy Toolbase, Also Energy (Stem), PowerFactors | Design, modeling, monitoring, and optimization; Aurora Solar leads in distributed solar design |
| **Carbon accounting / ESG** | Persefoni, Watershed, Salesforce Net Zero Cloud, Sphera, Enablon (Wolters Kluwer) | Growing category driven by ESG reporting mandates; utilities must track Scope 1/2/3 emissions |
| **Grid-edge / IoT** | Landis+Gyr, Itron, Honeywell, Eaton, Schneider | AMI/smart meters, grid sensors, edge computing; Landis+Gyr and Itron dominate smart metering |

### The GE Vernova factor

GE Vernova (spun out of GE in April 2024) is the dominant incumbent in utility technology — SCADA/EMS, generation equipment (gas turbines, wind turbines), grid solutions, and digital/software. Any technology sale to a utility must account for GE Vernova's position. GE Vernova is both the biggest competitor and the most common integration partner [verified 05/2026, GE Vernova filings].

---

═══ 7. REGULATORY OVERLAY ═══

### Federal regulatory architecture

| Agency/Body | Jurisdiction | Impact on purchasing |
|---|---|---|
| **FERC** | Wholesale electricity markets, interstate transmission, market rules, interconnection | FERC Order 2023 (interconnection reform) is reshaping how projects connect to the grid; FERC approves market rules in ISOs/RTOs; transmission planning reform underway [verified 05/2026, FERC] |
| **NERC** | Bulk electric system reliability standards, Critical Infrastructure Protection (CIP) | NERC CIP standards mandate cybersecurity controls for grid assets; compliance is non-discretionary; NERC reliability assessments identify system risks [verified 05/2026, NERC] |
| **DOE** | Loan programs, Grid Deployment Office, national labs, technology R&D | DOE Loan Programs Office (LPO) has $400B+ in lending authority; Grid Deployment Office administering $20B+ in grid investment from IIJA [verified 05/2026, DOE] |
| **EPA** | Emissions standards, GHG reporting, air quality, water discharge | EPA power plant rules (Section 111) drive generation fleet decisions; GHG reporting requirements affect operations and investment |
| **IRS** | IRA tax credit implementation, guidance, safe harbors | IRS guidance on ITC, PTC, 45V (hydrogen), 45Q (CCUS), domestic content, energy community, transferability — each ruling shifts project economics [verified 05/2026, IRS/Treasury] |

### IRA provisions critical to energy purchasing decisions

| Provision | What it does | Impact |
|---|---|---|
| **ITC (Investment Tax Credit, Sec. 48/48E)** | 30% tax credit for solar, storage, and other qualifying technologies (with prevailing wage/apprenticeship) | Drives utility-scale and C&I solar + storage economics; stackable bonus credits can reach 50-70% |
| **PTC (Production Tax Credit, Sec. 45/45Y)** | ~$28/MWh for qualifying wind, solar, geothermal (10-year production credit, with prevailing wage) | Determines project-level economics for wind and increasingly for solar |
| **45V (Clean Hydrogen)** | Up to $3/kg production tax credit for clean hydrogen (tiered by lifecycle emissions) | Drives green/pink hydrogen project development; "three pillars" guidance (additionality, deliverability, temporal matching) shapes project viability [verified 05/2026, IRS/Treasury] |
| **45Q (CCUS)** | $85/ton for CO2 stored geologically; $60/ton for CO2 utilized | Makes carbon capture economically viable for power plants, industrial facilities, and direct air capture |
| **Domestic content bonus** | Additional 10% ITC or 10% PTC adder for projects meeting domestic content thresholds | Reshaping solar module, battery cell, and steel/iron supply chains; drives domestic manufacturing investment |
| **Energy community bonus** | Additional 10% ITC or 10% PTC adder for projects in energy communities (brownfield, coal closure, fossil fuel employment) | Affects project siting decisions; ~50% of U.S. land area qualifies [verified 05/2026, DOE] |
| **Transferability** | Tax credits can be transferred (sold) to unrelated parties | Enables tax-exempt entities (munis, co-ops) and tax equity-constrained developers to monetize credits; created a new tax credit transfer market |

### State regulatory layer

- **State PUCs (Public Utility Commissions):** Approve utility rates, capital investments, IRPs, and technology deployments. Each of the 50 states has its own commission with its own procedures, political dynamics, and policy priorities. **This is the single most important regulatory factor in selling to regulated utilities.**
- **Renewable Portfolio Standards (RPS):** 30+ states have RPS or CES mandates requiring utilities to source a percentage of electricity from renewables. Compliance deadlines drive procurement timelines.
- **PURPA (Public Utility Regulatory Policies Act):** Federal law requiring utilities to buy power from qualifying facilities (QFs). FERC and state implementation varies widely; affects distributed generation and small power producer economics.
- **Permitting:** Environmental review (NEPA), state/local permitting, wetlands, endangered species, cultural resources, and FAA (for wind turbines) create 2-5 year timelines for large projects. Permitting reform is a major federal and state policy priority.

---

═══ 8. TECHNOLOGY STACK ═══

### The modern utility/energy company technology architecture

| Layer | Function | Key vendors |
|---|---|---|
| **SCADA / EMS (Energy Management System)** | Real-time grid monitoring, control, and dispatch for transmission and generation | GE Vernova, Siemens, ABB, Honeywell, Emerson |
| **ADMS (Advanced Distribution Management System)** | Distribution grid management, volt/VAR optimization, FLISR (fault location, isolation, service restoration) | GE Vernova, Schneider Electric, Oracle, Siemens, ABB |
| **DERMS (DER Management System)** | Manage and dispatch distributed energy resources (rooftop solar, batteries, EVs, demand response) | GE Vernova, Schneider, AutoGrid, Opus One, Smarter Grid Solutions |
| **GIS (Geographic Information System)** | Spatial mapping of grid assets, facilities, service territory | Esri (dominant), GE Smallworld, Schneider ArcFM |
| **OMS (Outage Management System)** | Storm/outage response, crew dispatch, restoration optimization | GE Vernova, Schneider, Oracle, ABB, Milsoft |
| **CIS (Customer Information System)** | Billing, metering, customer accounts, rate structures | Oracle (CCB), SAP (IS-U), Cayenta, Hansen, Open International |
| **AMI (Advanced Metering Infrastructure)** | Smart meters, communication networks, meter data management | Landis+Gyr, Itron, Honeywell (Elster), Aclara (Hubbell), Sensus (Xylem) |
| **Energy trading (ETRM)** | Position management, risk analytics, scheduling, settlements | Openlink (ION), Allegro, FIS, Brady, Molecule |
| **Asset performance management (APM)** | Predictive maintenance, condition monitoring, reliability analytics | GE Vernova, Siemens, SparkCognition, Uptake, Bentley, AspenTech |
| **Digital twin** | Virtual models of physical grid/plant assets for simulation, planning, optimization | GE Vernova, Siemens, Bentley (iTwin), AVEVA, DNV |
| **AI/ML for grid operations** | Load forecasting, renewable generation forecasting, anomaly detection, grid optimization | AutoGrid, Utilidata, SparkCognition, Google DeepMind (grid optimization), various startups |
| **OT cybersecurity** | Securing SCADA/ICS/OT environments, NERC CIP compliance | Dragos, Claroty, Nozomi Networks, Fortinet OT, Cisco (industrial) |
| **Grid planning and analytics** | Transmission planning, distribution planning, hosting capacity analysis, DER integration studies | PSS/E (Siemens), PSLF (GE), PowerWorld, CYME (Eaton), Synergee (DNV), GridOS (GE) |
| **Renewable project development** | Site assessment, resource analysis, energy yield modeling, interconnection studies | PVsyst, Windographer, OpenWind, Homer Energy, RETScreen, NREL SAM |
| **Carbon/ESG management** | Emissions tracking, Scope 1/2/3, ESG reporting, regulatory compliance | Persefoni, Watershed, Salesforce Net Zero Cloud, Sphera, Enablon |
| **EV charging management (CPMS)** | Charge point management, network operations, billing, grid integration | ChargePoint, Enel X Way, Shell Recharge, EVgo, ABB E-mobility |

### OT/IT convergence (the defining technology trend)

The energy sector is in the middle of a generational OT/IT convergence. Legacy SCADA and EMS systems (designed for reliability, running on proprietary protocols) are being integrated with modern IT platforms (cloud, analytics, AI, cybersecurity). This creates both opportunity (data-driven operations, predictive maintenance, grid optimization) and risk (expanded attack surface, IT/OT skill gaps, legacy integration challenges). **Every technology sale to a utility touches this OT/IT boundary and must address both operational technology reliability requirements and modern IT architecture expectations.**

---

═══ 9. ICP PATTERNS ═══

### Best-fit Cambrian user-prospect: B2B technology and services vendors selling into utilities, renewable developers, and energy companies

Why these segments:
- Massive capex budgets with clear, long-duration procurement cycles tied to IRPs and rate cases
- Regulatory-driven purchasing creates predictable demand (NERC CIP, state RPS, IRA compliance)
- Generational technology transition (grid modernization, DER integration, OT/IT convergence) creating greenfield opportunities
- High switching costs and long vendor relationships mean winning a utility account is durable revenue

### Strong-fit segments

- **Grid modernization technology vendors** selling ADMS, DERMS, AMI, and analytics to utilities in active grid mod proceedings
- **Renewable/storage developers** selling to utilities via IRP-driven RFPs or corporate buyers via PPAs
- **OT cybersecurity vendors** selling to utilities with NERC CIP compliance requirements — Dragos, Claroty, Nozomi
- **Energy trading/ETRM vendors** selling to utilities, IPPs, and traders in ISO/RTO markets
- **Carbon accounting and ESG platforms** selling to utilities with Scope 1/2/3 reporting mandates
- **Asset performance management** vendors selling predictive maintenance to generation and T&D operators

### Weaker-fit segments

- **Utilities with no approved grid modernization rider or IRP** — no authorized budget for new technology
- **Very small munis and co-ops (<25,000 meters)** — minimal technology budget; buy through G&T cooperatives or state associations
- **Upstream oil & gas in a low commodity price environment** — capex contraction reduces all technology spending
- **Companies selling consumer-facing energy products** (residential solar, home energy management) — different buying process, not B2B enterprise

---

═══ 10. FAILURE MODES ═══

1. **Ignoring the regulatory cycle.** Selling a $10M grid technology platform to a utility that just completed its rate case (and won't file again for 3 years) is a timing mismatch. The technology may be great, but the utility has no authorized mechanism to recover the cost from ratepayers. Qualify rate case timing early.

2. **Treating all utilities the same.** An investor-owned utility in a regulated Southeast state, a municipal utility in Texas, and a cooperative in the Upper Midwest have completely different governance structures, procurement processes, decision-making authorities, and technology adoption speeds. Generic "utility" pitches fail.

3. **Underestimating procurement timelines.** Enterprise software sales cycles of 6-9 months feel fast in utility-land. Generation procurement from IRP to commissioning is 3-7 years. Grid technology pilots alone can take 12-18 months. Sellers who forecast based on typical SaaS timelines miss badly.

4. **Not understanding rate recovery.** If a utility cannot recover the cost of your technology from ratepayers, they cannot buy it — full stop. The question "How will this be recovered in rates?" must have an answer before procurement proceeds.

5. **Ignoring NERC CIP for OT/grid products.** Any technology that touches the bulk electric system or its control systems must comply with NERC CIP reliability standards. Vendors who cannot demonstrate CIP compliance (or compatibility with the utility's CIP program) are disqualified.

6. **Selling to the wrong ISO/RTO context.** ERCOT (Texas, energy-only market), PJM (capacity market), CAISO (California, aggressive renewables), and MISO (Midcontinent, diverse generation mix) have fundamentally different market structures, price signals, and investment incentives. A storage pitch that makes sense in ERCOT may not pencil in SPP.

7. **Overlooking the GE Vernova/Siemens incumbency.** GE Vernova and Siemens are embedded in utility control rooms. Any grid technology pitch must address integration with or displacement of these incumbents. Walking in without knowing whether the utility runs GE EMS or Siemens Spectrum Power signals a lack of preparation.

8. **Pitching cloud-first to an OT-centric operations team.** Utility operations teams prioritize reliability, latency, and cybersecurity over cloud economics. Leading with "SaaS" or "cloud-native" to an OT team that operates air-gapped SCADA systems creates distrust. Lead with reliability and security; cloud architecture is a means, not a message.

---

═══ 11. GTM PLAYBOOK ═══

### Conference circuit (must-attend events for energy sellers)

| Event | Focus | Timing |
|---|---|---|
| **DistribuTECH (now Distributech International)** | Grid modernization, T&D, DER, utility technology | January/February |
| **RE+ (formerly Solar Power International + ESI)** | Solar, storage, wind, clean energy — largest in North America | September |
| **CERAWeek** | Global energy, oil & gas, energy transition, geopolitics | March (Houston) |
| **Utility Dive Events (various)** | Utility strategy, regulation, technology | Throughout year |
| **AWEA Cleanpower (now ACP Cleanpower)** | Wind, solar, storage, transmission policy | May |
| **Solar & Storage Finance USA (Solarplaza/Informa)** | Project finance, PPA structuring, tax equity | Various |
| **EUCI conferences** | Specialized: interconnection, rate design, grid planning, storage | Throughout year |
| **ETS (Energy Thought Summit)** | Utility innovation, C-suite strategy | Various |

### Channel strategy

- **EPC firms (Engineering, Procurement, Construction):** Fluor, Black & Veatch, Burns & McDonnell, Quanta Services, MasTec — they specify and deploy technology for utility clients. Getting on an EPC's approved vendor list is a powerful channel.
- **Management consulting firms:** ICF, Guidehouse (formerly Navigant), McKinsey, BCG, Bain — they advise utilities on IRPs, grid modernization strategies, and technology roadmaps. Influencing the consultant's recommendation can unlock large utility engagements.
- **System integrators:** Accenture, Deloitte, IBM, Infosys, TCS — they implement large utility technology platforms (CIS, ERP, ADMS). Partnership or integration with SI implementation practices is essential for enterprise software sales.
- **G&T cooperatives and state associations:** Generation and Transmission cooperatives (e.g., Tri-State G&T, Basin Electric) and state municipal/co-op associations aggregate procurement for smaller utilities. One G&T relationship can unlock dozens of member utilities.
- **Independent engineering firms:** Burns & McDonnell, HDR, Sargent & Lundy, DNV — they perform independent evaluations and feasibility studies that influence utility procurement decisions.

### Demo and POC expectations

- Utility buyers expect to see integration with existing SCADA/EMS/ADMS environments — standalone demos with synthetic data have limited credibility
- Pilot programs (12-18 months, single feeder or substation) are the standard entry path for grid technology
- OT security review is mandatory for any technology touching the control system network
- Interoperability standards matter: IEEE 2030.5, OpenADR, CIM (Common Information Model, IEC 61968/61970), DNP3, IEC 61850
- Reference customers at comparable utilities (similar size, regulatory environment, technology stack) are essential — a tech-forward California utility reference does not translate to a conservative Southeastern utility

---

═══ 12. CROSS-REFERENCES ═══

| Layer | How it applies |
|---|---|
| \`complianceKnowledge.js\` | NERC CIP reliability standards, EPA emissions regulations, state PUC compliance, ESG/sustainability reporting requirements |
| \`peHoldcoKnowledge.js\` | PE-owned utilities (e.g., Calpine, Vistra), PE-backed renewable developers and energy storage companies, infrastructure fund dynamics |
| \`manufacturingKnowledge.js\` | Solar module manufacturing (First Solar, domestic content), wind turbine manufacturing (GE Vernova, Vestas, Siemens Gamesa), battery manufacturing (LFP, NMC supply chains) |
| \`aiMlKnowledge.js\` | AI/ML for load forecasting, renewable generation forecasting, grid optimization, predictive maintenance, autonomous grid operations |
| \`cybersecurityKnowledge.js\` | OT/ICS cybersecurity for grid assets, NERC CIP compliance, IT/OT convergence security, SCADA protection |
| \`b2bSalesKnowledge.js\` | Long-cycle enterprise sales (IRP-driven procurement is the extreme case), multi-stakeholder buying committees, regulated buyer dynamics |
| \`investorIntelligenceKnowledge.js\` | Publicly traded utilities (NEE, DUK, SO, AES, D, XEL), oil majors (XOM, CVX), and energy technology companies (FSLR, SEDG, ENPH, RUN) |
| \`insuranceKnowledge.js\` | Utility insurance (wildfire liability, storm damage), energy project insurance, parametric weather insurance |

---

*End of layer. Update cadence: quarterly aligned with EIA outlooks (January, May, August, November), FERC orders, IRS IRA guidance releases, and major utility IRP filing cycles. Critical re-check triggers: IRA implementation guidance changes, FERC interconnection reform updates, major grid reliability events, state RPS/CES legislation, utility M&A announcements, DOE loan program commitments, Lazard LCOE annual update.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const ENERGY_INJECTION = ENERGY_PLAYBOOK.layerContent;
export const ENERGY_SCORING = ENERGY_PLAYBOOK.keywords.join(", ");
export const ENERGY_DISCOVERY = ENERGY_PLAYBOOK.discovery.join("\n");
