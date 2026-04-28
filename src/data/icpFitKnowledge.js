// src/data/icpFitKnowledge.js
//
// Structured knowledge extracted from icp-fit-knowledge-base.md.
// Served via /api/knowledge.js (server-side, JWT-auth'd).
// NOT bundled into the client — fetched at runtime.

// ── Lincoln Murphy: RWAS criteria ──────────────────────────────────────────
export const MURPHY_RWAS = {
  ready: "The prospect has the trigger, urgency, and preconditions to act. There is a compelling event.",
  willing: "They want to solve the problem now — not 'interesting, maybe someday.'",
  able: "They have authority, budget, technical prerequisites, and organizational capacity.",
  successful: "If they buy, they will actually achieve their desired outcome, renew, and expand.",
  desiredOutcome: "Required Outcome + Appropriate Experience. Product must deliver both.",
  badFitRule: "Bad-fit customers generate support load, NPS damage, churn, and rep demoralization. Saying no is a revenue strategy.",
  successGap: "Distance between product capability and desired outcome. If you throw bodies at every deal, your ICP is narrower than you think.",
};

// ── Murphy: ICP criteria taxonomy (7 dimensions) ─────────────────────────
export const MURPHY_CRITERIA = [
  "Firmographic — industry, size, geo, revenue, funding stage",
  "Demographic — the humans who buy/use (persona-adjacent)",
  "Environmental — market conditions, regulatory, competitive",
  "Behavioral — data maturity, sales process, tech adoption",
  "Psychographic — values, risk tolerance, strategic priorities",
  "Needs-based — specific pain they are actively trying to solve",
  "Timing / Trigger — the compelling event creating urgency",
];

// ── Dunford: 5 positioning components ──────────────────────────────────────
export const DUNFORD_POSITIONING = [
  "Competitive alternatives — what the customer would use if your product didn't exist (including do-nothing, spreadsheets, consultant)",
  "Unique attributes — features/capabilities alternatives lack",
  "Value — benefit the customer gets from those unique attributes",
  "Who cares a lot — the segment for whom that value is significant (THIS IS THE ICP)",
  "Market category — frame of reference for evaluation",
];
export const DUNFORD_SALES_PITCH = "Insight → Alternatives & shortcomings → Perfect world → Your approach → Proof → Ask";

// ── Moesta: JTBD Four Forces ───────────────────────────────────────────────
// Operationalized in fit scoring via signals:
//   Push/Pull → positive signals (funding, hiring, mandate) increase fit
//   Anxiety/Habit → negative signals (union, regulatory, incumbent lock-in) decrease fit
// High-friction industries have structurally high Anxiety + Habit.
export const FOUR_FORCES = {
  push: "What about current state makes them uncomfortable (pain with status quo)",
  pull: "What about the new solution attracts them (promise of future)",
  anxiety: "Fears about switching (uncertainty, implementation risk, career risk)",
  habit: "Inertia keeping them where they are (sunk cost, comfort, relationships)",
  rule: "Purchase happens only when Push + Pull exceeds Anxiety + Habit. Most ICP definitions ignore Anxiety and Habit.",
  scoring: "In fit scoring: positive signals map to Push/Pull forces; negative signals and high-friction industry reasons map to Anxiety/Habit forces. The framework is implicit in how signals affect the score.",
};

// ── WbD: SPICED discovery framework ────────────────────────────────────────
export const SPICED = {
  S: "Situation — what's their current state?",
  P: "Pain — what's the explicit problem?",
  I: "Impact — what's the measurable cost of the pain?",
  C: "Critical Event — what forces action by when?",
  E: "Emotion — how does this problem make the buyer FEEL? (frustrated, embarrassed, anxious, exposed)",
  D: "Decision — who decides, how, and on what criteria?",
  rule: "If a 'perfect ICP' account has no Critical Event, it's not buying this cycle. If there's no Emotion, there's no urgency.",
};

// ── WbD: ICP Scorecard dimensions ──────────────────────────────────────────
export const WBD_SCORECARD = [
  { dimension: "Firmographic fit", weight: 15, criteria: "Industry, size, geo, funding stage" },
  { dimension: "Technographic fit", weight: 10, criteria: "Core system of record, integrations, tech maturity" },
  { dimension: "Regulatory fit", weight: 15, criteria: "Required certs, data residency, regulatory regime. If ≤2, deal is blocked." },
  { dimension: "Buying posture", weight: 10, criteria: "Has named owner, budget, decision authority mapped" },
  { dimension: "Timing / trigger", weight: 15, criteria: "Compelling event identified, decision timeline ≤90 days" },
  { dimension: "Pain severity", weight: 15, criteria: "Measurable cost of inaction, frequency, org visibility" },
  { dimension: "Success potential", weight: 15, criteria: "Will reach Impact stage, willing to integrate, has success owner" },
  { dimension: "Expansion potential", weight: 5, criteria: "Adjacent teams / geos / use cases visible" },
];

