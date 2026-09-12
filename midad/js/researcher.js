/* ═══════════════════════════════════════════════════════════════════
   باحث مِداد — MIDĀD RESEARCHER
   A literary research desk that reads the library rather than the web.

   Every answer is assembled from what the archive actually holds — the
   books, their genres, lengths and ratings, and the reader's own
   reviews, ideas and marginalia — plus the MIDĀD catalogue of books not
   yet read. It never invents biography or plot: if the archive does not
   know something, the answer says so. That is the whole design.
   ═══════════════════════════════════════════════════════════════════ */
import { db, pool, cloth, GENRES } from './data.js';
import { t, isAr, n, dec } from './i18n.js';

/* ── Arabic-aware normalisation, so «الفلسفة» matches «فلسفه» ──────── */
export function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')   /* harakat and tatweel */
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const has = (hay, words) => words.some((w) => hay.includes(norm(w)));

/* ── what the question is asking for ──────────────────────────────── */
const INTENT = [
  ['compare',   ['قارن', 'الفرق بين', 'ايهما', 'مقارنه', 'compare', ' vs ', 'versus', 'difference between']],
  ['similar',   ['مشابه', 'شبيه', 'يشبه', 'مثل كتاب', 'اذا اعجبني', 'similar', 'like this', 'if i liked', 'if i enjoyed', 'more like']],
  ['author',    ['المؤلف', 'الكاتب', 'من هو', 'من هي', 'عن الكاتب', 'author', 'who wrote', 'tell me about']],
  ['next',      ['ماذا اقرا بعد', 'التالي', 'بعد هذا', 'what next', 'read next', 'next book']],
  ['stats',     ['كم كتاب', 'كم صفحه', 'كم قرات', 'اكثر', 'احصائ', 'how many', 'most read', 'statistic']],
  ['recommend', ['اقترح', 'اقتراح', 'رشح', 'انصحني', 'اوصي', 'ماذا اقرا', 'recommend', 'suggest', 'what should i read', 'give me']],
];

const CONSTRAINT = {
  short:  ['قصير', 'صغير', 'خفيف', 'short', 'quick', 'brief', 'small'],
  long:   ['طويل', 'ضخم', 'كبير', 'long', 'thick', 'big'],
  best:   ['افضل', 'اعلى تقييم', 'اجمل', 'best', 'highest', 'favourite', 'favorite', 'top'],
  unread: ['جديد', 'لم اقرا', 'لم اقراه', 'new', 'not read', 'havent read', 'have not read'],
  ar:     ['عربي', 'بالعربيه', 'العربيه', 'arabic', 'in arabic'],
  en:     ['انجليزي', 'بالانجليزيه', 'الانجليزيه', 'english', 'in english'],
};

/* ── every title the researcher can recognise ─────────────────────── */
const corpus = () => [
  ...db().books.map((b) => ({ ...b, read: true })),
  ...pool().map((p) => ({ ...p, read: false, rating: 0, lang: 'ar' })),
];

const titlesOf = (b) => [b.titleAr, b.titleEn].filter(Boolean);
const authorsOf = (b) => [b.authorAr, b.authorEn].filter(Boolean);

/** Books explicitly named in the question, longest title first. */
function mentioned(q) {
  const hits = [];
  for (const b of corpus()) {
    for (const title of titlesOf(b)) {
      const nt = norm(title);
      if (nt.length > 3 && q.includes(nt)) { hits.push({ book: b, len: nt.length }); break; }
    }
  }
  return hits.sort((a, b) => b.len - a.len).map((h) => h.book);
}

function authorMentioned(q) {
  for (const b of corpus()) {
    for (const a of authorsOf(b)) {
      const na = norm(a);
      /* match on the family name too: «منيف» finds «عبد الرحمن منيف» */
      const parts = na.split(' ').filter((w) => w.length > 3);
      if ((na.length > 4 && q.includes(na)) || parts.some((w) => q.includes(w))) return a;
    }
  }
  return null;
}

