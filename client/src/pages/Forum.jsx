import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ThumbsUp, Eye, Clock, Pin, Flame, Search, Plus, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NewThreadModal from '../components/NewThreadModal'
import axios from 'axios'

const MOCK_THREADS = [
  { id:1, title:'How are you all handling AI code review in CI/CD pipelines?', category:'DevOps', author:'marcus_ops', replies:47, views:1204, likes:89, pinned:true, hot:true, created_at: new Date(Date.now()-7200000).toISOString(), excerpt:'We integrated GPT-4o into our GitHub Actions pipeline last month...' },
  { id:2, title:'Rust vs Go for high-throughput microservices — real-world benchmarks', category:'Languages', author:'raj_arch', replies:83, views:3420, likes:201, pinned:false, hot:true, created_at: new Date(Date.now()-18000000).toISOString(), excerpt:'After running production load tests on both, here are my findings...' },
  { id:3, title:'Best practices for zero-knowledge proof systems in 2025', category:'Blockchain', author:'nina_blockchain', replies:29, views:876, likes:54, pinned:false, hot:false, created_at: new Date(Date.now()-43200000).toISOString(), excerpt:'ZK proofs are finally reaching production maturity...' },
  { id:4, title:'Weekly: What are you building this week?', category:'General', author:'priya_dev', replies:156, views:4200, likes:310, pinned:true, hot:false, created_at: new Date(Date.now()-86400000).toISOString(), excerpt:'Share your WIP projects, side hustles, and weekend hacks...' },
  { id:5, title:'LLM fine-tuning: When does it make sense vs RAG?', category:'AI/ML', author:'priya_dev', replies:62, views:2100, likes:145, pinned:false, hot:true, created_at: new Date(Date.now()-86400000).toISOString(), excerpt:'RAG is almost always the right first answer, but fine-tuning...' },
  { id:6, title:'TypeScript 5.5 features that changed my workflow', category:'Frontend', author:'ana_fe', replies:38, views:1560, likes:97, pinned:false, hot:false, created_at: new Date(Date.now()-172800000).toISOString(), excerpt:'The new control flow analysis improvements alone are worth it...' },
  { id:7, title:'Show & Tell: My homelab Kubernetes cluster setup', category:'DevOps', author:'marcus_ops', replies:71, views:2890, likes:178, pinned:false, hot:false, created_at: new Date(Date.now()-259200000).toISOString(), excerpt:'6 nodes, Talos Linux, Longhorn storage — full setup breakdown...' },
]

const CATS = ['All', 'General', 'AI/ML', 'DevOps', 'Frontend', 'Languages', 'Security', 'Blockchain']

const CAT_COLORS = {
  'DevOps': 'text-orange-400 bg-orange-400/10 border-orange-400/25',
  'Languages': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  'Blockchain': 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'General': 'text-gray-400 bg-gray-400/10 border-gray-400/25',
  'AI/ML': 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  'Frontend': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  'Security': 'text-red-400 bg-red-400/10 border-red-400/25',
}

const GRAD_COLORS = ['from-blue-600 to-cyan-400','from-purple-600 to-blue-400','from-cyan-600 to-teal-400','from-indigo-600 to-purple-400','from-yellow-600 to-orange-400','from-green-600 to-teal-400','from-red-600 to-orange-400']

