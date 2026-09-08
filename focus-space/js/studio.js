/* ═══════════════════════════════════════════════════════════════════════
   STUDIO — the photography.

   Every card, category tile and detail header is a real photograph taken
   inside the same three.js world the hero flies through: an offscreen
   renderer places a camera at a seeded set-up in the right zone, renders
   one frame, then grades it (warm curve, vignette, grain) on a 2D canvas.
   No image is ever downloaded, and each space keeps the same photograph
   for the life of the session.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const W = 1100, H = 700;

  /* Camera set-ups, per zone. A space always gets the same one. */
  const SETUPS = {
    offices: [
      { pos: [-1.6, 1.50,  -2], tgt: [-4.6, 1.00, -12], fov: 46 },
      { pos: [ 0.8, 1.50,  -6], tgt: [ 4.6, 1.00, -18], fov: 46 },
      { pos: [-5.4, 1.55,  -4], tgt: [-7.2, 1.15, -17], fov: 52 },
      { pos: [ 0.0, 2.30, -16], tgt: [ 0.0, 1.15, -32], fov: 40 },
      { pos: [ 4.2, 1.60, -20], tgt: [ 7.2, 1.10, -33], fov: 50 },
      { pos: [-2.8, 1.45, -26], tgt: [-4.8, 1.00, -40], fov: 46 },
      { pos: [ 3.2, 1.70, -30], tgt: [-2.6, 1.20, -41], fov: 50 }
    ],
    halls: [
      { pos: [ 0.0, 2.10, -84], tgt: [ 0.0, 1.90, -101], fov: 44 },
      { pos: [-3.2, 1.25, -84], tgt: [ 1.8, 1.35,  -96], fov: 50 },
      { pos: [ 4.2, 1.60, -86], tgt: [-1.0, 1.40,  -98], fov: 50 },
      { pos: [ 0.0, 3.60, -82], tgt: [ 0.0, 1.00,  -96], fov: 44 },
      { pos: [-3.0, 1.50, -90], tgt: [ 1.6, 1.40,  -99], fov: 50 },
      { pos: [ 5.2, 1.70, -80], tgt: [-1.0, 1.40,  -95], fov: 48 },
      { pos: [ 0.0, 2.00, -76], tgt: [ 0.0, 1.70,  -98], fov: 42 }
    ],
    cafes: [
      { pos: [-2.6, 1.50, -112], tgt: [-6.2, 1.15, -122], fov: 48 },
      { pos: [ 0.2, 1.15, -121], tgt: [-2.2, 0.85, -128], fov: 50 },
      { pos: [ 0.6, 1.25, -134], tgt: [-2.4, 0.95, -144], fov: 50 },
      { pos: [-3.6, 1.50, -128], tgt: [-6.4, 1.60, -138], fov: 46 },
      { pos: [ 4.2, 1.40, -118], tgt: [-1.5, 1.00, -132], fov: 52 },
      { pos: [ 1.2, 2.20, -126], tgt: [-3.0, 0.90, -138], fov: 44 },
      { pos: [-0.8, 1.30, -138], tgt: [-4.6, 1.20, -127], fov: 50 }
    ]
  };


  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  const cache = new Map();
  const queue = [];
  let studio = null, working = false, idleTimer = 0, unsupported = false;

  function supported() {
    if (unsupported) return false;
    if (!window.THREE) return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) { return false; }
  }

  function boot() {
    if (studio) return studio;
    const THREE = window.THREE;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, preserveDrawingBuffer: true, alpha: false
      });
    } catch (e) { unsupported = true; return null; }

    renderer.setPixelRatio(1);
    renderer.setSize(W, H, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#D7DDD7');
    scene.fog = new THREE.FogExp2(new THREE.Color('#D7DDD7'), 0.019);
    FS.World.build(THREE, scene);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 400);

    /* the grading canvas, and a grain tile mixed once and reused */
    const grade = document.createElement('canvas');
    grade.width = W; grade.height = H;
    const gctx = grade.getContext('2d');

    const tile = document.createElement('canvas');
    tile.width = tile.height = 128;
    const tctx = tile.getContext('2d');
    const noise = tctx.createImageData(128, 128);
    let s = 0x9E3779B9;
    for (let i = 0; i < noise.data.length; i += 4) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const v = s >>> 24;
      noise.data[i] = noise.data[i + 1] = noise.data[i + 2] = v;
      noise.data[i + 3] = 255;
    }
    tctx.putImageData(noise, 0, 0);

    studio = { THREE, renderer, scene, camera, grade, canvas,
               grainPattern: gctx.createPattern(tile, 'repeat') };

    /* A browser under context pressure can take this one away; drop the
       studio so the next request rebuilds it instead of shooting black. */
    canvas.addEventListener('webglcontextlost', e => {
      e.preventDefault();
      studio = null;
    });
    return studio;
  }

  function retire() {
    if (!studio) return;
    studio.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
      }
    });
    studio.renderer.dispose();
    if (studio.renderer.forceContextLoss) studio.renderer.forceContextLoss();
    studio = null;
  }

  /* Warm grade + vignette + grain, so a render reads as a photograph. */
  function develop(src) {
    const g = studio.grade.getContext('2d');
    g.clearRect(0, 0, W, H);
    g.drawImage(src, 0, 0, W, H);

    const warm = g.createLinearGradient(0, 0, 0, H);
    warm.addColorStop(0, 'rgba(255,244,222,0.16)');
    warm.addColorStop(1, 'rgba(76,97,82,0.10)');
    g.fillStyle = warm;
    g.fillRect(0, 0, W, H);

    const vig = g.createRadialGradient(W * 0.5, H * 0.46, H * 0.22, W * 0.5, H * 0.5, H * 0.92);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(30,38,32,0.40)');
    g.fillStyle = vig;
    g.fillRect(0, 0, W, H);

    if (studio.grainPattern) {
      g.globalAlpha = 0.055;
      g.fillStyle = studio.grainPattern;
      g.fillRect(0, 0, W, H);
      g.globalAlpha = 1;
    }

    return studio.grade.toDataURL('image/jpeg', 0.84);
  }

  function shoot(kind, seed) {
    const st = boot();
    if (!st) return null;
    const list = SETUPS[kind] || SETUPS.offices;
    const setup = list[hash(kind + '|' + seed) % list.length];
    const jitter = ((hash('j' + seed) % 1000) / 1000 - 0.5);

    st.camera.fov = setup.fov + jitter * 3;
    st.camera.position.set(setup.pos[0] + jitter * 0.5, setup.pos[1], setup.pos[2] + jitter * 1.2);
    st.camera.lookAt(setup.tgt[0], setup.tgt[1], setup.tgt[2]);
    st.camera.updateProjectionMatrix();
    st.renderer.toneMappingExposure = 0.96 + jitter * 0.14;
    st.renderer.render(st.scene, st.camera);
    return develop(st.canvas);
  }

  function pump() {
    if (working || !queue.length) return;
    working = true;
    requestAnimationFrame(() => {
      const job = queue.shift();
      if (job) {
        const key = job.kind + '|' + job.seed;
        let url = cache.get(key);
        if (!url) {
          url = shoot(job.kind, job.seed);
          if (url) cache.set(key, url);
        }
        job.done(url);
      }
      working = false;
      if (queue.length) pump();
      else {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(retire, 20000);
      }
    });
  }

  function request(kind, seed) {
    return new Promise(resolve => {
      const key = kind + '|' + seed;
      if (cache.has(key)) { resolve(cache.get(key)); return; }
      if (!supported()) { resolve(null); return; }
      clearTimeout(idleTimer);
      queue.push({ kind, seed, done: resolve });
      pump();
    });
  }

  /* Swap the placeholder on every [data-photo] image once it is on screen. */
  let io = null;
  function hydrate(root) {
    if (!supported()) return;
    const nodes = (root || document).querySelectorAll('img[data-photo]:not([data-photo-done])');
    if (!nodes.length) return;

    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const img = e.target;
          io.unobserve(img);
          const [kind, seed] = img.getAttribute('data-photo').split('|');
          img.setAttribute('data-photo-done', '1');
          request(kind, seed).then(url => {
            if (!url || !img.isConnected) return;
            const pre = new Image();
            pre.onload = () => {
              img.src = url;
              img.classList.add('is-photo');
            };
            pre.src = url;
          });
        });
      }, { rootMargin: '320px 0px' });
    }
    nodes.forEach(n => io.observe(n));
  }

  FS.Studio = { supported, request, hydrate, cached: (k, s) => cache.get(k + '|' + s) || null };
})(window.FS);
