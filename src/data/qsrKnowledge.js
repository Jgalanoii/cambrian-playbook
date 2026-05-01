// src/data/qsrKnowledge.js
//
// QSR / Quick-Service Restaurant deep knowledge layer.
// Covers: fast food, fast casual, franchise dynamics, restaurant
// tech stack, loyalty/payments, delivery economics, PE/public/family
// ownership patterns, and unit-level economics.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const QSR_INJECTION = `
QSR / RESTAURANT INDUSTRY CONTEXT (use when target or seller is in restaurants, food service, QSR, or hospitality):

MARKET: ~200,000+ limited-service units in U.S. Leaders: Yum! Brands (~$60B systemwide), Restaurant Brands International (~$45B), Inspire Brands (~$32.6B). PE-consolidated: Roark Capital alone controls 112,000+ locations across 121 countries, $97B systemwide revenue.

FRANCHISE vs CORPORATE: Corporate locations run 25-30% restaurant-level margins; franchisees 8-15% EBITDA (after 5-6% royalty + 2-4% advertising fund). Creates parallel buying centers: brand HQ (standards, tech mandates, loyalty) + multi-unit franchisees (back-office, scheduling, inventory). Flynn Group, Sun Holdings operate 2,000+ units with independent procurement.

TECH STACK: POS (Toast ~24%, Square ~28%, Oracle MICROS, PAR Brink for enterprise). Loyalty (Punchh for Yum!, Paytronix for Panera/Five Guys, proprietary for Starbucks/McDonald's/Chick-fil-A). Order management (Olo powers 50% of public restaurant cos). Delivery (DoorDash ~67%, Uber Eats ~23%). Back-of-house (Crunchtime, Restaurant365, MarketMan). Payment orchestration (FreedomPay, Adyen, Stripe).

ECONOMICS: Per-store traffic declining despite loyalty member count doubling since 2019 (~39% of visits). Loyalty traffic grew 5% YoY while overall traffic fell 2%. Food cost + labor cost = largest controllable expenses; inventory discipline separates top-quartile from median by 2-4% margin points. PE portcos now require 10-12% EBITDA growth annually (vs historical 5%) given 8-9% borrowing costs.

DELIVERY ECONOMICS: Third-party effective commission 30-40% (headline 15-30% + promos + processing + refunds). Direct/first-party ordering via apps/websites is dominant GTM strategy — brands escape commission tiers. Starbucks stored-value loop (preloaded card breakage) is the gold standard.

2026 TRENDS: AI drive-thru voice (~95% accuracy vs 85% baseline), subscription models expanding (Panera Sip Club, Taco Bell Taco Lover's Pass), agentic commerce standards from Visa/Mastercard, 70% of PE firms mandate AI adoption with 12-month margin-impact requirements.

GTM: Enterprise sales cycles 9-18 months with mandatory pilots (5-25 stores, 60-180 days). POS integration is hard gate — every vendor must certify with Brink/Aloha/MICROS/Toast ISV. Capital structure determines buying: PE = EBITDA optimization, public = same-store sales, family office = multi-decade value.
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
