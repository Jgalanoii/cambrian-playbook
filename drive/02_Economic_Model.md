# Cambrian Catalyst — Economic Model & P/L

**Version:** June 3, 2026 | **Based on:** Actual Anthropic billing data

---

## Reality Check

| Metric | What Model Said | What Actually Happened |
|--------|----------------|----------------------|
| Cost per brief | $0.70-1.00 | **~$2.00-3.50** (10+ calls, many Sonnet with search) |
| Cost per session startup | $1.65-2.48 | **~$3.00-5.00** (ICP + RFP + accounts) |
| Daily cost (testing) | ~$12-18 | **$34-50** (actual billing June 2-3) |
| YTD total | — | **$248+** (through June 3) |

**The model was wrong.** The estimates underweighted: (a) web search costs, (b) the number of calls that actually fire, (c) retry/fallback costs, (d) RFP pipeline auto-firing on every ICP build.

---

## Pricing Tiers (Current)

| Tier | Price | Runs/Month | Target User |
|------|-------|-----------|-------------|
| **Starter** | $99/mo | 25 runs | Individual AE |
| **Growth** | $249/mo | 75 runs | Sales team (2-5 reps) |
| **Enterprise** | $499/mo | 200 runs | Revenue org |

---

## Actual Cost Per Action (Corrected)

### Full Sales Session Brief — ~$2.00-3.50

A single brief fires **12-14 API calls** (not 10 — P2 and P6 have fallback phases):

| Call | Model | Searches | Realistic Cost |
|------|-------|----------|---------------|
| P1 Overview | Sonnet | 1 | $0.08-0.12 |
| P2 Executives (2 phases) | Sonnet | 2 | $0.12-0.18 |
| **P3 Strategy/Angle** | **Opus** | 1 | **$0.50-0.80** |
| P4 Solutions | Sonnet | 1 | $0.12-0.18 |
| P5 Live Search | Haiku | 2 | $0.04-0.06 |
| P6 Roles (2 phases) | Haiku | 2 | $0.04-0.06 |
| P7 Competitive | Sonnet | 2 | $0.12-0.18 |
| P8 Board/Investors | Sonnet | 2 | $0.12-0.18 |
| P9 Financial | Sonnet | 2 | $0.12-0.18 |
| P10 Gate Map | Sonnet | 0 | $0.06-0.10 |
| TL;DR | Haiku | 0 | $0.02-0.03 |
| 5 Questions | Haiku | 0 | $0.02-0.03 |
| Consistency check | Haiku | 0 | $0.01-0.02 |
| **Total per brief** | | **~17 searches** | **$1.37-2.12** |

**Web search cost:** Anthropic charges for search tool usage beyond the base token cost. With 17 searches per brief, this adds significant overhead that token-only estimates miss.

### Session Startup — ~$3.00-5.00

| Call | Model | Searches | Realistic Cost |
|------|-------|----------|---------------|
| ICP Pass 1 (research) | Opus | 2 | $0.50-0.80 |
| ICP Pass 2 (format) | Sonnet | 0 | $0.08-0.12 |
| RFP Open (commercial) | Sonnet | 4 | $0.20-0.35 |
| RFP Open (government) | Sonnet | 3 | $0.15-0.25 |
| RFP Signals | Sonnet | 2 | $0.12-0.18 |
| Account Classification | Sonnet | 3 | $0.15-0.25 |
| Account Signals | Sonnet | 2 | $0.12-0.18 |
| Build Target Accounts | Opus | 3 | $0.80-1.20 |
| Scoring (3 batches) | Haiku | 0 | $0.10-0.20 |
| **Total startup** | | **~19 searches** | **$2.22-3.53** |

### Quick Brief — ~$0.50-0.80

| Call | Model | Searches | Realistic Cost |
|------|-------|----------|---------------|
| P1-P2 + P5-P9 | Sonnet/Haiku | ~15 | $0.45-0.70 |
| P3 | Skipped | 0 | $0.00 |
| P10 | Skipped | 0 | $0.00 |
| TL;DR + 5Q | Haiku | 0 | $0.04-0.06 |
| **Total** | | | **$0.49-0.76** |

### Other Session Costs (downstream steps)

