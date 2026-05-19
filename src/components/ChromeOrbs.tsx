'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type Tone = 'light' | 'dark'
type Variant = 'left' | 'right' | 'center'

interface ChromeOrbsProps {
  tone?: Tone
  variant?: Variant
  intensity?: number
}

/**
 * Subtle 3D backdrop accent — small chrome-blue glass spheres positioned at the
 * far edges so they read as ambient depth, not foreground decoration.
 * Lights-only (no HDRI dependency). Reduced-motion users get an SVG fallback.
 */
export default function ChromeOrbs({ tone = 'light', variant = 'left', intensity = 1 }: ChromeOrbsProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    setEnabled(true)
  }, [])

  if (!enabled) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            variant === 'right'
              ? 'radial-gradient(35% 40% at 92% 30%, rgba(56,189,248,0.18), transparent 70%)'
              : 'radial-gradient(35% 40% at 8% 30%, rgba(56,189,248,0.18), transparent 70%)',
        }}
      />
    )
  }

  const flip = variant === 'right' ? -1 : 1

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: tone === 'light' ? 0.42 : 0.32 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.0} color="#dbeafe" />
        <directionalLight position={[6, 8, 6]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-5 * flip, 3, 4]} intensity={2.4} color="#38bdf8" />
        <pointLight position={[2 * flip, -4, 2]} intensity={1.2} color="#bae6fd" />

        {/* Pushed far to the edge, smaller — read as ambient glints */}
        <Orb position={[-5.2 * flip, 0.6, 0]} scale={0.42 * intensity} speed={0.45} />
        <Orb position={[-6.0 * flip, -1.8, -1]} scale={0.22 * intensity} speed={0.75} accent />
        <Orb position={[-4.4 * flip, 2.1, -2]} scale={0.16 * intensity} speed={1.0} />
      </Canvas>
    </div>
  )
}

interface OrbProps {
  position: [number, number, number]
  scale: number
  speed?: number
  accent?: boolean
}

function Orb({ position, scale, speed = 0.6, accent = false }: OrbProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.x = t * 0.08
    ref.current.rotation.y = t * 0.12
  })

  return (
    <Float speed={1.0} rotationIntensity={0.18} floatIntensity={0.4}>
      <mesh ref={ref} position={position} scale={scale} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color={accent ? '#0284c7' : '#7dd3fc'}
          emissive={accent ? '#0c4a6e' : '#0ea5e9'}
          emissiveIntensity={accent ? 0.14 : 0.08}
          metalness={0.7}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={0.55}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[120, 380]}
          envMapIntensity={1.0}
        />
      </mesh>
    </Float>
  )
}
