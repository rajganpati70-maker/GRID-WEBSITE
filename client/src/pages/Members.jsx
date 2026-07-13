import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Quote, Sparkles, Zap, BadgeCheck } from 'lucide-react'
import FloatingLogos from '../components/FloatingLogos'

/* ─── Core team data ─────────────────────────────────────────────────────── */
/* `crop` tunes object-position so each photo frames head → chest → stomach   */
const FACES = [
  {
    name:'Moumita Mandal',   initials:'MM', position:'Community Lead',        specialty:'ML Research & Community',
    photo:'/members/moumita.jpg', crop:'50% 10%',
    gradient:'linear-gradient(135deg,#ec4899,#7b2fff)',    glow:'#ec4899',
    quote:'Building a community means creating a space where every researcher feels their question matters — no question is too basic when you\'re pushing the frontier.',
    tags:['Research','Community','ML'],
  },
  {
    name:'Ritusree Chanda',  initials:'RC', position:'Research Associate',    specialty:'Deep Learning',
    photo:'/members/ritusree.jpg', crop:'50% 12%',
    gradient:'linear-gradient(135deg,#7b2fff,#00d4ff)',    glow:'#7b2fff',
    quote:'The best part of GRID is finding someone at 2am who has hit the exact same gradient explosion bug you have. Solidarity in the trenches.',
    tags:['Deep Learning','NLP','Research'],
  },
  {
    name:'Krishna Raj Barnwal', initials:'KB', position:'ML Engineer',        specialty:'Computer Vision & Systems',
    photo:'/members/krishna.jpg', crop:'50% 16%',
    gradient:'linear-gradient(135deg,#0066ff,#00d4ff)',    glow:'#00d4ff',
    quote:'Systems thinking is underrated in ML. A model that trains in half the time lets you run twice the experiments. Speed is a research strategy.',
    tags:['CV','Systems','ML'],
  },
  {
    name:'Coming Soon',      initials:'?',  position:'GRID Member',           specialty:'Details coming soon…',
    photo: null, crop:'50% 20%',
    gradient:'linear-gradient(135deg,#0052cc,#00d4ff)',    glow:'#0052cc',
    quote:'Something exciting is on its way. Stay tuned.',
    tags:['GRID'],
  },
  {
    name:'Aditya Gaurav',    initials:'AG', position:'ML Researcher',         specialty:'Machine Learning & AI',
    photo:'/members/aditya.jpg', crop:'50% 22%',
    gradient:'linear-gradient(135deg,#0052cc,#7b2fff)',    glow:'#6366f1',
    quote:'Every model is a hypothesis about the world. I love the moment when the loss curve shows you that your hypothesis was right.',
    tags:['ML','Research','AI'],
  },
  {
    name:'Member 6',         initials:'M6', position:'Researcher',            specialty:'GRID Community',
    photo:'/members/om.png', crop:'50% 14%',
    gradient:'linear-gradient(135deg,#00d4ff,#4ade80)',    glow:'#4ade80',
    quote:'Details coming soon.',
    tags:['Research','ML'],
  },
  {
    name:'Member 7',         initials:'M7', position:'Researcher',            specialty:'GRID Community',
    photo:'/members/member7.jpg', crop:'50% 18%',
    gradient:'linear-gradient(135deg,#f59e0b,#ec4899)',    glow:'#f59e0b',
    quote:'Details coming soon.',
    tags:['Research','ML'],
  },
  {
    name:'Coming Soon',      initials:'?',  position:'GRID Member',           specialty:'Details coming soon…',
    photo: null, crop:'50% 20%',
    gradient:'linear-gradient(135deg,#7b2fff,#ec4899)',    glow:'#7b2fff',
    quote:'Something exciting is on its way. Stay tuned.',
    tags:['GRID'],
  },
  {
    name:'Coming Soon',      initials:'?',  position:'GRID Member',           specialty:'Details coming soon…',
    photo: null, crop:'50% 20%',
    gradient:'linear-gradient(135deg,#4ade80,#0066ff)',    glow:'#4ade80',
    quote:'Something exciting is on its way. Stay tuned.',
    tags:['GRID'],
  },
]

/* ─── Shared ──────────────────────────────────────────────────────────────── */
const jak = '"Plus Jakarta Sans",sans-serif'

