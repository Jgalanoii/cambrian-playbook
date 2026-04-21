-- Migration 003: Add Max (Opus) run tracking to orgs
-- Run in Supabase SQL Editor

SET role TO postgres;

-- Add Max run columns
ALTER TABLE public.orgs
  ADD COLUMN IF NOT EXISTS max_run_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_run_limit int NOT NULL DEFAULT 0;

-- Trial: 0 Max runs (Haiku only)
-- Update existing trial orgs
UPDATE public.orgs SET max_run_limit = 0 WHERE plan = 'trial';

-- Update your org (paid) — adjust to your tier
-- UPDATE public.orgs SET max_run_limit = 50 WHERE plan = 'paid';

-- Atomic increment for Max runs (same pattern as regular runs)
CREATE OR REPLACE FUNCTION public.increment_max_run_count(p_org_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_org record;
BEGIN
  SELECT max_run_count, max_run_limit, plan INTO v_org
  FROM public.orgs WHERE id = p_org_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Org not found');
  END IF;

  IF v_org.max_run_count >= v_org.max_run_limit THEN
    RETURN jsonb_build_object('error', 'max_limit_exceeded', 'max_run_count', v_org.max_run_count, 'max_run_limit', v_org.max_run_limit);
  END IF;

  UPDATE public.orgs SET max_run_count = max_run_count + 1, updated_at = now() WHERE id = p_org_id;
  RETURN jsonb_build_object('ok', true, 'max_run_count', v_org.max_run_count + 1, 'max_run_limit', v_org.max_run_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT id, name, run_count, run_limit, max_run_count, max_run_limit, plan FROM public.orgs;
