import React, { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════════════════
   GRID LOGO — ULTRA PREMIUM ANIMATED SYSTEM
   Phases: INIT → PARTICLE_BURST → BUILD_LINES → BUILD_NODES →
           FORGE_TEXT → TAGLINE → HOLD → GLITCH → DISSOLVE → RESET
═══════════════════════════════════════════════════════════════════════════ */

/* ── Geometry (300 × 300 viewBox) ───────────────────────────────────────── */
const BASE = {
  TL: { x: 54,  y: 54  },
  TM: { x: 150, y: 54  },
  TR: { x: 246, y: 54  },
  LM: { x: 54,  y: 150 },
  C:  { x: 150, y: 150 },
  RM: { x: 246, y: 150 },
  BL: { x: 54,  y: 246 },
  BM: { x: 150, y: 246 },
  BR: { x: 246, y: 246 },
}

/* Line definitions: [fromKey, toKey, drawDelay, isOuter] */
const LINES = [
  ['TL','TR', 0,   true ],
  ['TR','BR', 0.1, true ],
  ['BR','BL', 0.2, true ],
  ['BL','TL', 0.3, true ],
  ['TL','BR', 0.5, false],
  ['TR','BL', 0.6, false],
  ['TM','C',  0.8, false],
  ['RM','C',  0.9, false],
  ['BM','C',  1.0, false],
  ['LM','C',  1.1, false],
]

/* Node build order + visual config */
const NODES = [
  { id:'TL', r:5.5,  glow:12, seq:0   },
  { id:'TR', r:5.5,  glow:12, seq:1   },
  { id:'BR', r:5.5,  glow:12, seq:2   },
  { id:'BL', r:5.5,  glow:12, seq:3   },
  { id:'TM', r:4,    glow:9,  seq:4   },
  { id:'RM', r:4,    glow:9,  seq:5   },
  { id:'BM', r:4,    glow:9,  seq:6   },
  { id:'LM', r:4,    glow:9,  seq:7   },
  { id:'C',  r:10.5, glow:26, seq:8   },
]

/* Phase timing in ms — tuned for fast, punchy build */
const T = {
  PARTICLE_BURST : 280,
  BUILD_LINES    : 750,
  BUILD_NODES    : 1450,
  FORGE_TEXT     : 1950,
  TAGLINE        : 2650,
  HOLD           : 5200,
  GLITCH         : 6400,
  DISSOLVE       : 7200,
  RESET          : 7800,
}

const PHASES = [
  'init','particle_burst','build_lines','build_nodes',
  'forge_text','tagline','hold','glitch','dissolve','reset'
]

const rnd = (n) => (Math.random() - 0.5) * 2 * n
const uid = () => Math.random().toString(36).slice(2)

/* ── Spark particle data ────────────────────────────────────────────────── */
function makeSparks(n = 48) {
  return Array.from({ length: n }, (_, i) => ({
    id: uid(),
    angle: (i / n) * 360 + rnd(10),
    dist:  60 + Math.random() * 90,
    size:  Math.random() * 2.4 + 0.6,
    dur:   0.55 + Math.random() * 0.45,
    color: Math.random() > 0.6 ? '#00d4ff' : Math.random() > 0.5 ? '#0066ff' : '#ffffff',
  }))
}

/* ── Glitch offsets ─────────────────────────────────────────────────────── */
function makeGlitch() {
  const g = {}
  Object.keys(BASE).forEach(k => { g[k] = { dx: rnd(18), dy: rnd(18) } })
  return g
}

function resolvePos(glitch) {
  const p = {}
  Object.keys(BASE).forEach(k => {
    p[k] = {
      x: BASE[k].x + (glitch?.[k]?.dx ?? 0),
      y: BASE[k].y + (glitch?.[k]?.dy ?? 0),
    }
  })
  return p
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/* Animated line with draw-in */
function NetworkLine({ x1, y1, x2, y2, delay, visible, isOuter }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={isOuter ? 'url(#outerLineGrad)' : 'url(#innerLineGrad)'}
      strokeWidth={isOuter ? 1.4 : 1.0}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{
        pathLength: { delay, duration: isOuter ? 0.22 : 0.16, ease: 'easeOut' },
        opacity:    { delay, duration: 0.08 },
      }}
    />
  )
}

