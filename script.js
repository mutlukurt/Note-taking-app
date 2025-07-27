class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentSort = localStorage.getItem('sort') || 'date-desc';
        this.currentFilter = localStorage.getItem('filter') || 'all';
        this.swipeThreshold = 100;
        this.deleteTimeout = null;
        
        // Update existing notes to include pinned property
        this.notes.forEach(note => {
            if (note.pinned === undefined) {
                note.pinned = false;
            }
        });
        
        this.init();
        this.checkMobileDesktopMode();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.applySortAndFilter();
        this.renderNotes();
        this.updateEmptyState();
    }

    setupEventListeners() {
        // Theme toggle - Basit ve güvenilir
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.onclick = () => {
                this.toggleTheme();
            };
        }



        // Add note
        document.getElementById('addNote').addEventListener('click', () => {
            this.addNote();
        });

        // Clear form
        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        // Export PDF
        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportToPDF();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchNotes(e.target.value);
        });

        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setSort(e.target.dataset.sort);
            });
        });

        // Filter buttons
        document.querySelectorAll('.pin-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Rich text editor toolbar
        document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                this.executeCommand(command);
                this.updateToolbarState();
            });
        });



        // Image upload
        document.getElementById('addImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
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

        // Rich editor events
        document.getElementById('noteContent').addEventListener('input', () => {
            this.updateToolbarState();
        });

        document.getElementById('noteContent').addEventListener('keyup', () => {
            this.updateToolbarState();
        });


    }

    toggleTheme() {
        // Tema değiştir
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        // LocalStorage'a kaydet
        localStorage.setItem('theme', this.currentTheme);
        
        // Temayı uygula
        this.applyTheme();
        
        // Bildirim göster
        const themeName = this.currentTheme === 'dark' ? 'Karanlık' : 'Açık';
        this.showNotification(`${themeName} tema aktif`, 'success');
    }

    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            
            if (this.currentTheme === 'dark') {
                // Karanlık tema
                body.classList.add('dark-mode');
                if (icon) icon.className = 'fas fa-moon';
            } else {
                // Açık tema
                body.classList.remove('dark-mode');
                if (icon) icon.className = 'fas fa-sun';
            }
        }
    }

    setSort(sortType) {
        this.currentSort = sortType;
        localStorage.setItem('sort', sortType);
        
        // Update active button
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sort="${sortType}"]`).classList.add('active');
        
        this.applySortAndFilter();
    }

    setFilter(filterType) {
        this.currentFilter = filterType;
        localStorage.setItem('filter', filterType);
        
        // Update active button
        document.querySelectorAll('.pin-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filterType}"]`).classList.add('active');
        
        this.applySortAndFilter();
    }

    applySortAndFilter() {
        let filteredNotes = [...this.notes];

        // Apply filter
        switch (this.currentFilter) {
            case 'pinned':
                filteredNotes = filteredNotes.filter(note => note.pinned);
                break;
            case 'unpinned':
                filteredNotes = filteredNotes.filter(note => !note.pinned);
                break;
            case 'all':
            default:
                break;
        }

        // Apply sort
        switch (this.currentSort) {
            case 'date-asc':
                filteredNotes.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'date-desc':
                filteredNotes.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'title':
                filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        // Pin pinned notes to top
        filteredNotes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
        });

        this.renderNotes(filteredNotes);
        this.updateEmptyState();
    }

    addNote() {
        const titleInput = document.getElementById('noteTitle');
        
        const title = titleInput.value.trim();
        const content = this.getNoteContent().trim();

        if (!title && !content) {
            this.showNotification('Lütfen en az bir başlık veya içerik girin!', 'warning');
            return;
        }

        const note = {
            id: Date.now(),
            title: title || 'Başlıksız Not',
            content: content || 'İçerik yok',
            date: new Date().toLocaleString('tr-TR'),
            timestamp: Date.now(),
            pinned: false
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.applySortAndFilter();
        this.clearForm();
        this.updateEmptyState();
        this.showNotification('Not başarıyla eklendi!', 'success');
    }

    deleteNote(id) {
        if (confirm('Bu notu silmek istediğinizden emin misiniz?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.applySortAndFilter();
            this.updateEmptyState();
            this.showNotification('Not başarıyla silindi!', 'success');
        }
    }

    swipeDeleteNote(id) {
        const noteElement = document.querySelector(`[data-note-id="${id}"]`);
        if (!noteElement) return;

        // Show delete confirmation
        const confirmation = document.createElement('div');
        confirmation.className = 'swipe-delete-confirmation';
        confirmation.innerHTML = `
            <i class="fas fa-trash"></i>
            <span>4 saniye içinde geri al</span>
        `;
        noteElement.appendChild(confirmation);

        // Start countdown
        let countdown = 4;
        const countdownInterval = setInterval(() => {
            countdown--;
            confirmation.querySelector('span').textContent = `${countdown} saniye içinde geri al`;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.confirmSwipeDelete(id);
            }
        }, 1000);

        // Store reference for cancellation
        this.deleteTimeout = {
            id: id,
            element: noteElement,
            confirmation: confirmation,
            interval: countdownInterval
        };

        // Add click to cancel
        confirmation.addEventListener('click', () => {
            this.cancelSwipeDelete();
        });
    }

    cancelSwipeDelete() {
        if (this.deleteTimeout) {
            clearInterval(this.deleteTimeout.interval);
            this.deleteTimeout.confirmation.remove();
            this.deleteTimeout.element.classList.remove('swipe-left');
            this.deleteTimeout = null;
            this.showNotification('Silme işlemi iptal edildi!', 'info');
        }
    }

    confirmSwipeDelete(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        this.applySortAndFilter();
        this.updateEmptyState();
        this.showNotification('Not başarıyla silindi!', 'success');
    }

    togglePin(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.pinned = !note.pinned;
            this.saveNotes();
            this.applySortAndFilter();
            this.showNotification(
                note.pinned ? 'Not sabitlendi!' : 'Not sabitlemesi kaldırıldı!', 
                'success'
            );
        }
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const titleInput = document.getElementById('noteTitle');

        titleInput.value = note.title;
        this.setNoteContent(note.content);

        // Change button text
        const addButton = document.getElementById('addNote');
        addButton.innerHTML = '<i class="fas fa-save"></i> Notu Güncelle';
        addButton.onclick = () => this.updateNote(id);

        // Scroll to form
        titleInput.scrollIntoView({ behavior: 'smooth' });
        titleInput.focus();
    }

    updateNote(id) {
        const titleInput = document.getElementById('noteTitle');
        
        const title = titleInput.value.trim();
        const content = this.getNoteContent().trim();

        if (!title && !content) {
            this.showNotification('Lütfen en az bir başlık veya içerik girin!', 'warning');
            return;
        }

        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.title = title || 'Başlıksız Not';
            note.content = content || 'İçerik yok';
            note.date = new Date().toLocaleString('tr-TR');
            note.timestamp = Date.now();
        }

        this.saveNotes();
        this.applySortAndFilter();
        this.clearForm();
        this.showNotification('Not başarıyla güncellendi!', 'success');

        // Reset button
        const addButton = document.getElementById('addNote');
        addButton.innerHTML = '<i class="fas fa-plus"></i> Not Ekle';
        addButton.onclick = () => this.addNote();
    }

    clearForm() {
        document.getElementById('noteTitle').value = '';
        this.setNoteContent('');
        
        // Reset button
        const addButton = document.getElementById('addNote');
        addButton.innerHTML = '<i class="fas fa-plus"></i> Not Ekle';
        addButton.onclick = () => this.addNote();
    }

    searchNotes(query) {
        const searchTerm = query.toLowerCase();
        const noteCards = document.querySelectorAll('.note-card');
        
        noteCards.forEach(card => {
            const title = card.querySelector('.note-title').textContent.toLowerCase();
            const content = card.querySelector('.note-content').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    renderNotes(notesToRender = null) {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '';

        const notes = notesToRender || this.notes;
        
        notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            notesContainer.appendChild(noteCard);
        });
    }

    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = `note-card ${note.pinned ? 'pinned' : ''}`;
        card.setAttribute('data-note-id', note.id);
        card.innerHTML = `
            <div class="note-header">
                <div>
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-date">${note.date}</div>
                </div>
            </div>
            <div class="note-content">${this.escapeHtml(note.content)}</div>
            <div class="note-actions">
                <button class="action-btn pin ${note.pinned ? 'pinned' : ''}" onclick="notesApp.togglePin(${note.id})" title="${note.pinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}">
                    <i class="fas fa-thumbtack"></i>
                </button>
                <button class="action-btn edit" onclick="notesApp.editNote(${note.id})" title="Düzenle">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="notesApp.deleteNote(${note.id})" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Add swipe functionality
        this.addSwipeFunctionality(card, note.id);

        return card;
    }

    addSwipeFunctionality(card, noteId) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            card.classList.add('swiping');
        });

        card.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            if (diffX < 0) { // Swipe left (delete)
                const translateX = Math.max(diffX, -this.swipeThreshold);
                card.style.transform = `translateX(${translateX}px)`;
                
                if (Math.abs(diffX) >= this.swipeThreshold) {
                    card.classList.add('swipe-left');
                } else {
                    card.classList.remove('swipe-left');
                }
            }
        });

        card.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            card.classList.remove('swiping');
            
            const diffX = currentX - startX;
            
            if (diffX < -this.swipeThreshold) {
                // Trigger swipe delete
                this.swipeDeleteNote(noteId);
            } else {
                // Reset position
                card.style.transform = '';
                card.classList.remove('swipe-left');
            }
        });

        // Mouse events for desktop
        card.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            card.classList.add('swiping');
        });

        card.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            currentX = e.clientX;
            const diffX = currentX - startX;
            
            if (diffX < 0) { // Swipe left (delete)
                const translateX = Math.max(diffX, -this.swipeThreshold);
                card.style.transform = `translateX(${translateX}px)`;
                
                if (Math.abs(diffX) >= this.swipeThreshold) {
                    card.classList.add('swipe-left');
                } else {
                    card.classList.remove('swipe-left');
                }
            }
        });

        card.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            card.classList.remove('swiping');
            
            const diffX = currentX - startX;
            
            if (diffX < -this.swipeThreshold) {
                // Trigger swipe delete
                this.swipeDeleteNote(noteId);
            } else {
                // Reset position
                card.style.transform = '';
                card.classList.remove('swipe-left');
            }
        });

        card.addEventListener('mouseleave', (e) => {
            if (isDragging) {
                isDragging = false;
                card.classList.remove('swiping');
                card.style.transform = '';
                card.classList.remove('swipe-left');
            }
        });

        // Prevent text selection during swipe
        card.addEventListener('selectstart', (e) => {
            if (isDragging) e.preventDefault();
        });
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
                .notification-success {
                    border-left: 4px solid var(--success-color);
                }
                .notification-warning {
                    border-left: 4px solid var(--warning-color);
                }
                .notification-danger {
                    border-left: 4px solid var(--danger-color);
                }
                .notification-info {
                    border-left: 4px solid var(--gradient-primary);
                }
            `;
            document.head.appendChild(style);
        }

        // Add to body
        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'danger': return 'fa-times-circle';
            case 'info':
            default: return 'fa-info-circle';
        }
    }

    // Rich Text Editor Functions
    executeCommand(command) {
        const editor = document.getElementById('noteContent');
        editor.focus();
        
        // If no text is selected, select all text
        const selection = window.getSelection();
        if (selection.toString().length === 0) {
            // If editor is empty, just insert a space and format it
            if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
                editor.innerHTML = '&nbsp;';
                const range = document.createRange();
                range.selectNodeContents(editor);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        
        // Execute the command
        let success = false;
        try {
            success = document.execCommand(command, false, null);
        } catch (e) {
            console.log('Command failed:', command, e);
        }
        
        if (!success) {
            // Fallback for some commands
            switch (command) {
                case 'bold':
                    this.wrapSelection('<strong>', '</strong>');
                    break;
                case 'italic':
                    this.wrapSelection('<em>', '</em>');
                    break;
                case 'underline':
                    this.wrapSelection('<u>', '</u>');
                    break;
                case 'strikeThrough':
                    this.wrapSelection('<strike>', '</strike>');
                    break;
            }
        }
        
        this.updateToolbarState();
    }

    wrapSelection(startTag, endTag) {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const newText = startTag + selectedText + endTag;
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
        }
    }

    updateToolbarState() {
        const buttons = document.querySelectorAll('.toolbar-btn[data-command]');
        
        buttons.forEach(btn => {
            const command = btn.dataset.command;
            let isActive = false;
            
            try {
                isActive = document.queryCommandState(command);
            } catch (e) {
                // Fallback for unsupported commands
                isActive = false;
            }
            
            btn.classList.toggle('active', isActive);
        });
        

    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showNotification('Lütfen sadece resim dosyası seçin!', 'warning');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('Resim dosyası 5MB\'dan küçük olmalıdır!', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            const editor = document.getElementById('noteContent');
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            range.insertNode(img);
            range.collapse(false);
            
            editor.focus();
            this.showNotification('Resim başarıyla eklendi!', 'success');
        };
        
        reader.readAsDataURL(file);
        event.target.value = ''; // Reset input
    }

    getNoteContent() {
        const editor = document.getElementById('noteContent');
        return editor.innerHTML;
    }

    setNoteContent(content) {
        const editor = document.getElementById('noteContent');
        editor.innerHTML = content;
    }

    exportToPDF() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').innerHTML;

        if (!title && !content) {
            this.showNotification('PDF aktarmak için bir not yazın!', 'warning');
            return;
        }

        // Show loading notification
        this.showNotification('PDF oluşturuluyor...', 'info');

        // Create temporary div for PDF content
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '800px';
        tempDiv.style.padding = '40px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '14px';
        tempDiv.style.lineHeight = '1.6';
        tempDiv.style.color = '#333';
        
        tempDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #667eea;">
                <div style="font-size: 24px; color: #667eea; margin-bottom: 10px; font-weight: bold;">
                    ${title || 'Not'}
                </div>
                <div style="color: #666; font-size: 14px;">
                    Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}
                </div>
            </div>
            <div style="font-size: 16px;">
                ${content || '<p>Not içeriği boş</p>'}
            </div>
        `;

        document.body.appendChild(tempDiv);

        // Convert to canvas and then to PDF
        html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            document.body.removeChild(tempDiv);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Save PDF
            const fileName = `${title || 'not'}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            this.showNotification('PDF başarıyla oluşturuldu!', 'success');
        }).catch(error => {
            document.body.removeChild(tempDiv);
            console.error('PDF oluşturma hatası:', error);
            this.showNotification('PDF oluşturulurken hata oluştu!', 'error');
        });
    }

    checkMobileDesktopMode() {
        // Check if user is on mobile and has enabled desktop mode
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isDesktopMode = window.innerWidth >= 769;
        const isLandscape = window.innerWidth > window.innerHeight;
        
        // Check for desktop mode indicators
        const isDesktopModeActive = isMobile && (isDesktopMode || isLandscape || window.innerWidth > 600);
        
        if (isDesktopModeActive) {
            // User is on mobile but viewing in desktop mode
            this.showNotification('🖥️ Masaüstü modunda görüntüleniyor! Daha iyi deneyim için mobil moda geçebilirsiniz.', 'info', 8000);
            
            // Force desktop layout by adding CSS class
            document.body.classList.add('force-desktop-mode');
            
            // Add a floating button to switch to mobile mode
            this.addMobileModeToggle();
        }
        
        // Listen for resize events to detect mode changes
        window.addEventListener('resize', () => {
            const newIsDesktopMode = window.innerWidth >= 769;
            const newIsLandscape = window.innerWidth > window.innerHeight;
            const newIsDesktopModeActive = isMobile && (newIsDesktopMode || newIsLandscape || window.innerWidth > 600);
            
            if (newIsDesktopModeActive && !document.body.classList.contains('force-desktop-mode')) {
                document.body.classList.add('force-desktop-mode');
                this.addMobileModeToggle();
            } else if (!newIsDesktopModeActive && document.body.classList.contains('force-desktop-mode')) {
                document.body.classList.remove('force-desktop-mode');
                const toggleBtn = document.getElementById('mobileModeToggle');
                if (toggleBtn) toggleBtn.remove();
            }
        });
    }

    addMobileModeToggle() {
        // Remove existing toggle if any
        const existingToggle = document.getElementById('mobileModeToggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        // Create floating toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'mobileModeToggle';
        toggleBtn.innerHTML = '📱';
        toggleBtn.title = 'Mobil moda geç';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--gradient-primary);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;

        toggleBtn.addEventListener('click', () => {
            // Remove desktop mode class
            document.body.classList.remove('force-desktop-mode');
            
            // Force mobile viewport
            const viewport = document.querySelector('meta[name="viewport"]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            
            // Remove floating button
            toggleBtn.remove();
            
            // Show notification
            this.showNotification('📱 Mobil moda geçildi!', 'success');
        });

        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
        });

        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
        });

                    document.body.appendChild(toggleBtn);
        }
    }


}



// Initialize the app
const notesApp = new NotesApp();