# Cost Model & Pricing — Cambrian Catalyst

**Last updated:** 2026-04-16
**Source data:** measured token usage from consistency-test harnesses + Anthropic API pricing as of this date.

> Run live scenarios: `node scripts/pl.mjs`. Edit assumptions in that script to model different pricing or usage patterns.

---

## TL;DR

- **Variable cost per active rep / month: ~$3-10** depending on usage tier.
- **Fixed infrastructure cost: ~$45/month** until you exceed Vercel/Supabase free-tier limits.
- **At any reasonable SaaS price point ($29-99/seat/mo), gross margins are 85-97%.**
- **Pricing is constrained by perceived value, not COGS.** This isn't a "thin margins, high volume" play — every customer is highly profitable.

---

## Assumptions (verify before quoting customers)

### Anthropic API pricing (per million tokens)
| Model | Input | Output |
|---|---|---|
| **Haiku 4.5** (primary) | $1.00 | $5.00 |
| **Sonnet 4.5** (overload fallback) | $3.00 | $15.00 |
| `web_search_20250305` tool | $0.01 per search |

### Sonnet fallback rate
Modeled at **5% of all calls** based on Anthropic capacity events observed during this build. Adjust higher if you operate during sustained outage windows.

### Infrastructure (monthly fixed)
| Item | Cost | Notes |
|---|---|---|
| Vercel Pro | $20 | Required once you exceed Hobby's bandwidth/function limits (~100K invocations) |
| Supabase Pro | $25 | Required for >500 MB DB or >2 GB egress |
| Domain (cambriancatalyst.com) | ~$1 | Annualized |
| **Total fixed** | **~$46/mo** | Remains flat until next tier (~10K MAU) |

---

## Per-stage AI costs (measured)

Tokens measured from the v107 consistency harness. Costs computed at Haiku rates.

| Stage | Calls | ~Input tok | ~Output tok | Cost/run |
|---|---|---|---|---|
| ICP build (Phase 1 web_search + Phase 2 anchored) | 2 | 5K | 6K | **$0.04** |
| RFP intel (open + closed, both with web_search) | 2 | 4K | 5K | **$0.05** |
| Brief (5 micro-calls in parallel) | 5 | 8K | 10K | **$0.06** |
| Hypothesis (RIVER + JOLT + talk tracks) | 1 | 2K | 1.5K | **$0.01** |
| Discovery questions (sales + architecture tracks) | 1 | 2K | 1.5K | **$0.01** |
| Fit-scoring (1 batch of 20 accounts) | 1 | 1.5K | 2K | **$0.012** |
| Post-call routing | 1 | 2.5K | 1.5K | **$0.011** |
| Solution Fit review | 1 | 3K | 3K | **$0.018** |
| Find Targets (generation w/ web_search + scoring batch) | 2 | 3K | 4K | **$0.05** |

### "Cost per fully-worked account" (one full deal cycle)
Brief + Hypothesis + Discovery + Post-call + Solution Fit = **$0.11**

### "Cost per seller setup" (one-time / per ICP regeneration)
ICP + RFP intel = **$0.09**

---

## User personas (variable cost per rep/month)

### Light user — 5 deals worked / month
Sales rep occasionally using the tool; not core workflow.
- 1× seller setup: $0.09
- 1× fit-score 50 accounts (3 batches): $0.04
- 5× full deal cycle: $0.55
- **Total: $0.68/month** + Sonnet fallback (5%) = **~$0.71/mo**

### Medium user — 20 deals worked / month
Active rep, runs the tool weekly.
- 1× seller setup: $0.09
- 2× fit-score 200 accounts (10 batches each = 20 batches): $0.24
- 20× full deal cycle: $2.20
- 2× target generation: $0.10
- **Total: $2.63/month** + 5% fallback = **~$2.76/mo**

### Heavy user — 50 deals worked / month
Daily user, runs target generation regularly.
- 2× seller setup (with regenerations): $0.18
- 4× fit-score 500 accounts (100 batches): $1.20
- 50× full deal cycle: $5.50
- 4× target generation: $0.20
- 4× RFP intel refresh: $0.20
- **Total: $7.28/month** + 5% fallback = **~$7.64/mo**

### Power user — 100+ deals, multi-product/team
Heavy daily use, multiple sellers, frequent regenerations.
- 4× seller setup (multi-product): $0.36
- 8× fit-score 1000 accounts (400 batches): $4.80
- 100× full deal cycle: $11.00
- 10× target generation: $0.50
- 10× RFP intel: $0.50
- **Total: $17.16/month** + 5% fallback = **~$18.02/mo**

---

## Pricing scenarios

Each row assumes 1,000 active users (so fixed-cost allocation is $0.046/user).

