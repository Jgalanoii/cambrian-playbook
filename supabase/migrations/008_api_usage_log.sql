-- Migration 008: API usage log for cost tracking
-- Run in Supabase SQL Editor
--
-- Logs input/output tokens per API call for cost monitoring.
-- Queryable by user, org, model, and time period.

SET role TO postgres;

CREATE TABLE IF NOT EXISTS public.api_usage_log (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      text,
  org_id       uuid,
  model        text NOT NULL,
  input_tokens int NOT NULL DEFAULT 0,
  output_tokens int NOT NULL DEFAULT 0,
  web_searches int NOT NULL DEFAULT 0,
  endpoint     text,  -- 'claude' or 'claude-stream'
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_log_user ON public.api_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_log_org ON public.api_usage_log(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_log_created ON public.api_usage_log(created_at);

-- No RLS — only accessible via service_role key (server-side only)
ALTER TABLE public.api_usage_log ENABLE ROW LEVEL SECURITY;

-- Deny all access via anon/authenticated keys
CREATE POLICY usage_log_deny_all ON public.api_usage_log FOR ALL USING (false);
