# Cambrian Catalyst — RIVER Playbook Engine
## Agent Context File — Last Updated: April 15, 2026

---

## What This App Does
B2B sales intelligence tool for Cambrian Catalyst LLC (West Seattle).
Takes a seller's website + a list of target accounts, runs live AI research,
and produces account briefs, discovery frameworks, and post-call routing —
all structured around the RIVER framework (Reality, Impact, Vision, Entry, Route).

---

## Live URLs
- Production: https://cambrian-playbook.vercel.app
- GitHub: https://github.com/Jgalanoii/cambrian-playbook
- Local: ~/Desktop/cambrian-playbook
- Supabase: xtnidawfuaxwwwcnkewu.supabase.co

---

## Tech Stack
- Frontend: React 19 + Vite 6
- Styling: Inline CSS string injected via style tag + Google Fonts (Lora + DM Sans)
- Auth + DB: Supabase (anon key auth, sessions table with RLS)
- AI: Anthropic Claude via serverless proxy (/api/claude.js + /api/claude-stream.js)
- Deployment: Vercel (auto-deploy from main branch)
- Models: claude-haiku-4-5-20251001 (all calls), claude-sonnet-4-20250514 (reserved, not currently active)

---

## Repository Structure
---

## Environment Variables
| Variable | Where | Purpose |
|---|---|---|
| ANTHROPIC_API_KEY | Vercel server-side only | Claude API — /api/claude.js + /api/claude-stream.js |
| VITE_SUPABASE_URL | Vercel + .env | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Vercel + .env | Supabase anon key |

**CRITICAL**: ANTHROPIC_API_KEY has NO VITE_ prefix — server-side only, never in browser bundle.

---

## App Flow (10 Stages)
---

## Key Functions in App.jsx
| Function | Lines (approx) | Purpose |
|---|---|---|
| buildSellerICP() | ~1750-1880 | Two-phase ICP: web research (phase 1) + streamAI generation (phase 2) |
| fetchRFPIntel() | ~1880-1940 | Haiku call to generate open + closed RFP intel by ICP industry |
| generateBrief() | ~770-1100 | 4 parallel Haiku calls + live web search |
| buildRiverHypo() | ~2043-2200 | RIVER hypothesis + JOLT + talk tracks |
| scoreFit() | ~1691-1760 | Batch fit scoring, 20 accounts/batch |
| pickAccount() | ~2008-2040 | Brief wrapper — sets state, calls generateBrief |
| streamAI() | ~640-680 | SSE streaming helper — ICP phase 2 uses this |
| callAI() | ~680-720 | Haiku JSON wrapper, 3x retry |
| buildCohorts() | lib/utils.js | Groups accounts into industry cohorts (no limit) |
| calcConfidence() | lib/utils.js | RIVER gate answers → confidence % |

---

## AI Call Architecture
All Claude calls flow through serverless proxies:
- Standard: /api/claude.js (60s timeout)
- Streaming: /api/claude-stream.js (120s timeout, SSE)

### Call Inventory
| Call | Model | Max Tokens | Streaming | Purpose |
|---|---|---|---|---|
| ICP phase 1 | Haiku | 800 | No | Web research |
| ICP phase 2 | Haiku | 6000 | YES — streamAI() | Full ICP generation |
| fetchRFPIntel | Haiku | 3000 | No | Open + closed RFP intel |
| scoreFit batch | Haiku | 1400 | No | 20 accounts/batch |
| generateBrief p1-p4 | Haiku | varies | No | 4 parallel brief sections |
| generateBrief p5 | Haiku | 1800 | No | Live web search |
| buildRiverHypo | Haiku | 900 | No | RIVER hypothesis |
| buildSolutionFit | Haiku | 900 | No | SA review |
| synthesize | Haiku | 2000 | No | Post-call routing |

---

## Data Model
### Supabase Tables
**sessions**
- id (uuid)
- user_id (text) — RLS: auth.uid()::text = user_id (cast required)
- name (text)
- data (jsonb) — full serialized app state

