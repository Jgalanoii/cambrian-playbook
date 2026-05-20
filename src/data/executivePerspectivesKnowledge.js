// src/data/executivePerspectivesKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// Executive Perspectives library (Moat Architecture SS3.1).
// Role-keyed knowledge layer: teaches the brief generator how each
// C-suite role thinks, what they are measured on, and how sellers
// should approach them.
//
// Tier 1 ONLY (structural, durable role archetypes).
// No named current executives. No company-specific current data.
// No Tier 3 facts. These are archetypal patterns grounded in
// published executive research.
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) only. Role archetypes are durable.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live.
//   - Every sourced claim carries a [Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Gartner CxO Surveys (2023-2025):
//     gartner.com/en/insights/cfo, gartner.com/en/insights/cio-agenda
//   McKinsey, The New CEO Playbook (2024):
//     mckinsey.com/featured-insights/leadership
//   Deloitte CxO Signals Survey (2024-2025):
//     deloitte.com/us/en/insights/topics/leadership/cxo-signals
//   IBM CEO Study (2024):
//     ibm.com/thought-leadership/institute-business-value/c-suite-study/ceo
//   Forrester, The CRO Mandate (2024):
//     forrester.com/research/the-cro-mandate
//   Heidrick & Struggles, Route to the Top (2024):
//     heidrick.com/route-to-the-top
//   Harvard Business Review, First 90 Days framework (Watkins):
//     hbr.org/books/the-first-90-days
//   IANS / Artico Search, CISO Compensation & Budget Survey (2024):
//     iansresearch.com
//   Gartner CMO Spend Survey (2024):
//     gartner.com/en/marketing/research/cmo-spend-survey
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx via fetchKnowledgeLayer().

// -- EXECUTIVE PERSPECTIVES INJECTION --
// Injected when the brief targets or involves a named C-suite role.
// Provides the brief generator with structural understanding of how
// each role thinks, what they measure, and what language resonates.

