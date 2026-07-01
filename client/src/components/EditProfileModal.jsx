import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2, Github, Twitter, Linkedin, Globe, MapPin, User, Code2, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROLES = ['Developer', 'Designer', 'DevOps', 'Security Engineer', 'Data Scientist', 'ML Engineer', 'Product Manager', 'Student', 'Researcher', 'Architect']

const AVATAR_COLORS = [
  { label: 'Cyan', value: 'linear-gradient(135deg,#0066ff,#00d4ff)' },
  { label: 'Purple', value: 'linear-gradient(135deg,#7b2fff,#a855f7)' },
  { label: 'Green', value: 'linear-gradient(135deg,#059669,#34d399)' },
  { label: 'Orange', value: 'linear-gradient(135deg,#ea580c,#f97316)' },
  { label: 'Pink', value: 'linear-gradient(135deg,#db2777,#ec4899)' },
  { label: 'Indigo', value: 'linear-gradient(135deg,#4f46e5,#818cf8)' },
  { label: 'Teal', value: 'linear-gradient(135deg,#0d9488,#2dd4bf)' },
  { label: 'Red', value: 'linear-gradient(135deg,#dc2626,#f87171)' },
]

export default function EditProfileModal({ onClose, onSaved }) {
  const { user, token, setUser } = useAuth()

  const [form, setForm] = useState({
    bio: '',
    role: '',
    location: '',
    avatar_color: '',
    skills: '',
    github_url: '',
    twitter_url: '',
    linkedin_url: '',
    website_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Populate from current user
  useEffect(() => {
    if (user) {
      setForm({
        bio: user.bio || '',
        role: user.role || 'Developer',
        location: user.location || '',
        avatar_color: user.avatar_color || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
        github_url: user.github_url || '',
        twitter_url: user.twitter_url || '',
        linkedin_url: user.linkedin_url || '',
        website_url: user.website_url || '',
      })
    }
  }, [user])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save')
      if (setUser) setUser(prev => ({ ...prev, ...data.user }))
      setSuccess(true)
      setTimeout(() => {
        onSaved?.(data.user)
        onClose?.()
      }, 900)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const avatarLetter = user?.username?.[0]?.toUpperCase() || '?'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-end p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
      >
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-full max-w-md h-full max-h-[calc(100vh-2rem)] glass-card rounded-2xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 0 80px rgba(0,212,255,0.1), 0 0 0 1px rgba(0,212,255,0.15)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-grid-cyan/10 flex-shrink-0">
            <div>
              <h2 className="font-orbitron text-sm font-black text-white tracking-widest uppercase">Edit Profile</h2>
              <p className="text-[10px] text-gray-500 font-rajdhani tracking-widest mt-0.5">Customize your GRID identity</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all duration-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Avatar color preview */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-3">Avatar Color</label>
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-2xl font-orbitron shadow-lg flex-shrink-0"
                  style={{ background: form.avatar_color || 'linear-gradient(135deg,#0066ff,#00d4ff)' }}
                >
                  {avatarLetter}
                </div>
                <p className="text-xs text-gray-500 font-inter leading-snug">Choose a color theme for your avatar across GRID</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => set('avatar_color', c.value)}
                    className={`h-10 rounded-xl border-2 transition-all duration-200 ${form.avatar_color === c.value ? 'border-white scale-105' : 'border-transparent hover:scale-105'}`}
                    style={{ background: c.value }}
                    title={c.label}
                  >
                    {form.avatar_color === c.value && (
                      <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="cyber-line" />

            {/* Role */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-2">Role</label>
              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grid-cyan/50" />
                <select
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                  className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 pl-10 outline-none focus:border-grid-cyan/50 transition-colors appearance-none"
                >
                  {ROLES.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-2">
                Bio <span className="text-gray-700">({form.bio.length}/300)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={e => set('bio', e.target.value.slice(0, 300))}
                placeholder="Tell the GRID community about yourself..."
                rows={3}
                className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 outline-none focus:border-grid-cyan/50 transition-colors resize-none placeholder-gray-600"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grid-cyan/50" />
                <input
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 pl-10 outline-none focus:border-grid-cyan/50 transition-colors placeholder-gray-600"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-2">
                Skills <span className="text-gray-700">(comma-separated)</span>
              </label>
              <input
                value={form.skills}
                onChange={e => set('skills', e.target.value)}
                placeholder="React, TypeScript, Rust, Docker..."
                className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 outline-none focus:border-grid-cyan/50 transition-colors placeholder-gray-600"
              />
              {form.skills && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 20).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-grid-cyan/10 border border-grid-cyan/20 text-grid-cyan text-[10px] font-rajdhani tracking-wide">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="cyber-line" />

            {/* Social links */}
            <div className="space-y-3">
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase">Social Links</label>
              {[
                { field: 'github_url', icon: Github, placeholder: 'https://github.com/username', color: 'text-gray-400' },
                { field: 'twitter_url', icon: Twitter, placeholder: 'https://twitter.com/username', color: 'text-blue-400' },
                { field: 'linkedin_url', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', color: 'text-blue-500' },
                { field: 'website_url', icon: Globe, placeholder: 'https://yourwebsite.com', color: 'text-purple-400' },
              ].map(({ field, icon: Icon, placeholder, color }) => (
                <div key={field} className="relative">
                  <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${color} opacity-60`} />
                  <input
                    value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 pl-10 outline-none focus:border-grid-cyan/50 transition-colors placeholder-gray-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-grid-cyan/10 flex-shrink-0 space-y-3">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-inter">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-inter">
                <Check className="w-3.5 h-3.5 flex-shrink-0" /> Profile saved!
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-outline text-xs py-2.5">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || success}
                className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> :
                 success ? <><Check className="w-3.5 h-3.5" /> Saved!</> :
                 <><Save className="w-3.5 h-3.5" /> Save Changes</>}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
