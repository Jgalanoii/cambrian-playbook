-- Migration 011: Org-by-domain — match new users to existing orgs by email domain
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Problem: Every signup creates a solo org. Users don't understand what an "org" is.
-- Fix: When a user signs up, check if an org exists with a seller_url matching their
-- email domain. If yes, join that org. If no match, create a new org named after the domain.

SET role TO postgres;

-- Update the auto-provision trigger to match by email domain
CREATE OR REPLACE FUNCTION public.auto_provision_trial_org()
RETURNS trigger AS $$
DECLARE
  new_org_id uuid;
  email_domain text;
  matched_org_id uuid;
BEGIN
  -- Only provision if the user has no org
  IF NEW.org_id IS NULL THEN
    -- Extract domain from email
    email_domain := split_part(NEW.email, '@', 2);

    -- Try to match an existing org by seller_url domain
    -- e.g., user@charityontop.org matches org with seller_url containing 'charityontop'
    SELECT id INTO matched_org_id
    FROM public.orgs
    WHERE seller_url IS NOT NULL
      AND seller_url != ''
      AND (
        seller_url ILIKE '%' || split_part(email_domain, '.', 1) || '%'
        OR name ILIKE '%' || split_part(email_domain, '.', 1) || '%'
      )
    LIMIT 1;

    IF matched_org_id IS NOT NULL THEN
      -- Join existing org as rep
      NEW.org_id := matched_org_id;
      NEW.role := 'rep';
    ELSE
      -- No match — create a new org named after the email domain
      INSERT INTO public.orgs (name)
      VALUES (initcap(split_part(email_domain, '.', 1)))
      RETURNING id INTO new_org_id;

      NEW.org_id := new_org_id;
      NEW.role := 'rep';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT 'Migration 011 applied — auto_provision_trial_org now matches by email domain' AS status;
