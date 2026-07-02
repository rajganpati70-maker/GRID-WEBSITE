import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Code2, Globe, Shield, Zap, TrendingUp,
  Users, MessageSquare, Calendar, MapPin, ChevronRight,
  Sparkles, Cpu, Network, Layers, Activity, UserPlus,
  FileText, Wifi, WifiOff
} from 'lucide-react'
import axios from 'axios'

/* ─────────────────────────────────────────────────────────────────────────────
   GRID LOGO — builds letter by letter, glitches, fades, loops
───────────────────────────────────────────────────────────────────────────── */
function GridLogoBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
      <div className="flex items-center">
        {['G','R','I','D'].map((letter, i) => (
          <motion.span
            key={letter}
            initial={{ opacity: 0, scaleX: 0.15, skewX: 35, filter: 'blur(28px)' }}
            animate={{
              opacity: [0, 0, 0.07, 0.07, 0.07, 0.015, 0.07, 0.008, 0.07, 0.07, 0],
              scaleX:  [0.15, 0.15, 1, 1, 1, 1.4, 0.6, 1.15, 1, 1, 0.15],
              skewX:   [35, 35, 0, 0, 0, -12, 16, -5, 0, 0, 35],
              x:       [0, 0, 0, 0, 0, -10, 12, -4, 0, 0, 0],
              filter: [
                'blur(28px) brightness(1)',
                'blur(28px) brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(5px)  brightness(5)',
                'blur(3px)  brightness(4)',
                'blur(4px)  brightness(3)',
                'blur(0px)  brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(28px) brightness(1)',
              ],
            }}
            transition={{
              delay: i * 0.16,
              duration: 10,
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: 'easeInOut',
              times: [0, 0.04, 0.11, 0.36, 0.48, 0.57, 0.64, 0.71, 0.80, 0.91, 1],
            }}
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(120px, 22vw, 280px)',
              lineHeight: 1,
              color: '#00d4ff',
              display: 'block',
              letterSpacing: '-0.02em',
              transformOrigin: 'center center',
              willChange: 'transform, opacity, filter',
              textShadow: '0 0 80px rgba(0,212,255,0.5)',
            }}
          >{letter}</motion.span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────────────────────────────────────── */
function Particles() {
  const dots = useMemo(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      color: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#0066ff' : '#7b2fff',
      duration: Math.random() * 18 + 12,
      delay: Math.random() * 12,
      opacity: Math.random() * 0.45 + 0.12,
    })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <div key={d.id} className="particle" style={{
          left: d.left, width: d.size, height: d.size,
          background: d.color, animationDuration: `${d.duration}s`,
          animationDelay: `${d.delay}s`, opacity: d.opacity,
        }} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   LIVE ACTIVITY FEED  (WebSocket + polling)
───────────────────────────────────────────────────────────────────────────── */
const ACTIVITY_SEED = [
  { id: 'seed-1', kind: 'thread', user: 'elena_v',    text: 'Started a thread on Rust async patterns',        time: '2m ago',  color: '#00d4ff' },
  { id: 'seed-2', kind: 'join',   user: 'kai_dev',    text: 'Joined the community',                           time: '5m ago',  color: '#7b2fff' },
  { id: 'seed-3', kind: 'thread', user: 'priya_s',    text: 'Posted "Building a zero-downtime deploy pipeline"', time: '9m ago',  color: '#00d4ff' },
  { id: 'seed-4', kind: 'join',   user: 'marco_r',    text: 'Joined the community',                           time: '14m ago', color: '#7b2fff' },
  { id: 'seed-5', kind: 'thread', user: 'alex_c',     text: 'Opened "Why I moved from k8s to Nomad"',         time: '21m ago', color: '#00d4ff' },
  { id: 'seed-6', kind: 'join',   user: 'suki_t',     text: 'Joined the community',                           time: '28m ago', color: '#7b2fff' },
  { id: 'seed-7', kind: 'thread', user: 'dev_omar',   text: 'Posted "TypeScript 5.5 features worth knowing"', time: '33m ago', color: '#00d4ff' },
  { id: 'seed-8', kind: 'join',   user: 'nadia_m',    text: 'Joined the community',                           time: '40m ago', color: '#7b2fff' },
]

function useActivityFeed() {
  const [items, setItems] = useState(ACTIVITY_SEED)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${proto}//${window.location.host}/ws`)
    wsRef.current = ws

    ws.onopen  = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'user_joined' && msg.user) {
          const item = {
            id: `ws-join-${Date.now()}`,
            kind: 'join',
            user: msg.user.username,
            text: 'Joined the community',
            time: 'just now',
            color: '#7b2fff',
          }
          setItems(prev => [item, ...prev].slice(0, 18))
        }
        if (msg.type === 'forum_thread_new' && msg.thread) {
          const item = {
            id: `ws-thread-${Date.now()}`,
            kind: 'thread',
            user: msg.thread.author || 'Someone',
            text: `Posted "${msg.thread.title}"`,
            time: 'just now',
            color: '#00d4ff',
          }
          setItems(prev => [item, ...prev].slice(0, 18))
        }
      } catch {}
    }

    // Also poll recent forum threads once
    axios.get('/api/forum').then(r => {
      const threads = (r.data || []).slice(0, 4)
      const liveItems = threads.map((t, idx) => ({
        id: `poll-${t.id}`,
        kind: 'thread',
        user: t.author || 'member',
        text: `Posted "${t.title}"`,
        time: timeAgo(t.created_at || t.created),
        color: '#00d4ff',
      }))
      if (liveItems.length > 0) {
        setItems(prev => {
          const merged = [...liveItems, ...prev.filter(p => p.id.startsWith('seed'))]
          return merged.slice(0, 18)
        })
      }
    }).catch(() => {})

    return () => ws.close()
  }, [])

  return { items, connected }
}

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function ActivityFeed() {
  const { items, connected } = useActivityFeed()
  const scrollRef = useRef(null)

  return (
    <div className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.14)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.03)' }}>
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4" style={{ color: '#00d4ff' }} />
          <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>
            Live activity
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-600'}`}
            style={connected ? { boxShadow: '0 0 6px #4ade80', animation: 'pulse 2s infinite' } : {}} />
          <span style={{ fontSize: 11, color: connected ? '#86efac' : '#4b5563', fontFamily: 'Inter, sans-serif' }}>
            {connected ? 'live' : 'connecting…'}
          </span>
        </div>
      </div>

      {/* Feed items */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 340 }}>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-start gap-3 px-5 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {/* Avatar dot */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[11px] font-bold"
                style={{ background: item.kind === 'join'
                  ? 'linear-gradient(135deg,#7b2fff,#00d4ff)'
                  : 'linear-gradient(135deg,#0066ff,#00d4ff)' }}>
                {item.user[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13, lineHeight: 1.45 }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.user}</span>
                  <span style={{ color: '#6b7280' }}> · </span>
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>{item.text}</span>
                </div>
                <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2, fontFamily: 'Inter, sans-serif' }}>
                  {item.time}
                </div>
              </div>
              <div className="flex-shrink-0 mt-1">
                {item.kind === 'join'
                  ? <UserPlus style={{ width: 12, height: 12, color: '#7b2fff', opacity: 0.7 }} />
                  : <FileText  style={{ width: 12, height: 12, color: '#00d4ff', opacity: 0.7 }} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────────────────────────────────────── */
const ROLE_COLORS = {
  founder:   { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.4)',  text: '#fbbf24' },
  moderator: { bg: 'rgba(123,47,255,0.12)',  border: 'rgba(123,47,255,0.4)',  text: '#a78bfa' },
  developer: { bg: 'rgba(0,212,255,0.10)',   border: 'rgba(0,212,255,0.35)', text: '#00d4ff' },
  designer:  { bg: 'rgba(236,72,153,0.10)',  border: 'rgba(236,72,153,0.35)', text: '#f472b6' },
  default:   { bg: 'rgba(0,102,255,0.10)',   border: 'rgba(0,102,255,0.35)', text: '#60a5fa' },
}
function RoleBadge({ role }) {
  const c = ROLE_COLORS[role?.toLowerCase()] || ROLE_COLORS.default
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: 'Inter, sans-serif' }}
      className="text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider uppercase flex-shrink-0">
      {role || 'Member'}
    </span>
  )
}

