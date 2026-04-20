# Feature Inventory — Cambrian Catalyst RIVER Playbook

**Version:** v108-security-perf
**Last updated:** 2026-04-20
**Status:** Feature-complete. No regressions detected.

---

## Platform Summary

| Metric | Value |
|--------|-------|
| Stages | 10 (Steps 0-9) |
| Brief data fields | 25+ |
| Hypothesis fields | 5 RIVER + JOLT (4) + Talk Tracks (5) + Challenger Insight |
| Frameworks integrated | 13 (Voss, Fisher/Ury, Cialdini, Sun Tzu, JOLT, Challenger, Graham, Crucial Conversations, Mom Test, Ellis 40%, Dunford, Osterwalder, DMAIC) |
| AI calls per full deal cycle | ~14 (brief 5 + hypothesis 1 + discovery 1 + post-call 1 + solution fit 1 + relationship signals 1 + fit scoring 1 + pre-cache 3) |
| Variable cost per deal | ~$0.11 |
| Gross margin at $99/seat | 97% |

---

## Stage-by-Stage Features

### Step 0: Session Setup
- Seller URL input with auto-scan for product/solution pages
- Manual "Scan Products, Solutions & Services" button (mobile fallback)
- Personal LinkedIn profile input (drives relationship signals on Brief)
- Funding stage selector (7 options with contextual tips)
- Internal sales materials upload (PDF/DOCX/TXT/MD, up to 6 files)
- Proof points entry (Case Study, ROI Metric, Customer Win, Award, Partnership, Certification)
- Product & Solution URL scanner (auto-detect + manual, up to 5)
- Products & Solutions Catalog (name + description entries)
- Background ICP build on URL blur

### Step 1: ICP & RFPs
- **ICP Tab**: Full Ideal Customer Profile display
  - Industries, Buyer Personas, Company Size, Revenue Range, Deal Size, Sales Cycle
  - Adoption Profile, Ownership Types, Geographies
  - Priority Initiative, Success Factors, Perceived Barriers, Decision Criteria
  - Unique Differentiators, Competitive Alternatives, Customer Examples
  - Disqualifiers, Tech Signals, Traction Channels
- **RFP Intel Tab**: Live procurement intelligence via web_search
  - Open RFPs: title, buyer, source, value, deadline, cohort, relevance score
  - Closed Awards: title, buyer, awarded vendor, value, date, cohort
  - Filter toggle: All / Private / Government with live counts
  - NAICS/CPV code-enhanced search queries
  - localStorage cache with version gating
- Regenerate ICP, PDF export, JSON data download

### Step 2: Import Accounts
- CSV file upload (drag/drop or browse)
- Load Sample Data (100 accounts across 19 industries)
- **Build My Target Accounts**: AI-generated 20 ICP-matched companies
  - Industry selector (up to 3, chip picker + free-text)
  - Headcount dropdown (8 bands, defaults to ICP)
  - Revenue dropdown (8 bands, defaults to ICP)
  - Web_search verified real companies only

### Step 3: Accounts & Fit Scoring
- Cohort table with sortable columns
- 3-dimension fit scoring (parallel batched):
  - Dimension 1: ICP Alignment (40%) — research-backed industry averages
  - Dimension 2: Customer Similarity (30%) — named customer analogue matching
  - Dimension 3: Competitive Landscape (30%) — incumbent vendor identification
- Fit labels: Strong Fit (75-100), Potential Fit (55-74), Poor Fit (0-54)
- Two pie charts: Accounts by Vertical, Accounts by Cohort
- Multi-account queue selection (up to 5)
- Top-3 account pre-caching after fit scores complete
- PDF export, JSON data download

### Step 4: Account Review
- Account selector strip with fit score badges
- Account hero with company logo (Clearbit), fit rationale, ICP match grid
- Deal context: value dropdown (8 options), revenue classification (6 options)
- Target outcomes multi-select (up to 3 from 13 universal imperatives)
- Triggers pre-cache of executives + overview + live search on account select
- "Build Brief" CTA

### Step 5: RIVER Brief (25+ fields, progressive streaming)
- **Company Overview** (collapsible): snapshot, revenue, public/private, employee count, HQ, founded, website, LinkedIn, funding profile, competitors, watch-outs
- **Key Executives**: name, title, background, mandate/perspective (2-3 sentences per exec)
- **Recent Headlines**: headline + growth signal badge + relevance
- **Open Roles**: summary + 3+ roles with department and hiring signal
- **Solution Mapping**: product, imperative served, buyer role, job-to-be-done, pain, gain, challenger insight, JOLT risk remover, fit text
- **Key Contacts**: name, title, angle for approach
- **Strategic Theme**: current direction and priorities
- **Opening Angle**: Challenger-style assumption reframe
- **Public Sentiment**: online sentiment, standout review (text + source + sentiment), sales angle
- **Relationship Signals** (post-brief, LinkedIn-powered): shared employers, universities, mutual connections
- **Watch-Outs**: procurement risk, incumbent risk, stage credibility
- All fields editable (click-to-edit)
- Section collapse on heavy sections
- Skeleton loading with progressive section merge
- PDF export, JSON data download, regenerate

