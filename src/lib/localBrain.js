// Offline answer engine. Used when /api/chat is unreachable (local dev without
// a key, static hosting). Scores intents by keyword overlap and composes answers
// from profile.js only, so it never invents facts.
import { otherWork, profile as p, projects } from '../data/profile.js'
import { REFUSAL, isAboutRohan } from './scope.js'

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s.+#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const projectAnswer = (pr) =>
  [
    `**${pr.name}**: ${pr.tagline}.`,
    pr.summary,
    ...(pr.how ? ['', '**How it works**', ...pr.how.map((a) => `- ${a}`)] : []),
    '',
    `**Key facts:** ${pr.facts.map(([k, v]) => `${k} ${v}`).join(' · ')}`,
    `**Stack:** ${pr.stack.join(', ')}`,
    pr.github ? `[Code on GitHub](${pr.github})` : '',
  ]
    .join('\n')
    .trim()

const all = [...projects, ...otherWork]
const projectKeys = {
  trustrail: ['trustrail', 'trust rail', 'upi', 'payment', 'payments', 'scam', 'fraud', 'gateway', 'routing', 'causal', 'econml', 'doubly', 'drift', 'fintech'],
  drugos: ['drugos', 'durgos', 'drug', 'drugs', 'discovery', 'repurposing', 'knowledge graph', 'graph transformer', 'reinforcement', 'protein', 'biomedical', 'cosmic'],
  medflow: ['medflow', 'hospital', 'hospitals', 'supply', 'inventory', 'procurement', 'fefo', 'or-tools', 'forecasting', 'healthcare'],
  crop: ['crop', 'yield', 'plant', 'leaf', 'agri', 'agriculture', 'farm', 'soil', 'disease detection'],
  nids: ['nids', 'intrusion', 'network', 'cyber', 'security', 'unsw', 'attack', 'malicious', 'traffic'],
}

