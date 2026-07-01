import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Youtube, Mail, MapPin, ExternalLink } from 'lucide-react'

const footerLinks = {
  Community: [
    { label: 'About GRID', href: '/about' },
    { label: 'Members', href: '/members' },
    { label: 'Events', href: '/events' },
    { label: 'Forum', href: '/forum' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Platform: [
    { label: 'Join GRID', href: '/register' },
    { label: 'Login', href: '/login' },
  ],
}

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-grid-cyan/10 bg-grid-dark/50 backdrop-blur-xl">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative">
                <img src="/grid-logo.png" alt="GRID" className="w-12 h-12 object-contain" />
                <div className="absolute inset-0 bg-grid-cyan/20 rounded-full blur-xl group-hover:bg-grid-cyan/40 transition-all duration-300" />
              </div>
              <div>
                <div className="font-orbitron font-bold text-2xl text-white tracking-[0.25em]">GRID</div>
                <div className="text-[10px] text-grid-cyan/60 tracking-[0.3em] font-rajdhani uppercase">Where Tech Minds Connect</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-inter max-w-xs mb-6">
              The premier community for developers, engineers, and tech innovators. Build. Connect. Innovate. Together.
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4 font-rajdhani tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-grid-cyan" />
              <span>Global Network · 50+ Countries</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-rajdhani tracking-wide">
              <Mail className="w-3.5 h-3.5 text-grid-cyan" />
              <span>contact@grid.community</span>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-grid-cyan/20 text-gray-400 hover:text-grid-cyan hover:border-grid-cyan/60 hover:bg-grid-cyan/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-orbitron text-xs font-semibold tracking-[0.2em] text-grid-cyan uppercase mb-5">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-grid-cyan transition-colors duration-200 font-rajdhani tracking-wide flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 text-grid-cyan">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="cyber-line mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-rajdhani tracking-widest uppercase">
            © {new Date().getFullYear()} GRID Community · All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">Privacy Policy</span>
            <span className="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">Terms of Service</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-rajdhani tracking-widest uppercase">All Systems Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
