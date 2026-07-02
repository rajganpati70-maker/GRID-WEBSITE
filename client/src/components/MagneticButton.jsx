import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticButton({
  children, onClick, className = '', style = {},
  strength = 0.42, variant = 'primary',
}) {
  const ref = useRef(null)
  const [over, setOver] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 190, damping: 16 })
  const sy = useSpring(y, { stiffness: 190, damping: 16 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width  / 2)) * strength)
    y.set((e.clientY - (rect.top  + rect.height / 2)) * strength)
  }

  const onLeave = () => { x.set(0); y.set(0); setOver(false) }

  const base = variant === 'primary'
    ? 'btn-primary'
    : 'btn-secondary'

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
