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
const reseed = () => { seed = 20260910; };

/* ── the two lightings of the same room ───────────────────────────── */
const PALETTE = {
  night: {
    air:    ['#241708', '#150e07', '#080604'],
    pier:   ['#1a1008', '#4a2f18', '#2a1a0e', '#100a06'],
    shade:  ['.82', '.26', '.72', '#000'],
    floor:  ['#5c3b1e', '#22150b', '#070504'],
    bayBase:'#0d0805',
    board:  ['#1a1109', 'rgba(255,196,132,.30)'],
    spines: ['rgba(132,58,34,', 'rgba(96,80,44,', 'rgba(58,44,26,', 'rgba(46,66,52,', 'rgba(112,74,44,', 'rgba(74,52,66,'],
    gilt:   'rgba(255,214,150,.42)',
    navLight: [['#ffeccb', '.52'], ['#f0b269', '.24'], ['#c9762c', '0']],
    mullion:  'rgba(34,20,10,.82)',
    sill:     ['rgba(58,36,18,.95)', 'rgba(226,180,110,.35)'],
    arch:     'rgba(222,176,104,.42)',
    edge:     'rgba(214,168,98,.30)',
    cap:      'rgba(214,168,98,.30)',
    plinth:   'rgba(46,28,14,.92)',
    lamp:     [['#ffc477', '.52'], ['#ff9e3c', '.16']],
    bulb:     '#ffe6ba',
    joints:   ['rgba(255,226,180,.075)', 'rgba(255,226,180,.06)'],
    sides:    ['#050302', ['.84', '.46', '.06']],
    nave:     [['#ffd8a2', '.16'], ['#c9762c', '.07']],
    lampOn:   true,
  },
  day: {
    /* the shutters are open: the wood keeps its weight, the air goes bright */
    air:    ['#f7ead1', '#ecdab6', '#d5bd93'],
    pier:   ['#6b4a2b', '#c2a071', '#8f6f49', '#5c4227'],
    shade:  ['.58', '.16', '.46', '#4a3218'],
    floor:  ['#d9bd8f', '#bb9e70', '#93764f'],
    bayBase:'#2e1d0e',
    board:  ['#4e341c', 'rgba(255,244,214,.62)'],
    spines: ['rgba(150,66,38,', 'rgba(132,110,58,', 'rgba(84,62,34,', 'rgba(58,90,68,', 'rgba(148,98,54,', 'rgba(98,66,90,'],
    gilt:   'rgba(255,232,176,.62)',
    navLight: [['#ffffff', '.86'], ['#fff6e2', '.52'], ['#ffe9bd', '0']],
    mullion:  'rgba(96,70,40,.55)',
    sill:     ['rgba(150,116,74,.9)', 'rgba(255,238,198,.5)'],
    arch:     'rgba(146,108,58,.5)',
    edge:     'rgba(140,104,56,.36)',
    cap:      'rgba(160,120,64,.42)',
    plinth:   'rgba(128,96,60,.75)',
    lamp:     [['#ffd9a0', '.16'], ['#ffbe70', '.05']],
    bulb:     '#fff3d6',
    joints:   ['rgba(120,92,56,.14)', 'rgba(120,92,56,.10)'],
    sides:    ['#7a6038', ['.40', '.20', '.03']],
    nave:     [['#fffaf0', '.20'], ['#ffe6bb', '.08']],
    lampOn:   false,
  },
};

/** One bay of shelving: straight jambs under a semicircular head. */
function bay(x, w, spring, bottom) {
  const r = w / 2;
  return `M${x},${bottom} L${x},${spring} A${r},${r} 0 0 1 ${x + w},${spring} L${x + w},${bottom} Z`;
}

