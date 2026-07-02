import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

/*
  GRID Logo SVG Animation
  Recreates the actual GRID logo network graph (9 nodes, 10 lines).
  Phases:  BUILD → HOLD → GLITCH → FADE → RESET  (loops forever)

  Key constraints:
  - framer-motion CANNOT animate SVG presentation attrs (r, x1, y1, cx, cy, etc.)
  - Position changes handled via React state → regular attribute updates
  - Scaling uses CSS transform via framer-motion `scale` / `style`
  - Line draw-in uses SVG stroke-dashoffset via `pathLength`
*/

/* ── Node positions (300×300 viewBox) ─────────────────────────────────────── */
const BASE = {
  TL:{ x:60,  y:60  }, TM:{ x:150, y:60  }, TR:{ x:240, y:60  },
  LM:{ x:60,  y:150 }, C: { x:150, y:150 }, RM:{ x:240, y:150 },
  BL:{ x:60,  y:240 }, BM:{ x:150, y:240 }, BR:{ x:240, y:240 },
}

const LINES = [
  ['TL','TR',0], ['TR','BR',1], ['BR','BL',2], ['BL','TL',3],
  ['TL','BR',4], ['TR','BL',5],
  ['TM','C',6],  ['RM','C',7],  ['BM','C',8],  ['LM','C',9],
]

const NODE_SEQ = ['TL','TR','BR','BL','TM','RM','BM','LM','C']
const NODE_R   = { TL:4.5, TR:4.5, BR:4.5, BL:4.5, TM:3.5, RM:3.5, BM:3.5, LM:3.5, C:9 }

const rnd = (range) => (Math.random() - 0.5) * range * 2

function buildGlitch() {
  const g = {}
  Object.keys(BASE).forEach(k => { g[k] = { dx: rnd(24), dy: rnd(24) } })
  return g
}

/* ── Resolved positions (BASE + optional glitch offsets) ─────────────────── */
function resolvePos(glitch) {
  const pos = {}
  Object.keys(BASE).forEach(k => {
    pos[k] = {
      x: BASE[k].x + (glitch?.[k]?.dx ?? 0),
      y: BASE[k].y + (glitch?.[k]?.dy ?? 0),
    }
  })
  return pos
}

/* ── Single line (draw-in via pathLength) ────────────────────────────────── */
function NetLine({ x1, y1, x2, y2, delay, drawn }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="url(#lineGrad)"
      strokeWidth={1.25}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
      transition={{
        pathLength: { delay, duration: 0.52, ease: 'easeOut' },
        opacity: { delay, duration: 0.3 },
      }}
    />
  )
}

/* ── Single node (pop-in, then optional pulse/glitch scale) ──────────────── */
function NetNode({ id, cx, cy, delay, visible, glitching }) {
  const r = NODE_R[id]
  const isC = id === 'C'

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible
          ? glitching
            ? [1, 1.7, 0.4, 1.4, 0.8, 1]
            : 1
          : 0,
      }}
      transition={{
        opacity: { delay, duration: 0.28 },
        scale: {
          delay,
          duration: glitching ? 0.5 : 0.38,
          ease: glitching ? 'easeInOut' : [0.34, 1.56, 0.64, 1],
        },
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Outer ambient halo */}
      <circle
        cx={cx} cy={cy}
        r={isC ? 26 : r * 2.2}
        fill={isC ? 'rgba(0,212,255,0.06)' : 'rgba(0,212,255,0.04)'}
      />
      {/* Mid-glow ring */}
      <circle
        cx={cx} cy={cy}
        r={isC ? 16 : r * 1.55}
        fill={isC ? 'rgba(0,212,255,0.12)' : 'rgba(0,212,255,0.07)'}
      />
      {/* Core — static r, scale via parent motion.g */}
      <circle
        cx={cx} cy={cy}
        r={r}
        fill={isC ? 'url(#centerGrad)' : 'url(#nodeGrad)'}
      />
      {/* Center pulse ring — pure CSS animation */}
      {isC && (
        <circle
          cx={cx} cy={cy}
          r={r}
          fill="none"
          stroke="rgba(0,212,255,0.55)"
          strokeWidth={1.2}
          style={{ animation: 'centerPulse 2.4s ease-out infinite' }}
        />
      )}
    </motion.g>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function GridLogoAnimation({ size = 520, opacity = 0.14 }) {
  const [phase,    setPhase]    = useState('build')
  const [glitch,   setGlitch]   = useState(null)
  const [cycleKey, setCycleKey] = useState(0)
  const t = useRef(null)

  useEffect(() => {
    const clear = () => clearTimeout(t.current)
    const after = (ms, fn) => { clear(); t.current = setTimeout(fn, ms) }

    const loop = () => {
      setPhase('build'); setGlitch(null)
      after(2700, () => {                         // BUILD done
        setPhase('hold')
        after(2600, () => {                       // HOLD done
          setGlitch(buildGlitch()); setPhase('glitch')
          after(1000, () => {                     // GLITCH done
            setPhase('fade')
            after(650, () => {                    // FADE done
              setPhase('reset')
              after(180, () => {
                setCycleKey(k => k + 1)
                loop()
              })
            })
          })
        })
      })
    }
    loop()
    return clear
  }, [])

  const built     = phase !== 'reset'
  const glitching = phase === 'glitch'
  const fading    = phase === 'fade'
  const pos       = resolvePos(glitching ? glitch : null)

  return (
    <>
      {/* CSS for center pulse ring (can't animate SVG `r` via framer-motion) */}
      <style>{`
        @keyframes centerPulse {
          0%   { r: 9px;  opacity: 0.6; }
          80%  { r: 28px; opacity: 0;   }
          100% { r: 9px;  opacity: 0;   }
        }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.svg
          key={cycleKey}
          width={size} height={size}
          viewBox="0 0 300 300"
          animate={{
            opacity: fading ? 0 : opacity,
          }}
          transition={{ opacity: { duration: fading ? 0.5 : 0 } }}
          style={{
            filter: glitching
              ? 'drop-shadow(0 0 22px rgba(0,212,255,0.85))'
              : 'drop-shadow(0 0 10px rgba(0,212,255,0.35))',
            transition: 'filter 0.2s ease',
          }}
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#0052cc" stopOpacity="0.85" />
              <stop offset="50%"  stopColor="#00d4ff" stopOpacity="1"    />
              <stop offset="100%" stopColor="#0052cc" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="nodeGrad" cx="38%" cy="28%" r="70%">
              <stop offset="0%"   stopColor="#7dd3fc" />
              <stop offset="55%"  stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0052cc" />
            </radialGradient>
            <radialGradient id="centerGrad" cx="38%" cy="28%" r="70%">
              <stop offset="0%"   stopColor="#ffffff" />
              <stop offset="25%"  stopColor="#d0f4ff" />
              <stop offset="65%"  stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#003aaa" />
            </radialGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <g filter="url(#glow)">
            {/* Lines */}
            {LINES.map(([from, to, seq]) => {
              const p1 = pos[from], p2 = pos[to]
              return (
                <NetLine key={`${from}-${to}-${cycleKey}`}
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  delay={seq * 0.17} drawn={built}
                />
              )
            })}

            {/* Nodes */}
            {NODE_SEQ.map((id, i) => {
              const p = pos[id]
              return (
                <NetNode key={`${id}-${cycleKey}`}
                  id={id} cx={p.x} cy={p.y}
                  delay={i * 0.17 + 0.4}
                  visible={built}
                  glitching={glitching}
                />
              )
            })}
          </g>
        </motion.svg>
      </div>
    </>
  )
}