export const EXECUTIVE_PERSPECTIVES_INJECTION = `
EXECUTIVE PERSPECTIVES (use when the target buyer or internal champion holds a C-suite or VP-level title):

GENERAL PRINCIPLES — HOW C-SUITE BUYERS DIFFER FROM LINE BUYERS (structural):
- Executives buy OUTCOMES, not features. They think in business cases, not product demos.
- Their time horizon is 1-3 years (strategic plan cycle), not quarters.
- They delegate evaluation to their team but make or break the final decision based on strategic alignment, risk, and peer/board credibility.
- Average tenure for a C-suite executive is 4.9 years [verified 05/2026, Heidrick & Struggles, Route to the Top 2024]. A new exec in the first 90-180 days is the highest-probability buying window — they have a mandate to change things and political capital to spend.
- 69% of CEOs say technology decisions are now "too important to delegate to IT" [verified 05/2026, IBM CEO Study 2024]. Cross-functional buying committees are the norm; even a "CIO decision" has CFO, COO, and business-line stakeholders.
- C-suite buyers pattern-match to peer narratives. "Here is what a [same-role] at a [comparable company] achieved" is the single most effective opening frame.

═══════════════════════════════════════════════════════════════
CFO — CHIEF FINANCIAL OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Steward the company's financial health — capital allocation, risk management, and shareholder/stakeholder value creation. The CFO translates strategy into financial plans and ensures the organization can fund its ambitions while meeting compliance and reporting obligations.

METRICS THEY OWN:
- Revenue growth rate, gross margin, EBITDA / operating margin
- Free cash flow (FCF) and cash conversion cycle
- Return on invested capital (ROIC)
- Working capital efficiency (DSO, DPO, DIO)
- Total cost of ownership (TCO) for major spend categories
- Earnings predictability and forecast accuracy
- Audit findings and SOX compliance (public companies)

FIRST-90-DAY PRIORITIES:
- Audit current spend and identify waste or misallocated capital
- Assess financial planning and reporting infrastructure
- Build relationship with the board's audit committee
- Establish or tighten financial controls and approval thresholds
- Review vendor contracts for consolidation and renegotiation leverage

LANGUAGE THEY USE:
"Total cost of ownership," "payback period," "IRR," "NPV," "capital efficiency," "cash conversion," "unit economics," "run-rate savings," "margin accretion," "risk-adjusted return," "below the line," "OpEx vs CapEx treatment," "dilutive," "accretive."

HOW TO APPROACH:
Lead with the business case, not the product. Show payback period (ideally <18 months), total cost of ownership vs. alternatives, and impact on metrics they report to the board. CFOs respect precision — vague "ROI" claims without math are disqualifying. Quantify current-state cost, proposed-state cost, and the delta. Frame operational improvements as margin impact.

WHAT THEY FEAR:
Uncontrolled spend that erodes margins. Surprises in the forecast. Regulatory non-compliance (SOX, tax, audit). Technology investments that become shelfware — sunk cost with no measurable return. Being the one who approved a large spend that failed visibly.

BUDGET AUTHORITY:
Can typically approve operational expenditures within board-approved budget thresholds (often $250K-$1M unilaterally depending on company size). Capital expenditures above threshold require board or committee approval. Has veto power over any significant spend as the financial gatekeeper. Influences all major purchasing decisions even when not the primary buyer [verified 05/2026, Deloitte CxO Signals 2024].

═══════════════════════════════════════════════════════════════
CRO — CHIEF REVENUE OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Own the entire revenue engine — from pipeline generation through close through expansion. The CRO unifies sales, often marketing, and sometimes customer success under one number: revenue attainment. They are measured on growth, and their tenure depends on hitting plan.

METRICS THEY OWN:
- Annual recurring revenue (ARR) / total revenue vs. plan
- Net revenue retention (NRR) / net dollar retention (NDR)
- Pipeline coverage ratio (3-5x quota is healthy)
- Win rate by segment, stage conversion rates
- Average contract value (ACV) and deal cycle time
- Customer acquisition cost (CAC) and CAC payback period
- Sales productivity (quota attainment distribution, ramp time)
- Gross and net churn

FIRST-90-DAY PRIORITIES:
- Diagnose pipeline health: coverage, conversion, velocity
- Assess sales team capability and quota attainment distribution
- Understand ICP clarity and whether reps are selling into it
- Identify the biggest leaks in the funnel (lost deals, stalled deals, discounting)
- Align comp plans to desired behaviors (bookings vs. ARR vs. margin)

LANGUAGE THEY USE:
"Pipeline coverage," "stage conversion," "velocity," "quota attainment," "ramp time," "land and expand," "NRR," "expansion revenue," "sales-assisted vs. self-serve," "signal-based selling," "buyer intent," "champion development," "multi-threading," "competitive displacement."

HOW TO APPROACH:
Lead with revenue impact — either top-line growth acceleration or reduced revenue leakage. CROs care about speed-to-value and time-to-revenue. Show how you compress deal cycles, improve win rates, or reduce churn. Use their language. Reference pipeline math they can verify. Avoid ROI abstractions — show revenue math: "X more deals x $Y ACV = $Z incremental ARR."

WHAT THEY FEAR:
Missing the number. Pipeline that looks full but does not convert. Reps who cannot sell consultatively. Churn that erodes growth. Being blindsided by a quarter that falls apart in week 10. Losing top performers to competitors. The board losing confidence in the revenue plan.

BUDGET AUTHORITY:
Owns the sales and often marketing budget — typically 20-40% of revenue in SaaS companies [verified 05/2026, Forrester, The CRO Mandate 2024]. Can approve sales tools, enablement platforms, and revenue tech within budget. Large platform decisions (CRM replacement, major data buys) may require CFO/CEO co-approval. Headcount decisions within plan are autonomous; incremental headcount requires CFO alignment.

═══════════════════════════════════════════════════════════════
CIO — CHIEF INFORMATION OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Deliver and operate the technology infrastructure that enables the business. The CIO balances "keep the lights on" reliability with modernization and innovation. They translate business strategy into technology roadmaps and manage vendor ecosystems, integration architecture, and IT governance.

METRICS THEY OWN:
- System uptime / availability (SLA attainment)
- IT spend as a percentage of revenue
- Project delivery (on-time, on-budget, on-scope)
- Application portfolio rationalization (number of apps, redundancy)
- Cybersecurity posture (often shared with CISO)
- Cloud migration progress and cloud spend optimization
- Employee productivity / digital experience scores
- Vendor consolidation and total vendor count

FIRST-90-DAY PRIORITIES:
- Map the application portfolio and identify redundancy and technical debt
- Assess infrastructure reliability and security posture
- Build relationships with business-line leaders to understand their technology pain
- Review major vendor contracts and renewal timelines
- Identify quick wins that demonstrate IT as a business enabler, not a cost center

LANGUAGE THEY USE:
"Rationalization," "technical debt," "integration architecture," "total cost of ownership," "cloud-native," "API-first," "composable architecture," "vendor consolidation," "digital transformation," "shadow IT," "governance," "scalability," "time to deploy."

HOW TO APPROACH:
Lead with architecture fit — how does your solution integrate with what they already have? CIOs are allergic to "one more vendor" and "one more integration." Show consolidation potential, standards compliance, and low operational burden. Emphasize security, governance, and supportability. Reference their existing stack if known. Frame as reducing complexity, not adding it.

WHAT THEY FEAR:
Outages and breaches that make headlines. Runaway cloud costs. Shadow IT proliferating outside their governance. Being seen as a bottleneck to the business. Technology debt compounding until systems are unreplaceable. Vendor lock-in that constrains future decisions.

BUDGET AUTHORITY:
Owns the IT budget — typically 3-8% of revenue depending on industry [verified 05/2026, Gartner IT Spending Forecast]. Can approve technology purchases within budget plan, typically up to $500K-$2M depending on company size. Enterprise platform decisions (ERP, CRM, core systems) require cross-functional committee and CFO/CEO approval. Has strong influence over any technology-adjacent purchase even if budget sits elsewhere. 64% of CIOs report increased budget authority over the past three years [verified 05/2026, Gartner CIO Agenda 2025].

═══════════════════════════════════════════════════════════════
CISO — CHIEF INFORMATION SECURITY OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Protect the organization's information assets, ensure regulatory compliance for security and privacy, and manage cyber risk to a level the board and business can tolerate. The CISO translates threat landscapes into risk frameworks and defenses.

METRICS THEY OWN:
- Mean time to detect (MTTD) and mean time to respond (MTTR)
- Security incident count, severity, and trend
- Vulnerability remediation SLAs (patch cadence)
- Compliance audit results (SOC 2, ISO 27001, PCI-DSS, HIPAA, etc.)
- Phishing simulation click rates / security awareness scores
- Third-party / vendor risk assessment coverage
- Security spend as a percentage of IT spend
- Cyber insurance coverage and insurability posture

FIRST-90-DAY PRIORITIES:
- Conduct a risk assessment and threat landscape review
- Audit existing security tooling — identify gaps and overlap
- Review incident response plan and test it
- Assess third-party and supply-chain risk exposure
- Establish board reporting cadence and risk communication framework
- Understand regulatory obligations specific to the industry and geography

LANGUAGE THEY USE:
"Attack surface," "threat vector," "zero trust," "defense in depth," "risk appetite," "residual risk," "compliance posture," "supply chain risk," "incident response," "tabletop exercise," "SIEM," "SOAR," "EDR," "XDR," "least privilege," "data loss prevention," "breach notification."

HOW TO APPROACH:
Lead with risk reduction, not features. CISOs evaluate through a risk lens: what threat does this mitigate, at what cost, and how does it integrate with their existing security stack? They are skeptical by training — overblown claims trigger distrust. Show compliance alignment (which frameworks you support), integration with their SIEM/SOAR, and evidence of your own security posture (SOC 2, pen test results). Reference specific threat categories relevant to their industry.

WHAT THEY FEAR:
A breach on their watch — career-ending and personally liable in some regulatory regimes. Sophisticated supply-chain attacks they cannot see. Board and CEO losing patience with security spend that "never shows ROI." Shadow IT and unmanaged SaaS expanding the attack surface. Regulatory fines and enforcement actions. Talent shortage making it impossible to staff the security team [verified 05/2026, IANS/Artico CISO Survey 2024].

BUDGET AUTHORITY:
Security budgets have grown to 5-15% of IT spend [verified 05/2026, Gartner Security Spending 2024], but CISOs often do not control the full budget — portions sit with IT, engineering, or compliance. Can typically approve point solutions and tooling within allocated budget ($100K-$500K range). Platform-level security investments require CIO and CFO alignment. Increasingly reports directly to CEO or board rather than through CIO, which has expanded their influence.

═══════════════════════════════════════════════════════════════
CHRO — CHIEF HUMAN RESOURCES OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Attract, develop, and retain the workforce the company needs to execute its strategy. The CHRO owns the employee experience from recruitment through exit, manages organizational design, and advises the CEO on culture, talent risk, and workforce planning.

METRICS THEY OWN:
- Employee engagement scores
- Voluntary turnover rate and regretted attrition
- Time to fill and cost per hire
- Diversity, equity, and inclusion (DEI) metrics
- Internal mobility and promotion rate
- Total compensation cost as a percentage of revenue
- Learning and development spend and completion rates
- Employee net promoter score (eNPS)
- Workforce planning accuracy (headcount vs. plan)

FIRST-90-DAY PRIORITIES:
- Listen tour — understand what employees and managers actually experience
- Assess talent bench strength and succession pipeline
- Review compensation philosophy against market benchmarks
- Evaluate HR technology stack (HCM, ATS, LMS, payroll)
- Identify cultural friction points and engagement drivers
- Align workforce plan to business strategy and headcount model

LANGUAGE THEY USE:
"Talent density," "employer brand," "total rewards," "employee experience," "engagement," "regretted attrition," "succession planning," "workforce planning," "organizational design," "change management," "culture," "people analytics," "belonging," "well-being."

HOW TO APPROACH:
Lead with impact on talent outcomes — retention, engagement, productivity, or employer brand. CHROs think in terms of employee experience journeys, not point solutions. Show how you fit into the broader HR tech ecosystem (Workday, SAP SuccessFactors, etc.). Quantify the cost of the problem (turnover cost = 1-2x salary per departure is a widely accepted heuristic). Emphasize change management and adoption — CHROs know that tools without adoption are waste.

WHAT THEY FEAR:
Losing key talent to competitors. A toxic culture event that becomes public (Glassdoor, social media, press). Regulatory exposure on compensation, classification, or DEI. An HR tech stack that is fragmented and does not give them a single view of the workforce. Being unable to hire fast enough to support growth. The board questioning whether people strategy is rigorous enough.

BUDGET AUTHORITY:
Owns the HR/people budget including technology, L&D, benefits administration, and recruitment. Spend is typically $1,000-$3,500 per employee per year for HR technology [verified 05/2026, Deloitte Human Capital Trends 2024]. Can approve within budget autonomously. Benefits redesign and major HCM platform changes require CFO and CEO co-approval. Has significant influence on total compensation and headcount budgets but shares authority with CFO.

═══════════════════════════════════════════════════════════════
COO — CHIEF OPERATING OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Execute the strategy by running the operational engine. The COO owns the "how" — processes, efficiency, scalability, and cross-functional coordination. In many organizations, the COO is the CEO's operational alter ego and the person who makes complex organizations actually work.

METRICS THEY OWN:
- Operational efficiency ratios (cost per unit, throughput, utilization)
- Process cycle times and SLA attainment
- Quality metrics (defect rate, error rate, rework percentage)
- Customer satisfaction / operational NPS
- Supply chain performance (on-time delivery, fill rate, inventory turns)
- Headcount productivity (revenue per employee, output per FTE)
- Cross-functional project delivery (on-time, on-budget)
- Operational risk incidents

FIRST-90-DAY PRIORITIES:
- Map end-to-end operational workflows and identify bottlenecks
- Assess scalability — what breaks when volume doubles?
- Review the operating model: centralized vs. decentralized, insourced vs. outsourced
- Identify quick operational wins that build credibility
- Establish operating cadence (weekly, monthly, quarterly reviews)
- Align operational KPIs with business strategy

LANGUAGE THEY USE:
"Operating leverage," "scalability," "process optimization," "bottleneck," "throughput," "SLA," "operating model," "shared services," "center of excellence," "lean," "Six Sigma," "continuous improvement," "capacity planning," "operational risk," "runbook."

HOW TO APPROACH:
Lead with operational impact — cycle time reduction, error rate elimination, or scalability unlocked. COOs think in processes and systems, not features. Show before-and-after process maps. Quantify operational waste in their current state. They value reliability and predictability above innovation — prove it works at scale before talking about edge cases. Reference implementations in operationally complex environments.

WHAT THEY FEAR:
Operational failure at scale — the system breaking under load, during a surge, or during a crisis. Manual processes that do not scale with growth. Lack of visibility into operational performance until it is too late. Key person dependencies in critical processes. Regulatory or compliance failures rooted in operational breakdowns.

BUDGET AUTHORITY:
Varies significantly by organization — some COOs control the majority of operational spend (facilities, supply chain, shared services), while others operate within functional budget holders. Typically can approve operational technology and process improvement investments within their scope [verified 05/2026, Cambrian operator knowledge]. Cross-functional initiatives require CEO and CFO alignment. In operationally intensive businesses (manufacturing, logistics, healthcare), the COO may control the majority of total company spend.

═══════════════════════════════════════════════════════════════
CMO — CHIEF MARKETING OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Drive demand, build the brand, and own the customer narrative. The CMO translates market opportunity into pipeline and revenue through positioning, campaigns, content, and customer insights. In modern B2B, the CMO owns or co-owns the top of the revenue funnel.

METRICS THEY OWN:
- Marketing-sourced pipeline and revenue contribution
- Marketing qualified leads (MQLs) and conversion to sales-accepted leads (SALs)
- Cost per lead (CPL) and cost per acquisition (CPA)
- Brand awareness and consideration metrics
- Website traffic, engagement, and conversion rates
- Customer lifetime value (CLV) influence
- Marketing ROI / return on marketing investment (ROMI)
- Share of voice and competitive positioning
- Net promoter score (NPS) — often shared with product/CX

FIRST-90-DAY PRIORITIES:
- Understand the pipeline — where does demand actually come from today?
- Audit the martech stack (often 50-100+ tools) for redundancy and underutilization
- Assess brand positioning and competitive differentiation
- Align marketing metrics with sales and revenue goals (kill the MQL-revenue gap)
- Identify the highest-ROI channels and reallocate spend accordingly
- Build or repair the marketing-sales handoff process

LANGUAGE THEY USE:
"Demand gen," "pipeline contribution," "brand equity," "share of voice," "content strategy," "ABM (account-based marketing)," "intent data," "attribution," "multi-touch attribution," "CAC," "CLV," "conversion rate," "funnel velocity," "GTM motion," "product-led growth," "community-led growth."

HOW TO APPROACH:
Lead with pipeline and revenue impact — CMOs are under intense pressure to prove marketing's contribution to revenue, not just activity metrics. Show attribution clarity: how does your solution connect to pipeline and revenue? CMOs are drowning in tools — 68% say their martech stack is too complex [verified 05/2026, Gartner Marketing Spend Survey 2024]. Position as consolidation or amplification, not another tool. Use case studies with clear before-and-after revenue metrics.

WHAT THEY FEAR:
Being seen as a "cost center" rather than a revenue driver. Marketing-leader tenure is the shortest in the C-suite — median 3.3 years [verified 05/2026, Spencer Stuart Tenure Study]. Martech sprawl that consumes budget without measurable return. The attribution gap: marketing generates demand but cannot prove it. Brand damage from a social media crisis, messaging misfire, or competitor narrative. AI disrupting content, SEO, and demand gen channels.

BUDGET AUTHORITY:
Marketing budgets have compressed to 7.7% of revenue in 2024, down from 11%+ in 2020 [verified 05/2026, Gartner Marketing Spend Survey 2024]. CMOs control this budget but face intense CFO scrutiny on every dollar. Can approve marketing technology and campaign spend within allocated budget. Major brand investments, agency retainers, and platform changes often require CFO sign-off. Martech now consumes 25.4% of the total marketing budget — the largest single line item [verified 05/2026, Gartner Marketing Spend Survey 2024].

═══════════════════════════════════════════════════════════════
CDO — CHIEF DIGITAL OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Drive the organization's digital transformation — new digital business models, digital customer experiences, and digitization of core operations. The CDO bridges technology and business strategy, focused on growth and innovation through digital capabilities rather than infrastructure maintenance.

METRICS THEY OWN:
- Digital revenue as a percentage of total revenue
- Digital channel adoption and transaction volume
- Digital customer experience scores (CSAT, CES, NPS for digital channels)
- Speed of digital product delivery (release cadence, time to market)
- Digital self-service adoption rate
- Data monetization or data-driven decision-making maturity
- Innovation pipeline (proofs of concept launched, graduated, killed)
- Employee digital fluency / digital skills adoption

FIRST-90-DAY PRIORITIES:
- Assess digital maturity across the organization (McKinsey's Digital Quotient or equivalent)
- Map the customer journey and identify digital experience gaps
- Inventory digital initiatives already in flight — consolidate, prioritize, or kill
- Build coalition with CIO (technology delivery) and business line leaders (adoption)
- Identify one or two high-visibility digital wins to establish credibility
- Define the digital P&L or contribution framework so progress is measurable

LANGUAGE THEY USE:
"Digital transformation," "digital-native," "omnichannel," "customer journey," "personalization," "digital product," "design thinking," "agile," "test and learn," "data-driven," "platform play," "ecosystem," "API economy," "composable digital experience."

HOW TO APPROACH:
Lead with customer or revenue impact through digital channels. CDOs think in journeys and experiences, not systems. Show how your solution enables a digital experience that moves a metric they care about (digital revenue, adoption, NPS). CDOs are often in a turf tension with CIOs — be sensitive to organizational dynamics and clarify whether you are a "digital experience" play (CDO) or an "infrastructure" play (CIO). CDOs value speed and experimentation — show time to first value and low-risk pilot paths.

WHAT THEY FEAR:
Digital transformation becoming "digital theater" — lots of activity, no business impact. Organizational resistance to change. Losing the political mandate if early initiatives do not show results. The CIO/CDO overlap creating confusion about who owns what. Being measured on "innovation" without a clear P&L or contribution metric. The role being eliminated or absorbed once the "transformation" is declared complete.

BUDGET AUTHORITY:
Highly variable — some CDOs control a dedicated digital budget (1-5% of revenue), while others influence spend that sits in IT, marketing, or business lines. Can typically approve digital initiatives and pilot funding ($100K-$1M). Larger digital platform investments require CEO, CFO, and CIO alignment. In organizations that take digital seriously, the CDO sits on the investment committee for all technology-adjacent spend [verified 05/2026, McKinsey Digital 2024].

═══════════════════════════════════════════════════════════════
CTO — CHIEF TECHNOLOGY OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Set the technology vision and architecture for the company's products and platforms. The CTO owns the "what we build" — technology strategy, engineering excellence, platform architecture, and R&D direction. In product companies, the CTO is the technical co-founder of the product strategy.

METRICS THEY OWN:
- Engineering velocity (deployment frequency, lead time for changes)
- System reliability (uptime, latency, error rates — DORA metrics)
- Platform scalability and performance under load
- Technical debt ratio and remediation velocity
- R&D spend as a percentage of revenue and R&D efficiency
- Patent and IP portfolio (in IP-intensive industries)
- Engineering talent retention and hiring velocity
- Security and compliance of the product/platform (shared with CISO)

FIRST-90-DAY PRIORITIES:
- Assess the architecture — what scales, what does not, what is technical debt
- Evaluate the engineering team: talent density, velocity, culture
- Understand the product roadmap and align technology strategy to it
- Review build vs. buy decisions for key platform components
- Establish engineering standards, CI/CD practices, and quality gates
- Build relationship with CPO to align on product-technology tradeoffs

LANGUAGE THEY USE:
"Architecture," "scalability," "microservices," "monolith," "technical debt," "developer experience," "CI/CD," "observability," "SRE," "DORA metrics," "build vs. buy," "platform," "API," "event-driven," "data mesh," "MLOps," "infrastructure as code," "toil reduction."

HOW TO APPROACH:
Lead with technical depth and architecture fit. CTOs evaluate the technology itself — its design, scalability, reliability, and how it integrates. They respect technical peers and are turned off by sales pitches that lack technical substance. Show API documentation, architecture diagrams, and performance benchmarks. Demonstrate that you have made thoughtful engineering tradeoffs. Reference their stack if known and show clean integration patterns. CTOs value developer experience — show that engineers will want to use your product.

WHAT THEY FEAR:
Architecture decisions that create irreversible lock-in. Scaling failures that bring down the product during growth. Technical debt compounding until velocity collapses. Losing top engineering talent. Building something that should have been bought (or vice versa). A breach or outage rooted in an architectural weakness they inherited.

BUDGET AUTHORITY:
Owns the R&D / engineering budget — typically 15-25% of revenue in technology companies, 5-10% in non-tech companies [verified 05/2026, Gartner IT Spending Forecast / KeyBanc SaaS Benchmarks]. Can approve tooling, infrastructure, and build-vs-buy decisions within budget. Major platform decisions and large vendor commitments require CEO and CFO co-approval. Has strong veto power over any technology that touches the product or platform, even if budget sits elsewhere.

═══════════════════════════════════════════════════════════════
CPO — CHIEF PRODUCT OFFICER
═══════════════════════════════════════════════════════════════

MANDATE: Define what the company builds and why. The CPO owns the product vision, strategy, and roadmap — translating market opportunity, customer needs, and business strategy into a product that wins. They sit at the intersection of business, technology, and user experience.

METRICS THEY OWN:
- Product adoption and engagement (DAU/MAU, feature adoption rates)
- Customer retention and product-driven NRR
- Product-market fit indicators (PMF surveys, Sean Ellis test)
- Time to value for new customers
- Feature delivery velocity (roadmap delivery vs. plan)
- Customer satisfaction with the product (CSAT, NPS, CES)
- Revenue per product line / product P&L contribution
- Competitive win/loss analysis (product-driven reasons)

FIRST-90-DAY PRIORITIES:
- Talk to 30+ customers and prospects to understand real needs vs. assumed needs
- Audit the roadmap: what is being built, why, and does it align with strategy?
- Assess product-market fit: where is it strong, where is it weak?
- Evaluate the product team: PMs, designers, researchers, and their operating model
- Identify the biggest product gaps relative to competitors and customer needs
- Establish a product operating model (how decisions get made, how tradeoffs are resolved)

LANGUAGE THEY USE:
"Product-market fit," "roadmap," "customer discovery," "jobs to be done," "user story," "MVP," "product-led growth," "adoption," "engagement," "feature parity," "platform vs. point solution," "north star metric," "product ops," "outcome vs. output," "design thinking."

HOW TO APPROACH:
Lead with customer outcomes and product enhancement. CPOs care about what makes their product better, stickier, or more differentiated. Show how your solution enhances their product experience (embedded, white-label, API-first integrations). They evaluate through a product lens: will this create a better user experience? Does it accelerate our roadmap? CPOs respond to customer evidence — show customer quotes, usage data, or demand signals for the capability you provide. Frame as "build vs. buy" — show that buying from you is faster and better than building it in-house.

WHAT THEY FEAR:
Building the wrong thing — investing a year of engineering in a feature customers do not want. Losing product-market fit as the market shifts. Competitive disruption from a product that leapfrogs them. Feature bloat that degrades the user experience. The roadmap becoming a political negotiation rather than a strategic document. Being unable to say "no" to internal stakeholders demanding pet features.

BUDGET AUTHORITY:
Owns the product budget (research, design, product management team) and influences the engineering roadmap allocation. Can approve product tooling, analytics, user research, and build-vs-buy decisions within budget. Major product bets (new product lines, platform pivots) require CEO and board alignment. Has strong influence over where engineering resources are allocated even when the engineering budget sits with the CTO.
`;

