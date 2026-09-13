/* ═══════════════════════════════════════════════════════════════════
   THE CLOUD SHELF — Supabase, spoken to directly.

   MIDĀD has no build step and no dependencies, so this talks to
   GoTrue (auth) and PostgREST (data) over plain fetch rather than
   pulling a client library from a CDN. It is deliberately small: sign
   up, sign in, refresh, sign out, and read/write the six tables.

   The working copy of the archive stays in the browser exactly as
   before; this layer mirrors it. If the network is down or the project
   is unreachable, the reader keeps reading and writing locally.
   ═══════════════════════════════════════════════════════════════════ */
import { SUPABASE_URL, SUPABASE_KEY, cloudConfigured } from './config.js';

const SESSION = 'midad.session.v1';

/* ── the session ──────────────────────────────────────────────────── */
export function session() {
  try { return JSON.parse(localStorage.getItem(SESSION) || 'null'); }
  catch { return null; }
}
function keepSession(s) {
  try {
    if (s) localStorage.setItem(SESSION, JSON.stringify(s));
    else localStorage.removeItem(SESSION);
  } catch { /* private mode */ }
}
export const cloudUser = () => session()?.user ?? null;
export const online = () => cloudConfigured() && Boolean(session()?.access_token);

/* ── transport ────────────────────────────────────────────────────── */
async function call(path, { method = 'GET', body, token, headers = {} } = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw Object.assign(new Error(data?.msg || data?.message || data?.error_description || `HTTP ${res.status}`), { status: res.status, data });
  return data;
}

/** An access token expires; trade the refresh token for a new one. */
async function refresh() {
  const s = session();
  if (!s?.refresh_token) return null;
  try {
    const next = await call('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', body: { refresh_token: s.refresh_token },
    });
    const merged = { ...s, ...next };
    keepSession(merged);
    return merged.access_token;
  } catch {
    keepSession(null);          /* the refresh token is spent; sign out quietly */
    return null;
  }
}

/** A PostgREST call that retries once with a fresh token. */
async function rest(path, opts = {}) {
  const s = session();
  if (!s?.access_token) throw new Error('not signed in');
  try {
    return await call(`/rest/v1${path}`, { ...opts, token: s.access_token });
  } catch (err) {
    if (err.status !== 401) throw err;
    const token = await refresh();
    if (!token) throw err;
    return call(`/rest/v1${path}`, { ...opts, token });
  }
}

const PREFER_UPSERT = { Prefer: 'resolution=merge-duplicates,return=representation' };
const PREFER_RETURN = { Prefer: 'return=representation' };

/* ═══════════════════════════ AUTH ═════════════════════════════════ */
export async function cloudSignUp({ email, password, nameAr, nameEn }) {
  const out = await call('/auth/v1/signup', {
    method: 'POST',
    body: { email, password, data: { name_ar: nameAr || '', name_en: nameEn || '' } },
  });
  /* projects with e-mail confirmation on return no session until confirmed */
  if (out?.access_token) keepSession(out);
  return out;
}

export async function cloudSignIn({ email, password }) {
  const out = await call('/auth/v1/token?grant_type=password', {
    method: 'POST', body: { email, password },
  });
  keepSession(out);
  return out;
}

export async function cloudSignOut() {
  const s = session();
  keepSession(null);          /* forget first: anything that re-renders now sees a guest */
  if (s?.access_token) {
    try { await call('/auth/v1/logout', { method: 'POST', token: s.access_token }); }
    catch { /* the session is already gone locally */ }
  }
}

/* ═══════════════════════ SHAPE TRANSLATION ════════════════════════
   The app thinks in whole books; the database thinks in a catalogue
   plus one reader's records. These two functions are the only place
   that knows both.
   ═════════════════════════════════════════════════════════════════ */
const one = (text) => (text ? { ar: text, en: '' } : { ar: '', en: '' });
const flat = (pair) => (pair ? (pair.ar || pair.en || '') : '');

