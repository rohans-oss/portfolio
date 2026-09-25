import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { Menu, Sparkles, X } from 'lucide-react'
import { ease } from './ui'

export function Preloader({ onDone }) {
  const [n, setN] = useState(0)
  const [show, setShow] = useState(true)
  useEffect(() => {
    const start = performance.now()
    const dur = 1100
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setShow(false), 180)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div className="preloader" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease }}>
          <div className="preloader-name">
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease }}>
              Rohan<em>.</em>
            </motion.span>
          </div>
          <div className="preloader-count">{String(n).padStart(3, '0')}</div>
          <div className="preloader-bar" style={{ transform: `scaleX(${n / 100})` }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [hover, setHover] = useState(false)
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)
  useEffect(() => {
    if (!enabled) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHover(!!e.target.closest?.('a, button, [data-hover]'))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, x, y])
  if (!enabled) return null
  return (
    <>
      <motion.div className={`cursor-ring ${hover ? 'is-hover' : ''}`} style={{ x: sx, y: sy }} />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  )
}

const links = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Skills', '#skills'],
  ['Education', '#education'],
  ['Contact', '#contact'],
]

export function Nav({ onChat, scrollTo }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach(([, h]) => {
      const el = document.querySelector(h)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])
  const go = (e, h) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(h)
  }
  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
      >
        <a href="#top" className="nav-logo" onClick={(e) => go(e, '#top')}>
          <span className="nav-logo-mark">R</span>
          <span>Rohan S</span>
        </a>
        <div className="nav-links">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={(e) => go(e, h)} className={active === h ? 'is-active' : ''}>
              {l}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <button className="btn btn-chip" onClick={onChat}>
            <Sparkles size={15} /> Ask my AI
          </button>
          <button className="nav-burger" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease }}
          >
            <button className="mobile-close" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={24} />
            </button>
            {links.map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={(e) => go(e, h)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, ease }}
              >
                <span className="mono">0{i + 1}</span> {l}
              </motion.a>
            ))}
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpen(false)
                onChat()
              }}
            >
              <Sparkles size={16} /> Ask my AI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
