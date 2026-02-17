-- ============================================
-- Migration: 00010_fix_rls_recursion
-- Description: Fix infinite recursion in RLS policies
-- ============================================

-- Create a security definer function to check survey ownership without RLS
CREATE OR REPLACE FUNCTION is_survey_owner(survey_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM surveys s
    WHERE s.id = survey_id
    AND s.user_id = auth.uid()
  );
$$;

-- Create a security definer function to check collaborator access without RLS
CREATE OR REPLACE FUNCTION is_survey_collaborator(p_survey_id UUID, p_roles TEXT[] DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM survey_collaborators sc
    WHERE sc.survey_id = p_survey_id
    AND sc.user_id = auth.uid()
    AND (p_roles IS NULL OR sc.role = ANY(p_roles))
  );
$$;

-- ============================================
-- Drop existing problematic policies
-- ============================================

-- Drop survey_collaborators policies
DROP POLICY IF EXISTS "Survey owners can view collaborators" ON survey_collaborators;
DROP POLICY IF EXISTS "Users can view own collaborator records" ON survey_collaborators;
DROP POLICY IF EXISTS "Survey owners can add collaborators" ON survey_collaborators;
DROP POLICY IF EXISTS "Admins can add collaborators" ON survey_collaborators;
DROP POLICY IF EXISTS "Survey owners can update collaborators" ON survey_collaborators;
DROP POLICY IF EXISTS "Survey owners can remove collaborators" ON survey_collaborators;
DROP POLICY IF EXISTS "Users can remove self as collaborator" ON survey_collaborators;

-- Drop surveys policies that reference survey_collaborators
DROP POLICY IF EXISTS "Collaborators can view shared surveys" ON surveys;
DROP POLICY IF EXISTS "Editors can update shared surveys" ON surveys;

-- ============================================
-- Recreate survey_collaborators policies (using direct checks)
-- ============================================

-- Users can view their own collaborator records
CREATE POLICY "Users can view own collaborator records"
  ON survey_collaborators FOR SELECT
  USING (user_id = auth.uid());

-- Survey owners can view all collaborators for their surveys
CREATE POLICY "Survey owners can view collaborators"
  ON survey_collaborators FOR SELECT
  USING (is_survey_owner(survey_id));

-- Survey owners can add collaborators
CREATE POLICY "Survey owners can add collaborators"
  ON survey_collaborators FOR INSERT
  WITH CHECK (is_survey_owner(survey_id));

-- Survey owners can update collaborators
CREATE POLICY "Survey owners can update collaborators"
  ON survey_collaborators FOR UPDATE
  USING (is_survey_owner(survey_id));

-- Survey owners can delete collaborators
CREATE POLICY "Survey owners can remove collaborators"
  ON survey_collaborators FOR DELETE
  USING (is_survey_owner(survey_id));

-- Users can remove themselves as collaborators
CREATE POLICY "Users can remove self as collaborator"
  ON survey_collaborators FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- Recreate surveys policies (using helper function)
-- ============================================

-- Collaborators can view shared surveys
CREATE POLICY "Collaborators can view shared surveys"
  ON surveys FOR SELECT
  USING (is_survey_collaborator(id));

-- Editors can update shared surveys
CREATE POLICY "Editors can update shared surveys"
  ON surveys FOR UPDATE
  USING (is_survey_collaborator(id, ARRAY['editor', 'admin']));
