/* ═══════════ THE BOOK ARCHIVE — one preserved record ═══════════ */
import { t, pick, other, n, dec, dateLong } from '../i18n.js';
import { esc, icon, stars, coverVars, bTitle, bTitle2, bAuthor, bAuthor2, genre, empty } from '../ui.js';
import { db, bookById } from '../data.js';

const fact = (k, v) => `
  <div class="archfacts__row"><span class="archfacts__k">${esc(k)}</span><span class="archfacts__v">${v}</span></div>`;

const record = (labelKey, inner, mod = '') => `
  <section class="record parchment ${mod}">
    <h2 class="record__label">${esc(t(labelKey))}</h2>
    ${inner}
  </section>`;

const bodyOf = (obj) => {
  const main = pick(obj), sec = other(obj);
  if (!main) return `<p class="record__body muted">${esc(t('bk.none'))}</p>`;
  return `<p class="record__body">${esc(main)}</p>${sec ? `<p class="record__body muted" style="font-size:.92rem;margin-top:.7rem">${esc(sec)}</p>` : ''}`;
};

export default function book(id) {
  const b = bookById(id);
  if (!b) return `<div class="wrap">${empty('page', 'bk.notFound', 'bk.notFoundD',
    `<a class="btn" href="#/library">${esc(t('nav.library'))}</a>`)}</div>`;

  const order = [...db().books].sort((x, y) => new Date(y.finished) - new Date(x.finished));
  const i = order.findIndex((x) => x.id === b.id);
  const prev = order[i - 1], next = order[i + 1];

  return `
  <div class="wrap">
    <div class="phead" style="padding-bottom:.5rem">
      <a class="crumb" href="#/library">${icon('in')}<span>${esc(t('nav.library'))}</span></a>
      <span class="phead__sub">${esc(t('bk.record'))}</span>
    </div>

    <div class="archive">
      <!-- ── the artefact ── -->
      <aside class="archive__aside">
        <div class="bigcover" style="${coverVars(b)}" role="img"
             aria-label="${esc(bTitle(b))} — ${esc(bAuthor(b))}">
          <span class="bigcover__t">${esc(bTitle(b))}</span>
          <span class="bigcover__a">${esc(bAuthor(b))}</span>
        </div>

        <div class="holo archfacts">
          ${fact(t('w.author'), esc(bAuthor(b)) + (bAuthor2(b) ? `<br><span class="muted" style="font-size:.74rem">${esc(bAuthor2(b))}</span>` : ''))}
          ${fact(t('w.genre'), `<span class="chip chip--holo">${esc(genre(b.genre))}</span>`)}
          ${fact(t('w.readIn'), esc((b.lang || 'ar') === 'ar' ? t('w.arabic') : t('w.english')))}
          ${fact(t('w.pages'), `<span class="num">${n(b.pages)}</span>`)}
          ${fact(t('w.rating'), stars(b.rating))}
          ${fact(t('bk.finishedOn'), esc(dateLong(b.finished)))}
        </div>

        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn--sm" data-action="edit-book" data-id="${esc(b.id)}">${icon('edit')}<span>${esc(t('w.edit'))}</span></button>
          <button class="btn btn--sm" data-action="add-margin" data-id="${esc(b.id)}">${icon('quill')}<span>${esc(t('mg.add'))}</span></button>
          <button class="btn btn--sm btn--ghost" data-action="delete-book" data-id="${esc(b.id)}">${icon('trash')}<span>${esc(t('w.delete'))}</span></button>
        </div>
      </aside>

      <!-- ── the record ── -->
      <div class="archive__main">
        <header class="record parchment">
          <h1 style="font-family:var(--f-amiri);font-size:clamp(1.6rem,1.2rem + 1.8vw,2.4rem);line-height:1.5;color:#2f2011">${esc(bTitle(b))}</h1>
          ${bTitle2(b) ? `<p style="font-family:var(--f-serif);font-size:1.05rem;color:#66491f;margin:.2rem 0 0">${esc(bTitle2(b))}</p>` : ''}
          <div class="rule" style="margin-block:1rem"><span class="rule__dot"></span></div>
          ${bodyOf(b.review)}
        </header>

        ${record('bk.stayed', bodyOf(b.stayed), 'record--stayed')}

        ${(b.quotes || []).length ? `
        <section>
          <h2 class="record__label" style="color:var(--holo-label)">${esc(t('bk.quotes'))}</h2>
          <div class="quotelist">
            ${b.quotes.map((q) => `
              <figure class="quoteholo holo" style="margin:0">
                <blockquote class="quoteholo__ar">${esc(pick(q))}</blockquote>
                ${other(q) ? `<p class="quoteholo__en">${esc(other(q))}</p>` : ''}
                <figcaption class="quoteholo__meta">
                  ${icon('page')}<span>${esc(t('w.page'))} ${n(q.page)}</span>
                </figcaption>
              </figure>`).join('')}
          </div>
        </section>` : ''}

        ${(b.ideas || []).length ? record('bk.ideas',
          `<ol class="ideas">${b.ideas.map((x) => `<li>${esc(pick(x))}</li>`).join('')}</ol>`) : ''}

        ${(b.notes || []).length ? record('bk.notes',
          b.notes.map((x) => `<p class="record__body">${esc(pick(x))}</p>`).join('')) : ''}

        <nav style="display:flex;gap:.6rem;justify-content:space-between;flex-wrap:wrap;margin-top:.5rem">
          ${prev ? `<a class="btn btn--sm" href="#/book/${esc(prev.id)}">${icon('in')}<span>${esc(t('bk.prev'))}: ${esc(bTitle(prev))}</span></a>` : '<span></span>'}
          ${next ? `<a class="btn btn--sm" href="#/book/${esc(next.id)}"><span>${esc(t('bk.next'))}: ${esc(bTitle(next))}</span>${icon('arrow')}</a>` : ''}
        </nav>
      </div>
    </div>
  </div>`;
}
