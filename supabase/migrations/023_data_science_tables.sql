-- Migration 023: Data science tables — structured, queryable, model-trainable
-- Run in Supabase SQL Editor.
--
-- These tables are designed for a data scientist to build predictive models.
-- Every row is a labeled observation with structured features and outcomes.

-- ═══════════════════════════════════════════════════════════════
-- TABLE 1: prospect_events — the core training dataset
-- Every interaction with a prospect is a labeled event.
-- A data scientist can train: "given these features, predict deal outcome"
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.prospect_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Who
  org_id uuid REFERENCES orgs(id),
  user_id text NOT NULL,
  seller_url text,
  market_category text,

  -- Prospect features (structured columns, not JSON)
  prospect_name text NOT NULL,
  prospect_domain text,
  prospect_industry text,
  prospect_size_band text,           -- "1-49", "50-499", "500-4999", "5000-49999", "50000+"
  prospect_revenue_band text,        -- "<$10M", "$10M-$100M", "$100M-$1B", "$1B-$10B", "$10B+"
  prospect_ownership text,           -- "public", "private", "pe-backed", "vc-backed", "bootstrapped"
  prospect_geography text,

  -- Scoring features (the model's prediction + factors)
  fit_score int,
  fit_label text,                    -- "Strong Fit", "Potential Fit", "Poor Fit"
  dim1_icp int,
  dim2_similarity int,
  dim3_competitive int,
  best_lob text,                     -- which seller LOB matched
  closest_customer text,             -- most similar named customer
  is_competitor_customer boolean DEFAULT false,  -- was this prospect sourced from competitor intel?
  competitor_name text,              -- which competitor's customer list

  -- Event (the label — what the user DID)
  event_type text NOT NULL,          -- enum below
  -- "generated"    = appeared in Build Target Accounts list
  -- "imported"     = uploaded via CSV
  -- "viewed"       = user clicked to review (weak positive)
  -- "briefed"      = user built a research brief (positive)
  -- "hypothesis"   = user generated RIVER hypothesis (stronger positive)
  -- "called"       = user entered live call stage (strong positive)
  -- "pushed_crm"   = user pushed to HubSpot (strong positive)
  -- "advanced"     = post-call: Fast Track (strongest positive)
  -- "nurture"      = post-call: Nurture (neutral)
  -- "disqualified" = post-call: Disqualify or manual DQ (negative)
  -- "rejected"     = user removed from list without briefing (negative)
  -- "edited_score" = user added intel adjustment (correction signal)
  -- "edited_field" = user edited a brief field (model error signal)

  -- Outcome (filled in later if known)
  deal_route text,                   -- "FAST_TRACK", "NURTURE", "DISQUALIFY"
  deal_confidence int,               -- 0-100 post-call confidence score

  -- Context
  session_id uuid,
  brief_sections_complete int,       -- how many of 10 sections populated
  kl_versions text[],                -- which knowledge layers were active

  -- Temporal
  created_at timestamptz DEFAULT now()
);

-- Indexes for model training queries
CREATE INDEX idx_pe_org ON prospect_events(org_id);
CREATE INDEX idx_pe_category ON prospect_events(market_category);
CREATE INDEX idx_pe_event ON prospect_events(event_type);
CREATE INDEX idx_pe_industry ON prospect_events(prospect_industry);
CREATE INDEX idx_pe_score ON prospect_events(fit_score);
CREATE INDEX idx_pe_time ON prospect_events(created_at);
CREATE INDEX idx_pe_outcome ON prospect_events(deal_route);
CREATE INDEX idx_pe_competitor ON prospect_events(is_competitor_customer);

-- RLS
ALTER TABLE public.prospect_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.prospect_events FOR ALL TO service_role USING (true);
CREATE POLICY "Users insert own" ON public.prospect_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- ═══════════════════════════════════════════════════════════════
-- TABLE 2: model_accuracy_log — tracks prediction vs outcome
-- A data scientist uses this to measure and improve model quality.
-- "We predicted Strong Fit (82%) → user advanced the deal. Score +1."
-- "We predicted Strong Fit (78%) → user DQ'd. Score -1. Why?"
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.model_accuracy_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  org_id uuid,
  market_category text,

  -- Prediction
  prospect_name text NOT NULL,
  predicted_score int,
  predicted_label text,

  -- Outcome
  actual_outcome text NOT NULL,      -- "advanced", "nurture", "disqualified", "rejected", "no_action"
  outcome_confidence int,            -- 0-100

  -- Delta
  prediction_correct boolean,        -- did the prediction match the outcome?
  -- Strong Fit + advanced = correct
  -- Strong Fit + disqualified = incorrect
  -- Poor Fit + rejected = correct
  -- Poor Fit + advanced = incorrect (model undervalued)

  -- Features at prediction time (snapshot for model versioning)
  dim1 int,
  dim2 int,
  dim3 int,
  best_lob text,
  closest_customer text,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mal_category ON model_accuracy_log(market_category);
