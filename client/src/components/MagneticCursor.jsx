import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════════════════
   GRID NEURAL-NETWORK CURSOR
   – Precision cyan dot at exact mouse position
   – GRID icon (9-node network) trails behind with spring physics
   – Hover  → icon scales up, nodes brighten, outer ring pulses
   – Click  → centre node bursts white, icon compresses then snaps
   – Touch devices → falls back to system cursor, renders nothing
═══════════════════════════════════════════════════════════════════════════ */

/* ── Geometry (56 × 56 viewBox) ─────────────────────────────────────────── */
const C = 28               // centre
const R = 19               // half-span  (outer square = R*2 × R*2)
const NODES = {
  TL: [C - R, C - R], TR: [C + R, C - R],
  BL: [C - R, C + R], BR: [C + R, C + R],
  TM: [C,     C - R], BM: [C,     C + R],
  LM: [C - R, C    ], RM: [C + R, C    ],
  CC: [C,     C    ],
}
const LINES = [
  // outer square
  [NODES.TL, NODES.TR], [NODES.TR, NODES.BR],
  [NODES.BR, NODES.BL], [NODES.BL, NODES.TL],
  // X diagonals (corner to corner, through centre)
  [NODES.TL, NODES.BR], [NODES.TR, NODES.BL],
  // 4 spokes: mid-edge → centre
  [NODES.TM, NODES.CC], [NODES.RM, NODES.CC],
  [NODES.BM, NODES.CC], [NODES.LM, NODES.CC],
]
const CORNERS  = [NODES.TL, NODES.TR, NODES.BR, NODES.BL]
const MIDS     = [NODES.TM, NODES.RM, NODES.BM, NODES.LM]

