// src/data/advancedKnowledge.js
//
// Structured knowledge from 6 advanced playbook files:
// - competitive-battle-cards.md
// - discovery-call-scorecard.md
// - junior-rep-onboarding-playbook.md
// - offer-fit-mapping.md
// - qbr-template.md
// - solution-fit-cards.md
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

// ── COMPETITIVE BATTLE CARDS ──────────────────────────────────────────────
export const BATTLE_CARD_FRAMEWORK = {
  principle: "Change what the buyer evaluates, not just how (Dunford reframing)",
  template: [
    "Competitor overview: honest read on strengths AND weaknesses",
    "When we win against them: specific conditions",
    "When they win against us: specific conditions (be honest)",
    "Our reframe: shift the evaluation axis to our ground",
    "Trap questions: 3-5 that expose our strengths without disparaging",
    "Proof points: stories, data, named customers",
    "If you hear X → respond with Y map",
  ],
  rules: [
    "Review card before call, don't read from it during",
    "Never disparage — reframe the evaluation criteria instead",
    "If 'they're cheaper': compare scope-for-scope, not headline rate",
    "If 'board wants recognized firm': ask 'recognized for what?'",
    "If 'we've used [competitor] before': ask 'what did you wish was different?'",
    "Update cards quarterly or on competitor events (funding, pivots, pricing changes)",
  ],
};

// ── DISCOVERY CALL SCORECARD ──────────────────────────────────────────────
export const DISCOVERY_SCORECARD = {
  dimensions: [
    { name: "Preparation", weight: 10, criteria: "Account research visible in questions; not generic; references specific company context" },
    { name: "Opening", weight: 10, criteria: "Sets agenda, time check, earns right to ask. Not a pitch — a conversation frame" },
    { name: "Pain Discovery", weight: 20, criteria: "Gets to specific, quantified pain. Past behavior not hypotheticals (Mom Test). Goes 3 levels deep" },
    { name: "Impact Quantification", weight: 15, criteria: "Surfaces cost of inaction in dollars, time, or risk. Gets the prospect to state the number" },
    { name: "Buying Process", weight: 15, criteria: "Maps decision-makers, timeline, budget, criteria. Knows who can say yes AND who can say no" },
    { name: "Active Listening", weight: 10, criteria: "Mirrors, labels, paraphrases. 70%+ talk time is prospect. Doesn't interrupt" },
    { name: "Next Steps", weight: 10, criteria: "Concrete commitment: named person, named action, named date. Not 'let's circle back'" },
    { name: "Competitive Intel", weight: 10, criteria: "Surfaces alternatives being considered. Understands what 'do nothing' looks like" },
  ],
  scoring: {
    1: "Did not attempt or actively harmful",
    2: "Attempted but ineffective or surface-level",
    3: "Competent — met basic expectations for this dimension",
    4: "Strong — exceeded expectations, showed skill",
    5: "Exceptional — textbook example, could be used for training",
  },
  thresholds: {
    certification: 80,  // >= 80: rep is certified, ready for independent selling
    coaching: 60,       // 60-79: rep needs coaching, pair with senior on next calls
    remediation: 0,     // < 60: remediation required, review fundamentals before next call
  },
};

// ── OFFER-FIT MAPPING ─────────────────────────────────────────────────────
export const OFFER_FIT_FRAMEWORK = {
  principle: "Map the prospect's situation to a specific offer shape — not just 'we can help' but 'here is exactly what engagement looks like'",
  offerTypes: [
    { type: "Diagnostic", trigger: "Prospect knows something is wrong but can't articulate what", deliverable: "Assessment report with prioritized findings", duration: "2-4 weeks", pricing: "Fixed fee" },
    { type: "Pilot / POC", trigger: "Prospect needs proof before committing", deliverable: "Working prototype or limited deployment with success criteria", duration: "30-90 days", pricing: "Reduced fee, success-gated expansion" },
    { type: "Implementation", trigger: "Decision made, need execution", deliverable: "Deployed solution with training and handoff", duration: "3-12 months", pricing: "Project fee or T&M with cap" },
    { type: "Managed Service / Retainer", trigger: "Ongoing need, no internal capacity", deliverable: "Continuous operation or advisory", duration: "12+ months", pricing: "Monthly retainer" },
    { type: "Training / Enablement", trigger: "Team capability gap", deliverable: "Curriculum, workshops, certification", duration: "1-8 weeks", pricing: "Per-seat or cohort fee" },
  ],
  fitSignals: [
    "If prospect says 'we don't know what we don't know' → Diagnostic",
    "If prospect says 'we need to prove ROI first' → Pilot",
    "If prospect says 'we've decided, how fast can you start' → Implementation",
    "If prospect says 'we don't have the team for this' → Managed Service",
    "If prospect says 'our team needs to learn this' → Training",
  ],
  disqualificationSignals: [
    "No named pain owner — who specifically feels this?",
    "No budget or budget process — how do you buy things like this?",
    "No timeline or compelling event — what makes this urgent now?",
    "Committee without a champion — who will drive this internally?",
    "Scope creep in discovery — they want everything, will commit to nothing",
  ],
};

