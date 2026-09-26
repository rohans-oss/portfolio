// PreToolUse hook for Edit/Write/MultiEdit.
// Stops three kinds of edits before they happen:
//   1. writing to .env files (they hold API keys and must never be touched by Claude)
//   2. editing dist/ (it's build output; the next build overwrites it)
//   3. putting the accented "Résumé" back into the site (I use plain "Resume")
import { block, readHookInput, relPath } from './lib.mjs'

const input = await readHookInput()
const path = relPath(input)
if (!path) process.exit(0)

const name = path.split('/').pop()
if (/^\.env(\..+)?$/.test(name) && name !== '.env.example') {
  block(
    `Blocked: ${path} holds secret API keys, so it isn't edited from Claude Code. ` +
      'Ask Rohan to change it by hand, or edit .env.example if you are documenting a new variable.',
  )
}

if (path.startsWith('dist/')) {
  block(`Blocked: ${path} is build output. Change the source in src/ or public/ and run npm run build instead.`)
}

const t = input.tool_input || {}
const newText = [t.content, t.new_string, ...(t.edits || []).map((e) => e.new_string)].filter(Boolean).join('\n')
if (/^(src|api)\//.test(path) && /Résumé|résumé/.test(newText)) {
  block('Blocked: the site spells it "Resume" (no accents). Use "Resume"/"resume" and try again.')
}

process.exit(0)
