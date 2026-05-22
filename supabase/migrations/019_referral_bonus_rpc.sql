-- Migration 019: Atomic referral bonus increment
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Replaces the read-modify-write pattern in api/referral.js with an
-- atomic PostgreSQL function that uses SELECT … FOR UPDATE to prevent
-- race conditions when two concurrent referral rewards target the
-- same org.

SET role TO postgres;

CREATE OR REPLACE FUNCTION public.increment_referral_bonus(p_org_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_org record;
BEGIN
  SELECT run_limit, referral_bonus_runs, referral_bonus_cap
    INTO v_org
    FROM public.orgs
   WHERE id = p_org_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Org not found');
  END IF;

  IF v_org.referral_bonus_runs >= v_org.referral_bonus_cap THEN
    RETURN jsonb_build_object('error', 'cap_reached',
      'referral_bonus_runs', v_org.referral_bonus_runs,
      'referral_bonus_cap', v_org.referral_bonus_cap);
  END IF;

  UPDATE public.orgs
     SET run_limit = run_limit + 1,
         referral_bonus_runs = referral_bonus_runs + 1,
         updated_at = now()
   WHERE id = p_org_id;

  RETURN jsonb_build_object(
    'ok', true,
    'run_limit', v_org.run_limit + 1,
    'referral_bonus_runs', v_org.referral_bonus_runs + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
