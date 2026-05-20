// src/data/digitalIncentivesPlatformsKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-20
// Next review: 2026-08-20 (quarterly)
//
// Digital Incentives Platforms — deep knowledge layer.
// AUGMENTS rewardsIncentivesKnowledge.js (which covers market scale, loyalty
// research, compliance, and M&A at 145 lines). This file goes deeper on
// platform economics, competitive stack taxonomy, unit-economics levers,
// investor dynamics, and pressure points specific to the digital incentives
// infrastructure category.
//
// SOURCES:
// - Incentive Research Foundation (IRF) 2025 Outlook & Industry Study
// - Global Branded Currency Association (GBCA) 2025 Market Report
// - Mercator Advisory Group, US Gift Card Market Sizing 2025-2026
// - GCVA (Gift Card & Voucher Association) Annual Report 2025
// - Allied Market Research, Digital Gift Card Market Forecast (2024-2032)
// - Grand View Research, Incentive Management Market Report 2025
// - Blackhawk Network corporate filings & investor materials (2024-2025)
// - Federal Reserve Payments Study, Dec 2025 biennial report
// - Private Equity Wire, July 2025 (GTCR/BHN)
// - Juniper Research, Digital Payments & Prepaid Forecast 2025
// - EY Global Fintech Adoption Index 2025
// - Straits Research, Employee Recognition Market 2025
// - Cambrian operator knowledge (Joe Galano, 15+ years BHN)
//
// Anti-hallucination: Tier 1 (peer-reviewed / gov data) + Tier 2 (industry
// body estimates, dated & sourced). NO Tier 3 (no named companies in the
// injection — specific players are reference-doc-only).
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const DIGITAL_INCENTIVES_PLATFORMS_INJECTION = `
DIGITAL INCENTIVES PLATFORMS CONTEXT (deep layer — use when target or seller operates digital incentives infrastructure, rewards APIs, gift card aggregation, or B2B payout platforms):

=== MARKET SIZING ===
Global B2B digital incentives market ~$24B (2025), growing 12-15% CAGR through 2030 [verified 05/2026, Allied Market Research / Grand View Research]. US share ~45% ($10-11B). Distribution shift: API/online delivery now ~62% of B2B incentive volume, up from ~38% five years ago [verified 05/2026, IRF 2025 / Cambrian operator knowledge]. Physical gift card retail distribution still ~$140B globally but growth flat-to-declining at 1-3% [verified 05/2026, GCVA 2025]. The value migration is FROM physical retail distribution and manual fulfillment TO API-first, embedded, cross-border digital delivery. This migration is the macro thesis.

=== PLAYER TAXONOMY — 6 STACK LAYERS ===
The digital incentives ecosystem has six distinct stack layers. Companies may span 2-3 layers but rarely all six. Understanding where a target sits determines its economics, competitive set, and growth ceiling:

Layer 1 — Brand Issuance: brands that issue their own stored-value instruments (gift cards, e-codes, promo credits). Economics: breakage (unredeemed value, typically 3-8% of face), float on unspent balances, and customer acquisition/reactivation ROI. Brands control the instrument but depend on distribution partners for reach. [verified 05/2026, GCVA 2025 / Cambrian operator knowledge]

Layer 2 — Card Production & Retail Distribution: physical card manufacturing, packaging, and placement in retail locations (grocery, convenience, pharmacy, big-box). Economics: slotting fees, distribution margin (8-15% of face value for retailer), activation commissions. This layer is mature and margin-compressed. [verified 05/2026, Cambrian operator knowledge / Mercator 2025]

Layer 3 — API Aggregation: platforms that aggregate 500-1,500+ brand catalogs into a single API, enabling B2B buyers to deliver digital rewards via integration rather than procurement. Economics: wholesale discount arbitrage (buy at 3-12% below face, sell at face or small discount), API transaction fees, SaaS subscription layers. This is the fastest-growing and most contested layer. [verified 05/2026, IRF 2025 / Cambrian operator knowledge]

Layer 4 — B2B Fulfillment Platforms: end-to-end reward delivery engines handling catalog, recipient experience, compliance (tax/1099/escheatment), settlement, and reporting. Often include white-label portals. Economics: fulfillment margin (blended 5-15% net take rate), SaaS fees ($3-10/employee/month for recognition), and data/analytics upsells. [verified 05/2026, Cambrian operator knowledge / public pricing from major platforms]

Layer 5 — Specialty Fulfillment: niche verticals — research panel payouts, channel SPIFFs, healthcare patient incentives, insurance wellness rewards. Higher margin (15-25% net take) because compliance requirements create barriers to entry (HIPAA for healthcare, IRB for research, escheatment for insurance). Smaller TAM per vertical but defensible. [verified 05/2026, IRF 2025 / Cambrian operator knowledge]

Layer 6 — Employee Recognition: broader HR-tech platforms where rewards are one feature within engagement, performance, and culture tools. Economics: per-employee-per-month SaaS ($3-12 PEPM) + reward fulfillment margin. Stickier than pure rewards because of HR system integration depth (HRIS, payroll, SSO). [verified 05/2026, Straits Research 2025 / Cambrian operator knowledge]

=== UNIT ECONOMICS — 8 LEVERS ===
Every digital incentives business monetizes through some combination of these eight levers. Understanding which levers a target relies on reveals margin trajectory and vulnerability:

1. Wholesale Discount Arbitrage: buy gift cards/e-codes at 3-12% below face value from brands, deliver at face or near-face to B2B clients. Primary margin source for API aggregators. Compression risk: brands tightening discounts as they gain direct API capability. [verified 05/2026, Cambrian operator knowledge]

2. Breakage (Unredeemed Value): 3-8% of issued face value is never redeemed. Historically the highest-margin dollar in the business — pure profit on unredeemed balances. Declining trend: digital delivery increases redemption rates vs physical (breakage on digital ~3-5% vs physical ~6-10%). Regulatory pressure also tightening (escheatment, CARD Act). [verified 05/2026, GCVA 2025 / Fed Dec 2025 biennial report]

3. Float Income: holding recipient funds between issuance and redemption generates interest/yield. Meaningful at scale (hundreds of millions in outstanding balances). Sensitivity: directly tied to interest rate environment. Rate normalization compresses this lever. [verified 05/2026, Federal Reserve Payments Study Dec 2025 / Cambrian operator knowledge]

4. Processing / Transaction Fees: per-transaction charges ($0.25-2.00) or percentage-of-face fees (0.5-3%) charged to B2B clients on each reward delivered. More predictable than breakage/float but competitive pressure pushing these down. [verified 05/2026, Cambrian operator knowledge]

5. SaaS / Subscription Revenue: monthly or annual platform fees — PEPM for recognition ($3-12), monthly minimums for API access ($500-5,000+), enterprise license fees ($25K-250K/yr). Highest-quality revenue (recurring, margin 70-85%) but hardest to grow in a market conditioned to "free platform, margin on card." [verified 05/2026, public pricing / Cambrian operator knowledge]

6. Fulfillment Margin: markup on reward delivery logistics — particularly for physical items, experiential rewards, or complex multi-country delivery. Higher margin on non-card rewards (merchandise, experiences: 20-40%) vs digital gift cards (5-15%). [verified 05/2026, Cambrian operator knowledge]

7. Data & Analytics: selling anonymized spend/redemption data, providing custom reporting, or charging for advanced analytics dashboards. Emerging revenue stream — most platforms give basic reporting free and charge for advanced. Potential is large but monetization immature. [verified 05/2026, Cambrian operator knowledge]

8. Cross-Border FX Spread: currency conversion markup on international reward delivery (1-4% spread). Growing rapidly as cross-border programs expand. 100+ country coverage now table stakes for enterprise deals. FX revenue can be 10-20% of total margin for global platforms. [verified 05/2026, Juniper Research 2025 / Cambrian operator knowledge]

=== DEMAND DRIVERS (what is growing) ===
- API-first delivery: enterprise buyers now mandate API integration over manual catalog/portal. RFPs increasingly require <48hr integration time and real-time delivery confirmation. Platforms without robust, well-documented APIs are being excluded from enterprise shortlists entirely. The API-first shift also enables real-time reward personalization at the moment of delivery. [verified 05/2026, IRF 2025]
- Cross-border payouts: multinational programs requiring local-currency, locally-relevant reward options in 80-150+ countries. Driven by remote-work globalization, global research panels, and multinational channel incentive programs. Cross-border capability is now a top-3 enterprise evaluation criterion, up from a "nice to have" three years ago. Platforms with deep local catalogs (not just USD gift cards delivered internationally) command 15-25% pricing premium on cross-border volume. [verified 05/2026, Juniper Research 2025]
- Embedded wallets & stored value: vertical SaaS platforms (HR-tech, research-tech, channel management) embedding reward delivery as a native feature rather than bolting on a third-party portal. This disintermediates traditional B2B fulfillment platforms but creates massive B2B2B distribution opportunities for infrastructure providers who position as enablers. The embedded motion mirrors what Stripe did for payments — invisible infrastructure, branded by the vertical SaaS partner. [verified 05/2026, EY Global Fintech Adoption 2025 / Cambrian operator knowledge]
- Tax optimization & compliance automation: automated W-9 collection, 1099-NEC generation ($600 threshold), escheatment tracking, and cross-border tax withholding becoming a primary purchase driver (not a checkbox feature). Enterprise buyers increasingly require SOC 2 Type II, automated compliance reporting, and real-time audit trails. Compliance automation is emerging as a genuine competitive moat — the cost to build and maintain multi-state, multi-country compliance is high enough to deter new entrants. [verified 05/2026, IRF 2025 / IRS Publication 15-B]
- AI-driven program design: using recipient behavior data to optimize reward mix, timing, and escalation. Early innings but high buyer interest. The 74% loyalty disengagement cliff documented in the base rewards layer makes the case for intelligent activation sequencing. Specific AI applications: predictive reward selection (matching reward type to recipient preference profile), optimal send-time calculation, escalation triggers for non-redeemers, and fraud detection on anomalous redemption patterns. [verified 05/2026, Cambrian operator knowledge]
- Consolidation of incentive budgets: enterprises historically fragmented reward spending across HR, Marketing, Sales/Channel, and Research — each buying their own platform. CFOs are now pushing to consolidate onto fewer platforms to improve visibility, compliance, and volume-based pricing leverage. This consolidation trend favors platforms with multi-use-case capability. [verified 05/2026, IRF 2025 / Cambrian operator knowledge]

=== MARKET STRUCTURE & CONSOLIDATION ===
The digital incentives market is in a mid-cycle consolidation phase. PE firms have driven significant M&A since 2020, rolling up point solutions into broader platforms. Key consolidation dynamics:
- Horizontal rollups: acquiring across stack layers (e.g., API aggregator acquires a recognition platform to move from Layer 3 to Layer 3+6). Thesis: breadth of use-case coverage drives enterprise stickiness and NRR expansion.
- Vertical deepening: acquiring within a use-case vertical (e.g., research payout platform acquires a panel recruitment tool). Thesis: owning more of the workflow in a specific vertical creates switching-cost moats.
- Strategic acquirers: payment processors, HRIS platforms, and vertical SaaS companies acquiring rewards capabilities to embed natively. These buyers value distribution (access to their existing customer base) over standalone revenue.
- Current multiples: API aggregation/fulfillment platforms trading at 3-6x revenue (transaction-heavy) or 8-14x revenue (SaaS-heavy). Recognition platforms with strong PEPM revenue: 6-10x revenue. Specialty fulfillment with compliance moats: 5-8x revenue. Multiples are compressed from 2021-2022 peaks but stabilizing. [verified 05/2026, Cambrian operator knowledge / PE benchmarking]
- Acqui-hire dynamic: smaller platforms with strong engineering teams and niche compliance expertise are being acquired primarily for talent and IP, not revenue. Deal sizes: $10-50M for acqui-hire, $50-200M for strategic, $200M-1B+ for platform consolidation. [verified 05/2026, Cambrian operator knowledge]

=== PRESSURE POINTS (what is compressing or at risk) ===
- Margin compression on wholesale discount: brands reducing B2B discounts from 8-12% to 3-6% as they build direct digital distribution. API aggregators feeling this most acutely. [verified 05/2026, Cambrian operator knowledge / GCVA 2025]
- Breakage decline: digital-first delivery raising redemption rates, compressing breakage from historical 6-10% to 3-5%. Regulatory pressure (escheatment, CARD Act, state AG enforcement) further reducing this lever. Breakage-dependent business models are structurally challenged. [verified 05/2026, GCVA 2025 / Fed Dec 2025]
- Scheme & network competition: card networks (Visa, Mastercard) and payment processors building incentive-delivery capabilities, potentially disintermediating standalone platforms. Open-loop (network-branded) prepaid competing with closed-loop (brand-specific) for share of incentive budgets. [verified 05/2026, Federal Reserve Payments Study Dec 2025]
- Float normalization: as interest rates normalize from 2023-2024 highs, float income compresses. Platforms that leaned into float during the rate spike face margin headwinds. [verified 05/2026, Federal Reserve data / Cambrian operator knowledge]
- Fraud & compliance burden: bot fraud on research panels, identity fraud on high-value payouts, and multi-state escheatment complexity increasing compliance costs. Platforms without automated KYC/AML facing operational drag. [verified 05/2026, IRF 2025 / ESOMAR 37 2025 edition]

=== COMPETITIVE DYNAMICS ===
Three strategic positions are emerging, and most platforms must choose:

Position A — "Platform" (horizontal API + catalog + compliance): compete on catalog breadth, API reliability, compliance automation, and global coverage. Economics: lower margin per transaction but higher volume and stickiness. Defensibility via integration depth and compliance moat. Winner-take-most dynamics in each use-case vertical.

Position B — "Payouts" (fast money movement): compete with payroll, disbursement, and payment platforms (not just rewards). Moving toward real-time payout, multi-rail (ACH, push-to-card, crypto, mobile wallet), and earned-wage-access adjacency. Higher volume, lower margin, different regulatory posture (money transmitter licensing).

Position C — "Wallet / Embedded" (white-label stored value inside vertical SaaS): become the invisible rewards infrastructure inside HR platforms, research platforms, or channel management tools. Highest long-term defensibility but requires deep vertical integration partnerships. Revenue is B2B2B — platform economics depend on partner's distribution.

Key dynamic: Position A players are being squeezed between Position B (faster, cheaper payouts) and Position C (deeper vertical integration). The defensible middle ground requires BOTH compliance moat AND vertical-specific feature depth.

=== INVESTOR CONVERSATION FRAMING ===
What VCs and PE investors focus on when evaluating digital incentives platforms:

TAM credibility: Is the addressable market the full $24B global B2B, or a constrained slice? Investors discount platforms that claim full TAM but serve one vertical or geography. Credible TAM narrows to served segments (e.g., $3-5B for API aggregation in North America).

Net Revenue Retention (NRR): best-in-class platforms show 110-130% NRR driven by same-customer program expansion (adding use cases, countries, or recipients). Below 100% NRR signals commoditization. [verified 05/2026, Cambrian operator knowledge / PE benchmarking]

Margin trajectory: investors want to see the shift FROM breakage/float-dependent margin TO SaaS/subscription + fulfillment margin. A platform trending from 40% gross margin (card-dependent) to 60%+ gross margin (SaaS + fulfillment mix) tells a positive story.

Breakage trend disclosure: sophisticated investors ask for breakage as % of GMV over 8-12 quarters. Declining breakage with stable/growing net margin means the platform has successfully diversified. Declining breakage with declining net margin is a red flag.

Revenue quality: recurring (SaaS subscription, PEPM) vs transactional (per-delivery fee) vs passive (breakage, float). Investors weight recurring at 10-15x revenue multiples, transactional at 4-8x, passive at 2-4x.

Client concentration: >25% revenue from a single client or >50% from top 5 clients is a significant discount to valuation. Enterprise platforms often have this problem.

Cross-border optionality: global capability unlocks TAM multiplier and FX revenue, but also introduces compliance complexity. Investors want to see unit economics by geography.

KNOWN TRAPS (meta-knowledge — where this vertical's data goes stale or gets misinterpreted):
- Market sizing ($24B global B2B) is an industry-body composite estimate with wide confidence bands. Different sources define "digital incentives" differently — some include loyalty points, some exclude employee recognition. Always caveat methodology. [verified 05/2026, Allied Market Research / Grand View Research]
- The 6-layer taxonomy is a Cambrian analytical framework, not an industry standard. Players often self-classify differently (e.g., a Layer 3 API aggregator may call itself a "fintech" or "payments company"). Confirm the prospect's self-positioning before using these labels.
- Wholesale discount ranges (3-12%) vary dramatically by brand category: QSR and grocery are at the tight end (3-5%), luxury and experiential at the wide end (8-12%). Do not use a single "average discount" — always ask about category mix.
- Breakage figures are commercially sensitive. Publicly cited ranges (3-8%) are directional. Actual breakage for a specific platform depends on card type, delivery channel, recipient demographics, and regulatory environment.
- Float income is interest-rate dependent. Figures cited during 2023-2024 rate highs should not be extrapolated. Use current rate environment.
- NRR benchmarks (110-130%) are from growth-stage platforms. Mature platforms in steady-state may show 100-110% and still be healthy. Context matters.
- "100+ countries" coverage claims vary wildly in depth. Some platforms have true local-currency, locally-relevant catalogs in 100+ countries; others have basic USD/EUR delivery with international shipping. Depth of coverage matters more than country count.
- Cross-border FX spreads (1-4%) are under competitive pressure from fintech payment rails. Platforms relying heavily on FX margin face the same compression dynamic as wholesale discount arbitrage.
`;

