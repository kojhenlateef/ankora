# Ankora ⚓

Dein digitaler Begleiter für behördliche Angelegenheiten in Deutschland.

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **next-intl** - Internationalization (7 languages with RTL support)
- **Supabase** - Authentication, Database (Postgres), Storage
- **Lucide React** - Icons

## Supported Languages

- 🇩🇪 Deutsch (German)
- 🇬🇧 English
- 🇹🇷 Türkçe (Turkish)
- 🇸🇦 العربية (Arabic) - RTL
- 🏳️ کوردی سۆرانی (Kurdish Sorani) - RTL
- 🏳️ Kurdî Kurmancî (Kurdish Kurmanji)
- 🇮🇷 فارسی (Persian/Farsi) - RTL

## Features (Sprint 1)

1. **Landing Page** - Multi-language selection (7 languages)
2. **Authentication** - Email-based registration and login via Supabase
3. **Onboarding Wizard** - 4-step guided setup:
   - Language selection
   - Status (Asylum, EU Citizen, Skilled Worker, Student)
   - Location (City/Postal Code)
   - Personal goal
4. **Personalized Dashboard** - Status-based checklist view
5. **Authority Checklists** - Progress tracking with 4 different status types

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL in the SQL Editor

This will create:
- `profiles` table with RLS policies
- `checklist_items` table with seed data
- `user_checklist_progress` table with RLS policies
- All necessary triggers and functions

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ankora/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (app)/            # Protected app pages
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   └── onboarding/   # Onboarding wizard
│   │   ├── layout.tsx        # Root layout with i18n
│   │   └── page.tsx          # Landing page
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # shadcn/ui components
├── i18n/
│   ├── request.ts            # i18n request config
│   └── routing.ts            # i18n routing config
├── lib/
│   ├── supabase/             # Supabase client & server
│   ├── locale.ts             # Locale utilities
│   └── utils.ts              # General utilities
├── messages/                 # Translation files (7 languages)
├── supabase/
│   └── migrations/           # Database migrations
├── middleware.ts             # next-intl middleware
└── next.config.mjs           # Next.js config
```

## Database Schema

### Tables

1. **profiles**
   - User profile information
   - Language preference
   - Status (asylum, eu_citizen, skilled_worker, student)
   - Location and goals
   - Onboarding completion status

2. **checklist_items**
   - Checklist items for each status type
   - Multilingual support (7 languages)
   - Order and categorization

3. **user_checklist_progress**
   - User-specific progress tracking
   - Completion status for each item

## User Flow

1. **Landing** → Select language
2. **Register/Login** → Create account or sign in
3. **Onboarding** → Complete 4-step wizard
4. **Dashboard** → View personalized checklist and track progress

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Status Types

- **asylum** - Asylverfahren / Asylum Seeker
- **eu_citizen** - EU-Bürger / EU Citizen
- **skilled_worker** - Fachkraft / Skilled Worker
- **student** - Student / Student

Each status type has its own customized checklist with 5 essential tasks.

## Design System

- **Primary Color**: `#1A6BFF` (Ankora Blue)
- **Design**: Clean, modern, accessible (WCAG AA)
- **Approach**: Mobile-first responsive design
- **Logo**: Anchor emoji ⚓ (placeholder)

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication handled by Supabase Auth
- Secure environment variables

## RTL Support

The app automatically detects RTL languages (Arabic, Kurdish Sorani, Persian) and applies the correct text direction via the `dir` attribute on the `<html>` element.

## Contributing

This is a Sprint 1 MVP. Future enhancements may include:
- Document upload and management
- Appointment scheduling
- Multi-step form guides
- Resource library
- Community features

## License

Proprietary - All rights reserved

---

Built with ❤️ for helping people navigate German bureaucracy
