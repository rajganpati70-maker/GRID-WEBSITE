import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, LogOut, LayoutDashboard, MessageCircle, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import NotificationBell from './NotificationBell'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/members', label: 'Members' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/forum', label: 'Forum' },
]

function Badge({ count }) {
  if (!count) return null
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-red-500 border-[1.5px] border-grid-black text-white text-[9px] font-bold flex items-center justify-center px-1 font-orbitron leading-none"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const notif = useNotifications()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const chatBadge = notif?.chatBadge || 0
  const dmBadge = notif?.dmBadge || 0
  const totalChatBadge = chatBadge + dmBadge

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-grid-black/95 backdrop-blur-xl border-b border-grid-cyan/10 shadow-[0_4px_30px_rgba(0,212,255,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/grid-logo.png" alt="GRID" className="w-10 h-10 object-contain" />
                <div className="absolute inset-0 bg-grid-cyan/20 rounded-full blur-lg group-hover:bg-grid-cyan/40 transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-xl text-white tracking-[0.2em] group-hover:text-grid-cyan transition-colors duration-300">GRID</span>
                <span className="text-[9px] text-grid-cyan/60 tracking-[0.3em] font-rajdhani uppercase">Where Tech Minds Connect</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right section */}
            <div className="hidden lg:flex items-center gap-2.5">
              {user ? (
                <>
                  {/* Live Chat button with badge */}
                  <Link
                    to="/chat"
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 text-xs font-rajdhani tracking-widest uppercase ${
                      location.pathname === '/chat'
                        ? 'border-grid-cyan/60 bg-grid-cyan/15 text-grid-cyan'
                        : 'border-grid-cyan/20 text-gray-400 hover:border-grid-cyan/50 hover:text-grid-cyan'
                    }`}
                  >
                    <span className="relative flex w-2 h-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                    </span>
                    <MessageCircle className="w-3.5 h-3.5" />
                    Live Chat
                    <AnimatePresence>
                      {totalChatBadge > 0 && (
                        <motion.span
                          key="chatbadge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-grid-black text-white text-[9px] font-bold flex items-center justify-center px-1 font-orbitron"
                        >
                          {totalChatBadge > 9 ? '9+' : totalChatBadge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* Notification Bell */}
                  <NotificationBell />

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-grid-cyan/20 hover:border-grid-cyan/50 transition-all duration-300 group"
                    >
                      <div
                        className="rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#0066ff,#00d4ff)', width: '26px', height: '26px' }}
                      >
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white font-rajdhani tracking-wide max-w-[80px] truncate">{user.username}</span>
                      <ChevronRight className={`w-3.5 h-3.5 text-grid-cyan transition-transform duration-300 ${userMenuOpen ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 glass-card rounded-xl overflow-hidden z-50 border-grid-cyan/20"
                          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.12)' }}
                        >
                          {/* User info */}
                          <div className="px-4 py-3 border-b border-grid-cyan/10 bg-grid-cyan/3">
                            <div className="font-orbitron text-xs font-bold text-white">{user.username}</div>
                            <div className="text-[10px] text-gray-500 font-inter truncate">{user.email}</div>
                          </div>
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-grid-cyan hover:bg-grid-cyan/5 transition-all duration-200 font-rajdhani tracking-wide">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link to="/chat" className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-gray-300 hover:text-grid-cyan hover:bg-grid-cyan/5 transition-all duration-200 font-rajdhani tracking-wide border-t border-grid-cyan/8">
                            <div className="flex items-center gap-3">
                              <MessageCircle className="w-4 h-4" />
                              Live Chat
                            </div>
                            {totalChatBadge > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold font-orbitron">{totalChatBadge}</span>
                            )}
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 font-rajdhani tracking-wide border-t border-grid-cyan/8">
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline text-xs">Login</Link>
                  <Link to="/register" className="btn-primary text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Join GRID
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: notification bell + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              {user && <NotificationBell />}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-grid-cyan hover:bg-grid-cyan/10 rounded-lg transition-all duration-200"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-grid-dark/98 backdrop-blur-xl border-t border-grid-cyan/10"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`nav-link text-base py-2 ${location.pathname === link.href ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="cyber-line my-1" />
                {user ? (
                  <>
                    <Link to="/chat" className="relative btn-outline text-center flex items-center justify-center gap-2">
                      <span className="relative flex w-2 h-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                      </span>
                      <MessageCircle className="w-4 h-4" /> Live Chat
                      {totalChatBadge > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-grid-dark text-white text-[9px] font-bold flex items-center justify-center px-1">
                          {totalChatBadge}
                        </span>
                      )}
                    </Link>
                    <Link to="/dashboard" className="btn-outline text-center">Dashboard</Link>
                    <button onClick={handleLogout} className="text-red-400 text-sm font-rajdhani tracking-wider uppercase py-2 hover:text-red-300 transition-colors">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-outline text-center">Login</Link>
                    <Link to="/register" className="btn-primary text-center">Join GRID</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Top scan line */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-grid-cyan to-transparent opacity-30 z-40 pointer-events-none animate-pulse-slow" />
    </>
  )
}
