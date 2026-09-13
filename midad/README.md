# مِداد | MIDĀD

> «بعض الكتب تنتهي عند آخر صفحة، لكنها لا تنتهي فينا.»
> *“Some books end at the last page, but they do not end within us.”*

A personal digital literary archive for the books you have **finished** — and for
the notes, quotes, ratings and ideas each of them left behind.

The premise of the design: **the library itself is the interface.** A grand
antique hall — dark walnut shelving, a lit clerestory arch at the end of the
nave, brass lamps, a polished stone floor — with the digital layer of the
archive appearing inside it as translucent holographic panels.

**Arabic is the primary language and the default.** The whole interface,
including every label, empty state, form, chart axis and message, exists in
Arabic and English, and the document flips between RTL and LTR.

---

## Running it

Static files, no build step, no dependencies:

```bash
python3 -m http.server 8000     # then open http://localhost:8000/midad/
```

Everything the reader adds is stored in `localStorage` under `midad.archive.v1`,
seeded on first visit with a real finished reading journey (16 books, 2023–2026).

---

## The sections

| Route | Section | What it is |
|---|---|---|
| `#/` | **الرئيسية** · Home | The grand hall: the calligraphic mark, a floating holographic open book carrying the reading journey, statistics and a quote drawn from the margins |
| `#/library` | **مكتبتي** · My Library | The finished books as physical volumes on antique boards. Arrange by recently finished, rating, genre, author, reading year or length; hovering lifts a book from the shelf and projects its record |
| `#/book/:id` | **السجل الأرشيفي** · The Book Archive | One preserved record: review, *why I gave it this rating* beside the stars, main ideas, notes and *ماذا ترك فيّ؟ / What Stayed With Me?* on parchment; favourite quotes as illuminated holographic slabs |
| `#/catalog` | **الفهرس** · Catalog | Antique card-catalogue drawers in oak; pulling one — or typing — projects holographic results. Search by title, author, genre, rating or year |
| `#/chronicles` | **سجل الرحلة** · Reading Chronicles | The journey by year and month, as a record preserved in the library |
| `#/marginalia` | **الهوامش** · Marginalia | Every quote, note, idea and reflection in the archive. Notes and ideas stay on aged paper; quotes and *what stayed* are projected as light |
| `#/stats` | **الإحصائيات** · Statistics | Books, pages, average rating, monthly rhythm, favourite genres as rings, most-read authors, highest rated, reading activity — hand-drawn SVG, no chart library |
| `#/exchange` | **تبادل الكتب** · Book Exchange | *Give a book a second life.* List a book, discover others', request an exchange, accept or decline, mark it completed |
| `#/community` | **المجتمع** · Community | Readers, their favourite genres and what they recommend — kept about books, not about people |
| `#/card` | **بطاقة المكتبة** · Library Card | An aged membership card with engraved detail and a barcode, plus reading milestones and achievements as antique wax seals |
| `#/researcher` | **باحث مِداد** · MIDĀD Researcher | A research desk that answers from the archive: recommend, find similar, describe an author, compare two books, choose what to read next |
| `#/about` | **عن مِداد** · About MIDĀD | What the word means, and why the site begins where books end — set on a leaf of the library's own paper |

## باحث مِداد — how the researcher works, and what it will not do

The researcher is **local**. It runs in the browser, with no model API and no
network call, and it answers only from two sources: your own archive, and the
MIDĀD catalogue of books not yet read. Ask it for a short book on philosophy
and it filters the catalogue by genre and length; ask what resembles a book you
name and it scores the shelf by genre, author and length; ask about an author
and it reports what *your* archive holds — how many of their books you finished,
your average rating, an idea you recorded — and says plainly that it adds no
biography from outside. When a request matches nothing it relaxes one condition
and tells you which.

It therefore cannot invent a plot, a birth date or a literary judgement, which
is the point. To put a real model behind the same desk, replace `ask()` in
`js/researcher.js` with a call to your provider and keep the answer shape
(`{ text, books, note }`) — the view needs nothing else.

## The database

MIDĀD keeps its archive in Postgres on Supabase. Six tables, joined on
`user_id` and `book_id`:

| Table | Holds | Keys |
|---|---|---|
| `users` | a reader's profile: name (both languages), membership number, favourite genre, reading-since | `user_id` → `auth.users` |
| `books` | the shared catalogue: bilingual title and author, language, genre, pages, cover, description | `book_id` (text slug) |
| `reading_records` | one reader's relationship with one book: status, dates, rating, review, why that rating, main ideas, what stayed | `user_id`, `book_id`, unique together |
| `notes` | marginalia: a thought, a favourite quote, its page and kind | `user_id`, `book_id` (nullable) |
| `book_exchange` | a book offered a second life: condition, status, area, description, what the owner wants back | `user_id`, `book_id` |
| `exchange_requests` | who asked for which listing, and how it ended | `exchange_id`, `requester_id` |

### There is no password column, on purpose

The brief asked for `password` on `users`. It is deliberately absent.
Supabase Auth owns credentials in `auth.users`, bcrypt-hashed, in a schema
the public API key cannot read. A password column in a public table would be
readable by anyone holding the key that ships inside this website — which is
every visitor. Everything else the brief asked for is there.

The `email` column *is* there, and no API role holds a column grant on it: a
reader's own address comes from their auth session, and no query through the
public API can return anyone's. Three further columns exist beyond the brief,
because dropping them would have broken features the site already had —
`reading_records.why_rating` and `.main_ideas`, `notes.page`/`.kind`,
`book_exchange.area`/`.wants` — along with the sixth table, without which
*request → accept → decline → complete* could not work.

### Row Level Security is the whole security model

