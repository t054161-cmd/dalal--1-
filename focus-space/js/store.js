/* ═══════════════════════════════════════════════════════════════════════
   STORE — language, favorites, recently viewed, profile and settings,
   persisted to localStorage. Location lives in memory only and is never
   requested before the visitor grants permission.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const NS = FS.CONFIG.ns;

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(NS + ':' + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(NS + ':' + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }
  function drop(key) {
    try { localStorage.removeItem(NS + ':' + key); } catch (e) { /* ignore */ }
  }

  const listeners = new Set();
  function emit(what) { listeners.forEach(fn => fn(what)); }

  const Store = {
    /* ── language ─────────────────────────────────────────────────── */
    lang: 'en',   /* resolved just below, from storage then browser locale */
    setLang(lang) {
      if (lang !== 'ar' && lang !== 'en') return;
      Store.lang = lang;
      write('lang', lang);
      emit('lang');
    },

    /* ── favorites ────────────────────────────────────────────────── */
    favorites: read('favorites', []),
    isFavorite(id) { return Store.favorites.indexOf(id) !== -1; },
    toggleFavorite(id) {
      const i = Store.favorites.indexOf(id);
      if (i === -1) Store.favorites.unshift(id); else Store.favorites.splice(i, 1);
      write('favorites', Store.favorites);
      emit('favorites');
      return i === -1;
    },

    /* ── recently viewed ──────────────────────────────────────────── */
    recents: read('recents', []),
    pushRecent(id) {
      Store.recents = [id].concat(Store.recents.filter(x => x !== id)).slice(0, 8);
      write('recents', Store.recents);
      emit('recents');
    },

    /* ── profile + settings ───────────────────────────────────────── */
    profile: Object.assign(
      { name: '', email: '', district: '', photo: '', notify: false, reduceMotion: false },
      read('profile', {})
    ),
    saveProfile(patch) {
      Object.assign(Store.profile, patch);
      write('profile', Store.profile);
      emit('profile');
    },

    /* ── location (memory only) ───────────────────────────────────── */
    coords: null,
    geoState: 'idle',   // idle | asking | granted | denied | error

    requestLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          Store.geoState = 'error'; emit('geo'); reject(new Error('unsupported')); return;
        }
        Store.geoState = 'asking'; emit('geo');
        navigator.geolocation.getCurrentPosition(
          pos => {
            Store.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            Store.geoState = 'granted';
            write('geoAllowed', true);
            emit('geo');
            resolve(Store.coords);
          },
          err => {
            Store.geoState = err && err.code === 1 ? 'denied' : 'error';
            if (Store.geoState === 'denied') drop('geoAllowed');
            emit('geo');
            reject(err);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
      });
    },

    /* Only re-reads position when the browser already holds a grant, so the
       visitor is never prompted on load. */
    resumeLocation() {
      if (!read('geoAllowed', false) || !navigator.permissions) return;
      navigator.permissions.query({ name: 'geolocation' })
        .then(p => { if (p.state === 'granted') Store.requestLocation().catch(() => {}); })
        .catch(() => {});
    },

    /* ── housekeeping ─────────────────────────────────────────────── */
    clearAll() {
      ['favorites', 'recents', 'profile', 'geoAllowed'].forEach(drop);
      Store.favorites = [];
      Store.recents = [];
      Store.profile = { name: '', email: '', district: '', photo: '', notify: false, reduceMotion: false };
      Store.coords = null;
      Store.geoState = 'idle';
      emit('all');
    },

    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };

  const saved = read('lang', null);
  Store.lang = saved || ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en');

  FS.Store = Store;
})(window.FS);
