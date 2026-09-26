---
name: portfolio-content
description: How to add or change anything Rohan's portfolio says about him — projects, GitHub links, skills, education, experience, contact details or the resume. Use whenever the task changes site content or what the chat assistant knows.
---

# Editing portfolio content

All content lives in one file: `src/data/profile.js`. The page, the offline chat
answers (`src/lib/localBrain.js`) and the AI endpoint's knowledge base
(`buildKnowledgeBase()` in the same file) all read from it. Never hard-code a fact
about Rohan in a component; add it to `profile.js` and read it from there.

## What lives where in profile.js

| Export | Used for |
| --- | --- |
| `profile` | name, contact links, hero statement, about rows, education (incl. `schooling`), experience, achievements, skills, languages |
| `projects` | the four main project cards and their case-study pop-ups |
| `otherWork` | smaller work shown under "Also built" (currently NIDS) |
| `buildKnowledgeBase()` | plain-text dump of the above, sent to the LLM as its only source of truth |

## Adding a project

1. Add an object to `projects` with every field the existing ones have: `id`
   (lowercase, no spaces), `name`, `tagline`, `domain`, `discipline`, `summary`,
   `how` (3–4 steps), `features`, `facts` (at least 3 `[label, value]` pairs),
   `stack`, `figure`, `github`.
2. Give it a scene: add a small SVG component to `src/components/ProjectCards.jsx`
   and register it in the `scenes` map under the same `id`. Keep it 320×180 and
   use the existing `sc-*` classes so it matches the other cards.
3. Teach the offline chat about it: add an entry to `projectKeys` in
   `src/lib/localBrain.js` with the words people will use to ask about it.
4. The work graph in the hero picks the project up automatically from `stack`.
5. Run `npm test`. `check-content` fails if the GitHub link, facts or case study
   are missing; `test-chat` fails if the chat can't answer about it.

## Rules that have caught me before

- Spell it **Resume**, never "Résumé". A hook blocks the accented form.
- Every project needs a working `https://github.com/rohans-oss/...` link.
  Check the repo is public before adding it, or visitors get a 404.
- The resume PDF (`public/Rohan_S_Resume.pdf`) and the site must say the same
  thing. If a fact changes on one, change it on the other.
- Don't copy placeholder text from resume templates (`[Month Year]`, `[What you built…]`).
  The content check looks for these.
- Only write things Rohan has actually told us. Don't invent dates, metrics or
  employers to fill a gap; leave the field out and note it as pending in `docs/PLAN.md`.

## After editing

The plugin's PostToolUse hook runs `npm test` automatically after edits to
`profile.js`, `src/lib/` or `api/chat.js`. If it reports failures, fix them before
doing anything else. Then check the page with `npm run dev`.