The site is a static page, so its API key is public by definition. What keeps
one reader's archive out of another's hands is the policies, not the key:
reading records and notes are readable and writable only by their owner;
listings are a public shelf that only the owner may edit; a request is visible
to exactly the two people in it; the catalogue is readable by everyone and
editable only by whoever added the row.

Proven, not assumed — with two throwaway readers and the policies live:

```
a reader sees their own records        1   PASS
another reader sees those records      0   PASS
another reader can edit them           0   PASS
a signed-out visitor sees records      0   PASS
a signed-out visitor browses listings  1   PASS
email is readable through the API    false PASS
```

`get_advisors` reports zero security findings.

### How the site uses it

`js/config.js` holds the project URL and the publishable key.
`js/cloud.js` talks to GoTrue and PostgREST over plain `fetch` — no CDN
dependency, in keeping with a site that has none. `js/sync.js` keeps the
browser copy as the working copy, so every view, filter and statistic still
reads from one fast synchronous source and none of the UI changed; it mirrors
each change upward and, on signing in, brings the shelves down. A first
sign-in with an empty cloud archive carries this device's library up instead.

**Empty the URL in `js/config.js` and MIDĀD runs entirely in the browser**, as
it did before. If the network fails mid-session the reader keeps reading and
writing locally and is told once; if it fails during registration the account
is made on this device and the reader is told *that*, rather than being left
to assume their shelves are in the cloud.

## Accounts

Creating an account registers a reader with Supabase Auth; the password is
hashed server-side and never touches this browser. Signing out returns you to
the guest shelf, whose library is kept on the device as it always was. With no
project configured — or none reachable — accounts fall back to the original
local profiles (salted SHA-256 in `localStorage`), and the interface says which
of the two you are looking at.

## Day and night

The switch relights the room rather than inverting the colours. The wood, brass
and paper are unchanged; what moves is the light source — from the lamps on the
piers to the clerestory at the end of the nave — along with the shade over the
reading plane and the holographic layer, which dims to dark-on-pale so it stays
readable against daylight. Both lightings were audited for WCAG AA.

Recommendations (**اقتراحات لك**) are computed from the archive itself — the
genres you return to, the authors you rated highly, and the gaps in what you
have read.

## Typography

| Role | Face |
|---|---|
| The mark **مِداد** and major Arabic headings | **Aref Ruqaa** — a Ruq'ah-inspired calligraphic face |
| Arabic literary body — reviews, quotes, marginalia | **Amiri** |
| Arabic interface — labels, forms, figures | **IBM Plex Sans Arabic** |
| English headings and figures | **Cormorant Garamond** |

## Palette

Books carry their own language (`lang`), separate from the interface language,
so an Arabic interface can hold English books and the shelf filters by either.

| Role | Hex (night) |
|---|---|
| Ground / walnut / deep wood | `#080605` · `#251710` · `#3a2415` |
| Antique gold / brass | `#c39a55` · `#e4c690` |
| Warm ivory / aged parchment | `#f5e9d6` · `#e6d5b4` |
| Dark forest green | `#1d2b23` |
| Holographic cyan | `#63c9ff` |

Cyan belongs to the digital layer only; gold to the literary one. A book's
binding cloth is chosen by its genre.

---

## How it is built

```
midad/
  index.html            the shell: hall, rail, view, modal
  css/
    tokens.css          palette, typography, bidi, primitives (.holo .parchment .woodcard)
    environment.css     the hall, the navigation rail, footer, modal, toast
    components.css      books, shelves, records, drawers, charts, cards, seals
  js/
    app.js              hash router, language, delegated interaction, forms, dust motes
    hall.js             the library drawn as one architectural SVG, lit two ways
    researcher.js       the research desk's reasoning: intent, entities, answers
    account.js          the desk: Supabase Auth when configured, local profiles otherwise
    config.js           project URL and publishable key (empty URL = browser-only)
    cloud.js            GoTrue + PostgREST over fetch; the app shape ⇄ the schema
    sync.js             write-through mirror, and hydrate-on-sign-in
    i18n.js             every string in both languages; RTL/LTR; dates and figures
    data.js             the archive, the seed, localStorage persistence
    metrics.js          totals, chronicle, genres, achievements, recommendations
    charts.js           SVG columns, rings, ranked bars, activity grid
    ui.js               shared markup: bilingual pairs, book tiles, stars, modal, toast
    views/*.js          one module per section, returning markup
```

Views return HTML strings; interaction is delegated from `app.js`, so a state
change re-renders the current view and nothing needs to be wired up twice.

### Notes on the details

- **Bidi.** Arabic and Latin sit on the same line and in stacked pairs
  throughout. Mixed-language text uses `unicode-bidi: plaintext`, so each line
  resolves its own paragraph direction — an English sentence keeps its full stop
  on the right even inside an RTL page — while alignment still follows the
  chosen language.
- **Logical properties** everywhere (`inset-inline-start`, `margin-inline`,
  `border-start-start-radius`), so the whole interface mirrors from one `dir`
  switch — including a book's cloth spine and gilt frame.
- **The hall** is a single SVG: shelf spines are generated from a seeded PRNG
  into three `<pattern>` tiles (one per depth), so a wall of thousands of books
  costs a handful of nodes and stays crisp at any size.
- **Restraint.** Lamps breathe, the hologram floats, books ease forward off the
  shelf, panels fade in. Everything obeys `prefers-reduced-motion`, and the
  dust motes stop drawing when the tab is hidden.
- **Legibility over atmosphere.** A pool of shade sits over the reading plane so
  type never competes with the shelving; every sampled text/background pair
  meets WCAG AA.
- **Responsive.** Desktop keeps the grand hall and the fixed rail; below 1040px
  the rail becomes a drawer and the arcade crops to the nave. No route scrolls
  horizontally at 390px.
