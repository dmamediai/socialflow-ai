-- ============================================
-- Usage increment RPC functions
-- ============================================

CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  v_period_start := DATE_TRUNC('month', NOW());
  v_period_end := DATE_TRUNC('month', NOW()) + INTERVAL '1 month';

  INSERT INTO usage_tracking (user_id, period_start, period_end, ai_generations_count, scheduled_posts_count)
  VALUES (p_user_id, v_period_start, v_period_end, 1, 0)
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET
    ai_generations_count = usage_tracking.ai_generations_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_posts_usage(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  v_period_start := DATE_TRUNC('month', NOW());
  v_period_end := DATE_TRUNC('month', NOW()) + INTERVAL '1 month';

  INSERT INTO usage_tracking (user_id, period_start, period_end, ai_generations_count, scheduled_posts_count)
  VALUES (p_user_id, v_period_start, v_period_end, 0, 1)
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET
    scheduled_posts_count = usage_tracking.scheduled_posts_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Cron job to process scheduled posts
-- ============================================
-- Run every 5 minutes via pg_cron (enable in Supabase dashboard)
-- SELECT cron.schedule(
--   'publish-scheduled-posts',
--   '*/5 * * * *',
--   $$
--     UPDATE posts
--     SET status = 'published', published_at = NOW()
--     WHERE status = 'scheduled'
--     AND scheduled_at <= NOW()
--     AND scheduled_at > NOW() - INTERVAL '10 minutes';
--   $$
-- );
