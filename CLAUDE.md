# CLAUDE.md

Notes for Claude Code (and for me) when working in this repo.

This is my personal portfolio: a single-page React site with a small assistant
that answers questions about me. It's live at https://rohans-oss.github.io/portfolio/
and it deploys itself whenever `main` changes, so anything merged to `main` is
public within a couple of minutes. Treat `main` accordingly.

## Commands

```bash
npm install                  # first time only (Node 20.19+ — see .nvmrc)
npm run dev                  # http://localhost:5173, also serves /api/chat locally
npm test                     # content checks + chat tests (fast, no browser)
npm run build                # production build into dist/
npx oxlint src api scripts   # lint
```

To try the real LLM chat locally, copy `.env.example` to `.env` and put one API
key in it. Without a key the chat falls back to the offline answers, which is
also what the live site uses.

## Where things are

- `src/data/profile.js` — every fact about me. The page, the offline chat and the
  AI prompt all read from here.
- `src/components/Page.jsx` — the page sections, top to bottom: header, hero,
  work, about, experience/education, skills, contact, "let's build together",
  thank you, footer.
- `src/components/ProjectCards.jsx` — project cards, the small animated scene on
  each card, and the case-study pop-up.
- `src/components/WorkGraph.jsx` — the d3-force graph of projects and tools in the hero.
- `src/components/Intro.jsx` — the "Welcome to Rohan's portfolio" opening screen.
- `src/components/Chat.jsx` — the chat panel.
- `src/lib/scope.js` — decides whether a question is about me.
- `src/lib/localBrain.js` — the offline answers.
- `api/chat.js` — Vercel function that calls Gemini, Groq or Claude when a key is set.
- `scripts/` — `test-chat.mjs` and `check-content.mjs`, run by `npm test`.
- `plugins/portfolio-kit/` — the Claude Code plugin for this repo (see below).
- `docs/PLAN.md` — what's built, what's pending, and the plugin spec.

## How I want things done

- Content goes in `profile.js`, never straight into a component. If you catch
  yourself typing a project name or a number into JSX, it belongs in the data file.
- The chat only talks about me. Anything else gets the refusal message in
  `scope.js`. If you change `scope.js` or `localBrain.js`, add a test case to
  `scripts/test-chat.mjs` for whatever you fixed. Don't loosen the "every word must
  be known" rule just to get one question through; that's how "who is Manoj" got
  answered with my bio the first time round.
- Don't invent facts about me. If something is missing (internship dates, demo
  links), leave it out and add it to the pending list in `docs/PLAN.md`.
- It's spelled "Resume", not "Résumé". The site and the PDF should say the same
  things, so if a fact changes in one, change it in the other.
- The site is served from `/portfolio/`, not `/`. Don't hard-code root paths. Use
  `import.meta.env.BASE_URL` in JS, `%BASE_URL%` in `index.html`, and import images
  from `src/assets` so Vite rewrites them.
- Don't push to `gh-pages` and don't edit `dist/`. Push to `main`; the GitHub Actions
  workflow lints, tests, builds and publishes.
- The repo has to stay public. Free GitHub Pages stops serving private repos, and
  the site went down once because of that.
- Keep scripts and hooks in Node rather than bash so they work on any OS.
- Never commit `.env`.

## Design rules

My teacher's first review was that the early version looked AI-generated, so the
current design is deliberately plain. Please keep it that way.

- White background, no dark mode. Colours come from my resume: ink `#1d2b2a`,
  teal `#16736c`, saffron `#e0a21a`.
- One typeface, Schibsted Grotesk, self-hosted through `@fontsource`. Hierarchy
  comes from size and weight, not from mixing fonts.
- None of the usual template tells: glowing gradient blobs, emoji, all-caps labels
  above every heading, "01 / 02" numbering on things that aren't steps, custom
  cursors, loading counters.
- Motion should show something real. The graph pulses show which tools feed which
  project; each card's scene shows what that project does. Everything must respect
  `prefers-reduced-motion`.
- Check phone width (390px) before calling a UI change done. No sideways scrolling.

## Checking your work

- Run `npm test` after touching content or chat code. The plugin hook runs it for you.
- `npm run build` has to pass.
- For anything visual, look at it in `npm run dev` at desktop and phone widths.
  A passing build doesn't mean it looks right.

## The portfolio-kit plugin

`.claude/settings.json` points Claude Code at the marketplace in this repo and
enables `portfolio-kit`, so it's offered as soon as the repo is trusted. What it
adds:

- **Skills**: `portfolio-content` (how to add or change content), `chat-guardrails`
  (how the chat decides what to answer), `deploy-pages` (how deploys work and how
  to fix a broken site).
- **Commands**: `/portfolio-kit:add-project`, `/portfolio-kit:test-chat`,
  `/portfolio-kit:preflight`, `/portfolio-kit:deploy-status`.
- **Hooks**: blocks edits to `.env`, `dist/` and the "Résumé" spelling; re-runs
  `npm test` after edits to content or chat code; before any `git push`, runs
  lint, tests and a build, and blocks a push straight to `gh-pages`.

The full spec is in `docs/PLAN.md`. Run `claude plugin validate --strict plugins/portfolio-kit`
after changing the plugin.
