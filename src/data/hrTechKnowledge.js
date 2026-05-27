// src/data/hrTechKnowledge.js
//
// U.S. HR Technology & Workforce Management industry knowledge layer —
// HCM, HRIS, payroll, benefits administration, talent acquisition, ATS,
// talent management, WFM, employee experience, people analytics,
// compensation management, L&D, PEO/EOR, and the full HR operations stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_HR_TECH (populated by fetchKnowledgeLayer()).
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
//   Sapient Insights Group, HR Systems Survey (2025-2026):
//     sapientinsights.com
//   Josh Bersin, HR Technology Market Report (2025-2026):
//     joshbersin.com
//   Gartner, Magic Quadrant for Cloud HCM Suites (2025):
//     gartner.com/reviews/market/cloud-hcm-suites
//   IDC, Worldwide HCM and Payroll Applications Forecast (2026):
//     idc.com
//   Everest Group, HCM Technology PEAK Matrix (2025):
//     everestgrp.com
//   SHRM (Society for Human Resource Management):
//     shrm.org
//   Bureau of Labor Statistics:
//     bls.gov
//   Deloitte, Human Capital Trends (2025-2026):
//     deloitte.com/human-capital-trends
//   Grand View Research, HCM Market Report (2025):
//     grandviewresearch.com
//   Verified public filings: Workday, ADP, Paylocity, Paycom, Dayforce

