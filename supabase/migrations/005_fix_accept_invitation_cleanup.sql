-- Migration 005: Fix accept_invitation to clean up orphaned personal orgs
-- Run in Supabase SQL Editor
--
-- Problem: When an invited user signs up, auto_provision_trial_org creates
-- a personal org. Then accept_invitation rebinds them to the inviting org,
-- leaving an empty orphaned org behind.

SET role TO postgres;

CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text, p_user_id text)
RETURNS jsonb AS $$
DECLARE
  v_inv record;
  v_old_org_id uuid;
  v_old_org_member_count int;
BEGIN
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
