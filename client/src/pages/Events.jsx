import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ArrowRight, ExternalLink, Zap, Globe } from 'lucide-react'
import axios from 'axios'

const MOCK_EVENTS = [
  { id:1, title:'GRID Hackathon 2025', type:'Hackathon', date:'2025-03-15', time:'09:00 AM', location:'Online + NYC Hub', attendees:1200, desc:'48-hour global hackathon. Build AI-powered tools that solve real-world problems. $50K in prizes.', tags:['AI','Open Source','48hr'] },
  { id:2, title:'WebAssembly Deep Dive', type:'Workshop', date:'2025-02-20', time:'02:00 PM', location:'Online', attendees:340, desc:'Hands-on workshop covering WASM in production — Rust, C++, and the browser runtime ecosystem.', tags:['WASM','Rust','Performance'] },
  { id:3, title:'GRID Community Summit', type:'Conference', date:'2025-04-10', time:'10:00 AM', location:'San Francisco, CA', attendees:2500, desc:'Annual flagship event — keynotes, panels, networking, and the GRID Awards ceremony.', tags:['Networking','Keynotes','Awards'] },
  { id:4, title:'Security & Red Teaming 101', type:'Workshop', date:'2025-02-28', time:'06:00 PM', location:'Online', attendees:180, desc:'Learn offensive security techniques from industry red teamers. CTF challenges included.', tags:['Security','CTF','Pentesting'] },
  { id:5, title:'Open Source Sprint Weekend', type:'Sprint', date:'2025-03-08', time:'10:00 AM', location:'Online', attendees:450, desc:'Contribute to top open-source projects with live guidance from core maintainers.', tags:['Open Source','GitHub','PRs'] },
  { id:6, title:'AI/ML Study Group — Season 3', type:'Study Group', date:'2025-02-15', time:'07:00 PM', location:'Online', attendees:220, desc:'Weekly deep dives into research papers, model architectures, and practical ML engineering.', tags:['AI','ML','Research'] },
]

const TYPE_COLORS = {
  'Hackathon': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  'Workshop': 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'Conference': 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  'Sprint': 'text-green-400 bg-green-400/10 border-green-400/25',
  'Study Group': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('All')
  const types = ['All', 'Hackathon', 'Workshop', 'Conference', 'Sprint', 'Study Group']

  useEffect(() => {
    axios.get('/api/events').then(r => {
      setEvents(r.data.length > 0 ? r.data : MOCK_EVENTS)
    }).catch(() => setEvents(MOCK_EVENTS))
  }, [])

  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter)

  return (
    <div>
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">Events</span>
            <h1 className="section-title text-white mb-6">EVENTS & <span className="text-gradient">MEETUPS</span></h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-inter">
              Hackathons, workshops, conferences, and study groups — online and in person.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Type Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 flex-wrap mb-10"
          >
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2.5 rounded-lg text-xs font-rajdhani tracking-widest uppercase transition-all duration-200 ${
                  filter === type
                    ? 'bg-grid-cyan/20 border-grid-cyan/60 text-grid-cyan border'
                    : 'glass-card text-gray-400 hover:text-grid-cyan hover:border-grid-cyan/30'
                }`}
              >
                {type}
              </button>
            ))}
          </motion.div>

          {/* Featured Event */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative glass-card rounded-2xl overflow-hidden mb-8 border-grid-cyan/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-grid-blue/20 to-grid-purple/15" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-grid-cyan/5 rounded-full blur-3xl" />
              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full border font-rajdhani tracking-widest uppercase font-semibold ${TYPE_COLORS[filtered[0].type]}`}>
                        {filtered[0].type}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full border border-green-400/25 text-green-400 bg-green-400/10 font-rajdhani tracking-widest uppercase animate-pulse">● Featured</span>
                    </div>
                    <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white mb-3">{filtered[0].title}</h2>
                    <p className="text-gray-400 mb-6 font-inter leading-relaxed">{filtered[0].desc}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-grid-cyan" />{filtered[0].date}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-grid-cyan" />{filtered[0].time}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-grid-cyan" />{filtered[0].location}</div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-grid-cyan" />{(filtered[0].attendees || 0).toLocaleString()} attending</div>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-6">
                      {(filtered[0].tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <button className="btn-primary inline-flex items-center gap-2 text-xs">
                      Register Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="md:w-48 flex flex-col items-center justify-center glass-card rounded-xl p-6 border-grid-cyan/25 text-center flex-shrink-0">
                    <Calendar className="w-10 h-10 text-grid-cyan mb-2" />
                    <div className="font-orbitron text-3xl font-bold text-white">{new Date(filtered[0].date).getDate()}</div>
                    <div className="text-grid-cyan text-sm font-rajdhani tracking-widest uppercase">{new Date(filtered[0].date).toLocaleString('default', {month:'long'})}</div>
                    <div className="text-gray-500 text-xs mt-1">{new Date(filtered[0].date).getFullYear()}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(1).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="event-card"
              >
                <div className="h-3 bg-gradient-to-r from-grid-blue to-grid-cyan" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded border font-rajdhani tracking-widest uppercase font-semibold ${TYPE_COLORS[event.type]}`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-500 font-rajdhani">{event.date}</span>
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-2 leading-snug">{event.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 font-inter">{event.desc}</p>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Clock className="w-3.5 h-3.5 text-grid-cyan" />{event.time}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin className="w-3.5 h-3.5 text-grid-cyan" />{event.location}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Users className="w-3.5 h-3.5 text-grid-cyan" />{(event.attendees || 0).toLocaleString()} attending</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {(event.tags || []).slice(0,2).map(t => <span key={t} className="tag text-[10px] px-2 py-0.5">{t}</span>)}
                  </div>
                  <button className="btn-outline text-xs w-full text-center py-2">Register</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