function Label({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
      style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff',
               fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
      <span className="w-1 h-1 rounded-full bg-grid-cyan animate-pulse" />
      {children}
    </span>
  )
}

function H2({ children, className = '' }) {
  return (
    <h2 className={className}
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.02em' }}>
      {children}
    </h2>
  )
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), rgba(0,102,255,0.1), transparent)' }} />
    </div>
  )
}

const EVENT_COLORS = {
  hackathon:  { bg: 'rgba(0,212,255,0.1)',  border: 'rgba(0,212,255,0.3)',  text: '#00d4ff' },
  workshop:   { bg: 'rgba(123,47,255,0.1)', border: 'rgba(123,47,255,0.3)', text: '#a78bfa' },
  conference: { bg: 'rgba(0,102,255,0.1)',  border: 'rgba(0,102,255,0.3)',  text: '#60a5fa' },
  default:    { bg: 'rgba(0,212,255,0.07)', border: 'rgba(0,212,255,0.2)',  text: '#00d4ff' },
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 600], [0, 160])

  const [stats,   setStats]   = useState(null)
  const [events,  setEvents]  = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data)).catch(() => {})
    axios.get('/api/events').then(r => setEvents((r.data||[]).slice(0,3))).catch(() => {})
    axios.get('/api/members').then(r => setMembers((r.data||[]).slice(0,6))).catch(() => {})
  }, [])

  const STATS = [
    { value: stats ? `${Math.round(stats.members/1000)}k+`        : '50k+',  label: 'Members',     icon: Users },
    { value: stats ? `${stats.projects}+`                         : '1.2k+', label: 'Projects',    icon: Code2 },
    { value: stats ? `${stats.events}+`                           : '300+',  label: 'Events',      icon: Calendar },
    { value: stats ? `${Math.round(stats.discussions/1000)}k+`    : '15k+',  label: 'Discussions', icon: MessageSquare },
  ]

  const inView = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' },
  }

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════
          HERO
      ══════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(0,102,255,0.16) 0%, transparent 65%), radial-gradient(ellipse 55% 45% at 85% 85%, rgba(123,47,255,0.1) 0%, transparent 60%)' }} />
        <GridLogoBackground />
        <Particles />

        {/* Ambient orbs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(0,102,255,0.06)', filter: 'blur(90px)', animation: 'pulse 5s ease-in-out infinite' }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(123,47,255,0.06)', filter: 'blur(80px)', animation: 'pulse 6s ease-in-out infinite 2.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}>
            <Label>Community Network v2.0 — Now Live</Label>
          </motion.div>

          {/* Hero headline — Plus Jakarta Sans, warm + human */}
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}>
            <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}
              className="text-4xl sm:text-5xl md:text-[3.6rem] text-white mb-2">
              Where tech minds
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-[3.6rem] mb-6 text-gradient"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              connect and grow.
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.65 }}
            className="text-gray-400 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 400 }}>
            Join <span className="text-white font-semibold">50,000+ developers</span>, engineers, and
            creators building the future — openly, globally, together.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-sm px-7 py-3.5">
              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>Join GRID</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/members" className="btn-outline flex items-center gap-2 text-sm px-7 py-3.5">
              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>Meet the community</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-card py-4 px-3">
                <Icon className="w-4 h-4 text-grid-cyan mx-auto mb-2 opacity-70" />
                <div className="text-gradient text-xl font-bold mb-0.5"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>{value}</div>
                <div className="text-[11px] text-gray-500 tracking-widest uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <span style={{ fontSize: 10, color: '#4b5563', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3em', textTransform: 'uppercase' }}>scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #00d4ff, transparent)' }} />
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════
          FEATURES
      ══════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 grid-bg opacity-12" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div {...inView} className="text-center mb-14">
            <Label>What you get</Label>
            <H2 className="text-2xl md:text-[2rem] text-white mb-3">
              Built for <span className="text-gradient">serious builders</span>
            </H2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Everything you need to collaborate, grow, and make an impact in global tech.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Code2,      title: 'Open source projects',   desc: 'Collaborate on cutting-edge repos with contributors worldwide.' },
              { icon: Network,    title: 'Global network',         desc: 'Connect with 50,000+ engineers across 50+ countries.' },
              { icon: Shield,     title: 'Verified experts',       desc: 'Learn directly from industry-certified engineers and tech leads.' },
              { icon: Zap,        title: 'Live events',            desc: 'Hackathons, workshops, and real-time coding sessions every week.' },
              { icon: Layers,     title: 'Showcase your work',     desc: 'Publish projects, get feedback, and build your reputation.' },
              { icon: TrendingUp, title: 'Career acceleration',    desc: 'Referrals, mentorship, and opportunities — all in one place.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="glass-card rounded-xl p-5 group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-neon-sm"
                  style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.18),rgba(0,212,255,0.14))', border: '1px solid rgba(0,212,255,0.16)' }}>
                  <Icon className="w-4 h-4 text-grid-cyan" />
                </div>
                <h3 className="text-white text-sm mb-1.5"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 }}>{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 400 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════
          EVENTS
      ══════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 50% at 15% 50%, rgba(0,102,255,0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <motion.div {...inView} className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Label>Upcoming events</Label>
              <H2 className="text-2xl md:text-[2rem] text-white">
                What's <span className="text-gradient">happening</span>
              </H2>
            </div>
            <Link to="/events" className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase group transition-colors"
              style={{ color: '#00d4ff', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              View all events <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(events.length > 0 ? events : FALLBACK_EVENTS).map((e, i) => (
              <EventCard key={e.id || i} event={e} i={i} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════
          MEMBERS  +  ACTIVITY
      ══════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 50% at 85% 50%, rgba(123,47,255,0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Members (left 2 cols) */}
            <div className="lg:col-span-2">
              <motion.div {...inView} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <Label>Community</Label>
                  <H2 className="text-2xl md:text-[2rem] text-white">
                    Meet the <span className="text-gradient">builders</span>
                  </H2>
                </div>
                <Link to="/members" className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase group transition-colors"
                  style={{ color: '#00d4ff', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  All members <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(members.length > 0 ? members : FALLBACK_MEMBERS).map((m, i) => (
                  <motion.div key={m.id || m.username}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
                    <Link to="/members" className="block glass-card rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.32)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: m.avatar_color || 'linear-gradient(135deg,#0066ff,#00d4ff)' }}>
                          {(m.username||'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-white text-sm truncate"
                              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>{m.username}</span>
                            <RoleBadge role={m.role} />
                          </div>
                          {m.location && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-600 mb-1.5"
                              style={{ fontFamily: 'Inter, sans-serif' }}>
                              <MapPin className="w-3 h-3" />{m.location}
                            </div>
                          )}
                          {m.bio && (
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2"
                              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{m.bio}</p>
                          )}
                        </div>
                      </div>
                      {Array.isArray(m.skills) && m.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
                          {m.skills.slice(0,3).map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={{ background: 'rgba(0,212,255,0.07)', color: '#7dd3fc', border: '1px solid rgba(0,212,255,0.11)', fontFamily: 'Inter, sans-serif' }}>
                              {s}
                            </span>
                          ))}
                          {m.skills.length > 3 && (
                            <span className="text-[10px] text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>+{m.skills.length - 3}</span>
                          )}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity feed (right 1 col) */}
            <div>
              <motion.div {...inView} className="mb-8">
                <Label>Activity</Label>
                <H2 className="text-2xl md:text-[2rem] text-white">
                  Right <span className="text-gradient">now</span>
                </H2>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.55 }}>
                <ActivityFeed />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════
          ABOUT
      ══════════════════════ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-12" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)' }} />

        <motion.div {...inView} className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            <div>
              <Label>About GRID</Label>
              <H2 className="text-2xl md:text-[2rem] text-white mb-5">
                More than a community —<br />
                <span className="text-gradient">a launchpad.</span>
              </H2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                GRID was built by engineers who wanted something better than a LinkedIn group or a Slack server — a place where code meets culture, where you can share what you're building and find collaborators who actually care.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Open source at heart, global by design, and obsessed with the idea that the best work happens when brilliant people connect freely.
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3">
                <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>Read our story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Cpu,      label: 'Open source first',  desc: 'Everything we build is transparent and community-driven.' },
                { icon: Globe,    label: 'Globally inclusive', desc: 'Members from 50+ countries, all backgrounds welcome.' },
                { icon: Shield,   label: 'Trust and safety',   desc: 'Verified profiles and a zero-tolerance abuse policy.' },
                { icon: Sparkles, label: 'Always evolving',    desc: 'New features shaped entirely by member feedback.' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.45 }}
                  className="glass-card rounded-xl p-4">
                  <Icon className="w-5 h-5 text-grid-cyan mb-3" />
                  <div className="text-white text-xs mb-1"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 }}>{label}</div>
                  <p className="text-gray-500 text-[11px] leading-relaxed"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════
          FINAL CTA
      ══════════════════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(0,102,255,0.09) 0%, rgba(123,47,255,0.05) 55%, transparent 80%)' }} />
        <div className="absolute inset-0 grid-bg opacity-18" />

        <motion.div {...inView} className="relative max-w-xl mx-auto text-center">
          <Label>Ready to join?</Label>
          <H2 className="text-3xl md:text-[2.4rem] text-white mb-4">
            Build the future <span className="text-gradient">with GRID.</span>
          </H2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed max-w-sm mx-auto"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Your network is your net worth. The people you meet here will become your co-founders, collaborators, and closest friends in tech.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-sm px-8 py-3.5">
              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>Create your account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/forum" className="btn-outline flex items-center gap-2 text-sm px-8 py-3.5">
              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>Explore the forum</span>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────────────────────────────────────── */
function EventCard({ event, i }) {
  const type  = event.type?.toLowerCase() || 'default'
  const style = EVENT_COLORS[type] || EVENT_COLORS.default
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : event.date_display || '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.52 }}>
      <Link to="/events" className="block glass-card rounded-xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1"
        style={{ display: 'flex', flexDirection: 'column' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.28)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${style.border}, transparent)` }} />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded"
              style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text, fontFamily: 'Inter, sans-serif' }}>
              {event.type || 'Event'}
            </span>
            <span className="text-[11px] text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{dateStr}</span>
          </div>
          <h3 className="text-white text-sm leading-snug mb-2"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 }}>{event.title}</h3>
          {event.description && (
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3 flex-1"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{event.description}</p>
          )}
          {event.location && (
            <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-auto"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <MapPin className="w-3 h-3" />{event.location}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   FALLBACK DATA
───────────────────────────────────────────────────────────────────────────── */
const FALLBACK_EVENTS = [
  { id: 'f1', title: 'Global Hackathon 2025',       type: 'hackathon',  date_display: 'Aug 12–14', location: 'San Francisco + Online', description: '48-hour build marathon with $50k in prizes across 8 tracks.' },
  { id: 'f2', title: 'Web3 Architecture Workshop',  type: 'workshop',   date_display: 'Jul 28',    location: 'Online',                description: 'Deep-dive into decentralized application design patterns.' },
  { id: 'f3', title: 'GRID Developer Conference',   type: 'conference', date_display: 'Sep 5–6',   location: 'New York City',          description: 'Two days of talks, demos, and networking with industry leaders.' },
]

const FALLBACK_MEMBERS = [
  { id:1, username:'alex_chen',    role:'Founder',   location:'San Francisco', bio:'Building distributed systems at scale. OSS contributor.',           skills:['Rust','Go','Kubernetes'],     avatar_color:'linear-gradient(135deg,#0066ff,#00d4ff)' },
  { id:2, username:'sara_w',       role:'Developer', location:'Berlin',        bio:'Full-stack engineer obsessed with clean architecture.',             skills:['React','Node.js','Postgres'],  avatar_color:'linear-gradient(135deg,#7b2fff,#00d4ff)' },
  { id:3, username:'raj_patel',    role:'Designer',  location:'London',        bio:'UX-first engineer who ships beautiful, fast products.',             skills:['Figma','CSS','Motion'],        avatar_color:'linear-gradient(135deg,#ec4899,#7b2fff)' },
  { id:4, username:'lena_m',       role:'Moderator', location:'Munich',        bio:'ML researcher making models that actually work in production.',      skills:['Python','PyTorch','MLOps'],    avatar_color:'linear-gradient(135deg,#0066ff,#7b2fff)' },
  { id:5, username:'kai_nakamura', role:'Developer', location:'Tokyo',         bio:'Systems programmer. Currently obsessed with WebAssembly.',           skills:['Wasm','C++','Zig'],            avatar_color:'linear-gradient(135deg,#00d4ff,#0066ff)' },
  { id:6, username:'priya_s',      role:'Developer', location:'Bangalore',     bio:'DevOps engineer automating everything that can be automated.',       skills:['Terraform','AWS','Docker'],    avatar_color:'linear-gradient(135deg,#f97316,#ec4899)' },
]
