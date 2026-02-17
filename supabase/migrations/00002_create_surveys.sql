-- ============================================
-- Migration: 00002_create_surveys
-- Description: Create surveys table with settings JSONB
-- ============================================

-- Create function to generate random share slug
CREATE OR REPLACE FUNCTION generate_share_slug()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Only generate if share_slug is null
  IF NEW.share_slug IS NULL THEN
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    NEW.share_slug := result;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create surveys table
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  is_template BOOLEAN NOT NULL DEFAULT FALSE,
  share_slug TEXT UNIQUE,
  response_count INTEGER NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{
    "allowAnonymous": true,
    "requireEmail": false,
    "showProgressBar": true,
    "shuffleQuestions": false,
    "oneQuestionPerPage": false,
    "allowBackNavigation": true,
    "showQuestionNumbers": true,
    "completionMessage": "Thank you for completing this survey!",
    "redirectUrl": null,
    "startDate": null,
    "endDate": null,
    "maxResponses": null
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_surveys_user_id ON surveys(user_id);
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_surveys_share_slug ON surveys(share_slug);
CREATE INDEX idx_surveys_is_template ON surveys(is_template) WHERE is_template = TRUE;
CREATE INDEX idx_surveys_created_at ON surveys(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create trigger for auto-generating share_slug
CREATE TRIGGER surveys_generate_share_slug
  BEFORE INSERT ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION generate_share_slug();

-- Create function to update profile survey_count
CREATE OR REPLACE FUNCTION update_survey_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET survey_count = survey_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET survey_count = survey_count - 1 WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update survey_count
CREATE TRIGGER surveys_count_trigger
  AFTER INSERT OR DELETE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_count();

-- Add comments for documentation
COMMENT ON TABLE surveys IS 'Survey/form definitions created by users';
COMMENT ON COLUMN surveys.settings IS 'JSONB configuration for survey behavior';
COMMENT ON COLUMN surveys.share_slug IS 'Unique 8-character slug for public survey URL';
