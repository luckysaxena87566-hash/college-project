
/* ── state ── */
let tasks = JSON.parse(localStorage.getItem('tl_tasks') || '[]');
let filter = 'all';
let dark = localStorage.getItem('tl_dark') === 'true';
let editingId = null;

/* ── dark mode ── */
function applyDark() {
  document.getElementById('app').dataset.dark = dark;
  document.body.dataset.dark = dark;
  document.getElementById('darkToggle').textContent = dark ? '☀' : '☽';
  localStorage.setItem('tl_dark', dark);
}
document.getElementById('darkToggle').onclick = () => { dark = !dark; applyDark(); };
applyDark();

/* ── helpers ── */
function save() { localStorage.setItem('tl_tasks', JSON.stringify(tasks)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function today() { return new Date().toISOString().split('T')[0]; }
function fmtDate(d) {
  if (!d) return '';
  const [y,m,day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function isOverdue(d) { return d && d < today(); }

/* ── add task ── */
function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  if (!text) { document.getElementById('taskInput').focus(); return; }
  tasks.unshift({
    id: uid(), text,
    done: false,
    priority: document.getElementById('prioritySelect').value,
    due: document.getElementById('dueDateInput').value,
    created: Date.now()
  });
  document.getElementById('taskInput').value = '';
  save(); render();
}
document.getElementById('taskInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

/* ── toggle done ── */
function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; save(); render(); }
}

/* ── delete ── */
function deleteTask(id) {
  const el = document.getElementById('ti-' + id);
  if (el) {
    el.classList.add('removing');
    setTimeout(() => { tasks = tasks.filter(t => t.id !== id); save(); render(); }, 200);
  }
}

/* ── edit ── */
function startEdit(id) {
  editingId = id; render();
  setTimeout(() => { const el = document.getElementById('edit-'+id); if(el){el.focus();el.select();} }, 20);
}
function saveEdit(id) {
  const el = document.getElementById('edit-'+id);
  if (!el) return;
  const val = el.value.trim();
  if (val) { const t = tasks.find(t=>t.id===id); if(t) t.text=val; }
  editingId = null; save(); render();
}
function onEditKey(e, id) {
  if (e.key === 'Enter') saveEdit(id);
  if (e.key === 'Escape') { editingId = null; render(); }
}

/* ── filter ── */
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

/* ── priority label ── */
function pClass(p) { return p === 'high' ? 'p-high' : p === 'low' ? 'p-low' : 'p-medium'; }
function pLabel(p) { return p.charAt(0).toUpperCase() + p.slice(1); }

/* ── render ── */
function render() {
  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.done;
    if (filter === 'pending') return !t.done;
    return true;
  });
  const list = document.getElementById('taskList');
  const empty = document.getElementById('emptyMsg');
  const count = document.getElementById('taskCount');

  const pending = tasks.filter(t => !t.done).length;
  count.textContent = `${pending} pending · ${tasks.length} total`;

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = '';
  } else {
    empty.style.display = 'none';
    list.innerHTML = filtered.map(t => {
      const overdue = isOverdue(t.due) && !t.done;
      return `
        <div class="task-item${t.done?' done':''}" id="ti-${t.id}">
          <div class="task-check" onclick="toggleDone('${t.id}')" title="${t.done?'Mark pending':'Mark done'}">
            <svg viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="2,6 5,9 10,3"/>
            </svg>
          </div>
          <div class="task-body">
            ${editingId === t.id
              ? `<input class="task-edit" id="edit-${t.id}" value="${t.text.replace(/"/g,'&quot;')}" onblur="saveEdit('${t.id}')" onkeydown="onEditKey(event,'${t.id}')" />`
              : `<div class="task-text">${t.text}</div>`
            }
            <div class="task-meta">
              <span class="priority-badge ${pClass(t.priority)}">${pLabel(t.priority)}</span>
              ${t.due ? `<span class="due-label${overdue?' overdue':''}">${overdue?'Overdue — ':'Due '}${fmtDate(t.due)}</span>` : ''}
            </div>
          </div>
          <div class="task-actions">
            <button class="act-btn" onclick="startEdit('${t.id}')" title="Edit">✎</button>
            <button class="act-btn del" onclick="deleteTask('${t.id}')" title="Delete">✕</button>
          </div>
        </div>`;
    }).join('');
  }
}

render();
