# Cambrian Catalyst — RIVER Playbook Engine
## Agent Context File — Last Updated: April 2026

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
- Styling: Inline CSS (single CSS string injected via style tag)
- Fonts: Lora (serif) + DM Sans (sans) via Google Fonts
- Auth + DB: Supabase (anon key auth, sessions table)
- AI: Anthropic Claude via serverless proxy (/api/claude.js)
- Deployment: Vercel (auto-deploy from main branch)
- Models: claude-haiku-4-5-20251001 (fast calls), claude-sonnet-4-20250514 (ICP)

---

## Repository Structure
---

## Environment Variables
| Variable | Where | Purpose |
|---|---|---|
| ANTHROPIC_API_KEY | Vercel server-side | Claude API — used by /api/claude.js |
| VITE_SUPABASE_URL | Vercel + .env | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Vercel + .env | Supabase anon key |

**VITE_ prefix** = baked into browser bundle at build time
**No prefix** = server-side only, never exposed to browser

---

## App Flow (10 Stages)
---

## Key Functions in App.jsx
| Function | Lines (approx) | Purpose |
|---|---|---|
| buildICP() / Il() | ~1700-1870 | Two-phase ICP: web research + Sonnet generation |
| generateBrief() / wh() | ~700-1100 | 4 parallel micro-calls + live web search |
| buildHypothesis() / Wt() | ~2080-2200 | RIVER hypothesis + JOLT + talk tracks |
| scoreFit() / gl() | ~500-600 | Batch fit scoring with 6M heuristics |
| buildCohorts() | ~400-500 | Groups accounts into max 5 industry cohorts |
| calcConfidence() | ~40-45 | RIVER gate answers → confidence % |
| synthesize() / Nn() | ~2600-2700 | Post-call synthesis → deal route + email |
| buildSolutionFit() / vl() | ~2800-2900 | Solution architecture review |
| callAI() | lib/api.js | Haiku JSON wrapper with 3x retry |
| extractJSON() | lib/utils.js | Robust JSON repair for truncated responses |

---

## AI Call Architecture
All Claude calls flow through /api/claude.js (serverless):
### Call inventory
| Call | Model | Max Tokens | Purpose |
|---|---|---|---|
| callAI() | Haiku | 1000 (default) | Generic JSON generation |
| scoreFit batch | Haiku | 1400 | 20 accounts per batch |
| generateBrief p1-p4 | Haiku | varies | 4 parallel brief sections |
| generateBrief p5 | Haiku | 1800 | Live web search |
| buildICP phase 1 | Haiku | 800 | Web research |
| buildICP phase 2 | Haiku | 6000 | Full ICP generation |
| buildHypothesis | Haiku | 900 | RIVER hypothesis |
| buildSolutionFit | Haiku | 900 | SA review |
| synthesize | Haiku | 2000 | Post-call routing |

---

## Data Model
### Supabase Tables
**users**
- id (uuid) — Supabase auth UID
- email (text)
- name (text)
- role (text) — default "rep"

**sessions**
- id (uuid)
- user_id (text) — FK to users, RLS: auth.uid()::text = user_id
- name (text)
- seller_url (text)
- data (jsonb) — full serialized app state
- created_at, updated_at

### Session data blob (stored in sessions.data jsonb)
```javascript
{
  sellerUrl, sellerInput, productUrls,
  sellerICP,        // full ICP object
  products,         // [{name, description}]
  sellerDocs,       // [{name, label, content}]
  rows,             // raw CSV rows
  headers, mapping, fileName,
  cohorts,          // built cohort objects
  selectedCohort,
  fitScores,        // {companyName: {score, label, reason}}
  accountQueue,     // selected accounts [{...}]
  selectedAccount,
  selectedOutcomes, // string[]
  dealValue, dealClassification,
  brief,            // full brief object
  riverHypo,        // hypothesis object
  gateAnswers,      // {gateId: selectedOption}
  riverData,        // {discoveryId: noteText}
  notes,            // free-form call notes
  postCall,         // synthesis object
  solutionFit,      // SA review object
  contactRole
}
```

---

## RIVER Framework
5 stages, each with:
- **Gates** — multiple choice qualification questions
- **Discovery** — open text capture fields
- **Talk Track** — recommended language
- **Objections** — common objections + responses

Stages: Reality → Impact → Vision → Entry Points → Route

Confidence score (0-98%) calculated from gate answers via calcConfidence()

---

## Known Issues / Tech Debt
- App.jsx is 5,200 lines — full modularization in progress (tag: v101-modular-foundation)
- stages/, hooks/, components/ directories created but empty
- ICP phase 2 prompt is ~1,260 tokens — leaves ~4,740 for response at 6000 limit
- Accounts page shows only 5 cohorts (top 5 by size) — full list in S3 accounts table
- Brief generation can hit Anthropic 529 (overload) during peak hours — no retry UI
- sellerStage variable only in scope inside React component, not in generateBrief()
- CSS is a single 400-line string in App.jsx — should move to App.css

