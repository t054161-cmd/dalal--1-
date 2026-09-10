/* ═══════════ STATISTICS — holograms projected into the hall ═══════════ */
import { t, n, dec, monthShort, monthName } from '../i18n.js';
import { esc, icon, phead, bi, shead, bTitle, bAuthor, genre, stars, coverVars } from '../ui.js';
import { barChart, ring, ranked, heat } from '../charts.js';
import { totals, byMonth, byYear, genreCounts, counted, topRated, longest, years, THIS_YEAR } from '../metrics.js';

export const state = { scale: 'monthly', year: THIS_YEAR };

const GENRE_IC = {
  novel:'book', poetry:'quill', philosophy:'spark', history:'clock', memoir:'page',
  heritage:'seal', world:'lang', thought:'margin', psychology:'people', science:'stats',
};

const card = (ic, val, key, sub = '') => `
  <div class="statcard holo">
    <span class="statcard__ic">${icon(ic, 'ic ic--lg')}</span>
    <span class="statcard__v">${val}${sub ? `<small>${esc(sub)}</small>` : ''}</span>
    ${bi(key)}
  </div>`;

export default function stats() {
  const s = totals();
  const ys = years();
  const yr = ys.includes(+state.year) ? +state.year : (ys[0] ?? THIS_YEAR);
  const authors = counted((b) => b.authorAr);
  const long = longest();

  /* the main chart follows the chosen scale */
  const rows = state.scale === 'yearly'
    ? byYear('books')
    : state.scale === 'pages'
      ? byMonth(yr, 'pages').map((v, i) => ({ label: monthShort(i), value: v }))
      : byMonth(yr, 'books').map((v, i) => ({ label: monthShort(i), value: v }));

  const gc = genreCounts();
  const gcMax = gc[0]?.[1] || 1;

  return `
  <div class="wrap">
    ${phead('nav.stats', 'st.lede')}

    <div class="statgrid" style="margin-bottom:1.25rem">
      ${card('book', n(s.books), 'st.finished')}
      ${card('pages', n(s.pages), 'st.pages')}
      ${card('star', dec(s.avg), 'st.avg', `/ 5`)}
      ${card('calendar', n(s.thisYear), 'st.thisYear')}
      ${card('quill', n(s.notes), 'st.notes')}
    </div>

    <!-- ── the reading rhythm ── -->
    <section class="chartcard holo" style="margin-bottom:1.25rem">
      <div class="chartcard__head">
        <div>
          <h2 class="chartcard__t">${esc(state.scale === 'pages' ? t('st.pagesPerMonth') : state.scale === 'yearly' ? t('nav.stats') : t('st.perMonth'))}</h2>
          <p class="muted" style="font-size:.76rem;margin:.2rem 0 0">${esc(t('st.hint'))}</p>
        </div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
          ${state.scale !== 'yearly' ? `
            <select class="select" data-action="st-year" style="width:auto;padding-block:.4em;font-size:.82rem" aria-label="${esc(t('w.year'))}">
              ${ys.map((y) => `<option value="${y}"${y === yr ? ' selected' : ''}>${y}</option>`).join('')}
            </select>` : ''}
          <div class="seg" role="group">
            <button data-action="st-scale" data-scale="monthly" aria-pressed="${state.scale === 'monthly'}">${esc(t('st.monthly'))}</button>
            <button data-action="st-scale" data-scale="pages" aria-pressed="${state.scale === 'pages'}">${esc(t('st.pages'))}</button>
            <button data-action="st-scale" data-scale="yearly" aria-pressed="${state.scale === 'yearly'}">${esc(t('st.allTime'))}</button>
          </div>
        </div>
      </div>
      ${barChart(rows, { unit: '' })}
    </section>

    <!-- ── favourite genres, as rings ── -->
    <section class="chartcard holo" style="margin-bottom:1.25rem">
      <div class="chartcard__head"><h2 class="chartcard__t">${esc(t('st.genres'))}</h2></div>
      <div class="rings">
        ${gc.slice(0, 5).map(([g, c]) => ring(
          c / gcMax,
          icon(GENRE_IC[g] || 'book'),
          bi(`g.${g}`),
          `${n(c)} ${t('w.books')}`,
        )).join('')}
      </div>
    </section>

    <div class="split" style="margin-bottom:1.25rem">
      <section class="chartcard holo">
        <div class="chartcard__head"><h2 class="chartcard__t">${esc(t('st.authors'))}</h2></div>
        ${ranked(authors.slice(0, 6).map(([a, c]) => ({ label: a, value: c })))}
      </section>
      <section class="chartcard holo">
        <div class="chartcard__head"><h2 class="chartcard__t">${esc(t('st.topRated'))}</h2></div>
        ${ranked(topRated(6).map((b) => ({ label: bTitle(b), value: b.rating, display: dec(b.rating, 0) + '/5' })), 5)}
      </section>
    </div>

    <div class="split">
      <section class="chartcard holo">
        <div class="chartcard__head">
          <h2 class="chartcard__t">${esc(t('st.activity'))}</h2>
          <span class="chip chip--holo">${yr}</span>
        </div>
        ${heat(byMonth(yr, 'books'), [...Array(12)].map((_, i) => monthShort(i)))}
        <p class="muted" style="font-size:.76rem;margin:.9rem 0 0">
          ${esc(monthName(new Date().getMonth()))} — ${n(s.thisMonth)} ${esc(t('w.books'))}
        </p>
      </section>

      <section class="chartcard holo">
        <div class="chartcard__head"><h2 class="chartcard__t">${esc(t('st.longest'))}</h2></div>
        ${long ? `
          <button class="result holo holo--quiet" data-book="${esc(long.id)}" style="width:100%">
            <span class="result__mini" style="${coverVars(long)}"></span>
            <span class="result__body">
              <span class="result__t">${esc(bTitle(long))}</span>
              <span class="result__a">${esc(bAuthor(long))}</span>
              <span class="result__meta">
                <span class="chip chip--holo">${n(long.pages)} ${esc(t('w.page'))}</span>
                <span class="chip chip--muted">${esc(genre(long.genre))}</span>
                ${stars(long.rating, 'stars--holo')}
              </span>
            </span>
          </button>` : ''}
        <div class="rule"><span class="rule__dot"></span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(6rem,1fr));gap:1rem">
          <div><div class="statcard__v" style="font-size:1.5rem">${n(s.authors)}</div><span class="muted" style="font-size:.74rem">${esc(t('w.author'))}</span></div>
          <div><div class="statcard__v" style="font-size:1.5rem">${n(s.genres)}</div><span class="muted" style="font-size:.74rem">${esc(t('w.genre'))}</span></div>
          <div><div class="statcard__v" style="font-size:1.5rem">${n(Math.round(s.pages / Math.max(1, s.books)))}</div><span class="muted" style="font-size:.74rem">${esc(t('w.page'))} / ${esc(t('w.book'))}</span></div>
        </div>
      </section>
    </div>
  </div>`;
}
