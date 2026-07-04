import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search, Clock, User, ArrowRight, BookOpen, TrendingUp,
  PenLine, Eye, Heart, Calendar, Plus
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import BlogEditor from '../components/BlogEditor'

/* ─── Mock fallback ──────────────────────────────────────────────────────── */
const MOCK_POSTS = [
  { id:1, title:'How I fine-tuned a 7B LLM on a single A100 — and what I learned', category:'LLMs', author:'rahul_gupta', read_time:'14 min', excerpt:'Gradient checkpointing, 4-bit quantisation, and LoRA made this possible. Here is the full setup, the mistakes I made, and the metrics that actually mattered.', featured:true, created_at:'2025-06-28', views:2840, likes:142 },
  { id:2, title:'Flash Attention explained from first principles', category:'Research Papers', author:'aryan_sharma', read_time:'18 min', excerpt:'A walkthrough of the Flash Attention paper — why naive softmax attention is memory-bound, how tiling fixes it, and what the benchmarks actually mean for your training runs.', created_at:'2025-06-24', views:1920, likes:98 },
  { id:3, title:'MLOps patterns that saved us in production', category:'MLOps', author:'priya_nair', read_time:'11 min', excerpt:'Feature stores, shadow deployment, and canary model releases. Three patterns we did not take seriously until they would have saved us a lot of pain.', created_at:'2025-06-20', views:1640, likes:75 },
  { id:4, title:'Why your val loss is lying to you', category:'Training', author:'dev_malhotra', read_time:'9 min', excerpt:'Leakage, distribution shift, and the sneaky ways evaluation metrics can mislead you into shipping a broken model. Real examples from the GRID community.', created_at:'2025-06-17', views:3100, likes:189 },
  { id:5, title:'Diffusion models: a visual intuition for score matching', category:'Computer Vision', author:'sneha_patel', read_time:'20 min', excerpt:'Skip the math-heavy derivation. Here is a visual, intuition-first explanation of score matching and how it leads to the diffusion models everyone is building with.', created_at:'2025-06-12', views:2200, likes:134 },
  { id:6, title:'RLHF from scratch — what the papers do not tell you', category:'RL', author:'vikram_singh', read_time:'16 min', excerpt:'Reward modelling, PPO instability, and the alignment tax. A practitioner\'s honest account of implementing RLHF, including what still does not work well.', created_at:'2025-06-08', views:1780, likes:91 },
]

const CAT_COLORS = {
  'LLMs':            { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.28)'  },
  'Research Papers': { color:'#a78bfa', bg:'rgba(167,139,250,0.08)', border:'rgba(167,139,250,0.28)' },
  'MLOps':           { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.28)' },
  'Training':        { color:'#fbbf24', bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.28)' },
  'Fine-tuning':     { color:'#f97316', bg:'rgba(249,115,22,0.08)', border:'rgba(249,115,22,0.28)' },
  'Computer Vision': { color:'#f472b6', bg:'rgba(244,114,182,0.08)', border:'rgba(244,114,182,0.28)' },
  'RL':              { color:'#60a5fa', bg:'rgba(96,165,250,0.08)',  border:'rgba(96,165,250,0.28)'  },
  'General':         { color:'#94a3b8', bg:'rgba(148,163,184,0.08)', border:'rgba(148,163,184,0.28)' },
}
const CATS = ['All', 'LLMs', 'Research Papers', 'MLOps', 'Training', 'Fine-tuning', 'Computer Vision', 'RL']
function catMeta(c) { return CAT_COLORS[c] || { color:'#00d4ff', bg:'rgba(0,212,255,0.08)', border:'rgba(0,212,255,0.28)' } }

