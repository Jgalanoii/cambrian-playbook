// src/data/professionalServicesKnowledge.js
//
// U.S. Professional Services industry knowledge layer — Big 4, consulting,
// law firms, staffing, managed services, engineering/architecture firms.
// Covers advisory, audit, tax, legal, staffing, and managed-service models.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_PROFESSIONAL_SERVICES (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   IBISWorld, Management Consulting in the US (2026):
//     ibisworld.com/united-states/industry/management-consulting/1421
//   IBISWorld, Accounting Services in the US (2026):
//     ibisworld.com/united-states/industry/accounting-services/1304
//   IBISWorld, Law Firms in the US (2026):
//     ibisworld.com/united-states/industry/law-firms/1374
//   Statista, Management Consulting Services - United States (2026):
//     statista.com/outlook/amo/professional-services/management-consulting/united-states
//   Statista, Legal Services Revenue in the US (2026):
//     statista.com/statistics/legal-services-revenue-us
//   American Lawyer / ALM, Am Law 200 (2025 results, reported 2026):
//     americanlawyer.com
//   Staffing Industry Analysts (SIA), US Staffing Industry Forecast (2026):
//     staffingindustry.com
//   Gartner, PSA and Professional Services Technology (2025-2026):
//     gartner.com/reviews/market/professional-services-automation
//   Kennedy Consulting Research & Advisory (2025-2026)
//   Bureau of Labor Statistics, Professional & Business Services (2026):
//     bls.gov/iag/tgs/iag60.htm
//   Source Global Research, US Consulting Market (2025-2026)
//
// -- KNOWN TRAPS --
//   1. "Professional services" is not one market. A Big 4 audit practice,
//      a 10-partner law firm, and a light-industrial staffing agency have
//      almost nothing in common except billing by the hour.
//   2. Partner economics (PPP, equity dilution, utilization, realization)
//      are the language of the industry. Generic "revenue growth" framing
//      will be ignored.
//   3. Big 4 / large consulting firms have fortress procurement -- 12-18
//      month cycles, preferred-vendor lists, and global sourcing teams.
//   4. Law firm data is notoriously opaque outside the Am Law 200.
//   5. Staffing margins are thin (gross margins 20-35%); do not confuse
//      revenue with gross profit when sizing the market.
//   6. "Managed services" can mean IT outsourcing, BPO, or professional-
//      services-as-a-subscription -- disambiguate before scoring.

// -- PROFESSIONAL SERVICES INJECTION --
// Injected when the seller or target operates in professional services:
// consulting, accounting/audit, law, staffing, managed services, or
// engineering/architecture firms.

