import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Github, Twitter, Linkedin, Code2, Zap } from 'lucide-react'
import axios from 'axios'

const ROLES = ['All', 'Developer', 'Designer', 'DevOps', 'Data Scientist', 'Security', 'Architect']
const MOCK_MEMBERS = [
  { id:1, username:'alexchen', role:'Full-Stack Developer', skills:['React','Node.js','PostgreSQL'], reputation:4820, joined:'2021' },
  { id:2, username:'priya_dev', role:'AI Engineer', skills:['Python','TensorFlow','LLMs'], reputation:3650, joined:'2022' },
  { id:3, username:'marcus_ops', role:'DevOps Engineer', skills:['Kubernetes','Terraform','AWS'], reputation:5200, joined:'2020' },
  { id:4, username:'yuki_sec', role:'Security Engineer', skills:['Pentesting','OSINT','Rust'], reputation:4100, joined:'2021' },
  { id:5, username:'sofia_data', role:'Data Scientist', skills:['Python','Spark','dbt'], reputation:2900, joined:'2022' },
  { id:6, username:'raj_arch', role:'Solutions Architect', skills:['System Design','Cloud','Go'], reputation:6100, joined:'2019' },
  { id:7, username:'ana_fe', role:'Frontend Engineer', skills:['Vue','TypeScript','CSS'], reputation:3300, joined:'2022' },
  { id:8, username:'liam_mobile', role:'Mobile Developer', skills:['React Native','Swift','Kotlin'], reputation:2700, joined:'2023' },
  { id:9, username:'nina_blockchain', role:'Blockchain Dev', skills:['Solidity','Web3','Rust'], reputation:4400, joined:'2021' },
]

const GRAD_COLORS = [
  'from-blue-600 to-cyan-400',
  'from-purple-600 to-blue-400',
  'from-cyan-600 to-teal-400',
  'from-indigo-600 to-purple-400',
  'from-blue-500 to-indigo-400',
  'from-cyan-500 to-blue-400',
  'from-purple-500 to-pink-400',
  'from-teal-600 to-cyan-400',
  'from-violet-600 to-purple-400',
]

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
    const matchSearch = m.username.toLowerCase().includes(search.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(search.toLowerCase()))
    const matchRole = roleFilter === 'All' || (m.role && m.role.includes(roleFilter))
    return matchSearch && matchRole
  })

  return (
    <div>
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">The Network</span>
            <h1 className="section-title text-white mb-6">COMMUNITY <span className="text-gradient">MEMBERS</span></h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-inter">
              50,000+ verified engineers, developers, and innovators from around the globe.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-4 mb-10"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search members by name or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-rajdhani tracking-widest uppercase transition-all duration-200 ${
                    roleFilter === role
                      ? 'bg-grid-cyan/20 border-grid-cyan/60 text-grid-cyan border'
                      : 'glass-card text-gray-400 hover:text-grid-cyan hover:border-grid-cyan/30'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Count */}
          <div className="mb-6 text-sm text-gray-500 font-rajdhani tracking-wide">
            Showing <span className="text-grid-cyan font-semibold">{filtered.length}</span> of <span className="text-white">{members.length}</span> members
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="member-card"
              >
                {/* Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-neon-sm`}>
                    {member.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-orbitron text-sm font-bold text-white mb-0.5 truncate">@{member.username}</div>
                    <div className="text-xs text-gray-400 font-rajdhani tracking-wide truncate">{member.role || 'GRID Member'}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-semibold">{(member.reputation || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(member.skills || []).slice(0,3).map(skill => (
                    <span key={skill} className="tag text-[10px] px-2 py-0.5">{skill}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-grid-cyan/10">
                  <span className="text-xs text-gray-600 font-rajdhani tracking-wide">Since {member.joined || '2023'}</span>
                  <div className="flex gap-2">
                    <a href="#" className="text-gray-600 hover:text-grid-cyan transition-colors"><Github className="w-3.5 h-3.5" /></a>
                    <a href="#" className="text-gray-600 hover:text-grid-cyan transition-colors"><Twitter className="w-3.5 h-3.5" /></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Code2 className="w-12 h-12 text-grid-cyan/30 mx-auto mb-4" />
              <p className="text-gray-500 font-rajdhani tracking-wide">No members found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
