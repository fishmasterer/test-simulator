/**
 * Firebase Service Layer
 * Handles authentication, Firestore operations, and cloud sync
 */

class FirebaseService {
    constructor() {
        this.auth = null;
        this.db = null;
        this.currentUser = null;
        this.unsubscribers = [];
        this.syncCallbacks = [];
        this.initialized = false;
    }

    /**
     * Initialize Firebase
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        try {
            // Check if Firebase config is valid
            if (!firebaseConfig || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
                console.warn('Firebase not configured. Using localStorage only.');
                return false;
            }

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.auth = firebase.auth();
            this.db = firebase.firestore();

            // Enable offline persistence
            await this.db.enablePersistence({ synchronizeTabs: true })
                .catch((err) => {
                    if (err.code === 'failed-precondition') {
                        console.warn('Persistence failed: Multiple tabs open');
                    } else if (err.code === 'unimplemented') {
                        console.warn('Persistence not available in this browser');
                    }
                });

            // Listen for auth state changes
            this.auth.onAuthStateChanged((user) => this.handleAuthStateChange(user));

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            return false;
        }
    }

    /**
     * Handle authentication state changes
     * @param {Object} user - Firebase user object
     */
    handleAuthStateChange(user) {
        this.currentUser = user;

        if (user) {
            console.log('User signed in:', user.email);
            this.updateAuthUI(true, user);
            this.startRealtimeSync();
        } else {
            console.log('User signed out');
            this.updateAuthUI(false);
            this.stopRealtimeSync();
        }
    }

    /**
     * Update authentication UI
     * @param {boolean} signedIn - Whether user is signed in
     * @param {Object} user - User object (optional)
     */
    updateAuthUI(signedIn, user = null) {
        const signedOutDiv = document.getElementById('auth-signed-out');
        const signedInDiv = document.getElementById('auth-signed-in');
        const userName = document.getElementById('auth-user-name');
        const userPhoto = document.getElementById('auth-user-photo');

        if (signedIn && user) {
            signedOutDiv?.classList.add('hidden');
            signedInDiv?.classList.remove('hidden');
            if (userName) userName.textContent = user.displayName || user.email;
            if (userPhoto) userPhoto.src = user.photoURL || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2321808D"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 4-8 4v2h16v-2s-2-4-8-4z"/></svg>';
        } else {
            signedOutDiv?.classList.remove('hidden');
            signedInDiv?.classList.add('hidden');
        }
    }

    /**
     * Update sync indicator
     * @param {string} status - 'syncing', 'synced', 'error', 'offline'
     */
    updateSyncIndicator(status) {
        const indicator = document.getElementById('sync-indicator');
        if (!indicator) return;

        const icons = {
            syncing: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sync-spin"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>',
            synced: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            error: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            offline: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>'
        };

        const labels = {
            syncing: 'Syncing...',
            synced: 'Synced',
            error: 'Sync error',
            offline: 'Offline'
        };

        indicator.innerHTML = icons[status] + ' ' + labels[status];
        indicator.className = `sync-indicator sync-${status}`;
        indicator.title = labels[status];
    }