CREATE INDEX idx_mal_correct ON model_accuracy_log(prediction_correct);
CREATE INDEX idx_mal_time ON model_accuracy_log(created_at);

ALTER TABLE public.model_accuracy_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.model_accuracy_log FOR ALL TO service_role USING (true);

-- ═══════════════════════════════════════════════════════════════
-- TABLE 3: seller_profiles — aggregated seller intelligence
-- One row per seller, updated as they use the platform.
-- A data scientist uses this for cross-seller pattern matching.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  org_id uuid UNIQUE REFERENCES orgs(id),
  seller_url text,
  market_category text,
  seller_stage text,                 -- "Bootstrapped", "Series A", etc.

  -- Aggregated metrics (updated periodically)
  total_briefs int DEFAULT 0,
  total_prospects_scored int DEFAULT 0,
  total_deals_advanced int DEFAULT 0,
  total_deals_dq int DEFAULT 0,
  avg_fit_score_advanced numeric,    -- avg score of prospects that advanced
  avg_fit_score_dq numeric,          -- avg score of prospects that were DQ'd

  -- ICP characteristics (for cross-seller matching)
  primary_industries text[],         -- from ICP
  company_size_target text,
  lob_count int,                     -- number of lines of business
  named_customer_count int,

  -- Model quality
  prediction_accuracy numeric,       -- % of predictions that matched outcomes
  last_calibrated_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_sp_category ON seller_profiles(market_category);
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.seller_profiles FOR ALL TO service_role USING (true);

-- ═══════════════════════════════════════════════════════════════
-- VIEWS for data science queries
-- ═══════════════════════════════════════════════════════════════

-- Conversion funnel per market category
CREATE OR REPLACE VIEW public.v_conversion_funnel AS
SELECT
  market_category,
  COUNT(*) FILTER (WHERE event_type = 'generated') AS generated,
  COUNT(*) FILTER (WHERE event_type = 'viewed') AS viewed,
  COUNT(*) FILTER (WHERE event_type = 'briefed') AS briefed,
  COUNT(*) FILTER (WHERE event_type = 'pushed_crm') AS pushed,
  COUNT(*) FILTER (WHERE event_type = 'advanced') AS advanced,
  COUNT(*) FILTER (WHERE event_type = 'disqualified') AS disqualified,
  ROUND(COUNT(*) FILTER (WHERE event_type = 'advanced')::numeric /
    NULLIF(COUNT(*) FILTER (WHERE event_type = 'briefed'), 0) * 100, 1) AS brief_to_advance_pct
FROM public.prospect_events
GROUP BY market_category;

-- Score accuracy by market category
CREATE OR REPLACE VIEW public.v_score_accuracy AS
SELECT
  market_category,
  predicted_label,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE prediction_correct) AS correct,
  ROUND(COUNT(*) FILTER (WHERE prediction_correct)::numeric / COUNT(*) * 100, 1) AS accuracy_pct,
  ROUND(AVG(predicted_score), 1) AS avg_score
FROM public.model_accuracy_log
GROUP BY market_category, predicted_label;

-- Feature importance: which features correlate most with advancement
CREATE OR REPLACE VIEW public.v_feature_correlation AS
SELECT
  prospect_industry,
  prospect_size_band,
  prospect_ownership,
  is_competitor_customer,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE deal_route = 'FAST_TRACK') AS advanced,
  ROUND(COUNT(*) FILTER (WHERE deal_route = 'FAST_TRACK')::numeric /
    NULLIF(COUNT(*), 0) * 100, 1) AS advance_rate_pct,
  ROUND(AVG(fit_score), 1) AS avg_fit_score
FROM public.prospect_events
WHERE deal_route IS NOT NULL
GROUP BY prospect_industry, prospect_size_band, prospect_ownership, is_competitor_customer
HAVING COUNT(*) >= 5;