const GRAD = [
  'linear-gradient(135deg,#0052cc,#00d4ff)',
  'linear-gradient(135deg,#7b2fff,#00d4ff)',
  'linear-gradient(135deg,#ec4899,#7b2fff)',
  'linear-gradient(135deg,#4ade80,#00d4ff)',
  'linear-gradient(135deg,#f59e0b,#ec4899)',
]
function Avatar({ name, color, size = 36 }) {
  const idx = (name?.charCodeAt(0) || 0) % GRAD.length
  return (
    <div style={{ width:size, height:size, borderRadius:size/3, background:color || GRAD[idx], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })
}

export default function Blog() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [posts, setPosts]           = useState([])
  const [search, setSearch]         = useState('')
  const [cat, setCat]               = useState('All')
  const [showEditor, setShowEditor] = useState(false)
  const [loading, setLoading]       = useState(true)

  const load = () => {
    setLoading(true)
    axios.get('/api/blog').then(r => {
      setPosts(r.data.posts || [])
    }).catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    return (p.title?.toLowerCase().includes(q) || (p.excerpt||'').toLowerCase().includes(q))
      && (cat === 'All' || p.category === cat)
  })

  const featured = filtered[0]
  const rest     = filtered.slice(1)

  const handlePublished = (post) => {
    setPosts(prev => [post, ...prev])
    if (post?.id) navigate(`/blog/${post.id}`)
  }

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
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(160,180,210,0.78)', maxWidth:520, margin:'0 auto 28px', lineHeight:1.75 }}>
              In-depth ML articles written by practitioners — paper breakdowns, training war stories,
              MLOps patterns, and honest post-mortems from the people actually doing the work.
            </p>
            {user && (
              <motion.button
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                onClick={() => setShowEditor(true)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:14,
                  border:'none', cursor:'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)',
                  color:'#fff', fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700,
                  boxShadow:'0 4px 28px rgba(0,102,255,0.35)',
                }}
              >
                <PenLine style={{ width:15, height:15 }} /> Write a Post
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      <section style={{ padding:'40px 16px 80px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>

          {/* Search + filters */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:36 }}>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1, minWidth:240 }}>
                <Search style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(100,120,150,0.5)' }} />
                <input type="text" placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width:'100%', boxSizing:'border-box', paddingLeft:44, paddingRight:16, paddingTop:10, paddingBottom:10, borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'#e8eef8', fontSize:13.5, fontFamily:'"Plus Jakarta Sans",sans-serif', outline:'none' }}
                  onFocus={e=>e.target.style.borderColor='rgba(0,212,255,0.28)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'}
                />
              </div>
              {!user && (
                <button onClick={() => navigate('/register')} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:12, border:'1px solid rgba(0,212,255,0.25)', background:'transparent', cursor:'pointer', color:'#00d4ff', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, whiteSpace:'nowrap' }}>
                  <PenLine style={{ width:13, height:13 }} /> Write a Post
                </button>
              )}
            </div>
            <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
              {CATS.map(c => {
                const active = cat === c; const m = catMeta(c)
                return (
                  <button key={c} onClick={() => setCat(c)} style={{
                    padding:'7px 15px', borderRadius:10, fontSize:10.5, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase',
                    fontFamily:'"Plus Jakarta Sans",sans-serif', cursor:'pointer', transition:'all 0.18s',
                    background: active ? m.bg : 'rgba(255,255,255,0.03)',
                    border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.06)',
                    color: active ? m.color : 'rgba(120,140,170,0.6)',
                  }}>{c}</button>
                )
              })}
            </div>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
              <div style={{ width:36, height:36, border:'2px solid rgba(0,212,255,0.2)', borderTopColor:'#00d4ff', borderRadius:'50%', animation:'spin 0.9s linear infinite' }} />
            </div>
          )}

          {/* Featured post */}
          {!loading && featured && (
            <motion.div
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              onClick={() => featured.id && navigate(`/blog/${featured.id}`)}
              style={{
                position:'relative', borderRadius:22, overflow:'hidden', marginBottom:28, cursor:'pointer',
                background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                border:`1px solid ${catMeta(featured.category).color}20`,
                boxShadow:`0 28px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset`,
                transition:'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 36px 80px rgba(0,0,0,0.55), 0 0 40px ${catMeta(featured.category).color}0a` }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 28px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset` }}
            >
              {featured.cover_image && (
                <img src={featured.cover_image} alt={featured.title} style={{ width:'100%', height:260, objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
              )}
              <div style={{ height:3, background:`linear-gradient(90deg,${catMeta(featured.category).color},#0066ff)` }} />
              <div style={{ position:'absolute', top:-40, right:-40, width:240, height:240, borderRadius:'50%', background:`radial-gradient(circle,${catMeta(featured.category).color}0a 0%,transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }} />
              <div style={{ padding:'32px 36px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.28)', color:'#fbbf24', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, display:'flex', alignItems:'center', gap:5, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                    <TrendingUp style={{ width:10, height:10 }} /> Featured
                  </span>
                  <span style={{ background:catMeta(featured.category).bg, border:`1px solid ${catMeta(featured.category).border}`, color:catMeta(featured.category).color, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                    {featured.category}
                  </span>
                </div>
                <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.3rem,3vw,2rem)', color:'#f0f6ff', letterSpacing:'-0.03em', lineHeight:1.2, marginBottom:14, maxWidth:720 }}>
                  {featured.title}
                </h2>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(160,180,210,0.75)', lineHeight:1.7, marginBottom:22, maxWidth:680 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <Avatar name={featured.author} color={featured.author_avatar_color} size={32} />
                    <span style={{ fontSize:13, color:'rgba(160,180,210,0.7)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>@{featured.author}</span>
                  </div>
                  {[
                    { Icon:Clock,    text:`${featured.read_time || featured.readTime} read` },
                    { Icon:Eye,      text:`${(featured.views||0).toLocaleString()} views` },
                    { Icon:Heart,    text:`${featured.likes||0}` },
                    { Icon:Calendar, text:formatDate(featured.created_at) },
                  ].map(({ Icon, text }) => (
                    <div key={text} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'rgba(120,140,170,0.55)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                      <Icon style={{ width:13, height:13 }} /> {text}
                    </div>
                  ))}
                  <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, fontSize:13.5, color:catMeta(featured.category).color, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700 }}>
                    Read article <ArrowRight style={{ width:14, height:14 }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Article grid */}
          {!loading && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
              {rest.map((post, i) => {
                const m = catMeta(post.category)
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                    transition={{ delay:i*0.06, duration:0.45 }}
                    onClick={() => post.id && navigate(`/blog/${post.id}`)}
                    style={{
                      background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                      border:`1px solid ${m.color}14`,
                      borderRadius:18, overflow:'hidden', cursor:'pointer', display:'flex', flexDirection:'column',
                    }}
                    whileHover={{ y:-4, transition:{ duration:0.22 } }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${m.color}2e`; e.currentTarget.style.boxShadow=`0 0 36px ${m.color}09` }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${m.color}14`; e.currentTarget.style.boxShadow='none' }}
                  >
                    {post.cover_image && (
                      <img src={post.cover_image} alt={post.title} style={{ width:'100%', height:160, objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
                    )}
                    <div style={{ height:3, background:`linear-gradient(90deg,${m.color},#0066ff)`, flexShrink:0 }} />
                    <div style={{ padding:'20px 22px', flex:1, display:'flex', flexDirection:'column' }}>
                      <span style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 10px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif', display:'inline-block', marginBottom:12 }}>
                        {post.category}
                      </span>
                      <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#f0f6ff', lineHeight:1.35, letterSpacing:'-0.01em', marginBottom:10, flex:1 }}>
                        {post.title}
                      </h3>
                      <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12.5, color:'rgba(130,150,180,0.7)', lineHeight:1.65, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:`1px solid ${m.color}0d` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                          <Avatar name={post.author} color={post.author_avatar_color} size={26} />
                          <span style={{ fontSize:11.5, color:'rgba(120,140,170,0.6)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>@{post.author}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11.5, color:'rgba(120,140,170,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                            <Eye style={{ width:11, height:11 }} />{(post.views||0).toLocaleString()}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11.5, color:'rgba(120,140,170,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                            <Clock style={{ width:11, height:11 }} />{post.read_time || post.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Search no-results */}
          {!loading && filtered.length === 0 && (search || cat !== 'All') && (
            <div style={{ textAlign:'center', padding:'72px 0' }}>
              <BookOpen style={{ width:36, height:36, color:'rgba(0,212,255,0.18)', margin:'0 auto 14px' }} />
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(130,150,180,0.45)', marginBottom:18 }}>
                No articles match your search.
              </p>
              <button onClick={() => { setSearch(''); setCat('All') }} style={{ fontSize:12, color:'rgba(0,212,255,0.6)', background:'none', border:'none', cursor:'pointer', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, textDecoration:'underline', textUnderlineOffset:3 }}>
                Clear filters
              </button>
            </div>
          )}

          {/* ── Ultra-premium "be first" empty state ── */}
          {!loading && posts.length === 0 && !search && cat === 'All' && (
            <motion.div
              initial={{ opacity:0, y:32 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, ease:'easeOut' }}
              style={{ position:'relative', borderRadius:28, overflow:'hidden', padding:'80px 32px 72px', textAlign:'center',
                background:'linear-gradient(160deg,rgba(6,6,28,0.98),rgba(3,3,16,0.97))',
                border:'1px solid rgba(255,255,255,0.05)',
                boxShadow:'0 40px 100px rgba(0,0,0,0.6)',
              }}
            >
              {/* ambient bg */}
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,52,180,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
              <div className="absolute inset-0 grid-bg opacity-10" />

              {/* Animated icon mark */}
              <div style={{ position:'relative', width:96, height:96, margin:'0 auto 36px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {/* outer spinning rings */}
                <motion.div animate={{ rotate:360 }} transition={{ duration:22, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', width:96, height:96, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.1)', borderTopColor:'rgba(0,212,255,0.35)' }} />
                <motion.div animate={{ rotate:-360 }} transition={{ duration:14, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', width:74, height:74, borderRadius:'50%', border:'1px dashed rgba(123,47,255,0.12)', borderRightColor:'rgba(123,47,255,0.32)' }} />
                {/* center icon box */}
                <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,rgba(0,52,204,0.25),rgba(0,212,255,0.12))', border:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 28px rgba(0,120,255,0.15)' }}>
                  <PenLine style={{ width:22, height:22, color:'#00d4ff' }} />
                </div>
                {/* pulse ring */}
                <motion.div
                  animate={{ scale:[1, 1.55], opacity:[0.25, 0] }}
                  transition={{ duration:2.2, repeat:Infinity, ease:'easeOut' }}
                  style={{ position:'absolute', width:52, height:52, borderRadius:16, border:'1px solid rgba(0,212,255,0.5)', pointerEvents:'none' }}
                />
              </div>

              {/* Copy */}
              <div style={{ position:'relative', zIndex:1, maxWidth:580, margin:'0 auto' }}>
                <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:900, fontSize:'clamp(1.7rem,3.5vw,2.5rem)', letterSpacing:'-0.04em', lineHeight:1.1, color:'#f0f6ff', marginBottom:18 }}>
                  The first article here<br />
                  <span style={{ background:'linear-gradient(135deg,#0066ff,#00d4ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>sets the standard.</span>
                </h2>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16.5, color:'rgba(170,186,210,0.72)', lineHeight:1.78, marginBottom:38, maxWidth:500, margin:'0 auto 38px' }}>
                  Every great ML blog started with someone sharing exactly what they actually
                  learned — not what they wished they'd known, but the honest, specific, real thing.
                  That someone could be you.
                </p>

                {/* CTAs */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', marginBottom:36 }}>
                  {user ? (
                    <motion.button
                      onClick={() => setShowEditor(true)}
                      whileHover={{ scale:1.04, boxShadow:'0 8px 36px rgba(0,102,255,0.45)' }}
                      whileTap={{ scale:0.97 }}
                      style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'14px 32px', borderRadius:13, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)', color:'#fff', fontSize:14.5, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, boxShadow:'0 4px 28px rgba(0,102,255,0.38)', letterSpacing:'-0.01em' }}
                    >
                      <PenLine style={{ width:16, height:16 }} /> Write the first post →
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => navigate('/register')}
                        whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                        style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 30px', borderRadius:13, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)', color:'#fff', fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, boxShadow:'0 4px 28px rgba(0,102,255,0.35)' }}
                      >
                        Join to write →
                      </motion.button>
                      <motion.button
                        onClick={() => navigate('/forum')}
                        whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                        style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 26px', borderRadius:13, border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.04)', cursor:'pointer', color:'rgba(190,205,225,0.75)', fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700 }}
                      >
                        Browse the forum
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Feature pills */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
                  {['Rich text editor', 'Code blocks & syntax', 'Cover images', 'Tags & categories', 'Reading time auto-calc'].map(f => (
                    <span key={f} style={{ fontSize:11, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, letterSpacing:'0.04em', padding:'5px 13px', borderRadius:100, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(150,170,200,0.55)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog editor */}
      <AnimatePresence>
        {showEditor && (
          <BlogEditor onClose={() => setShowEditor(false)} onPublished={handlePublished} />
        )}
      </AnimatePresence>
    </div>
  )
}
