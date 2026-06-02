-- cleanup-stale-rfp.sql
-- Run in Supabase SQL Editor to remove stale CRM RFP results
-- that were persisted when iRewardify's ICP had wrong product context.
--
-- This is safe to run — only deletes results where:
-- 1. The title contains "CRM" or "Customer Relationship Management"
-- 2. AND the seller_url contains "irewardify"
-- These are guaranteed wrong (iRewardify is a rewards company, not CRM).

-- Preview what will be deleted
SELECT id, title, seller_url, created_at
FROM rfp_intel_signals
WHERE seller_url ILIKE '%irewardify%'
  AND (title ILIKE '%CRM%' OR title ILIKE '%Customer Relationship Management%')
ORDER BY created_at DESC;

-- Uncomment the line below to actually delete:
-- DELETE FROM rfp_intel_signals WHERE seller_url ILIKE '%irewardify%' AND (title ILIKE '%CRM%' OR title ILIKE '%Customer Relationship Management%');
