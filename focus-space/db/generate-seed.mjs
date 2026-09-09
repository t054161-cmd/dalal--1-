/* Emits 004_seed.sql from the application's own data, so the database and
   the front end can never drift apart. Run from the repository root:

       node focus-space/db/generate-seed.mjs > focus-space/db/004_seed.sql
*/
import { readFileSync } from 'fs';

/* The app's files are browser globals; give them a window that is the
   Node global, and they load unchanged. */
global.window = globalThis;
for (const f of ['config', 'i18n', 'data']) {
  (0, eval)(readFileSync(new URL(`../js/${f}.js`, import.meta.url), 'utf8'));
}
const D = window.FS.Data;
const STR = window.FS.I18N.STRINGS;

const q = s => "'" + String(s).replace(/'/g, "''") + "'";
const j = o => q(JSON.stringify(o)) + '::jsonb';
const i18n = (en, ar) => j({ en, ar });
const num = v => (v == null ? 'null' : String(v));

/* 07 → 07:00:00, 26 → 02:00:00 (the next morning) */
const clock = h => {
  const hh = ((Math.floor(h) % 24) + 24) % 24;
  const mm = Math.round((h - Math.floor(h)) * 60);
  return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':00';
};

const GOVERNORATE = {
  'Kuwait City':    ['Al Asimah', 'العاصمة'],
  'Sharq':          ['Al Asimah', 'العاصمة'],
  'Bneid Al-Gar':   ['Al Asimah', 'العاصمة'],
  'Shuwaikh':       ['Al Asimah', 'العاصمة'],
  'Salmiya':        ['Hawalli', 'حولي'],
  'Hawally':        ['Hawalli', 'حولي'],
  'Jabriya':        ['Hawalli', 'حولي'],
  'Salwa':          ['Hawalli', 'حولي'],
  'Mishref':        ['Hawalli', 'حولي'],
  'Sabah Al-Salem': ['Mubarak Al-Kabeer', 'مبارك الكبير'],
  'Al-Rai':         ['Al Farwaniyah', 'الفروانية'],
  'Fintas':         ['Al Ahmadi', 'الأحمدي']
};

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const out = [];
const w = line => out.push(line);

w(`-- ═══════════════════════════════════════════════════════════════════════`);
w(`--  FOCUS SPACE — seed`);
w(`--`);
w(`--  Generated from focus-space/js/data.js by generate-seed.mjs.`);
w(`--  Do not edit by hand: change the application data and regenerate, or`);
w(`--  once the database is the source of truth, retire this file.`);
w(`--`);
w(`--  ${D.SPACES.length} spaces · ${D.CATEGORIES.length} categories · ${D.activeServices().length} services`);
w(`-- ═══════════════════════════════════════════════════════════════════════`);
w('');
w('begin;');
w('');

/* ── districts, with a centre averaged from the spaces in them ── */
w('-- ── districts ──────────────────────────────────────────────────────────');
const districts = new Map();
D.SPACES.forEach(s => {
  const key = s.district.en;
  if (!districts.has(key)) districts.set(key, { d: s.district, pts: [] });
  districts.get(key).pts.push([s.lng, s.lat]);
});
for (const [en, { d, pts }] of districts) {
  const lng = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const lat = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const gov = GOVERNORATE[en];
  w(`insert into districts (slug, name, governorate, city, centre) values (` +
    `${q(slugify(en))}, ${i18n(d.en, d.ar)}, ` +
    `${gov ? i18n(gov[0], gov[1]) : 'null'}, ${i18n('Kuwait', 'الكويت')}, ` +
    `st_setsrid(st_makepoint(${lng.toFixed(6)}, ${lat.toFixed(6)}), 4326)::geography)` +
    ` on conflict (slug) do nothing;`);
}
w('');

/* ── categories ── */
w('-- ── categories ─────────────────────────────────────────────────────────');
D.CATEGORIES.forEach(c => {
  w(`insert into categories (slug, position, name, tagline, description, suited_for) values (` +
    `${q(c.id)}, ${parseInt(c.index, 10)}, ${i18n(c.name.en, c.name.ar)}, ` +
    `${i18n(STR.en[c.sub], STR.ar[c.sub])}, ${i18n(STR.en[c.long], STR.ar[c.long])}, ` +
    `${j({ en: c.suited.en, ar: c.suited.ar })}) on conflict (slug) do nothing;`);
});
w('');

/* ── services ── */
w('-- ── services ───────────────────────────────────────────────────────────');
D.SERVICES.forEach((key, i) => {
  w(`insert into services (key, name, sort_order) values (` +
    `${q(key)}, ${i18n(STR.en['srv.' + key], STR.ar['srv.' + key])}, ${i}) ` +
    `on conflict (key) do nothing;`);
});
w('');

/* ── spaces and everything hanging off them ── */
w('-- ── spaces ─────────────────────────────────────────────────────────────');
D.SPACES.forEach(s => {
  const open = [0, 1, 2, 3, 4, 5, 6].filter(d => (s.closedDays || []).indexOf(d) === -1);
  w('');
  w(`-- ${s.name.en} · ${s.district.en}`);
  w(`insert into spaces (slug, category_id, district_id, name, description, location,`);
  w(`                    capacity, price_per_hour, render_seed, status) values (`);
  w(`  ${q(s.id)},`);
  w(`  (select id from categories where slug = ${q(s.cat)}),`);
  w(`  (select id from districts  where slug = ${q(slugify(s.district.en))}),`);
  w(`  ${i18n(s.name.en, s.name.ar)},`);
  w(`  ${i18n(s.desc.en, s.desc.ar)},`);
  w(`  st_setsrid(st_makepoint(${s.lng}, ${s.lat}), 4326)::geography,`);
  w(`  ${num(s.capacity)}, ${s.price ? num(s.price) : 'null'}, ${num(s.seed)}, 'published')`);
  w(`on conflict (slug) do nothing;`);

  w(`insert into space_services (space_id, service_key)`);
  w(`select (select id from spaces where slug = ${q(s.id)}), key`);
  w(`  from unnest(array[${s.services.map(q).join(', ')}]) as key`);
  w(`on conflict do nothing;`);

  const closes = clock(s.hours.close);
  const overnight = s.hours.close >= 24;
  w(`insert into space_hours (space_id, weekday, opens, closes, closes_next_day)`);
  w(`select (select id from spaces where slug = ${q(s.id)}), d, ` +
    `${q(clock(s.hours.open))}::time, ${q(closes)}::time, ${overnight}`);
  w(`  from unnest(array[${open.join(', ')}]) as d`);
  w(`on conflict do nothing;`);

  (s.busy || []).forEach(([from, to]) => {
    w(`insert into space_busy_windows (space_id, weekday, starts, ends)`);
    w(`select (select id from spaces where slug = ${q(s.id)}), d, ` +
      `${q(clock(from))}::time, ${q(clock(to))}::time`);
    w(`  from unnest(array[${open.join(', ')}]) as d`);
    w(`on conflict do nothing;`);
  });

  if (s.offer) {
    w(`insert into offers (space_id, title) values (`);
    w(`  (select id from spaces where slug = ${q(s.id)}), ${i18n(s.offer.en, s.offer.ar)});`);
  }
});

w('');
w('commit;');
w('');
process.stdout.write(out.join('\n'));
