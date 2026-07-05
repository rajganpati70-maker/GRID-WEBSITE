import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight, ChevronRight, Star,
  Brain, Database, GitBranch, Layers, Cpu, BarChart2,
  BookOpen, FlaskConical, Network, Github, Linkedin, Globe,
  Microscope, Share2, Rocket,
} from 'lucide-react'
import axios from 'axios'
import GRIDLogoHero      from '../components/GRIDLogoHero'
import FloatingLogos     from '../components/FloatingLogos'
import ParticleNetwork   from '../components/ParticleNetwork'
import HolographicCard  from '../components/HolographicCard'
import MagneticButton   from '../components/MagneticButton'
import GlowCounter      from '../components/GlowCounter'

/* ─── Morphing headline word ─────────────────────────────────────────────── */
const MORPHS = [
  'train and deploy.',
  'research and publish.',
  'build and experiment.',
  'push state-of-the-art.',
]

function MorphingWord() {
  const [idx, setIdx] = useState(0)
  const [out, setOut] = useState(false)
  useEffect(() => {
    let tid = null
    const iv = setInterval(() => {
      setOut(true)
      tid = setTimeout(() => { setIdx(i => (i + 1) % MORPHS.length); setOut(false) }, 370)
    }, 3500)
    return () => { clearInterval(iv); if (tid) clearTimeout(tid) }
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

/* ─── Reusables ──────────────────────────────────────────────────────────── */
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

/* ─── ML Features ────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon:Brain,        title:'Research Hub',              desc:'Discuss cutting-edge ML papers, share insights on transformers, diffusion models, and emerging architectures.', accent:'#00d4ff' },
  { icon:GitBranch,    title:'Open ML Projects',          desc:'Browse, fork, and contribute to 900+ community ML repos — from training scripts to production inference pipelines.', accent:'#7b2fff' },
  { icon:Database,     title:'Dataset Exchange',          desc:'Share, discover, and collaborate on curated datasets for vision, NLP, audio, tabular, and multimodal tasks.', accent:'#0066ff' },
  { icon:Layers,       title:'Model Library',             desc:'Access community-trained models, fine-tuning recipes, and benchmark leaderboards across every major ML domain.', accent:'#00d4ff' },
  { icon:Cpu,          title:'MLOps & Infrastructure',   desc:'Production deployment, experiment tracking, distributed training — real practitioners sharing real battle scars.', accent:'#f472b6' },
  { icon:BarChart2,    title:'Experiment Tracker',        desc:'Log runs, compare metrics, and learn from how the best teams structure their ML experiments end-to-end.', accent:'#4ade80' },
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

/* ─── ML Events fallback ─────────────────────────────────────────────────── */
const FALLBACK_EVENTS = [
  { id:1, title:'GRID ML Hackathon 2025 — Build & Train', type:'hackathon',  date:'2025-09-15', location:'Global · Online', description:'72 hours to build a production ML system. Real datasets, GPU credits, $80K in prizes. 1,200+ participants.' },
  { id:2, title:'Transformers Architecture Deep Dive',     type:'workshop',   date:'2025-08-22', location:'Online',          description:'Hands-on breakdown of attention mechanisms, positional encodings, and how to fine-tune LLMs efficiently.' },
  { id:3, title:'GRID Research Summit 2025',               type:'conference', date:'2025-10-04', location:'Berlin, Germany', description:'Three days of ML research talks, poster sessions, and hands-on workshops with leading researchers.' },
]

const EVT_S = {
  hackathon:  { bar:'linear-gradient(135deg,#00d4ff,#0066ff)', accent:'#00d4ff', badge:{bg:'rgba(0,212,255,0.1)',bd:'rgba(0,212,255,0.3)',tx:'#00d4ff'} },
  workshop:   { bar:'linear-gradient(135deg,#7b2fff,#00d4ff)', accent:'#a78bfa', badge:{bg:'rgba(123,47,255,0.1)',bd:'rgba(123,47,255,0.3)',tx:'#a78bfa'} },
  conference: { bar:'linear-gradient(135deg,#0066ff,#7b2fff)', accent:'#60a5fa', badge:{bg:'rgba(0,102,255,0.1)',bd:'rgba(0,102,255,0.3)',tx:'#60a5fa'} },
  default:    { bar:'linear-gradient(135deg,#00d4ff,#0066ff)', accent:'#00d4ff', badge:{bg:'rgba(0,212,255,0.07)',bd:'rgba(0,212,255,0.2)',tx:'#00d4ff'} },
}

/* ── Home Event Variant 0 — "Panorama": giant date in gradient header ── */
function HomeEvtV0({ event, s, dateStr }) {
  const d = event.date ? new Date(event.date) : null
  const day = d ? d.getDate() : '—'
  const mon = d ? d.toLocaleString('default',{month:'short'}).toUpperCase() : ''
  const jak = '"Plus Jakarta Sans",sans-serif'
  return (
    <Link to="/events" style={{ display:'block', height:'100%', textDecoration:'none' }}>
      <div style={{ height:'100%', minHeight:440, display:'flex', flexDirection:'column',
        background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
        border:`1px solid ${s.accent}18`, borderRadius:22, overflow:'hidden', position:'relative',
        boxShadow:`0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${s.accent}08`,
        transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.borderColor=`${s.accent}38`; e.currentTarget.style.boxShadow=`0 36px 90px rgba(0,0,0,0.7),0 0 70px ${s.accent}18` }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=`${s.accent}18`; e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.6),0 0 40px ${s.accent}08` }}>
        {/* Visual header */}
        <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0 }}>
          <div style={{ position:'absolute', inset:0, background:s.bar, opacity:0.2 }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${s.accent}0a 1px,transparent 1px),linear-gradient(90deg,${s.accent}0a 1px,transparent 1px)`, backgroundSize:'30px 30px' }} />
          <div style={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', width:320, height:220, background:`radial-gradient(circle,${s.accent}2a 0%,transparent 65%)`, filter:'blur(32px)' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:2 }}>
            <div style={{ fontFamily:jak, fontWeight:900, fontSize:88, color:'#fff', lineHeight:1, letterSpacing:'-0.05em', textShadow:`0 0 60px ${s.accent}70` }}>{day}</div>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:15, letterSpacing:'0.3em', color:s.accent, textTransform:'uppercase', textShadow:`0 0 20px ${s.accent}80` }}>{mon}</div>
          </div>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.bar }} />
          <div style={{ position:'absolute', top:16, right:16 }}>
            <span style={{ background:s.badge.bg, border:`1px solid ${s.badge.bd}`, color:s.badge.tx, fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 11px', borderRadius:100, fontFamily:jak }}>{event.type||'Event'}</span>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:'22px 24px 24px', display:'flex', flexDirection:'column', flex:1 }}>
          <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16.5, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
          {event.description && <p style={{ fontSize:13, color:'rgba(140,160,190,0.72)', lineHeight:1.65, flex:1, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', fontFamily:jak }}>{event.description}</p>}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
            {event.location && <div style={{ fontSize:12, color:'rgba(140,160,190,0.5)', fontFamily:jak }}>📍 {event.location}</div>}
            <div style={{ fontSize:12.5, color:s.accent, fontWeight:700, fontFamily:jak, display:'flex', alignItems:'center', gap:4 }}>View <ArrowRight style={{ width:13,height:13 }} /></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Home Event Variant 1 — "Diagonal Split": angled color slab + date ── */
function HomeEvtV1({ event, s, dateStr }) {
  const d = event.date ? new Date(event.date) : null
  const day = d ? d.getDate() : '—'
  const mon = d ? d.toLocaleString('default',{month:'short'}).toUpperCase() : ''
  const jak = '"Plus Jakarta Sans",sans-serif'
  return (
    <Link to="/events" style={{ display:'block', height:'100%', textDecoration:'none' }}>
      <div style={{ height:'100%', minHeight:440, display:'flex', flexDirection:'column',
        background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
        border:`1px solid ${s.accent}18`, borderRadius:22, overflow:'hidden', position:'relative',
        boxShadow:`0 20px 60px rgba(0,0,0,0.6)`,
        transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.borderColor=`${s.accent}38`; e.currentTarget.style.boxShadow=`0 36px 90px rgba(0,0,0,0.7)` }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=`${s.accent}18`; e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.6)` }}>
        {/* Visual header — diagonal split */}
        <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0 }}>
          {/* Left gradient slab */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, right:0, background:s.bar }} />
          {/* Dark overlay right — clipped by polygon */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(6,6,24,0.0) 0%,rgba(4,4,18,0.92) 100%)', clipPath:'polygon(48% 0,100% 0,100% 100%,38% 100%)' }} />
          {/* Scan lines overlay */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.12) 4px,rgba(0,0,0,0.12) 5px)', pointerEvents:'none' }} />
          {/* Bottom fade */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:70, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
          {/* Date left */}
          <div style={{ position:'absolute', left:24, top:'50%', transform:'translateY(-50%)' }}>
            <div style={{ fontFamily:jak, fontWeight:900, fontSize:80, color:'rgba(0,0,0,0.45)', lineHeight:1, letterSpacing:'-0.05em' }}>{day}</div>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:13, letterSpacing:'0.22em', color:'rgba(0,0,0,0.38)', textTransform:'uppercase', marginTop:2 }}>{mon}</div>
          </div>
          {/* Right side overlay content */}
          <div style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', textAlign:'right' }}>
            <span style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(220,235,255,0.75)', fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 10px', borderRadius:100, fontFamily:jak }}>{event.type||'Event'}</span>
          </div>
          {/* Top accent */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.bar }} />
        </div>
        {/* Content */}
        <div style={{ padding:'20px 24px 24px', display:'flex', flexDirection:'column', flex:1 }}>
          <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16.5, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
          {event.description && <p style={{ fontSize:13, color:'rgba(140,160,190,0.72)', lineHeight:1.65, flex:1, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', fontFamily:jak }}>{event.description}</p>}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
            <span style={{ fontSize:11.5, color:'rgba(140,160,190,0.5)', fontFamily:jak }}>{dateStr}</span>
            <div style={{ fontSize:12.5, color:s.accent, fontWeight:700, fontFamily:jak, display:'flex', alignItems:'center', gap:4 }}>Details <ChevronRight style={{ width:13,height:13 }} /></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Home Event Variant 2 — "HUD Console": terminal header + corner brackets ── */
function HomeEvtV2({ event, s, dateStr }) {
  const jak = '"Plus Jakarta Sans",sans-serif'
  const br = { position:'absolute', width:18, height:18 }
  return (
    <Link to="/events" style={{ display:'block', height:'100%', textDecoration:'none' }}>
      <div style={{ height:'100%', minHeight:440, display:'flex', flexDirection:'column',
        background:'rgba(4,4,16,0.99)',
        border:`1px solid ${s.accent}22`, borderRadius:18, overflow:'hidden', position:'relative',
        boxShadow:`0 20px 60px rgba(0,0,0,0.65),0 0 0 1px rgba(255,255,255,0.02) inset`,
        transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.borderColor=`${s.accent}45`; e.currentTarget.style.boxShadow=`0 36px 90px rgba(0,0,0,0.75),0 0 0 1px rgba(255,255,255,0.03) inset` }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=`${s.accent}22`; e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.65),0 0 0 1px rgba(255,255,255,0.02) inset` }}>
        {/* Console titlebar */}
        <div style={{ height:42, background:'rgba(255,255,255,0.03)', borderBottom:`1px solid ${s.accent}15`, display:'flex', alignItems:'center', padding:'0 18px', gap:8, flexShrink:0 }}>
          <div style={{ display:'flex', gap:5 }}>
            {['#ff5f57','#ffbd2e','#28c841'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c, opacity:0.65 }} />)}
          </div>
          <div style={{ flex:1, fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10.5, color:`${s.accent}65`, letterSpacing:'0.12em', textAlign:'center', textTransform:'uppercase' }}>GRID_EVENTS.{event.type?.toLowerCase()||'event'}</div>
        </div>
        {/* HUD visual area */}
        <div style={{ height:164, position:'relative', overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.015)', borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:280, height:180, background:`radial-gradient(circle,${s.accent}18 0%,transparent 70%)`, filter:'blur(28px)' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.13) 3px,rgba(0,0,0,0.13) 4px)', pointerEvents:'none' }} />
          {/* Corner brackets */}
          <div style={{ ...br, top:12, left:12, borderTop:`2px solid ${s.accent}55`, borderLeft:`2px solid ${s.accent}55` }} />
          <div style={{ ...br, top:12, right:12, borderTop:`2px solid ${s.accent}55`, borderRight:`2px solid ${s.accent}55` }} />
          <div style={{ ...br, bottom:12, left:12, borderBottom:`2px solid ${s.accent}55`, borderLeft:`2px solid ${s.accent}55` }} />
          <div style={{ ...br, bottom:12, right:12, borderBottom:`2px solid ${s.accent}55`, borderRight:`2px solid ${s.accent}55` }} />
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6 }}>
            <span style={{ fontFamily:jak, fontWeight:700, fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:`${s.accent}75` }}>UPCOMING</span>
            <div style={{ fontFamily:jak, fontWeight:900, fontSize:26, color:'#f0f6ff', letterSpacing:'-0.03em', textAlign:'center' }}>{dateStr}</div>
            <span style={{ background:s.badge.bg, border:`1px solid ${s.badge.bd}`, color:s.badge.tx, fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 10px', borderRadius:100, fontFamily:jak }}>{event.type||'Event'}</span>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:'20px 22px 22px', display:'flex', flexDirection:'column', flex:1 }}>
          <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
          {event.description && <p style={{ fontSize:13, color:'rgba(140,160,190,0.72)', lineHeight:1.65, flex:1, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', fontFamily:jak }}>{event.description}</p>}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
            {event.location && <div style={{ fontSize:11.5, color:'rgba(140,160,190,0.5)', fontFamily:jak }}>📍 {event.location}</div>}
            <div style={{ fontSize:12.5, color:s.accent, fontWeight:700, fontFamily:jak, display:'flex', alignItems:'center', gap:4 }}>Open <ChevronRight style={{ width:13,height:13 }} /></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const HOME_EVT_VARIANTS = [HomeEvtV0, HomeEvtV1, HomeEvtV2]

function EventCard({ event, i }) {
  const s = EVT_S[event.type?.toLowerCase()] || EVT_S.default
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'
  const V = HOME_EVT_VARIANTS[i % HOME_EVT_VARIANTS.length]
  return (
    <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.55 }} style={{ height:'100%' }}>
      <V event={event} s={s} dateStr={dateStr} />
    </motion.div>
  )
}

/* ─── 9 Core Members ─────────────────────────────────────────────────────── */
const CORE_MEMBERS = [
  {
    id: 1,
    name: 'Moumita Mandal',
    position: 'Community Lead',
    specialty: 'ML Research & Community',
    initials: 'MM',
    photo: '/members/moumita.jpg',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #7b2fff 100%)',
    glowColor: '#ec4899',
    tags: ['Research', 'Community', 'ML'],
    github: '#', linkedin: '#',
  },
  {
    id: 2,
    name: 'Ritusree Chanda',
    position: 'Research Associate',
    specialty: 'Deep Learning',
    initials: 'RC',
    photo: '/members/ritusree.jpg',
    gradient: 'linear-gradient(135deg, #7b2fff 0%, #00d4ff 100%)',
    glowColor: '#7b2fff',
    tags: ['Deep Learning', 'NLP', 'Research'],
    github: '#', linkedin: '#',
  },
  {
    id: 3,
    name: 'Krishna Raj Barnwal',
    position: 'ML Engineer',
    specialty: 'Computer Vision & Systems',
    initials: 'KB',
    photo: '/members/krishna.jpg',
    gradient: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
    glowColor: '#00d4ff',
    tags: ['CV', 'Systems', 'ML'],
    github: '#', linkedin: '#',
  },
  {
    id: 4,
    name: 'Coming Soon',
    position: 'GRID Member',
    specialty: 'Details coming soon…',
    initials: '?',
    photo: null,
    gradient: 'linear-gradient(135deg, #0052cc 0%, #00d4ff 100%)',
    glowColor: '#0052cc',
    tags: ['GRID'],
    github: '#', linkedin: '#',
  },
  {
    id: 5,
    name: 'Aditya Gaurav',
    position: 'ML Researcher',
    specialty: 'Machine Learning & AI',
    initials: 'AG',
    photo: '/members/aditya.jpg',
    gradient: 'linear-gradient(135deg, #0052cc 0%, #7b2fff 100%)',
    glowColor: '#6366f1',
    tags: ['ML', 'Research', 'AI'],
    github: '#', linkedin: '#',
  },
  {
    id: 6,
    name: 'Member 6',
    position: 'Researcher',
    specialty: 'GRID Community',
    initials: 'M6',
    photo: '/members/om.png',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #4ade80 100%)',
    glowColor: '#4ade80',
    tags: ['Research', 'ML'],
    github: '#', linkedin: '#',
  },
  {
    id: 7,
    name: 'Member 7',
    position: 'Researcher',
    specialty: 'GRID Community',
    initials: 'M7',
    photo: '/members/member7.jpg',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    glowColor: '#f59e0b',
    tags: ['Research', 'ML'],
    github: '#', linkedin: '#',
  },
]

/* ─── CoreMemberCard — 5 ultra-premium variants (each structurally unique) ─ */
const jak = '"Plus Jakarta Sans",sans-serif'

/* Renders real photo when available, initials circle as fallback */
function MemberPhoto({ m, size, borderRadius='50%' }) {
  const wrap = {
    width:size, height:size, borderRadius, overflow:'hidden', flexShrink:0, position:'relative',
    border:'2.5px solid rgba(255,255,255,0.15)',
    boxShadow:`0 0 50px ${m.glowColor}45, 0 12px 40px rgba(0,0,0,0.55)`,
  }
  if (m.photo) return (
    <div style={wrap}>
      <img src={m.photo} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
    </div>
  )
  return (
    <div style={{ ...wrap, background:m.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)' }} />
      <span style={{ fontFamily:jak, fontWeight:900, fontSize:Math.round(size/3), color:'#fff', letterSpacing:'-0.02em', position:'relative', zIndex:1 }}>{m.initials}</span>
    </div>
  )
}

function SocialRow({ member }) {
  return (
    <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
      {[{ Icon:Github, href:member.github }, { Icon:Linkedin, href:member.linkedin }, { Icon:Globe, href:member.github }].map(({ Icon, href }, idx) => (
        <a key={idx} href={href||'#'} style={{ width:36, height:36, borderRadius:11, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(160,180,210,0.65)', transition:'all 0.2s ease' }}
          onMouseEnter={e=>{ e.currentTarget.style.background=`${member.glowColor}15`; e.currentTarget.style.color=member.glowColor; e.currentTarget.style.borderColor=`${member.glowColor}35` }}
          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(160,180,210,0.65)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}>
          <Icon style={{ width:15, height:15 }} />
        </a>
      ))}
    </div>
  )
}

/* V0 — "Plasma Banner": radial-glow header + giant centered initials */
function MemberV0({ member }) {
  return (
    <div style={{ height:'100%', minHeight:480, display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${member.glowColor}1e`, borderRadius:22, overflow:'hidden',
      boxShadow:`0 24px 64px rgba(0,0,0,0.6),0 0 40px ${member.glowColor}08`,
      transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}42`; e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.boxShadow=`0 40px 90px rgba(0,0,0,0.7),0 0 70px ${member.glowColor}18` }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}1e`; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 24px 64px rgba(0,0,0,0.6),0 0 40px ${member.glowColor}08` }}>
      {/* Top gradient accent */}
      <div style={{ height:3, background:member.gradient, flexShrink:0 }} />
      {/* Visual banner */}
      <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', inset:0, background:member.gradient, opacity:0.16 }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${member.glowColor}09 1px,transparent 1px),linear-gradient(90deg,${member.glowColor}09 1px,transparent 1px)`, backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', top:-30, left:'50%', transform:'translateX(-50%)', width:340, height:240, background:`radial-gradient(circle,${member.glowColor}2e 0%,transparent 65%)`, filter:'blur(36px)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
        {/* Large photo / initials circle */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-12, borderRadius:'50%', background:`radial-gradient(circle,${member.glowColor}32 0%,transparent 70%)`, filter:'blur(14px)' }} />
            <MemberPhoto m={member} size={104} borderRadius='50%' />
            <div style={{ position:'absolute', bottom:5, right:5, width:17, height:17, borderRadius:'50%', background:'#4ade80', border:'2.5px solid #060618', boxShadow:'0 0 12px #4ade80' }} />
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'22px 24px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:19, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:5, lineHeight:1.2 }}>{member.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', background:member.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:4 }}>{member.position}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.6)' }}>{member.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${member.glowColor}22,transparent)`, margin:'2px 0 16px' }} />
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:20 }}>
          {member.tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, fontFamily:jak, letterSpacing:'0.06em', background:`${member.glowColor}0f`, border:`1px solid ${member.glowColor}28`, color:member.glowColor, padding:'4px 10px', borderRadius:100 }}>{t}</span>)}
        </div>
        <div style={{ marginTop:'auto' }}><SocialRow member={member} /></div>
      </div>
    </div>
  )
}

