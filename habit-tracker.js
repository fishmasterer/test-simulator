/**
 * Habit Tracker & Streaks System
 * Track daily habits with streak counting and visualization
 */

class HabitTracker {
    constructor() {
        this.habits = [];
        this.currentHabitId = null;

        this.initializeElements();
        this.bindEvents();
        this.loadHabits();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Main navigation
        this.openBtn = document.getElementById('open-habits-btn');
        this.closeBtn = document.getElementById('close-habits-btn');
        this.section = document.getElementById('habits-section');

        // Habit list view
        this.habitsContainer = document.getElementById('habits-container');
        this.habitsEmptyState = document.getElementById('habits-empty-state');
        this.createHabitBtn = document.getElementById('create-habit-btn');

        // Habit editor modal
        this.habitEditorModal = document.getElementById('habit-editor-modal');
        this.closeHabitEditorBtn = document.getElementById('close-habit-editor-btn');
        this.saveHabitBtn = document.getElementById('save-habit-btn');
        this.cancelHabitBtn = document.getElementById('cancel-habit-btn');
        this.habitNameInput = document.getElementById('habit-name-input');
        this.habitDescInput = document.getElementById('habit-desc-input');
        this.habitCategorySelect = document.getElementById('habit-category-select');
        this.habitGoalInput = document.getElementById('habit-goal-input');
        this.habitColorInput = document.getElementById('habit-color-input');

        // Stats overview
        this.totalHabitsSpan = document.getElementById('total-habits');
        this.activeStreaksSpan = document.getElementById('active-streaks');
        this.completionRateSpan = document.getElementById('completion-rate');
        this.longestStreakSpan = document.getElementById('longest-streak');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.openBtn?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());

        this.createHabitBtn?.addEventListener('click', () => this.showHabitEditor());
        this.closeHabitEditorBtn?.addEventListener('click', () => this.hideHabitEditor());
        this.saveHabitBtn?.addEventListener('click', () => this.saveHabit());
        this.cancelHabitBtn?.addEventListener('click', () => this.hideHabitEditor());

        this.habitEditorModal?.addEventListener('click', (e) => {
            if (e.target === this.habitEditorModal) this.hideHabitEditor();
        });

