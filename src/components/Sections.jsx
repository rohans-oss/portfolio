import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Check, Copy, GraduationCap, Languages, Mail, Phone, Plus, Sparkles, X } from 'lucide-react'
import { profile, projects } from '../data/profile'
import ProjectVisual, { useCardScale } from './ProjectVisual'
import { Counter, GithubIcon, Magnetic, Reveal, SectionHead, ease } from './ui'

/* ---------------- Marquee ---------------- */
export function Marquee() {
  const items = ['Machine Learning', 'Graph Transformers', 'Causal Inference', 'Next.js', 'FastAPI', 'Reinforcement Learning', 'XGBoost', 'Computer Vision', 'TypeScript', 'Knowledge Graphs']
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i}>
            {t} <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------- About ---------------- */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span style={{ opacity }} className="reveal-word">
      {children}{' '}
    </motion.span>
  )
}

function ScrollText({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="about-big">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead index="01" label="About" title={<>Engineer first. <em>Curious always.</em></>} />
        <ScrollText text="I'm a Computer Science student at Atria University in Bengaluru who likes turning messy real-world problems into working ML systems: catching UPI scams before money moves, finding new uses for old drugs, spotting network attacks and estimating crop losses." />
        <div className="about-grid">
          {profile.about.map((t, i) => (
            <Reveal key={i} delay={i * 0.1} className="about-para">
              {t}
            </Reveal>
          ))}
        </div>
        <div className="stats">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat">
              <div className="stat-value">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Projects ---------------- */
function ProjectCard({ p, i, total, container, onOpen }) {
  const scale = useCardScale(container, i, total)
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div className="stack-slot" style={{ top: `calc(90px + ${i * 22}px)` }}>
      <motion.article className="project-card" style={{ scale }} onMouseMove={spot}>
        <div className="project-body">
          <div className="project-top mono">
            <span>0{i + 1} / 0{total}</span>
            <span>{p.category}</span>
          </div>
          <h3 className="project-name">{p.name}</h3>
          <p className="project-tagline">{p.tagline}</p>
          <p className="project-summary">{p.summary}</p>
          <div className="project-metrics">
            {p.results.slice(0, 3).map((r) => (
              <div key={r.k}>
                <strong>{r.k}</strong>
                <span>{r.v}</span>
              </div>
            ))}
          </div>
          <div className="chips">
            {p.stack.slice(0, 6).map((s) => (
              <span className="chip" key={s}>{s}</span>
            ))}
          </div>
          <div className="project-actions">
            <button className="btn btn-primary" onClick={() => onOpen(p)}>
              <Plus size={16} /> Case study
            </button>
            {p.github && (
              <a className="btn btn-ghost" href={p.github} target="_blank" rel="noreferrer">
                <GithubIcon size={16} /> Code
              </a>
            )}
          </div>
        </div>
        <button className="project-visual" onClick={() => onOpen(p)} aria-label={`Open ${p.name} case study`}>
          <ProjectVisual id={p.id} />
        </button>
      </motion.article>
    </div>
  )
}

export function Projects({ onOpen }) {
  const ref = useRef(null)
  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead index="02" label="Selected Work" title={<>Things I've <em>built.</em></>}>
          Four systems across fintech, healthcare, security and agriculture. Open any card for the full case study.
        </SectionHead>
        <div className="stack" ref={ref}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} total={projects.length} container={ref} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectModal({ project, onClose, onAsk }) {
  useEffect(() => {
    if (!project) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [project, onClose])
  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} case study`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            data-lenis-prevent
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
            <div className="modal-hero">
              <div>
                <div className="mono modal-cat">{project.category}</div>
                <h3>{project.name}</h3>
                <p className="modal-tag">{project.tagline}</p>
              </div>
              <div className="modal-vis">
                <ProjectVisual id={project.id} />
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-block">
                <h4>The problem</h4>
                <p>{project.problem}</p>
              </div>
              <div className="modal-block">
                <h4>How it works</h4>
                <ol className="steps">
                  {project.approach.map((a, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                      <span className="step-n mono">{String(i + 1).padStart(2, '0')}</span>
                      <span>{a}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>
              <div className="modal-block">
                <h4>Results</h4>
                <div className="result-grid">
                  {project.results.map((r) => (
                    <div className="result" key={r.k}>
                      <strong>{r.k}</strong>
                      <span>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-block">
                <h4>Stack</h4>
                <div className="chips">
                  {project.stack.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                {project.github && (
                  <a className="btn btn-primary" href={project.github} target="_blank" rel="noreferrer">
                    <GithubIcon size={16} /> View repository <ArrowUpRight size={16} />
                  </a>
                )}
                <button className="btn btn-ghost" onClick={() => onAsk(`Tell me more about ${project.name}`)}>
                  <Sparkles size={16} /> Ask the AI about {project.name}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- Skills ---------------- */
export function Skills() {
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead index="03" label="Toolkit" title={<>What I <em>work with.</em></>} />
        <div className="bento">
          {profile.skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06} className={`bento-card b-${i}`}>
              <div className="bento-inner" onMouseMove={spot}>
                <div className="bento-head">
                  <span className="mono">0{i + 1}</span>
                  <h3>{g.group}</h3>
                </div>
                <div className="chips">
                  {g.items.map((s, j) => (
                    <motion.span
                      className="chip chip-lg"
                      key={s}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + j * 0.04 }}
                      whileHover={{ y: -3 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Education ---------------- */
function Ring({ value, max }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 130 130" className="ring">
      <circle cx="65" cy="65" r={r} stroke="var(--line)" strokeWidth="8" fill="none" />
      <motion.circle
        cx="65" cy="65" r={r} stroke="var(--accent)" strokeWidth="8" fill="none" strokeLinecap="round"
        strokeDasharray={c} transform="rotate(-90 65 65)"
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - value / max) }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease }}
      />
      <text x="65" y="66" textAnchor="middle" className="ring-num">{value.toFixed(1)}</text>
      <text x="65" y="86" textAnchor="middle" className="ring-sub">/ {max} CGPA</text>
    </svg>
  )
}

export function Education() {
  const e = profile.education
  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHead index="04" label="Education" title={<>Where I'm <em>learning.</em></>} />
        <div className="edu-grid">
          <Reveal className="edu-card">
            <div className="edu-icon"><GraduationCap size={22} /></div>
            <div className="edu-info">
              <div className="mono edu-when">Expected {e.graduation}</div>
              <h3>{e.school}</h3>
              <p>{e.degree}</p>
              <p className="muted">{e.city}, India</p>
            </div>
            <Ring value={e.cgpa} max={e.cgpaMax} />
          </Reveal>
          <Reveal delay={0.1} className="edu-card edu-lang">
            <div className="edu-icon"><Languages size={22} /></div>
            <div className="edu-info">
              <div className="mono edu-when">Spoken languages</div>
              <h3>Four languages</h3>
              <div className="chips">
                {profile.languages.map((l) => (
                  <span className="chip chip-lg" key={l}>{l}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Contact ---------------- */
export function Contact({ onChat, toast }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      toast('Email copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <SectionHead index="05" label="Contact" title={<>Let's build something <em>real.</em></>}>
          {profile.availability}. The fastest way to reach me is email.
        </SectionHead>
        <Reveal className="contact-email-row">
          <a href={`mailto:${profile.email}`} className="contact-email">{profile.email}</a>
          <Magnetic>
            <button className="btn btn-icon" onClick={copy} aria-label="Copy email">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </Magnetic>
        </Reveal>
        <div className="contact-cards">
          <Reveal className="contact-card" delay={0.05}>
            <a href={`mailto:${profile.email}`}>
              <Mail size={20} />
              <span className="mono">Email</span>
              <strong>Write to me</strong>
              <ArrowUpRight className="cc-arrow" size={18} />
            </a>
          </Reveal>
          <Reveal className="contact-card" delay={0.1}>
            <a href={`tel:${profile.phoneRaw}`}>
              <Phone size={20} />
              <span className="mono">Phone</span>
              <strong>{profile.phone}</strong>
              <ArrowUpRight className="cc-arrow" size={18} />
            </a>
          </Reveal>
          <Reveal className="contact-card" delay={0.15}>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <GithubIcon size={20} />
              <span className="mono">GitHub</span>
              <strong>@{profile.githubHandle}</strong>
              <ArrowUpRight className="cc-arrow" size={18} />
            </a>
          </Reveal>
          <Reveal className="contact-card cc-ai" delay={0.2}>
            <button onClick={onChat}>
              <Sparkles size={20} />
              <span className="mono">AI assistant</span>
              <strong>Ask anything about me</strong>
              <ArrowUpRight className="cc-arrow" size={18} />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer({ scrollTo }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-name">
          Rohan<em>.</em>
        </div>
        <div className="footer-meta mono">
          <span>© {new Date().getFullYear()} Rohan S</span>
          <span>Built with React & Framer Motion</span>
          <button onClick={() => scrollTo('#top')}>Back to top ↑</button>
        </div>
      </div>
    </footer>
  )
}
