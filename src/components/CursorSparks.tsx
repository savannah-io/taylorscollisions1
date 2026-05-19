'use client'

import { useEffect, useRef, useState } from 'react'

interface Bolt {
  points: { x: number; y: number }[]
  born: number
  width: number
}

const LIFETIME_MS = 180
const EMIT_THROTTLE_MS = 70
const MAX_BOLTS = 18

/**
 * Electric jolts around the cursor. Jagged 3-4 segment polylines emitted
 * on pointer movement, sharp white core with sky-blue glow, ~220ms life.
 * Desktop only (pointer:fine + no reduced-motion).
 */
export default function CursorSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (fine && !reduced) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const bolts: Bolt[] = []
    let lastEmit = 0
    let lastX = -1
    let lastY = -1

    const makeBolt = (cx: number, cy: number): Bolt => {
      const segments = 2 + Math.floor(Math.random() * 2) // 2-3 segments
      const length = 7 + Math.random() * 10 // short — 7-17px
      const angle = Math.random() * Math.PI * 2
      const dx = Math.cos(angle)
      const dy = Math.sin(angle)
      const px = -dy
      const py = dx

      const points = [{ x: cx, y: cy }]
      for (let i = 1; i <= segments; i++) {
        const t = i / segments
        const baseX = cx + dx * length * t
        const baseY = cy + dy * length * t
        const taper = Math.sin(t * Math.PI)
        const jitter = (Math.random() - 0.5) * 5 * taper
        points.push({
          x: baseX + px * jitter,
          y: baseY + py * jitter,
        })
      }
      return {
        points,
        born: performance.now(),
        width: 0.55 + Math.random() * 0.45,
      }
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - lastEmit < EMIT_THROTTLE_MS) return
      const dx = lastX < 0 ? 0 : e.clientX - lastX
      const dy = lastY < 0 ? 0 : e.clientY - lastY
      if (lastX >= 0 && dx * dx + dy * dy < 9) return
      lastX = e.clientX
      lastY = e.clientY
      lastEmit = now

      if (bolts.length < MAX_BOLTS) {
        bolts.push(makeBolt(e.clientX, e.clientY))
      }
    }

    let raf = 0
    const tick = () => {
      const now = performance.now()
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        const age = (now - b.born) / LIFETIME_MS
        if (age >= 1) {
          bolts.splice(i, 1)
          continue
        }
        // sharp fade — most of life at high opacity, fast drop at end
        const alpha = age < 0.6 ? 1 - age * 0.3 : (1 - age) / 0.4

        // outer glow halo — subtle
        ctx.shadowColor = 'rgba(56, 189, 248, 0.6)'
        ctx.shadowBlur = 6
        ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.4})`
        ctx.lineWidth = b.width * 1.8
        ctx.beginPath()
        ctx.moveTo(b.points[0].x, b.points[0].y)
        for (let p = 1; p < b.points.length; p++) {
          ctx.lineTo(b.points[p].x, b.points[p].y)
        }
        ctx.stroke()

        // bright core — thin, slightly softened
        ctx.shadowBlur = 0
        ctx.strokeStyle = `rgba(240, 249, 255, ${alpha * 0.75})`
        ctx.lineWidth = b.width
        ctx.beginPath()
        ctx.moveTo(b.points[0].x, b.points[0].y)
        for (let p = 1; p < b.points.length; p++) {
          ctx.lineTo(b.points[p].x, b.points[p].y)
        }
        ctx.stroke()
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    />
  )
}
