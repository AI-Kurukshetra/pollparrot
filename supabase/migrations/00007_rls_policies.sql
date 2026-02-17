-- ============================================
-- Migration: 00007_rls_policies
-- Description: Enable RLS and create policies for all tables
-- ============================================

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_collaborators ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- SURVEYS POLICIES
-- ============================================

-- Users can view their own surveys
CREATE POLICY "Users can view own surveys"
  ON surveys FOR SELECT
  USING (auth.uid() = user_id);

-- Collaborators can view shared surveys
CREATE POLICY "Collaborators can view shared surveys"
  ON surveys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM survey_collaborators
      WHERE survey_id = surveys.id
      AND user_id = auth.uid()
    )
  );

-- Anyone can view active surveys by share_slug (for public survey taking)
CREATE POLICY "Anyone can view active surveys by share_slug"
  ON surveys FOR SELECT
  USING (status = 'active' AND share_slug IS NOT NULL);

-- Users can view template surveys
CREATE POLICY "Users can view templates"
  ON surveys FOR SELECT
  USING (is_template = TRUE);

-- Users can insert their own surveys
CREATE POLICY "Users can create surveys"
  ON surveys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own surveys
CREATE POLICY "Users can update own surveys"
  ON surveys FOR UPDATE
  USING (auth.uid() = user_id);

-- Collaborators with editor/admin role can update surveys
CREATE POLICY "Editors can update shared surveys"
  ON surveys FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM survey_collaborators
      WHERE survey_id = surveys.id
      AND user_id = auth.uid()
      AND role IN ('editor', 'admin')
    )
  );

-- Users can delete their own surveys
CREATE POLICY "Users can delete own surveys"
  ON surveys FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- QUESTIONS POLICIES
-- ============================================

-- Users can view questions for surveys they own or collaborate on
CREATE POLICY "Users can view questions for accessible surveys"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = questions.survey_id
      AND (
        surveys.user_id = auth.uid()
        OR surveys.status = 'active'
        OR EXISTS (
          SELECT 1 FROM survey_collaborators
          WHERE survey_id = surveys.id
          AND user_id = auth.uid()
        )
      )
    )
  );

-- Users can insert questions for their own surveys
CREATE POLICY "Users can create questions for own surveys"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = questions.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Editors can insert questions for shared surveys
CREATE POLICY "Editors can create questions for shared surveys"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM survey_collaborators
      WHERE survey_id = questions.survey_id
      AND user_id = auth.uid()
      AND role IN ('editor', 'admin')
    )
  );

-- Users can update questions for their own surveys
CREATE POLICY "Users can update questions for own surveys"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = questions.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Editors can update questions for shared surveys
CREATE POLICY "Editors can update questions for shared surveys"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM survey_collaborators
      WHERE survey_id = questions.survey_id
      AND user_id = auth.uid()
      AND role IN ('editor', 'admin')
    )
  );

-- Users can delete questions for their own surveys
CREATE POLICY "Users can delete questions for own surveys"
  ON questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = questions.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- ============================================
-- RESPONSES POLICIES
-- ============================================

-- Survey owners can view all responses
CREATE POLICY "Survey owners can view responses"
  ON responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = responses.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Collaborators can view responses
CREATE POLICY "Collaborators can view responses"
  ON responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM survey_collaborators
      WHERE survey_id = responses.survey_id
      AND user_id = auth.uid()
    )
  );

-- Respondents can view their own responses
CREATE POLICY "Respondents can view own responses"
  ON responses FOR SELECT
  USING (respondent_id = auth.uid());

-- Anyone can create responses for active surveys
CREATE POLICY "Anyone can submit responses to active surveys"
  ON responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = responses.survey_id
      AND surveys.status = 'active'
    )
  );

-- Respondents can update their own incomplete responses
CREATE POLICY "Respondents can update own incomplete responses"
  ON responses FOR UPDATE
  USING (
    respondent_id = auth.uid()
    AND is_complete = FALSE
  );

-- ============================================
-- ANSWERS POLICIES
-- ============================================

-- Survey owners can view all answers
CREATE POLICY "Survey owners can view answers"
  ON answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM responses
      JOIN surveys ON surveys.id = responses.survey_id
      WHERE responses.id = answers.response_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Collaborators can view answers
CREATE POLICY "Collaborators can view answers"
  ON answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM responses
      JOIN survey_collaborators ON survey_collaborators.survey_id = responses.survey_id
      WHERE responses.id = answers.response_id
      AND survey_collaborators.user_id = auth.uid()
    )
  );

-- Respondents can view their own answers
CREATE POLICY "Respondents can view own answers"
  ON answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM responses
      WHERE responses.id = answers.response_id
      AND responses.respondent_id = auth.uid()
    )
  );

-- Anyone can create answers for active surveys
CREATE POLICY "Anyone can submit answers to active surveys"
  ON answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM responses
      JOIN surveys ON surveys.id = responses.survey_id
      WHERE responses.id = answers.response_id
      AND surveys.status = 'active'
    )
  );

-- Respondents can update their own answers for incomplete responses
CREATE POLICY "Respondents can update own answers"
  ON answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM responses
      WHERE responses.id = answers.response_id
      AND responses.respondent_id = auth.uid()
      AND responses.is_complete = FALSE
    )
  );

-- ============================================
-- SURVEY_COLLABORATORS POLICIES
-- ============================================

-- Survey owners can view collaborators
CREATE POLICY "Survey owners can view collaborators"
  ON survey_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_collaborators.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Users can view their own collaborator records
CREATE POLICY "Users can view own collaborator records"
  ON survey_collaborators FOR SELECT
  USING (user_id = auth.uid());

-- Survey owners and admins can add collaborators
CREATE POLICY "Survey owners can add collaborators"
  ON survey_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_collaborators.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Admins can add collaborators
CREATE POLICY "Admins can add collaborators"
  ON survey_collaborators FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM survey_collaborators sc
      WHERE sc.survey_id = survey_collaborators.survey_id
      AND sc.user_id = auth.uid()
      AND sc.role = 'admin'
    )
  );

-- Survey owners can update collaborators
CREATE POLICY "Survey owners can update collaborators"
  ON survey_collaborators FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_collaborators.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Survey owners can delete collaborators
CREATE POLICY "Survey owners can remove collaborators"
  ON survey_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_collaborators.survey_id
      AND surveys.user_id = auth.uid()
    )
  );

-- Users can remove themselves as collaborators
CREATE POLICY "Users can remove self as collaborator"
  ON survey_collaborators FOR DELETE
  USING (user_id = auth.uid());
