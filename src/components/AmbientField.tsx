'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

type Tone = 'light' | 'dark'

interface AmbientFieldProps {
  /** 'light' = for white sections (blue/teal beams visible on white)
   *  'dark'  = for navy sections (additive glow on dark) */
  tone?: Tone
  /** particle count — keep modest, this is ambient not foreground */
  count?: number
  /** overall opacity 0..1 (tone-adjusted automatically) */
  opacity?: number
  /** include diagonal light beams (default true) */
  beams?: boolean
}

/**
 * Soft drifting particles + diagonal light beams. Atmosphere, not foreground.
 * - Particles: ~120 small dots (additive on dark, normal on light)
 * - Beams: 3 diagonal teal/blue streaks (normal blending on light = visible;
 *   additive on dark = glow effect)
 * - Lights-only, no HDRI dependency
 * - Reduced-motion users get static CSS gradient fallback
 */
export default function AmbientField({
  tone = 'light',
  count,
  opacity,
  beams = true,
}: AmbientFieldProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    setEnabled(true)
  }, [])

  const resolvedCount = count ?? (tone === 'light' ? 130 : 80)
  const resolvedOpacity = opacity ?? (tone === 'light' ? 0.85 : 0.55)

  if (!enabled) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.5,
          background:
            tone === 'light'
              ? 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, transparent 30%, transparent 70%, rgba(14,165,233,0.06) 100%)'
              : 'radial-gradient(50% 60% at 50% 30%, rgba(186,230,253,0.18), transparent 70%)',
        }}
      />
    )
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: resolvedOpacity }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <Particles count={resolvedCount} tone={tone} />
        {beams && <Beams tone={tone} />}
      </Canvas>
    </div>
  )
}

interface ParticlesProps {
  count: number
  tone: Tone
}

function Particles({ count, tone }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null!)
  const tRef = useRef(0)

  const { geometry, baseY, drift } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const baseY = new Float32Array(count)
    const drift = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      // Spread wider so particles cover most of the viewport
      const x = (Math.random() - 0.5) * 18
      const y = (Math.random() - 0.5) * 12
      const z = (Math.random() - 0.5) * 4 - 1
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      baseY[i] = y
      drift[i * 2] = Math.random() * Math.PI * 2
      drift[i * 2 + 1] = 0.2 + Math.random() * 0.5
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry, baseY, drift }
  }, [count])

  useFrame((_, dt) => {
    if (!ref.current) return
    tRef.current += dt
    const t = tRef.current
    const pos = (ref.current.geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < count; i++) {
      const phase = drift[i * 2]
      const speed = drift[i * 2 + 1]
      pos[i * 3 + 1] = baseY[i] + Math.sin(t * speed + phase) * 0.4
      pos[i * 3] += Math.cos(t * speed * 0.5 + phase) * 0.0015
    }
    ;(ref.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    ref.current.rotation.z = Math.sin(t * 0.1) * 0.05
  })

  // Light sections: solid teal/cyan dots visible on white
  // Dark sections: bright sky dots with additive blending
  const isLight = tone === 'light'
  const color = isLight ? '#0ea5e9' : '#bae6fd'

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={isLight ? 0.05 : 0.07}
        sizeAttenuation
        color={color}
        transparent
        opacity={isLight ? 0.55 : 0.85}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  )
}

interface BeamsProps {
  tone: Tone
}

function Beams({ tone }: BeamsProps) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.04
    groupRef.current.position.x = Math.sin(t * 0.22) * 0.18
  })

  const isLight = tone === 'light'
  // Teal-cyan accent for light sections — reads as cool depth without darkening
  // Bright sky for dark sections — reads as additive glow
  const beam1 = isLight ? '#22d3ee' : '#7dd3fc' // cyan-400 / sky-300
  const beam2 = isLight ? '#0ea5e9' : '#bae6fd' // sky-500 / sky-200
  const beam3 = isLight ? '#2dd4bf' : '#7dd3fc' // teal-400 / sky-300

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending
  // On light bg: lower opacity so it reads as faint colored beams
  // On dark bg: higher opacity so additive glow is visible
  const opacityScale = isLight ? 1 : 1.4

  return (
    <group ref={groupRef}>
      <BeamMesh
        position={[-5.8, 0.5, -2]}
        size={[1.6, 16]}
        rotation={[0, 0, 0.32]}
        color={beam1}
        opacity={(isLight ? 0.32 : 0.22) * opacityScale}
        blending={blending}
      />
      <BeamMesh
        position={[5.4, 0.2, -2]}
        size={[1.3, 16]}
        rotation={[0, 0, 0.32]}
        color={beam2}
        opacity={(isLight ? 0.26 : 0.18) * opacityScale}
        blending={blending}
      />
      <BeamMesh
        position={[-1.8, -0.4, -3]}
        size={[1.9, 14]}
        rotation={[0, 0, 0.32]}
        color={beam3}
        opacity={(isLight ? 0.18 : 0.12) * opacityScale}
        blending={blending}
      />
      <BeamMesh
        position={[2.6, 0.6, -3]}
        size={[1.5, 14]}
        rotation={[0, 0, 0.32]}
        color={beam1}
        opacity={(isLight ? 0.20 : 0.14) * opacityScale}
        blending={blending}
      />
    </group>
  )
}

interface BeamProps {
  position: [number, number, number]
  size: [number, number]
  rotation: [number, number, number]
  color: string
  opacity: number
  blending: THREE.Blending
}

function BeamMesh({ position, size, rotation, color, opacity, blending }: BeamProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={blending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
