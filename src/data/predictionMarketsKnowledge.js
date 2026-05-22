// predictionMarketsKnowledge.js
// Auto-generated from prediction_markets_knowledge_layer.md
// High-risk / regulated industry knowledge layer

export const PREDICTION_MARKETS_PLAYBOOK = {
  name: "Prediction Markets",
  keywords: [
      "prediction market",
      "event contract",
      "Kalshi",
      "Polymarket",
      "CFTC",
      "DCM",
      "designated contract market",
      "binary options",
      "event derivatives",
      "sports event contracts",
      "federal preemption",
      "prediction exchange",
      "outcome market",
      "event wagering"
  ],
  personas: [
      "CEO",
      "CTO",
      "Chief Compliance Officer",
      "General Counsel",
      "Head of Government Affairs",
      "VP Product",
      "VP Engineering",
      "Head of Risk",
      "Head of Market Operations",
      "CFO"
  ],
  discovery: [
    "What regulatory or licensing constraints shape your vendor selection process?",
    "How do you currently handle compliance reporting and audit trails?",
    "What's your relationship with your banking/payments partners — is that stable?",
    "How do you evaluate new technology vendors given your regulatory environment?",
    "What's the biggest operational pain point that existing vendors can't solve because of your industry?",
  ],
  disqualifiers: [
      "No understanding of regulatory environment",
      "Treating this like a mainstream vertical",
      "No compliance posture or certifications"
  ],
  triggerEvents: [
      "New regulatory framework or rule change",
      "Banking relationship loss or gain",
      "State expansion or new market entry",
      "PE/VC funding round",
      "Compliance audit finding"
  ],
  compliance: [],
  usps: [],
  layerContent: `---
title: "Prediction Markets — Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_payment_rails_and_disbursements.md
  - cambrian_investor_intelligence.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_gaming_knowledge_layer.md
  - cambrian_crypto_stablecoin_knowledge_layer.md
  - cambrian_fintech_knowledge_layer.md
tags: [prediction-markets, event-contracts, Kalshi, Polymarket, CFTC, federal-preemption, sports-betting-adjacency, derivatives, DCM, DCO, regulated-industry, emerging-vertical]
last_updated: 2026-05-22
status: production
confidence: high (CFTC public actions; March 2026 Arizona criminal info against Kalshi; Congressional Research Service prediction markets report Feb 2026; SBA member positions; Polymarket and Kalshi disclosures)
---

# Prediction Markets — Knowledge Layer

> **Working thesis.** Prediction markets are the most consequential new vertical in U.S. financial services in 2025–2026, sitting at the intersection of (a) federal commodities-derivatives regulation (CFTC), (b) state-by-state gambling law, (c) sports betting (now the dominant use case), and (d) crypto-adjacent infrastructure. **The CFTC under the post-January-2025 leadership reversed prior posture and now permits sports event contracts on regulated DCMs.** Kalshi went from a niche election-prediction venue to processing **~$39.7B in traded volume over the trailing year through February 2026, with ~87% on sports**. Polymarket — operating offshore since 2022 — was acquired by ICE/NYSE parent Intercontinental Exchange (signaled) and is returning to the U.S. as a regulated entity. **State challenges are escalating: in March 2026 Arizona filed a 20-count criminal information against KalshiEX LLC.** The federal-vs-state preemption fight is now the dominant near-term legal question. For sales-relevant purposes this vertical is **structurally adjacent to fintech, gaming, and crypto** — many of the same buyers, partners, and infrastructure providers.

> **What makes prediction markets distinct.** Unlike sports betting (state-licensed, state-taxed, state-regulated under post-PASPA frameworks), prediction markets operate under **federal CFTC jurisdiction as event contracts** classified as swaps. That makes them legal nationwide *in principle* under federal preemption — a posture being aggressively tested by state attorneys general. The buyers, the use cases, and the GTM patterns are all different from licensed sportsbooks. **This is the first U.S. consumer-financial-services category to grow primarily through federal-state preemption litigation rather than legislative authorization.**

---

## Table of Contents

1. [Snapshot and market sizing](#1-snapshot-and-market-sizing)
2. [What makes prediction markets distinct](#2-what-makes-prediction-markets-distinct)
3. [Player landscape](#3-player-landscape)
4. [Regulatory framework — CFTC, state preemption, enforcement](#4-regulatory-framework--cftc-state-preemption-enforcement)
5. [Use cases and market categories](#5-use-cases-and-market-categories)
6. [Infrastructure and adjacent vendors](#6-infrastructure-and-adjacent-vendors)
7. [The sports-betting overlap and competitive collision](#7-the-sports-betting-overlap-and-competitive-collision)
8. [ICP patterns](#8-icp-patterns)
9. [Buying committee and decision dynamics](#9-buying-committee-and-decision-dynamics)
10. [Trigger events](#10-trigger-events)
11. [Common failure modes](#11-common-failure-modes)
12. [GTM implications for Cambrian seller-users](#12-gtm-implications-for-cambrian-seller-users)
13. [Cross-references to sister layers](#13-cross-references-to-sister-layers)

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| Kalshi trailing-12-month traded volume (through Feb 2026) | ~$39.7B |
| Kalshi sports as share of volume | ~87% |
| Polymarket 2024 single-month volume peak | ~$500M (August 2024 pre-election) |
| Polymarket regulatory status | Settled CFTC penalty 2022; offshore for U.S. users 2022–2025; **return path under regulated entity in process** |
| Kalshi regulatory status | **CFTC-registered Designated Contract Market (DCM) and Derivatives Clearing Organization (DCO)** |
| States with active criminal/civil actions vs. Kalshi (May 2026) | Arizona (March 2026 criminal info), Nevada, Massachusetts (cease-and-desist), New Jersey, Maryland, others |
| States where Kalshi sports unavailable (May 2026) | AZ, IL, MA, MD, MI, MT, NV, OH |
| Federal legislation status | Multiple bills introduced (Curtis/Schiff, Merkley/Raskin); none advanced beyond committee; market-implied probability of federal ban in 2026 ~11% |

### Headline industry dynamics

- **CFTC permissive shift (Feb 2025)** — Then-Acting Chair Caroline Pham's Feb 2025 press release called prior CFTC posture "a sinkhole of legal uncertainty and an inappropriate constraint on the new Administration." The agency withdrew event-contract ban proposals in Feb 2026.
- **DraftKings, Fanatics, FanDuel launched their own prediction-market platforms** — explicit recognition by sportsbook incumbents that they cannot ignore this category. BetMGM publicly committed to not launching one.
- **State-level enforcement is escalating** — Arizona's 20-count criminal information vs. KalshiEX LLC in March 2026 is the most aggressive single state action; it covers election wagering on 2028 presidential, 2026 AZ gubernatorial, 2026 AZ Secretary of State races, plus 16 sports/proposition counts
- **Arizona stripped Underdog of its DFS license in December over Underdog's relationship with Crypto.com's prediction market** — first time a state pulled a fantasy license over prediction-market ties
- **The federal preemption thesis remains untested at scale** — Kalshi argues CFTC registration preempts state gambling law; states are testing that argument in court

---

## 2. What makes prediction markets distinct

**1. They are regulated as derivatives, not as gambling.** Kalshi is a CFTC-registered Designated Contract Market (DCM) — the same regulatory category as CME Group's futures exchanges. Event contracts settle as binary "yes/no" outcomes. The CFTC officially designated these as "swaps" in early 2026, placing them under exclusive federal jurisdiction. **State gambling regulators have no clear authority over CFTC-regulated DCMs.** That is the legal moat — and the question being litigated.

**2. The use cases extend well beyond sports.** Sports volume now dominates, but the strategic case for prediction markets includes: (a) event-outcome hedging for businesses, (b) information aggregation / price discovery for journalism and forecasting, (c) corporate / governance event hedging, (d) macroeconomic and political risk hedging. The Congressional Research Service report (Feb 2026) framed the market as serving multiple legitimate uses, which is meaningful for the political conversation.

**3. The competitive collision with sports betting is the dominant near-term dynamic.** A licensed sportsbook in Illinois pays state taxes, complies with state advertising restrictions, has state-imposed responsible gambling obligations, and operates under a state license that can be revoked. A CFTC-regulated prediction market accepting Illinois users on sports event contracts does none of those things — by design. State sportsbook operators have spent decades and billions of dollars building the regulated framework prediction markets are now arguably circumventing. **That is why the sportsbook trade association (SBA) is escalating; that is also why DraftKings, Fanatics, and FanDuel launched their own prediction platforms — they cannot afford to lose share.**

---

## 3. Player landscape

### The major exchanges

| Platform | Status | Notable |
|---|---|---|
| **Kalshi** | CFTC DCM + DCO; HQ New York; founded 2018 by Tarek Mansour and Luana Lopes Lara | Won 2024 federal court case enabling election markets; ~$39.7B TTM volume through Feb 2026; 87% sports; unavailable in AZ, IL, MA, MD, MI, MT, NV, OH; facing AZ criminal action |
| **Polymarket** | Crypto-based; offshore for U.S. since 2022 CFTC settlement; signaled return under regulated entity; CEO Shayne Coplan | $500M August 2024 monthly volume peak; sports ~38% of contracts (less concentrated than Kalshi); broader event-contract diversity; deeply integrated with USDC |
| **PredictIt** | Academic / political-only; Victoria University of Wellington partnership | Long-standing election market; limited to political; small position sizes; legal status complicated |
| **Manifold Markets** | Play-money; community-driven | Not a real-money market; influential among forecasters |
| **Crypto.com Predict** | Crypto.com's prediction product | Adjacent to crypto exchange; subject to AZ Underdog action |
| **DraftKings Predict** | Sportsbook-launched prediction-market product | DraftKings hedging the disruption |
| **Fanatics Predict** | Same | Same logic |
| **FanDuel Predict** | Same | Same logic |
| **Hyperliquid (DeFi)** | Decentralized derivatives + prediction; Stripe's Bridge won USDH issuance | Crypto-native; mostly Asian volume |
| **ForecastEx** | CFTC DCM | Smaller; institutional-focused |

### Key people / public figures

- **Tarek Mansour** — Co-founder/CEO Kalshi; ex-Goldman; the public face of the regulated-DCM thesis
- **Luana Lopes Lara** — Co-founder/COO Kalshi
- **Shayne Coplan** — Founder/CEO Polymarket; crypto-native; raided by FBI Nov 2024 (election period); cleared
- **Caroline Pham** — Then-CFTC Acting Chair (Feb 2025) who shifted CFTC posture
- **Adam Greenblatt** — BetMGM CEO; SBA voice on sports-betting industry concerns
- **Senator Curtis (R-UT) / Schiff (D-CA)** — Prediction Markets Are Gambling Act sponsors
- **Senator Merkley (D-OR) / Rep. Raskin (D-MD)** — STOP Corrupt Bets Act sponsors

---

## 4. Regulatory framework — CFTC, state preemption, enforcement

### Federal layer

- **Commodity Exchange Act (CEA)** — the foundational statute; CFTC has exclusive jurisdiction over commodities derivatives
- **Section 5h of the CEA** and CFTC swap regulations — the framework under which event contracts are classified
- **Designated Contract Market (DCM)** — Kalshi's primary regulatory category; CFTC-supervised exchange
- **Derivatives Clearing Organization (DCO)** — Kalshi's clearing arm; ensures contract settlement
- **CFTC's pre-2025 posture** — restrictive; sought to ban event contracts on sports, elections, and certain political events as contrary to public interest
- **CFTC's 2025–2026 posture** — permissive; under Acting Chair Pham (Feb 2025) and subsequent leadership, the agency withdrew prior ban proposals and explicitly stated event contracts should be evaluated case-by-case
- **2026 designation of prediction markets as "swaps"** — formally placed them under exclusive federal jurisdiction

### State layer (the battle ground)

The state preemption question: does CFTC regulation of a DCM preempt state gambling enforcement?

- **Federal preemption thesis** (Kalshi's argument): CFTC jurisdiction over DCMs is exclusive; states cannot regulate CFTC-licensed entities offering federally-permitted products. Federal courts have provisionally accepted versions of this argument (Sept 2024 Judge Cobb ruling vacated CFTC's election-market block).
- **State gambling thesis** (Arizona, Nevada, Massachusetts, others): event contracts on sports outcomes are gambling regardless of federal regulatory label; states retain police power to regulate gambling within their borders.
- **Arizona March 17, 2026 action** is the most aggressive — a *criminal information* with 20 counts including election wagering and 16 sports/proposition betting counts. Arizona is testing whether a state can criminally prosecute a CFTC DCM.
- **Multiple other state cease-and-desist orders** (NV, MA, MD, others) — civil enforcement; Kalshi has voluntarily withdrawn from those states pending resolution.

### Federal legislative landscape (none advanced)

- **Prediction Markets Are Gambling Act** (Curtis-R-UT / Schiff-D-CA) — would prohibit CFTC-approved sports event contracts
- **STOP Corrupt Bets Act** (Merkley-D-OR / Raskin-D-MD) — broader prohibition on sports, elections, military outcomes
- **State preemption legislation** — none passed; one in Minnesota near Senate floor vote but facing federal preemption hurdle
- Polymarket-traded contract probability of federal ban by Dec 31, 2026: **~11%** (89% no)

### What sellers / vendors selling INTO prediction-market companies need to know

- Kalshi's "moat" is its DCM status — anything that supports DCM compliance, surveillance, KYC/AML, clearing, settlement infrastructure is sellable
- Polymarket's return path depends on becoming a U.S.-regulated entity — a procurement window for compliance, custody, and infrastructure
- New DCM entrants are forming or being acquired — prediction-market infrastructure is greenfield
- DCMs face the same surveillance requirements as futures exchanges: market manipulation monitoring, large trader reporting, insider-trading prevention

---

## 5. Use cases and market categories

### Sports

- **The dominant volume category** — 87% of Kalshi volume; 38% of Polymarket contract count
- Markets on every major U.S. sport plus international (soccer, cricket, F1)
- Player props, game outcomes, season-level (championships, MVPs), in-game live markets
- Direct competitor to state-licensed sportsbooks

### Elections and political events

- Kalshi's original 2024 election-market win (Cobb ruling) was the foundation moment
- Markets on presidential, congressional, gubernatorial, primary outcomes
- Significant traditional-media coverage of "election odds from prediction markets"
- The Arizona criminal information explicitly cites four election-wagering counts

### Economic and macro

- CPI/inflation readings, Fed rate decisions, unemployment numbers
- Niche but growing; institutional hedging use case
- Less politically controversial than sports/elections

### Corporate and event

- M&A deal closure, earnings beats/misses, IPO outcomes
- Tesla/SpaceX/major-public-company specific events
- Industry-watchers and traders; institutional hedging

### Pop culture and entertainment

- Oscar winners, Grammy winners, reality TV outcomes
- Lower volume but engagement-driving

### Weather and natural events

- Hurricane paths, regional weather outcomes
- CFTC-clear use case (commodity-adjacent)

### Public policy

- Legislative outcomes, court rulings, executive actions
- SAVE Act, immigration policy, judicial confirmations
- Information-aggregation value-add for journalism

---

## 6. Infrastructure and adjacent vendors

The B2B opportunity around prediction markets — vendors selling into Kalshi, Polymarket, ForecastEx, sportsbook prediction products, and aspiring new DCMs:

### Clearing and settlement
- Kalshi Klear (DCO) — internal
- Crypto-rail settlement infrastructure for Polymarket (Polygon, USDC)
- Third-party clearing prospects

### KYC / KYB / identity
- Persona, Alloy, Onfido, Veriff, Jumio, Socure — standard fintech identity stack
- Higher friction at on-boarding than typical sportsbook due to derivatives regulatory framing

### AML / sanctions / chain analytics
- Chainalysis, TRM Labs, Elliptic (for Polymarket-style crypto-based)
- Standard fintech AML stack

### Market surveillance and manipulation detection
- Eventus, NICE Actimize, Trillium, Solidus Labs (crypto-specialized)
- DCM-grade surveillance is mandatory

### Liquidity and market making
- Specialized crypto and prediction-market liquidity providers
- Cumberland (DRW), Jump, Wintermute (for crypto-based)

### Payments and on-ramps
- ACH and debit-card on-ramps for Kalshi
- Stablecoin (USDC/Polygon) on-ramps for Polymarket
- See Crypto and Payments knowledge layers

### Risk and treasury
- Treasury management software handling event-contract liability
- FX / hedging for international platforms

### Customer support and operations
- Standard fintech customer experience stack
- Compliance-aware ticketing

### Tax reporting
- 1099-B equivalents for U.S. customers
- Crypto tax reporting for Polymarket-style platforms

### Marketing and content
- Constrained category (state advertising restrictions vary)
- Sports media partnerships (similar to sportsbooks)
- Polymarket's pre-election media partnerships (notably with Bloomberg) are the marquee example

---

## 7. The sports-betting overlap and competitive collision

This dynamic is central to understanding 2026 prediction markets and is the most active source of regulatory and competitive friction.

### How they're similar
- Both let users wager money on sports outcomes
- Both use real-time pricing tied to event probability
- Both compete for the same retail dollars in the U.S.

### How they're different (the regulatory thesis)

| Dimension | State-licensed sportsbook | CFTC-regulated prediction market |
|---|---|---|
| Regulator | State gaming commission per state | Federal CFTC |
| Required licenses | Per-state operating license; partner with retail casino/tribe in most states | Single federal DCM registration |
| Tax | State excise tax (varies 5–51% of GGR) | Federal corporate tax only |
| Per-state availability | Only in legal states (currently ~30) | In principle: all 50 (state-by-state contestation) |
| Advertising restrictions | State-specific limits | Limited federal restrictions |
| Responsible gambling obligations | State-mandated (self-exclusion, deposit limits, problem-gambling hotlines) | Lighter; CFTC-mandated retail investor protections only |
| Identity / KYC | State licensing thresholds | Federal CEA-grade KYC |

### How the sportsbooks responded

- **DraftKings, Fanatics, FanDuel launched their own prediction-market platforms** (2025–2026) to hedge the disruption
- **BetMGM (Adam Greenblatt)** has not launched but is a public voice in the SBA
- **Penn / ESPN BET shut down December 2025** under the original PENN/ESPN partnership; the cited 10–20% market share target wasn't reached
- **The SBA is lobbying for federal legislation** to bring prediction markets under sports-betting-like state regulation

### The legalization-by-disruption argument

Industry voices (BetMGM CEO Greenblatt; sports-betting industry analysts) have publicly argued that prediction markets may **accelerate state legalization of sports betting** by demonstrating that the activity is happening anyway. Virginia and Georgia iGaming bills cited prediction-market activity as motivation. **If prediction markets push more states to legalize sportsbook activity, that's actually the long-term sportsbook industry interest — they want regulated, taxed, in-state market access more than they want to fight prediction markets in court.**

---

## 8. ICP patterns

### Best-fit Cambrian user-prospect: B2B fintech / compliance / market-infrastructure vendors selling into Kalshi, Polymarket, sportsbooks, and new DCM entrants

These are the buyers driving 2026 sales:
- **Surveillance and compliance** (Eventus, Solidus Labs, NICE Actimize, Trillium)
- **KYC / identity** (Persona, Alloy, Onfido)
- **Chain analytics** (Chainalysis, TRM, Elliptic)
- **Trading infrastructure** (order book, matching engine, market data)
- **Clearing and settlement infrastructure**
- **Payment / on-ramp providers** (especially stablecoin-rails for Polymarket-style)
- **Risk and treasury management software**
- **Liquidity provision / market making**
- **Tax reporting and 1099 generation**

### Cambrian's seller-users at prediction-market companies themselves

- Selling Kalshi/Polymarket/etc. to corporate clients, institutional hedgers, journalism partners
- Limited B2B-direct sales motion today; mostly retail-acquisition focused
- The institutional-hedging use case is the high-value future B2B segment

### Lower fit

- Pure retail-marketing tools (constrained by advertising restrictions)
- Generic e-commerce tools (regulatory specifics matter)

### Buyer profile

- Title: Chief Compliance Officer, Chief Risk Officer, Head of Market Operations, Head of Trading Infrastructure, General Counsel, CFO, Head of Surveillance
- Pain articulation: surveillance gap, KYC scale-up, manipulation detection, multi-state legal complexity, payment-rail dependability, tax reporting volume
- Buying behavior: small companies but rapidly scaling; sophisticated regulatory buyers; quick decision cycles because growth is breakneck

---

## 9. Buying committee and decision dynamics

| Role | What they care about |
|---|---|
| **Chief Compliance Officer / General Counsel** | DCM compliance, state-by-state defensibility, federal preemption posture, surveillance |
| **CTO / Head of Engineering** | Latency, scale, exchange infrastructure, market data |
| **Head of Trading / Market Operations** | Liquidity, market quality, manipulation prevention |
| **Chief Risk Officer** | Position limits, manipulation, treasury, contract design |
| **CFO** | Tax reporting, treasury, capital efficiency |
| **CEO / Founder** | Strategic direction; regulatory positioning; state-by-state market access strategy |
| **Head of Customer Operations** | KYC throughput, support load, geofencing for restricted states |
| **General Counsel** | Litigation strategy, state-level legal posture |

### Decision pattern

- These are 100–500 person companies; compact buying committees; founder-CEO often heavily involved
- Sales cycles short for compliance/infrastructure (60–120 days) because growth pressure is intense
- Sales cycles long for strategic infrastructure (clearing, custody) because regulatory implications are large

---

## 10. Trigger events

| Trigger | Implication |
|---|---|
| **Polymarket return-to-U.S. under regulated entity** | Massive procurement window for compliance and infrastructure |
| **State criminal/civil enforcement escalation** (Arizona, Nevada, MA, others) | Surveillance, geofencing, legal-strategy investment |
| **Federal preemption court ruling** | Definitive direction on state-vs-federal authority |
| **Federal legislation passage or definitive failure** | Long-term posture clarity |
| **New DCM registration** (other entrants seeking CFTC approval) | New buyer cohort |
| **Sportsbook (DraftKings/Fanatics/FanDuel) prediction-product expansion** | Different infrastructure needs than pure-play DCMs |
| **Major sports event (Super Bowl, March Madness, World Series)** | Volume spike — operational and surveillance stress test |
| **Major election cycle (2026 midterms, 2028 presidential)** | Volume spike — political-market controversy peak |
| **CFTC enforcement action** | Posture clarity on what's permitted |
| **Stablecoin / on-ramp regulatory shift** | Polymarket-style platforms most affected |

---

## 11. Common failure modes

1. **Treating prediction markets as a gambling vertical.** They are regulated as derivatives. The buyer vocabulary, regulatory framework, and compliance posture are all derivatives-and-fintech, not gambling.
2. **Ignoring the state-vs-federal dynamic.** A sales conversation that doesn't engage with federal preemption (or where the prospect sits on it) is missing the dominant strategic question.
3. **Conflating Kalshi and Polymarket.** Kalshi is U.S.-regulated, dollar-denominated, fully-onshore-compliance-focused. Polymarket is crypto-based, offshore-but-returning, USDC-denominated. Very different infrastructure and buyer needs.
4. **Missing the sportsbook competitive overlay.** Prediction markets and licensed sportsbooks are in active competitive collision. Buyers care which side a vendor is on.
5. **Underestimating surveillance and manipulation detection requirements.** A CFTC DCM has the same surveillance obligations as CME. Generic e-commerce or sportsbook fraud tools don't meet the bar.
6. **Over-indexing on election-market narrative.** Election markets are 1–2% of volume. Sports is 87%. The strategic story is sports.
7. **Pitching marketing/growth tools.** Prediction markets have severe state-specific advertising constraints similar to crypto and cannabis.
8. **Not understanding the "swaps" classification.** The 2026 CFTC swaps designation is the legal-status pillar. Not knowing this in a first call disqualifies.

---

## 12. GTM implications for Cambrian seller-users

### What sellers into prediction-market infrastructure need

- **Lead with regulatory specifics.** CFTC DCM status, surveillance grade, KYC throughput, federal preemption posture
- **Know the company's state-access strategy.** Which states are they live in, which are they fighting, which are they geofencing
- **Understand the sportsbook-overlap competitive context.** Whether the buyer is a pure-play DCM (Kalshi-style), a crypto-native platform (Polymarket-style), or a sportsbook-launched prediction product (DraftKings/Fanatics/FanDuel)
- **Speak fintech-derivatives, not gambling.** Order book, matching engine, market data, settlement, contract specification, position limits, surveillance, large trader reporting

### Cross-vertical lift

- **Gaming knowledge layer** is the natural sister doc — sports betting and prediction markets compete and increasingly overlap
- **Crypto knowledge layer** applies to Polymarket-style platforms
- **Fintech and payments layer** applies broadly
- **Investor intelligence layer** applies — Kalshi, Polymarket, ForecastEx have specific VC backers (Sequoia, a16z, Founders Fund, others)

### Joe's positioning note

Prediction markets is the most rapidly evolving regulatory vertical in 2026 — anyone selling here needs *current* knowledge, not 2023 frameworks. The CFTC's posture changed in February 2025; the DEA's didn't exist on this topic; the state-vs-federal preemption fight is unfolding monthly. Cambrian's value is keeping seller-users current on a fast-moving regulatory front.

The investor mapping is also distinct: Kalshi backers include Sequoia, Charles Schwab Ventures, Henry Kravis, others; Polymarket has been backed by Founders Fund, 1confirmation, others; sportsbook-launched prediction platforms route through the parent public companies. Each has a different investor narrative.

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cambrian_gaming_knowledge_layer.md\` | Sports betting overlap; competitive collision; sportsbook-launched prediction products |
| \`cambrian_crypto_stablecoin_knowledge_layer.md\` | Polymarket and crypto-native prediction markets use stablecoin rails |
| \`cambrian_payment_rails_and_disbursements.md\` | On/off ramps, ACH, stablecoin payouts to winners |
| \`cambrian_fintech_knowledge_layer.md\` | The infrastructure-and-compliance stack is fundamentally fintech |
| \`cambrian_investor_intelligence.md\` | VC-backed (Sequoia, Founders Fund, a16z); some publicly-backed via parent companies (DraftKings, Fanatics, FanDuel) |
| \`cambrian_approval_gates_knowledge_layer.md\` | Federal-preemption-vs-state-authority is the most distinctive approval gate dynamic in any vertical |

---

*End of layer. Update cadence: monthly. Critical re-check triggers: Arizona criminal proceeding outcomes, Polymarket return-to-U.S. announcement, federal legislative movement, new DCM approvals, major court rulings on federal preemption.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const PREDICTION_MARKETS_INJECTION = PREDICTION_MARKETS_PLAYBOOK.layerContent;
export const PREDICTION_MARKETS_SCORING = PREDICTION_MARKETS_PLAYBOOK.keywords.join(", ");
export const PREDICTION_MARKETS_DISCOVERY = PREDICTION_MARKETS_PLAYBOOK.discovery.join("\n");
