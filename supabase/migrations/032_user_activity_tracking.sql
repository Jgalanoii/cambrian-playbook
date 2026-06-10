-- Migration 032: Add last_login tracking to users table
--
-- Problem: Admin dashboard can't see when users last logged in.
-- Activity tracking relies on sessions.updated_at which is indirect
-- and shows nothing for users who authenticated but never created a session.
--
-- Solution: Add last_login column + auth trigger that syncs
-- auth.users.last_sign_in_at → public.users.last_login on every login.
--
-- Run in Supabase SQL Editor.

-- ── Add last_login column ────────────────────────────────────────────
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login timestamptz;

-- ── Trigger: sync last_sign_in_at from auth.users on every login ─────
-- Supabase updates auth.users.last_sign_in_at whenever a user
-- authenticates (password, magic link, OAuth, invite acceptance).
-- This trigger copies that timestamp to public.users.last_login.
CREATE OR REPLACE FUNCTION public.sync_last_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    UPDATE public.users
    SET last_login = NEW.last_sign_in_at
    WHERE id = NEW.id::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists to avoid duplicate trigger error
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;

CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_last_login();

-- ── Backfill: populate last_login for existing users ─────────────────
UPDATE public.users u
SET last_login = a.last_sign_in_at
FROM auth.users a
WHERE u.id = a.id::text
  AND a.last_sign_in_at IS NOT NULL
  AND u.last_login IS NULL;
