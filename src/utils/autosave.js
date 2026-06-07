// Automatic local autosave to IndexedDB so a refresh, crash, or accidental tab
// close doesn't lose unsaved work.
//
// IndexedDB is used instead of localStorage because the guide state holds
// File/Blob objects (uploaded images & videos): IndexedDB stores them natively
// via structured clone (no base64 needed) and has a far larger storage quota.

const DB_NAME = 'welcome-guide-builder';
const STORE = 'autosave';
const KEY = 'current';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Persist the current state. Returns the save timestamp (ms) or null on failure.
export async function saveAutosave(data) {
  try {
    const db = await openDb();
    const savedAt = Date.now();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ data, savedAt }, KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return savedAt;
  } catch (err) {
    console.error('Autosave failed:', err);
    return null;
  }
}

// Load the last autosaved record, or null if none exists.
// Returns { data, savedAt } so the caller can show when it was saved.
export async function loadAutosave() {
  try {
    const db = await openDb();
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return record;
  } catch (err) {
    console.error('Loading autosave failed:', err);
    return null;
  }
}

// Remove the autosaved record (used on Reset).
export async function clearAutosave() {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.error('Clearing autosave failed:', err);
  }
}
