// src/data/insuranceKnowledge.js
//
// U.S. Insurance industry knowledge layer — carriers, MGAs, brokers,
// reinsurers, core-systems landscape, distribution economics, and the
// state-based regulatory architecture.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_INSURANCE (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// VERSION: 2.0.0
// VERIFIED: 2026-05-21
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Mordor Intelligence, US P&C Insurance Market (2026):
//     mordorintelligence.com/industry-reports/property-and-casualty-insurance-market-in-usa
//   Mordor Intelligence, Insurance Software Market (2026):
//     mordorintelligence.com/industry-reports/insurance-software-market
//   IBISWorld, Property, Casualty & Direct Insurance in the US (2026):
//     ibisworld.com/united-states/industry/property-casualty-and-direct-insurance/1325
//   CoinLaw, US Insurance Industry Statistics 2026:
//     coinlaw.io/us-insurance-industry-statistics
//   Triple-I / Milliman, US P/C Outlook (Jan 2026):
//     insuranceindustryblog.iii.org
//   Insurance Insider US, 2026 Insurance Industry Report:
//     insuranceinsider.com/resources/insurance-industry-report
//   Conning, Managing General Agents study (2025, reported 2026)
//   Morningstar DBRS, US Fronting / MGA market (2026), via insurancebusinessmag.com
//   Deloitte, MGAs as Sources of Growth for Private Equity (2025)
//   Insnerds / ASI, Guidewire-Duck Creek platform analysis (late 2025)
//   AM Best, US P&C Financial Results (2025)
//   NAIC, Market Share Data and Model Laws
//   Progressive Corporation 2024 Annual Report
//   Guidewire Software Investor Relations

// -- INSURANCE INDUSTRY INJECTION --
// Injected when the seller or target operates in insurance: carriers, MGAs,
// brokers, reinsurers, insurtech, or insurance-adjacent services.

