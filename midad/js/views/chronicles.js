/* ═══════════ READING CHRONICLES — the preserved record ═══════════ */
import { t, n, monthName, isAr } from '../i18n.js';
import { esc, icon, phead, empty, bTitle, bAuthor, stars, genre } from '../ui.js';
import { chronicle } from '../metrics.js';

export default function chronicles() {
  const years = chronicle();
  if (!years.length) return `<div class="wrap">${phead('nav.chronicles', 'chr.lede')}
    ${empty('chron', 'chr.empty', 'chr.emptyD',
      `<button class="btn btn--brass" data-action="add-book">${icon('plus')}<span>${esc(t('nav.addBook'))}</span></button>`)}</div>`;

  return `
  <div class="wrap">
    ${phead('nav.chronicles', 'chr.lede')}
    <div class="chron">
      ${years.map((y) => `
        <section>
          <h2 class="chron__year">${y.year}<span>${n(y.count)} ${esc(t('chr.inYear'))}</span></h2>
          ${y.months.map((m) => `
            <div class="chron__month">
              <h3 class="chron__mname">
                <span>${esc(monthName(m.month))}</span>
                <i>${n(m.books.length)} ${esc(t('chr.inMonth'))}</i>
              </h3>
              <div class="chron__items">
                ${m.books.map((b) => `
                  <button class="chron__item" data-book="${esc(b.id)}">
                    <span class="chron__day">${new Date(b.finished).getDate()}</span>
                    <span style="min-width:0;flex:1">
                      <span class="chron__t" style="display:block">${esc(bTitle(b))}</span>
                      <span class="chron__a">${esc(bAuthor(b))} · ${esc(genre(b.genre))} · ${n(b.pages)} ${esc(t('w.page'))}</span>
                    </span>
                    ${stars(b.rating)}
                    ${icon(isAr() ? 'in' : 'arrow')}
                  </button>`).join('')}
              </div>
            </div>`).join('')}
        </section>`).join('')}
    </div>
  </div>`;
}