### Session State Blob (sessions.data)
```javascript
---

## RIVER Framework
5 stages: Reality → Impact → Vision → Entry Points → Route
Each stage has: Gates (multiple choice), Discovery (open text), Talk Track, Objections
Confidence score 0-98% from calcConfidence() based on gate answers

---

## Knowledge Layer — Negotiation & Influence Frameworks

Stored in: `src/data/negotiationFrameworks.js` + `src/data/prompts/negotiationInjections.js`

### Stage Mapping
| Framework | Stage | Application |
|---|---|---|
| Voss — Never Split the Difference | S7 In-Call | Calibrated How/What questions, tactical empathy, mirroring, labeling, accusation audit |
| Fisher/Ury — Getting to Yes | S7 + S8 | BATNA, interests vs positions, objective criteria, invent options |
| Cialdini — Influence | S5 Brief + S6 Hypothesis | Social proof, authority, reciprocity, commitment, scarcity |
| Sun Tzu — Art of War | S3 Fit + S5 Brief | Know enemy, adapt to terrain (Moore profile), find underserved stakeholder |
| Graham — Intelligent Investor | S4 + S8 | Margin of safety (3-5x value), value vs price, disqualify fast |
| Crucial Conversations | S7 In-Call | Safety signals, STATE method, explore before responding |
| JOLT Effect | S6 Hypothesis | Judge/Offer/Limit/Take-risk — indecision kills 40-60% of deals |
| Challenger Customer | S5 Brief | Mobilizers (13%), teaching angle, commercial insight |

### Key Prompt Injections (in App.jsx prompts)
- Discovery questions: Voss calibrated questions, Fisher/Ury interests, Cialdini social proof
- Hypothesis/talk tracks: JOLT, Voss accusation audit, Sun Tzu, Cialdini scarcity
- Brief: Gartner 17% rule, JOLT, Challenger, DMAIC mapping

---

## Knowledge Layer — Fit Scoring Heuristics

Stored in: `src/data/prompts/fitScoring.js`

### The Wall (score 5-15% — 100% poor fit for startup sellers)
- Automotive/Manufacturing: 5.9% avg — 65% union, incumbent ERP
- Aerospace & Defense Prime: 5.8% avg — ITAR, FedRAMP required
- Telecom (AT&T/Verizon): 6.1% avg — 50% union, 5-deep stack
- Energy Oil & Gas: 11.3% avg
- Energy Utilities: 13.4% avg
- Mass Market Retail >100K: 13.6% avg
- Tier 1 Banks (JPM/BAC/WF): 12.6% avg

### Tier 1 Targets (score 60-75%)
- Large Private Insurance/Finance: 65.2% — State Farm, TIAA, Nationwide
- Large Private Tech/Data/Media: 64.5% — Bloomberg, Valve, SAS
- Large Private Professional Services: 63.3% — Deloitte US, EY, KPMG
- Insurance P&C/Life/Specialty: 62.5% — Allstate, Progressive, Travelers
- CPG HPC/Beauty: 61.9% — P&G, Kimberly-Clark
- Regional/Community Banks: 59.5% — 85 targets, ignored by startups
- Healthcare IT/Digital Health: 54.9%

### Stage Thresholds
- Seed: 23.7% avg — zero viable enterprise paths
- Series A: 33.6% — niche only, no Tier 1 banks
- Series B: 41.8% — departmental landing only
- Series C: 49.0% — first real enterprise traction
- Series D+: 55.6% — full enterprise motion viable

### Buying Signals
- Recent funding <12mo: +8pts
- Private vs public: +5-8pts
- >200K employees (Series A-C): -15pts
- >50% union workforce: -20pts

---

## Knowledge Layer —
---

## RIVER Framework
5 stages: Reality → Impact → Vision → Entry Points → Route
Each stage has: Gates (multiple choice), Discovery (open text), Talk Track, Objections
Confidence score 0-98% from calcConfidence() based on gate answers

---

## Knowledge Layer — Negotiation & Influence Frameworks

Stored in: `src/data/negotiationFrameworks.js` + `src/data/prompts/negotiationInjections.js`

### Stage Mapping
| Framework | Stage | Application |
|---|---|---|
| Voss — Never Split the Difference | S7 In-Call | Calibrated How/What questions, tactical empathy, mirroring, labeling, accusation audit |
| Fisher/Ury — Getting to Yes | S7 + S8 | BATNA, interests vs positions, objective criteria, invent options |
| Cialdini — Influence | S5 Brief + S6 Hypothesis | Social proof, authority, reciprocity, commitment, scarcity |
| Sun Tzu — Art of War | S3 Fit + S5 Brief | Know enemy, adapt to terrain (Moore profile), find underserved stakeholder |
| Graham — Intelligent Investor | S4 + S8 | Margin of safety (3-5x value), value vs price, disqualify fast |
| Crucial Conversations | S7 In-Call | Safety signals, STATE method, explore before responding |
| JOLT Effect | S6 Hypothesis | Judge/Offer/Limit/Take-risk — indecision kills 40-60% of deals |
| Challenger Customer | S5 Brief | Mobilizers (13%), teaching angle, commercial insight |

### Key Prompt Injections (in App.jsx prompts)
- Discovery questions: Voss calibrated questions, Fisher/Ury interests, Cialdini social proof
- Hypothesis/talk tracks: JOLT, Voss accusation audit, Sun Tzu, Cialdini scarcity
- Brief: Gartner 17% rule, JOLT, Challenger, DMAIC mapping

---

## Knowledge Layer — Fit Scoring Heuristics

Stored in: `src/data/prompts/fitScoring.js`

### The Wall (score 5-15% — 100% poor fit for startup sellers)
- Automotive/Manufacturing: 5.9% avg — 65% union, incumbent ERP
- Aerospace & Defense Prime: 5.8% avg — ITAR, FedRAMP required
- Telecom (AT&T/Verizon): 6.1% avg — 50% union, 5-deep stack
- Energy Oil & Gas: 11.3% avg
- Energy Utilities: 13.4% avg
- Mass Market Retail >100K: 13.6% avg
- Tier 1 Banks (JPM/BAC/WF): 12.6% avg

### Tier 1 Targets (score 60-75%)
- Large Private Insurance/Finance: 65.2% — State Farm, TIAA, Nationwide
- Large Private Tech/Data/Media: 64.5% — Bloomberg, Valve, SAS
- Large Private Professional Services: 63.3% — Deloitte US, EY, KPMG
- Insurance P&C/Life/Specialty: 62.5% — Allstate, Progressive, Travelers
- CPG HPC/Beauty: 61.9% — P&G, Kimberly-Clark
- Regional/Community Banks: 59.5% — 85 targets, ignored by startups
- Healthcare IT/Digital Health: 54.9%

### Stage Thresholds
- Seed: 23.7% avg — zero viable enterprise paths
- Series A: 33.6% — niche only, no Tier 1 banks
- Series B: 41.8% — departmental landing only
- Series C: 49.0% — first real enterprise traction
- Series D+: 55.6% — full enterprise motion viable

### Buying Signals
- Recent funding <12mo: +8pts
- Private vs public: +5-8pts
- >200K employees (Series A-C): -15pts
- >50% union workforce: -20pts

---

## Knowledge Layer — Global RFP Sources

Stored in: `src/data/rfpSources.js`

### Priority Order (non-government first per UX design)
1. **Private/Commercial** — Fortune 500 RFPs, Ariba, Coupa, Jaggaer, SAP Fieldglass
2. **US Federal** — SAM.gov, FPDS-NG, USASpending.gov
3. **EU/UK** — TED Europa (27 countries), Find a Tender, Contracts Finder
4. **Multilateral** — World Bank ($50B+/yr), UNGM (WHO/UNICEF/WFP/UNDP), ADB, IDB
5. **US State/Local** — DemandStar, state portals
6. **APAC** — AusTender, GeBIZ Singapore, GETS NZ, MERX Canada
7. **LatAm** — CompraNet Mexico, Mercado Público Chile, SEACE Peru, SICE Colombia

### RFP Signal Detection Rules
- Active RFP match: +20 fit score boost (IMMEDIATE urgency)
- Recent award in category: +10 (HIGH urgency)
- Historical buyer: +5 (MED urgency)
- Incumbent risk detected: -10

### CPV Codes (EU TED) — Key Mappings
- Fintech/Payments: 66000000, 66100000, 72000000
- SaaS/Software: 72000000, 72200000, 48000000
- AI/ML: 72212000, 72316000
- Digital Rewards: 79342200, 79342300

### NAICS Codes (USA SAM.gov) — Key Mappings
- Fintech/Payments: 522320, 522390, 523130
- SaaS/Software: 511210, 541511, 541512
- AI/ML: 541715, 541511
- Digital Rewards: 541613, 541810

### RFP Intel UI (S1 — ICP & RFPs tab)
- Toggle: All / 🏢 Private-Commercial / 🏛 Government
- Open RFPs table: Title, Buyer, Source, Value, Deadline, Cohort, Fit %
- Closed RFPs table: Title, Buyer, Awarded To (incumbent intel!), Value, Date, Cohort, Fit %
- isGovernment flag on each RFP drives badge colors (blue=gov, green=private)

---

## Security
- ANTHROPIC_API_KEY: server-side only (no VITE_ prefix) — never in browser bundle
- VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY: in Vercel env + local .env (gitignored)
- Supabase RLS: auth.uid()::text = user_id on sessions table
- No hardcoded secrets in source (confirmed by security scan)
- All Claude calls through /api/claude proxy — no direct browser→Anthropic calls

---

## Known Issues / Tech Debt
- App.jsx is 5,300+ lines — modularization in progress (tag: v101-modular-foundation)
- stages/, hooks/, components/ directories empty — extraction not yet started
- lib/ and data/ files extracted but NOT yet imported by App.jsx (knowledge layer reference only)
- CSS is a single ~400-line string in App.jsx — should move to App.css
- Brief still has 4 parallel calls — only ICP phase 2 streams; Brief sections do not yet stream
- RFP Intel uses Haiku training knowledge — not live SAM.gov/TED API calls yet
- sellerStage variable only in scope inside React component

---

## Modularization Roadmap

### Completed (tag: v101-modular-foundation)
- [x] src/config/constants.js
- [x] src/lib/api.js — callAI() + streamAI()
- [x] src/lib/supabase.js
- [x] src/lib/utils.js
- [x] src/data/outcomes.js
- [x] src/data/riverFramework.js
- [x] src/data/sampleAccounts.js
- [x] src/data/negotiationFrameworks.js
- [x] src/data/rfpSources.js
- [x] src/data/prompts/fitScoring.js
- [x] src/data/prompts/icpGeneration.js
- [x] src/data/prompts/briefGeneration.js
- [x] src/data/prompts/negotiationInjections.js

### Next — Stage Extraction (safest first)
- [ ] src/stages/S9_SolutionFit/
- [ ] src/stages/S8_PostCall/
- [ ] src/stages/S6_Hypothesis/
- [ ] src/stages/S1_ICP/
- [ ] src/stages/S5_Brief/ ← largest, do last

### Then — Shared Components
- [ ] src/components/UI/EditableField.jsx
- [ ] src/components/UI/LoadingBox.jsx
- [ ] src/components/UI/PieChart.jsx
- [ ] src/components/Auth/AuthGate.jsx
- [ ] src/components/Layout/Header.jsx

---

## Git Tags
- v99-clean — early stable
- v100-stable — last known stable before API migration
- v101-modular-foundation — lib/data/config extracted, knowledge layer complete

---

## Deployment Commands
```bash
**Never run vercel --prod from src/ — always from project root**

