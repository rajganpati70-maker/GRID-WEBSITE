import { useEffect, useRef } from 'react'

// Reduced from 190 → 85: N² connections = 18,000 checks/frame → 3,600 checks/frame
const NUM      = 85
const MAX_DIST = 140
const DEPTH    = 480

const COLS = [
  [0, 212, 255],
  [124, 58, 237],
  [0, 102, 255],
  [0, 255, 180],
]

export default function ParticleNetwork({ opacity = 0.85 }) {
  const canvasRef = useRef(null)
  const state     = useRef({ mouse: { x: -9999, y: -9999 }, particles: [], frame: 0, W: 0, H: 0 })
  const raf       = useRef(null)
  const mouseRaf  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d', { alpha: true })
    const s      = state.current

    const resize = () => {
      const parent = canvas.parentElement
      const dpr    = Math.min(window.devicePixelRatio || 1, 2) // cap at 2x — 3x/4x screens don't need it
      s.W = parent.offsetWidth
      s.H = parent.offsetHeight
      canvas.width  = s.W * dpr
      canvas.height = s.H * dpr
      canvas.style.width  = s.W + 'px'
      canvas.style.height = s.H + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const init = () => {
      s.particles = Array.from({ length: NUM }, () => ({
        x:     Math.random() * s.W,
        y:     Math.random() * s.H,
        z:     Math.random() * DEPTH,
        vx:    (Math.random() - 0.5) * 0.28,
        vy:    (Math.random() - 0.5) * 0.28,
        vz:    (Math.random() - 0.5) * 0.16,
        r:     Math.random() * 1.6 + 0.4,
        col:   COLS[Math.floor(Math.random() * COLS.length)],
        phase: Math.random() * Math.PI * 2,
        rate:  Math.random() * 0.022 + 0.008,
      }))
    }

    const tick = () => {
      const { W, H, mouse, particles } = s
      if (!W) { raf.current = requestAnimationFrame(tick); return }
      ctx.clearRect(0, 0, W, H)
      s.frame++

      // ── Move particles ────────────────────────────────────────────────
      for (const p of particles) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 22500 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = (150 - d) / 150
          p.vx += (dx / d) * f * 0.5
          p.vy += (dy / d) * f * 0.5
        }
        p.vx *= 0.972; p.vy *= 0.972; p.vz *= 0.972
        p.x += p.vx;   p.y += p.vy;   p.z += p.vz
        p.phase += p.rate
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        if (p.z < 0) p.z = DEPTH; if (p.z > DEPTH) p.z = 0
      }

      // ── Connections — NO gradient objects, solid stroke only ──────────
      // Batching same-alpha strokes cuts ctx state changes dramatically.
      for (let i = 0; i < particles.length; i++) {
        const a  = particles[i]
        const da = 1 - a.z / DEPTH
        for (let j = i + 1; j < particles.length; j++) {
          const b  = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > MAX_DIST * MAX_DIST) continue
          const dist  = Math.sqrt(d2)
          const depth = (da + (1 - b.z / DEPTH)) * 0.5
          const alpha = (1 - dist / MAX_DIST) * depth * 0.45
          // Average the two particle colours — much cheaper than createLinearGradient
          const r = (a.col[0] + b.col[0]) >> 1
          const g = (a.col[1] + b.col[1]) >> 1
          const bl= (a.col[2] + b.col[2]) >> 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha.toFixed(3)})`
          ctx.lineWidth   = depth * 0.85
          ctx.stroke()

          // Occasional data pulse — only 1 in ~200 frames per connection
          if (s.frame % 3 === 0 && Math.random() > 0.997) {
            const t = (s.frame * 0.009 + i * 0.13) % 1
            ctx.beginPath()
            ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(0,212,255,${(alpha * 3).toFixed(3)})`
            ctx.fill()
          }
        }
      }

      // ── Particles — simple arc fill, no radial gradient ───────────────
      for (const p of particles) {
        const depth  = 1 - p.z / DEPTH
        const pulse  = 0.72 + 0.28 * Math.sin(p.phase)
        const r      = Math.max(0.3, p.r * depth * pulse)
        const alpha  = depth * 0.95
        const [cr, cg, cb] = p.col

        // Soft glow — one slightly larger arc at low alpha (no createRadialGradient)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 4.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${(alpha * 0.12).toFixed(3)})`
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, alpha * 1.6).toFixed(3)})`
        ctx.fill()
      }

      raf.current = requestAnimationFrame(tick)
    }

    // Throttle mousemove via rAF — fires at most once per frame instead of 200+/s
    const onMouse = (e) => {
      if (mouseRaf.current) return
      mouseRaf.current = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect()
        s.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        mouseRaf.current = null
      })
    }

    const handleResize = () => { resize(); init() }
    window.addEventListener('resize',    handleResize, { passive: true })
    window.addEventListener('mousemove', onMouse,      { passive: true })
    resize(); init(); tick()

    return () => {
      window.removeEventListener('resize',    handleResize)
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf.current)
      if (mouseRaf.current) cancelAnimationFrame(mouseRaf.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
