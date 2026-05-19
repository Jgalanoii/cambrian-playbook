# Cambrian Catalyst — Fit Scoring Methodology

> **Version 1.0 — May 2026**
> Documents the rationale behind the 3-dimension ICP fit scoring model.
> Reference for investors, technical diligence, and internal calibration.

---

## 1. Why this model exists

Every account a seller pursues has a cost — research time, rep attention, pipeline slots. A fit score answers: "Is this account worth that cost?" The model converts judgment calls into a structured, reproducible assessment so that:

- Reps prioritize accounts likely to close over accounts that feel interesting
- Managers can compare pipeline quality across reps and cohorts
- The system can auto-sort prospect lists by expected fit before a rep touches them

The model is **principled** (every weight has a stated rationale) and **calibrated** (scored against observed fit rates from a ~4,600 seller x ~1,150 target dataset). It is not yet **validated** against win/loss outcomes — that is the next milestone (see §6).

---

## 2. The three dimensions

Total score = dim1 + dim2 + dim3 (0–100 scale).

### Dimension 1: ICP Alignment (40 points max, weight: 40%)

**What it measures:** How well does this target match the seller's stated ICP — industry, company size, and ownership type?

**Why 40%:** ICP alignment is the gating dimension. A company in the wrong industry, at the wrong scale, or with an inaccessible buying structure is a poor fit regardless of customer similarity or competitive openness. Industry match alone explains more fit variance than any other single factor. This dimension gets the largest weight because a miss here cannot be compensated by the other two.

**Scoring logic (3-step lookup):**

| Step | Factor | Values |
|------|--------|--------|
| A | Industry match | 32 (exact match), 26 (adjacent industry, same buyer persona), 20 (no connection), 10 (high-friction industry) |
| B | Size match | +5 (same bracket), +2 (adjacent bracket), +0 (2+ brackets away) |
| C | Ownership | +3 (VC/PE-backed), +1 (private), +0 (public) |

**Why these values:**
- **Industry dominance (32 of 40):** Industry determines buyer language, compliance requirements, buying cycle, and incumbent landscape. A cybersecurity seller talking to a bank vs. a restaurant chain are running fundamentally different sales motions.
- **Size as modifier (+5 max):** A company in the right industry but at the wrong scale (e.g., a startup seller targeting a 200K-employee enterprise) faces procurement barriers that reduce fit. Size is a modifier, not a gating factor — a right-industry company at the wrong size is still better than a wrong-industry company at the right size.
- **Ownership premium (+3 for VC/PE):** PE-backed companies have time-bound mandates (3-5yr hold), creating urgency. VC-backed companies prioritize growth metrics. Both buy faster than public companies with quarterly-earnings procurement caution.

**High-friction industries (score capped at 10):**

| Industry | Avg Fit | Reason |
|----------|---------|--------|
| Heavy Manufacturing / Automotive | 10.2% | Unionized workforce, entrenched ERP, long procurement |
| Aerospace & Defense Prime | 9.8% | ITAR, security clearance, FedRAMP required |
| Telecom Incumbents | 10.5% | Unionized, 5-deep incumbent stack |
| Energy — Oil & Gas | 11.3% | Culture mismatch, union risk, safety-first |
| Energy — Utilities | 13.4% | Unionized, regulatory lock-in, rate-case budgets |
| Mass-Market Retail >100K | 13.6% | Hardened procurement, thin margins |
| Top-5 US Banks | 12.6% | Deep incumbents, RFP-gated, vendor risk assessment |

These averages come from the underlying dataset and represent structural barriers, not judgment calls.

### Dimension 2: Customer Similarity (30 points max, weight: 30%)

**What it measures:** How similar is this target to the seller's existing, proven customers?

**Why 30%:** A seller who has won and retained a customer in the same industry and size bracket has de-risked the sale — they have proof points, reference calls, implementation playbooks, and a product that works for this type of buyer. Customer similarity is the strongest leading indicator of deal velocity after ICP alignment.

**Scoring logic (highest-match lookup):**

| Condition | Value |
|-----------|-------|
| Same industry AND similar size (within one bracket) | 27 |
| Same industry, different size (2+ brackets apart) | 17 |
| Different industry but similar buyer persona/use case | 10 |
| No meaningful similarity to any named customer | 3 |
| No named customers available | 15 (neutral) |

**Why these values:**
- **27 for exact-match:** A target that looks like an existing customer is the closest thing to a guaranteed pipeline candidate. The seller can say "we did exactly this for [Customer X]" — that sentence closes deals.
- **3 for no similarity:** Not zero — every company is a potential customer. But without proof of prior success in this space, the seller is pioneering. That's a higher-risk, higher-effort sale.
- **15 neutral when no customers listed:** Avoids penalizing early-stage sellers who haven't uploaded their customer list.

### Dimension 3: Competitive Landscape (30 points max, weight: 30%)

**What it measures:** How defensible is this opportunity against incumbents?

**Why 30%:** Equal weight to customer similarity because competitive displacement is the #1 deal-killer in enterprise sales. A company already deployed on a multi-year SAP contract is structurally different from a greenfield opportunity. This dimension prevents the model from scoring a target as "Strong Fit" when there's an immovable incumbent.

**Scoring logic (verifiable-knowledge-only):**

