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

FOUNDATION MODELS: Enterprise LLM market consolidating around top 3-4 providers. Anthropic, OpenAI, and Google DeepMind lead enterprise adoption; each has strengths in different task categories (coding, reasoning, multimodal). Model releases compressed from quarterly to monthly. Competitive dimensions: capability-per-dollar, task specialization, infrastructure access, enterprise trust. Frontier labs: Anthropic, OpenAI, Google DeepMind, xAI, Meta. International: Mistral, DeepSeek, Zhipu, Alibaba Qwen compete on cost/reasoning.

INFRASTRUCTURE: Compute is binding constraint, not chips. Hyperscalers committing $300B+ combined capex. Power and grid interconnect are critical. NVIDIA dominates training/inference; AMD gaining; custom silicon (Google TPU, AWS Trainium, Meta MTIA) and neoclouds (CoreWeave, Crusoe, Lambda) create options.

ENTERPRISE ADOPTION (Q2 2026 REFRESH — Federal Reserve benchmarks):
- ~18% of U.S. firms have adopted AI as of year-end 2025 (Census BTOS) — firm-count, not employee-weighted
- Work-related GenAI adoption per individuals: ~41% as of Nov 2025 (Real-Time Population Survey)
- By sector: financial 63%, professional services 62%, manufacturing 58% (fastest YoY growth)
- Financial services AI adoption growing at 127% YoY through Sept 2025 — fastest of any sector
- 88% of organizations report regular AI use in at least one business function (McKinsey State of AI 2025)
- 71%+ use generative AI specifically in at least one function
- AI tools reach 378M people worldwide in 2025; 64M new users added
- AI coding assistants now write ~41% of all code; 50% of developers use AI tools daily
- Total enterprise GenAI spend: $37B in 2025, up from $1.7B in 2023
- Vertical AI investment 2025 (Menlo Ventures): healthcare $1.5B (43% of vertical AI), legal $650M, creator tools $360M, government $350M. Total vertical AI: $3.5B (3x the 2024 figure)
- Only ~6% of respondents qualify as "AI high performers" (5%+ EBIT impact attributable to AI per McKinsey QuantumBlack). High performers 3x+ more likely to scale AI agents across multiple functions
- 87% of sales leaders report board/CEO pressure to deploy gen AI
- Deloitte Q4 2025: by function — IT 28%, Operations 11%, Marketing 10%, Customer Service 8%, Cybersecurity 8%, Sales 5%. Regulatory compliance now #1 deployment blocker (38%, up from 28%)

Enterprises prefer buying over building applied AI. PLG dynamics stronger than typical enterprise software — adoption flows from individual contributors into team/enterprise expansion. Engineering leads (coding tools), then support, marketing, sales, legal/finance/HR. AI council gates increasingly common. Friction: data residency, PII, liability, hallucination tolerance, vendor concentration, model versioning. Enterprise deals: 6-18 months.

THE AGENTIC AI REALITY CHECK:
- Gartner (June 2025): >40% of agentic AI projects will be canceled by end of 2027 due to escalating costs, unclear business value, and inadequate risk controls. Of thousands of vendors marketing "AI agent" capabilities, only ~130 have actual agentic functionality. THIS IS THE SINGLE MOST IMPORTANT COUNTERWEIGHT CITATION.
- Gartner (Nov 2025): By 2028, AI agents will outnumber human sellers 10:1, yet fewer than 40% of sellers will report agents improved their productivity. Rare "ubiquitous adoption + majority dissatisfaction" in a single forecast.
- Gartner (Aug 2025): By 2030, 75% of B2B buyers will prefer sales experiences that prioritize human interaction over AI. Counters AI-maximalist narratives.
- Gen AI delivers reliable narrow-task productivity (research, drafting, summarization, lead enrichment) but agentic deployments are failing at high rates. The critical buyer-education job: distinguish "gen AI applied to a useful task" from "AI agent claiming autonomous selling."

MODEL ECONOMICS: Token prices collapsed 99% since 2022 for equivalent capability. Current: frontier $3-15/M input, $15-75/M output; mid-tier $0.15-3 input; open-weight self-hosted <$0.10-0.50. Many AI apps have near-zero or negative gross margins because token costs exceed prices on heavy users. Structural bet: model costs fall faster than competitive price compression.

REGULATORY: EU AI Act phased implementation. US lacks federal law but state patchwork real (CA, CO, NY). NIST AI RMF. SEC scrutiny on AI claims. Enterprise risk: hallucination, prompt injection, data exfiltration, bias, IP liability.

APPLIED AI BY VERTICAL: Coding most mature (15%+ velocity gains). Customer support deflection 20-60% tier-1. Healthcare ambient documentation crossed chasm ($600M spend — largest single category). Legal contract AI, financial document research, construction/retail copilots growing. Vertical SaaS + AI is fastest-growing category and highest-multiple category in SaaS market.

FEDERAL RESERVE FEDS NOTES — CANONICAL AI ADOPTION SOURCE (April 3, 2026, Jeffrey S. Allen):
This is the most credible single dataset for cross-vertical AI adoption benchmarking. Published at federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html. Should be the primary citation for adoption baselines; use Menlo Ventures for vertical AI investment dollars; use Gartner for the agentic cancellation counterweight. Next refresh expected fall 2026 with Q3 data. Key methodology notes: Census BTOS for firm-level adoption (methodological change in late 2025 — adoption rate grew 68% YoY through Sept 2025 before change); Real-Time Population Survey for individual adoption; Survey of Business Uncertainty for senior-leader integration. Financial sector is the only sector that did not show deceleration around Q2 2025.

GTM DYNAMICS: Champion-led procurement common (IC discovers tool, expands). Evaluation complexity high — companies run evals on real workloads, not benchmarks. Cost-per-token no longer primary; total cost of intelligence dominates. Model churn risk real (deprecations break apps). Applied AI pricing trending toward outcome-based for agents. 95% of seller research workflows projected to begin with AI by 2027 (vs <20% in 2024). Marketing/sales remains the function with highest reported revenue impact from AI use.
`;

export const AI_ML_SCORING = {
  highFitSegments: [
    { segment: "Applied AI vertical SaaS (financial services, healthcare, legal)", avgFit: "80-90%", reason: "Domain knowledge moat, enterprise ROI visibility, compliance frameworks, Cambrian's fintech lens applicable" },
    { segment: "AI-enabled fintech & payments", avgFit: "80-90%", reason: "Direct domain overlap from BHN; enterprise buyer understanding; regulatory navigation credibility" },
    { segment: "Series B-D AI companies with PMF ($5-100M ARR)", avgFit: "75-85%", reason: "Classic growth-stage sweet spot; scaling sales is constraint, not product; VC-backed growth pressure" },
    { segment: "PE-backed AI portfolio companies", avgFit: "75-85%", reason: "EBITDA/multiple framing aligns with PE thesis; cross-portfolio leverage; scaling demands" },
  ],
  highFrictionSegments: [
    { segment: "Foundation model labs (Anthropic, OpenAI, Google)", avgFit: "15-25%", reason: "Massive internal GTM teams; unlikely to need boutique consulting; relationship access difficult" },
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
