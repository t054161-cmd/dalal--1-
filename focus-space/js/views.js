/* ═══════════════════════════════════════════════════════════════════════
   VIEWS — every screen of the application. Each view returns an HTML
   string plus an optional mount() that wires its behaviour.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const T = (k, v) => FS.I18N.t(k, v);
  const L = v => FS.I18N.pick(v);
  const N = n => FS.I18N.num(n);
  const D = FS.Data;
  const S = FS.Store;

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ── filter state (kept between visits to the Spaces screen) ───────── */
  const filters = {
    q: '', cat: 'all', sort: 'recommended', people: 0,
    availableOnly: false, offersOnly: false, services: []
  };
  FS.filters = filters;

  /* ═══════════════ small pieces ═══════════════ */

  const ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6l-1.5-1.35C5.4 14.6 2.5 12 2.5 8.7 2.5 6.1 4.5 4.1 7 4.1c1.6 0 3.1.75 4 1.95.9-1.2 2.4-1.95 4-1.95 2.5 0 4.5 2 4.5 4.6 0 3.3-2.9 5.9-8 10.55L12 20.6z"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.55 5.35 5.85.72-4.3 4.02 1.12 5.79L12 16.7l-5.22 2.78 1.12-5.79-4.3-4.02 5.85-.72L12 3.6z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c-3.5 0-6.3 2.8-6.3 6.3 0 4.6 6.3 12.1 6.3 12.1s6.3-7.5 6.3-12.1c0-3.5-2.8-6.3-6.3-6.3zm0 8.6a2.3 2.3 0 110-4.6 2.3 2.3 0 010 4.6z"/></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11.5a3.4 3.4 0 100-6.8 3.4 3.4 0 000 6.8zm7.2.6a2.8 2.8 0 100-5.6 2.8 2.8 0 000 5.6zM9 13.2c-3 0-6 1.5-6 3.6v2.4h12v-2.4c0-2.1-3-3.6-6-3.6zm7.2.6c-.6 0-1.2.05-1.75.16 1.05.9 1.75 2.05 1.75 3.44v1.8H21v-2.1c0-1.85-2.4-3.3-4.8-3.3z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 100 18 9 9 0 000-18zm.9 9.35V7h-1.8v6.1l4.35 2.6.9-1.5-3.45-1.85z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14.2l-5.1-5.1 1.3-1.3L21.8 12l-7.4 6.4-1.3-1.3 5.1-5.1H4z"/></svg>'
  };

  /* An image element that starts as a soft placeholder and is replaced by a
     rendered photograph once the studio reaches it. Without WebGL the drawn
     SVG interior is used directly. */
  function photoImg(kind, seed, alt, extra) {
    const a = `alt="${esc(alt || '')}"${alt ? '' : ' aria-hidden="true"'} decoding="async"${extra || ''}`;
    if (FS.Studio && FS.Studio.supported()) {
      const ready = FS.Studio.cached(kind, seed);
      if (ready) return `<img src="${ready}" class="is-photo" ${a} />`;
      return `<img src="${FS.Imagery.placeholder(kind, seed)}" class="photo-pending" data-photo="${kind}|${seed}" ${a} />`;
    }
    return `<img src="${FS.Imagery.scene(kind, seed, 1100, 700)}" class="is-photo" loading="lazy" ${a} />`;
  }

  function stars(rating) {
    return `<span class="rating" aria-label="${esc(T('card.rating'))} ${rating}">${ICON.star}<b>${N(rating.toFixed(1))}</b></span>`;
  }

  function statusPill(space) {
    const st = D.statusOf(space);
    return `<span class="status status-${st}"><i></i>${esc(T('status.' + st))}</span>`;
  }

  function distanceLabel(space) {
    const km = D.distanceKm(space, S.coords);
    if (km == null) return '';
    const v = km < 10 ? km.toFixed(1) : Math.round(km);
    return `<span class="meta-bit">${ICON.pin}${esc(T('card.km', { n: N(v) }))}</span>`;
  }

  function serviceChips(space, max) {
    const list = space.services.slice(0, max);
    const rest = space.services.length - list.length;
    return `<ul class="chips">` +
      list.map(k => `<li class="chip">${esc(T('srv.' + k))}</li>`).join('') +
      (rest > 0 ? `<li class="chip chip-more">${esc(T('card.more', { n: N(rest) }))}</li>` : '') +
      `</ul>`;
  }

  function favButton(id, big) {
    const on = S.isFavorite(id);
    return `<button type="button" class="fav-btn${big ? ' fav-btn-lg' : ''}${on ? ' is-on' : ''}" data-fav="${id}"
      aria-pressed="${on}" aria-label="${esc(T(on ? 'card.unfav' : 'card.fav'))}"
      title="${esc(T(on ? 'card.unfav' : 'card.fav'))}">${ICON.heart}</button>`;
  }

  function spaceCard(space, i) {
    const cat = D.category(space.cat);
    return `
    <article class="space-card" data-tilt="4" data-reveal data-reveal-delay="${(i % 3) * 0.07}">
      <a class="card-media" href="#/space/${space.id}" data-link aria-label="${esc(L(space.name))}">
        ${photoImg(space.cat, space.seed, L(space.name) + ' — ' + L(cat.name))}
        <span class="card-shade"></span>
        ${statusPill(space)}
        ${space.offer ? `<span class="offer-tag">${esc(T('card.offer'))}</span>` : ''}
      </a>
      ${favButton(space.id)}
      <div class="card-body">
        <div class="card-head">
          <h3 class="card-title">${esc(L(space.name))}</h3>
          ${stars(space.rating)}
        </div>
        <p class="card-meta">
          <span class="meta-bit">${ICON.pin}${esc(L(space.district))}</span>
          ${distanceLabel(space)}
          <span class="meta-bit">${ICON.people}${esc(T('card.upTo', { n: N(space.capacity) }))}</span>
        </p>
        ${serviceChips(space, 3)}
        ${space.offer ? `<p class="offer-line">${esc(L(space.offer))}</p>` : ''}
        <a class="card-cta" href="#/space/${space.id}" data-link>${esc(T('card.view'))}${ICON.arrow}</a>
      </div>
    </article>`;
  }

  function categoryTile(cat, i) {
    const count = D.byCategory(cat.id).length;

    return `
    <a class="cat-tile" href="#/spaces/${cat.id}" data-link data-reveal data-reveal-delay="${i * 0.1}">
      <span class="cat-media">${photoImg(cat.id, 'cover', L(cat.name))}</span>
      <span class="cat-shade"></span>
      <span class="cat-index">${esc(cat.index)}</span>
      <span class="cat-body">
        <span class="cat-name">${esc(L(cat.name))}</span>
        <span class="cat-sub">${esc(T(cat.sub))}</span>
        <span class="cat-go">${esc(T('cat.explore'))}${ICON.arrow}</span>
      </span>
      <span class="cat-count">${esc(T('cat.count', { n: N(count) }))}</span>
    </a>`;
  }

  /* ═══════════════ filtering ═══════════════ */

  function applyFilters() {
    let list = D.SPACES.slice();

    if (filters.cat !== 'all') list = list.filter(s => s.cat === filters.cat);
    if (filters.people) list = list.filter(s => s.capacity >= filters.people);
    if (filters.availableOnly) list = list.filter(s => D.statusOf(s) === 'available');
    if (filters.offersOnly) list = list.filter(s => !!s.offer);
    if (filters.services.length) {
      list = list.filter(s => filters.services.every(k => s.services.indexOf(k) !== -1));
    }
    if (filters.q.trim()) {
      const q = filters.q.trim().toLowerCase();
      list = list.filter(s => {
        const hay = [s.name.en, s.name.ar, s.district.en, s.district.ar, L(s.desc)]
          .concat(s.services.map(k => T('srv.' + k))).join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }

    const rank = { available: 0, busy: 1, closed: 2 };
    if (filters.sort === 'rated') {
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    } else if (filters.sort === 'nearest' && S.coords) {
      list.sort((a, b) => D.distanceKm(a, S.coords) - D.distanceKm(b, S.coords));
    } else {
      list.sort((a, b) =>
        rank[D.statusOf(a)] - rank[D.statusOf(b)] ||
        b.rating - a.rating);
    }
    return list;
  }

  function activeFilterCount() {
    return (filters.cat !== 'all' ? 1 : 0) + (filters.people ? 1 : 0) +
           (filters.availableOnly ? 1 : 0) + (filters.offersOnly ? 1 : 0) +
           filters.services.length + (filters.q.trim() ? 1 : 0);
  }

  /* ═══════════════ HOME ═══════════════ */

  function home() {
    const featured = D.SPACES.slice().sort((a, b) => b.rating - a.rating).slice(0, 3);
    return `
    <section class="hero" id="hero">
      <canvas class="hero-canvas" id="heroCanvas" aria-hidden="true"></canvas>
      <div class="hero-grain" aria-hidden="true"></div>
      <div class="hero-veil" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="hero-cue" data-i18n="hero.cue">${esc(T('hero.cue'))}</p>
        <h1 class="hero-title">FOCUS SPACE</h1>
        <p class="hero-slogan">مرفأ روّاد الإنجاز</p>
        <a class="btn btn-hero" href="#/spaces" data-link>
          <span data-i18n="hero.explore">${esc(T('hero.explore'))}</span>${ICON.arrow}
        </a>
      </div>
      <a class="hero-scroll" href="#intro" data-scroll>
        <span data-i18n="hero.scroll">${esc(T('hero.scroll'))}</span>
        <i></i>
      </a>
    </section>

    <section class="section section-intro" id="intro">
      <div class="wrap grid-2">
        <div data-reveal>
          <p class="eyebrow">${esc(T('home.introEyebrow'))}</p>
          <h2 class="display">${esc(T('home.introTitle'))}</h2>
        </div>
        <div class="intro-side" data-reveal data-reveal-delay="0.1">
          <p class="lede">${esc(T('home.introBody'))}</p>
          <ul class="stats">
            <li><b data-count="${D.SPACES.length}">0</b><span>${esc(T('home.stat1'))}</span></li>
            <li><b data-count="${D.districts().length}">0</b><span>${esc(T('home.stat2'))}</span></li>
            <li><b>${esc(T('home.stat3v'))}</b><span>${esc(T('home.stat3'))}</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section section-cats">
      <div class="wrap">
        <header class="section-head" data-reveal>
          <p class="eyebrow">${esc(T('home.catEyebrow'))}</p>
          <h2 class="display">${esc(T('home.catTitle'))}</h2>
          <p class="lede">${esc(T('home.catBody'))}</p>
        </header>
        <div class="cat-grid">${D.CATEGORIES.map(categoryTile).join('')}</div>
      </div>
    </section>

    <section class="section section-featured">
      <div class="wrap">
        <header class="section-head section-head-row" data-reveal>
          <div>
            <p class="eyebrow">${esc(T('home.featuredEyebrow'))}</p>
            <h2 class="display">${esc(T('home.featuredTitle'))}</h2>
            <p class="lede">${esc(T('home.featuredBody'))}</p>
          </div>
          <a class="btn btn-ghost" href="#/spaces" data-link>${esc(T('home.featuredAll'))}${ICON.arrow}</a>
        </header>
        <div class="card-grid">${featured.map(spaceCard).join('')}</div>
      </div>
    </section>

    <section class="section section-how">
      <div class="wrap">
        <header class="section-head" data-reveal>
          <p class="eyebrow">${esc(T('home.howEyebrow'))}</p>
          <h2 class="display">${esc(T('home.howTitle'))}</h2>
        </header>
        <ol class="steps">
          ${[1, 2, 3].map(i => `
            <li data-reveal data-reveal-delay="${(i - 1) * 0.08}">
              <span class="step-n">0${i}</span>
              <h3>${esc(T('home.how' + i + 't'))}</h3>
              <p>${esc(T('home.how' + i + 'b'))}</p>
            </li>`).join('')}
        </ol>
      </div>
    </section>

    <section class="section section-quote">
      <div class="wrap">
        <figure data-reveal>
          <blockquote class="quote">${esc(T('home.quote'))}</blockquote>
          <figcaption class="quote-mark">مرفأ روّاد الإنجاز</figcaption>
        </figure>
        <a class="btn btn-solid" href="#/spaces" data-link data-reveal>${esc(T('hero.explore'))}${ICON.arrow}</a>
      </div>
    </section>`;
  }

  home.mount = function () {
    const canvas = document.getElementById('heroCanvas');
    const heroSection = document.getElementById('hero');

    /* a drawn still stands behind the canvas: it covers the first frame and
       remains the hero on a device with no WebGL at all */
    if (heroSection) {
      heroSection.style.setProperty('--poster',
        'url("' + FS.Imagery.scene('offices', 'hero-poster', 1600, 1000) + '")');
    }
    if (canvas && (!window.THREE || !FS.Studio.supported())) canvas.hidden = true;
    if (canvas && window.THREE && !FS.heroInstance) {
      const hero = new FS.Hero3D(canvas);
      if (hero.init()) {
        FS.heroInstance = hero;
        hero.start();
      }
    } else if (FS.heroInstance && canvas) {
      /* re-mounting home: hand the live scene its new canvas */
      FS.heroInstance.dispose();
      FS.heroInstance = null;
      const hero = new FS.Hero3D(canvas);
      if (hero.init()) { FS.heroInstance = hero; hero.start(); }
    }

    const heroEl = document.getElementById('hero');
    if (heroEl && FS.heroInstance) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => e.isIntersecting ? FS.heroInstance.start() : FS.heroInstance.stop());
      }, { threshold: 0.02 });
      io.observe(heroEl);
      FS.heroIO = io;

      const onScroll = () => {
        const k = Math.min(1, window.scrollY / (window.innerHeight || 1));
        FS.heroInstance.setScroll(k);
        heroEl.style.setProperty('--heroK', k.toFixed(3));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      FS.heroScroll = onScroll;
      onScroll();
    }
  };

  /* ═══════════════ SPACES ═══════════════ */

  function filterBar() {
    const services = D.activeServices();
    const geoOn = !!S.coords;
    return `
    <form class="filters" id="filters" data-reveal>
      <div class="filter-row">
        <label class="field field-search">
          <span class="sr-only">${esc(T('spaces.search'))}</span>
          <input type="search" name="q" value="${esc(filters.q)}" placeholder="${esc(T('spaces.search'))}" autocomplete="off" />
        </label>

        <label class="field">
          <span class="field-label">${esc(T('filter.sort'))}</span>
          <select name="sort">
            <option value="recommended"${filters.sort === 'recommended' ? ' selected' : ''}>${esc(T('filter.sort.recommended'))}</option>
            <option value="nearest"${filters.sort === 'nearest' ? ' selected' : ''}>${esc(T('filter.sort.nearest'))}</option>
            <option value="rated"${filters.sort === 'rated' ? ' selected' : ''}>${esc(T('filter.sort.rated'))}</option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">${esc(T('filter.type'))}</span>
          <select name="cat">
            <option value="all"${filters.cat === 'all' ? ' selected' : ''}>${esc(T('filter.type.all'))}</option>
            ${D.CATEGORIES.map(c => `<option value="${c.id}"${filters.cat === c.id ? ' selected' : ''}>${esc(L(c.name))}</option>`).join('')}
          </select>
        </label>

        <label class="field">
          <span class="field-label">${esc(T('filter.people'))}</span>
          <select name="people">
            <option value="0"${!filters.people ? ' selected' : ''}>${esc(T('filter.people.any'))}</option>
            ${[2, 6, 12, 25, 50, 100].map(n => `<option value="${n}"${filters.people === n ? ' selected' : ''}>${esc(T('filter.people.n', { n: N(n) }))}</option>`).join('')}
          </select>
        </label>
      </div>

      <div class="filter-row filter-row-toggles">
        <button type="button" class="toggle${filters.availableOnly ? ' is-on' : ''}" data-toggle="availableOnly" aria-pressed="${filters.availableOnly}">
          <i class="dot"></i>${esc(T('filter.available'))}
        </button>
        <button type="button" class="toggle${filters.offersOnly ? ' is-on' : ''}" data-toggle="offersOnly" aria-pressed="${filters.offersOnly}">
          ${esc(T('filter.offers'))}
        </button>
        <button type="button" class="toggle toggle-geo${geoOn ? ' is-on' : ''}" id="geoBtn" aria-pressed="${geoOn}">
          ${ICON.pin}<span>${esc(T(geoOn ? 'filter.locationOn' : 'filter.location'))}</span>
        </button>
        ${activeFilterCount() ? `<button type="button" class="toggle toggle-clear" id="clearFilters">${esc(T('spaces.clear'))}</button>` : ''}
      </div>

      <fieldset class="filter-services">
        <legend class="field-label">${esc(T('filter.services'))}</legend>
        <div class="service-scroll">
          ${services.map(k => `
            <button type="button" class="chip chip-btn${filters.services.indexOf(k) !== -1 ? ' is-on' : ''}"
              data-service="${k}" aria-pressed="${filters.services.indexOf(k) !== -1}">${esc(T('srv.' + k))}</button>`).join('')}
        </div>
      </fieldset>
      <p class="filter-hint" id="geoHint">${esc(geoOn ? '' : T('filter.locationHint'))}</p>
    </form>`;
  }

  function spaces(catId) {
    if (catId) filters.cat = catId;
    const cat = catId ? D.category(catId) : null;
    const list = applyFilters();

    return `
    <section class="page-head${cat ? ' page-head-cat' : ''}">
      ${cat ? `<div class="page-head-media" data-parallax="0.06">${photoImg(cat.id, 'wide', '')}</div>
               <span class="page-head-shade"></span>` : ''}
      <div class="wrap">
        <p class="eyebrow" data-reveal>${cat ? esc(cat.index) + ' · ' + esc(T('nav.spaces')) : esc(T('nav.spaces'))}</p>
        <h1 class="display display-xl" data-reveal>${cat ? esc(L(cat.name)) : esc(T('spaces.title'))}</h1>
        <p class="lede" data-reveal data-reveal-delay="0.08">${cat ? esc(T(cat.long)) : esc(T('spaces.subtitle'))}</p>
        ${cat ? `<ul class="suited" data-reveal data-reveal-delay="0.12">${L(cat.suited).map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      </div>
    </section>

    <section class="section section-list">
      <div class="wrap">
        ${filterBar()}
        <p class="result-count" id="resultCount">${esc(list.length === 1 ? T('spaces.resultsOne') : T('spaces.results', { n: N(list.length) }))}</p>
        <div class="card-grid" id="results">
          ${list.length ? list.map(spaceCard).join('') : emptyState()}
        </div>
      </div>
    </section>`;
  }

  function emptyState() {
    return `<div class="empty" data-reveal>
      <p class="empty-title">${esc(T('spaces.none'))}</p>
      <p class="empty-hint">${esc(T('spaces.noneHint'))}</p>
    </div>`;
  }

  spaces.mount = function () {
    const form = document.getElementById('filters');
    if (!form) return;

    function rerender() {
      const list = applyFilters();
      const results = document.getElementById('results');
      const count = document.getElementById('resultCount');
      results.innerHTML = list.length ? list.map(spaceCard).join('') : emptyState();
      count.textContent = list.length === 1 ? T('spaces.resultsOne') : T('spaces.results', { n: N(list.length) });
      FS.Motion.refresh(results);
      FS.Studio.hydrate(results);
      /* the clear-filters chip appears and disappears with the filter set */
      const row = form.querySelector('.filter-row-toggles');
      let clear = document.getElementById('clearFilters');
      if (activeFilterCount() && !clear) {
        clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'toggle toggle-clear';
        clear.id = 'clearFilters';
        clear.textContent = T('spaces.clear');
        row.appendChild(clear);
      } else if (!activeFilterCount() && clear) {
        clear.remove();
      }
    }
    FS.rerenderResults = rerender;

    let debounce;
    form.addEventListener('input', e => {
      const el = e.target;
      if (el.name === 'q') {
        filters.q = el.value;
        clearTimeout(debounce);
        debounce = setTimeout(rerender, 180);
        return;
      }
      if (el.name === 'sort') {
        filters.sort = el.value;
        if (filters.sort === 'nearest' && !S.coords) {
          askLocation().finally(rerender);
          return;
        }
      }
      if (el.name === 'cat') filters.cat = el.value;
      if (el.name === 'people') filters.people = parseInt(el.value, 10) || 0;
      rerender();
    });

    form.addEventListener('click', e => {
      const tog = e.target.closest('[data-toggle]');
      if (tog) {
        const key = tog.getAttribute('data-toggle');
        filters[key] = !filters[key];
        tog.classList.toggle('is-on', filters[key]);
        tog.setAttribute('aria-pressed', String(filters[key]));
        rerender();
        return;
      }
      const srv = e.target.closest('[data-service]');
      if (srv) {
        const k = srv.getAttribute('data-service');
        const i = filters.services.indexOf(k);
        if (i === -1) filters.services.push(k); else filters.services.splice(i, 1);
        srv.classList.toggle('is-on', i === -1);
        srv.setAttribute('aria-pressed', String(i === -1));
        rerender();
        return;
      }
      if (e.target.closest('#geoBtn')) { askLocation(); return; }
      if (e.target.closest('#clearFilters')) {
        filters.q = ''; filters.cat = 'all'; filters.sort = 'recommended';
        filters.people = 0; filters.availableOnly = false;
        filters.offersOnly = false; filters.services = [];
        FS.render();
        return;
      }
    });
  };

  function askLocation() {
    const btn = document.getElementById('geoBtn');
    const hint = document.getElementById('geoHint');
    if (S.coords) return Promise.resolve(S.coords);
    if (btn) { btn.classList.add('is-loading'); btn.querySelector('span').textContent = T('filter.locating'); }
    return S.requestLocation().then(c => {
      if (btn) {
        btn.classList.remove('is-loading');
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        btn.querySelector('span').textContent = T('filter.locationOn');
      }
      if (hint) hint.textContent = '';
      if (FS.rerenderResults) FS.rerenderResults();
      return c;
    }).catch(err => {
      if (btn) {
        btn.classList.remove('is-loading');
        btn.querySelector('span').textContent = T('filter.location');
      }
      if (hint) hint.textContent = T(S.geoState === 'denied' ? 'filter.locationDenied' : 'filter.locationFail');
      FS.toast(T(S.geoState === 'denied' ? 'filter.locationDenied' : 'filter.locationFail'));
      throw err;
    });
  }
  FS.askLocation = askLocation;

  /* ═══════════════ SPACE DETAIL ═══════════════ */

  function detail(id) {
    const sp = D.space(id);
    if (!sp) return `<section class="section"><div class="wrap"><h1 class="display">${esc(T('detail.notFound'))}</h1>
      <a class="btn btn-ghost" href="#/spaces" data-link>${esc(T('detail.back'))}</a></div></section>`;

    S.pushRecent(sp.id);
    const cat = D.category(sp.cat);
    const st = D.statusOf(sp);
    const similar = D.byCategory(sp.cat).filter(s => s.id !== sp.id)
      .sort((a, b) => b.rating - a.rating).slice(0, 3);
    const km = D.distanceKm(sp, S.coords);

    return `
    <article class="detail">
      <header class="detail-hero">
        <div class="detail-hero-media" data-parallax="0.08">${photoImg(sp.cat, sp.seed, L(sp.name))}</div>
        <span class="detail-hero-shade"></span>
        <div class="wrap detail-hero-body">
          <a class="back-link" href="#/spaces/${sp.cat}" data-link>${ICON.arrow}${esc(T('detail.back'))}</a>
          <p class="eyebrow">${esc(cat.index)} · ${esc(L(cat.name))}</p>
          <h1 class="display display-xl">${esc(L(sp.name))}</h1>
          <p class="detail-meta">
            ${statusPill(sp)}
            ${stars(sp.rating)}
            <span class="meta-bit meta-quiet">${esc(T('detail.reviews', { n: N(sp.reviews) }))}</span>
            <span class="meta-bit">${ICON.pin}${esc(L(sp.district))}</span>
            ${km != null ? `<span class="meta-bit">${esc(T('card.km', { n: N(km < 10 ? km.toFixed(1) : Math.round(km)) }))}</span>` : ''}
          </p>
          <div class="detail-actions">
            ${favButton(sp.id, true)}
            <a class="btn btn-solid" href="https://www.google.com/maps/search/?api=1&query=${sp.lat},${sp.lng}"
               target="_blank" rel="noopener">${esc(T('detail.map'))}${ICON.arrow}</a>
          </div>
        </div>
      </header>

      <section class="section">
        <div class="wrap detail-grid">
          <div class="detail-main">
            <h2 class="sub" data-reveal>${esc(T('detail.about'))}</h2>
            <p class="prose" data-reveal>${esc(L(sp.desc))}</p>

            <h2 class="sub" data-reveal>${esc(T('detail.services'))}</h2>
            <ul class="service-grid" data-reveal>
              ${sp.services.map(k => `<li>${esc(T('srv.' + k))}</li>`).join('')}
            </ul>

            <h2 class="sub" data-reveal>${esc(T('detail.offers'))}</h2>
            ${sp.offer
              ? `<p class="offer-block" data-reveal>${esc(L(sp.offer))}</p>`
              : `<p class="prose prose-quiet" data-reveal>${esc(T('detail.noOffers'))}</p>`}

            <h2 class="sub" data-reveal>${esc(T('detail.suited'))}</h2>
            <ul class="suited" data-reveal>${L(cat.suited).map(s => `<li>${esc(s)}</li>`).join('')}</ul>
          </div>

          <aside class="detail-side" data-reveal data-reveal-delay="0.1">
            <dl class="facts">
              <div><dt>${esc(T('detail.capacity'))}</dt><dd>${esc(T('detail.capacityV', { n: N(sp.capacity) }))}</dd></div>
              <div><dt>${esc(T('detail.district'))}</dt><dd>${esc(L(sp.district))}</dd></div>
              <div><dt>${esc(T('detail.hours'))}</dt><dd dir="ltr">${esc(D.fmtHour(sp.hours.open))} — ${esc(D.fmtHour(sp.hours.close))}</dd></div>
              ${sp.price ? `<div><dt>${esc(T('detail.price'))}</dt><dd>${esc(T('detail.priceV', { n: N(sp.price) }))}</dd></div>` : ''}
            </dl>
            <p class="side-status side-status-${st}">${ICON.clock}${esc(T('status.' + st))}${st === 'busy' ? ' · ' + esc(T('time.busyNote')) : ''}</p>
          </aside>
        </div>
      </section>

      <section class="section section-similar">
        <div class="wrap">
          <h2 class="display" data-reveal>${esc(T('detail.similar'))}</h2>
          <div class="card-grid">${similar.map(spaceCard).join('')}</div>
        </div>
      </section>
    </article>`;
  }

  /* ═══════════════ ABOUT ═══════════════ */

  function about() {
    return `
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow" data-reveal>${esc(T('about.eyebrow'))}</p>
        <h1 class="display display-xl" data-reveal>${esc(T('about.title'))}</h1>
        <p class="slogan-lg" data-reveal data-reveal-delay="0.06">مرفأ روّاد الإنجاز</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid-2">
        <div class="prose-col" data-reveal>
          <p class="lede">${esc(T('about.body1'))}</p>
          <p class="prose">${esc(T('about.body2'))}</p>
          <p class="prose">${esc(T('about.body3'))}</p>
        </div>
        <div class="about-media" data-reveal data-reveal-delay="0.1" data-parallax="0.05">${photoImg('offices', 'about', '')}</div>
      </div>
    </section>

    <section class="section section-values">
      <div class="wrap">
        <ul class="values">
          ${[1, 2, 3].map(i => `
            <li data-reveal data-reveal-delay="${(i - 1) * 0.08}">
              <h3>${esc(T('about.v' + i + 't'))}</h3>
              <p>${esc(T('about.v' + i + 'b'))}</p>
            </li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="section section-cats">
      <div class="wrap">
        <div class="cat-grid">${D.CATEGORIES.map(categoryTile).join('')}</div>
      </div>
    </section>

    <section class="section section-quote">
      <div class="wrap">
        <figure data-reveal>
          <blockquote class="quote">${esc(T('home.quote'))}</blockquote>
          <figcaption class="quote-mark">FOCUS SPACE</figcaption>
        </figure>
      </div>
    </section>`;
  }

  /* ═══════════════ CONTACT ═══════════════ */

  function contact() {
    const C = FS.CONFIG;
    return `
    <section class="page-head page-head-contact">
      <div class="wrap">
        <p class="eyebrow" data-reveal>${esc(T('contact.eyebrow'))}</p>
        <h1 class="display display-xl" data-reveal>Let’s Connect</h1>
        <p class="slogan-lg" data-reveal data-reveal-delay="0.06">مرفأ روّاد الإنجاز</p>
        <p class="lede" data-reveal data-reveal-delay="0.1">${esc(T('contact.body'))}</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap contact-grid">
        <aside class="contact-details" data-reveal>
          <div class="contact-item">
            <p class="field-label">${esc(T('contact.emailLabel'))}</p>
            <a class="contact-link" href="mailto:${C.email}">${esc(C.email)}</a>
          </div>
          <div class="contact-item">
            <p class="field-label">${esc(T('contact.phoneLabel'))}</p>
            <a class="contact-link" href="tel:${C.phoneIntl}" dir="ltr">${esc(C.phone)}</a>
          </div>
          <div class="contact-item">
            <p class="field-label">${esc(T('contact.hoursLabel'))}</p>
            <p class="contact-plain">${esc(T('contact.hoursValue'))}</p>
          </div>
        </aside>

        <div class="contact-form-wrap" data-reveal data-reveal-delay="0.08">
          <h2 class="sub">${esc(T('contact.formTitle'))}</h2>
          <form class="contact-form" id="contactForm" novalidate>
            <label class="field">
              <span class="field-label">${esc(T('contact.name'))}</span>
              <input type="text" name="name" autocomplete="name" required />
              <em class="field-error" data-error="name"></em>
            </label>
            <label class="field">
              <span class="field-label">${esc(T('contact.email'))}</span>
              <input type="email" name="email" autocomplete="email" dir="ltr" required />
              <em class="field-error" data-error="email"></em>
            </label>
            <label class="field">
              <span class="field-label">${esc(T('contact.subject'))}</span>
              <input type="text" name="subject" required />
              <em class="field-error" data-error="subject"></em>
            </label>
            <label class="field">
              <span class="field-label">${esc(T('contact.message'))}</span>
              <textarea name="message" rows="5" required></textarea>
              <em class="field-error" data-error="message"></em>
            </label>
            <button type="submit" class="btn btn-solid btn-block">${esc(T('contact.send'))}${ICON.arrow}</button>
          </form>

          <div class="contact-thanks" id="contactThanks" hidden>
            <span class="thanks-mark">✓</span>
            <p class="thanks-line">${esc(T('contact.thanks'))}</p>
            <button type="button" class="btn btn-ghost" id="contactAgain">${esc(T('contact.another'))}</button>
          </div>
        </div>
      </div>
    </section>`;
  }

  contact.mount = function () {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const thanks = document.getElementById('contactThanks');

    const rules = {
      name: v => v.trim().length >= 2 || T('contact.errName'),
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || T('contact.errEmail'),
      subject: v => v.trim().length >= 2 || T('contact.errSubject'),
      message: v => v.trim().length >= 6 || T('contact.errMessage')
    };

    function validate(showAll) {
      let ok = true;
      Object.keys(rules).forEach(key => {
        const input = form.elements[key];
        const slot = form.querySelector(`[data-error="${key}"]`);
        const res = rules[key](input.value);
        const bad = res !== true;
        if (bad) ok = false;
        if (showAll || input.dataset.touched) {
          slot.textContent = bad ? res : '';
          input.classList.toggle('is-invalid', bad);
          input.setAttribute('aria-invalid', String(bad));
        }
      });
      return ok;
    }

    form.addEventListener('blur', e => {
      if (e.target.name) { e.target.dataset.touched = '1'; validate(false); }
    }, true);
    form.addEventListener('input', () => validate(false));

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(true)) {
        const first = form.querySelector('.is-invalid');
        if (first) first.focus();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = T('contact.sending');
      /* No backend in this build: the submission is acknowledged locally. */
      setTimeout(() => {
        form.hidden = true;
        thanks.hidden = false;
        thanks.classList.add('is-in');
        thanks.focus && thanks.focus();
      }, 620);
    });

    document.getElementById('contactAgain').addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      thanks.hidden = true;
      thanks.classList.remove('is-in');
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = false;
      btn.innerHTML = esc(T('contact.send')) + ICON.arrow;
      form.querySelectorAll('.field-error').forEach(n => n.textContent = '');
      form.querySelectorAll('.is-invalid').forEach(n => n.classList.remove('is-invalid'));
    });
  };

  /* ═══════════════ PROFILE ═══════════════ */

  function profile() {
    const p = S.profile;
    const favs = S.favorites.map(D.space).filter(Boolean);
    const recents = S.recents.map(D.space).filter(Boolean);
    const avatar = p.photo || FS.Imagery.avatar(p.name || 'Focus Space');
    const districts = D.districts();

    return `
    <section class="page-head page-head-profile">
      <div class="wrap profile-head">
        <span class="profile-photo" data-reveal><img id="profilePhoto" src="${avatar}" alt="" /></span>
        <div data-reveal data-reveal-delay="0.06">
          <p class="eyebrow">${esc(T('profile.title'))}</p>
          <h1 class="display display-xl" id="profileHeading">${esc(p.name || T('profile.guest'))}</h1>
          <p class="lede">${esc(T('fav.title'))}: ${N(favs.length)} · ${esc(T('profile.recent'))}: ${N(recents.length)}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap profile-grid">
        <form class="panel" id="profileForm" data-reveal>
          <h2 class="sub">${esc(T('profile.account'))}</h2>

          <div class="photo-row">
            <span class="photo-thumb"><img id="photoThumb" src="${avatar}" alt="" /></span>
            <div>
              <p class="field-label">${esc(T('profile.photo'))}</p>
              <p class="field-hint">${esc(T('profile.photoHint'))}</p>
              <div class="photo-actions">
                <label class="btn btn-ghost btn-sm">
                  ${esc(T('profile.photoUpload'))}
                  <input type="file" accept="image/*" id="photoInput" hidden />
                </label>
                ${p.photo ? `<button type="button" class="btn btn-quiet btn-sm" id="photoRemove">${esc(T('profile.photoRemove'))}</button>` : ''}
              </div>
            </div>
          </div>

          <label class="field">
            <span class="field-label">${esc(T('profile.editName'))}</span>
            <input type="text" name="name" value="${esc(p.name)}" autocomplete="name" />
          </label>
          <label class="field">
            <span class="field-label">${esc(T('profile.email'))}</span>
            <input type="email" name="email" value="${esc(p.email)}" dir="ltr" autocomplete="email" />
          </label>
          <label class="field">
            <span class="field-label">${esc(T('profile.city'))}</span>
            <select name="district">
              <option value="">${esc(T('profile.cityAny'))}</option>
              ${districts.map(d => `<option value="${esc(d.en)}"${p.district === d.en ? ' selected' : ''}>${esc(L(d))}</option>`).join('')}
            </select>
          </label>

          <label class="switch">
            <input type="checkbox" name="notify"${p.notify ? ' checked' : ''} />
            <span>${esc(T('profile.notify'))}</span>
          </label>
          <label class="switch">
            <input type="checkbox" name="reduceMotion"${p.reduceMotion ? ' checked' : ''} />
            <span>${esc(T('profile.motion'))}</span>
          </label>

          <div class="panel-actions">
            <button type="submit" class="btn btn-solid btn-sm">${esc(T('profile.save'))}</button>
            <button type="button" class="btn btn-quiet btn-sm" id="clearData">${esc(T('profile.clear'))}</button>
          </div>
        </form>

        <div class="panel" data-reveal data-reveal-delay="0.08">
          <h2 class="sub">${esc(T('profile.language'))}</h2>
          <p class="field-hint">${esc(T('profile.languageHint'))}</p>
          <div class="lang-choice">
            <button type="button" class="lang-card lang-btn${S.lang === 'ar' ? ' is-on' : ''}" data-lang="ar" lang="ar">
              <b>العربية</b><span>RTL</span>
            </button>
            <button type="button" class="lang-card lang-btn${S.lang === 'en' ? ' is-on' : ''}" data-lang="en" lang="en">
              <b>English</b><span>LTR</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-list">
      <div class="wrap">
        <h2 class="display" data-reveal>${esc(T('fav.title'))}</h2>
        <div class="card-grid" id="favGrid">
          ${favs.length ? favs.map(spaceCard).join('') : `<div class="empty" data-reveal>
            <p class="empty-title">${esc(T('fav.empty'))}</p>
            <p class="empty-hint">${esc(T('fav.emptyHint'))}</p>
            <a class="btn btn-ghost" href="#/spaces" data-link>${esc(T('hero.explore'))}</a>
          </div>`}
        </div>
      </div>
    </section>

    <section class="section section-recent">
      <div class="wrap">
        <h2 class="display" data-reveal>${esc(T('profile.recent'))}</h2>
        ${recents.length ? `<div class="recent-row">${recents.map(recentChip).join('')}</div>`
          : `<p class="prose prose-quiet" data-reveal>${esc(T('profile.recentEmpty'))}</p>`}
      </div>
    </section>`;
  }

  function recentChip(sp) {
    return `<a class="recent-card" href="#/space/${sp.id}" data-link data-reveal>
      <span class="recent-media">${photoImg(sp.cat, sp.seed, '')}</span>
      <span class="recent-body">
        <b>${esc(L(sp.name))}</b>
        <span>${esc(L(sp.district))}</span>
      </span>
    </a>`;
  }

  profile.mount = function () {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      S.saveProfile({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        district: form.elements.district.value,
        notify: form.elements.notify.checked,
        reduceMotion: form.elements.reduceMotion.checked
      });
      document.getElementById('profileHeading').textContent = S.profile.name || T('profile.guest');
      if (!S.profile.photo) {
        const src = FS.Imagery.avatar(S.profile.name || 'Focus Space');
        document.getElementById('profilePhoto').src = src;
        document.getElementById('photoThumb').src = src;
      }
      FS.paintAvatar();
      FS.toast(T('profile.saved'));
    });

    const input = document.getElementById('photoInput');
    input && input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => downscale(reader.result, 320).then(src => {
        S.saveProfile({ photo: src });
        FS.render();
        FS.toast(T('profile.saved'));
      });
      reader.readAsDataURL(file);
    });

    const rm = document.getElementById('photoRemove');
    rm && rm.addEventListener('click', () => {
      S.saveProfile({ photo: '' });
      FS.render();
    });

    document.getElementById('clearData').addEventListener('click', () => {
      if (!window.confirm(T('profile.clearConfirm'))) return;
      S.clearAll();
      FS.render();
      FS.toast(T('profile.cleared'));
    });
  };

  /* Keep uploaded photos small enough for localStorage. */
  function downscale(dataUrl, size) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const g = c.getContext('2d');
        const s = Math.min(img.width, img.height);
        g.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  FS.Views = { home, spaces, detail, about, contact, profile, spaceCard, applyFilters };
})(window.FS);