/** catalogue row + this reader's record (+ notes) → the app's book */
export function toBook(row, record, notes = []) {
  return {
    id: row.book_id,
    titleAr: row.title_ar, titleEn: row.title_en || '',
    authorAr: row.author_ar, authorEn: row.author_en || '',
    lang: row.language || 'ar',
    genre: row.genre || 'novel',
    pages: row.pages || 0,
    cover: row.cover_image || null,
    rating: record?.rating || 0,
    finished: record?.date_finished || record?.created_at?.slice(0, 10) || '',
    added: record?.created_at?.slice(0, 10) || '',
    review: one(record?.review),
    whyRating: one(record?.why_rating),
    stayed: one(record?.what_stayed_with_me),
    ideas: Array.isArray(record?.main_ideas) ? record.main_ideas : [],
    quotes: notes.filter((nt) => nt.favorite_quote)
                 .map((nt) => ({ ...one(nt.favorite_quote), page: nt.page || 0 })),
    notes: notes.filter((nt) => nt.note && nt.kind === 'note')
                .map((nt) => one(nt.note)),
  };
}

const bookRow = (b, uid) => ({
  book_id: b.id,
  title_ar: b.titleAr || b.titleEn || '—',
  title_en: b.titleEn || null,
  author_ar: b.authorAr || b.authorEn || '—',
  author_en: b.authorEn || null,
  language: b.lang === 'en' ? 'en' : 'ar',
  genre: b.genre || 'novel',
  pages: b.pages || null,
  cover_image: b.cover || null,
  description: flat(b.review) || null,
  added_by: uid,
});

const recordRow = (b, uid) => ({
  user_id: uid,
  book_id: b.id,
  status: 'finished',
  date_finished: b.finished || null,
  rating: b.rating || null,
  review: flat(b.review) || null,
  why_rating: flat(b.whyRating) || null,
  main_ideas: b.ideas || [],
  what_stayed_with_me: flat(b.stayed) || null,
});

/* ═══════════════════════════ DATA ═════════════════════════════════ */

/** Everything this reader's archive holds, in the shape the app uses. */
export async function pullArchive() {
  const uid = cloudUser()?.id;
  if (!uid) throw new Error('not signed in');

  const [records, notes, listings, requests, profiles] = await Promise.all([
    rest('/reading_records?select=*,books(*)&order=date_finished.desc'),
    rest('/notes?select=*&order=created_at.desc'),
    rest('/book_exchange?select=*,books(*)&order=created_at.desc'),
    rest('/exchange_requests?select=*'),
    rest(`/users?select=*&user_id=eq.${uid}`),
  ]);

  const notesByBook = new Map();
  for (const nt of notes) {
    if (!nt.book_id) continue;
    if (!notesByBook.has(nt.book_id)) notesByBook.set(nt.book_id, []);
    notesByBook.get(nt.book_id).push(nt);
  }

  const books = records
    .filter((r) => r.books)
    .map((r) => toBook(r.books, r, notesByBook.get(r.book_id) || []));

  const free = notes.filter((nt) => !nt.book_id).map((nt) => ({
    id: nt.note_id, kind: nt.kind, book: null,
    text: one(nt.note || nt.favorite_quote), at: nt.created_at?.slice(0, 10),
  }));

  const profile = profiles[0];
  return {
    books,
    notes: free,
    listings: listings.filter((l) => l.books).map((l) => ({
      id: l.exchange_id,
      mine: l.user_id === uid,
      owner: { ar: profile?.name_ar || '', en: profile?.name_en || '' },
      titleAr: l.books.title_ar, titleEn: l.books.title_en || '',
      authorAr: l.books.author_ar, authorEn: l.books.author_en || '',
      genre: l.books.genre, bookLang: l.books.language,
      condition: l.condition, status: l.status,
      area: one(l.area), desc: l.description ? one(l.description) : null,
      wants: l.wants ? one(l.wants) : null,
      bookId: l.book_id,
    })),
    requests: requests.map((r) => ({
      id: r.request_id, listing: r.exchange_id,
      dir: r.requester_id === uid ? 'out' : 'in',
      status: r.status, at: r.created_at?.slice(0, 10),
    })),
    profile: profile ? {
      name: { ar: profile.name_ar, en: profile.name_en },
      member: profile.membership_number,
      since: profile.reading_since,
    } : null,
  };
}

