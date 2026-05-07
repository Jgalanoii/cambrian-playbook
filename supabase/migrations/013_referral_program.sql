-- Migration 013: Referral program
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Adds referral tracking: each user gets a unique referral code.
-- When a referred user completes their first brief, the referrer's
-- org gets +1 run (capped at 5 bonus runs per month).

SET role TO postgres;

-- Add referral columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by text; -- referral_code of the person who referred them
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_rewarded boolean DEFAULT false; -- true after first brief triggers reward

-- Add referral bonus tracking to orgs
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS referral_bonus_runs int NOT NULL DEFAULT 0; -- bonus runs earned this month via referrals
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS referral_bonus_cap int NOT NULL DEFAULT 5; -- max bonus runs per month

-- Generate referral codes for existing users who don't have one
UPDATE public.users
SET referral_code = substr(md5(id || created_at::text || random()::text), 1, 8)
WHERE referral_code IS NULL;

-- Ensure new users get a referral code automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, referral_code)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    substr(md5(NEW.id::text || now()::text || random()::text), 1, 8)
  )
  ON CONFLICT (id) DO UPDATE SET
    referral_code = COALESCE(public.users.referral_code, EXCLUDED.referral_code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT id, email, referral_code, referred_by, referral_rewarded FROM public.users LIMIT 10;
