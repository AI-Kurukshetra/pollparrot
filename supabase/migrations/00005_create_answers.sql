-- ============================================
-- Migration: 00005_create_answers
-- Description: Create answers table for individual question responses
-- ============================================

-- Create answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  value JSONB NOT NULL DEFAULT 'null'::jsonb,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one answer per question per response
  CONSTRAINT unique_answer_per_question UNIQUE (response_id, question_id)
);

-- Create indexes for common queries
CREATE INDEX idx_answers_response_id ON answers(response_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- Create trigger for updated_at
CREATE TRIGGER answers_updated_at
  BEFORE UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add comments for documentation
COMMENT ON TABLE answers IS 'Individual answers to survey questions';
COMMENT ON COLUMN answers.value IS 'JSONB value of the answer - can be string, number, array, or object depending on question type';
COMMENT ON COLUMN answers.file_url IS 'URL to uploaded file for file_upload question type';