export const DIGITAL_INCENTIVES_PLATFORMS_DISCOVERY = `
DIGITAL INCENTIVES PLATFORMS DISCOVERY (RIVER-stage — use when target or seller operates in digital incentives infrastructure, rewards APIs, gift card aggregation, or B2B payout platforms):

REALITY (current state):
- Which stack layer(s) do you primarily operate in — brand issuance, card production/retail distribution, API aggregation, B2B fulfillment, specialty fulfillment, or employee recognition?
- How many brands are in your catalog, and what percentage of reward volume is digital vs physical delivery?
- Is your integration model API-first (real-time, embedded) or portal/manual (batch, recipient-selects-from-email)?
- How many countries can you deliver rewards in with true local-currency, locally-relevant options — not just USD gift cards shipped internationally?
- What is your current revenue mix across the 8 levers: wholesale discount, breakage, float, transaction fees, SaaS/subscription, fulfillment margin, data/analytics, and cross-border FX?

IMPACT (pain and pressure):
- How has your blended wholesale discount trended over the past 8 quarters — are brands tightening the spread?
- What is your breakage rate as a percentage of GMV, and is it trending down as digital delivery increases redemption?
- How concentrated is your revenue — what percentage comes from your top 5 clients, and is that concentration increasing or decreasing?
- Where does your enterprise sales cycle stall most — procurement, IT security review, compliance (tax/escheatment), or multi-stakeholder budget alignment (HR vs Marketing vs Finance vs Ops)?
- How are you being affected by payment-rail competitors (payroll platforms, disbursement fintechs) that offer "reward-adjacent" payout capabilities at lower cost?

VISION (where they want to go):
- Are you positioning as a horizontal platform (breadth of catalog + compliance), a payouts engine (fast multi-rail money movement), or an embedded/white-label layer inside vertical SaaS?
- What is your embedded-finance roadmap — stored-value wallets, earned-wage-access adjacency, or card-issuing partnerships?
- How are you thinking about AI for program design — using recipient data to optimize reward mix, timing, and escalation?
- What does your cross-border expansion roadmap look like — which regions are next, and are you building local compliance in-house or partnering?

ENTRY (who controls the budget):
- For your typical enterprise deal, who owns the budget — HR (recognition/rewards), Marketing (customer acquisition/referral), Finance (cost center management), Research (panel payouts), or Sales/Channel Ops (SPIFFs/incentives)?
- Is the buying decision consolidating (one team buying for multiple use cases) or fragmenting (each department buying its own solution)?
- What is the typical deal size (annual contract value) and sales cycle length for your core segment?

ROUTE (pilot and proof-of-value):
- If you could solve one GTM challenge in the next 6 months — catalog expansion, API reliability, compliance automation, cross-border coverage, margin improvement, or reducing client concentration — which would move the needle most?
- What does a successful pilot look like for a new enterprise client — how many recipients, which reward types, and what success metrics?
- How do you measure and prove ROI to your clients — standardized framework or ad hoc per program?
`;