---

## Modularization Roadmap
### Completed (tag: v101-modular-foundation)
- [x] src/config/constants.js
- [x] src/lib/api.js
- [x] src/lib/supabase.js
- [x] src/lib/utils.js
- [x] src/data/outcomes.js
- [x] src/data/riverFramework.js
- [x] src/data/sampleAccounts.js

### Next — extract stages (safest first)
- [ ] src/stages/S9_SolutionFit/
- [ ] src/stages/S8_PostCall/
- [ ] src/stages/S6_Hypothesis/
- [ ] src/stages/S1_ICP/
- [ ] src/stages/S5_Brief/  ← largest, do last

### Then — shared components
- [ ] src/components/UI/EditableField.jsx
- [ ] src/components/UI/LoadingBox.jsx
- [ ] src/components/UI/PieChart.jsx
- [ ] src/components/Auth/AuthGate.jsx
- [ ] src/components/Layout/Header.jsx

---

## Deployment
```bash
cd ~/Desktop/cambrian-playbook
npm run build 2>&1 | tail -2
git add src/App.jsx
git commit -m "description"
git push origin main && vercel --prod
```

**Never run vercel --prod from src/ directory — always from project root**

---

## Seller Context (Cambrian Catalyst)
- Founder: Joe G — solo operator, West Seattle
- Background: Tango (digital rewards), Grant Thornton
- Focus: GTM + revenue growth consulting, fintech/payments/digital incentives
- Active client: Savvi AI (ABM engagement)
- This tool: internal GTM intelligence for Cambrian Catalyst client engagements

---

## Git Tags
- v99-clean — early stable
- v100-stable — last known stable before API migration
- v101-modular-foundation — current, lib/data/config extracted


---

## Knowledge Layer — Negotiation & Influence Frameworks

Stored in: `src/data/negotiationFrameworks.js`

These frameworks are applied throughout the app — not just referenced. Each maps to a specific stage:

### Stage Mapping
| Framework | Stage | Application |
|---|---|---|
| Voss — Never Split the Difference | S7 In-Call | Calibrated questions, tactical empathy, mirroring, labeling |
| Fisher/Ury — Getting to Yes | S7 + S8 | BATNA, interests vs positions, objective criteria |
| Cialdini — Influence | S5 Brief + S6 Hypothesis | Social proof, authority, reciprocity in talk tracks |
| Sun Tzu — Art of War | S3 Fit + S5 Brief | Know enemy (competitive intel), adapt to terrain |
| Graham — Intelligent Investor | S4 + S8 | Margin of safety, value vs price, deal qualification |
| Crucial Conversations | S7 In-Call | Safety signals, emotional escalation, STATE method |

### Key Concepts Applied
- **Calibrated Questions** → Discovery questions in S7 always start with "How" or "What"
- **BATNA** → Route stage always surfaces prospect's cost of inaction
- **Margin of Safety** → Deal qualification in S4 requires 3-5x value case
- **Art of War — Water Principle** → Talk tracks adapt to Moore adoption profile
- **Cialdini Social Proof** → Case studies in Brief match prospect's exact industry + size
- **Voss Accusation Audit** → Watch-Outs section pre-empts likely objections

### Pending Implementation
- [ ] Add Voss calibrated questions to S7 In-Call discovery question generation
- [ ] Add Cialdini social proof framing to Brief opening angle
- [ ] Add Art of War competitive positioning to watchOuts generation
- [ ] Add Graham margin of safety framing to S4 deal value selection
- [ ] Add Crucial Conversations safety signals to In-Call sidebar


---

## Knowledge Layer — Global RFP Sources

Stored in: `src/data/rfpSources.js`

### Regions Covered
| Region | Key Sources | API Access |
|---|---|---|
| USA | SAM.gov, FPDS-NG, USASpending.gov, DemandStar | Free |
| Europe | TED (27 EU countries), Find a Tender (UK), Contracts Finder | Free |
| LatAm | CompraNet, Mercado Público, SEACE, SICE, UNOPS | Free |
| APAC | AusTender, GeBIZ, GETS, MERX | Free |
| Global | World Bank, UNGM, IFC/ADB, RFPMart | Free |

### Signal Detection
- Active RFP match = +20 fit score boost
- Recent award in category = +10
- Historical buyer = +5
- Incumbent risk detected = -10

### CPV Codes (EU TED)
Maps seller category → EU Common Procurement Vocabulary codes for filtering

### NAICS Codes (USA SAM.gov)
Maps seller category → North American Industry Classification codes for SAM.gov queries

### Pending Implementation
- [ ] SAM.gov API integration in fit scoring signal detection
- [ ] TED API integration for EU account matching
- [ ] RFP Resource Library widget in app
- [ ] RFP signal badge on accounts table
