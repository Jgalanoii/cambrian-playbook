// src/data/okrKpiKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// OKRs, KPIs, and Measurement Architecture.
// Cross-cutting layer — applies to ALL B2B prospects.
// Covers: OKR framework, KPI architecture, revenue/sales/marketing/CS
// metrics, dashboard design, reporting cadence, performance management
// platforms, strategic planning software, and OKR adoption as a buying
// signal for management maturity.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_OKR_KPI (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   John Doerr, "Measure What Matters" (OKR framework, Intel/Google origin):
//     whatmatters.com
//   Cambrian operator knowledge (KPI benchmarks, reporting cadence)
//   SaaS industry benchmarks (NRR, pipeline coverage, win rate norms)
//   Lattice, 15Five, BetterWorks, Quantive — platform documentation
//   Gartner, Strategic Planning & OKR Software Market (2025-2026):
//     gartner.com/reviews/market/strategic-planning-software
//   Forrester, Performance Management Technology (2025-2026):
//     forrester.com
//   Josh Bersin, HR Technology Market Report (2025-2026):
//     joshbersin.com
//   McKinsey, "How OKRs Help Organizations Navigate Uncertainty" (2024):
//     mckinsey.com
//   SHRM, Performance Management State of the Market (2025):
//     shrm.org
//   Deloitte, Human Capital Trends (2025-2026):
//     deloitte.com/us/human-capital-trends
//   OpenView Partners, SaaS Benchmarks (2025-2026):
//     openviewpartners.com
//
// -- KNOWN TRAPS --
//   1. OKR adoption does NOT equal OKR maturity. Most companies attempt OKRs
//      and fail within 2-3 quarters. Surviving past 4 quarters is the real
//      signal of management maturity.
//   2. "Performance management" (reviews, feedback, comp) and "performance
//      measurement" (OKRs, KPIs, dashboards) are related but distinct markets
//      with different buyers and budget lines.
//   3. Platform vendor market share shifts rapidly — consolidation via M&A
//      (Ally.io → Microsoft, Gtmhub → Quantive, BetterWorks acquisitions)
//      means ownership changes often. Verify current state before citing.
//   4. KPI benchmarks vary 2-5x across segments (SMB vs enterprise, PLG vs
//      sales-led, vertical). Never cite a benchmark without segment context.
//   5. "OKR software" and "strategic planning software" overlap but are not
//      identical — pure OKR tools (Quantive, Perdoo) vs strategic planning
//      suites (Workboard, Planview) vs performance management with OKR
//      modules (Lattice, 15Five) serve different buyers.

// -- OKR/KPI INJECTION --
// Injected when OKR/KPI context is relevant to any B2B prospect — this is
// a cross-cutting layer, not a vertical. Applies universally.

