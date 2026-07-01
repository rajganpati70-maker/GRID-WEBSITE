import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, User, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import axios from 'axios'

const MOCK_POSTS = [
  { id:1, title:'Building Production-Grade WebAssembly Apps in 2025', category:'Engineering', author:'alexchen', readTime:'12 min', excerpt:'WASM is no longer experimental — here is how we migrated our core compute engine to WASM and achieved 3x performance gains.', featured:true, date:'2025-01-15' },
  { id:2, title:'The Hidden Architecture of Modern LLMs', category:'AI/ML', author:'priya_dev', readTime:'18 min', excerpt:'A deep technical breakdown of transformer architectures, attention mechanisms, and why context windows matter more than model size.', featured:false, date:'2025-01-12' },
  { id:3, title:'Zero-Trust Security in Kubernetes Clusters', category:'Security', author:'yuki_sec', readTime:'9 min', excerpt:'Step-by-step guide to implementing zero-trust networking in production Kubernetes with Cilium and cert-manager.', featured:false, date:'2025-01-10' },
  { id:4, title:'Rust in 2025: Why It Finally Won', category:'Languages', author:'marcus_ops', readTime:'15 min', excerpt:'Rust crossed the adoption threshold in 2024. Here is a comprehensive look at where it is being used and why teams are making the switch.', featured:false, date:'2025-01-08' },
  { id:5, title:'Designing for 10M Users: Lessons from GRID', category:'System Design', author:'raj_arch', readTime:'20 min', excerpt:'A case study on scaling our community platform from 1K to 10M monthly active users — database sharding, CDN strategy, and caching tiers.', featured:false, date:'2025-01-05' },
  { id:6, title:'dbt + Spark: The Modern Data Stack Explained', category:'Data', author:'sofia_data', readTime:'11 min', excerpt:'How we rebuilt our analytics pipeline with dbt, Apache Spark, and Delta Lake — cutting query latency by 80%.', featured:false, date:'2025-01-02' },
]

const CAT_COLORS = {
  'Engineering': 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'AI/ML': 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  'Security': 'text-red-400 bg-red-400/10 border-red-400/25',
  'Languages': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  'System Design': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  'Data': 'text-green-400 bg-green-400/10 border-green-400/25',
}

const CATS = ['All', 'Engineering', 'AI/ML', 'Security', 'Languages', 'System Design', 'Data']

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
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || p.category === cat
    return matchSearch && matchCat
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">Knowledge Base</span>
            <h1 className="section-title text-white mb-6">THE GRID <span className="text-gradient">BLOG</span></h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-inter">
              Deep technical articles, tutorials, and insights from the GRID community's brightest minds.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
            </div>
          </motion.div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-10">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-lg text-xs font-rajdhani tracking-widest uppercase transition-all duration-200 ${cat === c ? 'bg-grid-cyan/20 border-grid-cyan/60 text-grid-cyan border' : 'glass-card text-gray-400 hover:text-grid-cyan'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="relative glass-card rounded-2xl overflow-hidden mb-8 border-grid-cyan/20 cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-grid-blue/15 to-grid-purple/10 group-hover:from-grid-blue/20 group-hover:to-grid-purple/15 transition-all duration-500" />
              <div className="relative p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full border border-yellow-400/30 text-yellow-400 bg-yellow-400/10 font-rajdhani tracking-widest uppercase flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> Featured
                  </span>
                  <span className={`text-xs px-3 py-1 rounded border font-rajdhani tracking-widest uppercase font-semibold ${CAT_COLORS[featured.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/25'}`}>
                    {featured.category}
                  </span>
                </div>
                <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-grid-cyan transition-colors duration-300 leading-snug">
                  {featured.title}
                </h2>
                <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl font-inter">{featured.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-grid-cyan" />@{featured.author}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-grid-cyan" />{featured.readTime} read</div>
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-grid-cyan" />{featured.date}</div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-grid-cyan font-rajdhani tracking-wide text-sm group-hover:gap-4 transition-all duration-300">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="blog-card cursor-pointer group"
              >
                <div className="h-2 bg-gradient-to-r from-grid-blue to-grid-cyan" />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded border font-rajdhani tracking-widest uppercase ${CAT_COLORS[post.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/25'}`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-3 leading-snug group-hover:text-grid-cyan transition-colors duration-200 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3 font-inter">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 border-t border-grid-cyan/10 pt-3">
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-grid-cyan/60" />@{post.author}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-grid-cyan/60" />{post.readTime}</div>
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
