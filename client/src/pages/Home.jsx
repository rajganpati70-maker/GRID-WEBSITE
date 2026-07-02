import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Code2, Globe, Shield, Zap, TrendingUp,
  Users, MessageSquare, Calendar, MapPin, ChevronRight,
  Cpu, Network, Activity, UserPlus, FileText, Layers, Star,
} from 'lucide-react'
import axios from 'axios'
import GridLogoAnimation from '../components/GridLogoAnimation'
import ParticleNetwork   from '../components/ParticleNetwork'
import HolographicCard  from '../components/HolographicCard'
import MagneticButton   from '../components/MagneticButton'
import GlowCounter      from '../components/GlowCounter'
import LiveTicker       from '../components/LiveTicker'

/* ─── Morphing headline word ─────────────────────────────────────────────── */
const MORPHS = ['connect and grow.', 'build and ship.', 'learn and create.', 'make history.']

function MorphingWord() {
  const [idx, setIdx] = useState(0)
  const [out, setOut] = useState(false)
  useEffect(() => {
    let timeoutId = null
    const iv = setInterval(() => {
      setOut(true)
      timeoutId = setTimeout(() => { setIdx(i => (i + 1) % MORPHS.length); setOut(false) }, 370)
    }, 3500)
    return () => { clearInterval(iv); if (timeoutId) clearTimeout(timeoutId) }
  }, [])
  return (
    <span className="text-gradient" style={{
      display: 'inline-block',
      transition: 'opacity 0.37s ease, transform 0.37s cubic-bezier(0.22,1,0.36,1)',
      opacity: out ? 0 : 1,
      transform: out ? 'translateY(10px) scale(0.97)' : 'translateY(0) scale(1)',
    }}>
      {MORPHS[idx]}
    </span>
  )
}

/* ─── Live activity hook ─────────────────────────────────────────────────── */
const SEED = [
  { id:'s1', kind:'thread', user:'elena_v',  text:'Rust async patterns deep dive',             time:'2m ago'  },
  { id:'s2', kind:'join',   user:'kai_dev',  text:'Joined the community',                      time:'5m ago'  },
  { id:'s3', kind:'thread', user:'priya_s',  text:'Zero-downtime deploy pipeline',             time:'9m ago'  },
  { id:'s4', kind:'join',   user:'marco_r',  text:'Joined the community',                      time:'14m ago' },
  { id:'s5', kind:'thread', user:'alex_c',   text:'k8s to Nomad migration notes',              time:'22m ago' },
  { id:'s6', kind:'join',   user:'suki_t',   text:'Joined the community',                      time:'29m ago' },
  { id:'s7', kind:'thread', user:'dev_omar', text:'TypeScript 5.5 features worth knowing',     time:'35m ago' },
  { id:'s8', kind:'join',   user:'nadia_m',  text:'Joined the community',                      time:'41m ago' },
]

function timeAgo(d) {
  if (!d) return '—'
  const m = Math.floor((Date.now() - new Date(d)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

function useActivityFeed() {
  const [items, setItems] = useState(SEED)
  const [online, setOnline] = useState(false)
  useEffect(() => {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${proto}//${location.host}/ws`)
    ws.onopen  = () => setOnline(true)
    ws.onclose = () => setOnline(false)
    ws.onerror = () => setOnline(false)
    let counter = 0
    ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data)
        const uid = `ws-${Date.now()}-${++counter}`
        if (msg.type === 'user_joined' && msg.user)
          setItems(p => [{ id: uid, kind:'join', user: msg.user.username, text:'Joined the community', time:'just now' }, ...p].slice(0,16))
        if (msg.type === 'forum_thread_new' && msg.thread)
          setItems(p => [{ id: uid, kind:'thread', user: msg.thread.author||'member', text: msg.thread.title, time:'just now' }, ...p].slice(0,16))
      } catch {}
    }
    axios.get('/api/forum').then(r => {
      const live = (r.data||[]).slice(0,4).map(t => ({ id:`p-${t.id}`, kind:'thread', user:t.author||'member', text:t.title, time:timeAgo(t.created_at) }))
      if (live.length) setItems(p => [...live, ...p.filter(x=>x.id.startsWith('s'))].slice(0,16))
    }).catch(()=>{})
    return () => ws.close()
  }, [])
  return { items, online }
}

