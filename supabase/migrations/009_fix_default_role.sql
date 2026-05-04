-- Migration 009: Fix default role for auto-provisioned users
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Problem: auto_provision_trial_org() sets every new user to 'admin'
-- because they own their auto-created org. This is correct for solo orgs
-- but makes the SuperAdmin Users tab misleading — every user shows as admin.
-- Fix: auto-provisioned solo users get 'rep' role. The superuser email
-- keeps admin. Users who accept invitations get the invited role (unchanged).

SET role TO postgres;

-- 1. Update the auto-provision trigger to use 'rep' instead of 'admin'
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
    -- Solo org owner gets 'admin' only if they're the superuser;
    -- everyone else starts as 'rep' (they're the only person in their org anyway)
    NEW.role := 'rep';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Backfill: demote all solo-org users from admin to rep
--    (a "solo org" = only one user in that org)
--    EXCEPT the superuser email
UPDATE public.users u
SET role = 'rep'
WHERE u.role = 'admin'
  AND u.email != 'itsjoegalano@gmail.com'
  AND (
    SELECT COUNT(*) FROM public.users u2 WHERE u2.org_id = u.org_id
  ) = 1;

-- 3. Verify: show all users with their roles
SELECT u.id, u.email, u.role, u.org_id, o.name AS org_name,
       (SELECT COUNT(*) FROM public.users u2 WHERE u2.org_id = u.org_id) AS org_members
FROM public.users u
LEFT JOIN public.orgs o ON o.id = u.org_id
ORDER BY u.created_at DESC
LIMIT 30;
