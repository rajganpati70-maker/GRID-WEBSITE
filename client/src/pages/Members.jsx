import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Quote, Sparkles, Hexagon, Zap, Star, Award } from 'lucide-react'
import FloatingLogos from '../components/FloatingLogos'

/* ─── Core team data ─────────────────────────────────────────────────────── */
const FACES = [
  {
    name:'Moumita Mandal',   initials:'MM', position:'Community Lead',        specialty:'ML Research & Community',
    photo:'/members/moumita.jpg',
    gradient:'linear-gradient(135deg,#ec4899,#7b2fff)',    glow:'#ec4899',
    quote:'Building a community means creating a space where every researcher feels their question matters — no question is too basic when you\'re pushing the frontier.',
    tags:['Research','Community','ML'],
  },
  {
    name:'Ritusree Chanda',  initials:'RC', position:'Research Associate',    specialty:'Deep Learning',
    photo:'/members/ritusree.jpg',
    gradient:'linear-gradient(135deg,#7b2fff,#00d4ff)',    glow:'#7b2fff',
    quote:'The best part of GRID is finding someone at 2am who has hit the exact same gradient explosion bug you have. Solidarity in the trenches.',
    tags:['Deep Learning','NLP','Research'],
  },
  {
    name:'Krishna Raj Barnwal', initials:'KB', position:'ML Engineer',        specialty:'Computer Vision & Systems',
    photo:'/members/krishna.jpg',
    gradient:'linear-gradient(135deg,#0066ff,#00d4ff)',    glow:'#00d4ff',
    quote:'Systems thinking is underrated in ML. A model that trains in half the time lets you run twice the experiments. Speed is a research strategy.',
    tags:['CV','Systems','ML'],
  },
  {
    name:'Coming Soon',      initials:'?',  position:'GRID Member',           specialty:'Details coming soon…',
    photo: null,
    gradient:'linear-gradient(135deg,#0052cc,#00d4ff)',    glow:'#0052cc',
    quote:'Something exciting is on its way. Stay tuned.',
    tags:['GRID'],
  },
  {
    name:'Aditya Gaurav',    initials:'AG', position:'ML Researcher',         specialty:'Machine Learning & AI',
    photo:'/members/aditya.jpg',
    gradient:'linear-gradient(135deg,#0052cc,#7b2fff)',    glow:'#6366f1',
    quote:'Every model is a hypothesis about the world. I love the moment when the loss curve shows you that your hypothesis was right.',
    tags:['ML','Research','AI'],
  },
  {
    name:'Member 6',         initials:'M6', position:'Researcher',            specialty:'GRID Community',
    photo:'/members/om.png',
    gradient:'linear-gradient(135deg,#00d4ff,#4ade80)',    glow:'#4ade80',
    quote:'Details coming soon.',
    tags:['Research','ML'],
  },
  {
    name:'Member 7',         initials:'M7', position:'Researcher',            specialty:'GRID Community',
    photo:'/members/member7.jpg',
    gradient:'linear-gradient(135deg,#f59e0b,#ec4899)',    glow:'#f59e0b',
    quote:'Details coming soon.',
    tags:['Research','ML'],
  },
]

/* ─── Shared ──────────────────────────────────────────────────────────────── */
const jak = '"Plus Jakarta Sans",sans-serif'

function FacePhoto({ p, size, borderRadius='50%' }) {
  const wrap = {
    width:size, height:size, borderRadius, overflow:'hidden', flexShrink:0, position:'relative',
    border:'2.5px solid rgba(255,255,255,0.15)',
    boxShadow:`0 0 55px ${p.glow}45, 0 14px 44px rgba(0,0,0,0.6)`,
  }
  if (p.photo) return (
    <div style={wrap}>
      <img src={p.photo} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
    </div>
  )
  return (
    <div style={{ ...wrap, background:p.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)' }} />
      <span style={{ fontFamily:jak, fontWeight:900, fontSize:Math.round(size/3), color:'#fff', letterSpacing:'-0.02em', position:'relative', zIndex:1 }}>{p.initials}</span>
    </div>
  )
}

function Tags({ tags, glow }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
      {tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', fontFamily:jak, padding:'4px 10px', borderRadius:100, background:`${glow}0d`, border:`1px solid ${glow}24`, color:glow }}>{t}</span>)}
    </div>
  )
}

/* ─── VARIANT 0 — "Grand Portrait": full-bleed gradient banner, giant circle ── */
function CardAurora({ p }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))' }}>
      {/* Full-bleed banner 220px */}
      <div style={{ height:220, position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', inset:0, background:p.gradient, opacity:0.18 }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${p.glow}09 1px,transparent 1px),linear-gradient(90deg,${p.glow}09 1px,transparent 1px)`, backgroundSize:'30px 30px' }} />
        <div style={{ position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)', width:360, height:260, background:`radial-gradient(circle,${p.glow}30 0%,transparent 65%)`, filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:p.gradient }} />
        {/* Large circle — real photo when available */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-14, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}35 0%,transparent 70%)`, filter:'blur(16px)' }} />
            <FacePhoto p={p} size={112} borderRadius='50%' />
            <div style={{ position:'absolute', bottom:5, right:5, width:18, height:18, borderRadius:'50%', background:'#4ade80', border:'2.5px solid #060618', boxShadow:'0 0 14px #4ade80' }} />
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'22px 26px 28px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:20, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:5 }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:4 }}>{p.position}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.58)' }}>{p.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${p.glow}22,transparent)`, margin:'4px 0 16px' }} />
        <div style={{ position:'relative', flex:1, marginBottom:18 }}>
          <Quote style={{ width:18, height:18, color:p.glow, opacity:0.38, position:'absolute', top:-2, left:-2 }} />
          <p style={{ fontFamily:jak, fontSize:13, lineHeight:1.72, color:'rgba(180,195,215,0.82)', paddingLeft:22, fontStyle:'italic', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        </div>
        <Tags tags={p.tags} glow={p.glow} />
      </div>
    </div>
  )
}