// ── JUNIOR REP ONBOARDING (90-day curriculum) ─────────────────────────────
export const REP_ONBOARDING = {
  phases: [
    { phase: "Week 1-2: Foundation", focus: "Product knowledge, ICP understanding, tool proficiency, shadow calls", milestone: "Can articulate what we sell, to whom, and why in 60 seconds" },
    { phase: "Week 3-4: Discovery Craft", focus: "Mom Test questions, SPICED framework, active listening, call recording review", milestone: "Runs a discovery call that scores 60+ on the scorecard" },
    { phase: "Week 5-8: Pipeline Building", focus: "Outbound sequences, qualification, objection handling, first solo calls", milestone: "Books 3+ qualified meetings independently" },
    { phase: "Month 3: Independence", focus: "Full deal cycle, proposal writing, negotiation basics, forecast accuracy", milestone: "Closes first deal or advances 2+ deals past discovery" },
  ],
  certificationGates: [
    "ICP quiz: can correctly identify 5 fit and 5 non-fit accounts with reasoning",
    "Discovery scorecard: 3 consecutive calls scoring 70+",
    "Competitive: can handle the top 3 'we're also looking at X' scenarios",
    "Demo: delivers a 15-minute value demo that follows insight → alternative → approach → proof",
    "Objection handling: handles 5 common objections live without breaking",
  ],
};

// ── QBR TEMPLATE ──────────────────────────────────────────────────────────
export const QBR_FRAMEWORK = {
  sections: [
    { section: "Results vs. Plan", content: "Pipeline, revenue, win rate, deal velocity, ASP vs. targets. Red/yellow/green with specific deltas" },
    { section: "ICP Performance", content: "Win rate by segment, fastest-to-close segments, highest-expansion segments, worst-fit segments to deprioritize" },
    { section: "Competitive Landscape", content: "Win/loss by competitor, emerging threats, positioning adjustments needed" },
    { section: "Pipeline Health", content: "Coverage ratio, aging deals, single-threaded risk, stage conversion rates" },
    { section: "Rep Performance", content: "Scorecard averages, ramp progress, coaching priorities per rep" },
    { section: "Product/Market Feedback", content: "Top 3 feature gaps cited in losses, pricing feedback, market shifts detected" },
    { section: "Next Quarter Plan", content: "Target accounts, campaigns, hiring, enablement priorities, experiments" },
  ],
  cadence: "Quarterly with monthly pipeline review",
  audience: "CEO/CRO/Board — keep to 45 minutes, lead with 'what changed and what we're doing about it'",
};

// ── SOLUTION-FIT CARDS ────────────────────────────────────────────────────
export const SOLUTION_FIT_CARDS = {
  principle: "Each offer has a card that maps: trigger → pain → solution → deliverable → success metric → pricing shape",
  usage: "In discovery, match the prospect's situation to a card. If no card fits, the deal may not be real or the offer doesn't exist yet.",
  cardStructure: [
    "Offer name and 1-sentence positioning",
    "Ideal buyer profile (who buys this specifically)",
    "Trigger events (what causes them to look for this)",
    "Discovery questions (3-5 that confirm fit for THIS offer)",
    "Deliverables and timeline",
    "Success metrics (what 'working' looks like in 90 days)",
    "Pricing shape and typical range",
    "Disqualifiers (when to NOT sell this offer)",
    "Adjacent offers (what to upsell/cross-sell after success)",
  ],
};

