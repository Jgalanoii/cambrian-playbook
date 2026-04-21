-- Migration 002: Fix infinite recursion in users RLS policies
-- The users_select_org and users_update_org policies reference the users
-- table in their own WHERE clause, causing Postgres to loop infinitely.
-- Fix: use a SECURITY DEFINER function that bypasses RLS to look up
-- the current user's org_id and role.

-- Helper function: get current user's org_id (bypasses RLS)
CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS uuid AS $$
  SELECT org_id FROM public.users WHERE id = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT role FROM public.users WHERE id = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ═══════════════════════════════════════════════════════════════
-- Fix users RLS policies
-- ═══════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS users_select_org ON public.users;
CREATE POLICY users_select_org ON public.users FOR SELECT
  USING (
    org_id IS NOT NULL
    AND org_id = current_user_org_id()
    AND current_user_role() IN ('admin','manager')
  );

DROP POLICY IF EXISTS users_update_org ON public.users;
CREATE POLICY users_update_org ON public.users FOR UPDATE
  USING (
    org_id IS NOT NULL
    AND org_id = current_user_org_id()
    AND current_user_role() = 'admin'
  );

-- ═══════════════════════════════════════════════════════════════
-- Fix sessions RLS policy (same recursion issue via users join)
-- ═══════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS sessions_select_org ON public.sessions;
CREATE POLICY sessions_select_org ON public.sessions FOR SELECT
  USING (
    current_user_role() IN ('admin','manager')
    AND user_id IN (
      SELECT id FROM public.users WHERE org_id = current_user_org_id()
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- Fix orgs RLS policy (same issue)
-- ═══════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS orgs_select ON public.orgs;
CREATE POLICY orgs_select ON public.orgs FOR SELECT
  USING (id = current_user_org_id());

DROP POLICY IF EXISTS orgs_update ON public.orgs;
CREATE POLICY orgs_update ON public.orgs FOR UPDATE
  USING (id = current_user_org_id() AND current_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════════
-- Verify: this should return your org now (no recursion error)
-- SELECT * FROM public.users WHERE id = auth.uid()::text;
-- SELECT * FROM public.orgs;
-- ═══════════════════════════════════════════════════════════════
