import { useEffect, useRef, useState } from 'react'

export default function GlowCounter({ value, suffix = '', prefix = '', duration = 2200, color = '#00d4ff' }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef(null)
  const ran = useRef(false)

  useEffect(() => {
    let rafId = null
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ran.current) {
          ran.current = true
          const start = performance.now()
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 4)
            setDisplayed(Math.floor(ease * value))
            if (t < 1) { rafId = requestAnimationFrame(tick) }
            else setDisplayed(value)
          }
          rafId = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => { obs.disconnect(); if (rafId) cancelAnimationFrame(rafId) }
  }, [value, duration])

  return (
    <span
      ref={ref}
      style={{
        color,
        textShadow: `0 0 30px ${color}90, 0 0 60px ${color}40`,
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-block',
      }}
    >
      {prefix}{displayed.toLocaleString()}{suffix}
    </span>
  )
}