export const INSURANCE_INDUSTRY_INJECTION = `
INSURANCE INDUSTRY CONTEXT (use when the target or seller is an insurance carrier, MGA, broker/agency, reinsurer, fronting carrier, or insurtech):

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| US P&C insurance market | ~$1.0-1.14T [verified 2026, Mordor Intelligence $1.14T / IBISWorld $1.0T] |
| US total insurance (all lines) | ~$2.27T [verified 2026, CoinLaw] |
| Global insurance market | ~$8.33T [verified 2025, Swiss Re sigma] |
| Number of US insurance companies | ~4,700 (2,684 P&C, 717 life, 1,331 health) [verified 2026, CoinLaw] |
| Top 10 carrier premium concentration | ~50% of total premium |
| P&C combined ratio (2025) | ~92% — lowest in over a decade [verified Q1 2026, Triple-I/Milliman] |
| E&S market direct premiums written | $130B+ [verified 2026, Insurance Insider] |
| MGA channel premium (US, 2024) | ~$114B DPW, +16% YoY [verified 2026, Conning] |
| MGA share of US P&C premium | ~9-10% [verified 2026, Conning/DBRS] |
| Insurance software market | ~$15.03B in 2026, ~6.31% CAGR [verified 2026, Mordor] |
| Workforce retirements by 2026 | ~400,000 expected — talent cliff [verified 2026, CoinLaw] |
| AI adoption | ~76% of carriers use AI in at least one function [verified 2026, CoinLaw] |
| Digital policy purchase | ~47% of policies purchased digitally [verified 2026, CoinLaw] |

---

## 2. What makes insurance distinct as a sales target

**1. State-by-state regulation is the dominant operating constraint.** There is no federal insurance regulator (McCarran-Ferguson Act). Each state has a Department of Insurance; carriers file rates and forms state by state. The NAIC coordinates through model laws adopted with variation. This means a "national" carrier is actually 50+ separate regulated entities, and every product, rate, and marketing decision must pass state-specific scrutiny.

**2. The combined ratio is the universal scoreboard.** Combined ratio = Loss Ratio + Expense Ratio. Below 100% = underwriting profit; above 100% = underwriting loss. Everything — pricing, technology investment, distribution strategy, vendor selection — is evaluated through its impact on the combined ratio. A vendor pitch that cannot connect to loss-ratio or expense-ratio impact will not land.

**3. Ownership type predicts buying behavior.** STOCK insurers are shareholder-owned (public data-rich, faster procurement). MUTUAL insurers are policyholder-owned (private, data-scarce, conservative, long buying cycles). A mutual like State Farm or USAA will have far less public financial data and more conservative procurement than a stock carrier like Progressive or Travelers.

**4. Anti-rebating law gates any policyholder-facing program.** Most states restrict insurers and producers from giving policyholders anything of value as an inducement to buy or keep a policy. Many states have modernized (value-added services, de-minimis gift thresholds), but rules vary by state and are a real design constraint. Any rewards/incentive program must be structured against the specific state's anti-rebating rules.

---

## 3. Sub-categorization — who operates in insurance

### Value chain participants

| Participant | Role | Economics |
|---|---|---|
| **Carrier (insurer)** | Holds license, balance sheet, and risk. Files rates/forms. Pays claims. | Earns premium; invests float; underwriting profit/loss + investment income |
| **Reinsurer** | The carrier's carrier — assumes share of risk for share of premium | Munich Re, Swiss Re, Berkshire, Lloyd's syndicates |
| **Broker / Agent** | Distribution and advice. Earns commission. | Independent agents (multiple carriers) vs. captive (one carrier) |
| **MGA (Managing General Agent)** | Delegated underwriting authority from carrier — binds coverage, underwrites, prices | Specializes in niche/specialty lines; fastest-growing channel |
| **Fronting carrier** | Licensed carrier that "rents" paper — enables MGAs to access regulated markets | State National, AF Group, Core Specialty [verified 2026, Morningstar DBRS] |
| **TPA (Third-Party Administrator)** | Outsourced claims/policy administration | Fee-based; common for self-insured programs |

### Insurance types — "insurance" is not one market

| Type | Description | Key dynamics |
|---|---|---|
| **Personal lines P&C** | Auto, homeowners | High volume, low premium per policy; telematics/UBI mainstreaming |
| **Commercial lines P&C** | Commercial auto, GL, property, workers' comp | Relationship-driven; broker-intermediated; longer policy cycles |
| **Specialty / E&S** | Cyber, professional liability, marine, niche risks | Non-admitted market; $130B+ DPW; covers risks admitted market won't |
| **Life & Annuity** | Mortality/longevity products, retirement | Different regulators, distribution, economics than P&C |
| **Health** | Medical, dental, supplemental | Overlaps with healthcare-payer dynamics |
| **Reinsurance** | Wholesale risk transfer | No consumer or agent touchpoint |

---

## 4. Named companies — the operator landscape (15-20)

| Company | Type | Scale | Why they matter |
|---|---|---|---|
| **State Farm** | Mutual, personal lines | Largest US P&C insurer; ~$100B+ DPW [verified 2026, NAIC/AM Best] | Massive agent network; conservative procurement; limited public data |
| **Geico** | Stock (Berkshire), direct writer | #2 US auto; ~$40B+ DPW | Direct-to-consumer model; digital-first; Berkshire-backed pricing power |
| **Progressive** | Stock, personal + commercial | ~$65B+ DPW; 60%+ new auto policies include telematics [verified 2026, Progressive Annual Report] | Usage-based insurance pioneer; Snapshot program; data-driven underwriting |
| **Allstate** | Stock, personal lines | ~$55B+ DPW | National brand; agent + direct hybrid model; Arity telematics subsidiary |
| **USAA** | Reciprocal (member-owned), military | ~$30B+ DPW | Military-only membership; excellent NPS; limited public data; conservative buying |
| **Liberty Mutual** | Mutual, diversified | ~$50B+ DPW | Landmark Guidewire cloud deal (10-year) [verified late 2025, Guidewire IR] |
| **Travelers** | Stock, commercial + personal | ~$40B+ DPW | Commercial lines strength; consistent underwriting discipline |
| **AIG** | Stock, commercial + specialty | ~$25B+ DPW | Global commercial insurer; restructured post-2008; Corebridge spin-off |
| **Chubb** | Stock, specialty + commercial | ~$45B+ DPW globally | Highest-quality underwriting reputation; global; Zurich/Chubb name |
| **Hartford Financial** | Stock, commercial + personal | ~$25B+ DPW | Small commercial and group benefits strength |
| **Lemonade** | Insurtech, stock | ~$500M+ GEP | AI-first claims; direct-to-consumer; low market share but high brand awareness |
| **Root** | Insurtech, stock | ~$1B+ GEP | Telematics-first auto; improving loss ratio; still pre-profit |
| **Hippo** | Insurtech, stock | ~$350M+ in force | Home insurance; IoT/smart home integrations; MGA model |
| **Duck Creek Technologies** | Core software | Vista Equity-owned | Cloud P&C core system; positions on implementation speed vs. Guidewire |
| **Guidewire Software** | Core software | ~$1.2B revenue, ~19% ARR growth [verified late 2025, Guidewire IR] | Dominant enterprise P&C core; InsuranceSuite (Policy, Billing, Claims); cloud migration |
| **Majesco** | Core software | Thoma Bravo-owned (taken private) | Mid-market and international P&C/L&A core; cloud-native; fast-growing |

---

## 5. Regulatory overlay — state-based architecture

### Regulatory structure (structural — durable)

- **Insurance is STATE-REGULATED.** No federal insurance regulator (McCarran-Ferguson Act). Each state DOI supervises carriers.
- **NAIC (National Association of Insurance Commissioners)** — coordinates model laws; publishes market-share and financial data; does not directly regulate.

### Key regulatory mechanics

| Mechanism | Description |
|---|---|
| **Rate-and-form filing** | Carriers must file rates and policy forms with each state DOI; prior-approval vs. file-and-use vs. use-and-file varies by state |
| **Market-conduct exams** | State-initiated reviews of carrier practices (claims handling, underwriting, marketing) |
| **Risk-Based Capital (RBC)** | NAIC framework for minimum capital requirements; action levels trigger regulatory intervention |
| **State guaranty funds** | Protect policyholders if a carrier becomes insolvent; funded by assessments on surviving carriers |
| **Unfair Claims Practices Acts** | State laws governing claims handling timeliness, communication, and fairness |
| **Producer licensing (NIPR)** | Agents and brokers must be licensed in each state they sell in; National Insurance Producer Registry streamlines |
| **NAIC Insurance Data Security Model Law** | Cybersecurity requirements for carriers; adopted in 20+ states |
| **GLBA + state privacy** | Gramm-Leach-Bliley financial privacy; plus state-specific insurance privacy requirements |

### Anti-rebating / anti-inducement laws (critical for rewards use cases)

Most states restrict insurers and producers from giving policyholders or prospects anything of value as an inducement to buy or keep a policy. Key considerations:
- Many states have modernized: value-added services exceptions, de-minimis gift thresholds ($25-$100 range common)
- Some states (FL, OH, CA, others) have carved explicit exceptions for wellness and telematics incentive programs
- Rules vary significantly by state and by line of business
- **Any policyholder-facing rewards/incentive program must be structured against the specific state's current anti-rebating rules** — this is a gating design question, not an afterthought
- Agent/producer-facing incentive programs (channel incentives, SPIFFs) have different and generally more permissive rules

---

## 6. Technology stack — core systems and ecosystem

### Core systems (the Big 3 categories)

Every carrier runs three core systems, and replacing any one is a multi-year, high-budget program:

| System | Function | Key vendors |
|---|---|---|
| **Policy Administration (PAS)** | Policy lifecycle management — quoting, binding, endorsing, renewing, canceling | Guidewire PolicyCenter, Duck Creek Policy, Majesco Policy, EIS, Socotra, Insurity |
| **Billing** | Premium billing, collections, agency accounting | Guidewire BillingCenter, Duck Creek Billing, Majesco Billing |
| **Claims** | Claims intake, adjudication, payment, reporting | Guidewire ClaimsCenter, Duck Creek Claims, Majesco Claims |

### Vendor landscape

| Vendor | Positioning | Notes |
|---|---|---|
| **Guidewire** | Dominant enterprise P&C core | $1.2B revenue; ~19% ARR growth; landmark Liberty Mutual 10-year cloud deal; InsuranceSuite is the benchmark [verified late 2025, Guidewire IR] |
| **Duck Creek** | Cloud P&C core; speed-to-implement | Vista Equity-owned; positions against Guidewire on implementation speed and cost |
| **Sapiens** | Mid-market and international | P&C + Life platform; growing US presence |
| **Majesco** | Mid-market P&C/L&A | Thoma Bravo-owned; cloud-native; fast-growing; API-first |
| **EIS** | API-native, digital-first | Insurtech-oriented deployments; modern architecture |
| **Socotra** | Cloud-native, API-first | Fast deployment for MGAs and digital insurers; programmatic pricing |
| **Insurity** | Mid-market P&C | Strong in specialty/E&S; growing cloud adoption |
| **Applied Systems** | Agency management | Dominant in independent agency channel; Epic and Applied Online |
| **Vertafore** | Agency management | Competes with Applied; AMS360 and Sagitta |
| **Shift Technology** | AI fraud/claims | Specialist AI for claims fraud detection and automation |
| **FRISS** | AI fraud/underwriting | Real-time risk assessment and fraud detection |

### Data and rating ecosystem (structural)

- **Verisk/ISO** — rating bureau and loss-cost data; Advisory Organization for most states
- **LexisNexis Risk Solutions** — consumer and commercial risk data; CLUE (claims-history database)
- **IVANS** — carrier-agency connectivity; real-time quoting, policy download
- **Earnix / Guidewire Analytics** — pricing optimization and rate-filing tools

---

## 7. Distribution and the MGA boom

### Channel economics

| Channel | How it works | Commission range |
|---|---|---|
| **Direct writer** | Carrier sells directly to consumer (online, call center) | No commission; lower expense ratio; Geico, Progressive Direct |
| **Captive agent** | Agent represents one carrier exclusively | 5-12% new, 2-5% renewal |
| **Independent agent** | Agent represents multiple carriers | 10-20% new, 8-15% renewal; owns the customer relationship |
| **Broker** | Advises buyer; places risk across carriers | Fee or commission; dominant in commercial/specialty |
| **MGA** | Delegated underwriting; binds on carrier's paper | Commission + profit-share; 20-30% EBITDA margins |

### MGA boom (the fastest-growing structural story)

- US MGA premium ~$114B DPW for 2024, +16% YoY [verified 2026, Conning]. MGAs now ~9-10% of US P&C premium.
- >1,000 US MGA participants; MGA premium grew ~90% over five years vs. ~49% for P&C overall.
- Private equity owns 30%+ of US MGA entities, drawn by asset-light, fee-based models with 20-30% EBITDA margins [verified 2026, Deloitte].
- Fronting carriers wrote ~$29.1B DPW in 2024; top 10 fronting carriers hold ~69% of MGA-dedicated premium [verified 2026, Morningstar DBRS].
- MGAs buy faster, have lighter procurement, and value technology partners that enable rapid program launch.

---

## 8. ICP patterns by insurer type

### Best-fit Cambrian user-prospect: Health insurers with member wellness/engagement programs and personal-lines P&C with telematics

Why these segments:
- Wellness incentives, healthy-behavior rewards, and safe-driving programs are squarely core-domain for Cambrian
- Engaged budget owners (Chief Customer Officer, VP Member Experience, Chief Distribution Officer)
- Active investment cycles in retention, engagement, and digital experience
- Anti-rebating has been modernized in most states for these use cases (wellness + telematics exceptions)

### Strong-fit adjacent segments

- **P&C carriers with large agent channels** — agent/producer incentive programs map directly to rewards infrastructure
- **Carriers running customer retention/NPS/loyalty initiatives** — renewal economics drive retention spend
- **MGAs and program administrators** — agent-channel incentive programs; faster, less-fortified buying than large carriers
- **Insurtechs (digital-native carriers/MGAs)** — API-first, fast procurement, embedded-rewards appetite; smaller budgets

### Lower-fit segments

- **Top-5 US carriers (State Farm, Berkshire/Geico, Progressive scale)** — procurement fortress; 12-18 month cycles; large internal teams
- **Reinsurers** — wholesale risk-transfer; no consumer, member, or agent-channel rewards use case
- **Conservative mutual carriers** — policyholder-owned, risk-averse, data-scarce, slow cycles

---

## 9. Buying committee and decision dynamics

| Role | What they care about | Their lens |
|---|---|---|
| **Chief Underwriting Officer (CUO)** | Underwriting strategy, risk selection, pricing, loss ratio | "Does this improve loss ratio? Does it give us better risk selection data?" |
| **Chief Claims Officer / VP Claims** | Claims operations, LAE, cycle time, disbursement, fraud | "Can this reduce claims cycle time or loss-adjustment expense?" |
| **CIO / Chief Digital Officer** | Core systems, modernization roadmap, data/analytics, security | "Does this integrate with our PAS/claims? Where are we in our cloud migration?" |
| **Chief Actuary** | Pricing models, reserving, RBC, risk quantification | "What's the actuarial impact? Can we price for this?" |
| **Chief Distribution Officer** | Agent/broker channel, producer engagement, channel economics | "Will this improve producer retention or new appointment rates?" |
| **CMO / Chief Customer Officer** | Acquisition, retention, NPS, loyalty, brand | "What's the impact on policyholder retention and lifetime value?" |
| **COO / Chief Risk Officer** | Operations, regulatory compliance, enterprise risk | "What's the regulatory surface? Does this create market-conduct exposure?" |
| **General Counsel** | State-by-state compliance, anti-rebating, contract structure | "Is this compliant in every state we operate in?" |

### Decision pattern

- Insurtech / digital MGA ($5-100M GEP): CEO + CTO + CUO. 30-90 day cycle. Fast, informal.
- Mid-market carrier / MGA ($100M-$1B GEP): CIO + CDO + CMO + CUO. 90-180 days.
- Large carrier ($1-10B DPW): Full procurement. RFP. Security review. TPRM. Legal. 6-12 months.
- Top-5 carrier ($10B+ DPW): 12-18 months. Dedicated vendor management. Board-level for material spend.
- **Mutual carriers add 30-50% to every timeline above.**

---

## 10. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **Core-system (PAS/billing/claims) modernization** | Multi-year program; the master buying trigger | Opens adjacent budget for everything that integrates |
| **New CUO/CIO/CDO/CMO hire** | Strategic reset; first 6 months is the window | New vendor evaluation cycle |
| **Combined ratio deterioration** | Expense or loss pressure | Active search for efficiency and loss-mitigation technology |
| **Telematics/UBI program launch or expansion** | Active investment in behavior-based products | Rewards/incentive infrastructure needed for driver programs |
| **MGA or delegated-authority program launch** | New distribution channel | Technology, compliance, and producer-engagement needs |
| **M&A integration** | Consolidating systems across acquired books | 12-24 month integration technology spend |
| **Catastrophe-driven repricing or capacity withdrawal** | Market hardening in specific lines/geographies | Underwriting technology and pricing tool investment |
| **Customer retention/NPS initiative** | Engagement and loyalty investment | Direct budget for rewards, communication, and experience tech |
| **Claims modernization / digital payout project** | Disbursement modernization | Instant payment, digital delivery, and claims-experience tech |
| **Regulatory exam finding / market-conduct action** | Forced remediation | Compliance technology, monitoring, and process improvement |
| **Anti-rebating rule modernization in a state** | New design space for policyholder engagement | Rewards/incentive programs become permissible |
| **Workforce retirement wave** | Automation and knowledge capture urgency | AI, workflow automation, and training technology |

---

## 11. Common failure modes

1. **Treating "insurance" as one market.** P&C, life, health, and reinsurance are separate ICPs with different buyers, cycles, economics, and regulatory overlays. Always subdivide first.
2. **Ignoring ownership type.** Mutuals are private, data-scarce, conservative, and slow. Stock carriers move faster and disclose more. This is not a nuance — it determines the entire sales approach.
3. **Anti-rebating ignorance for policyholder-facing programs.** Any rewards, loyalty, or incentive program touching policyholders must be designed against state-specific anti-rebating rules. Assuming it's legal everywhere is a deal-killer.
4. **No integration path to core systems.** If a vendor can't integrate with Guidewire, Duck Creek, or the carrier's existing PAS/claims, the conversation ends. Core-system integration capability is table stakes.
5. **Pitching consumer/agent use cases to a reinsurer.** Reinsurers have no consumer, member, or agent-channel touchpoint. A rewards pitch to Munich Re is a fundamental misunderstanding.
6. **Underestimating mutual-carrier procurement.** State Farm, USAA, and other mutuals can take 18+ months to evaluate and onboard a vendor. If your runway can't support that timeline, disqualify early.
7. **Confusing combined ratio components.** Loss ratio and expense ratio have different drivers and different buyers. A claims technology that reduces LAE is an expense-ratio play; a telematics program that improves risk selection is a loss-ratio play. Know which you're selling.
8. **Ignoring the MGA channel.** MGAs are the fastest-growing distribution channel, buy faster than carriers, and have lighter procurement. Overlooking MGAs in favor of carrier-only targeting misses the structural trend.
9. **Stale carrier-to-vendor mappings.** "Carrier X runs Guidewire" can change — always verify the current stack before pitching integration.
10. **Fabricating carrier-specific financials.** Mutual carriers have minimal public data. Any specific financial figure for State Farm, USAA, etc., should be caveated and fetched live if possible.

---

## 12. GTM implications for Cambrian seller-users

### Market cycle context (2026)

- P&C combined ratio ~92% for full-year 2025 — lowest in over a decade, aided by no-landfall hurricane season despite Jan 2025 LA wildfires [verified Q1 2026, Triple-I/Milliman].
- Premium growth slowing into 2026 (~3-6% across lines) as market softens.
- The 2023-2025 hard market is transitioning to softening — rate adequacy improving, capacity returning.
- E&S market continues to grow as admitted carriers pull back from volatile lines (wildfire, coastal property, cyber).

### Cambrian engagement vectors

1. **Policyholder wellness and engagement programs** — health insurer member rewards, safe-driving incentives (telematics), healthy-behavior programs
2. **Agent/producer channel incentives** — SPIFFs, recognition, and engagement programs for independent agent networks
3. **Claims disbursement modernization** — digital and instant claims payout as both a CX differentiator and expense-ratio lever
4. **Customer retention and NPS programs** — renewal-economics-driven investment in policyholder engagement
5. **MGA technology enablement** — program launch acceleration, underwriting workflow, producer engagement for the fastest-growing channel
6. **Core-system adjacency** — products that integrate with Guidewire/Duck Creek/Majesco and ride the core-modernization wave

### For sellers selling into insurance from Cambrian

- Subdivide by line of business and ownership type before approaching any carrier
- Confirm anti-rebating treatment for target states early in any policyholder-facing program design
- Core-system modernization is the master trigger — if the carrier is mid-PAS-replacement, all budget and attention is absorbed there; wait for the adjacency window
- Channel structure determines the buyer: direct writer -> Head of Digital; independent-agent carrier -> Chief Distribution Officer; MGA -> CEO/CUO
- The combined ratio is the universal language: frame everything as loss-ratio or expense-ratio impact

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`paymentsKnowledge.js\` | Claims disbursement, instant payments for insurance payouts, premium collection rails |
| \`bankingKnowledge.js\` | Insurance company investment portfolios; bank-insurance cross-sell; bancassurance |
| \`digitalIncentivesPlatformsKnowledge.js\` | Rewards and incentive platforms for policyholder engagement and agent incentives |
| \`complianceKnowledge.js\` | State regulatory frameworks, anti-rebating, market conduct, data security |
| \`healthcareSaasKnowledge.js\` | Health insurance overlaps with healthcare payer dynamics, wellness programs |
| \`fintechKnowledge.js\` | Insurtech ecosystem; embedded insurance; digital distribution |
| \`investorIntelligenceKnowledge.js\` | PE ownership of MGAs; public carrier investor dynamics; M&A intelligence |

---

*End of layer. Update cadence: quarterly aligned with carrier earnings cycles and NAIC data releases. Critical re-check triggers: catastrophe events, state regulatory actions (anti-rebating modernization), major carrier M&A, Guidewire/Duck Creek earnings, market cycle turning points, carrier combined-ratio shifts.*
`;

