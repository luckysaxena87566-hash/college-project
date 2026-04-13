/* ============================================================
   notes.js — Note CRUD operations and card rendering
   ============================================================ */

/* ── Note colour palette (must match CSS variables) ────────── */
const NOTE_COLORS = [
  { id: 'white',  label: 'White',  hex: '#ffffff' },
  { id: 'yellow', label: 'Yellow', hex: '#fff9c4' },
  { id: 'blue',   label: 'Blue',   hex: '#e3f2fd' },
  { id: 'green',  label: 'Green',  hex: '#e8f5e9' },
  { id: 'pink',   label: 'Pink',   hex: '#fce4ec' },
  { id: 'purple', label: 'Purple', hex: '#ede7f6' },
  { id: 'orange', label: 'Orange', hex: '#fff3e0' },
];

/* Track which colour is selected in the form */
let selectedColor = 'white';

/* Track which note is being edited (null = creating new) */
let editingNoteId = null;


/* ══════════════════════════════════════════════════════════
   FORM HELPERS
══════════════════════════════════════════════════════════ */

/** Build the colour swatch buttons inside the form */
function buildColorPicker() {
  const picker = document.getElementById('colorPicker');
  picker.innerHTML = '';

  NOTE_COLORS.forEach(color => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-swatch' + (color.id === selectedColor ? ' selected' : '');
    btn.style.background = color.hex;
    btn.dataset.color = color.id;
    btn.title = color.label;
    btn.setAttribute('aria-label', color.label);

    btn.addEventListener('click', () => {
      // Deselect all, then select clicked one
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      btn.classList.add('selected');
      selectedColor = color.id;
    });

    picker.appendChild(btn);
  });
}

/** Open the note form (create mode or edit mode) */
function openForm(note = null) {
  editingNoteId = note ? note.id : null;
  selectedColor = note ? note.color : 'white';

  // Update form heading
  document.getElementById('formTitle').textContent = note ? 'Edit note' : 'New note';

  // Populate fields
  document.getElementById('noteTitleInput').value = note ? note.title : '';
  document.getElementById('noteBodyInput').value  = note ? note.body  : '';
  document.getElementById('noteCategoryInput').value = note
    ? note.category
    : (activeCategory !== 'all' ? activeCategory : 'personal');

  // Rebuild colour picker with correct selection
  buildColorPicker();

  // Show overlay with animation
  document.getElementById('noteFormOverlay').classList.add('open');
  setTimeout(() => document.getElementById('noteTitleInput').focus(), 100);
}

/** Close the form overlay */
function closeForm() {
  document.getElementById('noteFormOverlay').classList.remove('open');
  editingNoteId = null;
}


/* ══════════════════════════════════════════════════════════
   CRUD OPERATIONS
══════════════════════════════════════════════════════════ */

/** Generate a short unique id */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Format a Date object into a readable string e.g. "Apr 13, 10:45 AM" */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day:   'numeric',
    hour:  'numeric',
    minute: '2-digit',
  });
}

/** Save note from form (handles both create and update) */
function saveNote() {
  const title    = document.getElementById('noteTitleInput').value.trim();
  const body     = document.getElementById('noteBodyInput').value.trim();
  const category = document.getElementById('noteCategoryInput').value;

  // Require at least a title or body
  if (!title && !body) {
    document.getElementById('noteTitleInput').focus();
    document.getElementById('noteTitleInput').style.borderColor = 'var(--color-danger)';
    setTimeout(() => {
      document.getElementById('noteTitleInput').style.borderColor = '';
    }, 1500);
    return;
  }

  let notes = storageGet(STORAGE_KEYS.NOTES, []);

  if (editingNoteId) {
    /* ── UPDATE existing note ── */
    notes = notes.map(n => {
      if (n.id !== editingNoteId) return n;
      return { ...n, title, body, category, color: selectedColor, updatedAt: new Date().toISOString() };
    });
  } else {
    /* ── CREATE new note ── */
    const newNote = {
      id:        generateId(),
      title,
      body,
      category,
      color:     selectedColor,
      pinned:    false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote); // add at the top
  }

  storageSet(STORAGE_KEYS.NOTES, notes);
  closeForm();
  renderNotes();
  renderSidebar();
}

