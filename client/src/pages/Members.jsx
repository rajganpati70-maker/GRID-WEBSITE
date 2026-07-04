import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Star, Brain, MapPin, ExternalLink, Quote } from 'lucide-react'
import axios from 'axios'

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

const ROLES = ['All', 'ML Researcher', 'ML Engineer', 'Data Scientist', 'NLP Engineer', 'Computer Vision', 'RL Engineer']

const MOCK_MEMBERS = [
  { id:1, username:'aryan_sharma',   role:'ML Researcher',   skills:['Transformers','PyTorch','RLHF'],     reputation:6820, joined:'2021', location:'Mumbai',    bio:'Deep learning researcher focused on LLM alignment and efficient fine-tuning. Previously at IIT, now building at GRID.' },
  { id:2, username:'priya_nair',     role:'ML Engineer',     skills:['MLOps','Kubernetes','Ray'],          reputation:5650, joined:'2021', location:'Bangalore', bio:'Production ML at scale. I obsess over latency, memory, and making model serving boring enough to be reliable.' },
  { id:3, username:'rahul_gupta',    role:'NLP Engineer',    skills:['BERT','Hugging Face','Python'],      reputation:4900, joined:'2022', location:'Delhi',     bio:'NLP practitioner. Spend most of my time reading papers, reproducing results, and writing about what actually works.' },
  { id:4, username:'sneha_patel',    role:'Computer Vision', skills:['CNNs','Diffusion','OpenCV'],         reputation:4200, joined:'2022', location:'Pune',      bio:'Computer vision researcher. Currently exploring diffusion models for medical imaging and 3D reconstruction.' },
  { id:5, username:'vikram_singh',   role:'RL Engineer',     skills:['PPO','RLHF','JAX'],                  reputation:3800, joined:'2023', location:'Hyderabad', bio:'Reinforcement learning from first principles. Working on applying RL to real-world robotics and decision systems.' },
  { id:6, username:'ananya_k',       role:'Data Scientist',  skills:['Feature Eng.','XGBoost','SQL'],      reputation:3300, joined:'2022', location:'Chennai',   bio:'Statistical ML and applied data science. Believe that strong baselines beat complex models in 80% of cases.' },
  { id:7, username:'dev_malhotra',   role:'ML Researcher',   skills:['PyTorch','JAX','Open Source'],       reputation:5100, joined:'2021', location:'Kolkata',   bio:'Open source ML tools maintainer. If youve used a GRID training utility, you probably ran my code.' },
  { id:8, username:'riya_joshi',     role:'ML Researcher',   skills:['AI Safety','Alignment','Ethics'],    reputation:4400, joined:'2022', location:'Ahmedabad', bio:'AI safety researcher. Working on interpretability, robustness, and making sure models do what we actually want.' },
  { id:9, username:'karan_mehta',    role:'ML Engineer',     skills:['Curriculum','Teaching','Research'],  reputation:3700, joined:'2023', location:'Jaipur',    bio:'ML educator and engineer. Built GRID learning paths from scratch. Believe every concept has a clean intuition.' },
]

const GRAD_COLORS = [
  'linear-gradient(135deg,#0052cc,#00d4ff)',
  'linear-gradient(135deg,#7b2fff,#00d4ff)',
  'linear-gradient(135deg,#0066ff,#7b2fff)',
  'linear-gradient(135deg,#ec4899,#7b2fff)',
  'linear-gradient(135deg,#00d4ff,#4ade80)',
  'linear-gradient(135deg,#f59e0b,#ec4899)',
  'linear-gradient(135deg,#0052cc,#4ade80)',
  'linear-gradient(135deg,#7b2fff,#f59e0b)',
  'linear-gradient(135deg,#00d4ff,#0066ff)',
]

const ROLE_COLORS = {
  'ML Researcher':   { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.22)'  },
  'ML Engineer':     { color:'#7b2fff', bg:'rgba(123,47,255,0.08)', border:'rgba(123,47,255,0.22)' },
  'Data Scientist':  { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.22)' },
  'NLP Engineer':    { color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.22)' },
  'Computer Vision': { color:'#ec4899', bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.22)' },
  'RL Engineer':     { color:'#0066ff', bg:'rgba(0,102,255,0.08)',  border:'rgba(0,102,255,0.22)'  },
  default:           { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.22)'  },
}

function roleMeta(role) {
  for (const key of Object.keys(ROLE_COLORS)) {
    if (role && role.toLowerCase().includes(key.toLowerCase())) return ROLE_COLORS[key]
  }
  return ROLE_COLORS.default
}