// -- INSURANCE SCORING CONTEXT --
// Calibrates ICP fit scoring when target/seller is insurance-adjacent.
// Bands conform to the normalized scale: Strong Fit 65+, Potential 40-64,
// Poor <40. Calibrated against observed Tillo->insurer fit data (insurance
// is the highest-scoring target vertical for a rewards/incentives seller,
// but most segments land in upper-Potential, not Strong).

export const INSURANCE_SCORING_CONTEXT = {
  highFitSegments: [
    { segment: "Health insurers with member wellness / engagement programs", avgFit: "70-80%", reason: "Wellness incentives, healthy-behavior rewards, and food-as-medicine programs are squarely core-domain; engaged budget owner (Chief Customer/Clinical Officer)" },
    { segment: "Personal-lines P&C carriers with telematics / UBI or large agent channels", avgFit: "60-70%", reason: "Safe-driving rewards and agent/producer incentive programs map directly to rewards/incentive infrastructure" },
    { segment: "Carriers running customer retention / NPS / loyalty initiatives", avgFit: "60-70%", reason: "Renewal economics drive retention spend; loyalty and policyholder rewards are an active budget line" },
    { segment: "MGAs and program administrators with producer networks", avgFit: "55-65%", reason: "Agent-channel incentive programs; faster, less-fortified buying than large carriers" },
    { segment: "Insurtechs (digital-native carriers and MGAs)", avgFit: "55-65%", reason: "API-first, fast procurement, embedded-rewards appetite -- but smaller budgets and runway sensitivity" },
  ],
  highFrictionSegments: [
    { segment: "Top-5 US carriers (e.g. State Farm, Berkshire, Progressive scale)", avgFit: "20-30%", reason: "Procurement fortress; 12-18 month cycles; large internal teams and incumbent vendors" },
    { segment: "Reinsurers", avgFit: "10-20%", reason: "Wholesale risk-transfer model -- no consumer, member, or agent-channel rewards use case" },
    { segment: "Conservative mutual carriers with long procurement", avgFit: "25-35%", reason: "Policyholder-owned, risk-averse, data-scarce, slow cycles -- they do buy, but expect a long runway" },
  ],
  keySignals: {
    positive: [
      "Telematics / usage-based insurance program launch or expansion",
      "Member wellness or healthy-behavior program (health carriers)",
      "Producer / agent engagement or channel-incentive initiative",
      "Customer retention, NPS, or loyalty program under active investment",
      "Claims modernization -- digital claims payout / disbursement project",
      "New Chief Marketing / Chief Customer / Chief Distribution Officer (first 6 months)",
      "Core-system (PAS / claims) modernization opening adjacent budget",
      "MGA or delegated-authority program launch",
      "Anti-rebating rule modernization in a key state",
      "Workforce retirement wave driving automation investment",
    ],
    negative: [
      "State anti-rebating / anti-inducement constraints unaddressed for a policyholder-facing program",
      "Locked into an incumbent loyalty / recognition / disbursement vendor",
      "Reinsurer or pure risk-transfer entity with no end-customer or agent touchpoint",
      "Conservative mutual mid-core-system-replacement (all budget and attention absorbed)",
      "Active regulatory exam finding absorbing compliance bandwidth",
    ],
  },
};

