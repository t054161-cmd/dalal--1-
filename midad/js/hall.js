/* ═══════════════════════════════════════════════════════════════════
   THE HALL — the library drawn as architecture.
   A receding arcade of shelf bays either side of a nave, a lit
   clerestory arch at the end, brass lamps on the pilasters and a
   polished stone floor. Built as one SVG so it stays crisp at any
   size and costs nothing to animate.
   ═══════════════════════════════════════════════════════════════════ */

const W = 1600, H = 1000;
const VPX = 800, VPY = 560;          /* the vanishing point, on the far wall */
const DEPTHS = [1, 0.66, 0.44];      /* three bays receding from the viewer */

/* deterministic noise, so the library looks the same on every visit */
let seed = 20260910;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

/** One bay of shelving: straight jambs under a semicircular head. */
function bay(x, w, spring, bottom) {
  const r = w / 2;
  return `M${x},${bottom} L${x},${spring} A${r},${r} 0 0 1 ${x + w},${spring} L${x + w},${bottom} Z`;
}

/** A tile of packed spines standing on a shelf board — one per depth. */
function shelfPattern(id, s) {
  const tw = 34 * s, th = 52 * s;
  const spines = [];
  let x = 0;
  while (x < tw - 1) {
    const sw = (2.4 + rnd() * 5.2) * s;
    const hue = [
      'rgba(132,58,34,',
      'rgba(96,80,44,',
      'rgba(58,44,26,',
      'rgba(46,66,52,',
      'rgba(112,74,44,',
      'rgba(74,52,66,',
    ][(rnd() * 6) | 0];
    const a = 0.5 + rnd() * 0.42;
    const top = (3 + rnd() * 5) * s;             /* books are not all the same height */
    spines.push(`<rect x="${x.toFixed(2)}" y="${top.toFixed(2)}" width="${Math.min(sw, tw - x).toFixed(2)}"
      height="${(th - 9 * s - top).toFixed(2)}" fill="${hue}${a.toFixed(2)})"/>`);
    /* a gilt band on some spines, the way a lamp catches lettering */
    if (rnd() > 0.72) spines.push(`<rect x="${(x + sw * 0.2).toFixed(2)}" y="${(top + (th - 9 * s - top) * 0.28).toFixed(2)}"
      width="${(sw * 0.6).toFixed(2)}" height="${(1.1 * s).toFixed(2)}" fill="rgba(255,214,150,.42)"/>`);
    x += sw + 0.5 * s;
  }
  return `
  <pattern id="${id}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" patternUnits="userSpaceOnUse">
    <rect width="${tw.toFixed(2)}" height="${th.toFixed(2)}" fill="#0d0805"/>
    ${spines.join('')}
    <rect y="${(th - 9 * s).toFixed(2)}" width="${tw.toFixed(2)}" height="${(9 * s).toFixed(2)}" fill="#1a1109"/>
    <rect y="${(th - 9 * s).toFixed(2)}" width="${tw.toFixed(2)}" height="${(1.4 * s).toFixed(2)}" fill="rgba(255,196,132,.30)"/>
  </pattern>`;
}

