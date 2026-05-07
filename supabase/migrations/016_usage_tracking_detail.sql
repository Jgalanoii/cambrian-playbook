-- 016: Add detailed tracking columns to api_usage_log
-- Tracks which company was researched, seller context, and brief type per API call.
-- Enables per-user activity dashboards and usage analytics.

ALTER TABLE api_usage_log ADD COLUMN IF NOT EXISTS target_company text;
ALTER TABLE api_usage_log ADD COLUMN IF NOT EXISTS seller_url text;
ALTER TABLE api_usage_log ADD COLUMN IF NOT EXISTS brief_type text;

-- Index for efficient dashboard queries
CREATE INDEX IF NOT EXISTS idx_usage_target_company ON api_usage_log (target_company) WHERE target_company IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usage_created_at ON api_usage_log (created_at DESC);

-- Update the cost summary RPC to include target_company grouping
CREATE OR REPLACE FUNCTION get_usage_by_company(p_limit int DEFAULT 50)
RETURNS TABLE (
  target_company text,
  brief_count bigint,
  total_input_tokens bigint,
  total_output_tokens bigint,
  total_cache_read bigint,
  total_cache_creation bigint,
  total_web_searches bigint,
  last_used timestamptz
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    target_company,
    COUNT(*) as brief_count,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(COALESCE(cache_read_tokens, 0)) as total_cache_read,
    SUM(COALESCE(cache_creation_tokens, 0)) as total_cache_creation,
    SUM(web_searches) as total_web_searches,
    MAX(created_at) as last_used
  FROM api_usage_log
  WHERE target_company IS NOT NULL
  GROUP BY target_company
  ORDER BY last_used DESC
  LIMIT p_limit;
$$;