/* ─── Live feed panel ────────────────────────────────────────────────────── */
function LiveFeedPanel() {
  const { items, online } = useActivityFeed()
  return (
    <div className="rounded-2xl flex flex-col" style={{
      height: 420,
      background: 'rgba(4,4,18,0.9)',
      border: '1px solid rgba(0,212,255,0.14)',
      backdropFilter: 'blur(28px)',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(0,212,255,0.05)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0" style={{ borderBottom:'1px solid rgba(0,212,255,0.08)', background:'rgba(0,212,255,0.018)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,rgba(0,102,255,0.35),rgba(0,212,255,0.22))', border:'1px solid rgba(0,212,255,0.22)' }}>
            <Activity style={{ width:13, height:13, color:'#00d4ff' }} />
          </div>
          <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:13, color:'#e2e8f0', letterSpacing:'-0.01em' }}>Live activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={ online ? { background:'#4ade80', boxShadow:'0 0 6px #4ade80', animation:'glow-pulse 2s infinite' } : { background:'#374151' }} />
          <span style={{ fontSize:10.5, color: online?'#86efac':'#4b5563', fontFamily:'Inter,sans-serif', fontWeight:500 }}>{online?'live':'offline'}</span>
        </div>
      </div>
      {/* Items */}
      <div className="overflow-y-auto flex-1" style={{ scrollbarWidth:'thin' }}>
        <AnimatePresence initial={false}>
          {items.map(item => (
            <motion.div key={item.id}
              initial={{ opacity:0, y:-8, height:0 }} animate={{ opacity:1, y:0, height:'auto' }} exit={{ opacity:0, height:0 }}
              transition={{ duration:0.28 }}
              className="flex items-start gap-3 px-4 py-2.5"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold" style={{ fontSize:10, background: item.kind==='join'?'linear-gradient(135deg,#6d28d9,#00d4ff)':'linear-gradient(135deg,#0052cc,#00d4ff)' }}>
                {item.user[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize:12, lineHeight:1.5 }}>
                  <span style={{ color:'#e2e8f0', fontWeight:600, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{item.user}</span>
                  <span style={{ color:'#374151' }}> · </span>
                  <span style={{ color:'#6b7280', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{item.text}</span>
                </p>
                <p style={{ fontSize:10.5, color:'#374151', marginTop:1 }}>{item.time}</p>
              </div>
              <div className="mt-1.5 flex-shrink-0">
                {item.kind==='join' ? <UserPlus style={{ width:10,height:10,color:'#7b2fff',opacity:.6 }} /> : <FileText style={{ width:10,height:10,color:'#00d4ff',opacity:.6 }} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="px-5 py-3 flex-shrink-0" style={{ borderTop:'1px solid rgba(0,212,255,0.07)' }}>
        <Link to="/forum" className="flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors" style={{ color:'rgba(0,212,255,0.55)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
          Open forum <ChevronRight style={{ width:12,height:12 }} />
        </Link>
      </div>
    </div>
  )
}

/* ─── Reusables ──────────────────────────────────────────────────────────── */
const ROLE_C = {
  founder:   {bg:'rgba(251,191,36,0.1)', bd:'rgba(251,191,36,0.35)', tx:'#fbbf24'},
  moderator: {bg:'rgba(123,47,255,0.1)', bd:'rgba(123,47,255,0.35)', tx:'#a78bfa'},
  developer: {bg:'rgba(0,212,255,0.08)', bd:'rgba(0,212,255,0.3)',   tx:'#00d4ff'},
  designer:  {bg:'rgba(236,72,153,0.08)',bd:'rgba(236,72,153,0.3)',  tx:'#f472b6'},
  default:   {bg:'rgba(0,102,255,0.08)', bd:'rgba(0,102,255,0.3)',   tx:'#60a5fa'},
}
function RoleBadge({ role }) {
  const c = ROLE_C[role?.toLowerCase()] || ROLE_C.default
  return <span style={{ background:c.bg, border:`1px solid ${c.bd}`, color:c.tx, fontSize:9.5, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 7px', borderRadius:100, flexShrink:0 }}>{role||'Member'}</span>
}

function SectionLabel({ children }) {
  return (
    <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }} className="mb-3">
      <span className="tag"><span className="w-1 h-1 rounded-full bg-grid-cyan animate-pulse" />{children}</span>
    </motion.div>
  )
}

function Divider() {
  return <div className="max-w-6xl mx-auto px-6"><div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.12),rgba(0,102,255,0.08),transparent)' }} /></div>
}

const iv = { initial:{opacity:0,y:28}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.62, ease:'easeOut'} }

/* ─── Feature card ───────────────────────────────────────────────────────── */
const FEATURES = [
  { icon:Code2,     title:'Open Source Hub',         desc:'Browse, fork, and contribute to 1,200+ community projects — all in one place.', accent:'#00d4ff' },
  { icon:Network,   title:'Real-Time Forum',          desc:'Live discussions, instant notifications, WebSocket-powered threads that breathe.', accent:'#7b2fff' },
  { icon:Users,     title:'Member Directory',         desc:'Find engineers, designers, and founders by stack, timezone, or expertise.', accent:'#0066ff' },
  { icon:Calendar,  title:'Events & Hackathons',      desc:'300+ events per year — workshops, sprints, and conferences by the community.', accent:'#00d4ff' },
  { icon:Cpu,       title:'AI-Assisted Discovery',    desc:'Surface the right people, posts, and projects without endless scrolling.', accent:'#f472b6' },
  { icon:Shield,    title:'Trust & Safety',           desc:'Human moderation, verified members, and a code of conduct that actually holds.', accent:'#4ade80' },
]

function FeatureCard({ feat, i }) {
  return (
    <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07, duration:0.55 }}>
      <HolographicCard className="premium-card rounded-2xl p-5 h-full" intensity={0.9} data-cursor="EXPLORE">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background:`linear-gradient(135deg,rgba(0,52,204,0.22),rgba(0,212,255,0.14))`, border:`1px solid ${feat.accent}28` }}>
          <feat.icon style={{ width:18, height:18, color: feat.accent }} />
        </div>
        <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:14.5, color:'#e8eef8', marginBottom:6, letterSpacing:'-0.01em' }}>{feat.title}</h3>
        <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13, color:'rgba(140,160,190,0.78)', lineHeight:1.65 }}>{feat.desc}</p>
      </HolographicCard>
    </motion.div>
  )
}