/* ── GRID Icon SVG ──────────────────────────────────────────────────────── */
function GRIDCursorIcon({ hovered, clicking }) {
  const scale   = clicking ? 0.82 : hovered ? 1.22 : 1
  const glow    = clicking ? 38   : hovered ? 28   : 14
  const opacity = clicking ? 1    : hovered ? 0.95 : 0.88

  const lineOpacity  = hovered ? 1    : 0.72
  const nodeGlow     = hovered ? 1    : 0.62
  const coreColor    = clicking ? '#ffffff' : '#88e8ff'

  return (
    <svg
      width="56" height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `drop-shadow(0 0 ${glow}px rgba(0,212,255,${clicking ? 0.95 : hovered ? 0.75 : 0.45}))`,
        transition: 'filter 0.18s ease',
        opacity,
        transform: `scale(${scale})`,
        transition: 'transform 0.18s cubic-bezier(0.22,1,0.36,1), filter 0.18s ease, opacity 0.18s ease',
      }}
    >
      <defs>
        <linearGradient id="gc_olg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#003399" stopOpacity="0.9" />
          <stop offset="40%"  stopColor="#0099ff" />
          <stop offset="62%"  stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#003399" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="gc_ilg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#003388" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#00aaff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#003388" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="gc_cng" cx="30%" cy="24%" r="76%">
          <stop offset="0%"   stopColor={coreColor} />
          <stop offset="22%"  stopColor="#c0eeff" />
          <stop offset="50%"  stopColor="#44ccff" />
          <stop offset="84%"  stopColor="#0077cc" />
          <stop offset="100%" stopColor="#002a88" />
        </radialGradient>
        <radialGradient id="gc_ong" cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#b0e2ff" />
          <stop offset="38%"  stopColor="#22bbff" />
          <stop offset="76%"  stopColor="#0066cc" />
          <stop offset="100%" stopColor="#002277" />
        </radialGradient>
        <radialGradient id="gc_mng" cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#88d8ff" />
          <stop offset="44%"  stopColor="#11aaff" />
          <stop offset="100%" stopColor="#004499" />
        </radialGradient>
        <filter id="gc_nf" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gc_cf" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation={clicking ? 3.5 : 2.2} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gc_lf" x="-4%" y="-180%" width="108%" height="460%">
          <feGaussianBlur stdDeviation="0.7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Lines ─────────────────────────────────────────────────────── */}
      <g filter="url(#gc_lf)" opacity={lineOpacity}>
        {/* Outer square */}
        {[[NODES.TL,NODES.TR],[NODES.TR,NODES.BR],[NODES.BR,NODES.BL],[NODES.BL,NODES.TL]].map(([a,b],i)=>(
          <line key={`ol${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke="url(#gc_olg)" strokeWidth="1.1" strokeLinecap="round" />
        ))}
        {/* X diagonals */}
        {[[NODES.TL,NODES.BR],[NODES.TR,NODES.BL]].map(([a,b],i)=>(
          <line key={`dl${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke="url(#gc_ilg)" strokeWidth="0.82" strokeLinecap="round" opacity="0.9" />
        ))}
        {/* Spokes */}
        {[[NODES.TM,NODES.CC],[NODES.RM,NODES.CC],[NODES.BM,NODES.CC],[NODES.LM,NODES.CC]].map(([a,b],i)=>(
          <line key={`sp${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke="url(#gc_ilg)" strokeWidth="0.75" strokeLinecap="round" opacity="0.84" />
        ))}
      </g>

      {/* ── Corner nodes ─────────────────────────────────────────────── */}
      {CORNERS.map(([cx,cy], i) => (
        <g key={`cn${i}`} opacity={nodeGlow}>
          <circle cx={cx} cy={cy} r="7" fill="rgba(0,160,255,0.05)" />
          <circle cx={cx} cy={cy} r="4" fill="rgba(0,140,255,0.12)" />
          <circle cx={cx} cy={cy} r="2.7" fill="url(#gc_ong)" filter="url(#gc_nf)" />
          <circle cx={cx-0.8} cy={cy-0.8} r="0.88" fill="rgba(255,255,255,0.72)" />
          <circle cx={cx} cy={cy} r="4.2" fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="0.65" />
        </g>
      ))}

      {/* ── Mid-edge nodes ────────────────────────────────────────────── */}
      {MIDS.map(([cx,cy], i) => (
        <g key={`mn${i}`} opacity={nodeGlow * 0.9}>
          <circle cx={cx} cy={cy} r="4.5" fill="rgba(0,140,255,0.07)" />
          <circle cx={cx} cy={cy} r="2.1" fill="url(#gc_mng)" filter="url(#gc_nf)" />
          <circle cx={cx-0.6} cy={cy-0.6} r="0.65" fill="rgba(255,255,255,0.65)" />
        </g>
      ))}

      {/* ── Centre node (hotspot / brightest) ────────────────────────── */}
      <circle cx={C} cy={C} r={clicking ? 11 : 8} fill="rgba(0,150,255,0.06)"
        style={{ transition: 'r 0.12s ease' }} />
      <circle cx={C} cy={C} r={clicking ? 7 : 5}  fill="rgba(0,140,255,0.12)"
        style={{ transition: 'r 0.12s ease' }} />
      <circle cx={C} cy={C} r={clicking ? 4.5 : 3.5} fill="rgba(100,210,255,0.22)"
        style={{ transition: 'r 0.12s ease' }} />
      <circle cx={C} cy={C} r={clicking ? 3.5 : 2.8}
        fill="url(#gc_cng)" filter="url(#gc_cf)"
        style={{ transition: 'r 0.12s ease' }} />
      <circle cx={C-0.9} cy={C-0.9} r={clicking ? 1.4 : 1.1}
        fill="rgba(255,255,255,0.88)"
        style={{ transition: 'r 0.12s ease' }} />

      {/* ── Hover pulse ring ──────────────────────────────────────────── */}
      {hovered && (
        <circle cx={C} cy={C} r="28" fill="none"
          stroke="rgba(0,212,255,0.18)" strokeWidth="1"
          style={{ animation: 'none' }} />
      )}

      {/* ── Click burst rings ─────────────────────────────────────────── */}
      {clicking && <>
        <circle cx={C} cy={C} r="8" fill="none"
          stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" opacity="0.9" />
        <circle cx={C} cy={C} r="14" fill="none"
          stroke="rgba(0,212,255,0.35)" strokeWidth="0.8" opacity="0.7" />
      </>}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function MagneticCursor() {
  const [visible,  setVisible]  = useState(false)
  const [hovered,  setHovered]  = useState(false)
  const [clicking, setClicking] = useState(false)
  const visibleRef = useRef(false)

  /* Exact mouse position (no lag) */
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  /* Trailing GRID icon — spring lag */
  const sx = useSpring(mx, { stiffness: 68, damping: 16, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 68, damping: 16, mass: 0.5 })

  useEffect(() => {
    /* Touch devices keep system cursor */
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    document.body.style.cursor = 'none'

    const move = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      if (!visibleRef.current) { visibleRef.current = true; setVisible(true) }
    }

    const over = (e) => {
      if (e.target.closest('button, a, input, textarea, select, [role="button"], [data-cursor]')) {
        setHovered(true)
      }
    }
    const out = (e) => {
      if (!e.relatedTarget?.closest('button, a, input, textarea, select, [role="button"], [data-cursor]')) {
        setHovered(false)
      }
    }

    const down = () => setClicking(true)
    const up   = () => setClicking(false)

    window.addEventListener('mousemove',   move,  { passive: true })
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout',  out)
    document.addEventListener('mousedown', down)
    document.addEventListener('mouseup',   up)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove',   move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout',  out)
      document.removeEventListener('mousedown', down)
      document.removeEventListener('mouseup',   up)
    }
  }, [])

  if (!visible) return null

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, pointerEvents: 'none', overflow: 'hidden' }}>

      {/* ── GRID icon — trails mouse with spring ── */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: sx, y: sy,
          translateX: '-50%', translateY: '-50%',
          willChange: 'transform',
        }}
      >
        <GRIDCursorIcon hovered={hovered} clicking={clicking} />
      </motion.div>

      {/* ── Precision dot — exact mouse position, always sharp ── */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          width:  clicking ? 3 : 4,
          height: clicking ? 3 : 4,
          borderRadius: '50%',
          background: clicking ? '#ffffff' : '#00d4ff',
          boxShadow: clicking
            ? '0 0 8px 3px rgba(255,255,255,0.9)'
            : '0 0 10px 2px rgba(0,212,255,0.85)',
          transition: 'width 0.1s ease, height 0.1s ease, background 0.1s ease, box-shadow 0.1s ease',
          willChange: 'transform',
          zIndex: 1,
        }}
      />

    </div>,
    document.body
  )
}
