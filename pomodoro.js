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
            notifications: true,
            soundEnabled: true,
            tickingEnabled: false,
            soundVolume: 0.5
        };

        // Audio context for sounds
        this.audioContext = null;
        this.tickSound = null;
        this.tickInterval = null;

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
        this.fullscreenBtn = document.getElementById('pomodoro-fullscreen-btn');

        // Display elements
        this.section = document.getElementById('pomodoro-section');
        this.timerCard = document.querySelector('.pomodoro-timer-card');
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
        this.soundEnabledCheckbox = document.getElementById('pomodoro-sound-enabled');
        this.tickingEnabledCheckbox = document.getElementById('pomodoro-ticking-enabled');
        this.soundVolumeSlider = document.getElementById('pomodoro-sound-volume');

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
        this.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

        this.addTaskBtn?.addEventListener('click', () => this.showTaskModal());
        this.saveTaskBtn?.addEventListener('click', () => this.saveTask());
        this.cancelTaskBtn?.addEventListener('click', () => this.hideTaskModal());

        this.workDurationInput?.addEventListener('change', () => this.updateSettings());
        this.breakDurationInput?.addEventListener('change', () => this.updateSettings());
        this.longBreakDurationInput?.addEventListener('change', () => this.updateSettings());
        this.autoStartBreaksCheckbox?.addEventListener('change', () => this.updateSettings());
        this.autoStartPomodorosCheckbox?.addEventListener('change', () => this.updateSettings());
        this.notificationsCheckbox?.addEventListener('change', () => this.updateSettings());
        this.soundEnabledCheckbox?.addEventListener('change', () => this.updateSettings());
        this.tickingEnabledCheckbox?.addEventListener('change', () => this.toggleTicking());
        this.soundVolumeSlider?.addEventListener('input', (e) => {
            this.settings.soundVolume = e.target.value / 100;
            this.saveSettings();
        });

        this.viewAnalyticsBtn?.addEventListener('click', () => this.showAnalytics());
        this.closeAnalyticsBtn?.addEventListener('click', () => this.hideAnalytics());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));

        // Initialize display
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcut(e) {
        // Only handle shortcuts when Pomodoro section is visible
        if (this.section?.classList.contains('hidden')) return;

        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toLowerCase();

        switch (key) {
            case ' ': // Space - Start/Pause
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
                console.log('⌨️ Keyboard: Start/Pause');
                break;

            case 'r': // R - Reset
                e.preventDefault();
                this.reset();
                console.log('⌨️ Keyboard: Reset');
                break;

            case 's': // S - Skip
                e.preventDefault();
                this.skip();
                console.log('⌨️ Keyboard: Skip');
                break;

            case 'n': // N - Add new task
                e.preventDefault();
                this.showTaskModal();
                console.log('⌨️ Keyboard: New task');
                break;

            case 'f': // F - Toggle fullscreen
                e.preventDefault();
                this.toggleFullscreen();
                console.log('⌨️ Keyboard: Fullscreen');
                break;

            case 'escape': // Escape - Exit fullscreen
                if (document.fullscreenElement) {
                    this.exitFullscreen();
                }
                break;
        }
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
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    /**
     * Enter fullscreen mode
     */
    async enterFullscreen() {
        try {
            if (this.section?.requestFullscreen) {
                await this.section.requestFullscreen();
                this.section.classList.add('fullscreen-mode');
                console.log('🖥️ Entered fullscreen mode');
            }
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
        }
    }

    /**
     * Exit fullscreen mode
     */
    async exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                this.section?.classList.remove('fullscreen-mode');
                console.log('🖥️ Exited fullscreen mode');
            }
        } catch (error) {
            console.error('Failed to exit fullscreen:', error);
        }
    }

    /**
     * Start timer
     */
    start() {
        // Don't start if already running
        if (this.isRunning) {
            return;
        }

        // Prevent multiple intervals - clear any existing one first
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.isRunning = true;
        this.isPaused = false;

        this.startBtn?.classList.add('hidden');
        this.pauseBtn?.classList.remove('hidden');

        // Start ticking sound if enabled
        if (this.settings.tickingEnabled) {
            this.startTickSound();
        }

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

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Stop ticking sound
        this.stopTickSound();

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

        // If skipping a work session, count it as complete
        if (this.currentMode === 'work') {
            this.sessionCount++;
            if (this.currentTaskId) {
                this.updateTaskProgress(this.currentTaskId);
            }
        }

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
        let dataMode = '';

        if (this.currentMode === 'work') {
            modeLabel = '🔥 Focus Time';
            sessionText = `Session ${(this.sessionCount % this.sessionsBeforeLongBreak) + 1} of ${this.sessionsBeforeLongBreak}`;
            dataMode = 'work';
        } else if (this.currentMode === 'break') {
            modeLabel = '☕ Short Break';
            sessionText = 'Relax for a moment';
            dataMode = 'break';
        } else {
            modeLabel = '🌟 Long Break';
            sessionText = 'Great work! Enjoy your break';
            dataMode = 'longBreak';
        }

        if (this.modeText) this.modeText.textContent = modeLabel;
        if (this.sessionCountText) this.sessionCountText.textContent = sessionText;

        // Update timer card data-mode for styling
        if (this.timerCard) {
            this.timerCard.setAttribute('data-mode', dataMode);
        }
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
     * Initialize Web Audio API context
     */
    initAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('🔊 Audio context initialized');
            } catch (error) {
                console.error('Failed to initialize audio context:', error);
            }
        }
    }

    /**
     * Play completion sound
     */
    playSound() {
        if (!this.settings.soundEnabled) return;

        this.initAudioContext();
        if (!this.audioContext) return;

        try {
            // Play a pleasant three-tone bell chime
            const now = this.audioContext.currentTime;

            // First bell (higher)
            this.playBellTone(880, now, 0.15);

            // Second bell (middle)
            this.playBellTone(660, now + 0.15, 0.15);

            // Third bell (lower)
            this.playBellTone(440, now + 0.30, 0.3);

            console.log('🔔 Completion bell played');
        } catch (error) {
            console.error('Could not play sound:', error);
        }
    }

    /**
     * Play a single bell tone
     */
    playBellTone(frequency, startTime, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        // Apply volume setting
        const volume = this.settings.soundVolume * 0.3;
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    /**
     * Toggle ticking sound on/off
     */
    toggleTicking() {
        this.settings.tickingEnabled = this.tickingEnabledCheckbox?.checked || false;

        if (this.settings.tickingEnabled && this.isRunning) {
            this.startTickSound();
        } else {
            this.stopTickSound();
        }

        this.saveSettings();
        console.log(`⏱️ Ticking sound ${this.settings.tickingEnabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Start continuous ticking sound
     */
    startTickSound() {
        if (!this.settings.tickingEnabled) return;

        this.initAudioContext();
        if (!this.audioContext) return;

        // Stop any existing tick sound
        this.stopTickSound();

        try {
            // Create a subtle tick sound every second
            this.tickInterval = setInterval(() => {
                if (!this.settings.tickingEnabled || !this.isRunning) {
                    this.stopTickSound();
                    return;
                }

                const now = this.audioContext.currentTime;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // Subtle high-pitched tick
                oscillator.frequency.value = 1000;
                oscillator.type = 'sine';

                const volume = this.settings.soundVolume * 0.05; // Very quiet
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

                oscillator.start(now);
                oscillator.stop(now + 0.05);
            }, 1000);

            console.log('⏱️ Ticking sound started');
        } catch (error) {
            console.error('Could not start ticking sound:', error);
        }
    }

    /**
     * Stop ticking sound
     */
    stopTickSound() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
            console.log('⏱️ Ticking sound stopped');
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
            if (this.soundEnabledCheckbox) this.soundEnabledCheckbox.checked = this.settings.soundEnabled;
            if (this.tickingEnabledCheckbox) this.tickingEnabledCheckbox.checked = this.settings.tickingEnabled;
            if (this.soundVolumeSlider) this.soundVolumeSlider.value = this.settings.soundVolume * 100;

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
        this.settings.soundEnabled = this.soundEnabledCheckbox?.checked || true;
        this.settings.tickingEnabled = this.tickingEnabledCheckbox?.checked || false;

        this.saveSettings();

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
     * Save settings to localStorage
     */
    saveSettings() {
        localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
    }

    /**
     * Apply focus session template
     */
    applyTemplate(templateName) {
        const templates = {
            quick: {
                workDuration: 25,
                breakDuration: 5,
                longBreakDuration: 15,
                name: 'Quick Study'
            },
            deep: {
                workDuration: 50,
                breakDuration: 10,
                longBreakDuration: 20,
                name: 'Deep Work'
            },
            exam: {
                workDuration: 45,
                breakDuration: 15,
                longBreakDuration: 30,
                name: 'Exam Prep'
            },
            light: {
                workDuration: 15,
                breakDuration: 5,
                longBreakDuration: 10,
                name: 'Light Review'
            }
        };

        const template = templates[templateName];
        if (!template) return;

        // Update settings
        this.settings.workDuration = template.workDuration;
        this.settings.breakDuration = template.breakDuration;
        this.settings.longBreakDuration = template.longBreakDuration;

        // Update inputs
        if (this.workDurationInput) this.workDurationInput.value = template.workDuration;
        if (this.breakDurationInput) this.breakDurationInput.value = template.breakDuration;
        if (this.longBreakDurationInput) this.longBreakDurationInput.value = template.longBreakDuration;

        // Save settings
        this.saveSettings();

        // Reset timer if not running
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

        console.log(`📋 Template applied: ${template.name}`);

        // Show feedback
        const btn = event?.target?.closest('.template-btn');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
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
            const isCompleted = task.completed || false;
            const progress = `${task.completedPomodoros}/${task.estimatedPomodoros}`;
            const priority = task.priority || 'medium';

            // Priority display
            const priorityIcons = { high: '🔴', medium: '🟡', low: '🟢' };
            const priorityLabels = { high: 'High', medium: 'Med', low: 'Low' };
            const priorityIcon = priorityIcons[priority];
            const priorityLabel = priorityLabels[priority];

            // Subtasks
            const subtasks = task.subtasks || [];
            const completedSubtasks = subtasks.filter(s => s.completed).length;
            const subtaskProgress = subtasks.length > 0 ? `${completedSubtasks}/${subtasks.length}` : '';

            return `
                <div class="pomodoro-task-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                     draggable="true"
                     data-task-id="${task.id}">
                    <div class="task-main-row" onclick="pomodoroTimer.selectTask('${task.id}')">
                        <div class="pomodoro-task-info">
                            <span class="task-drag-handle" title="Drag to reorder">⋮⋮</span>
                            <input type="checkbox"
                                class="pomodoro-task-checkbox"
                                ${isCompleted ? 'checked' : ''}
                                onclick="event.stopPropagation(); pomodoroTimer.toggleTaskComplete('${task.id}')"
                                aria-label="Mark task as complete">
                            <div>
                                <div class="pomodoro-task-name ${isCompleted ? 'task-completed-text' : ''}">
                                    ${this.escapeHtml(task.name)}
                                    <span class="task-priority-indicator priority-${priority}">${priorityIcon} ${priorityLabel}</span>
                                    ${subtaskProgress ? `<span class="subtask-count">${subtaskProgress} ✓</span>` : ''}
                                </div>
                                <div class="pomodoro-task-meta">${task.course ? this.escapeHtml(task.course) + ' • ' : ''}${progress} pomodoros</div>
                            </div>
                        </div>
                        <div class="pomodoro-task-actions">
                            <button class="task-expand-btn ${subtasks.length > 0 ? '' : 'hidden'}"
                                    onclick="event.stopPropagation(); pomodoroTimer.toggleSubtasks('${task.id}')"
                                    aria-label="Toggle subtasks">
                                <span class="expand-icon">▼</span>
                            </button>
                            <div class="pomodoro-task-progress">${progress}</div>
                            <button class="pomodoro-task-delete" onclick="event.stopPropagation(); pomodoroTimer.deleteTask('${task.id}')" aria-label="Delete task">×</button>
                        </div>
                    </div>
                    <div class="subtasks-container hidden" id="subtasks-${task.id}">
                        <div class="subtask-list">
                            ${subtasks.map((subtask, idx) => `
                                <div class="subtask-item ${subtask.completed ? 'completed' : ''}">
                                    <input type="checkbox"
                                           class="subtask-checkbox"
                                           ${subtask.completed ? 'checked' : ''}
                                           onclick="pomodoroTimer.toggleSubtask('${task.id}', ${idx})">
                                    <span class="subtask-text ${subtask.completed ? 'task-completed-text' : ''}">${this.escapeHtml(subtask.text)}</span>
                                    <button class="subtask-delete" onclick="pomodoroTimer.deleteSubtask('${task.id}', ${idx})" aria-label="Delete subtask">×</button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="subtask-add">
                            <input type="text"
                                   id="subtask-input-${task.id}"
                                   class="subtask-input"
                                   placeholder="Add a subtask..."
                                   onkeypress="if(event.key === 'Enter') pomodoroTimer.addSubtask('${task.id}')">
                            <button class="btn-small btn--primary" onclick="pomodoroTimer.addSubtask('${task.id}')">Add</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update current task display
        this.updateCurrentTaskDisplay();

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    /**
     * Setup drag and drop for task reordering
     */
    setupDragAndDrop() {
        const taskItems = this.taskList?.querySelectorAll('.pomodoro-task-item');
        if (!taskItems) return;

        let draggedElement = null;
        let draggedIndex = null;

        taskItems.forEach((item, index) => {
            // Drag start
            item.addEventListener('dragstart', (e) => {
                draggedElement = item;
                draggedIndex = index;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', item.innerHTML);
            });

            // Drag end
            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                // Remove all drag-over classes
                taskItems.forEach(i => i.classList.remove('drag-over'));
            });

            // Drag over
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                if (draggedElement === item) return;

                item.classList.add('drag-over');
            });

            // Drag leave
            item.addEventListener('dragleave', (e) => {
                item.classList.remove('drag-over');
            });

            // Drop
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();

                item.classList.remove('drag-over');

                if (draggedElement === item) return;

                const currentIndex = Array.from(taskItems).indexOf(item);

                // Reorder tasks
                const tasks = this.getTasks();
                const draggedTask = tasks[draggedIndex];
                tasks.splice(draggedIndex, 1);
                tasks.splice(currentIndex, 0, draggedTask);

                this.saveTasks(tasks);
                this.renderTasks();

                console.log('📋 Task reordered');
            });
        });
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
        const priorityMedium = document.querySelector('input[name="task-priority"][value="medium"]');
        if (nameInput) nameInput.value = '';
        if (estimateInput) estimateInput.value = '4';
        if (courseInput) courseInput.value = '';
        if (priorityMedium) priorityMedium.checked = true;
    }

    /**
     * Save new task
     */
    saveTask() {
        const nameInput = document.getElementById('pomodoro-task-name');
        const estimateInput = document.getElementById('pomodoro-task-estimate');
        const courseInput = document.getElementById('pomodoro-task-course');
        const priorityInput = document.querySelector('input[name="task-priority"]:checked');

        const name = nameInput?.value.trim();
        const estimate = parseInt(estimateInput?.value || 4);
        const course = courseInput?.value.trim();
        const priority = priorityInput?.value || 'medium';

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        const task = {
            id: Date.now().toString(),
            name: name,
            course: course,
            priority: priority,
            estimatedPomodoros: estimate,
            completedPomodoros: 0,
            completed: false,
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
     * Toggle task completion status
     */
    toggleTaskComplete(taskId) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.completed = !task.completed;
            this.saveTasks(tasks);
            this.renderTasks();
        }
    }

    /**
     * Toggle subtasks visibility
     */
    toggleSubtasks(taskId) {
        const container = document.getElementById(`subtasks-${taskId}`);
        const expandBtn = container?.previousElementSibling.querySelector('.task-expand-btn .expand-icon');

        if (container) {
            container.classList.toggle('hidden');
            if (expandBtn) {
                expandBtn.style.transform = container.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        }
    }

    /**
     * Add subtask to task
     */
    addSubtask(taskId) {
        const input = document.getElementById(`subtask-input-${taskId}`);
        const text = input?.value.trim();

        if (!text) return;

        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            if (!task.subtasks) {
                task.subtasks = [];
            }

            task.subtasks.push({
                text: text,
                completed: false,
                createdAt: Date.now()
            });

            this.saveTasks(tasks);
            this.renderTasks();

            // Reopen the subtasks container
            setTimeout(() => {
                const container = document.getElementById(`subtasks-${taskId}`);
                if (container) {
                    container.classList.remove('hidden');
                    const expandBtn = container.previousElementSibling.querySelector('.task-expand-btn .expand-icon');
                    if (expandBtn) {
                        expandBtn.style.transform = 'rotate(180deg)';
                    }
                    // Focus input again
                    const newInput = document.getElementById(`subtask-input-${taskId}`);
                    newInput?.focus();
                }
            }, 0);

            console.log('✅ Subtask added');
        }
    }

    /**
     * Toggle subtask completion
     */
    toggleSubtask(taskId, subtaskIndex) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task && task.subtasks && task.subtasks[subtaskIndex]) {
            task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
            this.saveTasks(tasks);
            this.renderTasks();

            // Reopen the subtasks container
            setTimeout(() => {
                const container = document.getElementById(`subtasks-${taskId}`);
                if (container) {
                    container.classList.remove('hidden');
                    const expandBtn = container.previousElementSibling.querySelector('.task-expand-btn .expand-icon');
                    if (expandBtn) {
                        expandBtn.style.transform = 'rotate(180deg)';
                    }
                }
            }, 0);
        }
    }

    /**
     * Delete subtask
     */
    deleteSubtask(taskId, subtaskIndex) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task && task.subtasks) {
            task.subtasks.splice(subtaskIndex, 1);
            this.saveTasks(tasks);
            this.renderTasks();

            // Reopen the subtasks container if there are still subtasks
            if (task.subtasks.length > 0) {
                setTimeout(() => {
                    const container = document.getElementById(`subtasks-${taskId}`);
                    if (container) {
                        container.classList.remove('hidden');
                        const expandBtn = container.previousElementSibling.querySelector('.task-expand-btn .expand-icon');
                        if (expandBtn) {
                            expandBtn.style.transform = 'rotate(180deg)';
                        }
                    }
                }, 0);
            }
        }
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
