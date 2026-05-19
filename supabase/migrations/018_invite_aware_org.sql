-- 018_invite_aware_org.sql
--
-- Fix the org proliferation problem. The auto_provision_trial_org trigger
-- previously created an org for EVERY signup, even invited users. This caused
-- orphan personal workspaces that required manual SuperAdmin cleanup.
--
-- New behavior:
--   1. If user has a pending invitation → join that org directly (no personal org)
--   2. If no invitation → leave org_id NULL (user can create/join later)
--
-- Also cleans up existing orphan orgs from the old trigger behavior.

-- ── Replace the trigger function ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_provision_trial_org()
RETURNS TRIGGER AS $$
DECLARE
  v_inv RECORD;
BEGIN
  -- If org_id already set (e.g., by a different process), do nothing
  IF NEW.org_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Check for a pending invitation matching this email
  SELECT id, org_id, role INTO v_inv
  FROM public.invitations
  WHERE email = lower(trim(NEW.email))
    AND accepted_at IS NULL
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_inv.id IS NOT NULL THEN
    -- Invitation found — join that org directly
    NEW.org_id := v_inv.org_id;
    NEW.role := COALESCE(v_inv.role, 'rep');

    -- Mark the invitation as accepted so it can't be reused
    UPDATE public.invitations
    SET accepted_at = now()
    WHERE id = v_inv.id;

    RETURN NEW;
  END IF;

  -- No invitation found — leave org_id NULL
  -- User can create an org or get invited later
  NEW.role := 'rep';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Clean up orphan orgs (no members at all) ───────────────────────────
-- Delete invitations first to avoid FK constraint violations
DELETE FROM public.invitations
WHERE org_id IN (
  SELECT o.id FROM public.orgs o
  LEFT JOIN public.users u ON u.org_id = o.id
  GROUP BY o.id
  HAVING count(u.id) = 0
);

DELETE FROM public.orgs
WHERE id IN (
  SELECT o.id FROM public.orgs o
  LEFT JOIN public.users u ON u.org_id = o.id
  GROUP BY o.id
  HAVING count(u.id) = 0
);

-- ── Clean up personal workspaces: trial plan, no seller_url, 0 runs, 1 member
-- These are auto-created workspaces that were never used.
-- Step 1: Set those users to org_id = NULL
UPDATE public.users SET org_id = NULL
WHERE org_id IN (
  SELECT o.id FROM public.orgs o
  JOIN public.users u ON u.org_id = o.id
  WHERE o.seller_url IS NULL
    AND o.run_count = 0
    AND o.plan = 'trial'
  GROUP BY o.id
  HAVING count(u.id) = 1
);

-- Step 2: Delete the now-empty orgs
DELETE FROM public.invitations
WHERE org_id IN (
  SELECT o.id FROM public.orgs o
  LEFT JOIN public.users u ON u.org_id = o.id
  GROUP BY o.id
  HAVING count(u.id) = 0
);

DELETE FROM public.orgs
WHERE id IN (
  SELECT o.id FROM public.orgs o
  LEFT JOIN public.users u ON u.org_id = o.id
  GROUP BY o.id
  HAVING count(u.id) = 0
);