// -- EXECUTIVE PERSPECTIVES SCORING CONTEXT --
// Calibrates ICP fit scoring when executive-level persona targeting is relevant.
// Bands conform to the normalized scale: Strong Fit 65+, Potential 40-64,
// Poor <40.

export const EXECUTIVE_PERSPECTIVES_SCORING = {
  scoringPrinciples: [
    "Executive-level targeting is a fit amplifier, not a standalone signal. A high ICP fit score + correct persona targeting = strong outcome probability.",
    "New-in-role executives (first 180 days) add +5-10 points to base fit — they have budget authority, a mandate to change, and political capital to spend.",
    "Executives in Year 3+ of tenure are in maintenance mode — fit is baseline, not amplified, unless there is a strategic trigger (M&A, board mandate, competitive threat).",
    "Multi-persona alignment (e.g., CRO + CFO both have a reason to care) adds +5-10 points over single-persona fit.",
    "Mismatched persona targeting (pitching a CISO play to a CMO, or a brand play to a CFO) is a -10 to -20 penalty — it signals the seller does not understand the buyer's world.",
  ],
  personaFitSignals: {
    positive: [
      "New C-suite hire within the last 180 days in the target persona role",
      "Published strategic initiative that aligns with the seller's value proposition",
      "Earnings call or investor day commentary referencing the problem the seller solves",
      "Board-level mandate or activist investor pressure in the seller's domain",
      "Prior relationship — the target executive has bought from or worked with the seller's company before",
      "Expansion of the executive's scope (e.g., CRO now also owns CS, CIO now also owns security)",
    ],
    negative: [
      "Executive has been in role 5+ years with no change signals — entrenched vendor relationships",
      "Recent RIF or hiring freeze in the executive's function — budget is frozen",
      "The executive's function was recently reorganized or absorbed — mandate is unclear",
      "Pitching to the wrong persona for the value proposition (e.g., operational play to CMO)",
      "Executive is a known 'no new vendors' operator — industry reputation for in-house bias",
    ],
  },
};