/** Toggle the pinned state of a note */
function togglePin(id) {
  let notes = storageGet(STORAGE_KEYS.NOTES, []);
  notes = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
  storageSet(STORAGE_KEYS.NOTES, notes);
  renderNotes();
  renderSidebar();
}

/** Delete a note (with exit animation) */
function deleteNote(id) {
  const card = document.getElementById('note-' + id);
  if (card) {
    // Trigger CSS exit animation
    card.classList.add('removing');
    // Wait for animation, then actually remove from data
    setTimeout(() => {
      let notes = storageGet(STORAGE_KEYS.NOTES, []);
      notes = notes.filter(n => n.id !== id);
      storageSet(STORAGE_KEYS.NOTES, notes);
      renderNotes();
      renderSidebar();
    }, 200);
  }
}


/* ══════════════════════════════════════════════════════════
   RENDERING
══════════════════════════════════════════════════════════ */

/**
 * Build the HTML for a single note card.
 * We build as a string for performance (no sub-element queries needed).
 */
function buildNoteCard(note) {
  // Look up background colour from palette
  const colorEntry = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];
  const bg = colorEntry.hex;

  // Pin button appearance
  const pinClass = 'note-card__pin' + (note.pinned ? ' pinned' : '');
  const pinTitle = note.pinned ? 'Unpin note' : 'Pin note';

  // Category badge
  const catLabel = getCategoryLabel(note.category);

  // Date display (prefer updatedAt if different)
  const displayDate = formatDate(note.updatedAt || note.createdAt);

  // Truncate empty title placeholder
  const titleHTML = note.title
    ? `<span class="note-card__title">${escapeHtml(note.title)}</span>`
    : `<span class="note-card__title note-card__title--empty">Untitled</span>`;

  return `
    <div
      class="note-card${note.pinned ? ' pinned' : ''}"
      id="note-${note.id}"
      style="background: ${bg};"
    >
      <!-- Header: title + pin -->
      <div class="note-card__head">
        ${titleHTML}
        <button class="${pinClass}" onclick="togglePin('${note.id}')" title="${pinTitle}">📌</button>
      </div>

      <!-- Body text -->
      ${note.body
        ? `<p class="note-card__body">${escapeHtml(note.body)}</p>`
        : ''}

      <!-- Footer: category + date + action buttons -->
      <div class="note-card__foot">
        <span class="category-badge">${catLabel}</span>
        <span class="note-card__date">${displayDate}</span>
        <div class="note-card__actions">
          <button class="card-btn" onclick="openForm(${JSON.stringify(note).replace(/"/g, '&quot;')})" title="Edit note">✏️</button>
          <button class="card-btn card-btn--delete" onclick="deleteNote('${note.id}')" title="Delete note">🗑️</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Main render function — filters notes and paints the grid.
 * Called whenever data changes or filters change.
 */
function renderNotes(searchQuery = '') {
  const grid     = document.getElementById('notesGrid');
  const empty    = document.getElementById('emptyState');
  let   notes    = storageGet(STORAGE_KEYS.NOTES, []);

  /* ── 1. Filter by category ── */
  if (activeCategory !== 'all') {
    notes = notes.filter(n => n.category === activeCategory);
  }

  /* ── 2. Filter by search query ── */
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q)
    );
  }

  /* ── 3. Sort: pinned notes first, then by updatedAt desc ── */
  notes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return  1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  /* ── 4. Render ── */
  if (notes.length === 0) {
    grid.innerHTML  = '';
    empty.style.display = '';
  } else {
    empty.style.display = 'none';

    const pinned  = notes.filter(n => n.pinned);
    const others  = notes.filter(n => !n.pinned);

    let html = '';

    // Render pinned section with label divider
    if (pinned.length > 0) {
      html += `<div class="pin-divider">📌 Pinned</div>`;
      html += pinned.map(buildNoteCard).join('');
    }

    // Render "others" section
    if (others.length > 0) {
      if (pinned.length > 0) {
        html += `<div class="other-divider">Others</div>`;
      }
      html += others.map(buildNoteCard).join('');
    }

    grid.innerHTML = html;
  }
}


/* ── Utility: escape HTML to prevent XSS ────────────────── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
