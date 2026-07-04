import React from 'react'
import GRIDLogoIcon from './GRIDLogoIcon'

/*
 * FLOATING LOGOS — ambient GRID marks that drift gently around the
 * corners/edges of the viewport for the whole page (fixed position,
 * so they stay put and float as the user scrolls, instead of one giant
 * ghost logo sitting behind the hero).
 */
const MARKS = [
  { top: '22%', left: '3%',  size: 46, opacity: 0.34, dur: '13s', delay: '0s'   },
  { top: '12%', right: '5%', size: 38, opacity: 0.30, dur: '16s', delay: '2s'   },
  { bottom: '18%', left: '6%', size: 34, opacity: 0.28, dur: '15s', delay: '1s' },
  { bottom: '10%', right: '3%', size: 54, opacity: 0.36, dur: '18s', delay: '3s' },
  { top: '55%', right: '1.5%', size: 30, opacity: 0.24, dur: '14s', delay: '0.6s' },
]

export default function FloatingLogos() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes gridMarkFloat {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50%       { transform: translate(6px, -16px) rotate(4deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .grid-floating-mark { animation: none !important; }
        }
      `}</style>
      {MARKS.map((m, i) => (
        <div
          key={i}
          className="grid-floating-mark"
          style={{
            position: 'absolute',
            top: m.top,
            left: m.left,
            right: m.right,
            bottom: m.bottom,
            opacity: m.opacity,
            animation: `gridMarkFloat ${m.dur} ease-in-out ${m.delay} infinite`,
            filter: 'drop-shadow(0 0 18px rgba(0,200,255,0.55))',
          }}
        >
          <GRIDLogoIcon size={m.size} />
        </div>
      ))}
    </div>
  )
}