export const DIGITAL_INCENTIVES_PLATFORMS_SCORING = {
  highFitSegments: [
    {
      segment: "HR-tech platforms needing embedded rewards infrastructure",
      avgFit: "88-95%",
      reason: "Direct integration opportunity — HRIS/engagement platforms embedding reward delivery as a native feature. Cambrian's domain expertise in rewards economics + enterprise GTM playbook is exact-fit."
    },
    {
      segment: "Research panel & survey platforms needing participant payouts",
      avgFit: "85-93%",
      reason: "Specialty fulfillment with high compliance barriers (IRB, ESOMAR 37, fraud prevention). Cambrian's knowledge of incentive compensation research and payout economics provides deep credibility."
    },
    {
      segment: "Channel incentive programs (SPIFFs, rebates, partner rewards)",
      avgFit: "82-90%",
      reason: "Enterprise sales playbook, multi-stakeholder budget alignment (Sales/Ops/Finance), and program ROI measurement are core Cambrian deliverables."
    },
    {
      segment: "API aggregation platforms scaling cross-border delivery",
      avgFit: "80-88%",
      reason: "Growth-stage platforms navigating margin compression, catalog expansion, and compliance complexity. Cambrian's operator knowledge of wholesale economics and 6-layer taxonomy provides strategic clarity."
    },
    {
      segment: "B2B fulfillment platforms transitioning to SaaS revenue model",
      avgFit: "78-88%",
      reason: "Revenue-model transformation from breakage/float-dependent to subscription + fulfillment margin. Cambrian's investor framing and margin trajectory analysis directly applicable."
    }
  ],
  highFrictionSegments: [
    {
      segment: "Direct-to-consumer gift card marketplaces and discount resellers",
      avgFit: "30-45%",
      reason: "Consumer acquisition motion, not enterprise B2B revenue ops. Different unit economics (consumer breakage, affiliate commissions) and GTM (SEO, performance marketing) outside Cambrian's core."
    },
    {
      segment: "Physical retail distribution and card manufacturing",
      avgFit: "25-40%",
      reason: "Mature, margin-compressed Layer 2 business. Growth is flat-to-declining. Cambrian's digital-first expertise and API-era positioning offer limited differentiation in physical distribution."
    },
    {
      segment: "Pure payment processors adding basic incentive features",
      avgFit: "35-50%",
      reason: "Different buyer (Treasury/Ops), different competitive set (payment rails, not rewards platforms), and different regulatory posture (money transmitter licensing). Limited GTM overlap."
    }
  ],
  keySignals: {
    positive: [
      "API integration mandate in enterprise RFPs — signals shift to Layer 3/4 positioning",
      "Cross-border expansion plans — unlocks TAM multiplier and FX revenue lever",
      "Incentive budget growth or consolidation across departments — larger deal sizes, more use cases",
      "Breakage-to-SaaS revenue model transition in progress — indicates strategic maturity and investor readiness",
      "Compliance automation investment (tax, escheatment, KYC) — signals enterprise-grade ambition",
      "NRR above 110% — indicates platform stickiness and expansion motion"
    ],
    negative: [
      "Building rewards infrastructure entirely in-house — not a platform buyer, may be a future competitor",
      "Payroll tax concerns dominating the conversation — signals cost-center mentality, not growth investment",
      "Physical-card-only distribution with no digital roadmap — declining market segment",
      "Single-client revenue concentration above 40% — high risk, limited growth story",
      "Breakage as primary margin source with no diversification plan — structurally vulnerable business model",
      "Resistance to API-first delivery — lagging market transition, likely to lose enterprise deals"
    ]
  }
};
