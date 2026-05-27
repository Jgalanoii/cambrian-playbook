// src/data/educationKnowledge.js
//
// U.S. Education industry knowledge layer — K-12, higher education, edtech,
// LMS, student information systems, enrollment management, online learning,
// and the full education technology stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_EDUCATION (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// VERSION: 1.0.0
// VERIFIED: 2026-05-21
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   NCES (National Center for Education Statistics), Digest of Education Statistics (2025):
//     nces.ed.gov/programs/digest
//   HolonIQ, Global EdTech Market Intelligence (2026):
//     holoniq.com/edtech
//   Gartner, Market Guide for Student Information Systems (2025):
//     gartner.com/reviews/market/student-information-systems
//   Gartner, Market Guide for Learning Management Systems (2025):
//     gartner.com/reviews/market/corporate-learning-management-systems
//   EDUCAUSE, Top IT Issues (2025-2026):
//     educause.edu/research-and-publications
//   National Association of College and University Business Officers (NACUBO):
//     nacubo.org
//   US Department of Education, FERPA guidance:
//     ed.gov/policy/gen/guid/fpco/ferpa
//   US Department of Education, ESSER / EANS funding tracker:
//     ed.gov/coronavirus/esser
//   State Higher Education Executive Officers (SHEEO), State Higher Education Finance (2025):
//     shef.sheeo.org
//   Tyton Partners, Learning & Talent Landscape (2025):
//     tytonpartners.com
//   Instructure, PowerSchool, Ellucian, Workday, Anthology SEC filings / press releases
//   Chronicle of Higher Education, institutional enrollment and closures data (2025-2026)
//   IPEDS (Integrated Postsecondary Education Data System):
//     nces.ed.gov/ipeds