### Step 6: RIVER Hypothesis (streamed progressively)
- Solutions You're Selling card (from brief solution mapping)
- 5 RIVER fields (Reality, Impact, Vision, Entry Points, Route) — all editable
- Opening Angle (editable)
- Challenger Insight (dark card)
- JOLT Plan: Judge Indecision, Offer Recommendation, Limit Exploration, Take Risk Off
- 5 Talk Tracks: Opening, Discovery (Mom Test), Impact (Ellis Test), Vision, Route (JOLT)
- All grounded in proof pack — named customers, differentiators cited
- PDF export, JSON data download, regenerate

### Step 7: In-Call Navigator
- Live confidence meter (0-100%, calculated from gate answers + discovery data)
- 5 RIVER stage pills with completion indicators
- Per-stage gate questions with horizontal option buttons + notes
- Static RIVER discovery prompts
- AI-generated discovery questions:
  - Sales track (2 per stage): Mom Test, Voss, Cialdini, Fisher/Ury, Sun Tzu
  - Architecture track (2 per stage): Rajput, McSweeney, Richards/Ford, Fowler, DMAIC
- Talk tracks per stage (dark card)
- Objection handling accordion (2 per stage with suggested responses)
- Right sidebar: call notes (Tab = timestamp), opening angle, solutions, watch-outs, DMAIC stage
- In-call focus mode (auto-enabled): minimal chrome, larger type, calmer palette
- Lazy rep detection: <20% fields filled triggers Milton nudge
- PDF export, JSON data download, "End Call" routes to post-call

### Step 8: Post-Call Route (streamed progressively)
- Transcript upload (paste or file: .txt, .vtt, .srt, .csv, .md)
- Transcript analysis with RIVER framework + proof pack + Fisher/Ury + Graham
- Summary stats: deal confidence %, deal route, deal size
- Color-coded route card (Fast Track / Nurture / Disqualify) with rationale
- RIVER Scorecard (5-stage synthesis of what was learned)
- Next Steps (numbered, actionable)
- CRM Note (copy button)
- Call Summary (copy button)
- Follow-Up Email with subject line (copy button)
- Customer-Ready Call Summary download
- Sparse discovery warning injected into synthesis when <30% captured
- PDF export, JSON data download, regenerate

### Step 9: Solution Architecture Review (streamed progressively)
- PMF Assessment: Target Customer Fit, Underserved Need, Value Prop Fit, Overall PMF Signal
- Adoption Profile (Moore curve) with implication
- DMAIC Stage with entry strategy recommendation
- Integration Complexity badge (Low/Medium/High)
- Confirmed Solution Fit: per product with fit score, implementation phase, business alignment, architecture notes, risks
- Revised After Discovery: products upgraded/downgraded/removed with reasons
- Architecture Gaps: unaddressed needs + bridging recommendations
- Implementation Roadmap: phased approach tied to outcomes
- Success Metrics: 3 measurable outcomes tied to stated goals
- Senior SA Recommendation: single most important proposal element
- Graham Margin of Safety applied (value must be 3-5x price)
- PDF export, JSON data download, regenerate

---

## Cross-Stage Features

| Feature | Description | Available |
|---------|-------------|-----------|
| **Milton** (chat assistant) | Senior sales coach with full knowledge layer, dry humor, anti-fabrication rules. Never reveals methodology. | All stages |
| **Cmd-K palette** | Fuzzy search across stages, actions, accounts. Keyboard nav. | All stages |
| **Dark mode** | Warm-dark palette toggle. Covers all surfaces. | All stages |
| **Focus mode** | Auto on step 7. Minimal chrome, larger type. | Step 7 |
| **Keyboard shortcuts** | Cmd-K/S/P, arrows, 1-9 jump | All stages |
| **PDF export** | Print current view | Steps 1-9 |
| **JSON data download** | Stage-specific structured data | Steps 1-9 |
| **Company logos** | Clearbit with initials fallback | Steps 4-6 |
| **Session save/load** | Supabase-backed, per-user | All stages |

---

## Security Features

