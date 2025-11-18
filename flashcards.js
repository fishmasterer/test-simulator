/**
 * Flashcard System with Spaced Repetition
 * Implements SM-2 algorithm for optimal learning
 */

class FlashcardSystem {
    constructor() {
        this.decks = [];
        this.currentDeck = null;
        this.studyQueue = [];
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.sessionStats = {
            cardsStudied: 0,
            correct: 0,
            incorrect: 0,
            startTime: null
        };

        this.initializeElements();
        this.bindEvents();
        this.loadDecks();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Main navigation
        this.openBtn = document.getElementById('open-flashcards-btn');
        this.closeBtn = document.getElementById('close-flashcards-btn');
        this.section = document.getElementById('flashcards-section');

        // Deck list view
        this.decksGrid = document.getElementById('decks-grid');
        this.decksEmptyState = document.getElementById('decks-empty-state');
        this.createDeckBtn = document.getElementById('create-deck-btn');
        this.deckSearchInput = document.getElementById('deck-search');

        // Deck editor modal
        this.deckEditorModal = document.getElementById('deck-editor-modal');
        this.closeDeckEditorBtn = document.getElementById('close-deck-editor-btn');
        this.saveDeckBtn = document.getElementById('save-deck-btn');
        this.cancelDeckBtn = document.getElementById('cancel-deck-btn');
        this.deckNameInput = document.getElementById('deck-name-input');
        this.deckSubjectInput = document.getElementById('deck-subject-input');
        this.deckDescInput = document.getElementById('deck-description-input');

        // Card manager view
        this.cardManagerView = document.getElementById('card-manager-view');
        this.backToDecksBtn = document.getElementById('back-to-decks-btn');
        this.currentDeckTitle = document.getElementById('current-deck-title');
        this.cardsListContainer = document.getElementById('cards-list-container');
        this.addCardBtn = document.getElementById('add-card-btn');
        this.startStudyBtn = document.getElementById('start-study-btn');

        // Card editor modal
        this.cardEditorModal = document.getElementById('card-editor-modal');
        this.closeCardEditorBtn = document.getElementById('close-card-editor-btn');
        this.saveCardBtn = document.getElementById('save-card-btn');
        this.cancelCardBtn = document.getElementById('cancel-card-btn');
        this.cardFrontInput = document.getElementById('card-front-input');
        this.cardBackInput = document.getElementById('card-back-input');
        this.cardHintInput = document.getElementById('card-hint-input');

        // Study session view
        this.studySessionView = document.getElementById('study-session-view');
        this.exitStudyBtn = document.getElementById('exit-study-btn');
        this.studyProgress = document.getElementById('study-progress');
        this.studyProgressText = document.getElementById('study-progress-text');
        this.flashcard = document.getElementById('flashcard');
        this.flashcardInner = document.getElementById('flashcard-inner');
        this.cardFront = document.getElementById('card-front');
        this.cardBack = document.getElementById('card-back');
        this.cardHint = document.getElementById('card-hint');
        this.showHintBtn = document.getElementById('show-hint-btn');
        this.flipCardBtn = document.getElementById('flip-card-btn');
        this.qualityButtons = document.getElementById('quality-buttons');
        this.againBtn = document.getElementById('again-btn');
        this.hardBtn = document.getElementById('hard-btn');
        this.goodBtn = document.getElementById('good-btn');
        this.easyBtn = document.getElementById('easy-btn');
        this.sessionStatsDiv = document.getElementById('session-stats');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.openBtn?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());

        this.createDeckBtn?.addEventListener('click', () => this.showDeckEditor());
        this.closeDeckEditorBtn?.addEventListener('click', () => this.hideDeckEditor());
        this.saveDeckBtn?.addEventListener('click', () => this.saveDeck());
        this.cancelDeckBtn?.addEventListener('click', () => this.hideDeckEditor());

        this.deckSearchInput?.addEventListener('input', () => this.displayDecks());

        this.backToDecksBtn?.addEventListener('click', () => this.showDecksList());
        this.addCardBtn?.addEventListener('click', () => this.showCardEditor());
        this.startStudyBtn?.addEventListener('click', () => this.startStudySession());

