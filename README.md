# openclaw-projects

Minimal accountability MVP (Next.js) with:
- Supabase magic-link auth
- Daily check-ins + streak view
- Stripe $2/month checkout endpoint
- Vercel deployment

## Routes
- `/` landing page
- `/auth` magic link sign-in
- `/dashboard` check-ins + subscription status
- `/api/create-checkout` Stripe checkout session creation
- `/api/stripe-webhook` Stripe webhook receiver

## Files
- `supabase-schema.sql` — Postgres schema + RLS policies
- `.env.example` — required environment variables
