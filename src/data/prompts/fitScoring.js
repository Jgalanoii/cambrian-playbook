// src/data/prompts/fitScoring.js
//
// IMPORTED by /api/knowledge.js → served to client at runtime via JWT-auth'd
// endpoint. FIT_SCORING_RULES heuristics are injected into scoreFit() prompts
// in App.jsx as KL_FIT_RULES (populated by fetchKnowledgeLayer() on login).
//
// The live scoreFit() in App.jsx uses these rules to build research-backed
// fit scoring prompts with exact industry averages and stage thresholds.
//
// CANONICAL SOURCE:
//   - scoreFit() batch prompt: src/App.jsx (search for "DIMENSION 1: ICP ALIGNMENT")
//
// Model:       claude-haiku-4-5-20251001
// Max tokens:  1400 per batch
// Temperature: 0
//
// Output language: score is an integer 0-100. label is EXACTLY one of:
//   "Strong Fit"     (score 75-100)
//   "Potential Fit"  (score 50-74)
//   "Poor Fit"       (score  0-49)
// No "tier", "wall", "band", or "bucket" vocabulary in user-facing text.

export const buildFitScoringPrompt = (sellerCtx, icpContext, companies) => {
  return `You are a B2B sales strategist. Score ICP fit for each company below.

SCORE BAND → LABEL (score MUST match label):
- 75-100 → "Strong Fit"     — clear ICP match, buyer accessible, reasonable cycle
- 50-74  → "Potential Fit"  — partial match, needs specific angle
- 0-49   → "Poor Fit"       — structural barrier (wrong size, industry, incumbent lock)

INTERNAL SIGNALS (inform the score — do NOT echo these phrases in 'reason'):
- High-friction industries (score 5-25): heavy manufacturing, aerospace/defense prime,
  telecom incumbents, energy/utilities, mass-market retail >100K employees, top-5 US banks.
- Underserved high-fit segments (score 60-80): large private insurance/finance, private
  professional services, regional/community banks, healthcare IT, CPG personal care.
- VC-backed target +5 · PE-backed = cost/margin-driven buyer · Private +5 vs public peer.
- >200K employees and seller is Seed/Series A: procurement barrier, -15.
- Target raised <12 months: active buying window +8.

OUTPUT LANGUAGE RULES:
- 'label' must be exactly one of "Strong Fit" | "Potential Fit" | "Poor Fit".
- 'reason' is ONE plain-English sentence. No "tier", "wall", "band", "bucket".
- Do not include the score number in the reason.

SELLER: ${sellerCtx.slice(0, 300)}
${icpContext}
For orgSize: provide approximate employee count range.

COMPANIES (Name|Industry|URL):
${companies}
`;
};

// ── Research heuristics (reference data — drives score-band decisions) ────────
// Numbers below reflect average fit rates from the underlying dataset
// (~4,600 YC companies × 1,150 enterprise targets). These are INTERNAL
// guidance for how the scoreFit prompt decides a band. They are NOT exposed
// in user-facing output — labels and reason text are plain language only.

export const FIT_SCORING_RULES = {
  highFriction: {
    description: "Industries where ~100% of early-stage startup scenarios score poorly",
    industries: [
      { name: "Heavy Manufacturing / Automotive", avgFit: 5.9,  reason: "Unionized workforce, entrenched ERP" },
      { name: "Aerospace & Defense Prime",        avgFit: 5.8,  reason: "ITAR, security clearance, FedRAMP required" },
      { name: "Telecom Incumbents",               avgFit: 6.1,  reason: "Unionized, 5-deep incumbent stack" },
      { name: "Energy — Oil & Gas",               avgFit: 11.3, reason: "Culture mismatch, union risk" },
      { name: "Energy — Utilities",               avgFit: 13.4, reason: "Unionized, regulatory lock-in" },
      { name: "Mass-Market Retail >100K employees", avgFit: 13.6, reason: "Hardened procurement, low tolerance for novelty" },
      { name: "Top-5 US Banks",                   avgFit: 12.6, reason: "Deep incumbents, RFP-gated procurement" },
    ],
  },
  highFit: {
    description: "Highest fit for startup sellers — underserved segments",
    industries: [
      { name: "Large Private Insurance/Finance",     avgFit: 65.2, examples: "State Farm, TIAA, Nationwide" },
      { name: "Large Private Tech/Data/Media",       avgFit: 64.5, examples: "Bloomberg, Valve, SAS" },
      { name: "Large Private Professional Services", avgFit: 63.3, examples: "Deloitte US, EY, KPMG" },
      { name: "Insurance (P&C / Life / Specialty)",  avgFit: 62.5, examples: "Allstate, Progressive, Travelers" },
      { name: "CPG — Personal Care / Beauty",        avgFit: 61.9, examples: "P&G, Kimberly-Clark, Estée Lauder" },
      { name: "Regional / Community Banks",          avgFit: 59.5, note:     "85 Fortune-1000 targets, widely ignored by startups" },
      { name: "Healthcare IT / Digital Health",      avgFit: 54.9 },
    ],
  },
  stageThresholds: [
    { stage: "Seed",      avgFit: 23.7, note: "Zero viable direct enterprise paths" },
    { stage: "Series A",  avgFit: 33.6, note: "Niche targeting only" },
    { stage: "Series B",  avgFit: 41.8, note: "Departmental landing only" },
    { stage: "Series C",  avgFit: 49.0, note: "First real enterprise traction" },
    { stage: "Series D+", avgFit: 55.6, note: "Full enterprise motion viable" },
  ],
  signals: {
    positive: [
      "Recent funding <12 months = 18-month buying window (+8pts)",
      "PE acquisition <18 months = cost mandate + 60-90 day budget cycle",
      "Private vs public equivalent (+5-8pts)",
      "Hiring Digital Transformation = Early Majority",
      "Hiring Innovation/R&D = Early Adopter",
    ],
    negative: [
      ">200K employees and seller is Seed/Series A = procurement barrier (-15pts)",
      ">50% union/hourly workforce (-20pts)",
    ],
  },
};
