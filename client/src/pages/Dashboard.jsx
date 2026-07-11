import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Star, Code2, MessageSquare, Calendar, TrendingUp, Zap, Shield, Award, ArrowRight, Activity, Edit3, ExternalLink, MapPin, Github } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import EditProfileModal from '../components/EditProfileModal'
import FloatingLogos from '../components/FloatingLogos'

const QUICK_LINKS = [
  { label: 'Browse Members', href: '/members', icon: LayoutDashboard },
  { label: 'Explore Projects', href: '/projects', icon: Code2 },
  { label: 'Join Events', href: '/events', icon: Calendar },
  { label: 'Read Blog', href: '/blog', icon: TrendingUp },
  { label: 'Forum', href: '/forum', icon: MessageSquare },
]

const ACTIVITY_FEED = [
  { type: 'like', text: 'priya_dev liked your post in AI/ML forum', time: '2m ago', icon: Star },
  { type: 'reply', text: 'marcus_ops replied to your thread', time: '15m ago', icon: MessageSquare },
  { type: 'event', text: 'New event: WebAssembly Deep Dive — Feb 20', time: '1h ago', icon: Calendar },
  { type: 'project', text: 'NeuralSync reached 3,000 stars on GitHub', time: '3h ago', icon: Code2 },
  { type: 'member', text: 'yuki_sec joined your study group', time: '5h ago', icon: Zap },
]

const BADGES = [
  { icon: Shield, label: 'Verified Member', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: Star, label: 'Early Adopter', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: Code2, label: 'Open Source', color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: Award, label: 'Top Contributor', color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

const SKILL_COLORS = [
  'border-grid-cyan/30 text-grid-cyan bg-grid-cyan/8',
  'border-purple-500/30 text-purple-400 bg-purple-500/8',
  'border-blue-500/30 text-blue-400 bg-blue-500/8',
  'border-green-500/30 text-green-400 bg-green-500/8',
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ posts: 12, projects: 3, events: 7, reputation: 1240 })
  const [communityStats, setCommunityStats] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)

  useEffect(() => {
    import('../data/store').then(({ getUserStats, getCommunityStats }) => {
      if (user?.username) {
        const s = getUserStats(user.username)
        setStats({ posts: s.posts, projects: s.projects, events: s.events, reputation: s.reputation || 0 })
      }
      setCommunityStats(getCommunityStats())
    }).catch(() => {})
  }, [user?.username])

  const avatarStyle = user?.avatar_color
    ? { background: user.avatar_color }
    : { background: 'linear-gradient(135deg,#0066ff,#00d4ff)' }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <FloatingLogos />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-neon-cyan" style={avatarStyle}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-orbitron text-2xl font-bold text-white">Welcome back, <span className="text-gradient">@{user?.username}</span></h1>
                  <span className="tag text-xs">{user?.role || 'Developer'}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1 font-rajdhani tracking-wide">{user?.email} · Member since {new Date(user?.created_at || Date.now()).getFullYear()}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl border-grid-cyan/20 text-gray-400 hover:text-grid-cyan hover:border-grid-cyan/50 transition-all duration-200 text-xs font-rajdhani tracking-widest uppercase"
              >
                <ExternalLink className="w-4 h-4" /> View Profile
              </Link>
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center gap-2 px-4 py-2.5 btn-primary text-xs"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Preview Card */}
        {(user?.bio || user?.skills?.length > 0 || user?.location) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
            className="glass-card rounded-2xl p-5 mb-8 border-grid-cyan/15"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase">Your Profile</span>
              <button
                onClick={() => setShowEditProfile(true)}
                className="text-[10px] text-grid-cyan/60 hover:text-grid-cyan font-rajdhani tracking-widest uppercase transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              {user?.bio && (
                <p className="text-sm text-gray-400 font-inter leading-relaxed flex-1 min-w-48">{user.bio}</p>
              )}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {user?.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-rajdhani tracking-wide">
                    <MapPin className="w-3.5 h-3.5 text-grid-cyan/50" /> {user.location}
                  </div>
                )}
                {user?.github_url && (
                  <a href={user.github_url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-grid-cyan font-rajdhani tracking-wide transition-colors">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
              </div>
              {user?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.slice(0, 8).map((s, i) => (
                    <span key={s} className={`px-2 py-0.5 rounded-lg border text-[10px] font-rajdhani tracking-wide ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* No profile set — prompt to fill in */}
        {!user?.bio && !user?.skills?.length && !user?.location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-5 mb-8 border-dashed border-grid-cyan/20 text-center"
          >
            <p className="text-sm text-gray-500 font-rajdhani tracking-widest uppercase mb-3">Your profile is empty — add a bio, skills, and social links</p>
            <button onClick={() => setShowEditProfile(true)} className="btn-primary text-xs inline-flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5" /> Complete Your Profile
            </button>
          </motion.div>
        )}

        {/* My Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Reputation', value: stats.reputation?.toLocaleString(), icon: Star, color: 'text-yellow-400' },
            { label: 'Forum Posts', value: stats.posts, icon: MessageSquare, color: 'text-cyan-400' },
            { label: 'Projects', value: stats.projects, icon: Code2, color: 'text-blue-400' },
            { label: 'Events Joined', value: stats.events, icon: Calendar, color: 'text-purple-400' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="stat-card"
            >
              <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
              <div className="font-orbitron text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-gray-500 font-rajdhani tracking-widest uppercase">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7 }}
            className="lg:col-span-2 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-grid-cyan" />
              <h2 className="font-orbitron text-sm font-bold text-white tracking-wide">Activity Feed</h2>
            </div>
            <div className="space-y-4">
              {ACTIVITY_FEED.map(({ type, text, time, icon: Icon }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-grid-cyan/5 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-grid-cyan/10 border border-grid-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-grid-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 font-inter leading-snug">{text}</p>
                    <span className="text-xs text-gray-500 font-rajdhani tracking-wide">{time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions + Badges */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="font-orbitron text-sm font-bold text-white tracking-wide mb-4">Quick Access</h2>
              <div className="space-y-2">
                {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-grid-cyan/8 hover:border-grid-cyan/30 border border-transparent transition-all duration-200 group"
                  >
                    <Icon className="w-4 h-4 text-grid-cyan/60 group-hover:text-grid-cyan transition-colors" />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-rajdhani tracking-wide">{label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-grid-cyan ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="font-orbitron text-sm font-bold text-white tracking-wide mb-4">Your Badges</h2>
              <div className="grid grid-cols-2 gap-2">
                {BADGES.map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${bg} border border-white/5`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-[10px] text-gray-400 text-center font-rajdhani tracking-wider uppercase leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Community Stats */}
        {communityStats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wide mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-grid-cyan" /> Community at a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Members', value: communityStats.members || '50K+' },
                { label: 'Projects', value: communityStats.projects || '1.2K+' },
                { label: 'Discussions', value: communityStats.discussions || '15K+' },
                { label: 'Events Hosted', value: communityStats.events || '300+' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="font-orbitron text-xl font-bold text-gradient mb-1">{value}</div>
                  <div className="text-xs text-gray-500 font-rajdhani tracking-widest uppercase">{label}</div>
                  <div className="progress-bar mt-3"><div className="progress-fill" style={{width:`${Math.random()*40+60}%`}} /></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          onSaved={() => setShowEditProfile(false)}
        />
      )}
    </div>
  )
}
