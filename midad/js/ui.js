/* ═══════════════════════════════════════════════════════════════════
   UI — markup primitives shared by every view.
   Views return HTML strings; interaction is delegated from app.js.
   ═══════════════════════════════════════════════════════════════════ */
import { t, pair, pick, other, isAr, n, dec, dateLong } from './i18n.js';
import { cloth } from './data.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

/* ── icons: 24-unit stroke paths, one visual language throughout ──── */
const P = {
  home:   'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z',
  shelf:  'M4 4h5v16H4zM11 4h4v16h-4zM17 6l3 .6-2.4 13.2-3-.6z',
  catalog:'M4 5h16v14H4zM4 10h16M9 5v14M6.5 14h1M6.5 17h1',
  chron:  'M12 7v5l3 2M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9z',
  margin: 'M5 3h11l3 3v15H5zM9 3v18M12 8h5M12 12h5M12 16h3',
  stats:  'M4 20V10M9.5 20V4M15 20v-8M20.5 20V7',
  swap:   'M7 8h12l-3-3M17 16H5l3 3',
  people: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3.3 2.7-5 6-5s6 1.7 6 5M17 11a3 3 0 1 0 0-6M16 15c3 .3 5 2 5 5',
  card:   'M3 6h18v12H3zM3 10h18M6.5 14h4M15 14h3',
  book:   'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z',
  page:   'M6 3h8l4 4v14H6zM14 3v4h4',
  star:   'M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16.2 16.2L21 21',
  quill:  'M4 20c8-2 12-6 16-16-2 6-6 9-12 10M4 20l4-4',
  seal:   'M12 3l2.4 2.1 3.1-.5 1 3 2.6 1.8-1.4 2.9.5 3.2-3.1.7-2.1 2.4-2.9-1.3-3 1.3-2-2.4-3.1-.7.5-3.2L2.6 9.4 5.2 7.6l1-3 3.1.5z',
  calendar:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  pages:  'M4 4h11l4 4v12H4zM8 12h7M8 16h7',
  clock:  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v4.5l3 1.5',
  tag:    'M4 12l8-8 8 8-8 8zM12 8v.01',
  heart:  'M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7C19 15.6 12 20 12 20z',
  check:  'M5 13l4 4L19 7',
  x:      'M6 6l12 12M18 6L6 18',
  plus:   'M12 5v14M5 12h14',
  arrow:  'M4 12h16M13 5l7 7-7 7',
  in:     'M20 12H4M11 5l-7 7 7 7',
  out:    'M4 12h16M13 5l7 7-7 7',
  pin:    'M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11zM12 8v4',
  lang:   'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  spark:  'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18',
  trash:  'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13',
  edit:   'M4 20h4L20 8l-4-4L4 16zM15 5l4 4',
  filter: 'M4 6h16M7 12h10M10 18h4',
  bookmark:'M6 3h12v18l-6-4.5L6 21z',
  users:  'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3.3 2.7-5 6-5s6 1.7 6 5',
  lock:   'M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3',
  eye:    'M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
};
export const icon = (name, cls = 'ic') =>
  `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><path d="${P[name] || P.book}"/></svg>`;
export const solid = (name, cls = '') =>
  `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><path d="${P[name]}" fill="currentColor" stroke="none"/></svg>`;

/* ── the bilingual label pair ─────────────────────────────────────── */
export function bi(key) {
  const p = pair(key);
  return `<span class="bi"><span class="bi__ar">${esc(p.ar)}</span><span class="bi__en">${esc(p.en)}</span></span>`;
}
export function biRaw(ar, en) {
  return `<span class="bi"><span class="bi__ar">${esc(ar)}</span><span class="bi__en">${esc(en)}</span></span>`;
}
/** A book's title in the reading language, with the other language beneath. */
export const bTitle = (b) => pick({ ar: b.titleAr, en: b.titleEn });
export const bTitle2 = (b) => other({ ar: b.titleAr, en: b.titleEn });
export const bAuthor = (b) => pick({ ar: b.authorAr, en: b.authorEn });
export const bAuthor2 = (b) => other({ ar: b.authorAr, en: b.authorEn });
export const genre = (g) => t(`g.${g}`);

/* ── star rating ──────────────────────────────────────────────────── */
export function stars(r, mod = '') {
  const full = Math.round(r || 0);
  let s = `<span class="stars ${mod}" role="img" aria-label="${esc(dec(r))} ${esc(t('w.of5'))}">`;
  for (let i = 1; i <= 5; i++) s += solid('star', i <= full ? '' : 'off');
  s += `<span class="stars__n">${dec(r, r % 1 ? 1 : 0)}</span></span>`;
  return s;
}

