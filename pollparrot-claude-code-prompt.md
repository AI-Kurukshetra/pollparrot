# PollParrot - Claude Code Project Scaffold Prompt

## Copy and paste this into Claude Code:

---

Create a production-ready Next.js application called **"PollParrot"** — a full-featured survey/form builder platform inspired by SurveyMonkey. This is the initial project structure and scaffold. Focus on architecture, core pages, auth, database, and a working foundation.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 with a **dark peach theme** (primary: peach/coral tones `#FF9472`, `#FFB396`, `#FFD4C2`; backgrounds: warm dark tones `#1A1210`, `#2D2220`, `#3D302A`; accents: soft gold `#FFD700`, cream `#FFF5E6`; text: cream/warm white `#FFF0E0`)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password + GitHub OAuth + Google OAuth + magic link)
- **Storage:** Supabase Storage (for survey images, user avatars, file upload question types)
- **Email:** Supabase Auth emails (confirmation, password reset, magic link) + Supabase Edge Functions for survey invitation emails
- **Realtime:** Supabase Realtime (live response count updates on dashboard)
- **Validation:** Zod
- **UI Components:** Build custom components (no shadcn) — buttons, inputs, modals, cards, dropdowns, toasts
- **Icons:** Lucide React
- **Supabase Client:** `@supabase/supabase-js` + `@supabase/ssr` for server-side auth
- **Deployment:** Vercel (primary) — include `vercel.json` if needed

---

## 🔒 CRITICAL: Security Rules for Supabase Keys

**Follow these rules strictly. Any violation is a security breach.**

### Key Classification

| Variable | Prefix | Exposed to Browser? | Where to Use |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_` | ✅ Yes (safe — it's a public URL) | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_` | ✅ Yes (safe — RLS protects data) | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ No prefix | ❌ NEVER | Server Actions, API Routes, seed scripts ONLY |

### Absolute Rules

1. **`SUPABASE_SERVICE_ROLE_KEY` must NEVER be:**
   - Imported in any file under `src/components/` (client components)
   - Imported in any file that has `"use client"` directive
   - Used in `src/lib/supabase/client.ts` (browser client)
   - Passed as a prop to any component
   - Logged to console (`console.log`) anywhere
   - Hardcoded in any file — always read from `process.env`
   - Committed to git (must be in `.env.local` which is in `.gitignore`)

2. **`SUPABASE_SERVICE_ROLE_KEY` is ONLY allowed in:**
   - `src/lib/supabase/admin.ts` — and this file must NEVER be imported on the client
   - `src/actions/*.ts` — Server Actions (server-only by default)
   - `src/app/api/**/*.ts` — API Route Handlers (server-only by default)
   - `scripts/seed.ts` — CLI seed script (never runs in browser)

3. **The admin client (`supabaseAdmin`) bypasses ALL Row Level Security (RLS). Therefore:**
   - Use it sparingly — only for admin operations, seeding, and server-side tasks that need elevated access
   - For all user-facing queries, use the regular Supabase client (which respects RLS)
   - Never create an admin client from user-supplied credentials

### Supabase Client Architecture

```
src/lib/supabase/
├── client.ts      → createBrowserClient()  → Uses ANON KEY  → Runs in BROWSER   → RLS ✅ enforced
├── server.ts      → createServerClient()   → Uses ANON KEY  → Runs on SERVER    → RLS ✅ enforced
├── middleware.ts   → createServerClient()   → Uses ANON KEY  → Runs on SERVER    → RLS ✅ enforced
└── admin.ts       → createClient()         → Uses SERVICE KEY → Runs on SERVER   → RLS ❌ BYPASSED
```

**Rules for each client:**