/** Write one finished book: the catalogue row, then this reader's record. */
export async function pushBook(b) {
  const uid = cloudUser()?.id;
  if (!uid) return;
  await rest('/books', { method: 'POST', body: [bookRow(b, uid)], headers: PREFER_UPSERT });
  await rest('/reading_records?on_conflict=user_id,book_id', {
    method: 'POST', body: [recordRow(b, uid)], headers: PREFER_UPSERT,
  });
}

export async function removeBookRow(bookId) {
  const uid = cloudUser()?.id;
  if (!uid) return;
  await rest(`/reading_records?user_id=eq.${uid}&book_id=eq.${encodeURIComponent(bookId)}`, { method: 'DELETE' });
}

export async function pushNote({ kind, bookId, text, page }) {
  const uid = cloudUser()?.id;
  if (!uid) return;
  const value = flat(text);
  await rest('/notes', {
    method: 'POST', headers: PREFER_RETURN,
    body: [{
      user_id: uid, book_id: bookId || null, kind: kind || 'note',
      note: kind === 'quote' ? null : value,
      favorite_quote: kind === 'quote' ? value : null,
      page: page || null,
    }],
  });
}

export async function pushListing(l) {
  const uid = cloudUser()?.id;
  if (!uid) return null;
  await rest('/books', { method: 'POST', headers: PREFER_UPSERT, body: [bookRow({
    id: l.bookId || l.id, titleAr: l.titleAr, titleEn: l.titleEn,
    authorAr: l.authorAr, authorEn: l.authorEn, lang: l.bookLang, genre: l.genre,
  }, uid)] });
  const [row] = await rest('/book_exchange', {
    method: 'POST', headers: PREFER_RETURN,
    body: [{
      user_id: uid, book_id: l.bookId || l.id, condition: l.condition,
      status: l.status || 'available', description: flat(l.desc) || null,
      area: flat(l.area) || null, wants: flat(l.wants) || null,
    }],
  });
  return row?.exchange_id ?? null;
}

export async function pushRequest(exchangeId) {
  const [row] = await rest('/exchange_requests', {
    method: 'POST', headers: PREFER_RETURN,
    body: [{ exchange_id: exchangeId, requester_id: cloudUser()?.id, status: 'pending' }],
  });
  return row?.request_id ?? null;
}

export async function setRequestRow(requestId, status) {
  await rest(`/exchange_requests?request_id=eq.${requestId}`, {
    method: 'PATCH', body: { status },
  });
}

export async function setListingStatus(exchangeId, status) {
  await rest(`/book_exchange?exchange_id=eq.${exchangeId}`, {
    method: 'PATCH', body: { status },
  });
}

export async function pushProfile({ nameAr, nameEn, favoriteGenre }) {
  const uid = cloudUser()?.id;
  if (!uid) return;
  const patch = {};
  if (nameAr) patch.name_ar = nameAr;
  if (nameEn) patch.name_en = nameEn;
  if (favoriteGenre) patch.favorite_genre = favoriteGenre;
  if (!Object.keys(patch).length) return;
  await rest(`/users?user_id=eq.${uid}`, { method: 'PATCH', body: patch });
}

/** This reader's card as the database minted it: name, member number, year. */
export async function pullProfile() {
  const uid = cloudUser()?.id;
  if (!uid) return null;
  const [row] = await rest(`/users?select=*&user_id=eq.${uid}`);
  return row ? {
    name: { ar: row.name_ar, en: row.name_en },
    member: row.membership_number,
    since: row.reading_since,
  } : null;
}

/** Other readers, for the Community page (names only — never emails). */
export async function pullReaders() {
  return rest('/users?select=user_id,name_ar,name_en,membership_number,favorite_genre,reading_since');
}

/** True when this reader has nothing in the cloud yet. */
export async function cloudIsEmpty() {
  const rows = await rest('/reading_records?select=record_id&limit=1');
  return rows.length === 0;
}
