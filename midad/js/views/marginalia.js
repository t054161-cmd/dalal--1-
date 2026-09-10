/* ═══════════ MARGINALIA — handwriting on aged paper ═══════════ */
import { t, pick, other, n, dateLong } from '../i18n.js';
import { esc, icon, phead, empty, bTitle, bAuthor } from '../ui.js';
import { allMarginalia } from '../data.js';

export const state = { kind: 'all', shown: 24 };

const KINDS = [['all', 'mg.all'], ['quote', 'mg.quote'], ['note', 'mg.note'], ['idea', 'mg.idea'], ['stayed', 'mg.stayed']];
/* quotes and "what stayed" are projected; notes and ideas stay on paper */
const HOLO = new Set(['quote', 'stayed']);

export default function marginalia() {
  const all = allMarginalia();
  const pool = state.kind === 'all' ? all : all.filter((m) => m.kind === state.kind);
  const items = pool.slice(0, state.shown);

  return `
  <div class="wrap">
    ${phead('nav.marginalia', 'mg.lede',
      `<button class="btn btn--brass" data-action="add-margin">${icon('quill')}<span>${esc(t('mg.add'))}</span></button>`)}

    <div class="toolbar holo holo--quiet">
      <div class="seg" role="group" aria-label="${esc(t('mg.kind'))}">
        ${KINDS.map(([k, key]) => `
          <button data-action="mg-kind" data-kind="${k}" aria-pressed="${state.kind === k}">${esc(t(key))}</button>`).join('')}
      </div>
      <span class="toolbar__spacer"></span>
      <span class="count"><b>${n(pool.length)}</b> ${esc(t('mg.count'))}</span>
    </div>

    ${items.length ? `
      <div class="notes">
        ${items.map((m) => {
          const holo = HOLO.has(m.kind);
          const main = pick(m.text), sec = other(m.text);
          return `
          <article class="note ${holo ? 'note--holo holo' : 'note--paper parchment'}">
            <span class="note__kind">${esc(t('mg.' + (m.kind === 'stayed' ? 'stayed' : m.kind)))}</span>
            <p class="note__hand ${holo ? 'note__hand--holo' : ''}">${holo ? '«' : ''}${esc(main)}${holo ? '»' : ''}</p>
            ${sec ? `<p class="note__hand ${holo ? 'note__hand--holo' : ''}" style="font-size:.86rem;opacity:.66;margin-top:.5rem">${esc(sec)}</p>` : ''}
            <div class="note__meta">
              ${m.book ? `
                <button class="note__src" data-book="${esc(m.book.id)}" style="background:none;border:0;cursor:pointer;padding:0;text-align:start">
                  ${esc(bTitle(m.book))} — ${esc(bAuthor(m.book))}
                </button>` : `<span class="note__src">${esc(t('mg.note'))}</span>`}
              <span class="${holo ? 'muted' : ''}" style="opacity:.7">
                ${m.page ? `${esc(t('w.page'))} ${n(m.page)}` : m.at ? esc(dateLong(m.at)) : ''}
              </span>
            </div>
          </article>`;
        }).join('')}
      </div>
      ${pool.length > items.length ? `
        <div class="center" style="margin-top:1.5rem">
          <button class="btn btn--holo" data-action="mg-more">
            ${icon('plus')}<span>${esc(t('mg.more'))} (${n(pool.length - items.length)})</span>
          </button>
        </div>` : ''}`
      : empty('quill', 'mg.empty', 'mg.emptyD',
          `<button class="btn btn--brass" data-action="add-margin">${icon('quill')}<span>${esc(t('mg.add'))}</span></button>`)}
  </div>`;
}
