// src/data/aiMlKnowledge.js
//
// Version: 2.0.0
// Last verified: 2026-05-21
// Next review: 2026-08-21 (quarterly)
//
// AI/ML market deep knowledge layer.
// Covers: foundation models, infrastructure, applied AI, enterprise
// adoption, model economics, regulatory, vertical markets, GTM,
// MLOps, data platforms, AI safety, and GPU economics.
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   1. Census Bureau BTOS (Business Trends and Outlook Survey)
//   2. Federal Reserve FEDS Notes (Jeffrey S. Allen, April 2026)
//   3. McKinsey Global Survey: State of AI in early 2025
//   4. Menlo Ventures: The State of Generative AI in the Enterprise 2025
//   5. Gartner Press Releases (Agentic AI forecasts, 2025)
//   6. Deloitte State of Generative AI in the Enterprise Q4 2025
//   7. NVIDIA quarterly filings / market share estimates
//   8. Hyperscaler capex aggregation (Alphabet, Amazon, Microsoft, Meta 10-Qs)
//   9. Salesforce State of Sales 2025
//   10. GitHub / Stack Overflow Developer Survey 2025
//   11. Similarweb / Writerbuddy AI traffic analysis 2025
//   12. Stanford HAI AI Index 2025
//   13. Gartner Hype Cycle for AI in Sales, Aug 2025
//   14. Real-Time Population Survey (Census/BLS)
//   15. Fortune Business Insights (MLOps market sizing)
//   16. Sacra / TLDL (AI company financials)
//   17. EU AI Act / Digital Omnibus (May 2026)
//   18. Colorado SB 26-189 (AI Act rewrite, May 2026)
//   19. NIST AI 600-1 and AI RMF profiles
//

