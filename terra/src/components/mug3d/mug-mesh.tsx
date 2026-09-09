'use client'

import * as React from 'react'
import * as THREE from 'three'
import { getBodyColor, getLidColor, getTextColor } from '@/data/product'
import { getAccessory } from '@/data/accessories'
import type { DesignConfig } from '@/types/design'
import {
  bodyProfile,
  chainSpec,
  handleSpec,
  lidProfile,
  mugDims,
  sleeveSpec,
} from './geometry'
import { ensureFontReady, makeTextTexture } from './text-texture'

/** Dispose a three.js resource when the component swaps it out. */
function useDisposable<T extends { dispose: () => void }>(factory: () => T, deps: React.DependencyList) {
  const value = React.useMemo(factory, deps) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => () => value.dispose(), [value])
  return value
}

/**
 * The mug itself: body, lid, optional handle, the curved text decal and the
 * two accessories that have a physical presence.
 *
 * Every part reads straight from the design config, so a colour change is a
 * material prop change — one frame, no reload.
 */
export function MugMesh({ design }: { design: DesignConfig }) {
  const dims = React.useMemo(() => mugDims(design.sizeId, design.placement), [design.sizeId, design.placement])

  const bodyGeometry = useDisposable(() => new THREE.LatheGeometry(bodyProfile(dims), 128), [dims])
  const lidGeometry = useDisposable(() => new THREE.LatheGeometry(lidProfile(dims), 96), [dims])

  const body = getBodyColor(design.bodyColorId)
  const lid = getLidColor(design.lidColorId)
  const textColor = getTextColor(design.textColorId)

  const handle = handleSpec(dims)
  const sleeve = sleeveSpec(dims)
  const chain = chainSpec(dims)

  const showHandle = design.handle && design.sizeId !== '350'
  const showSleeve = design.accessories.some((id) => getAccessory(id)?.render === 'sleeve')
  const showChain = design.accessories.some((id) => getAccessory(id)?.render === 'chain')

  /* ---- the curved text decal -------------------------------------------- */
  const [texture, setTexture] = React.useState<THREE.CanvasTexture | null>(null)
  const sizeScale = { sm: 0.72, md: 1, lg: 1.32 }[design.textSize]

  React.useEffect(() => {
    const text = design.text.trim()
    if (!text) {
      setTexture(null)
      return
    }
    let cancelled = false
    let created: THREE.CanvasTexture | null = null

    ensureFontReady(design.fontId, text).then(() => {
      if (cancelled) return
      created = makeTextTexture({
        text,
        fontId: design.fontId,
        color: textColor.hex,
        sizeScale,
        repeats: dims.band.repeats,
      })
      setTexture(created)
    })

    return () => {
      cancelled = true
      created?.dispose()
    }
  }, [design.text, design.fontId, textColor.hex, sizeScale, dims.band.repeats])

  const bandTop = dims.band.center + dims.band.height / 2
  const bandBottom = dims.band.center - dims.band.height / 2

  // Sit the mug on the ground plane and orbit around its middle.
  const yOffset = -dims.height / 2

  return (
    <group position={[0, yOffset, 0]}>
      {/* Body ------------------------------------------------------------ */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={body.hex}
          // Brushed steel is metal; every powder-coated colour is matte
          // mineral with a hint of sheen, like fired clay.
          metalness={body.finish === 'brushed' ? 0.92 : 0.18}
          roughness={body.finish === 'brushed' ? 0.34 : 0.72}
          envMapIntensity={0.9}
        />
      </mesh>

      {/* Curved engraving ------------------------------------------------ */}
      {texture ? (
        <mesh
          position={[0, dims.band.center, 0]}
          // A three.js cylinder starts its UVs at +Z and wraps round, so the
          // middle of the texture lands on the BACK of the mug. Half a turn
          // brings the engraving to the front, where the camera starts.
          rotation={[0, Math.PI, 0]}
          renderOrder={2}
        >
          <cylinderGeometry
            args={[
              dims.radiusAt(bandTop) + 0.004,
              dims.radiusAt(bandBottom) + 0.004,
              dims.band.height,
              128,
              1,
              true,
            ]}
          />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.02}
            depthWrite={false}
            roughness={0.5}
            metalness={textColor.finish === 'brushed' ? 0.75 : 0.1}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      ) : null}

      {/* Lid ------------------------------------------------------------- */}
      <mesh geometry={lidGeometry} position={[0, dims.height - 0.03, 0]} castShadow>
        <meshStandardMaterial
          color={lid.hex}
          metalness={lid.material === 'bamboo' ? 0.05 : 0.85}
          roughness={lid.material === 'bamboo' ? 0.68 : 0.35}
          envMapIntensity={lid.material === 'bamboo' ? 0.5 : 1.1}
        />
      </mesh>

      {/* Handle ---------------------------------------------------------- */}
      {showHandle ? (
        <mesh
          position={[handle.x, handle.y, 0]}
          rotation={[0, 0, -handle.arc / 2]}
          castShadow
        >
          <torusGeometry args={[handle.radius, handle.tube, 16, 64, handle.arc]} />
          <meshStandardMaterial
            color={body.hex}
            metalness={body.finish === 'brushed' ? 0.9 : 0.2}
            roughness={body.finish === 'brushed' ? 0.36 : 0.7}
          />
        </mesh>
      ) : null}

      {/* Cork sleeve accessory ------------------------------------------- */}
      {showSleeve ? (
        <mesh position={[0, sleeve.center, 0]} castShadow>
          <cylinderGeometry
            args={[sleeve.radiusTop, sleeve.radiusBottom, sleeve.height, 96, 1, true]}
          />
          <meshStandardMaterial
            color={getAccessory('holder')?.hex ?? '#C79A62'}
            roughness={0.95}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}

      {/* Carry chain accessory ------------------------------------------- */}
      {showChain ? (
        <group>
          <mesh position={[chain.ringX, chain.ringY - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[chain.ringRadius, 0.009, 10, 32]} />
            <meshStandardMaterial color="#9DA3A8" metalness={0.95} roughness={0.28} />
          </mesh>
          {chain.positions.map((p, i) => (
            <mesh
              key={i}
              position={[p.x, p.y - 0.06, p.z]}
              rotation={[i % 2 === 0 ? Math.PI / 2 : 0, 0, 0]}
            >
              <torusGeometry args={[chain.linkRadius, chain.linkTube, 8, 20]} />
              <meshStandardMaterial color="#A9AEB2" metalness={0.95} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  )
}
