import { useEffect } from 'react'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════════════════
   SMOOTH SCROLL — buttery inertia scrolling (the signature feel of premium
   agency sites). Wraps the whole app; resets scroll position on route change
   so page transitions always start from the top.
═══════════════════════════════════════════════════════════════════════════ */
export default function SmoothScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
    })

    let raf
    function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.__lenis = lenis

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  // Keep Lenis in sync with route changes / hash anchors
  useEffect(() => {
    const lenis = window.__lenis
    if (!lenis) return
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { lenis.scrollTo(el, { immediate: true }); return }
    }
    lenis.scrollTo(0, { immediate: true })
  }, [pathname, hash])

  return null
}
