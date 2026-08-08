# Thrive

Platform for Filipino VAs — structured roadmap, practical tools, and scam protection. 100% free — no plans, no payments.

## Stack

- **Next.js 15** (App Router) + React 19 + Tailwind CSS v4
- **SQLite** via Turso (@libsql/client) — cloud-hosted, no local database required
- **Auth:** custom — scrypt password hashing + httpOnly session cookies
- Fonts: Newsreader, Public Sans, IBM Plex Mono (Google Fonts)

## Running

```bash
npm install
npm run dev        # development — http://localhost:3000
npm run build      # production build
npm start          # production server
```

The database (SQLite) lives at `data/nexus.db` — created automatically with seed data (Apply Here directory, courses, jobs, wins placeholders) on first run.

## Sitemap

- `/` Home · `/get-started` · `/niches` · `/equipment` · `/apply-here` · `/red-flags`
- `/first-90-days` · `/templates` · `/wins` · `/faq` · `/about` · `/courses` · `/feedback`
- Auth: `/signup` `/login` `/forgot-password` `/reset-password`
- `/dashboard` — progress tracker, saved quiz results, weekly check-in
- Tools: `/tools/readiness` `/tools/niche-finder` `/tools/interview-coach` `/tools/cover-letter` `/tools/pitch-calculator` `/tools/tracker` `/tools/budget` `/tools/timezone` `/tools/red-flag-checker` `/tools/invoice-generator` `/tools/mock-interview` `/tools/resume-builder` `/tools/contributions-calculator`
- AI: `/assistant` — free AI VA career assistant (Gemini, 40 messages/day/user)
- Admin: `/admin` — manage the Apply Here directory, jobs, and course library

## Account System

- Sign up / log in / log out / password reset (email service not yet wired — dev mode shows the reset link directly)
- Session cookies (httpOnly, 30 days), password hashed with scrypt
- Everything is free; an account is only required to save progress, quiz results, and applications
- AI features (VA assistant, mock interview, cover letter generator) use the Gemini API via `GEMINI_API_KEY` — assistant capped at 40 messages/day/user, other AI generations at 10/month/user

## TODO

- Password reset has a TODO in `app/api/auth/forgot/route.ts` for the email service (SMTP/Resend/etc.)

## Structure

```
app/            — pages (App Router) + API routes
components/     — Nav, Footer, NetworkCanvas, quizzes, tools, forms
lib/            — db.ts (schema + seed), auth.ts (sessions), quizzes.ts (scoring), progress-actions.ts
data/           — static content (roadmap, niches, equipment, templates, faqs, red flags, timeline)
```
