/* ═══════════════════════════════════════════════════════════════════════
   IMAGERY — every photograph on the site is drawn, not downloaded.

   Each space gets a deterministic, seeded SVG interior in the Sage / Sand /
   Cloud / Vanilla palette: window light, floor plane, furniture silhouettes,
   a foreground element for depth, then vignette and film grain. Nothing is
   fetched, so the "photography" is instant on any connection.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const P = FS.CONFIG.palette;

  /* ── seeded random ─────────────────────────────────────────────────── */
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed) {
    let a = hash(String(seed));
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── palette moods ─────────────────────────────────────────────────── */
  const MOODS = {
    offices: [
      { wallTop: P.cloud,   wallBot: P.sage100, light: '#FFF6E3', floor: P.sandDeep, form: P.sage700, formDeep: P.sage900, accent: P.sand },
      { wallTop: P.sage100, wallBot: P.cloudDeep, light: '#FDF3DF', floor: P.sandDeep, form: P.sage700, formDeep: P.sage900, accent: P.vanillaDeep }
    ],
    halls: [
      { wallTop: P.sage300, wallBot: P.sage700, light: '#FFF3D8', floor: P.sage900, form: P.sage900, formDeep: '#1D2621', accent: P.sand },
      { wallTop: P.cloudDeep, wallBot: P.sage700, light: '#FFF8E8', floor: P.sage900, form: P.sage900, formDeep: '#1D2621', accent: P.vanillaDeep }
    ],
    cafes: [
      { wallTop: P.vanilla, wallBot: P.sand,  light: '#FFF1D2', floor: '#8A6F53', form: '#6B5238', formDeep: '#3E3025', accent: P.sage500 },
      { wallTop: P.vanillaDeep, wallBot: P.sandDeep, light: '#FFEFCB', floor: '#7C6247', form: '#5E4A34', formDeep: '#372B20', accent: P.sage700 }
    ]
  };
  const esc = s => s.replace(/#/g, '%23').replace(/"/g, "'").replace(/</g, '%3C').replace(/>/g, '%3E')
                    .replace(/&/g, '%26').replace(/\n/g, '');

  /* ── scene builders ────────────────────────────────────────────────── */

  function windows(r, m, W, H, count) {
    let s = '';
    const top = H * 0.10, h = H * 0.46;
    const gap = W / count;
    for (let i = 0; i < count; i++) {
      const x = gap * i + gap * 0.16;
      const w = gap * 0.68;
      s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(w * 0.02).toFixed(1)}" fill="url(#glass)"/>`;
      s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(w * 0.02).toFixed(1)}" fill="none" stroke="${m.formDeep}" stroke-opacity=".35" stroke-width="2.5"/>`;
      s += `<line x1="${(x + w / 2).toFixed(1)}" y1="${top}" x2="${(x + w / 2).toFixed(1)}" y2="${(top + h).toFixed(1)}" stroke="${m.formDeep}" stroke-opacity=".28" stroke-width="2"/>`;
      s += `<line x1="${x.toFixed(1)}" y1="${(top + h * 0.45).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${(top + h * 0.45).toFixed(1)}" stroke="${m.formDeep}" stroke-opacity=".22" stroke-width="2"/>`;
    }
    return s;
  }

  function lightShaft(m, W, H, x) {
    return `<path d="M${x} ${H * 0.12} L${x + W * 0.20} ${H * 0.12} L${x + W * 0.46} ${H} L${x - W * 0.06} ${H} Z" fill="${m.light}" opacity=".16"/>`;
  }

  function plant(m, x, y, s, dark) {
    const c = dark ? m.formDeep : P.sage700;
    let out = `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">`;
    out += `<path d="M0 0 C-4 -40 -26 -66 -54 -78 C-30 -84 -6 -62 0 -34 Z" opacity=".92"/>`;
    out += `<path d="M0 0 C6 -46 34 -74 66 -84 C40 -92 10 -66 2 -30 Z" opacity=".82"/>`;
    out += `<path d="M0 0 C-2 -56 6 -92 22 -120 C4 -110 -12 -72 -8 -26 Z" opacity=".88"/>`;
    out += `<path d="M-26 0 h52 l-8 40 h-36 Z" opacity=".95"/>`;
    out += `</g>`;
    return out;
  }

  function pendant(m, x, y, len, s) {
    return `<g stroke="${m.formDeep}" stroke-width="${1.6 * s}" opacity=".85">` +
           `<line x1="${x}" y1="0" x2="${x}" y2="${y}"/></g>` +
           `<path d="M${x - 26 * s} ${y + len} L${x + 26 * s} ${y + len} L${x + 9 * s} ${y} L${x - 9 * s} ${y} Z" fill="${m.formDeep}" opacity=".9"/>` +
           `<ellipse cx="${x}" cy="${y + len}" rx="${26 * s}" ry="${6 * s}" fill="${m.light}" opacity=".95"/>` +
           `<circle cx="${x}" cy="${y + len + 14 * s}" r="${34 * s}" fill="${m.light}" opacity=".18"/>`;
  }

  function officeScene(r, m, W, H) {
    const horizon = H * 0.62;
    let s = '';
    s += windows(r, m, W, H, 2 + Math.floor(r() * 2));
    s += lightShaft(m, W, H, W * (0.10 + r() * 0.2));
    s += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${m.floor}" opacity=".92"/>`;
    s += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floorGlow)"/>`;

    /* long desk with monitors */
    const dy = horizon + (H - horizon) * 0.16;
    const dw = W * 0.62, dx = W * (0.12 + r() * 0.14);
    s += `<rect x="${dx}" y="${dy}" width="${dw}" height="${H * 0.035}" rx="4" fill="${m.accent}"/>`;
    s += `<rect x="${dx + 12}" y="${dy + H * 0.035}" width="${H * 0.012}" height="${H * 0.15}" fill="${m.form}" opacity=".8"/>`;
    s += `<rect x="${dx + dw - 24}" y="${dy + H * 0.035}" width="${H * 0.012}" height="${H * 0.15}" fill="${m.form}" opacity=".8"/>`;
    const mons = 2 + Math.floor(r() * 2);
    for (let i = 0; i < mons; i++) {
      const mx = dx + dw * (0.14 + i * 0.32);
      const mw = W * 0.13, mh = H * 0.10;
      s += `<rect x="${mx}" y="${dy - mh}" width="${mw}" height="${mh}" rx="3" fill="${m.formDeep}" opacity=".9"/>`;
      s += `<rect x="${mx + 4}" y="${dy - mh + 4}" width="${mw - 8}" height="${mh - 8}" rx="2" fill="${m.light}" opacity=".35"/>`;
      s += `<rect x="${mx + mw / 2 - 3}" y="${dy - 10}" width="6" height="10" fill="${m.formDeep}" opacity=".9"/>`;
    }
    /* chairs */
    for (let i = 0; i < mons; i++) {
      const cx = dx + dw * (0.20 + i * 0.32);
      const cy = dy + H * 0.12;
      s += `<g fill="${m.form}" opacity=".92"><rect x="${cx - 34}" y="${cy - 62}" width="68" height="60" rx="26"/>` +
           `<ellipse cx="${cx}" cy="${cy}" rx="42" ry="12"/>` +
           `<rect x="${cx - 4}" y="${cy}" width="8" height="34" /></g>`;
    }
    /* shelf */
    if (r() > 0.4) {
      const sx = W * 0.74, sy = H * 0.30;
      s += `<rect x="${sx}" y="${sy}" width="${W * 0.18}" height="6" fill="${m.form}" opacity=".8"/>`;
      for (let i = 0; i < 7; i++) {
        const bh = 26 + r() * 26;
        s += `<rect x="${sx + 10 + i * 20}" y="${sy - bh}" width="${10 + r() * 6}" height="${bh}" fill="${i % 2 ? m.accent : m.form}" opacity=".85"/>`;
      }
    }
    s += plant(m, W * (0.86 + r() * 0.06), H * 0.94, 1.05, false);
    return s;
  }

  function hallScene(r, m, W, H) {
    const horizon = H * 0.58;
    let s = '';
    s += `<rect x="${W * 0.16}" y="${H * 0.14}" width="${W * 0.68}" height="${H * 0.30}" rx="4" fill="${m.formDeep}" opacity=".9"/>`;
    s += `<rect x="${W * 0.175}" y="${H * 0.152}" width="${W * 0.65}" height="${H * 0.276}" rx="2" fill="url(#screen)"/>`;
    s += lightShaft(m, W, H, W * 0.30);
    s += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${m.floor}" opacity=".95"/>`;
    s += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floorGlow)"/>`;

    /* receding rows of seats */
    const rows = 4;
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const k = rIdx / (rows - 1);
      const y = horizon + (H - horizon) * (0.05 + k * 0.74);
      const scale = 0.55 + k * 0.75;
      const seatW = W * 0.085 * scale;
      const n = Math.max(3, Math.round(W / (seatW * 1.55)));
      const offset = (rIdx % 2) * seatW * 0.5;
      for (let i = -1; i < n; i++) {
        const x = i * seatW * 1.55 + offset + W * 0.04;
        s += `<g opacity="${(0.72 + k * 0.25).toFixed(2)}" fill="${m.form}">` +
             `<rect x="${x}" y="${y - seatW * 0.9}" width="${seatW}" height="${seatW * 0.9}" rx="${seatW * 0.22}"/>` +
             `<rect x="${x - seatW * 0.08}" y="${y}" width="${seatW * 1.16}" height="${seatW * 0.22}" rx="${seatW * 0.1}" fill="${m.formDeep}"/>` +
             `</g>`;
      }
    }
    s += pendant(m, W * 0.22, H * 0.16, H * 0.04, 1.1);
    s += pendant(m, W * 0.78, H * 0.20, H * 0.04, 1.1);
    return s;
  }

  function cafeScene(r, m, W, H) {
    const horizon = H * 0.63;
    let s = '';
    s += windows(r, m, W, H, 3);
    s += lightShaft(m, W, H, W * 0.55);
    s += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${m.floor}" opacity=".9"/>`;
    s += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floorGlow)"/>`;

    /* counter */
    const cy = horizon + (H - horizon) * 0.18;
    s += `<rect x="${W * 0.08}" y="${cy}" width="${W * 0.52}" height="${H * 0.20}" rx="6" fill="${m.form}"/>`;
    s += `<rect x="${W * 0.075}" y="${cy - H * 0.018}" width="${W * 0.53}" height="${H * 0.022}" rx="6" fill="${m.accent}"/>`;
    /* machine + cups */
    s += `<rect x="${W * 0.14}" y="${cy - H * 0.10}" width="${W * 0.10}" height="${H * 0.082}" rx="4" fill="${m.formDeep}" opacity=".92"/>`;
    for (let i = 0; i < 4; i++) {
      s += `<rect x="${W * (0.30 + i * 0.035)}" y="${cy - H * 0.036}" width="${W * 0.022}" height="${H * 0.036}" rx="3" fill="${P.vanilla}" opacity=".9"/>`;
    }
    /* stools */
    for (let i = 0; i < 3; i++) {
      const sx = W * (0.16 + i * 0.16);
      const sy = cy + H * 0.24;
      s += `<g fill="${m.formDeep}" opacity=".9"><ellipse cx="${sx}" cy="${sy}" rx="${W * 0.035}" ry="${H * 0.014}"/>` +
           `<rect x="${sx - 3}" y="${sy}" width="6" height="${H * 0.09}"/>` +
           `<ellipse cx="${sx}" cy="${sy + H * 0.09}" rx="${W * 0.026}" ry="${H * 0.008}"/></g>`;
    }
    /* round table on the right */
    const tx = W * 0.80, ty = horizon + (H - horizon) * 0.52;
    s += `<ellipse cx="${tx}" cy="${ty}" rx="${W * 0.10}" ry="${H * 0.028}" fill="${m.accent}"/>`;
    s += `<rect x="${tx - 4}" y="${ty}" width="8" height="${H * 0.13}" fill="${m.form}"/>`;
    s += `<ellipse cx="${tx}" cy="${ty + H * 0.13}" rx="${W * 0.05}" ry="${H * 0.012}" fill="${m.form}"/>`;
    s += `<rect x="${tx - W * 0.03}" y="${ty - H * 0.028}" width="${W * 0.045}" height="${H * 0.03}" rx="2" fill="${m.formDeep}" opacity=".8"/>`;

    s += pendant(m, W * 0.30, H * 0.22, H * 0.035, 0.9);
    s += pendant(m, W * 0.44, H * 0.27, H * 0.035, 0.9);
    s += plant(m, W * 0.06, H * 0.99, 0.9, true);
    return s;
  }

  const BUILDERS = { offices: officeScene, halls: hallScene, cafes: cafeScene };

  /* ── public ────────────────────────────────────────────────────────── */

  function svg(kind, seed, W, H) {
    const r = rng(kind + '|' + seed);
    const pool = MOODS[kind] || MOODS.offices;
    const m = pool[Math.floor(r() * pool.length)];
    const build = BUILDERS[kind] || officeScene;

    const body =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">` +
      `<defs>` +
        `<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">` +
          `<stop offset="0" stop-color="${m.wallTop}"/><stop offset="1" stop-color="${m.wallBot}"/></linearGradient>` +
        `<linearGradient id="glass" x1="0" y1="0" x2="0.3" y2="1">` +
          `<stop offset="0" stop-color="${m.light}" stop-opacity=".95"/>` +
          `<stop offset="1" stop-color="${m.light}" stop-opacity=".55"/></linearGradient>` +
        `<linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">` +
          `<stop offset="0" stop-color="${m.light}" stop-opacity=".5"/>` +
          `<stop offset="1" stop-color="${P.sage300}" stop-opacity=".35"/></linearGradient>` +
        `<linearGradient id="floorGlow" x1="0" y1="0" x2="0" y2="1">` +
          `<stop offset="0" stop-color="${m.light}" stop-opacity=".28"/>` +
          `<stop offset="1" stop-color="${m.light}" stop-opacity="0"/></linearGradient>` +
        `<radialGradient id="vig" cx="0.5" cy="0.44" r="0.78">` +
          `<stop offset="0.45" stop-color="#000" stop-opacity="0"/>` +
          `<stop offset="1" stop-color="${P.sage900}" stop-opacity=".42"/></radialGradient>` +
        `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>` +
          `<feColorMatrix type="saturate" values="0"/></filter>` +
      `</defs>` +
      `<rect width="${W}" height="${H}" fill="url(#wall)"/>` +
      build(r, m, W, H) +
      `<rect width="${W}" height="${H}" fill="url(#vig)"/>` +
      `<rect width="${W}" height="${H}" filter="url(#grain)" opacity=".055"/>` +
      `</svg>`;

    return 'data:image/svg+xml;charset=utf-8,' + esc(body);
  }

  const cache = new Map();

  FS.Imagery = {
    /* Photograph for a space card / hero / category tile. */
    scene(kind, seed, w, h) {
      const W = w || 1200, H = h || 800;
      const key = kind + '|' + seed + '|' + W + '|' + H;
      if (!cache.has(key)) cache.set(key, svg(kind, seed, W, H));
      return cache.get(key);
    },

    /* A tiny out-of-focus stand-in, shown while the studio renders. */
    placeholder(kind, seed) {
      const key = 'ph|' + kind + '|' + seed;
      if (cache.has(key)) return cache.get(key);
      const r = rng(kind + '|' + seed);
      const pool = MOODS[kind] || MOODS.offices;
      const m = pool[Math.floor(r() * pool.length)];
      const body =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 26" width="40" height="26">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="0.2" y2="1">` +
        `<stop offset="0" stop-color="${m.wallTop}"/><stop offset=".55" stop-color="${m.wallBot}"/>` +
        `<stop offset="1" stop-color="${m.floor}"/></linearGradient>` +
        `<radialGradient id="l" cx=".3" cy=".3" r=".7">` +
        `<stop offset="0" stop-color="${m.light}" stop-opacity=".7"/>` +
        `<stop offset="1" stop-color="${m.light}" stop-opacity="0"/></radialGradient></defs>` +
        `<rect width="40" height="26" fill="url(#g)"/><rect width="40" height="26" fill="url(#l)"/></svg>`;
      const uri = 'data:image/svg+xml;charset=utf-8,' + esc(body);
      cache.set(key, uri);
      return uri;
    },

    /* Initials avatar for the profile. */
    avatar(name) {
      const initials = (name || 'FS').trim().split(/\s+/).slice(0, 2)
        .map(w => w[0] ? w[0].toUpperCase() : '').join('') || 'FS';
      const body =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">` +
        `<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${P.sage500}"/><stop offset="1" stop-color="${P.sage700}"/></linearGradient></defs>` +
        `<rect width="120" height="120" rx="60" fill="url(#a)"/>` +
        `<text x="60" y="60" fill="${P.vanilla}" font-family="Jost, Helvetica, Arial, sans-serif" font-size="42" ` +
        `font-weight="300" letter-spacing="2" text-anchor="middle" dominant-baseline="central">${initials}</text>` +
        `</svg>`;
      return 'data:image/svg+xml;charset=utf-8,' + esc(body);
    }
  };
})(window.FS);
