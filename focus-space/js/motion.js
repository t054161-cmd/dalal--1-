/* ═══════════════════════════════════════════════════════════════════════
   MOTION — scroll reveal, parallax, card tilt, count-ups and the page
   transition veil. Every effect checks reduced-motion first and simply
   renders the finished state when motion is turned down.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  let revealIO = null, parallaxNodes = [], rafId = 0, tiltNodes = [];

  function reduced() {
    if (FS.Store && FS.Store.profile && FS.Store.profile.reduceMotion) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── scroll reveal ─────────────────────────────────────────────────── */
  function reveal(root) {
    const nodes = (root || document).querySelectorAll('[data-reveal]:not(.is-revealed)');
    if (reduced()) { nodes.forEach(n => n.classList.add('is-revealed')); return; }

    if (!revealIO) {
      revealIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const delay = parseFloat(e.target.getAttribute('data-reveal-delay') || '0');
          setTimeout(() => e.target.classList.add('is-revealed'), delay * 1000);
          revealIO.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    nodes.forEach(n => revealIO.observe(n));
  }

  /* ── parallax + scroll-driven work ─────────────────────────────────── */
  function collectParallax(root) {
    parallaxNodes = Array.from((root || document).querySelectorAll('[data-parallax]'));
  }

  function frame() {
    rafId = 0;
    const vh = window.innerHeight;
    if (!reduced()) {
      for (const el of parallaxNodes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const k = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        const centre = r.top + r.height / 2 - vh / 2;
        el.style.setProperty('--py', (-centre * k).toFixed(1) + 'px');
      }
    }
    document.documentElement.style.setProperty('--scroll', String(window.scrollY));
  }

  function onScroll() { if (!rafId) rafId = requestAnimationFrame(frame); }

  /* ── card tilt (pointer only) ──────────────────────────────────────── */
  function tiltEnter(e) {
    const el = e.currentTarget;
    el.classList.add('is-tilting');
  }
  function tiltMove(e) {
    const el = e.currentTarget;
    if (reduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const max = parseFloat(el.getAttribute('data-tilt')) || 6;
    el.style.setProperty('--rx', (-y * max).toFixed(2) + 'deg');
    el.style.setProperty('--ry', (x * max).toFixed(2) + 'deg');
    el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
    el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
  }
  function tiltLeave(e) {
    const el = e.currentTarget;
    el.classList.remove('is-tilting');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }

  function tilt(root) {
    if (window.matchMedia('(hover: none)').matches) return;
    tiltNodes.forEach(el => {
      el.removeEventListener('pointerenter', tiltEnter);
      el.removeEventListener('pointermove', tiltMove);
      el.removeEventListener('pointerleave', tiltLeave);
    });
    tiltNodes = Array.from((root || document).querySelectorAll('[data-tilt]'));
    tiltNodes.forEach(el => {
      el.addEventListener('pointerenter', tiltEnter);
      el.addEventListener('pointermove', tiltMove);
      el.addEventListener('pointerleave', tiltLeave);
    });
  }

  /* ── count-up ──────────────────────────────────────────────────────── */
  function counters(root) {
    const nodes = (root || document).querySelectorAll('[data-count]');
    nodes.forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const fmt = v => (FS.I18N ? FS.I18N.num(Math.round(v)) : Math.round(v));
      if (reduced()) { el.textContent = fmt(target); return; }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const t0 = performance.now(), dur = 1100;
          (function step(now) {
            const k = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - k, 3);
            el.textContent = fmt(target * eased);
            if (k < 1) requestAnimationFrame(step);
          })(performance.now());
        });
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ── page transition veil ──────────────────────────────────────────── */
  let veilBusy = false;
  function veil(swap) {
    const el = document.getElementById('veil');
    if (!el || reduced()) { swap(); return; }
    if (veilBusy) { swap(); return; }
    veilBusy = true;
    el.classList.add('is-in');
    setTimeout(() => {
      swap();
      requestAnimationFrame(() => {
        el.classList.remove('is-in');
        el.classList.add('is-out');
        setTimeout(() => { el.classList.remove('is-out'); veilBusy = false; }, 620);
      });
    }, 320);
  }

  /* ── wiring ────────────────────────────────────────────────────────── */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  FS.Motion = {
    reduced,
    veil,
    /* Run after every view render. */
    refresh(root) {
      reveal(root);
      collectParallax(root);
      tilt(root);
      counters(root);
      onScroll();
    }
  };
})(window.FS);