/* ─── Event card ─────────────────────────────────────────────────────────── */
const EVT_S = {
  hackathon:  { bar:'linear-gradient(90deg,#00d4ff,#0066ff)', badge:{bg:'rgba(0,212,255,0.1)',bd:'rgba(0,212,255,0.3)',tx:'#00d4ff'} },
  workshop:   { bar:'linear-gradient(90deg,#7b2fff,#00d4ff)', badge:{bg:'rgba(123,47,255,0.1)',bd:'rgba(123,47,255,0.3)',tx:'#a78bfa'} },
  conference: { bar:'linear-gradient(90deg,#0066ff,#7b2fff)', badge:{bg:'rgba(0,102,255,0.1)',bd:'rgba(0,102,255,0.3)',tx:'#60a5fa'} },
  default:    { bar:'linear-gradient(90deg,#00d4ff,#0066ff)', badge:{bg:'rgba(0,212,255,0.07)',bd:'rgba(0,212,255,0.2)',tx:'#00d4ff'} },
}

function EventCard({ event, i }) {
  const s = EVT_S[event.type?.toLowerCase()] || EVT_S.default
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : event.date_display || '—'
  return (
    <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.55 }}>
      <HolographicCard intensity={0.8}>
        <Link to="/events" className="event-card flex flex-col h-full">
          <div style={{ height:3, background:s.bar, flexShrink:0 }} />
          <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ background:'linear-gradient(180deg,rgba(0,212,255,0.04) 0%,transparent 100%)', borderBottom:'1px solid rgba(0,212,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ ...s.badge, background:s.badge.bg, border:`1px solid ${s.badge.bd}`, color:s.badge.tx, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100 }}>{event.type||'Event'}</span>
              <span style={{ fontSize:11, color:'#4b5563' }}>{dateStr}</span>
            </div>
            <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#e8eef8', lineHeight:1.35 }}>{event.title}</h3>
          </div>
          <div className="px-5 py-4 flex flex-col flex-1">
            {event.description && <p className="line-clamp-2 flex-1 mb-3" style={{ fontSize:13, color:'rgba(140,160,190,0.75)', lineHeight:1.6 }}>{event.description}</p>}
            {event.location && <div className="flex items-center gap-1.5 mt-auto" style={{ fontSize:11.5, color:'#4b5563' }}><MapPin style={{ width:12,height:12,color:'#00d4ff',opacity:.6 }} />{event.location}</div>}
          </div>
        </Link>
      </HolographicCard>
    </motion.div>
  )
}

