import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Zap, Code2, Shield, Database, Cpu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { id: 'Developer', label: 'Developer', icon: Code2 },
  { id: 'DevOps', label: 'DevOps', icon: Database },
  { id: 'Security', label: 'Security', icon: Shield },
  { id: 'Architect', label: 'Architect', icon: Cpu },
]

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'Developer' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password, form.role)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-grid-purple/10 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-grid-blue/10 blur-[120px] animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 border-grid-cyan/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-grid-cyan/10 border border-grid-cyan/25 mb-4 relative">
              <img src="/grid-logo.png" alt="GRID" className="w-10 h-10 object-contain" />
              <div className="absolute inset-0 bg-grid-cyan/10 rounded-xl blur-xl" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold text-white mb-1 tracking-widest">JOIN GRID</h1>
            <p className="text-gray-400 text-sm font-rajdhani tracking-widest uppercase">Create your account</p>
          </div>

          <div className="cyber-line mb-8" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm font-rajdhani tracking-wide">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs text-gray-400 font-rajdhani tracking-widest uppercase mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.replace(/\s/g, '') }))}
                  required
                  minLength={3}
                  placeholder="your_handle"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 font-rajdhani tracking-widest uppercase mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="your@email.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 font-rajdhani tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="input-field pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-grid-cyan transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs text-gray-400 font-rajdhani tracking-widest uppercase mb-2">I am a...</label>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: id }))}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-xs font-rajdhani tracking-wide transition-all duration-200 ${
                      form.role === id
                        ? 'border-grid-cyan/60 bg-grid-cyan/15 text-grid-cyan'
                        : 'border-grid-cyan/15 bg-transparent text-gray-400 hover:border-grid-cyan/30 hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Join the GRID
                </>
              )}
            </button>
          </form>

          <div className="cyber-line my-6" />
          <p className="text-center text-gray-400 text-sm font-inter">
            Already a member?{' '}
            <Link to="/login" className="text-grid-cyan hover:text-white transition-colors font-semibold">Login here</Link>
          </p>
        </div>

        <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-grid-cyan rounded-tl-2xl opacity-60" />
        <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-grid-cyan rounded-br-2xl opacity-60" />
      </motion.div>
    </div>
  )
}