/* V1 — "Neural Blueprint": angled header slash + technical grid lines + initials in square */
function MemberV1({ member }) {
  return (
    <div style={{ height:'100%', minHeight:480, display:'flex', flexDirection:'column',
      background:'rgba(4,4,16,0.99)',
      border:`1px solid ${member.glowColor}18`, borderRadius:22, overflow:'hidden',
      boxShadow:`0 24px 64px rgba(0,0,0,0.6)`,
      transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}40`; e.currentTarget.style.transform='translateY(-7px)' }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}18`; e.currentTarget.style.transform='translateY(0)' }}>
      {/* Visual banner — diagonal slash design */}
      <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0 }}>
        {/* Left gradient slab */}
        <div style={{ position:'absolute', inset:0, background:member.gradient }} />
        {/* Dark overlay diagonal */}
        <div style={{ position:'absolute', inset:0, background:'rgba(4,4,16,0.88)', clipPath:'polygon(46% 0,100% 0,100% 100%,36% 100%)' }} />
        {/* Blueprint grid on dark side */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`, backgroundSize:'24px 24px', clipPath:'polygon(46% 0,100% 0,100% 100%,36% 100%)' }} />
        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:70, background:'linear-gradient(to top,rgba(4,4,16,0.99),transparent)' }} />
        {/* Scan lines on gradient */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 5px,rgba(0,0,0,0.1) 5px,rgba(0,0,0,0.1) 6px)', clipPath:'polygon(0 0,46% 0,36% 100%,0 100%)' }} />
        {/* Photo / initials in left slab */}
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'42%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {member.photo
            ? <div style={{ width:80, height:80, borderRadius:'50%', overflow:'hidden', border:'2.5px solid rgba(255,255,255,0.18)', boxShadow:`0 0 32px ${member.glowColor}40` }}>
                <img src={member.photo} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
              </div>
            : <span style={{ fontFamily:jak, fontWeight:900, fontSize:56, color:'rgba(0,0,0,0.42)', letterSpacing:'-0.04em' }}>{member.initials}</span>
          }
        </div>
        {/* Role text on right */}
        <div style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)', textAlign:'right' }}>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:member.glowColor, marginBottom:6 }}>{member.position}</div>
          <div style={{ height:2, width:28, background:member.glowColor, borderRadius:1, marginLeft:'auto', opacity:0.6 }} />
        </div>
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:member.gradient }} />
      </div>
      {/* Content */}
      <div style={{ padding:'20px 24px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:19, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:4 }}>{member.name}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.55)' }}>{member.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,${member.glowColor}20,transparent)`, marginBottom:14 }} />
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
          {member.tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, fontFamily:jak, letterSpacing:'0.06em', background:`${member.glowColor}0f`, border:`1px solid ${member.glowColor}28`, color:member.glowColor, padding:'4px 10px', borderRadius:100 }}>{t}</span>)}
        </div>
        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'rgba(140,160,190,0.5)', fontFamily:jak }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 6px #4ade80' }} /> Online
          </div>
          <SocialRow member={member} />
        </div>
      </div>
    </div>
  )
}

