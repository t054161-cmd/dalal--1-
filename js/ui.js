/* ═══════════════════════════════════════════════════════════════════════
   UI — preloader, scroll reveals, rail navigation, contact wiring and the
   Coded terminal typewriter.
   ═══════════════════════════════════════════════════════════════════════ */
(function (DAL) {
  'use strict';

  const C = DAL.CONFIG;
  const U = DAL.U;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ─────────────────────── preloader ─────────────────────── */
  const Loader = {
    el:   $('#preloader'),
    fill: $('#preloaderFill'),
    pct:  $('#preloaderPct'),
    v: 0,
    set(v) {
      this.v = Math.max(this.v, U.clamp(v, 0, 1));
      if (this.fill) this.fill.style.width = (this.v * 100).toFixed(0) + '%';
      if (this.pct) this.pct.textContent = String(Math.round(this.v * 100)).padStart(2, '0');
    },
    done() {
      this.set(1);
      setTimeout(() => {
        if (this.el) this.el.classList.add('done');
        document.body.classList.add('ready');
      }, 320);
    }
  };

  /* ─────────────────────── scroll reveals ─────────────────────── */
  function initReveals() {
    const items = $$('.reveal');
    items.forEach(el => {
      el.style.setProperty('--rd', el.dataset.d || 0);
    });

    if (!('IntersectionObserver' in window) || U.prefersReducedMotion()) {
      items.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  /* ─────────────────────── rail navigation ─────────────────────── */
  function initNav() {
    const links = $$('[data-nav]');
    const rail  = $$('.railnav a');
    const secs  = $$('[data-section]');
    const cue   = $('#scrollcue');

    links.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id.charAt(0) !== '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const top = target.offsetTop - Math.min(window.innerHeight * 0.06, 70);
        window.scrollTo({
          top: Math.max(top, 0),
          behavior: U.prefersReducedMotion() ? 'auto' : 'smooth'
        });
        history.replaceState(null, '', id);
      });
    });

    let raf = 0;
    const sync = () => {
      raf = 0;
      const mid = window.scrollY + window.innerHeight * 0.42;
      let active = 0;
      secs.forEach((s, i) => { if (s.offsetTop <= mid) active = i; });
      rail.forEach((a, i) => a.classList.toggle('active', i === active));
      if (cue) cue.classList.toggle('hide', window.scrollY > window.innerHeight * 0.32);
    };
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(sync);
    }, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }

  /* ─────────────────────── contact wiring ─────────────────────── */
  function mailtoHref() {
    return 'mailto:' + C.email +
      '?subject=' + encodeURIComponent(C.mailSubject) +
      '&body=' + encodeURIComponent(C.mailBody);
  }

  function initContact() {
    const href = mailtoHref();

    const emailLink = $('#emailLink');
    if (emailLink) {
      emailLink.href = href;
      emailLink.textContent = C.email;
    }

    const phone = $('#phoneLink');
    if (phone) {
      phone.href = 'tel:' + C.phoneIntl;
      phone.textContent = C.phone;
    }

    const li = $('#linkedinLink'); if (li) li.href = C.linkedin;
    const gh = $('#githubLink');   if (gh) gh.href = C.github;
    const cv = $('#cvLink');       if (cv) cv.href = C.cv;

    const btn  = $('#emailMe');
    const hint = $('#emailHint');
    if (btn) {
      btn.href = href;
      btn.addEventListener('click', () => {
        /* the mailto opens the mail app; copying is a safety net for
           visitors with no mail client configured */
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(C.email).catch(() => {});
        }
        if (hint) {
          const original = hint.textContent;
          hint.textContent = 'OPENING MAIL APP · ' + C.email + ' COPIED';
          setTimeout(() => { hint.textContent = original; }, 4200);
        }
      });
    }
  }

  /* ─────────────────────── Coded terminal ─────────────────────── */
  function initTerminal() {
    const out = $('#codedTyped');
    if (!out || U.prefersReducedMotion()) {
      if (out) out.textContent = C.codedLines[0];
      return;
    }
    const lines = C.codedLines;
    let li = 0, ci = 0, deleting = false, started = false;

    const tick = () => {
      const line = lines[li];
      if (!deleting) {
        ci++;
        out.textContent = line.slice(0, ci);
        if (ci >= line.length) { deleting = true; return setTimeout(tick, 1900); }
        setTimeout(tick, 34 + Math.random() * 46);
      } else {
        ci -= 2;
        out.textContent = line.slice(0, Math.max(ci, 0));
        if (ci <= 0) {
          deleting = false; ci = 0;
          li = (li + 1) % lines.length;
          return setTimeout(tick, 420);
        }
        setTimeout(tick, 16);
      }
    };

    /* only start typing once the Coded panel is actually on screen */
    const coded = $('#coded');
    if (!coded || !('IntersectionObserver' in window)) return tick();
    const io = new IntersectionObserver((en) => {
      if (en[0].isIntersecting && !started) { started = true; tick(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(coded);
  }

  /* ─────────────────────── misc ─────────────────────── */
  function initMeta() {
    const y = String(new Date().getFullYear());
    const a = $('#yearNow'); if (a) a.textContent = y;
    const b = $('#yearFoot'); if (b) b.textContent = y;
    document.title = C.name + ' — Civil Engineering × Structural Engineering × AI';
  }

  /* card / tile pointer tilt — a small amount of real 3D on hover */
  function initTilt() {
    if (U.isTouch() || U.prefersReducedMotion()) return;
    $$('.card, .int, .link3d').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'translate3d(0,-6px,26px) rotateX(' + (-py * 6).toFixed(2) +
          'deg) rotateY(' + (px * 8).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ─────────────────────── boot ─────────────────────── */
  function boot() {
    initMeta();
    initContact();
    initReveals();
    initNav();
    initTerminal();
    initTilt();
    Loader.set(0.18);

    if (!U.supportsWebGL()) {
      document.body.classList.add('no-webgl');
      $$('.reveal').forEach(el => el.classList.add('in'));
      Loader.done();
      return;
    }

    let app;
    try {
      app = new DAL.Scene($('#gl')).init();
    } catch (err) {
      console.error('[3D] initialisation failed —falling back to the flat layout', err);
      document.body.classList.add('no-webgl');
      $$('.reveal').forEach(el => el.classList.add('in'));
      Loader.done();
      return;
    }
    DAL.app = app;
    Loader.set(0.62);

    /* Let a few frames render (the shaders compile on the first one) before
       lifting the curtain, so the reveal is never a stutter. Time-bounded as
       well as frame-bounded: on a slow device we stop waiting after ~1.4s
       rather than hold the visitor on the preloader. */
    let warm = 0;
    const t0 = performance.now();
    const warmup = () => {
      app.frame();
      warm++;
      const spent = performance.now() - t0;
      Loader.set(0.62 + Math.max(warm / 6, spent / 1400) * 0.38);
      if (warm < 6 && spent < 1400) return requestAnimationFrame(warmup);
      app.start();
      Loader.done();
    };
    requestAnimationFrame(warmup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.DAL);
