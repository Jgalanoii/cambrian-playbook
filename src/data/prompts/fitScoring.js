// src/data/prompts/fitScoring.js
// 6M permutation fit scoring heuristics
// Used in: scoreFit() in App.jsx
// Model: claude-haiku-4-5-20251001 | Max tokens: 1400

export const FIT_SCORING_PROMPT = `You are a B2B sales strategist. Score ICP fit for each company below.

SCORING RULES (apply in order):
- THE WALL (score 5-15): Automotive/Mfg, Aerospace/Defense, Telecom, Energy/Utilities, Mass Retail >100K, Tier 1 Banks (JPM/BAC/WF)
- TIER 1 (score 60-75): Large Private Insurance/Finance, Private Professional Services, Regional Banks, Healthcare IT
- VC-backed target +5pts, PE-backed = cost angle, Private +5pts vs public equivalent  
- >200K employees = procurement wall for Series A-C, score down 15pts
- Recent funding <12mo = buying signal +8pts

SELLER: `+sellerCtx.slice(0,300)+`
`+icpContext+`
`+
      `For orgSize: provide approximate employee count range (e.g. "~200K", "5K-10K", "500-1K").\n\n`+
      `COMPANIES (Name|Industry|URL):\n${companies}\n\n`+
      ``;

export const FIT_SCORING_RULES = {
  wall: {
    description: "Industries where 100% of startup scenarios are poor fit",
    industries: [
      { name: "Automotive/Manufacturing", avgFit: 5.9, reason: "65% union, incumbent ERP" },
      { name: "Aerospace & Defense Prime", avgFit: 5.8, reason: "ITAR, clearance, FedRAMP required" },
      { name: "Telecom (AT&T/Verizon)", avgFit: 6.1, reason: "50% union, 5-deep incumbent stack" },
      { name: "Energy Oil & Gas", avgFit: 11.3, reason: "Culture mismatch, union risk" },
      { name: "Energy Utilities", avgFit: 13.4, reason: "60% union, regulatory lock-in" },
      { name: "Mass Market Retail >100K", avgFit: 13.6, reason: "Procurement wall" },
      { name: "Tier 1 Banks (JPM/BAC/WF)", avgFit: 12.6, reason: "Incumbent depth 5/5, RFP-only" }
    ]
  },
  tier1: {
    description: "Highest fit for startup sellers",
    industries: [
      { name: "Large Private Insurance/Finance", avgFit: 65.2, examples: "State Farm, TIAA, Nationwide" },
      { name: "Large Private Tech/Data/Media", avgFit: 64.5, examples: "Bloomberg, Valve, SAS" },
      { name: "Large Private Professional Services", avgFit: 63.3, examples: "Deloitte US, EY, KPMG" },
      { name: "Insurance P&C/Life/Specialty", avgFit: 62.5, examples: "Allstate, Progressive, Travelers" },
      { name: "CPG HPC/Beauty", avgFit: 61.9, examples: "P&G, Kimberly-Clark, Estee Lauder" },
      { name: "Regional/Community Banks", avgFit: 59.5, note: "85 targets, widely ignored by startups" },
      { name: "Healthcare IT / Digital Health", avgFit: 54.9 }
    ]
  },
  stageThresholds: [
    { stage: "Seed", avgFit: 23.7, note: "Zero viable direct enterprise paths" },
    { stage: "Series A", avgFit: 33.6, note: "Niche targeting only" },
    { stage: "Series B", avgFit: 41.8, note: "Departmental landing only" },
    { stage: "Series C", avgFit: 49.0, note: "First real enterprise traction" },
    { stage: "Series D+", avgFit: 55.6, note: "Full enterprise motion viable" }
  ],
  signals: {
    positive: [
      "Recent funding <12 months = 18-month buying window (+8pts)",
      "PE acquisition <18 months = cost mandate + 60-90 day budget cycle",
      "Private vs public equivalent (+5-8pts)",
      "Hiring Digital Transformation = Early Majority",
      "Hiring Innovation/R&D = Early Adopter"
    ],
    negative: [
      ">200K employees = procurement wall for Series A-C (-15pts)",
      ">50% union/hourly workforce (-20pts)"
    ]
  }
};