// -- EXECUTIVE PERSPECTIVES DISCOVERY --
// RIVER-stage discovery angles keyed by executive role.
// Injected into discovery question generation when an executive
// persona has been identified.

export const EXECUTIVE_PERSPECTIVES_DISCOVERY = `
EXECUTIVE-PERSONA DISCOVERY ANGLES (use when the target buyer is a named C-suite role):

═══ CFO DISCOVERY ═══
REALITY: What are your top 3 cost categories, and where do you see the most waste or inefficiency today?
REALITY: How do you currently evaluate technology investments — what is your approval framework and what payback period do you require?
IMPACT: What is the cost of the operational inefficiency you are trying to solve, expressed as margin impact?
IMPACT: If this problem persists for another 12 months, what does it cost the business in hard dollars?
VISION: What would a world look like where this cost category was 30% lower — what would you reallocate those dollars to?
ENTRY: CFOs respond to precision. Bring a financial model, not a pitch deck.
ROUTE: The CFO is rarely the first meeting — they are the approval gate. Build the business case with the operational buyer first, then present it in CFO language.

═══ CRO DISCOVERY ═══
REALITY: What does your pipeline coverage look like today, and where are the biggest conversion gaps?
REALITY: What is your current win rate, and how does it differ by segment, deal size, or competitor?
IMPACT: What would a 5-point improvement in win rate mean in incremental ARR?
IMPACT: How much revenue is at risk from churn in the next 12 months, and what is the retention plan?
VISION: If your reps could spend 30% more time selling and 30% less time on non-selling activity, what would that unlock?
ENTRY: CROs want to see the revenue math in the first meeting. Abstract ROI is not enough — show the formula.
ROUTE: CROs move fast. If pipeline math checks out, they will champion internally. Give them the ammunition (deck, model, references) to sell it to their CFO.

═══ CIO DISCOVERY ═══
REALITY: What is your current application portfolio, and how many of those applications are redundant or end-of-life?
REALITY: Where are you in your cloud migration or modernization roadmap?
IMPACT: How much of your IT budget is "keep the lights on" vs. innovation, and how is that ratio trending?
IMPACT: What is the integration cost (people, time, risk) of adding a new vendor to your ecosystem?
VISION: If you could rationalize your vendor footprint by 30%, what would that free up in terms of budget and team capacity?
ENTRY: CIOs value architecture conversations over product pitches. Lead with "how we fit" not "what we do."
ROUTE: CIOs often run a formal evaluation process (RFP, POC, security review). Align to their process early — do not try to shortcut it.

═══ CISO DISCOVERY ═══
REALITY: What are the top 3 threat vectors you are most concerned about right now?
REALITY: How do you currently manage third-party and supply-chain risk?
IMPACT: What was the cost (financial, operational, reputational) of your last significant security incident?
IMPACT: How much time does your team spend on compliance evidence collection vs. actual threat mitigation?
VISION: What would your security posture look like if you could automate 50% of your compliance and monitoring workflows?
ENTRY: CISOs are skeptical by nature. Lead with your own security posture (SOC 2, pen test results, architecture). Prove you are not adding risk.
ROUTE: CISOs often have veto power but not purchase authority. Identify whether budget sits with CISO, CIO, or a shared security committee.

═══ CHRO DISCOVERY ═══
REALITY: What is your current voluntary turnover rate, and where is regretted attrition concentrated?
REALITY: How fragmented is your HR technology stack, and do you have a single view of the employee?
IMPACT: What is the fully loaded cost of replacing a departing employee in your highest-turnover function?
IMPACT: How does employee engagement correlate with business outcomes (productivity, quality, customer satisfaction) in your data?
VISION: If you could redesign the employee experience from onboarding to exit, what would you change first?
ENTRY: CHROs value empathy and employee-centric language. Do not lead with technology — lead with the human outcome.
ROUTE: CHROs buy through HR tech ecosystems (Workday, SAP SuccessFactors). Integration with their HCM is often a gating requirement.

═══ COO DISCOVERY ═══
REALITY: What are your top 3 operational bottlenecks today, and how do you measure them?
REALITY: What processes are still manual that should be automated, and what has prevented automation so far?
IMPACT: What is the cost of operational errors or rework in your highest-volume process?
IMPACT: If volume doubles in the next 18 months, what breaks first?
VISION: What does operational excellence look like in your organization — what would you measure to know you have achieved it?
ENTRY: COOs think in processes and systems. Show a process map, not a feature list. Demonstrate that you understand their operational complexity.
ROUTE: COOs value proof at scale. A pilot in a contained environment that demonstrates reliability and throughput is the fastest path to enterprise adoption.

═══ CMO DISCOVERY ═══
REALITY: What percentage of your pipeline is marketing-sourced vs. sales-sourced, and how has that trended?
REALITY: How many tools are in your martech stack, and what percentage are fully utilized?
IMPACT: What is your current cost per lead by channel, and which channels have the best lead-to-revenue conversion?
IMPACT: How confident are you in your attribution model — can you connect marketing spend to closed revenue?
VISION: If you could prove marketing's revenue contribution with the same rigor finance uses, what would change about your budget conversations?
ENTRY: CMOs are under pressure to prove revenue impact. Lead with attribution and pipeline contribution, not vanity metrics.
ROUTE: CMOs have compressed budgets and are consolidating tools. Position as "replaces X" or "amplifies Y you already own," not "one more tool."

═══ CDO DISCOVERY ═══
REALITY: What is your digital revenue as a percentage of total revenue, and what is the target?
REALITY: How many digital transformation initiatives are in flight, and how do you prioritize them?
IMPACT: What is the gap between your digital customer experience and your top competitor's?
IMPACT: How much organizational resistance are you encountering to digital change, and where is it concentrated?
VISION: What does "digital-first" mean for your organization — is it a channel strategy, a business model, or an operating philosophy?
ENTRY: CDOs value speed and experimentation. Show fast time to value and low-risk pilot paths.
ROUTE: CDOs often need CIO support for implementation and CFO support for budget. Help them build the internal coalition.

═══ CTO DISCOVERY ═══
REALITY: What is your current architecture — monolith, microservices, hybrid — and where is the technical debt concentrated?
REALITY: What is your build vs. buy philosophy, and how do you decide?
IMPACT: How much engineering time is spent on maintenance vs. new feature development?
IMPACT: What is the scaling constraint in your current architecture — what breaks at 10x load?
VISION: If you could re-architect one part of the platform from scratch, what would it be and why?
ENTRY: CTOs respect technical depth. Lead with architecture, API design, and engineering tradeoffs — not slides.
ROUTE: CTOs evaluate the technology itself. Offer a sandbox, POC environment, or technical deep-dive with their engineering team. Let the product sell itself to engineers.

═══ CPO DISCOVERY ═══
REALITY: How do you currently prioritize the roadmap — what framework do you use, and who has input?
REALITY: What is the biggest product gap your customers are asking for that you have not built yet?
IMPACT: How much engineering effort would it take to build this capability in-house vs. buying or partnering?
IMPACT: What is the cost of not having this capability — lost deals, churn, competitive disadvantage?
VISION: If you could embed this capability natively into your product, what would the customer experience look like?
ENTRY: CPOs think in customer outcomes and product experiences. Frame your solution as an embedded capability, not a standalone tool.
ROUTE: CPOs evaluate through a build-vs-buy lens. Show that buying from you is faster, cheaper, and better than building it, and that your roadmap aligns with theirs.

KNOWN TRAPS (meta-knowledge — where this layer's data goes stale or gets misinterpreted):
- Executive mandates and metrics are ARCHETYPAL. Any specific executive may have a different scope, different title semantics, or a hybrid role. Always validate the individual's actual scope through discovery.
- Title inflation and title variation are rampant. A "VP of Digital" at one company may hold the same scope as a "CDO" at another. A "CRO" at a startup may own sales only; at an enterprise company, sales + marketing + CS. Do not assume scope from title alone.
- The CIO/CTO/CDO overlap is the most common source of persona misidentification. In many organizations, these three roles overlap or do not all exist. Clarify who owns what before targeting.
- First-90-day data is based on Watkins' "The First 90 Days" framework and general executive onboarding research. The actual window varies — some executives move fast (30-60 days), some take 6-12 months. The 180-day window is a useful heuristic, not a rule.
- Budget authority ranges are structural archetypes. Actual authority varies dramatically by company size, industry, and governance model. A CFO at a $50M company has very different authority than a CFO at a $50B company. Always ask.
- CMO tenure being the shortest in the C-suite is a widely cited finding (Spencer Stuart), but the data fluctuates year to year. The structural insight — CMOs are under more pressure to prove ROI than most peers — is durable even if the exact tenure number shifts.
- The Gartner CMO Spend Survey (marketing budget as % of revenue) has shown a downward trend from 2020-2024. This trend may reverse. The structural insight — CFO scrutiny on marketing spend — is durable regardless of the exact percentage.
`;
