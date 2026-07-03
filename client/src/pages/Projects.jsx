import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, GitFork, ExternalLink, Search, Brain, ArrowRight } from 'lucide-react'
import axios from 'axios'

const MOCK_PROJECTS = [
  { id:1, title:'TorchFast',    author:'dev_malhotra',  category:'Training',       stars:3240, forks:418, description:'Drop-in PyTorch training loop with automatic mixed precision, gradient checkpointing, and distributed setup — zero boilerplate.', tags:['PyTorch','CUDA','Distributed'], status:'Active' },
  { id:2, title:'LoRAKit',      author:'aryan_sharma',  category:'Fine-tuning',    stars:2870, forks:351, description:'A clean, composable library for applying LoRA and QLoRA to any HuggingFace model. Tested on 7B to 70B parameter ranges.', tags:['LoRA','HuggingFace','Python'], status:'Active' },
  { id:3, title:'MLTrace',      author:'priya_nair',    category:'MLOps',          stars:1950, forks:224, description:'Lightweight experiment tracking that works locally and in the cloud. Logs metrics, artifacts, and model lineage without the enterprise bloat.', tags:['Experiment Tracking','Python','S3'], status:'Stable' },
  { id:4, title:'VisionBench',  author:'sneha_patel',   category:'Computer Vision', stars:1620, forks:189, description:'Unified benchmarking suite for CV models — classification, detection, segmentation, and generative tasks in one evaluation harness.', tags:['PyTorch','Datasets','Evaluation'], status:'Active' },
  { id:5, title:'RLFoundry',    author:'vikram_singh',  category:'RL',             stars:1140, forks:162, description:'Modular reinforcement learning library built on JAX. Implements PPO, SAC, DDPG, and TD3 with clean abstractions for custom environments.', tags:['JAX','PPO','Gymnasium'], status:'Beta' },
  { id:6, title:'DataForge',    author:'ananya_k',      category:'Datasets',       stars:2100, forks:290, description:'Dataset pipeline toolkit — smart splitting, stratification, augmentation, and data validation. Works with HuggingFace Datasets and raw formats.', tags:['Datasets','Preprocessing','Python'], status:'Active' },
]

