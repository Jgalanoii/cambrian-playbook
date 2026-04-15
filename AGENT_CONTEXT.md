# Cambrian Catalyst — RIVER Playbook Engine
**Agent onboarding context. Last updated: 2026-04-15 (tag `v102-icp-consistency`)**

---

## What this app does
B2B sales intelligence tool for Cambrian Catalyst LLC (West Seattle).
Takes a seller's website + a list of target accounts, runs AI research,
and produces account briefs, discovery frameworks, and post-call routing —
all structured around the RIVER framework (Reality, Impact, Vision, Entry, Route).

---

## Live URLs
- Production: https://cambrian-playbook.vercel.app
- GitHub: https://github.com/Jgalanoii/cambrian-playbook
- Local: `~/Desktop/cambrian-playbook`
- Supabase: `xtnidawfuaxwwwcnkewu.supabase.co`

---

## Tech stack
- Frontend: React 19 + Vite 6
- Styling: inline CSS string injected via `<style>` + Google Fonts (Lora + DM Sans)
- Auth + DB: Supabase (anon key auth, `sessions` table with RLS)
- AI: Anthropic Claude via serverless proxies (`/api/claude.js`, `/api/claude-stream.js`)
- Deployment: Vercel (auto-deploy from `main`)
- Models: `claude-haiku-4-5-20251001` (all calls). Sonnet reserved but not wired.

---

## Repository layout
```
src/
  App.jsx                ~5,034 lines — the monolith (extraction in progress)
  App.css                (mostly unused; styling lives in App.jsx string)
  main.jsx               entry
  config/constants.js    COHORT_COLORS (15), MAX_OUTCOMES, MAX_DOCS, MAX_PRODUCTS
  lib/
    api.js               callAI + streamAI wrappers (NOT yet imported by App.jsx)
    supabase.js          sbAuth / sbGetUser / sbSessions helpers (likewise)
    utils.js             parseACV, labelOrgSize, buildCohorts, calcConfidence, etc.
  data/
    outcomes.js          universal business imperatives
    riverFramework.js    RIVER_STAGES (imported by App.jsx)
    sampleAccounts.js    demo data
    negotiationFrameworks.js
    rfpSources.js        global RFP registry + CPV/NAICS codes
    prompts/
      fitScoring.js
      icpGeneration.js
      briefGeneration.js
      negotiationInjections.js
  stages/
    S9_SolutionFit.jsx   EXTRACTED — presentational component
    (S1/S5/S6/S8 still inline in App.jsx)
  components/             (empty — extraction not yet started)
  hooks/                  (empty)
api/
  claude.js               60s timeout, forces temperature:0 server-side
  claude-stream.js        120s timeout, SSE, forces temperature:0 server-side
scripts/
  consistency/
    test-icp.mjs          Node harness for ICP drift measurement
    sellers.json          golden seller list for tests
    README.md             how to run
    results/              gitignored — regenerated per run
```

---

