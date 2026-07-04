import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING GRID ORBS
   Three half-size GRID neural-network marks that float at the bottom of
   the viewport: bottom-left · bottom-center · bottom-right.

   Pure SVG — zero image files. Every gradient, glow, pulse, halo ring,
   and node is rendered in code at render time.

   Features per orb
   ─────────────────
   · Full neural-network SVG (same geometry as GRIDLogoHero, scaled)
   · Multi-layer ambient glow backdrop (radial gradients, blur)
   · Two counter-rotating dashed halo rings (different speeds per orb)
   · Data-flow pulses (animateMotion circles along every line)
   · Centre pulse rings (SVG animate expanding)
   · All 9 nodes: 4 corners + 4 mid-edges + 1 bright centre
   · Multi-axis CSS float (Y + X drift + micro-rotation + scale breath)
   · Smooth rAF mouse-parallax (unique depth per orb, spring interpolation)
   · Framer Motion staggered entrance (scale up + slide from below)
   · Breathing glow layers that pulse with different phases
   · Respects prefers-reduced-motion
═══════════════════════════════════════════════════════════════════════════ */

const SIZE = 220            // rendered pixel size of each orb's SVG

/* ── Logo geometry (matches GRIDLogoHero) ────────────────────────────────── */
const VB   = 500
const C    = 250
const SPAN = 155

const TL = [C - SPAN, C - SPAN]
const TR = [C + SPAN, C - SPAN]
const BR = [C + SPAN, C + SPAN]
const BL = [C - SPAN, C + SPAN]
const TM = [C,        C - SPAN]
const RM = [C + SPAN, C       ]
const BM = [C,        C + SPAN]
const LM = [C - SPAN, C       ]
const CC = [C,        C       ]

const CORNERS      = [TL, TR, BR, BL]
const MIDS         = [TM, RM, BM, LM]
const OUTER_LINES  = [[TL,TR],[TR,BR],[BR,BL],[BL,TL]]
const DIAG_LINES   = [[TL,BR],[TR,BL]]
const SPOKE_LINES  = [[TM,CC],[RM,CC],[BM,CC],[LM,CC]]
const ALL_LINES    = [...OUTER_LINES, ...DIAG_LINES, ...SPOKE_LINES]

const lp = (a, b) => `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`

/* ── Orb config ───────────────────────────────────────────────────────────── */
const ORBS = [
  {
    id: 'bl',
    pos:        { top: `calc(50% - ${SIZE / 2}px)`, left: '2.5%' },
    floatDur:   6.8,
    floatDx:    7,
    floatPhase: 0,
    depth:      { x:  0.024, y: 0.018 },
    enterDelay: 0.5,
    halo1Dur:   30,
    halo2Dur:   42,
    breathDur:  5.8,
    pulseOffset: 0,
  },
  {
    id: 'bc',
    pos:        { top: `calc(50% - ${SIZE / 2}px)`, left: `calc(50% - ${SIZE / 2}px)` },
    floatDur:   7.6,
    floatDx:    4,
    floatPhase: -2.5,
    depth:      { x:  0.010, y: 0.012 },
    enterDelay: 0.8,
    halo1Dur:   26,
    halo2Dur:   36,
    breathDur:  6.4,
    pulseOffset: 0.7,
  },
  {
    id: 'br',
    pos:        { top: `calc(50% - ${SIZE / 2}px)`, right: '2.5%' },
    floatDur:   6.2,
    floatDx:   -7,
    floatPhase: -1.4,
    depth:      { x: -0.024, y: 0.022 },
    enterDelay: 1.1,
    halo1Dur:   34,
    halo2Dur:   48,
    breathDur:  5.2,
    pulseOffset: 1.4,
  },
]

