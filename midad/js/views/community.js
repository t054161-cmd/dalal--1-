/* ═══════════ COMMUNITY — readers, kept about books ═══════════ */
import { t, pick, n, dec } from '../i18n.js';
import { esc, icon, phead, genre, bTitle } from '../ui.js';
import { readers, bookById } from '../data.js';

export default function community() {
  return `
  <div class="wrap">
    ${phead('nav.community', 'cm.lede')}
    <div class="readers">
      ${readers().map((r) => `
        <article class="reader holo holo--quiet">
          <header class="reader__head">
            <span class="avatar">${esc(pick(r.name).trim().charAt(0))}</span>
            <div style="min-width:0">
              <h3 class="reader__n">${esc(pick(r.name))}</h3>
              <p class="reader__m">${esc(t('cm.favGenre'))}: ${esc(genre(r.genre))} · ${esc(t('cm.since'))} ${r.since}</p>
            </div>
          </header>

          <p class="reader__line">${esc(pick(r.line))}</p>

          <div>
            <p class="record__label" style="color:var(--brass);margin-bottom:.5rem">${esc(t('cm.recommends'))}</p>
            <div class="reader__recs">
              ${r.recs.map((id) => {
                const b = bookById(id);
                return b
                  ? `<button class="reader__rec" data-book="${esc(id)}">${icon('book')}<span>${esc(bTitle(b))}</span></button>`
                  : `<span class="reader__rec" style="opacity:.5">${icon('lock')}<span>${esc(t('cm.notInLib'))}</span></span>`;
              }).join('')}
            </div>
          </div>

          <div class="reader__stats">
            <span><b>${n(r.books)}</b>${esc(t('cm.finished'))}</span>
            <span><b>${dec(r.avg)}</b>${esc(t('cm.avg'))}</span>
            <span><b>${n(r.exchanges)}</b>${esc(t('cm.exchanges'))}</span>
          </div>
        </article>`).join('')}
    </div>
  </div>`;
}
