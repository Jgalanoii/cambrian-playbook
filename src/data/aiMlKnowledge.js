// src/data/aiMlKnowledge.js
//
// Version: 1.0.0
// Last verified: 2026-05-19
// Next review: 2026-08-19 (quarterly)
//
// AI/ML market deep knowledge layer.
// Covers: foundation models, infrastructure, applied AI, enterprise
// adoption, model economics, regulatory, vertical markets, GTM.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   1. Census Bureau BTOS (Business Trends and Outlook Survey) — https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html
//   2. Federal Reserve FEDS Notes (Jeffrey S. Allen, April 2026) — https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
//   3. McKinsey Global Survey: State of AI in early 2025 — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
//   4. Menlo Ventures: The State of Generative AI in the Enterprise 2025 — https://menlovc.com/2025-the-state-of-generative-ai-in-the-enterprise/
//   5. Gartner Press Releases (Agentic AI forecasts, 2025) — https://www.gartner.com/en/newsroom
//   6. Deloitte State of Generative AI in the Enterprise Q4 2025 — https://www.deloitte.com/us/en/insights/industry/technology/digital-transformation/generative-ai-enterprise-adoption.html
//   7. NVIDIA quarterly filings / market share estimates — https://investor.nvidia.com/
//   8. Hyperscaler capex aggregation (Alphabet, Amazon, Microsoft, Meta 10-Qs) — respective SEC filings
//   9. Salesforce State of Sales 2025 — https://www.salesforce.com/resources/research-reports/state-of-sales/
//   10. GitHub / Stack Overflow Developer Survey 2025 — https://survey.stackoverflow.co/2025
//   11. Similarweb / Writerbuddy AI traffic analysis 2025 — https://writerbuddy.ai/blog/ai-industry-analysis
//   12. Stanford HAI AI Index 2025 — https://aiindex.stanford.edu/report/
//   13. Gartner Hype Cycle for AI in Sales, Aug 2025 — https://www.gartner.com/en/sales/topics/ai-in-sales
//   14. Real-Time Population Survey (Census/BLS) — https://www.census.gov/data/experimental-data-products/real-time-population-survey.html
//

