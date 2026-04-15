# ICP Consistency Harness

Measures how much ICP output drifts across repeated runs for the same seller — catches the "different ICP every time" problem (employee size, revenue range, industries, etc.).

## Run

```bash
# Default: 5 sellers × 5 runs each, ~$0.90
node scripts/consistency/test-icp.mjs

# Fewer runs
N=3 node scripts/consistency/test-icp.mjs

# One seller only
SELLER=gong.io node scripts/consistency/test-icp.mjs
```

Reads `ANTHROPIC_API_KEY` from `.env.local` automatically. Calls Anthropic direct — no dev server, no Vercel.

## Configure sellers

Edit `sellers.json`. Each entry: `{ url, stage, notes }`.

## Output

- `results/<seller>/run-N.json` — raw phase-1 + phase-2 output for each run
- `results/report.json` — structured drift report
- Terminal: summary showing which fields drifted across N runs, per seller

## What "drift" means

For each ICP field tracked (`companySize`, `revenueRange`, `industries`, etc.):
- **STABLE** — all N runs returned identical value
- **PARTIAL** — some runs agree, some don't (e.g. 2/5 unique values)
- **FULLY UNSTABLE** — every run returned something different (N/N unique)

For numeric range fields (`companySize`, `revenueRange`, `dealSize`, `salesCycle`), also reports **bound spread** — how far apart the min/max endpoints vary across runs. This is the metric that matters for Joe's specific complaint ("sometimes 1K-100K, sometimes 500-50K").

## Ports from App.jsx

The ICP generator is a direct port of `buildSellerICP()` at `src/App.jsx:1693`. If you change the ICP prompt in App.jsx, update `generateICP()` in `test-icp.mjs` to match, or the tests won't reflect reality.
