import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { Cursor, Nav, Preloader } from './components/Chrome'
import Hero from './components/Hero'
import { About, Contact, Education, Footer, Marquee, ProjectModal, Projects, Skills } from './components/Sections'
import Chat from './components/Chat'

export default function App() {
  const [ready, setReady] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [project, setProject] = useState(null)
  const [pending, setPending] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const lenis = useRef(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.current = l
    let raf
    const loop = (t) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])

  // Pause page scroll under the preloader and modal (chat stays non-blocking on desktop).
  useEffect(() => {
    const lock = !ready || !!project
    document.documentElement.classList.toggle('no-scroll', lock)
    if (lock) lenis.current?.stop()
    else lenis.current?.start()
  }, [ready, project])

  const scrollTo = useCallback((hash) => {
    const target = hash === '#top' ? 0 : document.querySelector(hash)
    if (lenis.current) lenis.current.scrollTo(target, { offset: -20 })
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
    else target?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const toast = useCallback((m) => {
    setToastMsg(m)
    setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const askAbout = (text) => {
    setProject(null)
    setChatOpen(true)
    setPending({ id: Date.now(), text })
  }

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Nav onChat={() => setChatOpen(true)} scrollTo={scrollTo} />

      <main>
        <Hero ready={ready} onChat={() => setChatOpen(true)} scrollTo={scrollTo} />
        <Marquee />
        <About />
        <Projects onOpen={setProject} />
        <Skills />
        <Education />
        <Contact onChat={() => setChatOpen(true)} toast={toast} />
      </main>
      <Footer scrollTo={scrollTo} />

      <ProjectModal project={project} onClose={() => setProject(null)} onAsk={askAbout} />
      <Chat open={chatOpen} setOpen={setChatOpen} pending={pending} />

      <AnimatePresence>
        {toastMsg && (
          <motion.div className="toast" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
