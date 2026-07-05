import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Users, ArrowRight, ExternalLink,
  Brain, Cpu, BarChart2, GitBranch, FlaskConical, BookOpen,
  Zap, Trophy, Globe, ChevronRight, Star,
} from 'lucide-react'
import axios from 'axios'
import FloatingLogos from '../components/FloatingLogos'

/* ─── Real GRID events ───────────────────────────────────────────────────── */
const GRID_EVENTS = [
  /* ── UPCOMING ── */
  {
    id: 100,
    title: 'GRID × AlgoRand — Blockchain Meets AI',
    type: 'Session',
    date: '2026-07-12',
    time: '8:00 PM IST',
    location: 'Online · Google Meet',
    attendees: 0,
    upcoming: true,
    desc: 'GRID Community partners with AlgoRand for an exclusive session on the intersection of Blockchain and Artificial Intelligence. Limited seats — register early.',
    tags: ['Blockchain', 'AlgoRand', 'AI', 'Web3'],
    icon: Zap,
    accentColor: '#00d4ff',
    accentGrad: 'linear-gradient(135deg, #0052cc, #00d4ff)',
    poster: null,
  },
  /* ── PAST (newest first) ── */
  {
    id: 103,
    title: 'From Neurons to Intelligence — 2-Day ML Session',
    type: 'Session',
    date: '2026-06-26',
    time: '8:00 PM – 9:00 PM IST',
    location: 'Online · Google Meet',
    attendees: 0,
    desc: '#NeuralNexus2026 — 2 days of ML from fundamentals to real-world project deployment. Day 1: LLMs & Generative AI (Sarmistha Ghosh, AI/ML Expert). Day 2: Build & Deploy AI Project (Rahul Pal, ML Engineer). Free registration, limited seats.',
    tags: ['Machine Learning', 'LLMs', 'Gen AI', 'Free'],
    icon: Brain,
    accentColor: '#7b2fff',
    accentGrad: 'linear-gradient(135deg, #7b2fff, #ec4899)',
    poster: '/events/event-ml.png',
  },
  {
    id: 102,
    title: 'Full Stack Web Development — Frontend to Production',
    type: 'Session',
    date: '2026-06-07',
    time: '8:00 PM – 9:30 PM IST',
    location: 'Online Session (Live)',
    attendees: 0,
    desc: 'Speaker: Sulagna Ghosh — Solutions Engineer & PM @ Creowis, Lead Organizer @ React Kolkata. Learn the complete dev workflow: modern full-stack architecture, React & Node.js best practices, production deployment, and open source career insights.',
    tags: ['Full Stack', 'React', 'Node.js', 'Production'],
    icon: GitBranch,
    accentColor: '#00d4ff',
    accentGrad: 'linear-gradient(135deg, #0066ff, #00d4ff)',
    poster: '/events/event-fullstack.png',
  },
  {
    id: 101,
    title: 'Building Smart Web Apps — Firebase & Gemini AI',
    type: 'Session',
    date: '2026-05-25',
    time: '8:00 PM – 9:30 PM IST',
    location: 'Online Session',
    attendees: 0,
    desc: "GRID's very first event! Speaker: Debajit Mallick — Software Engineer @Ergeon, Organizer @GDG Siliguri & React Siliguri. Build real AI-powered apps using Firebase Auth, Firestore, Gemini AI, hosting & deployment. From Beginner to Builder.",
    tags: ['Firebase', 'Gemini AI', 'Web Dev', 'Beginner Friendly'],
    icon: Zap,
    accentColor: '#ec4899',
    accentGrad: 'linear-gradient(135deg, #ec4899, #7b2fff)',
    poster: '/events/event-firebase.png',
  },
]

/* ─── Other ML Event data ────────────────────────────────────────────────── */
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
    poster: null,
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
    poster: null,
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
    poster: null,
  },
]

const TYPES = ['All', 'Session', 'Hackathon', 'Workshop', 'Conference', 'Study Group', 'Course']

