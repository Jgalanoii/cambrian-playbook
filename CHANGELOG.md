# Changelog

All notable changes to Cambrian Catalyst RIVER Playbook. Newest first.

Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Dates are in `YYYY-MM-DD`.

---

## [v105-ux-polish] — 2026-04-15

### Added
- **Design tokens** (`:root { --... }`) at the top of the stylesheet. Single source of truth for colors, radii, shadows, motion. 12 semantic tokens replace 40+ scattered hex literals. Documented inline — adding a raw hex color now means first adding a token.
- **Redesigned stepper**: 24px filled circles, connecting rails that fill as you progress (tan when completed, half-tan-half-gray on the active rail), active step gets a subtle focus ring + slight scale. Real `<button>` elements with proper `disabled` + `aria-current` instead of clickable divs. Labels hide on small screens to keep it scrollable without crowding.
- **Login page polish**: larger logo (30px), eyebrow chip (`● Private Beta`), tagline line ("Turn the next 1,000 accounts into your next 10 wins. AI-guided discovery from first account to closed deal."), tab switcher rebuilt on design tokens, tighter input padding, radial-gradient background replacing the old solid-to-green linear. Verification email state also upgraded.
- **Button lift**: `.btn-primary/-gold/-green/-navy` get a subtle 1px translateY on hover plus elevated shadow. Feels clickable without being flashy.

### Changed
- Header grew from 52px → 64px to accommodate the larger stepper comfortably. `calc(100vh - 52px)` updated to `-64px` in `.call-layout`.
- Button padding: 8px 16px → 9px 16px (subtle). `.btn-lg` from 11px 22px → 12px 24px.
- Page title: 26px → 28px with tighter letter-spacing. Slightly more confident.
- Focus rings: all focusable inputs now use `--sh-ring` (consistent tan glow) instead of one-off box-shadows.
- Consolidated cream backgrounds: `#F7F6F2` / `#F8F6F1` / `#FAF8F4` / `#F0EDE6` / `#FAFAF8` / `#F5F3EE` → `--bg-0` · `--bg-1` · `--bg-2`.
- Consolidated gold shades: `#8B6F47` / `#7A6040` / `#7A5C30` / `#BA7517` / `#C87533` / `#7A5010` → `--tan-0` · `--tan-1` · `--tan-ink` · `--amber`.

### Technical
- Stepper now uses `React.Fragment` and iterates `[rail, item, rail, item, ...]` instead of nested flex divs. Semantically cleaner.
- Fixed a pre-existing bug in stepper nav gating: had two `if(i===6)` branches (dead second) and step-index off-by-one on in-call/post-call/solution-fit requirements. Indices now match STEPS array order.
- Removed ~180 lines of inline styles from the login page in favor of `.pw-*` classes.

### Not changed (scope-limited)
- Page internals (Brief, ICP, Account Review, In-Call panels). The tokens cascade through the existing CSS classes, so those pages pick up the color consolidation automatically without JSX changes.
- Inline style attributes elsewhere in App.jsx (`style={{...}}`) still use raw hexes in some places. Those will migrate as stages get extracted to modules (S8 next, per roadmap).

---

## [v104-security-hardening] — 2026-04-15

### Security
- **`/api/claude` + `/api/claude-stream` proxies were open pass-throughs.** Pen test confirmed an unauthenticated caller could POST `{"model":"claude-opus-4-5","max_tokens":32000,"tools":[…]}` and the proxy would forward it to Anthropic, billing us at up to ~18× Haiku cost. Fixed by introducing `api/_guard.js` — a shared validator that builds a clean outbound body from scratch (no `…req.body` spread), allow-lists model (`claude-haiku-4-5-20251001` only), tool types (`web_search_20250305` only, `max_uses` capped at 1), caps `max_tokens` at 8000, and strips unknown fields. `temperature:0` hardcoded.
- **Origin allow-list** on both proxies: `cambrian-playbook.vercel.app`, Vercel preview subdomains (`cambrian-playbook-*.vercel.app`), and `localhost`. Absent-Origin requests (server-side tools like our consistency harness) still permitted — real defense is the field allow-list, not Origin.
- **User-scoped ICP cache** (`src/App.jsx`). Previous key was `icp:v2:<url>`; two users on the same browser saw each other's cached ICPs. Now `icp:v2:<userId|guest>:<url>`.
- **Security headers** in `vercel.json`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera/mic/geo/FLoC), `Content-Security-Policy: frame-ancestors 'none'; base-uri 'self'; form-action 'self'`. HSTS was already set by Vercel's default.

