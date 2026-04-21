-- Migration 004: Auto-provision trial org for new users
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Problem: Users who sign up get a public.users row (via auth trigger)
-- but no org_id, bypassing all usage limits. This trigger creates a
-- trial org (run_limit=5) and binds the user to it on insert.

SET role TO postgres;

-- Function: create a trial org and bind the user to it
CREATE OR REPLACE FUNCTION public.auto_provision_trial_org()
RETURNS trigger AS $$
DECLARE
  new_org_id uuid;
BEGIN
  -- Only provision if the user has no org
  IF NEW.org_id IS NULL THEN
    INSERT INTO public.orgs (name)
    VALUES (COALESCE(NEW.name, NEW.email, 'My Organization'))
    RETURNING id INTO new_org_id;

    NEW.org_id := new_org_id;
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fire before insert on public.users
DROP TRIGGER IF EXISTS trg_auto_provision_trial_org ON public.users;
CREATE TRIGGER trg_auto_provision_trial_org
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_provision_trial_org();

-- Backfill: any existing users without an org get one now
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

-- Verify
SELECT u.id, u.email, u.org_id, u.role, o.run_count, o.run_limit, o.plan
FROM public.users u
LEFT JOIN public.orgs o ON o.id = u.org_id
ORDER BY u.created_at DESC
LIMIT 20;
