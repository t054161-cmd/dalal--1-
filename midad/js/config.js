/* ═══════════════════════════════════════════════════════════════════
   Where MIDĀD keeps its archive.

   These two values are public by design. The key below is the
   *publishable* key: it identifies the project, and grants nothing on
   its own. What a holder of this key may read or write is decided
   entirely by the Row Level Security policies in the database — a
   signed-in reader reaches their own rows and no one else's. Never put
   a service-role or secret key in this file; it would ship to every
   visitor.

   Leave SUPABASE_URL empty to run MIDĀD entirely in the browser, with
   readers and archives kept in localStorage. Everything works either
   way; the cloud simply lets one reader carry their shelves between
   devices.
   ═══════════════════════════════════════════════════════════════════ */

/* A local Supabase (or a test double) can take over by setting
   window.MIDAD_CONFIG = { url, key } before the app loads. */
const override = globalThis.MIDAD_CONFIG || {};

export const SUPABASE_URL = override.url ?? 'https://qzeslfymitqctofvumlo.supabase.co';
export const SUPABASE_KEY = override.key ?? 'sb_publishable_PUKhNkfuHGt31O8fopiBqg_HkM4a7Uj';

/** The cloud is optional; this says whether it has been wired up. */
export const cloudConfigured = () => Boolean(SUPABASE_URL && SUPABASE_KEY);