---

## Seller Context (Cambrian Catalyst)
- Founder: Joe G — solo operator, West Seattle
- Background: Tango (digital rewards/RaaS), Grant Thornton (compliance)
- Focus: GTM + revenue growth consulting, fintech/payments/digital incentives
- Active client: Savvi AI (ABM engagement)
- This tool: internal GTM intelligence for client engagements

---

## Today's Session Accomplishments (April 15, 2026)

### Security
- [x] All Claude calls routed through /api/claude proxy (ANTHROPIC_API_KEY server-side)
- [x] Supabase keys moved to env vars (SB_URL, SB_KEY → VITE_ prefixed)
- [x] Supabase RLS policy added with auth.uid()::text cast
- [x] Security scan clean

### Performance
- [x] ICP phase 2 now uses streamAI() — content appears in ~1-2s
- [x] scoreFit prompt cut from 1,571 to ~200 tokens
- [x] ICP prompt cut from 2,010 to ~300 tokens
- [x] vercel.json: 60s timeout for /api/claude, 120s for /api/claude-stream
- [x] URL scanner web_search reduced to max_uses:1

### Features
- [x] RFP Intel tab on ICP page (open RFPs + closed awards + private/gov toggle)
- [x] Step renamed: "ICP" → "ICP & RFPs"
- [x] Account Review redesigned: clean boxed sections, fits single laptop screen
- [x] Accounts table "Brief →" → "Review →" routes to Account Review not Brief
- [x] All cohorts shown (removed .slice(0,5) limit), 15-color array
- [x] Build Brief button fixed (calls pickAccount() not generateBrief() directly)
- [x] Review Hypothesis button fixed (setStep(6) not setStep(5))
- [x] Start In-Call button fixed (setStep(7) not setStep(6))

