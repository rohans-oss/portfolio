// Single source of truth: the site, the offline chat engine and the /api/chat
// endpoint all read from this file. Edit here and everything updates.

export const profile = {
  name: 'Rohan S',
  firstName: 'Rohan',
  title: 'Computer Science Student · AI/ML & Full-Stack Developer',
  location: 'Bengaluru, India',
  email: 'srohan02293@gmail.com',
  phone: '+91 90199 19218',
  phoneRaw: '+919019919218',
  github: 'https://github.com/rohans-oss',
  githubHandle: 'rohans-oss',
  photo: `${import.meta.env?.BASE_URL ?? '/'}rohan.webp`,
  availability: 'Open to software and AI/ML internships',
  roles: [
    'Machine Learning Engineer',
    'Full-Stack Developer',
    'Graph ML Explorer',
    'Causal Inference Builder',
  ],
  summary:
    'B.Tech Computer Science student at Atria University, Bengaluru. I build machine learning systems end to end, from data pipelines and model training to the dashboards and APIs people actually use. I want to apply Python, machine learning and web development to real engineering problems and learn from people working at scale.',
  about: [
    'I am a B.Tech Computer Science (Digital Technology) student at Atria University, Bengaluru, graduating in 2028.',
    'Most of my work sits where machine learning meets real products: a knowledge-graph drug repurposing engine, an intrusion detection system on UNSW-NB15, a crop disease and yield-loss pipeline, and a UPI payment intelligence platform with causal routing.',
  ],
  education: {
    school: 'Atria University',
    city: 'Bengaluru',
    degree: 'B.Tech in Computer Science (Digital Technology)',
    cgpa: 8.0,
    cgpaMax: 10,
    graduation: 2028,
  },
  languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
  skills: [
    { group: 'Languages', items: ['Python', 'JavaScript', 'SQL'] },
    { group: 'Web Development', items: ['Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'FastAPI'] },
    {
      group: 'AI / Machine Learning',
      items: [
        'scikit-learn',
        'XGBoost',
        'Knowledge Graphs',
        'Graph Transformers',
        'Reinforcement Learning',
        'Causal Inference (Doubly-Robust)',
        'PCA',
        'Computer Vision',
      ],
    },
    { group: 'Data', items: ['Pandas', 'NumPy', 'Matplotlib'] },
    { group: 'Databases', items: ['SQLite', 'Prisma ORM'] },
    { group: 'Other', items: ['Git', 'Data Structures & Algorithms (basic)'] },
  ],
  stats: [
    { value: 4, suffix: '', label: 'AI / ML systems built' },
    { value: 94.8, suffix: '%', decimals: 1, label: 'NIDS binary accuracy' },
    { value: 0.9954, suffix: '', decimals: 4, label: 'PR-AUC on UNSW-NB15' },
    { value: 8.0, suffix: '/10', decimals: 1, label: 'CGPA at Atria University' },
  ],
}

export const projects = [
  {
    id: 'trustrail',
    name: 'TrustRail',
    tagline: 'Payment intelligence for UPI',
    category: 'Full-Stack · Causal ML',
    year: 'FinTech',
    summary:
      'Checks UPI transactions for scam risk before money moves, then routes each payment to the gateway most likely to succeed.',
    problem:
      'Social-engineering scams such as fake collect-request "refunds" slip through because nothing looks at intent before approval. Separately, gateway success rates are biased by which payments were historically sent where.',
    approach: [
      'Stage 1: an intent-risk model (logistic regression on 9 behavioural features) flags social-engineering scams like fake collect-request refunds before the money moves.',
      'Stage 2: a causal router estimates the true success probability for each gateway, corrected for selection bias, using a doubly-robust learner with 5-fold cross-fitting.',
      'A feedback loop retrains only on human-labelled outcomes and deliberately skips the model’s own predictions to avoid a circular loop.',
      'Drift monitoring with the KS-test and Population Stability Index (PSI).',
    ],
    results: [
      { k: '2-stage', v: 'Risk screening + causal routing' },
      { k: '5-fold', v: 'Cross-fitted doubly-robust learner' },
      { k: 'KS + PSI', v: 'Automated drift monitoring' },
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'scikit-learn', 'SQLite', 'Prisma'],
    github: null,
    accent: '#d62828',
  },
  {
    id: 'durgos',
    name: 'Durgos',
    tagline: 'AI-based drug repurposing',
    category: 'Graph ML · Reinforcement Learning',
    year: 'HealthTech',
    summary:
      'Suggests new uses for existing drugs by combining a knowledge graph, a Graph Transformer and a reinforcement learning agent.',
    problem:
      'Discovering a new drug takes years. Repurposing existing, already-approved drugs is faster, but the space of drug–disease–protein relationships is too large to search by hand.',
    approach: [
      'Built a Knowledge Graph (a structured graph, not an ML model) storing relationships between drugs, diseases and proteins.',
      'Trained a Graph Transformer on the graph to predict new drug–disease links that were not already known.',
      'Added a Reinforcement Learning agent that refines suggestions by rewarding useful predictions and penalising poor ones.',
    ],
    results: [
      { k: '3 parts', v: 'Knowledge graph → Graph Transformer → RL agent' },
      { k: 'Link prediction', v: 'Finds unseen drug–disease links' },
      { k: 'RL refinement', v: 'Reward-shaped suggestion ranking' },
    ],
    stack: ['Python', 'Knowledge Graphs', 'Graph Transformer', 'Reinforcement Learning'],
    github: null,
    accent: '#e85d04',
  },
  {
    id: 'nids',
    name: 'NIDS',
    tagline: 'Network intrusion detection with ML',
    category: 'Cybersecurity · Classical ML',
    year: 'Security',
    summary:
      'Detects and classifies malicious network traffic on the UNSW-NB15 dataset, with binary and multi-class models.',
    problem:
      'Networks see huge volumes of traffic, and attacks hide inside normal-looking flows. The system has to separate malicious from benign traffic and also say what kind of attack it is.',
    approach: [
      'Data preprocessing, feature engineering and feature selection on UNSW-NB15.',
      'PCA for dimensionality reduction, keeping about 95% of the variance.',
      'Compared multiple models including XGBoost for binary and multi-class classification.',
      'Evaluated with Accuracy, Precision, Recall, F1-score and PR-AUC, plus visual performance analysis.',
    ],
    results: [
      { k: '94.8%', v: 'Binary accuracy' },
      { k: '95.9%', v: 'Binary F1-score' },
      { k: '0.9954', v: 'Binary PR-AUC' },
      { k: '0.5906', v: 'Multi-class macro F1' },
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'XGBoost', 'Matplotlib', 'PCA'],
    github: 'https://github.com/rohans-oss/Network-Intrusion-Detection-System-NIDS-using-Machine-Learning',
    accent: '#c1121f',
  },
  {
    id: 'crop',
    name: 'CropSense',
    tagline: 'Crop disease detection & yield-loss estimation',
    category: 'Computer Vision · Tabular ML',
    year: 'AgriTech',
    summary:
      'Combines image-based crop disease analysis with soil and weather data to study disease patterns and their impact on yield.',
    problem:
      'Farmers see disease on the leaf, but the real question is how much yield it will cost. That needs vision and tabular agricultural data working together.',
    approach: [
      'Image preprocessing and feature extraction on 2,250 disease images across 16 classes.',
      'PCA reduced the image feature space from 1,860 features to 471 components, retaining about 95.03% of the variance.',
      'Separate ML pipeline for crop-yield analysis on 19,689 records with 9 soil and weather features.',
    ],
    results: [
      { k: '2,250', v: 'Images across 16 classes' },
      { k: '1,860 → 471', v: 'Features after PCA (95.03% variance)' },
      { k: '19,689', v: 'Crop-yield records analysed' },
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'PCA', 'Matplotlib', 'Computer Vision'],
    github: 'https://github.com/rohans-oss/Crop-Disease-Detection-Yield-Loss-Estimation',
    accent: '#9d0208',
  },
]

// Plain-text knowledge base handed to the LLM as its only source of truth.
export function buildKnowledgeBase() {
  const p = profile
  const lines = [
    `NAME: ${p.name}`,
    `HEADLINE: ${p.title}`,
    `LOCATION: ${p.location}`,
    `STATUS: ${p.availability}`,
    `CONTACT: email ${p.email}, phone ${p.phone}, GitHub ${p.github}`,
    `SUMMARY: ${p.summary}`,
    `EDUCATION: ${p.education.degree}, ${p.education.school}, ${p.education.city}. CGPA ${p.education.cgpa}/${p.education.cgpaMax}. Expected graduation ${p.education.graduation}.`,
    `SPOKEN LANGUAGES: ${p.languages.join(', ')}`,
    `SKILLS: ${p.skills.map((s) => `${s.group}: ${s.items.join(', ')}`).join(' | ')}`,
    '',
    'PROJECTS:',
  ]
  for (const pr of projects) {
    lines.push(
      `- ${pr.name} (${pr.tagline}; ${pr.category}). ${pr.summary} Problem: ${pr.problem} Approach: ${pr.approach.join(' ')} Results: ${pr.results
        .map((r) => `${r.k} = ${r.v}`)
        .join('; ')}. Stack: ${pr.stack.join(', ')}.${pr.github ? ` GitHub: ${pr.github}` : ''}`,
    )
  }
  return lines.join('\n')
}
