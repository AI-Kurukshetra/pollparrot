# PollParrot

A modern survey builder application built with Next.js 16, Supabase, and Tailwind CSS 4. Create beautiful surveys, collect responses, and analyze results with ease.

## Features

- **Survey Builder** — Drag-and-drop survey editor with 11 question types
- **Question Types** — Short text, long text, multiple choice, checkbox, dropdown, rating, scale, date picker, file upload, ranking, and matrix
- **Templates** — Pre-built survey templates for common use cases
- **Real-time Updates** — Live response counts via Supabase Realtime
- **Analytics Dashboard** — View response summaries and export to CSV
- **Sharing** — Generate shareable links, embed codes, and QR codes
- **Authentication** — Email/password, OAuth (Google, GitHub), and magic links
- **Dark Theme** — Beautiful dark peach theme throughout

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router and Turbopack
- **Database**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Tailwind CSS 4 with CSS-first `@theme inline`
- **Language**: TypeScript with strict mode
- **Validation**: Zod for schema validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pollparrot.git
cd pollparrot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Find your keys in Supabase Dashboard → Settings → API.

### 5. Run database migrations

```bash
npm run db:migrate
```

Or manually run the SQL files in `supabase/migrations/` in your Supabase SQL Editor.

### 6. Seed the database (optional)

```bash
npm run seed
```

This creates test users and template surveys:
- `admin@pollparrot.com` / `password123` (Pro plan)
- `user1@pollparrot.com` / `password123` (Free plan)
- `user2@pollparrot.com` / `password123` (Free plan)

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run database migrations |
| `npm run db:types` | Generate TypeScript types from Supabase |
| `npm run seed` | Seed database with test data |

## Project Structure

```
pollparrot/
├── public/              # Static assets
├── scripts/             # Database scripts
│   ├── run-migrations.ts
│   └── seed.ts
├── src/
│   ├── actions/         # Server Actions
│   │   ├── account.ts   # Profile management
│   │   ├── analytics.ts # Survey analytics
│   │   ├── auth.ts      # Authentication
│   │   ├── questions.ts # Question CRUD
│   │   ├── responses.ts # Response handling
│   │   ├── surveys.ts   # Survey CRUD
│   │   └── templates.ts # Template system
│   ├── app/             # Next.js App Router
│   │   ├── (auth)/      # Auth pages (login, signup, etc.)
│   │   ├── (dashboard)/ # Protected dashboard pages
│   │   ├── s/           # Public survey pages
│   │   └── layout.tsx   # Root layout
│   ├── components/      # React components
│   │   ├── survey/      # Survey-related components
│   │   └── ui/          # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configurations
│   │   └── supabase/    # Supabase clients
│   └── types/           # TypeScript types
├── supabase/
│   └── migrations/      # SQL migration files
└── tailwind.config.ts   # Tailwind configuration
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as Sensitive)
4. Deploy!

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. It's only used in server-side code.
- The `admin.ts` client imports `server-only` to prevent accidental client-side usage.
- All user-facing queries use the regular Supabase client with RLS enforcement.
- Never prefix secret keys with `NEXT_PUBLIC_`.

## Troubleshooting

### "Missing environment variables" error
Ensure `.env.local` exists and contains all required variables.

### Database migration fails
Run migrations manually via Supabase SQL Editor. Copy the SQL from `supabase/migrations/` files.

### Auth redirects not working
Check that `NEXT_PUBLIC_APP_URL` is set correctly and matches your Site URL in Supabase Auth settings.

### Realtime not updating
Enable Realtime for the `responses` table in Supabase Dashboard → Database → Replication.

## License

MIT License - feel free to use this project for your own purposes.
