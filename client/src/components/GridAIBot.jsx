import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Send, X, Sparkles, Bot } from 'lucide-react'
import axios from 'axios'
import GRIDLogoIcon from './GRIDLogoIcon'

const STORAGE_KEY = 'grid_ai_chat_history_v1'
const DEFAULT_MESSAGES = [
  {
    role: 'bot',
    text: "Hey, I'm the GRID Assistant. Ask me about events, projects, members, or how to get started.",
  },
]

function loadStoredMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_MESSAGES
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_MESSAGES
  } catch {
    return DEFAULT_MESSAGES
  }
}

const TEASERS = [
  'How can I help you?',
  'Ask me anything about GRID',
  'Need help finding something?',
  "I'm here if you need me 👋",
  'Curious about events or projects?',
]

const QUICK_PROMPTS = [
  'What is GRID?',
  'How do I join?',
  'Show me events',
  'Find projects',
]

const KB = [
  {
    match: /(what.*is.*grid|about grid|who are you)/i,
    reply: "GRID is a premium community for ML researchers, engineers, and builders — think structured, searchable conversations instead of scattered DMs. You can explore our story on the About page.",
    link: { to: '/about', label: 'About GRID' },
  },
  {
    match: /(join|register|sign ?up|become a member)/i,
    reply: "Joining is quick — just create a free account and pick your role. You'll get access to the forum, events, and member directory right away.",
    link: { to: '/register', label: 'Create your account' },
  },
  {
    match: /(login|log in|sign in)/i,
    reply: "You can sign in anytime from the login page — your dashboard, saved posts, and profile will be right there.",
    link: { to: '/login', label: 'Go to Login' },
  },
  {
    match: /(project|open source|github|repo)/i,
    reply: "Our Projects page showcases open-source work built by the community — a great place to find collaborators or contribute.",
    link: { to: '/projects', label: 'Explore Projects' },
  },
  {
    match: /(blog|article|read)/i,
    reply: "The Blog has technical articles from members across categories like ML research, engineering, and career growth.",
    link: { to: '/blog', label: 'Read the Blog' },
  },
  {
    match: /(member|people|researcher|team|who.*built)/i,
    reply: "GRID has 12,000+ ML researchers, engineers, and practitioners. You can browse the member directory to see who's active.",
    link: { to: '/members', label: 'See Members' },
  },
  {
    match: /(dashboard|profile|my account|my stats)/i,
    reply: "Your Dashboard has your stats, badges, activity feed, and quick links — all in one place once you're signed in.",
    link: { to: '/dashboard', label: 'Open Dashboard' },
  },
  {
    match: /(thank|thanks|thx)/i,
    reply: "Anytime! I'm always parked right here if you need anything else. 🚀",
  },
  {
    match: /(hi|hello|hey|namaste)/i,
    reply: "Hey there! I'm the GRID assistant. Ask me about events, projects, the forum, or how to join the community.",
  },
]

const FALLBACK_REPLIES = [
  "I'm still learning, but I can help you navigate GRID — try asking about events, projects, the forum, or joining.",
  "Not sure about that one yet — but I can point you to Members, Events, Blog, Projects, or the Forum.",
  "Good question! For deeper answers, the community Forum is a great place to ask — or try asking me about GRID's events or projects.",
]

const EVENT_QUERY = /(event|hackathon|workshop|conference|meetup|upcoming)/i
const FORUM_QUERY = /(forum|discussion|thread|trending|hot topic|popular)/i

function formatEventDate(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return d
  }
}

function buildEventsReply(events) {
  if (!events || !events.length) {
    return {
      reply: "I couldn't find any events loaded right now — but the Events page always has the freshest schedule.",
      link: { to: '/events', label: 'Browse Events' },
    }
  }
  const upcoming = events.slice(0, 3)
  const lines = upcoming.map(e => `• ${e.title}${e.date ? ` — ${formatEventDate(e.date)}` : ''}${e.location ? ` (${e.location})` : ''}`).join('\n')
  return {
    reply: `Here's what's coming up on GRID:\n${lines}`,
    link: { to: '/events', label: 'See all events' },
  }
}

function buildForumReply(threads) {
  if (!threads || !threads.length) {
    return {
      reply: "The forum's a little quiet in my cache right now — head over and see what's fresh.",
      link: { to: '/forum', label: 'Visit the Forum' },
    }
  }
  const trending = [...threads].sort((a, b) => (b.hot === a.hot ? (b.likes || 0) - (a.likes || 0) : b.hot ? 1 : -1)).slice(0, 3)
  const lines = trending.map(t => `• ${t.title}${t.replies != null ? ` — ${t.replies} replies` : ''}${t.hot ? ' 🔥' : ''}`).join('\n')
  return {
    reply: `Trending on the GRID forum right now:\n${lines}`,
    link: { to: '/forum', label: 'Open the Forum' },
  }
}

function getReply(input, liveData) {
  if (EVENT_QUERY.test(input)) return buildEventsReply(liveData.events)
  if (FORUM_QUERY.test(input)) return buildForumReply(liveData.forum)
  const hit = KB.find(k => k.match.test(input))
  if (hit) return hit
  return { reply: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)] }
}

