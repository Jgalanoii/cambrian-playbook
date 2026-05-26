// src/data/qsrKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// QSR / Quick-Service Restaurant deep knowledge layer.
// Covers: fast food, fast casual, franchise dynamics, restaurant
// tech stack, loyalty/payments, delivery economics, PE/public/family
// ownership patterns, unit-level economics, labor, ghost kitchens,
// menu engineering, and drive-through technology.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_QSR (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Restaurant Business / Nation's Restaurant News (Jonathan Maze reporting):
//     restaurantbusinessonline.com / nrn.com
//   Franchise Times / Emergent Growth Advisors (PE-franchise analysis)
//   Restaurant Dive (industry coverage)
//   Bank of America QSR commercial banking research
//   Franchise Equity Partners / RFDC 2025 investor thresholds
//   Roark Capital Group public disclosures
//   Blackstone portfolio announcements (Jersey Mike's acquisition)
//   Toast ISV ecosystem documentation
//   DoorDash / Uber Eats marketplace data
//   MarginEdge-Qu integration announcement (Nov 2025)
//   FDA menu labeling rules (21 CFR 101.11)
//   FTC Franchise Rule (16 CFR 436)
//   California AB 1228 (fast-food wage law)
//   NRA (National Restaurant Association) State of the Industry (2026)
//   Technomic Top 500 Chain Restaurant Report (2026)
//
// -- KNOWN TRAPS --
//   1. "Systemwide revenue" and "company-operated revenue" are fundamentally
//      different — Yum! reports ~$7B company revenue vs $60B systemwide.
//      Always clarify which.
//   2. PE portfolio brand ownership changes frequently (acquisitions,
//      divestitures, IPOs) — verify current ownership before citing.
//   3. Franchise vs corporate economics differ by 2-3x on margins — never
//      generalize "restaurant margins" without specifying ownership model.
//   4. POS market share figures shift rapidly (Toast growth, Square rebranding
//      to Block) — verify current share before quoting.
//   5. The "QSR = recession-proof" assumption broke in 2025 (casual dining
//      traffic recovering while QSR declined) — do not cite the old pattern.
//   6. Named executives (CEOs, PE partners) rotate frequently — always verify
//      current roles via web search before referencing in briefs.
//   7. Franchise disclosure document (FDD) data is annual (Item 19) and may
//      lag current performance by 12-18 months.

// -- QSR INJECTION --
// Injected when the seller or target operates in restaurants, food service,
// QSR, fast casual, or hospitality.

