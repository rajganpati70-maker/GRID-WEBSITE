import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, GitFork, ExternalLink, Search, Code2, Zap, ArrowRight } from 'lucide-react'
import axios from 'axios'

const MOCK_PROJECTS = [
  { id:1, title:'NeuralSync', author:'alexchen', category:'AI/ML', stars:2841, forks:342, desc:'Open-source neural network training framework with distributed GPU support and real-time monitoring dashboard.', tags:['Python','PyTorch','CUDA'], status:'Active' },
  { id:2, title:'ZeroTrace', author:'yuki_sec', category:'Security', stars:1920, forks:201, desc:'Advanced network intrusion detection system using ML anomaly detection. Real-time packet analysis and threat scoring.', tags:['Rust','eBPF','ML'], status:'Active' },
  { id:3, title:'GridDB', author:'raj_arch', category:'Database', stars:3400, forks:510, desc:'Distributed time-series database optimized for IoT and telemetry workloads. 10x faster than InfluxDB on benchmarks.', tags:['Go','Raft','LSM'], status:'Stable' },
  { id:4, title:'ReactForge', author:'ana_fe', category:'Frontend', stars:1540, forks:280, desc:'Advanced React component library with built-in accessibility, dark mode, and enterprise design system tokens.', tags:['React','TypeScript','CSS'], status:'Active' },
  { id:5, title:'ChainVault', author:'nina_blockchain', category:'Blockchain', stars:980, forks:145, desc:'Smart contract auditing CLI with static analysis, fuzzing, and formal verification support.', tags:['Solidity','Python','Mythril'], status:'Beta' },
  { id:6, title:'DataWeave', author:'sofia_data', category:'Data', stars:2100, forks:390, desc:'Real-time data pipeline orchestration with visual DAG editor, built on Apache Kafka and dbt.', tags:['Python','Kafka','dbt'], status:'Active' },
]

const CAT_COLORS = {
  'AI/ML': 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  'Security': 'text-red-400 bg-red-400/10 border-red-400/25',
  'Database': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  'Frontend': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  'Blockchain': 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'Data': 'text-green-400 bg-green-400/10 border-green-400/25',
}

const STATUS_COLORS = {
  'Active': 'text-green-400 bg-green-400/10',
  'Stable': 'text-blue-400 bg-blue-400/10',
  'Beta': 'text-yellow-400 bg-yellow-400/10',
}

const CATS = ['All', 'AI/ML', 'Security', 'Database', 'Frontend', 'Blockchain', 'Data']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  useEffect(() => {
    axios.get('/api/projects').then(r => {
      setProjects(r.data.length > 0 ? r.data : MOCK_PROJECTS)
    }).catch(() => setProjects(MOCK_PROJECTS))
  }, [])

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.desc?.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || p.category === cat
    return matchSearch && matchCat
  })

  return (
    <div>
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">Open Source</span>
            <h1 className="section-title text-white mb-6">COMMUNITY <span className="text-gradient">PROJECTS</span></h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-inter">
              Open source projects built by GRID members — real code, real contributors, real impact.
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
              <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
            </div>
          </motion.div>

          <div className="flex gap-2 flex-wrap mb-10">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-lg text-xs font-rajdhani tracking-widest uppercase transition-all duration-200 ${cat === c ? 'bg-grid-cyan/20 border-grid-cyan/60 text-grid-cyan border' : 'glass-card text-gray-400 hover:text-grid-cyan'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Projects', value: `${projects.length}+` },
              { label: 'Total Stars', value: `${(projects.reduce((a,p) => a+(p.stars||0), 0)).toLocaleString()}+` },
              { label: 'Contributors', value: '8,400+' },
            ].map(({ label, value }) => (
              <div key={label} className="stat-card">
                <div className="font-orbitron text-xl font-bold text-gradient mb-1">{value}</div>
                <div className="text-xs text-gray-500 font-rajdhani tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:border-grid-cyan/40 hover:shadow-[0_0_40px_rgba(0,212,255,0.12)] hover:-translate-y-1"
              >
                <div className="h-1.5 bg-gradient-to-r from-grid-blue via-grid-cyan to-grid-purple" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-0.5 rounded border font-rajdhani tracking-widest uppercase font-semibold ${CAT_COLORS[project.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/25'}`}>
                        {project.category}
                      </span>
                      {project.status && (
                        <span className={`text-xs px-2 py-0.5 rounded font-rajdhani tracking-widest uppercase ${STATUS_COLORS[project.status] || 'text-gray-400 bg-gray-400/10'}`}>
                          {project.status}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <a href="#" className="text-gray-600 hover:text-grid-cyan transition-colors"><Github className="w-4 h-4" /></a>
                      <a href="#" className="text-gray-600 hover:text-grid-cyan transition-colors"><ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </div>

                  <h3 className="font-orbitron text-base font-bold text-white mb-2 group-hover:text-grid-cyan transition-colors duration-200">{project.title}</h3>
                  <div className="text-xs text-gray-500 mb-3 font-rajdhani tracking-wide">by @{project.author}</div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 font-inter">{project.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.tags || []).map(tag => <span key={tag} className="tag text-[10px] px-2 py-0.5">{tag}</span>)}
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-grid-cyan/10">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{(project.stars || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <GitFork className="w-3.5 h-3.5 text-grid-cyan/60" />
                      <span>{(project.forks || 0).toLocaleString()}</span>
                    </div>
                    <div className="ml-auto">
                      <ArrowRight className="w-4 h-4 text-grid-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
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
