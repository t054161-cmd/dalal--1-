/* ═══════════ HOME — the grand hall ═══════════ */
import { t, n, dec } from '../i18n.js';
import { esc, icon, bi, bookTile, shead } from '../ui.js';
import { totals, recentlyFinished } from '../metrics.js';

export default function home() {
  const s = totals();
  const recent = recentlyFinished(6);

  /* four figures, set in the wood of the room rather than on a screen */
  const figure = (ic, val, key) => `
    <div class="figure">
      <span class="figure__ic">${icon(ic, 'ic ic--lg')}</span>
      <span class="figure__v">${val}</span>
      ${bi(key)}
    </div>`;

  return `
  <section class="hero wrap" aria-labelledby="heroTitle">
    <div class="hero__mid">
      <h1 class="hero__title" id="heroTitle">مِداد</h1>
      <p class="hero__latin">MIDĀD</p>
      <div class="hero__claim">
        <p class="hero__claim-ar">${esc(t('home.claim.ar'))}</p>
        <p class="hero__claim-en">${esc(t('home.claim.en'))}</p>
      </div>
      <p class="hero__what">${esc(t('home.what'))}</p>
      <div class="hero__cta">
        <a class="btn btn--brass btn--lg" href="#/library">${icon('shelf')}<span>${esc(t('home.enter'))}</span></a>
        <a class="hero__minor" href="#/catalog">${esc(t('home.browse'))}${icon('arrow')}</a>
      </div>
    </div>
  </section>

  <!-- ── four figures, quietly ── -->
  <section class="figures">
    <div class="wrap figures__row">
      ${figure('book', n(s.books), 'st.finished')}
      ${figure('pages', n(s.pages), 'st.pages')}
      ${figure('star', dec(s.avg), 'st.avg')}
      ${figure('calendar', n(s.thisYear), 'st.thisYear')}
    </div>
  </section>

  <!-- ── the shelves: the only thing the homepage really asks you to look at ── -->
  <section class="section wrap">
    <div class="shead">
      <h2>${shead('home.recentAr')}</h2>
      <a class="btn btn--sm btn--ghost" href="#/library">${esc(t('home.recentAll'))}${icon('arrow')}</a>
    </div>
    <div class="shelf">
      <div class="shelf__books">${recent.map(bookTile).join('')}</div>
      <div class="shelf__board"></div>
    </div>
  </section>

  <!-- ── the rest of the library, named plainly, nothing projected ── -->
  <section class="section wrap" style="padding-top:0">
    <div class="shead"><h2>${shead('home.features')}</h2></div>
    <nav class="doors">
      ${[['library', 'shelf', 'nav.library'], ['catalog', 'catalog', 'nav.catalog'],
         ['chronicles', 'chron', 'nav.chronicles'], ['marginalia', 'margin', 'nav.marginalia'],
         ['stats', 'stats', 'nav.stats'], ['researcher', 'spark', 'nav.researcher'],
         ['exchange', 'swap', 'nav.exchange'], ['card', 'card', 'nav.card']].map(([slug, ic, key]) => `
        <a class="door" href="#/${slug}">
          <span class="door__ic">${icon(ic, 'ic ic--lg')}</span>
          ${bi(key)}
        </a>`).join('')}
    </nav>
  </section>`;
}
