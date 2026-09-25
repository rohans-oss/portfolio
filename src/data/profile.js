// Single source of truth. The site, the offline chat engine and /api/chat all
// read from this file. Content merged from Rohan's résumé and details sheet.

const base = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.BASE_URL : '/'

export const profile = {
  name: 'Rohan S',
  role: 'AI/ML Engineer & Full-Stack Developer',
  year: '3rd-year B.Tech, Computer Science (AI/ML focus)',
  school: 'Atria University',
  location: 'Hebbal, Bengaluru',
  email: 'srohan02293@gmail.com',
  phone: '+91 90199 19218',
  phoneRaw: '+919019919218',
  github: 'https://github.com/rohans-oss',
  githubHandle: 'rohans-oss',
  linkedin: 'https://www.linkedin.com/in/rohan-s-553768336',
  linkedinHandle: 'rohan-s-553768336',
  resume: `${base}Rohan_S_Resume.pdf`,
  availability: 'Open to software and AI/ML internships',
  statement: 'I build AI systems that move beyond notebooks and into real products.',
  intro:
    'I’m a Computer Science student at Atria University with an interest in software development, AI/ML, and building practical technology projects. I enjoy learning new technologies and turning real-world problems into working solutions.',
  about: [
    {
      k: 'Who I am',
      v: '3rd-year Computer Science student at Atria University, Bengaluru, studying with a focus on programming, software development, AI/ML and data.',
    },
    {
      k: 'What I work on',
      v: 'AI/ML, web and full-stack development, data science and intelligent applications. Most of my projects pair a model with the API and interface people actually use.',
    },
    {
      k: 'Problems I like',
      v: 'Real-world problems that can be solved with software, automation, data and AI.',
    },
    {
      k: 'Background',
      v: 'Academic projects, personal projects, hackathons and startup work, including an internship at AU Venture Studio and the TiE Student Startup Program.',
    },
    {
      k: 'Goal',
      v: 'To become a skilled software engineer who builds impactful technology products.',
    },
  ],
  interests: [
    'Artificial Intelligence & Machine Learning',
    'Software Development',
    'Web Development',
    'Data Science & Analytics',
    'AI-powered real-world applications',
  ],
  education: {
    degree: 'B.Tech, Computer Science',
    focus: 'AI/ML focus',
    school: 'Atria University',
    city: 'Bengaluru, Karnataka',
    period: '2024 – 2028',
    graduation: 2028,
    cgpa: '8.0 / 10',
    schooling: [
      { level: 'Pre-university (PUC)', school: 'Sri Chaitanya College', place: 'Tirupati, Andhra Pradesh' },
      { level: 'Schooling', school: 'R. L. Jalappa Central School', place: 'Tamaka, Kolar, Karnataka' },
    ],
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Database Management',
      'Web Development',
      'Artificial Intelligence & Machine Learning',
    ],
  },
  experience: [
    {
      role: 'Intern',
      org: 'AU Venture Studio',
      kind: 'Internship',
      detail: null,
    },
  ],
  achievements: [
    {
      title: 'TiE Student Startup Program',
      detail: 'Selected with Team Cosmic for the Drugos startup project.',
    },
    {
      title: 'Hackathons',
      detail: 'Competed in multiple hackathons building software and AI prototypes.',
    },
  ],
  languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
  skills: [
    { group: 'Languages', items: ['Python', 'JavaScript', 'Java', 'SQL'] },
    {
      group: 'AI / ML',
      items: ['PyTorch', 'PyTorch Geometric', 'scikit-learn', 'XGBoost', 'EconML', 'Graph ML', 'Reinforcement Learning', 'Data preprocessing'],
    },
    { group: 'Web & Backend', items: ['React.js', 'Next.js', 'FastAPI', 'REST APIs', 'HTML', 'CSS'] },
    { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Neo4j'] },
    { group: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Figma', 'OR-Tools', 'Prisma'] },
  ],
}

export const projects = [
  {
    id: 'trustrail',
    name: 'TrustRail',
    tagline: 'Payment intelligence system',
    domain: 'FinTech',
    discipline: 'Causal ML · Full-stack',
    summary:
      'A two-stage payment intelligence system that flags social-engineering payment risk before money moves, then routes each payment to the gateway most likely to succeed.',
    how: [
      'Stage 1 predicts intent risk with a logistic-regression model on 9 behavioural features, catching scams such as fake collect-request “refunds”.',
      'Stage 2 is a causal gateway router: a doubly-robust learner (EconML) with 5-fold cross-fitting estimates each gateway’s true success probability, corrected for selection bias.',
      'A feedback loop retrains only on human-labelled outcomes, never on the model’s own predictions, to avoid a circular loop.',
      'Drift monitoring with the KS-test and Population Stability Index.',
    ],
    features: ['Payment risk detection', 'Intent-risk prediction', 'Causal gateway routing', 'Dashboard simulation', 'Model feedback and monitoring'],
    facts: [
      ['Stages', '2'],
      ['Risk features', '9'],
      ['Cross-fitting', '5-fold'],
      ['Drift tests', 'KS, PSI'],
    ],
    stack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'scikit-learn', 'EconML', 'Prisma', 'SQLite'],
    figure: 'Two-stage pipeline: risk screening before causal routing.',
    github: 'https://github.com/rohans-oss/TrustRail',
  },
  {
    id: 'drugos',
    name: 'Drugos',
    tagline: 'AI-powered drug discovery platform',
    domain: 'Life sciences',
    discipline: 'Graph ML · RL',
    summary:
      'Connects biomedical data on diseases, proteins, drugs and their biological relationships to find new uses for existing drugs and rank candidates. Selected for the TiE Student Startup Program with Team Cosmic.',
    how: [
      'A biomedical knowledge graph in Neo4j stores relationships between drugs, diseases and proteins.',
      'A Graph Transformer (PyTorch Geometric) predicts drug–disease links that are not already known.',
      'A reinforcement-learning agent refines the ranking, rewarding useful predictions and penalising poor ones.',
      'Served through a FastAPI back end and a React front end.',
    ],
    features: [
      'Biomedical knowledge graph',
      'Drug–disease relationship analysis',
      'Graph-based link prediction',
      'AI-powered candidate ranking',
      'RL-based recommendations',
      'Biomedical data integration',
    ],
    facts: [
      ['Entities', 'Drugs, diseases, proteins'],
      ['Model', 'Graph Transformer'],
      ['Ranking', 'RL-refined'],
      ['Program', 'TiE Student Startup'],
    ],
    stack: ['Python', 'PyTorch Geometric', 'Graph Transformer', 'Reinforcement Learning', 'Neo4j', 'FastAPI', 'React'],
    figure: 'Knowledge graph with a predicted drug → disease link (dashed).',
    github: 'https://github.com/rohans-oss/drugos',
  },
  {
    id: 'medflow',
    name: 'MedFlow AI',
    tagline: 'Hospital supply management platform',
    domain: 'Healthcare',
    discipline: 'Forecasting · Optimisation',
    summary:
      'Helps healthcare organisations monitor consumables, forecast demand, optimise procurement and manage inventory across multiple hospitals.',
    how: [
      'Multi-hospital inventory with FEFO (first-expiry, first-out) stock handling.',
      'Machine-learning demand forecasting feeds procurement decisions.',
      'Procurement optimisation with OR-Tools, backed by supplier intelligence from a Neo4j knowledge graph.',
      'An AI operations assistant plus a data import and integrations layer.',
    ],
    features: [
      'Hospital inventory management',
      'Demand forecasting',
      'FEFO stock management',
      'Supplier intelligence',
      'Procurement optimisation',
      'Multi-hospital management',
      'Knowledge graph',
      'AI operations assistant',
      'Data import and integrations',
    ],
    facts: [
      ['Scope', 'Multi-hospital'],
      ['Stock policy', 'FEFO'],
      ['Optimiser', 'OR-Tools'],
      ['Graph', 'Neo4j'],
    ],
    stack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'SQLite', 'Neo4j', 'OR-Tools', 'Machine Learning'],
    figure: 'Forecast → optimise → order, with expiry-first stock rotation.',
    github: 'https://github.com/rohans-oss/MedFlow-AI',
  },
  {
    id: 'crop',
    name: 'Crop Disease & Yield Loss',
    tagline: 'Detection and yield-loss estimation',
    domain: 'Agriculture',
    discipline: 'Computer vision · Tabular ML',
    summary:
      'Detects crop diseases from leaf images and estimates potential yield loss using agricultural, soil and weather data.',
    how: [
      'Image preprocessing and feature extraction on 2,250 leaf images across 16 disease classes.',
      'PCA reduces the image features from 1,860 to 471 components while keeping about 95.03% of the variance.',
      'A separate XGBoost pipeline estimates yield loss from 19,689 records of soil, weather and crop data.',
    ],
    features: [
      'Crop disease classification',
      'Image feature extraction',
      'PCA-based dimensionality reduction',
      'Yield loss estimation',
      'Soil and weather analysis',
      'Agricultural data visualisation',
    ],
    facts: [
      ['Images', '2,250 / 16 classes'],
      ['Features', '1,860 → 471'],
      ['Variance kept', '95.03%'],
      ['Yield records', '19,689'],
    ],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'PCA', 'Computer Vision'],
    figure: 'PCA compresses 1,860 image features into 471 components.',
    github: 'https://github.com/rohans-oss/Crop-Disease-Detection-Yield-Loss-Estimation',
  },
]