        // Check for new day at midnight
        this.startMidnightChecker();
    }

    /**
     * Open habits section
     */
    open() {
        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.add('hidden');

        if (this.section) {
            this.section.classList.remove('hidden');
            this.displayHabits();
            this.updateStats();
        }
    }

    /**
     * Close habits section
     */
    close() {
        if (this.section) this.section.classList.add('hidden');

        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.remove('hidden');
    }

    /**
     * Display habits
     */
    displayHabits() {
        if (!this.habitsContainer) return;

        if (this.habits.length === 0) {
            this.habitsContainer.innerHTML = '';
            this.habitsEmptyState?.classList.remove('hidden');
            return;
        }

        this.habitsEmptyState?.classList.add('hidden');

        this.habitsContainer.innerHTML = this.habits.map(habit => {
            const streak = this.getCurrentStreak(habit);
            const longestStreak = this.getLongestStreak(habit);
            const completionRate = this.getCompletionRate(habit);
            const isCompletedToday = this.isCompletedToday(habit);
            const last7Days = this.getLast7DaysStatus(habit);

            const categoryIcons = {
                study: '📚',
                exercise: '💪',
                health: '🏥',
                mindfulness: '🧘',
                reading: '📖',
                productivity: '⚡',
                other: '⭐'
            };

            return `
                <div class="habit-card" data-id="${habit.id}" style="border-left: 4px solid ${habit.color};">
                    <div class="habit-card-header">
                        <div class="habit-card-icon">${categoryIcons[habit.category] || '⭐'}</div>
                        <div class="habit-card-info">
                            <h3 class="habit-card-title">${this.escapeHtml(habit.name)}</h3>
                            ${habit.description ? `<p class="habit-card-desc">${this.escapeHtml(habit.description)}</p>` : ''}
                        </div>
                        <div class="habit-card-actions">
                            <button class="btn-icon" onclick="habitTracker.showHabitEditor('${habit.id}')" title="Edit">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="habitTracker.deleteHabit('${habit.id}')" title="Delete">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="habit-stats-row">
                        <div class="habit-stat">
                            <span class="habit-stat-value ${streak > 0 ? 'streak-active' : ''}">${streak}</span>
                            <span class="habit-stat-label">🔥 Current Streak</span>
                        </div>
                        <div class="habit-stat">
                            <span class="habit-stat-value">${longestStreak}</span>
                            <span class="habit-stat-label">🏆 Best Streak</span>
                        </div>
                        <div class="habit-stat">
                            <span class="habit-stat-value">${completionRate}%</span>
                            <span class="habit-stat-label">📊 Rate</span>
                        </div>
                    </div>

                    <div class="habit-week-view">
                        ${last7Days.map((completed, i) => {
                            const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                            const today = new Date();
                            const dayDate = new Date();
                            dayDate.setDate(today.getDate() - (6 - i));
                            const dayName = dayNames[dayDate.getDay()];

                            return `
                                <div class="habit-day ${completed ? 'completed' : ''} ${i === 6 ? 'today' : ''}" title="${dayName}">
                                    <span class="habit-day-label">${dayName}</span>
                                    <div class="habit-day-indicator"></div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <button
                        class="habit-check-btn ${isCompletedToday ? 'completed' : ''}"
                        onclick="habitTracker.toggleHabitToday('${habit.id}')"
                        style="background-color: ${isCompletedToday ? habit.color : 'transparent'}; border-color: ${habit.color}; color: ${isCompletedToday ? '#fff' : habit.color};">
                        ${isCompletedToday ? '✓ Completed Today' : 'Mark as Complete'}
                    </button>
                </div>
            `;
        }).join('');
    }

    /**
     * Show habit editor modal
     */
    showHabitEditor(habitId = null) {
        this.currentHabitId = habitId;

        if (habitId) {
            const habit = this.habits.find(h => h.id === habitId);
            if (habit) {
                this.habitNameInput.value = habit.name;
                this.habitDescInput.value = habit.description || '';
                this.habitCategorySelect.value = habit.category;
                this.habitGoalInput.value = habit.goalDays || 30;
                this.habitColorInput.value = habit.color;
            }
        } else {
            this.habitNameInput.value = '';
            this.habitDescInput.value = '';
            this.habitCategorySelect.value = 'study';
            this.habitGoalInput.value = 30;
            this.habitColorInput.value = '#21808D';
        }

        this.habitEditorModal?.classList.remove('hidden');
        this.habitNameInput?.focus();
    }

    /**
     * Hide habit editor modal
     */
    hideHabitEditor() {
        this.habitEditorModal?.classList.add('hidden');
        this.currentHabitId = null;
    }

    /**
     * Save habit
     */
    async saveHabit() {
        const name = this.habitNameInput?.value.trim();
        const description = this.habitDescInput?.value.trim();
        const category = this.habitCategorySelect?.value;
        const goalDays = parseInt(this.habitGoalInput?.value) || 30;
        const color = this.habitColorInput?.value;

        if (!name) {
            alert('Please enter a habit name.');
            return;
        }

        if (this.currentHabitId) {
            // Edit existing habit
            const habit = this.habits.find(h => h.id === this.currentHabitId);
            if (habit) {
                habit.name = name;
                habit.description = description;
                habit.category = category;
                habit.goalDays = goalDays;
                habit.color = color;
                habit.updatedAt = Date.now();
            }
        } else {
            // Create new habit
            const newHabit = {
                id: Date.now().toString(),
                name,
                description,
                category,
                goalDays,
                color,
                completions: [], // Array of timestamps
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this.habits.push(newHabit);
        }

        await this.saveHabits();
        this.hideHabitEditor();
        this.displayHabits();
        this.updateStats();

        console.log('✅ Habit saved:', name);
    }

    /**
     * Delete habit
     */
    async deleteHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        if (!confirm(`Delete habit "${habit.name}"?`)) return;

        this.habits = this.habits.filter(h => h.id !== habitId);
        await this.saveHabits();
        this.displayHabits();
        this.updateStats();

        console.log('🗑️ Habit deleted');
    }

    /**
     * Toggle habit completion for today
     */
    async toggleHabitToday(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const today = this.getDateKey(new Date());
        const todayTimestamp = new Date(today).getTime();
        const existingIndex = habit.completions.findIndex(ts => {
            return this.getDateKey(new Date(ts)) === today;
        });

        if (existingIndex !== -1) {
            // Remove completion
            habit.completions.splice(existingIndex, 1);
            console.log('❌ Habit unchecked:', habit.name);
        } else {
            // Add completion
            habit.completions.push(todayTimestamp);
            console.log('✅ Habit completed:', habit.name);
        }

        habit.updatedAt = Date.now();
        await this.saveHabits();
        this.displayHabits();
        this.updateStats();
    }

    /**
     * Check if habit is completed today
     */
    isCompletedToday(habit) {
        const today = this.getDateKey(new Date());
        return habit.completions.some(ts => {
            return this.getDateKey(new Date(ts)) === today;
        });
    }

    /**
     * Get current streak
     */
    getCurrentStreak(habit) {
        if (habit.completions.length === 0) return 0;

        const sortedCompletions = [...habit.completions]
            .map(ts => this.getDateKey(new Date(ts)))
            .sort()
            .reverse();

        const today = this.getDateKey(new Date());
        const yesterday = this.getDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

        // Check if completed today or yesterday
        if (sortedCompletions[0] !== today && sortedCompletions[0] !== yesterday) {
            return 0;
        }

        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < 365; i++) { // Max 365 days
            const dateKey = this.getDateKey(currentDate);
            if (sortedCompletions.includes(dateKey)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    /**
     * Get longest streak
     */
    getLongestStreak(habit) {
        if (habit.completions.length === 0) return 0;

        const sortedCompletions = [...habit.completions]
            .map(ts => this.getDateKey(new Date(ts)))
            .sort();

        let longestStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < sortedCompletions.length; i++) {
            const prevDate = new Date(sortedCompletions[i - 1]);
            const currDate = new Date(sortedCompletions[i]);
            const dayDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

            if (dayDiff === 1) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return longestStreak;
    }

    /**
     * Get completion rate (last 30 days)
     */
    getCompletionRate(habit) {
        if (habit.completions.length === 0) return 0;

        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const habitCreated = habit.createdAt;
        const startDate = Math.max(thirtyDaysAgo, habitCreated);
        const daysTracked = Math.ceil((Date.now() - startDate) / (1000 * 60 * 60 * 24));

        if (daysTracked === 0) return 0;

        const recentCompletions = habit.completions.filter(ts => ts >= startDate);
        return Math.round((recentCompletions.length / daysTracked) * 100);
    }

    /**
     * Get last 7 days status
     */
    getLast7DaysStatus(habit) {
        const status = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);

            const isCompleted = habit.completions.some(ts => {
                return this.getDateKey(new Date(ts)) === dateKey;
            });

            status.push(isCompleted);
        }

        return status;
    }

    /**
     * Get date key (YYYY-MM-DD format)
     */
    getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Update stats overview
     */
    updateStats() {
        if (!this.totalHabitsSpan) return;

        const totalHabits = this.habits.length;
        const activeStreaks = this.habits.filter(h => this.getCurrentStreak(h) > 0).length;

        let totalRate = 0;
        this.habits.forEach(h => {
            totalRate += this.getCompletionRate(h);
        });
        const avgRate = totalHabits > 0 ? Math.round(totalRate / totalHabits) : 0;

        let longestStreak = 0;
        this.habits.forEach(h => {
            longestStreak = Math.max(longestStreak, this.getLongestStreak(h));
        });

        this.totalHabitsSpan.textContent = totalHabits;
        this.activeStreaksSpan.textContent = activeStreaks;
        this.completionRateSpan.textContent = `${avgRate}%`;
        this.longestStreakSpan.textContent = longestStreak;
    }

    /**
     * Start midnight checker to reset daily status
     */
    startMidnightChecker() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const msUntilMidnight = tomorrow - now;

        setTimeout(() => {
            this.displayHabits();
            this.updateStats();
            console.log('🌅 New day - habits refreshed');

            // Set up daily interval
            setInterval(() => {
                this.displayHabits();
                this.updateStats();
                console.log('🌅 New day - habits refreshed');
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }

    /**
     * Load habits from storage
     */
    async loadHabits() {
        try {
            const stored = localStorage.getItem('habitTrackerHabits');
            if (stored) {
                this.habits = JSON.parse(stored);
                console.log('✅ Loaded', this.habits.length, 'habits');
            }
        } catch (error) {
            console.error('Failed to load habits:', error);
            this.habits = [];
        }
    }

    /**
     * Save habits to storage
     */
    async saveHabits() {
        try {
            localStorage.setItem('habitTrackerHabits', JSON.stringify(this.habits));
            console.log('💾 Habits saved');
        } catch (error) {
            console.error('Failed to save habits:', error);
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
    window.habitTracker = new HabitTracker();
    console.log('✅ Habit Tracker initialized');
});
