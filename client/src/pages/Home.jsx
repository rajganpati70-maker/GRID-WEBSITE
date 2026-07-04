import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight, ChevronRight, Star,
  Brain, Database, GitBranch, Layers, Cpu, BarChart2,
  BookOpen, FlaskConical, Network, Github, Linkedin, Globe,
} from 'lucide-react'
import axios from 'axios'
import GRIDLogoHero      from '../components/GRIDLogoHero'
import GRIDHeroBackground from '../components/GRIDHeroBackground'
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

/* ─── Event card (minimal, for homepage) ─────────────────────────────────── */
const EVT_S = {
  hackathon:  { bar:'linear-gradient(90deg,#00d4ff,#0066ff)', badge:{bg:'rgba(0,212,255,0.1)',bd:'rgba(0,212,255,0.3)',tx:'#00d4ff'} },
  workshop:   { bar:'linear-gradient(90deg,#7b2fff,#00d4ff)', badge:{bg:'rgba(123,47,255,0.1)',bd:'rgba(123,47,255,0.3)',tx:'#a78bfa'} },
  conference: { bar:'linear-gradient(90deg,#0066ff,#7b2fff)', badge:{bg:'rgba(0,102,255,0.1)',bd:'rgba(0,102,255,0.3)',tx:'#60a5fa'} },
  default:    { bar:'linear-gradient(90deg,#00d4ff,#0066ff)', badge:{bg:'rgba(0,212,255,0.07)',bd:'rgba(0,212,255,0.2)',tx:'#00d4ff'} },
}
function EventCard({ event, i }) {
  const s = EVT_S[event.type?.toLowerCase()] || EVT_S.default
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'
  return (
    <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.55 }}>
      <HolographicCard intensity={0.8}>
        <Link to="/events" className="event-card flex flex-col h-full">
          <div style={{ height:3, background:s.bar, flexShrink:0 }} />
          <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ background:'linear-gradient(180deg,rgba(0,212,255,0.04) 0%,transparent 100%)', borderBottom:'1px solid rgba(0,212,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ background:s.badge.bg, border:`1px solid ${s.badge.bd}`, color:s.badge.tx, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100 }}>{event.type||'Event'}</span>
              <span style={{ fontSize:11, color:'#4b5563' }}>{dateStr}</span>
            </div>
            <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#e8eef8', lineHeight:1.35 }}>{event.title}</h3>
          </div>
          <div className="px-5 py-4 flex flex-col flex-1">
            {event.description && <p className="line-clamp-2 flex-1 mb-3" style={{ fontSize:13, color:'rgba(140,160,190,0.75)', lineHeight:1.6 }}>{event.description}</p>}
            {event.location && <div className="flex items-center gap-1.5 mt-auto" style={{ fontSize:11.5, color:'#4b5563' }}>📍 {event.location}</div>}
          </div>
        </Link>
      </HolographicCard>
    </motion.div>
  )
}

