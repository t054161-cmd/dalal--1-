/* ═══════════════════════════════════════════════════════════════════
   مِداد | MIDĀD — router, language, interaction.
   ═══════════════════════════════════════════════════════════════════ */
import { t, pair, setLang, getLang, applyLang, isAr, n } from './i18n.js';
import {
  db, load, save, uid, GENRES, bookById, listingById, closeArchive,
  addBook, updateBook, removeBook, addNote, addListing,
  toggleSaved, addRequest, setRequestStatus, setProfileName,
} from './data.js';
import { esc, icon, bi, toast, openModal, closeModal, modalOpen, bTitle, genre, solid } from './ui.js';
import { hallSVG } from './hall.js';
import { signUp, signIn, signOut, currentReader, renameReader, rememberCloudProfile } from './account.js';
import { hydrate, reportTroubleTo } from './sync.js';
import { online, pullProfile, cloudSendReset, cloudSetPassword, adoptSession } from './cloud.js';
import * as store from './data.js';

import home from './views/home.js';
import library, { state as libState } from './views/library.js';
import bookView from './views/book.js';
import catalog, { state as catState } from './views/catalog.js';
import chronicles from './views/chronicles.js';
import marginalia, { state as mgState } from './views/marginalia.js';
import stats, { state as stState } from './views/stats.js';
import exchange, { state as exState } from './views/exchange.js';
import community from './views/community.js';
import cardView from './views/card.js';
import about from './views/about.js';
import researcher, { state as rsState } from './views/researcher.js';
import { ask } from './researcher.js';

/* ── navigation ───────────────────────────────────────────────────── */
/* Two groups: the rooms you read in, then the desk and the people.
   Eleven links is a lot for one list — the rule keeps it scannable. */
const NAV = [
  ['', 'nav.home', 'home'],
  ['library', 'nav.library', 'shelf'],
  ['catalog', 'nav.catalog', 'catalog'],
  ['chronicles', 'nav.chronicles', 'chron'],
  ['marginalia', 'nav.marginalia', 'margin'],
  ['stats', 'nav.stats', 'stats'],
  ['--'],
  ['researcher', 'nav.researcher', 'spark'],
  ['exchange', 'nav.exchange', 'swap'],
  ['community', 'nav.community', 'people'],
  ['card', 'nav.card', 'card'],
  ['about', 'nav.about', 'page'],
];

const view = document.getElementById('view');
const rail = document.getElementById('rail');
const railList = document.getElementById('railList');
const menuBtn = document.getElementById('menuBtn');
const scrim = document.getElementById('railScrim');

function renderReader() {
  const host = document.getElementById('railReader');
  if (!host) return;
  const r = currentReader();
  host.innerHTML = r
    ? `<div class="whois">
         <span class="whois__who">
           <span class="avatar">${esc((isAr() ? r.name.ar : r.name.en).trim().charAt(0))}</span>
           <span class="whois__name">
             <b>${esc(isAr() ? r.name.ar : r.name.en)}</b>
             <span>${esc(r.cloud ? t('ac.cloud') : t('ac.localOnly'))}</span>
           </span>
         </span>
         <button class="iconbtn" data-action="auth-out" aria-label="${esc(t('ac.signOut'))}" title="${esc(t('ac.signOut'))}">
           ${icon('out')}
         </button>
       </div>`
    : `<div class="whois whois--guest">
         <span class="whois__name"><b>${esc(t('ac.guest'))}</b></span>
         <span class="whois__acts">
           <button class="btn btn--sm btn--ghost" data-action="auth-in">${esc(t('ac.signIn'))}</button>
           <button class="btn btn--sm" data-action="auth-up">${esc(t('ac.signUp'))}</button>
         </span>
       </div>`;
}

function renderNav(active) {
  railList.innerHTML = NAV.map(([slug, key, ic]) => slug === '--'
    ? '<li class="rail__sep" aria-hidden="true"></li>'
    : `<li>
      <a class="rail__link" href="#/${slug}" ${active === slug ? 'aria-current="page"' : ''}>
        ${icon(ic)}${bi(key)}
      </a>
    </li>`).join('');
}

