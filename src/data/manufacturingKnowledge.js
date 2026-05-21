// src/data/manufacturingKnowledge.js
//
// U.S. Manufacturing industry knowledge layer — discrete, process, and
// hybrid manufacturing. Covers OEM, contract manufacturing, job shops,
// Industry 4.0, smart factory, and the full operational technology stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_MANUFACTURING (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   NAM (National Association of Manufacturers), Manufacturing Facts (2026):
//     nam.org/facts-about-manufacturing
//   Bureau of Economic Analysis, GDP by Industry (2025-2026):
//     bea.gov/data/gdp/gdp-industry
//   IBISWorld, Manufacturing in the US (2026):
//     ibisworld.com/united-states/industry-trends/manufacturing
//   Deloitte / MAPI, US Manufacturing Outlook (2026):
//     deloitte.com/us/manufacturing-outlook
//   Federal Reserve, Industrial Production and Capacity Utilization (2026):
//     federalreserve.gov/releases/g17
//   ISM, Manufacturing PMI (2025-2026):
//     ismworld.org
//   McKinsey Global Institute, The Future of Manufacturing (2025):
//     mckinsey.com/mgi
//   Gartner, Manufacturing ERP / MES / PLM Market (2025-2026):
//     gartner.com/reviews/market/manufacturing-execution-systems
//   IoT Analytics, Smart Manufacturing Market (2025-2026):
//     iot-analytics.com
//   OSHA, Manufacturing Safety Statistics (2026):
//     osha.gov/manufacturing
//   Census Bureau, Annual Survey of Manufactures (2025 data, released 2026):
//     census.gov/programs-surveys/asm
//   BLS, Manufacturing Employment (2026):
//     bls.gov/iag/tgs/iag31-33.htm
//
// -- KNOWN TRAPS --
//   1. "Manufacturing" is not one market. Discrete (automotive, aerospace,
//      electronics), process (chemicals, food, pharma), and hybrid (plastics,
//      metals) have fundamentally different economics, tech stacks, and buyers.
//   2. OEMs, contract manufacturers, and job shops have different decision
//      structures: OEM = brand owner, CM = margin-per-unit, job shop = quote
//      accuracy and scheduling.
//   3. OT (operational technology) and IT are separate domains with separate
//      budgets, teams, and security postures. The IT/OT convergence is real
//      but incomplete and politically charged.
//   4. Regulatory burden varies enormously by sub-vertical: food (FDA/FSMA),
//      pharma (FDA/cGMP), aerospace/defense (ITAR/DFARS/AS9100), automotive
//      (IATF 16949), general (OSHA/EPA/ISO 9001). Never assume one regime.
//   5. Capacity utilization is the universal pulse check, but the Fed
//      publishes it monthly and it changes -- always fetch live.
//   6. "Industry 4.0" and "smart factory" are aspirational for most
//      manufacturers. The reality is a patchwork of legacy PLCs, manual
//      processes, and selective automation. Do not assume digital maturity.

// -- MANUFACTURING INJECTION --
// Injected when the seller or target operates in manufacturing: OEM, contract
// manufacturing, job shop, process manufacturing, or manufacturing-adjacent
// technology and services.