        this.closeCardEditorBtn?.addEventListener('click', () => this.hideCardEditor());
        this.saveCardBtn?.addEventListener('click', () => this.saveCard());
        this.cancelCardBtn?.addEventListener('click', () => this.hideCardEditor());

        this.exitStudyBtn?.addEventListener('click', () => this.exitStudySession());
        this.flipCardBtn?.addEventListener('click', () => this.flipCard());
        this.showHintBtn?.addEventListener('click', () => this.showHint());

        this.againBtn?.addEventListener('click', () => this.rateCard(0));
        this.hardBtn?.addEventListener('click', () => this.rateCard(2));
        this.goodBtn?.addEventListener('click', () => this.rateCard(3));
        this.easyBtn?.addEventListener('click', () => this.rateCard(5));

        // Modal backdrop clicks
        this.deckEditorModal?.addEventListener('click', (e) => {
            if (e.target === this.deckEditorModal) this.hideDeckEditor();
        });
        this.cardEditorModal?.addEventListener('click', (e) => {
            if (e.target === this.cardEditorModal) this.hideCardEditor();
        });
    }

    /**
     * Open flashcards section
     */
    open() {
        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.add('hidden');

        if (this.section) {
            this.section.classList.remove('hidden');
            this.showDecksList();
            this.displayDecks();
        }
    }

    /**
     * Close flashcards section
     */
    close() {
        if (this.section) this.section.classList.add('hidden');

        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.remove('hidden');
    }

    /**
     * Show decks list view
     */
    showDecksList() {
        this.cardManagerView?.classList.add('hidden');
        this.studySessionView?.classList.add('hidden');
        this.decksGrid?.parentElement.classList.remove('hidden');
        this.currentDeck = null;
    }

    /**
     * Display decks grid
     */
    displayDecks() {
        if (!this.decksGrid) return;

        const searchTerm = this.deckSearchInput?.value.toLowerCase().trim() || '';
        const filtered = this.decks.filter(deck =>
            deck.name.toLowerCase().includes(searchTerm) ||
            deck.subject.toLowerCase().includes(searchTerm) ||
            deck.description.toLowerCase().includes(searchTerm)
        );

        if (filtered.length === 0) {
            this.decksGrid.innerHTML = '';
            this.decksEmptyState?.classList.remove('hidden');
            return;
        }

        this.decksEmptyState?.classList.add('hidden');

        this.decksGrid.innerHTML = filtered.map(deck => {
            const dueCards = this.getDueCards(deck).length;
            const totalCards = deck.cards.length;
            const masteredCards = deck.cards.filter(c => c.interval >= 21).length;

            return `
                <div class="deck-card" data-id="${deck.id}">
                    <div class="deck-card-header">
                        <h3 class="deck-card-title">${this.escapeHtml(deck.name)}</h3>
                        <span class="deck-subject">${this.escapeHtml(deck.subject)}</span>
                    </div>
                    <p class="deck-description">${this.escapeHtml(deck.description)}</p>
                    <div class="deck-stats">
                        <div class="deck-stat">
                            <span class="deck-stat-value">${totalCards}</span>
                            <span class="deck-stat-label">Cards</span>
                        </div>
                        <div class="deck-stat">
                            <span class="deck-stat-value">${dueCards}</span>
                            <span class="deck-stat-label">Due</span>
                        </div>
                        <div class="deck-stat">
                            <span class="deck-stat-value">${masteredCards}</span>
                            <span class="deck-stat-label">Mastered</span>
                        </div>
                    </div>
                    <div class="deck-actions">
                        <button class="btn btn--sm" onclick="flashcardSystem.openDeck('${deck.id}')">
                            Manage
                        </button>
                        <button class="btn btn--sm btn--primary" onclick="flashcardSystem.openDeck('${deck.id}', true)" ${dueCards === 0 ? 'disabled' : ''}>
                            Study ${dueCards > 0 ? `(${dueCards})` : ''}
                        </button>
                        <button class="btn-icon" onclick="flashcardSystem.showDeckEditor('${deck.id}')" title="Edit Deck">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon" onclick="flashcardSystem.deleteDeck('${deck.id}')" title="Delete Deck">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Show deck editor modal
     */
    showDeckEditor(deckId = null) {
        this.currentDeckId = deckId;

        if (deckId) {
            const deck = this.decks.find(d => d.id === deckId);
            if (deck) {
                this.deckNameInput.value = deck.name;
                this.deckSubjectInput.value = deck.subject;
                this.deckDescInput.value = deck.description;
            }
        } else {
            this.deckNameInput.value = '';
            this.deckSubjectInput.value = '';
            this.deckDescInput.value = '';
        }

        this.deckEditorModal?.classList.remove('hidden');
        this.deckNameInput?.focus();
    }

    /**
     * Hide deck editor modal
     */
    hideDeckEditor() {
        this.deckEditorModal?.classList.add('hidden');
        this.currentDeckId = null;
    }

    /**
     * Save deck
     */
    async saveDeck() {
        const name = this.deckNameInput?.value.trim();
        const subject = this.deckSubjectInput?.value.trim();
        const description = this.deckDescInput?.value.trim();

        if (!name) {
            alert('Please enter a deck name.');
            return;
        }

        if (this.currentDeckId) {
            // Edit existing deck
            const deck = this.decks.find(d => d.id === this.currentDeckId);
            if (deck) {
                deck.name = name;
                deck.subject = subject;
                deck.description = description;
                deck.updatedAt = Date.now();
            }
        } else {
            // Create new deck
            const newDeck = {
                id: Date.now().toString(),
                name,
                subject,
                description,
                cards: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this.decks.unshift(newDeck);
        }

        await this.saveDecks();
        this.hideDeckEditor();
        this.displayDecks();

        console.log('✅ Deck saved:', name);
    }

    /**
     * Delete deck
     */
    async deleteDeck(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        if (!confirm(`Delete deck "${deck.name}" and all its ${deck.cards.length} cards?`)) return;

        this.decks = this.decks.filter(d => d.id !== deckId);
        await this.saveDecks();
        this.displayDecks();

        console.log('🗑️ Deck deleted');
    }

    /**
     * Open deck for management or study
     */
    openDeck(deckId, startStudy = false) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        this.currentDeck = deck;

        if (startStudy) {
            this.startStudySession();
        } else {
            this.showCardManager();
        }
    }

    /**
     * Show card manager view
     */
    showCardManager() {
        if (!this.currentDeck) return;

        this.decksGrid?.parentElement.classList.add('hidden');
        this.studySessionView?.classList.add('hidden');
        this.cardManagerView?.classList.remove('hidden');

        this.currentDeckTitle.textContent = this.currentDeck.name;
        this.displayCards();
    }

    /**
     * Display cards in current deck
     */
    displayCards() {
        if (!this.currentDeck || !this.cardsListContainer) return;

        const cards = this.currentDeck.cards;

        if (cards.length === 0) {
            this.cardsListContainer.innerHTML = `
                <div class="empty-state">
                    <p>No cards in this deck yet.</p>
                    <p>Click "Add Card" to create your first flashcard.</p>
                </div>
            `;
            return;
        }

        this.cardsListContainer.innerHTML = cards.map((card, index) => {
            const nextReview = card.nextReview ? new Date(card.nextReview) : null;
            const isDue = !nextReview || nextReview <= new Date();
            const daysUntilReview = nextReview ? Math.ceil((nextReview - new Date()) / (1000 * 60 * 60 * 24)) : 0;

            return `
                <div class="card-item ${isDue ? 'card-due' : ''}" data-index="${index}">
                    <div class="card-item-content">
                        <div class="card-item-front">
                            <strong>Front:</strong> ${this.escapeHtml(card.front.substring(0, 100))}${card.front.length > 100 ? '...' : ''}
                        </div>
                        <div class="card-item-back">
                            <strong>Back:</strong> ${this.escapeHtml(card.back.substring(0, 100))}${card.back.length > 100 ? '...' : ''}
                        </div>
                    </div>
                    <div class="card-item-meta">
                        <span class="card-status ${isDue ? 'status-due' : 'status-learning'}">
                            ${isDue ? '📌 Due' : `✓ ${daysUntilReview}d`}
                        </span>
                        <span class="card-interval">Interval: ${card.interval || 0}d</span>
                        <span class="card-ease">Ease: ${Math.round((card.easeFactor || 2.5) * 100)}%</span>
                    </div>
                    <div class="card-item-actions">
                        <button class="btn-icon" onclick="flashcardSystem.showCardEditor(${index})" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon" onclick="flashcardSystem.deleteCard(${index})" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const dueCards = this.getDueCards(this.currentDeck).length;
        this.startStudyBtn.disabled = dueCards === 0;
        this.startStudyBtn.textContent = dueCards > 0 ? `Study Now (${dueCards} due)` : 'No cards due';
    }

    /**
     * Show card editor modal
     */
    showCardEditor(cardIndex = null) {
        this.currentCardIndex = cardIndex;

        if (cardIndex !== null && this.currentDeck) {
            const card = this.currentDeck.cards[cardIndex];
            if (card) {
                this.cardFrontInput.value = card.front;
                this.cardBackInput.value = card.back;
                this.cardHintInput.value = card.hint || '';
            }
        } else {
            this.cardFrontInput.value = '';
            this.cardBackInput.value = '';
            this.cardHintInput.value = '';
        }

        this.cardEditorModal?.classList.remove('hidden');
        this.cardFrontInput?.focus();
    }

    /**
     * Hide card editor modal
     */
    hideCardEditor() {
        this.cardEditorModal?.classList.add('hidden');
        this.currentCardIndex = null;
    }

    /**
     * Save card
     */
    async saveCard() {
        const front = this.cardFrontInput?.value.trim();
        const back = this.cardBackInput?.value.trim();
        const hint = this.cardHintInput?.value.trim();

        if (!front || !back) {
            alert('Please enter both front and back of the card.');
            return;
        }

        if (this.currentCardIndex !== null) {
            // Edit existing card
            const card = this.currentDeck.cards[this.currentCardIndex];
            card.front = front;
            card.back = back;
            card.hint = hint;
        } else {
            // Create new card
            const newCard = {
                front,
                back,
                hint,
                interval: 0,
                repetitions: 0,
                easeFactor: 2.5,
                nextReview: Date.now(),
                createdAt: Date.now()
            };
            this.currentDeck.cards.push(newCard);
        }

        this.currentDeck.updatedAt = Date.now();
        await this.saveDecks();
        this.hideCardEditor();
        this.displayCards();

        console.log('✅ Card saved');
    }

    /**
     * Delete card
     */
    async deleteCard(cardIndex) {
        if (!confirm('Delete this card?')) return;

        this.currentDeck.cards.splice(cardIndex, 1);
        this.currentDeck.updatedAt = Date.now();
        await this.saveDecks();
        this.displayCards();

        console.log('🗑️ Card deleted');
    }

    /**
     * Get due cards for a deck
     */
    getDueCards(deck) {
        const now = Date.now();
        return deck.cards.filter(card => !card.nextReview || card.nextReview <= now);
    }

    /**
     * Start study session
     */
    startStudySession() {
        if (!this.currentDeck) return;

        this.studyQueue = this.getDueCards(this.currentDeck);

        if (this.studyQueue.length === 0) {
            alert('No cards due for review!');
            return;
        }

        // Shuffle study queue
        this.studyQueue.sort(() => Math.random() - 0.5);

        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.sessionStats = {
            cardsStudied: 0,
            correct: 0,
            incorrect: 0,
            startTime: Date.now()
        };

        this.cardManagerView?.classList.add('hidden');
        this.studySessionView?.classList.remove('hidden');

        this.showCurrentCard();
    }

    /**
     * Show current card in study session
     */
    showCurrentCard() {
        if (this.currentCardIndex >= this.studyQueue.length) {
            this.endStudySession();
            return;
        }

        const card = this.studyQueue[this.currentCardIndex];
        this.isFlipped = false;

        // Update progress
        this.studyProgress.value = this.currentCardIndex;
        this.studyProgress.max = this.studyQueue.length;
        this.studyProgressText.textContent = `Card ${this.currentCardIndex + 1} of ${this.studyQueue.length}`;

        // Update card content
        this.cardFront.textContent = card.front;
        this.cardBack.textContent = card.back;

        // Reset flip
        this.flashcardInner?.classList.remove('flipped');

        // Handle hint
        if (card.hint) {
            this.showHintBtn.classList.remove('hidden');
            this.cardHint.textContent = card.hint;
            this.cardHint.classList.add('hidden');
        } else {
            this.showHintBtn.classList.add('hidden');
        }

        // Hide quality buttons until flipped
        this.qualityButtons?.classList.add('hidden');
    }

    /**
     * Flip card
     */
    flipCard() {
        if (this.isFlipped) return;

        this.isFlipped = true;
        this.flashcardInner?.classList.add('flipped');
        this.qualityButtons?.classList.remove('hidden');
    }

    /**
     * Show hint
     */
    showHint() {
        this.cardHint?.classList.remove('hidden');
        this.showHintBtn?.classList.add('hidden');
    }

    /**
     * Rate card using SM-2 algorithm
     * @param {number} quality - 0 (again), 2 (hard), 3 (good), 5 (easy)
     */
    rateCard(quality) {
        if (!this.isFlipped) return;

        const card = this.studyQueue[this.currentCardIndex];

        // Update session stats
        this.sessionStats.cardsStudied++;
        if (quality >= 3) {
            this.sessionStats.correct++;
        } else {
            this.sessionStats.incorrect++;
        }

        // SM-2 Algorithm
        if (quality >= 3) {
            if (card.repetitions === 0) {
                card.interval = 1;
            } else if (card.repetitions === 1) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            card.repetitions++;
        } else {
            card.repetitions = 0;
            card.interval = 1;
        }

        // Update ease factor
        card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        // Set next review date
        card.nextReview = Date.now() + (card.interval * 24 * 60 * 60 * 1000);

        // Save progress
        this.saveDecks();

        // Move to next card
        this.currentCardIndex++;
        this.showCurrentCard();
    }

    /**
     * End study session
     */
    endStudySession() {
        const duration = Math.round((Date.now() - this.sessionStats.startTime) / 1000 / 60);
        const accuracy = this.sessionStats.cardsStudied > 0
            ? Math.round((this.sessionStats.correct / this.sessionStats.cardsStudied) * 100)
            : 0;

        this.sessionStatsDiv.innerHTML = `
            <h3>Session Complete! 🎉</h3>
            <div class="session-summary">
                <div class="session-stat">
                    <span class="session-stat-value">${this.sessionStats.cardsStudied}</span>
                    <span class="session-stat-label">Cards Studied</span>
                </div>
                <div class="session-stat">
                    <span class="session-stat-value">${accuracy}%</span>
                    <span class="session-stat-label">Accuracy</span>
                </div>
                <div class="session-stat">
                    <span class="session-stat-value">${duration}</span>
                    <span class="session-stat-label">Minutes</span>
                </div>
            </div>
            <button class="btn btn--primary" onclick="flashcardSystem.exitStudySession()">
                Finish
            </button>
        `;

        this.flashcard?.classList.add('hidden');
        this.qualityButtons?.classList.add('hidden');
        this.sessionStatsDiv?.classList.remove('hidden');

        console.log('✅ Study session completed:', this.sessionStats);
    }

    /**
     * Exit study session
     */
    exitStudySession() {
        this.studySessionView?.classList.add('hidden');
        this.flashcard?.classList.remove('hidden');
        this.sessionStatsDiv?.classList.add('hidden');
        this.showCardManager();
    }

    /**
     * Load decks from storage
     */
    async loadDecks() {
        try {
            const stored = localStorage.getItem('flashcardDecks');
            if (stored) {
                this.decks = JSON.parse(stored);
                console.log('📚 Loaded', this.decks.length, 'flashcard decks');
            }
        } catch (error) {
            console.error('Failed to load flashcard decks:', error);
            this.decks = [];
        }
    }

    /**
     * Save decks to storage
     */
    async saveDecks() {
        try {
            localStorage.setItem('flashcardDecks', JSON.stringify(this.decks));
            console.log('💾 Flashcard decks saved');
        } catch (error) {
            console.error('Failed to save flashcard decks:', error);
        }
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
    window.flashcardSystem = new FlashcardSystem();
    console.log('🃏 Flashcard System initialized');
});
