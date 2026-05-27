// src/data/governmentKnowledge.js
//
// U.S. Government & Public Sector industry knowledge layer --- federal,
// state/local (SLED), defense, civilian agencies, GovCon, procurement,
// FedRAMP, CMMC, contract vehicles, and the full public-sector sales stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_GOVERNMENT (populated by fetchKnowledgeLayer()).
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
//   USAspending.gov (federal obligation data):
//     usaspending.gov
//   Federal Procurement Data System (FPDS):
//     fpds.gov
//   GSA (General Services Administration):
//     gsa.gov
//   GAO (Government Accountability Office) reports:
//     gao.gov
//   Deltek/GovWin IQ (federal market intelligence):
//     govwin.com
//   Bloomberg Government (BGOV):
//     aboutbgov.com
//   Federal News Network:
//     federalnewsnetwork.com
//   FCW / Nextgov / GCN:
//     fcw.com, nextgov.com, gcn.com
//   Govini (defense analytics):
//     govini.com
//   CISA (Cybersecurity and Infrastructure Security Agency):
//     cisa.gov

export const GOVERNMENT_PLAYBOOK = {
  name: "Government & Public Sector",
  keywords: [
    "government", "federal", "state", "local", "municipal",
    "DoD", "defense", "civilian agency", "FedRAMP", "StateRAMP",
    "FISMA", "CMMC", "FAR", "DFARS", "GSA Schedule",
    "GWAC", "IDIQ", "BPA", "GovCon", "SBIR", "STTR",
    "SAM.gov", "prime contractor", "subcontractor", "SLED",
    "procurement", "RFP", "RFI", "sole source", "competitive bid",
    "set-aside", "8(a)", "HUBZone", "SDVOSB", "WOSB",
    "public safety", "smart city", "GovTech", "civic tech",
    "ATO", "authority to operate", "contracting officer",
    "program manager", "appropriations", "continuing resolution",
    "defense industrial base", "OTA", "other transaction authority",
  ],
  personas: [
    "CIO", "CTO", "CISO",
    "Contracting Officer", "Program Manager",
    "Deputy Secretary", "Chief Data Officer",
    "Chief AI Officer", "IT Director",
    "Budget Director", "Agency Head",
    "Procurement Director",
  ],
  discovery: [
    "What contract vehicles do you currently hold or have access to -- and which ones are expiring or up for recompete in the next 12-18 months?",
    "Where are you in the FedRAMP or StateRAMP authorization process, and what impact level are you targeting (High, Moderate, Low)?",
    "How does your solution align with the agency's current modernization priorities -- zero trust, cloud migration, AI adoption, or data analytics?",
    "What's the agency's procurement timeline relative to the fiscal year -- are we inside the year-end spend window or planning for next year's budget cycle?",
    "Do you have relevant past performance references in federal or SLED, and are they documented in CPARS or equivalent state systems?",
    "Is this opportunity a full-and-open competition, a set-aside (8(a), HUBZone, SDVOSB, WOSB), or a sole-source justification -- and do you meet the eligibility requirements?",
    "Who are the key decision-makers on the government side -- the contracting officer, the COR/technical evaluator, the program office, and the CIO/CISO -- and what are their respective evaluation criteria?",
  ],
  disqualifiers: [
    "No FedRAMP or StateRAMP authorization when selling cloud services to government buyers",
    "No contract vehicle access (GSA Schedule, GWAC, IDIQ) and no teaming partner who holds one",
    "Zero past performance in government -- no CPARS records, no subcontracting history, no SBIR/STTR awards",
    "Treating government procurement like commercial sales -- ignoring FAR/DFARS, color teams, and formal evaluation criteria",
    "Product requires on-prem deployment but prospect agency has a cloud-first mandate (or vice versa)",
    "No understanding of the agency's fiscal year cycle, appropriations status, or budget authority",
  ],
  triggerEvents: [
    "Fiscal year end approaching (September 30 federal / June 30 most states) -- use-it-or-lose-it budget pressure",
    "Continuing resolution (CR) or government shutdown creating procurement uncertainty and delayed new-start programs",
    "New presidential administration or governor setting new technology priorities via executive orders and budget requests",
    "Executive orders on cybersecurity (EO 14028), AI safety (EO 14110), or other technology mandates creating compliance deadlines",
    "Major cyber incident at a federal agency or state government triggering emergency security procurements",
    "ATO (Authority to Operate) expiration or renewal forcing re-evaluation of existing solutions and potential competitive rebid",
    "New or recompeted contract vehicles (GWAC, BPA, IDIQ) opening market access for new entrants",
    "Agency modernization mandates (cloud migration, zero trust, AI adoption) with dedicated appropriated funding",
  ],
  layerContent: `---
title: "Government & Public Sector --- Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_cybersecurity_knowledge_layer.md
  - cambrian_compliance_knowledge.md
  - cambrian_ai_ml_knowledge_layer.md
  - cambrian_healthcareSaas_knowledge_layer.md
tags: [government, federal, SLED, DoD, defense, civilian, FedRAMP, CMMC, FAR, DFARS, GovCon, procurement, RFP, GSA, GWAC, IDIQ, ATO, zero-trust, smart-city, GovTech]
last_updated: 2026-05-26
status: production
confidence: high (USAspending.gov; FPDS; GSA; GAO; Deltek/GovWin; BGOV; Federal News Network; FCW; Nextgov; Govini)
---

# Government & Public Sector --- Knowledge Layer

> **Working thesis.** U.S. federal IT spending exceeds $100B annually, with the Department of Defense accounting for roughly half. State, local, and education (SLED) IT spending adds another $100B+ [verified 05/2026, Deltek/GovWin; BGOV]. The government technology market is structurally distinct from commercial enterprise: procurement is governed by the Federal Acquisition Regulation (FAR) and its defense supplement (DFARS); buying cycles align to fiscal years, not business quarters; contract vehicles (GSA Schedule, GWACs, IDIQs) gate market access; and compliance frameworks (FedRAMP, CMMC, FISMA) create hard barriers to entry. **The dominant 2026 dynamics are: (a) zero trust mandate implementation across federal agencies (per EO 14028 and OMB M-22-09); (b) AI adoption under the AI EO 14110 framework; (c) cloud migration acceleration under Cloud Smart; (d) CMMC 2.0 enforcement reshaping the defense industrial base; (e) FedRAMP Rev 5 alignment with NIST 800-53 Rev 5; and (f) fiscal year pressure under continuing resolutions.** For Cambrian's seller-users, government is a vertical with massive budgets, long sales cycles, high barriers to entry, and extraordinary stickiness once a contract is won.

> **What makes government distinct.** Three things: (1) **procurement is a legal process, not a business negotiation** -- the contracting officer (CO) has sole legal authority to bind the government; FAR violations can result in contract protests, suspensions, and debarments; (2) **budget cycles dominate timing** -- federal fiscal year ends September 30, most states end June 30, and the "use-it-or-lose-it" dynamic creates massive Q4 (July-September) spending surges; (3) **compliance is a gating function** -- without FedRAMP authorization (for cloud), CMMC certification (for DoD), or an active contract vehicle, you literally cannot sell to the government regardless of product quality.

---

## 1. Market sizing and contract types

| Metric | Value |
|---|---|
| Federal IT spending (FY2025) | ~$105B total; ~$58B DoD, ~$47B civilian [verified 05/2026, BGOV Federal IT Dashboard] |
| SLED IT spending (2025) | ~$110B across state, local, and education [verified 05/2026, Deltek/GovWin] |
| Federal contract obligations (FY2024) | ~$765B total across all categories [verified 05/2026, USAspending.gov] |
| DoD contract obligations (FY2024) | ~$440B [verified 05/2026, USAspending.gov] |
| Number of federal contractors (active in SAM.gov) | ~350,000+ entities [verified 05/2026, SAM.gov] |
| Small business share of federal contracts | ~26% of eligible contract dollars (statutory goal: 23%) [verified 05/2026, SBA] |
| Average time to FedRAMP authorization | 12-18 months; $500K-$2M+ cost [verified 05/2026, FedRAMP PMO] |
| CMMC Level 2 assessment cost (estimated) | $50K-$200K depending on scope [verified 05/2026, Cyber AB] |

### Contract types (structural -- durable)

| Type | Description | Risk allocation |
|---|---|---|
| **Firm Fixed Price (FFP)** | Set price for defined deliverables; most common | Contractor bears cost risk |
| **Time & Materials (T&M)** | Hourly labor rates + materials; for uncertain scope | Government bears cost risk; ceiling price typical |
| **Cost-Plus (CP)** | Reimbursable costs plus fee; for R&D and complex programs | Government bears most cost risk; extensive audit requirements |
| **IDIQ (Indefinite Delivery/Indefinite Quantity)** | Framework contract with task order competitions | Flexible; min/max quantities; task orders compete among holders |
| **BPA (Blanket Purchase Agreement)** | Simplified ordering for recurring needs under $250K | Streamlined; used under GSA Schedule |

---

## 2. Named landscape --- primes, GovTech, and major agencies

### Major prime contractors and integrators

| Company | Primary domain | Government relevance |
|---|---|---|
| **Lockheed Martin** | Defense, aerospace, IT | Largest defense contractor; F-35, missile defense, space systems; significant IT/cyber portfolio |
| **RTX (Raytheon)** | Defense, aerospace | Missiles, sensors, radar, cybersecurity; major DoD platform provider |
| **Booz Allen Hamilton** | Consulting, analytics, cyber | Largest government consulting firm; defense, intelligence, civilian analytics; major cyber practice |
| **SAIC** | IT services, engineering | Federal IT modernization, systems engineering, training; post-Engility/Unisys Federal merger |
| **Leidos** | IT, engineering, science | Defense IT, health IT, civil infrastructure; former SAIC national security business |
| **Accenture Federal Services** | Consulting, IT, digital | Civilian and defense digital transformation; cloud migration; data analytics |
| **Deloitte Government** | Consulting, advisory, cyber | Large federal consulting practice; health, defense, civilian agencies; implementation services |
| **General Dynamics IT** | IT services, cloud, cyber | Major federal cloud and IT infrastructure provider; operates milCloud and other secure hosting |
| **Perspecta (now part of Peraton)** | IT, mission services | Intelligence community, defense, civilian IT; merged into Peraton ecosystem |
| **ManTech (now part of Carlyle)** | Cyber, IT, intelligence | Defense and intelligence IT; cyber operations; taken private by Carlyle Group |

### GovTech and emerging players

| Company | Category | Government relevance |
|---|---|---|
| **Palantir** | Data analytics, AI/ML | Gotham (defense/intel), Foundry (commercial/gov); major Army, IC, and HHS contracts; AIP (AI Platform) |
| **Anduril** | Defense tech, autonomy | Lattice platform; counter-drone, border security, autonomous systems; new-model defense contractor |
| **Carahsoft** | Channel/distributor | The "master government aggregator"; distributes 200+ IT vendors into government; critical channel partner |
| **Immix Group / DLT (now TD SYNNEX Public Sector)** | Channel/distributor | Government IT distribution; contract vehicle access; partner ecosystem |
| **Microsoft** | Cloud, productivity, security | Azure Government; M365 GCC/GCC High; largest enterprise software footprint in government |
| **AWS** | Cloud infrastructure | AWS GovCloud (IL2-IL5); CIA $10B+ cloud contract; dominant in IC and civilian |
| **Google Cloud** | Cloud, data, AI | Google Public Sector division; BeyondCorp zero trust; growing federal presence |
| **ServiceNow** | IT service management | Federal ITSM standard; FedRAMP authorized; workflow automation across agencies |

### Major federal agencies by IT spend

| Agency | Approximate IT budget | Key priorities |
|---|---|---|
| **Department of Defense (DoD)** | ~$58B [verified 05/2026, BGOV] | JADC2, zero trust, CMMC, cloud migration, AI/ML, cyber operations |
| **Department of Veterans Affairs (VA)** | ~$8B [verified 05/2026, BGOV] | EHR modernization, telehealth, benefits modernization |
| **Department of Homeland Security (DHS)** | ~$8B [verified 05/2026, BGOV] | Cybersecurity (CISA), border technology, immigration systems |
| **Department of Health and Human Services (HHS)** | ~$7B [verified 05/2026, BGOV] | Healthcare.gov, Medicare/Medicaid systems, data analytics |
| **Department of Treasury** | ~$5B [verified 05/2026, BGOV] | IRS modernization, financial systems, fraud detection |
| **NASA** | ~$3B [verified 05/2026, BGOV] | Mission systems, data analytics, cloud, scientific computing |
| **Intelligence Community (IC)** | Classified; estimated $15B+ IT [verified 05/2026, BGOV] | Cloud (C2E), AI/ML, cyber, signals intelligence, data fusion |

---

## 3. Procurement --- FAR, contract vehicles, and the acquisition process

### Federal Acquisition Regulation (FAR) structure

- **FAR** (48 CFR) -- the primary regulation governing all federal acquisitions. Covers competition requirements, contract types, socioeconomic programs, ethics, and protest rights.
- **DFARS** (48 CFR Chapter 2) -- Defense FAR Supplement; additional rules for DoD acquisitions including CMMC, supply chain risk management, and controlled unclassified information (CUI).
- **Agency-specific supplements** -- HHSAR (HHS), HSAR (DHS), NASA FAR Supplement, etc.

### Major contract vehicles (structural -- durable)

| Vehicle | Administered by | Scope | Why it matters |
|---|---|---|---|
| **GSA Schedule (MAS)** | GSA | IT, professional services, products | Most widely used contract vehicle; pre-negotiated pricing; simplified ordering; $25B+ annual sales |
| **SEWP V/VI** | NASA | IT hardware, software, services | Fastest-growing GWAC; ~$15B+ annual obligations; very fast ordering; strong for product sales [verified 05/2026, NASA SEWP] |
| **Alliant 2** | GSA | IT services | Large IT services GWAC; ~$50B ceiling; complex solutions; systems integration |
| **VETS 2** | VA | IT services (SDVOSB set-aside) | Service-disabled veteran-owned small business GWAC; $5B ceiling |
| **CIO-SP3 / CIO-SP4** | NIH | IT services, health IT | Major health IT and general IT services vehicle; CIO-SP4 in transition [verified 05/2026, NIH NITAAC] |
| **8(a) STARS III** | GSA | IT services (8(a) set-aside) | SBA 8(a) program participants; $50B ceiling; small business gateway |
| **OASIS+** | GSA | Professional services (including IT) | Best-in-class multi-agency vehicle; replaced OASIS and several legacy vehicles [verified 05/2026, GSA] |

### Procurement methods

| Method | Threshold/context | Process |
|---|---|---|
| **Micro-purchase** | Under $10K ($25K for DoD) | Government purchase card; minimal competition required |
| **Simplified acquisition** | $10K-$250K | Streamlined procedures; fewer documentation requirements |
| **Full and open competition** | Above SAT; default method | Public solicitation; all eligible offerors may compete |
| **Set-aside** | Small business, 8(a), HUBZone, SDVOSB, WOSB | Restricted competition to eligible socioeconomic categories |
| **Sole source** | Justified by unique capability, urgency, or J&A | Single vendor; requires formal justification and approval |
| **OTA (Other Transaction Authority)** | Research, prototyping, production follow-on | Exempt from FAR; faster procurement; used by DoD and DHS for innovation |

### Evaluation criteria

- **Lowest Price Technically Acceptable (LPTA)** -- price wins once minimum technical threshold is met. Used for commodity purchases. Vendors hate it; contracting officers use it for simplicity.
- **Best Value Trade-Off** -- evaluation considers price, technical approach, past performance, management, and other factors. Most common for complex IT acquisitions. Technical can outweigh price.
- **Protest process** -- losing bidders can protest to the GAO (within 10 days of award or debrief) or the Court of Federal Claims. GAO sustain rate is ~12-15% [verified 05/2026, GAO]. Protests delay awards 60-100+ days. Incumbents use protests strategically.

---

## 4. Buying committees --- who has authority

| Role | What they control | Their lens |
|---|---|---|
| **Contracting Officer (CO/KO)** | Sole legal authority to bind the government; signs the contract | "Is this compliant with FAR? Is competition satisfied? Is the price fair and reasonable?" |
| **Contracting Officer's Representative (COR)** | Technical oversight of contract performance; the CO's eyes and ears | "Is the vendor delivering what they promised? Are they meeting SLAs?" |
| **Program Manager (PM)** | Defines requirements; owns the mission need; controls the requirement document | "Does this solve my mission problem? Can I justify this to my leadership?" |
| **CIO / Chief Information Officer** | IT investment oversight; FITARA authority; technology standards | "Does this align with our IT modernization strategy? Is it on our approved product list?" |
| **CISO** | Cybersecurity authorization (ATO); security requirements | "Can this get an ATO? Does it meet our security baseline? NIST 800-53 controls?" |
| **Budget/Comptroller Office** | Funding availability; color of money (O&M vs. procurement vs. RDT&E) | "Is there budget authority for this? Is the right appropriation being used?" |
| **Small Business Office (OSDBU)** | Set-aside recommendations; small business utilization goals | "Can this requirement be set aside for small business? What's our SB utilization rate?" |
| **Agency Counsel / Legal** | Legal sufficiency review; protest defense; ethics | "Is the J&A sufficient? Are there OCI issues? Will this survive a protest?" |

### Decision dynamics unique to government

- **FITARA** (Federal IT Acquisition Reform Act) gives the agency CIO authority over all IT investments. CIO sign-off is required for IT acquisitions above threshold.
- **Color of money** matters: Operations & Maintenance (O&M) funds are 1-year money (expires Sep 30); Procurement funds are 3-year; RDT&E funds are 2-year. Using the wrong color is an Anti-Deficiency Act violation (criminal penalty).
- **The CO has veto power.** A program manager can want your product desperately, but the CO decides how (and whether) to buy it. Never bypass the CO.
- **Requirements generation** is separate from acquisition. The program office writes the Statement of Work (SOW) or Statement of Objectives (SOO); the contracting office executes the procurement. Influencing the requirements is the most important pre-RFP activity.

---

## 5. Trigger events --- when government buying accelerates

| Trigger | What it signals | Sales implication |
|---|---|---|
| **Fiscal year end (Sep 30 federal / Jun 30 most states)** | Use-it-or-lose-it budget pressure; unobligated funds must be spent | Q4 (Jul-Sep) is the government buying surge; 30-40% of annual obligations occur in Q4 [verified 05/2026, USAspending.gov]. Be positioned by May. |
| **Continuing resolution (CR)** | No new appropriations; agencies operate at prior-year levels; no new-start programs | Existing contracts continue; new competitions stall; incumbents advantaged; push new deals to after CR ends |
| **New administration priorities** | New president/governor sets technology agenda via executive orders and budget requests | First 100 days produce executive orders; first budget request (Feb) signals priorities; align messaging to new mandates |
| **Executive orders (AI EO 14110, Cyber EO 14028)** | Compliance deadlines for agencies; mandated adoption of specific technologies | Map product capabilities to EO requirements; agencies must report compliance; creates non-discretionary demand |
| **Major cyber incident at agency** | Emergency procurement authority; CISA directives; supplemental appropriations | Binding Operational Directives (BODs) from CISA require specific actions within tight timelines; drives security tool purchases |
| **ATO expiration or renewal** | Authorization to Operate must be renewed (typically every 3 years); forces re-evaluation | ATO renewal is a natural competitive entry point; incumbent must re-demonstrate compliance; challenger can offer superior security posture |
| **New/recompeted contract vehicles** | GWACs, BPAs, and IDIQs have finite periods of performance; recompetes open the market | Getting on a new vehicle is a 3-5 year market access decision; miss the on-ramp and you're locked out until next recompete |
| **Agency modernization mandates** | Cloud Smart, zero trust, AI adoption with dedicated funding lines | Appropriated modernization funds (e.g., TMF -- Technology Modernization Fund) are earmarked and must be spent on designated initiatives |

---

## 6. Competitive dynamics --- prime/sub, teaming, and incumbent advantage

### Prime vs. subcontractor dynamics

- **Primes** hold the contract and manage the government relationship. They bear performance risk, manage subcontractors, and control task order allocation.
- **Subcontractors** perform specific scopes under a prime. Subcontracting is the most common entry strategy for companies without past performance or contract vehicles.
- **Teaming agreements** are formed pre-proposal. Prime and sub agree to roles, work share, and terms. Choosing the wrong prime (or being on a losing team) wastes 6-12 months of BD investment.
- **Mentor-Protege programs** (DoD and SBA) allow large primes to mentor small businesses, providing past performance credit and contract access.

### Incumbent advantage

- Government has extreme incumbent preference. Incumbents have past performance, institutional knowledge, cleared personnel, and existing ATOs.
- Displacing an incumbent requires demonstrating a significant capability gap, cost savings, or a mandatory recompete.
- **Bridge contracts** and **sole-source extensions** keep incumbents in place for years beyond original contract periods.
- The most effective displacement strategy is winning a subcontract position, building past performance and relationships, then competing as prime on the next recompete.

### OTA and commercial solutions opening

- **Other Transaction Authority (OTA)** is exempt from FAR. Used for prototyping and production by DoD, DHS, NASA, and other agencies. Faster procurement; more commercial-friendly.
- **Commercial Solutions Opening (CSO)** is a streamlined process for buying commercial and commercial-type products. Growing in use across DoD.
- Both OTA and CSO are key entry points for non-traditional defense companies (startups, commercial tech firms) that lack traditional GovCon infrastructure.

---

## 7. Regulatory overlay --- compliance as gating function

| Framework | Scope | Impact on selling |
|---|---|---|
| **FAR (48 CFR)** | All federal acquisitions | Must understand FAR compliance to participate; non-compliance is grounds for protest or debarment |
| **DFARS** | DoD acquisitions | Additional cybersecurity (CMMC), supply chain (Section 889), and CUI handling requirements |
| **CMMC 2.0** | Defense Industrial Base (DIB) | 3 levels; Level 2 = NIST 800-171 (110 controls); third-party assessment required for Level 2; enforcement phasing in 2025-2026 [verified 05/2026, DoD] |
| **FedRAMP (Rev 5)** | Cloud services sold to federal agencies | High/Moderate/Low impact levels; aligning to NIST 800-53 Rev 5; ~400 authorized products [verified 05/2026, FedRAMP Marketplace]. Without FedRAMP, you cannot sell cloud to federal. |
| **StateRAMP** | Cloud services sold to state/local government | Modeled on FedRAMP; growing adoption; ~25+ states recognizing StateRAMP [verified 05/2026, StateRAMP] |
| **FISMA** | Federal agencies and contractors | Federal Information Security Modernization Act; requires agency security programs; continuous monitoring; annual reporting |
| **NIST 800-53 Rev 5** | Federal systems | Security and privacy control catalog; the baseline for FedRAMP and FISMA compliance; ~1,000+ controls at High baseline |
| **NIST 800-171 Rev 2/3** | CUI in non-federal systems (contractors) | 110 security requirements; the basis for CMMC Level 2; applies to any contractor handling CUI |
| **Section 508** | All federal IT | Accessibility requirements for disabled users; ICT must conform to WCAG 2.1 Level AA; procurement can be blocked for non-compliance |
| **FIPS 140-3** | Cryptographic modules | Encryption used in federal systems must be FIPS 140-3 validated; many commercial products lack this |
| **EO 14028 (Cybersecurity)** | Federal agencies and their software suppliers | Zero trust architecture, software supply chain security (SBOM), endpoint detection, encryption, MFA; agency deadlines phased through 2025-2026 |
| **EO 14110 (AI Safety)** | Federal agencies using AI | AI risk management, testing, transparency, civil rights protections; NIST AI Risk Management Framework; agencies must inventory AI use cases |
| **Buy American Act / TAA** | Products sold to government | Manufactured in US or TAA-designated countries; non-compliant products cannot be procured under most contracts |

---

## 8. Technology stack --- what agencies are deploying

### Cloud infrastructure

| Platform | Government offering | Adoption |
|---|---|---|
| **AWS GovCloud** | IL2-IL5; FedRAMP High; isolated regions | Largest federal cloud footprint; CIA C2E contract; used across DoD, IC, and civilian [verified 05/2026, AWS] |
| **Microsoft Azure Government** | IL2-IL5; FedRAMP High; Azure Gov Secret/Top Secret | Strong in DoD (JWCC); M365 GCC/GCC High dominant for productivity; growing in IC |
| **Google Cloud Public Sector** | FedRAMP High; IL4/IL5 in progress | Growing but smaller footprint; strong in data analytics and AI/ML workloads |
| **Oracle Cloud Infrastructure (OCI) Government** | FedRAMP High; JWCC awardee | Database workloads; DoD JWCC contract alongside AWS, Azure, Google |

### Key technology mandates and programs

- **Zero Trust Architecture** -- OMB M-22-09 requires federal agencies to achieve specific zero trust maturity goals. Drives identity (ICAM), microsegmentation, continuous monitoring, and encryption investments.
- **CDM (Continuous Diagnostics and Mitigation)** -- DHS/CISA program providing cybersecurity tools to federal agencies. CDM dashboard mandates drive endpoint management, SIEM, and vulnerability management deployments.
- **ICAM (Identity, Credential, and Access Management)** -- PIV/CAC card authentication; phishing-resistant MFA; identity governance. Central to zero trust implementation.
- **CISA Requirements** -- Binding Operational Directives (BODs) and Emergency Directives (EDs) mandate specific security actions within tight timelines. BOD 22-01 (Known Exploited Vulnerabilities catalog) drives patch management.
- **AI/ML Adoption** -- Agencies establishing Chief AI Officers (per EO 14110); AI use case inventories; NIST AI RMF compliance; responsible AI governance. Growing demand for AI platforms, MLOps, and AI safety tools.
- **Shared Services** -- Quality Service Management Offices (QSMOs) for financial management, HR, grants management, and cybersecurity. Consolidation reduces agency-level procurement but creates large centralized opportunities.
- **Low-Code/No-Code Platforms** -- Growing adoption for citizen developers; ServiceNow, Microsoft Power Platform, Appian, Salesforce Government Cloud. Reduces backlog of IT modernization projects.
- **RPA (Robotic Process Automation)** -- Widely adopted for back-office automation; UiPath, Automation Anywhere, Microsoft Power Automate in government.

---

## 9. ICP patterns --- federal vs. SLED, defense vs. civilian

### Federal vs. SLED differences

| Dimension | Federal | SLED (State, Local, Education) |
|---|---|---|
| **Regulatory framework** | FAR/DFARS; strict formal procurement | State-specific procurement codes; less uniform; often simpler |
| **Fiscal year** | October 1 - September 30 | Varies; most states July 1 - June 30; some Jan 1 - Dec 31 |
| **Contract vehicles** | GSA Schedule, GWACs, agency-specific IDIQs | State term contracts, cooperative purchasing (NASPO, E&I, Sourcewell) |
| **Security requirements** | FedRAMP, FISMA, CMMC, NIST 800-53 | StateRAMP (growing), CJIS (law enforcement), state-specific standards |
| **Sales cycle** | 12-24 months typical; 6-18 months on existing vehicles | 6-18 months; can be faster with cooperative contracts |
| **Decision-makers** | CO, CIO (FITARA), PM, CISO | CIO, Procurement Director, elected officials, IT Director |

### Defense vs. civilian

| Dimension | Defense / Intelligence | Civilian agencies |
|---|---|---|
| **Budget** | ~$58B IT; larger individual programs | ~$47B IT; more distributed across agencies |
| **Clearance requirements** | SECRET and TS/SCI common; personnel clearances required | Mostly public trust / moderate risk; some agencies require SECRET |
| **Security classification** | Classified systems common; IL4/IL5/IL6 cloud | Mostly unclassified; FedRAMP Moderate sufficient |
| **Procurement culture** | Mission-focused; OTA common; faster for prototyping | Cost-focused; LPTA more common; formal FAR processes |
| **Key primes** | Lockheed, RTX, Booz Allen, Leidos, SAIC, Northrop | Accenture Federal, Deloitte, SAIC, Leidos, Maximus |

### ATO timeline and deployment considerations

- **ATO (Authority to Operate)** takes 12-18 months for new systems in most agencies. Some agencies (DoD with cATO, reciprocity programs) can be faster.
- **On-prem vs. cloud vs. hybrid** depends on agency cloud mandate, data classification, and existing infrastructure. Cloud-first is the default for new systems; legacy on-prem persists.
- **Past performance** is a critical evaluation factor. Agencies want CPARS-documented performance on similar contracts. No past performance = no win on a competitive bid (except small business set-asides with alternative experience).
- **Clearance requirements** can disqualify vendors. If your delivery team needs TS/SCI clearances and doesn't have them, you need a cleared subcontractor.

---

## 10. Common failure modes

1. **Ignoring procurement cycles.** Government doesn't buy on your timeline; it buys on the fiscal year cycle. Approaching an agency in October (new fiscal year) with a new requirement means a 9-12 month wait. Approaching in July with an existing vehicle can close in weeks.
2. **Not having past performance.** Government evaluators weight past performance heavily. A startup with a superior product but no CPARS record loses to an incumbent with documented past performance every time. Build past performance through subcontracting, SBIR/STTR, or pilot programs.
3. **Missing set-aside eligibility.** Over 25% of federal contracts are set aside for small business categories (8(a), HUBZone, SDVOSB, WOSB). If you're eligible, these are less competitive paths to market. If you're not eligible and the requirement is set aside, you can't compete.
4. **Underestimating ATO timeline.** "We'll get FedRAMP in 6 months" is a red flag for government buyers. FedRAMP takes 12-18 months and $500K-$2M+. Plan for it or partner with a FedRAMP-authorized provider.
5. **Treating government like commercial sales.** There is no "let me talk to your manager" in government. The CO is the legal authority. Going around the CO is an ethics violation. The evaluation criteria are published in the RFP -- you can't sell on features not in the evaluation factors.
6. **Not understanding color teams.** Government proposal development uses a color team review process (Blue = compliance, Pink/Red = initial/critical review, Gold = final). Proposals are scored against written evaluation criteria. A slick marketing pitch fails; a compliant, responsive proposal wins.
7. **Assuming one government is one market.** DoD, civilian federal, intelligence community, state government, local government, and education are separate markets with separate procurement rules, buyers, budgets, and culture. A strategy that works for civilian agencies will not work for DoD.
8. **Failing to build relationships pre-RFP.** By the time an RFP drops, requirements are largely set. The winners shaped those requirements during market research (RFI responses, industry days, one-on-one meetings). If you first learn about an opportunity at RFP release, you're already behind.

---

## 11. GTM playbook --- how to break into government

### Channel strategy

- **Partner with Carahsoft, Immix/DLT (TD SYNNEX Public Sector), or other government distributors** as your first step. They provide contract vehicle access, agency relationships, and procurement infrastructure. Carahsoft alone distributes 200+ technology vendors into government.
- **Get on contract vehicles.** GSA Schedule (now MAS -- Multiple Award Schedule) is the most versatile. SEWP V/VI is the fastest for product sales. OASIS+ for services. Getting on a vehicle takes 3-6 months but unlocks years of market access.
- **Subcontract to build past performance.** Partner with a prime contractor on an existing contract. Deliver well. Get CPARS credit. Use that past performance to compete as prime on the next opportunity.

### Industry engagement

- **AFCEA** (Armed Forces Communications and Electronics Association) -- defense and intelligence IT community; major conferences and chapter events.
- **DoDIIS** (Department of Defense Intelligence Information System) Worldwide Conference -- intelligence IT community.
- **ATARC** (Advanced Technology Academic Research Center) -- cross-agency IT collaboration.
- **ACT-IAC** (American Council for Technology -- Industry Advisory Council) -- government-industry IT collaboration.
- **GovTechConnect, StateScoop/FedScoop events** -- SLED and federal IT communities.
- **Agency-specific industry days** -- individual agencies host industry days for upcoming procurements; mandatory attendance for serious competitors.

### Hiring strategy

- **Hire former government employees** who understand agency missions, procurement processes, and have existing relationships. Former COs, CIOs, program managers, and policy experts are force multipliers.
- **Ensure personnel have appropriate clearances** for defense and intelligence work. Clearance processing takes 6-18 months for SECRET, longer for TS/SCI.
- **Build a capture team** -- government BD requires dedicated capture managers who work opportunities 12-24 months before RFP release.

### Small business entry strategies

- **SBIR/STTR** -- Small Business Innovation Research and Small Business Technology Transfer programs provide non-dilutive funding (Phase I: ~$50K-$250K; Phase II: ~$500K-$1.5M; Phase III: sole-source production contracts with no ceiling). Over $4B annually across agencies [verified 05/2026, SBA].
- **8(a) Program** -- SBA certification for economically disadvantaged small businesses; access to sole-source contracts up to $4.5M; 8(a) STARS III GWAC.
- **HUBZone** -- Businesses in Historically Underutilized Business Zones; 3% government-wide goal; price evaluation preference.
- **Mentor-Protege** -- Partnership with a large prime; joint ventures; access to large contract opportunities while building capability.

---

## 12. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cybersecurityKnowledge.js\` | FedRAMP, CMMC, zero trust mandates, CISA directives, and NIST frameworks are cybersecurity requirements that gate government technology sales |
| \`complianceKnowledge.js\` | FAR/DFARS compliance, FISMA, NIST 800-53/171, Section 508 accessibility, and regulatory frameworks that govern government procurement |
| \`aiMlKnowledge.js\` | AI Executive Order 14110, agency Chief AI Officers, NIST AI RMF, responsible AI governance, and growing federal AI adoption |
| \`healthcareSaasKnowledge.js\` | VA health IT modernization, MHS (Military Health System), HHS systems, and government healthcare technology procurement |

---

*End of layer. Update cadence: quarterly aligned with federal fiscal year milestones (Q1 Oct-Dec, Q2 Jan-Mar, Q3 Apr-Jun, Q4 Jul-Sep). Critical re-check triggers: new appropriations bills, continuing resolutions, executive orders, FedRAMP Marketplace updates, CMMC enforcement milestones, major contract vehicle recompetes (SEWP, Alliant, OASIS+), USAspending.gov annual data refresh, new administration technology priorities.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const GOVERNMENT_INJECTION = GOVERNMENT_PLAYBOOK.layerContent;
export const GOVERNMENT_SCORING = GOVERNMENT_PLAYBOOK.keywords.join(", ");
export const GOVERNMENT_DISCOVERY = GOVERNMENT_PLAYBOOK.discovery.join("\n");
