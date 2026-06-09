-- Migration 030: Fix RLS on ALL data science and logging tables
-- Multiple tables are missing INSERT policies for authenticated users,
-- causing 41+ console errors per session.
--
-- Run in Supabase SQL Editor.

-- icp_edit_log
DO $$ BEGIN
  CREATE POLICY "Users insert icp_edit" ON public.icp_edit_log FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- session_journey
DO $$ BEGIN
  CREATE POLICY "Users insert journey" ON public.session_journey FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- rfp_intel_signals
DO $$ BEGIN
  CREATE POLICY "Users insert rfp" ON public.rfp_intel_signals FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- prospect_events
DO $$ BEGIN
  CREATE POLICY "Users insert prospects" ON public.prospect_events FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- brief_quality_signals
DO $$ BEGIN
  CREATE POLICY "Users insert bqs" ON public.brief_quality_signals FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- account_outputs — INSERT + UPDATE
DO $$ BEGIN
  CREATE POLICY "Users insert outputs" ON public.account_outputs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users update outputs" ON public.account_outputs FOR UPDATE TO authenticated USING (user_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- kl_effectiveness
DO $$ BEGIN
  CREATE POLICY "Users insert kl_eff" ON public.kl_effectiveness FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
