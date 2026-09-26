---
description: Check whether the live site is running the latest code on main
allowed-tools: Bash(git ls-remote *), Bash(git rev-parse *), Bash(git log *), Bash(git fetch *)
---

- Latest commit on main: !`git ls-remote origin refs/heads/main`
- Latest commit on gh-pages: !`git ls-remote origin refs/heads/gh-pages`
- Local HEAD: !`git rev-parse HEAD`

The workflow names each gh-pages commit `Deploy <short sha of main>`. Fetch
gh-pages (`git fetch origin gh-pages --depth 1` then `git log -1 FETCH_HEAD`) to
read that message, and tell me:

1. Is the live site built from the current `main`? If not, how far behind is it?
2. Is my local HEAD pushed yet?
3. If the site looks stale, point me to the likely cause using the deploy-pages skill
   (usually a failed Actions run or browser cache).

Live URL: https://rohans-oss.github.io/portfolio/
