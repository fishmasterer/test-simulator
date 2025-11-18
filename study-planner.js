/**
 * Study Planner & Calendar System
 * Weekly/monthly calendar with study blocks, deadlines, and reminders
 */

class StudyPlanner {
    constructor() {
        this.events = [];
        this.currentView = 'week'; // 'week' or 'month'
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.currentEventId = null;

        this.initializeElements();
        this.bindEvents();
        this.loadEvents();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Main navigation
        this.openBtn = document.getElementById('open-planner-btn');
        this.closeBtn = document.getElementById('close-planner-btn');
        this.section = document.getElementById('planner-section');

        // Calendar controls
        this.viewToggleWeek = document.getElementById('view-toggle-week');
        this.viewToggleMonth = document.getElementById('view-toggle-month');
        this.prevPeriodBtn = document.getElementById('prev-period-btn');
        this.nextPeriodBtn = document.getElementById('next-period-btn');
        this.todayBtn = document.getElementById('today-btn');
        this.currentPeriodLabel = document.getElementById('current-period-label');

        // Calendar views
        this.weekView = document.getElementById('week-view');
        this.monthView = document.getElementById('month-view');
        this.weekGrid = document.getElementById('week-grid');
        this.monthGrid = document.getElementById('month-grid');

        // Event editor modal
        this.eventEditorModal = document.getElementById('event-editor-modal');
        this.closeEventEditorBtn = document.getElementById('close-event-editor-btn');
        this.saveEventBtn = document.getElementById('save-event-btn');
        this.cancelEventBtn = document.getElementById('cancel-event-btn');
        this.deleteEventBtn = document.getElementById('delete-event-btn');

        this.eventTitleInput = document.getElementById('event-title-input');
        this.eventTypeSelect = document.getElementById('event-type-select');
        this.eventDateInput = document.getElementById('event-date-input');
        this.eventStartTimeInput = document.getElementById('event-start-time-input');
        this.eventEndTimeInput = document.getElementById('event-end-time-input');
        this.eventCourseInput = document.getElementById('event-course-input');
        this.eventNotesInput = document.getElementById('event-notes-input');
        this.eventColorInput = document.getElementById('event-color-input');

        // Upcoming events sidebar
        this.upcomingEventsList = document.getElementById('upcoming-events-list');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.openBtn?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());

        this.viewToggleWeek?.addEventListener('click', () => this.switchView('week'));
        this.viewToggleMonth?.addEventListener('click', () => this.switchView('month'));
        this.prevPeriodBtn?.addEventListener('click', () => this.navigatePeriod(-1));
        this.nextPeriodBtn?.addEventListener('click', () => this.navigatePeriod(1));
        this.todayBtn?.addEventListener('click', () => this.goToToday());

        this.closeEventEditorBtn?.addEventListener('click', () => this.hideEventEditor());
        this.saveEventBtn?.addEventListener('click', () => this.saveEvent());
        this.cancelEventBtn?.addEventListener('click', () => this.hideEventEditor());
        this.deleteEventBtn?.addEventListener('click', () => this.deleteEvent());

