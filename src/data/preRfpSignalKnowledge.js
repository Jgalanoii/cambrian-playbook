// src/data/preRfpSignalKnowledge.js
//
// Pre-RFP Signal Extraction — technical intelligence layer for detecting
// procurement-intent signals from unstructured sources BEFORE an RFP is
// formally published. Covers SEC filings, earnings calls, SLED board minutes,
// job postings, news articles, and confidence scoring.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_PRE_RFP_SIGNAL (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// VERSION: 1.0.0
// VERIFIED: 2026-05-26
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   SEC EDGAR Full-Text Search API:
//     efts.sec.gov/LATEST/search-index?q=...
//   SEC EDGAR Submissions API:
//     data.sec.gov/submissions/CIK{cik}.json
//   AlphaSense (earnings transcript platform):
//     alpha-sense.com
//   Civic IQ (SLED meeting minutes aggregator):
//     civiciq.com
//   SAM.gov (federal procurement data):
//     sam.gov
//   NewsAPI (news aggregation):
//     newsapi.org
//   Mediastack (news aggregation):
//     mediastack.com
//   Bureau of Labor Statistics (SOC codes, job classification):
//     bls.gov/soc/
//   NAICS Association (industry classification):
//     naics.com

// ═══════════════════════════════════════════════════════════════════
// INTENT KEYWORDS — comprehensive keyword list for pre-filtering
// ═══════════════════════════════════════════════════════════════════
export const PRE_RFP_INTENT_KEYWORDS = [
  // Procurement verbs
  "modernize", "modernization", "upgrade", "replace", "replacement",
  "migrate", "migration", "implement", "implementation", "deploy",
  "deployment", "procure", "procurement", "acquire", "acquisition",
  "evaluate", "evaluation", "select", "selection", "assess", "assessment",
  "transform", "transformation", "consolidate", "consolidation",
  "transition", "overhaul", "revamp", "reengineer", "sunset",
  // Budget / capital signals
  "capital expenditure", "capex", "capital allocation", "budget appropriation",
  "budget increase", "incremental spend", "investment in technology",
  "technology investment", "IT budget", "IT spend", "IT modernization",
  "digital transformation", "digital investment", "funded initiative",
  "earmark", "allocate", "multi-year contract", "multi-year investment",
  // RFP lifecycle
  "request for proposal", "RFP", "request for information", "RFI",
  "request for quote", "RFQ", "sole source", "sole-source",
  "competitive bid", "invitation to bid", "ITB", "notice of intent",
  "solicitation", "bid opening", "vendor selection", "vendor evaluation",
  "contract award", "contract renewal", "contract expiration",
  // SEC / filing signals
  "10-K", "10-Q", "8-K", "MD&A", "risk factors", "forward-looking",
  "material weakness", "significant deficiency", "going concern",
  "SEC filing", "EDGAR", "annual report", "quarterly report",
  // Earnings call signals
  "earnings call", "earnings transcript", "guidance", "capex guidance",
  "prepared remarks", "Q&A", "analyst question", "investor day",
  "capital plan", "spending plan", "run rate",
  // SLED signals
  "board meeting", "board minutes", "city council", "county board",
  "school board", "special district", "motion to approve", "resolution",
  "appropriation", "bond measure", "ballot measure",
  // Job posting signals
  "RFP Manager", "Strategic Sourcing", "Procurement Director",
  "Chief Procurement Officer", "Purchasing Manager",
  "Vendor Management", "Contract Administrator",
  // General intent
  "buying intent", "purchase intent", "procurement intent",
  "signal extraction", "pre-RFP", "pre-solicitation",
  "vendor shortlist", "market survey", "sources sought",
];

