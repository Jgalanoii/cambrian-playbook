// src/data/prompts/briefGeneration.js
//
// IMPORTED by /api/knowledge.js → served to client at runtime via JWT-auth'd
// endpoint. NOT bundled into the client JS.
//
// CANONICAL SOURCES:
//   - generateBrief():       src/App.jsx (5 micro-calls, p1/p3/p4 stream via
//                            streamAI; p2/p5 use claudeFetch + web_search)
//   - buildRiverHypo():      src/App.jsx (streamed via streamAI, ~4000 tok)
//   - generateDiscoveryQs(): src/App.jsx (streamed via streamAI, ~3500 tok)
//
// Brief architecture (as of v108+):
//   - p1 overview         streamAI, 1800 tok — pre-cached on account select
//   - p2 executives       claudeFetch + web_search, 1800 tok — pre-cached
//   - p3 strategy         streamAI, 2400 tok — Challenger + Cialdini injected
//   - p4 solutions        streamAI, 2600 tok — proof pack grounded
//   - p5 live search      claudeFetch + web_search, 1800 tok — pre-cached
//   earlyDone (p1+p3+p4) fires hypothesis; allDone fires discovery Qs.
//   Pre-cache stores Promises (not "loading" strings) to prevent duplicates.
//
// Model:       claude-haiku-4-5-20251001
// Temperature: 0 (forced by api/_guard.js server-side)

// The 6 universal imperatives every company shares
export const UNIVERSAL_IMPERATIVES = [
  "Grow revenue and market share",
  "Expand — new customers, geographies, segments",
  "Stay compliant — regulatory, audit, risk reduction",
  "Reduce fraud and financial risk",
  "Satisfy investors and board",
  "Make customers happy — NPS, retention, loyalty",
];

// Frameworks referenced in live prompts
export const BRIEF_FRAMEWORKS = [
  { name: "Gartner 17% Rule",   note: "Buyers spend only 17% of time with vendors" },
  { name: "JOLT Effect",        note: "Indecision kills 40-60% of deals. FOMU > FOMO" },
  { name: "Challenger Customer", note: "Only 13% of stakeholders are Mobilizers" },
  { name: "Dunford",            note: "Obviously Awesome positioning — solution mapping" },
  { name: "Osterwalder VPC",    note: "Job-to-be-done → Pain → Gain mapping" },
  { name: "DMAIC",              note: "Reality=Define, Impact=Analyze, Vision=Improve, Route=Control" },
  { name: "Mom Test",           note: "Ask about past behavior, never hypothetical futures" },
  { name: "Voss",               note: "Calibrated How/What questions, labeling, accusation audit" },
  { name: "Fisher/Ury",         note: "Interests not positions. In post-call + deal routing." },
  { name: "Cialdini",           note: "Social proof, authority, scarcity. In brief p3 + hypothesis." },
  { name: "Sun Tzu",            note: "Know the terrain; attack where unprepared. In fit + brief." },
  { name: "Crucial Conversations", note: "Safety signals, STATE method. In discovery." },
  { name: "Ellis 40% Rule",     note: "Must-have test — disqualifying signal." },
  { name: "Graham (Intelligent Investor)", note: "Margin of Safety — 3-5x value. In post-call + SA review." },
];

export const JOLT_FRAMEWORK = {
  J: "Judge the indecision — name the FOMU explicitly",
  O: "Offer ONE clear recommendation — not options",
  L: "Limit the exploration — narrow scope",
  T: "Take risk off the table — pilot, SLA, phased rollout",
};

// Buying signal heuristics — injected into hypothesis + post-call routing
export const BUYING_SIGNALS = {
  positive: [
    "Funding <12 months = 18-month buying window",
    "PE acquisition <18 months = cost mandate + 60-90 day budget cycle",
    "Hiring 'Digital Transformation' = Early Majority",
    "Hiring 'Innovation/R&D' = Early Adopter",
  ],
  negative: [
    "Glassdoor <3.5 = operational pain present",
    ">50% union workforce = procurement friction",
    "Seed/Series A vs >50K employee target = 23-33% fit ceiling",
  ],
};
