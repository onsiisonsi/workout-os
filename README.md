# Workout OS

Mobile-first tracker for Talal's hybrid longevity workout routine.

Features:

- Fixed weekly plan: upper aesthetics, KOT lower mobility, Zone 2, full-body strength, VO2, recovery
- Per-set weight/reps/RIR logging
- Rest timer with vibration on supported phones
- Technique video search links and exercise cues
- Readiness / pain / energy scoring
- Local-first storage with optional Supabase sync
- PWA manifest for "Add to Home Screen"

## Local dev

```bash
npm install
npm run dev
```

## Supabase setup

Create a Supabase project, run `supabase/schema.sql`, then set Vercel env vars:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Without these variables, the app works local-first in browser storage.

## Deploy

```bash
vercel --prod
```
