# Deployment Guide

## Quick Deploy Commands

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main

# Vercel will automatically redeploy!
```

## Environment Variables (Vercel Dashboard)

Make sure these are set in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

## Local Development

```bash
npm run dev
# Visit http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Supabase Setup

1. Create Supabase project
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql`
3. Copy credentials to Vercel environment variables