export const MANUFACTURING_INJECTION = `
MANUFACTURING INDUSTRY CONTEXT (use when the target or seller is a manufacturer -- discrete, process, or hybrid -- or provides manufacturing technology, equipment, materials, or services):

VALUE CHAIN -- WHO MAKES WHAT, AND HOW (structural):
- OEM (Original Equipment Manufacturer): designs, brands, and sells the finished product. Owns the customer relationship, the IP, and the supply chain orchestration. May manufacture in-house or outsource to contract manufacturers. Examples by sub-vertical: automotive OEM (assembles vehicles), aerospace OEM (assembles aircraft/engines), electronics OEM (designs and assembles devices), industrial equipment OEM.
- CONTRACT MANUFACTURER (CM): manufactures products to an OEM's specifications. Does not own the brand or end-customer relationship. Competes on cost, quality, speed, and flexibility. Electronics contract manufacturing (EMS) is a massive sub-segment (Foxconn, Flex, Jabil scale). CMs live on margin-per-unit; utilization and yield are existential.
- JOB SHOP: custom or low-volume manufacturing (machining, fabrication, specialty work). Quote accuracy, scheduling efficiency, and on-time delivery are the key performance drivers. Fragmented market with thousands of small shops.
- PROCESS MANUFACTURER: produces goods through chemical, thermal, or biological transformation -- output cannot be easily disassembled back into inputs. Chemicals, food & beverage, pharmaceuticals, petrochemicals, pulp & paper, cement. Batch and continuous-flow processes. Recipe/formula management, yield optimization, and regulatory compliance are central.
- HYBRID MANUFACTURER: combines discrete and process methods. Plastics (injection molding), metals (casting + machining), food packaging. Needs technology that handles both BOM-driven and recipe/formula-driven workflows.
- TIER 1 / TIER 2 / TIER 3 SUPPLIERS: the supply chain hierarchy below OEMs. Tier 1 supplies directly to the OEM (e.g., automotive Tier 1 = seat assemblies, electronics modules). Tier 2 supplies to Tier 1. Tier 3 supplies raw materials or basic components. Each tier has different margin pressure, technology maturity, and buyer sophistication.

ECONOMIC MODEL -- THROUGHPUT, OEE, YIELD, COGS (structural):
- THROUGHPUT: units produced per unit of time. The fundamental measure of manufacturing output. Constraint-based (Theory of Constraints / bottleneck analysis) thinking dominates operations management.
- OEE (Overall Equipment Effectiveness): Availability x Performance x Quality. The universal scoreboard for manufacturing operations. World-class OEE is ~85%; the global average is ~60-65% [verified 2026, various industry benchmarks]. Every point of OEE improvement translates directly to output and margin.
- YIELD: ratio of good output to total input. Critical in process manufacturing (chemical yield), semiconductor fabrication (wafer yield), and food production (yield from raw materials). Yield loss is direct margin destruction.
- COGS (Cost of Goods Sold): materials + direct labor + manufacturing overhead. In most manufacturing, materials are 40-60% of COGS [verified 05/2026, industry benchmarks / cost accounting standards], making supply chain and procurement critical levers. Direct labor is declining as a percentage of COGS as automation increases, but it remains significant in labor-intensive segments (assembly, food processing).
- CAPACITY UTILIZATION: actual output / potential output. The Fed publishes this monthly for US manufacturing overall (~77-79% in recent months [verified Q1 2026, Federal Reserve G.17]). Below 75% signals slack and margin pressure; above 82% signals constraints and capex trigger.
- INVENTORY TURNS: COGS / average inventory. Lean manufacturing targets high turns; excess inventory ties up cash and risks obsolescence. Just-in-time (JIT) vs just-in-case (JIC) is a live strategic debate post-pandemic supply chain disruptions.
- MAKE vs BUY: the perpetual strategic decision -- manufacture in-house or outsource. Drives capex, hiring, supply chain design, and technology investment decisions.

MARKET STRUCTURE & SIZE (cyclical -- dated):
- US manufacturing output ~$2.9T (value added), representing ~11-12% of GDP [verified Q1 2026, BEA / NAM]. Total manufacturing shipments/revenue ~$6.8-7.0T including materials pass-through [verified 2026, Census Bureau / IBISWorld].
- ~13 million US manufacturing workers across ~330,000 establishments [verified 2026, BLS / Census]. Manufacturing employment has stabilized after decades of decline, buoyed by reshoring and automation investment.
- ISM Manufacturing PMI hovered near the 50-point expansion/contraction threshold through most of 2025, signaling mixed conditions -- some sub-sectors expanding, others contracting [verified Q1 2026, ISM].
- Sub-sector scale (approximate US revenue): transportation equipment ~$1.1T, chemicals ~$800B, food/beverage ~$950B, computer/electronics ~$450B, machinery ~$450B, fabricated metals ~$430B, plastics/rubber ~$260B, pharmaceuticals ~$350B [verified 2026, Census / IBISWorld -- these are gross shipment values, not value added].
- Reshoring and nearshoring: CHIPS Act, IRA (Inflation Reduction Act), and supply chain risk concerns are driving significant domestic manufacturing investment -- $200B+ in announced US manufacturing construction projects since 2022 [verified 2026, Deloitte / Census construction spending data].

TECHNOLOGY LANDSCAPE -- THE OT/IT STACK (structural categories + dated vendor context):
- ERP (Enterprise Resource Planning): the transactional backbone -- production planning, procurement, inventory, finance, order management. SAP S/4HANA dominates large/enterprise manufacturing; Oracle Cloud and Microsoft Dynamics 365 are strong alternatives. Infor (CloudSuite Industrial / SyteLine, M3 for process) and Epicor (for mid-market discrete and job shops) are manufacturing-specialized. NetSuite serves the SMB tier. ERP replacement is a multi-year, high-budget, high-risk program.
- MES (Manufacturing Execution System): bridges ERP and the shop floor. Real-time production tracking, work-order dispatch, quality management, traceability. Key vendors: Rockwell (Plex, FactoryTalk), Siemens (Opcenter), SAP (Digital Manufacturing), AVEVA, Aegis (FactoryLogix), Dassault (DELMIA). MES is the linchpin of Industry 4.0 -- connecting digital planning to physical execution.
- PLM (Product Lifecycle Management): manages the product from design through manufacturing through end-of-life. CAD integration, BOM management, change management, configuration management. Dominated by Siemens (Teamcenter), Dassault (ENOVIA/3DEXPERIENCE), PTC (Windchill), and Autodesk (Fusion). Critical in discrete manufacturing; less central in process.
- SCADA / HMI (Supervisory Control and Data Acquisition / Human-Machine Interface): monitors and controls industrial processes in real time. The OT layer -- PLCs, RTUs, sensors, and control systems feeding data to SCADA platforms. Key OT vendors: Rockwell Automation (Allen-Bradley), Siemens, Schneider Electric, ABB, Honeywell, Emerson, GE Vernova. SCADA systems are long-lived (15-30 year replacement cycles) and security-sensitive.
- IoT / IIoT (Industrial Internet of Things): sensors, edge computing, and connectivity platforms that instrument machines, lines, and facilities. Enables predictive maintenance, condition monitoring, energy management, and real-time OEE tracking. Platforms: PTC (ThingWorx), AWS IoT, Azure IoT, Siemens (MindSphere/Insights Hub), Rockwell (Plex). IIoT adoption is growing but uneven -- large plants are further along; small/mid-size manufacturers lag [verified 2026, IoT Analytics].
- QMS (Quality Management System): manages quality processes, non-conformance, CAPA (corrective and preventive action), audit trails, document control. Often a module in ERP or MES, or standalone (ETQ, MasterControl, Veeva in pharma, Greenlight Guru in medical devices). Essential for regulated industries.
- SUPPLY CHAIN / PROCUREMENT: sourcing, supplier management, demand planning, S&OP. SAP Ariba, Coupa, Jaggaer for procurement; Kinaxis, o9 Solutions, Blue Yonder for planning.
- CAD / CAM / CAE: design and engineering tools -- SolidWorks, Autodesk, Siemens NX, PTC Creo, CATIA. Upstream of PLM. Increasingly cloud-migrating.

INDUSTRY 4.0 / SMART FACTORY (structural trend):
- Industry 4.0 = the convergence of IT and OT through IoT, AI/ML, cloud computing, digital twins, additive manufacturing (3D printing), and advanced robotics.
- DIGITAL TWIN: a virtual replica of a physical asset, process, or facility used for simulation, monitoring, and optimization. Gaining traction in aerospace, automotive, and large process plants; still aspirational for most mid-market manufacturers.
- PREDICTIVE MAINTENANCE: using sensor data and ML to predict equipment failures before they occur, reducing unplanned downtime. The most common and highest-ROI Industry 4.0 use case.
- ADDITIVE MANUFACTURING (3D printing): prototyping, tooling, and increasingly production parts (especially aerospace, medical, and dental). Market growing rapidly but still <1% of total manufacturing output [verified 05/2026, Wohlers Report].
- ADVANCED ROBOTICS / COBOTS: collaborative robots working alongside humans. Adoption accelerating due to labor shortages and declining robot costs.
- REALITY CHECK: most US manufacturers, especially SMBs, are in the early stages of Industry 4.0. The typical mid-market plant still has manual data collection, disconnected systems, and limited real-time visibility. The gap between Industry 4.0 vision and shop-floor reality is wide.

REGULATORY & COMPLIANCE LANDSCAPE (structural -- durable):
- OSHA (Occupational Safety and Health Administration): workplace safety. Manufacturing has among the highest injury and fatality rates. OSHA inspections, citations, and penalties are a constant operational reality. Process Safety Management (PSM) applies to chemical and process plants.
- EPA (Environmental Protection Agency): air emissions (Clean Air Act), water discharge (Clean Water Act), hazardous waste (RCRA), chemical reporting (TSCA, TRI). Manufacturing is the largest regulated sector for EPA. Compliance costs are significant, especially in chemicals, metals, and energy-intensive industries.
- ISO 9001: the universal quality management standard. Baseline expectation for any manufacturer selling to enterprise or government customers.
- ISO 14001: environmental management system standard. Increasingly required by OEMs and large buyers.
- ITAR (International Traffic in Arms Regulations): controls export of defense-related articles and services. Critical in aerospace and defense manufacturing -- ITAR compliance restricts who can access technical data, where manufacturing can occur, and which employees can work on ITAR programs. Violation penalties are severe.
- DFARS (Defense Federal Acquisition Regulation Supplement): governs DoD procurement. CMMC (Cybersecurity Maturity Model Certification) is the emerging cybersecurity requirement for the defense industrial base -- all DoD contractors and subcontractors must achieve certification [verified 2026, DoD/CMMC-AB].
- AS9100: aerospace quality management standard (builds on ISO 9001). Required for aerospace supply chain participation.
- IATF 16949: automotive quality management standard. Required for automotive supply chain participation.
- FDA / cGMP: Current Good Manufacturing Practice for food, pharmaceuticals, and medical devices. FDA inspections, 483 observations, and warning letters are high-stakes events.
- FSMA (Food Safety Modernization Act): preventive controls, traceability, and supply chain verification for food manufacturers.

BUYER-ROLE TAXONOMY (structural -- who owns budget):
- VP / SVP OPERATIONS: the operational P&L owner -- throughput, OEE, cost, quality, safety, delivery. The most common budget holder for shop-floor technology (MES, IoT, quality, maintenance).
- PLANT MANAGER: runs a specific facility. Owns day-to-day production, staffing, maintenance, and safety. A critical influencer and often the economic buyer for site-level investments.
- CIO / VP IT: enterprise IT infrastructure, ERP, cybersecurity, cloud, data/analytics. Owns the IT budget. In manufacturers with a strong IT/OT convergence agenda, the CIO's scope is expanding into operational technology.
- VP SUPPLY CHAIN / PROCUREMENT: sourcing, supplier management, logistics, demand planning, S&OP. Owns supply chain technology and the procurement budget.
- VP ENGINEERING / CTO: product design, R&D, process engineering, new product introduction (NPI). Owns PLM, CAD/CAM, and engineering tools.
- QUALITY DIRECTOR / VP QUALITY: quality management, regulatory compliance, audits, CAPA, customer returns. Owns QMS and is the primary buyer for quality-related technology.
- CFO / VP FINANCE: capital allocation, ROI analysis, financial planning. The gatekeeper for capex decisions -- manufacturing technology purchases often require capex justification (not just opex).
- COO: enterprise-wide operations strategy. In larger manufacturers, the COO oversees multiple plants and supply chain.
- VP / DIRECTOR OF MAINTENANCE / RELIABILITY: maintenance strategy, asset management, predictive maintenance, MRO (maintenance, repair, and operations) spend. A growing buyer role as manufacturers shift from reactive to predictive maintenance.

GTM IMPLICATIONS (structural):
- Subdivide before selling: discrete vs process vs hybrid manufacturing have different tech stacks, different buyers, and different economic models. Within discrete, automotive vs aerospace vs electronics vs industrial equipment differ substantially.
- OEE is the universal scoreboard -- frame value as OEE improvement, throughput gain, yield improvement, or downtime reduction. Manufacturers think in these terms, not in SaaS metrics.
- IT and OT are separate worlds: separate budgets, separate teams, separate security postures, separate vendors, separate culture. The CIO and the VP Operations may not even talk regularly. Understand which side of the IT/OT divide your solution sits on.
- Capex vs opex matters: many manufacturing technology decisions are capex (capitalized over the asset's useful life), not opex (subscription). This affects budget approval, ROI calculation, and buying timeline. Cloud/SaaS models are gaining acceptance but capex-funded on-prem is still common, especially on the OT side.
- The labor shortage is real and acute: manufacturers cannot find enough skilled workers (machinists, welders, technicians, engineers). Any technology that reduces labor dependency, augments existing workers, or accelerates training has strong pull [verified 2026, Deloitte / NAM skills gap reports].
- Regulatory compliance is a buying trigger, not just a constraint. FDA warning letters, OSHA citations, failed audits, CMMC deadlines, and customer-mandated certifications force technology investment on non-discretionary timelines.
- Shop-floor credibility matters: manufacturers are skeptical of vendors who do not understand production realities. Generic "digital transformation" pitches without operational specificity will be ignored. Speak the language of the plant floor.
- SMB manufacturers (job shops, small CMs) are technology-underserved and increasingly reachable through cloud-native, low-implementation-cost solutions. But deal sizes are small and sales cycles can be surprisingly long (owner-operators are cautious capital allocators).
`;

