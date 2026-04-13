/* ============================================================
   TASKLY — APP.JS
   Sections:
   1. State & Storage
   2. Rendering
   3. Task CRUD (Create / Read / Update / Delete)
   4. Filters & Stats
   5. Theme Toggle
   6. Modal
   7. Event Listeners
   8. Initialisation
============================================================ */


/* ── 1. State & Storage ───────────────────────────────────── */

// The key we use to store tasks in localStorage
const STORAGE_KEY = 'taskly_tasks';
const THEME_KEY   = 'taskly_theme';

// Our in-memory task array — kept in sync with localStorage
let tasks = [];

// Which filter is currently active: 'all' | 'pending' | 'completed'
let currentFilter = 'all';

// ID of the task being edited (null when modal is closed)
let editingTaskId = null;

/**
 * Load tasks from localStorage into the tasks array.
 * Falls back to an empty array if nothing is stored yet.
 */
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}

/**
 * Persist the current tasks array to localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Generate a simple unique ID using timestamp + random number.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}


/* ── 2. Rendering ─────────────────────────────────────────── */

/**
 * Build a single task <li> element from a task object.
 * @param {Object} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}`;
  li.dataset.id       = task.id;
  li.dataset.priority = task.priority;

  // ── Due date formatting ─────────────────────────────────
  let dueDateHTML = '';
  if (task.dueDate) {
    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    const due      = new Date(task.dueDate + 'T00:00:00');
    const isOver   = !task.completed && due < today;
    const label    = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    dueDateHTML = `<span class="due-badge${isOver ? ' overdue' : ''}">
                    📅 ${isOver ? 'Overdue · ' : ''}${label}
                   </span>`;
  }

  // ── Priority badge ──────────────────────────────────────
  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  const priorityHTML  = `<span class="priority-badge ${task.priority}">${priorityLabel}</span>`;

  // ── Inner HTML ──────────────────────────────────────────
  li.innerHTML = `
    <input
      type="checkbox"
      class="task-checkbox"
      aria-label="Mark as completed"
      ${task.completed ? 'checked' : ''}
    />
    <div class="task-body">
      <p class="task-name">${escapeHTML(task.name)}</p>
      <div class="task-meta">
        ${priorityHTML}
        ${dueDateHTML}
      </div>
    </div>
    <div class="task-actions">
      <button class="action-btn edit-btn"   title="Edit task"   aria-label="Edit">✏️</button>
      <button class="action-btn delete-btn" title="Delete task" aria-label="Delete">🗑️</button>
    </div>
  `;

  // Attach interaction handlers directly on the element
  const checkbox  = li.querySelector('.task-checkbox');
  const editBtn   = li.querySelector('.edit-btn');
  const deleteBtn = li.querySelector('.delete-btn');

  checkbox.addEventListener('change', () => toggleComplete(task.id));
  editBtn .addEventListener('click',  () => openEditModal(task.id));
  deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

  return li;
}

/**
 * Re-render the visible task list based on the current filter.
 * Also updates stats and the empty state placeholder.
 */
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  // Decide which tasks to show
  const visible = getFilteredTasks();

  if (visible.length === 0) {
    showEmptyState(true);
  } else {
    showEmptyState(false);
    visible.forEach(task => {
      list.appendChild(createTaskElement(task));
    });
  }

  updateStats();
}

/**
 * Show or hide the empty-state placeholder.
 */
function showEmptyState(show) {
  const el = document.getElementById('emptyState');
  el.classList.toggle('visible', show);
}

/**
 * Sanitise user input to prevent XSS.
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/* ── 3. Task CRUD ─────────────────────────────────────────── */

/**
 * Create and save a new task from the form inputs.
 */
function addTask() {
  const nameInput     = document.getElementById('taskInput');
  const dueDateInput  = document.getElementById('dueDateInput');
  const priorityInput = document.getElementById('priorityInput');

  const name = nameInput.value.trim();

  // Validate: name must not be empty
  if (!name) {
    nameInput.classList.add('shake');
    nameInput.focus();
    setTimeout(() => nameInput.classList.remove('shake'), 400);
    return;
  }

  const newTask = {
    id:        generateId(),
    name:      name,
    completed: false,
    dueDate:   dueDateInput.value  || null,
    priority:  priorityInput.value || 'medium',
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);   // newest first
  saveTasks();
  renderTasks();

  // Reset form fields
  nameInput.value     = '';
  dueDateInput.value  = '';
  priorityInput.value = 'medium';
  nameInput.focus();
}

/**
 * Toggle the completed status of a task by ID.
 */
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

/**
 * Delete a task, playing an exit animation first.
 * @param {string} id  - task ID
 * @param {HTMLElement} li - the list-item element
 */
