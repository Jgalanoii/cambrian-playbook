// src/data/rewardsIncentivesKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// Digital Rewards & Incentives deep knowledge layer.
// Cambrian Catalyst's CORE domain — Joe Galano's 15+ years at
// Blackhawk Network. Covers: B2B rewards, recognition, channel
// incentives, research payouts, embedded loyalty, compliance,
// distribution models, and economics.
//
// SOURCES:
// - Antavo Global Loyalty Report 2026 (3,000 professionals / 10,000 consumers / 500M interactions)
// - Nishio & Hoshino 2024, "Birthday rewards and CLV" (210,657 MUJI members)
// - ScienceDirect Aug 2025, experiential vs material rewards study
// - Melnyk & Bijmolt, non-monetary loyalty elements (foundational, cited through 2025)
// - Engage People / Wise Marketer 2025, "Pay with Points" survey
// - EY 2025, loyalty enrollment/satisfaction survey
// - Bond Brand Loyalty / arXiv 2512.00738, loyalty complexity study
// - Wang et al. 2023 meta-analysis, 46 RCTs, 109,648 participants (cash vs vouchers vs lotteries)
// - Elliott et al. 2025, Imperial College / JMIR (conditional vs unconditional incentives)
// - Cabrera-Alvarez & Lynn 2025, UK Understanding Society panel RCT
// - Holtom, Baruch, Aguinis & Ballinger 2022, Human Relations (1,014 surveys)
// - ESOMAR 37 (2025 edition)
// - Fed Dec 2025 biennial report on debit/prepaid interchange
// - Private Equity Wire, July 2025 (GTCR/BHN)
// - Tracxn (BHN acquisition history)
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const REWARDS_INCENTIVES_INJECTION = `
DIGITAL REWARDS & INCENTIVES CONTEXT (Cambrian's #1 domain — use when target or seller is in rewards, incentives, gift cards, recognition, loyalty, or prepaid):

MARKET SCALE: US gift card market $230B+ [verified 05/2026, Mercator Advisory Group / GCVA], global B2B incentives $80B+ [verified 05/2026, Incentive Research Foundation], employee recognition $90B+ [verified 05/2026, Incentive Research Foundation], research payouts $5B+ [verified 05/2026, Greenbook GRIT Report], channel incentives $50B+ globally [verified 05/2026, Incentive Research Foundation]. B2B incentives growing 3x faster than consumer [verified 05/2026, IRF 2025 Outlook].

CORE PLAYERS:
- Aggregators/infrastructure: Blackhawk Network (BHN), InComm, Fiserv (Money Network), Givex
- B2B rewards platforms: Tango/BHN Rewards, Tremendous, Giftbit, Runa, Xoxoday, Giftogram, Reward Gateway
- Recognition: Achievers (BHN), Workhuman, Reward Gateway (Edenred), Bonusly, Awardco
- Loyalty: Talon.One, Antavo, Yotpo, Marigold, Capillary
- Card-linked offers: Cardlytics, Augeo, Empyr, Rewards Network
- Channel specialists: ITA Group, BI Worldwide, Maritz, Madison Performance, 360insights

USE CASE SEGMENTATION (the crucial insight — different buyers control the same product):
- HR buys recognition (Achievers, Workhuman) + uses Tango/Tremendous for employee rewards
- Marketing buys customer acquisition/referral programs using same B2B rewards infrastructure
- Research buys participant incentive platforms (same architecture as HR rewards)
- Sales/Channel buys SPIFFs and channel incentives (ITA, BI Worldwide) but increasingly uses API platforms
- IT/Procurement evaluates SOC 2, integration capability, tax/compliance automation
This multi-buyer reality is THE defining GTM challenge.

DISTRIBUTION & ECONOMICS:
- Most B2B platforms charge $0 software fees, monetizing through gift card margin (buy at discount, sell at face), FX spreads, and float [verified 05/2026, Cambrian operator knowledge / BHN]
- Recognition platforms: $3-10/employee/month + reward fulfillment margin [verified 05/2026, Reward Gateway / Bonusly public pricing]
- Pricing transparency is competitive issue — 10-20% margin platforms being undercut by lower-margin entrants [verified 05/2026, Cambrian operator knowledge]
- Six capabilities required: catalog access, distribution infrastructure, compliance (tax/1099/escheatment/KYC), settlement, reporting, recipient experience

COMPLIANCE (critical — Cambrian knows this cold):
- Tax: W-9 collection, 1099-NEC/MISC ($600 threshold) [verified 05/2026, IRS Publication 15-B], W-2 inclusion for employee rewards, de minimis fringe
- Escheatment: state-by-state unclaimed property (3-5 year holding) [verified 05/2026, NAUPA guidelines], closed vs open loop differences
- CARD Act: 5-year minimum gift card expiry [verified 05/2026, CARD Act 2009 / Reg E]; CA, NY, MD more restrictive
- KYC/AML/OFAC: required for larger payouts; cross-border sanctions screening
- Fraud: identity verification, bot detection critical especially in research payouts

CAPITAL & M&A (Q2 2026 REFRESH): The GTCR/Blackhawk Network deal at $4-5B (in advanced talks per July 2025 Private Equity Wire) is the defining transaction. If completed at $5B+, it represents a meaningful return on Silver Lake/P2's original $3.5B 2018 take-private. [verified 05/2026, Private Equity Wire July 2025] BHN has made 19 acquisitions to date (average ~$132M) [verified 05/2026, Tracxn], most recent was Tango Card (Jan 2024). BHN's network: 1,000+ brands, 244,000+ retail locations [verified 05/2026, BHN corporate site]. Comparable peers weighing strategic alternatives: Green Dot, Paysafe, AvidXchange. Adjacent strategic acquirers: Fiserv, Brookfield Private Credit, and increasingly QSR/franchise PE firms (Roark, Inspire Brands) integrating loyalty as a unit-economics defense. Key investor voices: FTV Capital's Chris Winship (former Tango Card lead), Silver Lake/P2 leadership for Blackhawk exit dynamics, GTCR's payments team.

LOYALTY RESEARCH (Q2 2026 REFRESH — peer-reviewed):
- 74% of loyalty members disengage silently within the first two months (Antavo 2026, 3,000 professionals / 10,000 consumers / 500M platform interactions) — THE activation cliff stat. The design problem is activation, not enrollment. [verified 05/2026, Antavo Global Loyalty Report 2026]
- Birthday rewards have NO positive CLV effect — recipients had materially lower average CLV ($72) vs control ($125) in study of 210,657 MUJI members (Nishio & Hoshino 2024). Strong citation against unexamined "personalized gesture" tactics. [verified 05/2026, Nishio & Hoshino 2024]
- Experiential rewards drive greater self-connection than material rewards; even small experiential rewards produce effects comparable to large material ones (ScienceDirect Aug 2025). Loyalty market projected to reach $155.22B globally by 2029 [verified 05/2026, Mordor Intelligence].
- Non-monetary elements (events, recognition, exclusive services) sustain loyalty at program termination; monetary savings have no significant loyalty effect (Melnyk & Bijmolt, foundational, cited heavily through 2025).
- 90% of consumers willing to switch brands for better rewards (Engage People / Wise Marketer 2025). 78% would engage more if "Pay with Points" available at checkout. [verified 05/2026, Engage People / Wise Marketer 2025]
- 92% enrolled in at least one program but only 28% feel "very" satisfied (EY 2025). 73% find loyalty programs too complicated; 54% unaware which programs they belong to (Bond Brand Loyalty / arXiv 2512.00738). [verified 05/2026, EY 2025 / Bond Brand Loyalty]
- Program owner ROI: 92.7% measuring ROI report positive return; average 5.3x. Owner satisfaction 83% in 2026 vs 50.6% in 2022 (Antavo). [verified 05/2026, Antavo Global Loyalty Report 2026]

2026 TRENDS:
- API-first delivery is table stakes (Tango, Tremendous, Giftbit all sell embedded APIs)
- Embedded rewards in vertical SaaS is fastest-growing motion (Toast, ServiceTitan adding reward features)
- Choice-based delivery ("recipient picks from menu") has won over single-brand
- Global/cross-border: 100+ countries with local-currency redemption now table stakes
- Consolidation: BHN acquired Tango (2022), Rybbon (2022); PE appetite high
- OBBBA charitable deduction floor (effective 2026) reshapes donor-incentive intersection [verified 05/2026, OBBBA legislative text 2025]
- Federal interchange fee debate live: Fed Dec 2025 biennial report (100.7B debit/prepaid transactions, $4.7T, $34.12B interchange) [verified 05/2026, Federal Reserve Payments Study Dec 2025]
- Prepaid debit card growth decelerating in volume (down from 9.6% to ~4-5% annually) but interchange revenue holding [verified 05/2026, Federal Reserve Payments Study Dec 2025]

INCENTIVE COMPENSATION RESEARCH (Q2 2026 REFRESH — replaces dated Shaffer & Arkes 2009 anchor):
- Cash is most efficient at increasing response rates (RR 1.25) vs vouchers (RR 1.19) vs lotteries (RR 1.12) — Wang et al. 2023 meta-analysis, 46 RCTs, 109,648 participants, 14 countries. Directly contradicts conventional wisdom in some loyalty-adjacent industries. [verified 05/2026, Wang et al. 2023]
- Conditional incentives are more cost-effective than unconditional; unconditional have largest absolute effect (Imperial College / Elliott et al. 2025, JMIR). [verified 05/2026, Elliott et al. 2025]
- Raising incentives mid-field has materially larger effects on previous non-respondents than respondents (Cabrera-Alvarez & Lynn 2025, UK Understanding Society panel RCT — cleanest 2025 result on conditional escalation). [verified 05/2026, Cabrera-Alvarez & Lynn 2025]
- Average survey response rates climbed from 48% (2005) to 68% (2020) — Holtom, Baruch, Aguinis & Ballinger 2022, Human Relations, 1,014 surveys. Canonical reference for response-rate norms. [verified 05/2026, Holtom et al. 2022]
- ESOMAR 37 (2025 edition) now explicitly addresses participant validation, fraud prevention, and incentive changes mid-fielding. AAPOR endorses ISO Standard 20252 (200+ certified research orgs worldwide).
- Operator implication: the Antavo 74% disengagement cliff + Wang meta-analysis together make a tight case for redesigning loyalty-program activation around frontloaded conditional incentives.

CAMBRIAN'S EDGE: Joe's BHN background provides operator-level credibility. Every conversation starts from mutual recognition. This is the #1 vertical by domain expertise × addressable opportunity × competitive differentiation. The empirical record now clearly favors experiential and identity-affirming rewards over generic monetary discounts on long-run CLV. Month-2 retention, not enrollment, is the milestone.

KNOWN TRAPS (meta-knowledge — where this vertical's data goes stale or gets misinterpreted):
- GTCR/BHN deal status: has been "in advanced talks" since July 2025. Do NOT state it has closed unless confirmed by a binding agreement press release. Check before every use.
- Market size figures ($230B gift card, $80B B2B incentives) are industry-body estimates with wide confidence bands [verified 05/2026, GCVA / IRF]. Do not present as precise.
- BHN acquisition count (19) and average deal size ($132M) are Tracxn-sourced and may lag by 1-2 quarters.
- The Wang meta-analysis (cash > vouchers for response rates) applies to SURVEY INCENTIVES specifically — do not generalize to employee recognition or loyalty without caveating.
- The Antavo 74% disengagement stat is from their platform data, not an independent sample. Strong signal but potential selection bias.
- Birthday reward CLV study (Nishio & Hoshino) is a SINGLE retailer (MUJI Japan) — do not overgeneralize to all reward types or geographies.
- Escheatment laws change frequently at state level. 3-5 year holding periods are directionally correct but vary by state and instrument type.
- OBBBA charitable deduction floor (0.5% AGI) is enacted but implementation guidance still evolving — IRS rulemaking in progress.
- Interchange revenue figures from the Fed biennial report reflect 2023-2024 data collection; 2025-2026 actuals will differ due to regulatory changes.
`;