/** A tile of packed spines standing on a shelf board — one per depth. */
function shelfPattern(id, s, P) {
  const tw = 34 * s, th = 52 * s;
  const spines = [];
  let x = 0;
  while (x < tw - 1) {
    const sw = (2.4 + rnd() * 5.2) * s;
    const hue = P.spines[(rnd() * 6) | 0];
    const a = 0.5 + rnd() * 0.42;
    const top = (3 + rnd() * 5) * s;             /* books are not all the same height */
    spines.push(`<rect x="${x.toFixed(2)}" y="${top.toFixed(2)}" width="${Math.min(sw, tw - x).toFixed(2)}"
      height="${(th - 9 * s - top).toFixed(2)}" fill="${hue}${a.toFixed(2)})"/>`);
    /* a gilt band on some spines, the way a lamp catches lettering */
    if (rnd() > 0.72) spines.push(`<rect x="${(x + sw * 0.2).toFixed(2)}" y="${(top + (th - 9 * s - top) * 0.28).toFixed(2)}"
      width="${(sw * 0.6).toFixed(2)}" height="${(1.1 * s).toFixed(2)}" fill="${P.gilt}"/>`);
    x += sw + 0.5 * s;
  }
  return `
  <pattern id="${id}" width="${tw.toFixed(2)}" height="${th.toFixed(2)}" patternUnits="userSpaceOnUse">
    <rect width="${tw.toFixed(2)}" height="${th.toFixed(2)}" fill="${P.bayBase}"/>
    ${spines.join('')}
    <rect y="${(th - 9 * s).toFixed(2)}" width="${tw.toFixed(2)}" height="${(9 * s).toFixed(2)}" fill="${P.board[0]}"/>
    <rect y="${(th - 9 * s).toFixed(2)}" width="${tw.toFixed(2)}" height="${(1.4 * s).toFixed(2)}" fill="${P.board[1]}"/>
  </pattern>`;
}