/* Unified color grade so photos shot in wildly different light (night street,
   beach glare, indoor doorway) read as one cohesive, deliberate team page.  */
const PHOTO_GRADE = 'contrast(1.1) saturate(0.9) brightness(0.98)'

/* Full-bleed portrait banner — tall aspect so the frame reads head → chest →
   stomach instead of a cramped headshot. Vignette + scrim tame busy real-world
   backgrounds so the person, not the location, is what the eye lands on. */
function BannerPhoto({ p, ratio = '4 / 5' }) {
  if (p.photo) {
    return (
      <>
        <img
          src={p.photo} alt={p.name}
          style={{
            position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', objectPosition:p.crop || '50% 15%',
            filter:PHOTO_GRADE,
          }}
        />
        {/* Vignette — darkens cluttered edges/background, keeps center crisp */}
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 80% 70% at 50% 38%, transparent 45%, rgba(2,2,14,0.62) 100%)` }} />
        {/* Cool duotone wash in the card's accent color for cohesion across photos */}
        <div style={{ position:'absolute', inset:0, background:p.glow, opacity:0.08, mixBlendMode:'overlay' }} />
        {/* Bottom scrim so content below reads cleanly against dark card body */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'46%',
          background:'linear-gradient(to top, rgba(5,5,20,0.99) 0%, rgba(5,5,20,0.7) 40%, transparent 100%)' }} />
      </>
    )
  }
  return (
    <>
      <div style={{ position:'absolute', inset:0, background:p.gradient, opacity:0.18 }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${p.glow}09 1px,transparent 1px),linear-gradient(90deg,${p.glow}09 1px,transparent 1px)`, backgroundSize:'30px 30px' }} />
      <div style={{ position:'absolute', top:'-8%', left:'50%', transform:'translateX(-50%)', width:'100%', height:'55%', background:`radial-gradient(circle,${p.glow}30 0%,transparent 65%)`, filter:'blur(40px)' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%', background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:-14, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}35 0%,transparent 70%)`, filter:'blur(16px)' }} />
          <div style={{ width:120, height:120, borderRadius:'50%', background:p.gradient, display:'flex', alignItems:'center', justifyContent:'center',
            border:'2.5px solid rgba(255,255,255,0.15)', boxShadow:`0 0 55px ${p.glow}45, 0 14px 44px rgba(0,0,0,0.6)` }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)' }} />
            <span style={{ fontFamily:jak, fontWeight:900, fontSize:40, color:'#fff', letterSpacing:'-0.02em', position:'relative', zIndex:1 }}>{p.initials}</span>
          </div>
        </div>
      </div>
    </>
  )
}

function Tags({ tags, glow }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
      {tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', fontFamily:jak, padding:'4px 10px', borderRadius:100, background:`${glow}0d`, border:`1px solid ${glow}24`, color:glow }}>{t}</span>)}
    </div>
  )
}

function VerifiedRow({ p, size = 10.5 }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
      <BadgeCheck style={{ width:size+3, height:size+3, color:p.glow }} />
      <span style={{ fontFamily:jak, fontSize:size, color:'rgba(140,160,190,0.6)', fontWeight:600, letterSpacing:'0.04em' }}>Verified Researcher</span>
    </div>
  )
}

