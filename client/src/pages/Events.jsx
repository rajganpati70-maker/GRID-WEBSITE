import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Users, ArrowRight, ExternalLink,
  Brain, Cpu, BarChart2, GitBranch, FlaskConical, BookOpen,
  Zap, Trophy, Globe, ChevronRight, Star,
} from 'lucide-react'
import axios from 'axios'

/* ─── ML Event data ──────────────────────────────────────────────────────── */
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'GRID ML Hackathon 2025 — Build & Train',
    type: 'Hackathon',
    date: '2025-09-15',
    time: '09:00 AM UTC',
    location: 'Global · Online + NYC Hub',
    attendees: 1800,
    desc: '72-hour ML hackathon — build a production-ready ML system from scratch. Real datasets, GPU credits sponsored by NVIDIA, $80K in prizes across 6 tracks.',
    tags: ['Deep Learning', 'Production ML', '72hr', 'NVIDIA Credits'],
    icon: Trophy,
    accentColor: '#00d4ff',
    accentGrad: 'linear-gradient(135deg, #0052cc, #00d4ff)',
  },
  {
    id: 2,
    title: 'Transformers Architecture Deep Dive',
    type: 'Workshop',
    date: '2025-08-22',
    time: '02:00 PM UTC',
    location: 'Online · Live + Recorded',
    attendees: 620,
    desc: 'Hands-on breakdown of attention mechanisms, positional encodings, KV caching, and how to fine-tune LLMs efficiently on limited compute.',
    tags: ['Transformers', 'LLMs', 'Fine-tuning', 'Attention'],
    icon: Brain,
    accentColor: '#7b2fff',
    accentGrad: 'linear-gradient(135deg, #7b2fff, #00d4ff)',
  },
  {
    id: 3,
    title: 'GRID Research Summit 2025',
    type: 'Conference',
    date: '2025-10-04',
    time: '10:00 AM CET',
    location: 'Berlin, Germany + Online',
    attendees: 3200,
    desc: 'Three days of ML research talks, poster sessions, hands-on workshops, and hallway conversations with the researchers shaping the field.',
    tags: ['Research', 'Networking', 'Keynotes', 'Posters'],
    icon: Star,
    accentColor: '#0066ff',
    accentGrad: 'linear-gradient(135deg, #0066ff, #7b2fff)',
  },
  {
    id: 4,
    title: 'MLOps Production Bootcamp',
    type: 'Workshop',
    date: '2025-08-10',
    time: '11:00 AM UTC',
    location: 'Online · Interactive',
    attendees: 480,
    desc: 'Model serving, experiment tracking with MLflow, distributed training on multi-GPU clusters, and CI/CD pipelines for ML. Real battle-tested patterns from production.',
    tags: ['MLOps', 'Kubernetes', 'MLflow', 'Production'],
    icon: Cpu,
    accentColor: '#ec4899',
    accentGrad: 'linear-gradient(135deg, #ec4899, #7b2fff)',
  },
  {
    id: 5,
    title: 'NLP Research Paper Club — Season 4',
    type: 'Study Group',
    date: '2025-07-28',
    time: '07:00 PM UTC',
    location: 'Online · Weekly',
    attendees: 310,
    desc: 'Weekly deep dives into the latest NLP and LLM research papers — summaries, reproductions, and discussions led by practitioners who have read and tried the work.',
    tags: ['NLP', 'LLMs', 'Research Papers', 'Weekly'],
    icon: BookOpen,
    accentColor: '#4ade80',
    accentGrad: 'linear-gradient(135deg, #4ade80, #00d4ff)',
  },
  {
    id: 6,
    title: 'Reinforcement Learning from Scratch',
    type: 'Course',
    date: '2025-09-01',
    time: '06:00 PM UTC',
    location: 'Online · 6-Week Program',
    attendees: 760,
    desc: 'From MDP fundamentals to PPO and RLHF — a 6-week live cohort building real RL agents from scratch in PyTorch with weekly assignments and peer review.',
    tags: ['RL', 'RLHF', 'PPO', 'PyTorch'],
    icon: FlaskConical,
    accentColor: '#f59e0b',
    accentGrad: 'linear-gradient(135deg, #f59e0b, #ec4899)',
  },
]

const TYPES = ['All', 'Hackathon', 'Workshop', 'Conference', 'Study Group', 'Course']