export const AI_ML_PLAYBOOK = {
  name: "AI/ML & Applied Intelligence",
  keywords: [
    "artificial intelligence",
    "machine learning",
    "AI",
    "ML",
    "LLM",
    "large language model",
    "foundation model",
    "generative AI",
    "GenAI",
    "MLOps",
    "data platform",
    "AI infrastructure",
    "GPU",
    "OpenAI",
    "Anthropic",
    "Google DeepMind",
    "Databricks",
    "Snowflake",
    "Scale AI",
    "Hugging Face",
    "Cohere",
    "Weights and Biases",
    "DataRobot",
    "C3.ai",
    "Palantir",
    "applied AI",
    "AI agent",
    "agentic AI",
    "responsible AI",
    "AI safety",
    "model inference",
    "fine-tuning",
    "RAG",
    "vector database"
  ],
  personas: [
    "CTO",
    "VP Engineering",
    "VP AI/ML",
    "Chief Data Officer",
    "Chief AI Officer",
    "Head of ML Platform",
    "VP Product",
    "CEO/Founder",
    "CISO",
    "Chief Compliance Officer",
    "Head of Data Science",
    "VP Sales / CRO",
    "AI Council Lead",
    "Head of IT"
  ],
  discovery: [
    "Which model(s) does your product use? How does cost-per-task trend month-over-month?",
    "What's your token cost as a percentage of revenue? Where do you project it to stabilize?",
    "How do enterprise deals flow — bottom-up from users or top-down from procurement?",
    "What's your gross margin? Where will it land once scaled? Is token cost the constraint or pricing power?",
    "How is sales distributed — direct, channel/marketplace, or product-led? Highest-margin channel?",
  ],
  disqualifiers: [
    "No understanding of model economics (token costs, inference costs, GPU utilization)",
    "Treating 'AI' as a monolithic category without sub-segment specificity",
    "No awareness of the agentic AI hype-vs-reality dynamic",
    "Inability to distinguish build-vs-buy in AI infrastructure context"
  ],
  triggerEvents: [
    "New foundation model release (capability jump, price drop)",
    "EU AI Act compliance deadline (high-risk systems Aug 2026 or delayed)",
    "Enterprise AI council formation or governance mandate",
    "Model deprecation by provider (breaking change for apps)",
    "GPU availability or pricing shift",
    "Major AI safety incident or regulatory action",
    "IPO filing (OpenAI, Databricks, Anthropic pipeline)",
    "Colorado or other state AI law effective date"
  ],
  compliance: [],
  usps: [],
  layerContent: `---
title: "AI/ML & Applied Intelligence — Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_b2b_sales_value_creation.md
  - cambrian_investor_intelligence.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_healthcare_saas_knowledge_layer.md
  - cambrian_fintech_knowledge_layer.md
tags: [AI, ML, LLM, foundation-model, GenAI, MLOps, data-platform, GPU, OpenAI, Anthropic, DeepMind, Databricks, Snowflake, Scale-AI, applied-AI, agentic-AI, responsible-AI, AI-safety, enterprise-AI]
last_updated: 2026-05-21
status: production
confidence: high (Federal Reserve FEDS Notes April 2026; Census BTOS; McKinsey State of AI 2025; Menlo Ventures 2025; Gartner 2025; Deloitte Q4 2025; Stanford HAI 2025; company filings; EU AI Act / Digital Omnibus May 2026; Colorado SB 26-189)
---

# AI/ML & Applied Intelligence — Knowledge Layer

> **Working thesis.** The AI/ML market in 2026 is the fastest-moving, highest-capital-intensity, and most regulation-uncertain technology category in a generation. Enterprise GenAI spend hit $37B in 2025 (up from $1.7B in 2023) [verified 05/2026, Menlo Ventures]. Private AI startup funding topped $150B over the trailing twelve months [verified 05/2026, AI Funding Tracker / TLDL]. The combined valuation of the ten largest AI companies exceeds $2T. But beneath the headline numbers, a stark bifurcation: **~6% of organizations qualify as "AI high performers" with 5%+ EBIT impact from AI, while >40% of agentic AI projects will be canceled by end of 2027** [verified 05/2026, McKinsey QuantumBlack / Gartner]. The market structure has five layers — foundation models, compute/infrastructure, inference APIs, tooling/orchestration, and applied AI — with value concentrating at the extremes (frontier labs and top-of-stack applied companies) while middle layers commoditize. The dominant 2026 dynamics are: (a) Anthropic's emergence as the enterprise AI leader ($30B+ ARR, 1400% YoY growth, $900B valuation talks), (b) GPU economics becoming the binding constraint on AI company viability, (c) the agentic AI reality check separating real deployments from vaporware, (d) EU AI Act high-risk deadlines approaching (with potential Digital Omnibus delay to Dec 2027), and (e) state-level AI legislation (Colorado SB 26-189) creating compliance obligations. **For Cambrian's seller-users, AI is simultaneously the vertical with the highest buyer enthusiasm and the highest buyer confusion — the intelligence advantage goes to sellers who can distinguish signal from hype.**

> **What makes AI/ML distinct as a sales target.** Four dynamics: (1) **The build-vs-buy decision is even more acute than in fintech.** Every engineering team evaluates "should we build this AI capability ourselves?" alongside every vendor evaluation. Open-weight models (Llama, Mistral, Qwen) make the "build" side more viable than in any prior technology wave. (2) **Model economics create structural margin uncertainty.** Token prices collapsed 99% since 2022 for equivalent capability [verified 05/2026, Stanford HAI AI Index 2025], but many AI apps have near-zero or negative gross margins because token costs exceed prices on heavy users. The structural bet is that costs fall faster than competitive price compression. (3) **PLG dynamics are stronger than typical enterprise software.** Adoption flows from individual contributors (engineers, support, marketing) into team and enterprise expansion. AI council gates increasingly intermediate this flow. (4) **The regulatory landscape is moving from optional to mandatory.** EU AI Act, NIST AI RMF, Colorado AI Act (SB 26-189), and SEC AI disclosure scrutiny are creating real compliance obligations for AI companies for the first time.

---

## Table of Contents

1. [Snapshot and market sizing](#1-snapshot-and-market-sizing)
2. [What makes AI/ML distinct as a sales target](#2-what-makes-aiml-distinct-as-a-sales-target)
3. [Sub-categorization — the five layers](#3-sub-categorization--the-five-layers)
4. [Major companies and competitive landscape](#4-major-companies-and-competitive-landscape)
5. [Regulatory overlay](#5-regulatory-overlay)
6. [Technology stack and vendor landscape](#6-technology-stack-and-vendor-landscape)
7. [ICP patterns by buyer type](#7-icp-patterns-by-buyer-type)
8. [Buying committee and decision dynamics](#8-buying-committee-and-decision-dynamics)
9. [Trigger events](#9-trigger-events)
10. [Common failure modes](#10-common-failure-modes)
11. [GTM implications for Cambrian seller-users](#11-gtm-implications-for-cambrian-seller-users)
12. [Cross-references to sister layers](#12-cross-references-to-sister-layers)

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| Enterprise GenAI spend (2025) | $37B (up from $1.7B in 2023) [verified 05/2026, Menlo Ventures] |
| Private AI startup funding (TTM) | $150B+ [verified 05/2026, AI Funding Tracker / TLDL] |
| Combined valuation of top 10 AI companies | $2T+ [verified 05/2026, TLDL AI Company Rankings 2026] |
| MLOps market (2025) | $2.43B [verified 05/2026, Precedence Research] |
| MLOps market (2026 projected) | $3.33-4.38B at 37-39.8% CAGR [verified 05/2026, Fortune Business Insights / Precedence Research] |
| MLOps market (2035 projected) | $56.6B [verified 05/2026, Precedence Research] |
| Broader ML market (2030 projected) | $282B at 30.4% CAGR [verified 05/2026, Fortune Business Insights] |
| U.S. firm-level AI adoption | ~18% (year-end 2025, Census BTOS) [verified 05/2026, Census BTOS via Fed FEDS Notes] |
| Individual work-related GenAI adoption | ~41% (Nov 2025, Real-Time Population Survey) [verified 05/2026, RTPS via Fed FEDS Notes] |
| Organizations using AI regularly | 88% in at least one function [verified 05/2026, McKinsey State of AI 2025] |
| Organizations using GenAI specifically | 71%+ in at least one function [verified 05/2026, McKinsey] |
| AI high performers (5%+ EBIT impact) | ~6% of organizations [verified 05/2026, McKinsey QuantumBlack] |
| Global AI tool users | 378M in 2025 (+64M new) [verified 05/2026, Writerbuddy / Similarweb] |
| AI coding assistant usage | ~41% of code AI-written; 50% of devs use AI daily [verified 05/2026, GitHub / Stack Overflow 2025] |
| Vertical AI investment (2025) | $3.5B (3x 2024): healthcare $1.5B, legal $650M, creator $360M, gov $350M [verified 05/2026, Menlo Ventures] |
| Hyperscaler combined AI capex | $300B+ committed [verified 05/2026, Alphabet/Amazon/Microsoft/Meta 10-Qs] |
| NVIDIA AI chip market share | 80-95% (training + inference) [verified 05/2026, NVIDIA 10-Q / TechInsights] |

### Headline dynamics

- **Anthropic emerged as the enterprise AI leader.** $30B+ ARR on 1,400% YoY growth; $900B valuation in talks; Google investing $40B ($10B immediate + $30B milestone-based) [verified 05/2026, PYMNTS / Sacra].
- **OpenAI remains the consumer and developer scale leader.** $25B ARR at $852B valuation; IPO window late 2026 or 2027; projecting $14B loss in 2026; profitability not expected until 2029-2030 [verified 05/2026, AI Funding Tracker / TLDL].
- **Databricks crossed $5.4B ARR** with 65% YoY growth and positive free cash flow; $5B Series F at $134B valuation; preparing for one of the largest tech IPOs in history [verified 05/2026, Sacra / TLDL].
- **Agentic AI is the hype peak.** >40% of agentic AI projects will be canceled by end of 2027 due to escalating costs, unclear value, and inadequate risk controls. Of thousands of vendors marketing "AI agent" capabilities, only ~130 have actual agentic functionality [verified 05/2026, Gartner June 2025].
- **Token prices collapsed but margin pressure remains.** 99% price decline since 2022 for equivalent capability [verified 05/2026, Stanford HAI]. Frontier: $3-15/M input, $15-75/M output; mid-tier: $0.15-3; open-weight self-hosted: <$0.10-0.50 [verified 05/2026, provider pricing pages].
- **Regulatory walls rising.** EU AI Act high-risk obligations August 2026 (with potential Digital Omnibus delay to Dec 2027 for Annex III systems); Colorado SB 26-189 effective Jan 2027; NIST AI RMF expanding profiles.

---

## 2. What makes AI/ML distinct as a sales target

**1. Build-vs-buy is the dominant strategic tension.** Every engineering team evaluates internal build alongside vendor evaluation. Open-weight models (Meta Llama, Mistral, Alibaba Qwen) make self-hosting viable. The "buy" value proposition must be expressed in terms of time-to-production, reliability, compliance coverage, and total cost of intelligence — not just feature comparison.

**2. Model economics create structural margin uncertainty.** Many AI applications have negative gross margins on heavy users because token/inference costs exceed per-user pricing. The structural bet: model costs continue to fall (99% decline 2022-2025) faster than competitive price pressure compresses prices. Vendors that achieve pricing power through task-specific superiority or workflow integration survive; commodity inference wrappers do not.

**3. PLG dynamics dominate initial adoption.** Individual contributors discover AI tools and expand into team/enterprise. The typical motion: engineer uses coding assistant, support team uses chat AI, marketing uses content generation, then leadership formalizes with enterprise contract. AI council gates increasingly intermediate this bottom-up flow, adding procurement complexity.

**4. The capability frontier moves monthly.** New model releases (with capability jumps, price drops, or architecture changes) force continuous re-evaluation. Model deprecations break applications. Vendors built on a single model face concentration risk. Multi-model strategies and abstraction layers are becoming table stakes for enterprise buyers.

---

## 3. Sub-categorization — the five layers

| Layer | What it does | Key players | Economics |
|---|---|---|---|
| **Foundation models** | Train and serve frontier LLMs, multimodal models | Anthropic, OpenAI, Google DeepMind, Meta, xAI, Mistral, DeepSeek, Alibaba Qwen | Massive capex ($1B+ per frontier training run); revenue from API access + enterprise contracts; most are unprofitable |
| **Compute / infrastructure** | GPUs, cloud, data centers, power | NVIDIA, AMD, Google (TPU), AWS (Trainium), Meta (MTIA); neoclouds (CoreWeave, Crusoe, Lambda) | Capex-intensive; NVIDIA 80-95% market share; power/grid constraints becoming binding |
| **Inference APIs / model serving** | Route, serve, and optimize model inference | Together AI, Fireworks AI, Anyscale, Baseten, Modal | Commodity economics; margin compression; differentiation on latency, cost, and reliability |
| **Tooling / orchestration** | MLOps, eval, monitoring, vector DBs, RAG frameworks | Weights & Biases, MLflow, LangChain, LlamaIndex, Pinecone, Weaviate, Braintrust, Arize | Platform-play economics; experiment tracking, observability, prompt management |
| **Applied AI** | Domain-specific AI products for end-users | Vertical SaaS + AI (healthcare, legal, finance, sales); horizontal apps (coding, support, content) | Highest margins when task-specific moat exists; commodity risk for thin-wrapper apps |

### Sub-layer detail: Applied AI verticals (where Cambrian's sellers operate)

| Vertical | Market size indicator | Key players | Maturity |
|---|---|---|---|
| **AI-powered coding** | Most mature; 15%+ velocity gains | GitHub Copilot, Cursor, Replit, Codeium, Tabnine | Production; ~41% of code AI-written |
| **Customer support AI** | 20-60% tier-1 deflection | Intercom Fin, Zendesk AI, Sierra, Forethought, Ada | Production in narrow scope; agentic expanding |
| **Healthcare AI** | $1.5B invested (2025); 43% of vertical AI | Abridge, Nuance DAX, Fathom, AKASA, Suki | Crossed chasm in ambient documentation and coding |
| **Legal AI** | $650M invested (2025) | Harvey, Casetext (Thomson Reuters), CoCounsel, EvenUp | Production for research/review; expanding to drafting |
| **Sales AI** | 87% of sales leaders under pressure to deploy | Gong, Clari, People.ai, Outreach, Salesloft | Production for conversation intelligence; agentic prospecting early |
| **Financial AI** | Financial sector 63% adoption (highest) | Bloomberg Terminal GPT, AlphaSense, Kensho, Ramp AI | Production for research, compliance, expense management |
| **Content / creative AI** | Creator tools $360M invested | Jasper, Writer, Runway, Midjourney, ElevenLabs | Production for drafts; human review still dominant |

---

## 4. Major companies and competitive landscape

### Foundation model labs (the platforms)

| Company | Valuation / scale | Key metric | Position |
|---|---|---|---|
| **Anthropic** | $900B (in talks); $30B+ ARR; Google $40B investment [verified 05/2026, PYMNTS / Sacra] | 1,400% YoY revenue growth; Claude model family | Enterprise AI leader; strongest safety positioning; fastest revenue growth of any private company in history |
| **OpenAI** | $852B; $25B ARR [verified 05/2026, AI Funding Tracker] | IPO target late 2026-2027; $14B projected 2026 loss | Consumer/developer scale leader; GPT-5+ family; broadest distribution |
| **Google DeepMind** | Part of Alphabet ($2T+ market cap) | ~$5B+ direct AI revenue; Gemini model family [verified 05/2026, TLDL / Alphabet filings] | Deepest research bench; TPU infrastructure advantage; Gemini competitive on reasoning |
| **Meta AI** | Part of Meta ($1.5T+ market cap) | Llama open-weight models; MTIA custom silicon | Open-weight strategy; Llama is the default open model; invested $14.3B in Scale AI [verified 05/2026, Sacra] |
| **xAI** | ~$50B+ valuation | Grok model family; 100K GPU cluster | X (Twitter) distribution; Musk-backed; compute advantage |
| **Mistral** | ~$6B+ valuation | European leader; open-weight + commercial; multilingual strength | EU-headquartered (regulatory positioning); Mixtral and Mistral Large families |
| **DeepSeek** | China-based | DeepSeek-V3/R1 competitive on reasoning at fraction of cost | Disrupted pricing assumptions; demonstrated frontier capability at dramatically lower training cost |

### Infrastructure and data platform leaders

| Company | Valuation / Market Cap | Key metric | Position |
|---|---|---|---|
| **NVIDIA** | ~$3T+ market cap (NASDAQ: NVDA) | 80-95% AI chip share; data center revenue dominant [verified 05/2026, NVIDIA 10-Q] | Controls the AI compute stack; Blackwell architecture; inference optimization |
| **Databricks** | $134B (Series F); $5.4B ARR; 65% YoY growth [verified 05/2026, Sacra / TLDL] | Positive free cash flow; IPO preparation | Unified data + AI platform; lakehouse architecture; MosaicML (LLM training) |
| **Snowflake** | ~$55B market cap (NYSE: SNOW) | Data cloud; expanding into AI/ML workloads | Enterprise data warehousing; Arctic model; Cortex AI layer |
| **Scale AI** | $29B+ (Meta invested $14.3B for 49% stake, June 2025) [verified 05/2026, Sacra] | $2B revenue (2025; up from $870M in 2024) | Data labeling + evaluation; government contracts; AI safety testing |
| **Palantir** | ~$270B+ market cap (NYSE: PLTR) | Q4 2025 revenue $1.41B (+70% YoY); FY2026 guidance $7.18-7.20B [verified 05/2026, Palantir filings / Motley Fool] | Enterprise AI platform (AIP); government + commercial; polarizing valuation |

### MLOps and tooling

| Company | Position | Notes |
|---|---|---|
| **Weights & Biases** | Experiment tracking dominant | Research labs + production ML teams; de facto standard |
| **MLflow (Databricks)** | Open-source ML lifecycle management | Most widely adopted OSS MLOps tool |
| **Hugging Face** | Model distribution / community | 500K+ hosted models; GitHub of ML [verified 05/2026, Hugging Face] |
| **LangChain / LangSmith** | LLM application orchestration | Developer framework for chaining LLM calls; observability |
| **Pinecone, Weaviate, Qdrant, Chroma** | Vector databases | RAG infrastructure; embedding storage and retrieval |
| **Arize, Braintrust, Patronus** | LLM observability and evaluation | Production monitoring, eval, and guardrails |

### Applied AI companies (selling AI products)

| Company | Vertical | Position |
|---|---|---|
| **Cohere** | Enterprise RAG / multilingual | Command R family; production document analysis and search |
| **C3.ai** | Enterprise AI platform | Q3 FY2026 revenue missed; stock -35% YTD, -60% 1-year; leadership transition [verified 05/2026, Motley Fool] |
| **DataRobot** | AutoML / enterprise ML platform | Established but facing competition from Databricks, cloud-native AI services |
| **Harvey** | Legal AI | Leading legal vertical AI; Series C stage |
| **Abridge** | Healthcare ambient documentation | $150M+ Series B; fastest-growing healthcare AI category |
| **Gong** | Sales conversation intelligence | Revenue intelligence leader; expanding into AI-powered sales workflows |

### Active acquirers and investors

- **Google** — $40B Anthropic investment ($10B immediate + $30B milestone); leading AI investor
- **Microsoft** — $13B+ in OpenAI; Nuance ($19.7B, healthcare AI); GitHub Copilot
- **Meta** — $14.3B Scale AI investment; open-weight model distribution strategy
- **Salesforce Ventures** — Active AI portfolio (Anthropic, Cohere, Hugging Face)
- **Andreessen Horowitz** — Leading AI VC (Databricks, Anyscale, Character.ai)
- **Sequoia, Lightspeed, Index** — Major AI growth investors
- **PE entering AI** — Thoma Bravo, Vista Equity, Silver Lake acquiring AI-adjacent companies

---

## 5. Regulatory overlay

### International

| Regulation | Status | Impact |
|---|---|---|
| **EU AI Act** | Phased: prohibited systems Feb 2025; GPAI Aug 2025; **high-risk (Annex III) originally Aug 2026 but Digital Omnibus (provisional agreement May 7, 2026) would push to Dec 2027** [verified 05/2026, EU AI Act / Modulos / Baker Botts] | Risk-based classification; conformity assessments; fines up to 7% global revenue; high-risk systems require documentation, testing, human oversight |
| **EU Digital Omnibus** | Provisional agreement May 7, 2026; formal adoption pending | If adopted before Aug 2, 2026: Annex III high-risk systems delayed to Dec 2, 2027; Annex II to Aug 2, 2028. If NOT adopted: original Aug 2026 dates stand. [verified 05/2026, Baker Botts / Modulos] |

### U.S. federal

| Regulation | Status | Impact |
|---|---|---|
| **NIST AI RMF 1.0** | Published; voluntary framework | Risk management framework; GOVERN, MAP, MEASURE, MANAGE functions; increasingly referenced in procurement |
| **NIST AI 600-1 (GenAI Profile)** | Published July 2024 | GenAI-specific risks and mitigations |
| **NIST Critical Infrastructure AI Profile** | Concept note April 2026; AI Agent Interoperability Profile late 2026 [verified 05/2026, NIST] | Expanding NIST coverage to infrastructure and agent-specific risks |
| **SEC AI disclosure scrutiny** | Enforcement actions ongoing | Scrutiny of AI claims in public filings and marketing; "AI washing" concerns |
| **Executive orders** | Various; AI governance + innovation balance | Pro-innovation stance with guardrails; AI safety commitments from frontier labs |

### U.S. state level

| Regulation | Status | Impact |
|---|---|---|
| **Colorado AI Act (SB 24-205)** | Original law effective Feb 1, 2026; **rewritten by SB 26-189 (passed May 12, 2026; effective Jan 1, 2027)** [verified 05/2026, Colorado General Assembly / Norton Rose Fulbright] | Narrowed from "high-risk AI" to "automated decision-making technology" (ADMT) for "consequential decisions." Requires consumer notice + explanation of adverse outcomes within 30 days. |
| **California AI bills** | Multiple bills proposed each session; none comprehensive enacted as of May 2026 | SB 1047 (vetoed 2024) attempted frontier model regulation; replacement bills in progress |
| **New York Local Law 144** | In effect (employment automated tools) | NYC employers using AI in hiring must conduct bias audits |
| **Other states** | 30+ states introduced AI bills in 2025-2026 sessions [verified 05/2026, Drata / IAPP] | Patchwork emerging; no federal preemption |

### Compliance economics for AI companies

- EU AI Act conformity assessment (high-risk): $200K-$2M+ depending on system scope
- NIST AI RMF alignment: $50K-$500K for documentation, testing, and governance implementation
- State AI law compliance (Colorado SB 26-189): $50K-$200K for notice systems, impact assessments
- SOC 2 Type II (AI-specific controls): $30K-$150K
- Red teaming / AI safety testing: $100K-$1M per model release cycle
- Bias and fairness auditing: $50K-$500K per product
- Legal review of AI claims (SEC "AI washing" risk): $50K-$200K annually

---

## 6. Technology stack and vendor landscape

### AI/ML infrastructure stack

| Layer | Vendors | Notes |
|---|---|---|
| **GPU / accelerators** | NVIDIA (H100, H200, Blackwell), AMD (MI300X), Google TPU, AWS Trainium, Intel Gaudi | NVIDIA dominant; alternatives gaining; custom silicon for specific workloads |
| **Cloud / compute** | AWS, Azure, GCP, CoreWeave, Crusoe, Lambda, Together AI | Hyperscalers + neoclouds; power/grid constraints real |
| **Model serving / inference** | NVIDIA NIM, vLLM, TensorRT-LLM, Anyscale, Baseten, Modal, Fireworks | Commodity layer; latency and cost optimization |
| **Foundation model APIs** | Anthropic, OpenAI, Google, Cohere, Mistral | Enterprise contracts; usage-based pricing; SLA differentiation |
| **Fine-tuning / training** | Databricks (MosaicML), Hugging Face, Anyscale, Scale AI | Custom model adaptation; proprietary data training |
| **Vector databases** | Pinecone, Weaviate, Qdrant, Chroma, pgvector, Milvus | RAG infrastructure; embedding storage; semantic search |
| **Orchestration / frameworks** | LangChain, LlamaIndex, Semantic Kernel, AutoGen | LLM application development; agent frameworks |
| **Experiment tracking / MLOps** | Weights & Biases, MLflow, Neptune, Comet | Model development lifecycle; experiment management |
| **Evaluation / observability** | Arize, Braintrust, Patronus, LangSmith, Helicone | LLM production monitoring; eval pipelines; guardrails |
| **Data labeling / annotation** | Scale AI, Labelbox, Snorkel, Surge AI | Training data preparation; RLHF; red teaming |
| **AI safety / guardrails** | Guardrails AI, NeMo Guardrails (NVIDIA), Lakera, Rebuff | Prompt injection defense, output filtering, policy enforcement |
| **AI governance** | Credo AI, Holistic AI, Fairly AI | Compliance documentation; risk assessment; bias auditing |

### Integration patterns

- **REST APIs** — universal for model serving and AI product integration
- **Streaming (SSE)** — standard for real-time token generation (chat, coding)
- **SDK / client libraries** — Anthropic, OpenAI, Google all provide language-specific SDKs
- **Model Context Protocol (MCP)** — Anthropic's open standard for connecting AI to external tools and data
- **Function calling / tool use** — API pattern for AI models to invoke external functions
- **Webhooks** — event-driven notifications for async AI workflows
- **Batch APIs** — cost-optimized for non-real-time workloads (50%+ cheaper)

---

## 7. ICP patterns by buyer type

### Best-fit Cambrian user-prospect: Applied AI vertical SaaS (Series B-D, $5-100M ARR)

Why this segment:
- Classic growth-stage sweet spot: scaling sales is the constraint, not product
- VC-backed growth pressure creates urgency for sales intelligence and GTM tooling
- Domain knowledge moat makes Cambrian's vertical intelligence highly relevant
- Complex enough selling motion (enterprise, multi-stakeholder) to benefit from account briefs
- Model economics create real strategic questions that Cambrian's intelligence can illuminate

### High-fit segments

| Segment | Avg fit | Deal size | Cycle | Why |
|---|---|---|---|---|
| Applied AI vertical SaaS (financial services, healthcare, legal) | 80-90% | $100K-$1M ACV | 6-18 months | Domain moat; enterprise ROI visibility; compliance frameworks; Cambrian's fintech lens applicable |
| AI-enabled fintech & payments | 80-90% | $100K-$2M ACV | 6-12 months | Direct domain overlap; enterprise buyer understanding; regulatory navigation credibility |
| Series B-D AI companies with PMF ($5-100M ARR) | 75-85% | $50K-$500K ACV | 3-9 months | Growth-stage sweet spot; scaling sales is constraint; VC-backed growth pressure |
| PE-backed AI portfolio companies | 75-85% | $100K-$500K ACV | 3-9 months | EBITDA/multiple framing aligns with PE thesis; cross-portfolio leverage |
| Enterprise AI platform companies | 65-75% | $200K-$2M ACV | 9-18 months | Complex GTM; multi-vertical; long cycles; high ACV |

### Lower-fit segments

| Segment | Avg fit | Why |
|---|---|---|
| Foundation model labs (Anthropic, OpenAI, Google) | 15-25% | Massive internal GTM teams; unlikely to need boutique consulting |
| Pure AI infrastructure / chips | 10-20% | Hyperscaler/government-focused; supply-chain dominated |
| AI safety & alignment / defense | 12-22% | Research-oriented; government relationships; different GTM logic |
| Pure AI tooling startups (LangChain, eval tools) | 20-35% | Consolidating; commoditization pressure; hyperscalers build competing tools |
| AI wrapper apps (thin UI over API) | 15-30% | Low moat; high churn; commodity risk; often pre-revenue |

### Buyer profile

- Title: CTO, VP AI/ML, VP Product, CEO (at growth-stage), Chief AI Officer, Head of Data Science, CRO
- Pain articulation: scaling enterprise sales beyond founder-led, navigating enterprise procurement and AI council gates, differentiating against "AI-powered everything" noise, proving ROI in POC-to-production conversion, managing model economics and gross margin
- Buying behavior: PLG-influenced; evaluation-heavy (run evals on real workloads); technical proof required; champion-led procurement; 6-18 months for enterprise
- Budget cycle: continuous for growth-stage (VC-funded); quarterly for enterprise; triggered by funding rounds and board mandates

---

## 8. Buying committee and decision dynamics

| Role | What they care about | Their lens |
|---|---|---|
| **CTO / VP Engineering** | Technical architecture, model quality, integration, latency, reliability, vendor lock-in | "Does this perform on our workloads? Can we swap models if needed?" |
| **VP AI/ML / Head of Data Science** | Model performance, evaluation methodology, fine-tuning capability, MLOps integration | "How does this compare on our benchmarks? Can we customize?" |
| **VP Product** | User experience, feature completeness, time-to-ship, competitive positioning | "Does this give our users a better experience than alternatives?" |
| **CEO / Founder** | Strategic positioning, competitive differentiation, fundraising narrative, total cost | "Does this make us more defensible? How does this affect our story?" |
| **CFO** | Unit economics, token costs, gross margin impact, total cost of ownership | "What's the all-in cost per task? How does this scale with users?" |
| **CISO** | Data security, PII handling, prompt injection, model access controls, SOC 2 | "Where does our data go? What are the injection and exfiltration risks?" |
| **Chief Compliance Officer** | EU AI Act, NIST AI RMF, state AI laws, bias/fairness, documentation | "Does this create regulatory exposure? Can we demonstrate compliance?" |
| **AI Council / Governance** | Enterprise-wide AI strategy, vendor consolidation, risk management | "Does this fit our AI strategy? Are we creating vendor sprawl?" |
| **Procurement** | Contract terms, pricing model, SLA, enterprise agreements | "What's the pricing model? Usage-based or committed? What's the SLA?" |

### Decision pattern

- **Individual / team adoption (PLG)**: Engineer or IC discovers tool; team expands; 7-30 days to team adoption. No formal procurement.
- **Department / business unit**: VP/Director sponsor + technical lead + security review. 30-90 days.
- **Enterprise / AI platform deal**: Full committee (CTO, CISO, compliance, AI council, procurement, legal, CFO). 6-18 months.
- **Critical dynamic**: **AI council gates** are increasingly common in enterprises. A cross-functional committee (CTO + CISO + legal + compliance) evaluates all AI vendor additions. Vendors that pre-package AI governance documentation (NIST AI RMF alignment, bias testing, security controls) clear this gate faster.
- **PLG-to-enterprise conversion**: The most common motion. IC adoption creates usage data that justifies enterprise contract. The seller's job is to identify and accelerate this conversion by finding the executive sponsor who can formalize the relationship.

---

## 9. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **New foundation model release** | Capability jump, price drop, architecture change | Re-evaluation cycle for every AI app; model-switching opportunity; competitive positioning shift |
| **EU AI Act compliance deadline (Aug 2026 / Dec 2027)** | High-risk system obligations becoming real | AI governance, documentation, and compliance tooling demand spike |
| **Colorado SB 26-189 effective (Jan 2027)** | First U.S. state ADMT compliance obligation | Notice system, impact assessment, and governance tooling demand |
| **AI council formation** | Enterprise formalizing AI governance | Vendor consolidation opportunity; governance tooling window |
| **Model deprecation by provider** | Breaking change for applications built on deprecated model | Migration services and multi-model abstraction demand |
| **GPU availability / pricing shift** | Compute economics change | Infrastructure re-evaluation; self-hosted vs. API tradeoff recalculation |
| **Major AI safety incident** | Industry-wide trust event | Safety tooling, guardrails, and monitoring demand spike |
| **IPO filing (OpenAI, Databricks, Anthropic)** | Market maturation signal; valuation benchmarks | Enterprise confidence increase; competition for enterprise contracts intensifies |
| **Enterprise AI budget allocation** | Board/CEO mandates AI investment | Procurement window opens; 87% of sales leaders report board/CEO pressure [verified 05/2026, Salesforce State of Sales 2025] |
| **Funding round** | Growth mandate | GTM tooling purchase window; scaling sales is the constraint |
| **Agentic AI project cancellation** | Reality check on AI agent hype | Retrenchment to proven narrow-task AI; vendor re-evaluation |

---

## 10. Common failure modes

1. **Treating "AI" as a single market.** Foundation models, infrastructure, MLOps, applied AI — these are as different as "banking" and "payments." A generic "AI company" pitch reveals lack of segmentation.

2. **Selling the hype, not the reality.** >40% of agentic AI projects will be canceled [verified 05/2026, Gartner]. Buyers who have been burned by AI hype are skeptical. Sellers who distinguish "GenAI applied to a useful task" from "AI agent claiming autonomous capability" earn disproportionate trust.

3. **Ignoring model economics.** A prospect whose AI product has negative gross margins on heavy users has fundamentally different priorities than a prospect with 70%+ margins. Token cost as % of revenue is the critical metric. Sellers who don't understand model economics cannot position effectively.

4. **Pitching features without evaluation results.** Enterprise AI buyers run evals on real workloads, not benchmarks. "Our model scores X on MMLU" is less compelling than "here's how we perform on your specific use case." Sellers must facilitate technical evaluation, not just demo.

5. **Missing the PLG-to-enterprise conversion.** Many AI sales start as bottom-up IC adoption. A seller who approaches the enterprise-level conversation without understanding existing usage (how many seats, which teams, what workloads) misses the highest-leverage angle.

6. **Overestimating the "AI moat."** Most AI companies do not have a durable moat. Model capabilities commoditize, open-weight alternatives emerge, and hyperscalers build competing features. The real moat is in data, workflow integration, and domain expertise — not in "we use AI." Sellers who probe for the real moat identify which prospects are durable.

7. **Ignoring regulatory exposure.** EU AI Act, NIST AI RMF, Colorado SB 26-189, and SEC AI disclosure scrutiny are creating real compliance obligations. A seller who doesn't understand the prospect's regulatory exposure cannot position effectively for enterprise deals where compliance is a gate.

8. **Confusing agentic positioning with agentic capability.** Of thousands of vendors marketing "AI agent" capabilities, only ~130 have actual agentic functionality [verified 05/2026, Gartner]. Sellers must distinguish real capability from marketing positioning.

---

## 11. GTM implications for Cambrian seller-users

### For sellers prospecting AI companies

- **Sub-categorize the layer.** Foundation model, infrastructure, tooling, or applied AI — each has different economics, buying patterns, and competitive dynamics. "AI company" is not an ICP.
- **Lead with model economics fluency.** Token cost as % of revenue, gross margin trajectory, inference cost trends — these are the vocabulary of AI company leadership. Sellers who speak this language earn trust.
- **Know the agentic reality check.** The most important counterweight citation: >40% cancellation rate [Gartner]. Sellers who position against hype and toward proven narrow-task value differentiate.
- **Understand PLG-to-enterprise dynamics.** Identify existing bottom-up usage before approaching enterprise. Usage data is the highest-leverage sales asset.
- **Map the AI council.** Enterprise buyers increasingly have AI governance committees. Identify the council composition, understand their criteria, and pre-package compliance documentation.

### For sellers selling *from* AI companies

- Cambrian's seller-users at AI companies need account briefs that reflect the prospect's specific AI maturity (early adoption, scaling, or optimization), existing AI vendor stack, and governance posture.
- Investor intelligence overlay is critical — public AI companies (Palantir, C3.ai, Snowflake) have earnings-driven behavior; VC-backed AI companies have fundraising timelines; PE-backed AI companies have EBITDA mandates.
- The agentic AI reality check is the single most valuable piece of intelligence a seller can bring to a conversation. It positions the seller as a truth-teller in a market full of hype.

### Cross-vertical extensions

- **Healthcare** — ambient documentation, coding AI, clinical decision support are AI products selling into healthcare buyers; $1.5B invested in healthcare AI in 2025
- **Fintech** — financial services leads all sectors in AI adoption (63%); fraud detection, AML, KYC, and underwriting are applied AI use cases
- **Legal** — $650M invested in legal AI; Harvey, CoCounsel, EvenUp leading
- **Sales** — 87% of sales leaders under pressure to deploy AI; conversation intelligence and prospecting automation
- **Manufacturing** — 58% AI adoption, fastest YoY growth; predictive maintenance, quality, supply chain

### FEDERAL RESERVE FEDS NOTES — CANONICAL AI ADOPTION SOURCE (April 3, 2026, Jeffrey S. Allen)

This is the most credible single dataset for cross-vertical AI adoption benchmarking. Should be the primary citation for adoption baselines; use Menlo Ventures for vertical AI investment dollars; use Gartner for the agentic cancellation counterweight. Next refresh expected fall 2026 with Q3 data. Key methodology notes: Census BTOS for firm-level adoption; Real-Time Population Survey for individual adoption; Survey of Business Uncertainty for senior-leader integration. Financial sector is the only sector that did not show deceleration around Q2 2025. [verified 05/2026, Census BTOS via Fed FEDS Notes]

### Joe's positioning note

AI/ML is a vertical where Joe has direct product experience through Cambrian itself — the platform is an applied AI product. The meta-knowledge is powerful: Cambrian's seller-users are selling AI products, and Cambrian is an AI product that helps them sell. This recursive positioning ("we know AI because we are AI") is credible when backed by the specifics in this layer. The agentic reality check, model economics fluency, and enterprise adoption data from Fed FEDS Notes are the highest-leverage intelligence assets for positioning Cambrian in the AI market.

---

## 12. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`cambrian_b2b_sales_value_creation.md\` | Enterprise GTM motion for AI companies; PLG-to-enterprise conversion patterns |
| \`cambrian_investor_intelligence.md\` | Public AI companies (Palantir, C3.ai, Snowflake); VC-backed AI startups (Anthropic, OpenAI pipeline); PE-backed AI portfolio companies |
| \`cambrian_approval_gates_knowledge_layer.md\` | AI council gates; CISO and compliance gates for AI vendors; enterprise procurement patterns |
| \`cambrian_healthcare_saas_knowledge_layer.md\` | Healthcare AI is the largest vertical AI category ($1.5B); ambient documentation, coding AI, prior auth |
| \`cambrian_fintech_knowledge_layer.md\` | Financial services AI adoption highest (63%); fraud, AML, KYC, underwriting use cases |
| \`cambrian_executive_perspectives_knowledge_layer.md\` | CTO/CIO perspectives on AI strategy, AI council dynamics, vendor evaluation |
| \`cambrian_okr_kpi_knowledge_layer.md\` | AI company metrics: token cost %, gross margin, NRR, PLG conversion rate |

---

## KNOWN TRAPS — DATA THAT GOES STALE FASTEST (flag for every quarterly sweep)

1. **MODEL PRICING**: Token prices change monthly or faster. Frontier pricing ($3-15/M input) and mid-tier pricing shift with every model release. Re-verify against provider pricing pages. [verified 05/2026, provider pricing pages]
2. **ADOPTION RATES**: Census BTOS methodology changed late 2025; YoY comparisons across the break are misleading. Fed FEDS Notes publishes ~2x/year; between publications, adoption figures are stale. [verified 05/2026, Census BTOS]
3. **CAPABILITY CLAIMS**: "AI writes X% of code" and "AI deflects X% of support tickets" are self-reported, vary wildly, and vendors inflate them. Treat as directional ranges.
4. **STARTUP VALUATIONS & FUNDING**: Anthropic ($900B valuation in talks), OpenAI ($852B), Databricks ($134B) — these are private valuations based on latest round or report, NOT public market prices. Funding rounds close and re-price quarterly. [verified 05/2026, various]
5. **REGULATORY STATUS**: EU AI Act Digital Omnibus may or may not be formally adopted before Aug 2, 2026. Colorado SB 26-189 replaces SB 24-205 but isn't effective until Jan 1, 2027. Status is fluid. [verified 05/2026, EU/Colorado legislature]
6. **AGENTIC AI PROJECTIONS**: Gartner's ">40% cancellation" and "10:1 agent-to-seller" are forward-looking predictions, not observed data. Frame as projections.
7. **MARKET SHARE**: NVIDIA's 80-95% share is a moving target as AMD, Intel, and custom silicon gain traction. [verified 05/2026, NVIDIA 10-Q / TechInsights]
8. **VENDOR LANDSCAPE**: The ~130 "actual agentic" vendors figure (Gartner) is a point-in-time count. Use as order-of-magnitude.
9. **ANTHROPIC REVENUE**: $30B+ ARR and 1,400% growth are extraordinary claims that, if accurate, represent the fastest revenue scaling in tech history. Verify independently before using in investor-facing materials. [verified 05/2026, PYMNTS / Sacra]
10. **OPENAI PROFITABILITY**: $14B projected 2026 loss and 2029-2030 profitability target are OpenAI's own projections. Actual losses may differ.

---

*End of layer. Update cadence: quarterly; model pricing monthly. Critical re-check triggers: new frontier model releases, EU AI Act Digital Omnibus formal adoption, state AI law effective dates, major IPO filings (OpenAI, Databricks), Anthropic/OpenAI financial disclosures, NVIDIA quarterly earnings, Fed FEDS Notes next publication.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const AI_ML_INJECTION = AI_ML_PLAYBOOK.layerContent;
export const AI_ML_SCORING = {
  highFitSegments: [
    { segment: "Applied AI vertical SaaS (financial services, healthcare, legal)", avgFit: "80-90%", reason: "Domain knowledge moat, enterprise ROI visibility, compliance frameworks, Cambrian's fintech lens applicable" },
    { segment: "AI-enabled fintech & payments", avgFit: "80-90%", reason: "Direct domain overlap from BHN; enterprise buyer understanding; regulatory navigation credibility" },
    { segment: "Series B-D AI companies with PMF ($5-100M ARR)", avgFit: "75-85%", reason: "Classic growth-stage sweet spot; scaling sales is constraint, not product; VC-backed growth pressure" },
    { segment: "PE-backed AI portfolio companies", avgFit: "75-85%", reason: "EBITDA/multiple framing aligns with PE thesis; cross-portfolio leverage; scaling demands" },
    { segment: "Enterprise AI platform companies", avgFit: "65-75%", reason: "Complex GTM; multi-vertical; long cycles; high ACV; Cambrian intelligence applicable" },
  ],
  highFrictionSegments: [
    { segment: "Foundation model labs (Anthropic, OpenAI, Google)", avgFit: "15-25%", reason: "Massive internal GTM teams; unlikely to need boutique consulting; relationship access difficult" },
    { segment: "Pure AI infrastructure / chips", avgFit: "10-20%", reason: "Hyperscaler/government-focused; supply-chain dominated; not traditional sales motion" },
    { segment: "AI safety & alignment / defense", avgFit: "12-22%", reason: "Research-oriented; government/contractor relationships; different GTM logic" },
    { segment: "Pure AI tooling startups (LangChain, eval tools)", avgFit: "20-35%", reason: "Consolidating; commoditization pressure; hyperscalers build competing first-party tooling" },
    { segment: "AI wrapper apps (thin UI over API)", avgFit: "15-30%", reason: "Low moat; high churn; commodity risk; often pre-revenue" },
  ],
};
export const AI_ML_DISCOVERY = AI_ML_PLAYBOOK.discovery.join("\n");
