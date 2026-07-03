import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import GRIDLogoIcon from '../components/GRIDLogoIcon'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-grid-blue/10 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-grid-purple/10 blur-[120px] animate-pulse-slow" style={{animationDelay:'2s'}} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border-grid-cyan/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-grid-cyan/10 border border-grid-cyan/25 mb-4 relative">
              <GRIDLogoIcon size={40} />
              <div className="absolute inset-0 bg-grid-cyan/10 rounded-xl blur-xl" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold text-white mb-1 tracking-widest">GRID LOGIN</h1>
            <p className="text-gray-400 text-sm font-rajdhani tracking-widest uppercase">Access your network</p>
          </div>

          <div className="cyber-line mb-8" />

          {/* Error */}
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
            <div>
              <label className="block text-xs text-gray-400 font-rajdhani tracking-widest uppercase mb-2">Email Address</label>
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

            <div>
              <label className="block text-xs text-gray-400 font-rajdhani tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-grid-cyan transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  Authenticating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Login to GRID
                </>
              )}
            </button>
          </form>

          <div className="cyber-line my-6" />

          <p className="text-center text-gray-400 text-sm font-inter">
            No account?{' '}
            <Link to="/register" className="text-grid-cyan hover:text-white transition-colors font-semibold">
              Join GRID for free
            </Link>
          </p>
        </div>

        {/* Corner Decorations */}
        <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-grid-cyan rounded-tl-2xl opacity-60" />
        <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-grid-cyan rounded-br-2xl opacity-60" />
      </motion.div>
    </div>
  )
}
