/* ═══════════════════════════════════════════════════════════════════════
   AUTH — email and password accounts, on Supabase.

   The client is fetched only when it is needed, and if it cannot be
   fetched the site carries on exactly as it did before: spaces, filters,
   favorites and feedback all still work, they are simply kept on the
   device rather than in an account.
   ═══════════════════════════════════════════════════════════════════════ */
(function (FS) {
  'use strict';

  const CFG = (FS.CONFIG && FS.CONFIG.supabase) || {};
  const CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

  const listeners = new Set();
  const emit = () => listeners.forEach(fn => { try { fn(Auth); } catch (e) {} });

  /* Supabase speaks in English sentences; the interface speaks in two
     languages. Map the ones a person can actually cause. */
  function messageKey(error) {
    const m = ((error && error.message) || '').toLowerCase();
    if (m.includes('invalid login')) return 'auth.errCredentials';
    if (m.includes('already registered') || m.includes('already exists')) return 'auth.errTaken';
    if (m.includes('email not confirmed')) return 'auth.errUnconfirmed';
    if (m.includes('password should be')) return 'auth.errWeak';
    if (m.includes('rate limit') || m.includes('too many')) return 'auth.errRate';
    if (m.includes('failed to fetch') || m.includes('network')) return 'auth.errNetwork';
    return 'auth.errGeneric';
  }

  const Auth = {
    configured: !!(CFG.url && CFG.key),
    client: null,
    user: null,
    profile: null,        // public half + private half, merged
    state: 'loading',     // loading · out · in · unavailable

    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    isIn() { return Auth.state === 'in'; },
    email() { return Auth.user ? Auth.user.email : ''; },

    /* Load the client and restore any session already in this browser. */
    async start() {
      if (!Auth.configured) { Auth.state = 'unavailable'; emit(); return; }
      try {
        const mod = await import(CDN);
        Auth.client = mod.createClient(CFG.url, CFG.key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: FS.CONFIG.ns + ':auth'
          }
        });
      } catch (e) {
        Auth.state = 'unavailable';
        emit();
        return;
      }

      const { data } = await Auth.client.auth.getSession();
      await adopt(data && data.session);

      Auth.client.auth.onAuthStateChange((_event, session) => { adopt(session); });
    },

    async signUp({ email, password, name }) {
      if (!Auth.client) return { error: 'auth.errUnavailable' };
      const { data, error } = await Auth.client.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: (name || '').trim(), language: FS.Store.lang } }
      });
      if (error) return { error: messageKey(error) };
      /* With email confirmation on, there is a user but no session yet. */
      return { needsConfirmation: !data.session, user: data.user };
    },

    async signIn({ email, password }) {
      if (!Auth.client) return { error: 'auth.errUnavailable' };
      const { error } = await Auth.client.auth.signInWithPassword({
        email: email.trim(), password
      });
      return error ? { error: messageKey(error) } : {};
    },

    async signOut() {
      if (!Auth.client) return;
      await Auth.client.auth.signOut();
    },

    async resetPassword(email) {
      if (!Auth.client) return { error: 'auth.errUnavailable' };
      const { error } = await Auth.client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: location.origin + location.pathname + '#/profile'
      });
      return error ? { error: messageKey(error) } : {};
    },

    /* Write the customer's details back to the two profile tables. */
    async saveProfile(patch) {
      if (!Auth.client || !Auth.user) return { error: 'auth.errUnavailable' };
      const id = Auth.user.id;
      const pub = {}, priv = {};

      /* The interface knows districts by slug; the column holds their id. */
      if ('district_slug' in patch) {
        if (patch.district_slug) {
          const { data } = await Auth.client.from('districts')
            .select('id').eq('slug', patch.district_slug).maybeSingle();
          priv.preferred_district = (data && data.id) || null;
        } else {
          priv.preferred_district = null;
        }
      }

      if ('full_name' in patch) pub.full_name = patch.full_name || null;
      ['phone', 'preferred_district', 'language', 'theme', 'notify_offers', 'reduce_motion']
        .forEach(k => { if (k in patch) priv[k] = patch[k] === '' ? null : patch[k]; });

      if (Object.keys(pub).length) {
        const { error } = await Auth.client.from('profiles')
          .upsert(Object.assign({ id }, pub)).select().maybeSingle();
        if (error) return { error: messageKey(error) };
      }
      if (Object.keys(priv).length) {
        const { error } = await Auth.client.from('profile_private')
          .upsert(Object.assign({ id }, priv)).select().maybeSingle();
        if (error) return { error: messageKey(error) };
      }
      await loadProfile();
      emit();
      return {};
    }
  };

  async function adopt(session) {
    Auth.user = (session && session.user) || null;
    Auth.state = Auth.user ? 'in' : 'out';
    Auth.profile = null;
    if (Auth.user) await loadProfile();
    emit();
  }

  async function loadProfile() {
    if (!Auth.client || !Auth.user) return;
    const id = Auth.user.id;
    const [pub, priv] = await Promise.all([
      Auth.client.from('profiles').select('full_name, avatar_url').eq('id', id).maybeSingle(),
      Auth.client.from('profile_private')
        .select('email, phone, preferred_district, language, theme, notify_offers, reduce_motion')
        .eq('id', id).maybeSingle()
    ]);
    Auth.profile = Object.assign(
      { full_name: '', avatar_url: '', email: Auth.user.email, phone: '',
        preferred_district: null, language: FS.Store.lang, theme: null,
        notify_offers: false, reduce_motion: false },
      (pub && pub.data) || {},
      (priv && priv.data) || {}
    );
  }

  FS.Auth = Auth;
})(window.FS);
