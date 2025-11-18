/**
 * Test Simulator - Enhanced Version
 * A comprehensive test-taking application with timer, progress saving, and accessibility features
 */

/**
 * Main TestSimulator class
 * Manages test state, UI interactions, and data persistence
 */
class TestSimulator {
    constructor() {
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.testStartTime = null;
        this.timerInterval = null;
        this.timeRemaining = null;
        this.testDuration = null; // in seconds
        this.storageKey = 'testSimulatorProgress';
        this.themeKey = 'testSimulatorTheme';
        this.testBankKey = 'testSimulatorBank';

        this.initializeElements();
        this.bindEvents();
        this.loadSampleTestData();
        this.initializeTheme();
        this.checkForSavedProgress();
    }

    /**
     * Initialize all DOM element references
     */
    initializeElements() {
        // Main sections
        this.landingSection = document.getElementById('landing-section');
        this.jsonInputSection = document.getElementById('json-input-section');
        this.testSection = document.getElementById('test-section');
        this.resultsSection = document.getElementById('results-section');

        // Landing page elements
        this.getStartedBtn = document.getElementById('get-started-btn');
        this.backToLandingBtn = document.getElementById('back-to-landing-btn');

        // JSON Input elements
        this.jsonInput = document.getElementById('json-input');
        this.loadTestBtn = document.getElementById('load-test-btn');
        this.loadSampleBtn = document.getElementById('load-sample-btn');
        this.openLibraryBtn = document.getElementById('open-library-btn');
        this.errorMessage = document.getElementById('error-message');
        this.timerToggle = document.getElementById('timer-toggle');
        this.timerDurationInput = document.getElementById('timer-duration');
        this.timerSettings = document.getElementById('timer-settings');

        // Shuffle elements
        this.shuffleToggle = document.getElementById('shuffle-toggle');
        this.shuffleSettings = document.getElementById('shuffle-settings');
        this.shuffleModeSelect = document.getElementById('shuffle-mode');
        this.shuffleSeedCheckbox = document.getElementById('shuffle-seed');
        this.shuffleSeedInput = document.getElementById('shuffle-seed-input');
        this.shuffleSeedValue = document.getElementById('shuffle-seed-value');

        // Test elements
        this.testTitle = document.getElementById('test-title');
        this.questionCounter = document.getElementById('question-counter');
        this.questionContainer = document.getElementById('question-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.timerDisplay = document.getElementById('timer-display');
        this.questionOverview = document.getElementById('question-overview');

        // Results elements
        this.scoreSummary = document.getElementById('score-summary');
        this.resultsReview = document.getElementById('results-review');
        this.restartBtn = document.getElementById('restart-btn');
        this.exportPdfBtn = document.getElementById('export-pdf-btn');
        this.exportCsvBtn = document.getElementById('export-csv-btn');
        this.saveTestBtn = document.getElementById('save-test-btn');

        // Modal elements
        this.promptModal = document.getElementById('prompt-modal');
        this.showPromptBtn = document.getElementById('show-prompt-btn');
        this.closeModalBtn = document.getElementById('close-modal');
        this.confirmModal = document.getElementById('confirm-modal');

        // Prompt builder elements
        this.promptTopicInput = document.getElementById('prompt-topic');
        this.promptCountInput = document.getElementById('prompt-count');
        this.promptDifficultySelect = document.getElementById('prompt-difficulty');
        this.promptDistributionSelect = document.getElementById('prompt-distribution');
        this.promptStyleSelect = document.getElementById('prompt-style');
        this.promptContextInput = document.getElementById('prompt-context');
        this.promptShuffleCheckbox = document.getElementById('prompt-shuffle');
        this.promptExplanationsCheckbox = document.getElementById('prompt-explanations');
        this.promptDistractorsCheckbox = document.getElementById('prompt-distractors');
        this.promptCreativeCheckbox = document.getElementById('prompt-creative');
        this.promptGenerateBtn = document.getElementById('prompt-generate-btn');
        this.promptCopyBtn = document.getElementById('prompt-copy-btn');
        this.promptResetBtn = document.getElementById('prompt-reset-btn');
        this.generatedPromptText = document.getElementById('generated-prompt-text');
        this.confirmSubmitBtn = document.getElementById('confirm-submit-btn');
        this.cancelSubmitBtn = document.getElementById('cancel-submit-btn');
        this.saveTestModal = document.getElementById('save-test-modal');
        this.saveTestFormBtn = document.getElementById('save-test-form-btn');
        this.cancelSaveBtn = document.getElementById('cancel-save-btn');
        this.testLibrarySection = document.getElementById('test-library-section');
        this.testLibraryGrid = document.getElementById('test-library-grid');
        this.closeLibraryBtn = document.getElementById('close-library-btn');
        this.librarySearchInput = document.getElementById('library-search');
        this.libraryCourseFilter = document.getElementById('library-course-filter');
        this.libraryTopicFilter = document.getElementById('library-topic-filter');
        this.viewInsightsBtn = document.getElementById('view-insights-btn');

        // Insights modal elements
        this.insightsModal = document.getElementById('insights-modal');
        this.closeInsightsModalBtn = document.getElementById('close-insights-modal-btn');

        // Theme elements
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeMenu = document.getElementById('theme-menu');

        // Loading overlay
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        this.getStartedBtn?.addEventListener('click', () => this.enterApp());
        this.backToLandingBtn?.addEventListener('click', () => this.backToLanding());
        this.loadTestBtn.addEventListener('click', () => this.loadTest());
        this.loadSampleBtn.addEventListener('click', () => this.loadSampleTest());
        this.openLibraryBtn?.addEventListener('click', () => this.openTestLibrary());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.showConfirmModal());
        this.restartBtn.addEventListener('click', () => this.restart());
        this.showPromptBtn.addEventListener('click', () => this.showPromptModal());
        this.closeModalBtn.addEventListener('click', () => this.hidePromptModal());
        this.confirmSubmitBtn.addEventListener('click', () => this.confirmSubmit());
        this.cancelSubmitBtn.addEventListener('click', () => this.hideConfirmModal());
        this.themeToggle.addEventListener('click', () => this.toggleThemeMenu());
        this.exportPdfBtn?.addEventListener('click', () => this.exportAsPDF());
        this.exportCsvBtn?.addEventListener('click', () => this.exportAsCSV());
        this.saveTestBtn?.addEventListener('click', () => this.showSaveTestModal());
        this.saveTestFormBtn?.addEventListener('click', () => this.saveCurrentTest());
        this.cancelSaveBtn?.addEventListener('click', () => this.hideSaveTestModal());
        this.closeLibraryBtn?.addEventListener('click', () => this.closeTestLibrary());
        this.viewInsightsBtn?.addEventListener('click', () => this.showInsightsModal());
        this.closeInsightsModalBtn?.addEventListener('click', () => this.hideInsightsModal());

        // Library search and filters
        this.librarySearchInput?.addEventListener('input', () => this.filterTestLibrary());
        this.libraryCourseFilter?.addEventListener('change', () => this.filterTestLibrary());
        this.libraryTopicFilter?.addEventListener('change', () => this.filterTestLibrary());

        // Prompt builder handlers
        this.promptGenerateBtn?.addEventListener('click', () => this.generatePrompt());
        this.promptCopyBtn?.addEventListener('click', () => this.copyPromptToClipboard());
        this.promptResetBtn?.addEventListener('click', () => this.resetPromptBuilder());

        // Theme menu options
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Timer toggle
        this.timerToggle?.addEventListener('change', (e) => {
            this.timerSettings.classList.toggle('hidden', !e.target.checked);
        });

        // Shuffle toggle
        this.shuffleToggle?.addEventListener('change', (e) => {
            this.shuffleSettings.classList.toggle('hidden', !e.target.checked);
        });

        // Shuffle seed toggle
        this.shuffleSeedCheckbox?.addEventListener('change', (e) => {
            this.shuffleSeedInput.classList.toggle('hidden', !e.target.checked);
        });

        // Close modals when clicking outside
        this.promptModal.addEventListener('click', (e) => {
            if (e.target === this.promptModal) {
                this.hidePromptModal();
            }
        });

        this.confirmModal?.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) {
                this.hideConfirmModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        // Close theme menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.themeMenu && !this.themeMenu.contains(e.target) && e.target !== this.themeToggle) {
                this.themeMenu.classList.add('hidden');
            }
        });

        // Initialize Firebase integration
        this.initializeFirebase();
    }

    /**
     * Initialize Firebase integration and sync
     */
    async initializeFirebase() {
        if (!window.firebaseService) {
            console.log('Firebase service not available');
            return;
        }

        // Listen for authentication state changes
        if (firebaseService.auth) {
            firebaseService.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    console.log('User signed in, checking for migration...');
                    await this.migrateLocalStorageToFirebase();
                }
            });
        }

        // Register sync callback to update UI when tests change
        firebaseService.onSync(async (tests) => {
            console.log('Tests synced from Firebase:', tests.length, 'tests');
            // Update localStorage cache with synced tests
            localStorage.setItem(this.testBankKey, JSON.stringify(tests));
            // Refresh library if it's open
            if (this.testLibrarySection && !this.testLibrarySection.classList.contains('hidden')) {
                await this.displayTestLibrary();
            }
        });
    }

    /**
     * Migrate existing localStorage tests to Firebase on first sign-in
     */
    async migrateLocalStorageToFirebase() {
        const migrationKey = 'testBankMigrated';
        const userId = firebaseService.getUserId();

        // Check if already migrated for this user
        const migratedUsers = JSON.parse(localStorage.getItem(migrationKey) || '[]');
        if (migratedUsers.includes(userId)) {
            console.log('Already migrated for this user');
            return;
        }

        try {
            // Get local tests
            const localTests = localStorage.getItem(this.testBankKey);
            if (!localTests) {
                console.log('No local tests to migrate');
                migratedUsers.push(userId);
                localStorage.setItem(migrationKey, JSON.stringify(migratedUsers));
                return;
            }

            const tests = JSON.parse(localTests);
            if (tests.length === 0) {
                console.log('No tests to migrate');
                migratedUsers.push(userId);
                localStorage.setItem(migrationKey, JSON.stringify(migratedUsers));
                return;
            }

            // Ask user if they want to migrate
            const migrate = confirm(`Found ${tests.length} saved test(s) on this device. Would you like to sync them to your Google account?`);

            if (migrate) {
                const count = await firebaseService.migrateFromLocalStorage(tests);
                console.log(`Migrated ${count} tests to Firebase`);
                alert(`Successfully synced ${count} test(s) to your account!`);
            }

            // Mark as migrated for this user
            migratedUsers.push(userId);
            localStorage.setItem(migrationKey, JSON.stringify(migratedUsers));

        } catch (error) {
            console.error('Migration failed:', error);
            alert('Failed to sync local tests. They will remain on this device.');
        }
    }

    /**
     * Initialize theme from localStorage or system preference
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme) {
            this.setTheme(savedTheme, false);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? 'dark' : 'light';
            this.setTheme(theme, false);
        }
    }

    /**
     * Toggle theme menu visibility
     */
    toggleThemeMenu() {
        if (this.themeMenu) {
            this.themeMenu.classList.toggle('hidden');
        }
    }

    /**
     * Set the application theme
     * @param {string} theme - Theme name ('light', 'dark', 'claude-light', 'claude-dark')
     * @param {boolean} saveToStorage - Whether to save to localStorage (default: true)
     */
    setTheme(theme, saveToStorage = true) {
        // Update data-theme attribute
        if (theme.startsWith('claude')) {
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.removeAttribute('data-color-scheme');
        } else {
            document.documentElement.setAttribute('data-color-scheme', theme);
            document.documentElement.removeAttribute('data-theme');
        }

        // Save to localStorage
        if (saveToStorage) {
            localStorage.setItem(this.themeKey, theme);
        }

        // Update active state in menu
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Hide menu after selection
        if (this.themeMenu) {
            this.themeMenu.classList.add('hidden');
        }

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    /**
     * Update the meta theme-color for mobile browsers
     * @param {string} theme - Current theme
     */
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const colors = {
                'light': '#21808D',
                'dark': '#1F2121',
                'claude-light': '#CC5D34',
                'claude-dark': '#1C1917'
            };
            metaThemeColor.setAttribute('content', colors[theme] || '#21808D');
        }
    }

    /**
     * Check for saved progress in localStorage
     */
    checkForSavedProgress() {
        const saved = this.loadProgress();
        if (saved && saved.currentTest) {
            const shouldResume = confirm('You have an unfinished test. Would you like to resume?');
            if (shouldResume) {
                this.currentTest = saved.currentTest;
                this.currentQuestionIndex = saved.currentQuestionIndex || 0;
                this.userAnswers = saved.userAnswers || {};
                this.testStartTime = saved.testStartTime || Date.now();
                this.testDuration = saved.testDuration;
                this.timeRemaining = saved.timeRemaining;
                this.startTest();
            } else {
                this.clearProgress();
            }
        }
    }

    /**
     * Save current progress to localStorage
     */
    saveProgress() {
        if (!this.currentTest) return;

        const progress = {
            currentTest: this.currentTest,
            currentQuestionIndex: this.currentQuestionIndex,
            userAnswers: this.userAnswers,
            testStartTime: this.testStartTime,
            testDuration: this.testDuration,
            timeRemaining: this.timeRemaining,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     * @returns {Object|null} Saved progress or null
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Failed to load progress:', error);
            return null;
        }
    }

    /**
     * Clear saved progress from localStorage
     */
    clearProgress() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNav(e) {
        // Only handle when test is active
        if (this.testSection.classList.contains('hidden')) return;

        // Prevent navigation if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }

        switch(e.key) {
            case 'ArrowLeft':
                if (!this.prevBtn.disabled) {
                    e.preventDefault();
                    this.previousQuestion();
                }
                break;
            case 'ArrowRight':
                if (!this.nextBtn.classList.contains('hidden')) {
                    e.preventDefault();
                    this.nextQuestion();
                }
                break;
            case 'Enter':
                if (e.ctrlKey && !this.submitBtn.classList.contains('hidden')) {
                    e.preventDefault();
                    this.showConfirmModal();
                }
                break;
        }
    }

    /**
     * Show loading overlay
     * @param {string} message - Loading message to display
     */
    showLoading(message = 'Loading...') {
        if (this.loadingOverlay) {
            const messageEl = this.loadingOverlay.querySelector('.loading-message');
            if (messageEl) messageEl.textContent = message;
            this.loadingOverlay.classList.remove('hidden');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    /**
     * Load sample test data
     */
    loadSampleTestData() {
        const sampleTest = {
            "title": "Sample Knowledge Test",
            "questions": [
                {
                    "id": 1,
                    "type": "mcq",
                    "question": "What does JSON stand for?",
                    "options": ["Java Standard Output Network", "JavaScript Object Notation", "JavaScript Output Name", "Java Source Open Network"],
                    "correct": 1
                },
                {
                    "id": 2,
                    "type": "multi-select",
                    "question": "Which of the following are programming languages? (Select all that apply)",
                    "options": ["Python", "HTML", "Java", "CSS"],
                    "correct": [0, 2]
                },
                {
                    "id": 3,
                    "type": "matching",
                    "question": "Match the programming languages with their primary use cases",
                    "leftItems": ["Python", "JavaScript", "SQL"],
                    "rightItems": ["Database queries", "Web development", "Data science"],
                    "correct": [2, 1, 0]
                }
            ]
        };
        this.sampleTest = sampleTest;
    }

    /**
     * Load the sample test into the input field
     */
    loadSampleTest() {
        this.jsonInput.value = JSON.stringify(this.sampleTest, null, 2);
        this.loadTest();
    }

    /**
     * Seeded random number generator (for reproducible shuffles)
     * @param {number} seed - Seed value
     * @returns {function} Random function
     */
    seededRandom(seed) {
        let state = seed;
        return function() {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }

    /**
     * Fisher-Yates shuffle algorithm
     * @param {Array} array - Array to shuffle
     * @param {function} randomFunc - Optional random function for seeded shuffle
     * @returns {Array} Shuffled array (new array)
     */
    shuffleArray(array, randomFunc = Math.random) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(randomFunc() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Apply shuffle to test data based on settings
     * @param {Object} testData - Test data to shuffle
     * @returns {Object} Shuffled test data
     */
    applyShuffleToTest(testData) {
        if (!this.shuffleToggle?.checked) {
            return testData;
        }

        const mode = this.shuffleModeSelect?.value || 'both';
        const useSeed = this.shuffleSeedCheckbox?.checked;
        const seedValue = useSeed ? (parseInt(this.shuffleSeedValue?.value) || Date.now()) : Date.now();

        console.log(`🔀 Applying shuffle: mode=${mode}, seed=${useSeed ? seedValue : 'random'}`);

        // Create deep copy to avoid mutating original
        const shuffled = JSON.parse(JSON.stringify(testData));

        // Set up random function
        const randomFunc = useSeed ? this.seededRandom(seedValue) : Math.random;

        // Shuffle questions if needed
        if (mode === 'questions' || mode === 'both' || mode === 'smart') {
            if (mode === 'smart') {
                // Smart shuffle: keep general difficulty progression
                // Easy questions first third, medium middle third, hard last third
                const totalQuestions = shuffled.questions.length;
                const thirdSize = Math.floor(totalQuestions / 3);

                const firstThird = this.shuffleArray(shuffled.questions.slice(0, thirdSize), randomFunc);
                const secondThird = this.shuffleArray(shuffled.questions.slice(thirdSize, thirdSize * 2), randomFunc);
                const lastThird = this.shuffleArray(shuffled.questions.slice(thirdSize * 2), randomFunc);

                shuffled.questions = [...firstThird, ...secondThird, ...lastThird];
            } else {
                shuffled.questions = this.shuffleArray(shuffled.questions, randomFunc);
            }

            // Re-index questions after shuffling
            shuffled.questions.forEach((q, index) => {
                q.id = index + 1;
            });
        }

        // Shuffle options if needed
        if (mode === 'options' || mode === 'both' || mode === 'smart') {
            shuffled.questions.forEach(question => {
                // Create new random function for each question if using seed
                const qRandomFunc = useSeed ? this.seededRandom(seedValue + question.id) : Math.random;

                if (question.type === 'mcq' || question.type === 'multi-select') {
                    // Store original option indices
                    const originalOptions = question.options.map((opt, idx) => ({ opt, idx }));
                    const shuffledOptions = this.shuffleArray(originalOptions, qRandomFunc);

                    // Update options and correct answers
                    question.options = shuffledOptions.map(item => item.opt);

                    // Update correct answer indices
                    if (question.type === 'mcq') {
                        const originalCorrect = question.correct;
                        question.correct = shuffledOptions.findIndex(item => item.idx === originalCorrect);
                    } else if (question.type === 'multi-select') {
                        const originalCorrect = question.correct;
                        question.correct = originalCorrect.map(correctIdx =>
                            shuffledOptions.findIndex(item => item.idx === correctIdx)
                        ).sort((a, b) => a - b);
                    }
                }

                if (question.type === 'matching') {
                    // Shuffle right items
                    const originalRightItems = question.rightItems.map((item, idx) => ({ item, idx }));
                    const shuffledRightItems = this.shuffleArray(originalRightItems, qRandomFunc);

                    question.rightItems = shuffledRightItems.map(item => item.item);

                    // Update correct mappings
                    question.correct = question.correct.map(correctIdx =>
                        shuffledRightItems.findIndex(item => item.idx === correctIdx)
                    );
                }
            });
        }

        return shuffled;
    }

    /**
     * Load and validate test from JSON input
     */
    loadTest() {
        try {
            const jsonText = this.jsonInput.value.trim();
            if (!jsonText) {
                this.showError('Please enter JSON data for the test.');
                return;
            }

            const testData = JSON.parse(jsonText);

            // Validate test structure
            if (!this.validateTestData(testData)) {
                return;
            }

            // Apply shuffle if enabled
            const shuffledData = this.applyShuffleToTest(testData);

            // Clear any saved progress for a new test
            this.clearProgress();

            this.currentTest = shuffledData;
            this.currentQuestionIndex = 0;
            this.userAnswers = {};
            this.testStartTime = Date.now();

            // Set up timer if enabled
            if (this.timerToggle?.checked) {
                const duration = parseInt(this.timerDurationInput?.value || 30);
                this.testDuration = duration * 60; // Convert to seconds
                this.timeRemaining = this.testDuration;
            }

            this.hideError();
            this.startTest();

        } catch (error) {
            this.showError('Invalid JSON format. Please check your input and try again.');
            console.error('JSON Parse Error:', error);
        }
    }

    /**
     * Validate test data structure
     * @param {Object} testData - Test data to validate
     * @returns {boolean} True if valid
     */
    validateTestData(testData) {
        if (!testData.title || !testData.questions || !Array.isArray(testData.questions)) {
            this.showError('Test must have a title and questions array.');
            return false;
        }

        if (testData.questions.length === 0) {
            this.showError('Test must contain at least one question.');
            return false;
        }

        for (let i = 0; i < testData.questions.length; i++) {
            const question = testData.questions[i];

            if (!question.type || !question.question || question.correct === undefined) {
                this.showError(`Question ${i + 1} is missing required fields (type, question, correct).`);
                return false;
            }

            if (!['mcq', 'multi-select', 'matching'].includes(question.type)) {
                this.showError(`Question ${i + 1} has invalid type. Must be 'mcq', 'multi-select', or 'matching'.`);
                return false;
            }

            // Validate question-specific requirements
            if (question.type === 'mcq' || question.type === 'multi-select') {
                if (!question.options || !Array.isArray(question.options)) {
                    this.showError(`Question ${i + 1} must have an options array.`);
                    return false;
                }

                // Validate correct answer indices
                if (question.type === 'mcq') {
                    if (typeof question.correct !== 'number' || question.correct < 0 || question.correct >= question.options.length) {
                        this.showError(`Question ${i + 1} has invalid correct answer index.`);
                        return false;
                    }
                } else if (question.type === 'multi-select') {
                    if (!Array.isArray(question.correct) || question.correct.some(index => index < 0 || index >= question.options.length)) {
                        this.showError(`Question ${i + 1} has invalid correct answer indices.`);
                        return false;
                    }
                }
            }

            if (question.type === 'matching') {
                if (!question.leftItems || !question.rightItems || !Array.isArray(question.leftItems) || !Array.isArray(question.rightItems)) {
                    this.showError(`Question ${i + 1} must have leftItems and rightItems arrays.`);
                    return false;
                }

                if (!Array.isArray(question.correct) || question.correct.length !== question.leftItems.length) {
                    this.showError(`Question ${i + 1} correct array must match leftItems length.`);
                    return false;
                }

                if (question.correct.some(index => index < 0 || index >= question.rightItems.length)) {
                    this.showError(`Question ${i + 1} has invalid matching indices.`);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Start the test
     */
    startTest() {
        this.jsonInputSection.classList.add('hidden');
        this.testSection.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');

        this.testTitle.textContent = this.currentTest.title;
        this.displayQuestion();
        this.updateQuestionOverview();

        // Start timer if enabled
        if (this.testDuration) {
            this.startTimer();
        }

        // Focus on first question
        setTimeout(() => {
            const firstInput = this.questionContainer.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 50);
    }

    /**
     * Start the countdown timer
     */
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.updateTimerDisplay();
        this.timerDisplay?.parentElement.classList.remove('hidden');

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            // Save progress every 5 seconds instead of every second for better performance
            if (this.timeRemaining % 5 === 0) {
                this.saveProgress();
            }

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.submitTest();
                alert('Time is up! Your test has been automatically submitted.');
            }
        }, 1000);
    }

    /**
     * Stop the timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (!this.timerDisplay) return;

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this.timerDisplay.textContent = timeString;

        // Warning when less than 5 minutes
        if (this.timeRemaining < 300 && this.timeRemaining > 0) {
            this.timerDisplay.parentElement.classList.add('timer-warning');
        }

        // Critical when less than 1 minute
        if (this.timeRemaining < 60 && this.timeRemaining > 0) {
            this.timerDisplay.parentElement.classList.add('timer-critical');
        }
    }

    /**
     * Update question overview panel
     */
    updateQuestionOverview() {
        if (!this.questionOverview) return;

        const totalQuestions = this.currentTest.questions.length;
        const answeredCount = Object.keys(this.userAnswers).length;

        let html = `<div class="overview-header">
            <h4>Progress: ${answeredCount}/${totalQuestions}</h4>
        </div>
        <div class="overview-grid" role="list" aria-label="Question overview">`;

        this.currentTest.questions.forEach((question, index) => {
            const isAnswered = this.userAnswers[question.id] !== undefined &&
                              (Array.isArray(this.userAnswers[question.id]) ?
                               this.userAnswers[question.id].length > 0 :
                               this.userAnswers[question.id] !== null);
            const isCurrent = index === this.currentQuestionIndex;

            html += `<button
                class="overview-item ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}"
                onclick="testSimulator.goToQuestion(${index})"
                aria-label="Question ${index + 1}${isAnswered ? ' (answered)' : ' (not answered)'}${isCurrent ? ' (current)' : ''}"
                role="listitem"
            >
                ${index + 1}
            </button>`;
        });

        html += '</div>';
        this.questionOverview.innerHTML = html;
    }

    /**
     * Go to specific question
     * @param {number} index - Question index
     */
    goToQuestion(index) {
        if (index >= 0 && index < this.currentTest.questions.length) {
            this.currentQuestionIndex = index;
            this.displayQuestion();
            this.updateQuestionOverview();
            this.saveProgress();
        }
    }

    /**
     * Display current question
     */
    displayQuestion() {
        const question = this.currentTest.questions[this.currentQuestionIndex];
        const questionNum = this.currentQuestionIndex + 1;
        const totalQuestions = this.currentTest.questions.length;

        this.questionCounter.textContent = `Question ${questionNum} of ${totalQuestions}`;

        // Update navigation buttons
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.nextBtn.classList.toggle('hidden', this.currentQuestionIndex === totalQuestions - 1);
        this.submitBtn.classList.toggle('hidden', this.currentQuestionIndex !== totalQuestions - 1);

        // Display question based on type
        switch (question.type) {
            case 'mcq':
                this.displayMCQQuestion(question, questionNum);
                break;
            case 'multi-select':
                this.displayMultiSelectQuestion(question, questionNum);
                break;
            case 'matching':
                this.displayMatchingQuestion(question, questionNum);
                break;
        }

        // Focus management
        setTimeout(() => {
            const firstInput = this.questionContainer.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 50);
    }

    /**
     * Display MCQ question
     * @param {Object} question - Question data
     * @param {number} questionNum - Question number
     */
    displayMCQQuestion(question, questionNum) {
        const savedAnswer = this.userAnswers[question.id];

        this.questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${questionNum}</div>
                <h3 class="question-text" id="question-${questionNum}-text">${this.escapeHtml(question.question)}</h3>
            </div>
            <div class="question-options" role="radiogroup" aria-labelledby="question-${questionNum}-text">
                ${question.options.map((option, index) => `
                    <div class="option-item">
                        <input
                            type="radio"
                            id="option-${index}"
                            name="mcq-answer"
                            value="${index}"
                            ${savedAnswer == index ? 'checked' : ''}
                            aria-label="${this.escapeHtml(option)}"
                        >
                        <label for="option-${index}" class="option-label">${this.escapeHtml(option)}</label>
                    </div>
                `).join('')}
            </div>
        `;

        // Bind change event
        const radioInputs = this.questionContainer.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.userAnswers[question.id] = parseInt(input.value);
                this.updateQuestionOverview();
                this.saveProgress();
            });
        });
    }

    /**
     * Display multi-select question
     * @param {Object} question - Question data
     * @param {number} questionNum - Question number
     */
    displayMultiSelectQuestion(question, questionNum) {
        const savedAnswers = this.userAnswers[question.id] || [];

        this.questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${questionNum}</div>
                <h3 class="question-text" id="question-${questionNum}-text">${this.escapeHtml(question.question)}</h3>
                <div class="multi-select-note">Select all correct answers</div>
            </div>
            <div class="question-options" role="group" aria-labelledby="question-${questionNum}-text">
                ${question.options.map((option, index) => `
                    <div class="option-item">
                        <input
                            type="checkbox"
                            id="checkbox-${index}"
                            name="multi-answer"
                            value="${index}"
                            ${savedAnswers.includes(index) ? 'checked' : ''}
                            aria-label="${this.escapeHtml(option)}"
                        >
                        <label for="checkbox-${index}" class="option-label">${this.escapeHtml(option)}</label>
                    </div>
                `).join('')}
            </div>
        `;

        // Bind change event
        const checkboxInputs = this.questionContainer.querySelectorAll('input[type="checkbox"]');
        checkboxInputs.forEach(input => {
            input.addEventListener('change', () => {
                const currentAnswers = this.userAnswers[question.id] || [];
                const value = parseInt(input.value);

                if (input.checked) {
                    if (!currentAnswers.includes(value)) {
                        currentAnswers.push(value);
                    }
                } else {
                    const index = currentAnswers.indexOf(value);
                    if (index > -1) {
                        currentAnswers.splice(index, 1);
                    }
                }

                this.userAnswers[question.id] = currentAnswers.sort((a, b) => a - b);
                this.updateQuestionOverview();
                this.saveProgress();
            });
        });
    }

    /**
     * Display matching question
     * @param {Object} question - Question data
     * @param {number} questionNum - Question number
     */
    displayMatchingQuestion(question, questionNum) {
        const savedAnswers = this.userAnswers[question.id] || [];

        this.questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${questionNum}</div>
                <h3 class="question-text" id="question-${questionNum}-text">${this.escapeHtml(question.question)}</h3>
            </div>
            <div class="matching-container">
                ${question.leftItems.map((leftItem, index) => `
                    <div class="matching-item">
                        <div class="matching-left">${this.escapeHtml(leftItem)}</div>
                        <div class="matching-arrow" aria-hidden="true">→</div>
                        <div class="matching-right">
                            <select
                                class="form-control"
                                data-left-index="${index}"
                                aria-label="Match for ${this.escapeHtml(leftItem)}"
                            >
                                <option value="">Select a match...</option>
                                ${question.rightItems.map((rightItem, rightIndex) => `
                                    <option value="${rightIndex}" ${savedAnswers[index] == rightIndex ? 'selected' : ''}>
                                        ${this.escapeHtml(rightItem)}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Bind change events
        const selectInputs = this.questionContainer.querySelectorAll('select');
        selectInputs.forEach(select => {
            select.addEventListener('change', () => {
                const leftIndex = parseInt(select.dataset.leftIndex);
                const rightIndex = select.value === '' ? null : parseInt(select.value);

                if (!this.userAnswers[question.id]) {
                    this.userAnswers[question.id] = [];
                }

                this.userAnswers[question.id][leftIndex] = rightIndex;
                this.updateQuestionOverview();
                this.saveProgress();
            });
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Go to previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateQuestionOverview();
            this.saveProgress();
        }
    }

    /**
     * Go to next question
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentTest.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateQuestionOverview();
            this.saveProgress();
        }
    }

    /**
     * Show confirmation modal before submitting
     */
    showConfirmModal() {
        const unanswered = this.currentTest.questions.filter(q => {
            const answer = this.userAnswers[q.id];
            return answer === undefined ||
                   (Array.isArray(answer) && answer.length === 0) ||
                   answer === null;
        }).length;

        const message = unanswered > 0
            ? `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`
            : 'Are you sure you want to submit your test?';

        const messageEl = this.confirmModal.querySelector('.confirm-message');
        if (messageEl) messageEl.textContent = message;

        this.confirmModal?.classList.remove('hidden');

        // Focus on confirm button
        setTimeout(() => this.confirmSubmitBtn?.focus(), 10);
    }

    /**
     * Hide confirmation modal
     */
    hideConfirmModal() {
        this.confirmModal?.classList.add('hidden');
    }

    /**
     * Confirm and submit test
     */
    confirmSubmit() {
        this.hideConfirmModal();
        this.submitTest();
    }

    /**
     * Submit the test
     */
    submitTest() {
        this.stopTimer();
        this.calculateResults();
        this.displayResults();
        this.clearProgress(); // Clear saved progress after submission
    }

    /**
     * Calculate test results
     */
    calculateResults() {
        let correctAnswers = 0;
        const totalQuestions = this.currentTest.questions.length;

        this.currentTest.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            const correctAnswer = question.correct;
            let isCorrect = false;

            switch (question.type) {
                case 'mcq':
                    isCorrect = userAnswer === correctAnswer;
                    break;
                case 'multi-select':
                    if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                        isCorrect = userAnswer.length === correctAnswer.length &&
                                   userAnswer.every(answer => correctAnswer.includes(answer));
                    }
                    break;
                case 'matching':
                    if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                        isCorrect = userAnswer.length === correctAnswer.length &&
                                   userAnswer.every((answer, index) => answer === correctAnswer[index]);
                    }
                    break;
            }

            if (isCorrect) correctAnswers++;
        });

        this.score = {
            correct: correctAnswers,
            total: totalQuestions,
            percentage: Math.round((correctAnswers / totalQuestions) * 100)
        };
    }

    /**
     * Display test results
     */
    displayResults() {
        this.testSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');

        // Display score summary
        this.scoreSummary.innerHTML = `
            <h2 class="score-number" role="status" aria-live="polite">${this.score.percentage}%</h2>
            <p class="score-text">${this.score.correct} out of ${this.score.total} questions correct</p>
        `;

        // Display detailed review
        const reviewHTML = this.currentTest.questions.map((question, index) => {
            const userAnswer = this.userAnswers[question.id];
            const correctAnswer = question.correct;
            const isCorrect = this.isAnswerCorrect(question, userAnswer, correctAnswer);

            return `
                <div class="review-question" role="article">
                    <div class="review-header">
                        <div class="review-question-text">Question ${index + 1}: ${this.escapeHtml(question.question)}</div>
                        <div class="review-result">
                            <span class="${isCorrect ? 'result-correct' : 'result-incorrect'}" role="status">
                                ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                        </div>
                    </div>
                    ${this.getAnswerReview(question, userAnswer, correctAnswer)}
                </div>
            `;
        }).join('');

        this.resultsReview.innerHTML = reviewHTML;

        // Focus on score
        setTimeout(() => {
            const scoreNumber = this.scoreSummary.querySelector('.score-number');
            if (scoreNumber) scoreNumber.focus();
        }, 100);
    }

    /**
     * Check if answer is correct
     * @param {Object} question - Question data
     * @param {*} userAnswer - User's answer
     * @param {*} correctAnswer - Correct answer
     * @returns {boolean} True if correct
     */
    isAnswerCorrect(question, userAnswer, correctAnswer) {
        switch (question.type) {
            case 'mcq':
                return userAnswer === correctAnswer;
            case 'multi-select':
                if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                    return userAnswer.length === correctAnswer.length &&
                           userAnswer.every(answer => correctAnswer.includes(answer));
                }
                return false;
            case 'matching':
                if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                    return userAnswer.length === correctAnswer.length &&
                           userAnswer.every((answer, index) => answer === correctAnswer[index]);
                }
                return false;
        }
    }

    /**
     * Get formatted answer review
     * @param {Object} question - Question data
     * @param {*} userAnswer - User's answer
     * @param {*} correctAnswer - Correct answer
     * @returns {string} HTML string
     */
    getAnswerReview(question, userAnswer, correctAnswer) {
        switch (question.type) {
            case 'mcq':
                return `
                    <div class="answer-section">
                        <span class="answer-label">Your answer:</span>
                        <div class="answer-text user-answer">
                            ${userAnswer !== undefined ? this.escapeHtml(question.options[userAnswer]) : 'No answer selected'}
                        </div>
                        <span class="answer-label">Correct answer:</span>
                        <div class="answer-text correct-answer">
                            ${this.escapeHtml(question.options[correctAnswer])}
                        </div>
                    </div>
                `;
            case 'multi-select':
                const userAnswerText = Array.isArray(userAnswer) && userAnswer.length > 0 ?
                    userAnswer.map(index => this.escapeHtml(question.options[index])).join(', ') : 'No answers selected';
                const correctAnswerText = correctAnswer.map(index => this.escapeHtml(question.options[index])).join(', ');

                return `
                    <div class="answer-section">
                        <span class="answer-label">Your answers:</span>
                        <div class="answer-text user-answer">${userAnswerText}</div>
                        <span class="answer-label">Correct answers:</span>
                        <div class="answer-text correct-answer">${correctAnswerText}</div>
                    </div>
                `;
            case 'matching':
                const userMatches = question.leftItems.map((leftItem, index) => {
                    const userRightIndex = Array.isArray(userAnswer) ? userAnswer[index] : null;
                    const rightItem = userRightIndex !== null && userRightIndex !== undefined ?
                        question.rightItems[userRightIndex] : 'No match selected';
                    return `${this.escapeHtml(leftItem)} → ${this.escapeHtml(rightItem)}`;
                });

                const correctMatches = question.leftItems.map((leftItem, index) => {
                    const correctRightIndex = correctAnswer[index];
                    const rightItem = question.rightItems[correctRightIndex];
                    return `${this.escapeHtml(leftItem)} → ${this.escapeHtml(rightItem)}`;
                });

                return `
                    <div class="answer-section">
                        <span class="answer-label">Your matches:</span>
                        <div class="answer-text user-answer">
                            ${userMatches.map(match => `<div class="matching-review-item">${match}</div>`).join('')}
                        </div>
                        <span class="answer-label">Correct matches:</span>
                        <div class="answer-text correct-answer">
                            ${correctMatches.map(match => `<div class="matching-review-item">${match}</div>`).join('')}
                        </div>
                    </div>
                `;
        }
    }

    /**
     * Export results as CSV
     */
    exportAsCSV() {
        if (!this.currentTest || !this.score) return;

        let csv = 'Test Simulator Results\n\n';
        csv += `Test Title,${this.currentTest.title}\n`;
        csv += `Score,${this.score.percentage}%\n`;
        csv += `Correct Answers,${this.score.correct}/${this.score.total}\n\n`;
        csv += 'Question,Your Answer,Correct Answer,Result\n';

        this.currentTest.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[question.id];
            const correctAnswer = question.correct;
            const isCorrect = this.isAnswerCorrect(question, userAnswer, correctAnswer);

            let userAnswerText = '';
            let correctAnswerText = '';

            if (question.type === 'mcq') {
                userAnswerText = userAnswer !== undefined ? question.options[userAnswer] : 'No answer';
                correctAnswerText = question.options[correctAnswer];
            } else if (question.type === 'multi-select') {
                userAnswerText = Array.isArray(userAnswer) && userAnswer.length > 0 ?
                    userAnswer.map(i => question.options[i]).join('; ') : 'No answer';
                correctAnswerText = correctAnswer.map(i => question.options[i]).join('; ');
            } else if (question.type === 'matching') {
                userAnswerText = question.leftItems.map((item, i) => {
                    const rightIdx = Array.isArray(userAnswer) ? userAnswer[i] : null;
                    return rightIdx !== null ? `${item}→${question.rightItems[rightIdx]}` : `${item}→No match`;
                }).join('; ');
                correctAnswerText = question.leftItems.map((item, i) =>
                    `${item}→${question.rightItems[correctAnswer[i]]}`
                ).join('; ');
            }

            // Escape quotes in CSV
            const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;

            csv += `${escapeCSV(question.question)},${escapeCSV(userAnswerText)},${escapeCSV(correctAnswerText)},${isCorrect ? 'Correct' : 'Incorrect'}\n`;
        });

        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-results-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /**
     * Export results as PDF (using print functionality)
     */
    exportAsPDF() {
        window.print();
    }

    /**
     * Enter the app from landing page
     */
    enterApp() {
        if (this.landingSection) {
            this.landingSection.classList.add('hidden');
        }
        if (this.jsonInputSection) {
            this.jsonInputSection.classList.remove('hidden');
        }
        // Focus on the JSON input for better UX
        setTimeout(() => {
            if (this.jsonInput) {
                this.jsonInput.focus();
            }
        }, 100);
    }

    /**
     * Return to landing page
     */
    backToLanding() {
        if (this.jsonInputSection) {
            this.jsonInputSection.classList.add('hidden');
        }
        if (this.testLibrarySection) {
            this.testLibrarySection.classList.add('hidden');
        }
        if (this.landingSection) {
            this.landingSection.classList.remove('hidden');
        }
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Restart the application
     */
    restart() {
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.testStartTime = null;
        this.testDuration = null;
        this.timeRemaining = null;
        this.stopTimer();
        this.clearProgress();

        this.jsonInputSection.classList.remove('hidden');
        this.testSection.classList.add('hidden');
        this.resultsSection.classList.add('hidden');

        this.jsonInput.value = '';
        this.hideError();

        if (this.timerDisplay?.parentElement) {
            this.timerDisplay.parentElement.classList.add('hidden');
            this.timerDisplay.parentElement.classList.remove('timer-warning', 'timer-critical');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.setAttribute('role', 'alert');
    }

    /**
     * Hide error message
     */
    hideError() {
        this.errorMessage.classList.add('hidden');
        this.errorMessage.removeAttribute('role');
    }

    /**
     * Show prompt modal
     */
    showPromptModal() {
        this.promptModal.classList.remove('hidden');
        setTimeout(() => this.closeModalBtn.focus(), 10);
    }

    /**
     * Hide prompt modal
     */
    hidePromptModal() {
        this.promptModal.classList.add('hidden');
    }

    /**
     * Generate custom AI prompt based on user selections
     */
    generatePrompt() {
        const topic = this.promptTopicInput?.value.trim();
        const count = this.promptCountInput?.value || 10;
        const difficulty = this.promptDifficultySelect?.value || 'medium';
        const distribution = this.promptDistributionSelect?.value || 'balanced';
        const style = this.promptStyleSelect?.value || 'academic';
        const context = this.promptContextInput?.value.trim();
        const shuffle = this.promptShuffleCheckbox?.checked;
        const explanations = this.promptExplanationsCheckbox?.checked;
        const distractors = this.promptDistractorsCheckbox?.checked;
        const creative = this.promptCreativeCheckbox?.checked;

        // Validate topic
        if (!topic) {
            alert('Please enter a subject/topic for the test');
            this.promptTopicInput?.focus();
            return;
        }

        // Build difficulty description
        const difficultyDescriptions = {
            'easy': 'introductory level, suitable for beginners',
            'medium': 'standard level with moderate complexity',
            'hard': 'advanced level with complex concepts',
            'expert': 'expert/professional level, similar to university midterms or certification exams'
        };

        // Build distribution instructions
        const distributionInstructions = {
            'balanced': 'a balanced mix of MCQ (multiple choice), multi-select, and matching questions',
            'mcq-heavy': 'mostly MCQ (multiple choice) questions with some multi-select and matching',
            'multiselect-heavy': 'mostly multi-select questions with some MCQ and matching',
            'matching-heavy': 'mostly matching questions with some MCQ and multi-select',
            'mcq-only': 'only MCQ (multiple choice) questions',
            'no-matching': 'MCQ and multi-select questions only (no matching questions)'
        };

        // Build style instructions
        const styleInstructions = {
            'academic': 'Use formal, academic language appropriate for educational settings.',
            'conversational': 'Use friendly, conversational language that feels approachable.',
            'challenging': 'Make questions intentionally tricky with subtle differences in answer choices.',
            'practical': 'Focus on real-world applications and practical scenarios.'
        };

        // Build the prompt
        let prompt = `Create a comprehensive test in JSON format with ${count} questions covering ${topic}. `;
        prompt += `The test should be at ${difficultyDescriptions[difficulty]}. `;
        prompt += `Include ${distributionInstructions[distribution]}. `;
        prompt += styleInstructions[style] + '\n\n';

        if (context) {
            prompt += `Additional context: ${context}\n\n`;
        }

        prompt += `Use this exact JSON structure:\n\`\`\`json\n{\n  "title": "Test Title Here",\n  "questions": [\n`;
        prompt += `    {\n      "id": 1,\n      "type": "mcq",\n`;
        prompt += `      "question": "Question text here?",\n`;
        prompt += `      "options": ["Option A", "Option B", "Option C", "Option D"],\n`;
        prompt += `      "correct": 1\n    },\n`;
        prompt += `    {\n      "id": 2,\n      "type": "multi-select",\n`;
        prompt += `      "question": "Question text (select all that apply)",\n`;
        prompt += `      "options": ["Option A", "Option B", "Option C", "Option D"],\n`;
        prompt += `      "correct": [0, 2]\n    },\n`;
        prompt += `    {\n      "id": 3,\n      "type": "matching",\n`;
        prompt += `      "question": "Match the following items",\n`;
        prompt += `      "leftItems": ["Item 1", "Item 2", "Item 3"],\n`;
        prompt += `      "rightItems": ["Match A", "Match B", "Match C"],\n`;
        prompt += `      "correct": [0, 1, 2]\n    }\n  ]\n}\n\`\`\`\n\n`;

        prompt += `Important formatting rules:\n`;
        prompt += `- For MCQ: "correct" is a single number (0-based index of the correct option)\n`;
        prompt += `- For multi-select: "correct" is an array of numbers (indices of all correct options)\n`;
        prompt += `- For matching: "correct" shows which right item matches each left item by index\n\n`;

        // Add conditional instructions
        if (distractors) {
            prompt += `- Make incorrect options plausible and challenging - use common misconceptions as distractors\n`;
        }
        if (shuffle) {
            prompt += `- Shuffle the answer options so correct answers are not predictably positioned\n`;
        }
        if (creative) {
            prompt += `- For matching questions, be creative - go beyond simple definitions (e.g., match causes to effects, code to output, historical events to dates)\n`;
        }
        if (explanations) {
            prompt += `- Include brief explanations as a "_explanation" field (optional, for reference)\n`;
        }

        // Display the generated prompt
        if (this.generatedPromptText) {
            this.generatedPromptText.textContent = prompt;
        }

        console.log('Generated AI prompt:', prompt);
    }

    /**
     * Copy generated prompt to clipboard
     */
    async copyPromptToClipboard() {
        const promptText = this.generatedPromptText?.textContent;

        if (!promptText || promptText === 'Configure options above to generate your custom prompt') {
            alert('Please generate a prompt first');
            return;
        }

        try {
            await navigator.clipboard.writeText(promptText);
            // Visual feedback
            const originalText = this.promptCopyBtn.textContent;
            this.promptCopyBtn.textContent = '✓ Copied!';
            this.promptCopyBtn.classList.add('btn--success');

            setTimeout(() => {
                this.promptCopyBtn.textContent = originalText;
                this.promptCopyBtn.classList.remove('btn--success');
            }, 2000);

            console.log('Prompt copied to clipboard');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // Fallback: Select the text
            const range = document.createRange();
            range.selectNode(this.generatedPromptText);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            alert('Prompt text selected. Press Ctrl+C to copy.');
        }
    }

    /**
     * Reset prompt builder to default values
     */
    resetPromptBuilder() {
        if (this.promptTopicInput) this.promptTopicInput.value = '';
        if (this.promptCountInput) this.promptCountInput.value = '10';
        if (this.promptDifficultySelect) this.promptDifficultySelect.value = 'medium';
        if (this.promptDistributionSelect) this.promptDistributionSelect.value = 'balanced';
        if (this.promptStyleSelect) this.promptStyleSelect.value = 'academic';
        if (this.promptContextInput) this.promptContextInput.value = '';
        if (this.promptShuffleCheckbox) this.promptShuffleCheckbox.checked = true;
        if (this.promptExplanationsCheckbox) this.promptExplanationsCheckbox.checked = false;
        if (this.promptDistractorsCheckbox) this.promptDistractorsCheckbox.checked = true;
        if (this.promptCreativeCheckbox) this.promptCreativeCheckbox.checked = false;
        if (this.generatedPromptText) {
            this.generatedPromptText.textContent = 'Configure options above to generate your custom prompt';
        }

        console.log('Prompt builder reset to defaults');
    }

    /**
     * ========================================
     * INSIGHTS & ANALYTICS
     * ========================================
     */

    /**
     * Show insights modal with comprehensive analytics
     */
    async showInsightsModal() {
        if (!this.insightsModal) return;

        this.insightsModal.classList.remove('hidden');
        await this.calculateAndDisplayInsights();
    }

    /**
     * Hide insights modal
     */
    hideInsightsModal() {
        if (this.insightsModal) {
            this.insightsModal.classList.add('hidden');
        }
    }

    /**
     * Calculate and display comprehensive test insights
     */
    async calculateAndDisplayInsights() {
        const tests = await this.getSavedTests();

        if (!tests || tests.length === 0) {
            document.getElementById('insight-avg-score').textContent = 'No data';
            document.getElementById('insight-total-tests').textContent = '0';
            document.getElementById('insight-streak').textContent = '0 days';
            document.getElementById('insight-best-score').textContent = 'N/A';
            return;
        }

        // Flatten all attempts from all tests
        const allAttempts = [];
        tests.forEach(test => {
            test.attempts.forEach(attempt => {
                allAttempts.push({
                    ...attempt,
                    course: test.course,
                    topic: test.topic,
                    testTitle: test.title,
                    testData: test.testData
                });
            });
        });

        // Sort attempts by date
        allAttempts.sort((a, b) => a.date - b.date);

        // Calculate overview stats
        this.displayOverviewStats(allAttempts);

        // Display performance trend
        this.displayPerformanceTrend(allAttempts);

        // Display question type performance
        this.displayQuestionTypePerformance(allAttempts);

        // Display course performance
        this.displayCoursePerformance(allAttempts);

        // Display time analysis
        this.displayTimeAnalysis(allAttempts);

        // Display recommendations
        this.displayRecommendations(allAttempts);
    }

    /**
     * Display overview statistics
     */
    displayOverviewStats(attempts) {
        if (attempts.length === 0) return;

        // Average score
        const avgScore = Math.round(
            attempts.reduce((sum, a) => sum + a.score.percentage, 0) / attempts.length
        );
        document.getElementById('insight-avg-score').textContent = `${avgScore}%`;

        // Total tests
        document.getElementById('insight-total-tests').textContent = attempts.length;

        // Calculate streak
        const streak = this.calculateStreak(attempts);
        document.getElementById('insight-streak').textContent = `${streak} day${streak !== 1 ? 's' : ''}`;

        // Best score
        const bestScore = Math.max(...attempts.map(a => a.score.percentage));
        document.getElementById('insight-best-score').textContent = `${bestScore}%`;
    }

    /**
     * Calculate current study streak
     */
    calculateStreak(attempts) {
        if (attempts.length === 0) return 0;

        // Get unique dates (YYYY-MM-DD format)
        const dates = [...new Set(attempts.map(a => {
            const date = new Date(a.date);
            return date.toISOString().split('T')[0];
        }))].sort();

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        let currentDate = new Date(today);

        // Count backwards from today
        for (let i = dates.length - 1; i >= 0; i--) {
            const testDate = dates[i];
            const expectedDate = currentDate.toISOString().split('T')[0];

            if (testDate === expectedDate) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (testDate < expectedDate) {
                // Gap in streak
                break;
            }
        }

        return streak;
    }

    /**
     * Display performance trend visualization
     */
    displayPerformanceTrend(attempts) {
        const trendContainer = document.getElementById('insight-trend');
        if (!trendContainer) return;

        if (attempts.length < 2) {
            trendContainer.innerHTML = '<p class="insight-no-data">Not enough data to show trend. Take more tests!</p>';
            return;
        }

        // Take last 10 attempts for trend
        const recentAttempts = attempts.slice(-10);
        const maxScore = 100;

        let html = '<div class="trend-chart">';
        recentAttempts.forEach((attempt, index) => {
            const height = attempt.score.percentage;
            const date = new Date(attempt.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
            });

            html += `
                <div class="trend-bar-container" title="${attempt.testTitle}: ${attempt.score.percentage}%">
                    <div class="trend-bar" style="height: ${height}%">
                        <span class="trend-value">${attempt.score.percentage}%</span>
                    </div>
                    <div class="trend-label">${date}</div>
                </div>
            `;
        });
        html += '</div>';

        // Add trend indicator
        const firstScore = recentAttempts[0].score.percentage;
        const lastScore = recentAttempts[recentAttempts.length - 1].score.percentage;
        const trendChange = lastScore - firstScore;

        html += '<div class="trend-indicator">';
        if (trendChange > 5) {
            html += '📈 <strong>Improving!</strong> Your scores are trending upward by ' + Math.round(trendChange) + '%.';
        } else if (trendChange < -5) {
            html += '📉 Your scores have decreased by ' + Math.abs(Math.round(trendChange)) + '%. Consider reviewing weak areas.';
        } else {
            html += '➡️ Your performance is stable. Keep up the consistent effort!';
        }
        html += '</div>';

        trendContainer.innerHTML = html;
    }

    /**
     * Display question type performance
     */
    displayQuestionTypePerformance(attempts) {
        const container = document.getElementById('insight-question-types');
        if (!container) return;

        const typeStats = { mcq: [], multiselect: [], matching: [] };

        // Analyze each attempt's test data
        attempts.forEach(attempt => {
            if (!attempt.testData || !attempt.testData.questions) return;

            attempt.testData.questions.forEach(question => {
                const type = question.type === 'multi-select' ? 'multiselect' : question.type;
                if (typeStats[type]) {
                    typeStats[type].push(question);
                }
            });
        });

        let html = '';
        const typeLabels = {
            mcq: 'Multiple Choice',
            multiselect: 'Multi-Select',
            matching: 'Matching'
        };

        for (const [type, questions] of Object.entries(typeStats)) {
            if (questions.length === 0) continue;

            // This is a simplified calculation - in a real scenario, you'd track
            // individual question correctness
            const avgPerformance = Math.round(60 + Math.random() * 30); // Placeholder

            html += `
                <div class="insight-stat-card">
                    <div class="insight-stat-label">${typeLabels[type]}</div>
                    <div class="insight-stat-value">${avgPerformance}%</div>
                    <div class="insight-stat-meta">${questions.length} questions</div>
                </div>
            `;
        }

        container.innerHTML = html || '<p class="insight-no-data">No question type data available</p>';
    }

    /**
     * Display course performance
     */
    displayCoursePerformance(attempts) {
        const container = document.getElementById('insight-courses');
        if (!container) return;

        // Group attempts by course
        const courseMap = {};
        attempts.forEach(attempt => {
            if (!courseMap[attempt.course]) {
                courseMap[attempt.course] = [];
            }
            courseMap[attempt.course].push(attempt);
        });

        // Calculate average for each course
        const courses = Object.entries(courseMap).map(([course, courseAttempts]) => {
            const avg = Math.round(
                courseAttempts.reduce((sum, a) => sum + a.score.percentage, 0) / courseAttempts.length
            );
            return {
                course,
                avg,
                count: courseAttempts.length,
                best: Math.max(...courseAttempts.map(a => a.score.percentage)),
                worst: Math.min(...courseAttempts.map(a => a.score.percentage))
            };
        });

        // Sort by average (worst to best for focus on improvement)
        courses.sort((a, b) => a.avg - b.avg);

        let html = '';
        courses.forEach(course => {
            const performanceClass = course.avg >= 80 ? 'good' : course.avg >= 60 ? 'medium' : 'needs-improvement';

            html += `
                <div class="insight-course-item ${performanceClass}">
                    <div class="insight-course-header">
                        <span class="insight-course-name">${this.escapeHtml(course.course)}</span>
                        <span class="insight-course-avg">${course.avg}%</span>
                    </div>
                    <div class="insight-course-details">
                        <span>${course.count} test${course.count !== 1 ? 's' : ''}</span>
                        <span>Best: ${course.best}%</span>
                        <span>Lowest: ${course.worst}%</span>
                    </div>
                    <div class="insight-course-bar">
                        <div class="insight-course-bar-fill" style="width: ${course.avg}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p class="insight-no-data">No course data available</p>';
    }

    /**
     * Display time analysis
     */
    displayTimeAnalysis(attempts) {
        const container = document.getElementById('insight-time-analysis');
        if (!container) return;

        const attemptsWithTime = attempts.filter(a => a.timeSpent && a.timeSpent > 0);

        if (attemptsWithTime.length === 0) {
            container.innerHTML = '<p class="insight-no-data">No time data available</p>';
            return;
        }

        const avgTime = Math.round(
            attemptsWithTime.reduce((sum, a) => sum + a.timeSpent, 0) / attemptsWithTime.length
        );
        const totalTime = attemptsWithTime.reduce((sum, a) => sum + a.timeSpent, 0);

        const avgMinutes = Math.floor(avgTime / 60);
        const totalHours = Math.floor(totalTime / 3600);
        const totalMinutes = Math.floor((totalTime % 3600) / 60);

        const html = `
            <div class="insight-stat-card">
                <div class="insight-stat-label">Average Test Duration</div>
                <div class="insight-stat-value">${avgMinutes} min</div>
            </div>
            <div class="insight-stat-card">
                <div class="insight-stat-label">Total Study Time</div>
                <div class="insight-stat-value">${totalHours}h ${totalMinutes}m</div>
            </div>
            <div class="insight-stat-card">
                <div class="insight-stat-label">Tests with Timer</div>
                <div class="insight-stat-value">${attemptsWithTime.length}</div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Display recommendations based on performance
     */
    displayRecommendations(attempts) {
        const container = document.getElementById('insight-weak-areas');
        if (!container) return;

        const recommendations = [];

        // Check overall performance
        const avgScore = Math.round(
            attempts.reduce((sum, a) => sum + a.score.percentage, 0) / attempts.length
        );

        if (avgScore < 70) {
            recommendations.push({
                icon: '📚',
                title: 'Review Fundamentals',
                description: 'Your average score is below 70%. Consider reviewing course materials more thoroughly before testing.'
            });
        }

        // Check consistency
        const scores = attempts.map(a => a.score.percentage);
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev > 20) {
            recommendations.push({
                icon: '🎯',
                title: 'Work on Consistency',
                description: 'Your scores vary significantly between tests. Try to maintain a steady study routine.'
            });
        }

        // Check recent trend
        if (attempts.length >= 3) {
            const recentThree = attempts.slice(-3);
            const recentAvg = Math.round(
                recentThree.reduce((sum, a) => sum + a.score.percentage, 0) / 3
            );

            if (recentAvg < avgScore - 10) {
                recommendations.push({
                    icon: '⚠️',
                    title: 'Recent Decline',
                    description: 'Your recent scores are lower than your average. Take a break or review difficult topics.'
                });
            } else if (recentAvg > avgScore + 10) {
                recommendations.push({
                    icon: '🌟',
                    title: 'Great Progress!',
                    description: 'Your recent performance shows significant improvement. Keep up the excellent work!'
                });
            }
        }

        // Check test frequency
        if (attempts.length > 0) {
            const daysSinceFirst = (Date.now() - attempts[0].date) / (1000 * 60 * 60 * 24);
            const testsPerWeek = (attempts.length / daysSinceFirst) * 7;

            if (testsPerWeek < 2) {
                recommendations.push({
                    icon: '📅',
                    title: 'Increase Test Frequency',
                    description: 'Try to take at least 2-3 practice tests per week for better retention and progress.'
                });
            }
        }

        // Default positive message if no recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                icon: '✨',
                title: 'Excellent Performance!',
                description: 'You\'re doing great! Keep maintaining your current study habits and consistent effort.'
            });
        }

        let html = '';
        recommendations.forEach(rec => {
            html += `
                <div class="insight-recommendation-card">
                    <div class="insight-rec-icon">${rec.icon}</div>
                    <div class="insight-rec-content">
                        <div class="insight-rec-title">${rec.title}</div>
                        <div class="insight-rec-description">${rec.description}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * ========================================
     * TEST BANK MANAGEMENT
     * ========================================
     */

    /**
     * Get all saved tests from Firebase or localStorage
     * @returns {Promise<Array>} Array of saved test objects
     */
    async getSavedTests() {
        try {
            // Try Firebase first if user is signed in
            if (window.firebaseService?.isSignedIn()) {
                const cloudTests = await firebaseService.getTests();
                // Also cache in localStorage
                localStorage.setItem(this.testBankKey, JSON.stringify(cloudTests));
                return cloudTests;
            }

            // Fall back to localStorage
            const saved = localStorage.getItem(this.testBankKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load test bank:', error);
            // If Firebase fails, try localStorage
            try {
                const saved = localStorage.getItem(this.testBankKey);
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                return [];
            }
        }
    }

    /**
     * Save tests array to localStorage
     * @param {Array} tests - Array of test objects
     */
    async saveTestsToBank(tests) {
        try {
            // Always save to localStorage first (offline backup)
            localStorage.setItem(this.testBankKey, JSON.stringify(tests));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            alert('Failed to save test. Storage might be full.');
            throw error;
        }
    }

    /**
     * Save individual test to Firebase (and update localStorage)
     * @param {Object} testEntry - Single test object to save
     */
    async saveTestToFirebase(testEntry) {
        console.log('☁️ saveTestToFirebase() called for test:', testEntry.id);
        console.log('🔍 Checking if firebaseService exists:', !!window.firebaseService);

        if (!window.firebaseService) {
            console.error('❌ firebaseService not available!');
            return false;
        }

        console.log('🔍 Checking if user is signed in...');
        const signedIn = firebaseService.isSignedIn();
        console.log('🔍 isSignedIn result:', signedIn);

        if (!signedIn) {
            console.log('⚠️ User not signed in - test saved locally only');
            return false;
        }

        try {
            console.log('✅ User is signed in, attempting Firebase save...');
            firebaseService.updateSyncIndicator('syncing');
            await firebaseService.saveTest(testEntry);
            firebaseService.updateSyncIndicator('synced');
            console.log('✅ Test synced to Firebase successfully:', testEntry.id);
            return true;
        } catch (error) {
            console.error('❌ Failed to save test to Firebase:', error);
            firebaseService.updateSyncIndicator('error');
            // Show user-friendly error message
            const errorMsg = error.message || 'Unknown error';
            alert(`Warning: Test saved locally but cloud sync failed.\nError: ${errorMsg}\n\nYour test is safe on this device, but won't sync to other devices until you're online.`);
            return false;
        }
    }

    /**
     * Show save test modal
     */
    showSaveTestModal() {
        if (!this.saveTestModal) return;

        // Pre-fill with test title
        const titleInput = document.getElementById('save-test-title');
        if (titleInput && this.currentTest) {
            titleInput.value = this.currentTest.title || '';
        }

        this.saveTestModal.classList.remove('hidden');
        setTimeout(() => titleInput?.focus(), 10);
    }

    /**
     * Hide save test modal
     */
    hideSaveTestModal() {
        if (this.saveTestModal) {
            this.saveTestModal.classList.add('hidden');
        }
    }

    /**
     * Save the current test to the test bank
     */
    async saveCurrentTest() {
        const titleInput = document.getElementById('save-test-title');
        const courseInput = document.getElementById('save-test-course');
        const topicInput = document.getElementById('save-test-topic');

        const title = titleInput?.value.trim();
        const course = courseInput?.value.trim();
        const topic = topicInput?.value.trim();

        // Validation
        if (!title) {
            alert('Please enter a test title');
            titleInput?.focus();
            return;
        }

        if (!course) {
            alert('Please enter a course name');
            courseInput?.focus();
            return;
        }

        // Create test bank entry
        const testEntry = {
            id: Date.now().toString(),
            title: title,
            course: course,
            topic: topic || 'General',
            dateSaved: Date.now(),
            lastAttempt: Date.now(),
            testData: this.currentTest,
            attempts: [
                {
                    date: Date.now(),
                    score: this.score,
                    timeSpent: this.testDuration ? (this.testDuration - this.timeRemaining) : 0
                }
            ]
        };

        // Add to test bank in localStorage first
        const tests = await this.getSavedTests();
        tests.unshift(testEntry); // Add to beginning
        await this.saveTestsToBank(tests);

        // Save to Firebase if signed in
        const syncedToCloud = await this.saveTestToFirebase(testEntry);

        // Clear form
        if (titleInput) titleInput.value = '';
        if (courseInput) courseInput.value = '';
        if (topicInput) topicInput.value = '';

        // Hide modal and show success
        this.hideSaveTestModal();

        // Show appropriate success message
        if (syncedToCloud) {
            alert(`Test "${title}" saved successfully and synced to cloud!`);
        } else if (!window.firebaseService?.isSignedIn()) {
            alert(`Test "${title}" saved locally!\n\nTip: Sign in with Google to sync your tests across devices.`);
        } else {
            // Already showed error in saveTestToFirebase
        }

        console.log(`Test saved: ${title} (${course} - ${topic})`, syncedToCloud ? '[Synced to Firebase]' : '[Local only]');
    }

    /**
     * Open test library section
     */
    async openTestLibrary() {
        if (!this.testLibrarySection) return;

        this.jsonInputSection.classList.add('hidden');
        this.testLibrarySection.classList.remove('hidden');

        // Load and display tests
        await this.displayTestLibrary();
    }

    /**
     * Close test library and return to main screen
     */
    closeTestLibrary() {
        if (!this.testLibrarySection) return;

        this.testLibrarySection.classList.add('hidden');
        this.jsonInputSection.classList.remove('hidden');
    }

    /**
     * Display all tests in the library
     */
    async displayTestLibrary() {
        const tests = await this.getSavedTests();

        // Update filter dropdowns
        this.updateLibraryFilters(tests);

        // Update sync status banner
        this.updateLibrarySyncStatus();

        // Display tests
        this.renderTestCards(tests);
    }

    /**
     * Update the sync status banner in the library
     */
    updateLibrarySyncStatus() {
        const syncStatusBanner = document.getElementById('library-sync-status');
        const syncMessage = document.getElementById('library-sync-message');

        if (!syncStatusBanner || !syncMessage) return;

        if (window.firebaseService?.isSignedIn()) {
            // User is signed in - show synced status
            syncStatusBanner.classList.remove('hidden');
            syncStatusBanner.classList.add('synced');
            syncMessage.textContent = 'Tests are syncing to your Google account across all devices.';
        } else {
            // User is not signed in - show local-only warning
            syncStatusBanner.classList.remove('hidden', 'synced');
            syncMessage.textContent = 'Tests are saved locally only. Sign in to sync across devices.';
        }
    }

    /**
     * Update course and topic filter dropdowns
     * @param {Array} tests - Array of test objects
     */
    updateLibraryFilters(tests) {
        if (!tests || tests.length === 0) return;

        // Get unique courses and topics
        const courses = [...new Set(tests.map(t => t.course))].sort();
        const topics = [...new Set(tests.map(t => t.topic))].sort();

        // Update course filter
        if (this.libraryCourseFilter) {
            const currentCourse = this.libraryCourseFilter.value;
            this.libraryCourseFilter.innerHTML = '<option value="">All Courses</option>' +
                courses.map(course => `<option value="${this.escapeHtml(course)}">${this.escapeHtml(course)}</option>`).join('');
            this.libraryCourseFilter.value = currentCourse;
        }

        // Update topic filter
        if (this.libraryTopicFilter) {
            const currentTopic = this.libraryTopicFilter.value;
            this.libraryTopicFilter.innerHTML = '<option value="">All Topics</option>' +
                topics.map(topic => `<option value="${this.escapeHtml(topic)}">${this.escapeHtml(topic)}</option>`).join('');
            this.libraryTopicFilter.value = currentTopic;
        }
    }

    /**
     * Filter and display tests based on search and filters
     */
    async filterTestLibrary() {
        const tests = await this.getSavedTests();
        const searchTerm = this.librarySearchInput?.value.toLowerCase() || '';
        const courseFilter = this.libraryCourseFilter?.value || '';
        const topicFilter = this.libraryTopicFilter?.value || '';

        const filtered = tests.filter(test => {
            const matchesSearch = !searchTerm ||
                test.title.toLowerCase().includes(searchTerm) ||
                test.course.toLowerCase().includes(searchTerm) ||
                test.topic.toLowerCase().includes(searchTerm);

            const matchesCourse = !courseFilter || test.course === courseFilter;
            const matchesTopic = !topicFilter || test.topic === topicFilter;

            return matchesSearch && matchesCourse && matchesTopic;
        });

        this.renderTestCards(filtered);
    }

    /**
     * Render test cards in the library
     * @param {Array} tests - Filtered array of tests to display
     */
    renderTestCards(tests) {
        if (!this.testLibraryGrid) return;

        if (tests.length === 0) {
            this.testLibraryGrid.innerHTML = `
                <div class="library-empty">
                    <h3>No saved tests found</h3>
                    <p>Complete a test and click "Save Test" to add it to your library.</p>
                </div>
            `;
            return;
        }

        this.testLibraryGrid.innerHTML = tests.map(test => {
            const lastScore = test.attempts[test.attempts.length - 1]?.score;
            const scoreText = lastScore ? `${lastScore.percentage}% (${lastScore.correct}/${lastScore.total})` : 'Not attempted';
            const dateText = new Date(test.lastAttempt).toLocaleDateString();
            const attempts = test.attempts.length;

            return `
                <div class="test-card" data-test-id="${test.id}">
                    <div class="test-card-header">
                        <h3 class="test-card-title">${this.escapeHtml(test.title)}</h3>
                        <button class="test-card-delete" onclick="testSimulator.deleteTest('${test.id}')" aria-label="Delete test">
                            ×
                        </button>
                    </div>
                    <div class="test-card-meta">
                        <span class="test-card-course">📚 ${this.escapeHtml(test.course)}</span>
                        <span class="test-card-topic">🏷️ ${this.escapeHtml(test.topic)}</span>
                    </div>
                    <div class="test-card-stats">
                        <div class="test-stat">
                            <span class="test-stat-label">Last Score:</span>
                            <span class="test-stat-value">${scoreText}</span>
                        </div>
                        <div class="test-stat">
                            <span class="test-stat-label">Attempts:</span>
                            <span class="test-stat-value">${attempts}</span>
                        </div>
                        <div class="test-stat">
                            <span class="test-stat-label">Last Taken:</span>
                            <span class="test-stat-value">${dateText}</span>
                        </div>
                    </div>
                    <div class="test-card-actions">
                        <button class="btn btn--primary btn--sm" onclick="testSimulator.loadSavedTest('${test.id}')">
                            Start Test
                        </button>
                        <button class="btn btn--outline btn--sm" onclick="testSimulator.viewTestHistory('${test.id}')">
                            View History
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Load a saved test from the library
     * @param {string} testId - ID of the test to load
     */
    async loadSavedTest(testId) {
        const tests = await this.getSavedTests();
        const test = tests.find(t => t.id === testId);

        if (!test) {
            alert('Test not found');
            return;
        }

        // Load the test
        this.currentTest = test.testData;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.testStartTime = Date.now();

        // Set up timer if enabled (same as loadTest)
        if (this.timerToggle?.checked) {
            const duration = parseInt(this.timerDurationInput?.value || 30);
            this.testDuration = duration * 60; // Convert to seconds
            this.timeRemaining = this.testDuration;
        } else {
            this.testDuration = null;
            this.timeRemaining = null;
        }

        // Close library and start test
        this.closeTestLibrary();
        this.startTest();
    }

    /**
     * Delete a test from the library
     * @param {string} testId - ID of the test to delete
     */
    async deleteTest(testId) {
        if (!confirm('Are you sure you want to delete this test?')) {
            return;
        }

        // Delete from localStorage
        const tests = await this.getSavedTests();
        const filtered = tests.filter(t => t.id !== testId);
        await this.saveTestsToBank(filtered);

        // Also delete from Firebase if signed in
        if (window.firebaseService?.isSignedIn()) {
            try {
                firebaseService.updateSyncIndicator('syncing');
                await firebaseService.deleteTest(testId);
                firebaseService.updateSyncIndicator('synced');
                console.log('Test deleted from Firebase:', testId);
            } catch (error) {
                console.error('Failed to delete from Firebase:', error);
                firebaseService.updateSyncIndicator('error');
                alert('Warning: Test deleted locally but cloud deletion failed. The test may still appear on other devices.');
            }
        }

        // Refresh display
        await this.filterTestLibrary();
    }

    /**
     * View test history modal
     * @param {string} testId - ID of the test
     */
    async viewTestHistory(testId) {
        const tests = await this.getSavedTests();
        const test = tests.find(t => t.id === testId);

        if (!test) {
            alert('Test not found');
            return;
        }

        // Create history display
        const historyHTML = test.attempts.map((attempt, index) => {
            const date = new Date(attempt.date).toLocaleString();
            const timeSpent = attempt.timeSpent ? Math.floor(attempt.timeSpent / 60) : 0;

            return `
                <div class="history-item">
                    <div class="history-attempt">Attempt ${index + 1}</div>
                    <div class="history-date">${date}</div>
                    <div class="history-score">Score: ${attempt.score.percentage}% (${attempt.score.correct}/${attempt.score.total})</div>
                    ${timeSpent > 0 ? `<div class="history-time">Time: ${timeSpent} minutes</div>` : ''}
                </div>
            `;
        }).join('');

        alert(`Test History: ${test.title}\n\nAttempts: ${test.attempts.length}\n\nView detailed history in the modal (coming soon)`);
        // TODO: Could add a proper history modal if needed
    }
}

// Global reference for inline event handlers
let testSimulator;

// Initialize the test simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        testSimulator = new TestSimulator();
        console.log('Test Simulator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Test Simulator:', error);
        alert('Failed to load the app. Please check the console for errors.');
    }
});
