/**
 * ============================================================================
 * BOTANICAL PARTS
 * ============================================================================
 * The leaf geometry shared by the ambient canopy behind every page and the
 * out-of-focus backdrop behind the product. Both draw the same plant; they
 * differ only in how close the lens is and how far out of focus it is.
 *
 * Everything is generated from a fixed seed at module scope, so the server and
 * the browser draw the identical arrangement and hydration stays quiet.
 * ============================================================================
 */

/** mulberry32 — small, fast, and identical on both sides of the wire. */
export function seeded(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export type Sprig = {
  /** position in a 0–100 viewBox */
  x: number
  y: number
  /** rotation in degrees */
  r: number
  /** scale */
  s: number
  /** opacity multiplier */
  o: number
}

/**
 * Scatter a handful of sprigs, held back from a vertical band down the middle.
 * The middle of every page carries the type, and a background that drifts
 * behind a sentence is a background that has to be ignored — so it stays out
 * of the way instead.
 */
export function scatter(
  seed: number,
  count: number,
  { keepClear = 26, scale = 1 }: { keepClear?: number; scale?: number } = {},
): Sprig[] {
  const rand = seeded(seed)
  return Array.from({ length: count }, () => {
    const side = rand() < 0.5 ? -1 : 1
    const edge = 50 - keepClear
    return {
      x: 50 + side * (keepClear + Math.pow(rand(), 0.65) * edge),
      // Weighted to the top and bottom edges: a canopy above, undergrowth below.
      y: rand() < 0.62 ? Math.pow(rand(), 1.8) * 46 : 100 - Math.pow(rand(), 1.8) * 40,
      r: -95 + rand() * 190,
      s: (0.5 + rand() * 0.6) * scale,
      o: 0.5 + rand() * 0.5,
    }
  })
}

/**
 * One leaf: a lanceolate blade with a slight bend along its length, a midrib
 * and a few laterals. The veins are what make it read as a real leaf once it
 * is blurred — a plain silhouette blurs into a smudge.
 */
export function LeafBlade({
  sprig,
  fill,
  vein,
  veins = true,
}: {
  sprig: Sprig
  fill: string
  vein?: string
  veins?: boolean
}) {
  const len = 17 * sprig.s
  const wid = 4.6 * sprig.s
  const bend = len * 0.16

  const blade =
    `M0 0 ` +
    `C ${len * 0.34} ${-wid - bend * 0.15}, ${len * 0.76} ${-wid * 0.62 - bend * 0.7}, ${len} ${-bend} ` +
    `C ${len * 0.74} ${wid * 0.5 - bend * 0.7}, ${len * 0.32} ${wid - bend * 0.15}, 0 0 Z`

  const midrib = `M0 0 C ${len * 0.36} ${-bend * 0.2}, ${len * 0.7} ${-bend * 0.6}, ${len * 0.97} ${-bend * 0.96}`

  return (
    <g transform={`translate(${sprig.x} ${sprig.y}) rotate(${sprig.r})`} opacity={sprig.o}>
      <path d={blade} fill={fill} />
      {veins ? (
        <g stroke={vein ?? fill} fill="none" opacity={0.5}>
          <path d={midrib} strokeWidth={0.22 * sprig.s} />
          {[0.3, 0.48, 0.66, 0.82].map((at) => (
            <path
              key={at}
              d={`M${len * at} ${-bend * at * 0.9} l ${len * 0.11} ${-wid * 0.5}`}
              strokeWidth={0.13 * sprig.s}
            />
          ))}
          {[0.36, 0.54, 0.72].map((at) => (
            <path
              key={`l${at}`}
              d={`M${len * at} ${-bend * at * 0.9} l ${len * 0.1} ${wid * 0.44}`}
              strokeWidth={0.13 * sprig.s}
            />
          ))}
        </g>
      ) : null}
      {/* the stem it hangs from */}
      <path
        d={`M0 0 l ${-len * 0.42} ${-wid * 0.5}`}
        stroke={fill}
        strokeWidth={0.34 * sprig.s}
        fill="none"
      />
    </g>
  )
}