- **`client.ts`** (Browser): Used in `"use client"` components. Uses `NEXT_PUBLIC_*` env vars only. All queries filtered by RLS based on logged-in user's JWT.
- **`server.ts`** (Server Components / Server Actions): Uses `NEXT_PUBLIC_*` env vars but runs server-side with cookie-based auth. RLS still enforced via user's session.
- **`middleware.ts`** (Next.js Middleware): Refreshes auth session on every request. Uses `NEXT_PUBLIC_*` env vars only.
- **`admin.ts`** (Admin/Service Role): ⚠️ DANGEROUS. Bypasses RLS. Only for:
  - Seeding data (`scripts/seed.ts`)
  - Creating users programmatically (`auth.admin.createUser()`)
  - Background jobs / webhooks that need full DB access
  - NEVER import this in client components or pages that render in the browser

### File-Level Enforcement

Add this comment header to `src/lib/supabase/admin.ts`:
```typescript
/**
 * ⚠️  ADMIN CLIENT — SERVER-ONLY
 *
 * This client uses SUPABASE_SERVICE_ROLE_KEY which BYPASSES Row Level Security.
 * NEVER import this file in:
 *   - Client components ("use client")
 *   - Any file in src/components/
 *   - Any file that could be bundled for the browser
 *
 * ONLY use in: Server Actions, API Routes, and scripts.
 */
import 'server-only' // <-- This import will throw a build error if imported on the client

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

**IMPORTANT:** Install the `server-only` package (`npm install server-only`). This is a Next.js convention that causes a build-time error if the file is ever imported in a client bundle.

### API Route Security Pattern

For any API route that needs the service role:
```typescript
// src/app/api/admin/example/route.ts
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // FIRST: Verify the user is authenticated
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // THEN: Check user has admin privileges if needed
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'enterprise') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ONLY THEN: Use admin client for elevated operations
  // ... supabaseAdmin queries here
}
```

### .gitignore (Must Include)
```
.env.local
.env.*.local
.env
```

### Vercel Deployment Security
- All env vars set via Vercel Dashboard → Settings → Environment Variables
- `SUPABASE_SERVICE_ROLE_KEY` should ONLY be added to the **Server** environment (not "Preview" or "Development" unless needed)
- `NEXT_PUBLIC_*` vars are safe for all environments
- Enable "Sensitive" flag for `SUPABASE_SERVICE_ROLE_KEY` in Vercel dashboard

### Security Checklist (Verify Before Deploy)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in any `NEXT_PUBLIC_*` variable
- [ ] `admin.ts` imports `server-only` package
- [ ] `admin.ts` is NOT imported in any `"use client"` file
- [ ] `.env.local` is in `.gitignore`
- [ ] No `console.log` of any secret/key anywhere in codebase
- [ ] All user-facing queries use the regular client (not admin)
- [ ] RLS policies are enabled on ALL tables
- [ ] API routes verify authentication before using admin client
- [ ] Seed script only runs via CLI (`npx tsx scripts/seed.ts`), not via any API endpoint

---

## Project Structure

```
pollparrot/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── auth/callback/route.ts      # Supabase OAuth callback handler
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx           # My surveys list
│   │   │   ├── surveys/
│   │   │   │   ├── create/page.tsx          # Create new survey
│   │   │   │   ├── [surveyId]/
│   │   │   │   │   ├── edit/page.tsx        # Survey builder/editor
│   │   │   │   │   ├── preview/page.tsx     # Preview survey
│   │   │   │   │   ├── results/page.tsx     # View responses/analytics
│   │   │   │   │   ├── share/page.tsx       # Share & collect responses
│   │   │   │   │   └── settings/page.tsx    # Survey settings
│   │   │   ├── templates/page.tsx           # Survey templates gallery
│   │   │   ├── account/page.tsx             # Account settings + avatar upload
│   │   │   └── layout.tsx                   # Dashboard layout with sidebar
│   │   ├── s/[shareSlug]/page.tsx           # Public survey response page
│   │   ├── s/[shareSlug]/thank-you/page.tsx # Thank you page after submission
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── supabase/route.ts        # Supabase webhook handler (optional)
│   │   ├── layout.tsx                       # Root layout
│   │   ├── page.tsx                         # Landing/home page (marketing)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                              # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                   # Top nav for marketing pages
│   │   │   ├── Sidebar.tsx                  # Dashboard sidebar
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardHeader.tsx
│   │   ├── survey/
│   │   │   ├── SurveyCard.tsx               # Survey list item card
│   │   │   ├── QuestionBuilder.tsx          # Question editor
│   │   │   ├── QuestionTypes/
│   │   │   │   ├── MultipleChoice.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── TextAnswer.tsx
│   │   │   │   ├── Rating.tsx
│   │   │   │   ├── DropdownQuestion.tsx
│   │   │   │   ├── YesNo.tsx
│   │   │   │   ├── LinearScale.tsx
│   │   │   │   ├── DatePicker.tsx
│   │   │   │   ├── FileUpload.tsx           # Uses Supabase Storage
│   │   │   │   └── RankingQuestion.tsx
│   │   │   ├── SurveyPreview.tsx
│   │   │   ├── SurveyRenderer.tsx           # Renders survey for respondents
│   │   │   ├── ResponseChart.tsx            # Charts for results
│   │   │   └── ShareOptions.tsx             # Share link, QR code, email invite
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   ├── OAuthButtons.tsx             # GitHub + Google buttons
│   │   │   └── AuthGuard.tsx
│   │   └── landing/
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── Pricing.tsx
│   │       ├── Testimonials.tsx
│   │       └── CTA.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                    # Browser Supabase client
│   │   │   ├── server.ts                    # Server Component Supabase client
│   │   │   ├── middleware.ts                # Middleware Supabase client
│   │   │   └── admin.ts                     # Service role client (for seed/admin ops)
│   │   ├── validations.ts                   # Zod schemas
│   │   ├── utils.ts                         # Helper functions
│   │   └── constants.ts                     # App constants, plan limits, etc.
│   ├── actions/
│   │   ├── auth.ts                          # Auth server actions
│   │   ├── surveys.ts                       # Survey CRUD actions
│   │   ├── questions.ts                     # Question CRUD actions
│   │   ├── responses.ts                     # Response submission actions
│   │   └── storage.ts                       # File upload actions (Supabase Storage)
│   ├── hooks/
│   │   ├── useToast.ts
│   │   ├── useSurvey.ts
│   │   ├── useUser.ts                       # Supabase auth user hook
│   │   └── useRealtimeResponses.ts          # Supabase Realtime subscription
│   └── types/
│       ├── index.ts                         # Shared TypeScript types
│       └── database.ts                      # Generated Supabase types (from CLI)
├── supabase/
│   ├── migrations/
│   │   ├── 00001_create_profiles.sql
│   │   ├── 00002_create_surveys.sql
│   │   ├── 00003_create_questions.sql
│   │   ├── 00004_create_responses.sql
│   │   ├── 00005_create_answers.sql
│   │   ├── 00006_create_survey_collaborators.sql
│   │   ├── 00007_rls_policies.sql
│   │   ├── 00008_functions_and_triggers.sql
│   │   └── 00009_storage_buckets.sql
│   ├── seed.sql                             # Seed/test data
│   └── config.toml                          # Supabase local config
├── scripts/
│   └── seed.ts                              # TypeScript seed script
├── public/
│   ├── logo.svg                             # PollParrot logo (parrot icon)
│   └── og-image.png
├── middleware.ts                             # Next.js middleware for auth session refresh
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
├── .env.example
├── .env.local
└── README.md
```

## Supabase Database Schema (PostgreSQL Migrations)

All tables use Supabase conventions. Use `uuid` primary keys with `gen_random_uuid()`. Enable Row Level Security (RLS) on ALL tables.

### Migration 00001: profiles (extends Supabase auth.users)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  survey_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

### Migration 00002: surveys

```sql
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  is_template BOOLEAN NOT NULL DEFAULT false,
  template_category TEXT,
  response_count INTEGER NOT NULL DEFAULT 0,
  share_slug TEXT UNIQUE,
  cover_image_url TEXT,
  settings JSONB NOT NULL DEFAULT '{
    "allow_anonymous": true,
    "show_progress_bar": true,
    "shuffle_questions": false,
    "one_question_per_page": false,
    "limit_responses": null,
    "closing_date": null,
    "confirmation_message": "Thank you for completing this survey!",
    "collect_email": false
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_surveys_user_id ON public.surveys(user_id);
CREATE INDEX idx_surveys_status ON public.surveys(status);
CREATE INDEX idx_surveys_share_slug ON public.surveys(share_slug);
CREATE INDEX idx_surveys_is_template ON public.surveys(is_template);