export const PROFESSIONAL_SERVICES_INJECTION = `
PROFESSIONAL SERVICES INDUSTRY CONTEXT (use when the target or seller is a consulting firm, accounting/audit firm, law firm, staffing/recruiting agency, managed services provider, or engineering/architecture practice):

VALUE CHAIN -- WHO ADVISES, WHO AUDITS, WHO LITIGATES, WHO STAFFS (structural):
- MANAGEMENT CONSULTING: strategy, operations, technology, and organizational advisory. Revenue from project-based engagements, retainers, and increasingly managed-services/outcome-based contracts. Firms range from Big 4 advisory arms to elite strategy boutiques (MBB) to specialist/niche firms.
- ACCOUNTING & AUDIT: audit (assurance), tax, advisory, and transaction services. The Big 4 (Deloitte, PwC, EY, KPMG) dominate large-enterprise audit; a long tail of regional and local CPA firms serves the mid-market and SMB. Audit is a regulated, mandated service -- public companies must be audited.
- LAW FIRMS: litigation, corporate/transactional, regulatory, IP, labor/employment, and specialty practices. Partnership-driven economics. The Am Law 200 firms dominate large-enterprise legal work; a vast ecosystem of mid-size, boutique, and solo practitioners covers everything else.
- STAFFING & RECRUITING: temporary, contract, permanent-placement, and executive-search services across professional, IT, healthcare, light-industrial, and clerical segments. Revenue recognized on billable hours (temp/contract) or placement fees (perm). Margins are thin -- gross margins typically 20-35%.
- MANAGED SERVICES: recurring, SLA-governed delivery of professional capabilities (IT managed services, outsourced finance/accounting, legal process outsourcing, HR BPO). The professional-services industry is migrating from pure project/T&M billing toward managed-services and subscription models.
- ENGINEERING & ARCHITECTURE: design, planning, inspection, and project management for infrastructure, buildings, and industrial facilities. Often publicly funded; long procurement cycles tied to capital budgets.

PARTNERSHIP ECONOMICS -- THE LANGUAGE OF THE INDUSTRY (structural):
- EQUITY PARTNER: owns a share of the firm, participates in profit distribution, bears capital contribution obligations, and has governance rights. The ultimate buyer persona in a partnership.
- SALARIED / NON-EQUITY PARTNER: partner title without (full) equity -- shares in some profit, less governance power. A growing tier as firms manage the equity-partner pyramid.
- PROFITS PER PARTNER (PPP): the benchmark metric in consulting and law. Am Law 100 average PPP exceeded $2.5M in 2024 [verified Q1 2026, American Lawyer / ALM]. PPP is what partners optimize around -- it drives hiring, leverage, pricing, and technology decisions.
- LEVERAGE RATIO: ratio of associates/staff to partners. Higher leverage = more profit per partner (if utilization holds). A firm with 8:1 leverage operates very differently from one at 3:1.
- UTILIZATION RATE: billable hours / available hours. Target utilization for consultants and lawyers is typically 70-85%. Below 70% signals bench bloat or demand softness; above 85% signals burnout risk and capacity constraints.
- REALIZATION RATE: collected revenue / standard billing value. Measures write-downs, discounts, and collection shortfalls. A realization rate below 90% signals pricing pressure or scope creep.
- BILLING MODELS: time-and-materials (T&M), fixed-fee/project-based, contingency (plaintiff law), success-fee, retainer, managed-services/subscription, and outcome-based. The industry is shifting from T&M toward alternative fee arrangements (AFAs) and managed services.

MARKET STRUCTURE & SIZE (cyclical -- dated):
- US professional services market (consulting + accounting + legal + staffing + engineering/architecture) exceeds $1T in aggregate annual revenue [verified Q1 2026, BLS / IBISWorld / Statista composite].
  - Management consulting: ~$330-370B US revenue [verified 2026, Statista / IBISWorld / Kennedy].
  - Accounting services (audit, tax, advisory): ~$190-220B US revenue [verified 2026, IBISWorld].
  - Legal services: ~$370-400B US revenue [verified 2026, IBISWorld / Statista].
  - Staffing & recruiting: ~$200-220B US revenue [verified 2026, SIA / IBISWorld]. Note: staffing revenue includes pass-through labor costs -- gross profit is ~$50-65B.
- Big 4 global revenues: Deloitte, PwC, EY, and KPMG collectively exceed $200B global revenue [verified 2026, firm annual reports]. Each is a network of legally separate member firms -- procurement, contracting, and delivery vary by country.
- Law firm concentration: the Am Law 100 represent <2% of US law firms but capture ~35-40% of industry revenue [verified 2026, ALM / IBISWorld].
- Staffing is highly fragmented: the top 10 staffing firms hold ~25-30% market share; thousands of local/regional firms compete on relationships and speed.

TECHNOLOGY LANDSCAPE (structural categories + dated vendor context):
- PSA (Professional Services Automation): the operational backbone for project-based firms -- resource management, project planning, time tracking, billing, revenue recognition. Key vendors: FinancialForce (Salesforce-native), Kantata (Mavenlink + Kimble), Certinia, Planview, Replicon, BigTime, Harvest.
- TIME TRACKING & BILLING: universal requirement across all professional services. Standalone (Harvest, Toggl, BigTime, Clio for law) or embedded in PSA/ERP. Resistance to time tracking is a perennial cultural challenge.
- ERP: large firms run SAP, Oracle, or Workday for back-office (finance, HR, procurement). Mid-market firms often use NetSuite, Sage Intacct, or Deltek (especially A/E firms). ERP selection in professional services differs from product companies -- the core entity is the "project" or "engagement," not the "product."
- KNOWLEDGE MANAGEMENT: capturing and reusing institutional expertise. SharePoint, Confluence, and firm-specific knowledge bases. AI-powered knowledge retrieval (search, summarization, expert-finding) is a major 2025-2026 investment area.
- LEGAL TECH: practice management (Clio, PracticePanther, MyCase for SMB; iManage, NetDocuments for large firms), e-discovery (Relativity, Everlaw), contract management (Ironclad, Docusign CLM, Agiloft), legal research (Westlaw, LexisNexis, and now AI-powered entrants).
- STAFFING TECH: ATS (applicant tracking), VMS (vendor management systems like Beeline, SAP Fieldglass, Coupa), CRM, job boards, credentialing platforms. The front-office/middle-office stack is fragmented.
- AI IMPACT (2025-2026): professional services is among the industries most exposed to generative AI disruption. AI is already automating document review, due diligence, code generation, tax prep, contract analysis, and research. Firms are racing to embed AI into delivery (productivity) and offerings (new services). The existential question: does AI compress billable hours (revenue threat) or expand addressable work and margin (opportunity)?

BUYER-ROLE TAXONOMY (structural -- who owns budget):
- MANAGING PARTNER / CEO: firm strategy, profitability, partner compensation, growth direction. The ultimate decision-maker in a partnership.
- COO / Chief Operating Officer: operations, delivery, utilization, capacity planning, real estate, back-office.
- CFO / Finance Partner: financial management, billing, collections, revenue recognition, partner economics.
- CIO / Chief Technology Officer: IT infrastructure, core systems (ERP, PSA), cybersecurity, AI strategy.
- PRACTICE LEADER / INDUSTRY LEADER: P&L owner for a practice area or industry vertical. Controls hiring, pricing, and go-to-market within their domain.
- CHIEF TALENT / PEOPLE OFFICER: recruiting, retention, learning & development, DE&I. In people-intensive businesses, the talent function is a strategic buyer.
- GENERAL COUNSEL (law firms: Managing Partner of the firm itself): risk, compliance, conflicts, professional liability.
- CHIEF KNOWLEDGE OFFICER / CHIEF INNOVATION OFFICER: knowledge management, AI adoption, process innovation. A growing C-suite role, especially in large consulting and law firms.

GTM IMPLICATIONS (structural):
- Subdivide before selling: a Big 4 audit practice, a 50-person management consultancy, a plaintiff law firm, and a light-industrial staffing agency are entirely different ICPs with different economics, buyers, and cycles.
- PPP is the scoreboard in partnerships -- frame value in terms of partner profitability, utilization lift, realization improvement, or leverage optimization.
- Big 4 and Am Law 100 have fortress procurement -- expect 12-18 month cycles, preferred-vendor gates, and global/regional buying dynamics. Mid-market and boutique firms buy faster.
- The T&M-to-managed-services transition is the master structural trend -- technology that enables recurring, SLA-driven delivery models has strong pull.
- AI is both a threat and an opportunity for every professional-services firm. Vendors that help firms capture AI productivity gains without cannibalizing revenue have the strongest positioning.
- Staffing is margin-sensitive -- any technology investment must demonstrate clear ROI on either gross-margin expansion or recruiter productivity, not abstract "efficiency."
- Law firms are culturally conservative and partner-driven -- consensus-based buying, slow adoption cycles, and skepticism of "enterprise software" positioning.
`;