export default function GridAIBot() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [teaserIndex, setTeaserIndex] = useState(0)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState(loadStoredMessages)
  const [liveData, setLiveData] = useState({ events: [], forum: [] })
  const scrollRef = useRef(null)
  const teaserTimerRef = useRef(null)

  // Pull live events + forum data once so the assistant can answer with real info
  useEffect(() => {
    axios.get('/api/events').then(r => setLiveData(d => ({ ...d, events: r.data || [] }))).catch(() => {})
    axios.get('/api/forum').then(r => setLiveData(d => ({ ...d, forum: r.data || [] }))).catch(() => {})
  }, [])

  // Persist the conversation across page navigations and reloads (per browser tab)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  // Cycle the "How can I help you?" teaser bubble in and out on a loop
  useEffect(() => {
    if (open) {
      setShowTeaser(false)
      return
    }
    let hideTimeout
    const cycle = () => {
      setShowTeaser(true)
      hideTimeout = setTimeout(() => {
        setShowTeaser(false)
        setTeaserIndex(i => (i + 1) % TEASERS.length)
      }, 3600)
    }
    const startDelay = setTimeout(cycle, 1800)
    teaserTimerRef.current = setInterval(cycle, 7200)
    return () => {
      clearTimeout(startDelay)
      clearTimeout(hideTimeout)
      clearInterval(teaserTimerRef.current)
    }
  }, [open, teaserIndex === 0])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing, open])

  const send = (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed) return
    setMessages(m => [...m, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const { reply, link } = getReply(trimmed, liveData)
      setMessages(m => [...m, { role: 'bot', text: reply, link }])
      setTyping(false)
    }, 650 + Math.random() * 500)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send()
  }

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[9998] flex flex-col items-end gap-3"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-[92vw] max-w-[360px] h-[min(70vh,520px)] rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(6,10,24,0.97) 0%, rgba(3,6,16,0.99) 100%)',
              border: '1px solid rgba(0,212,255,0.22)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.06), 0 0 40px rgba(0,120,255,0.12)',
              backdropFilter: 'blur(18px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(0,212,255,0.14)', background: 'rgba(0,180,255,0.05)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'radial-gradient(circle at 32% 28%, rgba(0,212,255,0.35), rgba(4,10,26,0.9))', border: '1px solid rgba(0,212,255,0.35)' }}
                >
                  <GRIDLogoIcon size={22} />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e', border: '2px solid #050912' }}
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-bold tracking-wide leading-tight">GRID Assistant</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(0,212,255,0.7)' }}>Online · Always here</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: 'rgba(180,200,230,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.12)'; e.currentTarget.style.color = '#00d4ff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(180,200,230,0.7)' }}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                    style={
                      m.role === 'user'
                        ? { background: 'linear-gradient(135deg,#0066ff,#00a8ff)', color: '#fff', borderBottomRightRadius: 4 }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.14)', color: 'rgba(220,230,245,0.92)', borderBottomLeftRadius: 4 }
                    }
                  >
                    <span style={{ whiteSpace: 'pre-line' }}>{m.text}</span>
                    {m.link && (
                      <Link
                        to={m.link.to}
                        onClick={() => setOpen(false)}
                        className="mt-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider w-fit"
                        style={{ color: '#00d4ff' }}
                      >
                        <Sparkles size={11} /> {m.link.label}
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.14)', borderBottomLeftRadius: 4 }}
                  >
                    {[0, 1, 2].map(d => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#00d4ff' }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.length <= 1 && !typing && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {QUICK_PROMPTS.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-[11px] px-3 py-1.5 rounded-full transition-all duration-200"
                      style={{ border: '1px solid rgba(0,212,255,0.25)', color: 'rgba(0,212,255,0.85)', background: 'rgba(0,212,255,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.16)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,212,255,0.14)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-transparent outline-none text-sm px-2 py-2 rounded-xl"
                style={{ color: '#e8f2ff', border: '1px solid rgba(0,212,255,0.14)' }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#0066ff,#00d4ff)', boxShadow: '0 0 16px rgba(0,180,255,0.4)' }}
              >
                <Send size={15} color="#fff" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Teaser bubble ── */}
      <AnimatePresence>
        {!open && showTeaser && (
          <motion.button
            key={teaserIndex}
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, x: 24, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mr-1 max-w-[220px] text-left rounded-2xl px-4 py-2.5 text-[12.5px] font-medium cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(6,14,32,0.96), rgba(4,10,24,0.96))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: 'rgba(225,238,255,0.95)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 0 20px rgba(0,150,255,0.15)',
            }}
          >
            {TEASERS[teaserIndex]}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Floating circular bot button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="Open GRID AI Assistant"
        className="relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'radial-gradient(circle at 32% 26%, rgba(0,180,255,0.45), rgba(2,6,18,0.98) 68%)',
          border: '1.5px solid rgba(0,212,255,0.5)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 30px rgba(0,180,255,0.35), inset 0 0 18px rgba(0,180,255,0.12)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        {/* Ambient pulse rings */}
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1.5px solid rgba(0,212,255,0.55)' }}
          animate={{ scale: [1, 1.55, 1.55], opacity: [0.55, 0, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1.5px solid rgba(0,212,255,0.4)' }}
          animate={{ scale: [1, 1.55, 1.55], opacity: [0.4, 0, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 1.3 }}
        />

        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              <X size={24} color="#e8f6ff" />
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className="rounded-full overflow-hidden flex items-center justify-center"
              style={{ width: 44, height: 44 }}
            >
              <GRIDLogoIcon size={40} />
            </motion.div>
          )}
        </AnimatePresence>

        {!open && (
          <motion.span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#00d4ff', boxShadow: '0 0 10px #00d4ff' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <Bot size={9} color="#020612" strokeWidth={2.5} />
          </motion.span>
        )}
      </motion.button>
    </div>
  )
}