/* ─── 9 Core Members ─────────────────────────────────────────────────────── */
const CORE_MEMBERS = [
  {
    id: 1,
    name: 'Aryan Sharma',
    position: 'Founder & CEO',
    specialty: 'Deep Learning Research',
    initials: 'AS',
    gradient: 'linear-gradient(135deg, #0052cc 0%, #00d4ff 100%)',
    glowColor: '#00d4ff',
    tags: ['Transformers', 'LLMs', 'Research'],
    github: '#', linkedin: '#',
  },
  {
    id: 2,
    name: 'Priya Nair',
    position: 'Co-founder & CTO',
    specialty: 'MLOps & Infrastructure',
    initials: 'PN',
    gradient: 'linear-gradient(135deg, #7b2fff 0%, #00d4ff 100%)',
    glowColor: '#7b2fff',
    tags: ['MLOps', 'Distributed Training', 'Infra'],
    github: '#', linkedin: '#',
  },
  {
    id: 3,
    name: 'Rahul Gupta',
    position: 'Head of Research',
    specialty: 'NLP & Transformers',
    initials: 'RG',
    gradient: 'linear-gradient(135deg, #0066ff 0%, #7b2fff 100%)',
    glowColor: '#0066ff',
    tags: ['NLP', 'BERT', 'Fine-tuning'],
    github: '#', linkedin: '#',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    position: 'Computer Vision Lead',
    specialty: 'CNNs & Generative AI',
    initials: 'SP',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #7b2fff 100%)',
    glowColor: '#ec4899',
    tags: ['CNNs', 'Diffusion', 'GANs'],
    github: '#', linkedin: '#',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    position: 'RL Research Lead',
    specialty: 'Reinforcement Learning',
    initials: 'VS',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #4ade80 100%)',
    glowColor: '#4ade80',
    tags: ['RL', 'Policy Gradient', 'RLHF'],
    github: '#', linkedin: '#',
  },
  {
    id: 6,
    name: 'Ananya Krishnan',
    position: 'Data Science Lead',
    specialty: 'Statistical ML & Analytics',
    initials: 'AK',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    glowColor: '#f59e0b',
    tags: ['Statistics', 'XGBoost', 'Feature Eng.'],
    github: '#', linkedin: '#',
  },
  {
    id: 7,
    name: 'Dev Malhotra',
    position: 'Open Source Lead',
    specialty: 'ML Frameworks & Tools',
    initials: 'DM',
    gradient: 'linear-gradient(135deg, #0052cc 0%, #4ade80 100%)',
    glowColor: '#0052cc',
    tags: ['PyTorch', 'JAX', 'Open Source'],
    github: '#', linkedin: '#',
  },
  {
    id: 8,
    name: 'Riya Joshi',
    position: 'AI Safety Lead',
    specialty: 'Alignment & Responsible AI',
    initials: 'RJ',
    gradient: 'linear-gradient(135deg, #7b2fff 0%, #f59e0b 100%)',
    glowColor: '#a78bfa',
    tags: ['AI Safety', 'Alignment', 'Ethics'],
    github: '#', linkedin: '#',
  },
  {
    id: 9,
    name: 'Karan Mehta',
    position: 'Education Lead',
    specialty: 'ML Curriculum & Teaching',
    initials: 'KM',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    glowColor: '#00d4ff',
    tags: ['Curriculum', 'Mentorship', 'Research'],
    github: '#', linkedin: '#',
  },
]