function deleteTask(id, li) {
  // Trigger the CSS exit animation
  li.classList.add('removing');

  // Wait for animation, then remove from data + re-render
  li.addEventListener('animationend', () => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }, { once: true });
}

/**
 * Apply edits from the modal to the task in the array.
 */
function saveEdit() {
  const nameInput     = document.getElementById('editTaskInput');
  const dueDateInput  = document.getElementById('editDueDateInput');
  const priorityInput = document.getElementById('editPriorityInput');

  const name = nameInput.value.trim();

  if (!name) {
    nameInput.classList.add('shake');
    nameInput.focus();
    setTimeout(() => nameInput.classList.remove('shake'), 400);
    return;
  }

  const task = tasks.find(t => t.id === editingTaskId);
  if (!task) return;

  task.name     = name;
  task.dueDate  = dueDateInput.value  || null;
  task.priority = priorityInput.value || 'medium';

  saveTasks();
  renderTasks();
  closeEditModal();
}

/**
 * Clear all tasks that are marked completed.
 */
function clearCompleted() {
  const count = tasks.filter(t => t.completed).length;
  if (count === 0) return;
  if (!confirm(`Remove ${count} completed task${count > 1 ? 's' : ''}?`)) return;
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}


/* ── 4. Filters & Stats ───────────────────────────────────── */

/**
 * Return the subset of tasks matching the current filter.
 */
function getFilteredTasks() {
  switch (currentFilter) {
    case 'pending':   return tasks.filter(t => !t.completed);
    case 'completed': return tasks.filter(t =>  t.completed);
    default:          return tasks;
  }
}

/**
 * Update sidebar stats and the progress bar.
 */
function updateStats() {
  const total     = tasks.length;
  const done      = tasks.filter(t => t.completed).length;
  const pending   = total - done;
  const pct       = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('statTotal').textContent   = total;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statDone').textContent    = done;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% complete';
}

/**
 * Switch the active filter and re-render.
 * @param {string} filter - 'all' | 'pending' | 'completed'
 */
function setFilter(filter) {
  currentFilter = filter;

  // Update sidebar button highlight
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  // Update list heading
  const headings = { all: 'All Tasks', pending: 'Pending', completed: 'Completed' };
  document.getElementById('listHeading').textContent = headings[filter] || 'Tasks';

  renderTasks();
}


/* ── 5. Theme Toggle ──────────────────────────────────────── */

/**
 * Toggle between light and dark theme.
 */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';

  html.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeButtons(next);
}

/**
 * Sync the theme icon and label to the current theme.
 * @param {string} theme - 'light' | 'dark'
 */
function updateThemeButtons(theme) {
  const isDark = theme === 'dark';
  document.getElementById('themeIcon').textContent   = isDark ? '☀️' : '🌙';
  document.getElementById('themeLabel').textContent  = isDark ? 'Light Mode' : 'Dark Mode';
  document.getElementById('themeToggleMobile').textContent = isDark ? '☀️' : '🌙';
}

/**
 * Load and apply the saved theme on startup.
 */
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButtons(saved);
}


/* ── 6. Modal ─────────────────────────────────────────────── */

/**
 * Open the edit modal, pre-filling fields from the task data.
 * @param {string} id - task ID to edit
 */
function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editingTaskId = id;

  document.getElementById('editTaskInput').value     = task.name;
  document.getElementById('editDueDateInput').value  = task.dueDate  || '';
  document.getElementById('editPriorityInput').value = task.priority || 'medium';

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('editTaskInput').focus();
}

/**
 * Close the edit modal and reset state.
 */
function closeEditModal() {
  editingTaskId = null;
  document.getElementById('modalOverlay').classList.remove('open');
}


/* ── 7. Event Listeners ───────────────────────────────────── */

// Add task on button click
document.getElementById('addTaskBtn').addEventListener('click', addTask);

// Add task on Enter key inside the name field
document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// Filter sidebar buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// Theme toggles (sidebar + mobile)
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme);

// Clear completed
document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);

// Modal: save
document.getElementById('modalSaveBtn').addEventListener('click', saveEdit);

// Modal: cancel
document.getElementById('modalCancelBtn').addEventListener('click', closeEditModal);

// Modal: Save on Enter key
document.getElementById('editTaskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveEdit();
});

// Modal: close on overlay background click
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeEditModal();
});

// Modal: close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEditModal();
});


/* ── 8. Initialisation ────────────────────────────────────── */

/**
 * Display today's date in the subtitle.
 */
function displayDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('dateDisplay').textContent =
    new Date().toLocaleDateString('en-US', options);
}

/**
 * Boot the app.
 */
function init() {
  loadTheme();   // Apply saved theme before anything renders
  loadTasks();   // Pull tasks from localStorage
  displayDate(); // Show today's date
  renderTasks(); // Paint the UI
}

// Kick off when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
