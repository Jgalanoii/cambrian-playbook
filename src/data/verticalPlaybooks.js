// src/data/verticalPlaybooks.js
//
// Vertical-specific ICP knowledge extracted from 10 playbook files.
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Each vertical contains: key personas, buying triggers, deal parameters,
// disqualifiers, compliance requirements, competitors, USPs, and heuristics.
//
// Source files: src/data/icp-{vertical}.md

export const VERTICAL_PLAYBOOKS = {
  ai: {
    name: "AI / ML",
    keywords: ["artificial intelligence", "machine learning", "ai/ml", "ai platform", "ai-powered", "llm", "genai", "data science", "deep learning"],
    personas: ["Chief AI Officer", "CDO", "CTO", "CIO", "Head of Data Science", "ML Lead", "AI Ethics Board"],
    triggers: ["Competitor AI launch", "New CAO/CDO hire (first 6 months)", "Efficiency mandate / layoffs", "Board AI mandate with deadline", "EU AI Act / regulatory trigger", "Failed POC from another vendor", "Data readiness milestone"],
    disqualifiers: ["No data readiness (inaccessible, unclean)", "No AI governance posture", "Strong internal build bias", "No pilot appetite with success criteria"],
    compliance: ["SOC 2 Type II", "ISO 27001", "ISO 42001 (AI management)", "EU AI Act", "NIST AI RMF", "Training data provenance / IP exposure", "Sector-specific: HIPAA, SR 11-7, FDA SaMD, FERPA"],
    usps: ["Data moat (proprietary data)", "Workflow integration (embedded in existing tools)", "Evaluation rigor (published evals)", "Privacy/deployment model (VPC, on-prem)", "Model-agnostic architecture", "Vertical/domain specificity", "Deployment speed"],
    heuristics: ["AI maturity spectrum: AI-native vs AI-curious vs AI-averse", "Data posture is a hard filter", "Governance posture predicts deal stalls", "Build/buy bias axis", "Fear + FOMO co-existence: if buyer is regulated (finance, health, gov) → Fear dominates, lead with risk mitigation and compliance; if buyer is tech/startup → FOMO dominates, lead with competitive advantage and speed", "Vertical-specific > horizontal 'AI for everything'"],
  },
  cybersecurity: {
    name: "Cybersecurity",
    keywords: ["cybersecurity", "security", "infosec", "soc", "siem", "edr", "xdr", "zero trust", "ransomware"],
    personas: ["CISO", "Deputy CISO", "SOC Manager", "Security Architect", "GRC Lead", "IT Operations", "Cloud/Infrastructure"],
    triggers: ["Breach / ransomware incident (peer or internal)", "Cyber insurance renewal demands", "Audit finding (SOC 2, PCI, HIPAA)", "New CISO hire (first 6 months)", "Regulatory change (SEC cyber rules, NYDFS)", "M&A event", "Incumbent vendor failure (CrowdStrike outage)", "Cloud migration milestone"],
    disqualifiers: ["Feature-based positioning in crowded category", "Missing MITRE/independent eval results", "No Gartner/Forrester recognition", "Selling to engineers without exec story"],
    compliance: ["SOC 2 Type II", "ISO 27001", "FedRAMP", "StateRAMP", "CMMC (DoD)", "PCI-DSS", "HITRUST/HIPAA", "NYDFS Part 500", "SEC cyber rules", "DORA (EU)", "NIS2 (EU)"],
    usps: ["MITRE ATT&CK coverage (published)", "Independent lab results", "Analyst position (Gartner MQ Leader)", "Platform breadth", "Time to detect/respond (metrics)", "False positive rate (quantified)", "Economic story (tool consolidation, insurance reduction)"],
    heuristics: ["CISOs buy what won't get them fired", "Platform consolidation restructuring buying (60-150 tools)", "Compliance and insurance drive majority of spend", "Validation is everything (third-party > self-reported)", "Engineers evaluate; executives decide; procurement gates"],
  },
  fintech: {
    name: "FinTech",
    keywords: ["fintech", "financial technology", "neobank", "banking as a service", "baas", "lending", "regtech", "banking", "finance", "insurance", "financial services"],
    personas: ["CFO", "Head of Payments", "VP Finance Ops", "Chief Risk Officer", "CCO", "BSA Officer", "Engineering Lead", "Sponsor Bank"],
    triggers: ["Regulatory action (exam finding, MRA, consent order)", "Incumbent vendor sunset/failure", "Volume threshold crossed", "New product/rail launch (FedNow, RTP)", "Fraud/loss event", "Sponsor bank change", "Funding round or M&A", "New Head of Risk/CCO hire"],
    disqualifiers: ["Treating fintech as single market", "Missing compliance kit for bank buyer", "No external compelling event", "Ignoring sponsor bank dynamics", "Under-resourcing reference calls"],
    compliance: ["SOC 2 Type II", "PCI-DSS", "ISO 27001", "SIG Lite/Core (TPRM)", "BCP/DR documentation", "BSA/AML program", "State money transmitter licenses", "Reg E/Z/CC, Nacha, Durbin"],
    usps: ["Licensing/network membership (MTL, card network, ACH, FedNow)", "PCI Level 1, Nacha Preferred Partner", "Sponsor bank relationships", "Settlement speed/economics", "API completeness, webhook reliability", "Regulatory-ready posture (TPRM kit)"],
    heuristics: ["Compelling event is almost always externally imposed", "Volume profile > headcount for requirements", "Compliance kit is ICP filter in both directions", "Fintech is six industries in a trenchcoat — subdivide", "Risk appetite axis: conservative (community bank) vs aggressive (neobank)"],
  },
  healthtech: {
    name: "HealthTech",
    keywords: ["healthtech", "healthcare", "health tech", "digital health", "medtech", "clinical", "ehr", "epic", "payer", "provider", "pharmaceuticals", "pharma", "biotech", "life sciences"],
    personas: ["CFO", "COO", "CMO", "CIO", "CMIO", "Chief Quality Officer", "CNO", "Service Line Leader", "HIPAA Security Officer", "Value Analysis Committee"],
    triggers: ["New C-suite hire (CMO, CMIO, CIO — first 6-12 months)", "EHR implementation/upgrade", "Reimbursement change (new CPT code, VBC contract)", "Regulatory change (CMS rule)", "Quality/accreditation event (Joint Commission findings)", "Merger/acquisition", "Financial pressure (margin compression)", "Workforce crisis (nurse shortage)"],
    disqualifiers: ["No EHR integration", "No clinical evidence (peer-reviewed)", "No reimbursement pathway", "Product adds clinician workflow burden", "Ignoring GPO gatekeepers"],
    compliance: ["HIPAA (Privacy, Security, BAA)", "HITRUST CSF", "SOC 2 Type II", "FDA (510k, De Novo, PMA)", "ONC certification", "21st Century Cures Act", "42 CFR Part 2", "Stark Law, Anti-Kickback"],
    usps: ["Clinical evidence (peer-reviewed, real-world)", "FDA clearance / ONC certification", "Reimbursement pathway (existing CPT/HCPCS)", "EHR integration depth (Epic App Orchard, SMART-on-FHIR)", "FHIR API maturity", "KOL endorsements", "Workflow fit (saves clinician time)"],
    heuristics: ["Reimbursement dictates economics", "Reference and peer influence are overwhelming — KOL > marketing", "EHR system determines integration path and ICP filter", "9-24 month sales cycles typical", "Implementation services often exceed first-year license"],
  },
  "incentives-promo": {
    name: "Digital Incentives, Rewards & Promo",
    keywords: ["incentives", "rewards", "gift card", "recognition", "promo", "merchandise", "loyalty", "employee recognition", "retail", "e-commerce", "consumer goods", "hospitality", "travel", "cpg"],
    personas: ["CHRO", "VP Total Rewards", "CMO", "VP Growth", "VP Research", "CRO", "VP Channel", "Research Ops Manager"],
    triggers: ["New CHRO/VP Total Rewards (first 6 months)", "Engagement survey drop", "M&A integration", "Budget cycle (Q3/Q4)", "Program audit / cost review", "Compliance event (tax, escheatment)", "Incumbent vendor failure", "Internationalization"],
    disqualifiers: ["Treating all use cases as one ICP", "Buyers who don't understand compliance", "Selling platform to service buyer", "Inability to profitably serve volume"],
    compliance: ["CARD Act + state gift card laws", "State escheatment/unclaimed property", "IRS: 1099-NEC >= $600, de minimis $75", "SOX (public buyers)", "GDPR/CCPA for recipient data", "Sweepstakes state registration", "AML/KYC for high-value"],
    usps: ["Catalog breadth & quality", "International coverage", "Integration depth (HRIS, payroll, CRM)", "Compliance handling (auto tax reporting, 1099)", "Fulfillment speed", "Fraud controls", "API & embedded options"],
    heuristics: ["Segment by USE CASE first, buyer second", "Multi-buyer reality: same product sold into HR, marketing, CX, sales", "Regulated as financial product (stored-value)", "Volume pricing dominates; margins thin", "First year of onboarding is fragile window"],
  },
  manufacturing: {
    name: "Manufacturing / Industrial",
    keywords: ["manufacturing", "industrial", "factory", "plant", "oem", "discrete", "process", "automotive", "aerospace", "construction", "agriculture", "energy", "utilities"],
    personas: ["CFO", "COO", "VP Operations", "VP Supply Chain", "Plant Manager", "Continuous Improvement Manager", "OT Team", "Quality", "EHS"],
    triggers: ["Supply chain disruption", "ERP upgrade (SAP S/4HANA, Oracle)", "Plant expansion/greenfield", "M&A integration", "Regulatory action (FDA warning, recall)", "Labor shortage", "Quality event (major recall, OEE miss)", "Industry 4.0 mandate"],
    disqualifiers: ["Treating manufacturing as one market", "Pitching software-only ROI (must use mfg KPIs)", "No plant floor experience", "Corporate-only selling (plants resist)", "No legacy OT integration"],
    compliance: ["Automotive: IATF 16949", "Aerospace: AS9100, ITAR, CMMC", "Food: FSMA, HACCP, GFSI", "Pharma: FDA 21 CFR Part 11/820", "ISO 9001, 14001, 45001"],
    usps: ["Industry/process specificity", "Integration with PLC/SCADA/MES/ERP", "Deployment model (on-prem/edge/hybrid)", "Regulatory validation (FDA Part 11)", "Offline capability/failover", "ROI in mfg KPIs (OEE, first-pass yield, MTBF, scrap)"],
    heuristics: ["Plants hate being told what to do by corporate", "Digital maturity varies enormously", "IT/OT convergence is buying trigger", "Capital vs opex approval pathways differ", "Moving fast and breaking things is non-starter", "Missing fiscal window = 12 months lost"],
  },
  martech: {
    name: "Marketing / MarTech",
    keywords: ["martech", "marketing technology", "marketing automation", "cdp", "attribution", "demand gen", "abm"],
    personas: ["CMO", "VP Marketing", "VP Revenue/Growth", "CRO", "Marketing/RevOps", "Director of Demand Gen"],
    triggers: ["New CMO/VP Marketing (first 6 months)", "New CRO", "Budget cycle (Q4)", "Missed pipeline quarter", "Attribution crisis", "Privacy deprecation (cookies, ATT)", "Platform change (GA4, HubSpot tier)", "M&A stack consolidation"],
    disqualifiers: ["ICP is just 'marketing teams'", "Ignoring RevOps as decision-maker", "Feature-list positioning", "Missing CMO tenure dynamic (< 24 months)"],
    compliance: ["GDPR, CCPA/CPRA", "CAN-SPAM, CASL", "TCPA", "SOC 2 Type II", "ISO 27701 (privacy)"],
    usps: ["Measurable ROI/attribution story", "Stack integration depth", "Data completeness/accuracy", "Time-to-value", "Privacy posture (first-party, cookieless)", "AI-native workflows"],
    heuristics: ["Marketing is six buyers in a trenchcoat — sub-function is real ICP", "Stack-dependent value", "Buyer is often also user", "CMO tenure < 24 months", "Contact-based pricing punishes growth", "CFO tool rationalization pressure post-2023"],
  },
  payments: {
    name: "Payments",
    keywords: ["payments", "payment processing", "acquiring", "issuing", "payfac", "iso", "interchange", "merchant services"],
    personas: ["CFO", "COO", "Head of Payments", "Head of E-commerce", "VP Retail", "Chief Risk Officer", "CPO (ISV)", "Head of Card Program"],
    triggers: ["IC+ pricing renegotiation", "PCI scope expansion", "Chargeback ratio threshold", "Processor outage/sunset", "New rail adoption (FedNow/RTP)", "Card program launch", "Network rule change (tokenization, 3DS2)", "Regulatory change (Durbin, CFPB)"],
    disqualifiers: ["Pitching capability without pricing context", "Ignoring incumbent processor relationship", "Underestimating certification timelines (6+ months)", "Conflating merchant-facing and FI-facing ICPs", "Disruption framing (payments buyers skeptical)"],
    compliance: ["PCI-DSS Level 1", "SOC 2 Type II", "Network certifications (Visa/MC)", "BSA/AML (KYC/CIP)", "State money transmitter licenses", "EMV certifications", "Nacha/ODFI", "Durbin, Dodd-Frank, Reg E/Z"],
    usps: ["Pricing transparency (IC+)", "Network reach & rail coverage", "Approval/auth rates (bps improvement)", "Chargeback automation", "Fraud tooling & risk sharing", "Orchestration (multi-processor)", "Reconciliation (GL-ready, ASC 606)", "Settlement economics"],
    heuristics: ["ICP depends on value-chain position (merchant/ISV/PayFac/ISO/processor/issuer/bank)", "Unit economics dominate: express differentiation in basis points", "Margin-sensitive by design: bps matter", "Network-gated: Visa/MC rules control what's possible", "Missing a network cert disqualifies entire buyer tiers"],
  },
  "professional-services": {
    name: "Professional Services & Consulting",
    keywords: ["consulting", "professional services", "advisory", "fractional", "agency", "boutique", "management consulting"],
    personas: ["CEO/Founder", "CRO", "CMO", "CFO", "PE Operating Partner", "Board Chair", "Investors"],
    triggers: ["New executive hire (first 6 months — TOP trigger)", "Funding round closed (3-6 months post)", "Missed quarter", "Board mandate", "PE acquisition/add-on", "Executive departure (fractional fills gap)", "GTM motion change", "M&A/exit preparation"],
    disqualifiers: ["Undifferentiated positioning ('growth advisor')", "No productization (every engagement unique)", "No case studies", "Broadening ICP to fill pipeline", "Organization not receptive to outside help"],
    compliance: ["MSA, SOW, IP ownership, indemnification", "Varies by client industry"],
    usps: ["Named principal credibility (operating experience)", "Vertical depth (named logos)", "Functional depth", "Stage depth (seed-to-A, B-to-C, PE, pre-exit)", "Named methodology/frameworks", "Body of work (case studies, content)", "Network access", "Outcome orientation (quantified results)"],
    heuristics: ["You sell trust, and trust sells you", "Referral graph IS the ICP machine", "First 3-5 clients define ICP for 2-3 years", "Consulting deals close on relationship, deliver on function", "Specialize or compete on price — no third path", "Pricing strategy IS ICP strategy", "Engagements rarely close without a named trigger"],
  },
  saas: {
    name: "SaaS (Horizontal B2B)",
    keywords: ["saas", "software as a service", "b2b software", "cloud software", "plg", "product-led", "horizontal software", "devtools", "developer tools"],
    personas: ["VP/Director of function", "CFO", "CTO", "Champion (Senior IC/Manager)", "IT/Security", "RevOps", "Procurement", "Legal"],
    triggers: ["New executive hire (first 6 months)", "Funding round", "Incumbent renewal window (60-90 days out)", "Stack consolidation (CFO-led)", "Compliance finding", "Security incident", "Product/market launch", "Key-person dependency failure"],
    disqualifiers: ["Defining ICP as market segment", "Ignoring motion-ICP fit (PLG vs enterprise)", "Over-indexing on deal size without success validation", "Static ICP (annual review too slow)", "No disqualifiers list", "Ignoring 18-month retention cohorts"],
    compliance: ["SOC 2 Type II", "ISO 27001", "GDPR/CCPA", "HIPAA (if PHI)", "FedRAMP (federal)"],
    usps: ["Workflow-native vs bolt-on", "Time-to-value", "Category creation vs displacement", "Integration depth", "AI-native", "Data architecture (real-time vs batch)", "Usage-based pricing as wedge"],
    heuristics: ["Bad-fit customer = 2-3 years churn/NPS drag", "Zero marginal cost = premature ICP expansion (most common failure)", "Motion-ICP coupling (PLG/sales-led/partner = different ICPs)", "Four-layer ICP: firmographic + technographic + operational maturity + buying posture", "TAL test: 500-5,000 accounts (>25k = not operational)", "End users have veto power through adoption", "Without SOC 2, addressable market capped at SMB"],
  },
  government: {
    name: "Government / Public Sector",
    keywords: ["government", "federal", "state government", "local government", "public sector", "govtech", "civic tech", "defense", "dod", "fedramp", "fisma", "municipality"],
    personas: ["CIO/CTO", "Program Manager", "Contracting Officer (CO/COR)", "Agency Head", "IT Director", "CISO", "Chief Data Officer", "Budget Analyst"],
    triggers: ["New administration/leadership (first 12 months)", "Budget cycle alignment (Q4 federal = Sept, state varies)", "Audit finding (IG report, GAO)", "Mandate/legislation (executive order, congressional directive)", "Modernization initiative (cloud-first, zero trust)", "Contract recompete window (incumbent expires)", "Cybersecurity incident", "Citizen complaint volume spike"],
    disqualifiers: ["No FedRAMP/StateRAMP authorization path", "No past performance in government", "Unable to meet FAR/DFAR requirements", "Product requires internet access in classified environments", "No ability to work through channel/integrator partners"],
    compliance: ["FedRAMP (federal cloud)", "StateRAMP (state/local cloud)", "FISMA", "CMMC (DoD supply chain)", "FAR/DFAR", "Section 508 (accessibility)", "FIPS 140-2/3 (cryptography)", "FedRAMP High (DoD/IC)", "ITAR (defense)", "CJIS (law enforcement)", "IRS Pub 1075 (tax data)"],
    usps: ["FedRAMP authorized (or in process with sponsor)", "Past performance (similar agency, similar scope)", "Existing contract vehicle (GSA Schedule, SEWP, BPA)", "ATO timeline and support", "Security documentation package ready (SSP, SAR, POA&M)", "Channel partner ecosystem (systems integrators)", "Proven scalability at government data volumes"],
    heuristics: ["Government buys on contract vehicles, not features — if you're not on a vehicle, you need a partner who is", "Budget is use-it-or-lose-it by fiscal year end — September (federal) is the real buying season", "Past performance is the #1 evaluation criterion — without it, you need a subcontractor relationship", "Decision-making is consensus-driven across CO, program manager, end user, and security — plan for 6-18 month cycles", "Pilots are called 'OTAs' or 'evaluation agreements' — frame accordingly", "Year-of-execution budget means the money for your deal may have been allocated 18 months ago — or not at all"],
  },
  education: {
    name: "Education / EdTech",
    keywords: ["education", "edtech", "k-12", "higher education", "university", "school district", "lms", "student", "campus", "academic"],
    personas: ["Superintendent", "CTO/CIO", "Director of Technology", "Principal", "Dean", "Provost", "VP Academic Affairs", "Director of IT", "Procurement Officer"],
    triggers: ["New superintendent/CTO hire (first 12 months)", "ESSER/federal funding deadline", "Accreditation review", "Enrollment decline", "Student outcome audit", "Technology refresh cycle (3-5 years)", "State mandate (data privacy, accessibility)", "Security incident"],
    disqualifiers: ["No FERPA compliance", "No accessibility (WCAG 2.1 / Section 508)", "Pricing not structured for per-student/per-seat education models", "No integration with major LMS (Canvas, Blackboard, Google Classroom)", "No references from similar-sized districts"],
    compliance: ["FERPA", "COPPA (K-12, under 13)", "CIPA", "Section 508 / WCAG 2.1", "State student data privacy laws (varies by state)", "HECVAT (higher ed vendor assessment)", "SOC 2 Type II"],
    usps: ["FERPA + COPPA compliant with BAA ready", "LMS integrations (Canvas, Blackboard, Google Classroom)", "Education-specific pricing (per-student, annual, grant-aligned)", "Implementation support for academic calendar", "Student outcome data and efficacy studies", "Accessibility certified"],
    heuristics: ["Education buying follows the academic calendar — decisions in spring (March-May), implementation over summer, go-live in fall", "Federal funding (ESSER, Title I, E-Rate) drives large purchases but has complex compliance requirements", "Superintendents and principals make strategic decisions; IT implements; procurement gates", "Reference calls from similar-sized districts are more important than feature demos", "Free/freemium tiers for individual teachers can create bottom-up adoption that drives district-wide purchase"],
  },
};

