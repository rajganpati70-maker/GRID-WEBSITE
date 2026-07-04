import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Quote, Sparkles, Hexagon, Zap, Star, Award } from 'lucide-react'
import FloatingLogos from '../components/FloatingLogos'

/* ─── Core team data ─────────────────────────────────────────────────────── */
const FACES = [
  {
    name:'Aryan Sharma',    initials:'AS', position:'Founder & CEO',         specialty:'Deep Learning Research',
    gradient:'linear-gradient(135deg,#0052cc,#00d4ff)',    glow:'#00d4ff',
    quote:'We built GRID because the best ML conversations were happening in fragmented DMs. That problem deserved a real solution.',
    tags:['Transformers','LLMs','RLHF'],
  },
  {
    name:'Priya Nair',      initials:'PN', position:'Co-founder & CTO',       specialty:'MLOps & Infrastructure',
    gradient:'linear-gradient(135deg,#7b2fff,#00d4ff)',    glow:'#7b2fff',
    quote:'I obsess over the invisible work — the infra that lets 12,000 researchers collaborate without friction. If it feels seamless, we did our job.',
    tags:['Distributed Training','Kubernetes','Ray'],
  },
  {
    name:'Rahul Gupta',     initials:'RG', position:'Head of Research',       specialty:'NLP & Transformers',
    gradient:'linear-gradient(135deg,#0066ff,#7b2fff)',    glow:'#0066ff',
    quote:'Every week we read a paper together that most of the internet will misunderstand. That is exactly why this community exists.',
    tags:['NLP','BERT','Fine-tuning'],
  },
  {
    name:'Sneha Patel',     initials:'SP', position:'Computer Vision Lead',   specialty:'CNNs & Generative AI',
    gradient:'linear-gradient(135deg,#ec4899,#7b2fff)',    glow:'#ec4899',
    quote:'Diffusion models changed everything I thought I knew about generation. I want every CV researcher to have someone to work through that with.',
    tags:['CNNs','Diffusion','GANs'],
  },
  {
    name:'Vikram Singh',    initials:'VS', position:'RL Research Lead',       specialty:'Reinforcement Learning',
    gradient:'linear-gradient(135deg,#00d4ff,#4ade80)',    glow:'#4ade80',
    quote:'RL is the hardest subfield to learn alone. The reward signal is sparse and the feedback loops are long. Community changes that.',
    tags:['PPO','RLHF','Policy Gradient'],
  },
  {
    name:'Ananya Krishnan', initials:'AK', position:'Data Science Lead',      specialty:'Statistical ML & Analytics',
    gradient:'linear-gradient(135deg,#f59e0b,#ec4899)',    glow:'#f59e0b',
    quote:'Strong baselines beat fancy models in most real problems. I teach that, and GRID is where people finally start to believe it.',
    tags:['Statistics','XGBoost','Feature Eng.'],
  },
  {
    name:'Dev Malhotra',    initials:'DM', position:'Open Source Lead',       specialty:'ML Frameworks & Tools',
    gradient:'linear-gradient(135deg,#0052cc,#4ade80)',    glow:'#0052cc',
    quote:'If you have used a GRID training utility and it just worked — that was on purpose. Good tooling should be invisible.',
    tags:['PyTorch','JAX','Open Source'],
  },
  {
    name:'Riya Joshi',      initials:'RJ', position:'AI Safety Lead',         specialty:'Alignment & Responsible AI',
    gradient:'linear-gradient(135deg,#7b2fff,#f59e0b)',    glow:'#a78bfa',
    quote:'Safety is not a constraint on ML progress — it is a prerequisite for it. We built that into GRID from day one.',
    tags:['AI Safety','Alignment','Interpretability'],
  },
  {
    name:'Karan Mehta',     initials:'KM', position:'Education Lead',         specialty:'ML Curriculum & Teaching',
    gradient:'linear-gradient(135deg,#00d4ff,#0066ff)',    glow:'#00d4ff',
    quote:'Every concept in ML has a clean intuition underneath the notation. My job is to find it and hand it to you.',
    tags:['Curriculum','Mentorship','Research'],
  },
]

