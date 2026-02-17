-- ============================================
-- Migration: 00006_create_survey_collaborators
-- Description: Create survey_collaborators table for sharing surveys
-- ============================================

-- Create survey_collaborators table
CREATE TABLE survey_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate collaborators
  CONSTRAINT unique_collaborator UNIQUE (survey_id, user_id)
);

-- Create indexes for common queries
CREATE INDEX idx_collaborators_survey_id ON survey_collaborators(survey_id);
CREATE INDEX idx_collaborators_user_id ON survey_collaborators(user_id);
CREATE INDEX idx_collaborators_role ON survey_collaborators(role);

-- Create trigger for updated_at
CREATE TRIGGER collaborators_updated_at
  BEFORE UPDATE ON survey_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add comments for documentation
COMMENT ON TABLE survey_collaborators IS 'Collaboration permissions for surveys';
COMMENT ON COLUMN survey_collaborators.role IS 'Permission level: viewer (read-only), editor (edit questions), admin (full access)';
