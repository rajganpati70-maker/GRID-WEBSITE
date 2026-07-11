import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Globe, Github, Twitter, Linkedin, Calendar, Star,
  MessageSquare, Code2, Award, ArrowLeft, ExternalLink, Users, Edit3
} from 'lucide-react'

const GRAD_COLORS = [
  'from-blue-600 to-cyan-400', 'from-purple-600 to-blue-400',
  'from-cyan-600 to-teal-400', 'from-indigo-600 to-purple-400',
  'from-yellow-600 to-orange-400', 'from-green-600 to-teal-400',
  'from-red-600 to-orange-400', 'from-pink-600 to-rose-400'
]

function getGradient(username, avatarColor) {
  if (avatarColor) return null
  const i = (username?.charCodeAt(0) || 0) % GRAD_COLORS.length
  return GRAD_COLORS[i]
}

function Avatar({ username, avatarColor, size = 24 }) {
  const grad = getGradient(username, avatarColor)
  const bg = avatarColor || undefined
  return (
    <div
      className={`w-${size} h-${size} rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0 border-4 border-grid-dark shadow-2xl ${grad ? `bg-gradient-to-br ${grad}` : ''}`}
      style={bg ? { background: bg } : undefined}
    >
      <span style={{ fontSize: `${size * 0.42}px` }}>{username?.[0]?.toUpperCase() || '?'}</span>
    </div>
  )
}

const SKILL_COLORS = [
  'border-grid-cyan/30 text-grid-cyan bg-grid-cyan/8',
  'border-purple-500/30 text-purple-400 bg-purple-500/8',
  'border-blue-500/30 text-blue-400 bg-blue-500/8',
  'border-green-500/30 text-green-400 bg-green-500/8',
  'border-orange-500/30 text-orange-400 bg-orange-500/8',
]

export default function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    import('../data/store').then(({ getUserByUsername }) => {
      const u = getUserByUsername(username)
      if (u) setProfile(u)
      else setError('User not found')
    }).catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [username])


  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-grid-cyan/30 border-t-grid-cyan rounded-full animate-spin" />
        <div className="text-grid-cyan font-orbitron text-xs tracking-widest animate-pulse">LOADING PROFILE...</div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="font-orbitron text-6xl font-black text-grid-cyan/20 mb-4">404</div>
        <p className="text-gray-400 font-rajdhani tracking-wider mb-6">{error}</p>
        <Link to="/members" className="btn-outline text-xs">Browse Members</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-grid-cyan transition-colors mb-8 font-rajdhani tracking-widest uppercase text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Main card */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
              {/* Glow bg */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-grid-cyan/8 via-grid-blue/5 to-transparent pointer-events-none" />

              <div className="relative flex flex-col items-center text-center gap-4">
                <Avatar username={profile.username} avatarColor={profile.avatar_color} size={20} />

                <div>
                  <h1 className="font-orbitron text-xl font-black text-white tracking-wider mb-1">
                    {profile.username}
                  </h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-grid-cyan/25 bg-grid-cyan/8 text-xs text-grid-cyan font-rajdhani tracking-widest uppercase">
                    <Code2 className="w-3 h-3" />
                    {profile.role || 'Developer'}
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-sm text-gray-400 font-inter leading-relaxed">{profile.bio}</p>
                )}

                {/* Meta */}
                <div className="w-full space-y-2 text-xs">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-grid-cyan/60 flex-shrink-0" />
                      <span className="font-rajdhani tracking-wide">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-grid-cyan/60 flex-shrink-0" />
                    <span className="font-rajdhani tracking-wide">Joined {profile.joined}</span>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                       className="p-2 rounded-lg border border-gray-700 hover:border-grid-cyan/50 hover:text-grid-cyan text-gray-500 transition-all duration-200">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                       className="p-2 rounded-lg border border-gray-700 hover:border-blue-400/50 hover:text-blue-400 text-gray-500 transition-all duration-200">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                       className="p-2 rounded-lg border border-gray-700 hover:border-blue-500/50 hover:text-blue-500 text-gray-500 transition-all duration-200">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                       className="p-2 rounded-lg border border-gray-700 hover:border-purple-400/50 hover:text-purple-400 text-gray-500 transition-all duration-200">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </div>
            </div>

            {/* Stats */}
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="font-orbitron text-xs font-bold text-white tracking-widest uppercase mb-4">Stats</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Rep', value: profile.reputation || 0, icon: Award, color: 'text-yellow-400' },
                  { label: 'Posts', value: profile.posts_count || 0, icon: MessageSquare, color: 'text-grid-cyan' },
                  { label: 'Projects', value: profile.projects_count || 0, icon: Code2, color: 'text-purple-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="text-center">
                    <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                    <div className={`font-orbitron font-black text-lg ${color}`}>{value}</div>
                    <div className="text-[10px] text-gray-600 font-rajdhani tracking-widest uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="glass-card p-5 rounded-2xl">
                <h3 className="font-orbitron text-xs font-bold text-white tracking-widest uppercase mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={skill} className={`px-2.5 py-1 rounded-lg border text-xs font-rajdhani tracking-wide ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column — Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Recent Forum Posts */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-grid-cyan" /> Recent Discussions
                </h3>
                <Link to="/forum" className="text-[10px] text-grid-cyan/60 hover:text-grid-cyan font-rajdhani tracking-widest uppercase transition-colors flex items-center gap-1">
                  View Forum <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              {profile.recent_posts?.length > 0 ? (
                <div className="space-y-3">
                  {profile.recent_posts.map(post => (
                    <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/2 hover:bg-grid-cyan/5 transition-colors border border-transparent hover:border-grid-cyan/10">
                      <div className="w-2 h-2 rounded-full bg-grid-cyan mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 font-inter line-clamp-1 mb-1">{post.title}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-600 font-rajdhani tracking-wide">{post.category}</span>
                          <span className="text-[10px] text-gray-700">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">No discussions yet</p>
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" /> Projects
                </h3>
                <Link to="/projects" className="text-[10px] text-grid-cyan/60 hover:text-grid-cyan font-rajdhani tracking-widest uppercase transition-colors flex items-center gap-1">
                  View All <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              {profile.recent_projects?.length > 0 ? (
                <div className="space-y-3">
                  {profile.recent_projects.map(proj => (
                    <div key={proj.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/2 hover:bg-purple-500/5 transition-colors border border-transparent hover:border-purple-500/15">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 font-inter font-medium line-clamp-1">{proj.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] text-gray-600 font-rajdhani tracking-wide">{proj.category}</span>
                          <span className={`text-[10px] font-rajdhani tracking-wide px-1.5 py-0.5 rounded ${
                            proj.status === 'Active' ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-white/5'
                          }`}>{proj.status}</span>
                        </div>
                      </div>
                      {proj.stars > 0 && (
                        <div className="flex items-center gap-1 text-yellow-400 text-xs font-orbitron flex-shrink-0">
                          <Star className="w-3 h-3" /> {proj.stars}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code2 className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">No projects yet</p>
                </div>
              )}
            </div>

            {/* No content at all */}
            {profile.recent_posts?.length === 0 && profile.recent_projects?.length === 0 && !profile.bio && (
              <div className="glass-card p-10 rounded-2xl text-center">
                <Users className="w-12 h-12 text-grid-cyan/20 mx-auto mb-3" />
                <p className="text-gray-500 font-rajdhani tracking-widest text-sm uppercase">
                  {`${profile.username} hasn't posted yet`}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
