/* ═══════════ THE CATALOG — wooden drawers, holographic results ═══════════ */
import { t, n } from '../i18n.js';
import { esc, icon, phead, empty, resultCard, genre, bi, shead } from '../ui.js';
import { db, GENRES } from '../data.js';
import { years } from '../metrics.js';

export const state = { q: '', drawer: null, minRating: 0, year: 'all', lang: 'all' };

const DRAWER_IC = {
  novel:'book', poetry:'quill', philosophy:'spark', history:'clock', memoir:'page',
  heritage:'seal', world:'lang', thought:'margin', psychology:'people', science:'stats',
};

function matches(b) {
  const q = state.q.trim().toLowerCase();
  if (q) {
    const hay = [b.titleAr, b.titleEn, b.authorAr, b.authorEn, genre(b.genre),
                 String(new Date(b.finished).getFullYear())].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (state.drawer && b.genre !== state.drawer) return false;
  if (state.minRating && b.rating < state.minRating) return false;
  if (state.year !== 'all' && new Date(b.finished).getFullYear() !== +state.year) return false;
  if (state.lang !== 'all' && (b.lang || 'ar') !== state.lang) return false;
  return true;
}

export default function catalog() {
  const all = db().books;
  const used = GENRES.filter((g) => all.some((b) => b.genre === g));
  const active = state.q.trim() || state.drawer || state.minRating || state.year !== 'all' || state.lang !== 'all';
  const found = active ? all.filter(matches) : [];

  return `
  <div class="wrap">
    ${phead('nav.catalog', 'cat.lede')}

    <div class="searchbar holo" role="search">
      ${icon('search')}
      <input type="search" id="catQ" value="${esc(state.q)}" data-action="cat-q"
             placeholder="${esc(t('cat.placeholder'))}" aria-label="${esc(t('cat.placeholder'))}" />
      ${active ? `<button class="btn btn--sm btn--ghost" data-action="cat-clear">${icon('x')}<span>${esc(t('cat.clear'))}</span></button>` : ''}
    </div>

    <div class="toolbar holo holo--quiet" style="margin-top:1rem">
      <div class="toolbar__group">
        <span class="toolbar__lab">${esc(t('cat.minRating'))}</span>
        <select class="select" data-action="cat-rating" aria-label="${esc(t('cat.minRating'))}">
          <option value="0"${!state.minRating ? ' selected' : ''}>${esc(t('w.all'))}</option>
          ${[5, 4, 3].map((r) => `<option value="${r}"${state.minRating === r ? ' selected' : ''}>${r} ${esc(t('w.of5'))}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__group">
        <span class="toolbar__lab">${esc(t('w.bookLang'))}</span>
        <div class="seg seg--sm" role="group" aria-label="${esc(t('w.bookLang'))}">
          ${[['all', t('w.allBooks')], ['ar', t('w.arabic')], ['en', t('w.english')]].map(([v, lab]) => `
            <button data-action="cat-lang" data-lang="${v}" aria-pressed="${state.lang === v}">${esc(lab)}</button>`).join('')}
        </div>
      </div>
      <div class="toolbar__group">
        <span class="toolbar__lab">${esc(t('w.year'))}</span>
        <select class="select" data-action="cat-year" aria-label="${esc(t('w.year'))}">
          <option value="all"${state.year === 'all' ? ' selected' : ''}>${esc(t('w.all'))}</option>
          ${years().map((y) => `<option value="${y}"${+state.year === y ? ' selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
      <span class="toolbar__spacer"></span>
      ${active ? `<span class="count"><b>${n(found.length)}</b> ${esc(t('cat.found'))}</span>` : ''}
    </div>

    <section class="section" style="padding-block:2rem 1.5rem">
      <div class="shead"><h2>${shead('cat.drawers')}</h2></div>
      <div class="cabinet">
        ${used.map((g) => {
          const c = all.filter((b) => b.genre === g).length;
          return `
          <button class="drawer" data-action="cat-drawer" data-genre="${g}"
                  aria-pressed="${state.drawer === g}">
            <span class="drawer__n">${n(c)}</span>
            <span class="drawer__ic">${icon(DRAWER_IC[g] || 'book', 'ic ic--lg')}</span>
            ${bi(`g.${g}`)}
          </button>`;
        }).join('')}
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="shead"><h2>${shead('cat.results')}</h2>
        ${active ? `<span class="count"><b>${n(found.length)}</b> ${esc(t('cat.found'))}</span>` : ''}</div>
      ${!active
        ? `<div class="empty holo holo--quiet">${icon('search')}<p class="empty__d">${esc(t('cat.start'))}</p></div>`
        : found.length
          ? `<div class="results">${found.map(resultCard).join('')}</div>`
          : empty('search', 'cat.empty', 'cat.emptyD',
              `<button class="btn" data-action="cat-clear">${esc(t('cat.clear'))}</button>`)}
    </section>
  </div>`;
}