/* ─── VARIANT 0 — "Grand Portrait" — tall cover shot, name overlaid on photo ── */
function CardAurora({ p }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))' }}>
      <div style={{ aspectRatio:'4 / 5', width:'100%', position:'relative', overflow:'hidden', flexShrink:0 }}>
        <BannerPhoto p={p} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:p.gradient, zIndex:2 }} />
        <div style={{ position:'absolute', top:16, right:16, width:14, height:14, borderRadius:'50%', background:'#4ade80', border:'2px solid #060618', boxShadow:'0 0 10px #4ade80', zIndex:2 }} />
        {/* Name + role overlaid directly on the photo, editorial-cover style */}
        <div style={{ position:'absolute', left:24, right:24, bottom:20, zIndex:2 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:23, color:'#f6f9ff', letterSpacing:'-0.025em', marginBottom:5, textShadow:'0 2px 18px rgba(0,0,0,0.7)' }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'#fff', opacity:0.92 }}>{p.position}</div>
        </div>
      </div>
      <div style={{ padding:'20px 26px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ marginBottom:12 }}>
          <VerifiedRow p={p} />
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,${p.glow}22,transparent)`, marginBottom:14 }} />
        <div style={{ position:'relative', flex:1, marginBottom:18 }}>
          <Quote style={{ width:18, height:18, color:p.glow, opacity:0.38, position:'absolute', top:-2, left:-2 }} />
          <p style={{ fontFamily:jak, fontSize:13.5, lineHeight:1.72, color:'rgba(180,195,215,0.82)', paddingLeft:22, fontStyle:'italic', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        </div>
        <Tags tags={p.tags} glow={p.glow} />
      </div>
    </div>
  )
}

/* ─── VARIANT 1 — "Side Dossier" — photo left rail, info stacked right ─────── */
function CardAngular({ p }) {
  return (
    <div className="flex flex-col sm:flex-row" style={{ height:'100%', background:'rgba(4,4,16,0.99)', position:'relative' }}>
      <div className="w-full sm:w-[46%]" style={{ position:'relative', overflow:'hidden', flexShrink:0, aspectRatio:'4 / 5' }}>
        <BannerPhoto p={p} />
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:4, background:p.gradient, zIndex:2 }} className="hidden sm:block" />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:p.gradient, zIndex:2 }} className="sm:hidden" />
        <div style={{ position:'absolute', top:16, left:16, zIndex:2 }}>
          <span style={{ fontFamily:jak, fontWeight:700, fontSize:9.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.85)', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)', padding:'4px 10px', borderRadius:100 }}>{p.position}</span>
        </div>
      </div>
      <div style={{ flex:1, padding:'22px 24px 26px', display:'flex', flexDirection:'column' }}>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:21, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:4 }}>{p.name}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(140,160,190,0.58)', fontFamily:jak }}>
            <Zap style={{ width:11, height:11, color:p.glow }} />{p.specialty}
          </div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,${p.glow}20,transparent)`, marginBottom:14 }} />
        <p style={{ fontFamily:jak, fontSize:13.5, lineHeight:1.72, color:'rgba(180,195,215,0.82)', fontStyle:'italic', flex:1, marginBottom:18, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>&ldquo;{p.quote}&rdquo;</p>
        <Tags tags={p.tags} glow={p.glow} />
      </div>
    </div>
  )
}