/* ─── Shared bits ─────────────────────────────────────────────────────────── */
const jak = '"Plus Jakarta Sans",sans-serif'

function TagPills({ tags, glow, size='sm' }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
      {tags.map(t => (
        <span key={t} style={{
          fontSize: size==='sm' ? 9.5 : 10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
          fontFamily:jak, padding:'3px 9px', borderRadius:100,
          background:`${glow}0c`, border:`1px solid ${glow}22`, color:glow,
        }}>{t}</span>
      ))}
    </div>
  )
}

/* ─── VARIANT 0 — "Aurora Glass": classic centered glass card ──────────────── */
function CardAurora({ p, hov }) {
  return (
    <>
      <div style={{ height:3, background:p.gradient, flexShrink:0 }} />
      <div style={{ position:'absolute', top:-50, right:-50, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}0e 0%,transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ padding:'28px 26px 24px', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:22 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:p.gradient, opacity:0.3, filter:'blur(6px)' }} />
            <div style={{
              width:72, height:72, borderRadius:'50%', background:p.gradient,
              display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
              border:'2px solid rgba(255,255,255,0.1)', boxShadow:`0 4px 20px ${p.glow}30`,
            }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%)', pointerEvents:'none' }} />
              <span style={{ fontFamily:jak, fontWeight:800, fontSize:22, color:'#fff', letterSpacing:'-0.02em' }}>{p.initials}</span>
            </div>
            <div style={{ position:'absolute', bottom:3, right:3, width:13, height:13, borderRadius:'50%', background:'#4ade80', border:'2px solid #02020e', boxShadow:'0 0 8px #4ade80' }} />
          </div>
          <div>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', letterSpacing:'-0.02em', lineHeight:1.2 }}>{p.name}</div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:10.5, letterSpacing:'0.12em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginTop:3 }}>{p.position}</div>
            <div style={{ fontFamily:jak, fontSize:11.5, color:'rgba(140,160,190,0.55)', marginTop:2 }}>{p.specialty}</div>
          </div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,${p.glow}18,transparent)`, marginBottom:18 }} />
        <div style={{ position:'relative', flex:1 }}>
          <Quote style={{ width:18, height:18, color:p.glow, opacity:0.4, position:'absolute', top:-4, left:-2 }} />
          <p style={{ fontFamily:jak, fontSize:13, lineHeight:1.72, color:'rgba(180,195,215,0.82)', paddingLeft:22, fontStyle:'italic', display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        </div>
        <div style={{ marginTop:18 }}><TagPills tags={p.tags} glow={p.glow} /></div>
      </div>
    </>
  )
}

/* ─── VARIANT 1 — "Angular Cut": clipped corner, banded header ─────────────── */
function CardAngular({ p, hov }) {
  return (
    <div style={{
      clipPath:'polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)',
      background:'linear-gradient(160deg,rgba(8,8,26,0.99),rgba(4,4,18,0.97))',
      height:'100%', display:'flex', flexDirection:'column', position:'relative',
    }}>
      <div style={{ position:'absolute', top:0, right:0, width:34, height:34, background:p.gradient, opacity:0.9, clipPath:'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div style={{ position:'absolute', top:-40, left:-40, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}12 0%,transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ padding:'24px 24px 0', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <div style={{
            width:58, height:58, flexShrink:0, borderRadius:14, background:p.gradient,
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'1px solid rgba(255,255,255,0.12)', boxShadow: hov ? `0 8px 28px ${p.glow}45` : `0 4px 16px ${p.glow}25`,
            transform: hov ? 'rotate(-4deg) scale(1.04)' : 'rotate(0deg)', transition:'all 0.35s ease',
          }}>
            <span style={{ fontFamily:jak, fontWeight:800, fontSize:18, color:'#fff' }}>{p.initials}</span>
          </div>
          <div style={{ borderLeft:`2px solid ${p.glow}30`, paddingLeft:14 }}>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:15.5, color:'#f0f6ff', letterSpacing:'-0.02em' }}>{p.name}</div>
            <div style={{ fontFamily:jak, fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:p.glow, marginTop:3 }}>{p.position}</div>
          </div>
        </div>
        <div style={{ fontSize:11, fontFamily:jak, color:'rgba(140,160,190,0.6)', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
          <Zap style={{ width:12, height:12, color:p.glow }} /> {p.specialty}
        </div>
        <p style={{ fontFamily:jak, fontSize:12.5, lineHeight:1.7, color:'rgba(180,195,215,0.8)', fontStyle:'italic', flex:1, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>&ldquo;{p.quote}&rdquo;</p>
      </div>
      <div style={{ padding:'16px 24px 26px', marginTop:14, background:`linear-gradient(180deg,transparent,${p.glow}08)` }}>
        <TagPills tags={p.tags} glow={p.glow} />
      </div>
    </div>
  )
}

/* ─── VARIANT 2 — "Hex Beacon": hexagon avatar, side spine ─────────────────── */
function CardHex({ p, hov }) {
  return (
    <div style={{ display:'flex', height:'100%', background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(4,4,18,0.97))' }}>
      <div style={{ width:6, flexShrink:0, background:p.gradient }} />
      <div style={{ flex:1, padding:'28px 24px', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:180, height:180, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}10 0%,transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}>
          <div style={{ position:'relative', width:80, height:88 }}>
            <div style={{ position:'absolute', inset:-6, background:p.gradient, opacity:0.35, filter:'blur(10px)', clipPath:'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            <div style={{
              position:'absolute', inset:0, background:p.gradient, clipPath:'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display:'flex', alignItems:'center', justifyContent:'center', transform: hov?'scale(1.06)':'scale(1)', transition:'transform 0.35s ease',
              border:'1px solid rgba(255,255,255,0.15)',
            }}>
              <span style={{ fontFamily:jak, fontWeight:800, fontSize:20, color:'#fff' }}>{p.initials}</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', letterSpacing:'-0.02em' }}>{p.name}</div>
          <div style={{ fontFamily:jak, fontWeight:700, fontSize:10.5, letterSpacing:'0.12em', textTransform:'uppercase', color:p.glow, marginTop:4 }}>{p.position}</div>
          <div style={{ fontFamily:jak, fontSize:11, color:'rgba(140,160,190,0.55)', marginTop:3 }}>{p.specialty}</div>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${p.glow}30,transparent)`, marginBottom:16 }} />
        <p style={{ fontFamily:jak, fontSize:12.5, lineHeight:1.7, color:'rgba(180,195,215,0.8)', textAlign:'center', fontStyle:'italic', flex:1, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}><TagPills tags={p.tags} glow={p.glow} /></div>
      </div>
    </div>
  )
}