const TYPE_META = {
  'Session':     { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',   border:'rgba(0,212,255,0.25)'   },
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
              {event.upcoming
                ? <span style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.35)', color:'#00d4ff', fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, animation:'pulse 2s infinite', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>● Upcoming</span>
                : <span style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80', fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Featured</span>
              }
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
              ].filter(x => x.text && x.text !== '—').map(({ Icon:Ic, text }) => (
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
              {event.upcoming ? 'Register Now' : 'View Event'} <ArrowRight style={{ width:16,height:16 }} />
            </button>
          </div>

          {/* Right: poster image OR date card */}
          {event.poster
            ? (
              <div style={{
                flexShrink: 0, width: 220,
                borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${meta.color}22`,
                boxShadow: `0 0 40px ${meta.color}18, 0 16px 48px rgba(0,0,0,0.6)`,
                aspectRatio: '3/4',
              }}>
                <img src={event.poster} alt={event.title}
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }} />
              </div>
            ) : (
              <div style={{
                flexShrink: 0, width: 160,
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${meta.color}20`,
                borderRadius: 20, padding: '28px 20px',
                display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                textAlign: 'center', backdropFilter: 'blur(20px)',
              }}>
                <Icon style={{ width:32, height:32, color:meta.color, marginBottom:14, opacity:0.9 }} />
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:900, fontSize:52, color:'#f0f6ff', lineHeight:1, letterSpacing:'-0.05em', marginBottom:4 }}>{day}</div>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background: event.accentGrad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:4 }}>{month}</div>
                <div style={{ fontSize:12, color:'rgba(140,160,190,0.5)', fontFamily:'Inter,sans-serif' }}>{year}</div>
              </div>
            )
          }
        </div>
      </div>
    </motion.div>
  )
}

const jak = '"Plus Jakarta Sans",sans-serif'

function EventTags({ tags, color, max=3 }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
      {(tags||[]).slice(0,max).map(t => (
        <span key={t} style={{
          fontSize:10, fontWeight:600, fontFamily:jak,
          background:`${color}0a`, border:`1px solid ${color}1e`, color,
          padding:'3px 9px', borderRadius:100, letterSpacing:'0.04em',
        }}>{t}</span>
      ))}
    </div>
  )
}

function RegisterBtn({ color, label='Register' }) {
  return (
    <button style={{
      width:'100%', padding:'10px',
      background:`${color}0f`, border:`1px solid ${color}25`,
      borderRadius:10, color,
      fontFamily:jak, fontWeight:700,
      fontSize:12, letterSpacing:'0.04em', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', gap:6,
      transition:'all 0.2s ease',
    }}
    onMouseEnter={e=>{ e.currentTarget.style.background=`${color}14`; e.currentTarget.style.borderColor=`${color}40` }}
    onMouseLeave={e=>{ e.currentTarget.style.background=`${color}06`; e.currentTarget.style.borderColor=`${color}25` }}>
      {label} <ArrowRight style={{ width:13,height:13 }} />
    </button>
  )
}

