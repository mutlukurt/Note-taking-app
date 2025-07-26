class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.renderNotes();
        this.updateEmptyState();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add note
        document.getElementById('addNote').addEventListener('click', () => {
            this.addNote();
        });

        // Clear form
        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchNotes(e.target.value);
        });

        // Enter key to add note
        document.getElementById('noteTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addNote();
            }
        });

        document.getElementById('noteContent').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addNote();
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');

        if (this.currentTheme === 'dark') {
            body.classList.add('dark-mode');
            icon.className = 'fas fa-moon';
        } else {
            body.classList.remove('dark-mode');
            icon.className = 'fas fa-sun';
        }
    }

    addNote() {
        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) {
            this.showNotification('Lütfen en az bir başlık veya içerik girin!', 'warning');
            return;
        }

        const note = {
            id: Date.now(),
            title: title || 'Başlıksız Not',
            content: content || 'İçerik yok',
            date: new Date().toLocaleString('tr-TR'),
            timestamp: Date.now()
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.renderNotes();
        this.clearForm();
        this.updateEmptyState();
        this.showNotification('Not başarıyla eklendi!', 'success');
    }

    deleteNote(id) {
        if (confirm('Bu notu silmek istediğinizden emin misiniz?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.renderNotes();
            this.updateEmptyState();
            this.showNotification('Not silindi!', 'success');
        }
    }

    editNote(id) {
        const note = this.notes.find(note => note.id === id);
        if (!note) return;

        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');

        titleInput.value = note.title;
        contentInput.value = note.content;

        // Remove the old note
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        this.renderNotes();
        this.updateEmptyState();

        // Focus on title input
        titleInput.focus();
        titleInput.select();

        this.showNotification('Not düzenleme moduna geçildi!', 'info');
    }

    clearForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('noteTitle').focus();
    }

    searchNotes(query) {
        const notesContainer = document.getElementById('notesContainer');
        const noteCards = notesContainer.querySelectorAll('.note-card');

        noteCards.forEach(card => {
            const title = card.querySelector('.note-title').textContent.toLowerCase();
            const content = card.querySelector('.note-content').textContent.toLowerCase();
            const searchTerm = query.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    renderNotes() {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '';

        this.notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            notesContainer.appendChild(noteCard);
        });
    }

    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <div class="note-header">
                <div>
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-date">${note.date}</div>
                </div>
            </div>
            <div class="note-content">${this.escapeHtml(note.content)}</div>
            <div class="note-actions">
                <button class="action-btn edit" onclick="notesApp.editNote(${note.id})" title="Düzenle">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="notesApp.deleteNote(${note.id})" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return card;
    }

    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const notesContainer = document.getElementById('notesContainer');
        
        if (this.notes.length === 0) {
            emptyState.style.display = 'block';
            notesContainer.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            notesContainer.style.display = 'grid';
        }
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            padding: 15px 20px;
            box-shadow: var(--shadow);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add notification styles to head
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
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
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }
                
                .notification-close:hover {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                }
                
                .notification-success i {
                    color: var(--success-color);
                }
                
                .notification-warning i {
                    color: var(--warning-color);
                }
                
                .notification-error i {
                    color: var(--danger-color);
                }
                
                .notification-info i {
                    color: #667eea;
                }
            `;
            document.head.appendChild(style);
        }

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error': return 'fa-times-circle';
            default: return 'fa-info-circle';
        }
    }
}

// Initialize the app
const notesApp = new NotesApp();