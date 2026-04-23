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