// -- MANUFACTURING SCORING CONTEXT --
// Calibrates ICP fit scoring when target/seller is manufacturing-adjacent.
// Bands conform to the normalized scale: Strong Fit 65+, Potential 40-64,
// Poor <40.

export const MANUFACTURING_SCORING = {
  highFitSegments: [
    { segment: "Mid-market discrete manufacturers (100-2,000 employees) with active ERP/MES modernization", avgFit: "65-75%", reason: "Real budgets, accessible decision-makers, aging systems creating urgency; OEE and throughput improvement directly measurable" },
    { segment: "Contract manufacturers / EMS scaling production or adding new customers", avgFit: "60-70%", reason: "Margin-per-unit pressure drives technology adoption; new customer onboarding triggers system investment; faster buying than OEMs" },
    { segment: "Food & beverage manufacturers under FDA/FSMA compliance pressure", avgFit: "60-70%", reason: "Non-discretionary regulatory deadlines force traceability and quality-system investment; compliance is a gating requirement, not optional" },
    { segment: "Aerospace/defense Tier 1-2 suppliers facing CMMC / AS9100 requirements", avgFit: "60-70%", reason: "Certification deadlines create non-discretionary buying triggers; cybersecurity and quality-system gaps must be closed to retain contracts" },
    { segment: "Manufacturers investing in predictive maintenance / IIoT", avgFit: "55-65%", reason: "Predictive maintenance is the highest-ROI Industry 4.0 use case; clear OEE and downtime-reduction payback; active budget allocation" },
    { segment: "Job shops and small CMs adopting cloud-native ERP / quoting tools", avgFit: "55-65%", reason: "Technology-underserved, replacing spreadsheets and legacy systems; owner-operators value simplicity and fast ROI -- but deal sizes are small" },
  ],
  highFrictionSegments: [
    { segment: "Fortune 100 OEMs (e.g., automotive Big 3, major aerospace primes)", avgFit: "20-30%", reason: "Fortress procurement; multi-year vendor selection; massive internal engineering and IT teams; deeply entrenched SAP/Siemens/Rockwell incumbents" },
    { segment: "Commodity process manufacturers (bulk chemicals, cement, basic materials)", avgFit: "25-35%", reason: "Razor-thin margins, price-driven, minimal differentiation opportunity; technology spend is tightly constrained and conservative" },
    { segment: "Very small job shops (<20 employees, owner-operator)", avgFit: "15-25%", reason: "Minimal technology budget; owner-operator decision-making optimizes for simplicity and survival; tiny deal size" },
    { segment: "Manufacturers mid-ERP-replacement (implementation in progress)", avgFit: "20-30%", reason: "All budget, attention, and organizational capacity absorbed by the ERP program; nothing adjacent gets funded until go-live stabilizes" },
  ],
  keySignals: {
    positive: [
      "ERP or MES replacement/modernization project budgeted or underway",
      "New VP Operations, Plant Manager, CIO, or COO (first 6 months)",
      "OEE below 65% or significant unplanned downtime (efficiency pressure)",
      "Capacity utilization above 80% driving capex / expansion investment",
      "FDA warning letter, OSHA citation, or failed audit (compliance trigger)",
      "CMMC certification deadline approaching (defense supply chain)",
      "Reshoring or nearshoring initiative (new facility buildout)",
      "Labor shortage driving automation / cobot / workforce augmentation investment",
      "Supply chain disruption driving inventory and planning system overhaul",
      "New product introduction (NPI) requiring PLM or engineering tool investment",
      "Sustainability / ESG reporting requirements driving data-collection investment",
    ],
    negative: [
      "Recently completed a major ERP/MES go-live -- budget and appetite exhausted for 12-18 months",
      "Plant in shutdown, restructuring, or significant layoffs (survival mode)",
      "Locked into a multi-year enterprise agreement with SAP, Siemens, or Rockwell",
      "Owner-operator with no IT staff and no technology budget beyond basic accounting",
      "Process manufacturer with fully automated continuous-flow operation and minimal change appetite",
    ],
  },
};

