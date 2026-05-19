// src/data/qsrKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// QSR / Quick-Service Restaurant deep knowledge layer.
// Covers: fast food, fast casual, franchise dynamics, restaurant
// tech stack, loyalty/payments, delivery economics, PE/public/family
// ownership patterns, and unit-level economics.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// SOURCES:
// - Restaurant Business / Nation's Restaurant News (Jonathan Maze reporting)
// - Franchise Times / Emergent Growth Advisors (PE-franchise analysis)
// - Restaurant Dive (industry coverage)
// - Bank of America QSR commercial banking research
// - Franchise Equity Partners / RFDC 2025 investor thresholds
// - Roark Capital Group public disclosures
// - Blackstone portfolio announcements (Jersey Mike's acquisition)
// - Toast ISV ecosystem documentation
// - DoorDash / Uber Eats marketplace data
// - MarginEdge-Qu integration announcement (Nov 2025)

export const QSR_INJECTION = `
QSR / RESTAURANT INDUSTRY CONTEXT (use when target or seller is in restaurants, food service, QSR, or hospitality):

MARKET: ~200,000+ limited-service units in U.S. [verified 05/2026, NRN Top 500]. Leaders: Yum! Brands (~$60B systemwide), Restaurant Brands International (~$45B), Inspire Brands (~$32.6B). PE-consolidated: Roark Capital alone controls 112,000+ locations across 121 countries, $97B systemwide revenue [verified 05/2026, Roark Capital public disclosures].

FRANCHISE vs CORPORATE: Corporate locations run 25-30% restaurant-level margins; franchisees 8-15% EBITDA (after 5-6% royalty + 2-4% advertising fund). Creates parallel buying centers: brand HQ (standards, tech mandates, loyalty) + multi-unit franchisees (back-office, scheduling, inventory). Flynn Group, Sun Holdings operate 2,000+ units with independent procurement.

TECH STACK: POS (Toast ~24%, Square ~28%, Oracle MICROS, PAR Brink for enterprise). Loyalty (Punchh for Yum!, Paytronix for Panera/Five Guys, proprietary for Starbucks/McDonald's/Chick-fil-A). Order management (Olo powers 50% of public restaurant cos). Delivery (DoorDash ~67%, Uber Eats ~23%). Back-of-house (Crunchtime, Restaurant365, MarketMan). Payment orchestration (FreedomPay, Adyen, Stripe).

PE & M&A (Q2 2026 REFRESH): Roark Capital Group (~$37B AUM, 23 restaurant chains over 25 years) is the dominant force — subsidiary Inspire Brands (Arby's, Buffalo Wild Wings, Sonic, Jimmy John's, Dunkin', Baskin-Robbins) + GoTo Foods (Auntie Anne's, Carvel, Cinnabon, Jamba Juice, McAlister's, Moe's, Schlotzsky's). Also holds Cheesecake Factory, Hardee's, Carl's Jr., Culver's (minority), Dave's Hot Chicken (June 2025, $1B at 315 units). Roark considering Inspire Brands IPO targeting ~$2B (March 2026 reporting). Founded by Neal Aronson; current managing partners may rotate — verify before citing.

Blackstone entered QSR with Jersey Mike's $8B acquisition (Jan 2025, 90% stake) [verified 05/2026, Blackstone portfolio announcements] — highest-profile new-entrant move in franchise. Blackstone installed new executive leadership post-acquisition. Blackstone achieved 12% supply chain cost reduction within first year. Other active PE: Bain Capital (Sizzling Platter), 3G Capital (RBI/Burger King), Apollo (Qdoba), JAB Holding (Pret, Panera adjacency), High Bluff Capital (Quiznos parent).

PE picking off franchise concepts earlier than historical 3,000+ unit threshold. Dave's Hot Chicken at 315 units / $1B is the new-cycle template [verified 05/2026, Roark Capital / Restaurant Business]. Investor selection thresholds: AUVs of $1.5-$2M for fast casual/QSR, $3M for full service [verified 05/2026, Franchise Equity Partners, RFDC 2025]. Growing concepts: 25%+ margins, <2-year unit-level payback. Notable 2025: Denny's sold $620M, Yum considering Pizza Hut sale, Jack in the Box sold Del Taco for $115M ($460M less than they paid), Wendy's closing hundreds. Franchisee-acquires-franchisor pattern (Sun Holdings, Yadav Enterprises) is a structural shift.

ECONOMICS: QSR industry revenue ~$532B for 2025 [verified 05/2026, NRN / Restaurant Business]; 80%+ of operators expect 2025 sales to match or exceed 2024. THE 2025 INVERSION: casual dining traffic is recovering while QSR foot traffic is declining — reverses the 2023-2024 "trade-down to QSR" pattern (Bank of America commercial banking research). This breaks the conventional "recession = QSR tailwind" assumption. Per-store traffic declining despite loyalty member count doubling since 2019 (~39% of visits). Loyalty traffic grew 5% YoY while overall traffic fell 2%. Food cost + labor cost = largest controllable expenses; inventory discipline separates top-quartile from median by 2-4% margin points. PE portcos now require 10-12% EBITDA growth annually (vs historical 5%) given 8-9% borrowing costs. California fast-food wages reached $20/hr in 2025 [verified 05/2026, CA AB 1228]; sector-wide labor cost growth 6%+ annually. QSR labor cost growth since 2017: 60.2% vs 73.9% for full-service. Inflation peak: QSR 7.2% vs full-service 10.1%; current QSR ~3.6% vs 4.3% full-service [verified 05/2026, BLS / Restaurant Business].

DELIVERY ECONOMICS: Third-party effective commission 30-40% (headline 15-30% + promos + processing + refunds). Direct/first-party ordering via apps/websites is dominant GTM strategy — brands escape commission tiers. Starbucks stored-value loop (preloaded card breakage) is the gold standard.

2026 TRENDS: AI drive-thru voice — Taco Bell as public reference; Toast Drive-Thru launched April 2026 as broader-market enterprise solution. AI-driven inventory and labor scheduling — MarginEdge-Qu integration (Nov 2025) for real-time profitability tracking. AI-driven loyalty + digital ordering boosted Dunkin's EBITDA margins ~8% within five years. AI-driven inventory and self-service kiosks reducing labor costs by up to 15% in QSRs. Subscription models expanding (Panera Sip Club, Taco Bell Taco Lover's Pass). Agentic commerce standards from Visa/Mastercard. 70% of PE firms mandate AI adoption with 12-month margin-impact requirements. Roark's operating-partner model: 20% increase in franchisee satisfaction, 10% rise in same-store sales.

VOICES TO TRACK: Restaurant Business / NRN M&A coverage (most-cited QSR franchise reporting, "A Deeper Dive" podcast), Emergent Growth Advisors / Franchise Times PE-franchise analysis, Northmarq restaurant real estate research, Restaurant Dive industry coverage, Bank of America commercial banking QSR research. Verify current bylines before citing — journalist beats rotate.

GTM: Enterprise sales cycles 9-18 months with mandatory pilots (5-25 stores, 60-180 days). POS integration is hard gate — every vendor must certify with Brink/Aloha/MICROS/Toast ISV. Capital structure determines buying: PE = EBITDA optimization, public = same-store sales, family office = multi-decade value.

KNOWN TRAPS:
- "Systemwide revenue" and "company-operated revenue" are fundamentally different — Yum! reports ~$7B company revenue vs $60B systemwide. Always clarify which.
- PE portfolio brand ownership changes frequently (acquisitions, divestitures, IPOs) — verify current ownership before citing.
- Franchise vs corporate economics differ by 2-3x on margins — never generalize "restaurant margins" without specifying ownership model.
- POS market share figures shift rapidly (Toast IPO growth, Square rebranding to Block) — verify current share before quoting.
- The "QSR = recession-proof" assumption broke in 2025 (casual dining traffic recovering while QSR declined) — do not cite the old pattern as current.
- Named executives (CEOs, PE partners) in this sector rotate frequently — always verify current roles via web search before referencing in briefs.
`;

