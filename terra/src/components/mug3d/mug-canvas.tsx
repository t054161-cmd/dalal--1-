'use client'

import * as React from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { DesignConfig } from '@/types/design'
import { getSize } from '@/data/product'
import { MugMesh } from './mug-mesh'

export type ViewerApi = {
  /** PNG data URL of exactly what is on screen. */
  capture: () => string | null
  reset: () => void
  /** Nudge the camera by a number of degrees, for keyboard users. */
  rotateBy: (degrees: number) => void
  /** Zoom without a wheel or a pinch: factor < 1 moves closer. */
  zoomBy: (factor: number) => void
}

/**
 * Keeps a handle on the renderer so the Snapshot button can rasterise the
 * current view, and so keyboard users can rotate without a pointer.
 */
function Bridge({
  apiRef,
  controlsRef,
}: {
  apiRef: React.MutableRefObject<ViewerApi | null>
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>
}) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  React.useEffect(() => {
    apiRef.current = {
      capture: () => {
        try {
          // Render once more so the buffer we read is the frame the customer
          // is looking at, then hand back a PNG.
          gl.render(scene, camera)
          return gl.domElement.toDataURL('image/png')
        } catch {
          return null
        }
      },
      reset: () => controlsRef.current?.reset(),
      rotateBy: (degrees) => {
        const controls = controlsRef.current
        if (!controls) return
        controls.setAzimuthalAngle(controls.getAzimuthalAngle() + THREE.MathUtils.degToRad(degrees))
        controls.update()
      },
      zoomBy: (factor) => {
        const controls = controlsRef.current
        if (!controls) return
        const offset = controls.object.position.clone().sub(controls.target)
        const length = THREE.MathUtils.clamp(
          offset.length() * factor,
          controls.minDistance,
          controls.maxDistance,
        )
        controls.object.position.copy(controls.target).add(offset.setLength(length))
        controls.update()
      },
    }
    return () => {
      apiRef.current = null
    }
  }, [apiRef, controlsRef, gl, scene, camera])

  return null
}

/** Soft environment light + one key light + a contact shadow on the ground. */
function Lighting({ height }: { height: number }) {
  return (
    <>
      {/* Warm sky, cool bounce from the ground — reads as daylight indoors. */}
      <hemisphereLight args={['#FBF6EC', '#8A7A66', 0.85]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[2.4, 3.4, 2.6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0008}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 12]} />
      </directionalLight>
      {/* Rim light from behind, so the silhouette separates from the page. */}
      <directionalLight position={[-2.6, 1.6, -2.2]} intensity={0.7} color="#E8D9C0" />
      <pointLight position={[0, height * 1.4, 1.6]} intensity={0.35} color="#FFF4E2" />
    </>
  )
}

export default function MugCanvas({
  design,
  autoRotate,
  onUserInteract,
  apiRef,
  className,
  ariaLabel,
}: {
  design: DesignConfig
  autoRotate: boolean
  onUserInteract: () => void
  apiRef: React.MutableRefObject<ViewerApi | null>
  className?: string
  ariaLabel: string
}) {
  const controlsRef = React.useRef<OrbitControlsImpl | null>(null)
  const size = getSize(design.sizeId)
  const height = size.heightMm * 0.01

  // Frame the mug so the whole silhouette — base to lid — sits inside the
  // frame with room to breathe: visible height at the camera plane is
  // 2·d·tan(fov/2), so d is derived from the mug's own height.
  const distance = height * 2.35 + 0.35

  return (
    <Canvas
      className={`terra-canvas ${className ?? ''}`}
      // devicePixelRatio is capped at 2: past that it costs fill rate and
      // nobody can see the difference on a mug.
      dpr={[1, 2]}
      shadows
      gl={{
        // Required so the Snapshot button can read the framebuffer.
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0.25, height * 0.34, distance], fov: 34, near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      onDoubleClick={() => controlsRef.current?.reset()}
      aria-label={ariaLabel}
      role="img"
    >
      <Lighting height={height} />

      <React.Suspense fallback={null}>
        <MugMesh design={design} />
      </React.Suspense>

      <ContactShadows
        position={[0, -height / 2 - 0.005, 0]}
        opacity={0.42}
        scale={height * 2.2}
        blur={2.6}
        far={1.6}
        resolution={512}
        color="#3E3229"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
        zoomSpeed={0.7}
        minDistance={height * 1.5}
        maxDistance={height * 3.8}
        // Never let the mug tip past level or turn upside down.
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={Math.PI * 0.62}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
        onStart={onUserInteract}
        target={[0, 0.04, 0]}
      />

      <Bridge apiRef={apiRef} controlsRef={controlsRef} />
    </Canvas>
  )
}
