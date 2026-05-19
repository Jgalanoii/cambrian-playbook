# Cambrian Catalyst — Product Overview

> **Status**: Private Beta (May 2026)
> **Founded by**: Joe Galano, Cambrian Catalyst LLC, West Seattle
> **Production**: cambriancatalyst.ai
> **Tagline**: "Evolve how you sell."

## What It Is

Cambrian Catalyst is a **Sales Intelligence Platform** that helps B2B sales teams prepare for customer conversations with AI-powered research, structured discovery frameworks, and real-time coaching. The core promise: **every rep walks into every conversation as the most prepared person in the room.**

It is NOT a CRM, not a dialer, not a sequencing tool. It sits upstream of all of those — it's the intelligence and preparation layer that makes every downstream tool more effective.

## Who It's For

- **Primary users**: Account Executives (AEs), Sales Development Reps (SDRs), Solution Architects, Revenue leaders
- **Company profile**: B2B SaaS, FinTech, PayTech, InsurTech, HealthTech, professional services, enterprise software
- **Company size**: Mid-market to enterprise (Series B+ benefits most, but works for any stage)
- **Use case**: Pre-call research, deal qualification, discovery capture, post-call analysis, team enablement

### Wedge ICP (Locked May 2026)

Boutique GTM consultants and fractional revenue leaders. These are the people who advise 3-10 companies simultaneously, need deep research fast, and can evangelize the tool to their portfolio companies.

## What It Does — The Full Workflow

