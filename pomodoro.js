/**
 * Pomodoro Timer Module
 * Provides focus timer functionality with task tracking and analytics
 */

class PomodoroTimer {
    constructor() {
        // Timer state
        this.timeRemaining = 25 * 60; // seconds
        this.timerInterval = null;
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = 'work'; // 'work', 'break', 'longBreak'
        this.sessionCount = 0;
        this.sessionsBeforeLongBreak = 4;
        this.currentTaskId = null;

        // Settings
        this.settings = {
            workDuration: 25,
            breakDuration: 5,
            longBreakDuration: 15,
            autoStartBreaks: true,
            autoStartPomodoros: false,
            notifications: true
        };

        // Storage keys
        this.settingsKey = 'pomodoroSettings';
        this.tasksKey = 'pomodoroTasks';
        this.sessionsKey = 'pomodoroSessions';

        // Load settings and data
        this.loadSettings();
        this.loadTasks();

        // Initialize UI
        this.initializeUI();
        this.requestNotificationPermission();
    }

    /**
     * Initialize UI elements and event listeners
     */
    initializeUI() {
        // Buttons
        this.openBtn = document.getElementById('open-pomodoro-btn');
        this.closeBtn = document.getElementById('close-pomodoro-btn');
        this.startBtn = document.getElementById('pomodoro-start-btn');
        this.pauseBtn = document.getElementById('pomodoro-pause-btn');
        this.resetBtn = document.getElementById('pomodoro-reset-btn');
        this.skipBtn = document.getElementById('pomodoro-skip-btn');

        // Display elements
        this.section = document.getElementById('pomodoro-section');
        this.timeDisplay = document.getElementById('pomodoro-time-display');
        this.modeText = document.getElementById('pomodoro-mode-text');
        this.sessionCountText = document.getElementById('pomodoro-session-count');
        this.currentTaskText = document.getElementById('pomodoro-current-task');
        this.progressRing = document.getElementById('pomodoro-progress-ring-fill');

        // Task elements
        this.taskList = document.getElementById('pomodoro-task-list');
        this.addTaskBtn = document.getElementById('pomodoro-add-task-btn');
        this.taskModal = document.getElementById('pomodoro-task-modal');
        this.saveTaskBtn = document.getElementById('pomodoro-save-task-btn');
        this.cancelTaskBtn = document.getElementById('pomodoro-cancel-task-btn');

        // Settings
        this.workDurationInput = document.getElementById('pomodoro-work-duration');
        this.breakDurationInput = document.getElementById('pomodoro-break-duration');
        this.longBreakDurationInput = document.getElementById('pomodoro-long-break-duration');
        this.autoStartBreaksCheckbox = document.getElementById('pomodoro-auto-start-breaks');
        this.autoStartPomodorosCheckbox = document.getElementById('pomodoro-auto-start-pomodoros');
        this.notificationsCheckbox = document.getElementById('pomodoro-notifications');

        // Stats
        this.todaySessionsEl = document.getElementById('pomodoro-today-sessions');
        this.todayTimeEl = document.getElementById('pomodoro-today-time');
        this.viewAnalyticsBtn = document.getElementById('pomodoro-view-analytics-btn');
        this.analyticsModal = document.getElementById('pomodoro-analytics-modal');
        this.closeAnalyticsBtn = document.getElementById('close-analytics-modal-btn');

        // Event listeners
        this.openBtn?.addEventListener('click', () => this.openPomodoro());
        this.closeBtn?.addEventListener('click', () => this.closePomodoro());
        this.startBtn?.addEventListener('click', () => this.start());
        this.pauseBtn?.addEventListener('click', () => this.pause());
        this.resetBtn?.addEventListener('click', () => this.reset());
        this.skipBtn?.addEventListener('click', () => this.skip());

        this.addTaskBtn?.addEventListener('click', () => this.showTaskModal());
        this.saveTaskBtn?.addEventListener('click', () => this.saveTask());
        this.cancelTaskBtn?.addEventListener('click', () => this.hideTaskModal());

        this.workDurationInput?.addEventListener('change', () => this.updateSettings());
        this.breakDurationInput?.addEventListener('change', () => this.updateSettings());
        this.longBreakDurationInput?.addEventListener('change', () => this.updateSettings());
        this.autoStartBreaksCheckbox?.addEventListener('change', () => this.updateSettings());
        this.autoStartPomodorosCheckbox?.addEventListener('change', () => this.updateSettings());
        this.notificationsCheckbox?.addEventListener('change', () => this.updateSettings());

        this.viewAnalyticsBtn?.addEventListener('click', () => this.showAnalytics());
        this.closeAnalyticsBtn?.addEventListener('click', () => this.hideAnalytics());

        // Initialize display
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
    }

