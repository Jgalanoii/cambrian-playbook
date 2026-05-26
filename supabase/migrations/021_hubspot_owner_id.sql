-- Migration 021: Add owner_id column to hubspot_tokens
-- Run in Supabase SQL Editor.
--
-- The _hubspot.js code writes and reads owner_id but migration 017
-- did not include the column. Without it, HubSpot companies are never
-- assigned to the authenticated user's owner — they don't show in
-- "My companies" view.

ALTER TABLE public.hubspot_tokens
  ADD COLUMN IF NOT EXISTS owner_id text;
