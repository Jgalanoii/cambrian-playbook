# Knowledge Layer Review — Comprehensive Context for Deepening

> **Date**: May 19, 2026
> **Purpose**: Provide full context for parallel knowledge layer development — what exists, how it's used, what's been tested, what broke, what works, and where gaps remain.

---

## Table of Contents

1. [Architecture: How Knowledge Layers Work](#architecture)
2. [Complete File Inventory](#inventory)
3. [How Layers Get Injected](#injection)
4. [Scoring Calibration Rules](#scoring)
5. [Testing History: Companies Briefed](#testing)
6. [Grounding Audit Results (4 rounds, 37 briefs)](#grounding)
7. [Consistency Test Results](#consistency)
8. [Fit Scoring Test Results](#fit-scoring)
9. [Known Issues Found & Fixed](#issues)
10. [Quality Feedback & Design Principles](#feedback)
11. [Gaps & Areas for Deepening](#gaps)

---

## 1. Architecture: How Knowledge Layers Work <a name="architecture"></a>

Knowledge layers are server-side JavaScript files that export structured text constants. They are:

1. **Imported** only by `api/knowledge.js` (Vercel serverless function)
2. **Served** to authenticated clients via GET `/api/knowledge` (JWT required)
3. **Gated by plan**: Trial users get core frameworks only; paid users get all 19 vertical layers + battle cards + compliance
4. **Cached client-side** in module-level `KL_*` variables (fetched once on login)
5. **Injected into prompts** by 13 keyword-matching functions in `src/App.jsx` (lines ~517-800)

**Critical**: Knowledge layers are NEVER in the client JavaScript bundle. They're trade secrets served only through authenticated API.

### Three Export Patterns

Most knowledge files export 3 constants:

```javascript
// Pattern 1: Industry layer (most common)
export const VERTICAL_INJECTION = "...";      // Injected into brief generation prompts
export const VERTICAL_SCORING = "...";        // Injected into fit scoring prompt
export const VERTICAL_DISCOVERY = "...";      // Injected into discovery question generation
```

Some files export structured data instead of strings:
```javascript
// Pattern 2: Framework layer
export const FRAMEWORK = { description: "...", steps: [...], ... };
```

Some export utility functions:
```javascript
// Pattern 3: Dynamic layer (compliance, verticals)
export function matchVerticals(keywords) { ... }
export function buildVerticalInjection(matches) { ... }
```

---

## 2. Complete File Inventory <a name="inventory"></a>

### Industry Vertical Layers (19 files)

| # | File | Lines | Exports | Domain |
|---|------|-------|---------|--------|
| 1 | `rewardsIncentivesKnowledge.js` | 113 | INJECTION, SCORING, DISCOVERY | **Core domain** — $230B+ gift card market, B2B incentives, BHN/Tango/InComm, tax compliance, GTCR/BHN deal |
| 2 | `paymentsKnowledge.js` | 134 | INJECTION, SCORING, DISCOVERY | Four-party model, acquiring ($2.61T JPM), ISO landscape, PayFac, FedNow/RTP, Durbin/CCCA/GENIUS Act |
| 3 | `bankingKnowledge.js` | 163 | INJECTION, SCORING, DISCOVERY | FDIC Q4 2025 (4,336 banks, $295.6B net income), G-SIBs, regionals, credit unions, private credit, BaaS |
| 4 | `fintechKnowledge.js` | 72 | INJECTION, SCORING, DISCOVERY | Post-correction consolidation, vertical SaaS fintech, sponsor banks, PE dry powder ($3.6T), AI adoption |
| 5 | `baasKnowledge.js` | 74 | INJECTION, SCORING, DISCOVERY | Post-Synapse ($95M+), sponsor banks (Cross River, Column, Lead), middleware (Unit, Treasury Prime), compliance |
| 6 | `healthcareSaasKnowledge.js` | 76 | INJECTION, SCORING, DISCOVERY | $4.9T market, Epic dominance (42%), RCM, clinical validation, PE 40% deal volume, 29.5% CAGR |
| 7 | `medicalPaymentsKnowledge.js` | 204 | INJECTION, SCORING, DISCOVERY | Filtered-spend prepaid, CMS MA supplemental benefits, SNAP/EBT, food-as-medicine, GusNIP, Star Ratings |
| 8 | `realEstateKnowledge.js` | 110 | INJECTION, SCORING, DISCOVERY | 3.5-4.7M unit deficit, BTR surge, land wholesaling, Sun Belt oversupply, builder relationships |
| 9 | `aiMlKnowledge.js` | 90 | INJECTION, SCORING, DISCOVERY | Fed Reserve adoption data (18% firm, 41% individual), agentic AI caution (Gartner 40% cancellation), vertical AI |
| 10 | `qsrKnowledge.js` | 72 | INJECTION, SCORING, DISCOVERY | ~200K units, franchise economics, Toast 24%/Square 28%/Olo 50%, PE (Roark 112K+ locations), AI voice |
| 11 | `charitableGivingKnowledge.js` | 80 | INJECTION, SCORING, DISCOVERY | DAFRC Q2 2026 (3M+ DAF accounts, $280-300B), 501(c)(3), IRS 4966/4967/170, charity gift cards, OBBBA |
| 12 | `accountingFinanceKnowledge.js` | 81 | INJECTION, SCORING, DISCOVERY | GAAP, SaaS metrics (ARR/NRR/GRR/Magic Number), FASB 2023-07/-08/-05, unit economics |
| 13 | `investorIntelligenceKnowledge.js` | 71 | INJECTION, DISCOVERY | PE/VC/family office conversations, due diligence, portfolio GTM benchmarking, AI as M&A thesis |
| 14 | `b2bSalesKnowledge.js` | 50 | INJECTION, DISCOVERY | Buying group dynamics (74% unhealthy conflict), pipeline architecture, SDR/AE/CSM design |
| 15 | `okrKpiKnowledge.js` | 53 | INJECTION, DISCOVERY | OKR framework (70% hit rate), KPI architecture (leading vs lagging), revenue/sales/marketing/CS metrics |
| 16 | `smbMidmarketKnowledge.js` | 114 | INJECTION, SCORING, DISCOVERY | SIZE layer (not vertical) — SMB <100, lower/core/upper mid-market, PE-backed dynamics, buying patterns |
| 17 | `complianceKnowledge.js` | 140 | FRAMEWORKS, VERTICAL_MAP, DISCLAIMER, HANDOFF + functions | 13 frameworks x 4 verticals, discovery Qs, trigger phrases, objection handling, handoff protocol |
| 18 | `verticalPlaybooks.js` | 204 | VERTICAL_PLAYBOOKS, matchVerticals, buildVerticalInjection | 10 playbooks (AI/ML, Cyber, FinTech, HealthTech, etc.) with personas, triggers, DQ criteria |
| 19 | `advancedKnowledge.js` | 365 | 13 exports (battle cards, scorecards, frameworks) | Competitive battle cards, discovery scoring, offer-fit, rep onboarding, QBR, solution-fit, pricing negotiation |

### Framework & Prompt Files (11 files)

| File | Lines | Key Exports | Purpose |
|------|-------|-------------|---------|
| `icpFitKnowledge.js` | 291 | Murphy RWAS, Dunford, Four Forces, SPICED, WBD, Fitzpatrick, Moore, 6sense, Laja, Discovery Bank | ICP scoring frameworks + discovery question bank |
| `negotiationFrameworks.js` | 245 | Voss, Fisher/Ury, Cialdini, Sun Tzu, Graham, JOLT, CAMP, Challenger | 11 negotiation frameworks with stage mapping |
| `riverFramework.js` | 81 | RIVER_STAGES | Proprietary 5-stage discovery (Reality/Impact/Vision/Entry/Route) |
| `outcomes.js` | 17 | OUTCOMES | 6 universal imperatives + 7 operational outcomes |
| `rfpSources.js` | 291 | RFP_SOURCES, NAICS/CPV maps, signal rules | RFP database registry (SAM.gov, FPDS, DemandStar, etc.) |
| `sampleAccounts.js` | 149 | SAMPLE_ROWS | 100 companies across 18 industries for testing |
| `prompts/fitScoring.js` | 115 | buildFitScoringPrompt, FIT_SCORING_RULES | Score bands, friction industries, VC/PE modifiers |
| `prompts/briefGeneration.js` | 75 | BUYING_SIGNALS, BRIEF_FRAMEWORKS, JOLT | Buying signal patterns, framework references |
| `prompts/negotiationInjections.js` | 58 | 7 injection strings | Framework-specific prompt text for each negotiation school |
| `prompts/icpGeneration.js` | 56 | ICP_FRAMEWORKS, ICP_ENUM_BUCKETS | Schema anchoring for ICP generation |
| `prompts/index.js` | 6 | (re-exports) | Barrel file |

**Total: 30 files, ~3,650 lines of curated knowledge.**

---

## 3. How Layers Get Injected <a name="injection"></a>

`src/App.jsx` has 13 injection functions (lines ~517-800) that match keywords in the target company's industry, description, and brief context:

| Function | Triggers On | Injects |
|----------|------------|---------|
| `getPaymentsInjection()` | "payment", "acquiring", "ISO", "merchant", "POS" | Payments industry + scoring + discovery |
| `getBankingInjection()` | "bank", "credit union", "FDIC", "lending" (threshold: 2+) | Banking industry + scoring + discovery |
| `getFintechInjection()` | "fintech", "neobank", "digital banking", "embedded finance" | Fintech deep + scoring + discovery |
| `getBaaSInjection()` | "BaaS", "sponsor bank", "banking as a service", "ledger" | BaaS + scoring + discovery |
| `getHealthcareInjection()` | "health", "EHR", "clinical", "patient", "hospital" | Healthcare SaaS + scoring + discovery |
| `getMedicalPaymentsInjection()` | "medical payment", "flex card", "SNAP", "food medicine" | Medical payments + scoring + discovery |
| `getRealEstateInjection()` | "real estate", "property", "construction", "builder" | Real estate + scoring + discovery |
| `getAiMlInjection()` | "artificial intelligence", "machine learning", "AI", "LLM" | AI/ML + scoring + discovery |
| `getQsrInjection()` | "restaurant", "QSR", "food service", "franchise" | QSR + scoring + discovery |
| `getCharitableInjection()` | "charitable", "DAF", "nonprofit", "501c3", "giving" | Charitable giving + scoring + discovery |
| `getRewardsInjection()` | "reward", "incentive", "gift card", "prepaid", "loyalty" | Rewards & incentives + scoring + discovery |
| `getInvestorInjection()` | "private equity", "venture capital", "family office", "LP" | Investor intelligence + discovery |
| `getSmbInjection()` | Based on headcount/revenue thresholds, not keywords | SMB/midmarket + scoring + discovery |

**Injection points**: Each matching layer's text gets appended to the system prompt for brief generation (P1-P9), hypothesis generation, discovery question generation, and fit scoring. Multiple layers can fire simultaneously (e.g., a healthcare payments company triggers both healthcare + medical payments + payments).

### Keyword Matching Rules (from audit)
- Banking threshold raised to 2+ matches (was 1, caused false positives)
- Single common words removed from all keyword lists: "lp", "fund", "cre", "unit", "developer"
- Banking keywords cleaned: removed "rewards", "gift card", "prepaid" (hijacked Rewards vertical)
- Compound/specific keywords preferred over single words

---

## 4. Scoring Calibration Rules <a name="scoring"></a>

Each knowledge layer's `SCORING` export calibrates fit scores for that vertical:

### General Rules
- **Standard high-fit range**: 75-85%
- **Only core domain (Rewards/Incentives) gets 90-95%**
- **High-friction industries** (aerospace, telecom, energy, core banking): 5-25%
- **Cross-file scoring spread**: Normalized to 10pp max spread (was 28pp for "Vertical SaaS" across files)
- **Stage modifiers**: Seed 23.7% → Series A 31.3% → Series B 42.8% → Series C 49.5% → Series D+ 55.6%
- **Private company bonus**: +5-10% (easier buying process)
- **PE-backed bonus**: +5-15% (mandate for operational improvement)
- **Union/government penalty**: -10-20% (longer procurement cycles)

### Scoring Normalization History
- Pre-audit: 65-95% spread across files
- Post-audit (May 1): 75-92% consistent scale
- Payments/Real Estate raised 10pp
- AI/ML/Rewards/BaaS reduced 5-10pp
- Consistent terminology: "Strong Fit" = 65+, "Potential Fit" = 40-64, "Poor Fit" = <40

---

## 5. Testing History: Companies Briefed <a name="testing"></a>

### Seller Organizations Tested

These 8 organizations have been used as the "seller" (the user's company) in brief generation:

| Seller | Domain | Industry | Notes |
|--------|--------|----------|-------|
| **NeoCurrency** | neocurrency.com | Digital Rewards & Incentives | Stable ICP generation, consistent market category |
| **Tillo** | tillo.com | Digital Rewards/Gift Cards | Good consistency (7/10 fields stable) |
| **Tango Card** | tangocard.com | Rewards & Incentives | Moderate consistency, Deloitte briefs had strategic focus drift |
| **Black Hawk Network (BHN)** | blackhawknetwork.com | Prepaid/Payments | Stale exec data (Bryan Haynes departed), GTCR acquisition context |
| **InComm** | incomm.com | Payments/Prepaid Technology | USAA briefs showed exec identification inconsistency |
| **Savvai** | savvai.com | AI Sales Intelligence | Deloitte briefs had opening angle variance (3 variants) |
| **Evermore Outcomes** | evermoreoutcomes.com | Healthcare Outcomes | Good UnitedHealth consistency (7/10 stable) |
| **AwardCo** | awardco.com | Employee Recognition | Moderate Deloitte consistency (5/10 stable) |

### Target Companies Briefed (from consistency + grounding audits)

**Consistency test targets** (each tested 3+ runs with different sellers):
- JPMorgan Chase, Marriott International, Deloitte, USAA, UnitedHealth Group

**Grounding audit targets** (37 total briefs across 4 rounds):
- Round 1 (21 briefs): Broad cross-industry sample — banking, insurance, healthcare, tech, retail, professional services
- Round 2 (7 briefs): Focused on problem areas from Round 1
- Round 3 (5 briefs): Edge cases and ambiguous names
- Round 4 (3 briefs): Final validation

**Specific companies with documented issues:**
- **Apollo.io** — Identity confusion: deep intel calls (P7/P8/P9) had no URL anchor, returned data for Apollo Global Management ($938B AUM, NYSE: APO) instead of Apollo.io (the enrichment platform). Fixed with identity anchor variable.
- **Mole Street** — Identity confusion: mixed Mole Street Consulting (Philadelphia HubSpot agency) with Molestreet (Indian e-commerce). HQ said "India", competitors included "Flipkart". Fixed with same URL anchor.
- **Deloitte** — CEO contradiction across brief sections: P1 said Caruso, P3 said Ucuzoglu, P7 said Girzadas. Fixed with cross-section consistency validator.
- **BHN** — Stale executive (Bryan Haynes departed years ago still listed as current). Glassdoor data missing despite 3000+ reviews. Fixed with exec staleness warnings + mandatory Glassdoor search allocation.
- **Fluz** — Quick Takes inconsistency: different TL;DR on successive runs due to thin context on first run vs full context on cached second run. Fixed by making TL;DR a single dedicated call after ALL data collected.

### 100 Sample Accounts (for pipeline testing)

The `sampleAccounts.js` file contains 100 companies across 18 industries used for cohort analysis testing:
- Banking (11): JPMorgan, BofA, Wells Fargo, Citi, Goldman, US Bank, PNC, KeyBank, Huntington, M&T, First Business Financial
- Insurance (9): State Farm, USAA, Allstate, Progressive, Travelers, Liberty Mutual, Nationwide, Chubb, Prudential
- Health Insurance (7): UnitedHealth, Elevance, Cigna, Humana, Aflac, Kaiser, Centene
- Healthcare Providers (6): HCA, CVS, Tenet, DaVita, IEHP, LifeStance
- Retail & E-commerce (9): Walmart, Amazon, Target, Costco, Home Depot, Lowe's, Best Buy, Publix, Kroger
- Consumer Goods (6): P&G, Unilever, Estee Lauder, Kimberly-Clark, Nike, Cargill
- Technology/SaaS (8): Microsoft, Oracle, Salesforce, Adobe, ServiceNow, Workday, Atlassian, Bloomberg
- Fintech (8): Stripe, Block/Square, PayPal, Adyen, Plaid, Brex, Ramp, Carta
- Hospitality & Travel (6): Marriott, Hilton, Hyatt, Delta, American Airlines, United Airlines
- Manufacturing (6): 3M, Honeywell, ITW, Parker Hannifin, Emerson, Caterpillar
- Media & Entertainment (4): Disney, WBD, Comcast, Netflix
- Transportation (4): UPS, FedEx, Union Pacific, C.H. Robinson
- Professional Services (4): Deloitte, PwC, EY, KPMG
- Energy & Utilities (3): NextEra, ExxonMobil, Duke Energy
- Real Estate (3): Prologis, Simon Property, Equity Residential
- Education (2): Coursera, 2U
- Telecom (2): Verizon, AT&T
- Automotive (1): Ford
- Aerospace & Defense (1): Boeing

---

## 6. Grounding Audit Results <a name="grounding"></a>

Four progressive audit rounds testing brief quality:

### Round 1 — 21 briefs
| Metric | Result |
|--------|--------|
| TL;DR populated | 29% (6/21) |
| Elevator pitch populated | 29% |
| Placeholder text present | 52% (11/21 had `[PLACEHOLDER]` or stub text) |
| Executive accuracy | ~60% (stale data, wrong companies) |

**Root causes identified**:
- TL;DR was crammed into P3 with only 2400 token budget — not enough room
- No identity anchor in deep intel calls (P7/P8/P9)
- No explicit instruction to avoid placeholders
- Glassdoor search not mandatory

### Round 2 — 7 briefs (after first fixes)
| Metric | Result |
|--------|--------|
| TL;DR populated | 57% |
| Elevator pitch populated | 57% |
| Placeholder text present | 29% |

**Fixes applied**: P3 token budget 2400->3800, placeholder stripping regex, identity anchor added

### Round 3 — 5 briefs (edge cases)
| Metric | Result |
|--------|--------|
| TL;DR populated | 80% |
| Elevator pitch populated | 80% |
| Placeholder text present | 20% |

**Fixes applied**: Mandatory Glassdoor search allocation, exec staleness warnings

### Round 4 — 3 briefs (final validation)
| Metric | Result |
|--------|--------|
| TL;DR populated | 100% |
| Elevator pitch populated | 100% |
| Placeholder text present | 0% |

**Final fixes**: TL;DR as dedicated micro-call (single call after allDone with full context), cross-section consistency validator

---

## 7. Consistency Test Results <a name="consistency"></a>

Automated consistency testing: same seller+target pair run 3 times, measuring field stability.

### Per-Seller Results

**NeoCurrency.com -> JPMorgan Chase (Banking)**
- Stability: 6/10 fields
- Stable: seller name, market category, ICP industries, company size, revenue range
- Drifting: executives (Kristin Lemkau vs Marianne Lake), products, opening angle

**Tillo.com -> Marriott International (Hospitality)**
- Stability: 7/10 fields
- Stable: revenue ($33.2B), employees (190K), industry, HQ
- Drifting: products (different solution emphasis), opening angle

**Tango Card -> Deloitte (Professional Services)**
- Stability: 4/10 fields
- Drifting: revenue ($65.3B vs $65.4B), ownership ("Private" vs "Partnership"), opening angle (3 variants)

**Black Hawk Network -> USAA (Insurance)**
- Stability: 2/10 fields — WORST
- Drifting: revenue ($30B+ vs $35B+), employees (~23K vs ~30K), opening angle (3 variants), executives
- Root cause: USAA is private mutual — limited public data sources

**InComm -> USAA (Insurance)**
- Stability: 2/10 fields
- Same USAA data scarcity issue

**Savvai.com -> Deloitte (Professional Services)**
- Stability: 6/10 fields
- Stable: revenue ($65.3B)
- Drifting: opening angle (3 variants), products, research angle

**Evermore Outcomes -> UnitedHealth Group (Health Insurance)**
- Stability: 7/10 fields — BEST (tied with Tillo->Marriott)
- Stable: revenue ($324.2B), employees (440K), competitors
- Drifting: opening angle (measured vs unmeasured outcomes framing)

**AwardCo -> Deloitte (Professional Services)**
- Stability: 5/10 fields

### Consistency Patterns
- **Public companies with abundant data** (JPMorgan, UnitedHealth, Marriott) = more stable
- **Private companies** (USAA, Deloitte) = more drift due to data scarcity
- **Opening angle** = most volatile field across all tests (subjective framing)
- **Revenue and employee count** = stable for public, unstable for private
- **Executives** = frequently unstable (training data staleness)

---

## 8. Fit Scoring Test Results <a name="fit-scoring"></a>

Tillo.com scored against 25 target companies, multiple runs each:

| Target | Avg Score | Spread | Band |
|--------|-----------|--------|------|
| USAA | 62 | 16 | Potential |
| Allstate | 62 | 22 | Potential (unstable) |
| State Farm | 58 | 17 | Potential (unstable) |
| Estee Lauder | 55 | 10 | Potential |
| Target Corp | 47 | 13 | Potential/Poor border |
| Elevance Health | 38 | unstable | Poor/Potential border |
| Unilever | 34 | - | Poor |
| P&G | 34 | - | Poor |
| CVS Health | 31 | - | Poor |
| HCA Healthcare | 27 | - | Poor |
| Walmart | 25 | - | Poor |
| Amazon | 25 | - | Poor |
| JPMorgan Chase | 24 | - | Poor |
| Bank of America | 22 | - | Poor |
| Wells Fargo | 22 | - | Poor |
| Microsoft | 22 | - | Poor |
| UnitedHealth | 20 | - | Poor |

**Insight**: Tillo (gift card/rewards platform) correctly scores highest against insurance companies (employee rewards, customer loyalty) and retail (gift card programs), lowest against banking and healthcare (not core gift card buyers).

---

## 9. Known Issues Found & Fixed <a name="issues"></a>

### Critical Bugs (All Fixed)

| Issue | Impact | Fix |
|-------|--------|-----|
| **Disambiguation parse bug** | Every disambiguation since feature launch was a no-op — `claudeFetch` returns `{content: [{type: "text", text: '{"matches":[...]}'}]}` but code checked `result?.matches` directly | Parse JSON from content blocks using `extractJsonWithKey` |
| **Deep intel identity contamination** | Apollo.io briefs got Apollo Global Management data ($938B AUM); Mole Street got Indian e-commerce data | Added `deepIntelIdentity` variable with target URL injected into P7/P8/P9 |
| **Cross-section CEO contradiction** | Deloitte brief: P1 said Caruso, P3 said Ucuzoglu, P7 said Girzadas — all plausible ex-CEOs | Cross-section consistency validator runs after all phases, flags contradictions |
| **Stale executive detection** | Bryan Haynes (departed BHN years ago) appeared as current exec | Explicit prompt: "EXECUTIVES CHANGE JOBS. Your training data may be stale." |
| **TL;DR quality** | Only 29% populated; when present, often half-baked | Dedicated micro-call AFTER allDone with full context — single quality call, never early thin version |
| **Glassdoor not populating** | BHN (3000+ reviews) showed nothing — P5 used both searches on news | Mandatory Glassdoor search allocation (1 of 2 web searches reserved) |
| **Capability mismatch** | Tango Card suggested for payroll/hiring bonuses (not their product) | Seller exclusions ("What We Do NOT Do") injected into prompts, capability guard in proof pack |

### Knowledge Layer Bugs (All Fixed)

| Issue | Fix |
|-------|-----|
| Banking keywords too broad ("rewards", "gift card" hijacked Rewards vertical) | Removed cross-vertical keywords, raised banking threshold to 2+ |
| Synapse collapse amount inconsistent across BaaS/banking/fintech files | Harmonized to "$95M+" across all files |
| Sponsor bank lists contradicted across files | Harmonized (Cross River, Coastal, Column, Lead) |
| Galileo/Marqeta classified differently across files | Reclassified consistently as "issuer processors" |
| Scoring normalization: 28pp spread for "Vertical SaaS" across files | Normalized to 10pp max spread |
| Payments missing from hypothesis injection point | Added injection |
| Investor discovery was completely unwired | Connected to knowledge layer system |
| Anthropic claims in AI/ML layer were editorial | Softened to factual |
| McDonald's editorial language in QSR layer | Neutralized |
| TAM cited as fit reason in Healthcare layer | Removed (TAM doesn't determine fit) |

---

## 10. Quality Feedback & Design Principles <a name="feedback"></a>

### User Directives (from Joe Galano, CEO)

1. **"Accuracy and completeness of information are the bedrock of our value"** — This is the #1 priority. Every data point must be grounded. No guessing.

2. **"Why would we show something half baked?"** — Never show partial/thin output. If data isn't ready, wait. The TL;DR was killed as an early-thin-version and rebuilt as a single quality call after all data is collected.

3. **"I am OK with the brief taking a little longer to generate IF that improves our accuracy"** — Speed is secondary to quality. Token budgets were increased multiple times (P3: 2400->3800, P4: 2600->4500, SA review: 3000->4500).

4. **"Every output must be tailored to seller + buyer + context, never generic or templated"** — Dynamic recommendations only. No boilerplate. The seller's products, differentiators, and exclusions must shape every section.

5. **"Knowledge layers, scoring heuristics, integrations are trade secrets"** — IP protection at every layer. Server-side only, JWT-gated, plan-based access tiers.

### Anti-Patterns to Avoid

- **Never invent data**: Claims must be grounded or marked `[unsupported -- verify]`
- **Never use [PLACEHOLDER]**: If you can't fill a field, omit it entirely
- **Never show stale exec data without warning**: Executives change jobs; always caveat
- **Never suggest capabilities the seller doesn't have**: Check exclusions first
- **Never use single common words as keywords**: Use compound/specific terms
- **Never let one vertical's keywords trigger another**: Cross-check keyword lists

### Brief Generation Rules

- **Identity anchor**: Every AI call includes target company URL to prevent entity confusion
- **Seller proof pack**: Unified block (differentiators, named customers, competitive alternatives) injected into brief, hypothesis, and solution fit
- **Cross-section consistency**: Validator runs after all phases, flags contradictions in revenue, executives, ownership
- **Placeholder stripping**: Regex removes any remaining `[PLACEHOLDER]`, `[TBD]`, `[TO BE DETERMINED]` after generation
- **No URL = paraphrase**: If a claim has no supporting URL, paraphrase instead of quoting
- **18-month recency filter**: News/events older than 18 months are deprioritized
- **3-phase exec fallback**: Web search -> training knowledge -> structured stubs

---

## 11. Gaps & Areas for Deepening <a name="gaps"></a>

### Verticals Without Deep Knowledge Layers

These industries appear in the sample accounts but have NO dedicated knowledge file — they rely on generic `verticalPlaybooks.js` heuristics only:

1. **Insurance** — 9 sample accounts, major industry, NO dedicated layer. State Farm, USAA, Allstate, Progressive all tested. USAA showed worst consistency (2/10 fields stable). Needs: InsurTech landscape, carrier vs MGA vs broker dynamics, Guidewire/Duck Creek/Majesco stack, distribution economics, regulatory (NAIC model laws, state-specific).

2. **Retail & E-commerce** — 9 sample accounts, NO dedicated layer. Needs: unified commerce, omnichannel, POS landscape (Shopify, Square, Lightspeed), fulfillment/3PL, subscription commerce, retail media networks, RFID/inventory.

3. **Manufacturing** — 6 sample accounts, NO dedicated layer. Needs: Industry 4.0, ERP landscape (SAP, Oracle, Infor), MES, supply chain visibility, IoT/IIoT, reshoring trends, quality management.

4. **Professional Services** — 4 sample accounts (Big 4), tested extensively (Deloitte in 3 consistency tests), NO dedicated layer. Needs: partnership economics, practice area dynamics, consulting vs audit vs tax, utilization metrics, talent leverage models.

5. **Energy & Utilities** — 3 sample accounts, NO dedicated layer. Needs: grid modernization, DER, renewable integration, utility software (Oracle Utilities, SAP IS-U), rate case dynamics, NERC compliance.

6. **Hospitality & Travel** — 6 sample accounts, Marriott tested in consistency, NO dedicated layer. Needs: PMS landscape (Oracle Opera, Agilysys), revenue management, loyalty programs, OTA dynamics, labor scheduling.

7. **Media & Entertainment** — 4 sample accounts, NO dedicated layer. Needs: streaming economics, ad tech, content supply chain, audience measurement, rights management.

8. **Transportation & Logistics** — 4 sample accounts, NO dedicated layer. Needs: TMS landscape, last-mile, freight brokerage, fleet management, ELD compliance.

9. **Consumer Goods / CPG** — 6 sample accounts, NO dedicated layer. Needs: trade promotion, DTC, retail execution, demand planning, category management.

10. **Education / EdTech** — 2 sample accounts, NO dedicated layer. Needs: LMS landscape, enrollment management, student information systems, FERPA, Title IV.

11. **Telecom** — 2 sample accounts, NO dedicated layer. Needs: BSS/OSS stack, 5G economics, MVNO model, churn dynamics, regulatory (FCC, net neutrality).

12. **Automotive** — 1 sample account, NO dedicated layer. Needs: EV transition, dealer model vs direct, connected vehicle, OEM software platforms.

13. **Aerospace & Defense** — 1 sample account, NO dedicated layer. Needs: ITAR/EAR, FedRAMP, cost-plus vs FFP, prime vs sub dynamics, CMMC.

### Existing Layers That Need Deepening

1. **B2B Sales** (50 lines) — Thinnest layer. Needs: modern buyer journey data, consensus selling, multi-threading tactics, champion-building playbook, competitive displacement methodology.

2. **OKR/KPI** (53 lines) — Thin cross-cutting layer. Needs: industry-specific KPI benchmarks, metric definition standards, reporting cadence best practices.

3. **Accounting/Finance** (81 lines) — Covers fundamentals but needs: FP&A tool landscape (Anaplan, Adaptive, Vena), close management, ASC 606 revenue recognition nuances, treasury management.

4. **Investor Intelligence** (71 lines) — Needs: LP/GP dynamics detail, fund structures (continuation vehicles, secondaries), SPV economics, due diligence checklist depth.

### Cross-Cutting Improvements

1. **Regulatory freshness** — All layers should tag regulatory citations with effective dates so staleness is detectable. Example: "GENIUS Act (passed Senate 2025)" should note when it became law (or didn't).

2. **M&A activity tracking** — Several layers reference M&A activity (GTCR/BHN, Synapse collapse) but these go stale fast. Need a consistent "last verified" convention.

3. **Discovery question bank depth** — The `DISCOVERY_QUESTION_BANK` in `icpFitKnowledge.js` is the only centralized question bank. Each vertical layer has its own discovery questions but they're not cross-referenced. Consider a unified question taxonomy.

4. **Competitor landscape data** — Some layers have detailed competitor data (QSR: Toast 24%, Square 28%; Healthcare: Epic 42%) but most don't. Adding market share data where available would improve brief accuracy.

5. **International coverage** — Almost all layers are US-focused. Medical payments has some international (UK/Singapore/Germany). Expanding to UK/EU/APAC for key verticals would support international sales teams.

---

## Appendix: Knowledge Layer Q2 2026 Refresh Sources

The May 7-8 refresh pulled from 5 source documents covering:
- FDIC Quarterly Banking Profile Q4 2025
- GENIUS Act (stablecoin regulation) + OCC crypto letters IL 1170-1186
- Section 1033 open banking saga
- Reg II / Durbin Amendment vacatur
- Federal Reserve AI adoption survey data
- Gartner agentic AI research (40% cancellation rate)
- DAFRC Q2 2026 refresh (DAF accounts + assets)
- FASB ASU 2023-07 (segment reporting), ASU 2023-08 (crypto assets), ASU 2023-05 (joint ventures)
- CMS Medicare Advantage supplemental benefits updates
- PE/VC dry powder data ($3.6T PE, fintech multiples 5-15x)

All 12 existing layers were refreshed. 2 new layers were added (medical payments, SMB/midmarket).