export const QSR_INJECTION = `
QSR / RESTAURANT INDUSTRY CONTEXT (use when target or seller is in restaurants, food service, QSR, or hospitality):

SECTION 1 — SNAPSHOT & MARKET SIZING:
QSR industry revenue ~$532B for 2025 [verified 05/2026, NRN / Restaurant Business]. Total U.S. restaurant industry ~$1.1T including full-service [verified 05/2026, NRA State of the Industry 2026]. ~200,000+ limited-service units in U.S. [verified 05/2026, NRN Top 500]. Total restaurant units (all segments) ~1M. Leaders by systemwide sales: Yum! Brands (~$60B systemwide), Restaurant Brands International (~$45B), Inspire Brands (~$32.6B), McDonald's (~$130B+ systemwide globally) [verified 05/2026, NRN Top 500 / company 10-K filings]. Industry employs ~15.5M workers, making it the second-largest private-sector employer after healthcare [verified 05/2026, NRA / BLS]. 80%+ of operators expect 2025 sales to match or exceed 2024 [verified 05/2026, Restaurant Business].

Fast casual is the fastest-growing sub-segment (~8-10% annual growth), with concepts like Chipotle (~$11B revenue, 3,600+ units), Sweetgreen (~700 units), Shake Shack (~500 units globally), CAVA (~350 units), and Wingstop (~2,400 units, 35%+ digital mix) leading expansion [verified 05/2026, company filings / NRN Top 500].

SECTION 2 — WHAT MAKES THIS DISTINCT:
QSR is distinct from other B2B verticals because of the franchise model, unit-level economics, extreme labor intensity, and the dual buying center (brand HQ + franchisee). Key dynamics:
- FRANCHISE vs CORPORATE creates two parallel buying centers with different economics, decision authority, and technology mandates. You cannot sell the same way to McDonald's corporate as to a 200-unit franchisee group.
- UNIT-LEVEL ECONOMICS dominate: every technology, process, and strategy decision is evaluated at the individual store level. If it does not pencil per-unit, it does not get deployed. AUV (average unit volume), four-wall EBITDA, labor cost as % of revenue, and food cost % are the universal language.
- LABOR IS THE EXISTENTIAL ISSUE: restaurants are the most labor-intensive industry in the economy. Every technology that reduces labor dependency, improves scheduling, or augments worker productivity has immediate ROI framing.
- SPEED MATTERS LITERALLY: QSR drive-through times, ticket times, order accuracy, and throughput per labor hour are measured in seconds. Technology must deliver measurable speed improvements or it dies in pilot.
- PE CONSOLIDATION is reshaping the industry faster than any other force. PE firms are rolling up franchise concepts, professionalizing operations, and demanding technology modernization on compressed timelines.

SECTION 3 — SUB-CATEGORIZATION:
QSR (Quick-Service Restaurant): traditional fast food — limited menu, counter/drive-through service, low check average ($8-12). McDonald's, Burger King, Taco Bell, Wendy's, Chick-fil-A, Popeyes. Highest unit counts, most labor-efficient, drive-through-dependent.

FAST CASUAL: higher food quality/price than QSR, no table service, customizable orders, check average $12-18. Chipotle, Panera, Sweetgreen, CAVA, Shake Shack, Wingstop. Fastest-growing segment. Higher margins than QSR but more complex operations (fresh prep vs pre-made).

CASUAL DINING (adjacent): full table service, check average $15-30. Applebee's, Chili's, Olive Garden, Outback, Cheesecake Factory. THE 2025 INVERSION: casual dining traffic is recovering while QSR foot traffic is declining — reverses the 2023-2024 "trade-down to QSR" pattern [verified 05/2026, Bank of America commercial banking research]. This breaks the conventional "recession = QSR tailwind" assumption.

COFFEE/BEVERAGE: Starbucks (~$36B revenue, ~38,000 units), Dunkin' (Inspire Brands), Dutch Bros (~900 units), 7Brew (fast-growing). High margins, loyalty-driven, mobile-order-dominant. Starbucks' stored-value card program is the gold standard for consumer fintech.

GHOST KITCHENS / VIRTUAL BRANDS: delivery-only operations from shared kitchen spaces. Peaked in 2021-2022; significant contraction since. Kitchen United, CloudKitchens (Travis Kalanick), REEF Technology. Many closing or pivoting. The model works for incremental delivery volume from existing restaurants but failed as a standalone concept for most operators [verified 05/2026, Restaurant Business / Restaurant Dive].

SECTION 4 — MAJOR COMPANIES (20 named):
PUBLICLY TRADED QSR / FAST CASUAL:
- McDonald's: ~$25B company revenue, ~$130B systemwide. ~40,000 units globally. 95% franchised. Gold standard for operational efficiency. Loyalty program (MyMcDonald's Rewards) ~150M+ members globally [verified 05/2026, McDonald's 10-K / investor presentations].
- Starbucks: ~$36B revenue. ~38,000 units globally. ~60% company-operated (unusual for this scale). Mobile Order & Pay + stored-value card = industry-defining digital ecosystem. ~$1.8B in unredeemed stored-value card liability (breakage) [verified 05/2026, Starbucks 10-K].
- Chipotle: ~$11B revenue, 3,600+ units. 100% company-operated. Digital sales ~35-40% of revenue. Chipotlane (digital-order drive-through) is the fastest-growing format [verified 05/2026, Chipotle 10-K].
- Yum! Brands: KFC, Taco Bell, Pizza Hut, Habit Burger. ~$7B company revenue, ~$60B systemwide. 98% franchised. 55,000+ units globally. Considering Pizza Hut sale [verified 05/2026, Restaurant Business / Yum! investor materials].
- Restaurant Brands International (RBI): Burger King, Popeyes, Tim Hortons, Firehouse Subs. ~$45B systemwide. 3G Capital influence. Burger King's "Reclaim the Flame" turnaround plan ongoing [verified 05/2026, RBI 10-K].
- Wendy's: ~$12B systemwide. Closing hundreds of underperforming units while investing in digital and drive-through [verified 05/2026, Wendy's 10-K / Restaurant Business].
- Wingstop: ~2,400 units, ~95% franchised. Industry-leading same-store sales growth. Digital mix 35%+ [verified 05/2026, Wingstop 10-K].
- Shake Shack: ~500 units globally. Premium fast casual. 50/50 company/licensed split. Average check ~$15-18 [verified 05/2026, Shake Shack 10-K].
- Sweetgreen: ~700 units. 100% company-operated. "Infinite Kitchen" (automated salad assembly line) is the most visible restaurant automation deployment [verified 05/2026, Sweetgreen 10-K / earnings calls].
- Panda Express: ~2,500+ units. Privately held (Cherng family). Notable for being one of the largest privately held QSR operators — family-office decision dynamics [verified 05/2026, NRN Top 500].
- Chick-fil-A: ~3,000+ units. Privately held. Closed Sundays. Highest AUV in QSR (~$9M+ per unit vs McDonald's ~$4M). Unique franchise model (operator model, not traditional franchise) [verified 05/2026, QSR Magazine / NRN].
- Panera: ~2,100 units. JAB Holding ownership. Sip Club subscription pioneer. Loyalty program ~50M+ members [verified 05/2026, Panera / Restaurant Business].

PE-BACKED / HOLDING COMPANIES:
- Roark Capital Group: ~$37B AUM, 23 restaurant chains over 25 years. Controls 112,000+ locations across 121 countries, $97B systemwide revenue [verified 05/2026, Roark Capital public disclosures]. Subsidiary Inspire Brands (Arby's, Buffalo Wild Wings, Sonic, Jimmy John's, Dunkin', Baskin-Robbins) + GoTo Foods (Auntie Anne's, Carvel, Cinnabon, Jamba Juice, McAlister's, Moe's, Schlotzsky's). Also holds Cheesecake Factory, Hardee's, Carl's Jr., Culver's (minority), Dave's Hot Chicken (June 2025, $1B at 315 units). Roark considering Inspire Brands IPO targeting ~$2B (March 2026 reporting). [verified 05/2026, Roark Capital / Restaurant Business]
- Blackstone: entered QSR with Jersey Mike's $8B acquisition (Jan 2025, 90% stake) — highest-profile new-entrant move in franchise [verified 05/2026, Blackstone portfolio announcements]. Achieved 12% supply chain cost reduction within first year. Installed new executive leadership post-acquisition.
- Other active PE: Bain Capital (Sizzling Platter), 3G Capital (RBI/Burger King), Apollo (Qdoba), JAB Holding (Pret, Panera adjacency), High Bluff Capital (Quiznos parent).

MAJOR MULTI-UNIT FRANCHISEES (the "mega-franchisee" segment):
- Flynn Group: largest US franchisee, ~2,600+ units across multiple brands. Independent procurement, multi-brand operations.
- Sun Holdings: ~1,500+ units. Notable for franchisee-acquires-franchisor pattern — a structural shift in the industry [verified 05/2026, Restaurant Business / Franchise Times].

SECTION 5 — REGULATORY OVERLAY:
FDA MENU LABELING (21 CFR 101.11): chains with 20+ locations must post calorie counts on menus, menu boards, and drive-through displays. Sodium, sugar, saturated fat warnings expanding in some jurisdictions (NYC requires sodium warnings) [verified 05/2026, FDA / NYC Health Code]. Compliance requires menu engineering software integration.

FTC FRANCHISE RULE (16 CFR 436): requires franchisors to provide a Franchise Disclosure Document (FDD) at least 14 days before sale. Item 19 (financial performance representations) is the most scrutinized section — provides unit-level economics data. FDD data is annual and may lag current performance by 12-18 months. [verified 05/2026, FTC]

STATE LABOR LAWS: California AB 1228 established $20/hr fast-food minimum wage effective April 2024 [verified 05/2026, CA AB 1228]. Other states following with industry-specific wage floors. Fair Workweek / Predictive Scheduling laws in Oregon, New York City, Chicago, Philadelphia, Seattle — require 14-day advance schedule posting, premium pay for schedule changes [verified 05/2026, National Law Review / state labor departments]. These laws directly drive demand for AI-powered scheduling software.

FOOD SAFETY (FDA / FSMA): HACCP (Hazard Analysis Critical Control Points) plans required. FDA Food Code governs temperature control, sanitation, allergen management. State health department inspections are the operational reality — scores publicly posted (A/B/C grading in many jurisdictions). Third-party food safety audits (Steritech, EcoSure) are standard for multi-unit operators.

FRANCHISE RELATIONSHIP LAWS: ~20 states have franchise relationship statutes governing termination, non-renewal, encroachment, and transfer. Creates legal complexity for both franchisors and technology vendors selling through franchise systems. [verified 05/2026, International Franchise Association]

ADA COMPLIANCE: drive-through and ordering interfaces must comply with ADA accessibility requirements. Digital ordering kiosks and mobile apps are emerging areas of ADA litigation [verified 05/2026, NRA / legal reporting].

SECTION 6 — TECHNOLOGY STACK:
POS (Point of Sale): Toast ~24% share in independent/SMB, Square (Block) ~28% share in micro/small, Oracle MICROS for enterprise full-service, PAR Brink for enterprise QSR, NCR Aloha for legacy enterprise. POS is the gravitational center of the restaurant tech stack — every other system must integrate. POS replacement is an 18-24 month cycle with massive switching costs. [verified 05/2026, Restaurant Business / NRN / company disclosures]

LOYALTY & DIGITAL ORDERING: Punchh (PAR) for enterprise loyalty (Yum!, Smoothie King), Paytronix for large multi-unit (Panera, Five Guys, BJ's), proprietary for mega-brands (Starbucks, McDonald's, Chick-fil-A). Olo powers ~50% of public restaurant company digital ordering [verified 05/2026, Olo investor filings]. Loyalty traffic grew 5% YoY while overall traffic fell 2%. Loyalty member count doubled since 2019 (~39% of visits) but per-member frequency declining — indicating loyalty fatigue [verified 05/2026, Restaurant Business / Paytronix reports].

ORDER MANAGEMENT: Olo (Rails, Dispatch, Pay). Connects brand ordering to third-party delivery and in-house fulfillment. The middleware layer between the brand and the delivery marketplace.

DELIVERY PLATFORMS: DoorDash ~67% US market share, Uber Eats ~23%, Grubhub (Wonder Group acquired) ~8% [verified 05/2026, Bloomberg Second Measure]. Third-party effective commission 30-40% (headline 15-30% + promos + processing + refunds). First-party ordering via brand apps/websites is the dominant GTM strategy — brands escaping commission tiers.

BACK-OF-HOUSE: Crunchtime (formerly Zenput) for enterprise operations management, Restaurant365 for mid-market accounting + operations, MarketMan for inventory, MarginEdge for real-time food cost tracking (MarginEdge-Qu integration launched Nov 2025 for real-time profitability) [verified 05/2026, MarginEdge / Restaurant Business]. xtraCHEF (Toast) for invoice automation.

SCHEDULING & LABOR: 7shifts, HotSchedules (now Fourth), Homebase, When I Work. AI-powered demand-based scheduling is the frontier — predicting staffing needs from weather, events, historical sales, and loyalty redemption patterns. Labor scheduling is the #1 technology pain point for multi-unit operators.

PAYMENT ORCHESTRATION: FreedomPay (enterprise-dominant), Adyen, Stripe, Square. Contactless payment adoption accelerated post-COVID and is now baseline expectation.

DRIVE-THROUGH TECHNOLOGY: AI voice ordering — Taco Bell as public reference; Toast Drive-Thru launched April 2026 as broader-market enterprise solution [verified 05/2026, Toast / Restaurant Business]. Dynamic menu boards (digital displays adjusting menu based on time, weather, inventory). Timer systems (HME, Xenial) measuring speed-of-service. Order confirmation boards.

KIOSKS: self-service ordering kiosks reducing labor costs by up to 15% in QSRs [verified 05/2026, NRN / Restaurant Dive]. McDonald's global kiosk rollout is the benchmark deployment. Kiosks increase average check 10-20% through upsell prompts.

SECTION 7 — ICP PATTERNS:
PE-BACKED FRANCHISE CONCEPTS (50-1,000 units):
- Profile: recently acquired by PE, in value-creation mode. 100-day plan includes technology modernization, supply chain optimization, loyalty launch or overhaul, and unit-level margin improvement.
- Buying behavior: fast-moving, EBITDA-focused, willing to spend for measurable margin impact within 12 months. PE operating partners are the real decision-makers.
- Seller implication: frame everything as EBITDA margin points. Demonstrate 12-month payback. Reference PE portfolio peers.

MULTI-UNIT FRANCHISEES (20-200+ units):
- Profile: sophisticated operators running multiple brands or large single-brand portfolios. Independent procurement decisions for back-office, scheduling, and non-mandated technology.
- Buying behavior: margin-sensitive, hands-on evaluation, want to see pilot results from comparable operators. Reference-driven.
- Seller implication: pilot in 5-10 units, prove per-unit economics, then roll out. Speak franchisee economics (after-royalty margin, not brand-level numbers).

BRAND HQ / FRANCHISOR TECHNOLOGY TEAMS:
- Profile: corporate technology, innovation, and operations teams that set system-wide mandates and preferred vendor lists.
- Buying behavior: 9-18 month sales cycles, mandatory pilots (5-25 stores, 60-180 days), rigorous integration requirements (POS certification is hard gate), multi-stakeholder approval.
- Seller implication: must certify with Brink/Aloha/MICROS/Toast ISV. Plan for 12-18 month cycles. Budget for pilot support and integration engineering.

SECTION 8 — BUYING COMMITTEE:
FRANCHISOR (BRAND HQ) BUYING COMMITTEE:
- CTO / VP Technology (technical buyer): owns tech stack, integration architecture, vendor management. Gate: POS integration certification.
- CMO / VP Marketing (loyalty/digital buyer): owns loyalty program, digital ordering, customer acquisition. Evaluated on digital mix %, loyalty member growth, same-store sales.
- VP Operations (operations buyer): owns franchisee compliance, operational standards, new-unit technology package. Evaluated on franchisee satisfaction, operational consistency.
- CFO (economic buyer for enterprise deals): approves system-wide mandates. Evaluates vendor impact on franchise system economics (royalty revenue, advertising fund, franchise sales).
- SVP Franchise Development (franchise sales buyer): technology package is a selling point for new franchisee recruitment. Modern tech stack improves FDD Item 19 numbers.

FRANCHISEE BUYING COMMITTEE:
- Owner/Operator (economic buyer + decision-maker): makes the call. Evaluates ROI per-unit. Personal relationship matters.
- General Manager (operational user): daily user. If the GM hates it, adoption fails.
- District/Area Manager (multi-unit): oversees 5-15 units. Scalability and consistency across units is the priority.
- Accountant/CFO (if large franchisee group): financial analysis, tax implications, depreciation.

SECTION 9 — TRIGGER EVENTS:
- PE ACQUISITION: new PE owner = 100-day plan = technology overhaul. The single strongest buying trigger in QSR. Every PE deal creates 6-12 months of active technology evaluation.
- FRANCHISE SALES PUSH: franchisor launching aggressive unit growth needs modern tech package to attract franchisees. Drives system-wide vendor selection.
- LOYALTY PROGRAM LAUNCH/OVERHAUL: massive investment cycle — POS integration, app development, CRM, data analytics, personalization. 12-18 month program with $5-50M+ budget depending on system size.
- DELIVERY COMMISSION PRESSURE: third-party delivery costs eroding margins → drives investment in first-party ordering, direct delivery, and order management platforms.
- LABOR LAW CHANGE: new minimum wage (CA $20/hr), predictive scheduling laws → drives scheduling software adoption, kiosk deployment, automation investment.
- SAME-STORE SALES DECLINE: declining traffic triggers forensic analysis of loyalty, menu, pricing, digital mix, and operational efficiency. Creates urgency for technology solutions.
- MENU ENGINEERING INITIATIVE: price optimization, daypart analysis, limited-time offer (LTO) strategy → drives demand for analytics, dynamic pricing, and digital menu board technology.
- DRIVE-THROUGH MODERNIZATION: timer system upgrade, dual lane, AI voice ordering, order confirmation screens. A capital-intensive trigger that signals technology-forward operator.
- BRAND TURNAROUND: declining brand (Burger King "Reclaim the Flame," Wendy's unit closures) triggers system-wide technology and operational overhaul.
- NEW CEO / CDO / CTO AT BRAND HQ: executive change at franchisor level triggers vendor review. First 90-180 days is the evaluation window.

SECTION 10 — COMMON FAILURE MODES:
VENDOR FAILURE MODES IN QSR:
- POS INTEGRATION FAILURE: selling a solution that does not certify with the brand's POS. This is a non-recoverable disqualifier. Always confirm POS integration before engaging.
- IGNORING THE FRANCHISE STRUCTURE: pitching to brand HQ without a franchisee adoption plan, or pitching to franchisees without franchisor alignment. Both paths fail. The winning motion engages both simultaneously.
- CONSUMER ECONOMICS ASSUMPTIONS: applying B2B SaaS pricing to QSR. Restaurant operators expect per-unit pricing ($50-500/unit/month), not per-user. Pricing must pencil at the four-wall level.
- PILOT TO NOWHERE: successful 10-unit pilot that never scales because the vendor did not build the system-wide rollout plan (franchisee communication, training infrastructure, help desk, regional deployment teams).
- OVERESTIMATING DIGITAL MATURITY: many franchise systems still run on fax/phone ordering, paper-based scheduling, and manual inventory counts. Do not assume digital readiness.
- IGNORING THE LABOR REALITY: restaurant operators have 100-200% annual turnover at hourly level. Any solution requiring more than 30 minutes of training per user will fail deployment.

INDUSTRY FAILURE MODES:
- GHOST KITCHEN OVEREXPANSION: peaked 2021-2022, massive correction since. Delivery-only models without brand equity struggle. Virtual brands created cannibalization without incremental demand in many cases.
- LOYALTY FATIGUE: loyalty member counts doubled but per-member frequency declining. Programs that offer only points-for-discounts are commoditized. The next wave is experiential + personalized offers.
- THIRD-PARTY DELIVERY DEPENDENCY: restaurants that built their business on DoorDash/Uber Eats face 30-40% commission erosion. Transition to first-party is existential for profitability but technically complex.

SECTION 11 — GTM IMPLICATIONS:
SELLING INTO QSR:
- Enterprise sales cycles 9-18 months with mandatory pilots (5-25 stores, 60-180 days). Plan for this timeline — there are no shortcuts.
- POS integration is a HARD GATE. Every vendor must certify with Brink/Aloha/MICROS/Toast ISV ecosystem. Start the certification process before you start selling.
- Capital structure determines buying behavior: PE = EBITDA optimization (fastest, most metrics-driven), public = same-store sales (quarterly earnings pressure), family office = multi-decade value (relationship-driven, slower, more loyal).
- Speak unit-level economics: AUV, four-wall EBITDA, labor cost %, food cost %, royalty rate, advertising fund contribution. If you cannot translate your value into per-unit margin impact, you will lose to vendors who can.
- PE investor thresholds: AUVs of $1.5-$2M for fast casual/QSR, $3M for full service. Growing concepts: 25%+ margins, <2-year unit-level payback [verified 05/2026, Franchise Equity Partners, RFDC 2025].
- PE picking off franchise concepts earlier than historical 3,000+ unit threshold. Dave's Hot Chicken at 315 units / $1B is the new-cycle template [verified 05/2026, Roark Capital / Restaurant Business].
- AI-driven loyalty + digital ordering boosted Dunkin's EBITDA margins ~8% within five years [verified 05/2026, Restaurant Business / Inspire Brands].
- 70% of PE firms mandate AI adoption with 12-month margin-impact requirements [verified 05/2026, Bain PE Operating Partners Survey 2025].
- Franchisee-acquires-franchisor pattern (Sun Holdings, Yadav Enterprises) is a structural shift creating new decision dynamics.

DELIVERY ECONOMICS: Third-party effective commission 30-40%. Direct/first-party ordering via apps/websites is dominant GTM strategy — brands escape commission tiers. Starbucks stored-value loop (preloaded card breakage) is the gold standard. [verified 05/2026, Restaurant Dive / DoorDash merchant terms]

SECTION 12 — CROSS-REFERENCES:
- PE/Holdco Knowledge Layer: PE consolidation is the dominant force reshaping QSR. Roark, Blackstone, Apollo, Bain, 3G, JAB — every major PE firm has restaurant exposure. PE operating partner dynamics, 100-day plans, and EBITDA-driven technology mandates are covered in the PE layer.
- Payments Knowledge Layer: restaurant payments (card-present, mobile pay, stored-value, contactless) are a critical intersection. Starbucks stored-value economics, payment orchestration (FreedomPay, Adyen), and interchange optimization are payment-layer topics applied to QSR.
- Rewards/Incentives Knowledge Layer: QSR loyalty programs are one of the largest applications of digital rewards and incentives. Points-based loyalty, subscription models (Panera Sip Club, Taco Bell Taco Lover's Pass), and gamification overlap with the rewards/incentives layer.
- Retail Knowledge Layer: QSR and retail share labor scheduling challenges, POS infrastructure, loyalty program mechanics, and multi-location operations management. The technology vendors (Toast, Square, Lightspeed) increasingly sell across both verticals.
- SMB/Midmarket Knowledge Layer: multi-unit franchisees (5-200 units) are mid-market buyers with mid-market budgets, decision processes, and technology maturity. The SMB layer's economic buyer dynamics apply directly.
- B2B Sales Knowledge Layer: enterprise QSR sales cycles (9-18 months, mandatory pilots, multi-stakeholder approval) follow enterprise B2B sales methodology. Pipeline management, champion-building, and technical validation apply.
- Manufacturing Knowledge Layer: restaurant operations share principles with manufacturing — throughput, yield, labor scheduling, quality control, supply chain management. "Restaurant as manufacturing plant" is a valid framing for operations-focused vendors.
- OKR/KPI Knowledge Layer: QSR KPIs (AUV, four-wall EBITDA, labor %, food cost %, ticket time, drive-through speed) are highly specific. Connecting your product to these KPIs is essential for selling into the vertical.

VOICES TO TRACK: Restaurant Business / NRN M&A coverage (most-cited QSR franchise reporting, "A Deeper Dive" podcast), Emergent Growth Advisors / Franchise Times PE-franchise analysis, Northmarq restaurant real estate research, Restaurant Dive industry coverage, Bank of America commercial banking QSR research, Technomic (NPD Group / Circana). Verify current bylines before citing — journalist beats rotate.

2026 TRENDS: AI drive-thru voice (Taco Bell reference, Toast Drive-Thru April 2026). AI-driven inventory and labor scheduling (MarginEdge-Qu integration Nov 2025 for real-time profitability). AI-driven inventory and self-service kiosks reducing labor costs by up to 15% [verified 05/2026, NRN / Restaurant Dive]. Subscription models expanding (Panera Sip Club, Taco Bell Taco Lover's Pass). Agentic commerce standards from Visa/Mastercard. Roark's operating-partner model: 20% increase in franchisee satisfaction, 10% rise in same-store sales [verified 05/2026, Roark Capital / Restaurant Business]. Menu simplification trend (shrinking menus to improve throughput and food cost). Dynamic pricing (surge/off-peak pricing tested by Wendy's, controversial). Sustainability mandates (packaging, food waste reduction, ESG reporting for public companies).

KNOWN TRAPS:
- "Systemwide revenue" and "company-operated revenue" are fundamentally different — Yum! reports ~$7B company revenue vs $60B systemwide. Always clarify which. [verified 05/2026, Yum! Brands 10-K]
- PE portfolio brand ownership changes frequently (acquisitions, divestitures, IPOs) — verify current ownership before citing.
- Franchise vs corporate economics differ by 2-3x on margins — never generalize "restaurant margins" without specifying ownership model.
- POS market share figures shift rapidly (Toast IPO growth, Square rebranding to Block) — verify current share before quoting.
- The "QSR = recession-proof" assumption broke in 2025 (casual dining traffic recovering while QSR declined) — do not cite the old pattern as current.
- Named executives (CEOs, PE partners) in this sector rotate frequently — always verify current roles via web search before referencing in briefs.
- Ghost kitchen / virtual brand hype has significantly deflated — do not cite 2021-2022 projections as current market reality.
- FDD Item 19 data is annual and lags — do not cite as "current" without noting the reporting period.
`;

