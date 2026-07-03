import React, { useEffect, useRef } from 'react'

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  GRID HERO BACKGROUND — Full-viewport animated GRID logo pattern
 *  Pure code, zero images. Exact same geometry as the brand logo:
 *    · 4 corner nodes  (glowing cyan)
 *    · 4 mid-edge nodes (smaller cyan)
 *    · 1 centre node   (white-core, strongest glow, pulse rings)
 *    · Lines: outer square + X diagonals + 4 spokes to centre
 *
 *  Animations (all CSS/SVG, no heavy libs):
 *    · Floating / breathing idle
 *    · Data-flow pulses racing along every line
 *    · Centre node expanding pulse rings
 *    · Corner node ping rings
 *    · Rotating outer dashed halo rings (two, opposite directions)
 *    · Scanning glow sweep
 *    · Ambient radial glow behind each node
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ── Geometry (1000 × 1000 viewBox) ─────────────────────────────────────── */
const VB   = 1000
const C    = 500
const SPAN = 340   // half-span — nodes sit at C ± SPAN

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

/* ── Pulse animation params per line ────────────────────────────────────── */
const PULSE_CONFIG = ALL_LINES.map((_, i) => ({
  dur:   `${1.6 + (i % 5) * 0.22}s`,
  delay: `${i * 0.38}s`,
  color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#00d4ff' : '#66ccff',
}))

/* ── Corner bracket accents ─────────────────────────────────────────────── */
const BRACKETS = [
  { pt: N.TL, sx:  1, sy:  1 },
  { pt: N.TR, sx: -1, sy:  1 },
  { pt: N.BR, sx: -1, sy: -1 },
  { pt: N.BL, sx:  1, sy: -1 },
]

const KEYFRAMES = `
  @keyframes gbFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-18px) rotate(0.35deg); }
    66%       { transform: translateY(-9px) rotate(-0.25deg); }
  }
  @keyframes gbHaloSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes gbHaloSpinRev {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes gbPulseRing1 {
    0%   { r: 52px;  opacity: 0.85; stroke-width: 3px; }
    70%  { r: 160px; opacity: 0;   stroke-width: 1px; }
    100% { r: 52px;  opacity: 0;   stroke-width: 0; }
  }
  @keyframes gbPulseRing2 {
    0%   { r: 52px;  opacity: 0.5; stroke-width: 2px; }
    70%  { r: 110px; opacity: 0;   stroke-width: 0.6px; }
    100% { r: 52px;  opacity: 0;   stroke-width: 0; }
  }
  @keyframes gbPulseRing3 {
    0%   { r: 52px;  opacity: 0.3; stroke-width: 1.5px; }
    70%  { r: 200px; opacity: 0;   stroke-width: 0.4px; }
    100% { r: 52px;  opacity: 0;   stroke-width: 0; }
  }
  @keyframes gbCornerPing {
    0%   { r: 28px; opacity: 0.55; }
    55%  { r: 72px; opacity: 0;    }
    100% { r: 28px; opacity: 0;    }
  }
  @keyframes gbMidPing {
    0%   { r: 20px; opacity: 0.45; }
    55%  { r: 52px; opacity: 0;    }
    100% { r: 20px; opacity: 0;    }
  }
  @keyframes gbBreath {
    0%, 100% { opacity: 0.82; }
    50%       { opacity: 1;    }
  }
  @keyframes gbScanX {
    0%   { transform: translateX(-110%); }
    100% { transform: translateX(110%);  }
  }
  /* Data pulse: a bright dot racing from a to b along each line */
  @keyframes gbDataPulse {
    0%   { stroke-dashoffset: 1; opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .gb-float  { animation: none !important; }
    .gb-halo   { animation: none !important; }
    .gb-breath { animation: none !important; }
  }
`

