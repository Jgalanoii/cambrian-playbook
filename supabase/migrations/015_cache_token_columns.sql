-- Migration 015: Separate cache token tracking for accurate COGS
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Adds cache_read_tokens and cache_creation_tokens columns to
-- api_usage_log for exact cost calculation. Cache reads are 90%
-- cheaper than regular input tokens.

SET role TO postgres;

ALTER TABLE public.api_usage_log ADD COLUMN IF NOT EXISTS cache_read_tokens int NOT NULL DEFAULT 0;
ALTER TABLE public.api_usage_log ADD COLUMN IF NOT EXISTS cache_creation_tokens int NOT NULL DEFAULT 0;

-- Update the cost aggregation function with exact cache pricing
CREATE OR REPLACE FUNCTION public.get_cost_summary()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Pricing per 1M tokens (Anthropic published rates)
  -- Haiku:  input $0.80, output $4.00, cache_read $0.08, cache_create $1.00
  -- Sonnet: input $3.00, output $15.00, cache_read $0.30, cache_create $3.75
  -- Opus:   input $15.00, output $75.00, cache_read $1.50, cache_create $18.75
  -- Web search: $0.01 per invocation

  SELECT jsonb_build_object(
    'total', (
      SELECT jsonb_build_object(
        'api_calls', COUNT(*)::int,
        'input_tokens', COALESCE(SUM(input_tokens), 0)::bigint,
        'output_tokens', COALESCE(SUM(output_tokens), 0)::bigint,
        'cache_read_tokens', COALESCE(SUM(cache_read_tokens), 0)::bigint,
        'cache_creation_tokens', COALESCE(SUM(cache_creation_tokens), 0)::bigint,
        'web_searches', COALESCE(SUM(web_searches), 0)::int,
        'cost_total', ROUND((
          COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 0.80 / 1000000.0
                + cache_read_tokens * 0.08 / 1000000.0
                + cache_creation_tokens * 1.00 / 1000000.0
                + output_tokens * 4.00 / 1000000.0
                + web_searches * 0.01
              WHEN model LIKE 'claude-sonnet%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 3.00 / 1000000.0
                + cache_read_tokens * 0.30 / 1000000.0
                + cache_creation_tokens * 3.75 / 1000000.0
                + output_tokens * 15.00 / 1000000.0
                + web_searches * 0.01
              WHEN model LIKE 'claude-opus%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 15.00 / 1000000.0
                + cache_read_tokens * 1.50 / 1000000.0
                + cache_creation_tokens * 18.75 / 1000000.0
                + output_tokens * 75.00 / 1000000.0
                + web_searches * 0.01
              ELSE 0
            END
          ), 0)
        )::numeric, 4),
        'cost_ceiling', ROUND((
          COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN input_tokens * 0.80 / 1000000.0 + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-sonnet%' THEN input_tokens * 3.00 / 1000000.0 + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-opus%' THEN input_tokens * 15.00 / 1000000.0 + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
              ELSE 0
            END
          ), 0)
        )::numeric, 4),
        'cache_savings', ROUND((
          COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN cache_read_tokens * (0.80 - 0.08) / 1000000.0
              WHEN model LIKE 'claude-sonnet%' THEN cache_read_tokens * (3.00 - 0.30) / 1000000.0
              WHEN model LIKE 'claude-opus%' THEN cache_read_tokens * (15.00 - 1.50) / 1000000.0
              ELSE 0
            END
          ), 0)
        )::numeric, 4)
      )
      FROM api_usage_log
      WHERE model LIKE 'claude%'
    ),
    'by_model', (
      SELECT COALESCE(jsonb_agg(row_to_json(m)::jsonb), '[]'::jsonb)
      FROM (
        SELECT
          model,
          COUNT(*)::int as calls,
          COALESCE(SUM(input_tokens), 0)::bigint as input_tokens,
          COALESCE(SUM(output_tokens), 0)::bigint as output_tokens,
          COALESCE(SUM(cache_read_tokens), 0)::bigint as cache_read_tokens,
          COALESCE(SUM(cache_creation_tokens), 0)::bigint as cache_creation_tokens,
          COALESCE(SUM(web_searches), 0)::int as web_searches,
          ROUND((COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 0.80 / 1000000.0
                + cache_read_tokens * 0.08 / 1000000.0 + cache_creation_tokens * 1.00 / 1000000.0
                + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-sonnet%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 3.00 / 1000000.0
                + cache_read_tokens * 0.30 / 1000000.0 + cache_creation_tokens * 3.75 / 1000000.0
                + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-opus%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 15.00 / 1000000.0
                + cache_read_tokens * 1.50 / 1000000.0 + cache_creation_tokens * 18.75 / 1000000.0
                + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
              ELSE 0
            END
          ), 0))::numeric, 4) as cost
        FROM api_usage_log WHERE model LIKE 'claude%'
        GROUP BY model ORDER BY cost DESC
      ) m
    ),
    'by_day', (
      SELECT COALESCE(jsonb_agg(row_to_json(d)::jsonb), '[]'::jsonb)
      FROM (
        SELECT created_at::date as day, COUNT(*)::int as calls,
          ROUND((COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 0.80 / 1000000.0
                + cache_read_tokens * 0.08 / 1000000.0 + cache_creation_tokens * 1.00 / 1000000.0
                + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-sonnet%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 3.00 / 1000000.0
                + cache_read_tokens * 0.30 / 1000000.0 + cache_creation_tokens * 3.75 / 1000000.0
                + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-opus%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 15.00 / 1000000.0
                + cache_read_tokens * 1.50 / 1000000.0 + cache_creation_tokens * 18.75 / 1000000.0
                + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
              ELSE 0
            END
          ), 0))::numeric, 4) as cost
        FROM api_usage_log WHERE model LIKE 'claude%'
        GROUP BY created_at::date ORDER BY day DESC LIMIT 90
      ) d
    ),
    'by_user', (
      SELECT COALESCE(jsonb_agg(row_to_json(u)::jsonb), '[]'::jsonb)
      FROM (
        SELECT user_id, COUNT(*)::int as calls,
          COALESCE(SUM(input_tokens), 0)::bigint as input_tokens,
          COALESCE(SUM(output_tokens), 0)::bigint as output_tokens,
          ROUND((COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 0.80 / 1000000.0
                + cache_read_tokens * 0.08 / 1000000.0 + cache_creation_tokens * 1.00 / 1000000.0
                + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-sonnet%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 3.00 / 1000000.0
                + cache_read_tokens * 0.30 / 1000000.0 + cache_creation_tokens * 3.75 / 1000000.0
                + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-opus%' THEN
                (input_tokens - cache_read_tokens - cache_creation_tokens) * 15.00 / 1000000.0
                + cache_read_tokens * 1.50 / 1000000.0 + cache_creation_tokens * 18.75 / 1000000.0
                + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
              ELSE 0
            END
          ), 0))::numeric, 4) as cost
        FROM api_usage_log WHERE model LIKE 'claude%'
        GROUP BY user_id ORDER BY cost DESC
      ) u
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Migration 015 applied — cache token columns + exact cost function' AS status;