| Feature | Detail |
|---------|--------|
| JWT auth on proxy | All Claude API calls require Supabase JWT |
| Rate limiting | 60 req/min per IP, sliding window |
| Model allow-list | Haiku + Sonnet fallback only |
| Tool allow-list | web_search only |
| Input size caps | 120KB messages, 12KB system prompt |
| max_tokens cap | 8000 |
| Origin allow-list | cambrian-playbook.vercel.app + localhost |
| Knowledge layer protection | Sensitive data served from /api/knowledge.js behind auth, not in client bundle |
| Anti-fabrication | Every prompt has explicit rules against inventing facts |
| Supabase RLS | Row-level security on sessions table (verified) |
| No npm vulnerabilities | Clerk removed (was critical CVE) |

---

## Intentionally Disabled Features

| Feature | Location | Reason |
|---------|----------|--------|
| ICP preview on Step 0 | App.jsx, `{false&&...}` | Moved to Step 1 ICP tab for better flow |
| Glassdoor rating field on Brief | App.jsx, `{...&&false&&...}` | Data quality issues; sentiment data still surfaces via publicSentiment |

---

## Discussed but Not Yet Built

| Feature | Status |
|---------|--------|
| UX Phase 4 (expandable table rows, sidebar, tooltips) | Designed in docs/ux-plan.md |
| Export update for new brief fields (publicSentiment, joltPlan, challengerInsight) | Not started |
| CSS extraction for faster first paint | Not started |
| Full HMAC JWT verification (SUPABASE_JWT_SECRET) | Decode-only in place |
| Stage extraction (S8, S6, S1, S5 from App.jsx monolith) | S9 extracted; others pending |
| Wire lib/api.js + lib/utils.js imports | lib/supabase.js done; others stale |

---

## Knowledge Layer (13 Frameworks)

All frameworks injected into prompts via /api/knowledge.js — never exposed in client bundle.

| Framework | Used In | Purpose |
|-----------|---------|---------|
| Voss (Never Split the Difference) | Hypothesis, Discovery, In-Call | Calibrated How/What questions, tactical empathy, mirroring, labeling |
| Fisher/Ury (Getting to Yes) | Hypothesis, Post-Call, Transcript, SA Review | Interests not positions, BATNA, objective criteria |
| Cialdini (Influence) | Brief p3, Hypothesis | Social proof, authority, scarcity — real deadlines only |
| Sun Tzu (Art of War) | Fit Scoring, Hypothesis | Know competitive terrain, find underserved stakeholder |
| JOLT Effect (Dixon/McKenna) | Hypothesis, Route stage | Judge indecision, one recommendation, limit scope, remove risk |
| Challenger Customer (CEB/Gartner) | Brief p3, Hypothesis | Mobilizer identification, teaching angle |
| Graham (Intelligent Investor) | Post-Call, SA Review, Transcript | Margin of Safety — 3-5x value required |
| Crucial Conversations | Discovery, In-Call | Safety signals, STATE method |
| Mom Test (Fitzpatrick) | Discovery, Talk Tracks | Past behavior questions, never hypothetical |
| Ellis 40% Rule | Discovery, Fit Scoring | Must-have test — disqualifying signal |
| Dunford (Obviously Awesome) | Brief p4, Solution Mapping | Positioning, competitive alternatives |
| Osterwalder VPC | Brief p4, Solution Mapping | Job-to-be-done, pain, gain mapping |
| DMAIC | SA Review, In-Call, Hypothesis | Define/Measure/Analyze/Improve/Control maturity |

---

## P&L Model Summary

> Run `node scripts/pl.mjs` for live scenarios. See `docs/cost-model.md` for full assumptions.

### Variable Cost Per Persona

| Persona | Deals/mo | Cost/mo |
|---------|----------|---------|
| Light | 5 | $0.57 |
| Medium | 20 | $2.47 |
| Heavy | 50 | $6.84 |
| Power | 100+ | $16.45 |

### Pricing Tiers

| Plan | Price/seat/mo | COGS | Gross Margin |
|------|--------------|------|-------------|
| Free trial | $0 | $0.62 | n/a (acquisition) |
| Starter | $39 | $0.62 | **98%** |
| Pro | $99 | $2.51 | **97%** |
| Team (3-seat min) | $79 | $6.88 | **91%** |
| Enterprise | $299 | $16.50 | **94%** |

### Annual P&L at 1,000 Users

| Metric | Value |
|--------|-------|
| Annual revenue | $984K |
| Annual variable COGS | $37K |
| Annual fixed COGS | $0.55K |
| **Annual gross profit** | **$947K** |
| **Gross margin** | **96%** |

### Annual P&L at 100 Users

| Metric | Value |
|--------|-------|
| Annual revenue | $98K |
| Annual variable COGS | $4K |
| Annual fixed COGS | $0.55K |
| **Annual gross profit** | **$94K** |
| **Gross margin** | **96%** |

**Conclusion:** Pricing decisions should be driven by perceived value and market positioning, not by cost defense. Margins hold above 85% even under worst-case scenarios (3x Sonnet fallback + 50% Haiku price increase).
