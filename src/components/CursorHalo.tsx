'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Soft blue hover gradient that follows the cursor. NOT a lens — content
 * behind is NOT blurred. Just a colored radial wash that tints the page
 * around the pointer.
 *
 * Hidden on touch + reduced-motion. Lerped via rAF for smooth follow.
 */
export default function CursorHalo() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!ref.current) return
      ref.current.style.opacity = '1'
    }
    const onLeave = () => {
      if (!ref.current) return
      ref.current.style.opacity = '0'
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.2
      current.y += (target.y - current.y) * 0.2
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.x - 120}px, ${current.y - 120}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 240,
        height: 240,
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: 0,
        transition: 'opacity 320ms ease',
        willChange: 'transform, opacity',
        mixBlendMode: 'multiply',
        // Pure radial gradient — no blur, no shadow, no lens
        background:
          'radial-gradient(circle at center, rgba(14,165,233,0.22) 0%, rgba(2,132,199,0.10) 35%, rgba(2,132,199,0.03) 60%, rgba(2,132,199,0) 75%)',
      }}
    />
  )
}
