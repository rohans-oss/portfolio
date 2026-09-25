import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Download, Mail, MessageSquare, Minus, Phone, Plus } from 'lucide-react'
import { otherWork, profile as p, projects } from '../data/profile'
import WorkGraph from './WorkGraph'
import { GithubIcon, LinkedinIcon } from './ui'

const resumeName = 'Rohan_S_Resume.pdf'
const ease = [0.22, 0.8, 0.24, 1]

/* Reveal: one consistent entrance used across the page — a short rise and fade,
   played once when the element first scrolls into view. */
function Reveal({ children, delay = 0, as = 'div', className, ...rest }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}

export function Header({ onChat }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap header-row">
        <a href="#top" className="wordmark">
          Rohan S
        </a>
        <nav className="header-nav" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button className="header-ask" onClick={onChat} aria-label="Ask about Rohan">
            <MessageSquare size={18} aria-hidden="true" />
          </button>
          <a className="btn btn-solid btn-small btn-download" href={p.resume} download={resumeName}>
            <Download size={15} aria-hidden="true" />
            Résumé
          </a>
        </div>
      </div>
    </header>
  )
}

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export function Hero({ onOpenProject }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-grid">
        <motion.div className="hero-text" variants={heroStagger} initial="hidden" animate="show">
          <motion.p className="hero-hello" variants={heroItem}>
            <span className="status-dot" aria-hidden="true" />
            Open to software and AI/ML internships
          </motion.p>
          <motion.h1 variants={heroItem}>Rohan S</motion.h1>
          <motion.p className="lede" variants={heroItem}>
            {p.statement}
          </motion.p>
          <motion.dl className="hero-facts" variants={heroItem}>
            <div>
              <dt>Role</dt>
              <dd>{p.role}</dd>
            </div>
            <div>
              <dt>Studying</dt>
              <dd>3rd-year B.Tech in Computer Science, {p.school}</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{p.location}</dd>
            </div>
          </motion.dl>
          <motion.div className="hero-actions" variants={heroItem}>
            <a className="btn btn-solid btn-download" href={p.resume} download={resumeName}>
              <Download size={17} aria-hidden="true" />
              Download résumé
            </a>
            <a className="btn btn-line" href={`mailto:${p.email}`}>
              <Mail size={17} aria-hidden="true" />
              Email me
            </a>
            <div className="hero-links">
              <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                <LinkedinIcon size={20} />
              </a>
              <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                <GithubIcon size={20} />
              </a>
            </div>
          </motion.div>
        </motion.div>
        <motion.figure
          className="hero-graph"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
        >
          <WorkGraph onOpen={onOpenProject} />
          <figcaption>
            My projects and the tools behind each one. Point at a tool to see where I’ve used it; select a project to read
            about it. Nodes can be dragged.
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

const panelList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
}
const panelItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease } },
}

