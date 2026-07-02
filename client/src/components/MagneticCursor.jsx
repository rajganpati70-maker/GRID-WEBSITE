import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticCursor() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [text, setText] = useState('')
  const visibleRef = useRef(false)   // avoids stale closure in hot mousemove path

  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const rx = useSpring(mx, { stiffness: 72, damping: 18, mass: 0.45 })
  const ry = useSpring(my, { stiffness: 72, damping: 18, mass: 0.45 })

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    document.body.style.cursor = 'none'

    const move = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      if (!visibleRef.current) { visibleRef.current = true; setVisible(true) }
    }

    const over = (e) => {
      const el = e.target
      if (el.closest('button, a, input, textarea, select, [data-cursor]')) {
        setHovered(true)
        const d = el.closest('[data-cursor]')
        setText(d ? d.dataset.cursor : '')
      }
    }

    const out = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('button, a, input, textarea, select, [data-cursor]')) {
        setHovered(false)
        setText('')
      }
    }

    const down = () => setClicking(true)
    const up = () => setClicking(false)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    document.addEventListener('mousedown', down)
    document.addEventListener('mouseup', up)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.removeEventListener('mousedown', down)
      document.removeEventListener('mouseup', up)
    }
  }, [])

  if (!visible) return null

  const ring = clicking ? 18 : hovered ? 48 : 30

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, pointerEvents: 'none' }}>
      {/* Inner dot — instant */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          width: clicking ? 3 : 5, height: clicking ? 3 : 5,
          borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 12px 2px #00d4ff',
          transition: 'width 0.12s, height 0.12s',
        }}
      />
      {/* Outer ring — spring lag */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: rx, y: ry,
          translateX: '-50%', translateY: '-50%',
          width: ring, height: ring,
          borderRadius: '50%',
          border: `1.5px solid rgba(0,212,255,${hovered ? 0.9 : 0.5})`,
          background: hovered ? 'rgba(0,212,255,0.07)' : 'transparent',
          boxShadow: hovered ? '0 0 24px rgba(0,212,255,0.25), inset 0 0 16px rgba(0,212,255,0.07)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.22s cubic-bezier(0.22,1,0.36,1), height 0.22s cubic-bezier(0.22,1,0.36,1), background 0.2s, border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {text && (
          <span style={{
            fontSize: 9, color: '#00d4ff', whiteSpace: 'nowrap',
            fontFamily: '"Rajdhani", monospace', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase',
          }}>
            {text}
          </span>
        )}
      </motion.div>
    </div>,
    document.body
  )
}
