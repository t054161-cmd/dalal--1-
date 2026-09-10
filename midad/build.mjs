/* ═══════════════════════════════════════════════════════════════════
   Build a deployable copy of مِداد into dist/.
   The site needs no build step to run — open index.html and it works.
   This exists only to produce a small, cache-friendly bundle to host:
   one stylesheet, one script, one page.

     node build.mjs
   ═══════════════════════════════════════════════════════════════════ */
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';

const OUT = 'dist';
await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/assets`, { recursive: true });

/* ── one script ── */
await build({
  entryPoints: ['js/app.js'],
  bundle: true, minify: true, format: 'esm', target: ['es2021'],
  charset: 'utf8', legalComments: 'none',
  /* wrap instead of emitting one enormous line: same bytes to a browser,
     but the output stays diffable and reviewable */
  lineLimit: 100,
  outfile: `${OUT}/app.js`,
});

/* ── one stylesheet, in cascade order ── */
const SHEETS = ['css/tokens.css', 'css/environment.css', 'css/components.css'];
await writeFile('.css-bundle.css', (await Promise.all(SHEETS.map((f) => readFile(f, 'utf8')))).join('\n'));
await build({
  entryPoints: ['.css-bundle.css'],
  minify: true, charset: 'utf8', legalComments: 'none', lineLimit: 100,
  outfile: `${OUT}/styles.css`,
});
await rm('.css-bundle.css');

/* ── the page, pointed at the bundle ── */
const html = (await readFile('index.html', 'utf8'))
  .replace(
    /<link rel="stylesheet" href="css\/tokens\.css" \/>\s*<link rel="stylesheet" href="css\/environment\.css" \/>\s*<link rel="stylesheet" href="css\/components\.css" \/>/,
    '<link rel="stylesheet" href="styles.css" />',
  )
  .replace('<script type="module" src="js/app.js"></script>', '<script type="module" src="app.js"></script>');

if (html.includes('css/tokens.css') || html.includes('js/app.js')) {
  throw new Error('index.html did not rewrite: the asset tags moved, fix the patterns above');
}
await writeFile(`${OUT}/index.html`, html);
await copyFile('assets/favicon.svg', `${OUT}/assets/favicon.svg`);

console.log('dist/ built');
