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
