import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.22, 0.8, 0.24, 1]
const WORDS = ["Rohan's", 'portfolio']

// Opening screen: "Welcome to" rises in, the title reveals word by word, an
// underline draws, then the panel lifts away to show the page. It plays once per
// browser tab session, can be skipped with a click or any key, and is skipped
// entirely for people who prefer reduced motion.
function shouldPlay() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem('rs-intro-seen') !== '1'
  } catch {
    return true
  }
}

export default function Intro({ onDone }) {
  const [show, setShow] = useState(shouldPlay)

  useEffect(() => {
    if (!show) {
      onDone()
      return
    }
    try {
      sessionStorage.setItem('rs-intro-seen', '1')
    } catch {
      /* private mode: just play every time */
    }
    const t = setTimeout(() => setShow(false), 2600)
    const skip = () => setShow(false)
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', skip)
    }
  }, [show, onDone])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="intro"
          onClick={() => setShow(false)}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          role="presentation"
        >
          <div className="intro-inner">
            <motion.p
              className="intro-kicker"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              Welcome to
            </motion.p>
            <h1 className="intro-title" aria-label="Rohan's portfolio">
              {WORDS.map((w, i) => (
                <span className="intro-mask" key={w} aria-hidden="true">
                  <motion.span
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 + i * 0.16, ease }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.span
              className="intro-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 1.05, ease }}
            />
            <motion.p
              className="intro-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.35 }}
            >
              AI/ML Engineer and Full-Stack Developer
            </motion.p>
          </div>
          <motion.p className="intro-skip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Tap or click to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
