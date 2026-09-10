/* ═══════════ BOOK EXCHANGE — give a book a second life ═══════════ */
import { t, pick, n, dateLong } from '../i18n.js';
import { esc, icon, phead, empty, shead, genre } from '../ui.js';
import { db, cloth, listingById } from '../data.js';

export const state = { tab: 'discover' };

const TABS = [['discover', 'ex.discover'], ['mine', 'ex.mine'], ['requests', 'ex.requests'], ['saved', 'ex.saved']];

const CONDITION = { new: 'ex.cond.new', good: 'ex.cond.good', worn: 'ex.cond.worn' };

function card(l) {
  const [c1, c2] = cloth(l.genre);
  const saved = db().saved.includes(l.id);
  const req = db().requests.find((r) => r.listing === l.id);
  const busy = l.status !== 'available';

  return `
  <article class="excard holo holo--quiet" style="--c1:${c1};--c2:${c2}">
    <div class="excard__top">
      <span class="excard__cover"></span>
      <div style="min-width:0">
        <h3 class="excard__t">${esc(pick({ ar: l.titleAr, en: l.titleEn }))}</h3>
        <p class="excard__a">${esc(pick({ ar: l.authorAr, en: l.authorEn }))}</p>
        <div class="excard__tags">
          <span class="chip chip--muted">${esc(genre(l.genre))}</span>
          <span class="chip chip--muted">${esc(t(CONDITION[l.condition] || 'ex.cond.good'))}</span>
          <span class="chip chip--muted">${esc(l.bookLang === 'ar' ? t('w.arabic') : t('w.english'))}</span>
        </div>
      </div>
    </div>

    ${l.desc ? `<p class="excard__desc">${esc(pick(l.desc))}</p>` : ''}
    ${l.wants ? `<div class="excard__wants"><b>${esc(t('ex.wants'))}</b>${esc(pick(l.wants))}</div>` : ''}

    <div class="excard__foot">
      <span class="excard__owner">
        <span class="avatar ${l.mine ? 'avatar--holo' : ''}">${esc(pick(l.owner).trim().charAt(0))}</span>
        <span>
          ${esc(l.mine ? t('ex.you') : pick(l.owner))}
          <br><span style="opacity:.75">${icon('pin')} ${esc(pick(l.area))}</span>
        </span>
      </span>
      <span class="status status--${l.status}">${esc(t('ex.st.' + l.status))}</span>
      ${l.mine ? '' : `
        <button class="btn btn--sm ${saved ? '' : 'btn--ghost'}" data-action="ex-save" data-id="${esc(l.id)}">
          ${icon('bookmark')}<span>${esc(saved ? t('ex.unsave') : t('ex.save'))}</span>
        </button>
        <button class="btn btn--sm btn--holo" data-action="ex-request" data-id="${esc(l.id)}"
                ${req || busy ? 'disabled' : ''}>
          ${icon('swap')}<span>${esc(req ? t('ex.requested') : t('ex.request'))}</span>
        </button>`}
    </div>
  </article>`;
}

function requests() {
  const rs = db().requests;
  if (!rs.length) return empty('swap', 'ex.emptyReq', 'ex.emptyReqD');
  return `<div class="ledger">${rs.map((r) => {
    const l = listingById(r.listing);
    if (!l) return '';
    const incoming = r.dir === 'in';
    return `
    <article class="reqrow holo holo--quiet">
      <span class="reqrow__dir ${incoming ? 'reqrow__dir--in' : ''}">${icon(incoming ? 'in' : 'out')}</span>
      <div style="min-width:0">
        <p class="reqrow__t">${esc(pick({ ar: l.titleAr, en: l.titleEn }))}</p>
        <p class="reqrow__m">
          ${esc(incoming ? t('ex.reqIn') : t('ex.reqOut'))} ·
          ${esc(pick(l.owner))} · ${esc(dateLong(r.at))} ·
          <span class="status status--${r.status === 'completed' ? 'completed' : r.status === 'pending' ? 'pending' : 'available'}">
            ${esc(r.status === 'completed' ? t('ex.st.completed') : t('ex.st.pending'))}
          </span>
        </p>
      </div>
      <div class="reqrow__acts">
        ${r.status === 'pending' && incoming ? `
          <button class="btn btn--sm btn--brass" data-action="ex-accept" data-id="${esc(r.id)}">${icon('check')}<span>${esc(t('ex.accept'))}</span></button>
          <button class="btn btn--sm btn--ghost" data-action="ex-decline" data-id="${esc(r.id)}">${icon('x')}<span>${esc(t('ex.decline'))}</span></button>` : ''}
        ${r.status === 'pending' && !incoming ? `
          <button class="btn btn--sm" data-action="ex-complete" data-id="${esc(r.id)}">${icon('check')}<span>${esc(t('ex.complete'))}</span></button>
          <button class="btn btn--sm btn--ghost" data-action="ex-decline" data-id="${esc(r.id)}">${icon('x')}<span>${esc(t('ex.decline'))}</span></button>` : ''}
        ${r.status === 'accepted' ? `
          <button class="btn btn--sm btn--brass" data-action="ex-complete" data-id="${esc(r.id)}">${icon('check')}<span>${esc(t('ex.complete'))}</span></button>` : ''}
      </div>
    </article>`;
  }).join('')}</div>`;
}

export default function exchange() {
  const all = db().listings;
  let body;
  if (state.tab === 'requests') body = requests();
  else {
    const list = state.tab === 'mine' ? all.filter((l) => l.mine)
      : state.tab === 'saved' ? all.filter((l) => db().saved.includes(l.id))
      : all;
    body = list.length
      ? `<div class="exgrid">${list.map(card).join('')}</div>`
      : state.tab === 'mine' ? empty('shelf', 'ex.emptyMine', 'ex.emptyMineD',
            `<button class="btn btn--brass" data-action="ex-offer">${icon('plus')}<span>${esc(t('ex.offer'))}</span></button>`)
        : empty('bookmark', 'ex.emptySaved', 'ex.emptySavedD');
  }

  const pending = db().requests.filter((r) => r.status === 'pending').length;

  return `
  <div class="wrap">
    ${phead('nav.exchange', 'ex.lede',
      `<button class="btn btn--brass" data-action="ex-offer">${icon('plus')}<span>${esc(t('ex.offer'))}</span></button>`)}

    <section class="exbanner holo">
      <span class="exbanner__seal">${icon('swap', 'ic ic--lg')}</span>
      <div class="exbanner__motto">
        <p class="exbanner__ar" lang="ar">«امنح كتابًا حياةً ثانية»</p>
        <p class="exbanner__en" lang="en">“Give a book a second life.”</p>
      </div>
      <div class="exbanner__figures">
        <span><b>${n(all.filter((l) => l.status === 'available').length)}</b>${esc(t('ex.st.available'))}</span>
        <span><b>${n(db().requests.filter((r) => r.status === 'completed').length)}</b>${esc(t('ex.st.completed'))}</span>
      </div>
    </section>

    <div class="toolbar holo holo--quiet">
      <div class="seg" role="tablist">
        ${TABS.map(([k, key]) => `
          <button data-action="ex-tab" data-tab="${k}" aria-pressed="${state.tab === k}">
            ${esc(t(key))}${k === 'requests' && pending ? ` (${n(pending)})` : ''}
          </button>`).join('')}
      </div>
      <span class="toolbar__spacer"></span>
      <span class="count"><b>${n(all.filter((l) => l.status === 'available').length)}</b> ${esc(t('ex.st.available'))}</span>
    </div>

    ${body}
  </div>`;
}