// ── Balfour: Four Fits ─────────────────────────────────────────────────────
export const FOUR_FITS = [
  "Market ↔ Product — the product solves a real problem for a definable market",
  "Product ↔ Channel — product characteristics match channel requirements",
  "Channel ↔ Model — channel economics support the business model",
  "Model ↔ Market — revenue model matches how the market buys",
];

// ── ICP failure modes ──────────────────────────────────────────────────────
export const ICP_FAILURE_MODES = [
  "Descriptive, not predictive — describes existing customers instead of identifying which will succeed and expand",
  "Marketing artifact, never operationalized — doc sits in Notion, reps don't disqualify with it",
  "Firmographic only — 'mid-market fintech in NA' is a segment, not an ICP",
  "No 'bad fit' definition — if you can't describe accounts to decline, you don't have an ICP",
  "Ignores success potential — filtering for buyers, not successful customers",
  "Built from sales, not customers — interviews reps instead of actual customers",
  "Static — revisited annually at best while market shifts constantly",
];

// ── Disqualification framework ─────────────────────────────────────────────
export const DISQUALIFICATION = {
  hard: [
    "Regulatory posture we can't meet (data residency, certifications)",
    "Technology prerequisite absent (no integration path for 18+ months)",
    "Fundamental model mismatch (RFP-only procurement, we don't do RFPs)",
    "Industry we refuse on risk/reputation grounds",
  ],
  soft: [
    "Deal size below profitable floor → route to partner or self-serve",
    "Complexity exceeds current services capacity → defer",
    "No trigger, no budget, no champion → long-cycle nurture only",
  ],
  yellow: [
    "Only one champion, no backup → build coach before proposal",
    "Budget exists but not allocated → validate with procurement early",
    "Previously failed with competitor → understand why before committing",
  ],
  healthyRate: "30-50% SDR-stage disqualification is healthy for mid-market B2B",
};

// ── Fintech-specific ICP considerations ────────────────────────────────────
export const FINTECH_ICP = {
  buyingCommittee: [
    "Economic buyer (CFO, Head of Payments, VP Treasury)",
    "Champion (senior ops/payments manager who owns the pain)",
    "Technical evaluator (Engineering lead with payments domain expertise)",
    "Risk & Compliance (Risk Officer, Compliance, Fraud Ops — frequent deal killer)",
    "Legal & Regulatory (data residency, PCI, BSA/AML, money transmitter)",
    "Security (SOC 2, pen tests, SIG questionnaires, cloud architecture)",
    "Procurement / Vendor Management (MSA, vendor risk, third-party oversight)",
    "Internal Audit (for enterprise/bank buyers — control mapping)",
  ],
  regulatoryFilters: [
    "SOC 2 Type II, PCI-DSS, ISO 27001, HIPAA, HITRUST",
    "Data residency (US-only, EU-only, country-specific)",
    "Regulated FI under OCC/FDIC/NCUA/FinCEN supervision",
    "BSA/AML posture (CIP, sanctions screening, SAR integration)",
    "Reg E, Reg Z, Reg CC, Durbin amendment, Nacha rules",
    "International: PSD2/SCA, GDPR, MiCA, Open Banking",
  ],
  readyTriggers: [
    "Compliance event (audit finding, regulatory exam, new rule) with deadline",
    "Vendor change (incumbent sunset, pricing change, M&A-forced migration)",
    "Volume threshold crossed (new processor needed, new unit economics)",
    "Fraud / loss event forcing risk-tool purchase",
    "Strategic program (new product, new geo, new payment rail)",
  ],
  uniqueAttributes: [
    "Licensing / network membership (MTL, card network, ACH, FedNow)",
    "Certifications (PCI Level 1, ISO 20022, Nacha Preferred Partner)",
    "Bank partnerships / BaaS posture (sponsor bank, charter)",
    "Settlement speed / economics (same-day ACH, RTP, instant, FX)",
    "Programmable primitives (API completeness, webhooks, SDK maturity)",
    "Dispute / chargeback handling (automated, Reg E timelines)",
    "Reconciliation / reporting (GL-ready, audit trails, ASC 606)",
  ],
};

