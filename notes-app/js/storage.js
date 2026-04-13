/* ============================================================
   storage.js — localStorage helpers
   All read/write to localStorage goes through these functions
   so the rest of the app never touches localStorage directly.
   ============================================================ */

/**
 * Read and parse JSON from localStorage.
 * @param {string} key
 * @param {*} defaultValue - returned if key doesn't exist or parse fails
 */
function storageGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn('[storage] Failed to parse key:', key, e);
    return defaultValue;
  }
}

/**
 * Stringify and save a value to localStorage.
 * @param {string} key
 * @param {*} value - any JSON-serialisable value
 */
function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] Failed to save key:', key, e);
  }
}

/**
 * Remove an item from localStorage.
 * @param {string} key
 */
function storageRemove(key) {
  localStorage.removeItem(key);
}

/* ── Storage keys (constants so we don't typo them) ── */
const STORAGE_KEYS = {
  NOTES:    'notely_notes',
  DARK:     'notely_dark',
  CATEGORY: 'notely_active_category',
};
