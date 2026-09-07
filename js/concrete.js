/* ═══════════════════════════════════════════════════════════════════════
   CONCRETE POUR — a raymarched, physically-motivated concrete stream.

   · the stream thins as it falls (mass continuity + free fall: r ∝ √(v₀/v))
   · varicose necking gives the beaded look of a viscous jet
   · the jet merges into the slab with a smooth-minimum (surface tension)
   · the slab is a height field: flat top, rounded rim, impact mound,
     radiating ripples and slow viscous surface waves
   · lit with a key light + soft raymarched shadows, SDF ambient occlusion,
     GGX-ish specular, wet-sheen fresnel near the impact, aggregate speckle
     bump mapping and plywood-formwork ground

   The shader camera is driven by the real three.js camera matrix, so the
   poured concrete lives in the same world space as the steel and formwork.
   ═══════════════════════════════════════════════════════════════════════ */
(function (DAL) {
  'use strict';

  const VERT = /* glsl */`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const FRAG = /* glsl */`
    precision highp float;

    varying vec2 vUv;

    uniform vec2  uRes;
    uniform float uTime;
    uniform float uAspect;
    uniform float uFovTan;
    uniform mat4  uCamMat;
    uniform vec2  uPour;       // xz of the nozzle
    uniform float uPourY;      // nozzle height
    uniform float uSpread;     // slab radius
    uniform float uFlow;       // 0..1 flow strength
    uniform float uSteps;
    uniform float uShadowQ;

    #define MAXD 46.0
    #define SURF 0.0016

    /* ── palette (linear-ish) ─────────────────────────────────────── */
    const vec3 UMBER      = vec3(0.290, 0.196, 0.149);
    const vec3 UMBER_DEEP = vec3(0.168, 0.110, 0.078);
    const vec3 DUNE       = vec3(0.890, 0.788, 0.627);
    const vec3 VANILLA    = vec3(0.953, 0.898, 0.671);
    const vec3 CONCRETE_A = vec3(0.205, 0.203, 0.200);
    const vec3 CONCRETE_B = vec3(0.330, 0.326, 0.318);
    const vec3 KEYCOL     = vec3(1.000, 0.945, 0.855);   /* warm key      */
    const vec3 SKYCOL     = vec3(0.400, 0.455, 0.545);   /* cool sky fill */

    /* ── noise ────────────────────────────────────────────────────── */
    float hash13(vec3 p){
      p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float vnoise(vec3 x){
      vec3 i = floor(x), f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash13(i + vec3(0,0,0)), hash13(i + vec3(1,0,0)), f.x),
            mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x),
            mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y), f.z);
    }
    float fbm(vec3 p){
      float a = 0.5, s = 0.0;
      for (int i = 0; i < 4; i++){ s += a * vnoise(p); p *= 2.03; a *= 0.5; }
      return s;
    }
    float fbm2(vec3 p){
      float a = 0.5, s = 0.0;
      for (int i = 0; i < 6; i++){ s += a * vnoise(p); p *= 2.07; a *= 0.5; }
      return s;
    }

    /* ── sdf toolbox ──────────────────────────────────────────────── */
    float smin(float a, float b, float k){
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    /* the falling jet -------------------------------------------------
       radius from mass continuity through a free-falling stream        */
    float jetRadius(float y){
      float fall = max(uPourY - y, 0.0);
      float v    = sqrt(2.56 + 6.0 * fall);           // v₀ = 1.6, g = 3
      return 0.50 * sqrt(1.6 / v) * (0.62 + 0.38 * uFlow);
    }
    vec2 jetAxis(float y){
      float k = clamp((uPourY - y) / uPourY, 0.0, 1.0);   // 0 at nozzle
      return uPour + vec2(
        sin(y * 0.85 - uTime * 1.9) * 0.048,
        cos(y * 0.71 - uTime * 1.6) * 0.042
      ) * (0.25 + k * 0.9);
    }
    float sdJet(vec3 p){
      float y = clamp(p.y, 0.02, uPourY);
      float r = jetRadius(y);
      /* varicose necking + surface roughening of the jet */
      r *= 1.0 + 0.048 * sin(y * 5.4 - uTime * 8.0)
               + 0.020 * sin(y * 10.3 - uTime * 13.0)
               + 0.030 * (vnoise(vec3(p.xz * 2.8, y * 2.0 - uTime * 4.0)) - 0.5);
      float lat = length(p.xz - jetAxis(y)) - r;
      float cap = max(p.y - uPourY, -p.y - 0.10);
      return max(lat, cap) * 0.85;
    }

    /* the accumulating slab, as a height field ----------------------- */
    float slabH(vec2 q){
      float r = length(q);
      /* an irregular spreading front: the radius itself is lobed, so the
         height always feathers to zero at the real edge of the slab */
      vec2  dir = q / max(r, 1e-4);
      float R = uSpread * (1.0 + 0.30 * (vnoise(vec3(dir * 2.1, uTime * 0.05)) - 0.5));
      float k = clamp(1.0 - r / R, 0.0, 1.0);
      float h = 0.285 * sqrt(smoothstep(0.0, 0.14, k)) + 0.155 * pow(k, 1.8);
      /* mound under the impact, and the raised crown the jet throws up */
      h += 0.15 * exp(-r * r * 5.0) * uFlow;
      h += 0.055 * exp(-pow((r - 0.30) * 5.5, 2.0)) * uFlow;
      /* ripples radiating out from the impact */
      h += 0.017 * exp(-r * 0.85) * sin(r * 8.6 - uTime * 4.6) * smoothstep(0.0, 0.55, k) * uFlow;
      /* slow viscous surface motion, plus a finer skin ripple */
      h += 0.026 * (fbm(vec3(q * 2.6, uTime * 0.30)) - 0.5) * k;
      h += 0.008 * (vnoise(vec3(q * 7.5, uTime * 0.5)) - 0.5) * k;
      return h;
    }
    float sdSlab(vec3 p){
      float h = slabH(p.xz - uPour);
      float d = (p.y - h) * 0.60;
      return max(d, length(p.xz - uPour) - uSpread * 1.20 - 0.10);
    }

    /* thrown droplets on ballistic arcs ------------------------------ */
    float sdDrops(vec3 p){
      float d = 1e5;
      for (int i = 0; i < 5; i++){
        float fi = float(i);
        float ph = fract(uTime * 0.62 + fi * 0.2371);
        float a  = fi * 2.399 + floor(uTime * 0.62 + fi * 0.2371) * 1.31;
        float sp = 0.75 + 0.5 * fract(fi * 0.618);
        vec3  c  = vec3(
          uPour.x + cos(a) * sp * ph * 2.3,
          0.16 + (2.1 * ph - 3.0 * ph * ph) * 1.35,
          uPour.y + sin(a) * sp * ph * 2.3
        );
        float rr = (0.052 - 0.024 * ph) * (0.5 + 0.5 * uFlow);
        d = min(d, length(p - c) - max(rr, 0.012));
      }
      return d;
    }

    float mapBlob(vec3 p){
      float d = smin(sdJet(p), sdSlab(p), 0.30);
      return smin(d, sdDrops(p), 0.10);
    }

    vec3 blobNormal(vec3 p){
      vec2 e = vec2(0.0022, 0.0);
      return normalize(vec3(
        mapBlob(p + e.xyy) - mapBlob(p - e.xyy),
        mapBlob(p + e.yxy) - mapBlob(p - e.yxy),
        mapBlob(p + e.yyx) - mapBlob(p - e.yyx)
      ));
    }

    /* soft shadow through the blob field */
    float softShadow(vec3 ro, vec3 rd){
      float res = 1.0, t = 0.035;
      for (int i = 0; i < 26; i++){
        if (float(i) >= uShadowQ) break;
        float h = mapBlob(ro + rd * t);
        res = min(res, 10.0 * h / t);
        t += clamp(h, 0.035, 0.42);
        if (res < 0.004 || t > 7.0) break;
      }
      return clamp(res, 0.0, 1.0);
    }

    float blobAO(vec3 p, vec3 n){
      float occ = 0.0, sca = 1.0;
      for (int i = 0; i < 5; i++){
        float h = 0.015 + 0.13 * float(i) / 4.0;
        occ += (h - mapBlob(p + n * h)) * sca;
        sca *= 0.72;
      }
      return clamp(1.0 - 2.4 * occ, 0.0, 1.0);
    }

    /* ── materials ────────────────────────────────────────────────── */
    const vec3 LIGHT = vec3(-0.42, 0.80, 0.43);

    vec3 skyTint(vec3 rd){
      float up = clamp(rd.y * 0.5 + 0.5, 0.0, 1.0);
      vec3 c = mix(UMBER_DEEP * 0.42, UMBER * 0.62, up);
      c = mix(c, DUNE * 0.20, pow(up, 3.5));
      /* a soft warm shaft where the key light sits */
      c += DUNE * 0.07 * pow(max(dot(rd, normalize(LIGHT)), 0.0), 10.0);
      return c;
    }

    vec3 shadeConcrete(vec3 p, vec3 n, vec3 rd){
      vec3 L = normalize(LIGHT);

      /* broad cement mottling for albedo, fine noise for the bump only */
      float ag  = smoothstep(0.28, 0.74, fbm(p * 7.5));
      float ag2 = vnoise(p * 84.0);
      vec2  e   = vec2(0.010, 0.0);
      vec3  bump = vec3(
        fbm2((p + e.xyy) * 26.0) - fbm2((p - e.xyy) * 26.0),
        fbm2((p + e.yxy) * 26.0) - fbm2((p - e.yxy) * 26.0),
        fbm2((p + e.yyx) * 26.0) - fbm2((p - e.yyx) * 26.0)
      );

      /* wet where it is still moving: the jet and around the impact */
      float rImp = length(p.xz - uPour);
      float wet  = clamp(exp(-rImp * 0.9) + smoothstep(0.30, 0.9, p.y), 0.0, 1.0);
      wet = mix(wet, 1.0, smoothstep(0.34, 0.7, p.y));
      wet *= mix(0.35, 1.0, uFlow);

      /* fresh, wet material is smooth and dark; set material is rough */
      n = normalize(n - (bump - dot(bump, n) * n) * (0.46 * (1.0 - 0.78 * wet)));

      vec3 alb = mix(CONCRETE_A, CONCRETE_B, ag);
      alb = mix(alb, alb * 0.40, wet * 0.85);                /* wet is darker */
      alb += (ag2 - 0.5) * 0.042 * (1.0 - wet);              /* sand grains   */
      alb = mix(alb, alb * vec3(1.03, 1.00, 0.96), 0.35);    /* cement tint   */

      float sh  = softShadow(p + n * 0.006, L);
      float ao  = blobAO(p, n);
      float dif = clamp(dot(n, L), 0.0, 1.0);
      float sky = clamp(0.5 + 0.5 * n.y, 0.0, 1.0);
      float bnc = clamp(0.4 - 0.6 * n.y, 0.0, 1.0);

      vec3 col  = alb * KEYCOL * 0.74 * dif * mix(0.12, 1.0, sh);
      col += alb * SKYCOL * 0.46 * sky * ao;
      col += alb * UMBER  * 1.25 * bnc * ao;

      /* wet sheen — sharp and bright only where the material is still moving */
      vec3  h     = normalize(L - rd);
      float nh    = clamp(dot(n, h), 0.0, 1.0);
      float nv    = clamp(dot(n, -rd), 0.0, 1.0);
      float gloss = mix(9.0, 260.0, wet);
      float fr    = 0.04 + 0.96 * pow(1.0 - nv, 5.0);
      float spec  = pow(nh, gloss) * mix(0.05, 0.95, wet);
      col += VANILLA * spec * sh * (0.30 + 0.70 * fr);

      /* sheen along the flowing edge */
      col += DUNE * 0.085 * pow(1.0 - nv, 3.4) * (0.25 + 0.6 * wet) * ao;

      return col;
    }

    vec3 shadeGround(vec3 p, vec3 rd){
      vec3 L = normalize(LIGHT);
      vec2 q = p.xz;

      /* plywood formwork: 1220 × 2440 sheets, visible seams */
      vec2 cell = vec2(1.22, 2.44);
      vec2 g = abs(fract(q / cell + 0.5) - 0.5) * cell;
      float seam = 1.0 - smoothstep(0.004, 0.020, min(g.x, g.y));

      float grain = fbm2(vec3(q.x * 3.0, q.y * 34.0, 4.7));
      vec3  alb   = mix(UMBER * 0.58, UMBER_DEEP * 0.86, grain);
      alb = mix(alb, UMBER_DEEP * 0.34, seam * 0.9);

      /* concrete splatter and dust ring around the pour */
      float rImp = length(q - uPour);
      float spat = smoothstep(0.55, 0.95, fbm2(vec3(q * 6.5, 1.7)))
                 * smoothstep(uSpread + 2.6, uSpread - 0.1, rImp);
      alb = mix(alb, CONCRETE_A * 1.15, spat * 0.42);
      float dust = smoothstep(uSpread + 1.7, uSpread + 0.15, rImp) * 0.16;
      alb = mix(alb, CONCRETE_A, dust * (0.4 + 0.6 * fbm(vec3(q * 1.6, 0.0))));

      /* normal from the plank grain */
      vec2 e = vec2(0.012, 0.0);
      float hx = fbm2(vec3((q.x + e.x) * 3.0, q.y * 34.0, 4.7)) - grain;
      float hz = fbm2(vec3(q.x * 3.0, (q.y + e.x) * 34.0, 4.7)) - grain;
      vec3 n = normalize(vec3(-hx * 1.6, 1.0, -hz * 1.6));

      float sh  = softShadow(p + vec3(0.0, 0.004, 0.0), L);
      float dif = clamp(dot(n, L), 0.0, 1.0);

      vec3 col  = alb * mix(vec3(1.0), DUNE, 0.62) * 0.95 * dif * mix(0.10, 1.0, sh);
      col += alb * mix(UMBER, DUNE * 0.5, 0.30) * 0.52;

      /* damp sheen close to the fresh pour */
      float damp = smoothstep(uSpread + 1.3, uSpread - 0.2, rImp);
      vec3  h    = normalize(L - rd);
      float nh   = clamp(dot(n, h), 0.0, 1.0);
      col += VANILLA * pow(nh, 46.0) * 0.55 * damp * sh;

      return col;
    }

    void main(){
      /* ray from the real scene camera */
      vec2 uv = vUv * 2.0 - 1.0;
      vec3 dirCam = normalize(vec3(uv.x * uAspect * uFovTan, uv.y * uFovTan, -1.0));
      vec3 rd = normalize((uCamMat * vec4(dirCam, 0.0)).xyz);
      vec3 ro = uCamMat[3].xyz;

      /* the slab plane is analytic — no need to march for it */
      float tG = (rd.y < -1e-4) ? (-ro.y / rd.y) : 1e9;
      if (tG < 0.0) tG = 1e9;
      float tMax = min(tG, MAXD);

      float t = 0.02;
      bool  hitBlob = false;
      for (int i = 0; i < 110; i++){
        if (float(i) >= uSteps) break;
        vec3 p = ro + rd * t;
        float d = mapBlob(p);
        if (d < SURF * (1.0 + t * 0.7)){ hitBlob = true; break; }
        t += max(d * 0.88, 0.0035);
        if (t > tMax) break;
      }

      vec3 col;
      float depth;

      if (hitBlob){
        vec3 p = ro + rd * t;
        col = shadeConcrete(p, blobNormal(p), rd);
        depth = t;
      } else if (tG < MAXD){
        vec3 p = ro + rd * tG;
        col = shadeGround(p, rd);
        depth = tG;
      } else {
        col = skyTint(rd);
        depth = MAXD;
      }

      /* atmosphere — everything melts into the deep umber ground colour */
      float fog = 1.0 - exp(-pow(depth * 0.030, 1.9));
      col = mix(col, skyTint(rd) * 0.62, clamp(fog, 0.0, 1.0));

      /* airborne cement dust catching the light */
      float dustHaze = fbm(vec3(ro.xz * 0.3 + rd.xz * 2.0, uTime * 0.05));
      col += DUNE * 0.013 * dustHaze * smoothstep(0.0, 20.0, depth);

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `;

  /* ── composite: tonemap + bloom + grain + chromatic edge ─────────── */
  const POST = /* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTex;
    uniform vec2  uTexel;
    uniform float uTime;
    uniform float uFade;

    vec3 sample3(vec2 uv){
      /* slight chromatic separation toward the frame edge */
      vec2 c = uv - 0.5;
      float k = dot(c, c) * 0.010;
      return vec3(
        texture2D(uTex, uv + c * k).r,
        texture2D(uTex, uv).g,
        texture2D(uTex, uv - c * k).b
      );
    }

    void main(){
      vec3 col = sample3(vUv);

      /* cheap bloom from the bright wet highlights */
      vec3 bl = vec3(0.0);
      bl += texture2D(uTex, vUv + uTexel * vec2( 2.5,  1.5)).rgb;
      bl += texture2D(uTex, vUv + uTexel * vec2(-2.5,  1.5)).rgb;
      bl += texture2D(uTex, vUv + uTexel * vec2( 1.5, -2.5)).rgb;
      bl += texture2D(uTex, vUv + uTexel * vec2(-1.5, -2.5)).rgb;
      bl += texture2D(uTex, vUv + uTexel * vec2( 5.0,  0.0)).rgb;
      bl += texture2D(uTex, vUv + uTexel * vec2(-5.0,  0.0)).rgb;
      bl /= 6.0;
      col += max(bl - 0.62, 0.0) * 0.9;

      /* filmic tonemap, then the sRGB transfer function */
      col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
      col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));

      /* warm grade toward umber / dune */
      col = pow(col, vec3(0.97, 1.00, 1.05));

      /* grain */
      float g = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
      col += (g - 0.5) * 0.022;

      /* vignette */
      vec2 c = vUv - 0.5;
      col *= 1.0 - dot(c, c) * 0.80;

      gl_FragColor = vec4(col * uFade, 1.0);
    }
  `;

  /* ═════════════════════════════ class ═════════════════════════════ */
  DAL.ConcretePour = class ConcretePour {
    constructor(renderer, opts) {
      opts = opts || {};
      this.renderer = renderer;
      this.scale    = opts.scale || 0.55;

      this.rt = new THREE.WebGLRenderTarget(2, 2, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: false,
        stencilBuffer: false
      });

      this.uniforms = {
        uRes:      { value: new THREE.Vector2(2, 2) },
        uTime:     { value: 0 },
        uAspect:   { value: 1 },
        uFovTan:   { value: Math.tan(THREE.MathUtils.degToRad(54) * 0.5) },
        uCamMat:   { value: new THREE.Matrix4() },
        uPour:     { value: new THREE.Vector2(0, 0) },
        uPourY:    { value: 5.2 },
        uSpread:   { value: 1.0 },
        uFlow:     { value: 0 },
        uSteps:    { value: opts.steps || 88 },
        uShadowQ:  { value: opts.shadowSteps || 18 }
      };

      const quad = new THREE.PlaneGeometry(2, 2);

      this.marchMat = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG,
        uniforms: this.uniforms, depthTest: false, depthWrite: false
      });

      this.postUniforms = {
        uTex:   { value: this.rt.texture },
        uTexel: { value: new THREE.Vector2(1 / 2, 1 / 2) },
        uTime:  { value: 0 },
        uFade:  { value: 1 }
      };
      this.postMat = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: POST,
        uniforms: this.postUniforms, depthTest: false, depthWrite: false
      });

      const marchQuad = new THREE.Mesh(quad, this.marchMat);
      const postQuad   = new THREE.Mesh(quad, this.postMat);
      marchQuad.frustumCulled = postQuad.frustumCulled = false;

      this.marchScene = new THREE.Scene();
      this.marchScene.add(marchQuad);
      this.postScene = new THREE.Scene();
      this.postScene.add(postQuad);
      this.cam = new THREE.Camera();

      /* pour bookkeeping */
      this.pourTarget = new THREE.Vector2(0, 0);
      this.pour       = new THREE.Vector2(0, 0);
      this.flowT      = 0.6;
    }

    setSize(w, h) {
      const rw = Math.max(2, Math.round(w * this.scale));
      const rh = Math.max(2, Math.round(h * this.scale));
      this.rt.setSize(rw, rh);
      this.uniforms.uRes.value.set(rw, rh);
      this.uniforms.uAspect.value = w / h;
      this.postUniforms.uTexel.value.set(1 / rw, 1 / rh);
    }

    setScale(s) {
      this.scale = THREE.MathUtils.clamp(s, 0.28, 0.85);
      this.setSize(this._w || 2, this._h || 2);
    }

    resize(w, h) {
      this._w = w; this._h = h;
      this.setSize(w, h);
    }

    /* the pour point drifts, and follows the pointer a little */
    setPourDrift(x, z) { this.pourTarget.set(x, z); }

    update(dt, elapsed, camera) {
      const U = DAL.U;
      this.pour.x = U.damp(this.pour.x, this.pourTarget.x, 1.1, dt);
      this.pour.y = U.damp(this.pour.y, this.pourTarget.y, 1.1, dt);

      this.flowT += dt;
      const spread = Math.min(0.72 + 0.36 * Math.sqrt(this.flowT), 2.05);

      const u = this.uniforms;
      u.uTime.value   = elapsed;
      u.uPour.value.copy(this.pour);
      u.uSpread.value = spread;
      u.uFlow.value   = U.clamp(elapsed / 2.2, 0, 1) *
                        (0.86 + 0.14 * Math.sin(elapsed * 0.7));
      u.uCamMat.value.copy(camera.matrixWorld);
      u.uFovTan.value = Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5);
      u.uAspect.value = camera.aspect;

      this.postUniforms.uTime.value = elapsed;
    }

    render() {
      const r = this.renderer;
      const prev = r.getRenderTarget();
      r.setRenderTarget(this.rt);
      r.render(this.marchScene, this.cam);
      r.setRenderTarget(prev);
      r.render(this.postScene, this.cam);
    }

    dispose() {
      this.rt.dispose();
      this.marchMat.dispose();
      this.postMat.dispose();
    }
  };

})(window.DAL);