export const QSR_SCORING = {
  highFitSegments: [
    { segment: "Loyalty/payments fusion platforms for QSR", avgFit: "75-85%", reason: "Every brand aspires to Starbucks stored-value loops; white space significant" },
    { segment: "First-party order acquisition tech", avgFit: "70-80%", reason: "Brands desperate to escape 30-40% third-party commissions" },
    { segment: "Back-of-house AI/automation (inventory, scheduling, waste)", avgFit: "70-80%", reason: "Direct EBITDA impact within 12 months; PE mandate alignment" },
    { segment: "AI-driven demand forecasting (mid-market 50-500 units)", avgFit: "65-75%", reason: "Crunchtime dominates enterprise; mid-market underserved" },
    { segment: "PE-backed franchise concepts in active value creation (50-1,000 units)", avgFit: "70-85%", reason: "100-day plan mandates technology modernization; budget allocated; timeline compressed" },
    { segment: "Multi-unit franchisee operations platforms (20-200 units)", avgFit: "60-70%", reason: "Sophisticated operators with independent procurement; margin-sensitive but willing to invest for per-unit ROI" },
  ],
  highFrictionSegments: [
    { segment: "Voice/AI drive-thru ordering", avgFit: "30-45%", reason: "High error tolerance bar in production; customer-facing AI failures create brand risk; technology maturity varies" },
    { segment: "POS replacement (displacing Toast/MICROS/Aloha)", avgFit: "25-40%", reason: "18-24 month cycles, incumbent integration depth, franchisee resistance" },
    { segment: "Hyper-personalization at scale", avgFit: "35-50%", reason: "Requires first-party data stack maturity most brands lack; multiyear ROI" },
    { segment: "Ghost kitchen / virtual brand platforms", avgFit: "15-30%", reason: "Market in contraction; many operators retreating; unit economics unproven at scale" },
  ],
  keySignals: {
    positive: [
      "PE acquisition within last 12 months (100-day plan active)",
      "Loyalty program launch or overhaul underway",
      "Same-store sales decline triggering operational review",
      "New CTO/CDO/VP Technology at brand HQ",
      "Drive-through modernization initiative",
      "First-party ordering migration from third-party delivery",
      "State labor law change driving scheduling/automation investment",
      "Franchise sales push requiring modern tech package",
    ],
    negative: [
      "Recently completed system-wide POS migration (budget/appetite exhausted 12-18 months)",
      "Brand in active restructuring / bankruptcy proceedings",
      "No POS integration path (hard disqualifier)",
      "Single-unit independent operator (economics don't support vendor relationship)",
      "Franchisor has locked vendor list with exclusive contracts",
    ],
  },
};

