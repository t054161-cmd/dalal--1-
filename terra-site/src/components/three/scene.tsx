'use client'

import * as React from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { CupConfig } from '@/types'
import { DIMS, EXPLODED, OBJECT_HEIGHT } from './geometry'
import { Tumbler } from './tumbler'

export type ViewerApi = {
  /** PNG data URL of exactly what is on screen. */
  capture: () => string | null
  reset: () => void
  turn: (degrees: number) => void
  zoom: (factor: number) => void
}

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
          // Draw once more so the buffer we read is the frame on screen.
          gl.render(scene, camera)
          return gl.domElement.toDataURL('image/png')
        } catch {
          return null
        }
      },
      reset: () => controlsRef.current?.reset(),
      turn: (degrees) => {
        const c = controlsRef.current
        if (!c) return
        c.setAzimuthalAngle(c.getAzimuthalAngle() + THREE.MathUtils.degToRad(degrees))
        c.update()
      },
      zoom: (factor) => {
        const c = controlsRef.current
        if (!c) return
        const offset = c.object.position.clone().sub(c.target)
        const length = THREE.MathUtils.clamp(offset.length() * factor, c.minDistance, c.maxDistance)
        c.object.position.copy(c.target).add(offset.setLength(length))
        c.update()
      },
    }
    return () => {
      apiRef.current = null
    }
  }, [apiRef, controlsRef, gl, scene, camera])

  return null
}

/**
 * Keeps the whole object framed as it changes shape. The camera prop is only
 * applied when the Canvas first mounts, so exploding the cup — which makes it
 * half again as tall — has to move the camera itself. It eases, which is also
 * the shot we want: the lens pulls back as the parts separate.
 */
function Framing({
  distance,
  centre,
  controlsRef,
}: {
  distance: number
  centre: number
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>
}) {
  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const offset = controls.object.position.clone().sub(controls.target)
    const length = offset.length()
    const nextLength = THREE.MathUtils.damp(length, distance, 2.6, delta)
    const nextY = THREE.MathUtils.damp(controls.target.y, centre, 2.6, delta)

    const movedZoom = Math.abs(nextLength - length) > 0.0004
    const movedPan = Math.abs(nextY - controls.target.y) > 0.0004
    if (!movedZoom && !movedPan) return

    controls.target.y = nextY
    controls.object.position.copy(controls.target).add(offset.setLength(nextLength))
    controls.update()
  })

  return null
}

/**
 * A studio, built in code. The environment map is rendered once from a few
 * light shapes — no HDRI is fetched — which gives the matte body its soft
 * sheen and the steel inner layer something real to reflect.
 */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <Environment resolution={256} frames={1}>
        {/* Broad soft box overhead — the main source. */}
        <Lightformer form="rect" intensity={2.1} color="#FFF8EC" scale={[8, 5, 1]} position={[0, 5, 2]} rotation={[-Math.PI / 2, 0, 0]} />
        {/* Cool linen fill from the left, warm bounce from the right. */}
        <Lightformer form="rect" intensity={0.9} color="#EDE7DC" scale={[4, 6, 1]} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={0.7} color="#DFC9C0" scale={[4, 6, 1]} position={[5, 0.5, 1]} rotation={[0, -Math.PI / 2, 0]} />
        {/* Earthy floor, so the underside is never black. */}
        <Lightformer form="rect" intensity={0.5} color="#A9B29F" scale={[8, 8, 1]} position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </Environment>

      {/* Key light, the only one that casts. */}
      <directionalLight
        position={[2.6, 4.2, 3]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0008}
      >
        <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, 0.1, 14]} />
      </directionalLight>
      {/* Rim from behind, to lift the silhouette off the page. */}
      <directionalLight position={[-3, 2.4, -3]} intensity={0.55} color="#EDE7DC" />
    </>
  )
}

export default function Scene({
  config,
  exploded = false,
  spin = 0,
  interactive = true,
  autoTurn = false,
  showLabels = false,
  apiRef,
  onUserInteract,
  ariaLabel,
}: {
  config: CupConfig
  exploded?: boolean
  spin?: number
  interactive?: boolean
  autoTurn?: boolean
  showLabels?: boolean
  apiRef?: React.MutableRefObject<ViewerApi | null>
  onUserInteract?: () => void
  ariaLabel: string
}) {
  const controlsRef = React.useRef<OrbitControlsImpl | null>(null)
  const fallbackApi = React.useRef<ViewerApi | null>(null)
  const api = apiRef ?? fallbackApi

  const FOV = 30
  const halfFov = Math.tan((FOV / 2) * (Math.PI / 180))

  /**
   * Fit the object's real height into the vertical field of view, with air
   * around it. Exploded is taller and no longer centred on the origin, so it
   * needs both a longer lens and a raised target.
   */
  const explodedTop = EXPLODED.straw + DIMS.strawLength - 0.16 + DIMS.strawRadius
  const explodedHeight = explodedTop - EXPLODED.body
  // Group space is shifted by -OBJECT_HEIGHT / 2 (see Tumbler).
  const explodedCentre = (explodedTop + EXPLODED.body) / 2 - OBJECT_HEIGHT / 2

  const fit = exploded ? explodedHeight : OBJECT_HEIGHT
  const centre = exploded ? explodedCentre : 0
  const distance = (fit * 1.14) / (2 * halfFov)
  // The closed framing sets the zoom limits, so they never fight the reframe.
  const baseDistance = (OBJECT_HEIGHT * 1.14) / (2 * halfFov)

  return (
    <Canvas
      className="viewer"
      // devicePixelRatio is capped at 2 — past that it costs fill rate and
      // nobody can see the difference.
      dpr={[1, 2]}
      shadows
      gl={{
        // Required so the snapshot button can read the framebuffer.
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{
        position: [baseDistance * 0.1, baseDistance * 0.09, baseDistance],
        fov: FOV,
        near: 0.1,
        far: 90,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.02
      }}
      onDoubleClick={() => controlsRef.current?.reset()}
      role="img"
      aria-label={ariaLabel}
    >
      <Studio />

      <React.Suspense fallback={null}>
        <Tumbler config={config} exploded={exploded} spin={spin} showLabels={showLabels} />
      </React.Suspense>

      <ContactShadows
        position={[0, -OBJECT_HEIGHT / 2 - 0.02, 0]}
        opacity={0.34}
        scale={OBJECT_HEIGHT * 1.9}
        blur={3}
        far={2}
        resolution={512}
        color="#2B342C"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={interactive}
        enablePan={false}
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.8}
        zoomSpeed={0.65}
        minDistance={baseDistance * 0.5}
        maxDistance={baseDistance * 2.4}
        // Never let it tip past level or turn upside down.
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.62}
        autoRotate={autoTurn}
        autoRotateSpeed={0.55}
        onStart={onUserInteract}
        target={[0, 0, 0]}
      />

      <Framing distance={distance} centre={centre} controlsRef={controlsRef} />
      <Bridge apiRef={api} controlsRef={controlsRef} />
    </Canvas>
  )
}
