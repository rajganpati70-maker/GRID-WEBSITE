import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, User, ArrowRight, Brain, TrendingUp, BookOpen } from 'lucide-react'
import axios from 'axios'

const MOCK_POSTS = [
  { id:1, title:'How I fine-tuned a 7B LLM on a single A100 — and what I learned', category:'LLMs', author:'rahul_gupta', readTime:'14 min', excerpt:'Gradient checkpointing, 4-bit quantisation, and LoRA made this possible. Here is the full setup, the mistakes I made, and the metrics that actually mattered.', featured:true, date:'2025-06-28' },
  { id:2, title:'Flash Attention explained from first principles', category:'Research Papers', author:'aryan_sharma', readTime:'18 min', excerpt:'A walkthrough of the Flash Attention paper — why naive softmax attention is memory-bound, how tiling fixes it, and what the benchmarks actually mean for your training runs.', featured:false, date:'2025-06-24' },
  { id:3, title:'MLOps patterns that saved us in production', category:'MLOps', author:'priya_nair', readTime:'11 min', excerpt:'Feature stores, shadow deployment, and canary model releases. Three patterns we did not take seriously until they would have saved us a lot of pain.', featured:false, date:'2025-06-20' },
  { id:4, title:'Why your val loss is lying to you', category:'Training', author:'dev_malhotra', readTime:'9 min', excerpt:'Leakage, distribution shift, and the sneaky ways evaluation metrics can mislead you into shipping a broken model. Real examples from the GRID community.', featured:false, date:'2025-06-17' },
  { id:5, title:'Diffusion models: a visual intuition for score matching', category:'Computer Vision', author:'sneha_patel', readTime:'20 min', excerpt:'Skip the math-heavy derivation. Here is a visual, intuition-first explanation of score matching and how it leads to the diffusion models everyone is building with.', featured:false, date:'2025-06-12' },
  { id:6, title:'RLHF from scratch — what the papers do not tell you', category:'RL', author:'vikram_singh', readTime:'16 min', excerpt:'Reward modelling, PPO instability, and the alignment tax. A practitioner\'s honest account of implementing RLHF, including what still does not work well.', featured:false, date:'2025-06-08' },
]

