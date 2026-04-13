/* ============================================================
   app.js — Application entry point
   Runs after all other scripts are loaded.
   Bootstraps the UI and wires up form buttons.
   ============================================================ */

(function init() {

  /* ── 1. Build static UI parts ───────────────────────────── */
  buildCategorySelect();   // populate <select> in note form
  renderFilterTabs();      // category tabs in the toolbar
  renderSidebar();         // sidebar category list + stats
  renderNotes();           // initial note grid


  /* ── 2. "New note" button ───────────────────────────────── */
  document.getElementById('newNoteBtn').addEventListener('click', () => {
    openForm(); // open form in create mode (no note passed)
  });


  /* ── 3. Form buttons ────────────────────────────────────── */

  // Save
  document.getElementById('saveNoteBtn').addEventListener('click', saveNote);

  // Cancel
  document.getElementById('cancelFormBtn').addEventListener('click', closeForm);

  // Close (✕) icon in form header
  document.getElementById('closeFormBtn').addEventListener('click', closeForm);

  // Click on the dark overlay (outside the form card) closes the form
  document.getElementById('noteFormOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('noteFormOverlay')) {
      closeForm();
    }
  });


  /* ── 4. Keyboard shortcuts ──────────────────────────────── */
  document.addEventListener('keydown', (e) => {

    // Escape → close the form
    if (e.key === 'Escape') {
      closeForm();
    }

    // Ctrl/Cmd + K → focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }

    // Ctrl/Cmd + Enter → save note (when form is open)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const overlay = document.getElementById('noteFormOverlay');
      if (overlay.classList.contains('open')) {
        saveNote();
      }
    }

  });


  /* ── 5. Console welcome message ─────────────────────────── */
  console.log('%c Notely ✔ App loaded', 'color:#5c6bc0;font-weight:bold;font-size:14px');

})();
