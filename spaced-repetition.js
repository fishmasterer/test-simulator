/**
 * Spaced Repetition System (SRS) - SM-2 Algorithm Implementation
 * Based on SuperMemo 2 algorithm with memory retention prediction
 */

class SpacedRepetitionSystem {
    constructor() {
        this.storageKey = 'testSimulatorSRS';
        this.data = this.loadData();
        this.initialize();
    }

    /**
     * Initialize SRS data structure
     */
    initialize() {
        const defaults = {
            cards: {}, // questionId -> card data
            reviewHistory: [],
            stats: {
                totalReviews: 0,
                cardsLearning: 0,
                cardsMature: 0,
                cardsNew: 0,
                averageRetention: 0
            },
            lastUpdated: new Date().toISOString()
        };

        this.data = { ...defaults, ...this.data };
        console.log('🧠 Spaced Repetition System initialized');
    }

    /**
     * Load data from localStorage
     */
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Failed to load SRS data:', error);
            return {};
        }
    }

    /**
     * Save data to localStorage
     */
    saveData() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💾 SRS data saved');
        } catch (error) {
            console.error('Failed to save SRS data:', error);
        }
    }

    /**
     * Create or get a card for a question
     * @param {string} questionId - Unique question identifier
     * @param {Object} questionData - Question data (text, type, etc.)
     * @returns {Object} Card data
     */
    getOrCreateCard(questionId, questionData) {
        if (!this.data.cards[questionId]) {
            this.data.cards[questionId] = {
                id: questionId,
                questionText: questionData.question || '',
                questionType: questionData.type || 'unknown',
                easeFactor: 2.5, // Initial ease factor
                interval: 0, // Days until next review
                repetitions: 0, // Consecutive correct answers
                nextReviewDate: Date.now(), // Due now for new cards
                lastReviewDate: null,
                reviewHistory: [],
                state: 'new', // 'new', 'learning', 'review', 'relearning'
                lapses: 0, // Times forgotten
                createdAt: Date.now()
            };
            this.data.stats.cardsNew++;
            this.saveData();
        }
        return this.data.cards[questionId];
    }

    /**
     * SM-2 Algorithm: Calculate next review based on quality rating
     * @param {Object} card - Card data
     * @param {number} quality - Quality rating (0-5)
     *   0: Complete blackout, didn't recall
     *   1: Incorrect response, but recognized answer upon seeing it
     *   2: Incorrect response, seemed easy to recall
     *   3: Correct response, but with serious difficulty
     *   4: Correct response, after some hesitation
     *   5: Perfect response, immediate recall
     * @returns {Object} Updated card data
     */
    reviewCard(card, quality) {
        const oldState = card.state;

        // Record review
        const review = {
            date: Date.now(),
            quality: quality,
            interval: card.interval,
            easeFactor: card.easeFactor,
            state: card.state
        };
        card.reviewHistory.push(review);
        card.lastReviewDate = Date.now();

        // SM-2 Algorithm
        if (quality >= 3) {
            // Correct answer
            if (card.repetitions === 0) {
                card.interval = 1; // 1 day
            } else if (card.repetitions === 1) {
                card.interval = 6; // 6 days
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            card.repetitions++;

            // Update state
            if (card.state === 'new') {
                card.state = 'learning';
            } else if (card.state === 'learning' && card.repetitions >= 2) {
                card.state = 'review';
            } else if (card.state === 'relearning' && card.repetitions >= 2) {
                card.state = 'review';
            }
        } else {
            // Incorrect answer - reset
            card.repetitions = 0;
            card.interval = 1;
            card.lapses++;

            if (card.state === 'review') {
                card.state = 'relearning';
            } else {
                card.state = 'learning';
            }
        }

        // Update ease factor (SM-2 formula)
        card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        // Calculate next review date
        card.nextReviewDate = Date.now() + (card.interval * 24 * 60 * 60 * 1000);

        // Update stats
        this.data.stats.totalReviews++;
        if (oldState === 'new' && card.state !== 'new') {
            this.data.stats.cardsNew--;
            this.data.stats.cardsLearning++;
        }
        if (oldState === 'learning' && card.state === 'review') {
            this.data.stats.cardsLearning--;
            this.data.stats.cardsMature++;
        }

        this.saveData();

        console.log(`📝 Card reviewed: quality=${quality}, interval=${card.interval}d, ease=${card.easeFactor.toFixed(2)}`);

        return card;
    }

    /**
     * Get cards due for review
     * @param {number} limit - Maximum number of cards to return
     * @returns {Array} Due cards sorted by priority
     */
    getDueCards(limit = 20) {
        const now = Date.now();
        const dueCards = Object.values(this.data.cards)
            .filter(card => card.nextReviewDate <= now)
            .sort((a, b) => {
                // Priority: new < learning < relearning < review
                const statePriority = { new: 0, learning: 1, relearning: 2, review: 3 };
                const aPriority = statePriority[a.state] || 99;
                const bPriority = statePriority[b.state] || 99;

                if (aPriority !== bPriority) {
                    return aPriority - bPriority;
                }

                // Within same state, sort by due date (oldest first)
                return a.nextReviewDate - b.nextReviewDate;
            });

        return limit ? dueCards.slice(0, limit) : dueCards;
    }

    /**
     * Predict memory retention for a card using forgetting curve
     * R(t) = e^(-t/S) where S is stability based on ease factor
     * @param {Object} card - Card data
     * @param {number} hoursFromNow - Hours in the future to predict
     * @returns {number} Predicted retention probability (0-1)
     */
    predictRetention(card, hoursFromNow = 0) {
        if (!card.lastReviewDate) {
            return 1.0; // New card, not yet reviewed
        }

        const hoursSinceReview = (Date.now() - card.lastReviewDate) / (1000 * 60 * 60);
        const totalHours = hoursSinceReview + hoursFromNow;

        // Stability factor based on ease factor and interval
        // Higher ease factor = more stable memory
        const stability = card.interval * 24 * (card.easeFactor / 2.5);

        // Forgetting curve: R(t) = e^(-t/S)
        const retention = Math.exp(-totalHours / Math.max(stability, 1));

        return Math.max(0, Math.min(1, retention));
    }

    /**
     * Get retention curve data points for visualization
     * @param {Object} card - Card data
     * @param {number} days - Days to project into future
     * @returns {Array} Array of {time, retention} points
     */
    getRetentionCurve(card, days = 30) {
        const points = [];
        const hoursInterval = (days * 24) / 50; // 50 data points

        for (let i = 0; i <= 50; i++) {
            const hours = i * hoursInterval;
            const retention = this.predictRetention(card, hours);
            points.push({
                hours: hours,
                days: hours / 24,
                retention: retention
            });
        }

        return points;
    }

    /**
     * Get upcoming reviews by date
     * @param {number} days - Number of days to look ahead
     * @returns {Object} Reviews grouped by date
     */
    getUpcomingReviews(days = 7) {
        const now = Date.now();
        const endDate = now + (days * 24 * 60 * 60 * 1000);

        const upcoming = {};

        Object.values(this.data.cards).forEach(card => {
            if (card.nextReviewDate >= now && card.nextReviewDate <= endDate) {
                const date = new Date(card.nextReviewDate).toDateString();
                if (!upcoming[date]) {
                    upcoming[date] = [];
                }
                upcoming[date].push(card);
            }
        });

        return upcoming;
    }

    /**
     * Get statistics for dashboard
     * @returns {Object} SRS statistics
     */
    getStats() {
        const cards = Object.values(this.data.cards);
        const now = Date.now();

        const dueToday = cards.filter(c => c.nextReviewDate <= now).length;
        const dueTomorrow = cards.filter(c => {
            const tomorrow = now + (24 * 60 * 60 * 1000);
            return c.nextReviewDate > now && c.nextReviewDate <= tomorrow;
        }).length;

        // Calculate average retention for all cards
        const avgRetention = cards.length > 0
            ? cards.reduce((sum, card) => sum + this.predictRetention(card), 0) / cards.length
            : 0;

        // Cards by state
        const cardsByState = {
            new: cards.filter(c => c.state === 'new').length,
            learning: cards.filter(c => c.state === 'learning').length,
            review: cards.filter(c => c.state === 'review').length,
            relearning: cards.filter(c => c.state === 'relearning').length
        };

        // Recent review accuracy
        const recentReviews = Object.values(this.data.cards)
            .flatMap(card => card.reviewHistory)
            .sort((a, b) => b.date - a.date)
            .slice(0, 20);

        const recentAccuracy = recentReviews.length > 0
            ? (recentReviews.filter(r => r.quality >= 3).length / recentReviews.length) * 100
            : 0;

        return {
            totalCards: cards.length,
            dueToday: dueToday,
            dueTomorrow: dueTomorrow,
            averageRetention: Math.round(avgRetention * 100),
            cardsByState: cardsByState,
            totalReviews: this.data.stats.totalReviews,
            recentAccuracy: Math.round(recentAccuracy),
            ...this.data.stats
        };
    }

    /**
     * Reset all SRS data (for testing or fresh start)
     */
    reset() {
        if (confirm('⚠️ This will delete all spaced repetition data. Are you sure?')) {
            localStorage.removeItem(this.storageKey);
            this.data = {};
            this.initialize();
            console.log('🔄 SRS data reset');
        }
    }

    /**
     * Export SRS data for backup
     */
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    /**
     * Import SRS data from backup
     */
    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.data = imported;
            this.saveData();
            console.log('✅ SRS data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to import SRS data:', error);
            return false;
        }
    }
}