### Verified
Post-deploy pen re-test confirmed:
- Opus request → `400 "model not permitted"`
- 32K max_tokens → `200`, silently capped to 8000
- `Origin: https://evil.example.com` → `403 "origin not allowed"`
- `web_search max_uses:5` → `200`, silently capped to 1
- Malformed body → `400` with structured error
- Legitimate Haiku request → `200`, unchanged

---

## [v103-obscure-seller-fix] — 2026-04-15

### Fixed
- **ICP generation failed silently for obscure sellers.** Phase 1 of `buildSellerICP()` previously relied on Haiku's training knowledge. For any seller less famous than Gong/Linear (i.e. most real users), the model returned "Unknown" on every field. Phase 1 now uses `web_search_20250305` (max_uses:1) to pull the seller's actual website, press, and customer logos.
- **Cache no longer traps failures.** If an ICP contains `"Unknown"` / `"Unable to determine"` / `"PICK ONE"` in core fields (marketCategory, companySize, revenueRange, dealSize), it is NOT persisted to localStorage. Next load retries instead of permanently displaying a broken ICP.

### Verified
- Regression test: `scripts/consistency/test-icp.mjs` against `tillo.com` × N=5:
  - `companySize`, `revenueRange`, `salesCycle`, `industries`: **5/5 identical**
  - Before this fix: 4/5 runs returned "Unknown" for every field.

### Tradeoff
- Phase 1 latency: 5s → 22s (one-time per seller due to cache).
- Cost per ICP build: +~$0.01.

---

## [v102-icp-consistency] — 2026-04-15

### Added
- **Anchored enum schema for ICP Phase 2** (`buildSellerICP`). The model must pick `companySize`, `revenueRange`, `dealSize`, `salesCycle`, `adoptionProfile`, `ownershipTypes`, `geographies` from fixed buckets — no free-form ranges. This eliminates the "500-10K one run, 1K-100K the next" drift users were seeing.
- **localStorage cache** keyed by normalized seller URL + schema version (`icp:v2:<url>`). Once built, the same user sees the same ICP on every reload.
- **Explicit ↻ Regenerate button** in the ICP/RFP tab switcher (with confirm dialog) to force a rebuild.
- **`scripts/consistency/test-icp.mjs`** — Node test harness that runs the two-phase ICP generator N times per seller and reports field-by-field drift. Baseline comparison with `scripts/consistency/sellers.json` golden set.
- **`src/stages/S9_SolutionFit.jsx`** — first extracted stage component.

### Changed
- Extracted S9 SolutionFit view from App.jsx to `src/stages/S9_SolutionFit.jsx` as a presentational component. App.jsx shrank from 5,254 → 5,034 lines.
- `COHORT_COLORS` expanded from 5 → 15 distinct colors. Adjacent cohorts no longer collide in pie charts/legends. Synced across App.jsx, `config/constants.js`, and `lib/utils.js`.
- Brief micro-calls `p1-p4` (overview, execs, strategy, solutions) converted from `callAI()` → `streamAI()`. Uses `/api/claude-stream` with 120s timeout vs 60s. Tokens arrive progressively. `p5` (live web_search) stays non-streaming because `web_search_20250305` tool requires the non-streaming endpoint.
- Removed unused `MAX_COHORTS` constant and `.slice(0,5)` from `lib/utils.js buildCohorts()`.

### Measured (via harness, N=5 per seller)
- Before: 17–19 of 20 ICP fields unstable per seller.
- After: 4 core numeric fields 100% stable on well-known sellers (Gong, Tango, Savvi).
- Narrative fields (`topPains`, `priorityInitiative`, `uniqueDifferentiators`) still drift — intentionally not anchored in v102.

