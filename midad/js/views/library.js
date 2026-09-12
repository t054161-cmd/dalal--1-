/* ═══════════ MY LIBRARY — the immersive shelf ═══════════ */
import { t, n, isAr } from '../i18n.js';
import { esc, icon, bookTile, phead, empty, genre, bAuthor } from '../ui.js';
import { db, GENRES } from '../data.js';

export const state = { sort: 'recent', genre: 'all', lang: 'all' };

const SORTS = [
  ['recent', 'lib.sort.recent'], ['rating', 'lib.sort.rating'], ['year', 'lib.sort.year'],
  ['genre', 'lib.sort.genre'], ['author', 'lib.sort.author'], ['pages', 'lib.sort.pages'],
];

/** Books arranged into labelled shelves according to the chosen order. */
function shelves(books) {
  const byDate = (a, b) => new Date(b.finished) - new Date(a.finished);
  switch (state.sort) {
    case 'rating':
      return [{ label: null, books: [...books].sort((a, b) => b.rating - a.rating || byDate(a, b)) }];
    case 'pages':
      return [{ label: null, books: [...books].sort((a, b) => (b.pages || 0) - (a.pages || 0)) }];
    case 'genre': {
      const groups = new Map();
      for (const b of [...books].sort(byDate)) {
        if (!groups.has(b.genre)) groups.set(b.genre, []);
        groups.get(b.genre).push(b);
      }
      return [...groups.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .map(([g, bs]) => ({ label: genre(g), sub: `${n(bs.length)} ${t('w.books')}`, books: bs }));
    }
    case 'author': {
      const groups = new Map();
      for (const b of [...books].sort(byDate)) {
        const k = bAuthor(b);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(b);
      }
      return [...groups.entries()]
        .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], isAr() ? 'ar' : 'en'))
        .map(([a, bs]) => ({ label: a, sub: `${n(bs.length)} ${t('w.books')}`, books: bs }));
    }
    case 'year': {
      const groups = new Map();
      for (const b of [...books].sort(byDate)) {
        const y = new Date(b.finished).getFullYear();
        if (!groups.has(y)) groups.set(y, []);
        groups.get(y).push(b);
      }
      return [...groups.entries()].sort((a, b) => b[0] - a[0])
        .map(([y, bs]) => ({ label: String(y), sub: `${n(bs.length)} ${t('w.books')}`, books: bs }));
    }
    default: {
      /* recently finished: one long run, broken onto boards of six */
      const sorted = [...books].sort(byDate);
      const out = [];
      for (let i = 0; i < sorted.length; i += 6) out.push({ label: null, books: sorted.slice(i, i + 6) });
      return out;
    }
  }
}

export default function library() {
  const all = db().books;
  const books = all
    .filter((b) => state.genre === 'all' || b.genre === state.genre)
    .filter((b) => state.lang === 'all' || (b.lang || 'ar') === state.lang);
  const used = GENRES.filter((g) => all.some((b) => b.genre === g));

  const body = !all.length
    ? empty('shelf', 'lib.empty', 'lib.emptyD',
        `<button class="btn btn--brass" data-action="add-book">${icon('plus')}<span>${esc(t('nav.addBook'))}</span></button>`)
    : !books.length
      ? empty('filter', 'lib.noMatch', 'lib.noMatchD',
          `<button class="btn" data-action="lib-reset">${esc(t('w.all'))}</button>`)
      : `<div class="shelfwrap">${shelves(books).map((sh) => `
          <div class="shelf">
            ${sh.label ? `
              <div class="shead" style="margin-bottom:.9rem">
                <h2><span class="shead__ar" style="font-size:1.25rem">${esc(sh.label)}</span></h2>
                <span class="count"><b>${esc(sh.sub || '')}</b></span>
              </div>` : ''}
            <div class="shelf__books">${sh.books.map(bookTile).join('')}</div>
            <div class="shelf__board"></div>
          </div>`).join('')}</div>`;

  return `
  <div class="wrap">
    ${phead('nav.library', 'lib.lede',
      `<button class="btn btn--brass" data-action="add-book">${icon('plus')}<span>${esc(t('nav.addBook'))}</span></button>`)}

    <div class="toolbar holo holo--quiet" role="group" aria-label="${esc(t('lib.sort'))}">
      <div class="toolbar__group">
        <span class="toolbar__lab">${icon('filter')} ${esc(t('lib.sort'))}</span>
        <select class="select" data-action="lib-sort" aria-label="${esc(t('lib.sort'))}">
          ${SORTS.map(([v, k]) => `<option value="${v}"${state.sort === v ? ' selected' : ''}>${esc(t(k))}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__group">
        <span class="toolbar__lab">${esc(t('w.bookLang'))}</span>
        <div class="seg seg--sm" role="group" aria-label="${esc(t('w.bookLang'))}">
          ${[['all', t('w.allBooks')], ['ar', t('w.arabic')], ['en', t('w.english')]].map(([v, lab]) => `
            <button data-action="lib-lang" data-lang="${v}" aria-pressed="${state.lang === v}">${esc(lab)}</button>`).join('')}
        </div>
      </div>
      <div class="toolbar__group">
        <span class="toolbar__lab">${esc(t('w.genre'))}</span>
        <select class="select" data-action="lib-genre" aria-label="${esc(t('w.genre'))}">
          <option value="all"${state.genre === 'all' ? ' selected' : ''}>${esc(t('w.all'))}</option>
          ${used.map((g) => `<option value="${g}"${state.genre === g ? ' selected' : ''}>${esc(genre(g))}</option>`).join('')}
        </select>
      </div>
      <span class="toolbar__spacer"></span>
      <span class="count"><b>${n(books.length)}</b> ${esc(t('lib.count'))}</span>
    </div>

    ${body}
  </div>`;
}
