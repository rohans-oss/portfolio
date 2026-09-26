---
name: deploy-pages
description: How the portfolio is built and published to GitHub Pages, and how to fix a broken or stale live site (404s, missing assets, old version showing). Use for anything about deploying, the live URL, the gh-pages branch or the GitHub Actions workflow.
---

# Deploying to GitHub Pages

Live site: https://rohans-oss.github.io/portfolio/

## How a deploy happens

Nothing is deployed by hand. `.github/workflows/deploy.yml` runs on every push to
`main`:

1. `npm ci`
2. lint (`oxlint src api scripts`)
3. `npm test` (content checks + chat tests)
4. `vite build --base /portfolio/`
5. force-push `dist/` to the `gh-pages` branch

GitHub Pages serves `gh-pages` from `/ (root)`. If any step fails, the old site
stays up. The `pre-push` hook runs steps 2–4 locally first so failures show up
before the push, not after.

## Things that break the site

| Symptom | Cause | Fix |
| --- | --- | --- |
| "There isn't a GitHub Pages site here" | Repo was made private (free Pages needs a public repo), or Pages source isn't set | Make the repo public; Settings → Pages → Deploy from a branch → `gh-pages` / `/ (root)` |
| Blank page, 404s for `/assets/...` in the console | Built without `--base /portfolio/`, or a path hard-coded as `/something` | Use `import.meta.env.BASE_URL` in JS and `%BASE_URL%` in `index.html`; import assets from `src/assets` |
| Old version still showing | Browser cache, or the workflow failed | Hard refresh (Ctrl+F5); check the Actions tab for a red run |
| Link preview has no image on WhatsApp | Link was shared before `og.png` existed and is cached | Share the link fresh; `og:image` must stay an absolute URL |

## Checking a deploy

- Latest deploy commit: `git ls-remote origin refs/heads/gh-pages`, or clone the
  branch and read `git log -1`. The workflow's commit message is `Deploy <sha>`,
  where `<sha>` is the `main` commit it built.
- `/portfolio-kit:deploy-status` does this comparison for you.

## Vercel (optional)

GitHub Pages only serves static files, so the chat uses its offline engine there.
For real LLM answers, import the repo on Vercel and set `GEMINI_API_KEY` (or
`GROQ_API_KEY` / `ANTHROPIC_API_KEY`). `api/chat.js` is already a Vercel function.
Vercel's GitHub app needs access to the repo before it can import it.