/* V2 — "Iris Scan": concentric circle radar in banner, centered */
function MemberV2({ member }) {
  return (
    <div style={{ height:'100%', minHeight:480, display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(5,5,20,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${member.glowColor}18`, borderRadius:22, overflow:'hidden',
      boxShadow:`0 24px 64px rgba(0,0,0,0.6)`,
      transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}42`; e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.boxShadow=`0 40px 90px rgba(0,0,0,0.7),0 0 60px ${member.glowColor}14` }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}18`; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 24px 64px rgba(0,0,0,0.6)` }}>
      {/* Visual banner — radar rings */}
      <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0, background:`radial-gradient(ellipse at 50% 60%, ${member.glowColor}14 0%, transparent 65%)` }}>
        {/* Concentric rings */}
        {[90,72,54,36,18].map((r,idx) => (
          <div key={idx} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:r*2, height:r*2, borderRadius:'50%', border:`1px solid ${member.glowColor}${['22','1c','16','10','0a'][idx]}` }} />
        ))}
        {/* Crosshair lines */}
        <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${member.glowColor}18,transparent)`, transform:'translateY(-50%)' }} />
        <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, background:`linear-gradient(180deg,transparent,${member.glowColor}18,transparent)`, transform:'translateX(-50%)' }} />
        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(5,5,20,0.99),transparent)' }} />
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:member.gradient }} />
        {/* Center photo / initials */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'relative' }}>
            <MemberPhoto m={member} size={86} borderRadius='50%' />
            <div style={{ position:'absolute', bottom:0, right:0, width:14, height:14, borderRadius:'50%', background:'#4ade80', border:'2px solid #050514', boxShadow:'0 0 10px #4ade80' }} />
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'20px 24px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:19, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:5 }}>{member.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', background:member.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:4 }}>{member.position}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.6)' }}>{member.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${member.glowColor}22,transparent)`, margin:'2px 0 16px' }} />
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:20 }}>
          {member.tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, fontFamily:jak, letterSpacing:'0.06em', background:`${member.glowColor}0f`, border:`1px solid ${member.glowColor}28`, color:member.glowColor, padding:'4px 10px', borderRadius:100 }}>{t}</span>)}
        </div>
        <div style={{ marginTop:'auto' }}><SocialRow member={member} /></div>
      </div>
    </div>
  )
}