/* ─── VARIANT 0 — "Panorama": full-bleed poster or gradient banner ──────── */
function EventClassic({ event, meta, Icon, dateStr }) {
  const d = event.date ? new Date(event.date) : null
  const day = d ? d.getDate() : '—'
  const mon = d ? d.toLocaleString('default',{month:'short'}).toUpperCase() : ''
  return (
    <div style={{ height:'100%', minHeight:500, display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${meta.color}1a`, borderRadius:22, overflow:'hidden', position:'relative' }}>
      {/* Visual banner */}
      <div style={{ height:260, position:'relative', overflow:'hidden', flexShrink:0 }}>
        {event.poster
          ? <>
              <img src={event.poster} alt={event.title}
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:130,
                background:'linear-gradient(to top, rgba(6,6,24,0.98) 0%, rgba(6,6,24,0.6) 50%, transparent 100%)' }} />
            </>
          : <>
              <div style={{ position:'absolute', inset:0, background:event.accentGrad||`linear-gradient(135deg,${meta.color},#0066ff)`, opacity:0.18 }} />
              <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${meta.color}0a 1px,transparent 1px),linear-gradient(90deg,${meta.color}0a 1px,transparent 1px)`, backgroundSize:'28px 28px' }} />
              <div style={{ position:'absolute', top:-30, left:'50%', transform:'translateX(-50%)', width:340, height:230, background:`radial-gradient(circle,${meta.color}2c 0%,transparent 65%)`, filter:'blur(36px)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
                <div style={{ width:64, height:64, borderRadius:20, background:`linear-gradient(135deg,${meta.color}28,${meta.color}10)`, border:`1px solid ${meta.color}35`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 32px ${meta.color}30` }}>
                  <Icon style={{ width:28, height:28, color:meta.color }} />
                </div>
                <div style={{ width:1, height:80, background:`linear-gradient(180deg,transparent,${meta.color}40,transparent)` }} />
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontFamily:jak, fontWeight:900, fontSize:72, color:'#fff', lineHeight:1, letterSpacing:'-0.05em', textShadow:`0 0 50px ${meta.color}60` }}>{day}</div>
                  <div style={{ fontFamily:jak, fontWeight:800, fontSize:14, letterSpacing:'0.3em', color:meta.color, textTransform:'uppercase' }}>{mon}</div>
                </div>
              </div>
            </>
        }
        {/* Type badge */}
        <div style={{ position:'absolute', top:16, right:16, zIndex:2 }}>
          <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 11px', borderRadius:100, fontFamily:jak }}>{event.type}</span>
        </div>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:event.accentGrad||`linear-gradient(90deg,${meta.color},#0066ff)`, zIndex:2 }} />
      </div>
      {/* Content */}
      <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
        <p style={{ fontFamily:jak, fontSize:13, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:14, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{event.description??event.desc}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
          {[{I:Clock,t:event.time},{I:MapPin,t:event.location}].map(({I:Ic,t})=>t&&(
            <div key={t} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}>
              <Ic style={{ width:12,height:12,color:meta.color,flexShrink:0 }} />{t}
            </div>
          ))}
        </div>
        <div style={{ marginBottom:16 }}><EventTags tags={event.tags} color={meta.color} /></div>
        <RegisterBtn color={meta.color} />
      </div>
    </div>
  )
}

/* ─── VARIANT 1 — "Diagonal Split" / full-bleed poster ──────────────────── */
function EventRail({ event, meta, Icon, dateStr }) {
  const d = event.date ? new Date(event.date) : null
  const day = d ? d.getDate() : '—'
  const mon = d ? d.toLocaleString('default',{month:'short'}).toUpperCase() : ''
  return (
    <div style={{ height:'100%', minHeight:500, display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${meta.color}18`, borderRadius:22, overflow:'hidden' }}>
      {/* Banner */}
      <div style={{ height:260, position:'relative', overflow:'hidden', flexShrink:0 }}>
        {event.poster
          ? <>
              <img src={event.poster} alt={event.title}
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:130,
                background:'linear-gradient(to top, rgba(6,6,24,0.98) 0%, rgba(6,6,24,0.6) 50%, transparent 100%)' }} />
            </>
          : <>
              <div style={{ position:'absolute', inset:0, background:event.accentGrad||`linear-gradient(135deg,${meta.color},#0066ff)` }} />
              <div style={{ position:'absolute', inset:0, background:'rgba(6,6,24,0.92)', clipPath:'polygon(52% 0,100% 0,100% 100%,40% 100%)' }} />
              <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)`, backgroundSize:'22px 22px', clipPath:'polygon(52% 0,100% 0,100% 100%,40% 100%)' }} />
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.1) 4px,rgba(0,0,0,0.1) 5px)', clipPath:'polygon(0 0,52% 0,40% 100%,0 100%)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
              <div style={{ position:'absolute', left:24, top:'50%', transform:'translateY(-55%)' }}>
                <div style={{ fontFamily:jak, fontWeight:900, fontSize:80, color:'rgba(0,0,0,0.38)', lineHeight:1, letterSpacing:'-0.05em' }}>{day}</div>
                <div style={{ fontFamily:jak, fontWeight:800, fontSize:13, letterSpacing:'0.22em', color:'rgba(0,0,0,0.35)', textTransform:'uppercase' }}>{mon}</div>
              </div>
              <div style={{ position:'absolute', right:22, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:`${meta.color}18`, border:`1px solid ${meta.color}35`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px ${meta.color}28` }}>
                  <Icon style={{ width:22, height:22, color:meta.color }} />
                </div>
                <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 10px', borderRadius:100, fontFamily:jak }}>{event.type}</span>
              </div>
            </>
        }
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:event.accentGrad||`linear-gradient(90deg,${meta.color},#0066ff)`, zIndex:2 }} />
        {event.poster && (
          <div style={{ position:'absolute', top:16, right:16, zIndex:2 }}>
            <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 11px', borderRadius:100, fontFamily:jak }}>{event.type}</span>
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
        <p style={{ fontFamily:jak, fontSize:13, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:14, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{event.description??event.desc}</p>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14, flexWrap:'wrap' }}>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><MapPin style={{ width:11,height:11,color:meta.color }} />{event.location}</span>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><Users style={{ width:11,height:11,color:meta.color }} />{(event.attendees||0).toLocaleString()}</span>
        </div>
        <div style={{ marginBottom:16 }}><EventTags tags={event.tags} color={meta.color} /></div>
        <RegisterBtn color={meta.color} />
      </div>
    </div>
  )
}

