/* ═══════════ باحث مِداد — the research desk ═══════════ */
import { t, pick, isAr, n } from '../i18n.js';
import { esc, icon, phead, genre, bTitle, bAuthor, coverVars } from '../ui.js';
import { ask } from '../researcher.js';

/* The conversation lives for the session; it is a desk, not a diary. */
export const state = { thread: [], asked: false };

const SUGGESTIONS = [
  ['rs.s1', 'اقترح لي كتابًا قصيرًا في الفلسفة',        'Recommend a short philosophical book'],
  ['rs.s2', 'ما يشبه مدن الملح؟',                        'What is similar to Cities of Salt?'],
  ['rs.s3', 'ماذا لديّ لغسان كنفاني؟',                   'What do I have by Ghassan Kanafani?'],
  ['rs.s4', 'قارن بين عزازيل وفرانكشتاين في بغداد',      'Compare Nineteen Eighty-Four and Invisible Cities'],
  ['rs.s5', 'ماذا أقرأ بعد؟',                            'What should I read next?'],
  ['rs.s6', 'كم كتابًا قرأت؟',                           'How many books have I read?'],
];

function bookLine(b) {
  const read = b.read !== false && b.finished;
  const tag = read
    ? `<span class="chip chip--muted">${esc(genre(b.genre))}</span>`
    : `<span class="chip chip--holo">${esc(t('rs.notRead'))}</span>`;
  const inner = `
    <span class="rsbook__mini" style="${coverVars(b)}"></span>
    <span class="rsbook__body">
      <span class="rsbook__t">${esc(bTitle(b))}</span>
      <span class="rsbook__a">${esc(bAuthor(b))}${b.pages ? ` · ${n(b.pages)} ${esc(t('w.page'))}` : ''}</span>
      <span class="rsbook__meta">${tag}</span>
    </span>`;
  return read
    ? `<button class="rsbook" data-book="${esc(b.id)}">${inner}</button>`
    : `<span class="rsbook rsbook--static">${inner}</span>`;
}

export default function researcher() {
  return `
  <div class="wrap">
    ${phead('nav.researcher', 'rs.lede')}

    <section class="desk holo" aria-label="${esc(t('nav.researcher'))}">
      <header class="desk__head">
        <span class="desk__sig">${icon('spark', 'ic ic--lg')}</span>
        <div>
          <p class="desk__title">${esc(t('rs.desk'))}</p>
          <p class="desk__sub">${esc(t('rs.scope'))}</p>
        </div>
      </header>

      <div class="desk__thread" id="deskThread" role="log" aria-live="polite">
        ${state.thread.length ? state.thread.map((turn) => turn.role === 'you' ? `
          <div class="turn turn--you"><p class="turn__text">${esc(turn.text)}</p></div>` : `
          <div class="turn turn--desk">
            <p class="turn__text">${esc(turn.text)}</p>
            ${turn.books?.length ? `<div class="rsbooks">${turn.books.map(bookLine).join('')}</div>` : ''}
            ${turn.quotes?.length ? turn.quotes.map((q) => `
              <p class="turn__stayed">«${esc(pick(q.stayed))}» — ${esc(bTitle(q.book))}</p>`).join('') : ''}
            ${turn.link ? `<a class="btn btn--sm btn--holo" href="${turn.link}">${icon('stats')}<span>${esc(t('nav.stats'))}</span></a>` : ''}
            ${turn.note ? `<p class="turn__note">${icon('eye')} ${esc(turn.note)}</p>` : ''}
          </div>`).join('') : `
          <div class="turn turn--desk">
            <p class="turn__text">${esc(t('rs.greet'))}</p>
          </div>`}
      </div>

      <form class="desk__ask" data-form="ask">
        <label class="sr" for="deskInput">${esc(t('rs.placeholder'))}</label>
        <input class="desk__input" id="deskInput" name="q" autocomplete="off"
               placeholder="${esc(t('rs.placeholder'))}" />
        <button class="btn btn--holo" type="submit">${icon('search')}<span>${esc(t('rs.send'))}</span></button>
      </form>

      <div class="desk__chips">
        ${SUGGESTIONS.map(([, ar, en]) => {
          const q = isAr() ? ar : en;
          return `<button class="chip chip--ask" data-action="rs-ask" data-q="${esc(q)}">${esc(q)}</button>`;
        }).join('')}
      </div>
    </section>

    <p class="desk__foot">${icon('lock')} ${esc(t('rs.local'))}</p>
  </div>`;
}
