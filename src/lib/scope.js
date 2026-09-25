// Decides whether a question is about Rohan. Shared by the browser chat,
// the offline engine and the /api/chat endpoint so all three refuse the same way.
import { buildKnowledgeBase, otherWork, projects as mainProjects } from '../data/profile.js'

const projects = [...mainProjects, ...otherWork]

export const REFUSAL =
  "Sorry, I can't answer that. I can only answer questions about **Rohan**: his projects, skills, education and how to reach him. Try asking _\"What has Rohan built?\"_"

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s.+#-]/g, ' ')
    .replace(/[.]+(\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Words that point at Rohan himself.
const SELF = new Set(['rohan', 'rohans', 'he', 'him', 'his', 'hes', 'you', 'your', 'yourself', 'youre', 'u', 'ur', 'rs'])

// Filler words that carry no subject.
const STOP = new Set(
  (
    'a an the is are was were be been am do does did can could would should will shall may might must ' +
    'what whats which who whos whom whose where wheres when why how hows tell me us about give show list ' +
    'please pls plz i im my we our it its this that these those there here of in on at to for from with by ' +
    'and or but so if then than as any some all more most much many few very really just also too ' +
    'know like want wanna need get got have has had make made go see let lets say explain describe ' +
    'hi hello hey hii yo sup namaste hola thanks thank ok okay cool nice great good up doing done ' +
    'kind type sort one ones thing things something anything everything else other ever currently now'
  ).split(' '),
)

// Portfolio topics a visitor may ask about without naming Rohan.
const TOPICS = new Set(
  (
    'project projects built build building work works worked portfolio skill skills stack tech technologies ' +
    'technology tools tool language languages speak spoken education college university degree study studying ' +
    'student cgpa gpa marks grade grades graduate graduation btech b.tech contact email mail phone number call ' +
    'reach connect github linkedin hire hiring intern internship internships job jobs role roles opportunity ' +
    'available availability open resume cv experience background bio summary intro introduction overview ' +
    'location based city live lives strength strengths best achievements achievement results accuracy ' +
    'ml ai machine learning model models deep data science web development frontend backend fullstack full-stack ' +
    'code coding repo repos repository perform performed performance score scores metric metrics f1 precision recall ' +
    'dataset datasets result outcome impact problem solve solved approach architecture how-it-works case study ' +
    'achievement awards award hackathon hackathons startup interests interest goal goals career passion download pdf ' +
    'coursework courses subjects semester year school schooling schooled puc pre-university 10th 12th sslc cbse intermediate high'
  ).split(' '),
)

let VOCAB
function vocab() {
  if (!VOCAB) {
    VOCAB = new Set(norm(buildKnowledgeBase()).split(' ').filter((w) => w.length > 1))
    for (const pr of projects) VOCAB.add(pr.id)
  }
  return VOCAB
}

export function isAboutRohan(question) {
  const words = norm(question).split(' ').filter(Boolean)
  if (words.some((w) => SELF.has(w))) return true
  const names = projects.flatMap((pr) => [pr.id, pr.name.toLowerCase().split(' ')[0]]).concat('durgos')
  if (words.some((w) => names.includes(w))) return true
  const content = words.filter((w) => !STOP.has(w))
  if (!content.length) return true // pure greeting / small talk
  const v = vocab()
  return content.every((w) => TOPICS.has(w) || v.has(w) || v.has(w.replace(/s$/, '')))
}