export const OKR_KPI_INJECTION = `
OKR & KPI MEASUREMENT CONTEXT (cross-cutting — apply to ALL B2B prospects):

SECTION 1 — SNAPSHOT & MARKET SIZING:
Performance management software market ~$5-6B globally (2025), growing 12-15% CAGR [verified 05/2026, Gartner / Josh Bersin HR Technology Report]. OKR-specific tooling is a ~$800M-$1.2B sub-segment within the broader performance management and strategic planning market [verified 05/2026, Gartner / Forrester]. Adoption: ~60-70% of Fortune 500 companies have attempted OKR programs; ~30-40% sustain them beyond four quarters [verified 05/2026, McKinsey / Deloitte Human Capital Trends]. The "OKR-industrial complex" — consulting, tooling, coaching, certification — is a ~$2B ecosystem when you include services alongside software [verified 05/2026, industry estimates]. Growth driver: post-pandemic shift from activity tracking to outcome measurement. Every board now asks "what are the measurable outcomes?" — OKRs are the dominant answer framework in technology companies and increasingly in traditional industries.

SECTION 2 — WHAT MAKES THIS DISTINCT:
OKR/KPI is a CROSS-CUTTING layer, not a vertical. It applies to every B2B prospect because every organization measures something — the question is how well and how systematically. What makes OKR/KPI knowledge a sales weapon:
- OKR ADOPTION AS BUYING SIGNAL: a company that runs disciplined OKRs is a more sophisticated buyer. They evaluate vendors against measurable outcomes, not features. They have defined success criteria. They will ask you "how does your product impact our KRs?" If you can answer that, you win.
- KPI ARCHITECTURE AS ENTRY POINT: asking a prospect about their KPI architecture reveals management maturity, data infrastructure, reporting cadence, and organizational alignment — all of which predict buying behavior, implementation success, and expansion potential.
- MEASUREMENT LANGUAGE AS TRUST BUILDER: speaking in the prospect's measurement language (NRR, OEE, pipeline coverage, CAC payback — whatever their industry uses) signals operational credibility and earns the right to a deeper conversation.
- THE ANTI-PATTERN: vendors who pitch features without connecting to buyer KPIs lose. "Our platform does X" loses to "our platform improves your [specific KR] by [quantified amount] within [timeframe]."

SECTION 3 — SUB-CATEGORIZATION:
OKR FRAMEWORK VARIANTS:
- Classic OKR (Doerr/Intel/Google): Objectives (qualitative, inspiring) + Key Results (2-5 quantitative measures each). 3-5 company-level OKRs annually, reviewed quarterly. 70% hit rate is healthy (stretch, not sandbag). Cascade: company → function → team. The dominant framework in tech.
- V2MOM (Salesforce): Vision, Values, Methods, Obstacles, Measures. Benioff-originated. Still used at Salesforce and influenced orgs. More narrative than OKR.
- 4DX (FranklinCovey): "The 4 Disciplines of Execution." Wildly Important Goals (WIGs) + lead measures + compelling scoreboard + cadence of accountability. Popular in non-tech enterprise.
- Balanced Scorecard (Kaplan/Norton): financial, customer, internal process, and learning/growth perspectives. Older framework, still prevalent in large traditional enterprises, government, and healthcare.
- Hoshin Kanri (X-Matrix): Japanese strategy deployment. Cascading objectives with catch-ball feedback loops. Common in lean manufacturing and Toyota-influenced organizations.

KPI TAXONOMY:
- Leading vs Lagging: leading indicators predict (pipeline coverage, adoption, health score); lagging indicators measure (revenue, churn, win rate). Teams watching only lagging indicators are reactive — this is a universal diagnostic.
- Input vs Output: input metrics = activities team controls (calls made, content published, features shipped); output metrics = results (revenue, retention, NPS). Input metrics are coachable; output metrics are reportable.
- North Star Metric: the single metric that best captures core product value delivery. Airbnb = nights booked, Slack = messages sent, Spotify = time spent listening. Companies without a clear NSM are still searching for product-market fit or organizational alignment.

PERFORMANCE MANAGEMENT vs STRATEGIC PLANNING:
- Performance management: employee reviews, 360 feedback, goal tracking tied to compensation, engagement surveys. Buyer = CHRO / VP People.
- Strategic planning / OKR: company-level objectives, departmental alignment, quarterly reviews, strategy execution. Buyer = CEO / COO / VP Strategy.
- Revenue operations: pipeline management, forecasting, quota attainment, funnel metrics. Buyer = CRO / VP RevOps.
- Business intelligence: dashboards, reporting, data visualization across all KPIs. Buyer = CIO / VP Analytics.
These markets overlap but have distinct buyers, budget lines, and vendor ecosystems.

SECTION 4 — MAJOR COMPANIES (15-20 named):
PURE OKR / STRATEGY EXECUTION PLATFORMS:
- Quantive (formerly Gtmhub): rebranded 2022; the most OKR-focused standalone platform. Used by Adobe, Red Hat, TomTom. Acquired Koan and Weekdone's enterprise book. [verified 05/2026, Quantive website]
- Perdoo: European-origin OKR platform. Clean UI, mid-market focus. Differentiated by combining OKRs with KPIs in a single view.
- Weekdone: Lightweight OKR tool for SMBs. Weekly check-in focus. Estonian origin. Limited enterprise traction.
- Profit.co: Full OKR suite with task management. Broader feature set than pure OKR tools. Growing mid-market presence.
- Ally.io: Acquired by Microsoft (2021), folded into Microsoft Viva Goals. Significant because it brought OKR tooling into the Microsoft 365 ecosystem — massive distribution advantage. [verified 05/2026, Microsoft]
- Microsoft Viva Goals: the Ally.io successor. Integrated with Teams, Outlook, Azure DevOps. Enterprise distribution via M365 licensing. However, Microsoft announced Viva Goals retirement set for 2025, pushing users toward third-party alternatives — verify current status. [verified 05/2026, Microsoft documentation]

PERFORMANCE MANAGEMENT PLATFORMS WITH OKR MODULES:
- Lattice: leading mid-market performance management platform. OKRs + reviews + engagement + compensation + analytics. ~$200M ARR range. Strong in tech companies 200-5,000 employees. [verified 05/2026, Lattice / industry estimates]
- 15Five: performance management with strong coaching/manager-enablement angle. Weekly check-ins + OKRs + reviews + engagement. Acquired by a PE firm in 2024, shifting from PLG to enterprise motion. [verified 05/2026, 15Five / industry reporting]
- BetterWorks: enterprise-focused continuous performance management. OKRs + check-ins + calibration. Targets large enterprise (5,000+ employees). Made several acquisitions to broaden platform. [verified 05/2026, BetterWorks website]
- Culture Amp: employee experience platform — engagement surveys + performance + development + OKR tracking. Australian origin, strong international presence. [verified 05/2026, Culture Amp]
- Leapsome: European performance management platform — OKRs + reviews + engagement + learning. Growing fast in the EU mid-market.
- Workday: the HCM giant — includes goal management and performance modules, but OKR functionality is basic compared to specialists. Matters because Workday customers often default to native goal tools.
- SAP SuccessFactors: same pattern as Workday — enterprise HCM with goal management built in. Dominates large traditional enterprises.

STRATEGIC PLANNING PLATFORMS:
- Workboard: strategy execution platform for large enterprises. Results Management System (RMS). Positioned above pure OKR tools — connects strategy to execution across business units.
- Planview: enterprise work and resource management. Acquired Clarizen. Connects strategic planning to project portfolio management. Large-enterprise buyer.
- Asana Goals: project management platform that added goal/OKR tracking. Distribution advantage from existing PM user base. Goals feature is lightweight vs dedicated OKR tools.
- Monday.com: work OS with goal tracking. Similar play to Asana — leveraging existing user base. Goal features are add-on, not core differentiation.

BI / DASHBOARD PLATFORMS (KPI execution layer):
- Tableau (Salesforce), Looker (Google), Power BI (Microsoft), Domo, Sisense, ThoughtSpot. These are the visualization layer where KPIs actually get displayed and monitored. Not OKR-specific, but critical infrastructure for KPI architecture.

SECTION 5 — REGULATORY OVERLAY:
OKR/KPI itself has no direct regulatory framework, but measurement architecture intersects regulation in several ways:
- SOX COMPLIANCE (Sarbanes-Oxley): public companies must have internal controls over financial reporting. KPI infrastructure — how revenue, pipeline, and financial metrics are calculated and reported — directly touches SOX compliance. Inconsistent metric definitions across systems create SOX risk.
- SEC DISCLOSURE: non-GAAP metrics disclosed to investors (ARR, NRR, pipeline, bookings) must be consistently calculated. The SEC has increased scrutiny of non-GAAP metric definitions since 2022. [verified 05/2026, SEC guidance]
- COMPENSATION REGULATIONS: when KPIs/OKRs are tied to variable compensation, employment law governs how targets are set, measured, and adjudicated. Wrongful termination claims increasingly cite arbitrary KPI targets.
- GDPR / PRIVACY: employee performance data (OKR scores, KPI dashboards with individual metrics) is personal data under GDPR and equivalent regulations. Performance management platforms must handle this data appropriately.
- PAY TRANSPARENCY LAWS: emerging regulations in the US (Colorado, California, New York, Illinois) and EU require disclosure of how compensation relates to performance criteria. This forces formalization of KPI/OKR-to-comp linkage.

SECTION 6 — TECHNOLOGY STACK:
OKR/KPI PLATFORM ARCHITECTURE:
- Goal management engine: the core — creates/edits OKRs, tracks progress, manages cascades, handles scoring (binary, percentage, milestone).
- Integration layer: the critical differentiator. Best platforms pull actual metric values from source systems automatically (Salesforce for pipeline, Jira for engineering velocity, Marketo for MQLs, HubSpot for lead flow, Snowflake/BigQuery for custom metrics). Manual OKR updates die within 2 quarters — automation is the survival requirement.
- Analytics and reporting: progress dashboards, alignment visualization (strategy trees), at-risk detection, historical trend analysis.
- Workflow: check-in cadence management, review cycles, manager 1:1 agendas auto-populated from OKR progress, nudges and reminders.
- SSO / HRIS integration: connects to Okta/Azure AD for authentication and Workday/BambooHR/Rippling for org structure (reporting lines, teams, departments).
- API: REST/GraphQL for custom integrations. Critical for enterprises that want to push OKR data into BI tools or data lakes.

KPI INFRASTRUCTURE STACK (what actually powers measurement):
- Data warehouse: Snowflake, Databricks, BigQuery, Redshift — the single source of truth for metric calculation.
- ETL / ELT: Fivetran, Airbyte, Stitch, dbt — extract data from operational systems, transform into KPI-ready models.
- BI layer: Tableau, Looker, Power BI, Domo — visualization and distribution of KPI dashboards.
- Metric layer: dbt Metrics, Looker Modeling Language, Cube.dev — emerging "semantic layer" that defines KPIs once and serves them consistently across tools. This is the frontier — companies with a well-defined metric layer have dramatically better KPI consistency.
- Alerting: PagerDuty, Datadog, Monte Carlo — anomaly detection and metric deviation alerts.

SECTION 7 — ICP PATTERNS (OKR/KPI as a buying signal):
OKR adoption is one of the strongest cross-cutting buying signals available:

HIGH MATURITY (active OKR program, 4+ quarters):
- Signal: company runs disciplined OKRs with regular reviews, automated tracking, and documented cascade.
- Buying behavior: evaluates vendors against specific KRs. Asks "how does this impact [specific metric]?" in every vendor conversation. Has defined success criteria before the sales process begins. Shorter sales cycles when value is proven; harder to close when it isn't.
- Seller implication: you MUST connect your value proposition to their existing KRs. Do not pitch features — pitch KR impact. Ask for their OKRs in discovery. Map your product to specific key results.

EMERGING MATURITY (attempting OKRs, 1-3 quarters):
- Signal: company has adopted OKR language but execution is inconsistent. Some teams use it, others don't. Manual tracking (spreadsheets, slides). Leadership talks about OKRs but frontline execution is spotty.
- Buying behavior: open to tools that formalize measurement but may not have budget allocated specifically for OKR tooling. The real opportunity is selling your product AND helping them measure its impact within their OKR framework — you become the vendor who makes their OKR program work.
- Seller implication: position your product as the measurable anchor for their emerging OKR program. Offer KPI baselines and improvement tracking as part of implementation.

LOW MATURITY (no formal OKR program):
- Signal: company uses ad hoc goals, annual reviews, MBOs, or no formal measurement framework. KPIs are inconsistently defined, manually tracked, and siloed by department.
- Buying behavior: longer sales cycles, feature-driven evaluation (not outcome-driven), higher risk of post-sale churn because success criteria were never defined. Value realization is harder to prove.
- Seller implication: you need to build the measurement case yourself. Define the KPIs your product will impact, establish baselines during the pilot, and create the scoreboard that proves ROI. You are doing the OKR work for them — which is both harder and more defensible.

SECTION 8 — BUYING COMMITTEE:
In OKR/KPI platform purchases, the committee depends on whether it's a performance management play or a strategic planning play:

PERFORMANCE MANAGEMENT BUYER:
- CHRO / VP People (economic buyer): owns performance management budget. Evaluates based on employee experience, manager enablement, retention impact, and admin efficiency.
- VP Talent / VP People Ops (technical buyer): runs the implementation, owns adoption. Cares about HRIS integration, SSO, data migration from legacy review tools.
- CFO (compensation linkage): involved when OKRs/KPIs tie to variable comp. Wants auditability, consistency, defensibility.
- CIO/IT (security/compliance): data privacy, SOC 2, GDPR, integration architecture. Gate function.
- DEPARTMENT HEADS (champions or blockers): functional leaders who will roll out OKRs to their teams. Their adoption or resistance determines success.
- EMPLOYEES (end users): the people actually writing OKRs, updating key results, doing check-ins. Tool adoption at this level is the make-or-break.

STRATEGIC PLANNING / OKR BUYER:
- CEO / COO (executive sponsor): strategy execution is their mandate. They set the tone for OKR adoption.
- VP STRATEGY / CHIEF OF STAFF (champion): the person operationally responsible for making OKRs work. Often the one who brings in the tool.
- CRO / VP SALES (revenue KPIs): sales metrics are the most instrumented KPIs in most B2B companies. The CRO cares about pipeline visibility, forecast accuracy, and quota attainment dashboards.
- VP FINANCE / FP&A (financial KPIs): budget-vs-actual, unit economics, cash flow — the financial KPI layer. Increasingly involved in operational KPI governance.

CROSS-CUTTING KPI INFRASTRUCTURE BUYER:
- CIO / VP DATA / VP ANALYTICS (economic buyer): owns the data warehouse, BI tools, and KPI infrastructure. Evaluates based on data architecture fit, total cost of ownership, and integration complexity.
- REVOPS LEADER (revenue KPIs): a fast-growing buyer role. Owns the revenue funnel metrics, Salesforce admin, and increasingly the entire go-to-market measurement stack. [verified 05/2026, industry reporting]

SECTION 9 — TRIGGER EVENTS:
Events that create OKR/KPI-related buying windows:
- NEW CEO / COO / CHRO (first 90 days): new executives almost always restructure measurement. "How do we measure success?" is a Day 1 question. This is the highest-signal trigger for OKR platform purchases.
- BOARD PRESSURE ON METRICS: board asks "what are the KPIs?" or "how do you know this is working?" and leadership cannot answer precisely. Creates urgent demand for measurement infrastructure.
- MISSED REVENUE TARGET: triggers forensic analysis of pipeline, forecasting, and sales metrics. Exposes KPI gaps and drives investment in better measurement.
- IPO PREPARATION: requires formalized financial and operational KPIs, SOX-compliant reporting, and consistent metric definitions. 12-18 months before IPO filing is the buying window.
- PE ACQUISITION: PE firms impose standardized KPI frameworks across portfolio companies. 100-day plans always include metric overhaul. Every PE portfolio company is a buyer of measurement infrastructure.
- STRATEGIC PLANNING CYCLE (annual): Q4/Q1 planning season triggers OKR tool evaluation as companies set next-year objectives. Seasonal buying pattern.
- SCALING PAST 200 EMPLOYEES: the threshold where informal goal-setting breaks down and formal OKR/KPI infrastructure becomes necessary. Spreadsheets stop working; dedicated tooling gets budget.
- REMOTE/HYBRID WORK FORMALIZATION: distributed teams require explicit measurement because casual visibility is gone. Accelerated since 2020 and now permanent.
- FAILED OKR ROLLOUT: company tried OKRs, failed (common), and now wants professional tooling + coaching to do it right. This is a strong signal — they are already bought into the concept and have budget for it.
- M&A INTEGRATION: combining two organizations requires harmonized KPIs, unified reporting, and consistent measurement frameworks. Creates buying urgency for both OKR platforms and BI infrastructure.

SECTION 10 — COMMON FAILURE MODES:
Where OKR/KPI programs and the platforms that support them fail:

OKR PROGRAM FAILURES:
- TOO MANY OKRs: 15+ company-level OKRs instead of 3-5. Dilutes focus, creates measurement fatigue, and ensures nothing is actually prioritized. The #1 OKR failure mode.
- KRs THAT ARE ACTIVITIES, NOT OUTCOMES: "Launch feature X" is an activity, not a key result. "Increase user activation from 30% to 50%" is a key result. This confusion kills OKR programs because teams check boxes without driving outcomes.
- NO AUTOMATED DATA: manual OKR updates (monthly slide decks, spreadsheet check-ins) die within 2-3 quarters. People stop updating. Data goes stale. Leadership loses trust in the system.
- SANDBAGGING WHEN TIED TO COMP: linking OKR scores directly to bonuses incentivizes conservative targets. The 70% stretch philosophy collapses. Google explicitly decoupled OKRs from compensation for this reason.
- CASCADE WITHOUT ALIGNMENT: top-down cascade that doesn't allow bottom-up input creates OKRs that are disconnected from frontline reality. "Catch-ball" (bidirectional alignment) is the fix.
- QUARTERLY THEATER: OKRs are set in a big planning meeting, reviewed once at quarter-end, and forgotten in between. No weekly/biweekly check-ins, no at-risk interventions, no course corrections.

KPI INFRASTRUCTURE FAILURES:
- METRIC DEFINITION INCONSISTENCY: sales says ARR is $50M, finance says it is $47M, CS says NRR is 115%, finance says it is 108%. Different definitions, different source systems, different calculation logic. This destroys executive trust in data and creates decision paralysis.
- VANITY METRICS: tracking metrics that look good but do not drive decisions (total registered users vs active users, MQLs vs qualified pipeline, page views vs engagement). Vanity metrics waste dashboard space and analytical attention.
- SNAPSHOT WITHOUT TREND: showing this quarter's number without 4-8 quarters of trend. Snapshots are meaningless without trajectory. Every KPI dashboard should show trend lines.
- NO OWNERSHIP: a KPI without a named owner does not drive action. If nobody's bonus depends on the metric, nobody will move it.
- LAGGING-ONLY: tracking only lagging indicators (revenue, churn, win rate) means you see problems after they have already happened. Without leading indicators (pipeline coverage, adoption velocity, health scores), you cannot intervene.

PLATFORM ADOPTION FAILURES:
- TOOL WITHOUT PROCESS: buying OKR software without establishing the OKR operating rhythm (weekly check-ins, quarterly reviews, annual planning). The tool amplifies the process; it cannot replace it.
- EXECUTIVE NON-ADOPTION: leadership mandates OKRs for teams but does not visibly use the tool or participate in reviews. Employees correctly interpret this as performative and disengage.
- INTEGRATION GAPS: OKR platform that does not connect to the systems where actual work happens (Salesforce, Jira, HubSpot, BigQuery). Manual data entry dooms adoption.

SECTION 11 — GTM IMPLICATIONS:
How to use OKR/KPI knowledge to sell better (regardless of what you sell):

CONNECTING YOUR PRODUCT TO BUYER OKRs:
- In discovery, ask: "What are your top 3-5 company-level OKRs this year?" Then map your product's value to specific key results. This is the single most powerful sales technique against sophisticated buyers.
- Frame ROI in KPI terms the buyer already tracks. Do not invent new metrics. If they measure pipeline coverage, show how you improve pipeline coverage. If they measure NRR, show how you improve NRR.
- Build a "KPI impact map" for your product: for each buyer persona, identify the 3-5 KPIs they are measured on, then articulate how your product moves each one. This map should be the foundation of every sales deck, demo, and proposal.

SELLING OKR/KPI PLATFORMS SPECIFICALLY:
- The buyer is either in pain (failed OKR rollout, board pressure, M&A integration) or in ambition (new executive, scaling past 200, IPO prep). Pain sells faster.
- Implementation + coaching services are critical. The platform alone does not create OKR maturity. Buyers who purchase software-only without adoption services churn at 2-3x the rate.
- Land in one department (usually Product, Engineering, or Sales — the most measurement-oriented functions), prove adoption, then expand to company-wide.
- The competitive landscape is consolidating. Microsoft Viva Goals' uncertain roadmap (retirement announced) creates migration opportunities. Lattice and 15Five adding OKR features puts pressure on pure-play OKR vendors. The winner will be the platform with the deepest integrations and the best adoption flywheel.
- Pricing: per-user models ($4-15/user/month for mid-market; $8-25/user/month enterprise). Enterprise deals typically $50K-$500K ARR depending on employee count and module depth.

UNIVERSAL KPI BENCHMARKS (use as conversation anchors):
REVENUE METRICS:
- ARR: headline metric; Y/Y growth rate determines valuation multiple
- NRR: most predictive for long-term value; >110% healthy, >120% best-in-class [verified 05/2026, OpenView / Bessemer benchmarks]
- Pipeline coverage: 3-5x quota; low coverage predicts forecast misses
- Velocity: stage conversion rates + cycle time; instability signals process dysfunction
- CAC payback: <12mo SMB, <18mo mid-market, <24mo enterprise
- LTV:CAC: 3:1+ healthy, 4:1+ best-in-class

SALES METRICS:
- Quota attainment distribution: if only top 20% hit quota, quota math or territory is broken
- Win rate: 20-35% typical; if 50%+, qualification too loose or pricing too low
- ASP trend: reveals value capture improving or discounting eroding margins
- Discount rate: rising + stable win rate = high price elasticity
- Cycle time by stage: reveals where deals get stuck

MARKETING METRICS:
- MQL→SQL conversion: <20% = poor lead quality or overly tight qualification
- CAC by channel: drives channel mix decisions
- Channel contribution margin (CM): better decision input than attribution alone

CS METRICS:
- NRR: primary CS metric; >110% healthy, >120% best-in-class
- GRR (gross retention): >85% indicates low churn
- Health score: composite (usage, adoption, engagement, outcomes); should predict churn 90+ days ahead
- Cohort analysis: reveals truth aggregates hide — newer cohorts show adverse selection

DASHBOARDS: CEO weekly = 5-8 KPIs. Functional leader = 10-15. Board quarterly = strategic outcomes. Show trends (13-26 weeks), not snapshots. Include targets + variance. A metric without an owner doesn't drive action.

SECTION 12 — CROSS-REFERENCES:
- B2B Sales Knowledge Layer: pipeline coverage, win rate, quota attainment, sales velocity — the most instrumented KPIs in most B2B companies. OKR/KPI is the measurement infrastructure that B2B sales depends on.
- PE/Holdco Knowledge Layer: PE portfolio companies are the highest-density buyers of KPI infrastructure. Every PE 100-day plan includes metric standardization. PE-backed companies disproportionately adopt formal OKR programs because sponsor boards demand measurable outcomes.
- Executive Perspectives Knowledge Layer: C-suite buyers frame decisions in OKR/KPI terms. CEO = strategy execution + company OKRs, CFO = financial KPIs + unit economics, CRO = revenue metrics + pipeline, CHRO = performance management + engagement.
- ICP Fit Knowledge Layer: OKR adoption level is a cross-cutting ICP signal. Companies with mature OKR programs are higher-fit buyers across all verticals.
- Investor Intelligence Knowledge Layer: investors evaluate companies partly on KPI discipline. Consistent metric definitions, automated tracking, and clear leading indicators signal operational maturity — which correlates with fundability and valuation.
- Approval Gates Knowledge Layer: KPI thresholds often serve as approval gates (e.g., "do not advance deal past Stage 3 unless pipeline coverage > 3x"). Understanding how KPIs gate organizational decisions reveals the real decision-making architecture.
- HubSpot / CRM Integration: CRM data is the primary source system for revenue and sales KPIs. OKR platforms that integrate with CRM (pulling pipeline, deal velocity, win rate automatically) have dramatically higher adoption.

KNOWN TRAPS:
- OKR adoption does NOT equal OKR maturity. Most companies attempt OKRs and fail within 2-3 quarters. Surviving past 4 quarters is the real signal. Do not assume sophistication from adoption alone.
- "We use OKRs" can mean anything from "our CEO read Measure What Matters" to "we have a fully automated, quarterly-reviewed, board-visible OKR program." Always probe depth.
- KPI benchmarks vary 2-5x across segments. "Win rate" without specifying SMB/mid-market/enterprise, inbound/outbound, PLG/sales-led is meaningless. Always segment.
- Performance management platform market is consolidating rapidly. Verify current vendor ownership, roadmap, and pricing before citing.
- Microsoft Viva Goals retirement was announced — confirm current status before recommending or referencing as a competitor. [verified 05/2026, Microsoft documentation]
- The line between OKR platforms, performance management, project management, and BI is blurring. Every category is adding goal/OKR features. Pure-play OKR vendors face existential pressure from platform companies adding OKR modules.
`;

