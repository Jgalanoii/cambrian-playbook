-- Migration 001: Orgs, Invitations, Usage Tracking
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This is non-breaking — existing app continues to work unchanged.

-- ═══════════════════════════════════════════════════════════════
-- 1. CREATE ORGS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orgs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  seller_url   text,
  icp          jsonb,
  products     jsonb DEFAULT '[]'::jsonb,
  seller_docs  jsonb DEFAULT '[]'::jsonb,
  proof_points jsonb DEFAULT '[]'::jsonb,
  product_urls jsonb DEFAULT '[]'::jsonb,
  run_count    int NOT NULL DEFAULT 0,
  run_limit    int NOT NULL DEFAULT 5,
  plan         text NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial','paid','suspended')),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- 2. ADD ORG_ID TO USERS TABLE
-- ═══════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE public.users ADD COLUMN org_id uuid REFERENCES public.orgs(id);
  END IF;
END $$;

-- Add role constraint (if not already constrained)
-- First ensure all existing roles are valid
UPDATE public.users SET role = 'rep' WHERE role IS NULL OR role NOT IN ('admin','manager','rep');

-- ═══════════════════════════════════════════════════════════════
-- 3. CREATE INVITATIONS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.invitations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  email       text NOT NULL,
  role        text NOT NULL DEFAULT 'rep' CHECK (role IN ('admin','manager','rep')),
  token       text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  invited_by  text,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(org_id, email)
);

-- ═══════════════════════════════════════════════════════════════
-- 4. INDEXES
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_users_org_id ON public.users(org_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_org_id ON public.invitations(org_id);

-- ═══════════════════════════════════════════════════════════════
-- 5. RLS POLICIES — ORGS
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orgs_select ON public.orgs;
CREATE POLICY orgs_select ON public.orgs FOR SELECT
  USING (id IN (SELECT org_id FROM public.users WHERE id = auth.uid()::text));

DROP POLICY IF EXISTS orgs_update ON public.orgs;
CREATE POLICY orgs_update ON public.orgs FOR UPDATE
  USING (id IN (SELECT org_id FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));

DROP POLICY IF EXISTS orgs_insert ON public.orgs;
CREATE POLICY orgs_insert ON public.orgs FOR INSERT
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 6. RLS POLICIES — USERS (add org-aware policies)
-- ═══════════════════════════════════════════════════════════════
-- Keep existing self-access policies, add org-level read for admins/managers
DROP POLICY IF EXISTS users_select_org ON public.users;
CREATE POLICY users_select_org ON public.users FOR SELECT
  USING (
    org_id IS NOT NULL
    AND org_id IN (
      SELECT u2.org_id FROM public.users u2
      WHERE u2.id = auth.uid()::text AND u2.role IN ('admin','manager')
    )
  );

DROP POLICY IF EXISTS users_update_org ON public.users;
CREATE POLICY users_update_org ON public.users FOR UPDATE
  USING (
    org_id IS NOT NULL
    AND org_id IN (
      SELECT u2.org_id FROM public.users u2
      WHERE u2.id = auth.uid()::text AND u2.role = 'admin'
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- 7. RLS POLICIES — SESSIONS (add manager/admin read)
-- ═══════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS sessions_select_org ON public.sessions;
CREATE POLICY sessions_select_org ON public.sessions FOR SELECT
  USING (
    user_id IN (
      SELECT u2.id FROM public.users u2
      WHERE u2.org_id = (SELECT org_id FROM public.users WHERE id = auth.uid()::text)
    )
    AND (SELECT role FROM public.users WHERE id = auth.uid()::text) IN ('admin','manager')
  );

-- ═══════════════════════════════════════════════════════════════
-- 8. RLS POLICIES — INVITATIONS
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inv_admin ON public.invitations;
CREATE POLICY inv_admin ON public.invitations FOR ALL
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()::text AND role = 'admin'));

-- ═══════════════════════════════════════════════════════════════
-- 9. SQL FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Accept an invitation: bind user to org with the invited role
CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text, p_user_id text)
RETURNS jsonb AS $$
DECLARE
  v_inv record;
BEGIN
  SELECT * INTO v_inv FROM public.invitations
  WHERE token = p_token AND accepted_at IS NULL AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Invalid or expired invitation');
  END IF;

  UPDATE public.users
  SET org_id = v_inv.org_id, role = v_inv.role
  WHERE id = p_user_id;

  UPDATE public.invitations
  SET accepted_at = now()
  WHERE id = v_inv.id;

  RETURN jsonb_build_object('ok', true, 'org_id', v_inv.org_id, 'role', v_inv.role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment org run count with limit check (atomic)
CREATE OR REPLACE FUNCTION public.increment_run_count(p_org_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_org record;
BEGIN
  SELECT run_count, run_limit, plan INTO v_org
  FROM public.orgs WHERE id = p_org_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Org not found');
  END IF;

  IF v_org.run_count >= v_org.run_limit THEN
    RETURN jsonb_build_object('error', 'limit_exceeded', 'run_count', v_org.run_count, 'run_limit', v_org.run_limit);
  END IF;

  UPDATE public.orgs SET run_count = run_count + 1, updated_at = now() WHERE id = p_org_id;
  RETURN jsonb_build_object('ok', true, 'run_count', v_org.run_count + 1, 'run_limit', v_org.run_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════
-- 10. MIGRATE EXISTING USERS → PERSONAL ORGS
-- ═══════════════════════════════════════════════════════════════
-- Every existing user becomes admin of their own auto-created org.
-- Their sessions stay intact (session RLS still uses user_id).
DO $$
DECLARE
  u record;
  new_org_id uuid;
BEGIN
  FOR u IN SELECT id, email, name FROM public.users WHERE org_id IS NULL LOOP
    INSERT INTO public.orgs (name)
    VALUES (COALESCE(u.name, u.email, 'My Organization'))
    RETURNING id INTO new_org_id;

    UPDATE public.users SET org_id = new_org_id, role = 'admin' WHERE id = u.id;
  END LOOP;
END;
$$;

-- ═══════════════════════════════════════════════════════════════
-- DONE. Verify:
--   SELECT count(*) FROM public.orgs;
--   SELECT id, email, org_id, role FROM public.users;
-- ═══════════════════════════════════════════════════════════════