// -- PROFESSIONAL SERVICES SCORING CONTEXT --
// Calibrates ICP fit scoring when target/seller is professional-services-adjacent.
// Bands conform to the normalized scale: Strong Fit 65+, Potential 40-64,
// Poor <40.

export const PROFESSIONAL_SERVICES_SCORING = {
  highFitSegments: [
    { segment: "Mid-market consulting firms (50-500 consultants) investing in PSA/delivery modernization", avgFit: "65-75%", reason: "Active technology buyers with accessible procurement; utilization and realization improvements directly map to partner economics" },
    { segment: "Mid-size law firms (Am Law 200-500 tier) adopting legal tech / AI", avgFit: "60-70%", reason: "Under competitive pressure from both large and boutique firms; investing in efficiency and differentiation; reachable managing partners" },
    { segment: "Regional and national staffing firms scaling contract/temp business", avgFit: "60-70%", reason: "Technology-driven margin expansion is existential; VMS/ATS modernization is a live budget line; faster buying cycles than consulting or law" },
    { segment: "Managed services providers building recurring-revenue practices", avgFit: "60-70%", reason: "The T&M-to-managed-services transition requires new operational tooling (SLA management, usage tracking, subscription billing); active buyers" },
    { segment: "Boutique/specialist consulting firms (10-50 people) with growth ambitions", avgFit: "55-65%", reason: "Lightweight procurement, founder/partner-driven decisions, high willingness to adopt cloud-native tools -- but small deal sizes" },
  ],
  highFrictionSegments: [
    { segment: "Big 4 firms (Deloitte, PwC, EY, KPMG)", avgFit: "20-30%", reason: "Fortress procurement; global preferred-vendor lists; massive internal IT teams; 12-18 month cycles; build-vs-buy bias" },
    { segment: "Am Law 50 / Magic Circle law firms", avgFit: "20-30%", reason: "Conservative, consensus-driven partnership governance; entrenched vendor relationships; long evaluation cycles; high switching costs" },
    { segment: "Solo practitioners and very small firms (<5 people)", avgFit: "15-25%", reason: "Minimal technology budget; owner-operator decision-making optimizes for simplicity and cost, not capability; tiny deal size" },
    { segment: "Light-industrial and clerical staffing (low-margin, commoditized)", avgFit: "25-35%", reason: "Razor-thin margins constrain technology spend; price-driven buyer; limited differentiation opportunity" },
  ],
  keySignals: {
    positive: [
      "PSA or ERP replacement/modernization project underway or budgeted",
      "Practice or firm leadership change (new Managing Partner, COO, CIO) in last 6 months",
      "Transition from T&M billing to managed-services or alternative fee arrangements",
      "AI strategy initiative or Chief Innovation Officer appointment",
      "Utilization rate below 70% or realization rate below 90% (efficiency pressure)",
      "Rapid headcount growth or geographic expansion (scaling pains)",
      "M&A integration (consolidating systems across merged practices)",
      "Knowledge management or expert-finding initiative",
      "Recruiter productivity or candidate-experience modernization (staffing)",
    ],
    negative: [
      "Recently completed a major systems overhaul (PSA, ERP) -- budget and appetite exhausted",
      "Locked into a multi-year enterprise agreement with an incumbent platform",
      "Partner consensus deadlocked or active leadership transition creating decision paralysis",
      "Firm in contraction -- layoffs, office closures, practice shutdowns (survival mode, not buying)",
      "Solo/micro firm with no IT budget or technology appetite",
    ],
  },
};