function timeAgo(iso) {
  if (!iso) return '—'
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function Avatar({ username, avatarColor, size = 10 }) {
  const i = (username?.charCodeAt(0) || 0) % GRAD_COLORS.length
  return (
    <div
      className={`rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${!avatarColor ? `bg-gradient-to-br ${GRAD_COLORS[i]}` : ''}`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px`, ...(avatarColor ? { background: avatarColor } : {}) }}
    >
      <span style={{ fontSize: `${size * 1.6}px` }}>{username?.[0]?.toUpperCase() || '?'}</span>
    </div>
  )
}

export default function Forum() {
  const [threads, setThreads] = useState([])
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadIds, setNewThreadIds] = useState(new Set())
  const { user } = useAuth()
  const navigate = useNavigate()
  const wsRef = useRef(null)

  useEffect(() => {
    axios.get('/api/forum').then(r => {
      setThreads(r.data.length > 0 ? r.data : MOCK_THREADS)
    }).catch(() => setThreads(MOCK_THREADS))

    // WS for live new threads
    const token = localStorage.getItem('grid_token')
    if (token) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws`)
      wsRef.current = ws
      ws.onopen = () => ws.send(JSON.stringify({ type: 'auth', token }))
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'forum_thread_new') {
            setThreads(prev => {
              if (prev.find(t => t.id === msg.thread.id)) return prev
              return [msg.thread, ...prev]
            })
            setNewThreadIds(prev => new Set([...prev, msg.thread.id]))
          }
          if (msg.type === 'forum_reply_new') {
            setThreads(prev => prev.map(t =>
              t.id === msg.threadId ? { ...t, replies: (t.replies || 0) + 1 } : t
            ))
          }
        } catch {}
      }
    }

    return () => { wsRef.current?.close(); wsRef.current = null }
  }, [])

  const handleNewThread = () => {
    if (!user) { navigate('/login'); return }
    setShowNewThread(true)
  }

  const handleThreadCreated = (thread) => {
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
  const rest = filtered.filter(t => !t.pinned)

  return (
    <div>
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">Discussions</span>
            <h1 className="section-title text-white mb-6">COMMUNITY <span className="text-gradient">FORUM</span></h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-inter">
              Ask questions, share what you know, debate ideas. Real conversations with real builders.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search discussions..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
            </div>
            <button onClick={handleNewThread} className="btn-primary flex items-center gap-2 text-xs whitespace-nowrap">
              <Plus className="w-4 h-4" /> New Thread
            </button>
          </motion.div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-lg text-xs font-rajdhani tracking-widest uppercase transition-all duration-200 ${cat === c ? 'bg-grid-cyan/20 border-grid-cyan/60 text-grid-cyan border' : 'glass-card text-gray-400 hover:text-grid-cyan'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-500 font-rajdhani tracking-wide">
              <span className="text-grid-cyan font-semibold">{filtered.length}</span> discussions
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-rajdhani tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live updates
            </div>
          </div>

          {/* Pinned threads */}
          {pinned.length > 0 && cat === 'All' && !search && (
            <div className="mb-6">
              <div className="text-[10px] text-gray-600 font-rajdhani tracking-[0.3em] uppercase mb-3">Pinned</div>
              <div className="space-y-2">
                {pinned.map((thread, i) => (
                  <ThreadRow key={thread.id} thread={thread} index={i} isNew={newThreadIds.has(thread.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Regular threads */}
          <div className="space-y-2">
            {rest.map((thread, i) => (
              <ThreadRow key={thread.id} thread={thread} index={i} isNew={newThreadIds.has(thread.id)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="w-12 h-12 text-grid-cyan/30 mx-auto mb-4" />
              <p className="text-gray-500 font-rajdhani tracking-wide">No discussions found.</p>
              <button onClick={handleNewThread} className="btn-primary text-xs mt-4 inline-flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Start one
              </button>
            </div>
          )}
        </div>
      </section>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showNewThread && (
          <NewThreadModal
            onClose={() => setShowNewThread(false)}
            onCreated={handleThreadCreated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ThreadRow({ thread, index, isNew }) {
  const i = (thread.author?.charCodeAt(0) || 0) % GRAD_COLORS.length

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className={`relative forum-item group transition-all duration-300 ${isNew ? 'border-green-500/30 bg-green-500/3' : ''}`}
    >
      {isNew && (
        <span className="absolute top-3 right-3 text-[9px] text-green-400 bg-green-400/10 border border-green-400/20 px-1.5 py-0.5 rounded font-rajdhani tracking-widest uppercase">
          New
        </span>
      )}

      <Link to={`/forum/${thread.id}`} className="flex gap-4 block">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${GRAD_COLORS[i]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
          style={thread.author_avatar_color ? { background: thread.author_avatar_color } : undefined}
        >
          {thread.author?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1.5">
            {thread.pinned && (
              <span className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded font-rajdhani tracking-widest uppercase">
                <Pin className="w-2.5 h-2.5" /> Pinned
              </span>
            )}
            {thread.hot && (
              <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/25 px-2 py-0.5 rounded font-rajdhani tracking-widest uppercase">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded border font-rajdhani tracking-widest uppercase ${CAT_COLORS[thread.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/25'}`}>
              {thread.category}
            </span>
          </div>

          <h3 className="font-orbitron text-sm font-bold text-white mb-1 leading-snug group-hover:text-grid-cyan transition-colors duration-200">
            {thread.title}
          </h3>
          <p className="text-gray-500 text-xs mb-2 font-inter line-clamp-1">{thread.excerpt}</p>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link
              to={`/profile/${thread.author}`}
              onClick={e => e.stopPropagation()}
              className="font-rajdhani tracking-wide hover:text-grid-cyan transition-colors"
            >
              @{thread.author}
            </Link>
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(thread.created_at || thread.created)}</div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-grid-cyan/60" />
              <span className={`font-orbitron text-[11px] ${thread.replies > 0 ? 'text-grid-cyan/80' : ''}`}>{thread.replies || 0}</span>
            </div>
            <div className="flex items-center gap-1"><Eye className="w-3 h-3" />{(thread.views || 0).toLocaleString()}</div>
            <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-grid-cyan/60" />{thread.likes || 0}</div>
          </div>
        </div>

        {/* Reply count bubble */}
        {thread.replies > 0 && (
          <div className="hidden sm:flex flex-col items-center justify-center w-14 flex-shrink-0">
            <div className="font-orbitron text-lg font-black text-grid-cyan/70 leading-none">{thread.replies}</div>
            <div className="text-[9px] text-gray-700 font-rajdhani tracking-widest uppercase">replies</div>
          </div>
        )}
      </Link>
    </motion.div>
  )
}
