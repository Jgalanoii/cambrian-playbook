-- Migration 028: Account output persistence — queryable, accumulate-able AI outputs
-- Every brief, fit score, hypothesis, post-call, and executive result persisted.
-- Follows the same pattern as rfp_intel_signals (fire-and-forget, non-blocking).
--
-- Design: ONE table with output_type discriminator + extracted queryable columns
-- + full payload in data jsonb. Partial unique index ensures one "latest" per
-- (org, seller, target, type) while preserving version history.

CREATE TABLE IF NOT EXISTS public.account_outputs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid,
  user_id text NOT NULL,
  seller_url text,

  -- Target account
  target_company text NOT NULL,
  target_domain text,
  target_industry text,

  -- Output classification
  output_type text NOT NULL,  -- 'brief' | 'fit_score' | 'hypothesis' | 'discovery' | 'post_call' | 'executives' | 'solution_fit'
  output_version int DEFAULT 1,

  -- Extracted queryable columns (denormalized from data for analytics)
  fit_score int,
  fit_label text,
  dim1 int,
  dim2 int,
  dim3 int,
  deal_route text,
  deal_confidence int,
  data_confidence text,
  sections_completed int,

  -- Full output payload
  data jsonb NOT NULL,

  -- Lifecycle
  is_latest boolean DEFAULT true,
  superseded_at timestamptz,
  data_generated_at timestamptz DEFAULT now(),
  staleness_signals jsonb,

  created_at timestamptz DEFAULT now()
);

-- Partial unique index: only one "latest" per output type per account per seller
CREATE UNIQUE INDEX idx_ao_latest ON account_outputs (org_id, seller_url, target_company, output_type)
  WHERE is_latest = true;

-- Query indexes
CREATE INDEX idx_ao_target ON account_outputs (target_company);
CREATE INDEX idx_ao_seller ON account_outputs (seller_url);
CREATE INDEX idx_ao_type ON account_outputs (output_type);
CREATE INDEX idx_ao_latest_lookup ON account_outputs (seller_url, target_company, is_latest) WHERE is_latest = true;
CREATE INDEX idx_ao_user ON account_outputs (user_id);

-- RLS
ALTER TABLE public.account_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full" ON public.account_outputs FOR ALL TO service_role USING (true);
CREATE POLICY "Users insert own" ON public.account_outputs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users read own" ON public.account_outputs FOR SELECT TO authenticated USING (user_id = auth.uid()::text);
CREATE POLICY "Users update own" ON public.account_outputs FOR UPDATE TO authenticated USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

-- Analytics views

-- Output freshness by seller
CREATE OR REPLACE VIEW public.v_output_freshness AS
SELECT
  seller_url,
  target_company,
  output_type,
  data_generated_at,
  ROUND(EXTRACT(EPOCH FROM (now() - data_generated_at)) / 86400) AS age_days,
  CASE
    WHEN data_generated_at > now() - interval '30 days' THEN 'fresh'
    WHEN data_generated_at > now() - interval '90 days' THEN 'aging'
    ELSE 'stale'
  END AS freshness,
  fit_score,
  fit_label,
  deal_route,
  data_confidence,
  sections_completed
FROM public.account_outputs
WHERE is_latest = true
ORDER BY data_generated_at DESC;

-- Score distribution by seller
CREATE OR REPLACE VIEW public.v_score_distribution AS
SELECT
  seller_url,
  COUNT(*) AS total_scored,
  ROUND(AVG(fit_score), 1) AS avg_score,
  COUNT(*) FILTER (WHERE fit_score >= 75) AS strong_fit,
  COUNT(*) FILTER (WHERE fit_score >= 55 AND fit_score < 75) AS potential_fit,
  COUNT(*) FILTER (WHERE fit_score < 55) AS poor_fit,
  COUNT(*) FILTER (WHERE dim2 = 30) AS known_customers
FROM public.account_outputs
WHERE output_type = 'fit_score' AND is_latest = true
GROUP BY seller_url;

-- Brief completeness by seller
CREATE OR REPLACE VIEW public.v_brief_completeness AS
SELECT
  seller_url,
  COUNT(*) AS total_briefs,
  ROUND(AVG(sections_completed), 1) AS avg_sections,
  COUNT(*) FILTER (WHERE data_confidence = 'high') AS high_confidence,
  COUNT(*) FILTER (WHERE data_confidence = 'medium') AS medium_confidence,
  COUNT(*) FILTER (WHERE data_confidence = 'low') AS low_confidence
FROM public.account_outputs
WHERE output_type = 'brief' AND is_latest = true
GROUP BY seller_url;

-- Prospect funnel (requires prospect_events to be populated)
CREATE OR REPLACE VIEW public.v_prospect_funnel AS
SELECT
  ao.seller_url,
  ao.target_company,
  ao.fit_score,
  ao.fit_label,
  (SELECT MAX(ao2.data_generated_at) FROM account_outputs ao2 WHERE ao2.target_company = ao.target_company AND ao2.seller_url = ao.seller_url AND ao2.output_type = 'brief' AND ao2.is_latest = true) AS briefed_at,
  (SELECT ao3.deal_route FROM account_outputs ao3 WHERE ao3.target_company = ao.target_company AND ao3.seller_url = ao.seller_url AND ao3.output_type = 'post_call' AND ao3.is_latest = true) AS deal_route,
  ao.data_generated_at AS scored_at
FROM public.account_outputs ao
WHERE ao.output_type = 'fit_score' AND ao.is_latest = true
ORDER BY ao.fit_score DESC;
