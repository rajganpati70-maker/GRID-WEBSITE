import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Code2, Globe, Shield, Zap, TrendingUp,
  Users, MessageSquare, Calendar, MapPin, ChevronRight,
  Sparkles, Cpu, Network, Layers, Activity, UserPlus, FileText
} from 'lucide-react'
import axios from 'axios'
import GridLogoAnimation from '../components/GridLogoAnimation'

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────────────────────────────────────── */
function Particles() {
  const dots = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.8,
      color: i % 4 === 0 ? '#00d4ff' : i % 4 === 1 ? '#0066ff' : i % 4 === 2 ? '#7b2fff' : '#00a8ff',
      duration: Math.random() * 20 + 14,
      delay: Math.random() * 14,
      opacity: Math.random() * 0.4 + 0.1,
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
   LIVE ACTIVITY FEED
───────────────────────────────────────────────────────────────────────────── */
const SEED_ACTIVITY = [
  { id:'s1', kind:'thread', user:'elena_v',   text:'Started a thread on Rust async patterns',            time:'2m ago'  },
  { id:'s2', kind:'join',   user:'kai_dev',   text:'Joined the community',                               time:'5m ago'  },
  { id:'s3', kind:'thread', user:'priya_s',   text:'Posted "Building a zero-downtime deploy pipeline"',  time:'9m ago'  },
  { id:'s4', kind:'join',   user:'marco_r',   text:'Joined the community',                               time:'14m ago' },
  { id:'s5', kind:'thread', user:'alex_c',    text:'Opened "Why I moved from k8s to Nomad"',             time:'22m ago' },
  { id:'s6', kind:'join',   user:'suki_t',    text:'Joined the community',                               time:'29m ago' },
  { id:'s7', kind:'thread', user:'dev_omar',  text:'Posted "TypeScript 5.5 features worth knowing"',    time:'35m ago' },
  { id:'s8', kind:'join',   user:'nadia_m',   text:'Joined the community',                               time:'41m ago' },
  { id:'s9', kind:'thread', user:'lena_k',    text:'Posted "The real cost of microservices at scale"',   time:'58m ago' },
]

function timeAgo(d) {
  if (!d) return '—'
  const m = Math.floor((Date.now() - new Date(d)) / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function useActivityFeed() {
  const [items, setItems] = useState(SEED_ACTIVITY)
  const [online, setOnline] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${proto}//${location.host}/ws`)
    wsRef.current = ws
    ws.onopen  = () => setOnline(true)
    ws.onclose = () => setOnline(false)
    ws.onerror = () => setOnline(false)
    ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'user_joined' && msg.user) {
          setItems(p => [{
            id: `wj-${Date.now()}`, kind: 'join',
            user: msg.user.username, text: 'Joined the community', time: 'just now'
          }, ...p].slice(0, 16))
        }
        if (msg.type === 'forum_thread_new' && msg.thread) {
          setItems(p => [{
            id: `wt-${Date.now()}`, kind: 'thread',
            user: msg.thread.author || 'member',
            text: `Posted "${msg.thread.title}"`, time: 'just now'
          }, ...p].slice(0, 16))
        }
      } catch {}
    }
    axios.get('/api/forum').then(r => {
      const live = (r.data || []).slice(0, 4).map(t => ({
        id: `p-${t.id}`, kind: 'thread',
        user: t.author || 'member',
        text: `Posted "${t.title}"`, time: timeAgo(t.created_at),
      }))
      if (live.length) setItems(p => [...live, ...p.filter(x => x.id.startsWith('s'))].slice(0, 16))
    }).catch(() => {})
    return () => ws.close()
  }, [])

  return { items, online }
}