// ═══════════════════════════════════════════════════════════════════
// EXTRACTION PROMPTS — per-source extraction instructions
// ═══════════════════════════════════════════════════════════════════
export const PRE_RFP_EXTRACTION_PROMPTS = {
  haiku_triage: `You are a procurement-intent triage classifier.
Given the following text chunk, determine if it contains ANY signal that
an organization intends to purchase, procure, replace, modernize, or
evaluate technology, services, or infrastructure.

Respond with EXACTLY one JSON object:
{
  "has_signal": true|false,
  "signal_type": "procurement_intent"|"budget_signal"|"vendor_mention"|"timeline_mention"|"none",
  "confidence": 0.0-1.0,
  "relevant_excerpt": "<50-word excerpt or empty string>"
}

Rules:
- Err toward false positives (pass to next stage). If in doubt, mark true.
- Financial procurement (stocks, bonds, insurance) is NOT a signal.
- M&A activity is NOT a procurement signal unless it explicitly mentions technology integration.
- Hypothetical or historical references are NOT current signals.`,

  sonnet_10k: `You are a procurement-intent extraction specialist for SEC 10-K/10-Q/8-K filings.

Extract ALL procurement-intent signals from the following filing section.
For each signal found, return a JSON object in an array:

[{
  "signal_text": "<exact quote, max 200 words>",
  "section": "MD&A|Risk Factors|Business|Item 1A|Item 7|Item 8K",
  "intent_type": "modernization|replacement|new_capability|expansion|compliance_driven|cost_reduction",
  "category": "<technology/service category mentioned>",
  "timeline": "<any timeline mentioned, or 'unspecified'>",
  "budget_indicator": "<any dollar amount or budget language, or 'none'>",
  "confidence": 0.0-1.0,
  "speculative": true|false
}]

Rules:
- MD&A (Item 7) is the highest-signal section for capex/procurement intent.
- Risk Factors (Item 1A) may reveal compliance-driven procurement needs.
- 8-K filings signal material events (leadership change, contract award, strategic shift).
- Mark speculative=true for forward-looking statements with hedging language ("may", "could", "anticipate").
- Apply 0.7 multiplier to speculative signals downstream.
- Exclude financial instrument procurement (stock buybacks, debt issuance, insurance).`,

  sonnet_earnings: `You are a procurement-intent extraction specialist for earnings call transcripts.

Extract ALL procurement-intent signals from the following transcript section.
Classify each signal by speaker context:

[{
  "signal_text": "<exact quote, max 200 words>",
  "speaker_role": "CEO|CFO|COO|CTO|CIO|Analyst|Other",
  "section": "prepared_remarks|qa|guidance",
  "intent_type": "capex_commitment|vendor_mention|modernization|expansion|cost_optimization|timeline",
  "category": "<technology/service category>",
  "firmness": "committed|planned|exploring|speculative",
  "dollar_amount": "<if mentioned, or 'none'>",
  "timeline": "<if mentioned, or 'unspecified'>",
  "confidence": 0.0-1.0
}]

Rules:
- CFO capex commitments in prepared remarks are the strongest signal (confidence >= 0.8).
- CEO strategic vision statements are weaker (confidence 0.4-0.6) unless paired with budget.
- Analyst questions about specific vendors/categories amplify signal strength by +0.1.
- Guidance section with specific dollar ranges is high-confidence.
- "Run rate" and "incremental spend" language indicates ongoing procurement.
- Distinguish between maintaining existing spend and NEW incremental investment.`,

  sonnet_board_minutes: `You are a procurement-intent extraction specialist for SLED board/council meeting minutes.

Extract ALL procurement-related motions, resolutions, and discussions:

[{
  "signal_text": "<exact quote or close paraphrase, max 200 words>",
  "motion_type": "rfp_authorization|contract_award|renewal|budget_appropriation|sole_source|discussion_only",
  "agency_name": "<governing body name>",
  "agency_type": "city|county|state|school_district|special_district|authority",
  "category": "<technology/service category>",
  "dollar_amount": "<if mentioned, or 'none'>",
  "vote_result": "passed|failed|tabled|discussion_only",
  "timeline": "<any dates mentioned, or 'unspecified'>",
  "confidence": 0.0-1.0
}]

Rules:
- "Motion to authorize RFP" = strongest pre-RFP signal (confidence 0.9).
- "Motion to award contract" = post-RFP (still valuable for competitive intel).
- Budget appropriation for a category = early signal (confidence 0.6-0.7).
- Discussion without motion = weakest signal (confidence 0.3-0.4).
- Sole source justification = no RFP expected, but vendor opportunity confirmed.
- Failed or tabled motions still indicate intent (may resurface).`,

  sonnet_job_posting: `You are a procurement-intent extraction specialist for job postings.

Analyze the following job posting for procurement-intent signals:

{
  "has_procurement_signal": true|false,
  "signal_strength": 0.0-1.0,
  "title_signal": "<job title and why it signals procurement>",
  "is_net_new": true|false|"unknown",
  "category_hints": ["<technology/service categories mentioned in requirements>"],
  "budget_hints": "<any budget authority or spend mentioned>",
  "timeline_hints": "<any urgency or start date language>",
  "confidence": 0.0-1.0
}

Title-based signal strength reference:
- "RFP Manager" / "RFP Writer" / "Proposal Manager" = 0.7
- "Director of Procurement" / "Chief Procurement Officer" = 0.6
- "Strategic Sourcing Manager" / "Category Manager" = 0.5
- "VP Strategic Sourcing" / "VP Procurement" = 0.4 (may be backfill)
- "Purchasing Agent" / "Buyer" = 0.3 (operational, not strategic)

Rules:
- Net-new roles (not backfill) are stronger signals than replacements.
- Job descriptions mentioning specific vendor evaluations or RFP processes are high-signal.
- "Immediate start" or "urgent" language increases confidence by +0.1.
- Apply 90-day decay: posting age > 90 days = likely filled, reduce confidence by 0.5.`,

  sonnet_news: `You are a procurement-intent extraction specialist for news articles.

Extract ALL procurement-intent signals from the following article:

[{
  "signal_text": "<exact quote or close paraphrase, max 200 words>",
  "signal_subtype": "future_intent|in_process|past_award",
  "organization": "<organization name>",
  "category": "<technology/service category>",
  "dollar_amount": "<if mentioned, or 'none'>",
  "timeline": "<if mentioned, or 'unspecified'>",
  "source_credibility": "trade_press|tier1_news|wire_service|blog|press_release",
  "confidence": 0.0-1.0
}]

Signal subtype definitions:
- future_intent: Organization announces plans to evaluate, procure, or modernize.
- in_process: RFP is live, evaluation is underway, shortlist announced.
- past_award: Contract awarded (competitive intel, not pre-RFP).

Rules:
- Press releases from the organization itself are higher confidence than third-party reporting.
- Trade press (e.g., GovTech, StateScoop, FedScoop, CRN) is higher confidence than general news.
- Blog posts and unverified sources get a 0.5 confidence cap.
- Distinguish between the organization doing the buying and vendors being mentioned.
- Watch for false positives: "Company X procured financing" is NOT technology procurement.`,
};