// ── Prompt injection for ICP build ─────────────────────────────────────────
export const ICP_KNOWLEDGE_INJECTION = `
ICP FRAMEWORKS (apply ALL — they are complementary, not competing):
- MURPHY (Customer Success): filter by success potential, not just buying potential. Ready + Willing + Able + Successful. Bad-fit customers who buy are worse than no customers.
- DUNFORD (Positioning): ICP falls out of positioning. "Who cares a lot" about your unique value? Competitive alternatives → Unique attributes → Value → Who cares → Market category.
- MOESTA (JTBD): what progress are they trying to make? Four Forces: Push of pain + Pull of new > Anxiety of change + Habit of present. Without a trigger, no purchase.
- FITZPATRICK (Mom Test): ICP criteria must be testable with past-behavior questions, not hypothetical futures.
- WBD (SPICED): Situation + Pain + Impact + Critical Event + Decision. No Critical Event = not buying this cycle.
- MOORE (Crossing the Chasm): choose a beachhead and dominate it. ICP is the beachhead definition.
- BALFOUR (Four Fits): ICP only valid in context of specific channels and models. Expansion changes all four fits.
- 6SENSE: 70% of buying journey is anonymous. ICP must include intent signals, not just firmographics.

ICP MUST INCLUDE:
- Timing/trigger criteria (without this, it's a segmentation doc, not an ICP)
- Disqualifiers (if you can't describe who to decline, you don't have an ICP)
- Success potential (Murphy's "Successful" criterion — will they renew and expand?)
- Buying committee map (especially for fintech: 8+ personas including compliance, legal, security)

ICP FAILURE MODES TO AVOID:
- Descriptive not predictive
- Firmographic only (missing behavioral, psychographic, timing)
- No bad-fit definition
- Built from sales interviews, not customer interviews
- Static / never operationalized
`;

// ── Prompt injection for discovery questions ──────────────────────────────
export const DISCOVERY_KNOWLEDGE_INJECTION = `
JTBD INTERVIEW METHOD (Moesta):
- Reconstruct the timeline: First thought → Passive looking → Active looking → Decision → First use
- "Tell me about the day you decided to buy X" > "Why do you use X?"
- Four Forces: what pushed them away from status quo? What pulled toward new? What anxieties slowed them? What habits held them back?

SPICED DISCOVERY (Winning by Design):
- Situation → Pain → Impact → Critical Event → Decision
- If no Critical Event surfaced, the deal is informational, not in-market.

SIGNAL QUALITY (Fitzpatrick):
- BAD: compliments, fluff, generics, opinions about future
- GOOD: specific past stories, facts/numbers, emotion about lived pain, COMMITMENTS (time, money, reputation, intro), scheduled NEXT STEPS
- If the meeting ends in "let's keep in touch" — it failed.

DISQUALIFICATION (Murphy):
- Track disqualification rate. Below 20% = ICP not doing work. Above 60% = ICP too narrow or lead generation too broad.
- Bad-fit customers consume 2-3x rep time and 5-10x CS time, then churn.
`;

// ── Fitzpatrick: The Mom Test ────────────────────────────────────────────
export const FITZPATRICK_MOM_TEST = {
  principle: "Talk about their life, not your idea. Ask about specifics in the past, not generics or opinions about the future. Talk less, listen more (70%+ from interviewee).",
  badSignals: ["Compliments ('Great idea!')", "Fluff ('I would definitely use that')", "Generics ('People usually...')", "Opinions about future ('I'd pay $X')"],
  goodSignals: ["Specific stories about past behavior", "Facts and numbers about current workflow/cost/time", "Emotion about actual lived pain", "Commitments (time, money, reputation, introduction)", "Scheduled next steps (concrete follow-up action)"],
  commitmentTest: "Every meeting ends in either a Commitment (they give something of value) or an Advancement (scheduled next step increasing commitment). If it ends in 'let's keep in touch' — it failed.",
};