/* ─── Member card ────────────────────────────────────────────────────────── */
function MemberCard({ m, i }) {
  return (
    <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.06, duration:0.5 }}>
      <HolographicCard intensity={1.1} data-cursor="PROFILE">
        <Link to="/members" className="premium-card rounded-2xl p-4 block">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: m.avatar_color||'linear-gradient(135deg,#0052cc,#00d4ff)', boxShadow:'0 2px 10px rgba(0,0,0,0.4)' }}>
              {(m.username||'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:14, color:'#e8eef8' }}>{m.username}</span>
                <RoleBadge role={m.role} />
              </div>
              {m.location && <div className="flex items-center gap-1 mb-1.5" style={{ fontSize:11.5, color:'#4b5563' }}><MapPin style={{ width:11,height:11 }} />{m.location}</div>}
              {m.bio && <p className="line-clamp-2" style={{ fontSize:12.5, color:'rgba(140,160,190,0.7)', lineHeight:1.55 }}>{m.bio}</p>}
            </div>
          </div>
          {Array.isArray(m.skills) && m.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop:'1px solid rgba(0,212,255,0.07)' }}>
              {m.skills.slice(0,3).map(s => (
                <span key={s} style={{ fontSize:10.5, fontWeight:500, background:'rgba(0,212,255,0.07)', color:'#7dd3fc', border:'1px solid rgba(0,212,255,0.12)', padding:'2px 8px', borderRadius:6 }}>{s}</span>
              ))}
              {m.skills.length > 3 && <span style={{ fontSize:10.5, color:'#374151' }}>+{m.skills.length-3}</span>}
            </div>
          )}
        </Link>
      </HolographicCard>
    </motion.div>
  )
}

/* ─── Fallback data ──────────────────────────────────────────────────────── */
const FALLBACK_EVENTS = [
  { id:1, title:'GRID Hackathon 2025 — 48h Build Sprint', type:'hackathon',  date:'2025-09-15', location:'Global · Online',       description:'48 hours to build something real with 500+ engineers. Prizes, mentors, and momentum.' },
  { id:2, title:'Web Platform Deep Dive Workshop',         type:'workshop',   date:'2025-08-22', location:'San Francisco, CA',      description:'A hands-on day with browser internals, performance profiling, and the rendering pipeline.' },
  { id:3, title:'GRID Annual Summit 2025',                 type:'conference', date:'2025-10-04', location:'Berlin, Germany',        description:'Three days of talks, workshops, and hallway conversations with 1,200+ builders.' },
]

