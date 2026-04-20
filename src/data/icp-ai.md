---
title: "ICP — AI / ML Playbook"
parent: "ICP & Customer Fit Knowledge Base"
industry: ai
tags: [icp, ai, ml, llm, genai, foundation-models, mlops, applied-ai]
last_updated: 2026-04-20
---

# ICP — AI / ML Playbook

> Vertical playbook for AI companies. The GenAI wave has blurred many categories; this doc tries to restore useful distinctions for ICP work.

## 1. First question: what kind of AI company are you?

"AI company" means five very different businesses right now. ICP work starts by naming which you are:

- **Foundation model labs** — train and license models (OpenAI, Anthropic, Google DeepMind, Meta, Mistral, Cohere, xAI). Sell to developers, platforms, and enterprises.
- **AI infrastructure / MLOps / platform** — vector DBs, orchestration, observability, eval, fine-tuning, inference — sell to AI builders and ML teams.
- **Applied AI / AI-native SaaS** — product built on AI that solves a specific vertical or functional problem (copywriting, coding, legal, sales, support, creative). Sell to the function or vertical buyer.
- **AI services / consulting** — implement AI for enterprises. Sell outcomes and capability.
- **Traditional ML / "data science" vendors** — pre-GenAI ML for forecasting, anomaly detection, recommendation. Different buyer, different cycle.

Each has a different ICP, buying committee, sales cycle, and failure mode. The rest of this doc is primarily about **Applied AI and AI Infrastructure**, which is where most GTM consulting engagements land.

## 2. What makes AI ICP work different

Four unusual dynamics:

**Fear + FOMO co-exist.** Buyers simultaneously fear falling behind ("every competitor is doing AI") and fear getting it wrong (data leakage, hallucinations, reputational risk). The ICP must account for which fear dominates at this buyer right now — it dictates messaging entirely.

**Champion-led, procurement-blocked.** Many AI deals start with an enthusiastic champion doing a POC on a credit card or PLG account, then hit a wall when legal, security, or data governance gets involved. ICP must include "organization has a functioning AI governance posture" as a filter — not just "they like AI."

**Evaluation is underdeveloped.** Most buyers don't know how to evaluate AI products. "Does it work?" is a harder question for probabilistic systems than deterministic ones. This creates long cycles, bake-offs, and subjective decisions. ICPs that filter for buyers with mature eval capabilities convert faster.

**The field moves faster than the buyer.** Model capabilities change quarterly. A product that was a wedge six months ago may be commoditized by a frontier-model release. ICP work must account for defensibility: are you selling a capability that won't be subsumed by the next model release?

## 3. ICP patterns

Useful slicing dimensions:

- **AI maturity of the buyer**: AI-native (builds with LLMs daily) vs. AI-curious (experimenting) vs. AI-averse (regulated, risk-dominant).
- **Data posture**: do they have the data? Is it accessible? Is it clean? Do they own it or is it locked in vendors? "Data-ready" is a hard filter.
- **Governance posture**: is there an AI governance committee, a named AI leader, a use-case review process? Absence = deal will stall at procurement.
- **Internal build/buy bias**: large enterprises with strong engineering often build. Mid-market and verticalized buyers buy. Know which side your buyer leans.
- **Model provider posture**: are they multi-model, single-model, open-source-first, or enterprise-model-committed (Azure OpenAI, AWS Bedrock)? Dictates integration and partnership path.
- **Pilot/POC appetite**: willing to run a structured pilot with success criteria? If not, you don't have an in-market account.

## 4. The buying committee

Standard AI buying committee has expanded beyond typical SaaS:

- **Champion** — usually Head of [function], Director of Innovation, or CPO/CTO in mid-market.
- **Economic buyer** — CIO, CTO, CFO, or VP/SVP of the function. Varies by deal size.
- **AI / data leader** — Chief Data Officer, Chief AI Officer, Head of Data Science, or ML lead. Gatekeeper for technical credibility.
- **Information security** — data leakage, model exfiltration, inference endpoint security.
- **Legal / privacy** — data processing agreements, IP ownership of outputs, training data clauses, indemnification, EU AI Act posture, state AI laws (Colorado, California).
- **Risk / compliance** — especially in regulated verticals. Model risk management (SR 11-7 for banks; similar for healthcare, insurance).
- **Procurement** — new vendor governance, often with AI-specific review processes emerging.
- **End users** — often the make-or-break. AI tools fail via under-adoption more than any other software category.

