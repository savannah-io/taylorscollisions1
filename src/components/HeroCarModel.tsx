'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows, Float, Environment, OrbitControls } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HeroCarModelProps {
  src?: string
  rotateSpeed?: number
  scale?: number
  yOffset?: number
}

/**
 * Locally-loaded 3D wrecked car — loads instantly on page (no click-to-play).
 * - useGLTF preloads the GLB at module evaluation
 * - OrbitControls allow user drag-to-rotate; auto-rotate pauses on interaction
 * - ContactShadows ground the model without a baked floor disc
 * - Suspense fallback returns null so the parent tile gradient shows during load
 */
export default function HeroCarModel({
  src = '/models/crashed-sedan.glb',
  rotateSpeed = 0.6,
  scale = 1,
  yOffset = -0.15,
}: HeroCarModelProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [4.0, 1.4, 5.0], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-5, 3, -4]} intensity={1.5} color="#38bdf8" />
      <pointLight position={[4, -2, 5]} intensity={1.0} color="#bae6fd" />
      <Environment preset="city" />

      <Suspense fallback={null}>
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.08}>
          <Car src={src} scale={scale} yOffset={yOffset} />
        </Float>
      </Suspense>

      <ContactShadows
        position={[0, yOffset - 0.85, 0]}
        opacity={0.55}
        scale={8}
        blur={2.4}
        far={4}
        color="#0c4a6e"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={rotateSpeed}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={[0, yOffset, 0]}
      />
    </Canvas>
  )
}

function Car({
  src,
  scale,
  yOffset,
}: {
  src: string
  scale: number
  yOffset: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(src)

  useEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    scene.position.x -= center.x
    scene.position.y -= center.y
    scene.position.z -= center.z
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const target = 4.2
      const s = target / maxDim
      scene.scale.setScalar(s)
    }
  }, [scene])

  return (
    <group ref={ref} position={[0, yOffset, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/crashed-sedan.glb')
