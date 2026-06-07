// Save / load the full builder state to a single .guide.json project file.
//
// The state contains File/Blob objects (uploaded images & videos) which JSON
// cannot represent. We walk the whole data tree and convert any File/Blob into
// a tagged object carrying a base64 data URL, then reverse the process on load.
// Because the walk is generic, it automatically covers every image field
// (images.*, customSections[].coverImage / galleryImages / video, nearby[].image)
// and any image fields added in the future.

import { saveAs } from 'file-saver';

const FORMAT = 'digital-welcome-guide';
const VERSION = 1;

// --- File <-> tagged-object helpers -------------------------------------------

function fileToTagged(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ __file: true, name: file.name || 'file', type: file.type || '', dataUrl: reader.result });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function taggedToFile(tag) {
  const [, base64 = ''] = String(tag.dataUrl).split(',');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], tag.name || 'file', { type: tag.type || '' });
}

// --- Deep walk ----------------------------------------------------------------

async function deepSerialize(value) {
  if (value instanceof File || value instanceof Blob) return fileToTagged(value);
  if (Array.isArray(value)) return Promise.all(value.map(deepSerialize));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = await deepSerialize(v);
    return out;
  }
  return value;
}

function deepDeserialize(value) {
  if (value && typeof value === 'object' && value.__file === true && typeof value.dataUrl === 'string') {
    return taggedToFile(value);
  }
  if (Array.isArray(value)) return value.map(deepDeserialize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepDeserialize(v);
    return out;
  }
  return value;
}

// --- Public API ---------------------------------------------------------------

function safeFileName(data) {
  const base = (data.propertyName || 'welcome-guide')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'welcome-guide'}.guide.json`;
}

function parseProject(text) {
  const payload = JSON.parse(text);
  // Accept either { format, version, data } or a bare data object.
  const raw = payload && payload.data ? payload.data : payload;
  return deepDeserialize(raw);
}

// Save the current state. Uses the File System Access API (folder picker +
// re-saveable file) when available, otherwise falls back to a normal download.
export async function saveProject(data) {
  const serial = await deepSerialize(data);
  const payload = { format: FORMAT, version: VERSION, savedAt: new Date().toISOString(), data: serial };
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const filename = safeFileName(data);

  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'Welcome Guide Project', accept: { 'application/json': ['.json'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (err) {
      if (err && err.name === 'AbortError') return false; // user cancelled
      // Any other failure → fall through to download.
    }
  }

  saveAs(blob, filename);
  return true;
}

// Prompt the user to pick a saved project and return the rehydrated data object
// (with real File instances restored). Returns null if the user cancels.
export async function openProject() {
  if (typeof window.showOpenFilePicker === 'function') {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'Welcome Guide Project', accept: { 'application/json': ['.json'] } }]
      });
      const file = await handle.getFile();
      return parseProject(await file.text());
    } catch (err) {
      if (err && err.name === 'AbortError') return null;
      throw err;
    }
  }

  // Fallback for browsers without the File System Access API.
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return resolve(null);
      try {
        resolve(parseProject(await file.text()));
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
}
