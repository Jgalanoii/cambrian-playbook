-- Migration 010: Reduce trial org token limit from 5 to 3
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Change the default for new orgs
ALTER TABLE public.orgs ALTER COLUMN run_limit SET DEFAULT 3;

-- 2. Update existing trial orgs that still have the old default of 5
UPDATE public.orgs SET run_limit = 3 WHERE plan = 'trial' AND run_limit = 5;

-- 3. Verify
SELECT id, name, plan, run_limit, run_count FROM public.orgs ORDER BY created_at DESC LIMIT 20;