const CAT_COLORS = {
  'Training':        { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.25)'  },
  'Fine-tuning':     { color:'#7b2fff', bg:'rgba(123,47,255,0.08)', border:'rgba(123,47,255,0.25)' },
  'MLOps':           { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.25)' },
  'Computer Vision': { color:'#ec4899', bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.25)' },
  'RL':              { color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
  'Datasets':        { color:'#0066ff', bg:'rgba(0,102,255,0.08)',  border:'rgba(0,102,255,0.25)'  },
}

const STATUS_META = {
  'Active': { color:'#4ade80', bg:'rgba(74,222,128,0.1)'  },
  'Stable': { color:'#00d4ff', bg:'rgba(0,212,255,0.08)'  },
  'Beta':   { color:'#f59e0b', bg:'rgba(245,158,11,0.08)' },
}

const CATS = ['All', 'Training', 'Fine-tuning', 'MLOps', 'Computer Vision', 'RL', 'Datasets']

function catMeta(cat) { return CAT_COLORS[cat] || { color:'#00d4ff', bg:'rgba(0,212,255,0.08)', border:'rgba(0,212,255,0.25)' } }

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('All')

  useEffect(() => {
    axios.get('/api/projects').then(r => {
      setProjects(r.data.length > 0 ? r.data : MOCK_PROJECTS)
    }).catch(() => setProjects(MOCK_PROJECTS))
  }, [])

  const filtered = projects.filter(p => {
    const desc = p.description || p.desc || ''
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || p.category === cat
    return matchSearch && matchCat
  })

  const totalStars = projects.reduce((a, p) => a + (p.stars || 0), 0)

  return (
    <div style={{ background:'#02020e' }}>

      {/* ── Hero ── */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div style={{ position:'absolute', top:'-15%', left:'30%', width:500, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(0,212,255,0.09) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <span className="tag mb-6 inline-flex items-center gap-2">
              <Brain style={{ width:11, height:11 }} /> Open ML Projects
            </span>
            <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.04em', color:'#f0f6ff', marginBottom:18, lineHeight:1.1 }}>
              COMMUNITY <span className="text-gradient">PROJECTS</span>
            </h1>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(160,180,210,0.78)', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
              Open source ML tools, libraries, and datasets built by GRID members —
              real code, real contributors, tested in real training runs.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding:'40px 16px 80px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>

          {/* Search + Filter */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
            <div style={{ position:'relative', maxWidth:480 }}>
              <Search style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#374151' }} />
              <input type="text" placeholder="Search ML projects..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft:44 }} />
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {CATS.map(c => {
                const active = cat === c
                const m = catMeta(c)
                return (
                  <button key={c} onClick={() => setCat(c)} style={{
                    padding:'8px 16px', borderRadius:10, fontSize:11, fontWeight:700,
                    letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'"Plus Jakarta Sans",sans-serif',
                    cursor:'pointer', transition:'all 0.2s ease',
                    background: active ? m.bg : 'rgba(255,255,255,0.03)',
                    border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                    color: active ? m.color : 'rgba(140,160,190,0.6)',
                  }}>{c}</button>
                )
              })}
            </div>
          </motion.div>

          {/* Stats bar */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:32 }}>
            {[
              { label:'ML Projects',   value:`${projects.length}+` },
              { label:'GitHub Stars',  value:`${totalStars.toLocaleString()}+` },
              { label:'Contributors',  value:'3,200+' },
            ].map(({ label, value }) => (
              <div key={label} className="stat-card" style={{ textAlign:'center', padding:'16px 12px' }}>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:22, letterSpacing:'-0.03em', marginBottom:4 }} className="text-gradient">{value}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, color:'rgba(140,160,190,0.5)', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:500 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))', gap:18 }}>
            {filtered.map((project, i) => {
              const m = catMeta(project.category)
              const sm = STATUS_META[project.status] || STATUS_META.Active
              const desc = project.description || project.desc || ''
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity:0, y:28, scale:0.97 }}
                  whileInView={{ opacity:1, y:0, scale:1 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.07, duration:0.5 }}
                  whileHover={{ y:-5, transition:{ duration:0.25 } }}
                  style={{
                    background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                    border:`1px solid ${m.color}16`, borderRadius:18, overflow:'hidden',
                    transition:'border-color 0.3s ease, box-shadow 0.3s ease',
                    position:'relative',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${m.color}30`; e.currentTarget.style.boxShadow=`0 0 0 1px rgba(255,255,255,0.03) inset,0 20px 60px rgba(0,0,0,0.6),0 0 40px ${m.color}0a` }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${m.color}16`; e.currentTarget.style.boxShadow='none' }}
                >
                  <div style={{ height:3, background:`linear-gradient(90deg,${m.color},#0066ff)` }} />
                  <div style={{ padding:'22px' }}>
                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                        <span style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                          {project.category}
                        </span>
                        {project.status && (
                          <span style={{ background:sm.bg, color:sm.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      <div style={{ display:'flex', gap:10 }}>
                        <a href={project.github_url || '#'} aria-label="GitHub" style={{ color:'rgba(140,160,190,0.4)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#00d4ff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(140,160,190,0.4)'}>
                          <Github style={{ width:15, height:15 }} />
                        </a>
                        <a href={project.demo_url || '#'} aria-label="Demo" style={{ color:'rgba(140,160,190,0.4)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#00d4ff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(140,160,190,0.4)'}>
                          <ExternalLink style={{ width:15, height:15 }} />
                        </a>
                      </div>
                    </div>

                    <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:17, color:'#f0f6ff', marginBottom:4, letterSpacing:'-0.02em' }}>{project.title}</h3>
                    <div style={{ fontSize:11.5, color:'rgba(140,160,190,0.45)', fontFamily:'"Plus Jakarta Sans",sans-serif', marginBottom:12 }}>by @{project.author}</div>
                    <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:16, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {desc}
                    </p>

                    {/* Tags */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18, paddingBottom:16, borderBottom:`1px solid ${m.color}0e` }}>
                      {(project.tags || []).map(tag => (
                        <span key={tag} style={{ fontSize:10, fontWeight:600, fontFamily:'"Plus Jakarta Sans",sans-serif', background:`${m.color}0a`, border:`1px solid ${m.color}1e`, color:m.color, padding:'3px 9px', borderRadius:100 }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer stats */}
                    <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'#fbbf24', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>
                        <Star style={{ width:13, height:13 }} />
                        {(project.stars || 0).toLocaleString()}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                        <GitFork style={{ width:13, height:13, color:'rgba(0,212,255,0.5)' }} />
                        {(project.forks || 0).toLocaleString()}
                      </div>
                      <div style={{ marginLeft:'auto' }}>
                        <ArrowRight style={{ width:15, height:15, color:m.color, opacity:0 }} className="group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <Brain style={{ width:40, height:40, color:'rgba(0,212,255,0.25)', margin:'0 auto 16px' }} />
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(140,160,190,0.5)' }}>No ML projects found — try a different filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