export const REWARDS_INCENTIVES_SCORING = {
  highFitSegments: [
    { segment: "B2B rewards platforms (Tango competitors, Tremendous adjacent)", avgFit: "90-95%", reason: "Direct domain overlap — channel attribution, partner GTM, enterprise sales playbook are exact Cambrian deliverables" },
    { segment: "Vertical SaaS adding embedded rewards (Toast, ServiceTitan tier)", avgFit: "82-90%", reason: "Embedded rewards GTM, vertical SaaS partner channel, product monetization strategy" },
    { segment: "Recognition platforms (Achievers, Workhuman competitive set)", avgFit: "80-88%", reason: "HRIS partnership architecture, enterprise sales playbook, program ROI measurement" },
    { segment: "Channel incentive specialists (ITA Group, BI Worldwide, 360insights)", avgFit: "78-86%", reason: "Revenue ops for enterprise programs, channel economics, customer success architecture" },
  ],
  highFrictionSegments: [
    { segment: "Loyalty platform vendors (Talon.One, Antavo, Capillary)", avgFit: "40-55%", reason: "Different buyer (CMO vs HR), different metrics (engagement vs recognition); limited GTM overlap" },
    { segment: "Pure prepaid/card issuing infrastructure (Pathward, Sutton, Galileo)", avgFit: "35-50%", reason: "Different consulting model; buyer is Treasury/Ops, not revenue ops" },
    { segment: "Consumer cashback/card-linked apps (Drop, Karat, Fluz)", avgFit: "30-45%", reason: "Consumer acquisition motion, not enterprise revenue ops" },
  ],
};

