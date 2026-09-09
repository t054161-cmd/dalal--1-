# FOCUS SPACE — مرفأ روّاد الإنجاز

A workspace discovery platform for people who need the right room to finish
something: **offices** for studying and deep work, **halls** for companies,
courses, meetings and workshops, and **cafés** for quiet, productive sessions.

> We don't just help you find a place; we help you find the space that fits
> your achievement.

Open `focus-space/index.html` in a browser, or serve the repository root with
any static server. There is no build step, no framework and no bundler — the
whole product is HTML, CSS and ES modules, with three.js vendored one level up.

---

## The 3D

The site has one three.js world (`js/world.js`): a single long interior that
passes through modern offices and study desks, a training hall with a raked
seating rake and a screen, and a quiet café with a counter, pendant lamps and
a banquette. Everything in it is procedural — no models, no textures on disk.

Two things live inside that world:

**The hero is a film, not a video file.** `js/hero3d.js` runs a
cinematographer's shot list — eight dolly, truck and crane set-ups — and cuts
between them with a brief exposure dip, over drifting dust and daylight
shafts. It reads as cinematic footage of offices, study spaces, training rooms
and cafés, but it streams nothing, starts on the first frame, and reacts to the
pointer with a slow parallax.

**The photography is rendered, not downloaded.** `js/studio.js` keeps an
offscreen renderer, places a camera at a seeded set-up in the right zone of the
same world, renders one frame, then grades it on a 2D canvas — warm curve,
vignette and sensor grain — and hands back a JPEG data URL. Every space keeps
the same photograph for the life of the session, and each card upgrades from a
soft placeholder to its photograph the moment it scrolls into view.

Both degrade cleanly. Without WebGL the hero keeps a drawn still and every card
falls back to the SVG interiors in `js/imagery.js`; with reduced motion the
camera holds a single frame and every reveal renders finished.

**Real photographs replace the renders wherever they exist.** `js/data.js`
carries a `PHOTOS` map keyed by space id and a `CATEGORY_PHOTOS` map for the
three category covers; fill an entry with a path or a URL and that space uses
the photograph on its card, its detail header and in recently-viewed, while
every space still waiting for one keeps its render. A photo that fails to load
falls back to the render rather than leaving a broken image. See
`assets/photos/README.md` for sizes, naming and permissions.

---

## What is in the interface

| Screen | What it does |
|--------|--------------|
| **Home** | Cinematic hero, the idea, the three categories, a rated shortlist, how it works |
| **Spaces** | All 21 spaces with the full filter set |
| **Category** | `01 Offices`, `02 Halls`, `03 Cafés` — each with its own header and what it suits |
| **Space** | Photograph, live status, rating, capacity, hours, services, offers, map link, similar spaces |
| **Profile** | Picture, name, favorites, recently viewed, language settings, account settings |
| **About** | The story and the three values |
| **Contact Us** | *Let's Connect* — clickable email and phone, and a validated message form |

**Filtering** covers nearest, highest rated, available now, number of people,
space type, services and current offers, plus free-text search across names,
districts and services.

**Availability is real.** `Available / Busy / Closed` is computed from each
space's opening hours, its busy window and the visitor's own clock, so a café
that shuts at 20:00 reads *Closed* at nine in the evening. Statuses on screen
refresh every five minutes.

**Location is only used after permission is granted.** Distances stay hidden
until the visitor taps *Use my location*; the coordinates live in memory and
are never written to storage. On a later visit the position is re-read only
when the browser already reports a granted permission, so nobody is prompted
on load.

**Favorites, recently viewed and the profile** persist in `localStorage` under
the `focus-space:v1` namespace, and *Clear saved data* removes all of it.

---

## Arabic and English

The whole product is bilingual and bidirectional. The switcher in the header,
in the footer and in profile settings swaps every string, flips `dir` on the
document, and mirrors the layout — the header logo moves to the right and the
profile to the left, filters and cards reverse, and arrows turn around. Space
names, districts, descriptions and offers all have Arabic copy of their own;
numbers render in Arabic-Indic digits inside Arabic. The choice is remembered,
and a browser set to Arabic starts in Arabic.

## Visual identity

| Role | Tone | Hex |
|------|------|-----|
| Dominant | Sage | `#2E3A31` · `#4C6152` · `#7C9382` · `#A9BDAE` · `#DCE5DB` |
| Supporting | Sand | `#D8C6AE` · `#B79E7E` |
| Supporting | Cloud | `#EDF0EE` · `#CFD6D3` |
| Supporting | Vanilla | `#F5EFE1` · `#EADFC6` |

Type is **Playlist Bold** for `FOCUS SPACE` and the main headings, **Audrey**
for secondary headings and labels, and a Ruq'ah-inspired face for
«مرفأ روّاد الإنجاز». Drop `Playlist-Script.woff2`, `Audrey-Normal.woff2` and
`Audrey-Medium.woff2` into `assets/fonts/` and they are picked up
automatically; until then the stack falls back to Cormorant Garamond, Jost and
**Aref Ruqaa** — a Ruq'ah-derived Arabic face — from Google Fonts, so the
character of the brand survives either way.

## Files

```
focus-space/
├── index.html          page shell: header, router mount, footer
├── css/focus.css       the whole design system
└── js/
    ├── config.js       brand constants and the palette
    ├── i18n.js         every interface string, in both languages
    ├── data.js         categories, services, the 21 spaces, availability, distance
    ├── store.js        language, favorites, recents, profile, location
    ├── world.js        the shared three.js interior
    ├── hero3d.js       the cinematic hero and its shot list
    ├── studio.js       offscreen renderer that photographs the spaces
    ├── imagery.js      drawn SVG interiors — placeholders and no-WebGL fallback
    ├── motion.js       scroll reveal, parallax, card tilt, count-ups, page veil
    ├── views.js        every screen
    └── app.js          router, chrome, favorites, language, toasts
```

The spaces in `js/data.js` are illustrative examples for a launch-ready
demonstration, not real listings.
