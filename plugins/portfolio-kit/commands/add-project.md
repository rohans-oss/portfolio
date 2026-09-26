---
description: Add a new project to the portfolio (card, case study, graph node and chat answers)
argument-hint: <project name> [github url]
---

Add a new project to the portfolio: $ARGUMENTS

Follow the portfolio-content skill. Before writing anything, ask me for whatever
you don't have yet: a one-line tagline, the domain (e.g. FinTech), 3–4 "how it
works" steps, key facts with real numbers, the tech stack and the GitHub URL.
Don't make up metrics.

Then:
1. Add the project to `projects` in `src/data/profile.js`.
2. Add a matching animated scene in `src/components/ProjectCards.jsx` and register it in `scenes`.
3. Add its keywords to `projectKeys` in `src/lib/localBrain.js`, plus an on-topic case in `scripts/test-chat.mjs`.
4. Run `npm test` and `npm run build`, and fix anything that fails.
5. Show me a short summary of what changed. Don't commit or push unless I ask.
