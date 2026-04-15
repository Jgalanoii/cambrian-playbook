// src/data/prompts/icpGeneration.js
// ICP generation prompt — phase 2
// Used in: buildSellerICP() in App.jsx
// Model: claude-haiku-4-5-20251001 | Max tokens: 6000
// Note: Phase 1 does web research, phase 2 generates the full ICP

export const ICP_GENERATION_PROMPT = ``;

export const ICP_FRAMEWORKS = [
  {
    name: "Revella — 5 Rings of Buying Insight",
    rings: ["Priority Initiative", "Success Factors", "Perceived Barriers", "Decision Criteria", "Buyer Journey"]
  },
  {
    name: "Osterwalder — Value Proposition Canvas",
    elements: ["Customer Jobs (Functional/Emotional/Social)", "Pains", "Gains", "Pain Relievers", "Gain Creators"]
  },
  {
    name: "Dunford — Obviously Awesome",
    elements: ["Market Category", "Competitive Alternatives", "Unique Differentiators", "Target Customers", "Value"]
  },
  {
    name: "Moore — Crossing the Chasm",
    segments: ["Innovators", "Early Adopters", "Early Majority", "Late Majority", "Laggards"],
    note: "Adoption profile determines messaging, proof points, and sales approach"
  },
  {
    name: "Weinberg — Traction Channels",
    note: "19 channels ranked by effectiveness for specific buyer profiles"
  }
];
