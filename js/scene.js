/* ═══════════════════════════════════════════════════════════════════════
   SCENE — one continuous 3D world. The page scroll drives a camera that
   flies between three stations while the structural objects transform:
   formwork unfolds, a truss assembles itself, drawings fold away and the
   truss stands up as a column for the closing page.
   ═══════════════════════════════════════════════════════════════════════ */
(function (DAL) {
  'use strict';

  const U = DAL.U;

  DAL.Scene = class Portfolio3D {
    constructor(canvas) {
      this.canvas  = canvas;
      this.clock   = new THREE.Clock();
      this.t       = 0;          // damped page position 0..2
      this.tTarget = 0;
      this.pointer = new THREE.Vector2(0, 0);
      this.pointerS = new THREE.Vector2(0, 0);
      this.anchors = [0, 1, 2];
      this.reduced = U.prefersReducedMotion();
      this.frames  = 0;
      this.fpsAcc  = 0;
      this.paused  = false;
      this.elapsed = 0;
    }

    /* ═══════════════════════ setup ═══════════════════════ */
    init() {
      const mobile = window.innerWidth < 820 || U.isTouch();
      this.mobile = mobile;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: !mobile,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.6 : 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.02;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.autoClear = false;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(54, 1, 0.05, 90);
      this.camLook = new THREE.Vector3();

      /* the poured concrete background, sharing this camera */
      this.pour = new DAL.ConcretePour(this.renderer, {
        scale:  mobile ? 0.42 : 0.58,
        steps:  mobile ? 62 : 92,
        shadowSteps: mobile ? 11 : 20
      });

      this.buildWorld();
      this.bind();
      this.measure();
      this.resize();
      return this;
    }

    buildWorld() {
      const S = DAL.Structures;
      const rnd = U.rng(20260907);
      const scene = this.scene;

      scene.environment = S.environment(this.renderer);
      const mats = this.mats = S.materials();

      /* ── lighting, matched to the shader's key direction ── */
      const key = new THREE.DirectionalLight(0xffeecc, 2.6);
      key.position.set(-0.42, 0.80, 0.43).normalize().multiplyScalar(14);
      key.castShadow = true;
      key.shadow.mapSize.set(this.mobile ? 1024 : 2048, this.mobile ? 1024 : 2048);
      const sc = key.shadow.camera;
      sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9;
      sc.near = 1; sc.far = 34;
      key.shadow.bias = -0.0009;
      key.shadow.normalBias = 0.02;
      scene.add(key);

      scene.add(new THREE.HemisphereLight(0xd8bb92, 0x2b1c14, 0.85));

      const fill = new THREE.DirectionalLight(0xcfd8e6, 0.55);
      fill.position.set(6, 4, 5);
      scene.add(fill);

      const rim = new THREE.PointLight(0xf3e5ab, 3.2, 8, 2);
      rim.position.set(1.4, 2.5, 2.2);
      scene.add(rim);
      this.rim = rim;

      /* ── invisible catcher so meshes cast onto the poured slab ── */
      const catcher = new THREE.Mesh(
        new THREE.PlaneGeometry(46, 46),
        new THREE.ShadowMaterial({ color: 0x140c07, opacity: 0.5 })
      );
      catcher.rotation.x = -Math.PI / 2;
      catcher.position.y = 0.006;
      catcher.receiveShadow = true;
      scene.add(catcher);

      /* ── setting-out lines and traces ── */
      scene.add(S.gridLines(mats));
      scene.add(S.structuralTraces(mats, rnd));

      /* ── concrete columns receding into the haze ── */
      scene.add(S.columns(mats, rnd));

      /* ── steel: two crossing beams that pivot through the journey ── */
      const beams = this.beams = new THREE.Group();
      const b1 = S.iBeam(3.9, mats.steel);
      b1.position.set(0, 0, 0);
      const b2 = S.iBeam(3.2, mats.steel, { b: 0.24, d: 0.36, tf: 0.03, tw: 0.02 });
      b2.rotation.y = Math.PI / 2;
      b2.position.set(0.4, 0.44, 0);
      const p1 = S.endPlate(mats.steelDark); p1.position.set(0, 0, 1.96);
      const p2 = S.endPlate(mats.steelDark); p2.position.set(0, 0, -1.96);
      beams.add(b1, b2, p1, p2);
      beams.position.set(2.60, 1.58, 0.55);
      beams.rotation.set(0, -0.34, 0.10);
      scene.add(beams);

      /* ── rebar cage rising out of the pour ── */
      const cage = this.cage = S.rebarCage(mats, { w: 0.58, h: 2.3 });
      cage.position.set(3.15, 0.02, -0.35);
      scene.add(cage);

      /* ── plywood formwork that unfolds ── */
      const form = this.form = S.formwork(mats, { w: 1.6, h: 1.2, d: 1.6 });
      form.position.set(-1.95, 0.0, -3.15);
      form.rotation.y = -0.34;
      scene.add(form);
      /* remember each panel's rest transform so it can hinge open */
      this.formPanels = form.children.filter(c => c.userData.panel)
        .map(c => ({ o: c, rot: c.rotation.clone(), pos: c.position.clone() }));

      /* ── the truss that assembles, then stands up ── */
      const truss = this.truss = S.truss(mats, { bays: 6, span: 1.05, depth: 0.78 });
      truss.position.set(0.35, 2.9, -2.2);
      truss.rotation.set(0, 0.16, 0);
      truss.userData.sequence.forEach((m, i) => {
        m.userData.order = i / truss.userData.sequence.length;
        m.scale.set(0.001, 0.001, 0.001);
      });
      scene.add(truss);

      /* ── technical drawings floating in the site ── */
      this.drawings = S.drawings();
      scene.add(this.drawings);

      /* ── cement dust ── */
      this.dust = S.dust(this.mobile ? 180 : 420, rnd);
      scene.add(this.dust);

      /* ── a slender monument the closing page resolves onto ── */
      const mon = this.monument = new THREE.Group();
      const shaft = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 5.4, 0.5), mats.conc
      );
      shaft.position.y = 2.7;
      shaft.castShadow = shaft.receiveShadow = true;
      mon.add(shaft);
      mon.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(shaft.geometry),
        new THREE.LineBasicMaterial({ color: 0xe3c9a0, transparent: true, opacity: 0.22 })
      ).translateY(2.7));
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.02, 6, 4), mats.steel
      );
      band.rotation.x = Math.PI / 2; band.rotation.z = Math.PI / 4;
      band.position.y = 4.2;
      mon.add(band);
      mon.position.set(-2.9, 0, -3.6);
      mon.scale.setScalar(0.001);
      scene.add(mon);
    }

    /* ═══════════════════════ events ═══════════════════════ */
    bind() {
      this._onResize = () => { this.measure(); this.resize(); };
      window.addEventListener('resize', this._onResize, { passive: true });
      window.addEventListener('orientationchange', this._onResize);

      this._onScroll = () => this.readScroll();
      window.addEventListener('scroll', this._onScroll, { passive: true });

      if (!U.isTouch()) {
        window.addEventListener('pointermove', (e) => {
          this.pointer.set(
            (e.clientX / window.innerWidth) * 2 - 1,
            (e.clientY / window.innerHeight) * 2 - 1
          );
        }, { passive: true });
      }

      document.addEventListener('visibilitychange', () => {
        this.paused = document.hidden;
        if (!this.paused) this.clock.getDelta();   // discard the gap
      });
    }

    measure() {
      const secs = Array.from(document.querySelectorAll('[data-section]'));
      this.sections = secs;
      this.anchors = secs.map(s => s.offsetTop - window.innerHeight * 0.35);
      this.anchors[0] = 0;
      this.readScroll();
    }

    readScroll() {
      const y = window.scrollY || window.pageYOffset;
      const a = this.anchors;
      let t = 0;
      if (y <= a[0]) t = 0;
      else if (y >= a[a.length - 1]) t = a.length - 1;
      else {
        for (let i = 0; i < a.length - 1; i++) {
          if (y >= a[i] && y < a[i + 1]) {
            t = i + (y - a[i]) / Math.max(a[i + 1] - a[i], 1);
            break;
          }
        }
      }
      this.tTarget = U.clamp(t, 0, a.length - 1);
    }

    resize() {
      const w = window.innerWidth, h = window.innerHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.pour.resize(
        Math.round(w * this.renderer.getPixelRatio()),
        Math.round(h * this.renderer.getPixelRatio())
      );
    }

    /* ═══════════════════════ choreography ═══════════════════════ */

    updateCamera(dt, dtd) {
      const K = DAL.KEYFRAMES;
      const t = this.t;

      const px = U.track(K.map(k => k.pos[0]), t);
      const py = U.track(K.map(k => k.pos[1]), t);
      const pz = U.track(K.map(k => k.pos[2]), t);
      const tx = U.track(K.map(k => k.tgt[0]), t);
      const ty = U.track(K.map(k => k.tgt[1]), t);
      const tz = U.track(K.map(k => k.tgt[2]), t);
      const fov = U.track(K.map(k => k.fov), t);
      const roll = U.track(K.map(k => k.roll), t);

      /* a slow orbital breath so the frame is never dead still */
      const br = this.reduced ? 0 : 1;
      const wob = Math.sin(this.elapsed * 0.24) * 0.16 * br;
      const bob = Math.cos(this.elapsed * 0.31) * 0.07 * br;

      /* pointer parallax */
      this.pointerS.x = U.damp(this.pointerS.x, this.pointer.x, 2.6, dtd || dt);
      this.pointerS.y = U.damp(this.pointerS.y, this.pointer.y, 2.6, dtd || dt);
      const par = this.reduced ? 0 : 1;

      this.camLook.set(
        tx + this.pointerS.x * 0.20 * par,
        ty - this.pointerS.y * 0.13 * par,
        tz
      );
      this.camera.position.set(
        px + wob + this.pointerS.x * 0.62 * par,
        py + bob - this.pointerS.y * 0.34 * par,
        pz + Math.cos(this.elapsed * 0.19) * 0.12 * br
      );

      /* on a portrait viewport the horizontal field collapses, so back the
         camera off along its own view vector and widen the lens */
      const port = U.clamp((0.92 - this.camera.aspect) / 0.55, 0, 1);
      if (port > 0) {
        this.camera.position.sub(this.camLook)
          .multiplyScalar(1 + port * 0.26)
          .add(this.camLook);
      }

      this.camera.lookAt(this.camLook);
      if (roll) this.camera.rotateZ(roll + this.pointerS.x * 0.012 * par);

      const fovAdj = fov + port * 5;
      if (Math.abs(this.camera.fov - fovAdj) > 0.01) {
        this.camera.fov = fovAdj;
        this.camera.updateProjectionMatrix();
      }
      this.camera.updateMatrixWorld();
    }

    updateObjects(dt) {
      const t = this.t;
      const e = this.elapsed;

      /* ── steel beams: pivot and lift across the whole journey ── */
      const b = this.beams;
      b.rotation.y = U.track([-0.34, -0.86, -1.48], t);
      b.rotation.z = U.track([ 0.10,  0.02,  0.42], t);
      b.rotation.x = U.track([0.00, 0.14, 0.05], t) + Math.sin(e * 0.4) * 0.012;
      b.position.set(
        U.track([ 2.60, -1.05, -1.75], t),
        U.track([ 1.58,  2.05,  3.10], t) + Math.sin(e * 0.55) * 0.035,
        U.track([ 0.55, -0.30, -1.15], t)
      );

      /* ── rebar cage: extends as the pour continues ── */
      const grow = U.smoothstep(U.clamp(e / 3.2, 0, 1));
      this.cage.scale.set(1, 0.15 + 0.85 * grow, 1);
      this.cage.rotation.y = 0.2 + e * 0.045 + t * 0.5;
      this.cage.position.y = 0.02;

      /* ── formwork: hinges open between page 1 and page 2 ── */
      const open = U.smoothstep((t - 0.10) / 0.85);
      this.formPanels.forEach((p, i) => {
        const s = (i % 3) - 1;                    // -1, 0, 1 per panel
        p.o.rotation.z = p.rot.z + open * 0.42 * s;
        p.o.rotation.x = p.rot.x + open * 0.16 * (i % 2 ? 1 : -1);
        p.o.position.y = p.pos.y + open * (0.14 + 0.08 * i);
        p.o.position.x = p.pos.x + open * 0.30 * s;
      });
      this.form.rotation.y = -0.34 + U.track([0, 0.55, 1.25], t);
      this.form.position.y = U.track([0, 0.25, -0.9], t);

      /* ── truss: members assemble one by one, then it stands upright ── */
      const asm = U.clamp((t - 0.55) / 0.75, 0, 1);
      this.truss.userData.sequence.forEach(m => {
        const k = U.smoothstep((asm - m.userData.order * 0.65) / 0.35);
        m.scale.setScalar(0.001 + k * 0.999);
      });
      const stand = U.smoothstep((t - 1.35) / 0.65);
      this.truss.rotation.z = -stand * Math.PI * 0.5;
      this.truss.rotation.y = 0.16 + U.track([0, 0.42, 1.15], t) + e * 0.02;
      this.truss.position.set(
        U.track([0.35, 0.10, -1.55], t),
        U.track([2.90, 1.72,  2.45], t) + Math.sin(e * 0.42) * 0.03,
        U.track([-2.20, -1.30, -2.85], t)
      );

      /* ── drawings: slide in for page 2, fold away for page 3 ── */
      this.drawings.children.forEach((o, i) => {
        if (!o.userData.basePos) return;
        const near = 1 - Math.abs(t - 1);                       // peaks on page 2
        const op = o.userData.baseOpacity * U.clamp(0.22 + near * 1.15, 0, 1);
        o.material.opacity = op;
        if (o.userData.edge) o.userData.edge.material.opacity = op * 0.7;
        const drift = Math.sin(e * 0.35 + i) * 0.05;
        const push  = U.track([1.15, 0, 1.9], t);
        o.position.set(
          o.userData.basePos.x * (1 + push * 0.16),
          o.userData.basePos.y + drift + push * 0.55,
          o.userData.basePos.z - push * 1.5
        );
        o.rotation.y += 0.0004;
        if (o.userData.edge) {
          o.userData.edge.position.copy(o.position);
          o.userData.edge.rotation.copy(o.rotation);
        }
      });

      /* ── monument grows for the closing page ── */
      const mk = U.smoothstep((t - 1.15) / 0.8);
      this.monument.scale.set(1, 0.001 + mk * 0.999, 1);
      this.monument.scale.x = this.monument.scale.z = 0.4 + mk * 0.6;
      this.monument.rotation.y = 0.3 + t * 0.22 + e * 0.03;

      /* ── dust drift ── */
      if (!this.reduced) {
        const pos = this.dust.geometry.attributes.position;
        const spd = this.dust.userData.speeds;
        const arr = pos.array;
        for (let i = 0; i < spd.length; i++) {
          const j = i * 3;
          arr[j + 1] += spd[i] * dt * 0.55;
          arr[j]     += Math.sin(this.elapsed * 0.3 + i) * dt * 0.05;
          if (arr[j + 1] > 9.5) arr[j + 1] = -0.2;
        }
        pos.needsUpdate = true;
      }
      this.dust.material.opacity = 0.30 + 0.22 * Math.abs(Math.sin(e * 0.4));

      /* ── the rim light rides the pour ── */
      this.rim.position.set(
        this.pour.pour.x + 0.9,
        2.3 + Math.sin(e * 0.8) * 0.18,
        this.pour.pour.y + 1.9
      );
      this.rim.intensity = 2.9 + Math.sin(e * 1.7) * 0.6;
    }

    /* ═══════════════════════ frame ═══════════════════════ */
    frame() {
      const raw = this.clock.getDelta();
      if (this.paused) return;
      /* dt drives time-based motion and is capped hard so a stall never
         teleports the animation; dtd drives the eased approach to targets and
         is capped loosely so a low frame rate still converges in real time */
      const dt  = Math.min(raw, 1 / 20);
      const dtd = Math.min(raw, 0.25);
      this.elapsed += this.reduced ? dt * 0.15 : dt;

      /* damped page position → every transition is eased, never snappy */
      this.t = U.damp(this.t, this.tTarget, 3.4, dtd);

      /* the pour follows the pointer a little: it reacts to the visitor */
      this.pour.setPourDrift(
        1.25 + this.pointerS.x * 0.38 + Math.sin(this.elapsed * 0.17) * 0.15,
       -0.30 + this.pointerS.y * 0.20 + Math.cos(this.elapsed * 0.21) * 0.13
      );

      this.updateCamera(dt, dtd);
      this.pour.update(dt, this.elapsed, this.camera);
      this.updateObjects(dt);

      /* background pass first (it owns the frame), then the structures */
      this.renderer.clear();
      this.pour.render();
      this.renderer.clearDepth();
      this.renderer.render(this.scene, this.camera);

      this.adapt(dt);
    }

    /* keep the frame rate honest by trading raymarch resolution */
    adapt(dt) {
      this.frames++;
      this.fpsAcc += dt;
      if (this.frames < 70) return;
      const fps = this.frames / this.fpsAcc;
      this.frames = 0; this.fpsAcc = 0;

      const target = this.mobile ? 0.42 : 0.58;
      if (fps < 42 && this.pour.scale > 0.30) {
        this.pour.setScale(this.pour.scale - 0.07);
        this.pour.uniforms.uSteps.value = Math.max(46, this.pour.uniforms.uSteps.value - 8);
      } else if (fps > 57 && this.pour.scale < target) {
        this.pour.setScale(this.pour.scale + 0.05);
      }
    }

    start() {
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        this.frame();
      };
      this.clock.getDelta();
      loop();
      return this;
    }
  };

})(window.DAL);
