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
        this.flaggedQuestions = new Set(); // Track flagged questions by ID
        this.questionConfidence = {}; // Track confidence level per question
        this.testStartTime = null;
        this.timerInterval = null;
        this.timeRemaining = null;
        this.testDuration = null; // in seconds
        this.testMode = 'exam'; // 'exam' or 'practice'
        this.isReviewSession = false; // true when reviewing wrong answers
        this.timeWarningsShown = new Set(); // Track which time warnings have been shown
        this.storageKey = 'testSimulatorProgress';
        this.themeKey = 'testSimulatorTheme';
        this.testBankKey = 'testSimulatorBank';

        // Test Builder properties
        this.builderQuestions = [];
        this.builderCurrentQuestionIndex = null;
        this.builderEditMode = false;

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
        this.reviewWrongBtn = document.getElementById('review-wrong-btn');
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

        // Test Builder elements
        this.testBuilderSection = document.getElementById('test-builder-section');
        this.openTestBuilderBtn = document.getElementById('open-test-builder-btn');
        this.closeTestBuilderBtn = document.getElementById('close-test-builder-btn');
        this.builderTestTitle = document.getElementById('builder-test-title');
        this.builderTestCourse = document.getElementById('builder-test-course');
        this.builderTestTopic = document.getElementById('builder-test-topic');
        this.builderQuestionCount = document.getElementById('builder-question-count');
        this.builderQuestionList = document.getElementById('builder-question-list');
        this.builderAddQuestionBtn = document.getElementById('builder-add-question-btn');
        this.builderEditorEmpty = document.getElementById('builder-editor-empty');
        this.builderEditorForm = document.getElementById('builder-editor-form');
        this.builderQuestionType = document.getElementById('builder-question-type');
        this.builderQuestionText = document.getElementById('builder-question-text');
        this.builderMcqOptionsContainer = document.getElementById('builder-mcq-options-container');
        this.builderMatchingOptionsContainer = document.getElementById('builder-matching-options-container');
        this.builderTrueFalseContainer = document.getElementById('builder-true-false-container');
        this.builderFillBlankContainer = document.getElementById('builder-fill-blank-container');
        this.builderOrderingContainer = document.getElementById('builder-ordering-container');
        this.builderOptionsList = document.getElementById('builder-options-list');
        this.builderMatchingPairsList = document.getElementById('builder-matching-pairs-list');
        this.builderOrderingItemsList = document.getElementById('builder-ordering-items-list');
        this.builderFillAcceptedAnswersInput = document.getElementById('builder-fill-accepted-answers');
        this.builderFillCaseSensitiveCheckbox = document.getElementById('builder-fill-case-sensitive');
        this.builderAddOptionBtn = document.getElementById('builder-add-option-btn');
        this.builderAddMatchingPairBtn = document.getElementById('builder-add-matching-pair-btn');
        this.builderAddOrderingItemBtn = document.getElementById('builder-add-ordering-item-btn');
        this.builderSaveQuestionBtn = document.getElementById('builder-save-question-btn');
        this.builderCancelQuestionBtn = document.getElementById('builder-cancel-question-btn');
        this.builderDeleteQuestionBtn = document.getElementById('builder-delete-question-btn');
        this.testBuilderExportBtn = document.getElementById('test-builder-export-btn');
        this.testBuilderPreviewBtn = document.getElementById('test-builder-preview-btn');

        // Analytics Dashboard elements
        this.analyticsSection = document.getElementById('analytics-section');
        this.openAnalyticsBtn = document.getElementById('open-analytics-btn');
        this.closeAnalyticsBtn = document.getElementById('close-analytics-btn');
        this.achievementGallery = document.getElementById('achievement-gallery');
        this.questionTypeChart = document.getElementById('question-type-chart');
        this.performanceTrendsChart = document.getElementById('performance-trends-chart');
        this.courseTopicBreakdown = document.getElementById('course-topic-breakdown');
        this.currentTrendsPeriod = 7; // Default to 7 days

        // Study Queue (SRS) elements
        this.studyQueueSection = document.getElementById('study-queue-section');
        this.openStudyQueueBtn = document.getElementById('open-study-queue-btn');
        this.closeStudyQueueBtn = document.getElementById('close-study-queue-btn');
        this.dueCardsList = document.getElementById('due-cards-list');
        this.upcomingReviews = document.getElementById('upcoming-reviews');
        this.retentionPredictionChart = document.getElementById('retention-prediction-chart');
        this.studyDueCardsBtn = document.getElementById('study-due-cards-btn');
        this.exportSRSBtn = document.getElementById('export-srs-btn');
        this.importSRSBtn = document.getElementById('import-srs-btn');
        this.importSRSFile = document.getElementById('import-srs-file');

        // Initialize gamification system
        this.gamification = new GamificationSystem();

        // Initialize spaced repetition system
        this.srs = new SpacedRepetitionSystem();
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
        this.reviewWrongBtn?.addEventListener('click', () => this.reviewWrongAnswers());
        this.showPromptBtn.addEventListener('click', () => this.showPromptModal());
        this.closeModalBtn.addEventListener('click', () => this.hidePromptModal());
        this.promptGenerateBtn?.addEventListener('click', () => this.generatePrompt());
        this.promptCopyBtn?.addEventListener('click', () => this.copyPromptToClipboard());
        this.promptResetBtn?.addEventListener('click', () => this.resetPromptBuilder());
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

        // Test Builder events
        this.openTestBuilderBtn?.addEventListener('click', () => this.openTestBuilder());
        this.closeTestBuilderBtn?.addEventListener('click', () => this.closeTestBuilder());
        this.builderAddQuestionBtn?.addEventListener('click', () => this.builderAddNewQuestion());
        this.builderQuestionType?.addEventListener('change', () => this.builderToggleQuestionTypeFields());
        this.builderAddOptionBtn?.addEventListener('click', () => this.builderAddOption());
        this.builderAddMatchingPairBtn?.addEventListener('click', () => this.builderAddMatchingPair());
        this.builderAddOrderingItemBtn?.addEventListener('click', () => this.builderAddOrderingItem());
        this.builderSaveQuestionBtn?.addEventListener('click', () => this.builderSaveQuestion());
        this.builderCancelQuestionBtn?.addEventListener('click', () => this.builderCancelEdit());
        this.builderDeleteQuestionBtn?.addEventListener('click', () => this.builderDeleteQuestion());
        this.testBuilderExportBtn?.addEventListener('click', () => this.builderExportJSON());
        this.builderPreviewBtn?.addEventListener('click', () => this.builderPreviewTest());

        // Analytics Dashboard events
        this.openAnalyticsBtn?.addEventListener('click', () => this.openAnalyticsDashboard());
        this.closeAnalyticsBtn?.addEventListener('click', () => this.closeAnalyticsDashboard());

        // Study Queue events
        this.openStudyQueueBtn?.addEventListener('click', () => this.openStudyQueue());
        this.closeStudyQueueBtn?.addEventListener('click', () => this.closeStudyQueue());
        this.studyDueCardsBtn?.addEventListener('click', () => this.studyDueCards());
        this.exportSRSBtn?.addEventListener('click', () => this.exportSRSData());
        this.importSRSBtn?.addEventListener('click', () => this.importSRSFile?.click());
        this.importSRSFile?.addEventListener('change', (e) => this.importSRSData(e));

        // Achievement filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterAchievements(e.currentTarget.dataset.filter));
        });

        // Chart period buttons
        document.querySelectorAll('.chart-period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeTrendsPeriod(e.currentTarget.dataset.period));
        });

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
                this.flaggedQuestions = new Set(saved.flaggedQuestions || []); // Convert Array back to Set
                this.questionConfidence = saved.questionConfidence || {};
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
            flaggedQuestions: Array.from(this.flaggedQuestions), // Convert Set to Array
            questionConfidence: this.questionConfidence,
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

            // Capture selected test mode
            const modeExam = document.getElementById('mode-exam');
            const modePractice = document.getElementById('mode-practice');
            this.testMode = modePractice?.checked ? 'practice' : 'exam';
            this.isReviewSession = false; // Reset review flag for new tests

            console.log(`🎯 Test mode: ${this.testMode}`);

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

            if (!['mcq', 'multi-select', 'matching', 'true-false', 'fill-blank', 'ordering'].includes(question.type)) {
                this.showError(`Question ${i + 1} has invalid type. Must be 'mcq', 'multi-select', 'matching', 'true-false', 'fill-blank', or 'ordering'.`);
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

            if (question.type === 'true-false') {
                if (typeof question.correct !== 'boolean' && question.correct !== 0 && question.correct !== 1) {
                    this.showError(`Question ${i + 1} must have a boolean correct answer (true/false or 0/1).`);
                    return false;
                }
            }

            if (question.type === 'fill-blank') {
                if (!question.acceptedAnswers || !Array.isArray(question.acceptedAnswers)) {
                    this.showError(`Question ${i + 1} must have an acceptedAnswers array.`);
                    return false;
                }
                if (question.acceptedAnswers.length === 0) {
                    this.showError(`Question ${i + 1} must have at least one accepted answer.`);
                    return false;
                }
            }

            if (question.type === 'ordering') {
                if (!question.items || !Array.isArray(question.items)) {
                    this.showError(`Question ${i + 1} must have an items array.`);
                    return false;
                }
                if (!Array.isArray(question.correct) || question.correct.length !== question.items.length) {
                    this.showError(`Question ${i + 1} correct array must match items length.`);
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

        // Show mode badge
        const modeIndicator = document.getElementById('mode-indicator');
        if (modeIndicator) {
            modeIndicator.classList.remove('hidden');
            modeIndicator.classList.remove('mode-badge--exam', 'mode-badge--practice');
            if (this.testMode === 'practice') {
                modeIndicator.classList.add('mode-badge--practice');
                modeIndicator.textContent = 'Practice Mode';
            } else {
                modeIndicator.classList.add('mode-badge--exam');
                modeIndicator.textContent = 'Exam Mode';
            }
        }

        // Show/hide review badge
        const reviewIndicator = document.getElementById('review-indicator');
        if (reviewIndicator) {
            if (this.isReviewSession) {
                reviewIndicator.classList.remove('hidden');
            } else {
                reviewIndicator.classList.add('hidden');
            }
        }

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

            // Show time warnings at specific thresholds
            this.checkTimeWarnings();

            // Save progress every 5 seconds instead of every second for better performance
            if (this.timeRemaining % 5 === 0) {
                this.saveProgress();
            }

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.submitTest();
                this.showToast('⏰ Time is up! Your test has been automatically submitted.', 'error');
            }
        }, 1000);
    }

    /**
     * Check and show time warnings at specific thresholds
     */
    checkTimeWarnings() {
        const warnings = [
            { time: 600, message: '⏰ 10 minutes remaining', level: 'info' },
            { time: 300, message: '⚠️ 5 minutes remaining', level: 'warning' },
            { time: 120, message: '🚨 2 minutes remaining', level: 'warning' },
            { time: 60, message: '🔴 1 minute remaining!', level: 'error' }
        ];

        warnings.forEach(warning => {
            if (this.timeRemaining === warning.time && !this.timeWarningsShown.has(warning.time)) {
                this.timeWarningsShown.add(warning.time);
                this.showToast(warning.message, warning.level);
                console.log(`⏱️ Time warning: ${warning.message}`);
            }
        });
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
        const flaggedCount = this.flaggedQuestions.size;
        const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

        let html = `
            <div class="overview-header">
                <h4>Question Navigator</h4>
                <div class="overview-stats">
                    <div class="stat-item">
                        <span class="stat-value">${answeredCount}/${totalQuestions}</span>
                        <span class="stat-label">Answered</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${progressPercentage}%</span>
                        <span class="stat-label">Complete</span>
                    </div>
                    ${flaggedCount > 0 ? `
                        <div class="stat-item">
                            <span class="stat-value">🚩 ${flaggedCount}</span>
                            <span class="stat-label">Flagged</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="overview-legend">
                <div class="legend-item"><span class="legend-indicator legend-answered"></span>Answered</div>
                <div class="legend-item"><span class="legend-indicator legend-flagged"></span>Flagged</div>
                <div class="legend-item"><span class="legend-indicator legend-current"></span>Current</div>
            </div>
            <div class="overview-grid" role="list" aria-label="Question overview">`;

        this.currentTest.questions.forEach((question, index) => {
            const isAnswered = this.userAnswers[question.id] !== undefined &&
                              (Array.isArray(this.userAnswers[question.id]) ?
                               this.userAnswers[question.id].length > 0 :
                               this.userAnswers[question.id] !== null);
            const isCurrent = index === this.currentQuestionIndex;
            const isFlagged = this.flaggedQuestions.has(question.id);
            const confidence = this.questionConfidence[question.id];

            let statusText = '';
            if (isCurrent) statusText += ' (current)';
            if (isAnswered) statusText += ' (answered)';
            if (isFlagged) statusText += ' (flagged)';
            if (confidence) statusText += ` (confidence: ${confidence})`;

            html += `<button
                class="overview-item
                    ${isAnswered ? 'answered' : ''}
                    ${isCurrent ? 'current' : ''}
                    ${isFlagged ? 'flagged' : ''}
                    ${confidence ? 'confidence-' + confidence : ''}"
                onclick="testSimulator.goToQuestion(${index})"
                aria-label="Question ${index + 1}${statusText}"
                title="Question ${index + 1}${statusText}"
                role="listitem">
                <span class="overview-number">${index + 1}</span>
                ${isFlagged ? '<span class="overview-flag">🚩</span>' : ''}
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

        // Hide practice feedback when changing questions
        this.hidePracticeFeedback();

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
            case 'true-false':
                this.displayTrueFalseQuestion(question, questionNum);
                break;
            case 'fill-blank':
                this.displayFillBlankQuestion(question, questionNum);
                break;
            case 'ordering':
                this.displayOrderingQuestion(question, questionNum);
                break;
        }

        // Add flag and confidence controls
        this.addQuestionControls(question);

        // Focus management
        setTimeout(() => {
            const firstInput = this.questionContainer.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 50);
    }

    /**
     * Add flag button and confidence selector to question
     */
    addQuestionControls(question) {
        const controlsHTML = `
            <div class="question-controls">
                <button
                    class="btn-flag ${this.flaggedQuestions.has(question.id) ? 'flagged' : ''}"
                    onclick="testSimulator.toggleFlag(${question.id})"
                    title="${this.flaggedQuestions.has(question.id) ? 'Unflag question' : 'Flag for review'}"
                    aria-label="${this.flaggedQuestions.has(question.id) ? 'Remove flag' : 'Flag this question for review'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" y1="22" x2="4" y2="15"></line>
                    </svg>
                    <span class="flag-text">${this.flaggedQuestions.has(question.id) ? 'Flagged' : 'Flag'}</span>
                </button>
                <div class="confidence-selector">
                    <label class="confidence-label">Confidence:</label>
                    <select
                        class="confidence-select"
                        onchange="testSimulator.setConfidence(${question.id}, this.value)"
                        aria-label="Answer confidence level">
                        <option value="" ${!this.questionConfidence[question.id] ? 'selected' : ''}>Not set</option>
                        <option value="high" ${this.questionConfidence[question.id] === 'high' ? 'selected' : ''}>High</option>
                        <option value="medium" ${this.questionConfidence[question.id] === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="low" ${this.questionConfidence[question.id] === 'low' ? 'selected' : ''}>Low</option>
                        <option value="guess" ${this.questionConfidence[question.id] === 'guess' ? 'selected' : ''}>Guess</option>
                    </select>
                </div>
            </div>
        `;

        this.questionContainer.insertAdjacentHTML('beforeend', controlsHTML);
    }

    /**
     * Toggle flag status for a question
     */
    toggleFlag(questionId) {
        if (this.flaggedQuestions.has(questionId)) {
            this.flaggedQuestions.delete(questionId);
            console.log('🏳️ Question unflagged');
        } else {
            this.flaggedQuestions.add(questionId);
            console.log('🚩 Question flagged for review');
        }
        this.displayQuestion();
        this.updateQuestionOverview();
        this.saveProgress();
    }

    /**
     * Set confidence level for a question
     */
    setConfidence(questionId, level) {
        if (level) {
            this.questionConfidence[questionId] = level;
            console.log(`💭 Confidence set to: ${level}`);
        } else {
            delete this.questionConfidence[questionId];
        }
        this.updateQuestionOverview();
        this.saveProgress();
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
                const selectedIndex = parseInt(input.value);
                this.userAnswers[question.id] = selectedIndex;
                this.updateQuestionOverview();
                this.saveProgress();

                // Show practice feedback
                if (this.testMode === 'practice') {
                    const isCorrect = selectedIndex === question.correct;
                    const correctAnswerText = question.options[question.correct];
                    this.showPracticeFeedback(isCorrect, correctAnswerText);
                }
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

                // Show practice feedback
                if (this.testMode === 'practice' && currentAnswers.length > 0) {
                    const correctAnswers = Array.isArray(question.correct) ? question.correct : [question.correct];
                    const isCorrect = currentAnswers.length === correctAnswers.length &&
                                     currentAnswers.every(ans => correctAnswers.includes(ans));
                    const correctAnswerText = correctAnswers.map(idx => question.options[idx]).join(', ');
                    this.showPracticeFeedback(isCorrect, correctAnswerText);
                }
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

                // Show practice feedback when all matches are complete
                if (this.testMode === 'practice') {
                    const userMatches = this.userAnswers[question.id];
                    const allAnswered = userMatches && userMatches.length === question.leftItems.length &&
                                       userMatches.every(val => val !== null && val !== undefined);

                    if (allAnswered) {
                        const correctMatches = question.correct;
                        const isCorrect = userMatches.every((val, idx) => val === correctMatches[idx]);
                        const correctAnswerText = question.leftItems.map((item, idx) =>
                            `${item} → ${question.rightItems[correctMatches[idx]]}`
                        ).join('; ');
                        this.showPracticeFeedback(isCorrect, correctAnswerText);
                    }
                }
            });
        });
    }

    /**
     * Display True/False question
     * @param {Object} question - Question data
     * @param {number} questionNum - Question number
     */
    displayTrueFalseQuestion(question, questionNum) {
        const savedAnswer = this.userAnswers[question.id];
        const isTrue = savedAnswer === true || savedAnswer === 1 || savedAnswer === 'true';
        const isFalse = savedAnswer === false || savedAnswer === 0 || savedAnswer === 'false';

        this.questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${questionNum}</div>
                <h3 class="question-text" id="question-${questionNum}-text">${this.escapeHtml(question.question)}</h3>
            </div>
            <div class="question-options true-false-options" role="radiogroup" aria-labelledby="question-${questionNum}-text">
                <div class="option-item true-false-option">
                    <input
                        type="radio"
                        id="option-true"
                        name="true-false-answer"
                        value="true"
                        ${isTrue ? 'checked' : ''}
                        aria-label="True"
                    >
                    <label for="option-true" class="option-label true-false-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; margin-right: 8px;">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        True
                    </label>
                </div>
                <div class="option-item true-false-option">
                    <input
                        type="radio"
                        id="option-false"
                        name="true-false-answer"
                        value="false"
                        ${isFalse ? 'checked' : ''}
                        aria-label="False"
                    >
                    <label for="option-false" class="option-label true-false-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; margin-right: 8px;">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        False
                    </label>
                </div>
            </div>
        `;

        // Bind change event
        const radioInputs = this.questionContainer.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.addEventListener('change', () => {
                const selectedAnswer = input.value === 'true';
                this.userAnswers[question.id] = selectedAnswer;
                this.updateQuestionOverview();
                this.saveProgress();

                // Show practice feedback
                if (this.testMode === 'practice') {
                    const correctAnswer = question.correct === true || question.correct === 1;
                    const isCorrect = selectedAnswer === correctAnswer;
                    const correctAnswerText = correctAnswer ? 'True' : 'False';
                    this.showPracticeFeedback(isCorrect, correctAnswerText);
                }
            });
        });
    }

    /**
     * Display Fill-in-the-Blank question
     * @param {Object} question - Question data
     * @param {number} questionNum - Question number
     */
    displayFillBlankQuestion(question, questionNum) {
        const savedAnswer = this.userAnswers[question.id] || '';

        this.questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${questionNum}</div>
                <h3 class="question-text" id="question-${questionNum}-text">${this.escapeHtml(question.question)}</h3>
            </div>
            <div class="fill-blank-container">
                <input
                    type="text"
                    id="fill-blank-input"
                    class="form-control fill-blank-input"
                    placeholder="Type your answer here..."
                    value="${this.escapeHtml(savedAnswer)}"
                    aria-labelledby="question-${questionNum}-text"
                >
                ${question.caseSensitive === false ? '<p class="hint-text">Note: Answer is not case-sensitive</p>' : ''}
            </div>
        `;

        // Bind input event
        const input = this.questionContainer.querySelector('#fill-blank-input');
        input.addEventListener('input', () => {
            this.userAnswers[question.id] = input.value.trim();
            this.updateQuestionOverview();
            this.saveProgress();
        });

        // Show practice feedback on blur
        input.addEventListener('blur', () => {
            if (this.testMode === 'practice' && input.value.trim()) {
                const userAnswer = input.value.trim();
                const acceptedAnswers = question.acceptedAnswers || [question.correct];
                const caseSensitive = question.caseSensitive !== false;

                const isCorrect = acceptedAnswers.some(accepted => {
                    if (caseSensitive) {
                        return userAnswer === accepted.trim();
                    } else {
                        return userAnswer.toLowerCase() === accepted.trim().toLowerCase();
                    }
                });

                const correctAnswerText = acceptedAnswers.join(' or ');
                this.showPracticeFeedback(isCorrect, correctAnswerText);
            }
        });
    }

    /**
     * Display Ordering/Sequencing question
     * @param {Object} question - Question data
     * @param {number} questionNum - Question number
     */
    displayOrderingQuestion(question, questionNum) {
        let savedOrder = this.userAnswers[question.id];

        // If no saved order, shuffle the items for initial display
        if (!savedOrder || savedOrder.length !== question.items.length) {
            savedOrder = question.items.map((_, index) => index);
            // Shuffle
            for (let i = savedOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [savedOrder[i], savedOrder[j]] = [savedOrder[j], savedOrder[i]];
            }
            this.userAnswers[question.id] = savedOrder;
        }

        this.questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${questionNum}</div>
                <h3 class="question-text" id="question-${questionNum}-text">${this.escapeHtml(question.question)}</h3>
                <p class="hint-text">Drag items to reorder them, or use the arrows to move items up and down.</p>
            </div>
            <div class="ordering-container" id="ordering-container">
                ${savedOrder.map((itemIndex, position) => `
                    <div class="ordering-item" data-position="${position}" data-item-index="${itemIndex}">
                        <div class="ordering-handle" aria-label="Drag to reorder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="9" x2="19" y2="9"></line>
                                <line x1="5" y1="15" x2="19" y2="15"></line>
                            </svg>
                        </div>
                        <div class="ordering-number">${position + 1}</div>
                        <div class="ordering-text">${this.escapeHtml(question.items[itemIndex])}</div>
                        <div class="ordering-controls">
                            <button class="btn-icon ordering-up" data-position="${position}" aria-label="Move up" ${position === 0 ? 'disabled' : ''}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                            </button>
                            <button class="btn-icon ordering-down" data-position="${position}" aria-label="Move down" ${position === savedOrder.length - 1 ? 'disabled' : ''}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Bind arrow button events
        const upButtons = this.questionContainer.querySelectorAll('.ordering-up');
        const downButtons = this.questionContainer.querySelectorAll('.ordering-down');

        upButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const position = parseInt(btn.dataset.position);
                if (position > 0) {
                    const currentOrder = this.userAnswers[question.id];
                    [currentOrder[position], currentOrder[position - 1]] =
                    [currentOrder[position - 1], currentOrder[position]];
                    this.userAnswers[question.id] = currentOrder;
                    this.displayQuestion();
                    this.updateQuestionOverview();
                    this.saveProgress();

                    // Show practice feedback
                    if (this.testMode === 'practice') {
                        this.checkOrderingFeedback(question, currentOrder);
                    }
                }
            });
        });

        downButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const position = parseInt(btn.dataset.position);
                const currentOrder = this.userAnswers[question.id];
                if (position < currentOrder.length - 1) {
                    [currentOrder[position], currentOrder[position + 1]] =
                    [currentOrder[position + 1], currentOrder[position]];
                    this.userAnswers[question.id] = currentOrder;
                    this.displayQuestion();
                    this.updateQuestionOverview();
                    this.saveProgress();

                    // Show practice feedback
                    if (this.testMode === 'practice') {
                        this.checkOrderingFeedback(question, currentOrder);
                    }
                }
            });
        });
    }

    /**
     * Check ordering feedback for practice mode
     */
    checkOrderingFeedback(question, currentOrder) {
        const correctOrder = question.correct;
        const isCorrect = currentOrder.length === correctOrder.length &&
                         currentOrder.every((val, idx) => val === correctOrder[idx]);
        const correctAnswerText = correctOrder.map(idx => question.items[idx]).join(', ');
        this.showPracticeFeedback(isCorrect, correctAnswerText);
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
        const totalQuestions = this.currentTest.questions.length;
        const unanswered = this.currentTest.questions.filter(q => {
            const answer = this.userAnswers[q.id];
            return answer === undefined ||
                   (Array.isArray(answer) && answer.length === 0) ||
                   answer === null;
        }).length;
        const answered = totalQuestions - unanswered;
        const flagged = this.flaggedQuestions.size;

        let message = `Progress: ${answered}/${totalQuestions} answered`;
        if (flagged > 0) {
            message += `, ${flagged} flagged`;
        }
        if (unanswered > 0) {
            message += `\n\n⚠️ You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. They will be marked incorrect.`;
        }
        message += '\n\nAre you sure you want to submit?';

        const messageEl = this.confirmModal.querySelector('.confirm-message');
        if (messageEl) {
            messageEl.style.whiteSpace = 'pre-line';
            messageEl.textContent = message;
        }

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

        // Record completion for gamification
        const timeSpent = this.testDuration ? (this.testDuration - (this.timeRemaining || 0)) : 0;
        const questionTypes = {};
        this.currentTest.questions.forEach(q => {
            questionTypes[q.type] = (questionTypes[q.type] || 0) + 1;
        });

        const gamificationResult = this.gamification.recordTestCompletion({
            score: this.score.percentage,
            totalQuestions: this.score.total,
            correctAnswers: this.score.correct,
            timeSpent,
            questionTypes
        });

        // Show achievement toasts
        if (gamificationResult.newAchievements.length > 0) {
            this.showAchievementToasts(gamificationResult.newAchievements);
        }

        // Show level up notification
        if (gamificationResult.leveledUp) {
            const stats = this.gamification.getStats();
            this.showLevelUpToast(stats.level);
        }

        // Create/update SRS cards from test questions
        this.createSRSCardsFromTest();

        this.displayResults();
        this.clearProgress(); // Clear saved progress after submission

        console.log(`🎮 Gamification: +${gamificationResult.xpEarned} XP, ${gamificationResult.newAchievements.length} new achievements`);
    }

    /**
     * Create or update SRS cards from test questions
     */
    createSRSCardsFromTest() {
        if (!this.currentTest || !this.score) return;

        let cardsCreated = 0;
        let cardsUpdated = 0;

        this.currentTest.questions.forEach(question => {
            // Create unique ID for the question
            const questionId = `${this.currentTest.title || 'test'}_q${question.id}_${question.type}`;

            // Get or create card
            const card = this.srs.getOrCreateCard(questionId, question);
            const wasNew = card.state === 'new' && card.repetitions === 0;

            // Determine if answer was correct
            const userAnswer = this.userAnswers[question.id];
            const isCorrect = this.isAnswerCorrect(question, userAnswer, question.correct);

            // Auto-rate based on correctness and confidence
            const confidence = this.questionConfidence[question.id] || null;
            let quality;

            if (isCorrect) {
                // Correct answer
                if (confidence === 'high') {
                    quality = 5; // Perfect response
                } else if (confidence === 'medium') {
                    quality = 4; // After some hesitation
                } else if (confidence === 'low' || confidence === 'guess') {
                    quality = 3; // With difficulty
                } else {
                    quality = 4; // Default to hesitation
                }
            } else {
                // Incorrect answer
                if (confidence === 'high') {
                    quality = 1; // Recognized answer upon seeing it
                } else if (confidence === 'medium') {
                    quality = 1; // Incorrect but seemed familiar
                } else {
                    quality = 0; // Complete blackout
                }
            }

            // Review the card
            this.srs.reviewCard(card, quality);

            if (wasNew) {
                cardsCreated++;
            } else {
                cardsUpdated++;
            }
        });

        if (cardsCreated > 0 || cardsUpdated > 0) {
            this.showToast(
                `🧠 SRS Updated: ${cardsCreated} new cards, ${cardsUpdated} reviewed`,
                'info'
            );
            console.log(`🧠 SRS: ${cardsCreated} created, ${cardsUpdated} updated`);
        }
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

        // Show/hide review wrong answers button
        const wrongCount = this.score.total - this.score.correct;
        if (this.reviewWrongBtn) {
            if (wrongCount > 0) {
                this.reviewWrongBtn.classList.remove('hidden');
                this.reviewWrongBtn.textContent = `Review ${wrongCount} Wrong Answer${wrongCount !== 1 ? 's' : ''}`;
                // Re-add the icon
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                icon.setAttribute('viewBox', '0 0 24 24');
                icon.setAttribute('fill', 'none');
                icon.setAttribute('stroke', 'currentColor');
                icon.setAttribute('stroke-width', '2');
                icon.style.cssText = 'width: 20px; height: 20px; margin-right: 8px;';
                icon.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>';
                this.reviewWrongBtn.insertBefore(icon, this.reviewWrongBtn.firstChild);
            } else {
                this.reviewWrongBtn.classList.add('hidden');
            }
        }

        // Focus on score
        setTimeout(() => {
            const scoreNumber = this.scoreSummary.querySelector('.score-number');
            if (scoreNumber) scoreNumber.focus();
        }, 100);
    }

    /**
     * Review wrong answers - restart test with only incorrect questions in practice mode
     */
    reviewWrongAnswers() {
        // Filter questions to only those answered incorrectly
        const wrongQuestions = this.currentTest.questions.filter(question => {
            const userAnswer = this.userAnswers[question.id];
            const correctAnswer = question.correct;
            return !this.isAnswerCorrect(question, userAnswer, correctAnswer);
        });

        if (wrongQuestions.length === 0) {
            alert('No wrong answers to review!');
            return;
        }

        console.log(`📝 Starting review of ${wrongQuestions.length} wrong answer${wrongQuestions.length !== 1 ? 's' : ''}`);

        // Create new test with only wrong questions
        const reviewTest = {
            ...this.currentTest,
            title: `Review: ${this.currentTest.title}`,
            questions: wrongQuestions
        };

        // Clear state and load review test
        this.currentTest = reviewTest;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.testStartTime = Date.now();
        this.testMode = 'practice'; // Always use practice mode for review
        this.isReviewSession = true; // Mark as review session

        // Clear timer for review
        this.testDuration = null;
        this.timeRemaining = null;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Start the review session
        this.startTest();
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
            case 'true-false':
                // Handle both boolean and 0/1 formats
                const userBool = userAnswer === true || userAnswer === 1 || userAnswer === 'true';
                const correctBool = correctAnswer === true || correctAnswer === 1;
                return userBool === correctBool;
            case 'fill-blank':
                if (!userAnswer) return false;
                // Get accepted answers array
                const acceptedAnswers = question.acceptedAnswers || [correctAnswer];
                const caseSensitive = question.caseSensitive !== false; // Default to case-sensitive

                return acceptedAnswers.some(accepted => {
                    if (caseSensitive) {
                        return userAnswer.trim() === accepted.trim();
                    } else {
                        return userAnswer.trim().toLowerCase() === accepted.trim().toLowerCase();
                    }
                });
            case 'ordering':
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
        // Helper function to add explanation if available
        const addExplanation = (html) => {
            if (question.explanation || question._explanation) {
                const explanation = question.explanation || question._explanation;
                return html + `
                    <div class="explanation-section">
                        <div class="explanation-header">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span class="explanation-label">Explanation</span>
                        </div>
                        <div class="explanation-text">${this.escapeHtml(explanation)}</div>
                    </div>
                `;
            }
            return html;
        };

        switch (question.type) {
            case 'mcq':
                return addExplanation(`
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
                `);
            case 'multi-select':
                const userAnswerText = Array.isArray(userAnswer) && userAnswer.length > 0 ?
                    userAnswer.map(index => this.escapeHtml(question.options[index])).join(', ') : 'No answers selected';
                const correctAnswerText = correctAnswer.map(index => this.escapeHtml(question.options[index])).join(', ');

                return addExplanation(`
                    <div class="answer-section">
                        <span class="answer-label">Your answers:</span>
                        <div class="answer-text user-answer">${userAnswerText}</div>
                        <span class="answer-label">Correct answers:</span>
                        <div class="answer-text correct-answer">${correctAnswerText}</div>
                    </div>
                `);
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

                return addExplanation(`
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
                `);
            case 'true-false':
                const userTFAnswer = userAnswer === true || userAnswer === 1 || userAnswer === 'true' ? 'True' :
                                     userAnswer === false || userAnswer === 0 || userAnswer === 'false' ? 'False' : 'No answer';
                const correctTFAnswer = correctAnswer === true || correctAnswer === 1 ? 'True' : 'False';

                return addExplanation(`
                    <div class="answer-section">
                        <span class="answer-label">Your answer:</span>
                        <div class="answer-text user-answer">${userTFAnswer}</div>
                        <span class="answer-label">Correct answer:</span>
                        <div class="answer-text correct-answer">${correctTFAnswer}</div>
                    </div>
                `);
            case 'fill-blank':
                const acceptedAnswers = question.acceptedAnswers || [correctAnswer];

                return addExplanation(`
                    <div class="answer-section">
                        <span class="answer-label">Your answer:</span>
                        <div class="answer-text user-answer">
                            ${userAnswer ? this.escapeHtml(userAnswer) : 'No answer'}
                        </div>
                        <span class="answer-label">Accepted answer${acceptedAnswers.length > 1 ? 's' : ''}:</span>
                        <div class="answer-text correct-answer">
                            ${acceptedAnswers.map(ans => this.escapeHtml(ans)).join(', ')}
                        </div>
                        ${question.caseSensitive === false ? '<p class="hint-text" style="margin-top: 8px;">Note: Answer was not case-sensitive</p>' : ''}
                    </div>
                `);
            case 'ordering':
                const userOrder = Array.isArray(userAnswer) ?
                    userAnswer.map((itemIdx, pos) => `${pos + 1}. ${this.escapeHtml(question.items[itemIdx])}`).join('<br>') :
                    'No answer';
                const correctOrder = correctAnswer.map((itemIdx, pos) =>
                    `${pos + 1}. ${this.escapeHtml(question.items[itemIdx])}`
                ).join('<br>');

                return addExplanation(`
                    <div class="answer-section">
                        <span class="answer-label">Your order:</span>
                        <div class="answer-text user-answer">${userOrder}</div>
                        <span class="answer-label">Correct order:</span>
                        <div class="answer-text correct-answer">${correctOrder}</div>
                    </div>
                `);
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
            } else if (question.type === 'true-false') {
                userAnswerText = userAnswer === true || userAnswer === 1 || userAnswer === 'true' ? 'True' :
                                 userAnswer === false || userAnswer === 0 || userAnswer === 'false' ? 'False' : 'No answer';
                correctAnswerText = correctAnswer === true || correctAnswer === 1 ? 'True' : 'False';
            } else if (question.type === 'fill-blank') {
                userAnswerText = userAnswer || 'No answer';
                const acceptedAnswers = question.acceptedAnswers || [correctAnswer];
                correctAnswerText = acceptedAnswers.join(' / ');
            } else if (question.type === 'ordering') {
                userAnswerText = Array.isArray(userAnswer) ?
                    userAnswer.map((idx, pos) => `${pos + 1}. ${question.items[idx]}`).join('; ') : 'No answer';
                correctAnswerText = correctAnswer.map((idx, pos) => `${pos + 1}. ${question.items[idx]}`).join('; ');
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
     * Show practice mode feedback
     * @param {boolean} isCorrect - Whether the answer is correct
     * @param {string} correctAnswerText - Text of the correct answer
     */
    showPracticeFeedback(isCorrect, correctAnswerText) {
        if (this.testMode !== 'practice') return;

        const feedback = document.getElementById('practice-feedback');
        if (!feedback) return;

        const icon = feedback.querySelector('.feedback-icon');
        const title = feedback.querySelector('.feedback-title');
        const message = feedback.querySelector('.feedback-message');

        // Reset classes
        feedback.classList.remove('hidden', 'feedback--correct', 'feedback--incorrect');

        if (isCorrect) {
            feedback.classList.add('feedback--correct');
            icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
            title.textContent = 'Correct!';
            message.textContent = 'Great job! You got it right.';
        } else {
            feedback.classList.add('feedback--incorrect');
            icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>`;
            title.textContent = 'Not quite right';
            message.innerHTML = `The correct answer is: <strong>${this.escapeHtml(correctAnswerText)}</strong>`;
        }

        feedback.classList.remove('hidden');

        // Scroll feedback into view smoothly
        setTimeout(() => {
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    /**
     * Hide practice mode feedback
     */
    hidePracticeFeedback() {
        const feedback = document.getElementById('practice-feedback');
        if (feedback) {
            feedback.classList.add('hidden');
        }
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
     * Open analytics dashboard
     */
    openAnalyticsDashboard() {
        if (!this.analyticsSection) return;

        this.jsonInputSection.classList.add('hidden');
        this.analyticsSection.classList.remove('hidden');

        // Populate dashboard with current data
        this.populateAnalyticsDashboard();
    }

    /**
     * Close analytics dashboard and return to main screen
     */
    closeAnalyticsDashboard() {
        if (!this.analyticsSection) return;

        this.analyticsSection.classList.add('hidden');
        this.jsonInputSection.classList.remove('hidden');
    }

    /**
     * Open study queue (spaced repetition)
     */
    openStudyQueue() {
        if (!this.studyQueueSection) return;

        this.jsonInputSection.classList.add('hidden');
        this.studyQueueSection.classList.remove('hidden');

        // Populate study queue with current data
        this.populateStudyQueue();
    }

    /**
     * Close study queue and return to main screen
     */
    closeStudyQueue() {
        if (!this.studyQueueSection) return;

        this.studyQueueSection.classList.add('hidden');
        this.jsonInputSection.classList.remove('hidden');
    }

    /**
     * Populate study queue with SRS data
     */
    populateStudyQueue() {
        const stats = this.srs.getStats();

        // Update SRS stats
        document.getElementById('srs-due-today').textContent = stats.dueToday;
        document.getElementById('srs-avg-retention').textContent = `${stats.averageRetention}%`;
        document.getElementById('srs-total-cards').textContent = stats.totalCards;
        document.getElementById('srs-reviews-today').textContent = stats.totalReviews;

        // Render due cards
        this.renderDueCards();

        // Render upcoming reviews
        this.renderUpcomingReviews();

        // Render retention prediction
        this.renderRetentionPrediction();

        // Render review activity heatmap
        this.renderReviewActivityHeatmap();

        // Render success rate chart
        this.renderSuccessRateChart();

        console.log('🧠 Study queue populated:', stats);
    }

    /**
     * Render due cards list
     */
    renderDueCards() {
        const dueCards = this.srs.getDueCards(20);
        const container = this.dueCardsList;

        if (!container) return;

        if (dueCards.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p>🎉 No cards due right now! Great work!</p>
                    <p class="hint-text">Complete some tests to add cards to your study queue.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = dueCards.map(card => {
            const retention = Math.round(this.srs.predictRetention(card) * 100);
            const stateColors = {
                new: '#3b82f6',
                learning: '#f59e0b',
                review: '#10b981',
                relearning: '#ef4444'
            };

            return `
                <div class="due-card">
                    <div class="due-card-header">
                        <span class="due-card-state" style="background-color: ${stateColors[card.state] || '#gray'}">
                            ${card.state}
                        </span>
                        <span class="due-card-retention" style="color: ${retention >= 70 ? '#10b981' : retention >= 40 ? '#f59e0b' : '#ef4444'}">
                            ${retention}% retention
                        </span>
                    </div>
                    <div class="due-card-question">${this.escapeHtml(card.questionText)}</div>
                    <div class="due-card-meta">
                        <span>📊 Reviews: ${card.reviewHistory.length}</span>
                        <span>🔄 Interval: ${card.interval}d</span>
                        <span>⚡ Ease: ${card.easeFactor.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render upcoming reviews calendar
     */
    renderUpcomingReviews() {
        const upcoming = this.srs.getUpcomingReviews(7);
        const container = this.upcomingReviews;

        if (!container) return;

        const dates = Object.keys(upcoming).sort((a, b) => new Date(a) - new Date(b));

        if (dates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No reviews scheduled for the next 7 days.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = dates.map(dateStr => {
            const cards = upcoming[dateStr];
            const date = new Date(dateStr);
            const isToday = date.toDateString() === new Date().toDateString();

            return `
                <div class="upcoming-day ${isToday ? 'upcoming-day--today' : ''}">
                    <div class="upcoming-day-header">
                        <span class="upcoming-day-date">${isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span class="upcoming-day-count">${cards.length} card${cards.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="upcoming-day-bar" style="width: ${Math.min(100, cards.length * 10)}%"></div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render retention prediction chart
     */
    renderRetentionPrediction() {
        const container = this.retentionPredictionChart;
        if (!container) return;

        // Get a sample card for visualization
        const cards = Object.values(this.srs.data.cards);
        if (cards.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Complete some reviews to see memory retention predictions.</p>
                </div>
            `;
            return;
        }

        // Use the most recently reviewed card
        const sampleCard = cards
            .filter(c => c.lastReviewDate)
            .sort((a, b) => b.lastReviewDate - a.lastReviewDate)[0];

        if (!sampleCard) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Complete some reviews to see memory retention predictions.</p>
                </div>
            `;
            return;
        }

        // Get retention curve data
        const curveData = this.srs.getRetentionCurve(sampleCard, 30);

        // Find next review point
        const nextReviewHours = (sampleCard.nextReviewDate - Date.now()) / (1000 * 60 * 60);

        // Render simple visualization
        const chartHeight = 200;
        const chartWidth = container.offsetWidth - 40;

        const points = curveData.map((point, i) => {
            const x = (point.days / 30) * chartWidth + 20;
            const y = chartHeight - (point.retention * (chartHeight - 40)) - 20;
            return { x, y, retention: point.retention, days: point.days };
        });

        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

        container.innerHTML = `
            <div class="retention-info">
                <p><strong>Sample Card:</strong> ${this.escapeHtml(sampleCard.questionText.substring(0, 60))}${sampleCard.questionText.length > 60 ? '...' : ''}</p>
                <p><strong>Current Retention:</strong> ${Math.round(this.srs.predictRetention(sampleCard) * 100)}%</p>
                <p><strong>Next Review:</strong> ${nextReviewHours > 0 ? `in ${Math.round(nextReviewHours / 24)} days` : 'due now'}</p>
            </div>
            <svg class="retention-chart" viewBox="0 0 ${chartWidth + 40} ${chartHeight}" preserveAspectRatio="xMidYMid meet">
                <!-- Grid lines -->
                ${[0, 25, 50, 75, 100].map(val => `
                    <line x1="20" y1="${chartHeight - (val / 100 * (chartHeight - 40)) - 20}"
                          x2="${chartWidth + 20}" y2="${chartHeight - (val / 100 * (chartHeight - 40)) - 20}"
                          stroke="rgba(0,0,0,0.1)" stroke-width="1" stroke-dasharray="4"/>
                    <text x="5" y="${chartHeight - (val / 100 * (chartHeight - 40)) - 16}"
                          font-size="10" fill="rgba(0,0,0,0.5)">${val}%</text>
                `).join('')}

                <!-- Forgetting curve -->
                <path d="${pathData}" fill="none" stroke="#ef4444" stroke-width="2" />

                <!-- Current time marker -->
                <line x1="20" y1="20" x2="20" y2="${chartHeight - 20}" stroke="#10b981" stroke-width="2" stroke-dasharray="4" />
                <text x="25" y="15" font-size="10" fill="#10b981">Now</text>

                <!-- Next review marker -->
                ${nextReviewHours > 0 ? `
                    <line x1="${20 + (nextReviewHours / 24 / 30) * chartWidth}" y1="20"
                          x2="${20 + (nextReviewHours / 24 / 30) * chartWidth}" y2="${chartHeight - 20}"
                          stroke="#3b82f6" stroke-width="2" stroke-dasharray="4" />
                    <text x="${25 + (nextReviewHours / 24 / 30) * chartWidth}" y="15" font-size="10" fill="#3b82f6">Review</text>
                ` : ''}
            </svg>
        `;
    }

    /**
     * Render review activity heatmap (GitHub-style contribution graph)
     */
    renderReviewActivityHeatmap() {
        const container = document.getElementById('review-activity-heatmap');
        if (!container) return;

        // Get all reviews from the past 12 weeks
        const weeks = 12;
        const days = weeks * 7;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create date map with review counts
        const reviewsByDate = {};
        const allReviews = Object.values(this.srs.data.cards)
            .flatMap(card => card.reviewHistory.map(r => ({...r, cardId: card.id})));

        allReviews.forEach(review => {
            const date = new Date(review.date);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];
            reviewsByDate[dateStr] = (reviewsByDate[dateStr] || 0) + 1;
        });

        // Generate heatmap data
        const heatmapData = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = reviewsByDate[dateStr] || 0;

            heatmapData.push({
                date: dateStr,
                count: count,
                day: date.getDay(),
                weekIndex: Math.floor((days - 1 - i) / 7)
            });
        }

        // Calculate max count for scaling
        const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

        // Get color based on review count
        const getColor = (count) => {
            if (count === 0) return '#ebedf0';
            const intensity = Math.min(count / maxCount, 1);
            if (intensity < 0.25) return '#c6e48b';
            if (intensity < 0.5) return '#7bc96f';
            if (intensity < 0.75) return '#239a3b';
            return '#196127';
        };

        // Render heatmap
        const cellSize = 12;
        const cellGap = 3;
        const labelWidth = 30;
        const totalWidth = (weeks * (cellSize + cellGap)) + labelWidth;
        const totalHeight = (7 * (cellSize + cellGap)) + 20;

        const dayLabels = ['', 'M', '', 'W', '', 'F', ''];

        container.innerHTML = `
            <div class="heatmap-wrapper">
                <svg class="heatmap-svg" viewBox="0 0 ${totalWidth} ${totalHeight}" preserveAspectRatio="xMidYMid meet">
                    <!-- Day labels -->
                    ${dayLabels.map((label, i) => `
                        <text x="5" y="${(i * (cellSize + cellGap)) + cellSize - 2}"
                              font-size="10" fill="rgba(0,0,0,0.5)">${label}</text>
                    `).join('')}

                    <!-- Heatmap cells -->
                    ${heatmapData.map(d => `
                        <rect
                            x="${labelWidth + (d.weekIndex * (cellSize + cellGap))}"
                            y="${d.day * (cellSize + cellGap)}"
                            width="${cellSize}"
                            height="${cellSize}"
                            rx="2"
                            fill="${getColor(d.count)}"
                            data-date="${d.date}"
                            data-count="${d.count}">
                            <title>${d.date}: ${d.count} review${d.count !== 1 ? 's' : ''}</title>
                        </rect>
                    `).join('')}
                </svg>
                <div class="heatmap-legend">
                    <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs);">Less</span>
                    ${[0, 1, 2, 3, 4].map(i => `
                        <div style="width: 12px; height: 12px; background: ${getColor(i * maxCount / 4)}; border-radius: 2px;"></div>
                    `).join('')}
                    <span style="color: var(--color-text-secondary); font-size: var(--font-size-xs);">More</span>
                </div>
                <p class="heatmap-summary" style="margin-top: var(--space-12); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                    <strong>${allReviews.length}</strong> reviews in the last ${weeks} weeks
                </p>
            </div>
        `;
    }

    /**
     * Render success rate tracking chart
     */
    renderSuccessRateChart() {
        const container = document.getElementById('success-rate-chart');
        if (!container) return;

        // Get all reviews from past 30 days, grouped by day
        const days = 30;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const reviewsByDay = {};
        const allReviews = Object.values(this.srs.data.cards)
            .flatMap(card => card.reviewHistory);

        allReviews.forEach(review => {
            const date = new Date(review.date);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];

            if (!reviewsByDay[dateStr]) {
                reviewsByDay[dateStr] = { total: 0, correct: 0 };
            }

            reviewsByDay[dateStr].total++;
            if (review.quality >= 3) {
                reviewsByDay[dateStr].correct++;
            }
        });

        // Generate chart data for past 30 days
        const chartData = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = reviewsByDay[dateStr] || { total: 0, correct: 0 };
            const successRate = dayData.total > 0 ? (dayData.correct / dayData.total) * 100 : null;

            chartData.push({
                date: dateStr,
                dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                successRate: successRate,
                total: dayData.total,
                correct: dayData.correct
            });
        }

        // Filter out days with no reviews for cleaner visualization
        const dataPoints = chartData.filter(d => d.successRate !== null);

        if (dataPoints.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Complete some reviews to see success rate trends.</p>
                </div>
            `;
            return;
        }

        // Calculate average success rate
        const avgSuccessRate = dataPoints.reduce((sum, d) => sum + d.successRate, 0) / dataPoints.length;

        // Chart dimensions
        const chartHeight = 200;
        const chartWidth = container.offsetWidth - 40;
        const barWidth = Math.max(2, Math.min(chartWidth / days - 2, 8));

        container.innerHTML = `
            <div class="success-rate-info">
                <div class="success-rate-stat">
                    <div class="success-rate-stat-label">Average Success Rate</div>
                    <div class="success-rate-stat-value">${Math.round(avgSuccessRate)}%</div>
                </div>
                <div class="success-rate-stat">
                    <div class="success-rate-stat-label">Total Reviews</div>
                    <div class="success-rate-stat-value">${dataPoints.reduce((sum, d) => sum + d.total, 0)}</div>
                </div>
                <div class="success-rate-stat">
                    <div class="success-rate-stat-label">Active Days</div>
                    <div class="success-rate-stat-value">${dataPoints.length}/${days}</div>
                </div>
            </div>
            <svg class="success-rate-svg" viewBox="0 0 ${chartWidth + 40} ${chartHeight + 40}" preserveAspectRatio="xMidYMid meet">
                <!-- Grid lines -->
                ${[0, 25, 50, 75, 100].map(val => `
                    <line x1="20" y1="${chartHeight - (val / 100 * (chartHeight - 40)) - 20 + 20}"
                          x2="${chartWidth + 20}" y2="${chartHeight - (val / 100 * (chartHeight - 40)) - 20 + 20}"
                          stroke="rgba(0,0,0,0.1)" stroke-width="1" stroke-dasharray="4"/>
                    <text x="5" y="${chartHeight - (val / 100 * (chartHeight - 40)) - 16 + 20}"
                          font-size="10" fill="rgba(0,0,0,0.5)">${val}%</text>
                `).join('')}

                <!-- Average line -->
                <line x1="20" y1="${chartHeight - (avgSuccessRate / 100 * (chartHeight - 40)) - 20 + 20}"
                      x2="${chartWidth + 20}" y2="${chartHeight - (avgSuccessRate / 100 * (chartHeight - 40)) - 20 + 20}"
                      stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 4" opacity="0.5"/>

                <!-- Bars -->
                ${chartData.map((d, i) => {
                    if (d.successRate === null) return '';
                    const x = 20 + (i / days) * chartWidth;
                    const barHeight = (d.successRate / 100) * (chartHeight - 40);
                    const y = chartHeight - barHeight - 20 + 20;
                    const color = d.successRate >= 75 ? '#10b981' : d.successRate >= 50 ? '#f59e0b' : '#ef4444';

                    return `
                        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}"
                              fill="${color}" opacity="0.8" rx="2">
                            <title>${d.dateLabel}: ${Math.round(d.successRate)}% (${d.correct}/${d.total})</title>
                        </rect>
                    `;
                }).join('')}

                <!-- X-axis labels (every 5 days) -->
                ${chartData.filter((d, i) => i % 5 === 0).map((d, idx) => {
                    const i = chartData.indexOf(d);
                    const x = 20 + (i / days) * chartWidth;
                    return `
                        <text x="${x}" y="${chartHeight + 35}" font-size="9" fill="rgba(0,0,0,0.5)"
                              transform="rotate(-45, ${x}, ${chartHeight + 35})">${d.dateLabel}</text>
                    `;
                }).join('')}
            </svg>
        `;
    }

    /**
     * Generate and start a test from due SRS cards
     */
    studyDueCards() {
        const dueCards = this.srs.getDueCards(20);

        if (dueCards.length === 0) {
            alert('🎉 No cards due right now! Great work!');
            return;
        }

        // Generate test from due cards
        const testQuestions = dueCards.map((card, index) => {
            // Reconstruct the question from card data
            const questionData = this.srs.data.cards[card.id];

            return {
                id: index + 1,
                type: card.questionType,
                question: card.questionText,
                // Note: We don't have full question data (options, answers) stored in cards yet
                // This is a limitation - in a full implementation, you'd store complete question data
                ...questionData
            };
        });

        // Create test object
        const srsTest = {
            title: `SRS Study Session - ${dueCards.length} Cards`,
            questions: testQuestions
        };

        // Load the test
        this.currentTest = srsTest;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = new Set();
        this.questionConfidence = {};
        this.testMode = 'practice'; // Always practice mode for SRS
        this.testStartTime = Date.now();
        this.testDuration = null; // No timer for SRS study
        this.timeRemaining = null;

        // Close study queue and start test
        this.closeStudyQueue();
        this.startTest();

        console.log(`🧠 SRS Study Session started: ${dueCards.length} cards`);
    }

    /**
     * Export SRS data as JSON
     */
    exportSRSData() {
        const data = this.srs.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `srs-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('📥 SRS data exported successfully', 'success');
        console.log('📥 SRS data exported');
    }

    /**
     * Import SRS data from JSON file
     */
    importSRSData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = e.target.result;
                const success = this.srs.importData(jsonData);

                if (success) {
                    this.showToast('📤 SRS data imported successfully', 'success');
                    // Refresh the study queue display
                    this.populateStudyQueue();
                } else {
                    this.showToast('❌ Failed to import SRS data', 'error');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showToast('❌ Invalid SRS data file', 'error');
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    /**
     * Populate analytics dashboard with gamification data
     */
    populateAnalyticsDashboard() {
        const stats = this.gamification.getStats();
        const progress = this.gamification.getLevelProgress();

        // Update level and XP
        document.getElementById('analytics-level').textContent = stats.level;
        document.getElementById('analytics-xp-text').textContent =
            `${progress.currentXP} / ${this.gamification.getXPForNextLevel(stats.level)} XP`;
        document.getElementById('analytics-xp-fill').style.width = `${progress.percentage}%`;
        document.getElementById('analytics-xp-percent').textContent =
            `${Math.round(progress.percentage)}% to next level`;

        // Update stats cards
        document.getElementById('stat-tests-completed').textContent = stats.testsCompleted;
        document.getElementById('stat-accuracy').textContent = `${stats.accuracy}%`;
        document.getElementById('stat-study-time').textContent = this.formatStudyTime(stats.totalStudyTime);
        document.getElementById('stat-streak').textContent =
            `${stats.streak.current} day${stats.streak.current !== 1 ? 's' : ''}`;
        document.getElementById('stat-perfect-scores').textContent = stats.perfectScores;
        document.getElementById('stat-achievements').textContent =
            `${stats.achievementsUnlocked} / ${stats.totalAchievements}`;

        // Update detailed stats
        document.getElementById('stat-total-questions').textContent = stats.totalQuestions;
        document.getElementById('stat-correct-answers').textContent = stats.correctAnswers;
        document.getElementById('stat-longest-streak').textContent =
            `${stats.streak.longest} day${stats.streak.longest !== 1 ? 's' : ''}`;
        document.getElementById('stat-total-xp').textContent = `${stats.xp} XP`;

        // Render achievement gallery
        this.renderAchievementGallery();

        // Render question type chart
        this.renderQuestionTypeChart(stats.questionsPerType);

        // Render performance trends
        this.renderPerformanceTrendsChart(this.currentTrendsPeriod);

        // Render course/topic breakdown
        this.renderCourseTopicBreakdown();
    }

    /**
     * Format study time in hours/minutes
     */
    formatStudyTime(seconds) {
        if (seconds < 60) return '< 1m';
        if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes}m`;
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    /**
     * Render achievement gallery
     */
    renderAchievementGallery() {
        const achievements = this.gamification.getAllAchievements();
        const gallery = this.achievementGallery;

        if (!gallery) return;

        gallery.innerHTML = achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}"
                 data-unlocked="${achievement.unlocked}">
                ${!achievement.unlocked ? `
                    <svg class="achievement-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                ` : ''}
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-xp">+${achievement.xpReward} XP</div>
            </div>
        `).join('');
    }

    /**
     * Filter achievements by unlock status
     */
    filterAchievements(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filter achievement cards
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach(card => {
            const isUnlocked = card.dataset.unlocked === 'true';

            if (filter === 'all') {
                card.style.display = 'block';
            } else if (filter === 'unlocked' && isUnlocked) {
                card.style.display = 'block';
            } else if (filter === 'locked' && !isUnlocked) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Render question type breakdown chart
     */
    renderQuestionTypeChart(questionsPerType) {
        const chart = this.questionTypeChart;
        if (!chart) return;

        const typeNames = {
            'mcq': 'Multiple Choice',
            'multi-select': 'Multi-Select',
            'matching': 'Matching',
            'true-false': 'True/False',
            'fill-blank': 'Fill in the Blank',
            'ordering': 'Ordering/Sequencing'
        };

        const totalQuestions = Object.values(questionsPerType).reduce((sum, count) => sum + count, 0);

        if (totalQuestions === 0) {
            chart.innerHTML = `
                <div class="chart-empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 20V10"></path>
                        <path d="M12 20V4"></path>
                        <path d="M6 20v-6"></path>
                    </svg>
                    <p>No questions answered yet. Complete a test to see your breakdown!</p>
                </div>
            `;
            return;
        }

        const chartHTML = Object.entries(questionsPerType)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => {
                const percentage = (count / totalQuestions * 100).toFixed(1);
                return `
                    <div class="chart-bar">
                        <div class="chart-bar-header">
                            <span class="chart-bar-label">${typeNames[type] || type}</span>
                            <span class="chart-bar-value">${count} (${percentage}%)</span>
                        </div>
                        <div class="chart-bar-container">
                            <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('');

        chart.innerHTML = chartHTML;
    }

    /**
     * Change trends chart period
     */
    changeTrendsPeriod(period) {
        // Update active button
        document.querySelectorAll('.chart-period-btn').forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update period and re-render
        this.currentTrendsPeriod = period;
        this.renderPerformanceTrendsChart(period);
    }

    /**
     * Render performance trends chart showing scores over time
     */
    async renderPerformanceTrendsChart(period) {
        const chart = this.performanceTrendsChart;
        if (!chart) return;

        // Get test history
        const tests = await this.getSavedTests();
        if (!tests || tests.length === 0) {
            chart.innerHTML = `
                <div class="chart-empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3v18h18"></path>
                        <path d="M18 12l-5-5-3 3-4-4"></path>
                    </svg>
                    <p>No test data yet. Complete some tests to see your performance trends!</p>
                </div>
            `;
            return;
        }

        // Calculate date range
        const now = new Date();
        const periodDays = period === 'all' ? 365 * 10 : parseInt(period);
        const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

        // Collect all test attempts within period
        const dataPoints = [];
        tests.forEach(test => {
            if (test.attempts && Array.isArray(test.attempts)) {
                test.attempts.forEach(attempt => {
                    const attemptDate = new Date(attempt.date);
                    if (attemptDate >= startDate) {
                        dataPoints.push({
                            date: attemptDate,
                            score: attempt.score.percentage,
                            title: test.title
                        });
                    }
                });
            }
        });

        // Sort by date
        dataPoints.sort((a, b) => a.date - b.date);

        if (dataPoints.length === 0) {
            chart.innerHTML = `
                <div class="chart-empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3v18h18"></path>
                        <path d="M18 12l-5-5-3 3-4-4"></path>
                    </svg>
                    <p>No test data in this time period.</p>
                </div>
            `;
            return;
        }

        // Calculate stats
        const avgScore = dataPoints.reduce((sum, dp) => sum + dp.score, 0) / dataPoints.length;
        const maxScore = Math.max(...dataPoints.map(dp => dp.score));
        const minScore = Math.min(...dataPoints.map(dp => dp.score));

        // Render chart
        const chartHeight = 250;
        const chartWidth = chart.offsetWidth - 60; // Account for padding
        const pointRadius = 4;

        // Scale data points
        const xScale = chartWidth / (dataPoints.length - 1 || 1);
        const yScale = (chartHeight - 40) / 100; // 0-100 scale

        // Build SVG path
        const points = dataPoints.map((dp, i) => {
            const x = i * xScale + 30;
            const y = chartHeight - (dp.score * yScale) - 20;
            return { x, y, score: dp.score, title: dp.title, date: dp.date };
        });

        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

        // Create area fill path
        const areaPath = `${pathData} L ${points[points.length - 1].x},${chartHeight - 20} L 30,${chartHeight - 20} Z`;

        chart.innerHTML = `
            <div class="chart-stats">
                <div class="chart-stat">
                    <span class="chart-stat-label">Average</span>
                    <span class="chart-stat-value">${Math.round(avgScore)}%</span>
                </div>
                <div class="chart-stat">
                    <span class="chart-stat-label">Best</span>
                    <span class="chart-stat-value">${Math.round(maxScore)}%</span>
                </div>
                <div class="chart-stat">
                    <span class="chart-stat-label">Lowest</span>
                    <span class="chart-stat-value">${Math.round(minScore)}%</span>
                </div>
                <div class="chart-stat">
                    <span class="chart-stat-label">Tests</span>
                    <span class="chart-stat-value">${dataPoints.length}</span>
                </div>
            </div>
            <svg class="line-chart" viewBox="0 0 ${chartWidth + 60} ${chartHeight}" preserveAspectRatio="none">
                <!-- Grid lines -->
                ${[0, 25, 50, 75, 100].map(val => `
                    <line x1="30" y1="${chartHeight - (val * yScale) - 20}"
                          x2="${chartWidth + 30}" y2="${chartHeight - (val * yScale) - 20}"
                          stroke="rgba(0,0,0,0.1)" stroke-width="1" stroke-dasharray="4"/>
                    <text x="10" y="${chartHeight - (val * yScale) - 16}"
                          font-size="12" fill="rgba(0,0,0,0.5)">${val}%</text>
                `).join('')}

                <!-- Area fill -->
                <path d="${areaPath}" fill="rgba(33, 128, 141, 0.1)" />

                <!-- Line -->
                <path d="${pathData}" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

                <!-- Data points -->
                ${points.map((p, i) => `
                    <circle cx="${p.x}" cy="${p.y}" r="${pointRadius}"
                            fill="white" stroke="var(--color-primary)" stroke-width="2"
                            class="chart-point" data-index="${i}"/>
                `).join('')}
            </svg>
            <div id="chart-tooltip" class="chart-tooltip hidden"></div>
        `;

        // Add interactivity
        const tooltip = chart.querySelector('#chart-tooltip');
        chart.querySelectorAll('.chart-point').forEach((point, i) => {
            point.addEventListener('mouseenter', () => {
                const data = dataPoints[i];
                const dateStr = data.date.toLocaleDateString();
                tooltip.innerHTML = `
                    <div class="tooltip-title">${this.escapeHtml(data.title)}</div>
                    <div class="tooltip-score">${Math.round(data.score)}%</div>
                    <div class="tooltip-date">${dateStr}</div>
                `;
                tooltip.classList.remove('hidden');
            });
            point.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });
        });

        console.log(`📊 Performance trends rendered: ${dataPoints.length} data points`);
    }

    /**
     * Render course and topic breakdown
     */
    async renderCourseTopicBreakdown() {
        const container = this.courseTopicBreakdown;
        if (!container) return;

        // Get test history
        const tests = await this.getSavedTests();
        if (!tests || tests.length === 0) {
            container.innerHTML = `
                <div class="chart-empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    <p>No course data yet. Save tests with course information to see your breakdown!</p>
                </div>
            `;
            return;
        }

        // Aggregate by course
        const courseStats = {};
        tests.forEach(test => {
            const course = test.course || 'Uncategorized';
            if (!courseStats[course]) {
                courseStats[course] = {
                    tests: 0,
                    totalScore: 0,
                    topics: {}
                };
            }

            courseStats[course].tests++;

            // Average all attempts
            if (test.attempts && test.attempts.length > 0) {
                const avgScore = test.attempts.reduce((sum, att) => sum + att.score.percentage, 0) / test.attempts.length;
                courseStats[course].totalScore += avgScore;
            }

            // Track topics
            const topic = test.topic || 'General';
            if (!courseStats[course].topics[topic]) {
                courseStats[course].topics[topic] = {
                    tests: 0,
                    totalScore: 0
                };
            }
            courseStats[course].topics[topic].tests++;
            if (test.attempts && test.attempts.length > 0) {
                const avgScore = test.attempts.reduce((sum, att) => sum + att.score.percentage, 0) / test.attempts.length;
                courseStats[course].topics[topic].totalScore += avgScore;
            }
        });

        // Sort courses by number of tests
        const sortedCourses = Object.entries(courseStats).sort((a, b) => b[1].tests - a[1].tests);

        if (sortedCourses.length === 0) {
            container.innerHTML = '<p class="chart-empty-state">No course data available.</p>';
            return;
        }

        container.innerHTML = sortedCourses.map(([courseName, data]) => {
            const avgScore = data.totalScore / data.tests;
            const topics = Object.entries(data.topics);

            return `
                <div class="course-breakdown-card">
                    <div class="course-breakdown-header">
                        <div class="course-breakdown-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                            <span>${this.escapeHtml(courseName)}</span>
                        </div>
                        <div class="course-breakdown-stats">
                            <span class="course-stat">${data.tests} test${data.tests !== 1 ? 's' : ''}</span>
                            <span class="course-score" style="color: ${avgScore >= 70 ? 'var(--color-success)' : avgScore >= 50 ? 'var(--color-warning)' : 'var(--color-error)'}">
                                ${Math.round(avgScore)}% avg
                            </span>
                        </div>
                    </div>
                    ${topics.length > 0 ? `
                        <div class="topic-breakdown">
                            ${topics.map(([topicName, topicData]) => {
                                const topicAvg = topicData.totalScore / topicData.tests;
                                return `
                                    <div class="topic-breakdown-item">
                                        <div class="topic-breakdown-name">${this.escapeHtml(topicName)}</div>
                                        <div class="topic-breakdown-stats">
                                            <span class="topic-tests">${topicData.tests} test${topicData.tests !== 1 ? 's' : ''}</span>
                                            <span class="topic-score" style="color: ${topicAvg >= 70 ? 'var(--color-success)' : topicAvg >= 50 ? 'var(--color-warning)' : 'var(--color-error)'}">
                                                ${Math.round(topicAvg)}%
                                            </span>
                                        </div>
                                        <div class="topic-breakdown-bar">
                                            <div class="topic-breakdown-fill" style="width: ${topicAvg}%; background-color: ${topicAvg >= 70 ? 'var(--color-success)' : topicAvg >= 50 ? 'var(--color-warning)' : 'var(--color-error)'}"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        console.log(`📚 Course/topic breakdown rendered: ${sortedCourses.length} courses`);
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

    // =========================================
    // VISUAL TEST BUILDER METHODS
    // =========================================

    /**
     * Open the test builder interface
     */
    openTestBuilder() {
        this.landingSection?.classList.add('hidden');
        this.jsonInputSection?.classList.add('hidden');
        this.testBuilderSection?.classList.remove('hidden');
        this.testLibrarySection?.classList.add('hidden');

        // Reset builder state
        this.builderQuestions = [];
        this.builderCurrentQuestionIndex = null;
        this.builderEditMode = false;

        // Clear form
        this.builderTestTitle.value = '';
        this.builderTestCourse.value = '';
        this.builderTestTopic.value = '';

        this.builderRenderQuestionList();
        this.builderShowEmptyState();

        console.log('🎨 Test Builder opened');
    }

    /**
     * Close the test builder and return to JSON input section
     */
    closeTestBuilder() {
        this.testBuilderSection?.classList.add('hidden');
        this.jsonInputSection?.classList.remove('hidden');

        console.log('🎨 Test Builder closed');
    }

    /**
     * Show the empty state in the editor
     */
    builderShowEmptyState() {
        this.builderEditorEmpty?.classList.remove('hidden');
        this.builderEditorForm?.classList.add('hidden');
    }

    /**
     * Show the question editor form
     */
    builderShowEditor() {
        this.builderEditorEmpty?.classList.add('hidden');
        this.builderEditorForm?.classList.remove('hidden');
    }

    /**
     * Add a new question
     */
    builderAddNewQuestion() {
        this.builderEditMode = false;
        this.builderCurrentQuestionIndex = null;

        // Clear form
        this.builderQuestionType.value = 'mcq';
        this.builderQuestionText.value = '';

        // Show editor and set up for new question
        this.builderShowEditor();
        this.builderToggleQuestionTypeFields();

        // Add default options for MCQ
        this.builderOptionsList.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            this.builderAddOption();
        }

        // Hide delete button for new questions
        this.builderDeleteQuestionBtn?.classList.add('hidden');

        console.log('➕ Adding new question');
    }

    /**
     * Edit an existing question
     */
    builderEditQuestion(index) {
        this.builderEditMode = true;
        this.builderCurrentQuestionIndex = index;
        const question = this.builderQuestions[index];

        // Populate form
        this.builderQuestionType.value = question.type;
        this.builderQuestionText.value = question.question;

        this.builderShowEditor();
        this.builderToggleQuestionTypeFields();

        // Populate options based on type
        if (question.type === 'mcq' || question.type === 'multi-select') {
            this.builderOptionsList.innerHTML = '';
            question.options.forEach((option, i) => {
                this.builderAddOption(option, question.type === 'mcq' ? (question.correct === i) : question.correct.includes(i));
            });
        } else if (question.type === 'matching') {
            this.builderMatchingPairsList.innerHTML = '';
            question.leftItems.forEach((leftItem, i) => {
                this.builderAddMatchingPair(leftItem, question.rightItems[i]);
            });
        } else if (question.type === 'true-false') {
            // Set True/False radio
            const value = question.correct === true || question.correct === 1 ? 'true' : 'false';
            const radio = document.querySelector(`input[name="builder-tf-answer"][value="${value}"]`);
            if (radio) radio.checked = true;
        } else if (question.type === 'fill-blank') {
            // Set accepted answers
            const acceptedAnswers = question.acceptedAnswers || [question.correct];
            this.builderFillAcceptedAnswersInput.value = acceptedAnswers.join('\n');
            this.builderFillCaseSensitiveCheckbox.checked = question.caseSensitive !== false;
        } else if (question.type === 'ordering') {
            // Set ordering items
            this.builderOrderingItemsList.innerHTML = '';
            question.items.forEach(item => {
                this.builderAddOrderingItem(item);
            });
        }

        // Show delete button for existing questions
        this.builderDeleteQuestionBtn?.classList.remove('hidden');

        // Update active state in question list
        document.querySelectorAll('.builder-question-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        console.log(`✏️ Editing question ${index + 1}`);
    }

    /**
     * Toggle question type-specific fields
     */
    builderToggleQuestionTypeFields() {
        const type = this.builderQuestionType.value;

        // Hide all type-specific containers first
        this.builderMcqOptionsContainer?.classList.add('hidden');
        this.builderMatchingOptionsContainer?.classList.add('hidden');
        this.builderTrueFalseContainer?.classList.add('hidden');
        this.builderFillBlankContainer?.classList.add('hidden');
        this.builderOrderingContainer?.classList.add('hidden');

        // Show the appropriate container based on type
        switch (type) {
            case 'mcq':
            case 'multi-select':
                this.builderMcqOptionsContainer?.classList.remove('hidden');
                // Initialize with 4 options if empty
                if (this.builderOptionsList.children.length === 0) {
                    for (let i = 0; i < 4; i++) {
                        this.builderAddOption();
                    }
                }
                break;

            case 'matching':
                this.builderMatchingOptionsContainer?.classList.remove('hidden');
                // Initialize with 3 matching pairs if empty
                if (this.builderMatchingPairsList.children.length === 0) {
                    for (let i = 0; i < 3; i++) {
                        this.builderAddMatchingPair();
                    }
                }
                break;

            case 'true-false':
                this.builderTrueFalseContainer?.classList.remove('hidden');
                break;

            case 'fill-blank':
                this.builderFillBlankContainer?.classList.remove('hidden');
                break;

            case 'ordering':
                this.builderOrderingContainer?.classList.remove('hidden');
                // Initialize with 4 items if empty
                if (this.builderOrderingItemsList.children.length === 0) {
                    for (let i = 0; i < 4; i++) {
                        this.builderAddOrderingItem();
                    }
                }
                break;
        }
    }

    /**
     * Add an option to MCQ/Multi-Select
     */
    builderAddOption(text = '', isCorrect = false) {
        const optionItem = document.createElement('div');
        optionItem.className = 'builder-option-item';

        const questionType = this.builderQuestionType.value;
        const inputType = questionType === 'mcq' ? 'radio' : 'checkbox';
        const index = this.builderOptionsList.children.length;

        optionItem.innerHTML = `
            <input type="${inputType}" name="builder-correct-answer" value="${index}" ${isCorrect ? 'checked' : ''}>
            <input type="text" placeholder="Option ${index + 1}" value="${this.escapeHtml(text)}">
            <button type="button" class="builder-option-delete" title="Remove option">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Delete handler
        optionItem.querySelector('.builder-option-delete').addEventListener('click', () => {
            optionItem.remove();
            // Re-index remaining options
            this.builderReindexOptions();
        });

        this.builderOptionsList.appendChild(optionItem);
    }

    /**
     * Re-index options after deletion
     */
    builderReindexOptions() {
        const options = this.builderOptionsList.querySelectorAll('.builder-option-item');
        options.forEach((option, index) => {
            const radio = option.querySelector('input[type="radio"], input[type="checkbox"]');
            const textInput = option.querySelector('input[type="text"]');

            radio.value = index;
            if (!textInput.value || textInput.value.startsWith('Option ')) {
                textInput.placeholder = `Option ${index + 1}`;
            }
        });
    }

    /**
     * Add a matching pair
     */
    builderAddMatchingPair(left = '', right = '') {
        const pairItem = document.createElement('div');
        pairItem.className = 'builder-matching-pair';

        pairItem.innerHTML = `
            <input type="text" class="builder-matching-input builder-matching-left" placeholder="Left item" value="${this.escapeHtml(left)}">
            <div class="builder-matching-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
            <input type="text" class="builder-matching-input builder-matching-right" placeholder="Right item" value="${this.escapeHtml(right)}">
            <button type="button" class="builder-option-delete" title="Remove pair">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Delete handler
        pairItem.querySelector('.builder-option-delete').addEventListener('click', () => {
            if (this.builderMatchingPairsList.children.length > 1) {
                pairItem.remove();
            } else {
                alert('You must have at least one matching pair');
            }
        });

        this.builderMatchingPairsList.appendChild(pairItem);
    }

    /**
     * Add an ordering item
     */
    builderAddOrderingItem(text = '') {
        const itemElement = document.createElement('div');
        itemElement.className = 'builder-ordering-item';

        const index = this.builderOrderingItemsList.children.length;

        itemElement.innerHTML = `
            <div class="ordering-item-number">${index + 1}</div>
            <input type="text" class="builder-ordering-input" placeholder="Item ${index + 1}" value="${this.escapeHtml(text)}">
            <button type="button" class="builder-option-delete" title="Remove item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Delete handler
        itemElement.querySelector('.builder-option-delete').addEventListener('click', () => {
            if (this.builderOrderingItemsList.children.length > 2) {
                itemElement.remove();
                // Re-number items
                this.builderReindexOrderingItems();
            } else {
                alert('You must have at least two items for ordering questions');
            }
        });

        this.builderOrderingItemsList.appendChild(itemElement);
    }

    /**
     * Re-index ordering items after deletion
     */
    builderReindexOrderingItems() {
        const items = this.builderOrderingItemsList.querySelectorAll('.builder-ordering-item');
        items.forEach((item, index) => {
            const numberElement = item.querySelector('.ordering-item-number');
            const inputElement = item.querySelector('.builder-ordering-input');
            numberElement.textContent = index + 1;
            if (inputElement.placeholder === inputElement.value || inputElement.placeholder.startsWith('Item ')) {
                inputElement.placeholder = `Item ${index + 1}`;
            }
        });
    }

    /**
     * Save the current question
     */
    builderSaveQuestion() {
        const questionType = this.builderQuestionType.value;
        const questionText = this.builderQuestionText.value.trim();

        if (!questionText) {
            alert('Please enter a question');
            return;
        }

        const question = {
            id: this.builderEditMode ? this.builderQuestions[this.builderCurrentQuestionIndex].id : Date.now(),
            type: questionType,
            question: questionText
        };

        // Get options/answers based on type
        if (questionType === 'mcq' || questionType === 'multi-select') {
            const options = Array.from(this.builderOptionsList.querySelectorAll('.builder-option-item'));
            question.options = options.map(opt => opt.querySelector('input[type="text"]').value.trim());

            // Validate options
            if (question.options.length < 2) {
                alert('Please add at least 2 options');
                return;
            }
            if (question.options.some(opt => !opt)) {
                alert('Please fill in all option fields');
                return;
            }

            // Get correct answer(s)
            if (questionType === 'mcq') {
                const selectedRadio = this.builderOptionsList.querySelector('input[type="radio"]:checked');
                if (!selectedRadio) {
                    alert('Please select the correct answer');
                    return;
                }
                question.correct = parseInt(selectedRadio.value);
            } else {
                const selectedCheckboxes = Array.from(this.builderOptionsList.querySelectorAll('input[type="checkbox"]:checked'));
                if (selectedCheckboxes.length === 0) {
                    alert('Please select at least one correct answer');
                    return;
                }
                question.correct = selectedCheckboxes.map(cb => parseInt(cb.value));
            }
        } else if (questionType === 'matching') {
            const pairs = Array.from(this.builderMatchingPairsList.querySelectorAll('.builder-matching-pair'));
            question.leftItems = pairs.map(pair => pair.querySelector('.builder-matching-left').value.trim());
            question.rightItems = pairs.map(pair => pair.querySelector('.builder-matching-right').value.trim());

            // Validate matching pairs
            if (pairs.length < 2) {
                alert('Please add at least 2 matching pairs');
                return;
            }
            if (question.leftItems.some(item => !item) || question.rightItems.some(item => !item)) {
                alert('Please fill in all matching pairs');
                return;
            }

            // Correct answer is the original order (0, 1, 2, ...)
            question.correct = question.leftItems.map((_, i) => i);
        } else if (questionType === 'true-false') {
            // Get True/False answer
            const selectedRadio = document.querySelector('input[name="builder-tf-answer"]:checked');
            if (!selectedRadio) {
                alert('Please select True or False');
                return;
            }
            question.correct = selectedRadio.value === 'true';
        } else if (questionType === 'fill-blank') {
            // Get accepted answers
            const answersText = this.builderFillAcceptedAnswersInput.value.trim();
            if (!answersText) {
                alert('Please enter at least one accepted answer');
                return;
            }
            question.acceptedAnswers = answersText.split('\n').map(a => a.trim()).filter(a => a);
            if (question.acceptedAnswers.length === 0) {
                alert('Please enter at least one accepted answer');
                return;
            }
            // Set first answer as the "correct" value (for backward compatibility)
            question.correct = question.acceptedAnswers[0];
            question.caseSensitive = this.builderFillCaseSensitiveCheckbox.checked;
        } else if (questionType === 'ordering') {
            // Get ordering items
            const itemInputs = Array.from(this.builderOrderingItemsList.querySelectorAll('.builder-ordering-input'));
            question.items = itemInputs.map(input => input.value.trim());

            // Validate items
            if (question.items.length < 2) {
                alert('Please add at least 2 items for ordering');
                return;
            }
            if (question.items.some(item => !item)) {
                alert('Please fill in all ordering items');
                return;
            }

            // Correct answer is the original order (0, 1, 2, ...)
            question.correct = question.items.map((_, i) => i);
        }

        // Save question
        if (this.builderEditMode) {
            this.builderQuestions[this.builderCurrentQuestionIndex] = question;
            console.log(`✅ Updated question ${this.builderCurrentQuestionIndex + 1}`);
        } else {
            this.builderQuestions.push(question);
            console.log(`✅ Added new question (total: ${this.builderQuestions.length})`);
        }

        // Update UI
        this.builderRenderQuestionList();
        this.builderShowEmptyState();

        // Reset state
        this.builderEditMode = false;
        this.builderCurrentQuestionIndex = null;
    }

    /**
     * Cancel editing
     */
    builderCancelEdit() {
        this.builderShowEmptyState();
        this.builderEditMode = false;
        this.builderCurrentQuestionIndex = null;

        // Clear active state
        document.querySelectorAll('.builder-question-item').forEach(item => {
            item.classList.remove('active');
        });

        console.log('❌ Canceled editing');
    }

    /**
     * Delete the current question
     */
    builderDeleteQuestion() {
        if (this.builderCurrentQuestionIndex === null) return;

        if (!confirm('Are you sure you want to delete this question?')) return;

        this.builderQuestions.splice(this.builderCurrentQuestionIndex, 1);
        console.log(`🗑️ Deleted question ${this.builderCurrentQuestionIndex + 1}`);

        this.builderRenderQuestionList();
        this.builderShowEmptyState();
        this.builderEditMode = false;
        this.builderCurrentQuestionIndex = null;
    }

    /**
     * Render the question list
     */
    builderRenderQuestionList() {
        this.builderQuestionCount.textContent = this.builderQuestions.length;

        if (this.builderQuestions.length === 0) {
            this.builderQuestionList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; color: var(--color-text-secondary); margin-bottom: var(--space-12);">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>No questions yet</p>
                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Click "Add Question" to start building your test</p>
                </div>
            `;
            return;
        }

        this.builderQuestionList.innerHTML = this.builderQuestions.map((q, index) => {
            const typeLabel = q.type === 'mcq' ? 'MCQ' : q.type === 'multi-select' ? 'Multi-Select' : 'Matching';
            const preview = q.question.length > 60 ? q.question.substring(0, 60) + '...' : q.question;

            return `
                <div class="builder-question-item" onclick="testSimulator.builderEditQuestion(${index})">
                    <div class="builder-question-item-number">${index + 1}</div>
                    <div class="builder-question-item-content">
                        <div class="builder-question-item-type">${typeLabel}</div>
                        <div class="builder-question-item-text">${this.escapeHtml(preview)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Export test as JSON
     */
    builderExportJSON() {
        const title = this.builderTestTitle.value.trim();

        if (!title) {
            alert('Please enter a test title before exporting');
            return;
        }

        if (this.builderQuestions.length === 0) {
            alert('Please add at least one question before exporting');
            return;
        }

        const test = {
            title: title,
            questions: this.builderQuestions
        };

        const jsonStr = JSON.stringify(test, null, 2);

        // Copy to clipboard
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert('✅ Test JSON copied to clipboard!\n\nYou can now paste it in the JSON input field to load the test, or save it for later.');
            console.log('📋 Exported JSON:', jsonStr);
        }).catch(err => {
            // Fallback: show in alert
            console.error('Failed to copy to clipboard:', err);
            prompt('Copy this JSON:', jsonStr);
        });
    }

    /**
     * Preview the test (load it into the simulator)
     */
    builderPreviewTest() {
        const title = this.builderTestTitle.value.trim() || 'Untitled Test';

        if (this.builderQuestions.length === 0) {
            alert('Please add at least one question before previewing');
            return;
        }

        const test = {
            title: title,
            questions: this.builderQuestions
        };

        // Load the test
        this.currentTest = test;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.score = null;

        // Close builder and start test
        this.testBuilderSection?.classList.add('hidden');
        this.startTest();

        console.log('👁️ Previewing test:', title);
    }

    /**
     * Show general toast notification
     */
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '🚨'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    /**
     * Show achievement unlock toasts
     */
    showAchievementToasts(achievements) {
        const container = document.getElementById('achievement-toast-container');
        if (!container) return;

        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const toast = document.createElement('div');
                toast.className = 'achievement-toast';
                toast.innerHTML = `
                    <div class="achievement-toast-icon">${achievement.icon}</div>
                    <div class="achievement-toast-content">
                        <div class="achievement-toast-title">Achievement Unlocked!</div>
                        <div class="achievement-toast-name">${achievement.name}</div>
                        <div class="achievement-toast-xp">+${achievement.xpReward} XP</div>
                    </div>
                `;

                container.appendChild(toast);

                // Animate in
                setTimeout(() => toast.classList.add('show'), 10);

                // Remove after 5 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 5000);
            }, index * 500); // Stagger toasts
        });
    }

    /**
     * Show level up toast
     */
    showLevelUpToast(newLevel) {
        const container = document.getElementById('achievement-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'achievement-toast level-up-toast';
        toast.innerHTML = `
            <div class="achievement-toast-icon">🎉</div>
            <div class="achievement-toast-content">
                <div class="achievement-toast-title">Level Up!</div>
                <div class="achievement-toast-name">You reached Level ${newLevel}</div>
            </div>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
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
