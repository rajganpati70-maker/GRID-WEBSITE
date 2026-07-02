import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function HolographicCard({
  children, className = '', style = {},
  intensity = 1, foil = true, glow = true,
}) {
  const ref = useRef(null)
  const rafRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [over, setOver] = useState(false)

  const onMove = useCallback((e) => {
    if (rafRef.current) return          // throttle to one update per frame
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const card = ref.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const max = 13 * intensity
      setTilt({
        x: -((e.clientY - cy) / (rect.height / 2)) * max,
        y:  ((e.clientX - cx) / (rect.width  / 2)) * max,
      })
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      })
    })
  }, [intensity])

  const onLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setTilt({ x: 0, y: 0 })
    setOver(false)
  }

  const hue    = mouse.x * 340
  const glintX = mouse.x * 100
  const glintY = mouse.y * 100

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={onLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: over ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      style={{ perspective: 1100, transformStyle: 'preserve-3d', position: 'relative', ...style }}
      className={className}
    >
      {children}

      {/* Holographic rainbow foil */}
      {foil && over && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          pointerEvents: 'none', zIndex: 10,
          background: `
            radial-gradient(ellipse at ${glintX}% ${glintY}%, rgba(255,255,255,0.13) 0%, transparent 55%),
            linear-gradient(${hue}deg,
              rgba(255,0,128,0.05) 0%,
              rgba(0,212,255,0.09) 22%,
              rgba(124,58,237,0.07) 44%,
              rgba(0,255,128,0.05) 66%,
              rgba(255,200,0,0.05) 88%,
              rgba(255,0,128,0.04) 100%
            )
          `,
          mixBlendMode: 'screen',
          transition: 'opacity 0.2s',
        }} />
      )}

      {/* Scan lines */}
      {over && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          pointerEvents: 'none', zIndex: 11,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.012) 2px, rgba(0,212,255,0.012) 4px)',
          mixBlendMode: 'screen',
        }} />
      )}

      {/* Edge glow */}
      {glow && over && (
        <div style={{
          position: 'absolute', inset: -1, borderRadius: 'inherit',
          pointerEvents: 'none', zIndex: 9,
          boxShadow: `
            0 0 0 1px rgba(0,212,255,0.3),
            0 0 24px rgba(0,212,255,0.12),
            0 0 60px rgba(124,58,237,0.08)
          `,
        }} />
      )}
    </motion.div>
  )
}