// ── VERTICAL MATCHER ────────────────────────────────────────────────────────
// Given a seller's market category or description, find the best-matching
// vertical playbook(s). Returns array of {key, name, score}.
// Minimum score threshold: 10 (at least one keyword match required).
// Scores below 10 are noise from partial name matches alone.
export function matchVerticals(text) {
  if (!text) return [];
  const low = text.toLowerCase();
  return Object.entries(VERTICAL_PLAYBOOKS)
    .map(([key, v]) => {
      let score = 0;
      for (const kw of v.keywords) {
        if (low.includes(kw)) score += 10;
      }
      // Partial name match (bonus, not sufficient alone)
      if (low.includes(v.name.toLowerCase().split(" ")[0])) score += 5;
      return { key, name: v.name, score };
    })
    .filter(m => m.score >= 10) // Require at least one keyword match
    .sort((a, b) => b.score - a.score);
}

// ── PROMPT INJECTION BUILDER ────────────────────────────────────────────────
// Given matched vertical keys, build a prompt injection string with the
// most relevant personas, triggers, disqualifiers, and heuristics.
export function buildVerticalInjection(keys) {
  if (!keys?.length) return "";
  const parts = ["VERTICAL-SPECIFIC ICP INTELLIGENCE:"];
  for (const key of keys.slice(0, 2)) { // max 2 verticals to stay within token budget
    const v = VERTICAL_PLAYBOOKS[key];
    if (!v) continue;
    parts.push(`\n--- ${v.name.toUpperCase()} ---`);
    parts.push(`Key buyers: ${v.personas.slice(0, 5).join(", ")}`);
    parts.push(`Top triggers: ${v.triggers.slice(0, 5).join("; ")}`);
    parts.push(`Disqualifiers: ${v.disqualifiers.slice(0, 4).join("; ")}`);
    parts.push(`Compliance gates: ${v.compliance.slice(0, 5).join(", ")}`);
    parts.push(`What matters: ${v.usps.slice(0, 4).join("; ")}`);
    parts.push(`Heuristics: ${v.heuristics.slice(0, 3).join("; ")}`);
  }
  return parts.join("\n");
}
