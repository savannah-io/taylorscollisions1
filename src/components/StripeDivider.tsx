'use client'

interface StripeDividerProps {
  /** Stripe band height in px (default 6 — matches Javier's diag-stripe) */
  height?: number
  /** Stripe color. Defaults to bright primary-500 blue. */
  color?: string
  /** Opacity of the band (default 0.85) */
  opacity?: number
}

/**
 * Diagonal dashed divider — ported 1:1 from Javier's .diag-stripe.
 *
 * Pattern: repeating-linear-gradient(45deg, color 0 12px, transparent 12px 24px)
 * Renders bright-blue diagonal dashes with transparent gaps so the parent
 * section's color shows through (works on white OR dark sections).
 * Place flush against a section edge for a road-stripe / caution-tape vibe.
 */
export default function StripeDivider({
  height = 6,
  color = '#0ea5e9',
  opacity = 0.85,
}: StripeDividerProps) {
  return (
    <div
      aria-hidden
      style={{
        height,
        width: '100%',
        opacity,
        backgroundImage: `repeating-linear-gradient(45deg, ${color} 0 12px, transparent 12px 24px)`,
      }}
    />
  )
}