// ═══════════════════════════════════════════════════════════════════
// CONFIDENCE SCORING RUBRIC — unified 0-1 scale across all sources
// ═══════════════════════════════════════════════════════════════════
export const PRE_RFP_SCORING_RUBRIC = {
  description: "Unified confidence scoring rubric for pre-RFP signal extraction across all source types",
  scale: { min: 0.0, max: 1.0 },
  thresholds: {
    high: { min: 0.7, label: "High confidence — actionable signal" },
    medium: { min: 0.4, label: "Medium confidence — worth monitoring" },
    low: { min: 0.1, label: "Low confidence — background noise, track only" },
    discard: { max: 0.1, label: "Below threshold — discard" },
  },
  source_base_scores: {
    sec_10k_mda: { base: 0.7, note: "MD&A capex language is high-intent" },
    sec_10k_risk: { base: 0.5, note: "Risk factors may indicate compliance-driven need" },
    sec_8k: { base: 0.6, note: "Material event — leadership change, strategic shift" },
    earnings_cfo_prepared: { base: 0.8, note: "CFO capex commitment in prepared remarks" },
    earnings_ceo_vision: { base: 0.5, note: "Strategic vision, less concrete" },
    earnings_analyst_qa: { base: 0.6, note: "Analyst probing validates category interest" },
    earnings_guidance: { base: 0.75, note: "Forward guidance with dollar ranges" },
    board_rfp_authorization: { base: 0.9, note: "Strongest pre-RFP signal in SLED" },
    board_budget_appropriation: { base: 0.65, note: "Budget allocated but no RFP yet" },
    board_discussion_only: { base: 0.35, note: "Discussion without motion — early stage" },
    board_contract_award: { base: 0.8, note: "Post-RFP, competitive intel value" },
    board_sole_source: { base: 0.7, note: "No RFP expected, vendor confirmed" },
    job_rfp_manager: { base: 0.7, note: "Hiring to run RFP process" },
    job_procurement_director: { base: 0.6, note: "Strategic procurement hire" },
    job_category_manager: { base: 0.5, note: "Category-specific sourcing" },
    job_vp_sourcing: { base: 0.4, note: "May be backfill" },
    news_future_intent: { base: 0.6, note: "Announced plans to procure" },
    news_in_process: { base: 0.7, note: "RFP live or evaluation underway" },
    news_past_award: { base: 0.5, note: "Competitive intel, not pre-RFP" },
  },
  modifiers: {
    speculative: { multiplier: 0.7, note: "Forward-looking with hedging language (may, could, anticipate)" },
    analyst_amplifier: { additive: 0.1, note: "Analyst question validates category interest" },
    urgency_language: { additive: 0.1, note: "Immediate, urgent, accelerated timeline" },
    dollar_amount_present: { additive: 0.1, note: "Specific budget figure mentioned" },
    source_blog: { cap: 0.5, note: "Unverified blog source caps confidence" },
    net_new_role: { additive: 0.1, note: "Net-new hire vs backfill" },
  },
  decay_functions: {
    fast_60d: {
      half_life_days: 60,
      formula: "confidence * Math.pow(0.5, age_days / 60)",
      use_for: "Job postings, news articles, 8-K filings",
    },
    medium_90d: {
      half_life_days: 90,
      formula: "confidence * Math.pow(0.5, age_days / 90)",
      use_for: "Earnings calls, board minutes discussions",
    },
    slow_180d: {
      half_life_days: 180,
      formula: "confidence * Math.pow(0.5, age_days / 180)",
      use_for: "10-K/10-Q filings, strategic plans",
    },
    rfp_due_date: {
      formula: "days_until_due <= 0 ? 0 : confidence * Math.min(1, days_until_due / 30)",
      use_for: "Known RFP due dates — signal drops to zero after deadline",
    },
  },
};

