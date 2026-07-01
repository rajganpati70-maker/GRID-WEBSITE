import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, AlertCircle, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const CATS = ['General', 'AI/ML', 'DevOps', 'Frontend', 'Languages', 'Security', 'Blockchain']

const CAT_COLORS = {
  'DevOps': 'border-orange-400/40 text-orange-400',
  'Languages': 'border-yellow-400/40 text-yellow-400',
  'Blockchain': 'border-blue-400/40 text-blue-400',
  'General': 'border-gray-400/40 text-gray-400',
  'AI/ML': 'border-purple-400/40 text-purple-400',
  'Frontend': 'border-cyan-400/40 text-cyan-400',
  'Security': 'border-red-400/40 text-red-400',
}

export default function NewThreadModal({ onClose, onCreated }) {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('Title and content are required'); return }
    setPosting(true)
    setError('')
    try {
      const res = await axios.post('/api/forum', { title: title.trim(), content: content.trim(), category }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onCreated?.(res.data)
      onClose?.()
      navigate(`/forum/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create thread')
    } finally {
      setPosting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 80px rgba(0,212,255,0.1), 0 0 0 1px rgba(0,212,255,0.15)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-grid-cyan/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-grid-cyan/10 border border-grid-cyan/25 flex items-center justify-center">
                <Zap className="w-4 h-4 text-grid-cyan" />
              </div>
              <div>
                <h2 className="font-orbitron text-sm font-black text-white tracking-widest uppercase">New Thread</h2>
                <p className="text-[10px] text-gray-500 font-rajdhani tracking-widest">Start a discussion with the GRID community</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all duration-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={submit} className="p-6 space-y-5">
            {/* Category */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-rajdhani tracking-widest uppercase transition-all duration-200 ${
                      category === c
                        ? `${CAT_COLORS[c]} bg-current/10 scale-105`
                        : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                    }`}
                    style={category === c ? { backgroundColor: `color-mix(in srgb, currentColor 10%, transparent)` } : {}}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-2">
                Title <span className="text-gray-700">({title.length}/500)</span>
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 500))}
                placeholder="What's your question or discussion topic?"
                className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 outline-none focus:border-grid-cyan/60 transition-colors placeholder-gray-600"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-[10px] text-gray-500 font-rajdhani tracking-[0.3em] uppercase mb-2">
                Content <span className="text-gray-700">({content.length}/5000)</span>
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value.slice(0, 5000))}
                placeholder="Share your thoughts, code snippets, questions, or findings in detail..."
                rows={7}
                className="w-full bg-white/4 border border-grid-cyan/20 rounded-xl text-white text-sm font-inter px-4 py-3 outline-none focus:border-grid-cyan/60 transition-colors resize-none placeholder-gray-600"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-inter">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 btn-outline text-xs py-2.5">Cancel</button>
              <button
                type="submit"
                disabled={posting || !title.trim() || !content.trim()}
                className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Posting...</> : <><Send className="w-3.5 h-3.5" /> Post Thread</>}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
