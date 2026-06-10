# Cambrian Catalyst — Intellectual Property & Core Logic

**Version:** June 2026 | **Classification:** Confidential — Trade Secrets

---

## IP Categories

### 1. Knowledge Layers (Trade Secret)

45 proprietary files containing deep sales intelligence for 37 industries. These are NOT prompts — they're structured knowledge bases loaded server-side and injected into prompts based on 2-tier relevance ranking.

**How they work:**
- Every brief call receives the top-ranked KL for the prospect's industry (Tier 1: full injection, Tier 2: summary only)
- KLs contain: discovery questions, scoring contexts, competitive landscapes, procurement protocols, objection handling, champion identification patterns, switching cost analysis
- Smart injection keeps prompt size manageable while providing deep vertical context

**Scale:** 1.5MB of curated intelligence across accounting, AI/ML, BaaS, banking, cannabis, charitable giving, compliance, crypto, cybersecurity, digital incentives, education, energy, fintech, gaming, government, healthcare, HR tech, insurance, investor intel, manufacturing, medical payments, negotiation, OKR/KPI, payments, PE holdco, prediction markets, professional services, QSR, real estate, retail, rewards, RFP procurement, SMB/midmarket, and cross-vertical playbooks.

---

### 2. Scoring Algorithm (Trade Secret)

**The 3-Dimension Fixed-Point Scoring System:**

**Dim 1 — Product/Service Fit (45 points max)**
- Step A: Does the seller's product category match the prospect's needs? (12/22/32/40)
- Step B: Is there evidence of specific use case alignment? (+0/2/3)
- Step C: Is there a direct product-to-pain match from case studies? (+0/2)
- Snapped to valid values: [12, 14, 22, 24, 25, 27, 32, 34, 35, 37, 40, 42, 43, 45]

**Dim 2 — Customer Lookalike (30 points max)**
- How similar is this prospect to companies the seller has already won?
- Evidence tiers: case study customer (30) > press release (27) > partner page (18) > logo wall (15) > industry match (10) > no match (3)
- Known customer override: any verified existing customer forces dim2=30

**Dim 3 — Competitive Displacement (25 points max)**
- Is there evidence the prospect buys from a known competitor?
- Verified competitor customer with evidence (25) > competitor mentioned (18) > industry overlap (12) > no intel (5)

**Score computation:**
```
rawD1 = snap(clamp(dim1, 0, 45), DIM1_VALID)
rawD2 = snap(clamp(dim2, 0, 30), DIM2_VALID)  
rawD3 = snap(clamp(dim3, 0, 25), DIM3_VALID)
total = round((rawD1/45)*w1 + (rawD2/30)*w2 + (rawD3/25)*w3)
```

**Why fixed-point:** Eliminates run-to-run variance. The same company with the same data always gets the same score. The `snap()` function rounds to the nearest valid value, preventing the model from interpolating between tiers.

---

### 3. Brief Orchestration (Trade Secret)

**10-call parallel pipeline** with:
- Per-section loading state tracking
- Per-section failure tracking with user-visible error messages
- 45-second hard timeout failsafe
- Cross-section dedup rules (zero repetition across elevator pitch, opening angle, emails)
- Streaming partial rendering (users see sections appear as they resolve)
- 3-phase fallback for executives and roles (web → training → stubs)

**Seller context injection:**
- `buildSellerCtx()` — product catalog, verified customers, proof points, exclusions
- `firmographicsTruth` — single source of truth for employee count, revenue, ownership
- Injected into ALL 10 micro-calls for consistency

**Anti-hallucination guards:**
- System prompt on every call prohibiting fabricated statistics, names, dates
- Post-processing stripping of suspected fabricated stats
- Entity contamination guard (prevents mixing data from similarly-named companies)
- Capability guard (never suggests use cases the seller can't deliver)

---

### 4. Displacement Methodology (Trade Secret)

**Strategy framework:**
- Displace when: contract renewal <6mo, incumbent failure, new leadership, M&A, sunset/EOL, regulatory change
- Land adjacent when: incumbent embedded 3+ years, no champion, recent implementation, personal relationships

**Tactical playbooks by scenario:**
- Contract renewal: engage 4-6 months before, get to procurement before RFP, offer no-cost pilot
- Incumbent failure: move within 30 days, lead with empathy not opportunism, frame as risk mitigation
- New leadership: engage in first 90 days, offer quick wins, position as their modernization narrative
- Pilot-land-expand: smallest meaningful slice, 30-day proof, define success criteria upfront

**Switching cost analysis by vertical:**
| Vertical | Level | Timeline |
|----------|-------|----------|
| Banking | High | 12-18 months |
| Healthcare | Very High | 18-24 months |
| Insurance | High | 12-18 months |
| Retail | Medium | 3-6 months back-office, 12-24 POS |
| Technology | Medium-Low | 1-3 months SaaS, 3-6 infra |
| Government | Very High | 6-24 months |

**Champion identification:** The person who asks "how do we make this happen?" vs "let me think about it." Specific behavioral signals, anti-patterns, and equipment strategy (ROI calculator, competitive comparison, implementation timeline, risk mitigation, reference customer).

---

### 5. RIVER Framework (Trade Secret)

Proprietary qualification methodology integrated into hypothesis generation and call prep:
- **R** — Recognize the trigger event
- **I** — Investigate the buying process
- **V** — Validate the pain and priority
- **E** — Establish the value bridge
- **R** — Route the deal (Fast Track / Nurture / Disqualify)

Combines elements from Challenger Sale, JOLT Effect, Voss negotiation, and MEDDICC into a unified framework purpose-built for AI-augmented sales.

---

### 6. RFP Procurement Intelligence (Trade Secret)

**5-call parallel search across:**
- SAM.gov (federal)
- State/local government portals (.gov)
- Procurement aggregators (BidNet, DemandStar, GovWin)
- Commercial procurement (Ariba, Coupa)
- Competitor displacement signals

**Recency enforcement (3 layers):**
1. Prompt instructs model to only return current results
2. Search queries only include 2025/2026
3. Client-side filter rejects anything with dates before 2025

**Quality validation:**
- URL validation (must be specific solicitation, not listing page)
- Blocked domains (social, blog, content sites)
- Relevance floor (score < 30 rejected)
- Self-contradiction guard (buyer = seller rejected)
- Seller domain rejected

---

## What Is NOT IP

- The React frontend framework (standard)
- Supabase/Vercel/Stripe integrations (standard)
- The Claude API calls themselves (API is public)
- The HTML/CSS design (standard patterns)

## What IS IP

Everything that makes the outputs *intelligent* rather than generic:
- The knowledge layers
- The scoring algorithm
- The orchestration pipeline
- The prompt engineering (dedup rules, anti-hallucination, evidence hierarchy)
- The displacement methodology
- The RIVER framework
- The seller context injection architecture