export const QSR_SCORING = {
  highFitSegments: [
    { segment: "Loyalty/payments fusion platforms for QSR", avgFit: "75-85%", reason: "Every brand aspires to Starbucks stored-value loops; white space significant" },
    { segment: "First-party order acquisition tech", avgFit: "70-80%", reason: "Brands desperate to escape 30-40% third-party commissions" },
    { segment: "Back-of-house AI/automation (inventory, scheduling, waste)", avgFit: "70-80%", reason: "Direct EBITDA impact within 12 months; PE mandate alignment" },
    { segment: "AI-driven demand forecasting (mid-market 50-500 units)", avgFit: "65-75%", reason: "Crunchtime dominates enterprise; mid-market underserved" },
  ],
  highFrictionSegments: [
    { segment: "Voice/AI drive-thru ordering", avgFit: "30-45%", reason: "High error tolerance bar in production; customer-facing AI failures create brand risk; technology maturity varies" },
    { segment: "POS replacement (displacing Toast/MICROS/Aloha)", avgFit: "25-40%", reason: "18-24 month cycles, incumbent integration depth, franchisee resistance" },
    { segment: "Hyper-personalization at scale", avgFit: "35-50%", reason: "Requires first-party data stack maturity most brands lack; multiyear ROI" },
  ],
};

export const QSR_DISCOVERY = `
QSR/RESTAURANT DISCOVERY (use when prospect is in food service, QSR, or restaurant technology):

REALITY:
- What's your value creation thesis — same-store sales lift, AUV expansion, digital mix growth, or EBITDA margin points?
- How are you approaching first-party customer acquisition vs third-party delivery mix?

IMPACT:
- Walk me through your loyalty program economics — what % of transactions, member count trend, where are the leaks?
- Which POS platform are you running enterprise-wide? Franchisee deployment mandated or co-funded?

VISION:
- How is leadership thinking about AI investment — efficiency, growth, or both? What timeline does the board expect?
- How many units are on direct ordering vs third-party? What's the unit-level economic lift from shifting first-party?

ENTRY POINTS:
- Tell me about the last tech vendor you onboarded — what worked, what was rollout friction?
- Are you benchmarking against portfolio peers or category competitors?

ROUTE:
- How does capital allocation work — 2026 capex, opex shift, or does it need to pencil in current budget cycle?
- Is there a sponsor board meeting coming up that creates a decision window?
`;