| Plan | Price/seat/mo | Variable cost | Fixed alloc | Gross profit | Gross margin |
|---|---|---|---|---|---|
| **Free** (acquisition) | $0 | $0.71 | $0.05 | -$0.76 | n/a (CAC) |
| **Starter** | $29 | $0.71 | $0.05 | $28.24 | **97%** |
| **Pro** | $79 | $2.76 | $0.05 | $76.19 | **96%** |
| **Team** ($199 for 3 seats) | $66/seat | $7.64 | $0.05 | $58.31 | **88%** |
| **Enterprise** | $299/seat | $18.02 | $0.05 | $280.93 | **94%** |

### Recommended tier structure

```
Free trial   — 14 days, full feature, capped at 5 deals (acquisition only)

Starter      — $39/mo per seat
               · Light users (<10 deals/mo)
               · 1 seller URL, no team features
               · Includes: ICP, fit-scoring, brief, hypothesis, in-call,
                 post-call

Pro          — $99/mo per seat
               · Medium users (10-30 deals/mo)
               · Multiple seller URLs, target generation, RFP intel
               · Discovery question SA-track
               · Solution Fit review

Team         — $79/mo per seat (3-seat min, $237 floor)
               · Shared sessions, team activity feed
               · Same features as Pro

Enterprise   — Custom (~$299/seat with floor)
               · SSO, audit log, JWT auth on /api endpoints
               · LinkedIn Sales Nav integration
               · SLA, dedicated support
               · Compliance / data residency
```

---

## Sensitivity analysis

### What if Sonnet fallback rate triples (15% instead of 5%)?
| Persona | Base cost | At 15% fallback |
|---|---|---|
| Light | $0.71 | $0.84 (+18%) |
| Medium | $2.76 | $3.30 (+19%) |
| Heavy | $7.64 | $9.16 (+20%) |
| Power | $18.02 | $21.61 (+20%) |

Even 3× the assumed overload rate keeps every tier at 85%+ margin at suggested prices.

### What if user count is small (50 active users)?
Fixed allocation rises to $0.92/user/mo. Negligible impact at any tier above Free.

### What if Anthropic raises Haiku 50% (to $1.50/$7.50)?
| Persona | Current cost | At +50% |
|---|---|---|
| Light | $0.71 | $1.06 |
| Medium | $2.76 | $4.14 |
| Heavy | $7.64 | $11.46 |
| Power | $18.02 | $27.03 |

Power-user cost approaches 10% of Pro plan price — still a comfortable margin, but worth modeling if model prices ever climb.

### Worst-case stack: 50% price increase + 15% Sonnet fallback
Power user variable cost: ~$32/month. Pro tier at $99 still has 67% margin. Enterprise at $299 still has 89%.

**Conclusion: pricing decisions should be driven by perceived value and market positioning, not by cost defense.**

---

## Costs you don't yet have (but might)

These are NOT modeled above. Add them when relevant.

| Item | Estimated monthly cost | Trigger |
|---|---|---|
| LinkedIn Sales Navigator API | $99-$165/seat (passed to user) | Idea 2 (connection mapping, Path C) |
| Crystal / Clearbit person enrichment | ~$0.10-$0.50/profile | If we add personalization data |
| Apollo.io / ZoomInfo | $50-$200/user | If we add prospect database |
| Twilio / Aircall (live call) | ~$0.02/min | If voice agent ships (Pattern D) |
| Analytics (PostHog, Mixpanel) | $0-$0 then $25 | At scale |
| Error monitoring (Sentry) | $0 → $26 → $80 | At scale |
| Uptime monitoring (Better Stack) | $0 → $25 | At scale |
| Email (Resend) | $0 first 3K then $20 | When we send transactional |
| Data warehouse (Supabase already covers) | n/a yet | Beyond ~10M rows |
| Compliance (SOC 2 audit) | $20K-$60K one-time | Enterprise sales requirement |
| Legal (privacy policy, ToS, BAA) | $2K-$10K one-time | Public launch |

**Budget for "real launch":** ~$30-80K one-time (compliance, legal, possibly enrichment data) + ~$200/mo recurring once monitoring stack is added.

---

## Per-deal break-even

If a sales rep closes ONE deal worth $10K ARR per month attributable to the tool:
- Cost to seller: $7-18/mo (Pro tier price minus our COGS = pure value)
- Tool ROI: 50-100× ARR / cost ratio

A reasonable B2B SaaS sales tool justifies itself at ~5-10x ROI. We're well above that even with conservative attribution.

---

## How to update this model

1. Edit assumptions in `scripts/pl.mjs`
2. Run `node scripts/pl.mjs` to print scenarios
3. Pass `--users=N --plan=pro` to model specific cohorts
4. When Anthropic updates pricing or our token usage shifts (e.g., new prompts), re-measure with the consistency harness then update the per-stage table above.