| Action | Model | Realistic Cost |
|--------|-------|---------------|
| RIVER Hypothesis | Haiku | $0.02-0.05 |
| Discovery Questions | Haiku | $0.02-0.04 |
| Milton Coaching (per message) | Haiku | $0.01-0.03 |
| Post-Call Routing | Haiku | $0.02-0.05 |
| Solution Fit Review | Haiku | $0.02-0.05 |
| HubSpot push | Free (API) | $0.00 |

---

## Total Cost Per Full Session (Honest)

| Phase | Cost |
|-------|------|
| Session startup (ICP + RFP + accounts + scoring) | $2.22-3.53 |
| First brief | $1.37-2.12 |
| Each additional brief (same session) | $1.37-2.12 |
| Hypothesis + call prep | $0.05-0.10 |
| Live call coaching (5 messages) | $0.05-0.15 |
| Post-call | $0.04-0.10 |
| **Full session, 1 brief** | **$3.73-5.99** |
| **Full session, 3 briefs** | **$6.47-10.23** |

---

## Unit Economics by Tier (Corrected)

**Assumption:** 70% utilization, avg 2 briefs per session, 1 session startup per 5 briefs

| | Starter ($99) | Growth ($249) | Enterprise ($499) |
|---|---|---|---|
| Runs included | 25 | 75 | 200 |
| Runs used (70%) | 18 | 53 | 140 |
| Session startups | 4 | 11 | 28 |
| Brief cost (18/53/140 x $1.75) | $31.50 | $92.75 | $245.00 |
| Startup cost (4/11/28 x $3.00) | $12.00 | $33.00 | $84.00 |
| Downstream (hypo, coaching, post-call) | $5.00 | $15.00 | $40.00 |
| **Total COGS** | **$48.50** | **$140.75** | **$369.00** |
| **Gross Profit** | **$50.50** | **$108.25** | **$130.00** |
| **Gross Margin** | **51%** | **43%** | **26%** |

### The Problem

At current model pricing and call volume, **Enterprise tier is barely viable at 26% gross margin.** The $50/day testing burn rate equals ~$1,500/month, which would require 30+ Starter customers just to break even on API costs.

---

## Cost Reduction Levers

### Immediate (no quality impact)
| Lever | Savings | Risk |
|-------|---------|------|
| Re-enable brief cache (disabled now) | ~50% on repeat briefs | Must verify cache completeness first |
| Cache ICP builds (currently rebuilds every time) | ~$0.60/build saved | None if cache is valid |
| Reduce RFP search count (14 → 8) | ~$0.15-0.25/refresh | Slightly fewer results |
| Skip RFP for Quick Brief | ~$0.50-0.80 saved | Quick Brief doesn't need RFPs |

### Medium-term (some quality tradeoff)
| Lever | Savings | Risk |
|-------|---------|------|
| Move P3 from Opus to Sonnet | ~$0.30-0.50/brief | Elevator pitch may be less nuanced |
| Move ICP Pass 1 from Opus to Sonnet | ~$0.30-0.50/build | Seller research may miss case studies |
| Move Build Accounts from Opus to Sonnet | ~$0.50-0.80/build | Prospect list quality may drop |
| Reduce P7-P9 from 2 searches to 1 | ~$0.15/brief | Less financial/competitive depth |

### Long-term (structural)
| Lever | Savings | Risk |
|-------|---------|------|
| Anthropic price reductions | 20-50% | Depends on Anthropic |
| Brief caching with smart refresh | 50-70% on repeat companies | Engineering effort |
| Pre-computed industry briefs | 80% for common companies | Staleness risk |
| Batch scoring optimization | 30-50% on scoring | Latency increase |

---

## Infrastructure (Monthly Fixed)

| Item | Cost |
|------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Domain | ~$1 |
| **Total fixed** | **~$46/mo** |

---

## Key Takeaways

1. **The per-brief cost estimate was 2x too low.** Web search costs and the actual number of calls (12-14 per brief, not 10) were underweighted.
2. **Session startup is expensive.** ICP + RFP + accounts costs $3-5 before a single brief fires.
3. **Opus is ~60% of total cost** despite being only 3 of 30+ call sites.
4. **Testing is the #1 cost driver right now.** Each test cycle costs $4-6. At 8-10 cycles/day during development, that's $40-60/day.
5. **The brief cache is the single biggest savings lever.** Re-enabling it (once stable) cuts repeat-company costs to near zero.
6. **Margins need work.** At current pricing, only Starter has acceptable margins. Growth and Enterprise need either price increases or cost reductions.
