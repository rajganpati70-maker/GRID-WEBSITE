import { motion, useScroll, useSpring } from 'framer-motion'

/* Slim glowing progress bar pinned to the very top of the viewport — tracks
   overall scroll position across the whole page. A small, universally
   recognized "premium product" signal. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 })

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2,
        transformOrigin: '0% 50%', scaleX,
        background: 'linear-gradient(90deg,#0052cc,#00d4ff,#7b2fff)',
        boxShadow: '0 0 12px rgba(0,212,255,0.6)',
        zIndex: 9999, pointerEvents: 'none',
      }}
    />
  )
}
