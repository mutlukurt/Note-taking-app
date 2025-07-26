class NotesApp {
    constructor() {
        this.notes = [];
        this.currentUser = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.token = localStorage.getItem('token');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Authentication form listeners
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // Form switching
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // App functionality
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('addNote').addEventListener('click', () => {
            this.addNote();
        });

        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchNotes(e.target.value);
        });

        // Keyboard shortcuts
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

    async checkAuthStatus() {
        if (this.token) {
            try {
                const response = await this.apiCall('/api/profile', 'GET');
                if (response.user) {
                    this.currentUser = response.user;
                    this.showApp();
                    this.loadNotes();
                } else {
                    this.logout();
                }
            } catch (error) {
                this.logout();
            }
        } else {
            this.showAuth();
        }
    }

    async login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Lütfen tüm alanları doldurun!', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/api/login', 'POST', { email, password });
            
            this.token = response.token;
            this.currentUser = response.user;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            this.showApp();
            this.loadNotes();
            this.showNotification('Başarıyla giriş yapıldı!', 'success');
            
        } catch (error) {
            this.showNotification(error.message || 'Giriş yapılamadı!', 'error');
        }
    }

    async register() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            this.showNotification('Lütfen tüm alanları doldurun!', 'warning');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Şifre en az 6 karakter olmalıdır!', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/api/register', 'POST', { name, email, password });
            
            this.token = response.token;
            this.currentUser = response.user;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            this.showApp();
            this.loadNotes();
            this.showNotification('Hesap başarıyla oluşturuldu!', 'success');
            
        } catch (error) {
            this.showNotification(error.message || 'Kayıt yapılamadı!', 'error');
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        this.notes = [];
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.showAuth();
        this.showNotification('Çıkış yapıldı!', 'info');
    }

    showAuth() {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        this.showLoginForm();
    }

    showApp() {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    }

    async loadNotes() {
        try {
            const response = await this.apiCall('/api/notes', 'GET');
            this.notes = response;
            this.renderNotes();
            this.updateEmptyState();
        } catch (error) {
            this.showNotification('Notlar yüklenemedi!', 'error');
        }
    }

    async addNote() {
        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) {
            this.showNotification('Lütfen en az bir başlık veya içerik girin!', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/api/notes', 'POST', {
                title: title || 'Başlıksız Not',
                content: content || 'İçerik yok'
            });

            this.notes.unshift(response.note);
            this.renderNotes();
            this.clearForm();
            this.updateEmptyState();
            this.showNotification('Not başarıyla eklendi!', 'success');
        } catch (error) {
            this.showNotification('Not eklenemedi!', 'error');
        }
    }

    async deleteNote(id) {
        if (confirm('Bu notu silmek istediğinizden emin misiniz?')) {
            try {
                await this.apiCall(`/api/notes/${id}`, 'DELETE');
                this.notes = this.notes.filter(note => note._id !== id);
                this.renderNotes();
                this.updateEmptyState();
                this.showNotification('Not silindi!', 'success');
            } catch (error) {
                this.showNotification('Not silinemedi!', 'error');
            }
        }
    }

    async editNote(id) {
        const note = this.notes.find(note => note._id === id);
        if (!note) return;

        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');

        titleInput.value = note.title;
        contentInput.value = note.content;

        // Remove the old note
        this.notes = this.notes.filter(note => note._id !== id);
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
        
        const date = new Date(note.createdAt).toLocaleString('tr-TR');
        
        card.innerHTML = `
            <div class="note-header">
                <div>
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-date">${date}</div>
                </div>
            </div>
            <div class="note-content">${this.escapeHtml(note.content)}</div>
            <div class="note-actions">
                <button class="action-btn edit" onclick="notesApp.editNote('${note._id}')" title="Düzenle">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="notesApp.deleteNote('${note._id}')" title="Sil">
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

    async apiCall(endpoint, method = 'GET', data = null) {
        const url = endpoint.startsWith('http') ? endpoint : `http://localhost:3000${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Bir hata oluştu');
        }

        return result;
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