// -- MANUFACTURING DISCOVERY QUESTIONS --
// Injected into discovery question generation for manufacturing-vertical accounts.
// Organized by RIVER stage.

export const MANUFACTURING_DISCOVERY = `
MANUFACTURING DISCOVERY ANGLES (use when the prospect is a manufacturer -- discrete, process, hybrid, OEM, contract manufacturer, or job shop -- or a manufacturing technology/services provider):

REALITY stage -- current state:
- What type of manufacturing do you do -- discrete, process, or hybrid -- and what are your primary product lines?
- What's your current technology stack across the operation: ERP, MES, PLM, SCADA, quality system, maintenance system? Where are the biggest gaps or pain points?
- How do you track OEE, throughput, and yield today -- real-time dashboards, shift-end reports, or manual collection?
- What's your IT/OT landscape -- are IT and operations on separate systems, budgets, and teams, or are you converging?
- What regulatory frameworks govern your operations (ISO, FDA, OSHA, ITAR, CMMC, AS9100, IATF 16949), and where are you in your compliance posture?

IMPACT stage -- quantify the cost:
- What's your current OEE, and what would a 5-point improvement translate to in throughput and revenue?
- How much unplanned downtime do you experience, and what's the cost per hour of a production line being down?
- What's your scrap/rework rate, and what does yield loss cost you annually?
- How much time do your operators, supervisors, and engineers spend on manual data collection, paper-based processes, or working around system gaps?
- What's the cost of a compliance failure -- an FDA 483, an OSHA citation, a failed customer audit -- in direct penalties and lost business?
- For job shops: what's your quote-to-cash cycle time, and how much revenue do you lose from inaccurate quotes or missed delivery dates?

VISION stage -- frame the future:
- What does your ideal smart factory or Industry 4.0 roadmap look like, and where are you on that journey?
- How are you thinking about predictive maintenance vs reactive/preventive -- and what data infrastructure would that require?
- If you could have real-time visibility across every machine, line, and facility, what decisions would you make differently?
- How are you planning to address the skilled-labor shortage -- automation, cobots, workforce augmentation, training technology?
- What's your digital twin, simulation, or virtual commissioning ambition?

ENTRY POINTS -- who owns what:
- VP / SVP Operations (throughput, OEE, cost, quality, safety, delivery -- the operational P&L)
- Plant Manager (facility-level production, staffing, maintenance, safety)
- CIO / VP IT (ERP, enterprise IT, cybersecurity, data/analytics, cloud)
- VP Supply Chain / Procurement (sourcing, logistics, demand planning, S&OP)
- VP Engineering / CTO (product design, R&D, process engineering, NPI, PLM)
- Quality Director / VP Quality (QMS, regulatory compliance, audits, CAPA)
- CFO / VP Finance (capex allocation, ROI analysis, make-vs-buy decisions)
- VP / Director of Maintenance / Reliability (asset management, predictive maintenance, MRO)

ROUTE -- fastest path to yes:
- Pilot scoped to a single production line, cell, or facility to contain integration complexity and demonstrate measurable OEE / throughput / yield / downtime ROI.
- Identify whether the budget is capex or opex -- this determines the approval path, the ROI model, and the timeline.
- Speak the language of the plant floor: OEE, throughput, yield, cycle time, changeover time, first-pass yield, MTBF, MTTR. Generic "digital transformation" framing will be ignored.
- In multi-plant organizations, find the "lighthouse plant" -- the facility with the most progressive plant manager and the strongest IT/OT maturity. Win there, then scale.
- Regulatory and certification deadlines create non-discretionary buying triggers -- align your timeline to their compliance calendar.
`;

