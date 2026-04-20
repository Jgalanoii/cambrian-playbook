---
title: "ICP Knowledge Base — Index"
owner: "Cambrian Catalyst LLC"
purpose: "Navigation and ingestion guide for the ICP knowledge base files."
last_updated: "2026-04-20"
---

# ICP Knowledge Base — Index

A structured knowledge layer for Ideal Customer Profile, positioning, and go-to-market work. Designed for ingestion by Claude Code, other LLM retrieval systems, or direct human reference during client engagements.

## Files in this knowledge base

**Core reference:**
- **`icp-fit-knowledge-base.md`** — Canonical reference. Core concepts, deep dives on foundational thinkers (Murphy, Dunford, Moesta, Fitzpatrick, Laja, Winning by Design, Conant, Moore, Balfour), applied artifacts (ICP scorecard, interview question bank, 1-page template, disqualification framework), glossary. **Start here for any general ICP question.**

**Vertical playbooks** (each follows the same section structure):
- **`icp-saas.md`** — Horizontal B2B SaaS. Motion-ICP fit, standard buying committee dynamics, pricing pattern evolution (per-seat under pressure, usage-based ascendant), failure modes.
- **`icp-fintech.md`** — FinTech subcategory-by-subcategory (BaaS, neobanks, lending, wealth, insurtech, regtech, CFO tools, crypto). Heavy emphasis on buying committee (risk/compliance/legal/bank-partners) and regulatory posture as ICP filter.
- **`icp-payments.md`** — Payments value chain (merchants, ISVs, PayFacs, ISOs, processors, issuers, banks). Distinct buyer archetypes per value-chain position; network-gated sales; unit-economics-heavy messaging.
- **`icp-ai.md`** — AI/ML companies, split by foundation labs / infrastructure / applied / services / traditional ML. Fear+FOMO dynamics, governance-posture filter, model-provider risk.
- **`icp-martech.md`** — Marketing technology and marketing-team buyers. Marketing-as-six-buyers framing, RevOps as decision-maker, privacy/platform-change dynamics.
- **`icp-manufacturing.md`** — Discrete vs. process vs. hybrid; OEM/Tier-1/Tier-2/CM subdivisions. Long cycles, plant-vs-corporate dynamics, services-heavy implementation.
- **`icp-incentives-promo.md`** — Digital incentives, rewards, gift cards, promo/merchandise. Multi-buyer reality (HR/marketing/research/sales/CS), financial-product regulatory overlay, competitive landscape mapping.
- **`icp-cybersecurity.md`** — Fear-based buying dynamics, CISO committee reality, analyst-validation requirements, platform consolidation wave, insurance-driven purchasing.
- **`icp-healthtech.md`** — Provider/payer/pharma/life sciences subdivisions. EHR integration requirements, regulatory gravity (HIPAA/FDA/CMS), reimbursement pathway as ICP filter.
- **`icp-professional-services.md`** — Consulting, agencies, fractional execs, advisory firms. Referral-economy dynamics, productization economics, positioning specificity. **Meta-relevant: the vertical Cambrian Catalyst itself lives in.**

## How to use this knowledge base

**For general ICP questions or framework references:**
Query the core file (`icp-fit-knowledge-base.md`). Each H2/H3 section is self-describing; retrieval by heading should return usable context.

**For vertical-specific client work:**
Start with the relevant vertical playbook, then cross-reference the core file for framework specifics (e.g., Murphy's RWAS criteria, Dunford's 5-component positioning, Moesta's Four Forces, the interview bank).

**For engagements spanning multiple verticals:**
Pull multiple playbooks. Where verticals share dynamics (e.g., fintech and healthtech both have regulated-vertical parallels; payments and incentives both have financial-product regulatory overlays), read the shared sections in both.

**For Cambrian Catalyst's own positioning work:**
Section 11 of `icp-professional-services.md` applies the framework directly to the firm's own ICP. Use this when positioning the practice, qualifying prospects, or productizing offerings.

## File structure convention

Each vertical playbook follows this structure for parallel retrieval:

1. What makes this vertical distinct
2. Sub-categorization (the sub-markets the vertical actually contains)
3. ICP patterns (firmographic + technographic + operational layers)
4. The buying committee (personas, blockers, veto points)
5. Trigger events (what creates in-market urgency)
6. Positioning — unique-attribute categories (where differentiation lives)
7. Pricing & model patterns
8. Compliance / regulatory overlay (where applicable)
9. Archetypal ICP slices (3–5 concrete example ICPs per vertical)
10. Common failure modes
11. Resources (analysts, publications, events, communities)

## Metadata schema

Each file includes YAML frontmatter with:
- `title` — human-readable title
- `parent` — pointer to the core knowledge base for vertical files
- `industry` — single-token vertical identifier
- `tags` — retrieval tags
- `last_updated` — ISO date

## Maintenance

- **Review cadence**: Quarterly review of vertical playbooks against actual client experience.
- **Versioning**: Update `last_updated` and maintain a changelog section per file as content evolves.
- **Contribution**: When a client engagement surfaces new patterns (new trigger event, new failure mode, new archetype), update the relevant file. The knowledge base compounds with use.

## Cross-references between files

Some verticals share dynamics; when working in one, check the others:

- **FinTech ↔ Payments** — overlapping regulatory, buying-committee, and sponsor-bank dynamics.
- **FinTech ↔ HealthTech** — both heavily regulated; compliance-as-ICP-filter patterns transfer.
- **FinTech ↔ Cybersecurity** — both have fear-based buying, CISO involvement, and insurance-driven purchasing.
- **SaaS ↔ MarTech ↔ AI** — overlapping buyer committees, pricing pressures, and PLG dynamics.
- **Manufacturing ↔ HealthTech** — both have long cycles, services-heavy implementation, and regulated-vertical dynamics.
- **Incentives/Promo ↔ MarTech** — overlapping marketing buyers and use cases.
- **Professional Services ↔ all others** — the consulting playbook applies when the seller *is* a service firm; the vertical playbooks apply when the service firm is selling *into* that vertical.

## Related resources outside this knowledge base

See Part 5 of `icp-fit-knowledge-base.md` for the canonical reading/listening/watching list. Each vertical playbook has its own Section 11 Resources tailored to that space.

---

*Maintained by Cambrian Catalyst LLC. Sources: distilled from the practitioners and writers cited in each file, plus operational experience.*
