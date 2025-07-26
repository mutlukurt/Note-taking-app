class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentNote = null;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        this.initializeElements();
        this.bindEvents();
        this.loadNotes();
        this.applyTheme();
        this.updateUI();
    }

    initializeElements() {
        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.notesList = document.getElementById('notesList');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.sidebarToggle = document.getElementById('sidebarToggle');

        // Main content elements
        this.mainContent = document.getElementById('mainContent');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.welcomeNewNoteBtn = document.getElementById('welcomeNewNoteBtn');
        this.noteEditor = document.getElementById('noteEditor');
        this.noteTitle = document.getElementById('noteTitle');
        this.noteContent = document.getElementById('noteContent');
        this.saveNote = document.getElementById('saveNote');
        this.deleteNote = document.getElementById('deleteNote');
        this.contentTitle = document.getElementById('contentTitle');
    }

    bindEvents() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Sidebar toggle (mobile)
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Search
        this.searchInput.addEventListener('input', (e) => this.searchNotes(e.target.value));
        
        // New note buttons
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.welcomeNewNoteBtn.addEventListener('click', () => this.createNewNote());
        
        // Note editor
        this.noteTitle.addEventListener('input', () => this.autoSave());
        this.noteContent.addEventListener('input', () => this.autoSave());
        this.saveNote.addEventListener('click', () => this.saveCurrentNote());
        this.deleteNote.addEventListener('click', () => this.deleteCurrentNote());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        const icon = this.themeToggle.querySelector('i');
        
        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            icon.className = 'fas fa-moon';
        } else {
            body.classList.remove('dark-mode');
            icon.className = 'fas fa-sun';
        }
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    createNewNote() {
        const newNote = {
            id: Date.now(),
            title: 'Yeni Not',
            content: '',
            date: new Date().toLocaleString('tr-TR')
        };
        
        this.notes.unshift(newNote);
        this.saveToStorage();
        this.loadNotes();
        this.selectNote(newNote.id);
        this.showNotification('Yeni not oluşturuldu!', 'success');
    }

    selectNote(noteId) {
        this.currentNote = this.notes.find(note => note.id === noteId);
        
        if (this.currentNote) {
            // Update active state in sidebar
            document.querySelectorAll('.note-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeItem = document.querySelector(`[data-note-id="${noteId}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
            
            // Update editor
            this.noteTitle.value = this.currentNote.title;
            this.noteContent.value = this.currentNote.content;
            
            // Show editor, hide welcome screen
            this.welcomeScreen.classList.add('hidden');
            this.noteEditor.classList.remove('hidden');
            
            // Update content title
            this.contentTitle.innerHTML = `
                <h2>${this.currentNote.title}</h2>
                <p>Son düzenleme: ${this.currentNote.date}</p>
            `;
            
            // Focus on title
            this.noteTitle.focus();
        }
    }

    autoSave() {
        if (this.currentNote) {
            this.currentNote.title = this.noteTitle.value;
            this.currentNote.content = this.noteContent.value;
            this.currentNote.date = new Date().toLocaleString('tr-TR');
            
            // Update in notes array
            const index = this.notes.findIndex(note => note.id === this.currentNote.id);
            if (index !== -1) {
                this.notes[index] = this.currentNote;
            }
            
            this.saveToStorage();
            this.loadNotes(); // Refresh sidebar
            this.updateContentTitle();
        }
    }

    saveCurrentNote() {
        if (this.currentNote) {
            this.autoSave();
            this.showNotification('Not kaydedildi!', 'success');
        }
    }

    deleteCurrentNote() {
        if (this.currentNote) {
            if (confirm('Bu notu silmek istediğinizden emin misiniz?')) {
                this.notes = this.notes.filter(note => note.id !== this.currentNote.id);
                this.saveToStorage();
                this.loadNotes();
                this.showWelcomeScreen();
                this.showNotification('Not silindi!', 'success');
            }
        }
    }

    updateContentTitle() {
        if (this.currentNote) {
            this.contentTitle.innerHTML = `
                <h2>${this.currentNote.title}</h2>
                <p>Son düzenleme: ${this.currentNote.date}</p>
            `;
        }
    }

    showWelcomeScreen() {
        this.currentNote = null;
        this.welcomeScreen.classList.remove('hidden');
        this.noteEditor.classList.add('hidden');
        this.contentTitle.innerHTML = `
            <h2>Hoş Geldiniz</h2>
            <p>Not almaya başlamak için sol taraftan bir not seçin veya yeni not oluşturun.</p>
        `;
    }

    searchNotes(query) {
        const noteItems = document.querySelectorAll('.note-item');
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        
        noteItems.forEach(item => {
            const noteId = parseInt(item.dataset.noteId);
            const isVisible = filteredNotes.some(note => note.id === noteId);
            item.style.display = isVisible ? 'block' : 'none';
        });
        
        // Show/hide empty state
        this.emptyState.style.display = 
            query && filteredNotes.length === 0 ? 'block' : 'none';
    }

    loadNotes() {
        this.notesList.innerHTML = '';
        
        if (this.notes.length === 0) {
            this.emptyState.style.display = 'block';
            this.showWelcomeScreen();
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        this.notes.forEach(note => {
            const noteItem = this.createNoteItem(note);
            this.notesList.appendChild(noteItem);
        });
    }

    createNoteItem(note) {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.dataset.noteId = note.id;
        
        const preview = note.content.length > 100 
            ? note.content.substring(0, 100) + '...' 
            : note.content;
        
        noteItem.innerHTML = `
            <div class="note-item-title">${note.title}</div>
            <div class="note-item-preview">${preview || 'Boş not'}</div>
            <div class="note-item-date">${note.date}</div>
        `;
        
        noteItem.addEventListener('click', () => this.selectNote(note.id));
        
        return noteItem;
    }

    saveToStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    updateUI() {
        if (this.notes.length === 0) {
            this.showWelcomeScreen();
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N: New note
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewNote();
        }
        
        // Ctrl/Cmd + S: Save note
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveCurrentNote();
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            this.searchInput.focus();
        }
        
        // Escape: Clear search or go back
        if (e.key === 'Escape') {
            if (this.searchInput.value) {
                this.searchInput.value = '';
                this.searchNotes('');
            } else if (this.currentNote) {
                this.showWelcomeScreen();
            }
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--warning-color)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});