// -- PROFESSIONAL SERVICES DISCOVERY QUESTIONS --
// Injected into discovery question generation for professional-services-vertical accounts.
// Organized by RIVER stage.

export const PROFESSIONAL_SERVICES_DISCOVERY = `
PROFESSIONAL SERVICES DISCOVERY ANGLES (use when the prospect is a consulting firm, accounting/audit firm, law firm, staffing/recruiting agency, managed services provider, or engineering/architecture practice):

REALITY stage -- current state:
- What practice areas or service lines drive the majority of your revenue, and which are your growth priorities?
- How do you manage resource allocation, utilization tracking, and project delivery today -- what's the operational backbone (PSA, ERP, spreadsheets)?
- What's your current billing model mix -- time-and-materials, fixed-fee, retainer, managed services -- and how is that shifting?
- How do you capture, organize, and reuse institutional knowledge across your firm today?
- For staffing: what's your current tech stack across the front office (CRM, ATS), middle office (VMS, credentialing), and back office (payroll, billing)?

IMPACT stage -- quantify the cost:
- What's your utilization rate across practice areas, and what would a 3-5 point improvement mean in PPP or revenue per consultant?
- How much revenue leaks through write-downs, discounts, and realization shortfalls -- and what's the root cause (scope creep, pricing, collections)?
- What's the cost of mis-staffing engagements -- the wrong people, over-staffed, under-staffed -- in terms of margin erosion and client satisfaction?
- How much partner and senior-staff time goes into administrative overhead (timekeeping, billing review, resource scheduling) versus client-facing work?
- For staffing: what's your fill rate and time-to-fill, and what's the revenue impact of unfilled requisitions?

VISION stage -- frame the future:
- How are you thinking about the T&M-to-managed-services or alternative-fee-arrangement transition, and what operational capabilities would that require?
- What's your AI strategy -- where do you see generative AI augmenting delivery, and where does it threaten the current model?
- If you could redesign your engagement lifecycle -- from business development through delivery through knowledge capture -- what would change?
- For staffing: what does your ideal recruiter-productivity and candidate-experience platform look like?

ENTRY POINTS -- who owns what:
- Managing Partner / CEO (firm strategy, profitability, partner economics)
- COO (operations, delivery, utilization, capacity)
- CFO / Finance Partner (billing, collections, revenue recognition, partner comp)
- CIO / CTO (IT infrastructure, core systems, AI strategy, cybersecurity)
- Practice Leader / Industry Leader (practice P&L, hiring, pricing, go-to-market)
- Chief People / Talent Officer (recruiting, retention, L&D)
- Chief Knowledge / Innovation Officer (knowledge management, AI adoption, process innovation)

ROUTE -- fastest path to yes:
- Pilot scoped to a single practice area or office to contain complexity and demonstrate ROI in partner-economics terms (utilization, realization, PPP impact).
- In partnerships, the managing partner or practice leader is the economic buyer -- but partner consensus is required. Identify the 2-3 influential partners who will champion or block.
- Frame everything in the language of the firm: PPP, utilization, realization, leverage -- not generic SaaS metrics.
`;