/* ── router ───────────────────────────────────────────────────────── */
function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  const [route, arg] = h.split('/');
  return { route: route || '', arg };
}

function render() {
  const { route, arg } = parse();
  let html;
  switch (route) {
    case 'library':     html = library(); break;
    case 'book':        html = bookView(arg); break;
    case 'catalog':     html = catalog(); break;
    case 'chronicles':  html = chronicles(); break;
    case 'marginalia':  html = marginalia(); break;
    case 'stats':       html = stats(); break;
    case 'exchange':    html = exchange(); break;
    case 'community':   html = community(); break;
    case 'card':        html = cardView(); break;
    case 'researcher':  html = researcher(); break;
    case 'about':       html = about(); break;
    case '':            html = home(); break;
    default:            location.hash = '#/'; return;
  }
  view.innerHTML = html;
  renderNav(route === 'book' ? 'library' : route);
  renderReader();
  closeDrawer();
}

/** Re-render the current view in place, keeping the scroll position. */
function refresh() {
  const y = window.scrollY;
  render();
  window.scrollTo({ top: y, behavior: 'auto' });
}

addEventListener('hashchange', () => {
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
  view.focus({ preventScroll: true });
});

/* ── theme: the lighting of the room, not a colour inversion ─────── */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const day = theme === 'day';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', day ? '#efe3cd' : '#0a0705');
  /* the drawn architecture is relit, not recoloured */
  const hall = document.getElementById('hall');
  hall.querySelector('.hall__svg')?.remove();
  hall.insertAdjacentHTML('afterbegin', hallSVG(theme));
  for (const el of document.querySelectorAll('[data-theme-toggle]')) {
    el.setAttribute('aria-label', t(day ? 'theme.toNight' : 'theme.toDay'));
    const lab = el.querySelector('.themebtn__lab');
    if (lab) lab.textContent = t(day ? 'theme.night' : 'theme.day');
  }
}
function switchTheme(theme) {
  load().theme = theme;
  save();
  applyTheme(theme);
}
const currentTheme = () => document.documentElement.dataset.theme || 'night';

/* ── language ─────────────────────────────────────────────────────── */
function switchLang(l) {
  setLang(l);
  load().lang = l;
  save();
  applyLang();
  applyTheme(currentTheme());   /* the switch labels are language-bound */
  refresh();
}

/* ── mobile drawer ────────────────────────────────────────────────── */
function openDrawer() {
  rail.classList.add('is-open');
  menuBtn.setAttribute('aria-expanded', 'true');
  scrim.hidden = false;
}
function closeDrawer() {
  rail.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  scrim.hidden = true;
}
menuBtn.addEventListener('click', () =>
  rail.classList.contains('is-open') ? closeDrawer() : openDrawer());
scrim.addEventListener('click', closeDrawer);

/* ═══════════════════════════ FORMS ════════════════════════════════ */
const genreOptions = (sel) =>
  GENRES.map((g) => `<option value="${g}"${g === sel ? ' selected' : ''}>${esc(t(`g.${g}`))}</option>`).join('');

const ratePicker = (r = 4) => `
  <div class="ratepick" data-rate="${r}">
    ${[1, 2, 3, 4, 5].map((i) => `
      <button type="button" data-action="rate" data-v="${i}" data-off="${i > r ? 1 : 0}"
              aria-label="${i} ${esc(t('w.of5'))}">${solid('star')}</button>`).join('')}
  </div>`;