export const OKR_KPI_SCORING = {
  highFitSegments: [
    { segment: "PE portfolio companies (100-day metric standardization)", avgFit: "75-85%", reason: "PE sponsors mandate KPI frameworks; budget allocated; timeline compressed; measurable outcomes required" },
    { segment: "Scale-ups (200-2,000 employees) outgrowing spreadsheet OKRs", avgFit: "70-80%", reason: "Pain of informal goal-setting is acute; dedicated tooling gets budget; high adoption potential" },
    { segment: "Tech companies with failed first OKR rollout", avgFit: "70-80%", reason: "Bought into the concept, experienced the pain of doing it wrong, ready for professional tooling + process" },
    { segment: "Pre-IPO companies formalizing KPI infrastructure", avgFit: "65-75%", reason: "Non-discretionary: SOX-compliant reporting, consistent metric definitions, board-ready dashboards required" },
    { segment: "RevOps teams building measurement stacks", avgFit: "65-75%", reason: "Revenue metrics are the most instrumented KPIs; RevOps is the fastest-growing buyer role for measurement tooling" },
  ],
  highFrictionSegments: [
    { segment: "Large enterprises with entrenched Workday/SAP SuccessFactors", avgFit: "20-35%", reason: "Native goal modules are 'good enough'; switching cost is enormous; procurement cycles 12-24 months" },
    { segment: "Companies with no goal-setting culture", avgFit: "25-40%", reason: "Tool without process fails; these companies need cultural change before tooling; high churn risk" },
    { segment: "SMBs under 50 employees", avgFit: "15-30%", reason: "Founder sets goals verbally; formal OKR tooling is overhead; deal size too small to justify sales motion" },
  ],
  keySignals: {
    positive: [
      "New CEO/COO/CHRO in first 90 days (measurement overhaul incoming)",
      "Board asking for standardized KPI reporting",
      "PE acquisition with 100-day plan underway",
      "Failed OKR rollout — bought in on concept, need better execution",
      "IPO preparation timeline (12-18 months out)",
      "Scaling past 200 employees — informal goal-setting breaking down",
      "Revenue miss triggering forensic metric analysis",
      "M&A integration requiring harmonized KPIs across organizations",
    ],
    negative: [
      "Recently deployed Workday/SAP SuccessFactors with goal modules — budget and appetite exhausted",
      "CEO does not believe in formal goal-setting frameworks — cultural mismatch",
      "Under 50 employees with no HR infrastructure",
      "Actively in a major platform migration (ERP, CRM) — no bandwidth for additional tools",
    ],
  },
};

