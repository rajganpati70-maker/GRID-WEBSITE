import React, { useId } from 'react'

/**
 * GRID Full Logo — pure SVG code, no image files.
 *
 * Faithfully replicates the uploaded GRID brand logo:
 *   ┌─────────────────────────────────────────┐
 *   │  Neural-network icon (9 glowing nodes)  │
 *   │            G  R  I  D                   │
 *   │  · WHERE TECH MINDS CONNECT. ·          │
 *   └─────────────────────────────────────────┘
 *
 * Props:
 *   width  — rendered px width  (height auto via aspect ratio)
 *   className / style — passed to outer <svg>
 */
export default function GRIDLogoFull({ width = 420, className = '', style = {} }) {
  // Per-instance unique prefix — prevents gradient/filter ID collisions
  const uid = useId()
  const p = `glf${uid.replace(/:/g, '')}`

  // viewBox is 420 × 520 — icon takes top 300px, text block takes bottom 220px
  const VW = 420
  const VH = 520

  // Icon geometry — centred in a 420×300 area (origin offset 0,10)
  // 9-node network scaled to fit nicely
  const IX = 210  // icon centre x
  const IY = 148  // icon centre y
  const S  = 100  // half-span — outer square is S*1.92 × S*1.92

  const n = {
    TL: [IX - S, IY - S], TR: [IX + S, IY - S],
    BL: [IX - S, IY + S], BR: [IX + S, IY + S],
    TM: [IX,     IY - S], BM: [IX,     IY + S],
    LM: [IX - S, IY    ], RM: [IX + S, IY    ],
    C:  [IX,     IY    ],
  }

  const lines = [
    // outer square
    [n.TL, n.TR, true ], [n.TR, n.BR, true ],
    [n.BR, n.BL, true ], [n.BL, n.TL, true ],
    // X diagonals
    [n.TL, n.BR, false], [n.TR, n.BL, false],
    // spokes: mid-edge → centre
    [n.TM, n.C,  false], [n.RM, n.C,  false],
    [n.BM, n.C,  false], [n.LM, n.C,  false],
  ]

  const cornerNodes = [n.TL, n.TR, n.BR, n.BL]
  const midNodes    = [n.TM, n.RM, n.BM, n.LM]

  const height = Math.round(width * (VH / VW))

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${VW} ${VH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="GRID — Where Tech Minds Connect"
    >
      <defs>
        {/* ── Node fills ──────────────────────────────────────────────────── */}
        <radialGradient id={`${p}_cng`} cx="30%" cy="24%" r="76%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="16%"  stopColor="#ecf9ff" />
          <stop offset="44%"  stopColor="#66ccff" />
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

        {/* ── Line fills ──────────────────────────────────────────────────── */}
        <linearGradient id={`${p}_olg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#003399" stopOpacity="0.85" />
          <stop offset="40%"  stopColor="#0099ff" />
          <stop offset="62%"  stopColor="#00ccff" />
          <stop offset="100%" stopColor="#003399" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${p}_ilg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#003388" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#00aaff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#003388" stopOpacity="0.7" />
        </linearGradient>

        {/* ── GRID text: metallic chrome silver ───────────────────────────── */}
        <linearGradient id={`${p}_tg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#d4eaff" />
          <stop offset="18%"  stopColor="#ffffff" />
          <stop offset="42%"  stopColor="#b6d6f4" />
          <stop offset="63%"  stopColor="#88b8e8" />
          <stop offset="80%"  stopColor="#c4dcf6" />
          <stop offset="100%" stopColor="#557aaa" />
        </linearGradient>
        {/* subtle emboss shadow for GRID text */}
        <filter id={`${p}_tsh`} x="-5%" y="-10%" width="110%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#001133" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#0066cc" floodOpacity="0.25" />
        </filter>

        {/* ── Tagline gradient ─────────────────────────────────────────────── */}
        <linearGradient id={`${p}_tag`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2a3d55" stopOpacity="0.7" />
          <stop offset="28%"  stopColor="#7a9ab8" stopOpacity="0.9" />
          <stop offset="50%"  stopColor="#a8c4d8" />
          <stop offset="72%"  stopColor="#7a9ab8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2a3d55" stopOpacity="0.7" />
        </linearGradient>

        {/* ── Glow filters ─────────────────────────────────────────────────── */}
        <filter id={`${p}_ngf`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}_cngf`} x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="5.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}_lgf`} x="-4%" y="-120%" width="108%" height="340%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* overall icon glow */}
        <filter id={`${p}_igf`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ════════════════════════════════════════════════════════════════════
          NETWORK ICON
      ════════════════════════════════════════════════════════════════════ */}
      <g filter={`url(#${p}_igf)`}>

        {/* Lines */}
        <g filter={`url(#${p}_lgf)`}>
          {lines.map(([a, b, isOuter], i) => (
            <line
              key={i}
              x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
              stroke={isOuter ? `url(#${p}_olg)` : `url(#${p}_ilg)`}
              strokeWidth={isOuter ? 1.8 : 1.3}
              strokeLinecap="round"
              opacity={isOuter ? 1 : 0.88}
            />
          ))}
        </g>

        {/* Corner nodes */}
        {cornerNodes.map(([cx, cy], i) => (
          <g key={`co${i}`}>
            <circle cx={cx} cy={cy} r={26} fill="rgba(0,170,255,0.035)" />
            <circle cx={cx} cy={cy} r={15} fill="rgba(0,150,255,0.09)" />
            <circle cx={cx} cy={cy} r={8.8} fill="rgba(80,180,255,0.16)" />
            <circle cx={cx} cy={cy} r={6}   fill={`url(#${p}_ong)`} filter={`url(#${p}_ngf)`} />
            <circle cx={cx - 1.8} cy={cy - 1.8} r={1.9} fill="rgba(255,255,255,0.74)" />
            {/* accent ring */}
            <circle cx={cx} cy={cy} r={9.5} fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="1" />
          </g>
        ))}

        {/* Mid-edge nodes */}
        {midNodes.map(([cx, cy], i) => (
          <g key={`mi${i}`}>
            <circle cx={cx} cy={cy} r={16} fill="rgba(0,150,255,0.05)" />
            <circle cx={cx} cy={cy} r={8}  fill="rgba(0,140,255,0.10)" />
            <circle cx={cx} cy={cy} r={4.5} fill={`url(#${p}_mng)`} filter={`url(#${p}_ngf)`} />
            <circle cx={cx - 1.3} cy={cy - 1.3} r={1.4} fill="rgba(255,255,255,0.68)" />
          </g>
        ))}

        {/* Centre node — brightest */}
        <circle cx={IX} cy={IY} r={36} fill="rgba(0,150,255,0.03)" />
        <circle cx={IX} cy={IY} r={22} fill="rgba(0,140,255,0.07)" />
        <circle cx={IX} cy={IY} r={14} fill="rgba(80,200,255,0.13)" />
        <circle cx={IX} cy={IY} r={9.5} fill="rgba(160,230,255,0.22)" />
        <circle cx={IX} cy={IY} r={8.5} fill={`url(#${p}_cng)`} filter={`url(#${p}_cngf)`} />
        <circle cx={IX - 2.8} cy={IY - 2.8} r={3.2} fill="rgba(255,255,255,0.84)" />
        {/* pulse ring */}
        <circle cx={IX} cy={IY} r={8.5} fill="none" stroke="rgba(0,212,255,0.65)" strokeWidth="2" opacity="0.8">
          <animate attributeName="r"       values="8.5;26;8.5"  dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8"   dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={IX} cy={IY} r={8.5} fill="none" stroke="rgba(0,160,255,0.40)" strokeWidth="1.2" opacity="0.5">
          <animate attributeName="r"       values="8.5;19;8.5"  dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5"   dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        </circle>

        {/* Corner bracket accents (like the logo has slight corner markers) */}
        {[
          { pt: n.TL, sx:  1, sy:  1 },
          { pt: n.TR, sx: -1, sy:  1 },
          { pt: n.BL, sx:  1, sy: -1 },
          { pt: n.BR, sx: -1, sy: -1 },
        ].map(({ pt, sx, sy }, i) => {
          const [cx, cy] = pt
          const sz = 18
          return (
            <path
              key={`br${i}`}
              d={`M ${cx + sx*sz} ${cy} L ${cx} ${cy} L ${cx} ${cy + sy*sz}`}
              stroke="rgba(0,212,255,0.30)"
              strokeWidth="1.2"
              strokeLinecap="square"
              fill="none"
            />
          )
        })}
      </g>

      {/* ════════════════════════════════════════════════════════════════════
          "GRID" — metallic chrome lettering
      ════════════════════════════════════════════════════════════════════ */}
      <text
        x={VW / 2}
        y={318}
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', 'Haettenschweiler', sans-serif"
        fontWeight="900"
        fontSize="118"
        letterSpacing="-2"
        fill={`url(#${p}_tg)`}
        filter={`url(#${p}_tsh)`}
      >
        GRID
      </text>

      {/* Subtle blue inner glow on "D" — matching the logo's lit 'I' effect */}
      <text
        x={VW / 2 + 35}
        y={318}
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', 'Haettenschweiler', sans-serif"
        fontWeight="900"
        fontSize="118"
        letterSpacing="-2"
        fill="none"
        stroke="rgba(0,160,255,0.35)"
        strokeWidth="1"
        opacity="0.5"
      >
        D
      </text>

      {/* ════════════════════════════════════════════════════════════════════
          Tagline — "WHERE TECH MINDS CONNECT."
      ════════════════════════════════════════════════════════════════════ */}
      {/* Left decorative line */}
      <line x1="22" y1="363" x2="95" y2="363" stroke={`url(#${p}_tag)`} strokeWidth="0.8" opacity="0.7" />
      {/* Left dot */}
      <circle cx="101" cy="363" r="2.2" fill="rgba(0,180,255,0.65)" />
      {/* Right dot */}
      <circle cx={VW - 101} cy="363" r="2.2" fill="rgba(0,180,255,0.65)" />
      {/* Right decorative line */}
      <line x1={VW - 95} y1="363" x2={VW - 22} y2="363" stroke={`url(#${p}_tag)`} strokeWidth="0.8" opacity="0.7" />

      <text
        x={VW / 2}
        y={368}
        textAnchor="middle"
        fontFamily="'Arial', 'Helvetica Neue', sans-serif"
        fontWeight="400"
        fontSize="17.5"
        letterSpacing="5.5"
        fill={`url(#${p}_tag)`}
      >
        WHERE TECH MINDS CONNECT.
      </text>
    </svg>
  )
}
