// src/data/rewardsIncentivesKnowledge.js
//
// Digital Rewards & Incentives deep knowledge layer.
// Cambrian Catalyst's CORE domain — Joe Galano's 15+ years at
// Blackhawk Network. Covers: B2B rewards, recognition, channel
// incentives, research payouts, embedded loyalty, compliance,
// distribution models, and economics.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const REWARDS_INCENTIVES_INJECTION = `
DIGITAL REWARDS & INCENTIVES CONTEXT (Cambrian's #1 domain — use when target or seller is in rewards, incentives, gift cards, recognition, loyalty, or prepaid):

MARKET SCALE: US gift card market $230B+, global B2B incentives $80B+, employee recognition $90B+, research payouts $5B+, channel incentives $50B+ globally. B2B incentives growing 3x faster than consumer.

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
- Most B2B platforms charge $0 software fees, monetizing through gift card margin (buy at discount, sell at face), FX spreads, and float
- Recognition platforms: $3-10/employee/month + reward fulfillment margin
- Pricing transparency is competitive issue — 10-20% margin platforms being undercut by lower-margin entrants
- Six capabilities required: catalog access, distribution infrastructure, compliance (tax/1099/escheatment/KYC), settlement, reporting, recipient experience

COMPLIANCE (critical — Cambrian knows this cold):
- Tax: W-9 collection, 1099-NEC/MISC ($600 threshold), W-2 inclusion for employee rewards, de minimis fringe
- Escheatment: state-by-state unclaimed property (3-5 year holding), closed vs open loop differences
- CARD Act: 5-year minimum gift card expiry; CA, NY, MD more restrictive
- KYC/AML/OFAC: required for larger payouts; cross-border sanctions screening
- Fraud: identity verification, bot detection critical especially in research payouts

2026 TRENDS:
- API-first delivery is table stakes (Tango, Tremendous, Giftbit all sell embedded APIs)
- Embedded rewards in vertical SaaS is fastest-growing motion (Toast, ServiceTitan adding reward features)
- Choice-based delivery ("recipient picks from menu") has won over single-brand
- Global/cross-border: 100+ countries with local-currency redemption now table stakes
- Consolidation: BHN acquired Tango (2022), Rybbon (2022); PE appetite high

CAMBRIAN'S EDGE: Joe's BHN background provides operator-level credibility. Every conversation starts from mutual recognition. This is the #1 vertical by domain expertise × addressable opportunity × competitive differentiation.
`;

export const REWARDS_INCENTIVES_SCORING = {
  highFitSegments: [
    { segment: "B2B rewards platforms (Tango competitors, Tremendous adjacent)", avgFit: "90-95%", reason: "Direct domain overlap — channel attribution, partner GTM, enterprise sales playbook are exact Cambrian deliverables" },
    { segment: "Vertical SaaS adding embedded rewards (Toast, ServiceTitan tier)", avgFit: "88-93%", reason: "Embedded rewards GTM, vertical SaaS partner channel, product monetization strategy" },
    { segment: "Recognition platforms (Achievers, Workhuman competitive set)", avgFit: "85-92%", reason: "HRIS partnership architecture, enterprise sales playbook, program ROI measurement" },
    { segment: "Channel incentive specialists (ITA Group, BI Worldwide, 360insights)", avgFit: "85-90%", reason: "Revenue ops for enterprise programs, channel economics, customer success architecture" },
  ],
  highFrictionSegments: [
    { segment: "Loyalty platform vendors (Talon.One, Antavo, Capillary)", avgFit: "55-70%", reason: "Different buyer (CMO vs HR), different metrics (engagement vs recognition)" },
    { segment: "Pure prepaid/card issuing infrastructure (Pathward, Sutton, Galileo)", avgFit: "45-60%", reason: "Different consulting model; buyer is Treasury/Ops, not revenue ops" },
    { segment: "Consumer cashback/card-linked apps (Drop, Karat, Fluz)", avgFit: "45-60%", reason: "Consumer acquisition motion, not enterprise revenue ops" },
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
