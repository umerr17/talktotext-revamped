# TalkToText Pro (React + Vite + Tailwind)

AI meeting notes: upload a recording, get a structured summary, decisions and action items, then ask
follow-up questions grounded in the transcript, jump to cited timestamps, and rewrite the notes.
Apple-inspired UI: big type, quiet surfaces, pill buttons, frosted navigation, light and dark themes.

## Run it

```bash
npm install
cp .env.example .env        # then set VITE_API_URL to your backend URL
npm run dev                 # http://localhost:5173
```

Put your logo at `public/logo.png`. If the file is missing, a text wordmark is shown instead.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Meeting workspace

Every recording opens with three tabs:

- **Summary & Notes** — the structured summary, plus **Rewrite notes** for an AI preview before saving.
- **Full Transcript** — line-by-line timestamps built from AssemblyAI word timings, with search and a timeline.
- **Ask AI** — a saved conversation grounded in this recording. Answers cite clickable timestamps.

New uploads store word-level timings and show them as short transcript lines. Recordings processed
before this feature can be backfilled from AssemblyAI's stored transcripts (the script backs up the
database first):

```bash
cd backend-talktotext-pro
.venv/bin/python backfill_segments.py --apply
```

If no matching AssemblyAI transcript exists, the recording falls back to a plain transcript without
timestamps.

### AI requirements

Ask AI, note rewriting, and timelines use Gemini through the backend. Set `GOOGLE_API_KEY` in the
backend `.env`; the default model is `gemini-2.5-flash`. Restart the backend after deploying so the
new chat, segment and chapter tables are created automatically. On Google's free tier, transcripts
may be used to improve Google products, so only use it with recordings you are comfortable sharing.

## Important: backend settings

- **Env var renamed:** `NEXT_PUBLIC_API_URL` is now `VITE_API_URL`.
- **Dev URL changed:** the app now runs on port **5173** (Next used 3000). Add `http://localhost:5173` to your
  backend's CORS origins, and to the redirect URL used after Google sign-in (the frontend route is still
  `/auth/callback?token=...`).
- **Deploying:** this is a single-page app, so the host must serve `index.html` for every path.
  `vercel.json` and `public/_redirects` (Netlify/Cloudflare) are included.

## Structure

```
src/
  main.tsx, App.tsx       entry + routes (pages are lazy-loaded)
  index.css               design tokens (colors, radius, fonts) and Tailwind
  config.ts               app name and support email (replace the placeholder)
  pages/                  one file per route
  components/
    ui/                   button, card, input, dialog, ... (only the ones in use)
    sections/             landing page sections
    auth/  dashboard/  meeting/  profile/
  context/user-provider   current user
  lib/api.ts              backend calls (unchanged logic)
```

## Routes

`/` landing · `/login` · `/signup` · `/forgot-password` · `/reset-password` · `/verify-email` ·
`/auth/callback` · `/dashboard` · `/dashboard/upload` · `/dashboard/history` · `/meeting/:id` · `/profile`

## Design

All colors, radii and fonts are tokens in `src/index.css`. Change `--primary` to re-brand the whole app.
The font stack uses SF Pro on Apple devices and Inter elsewhere (bundled locally, no Google Fonts request).
