// src/data/aiMlKnowledge.js
//
// AI/ML market deep knowledge layer.
// Covers: foundation models, infrastructure, applied AI, enterprise
// adoption, model economics, regulatory, vertical markets, GTM.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const AI_ML_INJECTION = `
AI/ML MARKET CONTEXT (use when target or seller is in AI, machine learning, or applied intelligence):

MARKET STRUCTURE: Five layers — foundation models (Anthropic, OpenAI, Google, Meta), compute/infrastructure (NVIDIA 80-95% AI chip share), inference APIs, tooling/orchestration, and applied AI. Value concentrates at extremes: frontier labs and top-of-stack applied companies. Middle layers commoditizing.

FOUNDATION MODELS: Anthropic has surpassed OpenAI in enterprise LLM revenue share (~40% vs 27%, early 2026) driven by coding leadership (54% coding share). Model releases compressed from quarterly to monthly. Competitive dimensions: capability-per-dollar, task specialization (coding, reasoning, multimodal have different leaders), infrastructure access. Frontier labs: Anthropic, OpenAI, Google DeepMind, xAI, Meta. International: Mistral, DeepSeek, Zhipu, Alibaba Qwen compete on cost/reasoning.

INFRASTRUCTURE: Compute is binding constraint, not chips. Hyperscalers committing $300B+ combined capex. Power and grid interconnect are critical. NVIDIA dominates training/inference; AMD gaining; custom silicon (Google TPU, AWS Trainium, Meta MTIA) and neoclouds (CoreWeave, Crusoe, Lambda) create options.

ENTERPRISE ADOPTION: Enterprises prefer buying over building applied AI. PLG dynamics stronger than typical enterprise software — adoption flows from individual contributors into team/enterprise expansion. Engineering leads (coding tools), then support, marketing, sales, legal/finance/HR. AI council gates increasingly common. Friction: data residency, PII, liability, hallucination tolerance, vendor concentration, model versioning. Enterprise deals: 6-18 months.

MODEL ECONOMICS: Token prices collapsed 99% since 2022 for equivalent capability. Current: frontier $3-15/M input, $15-75/M output; mid-tier $0.15-3 input; open-weight self-hosted <$0.10-0.50. Many AI apps have near-zero or negative gross margins because token costs exceed prices on heavy users. Structural bet: model costs fall faster than competitive price compression.

REGULATORY: EU AI Act phased implementation. US lacks federal law but state patchwork real (CA, CO, NY). NIST AI RMF. SEC scrutiny on AI claims. Enterprise risk: hallucination, prompt injection, data exfiltration, bias, IP liability.

APPLIED AI BY VERTICAL: Coding most mature (15%+ velocity gains). Customer support deflection 20-60% tier-1. Healthcare ambient documentation crossed chasm (Abridge, DAX). Legal contract AI, financial document research, construction/retail copilots growing. Vertical SaaS + AI is fastest-growing category.

GTM DYNAMICS: Champion-led procurement common (IC discovers tool, expands). Evaluation complexity high — companies run evals on real workloads, not benchmarks. Cost-per-token no longer primary; total cost of intelligence dominates. Model churn risk real (deprecations break apps). Applied AI pricing trending toward outcome-based for agents.
`;

export const AI_ML_SCORING = {
  highFitSegments: [
    { segment: "Applied AI vertical SaaS (financial services, healthcare, legal)", avgFit: "85-95%", reason: "Domain knowledge moat, enterprise ROI visibility, compliance frameworks, Cambrian's fintech lens applicable" },
    { segment: "Series B-D AI companies with PMF ($5-100M ARR)", avgFit: "80-92%", reason: "Classic growth-stage sweet spot; scaling sales is constraint, not product; VC-backed growth pressure" },
    { segment: "AI-enabled fintech & payments", avgFit: "82-94%", reason: "Direct domain overlap from BHN; enterprise buyer understanding; regulatory navigation credibility" },
    { segment: "PE-backed AI portfolio companies", avgFit: "78-88%", reason: "EBITDA/multiple framing aligns with PE thesis; cross-portfolio leverage; scaling demands" },
  ],
  highFrictionSegments: [
    { segment: "Foundation model labs (Anthropic, OpenAI, Google)", avgFit: "15-25%", reason: "Research-driven, not GTM-driven; capital-raise cycles dominate; different operating model" },
    { segment: "Pure AI infrastructure / chips", avgFit: "10-20%", reason: "Hyperscaler/government-focused; supply-chain dominated; not traditional sales motion" },
    { segment: "AI safety & alignment / defense", avgFit: "12-22%", reason: "Research-oriented; government/contractor relationships; different GTM logic" },
    { segment: "Pure AI tooling startups (LangChain, eval tools)", avgFit: "20-35%", reason: "Consolidating; commoditization pressure; hyperscalers build competing first-party tooling" },
  ],
};

export const AI_ML_DISCOVERY = `
AI/ML DISCOVERY (use when prospect is an AI company or selling AI products):

REALITY:
- Which model(s) does your product use? How does cost-per-task trend month-over-month?
- What's your token cost as a percentage of revenue? Where do you project it to stabilize?

IMPACT:
- How do enterprise deals flow — bottom-up from users or top-down from procurement? Time from signup to $50K ACV?
- Where do enterprise deals stall: security review, data residency, procurement, or integration?

VISION:
- What's your current NRR? Driven by usage expansion, seat expansion, upsell, or net new use cases?
- How are you handling model layer churn (provider deprecations, pricing changes)?

ENTRY POINTS:
- What's your gross margin? Where will it land once scaled? Is token cost the constraint or pricing power?
- How is sales distributed — direct, channel/marketplace, or product-led? Highest-margin channel?

ROUTE:
- Which customer cohorts have highest retention risk — non-AI-native, specific verticals, or use cases?
- Are there motion gaps (CS, expansion sales, technical sales) creating bottlenecks?
`;
