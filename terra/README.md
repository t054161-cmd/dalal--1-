# TERRA — bilingual storefront for one hero product

> **From the earth, for the earth.**
> *terra* is the Latin word for earth, land and soil — the root behind *terrain*,
> *terracotta* and *terrestrial*. The name is the promise: a cup made from the
> earth's materials, designed to give back to the earth instead of taking from it.

A complete, runnable Next.js storefront for a single product: a reusable,
customizable, double-wall insulated mug. Arabic (RTL) and English (LTR)
throughout, with a real-time 3D mug designer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Node 20+ recommended. No environment variables are required to run the whole
site — see [The AI design agent](#the-ai-design-agent) for the one optional key.

---

## What's in it

| Route | What it is |
|---|---|
| `/` | Hero with the rotating 3D mug, trust strip, Cup of the Day, feature cards, temperature proof, live impact counter, community gallery, quiz, reviews, short FAQ, closing CTA |
| `/cup-of-the-day` | The daily curated design, countdown to local midnight, yesterday/tomorrow archive strip, email capture |
| `/customize` | The 4-step designer + the AI design agent, with the 3D viewer pinned alongside |
| `/shop` | 16 ready-made designs, filterable by occasion, colour family and size |
| `/impact` | Materials by weight, the product lifecycle, the numbers, take-back, personal impact calculator |
| `/gifts` | Bulk pricing tiers, logo upload, seed-paper wrapping, handwritten cards, quote request |
| `/about` | Our name, why we started, what we believe, how a TERRA is made, our promise |
| `/rewards` | The Soil Club: points, four tiers, earning rules, reward catalogue, activity log |
| `/faq` `/contact` `/policies` | Answers by category, the workshop's channels, shipping & returns |
| `/cart` `/checkout` | Guest checkout on one screen, with the 3D snapshot of every custom mug |
| `/track` | Ordered → In production → Printing → Shipped → Delivered, with the customer's own design at each stage |
| `/gallery` `/wishlist` `/takeback` `/subscribe` `/quiz` | Community voting, saved designs, the take-back programme, refill plans, the recommendation quiz |
| `/api/design-agent` | Turns a sentence into a design configuration (see below) |

---

## Editing the product without touching a component

Everything a non-developer needs is in `src/data/`. Every file is commented,
and every human-readable label is `{ en, ar }`.

| File | Holds |
|---|---|
| `src/data/product.ts` | Sizes, 12 body colours, 6 lids, 8 text colours, 6 curated palettes, 8 engraving fonts, placements, and **all prices** |
| `src/data/presets.ts` | The 32 Cup of the Day designs — id, bilingual name, colours, text, font, placement, one-line story, daily discount |
| `src/data/shop.ts` | The ready-made designs on `/shop`, with their occasion and colour-family filters |
| `src/data/accessories.ts` | Cup holder, carry chain, brush, spare lid — price, blurb, and which 3D part to draw |
| `src/data/loyalty.ts` | Points per dinar, one-off point awards, the four tiers, the reward catalogue |
| `src/data/content.ts` | Reviews, FAQ, community gallery, impact figures, bulk tiers, delivery regions, the demo order |

**All copy** lives in `src/i18n/translations.ts` — one file, `en` first, `ar`
type-checked against it, so a missing Arabic string is a build error rather than
a silent English fallback. No component contains a hardcoded sentence.

Adding a Cup of the Day design is a copy-paste:

```ts
{
  id: 'new-design',                      // never reuse an id
  name: { en: 'Low Tide', ar: 'الجزر' },
  bodyColorId: 'stone', lidColorId: 'cream',
  text: 'الجزر والمد', fontId: 'amiri',   // Arabic text → Arabic font
  textColorId: 'moss', placement: 'wrap',
  sizeId: '700', textSize: 'sm', handle: true,
  story: { en: '…', ar: '…' },
  discountPercent: 12,
}
```

---

## The 3D viewer

`src/components/mug3d/` — React Three Fiber + drei, **no model files**: the mug
is generated in code, so it stays a few kilobytes and every part is
recolourable.

- `geometry.ts` — lathe profiles for the body (filleted base, tapered wall,
  rolled rim, inner wall) and the lid, plus the handle, cork sleeve and chain
  specs, all derived from the millimetre dimensions in `product.ts`.
- `text-texture.ts` — the engraving is rasterised with the **browser's own** 2D
  text engine onto a canvas that wraps the body as a curved decal. That is what
  gives correct Arabic shaping and right-to-left order for free, and it
  guarantees the mug uses the exact same webfont the customer picked in the
  font list.
- `mug-canvas.tsx` — soft hemisphere light + one key light with shadows + a
  contact shadow; `dpr={[1, 2]}` caps device pixel ratio; orbit is clamped so
  the mug never turns upside down; `preserveDrawingBuffer` so Snapshot can read
  the framebuffer.
- `mug-viewer.tsx` — lazy-loads the whole 3D bundle (`next/dynamic`, no SSR) so
  it never blocks first paint, runs the auto-rotate state machine (stops on
  touch, resumes after 5 s of stillness, never starts under
  `prefers-reduced-motion`), shows the first-visit "drag to rotate" hint, and
  owns the Snapshot → PNG download.
- `mug-2d.tsx` — the accessibility and no-WebGL fallback: a hand-built SVG mug
  that takes the same design config and steps through 8 preset angles.

Only the `<canvas>` element gets `touch-action: none`, never a wrapper — so a
one-finger drag inside the viewer rotates the mug while a swipe anywhere else
scrolls the page.

---

## Cup of the Day: deterministic, not random

`src/lib/cup-of-the-day.ts` computes a day index from the visitor's **local**
calendar date against a fixed epoch, then `dayIndex % presets.length`. Everyone
who opens the site on the same calendar day sees the same cup, and it rolls over
exactly at their own local midnight — one interval drives both the countdown and
the swap, with a crossfade and no reload.

Because the answer depends on the client clock, the component renders a neutral
skeleton on the server and computes the day after mount, so there is no
hydration mismatch and no flash of the wrong cup.

---

## The AI design agent

`/customize` accepts a plain sentence in Arabic or English — *"a sage 500 ml
with my name in a handwritten font"* — and fills in the designer.

Two engines, one output shape (`src/lib/design-agent.ts`):

1. **Claude** via `POST /api/design-agent`, when the site is configured with an
   `ANTHROPIC_API_KEY`.
2. **Local**, otherwise: a deterministic bilingual matcher that understands
   colours, sizes, fonts, placement, handles, accessories and quoted text,
   entirely on the device.

The client tries the server first and silently falls back, so the feature is
never broken — only more or less clever. Either way the result passes through
`normalizePatch`, which drops anything that is not a real catalogue id, so a
model can never invent a colour or a font. The agent only ever changes design
options; it never places an order.

```bash
# optional
echo 'ANTHROPIC_API_KEY=sk-ant-…' >> .env.local
```

---

## Design system

`src/app/globals.css` holds the tokens; `tailwind.config.ts` maps them to
utilities. Every colour is a CSS custom property, so a re-brand — or dark mode —
is a one-file change.

| Token | Hex | Used for |
|---|---|---|
| `--clay` | `#B4654A` | primary accent, buttons |
| `--sage` | `#7C8B6B` | eco and impact elements |
| `--sand` | `#D9C7A7` | warm neutral surfaces |
| `--stone` | `#A89F91` | cool neutral |
| `--bark` | `#3E3229` | text |
| `--cream` | `#F6F1E7` | page background |
| `--moss` | `#4E5D43` | footer and deep sections |

Never pure white, never pure black. Dark mode stays in the family: deep bark and
moss grounds with sand and clay accents. Radii sit between 12 and 24 px, paper
and clay grain are inline SVG data URIs at very low opacity, and every animation
is disabled under `prefers-reduced-motion`.

Typography: IBM Plex Sans Arabic for Arabic, Manrope for Latin, plus six
engraving faces (Tajawal, Amiri, Reem Kufi, Playfair Display, Caveat, Space
Mono) exposed as CSS variables so the font picker, the 2D preview and the 3D
decal all render the same glyphs.

---

## State

One Zustand store (`src/lib/store.ts`), mirrored to `localStorage`: the
in-progress design (so the wizard survives a reload), the cart, the wishlist,
gallery votes, stock alerts, and Soil Club membership, points and redemptions.
The wizard step and the snapshot are deliberately **not** persisted, so a
returning visitor lands on step 1 with all of their choices intact.

`src/lib/share.ts` encodes a whole design into a readable query string
(`?s=500&b=clay&l=bamboo&t=Layla&f=caveat…`), which is what "Share design via
link" produces and what `/customize` decodes on mount.

---

## Accessibility & performance notes

- WCAG AA contrast on text, visible focus rings everywhere, 44 px minimum tap
  targets (`.tap`), `aria-label`s on every icon-only control, `aria-live` on the
  countdown, the contrast warning and the angle stepper.
- Full keyboard path through the designer, including rotate and zoom buttons for
  the 3D viewer so a pointer is never required.
- The engraving contrast guard (`src/lib/contrast.ts`) computes a real WCAG
  luminance ratio and offers a one-tap fix.
- The 3D bundle is code-split out of the shared chunk; images are lazy-loaded;
  the only runtime dependencies are React, Next, Zustand, Radix primitives,
  lucide icons and three.
- Per-page `<title>`, description, canonical and Open Graph metadata, plus a
  generated OG image (`src/app/opengraph-image.tsx`), `sitemap.xml` and
  `robots.txt`.

## Placeholder imagery

Photography is stubbed as SVG under `public/images/`, and **every filename
describes the shot that should replace it** — e.g.
`reviews/review-ash-700ml-gym-bag-with-chain.svg`. Alt text is written for the
real photograph, not the placeholder, so swapping in a JPEG needs no other
change than the file itself.
