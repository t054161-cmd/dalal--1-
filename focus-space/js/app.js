/* ═══════════════════════════════════════════════════════════════════════
   APP — router, chrome and the wiring that every screen shares.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const S = FS.Store;
  const I = FS.I18N;
  const T = (k, v) => I.t(k, v);

  const app = document.getElementById('app');
  const header = document.getElementById('siteHeader');

  /* ── routing ───────────────────────────────────────────────────────── */

  function parse() {
    const raw = (location.hash || '#/').replace(/^#/, '');
    const parts = raw.split('/').filter(Boolean);
    if (!parts.length) return { name: 'home' };
    if (parts[0] === 'spaces') return { name: 'spaces', cat: parts[1] || null };
    if (parts[0] === 'space')  return { name: 'detail', id: parts[1] };
    if (parts[0] === 'about')  return { name: 'about' };
    if (parts[0] === 'contact') return { name: 'contact' };
    if (parts[0] === 'profile') return { name: 'profile' };
    return { name: 'home' };
  }

  let current = null;

  function teardown() {
    if (FS.heroIO) { FS.heroIO.disconnect(); FS.heroIO = null; }
    if (FS.heroScroll) { window.removeEventListener('scroll', FS.heroScroll); FS.heroScroll = null; }
    if (FS.heroInstance) { FS.heroInstance.dispose(); FS.heroInstance = null; }
    FS.rerenderResults = null;
  }

  function build(route) {
    const V = FS.Views;
    switch (route.name) {
      case 'spaces':  return { html: V.spaces(route.cat), mount: V.spaces.mount };
      case 'detail':  return { html: V.detail(route.id), mount: null };
      case 'about':   return { html: V.about(), mount: null };
      case 'contact': return { html: V.contact(), mount: V.contact.mount };
      case 'profile': return { html: V.profile(), mount: V.profile.mount };
      default:        return { html: V.home(), mount: V.home.mount };
    }
  }

  function render(keepScroll) {
    const route = parse();
    const y = window.scrollY;
    teardown();

    const view = build(route);
    app.innerHTML = view.html;
    current = route;

    document.body.classList.toggle('is-home', route.name === 'home');
    markActiveNav(route);
    I.apply(app);
    view.mount && view.mount();
    FS.Motion.refresh(app);
    FS.Studio.hydrate(app);
    paintAvatar();
    updateHeader();

    if (keepScroll) window.scrollTo(0, y);
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }
  FS.render = render;

  function navigate() {
    FS.Motion.veil(() => {
      render(false);
      /* move the reading position to the new screen for keyboard and
         screen-reader users, without fighting the scroll reset */
      app.focus({ preventScroll: true });
    });
  }

  function markActiveNav(route) {
    const hash = location.hash || '#/';
    document.querySelectorAll('[data-link]').forEach(a => {
      const href = a.getAttribute('href');
      const on = href === hash ||
        (route.name === 'spaces' && href === '#/spaces') ||
        (route.name === 'detail' && href === '#/spaces');
      a.classList.toggle('is-active', !!on);
    });
  }

  /* ── header ────────────────────────────────────────────────────────── */

  /* The hero sits under the sticky header, so the header's real height is
     published as a custom property rather than guessed in CSS. */
  function measureHeader() {
    const h = header.querySelector('.header-inner').offsetHeight;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  window.addEventListener('resize', measureHeader, { passive: true });

  function updateHeader() {
    const solid = !document.body.classList.contains('is-home') || window.scrollY > window.innerHeight * 0.72;
    header.classList.toggle('is-solid', solid);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });

  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  menuBtn.addEventListener('click', () => {
    const open = header.classList.toggle('is-menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileNav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      header.classList.remove('is-menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── language ──────────────────────────────────────────────────────── */

  function applyLang() {
    I.lang = S.lang;
    document.documentElement.lang = S.lang;
    document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-rtl', S.lang === 'ar');
    I.apply(document);
    document.querySelectorAll('.lang-btn').forEach(b => {
      const on = b.getAttribute('data-lang') === S.lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    document.title = S.lang === 'ar'
      ? 'فوكس سبيس — مرفأ روّاد الإنجاز'
      : 'FOCUS SPACE — مرفأ روّاد الإنجاز';
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang === S.lang) return;
    S.setLang(lang);
    applyLang();
    FS.Motion.veil(() => render(true));
  });

  /* ── favorites ─────────────────────────────────────────────────────── */

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute('data-fav');
    const added = S.toggleFavorite(id);

    document.querySelectorAll(`[data-fav="${id}"]`).forEach(node => {
      node.classList.toggle('is-on', added);
      node.setAttribute('aria-pressed', String(added));
      const label = T(added ? 'card.unfav' : 'card.fav');
      node.setAttribute('aria-label', label);
      node.setAttribute('title', label);
    });
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    if (added) btn.classList.add('pulse');

    paintAvatar();
    FS.toast(T(added ? 'fav.added' : 'fav.removed'));

    /* On the profile screen the favorites grid is the content itself. */
    if (current && current.name === 'profile') setTimeout(() => render(true), 260);
  });

  /* ── links, smooth scroll ──────────────────────────────────────────── */

  document.addEventListener('click', e => {
    const jump = e.target.closest('[data-scroll]');
    if (jump) {
      const target = document.querySelector(jump.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: FS.Motion.reduced() ? 'auto' : 'smooth', block: 'start' });
      }
    }
  });

  window.addEventListener('hashchange', navigate);

  /* ── avatar + favourite count in the header ────────────────────────── */

  function paintAvatar() {
    const el = document.getElementById('headerAvatar');
    const src = S.profile.photo || FS.Imagery.avatar(S.profile.name || 'Focus Space');
    el.style.backgroundImage = `url("${src}")`;
    const count = document.getElementById('headerFavCount');
    count.textContent = I.num(S.favorites.length);
    count.hidden = S.favorites.length === 0;
  }
  FS.paintAvatar = paintAvatar;

  /* ── toast ─────────────────────────────────────────────────────────── */

  let toastTimer;
  FS.toast = function (message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('is-in');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-in'), 2600);
  };

  /* ── boot ──────────────────────────────────────────────────────────── */

  document.getElementById('year').textContent = String(new Date().getFullYear());
  applyLang();
  measureHeader();
  S.resumeLocation();
  render(false);

  requestAnimationFrame(() => document.body.classList.remove('is-booting'));

  /* Availability is a function of the clock — refresh the visible statuses
     a few times an hour without touching anything the visitor is doing. */
  setInterval(() => {
    document.querySelectorAll('.status').forEach(node => {
      const card = node.closest('[href^="#/space/"]') || node.closest('.detail-hero-body');
      if (!card) return;
      const href = (card.getAttribute && card.getAttribute('href')) ||
                   (current && current.name === 'detail' ? '#/space/' + current.id : '');
      const id = href.split('/').pop();
      const sp = FS.Data.space(id);
      if (!sp) return;
      const st = FS.Data.statusOf(sp);
      node.className = 'status status-' + st;
      node.innerHTML = '<i></i>' + T('status.' + st);
    });
  }, 300000);
})(window.FS);