// ── PRICING NEGOTIATION PLAYBOOK ─────────────────────────────────────────
export const PRICING_NEGOTIATION = {
  principle: "Never negotiate price before establishing value. Price pressure is a signal, not a verdict.",
  scenarios: [
    {
      trigger: "They ask for a discount",
      response: "Before adjusting price, understand what's driving the request. 'Help me understand — is this a budget ceiling, a competitive benchmark, or a risk concern? I want to solve the right problem.'",
      tactics: ["Scope adjustment (fewer seats, phased rollout) before price reduction", "Success-based pricing: 'What if we tied a portion to measurable outcomes?'", "Annual prepay discount (improves cash flow for both sides)", "Never give a discount without getting something: longer term, case study rights, referral commitment"],
    },
    {
      trigger: "They say the competitor is cheaper",
      response: "'That's good to know. Can you share what's included at that price? I want to make sure we're comparing scope-for-scope, not headline to headline.'",
      tactics: ["Compare total cost of ownership, not just license", "Highlight switching costs they'll face later", "Ask what's NOT included in the competitor price (implementation, support, integrations)"],
    },
    {
      trigger: "Procurement requires 3 bids",
      response: "'Completely understand — I've worked with procurement teams before. Let me help you build a comparison framework that evaluates what actually matters for your use case, so the bids are apples-to-apples.'",
      tactics: ["Offer to help define evaluation criteria (naturally favoring your strengths)", "Provide a comparison template", "Reference similar procurement processes you've navigated"],
    },
    {
      trigger: "Budget is X but price is 2X",
      response: "'I appreciate you sharing that. Let's talk about what we can do within X that still moves the needle — and what the path looks like to expand when you see results.'",
      tactics: ["Phase 1 within budget, Phase 2 on success", "Start with one team/department at X, expand later", "ROI model showing payback within budget cycle"],
    },
    {
      trigger: "They go silent after receiving proposal",
      response: "Wait 3 business days, then: 'I wanted to check in — I know pricing conversations involve multiple stakeholders. Is there anything I can provide to help make the internal case?'",
      tactics: ["Offer an internal champion deck", "Ask if there's a specific objection from finance/procurement", "Provide ROI calculator they can share internally"],
    },
  ],
};

// ── ARCHETYPE BATTLE CARDS ──────────────────────────────────────────────
export const ARCHETYPE_BATTLE_CARDS = [
  {
    archetype: "vs. Entrenched Incumbent",
    when: "Target uses a well-known platform (Salesforce, SAP, Oracle, Workday) with deep integration",
    strategy: "Land adjacent, don't displace. Find the gap the incumbent doesn't serve well and own it.",
    tactics: [
      "Ask: 'What's the one thing you wish [incumbent] did better?' — that's your beachhead",
      "Frame as 'complement, not replace' — reduces perceived risk to zero",
      "Start with a team/department the incumbent underserves",
      "Quantify the cost of the workaround they've built around the incumbent's gap",
    ],
    avoid: ["Direct feature-by-feature comparison", "Criticizing the incumbent (buyer chose it, you're criticizing their judgment)", "Promising a full rip-and-replace"],
  },
  {
    archetype: "vs. Status Quo / Do Nothing",
    when: "No competing vendor — the prospect is considering staying with manual processes, spreadsheets, or 'good enough'",
    strategy: "Make the cost of inaction vivid and personal. Status quo feels safe but compounds risk over time.",
    tactics: [
      "Quantify the hidden cost: 'Your team spends X hours/week on this manually — that's $Y/year in salary doing work software should handle'",
      "Paint the competitive risk: 'Your competitors are solving this with automation. Every quarter you wait, the gap widens.'",
      "Use a 'burning platform' trigger: regulatory deadline, board mandate, customer complaint trend",
      "Small pilot eliminates the 'big decision' barrier: 'Let's test with one team for 30 days'",
    ],
    avoid: ["Telling them their current process is bad (they built it, they'll defend it)", "Overwhelming with features", "Ignoring the emotional comfort of the status quo"],
  },
  {
    archetype: "vs. Build Internally",
    when: "Target has engineering capacity and is considering building a custom solution",
    strategy: "Reframe the build vs. buy as a resource allocation question, not a capability question.",
    tactics: [
      "'Your engineers could build this. The question is: should they? What's the opportunity cost of 6 months of engineering time on a solved problem?'",
      "Highlight ongoing maintenance: 'Building is sprint 1. Maintaining, patching, scaling — that's sprints 2 through infinity.'",
      "Reference a customer who tried to build, failed, then bought: 'Company X spent 18 months and $2M before switching to us'",
      "Position your product's domain expertise: 'We've invested [X] person-years into this problem. Your team would be starting from scratch.'",
    ],
    avoid: ["Implying their engineers aren't good enough", "Ignoring that build-bias is often cultural, not rational", "Competing on features (they can always add features to a custom build)"],
  },
  {
    archetype: "vs. Cheaper Alternative",
    when: "A lower-priced competitor is in the evaluation",
    strategy: "Shift evaluation from price to total value and risk. Cheap solutions have hidden costs.",
    tactics: [
      "'At that price point, what's included? Let's map scope-for-scope.'",
      "Quantify the cost of failure: 'If the cheaper solution doesn't work, what's the cost of re-implementing in 12 months?'",
      "Reference customers who switched FROM the cheaper alternative: 'We see a lot of companies graduate from [cheaper] when they hit [scale/complexity threshold]'",
      "Use the 'insurance' frame: 'The difference in price is $X/year. That's the cost of knowing it works.'",
    ],
    avoid: ["Dismissing the cheaper option", "Competing on price (you'll lose and set a precedent)", "Feature-dumping to justify the premium"],
  },
  {
    archetype: "vs. Well-Funded Direct Competitor",
    when: "A similar-stage or larger competitor with significant funding is in the evaluation",
    strategy: "Compete on focus, speed, and customer intimacy. Big funding ≠ better product for their specific use case.",
    tactics: [
      "Ask what they've seen in the competitor's demo: 'What stood out? What felt missing?' — then address the gaps",
      "Emphasize your specialization: 'They serve 15 verticals. We go deep in yours.'",
      "Speed and responsiveness: 'Try reaching their CEO with a feature request. You can reach ours.'",
      "Reference calls are your weapon: 'Talk to our customers in your industry — then talk to theirs.'",
    ],
    avoid: ["Matching their marketing claims dollar-for-dollar", "FUD (fear, uncertainty, doubt) about their funding burning out", "Pretending you're the same size"],
  },
];

