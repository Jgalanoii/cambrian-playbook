-- Migration 030: Fix RLS on ALL data science and logging tables
-- Multiple tables are missing INSERT policies for authenticated users,
-- causing 41+ console errors per session. These tables log user actions
-- and AI output quality — the app works without them but we lose all
-- data science signals.
--
-- Run in Supabase SQL Editor.

-- icp_edit_log: tracks user edits to ICP fields
CREATE POLICY IF NOT EXISTS "Users insert own" ON public.icp_edit_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- session_journey: funnel analytics (step transitions, actions)
CREATE POLICY IF NOT EXISTS "Users insert own" ON public.session_journey
  FOR INSERT TO authenticated WITH CHECK (true);

-- rfp_intel_signals: RFP/procurement intelligence
-- INSERT policy may already exist from migration 026, but adding IF NOT EXISTS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'rfp_intel_signals' AND policyname = 'Users insert'
  ) THEN
    CREATE POLICY "Users insert" ON public.rfp_intel_signals
      FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- prospect_events: prospect-level event tracking
CREATE POLICY IF NOT EXISTS "Users insert own" ON public.prospect_events
  FOR INSERT TO authenticated WITH CHECK (true);

-- brief_quality_signals: per-brief quality metrics
-- INSERT policy may already exist from migration 024
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'brief_quality_signals' AND policyname LIKE 'Users insert%'
  ) THEN
    CREATE POLICY "Users insert" ON public.brief_quality_signals
      FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- account_outputs: brief/score persistence
-- May need UPDATE policy for PATCH operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'account_outputs' AND policyname LIKE 'Users update%'
  ) THEN
    CREATE POLICY "Users update own" ON public.account_outputs
      FOR UPDATE TO authenticated USING (user_id = auth.uid()::text);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'account_outputs' AND policyname LIKE 'Users insert%'
  ) THEN
    CREATE POLICY "Users insert own" ON public.account_outputs
      FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
  END IF;
END $$;

-- kl_effectiveness: knowledge layer ROI tracking
-- INSERT policy added in migration 027, but verify
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'kl_effectiveness' AND policyname = 'Users insert'
  ) THEN
    CREATE POLICY "Users insert" ON public.kl_effectiveness
      FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;
