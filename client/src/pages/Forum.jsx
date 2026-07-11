import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ThumbsUp, Eye, Clock, Pin, Flame, Search, Plus, Brain } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NewThreadModal from '../components/NewThreadModal'
import FloatingLogos from '../components/FloatingLogos'

const MOCK_THREADS = [
  { id:1, title:'What actually works for reducing hallucinations in production LLMs?', category:'LLMs', author:'rahul_gupta', replies:64, views:2840, likes:142, pinned:true, hot:true, created_at:new Date(Date.now()-7200000).toISOString(), excerpt:'We tried RAG, fine-tuning, and CoT prompting. Here is what actually moved the needle and what is still snake oil...' },
  { id:2, title:'Flash Attention 3 vs 2 — do you actually see the speedup in practice?', category:'Training', author:'aryan_sharma', replies:49, views:1920, likes:98, pinned:false, hot:true, created_at:new Date(Date.now()-18000000).toISOString(), excerpt:'Benchmarks look great in the paper but I am not seeing the same numbers on my H100s. Sharing my profiling results...' },
  { id:3, title:'Weekly: What paper are you reading this week?', category:'Research Papers', author:'dev_malhotra', replies:183, views:5200, likes:341, pinned:true, hot:false, created_at:new Date(Date.now()-86400000).toISOString(), excerpt:'Share the paper, your one-line take on why it matters, and any reproduction attempts...' },
  { id:4, title:'LoRA vs full fine-tuning — when does it actually matter?', category:'Fine-tuning', author:'priya_nair', replies:72, views:3400, likes:189, pinned:false, hot:true, created_at:new Date(Date.now()-86400000).toISOString(), excerpt:'After running dozens of experiments, my conclusion surprised me. The answer depends heavily on task type...' },
  { id:5, title:'Best resources for learning RL from scratch in 2025?', category:'RL', author:'vikram_singh', replies:55, views:2100, likes:127, pinned:false, hot:false, created_at:new Date(Date.now()-172800000).toISOString(), excerpt:'The landscape has changed a lot. Here is what I would recommend to someone starting today, with an honest take on each resource...' },
  { id:6, title:'Diffusion models for tabular data — is anyone actually doing this?', category:'Computer Vision', author:'sneha_patel', replies:31, views:1280, likes:67, pinned:false, hot:false, created_at:new Date(Date.now()-259200000).toISOString(), excerpt:'Saw a few papers but very little production use. Curious if anyone has tried this seriously and what the gotchas are...' },
  { id:7, title:'How do you handle dataset versioning in your ML pipelines?', category:'MLOps', author:'ananya_k', replies:44, views:1650, likes:95, pinned:false, hot:false, created_at:new Date(Date.now()-345600000).toISOString(), excerpt:'DVC, LakeFS, or something custom? Sharing our setup and what we would do differently if starting over...' },
]

const CATS = ['All', 'LLMs', 'Research Papers', 'Training', 'Fine-tuning', 'RL', 'Computer Vision', 'MLOps']

const CAT_COLORS = {
  'LLMs':            { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.22)'  },
  'Research Papers': { color:'#7b2fff', bg:'rgba(123,47,255,0.08)', border:'rgba(123,47,255,0.22)' },
  'Training':        { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.22)' },
  'Fine-tuning':     { color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.22)' },
  'RL':              { color:'#0066ff', bg:'rgba(0,102,255,0.08)',  border:'rgba(0,102,255,0.22)'  },
  'Computer Vision': { color:'#ec4899', bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.22)' },
  'MLOps':           { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.22)' },
  default:           { color:'#00d4ff', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.22)'  },
}

const GRAD_COLORS = [
  'linear-gradient(135deg,#0052cc,#00d4ff)',
  'linear-gradient(135deg,#7b2fff,#00d4ff)',
  'linear-gradient(135deg,#0066ff,#7b2fff)',
  'linear-gradient(135deg,#ec4899,#7b2fff)',
  'linear-gradient(135deg,#00d4ff,#4ade80)',
  'linear-gradient(135deg,#f59e0b,#ec4899)',
  'linear-gradient(135deg,#0052cc,#4ade80)',
]