function ActivityFeed() {
  const { items, online } = useActivityFeed()
  return (
    <div className="rounded-2xl overflow-hidden h-full flex flex-col"
      style={{ background: 'rgba(6,6,20,0.85)', border: '1px solid rgba(0,212,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.08)', background: 'rgba(0,212,255,0.025)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.3),rgba(0,212,255,0.2))', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Activity className="w-3.5 h-3.5" style={{ color: '#00d4ff' }} />
          </div>
          <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: 14, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
            Live activity
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full`}
            style={online
              ? { background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'glow-pulse 2s infinite' }
              : { background: '#374151' }} />
          <span style={{ fontSize: 11, color: online ? '#86efac' : '#4b5563', fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>
            {online ? 'live' : 'connecting'}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {items.map(item => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-start gap-3 px-5 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.035)' }}>

              {/* Avatar */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[11px] font-bold"
                style={{ background: item.kind === 'join'
                  ? 'linear-gradient(135deg,#6d28d9,#00d4ff)'
                  : 'linear-gradient(135deg,#0052cc,#00d4ff)' }}>
                {item.user[0].toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 12.5, lineHeight: 1.45, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.user}</span>
                  <span style={{ color: '#4b5563' }}> · </span>
                  <span style={{ color: '#6b7280', fontWeight: 400 }}>{item.text}</span>
                </p>
                <p style={{ fontSize: 11, color: '#374151', marginTop: 2, fontFamily: 'Inter,sans-serif' }}>{item.time}</p>
              </div>

              <div className="flex-shrink-0 mt-1.5">
                {item.kind === 'join'
                  ? <UserPlus style={{ width: 11, height: 11, color: '#7b2fff', opacity: 0.65 }} />
                  : <FileText  style={{ width: 11, height: 11, color: '#00d4ff', opacity: 0.65 }} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer link */}
      <div className="px-5 py-3.5 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
        <Link to="/forum" className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide group transition-colors"
          style={{ color: 'rgba(0,212,255,0.6)', fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
          Open forum
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL REUSABLES
───────────────────────────────────────────────────────────────────────────── */
const ROLE_C = {
  founder:   { bg:'rgba(251,191,36,0.1)',   bd:'rgba(251,191,36,0.35)', tx:'#fbbf24' },
  moderator: { bg:'rgba(123,47,255,0.1)',   bd:'rgba(123,47,255,0.35)', tx:'#a78bfa' },
  developer: { bg:'rgba(0,212,255,0.08)',   bd:'rgba(0,212,255,0.3)',   tx:'#00d4ff' },
  designer:  { bg:'rgba(236,72,153,0.08)',  bd:'rgba(236,72,153,0.3)',  tx:'#f472b6' },
  default:   { bg:'rgba(0,102,255,0.08)',   bd:'rgba(0,102,255,0.3)',   tx:'#60a5fa' },
}
function RoleBadge({ role }) {
  const c = ROLE_C[role?.toLowerCase()] || ROLE_C.default
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.bd}`, color: c.tx,
                   fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 600,
                   letterSpacing: '0.1em', textTransform: 'uppercase',
                   padding: '2px 8px', borderRadius: 100, flexShrink: 0 }}>
      {role || 'Member'}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="mb-3">
      <span className="tag">
        <span className="w-1 h-1 rounded-full bg-grid-cyan animate-pulse" />
        {children}
      </span>
    </motion.div>
  )
}

function SectionHeading({ children, className = '' }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`section-title text-2xl md:text-[2.1rem] text-white ${className}`}>
      {children}
    </motion.h2>
  )
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.12),rgba(0,102,255,0.08),transparent)' }} />
    </div>
  )
}

