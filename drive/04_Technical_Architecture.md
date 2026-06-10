# Cambrian Catalyst — Technical Architecture & IP

**Version:** June 2026

---

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React (Vite) | Single-page app, 15.8K lines |
| Hosting | Vercel | Auto-deploy from git, serverless functions |
| Database | Supabase (PostgreSQL) | Auth, data, RLS, 29 migrations |
| AI | Anthropic Claude (Opus/Sonnet/Haiku) | All intelligence generation |
| CRM | HubSpot (OAuth) | Prospect data push |
| Payments | Stripe | Subscription billing |
| Enrichment | SEC EDGAR + Wikidata | Free firmographic data |

---

## Model Strategy — Accuracy First

Every AI call is assigned to the cheapest model that can do the job well. Three tiers:

| Model | Cost (in/out per M) | Used For | Why This Model |
|-------|-------------------|----------|---------------|
| **Opus** | $15 / $75 | ICP research, P3 strategy/angle, target list generation | Deep reasoning, web synthesis, the seller's first impression |
| **Sonnet** | $3 / $15 | P1 overview, P2 execs, P4 solutions, P7-P10 deep intel, RFP pipeline, ICP formatting | Structured reasoning, reliable JSON, good search synthesis |
| **Haiku** | $0.80 / $4 | P5 live search, P6 roles, TL;DR, discovery Qs, scoring, hypothesis, coaching | Extraction tasks, downstream outputs using existing context |

**Principle:** Opus for high-judgment calls where quality drives the user's perception. Sonnet for structured analysis where reliability matters. Haiku for extraction-only tasks.

---

## Brief Pipeline — 10 Parallel Micro-Calls

All 10 calls fire simultaneously when a brief starts. Each produces specific fields that merge into the brief state via dedicated merger functions.

```
User clicks company
        |
        v
   [Skeleton rendered instantly — loading states per section]
        |
        +---> P1  (Sonnet, 1 search)  --> Company overview, revenue, employees, watch-outs
        +---> P2  (Sonnet, 2 searches) --> Key executives (3-phase fallback)
        +---> P3  (Opus,   1 search)  --> Pitch, strategy, angle, emails
        +---> P4  (Sonnet, 1 search)  --> Solutions, contacts, tech stack, mobilizer
        +---> P5  (Haiku,  2 searches) --> Headlines, signals, sentiment, culture
        +---> P6  (Haiku,  2 searches) --> Open positions (3-phase fallback)
        +---> P7  (Sonnet, 2 searches) --> Competitive positioning
        +---> P8  (Sonnet, 2 searches) --> Board & investors
        +---> P9  (Sonnet, 2 searches) --> Financial deep dive
        +---> P10 (Sonnet, 0 searches) --> Approval gate map
        |
        v
   [allDone resolves]
        |
        +---> TL;DR     (Haiku) --> Quick Take
        +---> 5 Questions (Haiku) --> Discovery questions
```

### Reliability Mechanisms
- **3x retry on 500/502/503** with 3s/6s/12s backoff (all three fetch functions)
- **Hard timeout at 45s** — clears all loading states so UI never hangs
- **Per-section failure tracking** — `_failedSections` array shows which sections didn't load
- **3-phase executive fallback** — web search → training knowledge → role stubs
- **3-phase roles fallback** — web search → training inference → "no data" message

---

## Scoring Architecture — 3 Dimensions, Fixed Point

```
Dim 1: Product/Service Fit  (max 45)  — Does the seller's product solve their problem?
Dim 2: Customer Lookalike   (max 30)  — Do they look like companies seller already won?
Dim 3: Competitive Displace (max 25)  — Is there evidence they buy from a competitor?

Total = (dim1/45 * weight1) + (dim2/30 * weight2) + (dim3/25 * weight3)
Default weights: 45/30/25 (user adjustable, min 10, max 60)

Labels:  75-100 = Strong Fit  |  55-74 = Potential Fit  |  0-54 = Poor Fit
Special: 0 = Needs Review (null dimensions)  |  5 = Competitor (detected)
```

### Key Mechanisms
- **snap()** — rounds to nearest valid score value, prevents interpolation variance
- **Known customer override** — dual-layer detection (pre-score + post-score), forces dim2=30
- **Competitor detection** — client-side fuzzy match against `competitiveAlternatives`, forces score=5
- **firmographicsTruth** — single source of truth for employee count, revenue, ownership injected into all 10 brief calls

---

## ICP Build — 2-Pass Architecture

```
Pass 1: Opus + 2 web searches (45s timeout)
  Input:  Seller URL
  Output: Products, case studies, named customers, competitors, evidence URLs
  
Pass 2: Sonnet, no web search (45s timeout)  
  Input:  Opus research output
  Output: Structured ICP JSON (industries, personas, sizes, triggers, etc.)
  
Fallback: If Opus fails → Sonnet with web search
          If Sonnet fails → Haiku
```

---

## RFP Pipeline — 5 Parallel Sonnet Calls

Auto-fires on every ICP build. Searches SAM.gov, state portals, commercial procurement sites.

| Call | Target | Web Searches |
|------|--------|-------------|
| Open RFPs (commercial) | Ariba, DemandStar, BidNet, corporate portals | 4 |
| Open RFPs (government) | SAM.gov, state .gov portals | 3 |
| Market signals | Industry buying signals | 2 |
| Account classification | Prospect-specific procurement | 3 |
| Account signals | Account-level buying signals | 2 |

**Recency enforcement:** Prompt-level rule (only 2025+), search terms (only 2025/2026), client-side filter (rejects dates before 2025-01-01).

---

## Data Persistence (Supabase)

| Table | Purpose |
|-------|---------|
| orgs | Organizations, seller URLs, billing |
| org_members | Users, roles, invitations |
| account_outputs | Persisted briefs, scores, hypotheses (queryable) |
| prospect_events | User actions for ML training data |
| session_journey | Session progression tracking |
| rfp_intel_signals | RFP results with relevance scoring |
| competitor_intel | Verified competitor-customer relationships |
| kl_effectiveness | Knowledge layer performance tracking |
| model_accuracy | Prediction vs outcome tracking |

---

## Security

- Row-Level Security (RLS) on all tables — users only see their own data
- Auth via Supabase (email/password, magic link)
- API guard middleware with rate limiting
- No user data used to train models (single-tenant AI calls)
- SOC 2 Type II via Anthropic (model provider)
- Seller documents processed in-session only, first 500 chars persisted
