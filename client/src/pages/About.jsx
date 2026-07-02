import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Eye, Heart, Cpu, Network, Code2, Globe, Award, ArrowRight } from 'lucide-react'

const MILESTONES = [
  { year: '2019', title: 'GRID Founded', desc: 'A small Discord server of 50 developers passionate about open source.' },
  { year: '2020', title: 'First Hackathon', desc: '500+ participants, 80+ projects, and our first major corporate sponsor.' },
  { year: '2021', title: '10K Members', desc: 'Reached our first major milestone with global representation.' },
  { year: '2022', title: 'Global Chapters', desc: 'Launched city chapters in 20+ countries across 6 continents.' },
  { year: '2023', title: 'GRID Platform', desc: 'Launched our dedicated community platform with projects & forums.' },
  { year: '2024', title: '50K Members', desc: '50,000 builders from 90+ countries — a true global community.' },
]

const TEAM = [
  { name: 'Alex Chen', role: 'Founder & CEO', specialty: 'Full-Stack Engineering' },
  { name: 'Priya Sharma', role: 'Head of Community', specialty: 'Developer Relations' },
  { name: 'Marcus Webb', role: 'CTO', specialty: 'Systems Architecture' },
  { name: 'Yuki Tanaka', role: 'Head of Events', specialty: 'Community Building' },
]

const VALUES = [
  { icon: Code2, title: 'Open Source First', desc: 'We build in public, share freely, and believe transparency creates better software.' },
  { icon: Network, title: 'Better Together', desc: 'Great things happen when talented people work together toward a common goal.' },
  { icon: Heart, title: 'Inclusive by Design', desc: 'Everyone deserves a place here — regardless of experience, background, or location.' },
  { icon: Cpu, title: 'Always Learning', desc: 'We stay curious, experiment often, and are never too proud to change our minds.' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="tag mb-6 inline-block">Our Story</span>
            <h1 className="section-title text-white mb-6">
              ABOUT <span className="text-gradient">GRID</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-inter leading-relaxed">
              Started by a handful of developers who believed that the best work happens when smart people have each other.
              GRID is where that belief keeps proving itself right.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Target, title: 'Our Mission', color: 'from-grid-blue/20 to-grid-cyan/10', border: 'border-grid-cyan/25', text: 'Give every developer, engineer, and creator a real community to grow in — no barriers, no gatekeeping, just talented people helping each other do better work.' },
            { icon: Eye, title: 'Our Vision', color: 'from-grid-purple/20 to-grid-blue/10', border: 'border-grid-purple/25', text: 'A world where geography and background do not limit what you can build or who you can learn from. GRID is the place where the best technical communities form and last.' },
          ].map(({ icon: Icon, title, color, border, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`glass-card rounded-2xl p-8 bg-gradient-to-br ${color} ${border}`}
            >
              <div className="w-14 h-14 rounded-xl bg-grid-cyan/10 border border-grid-cyan/20 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-grid-cyan" />
              </div>
              <h2 className="font-orbitron text-xl font-bold text-white mb-4 tracking-wide">{title}</h2>
              <p className="text-gray-400 leading-relaxed font-inter">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag mb-4 inline-block">Core Values</span>
            <h2 className="section-title text-white">WHAT WE <span className="text-gradient">STAND FOR</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-xl p-6 text-center group hover:border-grid-cyan/40 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-grid-blue/20 to-grid-cyan/20 border border-grid-cyan/20 flex items-center justify-center mx-auto mb-4 group-hover:border-grid-cyan/50 group-hover:shadow-neon-sm transition-all duration-300">
                  <Icon className="w-7 h-7 text-grid-cyan" />
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white mb-2 tracking-wide">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-inter">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag mb-4 inline-block">Our Journey</span>
            <h2 className="section-title text-white">THE GRID <span className="text-gradient">TIMELINE</span></h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-grid-cyan via-grid-blue to-transparent opacity-40" />
            <div className="space-y-10">
              {MILESTONES.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex gap-8"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl glass-card border-grid-cyan/30 flex items-center justify-center">
                      <span className="font-orbitron text-xs font-bold text-grid-cyan">{year}</span>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-4 h-px bg-grid-cyan opacity-50" />
                  </div>
                  <div className="pt-2 flex-1">
                    <h3 className="font-orbitron text-sm font-bold text-white mb-1 tracking-wide">{title}</h3>
                    <p className="text-gray-400 text-sm font-inter leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag mb-4 inline-block">Leadership</span>
            <h2 className="section-title text-white">MEET THE <span className="text-gradient">TEAM</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, specialty }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass-card rounded-xl p-6 text-center group hover:border-grid-cyan/40 transition-all duration-300"
              >
                <div className="w-20 h-20 avatar text-2xl mx-auto mb-4" style={{width:'80px',height:'80px',background:`linear-gradient(135deg, hsl(${i*60+180},80%,40%), hsl(${i*60+220},90%,60%))`}}>
                  {name[0]}
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white mb-1">{name}</h3>
                <div className="text-grid-cyan text-xs font-rajdhani tracking-widest uppercase mb-2">{role}</div>
                <div className="tag text-xs">{specialty}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="section-title text-white mb-4">BE PART OF <span className="text-gradient">THE GRID</span></h2>
          <p className="text-gray-400 mb-8 font-inter max-w-lg mx-auto">Your story starts here. Join thousands of tech minds building the future.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Join Now <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
