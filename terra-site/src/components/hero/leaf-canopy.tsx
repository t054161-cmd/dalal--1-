/**
 * ============================================================================
 * THE CANOPY
 * ============================================================================
 * The hero's background: sunlight moving through leaves, slowly.
 *
 * If real footage is available it plays on top — drop an mp4 at
 * /media/hero-leaves.mp4 (and a poster at /images/hero-poster.jpg) and it is
 * used automatically. Until then this canopy carries the shot: three depth
 * layers of leaves that sway on their own timing, a drifting shaft of light,
 * and grain. All SVG and CSS — no video weight, no network.
 *
 * Leaf placement is generated from a fixed seed at module scope, so the server
 * and the browser draw exactly the same canopy.
 * ============================================================================
 */

function seeded(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

type Leaf = { x: number; y: number; r: number; s: number; o: number }

/**
 * One cluster, hanging from the top of the frame and pushed out towards the
 * edges: the middle of the shot belongs to the title, not to the leaves.
 */
function layer(seed: number, count: number, spread: number, scale: number): Leaf[] {
  const rand = seeded(seed)
  return Array.from({ length: count }, () => {
    const side = rand() < 0.5 ? -1 : 1
    // Bias x away from the centre column.
    const x = 50 + side * (16 + Math.pow(rand(), 0.7) * 42)
    return {
      x,
      // Strongly weighted to the top — a canopy, seen from underneath.
      y: Math.pow(rand(), 2.3) * spread,
      r: -70 + rand() * 140,
      s: (0.42 + rand() * 0.5) * scale,
      o: 0.42 + rand() * 0.42,
    }
  })
}

const BACK = layer(11, 22, 74, 1)
const MID = layer(29, 15, 52, 0.9)
const FRONT = layer(47, 8, 30, 0.8)

function LeafShape({ leaf, fill }: { leaf: Leaf; fill: string }) {
  const w = 15 * leaf.s
  const h = 5.4 * leaf.s
  return (
    <g transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(1)`} opacity={leaf.o}>
      {/* A single olive-shaped leaf with a midrib. */}
      <path
        d={`M0 0 Q ${w * 0.45} ${-h} ${w} 0 Q ${w * 0.45} ${h} 0 0 Z`}
        fill={fill}
      />
      <path
        d={`M${w * 0.06} 0 L ${w * 0.92} 0`}
        stroke="rgb(43 52 44 / 0.25)"
        strokeWidth={0.22 * leaf.s}
        fill="none"
      />
      {/* the twig it hangs from */}
      <path d={`M0 0 L ${-w * 0.5} ${-h * 0.35}`} stroke={fill} strokeWidth={0.4 * leaf.s} />
    </g>
  )
}

/**
 * Footage is opt-in: with no file present a <video> tag would 404 on every
 * load and log errors, so it is only rendered once NEXT_PUBLIC_HERO_VIDEO=1
 * tells us the file is really there.
 */
const HAS_FOOTAGE = process.env.NEXT_PUBLIC_HERO_VIDEO === '1'

export function LeafCanopy({ withVideo = HAS_FOOTAGE }: { withVideo?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Ground tone: morning light through green. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(168deg, rgb(var(--linen)) 0%, rgb(var(--linen)) 26%, rgb(var(--sage) / 0.72) 68%, rgb(var(--smoke) / 0.86) 100%)',
        }}
      />

      {/* Back layer — far, soft, slow. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full animate-sway-a blur-[3.5px]"
      >
        <g>
          {BACK.map((leaf, i) => (
            <LeafShape key={i} leaf={leaf} fill="rgb(78 92 72 / 0.55)" />
          ))}
        </g>
      </svg>

      {/* Mid layer. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full animate-sway-b blur-[1.4px]"
      >
        <g>
          {MID.map((leaf, i) => (
            <LeafShape key={i} leaf={leaf} fill="rgb(58 74 55 / 0.72)" />
          ))}
        </g>
      </svg>

      {/* Front layer — sharp, dark, close to the lens. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full animate-sway-a"
        style={{ animationDuration: '27s' }}
      >
        <g>
          {FRONT.map((leaf, i) => (
            <LeafShape key={i} leaf={leaf} fill="rgb(38 50 38 / 0.82)" />
          ))}
        </g>
      </svg>

      {/* Real footage, when it exists — see HAS_FOOTAGE above. */}
      {withVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-soft-light"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero/hero-leaves-poster.svg"
        >
          <source src="/media/hero-leaves.mp4" type="video/mp4" />
          <source src="/media/hero-leaves.webm" type="video/webm" />
        </video>
      ) : null}

      {/* A calm, brighter field behind the title. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 38% at 50% 46%, rgb(240 236 227 / 0.5), transparent 72%)',
        }}
      />

      {/* Sunlight, drifting. */}
      <div
        className="absolute inset-0 animate-light-drift mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(38% 30% at 22% 12%, rgb(255 250 235 / 0.95), transparent 70%), radial-gradient(30% 26% at 76% 4%, rgb(255 246 226 / 0.7), transparent 72%)',
        }}
      />

      {/* Dappled shadow pools on the ground plane. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgb(43 52 44 / 0.42), transparent 70%)',
        }}
      />

      {/* Vignette + grain, so type always sits on something quiet. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(78% 62% at 50% 44%, transparent 30%, rgb(43 52 44 / 0.26) 100%)',
        }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--grain)', opacity: 0.7 }} />
    </div>
  )
}
