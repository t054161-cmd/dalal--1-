/* ═══════════ LIBRARY CARD — membership, milestones, seals ═══════════ */
import { t, pick, other, n, dec, isAr } from '../i18n.js';
import { esc, icon, phead, bi, shead, genre } from '../ui.js';
import { db } from '../data.js';
import { currentReader } from '../account.js';
import { totals, favouriteGenre, achievements, milestones } from '../metrics.js';

export default function card() {
  const s = totals();
  const reader = currentReader();
  /* a signed-in reader's card carries their registration; the guest shelf
     carries the archive's own name until someone registers */
  const p = reader
    ? { name: reader.name, member: reader.member, since: reader.since }
    : db().profile;
  const fav = favouriteGenre();
  const acs = achievements();
  const ms = milestones();

  const fact = (v, key) => `
    <div class="libcard__fact"><b>${v}</b><span>${esc(t(key))}</span></div>`;

  return `
  <div class="wrap">
    ${phead('nav.card', 'lc.lede', `
      <span class="phead__acts">
        <button class="btn btn--sm" data-action="edit-name">${icon('edit')}<span>${esc(t('lc.editName'))}</span></button>
        ${reader ? '' : `
          <button class="btn btn--sm" data-action="auth-in">${icon('card')}<span>${esc(t('ac.signIn'))}</span></button>
          <button class="btn btn--sm btn--brass" data-action="auth-up">${icon('plus')}<span>${esc(t('ac.signUp'))}</span></button>`}
      </span>`)}

    ${reader ? '' : `
      <p class="guestnote">${icon('eye')}<span>${esc(t('ac.guestNote'))}</span></p>`}

    <div class="cardstage">
      <!-- ── the card itself ── -->
      <div class="libcard parchment">
        <span class="libcard__engrave"></span>
        <span class="libcard__wm" aria-hidden="true">مِداد</span>

        <header class="libcard__head">
          <div>
            <span class="libcard__mark">مِداد</span>
            <span class="libcard__marken">MIDĀD</span>
          </div>
          <div class="libcard__no">
            ${esc(t('lc.member'))}
            <b>${esc(p.member)}</b>
          </div>
        </header>

        <div class="libcard__stamp">${esc(t('lc.stamp'))}</div>

        <div class="libcard__name">
          <span class="bi" style="gap:0">
            <span class="libcard__name-ar">${esc(p.name.ar)}</span>
            <span class="libcard__name-en">${esc(p.name.en)}</span>
          </span>
        </div>

        <div class="libcard__facts">
          ${fact(n(s.books), 'lc.finished')}
          ${fact(dec(s.avg), 'lc.avg')}
          ${fact(n(s.pages), 'lc.pages')}
          ${fact(fav ? esc(genre(fav)) : '—', 'lc.favGenre')}
          ${fact(p.since, 'lc.since')}
        </div>

        <div class="libcard__barcode" aria-hidden="true"></div>
      </div>

      <!-- ── milestones ── -->
      <section class="stack">
        <div class="holo" style="padding:1.25rem 1.35rem">
          <div class="shead" style="margin-bottom:1rem"><h2>${shead('lc.milestones')}</h2></div>
          <div class="stack" style="gap:.6rem">
            ${ms.map((m) => `
              <div style="display:flex;align-items:center;gap:.75rem;font-size:.88rem;color:${'var(--text-2)'}">
                <span class="reqrow__dir" style="width:1.9rem;height:1.9rem;${m.done ? 'color:var(--good);border-color:color-mix(in srgb, var(--good) 45%, transparent)' : 'opacity:.45'}">
                  ${icon(m.done ? 'check' : 'lock')}
                </span>
                <span style="${m.done ? '' : 'opacity:.55'}">${esc(t(m.key))}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="holo" style="padding:1.25rem 1.35rem">
          <div class="shead" style="margin-bottom:.4rem"><h2>${shead('lc.ach')}</h2></div>
          <p class="muted" style="font-size:.8rem;margin:0 0 1.1rem">${esc(t('lc.achLede'))}</p>
          <div class="seals">
            ${acs.map((a) => `
              <div class="seal ${a.earned ? 'seal--on' : 'seal--off'}">
                <span class="seal__disc">${icon(a.earned ? 'seal' : 'lock', 'ic ic--lg')}</span>
                ${bi(a.key)}
                <span class="seal__meta">${a.earned
                  ? esc(t('lc.earned'))
                  : `${esc(t('lc.locked'))} ${n(a.left)}`}</span>
              </div>`).join('')}
          </div>
        </div>
      </section>
    </div>
  </div>`;
}