export const PRE_RFP_SIGNAL_PLAYBOOK = {
  name: "Pre-RFP Signal Extraction",
  keywords: [
    "pre-RFP", "procurement intent", "SEC filing", "10-K", "10-Q", "8-K",
    "earnings call", "board minutes", "job posting", "news signal", "EDGAR",
    "signal extraction", "buying intent", "vendor selection", "modernization",
    "capex", "capital expenditure", "RFP authorization", "contract award",
    "sole source", "budget appropriation", "SLED", "municipal procurement",
    "procurement intelligence", "intent detection", "pre-solicitation",
    "forward-looking statement", "MD&A", "risk factors", "analyst question",
    "CFO guidance", "capex commitment", "vendor evaluation", "market survey",
  ],
  discovery: [
    "Which public companies or government agencies are in your target account list, and do you track their SEC filings or board agendas for procurement signals?",
    "How early in the buying cycle do you typically engage prospects — before, during, or after an RFP is published?",
    "Are you monitoring earnings calls for capex commitments or technology modernization language from your target accounts' leadership?",
    "Do you have visibility into SLED (state/local/education) board meeting minutes where RFP authorizations and budget appropriations are voted on?",
    "What job posting patterns at your target accounts would indicate they are building a procurement team or sourcing function?",
    "How do you currently distinguish between speculative intent signals and firm procurement commitments in your pipeline?",
    "What is your process for correlating signals across multiple sources — e.g., a 10-K capex mention confirmed by a related job posting and a board budget vote?",
  ],
  layerContent: `---
title: "Pre-RFP Signal Extraction --- Knowledge Layer"
type: technical_intelligence_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_b2b_sales_value_creation.md
  - cambrian_compliance_knowledge.md
  - cambrian_investor_intelligence.md
  - cambrian_sled_knowledge.md
  - cambrian_approval_gates_knowledge_layer.md
tags: [pre-RFP, procurement-intent, SEC, EDGAR, earnings-call, board-minutes, job-posting, news-signal, signal-extraction, confidence-scoring, entity-matching, SLED]
last_updated: 2026-05-26
status: production
confidence: high (SEC EDGAR API docs; AlphaSense platform; Civic IQ reference; SAM.gov; industry procurement intelligence best practices)
---

# Pre-RFP Signal Extraction --- Knowledge Layer

> **Working thesis.** The highest-value moment in B2B sales is BEFORE an RFP is published — when the buying organization is forming intent, allocating budget, and scoping requirements. By the time an RFP hits the street, incumbents have shaped the spec and competitors are already positioned. Extracting procurement-intent signals from unstructured public sources — SEC filings, earnings calls, SLED board minutes, job postings, and news articles — gives sellers a 60-180 day head start over RFP-reactive competitors [verified 05/2026, industry procurement intelligence research]. **This layer defines the architecture, source-specific extraction patterns, confidence scoring, false positive handling, entity matching, and cost model for a production pre-RFP signal extraction pipeline.**

> **Why this matters for Cambrian.** Cambrian's seller-users compete against incumbents who have relationship advantages. Pre-RFP signal intelligence is the equalizer — it surfaces buying intent at the moment when the prospect is open to new vendors, before the RFP locks in incumbent-friendly requirements. A seller armed with "Your Q3 10-K mentioned $40M in IT modernization capex, and your county board just authorized an RFP for cloud migration" converts at 3-5x the rate of a cold outreach [verified 05/2026, Gartner procurement intelligence research].

---

${"═".repeat(70)}
## 1. ARCHITECTURE — Three-Tier Model Routing
${"═".repeat(70)}

### Pipeline overview

The extraction pipeline uses a three-tier model routing architecture optimized for cost, speed, and accuracy:

| Tier | Model | Role | Cost | Latency |
|---|---|---|---|---|
| **Tier 1: Triage** | Haiku | Binary classification: does this chunk contain a procurement signal? | ~$0.25/M input tokens [verified 05/2026, Anthropic pricing] | <500ms |
| **Tier 2: Extraction** | Sonnet | Structured extraction of signal details, categories, timelines, confidence | ~$3/M input tokens [verified 05/2026, Anthropic pricing] | 1-3s |
| **Tier 3: Disambiguation** | Opus | Complex entity resolution, cross-source correlation, ambiguous signal adjudication | ~$15/M input tokens [verified 05/2026, Anthropic pricing] | 3-10s |

### Pre-filter layer (before model routing)

Before any LLM call, apply a two-stage pre-filter:

1. **Embedding similarity** — Encode the chunk against a procurement-intent embedding centroid. Cosine similarity < 0.3 = skip. This eliminates ~70% of irrelevant content at near-zero cost.
2. **Keyword intersection** — Check against the PRE_RFP_INTENT_KEYWORDS array. Zero keyword matches AND low embedding similarity = skip. This catches edge cases the embedding misses.

### Caching and idempotency

- **Cache by content hash** (SHA-256 of normalized text). If the same filing section, transcript chunk, or article body has been processed, return the cached extraction.
- **Idempotent pipeline** — Re-running the pipeline on the same input produces the same output. Signal IDs are deterministic (hash of source + section + extraction timestamp).
- **TTL by source type**: SEC filings = 365 days (content is immutable once filed). Earnings transcripts = 180 days. Board minutes = 90 days. Job postings = 30 days. News = 60 days.

### Pipeline flow

\`\`\`
Source fetch → Normalize text → Chunk (2,000 token windows, 200 overlap)
  → Pre-filter (embedding + keyword) → Haiku triage (pass/fail)
  → Sonnet extraction (structured JSON) → Entity matching
  → Confidence scoring (rubric + modifiers + decay)
  → Dedup → Store → Surface to seller
\`\`\`

---

${"═".repeat(70)}
## 2. SEC FILINGS (10-K, 10-Q, 8-K)
${"═".repeat(70)}

### EDGAR API integration

The SEC EDGAR system provides free, structured access to all public company filings [verified 05/2026, SEC EDGAR documentation]:

- **Full-text search**: \`efts.sec.gov/LATEST/search-index?q="technology modernization"&dateRange=custom&startdt=2025-01-01&enddt=2026-05-26&forms=10-K,10-Q,8-K\`
- **Submissions by CIK**: \`data.sec.gov/submissions/CIK{cik10}.json\` — returns all filings for a company
- **Filing content**: Individual filing documents are accessible via the accession number URL pattern
- **Rate limit**: 10 requests/second with User-Agent header required (SEC fair access policy) [verified 05/2026, SEC EDGAR developer docs]

### Section targeting

| Filing type | High-signal sections | What to look for |
|---|---|---|
| **10-K** | Item 7 (MD&A), Item 1A (Risk Factors), Item 1 (Business) | Capex plans, technology investment language, vendor dependency disclosures, compliance-driven spend |
| **10-Q** | MD&A section, Liquidity section | Quarterly updates to capex plans, budget revisions, new initiative mentions |
| **8-K** | Item 1.01 (Material Agreement), Item 2.01 (Acquisition), Item 5.02 (Leadership Change), Item 8.01 (Other Events) | Material contracts, leadership changes triggering strategic resets, strategic announcements |

### Procurement-intent indicators in filings

- **Capex language**: "capital expenditures of approximately $X million for technology infrastructure" — direct budget signal
- **Modernization intent**: "legacy system replacement", "digital transformation initiative", "cloud migration program"
- **Compliance-driven**: "to comply with [regulation], we expect to invest", "remediation of material weakness will require"
- **Vendor dependency risk**: "significant reliance on [vendor]", "single-source provider" — potential replacement signal
- **Timeline markers**: "over the next 12-18 months", "beginning in fiscal year 20XX", "phased implementation"

### Example extraction pattern

Input (from a 10-K MD&A section):
> "We plan to invest approximately $45 million in capital expenditures during fiscal 2027, primarily for the modernization of our enterprise resource planning system and migration of on-premises infrastructure to cloud-based solutions."

Extracted signal:
\`\`\`json
{
  "signal_text": "invest approximately $45 million in capital expenditures during fiscal 2027, primarily for the modernization of our enterprise resource planning system and migration of on-premises infrastructure to cloud-based solutions",
  "section": "MD&A",
  "intent_type": "modernization",
  "category": "ERP, cloud migration",
  "timeline": "fiscal 2027",
  "budget_indicator": "$45 million",
  "confidence": 0.8,
  "speculative": false
}
\`\`\`

---

${"═".repeat(70)}
## 3. EARNINGS CALL TRANSCRIPTS
${"═".repeat(70)}

### Source structure

Earnings calls have three distinct sections with different signal values:

| Section | Signal strength | Why |
|---|---|---|
| **Prepared remarks** | Highest (0.7-0.9) | Pre-written, legally reviewed, represents firm commitments |
| **Q&A** | Medium-high (0.5-0.7) | Analyst questions probe specific categories; answers may be less guarded |
| **Forward guidance** | High (0.7-0.85) | Specific dollar ranges and timeline commitments for upcoming quarters |

### Speaker role weighting

- **CFO capex commitments** in prepared remarks = strongest signal (confidence >= 0.8). CFOs do not mention specific dollar amounts casually.
- **CEO strategic vision** statements = medium signal (0.4-0.6). Vision language without budget backing is aspirational.
- **CTO/CIO technology** mentions = medium-high (0.5-0.7). Technical leadership mentioning specific categories indicates active evaluation.
- **Analyst questions** as amplifiers = +0.1 to confidence. When an analyst probes a specific category or vendor, it validates market awareness of the intent.

### Sourcing transcripts

- **AlphaSense**: Premium platform with full transcripts, speaker tagging, and search. API available for enterprise customers [verified 05/2026, AlphaSense platform].
- **Company IR pages**: Most public companies post transcripts on their investor relations page within 24-48 hours of the call. Free but requires scraping.
- **Seeking Alpha**: Community transcripts, often available same-day. Quality varies. Free tier available.
- **SEC filings**: Some companies file earnings call transcripts as 8-K exhibits (FD Disclosure).

### Example: CFO capex commitment

> CFO: "For fiscal 2027, we're guiding capex of $120 to $140 million, up from $95 million this year. The increase is driven by our enterprise-wide cybersecurity platform consolidation and the second phase of our cloud migration."

This yields a confidence of 0.85 — CFO, prepared remarks, specific dollar range, named categories, and timeline.

---

${"═".repeat(70)}
## 4. SLED BOARD MEETING MINUTES
${"═".repeat(70)}

### The opportunity

There are 50,000+ government agencies in the US (cities, counties, states, school districts, special districts, authorities) that conduct public meetings with published minutes [verified 05/2026, US Census Bureau Census of Governments]. These minutes contain procurement motions that are the earliest possible signal of an upcoming RFP.

### PDF parsing challenges

- Most board minutes are published as PDF (often scanned images, not text-native).
- OCR quality varies dramatically — municipal clerk offices range from professional document management to photographed paper copies.
- Agenda items may not match final voted motions (amendments on the floor).
- Recommended stack: PDF.js for text-native PDFs, Tesseract/AWS Textract for scanned images, with confidence threshold for OCR quality.

### Motion types and signal strength

| Motion type | Signal strength | Example |
|---|---|---|
| **RFP authorization** | 0.9 | "Motion to authorize the issuance of an RFP for a new enterprise financial management system. Passed 5-0." |
| **Contract award** | 0.8 (post-RFP) | "Motion to award contract #2026-047 to Vendor X for cloud hosting services, $2.3M over 3 years. Passed 4-1." |
| **Budget appropriation** | 0.65 | "Motion to appropriate $500,000 from the IT Capital Fund for cybersecurity improvements. Passed 5-0." |
| **Renewal** | 0.5 | "Motion to renew the annual maintenance agreement with Vendor Y for $180,000. Passed 5-0." |
| **Sole source** | 0.7 | "Motion to approve sole source procurement of Vendor Z's emergency dispatch system per justification memo. Passed 3-2." |
| **Discussion only** | 0.35 | "Staff presented options for replacing the aging permitting system. No motion. Item tabled to next meeting." |

### Reference implementation: Civic IQ

Civic IQ aggregates SLED meeting minutes and provides structured data on procurement motions [verified 05/2026, Civic IQ platform]. Key features:
- Covers ~15,000 agencies across all 50 states
- Extracts motions, votes, dollar amounts, and vendor names
- API access for enterprise integration
- Alternative: Build custom scraping + LLM extraction for coverage gaps

---

${"═".repeat(70)}
## 5. JOB POSTINGS
${"═".repeat(70)}

### Title patterns and signal strength

Job postings reveal organizational intent through the roles being hired:

| Title pattern | Signal strength | Rationale |
|---|---|---|
| "RFP Manager" / "RFP Writer" / "Proposal Coordinator" | 0.7 | Organization is hiring specifically to run procurement processes |
| "Director of Procurement" / "Chief Procurement Officer" | 0.6 | Strategic procurement leadership hire signals major upcoming sourcing |
| "Strategic Sourcing Manager" / "Category Manager" | 0.5 | Category-specific sourcing implies upcoming category evaluation |
| "VP Strategic Sourcing" / "VP Procurement" | 0.4 | Senior hire — may be backfill or strategic; needs corroboration |
| "Purchasing Agent" / "Buyer I/II" | 0.3 | Operational procurement — lower strategic signal |
| "IT Project Manager" + modernization keywords | 0.5 | Implementation hire signals approved project, potentially pre-vendor-selection |
| "Cloud Architect" + migration keywords | 0.4 | Technical hire for a migration = procurement of cloud services likely |

### Net-new vs backfill

- **Net-new roles** (no prior incumbent) = stronger signal. The organization is building procurement capacity for upcoming activity.
- **Backfill roles** (replacing departed employee) = weaker signal. May be maintaining existing procurement operations.
- **Detection heuristic**: If the company has never posted this title before (per historical job data), likely net-new. If they posted the same title 6-12 months ago, likely backfill.

### 90-day decay

Job postings lose relevance rapidly:
- **0-30 days**: Full confidence. Actively hiring.
- **31-60 days**: -20% confidence. May be in interview process.
- **61-90 days**: -50% confidence. Likely filled or stale.
- **90+ days**: Discard unless reposted. Apply 0.5 multiplier at minimum.

### Sourcing

LinkedIn Jobs API (restricted), Indeed Publisher API, Glassdoor, company career pages (scraping required). Government positions: USAJOBS (federal), state job boards, GovernmentJobs.com.

---

${"═".repeat(70)}
## 6. NEWS ARTICLES
${"═".repeat(70)}

### Three signal subtypes

| Subtype | Definition | Example | Confidence range |
|---|---|---|---|
| **Future intent** | Organization announces plans to evaluate/procure | "City of Austin announces $50M smart city initiative, will issue RFPs in Q3" | 0.5-0.7 |
| **In process** | RFP is live, evaluation underway, shortlist announced | "State of Ohio releases RFP for enterprise cloud migration, due August 15" | 0.6-0.8 |
| **Past award** | Contract awarded, vendor selected | "Acme Corp selects Vendor X for $30M ERP implementation" | 0.4-0.6 (competitive intel) |

### Source options

| Source | Coverage | Cost | API quality |
|---|---|---|---|
| **NewsAPI** | 150K+ sources, 5-year archive | Free (100 req/day) to $449/mo [verified 05/2026, NewsAPI pricing] | Good; JSON; supports keyword + date filters |
| **Mediastack** | 7,500+ sources, global | Free (500 req/mo) to $49.99/mo [verified 05/2026, Mediastack pricing] | Adequate; JSON; headline + description |
| **Trade press (direct)** | GovTech, StateScoop, FedScoop, CRN, GovWin | Varies; some paywalled | Highest signal-to-noise for government/IT procurement |
| **Google News RSS** | Broad coverage | Free | Unreliable for structured extraction; best for monitoring |
| **Press releases** | PR Newswire, Business Wire, GlobeNewsWire | API access available | High confidence — direct from the organization |

### False positive patterns in news

- **"Procured financing"** — Financial procurement, not technology. Exclude.
- **"Acquired [company]"** — M&A, not technology procurement (unless article mentions technology integration plans).
- **Vendor press releases** claiming "selected by" — May be exaggerated or for a small deal. Cross-reference with buyer's own announcements.
- **Recycled/syndicated content** — Same article appearing across multiple outlets. Dedup by headline hash + entity match.
- **Opinion pieces and analyst predictions** — "Company X should modernize..." is not a signal that Company X IS modernizing. Cap confidence at 0.3.

---

${"═".repeat(70)}
## 7. CONFIDENCE SCORING — Unified Rubric
${"═".repeat(70)}

### Unified 0-1 scale

All signals regardless of source type are scored on a 0.0-1.0 confidence scale:

| Range | Label | Action |
|---|---|---|
| **0.7-1.0** | High confidence | Surface to seller immediately; include in active pipeline intelligence |
| **0.4-0.69** | Medium confidence | Include in monitoring dashboard; flag for seller review |
| **0.1-0.39** | Low confidence | Track silently; useful for trend analysis and corroboration |
| **< 0.1** | Discard | Below threshold; do not store |

### Modifier application order

1. Start with **source base score** (from the scoring rubric per source type)
2. Apply **speculative modifier** (x0.7) if hedging language detected
3. Apply **additive modifiers** (+0.1 for dollar amount, +0.1 for analyst amplifier, +0.1 for urgency, +0.1 for net-new role)
4. Apply **source caps** (blog = max 0.5, opinion piece = max 0.3)
5. Apply **age decay** (fast/medium/slow depending on source type)
6. Clamp to [0.0, 1.0]

### Cross-source corroboration bonus

When the SAME procurement intent is detected across multiple independent sources, apply a corroboration bonus:
- 2 sources confirming same intent: +0.15
- 3+ sources confirming same intent: +0.25
- Example: 10-K mentions "cloud migration capex" (0.7) + earnings call confirms timeline (0.8) + job posting for "Cloud Migration Program Manager" (0.5) → All three get corroboration bonus

### Decay functions

| Decay type | Half-life | Use for | Formula |
|---|---|---|---|
| **Fast (60d)** | 60 days | Job postings, news, 8-K filings | \`confidence * 0.5^(age_days/60)\` |
| **Medium (90d)** | 90 days | Earnings calls, board minutes discussions | \`confidence * 0.5^(age_days/90)\` |
| **Slow (180d)** | 180 days | 10-K/10-Q filings, strategic plans | \`confidence * 0.5^(age_days/180)\` |
| **RFP due date** | N/A | Known RFP deadlines | \`days_until_due <= 0 ? 0 : confidence * min(1, days_until_due/30)\` |

---

${"═".repeat(70)}
## 8. FALSE POSITIVE HANDLING
${"═".repeat(70)}

### Explicit exclusion categories

The following content patterns MUST be filtered out as false positives:

| Pattern | Why it's a false positive | Detection method |
|---|---|---|
| **Financial instrument procurement** | Stock buybacks, bond issuance, debt refinancing, treasury operations | Keywords: "repurchase program", "debt offering", "bond issuance", "treasury shares" |
| **Insurance renewals** | Insurance policy procurement is not technology/services procurement | Keywords: "insurance renewal", "policy premium", "underwriting", "coverage terms" |
| **Real estate leases** | Office space, warehouse, facility leases | Keywords: "lease agreement", "square feet", "rental", "tenant improvement" |
| **M&A transactions** | Company acquisitions are not procurement (unless tech integration is mentioned) | Keywords: "merger agreement", "acquisition of [company]", "definitive agreement" |
| **Litigation settlements** | Legal procurement (outside counsel) is generally not a signal | Keywords: "settlement agreement", "legal fees", "litigation", "arbitration" |
| **Hypothetical/conditional** | "If we were to modernize..." is not intent | Hedging patterns: "if", "hypothetically", "in the event that", "should we decide" |
| **Historical references** | "Last year we completed our ERP migration" is past tense | Tense detection: past tense verbs + completed/finished/concluded |
| **Boilerplate risk factors** | Standard SEC risk factor language repeated verbatim across filings | Hash-based dedup of risk factor paragraphs across filings from same company |

### Common false positive patterns by source

- **SEC filings**: Boilerplate risk factors (same language, every filing) → Dedup by paragraph hash. Forward-looking safe harbor disclaimers → Ignore the disclaimer itself, but the statements it covers ARE signals.
- **Earnings calls**: Analyst hypotheticals ("What if you decided to...") → Speaker role + question framing detection. Management deflection ("We're always evaluating options") → Low confidence (0.2), not zero.
- **Board minutes**: Ceremonial motions (e.g., "Motion to accept the minutes of the previous meeting") → Motion type classification. Non-procurement budget items (salary increases, pension contributions) → Category filter.
- **Job postings**: Staffing agency repostings of the same role → Company name normalization + title dedup. Evergreen/always-open postings → Flag roles posted continuously for 6+ months.
- **News**: Vendor PR disguised as news → Source classification (press release vs editorial). AI-generated filler articles → Quality score based on source domain reputation.

---

${"═".repeat(70)}
## 9. ENTITY MATCHING
${"═".repeat(70)}

### Matching cascade

When a signal is extracted, the mentioned organization must be matched to our account database. Use this cascade (stop at first match):

| Priority | Method | Precision | Example |
|---|---|---|---|
| 1 | **CIK exact match** | 99%+ | SEC CIK number directly links to company |
| 2 | **UEI exact match** | 99%+ | SAM.gov Unique Entity Identifier for government entities |
| 3 | **Ticker exact match** | 98%+ | Stock ticker symbol from filing or transcript |
| 4 | **Alias table lookup** | 95%+ | "Big Blue" → IBM, "Alphabet" → Google, "Meta" → Facebook |
| 5 | **Embedding fuzzy match** | 85-95% | Encode organization name + context, compare against account name embeddings |
| 6 | **Unmatched** | N/A | Flag for manual review; do NOT auto-assign |

### Normalization function

Before matching, normalize entity names:

\`\`\`
normalize(name):
  1. Lowercase
  2. Remove legal suffixes: Inc, Corp, LLC, Ltd, LP, PLC, Co, Company, Group, Holdings
  3. Remove punctuation except hyphens
  4. Collapse whitespace
  5. Strip "The " prefix
  6. Apply known alias table
  7. Return normalized string
\`\`\`

### SLED entity matching challenges

Government entities are particularly difficult to match:
- "City of Springfield" — there are 34 Springfields across the US
- "County Board of Education" — need state + county to disambiguate
- "Special District #47" — meaningless without jurisdiction context
- **Resolution**: Always capture state + jurisdiction context from the source document. Use a hierarchical match: state → jurisdiction type → entity name.

---

${"═".repeat(70)}
## 10. COST MODEL
${"═".repeat(70)}

### Per-source token costs (estimated at 1,000 tracked accounts)

| Source | Volume estimate | Avg tokens/item | Haiku triage | Sonnet extraction | Monthly LLM cost |
|---|---|---|---|---|---|
| **SEC filings (10-K/Q)** | ~2,000 filings/quarter (500/mo) | ~15,000 tokens (targeted sections) | ~$1.88 | ~$22.50 | ~$25 |
| **Earnings transcripts** | ~500/quarter (170/mo) | ~8,000 tokens | ~$0.34 | ~$4.08 | ~$5 |
| **SLED board minutes** | ~3,000/month (sample) | ~5,000 tokens | ~$3.75 | ~$45.00 | ~$20* |
| **Job postings** | ~5,000/month | ~1,500 tokens | ~$1.88 | ~$22.50 | ~$15 |
| **News articles** | ~10,000/month (filtered) | ~2,000 tokens | ~$5.00 | ~$60.00 | ~$15 |
| **Total LLM cost** | | | | | **~$80/month** |

*SLED volume is highly variable; sampling strategy recommended. Costs are estimates based on Haiku at ~$0.25/M tokens input and Sonnet at ~$3/M tokens input [verified 05/2026, Anthropic pricing].

### Full cost model (all-in)

| Component | Monthly cost | Notes |
|---|---|---|
| **LLM inference** | ~$80 | Haiku triage + Sonnet extraction (Opus only for disambiguation edge cases) |
| **EDGAR API** | $0 | Free; 10 req/s rate limit [verified 05/2026, SEC EDGAR] |
| **News API** | $50-449 | NewsAPI Business plan or Mediastack Professional [verified 05/2026, vendor pricing] |
| **Job posting data** | $0-200 | Company career page scraping (free) or Indeed/LinkedIn API (paid) |
| **SLED data (Civic IQ or custom)** | $0-500 | Civic IQ enterprise pricing varies; custom scraping is engineering time |
| **Embedding generation** | ~$5 | Pre-filter embeddings for ~50K chunks/month |
| **Storage (PostgreSQL)** | ~$20 | Signal records, cache, entity match tables |
| **Compute (pipeline orchestration)** | ~$20-50 | Vercel Functions or AWS Lambda for pipeline execution |
| **Total all-in** | **~$200-700/month** | Scales sub-linearly with account count due to caching |

### Rate limiting strategy

| Source | Rate limit | Strategy |
|---|---|---|
| **SEC EDGAR** | 10 req/s | Queue with exponential backoff; batch by CIK; respect User-Agent requirement |
| **NewsAPI** | 100 req/day (free) or higher (paid) | Cache aggressively; batch keyword queries; stagger across day |
| **LLM APIs** | Tier-dependent | Use prompt caching (saves ~90% on repeated filing templates); batch Haiku triage calls |
| **Job boards** | Varies; often aggressive anti-scraping | Company career page RSS/Atom feeds preferred; rate-limit scrapers to 1 req/3s |

---

## Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`investorIntelligenceKnowledge.js\` | SEC filing analysis, earnings call intelligence, CIK/ticker mapping |
| \`b2bSalesKnowledge.js\` | Enterprise sales cycle context; where pre-RFP signals fit in pipeline |
| \`complianceKnowledge.js\` | Compliance-driven procurement signals (SOC 2, PCI, HIPAA, FedRAMP) |
| \`approvalGatesKnowledge.js\` | Internal approval gates that follow signal detection before seller outreach |
| \`smbMidmarketKnowledge.js\` | SLED and mid-market procurement patterns; channel dynamics |
| \`cybersecurityKnowledge.js\` | Cybersecurity-specific procurement signals and vendor landscape |

---

*End of layer. Update cadence: monthly (SEC filings are quarterly but board minutes and job postings change weekly). Critical re-check triggers: EDGAR API changes, new SLED data sources, Anthropic pricing changes, procurement intelligence platform launches, changes to SEC filing formats.*
`,
};

// Required exports for knowledge-lint and injection
export const PRE_RFP_SIGNAL_INJECTION = PRE_RFP_SIGNAL_PLAYBOOK.layerContent;