function bookForm(b) {
  const v = b || {};
  return `
  <form class="form" data-form="book" data-id="${esc(v.id || '')}">
    <p class="form__hint">${esc(t('fm.bilingualHint'))}</p>
    <div class="form__row">
      <label class="field"><span>${esc(t('fm.titleAr'))}</span>
        <input class="input" name="titleAr" value="${esc(v.titleAr || '')}" dir="rtl" required /></label>
      <label class="field"><span>${esc(t('fm.titleEn'))}</span>
        <input class="input" name="titleEn" value="${esc(v.titleEn || '')}" dir="ltr" /></label>
    </div>
    <div class="form__row">
      <label class="field"><span>${esc(t('fm.authorAr'))}</span>
        <input class="input" name="authorAr" value="${esc(v.authorAr || '')}" dir="rtl" required /></label>
      <label class="field"><span>${esc(t('fm.authorEn'))}</span>
        <input class="input" name="authorEn" value="${esc(v.authorEn || '')}" dir="ltr" /></label>
    </div>
    <div class="form__row">
      <label class="field"><span>${esc(t('w.genre'))}</span>
        <select class="select" name="genre">${genreOptions(v.genre || 'novel')}</select></label>
      <label class="field"><span>${esc(t('w.bookLang'))}</span>
        <select class="select" name="bookLang">
          <option value="ar"${(v.lang || 'ar') === 'ar' ? ' selected' : ''}>${esc(t('w.arabic'))}</option>
          <option value="en"${v.lang === 'en' ? ' selected' : ''}>${esc(t('w.english'))}</option>
        </select></label>
      <label class="field"><span>${esc(t('w.pages'))}</span>
        <input class="input" name="pages" type="number" min="1" max="20000" value="${esc(v.pages || '')}" /></label>
      <label class="field"><span>${esc(t('w.finished'))}</span>
        <input class="input" name="finished" type="date" value="${esc(v.finished || new Date().toISOString().slice(0, 10))}" /></label>
    </div>
    <div class="field"><span>${esc(t('w.rating'))}</span>${ratePicker(v.rating ?? 4)}</div>
    <label class="field"><span>${esc(t('fm.why'))}</span>
      <textarea class="textarea" name="why" style="min-height:4rem">${esc(v.whyRating ? (isAr() ? v.whyRating.ar : v.whyRating.en) || '' : '')}</textarea></label>
    <label class="field"><span>${esc(t('fm.review'))}</span>
      <textarea class="textarea" name="review">${esc(v.review ? (isAr() ? v.review.ar : v.review.en) || '' : '')}</textarea></label>
    <label class="field"><span>${esc(t('fm.stayed'))}</span>
      <textarea class="textarea" name="stayed">${esc(v.stayed ? (isAr() ? v.stayed.ar : v.stayed.en) || '' : '')}</textarea></label>
    ${b ? '' : `
    <label class="field"><span>${esc(t('fm.quote'))} <span class="muted">(${esc(t('w.optional'))})</span></span>
      <textarea class="textarea" name="quote" style="min-height:4rem"></textarea></label>`}
    <div class="form__acts">
      ${b ? `<button type="button" class="btn btn--sm btn--ghost form__danger"
               data-action="delete-book" data-id="${esc(b.id)}">${icon('trash')}<span>${esc(t('w.delete'))}</span></button>` : ''}
      <span style="flex:1"></span>
      <button type="button" class="btn btn--ghost" data-close>${esc(t('w.cancel'))}</button>
      <button type="submit" class="btn btn--brass">${icon('check')}<span>${esc(t('w.save'))}</span></button>
    </div>
  </form>`;
}

function marginForm(bookId) {
  const books = [...db().books].sort((a, b) => new Date(b.finished) - new Date(a.finished));
  return `
  <form class="form" data-form="margin">
    <div class="form__row">
      <label class="field"><span>${esc(t('mg.kind'))}</span>
        <select class="select" name="kind">
          ${['note', 'quote', 'idea', 'stayed'].map((k) => `<option value="${k}">${esc(t('mg.' + k))}</option>`).join('')}
        </select></label>
      <label class="field"><span>${esc(t('mg.onBook'))} <span class="muted">(${esc(t('w.optional'))})</span></span>
        <select class="select" name="book">
          <option value="">—</option>
          ${books.map((b) => `<option value="${esc(b.id)}"${b.id === bookId ? ' selected' : ''}>${esc(bTitle(b))}</option>`).join('')}
        </select></label>
    </div>
    <label class="field"><span>${esc(t('mg.text'))}</span>
      <textarea class="textarea" name="text" required style="min-height:7rem"></textarea></label>
    <div class="form__acts">
      <button type="button" class="btn btn--ghost" data-close>${esc(t('w.cancel'))}</button>
      <button type="submit" class="btn btn--brass">${icon('quill')}<span>${esc(t('w.save'))}</span></button>
    </div>
  </form>`;
}

