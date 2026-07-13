import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Youtube, Mail, MapPin, ArrowRight, Brain } from 'lucide-react'
import GRIDLogoIcon from './GRIDLogoIcon'

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
  ],
}

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

const jak = '"Plus Jakarta Sans",sans-serif'

function SocialIcon({ icon: Icon, href, label }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(0,212,255,0.45)' : 'rgba(0,212,255,0.14)'}`,
        color: hov ? '#00d4ff' : 'rgba(160,180,210,0.65)',
        boxShadow: hov ? '0 0 24px rgba(0,212,255,0.18)' : 'none',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <Icon style={{ width: 16, height: 16 }} />
    </a>
  )
}

function FooterLink({ label, href }) {
  const [hov, setHov] = useState(false)
  return (
    <li>
      <Link
        to={href}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          fontFamily: jak, fontSize: 13.5, fontWeight: 500,
          color: hov ? '#00d4ff' : 'rgba(160,180,210,0.68)',
          display: 'flex', alignItems: 'center', gap: 7,
          transition: 'color 0.2s ease', textDecoration: 'none',
        }}
      >
        <span style={{
          width: hov ? 12 : 0, height: 1.5, borderRadius: 1, background: 'linear-gradient(90deg,#0066ff,#00d4ff)',
          overflow: 'hidden', transition: 'width 0.25s ease', boxShadow: hov ? '0 0 8px rgba(0,212,255,0.7)' : 'none',
        }} />
        {label}
      </Link>
    </li>
  )
}

export default function Footer() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(2,2,14,0.4) 0%, #02020a 100%)', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div style={{ position: 'absolute', top: '-20%', left: '20%', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(0,102,255,0.09) 0%,transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),rgba(123,47,255,0.35),transparent)' }} />

      {/* ── CTA strip ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 56 }}>
        <div style={{
          borderRadius: 24, padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(0,82,204,0.14) 0%, rgba(0,212,255,0.06) 100%)',
          border: '1px solid rgba(0,212,255,0.18)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(0,212,255,0.06)',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <Brain style={{ width: 13, height: 13, color: '#00d4ff' }} />
              <span style={{ fontFamily: jak, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,212,255,0.7)' }}>Join the network</span>
            </div>
            <h3 style={{ fontFamily: jak, fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.7rem)', letterSpacing: '-0.03em', color: '#f0f6ff', margin: 0 }}>
              Ready to build with 12,000+ ML minds?
            </h3>
          </div>
          <Link to="/members" className="btn-primary" style={{ gap: 8 }}>
            Get started <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit" style={{ textDecoration: 'none' }}>
              <GRIDLogoIcon size={46} className="group-hover:[filter:drop-shadow(0_0_10px_rgba(0,212,255,0.6))] transition-[filter] duration-300" />
              <div>
                <div style={{ fontFamily: jak, fontWeight: 800, fontSize: 21, color: '#f0f6ff', letterSpacing: '0.06em' }}>GRID</div>
                <div style={{ fontFamily: jak, fontSize: 9.5, color: 'rgba(0,212,255,0.55)', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 1 }}>Where ML minds connect</div>
              </div>
            </Link>
            <p style={{ fontFamily: jak, fontSize: 13.5, lineHeight: 1.75, color: 'rgba(160,180,210,0.62)', maxWidth: 340, marginBottom: 22 }}>
              The premier community for ML researchers, engineers, and practitioners — training models, sharing research, and shipping production systems together.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: jak, fontSize: 12.5, color: 'rgba(160,180,210,0.55)' }}>
                <MapPin style={{ width: 14, height: 14, color: '#00d4ff' }} />
                Global network · 50+ countries
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: jak, fontSize: 12.5, color: 'rgba(160,180,210,0.55)' }}>
                <Mail style={{ width: 14, height: 14, color: '#00d4ff' }} />
                contact@grid.community
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {socials.map(s => <SocialIcon key={s.label} {...s} />)}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ fontFamily: jak, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,212,255,0.6)', marginBottom: 18 }}>
                {section}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
                {links.map(link => <FooterLink key={link.label} {...link} />)}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.16),transparent)', margin: '48px 0 24px' }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: jak, fontSize: 11.5, letterSpacing: '0.08em', color: 'rgba(140,160,190,0.45)' }}>
            © {new Date().getFullYear()} GRID Community · All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <span style={{ fontFamily: jak, fontSize: 11.5, letterSpacing: '0.08em', color: 'rgba(140,160,190,0.4)', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ fontFamily: jak, fontSize: 11.5, letterSpacing: '0.08em', color: 'rgba(140,160,190,0.4)', cursor: 'pointer' }}>Terms of Service</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} className="animate-pulse" />
              <span style={{ fontFamily: jak, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.85)' }}>All systems online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