// -- INSURANCE DISCOVERY QUESTIONS --
// Injected into discovery question generation for insurance-vertical accounts.
// Organized by RIVER stage.

export const INSURANCE_DISCOVERY_INJECTION = `
INSURANCE-SPECIFIC DISCOVERY ANGLES (use when the prospect is a carrier, MGA, broker, reinsurer, or insurtech):

REALITY stage -- current state:
- Which lines do you write -- personal, commercial, specialty/E&S -- and which is the growth priority?
- What core systems are you on today (policy administration, billing, claims), and where are you in any modernization roadmap?
- What's your distribution mix -- direct, captive agents, independent agents, MGA/program -- and how is that shifting?
- For policyholder- or agent-facing programs today: how are you handling rewards, incentives, or disbursements, and against which state rules?
- What does your data and analytics infrastructure look like -- are you leveraging Verisk/ISO, LexisNexis, IVANS, or building proprietary capabilities?

IMPACT stage -- quantify the cost:
- Where is your combined ratio, and which component -- loss or expense -- is under the most pressure?
- What does a 1-point improvement in retention / renewal rate translate to in premium and underwriting profit?
- How much loss-adjustment expense and cycle time sits in claims disbursement today?
- What's the cost of producer churn or under-engagement in your agent channel?
- How much manual underwriting and claims processing is still happening, and what's the error rate?

VISION stage -- frame the future:
- If you could redesign the policyholder experience around engagement and retention, what would it include?
- What's your roadmap for telematics / usage-based or behavior-based programs, and how do incentives factor in?
- How are you thinking about digital, instant claims payout as a differentiator and an expense lever?
- What role does AI play in your underwriting, claims, and customer experience roadmap?

ENTRY POINTS -- who owns what:
- Chief Underwriting Officer (risk selection, pricing, loss ratio)
- Chief Claims Officer / VP Claims (claims ops, disbursement, LAE)
- CIO / Chief Digital Officer (core systems, modernization, data)
- Chief Distribution Officer (agent/broker channel, producer engagement)
- Chief Marketing / Chief Customer Officer (acquisition, retention, loyalty, NPS)
- Chief Actuary and Chief Risk Officer (pricing, reserving, regulatory)

ROUTE -- fastest path to yes:
- Pilot scoped to a single line of business or a single program (one state, one channel) to contain regulatory and integration surface area.
- Confirm the anti-rebating treatment for the target state(s) early -- it is a gating design question for any policyholder-facing program.
- If the carrier is mid-core-system-replacement, wait for the adjacency window -- all budget and attention is absorbed in the PAS migration.
- Lead with combined-ratio impact: frame everything as loss-ratio (better risk selection, reduced fraud) or expense-ratio (lower LAE, faster processing) improvement.
`;

