// src/data/prompts/icpGeneration.js
// ICP generation prompt — phase 2
// Used in: buildSellerICP() in App.jsx
// Model: claude-haiku-4-5-20251001 | Max tokens: 6000

export const ICP_PROMPT_TEMPLATE = ``;

export const ICP_FRAMEWORKS = [
  { name: "Revella", rings: ["Priority Initiative","Success Factors","Perceived Barriers","Decision Criteria","Buyer Journey"] },
  { name: "Osterwalder", elements: ["Functional/Emotional/Social Jobs","Pains","Gains"] },
  { name: "Dunford", elements: ["Market Category","Competitive Alternatives","Unique Differentiators"] },
  { name: "Moore", segments: ["Innovators","Early Adopters","Early Majority","Late Majority"] },
  { name: "Weinberg", note: "19 traction channels ranked by buyer profile" }
];