CREATE TRIGGER surveys_updated_at
  BEFORE UPDATE ON public.surveys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.generate_share_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_slug IS NULL THEN
    NEW.share_slug := lower(substr(md5(random()::text), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER surveys_generate_slug
  BEFORE INSERT ON public.surveys
  FOR EACH ROW EXECUTE FUNCTION public.generate_share_slug();
```

### Migration 00003: questions

```sql
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'multiple_choice', 'checkbox', 'text', 'textarea',
    'rating', 'dropdown', 'yes_no', 'linear_scale',
    'date', 'file_upload', 'ranking'
  )),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_required BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  options JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_survey_id ON public.questions(survey_id);
CREATE INDEX idx_questions_sort_order ON public.questions(survey_id, sort_order);
```

### Migration 00004: responses

```sql
CREATE TABLE public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  respondent_email TEXT,
  respondent_name TEXT,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_responses_survey_id ON public.responses(survey_id);
CREATE INDEX idx_responses_completed ON public.responses(survey_id, is_complete);

CREATE OR REPLACE FUNCTION public.increment_response_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_complete = true AND (OLD IS NULL OR OLD.is_complete = false) THEN
    UPDATE public.surveys
    SET response_count = response_count + 1
    WHERE id = NEW.survey_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER responses_increment_count
  AFTER INSERT OR UPDATE ON public.responses
  FOR EACH ROW EXECUTE FUNCTION public.increment_response_count();
