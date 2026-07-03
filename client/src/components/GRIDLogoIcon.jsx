import React, { useId } from 'react'

/**
 * GRID Logo Icon — pure SVG, no image files.
 * Replicates the neural-network icon mark from the GRID brand logo:
 *   · 4 corner nodes (cyan glow)
 *   · 4 mid-edge nodes (smaller cyan)
 *   · 1 centre node (bright white/cyan, strongest glow)
 *   · Lines: outer square + X diagonals + 4 spokes to centre
 */
export default function GRIDLogoIcon({ size = 40, className = '', style = {} }) {
  // Per-instance unique prefix — prevents gradient/filter ID collisions
  // when multiple icons are rendered on the same page (e.g. navbar + footer)
  const uid = useId()
  const p = `gli${uid.replace(/:/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="GRID logo mark"
    >
      <defs>
        {/* Node gradients */}
        <radialGradient id={`${p}_cng`} cx="30%" cy="24%" r="76%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="18%"  stopColor="#e8f6ff" />
          <stop offset="46%"  stopColor="#66ccff" />
          <stop offset="82%"  stopColor="#0077cc" />
          <stop offset="100%" stopColor="#002a88" />
        </radialGradient>
        <radialGradient id={`${p}_ong`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#c8eaff" />
          <stop offset="34%"  stopColor="#33bbff" />
          <stop offset="74%"  stopColor="#0066cc" />
          <stop offset="100%" stopColor="#002277" />
        </radialGradient>
        <radialGradient id={`${p}_mng`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#99d8ff" />
          <stop offset="40%"  stopColor="#22aaff" />
          <stop offset="100%" stopColor="#004499" />
        </radialGradient>

        {/* Line gradient */}
        <linearGradient id={`${p}_lg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#002f99" stopOpacity="0.85" />
          <stop offset="38%"  stopColor="#0099ff" />
          <stop offset="62%"  stopColor="#00ccff" />
          <stop offset="100%" stopColor="#002f99" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${p}_lg2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#003388" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#00aaff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#003388" stopOpacity="0.7" />
        </linearGradient>

        {/* Glow filters */}
        <filter id={`${p}_gf`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}_cgf`} x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="2.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}_lf`} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="0.9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Lines ─────────────────────────────────────────────────────────── */}
      <g filter={`url(#${p}_lf)`}>
        {/* Outer square */}
        <line x1="22" y1="22" x2="78" y2="22" stroke={`url(#${p}_lg)`}  strokeWidth="1.15" strokeLinecap="round" />
        <line x1="78" y1="22" x2="78" y2="78" stroke={`url(#${p}_lg)`}  strokeWidth="1.15" strokeLinecap="round" />
        <line x1="78" y1="78" x2="22" y2="78" stroke={`url(#${p}_lg)`}  strokeWidth="1.15" strokeLinecap="round" />
        <line x1="22" y1="78" x2="22" y2="22" stroke={`url(#${p}_lg)`}  strokeWidth="1.15" strokeLinecap="round" />
        {/* X diagonals (corner-to-corner through centre) */}
        <line x1="22" y1="22" x2="78" y2="78" stroke={`url(#${p}_lg2)`} strokeWidth="0.88" strokeLinecap="round" opacity="0.9" />
        <line x1="78" y1="22" x2="22" y2="78" stroke={`url(#${p}_lg2)`} strokeWidth="0.88" strokeLinecap="round" opacity="0.9" />
        {/* Mid-edge spokes to centre */}
        <line x1="50" y1="22" x2="50" y2="50" stroke={`url(#${p}_lg2)`} strokeWidth="0.78" strokeLinecap="round" opacity="0.85" />
        <line x1="78" y1="50" x2="50" y2="50" stroke={`url(#${p}_lg2)`} strokeWidth="0.78" strokeLinecap="round" opacity="0.85" />
        <line x1="50" y1="78" x2="50" y2="50" stroke={`url(#${p}_lg2)`} strokeWidth="0.78" strokeLinecap="round" opacity="0.85" />
        <line x1="22" y1="50" x2="50" y2="50" stroke={`url(#${p}_lg2)`} strokeWidth="0.78" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* ── Corner nodes ──────────────────────────────────────────────────── */}
      {[[22,22],[78,22],[78,78],[22,78]].map(([cx,cy], i) => (
        <g key={`c${i}`}>
          <circle cx={cx} cy={cy} r="10" fill="rgba(0,170,255,0.04)" />
          <circle cx={cx} cy={cy} r="6.5" fill="rgba(0,150,255,0.10)" />
          <circle cx={cx} cy={cy} r="3.6" fill={`url(#${p}_ong)`} filter={`url(#${p}_gf)`} />
          {/* specular highlight */}
          <circle cx={cx-1.1} cy={cy-1.1} r="1.1" fill="rgba(255,255,255,0.72)" />
          {/* accent ring */}
          <circle cx={cx} cy={cy} r="5.4" fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="0.7" />
        </g>
      ))}

      {/* ── Mid-edge nodes ────────────────────────────────────────────────── */}
      {[[50,22],[78,50],[50,78],[22,50]].map(([cx,cy], i) => (
        <g key={`m${i}`}>
          <circle cx={cx} cy={cy} r="6.5" fill="rgba(0,150,255,0.06)" />
          <circle cx={cx} cy={cy} r="2.9" fill={`url(#${p}_mng)`} filter={`url(#${p}_gf)`} />
          <circle cx={cx-0.85} cy={cy-0.85} r="0.9" fill="rgba(255,255,255,0.65)" />
        </g>
      ))}

      {/* ── Centre node (brightest) ───────────────────────────────────────── */}
      <circle cx="50" cy="50" r="20" fill="rgba(0,160,255,0.03)" />
      <circle cx="50" cy="50" r="13" fill="rgba(0,150,255,0.07)" />
      <circle cx="50" cy="50" r="8"  fill="rgba(100,210,255,0.14)" />
      <circle cx="50" cy="50" r="5.2" fill={`url(#${p}_cng)`} filter={`url(#${p}_cgf)`} />
      {/* specular dot */}
      <circle cx="48.4" cy="48.4" r="1.9" fill="rgba(255,255,255,0.82)" />
    </svg>
  )
}
