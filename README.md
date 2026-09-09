# Dalal Al-Mutairi — 3D Engineering Portfolio

An interactive, single-continuous-world 3D portfolio for **Dalal Al-Mutairi**,
Civil Engineering student at Kuwait University.

> *Every foundation begins its construction here.*

The whole site is one 3D scene. Scrolling flies a single camera between three
stations while the structural objects in the scene transform: plywood formwork
hinges open, a steel truss assembles member by member, technical drawings slide
in and fold away, and the truss stands up as a column for the closing page.

---

## The three pages

| # | Page | Contents |
|---|------|----------|
| 01 | **Home** | Raymarched concrete pour, `Civil Engineering × Structural Engineering × AI`, **Explore My Work** |
| 02 | **Projects & Interests** | STAAD · Focus Space · Future Engineering & AI · Achievements · Interests · the **Coded** section |
| 03 | **Contact** | Phone, email + a working **Email Me** button, LinkedIn, GitHub, CV, and the closing line |

`Dalal Al-Mutairi` sits top-centre on every page, in the bold display face, in
Soft Dune.

## Palette

| Role | Colour | Hex |
|------|--------|-----|
| Main background | Umber | `#4a3226` (with `#2b1c14` / `#1a100b` for depth) |
| Main titles | Soft Dune | `#e3c9a0` |
| Secondary titles & text | Vanilla | `#f3e5ab` |
| Accents | Warm umber / steel / rust | `#8a5f3e` · `#b8bec6` · `#b5714a` |

## The concrete pour

The landing background is not a video or a particle trick — it is a raymarched
signed-distance field rendered every frame in `js/concrete.js`, sharing the
*same camera matrix* as the rest of the 3D scene, so the concrete and the steel
live in one world.

What makes it read as real concrete:

- **Mass continuity.** The falling jet thins with `r ∝ √(v₀/v)` where
  `v = √(v₀² + 2g·h)` — the stream genuinely narrows as it accelerates.
- **Varicose necking.** Two travelling sine modes plus low-frequency noise give
  the beaded bulges a viscous jet actually develops.
- **Surface tension.** The jet merges into the slab with a smooth-minimum, so
  there is a real fillet at the impact instead of an intersection.
- **The slab is a height field** with a lobed radius (so the spreading front is
  irregular and always feathers to zero height at its own edge), a rounded rim,
  an impact mound, a raised crown ring, ripples radiating from the impact and
  slow viscous surface motion.
- **Lighting.** Warm key + cool sky fill + warm ground bounce, soft raymarched
  shadows, SDF ambient occlusion, a wet-sheen highlight that is sharp only where
  the material is still moving, and fine bump mapping that appears only where the
  concrete has set.
- **The ground is plywood formwork** — 1220 × 2440 sheets with visible seams,
  plank grain, concrete splatter and a damp sheen near the fresh pour.
- The pour point drifts and follows the pointer, so the concrete reacts to the
  visitor.

## Structural elements

`js/structures.js` builds everything else procedurally — no external assets:

- **Rolled steel I-sections** extruded from a real H profile, with bolted end
  plates.
- **A rebar cage** — longitudinal bars and square stirrups.
- **Plywood formwork** with soldier walings and tie rods.
- **A Warren truss** with gusset nodes, which assembles itself on scroll.
- **Concrete columns** with starter bars projecting from the top.
- **Setting-out lines**, grid references and vertical structural traces.
- **Technical drawings** drafted at runtime onto canvas — a framing plan with
  grid bubbles and a dimension string, a reinforced beam section with hatching
  and leader notes, and a braced-frame elevation with level markers. Each sheet
  carries a title block.
- Airborne cement dust.

---

## Running it

It is a static site — no build step. It does need to be *served* rather than
opened from the filesystem, because three.js is loaded as an ES module and
`file://` origins block module imports:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

### Deploying

Any static host. For GitHub Pages, serve the repository root — `index.html`,
`css/`, `js/`, `vendor/` and `assets/` are all that is needed.

---

## Things to fill in

Everything editable lives at the top of **`js/config.js`**:

```js
DAL.CONFIG = {
  phone:    '94445352',
  phoneIntl:'+96594445352',
  email:    't054161@coded.edu.kw',   // ← confirm / replace
  linkedin: 'https://www.linkedin.com/',   // ← replace with the real profile
  github:   'https://github.com/',         // ← replace with the real profile
  cv:       'cv.html'
};
```

- **Email** — currently set to `t054161@coded.edu.kw`. The **Email Me** button
  builds a `mailto:` link from this value, so the visitor's mail app opens on a
  new message addressed to Dalal with a subject already filled in. Change the
  one value in `config.js` and every link on the site and on the CV page updates.
- **LinkedIn / GitHub** — placeholders. Replace with the real profile URLs.
- **CV** — points at the built-in `cv.html`. To serve a PDF instead, drop it in
  `assets/` and set `cv: 'assets/Dalal-Al-Mutairi-CV.pdf'`.
- **Display font** — the name is set in `'Daisy'` with `Archivo Black` as the
  fallback, since Daisy is not available from Google Fonts. If you have a Daisy
  webfont, add an `@font-face` for it in `css/style.css` and it will be used
  automatically.

## Performance & accessibility

- The raymarch renders to a half-resolution HDR target and is composited with
  bloom, grain, a chromatic edge and a vignette. Resolution and march step count
  **adapt to the measured frame rate**, and start lower on mobile.
- `prefers-reduced-motion` slows the pour to a near-still, disables parallax and
  dust, and reveals all content immediately.
- Without WebGL the site falls back to a styled gradient background; all content
  stays readable. The same happens if 3D initialisation throws.
- Rendering pauses when the tab is hidden.
- Content is real HTML in document order, so it works with a screen reader and
  with the 3D layer switched off.

## Layout

```
index.html          the three pages
cv.html             printable CV (same palette, name top-centre)
css/style.css       palette, type, layout, 3D hover states
js/config.js        ← contact details, links, camera keyframes
js/utils.js         math + dom helpers
js/concrete.js      the raymarched concrete pour (GLSL)
js/structures.js    steel, rebar, formwork, truss, drawings, dust
js/scene.js         renderer, camera choreography, object transforms
js/ui.js            preloader, reveals, nav, contact wiring, terminal
vendor/           three.js r160 (module build), vendored — no CDN dependency
assets/favicon.svg
```

---

## Also in this repository

Two TERRA storefronts, both bilingual (Arabic RTL / English LTR) Next.js apps
with real-time React Three Fiber product viewers:

- **`terra-site/`** — the current build: a cinematic, editorial storefront for
  the TERRA tumbler (tall slim body, flat lid, straw), with an exploded-view
  product anatomy and an AI cup designer.
  See [`terra-site/README.md`](terra-site/README.md).
- **`terra/`** — the earlier build: a customizable insulated mug with a
  4-step designer, Cup of the Day and a loyalty programme.
  See [`terra/README.md`](terra/README.md).
