/* ═══════════════════════════════════════════════════════════════════════
   HERO 3D — the cinematic opening.

   Instead of streaming a video file, the hero flies a camera through the
   shared world in js/world.js: modern offices, study desks, a training
   hall and a quiet café. A cinematographer's shot list dollies between
   set-ups and cuts between them, so it reads as film footage but weighs
   nothing and starts instantly.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const P = FS.CONFIG.palette;

  /* ── shot list: from → to, with a moving look-at target ─────────────── */
  const SHOTS = [
    { from: [ 0.0, 1.70,  10], to: [ 0.0, 1.70,  -4], la: [ 0.0, 1.50, -20], lb: [ 0.0, 1.40, -30], fov: 40, dur: 8.5 },
    { from: [-2.6, 1.45,  -4], to: [-2.6, 1.45, -18], la: [-4.8, 1.10, -10], lb: [-4.8, 1.05, -24], fov: 46, dur: 7.0 },
    { from: [ 3.4, 3.20, -26], to: [ 1.2, 2.00, -40], la: [ 0.0, 1.30, -42], lb: [ 0.0, 1.50, -54], fov: 42, dur: 7.5 },
    { from: [ 0.0, 2.40, -60], to: [ 0.0, 2.00, -76], la: [ 0.0, 2.20,-101], lb: [ 0.0, 2.10,-101], fov: 40, dur: 8.5 },
    { from: [-4.6, 1.00, -88], to: [ 2.8, 1.00, -88], la: [ 0.0, 1.60,-101], lb: [ 0.0, 1.60,-101], fov: 50, dur: 7.0 },
    { from: [-2.4, 1.50,-108], to: [-2.4, 1.50,-124], la: [-6.2, 1.30,-119], lb: [-6.2, 1.30,-133], fov: 46, dur: 7.5 },
    { from: [ 2.0, 1.35,-142], to: [-1.0, 1.45,-137], la: [-0.6, 1.05,-144], lb: [-1.2, 1.05,-147], fov: 48, dur: 7.0 },
    { from: [ 0.0, 1.90,-150], to: [ 0.0, 2.60,-116], la: [ 0.0, 1.80, -70], lb: [ 0.0, 1.80, -40], fov: 34, dur: 9.5 }
  ];


  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const easeOut    = t => 1 - Math.pow(1 - t, 3);

  /* ═══════════════════════════════════════════════════════════════════ */
  class Hero3D {
    constructor(canvas) {
      this.canvas = canvas;
      this.running = false;
      this.shot = 0;
      this.shotT = 0;
      this.cut = 0;          // 0..1 fade at a cut
      this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      this.scrollK = 0;
      this.last = 0;
      this.disposed = false;
    }

    init() {
      const THREE = window.THREE;
      if (!THREE) return false;
      this.THREE = THREE;

      const mobile = window.innerWidth < 820;
      this.mobile = mobile;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: !mobile,
          alpha: false,
          powerPreference: 'high-performance'
        });
      } catch (e) {
        /* no WebGL: the hero keeps its still poster */
        return false;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      this.renderer = renderer;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#CBD4CB');
      scene.fog = new THREE.FogExp2(new THREE.Color('#CBD4CB'), 0.014);
      this.scene = scene;

      this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
      this.lookAt = new THREE.Vector3(0, 1.6, -30);

      this.M = FS.World.build(THREE, scene);
      this.buildDust();
      this.resize();
      window.addEventListener('resize', this._onResize = () => this.resize());
      window.addEventListener('pointermove', this._onPointer = e => {
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });

      this.applyShot(0, 0);
      renderer.render(scene, this.camera);
      return true;
    }

    buildDust() {
      const THREE = this.THREE;
      const count = this.mobile ? 260 : 520;
      const pos = new Float32Array(count * 3);
      this.dustSeed = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 22;
        pos[i * 3 + 1] = Math.random() * 5.4 + 0.3;
        pos[i * 3 + 2] = 12 - Math.random() * 180;
        this.dustSeed[i] = Math.random() * 6.283;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color('#FFF3DA'), size: 0.045, sizeAttenuation: true,
        transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending
      });
      this.dust = new THREE.Points(geo, mat);
      this.scene.add(this.dust);
      this.dustBase = pos.slice();
    }

    /* ── camera choreography ─────────────────────────────────────────── */
    applyShot(index, k) {
      const s = SHOTS[index];
      const e = easeInOut(k);
      const cam = this.camera;
      cam.position.set(
        s.from[0] + (s.to[0] - s.from[0]) * e,
        s.from[1] + (s.to[1] - s.from[1]) * e,
        s.from[2] + (s.to[2] - s.from[2]) * e
      );
      this.lookAt.set(
        s.la[0] + (s.lb[0] - s.la[0]) * e,
        s.la[1] + (s.lb[1] - s.la[1]) * e,
        s.la[2] + (s.lb[2] - s.la[2]) * e
      );

      /* a hint of handheld float, and pointer parallax */
      const t = this.elapsed || 0;
      const drift = FS.Motion && FS.Motion.reduced() ? 0 : 1;
      this.pointer.sx += (this.pointer.x - this.pointer.sx) * 0.05;
      this.pointer.sy += (this.pointer.y - this.pointer.sy) * 0.05;
      cam.position.x += (Math.sin(t * 0.31) * 0.06 + this.pointer.sx * 0.42) * drift;
      cam.position.y += (Math.sin(t * 0.47 + 1.3) * 0.035 - this.pointer.sy * 0.20) * drift;

      /* a portrait viewport otherwise fills with ceiling and floor */
      const portrait = cam.aspect < 0.9;
      cam.fov = (s.fov + this.scrollK * 10) * (portrait ? 0.86 : 1);
      cam.updateProjectionMatrix();
      cam.lookAt(this.lookAt);
      cam.rotation.z = Math.sin(t * 0.21) * 0.006 * drift;
    }

    tick(now) {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(t => this.tick(t));
      if (!this.running) return;

      const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
      this.last = now;
      this.elapsed = (this.elapsed || 0) + dt;

      const still = FS.Motion && FS.Motion.reduced();
      if (still) {
        this.applyShot(0, 0.35);
      } else {
        this.shotT += dt;
        const s = SHOTS[this.shot];
        if (this.shotT >= s.dur) {
          this.shotT = 0;
          this.shot = (this.shot + 1) % SHOTS.length;
          this.cut = 1;                       /* fade in from the cut */
        }
        this.cut = Math.max(0, this.cut - dt * 3.4);
        this.applyShot(this.shot, this.shotT / SHOTS[this.shot].dur);

        /* dust drift */
        if (this.dust) {
          const arr = this.dust.geometry.attributes.position.array;
          for (let i = 0; i < this.dustSeed.length; i++) {
            const p = this.dustSeed[i];
            arr[i * 3]     = this.dustBase[i * 3] + Math.sin(this.elapsed * 0.25 + p) * 0.5;
            arr[i * 3 + 1] = this.dustBase[i * 3 + 1] + Math.sin(this.elapsed * 0.19 + p * 1.7) * 0.35;
          }
          this.dust.geometry.attributes.position.needsUpdate = true;
        }
      }

      this.renderer.toneMappingExposure = 1.0 * (1 - this.cut * 0.85);
      this.renderer.render(this.scene, this.camera);
    }

    resize() {
      if (!this.renderer) return;
      const w = this.canvas.clientWidth || window.innerWidth;
      const h = this.canvas.clientHeight || window.innerHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / Math.max(1, h);
      this.camera.updateProjectionMatrix();
    }

    setScroll(k) { this.scrollK = Math.max(0, Math.min(1, k)); }

    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      if (!this.raf) this.raf = requestAnimationFrame(t => this.tick(t));
    }
    stop() { this.running = false; }

    dispose() {
      this.disposed = true;
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('pointermove', this._onPointer);
      this.scene && this.scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      this.renderer && this.renderer.dispose();
    }
  }

  FS.Hero3D = Hero3D;
})(window.FS);
