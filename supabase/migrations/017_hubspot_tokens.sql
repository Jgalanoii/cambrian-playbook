-- 017_hubspot_tokens.sql
--
-- Per-user HubSpot OAuth token storage.
-- Tokens are AES-256-GCM encrypted server-side before insertion.
-- RLS denies all client access — only service_role key can read/write.

CREATE TABLE IF NOT EXISTS public.hubspot_tokens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       text NOT NULL UNIQUE,
  portal_id     text,
  access_token  text NOT NULL,
  refresh_token text NOT NULL,
  token_iv      text NOT NULL,
  scopes        text,
  expires_at    timestamptz NOT NULL,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hubspot_tokens_user ON public.hubspot_tokens(user_id);

ALTER TABLE public.hubspot_tokens ENABLE ROW LEVEL SECURITY;

-- Deny all access via anon/authenticated keys.
-- Server-side functions use SUPABASE_SERVICE_KEY which bypasses RLS.
CREATE POLICY hubspot_tokens_deny_all ON public.hubspot_tokens
  FOR ALL USING (false);