function catMeta(cat) { return CAT_COLORS[cat] || CAT_COLORS.default }

function timeAgo(iso) {
  if (!iso) return '—'
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function Forum() {
  const [threads, setThreads]       = useState([])
  const [cat, setCat]               = useState('All')
  const [search, setSearch]         = useState('')
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadIds, setNewThreadIds]   = useState(new Set())
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    import('../data/store').then(({ getThreads }) => {
      setThreads(getThreads())
    }).catch(() => setThreads([]))
  }, [])

  const handleNewThread = () => {
    if (!user) { navigate('/login'); return }
    setShowNewThread(true)
  }

  const handleThreadCreated = thread => {
    setThreads(prev => {
      if (prev.find(t => t.id === thread.id)) return prev
      return [thread, ...prev]
    })
  }

  const filtered = threads.filter(t => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || t.category === cat
    return matchSearch && matchCat
  })

  const pinned = filtered.filter(t => t.pinned)
  const rest   = filtered.filter(t => !t.pinned)

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
              <MessageSquare style={{ width:11, height:11 }} /> ML Discussions
            </span>
            <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.04em', color:'#f0f6ff', marginBottom:18, lineHeight:1.1 }}>
              ML <span className="text-gradient">FORUM</span>
            </h1>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(160,180,210,0.78)', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
              Ask hard questions, share real experiments, debate paper results.
              Conversations with practitioners who have actually run the code.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding:'40px 16px 80px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          {/* Controls */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:240 }}>
                <Search style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'rgba(140,160,190,0.5)' }} />
                <input type="text" placeholder="Search discussions..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft:44 }} />
              </div>
              <button onClick={handleNewThread} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:7, fontSize:12.5, whiteSpace:'nowrap', padding:'10px 20px' }}>
                <Plus style={{ width:15, height:15 }} /> Start a discussion
              </button>
            </div>

            {/* Category filter */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {CATS.map(c => {
                const active = cat === c
                const m = catMeta(c)
                return (
                  <button key={c} onClick={() => setCat(c)} style={{
                    padding:'7px 14px', borderRadius:10, fontSize:10.5, fontWeight:700,
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

          {/* Meta */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
            <span style={{ fontSize:13, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
              <span style={{ color:'#00d4ff', fontWeight:700 }}>{filtered.length}</span> discussions
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#4ade80', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 6px #4ade80', animation:'pulse 2s infinite', display:'inline-block' }} />
              Live updates
            </div>
          </div>

          {/* Pinned */}
          {pinned.length > 0 && cat === 'All' && !search && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, color:'rgba(140,160,190,0.35)', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', marginBottom:10 }}>Pinned</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {pinned.map((thread, i) => <ThreadRow key={thread.id} thread={thread} index={i} isNew={newThreadIds.has(thread.id)} />)}
              </div>
            </div>
          )}

          {/* Regular */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {rest.map((thread, i) => <ThreadRow key={thread.id} thread={thread} index={i} isNew={newThreadIds.has(thread.id)} />)}
          </div>

          {/* Search no-results */}
          {filtered.length === 0 && (search || cat !== 'All') && (
            <div style={{ textAlign:'center', padding:'64px 0' }}>
              <MessageSquare style={{ width:34, height:34, color:'rgba(0,212,255,0.18)', margin:'0 auto 14px' }} />
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:14.5, color:'rgba(140,160,190,0.45)', marginBottom:16 }}>No discussions match your search.</p>
              <button onClick={() => { setSearch(''); setCat('All') }} style={{ fontSize:12, color:'rgba(0,212,255,0.6)', background:'none', border:'none', cursor:'pointer', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, textDecoration:'underline', textUnderlineOffset:3 }}>
                Clear filters
              </button>
            </div>
          )}

          {/* ── Ultra-premium "be first" empty state ── */}
          {threads.length === 0 && !search && cat === 'All' && (
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
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(0,40,160,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
              <div className="absolute inset-0 grid-bg opacity-10" />

              {/* Broadcast / signal animation */}
              <div style={{ position:'relative', width:100, height:100, margin:'0 auto 36px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {/* ripple rings */}
                {[1, 2, 3].map(n => (
                  <motion.div key={n}
                    animate={{ scale:[1, 2.4 + n * 0.3], opacity:[0.22, 0] }}
                    transition={{ duration:2.4, delay:n * 0.65, repeat:Infinity, ease:'easeOut' }}
                    style={{ position:'absolute', width:44, height:44, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.55)', pointerEvents:'none' }}
                  />
                ))}
                {/* outer spinning ring */}
                <motion.div animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', width:96, height:96, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.08)', borderTopColor:'rgba(0,212,255,0.3)' }} />
                <motion.div animate={{ rotate:-360 }} transition={{ duration:30, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', width:76, height:76, borderRadius:'50%', border:'1px dashed rgba(74,222,128,0.08)', borderBottomColor:'rgba(74,222,128,0.28)' }} />
                {/* center */}
                <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,rgba(0,52,204,0.2),rgba(0,212,255,0.1))', border:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 32px rgba(0,120,255,0.14)' }}>
                  <MessageSquare style={{ width:22, height:22, color:'#00d4ff' }} />
                </div>
              </div>

              {/* Copy */}
              <div style={{ position:'relative', zIndex:1, maxWidth:600, margin:'0 auto' }}>
                <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:900, fontSize:'clamp(1.7rem,3.5vw,2.5rem)', letterSpacing:'-0.04em', lineHeight:1.1, color:'#f0f6ff', marginBottom:18 }}>
                  The conversation<br />
                  <span style={{ background:'linear-gradient(135deg,#00d4ff,#0066ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>starts with you.</span>
                </h2>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16.5, color:'rgba(170,186,210,0.72)', lineHeight:1.78, marginBottom:38, maxWidth:520, margin:'0 auto 38px' }}>
                  GRID Forum exists for the ML discussions that get buried in Twitter threads,
                  lost in Slack, or never happen because no one wants to ask first.
                  This is the place where that changes.
                </p>

                {/* CTA */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', marginBottom:40 }}>
                  <motion.button
                    onClick={handleNewThread}
                    whileHover={{ scale:1.04, boxShadow:'0 8px 36px rgba(0,102,255,0.45)' }}
                    whileTap={{ scale:0.97 }}
                    style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'14px 32px', borderRadius:13, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)', color:'#fff', fontSize:14.5, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, boxShadow:'0 4px 28px rgba(0,102,255,0.38)', letterSpacing:'-0.01em' }}
                  >
                    <Plus style={{ width:16, height:16 }} /> Start the first discussion →
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/blog')}
                    whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                    style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 26px', borderRadius:13, border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.04)', cursor:'pointer', color:'rgba(190,205,225,0.75)', fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700 }}
                  >
                    Browse the Blog
                  </motion.button>
                </div>

                {/* What to post pills */}
                <div style={{ marginBottom:24 }}>
                  <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, color:'rgba(120,140,170,0.4)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12, fontWeight:700 }}>
                    What belongs here
                  </p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
                    {[
                      { emoji:'📄', label:'Paper deep-dives' },
                      { emoji:'🧪', label:'Experiment results' },
                      { emoji:'❓', label:'Real questions' },
                      { emoji:'🔥', label:'Training war stories' },
                      { emoji:'🏗️', label:'Architecture debates' },
                      { emoji:'🔍', label:'Benchmark analysis' },
                    ].map(({ emoji, label }) => (
                      <span key={label} style={{ fontSize:12, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, padding:'6px 14px', borderRadius:100, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(160,180,210,0.6)', display:'flex', alignItems:'center', gap:6 }}>
                        <span>{emoji}</span> {label}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12, color:'rgba(120,140,170,0.35)', fontStyle:'italic' }}>
                  Be curious. Be rigorous. Be the one who breaks the silence.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showNewThread && (
          <NewThreadModal onClose={() => setShowNewThread(false)} onCreated={handleThreadCreated} />
        )}
      </AnimatePresence>
    </div>
  )
}

function ThreadRow({ thread, index, isNew }) {
  const navigate = useNavigate()
  const gradIdx = (thread.author?.charCodeAt(0) || 0) % GRAD_COLORS.length
  const m = catMeta(thread.category)

  return (
    <motion.div
      initial={{ opacity:0, x:-16 }}
      whileInView={{ opacity:1, x:0 }}
      viewport={{ once:true }}
      transition={{ delay:index*0.04, duration:0.4 }}
      style={{ position:'relative' }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/forum/${thread.id}`)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/forum/${thread.id}`); } }}
        style={{
          background: isNew ? 'linear-gradient(160deg,rgba(74,222,128,0.025),rgba(4,4,18,0.97))' : 'linear-gradient(160deg,rgba(6,6,24,0.97),rgba(4,4,18,0.96))',
          border: isNew ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.05)',
          borderRadius:14, padding:'16px 18px',
          transition:'border-color 0.2s ease, background 0.2s ease',
          cursor:'pointer',
        }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${m.color}25`; e.currentTarget.style.background=`linear-gradient(160deg,rgba(6,6,24,0.99),rgba(4,4,18,0.97))` }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor=isNew?'rgba(74,222,128,0.2)':'rgba(255,255,255,0.05)'; e.currentTarget.style.background=isNew?'linear-gradient(160deg,rgba(74,222,128,0.025),rgba(4,4,18,0.97))':'linear-gradient(160deg,rgba(6,6,24,0.97),rgba(4,4,18,0.96))' }}
      >
        {isNew && (
          <span style={{ position:'absolute', top:12, right:14, fontSize:9.5, color:'#4ade80', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.22)', padding:'2px 8px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>New</span>
        )}

        <div style={{ display:'flex', gap:14 }}>
          {/* Avatar */}
          <div style={{ width:40, height:40, borderRadius:12, background:thread.author_avatar_color || GRAD_COLORS[gradIdx], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:15, flexShrink:0 }}>
            {thread.author?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:7 }}>
              {thread.pinned && (
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:9.5, color:'#fbbf24', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.22)', padding:'2px 8px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  <Pin style={{ width:9, height:9 }} /> Pinned
                </span>
              )}
              {thread.hot && (
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:9.5, color:'#f97316', background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.22)', padding:'2px 8px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  <Flame style={{ width:9, height:9 }} /> Hot
                </span>
              )}
              <span style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:9.5, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 8px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                {thread.category}
              </span>
            </div>

            <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:14.5, color:'#f0f6ff', lineHeight:1.35, marginBottom:5, letterSpacing:'-0.01em' }}>
              {thread.title}
            </h3>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12.5, color:'rgba(140,160,190,0.55)', marginBottom:10, display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.5 }}>
              {thread.excerpt}
            </p>

            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <Link
                to={`/profile/${thread.author}`}
                onClick={e => e.stopPropagation()}
                style={{ fontSize:12, color:'rgba(140,160,190,0.45)', fontFamily:'"Plus Jakarta Sans",sans-serif', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#00d4ff'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(140,160,190,0.45)'}
              >
                @{thread.author}
              </Link>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                <Clock style={{ width:11, height:11 }} />{timeAgo(thread.created_at || thread.created)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color: thread.replies > 0 ? 'rgba(0,212,255,0.7)' : 'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight: thread.replies > 0 ? 600 : 400 }}>
                <MessageSquare style={{ width:11, height:11 }} />{thread.replies || 0}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                <Eye style={{ width:11, height:11 }} />{(thread.views||0).toLocaleString()}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                <ThumbsUp style={{ width:11, height:11 }} />{thread.likes || 0}
              </div>
            </div>
          </div>

          {/* Reply count bubble */}
          {thread.replies > 0 && (
            <div style={{ flexShrink:0, width:52, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:20, color:'rgba(0,212,255,0.6)', lineHeight:1 }}>{thread.replies}</div>
              <div style={{ fontSize:9, color:'rgba(140,160,190,0.3)', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>replies</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
