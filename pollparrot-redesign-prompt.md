# Claude Code Prompt — PollParrot Complete UI/Theme Redesign

## Copy and paste this into Claude Code:

---

## Task: Complete UI & Theme Redesign

The current PollParrot UI looks outdated and heavy with the dark brown/peach theme. I need a **complete visual overhaul** to make it look like a modern, vibrant, premium SaaS product — similar to the polish of **Linear, Notion, Vercel, Stripe, or Clerk**.

## New Design Direction

### Theme: Light, Clean, Vibrant Peach

**DO THIS:**
- Clean **white/light backgrounds** as the primary canvas
- **Peach/coral as the accent color** (buttons, highlights, active states, gradients) — NOT the background
- Plenty of **whitespace** — let the content breathe
- Modern, crisp typography with clear hierarchy
- Subtle shadows, borders, and depth — not flat, not heavy
- Smooth micro-interactions and hover states
- Professional and trustworthy — like a $50M SaaS product

**DO NOT:**
- Dark brown/black backgrounds on any page (except maybe a small dark footer)
- Muddy, warm, brownish tones anywhere
- Cramped layouts with no spacing
- Old-school boxy card designs
- Overly saturated or neon colors

### New Color Palette

Replace the ENTIRE Tailwind color config with:

```
Primary (Peach/Coral accent):
  50:  #FFF5F0
  100: #FFE8DB
  200: #FFD0B8
  300: #FFB08A
  400: #FF8C5C
  500: #FF6B35   ← Primary button color
  600: #E8551F
  700: #C4410F
  800: #9E3610
  900: #7E2E11

Neutral (Cool grays, NOT warm/brown):
  50:  #F9FAFB
  100: #F3F4F6
  200: #E5E7EB
  300: #D1D5DB
  400: #9CA3AF
  500: #6B7280
  600: #4B5563
  700: #374151
  800: #1F2937
  900: #111827

Success:  #10B981
Warning:  #F59E0B
Error:    #EF4444
Info:     #3B82F6

Backgrounds:
  Page:     #FFFFFF
  Card:     #FFFFFF
  Sidebar:  #F9FAFB
  Hover:    #FFF5F0 (very light peach tint)
  Selected: #FFE8DB (light peach)

Text:
  Primary:   #111827 (near black)
  Secondary: #6B7280 (gray)
  Muted:     #9CA3AF (light gray)
  On-accent:  #FFFFFF (white text on peach buttons)

Borders: #E5E7EB (light gray)
```

### Typography & Spacing Rules