/* ─── VARIANT 2 — "Radar Iris" — centered portrait framed by concentric rings ── */
function CardHex({ p }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(5,5,20,0.99),rgba(3,3,14,0.98))' }}>
      <div style={{ aspectRatio:'4 / 5', width:'100%', position:'relative', overflow:'hidden', flexShrink:0,
        background: p.photo ? 'transparent' : `radial-gradient(ellipse at 50% 60%,${p.glow}16 0%,transparent 65%)` }}>
        <BannerPhoto p={p} />
        {[46,38,30,22,14].map((r,i) => <div key={i} style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:`${r*2}%`, height:`${r*2}%`, borderRadius:'50%', border:`1px solid ${p.glow}${p.photo ? ['10','0c','09','06','04'][i] : ['24','1c','14','0e','08'][i]}`, zIndex:1 }} />)}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:p.gradient, zIndex:2 }} />
        <div style={{ position:'absolute', top:16, right:16, width:14, height:14, borderRadius:'50%', background:'#4ade80', border:'2px solid #050514', boxShadow:'0 0 10px #4ade80', zIndex:2 }} />
      </div>
      <div style={{ padding:'22px 26px 28px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:21, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:5 }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:3 }}>{p.position}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.55)' }}>{p.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${p.glow}22,transparent)`, marginBottom:14 }} />
        <p style={{ fontFamily:jak, fontSize:13.5, lineHeight:1.72, color:'rgba(180,195,215,0.82)', fontStyle:'italic', flex:1, textAlign:'center', marginBottom:18, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <div style={{ display:'flex', justifyContent:'center' }}><Tags tags={p.tags} glow={p.glow} /></div>
      </div>
    </div>
  )
}

/* ─── VARIANT 3 — "Spectrum Dossier" — color rail + framed inset portrait ──── */
function CardRail({ p }) {
  return (
    <div style={{ height:'100%', display:'flex',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))' }}>
      <div style={{ width:8, flexShrink:0, background:p.gradient, boxShadow:`4px 0 24px ${p.glow}30` }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'22px 22px 0' }}>
          <div style={{ aspectRatio:'4 / 5', width:'100%', position:'relative', overflow:'hidden', borderRadius:16, border:`1px solid ${p.glow}2a` }}>
            <BannerPhoto p={p} />
            <div style={{ position:'absolute', bottom:12, right:12, width:14, height:14, borderRadius:'50%', background:'#4ade80', border:'2.5px solid #060618', boxShadow:'0 0 12px #4ade80', zIndex:2 }} />
          </div>
        </div>
        <div style={{ padding:'18px 22px 24px', display:'flex', flexDirection:'column', flex:1 }}>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:20, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:3 }}>{p.name}</div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:3 }}>{p.position}</div>
            <div style={{ fontFamily:jak, fontSize:12, color:'rgba(140,160,190,0.55)' }}>{p.specialty}</div>
          </div>
          <p style={{ fontFamily:jak, fontSize:13.5, lineHeight:1.7, color:'rgba(180,195,215,0.8)', fontStyle:'italic', flex:1, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
          <Tags tags={p.tags} glow={p.glow} />
        </div>
      </div>
    </div>
  )
}

/* ─── VARIANT 4 — "HUD Portrait" — tall cover shot with HUD brackets + index ── */
function CardPrism({ p, uid }) {
  const br = { position:'absolute', width:20, height:20 }
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'rgba(3,3,14,0.99)', position:'relative' }}>
      <style>{`@keyframes shimmer_m${uid}{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      <div style={{ position:'absolute', inset:0, borderRadius:'inherit', padding:1, zIndex:0,
        background:`linear-gradient(120deg,${p.glow}55,transparent 30%,transparent 70%,${p.glow}55)`,
        backgroundSize:'220% 220%', animation:`shimmer_m${uid} 5s linear infinite`,
        WebkitMask:'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
        WebkitMaskComposite:'xor', maskComposite:'exclude', pointerEvents:'none' }} />
      <div style={{ aspectRatio:'4 / 5', width:'100%', position:'relative', overflow:'hidden', flexShrink:0, borderBottom:`1px solid ${p.glow}14` }}>
        <BannerPhoto p={p} />
        <div style={{ position:'absolute', right:12, bottom:'34%', fontFamily:jak, fontWeight:900, fontSize:100, color:`${p.glow}${p.photo ? '07' : '09'}`, lineHeight:1, userSelect:'none', pointerEvents:'none', zIndex:1 }}>{String(uid+1).padStart(2,'0')}</div>
        <div style={{ ...br, top:14, left:14, borderTop:`2px solid ${p.glow}55`, borderLeft:`2px solid ${p.glow}55`, zIndex:2 }} />
        <div style={{ ...br, top:14, right:14, borderTop:`2px solid ${p.glow}55`, borderRight:`2px solid ${p.glow}55`, zIndex:2 }} />
        <div style={{ ...br, bottom:'20%', left:14, borderBottom:`2px solid ${p.glow}55`, borderLeft:`2px solid ${p.glow}55`, zIndex:2 }} />
        <div style={{ ...br, bottom:'20%', right:14, borderBottom:`2px solid ${p.glow}55`, borderRight:`2px solid ${p.glow}55`, zIndex:2 }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:p.gradient, zIndex:2 }} />
        <div style={{ position:'absolute', top:18, left:18, display:'flex', alignItems:'center', gap:5, zIndex:2 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} />
          <span style={{ fontFamily:jak, fontSize:9.5, color:'rgba(74,222,128,0.7)', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Online</span>
        </div>
        {!p.photo && (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10, zIndex:1 }}>
            <div style={{ width:120, height:120, borderRadius:'50%', background:p.gradient, display:'flex', alignItems:'center', justifyContent:'center',
              border:'2.5px solid rgba(255,255,255,0.15)', boxShadow:`0 0 55px ${p.glow}45` }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)' }} />
              <span style={{ fontFamily:jak, fontWeight:900, fontSize:40, color:'#fff', letterSpacing:'-0.02em', position:'relative', zIndex:1 }}>{p.initials}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:`${p.glow}80`, fontFamily:jak, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>
              <Sparkles style={{ width:10, height:10 }} />{p.position}
            </div>
          </div>
        )}
        <div style={{ position:'absolute', left:20, right:20, bottom:16, zIndex:2 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:21, color:'#f6f9ff', letterSpacing:'-0.025em', textShadow:'0 2px 18px rgba(0,0,0,0.7)' }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:10.5, letterSpacing:'0.15em', textTransform:'uppercase', color:p.photo ? '#fff' : `${p.glow}c8`, opacity:0.9, marginTop:2 }}>{p.position}</div>
        </div>
      </div>
      <div style={{ padding:'18px 24px 26px', display:'flex', flexDirection:'column', flex:1, position:'relative', zIndex:1 }}>
        <p style={{ fontFamily:jak, fontSize:13.5, lineHeight:1.72, color:'rgba(180,195,215,0.82)', fontStyle:'italic', flex:1, marginBottom:18, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <Tags tags={p.tags} glow={p.glow} />
        </div>
      </div>
    </div>
  )
}

