/* ═══════════════════════════ small math / dom helpers ═══════════════════════════ */
(function (DAL) {
  'use strict';

  const U = DAL.U = {};

  U.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  U.lerp  = (a, b, t) => a + (b - a) * t;

  U.smoothstep = (t) => { t = U.clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  /* frame-rate independent exponential damping */
  U.damp = (current, target, lambda, dt) =>
    U.lerp(current, target, 1 - Math.exp(-lambda * dt));

  /* piecewise interpolation across an array of numeric keys */
  U.track = (keys, t) => {
    const n = keys.length - 1;
    const i = U.clamp(Math.floor(t), 0, n - 1);
    const f = U.smoothstep(t - i);
    return U.lerp(keys[i], keys[i + 1], f);
  };

  U.prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  U.isTouch = () =>
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* very small deterministic PRNG so the scene is identical every load */
  U.rng = (seed) => {
    let s = seed >>> 0 || 1;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  };

  U.supportsWebGL = () => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  };

})(window.DAL);
