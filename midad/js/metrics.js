/* ═══════════════════════════════════════════════════════════════════
   METRICS — everything the archive knows about itself.
   One place computes it; home, statistics, the card and the
   recommendations all read from here.
   ═══════════════════════════════════════════════════════════════════ */
import { db, pool, allMarginalia } from './data.js';

export const NOW = new Date();
export const THIS_YEAR = NOW.getFullYear();

export function totals() {
  const books = db().books;
  const pages = books.reduce((s, b) => s + (b.pages || 0), 0);
  const rated = books.filter((b) => b.rating > 0);
  return {
    books: books.length,
    pages,
    avg: rated.length ? rated.reduce((s, b) => s + b.rating, 0) / rated.length : 0,
    thisYear: books.filter((b) => new Date(b.finished).getFullYear() === THIS_YEAR).length,
    thisMonth: books.filter((b) => {
      const d = new Date(b.finished);
      return d.getFullYear() === THIS_YEAR && d.getMonth() === NOW.getMonth();
    }).length,
    notes: allMarginalia().length,
    genres: new Set(books.map((b) => b.genre)).size,
    authors: new Set(books.map((b) => b.authorAr)).size,
  };
}

export const years = () =>
  [...new Set(db().books.map((b) => new Date(b.finished).getFullYear()))].sort((a, b) => b - a);

/** 12 values for one year — books, or pages when `field` is 'pages'. */
export function byMonth(year, field = 'books') {
  const out = Array(12).fill(0);
  for (const b of db().books) {
    const d = new Date(b.finished);
    if (d.getFullYear() !== year) continue;
    out[d.getMonth()] += field === 'pages' ? (b.pages || 0) : 1;
  }
  return out;
}

export function byYear(field = 'books') {
  const m = new Map();
  for (const b of db().books) {
    const y = new Date(b.finished).getFullYear();
    m.set(y, (m.get(y) || 0) + (field === 'pages' ? (b.pages || 0) : 1));
  }
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([y, v]) => ({ label: String(y), value: v }));
}

export function counted(key) {
  const m = new Map();
  for (const b of db().books) {
    const k = typeof key === 'function' ? key(b) : b[key];
    if (!k) continue;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export const genreCounts = () => counted('genre');
export const authorCounts = () => counted((b) => b.id && b.authorAr);
export const favouriteGenre = () => genreCounts()[0]?.[0] || null;

export const topRated = (k = 5) =>
  [...db().books].sort((a, b) => b.rating - a.rating || b.pages - a.pages).slice(0, k);

export const longest = () =>
  [...db().books].sort((a, b) => (b.pages || 0) - (a.pages || 0))[0] || null;

export const recentlyFinished = (k = 6) =>
  [...db().books].sort((a, b) => new Date(b.finished) - new Date(a.finished)).slice(0, k);

/** Books grouped year → month → [books], newest first. Used by the Chronicles. */
export function chronicle() {
  const sorted = [...db().books].sort((a, b) => new Date(b.finished) - new Date(a.finished));
  const out = [];
  for (const b of sorted) {
    const d = new Date(b.finished);
    let y = out.find((x) => x.year === d.getFullYear());
    if (!y) out.push((y = { year: d.getFullYear(), months: [], count: 0 }));
    let m = y.months.find((x) => x.month === d.getMonth());
    if (!m) y.months.push((m = { month: d.getMonth(), books: [] }));
    m.books.push(b);
    y.count++;
  }
  return out;
}

/* ── achievements: earned from the archive, never awarded arbitrarily ── */
export function achievements() {
  const s = totals();
  const st = db();
  const literary = st.books.filter((b) => ['novel', 'poetry', 'world', 'heritage'].includes(b.genre)).length;
  const exchanges = st.requests.filter((r) => r.status === 'completed').length;
  const def = [
    { id: 'first',   key: 'ac.first',   have: s.books,     need: 1   },
    { id: 'hundred', key: 'ac.hundred', have: s.pages,     need: 100 },
    { id: 'month',   key: 'ac.month',   have: s.thisMonth, need: 1   },
    { id: 'avid',    key: 'ac.avid',    have: s.books,     need: 10  },
    { id: 'lover',   key: 'ac.lover',   have: literary,    need: 5   },
    { id: 'wide',    key: 'ac.wide',    have: s.genres,    need: 5   },
    { id: 'margin',  key: 'ac.margin',  have: s.notes,     need: 20  },
    { id: 'second',  key: 'ac.second',  have: exchanges,   need: 1   },
  ];
  return def.map((a) => ({ ...a, earned: a.have >= a.need, left: Math.max(0, a.need - a.have) }));
}

export function milestones() {
  const s = totals();
  const exchanges = db().requests.filter((r) => r.status === 'completed').length;
  return [
    { key: 'lc.m1', done: s.books >= 1 },
    { key: 'lc.m2', done: s.books >= 10 },
    { key: 'lc.m3', done: s.pages >= 1000 },
    { key: 'lc.m4', done: exchanges >= 1 },
  ];
}

/* ── recommendations: read out of the archive, not out of a hat ───── */
export function recommendations(k = 6) {
  const books = db().books;
  const have = new Set(books.map((b) => b.titleAr));
  const gc = new Map(genreCounts());
  /* authors the reader rated 4+ */
  const loved = new Set(books.filter((b) => b.rating >= 4).map((b) => b.authorAr));
  const readGenres = new Set(books.map((b) => b.genre));

  const scored = pool()
    .filter((p) => !have.has(p.titleAr))
    .map((p) => {
      let score = (gc.get(p.genre) || 0) * 2;
      let why = { key: 'rc.becauseGenre', arg: p.genre };
      if (loved.has(p.authorAr)) { score += 7; why = { key: 'rc.becauseAuthor', arg: p.authorAr }; }
      else if (!readGenres.has(p.genre)) { score += 1.5; why = { key: 'rc.becauseWide', arg: null }; }
      return { ...p, score, why };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k);
}
