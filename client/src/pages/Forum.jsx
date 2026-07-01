import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, ThumbsUp, Eye, Clock, Pin, Flame, Search, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const MOCK_THREADS = [
  { id:1, title:'How are you all handling AI code review in CI/CD pipelines?', category:'DevOps', author:'marcus_ops', replies:47, views:1204, likes:89, pinned:true, hot:true, created:'2h ago', excerpt:'We integrated GPT-4o into our GitHub Actions pipeline last month...' },
  { id:2, title:'Rust vs Go for high-throughput microservices — real-world benchmarks', category:'Languages', author:'raj_arch', replies:83, views:3420, likes:201, pinned:false, hot:true, created:'5h ago', excerpt:'After running production load tests on both, here are my findings...' },
  { id:3, title:'Best practices for zero-knowledge proof systems in 2025', category:'Blockchain', author:'nina_blockchain', replies:29, views:876, likes:54, pinned:false, hot:false, created:'12h ago', excerpt:'ZK proofs are finally reaching production maturity...' },
  { id:4, title:'Weekly: What are you building this week? [Jan 2025]', category:'General', author:'priya_dev', replies:156, views:4200, likes:310, pinned:true, hot:false, created:'1d ago', excerpt:'Share your WIP projects, side hustles, and weekend hacks...' },
  { id:5, title:'LLM fine-tuning: When does it make sense vs RAG?', category:'AI/ML', author:'priya_dev', replies:62, views:2100, likes:145, pinned:false, hot:true, created:'1d ago', excerpt:'RAG is almost always the right first answer, but fine-tuning...' },
  { id:6, title:'TypeScript 5.5 features that changed my workflow', category:'Frontend', author:'ana_fe', replies:38, views:1560, likes:97, pinned:false, hot:false, created:'2d ago', excerpt:'The new control flow analysis improvements alone are worth it...' },
  { id:7, title:'Show & Tell: My homelab Kubernetes cluster setup', category:'DevOps', author:'marcus_ops', replies:71, views:2890, likes:178, pinned:false, hot:false, created:'3d ago', excerpt:'6 nodes, Talos Linux, Longhorn storage — full setup breakdown...' },
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

export default function Forum() {
  const [threads, setThreads] = useState([])
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/forum').then(r => {
      setThreads(r.data.length > 0 ? r.data : MOCK_THREADS)
    }).catch(() => setThreads(MOCK_THREADS))
  }, [])

  const filtered = threads.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || t.category === cat
    return matchSearch && matchCat
  })

  return (
    <div>
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">Discussions</span>
            <h1 className="section-title text-white mb-6">COMMUNITY <span className="text-gradient">FORUM</span></h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-inter">
              Ask questions, share insights, debate ideas. The GRID hive mind awaits.
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
            <button
              onClick={() => user ? null : navigate('/login')}
              className="btn-primary flex items-center gap-2 text-xs whitespace-nowrap"
            >
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

          {/* Thread Count */}
          <div className="mb-6 text-sm text-gray-500 font-rajdhani tracking-wide">
            <span className="text-grid-cyan font-semibold">{filtered.length}</span> discussions
          </div>

          {/* Threads */}
          <div className="space-y-3">
            {filtered.map((thread, i) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="forum-item"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {thread.author?.[0]?.toUpperCase()}
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

                    <h3 className="font-orbitron text-sm font-bold text-white mb-1 leading-snug hover:text-grid-cyan transition-colors duration-200 cursor-pointer">
                      {thread.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2 font-inter line-clamp-1">{thread.excerpt}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="font-rajdhani tracking-wide">@{thread.author}</span>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{thread.created}</div>
                      <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-grid-cyan/60" />{thread.replies}</div>
                      <div className="flex items-center gap-1"><Eye className="w-3 h-3" />{(thread.views || 0).toLocaleString()}</div>
                      <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-grid-cyan/60" />{thread.likes}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
