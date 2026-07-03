import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════════════════
   GRID HERO LOGO — large animated neural-network mark
   Exact same geometry as the navbar GRIDLogoIcon:
     · 4 corner nodes  (bright cyan, accent rings)
     · 4 mid-edge nodes (smaller cyan)
     · 1 centre node   (white-core, pulse rings, strongest glow)
     · Lines: outer square + X diagonals + 4 spokes to centre
   Plus hero-exclusive effects:
     · Continuous data-flow pulses racing along every line
     · Breathing / floating idle animation
     · Rotating outer ambient halo
     · Scanline sweep on mount
     · Corner bracket accents
═══════════════════════════════════════════════════════════════════════════ */

const VB   = 500            // viewBox size
const C    = 250            // centre
const SPAN = 155            // half-span of outer square

/* Node positions */
const N = {
  TL: [C - SPAN, C - SPAN],
  TR: [C + SPAN, C - SPAN],
  BR: [C + SPAN, C + SPAN],
  BL: [C - SPAN, C + SPAN],
  TM: [C,        C - SPAN],
  RM: [C + SPAN, C       ],
  BM: [C,        C + SPAN],
  LM: [C - SPAN, C       ],
  CC: [C,        C       ],
}

const OUTER_LINES = [
  [N.TL, N.TR], [N.TR, N.BR], [N.BR, N.BL], [N.BL, N.TL],
]
const DIAG_LINES = [
  [N.TL, N.BR], [N.TR, N.BL],
]
const SPOKE_LINES = [
  [N.TM, N.CC], [N.RM, N.CC], [N.BM, N.CC], [N.LM, N.CC],
]
const ALL_LINES = [...OUTER_LINES, ...DIAG_LINES, ...SPOKE_LINES]

const CORNERS = [N.TL, N.TR, N.BR, N.BL]
const MIDS    = [N.TM, N.RM, N.BM, N.LM]

const CORNER_BRACKETS = [
  { pt: N.TL, sx:  1, sy:  1 },
  { pt: N.TR, sx: -1, sy:  1 },
  { pt: N.BR, sx: -1, sy: -1 },
  { pt: N.BL, sx:  1, sy: -1 },
]

