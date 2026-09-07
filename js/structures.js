/* ═══════════════════════════════════════════════════════════════════════
   STRUCTURES — the tangible engineering objects that live in front of the
   poured concrete: rolled steel sections, a rebar cage, plywood formwork,
   a space truss, concrete columns, structural setting-out lines and
   procedurally drafted technical drawings.
   ═══════════════════════════════════════════════════════════════════════ */
(function (DAL) {
  'use strict';

  const S = DAL.Structures = {};

  /* ─────────────────────── procedural textures ─────────────────────── */

  function noiseCanvas(size, opts) {
    opts = opts || {};
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    const rnd = DAL.U.rng(opts.seed || 7);

    /* two octaves of value noise, bilinearly upsampled */
    const grid = (n) => {
      const g = new Float32Array(n * n);
      for (let i = 0; i < g.length; i++) g[i] = rnd();
      return (x, y) => {
        const fx = x * n, fy = y * n;
        const x0 = Math.floor(fx) % n, y0 = Math.floor(fy) % n;
        const x1 = (x0 + 1) % n, y1 = (y0 + 1) % n;
        let tx = fx - Math.floor(fx), ty = fy - Math.floor(fy);
        tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
        const a = g[y0 * n + x0], b = g[y0 * n + x1];
        const cc = g[y1 * n + x0], d = g[y1 * n + x1];
        return (a + (b - a) * tx) * (1 - ty) + (cc + (d - cc) * tx) * ty;
      };
    };
    const n1 = grid(16), n2 = grid(64), n3 = grid(256);

    const base = opts.base || [168, 160, 148];
    const amp  = opts.amp === undefined ? 26 : opts.amp;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size, v = y / size;
        let n = n1(u, v) * 0.5 + n2(u, v) * 0.32 + n3(u, v) * 0.18;
        /* sparse darker aggregate specks */
        const sp = n3(u * 3.1, v * 3.1);
        if (sp > 0.86) n -= 0.22;
        const k = (n - 0.5) * 2 * amp;
        const i = (y * size + x) * 4;
        img.data[i]     = DAL.U.clamp(base[0] + k, 0, 255);
        img.data[i + 1] = DAL.U.clamp(base[1] + k, 0, 255);
        img.data[i + 2] = DAL.U.clamp(base[2] + k * 0.92, 0, 255);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  S.concreteTexture = function (repeat, seed) {
    const tex = new THREE.CanvasTexture(
      noiseCanvas(256, { seed: seed || 11, base: [170, 162, 150], amp: 30 })
    );
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat || 2, repeat || 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  /* soft round sprite for dust motes */
  S.dustTexture = function () {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(243,229,171,0.95)');
    grad.addColorStop(0.4, 'rgba(227,201,160,0.35)');
    grad.addColorStop(1,   'rgba(227,201,160,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };

  /* ─────────────────────── environment lighting ─────────────────────── */

  S.environment = function (renderer) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const g = c.getContext('2d');

    /* sky → horizon → ground, in the umber / dune family */
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, '#c9ab80');
    grad.addColorStop(0.34, '#8a6a4c');
    grad.addColorStop(0.50, '#4a3226');
    grad.addColorStop(1.00, '#1a100b');
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 256);

    /* the key light, as a bright soft patch so metal has something to reflect */
    const key = g.createRadialGradient(150, 62, 0, 150, 62, 96);
    key.addColorStop(0, 'rgba(255,246,214,0.62)');
    key.addColorStop(1, 'rgba(255,246,214,0)');
    g.fillStyle = key;
    g.fillRect(0, 0, 512, 200);

    /* a cool fill from the opposite side keeps the steel from going flat */
    const fill = g.createRadialGradient(400, 96, 0, 400, 96, 120);
    fill.addColorStop(0, 'rgba(206,214,226,0.40)');
    fill.addColorStop(1, 'rgba(206,214,226,0)');
    g.fillStyle = fill;
    g.fillRect(0, 0, 512, 220);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
    return env;
  };

  /* ─────────────────────── materials ─────────────────────── */

  S.materials = function () {
    const steel = new THREE.MeshStandardMaterial({
      color: 0x8e959d, metalness: 0.92, roughness: 0.42, envMapIntensity: 0.85
    });
    const steelDark = new THREE.MeshStandardMaterial({
      color: 0x6f767e, metalness: 0.9, roughness: 0.46, envMapIntensity: 1.0
    });
    const rebar = new THREE.MeshStandardMaterial({
      color: 0x8a5c3a, metalness: 0.7, roughness: 0.7, envMapIntensity: 0.6
    });
    const ply = new THREE.MeshStandardMaterial({
      color: 0x4e341f, metalness: 0.0, roughness: 0.9, envMapIntensity: 0.35
    });
    const conc = new THREE.MeshStandardMaterial({
      color: 0x6a625a, metalness: 0.0, roughness: 0.95, envMapIntensity: 0.4,
      map: S.concreteTexture(2.2, 23)
    });
    const line = new THREE.LineBasicMaterial({
      color: 0xe3c9a0, transparent: true, opacity: 0.30
    });
    const lineFaint = new THREE.LineBasicMaterial({
      color: 0xe3c9a0, transparent: true, opacity: 0.13
    });
    const glow = new THREE.MeshBasicMaterial({
      color: 0xf3e5ab, transparent: true, opacity: 0.55
    });
    return { steel, steelDark, rebar, ply, conc, line, lineFaint, glow };
  };

  /* ─────────────────────── rolled steel section ─────────────────────── */

  /* a real I-section profile, extruded and bevelled */
  S.iBeam = function (length, mat, o) {
    o = Object.assign({ b: 0.30, d: 0.46, tf: 0.036, tw: 0.024 }, o || {});
    const b = o.b / 2, d = o.d / 2, tf = o.tf, tw = o.tw / 2;

    const sh = new THREE.Shape();
    sh.moveTo(-b, -d);
    sh.lineTo(b, -d);
    sh.lineTo(b, -d + tf);
    sh.lineTo(tw, -d + tf);
    sh.lineTo(tw, d - tf);
    sh.lineTo(b, d - tf);
    sh.lineTo(b, d);
    sh.lineTo(-b, d);
    sh.lineTo(-b, d - tf);
    sh.lineTo(-tw, d - tf);
    sh.lineTo(-tw, -d + tf);
    sh.lineTo(-b, -d + tf);
    sh.closePath();

    const geo = new THREE.ExtrudeGeometry(sh, {
      depth: length, bevelEnabled: true,
      bevelThickness: 0.006, bevelSize: 0.005, bevelSegments: 2, curveSegments: 1
    });
    geo.translate(0, 0, -length / 2);
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    return mesh;
  };

  /* bolted end plate — the small detail that sells the scale */
  S.endPlate = function (mat) {
    const g = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.52, 0.022), mat);
    g.add(plate);
    const boltGeo = new THREE.CylinderGeometry(0.017, 0.017, 0.05, 8);
    const rnd = [[-0.115, -0.19], [0.115, -0.19], [-0.115, 0.19], [0.115, 0.19],
                 [-0.115, 0], [0.115, 0]];
    rnd.forEach(([x, y]) => {
      const bolt = new THREE.Mesh(boltGeo, mat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(x, y, 0.02);
      g.add(bolt);
    });
    return g;
  };

  /* ─────────────────────── rebar cage ─────────────────────── */

  S.rebarCage = function (mats, o) {
    o = Object.assign({ w: 0.62, h: 2.35, bars: 8, stirrups: 7 }, o || {});
    const g = new THREE.Group();
    const half = o.w / 2;

    const barGeo = new THREE.CylinderGeometry(0.016, 0.016, o.h, 8, 1);
    const pos = [
      [-half, -half], [0, -half], [half, -half],
      [half, 0], [half, half], [0, half], [-half, half], [-half, 0]
    ].slice(0, o.bars);

    pos.forEach(([x, z]) => {
      const bar = new THREE.Mesh(barGeo, mats.rebar);
      bar.position.set(x, o.h / 2, z);
      bar.castShadow = true;
      g.add(bar);
    });

    /* square stirrups: a 4-sided torus reads as a bent bar */
    const stirGeo = new THREE.TorusGeometry(half * Math.SQRT2, 0.011, 6, 4);
    for (let i = 0; i < o.stirrups; i++) {
      const s = new THREE.Mesh(stirGeo, mats.rebar);
      s.rotation.x = Math.PI / 2;
      s.rotation.z = Math.PI / 4;
      s.position.y = 0.16 + i * (o.h - 0.32) / (o.stirrups - 1);
      g.add(s);
    }
    return g;
  };

  /* ─────────────────────── plywood formwork ─────────────────────── */

  S.formwork = function (mats, o) {
    o = Object.assign({ w: 1.5, h: 1.15, d: 1.5, open: true }, o || {});
    const g = new THREE.Group();
    const t = 0.045;

    const panel = (w, h, d) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.ply);

    const sides = [
      { m: panel(o.w, o.h, t), p: [0, o.h / 2, -o.d / 2] },
      { m: panel(t, o.h, o.d), p: [-o.w / 2, o.h / 2, 0] },
      { m: panel(t, o.h, o.d), p: [o.w / 2, o.h / 2, 0] }
    ];
    if (!o.open) sides.push({ m: panel(o.w, o.h, t), p: [0, o.h / 2, o.d / 2] });

    sides.forEach(s => {
      s.m.position.set(...s.p);
      s.m.castShadow = s.m.receiveShadow = true;
      s.m.userData.panel = true;
      /* crisp edge outline — parented to the panel so it hinges with it */
      s.m.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(s.m.geometry), mats.line
      ));
      g.add(s.m);
    });

    /* soldier walings + tie rods */
    const waleGeo = new THREE.BoxGeometry(o.w + 0.14, 0.06, 0.06);
    [0.3, 0.82].forEach(y => {
      const w1 = new THREE.Mesh(waleGeo, mats.steelDark);
      w1.position.set(0, y, -o.d / 2 - 0.05);
      g.add(w1);
    });
    const tieGeo = new THREE.CylinderGeometry(0.011, 0.011, o.w + 0.3, 6);
    [0.3, 0.82].forEach(y => {
      const tie = new THREE.Mesh(tieGeo, mats.steelDark);
      tie.rotation.z = Math.PI / 2;
      tie.position.set(0, y, -o.d / 2 + 0.12);
      g.add(tie);
    });

    return g;
  };

  /* ─────────────────────── space truss ─────────────────────── */

  function member(a, b, r, mat) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(r, r, len, 7, 1);
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), dir.normalize()
    );
    m.castShadow = true;
    return m;
  }
  S.member = member;

  S.truss = function (mats, o) {
    o = Object.assign({ bays: 5, span: 1.15, depth: 0.82 }, o || {});
    const g = new THREE.Group();
    const V = THREE.Vector3;
    const nodes = [];

    for (let i = 0; i <= o.bays; i++) {
      const x = (i - o.bays / 2) * o.span;
      nodes.push([new V(x, o.depth, 0), new V(x, 0, 0)]);
    }
    for (let i = 0; i <= o.bays; i++) {
      /* verticals */
      g.add(member(nodes[i][0], nodes[i][1], 0.021, mats.steel));
      if (i < o.bays) {
        /* top and bottom chords */
        g.add(member(nodes[i][0], nodes[i + 1][0], 0.028, mats.steel));
        g.add(member(nodes[i][1], nodes[i + 1][1], 0.028, mats.steel));
        /* alternating diagonals — a Warren configuration */
        const a = i % 2 ? nodes[i][0] : nodes[i][1];
        const b = i % 2 ? nodes[i + 1][1] : nodes[i + 1][0];
        g.add(member(a, b, 0.016, mats.steelDark));
      }
      /* gusset nodes */
      [0, 1].forEach(k => {
        const n = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), mats.steelDark);
        n.position.copy(nodes[i][k]);
        g.add(n);
      });
    }
    /* store children in assembly order so the truss can build itself in */
    g.userData.sequence = g.children.slice();
    return g;
  };

  /* ─────────────────────── concrete columns ─────────────────────── */

  S.columns = function (mats, rnd) {
    const g = new THREE.Group();
    const spots = [
      [ 5.6,  -6.8, 3.6], [-6.9, -10.2, 4.4], [ 8.9, -11.5, 4.9],
      [-1.4, -13.6, 5.4], [10.8, -17.0, 6.0], [-11.2, -18.5, 6.4]
    ];
    spots.forEach(([x, z, h], i) => {
      const w = 0.42 + rnd() * 0.16;
      const col = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mats.conc);
      col.position.set(x, h / 2, z);
      col.rotation.y = (rnd() - 0.5) * 0.12;
      col.castShadow = col.receiveShadow = true;
      g.add(col);

      /* starter bars poking out of the top — a real construction detail */
      const barGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.46, 6);
      for (let k = 0; k < 4; k++) {
        const bar = new THREE.Mesh(barGeo, mats.rebar);
        bar.position.set(
          x + (k % 2 ? 1 : -1) * w * 0.3,
          h + 0.2,
          z + (k < 2 ? 1 : -1) * w * 0.3
        );
        g.add(bar);
      }
      /* setting-out line up the column face */
      if (i % 2 === 0) {
        const pts = [new THREE.Vector3(x, 0, z + w / 2 + 0.002),
                     new THREE.Vector3(x, h + 1.4, z + w / 2 + 0.002)];
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mats.lineFaint));
      }
    });
    return g;
  };

  /* ─────────────────────── setting-out lines ─────────────────────── */

  S.gridLines = function (mats) {
    const g = new THREE.Group();
    const pts = [];
    const N = 14, step = 1.6, ext = N * step / 2;
    for (let i = -N / 2; i <= N / 2; i++) {
      const v = i * step;
      pts.push(-ext, 0.004, v, ext, 0.004, v);
      pts.push(v, 0.004, -ext, v, 0.004, ext);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const grid = new THREE.LineSegments(geo, mats.lineFaint);
    g.add(grid);

    /* grid references A–D / 1–4 as small crosses */
    const cross = [];
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const x = i * step * 2, z = j * step * 2;
        cross.push(x - 0.12, 0.006, z, x + 0.12, 0.006, z);
        cross.push(x, 0.006, z - 0.12, x, 0.006, z + 0.12);
      }
    }
    const cgeo = new THREE.BufferGeometry();
    cgeo.setAttribute('position', new THREE.Float32BufferAttribute(cross, 3));
    g.add(new THREE.LineSegments(cgeo, mats.line));
    return g;
  };

  /* vertical structural traces that fade upward */
  S.structuralTraces = function (mats, rnd) {
    const g = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const x = (rnd() - 0.5) * 22;
      const z = -2 - rnd() * 20;
      const h = 2.4 + rnd() * 7;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, z), new THREE.Vector3(x, h, z)
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: 0xe3c9a0, transparent: true, opacity: 0.05 + rnd() * 0.09
      });
      g.add(new THREE.Line(geo, mat));
    }
    return g;
  };

  /* ─────────────────────── technical drawings ─────────────────────── */

  function drawSheet(kind, w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    const DUNE = 'rgba(227,201,160,';
    x.clearRect(0, 0, w, h);

    /* sheet border + inner frame */
    x.strokeStyle = DUNE + '0.55)';
    x.lineWidth = 2;
    x.strokeRect(10, 10, w - 20, h - 20);
    x.strokeStyle = DUNE + '0.28)';
    x.lineWidth = 1;
    x.strokeRect(26, 26, w - 52, h - 52);

    x.font = '500 15px "JetBrains Mono", monospace';
    x.fillStyle = DUNE + '0.85)';

    const pad = 52;
    const iw = w - pad * 2, ih = h - pad * 2 - 90;

    if (kind === 'plan') {
      /* structural framing plan: a 4 × 3 column grid with beams */
      const cols = 4, rows = 3;
      const cx = iw / (cols - 1), cy = ih / (rows - 1);
      x.strokeStyle = DUNE + '0.22)';
      x.setLineDash([9, 7]);
      for (let i = 0; i < cols; i++) {
        x.beginPath(); x.moveTo(pad + i * cx, pad - 22);
        x.lineTo(pad + i * cx, pad + ih + 22); x.stroke();
      }
      for (let j = 0; j < rows; j++) {
        x.beginPath(); x.moveTo(pad - 22, pad + j * cy);
        x.lineTo(pad + iw + 22, pad + j * cy); x.stroke();
      }
      x.setLineDash([]);

      /* beams */
      x.strokeStyle = DUNE + '0.65)';
      x.lineWidth = 3;
      for (let j = 0; j < rows; j++) {
        x.beginPath(); x.moveTo(pad, pad + j * cy); x.lineTo(pad + iw, pad + j * cy); x.stroke();
      }
      for (let i = 0; i < cols; i++) {
        x.beginPath(); x.moveTo(pad + i * cx, pad); x.lineTo(pad + i * cx, pad + ih); x.stroke();
      }
      /* secondary joists */
      x.strokeStyle = DUNE + '0.24)';
      x.lineWidth = 1;
      for (let j = 0; j < rows - 1; j++) {
        for (let k = 1; k <= 3; k++) {
          const yy = pad + j * cy + (cy * k) / 4;
          x.beginPath(); x.moveTo(pad, yy); x.lineTo(pad + iw, yy); x.stroke();
        }
      }
      /* columns */
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = pad + i * cx, py = pad + j * cy;
          x.fillStyle = DUNE + '0.75)';
          x.fillRect(px - 11, py - 11, 22, 22);
          x.strokeStyle = DUNE + '0.9)';
          x.lineWidth = 1.5;
          x.strokeRect(px - 11, py - 11, 22, 22);
        }
      }
      /* grid bubbles */
      x.font = '500 14px "JetBrains Mono", monospace';
      for (let i = 0; i < cols; i++) {
        const px = pad + i * cx;
        x.strokeStyle = DUNE + '0.5)';
        x.beginPath(); x.arc(px, pad - 40, 15, 0, 6.2832); x.stroke();
        x.fillStyle = DUNE + '0.8)';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(String(i + 1), px, pad - 39);
      }
      for (let j = 0; j < rows; j++) {
        const py = pad + j * cy;
        x.strokeStyle = DUNE + '0.5)';
        x.beginPath(); x.arc(pad - 40, py, 15, 0, 6.2832); x.stroke();
        x.fillStyle = DUNE + '0.8)';
        x.fillText('ABC'[j], pad - 40, py + 1);
      }
      /* dimension string */
      const dy = pad + ih + 46;
      x.strokeStyle = DUNE + '0.5)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(pad, dy); x.lineTo(pad + iw, dy); x.stroke();
      for (let i = 0; i < cols; i++) {
        const px = pad + i * cx;
        x.beginPath(); x.moveTo(px, dy - 7); x.lineTo(px, dy + 7); x.stroke();
        if (i < cols - 1) {
          x.fillStyle = DUNE + '0.7)';
          x.font = '400 13px "JetBrains Mono", monospace';
          x.fillText('6000', px + cx / 2, dy - 16);
        }
      }
      x.textAlign = 'left';
      x.fillStyle = DUNE + '0.8)';
      x.font = '500 16px "JetBrains Mono", monospace';
      x.fillText('STRUCTURAL FRAMING PLAN — LEVEL 01', pad, h - 58);

    } else if (kind === 'section') {
      /* section through a beam / slab with reinforcement */
      const bx = pad + iw * 0.16, bw = iw * 0.34, by = pad + 60, bh = ih * 0.62;
      x.strokeStyle = DUNE + '0.7)'; x.lineWidth = 2.5;
      x.strokeRect(bx, by, bw, bh);
      /* hatching = concrete in section */
      x.strokeStyle = DUNE + '0.16)'; x.lineWidth = 1;
      for (let i = -bh; i < bw; i += 13) {
        x.beginPath();
        x.moveTo(bx + Math.max(i, 0), by + Math.max(-i, 0));
        x.lineTo(bx + Math.min(i + bh, bw), by + Math.min(bh, bw - i));
        x.stroke();
      }
      /* rebar */
      x.fillStyle = DUNE + '0.9)';
      [0.18, 0.5, 0.82].forEach(f => {
        [by + 26, by + bh - 26].forEach(yy => {
          x.beginPath(); x.arc(bx + bw * f, yy, 6, 0, 6.2832); x.fill();
        });
      });
      /* stirrup */
      x.strokeStyle = DUNE + '0.55)'; x.lineWidth = 2;
      x.strokeRect(bx + 16, by + 16, bw - 32, bh - 32);

      /* dimension + leaders */
      x.strokeStyle = DUNE + '0.5)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(bx, by - 26); x.lineTo(bx + bw, by - 26); x.stroke();
      x.beginPath(); x.moveTo(bx, by - 33); x.lineTo(bx, by - 19); x.stroke();
      x.beginPath(); x.moveTo(bx + bw, by - 33); x.lineTo(bx + bw, by - 19); x.stroke();
      x.fillStyle = DUNE + '0.8)';
      x.font = '400 14px "JetBrains Mono", monospace';
      x.textAlign = 'center';
      x.fillText('400', bx + bw / 2, by - 34);

      x.textAlign = 'left';
      const lx = bx + bw + 60;
      [['6 Ø16 — GRADE 60', by + 26],
       ['Ø10 STIRRUPS @ 150', by + bh / 2],
       ['C 30/37 · COVER 40', by + bh - 26]].forEach(([label, yy]) => {
        x.strokeStyle = DUNE + '0.4)';
        x.beginPath(); x.moveTo(bx + bw + 8, yy); x.lineTo(lx - 8, yy); x.stroke();
        x.fillStyle = DUNE + '0.78)';
        x.font = '400 14px "JetBrains Mono", monospace';
        x.fillText(label, lx, yy + 5);
      });

      x.fillStyle = DUNE + '0.8)';
      x.font = '500 16px "JetBrains Mono", monospace';
      x.fillText('SECTION A–A — TYPICAL BEAM', pad, h - 58);

    } else { /* elevation */
      const gx = pad, gw = iw, gy = pad + 34, gh = ih * 0.72;
      const bays = 4, storeys = 4;
      x.strokeStyle = DUNE + '0.6)'; x.lineWidth = 2;
      for (let i = 0; i <= bays; i++) {
        const px = gx + (gw * i) / bays;
        x.beginPath(); x.moveTo(px, gy); x.lineTo(px, gy + gh); x.stroke();
      }
      for (let j = 0; j <= storeys; j++) {
        const py = gy + (gh * j) / storeys;
        x.beginPath(); x.moveTo(gx, py); x.lineTo(gx + gw, py); x.stroke();
      }
      /* bracing */
      x.strokeStyle = DUNE + '0.3)'; x.lineWidth = 1.5;
      for (let i = 0; i < bays; i++) {
        for (let j = 0; j < storeys; j++) {
          const x0 = gx + (gw * i) / bays, x1 = gx + (gw * (i + 1)) / bays;
          const y0 = gy + (gh * j) / storeys, y1 = gy + (gh * (j + 1)) / storeys;
          x.beginPath();
          if ((i + j) % 2) { x.moveTo(x0, y1); x.lineTo(x1, y0); }
          else             { x.moveTo(x0, y0); x.lineTo(x1, y1); }
          x.stroke();
        }
      }
      /* level markers */
      x.font = '400 13px "JetBrains Mono", monospace';
      for (let j = 0; j <= storeys; j++) {
        const py = gy + (gh * j) / storeys;
        x.strokeStyle = DUNE + '0.45)';
        x.beginPath(); x.moveTo(gx + gw + 10, py); x.lineTo(gx + gw + 46, py); x.stroke();
        x.fillStyle = DUNE + '0.75)';
        x.fillText('+' + ((storeys - j) * 3.6).toFixed(2), gx + gw + 52, py + 5);
      }
      x.fillStyle = DUNE + '0.8)';
      x.font = '500 16px "JetBrains Mono", monospace';
      x.fillText('ELEVATION — BRACED FRAME', pad, h - 58);
    }

    /* title block, on every sheet */
    x.strokeStyle = DUNE + '0.45)'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(pad, h - 78); x.lineTo(w - pad, h - 78); x.stroke();
    x.textAlign = 'right';
    x.fillStyle = DUNE + '0.62)';
    x.font = '400 13px "JetBrains Mono", monospace';
    x.fillText('DALAL AL-MUTAIRI · KUWAIT UNIVERSITY', w - pad, h - 58);
    x.fillText('SCALE 1:50   ·   REV 02', w - pad, h - 36);
    x.textAlign = 'left';
    x.fillText('DRAWN BY D.A.M.', pad, h - 36);

    return c;
  }

  S.drawings = function () {
    const g = new THREE.Group();
    const sheets = [
      { kind: 'plan',      pos: [-4.30, 2.55, -4.20], rot: [0, 0.62, 0],   size: 3.10, op: 0.42 },
      { kind: 'section',   pos: [ 4.45, 2.05, -3.30], rot: [0, -0.70, 0],  size: 2.70, op: 0.40 },
      { kind: 'elevation', pos: [ 0.10, 3.55, -6.60], rot: [0, 0.06, 0],   size: 3.45, op: 0.34 }
    ];

    sheets.forEach(s => {
      const c = drawSheet(s.kind, 1024, 724);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, opacity: s.op,
        side: THREE.DoubleSide, depthWrite: false
      });
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(s.size, s.size * 724 / 1024), mat
      );
      mesh.position.set(...s.pos);
      mesh.rotation.set(...s.rot);
      mesh.userData.baseOpacity = s.op;
      mesh.userData.basePos = mesh.position.clone();
      g.add(mesh);

      /* thin frame so the sheet reads as a physical drawing */
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: 0xe3c9a0, transparent: true, opacity: s.op * 0.7 })
      );
      edge.position.copy(mesh.position);
      edge.rotation.copy(mesh.rotation);
      g.add(edge);
      mesh.userData.edge = edge;
    });

    return g;
  };

  /* ─────────────────────── airborne dust ─────────────────────── */

  S.dust = function (count, rnd) {
    const n = count || 420;
    const pos = new Float32Array(n * 3);
    const spd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (rnd() - 0.5) * 26;
      pos[i * 3 + 1] = rnd() * 9;
      pos[i * 3 + 2] = (rnd() - 0.5) * 26 - 3;
      spd[i] = 0.05 + rnd() * 0.22;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.055, map: S.dustTexture(), transparent: true,
      opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    const pts = new THREE.Points(geo, mat);
    pts.userData.speeds = spd;
    pts.frustumCulled = false;
    return pts;
  };

})(window.DAL);