/* ─── VARIANT 2 — "Ticket Stub" / full-bleed poster ─────────────────────── */
function EventTicket({ event, meta, Icon, dateStr }) {
  return (
    <div style={{ height:'100%', minHeight:500, display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${meta.color}18`, borderRadius:22, overflow:'hidden', position:'relative' }}>
      {/* Full banner */}
      <div style={{ height:260, position:'relative', overflow:'hidden', flexShrink:0 }}>
        {event.poster
          ? <>
              <img src={event.poster} alt={event.title}
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:130,
                background:'linear-gradient(to top, rgba(6,6,24,0.98) 0%, rgba(6,6,24,0.6) 50%, transparent 100%)' }} />
            </>
          : <>
              <div style={{ position:'absolute', inset:0, background:event.accentGrad||`linear-gradient(135deg,${meta.color},#0066ff)`, opacity:0.16 }} />
              <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:320, height:220, background:`radial-gradient(circle,${meta.color}28 0%,transparent 65%)`, filter:'blur(34px)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
                <div style={{ width:72, height:72, borderRadius:24, background:`linear-gradient(135deg,${meta.color}2c,${meta.color}0e)`, border:`1px solid ${meta.color}40`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 40px ${meta.color}38,0 8px 28px rgba(0,0,0,0.5)` }}>
                  <Icon style={{ width:32, height:32, color:meta.color }} />
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.2em', color:`${meta.color}90`, textTransform:'uppercase', marginBottom:2 }}>Date</div>
                  <div style={{ fontFamily:jak, fontWeight:800, fontSize:18, color:'#f0f6ff', letterSpacing:'-0.02em' }}>{dateStr}</div>
                </div>
              </div>
            </>
        }
        {/* Type badge */}
        <div style={{ position:'absolute', top:16, right:16, zIndex:2 }}>
          <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 11px', borderRadius:100, fontFamily:jak }}>{event.type}</span>
        </div>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:event.accentGrad||`linear-gradient(90deg,${meta.color},#0066ff)`, zIndex:2 }} />
      </div>
      {/* Perforated stub */}
      <div style={{ position:'relative', height:0, zIndex:2 }}>
        <div style={{ position:'absolute', left:-12, top:-12, width:24, height:24, borderRadius:'50%', background:'#02020e' }} />
        <div style={{ position:'absolute', right:-12, top:-12, width:24, height:24, borderRadius:'50%', background:'#02020e' }} />
        <div style={{ borderTop:`2px dashed ${meta.color}35`, margin:'0 24px' }} />
      </div>
      {/* Content */}
      <div style={{ padding:'22px 22px 20px', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
        <p style={{ fontFamily:jak, fontSize:13, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:12, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{event.description??event.desc}</p>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak, marginBottom:6 }}>
          <MapPin style={{ width:12,height:12,color:meta.color }} />{event.location}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}>
            <Users style={{ width:12,height:12,color:meta.color }} />{(event.attendees||0).toLocaleString()} attending
          </div>
          <EventTags tags={event.tags} color={meta.color} max={1} />
        </div>
        <RegisterBtn color={meta.color} label="Get Ticket" />
      </div>
    </div>
  )
}

/* ─── VARIANT 3 — "HUD Terminal": console bar + radar-bracket banner ─────────── */
function EventHud({ event, meta, Icon, dateStr, i }) {
  const br = { position:'absolute', width:18, height:18 }
  return (
    <div style={{ height:'100%', minHeight:500, display:'flex', flexDirection:'column',
      background:'rgba(4,4,16,0.99)',
      border:`1px solid ${meta.color}22`, borderRadius:18, overflow:'hidden', position:'relative',
      boxShadow:`0 0 0 1px rgba(255,255,255,0.02) inset` }}>
      {/* Console bar */}
      <div style={{ height:42, background:'rgba(255,255,255,0.03)', borderBottom:`1px solid ${meta.color}14`, display:'flex', alignItems:'center', padding:'0 16px', gap:8, flexShrink:0 }}>
        <div style={{ display:'flex', gap:5 }}>
          {['#ff5f57','#ffbd2e','#28c841'].map(c=><div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c,opacity:0.65 }} />)}
        </div>
        <div style={{ flex:1, fontFamily:jak, fontSize:10.5, color:`${meta.color}65`, letterSpacing:'0.12em', textAlign:'center', textTransform:'uppercase' }}>GRID_EVENTS.{event.type?.toLowerCase()||'event'}</div>
      </div>
      {/* HUD visual area */}
      <div style={{ height:172, position:'relative', overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.012)', borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:300, height:200, background:`radial-gradient(circle,${meta.color}1c 0%,transparent 65%)`, filter:'blur(30px)' }} />
        {/* Scan lines */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)', pointerEvents:'none' }} />
        {/* Corner brackets */}
        <div style={{ ...br, top:12, left:12, borderTop:`2px solid ${meta.color}55`, borderLeft:`2px solid ${meta.color}55` }} />
        <div style={{ ...br, top:12, right:12, borderTop:`2px solid ${meta.color}55`, borderRight:`2px solid ${meta.color}55` }} />
        <div style={{ ...br, bottom:12, left:12, borderBottom:`2px solid ${meta.color}55`, borderLeft:`2px solid ${meta.color}55` }} />
        <div style={{ ...br, bottom:12, right:12, borderBottom:`2px solid ${meta.color}55`, borderRight:`2px solid ${meta.color}55` }} />
        {/* Watermark index */}
        <div style={{ position:'absolute', right:10, bottom:-6, fontFamily:jak, fontWeight:900, fontSize:100, color:`${meta.color}09`, lineHeight:1, userSelect:'none' }}>{String(i+1).padStart(2,'0')}</div>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', gap:18 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:`${meta.color}18`, border:`1px solid ${meta.color}35`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon style={{ width:26, height:26, color:meta.color }} />
          </div>
          <div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:`${meta.color}75`, marginBottom:4 }}>EVENT DATE</div>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:22, color:'#f0f6ff', letterSpacing:'-0.025em' }}>{dateStr}</div>
            <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100, fontFamily:jak, marginTop:6, display:'inline-block' }}>{event.type}</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', flex:1, position:'relative', zIndex:1 }}>
        <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
        <p style={{ fontFamily:jak, fontSize:13, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:14, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{event.description??event.desc}</p>
        <div style={{ display:'flex', gap:14, marginBottom:14, flexWrap:'wrap' }}>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><Clock style={{ width:11,height:11,color:meta.color }} />{event.time}</span>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><Users style={{ width:11,height:11,color:meta.color }} />{(event.attendees||0).toLocaleString()}</span>
        </div>
        <div style={{ marginBottom:16 }}><EventTags tags={event.tags} color={meta.color} /></div>
        <RegisterBtn color={meta.color} />
      </div>
    </div>
  )
}

/* ─── VARIANT 4 — "Magazine Poster": editorial big-type banner, full gradient ── */
function EventRibbon({ event, meta, Icon, dateStr }) {
  const d = event.date ? new Date(event.date) : null
  const day = d ? d.getDate() : '—'
  const mon = d ? d.toLocaleString('default',{month:'short'}).toUpperCase() : ''
  const yr = d ? d.getFullYear() : ''
  return (
    <div style={{ height:'100%', minHeight:500, display:'flex', flexDirection:'column', position:'relative',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))',
      border:`1px solid ${meta.color}18`, borderRadius:22, overflow:'hidden' }}>
      {/* Full gradient banner */}
      <div style={{ height:210, position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', inset:0, background:event.accentGrad||`linear-gradient(135deg,${meta.color},#0066ff)`, opacity:0.2 }} />
        {/* Diagonal ribbon type badge */}
        <div style={{ position:'absolute', top:22, right:-44, width:170, transform:'rotate(45deg)', background:event.accentGrad||`linear-gradient(90deg,${meta.color},#0066ff)`, textAlign:'center', padding:'5px 0', zIndex:2, fontFamily:jak, fontWeight:800, fontSize:9.5, letterSpacing:'0.12em', textTransform:'uppercase', color:'#050514' }}>{event.type}</div>
        {/* Ambient glow */}
        <div style={{ position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)', width:360, height:260, background:`radial-gradient(circle,${meta.color}28 0%,transparent 65%)`, filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:event.accentGrad||`linear-gradient(90deg,${meta.color},#0066ff)` }} />
        {/* Large editorial date layout */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 28px', gap:16 }}>
          <div>
            <div style={{ fontFamily:jak, fontWeight:900, fontSize:88, color:'rgba(255,255,255,0.08)', lineHeight:1, letterSpacing:'-0.05em', marginBottom:-8 }}>{day}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:22, color:meta.color, letterSpacing:'0.15em', textTransform:'uppercase' }}>{mon}</div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:14, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em' }}>{yr}</div>
            <div style={{ width:44, height:3, background:meta.color, borderRadius:2, opacity:0.7 }} />
          </div>
          <div style={{ marginLeft:'auto', width:58, height:58, borderRadius:18, background:`${meta.color}18`, border:`1px solid ${meta.color}35`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 28px ${meta.color}30` }}>
            <Icon style={{ width:24, height:24, color:meta.color }} />
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontFamily:jak, fontWeight:800, fontSize:16.5, color:'#f0f6ff', lineHeight:1.3, letterSpacing:'-0.015em', marginBottom:10 }}>{event.title}</h3>
        <p style={{ fontFamily:jak, fontSize:13, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:14, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{event.description??event.desc}</p>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14, flexWrap:'wrap' }}>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><MapPin style={{ width:11,height:11,color:meta.color }} />{event.location}</span>
          <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><Clock style={{ width:11,height:11,color:meta.color }} />{event.time}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <EventTags tags={event.tags} color={meta.color} max={2} />
          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'rgba(140,160,190,0.55)', fontFamily:jak }}><Users style={{ width:11,height:11,color:meta.color }} />{(event.attendees||0).toLocaleString()}</span>
        </div>
        <RegisterBtn color={meta.color} />
      </div>
    </div>
  )
}

const EVENT_VARIANTS = [EventClassic, EventRail, EventTicket, EventHud, EventRibbon]

function EventCard({ event, i }) {
  const meta = typeMeta(event.type)
  const Icon = event.icon || Brain
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'
  const V = EVENT_VARIANTS[i % EVENT_VARIANTS.length]
  return (
    <motion.div
      initial={{ opacity:0, y:32, scale:0.97 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:true }}
      transition={{ delay:i*0.08, duration:0.55, ease:'easeOut' }}
      whileHover={{ y:-6, transition:{ duration:0.25 } }}
      style={{ height:'100%' }}
    >
      <V event={event} meta={meta} Icon={Icon} dateStr={dateStr} i={i} />
    </motion.div>
  )
}

/* ─── Events Page ─────────────────────────────────────────────────────────── */
export default function Events() {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    // Always lead with real GRID events; append any DB events behind them
    axios.get('/api/events').then(r => {
      const api = r.data && r.data.length > 0 ? r.data : []
      setEvents([...GRID_EVENTS, ...api])
    }).catch(() => setEvents([...GRID_EVENTS, ...MOCK_EVENTS]))
  }, [])

  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter)

  return (
    <div style={{ background:'#02020e', minHeight:'100vh' }}>
      <FloatingLogos />

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