// ── Moore: Crossing the Chasm ────────────────────────────────────────────
export const MOORE_CHASM = {
  principle: "A chasm exists between Early Adopters (visionaries) and Early Majority (pragmatists). Pragmatists buy on references from other pragmatists in their own industry — they don't trust Early Adopter case studies.",
  beachheadStrategy: "Pick one narrow vertical or use case to dominate completely. Win 100% of a small segment rather than 5% of a large one. Use that beachhead to generate references, integrations, and ecosystem for expansion.",
  adoptionLifecycle: ["Innovators", "Early Adopters", "CHASM", "Early Majority", "Late Majority", "Laggards"],
  implication: "Most modern ICP frameworks assume the beachhead has been chosen. Moore reminds you the choice of beachhead IS the strategic decision.",
};

// ── 6sense / Conant: Account-Based Revenue ───────────────────────────────
export const SIXSENSE_ABM = {
  principle: "~70% of B2B buying journey happens before buyer identifies themselves (the 'dark funnel'). Waiting for leads to self-identify = losing 70% of the market.",
  sixStageJourney: [
    { stage: "Target", description: "Fits ICP, no activity" },
    { stage: "Awareness", description: "Early signals — site visits, topic searches" },
    { stage: "Consideration", description: "Deeper research, multiple people involved" },
    { stage: "Decision", description: "Evaluation behavior, competitive comparison" },
    { stage: "Purchase", description: "In active deal" },
    { stage: "Post-Purchase", description: "Expansion, advocacy" },
  ],
  keyInsights: [
    "Uncovered demand > generated demand — find where demand exists, don't try to create it",
    "Account, not lead — buying is done by accounts, not individuals; score at account level",
    "Orchestration over sequence — run coordinated plays across channels timed to in-market signals",
  ],
  applicability: "Requires $50K+ ACV, identifiable target accounts, and martech stack for intent data. Overkill for PLG or transactional products.",
};

// ── Laja / CXL: Research Rigor ──────────────────────────────────────────
export const LAJA_CXL = {
  principle: "Apply CRO research discipline to GTM questions. Quantitative methodology complements qualitative frameworks.",
  researchXL: ["Heuristic analysis", "Web analytics (behavioral data)", "Qualitative user testing", "Session recordings", "Surveys (structured quantitative)", "Voice of Customer (quotes, tickets, reviews, calls)", "Technical analysis"],
  highLeverageSurveyQuestions: [
    "What almost stopped you from buying?",
    "What other options did you consider?",
    "Segment responses by outcome (churned vs retained, expanded vs flat) to find ICP signal",
  ],
  voc: "The language your best customers use to describe the problem IS your messaging copy, and it's free.",
};

// ── Discovery Interview Question Bank ───────────────────────────────────
// Blended from Mom Test (Fitzpatrick), JTBD (Moesta), SPICED (WbD), and
// Dunford positioning. Adapt to 8-12 questions per interview.
export const DISCOVERY_QUESTION_BANK = {
  opening: [
    "Can you walk me through your role and what your team is accountable for?",
    "What are the top 2-3 outcomes you're personally measured on this year?",
    "Tell me about a typical week — what's the mix of things you're doing?",
  ],
  switchingMoment: [
    "Tell me about the day you first realized you needed to solve [problem X]. What happened?",
    "Between that first thought and actually deciding to look for a solution, what changed?",
    "When you started evaluating options, what were you looking at? In what order?",
    "Who else was involved in the decision? What was each person's role?",
    "What almost caused you to not buy? What were you worried about?",
  ],
  currentStatePain: [
    "The last time [problem X] happened, what did you do?",
    "How often does that happen in a typical month? How long does it take each time?",
    "What's the cost — time, money, team morale — of that problem over a quarter?",
    "What have you tried before to fix it? What happened?",
  ],
  buyingProcess: [
    "If you decided to solve this, who would need to approve a purchase?",
    "What would cause this to become a must-do-now priority rather than a nice-to-have?",
    "What's on your team's roadmap for the next 2 quarters that might force action?",
    "Is there a budget line item for this, or would it need to be carved out?",
  ],
  competitiveAlternatives: [
    "If you had to solve this today without any new vendor, how would you do it?",
    "What vendors or approaches have you heard about in this space?",
    "What would be the 'boring' default choice if you had to pick one tomorrow?",
  ],
  successDefinition: [
    "Imagine it's a year from now and this is working perfectly. What's different?",
    "How would you know it was working? What would you measure?",
    "What would have to be true about the vendor for you to be successful?",
  ],
  commitmentTest: [
    "Who else should I be talking to about this?",
    "Would you be willing to introduce me to [specific person]?",
    "If a product existed that did [capability], would you want to see it? What's a good next step?",
  ],
};