### 1. Seller Setup
Configure your organization: name, URL, products/services, differentiators, what you do NOT do (exclusions prevent the AI from suggesting capabilities you don't have).

### 2. ICP Building (2-phase)
- **Phase 1**: Web research on seller URL to understand market positioning
- **Phase 2**: Structured ICP generation anchored to real data — industries, company sizes, revenue ranges, deal sizes, sales cycles, adoption profiles, ownership types, geographies

### 3. Account Import & Scoring
- CSV import, sample data, or AI-generated target accounts
- **3-dimension fit scoring**: ICP Alignment (40%) + Customer Similarity (30%) + Competitive Landscape (30%)
- Fit bands: Strong Fit (65+), Potential Fit (40-64), Poor Fit (<40)

### 4. Brief Generation (9 parallel micro-calls, ~30 seconds)

| Phase | Produces |
|-------|----------|
| P1 — Overview | Company snapshot, revenue, ownership, employees, HQ, founded, funding, competitors, watch-outs |
| P2 — Executives | Key execs (name, title, background, selling angle), seller snapshot |
| P3 — Strategy | Elevator pitch, strategic theme, seller opportunity, opening angle, public sentiment |
| P4 — Solutions | Solution mapping (product to customer pain), case studies, contacts, tech stack, mobilizer profile, DMAIC maturity |
| P5 — Live Search | Headlines, growth signals, Glassdoor/G2/Trustpilot sentiment, workforce culture, incumbent vendors |
| P6 — Open Roles | Current job listings, hiring patterns, strategic signals from hiring |
| P7 — Competitive | Market position, primary competitors + strengths/weaknesses, displacement angle |
| P8 — Board & Investors | Board members, lead investors, investment thesis, board mandate |
| P9 — Financials | Revenue trend, margins, segment breakdown, earnings insight, capital priorities |

**Plus**: TL;DR (dedicated micro-call after all phases complete), 5 Questions (top discovery questions tailored to the specific seller-buyer pair), Cross-Section Consistency Validator.

### 5. RIVER Framework — Proprietary Discovery Methodology

| Stage | Name | Purpose |
|-------|------|---------|
| R1 | **Reality** | Current state — where are they broken? How handling today? |
| I | **Impact** | Cost of inaction — dollars, time, people, reputation |
| V | **Vision** | Success in 90 days — what does "win" look like? |
| E | **Entry Points** | Buying committee — who decides, who blocks, who champions? |
| R2 | **Route** | Fastest path to "yes" — next step with named person and date |

Each stage has: talk tracks, objection handlers, discovery questions (dual-track: SALES + ARCHITECTURE), and deal gates that calculate confidence %.

### 6. Milton — AI Sales Coach
Embedded coaching assistant with full knowledge layer access. Personality: dry wit, Office Space / Glengarry Glen Ross energy. Context-aware per deal stage — gives different advice in Reality vs Route.

### 7. Post-Call Analysis
- Automatic deal routing (Fast Track / Nurture / Disqualify)
- CRM-ready call summary
- Follow-up email generation
- Solution Architecture review

## Tech Stack

- **Frontend**: React 19 + Vite 6, custom CSS with design tokens
- **Auth & DB**: Supabase (PostgreSQL + Auth + Row-Level Security)
- **AI**: Anthropic Claude via Vercel serverless proxies
  - Primary: claude-haiku-4-5 (speed)
  - Fallback: claude-sonnet-4-5 (quality, auto-triggered on Anthropic overload)
  - Tools: web_search (max 3 uses per call)
- **Enrichment**: Apollo.io API (firmographics, people search, email reveal)
- **Knowledge Layer**: Server-side only — JWT-gated API, plan-based tiering, never in client bundle
- **Deployment**: Vercel (auto-deploy from main)
- **Payments**: Stripe Checkout with 4 tiers

## Pricing Tiers

| Tier | Monthly | Runs/Month | For |
|------|---------|-----------|-----|
| Starter | $99 | 25 | Individual AEs who refuse to wing it |
| Pro | $349 | 100 | Teams that want every rep prepared |
| Team | $799 | 250 | Orgs done with inconsistent prep |
| Enterprise | $2,500+ | 1,000+ | Revenue teams wanting custom intelligence |

1 run = 1 full brief generation. Guest mode: 2 free Quick Briefs.

## Unit Economics

- Light user (5 deals/mo): ~$0.57 COGS
- Heavy user (50 deals/mo): ~$6.84 COGS
- **Gross margin: 91-98% across all tiers**

## Core Design Principles

1. **No invention**: Every prompt explicitly forbids fabrication. Claims must be grounded in proof or marked `[unsupported -- verify]`.
2. **Accuracy over speed**: User explicitly prefers slower, more accurate briefs over fast incomplete ones. Never show half-baked output.
3. **Dynamic recommendations**: Every output is tailored to the specific seller + buyer + context. Nothing is generic or templated.
4. **IP protection**: Knowledge layers, scoring heuristics, and integration logic are trade secrets — protected at every layer (server-side only, JWT-gated, plan-based access).
5. **Seller exclusions**: "What We Do NOT Do" prevents the AI from suggesting capabilities the seller doesn't have. This prevents embarrassing mismatches in prospect-facing output.
6. **Identity anchoring**: Every AI call includes the target company's URL to prevent entity confusion (e.g., "Apollo" the enrichment tool vs "Apollo Global Management" the $938B fund).

## Competitive Landscape

| Competitor | Focus | Funding | How Cambrian Differs |
|-----------|-------|---------|---------------------|
| Gong | Call recording + analytics | $300M | Cambrian is PRE-call intelligence, Gong is post-call |
| Clay | Data enrichment + outbound | $100M | Clay is volume outbound, Cambrian is deep research per account |
| Apollo.io | Contact database + sequencing | $150M | Apollo is contact data, Cambrian uses Apollo as one data source |
| Actively AI | Real-time account signals | $68M | Actively triggers alerts, Cambrian builds full prep packages |
| 11x | AI SDR (automated outreach) | $76M | 11x replaces the SDR, Cambrian makes the SDR better |

**Cambrian's moat**: The knowledge layer. 30 files, 3,650+ lines of curated heuristics covering 19 industry verticals, 13 compliance frameworks, negotiation tactics from 11 published frameworks, and proprietary scoring rules. This isn't a wrapper around an LLM — it's a structured intelligence system.

## Positioning Statement

> Cambrian Catalyst is the RIVER-native sales intelligence platform that turns any account into a structured discovery opportunity. Built for teams who refuse to wing it — research, framework, and coaching in one tool. When every rep walks in prepared, deals move faster and win rates climb.
