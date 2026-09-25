import { useCallback, useState } from 'react'
import { About, Contact, Footer, Header, Hero, Record, ScrollProgress, Skills, Work } from './components/Page'
import Chat from './components/Chat'

export default function App() {
  const [openId, setOpenId] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [pending, setPending] = useState(null)

  // Selecting a project in the graph opens its write-up and scrolls to it.
  const openProject = useCallback((id) => {
    if (id !== 'nids') setOpenId(id)
    // Wait for the click (and the focus it moves) to finish before scrolling,
    // otherwise the browser cancels the smooth scroll.
    setTimeout(() => {
      const el = document.getElementById(`project-${id}`)
      if (!el) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    }, 60)
  }, [])

  const askAbout = useCallback((text) => {
    setChatOpen(true)
    setPending({ id: Date.now(), text })
  }, [])

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <ScrollProgress />
      <Header onChat={() => setChatOpen(true)} />
      <main>
        <Hero onOpenProject={openProject} />
        <Work openId={openId} setOpenId={setOpenId} onAsk={askAbout} />
        <About />
        <Record />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Chat open={chatOpen} setOpen={setChatOpen} pending={pending} />
    </>
  )
}