export default function Members() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/members').then(r => {
      setMembers(r.data.length > 0 ? r.data : MOCK_MEMBERS)
    }).catch(() => setMembers(MOCK_MEMBERS)).finally(() => setLoading(false))
  }, [])

  const filtered = members.filter(m => {
    const matchSearch = m.username?.toLowerCase().includes(search.toLowerCase()) ||
      m.role?.toLowerCase().includes(search.toLowerCase()) ||
      m.bio?.toLowerCase().includes(search.toLowerCase()) ||
      (m.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchRole = roleFilter === 'All' || (m.role && m.role.toLowerCase().includes(roleFilter.toLowerCase()))
    return matchSearch && matchRole
  })

  return (
    <div style={{ background:'#02020e' }}>

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

      <section style={{ padding:'40px 16px 80px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>

          {/* Search + Filter */}
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:36 }}
          >
            <div style={{ position:'relative', maxWidth:500 }}>
              <Search style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#374151' }} />
              <input
                type="text"
                placeholder="Search by name, specialty, or skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
                style={{ paddingLeft:44 }}
              />
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {ROLES.map(role => {
                const active = roleFilter === role
                const m = roleMeta(role)
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    style={{
                      padding:'8px 16px', borderRadius:10,
                      fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                      fontFamily:'"Plus Jakarta Sans",sans-serif', cursor:'pointer',
                      transition:'all 0.2s ease',
                      background: active ? m.bg : 'rgba(255,255,255,0.03)',
                      border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                      color: active ? m.color : 'rgba(140,160,190,0.6)',
                    }}
                  >{role}</button>
                )
              })}
            </div>
          </motion.div>

          {/* Count */}
          <div style={{ marginBottom:24, fontSize:13, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
            Showing <span style={{ color:'#00d4ff', fontWeight:700 }}>{filtered.length}</span> of <span style={{ color:'#e8eef8' }}>{members.length}</span> researchers
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
            {filtered.map((member, i) => {
              const meta = roleMeta(member.role)
              const grad = member.avatar_color || GRAD_COLORS[i % GRAD_COLORS.length]
              return (
                <motion.div
                  key={member.id || member.username}
                  initial={{ opacity:0, y:28, scale:0.97 }}
                  whileInView={{ opacity:1, y:0, scale:1 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.04, duration:0.5 }}
                  whileHover={{ y:-4, transition:{ duration:0.25 } }}
                  style={{ position:'relative' }}
                >
                  <div style={{
                    background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                    border:`1px solid ${meta.color}16`,
                    borderRadius:18, padding:'22px',
                    boxShadow:`0 0 0 1px rgba(255,255,255,0.02) inset, 0 16px 48px rgba(0,0,0,0.5)`,
                    transition:'border-color 0.3s ease, box-shadow 0.3s ease',
                    position:'relative', overflow:'hidden',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${meta.color}30`; e.currentTarget.style.boxShadow=`0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${meta.color}0a` }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${meta.color}16`; e.currentTarget.style.boxShadow=`0 0 0 1px rgba(255,255,255,0.02) inset, 0 16px 48px rgba(0,0,0,0.5)` }}>

                    {/* Corner glow */}
                    <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:`radial-gradient(circle,${meta.color}0a 0%,transparent 70%)`, filter:'blur(15px)', pointerEvents:'none' }} />

                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                      <div style={{ position:'relative', flexShrink:0 }}>
                        <div style={{ width:52, height:52, borderRadius:14, background:grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:18, boxShadow:`0 4px 16px ${meta.color}20` }}>
                          {member.username?.[0]?.toUpperCase() || 'M'}
                        </div>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#f0f6ff', marginBottom:3, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                          @{member.username}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                          <span style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 8px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                            {member.role || 'ML Researcher'}
                          </span>
                          {member.reputation > 0 && (
                            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#fbbf24', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>
                              <Star style={{ width:11, height:11 }} />
                              {(member.reputation || 0).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    {member.location && (
                      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif', marginBottom:10 }}>
                        <MapPin style={{ width:11, height:11, flexShrink:0 }} />
                        {member.location}
                      </div>
                    )}

                    {/* Bio */}
                    {member.bio && (
                      <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12.5, color:'rgba(140,160,190,0.68)', lineHeight:1.65, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {member.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {Array.isArray(member.skills) && member.skills.length > 0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${meta.color}10` }}>
                        {member.skills.slice(0,3).map(skill => (
                          <span key={skill} style={{ fontSize:10.5, fontWeight:600, fontFamily:'"Plus Jakarta Sans",sans-serif', background:`${meta.color}0a`, border:`1px solid ${meta.color}1e`, color:meta.color, padding:'3px 9px', borderRadius:100 }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:11, color:'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Since {member.joined || '2023'}</span>
                      <Link to={`/profile/${member.username}`} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:meta.color, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, textDecoration:'none' }}>
                        View profile <ExternalLink style={{ width:11, height:11 }} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <Brain style={{ width:40, height:40, color:'rgba(0,212,255,0.25)', margin:'0 auto 16px' }} />
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(140,160,190,0.5)' }}>
                No researchers found — try a different search or filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
