-- ============================================
-- Migration: 00009_storage_buckets
-- Description: Set up Supabase Storage buckets
-- ============================================

-- ============================================
-- Create storage buckets
-- ============================================

-- Survey images bucket (public - for survey covers, question images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'survey-images',
  'survey-images',
  TRUE,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket (public - for user profile pictures)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Response files bucket (private - for file upload question responses)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'response-files',
  'response-files',
  FALSE,
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage policies for survey-images bucket
-- ============================================

-- Anyone can view survey images (public bucket)
CREATE POLICY "Public read access for survey images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'survey-images');

-- Authenticated users can upload survey images
CREATE POLICY "Authenticated users can upload survey images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'survey-images'
    AND auth.role() = 'authenticated'
  );

-- Users can update their own survey images
CREATE POLICY "Users can update own survey images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'survey-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Users can delete their own survey images
CREATE POLICY "Users can delete own survey images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'survey-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- ============================================
-- Storage policies for avatars bucket
-- ============================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "Public read access for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- ============================================
-- Storage policies for response-files bucket
-- ============================================

-- Survey owners can view response files
CREATE POLICY "Survey owners can view response files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'response-files'
    AND EXISTS (
      SELECT 1 FROM surveys s
      WHERE s.user_id = auth.uid()
      AND s.id::TEXT = (storage.foldername(name))[1]
    )
  );

-- Collaborators can view response files
CREATE POLICY "Collaborators can view response files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'response-files'
    AND EXISTS (
      SELECT 1 FROM survey_collaborators sc
      WHERE sc.user_id = auth.uid()
      AND sc.survey_id::TEXT = (storage.foldername(name))[1]
    )
  );

-- Anyone can upload response files to active surveys
CREATE POLICY "Anyone can upload response files to active surveys"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'response-files'
    AND EXISTS (
      SELECT 1 FROM surveys s
      WHERE s.status = 'active'
      AND s.id::TEXT = (storage.foldername(name))[1]
    )
  );
