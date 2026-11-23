# CampusFind AI

**A smart, AI-assisted lost-and-found platform for campuses.**

CampusFind AI helps students report missing or found belongings, discover potential matches, and complete item recovery through a structured, role-based workflow. The application also includes an admin portal for campus security to review reports and oversee handovers.

**Live demo:** https://code-forge-rust-iota.vercel.app

## About

CampusFind AI centralizes campus lost-and-found activity instead of relying on scattered WhatsApp messages, notice boards, and security-office records.

The platform allows users to:

- Submit detailed lost and found reports with locations, descriptions, dates, and images
- Explore campus reports and view item details
- Find potential lost-versus-found matches using a weighted similarity algorithm
- Use TrustLoop recovery requests to coordinate secure meetings and handovers
- Receive in-app notifications about matches and recovery status changes
- Manage reports and user activity through a dedicated admin dashboard

AI suggestions are used only to rank potential matches. Ownership is still verified by humans before an item is marked as recovered.

## Features

- **Student accounts:** registration, login, protected routes, and profiles
- **Lost and found reporting:** item category, color, location, date, description, private details, and image support
- **Item discovery:** searchable and filterable public item listings
- **AI matching:** weighted scores based on description, category, location, and date similarity
- **TrustLoop workflow:** recovery requests, acceptance, meeting scheduling, verification, and handover confirmation
- **Notifications:** updates for matches, recovery requests, meetings, and completed returns
- **Admin portal:** report, match, recovery, verification, user, analytics, settings, and returned-item management
- **Demo mode:** works with in-memory data when Supabase credentials are not configured

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Supabase (PostgreSQL, Authentication, and database services)
- Lucide React
- Oxlint

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- Optional: a Supabase project

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

### Demo mode

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided, the application automatically uses a local demo mode with ready-to-test accounts.

Demo accounts:

| Role | Email | Password |
|---|---|---|
| Student | `student@campus.edu` | `password123` |
| Student | `student2@campus.edu` | `password123` |
| Admin | `admin@campus.edu` | `password123` |

## Supabase Configuration

For persistent database and authentication support:

1. Create a Supabase project.
2. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Add your Supabase project URL and anonymous key:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Run `supabase_schema.sql` in the Supabase SQL editor to create the application tables and demo RLS policies.

> Supabase credentials and database policies should be reviewed before using the demo in production. Private details, role checks, and admin authorization must be enforced server-side for a real deployment.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Project Structure

```text
src/
├── components/     # Shared UI and dashboard layout components
├── context/        # Authentication context and providers
├── lib/            # Supabase and application constants
├── pages/          # Student, public, and admin pages
├── services/       # Application data and integration logic
├── types/          # Shared TypeScript types
├── utils/          # Matching and helper utilities
├── App.tsx         # Application routes
└── main.tsx        # React entry point
```

## Database

The Supabase schema provides tables for:

- Profiles
- Lost and found items
- AI-generated matches
- Recovery requests
- Notifications
- Administrative logs

See `supabase_schema.sql` for table definitions and policies.

## Development Plan

See `PLAN.md` for the full feature specification, data model, trust and safety requirements, testing scenarios, and implementation roadmap.

## Safety and Privacy

- Never publish full student IDs, banking details, passwords, or unnecessary personal contact information.
- Keep ownership evidence private and disclose it only to authorized participants.
- Use supervised campus locations for valuable-item handovers.
- Do not treat an algorithmic match as proof of ownership.
- Require real authentication and server-side authorization before deploying role-restricted features.
