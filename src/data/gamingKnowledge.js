// gamingKnowledge.js
// Auto-generated from gaming_knowledge_layer.md
// High-risk / regulated industry knowledge layer

export const GAMING_PLAYBOOK = {
  name: "Gaming & Sports Betting",
  keywords: [
      "gaming",
      "sports betting",
      "iGaming",
      "online casino",
      "sportsbook",
      "DFS",
      "daily fantasy",
      "FanDuel",
      "DraftKings",
      "BetMGM",
      "Caesars",
      "Fanatics",
      "tribal gaming",
      "casino",
      "GGR",
      "gross gaming revenue",
      "handle",
      "wagering",
      "PASPA",
      "responsible gambling",
      "state licensing"
  ],
  personas: [
      "CEO",
      "CFO",
      "CTO",
      "VP Operations",
      "Head of Compliance/Regulatory",
      "VP Marketing",
      "Head of Payments",
      "General Counsel",
      "VP Player Experience",
      "Head of Risk/Fraud",
      "VP Government Affairs"
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
title: "Gaming — Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_payment_rails_and_disbursements.md
  - cambrian_investor_intelligence.md
  - cambrian_b2b_sales_value_creation.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_prediction_markets_knowledge_layer.md
  - cambrian_crypto_stablecoin_knowledge_layer.md
  - cambrian_qsr_knowledge_layer.md
tags: [gaming, sports-betting, iGaming, online-casino, DFS, daily-fantasy, FanDuel, DraftKings, BetMGM, Caesars, Fanatics, tribal-gaming, casino, regulated-industry, state-licensing, gambling]
last_updated: 2026-05-22
status: production
confidence: high (American Gaming Association 2025 data; CBS Sports state-by-state May 2026; iGaming Post April 2026; state regulator filings)
---

# Gaming — Knowledge Layer

> **Working thesis.** U.S. gaming in 2026 is a $200B+ annual revenue industry sitting on the largest regulatory expansion in its history. Sports betting (post-PASPA, 2018) is now legal in **30 states + D.C. + Puerto Rico**; iGaming (online casino) is legal in only **7 states**. **Regulated U.S. sportsbooks processed $165.58B in handle in 2025, generating $16.80B in gross gaming revenue, with $3.66B in state tax contributions**. The market is structurally concentrated: **FanDuel (43.6%) + DraftKings (36.4%) control ~80% of the U.S. online sports betting market**. BetMGM, Caesars, Fanatics, and bet365 split most of the rest; PENN/ESPN BET wound down in late 2025 after missing share targets. **The dominant 2026 dynamics are: (a) iGaming legalization battles in mid-tier states, (b) prediction-market competitive pressure on sportsbooks, (c) tribal gaming politics in California/Florida/Texas, (d) state tax rate spikes (Illinois progressive structure, New York at 51%), and (e) responsible-gambling and product-liability legal pressure.** For Cambrian's seller-users, this is a vertical with massive established players, sophisticated compliance and payments needs, and a fast-growing regulatory perimeter.

> **What makes gaming distinct.** Three things: (1) **state-by-state licensing fragmentation** — every state is a separate market with separate licenses, taxes, advertising rules, responsible-gambling obligations; (2) **tribal gaming overlay** — federally-protected tribal compacts often supersede or partially preempt state authority, with massive implications in California, Florida, and other states; (3) **the operator's economic model is GGR-based, not revenue-based** — handle (total wagers) is the top-line; GGR (gross gaming revenue) = handle minus winnings = the operator's revenue; hold rates ~5–10% for sports betting, 2–6% for iGaming. Pricing, marketing, and product investments are evaluated through GGR-per-state and state-tax-rate lens.

---

## Table of Contents

1. [Snapshot and market sizing](#1-snapshot-and-market-sizing)
2. [What makes gaming distinct as a sales target](#2-what-makes-gaming-distinct-as-a-sales-target)
3. [Sub-categorization — verticals within gaming](#3-sub-categorization--verticals-within-gaming)
4. [Major operators and competitive landscape](#4-major-operators-and-competitive-landscape)
5. [Regulatory overlay — state-by-state, tribal, federal](#5-regulatory-overlay--state-by-state-tribal-federal)
6. [Payments, banking, and responsible gambling](#6-payments-banking-and-responsible-gambling)
7. [Technology stack and B2B vendor landscape](#7-technology-stack-and-b2b-vendor-landscape)
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
| U.S. regulated sports betting handle (2025) | $165.58B |
| U.S. regulated sports betting GGR (2025) | $16.80B |
| U.S. national hold rate (2025) | 10.15% |
| State tax contributions from sports betting (2025) | $3.66B |
| Q1 2026 sports betting handle | $40.47B |
| Q1 2026 sports betting GGR | $3.82B |
| States with legal online sports betting (May 2026) | 30 + D.C. + Puerto Rico |
| States with legal iGaming (online casino) | 7 (NJ, PA, MI, WV, CT, DE, RI; Michigan record $278M iGaming revenue Oct 2025) |
| FanDuel market share (US online sports) | 43.6% |
| DraftKings market share (US online sports) | 36.4% |
| Combined Top 2 share | ~80% |
| Top 5 sports betting markets | NY, IL, NJ, OH, PA |
| New York sports betting state tax | $1.3B in 2025 (largest single state) |
| Illinois 2024 sports betting tax revenue | $162M (progressive tax structure favoring largest operators) |
| Highest state tax rates on sportsbook revenue | DE, OR, NH, NY, IL, RI (50%+) |
| Lowest state tax rates | IA, MI, NV (single digits) |
| Florida sports betting | Exclusive to Seminole Tribe (Hard Rock Bet) under tribal compact |

### Headline industry dynamics

- **Sports betting is now a mature category in legal states.** Volume and GGR continued to grow but at slowing pace; share is consolidating around the Top 2.
- **iGaming (online casino) is the growth vertical.** Where it's legal, iGaming GGR often exceeds sports betting GGR. Michigan: $278M iGaming vs. $74M sports betting October 2025.
- **PENN / ESPN BET wound down December 2025** after missing market share targets; cost PENN $150M/year + $1.5B cash; underscored the difficulty of cracking the FanDuel-DraftKings duopoly
- **California remains the great unattainable** — multiple ballot measures failed; tribal gaming interests retain veto power; no near-term path
- **Texas, Georgia, Alabama** — no legal sports betting; persistent legislative pushes; tribal and lottery dynamics complicate
- **Florida** — exclusive tribal compact with Seminole Tribe; no commercial operator access; Hard Rock Bet operates
- **Vermont and Wisconsin moves** — Vermont considering rollback bill (Stevens); Wisconsin legalized online sports betting April 2026 (no iGaming yet)
- **State tax-rate spikes** are the main 2025–2026 operator pain (NY 51%, IL progressive structure)
- **Responsible-gambling legal pressure** — Pennsylvania state court lawsuit alleges DraftKings and FanDuel addiction tactics; comparisons to "tobacco and cocaine"

---

## 2. What makes gaming distinct as a sales target

**1. The state-by-state license overlay is the single biggest operational complexity.** Every operating state requires a separate license, separate compliance regime, separate advertising rules, separate responsible-gambling requirements, separate consumer-protection obligations, and separate state taxes. **A "single-operator" in the U.S. is actually 30+ separate businesses sharing brand and technology.** Vendor selection often requires per-state approval; vendor licensing or registration in some states (NV gaming control board is the strictest).

**2. GGR economics and state-tax variance dominate every commercial decision.** A 51% tax on GGR in New York vs. 6.75% in Iowa means the same dollar of handle has dramatically different per-state profitability. Operators rationalize state presence based on tax structure, and the largest operators have publicly questioned NY and IL economics. Vendors selling into this space need to think GGR-first, not revenue-first, when pricing or pitching.

**3. Tribal gaming is a regulatory category of its own.** Federally-recognized tribes operate under tribal-state compacts negotiated under the Indian Gaming Regulatory Act (IGRA, 1988). Tribal gaming generates ~$40B+ annually nationally. The Seminole Tribe's Florida compact gives them exclusive online sports betting; California tribes effectively veto state legalization moves. **Selling into tribal gaming is a different sales motion** — requires understanding tribal sovereignty, the National Indian Gaming Commission (NIGC), gaming commissions of individual tribes, and tribe-specific procurement practices.

---

## 3. Sub-categorization — verticals within gaming

| Sub-category | Description | Major players |
|---|---|---|
| **Online sports betting (OSB)** | App-based sports wagering | FanDuel, DraftKings, BetMGM, Caesars, Fanatics, bet365, Hard Rock Bet (FL), BetRivers, Hard Rock Digital |
| **Retail / in-person sports betting** | Sportsbooks in casinos and partner locations | All of the above + state-specific operators |
| **iGaming / online casino** | Online slots, table games, live dealer | FanDuel Casino, DraftKings Casino, BetMGM Casino, Fanatics Casino, Caesars Palace Online, Golden Nugget Online, BetRivers Casino, others |
| **Retail / land-based casino** | Brick-and-mortar gaming floors | MGM Resorts, Caesars Entertainment, Wynn Resorts, Boyd Gaming, Penn Entertainment, regional operators |
| **Tribal gaming** | Tribal-state compact gaming | Seminole (Hard Rock), Pechanga, San Manuel, Mohegan Sun, Foxwoods, hundreds of others |
| **Daily Fantasy Sports (DFS)** | Skill-based fantasy contests | DraftKings DFS, FanDuel DFS, PrizePicks, Underdog Fantasy, Sleeper |
| **Pari-mutuel (racing)** | Horse racing wagering | TwinSpires, TVG, FanDuel Racing, NYRA Bets |
| **State lotteries** | Government-run | All 50 states have lotteries (varying products) |
| **Social casino / sweepstakes** | Free-to-play with cash redemption (legal gray) | Chumba Casino, LuckyLand Slots, Stake.us, McLuck — significant market |
| **Esports betting** | Wagering on professional esports | Subset of sportsbooks (in legal states); GG.BET, Rivalry |
| **Skill-based gaming / arcades** | Limited regulatory category | Smaller; ambiguous status |

### Adjacent verticals worth knowing

- **Game development and publishing** (mobile gaming, console, PC) — different industry; not in this layer
- **Esports leagues and teams** — separate from esports betting; OWL, LCS, CDL, etc.
- **Gambling addiction services** — payer/clinical adjacent

---

## 4. Major operators and competitive landscape

### Public sportsbook / iGaming operators (the dominant sales targets)

| Operator | Parent | Sportsbook share | iGaming presence | Notes |
|---|---|---|---|---|
| **FanDuel** | Flutter Entertainment (LSE/NYSE: FLUT) | 43.6% | Yes (NJ, PA, MI, WV, CT) | Market leader; integrated with TVG racing; massive marketing spend |
| **DraftKings** | DraftKings Inc. (NASDAQ: DKNG) | 36.4% | Yes (NJ, PA, MI, WV, CT) | #2 share; aggressive promo spend; launched DraftKings Predict |
| **BetMGM** | MGM Resorts (NYSE: MGM) + Entain (LSE: ENT) JV | mid-single-digit % | Yes (largest iGaming share of any single operator) | Strong iGaming; weaker sports share; **explicitly NOT launching prediction-market product** |
| **Caesars** | Caesars Entertainment (NASDAQ: CZR) | mid-single-digit % | Yes (Caesars Palace Online) | Loyalty-network strength (Caesars Rewards); national casino footprint |
| **Fanatics Sportsbook** | Fanatics Holdings (private) | mid-single-digit % | Yes (Fanatics Casino) | Fast-growing; product-led; sports-fan acquisition advantage; launched Fanatics Predict |
| **bet365** | Hillside Sports (UK private) | small % in US | No iGaming in US | UK-rooted; growing US presence |
| **Hard Rock Digital** | Seminole Hard Rock (Tribal) | Exclusive in FL | No (FL only) | Florida exclusive; expanding via partnerships |
| **BetRivers (Rush Street Interactive)** | RSI (NYSE: RSI) | small % | Yes (multiple states) | Regional operator |
| **theScore Bet** | Penn Entertainment | exiting | Exiting US online sports | Wound down 2025 |
| **ESPN BET** | Penn Entertainment / ESPN | Wound down Dec 1, 2025 | Ended | The PENN/ESPN partnership ended after missing market share targets |

### Land-based casino operators (B2B-adjacent)

- **MGM Resorts** (NYSE: MGM) — Vegas + BetMGM JV
- **Caesars Entertainment** (NASDAQ: CZR) — largest casino network
- **Wynn Resorts** (NASDAQ: WYNN) — Vegas + Macau
- **Boyd Gaming** (NYSE: BYD)
- **Penn Entertainment** (NASDAQ: PENN) — regional casinos; rebuilding digital strategy post-ESPN BET
- **Bally's** (NYSE: BALY)
- **Churchill Downs** (NASDAQ: CHDN) — racing + casinos + TwinSpires

### Tribal gaming (sales-relevant)

- **Seminole Tribe of Florida** — Hard Rock brand; Florida exclusive online sports betting
- **Pechanga Band of Luiseño Indians (CA)** — One of the largest tribal casinos
- **San Manuel Band of Mission Indians (CA)** — Yaamava' Resort & Casino
- **Mohegan Tribe (CT)** — Mohegan Sun
- **Mashantucket Pequot Tribe (CT)** — Foxwoods
- **Many others** — National Indian Gaming Commission oversees ~250+ tribes with gaming operations

### DFS operators

- **DraftKings DFS** — original product
- **FanDuel DFS** — original product
- **PrizePicks** — fast-growing player-prop-focused; **at greater regulatory risk due to relationships with Crypto.com, Kalshi, Polymarket prediction-market products** (per Arizona's December 2025 Underdog action precedent)
- **Underdog Fantasy** — Arizona stripped its DFS license in December over Crypto.com prediction-market relationship; signal for industry
- **Sleeper** — fantasy + DFS

### Recent market actions / trigger events

- **PENN/ESPN BET wound down Dec 1, 2025** — major industry signal
- **Wisconsin legalized online sports betting April 9, 2026** — Gov. Tony Evers signed
- **Vermont rollback proposal** (Stevens) — political pushback emerging
- **Arizona Underdog license revocation Dec 2025** — prediction-market-overlap consequence
- **Pennsylvania DFS/sportsbook product liability lawsuit** — alleging addiction tactics; tobacco/cocaine comparison

---

## 5. Regulatory overlay — state-by-state, tribal, federal

### Federal layer (limited)

- **PASPA (Professional and Amateur Sports Protection Act) — STRUCK DOWN 2018 by SCOTUS** in *Murphy v. NCAA*; opened state-by-state sports betting
- **UIGEA (Unlawful Internet Gambling Enforcement Act, 2006)** — prohibits financial transactions for illegal online gambling; relevant for payment processors
- **Wire Act** — federal law historically interpreted to prohibit interstate sports wagering communications; 2018 DOJ reinterpretation (then partial reversal) created uncertainty for multi-state pooling
- **IGRA (Indian Gaming Regulatory Act, 1988)** — governs tribal gaming; tribal-state compacts required for Class III gaming (slots, table games, sports betting); National Indian Gaming Commission (NIGC) oversight
- **No federal gaming regulator** for commercial gaming — state-by-state model
- **IRS** — wagering tax obligations (W-2G forms, withholding requirements)

### State layer (the dominant regulator)

Each state has its own gaming commission and regulatory framework:
- **New Jersey** — model regulator; DGE (Division of Gaming Enforcement)
- **Nevada** — strictest licensing standards (GCB / Nevada Gaming Commission); approval required for tech vendors, founders, large investors
- **New York** — high tax (51% on online sports betting GGR); restricted operator count
- **Pennsylvania** — large market; PGCB
- **Illinois** — progressive tax (higher rates on larger operators)
- **Florida** — Seminole tribal exclusivity for online; commercial casinos limited
- **California** — tribal exclusivity de facto; no online sports betting

### State licensing requirements typical for B2B vendors

Selling into the gaming industry as a B2B vendor often requires:
- **Vendor registration** in many states (NJ, PA, others)
- **Gaming supplier license** for material vendors (NJ, NV especially)
- **Background investigations** for key personnel and major investors
- **Continuous reporting** of material changes
- **State-specific operational requirements** (data residency, audit-readiness)

**Nevada is the strictest.** A vendor without Nevada Gaming Control Board approval cannot serve Nevada operators in many product categories. Background investigations can take 12+ months.

### Tribal gaming compliance

- **Tribal-state compacts** — negotiated between each tribe and the state
- **Tribal gaming commissions** — separate from state regulators; tribes regulate themselves
- **NIGC** — federal oversight; minimum internal controls (MICS)
- **Class I (social), Class II (bingo + bingo-derived), Class III (slots, table games, sports betting)** — different regulatory treatment

### Responsible gambling requirements

State-mandated:
- Self-exclusion programs
- Deposit limits
- Time-out functionality
- Problem-gambling hotline (1-800-GAMBLER) referrals
- Advertising restrictions ("must be 21+" disclaimers, no targeting minors)
- Marketing avoidance during certain windows (e.g., during games in some states)

---

## 6. Payments, banking, and responsible gambling

### Payment methods in legal U.S. gaming

| Method | Adoption | Notes |
|---|---|---|
| Debit card | Dominant | Visa/MC debit; PIN debit; bank-account-linked |
| ACH / pay-by-bank | Growing | Lower fees; popular for higher-value players |
| PayPal | Major | Widely accepted; high reach |
| Online banking (eCheck) | Common | Direct bank login |
| Prepaid cards (Play+) | Common | Operator-branded prepaid; closed-loop |
| Cash at cage / retail | Common | Land-based + retail funded online accounts |
| Wire transfer | Large players | High-roller deposit/withdrawal |
| Cryptocurrency | Limited (state-dependent) | Most regulated U.S. operators do not accept; some social-casino does |
| Credit card | Limited | Many operators disabled credit cards over responsible-gambling concerns; banned in some states |

### Payments stack vendors

- **Worldpay** — major gaming payments processor
- **Nuvei** — gaming-focused payments specialist
- **Fiserv** — payments and processing
- **Sightline Payments** — gaming-specific payments; cashless wagering at land-based casinos
- **VIP Preferred (Global Payments)** — eCheck specialist in gaming
- **TrustlyPay / Trustly** — pay-by-bank specialist; large in gaming
- **Stripe** — increasing presence
- **Play+** — operator-branded prepaid issued by various processors

### Responsible gambling vendors

- **GeoComply** — geolocation compliance (mandatory for online gaming; verifies user is in legal state)
- **OneSpan** — identity and security
- **Mindway AI** — responsible gambling AI / problem-gambling detection
- **GamCare / Gambling Therapy** — counseling and support partnerships
- **iCare (BetMGM)** — proprietary responsible-gambling program
- **MyPlayBreak / TimeOut** — self-exclusion services
- **Sportradar Integrity Services** — match-fixing detection

### KYC / fraud / compliance

- **Jumio, Onfido, Persona, Socure, Veriff** — identity verification
- **Sift, Forter, Riskified** — fraud detection
- **NICE Actimize, Featurespace** — AML and transaction monitoring
- **Genius Sports, Sportradar** — sports data + integrity

---

## 7. Technology stack and B2B vendor landscape

### Sportsbook / iGaming platform technology

- **In-house** — FanDuel, DraftKings, BetMGM (Entain platform), Caesars (William Hill / Liberty Interactive stack)
- **Kambi** — major B2B sportsbook platform (multiple operators; spinoff from Kindred Group)
- **Sportradar** — odds, data, integrity, B2B platform components
- **Genius Sports** — sports data, official league data, B2B
- **Scientific Games / Light & Wonder** — gaming content (slots, table games) and platforms
- **Aristocrat** — gaming content
- **IGT** — gaming systems, lottery, content
- **Evolution** — live dealer / live casino dominant supplier
- **Pragmatic Play** — slots content
- **NetEnt** (Evolution-owned) — slots
- **GAN** — B2B iGaming platform
- **Bragg Gaming** — B2B content and platform
- **OPTX, OPTX Gaming** — casino marketing intelligence
- **Geocomply** — geolocation (effectively mandatory)
- **EveryMatrix** — B2B platform for emerging operators

### Casino management systems

- **IGT Advantage** — casino management dominant
- **Konami SYNKROS** — casino management
- **Acres Manufacturing** — casino patron management
- **Light & Wonder iView** — interactive displays
- **Agilysys** — casino property management

### Sales-relevant B2B verticals adjacent to gaming

| Vendor category | Examples |
|---|---|
| Customer experience / CDP | Salesforce, Adobe, Optimove, Bloomreach |
| Marketing tech | Braze, Iterable, gaming-specialized vendors |
| Loyalty | Caesars Rewards (in-house), MGM Rewards (in-house), Comp engines |
| Fraud and risk | Sift, Forter, Featurespace, Riskified |
| Customer support | Zendesk, Intercom, gaming-vertical specialists |
| Treasury / payments | Sightline, Worldpay, Nuvei, VIP Preferred |
| Compliance | NICE Actimize, Featurespace, iCare, GeoComply |
| Data / analytics | Snowflake, Databricks, gaming BI vendors |
| Sports content / data | Sportradar, Genius Sports, Stats Perform |
| Affiliate marketing | Income Access, Optimove, gaming-affiliate networks |

---

## 8. ICP patterns

### Best-fit Cambrian user-prospect: B2B fintech/compliance/martech vendors selling into Tier 1–2 operators

These are the buyers:
- **Compliance and KYC** — every operator needs constant identity/AML upgrade
- **Geolocation** — GeoComply dominant but the category has constant scaling demand
- **Responsible gambling** — escalating regulatory and litigation pressure; mandatory vendor category
- **Customer experience / CDP** — operator marketing teams reinvest constantly
- **Loyalty / retention** — competitive differentiation in a duopoly market
- **Payments innovation** — pay-by-bank, prepaid, cashless innovations
- **Fraud and risk** — sophisticated, always-on
- **Data and analytics** — modern data stack in gaming is large
- **Sports data and content** — Sportradar/Genius Sports/Stats Perform competitive landscape

### Smaller / regional / DFS

- **PrizePicks, Underdog, Sleeper** — fast-growing DFS; particularly exposed to prediction-market regulatory crossfire
- **Regional sportsbook operators** in single-state markets
- **Tribal gaming operations** — high-touch, relationship-based, sovereignty-aware sales

### Land-based casino operators

- Different buyer profile; longer cycles; loyalty and patron-management heavy
- Marketing and CRM modernization is the active investment theme

### Tier 1 sportsbooks (FanDuel, DraftKings, BetMGM, Caesars, Fanatics)

- Sophisticated procurement
- Long sales cycles (6–18 months)
- Reference logos massively valuable across vertical
- Often single-tenant deployments

### Lower fit

- Social casino / sweepstakes — different regulatory category; faster cycles but smaller per-deal ACV
- Esports betting — limited size

### Buyer profile

- Title: VP Compliance, Chief Compliance Officer, Head of Payments, VP Product, Chief Risk Officer, Head of CRM, Head of Acquisition, Chief Marketing Officer, Head of Sports Operations
- Pain articulation: state license operational burden, GGR margin compression in high-tax states, prediction-market competitive pressure, responsible-gambling regulatory escalation, customer-acquisition cost increases, churn
- Buying behavior: enterprise procurement; state-licensing review for material vendors; multi-stakeholder; 6–12 month cycles typical

---

## 9. Buying committee and decision dynamics

| Role | What they care about |
|---|---|
| **Chief Compliance Officer / Head of Regulatory** | State licensing, AML, responsible gambling, advertising compliance |
| **Head of Product** | Customer-facing UX, time-to-launch in new states |
| **Head of Operations / COO** | Multi-state operational consistency |
| **Chief Marketing Officer** | Customer acquisition cost, lifetime value, loyalty |
| **Head of Sports / Head of Casino** | Vertical-specific product evolution |
| **Chief Risk Officer** | Fraud, integrity, geolocation, market manipulation |
| **CFO / Treasurer** | Payment processing economics, treasury, state tax planning |
| **General Counsel** | State licensing, contract structure, regulatory exposure |
| **CISO** | Data security, PII handling, breach risk |
| **Vendor relations / Procurement** | Vendor licensing status, contract structure, master services agreements |

### Decision pattern

Tier 1 sportsbooks: full procurement process; vendor licensing review; legal review; security review; pilot/POC; multi-state rollout. 6–18 months typical.

Tier 2 / regional / DFS: tighter committee; 60–180 days.

Tribal: tribal council + tribal gaming commission + tribe-specific procurement. Relationships matter immensely. Trust takes time to build. 6+ months typical.

---

## 10. Trigger events

| Trigger | Implication |
|---|---|
| **New state legalization** (Wisconsin online sports betting April 2026; Virginia iGaming progress; Texas/California future) | Major procurement window for vendors with state-licensing capability |
| **Prediction-market competitive escalation** | Operators investing defensively in product, marketing, lobbying |
| **State tax-rate change** (NY, IL especially) | Operators reconsidering state presence; vendor cost reviews |
| **Major operator winddown** (ESPN BET 2025) | Vendor displacement opportunity |
| **Tribal compact renegotiation** | New tribal-state market dynamics |
| **Major sports event** (Super Bowl, March Madness, World Series) | Operational stress test; surveillance and capacity buys |
| **Responsible-gambling regulatory escalation** | Mandatory vendor cycle |
| **Product-liability litigation** (Pennsylvania case 2026) | Defense-spend cycle; responsible-gambling vendor demand |
| **Affiliate-marketing rule changes** | Marketing-tech buyers reconsidering |
| **Sportsbook M&A** | Vendor displacement / consolidation |

---

## 11. Common failure modes

1. **Treating "gaming" as a single market.** Sports betting, iGaming, DFS, tribal, retail casino are all very different. Generic gaming-vertical pitches fall flat.
2. **Ignoring state licensing requirements.** A vendor that doesn't know which states it can serve cannot win a Tier 1 conversation.
3. **Pitching to the wrong sub-vertical.** FanDuel iGaming is a different sale than FanDuel sports betting.
4. **Underestimating Nevada.** Nevada Gaming Control Board is the strictest licensing regime in the world. Many vendors voluntarily exclude Nevada to avoid the 12+ month investigation.
5. **Ignoring tribal sovereignty.** Selling into tribal gaming requires deference, patience, and tribe-specific procurement awareness. Showing up like a generic SaaS sale is a disqualifier.
6. **Pitching ad-tech without state restrictions awareness.** Each state restricts gambling advertising differently. "Generic ad-tech" doesn't fit.
7. **Missing the GGR vs. handle vocabulary.** Operators talk in GGR margins, hold rates, and state-tax-adjusted economics. A vendor that says "you'll save $X" without GGR framing is amateur.
8. **Discounting prediction-market disruption.** Every sportsbook (other than BetMGM publicly) launched their own prediction-market product. The competitive landscape is shifting.
9. **Overestimating the "loyalty" play.** FanDuel and DraftKings dominate on product and acquisition; loyalty is real but it's not unseating the duopoly.
10. **Ignoring responsible-gambling litigation pressure.** The Pennsylvania case and similar suits will reshape product and marketing.

---

## 12. GTM implications for Cambrian seller-users

### What sellers into gaming need

- **Sub-categorize the ICP precisely.** Tier 1 sportsbook vs. Tier 2 vs. regional vs. tribal vs. iGaming-specialist vs. DFS — each is a different sale
- **Know state licensing status.** What states does the operator hold licenses in; does the vendor's product require its own licensing
- **Speak GGR and state-tax-adjusted economics.** Not "revenue" — GGR.
- **Know the prediction-market overlay.** Whether the operator has launched a prediction product, how it's positioning vs. Kalshi/Polymarket
- **Reference the right trigger event.** Wisconsin legalization, Vermont rollback, NY tax debate, etc.

### Cross-vertical lift

- **Prediction markets** — sister doc; competitive collision and increasingly product overlap
- **Crypto and stablecoin** — emerging payments adjacency in some gaming sub-verticals
- **Payments / fintech** — gaming has the most sophisticated payments stack of any consumer industry
- **QSR** — adjacent loyalty/CRM patterns; multi-location operations
- **Approval gates** — state licensing review is a domain-specific gate

### Joe's positioning note

Gaming is *not* a vertical Joe has prior operating experience in, but the regulatory-overlay + state-by-state-licensing + payments-sophistication pattern is highly analogous to cannabis (without the federal-illegality) and to digital incentives (with the state MTL layer replaced by gaming licensing). The fintech-and-compliance muscle is the same.

The investor mapping is particularly important: FanDuel (Flutter, LSE/NYSE), DraftKings (NASDAQ), Caesars (NASDAQ), MGM (NYSE), Penn (NASDAQ) are all public — public-company investor archetype applies. Tribal operators are private and non-traditional buyers. Fanatics is private-but-mega-funded. Each operator class has a distinct investor narrative.

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cambrian_prediction_markets_knowledge_layer.md\` | The dominant 2026 competitive dynamic; sportsbooks launching prediction products |
| \`cambrian_payment_rails_and_disbursements.md\` | Gaming has the most sophisticated consumer payments stack |
| \`cambrian_crypto_stablecoin_knowledge_layer.md\` | Emerging payments adjacency; sweepstakes operators (Stake.us, etc.) using crypto |
| \`cambrian_investor_intelligence.md\` | Public operators (Flutter, DKNG, MGM, CZR, PENN, BYD, BALY, RSI); private mega-funded (Fanatics); tribal (sovereign) |
| \`cambrian_approval_gates_knowledge_layer.md\` | State licensing review is a category-defining approval gate |
| \`cambrian_qsr_knowledge_layer.md\` | Multi-location operations and loyalty patterns translate from QSR |
| \`cambrian_b2b_sales_value_creation.md\` | Selling into Tier 1 operators is a textbook enterprise GTM motion |

---

*End of layer. Update cadence: quarterly; faster during active state legalization cycles. Critical re-check triggers: new state legalization, Tier 1 operator earnings, prediction-market regulatory rulings affecting sports, responsible-gambling litigation outcomes, tribal compact renegotiations.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const GAMING_INJECTION = GAMING_PLAYBOOK.layerContent;
export const GAMING_SCORING = GAMING_PLAYBOOK.keywords.join(", ");
export const GAMING_DISCOVERY = GAMING_PLAYBOOK.discovery.join("\n");
