/* ═══════════════════════════════════════════════════════════════════
   SYNC — the archive lives in the browser and is mirrored to Supabase.

   The local copy stays the working copy, so every view, filter and
   statistic keeps reading from one fast, synchronous source and none of
   the UI had to change. This module carries changes upward and, on
   signing in, brings the reader's shelves down.

   When the network fails the reader is told once and keeps working;
   nothing is lost, because the local copy is authoritative until the
   next successful pull.
   ═══════════════════════════════════════════════════════════════════ */
import { online } from './cloud.js';
import * as cloud from './cloud.js';

let onTrouble = () => {};
/** The UI registers here so a failed mirror can surface once, quietly. */
export const reportTroubleTo = (fn) => { onTrouble = fn; };

let warned = false;
async function attempt(what, fn) {
  if (!online()) return;
  try { await fn(); warned = false; }
  catch (err) {
    console.warn(`[midad] could not mirror ${what}:`, err.message);
    if (!warned) { warned = true; onTrouble(err); }
  }
}

/* ── change mirrors, called by the store after it saves locally ───── */
export const mirror = {
  book:        (b)            => attempt('a book', () => cloud.pushBook(b)),
  bookRemoved: (id)           => attempt('a removal', () => cloud.removeBookRow(id)),
  note:        (n)            => attempt('a note', () => cloud.pushNote(n)),
  listing:     (l)            => attempt('a listing', () => cloud.pushListing(l)),
  request:     (exchangeId)   => attempt('a request', () => cloud.pushRequest(exchangeId)),
  requestSet:  (id, status)   => attempt('a request', () => cloud.setRequestRow(id, status)),
  listingSet:  (id, status)   => attempt('a listing', () => cloud.setListingStatus(id, status)),
  profile:     (p)            => attempt('the profile', () => cloud.pushProfile(p)),
};

/**
 * Called once after signing in.
 *  - a cloud archive with nothing in it takes a copy of what is on this
 *    device, so a reader's first sign-in carries their shelves with them
 *  - otherwise the cloud wins, and this device catches up
 * Returns 'uploaded' | 'downloaded' | 'offline'.
 */
export async function hydrate(store) {
  if (!online()) return 'offline';
  try {
    if (await cloud.cloudIsEmpty()) {
      const local = store.db();
      for (const b of local.books) await cloud.pushBook(b);
      for (const n of local.notes) {
        await cloud.pushNote({ kind: n.kind, bookId: n.book || null, text: n.text });
      }
      for (const l of local.listings.filter((x) => x.mine)) await cloud.pushListing(l);
      /* the cloud minted the card at signup; adopt it rather than overwrite it */
      const minted = await cloud.pullProfile();
      if (minted) store.replaceArchive({ profile: minted });
      return 'uploaded';
    }

    const remote = await cloud.pullArchive();
    store.replaceArchive({
      books: remote.books,
      notes: remote.notes,
      listings: remote.listings,
      requests: remote.requests,
      saved: [],
      profile: remote.profile || store.db().profile,
    });
    return 'downloaded';
  } catch (err) {
    console.warn('[midad] could not reach the archive:', err.message);
    onTrouble(err);
    return 'offline';
  }
}
