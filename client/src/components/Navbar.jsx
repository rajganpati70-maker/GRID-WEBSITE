import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, LogOut, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/members', label: 'Members' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/forum', label: 'Forum' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
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
            <div className="hidden lg:flex items-center gap-8">
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

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-grid-cyan/20 hover:border-grid-cyan/50 transition-all duration-300 group"
                  >
                    <div className="w-7 h-7 avatar text-xs" style={{width:'28px',height:'28px',background:'linear-gradient(135deg,#0066ff,#00d4ff)'}}>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white font-rajdhani tracking-wide">{user.username}</span>
                    <ChevronRight className={`w-4 h-4 text-grid-cyan transition-transform duration-300 ${userMenuOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl overflow-hidden"
                      >
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-grid-cyan hover:bg-grid-cyan/5 transition-all duration-200 font-rajdhani tracking-wide">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 font-rajdhani tracking-wide">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-outline text-xs">Login</Link>
                  <Link to="/register" className="btn-primary text-xs">Join GRID</Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-grid-cyan hover:bg-grid-cyan/10 rounded-lg transition-all duration-200"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
                <div className="cyber-line my-2" />
                {user ? (
                  <>
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

      {/* Scan Line Effect */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-grid-cyan to-transparent opacity-30 z-40 pointer-events-none animate-pulse-slow" />
    </>
  )
}