function CoreMemberCard({ member, i }) {
  return (
    <motion.div
      initial={{ opacity:0, y:40, scale:0.95 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:true }}
      transition={{ delay: i * 0.07, duration: 0.65, ease: 'easeOut' }}
      whileHover={{ y: -6, transition:{ duration:0.3 } }}
      style={{ height:'100%' }}
    >
      <div style={{
        height: '100%',
        background: 'linear-gradient(160deg, rgba(6,6,24,0.98) 0%, rgba(4,4,18,0.96) 100%)',
        border: `1px solid ${member.glowColor}22`,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(32px)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.025) inset, 0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${member.glowColor}08`,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${member.glowColor}44`
        e.currentTarget.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.7), 0 0 60px ${member.glowColor}18`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${member.glowColor}22`
        e.currentTarget.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.025) inset, 0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${member.glowColor}08`
      }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: member.gradient, flexShrink: 0 }} />

        {/* Subtle corner glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 140, height: 140,
          borderRadius: '50%', background: `radial-gradient(circle, ${member.glowColor}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ padding: '28px 24px 24px', display:'flex', flexDirection:'column', flex:1 }}>

          {/* Avatar */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom: 22 }}>
            <div style={{ position: 'relative' }}>
              {/* Outer glow ring */}
              <div style={{
                position: 'absolute', inset: -3,
                borderRadius: '50%',
                background: member.gradient,
                opacity: 0.35,
                filter: 'blur(6px)',
              }} />
              {/* Avatar circle */}
              <div style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: member.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: `0 0 0 2px rgba(255,255,255,0.08), 0 8px 32px ${member.glowColor}30`,
                border: `2px solid rgba(255,255,255,0.12)`,
              }}>
                {/* Shimmer overlay */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }} />
                <span style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  position: 'relative',
                  zIndex: 1,
                }}>{member.initials}</span>
              </div>
              {/* Status dot */}
              <div style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 14, height: 14, borderRadius: '50%',
                background: '#4ade80',
                border: '2px solid #02020e',
                boxShadow: '0 0 8px #4ade80',
              }} />
            </div>
          </div>

          {/* Name & Position */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              fontSize: 17,
              color: '#f0f6ff',
              letterSpacing: '-0.02em',
              marginBottom: 5,
              lineHeight: 1.2,
            }}>{member.name}</div>
            <div style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              fontSize: 11.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: member.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 4,
            }}>{member.position}</div>
            <div style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 12,
              color: 'rgba(140,160,190,0.65)',
              fontWeight: 500,
            }}>{member.specialty}</div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${member.glowColor}20, transparent)`,
            marginBottom: 14,
          }} />

          {/* Tags */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom: 18 }}>
            {member.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10,
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                letterSpacing: '0.06em',
                background: `${member.glowColor}0f`,
                border: `1px solid ${member.glowColor}25`,
                color: member.glowColor,
                padding: '3px 9px',
                borderRadius: 100,
              }}>{tag}</span>
            ))}
          </div>

          {/* Social links */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:'auto' }}>
            <a href={member.github} aria-label={`${member.name} GitHub profile`} style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems:'center', justifyContent:'center',
              color: 'rgba(160,180,210,0.7)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#e8eef8' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(160,180,210,0.7)' }}>
              <Github style={{ width:14, height:14 }} />
            </a>
            <a href={member.linkedin} aria-label={`${member.name} LinkedIn profile`} style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems:'center', justifyContent:'center',
              color: 'rgba(160,180,210,0.7)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#e8eef8' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(160,180,210,0.7)' }}>
              <Linkedin style={{ width:14, height:14 }} />
            </a>
            <a href={member.website || member.github} aria-label={`${member.name} personal website`} style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems:'center', justifyContent:'center',
              color: 'rgba(160,180,210,0.7)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#e8eef8' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(160,180,210,0.7)' }}>
              <Globe style={{ width:14, height:14 }} />
            </a>
          </div>
        </div>
      </div>
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
  const bgX = useTransform(sx, [0,1], [-28, 28])
  const bgY = useTransform(sy, [0,1], [-20, 20])
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

      {/* ════════════════════════  HERO  ════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Deep radial bg */}
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 110% 80% at 65% -5%, rgba(0,82,204,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 55% at 90% 90%, rgba(109,40,217,0.13) 0%, transparent 65%), #02020e' }} />

        {/* Dot grid — parallax */}
        <motion.div style={{ y: yBg, x: dotX, translateY: dotY }} className="absolute inset-0 grid-bg opacity-30" />

        {/* 3-D Particle network */}
        <ParticleNetwork opacity={0.55} />

        {/* ── GRID Logo — full-hero animated background ── */}
        <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 pointer-events-none">
          <GRIDHeroBackground opacity={0.14} />
        </motion.div>

        {/* Aurora blobs — each on its own parallax layer */}
        <motion.div style={{ x: b1x, y: b1y, position:'absolute', top:'5%', right:'2%', width:640, height:640, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,82,204,0.18) 0%,transparent 70%)', filter:'blur(100px)', animation:'aurora1 22s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
        <motion.div style={{ x: b2x, y: b2y, position:'absolute', bottom:'10%', right:'5%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(109,40,217,0.13) 0%,transparent 70%)', filter:'blur(80px)', animation:'aurora2 28s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />
        <motion.div style={{ x: b3x, y: b3y, position:'absolute', top:'40%', left:'2%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.09) 0%,transparent 70%)', filter:'blur(90px)', animation:'aurora3 18s ease-in-out infinite', pointerEvents:'none', zIndex:0 }} />

        {/* ── Hero text ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center">

          {/* ── Text content ── */}
          <div className="w-full text-center">

            {/* Status badge */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05, duration:0.5 }} className="mb-7 flex justify-center">
              <span className="tag">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#4ade80', boxShadow:'0 0 6px #4ade80' }} />
                12,000 ML researchers online now
              </span>
            </motion.div>

            {/* H1 */}
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12, duration:0.75 }}>
              <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.04em', fontSize:'clamp(2.4rem,5.2vw,4.4rem)', color:'#f0f6ff', marginBottom:6 }}>
                Where ML minds
              </h1>
              <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, lineHeight:1.07, letterSpacing:'-0.04em', fontSize:'clamp(2.4rem,5.2vw,4.4rem)', marginBottom:28 }}>
                <MorphingWord />
              </h1>
            </motion.div>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28, duration:0.65 }}
              className="max-w-xl mb-10 text-base md:text-lg leading-relaxed mx-auto"
              style={{ color:'rgba(170,186,210,0.82)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
              The world's most focused Machine Learning community —{' '}
              <strong style={{ color:'#e8eef8', fontWeight:700 }}>researchers, engineers, and builders</strong>{' '}
              collaborating on models, papers, datasets, and production ML systems.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42, duration:0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <MagneticButton variant="primary" className="gap-2 px-8 py-4 text-sm" onClick={() => window.location.href='/register'}>
                Join GRID free <ArrowRight style={{ width:16,height:16 }} />
              </MagneticButton>
              <MagneticButton variant="secondary" className="gap-2 px-8 py-4 text-sm btn-outline" onClick={() => window.location.href='/members'}>
                Meet the researchers
              </MagneticButton>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.58, duration:0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {[
                { v:'12k+',  l:'ML Researchers' },
                { v:'900+',  l:'ML Projects' },
                { v:'2.4k+', l:'Papers Discussed' },
                { v:'180+',  l:'Research Groups' },
              ].map(({ v, l }) => (
                <div key={l} className="stat-card py-3">
                  <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:20, letterSpacing:'-0.03em', marginBottom:2 }} className="text-gradient">{v}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'#374151', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2, duration:0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span style={{ fontSize:9, color:'#1f2937', letterSpacing:'0.35em', textTransform:'uppercase', fontFamily:'Inter,sans-serif' }}>scroll</span>
          <motion.div animate={{ y:[0,7,0] }} transition={{ repeat:Infinity, duration:1.8 }}
            style={{ width:1, height:38, background:'linear-gradient(to bottom,rgba(0,212,255,0.55),transparent)', borderRadius:1 }} />
        </motion.div>
      </section>

      {/* ════════════  VALUE PROPS  ════════════ */}
      <section className="py-16 px-6 relative">
        <div className="absolute inset-0" style={{ background:'linear-gradient(90deg,rgba(0,82,204,0.03) 0%,rgba(0,212,255,0.03) 50%,rgba(109,40,217,0.03) 100%)' }} />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { n:'Research First',       b:'Every conversation is grounded in rigorous ML — from theory to deployment, papers to benchmarks.' },
            { n:'Build in Public',      b:'Share experiments, training logs, model weights, and real failure modes with peers who get it.' },
            { n:'Accelerate Together',  b:'Progress faster with code reviews, paper reading groups, and direct access to ML specialists.' },
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
            <SectionLabel>The founding team</SectionLabel>
            <motion.h2 {...iv} className="section-title text-3xl md:text-[2.4rem] text-white">
              Real people. <span className="text-gradient">Real research.</span>
            </motion.h2>
            <motion.p {...iv} className="text-sm max-w-lg mx-auto mt-4" style={{ color:'rgba(140,160,190,0.7)', lineHeight:1.75 }}>
              The core team behind GRID — ML researchers, engineers, and educators
              who built this community from the ground up.
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
