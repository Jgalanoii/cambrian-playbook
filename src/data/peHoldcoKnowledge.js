// src/data/peHoldcoKnowledge.js
//
// Version: 1.1.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// PE-Backed Holding Company & Post-Merger Commercial Integration
// knowledge layer. Covers: post-merger value creation, cross-LOB
// commercial architecture, holdco buying committees, PE-strategic
// hybrid dynamics, vocabulary calibration, failure modes, and
// engagement sizing patterns.
//
// This is NOT a vertical — it's a DEAL-TYPE layer that modifies how
// briefs are calibrated when the target is a PE-backed holding company
// integrating multiple acquired brands into a unified commercial model.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_PE_HOLDCO (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Bain Global PE Report 2025:
//     bain.com/insights/topics/global-private-equity-report
//   McKinsey, Creating Value Beyond the Deal (2024-2025):
//     mckinsey.com/industries/private-equity-and-principal-investors
//   BCG, Value Creation in PE (2024-2025):
//     bcg.com/industries/principal-investors-private-equity
//   PitchBook, US PE Middle Market Report (Q4 2025):
//     pitchbook.com/news/reports
//   Harvard Business Review, Post-Merger Integration (2024-2025)
//   Preqin, Global Private Equity Report (2025):
//     preqin.com/insights/global-reports
//   S&P Global Market Intelligence, PE Deal Activity (2025-2026):
//     spglobal.com/marketintelligence
//   Cambrian operator knowledge (engagement patterns, holdco buying
//     committees, cross-LOB commercial architecture, failure modes)
//
// -- KNOWN TRAPS --
//   1. "PE-backed holding company" is not one archetype. A year-1 platform
//      with two tuck-ins, a year-3 rollup with 12 brands, and a pre-IPO
//      holdco with a public-company partner each have radically different
//      buying dynamics.
//   2. Post-merger "integration" means different things to different
//      stakeholders. Operational integration (ERP, payroll, back-office)
//      is NOT commercial integration (cross-sell, unified account model,
//      seller enablement). Most holdcos finish the first and never start
//      the second.
//   3. The CEO/ExChair may OWN the commercial integration mandate but
//      delegate execution to LOB Presidents who have no incentive to
//      cooperate. Org politics > org chart.
//   4. PE sponsors have dual clocks: the fund's hold-period exit timeline
//      AND (if a public-company partner is involved) quarterly reporting
//      obligations. Proposals must fit BOTH.
//   5. Holdco vocabulary is specific. "Value creation thesis" is correct;
//      "digital transformation" is a disqualifier. Calibrate language
//      precisely or lose credibility in the first meeting.
//   6. Engagement sizing must be small-to-large. A $2M "transformation"
//      proposal to a year-1 holdco will die in committee. A $250-500K
//      26-week diagnostic-to-pilot will get a decision in weeks.
//   7. Cross-LOB revenue data is often the MOST sensitive number in a
//      holdco — it reveals how little cross-sell exists. Treat it as
//      confidential and handle accordingly.

// -- PE-BACKED HOLDCO INJECTION --
// Injected when the target is a PE-backed holding company, a multi-brand
// platform rollup, or a post-merger entity with a commercial integration
// mandate. NOT for single-brand PE portcos (use smbMidmarketKnowledge.js
// PE-BACKED BUYING PATTERNS for those).

