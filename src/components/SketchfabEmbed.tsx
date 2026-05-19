'use client'

import { useEffect, useRef, useState } from 'react'

interface SketchfabEmbedProps {
  /** Sketchfab model ID (the hex string from the embed URL) */
  modelId: string
  /** Accessible title */
  title?: string
  /** Auto-rotate speed in rad/sec. 0 = disabled. Default 0.2 (gentle). */
  autospin?: number
  /** Auto-play camera animations / start (default true) */
  autostart?: boolean
  /** Transparent background (default true) */
  transparent?: boolean
  /** Defer mount until iframe is near viewport (saves initial JS) */
  lazy?: boolean
  className?: string
}

/**
 * Sketchfab iframe wrapper — lazy-mounted via IntersectionObserver and styled to
 * float as a foreground 3D element (transparent bg, no UI chrome).
 *
 * URL params reference:
 *   autospin=1, autostart=1, transparent=1, ui_*=0
 *   See https://sketchfab.com/developers/viewer/parameters
 */
export default function SketchfabEmbed({
  modelId,
  title = '3D model',
  autospin = 0.2,
  autostart = true,
  transparent = true,
  lazy = true,
  className = '',
}: SketchfabEmbedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = useState(!lazy)

  useEffect(() => {
    if (!lazy || shouldMount) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldMount(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldMount(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [lazy, shouldMount])

  const params = new URLSearchParams({
    autospin: String(autospin),
    autostart: autostart ? '1' : '0',
    transparent: transparent ? '1' : '0',
    ui_infos: '0',
    ui_controls: '0',
    ui_stop: '0',
    ui_inspector: '0',
    ui_watermark: '0',
    ui_watermark_link: '0',
    ui_hint: '0',
    ui_help: '0',
    ui_fullscreen: '0',
    ui_annotations: '0',
    ui_settings: '0',
    ui_vr: '0',
    ui_ar: '0',
    ui_color: '0ea5e9',
    dnt: '1',
    preload: '0',
  })

  const src = `https://sketchfab.com/models/${modelId}/embed?${params.toString()}`

  return (
    <div ref={ref} className={className}>
      {shouldMount ? (
        <iframe
          title={title}
          src={src}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          frameBorder={0}
          allowFullScreen
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            colorScheme: 'normal',
          }}
        />
      ) : null}
    </div>
  )
}
