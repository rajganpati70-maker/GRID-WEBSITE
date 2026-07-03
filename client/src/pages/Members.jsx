import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Star, Brain, MapPin, ExternalLink, Github, Linkedin } from 'lucide-react'
import axios from 'axios'

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
