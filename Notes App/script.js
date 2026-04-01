

class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.getElementById('addNote').addEventListener('click', () => this.addOrUpdateNote());
        document.getElementById('noteInput').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addOrUpdateNote();
            }
        });
        document.getElementById('clearAll').addEventListener('click', () => this.clearAllNotes());
        document.getElementById('noteInput').addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }

    addOrUpdateNote() {
        const input = document.getElementById('noteInput');
        const text = input.value.trim();
        
        if (!text) {
            alert('Please write something! 📝');
            return;
        }

        if (this.currentEditId !== null) {
            
            const noteIndex = this.notes.findIndex(note => note.id === this.currentEditId);
            this.notes[noteIndex].content = text;
            this.notes[noteIndex].updatedAt = new Date().toISOString();
            this.currentEditId = null;
            document.getElementById('addNote').textContent = 'Add Note';
            document.getElementById('noteInput').placeholder = 'Write your note here... (Supports markdown-like formatting)';
        } else {
            
            const newNote = {
                id: Date.now(),
                content: text,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.notes.unshift(newNote); 
        }

        input.value = '';
        this.saveNotes();
        this.render();
        this.autoResizeTextarea();
    }

    deleteNote(id) {
        if (confirm('Delete this note? 🗑️')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.render();
        }
    }

    editNote(id) {
        const noteIndex = this.notes.findIndex(note => note.id === id);
        const note = this.notes[noteIndex];
        this.currentEditId = id;
        document.getElementById('noteInput').value = note.content;
        document.getElementById('addNote').textContent = 'Save Changes';
        document.getElementById('noteInput').placeholder = 'Edit your note...';
        document.getElementById('noteInput').focus();
        this.autoResizeTextarea();
        
        
        document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    }

    cancelEdit() {
        this.currentEditId = null;
        document.getElementById('noteInput').value = '';
        document.getElementById('addNote').textContent = 'Add Note';
        document.getElementById('noteInput').placeholder = 'Write your note here... (Supports markdown-like formatting)';
        this.render();
    }

    clearAllNotes() {
        if (this.notes.length === 0 || confirm('Clear ALL notes? This cannot be undone! ⚠️')) {
            this.notes = [];
            this.currentEditId = null;
            document.getElementById('noteInput').value = '';
            document.getElementById('addNote').textContent = 'Add Note';
            this.saveNotes();
            this.render();
        }
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    render() {
        const notesList = document.getElementById('notesList');
        const noNotes = document.getElementById('noNotes');

        if (this.notes.length === 0) {
            notesList.innerHTML = '';
            noNotes.style.display = 'block';
            return;
        }

        noNotes.style.display = 'none';

        notesList.innerHTML = this.notes.map(note => {
            const createdDate = new Date(note.createdAt).toLocaleDateString();
            const updatedDate = new Date(note.updatedAt).toLocaleDateString();
            const dateInfo = note.createdAt === note.updatedAt 
                ? `<small>Created: ${createdDate}</small>`
                : `<small>Created: ${createdDate} | Updated: ${updatedDate}</small>`;

            return `
                <div class="note-card ${this.currentEditId === note.id ? 'editing' : ''}" data-id="${note.id}">
                    <div class="note-content">${this.formatNoteContent(note.content)}</div>
                    <div style="font-size: 0.85em; color: #6c757d; margin-bottom: 15px;">${dateInfo}</div>
                    <div class="note-actions">
                        <button class="btn-small btn-edit" onclick="app.editNote(${note.id})">✏️ Edit</button>
                        <button class="btn-small btn-delete" onclick="app.deleteNote(${note.id})">🗑️ Delete</button>
                        ${this.currentEditId === note.id ? 
                            '<button class="btn-small btn-cancel" onclick="app.cancelEdit()">❌ Cancel</button>' : 
                            ''
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    formatNoteContent(content) {
        
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('noteInput');
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(textarea.scrollHeight, 120) + 'px';
    }
}


const app = new NotesApp();


setInterval(() => {
    if (app.currentEditId !== null && document.getElementById('noteInput').value.trim()) {
        app.addOrUpdateNote();
    }
}, 30000);
