-- Migration 007: Security hardening
-- Run in Supabase SQL Editor
--
-- Fixes:
-- 1. Lock down orgs INSERT policy (was WITH CHECK (true) — anyone could create orgs)
-- 2. Fix accept_invitation to verify caller matches p_user_id (prevents binding other users)

SET role TO postgres;

-- ═══════════════════════════════════════════════════════════════
-- 1. RESTRICT ORGS INSERT — only SECURITY DEFINER functions can create orgs
-- ═══════════════════════════════════════════════════════════════
-- The auto_provision_trial_org trigger runs as SECURITY DEFINER and
-- bypasses RLS, so it will still work. But direct REST API calls
-- from authenticated users will be blocked.

DROP POLICY IF EXISTS orgs_insert ON public.orgs;
CREATE POLICY orgs_insert ON public.orgs FOR INSERT
  WITH CHECK (false);

-- ═══════════════════════════════════════════════════════════════
-- 2. FIX accept_invitation — VERIFY CALLER IDENTITY
-- ═══════════════════════════════════════════════════════════════
-- Previously, anyone with a valid invitation token could bind ANY
-- user to the org by passing a different p_user_id. Now verifies
-- that the calling user (auth.uid()) matches p_user_id.

CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text, p_user_id text)
RETURNS jsonb AS $$
DECLARE
  v_inv record;
  v_old_org_id uuid;
  v_old_org_member_count int;
BEGIN
  -- Verify the caller is the user being bound
  IF p_user_id != auth.uid()::text THEN
    RETURN jsonb_build_object('error', 'forbidden — can only accept invitations for yourself');
  END IF;

  SELECT * INTO v_inv FROM public.invitations
  WHERE token = p_token AND accepted_at IS NULL AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Invalid or expired invitation');
  END IF;

  -- Remember the user's current org (may be an auto-provisioned personal org)
  SELECT org_id INTO v_old_org_id FROM public.users WHERE id = p_user_id;

  -- Rebind user to the inviting org
  UPDATE public.users
  SET org_id = v_inv.org_id, role = v_inv.role
  WHERE id = p_user_id;

  -- Mark invitation as accepted
  UPDATE public.invitations
  SET accepted_at = now()
  WHERE id = v_inv.id;

  -- Clean up orphaned personal org if it has no other members
  IF v_old_org_id IS NOT NULL AND v_old_org_id != v_inv.org_id THEN
    SELECT count(*) INTO v_old_org_member_count
    FROM public.users WHERE org_id = v_old_org_id;

    IF v_old_org_member_count = 0 THEN
      DELETE FROM public.orgs WHERE id = v_old_org_id;
    END IF;
  END IF;

  RETURN jsonb_build_object('ok', true, 'org_id', v_inv.org_id, 'role', v_inv.role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