/* ─── VARIANT 1 — "Cinematic Slash": diagonal color cut, watermark name ──────── */
function CardAngular({ p }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'rgba(4,4,16,0.99)', position:'relative' }}>
      {/* Banner with diagonal slash */}
      <div style={{ height:220, position:'relative', overflow:'hidden', flexShrink:0 }}>
        {/* Full gradient fill */}
        <div style={{ position:'absolute', inset:0, background:p.gradient }} />
        {/* Dark overlay diagonal right */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(4,4,16,0) 0%,rgba(4,4,16,0.9) 100%)', clipPath:'polygon(42% 0,100% 0,100% 100%,30% 100%)' }} />
        {/* Scan lines */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 5px,rgba(0,0,0,0.1) 5px,rgba(0,0,0,0.1) 6px)' }} />
        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(4,4,16,0.99),transparent)' }} />
        {/* Photo left / watermark initials fallback */}
        <div style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)' }}>
          {p.photo
            ? <div style={{ width:88, height:88, borderRadius:'50%', overflow:'hidden', border:'2.5px solid rgba(255,255,255,0.18)', boxShadow:`0 0 36px ${p.glow}45` }}>
                <img src={p.photo} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
              </div>
            : <span style={{ fontFamily:jak, fontWeight:900, fontSize:96, color:'rgba(0,0,0,0.38)', lineHeight:1, letterSpacing:'-0.05em', display:'block' }}>{p.initials}</span>
          }
        </div>
        {/* Role badge top-right */}
        <div style={{ position:'absolute', top:18, right:18, zIndex:2 }}>
          <span style={{ fontFamily:jak, fontWeight:700, fontSize:9.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.75)', background:'rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.15)', padding:'4px 10px', borderRadius:100 }}>{p.position}</span>
        </div>
        {/* Shimmer border on gradient side */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:p.gradient }} />
      </div>
      {/* Content */}
      <div style={{ padding:'18px 24px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:20, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:3 }}>{p.name}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(140,160,190,0.58)', fontFamily:jak }}>
            <Zap style={{ width:11, height:11, color:p.glow }} />{p.specialty}
          </div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,${p.glow}20,transparent)`, marginBottom:14 }} />
        <p style={{ fontFamily:jak, fontSize:13, lineHeight:1.72, color:'rgba(180,195,215,0.82)', fontStyle:'italic', flex:1, marginBottom:18, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>&ldquo;{p.quote}&rdquo;</p>
        <Tags tags={p.tags} glow={p.glow} />
      </div>
    </div>
  )
}

/* ─── VARIANT 2 — "Radar Iris": concentric rings banner, centered portrait ───── */
function CardHex({ p }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'linear-gradient(160deg,rgba(5,5,20,0.99),rgba(3,3,14,0.98))' }}>
      {/* Radar banner */}
      <div style={{ height:220, position:'relative', overflow:'hidden', flexShrink:0, background:`radial-gradient(ellipse at 50% 60%,${p.glow}16 0%,transparent 65%)` }}>
        {/* Concentric rings */}
        {[100,80,60,40,20].map((r,i) => <div key={i} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:r*2, height:r*2, borderRadius:'50%', border:`1px solid ${p.glow}${['24','1c','14','0e','08'][i]}` }} />)}
        {/* Crosshair */}
        <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${p.glow}1c,transparent)`, transform:'translateY(-50%)' }} />
        <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:1, background:`linear-gradient(180deg,transparent,${p.glow}1c,transparent)`, transform:'translateX(-50%)' }} />
        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(5,5,20,0.99),transparent)' }} />
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:p.gradient }} />
        {/* Centered avatar — real photo when available */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'relative' }}>
            <FacePhoto p={p} size={96} borderRadius='50%' />
            <div style={{ position:'absolute', bottom:0, right:0, width:14, height:14, borderRadius:'50%', background:'#4ade80', border:'2px solid #050514', boxShadow:'0 0 10px #4ade80' }} />
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'20px 26px 26px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:20, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:5 }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:3 }}>{p.position}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.55)' }}>{p.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${p.glow}22,transparent)`, marginBottom:14 }} />
        <p style={{ fontFamily:jak, fontSize:13, lineHeight:1.72, color:'rgba(180,195,215,0.82)', fontStyle:'italic', flex:1, textAlign:'center', marginBottom:18, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <div style={{ display:'flex', justifyContent:'center' }}><Tags tags={p.tags} glow={p.glow} /></div>
      </div>
    </div>
  )
}

/* ─── VARIANT 3 — "Spectrum Rail": wide left gradient rail + editorial layout ── */
function CardRail({ p }) {
  return (
    <div style={{ height:'100%', display:'flex',
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(3,3,14,0.98))' }}>
      {/* Left rail */}
      <div style={{ width:8, flexShrink:0, background:p.gradient, boxShadow:`4px 0 24px ${p.glow}30` }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Banner */}
        <div style={{ height:220, position:'relative', overflow:'hidden', flexShrink:0 }}>
          <div style={{ position:'absolute', inset:0, background:p.gradient, opacity:0.13 }} />
          {/* Horizontal scan bands */}
          {[0,1,2,3].map(i => <div key={i} style={{ position:'absolute', left:0, right:0, top:`${i*26}%`, height:'10%', background:`linear-gradient(90deg,${p.glow}08,${p.glow}14,${p.glow}08)` }} />)}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(6,6,24,0.99),transparent)' }} />
          {/* Photo / initials rotated square */}
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'relative' }}>
              {p.photo
                ? <div style={{ width:116, height:116, borderRadius:28, overflow:'hidden', transform:'rotate(-6deg)', border:'2px solid rgba(255,255,255,0.15)', boxShadow:`0 0 60px ${p.glow}50,0 16px 50px rgba(0,0,0,0.6)` }}>
                    <img src={p.photo} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', transform:'rotate(6deg) scale(1.15)' }} />
                  </div>
                : <div style={{ width:116, height:116, background:p.gradient, borderRadius:28, display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-6deg)', border:'2px solid rgba(255,255,255,0.14)', boxShadow:`0 0 60px ${p.glow}50,0 16px 50px rgba(0,0,0,0.6)` }}>
                    <div style={{ position:'absolute', inset:0, borderRadius:26, background:'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)' }} />
                    <span style={{ fontFamily:jak, fontWeight:900, fontSize:38, color:'#fff', letterSpacing:'-0.02em', transform:'rotate(6deg)', position:'relative', zIndex:1 }}>{p.initials}</span>
                  </div>
              }
              <div style={{ position:'absolute', bottom:2, right:-2, width:16, height:16, borderRadius:'50%', background:'#4ade80', border:'2.5px solid #060618', boxShadow:'0 0 12px #4ade80' }} />
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:'18px 22px 24px', display:'flex', flexDirection:'column', flex:1 }}>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:19, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:3 }}>{p.name}</div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:3 }}>{p.position}</div>
            <div style={{ fontFamily:jak, fontSize:12, color:'rgba(140,160,190,0.55)' }}>{p.specialty}</div>
          </div>
          <p style={{ fontFamily:jak, fontSize:13, lineHeight:1.7, color:'rgba(180,195,215,0.8)', fontStyle:'italic', flex:1, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
          <Tags tags={p.tags} glow={p.glow} />
        </div>
      </div>
    </div>
  )
}

/* ─── VARIANT 4 — "HUD Portrait": bracket corners, number watermark, neon glow ─ */
function CardPrism({ p, uid }) {
  const br = { position:'absolute', width:20, height:20 }
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'rgba(3,3,14,0.99)', position:'relative' }}>
      <style>{`@keyframes shimmer_m${uid}{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>
      {/* Animated shimmer border */}
      <div style={{ position:'absolute', inset:0, borderRadius:'inherit', padding:1, zIndex:0,
        background:`linear-gradient(120deg,${p.glow}55,transparent 30%,transparent 70%,${p.glow}55)`,
        backgroundSize:'220% 220%', animation:`shimmer_m${uid} 5s linear infinite`,
        WebkitMask:'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
        WebkitMaskComposite:'xor', maskComposite:'exclude', pointerEvents:'none' }} />
      {/* Banner */}
      <div style={{ height:220, position:'relative', overflow:'hidden', flexShrink:0, borderBottom:`1px solid ${p.glow}14` }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 60%,${p.glow}1c 0%,transparent 65%)` }} />
        {/* Watermark number */}
        <div style={{ position:'absolute', right:12, bottom:-8, fontFamily:jak, fontWeight:900, fontSize:110, color:`${p.glow}09`, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>{String(uid+1).padStart(2,'0')}</div>
        {/* HUD brackets */}
        <div style={{ ...br, top:14, left:14, borderTop:`2px solid ${p.glow}55`, borderLeft:`2px solid ${p.glow}55` }} />
        <div style={{ ...br, top:14, right:14, borderTop:`2px solid ${p.glow}55`, borderRight:`2px solid ${p.glow}55` }} />
        <div style={{ ...br, bottom:14, left:14, borderBottom:`2px solid ${p.glow}55`, borderLeft:`2px solid ${p.glow}55` }} />
        <div style={{ ...br, bottom:14, right:14, borderBottom:`2px solid ${p.glow}55`, borderRight:`2px solid ${p.glow}55` }} />
        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(3,3,14,0.99),transparent)' }} />
        {/* Top bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:p.gradient }} />
        {/* Center — real photo when available */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
          <FacePhoto p={p} size={100} borderRadius='50%' />
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:`${p.glow}80`, fontFamily:jak, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>
            <Sparkles style={{ width:10, height:10 }} />{p.position}
          </div>
        </div>
        {/* Online indicator */}
        <div style={{ position:'absolute', top:18, left:18, display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} />
          <span style={{ fontFamily:jak, fontSize:9.5, color:'rgba(74,222,128,0.7)', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Online</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:'20px 24px 26px', display:'flex', flexDirection:'column', flex:1, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:20, color:'#f0f6ff', letterSpacing:'-0.025em', marginBottom:4 }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontSize:12.5, color:'rgba(140,160,190,0.55)' }}>{p.specialty}</div>
        </div>
        <p style={{ fontFamily:jak, fontSize:13, lineHeight:1.72, color:'rgba(180,195,215,0.82)', textAlign:'center', fontStyle:'italic', flex:1, marginBottom:18, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <div style={{ display:'flex', justifyContent:'center' }}><Tags tags={p.tags} glow={p.glow} /></div>
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
        borderRadius:22, overflow:'hidden',
        border:`1px solid ${hov ? p.glow+'38' : p.glow+'12'}`,
        boxShadow: hov ? `0 36px 88px rgba(0,0,0,0.7),0 0 70px ${p.glow}14` : `0 16px 48px rgba(0,0,0,0.5)`,
        transform: hov ? 'translateY(-8px)' : 'translateY(0)',
        transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        display:'flex', flexDirection:'column', position:'relative', minHeight:520,
      }}
    >
      <V p={p} hov={hov} uid={i} />
    </motion.div>
  )
}

export default function Members() {
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
      <section style={{ padding:'72px 0 80px', position:'relative', overflow:'hidden' }}>
        {/* Background layers */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,30,80,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:900, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(0,82,204,0.07) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>

          {/* Heading */}
          <motion.div
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.65 }}
            style={{ textAlign:'center', marginBottom:52 }}
          >
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:9.5, fontWeight:700, letterSpacing:'0.32em', textTransform:'uppercase', color:'rgba(0,212,255,0.55)', display:'block', marginBottom:14 }}>
              Who built this
            </span>
            <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.8rem)', letterSpacing:'-0.04em', color:'#f0f6ff', lineHeight:1.1, marginBottom:16 }}>
              The faces <span style={{ background:'linear-gradient(135deg,#0066ff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>behind GRID.</span>
            </h2>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16, color:'rgba(160,180,210,0.7)', maxWidth:560, margin:'0 auto', lineHeight:1.75 }}>
              Seven ML researchers and engineers who decided the community they wanted
              to be part of didn't exist — so they built it from zero.
            </p>
          </motion.div>

          {/* Cards — horizontal scroll on mobile, 3-col grid on desktop */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
            gap:18,
          }}>
            {FACES.map((p, i) => <FaceCard key={p.name} p={p} i={i} />)}
          </div>
        </div>

        {/* Bottom fade + divider */}
        <div style={{ marginTop:64, height:1, background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.15),transparent)', maxWidth:900, margin:'64px auto 0' }} />
      </section>

    </div>
  )
}