export const AI_ML_INJECTION = `
AI/ML MARKET CONTEXT (use when target or seller is in AI, machine learning, or applied intelligence):

MARKET STRUCTURE: Five layers — foundation models (Anthropic, OpenAI, Google, Meta), compute/infrastructure (NVIDIA 80-95% AI chip share [verified 05/2026, NVIDIA 10-Q / TechInsights]), inference APIs, tooling/orchestration, and applied AI. Value concentrates at extremes: frontier labs and top-of-stack applied companies. Middle layers commoditizing.

FOUNDATION MODELS: Enterprise LLM market consolidating around top 3-4 providers. Anthropic, OpenAI, and Google DeepMind lead enterprise adoption; each has strengths in different task categories (coding, reasoning, multimodal). Model releases compressed from quarterly to monthly. Competitive dimensions: capability-per-dollar, task specialization, infrastructure access, enterprise trust. Frontier labs: Anthropic, OpenAI, Google DeepMind, xAI, Meta. International: Mistral, DeepSeek, Zhipu, Alibaba Qwen compete on cost/reasoning.

INFRASTRUCTURE: Compute is binding constraint, not chips. Hyperscalers committing $300B+ combined capex [verified 05/2026, Alphabet/Amazon/Microsoft/Meta 10-Qs]. Power and grid interconnect are critical. NVIDIA dominates training/inference; AMD gaining; custom silicon (Google TPU, AWS Trainium, Meta MTIA) and neoclouds (CoreWeave, Crusoe, Lambda) create options.

ENTERPRISE ADOPTION (Q2 2026 REFRESH — Federal Reserve benchmarks):
- ~18% of U.S. firms have adopted AI as of year-end 2025 (Census BTOS) — firm-count, not employee-weighted [verified 05/2026, Census BTOS via Fed FEDS Notes]
- Work-related GenAI adoption per individuals: ~41% as of Nov 2025 (Real-Time Population Survey) [verified 05/2026, Real-Time Population Survey via Fed FEDS Notes]
- By sector: financial 63%, professional services 62%, manufacturing 58% (fastest YoY growth) [verified 05/2026, Census BTOS via Fed FEDS Notes]
- Financial services AI adoption growing at 127% YoY through Sept 2025 — fastest of any sector [verified 05/2026, Census BTOS via Fed FEDS Notes]
- 88% of organizations report regular AI use in at least one business function (McKinsey State of AI 2025) [verified 05/2026, McKinsey Global Survey 2025]
- 71%+ use generative AI specifically in at least one function [verified 05/2026, McKinsey Global Survey 2025]
- AI tools reach 378M people worldwide in 2025; 64M new users added [verified 05/2026, Writerbuddy / Similarweb AI Traffic Analysis]
- AI coding assistants now write ~41% of all code; 50% of developers use AI tools daily [verified 05/2026, GitHub / Stack Overflow Developer Survey 2025]
- Total enterprise GenAI spend: $37B in 2025, up from $1.7B in 2023 [verified 05/2026, Menlo Ventures State of GenAI 2025]
- Vertical AI investment 2025 (Menlo Ventures): healthcare $1.5B (43% of vertical AI), legal $650M, creator tools $360M, government $350M. Total vertical AI: $3.5B (3x the 2024 figure) [verified 05/2026, Menlo Ventures State of GenAI 2025]
- Only ~6% of respondents qualify as "AI high performers" (5%+ EBIT impact attributable to AI per McKinsey QuantumBlack). High performers 3x+ more likely to scale AI agents across multiple functions [verified 05/2026, McKinsey QuantumBlack State of AI 2025]
- 87% of sales leaders report board/CEO pressure to deploy gen AI [verified 05/2026, Salesforce State of Sales 2025]
- Deloitte Q4 2025: by function — IT 28%, Operations 11%, Marketing 10%, Customer Service 8%, Cybersecurity 8%, Sales 5%. Regulatory compliance now #1 deployment blocker (38%, up from 28%) [verified 05/2026, Deloitte State of GenAI Q4 2025]

Enterprises prefer buying over building applied AI. PLG dynamics stronger than typical enterprise software — adoption flows from individual contributors into team/enterprise expansion. Engineering leads (coding tools), then support, marketing, sales, legal/finance/HR. AI council gates increasingly common. Friction: data residency, PII, liability, hallucination tolerance, vendor concentration, model versioning. Enterprise deals: 6-18 months.

THE AGENTIC AI REALITY CHECK:
- Gartner (June 2025): >40% of agentic AI projects will be canceled by end of 2027 due to escalating costs, unclear business value, and inadequate risk controls. Of thousands of vendors marketing "AI agent" capabilities, only ~130 have actual agentic functionality. THIS IS THE SINGLE MOST IMPORTANT COUNTERWEIGHT CITATION. [verified 05/2026, Gartner Press Release June 2025]
- Gartner (Nov 2025): By 2028, AI agents will outnumber human sellers 10:1, yet fewer than 40% of sellers will report agents improved their productivity. Rare "ubiquitous adoption + majority dissatisfaction" in a single forecast. [verified 05/2026, Gartner Hype Cycle for AI in Sales Nov 2025]
- Gartner (Aug 2025): By 2030, 75% of B2B buyers will prefer sales experiences that prioritize human interaction over AI. Counters AI-maximalist narratives. [verified 05/2026, Gartner Hype Cycle for AI in Sales Aug 2025]
- Gen AI delivers reliable narrow-task productivity (research, drafting, summarization, lead enrichment) but agentic deployments are failing at high rates. The critical buyer-education job: distinguish "gen AI applied to a useful task" from "AI agent claiming autonomous selling."

MODEL ECONOMICS: Token prices collapsed 99% since 2022 for equivalent capability [verified 05/2026, Stanford HAI AI Index 2025]. Current: frontier $3-15/M input, $15-75/M output; mid-tier $0.15-3 input; open-weight self-hosted <$0.10-0.50 [verified 05/2026, provider pricing pages]. Many AI apps have near-zero or negative gross margins because token costs exceed prices on heavy users. Structural bet: model costs fall faster than competitive price compression.

REGULATORY: EU AI Act phased implementation. US lacks federal law but state patchwork real (CA, CO, NY). NIST AI RMF. SEC scrutiny on AI claims. Enterprise risk: hallucination, prompt injection, data exfiltration, bias, IP liability.

APPLIED AI BY VERTICAL: Coding most mature (15%+ velocity gains) [verified 05/2026, GitHub / Stack Overflow Developer Survey 2025]. Customer support deflection 20-60% tier-1 [verified 05/2026, McKinsey Global Survey 2025]. Healthcare ambient documentation crossed chasm ($600M spend — largest single category) [verified 05/2026, Menlo Ventures State of GenAI 2025]. Legal contract AI, financial document research, construction/retail copilots growing. Vertical SaaS + AI is fastest-growing category and highest-multiple category in SaaS market.

FEDERAL RESERVE FEDS NOTES — CANONICAL AI ADOPTION SOURCE (April 3, 2026, Jeffrey S. Allen):
This is the most credible single dataset for cross-vertical AI adoption benchmarking. Published at federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html. Should be the primary citation for adoption baselines; use Menlo Ventures for vertical AI investment dollars; use Gartner for the agentic cancellation counterweight. Next refresh expected fall 2026 with Q3 data. Key methodology notes: Census BTOS for firm-level adoption (methodological change in late 2025 — adoption rate grew 68% YoY through Sept 2025 before change) [verified 05/2026, Census BTOS via Fed FEDS Notes]; Real-Time Population Survey for individual adoption; Survey of Business Uncertainty for senior-leader integration. Financial sector is the only sector that did not show deceleration around Q2 2025.

GTM DYNAMICS: Champion-led procurement common (IC discovers tool, expands). Evaluation complexity high — companies run evals on real workloads, not benchmarks. Cost-per-token no longer primary; total cost of intelligence dominates. Model churn risk real (deprecations break apps). Applied AI pricing trending toward outcome-based for agents. 95% of seller research workflows projected to begin with AI by 2027 (vs <20% in 2024) [verified 05/2026, Gartner Hype Cycle for AI in Sales Aug 2025]. Marketing/sales remains the function with highest reported revenue impact from AI use [verified 05/2026, McKinsey Global Survey 2025].

KNOWN TRAPS — DATA THAT GOES STALE FASTEST (flag for every quarterly sweep):
1. MODEL PRICING: Token prices change monthly or faster. Frontier pricing ($3-15/M input) and mid-tier pricing shift with every model release. Re-verify against provider pricing pages before every brief that references cost. [verified 05/2026, provider pricing pages]
2. ADOPTION RATES: Census BTOS methodology changed late 2025; YoY comparisons across the break are misleading [verified 05/2026, U.S. Census BTOS]. Fed FEDS Notes publishes ~2x/year; between publications, adoption figures are stale. Never extrapolate trends across methodology changes.
3. CAPABILITY CLAIMS: "AI writes X% of code" and "AI deflects X% of support tickets" are self-reported, vary wildly by company maturity, and vendors inflate them. Treat as directional ranges, not precise figures.
4. STARTUP VALUATIONS & FUNDING: Vertical AI investment totals (Menlo Ventures $3.5B) are calendar-year snapshots. Funding rounds close and re-price quarterly. Never cite a round size or valuation older than 90 days without re-checking. [verified 05/2026, Menlo Ventures State of GenAI 2025]
5. REGULATORY STATUS: EU AI Act timelines shift; US state laws (CA, CO, NY) pass or stall each legislative session. The "38% cite regulatory compliance as #1 blocker" figure will move with every Deloitte quarterly pulse [verified 05/2026, Deloitte State of GenAI Q4 2025]. Re-verify before any compliance-sensitive brief.
6. AGENTIC AI PROJECTIONS: Gartner's ">40% cancellation" and "10:1 agent-to-seller" forecasts are forward-looking predictions, not observed data. They carry Gartner's own uncertainty bands. Always frame as projections, never as current facts.
7. MARKET SHARE: NVIDIA's 80-95% AI chip share is a moving target as AMD, Intel, and custom silicon (TPU, Trainium, MTIA) gain traction. Re-verify with latest quarterly shipment data. [verified 05/2026, NVIDIA 10-Q / TechInsights]
8. VENDOR LANDSCAPE: The ~130 "actual agentic" vendors figure (Gartner) is a point-in-time count. The market adds and loses vendors monthly. Use as order-of-magnitude, not exact count.
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