/* ── Data-pulse particle along a single line ─────────────────────────────── */
function DataPulse({ a, b, delay, dur = 1.6, color = '#00d4ff' }) {
  return (
    <motion.line
      x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
      stroke={color}
      strokeWidth={3.5}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
      animate={{
        pathLength:  [0, 0.18, 0.18, 0],
        pathOffset:  [0, 0, 0.82, 1],
        opacity:     [0, 1, 1, 0],
      }}
      transition={{
        duration: dur,
        delay,
        repeat: Infinity,
        repeatDelay: 0.4 + Math.random() * 2.8,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ── One network line with glow draw-in ─────────────────────────────────── */
function NetLine({ a, b, stroke, width, delay = 0, opacity = 1 }) {
  return (
    <motion.line
      x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      opacity={opacity}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ pathLength: { delay, duration: 0.5, ease: 'easeOut' }, opacity: { delay, duration: 0.2 } }}
    />
  )
}

/* ── Single node ─────────────────────────────────────────────────────────── */
function Node({ cx, cy, r, halos, fill, specularR, specularOff, accentR, delay = 0, isCenter = false }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.38, ease: [0.22, 1.8, 0.4, 1] }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {halos.map(([hr, alpha], i) => (
        <circle key={i} cx={cx} cy={cy} r={hr} fill={`rgba(0,170,255,${alpha})`} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={fill}
        style={{ filter: `drop-shadow(0 0 ${isCenter ? 18 : 8}px rgba(0,180,255,${isCenter ? 0.9 : 0.65}))` }} />
      <circle cx={cx - specularOff} cy={cy - specularOff} r={specularR} fill="rgba(255,255,255,0.82)" />
      {accentR && (
        <circle cx={cx} cy={cy} r={accentR} fill="none" stroke="rgba(0,212,255,0.28)" strokeWidth="1.4" />
      )}
      {isCenter && (
        <>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,212,255,0.7)" strokeWidth="2">
            <animate attributeName="r" values={`${r};${r + 38};${r}`} dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,160,255,0.45)" strokeWidth="1.2">
            <animate attributeName="r" values={`${r};${r + 24};${r}`} dur="2.6s" begin="1.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </motion.g>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function GRIDLogoHero({ size = 520 }) {
  return (
    <>
      <style>{`
        @keyframes heroLogoFloat {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-14px) rotate(0.4deg); }
          66%      { transform: translateY(-7px) rotate(-0.3deg); }
        }
        @keyframes heroHaloSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes heroHaloSpinRev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .grid-hero-logo-float { animation: none !important; }
          .grid-hero-halo-spin  { animation: none !important; }
        }
      `}</style>

      {/* Outer: Framer entrance only — no transform interference */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: size, flexShrink: 0 }}
      >
        {/* Inner: CSS float animation on a separate layer */}
        <div
          className="grid-hero-logo-float"
          style={{ animation: 'heroLogoFloat 7s ease-in-out infinite' }}
        >

      <svg
        width="100%"
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 0 60px rgba(0,140,255,0.35)) drop-shadow(0 0 120px rgba(0,80,200,0.2))',
          display: 'block',
        }}
      >
        <defs>
          {/* Line gradients */}
          <linearGradient id="hl_olg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#002f99" stopOpacity="0.85" />
            <stop offset="35%"  stopColor="#0088ff" />
            <stop offset="55%"  stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#002f99" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="hl_dlg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#003388" stopOpacity="0.72" />
            <stop offset="50%"  stopColor="#0099ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#003388" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="hl_slg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#003388" stopOpacity="0.65" />
            <stop offset="50%"  stopColor="#0088ee" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#003388" stopOpacity="0.65" />
          </linearGradient>

          {/* Node fills */}
          <radialGradient id="hl_cng" cx="30%" cy="24%" r="76%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="16%"  stopColor="#e8f8ff" />
            <stop offset="44%"  stopColor="#55ccff" />
            <stop offset="82%"  stopColor="#0077cc" />
            <stop offset="100%" stopColor="#002a88" />
          </radialGradient>
          <radialGradient id="hl_ong" cx="32%" cy="26%" r="72%">
            <stop offset="0%"   stopColor="#c4e8ff" />
            <stop offset="34%"  stopColor="#22bbff" />
            <stop offset="74%"  stopColor="#0066cc" />
            <stop offset="100%" stopColor="#002277" />
          </radialGradient>
          <radialGradient id="hl_mng" cx="32%" cy="26%" r="72%">
            <stop offset="0%"   stopColor="#88d8ff" />
            <stop offset="44%"  stopColor="#11aaff" />
            <stop offset="100%" stopColor="#004499" />
          </radialGradient>

          {/* Line glow filter */}
          <filter id="hl_lgf" x="-4%" y="-120%" width="108%" height="340%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Ambient outer halo gradient */}
          <radialGradient id="hl_halo" cx="50%" cy="50%" r="50%">
            <stop offset="72%"  stopColor="transparent" />
            <stop offset="88%"  stopColor="rgba(0,140,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,80,200,0.02)" />
          </radialGradient>

          {/* Dashed halo stroke */}
          <linearGradient id="hl_halog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="rgba(0,212,255,0.0)" />
            <stop offset="30%"  stopColor="rgba(0,212,255,0.22)" />
            <stop offset="60%"  stopColor="rgba(0,140,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0.0)" />
          </linearGradient>

          {/* Data pulse */}
          <linearGradient id="hl_pulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="35%"  stopColor="#00d4ff" stopOpacity="0.85" />
            <stop offset="65%"  stopColor="#ffffff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Subtle bg grid */}
          <pattern id="hl_grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,140,255,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* ── Ambient bg grid ──────────────────────────────────────────── */}
        <rect x="0" y="0" width={VB} height={VB} fill="url(#hl_grid)" opacity="0.6" />

        {/* ── Rotating outer halo rings ────────────────────────────────── */}
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: 'heroHaloSpin 28s linear infinite' }}>
          <circle cx={C} cy={C} r="232" fill="none" stroke="url(#hl_halog)"
            strokeWidth="0.9" strokeDasharray="18 14" opacity="0.55" />
        </g>
        <g style={{ transformOrigin: `${C}px ${C}px`, animation: 'heroHaloSpinRev 38s linear infinite' }}>
          <circle cx={C} cy={C} r="215" fill="none" stroke="rgba(0,150,255,0.14)"
            strokeWidth="0.6" strokeDasharray="8 22" opacity="0.5" />
        </g>

        {/* ── Ambient fill halo ─────────────────────────────────────────── */}
        <circle cx={C} cy={C} r="230" fill="url(#hl_halo)" />

        {/* ── Lines ────────────────────────────────────────────────────── */}
        <g filter="url(#hl_lgf)">
          {/* Outer square */}
          {OUTER_LINES.map(([a, b], i) => (
            <NetLine key={`ol${i}`} a={a} b={b} stroke="url(#hl_olg)" width={2.2} delay={i * 0.1} />
          ))}
          {/* X diagonals */}
          {DIAG_LINES.map(([a, b], i) => (
            <NetLine key={`dl${i}`} a={a} b={b} stroke="url(#hl_dlg)" width={1.6} delay={0.5 + i * 0.1} opacity={0.88} />
          ))}
          {/* Spokes */}
          {SPOKE_LINES.map(([a, b], i) => (
            <NetLine key={`sl${i}`} a={a} b={b} stroke="url(#hl_slg)" width={1.4} delay={0.82 + i * 0.1} opacity={0.82} />
          ))}
        </g>

        {/* ── Data-flow pulses ──────────────────────────────────────────── */}
        {ALL_LINES.map(([a, b], i) => (
          <DataPulse key={`dp${i}`} a={a} b={b}
            delay={0.9 + i * 0.22}
            dur={1.4 + (i % 4) * 0.28}
            color={i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#00d4ff' : '#66bbff'}
          />
        ))}

        {/* ── Corner bracket accents ────────────────────────────────────── */}
        {CORNER_BRACKETS.map(({ pt, sx, sy }, i) => {
          const [cx, cy] = pt
          const sz = 32
          return (
            <motion.path key={`br${i}`}
              d={`M ${cx + sx*sz} ${cy} L ${cx} ${cy} L ${cx} ${cy + sy*sz}`}
              stroke="rgba(0,212,255,0.35)" strokeWidth="1.8" strokeLinecap="square" fill="none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
            />
          )
        })}

        {/* ── Corner nodes ─────────────────────────────────────────────── */}
        {CORNERS.map(([cx, cy], i) => (
          <Node key={`cn${i}`}
            cx={cx} cy={cy} r={17}
            halos={[[42, 0.04], [26, 0.09], [20, 0.14]]}
            fill="url(#hl_ong)"
            specularR={5.5} specularOff={5}
            accentR={24}
            delay={0.28 + i * 0.1}
          />
        ))}

        {/* ── Mid-edge nodes ────────────────────────────────────────────── */}
        {MIDS.map(([cx, cy], i) => (
          <Node key={`mn${i}`}
            cx={cx} cy={cy} r={12.5}
            halos={[[28, 0.04], [17, 0.09]]}
            fill="url(#hl_mng)"
            specularR={4} specularOff={3.5}
            accentR={null}
            delay={0.55 + i * 0.1}
          />
        ))}

        {/* ── Centre node ───────────────────────────────────────────────── */}
        <Node
          cx={C} cy={C} r={27}
          halos={[[80, 0.03], [52, 0.07], [36, 0.13], [28, 0.2]]}
          fill="url(#hl_cng)"
          specularR={10} specularOff={9}
          accentR={null}
          delay={0.88}
          isCenter
        />

      </svg>
        </div>{/* end float wrapper */}
      </motion.div>
    </>
  )
}