/* Data-flow pulse along a line — uses shared #dataPulseGrad defined in defs */
function DataPulse({ x1, y1, x2, y2, delay, repeatDelay }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="url(#dataPulseGrad)"
      strokeWidth={2.2}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 0.22, 0],
        pathOffset: [0, 1],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1.1,
        delay,
        repeat: Infinity,
        repeatDelay,
        ease: 'easeInOut',
      }}
    />
  )
}

/* Single glowing node */
function NetworkNode({ id, cx, cy, r, glow, delay, visible, glitching, phase }) {
  const isCenter = id === 'C'
  const isCorner = ['TL','TR','BL','BR'].includes(id)

  const scaleAnim = glitching
    ? [1, 2.2, 0.3, 1.6, 0.7, 1.1, 1]
    : visible ? 1 : 0

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: scaleAnim,
      }}
      transition={{
        opacity: { delay, duration: 0.12 },
        scale: {
          delay,
          duration: glitching ? 0.35 : 0.26,
          ease: glitching ? 'easeInOut' : [0.22, 1.8, 0.4, 1],
        },
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Ambient outer halo */}
      <circle cx={cx} cy={cy} r={glow * 1.6}
        fill={`rgba(0,212,255,${isCenter ? 0.04 : 0.025})`} />
      {/* Mid glow */}
      <circle cx={cx} cy={cy} r={glow * 0.9}
        fill={`rgba(0,180,255,${isCenter ? 0.1 : 0.06})`} />
      {/* Inner bright glow */}
      <circle cx={cx} cy={cy} r={glow * 0.55}
        fill={`rgba(120,220,255,${isCenter ? 0.18 : 0.09})`} />
      {/* Core */}
      <circle cx={cx} cy={cy} r={r}
        fill={isCenter ? 'url(#centerNodeGrad)' : isCorner ? 'url(#cornerNodeGrad)' : 'url(#midNodeGrad)'}
        filter="url(#nodeBloom)"
      />
      {/* Specular highlight */}
      <circle cx={cx - r*0.28} cy={cy - r*0.28} r={r * 0.32}
        fill="rgba(255,255,255,0.65)" />

      {/* Center pulse rings */}
      {isCenter && (
        <>
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(0,212,255,0.7)" strokeWidth={1.5}
            style={{ animation: 'pulseRing1 2.2s ease-out infinite' }} />
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(0,150,255,0.4)" strokeWidth={1}
            style={{ animation: 'pulseRing2 2.2s ease-out 1.1s infinite' }} />
        </>
      )}
      {/* Corner accent ring */}
      {isCorner && (
        <circle cx={cx} cy={cy} r={r + 2.5}
          fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth={0.8}
          style={{ animation: `cornerPing ${1.8 + Math.random()*0.8}s ease-out infinite` }}
        />
      )}
    </motion.g>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function GridLogoAnimation({ size = 560, opacity = 0.13 }) {
  const [phase, setPhase]     = useState('init')
  const [cycleKey, setCycleKey] = useState(0)
  const [glitchMap, setGlitchMap] = useState(null)
  const [sparks, setSparks]   = useState([])
  const timerRef = useRef(null)

  useEffect(() => {
    const after = (ms, fn) => { timerRef.current = setTimeout(fn, ms) }
    const clear = () => clearTimeout(timerRef.current)

    const run = () => {
      setPhase('init'); setGlitchMap(null); setSparks([])

      after(80, () => {
        setSparks(makeSparks(52))
        setPhase('particle_burst')

        after(T.BUILD_LINES - T.PARTICLE_BURST, () => {
          setPhase('build_lines')

          after(T.BUILD_NODES - T.BUILD_LINES, () => {
            setPhase('build_nodes')

            after(T.FORGE_TEXT - T.BUILD_NODES, () => {
              setPhase('forge_text')

              after(T.TAGLINE - T.FORGE_TEXT, () => {
                setPhase('tagline')

                after(T.HOLD - T.TAGLINE, () => {
                  setPhase('hold')

                  after(T.GLITCH - T.HOLD, () => {
                    setGlitchMap(makeGlitch())
                    setPhase('glitch')

                    after(T.DISSOLVE - T.GLITCH, () => {
                      setPhase('dissolve')

                      after(T.RESET - T.DISSOLVE, () => {
                        setPhase('reset')
                        after(120, () => {
                          setCycleKey(k => k + 1)
                          run()
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    }

    run()
    return clear
  }, [])

  const linesVisible  = ['build_lines','build_nodes','forge_text','tagline','hold','glitch'].includes(phase)
  const nodesVisible  = ['build_nodes','forge_text','tagline','hold','glitch'].includes(phase)
  const textVisible   = ['forge_text','tagline','hold','glitch'].includes(phase)
  const tagVisible    = ['tagline','hold','glitch'].includes(phase)
  const glitching     = phase === 'glitch'
  const dissolving    = phase === 'dissolve'
  const holdPhase     = phase === 'hold' || phase === 'tagline' || phase === 'forge_text'
  const showPulses    = ['tagline','hold'].includes(phase)

  const pos = resolvePos(glitching ? glitchMap : null)

  /* Final svg opacity */
  const svgOpacity = dissolving ? 0 : (phase === 'init' ? 0 : opacity)

  /* RGB split offset during glitch */
  const rgbOffset = glitching ? 3 : 0

  return (
    <>
      <style>{`
        @keyframes pulseRing1 {
          0%   { r: 10.5px; opacity: 0.8; stroke-width: 1.5px; }
          70%  { r: 34px;   opacity: 0;   stroke-width: 0.5px; }
          100% { r: 10.5px; opacity: 0;   stroke-width: 0; }
        }
        @keyframes pulseRing2 {
          0%   { r: 10.5px; opacity: 0.5; stroke-width: 1px; }
          70%  { r: 26px;   opacity: 0;   stroke-width: 0.3px; }
          100% { r: 10.5px; opacity: 0;   stroke-width: 0; }
        }
        @keyframes cornerPing {
          0%   { r: 8px;  opacity: 0.5; }
          60%  { r: 18px; opacity: 0; }
          100% { r: 8px;  opacity: 0; }
        }
        @keyframes scanH {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes breatheGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(0,212,255,0.35)); }
          50%       { filter: drop-shadow(0 0 22px rgba(0,212,255,0.65)); }
        }
        @keyframes gridLineFlow {
          0%   { stroke-dashoffset: 200; opacity: 0.4; }
          50%  { opacity: 1; }
          100% { stroke-dashoffset: 0;   opacity: 0.4; }
        }
        @keyframes forgeChar {
          0%   { opacity: 0; transform: scaleY(0.2) translateY(8px); filter: blur(4px); }
          60%  { opacity: 1; transform: scaleY(1.08) translateY(-2px); filter: blur(0); }
          100% { opacity: 1; transform: scaleY(1) translateY(0); filter: blur(0); }
        }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">

        {/* ── Spark burst particles ───────────────────────────────────────── */}
        <AnimatePresence>
          {phase === 'particle_burst' && sparks.map(s => {
            const rad = (s.angle * Math.PI) / 180
            const tx = Math.cos(rad) * s.dist
            const ty = Math.sin(rad) * s.dist
            return (
              <motion.div
                key={s.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
                transition={{ duration: s.dur, ease: [0.2, 0.8, 0.4, 1] }}
                style={{
                  position: 'absolute',
                  width: s.size * 2.5,
                  height: s.size * 2.5,
                  borderRadius: '50%',
                  background: s.color,
                  boxShadow: `0 0 ${s.size * 4}px ${s.color}`,
                  zIndex: 10,
                }}
              />
            )
          })}
        </AnimatePresence>

        {/* ── Main SVG ────────────────────────────────────────────────────── */}
        <motion.div
          animate={{
            opacity: svgOpacity,
          }}
          transition={{ opacity: { duration: dissolving ? 0.7 : 0.4 } }}
          style={{
            position: 'relative',
            animation: holdPhase ? 'floatY 5s ease-in-out infinite, breatheGlow 3.5s ease-in-out infinite' : undefined,
          }}
        >
          {/* Red channel (glitch) */}
          {glitching && (
            <svg
              width={size} height={size} viewBox="0 0 300 300"
              style={{
                position: 'absolute', top: 0, left: 0,
                opacity: 0.35,
                mixBlendMode: 'screen',
                transform: `translate(${rgbOffset}px, -${rgbOffset}px)`,
                filter: 'drop-shadow(0 0 4px rgba(255,0,80,0.8))',
                pointerEvents: 'none',
              }}
            >
              <defs>
                <linearGradient id="rLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"  stopColor="#ff0050" />
                  <stop offset="100%" stopColor="#ff4080" />
                </linearGradient>
              </defs>
              {LINES.map(([from, to], i) => {
                const p1 = pos[from], p2 = pos[to]
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="url(#rLineGrad)" strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              })}
            </svg>
          )}

          {/* Blue channel (glitch) */}
          {glitching && (
            <svg
              width={size} height={size} viewBox="0 0 300 300"
              style={{
                position: 'absolute', top: 0, left: 0,
                opacity: 0.35,
                mixBlendMode: 'screen',
                transform: `translate(-${rgbOffset}px, ${rgbOffset}px)`,
                filter: 'drop-shadow(0 0 4px rgba(0,80,255,0.8))',
                pointerEvents: 'none',
              }}
            >
              {LINES.map(([from, to], i) => {
                const p1 = pos[from], p2 = pos[to]
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="#0050ff" strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              })}
            </svg>
          )}

          {/* Primary SVG */}
          <motion.svg
            key={cycleKey}
            width={size}
            height={size}
            viewBox="0 0 300 380"
            style={{
              filter: glitching
                ? 'drop-shadow(0 0 28px rgba(0,212,255,0.95))'
                : 'drop-shadow(0 0 12px rgba(0,212,255,0.4))',
              transition: 'filter 0.15s ease',
              display: 'block',
            }}
          >
            <defs>
              {/* Line gradients */}
              <linearGradient id="outerLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#003399" stopOpacity="0.9" />
                <stop offset="40%"  stopColor="#0099ff" stopOpacity="1" />
                <stop offset="60%"  stopColor="#00d4ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#003399" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="innerLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#004488" stopOpacity="0.7" />
                <stop offset="50%"  stopColor="#00aaff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#004488" stopOpacity="0.7" />
              </linearGradient>

              {/* Node gradients */}
              <radialGradient id="cornerNodeGrad" cx="35%" cy="28%" r="72%">
                <stop offset="0%"   stopColor="#cce8ff" />
                <stop offset="30%"  stopColor="#44c8ff" />
                <stop offset="70%"  stopColor="#0088dd" />
                <stop offset="100%" stopColor="#003388" />
              </radialGradient>
              <radialGradient id="midNodeGrad" cx="35%" cy="28%" r="72%">
                <stop offset="0%"   stopColor="#aadcff" />
                <stop offset="40%"  stopColor="#22b4ff" />
                <stop offset="100%" stopColor="#005599" />
              </radialGradient>
              <radialGradient id="centerNodeGrad" cx="30%" cy="22%" r="75%">
                <stop offset="0%"   stopColor="#ffffff" />
                <stop offset="15%"  stopColor="#eef8ff" />
                <stop offset="40%"  stopColor="#88ddff" />
                <stop offset="75%"  stopColor="#00aaff" />
                <stop offset="100%" stopColor="#002277" />
              </radialGradient>

              {/* Text gradient — metallic silver-blue */}
              <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#d0e8ff" />
                <stop offset="20%"  stopColor="#ffffff" />
                <stop offset="45%"  stopColor="#b8d8f8" />
                <stop offset="65%"  stopColor="#8ab8e8" />
                <stop offset="80%"  stopColor="#c8dff8" />
                <stop offset="100%" stopColor="#5588bb" />
              </linearGradient>
              <linearGradient id="textGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#00aaff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0044cc" stopOpacity="0.6" />
              </linearGradient>

              {/* Tag line gradient */}
              <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#334455" stopOpacity="0.8" />
                <stop offset="30%"  stopColor="#8899aa" stopOpacity="0.9" />
                <stop offset="50%"  stopColor="#aabbcc" stopOpacity="1" />
                <stop offset="70%"  stopColor="#8899aa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#334455" stopOpacity="0.8" />
              </linearGradient>

              {/* Bloom filter for nodes */}
              <filter id="nodeBloom" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Strong bloom for center */}
              <filter id="centerBloom" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Text emboss */}
              <filter id="textBloom" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="0.8" in="SourceAlpha" result="blur" />
                <feOffset dx="0" dy="1" result="offset" />
                <feComposite in="SourceGraphic" in2="offset" />
              </filter>

              {/* Soft line glow */}
              <filter id="lineGlow" x="-20%" y="-200%" width="140%" height="500%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* Shared data-pulse gradient used by DataPulse */}
              <linearGradient id="dataPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="transparent" />
                <stop offset="35%"  stopColor="#00d4ff" stopOpacity="0.85" />
                <stop offset="65%"  stopColor="#ffffff" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Scanline sweep gradient */}
              <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="transparent" />
                <stop offset="40%"  stopColor="#00aaff" stopOpacity="0.06" />
                <stop offset="60%"  stopColor="#00d4ff" stopOpacity="0.12" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Scanline mask */}
              <clipPath id="logoClip">
                <rect x="0" y="0" width="300" height="300" />
              </clipPath>
            </defs>

            {/* ── Background subtle grid pattern ─────────────────────────── */}
            <g opacity="0.06">
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`gh${i}`}
                  x1="0" y1={i * 50} x2="300" y2={i * 50}
                  stroke="#00aaff" strokeWidth="0.4"
                />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`gv${i}`}
                  x1={i * 50} y1="0" x2={i * 50} y2="300"
                  stroke="#00aaff" strokeWidth="0.4"
                />
              ))}
            </g>

            {/* ── Lines ─────────────────────────────────────────────────── */}
            <g filter="url(#lineGlow)">
              {LINES.map(([from, to, delay, isOuter], i) => {
                const p1 = pos[from], p2 = pos[to]
                return (
                  <NetworkLine
                    key={`l-${from}-${to}-${cycleKey}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    delay={delay}
                    visible={linesVisible}
                    isOuter={isOuter}
                  />
                )
              })}
            </g>

            {/* ── Data flow pulses (only during hold) ───────────────────── */}
            {showPulses && LINES.map(([from, to], i) => {
              const p1 = pos[from], p2 = pos[to]
              return (
                <DataPulse
                  key={`dp-${i}-${cycleKey}`}
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  delay={i * 0.28 + 0.1}
                  repeatDelay={2.2 + (i % 3) * 0.6}
                />
              )
            })}

            {/* ── Nodes ─────────────────────────────────────────────────── */}
            {NODES.map(({ id, r, glow, seq }) => {
              const p = pos[id]
              return (
                <NetworkNode
                  key={`n-${id}-${cycleKey}`}
                  id={id} cx={p.x} cy={p.y} r={r} glow={glow}
                  delay={seq * 0.16 + 0.1}
                  visible={nodesVisible}
                  glitching={glitching}
                  phase={phase}
                />
              )
            })}

            {/* ── Corner accent brackets ────────────────────────────────── */}
            {nodesVisible && ['TL','TR','BL','BR'].map((key, i) => {
              const p = pos[key]
              const flips = {
                TL: [1, 1], TR: [-1, 1], BL: [1, -1], BR: [-1, -1]
              }
              const [sx, sy] = flips[key]
              const sz = 10
              return (
                <motion.g key={`bracket-${key}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: nodesVisible ? 0.55 : 0 }}
                  transition={{ delay: i * 0.2 + 0.6, duration: 0.4 }}
                >
                  <path
                    d={`M ${p.x + sx*sz} ${p.y} L ${p.x} ${p.y} L ${p.x} ${p.y + sy*sz}`}
                    fill="none"
                    stroke="#00d4ff"
                    strokeWidth="0.9"
                    strokeLinecap="square"
                    vectorEffect="non-scaling-stroke"
                  />
                </motion.g>
              )
            })}

            {/* ═══ GRID TEXT ══════════════════════════════════════════════ */}
            {/* Glow layer (behind) */}
            <motion.text
              x="150" y="322"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Orbitron', 'Rajdhani', 'Arial Black', sans-serif"
              fontWeight="900"
              fontSize="72"
              letterSpacing="8"
              fill="url(#textGlowGrad)"
              filter="url(#nodeBloom)"
              initial={{ opacity: 0 }}
              animate={{ opacity: textVisible ? 0.6 : 0 }}
              transition={{ delay: 0.05, duration: 0.5 }}
            >
              GRID
            </motion.text>

            {/* Main text with forge-in per character */}
            {['G','R','I','D'].map((char, i) => {
              const offsets = [-106, -36, 34, 98]
              return (
                <motion.text
                  key={`char-${char}-${cycleKey}`}
                  x={150 + offsets[i]}
                  y="322"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="'Orbitron', 'Rajdhani', 'Arial Black', sans-serif"
                  fontWeight="900"
                  fontSize="72"
                  letterSpacing="0"
                  fill="url(#textGrad)"
                  initial={{ opacity: 0, scaleY: 0.1, y: 334 }}
                  animate={textVisible
                    ? { opacity: 1, scaleY: 1, y: 322 }
                    : { opacity: 0, scaleY: 0.1, y: 334 }
                  }
                  transition={{
                    opacity:  { delay: i * 0.12, duration: 0.3 },
                    scaleY:   { delay: i * 0.12, duration: 0.45, ease: [0.22, 1.4, 0.36, 1] },
                    y:        { delay: i * 0.12, duration: 0.45, ease: [0.22, 1.4, 0.36, 1] },
                  }}
                  style={{ transformOrigin: `${150 + offsets[i]}px 322px` }}
                >
                  {char}
                </motion.text>
              )
            })}

            {/* Text edge highlight */}
            <motion.text
              x="150" y="322"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Orbitron', 'Rajdhani', 'Arial Black', sans-serif"
              fontWeight="900"
              fontSize="72"
              letterSpacing="8"
              fill="none"
              stroke="rgba(180,220,255,0.2)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: textVisible ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              GRID
            </motion.text>

            {/* ═══ TAGLINE ══════════════════════════════════════════════ */}
            {/* Left dash */}
            <motion.line
              x1="52" y1="354" x2="80" y2="354"
              stroke="#00d4ff" strokeWidth="0.8" strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: tagVisible ? 1 : 0, opacity: tagVisible ? 0.6 : 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            />
            {/* Left dot */}
            <motion.circle
              cx="46" cy="354" r="1.5"
              fill="#00d4ff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: tagVisible ? 0.7 : 0, scale: tagVisible ? 1 : 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              style={{ transformOrigin: '46px 354px' }}
            />

            {/* Tagline text */}
            <motion.text
              x="150" y="354"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Rajdhani', 'Orbitron', 'Arial', sans-serif"
              fontWeight="600"
              fontSize="11.5"
              letterSpacing="4.5"
              fill="url(#tagGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: tagVisible ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              WHERE TECH MINDS CONNECT.
            </motion.text>

            {/* Right dot */}
            <motion.circle
              cx="254" cy="354" r="1.5"
              fill="#00d4ff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: tagVisible ? 0.7 : 0, scale: tagVisible ? 1 : 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              style={{ transformOrigin: '254px 354px' }}
            />
            {/* Right dash */}
            <motion.line
              x1="220" y1="354" x2="248" y2="354"
              stroke="#00d4ff" strokeWidth="0.8" strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: tagVisible ? 1 : 0, opacity: tagVisible ? 0.6 : 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            />

            {/* Scanline sweep (during build) */}
            {(phase === 'build_lines' || phase === 'build_nodes') && (
              <motion.rect
                x="0" y="-300" width="300" height="300"
                fill="url(#scanGrad)"
                initial={{ y: -300 }}
                animate={{ y: 300 }}
                transition={{ duration: 1.8, ease: 'linear' }}
                clipPath="url(#logoClip)"
                opacity="0.04"
              />
            )}
          </motion.svg>
        </motion.div>
      </div>
    </>
  )
}
