import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Code2, Globe, Shield, Zap, Star, TrendingUp,
  Users, MessageSquare, Calendar, MapPin, ChevronRight,
  Github, Sparkles, Cpu, Network, Layers
} from 'lucide-react'
import axios from 'axios'

/* ─── GRID LOGO DISTORTION ANIMATION ─────────────────────────────────────── */
function GridLogoBackground() {
  const letters = ['G', 'R', 'I', 'D']
  // Each letter animates: invisible → assembles with glitch → holds → distorts → disappears → repeats
  const CYCLE = 9   // total seconds per full cycle
  const BUILD = 0.7 // seconds to build in
  const HOLD  = 3.2 // seconds to hold
  const GLITCH= 1.4 // seconds of glitch
  const FADE  = 0.8 // fade out

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
      <div className="flex items-center" style={{ gap: 0 }}>
        {letters.map((letter, i) => (
          <motion.span
            key={letter}
            initial={{ opacity: 0, scaleX: 0.2, skewX: 30, filter: 'blur(24px)' }}
            animate={{
              opacity:  [0, 0,   0.09, 0.09, 0.09, 0.02, 0.08, 0.01, 0.09, 0.09, 0],
              scaleX:   [0.2, 0.2, 1,   1,    1,    1.35, 0.65, 1.1,  1,    1,   0.2],
              skewX:    [30, 30,   0,   0,    0,   -10,   14,  -5,    0,    0,   30],
              x:        [0,  0,    0,   0,    0,   -8,    10,  -4,    0,    0,   0],
              filter: [
                'blur(24px) brightness(1)',
                'blur(24px) brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(4px)  brightness(4)',
                'blur(2px)  brightness(3)',
                'blur(3px)  brightness(2)',
                'blur(0px)  brightness(1)',
                'blur(0px)  brightness(1)',
                'blur(24px) brightness(1)',
              ],
            }}
            transition={{
              delay: i * 0.15,
              duration: CYCLE,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: 'easeInOut',
              times: [0, 0.04, 0.12, 0.38, 0.50, 0.58, 0.65, 0.72, 0.80, 0.90, 1],
            }}
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(130px, 24vw, 300px)',
              lineHeight: 1,
              color: '#00d4ff',
              display: 'block',
              letterSpacing: '-0.02em',
              transformOrigin: 'center center',
              willChange: 'transform, opacity, filter',
              textShadow: '0 0 60px rgba(0,212,255,0.6)',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

/* ─── FLOATING PARTICLES ──────────────────────────────────────────────────── */
function Particles() {
  const dots = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      color: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#0066ff' : '#7b2fff',
      duration: Math.random() * 18 + 12,
      delay: Math.random() * 12,
      opacity: Math.random() * 0.5 + 0.15,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <div
          key={d.id}
          className="particle"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

/* ─── ROLE BADGE ──────────────────────────────────────────────────────────── */
const ROLE_COLORS = {
  founder:   { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.4)', text: '#fbbf24' },
  moderator: { bg: 'rgba(123,47,255,0.12)', border: 'rgba(123,47,255,0.4)', text: '#a78bfa' },
  developer: { bg: 'rgba(0,212,255,0.10)', border: 'rgba(0,212,255,0.35)', text: '#00d4ff' },
  designer:  { bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.35)', text: '#f472b6' },
  default:   { bg: 'rgba(0,102,255,0.10)', border: 'rgba(0,102,255,0.35)', text: '#60a5fa' },
}
function RoleBadge({ role }) {
  const c = ROLE_COLORS[role?.toLowerCase()] || ROLE_COLORS.default
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
      className="text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider uppercase">
      {role || 'Member'}
    </span>
  )
}

/* ─── SECTION LABEL ───────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-4"
      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.22)', color: '#00d4ff' }}>
      <span className="w-1 h-1 rounded-full bg-grid-cyan inline-block animate-pulse" />
      {children}
    </span>
  )
}

/* ─── DIVIDER ─────────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), rgba(0,102,255,0.15), transparent)' }} />
    </div>
  )
}

/* ─── MAIN HOME ───────────────────────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 600], [0, 180])
  const [stats, setStats]     = useState(null)
  const [events, setEvents]   = useState([])
  const [members, setMembers] = useState([])
  const [posts, setPosts]     = useState([])

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data)).catch(() => {})
    axios.get('/api/events').then(r => setEvents((r.data || []).slice(0, 3))).catch(() => {})
    axios.get('/api/members').then(r => setMembers((r.data || []).slice(0, 6))).catch(() => {})
    axios.get('/api/blog?limit=3').then(r => setPosts(r.data.posts || [])).catch(() => {})
  }, [])

  const inView = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.65, ease: 'easeOut' } }

  const STATS_DISPLAY = [
    { value: stats ? `${(stats.members / 1000).toFixed(0)}k+` : '50k+', label: 'Members', icon: Users },
    { value: stats ? `${stats.projects}+` : '1.2k+', label: 'Projects', icon: Code2 },
    { value: stats ? `${stats.events}+` : '300+', label: 'Events', icon: Calendar },
    { value: stats ? `${(stats.discussions / 1000).toFixed(0)}k+` : '15k+', label: 'Discussions', icon: MessageSquare },
  ]

  const EVENT_TYPE_STYLE = {
    hackathon:  { bg: 'rgba(0,212,255,0.1)',  border: 'rgba(0,212,255,0.3)',  text: '#00d4ff' },
    workshop:   { bg: 'rgba(123,47,255,0.1)', border: 'rgba(123,47,255,0.3)', text: '#a78bfa' },
    conference: { bg: 'rgba(0,102,255,0.1)',  border: 'rgba(0,102,255,0.3)',  text: '#60a5fa' },
    default:    { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)',  text: '#00d4ff' },
  }

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,102,255,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(123,47,255,0.12) 0%, transparent 65%)' }} />

        <GridLogoBackground />
        <Particles />

        <div className="absolute top-1/3 left-1/5 w-80 h-80 rounded-full"
          style={{ background: 'rgba(0,102,255,0.07)', filter: 'blur(100px)', animation: 'pulse 5s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full"
          style={{ background: 'rgba(123,47,255,0.07)', filter: 'blur(90px)', animation: 'pulse 6s ease-in-out infinite', animationDelay: '2.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">

          {/* Live badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
            <SectionLabel>Community Network v2.0 — Now Live</SectionLabel>
          </motion.div>

          {/* Headline — smaller, humanoid */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.75 }}>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 800, lineHeight: 1.1 }}
              className="text-4xl sm:text-5xl md:text-6xl mb-3 tracking-tight">
              <span className="text-white">Where tech minds</span>
            </h1>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 800, lineHeight: 1.1 }}
              className="text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight">
              <span className="text-gradient">connect & grow.</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-inter">
            Join <span className="text-white font-medium">50,000+ developers</span>, engineers, and
            innovators building the future together. Open source, real connections, real growth.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-sm px-7 py-3.5">
              Join GRID <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/members" className="btn-outline flex items-center gap-2 text-sm px-7 py-3.5">
              Meet the community
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.65 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS_DISPLAY.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-card py-4 px-3">
                <Icon className="w-4 h-4 text-grid-cyan mx-auto mb-2 opacity-70" />
                <div className="font-orbitron text-xl font-bold text-gradient mb-0.5">{value}</div>
                <div className="text-[11px] text-gray-500 font-rajdhani tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-gray-600 font-rajdhani tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #00d4ff, transparent)' }} />
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="relative max-w-6xl mx-auto">

          <motion.div {...inView} className="text-center mb-14">
            <SectionLabel>Platform capabilities</SectionLabel>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
              className="text-2xl md:text-3xl text-white mb-3 tracking-tight">
              Built for <span className="text-gradient">serious builders</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto font-inter leading-relaxed">
              Everything you need to collaborate, grow, and make an impact in global tech.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Code2,       title: 'Open source projects',   desc: 'Collaborate on cutting-edge repos with contributors worldwide.' },
              { icon: Network,     title: 'Global network',         desc: 'Connect with 50,000+ engineers across 50+ countries.' },
              { icon: Shield,      title: 'Verified experts',       desc: 'Learn directly from industry-certified engineers and tech leads.' },
              { icon: Zap,         title: 'Live events',            desc: 'Hackathons, workshops, and real-time coding sessions every week.' },
              { icon: Layers,      title: 'Showcase your work',     desc: 'Publish projects, get feedback, and build your reputation.' },
              { icon: TrendingUp,  title: 'Career acceleration',    desc: 'Referrals, mentorship, and exclusive opportunities — all in one place.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.55 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="glass-card rounded-xl p-5 group cursor-default">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-neon-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.18), rgba(0,212,255,0.15))', border: '1px solid rgba(0,212,255,0.18)' }}>
                  <Icon className="w-5 h-5 text-grid-cyan" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5 leading-snug">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-inter">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">

          <motion.div {...inView} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <SectionLabel>Upcoming events</SectionLabel>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
                className="text-2xl md:text-3xl text-white tracking-tight">
                What's <span className="text-gradient">happening</span>
              </h2>
            </div>
            <Link to="/events"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase transition-all duration-200 group"
              style={{ color: '#00d4ff' }}>
              View all events
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {events.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Global Hackathon 2025', type: 'hackathon',   date: 'Aug 12–14', location: 'San Francisco + Online', desc: '48-hour build marathon with $50k in prizes across 8 tracks.' },
                { title: 'Web3 Architecture Workshop', type: 'workshop', date: 'Jul 28',    location: 'Online',                desc: 'Deep-dive into decentralized application design patterns.' },
                { title: 'GRID Dev Conference',    type: 'conference', date: 'Sep 5–6',   location: 'New York City',          desc: 'Two days of talks, demos, and networking with industry leaders.' },
              ].map((e, i) => <EventCard key={i} event={e} i={i} typeStyle={EVENT_TYPE_STYLE} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((e, i) => <EventCard key={e.id} event={e} i={i} typeStyle={EVENT_TYPE_STYLE} />)}
            </div>
          )}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          MEMBERS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(123,47,255,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">

          <motion.div {...inView} className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <SectionLabel>Community members</SectionLabel>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
                className="text-2xl md:text-3xl text-white tracking-tight">
                Meet the <span className="text-gradient">builders</span>
              </h2>
            </div>
            <Link to="/members"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase transition-all duration-200 group"
              style={{ color: '#00d4ff' }}>
              Browse all members
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(members.length > 0 ? members : FALLBACK_MEMBERS).map((m, i) => (
              <motion.div key={m.id || m.username}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.55 }}>
                <Link to="/members" className="block glass-card rounded-xl p-5 group transition-all duration-300 hover:-translate-y-1"
                  style={{ '--tw-shadow': 'none' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                      style={{ background: m.avatar_color || 'linear-gradient(135deg,#0066ff,#00d4ff)' }}>
                      {(m.username || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-white font-semibold text-sm truncate">{m.username}</span>
                        <RoleBadge role={m.role} />
                      </div>
                      {m.location && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1.5">
                          <MapPin className="w-3 h-3" />{m.location}
                        </div>
                      )}
                      {m.bio && <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 font-inter">{m.bio}</p>}
                    </div>
                  </div>
                  {m.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                      {(Array.isArray(m.skills) ? m.skills : []).slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded font-medium"
                          style={{ background: 'rgba(0,212,255,0.08)', color: '#7dd3fc', border: '1px solid rgba(0,212,255,0.12)' }}>
                          {s}
                        </span>
                      ))}
                      {(Array.isArray(m.skills) ? m.skills : []).length > 3 && (
                        <span className="text-[10px] text-gray-600">+{m.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,102,255,0.07) 0%, transparent 70%)' }} />

        <motion.div {...inView} className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div>
              <SectionLabel>About GRID</SectionLabel>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
                className="text-2xl md:text-3xl text-white mb-5 tracking-tight leading-snug">
                More than a community —<br />
                <span className="text-gradient">a launchpad.</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed font-inter mb-4">
                GRID was founded by engineers who wanted something better than a LinkedIn group or a Slack server. A place where code meets culture — where you can share what you're building, find collaborators who care, and grow alongside the best minds in tech.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed font-inter mb-8">
                We're open source at heart, global by design, and obsessed with the idea that the best work happens when brilliant people connect freely.
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3">
                Learn our story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: value cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Cpu,       label: 'Open Source First', desc: 'Everything we build is transparent and community-driven.' },
                { icon: Globe,     label: 'Globally Inclusive', desc: 'Members from 50+ countries, all backgrounds welcome.' },
                { icon: Shield,    label: 'Trust & Safety',     desc: 'Verified profiles and a zero-tolerance abuse policy.' },
                { icon: Sparkles,  label: 'Always Evolving',   desc: 'New features shaped entirely by member feedback.' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.5 }}
                  className="glass-card rounded-xl p-4">
                  <Icon className="w-5 h-5 text-grid-cyan mb-3" />
                  <div className="text-white text-xs font-semibold mb-1">{label}</div>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-inter">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,102,255,0.1) 0%, rgba(123,47,255,0.06) 50%, transparent 80%)' }} />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <motion.div {...inView} className="relative max-w-2xl mx-auto text-center">
          <SectionLabel>Ready to join?</SectionLabel>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 800 }}
            className="text-3xl md:text-4xl text-white mb-4 tracking-tight leading-snug">
            Build the future <span className="text-gradient">with GRID.</span>
          </h2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed font-inter max-w-md mx-auto">
            Your network is your net worth. The people you meet here will become your co-founders, collaborators, and closest friends in tech.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-sm px-8 py-3.5">
              Create your account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/forum" className="btn-outline flex items-center gap-2 text-sm px-8 py-3.5">
              Explore the forum
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}