**AI-specific blocker:** many organizations now have an **AI Council** or **AI Ethics Board** that reviews new AI vendors before purchase. If it exists, it's a gate. Get on its agenda early.

## 5. Trigger events

Compelling events that create urgency:

- **Competitor AI launch** — especially public competitor announcement; board asks "what's our response?"
- **New executive hire** (Chief AI Officer, CDO, Head of AI, CTO in first 6 months).
- **Layoffs / efficiency mandate** — "do more with less" opens AI budget even when the rest of the budget is frozen.
- **Board AI mandate** — formal directive to "have an AI strategy" with named deadline.
- **Regulatory trigger** — EU AI Act compliance, state AI laws (Colorado Act, NY Local Law 144, California SB 1047 and successors), sector-specific rules (healthcare, finance).
- **Incident / reputational event** — customer-facing AI failure (internal or competitor's) triggers governance buying.
- **Failed POC from another vendor** — a vendor flamed out, buyer still has budget and urgency.
- **Data readiness milestone** — warehouse migration complete, semantic layer launched, MDM project done → "we can finally use our data."
- **Model release** — frontier model capability jump creates new use-case viability.

## 6. Positioning — unique-attribute categories

Durable AI differentiation lives in:

- **Data moat** — access to proprietary or difficult-to-obtain data (domain-specific corpora, real-time feeds, customer-contributed data).
- **Workflow / system-of-record integration** — embedded in the tool the user already lives in, not a new surface to check.
- **Evaluation rigor** — measurable accuracy, latency, cost; published eval results; customer-run eval support.
- **Fine-tune / custom model capability** — ability to adapt to customer data vs. generic prompts.
- **Privacy / deployment model** — single-tenant, customer VPC, on-prem, customer-owned model weights.
- **Model-agnostic architecture** — can swap providers; not locked to one foundation model.
- **Accuracy / hallucination handling** — citations, grounding, RAG with provenance, human-in-the-loop defaults.
- **Vertical / domain specificity** — legal-native, healthcare-native, finance-native rather than horizontal chat.
- **Deployment speed** — time from contract to live use.

Horizontal "AI for everything" positioning is losing to vertical-specific positioning across most categories. Vertical-specific positioning converts.

## 7. Pricing & model patterns

Current state of AI pricing:

- **Usage-based (per token, per call, per query)** — common for infrastructure and developer APIs.
- **Per seat** — standard for AI copilot/productivity SaaS. Increasingly under pressure because AI *reduces* seat counts.
- **Per outcome / per unit of work** — per lead generated, per document processed, per ticket resolved. Ascending as buyers push back on seats.
- **Platform + usage** — base fee plus consumption. Common for AI platforms and mature applied AI.
- **Credits / packaged consumption** — pre-purchased units consumed over time.
- **Custom / enterprise** — negotiated for large deals; often includes data processing, fine-tuning, deployment, support.

Caveat: margin pressure from inference costs is real. Applied AI vendors running on frontier model APIs have structurally lower gross margins than pre-AI SaaS. Pricing must account for this; "SaaS-typical 75%+ gross margin" is often not achievable without architectural investment.

## 8. Compliance / governance overlay

Expectations escalating fast:

- **SOC 2 Type II** — table stakes.
- **ISO 27001** — enterprise expectation.
- **ISO 42001** (AI management system) — emerging standard; some enterprise buyers now ask.
- **EU AI Act** alignment — risk classification, documentation, transparency obligations. Extraterritorial reach.
- **NIST AI RMF** — U.S. federal and many enterprise references.
- **Sector-specific**: HIPAA (health), SR 11-7 / model risk management (banking), FDA SaMD (medical devices), FERPA (education).
- **Training data provenance** — increasingly contested; IP/copyright exposure for buyers.
- **Data residency & sovereignty** — foundation model choice often driven by this.

A working AI ICP includes governance posture: buyers whose governance processes can evaluate AI vendors close; buyers whose processes can't, stall.

## 9. Archetypal ICP slices

**A — "Mid-market applied AI for function X, champion-led"**
US-based mid-market ($100M–$1B), dedicated function (Marketing, Sales, Support, Legal, Finance) with 20+ person team, champion at VP level with budget authority for POCs ≤ $50k, data accessible (function has its own data store or warehouse access), company has named AI initiative or exec announcement in last 12 months. Trigger: champion's KPI visibly underperforming, competitor AI announcement, or board AI mandate.

**B — "Enterprise AI platform / infra"**
Enterprise ($1B+ revenue), has Chief Data Officer or Chief AI Officer for >12 months, 50+ person data/ML team, building multiple AI applications in-house, frustrated with stitching together point tools (eval, observability, vector DB, orchestration). Trigger: failed in-house platform attempt, new AI leader mandate, or major cloud vendor relationship realignment.

**C — "Regulated vertical applied AI (finance, healthcare, legal)"**
Mid-market to enterprise in regulated vertical, has compliance leader engaged, prefers single-tenant or VPC deployment, has clear use case with measurable ROI (cost reduction, revenue generation, or risk mitigation), incumbent workflow is human-heavy and expensive. Trigger: regulatory change, labor cost pressure, or competitive AI-enabled entrant.

**D — "SMB PLG AI productivity"**
Small business or team (5–100), founder-led or VP-led, willing to try new tools, credit-card buyer, champion lives in the function, can self-serve onboarding. Trigger: content/referral from network, tool-stack modernization, or hiring freeze forcing productivity gains.

## 10. Common failure modes

- **Selling "AI" as a category.** AI is a capability; the ICP buys outcomes from that capability. Frame the outcome, not the model.
- **Ignoring governance readiness.** Many buyers like the product but cannot legally buy. Filter for governance posture.
- **Pricing models that punish their own value.** Per-seat AI tools work against themselves as they automate seats away.
- **Assuming eval-willingness.** Most buyers don't run rigorous evals. Productized eval support is differentiation.
- **Building on a single foundation model.** Model-provider risk (pricing, availability, policy changes) can kill a product quarterly. Sophisticated buyers ask.
- **Neglecting adoption mechanics.** AI tools fail via non-adoption more than any other SaaS category. CS and onboarding need AI-specific playbooks.
- **Over-promising on accuracy.** Sets up churn. Under-promise and publish honest evals.
- **Treating "AI-native" as sufficient positioning.** AI-native is becoming table stakes; workflow-native + vertical-specific beats it.

## 11. Resources

**Analysts & research:**
- Gartner (AI Hype Cycle, Magic Quadrants for AI categories).
- Forrester Wave coverage of AI categories.
- IDC AI reports.
- a16z *State of AI* reports.
- *State of AI Report* (Nathan Benaich, annual).
- AI Infrastructure Alliance reports.
- Menlo Ventures *State of Generative AI in the Enterprise*.

**Newsletters / writers:**
- *Latent Space* (swyx) — developer/infra angle.
- *Stratechery* (Ben Thompson) — strategy framing for AI moves.
- *Import AI* (Jack Clark) — policy + research.
- *The Sequence* — technical depth.
- *Exponential View* (Azeem Azhar).
- *One Useful Thing* (Ethan Mollick) — applied perspective.
- *Interconnects* (Nathan Lambert) — RL/post-training depth.
- Lenny Rachitsky — applied AI PM interviews.

**Communities:**
MLOps Community, AI Engineer community (Latent Space), MLOps.community Slack, Hugging Face forums, various vertical AI Slack communities.

**Events:**
NeurIPS / ICML / ICLR (research), AI Engineer Summit / World's Fair, Gartner AI events, Ray Summit, various vendor user conferences (Anthropic, OpenAI, Databricks, Snowflake AI Summit).

**Policy / governance:**
NIST (AI RMF), EU AI Office, UK AI Safety Institute, Partnership on AI, AI governance tracking (Stanford HAI Policy Tracker).

**Benchmarking:**
Artificial Analysis (model pricing/performance), HELM, LMSYS Chatbot Arena, vertical-specific leaderboards.