/* V3 — "Side-Rail Hologram": thick glowing left rail + horizontal bands */
function MemberV3({ member }) {
  return (
    <div style={{ height:'100%', minHeight:480, display:'flex',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${member.glowColor}18`, borderRadius:22, overflow:'hidden',
      boxShadow:`0 24px 64px rgba(0,0,0,0.6)`,
      transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}40`; e.currentTarget.style.transform='translateY(-7px)' }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}18`; e.currentTarget.style.transform='translateY(0)' }}>
      {/* Left color rail */}
      <div style={{ width:6, flexShrink:0, background:member.gradient, boxShadow:`4px 0 20px ${member.glowColor}30` }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Visual banner in right section */}
        <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0 }}>
          <div style={{ position:'absolute', inset:0, background:member.gradient, opacity:0.12 }} />
          {/* Horizontal bands */}
          {[0,1,2,3].map(idx => <div key={idx} style={{ position:'absolute', left:0, right:0, top:`${idx*26}%`, height:'12%', background:`linear-gradient(90deg,${member.glowColor}06,${member.glowColor}12,${member.glowColor}06)` }} />)}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
          {/* Large photo / initials */}
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'relative' }}>
              {member.photo
                ? <div style={{ width:108, height:108, borderRadius:24, overflow:'hidden', border:'2px solid rgba(255,255,255,0.15)', boxShadow:`0 0 50px ${member.glowColor}45`, transform:'rotate(-4deg)' }}>
                    <img src={member.photo} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', transform:'rotate(4deg) scale(1.12)' }} />
                  </div>
                : <div style={{ width:108, height:108, borderRadius:24, background:member.gradient, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid rgba(255,255,255,0.14)', boxShadow:`0 0 50px ${member.glowColor}45`, transform:'rotate(-4deg)' }}>
                    <div style={{ position:'absolute', inset:0, borderRadius:22, background:'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)' }} />
                    <span style={{ fontFamily:jak, fontWeight:900, fontSize:36, color:'#fff', letterSpacing:'-0.02em', transform:'rotate(4deg)' }}>{member.initials}</span>
                  </div>
              }
              <div style={{ position:'absolute', bottom:2, right:2, width:16, height:16, borderRadius:'50%', background:'#4ade80', border:'2.5px solid #060618', boxShadow:'0 0 10px #4ade80' }} />
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:'18px 22px 24px', display:'flex', flexDirection:'column', flex:1 }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:18, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:4 }}>{member.name}</div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', background:member.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:3 }}>{member.position}</div>
            <div style={{ fontFamily:jak, fontSize:12, color:'rgba(140,160,190,0.6)' }}>{member.specialty}</div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
            {member.tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, fontFamily:jak, letterSpacing:'0.06em', background:`${member.glowColor}0f`, border:`1px solid ${member.glowColor}28`, color:member.glowColor, padding:'4px 10px', borderRadius:100 }}>{t}</span>)}
          </div>
          <div style={{ marginTop:'auto' }}><SocialRow member={member} /></div>
        </div>
      </div>
    </div>
  )
}

/* V4 — "Neon Architecture": HUD corner brackets + watermark number + large initials badge */
function MemberV4({ member, i }) {
  const br = { position:'absolute', width:20, height:20 }
  return (
    <div style={{ height:'100%', minHeight:480, display:'flex', flexDirection:'column',
      background:'rgba(3,3,14,0.99)',
      border:`1px solid ${member.glowColor}1c`, borderRadius:18, overflow:'hidden', position:'relative',
      boxShadow:`0 24px 64px rgba(0,0,0,0.65)`,
      transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}42`; e.currentTarget.style.transform='translateY(-7px)'; e.currentTarget.style.boxShadow=`0 40px 90px rgba(0,0,0,0.75),0 0 60px ${member.glowColor}16` }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${member.glowColor}1c`; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 24px 64px rgba(0,0,0,0.65)` }}>
      {/* Visual banner */}
      <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0, borderBottom:`1px solid ${member.glowColor}14` }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 60%, ${member.glowColor}18 0%, transparent 65%)` }} />
        {/* Watermark index number */}
        <div style={{ position:'absolute', right:16, bottom:-10, fontFamily:jak, fontWeight:900, fontSize:100, color:`${member.glowColor}09`, lineHeight:1, pointerEvents:'none', userSelect:'none' }}>{String(i+1).padStart(2,'0')}</div>
        {/* HUD corner brackets */}
        <div style={{ ...br, top:14, left:14, borderTop:`2px solid ${member.glowColor}55`, borderLeft:`2px solid ${member.glowColor}55` }} />
        <div style={{ ...br, top:14, right:14, borderTop:`2px solid ${member.glowColor}55`, borderRight:`2px solid ${member.glowColor}55` }} />
        <div style={{ ...br, bottom:14, left:14, borderBottom:`2px solid ${member.glowColor}55`, borderLeft:`2px solid ${member.glowColor}55` }} />
        <div style={{ ...br, bottom:14, right:14, borderBottom:`2px solid ${member.glowColor}55`, borderRight:`2px solid ${member.glowColor}55` }} />
        {/* Center content */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
          <MemberPhoto m={member} size={96} borderRadius='50%' />
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:9.5, letterSpacing:'0.22em', textTransform:'uppercase', color:`${member.glowColor}80` }}>RESEARCHER</div>
        </div>
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:member.gradient }} />
        {/* Status */}
        <div style={{ position:'absolute', top:18, left:18, display:'flex', alignItems:'center', gap:5, fontSize:9.5, color:`${member.glowColor}80`, fontFamily:jak, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} /> ONLINE
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'20px 24px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:19, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:5 }}>{member.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', background:member.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:3 }}>{member.position}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.6)' }}>{member.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${member.glowColor}22,transparent)`, margin:'2px 0 16px' }} />
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:20 }}>
          {member.tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, fontFamily:jak, letterSpacing:'0.06em', background:`${member.glowColor}0f`, border:`1px solid ${member.glowColor}28`, color:member.glowColor, padding:'4px 10px', borderRadius:100 }}>{t}</span>)}
        </div>
        <div style={{ marginTop:'auto' }}><SocialRow member={member} /></div>
      </div>
    </div>
  )
}