- **Font:** Use `Inter` from Google Fonts (or system font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
- **Headings:** Bold (700), tight letter-spacing (-0.02em)
  - Hero H1: 56-64px
  - Section H2: 36-42px
  - Card H3: 20-24px
- **Body text:** Regular (400), 16px, line-height 1.6, color `#374151`
- **Spacing:** Use generous padding — sections should have `py-20` or `py-24`, cards `p-6` or `p-8`
- **Border radius:** Slightly rounded — `rounded-lg` (8px) for cards, `rounded-xl` (12px) for hero elements, `rounded-full` for buttons/badges

### Component Redesign Rules

**Buttons:**
```
Primary:   bg-[#FF6B35] text-white hover:bg-[#E8551F] rounded-full px-6 py-3 font-semibold shadow-sm
Secondary: bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-full px-6 py-3
Ghost:     bg-transparent text-gray-600 hover:bg-gray-100 rounded-full px-4 py-2
```

**Cards:**
```
bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6
```

**Badges/Status:**
```
Active: bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm font-medium
Draft:  bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-sm font-medium
Closed: bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-sm font-medium
```

**Inputs:**
```
bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 
focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] 
placeholder:text-gray-400
```

**Sidebar (Dashboard):**
```
bg-[#F9FAFB] border-r border-gray-200 
Active item: bg-[#FFF5F0] text-[#FF6B35] font-medium rounded-lg
Inactive item: text-gray-600 hover:bg-gray-100 rounded-lg
```

---

## Page-by-Page Redesign Instructions

### Landing Page (`/`)

**Navbar:**
- White background with subtle bottom border (`border-b border-gray-100`)
- PollParrot logo on left (use peach/coral parrot icon + dark text)
- Nav links in gray-600, hover peach
- "Log in" as ghost button, "Sign up" as primary peach rounded-full button
- Sticky on scroll with slight backdrop blur

**Hero Section:**
- White background
- Large bold headline in near-black (`#111827`): "Create Surveys That Get Results"
- "Get Results" in peach/coral gradient text (`bg-gradient-to-r from-[#FF6B35] to-[#FF8C5C] bg-clip-text text-transparent`)
- Subtitle in gray-500, max-w-2xl, centered
- Two CTA buttons: "Get Started Free →" (peach primary), "See How It Works" (secondary outline)
- Below CTAs: trust badges in gray-400 text with checkmark icons
- **Dashboard mockup/preview image** below the CTAs — show a clean screenshot of the dashboard inside a browser frame with subtle shadow. Use a `rounded-2xl shadow-2xl border border-gray-200` container.

**Features Section:**
- Light gray background (`bg-gray-50`)
- "FEATURES" label in peach, uppercase, tracking-wider, text-sm font-semibold
- Section heading in near-black
- 3-column grid (2 on mobile) of feature cards
- Each card: white bg, rounded-xl, p-8, icon in a peach-tinted circle (`bg-[#FFF5F0] p-3 rounded-xl`), heading, description in gray-500
- Subtle hover lift (`hover:-translate-y-1 transition-transform`)

**How It Works:**
- White background
- 3 steps in a horizontal flow with numbered circles (1, 2, 3) in peach
- Step connector lines between them
- Clean icons, short descriptions

**Pricing Section:**
- White or very light gray background
- 3 pricing cards side by side
- Middle card (Pro) is "recommended" — slightly larger, has peach border/accent and a "Most Popular" badge
- Clean checkmark lists for features
- CTA buttons: Free = secondary, Pro = primary peach, Enterprise = secondary

**Testimonials:**
- Light peach tinted background (`bg-[#FFF5F0]`)
- Quote cards with avatar, name, company, star rating
- Clean sans-serif italic quotes

**CTA Section:**
- Peach gradient background (`bg-gradient-to-r from-[#FF6B35] to-[#FF8C5C]`)
- White heading and subtext
- White button with peach text

**Footer:**
- Dark footer is fine (`bg-gray-900 text-gray-400`)
- Logo, link columns, social icons, copyright

---

### Auth Pages (`/login`, `/signup`)

- Very light background (`bg-gray-50` or subtle gradient)
- Centered card: `bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md`
- PollParrot logo at top of card
- Clean form with proper spacing between fields
- OAuth buttons: white with border, provider icon, full-width
- Divider: "or continue with email" in gray-400 with lines
- Primary submit button: full-width peach
- Link to alternate page at bottom in gray text

---

### Dashboard (`/dashboard`)

- **Sidebar:** Light gray bg (`#F9FAFB`), clean nav items with Lucide icons, active item has light peach bg, user avatar at bottom
- **Main area:** White background
- **Header:** Welcome message, "Create Survey" button (peach, prominent)
- **Stats row:** 4 clean stat cards (white, rounded-xl, subtle border) showing total surveys, responses, completion rate, active surveys
- **Survey list:** Clean cards with:
  - Survey title (font-semibold, text-lg)
  - Status badge (colored pill)
  - Response count and date in gray text
  - Three-dot menu for actions
  - Subtle hover shadow transition
- **Empty state:** Centered illustration, "Create your first survey" heading, peach CTA button
- **Search/filter bar:** Clean input with search icon, pill-style filter tabs (All, Active, Draft, Closed)

---

### Survey Builder (`/surveys/create`, `/surveys/[id]/edit`)

- Clean white workspace
- Left panel: Question list/outline
- Center: Active question editor — large, spacious, well-padded
- Right panel or top bar: Settings toggles
- Question cards: white with left border accent (peach for selected, gray for others)
- Add question button: dashed border card with + icon
- Question type selector: clean dropdown or modal grid with icons

---

### Public Survey Page (`/s/[shareSlug]`)

- Minimal, focused design — no distracting UI
- White card on light gray background
- Progress bar in peach at the top
- Clean question typography
- Peach accent for selected options, radio buttons, checkboxes
- "Next" / "Submit" buttons in peach
- Thank you page: centered, celebratory, clean

---

## Files to Update

Update ALL of these — every component must reflect the new theme:

1. `tailwind.config.ts` — Replace entire color palette
2. `src/app/globals.css` — Update base styles, remove dark theme CSS variables
3. `src/app/layout.tsx` — Add Inter font import, update body classes
4. `src/app/page.tsx` — Complete landing page redesign
5. `src/components/ui/*` — Every UI primitive (Button, Input, Card, Badge, Modal, Toast, etc.)
6. `src/components/layout/*` — Navbar, Sidebar, Footer, DashboardHeader
7. `src/components/landing/*` — Hero, Features, HowItWorks, Pricing, Testimonials, CTA
8. `src/components/auth/*` — LoginForm, SignupForm, OAuthButtons
9. `src/components/survey/*` — SurveyCard, QuestionBuilder, all QuestionTypes, ResponseChart
10. `src/app/(auth)/layout.tsx` — Auth page layout
11. `src/app/(dashboard)/layout.tsx` — Dashboard layout
12. All remaining page files

## Quality Checks

After redesigning, verify:
- [ ] NO dark brown/black backgrounds remain anywhere (except footer)
- [ ] ALL pages use white/light backgrounds
- [ ] Peach (#FF6B35) is used ONLY as accent (buttons, highlights, active states)
- [ ] Text is dark on light — high contrast, easy to read
- [ ] Cards have subtle shadows and borders, not heavy dark backgrounds
- [ ] Hover states are smooth with transitions
- [ ] Mobile responsive — test at 375px width
- [ ] Consistent spacing — nothing looks cramped
- [ ] `npm run build` passes with no errors
- [ ] Looks like a modern SaaS product you'd pay for

## Reference Aesthetic

The final result should feel like a blend of:
- **Stripe's** clean typography and whitespace
- **Linear's** crisp UI and subtle hover effects
- **Notion's** approachable, friendly design
- **Clerk's** auth page polish
- But with a distinctive **warm peach/coral** personality

Start now. Begin with tailwind.config.ts and globals.css, then work through every component and page systematically. Do not skip any file.