export const PE_HOLDCO_INJECTION = `
PE-BACKED HOLDING COMPANY & POST-MERGER COMMERCIAL INTEGRATION CONTEXT
(use when the target is a PE-backed holdco, multi-brand platform, or post-merger entity with cross-LOB commercial integration needs):

=== 1. SNAPSHOT & MARKET SIZING ===
- US PE deal value: ~$900B in 2024, with buyout transactions representing ~$650B [verified 05/2026, Bain Global PE Report 2025 / PitchBook]. Volume depressed from 2021 peak ($1.2T+) but recovering as rate environment normalizes.
- Dry powder (committed but undeployed capital): ~$1.2T in US-focused PE funds as of Q4 2025 [verified 05/2026, Preqin / Bain]. Record levels creating deployment pressure and driving up multiples.
- Add-on acquisitions now represent 70-75% of all PE buyout transactions in the US, up from ~50% a decade ago [verified 05/2026, PitchBook Q4 2025]. The "platform + bolt-on" model has become the dominant PE value creation playbook.
- Average PE hold period: ~5.6 years in 2024, up from ~4.4 years in 2019 [verified 05/2026, Bain Global PE Report 2025]. Longer holds mean more time for commercial integration but also more pressure to demonstrate value creation during the hold.
- PE-backed companies represent ~6,000+ active US portfolio companies at any time [verified 05/2026, PitchBook]. A meaningful fraction (estimated 20-30%) are multi-brand holdcos with 3+ acquisitions integrated or in progress.
- Median PE buyout EBITDA multiple: ~11-13x for middle-market deals ($100M-$1B enterprise value) [verified 05/2026, PitchBook / S&P Global]. Higher multiples = higher pressure to grow EBITDA post-close to justify the entry price.
- The 100-day plan is the universal PE playbook framework: identify and execute quick wins in the first 100 days post-close. Commercial integration rarely makes the 100-day plan because it requires foundational operational integration first. The gap between 100-day-plan completion and commercial integration launch is typically 6-18 months — and that gap is where holdcos stall [verified 05/2026, McKinsey / Cambrian operator knowledge].

=== 2. DISTINCT DYNAMICS ===
POST-MERGER VALUE CREATION BUCKETS (structural — the four levers every PE holdco pulls):
1. COST TAKEOUT: Back-office consolidation (ERP, HR, finance), shared-services center, vendor rationalization, facilities. This is where most holdcos START and often STOP. Fast, measurable, CFO-owned.
2. TECH & WORKFLOW INTEGRATION: Unified CRM, single data warehouse, common tech stack across brands. IT/CIO-owned. Necessary precondition for commercial integration but NOT commercial integration itself.
3. COMMERCIAL INTEGRATION: Cross-LOB selling, unified account model, penetration of existing accounts across all brands, coordinated go-to-market. CEO/ExChair-owned. This is the HARDEST lever and the one with the most upside — typically 15-40% revenue-per-account uplift potential in year 2-3 when executed [verified 05/2026, McKinsey PE value creation research]. Most holdcos underinvest here because it requires behavior change, not just system change.
4. MARGIN MIX SHIFT: Steering revenue toward higher-margin services/products, repricing based on combined capability, cross-selling premium bundles. CFO + LOB Presidents co-own. Only possible AFTER commercial integration architecture is in place.
The critical insight: buckets 1-2 are OPERATIONAL integration (table stakes). Buckets 3-4 are COMMERCIAL integration (differentiated value, where most holdcos stall).

PE-STRATEGIC HYBRID DYNAMICS — THE DUAL-CLOCK PROBLEM (structural):
PE holdcos operate on two simultaneous timelines:
1. PE EXIT TIMELINE: 3-7 year hold period (averaging ~5.6 years in 2024-2025 [verified 05/2026, Bain Global PE Report 2025]). Everything is evaluated against "does this improve the exit narrative and multiple?" Year 1-2 = build; Year 2-4 = scale and prove; Year 4+ = optimize for exit. Late in the hold, NEW initiatives are suspect — the sponsor wants to harvest, not invest.
2. PUBLIC-COMPANY PARTNER REPORTING (when applicable): If a public company is a co-investor, minority holder, or strategic partner, the holdco also faces quarterly earnings pressure, analyst scrutiny, and disclosure obligations. Proposals must produce results that can be REPORTED, not just tracked internally.
The dual clock means: (a) engagement timelines must show measurable progress within 2-3 quarters, not "18-month transformation"; (b) deliverables must be expressible as EBITDA bridge items or exit-narrative proof points; (c) "quick wins" in the first 90 days are mandatory to sustain sponsor confidence.

=== 3. SUB-CATEGORIZATION ===
HOLDCO ARCHETYPES (structural — the five distinct patterns):
A. SERVICES ROLLUP: PE acquires a platform services company and bolts on 5-15 complementary services firms (IT services, staffing, engineering, marketing agencies). Revenue is people-based, cross-sell is service-expansion. Highest cross-sell elasticity because the same customer can buy multiple services. Example pattern: Thoma Bravo rolling up vertical SaaS companies with overlapping customer bases [verified 05/2026, Cambrian operator knowledge].
B. DISTRIBUTION CONSOLIDATION: PE acquires regional distributors and consolidates into a national platform (building supplies, food distribution, industrial parts). Revenue is product-based, cross-sell is catalog expansion. Lower cross-sell elasticity but higher operational synergy (shared warehousing, logistics, procurement leverage). Example pattern: Francisco Partners in B2B distribution technology [verified 05/2026, Cambrian operator knowledge].
C. VERTICAL SOFTWARE ROLLUP: PE acquires vertical SaaS platforms serving the same end-market and integrates into a suite. Revenue is subscription-based, cross-sell is module upsell. Highest revenue quality but cross-sell requires product integration, not just sales coordination. Example pattern: Vista Equity Partners' model of acquiring and integrating vertical software platforms [verified 05/2026, Bain / PitchBook].
D. HEALTHCARE PLATFORM: PE builds a multi-service healthcare delivery platform (physician practices, ambulatory surgical centers, diagnostic labs, home health). Revenue is fee-for-service or capitated, cross-sell is patient referral pathways. Regulatory complexity (Stark Law, Anti-Kickback Statute) constrains commercial integration tactics. Example pattern: common in KKR, Welsh Carson, and Lee Equity Partners healthcare portfolios [verified 05/2026, PitchBook].
E. INDUSTRIAL / MANUFACTURING ROLLUP: PE acquires complementary manufacturers and consolidates into a diversified industrial platform. Revenue is product-based, cross-sell is bundled solutions and shared customers. Longer sales cycles, engineer-led buying committees. Example pattern: common in middle-market PE (CCMP, Genstar, American Industrial Partners) [verified 05/2026, PitchBook].

=== 4. NAMED COMPANIES (sponsor-level reference, not portco-specific) ===
Top PE sponsors driving the holdco model (by relevance to commercial integration dynamics):
- Thoma Bravo: ~$140B+ AUM [verified 05/2026, Thoma Bravo]. Software-focused. The most prolific vertical SaaS rollup sponsor. Portfolio companies frequently face cross-sell integration challenges as bolt-on acquisitions multiply. Commercial integration is a stated value creation pillar.
- Vista Equity Partners: ~$100B+ AUM [verified 05/2026, Vista]. Enterprise software focus. Vista's operating playbook (the "Vista Way") emphasizes operational excellence and margin expansion. Commercial integration is a secondary priority behind cost optimization and pricing discipline.
- Silver Lake: ~$100B+ AUM [verified 05/2026, Silver Lake]. Large-cap technology and technology-enabled services. Holdcos tend to be larger scale with more complex commercial integration challenges.
- Francisco Partners: ~$45B+ AUM [verified 05/2026, Francisco Partners]. Technology-focused middle market. Active bolt-on acquirer — portfolio companies often have 5-10 tuck-ins requiring commercial coordination.
- Insight Partners: ~$80B+ AUM [verified 05/2026, Insight Partners]. Growth equity and buyout, software-focused. ScaleUp operating platform emphasizes revenue growth, making commercial integration a natural priority.
- GTCR: ~$35B+ AUM [verified 05/2026, GTCR]. "Leaders Strategy" — backs management teams to execute transformative acquisitions. Current BHN/Blackhawk Network owner, directly relevant to digital incentives. Holdco commercial integration is central to their thesis.
- Bain Capital Private Equity: ~$65B+ AUM [verified 05/2026, Bain Capital]. Cross-sector. Holdco model used across services, healthcare, and industrial. Strong operating partner cadre focused on revenue growth.
- KKR: ~$110B+ PE AUM [verified 05/2026, KKR]. Cross-sector mega-cap. Healthcare and industrial rollups are common holdco patterns.
- Warburg Pincus: ~$80B+ AUM [verified 05/2026, Warburg Pincus]. Growth-oriented PE. Financial services and healthcare holdco patterns.
- Advent International: ~$90B+ AUM [verified 05/2026, Advent]. Business services and technology. European-origin PE with significant US holdco portfolio.
- Hg Capital: ~$65B+ AUM [verified 05/2026, Hg]. European software-focused PE. Tax & accounting, legal tech, and ERP software rollups with direct professional-services adjacency.
- Propelis: PE-backed holdco ($1B+, CEO Gary Kohl). Cross-LOB commercial architecture wedge — see src/data/accounts/propelis_account_brief.md for deep account brief [verified 05/2026, Cambrian operator knowledge].

=== 5. REGULATORY OVERLAY ===
- HSR Act / antitrust review: Hart-Scott-Rodino filings required for acquisitions exceeding threshold ($119.5M in 2025) [verified 05/2026, FTC]. FTC and DOJ are increasingly scrutinizing PE rollup strategies — multiple tuck-in acquisitions in the same market can trigger "stealth consolidation" concerns even when individual deals are below HSR thresholds.
- FTC scrutiny of PE rollups: the FTC issued a Policy Statement on acquisitions in healthcare and other sectors (2024-2025) specifically targeting PE-backed rollup strategies [verified 05/2026, FTC press releases]. Regulatory risk is real for healthcare, veterinary, and dental holdcos.
- SEC private fund advisor rules (2023-2024): new transparency requirements for PE fund advisors (quarterly fee disclosures, annual audits, restricted activities). Affects how PE sponsors communicate with LPs about holdco performance, including commercial integration metrics.
- Stark Law / Anti-Kickback Statute (healthcare holdcos): physician referral and compensation restrictions directly limit commercial integration tactics in healthcare platforms. Cross-referral incentive structures must be reviewed by healthcare regulatory counsel.
- Non-compete enforceability: FTC's proposed federal non-compete ban affects LOB President and seller retention in holdcos. State-level variation creates compliance complexity for multi-state holdcos [verified 05/2026, FTC / state AG offices].
- Data privacy (CCPA, GDPR, sector-specific): merging customer data across brands for cross-sell analysis requires privacy-compliant data-sharing frameworks. CCPA's "business purpose" limitation and GDPR's "legitimate interest" standard both constrain how holdcos can use customer data cross-brand.
- Employment law / WARN Act: layoffs during post-merger integration trigger WARN Act notification requirements (60 days for 100+ employees). Affects timing and communication of integration-related restructuring.
- State-level consumer protection: some states have consumer-notification requirements when ownership changes (auto dealers, insurance agencies). Affects customer communication during brand consolidation.

=== 6. TECHNOLOGY STACK ===
CROSS-LOB COMMERCIAL ARCHITECTURE FRAMEWORK (structural — the five-phase buildout):
Phase 1 — PENETRATION BASELINE: Map every existing customer relationship across every LOB. Quantify single-LOB vs. multi-LOB penetration. This number is almost always worse than leadership expects (typically <15% of accounts buy from more than one brand [verified 05/2026, Cambrian operator knowledge across multi-brand engagements]).
Phase 2 — ICP UNIFICATION: Build a single Ideal Customer Profile that spans all LOBs. Identify which customer segments can buy 2+ services. Segment by cross-sell propensity, not just individual-LOB fit.
Phase 3 — ACCOUNT ORCHESTRATION: Design the operating model: who owns the account relationship? How are leads routed across brands? What is the handoff protocol? Comp model alignment (reps must be incentivized to cross-refer, not hoard).
Phase 4 — SELLER ENABLEMENT: Train LOB sellers on adjacent offerings (they do NOT need to sell them, just recognize the trigger and make the warm handoff). Build the playbook, talk tracks, and qualification criteria for cross-LOB referrals.
Phase 5 — QBR CADENCE: Quarterly business reviews at the ACCOUNT level (not LOB level), tracking multi-LOB penetration, cross-referral volume, and revenue per account over time. This is the governance layer that sustains the behavior change.

TECHNOLOGY REQUIREMENTS FOR COMMERCIAL INTEGRATION:
- CRM: a single CRM instance (or federated view) across all brands is the prerequisite. Salesforce is most common in mid-market holdcos. The CRM unification project typically takes 6-12 months and costs $250K-$1M+ depending on brand count and data complexity.
- Customer Data Platform (CDP) or Master Data Management (MDM): matching and deduplicating customer records across brands is the foundational data problem. Without accurate cross-brand customer matching, penetration baseline analysis is impossible.
- Revenue attribution and comp management: cross-LOB referral tracking and split-credit comp models require specialized tooling (Xactly, CaptivateIQ, Varicent) or custom Salesforce configuration.
- BI / analytics: cross-LOB dashboards tracking penetration, revenue-per-account, referral pipeline, and conversion. Typically Tableau, Power BI, or Looker layered on the unified CRM.
- Enablement platform: sales enablement tools (Highspot, Seismic, Showpad) for cross-LOB playbook delivery, training, and content management.

=== 7. ICP PATTERNS ===
- HIGHEST FIT: year 1-3 post-merger holdco, operational integration complete, commercial integration not yet started. Maximum gap, maximum urgency, maximum budget.
- HIGH FIT: multi-brand services holdco (3+ brands, overlapping customer base, relationship-driven sale). Services businesses have the highest cross-sell elasticity.
- MODERATE FIT: PE-backed platform with active tuck-in acquisition program and identified commercial integration gap. Each tuck-in adds a new brand to integrate — recurring need.
- MODERATE FIT: holdco with newly hired CRO or Chief Integration Officer (first 6 months). New commercial leader has a mandate to build.
- LOW FIT: pre-close or pre-merger. Too early — integration planning hasn't started.
- LOW FIT: year 4+ holdco with established cross-sell infrastructure. Already integrated — incremental optimization, not architecture.
- POOR FIT: single-brand PE portco. No cross-LOB dynamic. Route to smbMidmarketKnowledge.js.
- POOR FIT: holdco in active cost-cutting / restructuring mode. Growth investment is blocked.
- POOR FIT: sponsor exit imminent (year 5+ of hold, active sale process). No new initiatives.

=== 8. BUYING COMMITTEE ===
HOLDCO BUYING COMMITTEE ARCHETYPES (structural — who you will encounter):
- CEO / EXECUTIVE CHAIR: Owns the commercial integration mandate. Often a PE-installed operator or the founder who stayed post-acquisition. The visionary buyer — cares about top-line growth narrative and exit-readiness.
- CFO: Controls budget, measures EBITDA impact, gates every spend decision. The ROI buyer — needs hard numbers on revenue uplift vs. engagement cost, expressed as EBITDA bridge impact.
- LOB PRESIDENTS / DIVISION HEADS: Run individual brands. The political buyers — they may resist cross-LOB integration if it threatens their P&L autonomy, territory, or headcount. Alignment here is the #1 execution risk.
- PE OPERATING PARTNER: The sponsor's hands-on value-creation leader. May sit on the board or attend monthly operating reviews. The accelerant buyer — if they back the initiative, it moves fast; if they're skeptical, it stalls. Often has portfolio-wide perspective (has seen this work or fail at other portcos).
- CRO / VP SALES (if the role exists): Often a new hire brought in specifically to unify commercial operations. The champion buyer — most likely to own the engagement day-to-day, but may not yet have political capital.
- CHIEF INTEGRATION OFFICER (CIO — not IT): a role that exists in ~20% of PE holdcos, specifically responsible for post-merger integration across operational and commercial dimensions. When this role exists, it is the primary point of engagement.
- VP STRATEGY / CHIEF STRATEGY OFFICER: in larger holdcos, owns M&A pipeline and post-acquisition integration planning. Influential in determining whether commercial integration becomes a priority.
- BOARD OF DIRECTORS: the PE sponsor typically controls 2-3 board seats. Board-level visibility for commercial integration initiatives accelerates budget approval but also raises the stakes for measurable outcomes.

=== 9. TRIGGER EVENTS ===
- Preferred redemption or recapitalization event (new capital = new investment capacity)
- Brand relaunch or unified brand architecture announcement (signals commercial integration intent)
- CRO or Chief Integration Officer vacancy or recent hire (signals commercial mandate)
- PE operating partner actively engaged in commercial strategy (accelerant for decision-making)
- Cross-LOB customer advisory board or unified account review process initiated
- Recent tuck-in acquisition with overlapping customer base (integration need is fresh)
- Job postings for cross-functional sales, account management, or commercial operations roles
- Earnings call or investor update referencing "cross-sell," "commercial synergies," or "unified go-to-market"
- LOB Presidents reporting into a single CEO/ExChair with explicit integration KPIs
- QBR structure shifting from LOB-level to account-level or holdco-level reviews
- Annual operating plan cycle (typically Q3-Q4 for following year) — commercial integration budget decisions are made here
- PE sponsor conducting portfolio review / value creation assessment (creates urgency for commercial metrics)
- Management team change at CEO or COO level (new leader, new priorities, new mandate window)
- Holdco reaching 5+ brands (complexity threshold where ad hoc cross-sell breaks down)
- IPO preparation (S-1 drafting) requiring demonstration of "organic growth" and "repeatable revenue"

=== 10. FAILURE MODES ===
COMMON FAILURE MODES FOR HOLDCO ENGAGEMENTS (structural — pattern-matched from operator experience):
1. PITCHING TRANSFORMATION VS. ORCHESTRATION: Holdco leadership does NOT want to hear "everything is broken, let us fix it." They want to hear "you have valuable assets that aren't yet coordinated — we can orchestrate them." Transformation framing = distrust. Orchestration framing = partnership.
2. OVER-CONSULTING JARGON: Holdco buyers — especially PE-installed operators — are allergic to consulting-speak. They have been pitched by every Big 4 and boutique. Use operator language, show you understand the P&L, and lead with data (penetration baseline), not frameworks.
3. PITCHING TOO BIG TOO EARLY: A $2M proposal in the first meeting is dead on arrival. Start with a scoped diagnostic ($50-100K, 4-6 weeks) that reveals the penetration baseline and cross-sell math. Let the data sell the larger engagement.
4. IGNORING LOB POLITICS: The CEO may want commercial integration, but LOB Presidents may actively resist it. If you don't map the political landscape and build LOB-level buy-in, the engagement will be sabotaged from within.
5. CONFUSING OPERATIONAL AND COMMERCIAL INTEGRATION: Selling CRM unification or ERP consolidation as "commercial integration" is a credibility killer. Commercial integration is about BEHAVIOR (sellers cross-referring, accounts buying across brands), not SYSTEMS.
6. MISREADING THE HOLD-CYCLE POSITION: Proposing a 2-year buildout to a holdco in year 5 of a 6-year hold is tone-deaf. Match engagement scope and timeline to the remaining hold period.
7. UNDERESTIMATING THE OPERATING PARTNER: The PE sponsor's operating partner often has veto power on commercial initiatives. If you haven't engaged them by the second meeting, you have a hidden blocker.
8. PRESENTING WITHOUT BASELINE DATA: Walking into a holdco QBR without the cross-LOB penetration numbers, revenue-per-account math, or competitive overlap analysis means you're presenting opinions, not insights.
9. IGNORING COMP MODEL MISALIGNMENT: If LOB sellers are compensated purely on their own brand's P&L with no cross-referral incentive, no amount of training or playbook will drive behavior change. Comp model must be addressed before or during enablement.
10. ASSUMING BRAND CONSOLIDATION IS THE GOAL: Many holdcos want to KEEP individual brands (for market positioning, customer trust, or regulatory reasons) while unifying the commercial model behind the scenes. Do not assume or recommend brand consolidation without explicit direction.

=== 11. GTM IMPLICATIONS ===
VOCABULARY CALIBRATION FOR PE-BACKED HOLDCO TARGETS (structural — language is a credibility gate):
USE these terms:
- "Value creation thesis" (the PE sponsor's investment rationale and growth plan)
- "EBITDA bridge" (the walk from current EBITDA to target EBITDA at exit, broken into line items)
- "Exit-ready commercial narrative" (the story that revenue growth is repeatable, structured, and not dependent on heroics)
- "Platform" (the initial PE-backed acquisition), "tuck-in" or "bolt-on" (subsequent add-on acquisitions)
- "Operating cadence" (the rhythm of reviews, reporting, and governance)
- "Penetration baseline" / "cross-LOB penetration" (% of accounts buying from >1 brand)
- "Commercial integration" (distinct from operational integration — cross-sell, unified GTM)
- "Run-rate" (annualized current performance), "EBITDA margin" (the universal scoreboard)
- "Sponsor" (the PE firm), "operating partner" (sponsor's on-the-ground value-creation exec)
- "Orchestration" (coordinating existing assets), not "transformation" (implying everything is broken)
AVOID these terms:
- "Transformation" or "digital transformation" (implies the business is broken; PE-backed operators react negatively)
- "Disrupt" / "disruption" (VC/startup language, not PE language)
- "Innovative" or "cutting-edge" (PE values proven and repeatable, not novel)
- "Synergy" without specifics (overused in M&A, signals lazy thinking)
- SaaS/VC vocabulary: "product-market fit," "TAM/SAM/SOM," "Series X," "burn rate," "MRR" (these signal misunderstanding of the PE context)
- Generic consulting language: "best practices," "world-class," "holistic" (signals over-consulting, not operator credibility)

ENGAGEMENT SIZING PATTERNS (structural — proven scope architecture):
The standard holdco commercial integration engagement follows a four-phase model:
- PHASE 1 — DIAGNOSTIC (4-6 weeks, $50-100K): Penetration baseline, cross-LOB customer overlap analysis, ICP unification draft, buying committee mapping, quick-win identification. Deliverable: a data-backed "state of commercial integration" readout with specific cross-sell math.
- PHASE 2 — ARCHITECTURE (8-12 weeks, $100-200K): Unified account model design, cross-referral operating model, comp alignment recommendations, seller enablement framework, QBR design. Deliverable: the cross-LOB commercial playbook.
- PHASE 3 — ENABLEMENT (12-16 weeks, $150-250K): Seller training, playbook rollout, referral tracking infrastructure, pilot accounts, coaching cadence. Deliverable: sellers actively cross-referring with measurable pipeline.
- PHASE 4 — CADENCE (ongoing, $10-25K/month retainer): QBR facilitation, penetration tracking, pipeline reviews, seller coaching, quarterly optimization. Deliverable: sustained cross-LOB revenue growth quarter over quarter.
The ENTRY OFFER is a 26-week pilot covering Phases 1-3 ($250-500K total), scoped to a specific LOB pair or geographic market. This is small enough to get a decision in weeks, large enough to produce a meaningful outcome, and perfectly positioned as a "prove it before we scale it" commitment.

CHANNEL STRATEGY — reaching holdco buyers:
- PE operating partner network: the fastest path to a holdco CEO. Operating partners attend portfolio reviews, industry events, and PE industry conferences (PEI, ACG, ILPA). Building relationships with operating partners at target sponsors yields repeat deal flow across their entire portfolio.
- Management consulting referral: Big 4 and boutique consulting firms (McKinsey, Bain, BCG) advise PE sponsors on post-merger integration. They identify the commercial integration gap but often lack the operator capability to execute. Becoming a trusted execution partner to a consulting firm creates a reliable inbound channel.
- Industry events: ACG (Association for Corporate Growth) chapters host deal-maker events; PEI (Private Equity International) conferences; specific sector events where PE-backed operators congregate.
- PE firm-sponsored portfolio events: many sponsors host annual CEO summits or operating partner retreats where portfolio company leaders convene. These are invitation-only but high-density opportunities.

=== 12. CROSS-REFERENCES ===
- professionalServicesKnowledge.js: PE-backed professional services rollups (staffing, consulting, engineering) are a common holdco pattern. The professional services layer provides sub-vertical specifics on partnership economics, utilization, and realization.
- smbMidmarketKnowledge.js: single-brand PE portcos (not multi-brand holdcos) should use the PE-BACKED BUYING PATTERNS section in smbMidmarket, not this layer.
- b2bSalesKnowledge.js: the B2B sales value-creation framework applies to how holdco LOB sellers should be enabled for cross-LOB selling.
- investorIntelligenceKnowledge.js: for investor conversations with PE sponsors about portfolio company commercial performance.
- manufacturingKnowledge.js: industrial/manufacturing rollups are a common PE holdco archetype. The manufacturing layer provides sub-vertical specifics on OEM, CM, and supply chain dynamics.
- retailKnowledge.js: multi-brand retail holdcos (franchise groups, specialty retail rollups) should layer retail knowledge on top of the PE holdco framework.
- medicalPaymentsKnowledge.js: healthcare platform holdcos (physician practices, ambulatory surgical centers) should layer medical/healthcare knowledge alongside the PE holdco framework.
`;

