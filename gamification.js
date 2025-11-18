/**
 * Gamification System - Achievements, XP, Levels, Streaks
 * Manages all gamification features to make learning engaging and rewarding
 */

class GamificationSystem {
    constructor() {
        this.storageKey = 'testSimulatorGamification';
        this.data = this.loadData();
        this.initialize();
    }

    /**
     * Initialize gamification data structure
     */
    initialize() {
        // Default data structure
        const defaults = {
            xp: 0,
            level: 1,
            achievements: [],
            stats: {
                testsCompleted: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                perfectScores: 0,
                totalStudyTime: 0, // in seconds
                questionsPerType: {}
            },
            streak: {
                current: 0,
                longest: 0,
                lastActivityDate: null,
                history: [] // Array of dates
            },
            lastUpdated: new Date().toISOString()
        };

        // Merge with existing data
        this.data = { ...defaults, ...this.data };
    }

    /**
     * Achievement definitions
     */
    getAchievements() {
        return {
            // Test Completion Achievements
            'first_test': {
                id: 'first_test',
                name: 'Getting Started',
                description: 'Complete your first test',
                icon: '🎯',
                xpReward: 50,
                check: (stats) => stats.testsCompleted >= 1
            },
            'test_5': {
                id: 'test_5',
                name: 'Committed Learner',
                description: 'Complete 5 tests',
                icon: '📚',
                xpReward: 100,
                check: (stats) => stats.testsCompleted >= 5
            },
            'test_10': {
                id: 'test_10',
                name: 'Study Warrior',
                description: 'Complete 10 tests',
                icon: '⚔️',
                xpReward: 200,
                check: (stats) => stats.testsCompleted >= 10
            },
            'test_25': {
                id: 'test_25',
                name: 'Test Master',
                description: 'Complete 25 tests',
                icon: '👑',
                xpReward: 500,
                check: (stats) => stats.testsCompleted >= 25
            },
            'test_50': {
                id: 'test_50',
                name: 'Legendary Scholar',
                description: 'Complete 50 tests',
                icon: '🏆',
                xpReward: 1000,
                check: (stats) => stats.testsCompleted >= 50
            },

            // Perfect Score Achievements
            'perfect_1': {
                id: 'perfect_1',
                name: 'Flawless Victory',
                description: 'Get your first perfect score',
                icon: '💯',
                xpReward: 100,
                check: (stats) => stats.perfectScores >= 1
            },
            'perfect_5': {
                id: 'perfect_5',
                name: 'Perfectionist',
                description: 'Get 5 perfect scores',
                icon: '🌟',
                xpReward: 300,
                check: (stats) => stats.perfectScores >= 5
            },
            'perfect_10': {
                id: 'perfect_10',
                name: 'Perfect Master',
                description: 'Get 10 perfect scores',
                icon: '✨',
                xpReward: 750,
                check: (stats) => stats.perfectScores >= 10
            },

            // Streak Achievements
            'streak_3': {
                id: 'streak_3',
                name: 'On Fire',
                description: 'Maintain a 3-day streak',
                icon: '🔥',
                xpReward: 75,
                check: (stats, streak) => streak.current >= 3
            },
            'streak_7': {
                id: 'streak_7',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '🚀',
                xpReward: 150,
                check: (stats, streak) => streak.current >= 7
            },
            'streak_14': {
                id: 'streak_14',
                name: 'Fortnight Force',
                description: 'Maintain a 14-day streak',
                icon: '💪',
                xpReward: 300,
                check: (stats, streak) => streak.current >= 14
            },
            'streak_30': {
                id: 'streak_30',
                name: 'Monthly Marathon',
                description: 'Maintain a 30-day streak',
                icon: '🌙',
                xpReward: 750,
                check: (stats, streak) => streak.current >= 30
            },
            'streak_100': {
                id: 'streak_100',
                name: 'Century Champion',
                description: 'Maintain a 100-day streak',
                icon: '👑',
                xpReward: 2000,
                check: (stats, streak) => streak.current >= 100
            },

            // Question Achievements
            'questions_100': {
                id: 'questions_100',
                name: 'Century Mark',
                description: 'Answer 100 questions correctly',
                icon: '💯',
                xpReward: 100,
                check: (stats) => stats.correctAnswers >= 100
            },
            'questions_500': {
                id: 'questions_500',
                name: 'Answer Machine',
                description: 'Answer 500 questions correctly',
                icon: '🤖',
                xpReward: 300,
                check: (stats) => stats.correctAnswers >= 500
            },
            'questions_1000': {
                id: 'questions_1000',
                name: 'Thousand Strong',
                description: 'Answer 1000 questions correctly',
                icon: '🦾',
                xpReward: 1000,
                check: (stats) => stats.correctAnswers >= 1000
            },

            // Study Time Achievements
            'time_1hour': {
                id: 'time_1hour',
                name: 'First Hour',
                description: 'Study for 1 hour total',
                icon: '⏰',
                xpReward: 50,
                check: (stats) => stats.totalStudyTime >= 3600
            },
            'time_5hours': {
                id: 'time_5hours',
                name: 'Dedicated Student',
                description: 'Study for 5 hours total',
                icon: '📖',
                xpReward: 150,
                check: (stats) => stats.totalStudyTime >= 18000
            },
            'time_10hours': {
                id: 'time_10hours',
                name: 'Study Marathon',
                description: 'Study for 10 hours total',
                icon: '🏃',
                xpReward: 400,
                check: (stats) => stats.totalStudyTime >= 36000
            },
            'time_24hours': {
                id: 'time_24hours',
                name: 'Full Day Scholar',
                description: 'Study for 24 hours total',
                icon: '🌅',
                xpReward: 1000,
                check: (stats) => stats.totalStudyTime >= 86400
            }
        };
    }