/* ── a book's binding colours ─────────────────────────────────────── */
export const coverVars = (b) => {
  const [c1, c2] = cloth(b.genre);
  return `--c1:${c1};--c2:${c2}`;
};

/* ── a book standing on the shelf ─────────────────────────────────── */
export function bookTile(b) {
  return `
  <button class="book" data-book="${esc(b.id)}" style="${coverVars(b)}"
          aria-label="${esc(bTitle(b))} — ${esc(bAuthor(b))}">
    <span class="book__holo holo" aria-hidden="true">
      <dl>
        <dt>${esc(t('w.rating'))}</dt><dd>${dec(b.rating, 0)}/5</dd>
        <dt>${esc(t('w.genre'))}</dt><dd>${esc(genre(b.genre))}</dd>
        <dt>${esc(t('w.pages'))}</dt><dd>${n(b.pages)}</dd>
        <dt>${esc(t('bk.finishedOn'))}</dt><dd>${esc(dateLong(b.finished))}</dd>
      </dl>
    </span>
    <span class="book__cover">
      <span class="book__t">${esc(bTitle(b))}</span>
      <span class="book__a">${esc(bAuthor(b))}</span>
    </span>
    <span class="book__glow"></span>
  </button>`;
}

/* ── a holographic search result ──────────────────────────────────── */
export function resultCard(b) {
  return `
  <button class="result holo holo--quiet" data-book="${esc(b.id)}" style="${coverVars(b)}">
    <span class="result__mini"></span>
    <span class="result__body">
      <span class="result__t">${esc(bTitle(b))}</span>
      <span class="result__a">${esc(bAuthor(b))}</span>
      <span class="result__meta">
        ${stars(b.rating, 'stars--holo')}
        <span class="chip chip--muted">${esc(genre(b.genre))}</span>
        <span class="chip chip--muted">${esc(new Date(b.finished).getFullYear())}</span>
      </span>
    </span>
  </button>`;
}

/* ── empty state ──────────────────────────────────────────────────── */
export const empty = (ic, tKey, dKey, action = '') => `
  <div class="empty woodcard">
    ${icon(ic)}
    <p class="empty__t">${esc(t(tKey))}</p>
    <p class="empty__d">${esc(t(dKey))}</p>
    ${action}
  </div>`;

/* ── page head ────────────────────────────────────────────────────── */
export const phead = (key, lede, extra = '') => {
  const p = pair(key);
  return `
  <header class="phead">
    <div class="phead__row">
      <div>
        <span class="phead__sub">${esc(isAr() ? p.en : p.ar)}</span>
        <h1 class="phead__title">${esc(isAr() ? p.ar : p.en)}</h1>
        ${lede ? `<p class="phead__lede">${esc(t(lede))}</p>` : ''}
      </div>
      ${extra ? `<div class="phead__aside">${extra}</div>` : ''}
    </div>
  </header>`;
};

export const shead = (key) => {
  const p = pair(key);
  return `<span class="shead__ar">${esc(p.ar)}</span><span class="shead__en">${esc(p.en)}</span>`;
};

export const rule = () => `<div class="rule"><span class="rule__dot"></span></div>`;

/* ── toast ────────────────────────────────────────────────────────── */
let toastTimer;
export function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
}

/* ── modal ────────────────────────────────────────────────────────── */
let lastFocus = null;
export function openModal(title, bodyHtml) {
  const m = document.getElementById('modal');
  lastFocus = document.activeElement;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  m.hidden = false;
  document.body.style.overflow = 'hidden';
  const first = m.querySelector('input,select,textarea,button:not([data-close])');
  (first || m.querySelector('[data-close]'))?.focus();
}
export function closeModal() {
  const m = document.getElementById('modal');
  if (m.hidden) return;
  m.hidden = true;
  document.getElementById('modalBody').innerHTML = '';
  document.body.style.overflow = '';
  lastFocus?.focus?.();
}
export const modalOpen = () => !document.getElementById('modal').hidden;

/* ── small formatting helpers used across views ──────────────────── */
export const yearOf = (iso) => new Date(iso).getFullYear();
export const monthOf = (iso) => new Date(iso).getMonth();
export { n, dec, dateLong };
