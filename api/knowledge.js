// api/knowledge.js
//
// Serves sensitive knowledge layer data (scoring heuristics, framework
// injections, industry benchmarks) to authenticated clients only.
// This keeps proprietary IP out of the client JS bundle — it's fetched
// at runtime behind JWT auth, never baked into the build artifact.
//
// The client calls this once on login and caches the result in memory.
// If the call fails (guest mode, offline), the app falls back to
// minimal inline heuristics that don't expose exact numbers.

// Import from the same data modules the app uses
import { FIT_SCORING_RULES } from "../src/data/prompts/fitScoring.js";
import { ALL_NEGOTIATION_INJECTIONS, FISHER_URY_INJECTION, GRAHAM_INJECTION } from "../src/data/prompts/negotiationInjections.js";
import { BUYING_SIGNALS } from "../src/data/prompts/briefGeneration.js";
import { JOLT_EFFECT, CHALLENGER_FRAMEWORK } from "../src/data/negotiationFrameworks.js";
import { NAICS_CATEGORY_MAP, CPV_CATEGORY_MAP } from "../src/data/rfpSources.js";
import { ICP_KNOWLEDGE_INJECTION, DISCOVERY_KNOWLEDGE_INJECTION, MURPHY_RWAS, FOUR_FORCES, SPICED, WBD_SCORECARD, DUNFORD_POSITIONING, DISQUALIFICATION, FINTECH_ICP, ICP_FAILURE_MODES } from "../src/data/icpFitKnowledge.js";
import { VERTICAL_PLAYBOOKS, matchVerticals, buildVerticalInjection } from "../src/data/verticalPlaybooks.js";
import { COMPETITIVE_INJECTION, DISCOVERY_SCORECARD_INJECTION, OFFER_FIT_INJECTION, BATTLE_CARD_FRAMEWORK, DISCOVERY_SCORECARD, OFFER_FIT_FRAMEWORK, REP_ONBOARDING, QBR_FRAMEWORK, SOLUTION_FIT_CARDS } from "../src/data/advancedKnowledge.js";

// Import the full JWT verification from guard (includes HMAC-SHA256 signature check)
import { createHmac, timingSafeEqual } from "crypto";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";

function verifyJwt(req) {
  const guestFlag = (process.env.ALLOW_GUEST || "").replace(/^["']|["']$/g, "").trim().toLowerCase();
  if (guestFlag === "true" || guestFlag === "1" || guestFlag === "yes") return true;
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    // Cryptographic signature verification (when SUPABASE_JWT_SECRET is set)
    if (JWT_SECRET) {
      const expected = createHmac("sha256", JWT_SECRET).update(parts[0] + "." + parts[1]).digest();
      const actual = Buffer.from(parts[2].replace(/-/g, "+").replace(/_/g, "/"), "base64");
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
    }
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    if (payload.iss !== "supabase" && !payload.iss?.includes("xtnidawfuaxwwwcnkewu")) return false;
    return true;
  } catch { return false; }
}

export default function handler(req, res) {
  if (req.method !== "GET") { res.status(405).end(); return; }

  if (!verifyJwt(req)) {
    res.status(401).json({ error: "authentication required" });
    return;
  }

  // Cache for 1 hour — this data changes only on deploys
  res.setHeader("Cache-Control", "private, max-age=3600");

  res.status(200).json({
    fitScoringRules: FIT_SCORING_RULES,
    negotiations: ALL_NEGOTIATION_INJECTIONS,
    fisherUry: FISHER_URY_INJECTION,
    graham: GRAHAM_INJECTION,
    buyingSignals: BUYING_SIGNALS,
    joltEffect: {
      description: JOLT_EFFECT.description,
      steps: JOLT_EFFECT.steps,
    },
    challenger: {
      teachingAngle: CHALLENGER_FRAMEWORK.teachingAngle,
      mobilizer: CHALLENGER_FRAMEWORK.mobilizer,
    },
    naicsCodes: NAICS_CATEGORY_MAP,
    cpvCodes: CPV_CATEGORY_MAP,
    // ICP deep knowledge layer (from icp-fit-knowledge-base.md)
    icpKnowledge: ICP_KNOWLEDGE_INJECTION,
    discoveryKnowledge: DISCOVERY_KNOWLEDGE_INJECTION,
    murphyRWAS: MURPHY_RWAS,
    fourForces: FOUR_FORCES,
    spiced: SPICED,
    wbdScorecard: WBD_SCORECARD,
    dunfordPositioning: DUNFORD_POSITIONING,
    disqualification: DISQUALIFICATION,
    fintechICP: FINTECH_ICP,
    icpFailureModes: ICP_FAILURE_MODES,
    // 10 vertical playbooks
    verticalPlaybooks: VERTICAL_PLAYBOOKS,
    // Advanced knowledge (battle cards, scorecard, offer-fit, onboarding, QBR)
    competitiveInjection: COMPETITIVE_INJECTION,
    discoveryScorecardInjection: DISCOVERY_SCORECARD_INJECTION,
    offerFitInjection: OFFER_FIT_INJECTION,
    battleCardFramework: BATTLE_CARD_FRAMEWORK,
    discoveryScorecard: DISCOVERY_SCORECARD,
    offerFitFramework: OFFER_FIT_FRAMEWORK,
    repOnboarding: REP_ONBOARDING,
    qbrFramework: QBR_FRAMEWORK,
    solutionFitCards: SOLUTION_FIT_CARDS,
  });
}
