import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, MessageSquare, X } from 'lucide-react'
import { projects } from '../data/profile'
import { GithubIcon } from './ui'

const ease = [0.22, 0.8, 0.24, 1]

/* ---------- Per-project animated scenes (pure SVG + CSS, loop forever) ---------- */

function TrustRailScene() {
  const gates = [
    { y: 44, p: 0.62 },
    { y: 90, p: 0.91 },
    { y: 136, p: 0.74 },
  ]
  return (
    <svg viewBox="0 0 320 180" className="scene">
      <path className="sc-wire" d="M78 90 H100 M170 90 H192" />
      <circle className="sc-packet" r="5">
        <animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;0.28;0.3;0.62;0.64;1" keyTimes="0;0.28;0.36;0.62;0.7;1" calcMode="linear" path="M46 90 H135 H219 C262 90 262 90 276 90" />
      </circle>
      <g className="sc-box">
        <rect x="14" y="72" width="64" height="36" rx="8" />
        <text x="46" y="94">UPI txn</text>
      </g>
      <g className="sc-box sc-accent">
        <rect x="100" y="72" width="70" height="36" rx="8" />
        <text x="135" y="89">Intent</text>
        <text x="135" y="101">risk</text>
      </g>
      <g className="sc-box sc-accent">
        <rect x="192" y="72" width="54" height="36" rx="8" />
        <text x="219" y="89">Causal</text>
        <text x="219" y="101">router</text>
      </g>
      {gates.map((g, i) => (
        <g key={i}>
          <path className="sc-wire" d={`M246 90 C262 90 262 ${g.y} 276 ${g.y}`} />
          <rect className="sc-gate-track" x="280" y={g.y - 5} width="30" height="10" rx="5" />
          <rect className={`sc-gate-bar ${i === 1 ? 'is-best' : ''}`} x="280" y={g.y - 5} width={30 * g.p} height="10" rx="5" />
        </g>
      ))}
      <text className="sc-caption" x="14" y="168">screen for scams → route to the likeliest gateway</text>
    </svg>
  )
}

function DrugosScene() {
  const n = [
    [40, 50, 'd'], [110, 30, 'p'], [180, 56, 'x'], [70, 118, 'p'], [150, 118, 'd'],
    [230, 104, 'p'], [270, 40, 'x'], [210, 150, 'x'], [290, 140, 'd'],
  ]
  const e = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [4, 5], [5, 6], [2, 6], [4, 7], [5, 8], [7, 8], [1, 4]]
  return (
    <svg viewBox="0 0 320 180" className="scene">
      {e.map(([a, b], i) => (
        <line key={i} className="sc-edge" x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} />
      ))}
      <line className="sc-predicted" x1={n[0][0]} y1={n[0][1]} x2={n[8][0]} y2={n[8][1]} />
      {n.map(([x, y, t], i) => (
        <circle key={i} className={`sc-node sc-node-${t}`} cx={x} cy={y} r={t === 'd' ? 8 : 6} style={{ animationDelay: `${i * -0.45}s` }} />
      ))}
      <g className="sc-legend">
        <circle cx="18" cy="168" r="4" className="sc-node-d" />
        <text x="26" y="171">drug</text>
        <circle cx="68" cy="168" r="4" className="sc-node-p" />
        <text x="76" y="171">protein</text>
        <circle cx="132" cy="168" r="4" className="sc-node-x" />
        <text x="140" y="171">disease</text>
        <line x1="190" y1="168" x2="210" y2="168" className="sc-predicted" />
        <text x="216" y="171">predicted link</text>
      </g>
    </svg>
  )
}