/* ─── VARIANT 3 — "Side Rail": vertical label rail + content ───────────────── */
function CardRail({ p, hov }) {
  return (
    <div style={{ display:'flex', height:'100%', background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(4,4,18,0.97))', position:'relative', overflow:'hidden' }}>
      <div style={{
        width:44, flexShrink:0, background:`linear-gradient(180deg,${p.glow}20,${p.glow}05)`,
        borderRight:`1px solid ${p.glow}22`, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 0',
      }}>
        <span style={{
          fontFamily:jak, fontWeight:800, fontSize:10.5, letterSpacing:'0.25em', textTransform:'uppercase',
          color:p.glow, writingMode:'vertical-rl', transform:'rotate(180deg)', whiteSpace:'nowrap',
        }}>{p.position}</span>
      </div>
      <div style={{ position:'absolute', bottom:-40, right:-40, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}0e 0%,transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ flex:1, padding:'24px 22px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{
            width:52, height:52, borderRadius:12, flexShrink:0, background:p.gradient,
            display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.1)',
            boxShadow: hov ? `0 6px 22px ${p.glow}40` : `0 3px 12px ${p.glow}20`,
          }}>
            <span style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#fff' }}>{p.initials}</span>
          </div>
          <div>
            <div style={{ fontFamily:jak, fontWeight:800, fontSize:15, color:'#f0f6ff', letterSpacing:'-0.02em' }}>{p.name}</div>
            <div style={{ fontFamily:jak, fontSize:11, color:'rgba(140,160,190,0.55)', marginTop:2 }}>{p.specialty}</div>
          </div>
        </div>
        <p style={{ fontFamily:jak, fontSize:12.5, lineHeight:1.7, color:'rgba(180,195,215,0.8)', fontStyle:'italic', flex:1, marginBottom:14, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <TagPills tags={p.tags} glow={p.glow} />
      </div>
    </div>
  )
}

/* ─── VARIANT 4 — "Prism Overlap": floating avatar, shimmer border ─────────── */
function CardPrism({ p, hov, uid }) {
  return (
    <div style={{
      height:'100%', position:'relative', paddingTop:38,
      background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(4,4,18,0.97))',
      border:'1px solid transparent', backgroundClip:'padding-box',
    }}>
      <style>{`
        @keyframes shimmer_${uid} { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
      `}</style>
      <div style={{
        position:'absolute', inset:0, borderRadius:'inherit', padding:1, zIndex:0,
        background:`linear-gradient(120deg, ${p.glow}55, transparent 30%, transparent 70%, ${p.glow}55)`,
        backgroundSize:'220% 220%', animation:`shimmer_${uid} 4s linear infinite`,
        WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite:'xor', maskComposite:'exclude', pointerEvents:'none',
      }} />
      <div style={{ position:'absolute', top:-34, left:'50%', transform:'translateX(-50%)', zIndex:2 }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', inset:-6, borderRadius:'50%', background:p.gradient, opacity:0.4, filter:'blur(10px)' }} />
          <div style={{
            width:68, height:68, borderRadius:'50%', background:p.gradient, position:'relative',
            display:'flex', alignItems:'center', justifyContent:'center', border:'3px solid #050514',
            boxShadow: hov ? `0 8px 26px ${p.glow}50` : `0 4px 16px ${p.glow}30`,
            transform: hov ? 'translateY(-3px)' : 'translateY(0)', transition:'transform 0.3s ease',
          }}>
            <span style={{ fontFamily:jak, fontWeight:800, fontSize:19, color:'#fff' }}>{p.initials}</span>
          </div>
        </div>
      </div>
      <div style={{ padding:'20px 24px 26px', display:'flex', flexDirection:'column', flex:1, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:14 }}>
          <div style={{ fontFamily:jak, fontWeight:800, fontSize:16, color:'#f0f6ff', letterSpacing:'-0.02em' }}>{p.name}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:jak, fontWeight:700, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:p.glow, marginTop:4 }}>
            <Sparkles style={{ width:11, height:11 }} /> {p.position}
          </div>
        </div>
        <p style={{ fontFamily:jak, fontSize:12.5, lineHeight:1.7, color:'rgba(180,195,215,0.8)', textAlign:'center', fontStyle:'italic', flex:1, marginBottom:16, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.quote}</p>
        <div style={{ display:'flex', justifyContent:'center' }}><TagPills tags={p.tags} glow={p.glow} /></div>
      </div>
    </div>
  )
}

const VARIANTS = [CardAurora, CardAngular, CardHex, CardRail, CardPrism]

/* ─── Individual face card ───────────────────────────────────────────────── */
function FaceCard({ p, i }) {
  const [hov, setHov] = useState(false)
  const Variant = VARIANTS[i % VARIANTS.length]
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ delay: i * 0.07, duration: 0.6, ease:'easeOut' }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        flexShrink:0, width:320, minHeight:400,
        borderRadius:22, overflow:'hidden',
        border:`1px solid ${hov ? p.glow+'32' : p.glow+'12'}`,
        boxShadow: hov
          ? `0 28px 72px rgba(0,0,0,0.65), 0 0 60px ${p.glow}10`
          : `0 12px 40px rgba(0,0,0,0.45)`,
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition:'all 0.35s cubic-bezier(0.22,1,0.36,1)',
        display:'flex', flexDirection:'column',
        position:'relative',
      }}
    >
      <Variant p={p} hov={hov} uid={i} />
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
              Nine ML researchers and engineers who decided the community they wanted
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
