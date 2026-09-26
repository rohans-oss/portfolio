// Tests for the "Ask about Rohan" assistant.
// Run with: npm run test:chat
//
// Two things matter: questions about me get a real answer from my data, and
// anything else (other people, general knowledge, coding help) gets the refusal.
// The /api/chat endpoint is checked too, since it has its own copy of the guard.

import { localAnswer } from '../src/lib/localBrain.js'
import { REFUSAL, isAboutRohan } from '../src/lib/scope.js'
import { POST } from '../api/chat.js'

// [question, text the answer must contain]
const answered = [
  ['Who is Rohan?', 'Atria University'],
  ['What has Rohan built?', 'TrustRail'],
  ['What is TrustRail?', 'Payment intelligence'],
  ['tell me about drugos', 'drug discovery'],
  ['How does MedFlow handle stock?', 'FEFO'],
  ['crop disease project', '1,860'],
  ['How did NIDS perform?', '94.8%'],
  ['Where did he intern?', 'AU Venture Studio'],
  ['what are his achievements', 'TiE Student Startup Program'],
  ['What is his CGPA?', '8.0'],
  ['Where did he do his schooling?', 'Jalappa'],
  ['where did he do puc', 'Sri Chaitanya'],
  ['Is he open to internships?', 'internships'],
  ['what skills does he have', 'Python'],
  ['what languages does he speak', 'Kannada'],
  ['how can I contact him', 'srohan02293@gmail.com'],
  ['linkedin', 'linkedin.com/in/rohan-s-553768336'],
  ['download resume', 'Rohan_S_Resume.pdf'],
  ['where does he live', 'Hebbal'],
  ['hi', 'Rohan'],
]

const refused = [
  'who is manoj',
  'Who is Virat Kohli?',
  'tell me about elon musk',
  'what is the capital of france',
  'tell me a joke',
  'write me a python function',
  'who is the principal of sri chaitanya',
  'what is 2+2',
]

let failed = 0
const fail = (msg) => {
  failed++
  console.log(`  FAIL  ${msg}`)
}

console.log('On-topic questions')
for (const [q, must] of answered) {
  const a = localAnswer(q)
  if (a === REFUSAL) fail(`"${q}" was refused`)
  else if (!a.includes(must)) fail(`"${q}" answer is missing "${must}"\n        got: ${a.slice(0, 120).replace(/\n/g, ' ')}`)
  else console.log(`  ok    ${q}`)
}

console.log('\nOff-topic questions (must be refused)')
for (const q of refused) {
  if (isAboutRohan(q) || localAnswer(q) !== REFUSAL) fail(`"${q}" was answered instead of refused`)
  else console.log(`  ok    ${q}`)
}

console.log('\n/api/chat endpoint (no API key set)')
for (const k of ['ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'GROQ_API_KEY']) delete process.env[k]
const call = (messages) =>
  POST(
    new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `test-${Math.random()}` },
      body: JSON.stringify({ messages }),
    }),
  )
{
  const r = await call([{ role: 'user', content: 'who is manoj' }])
  const body = await r.json()
  if (r.status !== 200 || body.reply !== REFUSAL) fail(`off-topic should return the refusal, got ${r.status} ${JSON.stringify(body)}`)
  else console.log('  ok    off-topic question is refused before any model is called')
}
{
  const r = await call([{ role: 'user', content: 'What is TrustRail?' }])
  if (r.status !== 503) fail(`on-topic with no key should be 503 so the site falls back to offline answers, got ${r.status}`)
  else console.log('  ok    on-topic question with no key returns 503 (site uses offline answers)')
}
{
  const r = await call([])
  if (r.status !== 400) fail(`empty message list should be 400, got ${r.status}`)
  else console.log('  ok    empty request is rejected')
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll chat checks passed')
process.exit(failed ? 1 : 0)