const VARIANTS = [CardAurora, CardAngular, CardHex, CardRail, CardPrism]

function FaceCard({ p, i }) {
  const [hov, setHov] = useState(false)
  const V = VARIANTS[i % VARIANTS.length]
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ delay: i * 0.07, duration: 0.6, ease:'easeOut' }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        borderRadius:24, overflow:'hidden',
        border:`1px solid ${hov ? p.glow+'40' : p.glow+'14'}`,
        boxShadow: hov ? `0 40px 96px rgba(0,0,0,0.72),0 0 80px ${p.glow}18` : `0 18px 52px rgba(0,0,0,0.5)`,
        transform: hov ? 'translateY(-9px) scale(1.008)' : 'translateY(0) scale(1)',
        transition:'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        display:'flex', flexDirection:'column', position:'relative', height:'100%',
      }}
    >
      <V p={p} hov={hov} uid={i} />
    </motion.div>
  )
}

export default function Members() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) el.scrollIntoView({ behavior:'auto', block:'start' })
    }
  }, [])
  return (
    <div style={{ background:'#02020e' }}>
      <FloatingLogos />

      {/* ── Hero ── */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div style={{ position:'absolute', top:'-15%', left:'30%', width:500, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(0,102,255,0.1) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <span className="tag mb-6 inline-flex items-center gap-2">
              <Brain style={{ width:11, height:11 }} /> ML Researchers
            </span>
            <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.04em', color:'#f0f6ff', marginBottom:18, lineHeight:1.1 }}>
              THE <span className="text-gradient">RESEARCHERS</span>
            </h1>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(160,180,210,0.78)', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
              12,000+ ML researchers, engineers, and practitioners — training models, reading papers,
              and building things that push the field forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ MEET THE FACES ══════════════ */}
      <section id="faces" style={{ padding:'72px 0 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,30,80,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:900, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(0,82,204,0.07) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1360, margin:'0 auto', padding:'0 24px' }}>

          <motion.div
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.65 }}
            style={{ textAlign:'center', marginBottom:56 }}
          >
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:9.5, fontWeight:700, letterSpacing:'0.32em', textTransform:'uppercase', color:'rgba(0,212,255,0.55)', display:'block', marginBottom:14 }}>
              Who built this
            </span>
            <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.8rem)', letterSpacing:'-0.04em', color:'#f0f6ff', lineHeight:1.1, marginBottom:16 }}>
              The faces <span style={{ background:'linear-gradient(135deg,#0066ff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>behind GRID.</span>
            </h2>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16, color:'rgba(160,180,210,0.7)', maxWidth:560, margin:'0 auto', lineHeight:1.75 }}>
              Nine ML researchers and engineers who decided the community they wanted
              to be part of didn't exist — so they built it from zero.
            </p>
          </motion.div>

          <div
            className="grid gap-5 sm:gap-6"
            style={{ gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))' }}
          >
            {FACES.map((p, i) => <FaceCard key={`${p.name}-${i}`} p={p} i={i} />)}
          </div>
        </div>

        <div style={{ marginTop:64, height:1, background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.15),transparent)', maxWidth:900, margin:'64px auto 0' }} />
      </section>

    </div>
  )
}
