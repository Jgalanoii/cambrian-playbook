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
import { ICP_KNOWLEDGE_INJECTION, DISCOVERY_KNOWLEDGE_INJECTION, MURPHY_RWAS, FOUR_FORCES, SPICED, WBD_SCORECARD, DUNFORD_POSITIONING, DISQUALIFICATION, FINTECH_ICP, ICP_FAILURE_MODES, FITZPATRICK_MOM_TEST, MOORE_CHASM, SIXSENSE_ABM, LAJA_CXL, DISCOVERY_QUESTION_BANK } from "../src/data/icpFitKnowledge.js";
import { VERTICAL_PLAYBOOKS, matchVerticals, buildVerticalInjection } from "../src/data/verticalPlaybooks.js";
import { COMPETITIVE_INJECTION, DISCOVERY_SCORECARD_INJECTION, OFFER_FIT_INJECTION, BATTLE_CARD_FRAMEWORK, DISCOVERY_SCORECARD, OFFER_FIT_FRAMEWORK, REP_ONBOARDING, QBR_FRAMEWORK, SOLUTION_FIT_CARDS, PRICING_NEGOTIATION, ARCHETYPE_BATTLE_CARDS, POST_SALE_EXPANSION, SALES_METHODOLOGY_FRAMEWORKS } from "../src/data/advancedKnowledge.js";
import { PAYMENTS_INDUSTRY_INJECTION, PAYMENTS_SCORING_CONTEXT, PAYMENTS_DISCOVERY_INJECTION } from "../src/data/paymentsKnowledge.js";
import { COMPLIANCE_FRAMEWORKS, COMPLIANCE_VERTICAL_MAP, COMPLIANCE_DISCLAIMER, HANDOFF_PROTOCOL } from "../src/data/complianceKnowledge.js";
import { REAL_ESTATE_INDUSTRY_INJECTION, REAL_ESTATE_SCORING_CONTEXT, REAL_ESTATE_DISCOVERY_INJECTION } from "../src/data/realEstateKnowledge.js";
import { BANKING_INDUSTRY_INJECTION, BANKING_SCORING_CONTEXT, BANKING_DISCOVERY_INJECTION } from "../src/data/bankingKnowledge.js";
import { ACCOUNTING_FINANCE_INJECTION, ACCOUNTING_FINANCE_SCORING, ACCOUNTING_FINANCE_DISCOVERY } from "../src/data/accountingFinanceKnowledge.js";
import { HEALTHCARE_SAAS_INJECTION, HEALTHCARE_SAAS_SCORING, HEALTHCARE_SAAS_DISCOVERY } from "../src/data/healthcareSaasKnowledge.js";
import { AI_ML_INJECTION, AI_ML_SCORING, AI_ML_DISCOVERY } from "../src/data/aiMlKnowledge.js";
import { FINTECH_DEEP_INJECTION, FINTECH_DEEP_SCORING, FINTECH_DEEP_DISCOVERY } from "../src/data/fintechKnowledge.js";
import { REWARDS_INCENTIVES_INJECTION, REWARDS_INCENTIVES_SCORING, REWARDS_INCENTIVES_DISCOVERY } from "../src/data/rewardsIncentivesKnowledge.js";
import { B2B_SALES_INJECTION, B2B_SALES_DISCOVERY } from "../src/data/b2bSalesKnowledge.js";
import { OKR_KPI_INJECTION, OKR_KPI_DISCOVERY } from "../src/data/okrKpiKnowledge.js";
import { QSR_INJECTION, QSR_SCORING, QSR_DISCOVERY } from "../src/data/qsrKnowledge.js";
import { INVESTOR_INTELLIGENCE_INJECTION, INVESTOR_INTELLIGENCE_DISCOVERY } from "../src/data/investorIntelligenceKnowledge.js";

import { createHmac, timingSafeEqual } from "crypto";
import { checkRateLimit, isAllowedOrigin, checkGuestLimit, incrementGuestUsage } from "./_guard.js";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";
const SUPABASE_REF = process.env.VITE_SUPABASE_URL
  ? new URL(process.env.VITE_SUPABASE_URL).hostname.split(".")[0]
  : "";