const MEMBER_HOME_VARIANTS = [MemberV0, MemberV1, MemberV2, MemberV3, MemberV4]

function CoreMemberCard({ member, i }) {
  const V = MEMBER_HOME_VARIANTS[i % MEMBER_HOME_VARIANTS.length]
  return (
    <motion.div
      initial={{ opacity:0, y:40, scale:0.95 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:true }}
      transition={{ delay: i * 0.07, duration: 0.65, ease: 'easeOut' }}
      style={{ height:'100%' }}
    >
      <V member={member} i={i} />
    </motion.div>
  )
}

/* ─── HOME ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 600], [0, 120])
  const [events, setEvents] = useState([])

  /* ── Global mouse parallax ── */
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const sp   = { stiffness: 55, damping: 16, mass: 0.9 }
  const sx   = useSpring(rawX, sp)
  const sy   = useSpring(rawY, sp)

  // Hero aurora blobs — very strong, each layer moves opposite/different
  const b1x = useTransform(sx, [0,1], [-70, 70])
  const b1y = useTransform(sy, [0,1], [-50, 50])
  const b2x = useTransform(sx, [0,1], [55, -55])
  const b2y = useTransform(sy, [0,1], [40, -40])
  const b3x = useTransform(sx, [0,1], [-90, 90])
  const b3y = useTransform(sy, [0,1], [-65, 65])
  const dotX= useTransform(sx, [0,1], [-14, 14])
  const dotY= useTransform(sy, [0,1], [-10, 10])

  // CTA orbs — even stronger
  const cX1 = useTransform(sx, [0,1], [-80, 80])
  const cY1 = useTransform(sy, [0,1], [-60, 60])
  const cX2 = useTransform(sx, [0,1], [65, -65])
  const cY2 = useTransform(sy, [0,1], [50, -50])
  const cX3 = useTransform(sx, [0,1], [-45, 45])
  const cY3 = useTransform(sy, [0,1], [-35, 35])
  const cBgX= useTransform(sx, [0,1], [-35, 35])
  const cBgY= useTransform(sy, [0,1], [-25, 25])
  const cX4 = useTransform(sx, [0,1], [-110, 110])
  const cY4 = useTransform(sy, [0,1], [-80,  80])
  const cX5 = useTransform(sx, [0,1], [ 90, -90])
  const cY5 = useTransform(sy, [0,1], [ 70, -70])

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX / window.innerWidth)
      rawY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  useEffect(() => {
    axios.get('/api/events').then(r => setEvents((r.data||[]).slice(0,3))).catch(() => setEvents(FALLBACK_EVENTS))
  }, [])

  const displayEvents = events.length ? events : FALLBACK_EVENTS

  return (
    <div style={{ background:'#02020e', overflow:'hidden' }}>

      {/* Ambient floating GRID marks — drift around the page corners as you scroll */}
      <FloatingLogos />

      {/* ════════════════════════  HERO  ════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Deep radial bg */}
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 110% 80% at 65% -5%, rgba(0,82,204,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 55% at 90% 90%, rgba(109,40,217,0.13) 0%, transparent 65%), #02020e' }} />

        {/* Dot grid — parallax */}
        <motion.div style={{ y: yBg, x: dotX, translateY: dotY }} className="absolute inset-0 grid-bg opacity-30" />

        {/* 3-D Particle network */}
        <ParticleNetwork opacity={0.55} />

        {/* Aurora blobs — each on its own parallax layer */}
        <motion.div style={{ x: b1x, y: b1y, position:'absolute', top:'5%', right:'2%', width:640, height:640, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,82,204,0.18) 0%,transparent 70%)', filter:'blur(100px)', animation:'aurora1 22s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
        <motion.div style={{ x: b2x, y: b2y, position:'absolute', bottom:'10%', right:'5%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(109,40,217,0.13) 0%,transparent 70%)', filter:'blur(80px)', animation:'aurora2 28s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
        <motion.div style={{ x: b3x, y: b3y, position:'absolute', top:'40%', left:'2%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.09) 0%,transparent 70%)', filter:'blur(90px)', animation:'aurora3 18s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />

        {/* ── Hero text ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center">

          {/* ── Text content ── */}
          <div className="w-full text-center">

            {/* ── GRID Logo mark — compact, premium, centered ── */}
            <motion.div
              initial={{ opacity:0, scale:0.78, y:16 }}
              animate={{ opacity:1, scale:1, y:0 }}
              transition={{ duration:1.05, ease:[0.22,1,0.36,1] }}
              style={{ display:'flex', justifyContent:'center', marginBottom:8, marginTop:0 }}
            >
              {/* Outer ambient ring */}
              <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                <motion.div
                  animate={{ rotate:360 }}
                  transition={{ duration:32, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', width:276, height:276, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.08)', borderTopColor:'rgba(0,212,255,0.22)' }}
                />
                <motion.div
                  animate={{ rotate:-360 }}
                  transition={{ duration:48, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', width:252, height:252, borderRadius:'50%', border:'1px dashed rgba(123,47,255,0.06)', borderRightColor:'rgba(123,47,255,0.18)' }}
                />
                <GRIDLogoHero size={220} />
              </div>
            </motion.div>

            {/* Status badge */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.32, duration:0.5 }} className="mb-6 flex justify-center">
              <span className="tag">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#4ade80', boxShadow:'0 0 6px #4ade80' }} />
                12,000 ML researchers online now
              </span>
            </motion.div>

            {/* H1 */}
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.75 }}>
              <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.04em', fontSize:'clamp(2.2rem,4.8vw,4rem)', color:'#f0f6ff', marginBottom:6 }}>
                Where ML minds
              </h1>
              <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.04em', fontSize:'clamp(2.2rem,4.8vw,4rem)', marginBottom:24 }}>
                <MorphingWord />
              </h1>
            </motion.div>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.56, duration:0.65 }}
              className="max-w-xl mb-10 text-base md:text-lg leading-relaxed mx-auto"
              style={{ color:'rgba(170,186,210,0.82)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
              The world's most focused Machine Learning community —{' '}
              <strong style={{ color:'#e8eef8', fontWeight:700 }}>researchers, engineers, and builders</strong>{' '}
              collaborating on models, papers, datasets, and production ML systems.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.68, duration:0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <MagneticButton variant="primary" className="gap-2 px-8 py-4 text-sm" onClick={() => window.location.href='/register'}>
                Join GRID free <ArrowRight style={{ width:16,height:16 }} />
              </MagneticButton>
              <MagneticButton variant="secondary" className="gap-2 px-8 py-4 text-sm btn-outline" onClick={() => window.location.href='/members'}>
                Meet the researchers
              </MagneticButton>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.82, duration:0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {[
                { v:'12k+',  l:'ML Researchers' },
                { v:'900+',  l:'ML Projects' },
                { v:'2.4k+', l:'Papers Discussed' },
                { v:'180+',  l:'Research Groups' },
              ].map(({ v, l }) => (
                <div key={l} className="stat-card py-3">
                  <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:20, letterSpacing:'-0.03em', marginBottom:2 }} className="text-gradient">{v}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(160,178,205,0.75)', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2, duration:0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span style={{ fontSize:9, color:'rgba(140,160,190,0.55)', letterSpacing:'0.35em', textTransform:'uppercase', fontFamily:'Inter,sans-serif' }}>scroll</span>
          <motion.div animate={{ y:[0,7,0] }} transition={{ repeat:Infinity, duration:1.8 }}
            style={{ width:1, height:38, background:'linear-gradient(to bottom,rgba(0,212,255,0.55),transparent)', borderRadius:1 }} />
        </motion.div>
      </section>

      {/* ════════════  VALUE PROPS  ════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(0,82,204,0.08) 0%, transparent 65%)' }} />
        <div className="grid-bg absolute inset-0 opacity-15" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Why researchers stay</SectionLabel>
            <motion.h2 {...iv} className="section-title text-3xl md:text-[2.2rem] text-white">
              Three principles that <span className="text-gradient">shape everything here</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connecting line across desktop columns */}
            <div className="hidden md:block absolute top-[38px] left-[16.6%] right-[16.6%] pointer-events-none" style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.18),rgba(0,212,255,0.18),transparent)' }} />

            {[
              { icon:Microscope, n:'01', title:'Research First',      b:'Every conversation is grounded in rigorous ML — from theory to deployment, papers to benchmarks.', accent:'#00d4ff' },
              { icon:Share2,     n:'02', title:'Build in Public',     b:'Share experiments, training logs, model weights, and real failure modes with peers who get it.', accent:'#7b2fff' },
              { icon:Rocket,     n:'03', title:'Accelerate Together', b:'Progress faster with code reviews, paper reading groups, and direct access to ML specialists.', accent:'#4ade80' },
            ].map(({ icon:Icon, n, title, b, accent }, i) => (
              <motion.div key={title} initial={{ opacity:0, y:26 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.6, ease:'easeOut' }}>
                <div className="premium-card rounded-2xl p-7 h-full relative" style={{ textAlign:'left' }}>
                  <span style={{
                    position:'absolute', top:18, right:22, fontFamily:'"Plus Jakarta Sans",sans-serif',
                    fontWeight:800, fontSize:34, letterSpacing:'-0.03em', color:'rgba(255,255,255,0.04)',
                  }}>{n}</span>

                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background:`linear-gradient(135deg, ${accent}22, ${accent}0a)`, border:`1px solid ${accent}35`, boxShadow:`0 0 24px ${accent}18` }}>
                    <Icon style={{ width:20, height:20, color:accent }} />
                  </div>

                  <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:17, color:'#f0f6ff', marginBottom:10, letterSpacing:'-0.01em' }}>{title}</h3>
                  <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13.5, color:'rgba(150,168,195,0.78)', lineHeight:1.7 }}>{b}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
              Built for <span className="text-gradient">serious ML practitioners</span>
            </motion.h2>
            <motion.p {...iv} className="text-sm max-w-md mx-auto mt-3" style={{ color:'rgba(140,160,190,0.7)', lineHeight:1.7 }}>
              Every tool you need to research, experiment, collaborate, and ship ML — in one place.
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
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,52,204,0.1) 0%, transparent 70%), #02020e', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-20%', left:'10%', width:400, height:400, borderRadius:'50%', background:'rgba(0,212,255,0.05)', filter:'blur(100px)', animation:'aurora1 24s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20%', right:'10%', width:350, height:350, borderRadius:'50%', background:'rgba(124,58,237,0.06)', filter:'blur(90px)', animation:'aurora2 20s ease-in-out infinite', pointerEvents:'none' }} />
        <div className="grid-line-bg absolute inset-0 opacity-15" />

        <div className="relative max-w-5xl mx-auto text-center">
          <SectionLabel>By the numbers</SectionLabel>
          <motion.h2 {...iv} className="section-title text-3xl md:text-[2.3rem] text-white mb-16">
            An ML community that <span className="text-gradient">speaks for itself</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value:12480, suffix:'+', label:'ML Researchers',     color:'#00d4ff' },
              { value:924,   suffix:'+', label:'ML Projects',        color:'#7b2fff' },
              { value:2400,  suffix:'+', label:'Papers Discussed',   color:'#0088ff' },
              { value:180,   suffix:'+', label:'Research Groups',    color:'#4ade80' },
            ].map(({ value, suffix, label, color }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.6 }}
                className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl"
                style={{ background:'rgba(6,6,20,0.7)', border:`1px solid ${color}1a`, backdropFilter:'blur(20px)' }}>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.04em', lineHeight:1 }}>
                  <GlowCounter value={value} suffix={suffix} color={color} duration={2400} />
                </div>
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

      {/* ════════════  CORE MEMBERS — 9 ULTRA-PREMIUM BOXES ════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:800, height:400, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(0,102,255,0.07) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Meet the team</SectionLabel>
            <motion.h2 {...iv} className="section-title text-3xl md:text-[2.4rem] text-white">
              The faces <span className="text-gradient">behind the community.</span>
            </motion.h2>
            <motion.p {...iv} className="text-sm max-w-xl mx-auto mt-4" style={{ color:'rgba(140,160,190,0.7)', lineHeight:1.75 }}>
              Seven ML researchers and engineers who decided the community they wanted
              to be part of didn't exist yet — so they built it from scratch.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_MEMBERS.map((member, i) => (
              <CoreMemberCard key={member.id} member={member} i={i} />
            ))}
          </div>

          <motion.div {...iv} className="text-center mt-12">
            <Link to="/members" className="btn-outline inline-flex items-center gap-2">
              See all ML researchers <ChevronRight style={{ width:16,height:16 }} />
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
              ML events worth <span className="text-gradient">showing up for</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayEvents.map((e, i) => <EventCard key={e.id} event={e} i={i} />)}
          </div>
          <motion.div {...iv} className="text-center mt-10">
            <Link to="/events" className="btn-outline inline-flex items-center gap-2">
              Browse all ML events <ChevronRight style={{ width:16,height:16 }} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ════════════  FINAL CTA  ════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Static base bg */}
        <div className="absolute inset-0" style={{ background:'#02020e', zIndex:-1 }} />

        {/* Parallax bg glow — shifts slowly */}
        <motion.div style={{ x: cBgX, y: cBgY, position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
          background:'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,52,204,0.15) 0%, transparent 65%)' }} />

        {/* Orb 1 — top-left, blue, strong left */}
        <motion.div style={{ x: cX1, y: cY1, position:'absolute', top:'5%', left:'5%', width:460, height:460,
          borderRadius:'50%', background:'radial-gradient(circle,rgba(0,102,255,0.20) 0%,transparent 70%)',
          filter:'blur(85px)', pointerEvents:'none', zIndex:0 }} />

        {/* Orb 2 — bottom-right, purple, moves right */}
        <motion.div style={{ x: cX2, y: cY2, position:'absolute', bottom:'5%', right:'5%', width:520, height:520,
          borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)',
          filter:'blur(90px)', pointerEvents:'none', zIndex:0 }} />

        {/* Orb 3 — center, cyan, slow */}
        <motion.div style={{ x: cX3, y: cY3, position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)', width:380, height:380,
          borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.12) 0%,transparent 70%)',
          filter:'blur(75px)', pointerEvents:'none', zIndex:0 }} />

        {/* Orb 4 — top-right accent, fastest */}
        <motion.div style={{ x: cX4, y: cY4, position:'absolute', top:'15%', right:'12%', width:200, height:200,
          borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.26) 0%,transparent 65%)',
          filter:'blur(42px)', pointerEvents:'none', zIndex:0 }} />

        {/* Orb 5 — bottom-left accent, fastest opposite */}
        <motion.div style={{ x: cX5, y: cY5, position:'absolute', bottom:'18%', left:'10%', width:180, height:180,
          borderRadius:'50%', background:'radial-gradient(circle,rgba(0,82,204,0.28) 0%,transparent 65%)',
          filter:'blur(38px)', pointerEvents:'none', zIndex:0 }} />

        <ParticleNetwork opacity={0.35} />
        <div className="grid-line-bg absolute inset-0 opacity-12" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, scale:0.94 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.7, ease:'easeOut' }}>
            <span className="tag mb-6 inline-flex">
              <Star style={{ width:11,height:11 }} />
              Free forever. No credit card.
            </span>
            <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,4.5vw,3.2rem)', letterSpacing:'-0.04em', lineHeight:1.1, color:'#f0f6ff', marginBottom:20 }}>
              Ready to accelerate your ML journey?
            </h2>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(170,186,210,0.78)', lineHeight:1.65, marginBottom:40, maxWidth:520, margin:'0 auto 40px' }}>
              Join 12,000+ ML researchers and engineers who found their collaborators,
              reviewers, and breakthrough ideas inside GRID.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton variant="primary" className="gap-2 px-8 py-4 text-base" onClick={() => window.location.href='/register'}>
                Join the ML community <ArrowRight style={{ width:18,height:18 }} />
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