function offerForm() {
  return `
  <form class="form" data-form="offer">
    <p class="form__hint">${esc(t('ex.motto'))} — ${esc(t('fm.bilingualHint'))}</p>
    <div class="form__row">
      <label class="field"><span>${esc(t('fm.titleAr'))}</span><input class="input" name="titleAr" dir="rtl" required /></label>
      <label class="field"><span>${esc(t('fm.titleEn'))}</span><input class="input" name="titleEn" dir="ltr" /></label>
    </div>
    <div class="form__row">
      <label class="field"><span>${esc(t('fm.authorAr'))}</span><input class="input" name="authorAr" dir="rtl" required /></label>
      <label class="field"><span>${esc(t('fm.authorEn'))}</span><input class="input" name="authorEn" dir="ltr" /></label>
    </div>
    <div class="form__row">
      <label class="field"><span>${esc(t('w.genre'))}</span><select class="select" name="genre">${genreOptions('novel')}</select></label>
      <label class="field"><span>${esc(t('w.condition'))}</span>
        <select class="select" name="condition">
          <option value="new">${esc(t('ex.cond.new'))}</option>
          <option value="good" selected>${esc(t('ex.cond.good'))}</option>
          <option value="worn">${esc(t('ex.cond.worn'))}</option>
        </select></label>
      <label class="field"><span>${esc(t('w.language'))}</span>
        <select class="select" name="bookLang">
          <option value="ar">${esc(t('w.arabic'))}</option>
          <option value="en">${esc(t('w.english'))}</option>
        </select></label>
    </div>
    <label class="field"><span>${esc(t('fm.area'))}</span><input class="input" name="area" required /></label>
    <label class="field"><span>${esc(t('ex.desc'))} <span class="muted">(${esc(t('w.optional'))})</span></span>
      <textarea class="textarea" name="desc" style="min-height:4rem"></textarea></label>
    <label class="field"><span>${esc(t('fm.wants'))}</span>
      <textarea class="textarea" name="wants" style="min-height:4rem"></textarea></label>
    <div class="form__acts">
      <button type="button" class="btn btn--ghost" data-close>${esc(t('w.cancel'))}</button>
      <button type="submit" class="btn btn--brass">${icon('swap')}<span>${esc(t('ex.offer'))}</span></button>
    </div>
  </form>`;
}

function deskForm(mode = 'in') {
  const up = mode === 'up';

  /* ask for a recovery link */
  if (mode === 'forgot') {
    return `
    <form class="form ledger__form" data-form="auth" data-mode="forgot">
      <p class="ledger__lede">${esc(t('ac.resetLede'))}</p>
      <label class="field"><span>${esc(t('ac.email'))}</span>
        <input class="input" name="email" type="email" dir="ltr" required autocomplete="username" /></label>
      <div class="form__acts">
        <button type="button" class="btn btn--ghost" data-action="auth-swap" data-mode="in">
          ${esc(t('ac.signIn'))}
        </button>
        <button type="submit" class="btn btn--brass">${icon('card')}<span>${esc(t('ac.resetSend'))}</span></button>
      </div>
    </form>`;
  }

  /* arrived back from the emailed link: choose a new password */
  if (mode === 'renew') {
    return `
    <form class="form ledger__form" data-form="auth" data-mode="renew">
      <p class="ledger__lede">${esc(t('ac.newLede'))}</p>
      <label class="field"><span>${esc(t('ac.newPassword'))}</span>
        <input class="input" name="password" type="password" dir="ltr" required
               minlength="8" autocomplete="new-password" /></label>
      <div class="form__acts">
        <button type="submit" class="btn btn--brass">${icon('check')}<span>${esc(t('ac.newSave'))}</span></button>
      </div>
    </form>`;
  }

  return `
  <form class="form ledger__form" data-form="auth" data-mode="${mode}">
    <p class="ledger__lede">${esc(t('ac.deskSub'))}</p>
    ${up ? `
    <div class="form__row">
      <label class="field"><span>${esc(t('ac.nameAr'))}</span>
        <input class="input" name="nameAr" dir="rtl" autocomplete="name" /></label>
      <label class="field"><span>${esc(t('ac.nameEn'))}</span>
        <input class="input" name="nameEn" dir="ltr" autocomplete="name" /></label>
    </div>` : ''}
    <label class="field"><span>${esc(t('ac.email'))}</span>
      <input class="input" name="email" type="email" dir="ltr" required
             autocomplete="${up ? 'email' : 'username'}" /></label>
    <label class="field"><span>${esc(t('ac.password'))}</span>
      <input class="input" name="password" type="password" dir="ltr" required
             autocomplete="${up ? 'new-password' : 'current-password'}" /></label>

    <p class="ledger__note">${icon('lock')}<span>${esc(t('ac.local'))}</span></p>

    <div class="form__acts">
      <button type="button" class="btn btn--ghost" data-action="auth-swap" data-mode="${up ? 'in' : 'up'}">
        ${esc(up ? t('ac.haveAccount') : t('ac.noAccount'))}
      </button>
      ${up ? '' : `<button type="button" class="btn btn--ghost" data-action="auth-swap" data-mode="forgot">
        ${esc(t('ac.forgot'))}
      </button>`}
      <button type="submit" class="btn btn--brass">${icon('card')}<span>${esc(up ? t('ac.signUp') : t('ac.signIn'))}</span></button>
    </div>
  </form>`;
}

