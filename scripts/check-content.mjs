// Sanity checks on the site content in src/data/profile.js.
// Run with: npm run check:content
//
// These catch the mistakes I've actually made while editing: leftover template
// text from the resume, a project without a GitHub link, the accented
// "Résumé" spelling sneaking back in, and a resume PDF that isn't there.

import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { otherWork, profile, projects } from '../src/data/profile.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let failed = 0
const check = (ok, msg) => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${msg}`)
  if (!ok) failed++
}

console.log('Profile')
for (const k of ['name', 'email', 'phone', 'github', 'linkedin', 'statement', 'intro']) {
  check(Boolean(profile[k]), `profile.${k} is set`)
}
check(/^https:\/\/github\.com\//.test(profile.github), 'GitHub link is an https github.com URL')
check(/^https:\/\/(www\.)?linkedin\.com\//.test(profile.linkedin), 'LinkedIn link is an https linkedin.com URL')
check(profile.education.schooling?.length === 2, 'school and PUC are both listed')

console.log('\nProjects')
for (const pr of [...projects, ...otherWork]) {
  check(/^https:\/\/github\.com\/rohans-oss\//.test(pr.github || ''), `${pr.name} links to a repo on github.com/rohans-oss`)
  check(pr.facts?.length >= 3, `${pr.name} has at least 3 key facts`)
}
for (const pr of projects) {
  check(pr.how?.length >= 3 && pr.features?.length >= 3, `${pr.name} has a full case study (how it works + features)`)
}

console.log('\nText hygiene')
const sources = ['src/data/profile.js', 'src/components/Page.jsx', 'src/components/Chat.jsx', 'src/lib/localBrain.js']
for (const f of sources) {
  const text = readFileSync(join(root, f), 'utf8')
  check(!/Résumé|résumé/.test(text), `${f} uses "Resume", not "Résumé"`)
  check(!/\[(Month|What you|Tools used)[^\]]*\]/.test(text), `${f} has no leftover resume template placeholders`)
}

console.log('\nFiles')
const pdf = join(root, 'public', 'Rohan_S_Resume.pdf')
check(existsSync(pdf) && statSync(pdf).size > 10_000, 'public/Rohan_S_Resume.pdf exists')
check(existsSync(join(root, 'public', 'og.png')), 'public/og.png (link preview image) exists')

console.log(failed ? `\n${failed} check(s) failed` : '\nAll content checks passed')
process.exit(failed ? 1 : 0)