const inView = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.62, ease: 'easeOut' },
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, i, accent = '#00d4ff' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.55 }}
      className="premium-card rounded-2xl p-5 group"
      style={{ cursor: 'default' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg,rgba(0,82,204,0.25),rgba(0,212,255,0.18))`,
          border: `1px solid rgba(0,212,255,0.18)`,
          boxShadow: 'none',
        }}>
        <Icon className="w-4.5 h-4.5" style={{ color: accent, width: 18, height: 18 }} />
      </div>
      <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: 14, color: '#e8eef8', marginBottom: 6, letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 400, fontSize: 13, color: 'rgba(140,160,190,0.8)', lineHeight: 1.6 }}>
        {desc}
      </p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────────────────────────────────────── */
const EVT_STYLE = {
  hackathon:  { bar: 'linear-gradient(90deg,#00d4ff,#0066ff)', badge: { bg:'rgba(0,212,255,0.1)', bd:'rgba(0,212,255,0.3)', tx:'#00d4ff' } },
  workshop:   { bar: 'linear-gradient(90deg,#7b2fff,#00d4ff)', badge: { bg:'rgba(123,47,255,0.1)', bd:'rgba(123,47,255,0.3)', tx:'#a78bfa' } },
  conference: { bar: 'linear-gradient(90deg,#0066ff,#7b2fff)', badge: { bg:'rgba(0,102,255,0.1)', bd:'rgba(0,102,255,0.3)', tx:'#60a5fa' } },
  default:    { bar: 'linear-gradient(90deg,#00d4ff,#0066ff)', badge: { bg:'rgba(0,212,255,0.07)', bd:'rgba(0,212,255,0.2)', tx:'#00d4ff' } },
}

function EventCard({ event, i }) {
  const s = EVT_STYLE[event.type?.toLowerCase()] || EVT_STYLE.default
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : event.date_display || '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}>
      <Link to="/events" className="event-card block h-full flex flex-col">
        {/* colour bar */}
        <div style={{ height: 3, background: s.bar, flexShrink: 0 }} />
        {/* pseudo-header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0"
          style={{ background: 'linear-gradient(180deg,rgba(0,212,255,0.04) 0%,transparent 100%)', borderBottom: '1px solid rgba(0,212,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...s.badge, background: s.badge.bg, border: `1px solid ${s.badge.bd}`, color: s.badge.tx,
                           fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700,
                           letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100 }}>
              {event.type || 'Event'}
            </span>
            <span style={{ fontSize: 11, color: '#4b5563', fontFamily: 'Inter,sans-serif' }}>{dateStr}</span>
          </div>
          <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: 15, color: '#e8eef8', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
            {event.title}
          </h3>
        </div>
        <div className="px-5 py-4 flex flex-col flex-1">
          {event.description && (
            <p className="line-clamp-2 flex-1 mb-3"
              style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 13, color: 'rgba(140,160,190,0.75)', lineHeight: 1.6 }}>
              {event.description}
            </p>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 mt-auto"
              style={{ fontSize: 11.5, color: '#4b5563', fontFamily: 'Inter,sans-serif' }}>
              <MapPin style={{ width: 12, height: 12, color: '#00d4ff', opacity: 0.6 }} />
              {event.location}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEMBER CARD
───────────────────────────────────────────────────────────────────────────── */
function MemberCard({ m, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
      <Link to="/members" className="premium-card rounded-2xl p-4 block">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: m.avatar_color || 'linear-gradient(135deg,#0052cc,#00d4ff)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {(m.username || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: 14, color: '#e8eef8', letterSpacing: '-0.01em' }}>
                {m.username}
              </span>
              <RoleBadge role={m.role} />
            </div>
            {m.location && (
              <div className="flex items-center gap-1 mb-1.5"
                style={{ fontSize: 11.5, color: '#4b5563', fontFamily: 'Inter,sans-serif' }}>
                <MapPin style={{ width: 11, height: 11 }} />{m.location}
              </div>
            )}
            {m.bio && (
              <p className="line-clamp-2"
                style={{ fontSize: 12.5, color: 'rgba(140,160,190,0.7)', lineHeight: 1.55, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
                {m.bio}
              </p>
            )}
          </div>
        </div>
        {Array.isArray(m.skills) && m.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
            {m.skills.slice(0, 3).map(s => (
              <span key={s} style={{ fontFamily: 'Inter,sans-serif', fontSize: 10.5, fontWeight: 500,
                background: 'rgba(0,212,255,0.07)', color: '#7dd3fc',
                border: '1px solid rgba(0,212,255,0.12)', padding: '2px 8px', borderRadius: 6 }}>
                {s}
              </span>
            ))}
            {m.skills.length > 3 && (
              <span style={{ fontSize: 10.5, color: '#374151', fontFamily: 'Inter,sans-serif' }}>+{m.skills.length - 3}</span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 700], [0, 180])

  const [stats,   setStats]   = useState(null)
  const [events,  setEvents]  = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data)).catch(() => {})
    axios.get('/api/events').then(r => setEvents((r.data||[]).slice(0,3))).catch(() => {})
    axios.get('/api/members').then(r => setMembers((r.data||[]).slice(0,6))).catch(() => {})
  }, [])

  const STATS_ROW = [
    { value: stats ? `${Math.round(stats.members/1000)}k+` : '50k+', label: 'Members',     icon: Users       },
    { value: stats ? `${stats.projects}+`                  : '1.2k+', label: 'Projects',    icon: Code2       },
    { value: stats ? `${stats.events}+`                    : '300+',  label: 'Events',      icon: Calendar    },
    { value: stats ? `${Math.round(stats.discussions/1000)}k+` : '15k+', label: 'Discussions', icon: MessageSquare },
  ]

  return (
    <div className="overflow-hidden" style={{ background: '#02020e' }}>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Deep radial background */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(0,82,204,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 90%, rgba(109,40,217,0.12) 0%, transparent 65%), #02020e' }} />

        {/* Dot grid */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 grid-bg opacity-40" />

        {/* GRID Logo SVG animation — the star of the show */}
        <GridLogoAnimation size={560} opacity={0.14} />

        <Particles />

        {/* Ambient orbs */}
        <div className="absolute pointer-events-none"
          style={{ top: '22%', left: '18%', width: 320, height: 320, borderRadius: '50%',
                   background: 'rgba(0,82,204,0.08)', filter: 'blur(100px)', animation: 'glow-pulse 6s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none"
          style={{ bottom: '20%', right: '16%', width: 280, height: 280, borderRadius: '50%',
                   background: 'rgba(109,40,217,0.07)', filter: 'blur(90px)', animation: 'glow-pulse 7s ease-in-out infinite 3s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-28 text-center">

          {/* Live badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }} className="mb-6">
            <span className="tag">
              <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#00d4ff' }} />
              Community Network v2.0 — Now Live
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.75 }}>
            <h1 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 8 }}
              className="text-[2.6rem] sm:text-5xl md:text-6xl text-white">
              Where tech minds
            </h1>
            <h1 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 24 }}
              className="text-[2.6rem] sm:text-5xl md:text-6xl text-gradient">
              connect and grow.
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.65 }}
            className="max-w-lg mx-auto mb-10 text-base md:text-lg leading-relaxed"
            style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 400, color: 'rgba(180,196,220,0.8)' }}>
            Join <span style={{ color: '#e8eef8', fontWeight: 600 }}>50,000+ developers</span>, engineers, and creators
            building the future — openly, globally, together.
          </motion.p>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link to="/register" className="btn-primary gap-2">
              Join GRID now <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link to="/members" className="btn-outline gap-2">
              Explore the community
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS_ROW.map(({ value, label, icon: Icon }, i) => (
              <motion.div key={label} className="stat-card"
                whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }}>
                <Icon style={{ width: 16, height: 16, color: '#00d4ff', margin: '0 auto 8px', opacity: 0.7 }} />
                <div style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', marginBottom: 2 }}
                  className="text-gradient">{value}</div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#374151', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span style={{ fontSize: 9, color: '#1f2937', fontFamily: 'Inter,sans-serif', letterSpacing: '0.35em', textTransform: 'uppercase' }}>scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.7 }}
            style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(0,212,255,0.6), transparent)', borderRadius: 1 }} />
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(0,82,204,0.04) 0%, rgba(0,212,255,0.04) 50%, rgba(109,40,217,0.04) 100%)' }} />
        <div className="max-w-6xl mx-auto">
          <motion.div {...inView} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { title: 'Open source at heart',   body: 'Every feature we build is shaped by the community. No black boxes, no closed doors.' },
              { title: 'Zero friction to start',  body: 'Join in seconds, find your first collaborator in minutes. No gatekeeping.' },
              { title: 'Built for the long game', body: 'This is where careers are built — not just projects. Real mentorship, real opportunities.' },
            ].map(({ title, body }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
                className="px-4 py-2">
                <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg,#0066ff,#00d4ff)', borderRadius: 2, margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: 15, color: '#e8eef8', marginBottom: 8, letterSpacing: '-0.01em' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 13.5, color: 'rgba(140,160,190,0.72)', lineHeight: 1.65 }}>
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Platform capabilities</SectionLabel>
            <SectionHeading>
              Built for <span className="text-gradient">serious builders</span>
            </SectionHeading>
            <motion.p {...inView} className="text-sm max-w-sm mx-auto mt-3 leading-relaxed"
              style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', color: 'rgba(140,160,190,0.7)' }}>
              Everything you need to collaborate, ship, and grow in global tech.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Code2,      title: 'Open source projects',  desc: 'Collaborate on cutting-edge repos with contributors worldwide.' },
              { icon: Network,    title: 'Global network',        desc: 'Connect with 50,000+ engineers across 50+ countries.' },
              { icon: Shield,     title: 'Verified experts',      desc: 'Learn from industry-certified engineers and tech leaders.' },
              { icon: Zap,        title: 'Live events',           desc: 'Hackathons, workshops, and real-time coding sessions every week.' },
              { icon: Layers,     title: 'Showcase your work',    desc: 'Publish projects, get feedback, build a real reputation.' },
              { icon: TrendingUp, title: 'Career acceleration',   desc: 'Referrals, mentorship, and exclusive opportunities — all in one place.' },
            ].map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════
          EVENTS
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 10% 50%, rgba(0,82,204,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <motion.div {...inView} className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <SectionLabel>Upcoming events</SectionLabel>
              <SectionHeading>
                What's <span className="text-gradient">happening</span>
              </SectionHeading>
            </div>
            <Link to="/events" className="flex items-center gap-1 text-xs font-semibold tracking-wide group transition-all"
              style={{ color: 'rgba(0,212,255,0.7)', fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600,
                       letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              View all events
              <ChevronRight style={{ width: 14, height: 14 }} className="group-hover:translate-x-0.5 transition-transform" />
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

      {/* ══════════════════════════════════════════════════════
          MEMBERS  ┃  ACTIVITY FEED
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 90% 50%, rgba(109,40,217,0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Members */}
            <div>
              <motion.div {...inView} className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <SectionLabel>Community</SectionLabel>
                  <SectionHeading>
                    Meet the <span className="text-gradient">builders</span>
                  </SectionHeading>
                </div>
                <Link to="/members" className="flex items-center gap-1 text-xs font-semibold tracking-wide group transition-all whitespace-nowrap"
                  style={{ color: 'rgba(0,212,255,0.7)', fontFamily: '"Plus Jakarta Sans",sans-serif',
                           fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  All members
                  <ChevronRight style={{ width: 14, height: 14 }} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(members.length > 0 ? members : FALLBACK_MEMBERS).map((m, i) => (
                  <MemberCard key={m.id || m.username} m={m} i={i} />
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="lg:sticky lg:top-28" style={{ minHeight: 480 }}>
              <motion.div {...inView} className="mb-7">
                <SectionLabel>Right now</SectionLabel>
                <SectionHeading>Live <span className="text-gradient">activity</span></SectionHeading>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.55 }}
                style={{ height: 440 }} className="flex flex-col">
                <ActivityFeed />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-line-bg opacity-15" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 50% 50%, rgba(0,52,152,0.07) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <motion.div {...inView}>
              <SectionLabel>About GRID</SectionLabel>
              <SectionHeading className="mb-6">
                More than a community —<br />
                <span className="text-gradient">a launchpad.</span>
              </SectionHeading>
              <p className="text-sm leading-relaxed mb-4"
                style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', color: 'rgba(180,196,220,0.75)' }}>
                GRID was built by engineers who wanted something better than a LinkedIn group or a Slack server — a place where code meets culture, where you can share what you're building and find collaborators who actually care about their craft.
              </p>
              <p className="text-sm leading-relaxed mb-9"
                style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', color: 'rgba(140,160,190,0.65)' }}>
                Open source at heart, global by design, and obsessed with the idea that the best work happens when brilliant people connect without friction.
              </p>
              <Link to="/about" className="btn-primary gap-2">
                Read our story <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </motion.div>

            {/* Value grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Cpu,      label: 'Open source first',  desc: 'Everything we build is transparent and community-driven.' },
                { icon: Globe,    label: 'Globally inclusive', desc: 'Members from 50+ countries, all backgrounds welcome.' },
                { icon: Shield,   label: 'Trust and safety',   desc: 'Verified profiles and a zero-tolerance abuse policy.' },
                { icon: Sparkles, label: 'Always evolving',    desc: 'Every new feature is shaped entirely by member feedback.' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.48 }}
                  className="premium-card rounded-2xl p-5">
                  <Icon style={{ width: 18, height: 18, color: '#00d4ff', marginBottom: 12, opacity: 0.85 }} />
                  <div style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: 13.5, color: '#e8eef8', marginBottom: 5, letterSpacing: '-0.01em' }}>
                    {label}
                  </div>
                  <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 12.5, color: 'rgba(140,160,190,0.7)', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,52,152,0.14) 0%, rgba(109,40,217,0.07) 55%, transparent 80%)' }} />
        <div className="absolute inset-0 grid-bg opacity-22" />

        {/* Decorative horizontal lines */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.08),transparent)' }} />

        <motion.div {...inView} className="relative max-w-xl mx-auto text-center">
          <SectionLabel>Ready to join?</SectionLabel>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,40px)', letterSpacing: '-0.04em', lineHeight: 1.1, color: '#e8eef8', marginBottom: 16 }}>
            Build the future <span className="text-gradient">with GRID.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-10 max-w-sm mx-auto"
            style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', color: 'rgba(140,160,190,0.7)' }}>
            Your network is your net worth. The people you meet here will become your co-founders, collaborators, and closest friends in tech.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary gap-2">
              Create your account <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link to="/forum" className="btn-outline gap-2">
              Explore the forum
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}

/* ─── FALLBACK DATA ───────────────────────────────────────────────────────── */
const FALLBACK_EVENTS = [
  { id:'f1', title:'Global Hackathon 2025',      type:'hackathon',  date_display:'Aug 12–14', location:'San Francisco + Online', description:'48-hour build marathon with $50k in prizes across 8 tracks.' },
  { id:'f2', title:'Web3 Architecture Workshop', type:'workshop',   date_display:'Jul 28',    location:'Online',                 description:'Deep-dive into decentralized application design and smart contract patterns.' },
  { id:'f3', title:'GRID Developer Conference',  type:'conference', date_display:'Sep 5–6',   location:'New York City',           description:'Two days of talks, demos, and networking with industry leaders from 30+ companies.' },
]

const FALLBACK_MEMBERS = [
  { id:1, username:'alex_chen',    role:'Founder',   location:'San Francisco', bio:'Building distributed systems at scale. OSS contributor.',           skills:['Rust','Go','Kubernetes'],    avatar_color:'linear-gradient(135deg,#0052cc,#00d4ff)' },
  { id:2, username:'sara_w',       role:'Developer', location:'Berlin',        bio:'Full-stack engineer obsessed with clean architecture.',             skills:['React','Node.js','Postgres'], avatar_color:'linear-gradient(135deg,#7b2fff,#00d4ff)' },
  { id:3, username:'raj_patel',    role:'Designer',  location:'London',        bio:'UX-first engineer who ships beautiful, fast products.',             skills:['Figma','CSS','Motion'],       avatar_color:'linear-gradient(135deg,#ec4899,#7b2fff)' },
  { id:4, username:'lena_m',       role:'Moderator', location:'Munich',        bio:'ML researcher making models that actually work in production.',      skills:['Python','PyTorch','MLOps'],   avatar_color:'linear-gradient(135deg,#0066ff,#7b2fff)' },
  { id:5, username:'kai_nakamura', role:'Developer', location:'Tokyo',         bio:'Systems programmer. Currently obsessed with WebAssembly.',           skills:['Wasm','C++','Zig'],           avatar_color:'linear-gradient(135deg,#00d4ff,#0066ff)' },
  { id:6, username:'priya_s',      role:'Developer', location:'Bangalore',     bio:'DevOps engineer automating everything that can be automated.',       skills:['Terraform','AWS','Docker'],   avatar_color:'linear-gradient(135deg,#f97316,#ec4899)' },
]
