-- Migration 031: Fix remaining RLS gaps causing ~41 console errors per session
--
-- Three tables missing INSERT policies (not covered in migration 030):
--   - model_accuracy_log
--   - competitor_intel
--   - discovery_signals
--
-- Plus: account_outputs UPDATE policy too restrictive — blocks updates on
-- rows created before user_id was consistently stored. Broadened to allow
-- updates on own rows OR rows with null user_id (legacy rows).
--
-- Run in Supabase SQL Editor.

-- ── MISSING INSERT POLICIES ──────────────────────────────────────────

-- model_accuracy_log
DO $$ BEGIN
  CREATE POLICY "Users insert accuracy"
    ON public.model_accuracy_log
    FOR INSERT TO authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- competitor_intel
DO $$ BEGIN
  CREATE POLICY "Users insert competitor"
    ON public.competitor_intel
    FOR INSERT TO authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- discovery_signals
DO $$ BEGIN
  CREATE POLICY "Users insert discovery"
    ON public.discovery_signals
    FOR INSERT TO authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── FIX account_outputs UPDATE POLICY ────────────────────────────────
-- The existing policy requires user_id = auth.uid()::text, which blocks
-- updates on legacy rows where user_id is null or was stored differently.
-- Drop the old restrictive policy and create a broader one that allows
-- updates on own rows OR rows with null user_id.

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users update outputs" ON public.account_outputs;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users update outputs v2"
    ON public.account_outputs
    FOR UPDATE TO authenticated
    USING (user_id IS NULL OR user_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── SELECT POLICIES (needed for PATCH to find rows) ──────────────────
-- If tables have RLS enabled but no SELECT policy, PATCH can't find rows.

DO $$ BEGIN
  CREATE POLICY "Users select own outputs"
    ON public.account_outputs
    FOR SELECT TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users select accuracy"
    ON public.model_accuracy_log
    FOR SELECT TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users select competitor"
    ON public.competitor_intel
    FOR SELECT TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users select discovery"
    ON public.discovery_signals
    FOR SELECT TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