```

### Migration 00005: answers

```sql
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  value JSONB NOT NULL DEFAULT '""'::jsonb,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_answers_response_id ON public.answers(response_id);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE UNIQUE INDEX idx_answers_unique ON public.answers(response_id, question_id);
```

### Migration 00006: survey_collaborators

```sql
CREATE TABLE public.survey_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  invited_email TEXT,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(survey_id, user_id)
);

CREATE INDEX idx_collaborators_survey ON public.survey_collaborators(survey_id);
CREATE INDEX idx_collaborators_user ON public.survey_collaborators(user_id);
```

### Migration 00007: RLS Policies

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_collaborators ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- SURVEYS
CREATE POLICY "Users can view own surveys" ON public.surveys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view template surveys" ON public.surveys FOR SELECT USING (is_template = true);
CREATE POLICY "Users can view active surveys" ON public.surveys FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert own surveys" ON public.surveys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own surveys" ON public.surveys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own surveys" ON public.surveys FOR DELETE USING (auth.uid() = user_id);

-- QUESTIONS
CREATE POLICY "View questions of accessible surveys" ON public.questions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.surveys WHERE surveys.id = questions.survey_id AND (surveys.user_id = auth.uid() OR surveys.status = 'active' OR surveys.is_template = true)));
CREATE POLICY "Manage questions of own surveys" ON public.questions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.surveys WHERE surveys.id = questions.survey_id AND surveys.user_id = auth.uid()));

-- RESPONSES
CREATE POLICY "Submit responses to active surveys" ON public.responses FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.surveys WHERE surveys.id = responses.survey_id AND surveys.status = 'active'));
CREATE POLICY "Survey owners can view responses" ON public.responses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.surveys WHERE surveys.id = responses.survey_id AND surveys.user_id = auth.uid()));

-- ANSWERS
CREATE POLICY "Insert answers for active survey responses" ON public.answers FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.responses r JOIN public.surveys s ON s.id = r.survey_id WHERE r.id = answers.response_id AND s.status = 'active'));
CREATE POLICY "Survey owners can view answers" ON public.answers FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.responses r JOIN public.surveys s ON s.id = r.survey_id WHERE r.id = answers.response_id AND s.user_id = auth.uid()));

-- COLLABORATORS
CREATE POLICY "Survey owners manage collaborators" ON public.survey_collaborators FOR ALL
  USING (EXISTS (SELECT 1 FROM public.surveys WHERE surveys.id = survey_collaborators.survey_id AND surveys.user_id = auth.uid()));
CREATE POLICY "Collaborators view their collaborations" ON public.survey_collaborators FOR SELECT USING (auth.uid() = user_id);
```

