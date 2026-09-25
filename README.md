# Rohan S · Portfolio

Personal portfolio with a built-in AI assistant that answers questions about my projects, skills and background.

**Stack:** React 19 · Vite · Framer Motion · Lenis smooth scroll · Vercel serverless function for the AI chat.

## Features

- Animated preloader, split-letter hero reveal, rotating role text, parallax + 3D-tilt portrait
- Scroll-linked word reveal, animated stat counters, infinite skills marquee
- Sticky stacked project cards with animated SVG visuals and full case-study modals
- Cursor spotlight bento grid, animated CGPA ring, magnetic buttons, custom cursor
- **AI chat** grounded only in my résumé data, with suggested questions, typewriter replies and an offline fallback
- Fully responsive, keyboard accessible (Esc closes dialogs), respects `prefers-reduced-motion`

## Run locally

```bash
npm install
npm run dev        # site on http://localhost:5173 (chat uses offline mode)
```

To test the real AI locally: `npm i -g vercel && vercel dev`.

## Deploy (Vercel, recommended)

1. Import this repo at [vercel.com/new](https://vercel.com/new). Vite is detected automatically.
2. In **Settings → Environment Variables**, add **one** of:
   - `GEMINI_API_KEY` (free tier at [aistudio.google.com](https://aistudio.google.com/apikey))
   - `GROQ_API_KEY` (free tier at [console.groq.com](https://console.groq.com))
   - `ANTHROPIC_API_KEY`
3. Redeploy. The chat now uses the LLM. Without a key it falls back to the built-in offline engine, so it never breaks.

Optional model overrides: `GEMINI_MODEL`, `GROQ_MODEL`, `ANTHROPIC_MODEL`.

## Editing content

Everything (bio, projects, skills, contact, stats) lives in [`src/data/profile.js`](src/data/profile.js). The site, the AI's knowledge base and the offline answers all read from that one file.

## Structure

```
api/chat.js              serverless LLM endpoint (rate-limited, grounded prompt)
src/data/profile.js      all content
src/lib/localBrain.js    offline chat answers
src/components/          Hero, Sections, Chat, ProjectVisual, Chrome (nav/cursor/preloader), ui
```