### Chore (in same tag)
- Remove `src/App.jsx.bak` (365KB of pre-v99 dead weight).
- Remove stray root `0` file (accidental shell redirect from earlier session).
- Remove redundant `src/.gitignore`.
- Fix duplicate `export async function streamAI` in `src/lib/api.js` (would have thrown SyntaxError if imported).
- Deduplicate and refresh `AGENT_CONTEXT.md`.

---

## [v101-modular-foundation] — 2026-04-15

### Added
- Extracted knowledge layer (reference only, not yet imported by App.jsx):
  - `src/config/constants.js`
  - `src/lib/api.js` (callAI, streamAI, callAIRaw)
  - `src/lib/supabase.js` (sbAuth, sbGetUser, sbSessions)
  - `src/lib/utils.js` (parseACV, labelOrgSize, buildCohorts, calcConfidence, etc.)
  - `src/data/outcomes.js`, `riverFramework.js` (imported), `sampleAccounts.js`
  - `src/data/negotiationFrameworks.js` (Voss, Fisher/Ury, Cialdini, Sun Tzu, Graham, Crucial Conv., JOLT, Challenger)
  - `src/data/rfpSources.js` (global registry, CPV + NAICS mappings, signal rules)
  - `src/data/prompts/{fitScoring,icpGeneration,briefGeneration,negotiationInjections}.js`
- `AGENT_CONTEXT.md` — comprehensive agent onboarding doc.

### Security
- All Claude calls routed through `/api/claude` and `/api/claude-stream` serverless proxies. Proxies force `temperature:0` server-side. `ANTHROPIC_API_KEY` lives only in Vercel server-side env.
- Supabase keys moved to `.env` vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Supabase RLS policy on `sessions`: `auth.uid()::text = user_id`.

### Performance
- ICP phase 2 converted to streaming — content appears in ~1-2s instead of blocking for full response.
- `scoreFit` prompt cut from 1,571 → ~200 tokens.
- ICP prompt cut from 2,010 → ~300 tokens (pre-v102 anchoring).
- Proxy timeouts: 60s for `/api/claude`, 120s for `/api/claude-stream`.
- URL scanner `web_search` reduced to `max_uses:1`.

### Features
- RFP Intel tab on ICP page — open RFPs + closed awards + Private/Government toggle, `isGovernment` flag drives badge color.
- Step 2 renamed "ICP" → "ICP & RFPs".
- Account Review page redesigned to fit a single laptop screen.
- Accounts table "Brief →" button renamed "Review →" and routed to Account Review (not straight to Brief).
- All cohorts now display (removed `.slice(0,5)` limit at display layer).
- Various button-wiring fixes: Build Brief, Review Hypothesis, Start In-Call.

---

## [v100-stable] — 2026-04-09

Last stable tag before the API-proxy migration. Beyond this point all AI calls go through serverless proxies; prior versions called Anthropic directly from the browser (with the exposed-key issue that was remediated in commits `a555339` and `dfbbff1`).

---

## [v99-clean] — 2026-04-06

Early stable checkpoint. Initial structure with direct browser→Anthropic calls (deprecated from v100 onward).

---

## Known limitations (across v103)

- **Monolithic App.jsx** (~5,028 lines). Only S9 stage is extracted. S1, S5, S6, S8 still inline.
- **Duplicate implementations**. `callAI`, `streamAI`, `buildCohorts` exist in both App.jsx (live, canonical) and `src/lib/*` (extracted, unused). Next stage extraction should wire these imports.
- **Extracted prompt modules are reference only**. `src/data/prompts/*.js` do NOT drive runtime behavior; App.jsx has its own inline prompts. Each module now carries a canonical-source pointer to the App.jsx line range — treat those files as maps, not executables.
- **Narrative ICP fields still drift** (`topPains`, `priorityInitiative`, `uniqueDifferentiators`). Anchoring technique from v102 can be applied if users complain.
- **`/api/claude*` endpoints are unauthenticated**. Anyone who finds the URL can POST to them and burn Anthropic credits. Lower-priority than the ICP bugs but worth adding Supabase JWT validation before scaling the user base.
- **RFP Intel uses Haiku training data, not live SAM.gov/TED APIs**. Planned.
- **CSS is a ~400-line string inside App.jsx**. Planned migration to `App.css`.
