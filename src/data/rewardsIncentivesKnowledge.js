// src/data/rewardsIncentivesKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
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
// - Mordor Intelligence, US Gift Card and Incentive Card Market (2025-2030)
// - GlobeNewswire, US Gift Card Business and Investment Report 2026
// - SkyQuest, B2B Gift Card Market (2025-2033)
// - Incentive Research Foundation (IRF) 2025 Outlook
// - Straits Research, Employee Recognition Market 2025
// - Awardco press release, Series B $165M (May 2025)
// - Allied Market Research / Grand View Research, Digital Gift Card Market
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (peer-reviewed / gov data) + Tier 2 (industry body, dated & sourced).
//   - No Tier 3 (named current execs, company-specific current financials/investors).
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const REWARDS_INCENTIVES_INJECTION = `
DIGITAL REWARDS & INCENTIVES CONTEXT (Cambrian's #1 domain — use when target or seller is in rewards, incentives, gift cards, recognition, loyalty, or prepaid):

---

## 1. Snapshot and market sizing

MARKET SCALE:
- US gift card & incentive card market: $230B (2025), projected $288B by 2030 at 6.8% CAGR [verified 05/2026, Mordor Intelligence]. By another estimate, $230B (2025) growing to $321B by 2030 [verified 05/2026, GlobeNewswire / ResearchAndMarkets].
- Global B2B gift card market: $24B (2025), projected $37B by 2033 at 5.7% CAGR [verified 05/2026, SkyQuest].
- Global B2B incentives (all forms): $80B+ [verified 05/2026, Incentive Research Foundation].
- Employee recognition software: $20-22B globally (2025), projected $45-48B by 2033 at 9-10% CAGR [verified 05/2026, SkyQuest / Future Market Insights].
- Research payouts: $5B+ [verified 05/2026, Greenbook GRIT Report].
- Channel incentives: $50B+ globally [verified 05/2026, Incentive Research Foundation].
- B2B incentives growing 3x faster than consumer [verified 05/2026, IRF 2025 Outlook].
- Digital/API delivery now ~62% of B2B incentive volume, up from ~38% five years ago [verified 05/2026, IRF 2025 / Cambrian operator knowledge].
- Average North American B2B gift card denomination climbed to $193 in 2025, up from $142 prior year [verified 05/2026, IRF 2025].
- 70% of North American firms anticipate moderate-to-significant increases in 2026 B2B incentive usage [verified 05/2026, IRF 2025].

THE MACRO THESIS: The value migration is FROM physical retail distribution and manual fulfillment TO API-first, embedded, cross-border digital delivery. This migration underpins every growth play and M&A thesis in the vertical.

---

## 2. What makes this vertical distinct as a sales target

Three things shape every rewards/incentives B2B sale and a Cambrian seller must internalize them:

**1. The multi-buyer problem is THE defining GTM challenge.** The same underlying product (a digital gift card, a reward, a payout) is purchased by HR (recognition), Marketing (customer acquisition/referral), Research (participant incentives), Sales/Channel (SPIFFs), and IT/Procurement (compliance evaluation). Each buyer has different KPIs, different budget authority, different procurement process, and different success metrics. A platform that sells to all five must maintain five distinct value propositions, five ROI narratives, and five champion-building motions. Most platforms lead with one buyer and struggle to cross-sell to the others. This multi-buyer reality means the same $50M-revenue platform can have wildly different competitive sets depending on which buyer they're serving.

**2. The economics are hidden in the margin stack, not in software fees.** Most B2B rewards platforms charge $0 in software fees. Revenue comes from gift card margin (buy at 3-12% discount from brands, sell at face value), FX spreads on cross-border delivery, float on unspent balances, and breakage on unredeemed value. This means: (a) pricing transparency is a competitive weapon — lower-margin entrants undercut incumbents not on software price but on reward-cost transparency, (b) the "free" platform is never free — the economics are just opaque, and (c) a seller who understands this margin stack can have a fundamentally different discovery conversation than one who treats these as SaaS companies.

**3. Compliance is the moat, not the feature.** Tax reporting (1099-NEC/MISC), escheatment (state-by-state unclaimed property), CARD Act (5-year minimum expiry), KYC/AML/OFAC for larger payouts, and cross-border sanctions screening are table-stakes compliance requirements. Platforms that automate these — especially W-9 collection and 1099 filing at scale — have structural switching costs. But every platform claims "compliance" — the operator-level question is: "At what scale does your compliance automation break?" That's the discovery question that separates Cambrian users from generalists.

---

## 3. Sub-categorization of buyer segments

The "rewards and incentives" industry is six adjacent buyer segments with different economics, competitive sets, and GTM motions:

| Buyer Segment | What They Buy | Budget Authority | Key Metric |
|---|---|---|---|
| **HR / People Ops** | Employee recognition platforms (Achievers, Workhuman, Awardco, Bonusly) | CHRO / VP People | Employee engagement scores, retention, eNPS |
| **Marketing** | Customer acquisition, referral programs, loyalty program rewards | CMO / VP Growth | CAC, referral conversion, program ROI |
| **Research / Insights** | Participant incentive platforms for surveys, UX research, clinical trials | VP Insights / Research Director | Response rate, completion rate, cost per complete |
| **Sales / Channel** | SPIFFs, channel incentives, partner rewards, sales contests | CRO / VP Channel | Partner activation, deal registration, channel revenue |
| **IT / Procurement** | Platform evaluation for compliance, integration, security | CIO / CPO | SOC 2, API reliability, tax automation, vendor consolidation |
| **Finance / Tax** | 1099 reporting, escheatment compliance, audit-readiness | CFO / Controller | Audit findings, filing accuracy, regulatory exposure |

**Sub-segment within HR:** Employee recognition platforms ($3-10/employee/month + reward fulfillment) are distinct from ad hoc employee rewards (one-time gift card sends via Tremendous/Tango). The former is an annual contract with HRIS integration; the latter is a self-serve transactional tool. Different buyer, different ACV, different churn profile.

---

## 4. Major companies (named, with market positions)

### Infrastructure / Aggregators
- **Blackhawk Network (BHN)** — The 800-lb gorilla. 1,000+ brand catalog, 244,000+ retail locations, 19 acquisitions to date (avg ~$132M) [verified 05/2026, Tracxn / BHN corporate site]. Owns Tango Card (acquired Jan 2024), Achievers, Rybbon. PE-owned (Silver Lake/P2 since 2018 take-private at $3.5B). GTCR in advanced talks to acquire at $4-5B [verified 05/2026, Private Equity Wire July 2025]. Dual position: physical retail distribution + B2B digital via Tango/Achievers.
- **InComm Payments** — Second-largest US prepaid distributor. Strong in retail activation, bill pay, healthcare payments. Less B2B API-focused than BHN.
- **Fiserv (Money Network)** — Payments infrastructure giant with prepaid/stored value capabilities. Enterprise-grade but not specialist.
- **Givex** — Canadian-origin; gift card processing, POS, loyalty for hospitality/retail.

### B2B Rewards Platforms (API-first delivery)
- **Tango Card / BHN Rewards** — Now part of BHN. Leading B2B rewards API. 1,000+ brand catalog, strong in research payouts and HR rewards.
- **Tremendous** — 20,000+ organizations, billions in rewards delivered, 2,000+ payout methods across 230+ countries [verified 05/2026, Tremendous corporate site]. Zero software fees; monetizes on card margin. API-first. Strong in research payouts, employee rewards, and marketing incentives. $770K disclosed funding (lean operation) [verified 05/2026, PitchBook].
- **Runa** (fka WeGift) — $65M total funding over 10 rounds [verified 05/2026, Tracxn]. Acquired by Staples. Digital value infrastructure — payout links, instant global payouts. White-label solutions launched 2025. Expanding into India.
- **Tillo** (fka Reward Cloud) — Brighton, UK. 3,000+ global brands via plug-and-go API [verified 05/2026, G2]. Strong in UK/EU markets. Founded 2016.
- **Giftbit** (MTN/Giftbit) — Canadian. API-based digital gift card delivery. Lean, developer-focused.
- **Xoxoday** — India-headquartered. Plum (rewards), Compass (incentives), Empuls (engagement). Strong in APAC, expanding US.
- **Giftogram** — Simpler self-serve digital gift card platform for SMB/mid-market.
- **Reward Gateway** (Edenred) — Employee engagement platform with recognition, rewards, communications. Acquired by Edenred.

### Employee Recognition Platforms
- **Achievers** (BHN) — ~11% global market share [verified 05/2026, Future Market Insights]. 65%+ adoption across multinational enterprises. HRIS integrations.
- **Workhuman** — ~14% global market share [verified 05/2026, Future Market Insights]. 72%+ enterprise client retention. Social recognition model. Peer-to-peer recognition pioneer.
- **Awardco** — Raised $165M Series B (March 2025), surpassed $1B valuation — unicorn status [verified 05/2026, PR Newswire / Awardco]. $235M total funding. Amazon Business integration for reward redemption. Fastest-growing in category.
- **Bonusly** — Peer-to-peer recognition with point-based system. Strong SMB/mid-market. Fun, lightweight UX.
- **O.C. Tanner** — Culture Cloud platform. Legacy enterprise player (founded 1927). Deep in manufacturing, healthcare, large enterprise.
- **Fond** (WorkTango) — Recognition and perks. Mid-market focus.
- **Inspirus** (Sodexo) — Enterprise recognition. Part of Sodexo benefits ecosystem.

### Loyalty Platforms (adjacent — different buyer, included for completeness)
- **Talon.One** — Promotion engine for loyalty, coupons, referrals. API-first. CMO buyer.
- **Antavo** — Enterprise loyalty platform. Source of the 74% disengagement cliff statistic.
- **Yotpo** — E-commerce loyalty + reviews + SMS. Shopify ecosystem.
- **Marigold** (Cheetah Digital) — Loyalty, messaging, personalization.
- **Capillary Technologies** — India-origin, APAC-strong loyalty platform.

### Card-Linked Offers and Specialized
- **Cardlytics** (NASDAQ: CDLX) — Bank channel card-linked offers. Partners with major FIs.
- **Augeo** — Loyalty and engagement across employee, channel, and customer.
- **Rewards Network** — Restaurant-focused card-linked offers.

### Channel Incentive Specialists
- **ITA Group** — Full-service channel incentive programs, events, engagement. Enterprise.
- **BI Worldwide** — Channel incentives, recognition, loyalty. Maritz-adjacent.
- **Maritz** — Legacy incentive and travel company. Enterprise programs.
- **Madison Performance** — Channel incentive program management.
- **360insights** — Channel incentive management SaaS. PE-backed.

---

## 5. Regulatory overlay

### Tax compliance
- **1099-NEC/MISC**: $600 threshold triggers reporting for non-employee rewards [verified 05/2026, IRS Publication 15-B]. W-9 collection required.
- **W-2 inclusion**: Employee rewards above de minimis fringe ($25-75 range, IRS guidance) must be included as taxable income.
- **De minimis fringe**: Small, infrequent rewards (branded company merchandise, occasional meals) excluded from income. Gift cards are NEVER de minimis per IRS — always taxable.
- **International tax**: varies by jurisdiction; many platforms handle local tax withholding in 100+ countries.

### Escheatment (unclaimed property)
- State-by-state unclaimed property laws with 3-5 year holding periods [verified 05/2026, NAUPA guidelines].
- Closed-loop gift cards (single-retailer) vs. open-loop (Visa/MC prepaid) have different escheatment treatment.
- California, New York, Maryland most restrictive.
- Compliance requires tracking by recipient state of residence, not issuer state.

### CARD Act and prepaid regulation
- 5-year minimum gift card expiry [verified 05/2026, CARD Act 2009 / Reg E].
- California: no expiry, no fees on gift cards.
- New York, Maryland: more restrictive than federal floor.
- Inactivity fees restricted (cannot impose within 12 months of purchase or last activity).

### KYC/AML/OFAC
- Required for larger payouts (typically $600+).
- Cross-border sanctions screening mandatory for international delivery.
- OFAC SDN list checking required for all US-originating payouts.
- FinCEN BSA requirements apply when platforms hold or transmit funds.

### Fraud and identity
- Bot detection critical in research payouts — fake survey completions are the #1 fraud vector.
- Identity verification required at scale for high-value payouts.
- Duplicate recipient detection across programs.
- ESOMAR 37 (2025 edition) now explicitly addresses participant validation, fraud prevention, and incentive changes mid-fielding [verified 05/2026, ESOMAR]. AAPOR endorses ISO Standard 20252 (200+ certified research orgs worldwide).

### OBBBA charitable deduction
- OBBBA charitable deduction floor (0.5% AGI, effective 2026) reshapes donor-incentive intersection [verified 05/2026, OBBBA legislative text 2025]. IRS rulemaking in progress.

---

## 6. Technology stack and vendor landscape

### The six-layer stack
Every digital incentive transaction touches six capability layers. Understanding where a company sits determines its economics, competitive set, and growth ceiling:

| Layer | Function | Example Players | Economics |
|---|---|---|---|
| **Brand Issuance** | Brands issue stored-value instruments | Amazon, Starbucks, Target, Visa/MC prepaid | Breakage (3-8%), float, customer acquisition |
| **Card Production & Retail Distribution** | Physical card manufacturing, retail placement | BHN, InComm, retail partners | Slotting fees, activation commissions (8-15% of face) |
| **API Aggregation** | 500-1,500+ brand catalogs via single API | Tango/BHN, Tremendous, Runa, Tillo, Giftbit | Wholesale discount arbitrage (3-12%), API fees |
| **B2B Fulfillment** | End-to-end reward delivery, compliance, settlement | Tremendous, Tango, Runa, Xoxoday, Giftogram | Blended 5-15% net take rate, SaaS fees |
| **Recognition/Engagement** | Employee experience platform with rewards embedded | Achievers, Workhuman, Awardco, Bonusly | $3-10/employee/month + reward margin |
| **Program Management** | Enterprise incentive programs with custom design, events | ITA Group, BI Worldwide, Maritz, 360insights | Professional services + fulfillment margin |

### Integration architecture
- **HRIS connectors**: Workday, SAP SuccessFactors, ADP, BambooHR, UKG are table-stakes integrations for recognition platforms.
- **CRM integration**: Salesforce, HubSpot for channel incentive and sales reward programs.
- **Survey platforms**: Qualtrics, SurveyMonkey, Alchemer for research payout triggers.
- **Slack/Teams**: In-workflow recognition is the fastest-growing delivery channel.
- **SSO/SCIM**: Enterprise identity management for platform access.

### API maturity spectrum
- **Tier 1 (production-grade)**: Tremendous, Tango/BHN, Runa — full REST APIs, webhooks, sandbox environments, comprehensive docs.
- **Tier 2 (functional)**: Tillo, Giftbit, Xoxoday — working APIs but lighter documentation, fewer webhook options.
- **Tier 3 (legacy/limited)**: Many channel specialists and recognition platforms still rely on SFTP batch files or manual portals.

---

## 7. ICP patterns by buyer type

### Highest-fit Cambrian prospects (by seller vertical)

**Sellers AT B2B rewards platforms (Tremendous, Runa, Tillo competitors):**
- Fit: 90-95%. Direct domain overlap — channel attribution, partner GTM, enterprise sales playbook are exact Cambrian deliverables.
- Discovery angle: revenue mix by buyer segment (HR vs. Marketing vs. Research), API vs. self-serve ratio, enterprise vs. SMB concentration.

**Sellers AT vertical SaaS adding embedded rewards (Toast, ServiceTitan, Mindbody):**
- Fit: 82-90%. Embedded rewards GTM, vertical SaaS partner channel, product monetization strategy.
- Discovery angle: reward revenue as % of total, integration completion rates, partner economics.

**Sellers AT recognition platforms (Achievers, Workhuman, Awardco, Bonusly):**
- Fit: 80-88%. HRIS partnership architecture, enterprise sales playbook, program ROI measurement.
- Discovery angle: HRIS integration pipeline, enterprise vs. mid-market mix, renewal/expansion rates.

**Sellers AT channel incentive specialists (ITA Group, BI Worldwide, 360insights):**
- Fit: 78-86%. Revenue ops for enterprise programs, channel economics, customer success architecture.
- Discovery angle: program revenue concentration, client retention, professional services leverage.

### Lower-fit segments

**Loyalty platform vendors (Talon.One, Antavo, Capillary):**
- Fit: 40-55%. Different buyer (CMO vs HR), different metrics (engagement vs recognition); limited GTM overlap.

**Pure prepaid/card issuing infrastructure (Pathward, Sutton Bank, Galileo):**
- Fit: 35-50%. Different consulting model; buyer is Treasury/Ops, not revenue ops.

**Consumer cashback/card-linked apps (Drop, Karat, Fluz):**
- Fit: 30-45%. Consumer acquisition motion, not enterprise revenue ops.

---

## 8. Buying committee and decision dynamics

| Role | What They Care About | Their Lens |
|---|---|---|
| **CHRO / VP People** | Employee engagement, recognition culture, eNPS | "Will this move our engagement scores?" |
| **CMO / VP Growth** | Customer acquisition, referral conversion, loyalty ROI | "What's the incremental CAC improvement?" |
| **VP Research / Insights Director** | Response rates, data quality, participant experience | "Will this improve our completion rates and reduce fraud?" |
| **CRO / VP Channel** | Partner activation, SPIFF ROI, channel revenue | "Will my partners actually engage with this?" |
| **CFO / Controller** | Tax compliance, escheatment, audit exposure, total cost | "Is this going to create a 1099 filing problem at scale?" |
| **CIO / VP Engineering** | API reliability, integration complexity, SOC 2, data security | "Can we integrate this in under 30 days?" |
| **CPO / Head of Procurement** | Vendor consolidation, pricing transparency, contract terms | "Can we replace three vendors with one?" |

### Decision patterns by company size

- **SMB (under 500 employees)**: HR leader or founder decides alone. Self-serve sign-up. No procurement. 1-7 day cycle.
- **Mid-market (500-5,000)**: HR + Finance sign off. Light procurement review. 30-90 day cycle.
- **Enterprise (5,000+)**: Full buying committee. Procurement-led RFP. Security review. HRIS integration requirement. 6-12 month cycle.
- **Research orgs**: Insights Director + Procurement. Compliance-heavy evaluation. 60-120 day cycle.
- **Channel programs**: CRO + Finance + sometimes CEO for material programs. 90-180 day cycle.

---

## 9. Trigger events

| Trigger | What It Signals | Sales Implication |
|---|---|---|
| **Open enrollment / annual recognition refresh** (Q4) | Budget cycle for HR recognition programs | Largest procurement window for recognition platforms |
| **New CHRO / VP People hire** | Leadership change often triggers vendor review | 60-day window post-hire for outreach |
| **M&A or headcount restructuring** | Integration or culture-rebuild need | Recognition platform consolidation or new purchase |
| **Compliance audit finding (1099, escheatment)** | Regulatory exposure discovery | Urgent compliance-automation purchase |
| **Vertical SaaS platform launching rewards** | New embedded-rewards buyer entering market | Partnership opportunity for API aggregators |
| **PE acquisition of rewards company** | Strategic consolidation | Vendor displacement or portfolio cross-sell |
| **Research program scaling internationally** | Cross-border payout complexity spike | API platform upgrade from manual to automated |
| **Channel partner program launch or overhaul** | New incentive budget unlocked | Channel incentive platform purchase |
| **HRIS migration (Workday, SAP SF rollout)** | Tech stack change forces integration review | Recognition platform switch if old provider lacks integration |
| **Gift card fraud incident** | Security and compliance urgency | Platform switch with compliance as primary driver |

---

## 10. Common failure modes

What goes wrong selling into rewards/incentives if you are not native:

1. **Treating it like SaaS.** Most B2B rewards platforms have $0 software fees. Revenue comes from card margin. If you price-compare using SaaS metrics (ARR, ACV), you'll misread the entire competitive landscape. The question is "what's your net take rate on reward fulfillment" — not "what's your subscription price."

2. **Selling to one buyer when the platform serves five.** HR, Marketing, Research, Sales/Channel, and Procurement each buy the same underlying product for different reasons. A platform pitch that resonates with HR ("employee engagement") will fall flat with Research ("participant incentive cost efficiency"). Cambrian sellers must identify WHICH buyer they're briefing and adjust.

3. **Underestimating compliance as a moat.** Every platform claims compliance. The operator question is: "At what 1099 volume does your automation break? How do you handle multi-state escheatment? What happens when a recipient is in an OFAC-sanctioned country?" These are the questions that separate depth from surface.

4. **Confusing recognition with rewards.** Recognition ($3-10/employee/month SaaS + reward margin) is an ongoing engagement platform with HRIS integration, peer-to-peer workflows, and analytics. Rewards (transactional gift card delivery via API) is an infrastructure play. Different ACV, different buyer, different competitive set.

5. **Ignoring the margin transparency war.** Lower-margin entrants (Tremendous, Runa) are actively competing on reward-cost transparency against incumbents who bundle opaque margin into "free" platforms. If your prospect is evaluating vendors, understanding this pricing dynamic is essential.

6. **Pitching "choice" as differentiator.** Choice-based delivery (recipient picks from a menu of brands) has won. It's table stakes, not a differentiator. The real differentiators in 2026 are: cross-border coverage (100+ countries), compliance automation depth, API reliability, and speed to integration.

7. **Missing the embedded rewards wave.** Vertical SaaS platforms (Toast, ServiceTitan, Mindbody) are adding reward features as a monetization and retention play. This is the fastest-growing distribution channel for reward APIs — and most legacy recognition/incentive platforms are not competing here.

8. **Overgeneralizing academic research.** The Wang meta-analysis (cash > vouchers for response rates) applies to SURVEY INCENTIVES specifically — do not generalize to employee recognition or loyalty without caveating. The Antavo 74% disengagement stat is platform data, not independent sample.

---

## 11. GTM implications

### For Cambrian sellers prospecting rewards/incentives companies

- **Lead with buyer-segment specificity.** "Who is your primary buyer — HR, Marketing, Research, Channel?" is the first discovery question. Everything downstream depends on the answer.
- **Speak margin-stack language.** "What's your net take rate? What's your card margin by brand tier? What's your breakage assumption?" These are the economic questions that demonstrate domain fluency.
- **Map the competitive set precisely.** Tremendous vs. Tango is a different conversation than Achievers vs. Workhuman, which is different from ITA Group vs. BI Worldwide. Don't conflate them.
- **Reference the consolidation thesis.** BHN acquired Tango (2024), Rybbon (2022); Edenred acquired Reward Gateway; Awardco reached unicorn status. PE and strategic appetite is high. Every standalone platform has an exit narrative.
- **Understand the API maturity gap.** Production-grade APIs (Tremendous, Tango, Runa) vs. legacy portals (many channel specialists) is a real competitive axis. Platforms with modern APIs win embedded-rewards deals; those without lose them.

### For Cambrian sellers selling FROM rewards platforms

- **Account briefs must reflect the multi-buyer reality.** If a seller at Tremendous is calling on a $500M SaaS company, the brief needs to identify WHETHER the opportunity is HR recognition, marketing referral, research payouts, or channel incentives — and brief accordingly.
- **Compliance depth is the credibility proof.** Every brief for a financial-services, healthcare, or regulated-industry prospect must surface tax, escheatment, and KYC implications specific to that industry.
- **Cross-reference the digital incentives platforms layer** for deeper platform economics, unit-economics levers, and competitive stack taxonomy.

### CAMBRIAN'S EDGE

Joe's BHN background provides operator-level credibility. Every conversation starts from mutual recognition. This is the #1 vertical by domain expertise x addressable opportunity x competitive differentiation. The empirical record now clearly favors experiential and identity-affirming rewards over generic monetary discounts on long-run CLV. Month-2 retention, not enrollment, is the milestone.

---

## 12. Cross-references to sister layers

| Layer | How It Applies |
|---|---|
| \`digitalIncentivesPlatformsKnowledge.js\` | Deep economics: platform stack taxonomy, unit-economics levers, investor dynamics. AUGMENTS this layer. |
| \`paymentsKnowledge.js\` | Prepaid card rails, interchange economics, cross-border payment infrastructure directly overlap |
| \`accountingFinanceKnowledge.js\` | 1099 reporting, escheatment, ASC 606 revenue recognition for reward platforms |
| \`b2bSalesKnowledge.js\` | Enterprise selling motion, multi-stakeholder buying committee, champion building |
| \`investorIntelligenceKnowledge.js\` | PE dynamics (Silver Lake/P2, GTCR for BHN), VC backing (Awardco Series B), strategic acquirer profiles |
| \`charitableGivingKnowledge.js\` | Charitable donation as reward choice option; OBBBA intersection |
| \`peHoldcoKnowledge.js\` | PE-backed rewards companies (BHN, 360insights, Reward Gateway/Edenred) follow holdco playbook |
| \`cryptoStablecoinKnowledge.js\` | Stablecoin-based payouts emerging via Runa, Tremendous; cross-border reward delivery alternative |

---

## CAPITAL & M&A (Q2 2026 REFRESH)

The GTCR/Blackhawk Network deal at $4-5B (in advanced talks per July 2025 Private Equity Wire) is the defining transaction. If completed at $5B+, it represents a meaningful return on Silver Lake/P2's original $3.5B 2018 take-private. [verified 05/2026, Private Equity Wire July 2025] BHN has made 19 acquisitions to date (average ~$132M) [verified 05/2026, Tracxn], most recent was Tango Card (Jan 2024). BHN's network: 1,000+ brands, 244,000+ retail locations [verified 05/2026, BHN corporate site]. Comparable peers weighing strategic alternatives: Green Dot, Paysafe, AvidXchange. Adjacent strategic acquirers: Fiserv, Brookfield Private Credit, and increasingly QSR/franchise PE firms (Roark, Inspire Brands) integrating loyalty as a unit-economics defense. Key investor voices: FTV Capital's Chris Winship (former Tango Card lead), Silver Lake/P2 leadership for Blackhawk exit dynamics, GTCR's payments team.

Awardco: $165M Series B (March 2025), $1B+ valuation, $235M total funding [verified 05/2026, PR Newswire]. Unicorn status reached in 10 years. Signal: PE and growth equity see recognition as a category with durable unit economics.

Runa: $65M total funding, 10 rounds, acquired by Staples [verified 05/2026, Tracxn]. Signal: strategic acquirers buying API infrastructure for embedded-rewards distribution.

Edenred acquired Reward Gateway — consolidation of employee engagement under a European payments/benefits conglomerate.

---

## LOYALTY RESEARCH (Q2 2026 REFRESH — peer-reviewed)

- 74% of loyalty members disengage silently within the first two months (Antavo 2026, 3,000 professionals / 10,000 consumers / 500M platform interactions) — THE activation cliff stat. The design problem is activation, not enrollment. [verified 05/2026, Antavo Global Loyalty Report 2026]
- Birthday rewards have NO positive CLV effect — recipients had materially lower average CLV ($72) vs control ($125) in study of 210,657 MUJI members (Nishio & Hoshino 2024). Strong citation against unexamined "personalized gesture" tactics. [verified 05/2026, Nishio & Hoshino 2024]
- Experiential rewards drive greater self-connection than material rewards; even small experiential rewards produce effects comparable to large material ones (ScienceDirect Aug 2025). Loyalty market projected to reach $155.22B globally by 2029 [verified 05/2026, Mordor Intelligence].
- Non-monetary elements (events, recognition, exclusive services) sustain loyalty at program termination; monetary savings have no significant loyalty effect (Melnyk & Bijmolt, foundational, cited heavily through 2025).
- 90% of consumers willing to switch brands for better rewards (Engage People / Wise Marketer 2025). 78% would engage more if "Pay with Points" available at checkout. [verified 05/2026, Engage People / Wise Marketer 2025]
- 92% enrolled in at least one program but only 28% feel "very" satisfied (EY 2025). 73% find loyalty programs too complicated; 54% unaware which programs they belong to (Bond Brand Loyalty / arXiv 2512.00738). [verified 05/2026, EY 2025 / Bond Brand Loyalty]
- Program owner ROI: 92.7% measuring ROI report positive return; average 5.3x. Owner satisfaction 83% in 2026 vs 50.6% in 2022 (Antavo). [verified 05/2026, Antavo Global Loyalty Report 2026]

---

## INCENTIVE COMPENSATION RESEARCH (Q2 2026 REFRESH — replaces dated Shaffer & Arkes 2009 anchor)

- Cash is most efficient at increasing response rates (RR 1.25) vs vouchers (RR 1.19) vs lotteries (RR 1.12) — Wang et al. 2023 meta-analysis, 46 RCTs, 109,648 participants, 14 countries. [verified 05/2026, Wang et al. 2023]
- Conditional incentives are more cost-effective than unconditional; unconditional have largest absolute effect (Imperial College / Elliott et al. 2025, JMIR). [verified 05/2026, Elliott et al. 2025]
- Raising incentives mid-field has materially larger effects on previous non-respondents than respondents (Cabrera-Alvarez & Lynn 2025, UK Understanding Society panel RCT). [verified 05/2026, Cabrera-Alvarez & Lynn 2025]
- Average survey response rates climbed from 48% (2005) to 68% (2020) — Holtom, Baruch, Aguinis & Ballinger 2022, Human Relations, 1,014 surveys. Canonical reference for response-rate norms. [verified 05/2026, Holtom et al. 2022]
- Operator implication: the Antavo 74% disengagement cliff + Wang meta-analysis together make a tight case for redesigning loyalty-program activation around frontloaded conditional incentives.

---

## 2026 TRENDS

- API-first delivery is table stakes (Tango, Tremendous, Giftbit all sell embedded APIs).
- Embedded rewards in vertical SaaS is fastest-growing motion (Toast, ServiceTitan adding reward features).
- Choice-based delivery ("recipient picks from menu") has won over single-brand.
- Global/cross-border: 100+ countries with local-currency redemption now table stakes.
- Consolidation: BHN acquired Tango (2024), Rybbon (2022); PE appetite high.
- Federal interchange fee debate live: Fed Dec 2025 biennial report (100.7B debit/prepaid transactions, $4.7T, $34.12B interchange) [verified 05/2026, Federal Reserve Payments Study Dec 2025].
- Prepaid debit card growth decelerating in volume (down from 9.6% to ~4-5% annually) but interchange revenue holding [verified 05/2026, Federal Reserve Payments Study Dec 2025].
- AI-powered personalization of reward selection (recommendation engines matching recipient preferences to brand catalog) is the next product frontier.
- Stablecoin-based cross-border payouts emerging as alternative to traditional FX-heavy delivery corridors [verified 05/2026, Cambrian operator knowledge].

---

## KNOWN TRAPS (meta-knowledge — where this vertical's data goes stale or gets misinterpreted)

- GTCR/BHN deal status: has been "in advanced talks" since July 2025. Do NOT state it has closed unless confirmed by a binding agreement press release. Check before every use.
- Market size figures ($230B gift card, $80B B2B incentives) are industry-body estimates with wide confidence bands [verified 05/2026, GCVA / IRF]. Do not present as precise.
- BHN acquisition count (19) and average deal size ($132M) are Tracxn-sourced and may lag by 1-2 quarters.
- The Wang meta-analysis (cash > vouchers for response rates) applies to SURVEY INCENTIVES specifically — do not generalize to employee recognition or loyalty without caveating.
- The Antavo 74% disengagement stat is from their platform data, not an independent sample. Strong signal but potential selection bias.
- Birthday reward CLV study (Nishio & Hoshino) is a SINGLE retailer (MUJI Japan) — do not overgeneralize to all reward types or geographies.
- Escheatment laws change frequently at state level. 3-5 year holding periods are directionally correct but vary by state and instrument type.
- OBBBA charitable deduction floor (0.5% AGI) is enacted but implementation guidance still evolving — IRS rulemaking in progress.
- Interchange revenue figures from the Fed biennial report reflect 2023-2024 data collection; 2025-2026 actuals will differ due to regulatory changes.
- Employee recognition market sizing varies widely by source ($20B to $39B for 2025) depending on whether professional services and reward fulfillment are included or just software.
- Awardco's $1B valuation is a private-market mark from a Series B — not a public-market valuation. Treat accordingly.
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
- Which buyer segment (HR, Marketing, Research, Channel) drives most of your pipeline? Is that by design?

IMPACT:
- Where does the enterprise sales cycle stall — multi-stakeholder buying (IT, Finance, Tax), procurement, or use case alignment?
- What's your CAC and LTV by acquisition channel and customer tier? How is it trending QoQ?
- At what scale does your compliance automation (1099, escheatment, KYC) break? Where are the manual steps?

VISION:
- Are you running vertical SaaS partnerships? How's the revenue flowing — meaningful or pilot-stage?
- How do you measure program ROI for your customers — standardized framework or ad hoc per customer?
- What's your cross-border story? How many countries can you deliver to with local-currency redemption?

ENTRY POINTS:
- How is compliance (tax, escheatment, fraud) handled — feature or cost center? Automating W-9/1099 or manual?
- Who are your top 5 customers by ARR? What verticals? How concentrated?
- What's your net take rate on reward fulfillment? How transparent is your pricing to buyers?

ROUTE:
- If you could solve one thing in your GTM in the next 6 months — channel attribution, enterprise deal velocity, vertical SaaS partnership ROI, pricing, or team structure?
- What's the competitive pressure from lower-margin entrants doing to your pricing strategy?
- How are you thinking about the embedded-rewards wave — vertical SaaS platforms adding reward features as native product?
`;