export const OKR_KPI_DISCOVERY = `
OKR & KPI DISCOVERY (apply to ANY B2B prospect):

REALITY (measurement maturity diagnostic):
- What are your top 3-5 KPIs at the company level? How much operating attention actually goes to them?
- Do you run formal OKRs, another goal framework, or something informal? How many quarters have you sustained it?
- If your CFO and CRO sat here independently, would they report the same ARR, pipeline, and quota attainment numbers? (This question exposes metric definition inconsistency — the most common KPI infrastructure failure.)
- What's your reporting cadence — weekly, monthly, quarterly? Who sees what? Where does the data come from?

IMPACT (quantifying measurement gaps):
- Can you show me a cohort analysis — how do retention and expansion vary between best and worst cohorts?
- What's your channel-level contribution margin? Do you have visibility into which channels have negative unit economics?
- What leading indicators predict churn or missed revenue before lagging indicators show the problem?
- When was the last time a KPI dashboard changed a decision? If you cannot point to a specific example, the dashboard is not working.

VISION (connecting product value to buyer metrics):
- What are the 2-3 metrics your board cares about most? How are you tracking against them?
- If our product could move one metric for you — which one would have the biggest impact on your business?
- How do you currently measure vendor ROI? What would success look like 6 months after implementation?

ROUTE (mapping to the buying committee):
- Who owns the measurement infrastructure — is it RevOps, Finance, IT, or the functional leader?
- Are KPIs or OKR scores tied to compensation? If so, how — and who governs the linkage?
- Is there a planning cycle coming up (annual planning, board review, PE operating review) that creates a decision window?
`;

