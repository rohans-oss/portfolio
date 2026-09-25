// Offline answer engine. Used when /api/chat is unreachable (local dev,
// static hosting, or no API key configured). Scores intents by keyword
// overlap and composes answers from profile.js, so it never invents facts.
import { profile as p, projects } from '../data/profile.js'
import { REFUSAL, isAboutRohan } from './scope.js'

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const projectAnswer = (pr) =>
  [
    `**${pr.name}**: ${pr.tagline}.`,
    pr.summary,
    '',
    '**How it works**',
    ...pr.approach.map((a) => `- ${a}`),
    '',
    `**Results:** ${pr.results.map((r) => `${r.k} (${r.v})`).join(', ')}.`,
    `**Stack:** ${pr.stack.join(', ')}.`,
    pr.github ? `[View the code on GitHub](${pr.github})` : '',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')

const intents = [
  {
    keys: ['hi', 'hello', 'hey', 'yo', 'sup', 'namaste', 'hola'],
    exact: true,
    answer: () =>
      `Hi! I'm Rohan's AI assistant. Ask me about his projects, skills, education, or how to reach him.`,
  },
  {
    keys: ['who', 'yourself', 'introduce', 'background', 'summary', 'overview', 'bio'],
    answer: () =>
      `${p.name} is a ${p.education.degree} student at ${p.education.school}, ${p.education.city} (CGPA ${p.education.cgpa.toFixed(1)}/10, graduating ${p.education.graduation}).\n\n${p.summary}\n\nHe's built ${projects.length} AI/ML systems: ${projects
        .map((x) => `**${x.name}** (${x.tagline})`)
        .join(', ')}.`,
  },
  {
    keys: ['project', 'projects', 'built', 'work', 'portfolio', 'made', 'build'],
    answer: () =>
      `Rohan has built ${projects.length} projects:\n\n${projects
        .map((x) => `- **${x.name}**: ${x.summary}`)
        .join('\n')}\n\nAsk about any one for the details.`,
  },
  ...projects.map((pr) => ({
    keys: {
      trustrail: ['trustrail', 'trust rail', 'upi', 'payment', 'payments', 'scam', 'fraud', 'gateway', 'router', 'causal', 'doubly', 'drift', 'psi', 'fintech', 'razorpay'],
      durgos: ['durgos', 'drug', 'repurposing', 'knowledge graph', 'graph transformer', 'reinforcement', 'rl', 'protein', 'disease link', 'medicine', 'health'],
      nids: ['nids', 'intrusion', 'network', 'cyber', 'security', 'unsw', 'attack', 'malicious', 'xgboost', 'traffic'],
      crop: ['crop', 'cropsense', 'yield', 'plant', 'agri', 'agriculture', 'leaf', 'farm', 'soil', 'image', 'vision'],
    }[pr.id],
    weight: 2,
    answer: () => projectAnswer(pr),
  })),
  {
    keys: ['result', 'results', 'performance', 'perform', 'metrics', 'accuracy', 'numbers', 'achievements', 'achievement', 'impact'],
    weight: 1.1,
    answer: () =>
      `Headline results across Rohan's projects:\n\n${projects
        .map((x) => `- **${x.name}:** ${x.results.map((r) => `${r.k} (${r.v})`).join(', ')}`)
        .join('\n')}`,
  },
  {
    keys: ['skill', 'skills', 'stack', 'tech', 'technologies', 'tools', 'know', 'language', 'languages', 'python', 'javascript', 'next', 'framework'],
    answer: () =>
      `Here's Rohan's toolkit:\n\n${p.skills.map((s) => `- **${s.group}:** ${s.items.join(', ')}`).join('\n')}`,
  },
  {
    keys: ['speak', 'spoken', 'kannada', 'hindi', 'telugu', 'english', 'languages speak'],
    weight: 2,
    answer: () => `Rohan speaks ${p.languages.slice(0, -1).join(', ')} and ${p.languages.at(-1)}.`,
  },
  {
    keys: ['education', 'college', 'university', 'degree', 'cgpa', 'gpa', 'study', 'studying', 'atria', 'graduate', 'graduation', 'btech', 'b.tech', 'marks'],
    answer: () =>
      `Rohan is pursuing a **${p.education.degree}** at **${p.education.school}**, ${p.education.city}. His CGPA is **${p.education.cgpa.toFixed(1)} / ${p.education.cgpaMax}** and he's expected to graduate in **${p.education.graduation}**.`,
  },
  {
    keys: ['contact', 'email', 'mail', 'phone', 'call', 'reach', 'hire', 'github', 'connect', 'number'],
    answer: () =>
      `You can reach Rohan at:\n\n- **Email:** [${p.email}](mailto:${p.email})\n- **Phone:** ${p.phone}\n- **GitHub:** [${p.githubHandle}](${p.github})`,
  },
  {
    keys: ['intern', 'internship', 'available', 'availability', 'job', 'opportunity', 'looking', 'open', 'role', 'hiring'],
    answer: () =>
      `Yes. Rohan is **open to software and AI/ML internships**. He wants to apply Python, machine learning and web development to real engineering problems and learn from people working at scale.\n\nBest way to reach him: [${p.email}](mailto:${p.email}).`,
  },
  {
    keys: ['why', 'hire him', 'strength', 'strengths', 'best', 'good', 'stand out', 'special', 'unique'],
    answer: () =>
      `A few things stand out:\n\n- **End-to-end builder.** TrustRail pairs a Next.js + TypeScript dashboard with a FastAPI ML service, not just a notebook.\n- **Goes beyond model.fit().** Doubly-robust causal learners with cross-fitting, Graph Transformers, RL refinement.\n- **Honest evaluation.** He reports PR-AUC and macro-F1 (0.5906 on multi-class NIDS), not just flattering accuracy.\n- **Production thinking.** Drift monitoring with KS-test and PSI, and a feedback loop that avoids training on its own predictions.`,
  },
  {
    keys: ['ml', 'machine learning', 'ai', 'model', 'models', 'deep learning', 'data science'],
    weight: 1.2,
    answer: () =>
      `Rohan's ML work spans:\n\n- **Graph ML:** knowledge graphs + Graph Transformers for link prediction (Durgos)\n- **Reinforcement Learning:** reward-shaped refinement of predictions (Durgos)\n- **Causal inference:** doubly-robust learner with 5-fold cross-fitting (TrustRail)\n- **Classical ML:** XGBoost and scikit-learn on UNSW-NB15 (94.8% accuracy, 0.9954 PR-AUC)\n- **Computer vision + PCA:** 1,860 → 471 features at 95.03% variance (CropSense)`,
  },
  {
    keys: ['location', 'where', 'based', 'city', 'live', 'bengaluru', 'bangalore'],
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
  // On-topic but nothing specific matched: introduce Rohan if he was named,
  // otherwise be honest that the detail isn't known.
  if (/\brohan|\babout (him|you)\b/.test(q)) return intents.find((i) => i.keys.includes('who')).answer()
  return `I don't have that detail about Rohan. You can ask him directly at [${p.email}](mailto:${p.email}), or ask me about his projects, skills or education.`
}