const intents = [
  {
    keys: ['hi', 'hello', 'hey', 'hii', 'yo', 'sup', 'namaste', 'hola'],
    exact: true,
    answer: () => `Hi! I answer questions about Rohan: his projects, skills, education, experience and how to reach him.`,
  },
  {
    keys: ['who', 'yourself', 'introduce', 'background', 'summary', 'overview', 'bio', 'intro'],
    answer: () =>
      `**${p.name}** is a ${p.year} student at ${p.school}, Bengaluru (${p.education.period}), working as an ${p.role.replace('&', 'and')}.\n\n${p.intro}\n\nProjects: ${projects
        .map((x) => `**${x.name}** (${x.tagline})`)
        .join(', ')}.`,
  },
  {
    keys: ['project', 'projects', 'built', 'build', 'work', 'portfolio', 'made'],
    answer: () =>
      `Rohan's main projects:\n\n${projects.map((x) => `- **${x.name}**: ${x.summary}`).join('\n')}\n\nAlso: **${otherWork[0].name}** (${otherWork[0].facts[0][1]} accuracy on UNSW-NB15). Ask about any one for details.`,
  },
  ...all.map((pr) => ({ keys: projectKeys[pr.id], weight: 2, answer: () => projectAnswer(pr) })),
  {
    keys: ['experience', 'interned', 'did he intern', 'he intern', 'intern at', 'internship at', 'venture', 'studio', 'au', 'worked at', 'company'],
    weight: 1.3,
    answer: () =>
      `**Experience:** ${p.experience.map((x) => `${x.role} at ${x.org}`).join('; ')}.\n\nHe was also selected for the **${p.achievements[0].title}** with Team Cosmic for the Drugos startup project.`,
  },
  {
    keys: ['achievement', 'achievements', 'award', 'awards', 'tie', 'startup', 'hackathon', 'hackathons', 'recognition', 'program'],
    weight: 1.2,
    answer: () => p.achievements.map((a) => `- **${a.title}:** ${a.detail}`).join('\n'),
  },
  {
    keys: ['result', 'results', 'performance', 'perform', 'metrics', 'accuracy', 'numbers', 'impact'],
    weight: 1.1,
    answer: () =>
      `Key numbers from Rohan's work:\n\n${all.map((x) => `- **${x.name}:** ${x.facts.map(([k, v]) => `${k} ${v}`).join(', ')}`).join('\n')}`,
  },
  {
    keys: ['ml', 'machine learning', 'ai', 'model', 'models', 'deep learning', 'data science'],
    weight: 1.2,
    answer: () =>
      `Rohan's AI/ML work spans:\n\n- **Graph ML:** knowledge graph + Graph Transformer link prediction, refined with RL (Drugos)\n- **Causal inference:** doubly-robust learner with 5-fold cross-fitting in EconML (TrustRail)\n- **Forecasting + optimisation:** demand forecasting with OR-Tools procurement (MedFlow AI)\n- **Computer vision + PCA:** 1,860 → 471 features at 95.03% variance (Crop Disease)\n- **Classical ML:** XGBoost on UNSW-NB15, 94.8% accuracy, 0.9954 PR-AUC (NIDS)\n\nTools: ${p.skills[1].items.join(', ')}.`,
  },
  {
    keys: ['skill', 'skills', 'stack', 'tech', 'technologies', 'tools', 'know', 'python', 'javascript', 'java', 'react', 'framework', 'database', 'databases'],
    answer: () => `Rohan's toolkit:\n\n${p.skills.map((s) => `- **${s.group}:** ${s.items.join(', ')}`).join('\n')}`,
  },
  {
    keys: ['speak', 'spoken', 'kannada', 'hindi', 'telugu', 'english'],
    weight: 2,
    answer: () => `Rohan speaks ${p.languages.slice(0, -1).join(', ')} and ${p.languages.at(-1)}.`,
  },
  {
    keys: ['education', 'college', 'university', 'degree', 'cgpa', 'gpa', 'study', 'studying', 'atria', 'graduate', 'graduation', 'btech', 'b.tech', 'marks', 'semester', 'coursework', 'courses', 'subjects'],
    answer: () =>
      `Rohan is doing a **${p.education.degree}** (${p.education.focus}) at **${p.education.school}**, ${p.education.city}, ${p.education.period}. He's in his 3rd year, with a CGPA of **${p.education.cgpa}**.\n\n**Coursework:** ${p.education.coursework.join(', ')}.\n\n**Before that:** PUC at ${p.education.schooling[0].school}, ${p.education.schooling[0].place}, and schooling at ${p.education.schooling[1].school}, ${p.education.schooling[1].place}.`,
  },
  {
    keys: ['school', 'schooling', 'schooled', 'puc', 'pre-university', 'preuniversity', '10th', '12th', 'sslc', 'cbse', 'intermediate', 'jalappa', 'chaitanya', 'kolar', 'tamaka', 'tirupati', 'andhra', 'before college', 'high school'],
    weight: 2,
    answer: () =>
      `Rohan's earlier education:\n\n${p.education.schooling
        .map((x) => `- **${x.level}:** ${x.school}, ${x.place}`)
        .join('\n')}\n\nHe's now doing a **${p.education.degree}** (${p.education.focus}) at **${p.education.school}**, ${p.education.period}.`,
  },
  {
    keys: ['resume', 'cv', 'download', 'pdf'],
    weight: 1.5,
    answer: () => `You can [download Rohan's one-page resume (PDF)](${p.resume}). There's also a **Resume** link at the top of the page.`,
  },
  {
    keys: ['contact', 'email', 'mail', 'phone', 'call', 'reach', 'hire', 'github', 'linkedin', 'connect', 'number'],
    answer: () =>
      `You can reach Rohan at:\n\n- **Email:** [${p.email}](mailto:${p.email})\n- **Phone:** ${p.phone}\n- **LinkedIn:** [${p.linkedinHandle}](${p.linkedin})\n- **GitHub:** [${p.githubHandle}](${p.github})`,
  },
  {
    keys: ['intern', 'internship', 'internships', 'available', 'availability', 'job', 'opportunity', 'looking', 'open', 'role', 'hiring'],
    answer: () =>
      `Yes, Rohan is **open to software and AI/ML internships**. His goal is to become a skilled software engineer who builds impactful technology products.\n\nBest way to reach him: [${p.email}](mailto:${p.email}).`,
  },
  {
    keys: ['why', 'strength', 'strengths', 'best', 'stand out', 'special', 'unique'],
    answer: () =>
      `A few things stand out:\n\n- **Ships whole systems.** TrustRail, Drugos and MedFlow AI each pair a model with a FastAPI back end and a React or Next.js front end.\n- **Goes beyond model.fit().** Doubly-robust causal learners, Graph Transformers, RL refinement, OR-Tools optimisation.\n- **Honest evaluation.** He reports PR-AUC and macro-F1 (0.5906 on multi-class NIDS), not just flattering accuracy.\n- **Startup exposure.** TiE Student Startup Program with Team Cosmic, and an internship at AU Venture Studio.`,
  },
  {
    keys: ['interest', 'interests', 'passion', 'goal', 'goals', 'career', 'future', 'aim'],
    answer: () => `**Interests:** ${p.interests.join(', ')}.\n\n**Goal:** ${p.about.find((a) => a.k === 'Goal').v}`,
  },
  {
    keys: ['location', 'where', 'based', 'city', 'live', 'bengaluru', 'bangalore', 'hebbal'],
    answer: () => `Rohan is based in **${p.location}**.`,
  },
]

export function localAnswer(question) {
  if (!isAboutRohan(question)) return REFUSAL
  const q = norm(question)
  const words = new Set(q.split(' '))
  let best = null
  let bestScore = 0
  for (const intent of intents) {
    let score = 0
    for (const k of intent.keys) {
      if (k.includes(' ') ? q.includes(k) : words.has(k)) score += k.includes(' ') ? 2 : 1
    }
    if (intent.exact && score > 0 && words.size > 3) score = 0.5
    score *= intent.weight || 1
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }
  if (best) return best.answer()
  if (/\brohan|\babout (him|you)\b/.test(q)) return intents[1].answer()
  return `I don't have that detail about Rohan. You can ask him directly at [${p.email}](mailto:${p.email}), or ask me about his projects, skills, education or experience.`
}