export const QSR_DISCOVERY = `
QSR/RESTAURANT DISCOVERY (use when prospect is in food service, QSR, or restaurant technology):

REALITY:
- What's your value creation thesis — same-store sales lift, AUV expansion, digital mix growth, or EBITDA margin points?
- How are you approaching first-party customer acquisition vs third-party delivery mix?
- What's your franchise/corporate split, and how does technology get mandated vs recommended vs optional for franchisees?

IMPACT:
- Walk me through your loyalty program economics — what % of transactions, member count trend, where are the leaks?
- Which POS platform are you running enterprise-wide? Franchisee deployment mandated or co-funded?
- What's your labor cost as % of revenue, and how has it moved over the last 12 months? Where is scheduling friction highest?

VISION:
- How is leadership thinking about AI investment — efficiency, growth, or both? What timeline does the board expect?
- How many units are on direct ordering vs third-party? What's the unit-level economic lift from shifting first-party?
- What does your ideal technology stack look like 3 years from now vs what you run today?

ENTRY POINTS:
- Tell me about the last tech vendor you onboarded — what worked, what was rollout friction?
- Are you benchmarking against portfolio peers or category competitors?
- Who makes the technology call — brand HQ, individual franchisees, or both? Is there a preferred vendor list?

ROUTE:
- How does capital allocation work — 2026 capex, opex shift, or does it need to pencil in current budget cycle?
- Is there a sponsor board meeting coming up that creates a decision window?
- What's the pilot structure — how many units, how long, what metrics define success?
`;

