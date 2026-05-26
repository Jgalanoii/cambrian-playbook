-- Migration 020: Rollover runs — unused monthly runs carry forward
-- Run in Supabase SQL Editor before deploying updated code.

-- Add rollover tracking columns
ALTER TABLE public.orgs
  ADD COLUMN IF NOT EXISTS rollover_runs int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rollover_cap int DEFAULT 0;
-- rollover_cap = max rollover allowed (set to plan's run_limit on subscription)

-- Update existing orgs: set rollover_cap = run_limit (1 month's worth max)
UPDATE public.orgs SET rollover_cap = run_limit WHERE rollover_cap = 0;

-- RPC: Monthly rollover calculation
-- Called by cron job at start of each billing cycle.
-- Calculates unused runs, caps at rollover_cap, resets run_count.
CREATE OR REPLACE FUNCTION public.process_monthly_rollover()
RETURNS jsonb AS $$
DECLARE
  v_org record;
  v_count int := 0;
BEGIN
  FOR v_org IN
    SELECT id, run_count, run_limit, rollover_runs, rollover_cap
    FROM public.orgs
    WHERE plan != 'trial'
    FOR UPDATE
  LOOP
    DECLARE
      v_total_available int := v_org.run_limit + v_org.rollover_runs;
      v_unused int := GREATEST(0, v_total_available - v_org.run_count);
      v_new_rollover int := LEAST(v_unused, v_org.rollover_cap);
    BEGIN
      UPDATE public.orgs
      SET run_count = 0,
          rollover_runs = v_new_rollover,
          updated_at = now()
      WHERE id = v_org.id;
      v_count := v_count + 1;
    END;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'orgs_processed', v_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update increment_run_count to check against run_limit + rollover_runs
CREATE OR REPLACE FUNCTION public.increment_run_count(p_org_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_org record;
  v_total_available int;
BEGIN
  SELECT run_count, run_limit, rollover_runs
    INTO v_org
    FROM public.orgs
   WHERE id = p_org_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'org_not_found');
  END IF;

  v_total_available := v_org.run_limit + v_org.rollover_runs;

  IF v_org.run_count >= v_total_available THEN
    RETURN jsonb_build_object(
      'error', 'limit_exceeded',
      'run_count', v_org.run_count,
      'run_limit', v_org.run_limit,
      'rollover_runs', v_org.rollover_runs,
      'total_available', v_total_available
    );
  END IF;

  UPDATE public.orgs
     SET run_count = run_count + 1,
         updated_at = now()
   WHERE id = p_org_id;

  RETURN jsonb_build_object(
    'ok', true,
    'run_count', v_org.run_count + 1,
    'run_limit', v_org.run_limit,
    'rollover_runs', v_org.rollover_runs,
    'total_available', v_total_available
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