### Migration 00008: Database functions

```sql
CREATE OR REPLACE FUNCTION public.get_survey_stats(p_survey_id UUID)
RETURNS TABLE(total_responses BIGINT, completed_responses BIGINT, completion_rate NUMERIC, avg_completion_time INTERVAL) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COUNT(*) FILTER (WHERE is_complete = true)::BIGINT,
    CASE WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE is_complete = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 1) ELSE 0 END,
    AVG(completed_at - started_at) FILTER (WHERE is_complete = true)
  FROM public.responses WHERE survey_id = p_survey_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_question_summary(p_question_id UUID)
RETURNS TABLE(answer_value JSONB, count BIGINT, percentage NUMERIC) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (SELECT COUNT(*)::NUMERIC AS cnt FROM public.answers WHERE question_id = p_question_id)
  SELECT a.value, COUNT(*)::BIGINT, ROUND((COUNT(*)::NUMERIC / NULLIF(t.cnt, 0)) * 100, 1)
  FROM public.answers a CROSS JOIN total t
  WHERE a.question_id = p_question_id
  GROUP BY a.value, t.cnt ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Client Setup

### `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

### `src/lib/supabase/admin.ts`
```typescript
/**
 * ⚠️  ADMIN CLIENT — SERVER-ONLY
 * BYPASSES Row Level Security. NEVER import in client components.
 * ONLY use in: Server Actions, API Routes, and scripts.
 */
import 'server-only'

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — required for admin operations')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### `middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/surveys/:path*', '/account/:path*', '/login', '/signup'],
}
```

## Seed Data (`scripts/seed.ts`)

Run via `npx tsx scripts/seed.ts`. Uses `supabaseAdmin` (service role):

- **3 test users** (via `supabase.auth.admin.createUser()`):
  - admin@pollparrot.com / password123 (pro plan)
  - user1@pollparrot.com / password123 (free plan)
  - user2@pollparrot.com / password123 (free plan)

- **3 Storage buckets:** `survey-images` (public), `avatars` (public), `response-files` (private)

- **6 template surveys** with realistic questions:
  - Customer Satisfaction (5 questions — rating, multiple_choice, textarea, yes_no, linear_scale)
  - Employee Engagement (6 questions — linear_scale, multiple_choice, checkbox, textarea, rating, dropdown)
  - Event Feedback (5 questions — rating, multiple_choice, yes_no, textarea, linear_scale)
  - Product Research (7 questions — multiple_choice, checkbox, rating, linear_scale, dropdown, text, textarea)
  - Education/Course Evaluation (5 questions — rating, multiple_choice, textarea, linear_scale, yes_no)
  - Market Research (6 questions — multiple_choice, checkbox, dropdown, linear_scale, text, textarea)

- **3 user surveys** for admin:
  - 1 active with 15 mock responses + answers
  - 1 draft with questions, no responses
  - 1 closed with 8 mock responses + answers

## Auth Flows

**Signup:** `supabase.auth.signUp({ email, password, options: { data: { full_name } } })` → confirmation email → trigger creates profile → redirect to dashboard

**Login:** Email/password via `signInWithPassword()`, OAuth via `signInWithOAuth({ provider: 'github' | 'google' })`, Magic link via `signInWithOtp({ email })`

**Password Reset:** `resetPasswordForEmail(email, { redirectTo: '/reset-password' })` → user clicks email link → `updateUser({ password })`

**OAuth Callback** (`/auth/callback/route.ts`): Exchange code for session via `exchangeCodeForSession(code)` → redirect to dashboard

## Pages to Build

### 1. Landing Page (`/`) — SurveyMonkey-style with dark peach theme
Hero + Features (6) + How It Works (3 steps) + Pricing (Free/Pro/Enterprise) + Testimonials + CTA + Footer

### 2. Auth Pages — Login, Signup, Forgot Password, Reset Password, Verify Email
Clean centered cards, Zod validation, OAuth buttons, magic link, redirect preservation

### 3. Dashboard (`/dashboard`)
Sidebar nav, survey cards grid with status badges, CRUD actions, search + status filter, realtime response counts, empty state

### 4. Survey Builder (`/surveys/create`, `/surveys/[id]/edit`)
Title/description inputs, question builder with all 11 types, per-type option editors, settings panel, auto-save, preview

### 5. Public Survey (`/s/[shareSlug]`)
No auth required, progress bar, all question type renderers, validation, submit → thank you page, file uploads to Storage

### 6. Results (`/surveys/[id]/results`)
Summary stats, per-question charts (CSS bars), individual responses accordion, CSV export, date filter

### 7. Share (`/surveys/[id]/share`)
Copy link, QR code, email invite, social share, embed snippet

### 8. Templates (`/templates`)
Grid with category filter, "Use Template" duplicates to user account

### 9. Account (`/account`)
Profile edit, avatar upload (Supabase Storage), plan info, password change, delete account

## Environment Variables

```env
# .env.example (SAFE to commit — contains no real values)