/* ── CSS ─────────────────────────────────────────────────────────────────── */
function buildCSS() {
  const floatKfs = ORBS.map(o => `
    @keyframes goFloat_${o.id} {
      0%,100% { transform: translate(0px,    0px)             rotate(0deg)    scale(1);     }
      20%     { transform: translate(${o.floatDx * 0.4}px, -${SIZE * 0.06}px) rotate( 0.4deg) scale(1.012); }
      50%     { transform: translate(${o.floatDx}px,       -${SIZE * 0.13}px) rotate( 0.9deg) scale(1.022); }
      75%     { transform: translate(${o.floatDx * 0.6}px, -${SIZE * 0.09}px) rotate( 0.5deg) scale(1.014); }
    }
    @keyframes goBreath_${o.id}_a {
      0%,100% { opacity:.65; transform:scale(1);    }
      50%     { opacity:1;   transform:scale(1.18); }
    }
    @keyframes goBreath_${o.id}_b {
      0%,100% { opacity:.45; transform:scale(1);    }
      50%     { opacity:.85; transform:scale(1.12); }
    }
    @keyframes goBreath_${o.id}_c {
      0%,100% { opacity:.30; transform:scale(1);    }
      50%     { opacity:.60; transform:scale(1.08); }
    }
  `).join('')

  return `
    @keyframes goHaloSpin    { from{transform:rotate(0deg)}   to{transform:rotate( 360deg)} }
    @keyframes goHaloSpinRev { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
    ${floatKfs}
    @media (prefers-reduced-motion: reduce) {
      .go-float-wrap, .go-glow-a, .go-glow-b, .go-glow-c { animation: none !important; }
    }
  `
}