function nameForm() {
  const p = db().profile;
  return `
  <form class="form" data-form="name">
    <div class="form__row">
      <label class="field"><span>${esc(t('lc.name'))} — ${esc(t('w.arabic'))}</span>
        <input class="input" name="ar" dir="rtl" value="${esc(p.name.ar)}" required /></label>
      <label class="field"><span>${esc(t('lc.name'))} — ${esc(t('w.english'))}</span>
        <input class="input" name="en" dir="ltr" value="${esc(p.name.en)}" /></label>
    </div>
    <div class="form__acts">
      <button type="button" class="btn btn--ghost" data-close>${esc(t('w.cancel'))}</button>
      <button type="submit" class="btn btn--brass">${icon('check')}<span>${esc(t('w.save'))}</span></button>
    </div>
  </form>`;
}

/* ── form submission ──────────────────────────────────────────────── */
function bilingual(value) {
  /* one field, written in the reader's language; the other side stays empty
     and every view falls back to whichever side exists. */
  return isAr() ? { ar: value, en: '' } : { ar: '', en: value };
}

document.addEventListener('submit', async (e) => {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  e.preventDefault();
  const f = Object.fromEntries(new FormData(form).entries());
  const kind = form.dataset.form;

  if (kind === 'book') {
    if (!f.titleAr?.trim() || !f.authorAr?.trim()) { toast(t('fm.required')); return; }
    const rating = +(form.querySelector('.ratepick')?.dataset.rate ?? 4);
    const patch = {
      titleAr: f.titleAr.trim(), titleEn: (f.titleEn || '').trim(),
      authorAr: f.authorAr.trim(), authorEn: (f.authorEn || '').trim(),
      genre: f.genre, lang: f.bookLang === 'en' ? 'en' : 'ar', pages: +f.pages || 0, rating,
      finished: f.finished || new Date().toISOString().slice(0, 10),
      review: bilingual((f.review || '').trim()),
      whyRating: bilingual((f.why || '').trim()),
      stayed: bilingual((f.stayed || '').trim()),
    };
    const id = form.dataset.id;
    if (id) {
      updateBook(id, patch);
      toast(t('bk.saved'));
      closeModal(); refresh();
    } else {
      const b = { id: uid('b'), ...patch, quotes: [], ideas: [], notes: [], added: new Date().toISOString().slice(0, 10) };
      if ((f.quote || '').trim()) b.quotes.push({ ...bilingual(f.quote.trim()), page: 0 });
      addBook(b);
      toast(t('bk.saved'));
      closeModal();
      location.hash = `#/book/${b.id}`;
    }
    return;
  }

  if (kind === 'margin') {
    if (!f.text?.trim()) return;
    addNote({
      id: uid('m'), kind: f.kind, book: f.book || null,
      text: bilingual(f.text.trim()), at: new Date().toISOString().slice(0, 10),
    });
    toast(t('mg.added'));
    closeModal();
    if (parse().route === 'marginalia') refresh(); else location.hash = '#/marginalia';
    return;
  }

  if (kind === 'offer') {
    if (!f.titleAr?.trim() || !f.authorAr?.trim()) { toast(t('fm.required')); return; }
    const p = db().profile;
    addListing({
      id: uid('x'), mine: true, owner: { ar: p.name.ar, en: p.name.en },
      titleAr: f.titleAr.trim(), titleEn: (f.titleEn || '').trim(),
      authorAr: f.authorAr.trim(), authorEn: (f.authorEn || '').trim(),
      genre: f.genre, condition: f.condition, bookLang: f.bookLang,
      area: bilingual((f.area || '').trim()), status: 'available',
      desc: (f.desc || '').trim() ? bilingual(f.desc.trim()) : null,
      wants: (f.wants || '').trim() ? bilingual(f.wants.trim()) : null,
    });
    toast(t('ex.listed'));
    closeModal();
    exState.tab = 'mine';
    if (parse().route === 'exchange') refresh(); else location.hash = '#/exchange';
    return;
  }

  if (kind === 'auth' && form.dataset.mode === 'forgot') {
    try {
      await cloudSendReset(f.email, `${location.origin}${location.pathname}`);
    } catch { /* the reply is identical either way, on purpose */ }
    closeModal();
    toast(t('ac.resetSent'));     /* never reveals whether the address is registered */
    return;
  }

  if (kind === 'auth' && form.dataset.mode === 'renew') {
    try {
      await cloudSetPassword(recoveryToken, f.password);
    } catch {
      toast(t('ac.resetExpired'));
      return;
    }
    recoveryToken = null;
    closeModal();
    toast(t('ac.newDone'));
    location.hash = '#/card';
    refresh();
    if (online()) {
      const how = await hydrate(store);
      if (how === 'downloaded' || how === 'uploaded') { await rememberMintedCard(); refresh(); }
    }
    return;
  }

  if (kind === 'auth') {
    const up = form.dataset.mode === 'up';
    const res = up
      ? await signUp({ email: f.email, password: f.password, nameAr: f.nameAr, nameEn: f.nameEn })
      : await signIn({ email: f.email, password: f.password });
    if (res.error) {
      const msg = { fields: 'ac.errFields', short: 'ac.errShort', taken: 'ac.errTaken',
                    nouser: 'ac.errNoUser', wrong: 'ac.errWrong',
                    confirm: 'ac.errConfirm', server: 'ac.errServer' }[res.error] || 'ac.errServer';
      toast(t(msg));
      return;
    }
    closeArchive();                 /* the other drawer opens */
    setLang(load().lang || getLang());
    applyLang();
    applyTheme(load().theme === 'day' ? 'day' : 'night');
    closeModal();
    toast(res.fellBack ? t('ac.fellBack') : t(up ? 'ac.welcome' : 'ac.welcomeBack'));
    location.hash = '#/card';
    refresh();

    /* bring the shelves down from the cloud, or carry this device's up */
    if (online()) {
      const how = await hydrate(store);
      if (how === 'downloaded' || how === 'uploaded') {
        await rememberMintedCard();
        toast(t(how === 'uploaded' ? 'ac.uploaded' : 'ac.downloaded'));
        refresh();
      }
    }
    return;
  }

  if (kind === 'ask') {
    const q = (f.q || '').trim();
    if (!q) return;
    rsState.thread.push({ role: 'you', text: q });
    rsState.thread.push({ role: 'desk', ...ask(q) });
    refresh();
    const thread = document.getElementById('deskThread');
    if (thread) thread.scrollTop = thread.scrollHeight;
    document.getElementById('deskInput')?.focus();
    return;
  }

  if (kind === 'name') {
    setProfileName((f.ar || '').trim(), (f.en || '').trim());
    renameReader((f.ar || '').trim(), (f.en || '').trim());
    toast(t('lc.nameSaved'));
    closeModal(); refresh();
  }
});

