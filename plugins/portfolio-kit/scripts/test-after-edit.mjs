// PostToolUse hook for Edit/Write/MultiEdit.
// After any change to the content file, the chat logic or the chat API, run the
// content and chat tests. If they fail, exit 2 so Claude sees the failures and
// fixes them straight away instead of finding out at deploy time.
import { block, projectDir, readHookInput, relPath, run, tail } from './lib.mjs'

const WATCHED = [/^src\/data\/profile\.js$/, /^src\/lib\//, /^api\/chat\.js$/, /^scripts\/(test-chat|check-content)\.mjs$/]

const input = await readHookInput()
const path = relPath(input)
if (!WATCHED.some((re) => re.test(path))) process.exit(0)

const { ok, output } = run('npm test --silent', projectDir(input))
if (!ok) {
  block(`npm test failed after editing ${path}. Fix these before moving on:\n\n${tail(output, 30)}`)
}
process.exit(0)
