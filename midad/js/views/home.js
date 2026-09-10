/* ═══════════ HOME — the grand hall ═══════════ */
import { t, pick, other, n, dec, isAr } from '../i18n.js';
import { esc, icon, bi, biRaw, bookTile, shead, stars, coverVars, bTitle, bAuthor, genre } from '../ui.js';
import { totals, recentlyFinished, recommendations, favouriteGenre } from '../metrics.js';
import { allMarginalia, cloth } from '../data.js';

const FEATURES = [
  ['book',   'home.f1'], ['quill', 'home.f2'], ['swap',  'home.f3'],
  ['people', 'home.f4'], ['stats', 'home.f5'], ['spark', 'home.f6'],
];

export default function home() {
  const s = totals();
  const recent = recentlyFinished(6);
  const marg = allMarginalia().filter((m) => m.kind === 'quote' || m.kind === 'stayed');
  const q = marg[Math.floor(Date.now() / 36e5) % (marg.length || 1)] || null;
  const fav = favouriteGenre();

  const statRow = (ic, val, key) => `
    <div class="statrow">
      <span class="statrow__ic">${icon(ic)}</span>
      <div>
        <div class="statrow__val">${val}</div>
        <div class="statrow__lab">${bi(key)}</div>
      </div>
    </div>`;

  return `
  <section class="hero wrap" aria-labelledby="heroTitle">
    <div class="hero__grid">

      <!-- a quote, floating out of the margins -->
      <div class="hero__side">
        ${q ? `
        <figure class="qpanel holo hpanel hpanel--a" style="margin:0">
          <div class="hpanel__head">${icon('quill')}<span>${esc(t('home.fromMargins'))}</span></div>
          <blockquote class="qpanel__ar">${esc(pick(q.text))}</blockquote>
          ${other(q.text) ? `<p class="qpanel__en">${esc(other(q.text))}</p>` : ''}
          <figcaption class="qpanel__src">${esc(bTitle(q.book))} — ${esc(bAuthor(q.book))}</figcaption>
        </figure>` : ''}
      </div>

      <!-- the centre of the hall -->
      <div class="hero__mid">
        <h1 class="hero__title" id="heroTitle">مِداد</h1>
        <p class="hero__latin">MIDĀD</p>
        <div class="hero__claim">
          <p class="hero__claim-ar">${esc(t('home.claim.ar'))}</p>
          <p class="hero__claim-en">${esc(t('home.claim.en'))}</p>
        </div>

        <!-- the holographic open book -->
        <div class="holobook" role="group" aria-label="${esc(t('home.journey'))}">
          <div class="holobook__spread">
            <div class="holobook__page">
              <div class="holobook__label">${esc(t('home.journey'))}</div>
              <div class="holobook__rows">
                <div class="holobook__row"><span>${esc(t('st.finished'))}</span><span class="num">${n(s.books)}</span></div>
                <div class="holobook__row"><span>${esc(t('st.pages'))}</span><span class="num">${n(s.pages)}</span></div>
                <div class="holobook__row"><span>${esc(t('st.avg'))}</span><span class="num">${dec(s.avg)}</span></div>
                <div class="holobook__row"><span>${esc(t('st.notes'))}</span><span class="num">${n(s.notes)}</span></div>
              </div>
            </div>
            <div class="holobook__page">
              <div class="holobook__label">${esc(t('home.archive'))}</div>
              <blockquote class="holobook__quote">«${esc(t('home.trace'))}»</blockquote>
              ${isAr() ? `<p class="holobook__quote-en">${esc(t('home.traceEn'))}</p>` : ''}
              ${fav ? `<p class="holobook__quote-en" style="margin-top:.9rem">${esc(t('lc.favGenre'))} — ${esc(genre(fav))}</p>` : ''}
            </div>
            <span class="holobook__spine"></span>
          </div>
          <div class="pedestal"><span class="pedestal__glow"></span><span class="pedestal__disc"></span></div>
        </div>

        <div class="hero__cta">
          <a class="btn btn--holo" href="#/library">${icon('shelf')}<span>${esc(t('home.enter'))}</span></a>
          <a class="btn btn--ghost" href="#/chronicles">${icon('chron')}<span>${esc(t('home.chronicle'))}</span></a>
        </div>
      </div>

      <!-- the statistics panel -->
      <div class="hero__side">
        <div class="holo hpanel hpanel--b">
          <div class="hpanel__head">${icon('stats')}<span>${esc(t('nav.stats'))}</span></div>
          ${statRow('book', n(s.books), 'st.finished')}
          ${statRow('pages', n(s.pages), 'st.pages')}
          ${statRow('star', dec(s.avg), 'st.avg')}
          ${statRow('calendar', n(s.thisYear), 'st.thisYear')}
        </div>
      </div>

    </div>
  </section>

  <!-- ── what MIDĀD keeps ── -->
  <section class="features">
    <div class="wrap">
      <div class="features__row">
        ${FEATURES.map(([ic, key]) => `
          <div class="feature">
            <span class="feature__ring">${icon(ic, 'ic ic--lg')}</span>
            ${bi(key)}
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── recently finished, on a shelf ── -->
  <section class="section wrap">
    <div class="shead">
      <h2>${shead('home.recent')}</h2>
      <a class="btn btn--sm btn--ghost" href="#/library">${esc(t('home.recentAll'))}${icon('arrow')}</a>
    </div>
    <div class="shelf">
      <div class="shelf__books">${recent.map(bookTile).join('')}</div>
      <div class="shelf__board"></div>
    </div>
  </section>

  <!-- ── recommended for you ── -->
  <section class="section wrap" style="padding-top:0">
    <div class="shead"><h2>${shead('rc.title')}</h2>
      <p class="muted" style="font-size:.82rem;max-width:26rem;margin:0">${esc(t('rc.lede'))}</p></div>
    <div class="recs">
      ${recommendations(4).map((p) => {
        const [c1, c2] = cloth(p.genre);
        const why = p.why.key === 'rc.becauseGenre' ? t('rc.becauseGenre', genre(p.why.arg))
                  : p.why.key === 'rc.becauseAuthor' ? t('rc.becauseAuthor', p.why.arg)
                  : t('rc.becauseWide');
        return `
        <article class="rec holo holo--quiet" style="--c1:${c1};--c2:${c2}">
          <span class="rec__cover"></span>
          <div>
            <h3 class="rec__t">${esc(pick({ ar: p.titleAr, en: p.titleEn }))}</h3>
            <p class="rec__a">${esc(pick({ ar: p.authorAr, en: p.authorEn }))} · ${esc(genre(p.genre))} · ${n(p.pages)} ${esc(t('w.page'))}</p>
            <p class="rec__why">${esc(why)}</p>
          </div>
        </article>`;
      }).join('')}
    </div>
  </section>`;
}
