# Cambrian Catalyst — Competitive Moat & Defensibility

**Version:** June 2026

---

## The Moat Is Multi-Layered

Cambrian Catalyst is not a thin wrapper around an LLM. The defensibility comes from the combination of five layers that compound over time.

---

## Layer 1: Knowledge Layers (45 files, 1.5MB of proprietary intelligence)

**What it is:** 45 hand-built knowledge files covering 37 industries with deep sales intelligence — discovery questions, scoring contexts, competitive landscapes, procurement protocols, objection handling, vertical-specific playbooks.

**Why it matters:** A generic AI tool asks generic questions. Cambrian knows that selling to a PE-backed healthcare company requires different discovery than selling to a government agency. It knows the NAICS codes, the procurement cycles, the compliance requirements, the incumbent vendors, the switching costs.

**Examples:**
- Banking KL knows OCC examination cycles and SR 11-7 model risk management
- Government KL knows FAR/DFARS compliance, FedRAMP authorization, protest risk
- Insurance KL knows state filing requirements, actuarial model re-certification timelines
- Cannabis KL knows 280E tax implications and state-by-state regulatory variance

**Defensibility:** These took months to build. A competitor starting from scratch would need deep sales domain expertise across every vertical. The KLs are trade secrets — not in prompts visible to users, loaded server-side.

---

## Layer 2: Evidence-Based Scoring (not vibes)

**What it is:** A 3-dimension fixed-point scoring system that evaluates every prospect on:
- **Dim 1 — Product/Service Fit (45 pts):** Does the seller's product solve a real problem for this prospect?
- **Dim 2 — Customer Lookalike (30 pts):** Does this prospect look like companies the seller has already won?
- **Dim 3 — Competitive Displacement (25 pts):** Is there evidence the prospect buys from a known competitor?

**Why it matters:** Most sales tools score on industry labels ("they're in fintech, you sell to fintech"). Cambrian scores on whether YOUR specific products solve THEIR specific problems, verified by case study evidence and competitor customer mapping.

**Key mechanics:**
- Fixed-point scoring with `snap()` — prevents interpolation variance between runs
- Known customer override — seller's existing customers always score dim2=30
- Competitor detection — client-side fuzzy match flags competitors at 5%
- Evidence hierarchy: case study > press release > partner page > logo wall > training knowledge

**Defensibility:** The scoring logic is calibrated across months of testing with real sellers. The golden set (25+ sentinel companies) validates accuracy. The 3-dimension framework is our IP.

---

## Layer 3: Seller Intelligence Depth

**What it is:** The ICP build doesn't just read a landing page. It uses Opus (the most capable model) with web search to:
- Find every product/service page on the seller's website
- Identify case studies with named customers and outcomes
- Map competitor customer lists as displacement targets
- Build a product catalog with evidence URLs

**Why it matters:** A seller's website is a marketing tool — it may not reflect what they actually sell or who they've won. Cambrian goes deeper: case studies are reality, logo walls are claims, landing page copy is aspiration. We rank evidence by quality and use it in every downstream prompt.

**The evidence hierarchy:**
| Tier | Source | Confidence |
|------|--------|-----------|
| 1 (Verified) | Case study with named outcomes | Highest |
| 2 (Confirmed) | Press release / partnership announcement | High |
| 3 (Observed) | Partner page / "powered by" on buyer site | Medium |
| 4 (Indicated) | Logo wall / "trusted by" section | Low-Medium |
| 5 (Inferred) | Training knowledge / industry assumption | Lowest |

**Defensibility:** The 2-pass ICP architecture (Opus research → Sonnet format) is unique. Competitors using a single LLM call get surface-level copy, not verified intelligence.

---

## Layer 4: Full-Context Pipeline (not isolated calls)

**What it is:** Every prompt in the pipeline receives the full seller context — product catalog, verified customers, proof points, exclusions, competitive alternatives. This means:
- The elevator pitch references actual case studies, not generic claims
- Solution mapping only suggests use cases the seller's products actually support
- Outreach emails reference specific, different findings from the research (zero repetition rule)
- Discovery questions are grounded in real research findings

**Why it matters:** Most AI sales tools generate each output independently. Cambrian's outputs are interconnected — the brief informs the hypothesis, which informs the discovery questions, which inform the post-call routing. Change one input (add a proof point, upload a doc) and every downstream output improves.

**Defensibility:** The `buildSellerCtx()` function, the `firmographicsTruth` block, the evidence hierarchy injection, and the dedup rules across prompts represent months of prompt engineering. This isn't "call Claude with a prompt" — it's an orchestration layer.

---

## Layer 5: Displacement Playbook

**What it is:** A dedicated knowledge layer for unseating incumbents:
- When to displace vs. when to land adjacent
- Tactical playbooks by scenario (contract renewal, incumbent failure, new leadership, pilot-land-expand)
- Switching cost analysis by vertical (banking: 12-18 months, healthcare: 18-24 months, tech: 1-3 months)
- Champion identification framework
- Proof point framing rules ("never say 'switched from,' say 'chose us because'")

**Why it matters:** Most sales intelligence tools tell you about a company. Cambrian tells you how to WIN the company — including how to take it from the incumbent.

**Defensibility:** This is operational sales methodology encoded as software. It's the difference between a research report and a battle plan.

---

## What We Are NOT

- We are NOT a CRM (HubSpot integration pushes data out)
- We are NOT a dialer or sequencer (we arm you BEFORE the call)
- We are NOT a generic chatbot (every output is seller + buyer + context specific)
- We are NOT dependent on user data to work (works from day 1 with just a URL)

## What Competitors Would Need to Replicate

1. 45 knowledge layers across 37 industries (~6 months of expert curation)
2. 3-dimension scoring with fixed-point calibration + golden set validation
3. 2-pass ICP build with evidence hierarchy
4. 10-call parallel brief pipeline with cross-section dedup
5. Displacement playbook with vertical-specific switching cost analysis
6. RIVER hypothesis framework with Challenger + JOLT integration
7. Real-time coaching (Milton) with full session context
8. RFP procurement intelligence across SAM.gov, state portals, and commercial
