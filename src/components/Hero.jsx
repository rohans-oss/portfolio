import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, MapPin, Sparkles } from 'lucide-react'
import { profile } from '../data/profile'
import { Magnetic, ease } from './ui'

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="role-rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const Letters = ({ text, delay, ready }) => (
  <span className="split" aria-label={text}>
    {[...text].map((ch, i) => (
      <span className="split-mask" key={i} aria-hidden="true">
        <motion.span
          initial={{ y: '110%' }}
          animate={ready ? { y: 0 } : {}}
          transition={{ duration: 1, delay: delay + i * 0.045, ease }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      </span>
    ))}
  </span>
)

export default function Hero({ ready, onChat, scrollTo }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 14 })
  const sry = useSpring(ry, { stiffness: 120, damping: 14 })
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  const fadeIn = (d) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay: d, ease },
  })

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-glow" />
      <div className="container hero-grid">
        <motion.div className="hero-copy" style={{ y: textY, opacity: fade }}>
          <motion.div className="status-pill" {...fadeIn(0.1)}>
            <span className="pulse-dot" />
            {profile.availability}
          </motion.div>

          <h1 className="hero-title">
            <Letters text="Rohan S" delay={0.15} ready={ready} />
          </h1>

          <motion.p className="hero-role" {...fadeIn(0.55)}>
            <RotatingRole />
          </motion.p>

          <motion.p className="hero-lede" {...fadeIn(0.7)}>
            I build <em>machine learning systems</em> end to end: from graph transformers and causal
            routers to the dashboards and APIs people actually use.
          </motion.p>

          <motion.div className="hero-cta" {...fadeIn(0.85)}>
            <Magnetic>
              <a
                href="#work"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo('#work')
                }}
              >
                View my work <ArrowUpRight size={17} />
              </a>
            </Magnetic>
            <Magnetic>
              <button className="btn btn-ghost" onClick={onChat}>
                <Sparkles size={16} /> Chat with my AI
              </button>
            </Magnetic>
          </motion.div>

          <motion.div className="hero-meta" {...fadeIn(1)}>
            <span>
              <MapPin size={14} /> {profile.location}
            </span>
            <span className="dot-sep" />
            <span>B.Tech CSE · Atria University</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-photo-wrap"
          style={{ y: photoY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.3, delay: 0.25, ease }}
        >
          <motion.div
            className="hero-photo"
            onMouseMove={tilt}
            onMouseLeave={reset}
            style={{ rotateX: srx, rotateY: sry }}
            data-hover
          >
            <motion.div
              className="hero-photo-clip"
              initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.25 }}
              animate={ready ? { clipPath: 'inset(0% 0 0 0)', scale: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.25, ease }}
            >
              <img src={profile.photo} alt="Portrait of Rohan S" width="608" height="522" />
            </motion.div>
            <div className="hero-photo-shine" />
            <div className="hero-photo-caption mono">
              <span>RS — 2026</span>
              <span>Bengaluru, IN</span>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <motion.button
        className="scroll-cue"
        onClick={() => scrollTo('#about')}
        aria-label="Scroll to about"
        {...fadeIn(1.4)}
      >
        <span className="mono">Scroll</span>
        <ArrowDown size={16} />
      </motion.button>
    </section>
  )
}