export const otherWork = [
  {
    id: 'nids',
    name: 'Network Intrusion Detection',
    tagline: 'ML-based detection of malicious network traffic on UNSW-NB15',
    summary:
      'Binary and multi-class intrusion detection with preprocessing, feature selection, PCA and a comparison of models including XGBoost.',
    facts: [
      ['Accuracy', '94.8%'],
      ['F1', '95.9%'],
      ['PR-AUC', '0.9954'],
      ['Multi-class macro F1', '0.5906'],
    ],
    stack: ['Python', 'Pandas', 'scikit-learn', 'XGBoost', 'PCA'],
    github: 'https://github.com/rohans-oss/Network-Intrusion-Detection-System-NIDS-using-Machine-Learning',
  },
]

// Plain-text knowledge base: the AI's only source of truth.
export function buildKnowledgeBase() {
  const p = profile
  const e = p.education
  const lines = [
    `NAME: ${p.name}`,
    `ROLE: ${p.role}`,
    `CURRENTLY: ${p.year} at ${p.school}, ${e.city}`,
    `LOCATION: ${p.location}`,
    `STATUS: ${p.availability}`,
    `CONTACT: email ${p.email}; phone ${p.phone}; LinkedIn ${p.linkedin}; GitHub ${p.github}`,
    `RESUME: downloadable PDF on the site`,
    `INTRO: ${p.intro}`,
    ...p.about.map((a) => `${a.k.toUpperCase()}: ${a.v}`),
    `INTERESTS: ${p.interests.join(', ')}`,
    `EDUCATION: ${e.degree} (${e.focus}), ${e.school}, ${e.city}, ${e.period}. CGPA ${e.cgpa}. Coursework: ${e.coursework.join(', ')}.`,
    `EARLIER EDUCATION: ${e.schooling.map((x) => `${x.level} at ${x.school}, ${x.place}`).join('; ')}.`,
    `EXPERIENCE: ${p.experience.map((x) => `${x.role} at ${x.org}`).join('; ')}`,
    `ACHIEVEMENTS: ${p.achievements.map((a) => `${a.title}: ${a.detail}`).join(' ')}`,
    `SPOKEN LANGUAGES: ${p.languages.join(', ')}`,
    `SKILLS: ${p.skills.map((s) => `${s.group}: ${s.items.join(', ')}`).join(' | ')}`,
    '',
    'PROJECTS:',
  ]
  for (const pr of [...projects, ...otherWork]) {
    lines.push(
      `- ${pr.name} (${pr.tagline}). ${pr.summary}${pr.how ? ` How it works: ${pr.how.join(' ')}` : ''}${
        pr.features ? ` Features: ${pr.features.join(', ')}.` : ''
      } Key facts: ${pr.facts.map(([k, v]) => `${k} ${v}`).join('; ')}. Stack: ${pr.stack.join(', ')}.${pr.github ? ` GitHub: ${pr.github}` : ''}`,
    )
  }
  return lines.join('\n')
}