// -- PE HOLDCO DISCOVERY QUESTIONS --
// RIVER-stage discovery questions for post-merger holdco targets.
// These are calibrated for the cross-LOB commercial integration use case,
// not generic PE discovery (see smbMidmarketKnowledge.js for that).

export const PE_HOLDCO_DISCOVERY = `
PE-BACKED HOLDCO DISCOVERY QUESTIONS (RIVER framework — use when the target is a multi-brand holdco with a commercial integration need):

REALITY — current state of cross-LOB commercial maturity:
- "How many of your customers today buy from more than one of your brands or lines of business?"
  (This is the penetration baseline question — the answer is almost always lower than leadership expects. If they don't know the number, that IS the finding.)
- "Where are you in the integration journey — have you completed operational integration (back-office, ERP, finance), and if so, have you started on commercial integration (cross-sell, unified account model)?"
  (Most holdcos have done 1 but not 2. The gap is the engagement.)
- "How are your LOB sellers incented today — on their own brand's P&L, or on total account revenue?"
  (Comp model reveals whether cross-sell is structurally encouraged or structurally blocked.)
- "When a seller in Brand A identifies an opportunity for Brand B, what happens next? Is there a process, or does it depend on personal relationships?"
  (Probes for the existence — or absence — of a cross-referral operating model.)
- "How would you characterize your commercial maturity relative to your operational maturity — are they in sync, or is commercial integration lagging?"
  (Lets them self-diagnose the gap without you asserting it.)

IMPACT — quantify the unrealized cross-sell opportunity:
- "If every account that buys one service also bought just one more, what does that revenue uplift look like on a run-rate basis?"
  (Cross-sell math. Even a rough estimate creates urgency.)
- "What's your average revenue per account today vs. what it could be if you sold the full portfolio into each account?"
  (Revenue-per-account uplift potential — typically 2-4x in year 1-3 holdcos.)
- "How much pipeline is being lost at LOB boundaries — deals that one brand qualifies but another brand could close?"
  (Quantifies the cost of organizational silos.)
- "What would a 10-point improvement in cross-LOB penetration mean for your EBITDA bridge and exit narrative?"
  (Ties to the PE scoreboard. Speaks the sponsor's language.)

VISION — the unified commercial model:
- "What does the ideal customer experience look like when someone engages across all your brands — is it one relationship or multiple?"
  (Surfaces whether they've envisioned a unified account model or are still thinking brand-by-brand.)
- "If you could build the cross-sell engine from scratch, what would it look like — centralized sales team, hub-and-spoke, federated with shared incentives?"
  (Surfaces their mental model for the operating architecture.)
- "How does commercial integration factor into your exit narrative — is 'repeatable cross-sell revenue' something you want to show a buyer or public market?"
  (Ties the vision to the exit thesis. This is the question that gets the CEO/ExChair leaning forward.)

ENTRY — who owns the commercial integration mandate:
- "Who in your organization owns commercial integration as a deliverable — is it the CEO, a CRO, a Chief Integration Officer, or is it distributed across LOB heads?"
  (Maps the power structure. If nobody owns it, that's the problem statement.)
- "Is your PE sponsor's operating partner involved in commercial strategy, or is that fully delegated to your management team?"
  (Surfaces the sponsor's engagement level. An engaged operating partner is an accelerant.)
- "Have you brought in external support for this before, and if so, what worked and what didn't?"
  (Surfaces past failures, incumbent vendors, and political scar tissue.)

ROUTE — the micro-commitment close:
- "Would it be valuable to start with a 4-6 week diagnostic that gives you the actual cross-LOB penetration numbers, maps the customer overlap, and quantifies the cross-sell math — so you have the data to decide whether a larger initiative is worth pursuing?"
  (The baseline diagnostic offer. Low risk, high information value, fast decision.)
- "If the diagnostic reveals a meaningful cross-sell gap, would you want to move into a scoped 26-week pilot focused on one LOB pair to prove the model before scaling?"
  (Seeds the full engagement without asking for a large commitment upfront.)
- "Who else would need to see the diagnostic results before a decision on next steps — your CFO, operating partner, LOB Presidents?"
  (Maps the decision committee for the expansion sale.)
`;

