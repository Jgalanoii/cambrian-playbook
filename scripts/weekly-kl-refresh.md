# Weekly Knowledge Layer Refresh — Architecture

## Why Weekly Refresh Matters

Knowledge layers contain Tier 2 data (cyclical, sourced) that goes stale:
- M&A activity changes competitive landscapes monthly
- Regulatory frameworks shift (EU AI Act enforcement, state privacy laws)
- Funding rounds change company dynamics (post-Series C = different buyer)
- Executive turnover changes buying committees
- Market sizing updates from analyst reports

A layer written in May 2026 with "Stripe raised $6.5B at $50B valuation" is stale by July if Stripe IPOs.

## Refresh Mechanism

### Option A: Automated Cron + AI Refresh (Recommended)

A weekly script that:
1. For each knowledge layer, extracts the key quantitative claims
2. Web-searches for updates to those claims
3. Flags stale data points
4. Generates a refresh report
5. Optionally auto-updates Tier 2 claims with new data

**Implementation:**
```javascript
// scripts/refresh-knowledge-layers.mjs
// Run weekly via: node scripts/refresh-knowledge-layers.mjs
// Or via GitHub Actions cron: 0 8 * * 1 (Mondays 8am UTC)

// For each knowledge layer:
// 1. Extract claims with [verified MM/YYYY] tags
// 2. Check if the verification date is > 90 days old
// 3. Web search for updated data
// 4. Generate a diff report
// 5. Flag for human review or auto-update
```

### Option B: Manual Quarterly Review

A checklist per layer:
- [ ] Market sizing updated?
- [ ] Top 5 companies still accurate? (M&A, bankruptcy, IPO)
- [ ] Regulatory framework current?
- [ ] Trigger events still relevant?
- [ ] New entrants to add?

### Recommended: Start with Option B, Build Toward A

**Phase 1 (Now):** Manual quarterly review with a checklist
**Phase 2 (Month 2):** Automated stale-claim detection script
**Phase 3 (Month 3):** AI-powered refresh with web search + human approval

## Tier Classification for Refresh

| Tier | Description | Refresh Cadence | Method |
|------|-------------|-----------------|--------|
| Tier 1 | Structural facts (industry definition, segment names) | Annually | Manual |
| Tier 2 | Cyclical data (market size, funding, regulations) | Quarterly + stale detection | Semi-automated |
| Tier 3 | Volatile data (exec names, stock prices, recent news) | NEVER in static layers | Live web search at runtime |

## GitHub Actions Workflow

```yaml
name: knowledge-layer-refresh
on:
  schedule:
    - cron: '0 8 * * 1'  # Mondays 8am UTC
  workflow_dispatch: {}

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: '22'
      - name: Check for stale claims
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/refresh-knowledge-layers.mjs
      - name: Upload report
        uses: actions/upload-artifact@v5
        with:
          name: kl-refresh-report
          path: reports/kl-refresh-*.json
```

## What Gets Checked Per Layer

1. **Market sizing** — search "[vertical] market size 2026" and compare
2. **Top company list** — search "[company] acquisition OR IPO OR bankruptcy 2026"
3. **Regulatory** — search "[regulation name] update 2026"
4. **Funding rounds** — search "[company] funding round 2026"
5. **Executive changes** — search "[company] CEO OR CFO change 2026"
6. **New entrants** — search "[vertical] startup funding 2026"

## Output: Weekly Refresh Report

```json
{
  "date": "2026-06-02",
  "layersChecked": 31,
  "staleClaimsFound": 12,
  "autoUpdated": 0,
  "needsReview": 12,
  "details": [
    {
      "layer": "fintechKnowledge",
      "claim": "Stripe valued at $50B",
      "currentData": "Stripe IPO'd at $70B (June 2026)",
      "action": "UPDATE",
      "confidence": "high"
    }
  ]
}
```
