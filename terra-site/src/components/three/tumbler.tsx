'use client'

import * as React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { CupConfig } from '@/types'
import { components, product } from '@/data/product'
import { useI18n } from '@/i18n/provider'
import { CLOSED, DIMS, EXPLODED, OBJECT_HEIGHT, bodyProfile, lidProfile } from './geometry'
import { ensureFonts, makeSleeveTexture } from '@/lib/cup-texture'

type PartId = 'straw' | 'lid' | 'ring' | 'inner' | 'body'

function useDisposable<T extends { dispose: () => void }>(factory: () => T, deps: React.DependencyList) {
  const value = React.useMemo(factory, deps) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => () => value.dispose(), [value])
  return value
}

/** Soft-touch matte finish — the powder-coated feel of the real cup. */
function SoftTouch({ color, dark }: { color: string; dark?: boolean }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.82}
      metalness={0.02}
      clearcoat={0.14}
      clearcoatRoughness={0.86}
      sheen={0.35}
      sheenRoughness={0.9}
      sheenColor={dark ? '#6d7a68' : '#ffffff'}
      envMapIntensity={0.7}
    />
  )
}

/** A small label that follows its part as the model turns. */
function PartLabel({ id, y, side = 1 }: { id: PartId; y: number; side?: number }) {
  const { pick } = useI18n()
  const part = components.find((c) => c.id === id)
  if (!part) return null
  return (
    <Html
      position={[side * (DIMS.lidRadius + 0.34), y, 0]}
      center
      distanceFactor={5.2}
      zIndexRange={[20, 0]}
      // Labels are decoration over an already-described canvas.
      wrapperClass="pointer-events-none"
    >
      <div className="w-40 select-none whitespace-normal text-center">
        <p className="meta text-ink">{pick(part.name)}</p>
        <p className="mt-1 text-[0.58rem] leading-snug text-ink-mute">{pick(part.note)}</p>
      </div>
    </Html>
  )
}