const TYPE_META = {
  'Hackathon':   { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',   border:'rgba(0,212,255,0.25)'   },
  'Workshop':    { color:'#7b2fff', bg:'rgba(123,47,255,0.08)',  border:'rgba(123,47,255,0.25)'  },
  'Conference':  { color:'#0066ff', bg:'rgba(0,102,255,0.08)',   border:'rgba(0,102,255,0.25)'   },
  'Study Group': { color:'#4ade80', bg:'rgba(74,222,128,0.08)',  border:'rgba(74,222,128,0.25)'  },
  'Course':      { color:'#f59e0b', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.25)'  },
  'Sprint':      { color:'#ec4899', bg:'rgba(236,72,153,0.08)',  border:'rgba(236,72,153,0.25)'  },
  default:       { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',   border:'rgba(0,212,255,0.25)'   },
}

function typeMeta(type) { return TYPE_META[type] || TYPE_META.default }

/* ─── Featured event (hero card) ─────────────────────────────────────────── */
function FeaturedEvent({ event }) {
  const meta = typeMeta(event.type)
  const Icon = event.icon || Brain
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' }) : '—'
  const day = event.date ? new Date(event.date).getDate() : '—'
  const month = event.date ? new Date(event.date).toLocaleString('default', { month:'short' }) : '—'
  const year = event.date ? new Date(event.date).getFullYear() : ''

  return (
    <motion.div
      initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75, ease:'easeOut' }}
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(6,6,24,0.98) 0%, rgba(4,4,18,0.96) 100%)',
        border: `1px solid ${meta.color}22`,
        backdropFilter: 'blur(32px)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.025) inset, 0 32px 80px rgba(0,0,0,0.65), 0 0 80px ${meta.color}08`,
        marginBottom: 28,
      }}
    >
      {/* Top gradient line */}
      <div style={{ height: 3, background: event.accentGrad || `linear-gradient(90deg, ${meta.color}, #0066ff)` }} />

      {/* Ambient glow */}
      <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle, ${meta.color}10 0%, transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-40, left:'30%', width:240, height:180, borderRadius:'50%', background:`radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)`, filter:'blur(50px)', pointerEvents:'none' }} />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

          {/* Left: content */}
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span style={{
                background: meta.bg, border:`1px solid ${meta.border}`, color:meta.color,
                fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                padding:'4px 12px', borderRadius:100,
                fontFamily:'"Plus Jakarta Sans",sans-serif',
              }}>{event.type}</span>
              <span style={{
                background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80',
                fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                padding:'4px 12px', borderRadius:100, animation:'pulse 2s infinite',
                fontFamily:'"Plus Jakarta Sans",sans-serif',
              }}>● Featured</span>
            </div>

            <h2 style={{
              fontFamily:'"Plus Jakarta Sans",sans-serif',
              fontWeight:800, fontSize:'clamp(1.4rem, 3vw, 2rem)',
              color:'#f0f6ff', letterSpacing:'-0.03em', lineHeight:1.2,
              marginBottom:14,
            }}>{event.title}</h2>

            <p style={{
              fontFamily:'"Plus Jakarta Sans",sans-serif',
              fontSize:15, color:'rgba(160,180,210,0.8)', lineHeight:1.7,
              marginBottom:24, maxWidth:580,
            }}>{event.description ?? event.desc}</p>

            {/* Meta row */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:20, marginBottom:22 }}>
              {[
                { Icon:Calendar, text:dateStr },
                { Icon:Clock,    text:event.time },
                { Icon:MapPin,   text:event.location },
                { Icon:Users,    text:`${(event.attendees||0).toLocaleString()} attending` },
              ].map(({ Icon:Ic, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:'rgba(140,160,190,0.7)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                  <Ic style={{ width:14, height:14, color:meta.color, opacity:0.8, flexShrink:0 }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:28 }}>
              {(event.tags||[]).map(t => (
                <span key={t} style={{
                  fontSize:11, fontWeight:600, fontFamily:'"Plus Jakarta Sans",sans-serif',
                  background:`${meta.color}0d`, border:`1px solid ${meta.color}20`, color:meta.color,
                  padding:'4px 11px', borderRadius:100, letterSpacing:'0.04em',
                }}>{t}</span>
              ))}
            </div>

            <button style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:`linear-gradient(135deg, ${meta.color}, #0066ff)`,
              color:'#fff', fontFamily:'"Plus Jakarta Sans",sans-serif',
              fontWeight:700, fontSize:13, letterSpacing:'-0.01em',
              padding:'12px 24px', borderRadius:12, border:'none', cursor:'pointer',
              boxShadow:`0 4px 24px ${meta.color}30`,
              transition:'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 32px ${meta.color}40` }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 4px 24px ${meta.color}30` }}>
              Register Now <ArrowRight style={{ width:16,height:16 }} />
            </button>
          </div>

          {/* Right: date card */}
          <div style={{
            flexShrink: 0,
            width: 160,
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${meta.color}20`,
            borderRadius: 20,
            padding: '28px 20px',
            display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
          }}>
            <Icon style={{ width:32, height:32, color:meta.color, marginBottom:14, opacity:0.9 }} />
            <div style={{
              fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:900,
              fontSize:52, color:'#f0f6ff', lineHeight:1, letterSpacing:'-0.05em',
              marginBottom:4,
            }}>{day}</div>
            <div style={{
              fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700,
              fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase',
              background: event.accentGrad, WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent', backgroundClip:'text',
              marginBottom:4,
            }}>{month}</div>
            <div style={{ fontSize:12, color:'rgba(140,160,190,0.5)', fontFamily:'Inter,sans-serif' }}>{year}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Regular event card ─────────────────────────────────────────────────── */
function EventCard({ event, i }) {
  const meta = typeMeta(event.type)
  const Icon = event.icon || Brain
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '—'

  return (
    <motion.div
      initial={{ opacity:0, y:32, scale:0.97 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:true }}
      transition={{ delay:i*0.08, duration:0.55, ease:'easeOut' }}
      whileHover={{ y:-5, transition:{ duration:0.25 } }}
      style={{ height:'100%' }}
    >
      <div style={{
        height:'100%', display:'flex', flexDirection:'column',
        background:'linear-gradient(160deg, rgba(6,6,24,0.98) 0%, rgba(4,4,18,0.96) 100%)',
        border:`1px solid ${meta.color}18`,
        borderRadius:20, overflow:'hidden', position:'relative',
        backdropFilter:'blur(28px)',
        boxShadow:`0 0 0 1px rgba(255,255,255,0.02) inset, 0 16px 48px rgba(0,0,0,0.55), 0 0 30px ${meta.color}06`,
        transition:'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${meta.color}35`; e.currentTarget.style.boxShadow=`0 0 0 1px rgba(255,255,255,0.035) inset, 0 24px 64px rgba(0,0,0,0.65), 0 0 50px ${meta.color}12` }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${meta.color}18`; e.currentTarget.style.boxShadow=`0 0 0 1px rgba(255,255,255,0.02) inset, 0 16px 48px rgba(0,0,0,0.55), 0 0 30px ${meta.color}06` }}>

        {/* Accent bar */}
        <div style={{ height:3, background:event.accentGrad || `linear-gradient(90deg,${meta.color},#0066ff)`, flexShrink:0 }} />

        {/* Corner glow */}
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle,${meta.color}0e 0%,transparent 70%)`, filter:'blur(20px)', pointerEvents:'none' }} />

        {/* Header */}
        <div style={{ padding:'22px 22px 16px', borderBottom:`1px solid rgba(255,255,255,0.04)`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:14 }}>
            {/* Icon */}
            <div style={{
              width:42, height:42, borderRadius:12, flexShrink:0,
              background:`linear-gradient(135deg, ${meta.color}18, ${meta.color}08)`,
              border:`1px solid ${meta.color}22`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon style={{ width:18, height:18, color:meta.color }} />
            </div>
            {/* Type badge + date */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
              <span style={{
                background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color,
                fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
                padding:'3px 9px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif',
              }}>{event.type}</span>
              <span style={{ fontSize:11, color:'rgba(140,160,190,0.5)', fontFamily:'Inter,sans-serif' }}>{dateStr}</span>
            </div>
          </div>
          <h3 style={{
            fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700,
            fontSize:15, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.01em',
          }}>{event.title}</h3>
        </div>

        {/* Body */}
        <div style={{ padding:'16px 22px', display:'flex', flexDirection:'column', flex:1 }}>
          <p style={{
            fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12.5,
            color:'rgba(140,160,190,0.7)', lineHeight:1.65,
            marginBottom:16, flex:1,
            display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden',
          }}>{event.description ?? event.desc}</p>

          {/* Event meta */}
          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:16 }}>
            {[
              { Icon:Clock,  text:event.time },
              { Icon:MapPin, text:event.location },
              { Icon:Users,  text:`${(event.attendees||0).toLocaleString()} attending` },
            ].map(({ Icon:Ic, text }) => text && (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                <Ic style={{ width:12, height:12, color:meta.color, opacity:0.7, flexShrink:0 }} />
                {text}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
            {(event.tags||[]).slice(0,3).map(t => (
              <span key={t} style={{
                fontSize:10, fontWeight:600, fontFamily:'"Plus Jakarta Sans",sans-serif',
                background:`${meta.color}0a`, border:`1px solid ${meta.color}1e`, color:meta.color,
                padding:'3px 9px', borderRadius:100, letterSpacing:'0.04em',
              }}>{t}</span>
            ))}
          </div>

          {/* Register button */}
          <button style={{
            width:'100%', padding:'10px',
            background:`${meta.color}0f`,
            border:`1px solid ${meta.color}25`,
            borderRadius:10, color:meta.color,
            fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700,
            fontSize:12, letterSpacing:'0.04em', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            transition:'all 0.2s ease',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background=`${meta.color}14`; e.currentTarget.style.borderColor=`${meta.color}40` }}
          onMouseLeave={e=>{ e.currentTarget.style.background=`${meta.color}06`; e.currentTarget.style.borderColor=`${meta.color}25` }}>
            Register <ArrowRight style={{ width:13,height:13 }} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Events Page ─────────────────────────────────────────────────────────── */
export default function Events() {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    axios.get('/api/events').then(r => {
      setEvents(r.data && r.data.length > 0 ? r.data : MOCK_EVENTS)
    }).catch(() => setEvents(MOCK_EVENTS))
  }, [])

  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter)

  return (
    <div style={{ background:'#02020e', minHeight:'100vh' }}>

      {/* ── Hero ── */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        {/* Ambient glows */}
        <div style={{ position:'absolute', top:'-20%', left:'30%', width:500, height:400, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(0,102,255,0.12) 0%, transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20%', right:'20%', width:400, height:300, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(123,47,255,0.1) 0%, transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <span className="tag mb-6 inline-flex items-center gap-2">
              <Brain style={{ width:11, height:11 }} />
              ML Events &amp; Workshops
            </span>
            <h1 style={{
              fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800,
              fontSize:'clamp(2.2rem,5vw,3.5rem)', letterSpacing:'-0.04em',
              color:'#f0f6ff', marginBottom:16, lineHeight:1.1,
            }}>
              ML EVENTS &amp; <span className="text-gradient">WORKSHOPS</span>
            </h1>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16, color:'rgba(160,180,210,0.78)', maxWidth:540, margin:'0 auto', lineHeight:1.7 }}>
              Hackathons, research workshops, paper reading clubs, and hands-on courses —
              all focused on advancing Machine Learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section style={{ padding:'48px 16px 80px', maxWidth:1280, margin:'0 auto' }}>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15, duration:0.5 }}
          style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:36 }}
        >
          {TYPES.map(type => {
            const active = filter === type
            const m = typeMeta(type)
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding:'9px 20px', borderRadius:10,
                  fontSize:11.5, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
                  fontFamily:'"Plus Jakarta Sans",sans-serif',
                  cursor:'pointer', transition:'all 0.2s ease',
                  background: active ? m.bg : 'rgba(255,255,255,0.03)',
                  border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                  color: active ? m.color : 'rgba(140,160,190,0.6)',
                  boxShadow: active ? `0 0 20px ${m.color}15` : 'none',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color='rgba(200,220,255,0.9)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)' }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color='rgba(140,160,190,0.6)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}}
              >
                {type}
              </button>
            )
          })}
        </motion.div>

        {/* Featured event */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 && (
            <motion.div key={filtered[0].id} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.35 }}>
              <FeaturedEvent event={filtered[0]} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length > 1 && (
          <>
            <motion.div
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5 }}
              style={{ marginBottom:20 }}
            >
              <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:13, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(140,160,190,0.55)' }}>
                More events
              </h3>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
              <AnimatePresence>
                {filtered.slice(1).map((event, i) => (
                  <EventCard key={event.id} event={event} i={i} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'80px 0' }}>
            <Brain style={{ width:40, height:40, color:'rgba(0,212,255,0.3)', margin:'0 auto 16px' }} />
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(140,160,190,0.5)' }}>No events in this category yet — check back soon.</p>
          </motion.div>
        )}
      </section>
    </div>
  )
}