function verifyJwt(req) {
  // Try JWT first — authenticated users get the full knowledge layer
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const header = JSON.parse(Buffer.from(parts[0].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
          if (header?.alg === "HS256") {
            if (!JWT_SECRET) {
              // No secret available — reject in production, allow in dev
              if (IS_PRODUCTION) return false;
            } else {
              const expected = createHmac("sha256", JWT_SECRET).update(parts[0] + "." + parts[1]).digest();
              const actual = Buffer.from(parts[2].replace(/-/g, "+").replace(/_/g, "/"), "base64");
              if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
              req._isGuest = false;
              const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
              const now = Math.floor(Date.now() / 1000);
              if ((!payload.exp || payload.exp >= now) && SUPABASE_REF && (payload.iss === "supabase" || payload.iss?.includes(SUPABASE_REF))) return true;
            }
          } else if (header?.alg === "ES256" || header?.alg === "RS256") {
            req._isGuest = false;
            const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
            const now = Math.floor(Date.now() / 1000);
            if ((!payload.exp || payload.exp >= now) && SUPABASE_REF && (payload.iss === "supabase" || payload.iss?.includes(SUPABASE_REF))) return true;
          }
        }
      } catch {}
    }
  }

  // Guest mode fallback — gets stripped-down knowledge layer
  const guestFlag = (process.env.ALLOW_GUEST || "").replace(/^["']|["']$/g, "").replace(/\\n/g, "").trim().toLowerCase();
  if (guestFlag === "true" || guestFlag === "1" || guestFlag === "yes") {
    req._isGuest = true;
    return true;
  }

  return false;
}

export default function handler(req, res) {
  if (req.method !== "GET") { res.status(405).end(); return; }

  // Origin check — only allow requests from known domains
  const origin = req.headers.origin || req.headers.referer || "";
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: "origin not allowed" });
    return;
  }

  // Rate limiting
  const xff = req.headers["x-forwarded-for"];
  const ip = req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim()
           || (xff ? xff.split(",").pop().trim() : "")
           || req.headers["x-real-ip"]
           || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "rate limit exceeded" });
    return;
  }

  if (!verifyJwt(req)) {
    res.status(401).json({ error: "authentication required" });
    return;
  }

  // Guest limit — guests share the 3-call limit with Claude endpoints
  if (req._isGuest) {
    if (!checkGuestLimit(ip)) {
      return res.status(402).json({
        error: { type: "guest_limit_exceeded", message: "You've used your 3 free tokens. Create a free account to continue." },
        guest_remaining: 0,
      });
    }
    incrementGuestUsage(ip);
  }

  // Cache for 1 hour — this data changes only on deploys
  res.setHeader("Cache-Control", "private, max-age=3600");

  // ── Guest mode: return minimal stubs ──────────────────────────────────
  // Guests get just enough for the app to render without crashing, but
  // NO proprietary scoring rules, industry averages, framework injections,
  // negotiation playbooks, vertical heuristics, or battle cards.
  if (req._isGuest) {
    return res.status(200).json({
      _guest: true,
      fitScoringRules: {
        highFriction: { industries: [] },
        highFit: { industries: [] },
        stageThresholds: [],
        signals: { positive: [], negative: [] },
      },
      negotiations: "",
      fisherUry: "",
      graham: "",
      buyingSignals: { positive: [], negative: [] },
      joltEffect: { description: "", steps: [] },
      challenger: { teachingAngle: "", mobilizer: { definition: "", identify: "", notMobilizers: [] } },
      naicsCodes: {},
      cpvCodes: {},
      icpKnowledge: "",
      discoveryKnowledge: "",
      verticalPlaybooks: {},
      competitiveInjection: "",
      discoveryScorecardInjection: "",
      offerFitInjection: "",
    });
  }

  // ── Authenticated: full knowledge layer ───────────────────────────────
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
    verticalPlaybooks: VERTICAL_PLAYBOOKS,
    competitiveInjection: COMPETITIVE_INJECTION,
    discoveryScorecardInjection: DISCOVERY_SCORECARD_INJECTION,
    offerFitInjection: OFFER_FIT_INJECTION,
    battleCardFramework: BATTLE_CARD_FRAMEWORK,
    discoveryScorecard: DISCOVERY_SCORECARD,
    offerFitFramework: OFFER_FIT_FRAMEWORK,
    repOnboarding: REP_ONBOARDING,
    qbrFramework: QBR_FRAMEWORK,
    pricingNegotiation: PRICING_NEGOTIATION,
    archetypeBattleCards: ARCHETYPE_BATTLE_CARDS,
    postSaleExpansion: POST_SALE_EXPANSION,
    solutionFitCards: SOLUTION_FIT_CARDS,
    // Payments deep knowledge layer
    paymentsIndustry: PAYMENTS_INDUSTRY_INJECTION,
    paymentsScoring: PAYMENTS_SCORING_CONTEXT,
    paymentsDiscovery: PAYMENTS_DISCOVERY_INJECTION,
    // New frameworks (v4.28.26)
    fitzpatrickMomTest: FITZPATRICK_MOM_TEST,
    mooreChasm: MOORE_CHASM,
    sixsenseAbm: SIXSENSE_ABM,
    lajaCxl: LAJA_CXL,
    discoveryQuestionBank: DISCOVERY_QUESTION_BANK,
    salesMethodologyFrameworks: SALES_METHODOLOGY_FRAMEWORKS,
    // Compliance awareness layer (13 frameworks × 4 verticals)
    complianceFrameworks: COMPLIANCE_FRAMEWORKS,
    complianceVerticalMap: COMPLIANCE_VERTICAL_MAP,
    complianceDisclaimer: COMPLIANCE_DISCLAIMER,
    complianceHandoff: HANDOFF_PROTOCOL,
    // Real estate & land development knowledge layer
    realEstateIndustry: REAL_ESTATE_INDUSTRY_INJECTION,
    realEstateScoring: REAL_ESTATE_SCORING_CONTEXT,
    realEstateDiscovery: REAL_ESTATE_DISCOVERY_INJECTION,
    // Banking & capital markets knowledge layer
    bankingIndustry: BANKING_INDUSTRY_INJECTION,
    bankingScoring: BANKING_SCORING_CONTEXT,
    bankingDiscovery: BANKING_DISCOVERY_INJECTION,
    // Accounting & financial management (cross-cutting)
    accountingFinance: ACCOUNTING_FINANCE_INJECTION,
    accountingFinanceScoring: ACCOUNTING_FINANCE_SCORING,
    accountingFinanceDiscovery: ACCOUNTING_FINANCE_DISCOVERY,
    // Healthcare SaaS deep knowledge
    healthcareSaas: HEALTHCARE_SAAS_INJECTION,
    healthcareSaasScoring: HEALTHCARE_SAAS_SCORING,
    healthcareSaasDiscovery: HEALTHCARE_SAAS_DISCOVERY,
    // AI/ML deep knowledge
    aiMl: AI_ML_INJECTION,
    aiMlScoring: AI_ML_SCORING,
    aiMlDiscovery: AI_ML_DISCOVERY,
    // Fintech deep knowledge
    fintechDeep: FINTECH_DEEP_INJECTION,
    fintechDeepScoring: FINTECH_DEEP_SCORING,
    fintechDeepDiscovery: FINTECH_DEEP_DISCOVERY,
    // Rewards & incentives deep knowledge (Cambrian's core domain)
    rewardsIncentives: REWARDS_INCENTIVES_INJECTION,
    rewardsIncentivesScoring: REWARDS_INCENTIVES_SCORING,
    rewardsIncentivesDiscovery: REWARDS_INCENTIVES_DISCOVERY,
    // Cross-cutting: B2B sales + value creation
    b2bSales: B2B_SALES_INJECTION,
    b2bSalesDiscovery: B2B_SALES_DISCOVERY,
    // Cross-cutting: OKRs, KPIs, measurement
    okrKpi: OKR_KPI_INJECTION,
    okrKpiDiscovery: OKR_KPI_DISCOVERY,
    // QSR / restaurants
    qsr: QSR_INJECTION,
    qsrScoring: QSR_SCORING,
    qsrDiscovery: QSR_DISCOVERY,
    // Investor intelligence (cross-cutting)
    investorIntelligence: INVESTOR_INTELLIGENCE_INJECTION,
    investorIntelligenceDiscovery: INVESTOR_INTELLIGENCE_DISCOVERY,
  });
}
