import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Quote } from 'lucide-react'
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

/* ─── Individual face card ───────────────────────────────────────────────── */
function FaceCard({ p, i }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ delay: i * 0.07, duration: 0.6, ease:'easeOut' }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        flexShrink:0, width:320,
        borderRadius:22, overflow:'hidden',
        background:'linear-gradient(160deg,rgba(6,6,24,0.99),rgba(4,4,18,0.97))',
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
      {/* top gradient bar */}
      <div style={{ height:3, background:p.gradient, flexShrink:0 }} />

      {/* corner ambient */}
      <div style={{ position:'absolute', top:-50, right:-50, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle,${p.glow}0e 0%,transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ padding:'28px 26px 24px', flex:1, display:'flex', flexDirection:'column' }}>

        {/* Avatar row */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:22 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:p.gradient, opacity:0.3, filter:'blur(6px)' }} />
            <div style={{
              width:72, height:72, borderRadius:'50%', background:p.gradient,
              display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
              border:'2px solid rgba(255,255,255,0.1)',
              boxShadow:`0 4px 20px ${p.glow}30`,
            }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%)', pointerEvents:'none' }} />
              <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:22, color:'#fff', letterSpacing:'-0.02em' }}>{p.initials}</span>
            </div>
            {/* online dot */}
            <div style={{ position:'absolute', bottom:3, right:3, width:13, height:13, borderRadius:'50%', background:'#4ade80', border:'2px solid #02020e', boxShadow:'0 0 8px #4ade80' }} />
          </div>
          <div>
            <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:16, color:'#f0f6ff', letterSpacing:'-0.02em', lineHeight:1.2 }}>{p.name}</div>
            <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:10.5, letterSpacing:'0.12em', textTransform:'uppercase', background:p.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginTop:3 }}>{p.position}</div>
            <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11.5, color:'rgba(140,160,190,0.55)', marginTop:2 }}>{p.specialty}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:`linear-gradient(90deg,${p.glow}18,transparent)`, marginBottom:18 }} />

        {/* Quote */}
        <div style={{ position:'relative', flex:1 }}>
          <Quote style={{ width:18, height:18, color:p.glow, opacity:0.4, position:'absolute', top:-4, left:-2 }} />
          <p style={{
            fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13, lineHeight:1.72,
            color:'rgba(180,195,215,0.82)', paddingLeft:22, fontStyle:'italic',
            display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden',
          }}>{p.quote}</p>
        </div>

        {/* Tags */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:18 }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontSize:9.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
              fontFamily:'"Plus Jakarta Sans",sans-serif', padding:'3px 9px', borderRadius:100,
              background:`${p.glow}0c`, border:`1px solid ${p.glow}22`, color:p.glow,
            }}>{t}</span>
          ))}
        </div>
      </div>
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
