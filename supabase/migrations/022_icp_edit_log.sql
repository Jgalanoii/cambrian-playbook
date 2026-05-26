-- Migration 022: ICP edit log — track user corrections for trend detection
-- Run in Supabase SQL Editor.
--
-- When users edit ICP fields, those corrections represent proprietary
-- knowledge. Logging them enables:
-- 1. Trend detection: if 5 sellers in fintech all change "companySize"
--    from "50-499" to "500-4,999", the ICP model's default is wrong
-- 2. Per-seller learning: corrections persist across sessions
-- 3. Platform intelligence: aggregated edit patterns improve defaults

CREATE TABLE IF NOT EXISTS public.icp_edit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text NOT NULL,
  org_id uuid,
  seller_url text,
  market_category text,
  -- What was changed
  field_name text NOT NULL,        -- e.g. "industries", "companySize", "buyerPersonas"
  old_value text,                  -- what the AI generated
  new_value text NOT NULL,         -- what the user changed it to
  edit_source text DEFAULT 'icp',  -- "icp" | "brief" | "scoring" | "hypothesis"
  -- Context for trend analysis
  target_company text,             -- if editing a brief field, which company
  session_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Indexes for trend queries
CREATE INDEX idx_icp_edits_field ON public.icp_edit_log(field_name, market_category);
CREATE INDEX idx_icp_edits_org ON public.icp_edit_log(org_id);
CREATE INDEX idx_icp_edits_time ON public.icp_edit_log(created_at);

-- RLS: users can insert their own edits, admins can read org edits
ALTER TABLE public.icp_edit_log ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API writes)
-- Authenticated users can insert their own
CREATE POLICY "Users can insert own edits" ON public.icp_edit_log
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

-- Admins can read their org's edits
CREATE POLICY "Admins can read org edits" ON public.icp_edit_log
  FOR SELECT TO authenticated
  USING (org_id IN (
    SELECT u.org_id FROM public.users u
    WHERE u.id = auth.uid()::text AND u.role IN ('admin', 'manager')
  ));
