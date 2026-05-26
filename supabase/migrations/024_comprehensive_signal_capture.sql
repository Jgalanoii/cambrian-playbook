-- Migration 024: Comprehensive signal capture — everything a data scientist needs
-- Run in Supabase SQL Editor.
--
-- Philosophy: every user action, every AI output, every outcome is a signal.
-- Signals compound into intelligence. Intelligence compounds into moat.

-- ═══════════════════════════════════════════════════════════════
-- TABLE 4: brief_quality_signals — how good was each brief?
-- Measures: completeness, edits, time spent, user satisfaction
-- A data scientist uses this to improve brief generation quality.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.brief_quality_signals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid,
  user_id text NOT NULL,
  seller_url text,
  market_category text,

  -- Target
  target_company text NOT NULL,
  target_industry text,
  target_domain text,

  -- Brief completeness (did every section populate?)
  sections_attempted int DEFAULT 10,
  sections_completed int,               -- how many of 10 actually had content
  sections_failed text[],               -- which sections failed (e.g. {"executives","strategy"})
  failed_models text[],                 -- which models failed (e.g. {"claude-opus-4-6","claude-sonnet-4-5"})

  -- Model mix used
  models_used jsonb,                    -- {"p1":"sonnet","p2":"sonnet","p3":"opus",...}
  kl_versions text[],                   -- which knowledge layers were injected

  -- User engagement (did they actually READ it?)
  time_on_brief_seconds int,            -- time from brief render to next action
  sections_expanded int,                -- how many collapsed sections did they expand
  sections_edited int,                  -- how many sections did they edit
  fields_edited text[],                 -- which specific fields were edited

  -- Quality signals
  copied_brief boolean DEFAULT false,    -- did they copy the brief?
  copied_summary boolean DEFAULT false,  -- did they copy the summary?
  pushed_hubspot boolean DEFAULT false,  -- did they push to CRM?
  proceeded_to_hypothesis boolean DEFAULT false,  -- did they continue to call prep?
  proceeded_to_call boolean DEFAULT false,

  -- Data confidence
  data_confidence text,                 -- "high", "medium", "low"
  web_searches_used int,                -- total web searches across all sections
  apollo_enrichment_used boolean,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bqs_company ON brief_quality_signals(target_company);
