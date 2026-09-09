/**
 * Procedural mug geometry.
 *
 * Nothing is loaded from a model file: the body, rim, lid, handle and the two
 * accessories are all generated from the size data in src/data/product.ts, so
 * the mug stays a few kilobytes and is fully recolourable.
 */

import * as THREE from 'three'
import { getSize } from '@/data/product'
import type { Placement, SizeId } from '@/types/design'

/** Millimetres → scene units. A 500 ml mug ends up about 1.85 units tall. */
const MM = 0.01

export type MugDims = {
  height: number
  radiusTop: number
  radiusBottom: number
  /** Vertical centre and height of the printable band, in scene units. */
  band: { center: number; height: number; repeats: number }
  /** Radius of the body at a given height (the body is tapered). */
  radiusAt: (y: number) => number
}

const BANDS: Record<Placement, { center: number; height: number; repeats: number }> = {
  // Fractions of body height. The lower band stops above the cork sleeve
  // (see sleeveSpec) so an add-on never covers the engraving.
  center: { center: 0.58, height: 0.28, repeats: 1 },
  lower: { center: 0.36, height: 0.18, repeats: 1 },
  wrap: { center: 0.54, height: 0.24, repeats: 4 },
}

export function mugDims(sizeId: SizeId, placement: Placement): MugDims {
  const size = getSize(sizeId)
  const height = size.heightMm * MM
  const radiusTop = (size.diameterMm / 2) * MM
  // Every TERRA tapers ~8% towards the base — it is what makes it sit in a
  // cup holder and what gives the silhouette its shape.
  const radiusBottom = radiusTop * 0.9

  const band = BANDS[placement]

  return {
    height,
    radiusTop,
    radiusBottom,
    band: {
      center: band.center * height,
      height: band.height * height,
      repeats: band.repeats,
    },
    radiusAt: (y: number) => {
      const t = THREE.MathUtils.clamp(y / height, 0, 1)
      return THREE.MathUtils.lerp(radiusBottom, radiusTop, t)
    },
  }
}

/**
 * Lathe profile for the body: filleted base, tapered wall, rounded rim, and an
 * inner wall so the mug reads as hollow when you look into it.
 */
export function bodyProfile(dims: MugDims): THREE.Vector2[] {
  const { height: h, radiusTop: rt, radiusBottom: rb } = dims
  const points: THREE.Vector2[] = []
  const wall = 0.035

  // Base, with a small fillet so it does not look like a cut pipe.
  points.push(new THREE.Vector2(0.001, 0))
  points.push(new THREE.Vector2(rb * 0.55, 0))
  points.push(new THREE.Vector2(rb * 0.9, 0.004))
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2)
    points.push(new THREE.Vector2(rb - 0.018 + Math.sin(a) * 0.018, 0.004 + (1 - Math.cos(a)) * 0.02))
  }

  // Tapered outer wall.
  const steps = 10
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const y = THREE.MathUtils.lerp(0.024, h - 0.05, t)
    points.push(new THREE.Vector2(THREE.MathUtils.lerp(rb, rt, y / h), y))
  }

  // Rounded rim, rolled over to the inside.
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI
    points.push(new THREE.Vector2(rt - 0.012 + Math.cos(a) * 0.012, h - 0.012 + Math.sin(a) * 0.012))
  }

  // Inner wall, back down to the inner floor.
  for (let i = 1; i <= 6; i++) {
    const t = i / 6
    const y = THREE.MathUtils.lerp(h - 0.012, wall + 0.02, t)
    points.push(new THREE.Vector2(THREE.MathUtils.lerp(rt, rb, 1 - y / h) - wall, y))
  }
  points.push(new THREE.Vector2(0.001, wall + 0.015))

  return points
}

/** Lathe profile for the lid: a lip that sits inside the rim, a rounded top. */
export function lidProfile(dims: MugDims): THREE.Vector2[] {
  const rt = dims.radiusTop
  const points: THREE.Vector2[] = []

  points.push(new THREE.Vector2(0.001, 0))
  points.push(new THREE.Vector2(rt - 0.05, 0)) // underside
  points.push(new THREE.Vector2(rt - 0.035, 0.03))
  points.push(new THREE.Vector2(rt + 0.006, 0.05)) // overhang past the rim
  points.push(new THREE.Vector2(rt + 0.01, 0.1))
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2)
    points.push(
      new THREE.Vector2(
        (rt + 0.01) * Math.cos(a * 0.92),
        0.1 + Math.sin(a) * 0.07,
      ),
    )
  }
  points.push(new THREE.Vector2(0.001, 0.172))

  return points
}

/** Where the handle sits, and how big it is, for a given size. */
export function handleSpec(dims: MugDims) {
  const radius = dims.height * 0.16
  return {
    radius,
    tube: 0.026,
    /** Attachment height, centred on the upper third of the body. */
    y: dims.height * 0.58,
    x: dims.radiusAt(dims.height * 0.58) + radius * 0.3,
    arc: Math.PI * 1.15,
  }
}

/** Cork sleeve accessory: an open cylinder hugging the taper. */
export function sleeveSpec(dims: MugDims) {
  // Low on the body: that is where a hand holds it, and it keeps the sleeve
  // clear of every text band.
  const height = dims.height * 0.22
  const center = dims.height * 0.16
  return {
    height,
    center,
    radiusTop: dims.radiusAt(center + height / 2) + 0.012,
    radiusBottom: dims.radiusAt(center - height / 2) + 0.012,
  }
}

/** Carry chain accessory: a ring on the lid plus a drooping run of links. */
export function chainSpec(dims: MugDims) {
  const links = 9
  const top = dims.height + 0.1
  const x = dims.radiusTop * 0.55
  return {
    links,
    linkRadius: 0.032,
    linkTube: 0.009,
    /** Positions along a shallow catenary hanging off the lid. */
    positions: Array.from({ length: links }, (_, i) => {
      const t = i / (links - 1)
      return new THREE.Vector3(
        THREE.MathUtils.lerp(x, x + 0.16, t),
        top - Math.sin(t * Math.PI) * 0.16 - t * 0.06,
        0,
      )
    }),
    ringRadius: 0.05,
    ringY: top,
    ringX: x,
  }
}