export const HR_TECH_PLAYBOOK = {
  name: "HR Technology",
  keywords: [
    "HR technology", "HCM", "HRIS", "payroll", "benefits administration",
    "talent acquisition", "ATS", "applicant tracking system",
    "talent management", "workforce management", "WFM",
    "employee experience", "people analytics", "compensation management",
    "learning and development", "LMS", "learning management system",
    "PEO", "professional employer organization", "EOR", "employer of record",
    "DEI", "diversity equity inclusion", "workforce planning",
    "time and attendance", "HR compliance", "FMLA", "ACA", "COBRA",
    "ERISA", "open enrollment", "onboarding", "offboarding",
    "performance management", "OKR", "engagement survey", "pulse survey",
    "human capital management", "HR SaaS", "PEPM", "per employee per month",
    "total rewards", "pay equity", "pay transparency",
    "employee self-service", "manager self-service", "HR analytics",
    "recruiting", "credentialing", "background check",
    "deskless workers", "frontline workforce",
  ],
  personas: [
    "CHRO", "Chief Human Resources Officer",
    "VP People", "VP HR", "VP Human Resources",
    "Head of Talent Acquisition", "VP Total Rewards",
    "Director of HR Technology", "Chief People Officer",
    "VP Workforce Planning", "Head of People Analytics",
    "HRIS Manager", "VP Benefits", "Director L&D",
    "CIO", "CFO",
  ],
  discovery: [
    "What does your current HR technology stack look like -- core HCM, payroll, ATS, performance, benefits -- and how integrated are those systems today?",
    "Where are you in the employee lifecycle that causes the most manual work or compliance risk -- onboarding, benefits enrollment, payroll processing, offboarding?",
    "How is your workforce distributed -- fully domestic, global with international employees or contractors, frontline/deskless vs. knowledge workers -- and how does that shape your HR tech needs?",
    "What compliance requirements are driving your HR technology decisions right now (ACA reporting, pay transparency, multi-state payroll, FMLA tracking)?",
    "What's your biggest pain point with your current HRIS/HCM -- and what would need to change for you to consider a platform switch?",
    "How are you thinking about people analytics and workforce planning -- do you have the data infrastructure to answer headcount, attrition, and compensation questions today?",
    "When is your next open enrollment cycle, and how satisfied are you with your current benefits administration platform?",
  ],
  disqualifiers: [
    "No understanding of open enrollment timelines and their impact on buying cycles",
    "Treating HR as a back-office cost center rather than a strategic function with C-suite buyers",
    "Pitching a rip-and-replace HCM when the prospect is mid-implementation or mid-contract on a multi-year platform deal",
    "No awareness of the prospect's employee count thresholds and associated compliance obligations (50 for ACA, 100 for EEO-1)",
    "Ignoring the payroll-as-anchor dynamic -- payroll is the system of record that locks in the HCM relationship",
    "Proposing a point solution without understanding the prospect's platform consolidation or best-of-breed strategy",
  ],
  triggerEvents: [
    "Open enrollment season approaching (Q3-Q4 planning cycle for January effective dates)",
    "M&A or divestiture requiring headcount integration or HRIS consolidation",
    "Reduction in force (RIF) or large-scale layoff creating compliance and offboarding complexity",
    "Return-to-office or hybrid work mandate requiring new WFM and time-tracking capabilities",
    "State or federal pay transparency legislation affecting compensation data management",
    "HRIS or payroll contract coming up for renewal (typically 3-5 year cycles)",
    "Rapid headcount growth (crossing 50, 100, 500, or 1,000+ employee thresholds) triggering new compliance requirements",
    "New CHRO or CPO hire initiating a 90-day technology assessment and vendor review",
  ],
  layerContent: `---
title: "HR Technology & Workforce Management --- Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_compliance_knowledge_layer.md
  - cambrian_manufacturing_knowledge_layer.md
  - cambrian_healthcare_saas_knowledge_layer.md
  - cambrian_pe_holdco_knowledge_layer.md
  - cambrian_b2b_sales_value_creation.md
  - cambrian_smb_midmarket_knowledge_layer.md
tags: [hr-technology, HCM, HRIS, payroll, benefits, talent-acquisition, ATS, WFM, PEO, EOR, people-analytics, performance-management, LMS, compensation, onboarding, compliance, CHRO]
last_updated: 2026-05-26
status: production
confidence: high (Sapient Insights 2025-2026; Josh Bersin 2026; Gartner MQ Cloud HCM 2025; IDC HCM Forecast; Everest Group; SHRM; BLS; Deloitte Human Capital Trends)
---

# HR Technology & Workforce Management --- Knowledge Layer

> **Working thesis.** The global HR technology market exceeds $30B in annual software spend, growing ~10-12% CAGR through 2030 [verified 05/2026, Grand View Research]. U.S. companies account for ~45-50% of global HCM spend. The market is anchored by payroll — the most mission-critical, compliance-laden workload in any enterprise — and expanding outward into talent intelligence, workforce planning, and employee experience. **The dominant 2026 dynamics are: (a) suite vs. best-of-breed tension intensifying as Workday, ADP, and UKG pursue platform consolidation while Rippling, Deel, and Lattice disrupt from below; (b) pay transparency legislation forcing compensation data infrastructure investments; (c) EOR/global payroll explosion as companies hire across borders post-remote-work normalization; (d) AI transforming recruiting (screening, scheduling, bias detection) and people analytics (attrition prediction, workforce planning); (e) open enrollment remaining the immovable forcing function for benefits technology purchasing; and (f) deskless/frontline workforce management emerging as a distinct product category.** For Cambrian's seller-users, HR tech is a vertical with mandatory compliance deadlines, predictable buying cycles, executive-level buyers, and multi-year platform contracts.

> **What makes HR technology distinct.** Three things: (1) **payroll is the gravitational center** — payroll touches every employee, runs on hard deadlines (missed payroll = trust destruction), and integrates with GL, tax, benefits, and compliance; the payroll vendor is often the de facto HCM platform owner; (2) **buying cycles are anchored to calendar events** — open enrollment (Q3-Q4 planning for January effective dates), fiscal year budgeting, and compliance deadlines (ACA reporting by March, EEO-1 by May) create predictable windows; (3) **the buyer persona is evolving** — the CHRO/CPO has ascended to the C-suite in the post-COVID era, with board-level visibility on workforce strategy, but HRIS managers and IT/CIO still hold technical evaluation power, creating a multi-stakeholder buying committee.

---

## 1. Market sizing and structure

| Metric | Value |
|---|---|
| Global HCM software market (2025) | ~$30-33B [verified 05/2026, Grand View Research / IDC] |
| Projected market (2030) | ~$50-55B, ~10-12% CAGR [verified 05/2026, Grand View Research] |
| U.S. share of global HCM spend | ~45-50% [verified 05/2026, IDC] |
| Core HR & payroll segment | ~$14-16B (largest segment, ~45% of total) [verified 05/2026, IDC] |
| Talent acquisition / ATS segment | ~$3-4B [verified 05/2026, Everest Group] |
| Talent management (perf, L&D, engagement) | ~$4-5B [verified 05/2026, Josh Bersin] |
| Workforce management (WFM, scheduling, T&A) | ~$3-4B [verified 05/2026, IDC] |
| Benefits administration segment | ~$2-3B [verified 05/2026, Sapient Insights] |
| PEO / EOR segment | ~$6-8B in gross revenue (high-growth, ~20%+ for EOR) [verified 05/2026, Everest Group] |
| Average HR tech spend per employee (enterprise) | $200-400/employee/year [verified 05/2026, Sapient Insights] |
| U.S. nonfarm payroll employment | ~160M [verified 05/2026, BLS] |
| SHRM membership (proxy for HR professional market) | ~325,000+ members [verified 05/2026, SHRM] |

---

## 2. Named company landscape (19)

| Company | Category | Scale | Why they matter |
|---|---|---|---|
| **Workday** | Enterprise HCM, payroll, finance | ~$8B+ revenue, dominant enterprise HCM [verified 05/2026, Workday filings] | The Salesforce of HR — gold standard for enterprise cloud HCM; unified HR + finance platform; 50%+ of Fortune 500 use Workday for HCM or finance |
| **SAP SuccessFactors** | Enterprise HCM | Part of SAP ($35B+ total); strong in global enterprises [verified 05/2026, SAP filings] | Dominant in European multinationals; deep ERP integration with S/4HANA; large installed base resisting migration |
| **Oracle HCM Cloud** | Enterprise HCM | Part of Oracle ($55B+ total); Fusion HCM growing [verified 05/2026, Oracle filings] | Strong in complex global deployments; Fusion HCM replacing PeopleSoft installed base; tight integration with Oracle ERP |
| **ADP** | Payroll, HCM, PEO, benefits | ~$19B revenue; processes payroll for ~1 in 6 U.S. workers [verified 05/2026, ADP filings] | The payroll incumbent; ADP Workforce Now (mid-market), ADP Vantage/Next Gen (enterprise), ADP TotalSource (PEO); compliance engine is moat |
| **UKG (Ultimate Kronos Group)** | HCM, WFM, payroll | ~$4B+ revenue (private, Hellman & Friedman / Blackstone) [verified 05/2026, industry estimates] | Formed from Ultimate Software + Kronos merger (2020); dominant in workforce management/scheduling; strong in manufacturing, healthcare, hospitality; UKG Pro + UKG Ready |
| **Paylocity** | Mid-market payroll, HCM | ~$1.4B revenue, ~20% YoY growth [verified 05/2026, Paylocity filings] | Mid-market leader (50-5,000 employees); modern UX; strong community/social features; employee experience focus |
| **Paycom** | Mid-market payroll, HCM | ~$1.8B revenue [verified 05/2026, Paycom filings] | Single-database architecture; Beti (employee-driven payroll); strong in mid-market; employee self-service emphasis |
| **Dayforce (formerly Ceridian)** | HCM, payroll, WFM | ~$1.7B revenue [verified 05/2026, Dayforce filings] | Rebranded from Ceridian to Dayforce (2024); continuous payroll calculation; strong in complex pay rules (healthcare, manufacturing); global payroll expanding |
| **BambooHR** | SMB core HR, ATS | Private; estimated ~$300M+ ARR [verified 05/2026, industry estimates] | SMB HRIS leader (under 500 employees); simple, clean UX; ATS, onboarding, performance; gateway drug to HR tech for small companies |
| **Rippling** | SMB/mid-market HR, IT, finance | ~$350M+ ARR, hypergrowth [verified 05/2026, industry estimates] | Disruptor — unified HR + IT + finance platform; device management + payroll + benefits in one; compound startup model; targeting the Workday-for-SMBs position |
| **Deel** | EOR, global payroll, contractor management | ~$500M+ ARR [verified 05/2026, industry estimates] | EOR category leader; hire employees in 150+ countries without local entities; contractor payments; explosive post-COVID growth; competing with Oyster, Remote |
| **Gusto** | SMB payroll, benefits, HR | ~$500M+ revenue [verified 05/2026, industry estimates] | SMB payroll leader (under 200 employees); payroll, benefits, HR in one; strong accountant channel; beloved brand in startup/small business ecosystem |
| **iCIMS** | Enterprise ATS, talent acquisition | ~$400M+ revenue (private, Vista Equity) [verified 05/2026, industry estimates] | Enterprise ATS leader; talent cloud platform (attract, engage, hire, advance); strong in high-volume recruiting |
| **Greenhouse** | Mid-market/enterprise ATS | Private; estimated ~$200M+ ARR [verified 05/2026, industry estimates] | Structured hiring methodology; strong in tech companies; hiring manager experience focus; integration ecosystem |
| **Lever (Employ Inc.)** | ATS, talent relationship management | Merged with JazzHR under Employ Inc. [verified 05/2026, industry reports] | CRM-meets-ATS approach; nurture-focused recruiting; mid-market strength |
| **Lattice** | Performance, engagement, compensation | ~$150M+ ARR [verified 05/2026, industry estimates] | Performance management leader in tech companies; OKRs, engagement surveys, compensation management; expanding into HRIS |
| **Culture Amp** | Employee engagement, performance | ~$150M+ ARR [verified 05/2026, industry estimates] | People analytics and engagement platform; survey science foundation; benchmarking data; strong in mid-market |
| **15Five** | Performance, engagement, manager effectiveness | Private; estimated ~$80M+ ARR [verified 05/2026, industry estimates] | Manager enablement focus; continuous performance management; check-ins, OKRs, engagement; HR Outcomes methodology |
| **Cornerstone OnDemand** | Learning, talent management | ~$900M+ revenue (private, Clearlake Capital) [verified 05/2026, industry estimates] | LMS market leader; learning + talent management suite; strong in large enterprise and regulated industries; acquired EdCast, SumTotal |

### Platform vs. point-solution dynamics

The HR tech market is experiencing the same suite-vs.-best-of-breed tension as cybersecurity and martech. Workday, ADP, UKG, and Dayforce want to be the single platform. Lattice, Greenhouse, Culture Amp, and Deel argue that best-of-breed wins in their domain. **The payroll vendor typically has gravitational advantage** — once you run payroll on a system, switching costs are extreme (tax filings, direct deposits, benefits deductions, compliance reporting all flow through payroll). This makes payroll the anchor that pulls in adjacent modules.

---

## 3. Procurement and buying patterns

| Segment | Typical HR tech budget | How they buy | Cycle length |
|---|---|---|---|
| **Enterprise (5,000+)** | $1M-$20M+ annually | CHRO + HRIS team + CIO + CFO; formal RFP; implementation partner selection; board approval for platform | 6-18 months |
| **Mid-market (200-5,000)** | $200K-$1M annually | VP HR + HR ops + finance; vendor shortlist; demo-driven; POC rare; reference calls critical | 3-9 months |
| **SMB (20-200)** | $20K-$200K annually | HR Manager or COO/CEO; often bought through broker/PEO channel; ease-of-use is primary criterion | 1-4 months |

### Key procurement dynamics

- **Open enrollment drives benefits tech purchasing.** Benefits admin decisions must be finalized by Q2-Q3 for a January 1 effective date. Missing this window delays the deal by 12 months.
- **Multi-year contracts are standard.** Enterprise HCM contracts are typically 3-5 years. Implementation takes 6-18 months for enterprise HCM. The switching window is 9-12 months before contract expiry.
- **Implementation complexity is the hidden cost.** HCM implementations routinely run 1.5-3x the software license cost in services. Data migration, configuration, integrations, and change management drive overruns.
- **PEPM pricing model dominates.** Per-employee-per-month (PEPM) is the standard pricing unit. Enterprise HCM suites run $15-50 PEPM. Point solutions run $3-15 PEPM. PEOs charge as a percentage of payroll (typically 2-6%).
- **Total cost of ownership matters more than license cost.** Implementation, ongoing admin headcount, integration maintenance, and change management often exceed the software subscription over the contract term.

---

## 4. Buying committees

| Role | What they care about | Their lens |
|---|---|---|
| **CHRO / Chief People Officer** | Strategic workforce capability, employee experience, talent strategy, board reporting | "Does this make us a better employer? Can I show the board workforce ROI?" (Economic buyer) |
| **HRIS Manager / Director HR Technology** | System integration, data quality, admin workload, configurability, vendor support | "Will this reduce my team's manual work? Does it integrate with our existing stack?" (Technical buyer) |
| **CFO** | Total compensation cost, payroll accuracy, compliance risk, TCO, headcount efficiency | "What's the real cost including implementation? Does this reduce compliance exposure?" |
| **CIO / VP IT** | SSO/SAML integration, data security, API architecture, SOC 2 compliance, infrastructure | "Does this meet our security standards? How does it fit our technology architecture?" |
| **VP Total Rewards / Benefits** | Benefits administration, compensation benchmarking, pay equity, open enrollment | "Can this handle our benefits complexity? Does it support pay transparency requirements?" |
| **General Counsel / Employment Lawyer** | Employment law compliance, data privacy, EEOC, OFCCP, pay equity audit trail | "Does this create or reduce legal risk? Can we demonstrate compliance?" |
| **Head of Talent Acquisition** | ATS workflow, candidate experience, recruiter productivity, time-to-hire | "Will recruiters adopt this? Does it improve candidate experience and reduce time-to-fill?" |
| **Employee council / Union representative** | Worker data privacy, scheduling fairness, process transparency | "How does this affect employees? Is scheduling equitable? Where does worker data go?" |

---

## 5. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **Open enrollment season approaching** | Benefits admin platform must be locked in Q2-Q3 for Jan 1 effective date | Hardest deadline in HR tech; miss it and the deal slips 12 months |
| **M&A or divestiture** | Headcount integration, HRIS consolidation, payroll harmonization required | 6-18 month technology rationalization; platform consolidation trigger; day-one readiness critical |
| **Layoff / RIF / restructuring** | Offboarding compliance (WARN Act, COBRA, severance), workforce planning urgency | Immediate need for offboarding tools, outplacement; longer-term workforce planning investment |
| **Pay transparency legislation** | Compensation data must be auditable, publishable, and equitable | Compensation management tool purchases; pay equity audit; job architecture projects |
| **Return-to-office / hybrid mandate** | New scheduling, badge data, space planning, attendance tracking requirements | WFM, time-and-attendance, employee experience platform investments |
| **HRIS / payroll contract renewal** | 3-5 year contract expiring; evaluation window opens 9-12 months before | The single biggest displacement opportunity; competitive bake-off period |
| **Rapid headcount growth** | Crossing 50 employees (ACA), 100 (EEO-1), 500+ (enterprise complexity) triggers | Compliance thresholds force system upgrades; outgrowing BambooHR/Gusto is a common inflection |
| **New CHRO / CPO hire** | 90-day assessment; new leader brings vendor preferences and strategic vision | First 6 months is the buying window; new CHROs often initiate platform reviews |

---

## 6. Competitive dynamics

### Suite vs. best-of-breed tension

- **Workday dominance in enterprise.** Workday is the gold standard for enterprise cloud HCM (5,000+ employees). Competing against Workday requires differentiation in a specific domain (payroll complexity, WFM, global, or vertical-specific capability) or a price/implementation advantage.
- **ADP and UKG in mid-market.** ADP Workforce Now and UKG Pro/Ready dominate the 200-5,000 employee segment. Their moat is payroll and compliance — switching payroll providers is painful and risky. Challengers (Paylocity, Paycom, Dayforce) compete on UX, integration, and employee experience.
- **Rippling disruption in SMB.** Rippling's compound approach (HR + IT + finance in one platform, starting with device management as a wedge) is the most disruptive force in the sub-1,000 employee market. Rippling threatens BambooHR, Gusto, and even Paylocity.
- **EOR explosion.** Deel, Oyster, Remote, and Papaya Global have created the employer-of-record category for hiring international employees without local entities. This is the fastest-growing HR tech segment (~20%+ YoY). Traditional payroll vendors (ADP, Dayforce) are scrambling to add global capability.
- **Point solutions vs. platform consolidation.** Greenhouse (ATS), Lattice (performance), Culture Amp (engagement), and Cornerstone (LMS) face the same existential question as point solutions in cybersecurity: "Why not use the module that comes with our HCM platform?" Their answer must be domain depth, UX superiority, or data/benchmarking advantages.

---

## 7. Regulatory overlay

### Key employment and benefits regulations

| Regulation | Scope | Impact on HR tech purchasing |
|---|---|---|
| **FLSA (Fair Labor Standards Act)** | All U.S. employers | Minimum wage, overtime, exemption classification; drives time-and-attendance and payroll system requirements |
| **FMLA (Family and Medical Leave Act)** | Employers with 50+ employees | Leave tracking, eligibility calculation, compliance reporting; drives leave management module purchases |
| **ACA (Affordable Care Act)** | Employers with 50+ FTEs | Benefits eligibility tracking, 1094-C/1095-C reporting, variable-hour employee measurement; hard compliance deadline (March filing) |
| **COBRA** | Employers with 20+ employees | Continuation coverage administration; typically outsourced to benefits admin or TPA |
| **ERISA** | Employers offering retirement/welfare benefits | Plan administration, fiduciary compliance, Form 5500 reporting; drives benefits admin platform requirements |
| **EEOC / EEO-1 reporting** | Employers with 100+ employees (or 50+ federal contractors) | Demographic data collection and reporting; annual filing; drives HRIS data quality requirements |
| **OFCCP (for federal contractors)** | Federal contractors and subcontractors | Affirmative action plans, adverse impact analysis, audit trail for hiring decisions; drives ATS compliance features |
| **State pay transparency laws** | CO, CA, NY, WA, IL, and expanding [verified 05/2026, SHRM] | Salary range disclosure in job postings; pay equity audits; compensation data infrastructure; fastest-growing compliance driver in HR tech |
| **GDPR (for global workforce)** | Companies with EU employees or candidates | Consent management, data subject access requests, data retention policies; drives international HRIS requirements |
| **SOX (Sarbanes-Oxley)** | Public companies | Internal controls over financial reporting including payroll; audit trail, separation of duties, access controls in HCM/payroll |
| **State paid leave mandates** | Expanding (CA, NY, WA, MA, CT, OR, CO, MD, and others) [verified 05/2026, SHRM] | State-specific leave accrual, eligibility, and reporting; multi-state employers need configurable leave engines |
| **WARN Act** | Employers with 100+ employees | 60-day advance notice of mass layoffs/plant closings; state mini-WARN acts add complexity; drives offboarding compliance |

### Regulatory architecture (structural — durable)

- **No single federal HR regulator.** DOL enforces FLSA/FMLA/ERISA. EEOC enforces anti-discrimination. IRS enforces ACA/tax. OSHA enforces safety. State agencies enforce wage/hour, paid leave, and pay transparency. This fragmentation drives demand for compliance engines in HR platforms.
- **State-level employment law variation** creates massive complexity for multi-state employers. Each state has different rules for minimum wage, overtime, paid leave, pay transparency, ban-the-box, and non-compete enforcement. HR tech platforms compete on the breadth and accuracy of their state compliance engines.
- **Pay transparency is the fastest-moving regulatory area.** Colorado (2021), New York City (2022), California (2023), Washington (2023), Illinois (2025), and additional states/cities continue to pass requirements for salary range disclosure. This is driving compensation management platform adoption across the market.

---

## 8. Technology stack

### The modern HR technology stack

| Layer | Function | Key vendors |
|---|---|---|
| **Core HCM / HRIS** | Employee record system, org structure, employee self-service, manager self-service | Workday, SAP SuccessFactors, Oracle HCM, ADP, UKG, Paylocity, Paycom, Dayforce, BambooHR, Rippling |
| **Payroll engine** | Gross-to-net calculation, tax filing, direct deposit, garnishments, multi-state/multi-country | ADP, Workday, UKG, Paylocity, Paycom, Dayforce, Gusto, Rippling, Deel (global) |
| **Benefits administration** | Open enrollment, plan management, carrier connectivity, ACA reporting, COBRA | ADP, bswift (CVS Health), Benefitfocus (Voya), PlanSource, Businessolver, Rippling, Gusto |
| **ATS / Talent acquisition** | Job posting, candidate tracking, interview scheduling, offer management | iCIMS, Greenhouse, Lever (Employ), Workday Recruiting, SmartRecruiters, Jobvite (Employ) |
| **Performance management** | Goal setting, OKRs, reviews, continuous feedback, calibration | Lattice, Culture Amp, 15Five, Workday, BetterWorks, Reflektive |
| **Learning management (LMS)** | Course delivery, compliance training, skills development, certifications | Cornerstone, Docebo, Absorb, Workday Learning, SAP Litmos, 360Learning |
| **WFM / Scheduling / T&A** | Shift scheduling, time tracking, attendance, labor cost forecasting | UKG, ADP, Dayforce, When I Work, Deputy, Legion, Quinyx |
| **People analytics** | Headcount reporting, attrition prediction, workforce planning, compensation analytics | Visier, One Model, Workday People Analytics, Crunchr, Orgnostic |
| **Compensation management** | Salary benchmarking, pay equity analysis, compensation planning, total rewards statements | Payscale, Salary.com (CompAnalyst), Syndio, Assemble, Workday Advanced Compensation, Lattice Compensation |
| **Employee experience** | Engagement surveys, pulse surveys, recognition, wellbeing | Culture Amp, Lattice, Qualtrics (SAP), Medallia, Bonusly, Achievers |
| **EOR / Global payroll** | Hire employees internationally without local entities; global payroll processing | Deel, Oyster, Remote, Papaya Global, Velocity Global, ADP GlobalView |

### Key integration architecture

- **Payroll to General Ledger** — the most critical integration in HR tech; payroll journal entries must flow accurately to the ERP/GL (NetSuite, SAP, Oracle) for financial reporting and SOX compliance.
- **ATS to HCM** — candidate-to-employee data handoff at hire; eliminates re-entry and ensures onboarding automation triggers.
- **Benefits to payroll** — benefit elections must flow to payroll for deduction processing; carrier feeds send enrollment data to insurance carriers.
- **HCM to identity provider** — employee lifecycle events (hire, transfer, terminate) trigger IAM provisioning/deprovisioning (Okta, Microsoft Entra); critical for security.
- **AI in HR tech** — resume screening and matching (HireVue, Eightfold), interview scheduling automation, bias detection in hiring (Textio), attrition prediction, skills inference, and chatbot-driven employee self-service. AI regulation in hiring (NYC Local Law 144, EU AI Act) is an emerging compliance area.

---

## 9. ICP patterns

### Enterprise vs. SMB buying differences

| Dimension | Enterprise (5,000+) | Mid-market (200-5,000) | SMB (20-200) |
|---|---|---|---|
| **Primary buyer** | CHRO + HRIS team | VP HR + HR generalist | COO/CEO or Office Manager |
| **Decision driver** | Platform consolidation, global capability, compliance | Ease of use, payroll accuracy, employee experience | Simplicity, cost, PEO/EOR option |
| **Key vendors** | Workday, SAP, Oracle, ADP Vantage, UKG Pro | ADP WFN, Paylocity, Paycom, Dayforce, UKG Ready | Gusto, Rippling, BambooHR, Justworks, TriNet |
| **Implementation** | 6-18 months, system integrator required | 2-6 months, vendor-led or small partner | 1-4 weeks, self-service or guided setup |
| **Contract** | 3-5 year, $1M-$20M+ TCV | 2-3 year, $100K-$500K TCV | Monthly or annual, $20K-$100K ACV |

### Industry-specific patterns

- **Regulated industries (healthcare, financial services)** — credentialing, licensure tracking, and compliance reporting requirements drive specialized HR tech needs. Healthcare needs shift scheduling with credential verification; financial services needs licensing tracking and FINRA compliance.
- **Manufacturing / frontline / deskless** — WFM and scheduling are the entry point, not core HCM. UKG dominates. Time and attendance, shift swap, and labor cost forecasting are primary use cases.
- **Technology companies** — early adopters of best-of-breed (Greenhouse + Lattice + Culture Amp); performance management and employee engagement are top priorities.
- **Global companies** — international payroll and EOR are the primary pain points; Deel, Papaya Global, and ADP GlobalView compete here.

### Employee count thresholds as triggers

- **50 employees** — ACA employer mandate (offer affordable coverage or pay penalty); FMLA eligibility; this is the first major compliance cliff.
- **100 employees** — EEO-1 reporting required; WARN Act applicability; COBRA administration becomes more complex.
- **250+ employees** — typically when companies outgrow SMB platforms and need mid-market HCM; dedicated HRIS role often created.
- **1,000+ employees** — enterprise HCM evaluation begins; implementation partner required; multi-module platform deals.
- **5,000+ employees** — Workday, SAP, Oracle tier; global complexity; dedicated HR technology team.

---

## 10. Common failure modes

1. **Underestimating implementation complexity.** Enterprise HCM implementations (Workday, SAP, Oracle) routinely take 12-18 months and cost 1.5-3x the license fee. Sellers who pitch "go live in 90 days" for enterprise HCM lose credibility.
2. **Ignoring change management.** HR systems touch every employee. A new self-service portal, benefits enrollment tool, or performance review process requires training and communication. Implementations fail on adoption, not technology.
3. **Treating HR as a cost center.** The CHRO/CPO is a C-suite executive with board visibility on talent strategy. Sellers who pitch "reduce HR headcount" instead of "improve workforce capability" alienate the economic buyer.
4. **Not understanding open enrollment timelines.** Benefits administration decisions must be finalized by Q2-Q3 for January 1 effective dates. Missing this window is a 12-month slip. Sellers must know where the prospect is in the OE cycle.
5. **Missing the compliance driver.** Many HR tech purchases are compliance-driven (ACA reporting, pay transparency, multi-state leave tracking). Generic "better employee experience" pitches miss compliance-driven buyers who have a non-discretionary mandate.
6. **Underestimating payroll switching costs.** Payroll is the stickiest system in the enterprise. Moving payroll means migrating tax registrations, direct deposits, garnishments, year-to-date balances, and historical records. No CHRO switches payroll casually.
7. **Pitching a point solution without integration context.** HR buyers are exhausted by disconnected tools. Every point solution must explain how it integrates with the prospect's HCM and payroll system. "We have an API" is not an integration story.
8. **Ignoring the employee experience.** Post-COVID, employee experience is a board-level topic. HR tech that is ugly, confusing, or creates more work for employees will not be adopted. The employee is the end user, not just the HR admin.
9. **Not qualifying the PEO question.** Companies under 200 employees may be evaluating PEOs (TriNet, Justworks, ADP TotalSource, Insperity) as an alternative to buying HR tech. The PEO bundles payroll + benefits + compliance + HR support. If the prospect is considering a PEO, a point-solution pitch is irrelevant.
10. **Fabricating implementation timelines or compliance claims.** HR buyers have been burned by vendors promising "seamless" implementations that take 2x longer and cost 3x more. Specific, honest implementation timelines with reference customers in the same industry and size band are non-negotiable.

---

## 11. GTM playbook

### Conference circuit

- **HR Technology Conference (HR Tech)** — the flagship event; Las Vegas, September/October; 10,000+ attendees; where enterprise HR tech decisions start [verified 05/2026, HR Tech Conference].
- **SHRM Annual Conference** — the practitioner event; 20,000+ HR professionals; more operational than technology-focused but massive reach [verified 05/2026, SHRM].
- **Unleash World / Unleash America** — global HR tech event; growing in influence; strong international HR tech coverage.
- **Transform** — people analytics and workforce strategy; niche but high-signal for data-driven HR leaders.
- **HR Tech Europe / UNLEASH** — for vendors targeting European markets.

### Analyst and influencer relations

- **Josh Bersin** — the most influential HR tech analyst; Bersin Reports and Josh Bersin Academy shape CHRO thinking [verified 05/2026, industry consensus].
- **Sapient Insights Group** — annual HR Systems Survey is the authoritative benchmarking data (25+ years of research); adoption, satisfaction, and spend data [verified 05/2026, Sapient Insights].
- **Gartner Magic Quadrant for Cloud HCM Suites** — enterprise buying decisions reference this; Workday, SAP, Oracle, UKG, Dayforce are regularly evaluated [verified 05/2026, Gartner].
- **Everest Group PEAK Matrix** — HCM technology assessments; strong in mid-market and EOR evaluations.
- **IDC MarketScape** — HCM vendor assessments; broad coverage across enterprise and mid-market.

### Channel strategies

- **Benefits brokers** — brokers (Marsh McLennan, Gallagher, Lockton, HUB) advise on benefits admin technology; a broker endorsement opens doors for benefits platforms.
- **PEOs as channel** — PEOs (ADP TotalSource, TriNet, Insperity, Justworks) bundle HR tech with services; understanding whether a prospect uses a PEO is a qualifying question.
- **System integrators** — Deloitte, Accenture, Mercer, Alight lead enterprise HCM implementations (Workday, SAP, Oracle); SI relationships drive platform selection.
- **Accountant/bookkeeper channel** — Gusto and Rippling have built strong CPA/bookkeeper referral programs for SMB payroll.

### Demo requirements

Effective HR tech demos must show: (1) **employee self-service** — mobile-first, intuitive; (2) **manager dashboard** — team view, approvals, headcount; (3) **payroll processing** — gross-to-net, tax accuracy, multi-state; (4) **compliance reporting** — ACA, EEO-1, pay equity; (5) **integration** — how data flows to GL, ATS, benefits carriers; (6) **implementation timeline** — realistic, with references in the same industry and employee count range.

---

## 12. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`complianceKnowledge.js\` | ACA, FMLA, ERISA, COBRA, FLSA, state pay transparency, GDPR — compliance is the primary driver for ~40% of HR tech purchases |
| \`manufacturingKnowledge.js\` | Frontline/deskless workforce management; UKG dominance in manufacturing WFM; shift scheduling, labor cost forecasting |
| \`healthcareSaasKnowledge.js\` | Healthcare credentialing, nurse scheduling, licensure tracking; specialized HR tech needs in healthcare |
| \`peHoldcoKnowledge.js\` | PE portfolio companies often consolidate HCM across portfolio; centralized payroll and benefits create operating leverage |
| \`b2bSalesKnowledge.js\` | Enterprise HCM sales is complex B2B — multi-stakeholder, long cycle, implementation-heavy |
| \`smbMidmarketKnowledge.js\` | SMB HR tech buying patterns; PEO vs. platform decision; Gusto/Rippling/BambooHR competitive dynamics |
| \`investorIntelligenceKnowledge.js\` | Workday (WDAY), ADP (ADP), Paylocity (PCTY), Paycom (PAYC), Dayforce (DAY) all publicly traded |
| \`cybersecurityKnowledge.js\` | HCM-to-IAM integration for employee lifecycle provisioning/deprovisioning; SOC 2 compliance for HR SaaS vendors |

---

*End of layer. Update cadence: quarterly aligned with major vendor earnings (Workday Feb/May/Aug/Nov, ADP Oct/Jan/Apr/Jul, Paylocity Nov/Feb/May/Aug). Critical re-check triggers: new state pay transparency laws, ACA/FMLA regulatory changes, major M&A in HR tech, Gartner MQ release, Josh Bersin annual report, open enrollment cycle shifts, EOR market consolidation.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const HR_TECH_INJECTION = HR_TECH_PLAYBOOK.layerContent;
export const HR_TECH_SCORING = HR_TECH_PLAYBOOK.keywords.join(", ");
export const HR_TECH_DISCOVERY = HR_TECH_PLAYBOOK.discovery.join("\n");