# ✅ PUBLIC — safe for browser (protected by RLS)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 🔒 SECRET — server-only, NEVER prefix with NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ✅ PUBLIC
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PollParrot
```

**⚠️ When the user provides their Supabase keys:**
1. Write them ONLY to `.env.local` (which is gitignored)
2. NEVER echo/print/log the service role key
3. Verify `.env.local` is in `.gitignore` before writing
4. The `SUPABASE_SERVICE_ROLE_KEY` must NOT have `NEXT_PUBLIC_` prefix

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "seed": "npx tsx scripts/seed.ts",
  "types": "npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/database.ts"
}
```

## Build Order

1. Initialize Next.js 15 with deps (`@supabase/supabase-js`, `@supabase/ssr`, `server-only`, `zod`, `lucide-react`)
2. Tailwind dark peach theme config
3. Supabase client files (client, server, middleware, admin)
4. Next.js middleware for auth
5. TypeScript database types
6. SQL migrations (all 9 files)
7. UI primitives (all components/ui/)
8. Landing page (all sections, fully styled)
9. Auth pages (all 4, functional with Supabase Auth)
10. OAuth callback route
11. Dashboard layout (sidebar + header + responsive)
12. Dashboard page (cards, CRUD, search, filter, realtime)
13. Survey builder (all 11 question types)
14. Public survey page (full submission flow)
15. Results page (stats + charts + CSV export)
16. Share page (URL, QR, email, embed)
17. Templates page (grid + filter + duplicate flow)
18. Account page (profile, avatar, password)
19. Seed script
20. Test full flow: signup → create → publish → share → respond → results → export

Use realistic content everywhere. Every page polished with the dark peach theme.

**IMPORTANT:** Before starting, remind user to:
1. Create a Supabase project at https://supabase.com
2. Copy project URL, anon key, and service role key
3. Enable GitHub + Google OAuth in Supabase Auth settings
4. The SQL migrations will need to be run in Supabase SQL editor or via CLI

Start building now.
