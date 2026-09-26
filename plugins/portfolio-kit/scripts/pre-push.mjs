// PreToolUse hook for Bash, limited to `git push` by the `if` rule in hooks.json.
// Pushing to main deploys the live site, so run the same checks CI runs first:
// lint, content + chat tests, and a production build. Any failure blocks the push.
// Pushing to gh-pages by hand is blocked too, because GitHub Actions owns that branch.
import { block, projectDir, readHookInput, run, tail } from './lib.mjs'

const input = await readHookInput()
const cmd = input.tool_input?.command || ''
if (!/\bgit\s+push\b/.test(cmd)) process.exit(0)

if (/\bgh-pages\b/.test(cmd)) {
  block(
    'Blocked: gh-pages is published by the GitHub Actions workflow on every push to main. ' +
      'Push to main instead and let the workflow deploy.',
  )
}

const cwd = projectDir(input)
const steps = [
  ['Lint', 'npx oxlint src api scripts'],
  ['Content and chat tests', 'npm test --silent'],
  ['Production build', 'npx vite build --base /portfolio/ --logLevel error'],
]
for (const [label, step] of steps) {
  const { ok, output } = run(step, cwd)
  if (!ok) block(`Push blocked: "${label}" failed (${step}).\n\n${tail(output)}`)
}
process.exit(0)