// ── POST-SALE EXPANSION PLAYBOOK ────────────────────────────────────────
export const POST_SALE_EXPANSION = {
  principle: "The deal close is the midpoint, not the end. Murphy's RWAS: will they succeed AND expand? If you can't answer yes to both, the deal shouldn't close.",
  customerSuccessQualification: {
    description: "Before marking a deal closed-won, validate that the customer can actually succeed",
    criteria: [
      { signal: "Named success owner on customer side", weight: "Critical", note: "If no one owns the outcome internally, the project will stall after implementation" },
      { signal: "Executive sponsor confirmed post-sale", weight: "Critical", note: "The economic buyer must remain engaged through go-live, not just through signature" },
      { signal: "Success metrics agreed in writing", weight: "High", note: "What does 'working' look like in 30/60/90 days? If you can't define it, you can't prove it" },
      { signal: "Implementation timeline is realistic", weight: "High", note: "Aggressive timelines set up for failure. 'Live in 2 weeks' when typical is 6 weeks = churn risk" },
      { signal: "End-user adoption plan exists", weight: "Medium", note: "Training, change management, internal comms. Without it, license utilization will be <30%" },
    ],
  },
  expansionTriggers: [
    { trigger: "Usage crosses 80% of licensed capacity", timing: "Real-time monitoring", action: "Proactive expansion conversation before they hit limits — position as growth signal, not upsell" },
    { trigger: "New department/team asks for access", timing: "Within 48 hours of request", action: "Land-and-expand: offer a scoped pilot for the new team with its own success metrics" },
    { trigger: "Customer achieves stated success metrics", timing: "At 90-day review", action: "Document the win, build a case study together, then discuss what's next: 'Now that [metric], what's the next problem?'" },
    { trigger: "Executive sponsor changes role/company", timing: "Within 1 week", action: "Two moves: (1) connect with their successor, (2) follow them to new company as warm lead" },
    { trigger: "Customer's company raises funding or acquires", timing: "Within 2 weeks", action: "Growth event = expanded budget and new use cases. Reach out with congratulations + 'as you scale, here's how we can help'" },
    { trigger: "Annual renewal 90 days out", timing: "90 days before", action: "Never let renewal be the first conversation in months. QBR at -90, success review at -60, renewal at -30" },
  ],
  churnRiskIndicators: [
    { signal: "Login frequency drops >50% over 30 days", severity: "High", response: "Immediate outreach from CSM — not email, phone call. 'I noticed your team's usage has shifted — what changed?'" },
    { signal: "Champion leaves the company", severity: "Critical", response: "Emergency: find the new owner within 1 week or the account goes dark. Ask champion for intro before they leave" },
    { signal: "Support ticket volume spikes", severity: "Medium", response: "Proactive review: are they hitting product limitations, or is it an adoption/training gap?" },
    { signal: "Customer stops attending QBRs", severity: "High", response: "They've mentally checked out. Escalate to exec sponsor with a concrete value narrative" },
    { signal: "Competitor mentioned in support or meeting notes", severity: "High", response: "Don't panic. Ask directly: 'What are you evaluating and why?' Address the gap, don't sell against the name" },
  ],
  renewalFramework: {
    minus90: "Quarterly Business Review: present ROI, usage trends, roadmap preview. Plant expansion seed.",
    minus60: "Success Review: document achieved metrics vs original goals. Identify gaps and new opportunities.",
    minus30: "Renewal Discussion: present renewal terms alongside expansion proposal. Lead with value, not contract.",
    minus0: "Close: multi-year discount if committed, or annual with expansion clause.",
    rule: "If you're surprised by a churn at renewal, you failed at -90. Every churn should be visible 90 days out.",
  },
};

