/* ============================================================
   search.js — Search / filter logic
   Wires up the search input to the note renderer.
   ============================================================ */

(function initSearch() {
  const input      = document.getElementById('searchInput');
  const clearBtn   = document.getElementById('clearSearch');

  /* Live search as the user types */
  input.addEventListener('input', () => {
    const query = input.value.trim();

    // Show or hide the clear (✕) button
    clearBtn.hidden = query.length === 0;

    // Re-render notes with the current query
    renderNotes(query);
  });

  /* Pressing Escape in the search box clears it */
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') clearSearch();
  });

  /* Clear button click */
  clearBtn.addEventListener('click', clearSearch);

  /** Reset the search field and refresh the grid */
  function clearSearch() {
    input.value = '';
    clearBtn.hidden = true;
    renderNotes('');
    input.focus();
  }

  // Hide the clear button initially
  clearBtn.hidden = true;
})();