// -- PE HOLDCO SCORING CONTEXT --
// Calibrates ICP fit scoring when target is a PE-backed holdco with
// post-merger commercial integration dynamics.

export const PE_HOLDCO_SCORING = {
  highFitSegments: [
    {
      segment: "Year 1-3 post-merger holdco, operational integration complete, commercial integration not yet started",
      avgFit: "75-85%",
      reason: "Maximum commercial integration gap. Operational foundation is in place, cross-sell infrastructure is not. Budget exists, urgency is high (PE exit clock ticking), and the CEO/ExChair is actively looking for help."
    },
    {
      segment: "Multi-brand services holdco (3+ brands, overlapping customer base, relationship-driven sale)",
      avgFit: "70-80%",
      reason: "Services businesses have the highest cross-sell elasticity — same customer can buy multiple services. Relationship-driven sale means account orchestration has outsized impact."
    },
    {
      segment: "PE-backed platform with active tuck-in acquisition program and identified commercial integration gap",
      avgFit: "65-75%",
      reason: "Each tuck-in adds a new brand to integrate. The commercial integration challenge compounds with each acquisition, creating recurring need."
    },
    {
      segment: "Holdco with newly hired CRO or Chief Integration Officer (first 6 months)",
      avgFit: "70-80%",
      reason: "New commercial leader has a mandate to build, needs external capability to accelerate, and has a window to make their mark."
    },
  ],
  highFrictionSegments: [
    {
      segment: "Pre-close or pre-merger (deal not yet finalized)",
      avgFit: "15-25%",
      reason: "Too early. Integration planning hasn't started, management team may not be in place, and the sponsor is focused on closing, not post-merge commercial design."
    },
    {
      segment: "Year 4+ holdco with established cross-sell infrastructure",
      avgFit: "20-30%",
      reason: "Already integrated. The commercial architecture is built, sellers are trained, QBRs are running. Incremental value is optimization, not architecture — smaller engagement, less urgency."
    },
    {
      segment: "Single-brand PE portco (no cross-LOB dynamic)",
      avgFit: "10-20%",
      reason: "No cross-sell architecture to build. This is a standard PE-backed company, not a holdco commercial integration engagement. Route to smbMidmarket PE patterns instead."
    },
    {
      segment: "Holdco in active cost-cutting / restructuring mode",
      avgFit: "20-30%",
      reason: "Budget is being reduced, not allocated. Commercial investment requires growth mindset. Cost-cutting mode means the CFO will block any net-new spend."
    },
    {
      segment: "Sponsor exit imminent (year 5+ of hold, active sale process)",
      avgFit: "15-25%",
      reason: "The sponsor wants to harvest value, not invest in new capability. Any proposal that doesn't produce results before close is irrelevant."
    },
  ],
  keySignals: {
    positive: [
      "Preferred redemption or recapitalization event (new capital = new investment capacity)",
      "Brand relaunch or unified brand architecture announcement (signals commercial integration intent)",
      "CRO or Chief Integration Officer vacancy or recent hire (signals commercial mandate)",
      "PE operating partner actively engaged in commercial strategy (accelerant for decision-making)",
      "Cross-LOB customer advisory board or unified account review process initiated",
      "Recent tuck-in acquisition with overlapping customer base (integration need is fresh)",
      "Job postings for cross-functional sales, account management, or commercial operations roles",
      "Earnings call or investor update referencing 'cross-sell', 'commercial synergies', or 'unified go-to-market'",
      "LOB Presidents reporting into a single CEO/ExChair with explicit integration KPIs",
      "QBR structure shifting from LOB-level to account-level or holdco-level reviews",
    ],
    negative: [
      "Transformation fatigue (holdco has been through multiple consulting engagements with poor results — skepticism is high)",
      "Active cost-cutting program or EBITDA margin pressure driving expense reduction (not growth investment)",
      "Sponsor exit process underway (banker hired, management presentations in progress)",
      "LOB Presidents with full P&L autonomy and no cross-sell incentives (political resistance will be high)",
      "No unified CRM or customer data across brands (operational integration prerequisite is missing)",
      "CEO/ExChair departure or transition (power vacuum — no one to own the mandate)",
      "Regulatory or legal overhang consuming management attention (M&A litigation, antitrust review)",
      "Single-brand dominance (one LOB is 80%+ of revenue — cross-sell is marginal, not transformative)",
    ],
  },
};
