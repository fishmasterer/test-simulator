/**
 * Notes System
 * Manage study notes with course organization and tagging
 */

class NotesManager {
    constructor() {
        this.currentNoteId = null;
        this.notes = [];

        this.initializeElements();
        this.bindEvents();
        this.loadNotes();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.openBtn = document.getElementById('open-notes-btn');
        this.closeBtn = document.getElementById('close-notes-btn');
        this.section = document.getElementById('notes-section');
        this.notesGrid = document.getElementById('notes-grid');
        this.emptyState = document.getElementById('notes-empty-state');

        this.createNoteBtn = document.getElementById('create-note-btn');
        this.editorModal = document.getElementById('note-editor-modal');
        this.closeEditorBtn = document.getElementById('close-note-editor-btn');
        this.saveNoteBtn = document.getElementById('save-note-btn');
        this.cancelNoteBtn = document.getElementById('cancel-note-btn');

        this.editorTitle = document.getElementById('note-editor-title');
        this.titleInput = document.getElementById('note-title-input');
        this.courseInput = document.getElementById('note-course-input');
        this.tagsInput = document.getElementById('note-tags-input');
        this.contentInput = document.getElementById('note-content-input');

        this.searchInput = document.getElementById('notes-search');
        this.courseFilter = document.getElementById('notes-course-filter');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.openBtn?.addEventListener('click', () => this.openNotes());
        this.closeBtn?.addEventListener('click', () => this.closeNotes());
        this.createNoteBtn?.addEventListener('click', () => this.showEditor());
        this.closeEditorBtn?.addEventListener('click', () => this.hideEditor());
        this.saveNoteBtn?.addEventListener('click', () => this.saveNote());
        this.cancelNoteBtn?.addEventListener('click', () => this.hideEditor());

        this.searchInput?.addEventListener('input', () => this.filterNotes());
        this.courseFilter?.addEventListener('change', () => this.filterNotes());

        this.editorModal?.addEventListener('click', (e) => {
            if (e.target === this.editorModal) this.hideEditor();
        });
    }

    /**
     * Open notes section
     */
    openNotes() {
        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.add('hidden');

        if (this.section) {
            this.section.classList.remove('hidden');
            this.displayNotes();
        }
    }

    /**
     * Close notes section
     */
    closeNotes() {
        if (this.section) this.section.classList.add('hidden');

        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.remove('hidden');
    }

    /**
     * Show note editor
     */
    showEditor(noteId = null) {
        this.currentNoteId = noteId;

        if (noteId) {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                this.editorTitle.textContent = 'Edit Note';
                this.titleInput.value = note.title;
                this.courseInput.value = note.course || '';
                this.tagsInput.value = note.tags ? note.tags.join(', ') : '';
                this.contentInput.value = note.content;
            }
        } else {
            this.editorTitle.textContent = 'New Note';
            this.titleInput.value = '';
            this.courseInput.value = '';
            this.tagsInput.value = '';
            this.contentInput.value = '';
        }

        this.editorModal?.classList.remove('hidden');
        this.titleInput?.focus();
    }

    /**
     * Hide note editor
     */
    hideEditor() {
        this.editorModal?.classList.add('hidden');
        this.currentNoteId = null;
    }

    /**
     * Save note
     */
    async saveNote() {
        const title = this.titleInput?.value.trim();
        const course = this.courseInput?.value.trim();
        const tagsStr = this.tagsInput?.value.trim();
        const content = this.contentInput?.value.trim();

        if (!title || !content) {
            alert('Please enter a title and content for your note.');
            return;
        }

        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

        const note = {
            id: this.currentNoteId || Date.now().toString(),
            title,
            course,
            tags,
            content,
            created: this.currentNoteId ? this.notes.find(n => n.id === this.currentNoteId)?.created || Date.now() : Date.now(),
            updated: Date.now()
        };

        if (this.currentNoteId) {
            const index = this.notes.findIndex(n => n.id === this.currentNoteId);
            if (index !== -1) {
                this.notes[index] = note;
            }
        } else {
            this.notes.unshift(note);
        }

        await this.saveNotes();
        this.hideEditor();
        this.displayNotes();

        console.log('✅ Note saved:', note.title);
    }

    /**
     * Delete note
     */
    async deleteNote(noteId) {
        if (!confirm('Are you sure you want to delete this note?')) return;

        this.notes = this.notes.filter(n => n.id !== noteId);
        await this.saveNotes();
        this.displayNotes();

        console.log('🗑️ Note deleted');
    }

    /**
     * Display notes
     */
    displayNotes() {
        if (!this.notesGrid) return;

        const filteredNotes = this.getFilteredNotes();

        if (filteredNotes.length === 0) {
            this.notesGrid.innerHTML = '';
            this.emptyState?.classList.remove('hidden');
            return;
        }

        this.emptyState?.classList.add('hidden');

        this.notesGrid.innerHTML = filteredNotes.map(note => `
            <div class="note-card" data-id="${note.id}">
                <div class="note-card-header">
                    <h3 class="note-card-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-card-actions">
                        <button class="btn-icon" onclick="notesManager.showEditor('${note.id}')" title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon" onclick="notesManager.deleteNote('${note.id}')" title="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                ${note.course ? `<div class="note-card-course">${this.escapeHtml(note.course)}</div>` : ''}
                <div class="note-card-content">${this.escapeHtml(note.content).substring(0, 200)}${note.content.length > 200 ? '...' : ''}</div>
                ${note.tags && note.tags.length > 0 ? `
                    <div class="note-card-tags">
                        ${note.tags.map(tag => `<span class="note-tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="note-card-footer">
                    <span class="note-card-date">${this.formatDate(note.updated)}</span>
                </div>
            </div>
        `).join('');

        this.updateCourseFilter();
    }

    /**
     * Filter notes
     */
    filterNotes() {
        this.displayNotes();
    }

    /**
     * Get filtered notes
     */
    getFilteredNotes() {
        let filtered = [...this.notes];

        const searchTerm = this.searchInput?.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm) ||
                (note.course && note.course.toLowerCase().includes(searchTerm)) ||
                (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        const course = this.courseFilter?.value;
        if (course) {
            filtered = filtered.filter(note => note.course === course);
        }

        return filtered;
    }

    /**
     * Update course filter options
     */
    updateCourseFilter() {
        if (!this.courseFilter) return;

        const courses = [...new Set(this.notes.map(n => n.course).filter(c => c))].sort();
        const currentValue = this.courseFilter.value;

        this.courseFilter.innerHTML = '<option value="">All Courses</option>' +
            courses.map(course => `<option value="${this.escapeHtml(course)}">${this.escapeHtml(course)}</option>`).join('');

        if (courses.includes(currentValue)) {
            this.courseFilter.value = currentValue;
        }
    }

    /**
     * Load notes from storage
     */
    async loadNotes() {
        try {
            const stored = localStorage.getItem('studyNotes');
            if (stored) {
                this.notes = JSON.parse(stored);
                console.log('📝 Loaded', this.notes.length, 'notes');
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
            this.notes = [];
        }
    }

    /**
     * Save notes to storage
     */
    async saveNotes() {
        try {
            localStorage.setItem('studyNotes', JSON.stringify(this.notes));
            console.log('💾 Notes saved');
        } catch (error) {
            console.error('Failed to save notes:', error);
        }
    }

    /**
     * Format date
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

        return date.toLocaleDateString();
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.notesManager = new NotesManager();
    console.log('📝 Notes Manager initialized');
});