## Environment variables
| Variable | Where | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel server-side only (NO `VITE_` prefix) | Claude API key — used by `/api/claude*.js` |
| `VITE_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Supabase anon key |

**Critical**: `ANTHROPIC_API_KEY` must NEVER get `VITE_` prefix — it would end up in the browser bundle.

---

## App flow (10 steps)
0. Auth (Supabase)
1. Seller URL → ICP build
2. ICP review + RFP Intel tab
3. Account import (CSV) → cohort build
4. Accounts table → fit scoring
5. Account Review → Brief generation
6. RIVER hypothesis + talk tracks
7. In-call discovery capture
8. Post-call routing + email
9. **Solution Fit Review** (now in `src/stages/S9_SolutionFit.jsx`)

---

## Key functions in App.jsx
| Function | Approx lines | Purpose |
|---|---|---|
| `buildSellerICP()` | 1699–1790 | Two-phase ICP: research + anchored generation. Caches to localStorage. |
| `fetchRFPIntel()` | ~1880 | Haiku call to generate open + closed RFP intel by ICP industry |
| `generateBrief()` | 651–838 | 5 micro-calls (p1-p4 stream via `streamAI`, p5 uses web_search) |
| `buildRiverHypo()` | ~2043 | RIVER hypothesis + JOLT + talk tracks |
| `scoreFit()` | ~1691 | Batch fit scoring, 20 accounts/batch |
| `pickAccount()` | ~2008 | Brief wrapper — sets state, calls `generateBrief` |
| `buildSolutionFit()` | ~2112 | Post-call SA review. Renders via `<S9SolutionFit/>` |
| `streamAI()` | 506 | SSE streaming helper |
| `callAI()` | 549 | Non-streaming Haiku JSON wrapper, 3x retry |

---

## AI call inventory
All calls go through `/api/claude` (standard) or `/api/claude-stream` (SSE). Proxies force `temperature:0`.

| Call | Model | Max tok | Streaming | Notes |
|---|---|---|---|---|
| ICP phase 1 (research) | Haiku | 2000 | No | Uses `web_search_20250305` (max_uses:1). Critical for sellers Haiku doesn't know from training. |
| ICP phase 2 (build) | Haiku | 6000 | Yes | Anchored enum schema (see below) |
| `fetchRFPIntel` | Haiku | 3000 | No | Also uses training knowledge |
| `scoreFit` batch | Haiku | 1400 | No | 20 accounts / call |
| `generateBrief` p1–p4 | Haiku | 1800–2400 | **Yes** (streamed) | Overview, execs, strategy, solutions |
| `generateBrief` p5 | Haiku | 1800 | No | Uses `web_search_20250305` tool |
| `buildRiverHypo` | Haiku | 900 | No | |
| `buildSolutionFit` | Haiku | 5500 | No | |
| `synthesize` (post-call) | Haiku | 2000 | No | |

---

## ICP consistency system (as of v102)
This is the defining feature of v102. The ICP used to drift wildly between runs (17–19 of 20 fields unstable, size ranges swinging 200–50K ↔ 500–10K between runs). Now:

1. **Anchored enum schema** (App.jsx:1727). `companySize`, `revenueRange`, `dealSize`, `salesCycle`, `adoptionProfile`, `ownershipTypes`, `geographies` are forced to pick from fixed buckets — no free-form ranges.
2. **localStorage cache** (App.jsx:1699). Keyed by normalized seller URL + schema version (`ICP_CACHE_VERSION = "v2"`). Once generated, reused forever for that user. Bump the version constant if you change the ICP schema shape — old cached entries fall through to regeneration.
3. **Explicit Regenerate button** (App.jsx:2948). Confirm dialog → forces `buildSellerICP(url, {forceRefresh:true})`.
4. **Phase 1 uses `web_search`** (App.jsx:1727). Without this, obscure sellers (Tillo, Cambrian, Savvi) returned "Unknown" for every field — Haiku's training data doesn't cover the long tail. With live search, 5/5 runs on Tillo returned identical anchored fields.
5. **Cache quality gate** (App.jsx:1783). ICPs containing "Unknown" / "Unable to determine" / "PICK ONE" in core fields are NOT cached — next load retries. Prevents permanent failure for the first user of an obscure seller if web_search momentarily fails.

### Verifying consistency
```bash
node scripts/consistency/test-icp.mjs            # N=5, all sellers, ~$0.25
N=3 SELLER=gong.io node scripts/consistency/test-icp.mjs
```
Reports drift per field. Current baseline (v102): 4 core numeric fields 100% stable on known sellers (Gong, Tango, Savvi); narrative fields (`topPains`, `priorityInitiative`, etc.) still vary and are the next candidates for anchoring if needed.

If you change the Phase 2 prompt in App.jsx, also update `generateICP()` in `scripts/consistency/test-icp.mjs` or the tests won't reflect reality.

---

## Data model
### Supabase: `sessions`
- `id` (uuid)
- `user_id` (text) — RLS: `auth.uid()::text = user_id` (cast required)
- `name` (text)
- `seller_url` (text)
- `data` (jsonb) — full serialized app state via `getSessionSnap()`

Session blob fields: `sellerUrl, sellerInput, productUrls, sellerICP, products, sellerDocs, rows, headers, mapping, fileName, importMode, cohorts, selectedCohort, fitScores, accountQueue, selectedAccount, selectedOutcomes, dealValue, dealClassification, brief, riverHypo, gateAnswers, riverData, notes, postCall, solutionFit, contactRole`.

---

## RIVER framework
5 stages: Reality → Impact → Vision → Entry Points → Route. Each has Gates (MC), Discovery (text), Talk Track, Objections. Confidence 0–98% via `calcConfidence()` (gate answers + discovery text length).

---

## Knowledge layer — negotiation & influence
Defined in `src/data/negotiationFrameworks.js` + `src/data/prompts/negotiationInjections.js`. **Not yet imported by App.jsx** — reference-only until stages are extracted.

| Framework | Stage | Use |
|---|---|---|
| Voss — Never Split the Difference | S7 | Calibrated How/What questions, labeling, accusation audit |
| Fisher/Ury — Getting to Yes | S7+S8 | BATNA, interests vs positions |
| Cialdini — Influence | S5+S6 | Social proof, authority, scarcity |
| Sun Tzu — Art of War | S3+S5 | Know enemy, adapt to terrain (Moore), underserved stakeholder |
| Graham — Intelligent Investor | S4+S8 | Margin of safety (3–5× value), disqualify fast |
| Crucial Conversations | S7 | Safety signals, STATE method |
| JOLT Effect | S6 | Judge/Offer/Limit/Take-risk — indecision kills 40–60% of deals |
| Challenger Customer | S5 | Mobilizers (13%), commercial insight |

---

## Knowledge layer — fit scoring (`src/data/prompts/fitScoring.js`)

### "The Wall" (score 5–15% — 100% poor fit for startup sellers)
Automotive/Mfg 5.9% · Aerospace & Defense Prime 5.8% · Telecom 6.1% · Energy Oil/Gas 11.3% · Energy Utilities 13.4% · Mass Market Retail 13.6% · Tier 1 Banks (JPM/BAC/WF) 12.6%.

### Tier 1 targets (60–75%)
Large Private Insurance/Finance 65.2% · Large Private Tech/Data/Media 64.5% · Large Private Professional Services 63.3% · P&C/Life/Specialty 62.5% · CPG HPC/Beauty 61.9% · Regional/Community Banks 59.5% · Healthcare IT/Digital Health 54.9%.

### Stage thresholds
Seed 23.7% · Series A 33.6% · Series B 41.8% · Series C 49.0% · Series D+ 55.6%.

### Buying signals
Recent funding <12mo +8 · Private vs public +5–8 · >200K employees (Seed–C) −15 · >50% union −20.

---

## Knowledge layer — RFP sources (`src/data/rfpSources.js`)

Priority order (non-government first per UX):
1. Private/Commercial — Fortune 500, Ariba, Coupa, Jaggaer, SAP Fieldglass
2. US Federal — SAM.gov, FPDS-NG, USASpending.gov
3. EU/UK — TED Europa (27 countries), Find a Tender, Contracts Finder
4. Multilateral — World Bank, UNGM, ADB, IDB
5. US State/Local — DemandStar, state portals
6. APAC — AusTender, GeBIZ, GETS NZ, MERX Canada
7. LatAm — CompraNet, Mercado Público, SEACE, SICE

### RFP signal scoring
Active match +20 · Recent award +10 · Historical buyer +5 · Incumbent risk −10.

### Code mappings (samples)
- Fintech/Payments: CPV 66000000/66100000/72000000 · NAICS 522320/522390/523130
- SaaS/Software: CPV 72000000/72200000/48000000 · NAICS 511210/541511/541512
- AI/ML: CPV 72212000/72316000 · NAICS 541715/541511

### RFP Intel UI (S1 tab)
Toggle: All / 🏢 Private-Commercial / 🏛 Government. Tables for open RFPs (Title/Buyer/Source/Value/Deadline/Cohort/Fit%) and closed awards (adds Awarded To — incumbent intel). `isGovernment` flag drives badge colors.

---

## Security
- `ANTHROPIC_API_KEY`: server-side only, no VITE_ prefix
- Supabase anon key: VITE_ prefixed, in Vercel env + `.env.local` (gitignored)
- RLS on sessions: `auth.uid()::text = user_id`
- All Claude calls via proxy — no direct browser→Anthropic
- `/api/claude` + `/api/claude-stream` enforce `temperature:0` server-side regardless of request body

---

## Known tech debt
- `App.jsx` is ~5,034 lines. Only S9 extracted. `S1/S5/S6/S8` still inline.
- `src/lib/*` and `src/data/*` files exist but are NOT imported by App.jsx (reference only). See modularization roadmap.
- CSS is a ~400-line string inside App.jsx. Should migrate to App.css.
- Brief `p5` (live search) is still non-streaming because of `web_search` tool constraint.
- RFP Intel uses Haiku training knowledge — not live SAM.gov / TED API.
- ICP narrative fields (`topPains`, `priorityInitiative`, `uniqueDifferentiators`) still drift run-to-run — only anchored fields are stable.
- `sellerStage` variable is in scope only inside the React component (not accessible to extracted prompts).

---

## Modularization roadmap
### Done
- `src/config/constants.js`
- `src/lib/api.js` (callAI, streamAI, callAIRaw) — *not yet imported by App.jsx*
- `src/lib/supabase.js` — *not yet imported*
- `src/lib/utils.js` — *not yet imported*
- `src/data/outcomes.js`, `riverFramework.js`, `sampleAccounts.js`, `negotiationFrameworks.js`, `rfpSources.js`
- `src/data/prompts/fitScoring.js`, `icpGeneration.js`, `briefGeneration.js`, `negotiationInjections.js`
- **`src/stages/S9_SolutionFit.jsx`** ✅ (v102)

### Next — stage extraction (safest → largest)
- [ ] `src/stages/S8_PostCall/`
- [ ] `src/stages/S6_Hypothesis/`
- [ ] `src/stages/S1_ICP/` (trickiest — lots of state + cache logic)
- [ ] `src/stages/S5_Brief/` (largest — do last)

### Then — shared components
- [ ] `components/UI/EditableField.jsx`
- [ ] `components/UI/LoadingBox.jsx`
- [ ] `components/UI/PieChart.jsx`
- [ ] `components/Auth/AuthGate.jsx`
- [ ] `components/Layout/Header.jsx`

---

## Git tags
- `v99-clean` — early stable
- `v100-stable` — last stable before API migration
- `v101-modular-foundation` — lib/data/config extracted, knowledge layer complete
- **`v102-icp-consistency`** — anchored ICP schema + localStorage cache + S9 extract + Brief streaming + consistency harness

---

## Deployment
Vercel auto-deploys from `main`. **Never** run `vercel --prod` from `src/` — always from project root.

---

## Seller context (Cambrian Catalyst)
- Founder: Joe G — solo operator, West Seattle
- Background: Tango (digital rewards/RaaS), Grant Thornton (compliance)
- Focus: GTM + revenue growth consulting, fintech/payments/digital incentives
- Active client: Savvi AI (ABM engagement)
- This tool: internal GTM intelligence for client engagements

---

## Pending for next session
- [ ] Wire SAM.gov live API for real RFP signal detection
- [ ] Wire TED Europa live API for EU account matching
- [ ] Add RFP signal badges to accounts table fit scores
- [ ] Extract next stage module (S8 PostCall suggested next)
- [ ] Migrate App.jsx to actually `import` from `src/lib/api.js`, `lib/supabase.js`, `lib/utils.js` (currently duplicate implementations)
- [ ] CSS string → App.css migration
- [ ] Consider anchoring narrative ICP fields (`topPains`, `priorityInitiative`) if users complain about drift
- [ ] Verify `VITE_SUPABASE_*` env vars are set in Vercel dashboard (manual)