// -- PROFESSIONAL SERVICES VERTICAL PLAYBOOK --
// Mirrors the verticalPlaybooks.js structure.

export const PROFESSIONAL_SERVICES_PLAYBOOK = {
  name: "Professional Services",
  keywords: [
    "consulting firm", "management consulting", "strategy consulting",
    "accounting firm", "audit firm", "Big 4", "CPA firm",
    "law firm", "legal services", "Am Law",
    "staffing agency", "recruiting firm", "temporary staffing",
    "managed services provider", "MSP", "professional services automation",
    "engineering firm", "architecture firm",
    "advisory services", "tax advisory", "transaction advisory",
    "legal process outsourcing", "LPO", "IT staffing",
  ],
  personas: [
    "Managing Partner", "CEO", "COO", "CFO", "Finance Partner",
    "CIO", "CTO", "Chief Digital Officer",
    "Practice Leader", "Industry Leader", "Service Line Leader",
    "Chief People Officer", "Chief Talent Officer",
    "Chief Knowledge Officer", "Chief Innovation Officer",
    "General Counsel", "Director of Operations",
    "VP of Recruiting", "VP of Business Development",
  ],
  triggers: [
    "PSA or ERP modernization/replacement project",
    "New Managing Partner, COO, or CIO (first 6 months)",
    "T&M-to-managed-services or alternative-fee-arrangement transition",
    "AI strategy initiative or Chief Innovation Officer hire",
    "Utilization declining or realization rate deteriorating",
    "Rapid headcount growth or geographic expansion",
    "M&A integration (merging practices, systems, cultures)",
    "Knowledge management or expert-finding initiative",
    "Recruiter productivity push (staffing firms)",
    "Partner profitability (PPP) pressure or compensation restructure",
    "Client-experience or NPS improvement initiative",
  ],
  disqualifiers: [
    "Treating 'professional services' as one market (consulting vs law vs staffing differ entirely)",
    "Using generic SaaS metrics instead of partner-economics language (PPP, utilization, realization, leverage)",
    "Ignoring partnership governance and consensus-based decision-making",
    "Underestimating Big 4 / Am Law 50 procurement fortress",
    "Confusing staffing revenue with gross profit (pass-through labor inflates revenue figures)",
    "Pitching 'efficiency' to a T&M firm without addressing the billable-hour cannibalization concern",
    "No integration path to PSA, practice management, or ERP platforms",
  ],
  compliance: [
    "SOX / PCAOB (audit firms -- auditor independence rules)",
    "ABA Model Rules of Professional Conduct (law firms)",
    "State bar regulations and unauthorized-practice-of-law rules",
    "AICPA Professional Standards (accounting)",
    "ITAR / export controls (engineering/defense consulting)",
    "EEOC and state employment law (staffing)",
    "Data privacy -- GDPR, CCPA, client confidentiality obligations",
    "Professional liability / E&O insurance requirements",
    "Non-compete and non-solicitation enforceability (varies by state)",
    "SEC independence rules (audit firms serving public companies)",
  ],
  usps: [
    "Integration with PSA platforms (FinancialForce, Kantata, Certinia) and practice management (Clio, iManage)",
    "Partner-economics framing -- ROI expressed in utilization, realization, PPP, and leverage terms",
    "Firm-type specificity (consulting vs law vs staffing vs A/E)",
    "Support for alternative fee arrangements and managed-services billing models",
    "Knowledge capture and AI-augmented delivery capabilities",
    "Named references in the same firm type and size tier",
  ],
  heuristics: [
    "Subdivide professional services first -- consulting, accounting, law, staffing, engineering are separate ICPs",
    "PPP is the scoreboard in partnerships -- frame every value proposition in partner-profitability terms",
    "Utilization and realization are the two operational levers partners care about most",
    "Big 4 and Am Law 50 are fortress accounts -- 12-18 month cycles, preferred-vendor lists, global sourcing",
    "Mid-market firms (50-500 professionals) are the sweet spot: real budgets, accessible decision-makers, meaningful deal sizes",
    "The T&M-to-managed-services shift is the master structural trend driving technology investment",
    "AI is the most consequential force in professional services since offshoring -- every firm is grappling with it",
    "In partnerships, you sell the managing partner and the practice leaders, but you need partner consensus to close",
    "Law firms are culturally conservative -- 'enterprise software' positioning triggers skepticism; lead with practice-specific language",
    "Staffing is margin-math -- every technology investment must show clear recruiter-productivity or gross-margin ROI",
  ],
};
