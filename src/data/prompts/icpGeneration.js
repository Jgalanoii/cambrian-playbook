// src/data/prompts/icpGeneration.js
//
// Reference module for ICP generation. Enum buckets are the source of truth
// for anchored schema fields. The canonical ICP prompt lives in App.jsx
// (buildSellerICP) because it closes over sellerStage and other React state.
//
// CANONICAL SOURCE:
//   - Phase 1 (web_search research): src/App.jsx (search for "researchPrompt")
//   - Phase 2 (anchored enum schema): src/App.jsx (search for "icpPrompt")
//   - Cache key: icp:v3:<url>, quality gate rejects "Unknown" / "PICK ONE"
//
// Model:       claude-haiku-4-5-20251001
// Max tokens:  2000 (phase 1) / 6000 (phase 2)
// Temperature: 0 (forced by api/_guard.js)
// Tools:       web_search_20250305 (phase 1 only, max_uses:1)
//
// Behavior summary:
//   - Phase 1 uses web_search to pull real data about the seller
//     (critical for obscure sellers — without it, Haiku returned "Unknown"
//     4/5 times on Tillo.com during v102 testing).
//   - Phase 2 ANCHORS these fields to fixed enum buckets. The model must
//     pick one verbatim; no free-form ranges. This is what eliminates
//     "500-10K one run, 1K-100K the next" drift:
//
//       companySize:    1-49 | 50-499 | 500-4,999 | 5,000-49,999 | 50,000+
//       revenueRange:   <$10M | $10M-$100M | $100M-$1B | $1B-$10B | $10B+
//       dealSize:       <$10K | $10K-$50K | $50K-$250K | $250K-$1M | $1M+
//       salesCycle:     <30 days | 30-60 | 60-90 | 90-180 | 180+ days
//       adoptionProfile: Innovator | Early Adopter | Early Majority | Late Majority
//
//   - localStorage cache key: `icp:v2:<normalized-url>`
//   - Bump ICP_CACHE_VERSION in App.jsx when the schema shape changes.
//   - ICPs containing "Unknown" / "Unable to determine" / "PICK ONE" in
//     core fields are NOT cached — next load retries.
//
// Consistency test: node scripts/consistency/test-icp.mjs

export const ICP_FRAMEWORKS = [
  { name: "Revella",     elements: ["Priority Initiative","Success Factors","Perceived Barriers","Decision Criteria","Buyer Journey"] },
  { name: "Osterwalder", elements: ["Functional/Emotional/Social Jobs","Pains","Gains"] },
  { name: "Dunford",     elements: ["Market Category","Competitive Alternatives","Unique Differentiators"] },
  { name: "Moore",       segments: ["Innovators","Early Adopters","Early Majority","Late Majority"] },
  { name: "Weinberg",    note:     "19 traction channels ranked by buyer profile" }
];

// Enum buckets used in the anchored schema. Kept here as the source of truth
// for any future test harness or normalization logic.
export const ICP_ENUM_BUCKETS = {
  companySize:     ["1-49 employees","50-499 employees","500-4,999 employees","5,000-49,999 employees","50,000+ employees"],
  revenueRange:    ["<$10M","$10M-$100M","$100M-$1B","$1B-$10B","$10B+"],
  dealSize:        ["<$10K ACV","$10K-$50K ACV","$50K-$250K ACV","$250K-$1M ACV","$1M+ ACV"],
  salesCycle:      ["<30 days","30-60 days","60-90 days","90-180 days","180+ days"],
  adoptionProfile: ["Innovator","Early Adopter","Early Majority","Late Majority"],
  ownershipTypes:  ["VC-backed private","PE-backed private","Public","Privately-held (family/founder)","Bootstrapped"],
  geographies:     ["North America","EMEA","APAC","LATAM","Global"],
};