        this.eventEditorModal?.addEventListener('click', (e) => {
            if (e.target === this.eventEditorModal) this.hideEventEditor();
        });
    }

    /**
     * Open planner section
     */
    open() {
        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.add('hidden');

        if (this.section) {
            this.section.classList.remove('hidden');
            this.renderCalendar();
            this.renderUpcomingEvents();
        }
    }

    /**
     * Close planner section
     */
    close() {
        if (this.section) this.section.classList.add('hidden');

        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.remove('hidden');
    }

    /**
     * Switch calendar view
     */
    switchView(view) {
        this.currentView = view;

        if (view === 'week') {
            this.viewToggleWeek?.classList.add('active');
            this.viewToggleMonth?.classList.remove('active');
            this.weekView?.classList.remove('hidden');
            this.monthView?.classList.add('hidden');
        } else {
            this.viewToggleWeek?.classList.remove('active');
            this.viewToggleMonth?.classList.add('active');
            this.weekView?.classList.add('hidden');
            this.monthView?.classList.remove('hidden');
        }

        this.renderCalendar();
    }

    /**
     * Navigate to previous/next period
     */
    navigatePeriod(direction) {
        if (this.currentView === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        }
        this.renderCalendar();
    }

    /**
     * Go to today
     */
    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    /**
     * Render calendar based on current view
     */
    renderCalendar() {
        if (this.currentView === 'week') {
            this.renderWeekView();
        } else {
            this.renderMonthView();
        }
        this.updatePeriodLabel();
    }

    /**
     * Update period label
     */
    updatePeriodLabel() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        if (this.currentView === 'week') {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const startMonth = monthNames[weekStart.getMonth()];
            const endMonth = monthNames[weekEnd.getMonth()];
            const year = weekStart.getFullYear();

            if (startMonth === endMonth) {
                this.currentPeriodLabel.textContent = `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}, ${year}`;
            } else {
                this.currentPeriodLabel.textContent = `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${year}`;
            }
        } else {
            this.currentPeriodLabel.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }

    /**
     * Get start of week (Monday)
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        return new Date(d.setDate(diff));
    }

    /**
     * Render week view
     */
    renderWeekView() {
        if (!this.weekGrid) return;

        const weekStart = this.getWeekStart(this.currentDate);
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const hours = Array.from({length: 14}, (_, i) => i + 7); // 7 AM to 8 PM

        let html = '<div class="week-header">';
        html += '<div class="week-time-column">Time</div>';

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const isToday = this.isSameDay(date, new Date());

            html += `
                <div class="week-day-header ${isToday ? 'today' : ''}">
                    <div class="week-day-name">${days[i]}</div>
                    <div class="week-day-date">${date.getDate()}</div>
                </div>
            `;
        }
        html += '</div>';

        // Time slots
        html += '<div class="week-body">';
        html += '<div class="week-time-column">';
        hours.forEach(hour => {
            html += `<div class="week-time-slot">${hour}:00</div>`;
        });
        html += '</div>';

        // Day columns
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dayEvents = this.getEventsForDate(date);

            html += '<div class="week-day-column">';
            hours.forEach(hour => {
                const hourEvents = dayEvents.filter(e => {
                    const eventHour = new Date(e.startTime).getHours();
                    return eventHour === hour;
                });

                html += `<div class="week-hour-slot" data-date="${date.toISOString()}" data-hour="${hour}" onclick="studyPlanner.createEventAt('${date.toISOString()}', ${hour})">`;

                hourEvents.forEach(event => {
                    const start = new Date(event.startTime);
                    const end = new Date(event.endTime);
                    const duration = (end - start) / (1000 * 60); // minutes
                    const height = (duration / 60) * 100; // percentage of hour

                    html += `
                        <div class="week-event" style="background-color: ${event.color}; height: ${height}%;" onclick="event.stopPropagation(); studyPlanner.showEventEditor('${event.id}');">
                            <div class="week-event-time">${this.formatTime(start)} - ${this.formatTime(end)}</div>
                            <div class="week-event-title">${this.escapeHtml(event.title)}</div>
                        </div>
                    `;
                });

                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';

        this.weekGrid.innerHTML = html;
    }

    /**
     * Render month view
     */
    renderMonthView() {
        if (!this.monthGrid) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

        let html = '<div class="month-header">';
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayNames.forEach(day => {
            html += `<div class="month-day-name">${day}</div>`;
        });
        html += '</div>';

        html += '<div class="month-grid">';

        // Empty cells before month starts
        for (let i = 0; i < adjustedStart; i++) {
            html += '<div class="month-day empty"></div>';
        }

        // Days of month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isSameDay(date, today);
            const dayEvents = this.getEventsForDate(date);

            html += `
                <div class="month-day ${isToday ? 'today' : ''}" onclick="studyPlanner.selectDate('${date.toISOString()}')">
                    <div class="month-day-number">${day}</div>
                    <div class="month-day-events">
                        ${dayEvents.slice(0, 3).map(event => `
                            <div class="month-event" style="background-color: ${event.color};" onclick="event.stopPropagation(); studyPlanner.showEventEditor('${event.id}');">
                                ${this.escapeHtml(event.title)}
                            </div>
                        `).join('')}
                        ${dayEvents.length > 3 ? `<div class="month-event-more">+${dayEvents.length - 3} more</div>` : ''}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        this.monthGrid.innerHTML = html;
    }

    /**
     * Create event at specific date and hour
     */
    createEventAt(dateIso, hour) {
        const date = new Date(dateIso);
        date.setHours(hour, 0, 0, 0);

        this.selectedDate = date;
        this.showEventEditor();
    }

    /**
     * Select date (from month view)
     */
    selectDate(dateIso) {
        this.selectedDate = new Date(dateIso);
        this.showEventEditor();
    }

    /**
     * Show event editor modal
     */
    showEventEditor(eventId = null) {
        this.currentEventId = eventId;

        if (eventId) {
            const event = this.events.find(e => e.id === eventId);
            if (event) {
                this.eventTitleInput.value = event.title;
                this.eventTypeSelect.value = event.type;
                this.eventDateInput.value = new Date(event.startTime).toISOString().split('T')[0];
                this.eventStartTimeInput.value = this.formatTimeInput(new Date(event.startTime));
                this.eventEndTimeInput.value = this.formatTimeInput(new Date(event.endTime));
                this.eventCourseInput.value = event.course || '';
                this.eventNotesInput.value = event.notes || '';
                this.eventColorInput.value = event.color;
                this.deleteEventBtn.classList.remove('hidden');
            }
        } else {
            this.eventTitleInput.value = '';
            this.eventTypeSelect.value = 'study';
            this.eventDateInput.value = this.selectedDate.toISOString().split('T')[0];
            this.eventStartTimeInput.value = this.formatTimeInput(this.selectedDate);
            const endTime = new Date(this.selectedDate);
            endTime.setHours(endTime.getHours() + 1);
            this.eventEndTimeInput.value = this.formatTimeInput(endTime);
            this.eventCourseInput.value = '';
            this.eventNotesInput.value = '';
            this.eventColorInput.value = '#21808D';
            this.deleteEventBtn.classList.add('hidden');
        }

        this.eventEditorModal?.classList.remove('hidden');
        this.eventTitleInput?.focus();
    }

    /**
     * Hide event editor modal
     */
    hideEventEditor() {
        this.eventEditorModal?.classList.add('hidden');
        this.currentEventId = null;
    }

    /**
     * Save event
     */
    async saveEvent() {
        const title = this.eventTitleInput?.value.trim();
        const type = this.eventTypeSelect?.value;
        const date = this.eventDateInput?.value;
        const startTime = this.eventStartTimeInput?.value;
        const endTime = this.eventEndTimeInput?.value;
        const course = this.eventCourseInput?.value.trim();
        const notes = this.eventNotesInput?.value.trim();
        const color = this.eventColorInput?.value;

        if (!title || !date || !startTime || !endTime) {
            alert('Please fill in all required fields.');
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);

        if (endDateTime <= startDateTime) {
            alert('End time must be after start time.');
            return;
        }

        if (this.currentEventId) {
            // Edit existing event
            const event = this.events.find(e => e.id === this.currentEventId);
            if (event) {
                event.title = title;
                event.type = type;
                event.startTime = startDateTime.getTime();
                event.endTime = endDateTime.getTime();
                event.course = course;
                event.notes = notes;
                event.color = color;
                event.updatedAt = Date.now();
            }
        } else {
            // Create new event
            const newEvent = {
                id: Date.now().toString(),
                title,
                type,
                startTime: startDateTime.getTime(),
                endTime: endDateTime.getTime(),
                course,
                notes,
                color,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this.events.push(newEvent);
        }

        await this.saveEvents();
        this.hideEventEditor();
        this.renderCalendar();
        this.renderUpcomingEvents();

        console.log('✅ Event saved:', title);
    }

    /**
     * Delete event
     */
    async deleteEvent() {
        if (!confirm('Delete this event?')) return;

        this.events = this.events.filter(e => e.id !== this.currentEventId);
        await this.saveEvents();
        this.hideEventEditor();
        this.renderCalendar();
        this.renderUpcomingEvents();

        console.log('🗑️ Event deleted');
    }

    /**
     * Get events for specific date
     */
    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.startTime);
            return this.isSameDay(eventDate, date);
        }).sort((a, b) => a.startTime - b.startTime);
    }

    /**
     * Check if two dates are same day
     */
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    /**
     * Render upcoming events
     */
    renderUpcomingEvents() {
        if (!this.upcomingEventsList) return;

        const now = new Date();
        const upcoming = this.events
            .filter(e => e.startTime >= now.getTime())
            .sort((a, b) => a.startTime - b.startTime)
            .slice(0, 10);

        if (upcoming.length === 0) {
            this.upcomingEventsList.innerHTML = '<div class="empty-state">No upcoming events</div>';
            return;
        }

        this.upcomingEventsList.innerHTML = upcoming.map(event => {
            const start = new Date(event.startTime);
            const typeIcons = {
                study: '📚',
                exam: '📝',
                deadline: '⏰',
                class: '🏫',
                review: '🔍'
            };

            return `
                <div class="upcoming-event-item" onclick="studyPlanner.showEventEditor('${event.id}')">
                    <div class="upcoming-event-icon">${typeIcons[event.type] || '📌'}</div>
                    <div class="upcoming-event-details">
                        <div class="upcoming-event-title">${this.escapeHtml(event.title)}</div>
                        <div class="upcoming-event-time">
                            ${this.formatDate(start)} at ${this.formatTime(start)}
                        </div>
                        ${event.course ? `<div class="upcoming-event-course">${this.escapeHtml(event.course)}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Format time (HH:MM AM/PM)
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    /**
     * Format time for input (HH:MM 24h)
     */
    formatTimeInput(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Format date
     */
    formatDate(date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (this.isSameDay(date, today)) {
            return 'Today';
        } else if (this.isSameDay(date, tomorrow)) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    /**
     * Load events from storage
     */
    async loadEvents() {
        try {
            const stored = localStorage.getItem('studyPlannerEvents');
            if (stored) {
                this.events = JSON.parse(stored);
                console.log('📅 Loaded', this.events.length, 'planner events');
            }
        } catch (error) {
            console.error('Failed to load planner events:', error);
            this.events = [];
        }
    }

    /**
     * Save events to storage
     */
    async saveEvents() {
        try {
            localStorage.setItem('studyPlannerEvents', JSON.stringify(this.events));
            console.log('💾 Planner events saved');
        } catch (error) {
            console.error('Failed to save planner events:', error);
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
    window.studyPlanner = new StudyPlanner();
    console.log('📅 Study Planner initialized');
});