// ── COMBINED PROMPT INJECTIONS ────────────────────────────────────────────

export const COMPETITIVE_INJECTION = `
COMPETITIVE HANDLING (Dunford Reframing):
- Never disparage competitors. Reframe what the buyer evaluates instead.
- If you hear "we're also looking at X": ask "what criteria are you using to compare?" then reframe to your strengths.
- If "they're cheaper": compare scope-for-scope, not headline rate. Ask "what's included in that price?"
- If "board wants a recognized firm": ask "recognized for what specifically?" then provide proof in that dimension.
- Trap questions: ask questions that naturally surface your strengths without stating them. "How important is [your differentiator] to this initiative?"
`;

export const DISCOVERY_SCORECARD_INJECTION = `
DISCOVERY CALL QUALITY (score yourself):
- Preparation (10%): did you reference specific company context, not generic questions?
- Pain depth (20%): did you get 3 levels deep on the core pain? Past behavior, not hypotheticals?
- Impact (15%): did the PROSPECT state the cost of inaction in dollars, time, or risk?
- Buying process (15%): do you know who says yes, who says no, budget, timeline, criteria?
- Listening (10%): was 70%+ of talk time the prospect? Did you mirror and label?
- Next steps (10%): is there a named person, named action, named date? Not "let's circle back"?
- Competitive (10%): do you know what alternatives they're considering, including "do nothing"?
`;

export const OFFER_FIT_INJECTION = `
OFFER-FIT MAPPING — match prospect situation to engagement shape:
- "We don't know what we don't know" → Diagnostic (2-4 weeks, fixed fee)
- "We need to prove ROI first" → Pilot/POC (30-90 days, success-gated)
- "We've decided, how fast can you start" → Implementation (3-12 months)
- "We don't have the team" → Managed Service/Retainer (12+ months)
- "Our team needs to learn this" → Training/Enablement (1-8 weeks)
DISQUALIFICATION SIGNALS: no named pain owner, no budget process, no timeline, committee without champion, scope creep in discovery.
`;