### Knowledge Layer
- [x] src/data/prompts/fitScoring.js — 6M permutation rules as buildFitScoringPrompt()
- [x] src/data/prompts/icpGeneration.js — ICP frameworks (Revella/Osterwalder/Dunford/Moore)
- [x] src/data/prompts/briefGeneration.js — JOLT, Challenger, discovery prompt
- [x] src/data/prompts/negotiationInjections.js — Voss/Fisher/Cialdini/SunTzu/Graham/Cru
**Never run vercel --prod from src/ — always from project root**

---

## Seller Context (Cambrian Catalyst)
- Founder: Joe G — solo operator, West Seattle
- Background: Tango (digital rewards/RaaS), Grant Thornton (compliance)
- Focus: GTM + revenue growth consulting, fintech/payments/digital incentives
- Active client: Savvi AI (ABM engagement)
- This tool: internal GTM intelligence for client engagements

---

## Today's Session Accomplishments (April 15, 2026)

### Security
- [x] All Claude calls routed through /api/claude proxy (ANTHROPIC_API_KEY server-side)
- [x] Supabase keys moved to env vars (SB_URL, SB_KEY → VITE_ prefixed)
- [x] Supabase RLS policy added with auth.uid()::text cast
- [x] Security scan clean

### Performance
- [x] ICP phase 2 now uses streamAI() — content appears in ~1-2s
- [x] scoreFit prompt cut from 1,571 to ~200 tokens
- [x] ICP prompt cut from 2,010 to ~300 tokens
- [x] vercel.json: 60s timeout for /api/claude, 120s for /api/claude-stream
- [x] URL scanner web_search reduced to max_uses:1

