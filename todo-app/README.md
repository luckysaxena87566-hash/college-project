# ✦ Taskly — Personal Todo App

A clean, modern, and fully interactive Todo List web app built with **vanilla HTML, CSS, and JavaScript** — no frameworks or dependencies required.

---

## 📁 File Structure

```
todo-app/
├── index.html   → App structure & layout
├── style.css    → All styles, themes & animations
├── app.js       → All logic (CRUD, filters, storage)
└── README.md    → This file
```

---

## ✨ Features

| Feature | Details |
|---|---|
| ✅ Add Tasks | Type a name, pick a date & priority, press Enter or click Add |
| ✏️ Edit Tasks | Opens a smooth modal dialog |
| 🗑️ Delete Tasks | Animated slide-out removal |
| ☑️ Complete Tasks | Checkbox with strike-through effect |
| 💾 LocalStorage | Tasks survive page refresh |
| 🌙 Dark Mode | Toggle in sidebar or top-right on mobile |
| 📅 Due Dates | Overdue tasks shown in red |
| 🎯 Priority | High / Medium / Low with colour-coded badges |
| 🔍 Filters | All / Pending / Completed |
| 📊 Stats | Total, pending, done + progress bar |
| 📱 Responsive | Works on mobile and desktop |

---

## 🚀 How to Use

1. **Open `index.html`** in any modern browser — no server needed.
2. Type a task name in the input field.
3. Optionally set a due date and priority.
4. Press **Enter** or click **Add Task**.
5. Click the checkbox to complete, ✏️ to edit, 🗑️ to delete.
6. Use the sidebar filters to switch views.
7. Toggle dark mode with the moon/sun button.

---

## 🛠️ Customisation Tips

- **Accent colour**: Change `--accent` in `:root` inside `style.css`.
- **Fonts**: Replace the Google Fonts links in `index.html`.
- **Default priority**: Change `<option value="medium" selected>` in `index.html`.

---

## 🌐 Browser Support

Works in all modern browsers: Chrome, Firefox, Edge, Safari.
