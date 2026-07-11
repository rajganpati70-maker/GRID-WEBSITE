import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import GRIDLogoIcon from './GRIDLogoIcon'

const navLinks = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/members', label: 'Members' },
  { href: '/events',  label: 'Events' },
  { href: '/blog',    label: 'Blog' },
  { href: '/projects',label: 'Projects' },
  { href: '/forum',   label: 'Forum' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

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
            <Link to="/" aria-label="GRID — Home" className="flex items-center group">
              <GRIDLogoIcon
                size={42}
                style={{ transition: 'filter 0.3s ease' }}
                className="group-hover:[filter:drop-shadow(0_0_10px_rgba(0,212,255,0.7))]"
              />
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

            {/* Mobile hamburger */}
            <div className="lg:hidden">
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
