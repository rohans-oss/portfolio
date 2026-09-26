// Small helpers shared by the hook scripts.
import { spawnSync } from 'node:child_process'
import { relative, resolve } from 'node:path'

// Hooks get a JSON payload on stdin describing the tool call.
export async function readHookInput() {
  let raw = ''
  for await (const chunk of process.stdin) raw += chunk
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

export function projectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
}

// Path of the edited file relative to the project, with forward slashes so the
// same checks work on Windows.
export function relPath(input) {
  const file = input.tool_input?.file_path || input.tool_input?.notebook_path || ''
  if (!file) return ''
  return relative(projectDir(input), resolve(projectDir(input), file)).split('\\').join('/')
}

// Runs an npm/npx command in the project and returns { ok, output }.
export function run(cmd, cwd) {
  const r = spawnSync(cmd, { cwd, shell: true, encoding: 'utf8', timeout: 170_000 })
  const output = `${r.stdout || ''}${r.stderr || ''}`
  return { ok: r.status === 0, output }
}

// Keeps error output short enough to be useful in Claude's context.
export function tail(text, lines = 25) {
  return text.trim().split('\n').slice(-lines).join('\n')
}

// Exit code 2 tells Claude Code to block (PreToolUse) or to show the message
// to Claude (PostToolUse). The message goes on stderr.
export function block(message) {
  process.stderr.write(`${message}\n`)
  process.exit(2)
}
