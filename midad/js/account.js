/* ═══════════════════════════════════════════════════════════════════
   THE REGISTRATION DESK — readers and their archives.

   HONEST SCOPE: MIDĀD has no server. An account here is a local reader
   profile: it separates one person's library from another's on THIS
   browser, and nothing more. The password is salted and hashed with
   SHA-256 rather than stored in the clear, but it protects nothing
   against anyone who can open the browser's storage — it is a
   name-plate on a drawer, not a lock. Every screen says so.
   ═══════════════════════════════════════════════════════════════════ */

const KEY = 'midad.readers.v1';

const blank = () => ({ readers: [], current: null });

export function loadReaders() {
  try { return { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return blank(); }
}
function saveReaders(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
}

export const currentReader = () => {
  const s = loadReaders();
  return s.readers.find((r) => r.id === s.current) || null;
};

/** Which archive the app should read: the signed-in reader's, or the guest shelf. */
export const archiveKey = () => {
  const r = currentReader();
  return r ? `midad.archive.${r.id}` : 'midad.archive.v1';
};

const normEmail = (e) => String(e || '').trim().toLowerCase();

async function digest(password, salt) {
  const data = new TextEncoder().encode(`${salt}::${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const newSalt = () =>
  [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');

/** A member number in the house style: year · four digits. */
const memberNo = () =>
  `${new Date().getFullYear()}·${String(Math.floor(1000 + Math.random() * 9000))}`;

export async function signUp({ email, password, nameAr, nameEn }) {
  const s = loadReaders();
  const mail = normEmail(email);
  if (!mail || !password) return { error: 'fields' };
  if (password.length < 6) return { error: 'short' };
  if (s.readers.some((r) => r.email === mail)) return { error: 'taken' };

  const salt = newSalt();
  const reader = {
    id: `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    email: mail,
    salt,
    hash: await digest(password, salt),
    name: { ar: (nameAr || '').trim() || 'قارئ مِداد', en: (nameEn || '').trim() || 'MIDĀD Reader' },
    member: memberNo(),
    since: new Date().getFullYear(),
    createdAt: new Date().toISOString().slice(0, 10),
  };
  s.readers.push(reader);
  s.current = reader.id;
  saveReaders(s);
  return { reader };
}

export async function signIn({ email, password }) {
  const s = loadReaders();
  const reader = s.readers.find((r) => r.email === normEmail(email));
  if (!reader) return { error: 'nouser' };
  if (await digest(password, reader.salt) !== reader.hash) return { error: 'wrong' };
  s.current = reader.id;
  saveReaders(s);
  return { reader };
}

export function signOut() {
  const s = loadReaders();
  s.current = null;
  saveReaders(s);
}

/** Rename the signed-in reader; the guest shelf keeps its name in the archive. */
export function renameReader(nameAr, nameEn) {
  const s = loadReaders();
  const r = s.readers.find((x) => x.id === s.current);
  if (!r) return false;
  r.name = { ar: nameAr || r.name.ar, en: nameEn || r.name.en };
  saveReaders(s);
  return true;
}