export function Tumbler({
  config,
  exploded = false,
  /** Extra rotation, driven by scroll on the product-reveal section. */
  spin = 0,
  onHoverPart,
  showLabels = false,
}: {
  config: CupConfig
  exploded?: boolean
  spin?: number
  onHoverPart?: (part: PartId | null) => void
  showLabels?: boolean
}) {
  const bodyGeometry = useDisposable(() => new THREE.LatheGeometry(bodyProfile(), 160), [])
  const lidGeometry = useDisposable(() => new THREE.LatheGeometry(lidProfile(), 160), [])

  const root = React.useRef<THREE.Group>(null)
  const bodyRef = React.useRef<THREE.Group>(null)
  const ringRef = React.useRef<THREE.Group>(null)
  const lidRef = React.useRef<THREE.Group>(null)
  const strawRef = React.useRef<THREE.Group>(null)

  const [hovered, setHovered] = React.useState<PartId | null>(null)

  /* ---- the printed sleeve ------------------------------------------------ */
  const [sleeve, setSleeve] = React.useState<THREE.CanvasTexture | null>(null)

  React.useEffect(() => {
    let cancelled = false
    let created: THREE.CanvasTexture | null = null
    ensureFonts(config).then(() => {
      if (cancelled) return
      created = makeSleeveTexture(config)
      setSleeve(created)
    })
    return () => {
      cancelled = true
      created?.dispose()
    }
  }, [
    config.pattern,
    config.patternColor,
    config.mark,
    config.markFont,
    config.markColor,
    config.symbol,
  ])

  /* ---- the exploded transition ------------------------------------------- */
  useFrame((_, delta) => {
    // Critically-damped-ish easing: quick to leave, slow to settle.
    const k = 1 - Math.pow(0.001, delta)
    const target = exploded ? EXPLODED : CLOSED
    const move = (ref: React.RefObject<THREE.Group | null>, to: number) => {
      if (ref.current) ref.current.position.y += (to - ref.current.position.y) * k
    }
    move(bodyRef, target.body)
    move(ringRef, target.ring)
    move(lidRef, target.lid)
    move(strawRef, target.straw)

    if (root.current) root.current.rotation.y = spin
  })

  const hover = (part: PartId | null) => () => {
    setHovered(part)
    onHoverPart?.(part)
    if (typeof document !== 'undefined') {
      document.body.style.cursor = part ? 'pointer' : ''
    }
  }

  // Centre the whole object — straw tip to base — on the origin, so it orbits
  // around its own middle and nothing is cropped.
  const yOffset = -OBJECT_HEIGHT / 2

  const sleeveHeight = DIMS.bodyHeight - 0.26
  const sleeveCenter = 0.13 + sleeveHeight / 2

  return (
    <group ref={root} position={[0, yOffset, 0]}>
      {/* ---- BODY ---------------------------------------------------------- */}
      <group
        ref={bodyRef}
        position={[0, CLOSED.body, 0]}
        onPointerOver={hover('body')}
        onPointerOut={hover(null)}
      >
        <mesh geometry={bodyGeometry} castShadow receiveShadow>
          <SoftTouch color={config.bodyColor} dark />
        </mesh>

        {/* The printed sleeve: pattern, wordmark, the customer's mark. */}
        {sleeve ? (
          <mesh position={[0, sleeveCenter, 0]} rotation={[0, Math.PI, 0]} renderOrder={2}>
            {/* A cylinder's UVs start at +Z, so half a turn puts the middle of
                the artwork on the face the camera starts at. */}
            <cylinderGeometry
              args={[DIMS.bodyRadius + 0.0025, DIMS.bodyRadius + 0.0025, sleeveHeight, 160, 1, true]}
            />
            <meshPhysicalMaterial
              map={sleeve}
              transparent
              alphaTest={0.015}
              depthWrite={false}
              roughness={0.72}
              metalness={0.02}
              polygonOffset
              polygonOffsetFactor={-2}
            />
          </mesh>
        ) : null}

        {/* Stainless inner layer, visible at the mouth once the lid is off. */}
        <group onPointerOver={hover('inner')} onPointerOut={hover(null)}>
          <mesh position={[0, DIMS.bodyHeight - DIMS.innerHeight / 2 - 0.03, 0]}>
            <cylinderGeometry
              args={[
                DIMS.bodyRadius - DIMS.wall - 0.004,
                DIMS.bodyRadius - DIMS.wall - 0.004,
                DIMS.innerHeight,
                96,
                1,
                true,
              ]}
            />
            <meshStandardMaterial
              color="#C6CBC8"
              metalness={0.96}
              roughness={0.26}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {showLabels && (exploded || hovered === 'body') ? (
          <PartLabel id="body" y={DIMS.bodyHeight * 0.42} />
        ) : null}
        {showLabels && (exploded || hovered === 'inner') ? (
          <PartLabel id="inner" y={DIMS.bodyHeight - 0.05} side={-1} />
        ) : null}
      </group>

      {/* ---- SILICONE RING -------------------------------------------------- */}
      <group
        ref={ringRef}
        position={[0, CLOSED.ring, 0]}
        onPointerOver={hover('ring')}
        onPointerOut={hover(null)}
      >
        <mesh castShadow>
          <cylinderGeometry
            args={[DIMS.ringRadius, DIMS.ringRadius, DIMS.ringHeight, 96]}
          />
          <meshStandardMaterial
            color={config.lidColor}
            roughness={0.95}
            metalness={0}
            // Reads a shade deeper than the lid, as silicone does.
            emissive="#000000"
            emissiveIntensity={0.06}
          />
        </mesh>
        {showLabels && (exploded || hovered === 'ring') ? <PartLabel id="ring" y={0} /> : null}
      </group>

      {/* ---- LID ------------------------------------------------------------ */}
      <group
        ref={lidRef}
        position={[0, CLOSED.lid, 0]}
        onPointerOver={hover('lid')}
        onPointerOut={hover(null)}
      >
        <mesh geometry={lidGeometry} castShadow>
          <SoftTouch color={config.lidColor} dark />
        </mesh>
        {/* Raised collar the straw passes through. */}
        <mesh position={[0, DIMS.lidHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[DIMS.collarRadius, DIMS.collarTube, 16, 48]} />
          <SoftTouch color={config.lidColor} />
        </mesh>
        {showLabels && (exploded || hovered === 'lid') ? (
          <PartLabel id="lid" y={DIMS.lidHeight / 2} />
        ) : null}
      </group>

      {/* ---- STRAW ---------------------------------------------------------- */}
      <group
        ref={strawRef}
        position={[0, CLOSED.straw, 0]}
        onPointerOver={hover('straw')}
        onPointerOut={hover(null)}
      >
        <mesh position={[0, DIMS.strawLength / 2 - 0.16, 0]} castShadow>
          <capsuleGeometry args={[DIMS.strawRadius, DIMS.strawLength - 0.09, 6, 24]} />
          <SoftTouch color={config.strawColor} />
        </mesh>
        {showLabels && (exploded || hovered === 'straw') ? (
          <PartLabel id="straw" y={DIMS.strawLength * 0.55} />
        ) : null}
      </group>
    </group>
  )
}

export { product }
