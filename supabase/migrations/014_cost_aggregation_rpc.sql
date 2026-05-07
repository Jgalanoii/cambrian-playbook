-- Migration 014: Server-side cost aggregation function
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Problem: REST API row limit (1000 default) causes cost totals to be
-- inaccurate when usage_log exceeds 1000 rows. Aggregating in the DB
-- bypasses the row limit entirely.

SET role TO postgres;

CREATE OR REPLACE FUNCTION public.get_cost_summary()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total', (
      SELECT jsonb_build_object(
        'api_calls', COUNT(*)::int,
        'input_tokens', COALESCE(SUM(input_tokens), 0)::bigint,
        'output_tokens', COALESCE(SUM(output_tokens), 0)::bigint,
        'web_searches', COALESCE(SUM(web_searches), 0)::int,
        'cost_haiku', ROUND((
          COALESCE(SUM(CASE WHEN model = 'claude-haiku-4-5-20251001' THEN input_tokens * 0.80 / 1000000.0 + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01 ELSE 0 END), 0)
        )::numeric, 4),
        'cost_sonnet', ROUND((
          COALESCE(SUM(CASE WHEN model LIKE 'claude-sonnet%' THEN input_tokens * 3.00 / 1000000.0 + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01 ELSE 0 END), 0)
        )::numeric, 4),
        'cost_opus', ROUND((
          COALESCE(SUM(CASE WHEN model LIKE 'claude-opus%' THEN input_tokens * 15.00 / 1000000.0 + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01 ELSE 0 END), 0)
        )::numeric, 4),
        'cost_total', ROUND((
          COALESCE(SUM(
            CASE
              WHEN model = 'claude-haiku-4-5-20251001' THEN input_tokens * 0.80 / 1000000.0 + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-sonnet%' THEN input_tokens * 3.00 / 1000000.0 + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
              WHEN model LIKE 'claude-opus%' THEN input_tokens * 15.00 / 1000000.0 + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
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
          COALESCE(SUM(web_searches), 0)::int as web_searches,
          ROUND((
            COALESCE(SUM(
              CASE
                WHEN model = 'claude-haiku-4-5-20251001' THEN input_tokens * 0.80 / 1000000.0 + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
                WHEN model LIKE 'claude-sonnet%' THEN input_tokens * 3.00 / 1000000.0 + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
                WHEN model LIKE 'claude-opus%' THEN input_tokens * 15.00 / 1000000.0 + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
                ELSE 0
              END
            ), 0)
          )::numeric, 4) as cost
        FROM api_usage_log
        WHERE model LIKE 'claude%'
        GROUP BY model
        ORDER BY cost DESC
      ) m
    ),
    'by_day', (
      SELECT COALESCE(jsonb_agg(row_to_json(d)::jsonb), '[]'::jsonb)
      FROM (
        SELECT
          created_at::date as day,
          COUNT(*)::int as calls,
          ROUND((
            COALESCE(SUM(
              CASE
                WHEN model = 'claude-haiku-4-5-20251001' THEN input_tokens * 0.80 / 1000000.0 + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
                WHEN model LIKE 'claude-sonnet%' THEN input_tokens * 3.00 / 1000000.0 + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
                WHEN model LIKE 'claude-opus%' THEN input_tokens * 15.00 / 1000000.0 + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
                ELSE 0
              END
            ), 0)
          )::numeric, 4) as cost
        FROM api_usage_log
        WHERE model LIKE 'claude%'
        GROUP BY created_at::date
        ORDER BY day DESC
        LIMIT 90
      ) d
    ),
    'by_user', (
      SELECT COALESCE(jsonb_agg(row_to_json(u)::jsonb), '[]'::jsonb)
      FROM (
        SELECT
          user_id,
          COUNT(*)::int as calls,
          COALESCE(SUM(input_tokens), 0)::bigint as input_tokens,
          COALESCE(SUM(output_tokens), 0)::bigint as output_tokens,
          ROUND((
            COALESCE(SUM(
              CASE
                WHEN model = 'claude-haiku-4-5-20251001' THEN input_tokens * 0.80 / 1000000.0 + output_tokens * 4.00 / 1000000.0 + web_searches * 0.01
                WHEN model LIKE 'claude-sonnet%' THEN input_tokens * 3.00 / 1000000.0 + output_tokens * 15.00 / 1000000.0 + web_searches * 0.01
                WHEN model LIKE 'claude-opus%' THEN input_tokens * 15.00 / 1000000.0 + output_tokens * 75.00 / 1000000.0 + web_searches * 0.01
                ELSE 0
              END
            ), 0)
          )::numeric, 4) as cost
        FROM api_usage_log
        WHERE model LIKE 'claude%'
        GROUP BY user_id
        ORDER BY cost DESC
      ) u
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT get_cost_summary()->'total';