export const OKR_KPI_PLAYBOOK = {
  name: "OKR & KPI Measurement",
  keywords: [
    "OKR", "OKRs", "objectives and key results", "key results",
    "KPI", "KPIs", "key performance indicators", "performance metrics",
    "performance management", "goal setting", "goal tracking",
    "strategic planning", "strategy execution", "measurement",
    "dashboard", "scoreboard", "balanced scorecard",
    "NRR", "net revenue retention", "pipeline coverage",
    "quota attainment", "win rate", "CAC payback",
    "Lattice", "15Five", "BetterWorks", "Quantive", "Gtmhub",
    "Perdoo", "Weekdone", "Profit.co", "Workboard",
    "Viva Goals", "Ally.io", "Asana Goals",
  ],
  personas: [
    "CEO", "COO", "CHRO", "VP People",
    "VP Strategy", "Chief of Staff",
    "CRO", "VP Sales", "VP RevOps",
    "CFO", "VP Finance", "VP FP&A",
    "CIO", "VP Data", "VP Analytics",
    "VP Product", "VP Engineering",
  ],
  triggers: [
    "New CEO/COO/CHRO — measurement overhaul in first 90 days",
    "Board pressure for standardized KPI reporting",
    "PE acquisition with 100-day plan",
    "Failed OKR rollout — ready for professional tooling",
    "IPO preparation (12-18 months out)",
    "Scaling past 200 employees — informal goals breaking down",
    "Revenue miss triggering forensic analysis",
    "M&A integration requiring harmonized KPIs",
    "Annual strategic planning cycle (Q4/Q1 buying season)",
    "Remote/hybrid work formalization requiring explicit measurement",
  ],
  disqualifiers: [
    "Pitching features without connecting to buyer KPIs — the #1 sales mistake against sophisticated buyers",
    "Assuming OKR adoption = OKR maturity (most companies fail within 2-3 quarters)",
    "Citing KPI benchmarks without segment context (SMB vs enterprise, PLG vs sales-led)",
    "Selling OKR software without implementation/coaching services (high churn risk)",
    "Ignoring the performance management vs strategic planning buyer distinction",
    "Treating all goal-setting frameworks as interchangeable (OKR vs 4DX vs BSC vs V2MOM serve different cultures)",
  ],
  heuristics: [
    "OKR adoption is a buying signal for management maturity — companies with mature OKRs are more sophisticated buyers across all categories",
    "Connect your product value to specific Key Results the buyer already tracks — do not invent new metrics",
    "The KPI impact map (your product → their KPIs) should be the foundation of every sales conversation",
    "Manual OKR tracking dies within 2-3 quarters — automation through integration is the survival requirement",
    "PE portfolio companies are the highest-density buyers of KPI infrastructure — every 100-day plan includes metric standardization",
    "The measurement stack (OKR tool → BI layer → data warehouse → source systems) must be evaluated as a system, not in isolation",
    "A metric without an owner doesn't drive action — this is the universal diagnostic for KPI program health",
  ],
};
