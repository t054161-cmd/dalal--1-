# Photographs

Real photographs of the spaces go here. Until one is supplied, a space keeps
its rendered interior, so the site is never broken while photography is being
collected.

## Adding a photo

1. Put the file in this folder, named after the space id — `atlas-desk.jpg`,
   `sage-and-salt.jpg`, and so on. The ids are the keys of the `PHOTOS` map in
   `../../js/data.js`.
2. Open `js/data.js` and fill that space's entry:

   ```js
   'atlas-desk': 'assets/photos/atlas-desk.jpg',
   ```

A value can also be a full URL (`https://…`), so photos can live in object
storage or a CDN instead of the repository.

The three category tiles and category page headers read `CATEGORY_PHOTOS` in
the same file — one wide photograph each for offices, halls and cafés.

## What to shoot

| | |
|---|---|
| **Aspect** | Landscape. Cards crop to 16:11, the detail header much wider — keep the subject centred and leave room top and bottom |
| **Size** | 1600 × 1000 px is plenty; anything larger only costs load time |
| **Format** | JPEG at ~80% quality, or WebP. Aim under 300 KB per photo |
| **Light** | Daylight, no flash. The palette is sage, sand, cloud and vanilla — warm, calm rooms sit inside it; heavily saturated or neon-lit shots fight it |
| **Content** | The room, not people. Show the seating, the tables, the light and the space itself — someone deciding where to work is reading the room |

## Before publishing someone else's space

- Get the venue's permission to photograph and to list them.
- If a photo came from the venue, keep a note of that permission.
- If a photo came from a stock library, keep it within that licence.
- Don't put a photograph of a real venue next to a listing for a different
  one — the names and details in `data.js` are illustrative examples, and
  pairing them with a real place's photograph misrepresents that place.
