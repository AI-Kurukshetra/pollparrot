# Supabase Database Migrations

This directory contains SQL migration files for the PollParrot database schema.

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for first setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file **in order** (00001 → 00009)
4. Copy the contents of each `.sql` file and execute it

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

## Migration Order

Run these in order - each depends on previous migrations:

| File | Description |
|------|-------------|
| `00001_create_profiles.sql` | User profiles table, extends auth.users |
| `00002_create_surveys.sql` | Surveys table with settings JSONB |
| `00003_create_questions.sql` | Questions with 11 type support |
| `00004_create_responses.sql` | Response tracking |
| `00005_create_answers.sql` | Individual answers per question |
| `00006_create_survey_collaborators.sql` | Collaboration support |
| `00007_rls_policies.sql` | Row Level Security policies |
| `00008_functions_and_triggers.sql` | Helper functions for analytics |
| `00009_storage_buckets.sql` | Storage bucket setup |

## After Running Migrations

Generate TypeScript types:

```bash
npm run types
```

This will update `src/types/database.ts` with the actual schema types.

## Database Schema

### Tables
- **profiles** - User profiles (extends auth.users)
- **surveys** - Survey definitions
- **questions** - Survey questions (11 types supported)
- **responses** - Survey response submissions
- **answers** - Individual question answers
- **survey_collaborators** - Sharing/collaboration

### Storage Buckets
- **survey-images** - Public, for survey covers/question images
- **avatars** - Public, for user profile pictures
- **response-files** - Private, for file upload responses

## Security

All tables have Row Level Security (RLS) enabled. Key policies:
- Users can only access their own data
- Survey owners and collaborators can access shared surveys
- Active surveys are publicly accessible for response submission
- Service role key bypasses RLS (use carefully!)
