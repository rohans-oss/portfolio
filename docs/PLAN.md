# Portfolio: plan and spec

**Owner:** Rohan S · **Repo:** [rohans-oss/portfolio](https://github.com/rohans-oss/portfolio) · **Live:** https://rohans-oss.github.io/portfolio/
**Last updated:** 26 September 2026

## 1. What I'm building

A personal portfolio site that recruiters, teachers and people I meet at
hackathons can open from a link on any phone or laptop. It has to do three things:

1. Show my projects well enough that someone understands what each one does in
   under a minute, and can open the code.
2. Let visitors ask questions about me through a small chat assistant that only
   answers from my own data and politely refuses everything else.
3. Look like something a person designed, not a template. That was the main
   feedback from my teacher on the first version.

Alongside the site, the repo has a Claude Code plugin (`portfolio-kit`) so that
Claude follows my conventions when I use it to update the site: where content
lives, what the chat is allowed to say, and how deploys work.

## 2. Core features

| Feature | What it does | Status |
| --- | --- | --- |
| Welcome screen | "Welcome to Rohan's portfolio" opening animation, once per visit, skippable | Done |
| Hero | Name, one-line statement, role / study / location, resume download, email, LinkedIn, GitHub | Done |
| Work graph | Interactive d3-force graph of projects and the tools each uses; hover traces links, click opens the project | Done |
| Project cards | TrustRail, Drugos, MedFlow AI, Crop Disease, each with an animated scene, tilt on hover, GitHub link | Done |
| Case studies | Pop-up per project: summary, how it works, key facts, features, stack | Done |
| About, experience, education | Intro, internship, TiE Startup Program, Atria (CGPA, coursework), PUC and school | Done |
| Skills | Grouped table; hovering a skill shows which projects use it | Done |
| Contact | Email, phone, LinkedIn, GitHub, and a form that opens the visitor's mail app | Done |
| Let's build together | Invitation to share ideas, with a pre-filled email and LinkedIn link | Done |
| Thank you | Closing sign-off | Done |
| Resume download | One-page PDF generated from my resume | Done |
| Chat assistant (offline) | Keyword engine over my data, runs in the browser, works on GitHub Pages | Done |
| Chat assistant (LLM) | `api/chat.js` calls Gemini, Groq or Claude with my data as the only context | Code done, not hosted (see pending) |
| Chat scope guard | Refuses questions about anyone or anything else, in browser, offline engine and server | Done |
| Link previews | Open Graph image and tags so shared links show a card | Done |
| Auto-deploy | Push to `main` → lint, test, build, publish to GitHub Pages | Done |
| Accessibility | Keyboard navigation, focus states, reduced-motion support, no sideways scroll at 390px | Done |

## 3. How it's put together

```
React 19 + Vite ── src/components/*   (UI, Framer Motion, d3-force)
        │
        └── src/data/profile.js  ← single source of truth for every fact about me
                 │
                 ├── page sections and project cards
                 ├── src/lib/localBrain.js   offline chat answers
                 ├── src/lib/scope.js        "is this about Rohan?" guard
                 └── buildKnowledgeBase()    → api/chat.js → LLM (on Vercel only)

GitHub Actions (.github/workflows/deploy.yml)
  push to main → oxlint → npm test → vite build --base /portfolio/ → gh-pages → GitHub Pages
```

`npm test` runs two scripts: `scripts/check-content.mjs` (links, facts, spelling,
leftover template text, resume file) and `scripts/test-chat.mjs` (20 questions
that must be answered, 8 that must be refused, and 3 checks on the API handler).

## 4. Plugin components (`portfolio-kit`)

Location: `plugins/portfolio-kit/`, listed in the repo's marketplace file
`.claude-plugin/marketplace.json` and enabled for this project in
`.claude/settings.json`. It passes `claude plugin validate --strict`.

```
plugins/portfolio-kit/
├── .claude-plugin/plugin.json
├── skills/
│   ├── portfolio-content/SKILL.md
│   ├── chat-guardrails/SKILL.md
│   └── deploy-pages/SKILL.md
├── commands/
│   ├── add-project.md
│   ├── test-chat.md
│   ├── preflight.md
│   └── deploy-status.md
├── hooks/hooks.json
└── scripts/            (Node scripts the hooks run)
```

### Skills

Claude loads these on its own when a task matches the description.

| Skill | Used when | What it teaches Claude |
| --- | --- | --- |
| `portfolio-content` | Adding or changing anything the site says about me | Everything lives in `profile.js`; the exact steps to add a project (data, card scene, chat keywords, test); "Resume" spelling; keep PDF and site in sync; never invent facts |
| `chat-guardrails` | Editing the chat, or when it answers or refuses the wrong thing | How a question flows through `isAboutRohan` → API → offline fallback; why the guard runs in three places; how to fix a false refusal without opening the door to off-topic questions |
| `deploy-pages` | Anything about deploying or a broken live site | The Actions pipeline; the `/portfolio/` base path; fixes for the problems I've actually had (private repo 404, stale cache, missing preview image); Vercel option for the LLM chat |

### Commands

| Command | What it does |
| --- | --- |
| `/portfolio-kit:add-project <name> [github url]` | Asks me for anything missing, then adds the project to the data file, card scene, chat keywords and tests, and runs the checks |
| `/portfolio-kit:test-chat [question]` | Runs the chat test suite and summarises it; optionally tries one question and says whether answering or refusing it was right |
| `/portfolio-kit:preflight` | Runs lint, tests and the production build in order, and reports whether it's safe to push |
| `/portfolio-kit:deploy-status` | Compares `main`, `gh-pages` and my local HEAD to tell me whether the live site is up to date |

### Hooks

| Event | Matcher | Script | Behaviour |
| --- | --- | --- | --- |
| `PreToolUse` | `Edit\|Write\|MultiEdit` | `guard-files.mjs` | Blocks edits to `.env` files (API keys) and `dist/` (build output), and blocks the "Résumé" spelling in `src/` and `api/` |
| `PreToolUse` | `Bash`, `if: Bash(git push*)` | `pre-push.mjs` | Before any push: runs lint, `npm test` and a production build; blocks the push if any fail. Also blocks pushing straight to `gh-pages` |
| `PostToolUse` | `Edit\|Write\|MultiEdit` | `test-after-edit.mjs` | After edits to `profile.js`, `src/lib/`, `api/chat.js` or the test scripts, runs `npm test` and sends any failures back to Claude to fix |

How I checked them: each script was fed the same JSON Claude Code sends. `.env`,
`dist/` and "Résumé" edits exit 2 (blocked), normal edits exit 0, a push to
`gh-pages` is blocked, and a push to `main` passes. I then broke `scope.js` in a
scratch copy of the repo so "who is manoj" got answered again. The post-edit hook
reported the four failing tests, and the pre-push hook refused the push.

### Installing it somewhere else

```bash
claude plugin marketplace add rohans-oss/portfolio
claude plugin install portfolio-kit@rohan-portfolio
```

## 5. Done

**25 September 2026**
- First version: animated site with photo, project cards, AI chat, deployed to GitHub Pages.
- Made a fresh clone run the same in VS Code (`npm install` → `npm run dev`), and fixed two dev-server bugs that only showed up on a clean clone.
- Chat scope guard after the chat answered "who is Manoj" with my bio.
- Removed the photo badges and the custom cursor.
- Redesign after my teacher's review: plain white editorial layout, one typeface, colours from my resume, work graph as the centrepiece, photo removed.
- Content from my details document: MedFlow AI, Drugos, AU Venture Studio internship, TiE Student Startup Program, coursework, LinkedIn, Hebbal.
- Resume PDF download, with the template placeholder lines removed.
- White background, contour backgrounds, scroll and hover animations, skill tooltips.
- GitHub links for TrustRail, Drugos, MedFlow AI and Crop Disease.
- School and PUC added to the page and the chat.
- Welcome screen, animated project cards, new tagline.
- Fixed the live site going down when the repo was made private.
- "Resume" spelling, link-preview image, auto-deploy on push.
- "Let's build together" and "Thank you" sections.

**26 September 2026**
- `npm test`: content checks and chat tests, also run in CI before every deploy.
- `portfolio-kit` plugin: 3 skills, 4 commands, 3 hooks.
- `CLAUDE.md` and this document.

## 6. Pending

| Item | Why it's pending | Next step |
| --- | --- | --- |
| Internship details (dates, what I built at AU Venture Studio) | I haven't written them up yet, so the site and resume only show the company name | Write 1–2 lines and the dates; update `profile.js` and the resume PDF |
| Live demo and demo video links | My details doc lists "Live Demo" and "Demo Video" for each project, but I don't have the URLs yet | Add `demo` and `video` fields to each project and show them as buttons next to GitHub |
| LLM-powered chat on the live link | GitHub Pages can't run `api/chat.js`, so visitors get the offline engine | Give Vercel's GitHub app access to the repo, import it on Vercel, set `GEMINI_API_KEY` |
| NIDS and CGPA only on the site | Neither is on the new resume | Decide whether to add them to the resume or take them off the site |
| Check that the project repos are public | Private repos show visitors a 404 | Open each GitHub link in a private window |
| Browser tests in CI | Visual checks were done by hand with Playwright screenshots | Add a Playwright smoke test (page loads, cards open, chat answers and refuses) to the workflow |
| Custom domain (optional) | Not needed yet | Buy a domain and add a `CNAME` for GitHub Pages |
