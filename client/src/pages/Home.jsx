import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Zap, Globe, Code2, Shield, Star, TrendingUp, Users, MessageSquare, Calendar, ChevronDown } from 'lucide-react'
import axios from 'axios'

const FEATURES = [
  { icon: Code2, title: 'Open Source Projects', desc: 'Collaborate on cutting-edge projects with global contributors.' },
  { icon: Globe, title: 'Global Network', desc: 'Connect with 50,000+ developers across 50+ countries worldwide.' },
  { icon: Shield, title: 'Verified Experts', desc: 'Learn from industry-certified engineers and tech leaders.' },
  { icon: Zap, title: 'Live Events', desc: 'Join hackathons, workshops, and real-time coding sessions.' },
  { icon: Star, title: 'Showcase Work', desc: 'Publish your projects and gain recognition in the tech community.' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Get referrals, mentorship, and exclusive job opportunities.' },
]

const STATS = [
  { value: '50K+', label: 'Members', icon: Users },
  { value: '1.2K+', label: 'Projects', icon: Code2 },
  { value: '300+', label: 'Events', icon: Calendar },
  { value: '15K+', label: 'Discussions', icon: MessageSquare },
]

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#0066ff' : '#7b2fff',
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.6 + 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 500], [0, 150])
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data)).catch(() => {})
    axios.get('/api/blog?limit=3').then(r => setPosts(r.data.posts || [])).catch(() => {})
  }, [])

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' }
  }

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 hero-gradient pointer-events-none" style={{background:'radial-gradient(ellipse at top, rgba(0,102,255,0.2) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(123,47,255,0.15) 0%, transparent 60%)'}} />
        <ParticleField />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-grid-blue/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-grid-purple/10 blur-[120px] animate-pulse-slow" style={{animationDelay:'2s'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
          {/* Badge */}
          <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-grid-cyan/30 bg-grid-cyan/5 text-grid-cyan text-xs tracking-[0.2em] uppercase font-rajdhani mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-grid-cyan animate-pulse" />
              Community Network v2.0 — Now Live
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.7 }}>
            <h1 className="section-title text-5xl md:text-7xl lg:text-8xl font-orbitron mb-6 leading-none tracking-tight">
              <span className="text-white block">WHERE TECH</span>
              <span className="text-gradient block">MINDS CONNECT</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-inter leading-relaxed"
          >
            Join <span className="text-white font-semibold">50,000+ developers</span>, engineers, and innovators in the world's most advanced tech community. Build the future, together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="btn-primary flex items-center gap-2 text-sm px-8 py-4">
              Join GRID Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-outline flex items-center gap-2 text-sm px-8 py-4">
              Explore Community
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div key={label} className="stat-card">
                <Icon className="w-5 h-5 text-grid-cyan mx-auto mb-2 opacity-80" />
                <div className="font-orbitron text-2xl font-bold text-gradient mb-1">{value}</div>
                <div className="text-xs text-gray-500 font-rajdhani tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 font-rajdhani tracking-[0.3em] uppercase">Scroll to Explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-grid-cyan" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative py-28 px-4">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <span className="tag mb-4 inline-block">Platform Features</span>
              <h2 className="section-title text-white mb-4">
                BUILT FOR <span className="text-gradient">INNOVATORS</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto font-inter">Everything you need to grow, collaborate, and dominate in tech.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-xl p-6 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-grid-blue/20 to-grid-cyan/20 border border-grid-cyan/20 flex items-center justify-center mb-4 group-hover:border-grid-cyan/50 group-hover:shadow-neon-sm transition-all duration-300">
                  <Icon className="w-6 h-6 text-grid-cyan" />
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white mb-2 tracking-wide">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-inter">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST POSTS ── */}
      {posts.length > 0 && (
        <section className="relative py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="tag mb-3 inline-block">Latest from the Blog</span>
                <h2 className="section-title text-white">RECENT <span className="text-gradient">ARTICLES</span></h2>
              </div>
              <Link to="/blog" className="btn-outline text-xs hidden sm:flex items-center gap-2">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="blog-card"
                >
                  <div className="h-40 bg-gradient-to-br from-grid-blue/20 to-grid-purple/20 flex items-center justify-center border-b border-grid-cyan/10">
                    <Code2 className="w-10 h-10 text-grid-cyan/40" />
                  </div>
                  <div className="p-5">
                    <span className="tag text-xs mb-3 inline-block">{post.category || 'Tech'}</span>
                    <h3 className="font-orbitron text-sm font-bold text-white mb-2 leading-snug">{post.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-inter line-clamp-2">{post.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-grid-blue/10 to-grid-purple/10" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-grid-cyan/5 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <span className="tag mb-6 inline-block">Ready to Elevate?</span>
          <h2 className="section-title text-white mb-6">
            JOIN THE <span className="text-gradient">GRID</span><br />REVOLUTION
          </h2>
          <p className="text-gray-400 mb-10 text-lg font-inter">
            Become part of the most powerful tech community on the planet. Your network is your net worth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-sm px-10 py-4">
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/members" className="btn-outline flex items-center gap-2 text-sm px-10 py-4">
              Meet the Community
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
