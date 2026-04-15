// src/data/prompts/negotiationInjections.js
// Negotiation framework injections applied to discovery and talk track prompts
// Used in: generateDiscoveryQs() and buildRiverHypo() prompts

export const VOSS_INJECTION = `
VOSS (Never Split the Difference — FBI):
- ALL questions must start with "How" or "What" — never yes/no
- Use tactical empathy: name their emotion before advancing your agenda
- Mirror: repeat their last 3 words as a question to get them to expand
- Label: "It seems like..." or "It sounds like..." to diffuse tension
- Accusation Audit: name their likely objections before they raise them
- Calibrated questions: "What would need to be true for you to move forward?"
- No-oriented questions: "Is now a bad time?" vs "Is now a good time?"`;

export const FISHER_URY_INJECTION = `
FISHER/URY (Getting to Yes — Harvard):
- Separate people from problem — attack the issue, protect the relationship
- Surface interests not positions: "What's driving that?" not "Do you want X?"
- BATNA: always know their alternative (status quo) and make its cost vivid
- Objective criteria: use benchmarks and market data to resolve price disputes
- Invent options: pilot, phased, success-based pricing when stuck`;

export const CIALDINI_INJECTION = `
CIALDINI (Influence — 6 Principles):
- Reciprocity: give a specific industry insight before asking for anything
- Social Proof: name a similar company (same industry + size) who solved this
- Authority: open with a precise statistic most people in their industry don't know
- Commitment: get small yeses early — each agreement makes the next easier
- Scarcity: use REAL deadlines only — regulatory dates, budget cycles, competitive windows`;

export const SUN_TZU_INJECTION = `
SUN TZU (Art of War — adapted):
- Know yourself and know your enemy before every call
- Supreme excellence: make status quo untenable — don't attack competitors directly
- Be like water: adapt approach to their Moore adoption profile
- Attack where they are unprepared: the underserved stakeholder, not the gatekeeper
- Speed kills deals: recommend the smallest possible first step`;

export const CRUCIAL_CONVERSATIONS_INJECTION = `
CRUCIAL CONVERSATIONS (Patterson et al.):
- Watch for safety signals: long pauses, clipped answers, sudden topic changes
- If safety breaks: "It seems like something I said didn't land — what's your read?"
- STATE method: Share facts, Tell story, Ask their path, Talk tentatively, Encourage testing
- Explore before responding: prospects deserve to be heard before you defend`;

export const GRAHAM_INJECTION = `
GRAHAM (Intelligent Investor — adapted):
- Margin of Safety: only pursue deals where value delivered is 3-5x the price
- Make the value case separately from the price discussion
- Position as investment with compounding returns, not a cost to minimize
- Disqualify fast if prospect doesn't understand the problem you solve`;

export const ALL_NEGOTIATION_INJECTIONS = [
  VOSS_INJECTION,
  FISHER_URY_INJECTION, 
  CIALDINI_INJECTION,
  SUN_TZU_INJECTION,
  CRUCIAL_CONVERSATIONS_INJECTION,
  GRAHAM_INJECTION
].join("\n");
