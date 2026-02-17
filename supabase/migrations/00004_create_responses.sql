-- ============================================
-- Migration: 00004_create_responses
-- Description: Create responses table for survey submissions
-- ============================================

-- Create responses table
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  respondent_email TEXT,
  respondent_name TEXT,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_responses_survey_id ON responses(survey_id);
CREATE INDEX idx_responses_respondent_id ON responses(respondent_id);
CREATE INDEX idx_responses_is_complete ON responses(survey_id, is_complete);
CREATE INDEX idx_responses_created_at ON responses(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to increment survey response_count
CREATE OR REPLACE FUNCTION increment_response_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only increment when response is marked complete
  IF NEW.is_complete = TRUE AND (OLD IS NULL OR OLD.is_complete = FALSE) THEN
    UPDATE surveys SET response_count = response_count + 1 WHERE id = NEW.survey_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for response_count
CREATE TRIGGER responses_increment_count
  AFTER INSERT OR UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION increment_response_count();

-- Add comments for documentation
COMMENT ON TABLE responses IS 'Individual survey response submissions';
COMMENT ON COLUMN responses.respondent_id IS 'FK to profiles if respondent is logged in, NULL for anonymous';
COMMENT ON COLUMN responses.metadata IS 'Additional metadata like browser info, location, etc.';