const FALLBACK_MEMBERS = [
  { id:1, username:'elena_vasquez',  role:'founder',   location:'Barcelona', bio:'Distributed systems and open source. Building tools that make infrastructure less painful.', skills:['Rust','Kubernetes','Go'] },
  { id:2, username:'kai_tanaka',     role:'developer', location:'Tokyo',     bio:'Frontend at heart, full-stack by necessity. React, design systems, and everything in between.', skills:['React','TypeScript','CSS'] },
  { id:3, username:'priya_sharma',   role:'moderator', location:'Bangalore', bio:'DevOps engineer and community builder. Passionate about making deployment boring (in a good way).', skills:['CI/CD','Docker','AWS'] },
  { id:4, username:'marco_rossi',    role:'developer', location:'Milan',     bio:'API design, GraphQL, and database performance. Breaking things intentionally since 2016.', skills:['GraphQL','PostgreSQL','Node'] },
  { id:5, username:'alex_chen',      role:'designer',  location:'New York',  bio:'Product design and motion. I care about the micro-interactions other people call "unnecessary".', skills:['Figma','Framer','CSS'] },
  { id:6, username:'suki_tran',      role:'developer', location:'Ho Chi Minh', bio:'ML engineer and open source maintainer. Working on models that actually run in production.', skills:['Python','PyTorch','CUDA'] },
]