### Features
- [x] RFP Intel tab on ICP page (open RFPs + closed awards + private/gov toggle)
- [x] Step renamed: "ICP" → "ICP & RFPs"
- [x] Account Review redesigned: clean boxed sections, fits single laptop screen
- [x] Accounts table "Brief →" → "Review →" routes to Account Review not Brief
- [x] All cohorts shown (removed .slice(0,5) limit), 15-color array
- [x] Build Brief button fixed (calls pickAccount() not generateBrief() directly)
- [x] Review Hypothesis button fixed (setStep(6) not setStep(5))
- [x] Start In-Call button fixed (setStep(7) not setStep(6))

### Knowledge Layer
- [x] src/data/prompts/fitScoring.js — 6M permutation rules as buildFitScoringPrompt()
- [x] src/data/prompts/icpGeneration.js — ICP frameworks (Revella/Osterwalder/Dunford/Moore)
- [x] src/data/prompts/briefGeneration.js — JOLT, Challenger, discovery prompt
- [x] src/data/prompts/negotiationInjections.js — Voss/Fisher/Cialdini/SunTzu/Graham/CrucialConv
- [x] src/data/negotiationFrameworks.js — full framework definitions with examples
- [x] src/data/rfpSources.js — global RFP registry, CPV/NAICS codes, signal rules
- [x] AGENT_CONTEXT.md — comprehensive agent onboarding document

### Pending (next session)
- [ ] Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to Vercel dashboard
- [ ] Wire SAM.gov live API for real RFP signal detection
- [ ] Wire TED Europa live API for EU account matching
- [ ] Add RFP signal badges to accounts table fit scores
- [ ] Extract first stage module (S9_SolutionFit)
- [ ] Brief sections streaming (currently only ICP streams)
- [ ] Fix accounts page showing only 5 cohorts in some views
