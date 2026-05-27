-- Migration 025: RFP intelligence signals — procurement data science layer
-- Run in Supabase SQL Editor.
--
-- Captures every RFP search result and buying signal for:
-- 1. Signal quality analysis (which sources produce actionable RFPs?)
-- 2. Conversion tracking (did an RFP lead to a brief → call → deal?)
-- 3. Source ROI (which procurement databases yield the best matches?)
-- 4. Accuracy auditing (were the RFPs real? Did the user follow up?)
-- 5. Pattern detection (which industries/categories have most active procurement?)

-- ═══════════════════════════════════════════════════════════════
-- TABLE: rfp_intel_signals — every RFP and buying signal surfaced
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.rfp_intel_signals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid,
  user_id text NOT NULL,
  seller_url text,
  market_category text,

  -- Search context
  search_stage text NOT NULL,            -- "icp_level" | "account_level"
  search_type text NOT NULL,             -- "open_rfp" | "closed_rfp" | "buying_signal"

  -- RFP/Signal content
  title text NOT NULL,
  buyer text,
  source text,                           -- "SAM.gov", "Ariba", "TED", "news", "earnings call", etc.
  source_url text,
  is_government boolean DEFAULT false,
  value_estimate text,                   -- "$500K-$2M", "Value not disclosed", etc.
  deadline text,                         -- YYYY-MM-DD or null
  award_date text,                       -- for closed RFPs
  awarded_to text,                       -- for closed RFPs — incumbent intel

  -- Signal-specific fields
  signal_type text,                      -- "Modernization Announcement", "Budget Authorization", etc.
  signal_strength text,                  -- "Strong" | "Moderate" | "Early"
  signal_detail text,                    -- 2-3 sentence explanation

  -- Relevance scoring
  relevance_score int,                   -- 0-100
  relevance_reason text,                 -- why this matches the seller
  cohort text,                           -- industry grouping
  naics_code text,                       -- NAICS code if available
  cpv_code text,                         -- CPV code if available (EU)

  -- User engagement (did they ACT on this signal?)
  clicked boolean DEFAULT false,         -- did they click the source URL?
  led_to_brief boolean DEFAULT false,    -- did they build a brief for this buyer?
  led_to_hubspot boolean DEFAULT false,  -- did they push the buyer to HubSpot?
  user_dismissed boolean DEFAULT false,  -- did they mark as irrelevant?
  user_confirmed boolean DEFAULT false,  -- did they mark as verified/relevant?

  -- Model tracking
  model_used text,                       -- which AI model generated this result
  search_tokens_used int,                -- total tokens for this search
  web_searches_used int,                 -- how many web searches

  -- Temporal
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ris_stage ON rfp_intel_signals(search_stage, search_type);
CREATE INDEX idx_ris_buyer ON rfp_intel_signals(buyer);
CREATE INDEX idx_ris_source ON rfp_intel_signals(source);
CREATE INDEX idx_ris_category ON rfp_intel_signals(market_category);
CREATE INDEX idx_ris_relevance ON rfp_intel_signals(relevance_score DESC);
CREATE INDEX idx_ris_engagement ON rfp_intel_signals(clicked, led_to_brief, led_to_hubspot);
CREATE INDEX idx_ris_signal_type ON rfp_intel_signals(signal_type) WHERE search_type = 'buying_signal';
ALTER TABLE public.rfp_intel_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full" ON public.rfp_intel_signals FOR ALL TO service_role USING (true);
CREATE POLICY "Users insert own" ON public.rfp_intel_signals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users read own org" ON public.rfp_intel_signals FOR SELECT TO authenticated USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));

-- ═══════════════════════════════════════════════════════════════
-- ANALYTICS VIEWS for RFP intelligence
-- ═══════════════════════════════════════════════════════════════

-- RFP source effectiveness — which sources produce results users act on?
CREATE OR REPLACE VIEW public.v_rfp_source_effectiveness AS
SELECT
  source,
  search_type,
  COUNT(*) AS total_results,
  ROUND(AVG(relevance_score), 1) AS avg_relevance,
  COUNT(*) FILTER (WHERE clicked) AS clicked,
  COUNT(*) FILTER (WHERE led_to_brief) AS led_to_brief,
  COUNT(*) FILTER (WHERE led_to_hubspot) AS led_to_crm,
  COUNT(*) FILTER (WHERE user_confirmed) AS user_confirmed,
  COUNT(*) FILTER (WHERE user_dismissed) AS user_dismissed,
  ROUND(COUNT(*) FILTER (WHERE led_to_brief)::numeric / NULLIF(COUNT(*), 0) * 100, 1) AS brief_conversion_pct
FROM public.rfp_intel_signals
GROUP BY source, search_type
ORDER BY total_results DESC;

-- Signal type effectiveness — which buying signals lead to action?
CREATE OR REPLACE VIEW public.v_signal_type_effectiveness AS
SELECT
  signal_type,
  signal_strength,
  COUNT(*) AS total_signals,
  ROUND(AVG(relevance_score), 1) AS avg_relevance,
  COUNT(*) FILTER (WHERE led_to_brief) AS led_to_brief,
  COUNT(*) FILTER (WHERE led_to_hubspot) AS led_to_crm,
  ROUND(COUNT(*) FILTER (WHERE led_to_brief)::numeric / NULLIF(COUNT(*), 0) * 100, 1) AS action_rate_pct
FROM public.rfp_intel_signals
WHERE search_type = 'buying_signal'
GROUP BY signal_type, signal_strength
ORDER BY action_rate_pct DESC;

-- RFP intel by market category — where does procurement intelligence concentrate?
CREATE OR REPLACE VIEW public.v_rfp_by_category AS
SELECT
  market_category,
  COUNT(*) AS total_intel,
  COUNT(*) FILTER (WHERE search_type = 'open_rfp') AS open_rfps,
  COUNT(*) FILTER (WHERE search_type = 'closed_rfp') AS closed_rfps,
  COUNT(*) FILTER (WHERE search_type = 'buying_signal') AS signals,
  COUNT(*) FILTER (WHERE is_government) AS government,
  COUNT(*) FILTER (WHERE NOT is_government) AS commercial,
  ROUND(AVG(relevance_score), 1) AS avg_relevance,
  COUNT(*) FILTER (WHERE led_to_brief) AS action_taken
FROM public.rfp_intel_signals
GROUP BY market_category
ORDER BY total_intel DESC;

-- ICP-level vs Account-level search effectiveness
CREATE OR REPLACE VIEW public.v_rfp_stage_comparison AS
SELECT
  search_stage,
  COUNT(*) AS total_results,
  ROUND(AVG(relevance_score), 1) AS avg_relevance,
  COUNT(*) FILTER (WHERE led_to_brief) AS led_to_brief,
  COUNT(*) FILTER (WHERE user_confirmed) AS user_confirmed,
  COUNT(*) FILTER (WHERE user_dismissed) AS user_dismissed,
  ROUND(COUNT(*) FILTER (WHERE led_to_brief)::numeric / NULLIF(COUNT(*), 0) * 100, 1) AS conversion_pct
FROM public.rfp_intel_signals
GROUP BY search_stage;