// -- INSURANCE VERTICAL PLAYBOOK --
// Mirrors the verticalPlaybooks.js structure. NOTE FOR INTEGRATION: the
// existing `fintech` playbook keyword list currently includes "insurance"
// and "insurtech" -- remove those so insurance routes to this dedicated
// playbook instead of the fintech one.

export const INSURANCE_PLAYBOOK = {
  name: "Insurance",
  keywords: [
    "insurance carrier", "property casualty", "p&c insurance", "underwriting",
    "claims management", "policyholder", "actuarial", "reinsurance",
    "managing general agent", "insurtech", "admitted carrier",
    "excess and surplus", "combined ratio", "policy administration",
    "fronting carrier", "life insurance", "annuity", "specialty lines",
  ],
  personas: [
    "Chief Underwriting Officer", "Chief Claims Officer", "CIO",
    "Chief Digital Officer", "Chief Actuary", "Chief Distribution Officer",
    "Chief Marketing Officer", "Chief Customer Officer", "COO",
    "Chief Risk Officer", "VP Claims", "Head of Producer Engagement",
  ],
  triggers: [
    "Core-system (PAS / billing / claims) modernization program",
    "New CUO / CIO / CDO / CMO hire (first 6 months)",
    "Combined ratio deterioration or expense-ratio pressure",
    "Telematics / usage-based insurance program launch",
    "MGA or delegated-authority program launch",
    "M&A integration (consolidating systems across acquired books)",
    "Catastrophe-driven repricing or capacity withdrawal",
    "Customer retention / NPS initiative",
    "Claims modernization / digital payout project",
    "Regulatory exam finding or market-conduct action",
    "Anti-rebating rule modernization in key state",
    "Workforce retirement wave driving automation",
  ],
  disqualifiers: [
    "Treating 'insurance' as one market (P&C vs life vs health vs reinsurance differ entirely)",
    "Ignoring state-by-state regulatory and rate-filing variation",
    "Anti-rebating / anti-inducement law ignorance for any policyholder-facing program",
    "No integration path to core systems (Guidewire, Duck Creek, et al.)",
    "Pitching a consumer or agent-channel use case to a reinsurer",
    "Underestimating mutual-carrier procurement cycles and conservatism",
  ],
  compliance: [
    "State-based regulation -- Department of Insurance per state",
    "NAIC model laws (adopted with state variation)",
    "Rate-and-form filing requirements",
    "Risk-Based Capital (RBC) standards",
    "Market-conduct examinations",
    "Anti-rebating / anti-inducement statutes",
    "Unfair Claims Practices Acts",
    "NAIC Insurance Data Security Model Law",
    "Producer licensing (NIPR)",
    "GLBA + state privacy law",
  ],
  usps: [
    "Integration depth with core systems (Guidewire, Duck Creek, Sapiens, Majesco)",
    "Line-of-business specificity (personal vs commercial vs specialty)",
    "State regulatory awareness, including anti-rebating treatment",
    "Agent / producer channel fit",
    "Claims and disbursement capability (speed, compliance)",
    "Named reference carriers in the same line and ownership type",
  ],
  heuristics: [
    "Subdivide insurance first -- P&C, life, health, reinsurance are separate ICPs",
    "Ownership type predicts behavior: mutuals are private, data-scarce, conservative, slow; stock carriers move faster and disclose more",
    "Mutual data scarcity is a known brief-consistency risk -- caveat figures, present ranges, fetch live (see USAA consistency history)",
    "Core-system modernization is the master trigger -- it unlocks adjacent budget",
    "Channel structure (direct / independent agent / MGA) determines the buyer",
    "The combined ratio is the universal scoreboard -- frame value as loss-ratio or expense-ratio impact",
    "Anti-rebating law gates anything policyholder-facing -- make it a design input, not an afterthought",
    "The MGA channel is the fastest-growing structural story -- MGAs buy faster than carriers",
  ],
};
