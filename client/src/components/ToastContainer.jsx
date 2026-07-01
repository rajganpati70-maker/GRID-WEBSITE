import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, AtSign, UserPlus, Bell, Zap } from 'lucide-react'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

const ICONS = {
  chat: MessageCircle,
  dm: AtSign,
  join: UserPlus,
  forum: Zap,
  default: Bell,
}

const COLORS = {
  chat: { border: 'border-grid-cyan/40', icon: 'text-grid-cyan bg-grid-cyan/10', bar: 'from-grid-cyan to-grid-blue' },
  dm: { border: 'border-purple-500/40', icon: 'text-purple-400 bg-purple-500/10', bar: 'from-purple-500 to-blue-500' },
  join: { border: 'border-green-500/40', icon: 'text-green-400 bg-green-500/10', bar: 'from-green-500 to-teal-500' },
  forum: { border: 'border-yellow-500/40', icon: 'text-yellow-400 bg-yellow-500/10', bar: 'from-yellow-500 to-orange-500' },
  default: { border: 'border-grid-cyan/30', icon: 'text-grid-cyan bg-grid-cyan/10', bar: 'from-grid-cyan to-grid-blue' },
}

let globalAddToast = null

export const toast = {
  show: (opts) => {
    if (globalAddToast) globalAddToast(opts)
  }
}

function ToastItem({ id, type = 'default', title, body, onDismiss, duration = 5000 }) {
  const [progress, setProgress] = useState(100)
  const c = COLORS[type] || COLORS.default
  const Icon = ICONS[type] || ICONS.default

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p - (100 / (duration / 100))
        if (next <= 0) { onDismiss(id); return 0 }
        return next
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`relative w-72 rounded-xl overflow-hidden border bg-grid-dark/95 backdrop-blur-xl ${c.border}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.08)' }}
    >
      <div className="flex gap-3 p-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="font-orbitron text-xs font-bold text-white mb-0.5 tracking-wide">{title}</div>
          {body && <p className="text-xs text-gray-400 font-inter leading-snug line-clamp-2">{body}</p>}
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0 mt-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className={`h-full bg-gradient-to-r ${c.bar} transition-none`}
          style={{ width: `${progress}%`, opacity: 0.6 }}
        />
      </div>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((opts) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, ...opts }].slice(-5))
  }, [])

  useEffect(() => {
    globalAddToast = addToast
    return () => { globalAddToast = null }
  }, [addToast])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