function ProjectRow({ pr, open, onToggle, onAsk, index }) {
  const panelId = `panel-${pr.id}`
  return (
    <Reveal as="article" delay={index * 0.06} className={`project ${open ? 'is-open' : ''}`} id={`project-${pr.id}`}>
      <h3 className="project-heading">
        <button className="project-toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="project-name">{pr.name}</span>
          <span className="project-tagline">{pr.tagline}</span>
          <span className="project-domain">{pr.domain}</span>
          <span className="project-icon" aria-hidden="true">
            {open ? <Minus size={20} /> : <Plus size={20} />}
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="project-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="panel-grid">
              <div className="panel-main">
                <p className="panel-summary">{pr.summary}</p>
                <h4>How it works</h4>
                <motion.ol className="steps" variants={panelList} initial="hidden" animate="show">
                  {pr.how.map((s, i) => (
                    <motion.li key={i} variants={panelItem}>
                      {s}
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
              <div className="panel-side">
                <motion.dl className="facts" variants={panelList} initial="hidden" animate="show">
                  {pr.facts.map(([k, v]) => (
                    <motion.div key={k} variants={panelItem}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </motion.div>
                  ))}
                </motion.dl>
                <h4>Features</h4>
                <ul className="features">
                  {pr.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <h4>Built with</h4>
                <p className="stack">{pr.stack.join(', ')}</p>
                <div className="panel-actions">
                  {pr.github && (
                    <a className="btn btn-solid btn-small" href={pr.github} target="_blank" rel="noreferrer">
                      <GithubIcon size={15} />
                      View code on GitHub
                      <ArrowUpRight size={15} aria-hidden="true" className="nudge" />
                    </a>
                  )}
                  <button className="btn btn-text" onClick={() => onAsk(`Tell me more about ${pr.name}`)}>
                    <MessageSquare size={15} aria-hidden="true" />
                    Ask the assistant about {pr.name}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  )
}

export function Work({ openId, setOpenId, onAsk }) {
  const nids = otherWork[0]
  return (
    <section className="section section-work" id="work">
      <div className="wrap">
        <div className="section-intro">
          <Reveal as="h2">Selected work</Reveal>
          <Reveal as="p" delay={0.08}>
            Four systems I designed and built, from the model to the interface. Open one to see how it works, or go straight
            to the code.
          </Reveal>
        </div>
        <div className="project-list">
          {projects.map((pr, i) => (
            <ProjectRow
              key={pr.id}
              index={i}
              pr={pr}
              open={openId === pr.id}
              onToggle={() => setOpenId(openId === pr.id ? null : pr.id)}
              onAsk={onAsk}
            />
          ))}
        </div>
        <Reveal className="also" id={`project-${nids.id}`}>
          <h3>Also built</h3>
          <div className="also-row">
            <div>
              <p className="also-name">{nids.name}</p>
              <p className="also-text">
                {nids.tagline}. {nids.facts.map(([k, v]) => `${k} ${v}`).join(', ')}.
              </p>
            </div>
            <a className="btn btn-line btn-small" href={nids.github} target="_blank" rel="noreferrer">
              <GithubIcon size={15} />
              View code
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap two-col">
        <Reveal as="h2">About</Reveal>
        <div>
          <Reveal as="p" className="about-lede">
            {p.intro}
          </Reveal>
          <dl className="about-list">
            {p.about.map((a, i) => (
              <Reveal key={a.k} delay={i * 0.05}>
                <dt>{a.k}</dt>
                <dd>{a.v}</dd>
              </Reveal>
            ))}
            <Reveal delay={p.about.length * 0.05}>
              <dt>Interests</dt>
              <dd>{p.interests.join(', ')}</dd>
            </Reveal>
          </dl>
        </div>
      </div>
    </section>
  )
}

export function Record() {
  const e = p.education
  return (
    <section className="section" id="experience">
      <div className="wrap two-col">
        <Reveal as="h2">Experience and education</Reveal>
        <div className="record">
          <Reveal className="record-group">
            <h3>Experience</h3>
            {p.experience.map((x) => (
              <div className="record-item" key={x.org}>
                <p className="record-title">{x.org}</p>
                <p className="record-meta">{x.role}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="record-group">
            <h3>Recognition</h3>
            {p.achievements.map((a) => (
              <div className="record-item" key={a.title}>
                <p className="record-title">{a.title}</p>
                <p className="record-meta">{a.detail}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="record-group">
            <h3>Education</h3>
            <div className="record-item">
              <p className="record-title">{e.school}</p>
              <p className="record-meta">
                {e.degree} ({e.focus}), {e.period}
              </p>
              <p className="record-meta">CGPA {e.cgpa}</p>
              <p className="record-note">Coursework: {e.coursework.join(', ')}.</p>
            </div>
            {e.schooling.map((x) => (
              <div className="record-item" key={x.school}>
                <p className="record-title">{x.school}</p>
                <p className="record-meta">
                  {x.level}, {x.place}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// Which projects use each skill, so hovering a skill can show it.
const norm = (s) => s.toLowerCase().replace(/\.js$/, '').replace(/[^a-z0-9]/g, '')
const usage = new Map()
for (const pr of [...projects, ...otherWork]) {
  for (const s of pr.stack) {
    const k = norm(s)
    usage.set(k, [...(usage.get(k) || []), pr.name.replace(' & Yield Loss', '').replace('Network Intrusion Detection', 'NIDS')])
  }
}

function Skill({ name }) {
  const used = usage.get(norm(name))
  const [show, setShow] = useState(false)
  if (!used) return <span className="skill">{name}</span>
  return (
    <span
      className="skill skill-used"
      tabIndex={0}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {name}
      <AnimatePresence>
        {show && (
          <motion.span
            className="skill-tip"
            role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
          >
            Used in {used.join(', ')}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap two-col">
        <div>
          <Reveal as="h2">Skills</Reveal>
          <Reveal as="p" delay={0.08} className="section-note">
            Underlined skills show which projects use them.
          </Reveal>
        </div>
        <table className="skills">
          <tbody>
            {p.skills.map((s, i) => (
              <Reveal as="tr" key={s.group} delay={i * 0.05}>
                <th scope="row">{s.group}</th>
                <td>
                  {s.items.map((it, j) => (
                    <span key={it}>
                      <Skill name={it} />
                      {j < s.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
              </Reveal>
            ))}
            <Reveal as="tr" delay={p.skills.length * 0.05}>
              <th scope="row">Spoken</th>
              <td>{p.languages.join(', ')}</td>
            </Reveal>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (ev) => {
    ev.preventDefault()
    const f = new FormData(ev.currentTarget)
    const subject = `Portfolio enquiry from ${f.get('name')}`
    const body = `${f.get('message')}\n\n${f.get('name')}\n${f.get('email')}`
    window.location.href = `mailto:${p.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return (
    <section className="section contact" id="contact">
      <div className="contact-bg" aria-hidden="true" />
      <div className="wrap two-col">
        <Reveal as="h2">Contact</Reveal>
        <div className="contact-grid">
          <Reveal>
            <p className="contact-lede">Email is the quickest way to reach me. I’m looking for software and AI/ML internships.</p>
            <dl className="contact-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${p.email}`}>{p.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${p.phoneRaw}`}>{p.phone}</a>
                </dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={p.linkedin} target="_blank" rel="noreferrer">
                    {p.linkedinHandle}
                  </a>
                </dd>
              </div>
              <div>
                <dt>GitHub</dt>
                <dd>
                  <a href={p.github} target="_blank" rel="noreferrer">
                    {p.githubHandle}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{p.location}</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal as="form" delay={0.1} className="contact-form" onSubmit={submit}>
            <label>
              <span>Your name</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>Your email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows={5} required />
            </label>
            <button className="btn btn-solid" type="submit">
              <Mail size={17} aria-hidden="true" />
              Write email
            </button>
            <p className="form-note" role="status">
              {sent
                ? 'Your email app should now be open with the message filled in. Press send there to deliver it.'
                : 'This opens your email app with the message filled in.'}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <p>© {new Date().getFullYear()} Rohan S</p>
        <div className="footer-links">
          <a href={p.resume} download={resumeName}>
            Résumé (PDF)
          </a>
          <a href={`tel:${p.phoneRaw}`} aria-label="Call Rohan">
            <Phone size={15} />
          </a>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  )
}