const CAT_COLORS = {
  'LLMs':            { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.25)'  },
  'Research Papers': { color:'#7b2fff', bg:'rgba(123,47,255,0.08)', border:'rgba(123,47,255,0.25)' },
  'MLOps':           { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.25)' },
  'Training':        { color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
  'Computer Vision': { color:'#ec4899', bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.25)' },
  'RL':              { color:'#0066ff', bg:'rgba(0,102,255,0.08)',  border:'rgba(0,102,255,0.25)'  },
}

const CATS = ['All', 'LLMs', 'Research Papers', 'MLOps', 'Training', 'Computer Vision', 'RL']

function catMeta(cat) { return CAT_COLORS[cat] || { color:'#00d4ff', bg:'rgba(0,212,255,0.08)', border:'rgba(0,212,255,0.25)' } }

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  useEffect(() => {
    axios.get('/api/blog').then(r => {
      setPosts(r.data.posts?.length > 0 ? r.data.posts : MOCK_POSTS)
    }).catch(() => setPosts(MOCK_POSTS))
  }, [])

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || p.category === cat
    return matchSearch && matchCat
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div style={{ background:'#02020e' }}>

      {/* ── Hero ── */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div style={{ position:'absolute', top:'-15%', left:'30%', width:500, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(123,47,255,0.1) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <span className="tag mb-6 inline-flex items-center gap-2">
              <BookOpen style={{ width:11, height:11 }} /> ML Articles
            </span>
            <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.04em', color:'#f0f6ff', marginBottom:18, lineHeight:1.1 }}>
              THE GRID <span className="text-gradient">BLOG</span>
            </h1>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(160,180,210,0.78)', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
              In-depth ML articles written by practitioners — paper breakdowns, training war stories,
              MLOps patterns, and honest post-mortems from the people actually doing the work.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding:'40px 16px 80px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>

          {/* Search + Filters */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:36 }}>
            <div style={{ position:'relative', maxWidth:480 }}>
              <Search style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#374151' }} />
              <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft:44 }} />
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {CATS.map(c => {
                const active = cat === c
                const m = catMeta(c)
                return (
                  <button key={c} onClick={() => setCat(c)} style={{
                    padding:'8px 16px', borderRadius:10,
                    fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                    fontFamily:'"Plus Jakarta Sans",sans-serif', cursor:'pointer', transition:'all 0.2s ease',
                    background: active ? m.bg : 'rgba(255,255,255,0.03)',
                    border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                    color: active ? m.color : 'rgba(140,160,190,0.6)',
                  }}>{c}</button>
                )
              })}
            </div>
          </motion.div>

          {/* Featured Post */}
          {featured && (
            <motion.div
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}
              style={{
                position:'relative', borderRadius:22, overflow:'hidden', marginBottom:28, cursor:'pointer',
                background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                border:`1px solid ${catMeta(featured.category).color}22`,
                boxShadow:`0 0 0 1px rgba(255,255,255,0.02) inset, 0 28px 70px rgba(0,0,0,0.6)`,
              }}
            >
              <div style={{ height:3, background:`linear-gradient(90deg,${catMeta(featured.category).color},#0066ff)` }} />
              <div style={{ position:'absolute', top:-40, right:-40, width:240, height:240, borderRadius:'50%', background:`radial-gradient(circle,${catMeta(featured.category).color}0c 0%,transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }} />
              <div style={{ padding:'36px 40px', position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.28)', color:'#fbbf24', fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, display:'flex', alignItems:'center', gap:5, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                    <TrendingUp style={{ width:10, height:10 }} /> Featured
                  </span>
                  <span style={{ background:catMeta(featured.category).bg, border:`1px solid ${catMeta(featured.category).border}`, color:catMeta(featured.category).color, fontSize:10.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                    {featured.category}
                  </span>
                </div>
                <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.3rem,3vw,2rem)', color:'#f0f6ff', letterSpacing:'-0.03em', lineHeight:1.2, marginBottom:16, maxWidth:700 }}>
                  {featured.title}
                </h2>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(160,180,210,0.78)', lineHeight:1.72, marginBottom:24, maxWidth:640 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap', marginBottom:24 }}>
                  {[
                    { Icon:User,     text:`@${featured.author}` },
                    { Icon:Clock,    text:`${featured.readTime} read` },
                    { Icon:BookOpen, text:featured.date },
                  ].map(({ Icon, text }) => (
                    <div key={text} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:'rgba(140,160,190,0.6)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                      <Icon style={{ width:14, height:14, color:'#00d4ff', opacity:0.8 }} />
                      {text}
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13.5, color:catMeta(featured.category).color, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700 }}>
                  Read article <ArrowRight style={{ width:14, height:14 }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Article Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
            {rest.map((post, i) => {
              const m = catMeta(post.category)
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:i*0.07, duration:0.5 }}
                  whileHover={{ y:-4, transition:{ duration:0.25 } }}
                  style={{
                    background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                    border:`1px solid ${m.color}16`,
                    borderRadius:18, overflow:'hidden', cursor:'pointer',
                    transition:'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${m.color}30`; e.currentTarget.style.boxShadow=`0 0 40px ${m.color}0a` }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${m.color}16`; e.currentTarget.style.boxShadow='none' }}
                >
                  <div style={{ height:3, background:`linear-gradient(90deg,${m.color},#0066ff)` }} />
                  <div style={{ padding:'22px' }}>
                    <span style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif', display:'inline-block', marginBottom:14 }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#f0f6ff', lineHeight:1.35, letterSpacing:'-0.01em', marginBottom:10 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12.5, color:'rgba(140,160,190,0.7)', lineHeight:1.65, marginBottom:18, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:`1px solid ${m.color}0e` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                        <User style={{ width:12, height:12, color:m.color, opacity:0.7 }} />
                        @{post.author}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                        <Clock style={{ width:12, height:12, color:m.color, opacity:0.7 }} />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <BookOpen style={{ width:40, height:40, color:'rgba(0,212,255,0.25)', margin:'0 auto 16px' }} />
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(140,160,190,0.5)' }}>No articles found — try a different search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
