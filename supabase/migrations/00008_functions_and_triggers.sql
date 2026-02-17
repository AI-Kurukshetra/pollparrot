-- ============================================
-- Migration: 00008_functions_and_triggers
-- Description: Helper functions for analytics and statistics
-- ============================================

-- ============================================
-- Get survey statistics
-- ============================================
CREATE OR REPLACE FUNCTION get_survey_stats(p_survey_id UUID)
RETURNS TABLE (
  total_responses BIGINT,
  completed_responses BIGINT,
  completion_rate NUMERIC,
  avg_completion_time INTERVAL,
  responses_today BIGINT,
  responses_this_week BIGINT,
  responses_this_month BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_responses,
    COUNT(*) FILTER (WHERE is_complete = TRUE)::BIGINT AS completed_responses,
    CASE
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE is_complete = TRUE)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS completion_rate,
    AVG(completed_at - started_at) FILTER (WHERE is_complete = TRUE) AS avg_completion_time,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::BIGINT AS responses_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT AS responses_this_week,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days')::BIGINT AS responses_this_month
  FROM responses
  WHERE survey_id = p_survey_id;
END;
$$;

-- ============================================
-- Get question summary/analytics
-- ============================================
CREATE OR REPLACE FUNCTION get_question_summary(p_question_id UUID)
RETURNS TABLE (
  question_id UUID,
  question_type TEXT,
  total_answers BIGINT,
  answer_distribution JSONB
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_question_type TEXT;
BEGIN
  -- Get the question type
  SELECT type INTO v_question_type FROM questions WHERE id = p_question_id;

  RETURN QUERY
  SELECT
    p_question_id AS question_id,
    v_question_type AS question_type,
    COUNT(*)::BIGINT AS total_answers,
    CASE
      -- For choice-based questions, count each option
      WHEN v_question_type IN ('multiple_choice', 'dropdown', 'checkbox') THEN
        (
          SELECT jsonb_object_agg(option_value, option_count)
          FROM (
            SELECT
              jsonb_array_elements_text(
                CASE
                  WHEN jsonb_typeof(value) = 'array' THEN value
                  ELSE jsonb_build_array(value)
                END
              ) AS option_value,
              COUNT(*)::BIGINT AS option_count
            FROM answers
            WHERE question_id = p_question_id
            GROUP BY option_value
          ) AS option_counts
        )
      -- For rating/scale questions, show distribution
      WHEN v_question_type IN ('rating', 'scale') THEN
        (
          SELECT jsonb_object_agg(rating_value, rating_count)
          FROM (
            SELECT
              value::TEXT AS rating_value,
              COUNT(*)::BIGINT AS rating_count
            FROM answers
            WHERE question_id = p_question_id
            GROUP BY value
            ORDER BY value
          ) AS rating_counts
        )
      -- For text questions, just return count
      ELSE
        jsonb_build_object('text_responses', COUNT(*))
    END AS answer_distribution
  FROM answers
  WHERE question_id = p_question_id
  GROUP BY p_question_id;
END;
$$;

-- ============================================
-- Get all questions with summaries for a survey
-- ============================================
CREATE OR REPLACE FUNCTION get_survey_question_summaries(p_survey_id UUID)
RETURNS TABLE (
  question_id UUID,
  question_title TEXT,
  question_type TEXT,
  sort_order INTEGER,
  total_answers BIGINT,
  answer_distribution JSONB
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id AS question_id,
    q.title AS question_title,
    q.type AS question_type,
    q.sort_order,
    COUNT(a.id)::BIGINT AS total_answers,
    CASE
      WHEN q.type IN ('multiple_choice', 'dropdown', 'checkbox') THEN
        COALESCE(
          (
            SELECT jsonb_object_agg(opt, cnt)
            FROM (
              SELECT
                jsonb_array_elements_text(
                  CASE
                    WHEN jsonb_typeof(a2.value) = 'array' THEN a2.value
                    ELSE jsonb_build_array(a2.value)
                  END
                ) AS opt,
                COUNT(*)::BIGINT AS cnt
              FROM answers a2
              WHERE a2.question_id = q.id
              GROUP BY opt
            ) AS opts
          ),
          '{}'::jsonb
        )
      WHEN q.type IN ('rating', 'scale') THEN
        COALESCE(
          (
            SELECT jsonb_object_agg(a2.value::TEXT, cnt)
            FROM (
              SELECT value, COUNT(*)::BIGINT AS cnt
              FROM answers
              WHERE question_id = q.id
              GROUP BY value
            ) AS a2
          ),
          '{}'::jsonb
        )
      ELSE
        jsonb_build_object('count', COUNT(a.id))
    END AS answer_distribution
  FROM questions q
  LEFT JOIN answers a ON a.question_id = q.id
  WHERE q.survey_id = p_survey_id
  GROUP BY q.id, q.title, q.type, q.sort_order
  ORDER BY q.sort_order;
END;
$$;

-- ============================================
-- Duplicate a survey (for templates)
-- ============================================
CREATE OR REPLACE FUNCTION duplicate_survey(
  p_survey_id UUID,
  p_new_user_id UUID DEFAULT NULL,
  p_new_title TEXT DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_survey_id UUID;
  v_original_user_id UUID;
BEGIN
  -- Get original survey owner
  SELECT user_id INTO v_original_user_id FROM surveys WHERE id = p_survey_id;

  -- Create new survey
  INSERT INTO surveys (user_id, title, description, status, settings)
  SELECT
    COALESCE(p_new_user_id, user_id),
    COALESCE(p_new_title, title || ' (Copy)'),
    description,
    'draft',
    settings
  FROM surveys
  WHERE id = p_survey_id
  RETURNING id INTO v_new_survey_id;

  -- Copy all questions
  INSERT INTO questions (survey_id, type, title, description, is_required, sort_order, options, settings)
  SELECT
    v_new_survey_id,
    type,
    title,
    description,
    is_required,
    sort_order,
    options,
    settings
  FROM questions
  WHERE survey_id = p_survey_id
  ORDER BY sort_order;

  RETURN v_new_survey_id;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION get_survey_stats IS 'Get comprehensive statistics for a survey';
COMMENT ON FUNCTION get_question_summary IS 'Get answer distribution for a single question';
COMMENT ON FUNCTION get_survey_question_summaries IS 'Get all question summaries for a survey';
COMMENT ON FUNCTION duplicate_survey IS 'Create a copy of a survey including all questions';