// -- MANUFACTURING VERTICAL PLAYBOOK --
// Mirrors the verticalPlaybooks.js structure.

export const MANUFACTURING_PLAYBOOK = {
  name: "Manufacturing",
  keywords: [
    "manufacturer", "manufacturing", "discrete manufacturing",
    "process manufacturing", "OEM", "contract manufacturer",
    "job shop", "fabrication", "machining", "assembly",
    "production line", "shop floor", "plant operations",
    "Industry 4.0", "smart factory", "industrial IoT",
    "MES", "manufacturing execution", "PLM", "SCADA",
    "OEE", "throughput", "lean manufacturing",
    "automotive manufacturing", "aerospace manufacturing",
    "food manufacturing", "chemical manufacturing",
    "pharmaceutical manufacturing", "medical device manufacturing",
    "electronics manufacturing", "EMS",
  ],
  personas: [
    "VP Operations", "SVP Operations", "COO",
    "Plant Manager", "Director of Manufacturing",
    "CIO", "VP IT", "CTO",
    "VP Supply Chain", "VP Procurement",
    "VP Engineering", "Director of Engineering",
    "Quality Director", "VP Quality",
    "CFO", "VP Finance",
    "Director of Maintenance", "VP Reliability",
    "Director of EHS", "VP Safety",
    "Director of Continuous Improvement",
  ],
  triggers: [
    "ERP or MES replacement/modernization project",
    "New VP Operations, COO, Plant Manager, or CIO (first 6 months)",
    "OEE deterioration or unplanned downtime spike",
    "Capacity expansion or new facility buildout (reshoring/nearshoring)",
    "FDA warning letter, OSHA citation, or failed customer audit",
    "CMMC certification deadline (defense manufacturers)",
    "Supply chain disruption forcing planning/inventory system overhaul",
    "Labor shortage driving automation or cobot investment",
    "New product introduction (NPI) requiring engineering tool investment",
    "M&A integration (consolidating operations across acquired plants)",
    "Sustainability / ESG reporting mandate from customers or regulators",
    "Customer-mandated certification (AS9100, IATF 16949, ISO 13485)",
  ],
  disqualifiers: [
    "Treating 'manufacturing' as one market (discrete vs process vs hybrid differ entirely; sub-verticals within each differ further)",
    "Ignoring the IT/OT divide -- pitching an IT solution to an OT buyer, or vice versa",
    "No integration path to ERP (SAP, Oracle, Infor, Epicor) or OT systems (Rockwell, Siemens, Schneider)",
    "Generic 'digital transformation' pitch without operational specificity (OEE, throughput, yield)",
    "Underestimating the capex vs opex budget distinction",
    "ITAR/DFARS/CMMC ignorance when selling to defense manufacturers",
    "FDA/cGMP ignorance when selling to food, pharma, or medical device manufacturers",
    "Pitching cloud-only to a manufacturer with air-gapped OT networks and no cloud appetite",
    "Assuming digital maturity -- most mid-market plants still have significant manual processes",
  ],
  compliance: [
    "OSHA -- workplace safety, PSM (Process Safety Management)",
    "EPA -- Clean Air Act, Clean Water Act, RCRA, TSCA, TRI reporting",
    "ISO 9001 -- quality management (universal baseline)",
    "ISO 14001 -- environmental management",
    "ISO 45001 -- occupational health and safety management",
    "ITAR -- International Traffic in Arms Regulations (defense/aerospace)",
    "DFARS / CMMC -- defense supply chain cybersecurity",
    "AS9100 -- aerospace quality management",
    "IATF 16949 -- automotive quality management",
    "FDA cGMP -- current Good Manufacturing Practice (food, pharma, medical devices)",
    "FSMA -- Food Safety Modernization Act",
    "ISO 13485 -- medical device quality management",
    "REACH / RoHS -- hazardous substances (electronics, chemicals)",
    "NIST 800-171 -- controlled unclassified information (defense supply chain)",
  ],
  usps: [
    "Integration depth with manufacturing ERP (SAP, Oracle, Infor, Epicor) and OT platforms (Rockwell, Siemens, Schneider)",
    "OEE / throughput / yield impact quantification -- ROI in manufacturing economics terms",
    "Sub-vertical specificity (discrete vs process; automotive vs aerospace vs food vs pharma)",
    "IT/OT convergence capability -- bridging enterprise IT and shop-floor OT",
    "Compliance and audit-readiness support for relevant regulatory frameworks",
    "Named manufacturing references in the same sub-vertical and size tier",
    "Edge / on-prem deployment option for air-gapped or latency-sensitive OT environments",
  ],
  heuristics: [
    "Subdivide manufacturing first -- discrete, process, and hybrid are different worlds; sub-verticals within each differ further",
    "OEE is the universal scoreboard -- frame every value proposition as OEE, throughput, yield, or downtime impact",
    "IT and OT are separate domains with separate budgets, teams, and cultures -- understand which side you sell to",
    "Capex vs opex determines the buying process: capex = CFO approval, depreciation schedule, longer cycle; opex = departmental budget, faster approval",
    "The labor shortage is the most universal pain point -- any solution that reduces labor dependency or augments workers has immediate relevance",
    "Regulatory compliance creates non-discretionary buying triggers with hard deadlines -- align to the compliance calendar",
    "Shop-floor credibility is earned, not assumed. Use manufacturing language (OEE, MTBF, MTTR, first-pass yield, changeover time), not SaaS language",
    "Mid-market manufacturers (100-2,000 employees) are the sweet spot: real budgets, meaningful operational complexity, accessible decision-makers",
    "The 'lighthouse plant' strategy works: win the most progressive facility first, prove ROI, then scale across the enterprise",
    "Most manufacturers are NOT digitally mature despite Industry 4.0 hype -- meet them where they are, not where the analyst reports say they should be",
  ],
};