    /**
     * Calculate level from XP
     */
    calculateLevel(xp) {
        // Level formula: level = floor(sqrt(xp / 100)) + 1
        // XP needed for next level increases progressively
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }

    /**
     * Calculate XP needed for next level
     */
    getXPForNextLevel(currentLevel) {
        // XP needed = (level ^ 2) * 100
        return Math.pow(currentLevel, 2) * 100;
    }

    /**
     * Get current level progress
     */
    getLevelProgress() {
        const currentLevel = this.data.level;
        const nextLevel = currentLevel + 1;
        const currentLevelXP = this.getXPForNextLevel(currentLevel - 1);
        const nextLevelXP = this.getXPForNextLevel(currentLevel);
        const progressXP = this.data.xp - currentLevelXP;
        const totalNeeded = nextLevelXP - currentLevelXP;
        const percentage = (progressXP / totalNeeded) * 100;

        return {
            currentLevel,
            nextLevel,
            currentXP: this.data.xp,
            progressXP,
            totalNeeded,
            percentage: Math.min(100, Math.max(0, percentage))
        };
    }

    /**
     * Record test completion
     */
    recordTestCompletion(testData) {
        const {
            score,
            totalQuestions,
            correctAnswers,
            timeSpent, // in seconds
            questionTypes
        } = testData;

        // Update stats
        this.data.stats.testsCompleted++;
        this.data.stats.totalQuestions += totalQuestions;
        this.data.stats.correctAnswers += correctAnswers;
        this.data.stats.totalStudyTime += timeSpent || 0;

        // Track perfect scores
        if (correctAnswers === totalQuestions) {
            this.data.stats.perfectScores++;
        }

        // Track questions by type
        if (questionTypes) {
            for (const type in questionTypes) {
                this.data.stats.questionsPerType[type] =
                    (this.data.stats.questionsPerType[type] || 0) + questionTypes[type];
            }
        }

        // Award XP based on performance
        let xpEarned = 0;
        const baseXP = totalQuestions * 5; // 5 XP per question
        const accuracyBonus = Math.floor((correctAnswers / totalQuestions) * baseXP);
        const perfectBonus = (correctAnswers === totalQuestions) ? 50 : 0;

        xpEarned = baseXP + accuracyBonus + perfectBonus;
        this.addXP(xpEarned);

        // Update streak
        this.updateStreak();

        // Check for new achievements
        const newAchievements = this.checkAchievements();

        // Save data
        this.saveData();

        return {
            xpEarned,
            newAchievements,
            leveledUp: this.calculateLevel(this.data.xp - xpEarned) < this.data.level
        };
    }

    /**
     * Add XP and update level
     */
    addXP(amount) {
        const oldLevel = this.data.level;
        this.data.xp += amount;
        this.data.level = this.calculateLevel(this.data.xp);
        return this.data.level > oldLevel;
    }

    /**
     * Update daily streak
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.data.streak.lastActivityDate;

        if (lastActivity === today) {
            // Already counted today
            return false;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastActivity === yesterdayStr) {
            // Continuing streak
            this.data.streak.current++;
        } else if (lastActivity === null || lastActivity !== today) {
            // Streak broken or first time
            this.data.streak.current = 1;
        }

        // Update longest streak
        if (this.data.streak.current > this.data.streak.longest) {
            this.data.streak.longest = this.data.streak.current;
        }

        // Add to history
        if (!this.data.streak.history.includes(today)) {
            this.data.streak.history.push(today);
        }

        this.data.streak.lastActivityDate = today;
        return true;
    }

    /**
     * Check for newly unlocked achievements
     */
    checkAchievements() {
        const achievements = this.getAchievements();
        const newAchievements = [];

        for (const achievementId in achievements) {
            // Skip if already unlocked
            if (this.data.achievements.includes(achievementId)) {
                continue;
            }

            const achievement = achievements[achievementId];
            if (achievement.check(this.data.stats, this.data.streak)) {
                // Achievement unlocked!
                this.data.achievements.push(achievementId);
                this.addXP(achievement.xpReward);
                newAchievements.push(achievement);
                console.log(`🏆 Achievement Unlocked: ${achievement.name} (+${achievement.xpReward} XP)`);
            }
        }

        return newAchievements;
    }

    /**
     * Get all achievements with unlock status
     */
    getAllAchievements() {
        const achievements = this.getAchievements();
        return Object.values(achievements).map(achievement => ({
            ...achievement,
            unlocked: this.data.achievements.includes(achievement.id),
            unlockedAt: this.data.achievements.includes(achievement.id) ?
                this.data.lastUpdated : null
        }));
    }

    /**
     * Get user statistics
     */
    getStats() {
        const accuracy = this.data.stats.totalQuestions > 0 ?
            (this.data.stats.correctAnswers / this.data.stats.totalQuestions) * 100 : 0;

        return {
            ...this.data.stats,
            accuracy: accuracy.toFixed(1),
            level: this.data.level,
            xp: this.data.xp,
            streak: this.data.streak,
            achievementsUnlocked: this.data.achievements.length,
            totalAchievements: Object.keys(this.getAchievements()).length
        };
    }

    /**
     * Load data from localStorage
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading gamification data:', error);
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
        } catch (error) {
            console.error('Error saving gamification data:', error);
        }
    }

    /**
     * Reset all gamification data (for testing)
     */
    reset() {
        if (confirm('Are you sure you want to reset all achievements and progress?')) {
            localStorage.removeItem(this.storageKey);
            this.data = {};
            this.initialize();
            console.log('🔄 Gamification data reset');
            return true;
        }
        return false;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
