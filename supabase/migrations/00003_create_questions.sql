-- ============================================
-- Migration: 00003_create_questions
-- Description: Create questions table with 11 question types
-- ============================================

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'short_text',
    'long_text',
    'multiple_choice',
    'checkbox',
    'dropdown',
    'rating',
    'scale',
    'date',
    'file_upload',
    'ranking',
    'matrix'
  )),
  title TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  options JSONB DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{
    "placeholder": null,
    "minLength": null,
    "maxLength": null,
    "minValue": null,
    "maxValue": null,
    "minLabel": null,
    "maxLabel": null,
    "allowOther": false,
    "allowedFileTypes": null,
    "maxFileSize": null,
    "rows": null,
    "columns": null
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_questions_survey_id ON questions(survey_id);
CREATE INDEX idx_questions_sort_order ON questions(survey_id, sort_order);
CREATE INDEX idx_questions_type ON questions(type);

-- Create trigger for updated_at
CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add comments for documentation
COMMENT ON TABLE questions IS 'Questions belonging to surveys';
COMMENT ON COLUMN questions.type IS 'Question type: short_text, long_text, multiple_choice, checkbox, dropdown, rating, scale, date, file_upload, ranking, matrix';
COMMENT ON COLUMN questions.options IS 'JSONB array of options for choice-based questions';
COMMENT ON COLUMN questions.settings IS 'JSONB configuration specific to question type';
