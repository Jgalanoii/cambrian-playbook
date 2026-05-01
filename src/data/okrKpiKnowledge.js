// src/data/okrKpiKnowledge.js
//
// OKRs, KPIs, and Measurement Architecture.
// Cross-cutting layer — applies to ALL B2B prospects.
// Covers: OKR framework, KPI architecture, revenue/sales/marketing/CS
// metrics, dashboard design, reporting cadence.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).

export const OKR_KPI_INJECTION = `
OKR & KPI MEASUREMENT CONTEXT (cross-cutting — apply to ALL B2B prospects):

OKR FRAMEWORK: Objectives (qualitative) + Key Results (2-5 quantitative measures each). 3-5 company-level OKRs annually, reviewed quarterly. 70% hit rate is healthy (stretch, not sandbag). Cascade: company → function → team. Failures: KRs that are activities not outcomes, too many OKRs (15+ vs 3-5), sandbagging when tied to comp.

KPI ARCHITECTURE: KPIs persist across quarters (unlike OKRs which reset). Leading indicators predict (pipeline coverage, adoption, health score); lagging indicators measure (revenue, churn, win rate). Input metrics = activities team controls; output metrics = results. Teams watching only lagging indicators are reactive.

REVENUE METRICS:
- ARR: headline metric; Y/Y growth rate determines valuation multiple
- NRR: most predictive for long-term value; >110% healthy, >120% best-in-class
- Pipeline coverage: 3-5x quota; low coverage predicts forecast misses
- Velocity: stage conversion rates + cycle time; instability signals process dysfunction
- CAC payback: <12mo SMB, <18mo mid-market, <24mo enterprise
- LTV:CAC: 3:1+ healthy, 4:1+ best-in-class

SALES METRICS:
- Quota attainment distribution: if only top 20% hit quota, quota math or territory is broken
- Win rate: 20-35% typical; if 50%+, qualification too loose or pricing too low
- ASP trend: reveals value capture improving or discounting eroding margins
- Discount rate: rising + stable win rate = high price elasticity
- Cycle time by stage: reveals where deals get stuck

MARKETING METRICS:
- MQL→SQL conversion: <20% = poor lead quality or overly tight qualification
- CAC by channel: drives channel mix decisions
- Channel contribution margin (CM): better decision input than attribution alone

CS METRICS:
- NRR: primary CS metric; >110% healthy, >120% best-in-class
- GRR (gross retention): >85% indicates low churn
- Health score: composite (usage, adoption, engagement, outcomes); should predict churn 90+ days ahead
- Cohort analysis: reveals truth aggregates hide — newer cohorts show adverse selection

DASHBOARDS: CEO weekly = 5-8 KPIs. Functional leader = 10-15. Board quarterly = strategic outcomes. Show trends (13-26 weeks), not snapshots. Include targets + variance. A metric without an owner doesn't drive action.
`;

export const OKR_KPI_DISCOVERY = `
OKR & KPI DISCOVERY (apply to ANY B2B prospect):
- What are your top 3-5 KPIs at the company level? How much operating attention actually goes to them?
- Can you show me a cohort analysis — how do retention and expansion vary between best and worst cohorts?
- What's your channel-level contribution margin? Do you have visibility into which channels have negative unit economics?
- What leading indicators predict churn or missed revenue before lagging indicators show the problem?
- If your CFO and CRO sat here independently, would they report the same ARR, pipeline, and quota attainment numbers?
`;
