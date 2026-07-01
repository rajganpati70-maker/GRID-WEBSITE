import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageCircle, User, AtSign, X, CheckCheck, Zap } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

function formatRelTime(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const ICON_MAP = {
  message: MessageCircle,
  dm: AtSign,
  user: User,
  forum: Zap,
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAllRead, totalUnread } = useNotifications()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(o => !o)
  }

  const handleMarkAll = () => {
    markAllRead()
  }

  const badge = unreadCount

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className={`relative p-2.5 rounded-xl border transition-all duration-300 ${
          open
            ? 'border-grid-cyan/50 bg-grid-cyan/10 text-grid-cyan'
            : 'border-grid-cyan/20 text-gray-400 hover:text-grid-cyan hover:border-grid-cyan/40 hover:bg-grid-cyan/5'
        }`}
      >
        <Bell className="w-4 h-4" />
        <AnimatePresence>
          {badge > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-grid-black text-white text-[9px] font-bold flex items-center justify-center px-1 font-orbitron"
            >
              {badge > 99 ? '99+' : badge}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-80 glass-card rounded-2xl overflow-hidden z-50 border-grid-cyan/20"
            style={{ boxShadow: '0 20px 60px rgba(0,212,255,0.12), 0 0 0 1px rgba(0,212,255,0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-grid-cyan/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-grid-cyan" />
                <span className="font-orbitron text-xs font-bold text-white tracking-widest uppercase">Notifications</span>
                {badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold font-orbitron">
                    {badge}
                  </span>
                )}
              </div>
              <button
                onClick={handleMarkAll}
                disabled={badge === 0}
                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-grid-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-rajdhani tracking-widest uppercase"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Bell className="w-8 h-8 text-grid-cyan/20" />
                  <p className="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">No notifications yet</p>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((n, i) => {
                    const Icon = ICON_MAP[n.icon] || Bell
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex gap-3 px-4 py-3 hover:bg-grid-cyan/5 transition-colors cursor-default border-b border-grid-cyan/5 last:border-0 ${
                          !n.read ? 'bg-grid-cyan/3' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          n.type === 'dm' ? 'bg-purple-500/15 border border-purple-500/25' :
                          n.type === 'join' ? 'bg-green-500/15 border border-green-500/25' :
                          'bg-grid-cyan/10 border border-grid-cyan/20'
                        }`}>
                          <Icon className={`w-3.5 h-3.5 ${
                            n.type === 'dm' ? 'text-purple-400' :
                            n.type === 'join' ? 'text-green-400' :
                            'text-grid-cyan'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-white font-orbitron tracking-wide truncate">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-grid-cyan flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-400 font-inter leading-snug line-clamp-1">{n.body}</p>
                          <span className="text-[10px] text-gray-600 font-rajdhani tracking-wide">{formatRelTime(n.timestamp)}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-grid-cyan/10 px-4 py-2.5 bg-grid-dark/50">
                <p className="text-[10px] text-gray-600 font-rajdhani tracking-widest uppercase text-center">
                  {notifications.length} total · {notifications.filter(n => !n.read).length} unread
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
