# TERRA — a cinematic, bilingual storefront for one designed object

> **Designed for everyday rituals.**
> A tall, slim reusable tumbler: recycled stainless steel, a leak-resistant lid,
> a straw you keep. Four tones taken from the ground.

Next.js (App Router) + TypeScript + Tailwind, with the cup modelled and printed
in code. Arabic (RTL) and English (LTR) throughout.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Node 20+. Nothing is required to run the whole site — see
[Optional configuration](#optional-configuration) for the two switches.

---

## The journey

Five destinations, in the order the brief asks for:

| Route | What happens |
|---|---|
| `/` | Enter TERRA → the idea → the object (turns as you scroll) → **explore the cup** (exploded view) → the four tones → design yours → material · craft · reuse · impact → the ritual → the box → the community |
| `/shop` | The product itself: 3D viewer, tones, quantity, add to cart, sticky mobile bar, specification and care |
| `/customize` | **Design your TERRA** — describe the cup in a sentence, then adjust anything by hand |
| `/story` | Our story: the name, why we started, the packaging, the promise |
| `/cart` · `/checkout` | Guest checkout on one screen |

---

## The cup is generated, not loaded

`src/components/three/` — React Three Fiber, **no model files**. The silhouette
is held to the product reference: straight sides, a softly rounded base, a flat
lid a shade wider than the body, a clean seam between them, one straight straw
from the centre of the lid. No handle, no taper.

- **`geometry.ts`** — lathe profiles for the body and lid, plus the ring, the
  steel inner layer and the straw, all derived from the real dimensions
  (205 × 72 mm). `OBJECT_HEIGHT` is the single source of truth for framing, so
  the straw is never cropped. Corner vertices are duplicated deliberately: it
  gives the lathe a hard edge instead of averaging the lid into a dome.
- **`tumbler.tsx`** — the mesh. Parts ease between `CLOSED` and `EXPLODED`
  positions each frame, so **EXPLORE THE CUP** separates straw, lid, ring and
  body straight up with even spacing. Every part carries a label on hover, and
  all of them are labelled while exploded.
- **`scene.tsx`** — a studio built from light shapes. The environment map is
  rendered once in-scene (`Environment` + `Lightformer`), so the matte body gets
  a real sheen and the steel inner layer has something to reflect — with no HDRI
  fetched over the network. `Framing` eases the camera back and up when the cup
  explodes, because a Canvas only applies its `camera` prop on mount.
- **`viewer.tsx`** — mounts the 3D bundle lazily (`next/dynamic`, no SSR) and
  **only while its section is near the viewport**, so a page with four viewers
  never holds four live WebGL contexts. Drag to turn, scroll to zoom,
  double-click to reset, a first-visit hint, and buttons for turn/zoom/snapshot
  so a pointer is never required.
- **`tumbler-2d.tsx`** — the fallback for no-WebGL and reduced-motion: a
  hand-built SVG cup that takes the same config and steps through 8 angles. It
  is also what the cart, checkout and community cards use.

Only the `<canvas>` gets `touch-action: none`, never an ancestor — so a drag
inside the viewer turns the cup while a swipe anywhere else scrolls the page.

## What gets printed on the body

`src/lib/cup-texture.ts` composites one canvas that wraps the body: the pattern,
the customer's mark, a symbol, and the TERRA wordmark low on the front.

Two details worth knowing:

- The type is drawn with the **browser's own** text engine, which is what gives
  correct Arabic shaping and right-to-left order for free, and means the cup
  uses the same webfont the picker shows.
- The pattern is **held back from the type**: a soft ellipse of clear space is
  erased behind whatever is about to be printed, the way a real print layout
  would. Both the wordmark and the mark stay legible on any pattern.

`src/lib/patterns.ts` draws all six patterns in code from a fixed seed —
weightless, recolourable, seamless around the cup, and identical every render.

## The design agent

`/customize` takes a sentence in either language — *"a forest green cup with a
linen straw, an olive leaf pattern and my initials O.K"* — and builds it.

1. **Claude** via `POST /api/design-agent`, when `ANTHROPIC_API_KEY` is set.
2. **On-device** otherwise: a deterministic bilingual matcher that splits the
   sentence into clauses, so "a forest cup with a linen straw" cannot leak the
   straw's tone onto the body.

The browser tries the server first and falls back silently. Either way the
result passes `normalize`, which drops anything that is not a real catalogue
value **and re-checks print contrast**, so neither a model nor a typo can
produce an unreadable cup. The agent only ever changes the cup; it never orders.

## Editing the product

Everything a non-developer needs is in `src/data/`, commented:

| File | Holds |
|---|---|
| `product.ts` | Price, dimensions, the four colourways, the tone palette, the five labelled parts, patterns, letterforms, symbols |
| `content.ts` | The seven ritual moments, community designs, reviews |

**All copy** lives in `src/i18n/translations.ts` — `en` is the reference shape
and `ar` is type-checked against it, so a missing Arabic line is a build error
rather than a silent English fallback. No component contains a sentence.

---

## Typography

The brief specifies **Playlist** (display) and **Audrey** (everything else).
Both are commercial licences, so they are not vendored here — but every rule
names them first:

```css
font-family: Playlist, var(--font-display), sans-serif;
```

To switch to the real faces: drop the licensed `woff2` files into
`public/fonts/`, add one `@font-face` block per family (named exactly `Playlist`
and `Audrey`) at the top of `src/app/globals.css`, and nothing else changes.
Until then three faces stand in, chosen against the reference sheet: **Jost**
(light geometric sans — the wordmark and UI), **Cormorant Garamond** (editorial
passages) and **IBM Plex Sans Arabic**.

## The hero

`src/components/hero/leaf-canopy.tsx` is sunlight through leaves, built from
three depth layers of SVG leaves on their own sway timings, a drifting shaft of
light, a calm field behind the title, and grain. Leaf placement comes from a
fixed seed at module scope, so the server and the browser draw the same canopy.

Real footage is opt-in: put an mp4 at `public/media/hero-leaves.mp4` and set
`NEXT_PUBLIC_HERO_VIDEO=1`. Without that flag no `<video>` is rendered at all,
so there is no 404 and no console noise.

## Design system

`src/app/globals.css` holds the tokens; `tailwind.config.ts` maps them to
utilities. Every colour is a custom property, so dark mode and any re-brand are
a one-file change.

| Token | Hex | Role |
|---|---|---|
| `--linen` | `#EDE7DC` | page ground, light type on dark |
| `--sage` | `#A9B29F` | the signature tone |
| `--smoke` | `#5E6B58` | smoked green, deep accents |
| `--sandi` | `#D8C3BA` | blush accent |
| `--forest` | `#2B342C` | the deep tone |
| `--clay` | `#C8BEAF` | putty neutral |

Never pure white, never pure black. Dark mode is a deep smoked green ground with
linen type and sandi accents — not a black version of the site. Buttons are
hairline-bordered with a fill that sweeps up on hover; links draw their own
underline; controls lean toward the pointer (`Magnetic`); sections rise once as
they enter view (`Reveal`); the product turns with the scroll
(`useScrollProgress`). Every one of those is disabled under
`prefers-reduced-motion`.

## Accessibility & performance

- WCAG AA contrast on text, visible focus rings, 44 px minimum tap targets,
  `aria-label`s on every icon-only control, `aria-live` on the impact counter,
  the agent's result and the angle stepper.
- The whole designer is reachable by keyboard, including turn and zoom.
- The 3D bundle is code-split out of the shared chunk and mounted per section;
  images are lazy; `dpr` is capped at 2.
- Per-page metadata, `sitemap.xml` and `robots.txt`.

## Optional configuration

```bash
cp .env.example .env.local
```

| Variable | Effect |
|---|---|
| `ANTHROPIC_API_KEY` | Enables the Claude-powered designer. Without it the on-device matcher runs. |
| `NEXT_PUBLIC_HERO_VIDEO` | Set to `1` once real hero footage exists. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata and the sitemap. |

## Placeholder imagery

Photography is stubbed as SVG under `public/images/`, and **every filename
describes the shot that should replace it** — e.g.
`ritual/ritual-sage-walking-seafront-hand.svg`. Alt text is written for the real
photograph, so swapping in a JPEG needs no other change.