export function hallSVG() {
  const bays = [];      /* geometry, near → far */
  DEPTHS.forEach((s, i) => {
    const bottom = VPY + 440 * s;
    const spring = VPY - 262 * s;
    const w = 420 * s;
    const x = VPX - 960 * s;
    bays.push({ i, s, x, w, spring, bottom });
  });

  const patterns = DEPTHS.map((s, i) => shelfPattern(`shelf${i}`, s)).join('');

  /* every bay, left side then its mirror */
  const openings = bays.map((b) => {
    const mirrorX = W - b.x - b.w;
    const dim = 0.34 + b.s * 0.42;   /* the near bays fall away from the light */
    return [b.x, mirrorX].map((x) => `
      <g class="hall__bay">
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="url(#shelf${b.i})" opacity="${(1.05 - b.s * 0.28).toFixed(2)}"/>
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="url(#bayShade)" opacity="${dim.toFixed(2)}"/>
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="none" stroke="rgba(214,168,98,.30)" stroke-width="${(2.4 * b.s).toFixed(2)}"/>
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="none" stroke="rgba(8,5,3,.9)" stroke-width="${(9 * b.s).toFixed(2)}" transform="translate(0,0)" opacity=".55"/>
      </g>`).join('');
  }).join('');

  /* pilasters with brass capitals, between the bays */
  const piers = bays.map((b) => {
    const pw = 26 * b.s, cap = b.spring;   /* the capital sits where the arch springs */
    return [b.x + b.w, W - b.x - b.w - pw].map((x) => `
      <g>
        <rect x="${x.toFixed(1)}" y="${(cap - b.w / 2).toFixed(1)}"
              width="${pw.toFixed(1)}" height="${(b.bottom - cap + b.w / 2).toFixed(1)}" fill="url(#pier)"/>
        <rect x="${(x - 5 * b.s).toFixed(1)}" y="${cap.toFixed(1)}"
              width="${(pw + 10 * b.s).toFixed(1)}" height="${(8 * b.s).toFixed(1)}" fill="rgba(214,168,98,.30)"/>
        <rect x="${(x - 3 * b.s).toFixed(1)}" y="${(b.bottom - 14 * b.s).toFixed(1)}"
              width="${(pw + 6 * b.s).toFixed(1)}" height="${(14 * b.s).toFixed(1)}" fill="rgba(46,28,14,.92)"/>
      </g>`).join('');
  }).join('');

  /* the lit arch at the end of the nave */
  const navX = 630, navW = 340, navSpring = 300, navTop = navSpring - navW / 2;

  /* brass lamps on the near and middle piers */
  const lamps = bays.slice(0, 2).flatMap((b) => {
    const y = b.spring + 40 * b.s;
    return [b.x + b.w + 13 * b.s, W - b.x - b.w - 13 * b.s].map((x, k) => `
      <g class="hall__lamp" style="animation-delay:${(-b.i * 2.4 - k * 1.3).toFixed(1)}s">
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(84 * b.s).toFixed(1)}" fill="url(#lampGlow)"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(5.5 * b.s).toFixed(1)}" fill="#ffe6ba"/>
      </g>`);
  }).join('');

  /* floor joints running to the vanishing point */
  const joints = [];
  for (let k = -9; k <= 9; k++) {
    const x = VPX + k * 190;
    joints.push(`<line x1="${VPX + k * 34}" y1="${VPY}" x2="${x}" y2="${H}" stroke="rgba(255,226,180,.075)" stroke-width="1.4"/>`);
  }
  for (let k = 1; k <= 7; k++) {
    const y = VPY + (H - VPY) * (k / 7) ** 2.1;
    joints.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="rgba(255,226,180,.06)" stroke-width="1.2"/>`);
  }

  return `
<svg class="hall__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    ${patterns}
    <linearGradient id="air" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#241708"/>
      <stop offset="42%"  stop-color="#150e07"/>
      <stop offset="100%" stop-color="#080604"/>
    </linearGradient>
    <linearGradient id="pier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#1a1008"/>
      <stop offset="34%"  stop-color="#4a2f18"/>
      <stop offset="62%"  stop-color="#2a1a0e"/>
      <stop offset="100%" stop-color="#100a06"/>
    </linearGradient>
    <linearGradient id="bayShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000" stop-opacity=".82"/>
      <stop offset="34%"  stop-color="#000" stop-opacity=".26"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".72"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#5c3b1e" stop-opacity=".9"/>
      <stop offset="40%"  stop-color="#22150b" stop-opacity=".96"/>
      <stop offset="100%" stop-color="#070504"/>
    </linearGradient>
    <radialGradient id="lampGlow">
      <stop offset="0%"   stop-color="#ffc477" stop-opacity=".52"/>
      <stop offset="42%"  stop-color="#ff9e3c" stop-opacity=".16"/>
      <stop offset="100%" stop-color="#ff9e3c" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="navLight" cx="50%" cy="62%" r="58%">
      <stop offset="0%"   stop-color="#ffeccb" stop-opacity=".52"/>
      <stop offset="44%"  stop-color="#f0b269" stop-opacity=".24"/>
      <stop offset="100%" stop-color="#c9762c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sides" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#050302" stop-opacity=".84"/>
      <stop offset="18%"  stop-color="#050302" stop-opacity=".46"/>
      <stop offset="40%"  stop-color="#050302" stop-opacity=".06"/>
      <stop offset="60%"  stop-color="#050302" stop-opacity=".06"/>
      <stop offset="82%"  stop-color="#050302" stop-opacity=".46"/>
      <stop offset="100%" stop-color="#050302" stop-opacity=".84"/>
    </linearGradient>
    <radialGradient id="nave" cx="50%" cy="14%" r="74%">
      <stop offset="0%"   stop-color="#ffd8a2" stop-opacity=".16"/>
      <stop offset="48%"  stop-color="#c9762c" stop-opacity=".07"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#air)"/>

  <!-- the floor of the nave -->
  <rect y="${VPY}" width="${W}" height="${H - VPY}" fill="url(#floor)"/>
  <g>${joints.join('')}</g>
  <ellipse cx="${VPX}" cy="${VPY + 180}" rx="360" ry="150" fill="url(#lampGlow)" opacity=".7"/>

  <!-- the arch at the end of the nave, and the light coming through it -->
  <g>
    <path d="${bay(navX, navW, navSpring, VPY + 6)}" fill="#0b0704"/>
    <path d="${bay(navX, navW, navSpring, VPY + 6)}" fill="url(#navLight)"/>
    <g stroke="rgba(34,20,10,.82)" stroke-width="5">
      <line x1="${navX + navW / 2}" y1="${navTop + 8}" x2="${navX + navW / 2}" y2="${VPY}"/>
      <line x1="${navX + 26}" y1="${navSpring - 30}" x2="${navX + navW - 26}" y2="${navSpring - 30}"/>
      <line x1="${navX + 6}" y1="${navSpring + 66}" x2="${navX + navW - 6}" y2="${navSpring + 66}"/>
      <line x1="${navX + 6}" y1="${navSpring + 162}" x2="${navX + navW - 6}" y2="${navSpring + 162}"/>
    </g>
    <rect x="${navX - 16}" y="${VPY - 4}" width="${navW + 32}" height="14" fill="rgba(58,36,18,.95)"/>
    <rect x="${navX - 16}" y="${VPY - 4}" width="${navW + 32}" height="3" fill="rgba(226,180,110,.35)"/>
    <path d="${bay(navX, navW, navSpring, VPY + 6)}" fill="none" stroke="rgba(222,176,104,.42)" stroke-width="4"/>
  </g>

  <!-- the arcade, far bays first so the near ones overlap them -->
  <g>${openings}</g>
  <g>${piers}</g>
  <g>${lamps}</g>

  <!-- the light belongs to the nave; the aisles fall into shadow -->
  <rect width="${W}" height="${H}" fill="url(#sides)"/>
  <rect width="${W}" height="${H}" fill="url(#nave)"/>
</svg>`;
}