// ── SALES METHODOLOGY FRAMEWORKS ────────────────────────────────────────
// Source: offer-fit-mapping.md — framework definitions for prompt injection.
// Each framework captured as principle + key concepts for prompt enrichment.
export const SALES_METHODOLOGY_FRAMEWORKS = [
  {
    name: "Gap Selling",
    author: "Jim Keenan",
    principle: "The customer buys a change, not a product. Every purchase is movement from Current State to Future State. The Gap — its size, urgency, and business impact — determines whether and how they buy.",
    keyConcepts: ["Current State — honest, quantified picture of where prospect is today", "Future State — quantified picture of where they need to be", "The Gap — measurable distance between CS and FS in business terms", "Problem Identification Chart — technical problem → business problem → impact → root cause", "Discovery is investigation, not interrogation"],
  },
  {
    name: "SPIN Selling",
    author: "Neil Rackham",
    principle: "What makes reps successful in small sales actively harms them in large, complex sales. Question sequencing that causes buyers to articulate their own pain is the differentiator.",
    keyConcepts: ["Situation questions — factual context (ask fewer than you think)", "Problem questions — surface implied needs", "Implication questions — expand consequences to explicit needs", "Need-payoff questions — buyer articulates value themselves", "Closing techniques hurt in large sales; objection handling = symptom of poor discovery"],
  },
  {
    name: "Solution Selling",
    author: "Bosworth & Eades",
    principle: "Selling is helping a buyer create a vision of a solution to pain they didn't fully understand. Guide from latent pain → admitted pain → vision → purchase.",
    keyConcepts: ["Pain Chain — pain cascades through organization; speak each stakeholder's language", "Buyer Readiness Levels — latent, admitted, vision, evaluating, purchase", "Vision Creation vs Reengineering — first vendor shapes vision; followers must reengineer it", "Reference Stories — '[Company X] had [pain], adopted [solution], achieved [outcome]'", "Sponsor vs Power Sponsor — convert or get referred up"],
  },
  {
    name: "Command of the Message",
    author: "Force Management",
    principle: "Sell to business issues, not features. Every conversation grounds in prospect business problem, required capabilities, and quantified outcomes.",
    keyConcepts: ["Why Change? — pain-driven urgency", "Why Now? — compelling event or cost of inaction", "Why Us? — differentiated capabilities others can't match", "Positive Business Outcomes — quantified results buyer achieves", "Required vs Differentiated capabilities — table stakes vs unique value"],
  },
  {
    name: "Mastering Technical Sales",
    author: "Care & Bohlig",
    principle: "A demo is a targeted response to discovered pain, not a feature tour. Most demos fail because they answer questions the buyer didn't ask.",
    keyConcepts: ["Death by Demo — generic comprehensive demo exhausts buyer, produces no commitment", "Discovery before Demo — complete pre-demo brief before any demo", "POV vs POC — Proof of Value (business test) vs Proof of Concept (technical test)", "Technical Win ≠ Business Win — product can work but deal still lost without business case"],
  },
  {
    name: "The Challenger Customer",
    author: "Adamson, Dixon, Spenner & Toman",
    principle: "Enterprise buying is decided by groups that are structurally bad at reaching good decisions. Committee dynamics produce worse deals than individual decisions would.",
    keyConcepts: ["Mobilizers (Go-Getters, Teachers, Skeptics) drive decisions; Talkers (Guides, Friends, Climbers, Blockers) don't", "Commercial Insight — reframe buyer's problem in way favorable to your solution", "Don't aggregate stakeholder yes's — help Mobilizer drive through committee", "Champion enablement — arm with deck, business case, references, specific stories", "Identify Mobilizers early, invest disproportionately"],
  },
  {
    name: "JOLT Effect",
    author: "Dixon & McKenna",
    principle: "40-60% of qualified B2B pipeline ends in no-decision, not loss to competitor. Buyer indecision — not status quo bias — is the dominant failure mode.",
    keyConcepts: ["Valuation problem — buyer can't determine best option among too many", "Lack of information — feels insufficient data (often dodge for uncertainty)", "Outcome uncertainty — fears being wrong and blamed", "J-O-L-T — Judge indecision type, Offer specific recommendation, Limit options, Take risk off the table", "Being directive correlates with winning; more options hurt close rates"],
  },
  {
    name: "The Effortless Experience",
    author: "Dixon, Toman & DeLisi",
    principle: "Delight doesn't drive loyalty; effort does. Optimize effort downward, not delight upward. Customer Effort Score predicts loyalty better than NPS.",
    keyConcepts: ["Effort reduction > delight — minimize buyer friction throughout process", "Anticipate next issues — answer question and pre-empt three related ones", "Don't bounce buyers — minimize hand-offs; warm introductions", "Make next step obvious — every interaction ends with action, owner, date"],
  },
  {
    name: "$100M Offers",
    author: "Alex Hormozi",
    principle: "The offer IS the product. A mediocre product with a brilliant offer beats a brilliant product with a mediocre offer.",
    keyConcepts: ["Value Equation: (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)", "Dream outcome — what buyer wants in their language (maximize)", "Perceived likelihood — proof, guarantees, case data (maximize)", "Time delay — how long until value delivery (minimize)", "Naming: Magnetic Reason + Avatar + Result + Container"],
  },
  {
    name: "Win Without Pitching",
    author: "Blair Enns",
    principle: "Experts don't pitch; they're consulted. Pitching posture signals commodity. Experts engage as advisors with authority to question, set terms, and qualify.",
    keyConcepts: ["Specialize — vertical × horizontal positioning intersection", "Diagnose before prescribe — not qualified to recommend until diagnosed", "Replace presentations with conversations — expert posture through dialogue", "Address money early — pricing discussed in first call, not hidden until proposal", "Be selective — willingness to disqualify signals expertise, not desperation"],
  },
];
