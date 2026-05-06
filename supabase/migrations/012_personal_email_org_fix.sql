-- Migration 012: Handle personal email domains in org provisioning
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Problem: Users signing up with gmail.com, yahoo.com, etc. get orgs
-- named "Gmail", "Yahoo" which is wrong. Personal email users should
-- get orgs named after themselves, not their email provider.

SET role TO postgres;

CREATE OR REPLACE FUNCTION public.auto_provision_trial_org()
RETURNS trigger AS $$
DECLARE
  new_org_id uuid;
  email_domain text;
  domain_base text;
  matched_org_id uuid;
  user_display_name text;
  -- Common personal/free email providers — org should NOT be named after these
  personal_domains text[] := ARRAY[
    'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','hotmail.com',
    'outlook.com','live.com','msn.com','aol.com','icloud.com','me.com',
    'mac.com','protonmail.com','proton.me','zoho.com','yandex.com',
    'mail.com','gmx.com','fastmail.com','tutanota.com','hey.com',
    'pm.me','duck.com','mailbox.org','posteo.de','disroot.org'
  ];
BEGIN
  -- Only provision if the user has no org
  IF NEW.org_id IS NULL THEN
    email_domain := lower(split_part(NEW.email, '@', 2));
    domain_base := split_part(email_domain, '.', 1);
    user_display_name := COALESCE(NEW.name, split_part(NEW.email, '@', 1));

    -- Check if this is a personal email domain
    IF email_domain = ANY(personal_domains) THEN
      -- Personal email — create org named after the user, not the provider
      INSERT INTO public.orgs (name)
      VALUES (initcap(user_display_name) || '''s Workspace')
      RETURNING id INTO new_org_id;

      NEW.org_id := new_org_id;
      NEW.role := 'rep';
    ELSE
      -- Corporate email — try to match an existing org by domain
      SELECT id INTO matched_org_id
      FROM public.orgs
      WHERE seller_url IS NOT NULL
        AND seller_url != ''
        AND (
          seller_url ILIKE '%' || domain_base || '%'
          OR name ILIKE '%' || domain_base || '%'
        )
      LIMIT 1;

      IF matched_org_id IS NOT NULL THEN
        -- Join existing org as rep
        NEW.org_id := matched_org_id;
        NEW.role := 'rep';
      ELSE
        -- No match — create org named after the company domain
        INSERT INTO public.orgs (name)
        VALUES (initcap(domain_base))
        RETURNING id INTO new_org_id;

        NEW.org_id := new_org_id;
        NEW.role := 'rep';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT 'Migration 012 applied — personal email domains handled' AS status;