export const QSR_PLAYBOOK = {
  name: "QSR / Quick-Service Restaurants",
  keywords: [
    "QSR", "quick service restaurant", "fast food", "fast casual",
    "franchise", "franchisee", "franchisor", "restaurant",
    "drive-through", "drive-thru", "loyalty program",
    "food service", "menu engineering", "ghost kitchen",
    "McDonald's", "Starbucks", "Chipotle", "Chick-fil-A",
    "Yum Brands", "Restaurant Brands International",
    "Wendy's", "Panda Express", "Wingstop", "Shake Shack",
    "Sweetgreen", "Panera", "Dunkin", "Popeyes",
    "Toast", "Olo", "Punchh", "Paytronix",
    "Roark Capital", "Inspire Brands",
    "AUV", "four-wall EBITDA", "same-store sales",
    "unit-level economics", "POS", "point of sale",
  ],
  personas: [
    "CTO", "VP Technology", "CDO",
    "CMO", "VP Marketing", "VP Digital",
    "VP Operations", "SVP Operations", "COO",
    "VP Franchise Development", "VP Franchise Relations",
    "CFO", "VP Finance",
    "Owner/Operator", "Franchisee",
    "District Manager", "Area Director",
    "PE Operating Partner", "PE Portfolio Operations",
  ],
  triggers: [
    "PE acquisition (100-day plan active)",
    "Loyalty program launch or overhaul",
    "Same-store sales decline",
    "New CTO/CDO/VP Technology at brand HQ",
    "Drive-through modernization initiative",
    "First-party ordering migration",
    "State labor law change (scheduling/wage)",
    "Franchise sales push (modern tech package needed)",
    "Menu simplification / optimization project",
    "Delivery cost optimization / third-party renegotiation",
    "System-wide POS evaluation cycle",
  ],
  disqualifiers: [
    "No POS integration certification (hard gate for any QSR technology vendor)",
    "Pitching enterprise pricing to individual franchisees (must pencil per-unit)",
    "Ignoring the franchise/corporate dual buying center",
    "Assuming digital maturity (many systems still paper/phone/fax-based)",
    "Citing systemwide revenue as company revenue (10x+ difference)",
    "Training requirements exceeding 30 minutes per user (100-200% annual hourly turnover)",
    "Generic 'digital transformation' pitch without unit-level economics framing",
  ],
  heuristics: [
    "PE acquisition is the strongest buying trigger — every PE deal creates 6-12 months of active technology evaluation",
    "POS integration is the hard gate — certify with Brink/Aloha/MICROS/Toast ISV before selling",
    "Speak unit-level economics: AUV, four-wall EBITDA, labor %, food cost %, royalty rate",
    "Capital structure determines buying behavior: PE = EBITDA (fast), public = SSS (quarterly pressure), family = relationship (slow, loyal)",
    "Enterprise QSR sales cycles are 9-18 months with mandatory pilots — plan for this timeline",
    "Franchise vs corporate creates dual buying centers — engage both simultaneously",
    "Labor is the existential issue — any technology reducing labor dependency has immediate ROI framing",
    "First-party ordering migration from third-party delivery is the single largest technology investment trend in QSR",
    "The QSR-recession-proof assumption broke in 2025 — do not cite the old pattern as current",
  ],
};
