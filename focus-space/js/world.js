/* ═══════════════════════════════════════════════════════════════════════
   WORLD — the shared three.js interior.

   One long room that passes through modern offices and study desks, a
   training hall and a quiet café. The cinematic hero flies a camera
   through it, and the studio takes the card photography inside it, so
   the whole platform is lit by the same world.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const P = FS.CONFIG.palette;

  /* Zone bounds along -Z, shared with the studio's camera set-ups. */
  const ZONES = {
    offices: { from:    6, to:  -46 },
    halls:   { from:  -56, to: -100 },
    cafes:   { from: -112, to: -152 }
  };

  /* ── procedural textures ───────────────────────────────────────────── */
  function floorTexture(THREE) {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#C9C2B4';
    g.fillRect(0, 0, 512, 512);
    /* terrazzo flecks in the palette */
    const cols = [P.sage300, P.sand, P.cloudDeep, P.vanillaDeep, P.sage500];
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = cols[i % cols.length];
      g.globalAlpha = 0.10 + Math.random() * 0.22;
      const x = Math.random() * 512, y = Math.random() * 512;
      const r = 1 + Math.random() * 4;
      g.beginPath();
      g.ellipse(x, y, r, r * (0.5 + Math.random()), Math.random() * 3.14, 0, 6.283);
      g.fill();
    }
    /* slab joints */
    g.globalAlpha = 0.18;
    g.strokeStyle = '#8E9A90';
    g.lineWidth = 2;
    for (let i = 0; i <= 4; i++) {
      g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i * 128); g.lineTo(512, i * 128); g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 34);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function shaftTexture(THREE) {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, 'rgba(255,247,229,0.55)');
    grad.addColorStop(0.55, 'rgba(255,247,229,0.16)');
    grad.addColorStop(1, 'rgba(255,247,229,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* ── world ───────────────────────────────────────────────────────── */
  function buildWorld(THREE, S) {

    /* lighting — warm key from the windows, cool sky fill, sage bounce */
    S.add(new THREE.HemisphereLight(new THREE.Color('#FFF6E6'), new THREE.Color(P.sage700), 1.35));
    const key = new THREE.DirectionalLight(new THREE.Color('#FFEFD2'), 1.45);
    key.position.set(-14, 12, 10);
    S.add(key);
    const rim = new THREE.DirectionalLight(new THREE.Color(P.sage300), 0.55);
    rim.position.set(12, 8, -60);
    S.add(rim);

    const M = {
      floor: new THREE.MeshStandardMaterial({ map: floorTexture(THREE), roughness: 0.82, metalness: 0.02 }),
      wall:  new THREE.MeshStandardMaterial({ color: new THREE.Color(P.cloud), roughness: 0.95 }),
      wallDeep: new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sage100), roughness: 0.95 }),
      ceil:  new THREE.MeshBasicMaterial({ color: new THREE.Color('#DFE3DB') }),
      glass: new THREE.MeshStandardMaterial({
        color: new THREE.Color(P.cloud), roughness: 0.05, metalness: 0,
        transparent: true, opacity: 0.16, side: THREE.DoubleSide
      }),
      frame: new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sage900), roughness: 0.55, metalness: 0.35 }),
      wood:  new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sand), roughness: 0.7 }),
      woodDeep: new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sandDeep), roughness: 0.72 }),
      rug:   new THREE.MeshStandardMaterial({ color: new THREE.Color(P.vanillaDeep), roughness: 0.95 }),
      sage:  new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sage500), roughness: 0.68 }),
      sageDeep: new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sage700), roughness: 0.6 }),
      ink:   new THREE.MeshStandardMaterial({ color: new THREE.Color(P.sage900), roughness: 0.5 }),
      light: new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFF7E6') }),
      screen: new THREE.MeshBasicMaterial({ color: new THREE.Color('#E7EFE9') }),
      paper: new THREE.MeshStandardMaterial({ color: new THREE.Color(P.vanilla), roughness: 0.9 }),
      leaf:  new THREE.MeshStandardMaterial({ color: new THREE.Color('#6E8A6F'), roughness: 0.85, flatShading: true })
    };

    /* floor + ceiling — the room is 19m across, which reads as a room */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 200), M.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -72;
    S.add(floor);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(20, 200), M.ceil);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 5.4, -72);
    S.add(ceil);

    /* ceiling light slots and shallow beams */
    const dummy = new THREE.Object3D();
    const slots = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.07, 3.0), M.light, 80);
    let n = 0;
    for (let z = 8; z > -170; z -= 8) {
      for (const x of [-3.6, 3.6]) {
        dummy.position.set(x, 5.32, z);
        dummy.updateMatrix();
        slots.setMatrixAt(n++, dummy.matrix);
      }
    }
    slots.count = n;
    S.add(slots);

    const beams = new THREE.InstancedMesh(new THREE.BoxGeometry(19.6, 0.22, 0.34), M.wallDeep, 46);
    n = 0;
    for (let z = 8; z > -172; z -= 4) {
      dummy.position.set(0, 5.28, z);
      dummy.updateMatrix();
      beams.setMatrixAt(n++, dummy.matrix);
    }
    beams.count = n;
    S.add(beams);

    buildWalls(THREE, S, M);
    buildOffices(THREE, S, M);
    buildHall(THREE, S, M);
    buildCafe(THREE, S, M);
    buildShafts(THREE, S);
    return M;
  }

  function buildWalls(THREE, S, M) {
    const wallGeo = new THREE.BoxGeometry(0.4, 5.4, 200);
    for (const x of [-9.8, 9.8]) {
      const w = new THREE.Mesh(wallGeo, x < 0 ? M.wallDeep : M.wall);
      w.position.set(x, 2.7, -72);
      S.add(w);
    }

    /* glazing down the left, mullions between the bays */
    const bay = new THREE.PlaneGeometry(5.4, 3.3);
    const mullion = new THREE.BoxGeometry(0.14, 3.5, 0.14);
    const sill = new THREE.BoxGeometry(0.34, 0.12, 5.6);
    for (let z = 4; z > -168; z -= 7) {
      const g = new THREE.Mesh(bay, M.light);
      g.rotation.y = Math.PI / 2;
      g.position.set(-9.55, 2.95, z - 2.8);
      S.add(g);
      for (const dz of [0, -2.8, -5.6]) {
        const m = new THREE.Mesh(mullion, M.frame);
        m.position.set(-9.5, 2.95, z + dz);
        S.add(m);
      }
      const s = new THREE.Mesh(sill, M.woodDeep);
      s.position.set(-9.45, 1.24, z - 2.8);
      S.add(s);
    }

    /* framed prints on the closed wall, so it is never a blank plane */
    const art = new THREE.PlaneGeometry(1.5, 1.05);
    const artFrame = new THREE.BoxGeometry(1.66, 1.2, 0.06);
    for (let z = -2; z > -166; z -= 11) {
      const f = new THREE.Mesh(artFrame, M.frame);
      f.rotation.y = -Math.PI / 2;
      f.position.set(9.56, 2.5, z);
      S.add(f);
      const a = new THREE.Mesh(art, (z % 22 === 0) ? M.paper : M.rug);
      a.rotation.y = -Math.PI / 2;
      a.position.set(9.52, 2.5, z);
      S.add(a);
    }

    const back = new THREE.Mesh(new THREE.PlaneGeometry(19.6, 5.4), M.wallDeep);
    back.position.set(0, 2.7, -172);
    S.add(back);
  }

  /* ── 01 · offices and study desks ─────────────────────────────────── */
  function buildOffices(THREE, S, M) {
    const dummy = new THREE.Object3D();
    const tops = [], legs = [], monitors = [], seats = [], backs = [], laptops = [], lamps = [];
    const push = (arr, x, y, z, sx, sy, sz, ry) => arr.push([x, y, z, sx, sy, sz, ry || 0]);

    for (let i = 0; i < 14; i++) {
      const z = 3 - i * 3.5;
      for (const side of [-1, 1]) {
        const x = side * 4.6;
        push(tops, x, 0.74, z, 2.4, 0.07, 1.2);
        push(legs, x - 1.05, 0.37, z, 0.08, 0.74, 0.08);
        push(legs, x + 1.05, 0.37, z, 0.08, 0.74, 0.08);
        push(monitors, x + side * 0.1, 1.10, z - 0.3 * side, 0.92, 0.54, 0.05, side < 0 ? 0.14 : -0.14);
        push(seats, x, 0.45, z + 0.9 * side, 0.5, 0.09, 0.5);
        push(backs, x, 0.74, z + 1.12 * side, 0.48, 0.48, 0.07);
        if (i % 2) push(laptops, x - side * 0.75, 0.80, z + 0.1, 0.42, 0.03, 0.3, side * 0.3);
        if (i % 3 === 0) push(lamps, x + side * 0.95, 0.92, z - 0.35 * side, 0.05, 0.32, 0.05);
      }
    }

    const unit = new THREE.BoxGeometry(1, 1, 1);
    const mk = (mat, list) => {
      if (!list.length) return;
      const im = new THREE.InstancedMesh(unit, mat, list.length);
      list.forEach((d, i) => {
        dummy.position.set(d[0], d[1], d[2]);
        dummy.scale.set(d[3], d[4], d[5]);
        dummy.rotation.set(0, d[6], 0);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
      });
      im.instanceMatrix.needsUpdate = true;
      S.add(im);
    };
    mk(M.wood, tops);
    mk(M.frame, legs);
    mk(M.ink, monitors);
    mk(M.sage, seats);
    mk(M.sageDeep, backs);
    mk(M.paper, laptops);
    mk(M.frame, lamps);

    /* glowing faces on the monitors */
    const scr = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.82, 0.46), M.screen, monitors.length);
    monitors.forEach((d, i) => {
      dummy.position.set(d[0], d[1], d[2] + (d[0] < 0 ? 0.04 : 0.04));
      dummy.rotation.set(0, d[6] + Math.PI, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      scr.setMatrixAt(i, dummy.matrix);
    });
    S.add(scr);

    /* a runner down the middle so the floor is not an empty field */
    const rug = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 44), M.rug);
    rug.position.set(0, 0.011, -20);
    S.add(rug);

    /* two glass focus rooms */
    [[-7.2, -15], [7.2, -31]].forEach(([x, z]) => {
      const g = new THREE.Group();
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.7, 5.4), M.glass);
      panel.position.set(x > 0 ? -1.5 : 1.5, 1.35, 0);
      g.add(panel);
      const front = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.7, 0.06), M.glass);
      front.position.set(0, 1.35, 2.7);
      g.add(front);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 5.5), M.frame);
      edge.position.set(0, 2.72, 0);
      g.add(edge);
      const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.07, 24), M.wood);
      tbl.position.set(0, 0.74, 0);
      g.add(tbl);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.74, 12), M.frame);
      stem.position.set(0, 0.37, 0);
      g.add(stem);
      for (const dz of [-1.3, 1.3]) {
        const ch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.09, 0.5), M.sage);
        ch.position.set(0, 0.45, dz);
        g.add(ch);
      }
      g.position.set(x, 0, z);
      S.add(g);
    });

    /* a shelf run against the closed wall */
    for (let i = 0; i < 3; i++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 7), M.wood);
      shelf.position.set(9.3, 0.9 + i * 0.62, -8);
      S.add(shelf);
    }
    const books = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 0.28, 0.09), M.sageDeep, 60);
    let b = 0;
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 20; k++) {
        dummy.position.set(9.3, 1.06 + i * 0.62, -11.3 + k * 0.33);
        dummy.scale.set(1, 0.7 + ((k * 7 + i * 3) % 5) * 0.14, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        books.setMatrixAt(b++, dummy.matrix);
      }
    }
    books.count = b;
    S.add(books);

    plants(THREE, S, [[-8.6, -5], [8.6, -11], [-8.6, -24], [8.6, -38], [-8.6, -42]], M, 1);
  }

  /* ── 02 · training hall ───────────────────────────────────────────── */
  function buildHall(THREE, S, M) {
    const dummy = new THREE.Object3D();
    const z0 = -101;

    const stage = new THREE.Mesh(new THREE.BoxGeometry(13, 0.32, 3.6), M.woodDeep);
    stage.position.set(0, 0.16, z0 - 1);
    S.add(stage);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 3.4), M.screen);
    screen.position.set(0, 2.7, z0 - 2.6);
    S.add(screen);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3.8, 0.12), M.frame);
    bezel.position.set(0, 2.7, z0 - 2.75);
    S.add(bezel);

    const lectern = new THREE.Mesh(new THREE.BoxGeometry(0.66, 1.05, 0.48), M.sageDeep);
    lectern.position.set(-3.4, 0.85, z0 - 0.5);
    S.add(lectern);

    /* raked rows of seats, with a centre aisle behind the third row */
    const seats = [], backs = [], legs = [];
    const rows = 9, cols = 9;
    for (let r = 0; r < rows; r++) {
      const z = z0 + 3.6 + r * 2.2;
      const y = 0.42 + r * 0.05;
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * 1.42;
        if (Math.abs(x) < 1.0 && r > 2) continue;
        seats.push([x, y, z]);
        backs.push([x, y + 0.34, z + 0.32]);
        legs.push([x, y / 2, z]);
      }
    }
    const unit = new THREE.BoxGeometry(1, 1, 1);
    const place = (list, mat, sx, sy, sz) => {
      const im = new THREE.InstancedMesh(unit, mat, list.length);
      list.forEach((d, i) => {
        dummy.position.set(d[0], d[1], d[2]);
        dummy.scale.set(sx, sy, sz);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
      });
      S.add(im);
    };
    place(seats, M.sage, 1.0, 0.11, 0.9);
    place(backs, M.sageDeep, 1.0, 0.62, 0.11);
    place(legs, M.frame, 0.1, 0.8, 0.1);

    /* a workshop table at the back of the room */
    const tbl = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 1.1), M.wood);
    tbl.position.set(0, 0.76, z0 + 25);
    S.add(tbl);
    for (const dx of [-2, 2]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.76, 0.1), M.frame);
      l.position.set(dx, 0.38, z0 + 25);
      S.add(l);
    }

    const globe = new THREE.SphereGeometry(0.27, 18, 14);
    for (let i = 0; i < 6; i++) {
      const x = (i % 2 ? 1 : -1) * 4.2;
      const z = z0 + 6 + Math.floor(i / 2) * 7;
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.4, 6), M.frame);
      cord.position.set(x, 4.6, z);
      S.add(cord);
      const g = new THREE.Mesh(globe, M.light);
      g.position.set(x, 3.85, z);
      S.add(g);
    }
    const lamp = new THREE.PointLight(new THREE.Color('#FFE9C4'), 18, 24, 2);
    lamp.position.set(0, 4.0, z0 + 12);
    S.add(lamp);

    plants(THREE, S, [[-8.6, z0 + 1], [8.6, z0 + 1], [-8.6, z0 + 19], [8.6, z0 + 27]], M, 1.05);
  }

  /* ── 03 · quiet café ──────────────────────────────────────────────── */
  function buildCafe(THREE, S, M) {
    const z0 = -118;

    const counter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.08, 10), M.woodDeep);
    counter.position.set(-6.2, 0.54, z0 - 8);
    S.add(counter);
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.09, 10.3), M.sand);
    top.position.set(-6.2, 1.12, z0 - 8);
    S.add(top);
    const machine = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.4), M.frame);
    machine.position.set(-6.2, 1.5, z0 - 5);
    S.add(machine);
    const grinder = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 14), M.frame);
    grinder.position.set(-6.2, 1.45, z0 - 7);
    S.add(grinder);

    for (let i = 0; i < 3; i++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 7.4), M.wood);
      shelf.position.set(-9.2, 1.6 + i * 0.72, z0 - 8);
      S.add(shelf);
    }

    const tableTop = new THREE.CylinderGeometry(0.6, 0.6, 0.07, 24);
    const stem = new THREE.CylinderGeometry(0.06, 0.13, 0.72, 12);
    const stool = new THREE.CylinderGeometry(0.23, 0.21, 0.1, 16);
    const stoolLeg = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8);
    const cup = new THREE.CylinderGeometry(0.05, 0.042, 0.09, 12);

    const spots = [
      [-2.2, z0 - 2], [-2.6, z0 - 7], [-2.0, z0 - 12], [-2.5, z0 - 17], [-2.2, z0 - 22], [-2.6, z0 - 27],
      [ 1.9, z0 - 4], [ 2.2, z0 - 9], [ 1.8, z0 - 14], [ 2.3, z0 - 19], [ 1.9, z0 - 24], [ 2.2, z0 - 29],
      [ 0.0, z0 - 33]
    ];
    spots.forEach(([x, z], i) => {
      const t = new THREE.Mesh(tableTop, M.wood);
      t.position.set(x, 0.75, z);
      S.add(t);
      const s = new THREE.Mesh(stem, M.frame);
      s.position.set(x, 0.38, z);
      S.add(s);
      const c = new THREE.Mesh(cup, M.light);
      c.position.set(x + 0.2, 0.83, z + 0.13);
      S.add(c);
      if (i % 2) {
        const lap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.3), M.paper);
        lap.position.set(x - 0.08, 0.8, z - 0.05);
        lap.rotation.y = 0.3;
        S.add(lap);
      }
      for (const dz of [-0.9, 0.9]) {
        const st = new THREE.Mesh(stool, i % 2 ? M.sage : M.sageDeep);
        st.position.set(x, 0.5, z + dz);
        S.add(st);
        const sl = new THREE.Mesh(stoolLeg, M.frame);
        sl.position.set(x, 0.24, z + dz);
        S.add(sl);
      }
    });

    /* a banquette down the closed wall, with its own low tables */
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 26), M.sageDeep);
    bench.position.set(8.9, 0.22, z0 - 16);
    S.add(bench);
    const backRest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.75, 26), M.sage);
    backRest.position.set(9.45, 0.82, z0 - 16);
    S.add(backRest);
    for (let i = 0; i < 6; i++) {
      const z = z0 - 4 - i * 5;
      const t = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.07, 1.3), M.wood);
      t.position.set(7.4, 0.72, z);
      S.add(t);
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.72, 0.09), M.frame);
      l.position.set(7.4, 0.36, z);
      S.add(l);
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.09, 12), M.light);
      c.position.set(7.3, 0.8, z + 0.2);
      S.add(c);
    }

    /* a long shared table under the windows */
    const shared = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 7), M.wood);
    shared.position.set(-8.2, 0.76, z0 - 22);
    S.add(shared);
    for (const dz of [-3, 3]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.76, 0.09), M.frame);
      l.position.set(-8.2, 0.38, z0 - 22 + dz);
      S.add(l);
    }

    const cone = new THREE.ConeGeometry(0.3, 0.36, 18, 1, true);
    for (let i = 0; i < 6; i++) {
      const z = z0 - 2 - i * 4;
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.0, 6), M.frame);
      cord.position.set(-4.6, 4.0, z);
      S.add(cord);
      const c = new THREE.Mesh(cone, M.frame);
      c.position.set(-4.6, 2.9, z);
      c.rotation.x = Math.PI;
      S.add(c);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), M.light);
      bulb.position.set(-4.6, 2.78, z);
      S.add(bulb);
    }
    const warm = new THREE.PointLight(new THREE.Color('#FFDFAE'), 14, 20, 2);
    warm.position.set(-4.6, 2.9, z0 - 12);
    S.add(warm);

    plants(THREE, S, [[-8.7, z0 - 1], [8.6, z0 - 6], [8.6, z0 - 20], [-8.7, z0 - 31], [8.6, z0 - 34]], M, 1.15);
  }

  /* Low-poly planters — three faceted spheres over a tapered pot. */
  function plants(THREE, S, spots, M, scale) {
    const pot = new THREE.CylinderGeometry(0.3, 0.38, 0.6, 14);
    const leaf = new THREE.IcosahedronGeometry(0.46, 0);
    spots.forEach(([x, z], i) => {
      const g = new THREE.Group();
      const p = new THREE.Mesh(pot, M.woodDeep);
      p.position.y = 0.3;
      g.add(p);
      for (let k = 0; k < 3; k++) {
        const l = new THREE.Mesh(leaf, M.leaf);
        l.position.set((k - 1) * 0.28, 0.85 + k * 0.34, (k % 2 ? 0.18 : -0.14));
        l.scale.setScalar(1 - k * 0.16);
        l.rotation.set(k, k * 1.7, 0);
        g.add(l);
      }
      g.position.set(x, 0, z);
      g.scale.setScalar((scale || 1) * (0.9 + (i % 3) * 0.12));
      S.add(g);
    });
  }

  function buildShafts(THREE, S) {
    const mat = new THREE.MeshBasicMaterial({
      map: shaftTexture(THREE), transparent: true, opacity: 0.26,
      depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
    const geo = new THREE.PlaneGeometry(7, 6);
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(-6.4, 3.0, 0 - i * 18);
      m.rotation.y = Math.PI / 2 - 0.4;
      m.rotation.z = 0.2;
      S.add(m);
    }
  }

  FS.World = { build: buildWorld, ZONES, floorTexture, shaftTexture };
})(window.FS);