/* ═══════════════════════ INTERACTION ══════════════════════════════ */
document.addEventListener('click', (e) => {
  /* language */
  if (e.target.closest('[data-lang-toggle]')) {
    switchLang(getLang() === 'ar' ? 'en' : 'ar');
    return;
  }
  if (e.target.closest('[data-theme-toggle]')) {
    switchTheme(currentTheme() === 'day' ? 'night' : 'day');
    return;
  }
  /* modal dismissal */
  if (e.target.closest('[data-close]')) { closeModal(); return; }

  /* open a book's archive */
  const bookBtn = e.target.closest('[data-book]');
  if (bookBtn) { location.hash = `#/book/${bookBtn.dataset.book}`; return; }

  const act = e.target.closest('[data-action]');
  if (!act) return;
  const { action, id } = act.dataset;

  switch (action) {
    /* ── the archive ── */
    case 'add-book':
      openModal(t('fm.addTitle'), bookForm(null)); break;
    case 'edit-book':
      openModal(t('fm.editTitle'), bookForm(bookById(id))); break;
    case 'delete-book':
      if (confirm(t('bk.confirmDel'))) {
        removeBook(id); closeModal(); toast(t('bk.deleted')); location.hash = '#/library';
      }
      break;
    case 'add-margin':
      openModal(t('mg.add'), marginForm(id)); break;
    case 'edit-name':
      openModal(t('lc.editName'), nameForm()); break;
    case 'auth-in':  openModal(t('ac.desk'), deskForm('in')); break;
    case 'auth-up':  openModal(t('ac.desk'), deskForm('up')); break;
    case 'auth-swap': {
      const mode = act.dataset.mode;
      openModal(t(mode === 'forgot' ? 'ac.resetTitle' : 'ac.desk'), deskForm(mode));
      break;
    }
    case 'auth-out':
      signOut(); closeArchive();
      setLang(load().lang || getLang()); applyLang();
      applyTheme(load().theme === 'day' ? 'day' : 'night');
      toast(t('ac.signedOut'));
      location.hash = '#/'; refresh();
      break;

    /* ── rating picker ── */
    case 'rate': {
      const pick = act.closest('.ratepick');
      pick.dataset.rate = act.dataset.v;
      pick.querySelectorAll('[data-action="rate"]').forEach((btn) => {
        btn.dataset.off = +btn.dataset.v > +act.dataset.v ? 1 : 0;
      });
      break;
    }

    /* ── my library ── */
    case 'lib-reset': libState.genre = 'all'; libState.lang = 'all'; refresh(); break;
    case 'lib-lang': libState.lang = act.dataset.lang; refresh(); break;

    /* ── catalog ── */
    case 'cat-drawer':
      catState.drawer = catState.drawer === act.dataset.genre ? null : act.dataset.genre;
      refresh(); break;
    case 'cat-lang': catState.lang = act.dataset.lang; refresh(); break;
    case 'cat-clear':
      catState.q = ''; catState.drawer = null; catState.minRating = 0;
      catState.year = 'all'; catState.lang = 'all';
      refresh(); break;

    /* ── marginalia ── */
    case 'mg-kind': mgState.kind = act.dataset.kind; mgState.shown = 24; refresh(); break;
    case 'mg-more': mgState.shown += 24; refresh(); break;

    /* ── the research desk ── */
    case 'rs-ask': {
      const q = act.dataset.q;
      rsState.thread.push({ role: 'you', text: q });
      rsState.thread.push({ role: 'desk', ...ask(q) });
      refresh();
      const thread = document.getElementById('deskThread');
      if (thread) thread.scrollTop = thread.scrollHeight;
      break;
    }
    case 'rs-clear': rsState.thread = []; toast(t('rs.cleared')); refresh(); break;

    /* ── statistics ── */
    case 'st-scale': stState.scale = act.dataset.scale; refresh(); break;

    /* ── exchange ── */
    case 'ex-tab': exState.tab = act.dataset.tab; refresh(); break;
    case 'ex-offer': openModal(t('fm.offerTitle'), offerForm()); break;
    case 'ex-save': toast(toggleSaved(id) ? t('ex.savedOk') : t('ex.unsave')); refresh(); break;
    case 'ex-request': addRequest(id, 'out'); toast(t('ex.reqSent')); refresh(); break;
    case 'ex-accept': setRequestStatus(id, 'accepted'); toast(t('ex.reqAccepted')); refresh(); break;
    case 'ex-decline': setRequestStatus(id, 'declined'); toast(t('ex.reqDeclined'));
      { const s = db(); s.requests = s.requests.filter((r) => r.id !== id); save(); } refresh(); break;
    case 'ex-complete': setRequestStatus(id, 'completed'); toast(t('ex.reqDone')); refresh(); break;
  }
});