export const REWARDS_INCENTIVES_DISCOVERY = `
REWARDS & INCENTIVES DISCOVERY (Cambrian's core domain — use when prospect is in rewards, recognition, incentives, or loyalty):

REALITY:
- What use cases are your top 3 revenue drivers — recognition, research payouts, customer acquisition, channel incentives?
- How is customer acquisition distributed — direct vs partner vs self-serve vs embedded in vertical SaaS?

IMPACT:
- Where does the enterprise sales cycle stall — multi-stakeholder buying (IT, Finance, Tax), procurement, or use case alignment?
- What's your CAC and LTV by acquisition channel and customer tier? How is it trending QoQ?

VISION:
- Are you running vertical SaaS partnerships? How's the revenue flowing — meaningful or pilot-stage?
- How do you measure program ROI for your customers — standardized framework or ad hoc per customer?

ENTRY POINTS:
- How is compliance (tax, escheatment, fraud) handled — feature or cost center? Automating W-9/1099 or manual?
- Who are your top 5 customers by ARR? What verticals? How concentrated?

ROUTE:
- If you could solve one thing in your GTM in the next 6 months — channel attribution, enterprise deal velocity, vertical SaaS partnership ROI, pricing, or team structure?
- What's the competitive pressure from lower-margin entrants doing to your pricing strategy?
`;
