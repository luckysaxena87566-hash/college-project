/* ============================================================
   darkmode.js — Dark mode toggle
   Reads / writes preference to localStorage.
   ============================================================ */

(function initDarkMode() {
  const btn  = document.getElementById('darkToggle');
  const icon = document.getElementById('darkIcon');

  /* Apply the saved preference on load */
  const isDark = storageGet(STORAGE_KEYS.DARK, false);
  if (isDark) applyDark(true);

  /* Toggle on button click */
  btn.addEventListener('click', () => {
    const currentlyDark = document.body.classList.contains('dark-mode');
    applyDark(!currentlyDark);
  });

  /**
   * Enable or disable dark mode.
   * @param {boolean} dark
   */
  function applyDark(dark) {
    document.body.classList.toggle('dark-mode', dark);
    icon.textContent = dark ? '☀️' : '🌙';
    btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    storageSet(STORAGE_KEYS.DARK, dark);
  }
})();