/* ─── HOME ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 600], [0, 120])

  const [events,  setEvents]  = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    axios.get('/api/events').then(r  => setEvents((r.data||[]).slice(0,3))).catch(()  => setEvents(FALLBACK_EVENTS))
    axios.get('/api/members').then(r => setMembers((r.data||[]).slice(0,6))).catch(() => setMembers(FALLBACK_MEMBERS))
  }, [])

  const displayEvents  = events.length  ? events  : FALLBACK_EVENTS
  const displayMembers = members.length ? members : FALLBACK_MEMBERS

  return (
    <div style={{ background:'#02020e', overflow:'hidden' }}>

      {/* ════════════════════════  HERO  ════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Deep radial bg */}
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 100% 80% at 50% -5%, rgba(0,82,204,0.2) 0%, transparent 62%), radial-gradient(ellipse 60% 50% at 80% 95%, rgba(109,40,217,0.11) 0%, transparent 65%), #02020e' }} />

        {/* Dot grid — parallax */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 grid-bg opacity-35" />

        {/* 3-D Particle network */}
        <ParticleNetwork opacity={0.82} />

        {/* Aurora blobs */}
        <div style={{ position:'absolute', top:'8%', left:'4%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,82,204,0.13) 0%,transparent 70%)', filter:'blur(90px)', animation:'aurora1 22s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', top:'35%', right:'6%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(109,40,217,0.11) 0%,transparent 70%)', filter:'blur(80px)', animation:'aurora2 28s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'8%', left:'28%', width:560, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)', filter:'blur(110px)', animation:'aurora3 18s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />

        {/* GRID logo — faint background anchor */}
        <GridLogoAnimation size={560} opacity={0.6} />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-36 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">

            {/* ── Left: headline + CTAs ── */}
            <div className="flex-1 text-center lg:text-left">

              {/* Status badge */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05, duration:0.5 }} className="mb-6 flex justify-center lg:justify-start">
                <span className="tag">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#4ade80', boxShadow:'0 0 6px #4ade80' }} />
                  50,000 builders online now
                </span>
              </motion.div>

              {/* H1 */}
              <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12, duration:0.75 }}>
                <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.04em', fontSize:'clamp(2.4rem,5vw,4rem)', color:'#f0f6ff', marginBottom:6 }}>
                  Where tech minds
                </h1>
                <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.04em', fontSize:'clamp(2.4rem,5vw,4rem)', marginBottom:28 }}>
                  <MorphingWord />
                </h1>
              </motion.div>

              <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28, duration:0.65 }}
                className="max-w-md mb-10 text-base md:text-lg leading-relaxed mx-auto lg:mx-0"
                style={{ color:'rgba(170,186,210,0.82)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                Join <strong style={{ color:'#e8eef8', fontWeight:700 }}>50,000+ developers</strong>, engineers, and builders
                from 90 countries — collaborating, shipping, and growing together.
              </motion.p>

              {/* Magnetic CTAs */}
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42, duration:0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-14">
                <MagneticButton variant="primary" className="gap-2 px-7 py-3.5 text-sm" onClick={() => window.location.href='/register'}>
                  Join GRID free <ArrowRight style={{ width:16,height:16 }} />
                </MagneticButton>
                <MagneticButton variant="secondary" className="gap-2 px-7 py-3.5 text-sm btn-outline" onClick={() => window.location.href='/members'}>
                  Browse the community
                </MagneticButton>
              </motion.div>

              {/* Stats row */}
              <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.58, duration:0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-sm mx-auto lg:mx-0">
                {[
                  { v:'50k+', l:'Members' },
                  { v:'1.2k', l:'Projects' },
                  { v:'300+', l:'Events' },
                  { v:'15k+', l:'Threads' },
                ].map(({ v, l }) => (
                  <div key={l} className="stat-card py-3">
                    <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:20, letterSpacing:'-0.03em', marginBottom:2 }} className="text-gradient">{v}</div>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'#374151', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:500 }}>{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: live feed panel ── */}
            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.35, duration:0.8, ease:'easeOut' }}
              className="w-full lg:w-[400px] flex-shrink-0">
              <LiveFeedPanel />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8, duration:0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span style={{ fontSize:9, color:'#1f2937', letterSpacing:'0.35em', textTransform:'uppercase', fontFamily:'Inter,sans-serif' }}>scroll</span>
          <motion.div animate={{ y:[0,7,0] }} transition={{ repeat:Infinity, duration:1.8 }}
            style={{ width:1, height:38, background:'linear-gradient(to bottom,rgba(0,212,255,0.55),transparent)', borderRadius:1 }} />
        </motion.div>
      </section>

      {/* ════════════  LIVE TICKER  ════════════ */}
      <LiveTicker />

      {/* ════════════  VALUE PROPS  ════════════ */}
      <section className="py-16 px-6 relative">
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(0,82,204,0.03) 0%,rgba(0,212,255,0.03) 50%,rgba(109,40,217,0.03) 100%)' }} />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { n:'Community first',       b:'Every decision is shaped by the people in it — no black boxes, no gatekeeping, just builders.' },
            { n:'Ship together',         b:'Find a collaborator in minutes. Real code, real feedback, real progress — not theoretical.' },
            { n:'Grow for the long run', b:'This is where careers are built: mentorship, opportunities, and friendships that last.' },
          ].map(({ n, b }, i) => (
            <motion.div key={n} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.55 }} className="px-4">
              <div style={{ width:32, height:2, background:'linear-gradient(90deg,#0066ff,#00d4ff)', borderRadius:2, margin:'0 auto 14px' }} />
              <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#e8eef8', marginBottom:8 }}>{n}</h3>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13.5, color:'rgba(140,160,190,0.72)', lineHeight:1.65 }}>{b}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ════════════  FEATURES  ════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 grid-bg opacity-18" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Platform capabilities</SectionLabel>
            <motion.h2 {...iv} className="section-title text-3xl md:text-[2.2rem] text-white">
              Built for <span className="text-gradient">serious builders</span>
            </motion.h2>
            <motion.p {...iv} className="text-sm max-w-sm mx-auto mt-3" style={{ color:'rgba(140,160,190,0.7)', lineHeight:1.7 }}>
              Every tool you need to connect, collaborate, and ship — in one place.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} feat={f} i={i} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ════════════  BIG STATS  ════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Aurora behind stats */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,52,204,0.1) 0%, transparent 70%), #02020e', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-20%', left:'10%', width:400, height:400, borderRadius:'50%', background:'rgba(0,212,255,0.05)', filter:'blur(100px)', animation:'aurora1 24s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20%', right:'10%', width:350, height:350, borderRadius:'50%', background:'rgba(124,58,237,0.06)', filter:'blur(90px)', animation:'aurora2 20s ease-in-out infinite', pointerEvents:'none' }} />
        <div className="grid-line-bg absolute inset-0 opacity-15" />

        <div className="relative max-w-5xl mx-auto text-center">
          <SectionLabel>By the numbers</SectionLabel>
          <motion.h2 {...iv} className="section-title text-3xl md:text-[2.3rem] text-white mb-16">
            A community that <span className="text-gradient">speaks for itself</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value:50204, suffix:'+', label:'Members worldwide',    color:'#00d4ff' },
              { value:1247,  suffix:'+', label:'Open source projects',  color:'#7b2fff' },
              { value:300,   suffix:'+', label:'Events per year',        color:'#0088ff' },
              { value:15000, suffix:'+', label:'Forum discussions',      color:'#4ade80' },
            ].map(({ value, suffix, label, color }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.6 }}
                className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl"
                style={{ background:'rgba(6,6,20,0.7)', border:`1px solid ${color}1a`, backdropFilter:'blur(20px)' }}>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.04em', lineHeight:1 }}>
                  <GlowCounter value={value} suffix={suffix} color={color} duration={2400} />
                </div>
                {/* Sparkline */}
                <svg width="80" height="22" style={{ opacity:0.5 }}>
                  <polyline fill="none" stroke={color} strokeWidth="1.5"
                    points="0,18 14,12 28,15 38,6 52,10 64,4 80,7" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="80" cy="7" r="2.5" fill={color} />
                </svg>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:11, color:'rgba(140,160,190,0.6)', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600 }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ════════════  COMMUNITY  ════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Meet the builders</SectionLabel>
            <motion.h2 {...iv} className="section-title text-3xl md:text-[2.2rem] text-white">
              Real people. <span className="text-gradient">Real work.</span>
            </motion.h2>
            <motion.p {...iv} className="text-sm max-w-sm mx-auto mt-3" style={{ color:'rgba(140,160,190,0.7)', lineHeight:1.7 }}>
              Developers, designers, and founders building things that matter.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMembers.map((m, i) => <MemberCard key={m.id||m.username} m={m} i={i} />)}
          </div>
          <motion.div {...iv} className="text-center mt-10">
            <Link to="/members" className="btn-outline inline-flex items-center gap-2">
              See all 50,000+ members <ChevronRight style={{ width:16,height:16 }} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ════════════  EVENTS  ════════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 grid-bg opacity-18" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>What's coming up</SectionLabel>
            <motion.h2 {...iv} className="section-title text-3xl md:text-[2.2rem] text-white">
              Events worth <span className="text-gradient">showing up for</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayEvents.map((e, i) => <EventCard key={e.id} event={e} i={i} />)}
          </div>
          <motion.div {...iv} className="text-center mt-10">
            <Link to="/events" className="btn-outline inline-flex items-center gap-2">
              Browse all events <ChevronRight style={{ width:16,height:16 }} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ════════════  FINAL CTA  ════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,52,204,0.15) 0%, transparent 65%), #02020e' }} />
        <ParticleNetwork opacity={0.35} />
        <div className="grid-line-bg absolute inset-0 opacity-12" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, scale:0.94 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.7, ease:'easeOut' }}>
            <span className="tag mb-6 inline-flex">
              <Star style={{ width:11,height:11 }} />
              Free forever. No credit card.
            </span>
            <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,4.5vw,3.2rem)', letterSpacing:'-0.04em', lineHeight:1.1, color:'#f0f6ff', marginBottom:20 }}>
              Ready to find your people?
            </h2>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(170,186,210,0.78)', lineHeight:1.65, marginBottom:40, maxWidth:480, margin:'0 auto 40px' }}>
              Join 50,000+ builders who found their collaborators, mentors, and best work inside GRID.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton variant="primary" className="gap-2 px-8 py-4 text-base" onClick={() => window.location.href='/register'}>
                Create free account <ArrowRight style={{ width:18,height:18 }} />
              </MagneticButton>
              <MagneticButton variant="secondary" className="gap-2 px-8 py-4 text-base btn-outline" onClick={() => window.location.href='/about'}>
                Learn about GRID
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