/* selects and the catalog search field */
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  switch (el.dataset.action) {
    case 'lib-sort':   libState.sort = el.value; refresh(); break;
    case 'lib-genre':  libState.genre = el.value; refresh(); break;
    case 'cat-rating': catState.minRating = +el.value; refresh(); break;
    case 'cat-year':   catState.year = el.value; refresh(); break;
    case 'st-year':    stState.year = +el.value; refresh(); break;
  }
});

let qTimer;
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-action="cat-q"]');
  if (!el) return;
  catState.q = el.value;
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    refresh();
    const box = document.getElementById('catQ');
    if (box) { box.focus(); box.setSelectionRange(box.value.length, box.value.length); }
  }, 220);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalOpen()) closeModal();
    else if (rail.classList.contains('is-open')) closeDrawer();
  }
});

/* ═══════════════ dust motes in the shafts of light ════════════════ */
function motes() {
  const cv = document.getElementById('motes');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  let w, h, parts = [];
  const dpr = Math.min(devicePixelRatio || 1, 2);

  const resize = () => {
    w = cv.width = innerWidth * dpr;
    h = cv.height = innerHeight * dpr;
    const count = innerWidth < 700 ? 26 : 60;
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 0.9 + 0.25) * dpr,
      vy: -(Math.random() * 0.16 + 0.03) * dpr,
      vx: (Math.random() - 0.5) * 0.12 * dpr,
      a: Math.random() * 0.26 + 0.05,
      p: Math.random() * Math.PI * 2,
    }));
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  let raf;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const m of parts) {
      m.y += m.vy; m.x += m.vx + Math.sin(m.p += 0.006) * 0.14 * dpr;
      if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
      /* motes are brighter near the nave, where the light falls */
      const centre = 1 - Math.min(1, Math.abs(m.x / w - 0.5) * 2.1);
      ctx.globalAlpha = m.a * (0.25 + centre * 0.75);
      ctx.fillStyle = '#ffd9a2';
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.284); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  };
  draw();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else draw();
  });
}

