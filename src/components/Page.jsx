import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Mail, MessageSquare, Minus, Phone, Plus } from 'lucide-react'
import { otherWork, profile as p, projects } from '../data/profile'
import WorkGraph from './WorkGraph'
import { GithubIcon, LinkedinIcon } from './ui'

const resumeName = 'Rohan_S_Resume.pdf'

export function Header({ onChat }) {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a href="#top" className="wordmark">
          Rohan S
        </a>
        <nav className="header-nav" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button className="header-ask" onClick={onChat} aria-label="Ask about Rohan">
            <MessageSquare size={18} aria-hidden="true" />
          </button>
          <a className="btn btn-solid btn-small" href={p.resume} download={resumeName}>
            <Download size={15} aria-hidden="true" />
            Résumé
          </a>
        </div>
      </div>
    </header>
  )
}

export function Hero({ onOpenProject }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <h1>Rohan S</h1>
          <p className="lede">{p.statement}</p>
          <dl className="hero-facts">
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
            <div>
              <dt>Looking for</dt>
              <dd>Software and AI/ML internships</dd>
            </div>
          </dl>
          <div className="hero-actions">
            <a className="btn btn-solid" href={p.resume} download={resumeName}>
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
          </div>
        </div>
        <figure className="hero-graph">
          <WorkGraph onOpen={onOpenProject} />
          <figcaption>
            My projects and the tools behind each one. Point at a tool to see where I’ve used it; select a project to read
            about it. Nodes can be dragged.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function ProjectRow({ pr, open, onToggle, onAsk }) {
  const panelId = `panel-${pr.id}`
  return (
    <article className={`project ${open ? 'is-open' : ''}`} id={`project-${pr.id}`}>
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
            transition={{ duration: 0.4, ease: [0.3, 0.7, 0.2, 1] }}
          >
            <div className="panel-grid">
              <div className="panel-main">
                <p className="panel-summary">{pr.summary}</p>
                <h4>How it works</h4>
                <ol className="steps">
                  {pr.how.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
              <div className="panel-side">
                <dl className="facts">
                  {pr.facts.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
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
                    <a className="btn btn-line btn-small" href={pr.github} target="_blank" rel="noreferrer">
                      <GithubIcon size={15} />
                      View code
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
    </article>
  )
}

export function Work({ openId, setOpenId, onAsk }) {
  const nids = otherWork[0]
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section-intro">
          <h2>Selected work</h2>
          <p>Four systems I designed and built, from the model to the interface. Open one to see how it works.</p>
        </div>
        <div className="project-list">
          {projects.map((pr) => (
            <ProjectRow
              key={pr.id}
              pr={pr}
              open={openId === pr.id}
              onToggle={() => setOpenId(openId === pr.id ? null : pr.id)}
              onAsk={onAsk}
            />
          ))}
        </div>
        <div className="also" id={`project-${nids.id}`}>
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
        </div>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap two-col">
        <h2>About</h2>
        <div>
          <p className="about-lede">{p.intro}</p>
          <dl className="about-list">
            {p.about.map((a) => (
              <div key={a.k}>
                <dt>{a.k}</dt>
                <dd>{a.v}</dd>
              </div>
            ))}
            <div>
              <dt>Interests</dt>
              <dd>{p.interests.join(', ')}</dd>
            </div>
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
        <h2>Experience and education</h2>
        <div className="record">
          <div className="record-group">
            <h3>Experience</h3>
            {p.experience.map((x) => (
              <div className="record-item" key={x.org}>
                <p className="record-title">{x.org}</p>
                <p className="record-meta">{x.role}</p>
              </div>
            ))}
          </div>
          <div className="record-group">
            <h3>Recognition</h3>
            {p.achievements.map((a) => (
              <div className="record-item" key={a.title}>
                <p className="record-title">{a.title}</p>
                <p className="record-meta">{a.detail}</p>
              </div>
            ))}
          </div>
          <div className="record-group">
            <h3>Education</h3>
            <div className="record-item">
              <p className="record-title">{e.school}</p>
              <p className="record-meta">
                {e.degree} ({e.focus}), {e.period}
              </p>
              <p className="record-meta">CGPA {e.cgpa}</p>
              <p className="record-note">Coursework: {e.coursework.join(', ')}.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap two-col">
        <h2>Skills</h2>
        <table className="skills">
          <tbody>
            {p.skills.map((s) => (
              <tr key={s.group}>
                <th scope="row">{s.group}</th>
                <td>{s.items.join(', ')}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Spoken</th>
              <td>{p.languages.join(', ')}</td>
            </tr>
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
      <div className="wrap two-col">
        <h2>Contact</h2>
        <div className="contact-grid">
          <div>
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
          </div>
          <form className="contact-form" onSubmit={submit}>
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
          </form>
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