export default function GRIDHeroBackground({ opacity = 0.16 }) {
  const svgRef = useRef(null)

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/*
        Wrapper: absolute, fills the entire hero section.
        pointer-events:none so clicks pass through to content.
      */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          overflow:      'hidden',
          pointerEvents: 'none',
          zIndex:        1,
          /* Push the pattern to the right half so it doesn't
             compete with the headline text on the left */
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
        }}
      >
        {/* Scanning horizontal glow stripe */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div
            className="gb-scanx"
            style={{
              position: 'absolute',
              top: '42%',
              left: 0,
              width: '60%',
              height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.18),transparent)',
              animation: 'gbScanX 8s linear infinite',
              animationDelay: '2s',
            }}
          />
        </div>

        {/* Float wrapper — CSS animation, no Framer */}
        <div
          className="gb-float"
          style={{
            width:     '100%',
            height:    '100%',
            animation: 'gbFloat 9s ease-in-out infinite',
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${VB} ${VB}`}
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              opacity,
              display: 'block',
              filter: 'drop-shadow(0 0 80px rgba(0,140,255,0.4)) drop-shadow(0 0 200px rgba(0,60,180,0.25))',
              animation: 'gbBreath 4.5s ease-in-out infinite',
            }}
          >
            <defs>
              {/* ── Line gradients ─────────────────────────────────── */}
              <linearGradient id="gb_ol" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#002f99" stopOpacity="0.88" />
                <stop offset="35%"  stopColor="#0088ff" />
                <stop offset="55%"  stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#002f99" stopOpacity="0.88" />
              </linearGradient>
              <linearGradient id="gb_dl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#002266" stopOpacity="0.75" />
                <stop offset="50%"  stopColor="#0099ff" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#002266" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="gb_sl" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#002266" stopOpacity="0.65" />
                <stop offset="50%"  stopColor="#0088ee" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#002266" stopOpacity="0.65" />
              </linearGradient>

              {/* ── Node fills ─────────────────────────────────────── */}
              <radialGradient id="gb_cng" cx="30%" cy="24%" r="76%">
                <stop offset="0%"   stopColor="#ffffff" />
                <stop offset="16%"  stopColor="#eaf8ff" />
                <stop offset="44%"  stopColor="#55ccff" />
                <stop offset="82%"  stopColor="#0077cc" />
                <stop offset="100%" stopColor="#002a88" />
              </radialGradient>
              <radialGradient id="gb_ong" cx="32%" cy="26%" r="72%">
                <stop offset="0%"   stopColor="#c4e8ff" />
                <stop offset="34%"  stopColor="#22bbff" />
                <stop offset="74%"  stopColor="#0066cc" />
                <stop offset="100%" stopColor="#002277" />
              </radialGradient>
              <radialGradient id="gb_mng" cx="32%" cy="26%" r="72%">
                <stop offset="0%"   stopColor="#88d8ff" />
                <stop offset="44%"  stopColor="#11aaff" />
                <stop offset="100%" stopColor="#004499" />
              </radialGradient>

              {/* ── Halo gradient ──────────────────────────────────── */}
              <linearGradient id="gb_halog" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="rgba(0,212,255,0.0)"  />
                <stop offset="30%"  stopColor="rgba(0,212,255,0.26)" />
                <stop offset="60%"  stopColor="rgba(0,140,255,0.32)" />
                <stop offset="100%" stopColor="rgba(0,212,255,0.0)"  />
              </linearGradient>
              <radialGradient id="gb_ambhalo" cx="50%" cy="50%" r="50%">
                <stop offset="65%"  stopColor="transparent" />
                <stop offset="85%"  stopColor="rgba(0,140,255,0.05)" />
                <stop offset="100%" stopColor="rgba(0,60,180,0.02)" />
              </radialGradient>

              {/* ── Glow filters ───────────────────────────────────── */}
              <filter id="gb_lgf" x="-6%" y="-200%" width="112%" height="500%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="gb_ngf" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="gb_cgf" x="-140%" y="-140%" width="380%" height="380%">
                <feGaussianBlur stdDeviation="18" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* ── Subtle bg dot grid ─────────────────────────────── */}
              <pattern id="gb_grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="0"  cy="0"  r="0.8" fill="rgba(0,180,255,0.18)" />
                <circle cx="80" cy="0"  r="0.8" fill="rgba(0,180,255,0.18)" />
                <circle cx="0"  cy="80" r="0.8" fill="rgba(0,180,255,0.18)" />
                <circle cx="80" cy="80" r="0.8" fill="rgba(0,180,255,0.18)" />
                <circle cx="40" cy="40" r="0.5" fill="rgba(0,180,255,0.10)" />
              </pattern>
            </defs>

            {/* ── Dot-grid background ──────────────────────────────────── */}
            <rect x="0" y="0" width={VB} height={VB} fill="url(#gb_grid)" opacity="0.55" />

            {/* ── Ambient fill halo ────────────────────────────────────── */}
            <circle cx={C} cy={C} r={SPAN + 100} fill="url(#gb_ambhalo)" />

            {/* ── Rotating outer halo rings ────────────────────────────── */}
            <g style={{ transformOrigin: `${C}px ${C}px`, animation: 'gbHaloSpin 36s linear infinite' }}>
              <circle cx={C} cy={C} r={SPAN + 68}
                fill="none" stroke="url(#gb_halog)"
                strokeWidth="1.6" strokeDasharray="32 22" opacity="0.52" />
            </g>
            <g style={{ transformOrigin: `${C}px ${C}px`, animation: 'gbHaloSpinRev 52s linear infinite' }}>
              <circle cx={C} cy={C} r={SPAN + 48}
                fill="none" stroke="rgba(0,160,255,0.18)"
                strokeWidth="1" strokeDasharray="14 36" opacity="0.46" />
            </g>
            <g style={{ transformOrigin: `${C}px ${C}px`, animation: 'gbHaloSpin 68s linear infinite' }}>
              <circle cx={C} cy={C} r={SPAN + 90}
                fill="none" stroke="rgba(0,100,220,0.10)"
                strokeWidth="0.8" strokeDasharray="6 48" opacity="0.55" />
            </g>

            {/* ── Lines ────────────────────────────────────────────────── */}
            <g filter="url(#gb_lgf)">
              {/* Outer square */}
              {OUTER_LINES.map(([a, b], i) => (
                <line key={`ol${i}`}
                  x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                  stroke="url(#gb_ol)" strokeWidth="3.2" strokeLinecap="round" />
              ))}
              {/* X diagonals */}
              {DIAG_LINES.map(([a, b], i) => (
                <line key={`dl${i}`}
                  x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                  stroke="url(#gb_dl)" strokeWidth="2.4" strokeLinecap="round" opacity="0.88" />
              ))}
              {/* Spokes */}
              {SPOKE_LINES.map(([a, b], i) => (
                <line key={`sl${i}`}
                  x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                  stroke="url(#gb_sl)" strokeWidth="2.1" strokeLinecap="round" opacity="0.82" />
              ))}
            </g>

            {/* ── Data-flow pulses — one per line, staggered ───────────── */}
            {ALL_LINES.map(([a, b], i) => {
              const dx = b[0] - a[0]
              const dy = b[1] - a[1]
              const len = Math.sqrt(dx * dx + dy * dy)
              const cfg = PULSE_CONFIG[i]
              // dasharray = [pulse_length, rest_of_line]
              // We animate dashoffset from len→0 to make it race forward
              const pulseLen = len * 0.15
              return (
                <line key={`dp${i}`}
                  x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                  stroke={cfg.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${pulseLen} ${len}`}
                  style={{
                    strokeDashoffset: len,
                    animation: `gbDataPulse ${cfg.dur} ${cfg.delay} ease-in-out infinite`,
                  }}
                  opacity="0"
                />
              )
            })}

            {/* ── Corner bracket accents ───────────────────────────────── */}
            {BRACKETS.map(({ pt, sx, sy }, i) => {
              const [cx, cy] = pt
              const sz = 56
              return (
                <path key={`br${i}`}
                  d={`M ${cx + sx*sz} ${cy} L ${cx} ${cy} L ${cx} ${cy + sy*sz}`}
                  stroke="rgba(0,212,255,0.40)"
                  strokeWidth="3"
                  strokeLinecap="square"
                  fill="none"
                />
              )
            })}

            {/* ── Corner nodes ─────────────────────────────────────────── */}
            {CORNERS.map(([cx, cy], i) => (
              <g key={`cn${i}`} filter="url(#gb_ngf)">
                {/* Ambient glow halos */}
                <circle cx={cx} cy={cy} r="88"  fill="rgba(0,170,255,0.04)" />
                <circle cx={cx} cy={cy} r="56"  fill="rgba(0,160,255,0.09)" />
                <circle cx={cx} cy={cy} r="36"  fill="rgba(0,200,255,0.14)" />
                {/* Core sphere */}
                <circle cx={cx} cy={cy} r="22"  fill="url(#gb_ong)" />
                {/* Specular */}
                <circle cx={cx-7} cy={cy-7} r="7" fill="rgba(255,255,255,0.75)" />
                {/* Accent ring */}
                <circle cx={cx} cy={cy} r="33"
                  fill="none" stroke="rgba(0,212,255,0.30)" strokeWidth="1.8" />
                {/* Ping ring animation */}
                <circle cx={cx} cy={cy} r="22"
                  fill="none" stroke="rgba(0,212,255,0.60)" strokeWidth="2"
                  style={{ animation: `gbCornerPing ${2.2 + i * 0.3}s ease-out ${i * 0.55}s infinite` }} />
              </g>
            ))}

            {/* ── Mid-edge nodes ───────────────────────────────────────── */}
            {MIDS.map(([cx, cy], i) => (
              <g key={`mn${i}`} filter="url(#gb_ngf)">
                <circle cx={cx} cy={cy} r="60"  fill="rgba(0,150,255,0.05)" />
                <circle cx={cx} cy={cy} r="38"  fill="rgba(0,160,255,0.09)" />
                <circle cx={cx} cy={cy} r="16"  fill="url(#gb_mng)" />
                <circle cx={cx-5} cy={cy-5} r="5" fill="rgba(255,255,255,0.68)" />
                <circle cx={cx} cy={cy} r="16"
                  fill="none" stroke="rgba(0,212,255,0.48)" strokeWidth="1.5"
                  style={{ animation: `gbMidPing ${2.0 + i * 0.25}s ease-out ${0.8 + i * 0.42}s infinite` }} />
              </g>
            ))}

            {/* ── Centre node — brightest, biggest glow ───────────────── */}
            <g filter="url(#gb_cgf)">
              <circle cx={C} cy={C} r="180" fill="rgba(0,100,255,0.030)" />
              <circle cx={C} cy={C} r="120" fill="rgba(0,130,255,0.055)" />
              <circle cx={C} cy={C} r="78"  fill="rgba(0,170,255,0.09)" />
              <circle cx={C} cy={C} r="52"  fill="rgba(80,200,255,0.16)" />
              <circle cx={C} cy={C} r="35"  fill="url(#gb_cng)" />
              {/* Specular */}
              <circle cx={C-12} cy={C-12} r="12" fill="rgba(255,255,255,0.80)" />
              {/* Pulse rings */}
              <circle cx={C} cy={C} r="52"
                fill="none" stroke="rgba(0,212,255,0.75)" strokeWidth="3"
                style={{ animation: 'gbPulseRing1 2.8s ease-out infinite' }} />
              <circle cx={C} cy={C} r="52"
                fill="none" stroke="rgba(0,160,255,0.45)" strokeWidth="2"
                style={{ animation: 'gbPulseRing2 2.8s ease-out 1.4s infinite' }} />
              <circle cx={C} cy={C} r="52"
                fill="none" stroke="rgba(0,120,255,0.28)" strokeWidth="1.5"
                style={{ animation: 'gbPulseRing3 2.8s ease-out 0.7s infinite' }} />
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}
