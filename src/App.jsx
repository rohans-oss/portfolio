import { useCallback, useState } from 'react'
import { About, Contact, Footer, Header, Hero, Ideas, Record, ScrollProgress, Skills, ThankYou, Work } from './components/Page'
import { CaseStudy } from './components/ProjectCards'
import Intro from './components/Intro'
import Chat from './components/Chat'

export default function App() {
  const [ready, setReady] = useState(false)
  const [openId, setOpenId] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [pending, setPending] = useState(null)

  const introDone = useCallback(() => setReady(true), [])

  // Selecting a project (graph node or card) opens its case study. NIDS has no
  // case study, so the graph scrolls to its "Also built" entry instead.
  const openProject = useCallback((id) => {
    if (id !== 'nids') {
      setOpenId(id)
      return
    }
    const el = document.getElementById('project-nids')
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' })
  }, [])
  const closeProject = useCallback(() => setOpenId(null), [])

  const askAbout = useCallback((text) => {
    setOpenId(null)
    setChatOpen(true)
    setPending({ id: Date.now(), text })
  }, [])

  return (
    <>
      <Intro onDone={introDone} />
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <ScrollProgress />
      <Header onChat={() => setChatOpen(true)} />
      <main>
        <Hero onOpenProject={openProject} ready={ready} />
        <Work onOpen={openProject} />
        <About />
        <Record />
        <Skills />
        <Contact />
        <Ideas />
        <ThankYou />
      </main>
      <Footer />
      <CaseStudy id={openId} onClose={closeProject} onAsk={askAbout} />
      <Chat open={chatOpen} setOpen={setChatOpen} pending={pending} />
    </>
  )
}