function MedFlowScene() {
  const bars = [0.8, 0.55, 0.7, 0.35, 0.62, 0.48, 0.74]
  return (
    <svg viewBox="0 0 320 180" className="scene">
      <line className="sc-axis" x1="20" y1="140" x2="300" y2="140" />
      <line className="sc-threshold" x1="20" y1="100" x2="300" y2="100" />
      {bars.map((h, i) => (
        <rect
          key={i}
          className={`sc-stock ${h < 0.5 ? 'is-low' : ''}`}
          x={30 + i * 38}
          y={140 - h * 100}
          width="22"
          height={h * 100}
          rx="4"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <path className="sc-forecast" d="M41 70 C90 60 110 95 155 90 S230 60 280 72" />
      <text className="sc-caption" x="20" y="168">stock vs reorder level (dashed) · demand forecast (line)</text>
    </svg>
  )
}

function CropScene() {
  const cells = Array.from({ length: 40 }, (_, i) => i)
  const sick = new Set([3, 9, 10, 17, 22, 26, 33])
  return (
    <svg viewBox="0 0 320 180" className="scene">
      {cells.map((i) => {
        const x = 20 + (i % 10) * 28
        const y = 18 + Math.floor(i / 10) * 28
        return <rect key={i} className={`sc-leaf ${sick.has(i) ? 'is-sick' : ''}`} x={x} y={y} width="22" height="22" rx="5" style={{ animationDelay: `${(i % 10) * 0.12}s` }} />
      })}
      <rect className="sc-scan" x="14" y="12" width="4" height="116" rx="2" />
      <text className="sc-num" x="20" y="158">1,860 → 471 features</text>
      <text className="sc-caption" x="20" y="172">16 disease classes · 95.03% variance kept</text>
    </svg>
  )
}

const scenes = { trustrail: TrustRailScene, drugos: DrugosScene, medflow: MedFlowScene, crop: CropScene }

/* ---------- Card ---------- */

function ProjectCard({ pr, index, onOpen }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 180, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 180, damping: 18 })
  const Scene = scenes[pr.id]

  const move = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    mx.set(x)
    my.set(y)
    ref.current.style.setProperty('--mx', `${x * 100}%`)
    ref.current.style.setProperty('--my', `${y * 100}%`)
  }
  const leave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.article
      className="pcard-wrap"
      id={`project-${pr.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease }}
    >
      <motion.div ref={ref} className="pcard" style={{ rotateX: rx, rotateY: ry }} onMouseMove={move} onMouseLeave={leave}>
        <div className="pcard-glow" aria-hidden="true" />
        <button className="pcard-visual" onClick={() => onOpen(pr.id)} aria-label={`Open ${pr.name} case study`}>
          <Scene />
        </button>
        <div className="pcard-body">
          <div className="pcard-meta">
            <span className="pcard-domain">{pr.domain}</span>
            <span className="pcard-disc">{pr.discipline}</span>
          </div>
          <h3 className="pcard-name">{pr.name}</h3>
          <p className="pcard-tagline">{pr.tagline}</p>
          <dl className="pcard-facts">
            {pr.facts.slice(0, 3).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="pcard-stack">{pr.stack.slice(0, 5).join(' / ')}</p>
          <div className="pcard-actions">
            <button className="btn btn-solid btn-small" onClick={() => onOpen(pr.id)}>
              Read case study
            </button>
            {pr.github && (
              <a className="btn btn-line btn-small" href={pr.github} target="_blank" rel="noreferrer">
                <GithubIcon size={15} />
                GitHub
                <ArrowUpRight size={14} className="nudge" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

export function ProjectGrid({ onOpen }) {
  return (
    <div className="pgrid">
      {projects.map((pr, i) => (
        <ProjectCard key={pr.id} pr={pr} index={i} onOpen={onOpen} />
      ))}
    </div>
  )
}

/* ---------- Case study modal ---------- */

const list = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }

export function CaseStudy({ id, onClose, onAsk }) {
  const pr = projects.find((x) => x.id === id)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!pr) return
    const prev = document.activeElement
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.documentElement.style.overflow = 'hidden'
    setTimeout(() => closeRef.current?.focus(), 50)
    return () => {
      window.removeEventListener('keydown', k)
      document.documentElement.style.overflow = ''
      prev?.focus?.({ preventScroll: true })
    }
  }, [pr, onClose])

  const Scene = pr ? scenes[pr.id] : null
  return (
    <AnimatePresence>
      {pr && (
        <motion.div
          className="cs-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="cs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cs-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
          >
            <button ref={closeRef} className="cs-close" onClick={onClose} aria-label="Close case study">
              <X size={20} />
            </button>
            <div className="cs-head">
              <div>
                <p className="pcard-domain">
                  {pr.domain} · {pr.discipline}
                </p>
                <h3 id="cs-title">{pr.name}</h3>
                <p className="cs-tagline">{pr.tagline}</p>
              </div>
              <div className="cs-visual">
                <Scene />
              </div>
            </div>
            <div className="cs-body">
              <p className="cs-summary">{pr.summary}</p>
              <div className="cs-grid">
                <div>
                  <h4>How it works</h4>
                  <motion.ol className="steps" variants={list} initial="hidden" animate="show">
                    {pr.how.map((s, i) => (
                      <motion.li key={i} variants={item}>
                        {s}
                      </motion.li>
                    ))}
                  </motion.ol>
                </div>
                <div>
                  <motion.dl className="facts" variants={list} initial="hidden" animate="show">
                    {pr.facts.map(([k, v]) => (
                      <motion.div key={k} variants={item}>
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
                </div>
              </div>
              <div className="cs-actions">
                {pr.github && (
                  <a className="btn btn-solid" href={pr.github} target="_blank" rel="noreferrer">
                    <GithubIcon size={16} />
                    View code on GitHub
                    <ArrowUpRight size={16} className="nudge" aria-hidden="true" />
                  </a>
                )}
                <button className="btn btn-line" onClick={() => onAsk(`Tell me more about ${pr.name}`)}>
                  <MessageSquare size={16} aria-hidden="true" />
                  Ask the assistant about {pr.name}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
