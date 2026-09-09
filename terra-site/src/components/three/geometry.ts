/**
 * ============================================================================
 * THE TUMBLER — generated in code
 * ============================================================================
 * The silhouette is held to the product reference: a tall, slim, straight-sided
 * cylinder with a softly rounded bottom, a flat cylindrical lid slightly wider
 * than the body, a clean horizontal seam between them, and one straight straw
 * rising from the centre of the lid. No handle, no taper, no flare.
 *
 * Scene units: 1 unit ≈ 89 mm, so the real 205 mm cup is ~2.3 units tall.
 * ============================================================================
 */

import * as THREE from 'three'

export const DIMS = {
  /** Outer body */
  bodyHeight: 2.3,
  bodyRadius: 0.4,
  /** How softly the base rolls under — the reference's rounded bottom. */
  bottomFillet: 0.075,
  wall: 0.045,

  /** Lid: flat, cylindrical, and a touch wider than the body. */
  lidHeight: 0.2,
  lidRadius: 0.425,
  /** The visible gap that reads as the seam between lid and body. */
  seam: 0.014,

  /** Silicone ring, tucked under the lid. */
  ringHeight: 0.055,
  ringRadius: 0.372,

  /** Stainless inner layer, seen at the mouth once the lid lifts away. */
  innerHeight: 0.26,

  /** One straight straw, dead centre. */
  strawRadius: 0.046,
  strawLength: 1.02,
  /** Raised collar the straw passes through. */
  collarRadius: 0.066,
  collarTube: 0.021,
} as const

/** Where the straw tip sits when the cup is closed. */
export const STRAW_TIP =
  DIMS.bodyHeight + DIMS.seam + DIMS.lidHeight + DIMS.strawLength - 0.16 + DIMS.strawRadius

/**
 * The height the camera has to frame: base to straw tip. Everything that
 * frames the object — the group offset, the camera distance — is derived from
 * this, so the straw is never cropped.
 */
export const OBJECT_HEIGHT = STRAW_TIP

/**
 * Outer body: flat base, rolled bottom edge, dead-straight sides, a small
 * round at the mouth, then back down the inside so the cup reads as hollow
 * when the lid is lifted.
 */
export function bodyProfile(): THREE.Vector2[] {
  const { bodyHeight: H, bodyRadius: R, bottomFillet: F, wall } = DIMS
  const points: THREE.Vector2[] = []

  points.push(new THREE.Vector2(0.001, 0))
  points.push(new THREE.Vector2(R - F, 0))

  // Softly rounded bottom.
  const steps = 9
  for (let i = 1; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2)
    points.push(new THREE.Vector2(R - F + Math.sin(a) * F, F - Math.cos(a) * F))
  }

  // Straight vertical side — the defining line of this cup. Sampled a few
  // times so the shading stays even from base to mouth.
  points.push(new THREE.Vector2(R, F + 0.02))
  points.push(new THREE.Vector2(R, H * 0.4))
  points.push(new THREE.Vector2(R, H - 0.03))

  // A whisper of a round at the mouth, never a lip or a flare.
  for (let i = 1; i <= 3; i++) {
    const a = (i / 3) * (Math.PI / 2)
    points.push(new THREE.Vector2(R - 0.022 + Math.cos(a) * 0.022, H - 0.03 + Math.sin(a) * 0.03))
  }

  // Inner wall back down to the floor.
  points.push(new THREE.Vector2(R - wall, H - 0.05))
  points.push(new THREE.Vector2(R - wall, wall + 0.02))
  points.push(new THREE.Vector2(R - wall - 0.05, wall))
  points.push(new THREE.Vector2(0.001, wall))

  return points
}

/**
 * Lid: a flat cylinder, slightly wider than the body, with a soft top edge and
 * a short skirt that drops into the mouth.
 */
export function lidProfile(): THREE.Vector2[] {
  const { lidHeight: LH, lidRadius: LR, bodyRadius: R, collarRadius } = DIMS
  const points: THREE.Vector2[] = []

  // Skirt that sits inside the cup mouth.
  points.push(new THREE.Vector2(0.001, -0.055))
  points.push(new THREE.Vector2(R - 0.055, -0.055))
  points.push(new THREE.Vector2(R - 0.035, -0.03))

  // Underside out to the overhang. Duplicated points give the lathe a hard
  // corner instead of averaging the normals into a dome.
  points.push(new THREE.Vector2(LR - 0.015, 0))
  points.push(new THREE.Vector2(LR, 0.014))
  points.push(new THREE.Vector2(LR, 0.014))

  // Straight wall, sampled so the normals stay vertical.
  points.push(new THREE.Vector2(LR, LH * 0.45))
  points.push(new THREE.Vector2(LR, LH - 0.026))

  // A whisper of a round on the top edge — 2.6 mm, no more.
  for (let i = 1; i <= 4; i++) {
    const a = (i / 4) * (Math.PI / 2)
    points.push(
      new THREE.Vector2(LR - 0.026 + Math.cos(a) * 0.026, LH - 0.026 + Math.sin(a) * 0.026),
    )
  }

  // Flat top, in to the straw collar.
  points.push(new THREE.Vector2(LR - 0.026, LH))
  points.push(new THREE.Vector2(collarRadius, LH))

  return points
}

/** Y positions of every part when the cup is closed. */
export const CLOSED = {
  body: 0,
  ring: DIMS.bodyHeight - DIMS.ringHeight * 0.35,
  lid: DIMS.bodyHeight + DIMS.seam,
  straw: DIMS.bodyHeight + DIMS.seam + DIMS.lidHeight,
}

/**
 * Y positions when the cup is exploded — even, deliberate spacing, straight up,
 * exactly like the reference sheet's anatomy panel.
 */
export const EXPLODED = {
  body: -0.28,
  ring: CLOSED.ring + 0.5,
  lid: CLOSED.lid + 0.72,
  straw: CLOSED.straw + 1.18,
}
