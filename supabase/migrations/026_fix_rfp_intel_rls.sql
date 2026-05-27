-- Migration 026: Fix RFP intel signals RLS — users couldn't read their own rows
-- The SELECT policy required org_id match, but rows logged with null org_id
-- (or before org context loaded) were invisible to the user who created them.

DROP POLICY IF EXISTS "Users read own org" ON public.rfp_intel_signals;
CREATE POLICY "Users read own" ON public.rfp_intel_signals FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

-- Also allow users to update their own rows (for dismiss)
CREATE POLICY "Users update own" ON public.rfp_intel_signals FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);