const genreMentioned = (q) => GENRES.find((g) => has(q, [t(`g.${g}`), g])) || null;

/* ── the answers ──────────────────────────────────────────────────── */
const say = (ar, en) => (isAr() ? ar : en);

/** «في الفلسفة», not «في فلسفة» — genre labels need the article in Arabic. */
const theGenre = (g) => {
  const label = t(`g.${g}`);
  return isAr() && !label.startsWith('ال') ? `ال${label}` : label;
};

/** «كتابًا واحدًا» / «كتابين» / «٥ كتب» / «١٥ كتابًا» — not «1 كتابًا». */
function arBooks(c) {
  if (c === 1) return 'كتابًا واحدًا';
  if (c === 2) return 'كتابين';
  if (c >= 3 && c <= 10) return `${n(c)} كتب`;
  return `${n(c)} كتابًا`;
}

function applyConstraints(list, q) {
  let out = list;
  if (has(q, CONSTRAINT.short)) out = out.filter((b) => (b.pages || 0) <= 230);
  if (has(q, CONSTRAINT.long))  out = out.filter((b) => (b.pages || 0) >= 400);
  if (has(q, CONSTRAINT.ar))    out = out.filter((b) => (b.lang || 'ar') === 'ar');
  if (has(q, CONSTRAINT.en))    out = out.filter((b) => b.lang === 'en');
  const g = genreMentioned(q);
  if (g) out = out.filter((b) => b.genre === g);
  if (has(q, CONSTRAINT.best))  out = [...out].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return out;
}

function recommend(q) {
  const g = genreMentioned(q);
  const wantsUnread = has(q, CONSTRAINT.unread) || !has(q, CONSTRAINT.best);
  let relaxed = null;

  let list = applyConstraints(corpus().filter((b) => (wantsUnread ? !b.read : true)), q);
  if (!list.length) { list = applyConstraints(corpus(), q); relaxed = 'read'; }
  if (!list.length && g) {
    /* the genre is empty: keep the length and language, drop the shelf, and say so */
    const withoutGenre = (b) => {
      let ok = true;
      if (has(q, CONSTRAINT.short)) ok = ok && (b.pages || 0) <= 230;
      if (has(q, CONSTRAINT.long))  ok = ok && (b.pages || 0) >= 400;
      if (has(q, CONSTRAINT.ar))    ok = ok && (b.lang || 'ar') === 'ar';
      if (has(q, CONSTRAINT.en))    ok = ok && b.lang === 'en';
      return ok;
    };
    list = corpus().filter(withoutGenre);
    relaxed = 'genre';
  }
  if (!list.length) { list = corpus().filter((b) => !b.read); relaxed = 'all'; }
  /* prefer genres the reader returns to */
  const fav = new Map();
  for (const b of db().books) fav.set(b.genre, (fav.get(b.genre) || 0) + 1);
  list = [...list].sort((a, b) => (fav.get(b.genre) || 0) - (fav.get(a.genre) || 0));

  const picks = list.slice(0, 3);
  const gname = g ? theGenre(g) : null;
  const short = has(q, CONSTRAINT.short);

  let text = say(
    `${short ? 'كتب قصيرة' : 'اقتراحات'}${gname ? ` في ${gname}` : ''} من فهرس مِداد، مرتّبة حسب ما تعود إليه من تصنيفات:`,
    `${short ? 'Short books' : 'Suggestions'}${gname ? ` in ${gname}` : ''} from the MIDĀD catalogue, ordered by the genres you return to:`);
  if (relaxed === 'genre') {
    text = say(
      `لا شيء في ${gname} يطابق ما طلبته، فوسّعتُ البحث إلى بقية الرفوف مع إبقاء الشروط الأخرى:`,
      `Nothing on the ${gname} shelf matches that, so I widened the search to the other shelves and kept your other conditions:`);
  } else if (relaxed === 'read') {
    text = say(`لم يبقَ ما لم تقرأه بهذا الوصف، فهذه من مكتبتك نفسها:`,
               `There is nothing unread matching that, so these come from your own shelves:`);
  }
  return { text, books: picks };
}