export function hallSVG(theme = 'night') {
  const P = PALETTE[theme] || PALETTE.night;
  reseed();
  const bays = [];      /* geometry, near → far */
  DEPTHS.forEach((s, i) => {
    const bottom = VPY + 440 * s;
    const spring = VPY - 262 * s;
    const w = 420 * s;
    const x = VPX - 960 * s;
    bays.push({ i, s, x, w, spring, bottom });
  });

  const patterns = DEPTHS.map((s, i) => shelfPattern(`shelf${i}`, s, P)).join('');

  /* every bay, left side then its mirror */
  const openings = bays.map((b) => {
    const mirrorX = W - b.x - b.w;
    const dim = 0.34 + b.s * 0.42;   /* the near bays fall away from the light */
    return [b.x, mirrorX].map((x) => `
      <g class="hall__bay">
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="url(#shelf${b.i})" opacity="${(1.05 - b.s * 0.28).toFixed(2)}"/>
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="url(#bayShade)" opacity="${dim.toFixed(2)}"/>
        <path d="${bay(x, b.w, b.spring, b.bottom)}" fill="none" stroke="${P.edge}" stroke-width="${(2.4 * b.s).toFixed(2)}"/>
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
              width="${(pw + 6 * b.s).toFixed(1)}" height="${(14 * b.s).toFixed(1)}" fill="${P.plinth}"/>
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
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(5.5 * b.s).toFixed(1)}" fill="${P.bulb}"/>
      </g>`);
  }).join('');

  /* floor joints running to the vanishing point */
  const joints = [];
  for (let k = -9; k <= 9; k++) {
    const x = VPX + k * 190;
    joints.push(`<line x1="${VPX + k * 34}" y1="${VPY}" x2="${x}" y2="${H}" stroke="${P.joints[0]}" stroke-width="1.4"/>`);
  }
  for (let k = 1; k <= 7; k++) {
    const y = VPY + (H - VPY) * (k / 7) ** 2.1;
    joints.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${P.joints[1]}" stroke-width="1.2"/>`);
  }

  return `
<svg class="hall__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    ${patterns}
    <linearGradient id="air" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${P.air[0]}"/>
      <stop offset="42%"  stop-color="${P.air[1]}"/>
      <stop offset="100%" stop-color="${P.air[2]}"/>
    </linearGradient>
    <linearGradient id="pier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${P.pier[0]}"/>
      <stop offset="34%"  stop-color="${P.pier[1]}"/>
      <stop offset="62%"  stop-color="${P.pier[2]}"/>
      <stop offset="100%" stop-color="${P.pier[3]}"/>
    </linearGradient>
    <linearGradient id="bayShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${P.shade[3]}" stop-opacity="${P.shade[0]}"/>
      <stop offset="34%"  stop-color="${P.shade[3]}" stop-opacity="${P.shade[1]}"/>
      <stop offset="100%" stop-color="${P.shade[3]}" stop-opacity="${P.shade[2]}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${P.floor[0]}" stop-opacity=".9"/>
      <stop offset="40%"  stop-color="${P.floor[1]}" stop-opacity=".96"/>
      <stop offset="100%" stop-color="${P.floor[2]}"/>
    </linearGradient>
    <radialGradient id="lampGlow">
      <stop offset="0%"   stop-color="${P.lamp[0][0]}" stop-opacity="${P.lamp[0][1]}"/>
      <stop offset="42%"  stop-color="${P.lamp[1][0]}" stop-opacity="${P.lamp[1][1]}"/>
      <stop offset="100%" stop-color="${P.lamp[1][0]}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="navLight" cx="50%" cy="62%" r="58%">
      <stop offset="0%"   stop-color="${P.navLight[0][0]}" stop-opacity="${P.navLight[0][1]}"/>
      <stop offset="44%"  stop-color="${P.navLight[1][0]}" stop-opacity="${P.navLight[1][1]}"/>
      <stop offset="100%" stop-color="${P.navLight[2][0]}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sides" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${P.sides[0]}" stop-opacity="${P.sides[1][0]}"/>
      <stop offset="18%"  stop-color="${P.sides[0]}" stop-opacity="${P.sides[1][1]}"/>
      <stop offset="40%"  stop-color="${P.sides[0]}" stop-opacity="${P.sides[1][2]}"/>
      <stop offset="60%"  stop-color="${P.sides[0]}" stop-opacity="${P.sides[1][2]}"/>
      <stop offset="82%"  stop-color="${P.sides[0]}" stop-opacity="${P.sides[1][1]}"/>
      <stop offset="100%" stop-color="${P.sides[0]}" stop-opacity="${P.sides[1][0]}"/>
    </linearGradient>
    <radialGradient id="nave" cx="50%" cy="14%" r="74%">
      <stop offset="0%"   stop-color="${P.nave[0][0]}" stop-opacity="${P.nave[0][1]}"/>
      <stop offset="48%"  stop-color="${P.nave[1][0]}" stop-opacity="${P.nave[1][1]}"/>
      <stop offset="100%" stop-color="${P.nave[1][0]}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#air)"/>

  <!-- the floor of the nave -->
  <rect y="${VPY}" width="${W}" height="${H - VPY}" fill="url(#floor)"/>
  <g>${joints.join('')}</g>
  <ellipse cx="${VPX}" cy="${VPY + 180}" rx="360" ry="150" fill="url(#lampGlow)" opacity=".7"/>

  <!-- the arch at the end of the nave, and the light coming through it -->
  <g>
    <path d="${bay(navX, navW, navSpring, VPY + 6)}" fill="${P.bayBase}"/>
    <path d="${bay(navX, navW, navSpring, VPY + 6)}" fill="url(#navLight)"/>
    <g stroke="${P.mullion}" stroke-width="5">
      <line x1="${navX + navW / 2}" y1="${navTop + 8}" x2="${navX + navW / 2}" y2="${VPY}"/>
      <line x1="${navX + 26}" y1="${navSpring - 30}" x2="${navX + navW - 26}" y2="${navSpring - 30}"/>
      <line x1="${navX + 6}" y1="${navSpring + 66}" x2="${navX + navW - 6}" y2="${navSpring + 66}"/>
      <line x1="${navX + 6}" y1="${navSpring + 162}" x2="${navX + navW - 6}" y2="${navSpring + 162}"/>
    </g>
    <rect x="${navX - 16}" y="${VPY - 4}" width="${navW + 32}" height="14" fill="${P.sill[0]}"/>
    <rect x="${navX - 16}" y="${VPY - 4}" width="${navW + 32}" height="3" fill="${P.sill[1]}"/>
    <path d="${bay(navX, navW, navSpring, VPY + 6)}" fill="none" stroke="${P.arch}" stroke-width="4"/>
  </g>

  <!-- the arcade, far bays first so the near ones overlap them -->
  <g>${openings}</g>
  <g>${piers}</g>
  ${P.lampOn ? `<g>${lamps}</g>` : `<g opacity=".35">${lamps}</g>`}

  <!-- the light belongs to the nave; the aisles fall into shadow -->
  <rect width="${W}" height="${H}" fill="url(#sides)"/>
  <rect width="${W}" height="${H}" fill="url(#nave)"/>
</svg>`;
}
