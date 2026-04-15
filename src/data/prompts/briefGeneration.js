// src/data/prompts/briefGeneration.js
// Brief and hypothesis generation prompts
// Used in: generateBrief() and buildRiverHypo() in App.jsx
// Model: claude-haiku-4-5-20251001

export const BRIEF_FRAMEWORKS = [
  "Gartner Buying Reality: Buyers spend only 17% of time with vendors",
  "JOLT Effect (Dixon/McKenna): Indecision kills 40-60% of deals — FOMU beats FOMO",
  "Challenger Customer (CEB): Only 13% of stakeholders are Mobilizers",
  "DMAIC: Reality=Define+Measure, Impact=Analyze, Vision=Improve, Route=Control"
];

export const UNIVERSAL_IMPERATIVES = [
  "Grow revenue and market share",
  "Expand — new customers, geographies, segments",
  "Stay compliant — regulatory, audit, risk",
  "Reduce fraud and financial risk",
  "Satisfy investors and board",
  "Make customers happy — NPS, retention, loyalty"
];

export const BRIEF_PROMPT_TEMPLATE = `B2B sales brief about TARGET PROSPECT "${co}" for seller at ${sellerUrl}.\n`+
    `RULE: All fields describe ${co} NOT the seller. ASCII only. Empty string if unknown, never "N/A".\n`+
    `CONSISTENCY: Return EXACTLY the structure shown — same field names, same array lengths.\n`+
    `${universalCtx}\n`+
    `SIGNAL HEURISTICS: Funding <12 months = 18-month buying window; PE acquisition <18 months = cost mandate + 60-90 day budget cycle; hiring "Digital Transformation" = Early Majority; "Innovation/R&D" = Early Adopter; Glassdoor <3.5 = operational pain present.\n`+`SELLER STAGE AWARENESS: Seller is unknown stage. `+`SCENARIO INTELLIGENCE (6M+ permutations, 4,634 YC companies × 1,156 targets): `+`If target is in THE WALL (Automotive avg 5.9%, Aerospace/Defense 5.8%, Telecom 6.1%, Energy 11-13%, Mass Retail 13.6%, Tier 1 Banks 12.6%): flag as near-impossible for direct startup sale regardless of stage. `+`If target is Large Private (Insurance, Professional Services, Tech): highlight as TIER 1 — avg 63-65% fit, fastest deal cycles, most underserved by startups. `+`If target is Regional Bank (not JPM/BAC/WF): strong opportunity — 59.5% avg fit, 85 targets in Fortune 1000, widely ignored by YC-stage companies. `+`If seller is Seed/Series A: avg 23-33% fit against all Fortune 1000 — recommend partner/channel motion. `+`If seller is Series D+: 35% of Fortune 1000 scenarios are strong fit — full enterprise motion viable. `+`CPG split: HPC/Beauty (P&G, KC) = 61.9% avg — YES; Food/Beverage (PepsiCo, Kraft) = 49.0% — departmental only. `+`If target has high union exposure (Automotive, Aviation, Manufacturing): scope to knowledge workers explicitly.\n`+
    `SELLER CONTEXT (reference only):\n${sellerCtx}${prodCtx}\n`+
    `DEAL: ${dealCtx}\n\n`;

  onStatus("Researching "+co+"...");

  // ── 5 MICRO-CALLS fire simultaneously, each with a tiny schema ───────────
  // User sees the overview card the moment the fastest resolves (~2s)

  // MICRO 1: Company overview card — smalle`;

export const HYPOTHESIS_PROMPT_TEMPLATE = `You are a senior B2B sales strategist. Build a RIVER hypothesis that helps a seller at " + sellerUrl + " win a deal with " + co + ".\n\n" +
      "CRITICAL CONSTRAINT: Only reference what the SELLER delivers. Zero generic consulting.\n" +
      "TONE: Write like a seasoned consultant, not a chatbot. Short sentences. No buzzwords — never use 'leverage', 'synergy', 'holistic', 'robust', 'unlock', 'empower'. talkTracks must be 1-2 sentences — Mom Test grounded: past behavior and real problems, never hypothetical future intent.\n" +
      "BUYER EXPERIENCE FRAMEWORK (Gartner 2023 — 1,700 buyers): Buyers spend only 17% of time with vendors. Every interaction must create value they can't get from online research. The rep who wins: (1) already knows their industry, (2) challenges their thinking without arrogance, (3) shows proof from similar companies, (4) makes the next step obvious and small, (5) asks about their world not their product.\n" +
      "JOLT EFFECT (Dixon/McKenna): Indecision kills 40-60% of B2B deals.
VOSS (Never Split the Difference): Talk tracks must use calibrated "How/What" questions. Never yes/no. Use tactical empathy — name their emotion before advancing your agenda. The Accusation Audit: name every objection they might have before they raise it.
FISHER/URY (Getting to Yes): Surface interests not positions. When price comes up, ask "What's driving that number?" before responding. Always have a creative option ready (pilot, phased, success-based).
SUN TZU (Art of War): Know their competitive alternatives before the call. Attack where they are unprepared — the underserved stakeholder, not the gatekeeper. Speed kills deals — recommend the smallest first step.
CIALDINI (Influence): Open with social proof from their exact industry. Establish authority with specific data. Create legitimate scarcity with real deadlines (regulatory, budget cycle, competitive). FOMU (Fear of Messing Up) > FOMO. Route stage MUST include: J=Judge the indecision explicitly, O=Off`;

export const JOLT_FRAMEWORK = {
  name: "JOLT Effect — Dixon & McKenna",
  steps: [
    { letter: "J", action: "Judge the indecision", description: "Name the FOMU (Fear of Messing Up) explicitly" },
    { letter: "O", action: "Offer your recommendation", description: "Give ONE clear POV — not options" },
    { letter: "L", action: "Limit the exploration", description: "Narrow scope to make decision smaller" },
    { letter: "T", action: "Take risk off the table", description: "Pilot, SLA, phased rollout, reference customer" }
  ]
};

export const CHALLENGER_FRAMEWORK = {
  name: "Challenger Customer — CEB/Gartner",
  mobilizer: {
    definition: "Only 13% of stakeholders are Mobilizers — they ask how to make it happen",
    notMobilizers: ["Talkers — share info but can't move deals", "Blockers — actively oppose change"],
    identify: "They ask 'how do we make this happen?' not 'interesting, let me think about it'"
  },
  teachingAngle: "Challenge a widely-held assumption about their industry using data or a case study"
};