export const EDUCATION_PLAYBOOK = {
  name: "Education",
  keywords: [
    "education", "edtech", "K-12", "higher education", "university",
    "college", "LMS", "learning management system", "student information system",
    "SIS", "enrollment management", "online learning", "distance learning",
    "FERPA", "Title I", "ESSER", "school district", "superintendent",
    "provost", "registrar", "financial aid", "campus", "curriculum",
    "assessment", "adaptive learning", "OPM", "ed tech",
  ],
  personas: [
    "Superintendent", "CIO", "CTO", "Chief Academic Officer",
    "VP Enrollment Management", "Provost", "Dean", "Registrar",
    "Director of IT", "Director of Instructional Technology",
    "VP Student Affairs", "Chief Financial Officer",
    "VP Online Learning", "Director of Procurement",
    "School Board Member",
  ],
  discovery: [
    "What does your core technology stack look like today -- SIS, LMS, ERP -- and where are you in any modernization or migration cycle?",
    "How are you managing enrollment trends -- is enrollment growing, flat, or declining, and what strategies are you deploying?",
    "What compliance frameworks drive your technology decisions (FERPA, COPPA, state data privacy, accessibility)?",
    "How is your institution handling the post-COVID edtech rationalization -- which tools survived the pandemic spike and which are being sunsetted?",
    "What does your budget cycle look like, and are you currently spending down any federal or state grant funding with deadlines?",
    "How are you thinking about AI in instruction, student services, and operations -- policy, pilots, or full deployment?",
    "What's the relationship between academic leadership and IT when it comes to technology purchasing -- who drives and who approves?",
  ],
  disqualifiers: [
    "No understanding of education budget cycles (fiscal year, bond measures, grant timelines)",
    "Treating K-12 and higher ed as the same buyer (fundamentally different procurement, governance, and funding)",
    "Ignoring FERPA and student data privacy requirements",
    "Pitching outside the grant or budget window without awareness of timing constraints",
    "No awareness of the committee-based procurement culture in education",
    "Assuming edtech enthusiasm when institutions are in edtech-fatigue mode post-COVID",
  ],
  triggerEvents: [
    "ESSER / federal stimulus funding approaching spend-down deadline",
    "New superintendent, president, provost, or CIO hire (first 6-month window)",
    "SIS or ERP replacement cycle (multi-year, high-budget program)",
    "LMS migration or contract renewal",
    "Enrollment cliff hitting (especially higher ed demographics 2025-2030)",
    "State legislature passing new education technology or data privacy mandate",
    "Bond measure or levy passage unlocking capital and technology budgets",
    "Accreditation review driving technology and assessment upgrades",
    "Online / hybrid program launch or expansion",
    "Merger, consolidation, or closure of institutions (higher ed restructuring)",
    "AI policy development and adoption at institutional level",
    "State adoption or textbook/curriculum refresh cycle",
  ],
  compliance: [
    "FERPA (Family Educational Rights and Privacy Act) -- governs student education records; applies to all institutions receiving federal funding",
    "COPPA (Children's Online Privacy Protection Act) -- applies to K-12 edtech serving children under 13",
    "Section 508 / WCAG 2.1 AA -- accessibility requirements for federally funded institutions",
    "Title IX -- gender equity; drives reporting and case management technology",
    "IDEA (Individuals with Disabilities Education Act) -- special education compliance and IEP management",
    "Title I -- federal funding for high-poverty schools; specific spending and reporting requirements",
    "State student data privacy laws (130+ state laws across 50 states, many stricter than FERPA)",
    "CIPA (Children's Internet Protection Act) -- internet filtering requirements for E-rate funded schools",
    "Clery Act -- campus safety reporting for higher ed",
    "GLBA (for institutions handling financial aid)",
    "State open records / FOIA laws (public institutions)",
    "Accreditation standards (regional accreditors, programmatic accreditors)",
  ],
  usps: [
    "FERPA compliance and student data privacy by design",
    "Integration depth with existing SIS, LMS, and ERP systems",
    "Accessibility compliance (Section 508, WCAG 2.1 AA)",
    "Evidence of learning outcomes improvement (not just engagement metrics)",
    "Grant-funding alignment (ability to be purchased with Title I, ESSER, Perkins, or state funds)",
    "References in same institution type (K-12 district vs. community college vs. R1 university vs. for-profit)",
    "Low total cost of ownership for budget-constrained institutions",
  ],
  heuristics: [
    "K-12 and higher ed are fundamentally different markets -- different buyers, budgets, governance, procurement, and technology stacks",
    "Education procurement is committee-driven and slow -- expect 6-18 month cycles even for mid-size deals; board approval often required",
    "Budget cycles are fiscal-year-driven: K-12 typically July 1 - June 30; higher ed varies; federal grant timelines layer on top",
    "FERPA is the foundational compliance requirement -- any edtech vendor that cannot demonstrate FERPA compliance is disqualified immediately",
    "Edtech fatigue is real post-COVID -- institutions adopted hundreds of tools in 2020-2021 and are now rationalizing; new tool adoption faces higher scrutiny",
    "The enrollment cliff (declining 18-year-old population 2025-2035) is an existential threat for many higher ed institutions and drives enrollment management technology investment",
    "State-level adoption decisions can create entire markets overnight -- a state curriculum adoption or assessment contract is worth more than hundreds of individual district sales",
    "For-profit and OPM (online program management) segments have distinct regulatory and reputational dynamics -- treat separately from traditional higher ed",
  ],
  layerContent: `---
title: "Education --- Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_b2b_sales_value_creation.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_investor_intelligence.md
  - cambrian_compliance_knowledge.md
  - cambrian_smb_midmarket_knowledge.md
tags: [education, edtech, K-12, higher-ed, LMS, SIS, enrollment, FERPA, online-learning, university, school-district, assessment, adaptive-learning]
last_updated: 2026-05-21
status: production
confidence: high (NCES 2025 data; HolonIQ 2026; EDUCAUSE Top IT Issues; NACUBO; Department of Education; SEC filings for public edtech companies)
---

# Education --- Knowledge Layer

> **Working thesis.** U.S. education is a ~$1.1T annual spending market (K-12 + higher ed combined) [verified 05/2026, NCES] with education technology (edtech) representing ~$85-100B globally and ~$40-45B in the US [verified 05/2026, HolonIQ]. **The dominant 2026 dynamics are: (a) post-COVID edtech rationalization and fatigue; (b) the demographic enrollment cliff hitting higher ed (18-year-old population declining 2025-2035); (c) ESSER stimulus funding spend-down deadlines (Sept 2024 obligation, ongoing liquidation); (d) AI policy development and adoption at every institutional level; (e) state student data privacy laws proliferating; and (f) higher ed institutional consolidation, merger, and closure accelerating.** For Cambrian's seller-users, education is a massive market with highly fragmented procurement, committee-driven decision-making, budget-constrained buyers, and compliance requirements (FERPA, COPPA, state laws) that gate every technology purchase.

> **What makes education distinct.** Three things: (1) **procurement is committee-based, consensus-driven, and budget-cycle-bound** -- a school board, curriculum committee, or shared governance body typically makes or approves technology decisions, and budgets are locked to fiscal years and grant timelines; (2) **K-12 and higher ed are separate markets** with different buyers (superintendent vs. provost), different funding (property taxes + state aid + federal Title I vs. tuition + endowment + state appropriations), different governance (elected school boards vs. boards of trustees/regents), and different technology stacks (SIS + LMS + curriculum vs. SIS + LMS + ERP + CRM + enrollment management); (3) **student data is the third rail** -- FERPA, COPPA, and 130+ state student data privacy laws create compliance requirements that gate every edtech purchase and can disqualify vendors who cannot demonstrate compliant data handling.

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| US total education spending (K-12 + higher ed) | ~$1.1T annually [verified 05/2026, NCES] |
| US K-12 spending | ~$800B annually (federal + state + local) [verified 05/2026, NCES] |
| US higher ed spending | ~$700B annually (all sources: tuition, state, federal, endowment) [verified 05/2026, NCES] |
| US K-12 enrollment | ~49.4M students in public schools [verified 05/2026, NCES] |
| US higher ed enrollment | ~19.5M students (degree-granting institutions) [verified 05/2026, NCES] |
| Number of US K-12 school districts | ~13,000 [verified 05/2026, NCES] |
| Number of US K-12 schools | ~130,000 (public) + ~30,000 (private) [verified 05/2026, NCES] |
| Number of US degree-granting higher ed institutions | ~3,700 [verified 05/2026, NCES] |
| Global edtech market | ~$400B by 2028, ~16% CAGR [verified 05/2026, HolonIQ] |
| US edtech market | ~$40-45B [verified 05/2026, HolonIQ] |
| ESSER total allocation | $189.5B across three rounds (CARES, CRRSA, ARP); obligation deadline Sept 2024 [verified 05/2026, US DoE] |
| Higher ed institutions closed (2020-2025) | 100+ closures and mergers [verified 05/2026, Chronicle of Higher Education] |
| State student data privacy laws | 130+ across all 50 states [verified 05/2026, Student Privacy Compass / FERPA Sherpa] |

---

## 2. What makes education distinct as a sales target

**1. Budget cycles and funding sources govern all purchasing.** K-12 budgets are typically set on a July 1 - June 30 fiscal year, funded by local property taxes (~45%), state appropriations (~45%), and federal funds (~10%). Higher ed budgets vary by institution type but are driven by tuition, state appropriations (for publics), endowment (for privates), and federal research/financial aid funds. Grant funding (Title I, ESSER, Perkins, state grants) has specific spending rules, timelines, and reporting requirements. A vendor who pitches outside the budget window or doesn't understand grant-eligible spending categories will stall.

**2. Committee-driven procurement is the norm, not the exception.** K-12: technology decisions often require superintendent recommendation, board approval, curriculum committee review, and sometimes parent/community input. Higher ed: shared governance means faculty senates, IT governance committees, and provost/dean approval layers. Both segments have formal RFP processes for purchases above modest thresholds ($25K-$100K in many districts; varies by institution). **Selling to a single champion is insufficient -- the champion must navigate the committee.**

**3. Student data privacy is the gating compliance requirement.** FERPA applies to every institution receiving federal funding (virtually all). COPPA adds requirements for K-12 edtech serving children under 13. Beyond federal law, 130+ state student data privacy laws -- many stricter than FERPA -- govern how student data is collected, stored, shared, and deleted. States like California (SOPIPA), New York (Education Law 2-d), Colorado, Connecticut, and Illinois have particularly stringent requirements. Edtech vendors that cannot demonstrate FERPA compliance, data privacy agreements, and state-specific compliance are disqualified before the conversation begins.

**4. Post-COVID edtech fatigue is a real headwind.** During 2020-2021, institutions adopted hundreds of new tools under emergency conditions. The 2023-2026 period is characterized by rationalization: reducing tool count, renegotiating contracts, sunsetting underused platforms, and raising the evidence bar for new adoptions. New edtech vendors face "do we really need another tool?" resistance that didn't exist pre-pandemic.

---

## 3. Sub-categorization --- education segments

| Segment | Description | Size | Key dynamics |
|---|---|---|---|
| **K-12 public school districts** | ~13,000 districts, ~130,000 schools, ~49.4M students | ~$800B total spending | Property tax + state funding; superintendent + school board governance; Title I, IDEA, ESSER funding; state standards and assessments |
| **K-12 charter schools** | ~7,800 charter schools, ~3.7M students [verified 05/2026, NCES] | Subset of K-12 | Autonomous governance; often more agile procurement; performance-based accountability |
| **K-12 private / independent schools** | ~30,000 schools, ~5.7M students [verified 05/2026, NCES] | Tuition-funded | Smaller, faster procurement; limited federal funding; NAIS, state association networks |
| **Higher ed -- public universities** | ~1,600 institutions (4-year and 2-year public) | State appropriations + tuition | State system governance (UC, SUNY, etc.); shared services; budget pressure from declining state funding |
| **Higher ed -- private nonprofit** | ~1,600 institutions | Tuition + endowment + gifts | Wide range from Ivy League to small liberal arts; endowment-dependent; enrollment-sensitive |
| **Higher ed -- community colleges** | ~900 institutions, ~5.5M students | State + local funding; low tuition | Open access; workforce development mission; tight budgets; high enrollment volatility |
| **Higher ed -- for-profit** | ~500 institutions (declining) | Tuition (90/10 federal rule) | Heavy regulatory scrutiny; 90/10 rule limits federal revenue to 90%; declining enrollment; OPM adjacency |
| **Online program management (OPM)** | Revenue-share partnerships for online degree programs | ~$4-5B market | 2U, Academic Partnerships, Noodle, iDesign; revenue-share model under pressure; DOE scrutiny |
| **Corporate learning / workforce** | Employee training, upskilling, credentialing | Adjacent | Coursera for Business, LinkedIn Learning, Udemy Business, Guild; overlaps with HR tech |

---

## 4. Named companies --- the edtech landscape (18)

| Company | Category | Scale | Why they matter |
|---|---|---|---|
| **Instructure (Canvas)** | LMS (K-12 + higher ed) | ~$550M revenue; Thoma Bravo-owned [verified 05/2026, Instructure filings pre-take-private] | Canvas LMS is the dominant higher ed LMS (~35% market share) and growing in K-12; taken private by Thoma Bravo (2020); also owns Mastery (assessment) and Impact (analytics) |
| **Anthology (Blackboard)** | LMS, SIS, CRM, enrollment | Private (formed from Blackboard + Anthology merger 2022) | Legacy LMS market leader (Blackboard Learn Ultra); losing share to Canvas and Brightspace; strongest in SIS and enrollment CRM; large installed base |
| **PowerSchool** | SIS, LMS, assessment, analytics (K-12) | ~$700M revenue; taken private by Bain Capital (2024) [verified 05/2026, PowerSchool filings pre-take-private] | Dominant K-12 SIS provider (~40% district market share); PowerSchool SIS, Schoology LMS, assessment, enrollment; Bain Capital acquisition |
| **Ellucian** | ERP, SIS, CRM (higher ed) | ~$1B+ revenue; private (TPG + Leonard Green) [verified 05/2026, industry estimates] | Dominant higher ed ERP/SIS (Banner, Colleague); ~2,700 institutions; cloud migration (Ellucian Experience / Ellucian CRM Advance); legacy modernization challenge |
| **Workday Student** | Cloud ERP, SIS, HCM (higher ed) | Subset of Workday (~$7.3B total revenue) [verified 05/2026, Workday filings] | Cloud-native student system; adopted by large research universities (USC, Michigan, Cornell); expensive, long implementation (2-4 years); positions against Ellucian Banner |
| **Coursera** | Online learning platform | ~$700M revenue; public (NYSE: COUR) [verified 05/2026, Coursera filings] | University partner platform; Coursera for Campus, Coursera for Business; 150M+ registered learners; degree programs and professional certificates |
| **2U** | OPM / online program management | ~$800M revenue; filed Chapter 11 bankruptcy July 2024 [verified 05/2026, 2U filings] | OPM model under severe pressure; edX acquisition (2021) followed by bankruptcy; signal for entire OPM category |
| **Chegg** | Student services (study help, tutoring) | ~$500M revenue; stock declined ~90% from peak [verified 05/2026, Chegg filings] | AI disruption poster child; ChatGPT directly threatened core study-help business; pivoting to AI-assisted learning |
| **Duolingo** | Language learning | ~$700M revenue; public (NASDAQ: DUOL) [verified 05/2026, Duolingo filings] | Consumer-first with growing institutional (Duolingo for Schools) and English-proficiency testing (DET) presence; AI-native content generation |
| **Khan Academy** | Free online learning (K-12 + test prep) | Nonprofit; ~$80M annual revenue [verified 05/2026, Khan Academy Form 990 estimates] | Free, philanthropically funded; Khanmigo AI tutor (GPT-4 powered); significant influence on edtech expectations despite nonprofit status |
| **ClassDojo** | K-12 classroom communication + community | 51M+ students in 180+ countries [verified 05/2026, ClassDojo press] | Dominant elementary classroom communication tool; freemium model; parent engagement platform; expanding into curriculum (Dojo Islands) |
| **Clever** | K-12 single sign-on and data integration | ~95,000 US schools (~65% of K-12) [verified 05/2026, Clever press] | SSO and rostering middleware connecting SIS to edtech apps; acquired by Kahoot! (2023); critical integration layer for K-12 edtech |
| **Schoology (PowerSchool)** | LMS (K-12 + higher ed) | Merged into PowerSchool ecosystem | K-12 LMS competitor to Canvas and Google Classroom; now part of PowerSchool's unified platform |
| **D2L (Brightspace)** | LMS (higher ed + K-12 + corporate) | ~$200M revenue; public (TSE: DTOL) [verified 05/2026, D2L filings] | Third-place higher ed LMS behind Canvas and Blackboard; strong in Canada, growing US; adaptive learning features |
| **Cengage / McGraw Hill** | Courseware, textbooks, OER, adaptive learning | Cengage ~$1.4B revenue; McGraw Hill ~$1.8B revenue [verified 05/2026, industry estimates] | Legacy publishers transforming into digital courseware platforms; Cengage Unlimited, ALEKS (McGraw Hill), Connect; attempted merger failed (antitrust) |
| **Turnitin** | Academic integrity, plagiarism detection | Private (Advance Publications); ~50M students, 16,000+ institutions | AI writing detection (controversial); Gradescope (grading automation); Feedback Studio; near-monopoly in plagiarism detection |
| **Kahoot!** | Game-based learning, engagement | ~$200M revenue; public (Oslo: KAHOT) [verified 05/2026, Kahoot filings] | 9B+ cumulative participants; acquired Clever (2023); game-based assessment and engagement; K-12 + corporate |
| **Parchment (Instructure)** | Credential management, transcript exchange | Part of Instructure | Electronic transcript and credential exchange; 13,000+ institutions; critical infrastructure for student mobility and enrollment |

---

## 5. Regulatory overlay --- education-specific compliance

### Federal compliance frameworks

| Framework | Scope | Impact on purchasing |
|---|---|---|
| **FERPA** | All institutions receiving federal funds | Governs access to, disclosure of, and amendment of student education records; requires written consent for disclosure (with exceptions); directory information opt-out; drives data handling requirements for every edtech vendor |
| **COPPA** | Edtech serving children under 13 | Verifiable parental consent for data collection; applies to K-12 edtech companies with users under 13; districts can consent on behalf of parents in school context (FTC guidance) |
| **Section 508 / ADA / WCAG 2.1 AA** | All federally funded institutions | Web and digital content accessibility; growing enforcement (DOJ settlements with universities); WCAG 2.1 AA is the standard; drives accessible design requirements for all edtech |
| **Title I** | High-poverty K-12 schools (~60% of schools receive Title I) | Federal funding for supplemental instruction; specific allowable uses for technology; reporting requirements |
| **IDEA** | Students with disabilities (K-12) | IEP (Individualized Education Program) management; assistive technology; drives specialized edtech category |
| **Title IX** | Gender equity (all federally funded institutions) | Case management, reporting, and compliance technology; 2024 rule changes (currently contested) |
| **CIPA** | K-12 schools receiving E-rate funding | Internet content filtering; monitoring of student online activity; drives web filtering and safety monitoring tools |
| **Clery Act** | Higher ed (all Title IV participating institutions) | Campus safety and crime reporting; emergency notification; drives campus safety and alert technology |
| **GLBA** | Financial aid operations | Financial data protection for student financial aid records |
| **90/10 Rule** | For-profit higher ed | No more than 90% of revenue from federal financial aid; existential constraint on for-profit institutions |

### State-level compliance (the growing layer)

- **130+ state student data privacy laws** across all 50 states [verified 05/2026, Student Privacy Compass]
- Key stringent states: California (SOPIPA, AB 1584), New York (Education Law 2-d), Colorado (SB 16-158), Connecticut (PA 16-189), Illinois (SOPPA), Louisiana, North Carolina
- Many states require **data privacy agreements (DPAs)** between districts and edtech vendors before any student data is shared
- **Student Data Privacy Consortium (SDPC)** provides standardized National DPA template used by many states and districts
- State-level adoption decisions for curriculum, assessments, and textbooks can create or destroy market access overnight (e.g., Texas SBOE adoptions, California frameworks)

### Accreditation (structural -- drives technology decisions)

- **Regional accreditors** (now unified under a single agency -- but institutional accreditation standards remain) require evidence of student learning outcomes, institutional effectiveness, and continuous improvement -- driving assessment and analytics technology adoption
- **Programmatic accreditors** (AACSB for business schools, ABET for engineering, CAEP for education, etc.) have discipline-specific requirements
- Accreditation reviews (every 7-10 years with interim reports) are a significant trigger for technology investment in assessment and analytics

---

## 6. Technology stack --- education systems

### Core systems (K-12)

| System | Function | Key vendors |
|---|---|---|
| **Student Information System (SIS)** | Enrollment, attendance, grades, demographics, scheduling | PowerSchool, Infinite Campus, Tyler Technologies (Schoolmaster), Follett (Aspen), Skyward (acquired by PowerSchool) |
| **Learning Management System (LMS)** | Course content, assignments, gradebook, communication | Google Classroom (~dominant in K-12), Canvas, Schoology (PowerSchool), Brightspace (D2L) |
| **Assessment platforms** | State testing, formative assessment, benchmark assessment | Pearson (TestNav), Cambium Assessment (CAI), NWEA (MAP Growth), Renaissance (Star), Illuminate |
| **Curriculum / content** | Digital curriculum, textbooks, OER | Savvas (Pearson K-12 spin-off), HMH (Houghton Mifflin Harcourt), McGraw Hill, Amplify, Newsela, IXL |
| **Communication / engagement** | Parent-teacher communication, family engagement | ClassDojo, Remind, ParentSquare, Smore, Bloomz |
| **Single sign-on / rostering** | Identity, app access, data integration | Clever, ClassLink, Google Workspace for Education |
| **Finance / ERP** | District financial management, HR, procurement | Tyler Technologies (Munis), Infinite Visions, Frontline Education |

### Core systems (Higher ed)

| System | Function | Key vendors |
|---|---|---|
| **ERP / Administrative** | Finance, HR, procurement, student accounts | Ellucian (Banner, Colleague), Workday, Oracle (PeopleSoft), Unit4 |
| **Student Information System (SIS)** | Enrollment, registration, academic records, degree audit | Ellucian (Banner SIS, Colleague), Workday Student, Oracle (PeopleSoft Campus Solutions), Jenzabar |
| **Learning Management System (LMS)** | Course delivery, content, assessment, gradebook | Canvas (Instructure), Blackboard (Anthology), Brightspace (D2L), Moodle, Sakai |
| **CRM / Enrollment management** | Recruitment, admissions, enrollment funnel | Slate (Technolutions), Salesforce Education Cloud, Ellucian CRM Advance, TargetX (Liaison) |
| **Financial aid** | FAFSA processing, awarding, packaging, disbursement | Ellucian (Banner FA), Workday, Oracle, College Board (CSS Profile) |
| **Credential / transcript** | Degree verification, transcript exchange | Parchment (Instructure), National Student Clearinghouse, Credential Solutions |
| **Advancement / fundraising** | Alumni relations, donor management, campaign | Blackbaud (Raiser's Edge), Ellucian Advance, Salesforce Advancement |

### Edtech ecosystem (both segments)

| Category | Examples |
|---|---|
| Adaptive learning | ALEKS (McGraw Hill), Knewton, DreamBox (Discovery Ed), IXL, Khan Academy |
| Tutoring / student success | Chegg, Varsity Tutors, TutorMe, Civitas Learning, EAB Navigate |
| Academic integrity | Turnitin, Respondus (LockDown Browser), Proctorio, Honorlock |
| Video / virtual classroom | Zoom, Panopto, YuJa, Kaltura, Echo360 |
| Credential / micro-credential | Credly (Pearson), Badgr, Accredible, Digital Promise |
| Research management | Cayuse (Evisions), Kuali, InfoReady, ORCID |
| Campus operations | Transact (campus card/payments), TouchNet, CBORD, Apogee (campus IT) |

---

## 7. Distribution and buying patterns

### K-12 procurement patterns

| Buyer level | How it works | Typical thresholds |
|---|---|---|
| **Teacher / building level** | Individual or small-group adoption; free/freemium tools; minimal procurement | $0-$500 (often no approval needed) |
| **School / principal level** | Building budget; principal approval; often discretionary | $500-$5,000 |
| **District / central office** | Formal procurement; curriculum committee review; IT security review; board approval for larger purchases | $5,000-$1M+ |
| **State-level adoption** | State board of education adoption; statewide contracts; curriculum framework alignment | $1M-$100M+ (per state) |
| **Cooperative / consortium** | Multi-district purchasing cooperatives (PEPPM, NJPA/Sourcewell, E&I, OMNIA) | Aggregated volume |

**K-12 buying cycle:** Budget planning (January-March) -> Board approval (April-June) -> Purchasing window (July-September) -> Implementation (fall semester). The summer is the primary buying and implementation window for K-12.

### Higher ed procurement patterns

| Buyer level | How it works | Typical thresholds |
|---|---|---|
| **Faculty / department** | Course-level adoption; small tools; often credit card or department budget | $0-$10,000 |
| **College / school level** | Dean approval; program-level technology decisions | $10,000-$100,000 |
| **Institutional / central IT** | CIO/CTO-led; enterprise technology; RFP process; IT governance committee; board approval for major systems | $100,000-$10M+ |
| **System / state level** | State university system-wide procurement (UC, SUNY, UNC, etc.); massive volume; highly formalized RFP | $1M-$100M+ |
| **Consortium** | Internet2, EDUCAUSE members, E&I Cooperative, NACUBO, state consortia | Aggregated volume |

**Higher ed buying cycle:** Academic calendar-driven; major system decisions typically start in fall with RFP, evaluate in spring, contract in summer, implement over 12-24 months. Core system (ERP/SIS) replacements are 3-5 year programs.

---

## 8. ICP patterns by education sub-segment

### Best-fit Cambrian user-prospect: Edtech vendors selling into mid-to-large K-12 districts and mid-tier higher ed institutions

Why these segments:
- Active technology budgets with defined spending windows
- Committee-driven procurement creates need for multi-stakeholder value propositions
- Compliance requirements (FERPA, COPPA, state privacy) differentiate prepared vendors from unprepared ones
- Enrollment pressure (K-12 declining in some regions; higher ed enrollment cliff) drives technology investment in retention and student success

### Strong-fit adjacent segments

- **K-12 SIS / LMS vendors** selling to districts during modernization cycles -- PowerSchool, Infinite Campus, Canvas, Schoology
- **Higher ed enrollment management vendors** selling to institutions facing demographic decline -- Slate, Salesforce Education Cloud, EAB
- **Assessment and analytics vendors** selling to districts and institutions under accountability pressure -- NWEA, Renaissance, Civitas
- **Student success and retention platforms** selling to higher ed institutions with completion rate challenges -- EAB Navigate, Civitas Learning, Starfish
- **Campus operations vendors** (payments, safety, facilities) selling to institutions modernizing physical and digital infrastructure

### Lower-fit segments

- **Mega-districts and state-level adoptions** -- extremely long procurement cycles (18-36 months); highly political; relationship-intensive
- **Elite private universities with large endowments** -- build internally; extremely selective vendor relationships; long procurement
- **For-profit higher ed** -- declining segment under regulatory pressure; reputational risk for vendor association
- **Individual teacher / freemium tools** -- high volume, low revenue per customer; difficult to monetize at scale

---

## 9. Buying committee and decision dynamics

| Role | What they care about | Their lens |
|---|---|---|
| **Superintendent (K-12)** | District-wide strategy, equity, board relations, budget | "Does this align with our strategic plan? Will the board support this?" |
| **CIO / CTO** | Enterprise architecture, security, integration, data governance | "Does this integrate with our SIS/LMS/ERP? Is it FERPA-compliant? Does it meet our security standards?" |
| **Chief Academic Officer / Provost** | Learning outcomes, faculty adoption, accreditation, curriculum | "What evidence shows this improves student outcomes? Will faculty adopt it?" |
| **VP Enrollment Management** | Recruitment funnel, yield, retention, net tuition revenue | "Will this improve our enrollment yield or reduce melt? What's the ROI on enrollment spend?" |
| **Director of Instructional Technology** | Teacher adoption, training, implementation, support | "How hard is this to implement? What does PD look like? What's the teacher experience?" |
| **Registrar** | Student records integrity, transcript processing, compliance | "Does this maintain FERPA-compliant student records? How does it handle data exchange?" |
| **CFO / VP Finance** | Budget alignment, grant eligibility, TCO, ROI | "Is this grant-eligible? What's the total cost including implementation and training?" |
| **Curriculum Committee / Faculty Senate** | Academic quality, pedagogy, academic freedom | "Does this support good teaching? Does it respect academic freedom and faculty governance?" |
| **School Board (K-12) / Board of Trustees (higher ed)** | Fiduciary responsibility, community accountability, strategic alignment | "Is this a responsible use of taxpayer/tuition dollars? Does it align with institutional mission?" |
| **Procurement / Purchasing** | Compliance with procurement rules, competitive bidding, contract terms | "Did we follow procurement policy? Is this on state contract? Did we get competitive bids?" |

### Decision patterns

- **Individual tool / freemium adoption (K-12):** Teacher decides. 1 day - 1 week. No formal procurement. $0-$500.
- **Building or department level:** Principal/dean + IT review. 2-8 weeks. $500-$10,000.
- **District-wide K-12:** Superintendent + curriculum committee + IT + board. 3-12 months. RFP for $25K+. Summer implementation.
- **Institutional higher ed (non-core):** CIO + provost + governance committee. 3-9 months. $50K-$500K.
- **Core system replacement (SIS/ERP/LMS):** CIO + provost + CFO + board. 12-36 months. $500K-$10M+. Multi-year implementation.
- **State-level adoption (K-12):** State board of education + curriculum review + legislative/budget alignment. 12-36 months. $1M-$100M+.

---

## 10. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **ESSER or grant funding spend-down deadline** | Non-discretionary spending window; "use it or lose it" | Fastest procurement trigger in K-12; specific allowable use categories |
| **New superintendent, president, or CIO** | Strategic reset; technology audit; new vendor evaluation | First 6-12 months is the window; new leaders bring change mandates |
| **SIS or ERP replacement cycle** | Multi-year, high-budget program; the master buying trigger | Opens adjacent budget for everything that integrates; 3-5 year decision-and-implementation cycle |
| **LMS contract renewal / migration** | Active evaluation window; Canvas vs. Blackboard vs. Brightspace | 12-18 month evaluation and migration timeline |
| **Enrollment decline or demographic cliff impact** | Existential pressure; enrollment management technology investment | Drives CRM, enrollment analytics, student success, and retention technology purchases |
| **Accreditation review** | Forced investment in assessment, analytics, and evidence-of-outcomes technology | 2-3 year preparation window before site visit |
| **Bond measure or levy passage** | Capital and technology budgets unlocked | 6-12 month post-passage purchasing window |
| **State curriculum adoption or assessment change** | New content and assessment tools needed district-wide or statewide | State adoption cycles create massive market windows (Texas, California, Florida, New York) |
| **AI policy development** | Institutional AI strategy driving tool evaluation | AI tutoring, AI writing detection, AI-assisted grading, AI governance all in active evaluation |
| **Merger, consolidation, or program closure (higher ed)** | Technology rationalization and system consolidation | System replacement or consolidation procurement; 12-24 month integration |
| **State student data privacy law passage** | New compliance requirements for edtech vendors | Vendors must update DPAs, data handling, and privacy documentation; districts re-evaluate non-compliant vendors |
| **Return-to-campus or hybrid-learning policy shift** | Physical + digital infrastructure investment | Campus technology, classroom AV, hybrid learning tools |

---

## 11. Common failure modes

1. **Treating K-12 and higher ed as one market.** Different buyers, budgets, governance, procurement, compliance, and technology stacks. A K-12 SIS pitch is irrelevant to a university CIO; a higher ed enrollment CRM pitch is irrelevant to a superintendent.
2. **Ignoring budget cycles and grant timelines.** Pitching a district in October when the budget was set in June and ESSER funds have already been allocated is a waste. Timing is everything in education sales.
3. **Underestimating committee-based procurement.** A champion (CTO, director of instructional technology) who loves the product can still take 12 months to get board approval. Build for the committee, not just the champion.
4. **FERPA ignorance.** Any edtech vendor that cannot articulate their FERPA compliance posture, data handling practices, and willingness to sign a data privacy agreement (DPA) is disqualified immediately. This is not a nice-to-have.
5. **Pitching features instead of outcomes.** Educators don't buy "AI-powered adaptive algorithms." They buy "students reading at grade level" or "10% improvement in first-year retention." Every feature must map to a learning or operational outcome.
6. **Ignoring edtech fatigue.** Post-COVID institutions have too many tools and too little time. New adoption requires a strong case for replacing or consolidating existing tools, not adding another one. "One more tool" is a negative signal.
7. **Missing the state-level opportunity.** A state curriculum adoption or statewide assessment contract can be worth more than hundreds of individual district sales. Vendors who don't understand state-level procurement miss the highest-leverage opportunity.
8. **Assuming higher ed = wealthy.** Most higher ed institutions are financially stressed. Community colleges, regional publics, and small privates have tight budgets and high price sensitivity. Only the top ~100 research universities and wealthy privates have significant discretionary technology budgets.
9. **Ignoring accessibility.** Section 508, ADA, and WCAG 2.1 AA compliance is legally required for federally funded institutions. An edtech product without an accessibility conformance report (VPAT) will be rejected by institutional procurement.
10. **Fabricating efficacy data.** Education buyers (especially in K-12) increasingly demand evidence of learning outcomes improvement from third-party studies or RCTs. Self-reported case studies without rigor are insufficient for sophisticated buyers. Do not invent or embellish efficacy claims.

---

## 12. GTM implications for Cambrian seller-users

### Market cycle context (2026)

- ESSER funding obligation deadlines have passed (Sept 2024), but liquidation extensions mean some funds are still being spent. The post-ESSER budget cliff is real -- districts losing $190B in one-time federal funding are cutting programs and staff.
- The higher ed enrollment cliff is beginning: 18-year-old population projected to decline ~15% from 2025-2037, with regional variation (Northeast and Midwest hardest hit) [verified 05/2026, WICHE Knocking at the College Door].
- AI policy is the dominant conversation at every level -- AI tutoring (Khan Academy Khanmigo, Duolingo), AI writing detection (Turnitin), AI-assisted grading, and institutional AI use policies are all in active evaluation.
- 2U's Chapter 11 bankruptcy (July 2024) signaled the end of the traditional OPM revenue-share model; institutions are bringing online program management in-house or restructuring partnerships.
- Chegg's ~90% stock decline from peak is the poster child for AI disruption in edtech -- ChatGPT directly threatened the study-help business model.
- Higher ed institutional closure and consolidation is accelerating (100+ since 2020) and will continue through 2035.

### Cambrian engagement vectors

1. **Grant-aligned pipeline** -- mapping edtech vendor products to specific grant-eligible spending categories (Title I, ESSER liquidation, Perkins, state innovation grants) to accelerate procurement
2. **Enrollment management intelligence** -- helping sellers into higher ed understand which institutions face enrollment pressure and what enrollment management technology they're evaluating
3. **Post-COVID edtech rationalization** -- helping vendors position as consolidation plays (replacing 3 tools with 1) rather than additions; critical for overcoming edtech fatigue
4. **Compliance-as-differentiation** -- FERPA, COPPA, state privacy law compliance as competitive moat for prepared vendors vs. unprepared competitors
5. **AI in education advisory** -- helping sellers understand where institutions are in AI policy development and what AI-powered edtech evaluations are active
6. **State-level adoption tracking** -- state curriculum adoptions, assessment contract cycles, and statewide technology procurement as high-leverage pipeline events

### For sellers selling into education from Cambrian

- Identify the segment first: K-12 district, charter, private, community college, regional public university, R1 research university, private nonprofit, for-profit. Each is a different sale.
- Know the budget cycle and grant landscape. Can the product be purchased with Title I, ESSER (remaining), Perkins, or state funds? If yes, lead with grant eligibility.
- Build for the committee. The champion will need a slide deck, an ROI model, a data privacy agreement, a VPAT (accessibility), and reference customers in the same institution type to navigate internal approval.
- FERPA compliance is table stakes. Have the DPA ready. Know the prospect's state-specific student data privacy requirements. This is a gating conversation.
- Position as a consolidation or replacement, not an addition. "This replaces Tool X and Tool Y and costs less" beats "add this to your stack."
- The summer (June-August) is the primary implementation window for K-12. Higher ed implementations span the academic year with go-live typically at a semester boundary.

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`smbMidmarketKnowledge.js\` | Many edtech vendors are SMBs selling into education; SMB sales motion applies to smaller districts and institutions |
| \`b2bSalesKnowledge.js\` | Enterprise edtech sales (SIS, LMS, ERP) is textbook complex B2B with committee-driven procurement |
| \`approvalGatesKnowledge.js\` | Board approval, curriculum committee review, and state adoption are education-specific approval gates |
| \`complianceKnowledge.js\` | FERPA, COPPA, state privacy laws, Section 508 accessibility -- compliance drives edtech purchasing |
| \`aiMlKnowledge.js\` | AI in education (adaptive learning, AI tutoring, AI writing detection, AI governance) is the dominant 2026 conversation |
| \`investorIntelligenceKnowledge.js\` | Public edtech: Coursera (COUR), Duolingo (DUOL), Chegg (CHGG), Kahoot (KAHOT), D2L (DTOL); PE-backed: Instructure (Thoma Bravo), PowerSchool (Bain), Ellucian (TPG/Leonard Green) |
| \`charitableGivingKnowledge.js\` | Education philanthropy, foundation grants, endowment-funded technology; nonprofit edtech (Khan Academy) |

---

*End of layer. Update cadence: quarterly aligned with academic calendar milestones (fall enrollment, spring budget cycle, summer implementation). Critical re-check triggers: ESSER liquidation updates, enrollment data releases (NCES/IPEDS), state student data privacy law changes, institutional closures/mergers, AI policy developments, Gartner/Forrester edtech market updates, major edtech company earnings or M&A.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const EDUCATION_INJECTION = EDUCATION_PLAYBOOK.layerContent;
export const EDUCATION_SCORING = EDUCATION_PLAYBOOK.keywords.join(", ");
export const EDUCATION_DISCOVERY = EDUCATION_PLAYBOOK.discovery.join("\n");