/* ─── EVENT CARD COMPONENT ────────────────────────────────────────────────── */
function EventCard({ event, i, typeStyle }) {
  const type = event.type?.toLowerCase() || 'default'
  const style = typeStyle[type] || typeStyle.default
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : event.date_display || '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}>
      <Link to="/events" className="block glass-card rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 h-full"
        style={{ display: 'flex', flexDirection: 'column' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
        {/* Top color bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${style.border}, transparent)` }} />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded"
              style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text }}>
              {event.type || 'Event'}
            </span>
            <span className="text-[11px] text-gray-500 font-rajdhani">{dateStr}</span>
          </div>
          <h3 className="text-white font-semibold text-sm leading-snug mb-2">{event.title}</h3>
          {event.description && (
            <p className="text-gray-500 text-xs leading-relaxed font-inter line-clamp-2 mb-3 flex-1">{event.description}</p>
          )}
          {event.location && (
            <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-auto">
              <MapPin className="w-3 h-3" />{event.location}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── FALLBACK MEMBERS (when DB is empty) ─────────────────────────────────── */
const FALLBACK_MEMBERS = [
  { id: 1, username: 'alex_chen',     role: 'Founder',   location: 'San Francisco', bio: 'Building distributed systems at scale. OSS contributor.', skills: ['Rust', 'Go', 'Kubernetes'], avatar_color: 'linear-gradient(135deg,#0066ff,#00d4ff)' },
  { id: 2, username: 'sara_williams', role: 'Developer',  location: 'Berlin',        bio: 'Full-stack engineer obsessed with clean architecture.',    skills: ['React', 'Node.js', 'PostgreSQL'], avatar_color: 'linear-gradient(135deg,#7b2fff,#00d4ff)' },
  { id: 3, username: 'raj_patel',     role: 'Designer',   location: 'London',        bio: 'UX-first engineer who ships beautiful, fast products.',    skills: ['Figma', 'CSS', 'Motion'],  avatar_color: 'linear-gradient(135deg,#ec4899,#7b2fff)' },
  { id: 4, username: 'lena_müller',   role: 'Moderator',  location: 'Munich',        bio: 'ML researcher making models that actually work in prod.',   skills: ['Python', 'PyTorch', 'MLOps'], avatar_color: 'linear-gradient(135deg,#0066ff,#7b2fff)' },
  { id: 5, username: 'kai_nakamura',  role: 'Developer',  location: 'Tokyo',         bio: 'Systems programmer. Currently obsessed with WebAssembly.',  skills: ['Wasm', 'C++', 'Zig'],     avatar_color: 'linear-gradient(135deg,#00d4ff,#0066ff)' },
  { id: 6, username: 'priya_sharma',  role: 'Developer',  location: 'Bangalore',     bio: 'DevOps engineer automating everything that can be automated.', skills: ['Terraform', 'AWS', 'Docker'], avatar_color: 'linear-gradient(135deg,#f97316,#ec4899)' },
]
