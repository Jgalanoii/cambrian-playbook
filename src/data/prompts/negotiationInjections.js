// src/data/prompts/negotiationInjections.js
// All negotiation framework injections
// Injected into: discovery questions, hypothesis, talk tracks

export const VOSS_INJECTION = `
VOSS (Never Split the Difference — FBI):
- ALL questions start with "How" or "What" — never yes/no
- Tactical empathy: name their emotion before advancing agenda
- Mirror: repeat last 3 words as question to get elaboration
- Label: "It seems like..." or "It sounds like..." to diffuse tension
- Accusation Audit: name their objections before they raise them
- No-oriented: "Is now a bad time?" not "Is now a good time?"`;

export const FISHER_URY_INJECTION = `
FISHER/URY (Getting to Yes — Harvard):
- Separate people from problem
- Surface interests not positions: "What is driving that number?"
- BATNA: make cost of status quo vivid and measurable
- Objective criteria: use benchmarks to resolve price disputes
- Invent options: pilot, phased, success-based when stuck`;

export const CIALDINI_INJECTION = `
CIALDINI (Influence):
- Reciprocity: give specific insight before asking for anything
- Social Proof: name similar company (same industry + size) who solved this
- Authority: open with precise stat most people in their industry dont know
- Commitment: get small yeses early
- Scarcity: use REAL deadlines only — regulatory, budget cycle, competitive`;

export const SUN_TZU_INJECTION = `
SUN TZU (Art of War):
- Know yourself and your enemy before every call
- Make status quo untenable — do not attack competitors directly
- Adapt to their Moore adoption profile — be like water
- Find the underserved stakeholder, not the gatekeeper
- Recommend smallest possible first step — speed kills deals`;

export const CRUCIAL_CONVERSATIONS_INJECTION = `
CRUCIAL CONVERSATIONS:
- Watch safety signals: long pauses, clipped answers, topic changes
- If safety breaks: "It seems like something did not land — what is your read?"
- STATE method: Share facts, Tell story, Ask their path, Talk tentatively
- Explore fully before responding — prospects deserve to be heard`;

export const GRAHAM_INJECTION = `
GRAHAM (Intelligent Investor — adapted):
- Margin of safety: only pursue deals where value is 3-5x the price
- Separate value case from price discussion
- Position as investment with compounding returns
- Disqualify fast if prospect does not understand the problem you solve`;

export const ALL_NEGOTIATION_INJECTIONS = 
  VOSS_INJECTION + "\n" +
  FISHER_URY_INJECTION + "\n" +
  CIALDINI_INJECTION + "\n" +
  SUN_TZU_INJECTION + "\n" +
  CRUCIAL_CONVERSATIONS_INJECTION + "\n" +
  GRAHAM_INJECTION;