    /**
     * Sign in with Google
     * @returns {Promise<Object>} User object
     */
    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await this.auth.signInWithPopup(provider);
            return result.user;
        } catch (error) {
            console.error('Sign in failed:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Sign in cancelled');
            } else if (error.code === 'auth/unauthorized-domain') {
                throw new Error('This domain is not authorized. Please add it in Firebase Console.');
            }
            throw error;
        }
    }

    /**
     * Sign out
     * @returns {Promise<void>}
     */
    async signOut() {
        try {
            await this.auth.signOut();
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        }
    }

    /**
     * Check if user is signed in
     * @returns {boolean}
     */
    isSignedIn() {
        return this.currentUser !== null;
    }

    /**
     * Get current user ID
     * @returns {string|null}
     */
    getUserId() {
        return this.currentUser?.uid || null;
    }

    /**
     * Save test to Firestore
     * @param {Object} testData - Test data to save
     * @returns {Promise<string>} Test ID
     */
    async saveTest(testData) {
        if (!this.isSignedIn()) {
            throw new Error('Must be signed in to save to cloud');
        }

        try {
            this.updateSyncIndicator('syncing');

            const userId = this.getUserId();
            const testRef = this.db.collection('users').doc(userId).collection('tests').doc(testData.id);

            await testRef.set({
                ...testData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.updateSyncIndicator('synced');
            return testData.id;
        } catch (error) {
            console.error('Failed to save test:', error);
            this.updateSyncIndicator('error');
            throw error;
        }
    }

    /**
     * Get all tests for current user
     * @returns {Promise<Array>} Array of tests
     */
    async getTests() {
        if (!this.isSignedIn()) {
            return [];
        }

        try {
            const userId = this.getUserId();
            const snapshot = await this.db
                .collection('users')
                .doc(userId)
                .collection('tests')
                .orderBy('lastAttempt', 'desc')
                .get();

            return snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Failed to get tests:', error);
            return [];
        }
    }

    /**
     * Delete test from Firestore
     * @param {string} testId - Test ID to delete
     * @returns {Promise<void>}
     */
    async deleteTest(testId) {
        if (!this.isSignedIn()) {
            throw new Error('Must be signed in');
        }

        try {
            this.updateSyncIndicator('syncing');

            const userId = this.getUserId();
            await this.db
                .collection('users')
                .doc(userId)
                .collection('tests')
                .doc(testId)
                .delete();

            this.updateSyncIndicator('synced');
        } catch (error) {
            console.error('Failed to delete test:', error);
            this.updateSyncIndicator('error');
            throw error;
        }
    }

    /**
     * Start real-time sync
     */
    startRealtimeSync() {
        if (!this.isSignedIn()) return;

        const userId = this.getUserId();
        const unsubscribe = this.db
            .collection('users')
            .doc(userId)
            .collection('tests')
            .onSnapshot((snapshot) => {
                const changes = snapshot.docChanges();
                if (changes.length > 0) {
                    console.log(`Sync: ${changes.length} changes detected`);
                    this.notifySyncCallbacks(snapshot.docs.map(doc => doc.data()));
                }
            }, (error) => {
                console.error('Realtime sync error:', error);
                this.updateSyncIndicator('error');
            });

        this.unsubscribers.push(unsubscribe);
    }

    /**
     * Stop real-time sync
     */
    stopRealtimeSync() {
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    }

    /**
     * Register callback for sync updates
     * @param {Function} callback - Callback function
     */
    onSync(callback) {
        this.syncCallbacks.push(callback);
    }

    /**
     * Notify all sync callbacks
     * @param {Array} tests - Updated tests array
     */
    notifySyncCallbacks(tests) {
        this.syncCallbacks.forEach(callback => callback(tests));
    }

    /**
     * Share test with others
     * @param {Object} testData - Test to share
     * @returns {Promise<string>} Share code
     */
    async shareTest(testData) {
        if (!this.isSignedIn()) {
            throw new Error('Must be signed in to share tests');
        }

        try {
            this.updateSyncIndicator('syncing');

            // Generate unique share code
            const shareCode = this.generateShareCode();

            const shareData = {
                code: shareCode,
                testData: testData.testData,
                title: testData.title,
                course: testData.course,
                topic: testData.topic,
                sharedBy: this.currentUser.displayName || this.currentUser.email,
                createdBy: this.getUserId(),
                sharedAt: firebase.firestore.FieldValue.serverTimestamp(),
                accessCount: 0
            };

            await this.db.collection('sharedTests').doc(shareCode).set(shareData);

            this.updateSyncIndicator('synced');
            return shareCode;
        } catch (error) {
            console.error('Failed to share test:', error);
            this.updateSyncIndicator('error');
            throw error;
        }
    }

    /**
     * Get shared test by code
     * @param {string} shareCode - Share code
     * @returns {Promise<Object>} Test data
     */
    async getSharedTest(shareCode) {
        if (!this.isSignedIn()) {
            throw new Error('Must be signed in to access shared tests');
        }

        try {
            const doc = await this.db.collection('sharedTests').doc(shareCode.toUpperCase()).get();

            if (!doc.exists) {
                throw new Error('Test not found. Check the share code.');
            }

            // Increment access count
            await doc.ref.update({
                accessCount: firebase.firestore.FieldValue.increment(1)
            });

            return doc.data();
        } catch (error) {
            console.error('Failed to get shared test:', error);
            throw error;
        }
    }

    /**
     * Publish test to community library
     * @param {Object} testData - Test to publish
     * @returns {Promise<string>} Test ID
     */
    async publishToLibrary(testData) {
        if (!this.isSignedIn()) {
            throw new Error('Must be signed in to publish tests');
        }

        try {
            this.updateSyncIndicator('syncing');

            const publicTest = {
                id: testData.id,
                testData: testData.testData,
                title: testData.title,
                course: testData.course,
                topic: testData.topic,
                publishedBy: this.currentUser.displayName || this.currentUser.email,
                createdBy: this.getUserId(),
                publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
                downloads: 0,
                rating: 0,
                ratingCount: 0
            };

            await this.db.collection('publicTests').doc(testData.id).set(publicTest);

            this.updateSyncIndicator('synced');
            return testData.id;
        } catch (error) {
            console.error('Failed to publish test:', error);
            this.updateSyncIndicator('error');
            throw error;
        }
    }

    /**
     * Browse community tests
     * @param {Object} filters - Filter options
     * @returns {Promise<Array>} Public tests
     */
    async browsePublicTests(filters = {}) {
        if (!this.isSignedIn()) {
            throw new Error('Must be signed in to browse tests');
        }

        try {
            let query = this.db.collection('publicTests').orderBy('publishedAt', 'desc');

            if (filters.course) {
                query = query.where('course', '==', filters.course);
            }

            if (filters.topic) {
                query = query.where('topic', '==', filters.topic);
            }

            const snapshot = await query.limit(50).get();
            return snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Failed to browse public tests:', error);
            return [];
        }
    }

    /**
     * Save study session analytics
     * @param {Object} sessionData - Session data
     * @returns {Promise<void>}
     */
    async saveStudySession(sessionData) {
        if (!this.isSignedIn()) return;

        try {
            const userId = this.getUserId();
            await this.db
                .collection('users')
                .doc(userId)
                .collection('sessions')
                .add({
                    ...sessionData,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    }

    /**
     * Get study analytics
     * @param {number} days - Number of days to look back
     * @returns {Promise<Object>} Analytics data
     */
    async getStudyAnalytics(days = 30) {
        if (!this.isSignedIn()) return null;

        try {
            const userId = this.getUserId();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const snapshot = await this.db
                .collection('users')
                .doc(userId)
                .collection('sessions')
                .where('timestamp', '>=', startDate)
                .orderBy('timestamp', 'desc')
                .get();

            const sessions = snapshot.docs.map(doc => doc.data());

            // Calculate statistics
            const totalSessions = sessions.length;
            const totalQuestions = sessions.reduce((sum, s) => sum + (s.totalQuestions || 0), 0);
            const correctAnswers = sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
            const avgScore = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100) : 0;

            return {
                totalSessions,
                totalQuestions,
                correctAnswers,
                avgScore: avgScore.toFixed(1),
                sessions
            };
        } catch (error) {
            console.error('Failed to get analytics:', error);
            return null;
        }
    }

    /**
     * Generate random share code
     * @returns {string} Share code
     */
    generateShareCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar chars
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Migrate localStorage tests to Firestore
     * @param {Array} tests - Tests from localStorage
     * @returns {Promise<number>} Number of tests migrated
     */
    async migrateFromLocalStorage(tests) {
        if (!this.isSignedIn() || !tests || tests.length === 0) {
            return 0;
        }

        try {
            this.updateSyncIndicator('syncing');

            const userId = this.getUserId();
            const batch = this.db.batch();

            tests.forEach(test => {
                const testRef = this.db.collection('users').doc(userId).collection('tests').doc(test.id);
                batch.set(testRef, {
                    ...test,
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            await batch.commit();

            this.updateSyncIndicator('synced');
            console.log(`Migrated ${tests.length} tests to Firestore`);
            return tests.length;
        } catch (error) {
            console.error('Migration failed:', error);
            this.updateSyncIndicator('error');
            throw error;
        }
    }
}

// Create global instance
const firebaseService = new FirebaseService();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const initialized = await firebaseService.initialize();

    if (initialized) {
        console.log('Firebase initialized successfully');

        // Set up auth buttons
        const signInBtn = document.getElementById('sign-in-btn');
        const signOutBtn = document.getElementById('sign-out-btn');

        signInBtn?.addEventListener('click', async () => {
            try {
                await firebaseService.signInWithGoogle();
            } catch (error) {
                alert(error.message || 'Failed to sign in. Please try again.');
            }
        });

        signOutBtn?.addEventListener('click', async () => {
            if (confirm('Are you sure you want to sign out? Your tests will remain in the cloud.')) {
                try {
                    await firebaseService.signOut();
                } catch (error) {
                    alert('Failed to sign out. Please try again.');
                }
            }
        });
    } else {
        console.log('Firebase not configured - running in offline mode');
        // Hide auth header if Firebase is not configured
        const authHeader = document.getElementById('auth-header');
        if (authHeader) authHeader.style.display = 'none';
    }
});
