import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticButton({
  children, onClick, className = '', style = {},
  strength = 0.42, variant = 'primary',
}) {
  const ref     = useRef(null)
  const rafRef  = useRef(null)
  const [over, setOver] = useState(false)
  const x  = useMotionValue(0)
  const y  = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 190, damping: 16 })
  const sy = useSpring(y, { stiffness: 190, damping: 16 })

  // getBoundingClientRect is expensive — throttle to one call per animation frame
  const onMove = useCallback((e) => {
    if (rafRef.current) return
    const clientX = e.clientX
    const clientY = e.clientY
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        x.set((clientX - (rect.left + rect.width  / 2)) * strength)
        y.set((clientY - (rect.top  + rect.height / 2)) * strength)
      }
      rafRef.current = null
    })
  }, [strength, x, y])

  const onLeave = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    x.set(0); y.set(0); setOver(false)
  }, [x, y])

  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: over
        ? variant === 'primary'
          ? '0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(0,212,255,0.15)'
          : '0 0 30px rgba(124,58,237,0.3)'
        : 'none'
      }}
      transition={{ boxShadow: { duration: 0.2 } }}
      className={`${base} ${className}`}
    >
      {children}
    </motion.button>
  )
}