/** The library card is minted by the database; cache it so the rail can
 *  draw the reader's name and member number without a round trip. */
async function rememberMintedCard() {
  const r = currentReader();
  if (!r?.cloud) return;
  try {
    const minted = await pullProfile();
    if (minted) rememberCloudProfile(r.id, minted);
  } catch { /* the rail falls back to the name from the session */ }
}

/* a mirror that fails says so once, and never blocks the reader */
reportTroubleTo(() => toast(t('ac.offline')));

/* The recovery email returns the reader to the site with a one-time token in
   the address bar. Read it before the router runs, because the router rewrites
   the hash and would discard it. */
let recoveryToken = null;
(function catchRecoveryLink() {
  const raw = location.hash.slice(1);
  if (!raw.includes('access_token=') || !raw.includes('type=recovery')) return;
  const p = new URLSearchParams(raw);
  recoveryToken = p.get('access_token');
  adoptSession({
    access_token: recoveryToken,
    refresh_token: p.get('refresh_token'),
    user: null,
  });
  history.replaceState(null, '', location.pathname + location.search);  /* keep it out of history */
})();

/* ═══════════════════════════ BOOT ═════════════════════════════════ */
setLang(load().lang || 'ar');
applyLang();
applyTheme(load().theme === 'day' ? 'day' : 'night');
if (!location.hash) location.hash = '#/';
render();
motes();

if (recoveryToken) openModal(t('ac.newTitle'), deskForm('renew'));

/* a reader who is still signed in from last time gets their shelves back */
if (online()) {
  hydrate(store).then((how) => {
    if (how === 'downloaded') { rememberMintedCard().then(refresh); }
  });
}