CREATE INDEX idx_bqs_category ON brief_quality_signals(market_category);
CREATE INDEX idx_bqs_quality ON brief_quality_signals(sections_completed, sections_edited);
ALTER TABLE public.brief_quality_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.brief_quality_signals FOR ALL TO service_role USING (true);
CREATE POLICY "Users insert own" ON public.brief_quality_signals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- ═══════════════════════════════════════════════════════════════
-- TABLE 5: discovery_signals — what happened on the call?
-- Links pre-call hypothesis to post-call reality.
-- A data scientist builds: "hypothesis quality → deal outcome" models.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.discovery_signals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid,
  user_id text NOT NULL,
  market_category text,

  -- Target
  target_company text NOT NULL,
  target_industry text,
  fit_score int,

  -- Pre-call hypothesis quality
  hypothesis_generated boolean DEFAULT false,
  hypothesis_edited boolean DEFAULT false,
  discovery_questions_count int,
  gate_questions_answered int,         -- how many of the in-call gates they completed
  gate_questions_total int,

  -- Call engagement
  call_duration_seconds int,           -- time in Live Call step
  notes_length int,                    -- character count of discovery notes
  milton_messages_sent int,            -- how many times they asked Milton for help
  milton_topics text[],                -- what they asked about (objection handling, next question, etc.)

  -- Post-call outcomes
  deal_route text,                     -- FAST_TRACK, NURTURE, DISQUALIFY
  deal_confidence int,                 -- 0-100
  deal_risk text,                      -- the identified risk
  next_steps_count int,                -- how many next steps generated
  follow_up_email_copied boolean,
  crm_note_copied boolean,

  -- Hypothesis accuracy (did pre-call prediction match reality?)
  reality_confirmed boolean,           -- was the "reality" hypothesis correct?
  impact_confirmed boolean,            -- was the "impact" quantification close?
  entry_point_correct boolean,         -- did we identify the right champion?
  route_predicted_correctly boolean,   -- did pre-call route match post-call route?

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ds_outcome ON discovery_signals(deal_route);
CREATE INDEX idx_ds_accuracy ON discovery_signals(route_predicted_correctly);
CREATE INDEX idx_ds_category ON discovery_signals(market_category);
ALTER TABLE public.discovery_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.discovery_signals FOR ALL TO service_role USING (true);
CREATE POLICY "Users insert own" ON public.discovery_signals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- ═══════════════════════════════════════════════════════════════
-- TABLE 6: knowledge_layer_effectiveness — which KLs improve outcomes?
-- Tracks: when a KL was injected, did it improve the brief/score/outcome?
-- A data scientist uses this to: prioritize KL investment, prune dead KLs.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.kl_effectiveness (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid,
  market_category text,

  -- Which KL
  kl_name text NOT NULL,               -- "insurance", "cannabis", "executivePerspectives"
  kl_version text,                     -- version tag if available

  -- Context
  target_industry text,
  target_company text,

  -- Was it useful?
  sections_it_influenced int,          -- how many brief sections used this KL's content
  user_edited_kl_content boolean,      -- did the user edit fields that came from this KL?
  deal_outcome text,                   -- if deal progressed, what happened?
  fit_score_with_kl int,               -- score when this KL was active

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_kle_name ON kl_effectiveness(kl_name);
CREATE INDEX idx_kle_category ON kl_effectiveness(market_category);
ALTER TABLE public.kl_effectiveness ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.kl_effectiveness FOR ALL TO service_role USING (true);

-- ═══════════════════════════════════════════════════════════════
-- TABLE 7: competitor_intel_log — verified competitive intelligence
-- Every verified competitor-customer relationship, sourced.
-- Grows into a competitive intelligence database over time.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.competitor_intel (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- The seller's market
  market_category text NOT NULL,
  seller_url text,

  -- The competitor
  competitor_name text NOT NULL,
  competitor_domain text,

  -- Their customer (the prospect opportunity)
  customer_name text NOT NULL,
  customer_domain text,
  customer_industry text,
  customer_size_band text,

  -- Evidence (REQUIRED)
  evidence_type text NOT NULL,         -- "case_study", "press_release", "partner_page", "earnings_call", "user_reported"
  evidence_url text,                   -- link to the source
  evidence_summary text,               -- 1-2 sentence description

  -- Confidence
  verified boolean DEFAULT false,      -- has a human verified this?
  confidence text DEFAULT 'ai_generated', -- "ai_generated", "web_verified", "user_confirmed"
  times_cited int DEFAULT 1,           -- how many briefs have cited this relationship

  -- Metadata
  discovered_by text,                  -- user_id who first surfaced this
  first_seen_at timestamptz DEFAULT now(),
  last_verified_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ci_competitor ON competitor_intel(competitor_name);
CREATE INDEX idx_ci_customer ON competitor_intel(customer_name);
CREATE INDEX idx_ci_category ON competitor_intel(market_category);
CREATE UNIQUE INDEX idx_ci_unique ON competitor_intel(competitor_name, customer_name, market_category);
ALTER TABLE public.competitor_intel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full" ON public.competitor_intel FOR ALL TO service_role USING (true);
CREATE POLICY "Authenticated read" ON public.competitor_intel FOR SELECT TO authenticated USING (true);

-- ═══════════════════════════════════════════════════════════════
-- TABLE 8: session_journey — full user journey per session
-- Every step transition, every action, timestamped.
-- A data scientist uses this for: funnel analysis, drop-off detection,
-- feature adoption, time-to-value metrics.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.session_journey (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid,
  user_id text NOT NULL,
  session_id uuid,

  -- Journey event
  step_from int,                       -- which step they were on
  step_to int,                         -- which step they moved to
  action text NOT NULL,                -- "step_change", "brief_generated", "hypothesis_built",
                                       -- "call_started", "post_call_completed", "hubspot_pushed",
                                       -- "session_saved", "session_restored", "export_pdf",
                                       -- "export_csv", "milton_asked", "score_adjusted",
                                       -- "field_edited", "account_selected", "account_dq"
  detail jsonb,                        -- action-specific context (e.g. {"company":"Acme","field":"revenue"})

  -- Temporal
  elapsed_since_session_start_ms int,  -- ms since session began
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_sj_session ON session_journey(session_id);
CREATE INDEX idx_sj_action ON session_journey(action);
CREATE INDEX idx_sj_user ON session_journey(user_id);
ALTER TABLE public.session_journey ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.session_journey FOR ALL TO service_role USING (true);
CREATE POLICY "Users insert own" ON public.session_journey FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- ═══════════════════════════════════════════════════════════════
-- ANALYTICS VIEWS for data scientists
-- ═══════════════════════════════════════════════════════════════

-- Brief quality by model and vertical
CREATE OR REPLACE VIEW public.v_brief_quality_by_model AS
SELECT
  market_category,
  ROUND(AVG(sections_completed), 1) AS avg_sections_complete,
  ROUND(AVG(sections_edited), 1) AS avg_sections_edited,
  ROUND(AVG(time_on_brief_seconds), 0) AS avg_time_on_brief,
  COUNT(*) FILTER (WHERE pushed_hubspot) AS pushed_to_crm,
  COUNT(*) FILTER (WHERE proceeded_to_hypothesis) AS proceeded_to_prep,
  COUNT(*) AS total_briefs
FROM public.brief_quality_signals
GROUP BY market_category;

-- Discovery-to-deal conversion
CREATE OR REPLACE VIEW public.v_discovery_conversion AS
SELECT
  market_category,
  COUNT(*) AS total_calls,
  ROUND(AVG(gate_questions_answered)::numeric / NULLIF(AVG(gate_questions_total), 0) * 100, 1) AS avg_gate_completion_pct,
  ROUND(AVG(call_duration_seconds), 0) AS avg_call_seconds,
  COUNT(*) FILTER (WHERE deal_route = 'FAST_TRACK') AS advanced,
  COUNT(*) FILTER (WHERE deal_route = 'DISQUALIFY') AS disqualified,
  ROUND(AVG(CASE WHEN route_predicted_correctly THEN 1 ELSE 0 END) * 100, 1) AS hypothesis_accuracy_pct
FROM public.discovery_signals
GROUP BY market_category;

-- Competitor intelligence coverage
CREATE OR REPLACE VIEW public.v_competitor_coverage AS
SELECT
  market_category,
  competitor_name,
  COUNT(*) AS known_customers,
  COUNT(*) FILTER (WHERE verified) AS verified_relationships,
  COUNT(*) FILTER (WHERE confidence = 'user_confirmed') AS user_confirmed,
  SUM(times_cited) AS total_citations
FROM public.competitor_intel
GROUP BY market_category, competitor_name
ORDER BY known_customers DESC;

-- Knowledge layer ROI
CREATE OR REPLACE VIEW public.v_kl_roi AS
SELECT
  kl_name,
  COUNT(*) AS times_injected,
  ROUND(AVG(sections_it_influenced), 1) AS avg_sections_influenced,
  COUNT(*) FILTER (WHERE user_edited_kl_content) AS times_user_corrected,
  ROUND(COUNT(*) FILTER (WHERE user_edited_kl_content)::numeric / COUNT(*) * 100, 1) AS correction_rate_pct,
  COUNT(*) FILTER (WHERE deal_outcome = 'FAST_TRACK') AS deals_advanced
FROM public.kl_effectiveness
GROUP BY kl_name;
