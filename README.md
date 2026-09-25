# Rohan S — Portfolio

**Live:** https://rohans-oss.github.io/portfolio/

Personal portfolio with a built-in AI assistant that answers questions about my projects, skills and background.

**Stack:** React 19, Vite, Framer Motion, d3-force, self-hosted Schibsted Grotesk. A Vercel serverless function powers the AI chat.

## What's on the page

- **Welcome animation**: a short "Welcome to Rohan's portfolio" opener (once per visit, skippable, off for reduced-motion users).

- **Map of my work**: an interactive force-directed graph of every project and the tools it uses. Point at a tool to trace where it's used; select a project to open its write-up. Nodes can be dragged.
- **Project cards**: TrustRail, Drugos, MedFlow AI and Crop Disease, each with its own animated scene, 3D tilt on hover and a case-study pop-up (how it works, key facts, features, stack, GitHub link).
- About, experience and education, skills, and a contact form that opens the visitor's email app.
- **Resume download** (`public/Rohan_S_Resume.pdf`).
- **AI chat** that answers only questions about me, grounded in my resume data, with an offline fallback.
- White theme with subtle topographic backgrounds, scroll reveals, an animated project graph and skill tooltips. Keyboard accessible and respects reduced motion.

## Run locally (VS Code)

**Requires Node.js 20.19+ or 22+** ([download](https://nodejs.org)). Check with `node -v`.

```bash
git clone https://github.com/rohans-oss/portfolio.git
cd portfolio
npm install
npm run dev
```

The site opens at **http://localhost:5173**. In VS Code you can also press **Ctrl+Shift+B** (Cmd+Shift+B on Mac) to start it.

### Turn on the full AI chat locally (optional)

1. Copy `.env.example` to a new file named `.env`
2. Paste one free key into it, e.g. `GEMINI_API_KEY=your-key-here`
3. Restart `npm run dev`

Without a key the chat still works using built-in offline answers from the resume data. `.env` is git-ignored, so your key never gets pushed.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload + local AI endpoint |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build at http://localhost:4173 |
| `npm run deploy:pages` | Build and publish to GitHub Pages manually (pushing to `main` already does this automatically) |

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