| Condition | Value |
|-----------|-------|
| Known incumbent from seller's competitive alternatives list | 26 |
| DEFAULT — uncertain, no known incumbent, or non-listed vendor | 20 |
| Deep platform incumbent with documented enterprise deployment | 10 |

**Why these values:**
- **26 for known competitor:** Counter-intuitively high — when you *know* the competitor, you can run the displacement playbook. It's a winnable battle.
- **20 as default:** Most accounts have unknown competitive landscape. The default is deliberately generous because "unknown" is not "defended." A seller should pursue these accounts, not skip them.
- **10 for deep platform lock-in:** Palantir Foundry, SAP S/4HANA, Oracle Cloud — when a company has bet their architecture on a platform, displacement is a multi-year, multi-million-dollar campaign. Score low, don't waste pipeline.
- **Consistency rule:** Score 26 ONLY when the specific product can be named with certainty. This is the single most important variance-reduction rule. Without it, the model guesses at incumbents and scores fluctuate ±15 points between runs.

---

## 3. Score bands

| Score | Label | Meaning |
|-------|-------|---------|
| 75–100 | Strong Fit | Clear ICP match, buyer accessible, reasonable cycle. Pursue actively. |
| 55–74 | Potential Fit | Partial match — needs a specific angle, trigger event, or champion. Worth pursuing with a hypothesis. |
| 0–54 | Poor Fit | Structural barrier — wrong size, wrong industry, or immovable incumbent. Don't spend pipeline capacity here unless a compelling trigger overrides. |

**Why 75 for Strong Fit (not 65 or 80):**
The model maxes at 100 with perfect scores across all three dimensions (40 + 30 + 30). In practice, a company that matches the ICP industry (32), is the right size (+5), is PE-backed (+3), has a look-alike customer (27), and has a known displaceable competitor (26) scores 93 — a clear Strong Fit. But most real opportunities have one dimension that's imperfect. The 75 threshold ensures that a company needs to be strong across at least two dimensions, with the third at least adequate.

**Why not a simpler threshold:**
Setting Strong Fit at 65 would let through too many accounts where one dimension carries the score (e.g., 40 + 3 + 26 = 69 — right industry but no customer proof). Setting it at 80 would exclude accounts with one slightly weak dimension. 75 is the empirical sweet spot from the calibration dataset.

---

## 4. Stage modifiers

Seller stage systematically affects fit because procurement complexity scales with the buyer's risk tolerance for unproven vendors.

| Seller Stage | Avg Fit | Note |
|-------------|---------|------|
| Seed | 23.7% | Zero viable direct enterprise paths |
| Series A | 33.6% | Niche targeting only |
| Series B | 41.8% | Departmental landing only |
| Series C | 49.0% | First real enterprise traction |
| Series D+ | 55.6% | Full enterprise motion viable |

**Applied as:** A seed-stage seller targeting a 200K+ employee enterprise gets a -15 penalty to dim1 regardless of industry match. The procurement barrier is structural, not industry-specific.

---

## 5. Buying signal modifiers

| Signal | Effect | Rationale |
|--------|--------|-----------|
| Recent funding (<12 mo) | +8 pts | Creates 18-month buying window; budget earmarked for growth |
| PE acquisition (<18 mo) | +8 pts | Cost mandate + 60-90 day budget cycle; operating partner influence |
| Private vs public peer | +5-8 pts | Faster procurement, fewer committees, less quarterly-earnings caution |
| New CxO hire (<6 mo) | +5 pts | First-90-day mandate; open to new vendors |
| >200K employees + seed seller | -15 pts | Procurement fortress; caps dim1 |
| >50% union/hourly workforce | caps at ~25 | Change resistance barrier |
| Heavily regulated + no compliance kit | hard DQ | Regulatory fit blocks deal |

---

## 6. What this model does NOT yet do (validation roadmap)

The model is **internally principled** — every weight has a stated rationale grounded in the calibration dataset. It is not yet **externally validated** — we have not yet demonstrated that high-fit accounts progress at a higher rate than low-fit accounts in real pipelines.

**Validation plan:**
1. **Instrumentation (live now):** Every scored account records its fit score, dimensions, and label at time of scoring.
2. **Outcome capture (in progress):** Beta users track which scored accounts advance to meeting, proposal, and close.
3. **Correlation analysis (target: Q4 2026):** Report directional correlation between fit score and deal progression. Even "high-fit accounts progress at 2x the rate of potential-fit" is a meaningful validation signal.
4. **ICP backtest (built):** Validate that a generated ICP correctly rates the seller's existing customers as high-fit. This tests the ICP, not the scoring model, but it validates the input to the model.

**The defensibility upgrade:** A scoring model that is *internally principled* is good. A scoring model that is *externally validated* — that demonstrably correlates with real win/loss outcomes — is a different tier of defensible. The instrumentation exists; the proof accumulates with usage.

---

## 7. Four Forces framework (implicit)

The scoring model implicitly applies Moesta's Four Forces of Progress:

- **Push** (current pain) + **Pull** (desired outcome) — mapped to positive buying signals
- **Anxiety** (fear of new solution) + **Habit** (comfort with status quo) — mapped to high-friction industry penalties and incumbent lock-in scores

A high-friction industry has structurally high Anxiety + Habit. A PE acquisition event increases Push. A named competitor in the alternatives list reduces Anxiety (the seller has battle cards). The Four Forces are not calculated separately — they are embedded in the fixed-value lookup tables.