/* ── OrbSVG — the full neural-network mark ───────────────────────────────── */
function OrbSVG({ orb }) {
  const p = `go_${orb.id}`   // unique gradient / filter id prefix

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        display: 'block',
        position: 'relative',
        zIndex: 1,
        filter: [
          `drop-shadow(0 0 ${SIZE * 0.14}px rgba(0,140,255,0.55))`,
          `drop-shadow(0 0 ${SIZE * 0.28}px rgba(0,80,200,0.28))`,
          `drop-shadow(0 0 ${SIZE * 0.08}px rgba(0,200,255,0.40))`,
        ].join(' '),
      }}
    >
      <defs>
        {/* ── Line gradients ─────────────────────────────────────────── */}
        <linearGradient id={`${p}_olg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#002f99" stopOpacity="0.85" />
          <stop offset="35%"  stopColor="#0088ff" />
          <stop offset="55%"  stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#002f99" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${p}_dlg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#003388" stopOpacity="0.72" />
          <stop offset="50%"  stopColor="#0099ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#003388" stopOpacity="0.72" />
        </linearGradient>

        {/* ── Node fills ─────────────────────────────────────────────── */}
        <radialGradient id={`${p}_cng`} cx="30%" cy="24%" r="76%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="16%"  stopColor="#e8f8ff" />
          <stop offset="44%"  stopColor="#55ccff" />
          <stop offset="82%"  stopColor="#0077cc" />
          <stop offset="100%" stopColor="#002a88" />
        </radialGradient>
        <radialGradient id={`${p}_ong`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#c4e8ff" />
          <stop offset="34%"  stopColor="#22bbff" />
          <stop offset="74%"  stopColor="#0066cc" />
          <stop offset="100%" stopColor="#002277" />
        </radialGradient>
        <radialGradient id={`${p}_mng`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="#88d8ff" />
          <stop offset="44%"  stopColor="#11aaff" />
          <stop offset="100%" stopColor="#004499" />
        </radialGradient>

        {/* ── Halo gradient ──────────────────────────────────────────── */}
        <linearGradient id={`${p}_hg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(0,212,255,0.00)" />
          <stop offset="28%"  stopColor="rgba(0,212,255,0.30)" />
          <stop offset="58%"  stopColor="rgba(0,140,255,0.38)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0.00)" />
        </linearGradient>

        {/* ── Glow filters ───────────────────────────────────────────── */}
        <filter id={`${p}_lgf`} x="-8%" y="-160%" width="116%" height="420%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}_ngf`} x="-65%" y="-65%" width="230%" height="230%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}_cgf`} x="-110%" y="-110%" width="320%" height="320%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Rotating halo rings ──────────────────────────────────────── */}
      <g style={{
        transformOrigin: `${C}px ${C}px`,
        animation: `goHaloSpin ${orb.halo1Dur}s linear infinite`,
      }}>
        <circle cx={C} cy={C} r={SPAN + 82}
          fill="none"
          stroke={`url(#${p}_hg)`}
          strokeWidth="1" strokeDasharray="24 17" opacity="0.65" />
      </g>
      <g style={{
        transformOrigin: `${C}px ${C}px`,
        animation: `goHaloSpinRev ${orb.halo2Dur}s linear infinite`,
      }}>
        <circle cx={C} cy={C} r={SPAN + 60}
          fill="none"
          stroke="rgba(0,160,255,0.20)"
          strokeWidth="0.7" strokeDasharray="9 30" opacity="0.55" />
      </g>
      {/* Third inner halo — very subtle */}
      <g style={{
        transformOrigin: `${C}px ${C}px`,
        animation: `goHaloSpin ${Math.round(orb.halo1Dur * 1.6)}s linear infinite`,
      }}>
        <circle cx={C} cy={C} r={SPAN + 38}
          fill="none"
          stroke="rgba(0,212,255,0.10)"
          strokeWidth="0.5" strokeDasharray="5 40" opacity="0.5" />
      </g>

      {/* ── Network lines ─────────────────────────────────────────────── */}
      <g filter={`url(#${p}_lgf)`}>
        {OUTER_LINES.map(([a, b], i) => (
          <line key={`ol${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke={`url(#${p}_olg)`} strokeWidth="2.3" strokeLinecap="round" />
        ))}
        {DIAG_LINES.map(([a, b], i) => (
          <line key={`dl${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke={`url(#${p}_dlg)`} strokeWidth="1.65" strokeLinecap="round" opacity="0.88" />
        ))}
        {SPOKE_LINES.map(([a, b], i) => (
          <line key={`sl${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke={`url(#${p}_dlg)`} strokeWidth="1.45" strokeLinecap="round" opacity="0.82" />
        ))}
      </g>

      {/* ── Data-flow pulses (animateMotion circles racing along lines) ── */}
      {ALL_LINES.map(([a, b], i) => {
        const dur   = 1.5 + (i % 5) * 0.32
        const begin = ((i * 0.31 + orb.pulseOffset) % dur).toFixed(2)
        const color = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#00d4ff' : '#66bbff'
        const r     = i < 4 ? 6.5 : i < 6 ? 5.5 : 4.5
        return (
          <circle key={`dp${i}`} r={r} fill={color} opacity="0"
            style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 4px #fff)` }}>
            <animateMotion
              dur={`${dur}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
              path={lp(a, b)}
            />
            <animate
              attributeName="opacity"
              values="0;0;1;1;0"
              keyTimes="0;0.04;0.12;0.88;1"
              dur={`${dur}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          </circle>
        )
      })}

      {/* ── Corner nodes ─────────────────────────────────────────────── */}
      {CORNERS.map(([cx, cy], i) => (
        <g key={`cn${i}`}>
          <circle cx={cx} cy={cy} r={42} fill="rgba(0,170,255,0.04)" />
          <circle cx={cx} cy={cy} r={27} fill="rgba(0,150,255,0.09)" />
          <circle cx={cx} cy={cy} r={17} fill={`url(#${p}_ong)`} filter={`url(#${p}_ngf)`} />
          <circle cx={cx - 5.5} cy={cy - 5.5} r={5.5} fill="rgba(255,255,255,0.84)" />
          <circle cx={cx} cy={cy} r={25} fill="none"
            stroke="rgba(0,212,255,0.28)" strokeWidth="1.4" />
        </g>
      ))}

      {/* ── Mid-edge nodes ───────────────────────────────────────────── */}
      {MIDS.map(([cx, cy], i) => (
        <g key={`mn${i}`}>
          <circle cx={cx} cy={cy} r={28} fill="rgba(0,150,255,0.06)" />
          <circle cx={cx} cy={cy} r={13} fill={`url(#${p}_mng)`} filter={`url(#${p}_ngf)`} />
          <circle cx={cx - 4} cy={cy - 4} r={4} fill="rgba(255,255,255,0.66)" />
        </g>
      ))}

      {/* ── Centre node (brightest, with pulse rings) ─────────────────── */}
      <g>
        <circle cx={C} cy={C} r={80}  fill="rgba(0,160,255,0.035)" />
        <circle cx={C} cy={C} r={54}  fill="rgba(0,150,255,0.075)" />
        <circle cx={C} cy={C} r={38}  fill="rgba(100,210,255,0.13)" />
        <circle cx={C} cy={C} r={26}  fill={`url(#${p}_cng)`} filter={`url(#${p}_cgf)`} />
        <circle cx={C - 10} cy={C - 10} r={11} fill="rgba(255,255,255,0.84)" />
        {/* Pulse ring 1 */}
        <circle cx={C} cy={C} r={26} fill="none"
          stroke="rgba(0,212,255,0.75)" strokeWidth="2.2">
          <animate attributeName="r"       values="26;90;26"  dur="2.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.85;0;0"  dur="2.9s" repeatCount="indefinite" />
        </circle>
        {/* Pulse ring 2 */}
        <circle cx={C} cy={C} r={26} fill="none"
          stroke="rgba(0,160,255,0.50)" strokeWidth="1.6">
          <animate attributeName="r"       values="26;65;26"  dur="2.9s" begin="1.45s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.65;0;0"  dur="2.9s" begin="1.45s" repeatCount="indefinite" />
        </circle>
        {/* Pulse ring 3 — tight fast */}
        <circle cx={C} cy={C} r={26} fill="none"
          stroke="rgba(120,220,255,0.35)" strokeWidth="0.9">
          <animate attributeName="r"       values="26;46;26"  dur="1.6s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.50;0;0"  dur="1.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function FloatingGridOrbs() {
  const parallaxEls = useRef([])

  /* Smooth rAF mouse parallax */
  useEffect(() => {
    let rafId
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0

    const onMove = (e) => {
      targetX = e.clientX / window.innerWidth  - 0.5
      targetY = e.clientY / window.innerHeight - 0.5
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.055
      currentY += (targetY - currentY) * 0.055

      ORBS.forEach((orb, i) => {
        const el = parallaxEls.current[i]
        if (!el) return
        const dx = currentX * orb.depth.x * window.innerWidth  * 0.45
        const dy = currentY * orb.depth.y * window.innerHeight * 0.28
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`
      })

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <style>{buildCSS()}</style>

      {ORBS.map((orb, i) => (
        <motion.div
          key={orb.id}
          initial={{ opacity: 0, y: 70, scale: 0.72 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{
            duration: 1.8,
            delay:    orb.enterDelay,
            ease:     [0.22, 1, 0.36, 1],
          }}
          style={{ position: 'absolute', ...orb.pos }}
        >
          {/* Parallax wrapper */}
          <div
            ref={el => { parallaxEls.current[i] = el }}
            style={{ willChange: 'transform' }}
          >
            {/* Float animation wrapper */}
            <div
              className="go-float-wrap"
              style={{
                animation: `goFloat_${orb.id} ${orb.floatDur}s ease-in-out ${orb.floatPhase}s infinite`,
              }}
            >
              {/* ── Ambient glow backdrop ─────────────────────────────── */}
              {/* Outer soft bloom */}
              <div
                className="go-glow-a"
                style={{
                  position: 'absolute',
                  inset:    `${-SIZE * 0.55}px`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 50% 50%, rgba(0,180,255,0.13) 0%, rgba(0,100,255,0.07) 38%, transparent 68%)',
                  filter:   'blur(14px)',
                  animation: `goBreath_${orb.id}_a ${orb.breathDur}s ease-in-out infinite`,
                }}
              />
              {/* Mid glow */}
              <div
                className="go-glow-b"
                style={{
                  position: 'absolute',
                  inset:    `${-SIZE * 0.30}px`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.10) 0%, transparent 62%)',
                  filter:   'blur(8px)',
                  animation: `goBreath_${orb.id}_b ${orb.breathDur * 0.85}s ease-in-out 0.6s infinite`,
                }}
              />
              {/* Inner tight glow */}
              <div
                className="go-glow-c"
                style={{
                  position: 'absolute',
                  inset:    `${-SIZE * 0.12}px`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 50% 50%, rgba(0,220,255,0.08) 0%, transparent 55%)',
                  filter:   'blur(4px)',
                  animation: `goBreath_${orb.id}_c ${orb.breathDur * 0.7}s ease-in-out 1.2s infinite`,
                }}
              />

              {/* ── The SVG logo ──────────────────────────────────────── */}
              <OrbSVG orb={orb} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
