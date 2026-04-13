/* ============================================================
   categories.js — Category data, sidebar rendering, and filtering
   ============================================================ */

/* ── Built-in categories ─────────────────────────────────── */
/* Each category has a unique id, a display name, and an emoji icon */
const CATEGORIES = [
  { id: 'all',      label: 'All notes',  icon: '🗂️' },
  { id: 'personal', label: 'Personal',   icon: '🧑' },
  { id: 'work',     label: 'Work',       icon: '💼' },
  { id: 'ideas',    label: 'Ideas',      icon: '💡' },
  { id: 'study',    label: 'Study',      icon: '📚' },
  { id: 'health',   label: 'Health',     icon: '🏃' },
  { id: 'shopping', label: 'Shopping',   icon: '🛒' },
];

/* Currently selected category (persisted in localStorage) */
let activeCategory = storageGet(STORAGE_KEYS.CATEGORY, 'all');


/* ── Build the <select> options inside the note form ──────── */
function buildCategorySelect() {
  const select = document.getElementById('noteCategoryInput');
  select.innerHTML = ''; // clear any existing options

  // Skip the 'all' pseudo-category — it's not a real category to assign
  CATEGORIES.filter(c => c.id !== 'all').forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `${cat.icon} ${cat.label}`;
    select.appendChild(opt);
  });
}


/* ── Render sidebar category list ────────────────────────── */
function renderSidebar() {
  const list    = document.getElementById('categoryList');
  const notes   = storageGet(STORAGE_KEYS.NOTES, []);
  const stats   = document.getElementById('sidebarStats');

  list.innerHTML = '';

  CATEGORIES.forEach(cat => {
    // Count how many notes belong to this category
    const count = cat.id === 'all'
      ? notes.length
      : notes.filter(n => n.category === cat.id).length;

    const li = document.createElement('li');
    li.className = 'sidebar__item' + (cat.id === activeCategory ? ' active' : '');
    li.dataset.category = cat.id;
    li.innerHTML = `
      <span>${cat.icon} ${cat.label}</span>
      <span class="sidebar__badge">${count}</span>
    `;

    // Click → switch active category and re-render notes
    li.addEventListener('click', () => {
      activeCategory = cat.id;
      storageSet(STORAGE_KEYS.CATEGORY, activeCategory);
      renderSidebar();           // update sidebar highlights
      renderNotes();             // update note grid
      renderFilterTabs();        // keep tabs in sync
    });

    list.appendChild(li);
  });

  // Quick stats section
  const pinned = notes.filter(n => n.pinned).length;
  stats.innerHTML = `
    <div class="stat-row">
      <span>Total notes</span>
      <span class="stat-row__value">${notes.length}</span>
    </div>
    <div class="stat-row">
      <span>Pinned</span>
      <span class="stat-row__value">${pinned}</span>
    </div>
  `;
}


/* ── Get the label for a given category id ───────────────── */
function getCategoryLabel(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? `${cat.icon} ${cat.label}` : id;
}

/* ── Filter tab rendering (mirrors categories in the toolbar) */
function renderFilterTabs() {
  const container = document.getElementById('filterTabs');
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab' + (cat.id === activeCategory ? ' active' : '');
    btn.textContent = cat.label;
    btn.dataset.category = cat.id;

    btn.addEventListener('click', () => {
      activeCategory = cat.id;
      storageSet(STORAGE_KEYS.CATEGORY, activeCategory);
      renderFilterTabs();
      renderSidebar();
      renderNotes();
    });

    container.appendChild(btn);
  });
}
