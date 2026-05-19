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

// -- INSURANCE INDUSTRY INJECTION --
// Injected when the seller or target operates in insurance: carriers, MGAs,
// brokers, reinsurers, insurtech, or insurance-adjacent services.

export const INSURANCE_INDUSTRY_INJECTION = `
INSURANCE INDUSTRY CONTEXT (use when the target or seller is an insurance carrier, MGA, broker/agency, reinsurer, fronting carrier, or insurtech):

VALUE CHAIN -- WHO BEARS RISK, WHO DISTRIBUTES, WHO SERVICES (structural):
- CARRIER (insurer): holds the license, the balance sheet, and the risk. Files rates and forms with regulators. Pays claims. The risk-bearer.
- REINSURER: the carrier's carrier -- assumes a share of the carrier's risk for a share of premium. Smooths catastrophe and volatility. (Munich Re, Swiss Re, Berkshire, Lloyd's syndicates.)
- BROKER / AGENT: distribution and advice. Independent agents represent multiple carriers; captive agents represent one. Brokers advise the buyer. Earn commission.
- MGA (Managing General Agent): holds DELEGATED UNDERWRITING AUTHORITY from a carrier -- can bind coverage, underwrite, price, sometimes handle claims, on the carrier's paper. Specializes in niche/specialty lines where carriers lack in-house expertise.
- FRONTING CARRIER: a licensed carrier that "rents" its paper -- issues policies on behalf of MGAs and transfers most of the risk to reinsurers. Enables MGAs and capital to access regulated markets. (State National, AF Group, Core Specialty are leading platforms [verified 2026, Morningstar DBRS].)
- TPA (Third-Party Administrator): outsourced claims/policy administration.

CARRIER TYPES -- "INSURANCE" IS NOT ONE MARKET (structural -- subdivide first):
- PROPERTY & CASUALTY (P&C): personal lines (auto, home) + commercial lines (commercial auto, GL, property, workers' comp) + specialty/E&S (cyber, professional liability, marine, niche risks).
- LIFE & ANNUITY: mortality/longevity products, retirement/annuity. Different regulators' emphasis, different distribution, different economics.
- HEALTH: medical, dental, supplemental. Overlaps with healthcare-payer dynamics -- see healthcare layers.
- REINSURANCE: wholesale risk transfer to other carriers.
OWNERSHIP MATTERS: STOCK insurers are shareholder-owned (public data-rich). MUTUAL insurers are policyholder-owned (private, data-scarce, conservative, long buying cycles). A mutual like USAA or State Farm will have far less public financial data and more conservative procurement than a stock carrier -- expect figures to be ranges, caveat them, and fetch live.

ECONOMIC MODEL -- THE COMBINED RATIO IS THE UNIVERSAL SCOREBOARD (structural):
- COMBINED RATIO = Loss Ratio + Expense Ratio. Below 100% = underwriting profit; above 100% = underwriting loss.
  - Loss Ratio = (incurred losses + loss adjustment expenses) / earned premium.
  - Expense Ratio = underwriting expenses / premium.
- FLOAT: premium is collected before claims are paid; carriers invest the float. Investment income can subsidize an underwriting loss -- but a carrier running >100% combined ratio long-term is structurally unhealthy.
- MARKET CYCLE: HARD market = rising rates, tight capacity, carriers selective. SOFT market = falling rates, abundant capacity, competition for premium. The 2023-2025 hard market is now softening [verified 2026, Deloitte / Triple-I].

MARKET STRUCTURE & SIZE (cyclical -- dated):
- US P&C insurance market ~$1.0-1.14T [verified 2026, Mordor Intelligence $1.14T / IBISWorld $1.0T -- note: differing premium bases]. Total US insurance market (all lines) ~$2.27T [verified 2026]. Global insurance ~$8.33T [verified 2025].
- ~4,700 US insurance companies: ~2,684 P&C, ~717 life, ~1,331 health [verified 2026, CoinLaw]. The top 10 carriers control ~50% of total premium.
- P&C combined ratio ~92% for full-year 2025 -- the lowest in over a decade, aided by a no-landfall hurricane season despite the Jan 2025 LA wildfires [verified Q1 2026, Triple-I/Milliman]. Premium growth is slowing into 2026 (~3-6% across lines) as the market softens.
- E&S (excess & surplus / non-admitted) market has grown sharply -- $130B+ direct premiums written [verified 2026, Insurance Insider]. E&S covers risks the admitted market won't.

DISTRIBUTION & THE MGA BOOM (cyclical -- dated):
- MGA channel is the fastest-growing structural story in P&C. US MGA premium ~$114B DPW for 2024, +16% YoY [verified 2026, Conning] -- or ~$90.4B "MGA-sourced" DPW on a narrower base [verified 2026, Morningstar DBRS]; MGAs now ~9-10% of US P&C premium. >1,000 US MGA participants; MGA premium grew ~90% over five years vs ~49% for P&C overall.
- Private equity owns 30%+ of US MGA entities, drawn by asset-light, fee-based models with 20-30% EBITDA margins [verified 2026, Deloitte].
- Fronting carriers wrote ~$29.1B DPW in 2024; the top 10 fronting carriers hold ~69% of MGA-dedicated premium [verified 2026, Morningstar DBRS].

TECHNOLOGY LANDSCAPE (structural categories + dated vendor facts):
- Every carrier runs three CORE SYSTEMS: a Policy Administration System (PAS), a Billing system, and a Claims system -- plus a rating/underwriting workbench, distribution management, and BI/analytics. Core-system replacement is a multi-year, high-budget program; any cached "Carrier X runs Vendor Y" mapping decays -- fetch the specific carrier's current stack live.
- Insurance software market ~$15.03B in 2026, ~6.31% CAGR [verified 2026, Mordor].
- Vendor archetypes [verified 2026, Gartner/Mordor]: GUIDEWIRE -- dominant enterprise P&C core ($1.2B revenue, ~19% ARR growth, landmark 10-year Liberty Mutual cloud deal [verified late 2025]). DUCK CREEK -- cloud P&C core, Vista Equity-owned, positions on implementation speed. SAPIENS / MAJESCO -- mid-market and international strength. INSURITY -- mid-market P&C. EIS / SOCOTRA -- API-native, digital-first/insurtech deployments. APPLIED SYSTEMS / VERTAFORE -- dominate agency/distribution management. Specialist AI: SHIFT TECHNOLOGY, FRISS (fraud/claims). PE has poured $6B+ into insurance software vendors since 2024.
- Data & rating ecosystem (structural): Verisk/ISO (rating bureau and loss-cost data), LexisNexis Risk Solutions, CLUE (claims-history database), IVANS (carrier-agency connectivity).
- Tech adoption: ~76% of carriers use AI in at least one function; ~47% of policies are purchased digitally [verified 2026, CoinLaw]. Telematics/usage-based insurance is mainstreaming -- Progressive reports 60%+ of new auto policies include telematics [verified 2026, Progressive 2024 Annual Report].
- WORKFORCE: ~400,000 industry retirements expected by 2026 -- a talent cliff driving automation and modernization pressure [verified 2026, CoinLaw].

REGULATORY ARCHITECTURE (structural -- durable):
- Insurance is STATE-REGULATED. There is no federal insurance regulator (McCarran-Ferguson Act). Each state has a Department of Insurance; carriers file rates and forms state by state.
- The NAIC (National Association of Insurance Commissioners) coordinates: it writes MODEL LAWS that states adopt (with variation), and publishes market-share and financial data.
- Key regulatory mechanics: rate-and-form filing, market-conduct exams, Risk-Based Capital (RBC) requirements, state guaranty funds, unfair-claims-practices acts, producer licensing (NIPR), and the NAIC Insurance Data Security Model Law (cybersecurity).
- ANTI-REBATING / ANTI-INDUCEMENT LAWS (critical for any rewards, loyalty, gift, or incentive use case): most states restrict insurers and producers from giving policyholders or prospects anything of value as an inducement to buy or keep a policy. Many states have modernized these rules (value-added services, de-minimis gift thresholds), but the rules vary by state and are a real design constraint. Any policyholder-facing rewards/incentive program must be structured against the specific state's current anti-rebating rules -- surface this, do not assume.

BUYER-ROLE TAXONOMY (structural -- who owns budget):
- Chief Underwriting Officer (CUO): underwriting strategy, risk selection, pricing, loss ratio.
- Chief Claims Officer / VP Claims: claims operations, loss adjustment expense, claims tech, disbursement.
- CIO / Chief Digital Officer / Chief Information Officer: core systems, modernization roadmap, data/analytics.
- Chief Actuary: pricing models, reserving, RBC.
- Chief Distribution Officer / Chief Sales Officer: agent/broker channel, producer engagement.
- Chief Marketing Officer / Chief Customer Officer: acquisition, retention, NPS, loyalty.
- COO / Chief Risk Officer: operations, regulatory, enterprise risk.

GTM IMPLICATIONS (structural):
- Subdivide before selling: P&C, life, health, and reinsurance are different ICPs with different buyers, cycles, and economics.
- Ownership type predicts buying behavior: mutuals are conservative, private, data-scarce, slow; stock carriers move faster and disclose more.
- Core-system modernization is the master buying trigger -- it opens adjacent budget for everything that integrates with the new PAS/claims platform.
- Channel structure determines the buyer: a direct writer, an independent-agency carrier, and an MGA-driven program each route to a different decision-maker.
- For any policyholder-facing program, anti-rebating law is a gating design question, not an afterthought.
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
    ],
    negative: [
      "State anti-rebating / anti-inducement constraints unaddressed for a policyholder-facing program",
      "Locked into an incumbent loyalty / recognition / disbursement vendor",
      "Reinsurer or pure risk-transfer entity with no end-customer or agent touchpoint",
      "Conservative mutual mid-core-system-replacement (all budget and attention absorbed)",
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

IMPACT stage -- quantify the cost:
- Where is your combined ratio, and which component -- loss or expense -- is under the most pressure?
- What does a 1-point improvement in retention / renewal rate translate to in premium and underwriting profit?
- How much loss-adjustment expense and cycle time sits in claims disbursement today?
- What's the cost of producer churn or under-engagement in your agent channel?

VISION stage -- frame the future:
- If you could redesign the policyholder experience around engagement and retention, what would it include?
- What's your roadmap for telematics / usage-based or behavior-based programs, and how do incentives factor in?
- How are you thinking about digital, instant claims payout as a differentiator and an expense lever?

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
