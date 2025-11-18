# CLAUDE.md - AI Assistant Development Guide

**Last Updated:** 2025-11-18
**Project:** Test Simulator - Enhanced
**Type:** Progressive Web Application (PWA)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [File Structure](#file-structure)
5. [Key Components](#key-components)
6. [Development Workflows](#development-workflows)
7. [Firebase Integration](#firebase-integration)
8. [Code Conventions](#code-conventions)
9. [Testing & Debugging](#testing--debugging)
10. [Common Tasks](#common-tasks)
11. [Gotchas & Important Notes](#gotchas--important-notes)
12. [Deployment](#deployment)

---

## Project Overview

**Test Simulator - Enhanced** is a comprehensive test-taking Progressive Web Application designed for students and educators. It allows users to create, take, and manage custom tests with multiple question types, cloud synchronization, and focus timer features.

### Key Features

- **Multiple Question Types**: MCQ, Multi-select, and Matching questions
- **Cloud Sync**: Firebase-powered authentication and real-time data synchronization
- **Offline-First**: Service Worker caching with offline support
- **Test Library**: Save, organize, and search tests by course/topic
- **Pomodoro Timer**: Integrated focus timer for study sessions
- **Progress Tracking**: Automatic progress saving and attempt history
- **Export Options**: PDF and CSV export for test results
- **Theme Support**: Multiple themes including light, dark, and Claude-inspired themes
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Project Goals

1. Provide a simple, fast test-taking experience
2. Enable cross-device synchronization via Firebase
3. Work offline with local storage fallback
4. Require zero build tools (pure vanilla JavaScript)

---

## Technology Stack

### Core Technologies

- **JavaScript**: Vanilla ES6+ (no frameworks)
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties (CSS variables) for theming
- **Firebase SDK v10.7.1**: Authentication and Firestore database
- **Service Worker API**: PWA offline functionality

### Backend Services

- **Firebase Authentication**: Google Sign-In
- **Cloud Firestore**: NoSQL database for test storage
- **Firestore Offline Persistence**: Local caching and sync

### Deployment

- **Netlify**: Static site hosting with custom headers
- **GitHub**: Version control and CI/CD

### Browser APIs Used

- LocalStorage API
- Service Worker API
- Web App Manifest
- Notification API (Pomodoro timer)
- Print API (PDF export)
- Blob API (CSV export)

---

## Architecture Overview

### Application Pattern

**Single Page Application (SPA)** with section-based navigation:
- JSON Input Section (landing page)
- Test Library Section
- Pomodoro Timer Section
- Test Taking Section
- Results Section

### Data Flow

```
User Input → TestSimulator Class → Firebase Service → Firestore
                ↓                         ↓
          LocalStorage              Offline Persistence
                ↓                         ↓
          UI Update  ← Real-time Sync ←  Cloud
```

### Class Structure

1. **TestSimulator** (`app.js`)
   - Main application controller
   - Manages test state, UI, and user interactions
   - Handles test loading, navigation, scoring

2. **FirebaseService** (`firebase-service.js`)
   - Firebase initialization and configuration
   - Authentication management
   - Firestore CRUD operations
   - Real-time sync callbacks

3. **PomodoroTimer** (`pomodoro.js`)
   - Focus timer functionality
   - Task management
   - Analytics tracking

### Storage Strategy

**Hybrid Storage Model:**
- **Primary**: Firebase Firestore (when authenticated)
- **Fallback**: LocalStorage (offline or not authenticated)
- **Cache**: Service Worker cache (static assets)

Data is always saved to LocalStorage first, then synced to Firebase if user is authenticated.

---

## File Structure

```
/test-simulator/
├── index.html                 # Main HTML structure (SPA shell)
├── app.js                     # TestSimulator class (main app logic)
├── pomodoro.js               # PomodoroTimer class
├── style.css                 # All styles with CSS variables
├── firebase-config.js        # Firebase configuration
├── firebase-service.js       # FirebaseService class
├── service-worker.js         # PWA service worker
├── manifest.json             # PWA manifest
├── site.webmanifest         # Alternative manifest
├── netlify.toml             # Netlify deployment config
│
├── FIREBASE_SETUP.md        # Firebase setup guide
├── DEBUGGING_FIREBASE_SYNC.md  # Debugging guide
├── Test Generation Instructions.rtf  # AI prompt templates
│
└── [icons/images]           # PWA icons and favicons
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── icon-192.svg
    └── icon-512.svg
```

### File Responsibilities

| File | Purpose | When to Edit |
|------|---------|--------------|
| `index.html` | DOM structure, modals, sections | Adding new UI elements, sections |
| `app.js` | Core test logic, UI interactions | Test features, library, state management |
| `pomodoro.js` | Pomodoro timer features | Timer functionality, tasks, analytics |
| `style.css` | All styling, themes | UI appearance, themes, responsive design |
| `firebase-service.js` | Firebase operations | Auth, database operations, sync logic |
| `firebase-config.js` | Firebase credentials | Never (contains API keys) |
| `service-worker.js` | Offline caching | Cache strategy, PWA updates |

---

## Key Components

### 1. TestSimulator Class (`app.js`)

**Main application controller** - manages the entire test lifecycle.

#### Key Properties

```javascript
{
  currentTest: null,           // Current test data object
  currentQuestionIndex: 0,     // Current question position
  userAnswers: {},            // User's answers {questionId: answer}
  testStartTime: null,        // Test start timestamp
  timerInterval: null,        // Timer interval ID
  timeRemaining: null,        // Seconds remaining
  testDuration: null,         // Total test duration in seconds
  score: null                 // Final score object
}
```

#### Important Methods

- `loadTest()` - Validates and loads test from JSON input
- `startTest()` - Initializes test UI and timer
- `displayQuestion()` - Renders current question based on type
- `submitTest()` - Calculates results and displays review
- `saveCurrentTest()` - Saves test to library (localStorage + Firebase)
- `getSavedTests()` - Retrieves tests from Firebase or localStorage
- `saveTestToFirebase()` - Syncs single test to cloud

#### Test Data Structure

```javascript
{
  "title": "Test Title",
  "questions": [
    {
      "id": 1,
      "type": "mcq" | "multi-select" | "matching",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],  // for mcq/multi-select
      "leftItems": [...],                // for matching
      "rightItems": [...],               // for matching
      "correct": 1 | [0, 2] | [0, 1, 2]  // based on type
    }
  ]
}
```

### 2. FirebaseService Class (`firebase-service.js`)

**Firebase integration layer** - handles authentication and database operations.

#### Key Methods

- `initialize()` - Initializes Firebase app and services
- `signInWithGoogle()` - Google OAuth popup sign-in
- `signOut()` - Signs out current user
- `isSignedIn()` - Returns authentication status
- `saveTest(testEntry)` - Saves test to Firestore
- `getTests()` - Retrieves all user tests from Firestore
- `deleteTest(testId)` - Deletes test from Firestore
- `startRealtimeSync()` - Enables real-time Firestore listener
- `migrateFromLocalStorage(tests)` - Migrates local tests to cloud

#### Firestore Data Structure

```
users (collection)
  └─ {userId} (document)
       └─ tests (collection)
            └─ {testId} (document)
                 ├─ id: string
                 ├─ title: string
                 ├─ course: string
                 ├─ topic: string
                 ├─ testData: object
                 ├─ attempts: array
                 ├─ dateSaved: timestamp
                 ├─ lastAttempt: timestamp
                 └─ updatedAt: timestamp
```

#### Security Rules (Firestore)

Users can only read/write their own data:
```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### 3. PomodoroTimer Class (`pomodoro.js`)

**Focus timer functionality** - Pomodoro technique implementation with task management.

#### Features
- Configurable work/break durations
- Task list with progress tracking
- Session counting (4 work sessions → long break)
- Analytics and statistics
- Browser notifications
- Auto-start options

---

## Development Workflows

### Git Branching Strategy

**Branch Naming Convention:**
```
claude/{description}-{sessionId}
```

Example: `claude/fix-firebase-sync-issue-011CUgj3AXY8qUTMP9yNVJVi`

### Standard Development Workflow

1. **Start on feature branch** (already created for you)
   ```bash
   git status  # Verify current branch
   ```

2. **Make changes** following conventions in this guide

3. **Test locally**
   - Open `index.html` in browser
   - Test Firebase features (requires auth)
   - Check console for errors

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push to remote**
   ```bash
   git push -u origin <branch-name>
   ```

6. **Create Pull Request** (if requested by user)

### Important Git Rules

- **NEVER** push to main/master directly
- **ALWAYS** use the designated branch starting with `claude/`
- **NEVER** commit sensitive data (API keys are already in repo but documented)
- Use clear, descriptive commit messages

---

## Firebase Integration

### Setup Requirements

Users must configure their own Firebase project. See `FIREBASE_SETUP.md` for detailed instructions.

### Configuration File

`firebase-config.js` contains Firebase credentials. This file is tracked in git (not ideal, but current state).

**Current Config:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCtcmzI0NP5VmCIiaXfIprFE7ez_KlC0BE",
  authDomain: "test-simulator-5456a.firebaseapp.com",
  projectId: "test-simulator-5456a",
  storageBucket: "test-simulator-5456a.firebasestorage.app",
  messagingSenderId: "1007096675527",
  appId: "1:1007096675527:web:ea061e1f9dafc6281212e2"
};
```

### Authentication Flow

1. User clicks "Sign in with Google"
2. `FirebaseService.signInWithGoogle()` opens popup
3. `handleAuthStateChange()` triggered on success
4. UI updates to show user info
5. Real-time sync starts automatically
6. Local tests migrated to cloud (on first sign-in)

### Sync Behavior

**When Authenticated:**
- All test operations sync to Firestore
- Real-time listener updates UI on changes
- LocalStorage used as cache

**When Not Authenticated:**
- Tests saved to LocalStorage only
- No cloud sync
- Migration offered on first sign-in

### Offline Support

- Firestore offline persistence enabled
- Changes queued and synced when online
- Service worker caches all static assets
- LocalStorage always available as fallback

---

## Code Conventions

### JavaScript Style

1. **ES6+ Features**: Use modern JavaScript
   ```javascript
   // Good
   const tests = await this.getSavedTests();
   const filtered = tests.filter(test => test.course === courseFilter);

   // Avoid
   var self = this;
   ```

2. **Class-based Architecture**: Use ES6 classes
   ```javascript
   class TestSimulator {
     constructor() { ... }
     methodName() { ... }
   }
   ```

3. **Async/Await**: Prefer over promises
   ```javascript
   // Good
   async saveTest() {
     const tests = await this.getSavedTests();
     await this.saveTestsToBank(tests);
   }

   // Avoid
   saveTest() {
     this.getSavedTests().then(tests => {
       this.saveTestsToBank(tests);
     });
   }
   ```

4. **Error Handling**: Always catch errors
   ```javascript
   try {
     await firebaseService.saveTest(testEntry);
   } catch (error) {
     console.error('Failed to save:', error);
     alert('Warning: Cloud sync failed');
   }
   ```

### HTML Conventions

1. **Semantic HTML**: Use appropriate tags
2. **Accessibility**: Include ARIA labels and roles
   ```html
   <button
     id="load-test-btn"
     class="btn btn--primary"
     aria-label="Load test from JSON input">
     Load Test
   </button>
   ```

3. **BEM-style Classes**: Not strict, but component-based
   ```html
   <div class="test-card">
     <div class="test-card-header">
       <h3 class="test-card-title">Title</h3>
     </div>
   </div>
   ```

### CSS Conventions

1. **CSS Variables**: Use for theming
   ```css
   :root {
     --color-primary: #21808D;
     --space-12: 12px;
   }
   ```

2. **Theme Attributes**: Support multiple themes
   ```css
   [data-theme="claude-dark"] {
     --color-bg: #1C1917;
   }
   ```

3. **Mobile-First**: Responsive design patterns

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `TestSimulator`, `FirebaseService` |
| Methods | camelCase | `loadTest()`, `displayQuestion()` |
| Properties | camelCase | `currentTest`, `userAnswers` |
| Constants | UPPER_SNAKE_CASE | `CACHE_NAME`, `API_KEY` |
| Files | kebab-case | `firebase-service.js` |
| CSS Classes | kebab-case | `test-card`, `btn--primary` |
| IDs | kebab-case | `json-input`, `test-section` |

---

## Testing & Debugging

### Console Logging Strategy

The codebase uses extensive console logging with emoji prefixes:

```javascript
console.log('🚀 Initializing Firebase...');
console.log('✅ Firebase initialized successfully');
console.error('❌ Firebase initialization failed:', error);
console.warn('⚠️ Firebase not configured');
```

**Emoji Conventions:**
- 🚀 Starting/Initializing
- ✅ Success
- ❌ Error/Failure
- ⚠️ Warning
- 🔍 Debugging/Checking
- 💾 Saving
- 📱 Loading/Fetching
- 🔐 Authentication
- ☁️ Cloud/Firebase operations

### Common Debugging Steps

1. **Check Console**: Press F12, look for errors
2. **Verify Firebase**: Check logs for initialization
3. **Check Auth State**: Look for "Auth state changed" logs
4. **Inspect Storage**:
   - Application tab → LocalStorage
   - Check `testSimulatorBank` key
5. **Check Network**: Firebase requests in Network tab

### Debug Mode

Enable verbose logging by checking console messages. All critical operations log their state.

### Common Issues & Solutions

See `DEBUGGING_FIREBASE_SYNC.md` for comprehensive troubleshooting guide.

**Quick Fixes:**
- **Tests not syncing**: Check authentication state in console
- **Firebase errors**: Verify config in `firebase-config.js`
- **UI not updating**: Check for JavaScript errors in console
- **Timer not working**: Verify timer toggle is checked before loading test

---

## Common Tasks

### Adding a New Question Type

1. **Update validation** in `validateTestData()`:
   ```javascript
   if (!['mcq', 'multi-select', 'matching', 'NEW_TYPE'].includes(question.type)) {
     this.showError(`Invalid type`);
   }
   ```

2. **Add display method** in TestSimulator:
   ```javascript
   displayNewTypeQuestion(question, questionNum) {
     // Render UI for new type
   }
   ```

3. **Add to `displayQuestion()` switch**:
   ```javascript
   case 'NEW_TYPE':
     this.displayNewTypeQuestion(question, questionNum);
     break;
   ```

4. **Update scoring logic** in `isAnswerCorrect()` and `calculateResults()`

5. **Update review display** in `getAnswerReview()`

### Adding a New Theme

1. **Add theme button** in HTML:
   ```html
   <button class="theme-option" data-theme="new-theme">
     <span class="theme-icon">🎨</span>
     <span>New Theme</span>
   </button>
   ```

2. **Add CSS variables** in `style.css`:
   ```css
   [data-theme="new-theme"] {
     --color-bg: #FFFFFF;
     --color-text: #000000;
     /* etc. */
   }
   ```

3. **Update meta theme color** in `updateMetaThemeColor()`:
   ```javascript
   const colors = {
     'new-theme': '#HEX_COLOR'
   };
   ```

### Modifying Firebase Schema

1. **Update data structure** in `saveCurrentTest()`:
   ```javascript
   const testEntry = {
     id: Date.now().toString(),
     title: title,
     // Add new field here
     newField: value,
     testData: this.currentTest
   };
   ```

2. **Update Firestore rules** if needed (in Firebase Console)

3. **Update display/render methods** to show new data

4. **Consider migration** for existing data

### Adding New Modal

1. **Add HTML structure** in `index.html`:
   ```html
   <div id="new-modal" class="modal hidden" role="dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h3>Modal Title</h3>
       </div>
       <div class="modal-body">
         <!-- Content -->
       </div>
     </div>
   </div>
   ```

2. **Add references** in `initializeElements()`:
   ```javascript
   this.newModal = document.getElementById('new-modal');
   ```

3. **Add event handlers** in `bindEvents()`:
   ```javascript
   this.openModalBtn.addEventListener('click', () => this.showNewModal());
   ```

4. **Add methods**:
   ```javascript
   showNewModal() {
     this.newModal.classList.remove('hidden');
   }

   hideNewModal() {
     this.newModal.classList.add('hidden');
   }
   ```

---

## Gotchas & Important Notes

### Critical Issues to Avoid

1. **Firebase Config in Git**
   - API keys are currently committed (not best practice)
   - Do NOT regenerate or change Firebase config without user approval
   - Client-side API keys are restricted in Firebase Console

2. **Service Worker Caching**
   - Update `CACHE_NAME` version when changing cached files
   - Old cache persists until version changes
   - Hard refresh (Ctrl+Shift+R) bypasses cache for testing

3. **LocalStorage Limits**
   - ~5-10MB limit per domain
   - Large test libraries may hit limits
   - Always wrap in try/catch

4. **Firebase Offline Persistence**
   - Only works in one tab at a time
   - Multiple tabs = "failed-precondition" error (non-fatal)
   - Handled gracefully in code

5. **Timer State**
   - Timer continues in background
   - Must call `stopTimer()` before restart
   - Saved in progress for resume

6. **Global Variable**
   - `testSimulator` is global (required for inline onclick handlers)
   - Modern approach would use event delegation, but current pattern works

7. **Data Migration**
   - First sign-in prompts migration from localStorage to Firebase
   - Migration tracked per user ID
   - Don't clear localStorage without user consent

### Security Considerations

1. **XSS Prevention**
   - All user input escaped via `escapeHtml()` method
   - Never use `innerHTML` with unescaped user data

2. **Firestore Rules**
   - Users can only access own data
   - Rules enforced server-side
   - Test rules before deploying

3. **API Key Exposure**
   - Firebase API keys are client-safe (restricted in Firebase Console)
   - Domain restrictions prevent abuse

### Performance Notes

1. **Progress Saving**
   - Saves every 5 seconds during test (not every second)
   - Reduces localStorage write operations

2. **Real-time Listeners**
   - Only one listener per user
   - Unsubscribed on sign-out
   - Stored in array for cleanup

3. **Service Worker**
   - Caches all static assets
   - Network-first for API calls
   - Cache-first for assets

---

## Deployment

### Netlify Configuration

Configured in `netlify.toml`:

```toml
[build]
  command = "echo 'No build required - static site'"
  publish = "."
```

**Key Settings:**
- No build step (static site)
- Root directory as publish directory
- Redirects all routes to `index.html` (SPA)
- Custom headers for security and PWA

### Deployment Process

**Automatic:**
- Push to configured branch → Netlify auto-deploys
- Preview deploys for pull requests

**Manual (if needed):**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

None required currently. All configuration in committed files.

### Domain Configuration

**For Firebase Auth:**
1. Add domain to Firebase Console
2. Authentication → Settings → Authorized domains
3. Add production domain (e.g., `your-site.netlify.app`)

### Post-Deployment Checklist

- [ ] Test sign-in flow
- [ ] Verify Firebase sync
- [ ] Check service worker registration
- [ ] Test offline functionality
- [ ] Verify PWA install prompt
- [ ] Test on mobile device
- [ ] Check all themes work
- [ ] Verify export functions (PDF, CSV)

---

## Quick Reference

### Key Keyboard Shortcuts (during test)

- `←` Previous question
- `→` Next question
- `Ctrl + Enter` Submit test

### LocalStorage Keys

- `testSimulatorProgress` - In-progress test state
- `testSimulatorTheme` - Selected theme
- `testSimulatorBank` - Saved tests array
- `testBankMigrated` - Migration tracking (user IDs)
- `pomodoroSettings` - Pomodoro configuration
- `pomodoroTasks` - Task list
- `pomodoroSessions` - Session history

### Important URLs

- Firebase Console: https://console.firebase.google.com/
- Netlify Dashboard: https://app.netlify.com/
- Repository: (check git remote)

### File Size Reference

- `app.js`: ~66KB (1,765 lines)
- `pomodoro.js`: ~28KB (large file)
- `firebase-service.js`: ~23KB (comprehensive Firebase integration)
- `style.css`: ~60KB (includes all themes)
- `index.html`: ~38KB (includes all modals)

---

## When to Ask the User

**Always ask before:**
1. Changing Firebase configuration
2. Modifying database schema
3. Changing authentication flow
4. Removing or changing features
5. Updating dependencies (CDN links)
6. Changing deployment settings
7. Altering security rules

**You can proceed without asking:**
1. Bug fixes (if clearly bugs)
2. Code refactoring (maintaining behavior)
3. Adding console logs for debugging
4. Fixing typos in comments/strings
5. Improving error messages
6. Adding JSDoc comments

---

## Additional Resources

- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Debugging Guide**: See `DEBUGGING_FIREBASE_SYNC.md`
- **Test Generation**: See `Test Generation Instructions.rtf`

---

## Version History

- **v7** (Current): Latest with comprehensive Firebase sync debugging
- **v6**: Firebase sync improvements
- **v5**: Pomodoro timer fixes
- **v4**: Firebase configuration restored
- **v3**: Security updates (API key concerns)
- **v2**: Initial Firebase integration
- **v1**: Base test simulator

---

## Final Notes for AI Assistants

This codebase prioritizes:
1. **Simplicity**: No build tools, frameworks, or complexity
2. **Offline-First**: Works without internet/authentication
3. **Progressive Enhancement**: Features layer on top of basic functionality
4. **User Data Safety**: Never lose user's tests, prefer local storage
5. **Accessibility**: ARIA labels, keyboard nav, semantic HTML

When making changes:
- Test locally first (open index.html)
- Check console for errors/warnings
- Verify both authenticated and non-authenticated states
- Ensure offline functionality still works
- Maintain existing code style and patterns
- Add appropriate console logging
- Update this document if architecture changes

**Remember**: This is a student-focused app. Reliability and data safety are more important than features.
