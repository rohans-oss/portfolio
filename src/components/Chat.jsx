import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageSquare, RotateCcw, X } from 'lucide-react'
import { localAnswer } from '../lib/localBrain'
import { REFUSAL, isAboutRohan } from '../lib/scope'
import { Markdown } from './ui'

const ease = [0.3, 0.7, 0.2, 1]

const SUGGESTIONS = [
  'What has Rohan built?',
  'How does TrustRail route payments?',
  'Where did he intern?',
  'What is he studying?',
  'Is he open to internships?',
]

const GREETING = {
  role: 'assistant',
  content: `Ask me about Rohan's projects, skills, education or experience. I only answer questions about him.`,
}

async function ask(history) {
  if (!isAboutRohan(history.at(-1).content)) {
    await new Promise((res) => setTimeout(res, 400))
    return REFUSAL
  }
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 20000)
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history.filter((m) => m !== GREETING) }),
      signal: ctrl.signal,
    })
    clearTimeout(t)
    if (r.status === 429) return (await r.json()).error
    if (!r.ok) throw new Error(String(r.status))
    const d = await r.json()
    if (!d.reply) throw new Error('empty')
    return d.reply
  } catch {
    await new Promise((res) => setTimeout(res, 450 + Math.random() * 400))
    return localAnswer(history.at(-1).content)
  }
}

function Typewriter({ text, onTick, onDone }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) {
      onDone?.()
      return
    }
    const step = Math.max(2, Math.round(text.length / 120))
    const t = setTimeout(() => {
      setN((v) => Math.min(text.length, v + step))
      onTick?.()
    }, 14)
    return () => clearTimeout(t)
  }, [n, text, onTick, onDone])
  return <Markdown text={text.slice(0, n)} />
}

export default function Chat({ open, setOpen, pending }) {
  const [msgs, setMsgs] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [typingIdx, setTypingIdx] = useState(-1)
  const scroller = useRef(null)
  const inputRef = useRef(null)
  const lastPending = useRef(null)

  const toBottom = useCallback(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  const send = useCallback(
    async (text) => {
      const q = text.trim()
      if (!q || busy) return
      setInput('')
      setBusy(true)
      const history = [...msgs, { role: 'user', content: q }]
      setMsgs(history)
      const reply = await ask(history)
      setTypingIdx(history.length)
      setMsgs([...history, { role: 'assistant', content: reply }])
      setBusy(false)
    },
    [busy, msgs],
  )

  useEffect(() => {
    if (pending && pending.id !== lastPending.current) {
      lastPending.current = pending.id
      send(pending.text)
    }
  }, [pending, send])

  useEffect(toBottom, [msgs, busy, open, toBottom])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350)
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, setOpen])

  const showSuggestions = msgs.length <= 2 && !busy

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            className="chat-launcher"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <MessageSquare size={18} aria-hidden="true" />
            <span>Ask about Rohan</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            role="dialog"
            aria-label="Chat with Rohan's AI assistant"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.4, ease }}
            data-lenis-prevent
          >
            <div className="chat-head">
              <div className="chat-title">
                <strong>Ask about Rohan</strong>
                <span>Answers come only from his resume and projects</span>
              </div>
              <button
                className="chat-icon-btn"
                aria-label="Reset conversation"
                onClick={() => {
                  setMsgs([GREETING])
                  setTypingIdx(-1)
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button className="chat-icon-btn" aria-label="Close chat" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-body" ref={scroller}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  className={`msg msg-${m.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {m.role === 'assistant' && i === typingIdx ? (
                    <Typewriter text={m.content} onTick={toBottom} onDone={() => setTypingIdx(-1)} />
                  ) : (
                    <Markdown text={m.content} />
                  )}
                </motion.div>
              ))}
              {busy && (
                <div className="msg msg-assistant typing" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {showSuggestions && (
                <div className="suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      onClick={() => send(s)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question about Rohan"
                maxLength={500}
                aria-label="Your question"
              />
              <button type="submit" disabled={!input.trim() || busy} aria-label="Send">
                <ArrowUp size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