    /**
     * Open Pomodoro section
     */
    openPomodoro() {
        document.getElementById('json-input-section')?.classList.add('hidden');
        this.section?.classList.remove('hidden');
        this.updateStats();
        this.renderTasks();
    }

    /**
     * Close Pomodoro section
     */
    closePomodoro() {
        this.section?.classList.add('hidden');
        document.getElementById('json-input-section')?.classList.remove('hidden');
    }

    /**
     * Start timer
     */
    start() {
        this.isRunning = true;
        this.isPaused = false;

        this.startBtn?.classList.add('hidden');
        this.pauseBtn?.classList.remove('hidden');

        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateDisplay();
            } else {
                this.complete();
            }
        }, 1000);
    }

    /**
     * Pause timer
     */
    pause() {
        this.isRunning = false;
        this.isPaused = true;

        clearInterval(this.timerInterval);

        this.startBtn?.classList.remove('hidden');
        this.pauseBtn?.classList.add('hidden');
    }

    /**
     * Reset timer to current mode's initial duration
     */
    reset() {
        this.pause();

        if (this.currentMode === 'work') {
            this.timeRemaining = this.settings.workDuration * 60;
        } else if (this.currentMode === 'break') {
            this.timeRemaining = this.settings.breakDuration * 60;
        } else {
            this.timeRemaining = this.settings.longBreakDuration * 60;
        }

        this.updateDisplay();
    }

    /**
     * Skip to next session
     */
    skip() {
        this.pause();
        this.switchMode();
    }

    /**
     * Complete current session
     */
    complete() {
        this.pause();

        // Save session if it was a work session
        if (this.currentMode === 'work') {
            this.saveSession();
            this.sessionCount++;

            // Update task progress
            if (this.currentTaskId) {
                this.updateTaskProgress(this.currentTaskId);
            }
        }

        // Show notification
        this.showNotification();

        // Play sound
        this.playSound();

        // Switch to next mode
        this.switchMode();

        // Auto-start if enabled
        if (this.shouldAutoStart()) {
            setTimeout(() => this.start(), 2000);
        }
    }

    /**
     * Switch between work, break, and long break modes
     */
    switchMode() {
        if (this.currentMode === 'work') {
            // After work: decide break or long break
            if (this.sessionCount % this.sessionsBeforeLongBreak === 0 && this.sessionCount > 0) {
                this.currentMode = 'longBreak';
                this.timeRemaining = this.settings.longBreakDuration * 60;
            } else {
                this.currentMode = 'break';
                this.timeRemaining = this.settings.breakDuration * 60;
            }
        } else {
            // After break: back to work
            this.currentMode = 'work';
            this.timeRemaining = this.settings.workDuration * 60;
        }

        this.updateDisplay();
        this.updateModeIndicator();
    }

    /**
     * Check if timer should auto-start
     */
    shouldAutoStart() {
        if (this.currentMode === 'work') {
            return this.settings.autoStartPomodoros;
        } else {
            return this.settings.autoStartBreaks;
        }
    }

    /**
     * Update timer display
     */
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        if (this.timeDisplay) {
            this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Update progress ring
        const totalDuration = this.getTotalDuration();
        const progress = 1 - (this.timeRemaining / totalDuration);
        const circumference = 2 * Math.PI * 130;
        const offset = circumference * (1 - progress);

        if (this.progressRing) {
            this.progressRing.style.strokeDashoffset = offset;

            // Change color based on mode
            if (this.currentMode === 'work') {
                this.progressRing.setAttribute('stroke', 'var(--color-primary)');
            } else {
                this.progressRing.setAttribute('stroke', 'var(--color-success)');
            }
        }
    }

    /**
     * Get total duration for current mode
     */
    getTotalDuration() {
        if (this.currentMode === 'work') {
            return this.settings.workDuration * 60;
        } else if (this.currentMode === 'break') {
            return this.settings.breakDuration * 60;
        } else {
            return this.settings.longBreakDuration * 60;
        }
    }

    /**
     * Update mode indicator
     */
    updateModeIndicator() {
        let modeLabel = '';
        let sessionText = '';

        if (this.currentMode === 'work') {
            modeLabel = 'Work Session';
            sessionText = `Session ${(this.sessionCount % this.sessionsBeforeLongBreak) + 1} of ${this.sessionsBeforeLongBreak}`;
        } else if (this.currentMode === 'break') {
            modeLabel = 'Short Break';
            sessionText = 'Take a quick break';
        } else {
            modeLabel = 'Long Break';
            sessionText = 'Great job! Take a longer break';
        }

        if (this.modeText) this.modeText.textContent = modeLabel;
        if (this.sessionCountText) this.sessionCountText.textContent = sessionText;
    }

    /**
     * Show notification
     */
    showNotification() {
        if (!this.settings.notifications) return;

        if ('Notification' in window && Notification.permission === 'granted') {
            let title = '';
            let body = '';

            if (this.currentMode === 'work') {
                title = 'Work Session Complete!';
                body = 'Great work! Time for a break.';
            } else if (this.currentMode === 'break') {
                title = 'Break Complete!';
                body = 'Ready to get back to work?';
            } else {
                title = 'Long Break Complete!';
                body = 'Feeling refreshed? Let\'s continue!';
            }

            new Notification(title, {
                body: body,
                icon: '/icon-192.svg',
                badge: '/icon-192.svg'
            });
        }
    }

    /**
     * Play completion sound
     */
    playSound() {
        // Create a simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Could not play sound:', error);
        }
    }

    /**
     * Request notification permission
     */
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    /**
     * Save session to storage
     */
    saveSession() {
        const session = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            duration: this.settings.workDuration,
            taskId: this.currentTaskId,
            taskName: this.getCurrentTaskName(),
            completed: true
        };

        // Save to localStorage
        const sessions = this.getSessions();
        sessions.push(session);
        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        // Save to Firebase if available
        if (window.firebaseService?.isSignedIn()) {
            firebaseService.saveStudySession({
                duration: this.settings.workDuration * 60,
                taskName: session.taskName,
                timestamp: session.timestamp,
                totalQuestions: 0,
                correctAnswers: 0
            }).catch(err => console.error('Failed to save session to Firebase:', err));
        }

        // Update stats
        this.updateStats();
    }

    /**
     * Get all sessions
     */
    getSessions() {
        try {
            const saved = localStorage.getItem(this.sessionsKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Update today's stats
     */
    updateStats() {
        const sessions = this.getSessions();
        const today = new Date().toDateString();

        const todaySessions = sessions.filter(s => {
            const sessionDate = new Date(s.timestamp).toDateString();
            return sessionDate === today;
        });

        const totalSessions = todaySessions.length;
        const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

        if (this.todaySessionsEl) {
            this.todaySessionsEl.textContent = totalSessions;
        }

        if (this.todayTimeEl) {
            if (totalMinutes >= 60) {
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                this.todayTimeEl.textContent = `${hours}h ${mins}m`;
            } else {
                this.todayTimeEl.textContent = `${totalMinutes}m`;
            }
        }
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem(this.settingsKey);
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }

            // Apply settings to inputs
            if (this.workDurationInput) this.workDurationInput.value = this.settings.workDuration;
            if (this.breakDurationInput) this.breakDurationInput.value = this.settings.breakDuration;
            if (this.longBreakDurationInput) this.longBreakDurationInput.value = this.settings.longBreakDuration;
            if (this.autoStartBreaksCheckbox) this.autoStartBreaksCheckbox.checked = this.settings.autoStartBreaks;
            if (this.autoStartPomodorosCheckbox) this.autoStartPomodorosCheckbox.checked = this.settings.autoStartPomodoros;
            if (this.notificationsCheckbox) this.notificationsCheckbox.checked = this.settings.notifications;

            // Initialize timer with work duration
            this.timeRemaining = this.settings.workDuration * 60;
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    /**
     * Update settings
     */
    updateSettings() {
        this.settings.workDuration = parseInt(this.workDurationInput?.value || 25);
        this.settings.breakDuration = parseInt(this.breakDurationInput?.value || 5);
        this.settings.longBreakDuration = parseInt(this.longBreakDurationInput?.value || 15);
        this.settings.autoStartBreaks = this.autoStartBreaksCheckbox?.checked || false;
        this.settings.autoStartPomodoros = this.autoStartPomodorosCheckbox?.checked || false;
        this.settings.notifications = this.notificationsCheckbox?.checked || true;

        localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));

        // Update timer if not running
        if (!this.isRunning) {
            if (this.currentMode === 'work') {
                this.timeRemaining = this.settings.workDuration * 60;
            } else if (this.currentMode === 'break') {
                this.timeRemaining = this.settings.breakDuration * 60;
            } else {
                this.timeRemaining = this.settings.longBreakDuration * 60;
            }
            this.updateDisplay();
        }
    }

    /**
     * Load tasks from storage
     */
    loadTasks() {
        // Tasks loaded on-demand in renderTasks()
    }

    /**
     * Get all tasks
     */
    getTasks() {
        try {
            const saved = localStorage.getItem(this.tasksKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Save tasks to storage
     */
    saveTasks(tasks) {
        localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
    }

    /**
     * Render task list
     */
    renderTasks() {
        if (!this.taskList) return;

        const tasks = this.getTasks();

        if (tasks.length === 0) {
            this.taskList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); font-size: var(--font-size-sm);">No tasks yet. Add one to get started!</p>';
            return;
        }

        this.taskList.innerHTML = tasks.map(task => {
            const isActive = task.id === this.currentTaskId;
            const progress = `${task.completedPomodoros}/${task.estimatedPomodoros}`;

            return `
                <div class="pomodoro-task-item ${isActive ? 'active' : ''}" onclick="pomodoroTimer.selectTask('${task.id}')">
                    <div class="pomodoro-task-info">
                        <div class="pomodoro-task-name">${this.escapeHtml(task.name)}</div>
                        <div class="pomodoro-task-meta">${task.course ? this.escapeHtml(task.course) + ' • ' : ''}${progress} pomodoros</div>
                    </div>
                    <div class="pomodoro-task-actions">
                        <div class="pomodoro-task-progress">${progress}</div>
                        <button class="pomodoro-task-delete" onclick="event.stopPropagation(); pomodoroTimer.deleteTask('${task.id}')" aria-label="Delete task">×</button>
                    </div>
                </div>
            `;
        }).join('');

        // Update current task display
        this.updateCurrentTaskDisplay();
    }

    /**
     * Show task modal
     */
    showTaskModal() {
        this.taskModal?.classList.remove('hidden');
        document.getElementById('pomodoro-task-name')?.focus();
    }

    /**
     * Hide task modal
     */
    hideTaskModal() {
        this.taskModal?.classList.add('hidden');
        // Clear inputs
        const nameInput = document.getElementById('pomodoro-task-name');
        const estimateInput = document.getElementById('pomodoro-task-estimate');
        const courseInput = document.getElementById('pomodoro-task-course');
        if (nameInput) nameInput.value = '';
        if (estimateInput) estimateInput.value = '4';
        if (courseInput) courseInput.value = '';
    }

    /**
     * Save new task
     */
    saveTask() {
        const nameInput = document.getElementById('pomodoro-task-name');
        const estimateInput = document.getElementById('pomodoro-task-estimate');
        const courseInput = document.getElementById('pomodoro-task-course');

        const name = nameInput?.value.trim();
        const estimate = parseInt(estimateInput?.value || 4);
        const course = courseInput?.value.trim();

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        const task = {
            id: Date.now().toString(),
            name: name,
            course: course,
            estimatedPomodoros: estimate,
            completedPomodoros: 0,
            createdAt: Date.now()
        };

        const tasks = this.getTasks();
        tasks.unshift(task);
        this.saveTasks(tasks);

        this.hideTaskModal();
        this.renderTasks();
    }

    /**
     * Select task
     */
    selectTask(taskId) {
        this.currentTaskId = taskId;
        this.renderTasks();
        this.updateCurrentTaskDisplay();
    }

    /**
     * Update current task display
     */
    updateCurrentTaskDisplay() {
        if (!this.currentTaskText) return;

        if (this.currentTaskId) {
            const tasks = this.getTasks();
            const task = tasks.find(t => t.id === this.currentTaskId);
            if (task) {
                this.currentTaskText.textContent = task.name;
                return;
            }
        }

        this.currentTaskText.textContent = 'No task selected';
    }

    /**
     * Get current task name
     */
    getCurrentTaskName() {
        if (!this.currentTaskId) return 'No task';

        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === this.currentTaskId);
        return task ? task.name : 'No task';
    }

    /**
     * Update task progress
     */
    updateTaskProgress(taskId) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.completedPomodoros++;
            this.saveTasks(tasks);
            this.renderTasks();
        }
    }

    /**
     * Delete task
     */
    deleteTask(taskId) {
        if (!confirm('Delete this task?')) return;

        const tasks = this.getTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        this.saveTasks(filtered);

        if (this.currentTaskId === taskId) {
            this.currentTaskId = null;
            this.updateCurrentTaskDisplay();
        }

        this.renderTasks();
    }

    /**
     * Show analytics modal
     */
    showAnalytics() {
        const sessions = this.getSessions();

        // Calculate stats
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const weekSessions = sessions.filter(s => new Date(s.timestamp) >= weekAgo);
        const monthSessions = sessions.filter(s => new Date(s.timestamp) >= monthAgo);

        // Update stats
        document.getElementById('analytics-week-sessions').textContent = weekSessions.length;
        document.getElementById('analytics-month-sessions').textContent = monthSessions.length;
        document.getElementById('analytics-total-sessions').textContent = sessions.length;

        const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
        const monthMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0);
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

        document.getElementById('analytics-week-time').textContent = this.formatDuration(weekMinutes);
        document.getElementById('analytics-month-time').textContent = this.formatDuration(monthMinutes);
        document.getElementById('analytics-total-time').textContent = this.formatDuration(totalMinutes);

        // Recent sessions
        const recentSessions = sessions.slice(-10).reverse();
        const recentSessionsHTML = recentSessions.map(session => `
            <div class="analytics-session-item">
                <span class="analytics-session-date">${new Date(session.timestamp).toLocaleString()}</span>
                <span class="analytics-session-duration">${session.duration} min${session.taskName ? ' • ' + this.escapeHtml(session.taskName) : ''}</span>
            </div>
        `).join('');
        document.getElementById('analytics-recent-sessions').innerHTML = recentSessions.length > 0
            ? recentSessionsHTML
            : '<p style="text-align: center; color: var(--color-text-secondary);">No sessions yet</p>';

        // Task breakdown
        const taskBreakdown = {};
        sessions.forEach(session => {
            if (session.taskName && session.taskName !== 'No task') {
                if (!taskBreakdown[session.taskName]) {
                    taskBreakdown[session.taskName] = 0;
                }
                taskBreakdown[session.taskName] += session.duration;
            }
        });

        const taskBreakdownHTML = Object.entries(taskBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([taskName, minutes]) => `
                <div class="analytics-task-item">
                    <span class="analytics-task-name">${this.escapeHtml(taskName)}</span>
                    <span class="analytics-task-time">${this.formatDuration(minutes)}</span>
                </div>
            `).join('');
        document.getElementById('analytics-task-breakdown').innerHTML = taskBreakdownHTML.length > 0
            ? taskBreakdownHTML
            : '<p style="text-align: center; color: var(--color-text-secondary);">No task data yet</p>';

        this.analyticsModal?.classList.remove('hidden');
    }

    /**
     * Hide analytics modal
     */
    hideAnalytics() {
        this.analyticsModal?.classList.add('hidden');
    }

    /**
     * Format duration in hours and minutes
     */
    formatDuration(minutes) {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}h ${mins}m`;
        }
        return `${minutes}m`;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize Pomodoro Timer when DOM is ready
let pomodoroTimer;
document.addEventListener('DOMContentLoaded', () => {
    pomodoroTimer = new PomodoroTimer();
});
