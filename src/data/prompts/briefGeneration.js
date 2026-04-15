// src/data/prompts/briefGeneration.js
//
// ⚠️ NOT IMPORTED BY App.jsx. Reference map — the canonical Brief/Hypothesis/
// Discovery prompts live in App.jsx. Earlier versions of this file had
// template strings that drifted out of sync AND had broken string
// concatenation (wouldn't have compiled if imported). Those are gone.
//
// CANONICAL SOURCES:
//   - generateBrief():    src/App.jsx ~lines 651-838 (5 micro-calls, p1-p4
//                                                     stream via streamAI;
//                                                     p5 uses web_search)
//   - buildRiverHypo():   src/App.jsx ~lines 2043-2200
//   - generateDiscoveryQs() / inline discovery prompt: src/App.jsx ~line 1583+
//
// Brief architecture (as of v103):
//   - p1 overview         Haiku streamed, 1800 tok — awaited first, renders skeleton
//   - p2 executives       Haiku streamed, 1800 tok — merges as it completes
//   - p3 strategy + sentiment   Haiku streamed, 2200 tok
//   - p4 solutions + contacts   Haiku streamed, 2400 tok
//   - p5 live search      Haiku non-stream + web_search_20250305, 1800 tok
//   All parallelized via Promise.allSettled; mergePromise applies each as
//   it resolves, so the UI fills in progressively.
//
// Model:       claude-haiku-4-5-20251001
// Temperature: 0 (forced by proxies server-side)

// The 6 universal imperatives every company shares — injected into prompts
// as an anchoring frame ("frame all briefs through these lenses even when
// not explicitly stated").
export const UNIVERSAL_IMPERATIVES = [
  "Grow revenue and market share",
  "Expand — new customers, geographies, segments",
  "Stay compliant — regulatory, audit, risk reduction",
  "Reduce fraud and financial risk",
  "Satisfy investors and board",
  "Make customers happy — NPS, retention, loyalty",
];

// Frameworks referenced in the live Brief/Hypothesis/Discovery prompts.
// This array is the audit trail — if you add a framework reference in
// App.jsx, add it here so the reference library stays coherent.
export const BRIEF_FRAMEWORKS = [
  { name: "Gartner 17% Rule",   note: "Buyers spend only 17% of time with vendors — every interaction must create unique value" },
  { name: "JOLT Effect",        note: "Indecision kills 40-60% of deals. FOMU > FOMO" },
  { name: "Challenger Customer",note: "Only 13% of stakeholders are Mobilizers" },
  { name: "Dunford",            note: "Obviously Awesome positioning — used in solution mapping" },
  { name: "Osterwalder VPC",    note: "Job-to-be-done → Pain → Gain mapping" },
  { name: "DMAIC",              note: "Reality=Define, Impact=Analyze, Vision=Improve, Route=Control" },
  { name: "Mom Test (Fitzpatrick)", note: "Ask about past behavior and real problems — never hypothetical futures. Used in Discovery prompt." },
  { name: "Voss (Never Split the Difference)", note: "Calibrated How/What questions, labeling, accusation audit. In Hypothesis + Discovery prompts." },
  { name: "Fisher/Ury",         note: "Interests not positions. In Hypothesis + Post-call." },
  { name: "Cialdini",            note: "Social proof, authority, scarcity (FOMU). In Brief + Hypothesis." },
  { name: "Sun Tzu",             note: "Know the terrain; attack where unprepared. In Fit scoring + Brief." },
  { name: "Crucial Conversations", note: "Safety signals, STATE method. In Discovery." },
  { name: "Ellis 40% Rule",     note: "Must-have test — disqualifying signal. In Discovery." },
];

// JOLT framework structure — used by the Route stage of RIVER hypothesis
export const JOLT_FRAMEWORK = {
  J: "Judge the indecision — name the FOMU explicitly",
  O: "Offer ONE clear recommendation — not options",
  L: "Limit the exploration — narrow scope",
  T: "Take risk off the table — pilot, SLA, phased rollout",
};

// Signals that the live Brief prompts inject as heuristics (line 675 in App.jsx)
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