function similar(q) {
  const [ref] = mentioned(q);
  if (!ref) {
    return {
      text: say('اذكر اسم الكتاب الذي تريد ما يشبهه، مثل: «ما يشبه مدن الملح؟»',
                'Name the book you want something like — for example: “What is similar to Cities of Salt?”'),
      books: [],
    };
  }
  const scored = corpus()
    .filter((b) => b.id !== ref.id)
    .map((b) => {
      let score = 0;
      if (b.genre === ref.genre) score += 3;
      if (b.authorAr === ref.authorAr) score += 4;
      if ((b.lang || 'ar') === (ref.lang || 'ar')) score += 0.5;
      if (Math.abs((b.pages || 0) - (ref.pages || 0)) < 120) score += 1;
      return { b, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.b);

  return {
    text: say(
      `الأقرب إلى «${ref.titleAr}» في مِداد — بالتصنيف (${t(`g.${ref.genre}`)}) وبالمؤلف وبالحجم:`,
      `Closest to “${ref.titleEn || ref.titleAr}” in MIDĀD — by genre (${t(`g.${ref.genre}`)}), author and length:`),
    books: scored,
  };
}

function aboutAuthor(q) {
  const author = authorMentioned(q);
  if (!author) {
    return {
      text: say('اذكر اسم المؤلف، مثل: «ماذا لديّ لغسان كنفاني؟»',
                'Name the author — for example: “What do I have by Ghassan Kanafani?”'),
      books: [],
    };
  }
  const mine = db().books.filter((b) => b.authorAr === author || b.authorEn === author);
  const inPool = pool().filter((p) => p.authorAr === author || p.authorEn === author);

  if (!mine.length) {
    return {
      text: say(
        `لم تقرأ شيئًا لـ${author} بعد. يعرف فهرس مِداد ${inPool.length} من كتبه.`,
        `You have not finished anything by ${author} yet. The MIDĀD catalogue lists ${inPool.length} of their books.`),
      books: inPool.slice(0, 3),
    };
  }
  const avg = mine.reduce((x, b) => x + b.rating, 0) / mine.length;
  const pages = mine.reduce((x, b) => x + (b.pages || 0), 0);
  const idea = mine.flatMap((b) => b.ideas || [])[0];

  return {
    text: say(
      `قرأتَ لـ${author} ${arBooks(mine.length)}، بمجموع ${n(pages)} صفحة ومتوسط تقييم ${dec(avg)}.`
        + (idea ? ` من أفكاره التي دوّنتها: «${idea.ar || idea.en}»` : ''),
      `You have finished ${n(mine.length)} book${mine.length === 1 ? '' : 's'} by ${author} — ${n(pages)} pages, averaging ${dec(avg)}.`
        + (idea ? ` One idea you recorded: “${idea.en || idea.ar}”` : '')),
    books: [...mine, ...inPool].slice(0, 4),
    note: say('هذا ما يعرفه أرشيفك عن المؤلف؛ مِداد لا يضيف سِيرًا من خارجه.',
              'This is what your archive knows about the author; MIDĀD adds no biography from outside it.'),
  };
}

function compare(q) {
  const hits = mentioned(q).filter((b) => b.read);
  if (hits.length < 2) {
    return {
      text: say('اذكر كتابين من مكتبتك للمقارنة، مثل: «قارن بين مدن الملح وموسم الهجرة إلى الشمال».',
                'Name two books from your library — for example: “Compare Cities of Salt and Season of Migration to the North”.'),
      books: hits,
    };
  }
  const [a, b] = hits;
  const longer = (a.pages || 0) >= (b.pages || 0) ? a : b;
  const higher = (a.rating || 0) >= (b.rating || 0) ? a : b;
  const sameGenre = a.genre === b.genre;

  return {
    text: say(
      `«${a.titleAr}» (${n(a.pages)} صفحة، ${dec(a.rating, 0)}/5) و«${b.titleAr}» (${n(b.pages)} صفحة، ${dec(b.rating, 0)}/5). `
        + `${sameGenre ? `كلاهما في ${t(`g.${a.genre}`)}` : `الأول في ${t(`g.${a.genre}`)} والثاني في ${t(`g.${b.genre}`)}`}. `
        + `الأطول «${longer.titleAr}»، والأعلى عندك «${higher.titleAr}».`,
      `“${a.titleEn || a.titleAr}” (${n(a.pages)} pages, ${dec(a.rating, 0)}/5) and “${b.titleEn || b.titleAr}” (${n(b.pages)} pages, ${dec(b.rating, 0)}/5). `
        + `${sameGenre ? `Both sit in ${t(`g.${a.genre}`)}` : `The first is ${t(`g.${a.genre}`)}, the second ${t(`g.${b.genre}`)}`}. `
        + `The longer is “${longer.titleEn || longer.titleAr}”; the one you rated higher is “${higher.titleEn || higher.titleAr}”.`),
    books: [a, b],
    quotes: [a, b].map((x) => ({ book: x, stayed: x.stayed })).filter((x) => x.stayed),
  };
}

function stats() {
  const books = db().books;
  const pages = books.reduce((s, b) => s + (b.pages || 0), 0);
  const byAuthor = new Map();
  for (const b of books) byAuthor.set(b.authorAr, (byAuthor.get(b.authorAr) || 0) + 1);
  const top = [...byAuthor.entries()].sort((a, b) => b[1] - a[1])[0];
  const avg = books.reduce((s, b) => s + b.rating, 0) / (books.length || 1);
  return {
    text: say(
      `في مكتبتك ${n(books.length)} كتابًا منتهيًا و${n(pages)} صفحة، بمتوسط تقييم ${dec(avg)}. أكثر من قرأتَ له: ${top ? top[0] : '—'}.`,
      `Your library holds ${n(books.length)} finished books and ${n(pages)} pages, averaging ${dec(avg)}. Most read author: ${top ? top[0] : '—'}.`),
    books: [],
    link: '#/stats',
  };
}

function next() {
  const recent = [...db().books].sort((a, b) => new Date(b.finished) - new Date(a.finished))[0];
  if (!recent) return recommend('');
  const pick = pool().filter((p) => p.genre === recent.genre).slice(0, 2);
  const other = pool().filter((p) => p.genre !== recent.genre).slice(0, 1);
  return {
    text: say(
      `آخر ما أنهيتَه «${recent.titleAr}» في ${t(`g.${recent.genre}`)}. تكملةً للمسار، أو خروجًا منه:`,
      `The last book you finished was “${recent.titleEn || recent.titleAr}” in ${t(`g.${recent.genre}`)}. To stay on that path, or to step off it:`),
    books: [...pick, ...other],
  };
}

/** The one entry point: a question in, a structured answer out. */
export function ask(question) {
  const q = norm(question);
  if (!q) return { text: say('اكتب سؤالك.', 'Ask me something.'), books: [] };

  const intent = INTENT.find(([, words]) => has(q, words))?.[0]
    /* a bare title reads as "something like this" */
    || (mentioned(q).length ? 'similar' : null)
    || (authorMentioned(q) ? 'author' : null)
    || 'recommend';

  switch (intent) {
    case 'compare':   return compare(q);
    case 'similar':   return similar(q);
    case 'author':    return aboutAuthor(q);
    case 'next':      return next();
    case 'stats':     return stats();
    default:          return recommend(q);
  }
}

export { cloth };
