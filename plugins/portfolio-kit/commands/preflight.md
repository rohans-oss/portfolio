---
description: Run every check CI runs (lint, content, chat, build) before pushing
allowed-tools: Bash(npx oxlint *), Bash(npm test*), Bash(npx vite build *)
---

Run these in order and stop at the first failure:

1. `npx oxlint src api scripts`
2. `npm test`
3. `npx vite build --base /portfolio/`

Report each step as passed or failed in a short list. For a failure, show the
relevant error lines and suggest the fix, but don't change code unless I ask.
If everything passes, say it's safe to push to `main`.
