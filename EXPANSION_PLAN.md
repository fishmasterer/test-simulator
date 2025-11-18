# TEST SIMULATOR - MAJOR EXPANSION PLAN

**Session Started:** 2025-11-18
**Branch:** `claude/major-expansion-01Do2ksdPuCP7PXr1nq64tfg`
**Goal:** Broad and deep expansion while maintaining app's simplicity and charm
**Strategy:** Implement in checkpointed chunks with frequent GitHub pushes

---

## Core Philosophy (MUST PRESERVE)

✅ **Keep:**
- No build tools, pure vanilla JavaScript
- Offline-first functionality
- Simple, intuitive UX
- Fast performance
- Accessibility-first design
- LocalStorage + Firebase hybrid storage

❌ **Avoid:**
- Framework dependencies
- Complex build processes
- Breaking existing features
- Sacrificing performance for features

---

## EXPANSION AREAS

### 1. 📝 Enhanced Question Types (PRIORITY: HIGH)

**New Question Types to Add:**

#### 1.1 True/False Questions
- Simple boolean answer
- Show as radio buttons or toggle
- Scoring: binary correct/incorrect

#### 1.2 Fill-in-the-Blank
- Single blank: `The capital of France is ____`
- Multiple blanks: `____ discovered ____ in ____`
- Case-insensitive matching
- Partial credit for multi-blank questions
- Alternative accepted answers

#### 1.3 Essay/Short Answer
- Text area input
- Manual grading required
- Save responses
- Optional: AI-assisted grading suggestions
- Character/word count

#### 1.4 Ordering/Sequencing
- Drag-and-drop list items into correct order
- Example: "Order these events chronologically"
- Partial credit for partially correct sequences

#### 1.5 Image-Based Questions
- Embed images in question text
- Image hotspot questions (click correct area)
- Image labeling
- Support Base64 embedded images or URLs

#### 1.6 Code Questions
- Syntax-highlighted code display
- Multiple choice about code output
- Fill-in-blank for code snippets
- Support multiple languages

**Implementation Notes:**
- Add to `validateTestData()` in app.js
- Create display methods for each type
- Update scoring logic in `calculateResults()`
- Update review display in `getAnswerReview()`
- Maintain backward compatibility with existing question types

---

### 2. 🎨 Visual Test Builder (PRIORITY: HIGH)

**GUI Test Creation Interface:**

#### 2.1 Test Builder Modal/Section
- Visual editor (alternative to JSON input)
- Live preview pane
- Drag-and-drop question ordering
- Duplicate/delete questions easily
- Import existing test to edit
- Export to JSON

#### 2.2 Question Editor
- Form-based question creation
- Type selector dropdown
- Dynamic form based on question type
- Add/remove options with buttons
- Rich text support (bold, italic, lists)
- Image upload/embed

#### 2.3 Template System
- Pre-built test templates
- Subject-specific templates (Math, Science, History, etc.)
- Quick-start options
- Save custom templates

#### 2.4 Question Bank
- Reusable question library
- Tag questions by subject/difficulty
- Import questions into tests
- Search and filter questions

**Implementation Notes:**
- Create new section in index.html
- New TestBuilder class or methods in TestSimulator
- Rich text editor (simple contenteditable or lightweight library)
- localStorage for question bank
- Firebase sync for question bank

---

### 3. 📊 Analytics & Insights Dashboard (PRIORITY: MEDIUM)

**Performance Tracking:**

#### 3.1 Dashboard Section
- Visual charts (lightweight charting - Chart.js or canvas)
- Test history timeline
- Score trends over time
- Subject performance breakdown

#### 3.2 Detailed Analytics
- Average score by subject/course
- Improvement rate over time
- Time spent per question average
- Question difficulty analysis (based on historical data)
- Weak topics identification
- Strength areas

#### 3.3 Question-Level Insights
- Which questions are frequently wrong
- Time spent per question type
- Accuracy rate by question type
- Heatmap of common mistakes

#### 3.4 Study Recommendations
- "Focus on [topic] - 60% accuracy"
- "Great progress in [subject] - up 15%"
- Suggested practice areas
- Optimal study times based on performance

**Implementation Notes:**
- New analytics section in HTML
- Analytics data stored in Firebase + localStorage
- Track: attempts, scores, time, question-level performance
- Aggregate data on load
- Privacy-focused: all data user-local

---

### 4. 🎮 Gamification System (PRIORITY: MEDIUM)

**Make Learning Fun:**

#### 4.1 Achievement System
- Badge collection
- Achievement types:
  - Streak achievements (7-day, 30-day streak)
  - Score achievements (Perfect score, 90%+ average)
  - Volume achievements (10 tests, 50 tests, 100 tests)
  - Speed achievements (Fast completion)
  - Topic mastery (100% in specific course)
- Badge display in profile/dashboard
- Achievement notifications

#### 4.2 XP & Leveling
- Earn XP for:
  - Completing tests
  - High scores
  - Consistent study (streaks)
  - Improving scores
- Level progression
- Level-up animations/celebrations
- XP multipliers for streaks

#### 4.3 Streaks
- Daily study streak counter
- Streak calendar view
- Streak freeze (1 miss allowed)
- Streak milestone rewards

#### 4.4 Personal Leaderboard
- Personal best scores
- Beat your own records
- Progress tracking
- Goal setting and tracking

**Implementation Notes:**
- Achievement definitions in config object
- Achievement check on test completion
- Store in localStorage + Firebase
- Toast notifications for achievements
- Simple CSS animations for celebrations

---

### 5. 🤝 Collaboration & Sharing (PRIORITY: MEDIUM)

**Share Tests with Others:**

#### 5.1 Test Sharing
- Generate shareable link/code
- Share via:
  - Short code (e.g., "ABC123")
  - Full URL with encoded test data
  - QR code generation
- Privacy options:
  - Public (anyone with link)
  - Private (password protected)
  - One-time use links

#### 5.2 Import Tests
- Import from share code
- Import from URL
- Import from file (.json, .csv)
- Validate imported tests
- Preview before importing

#### 5.3 Community Library (Optional)
- Browse public tests (if we add backend)
- Search by subject/difficulty
- Rate tests (stars/thumbs up)
- Report inappropriate content
- Download counts

#### 5.4 Test Templates Export
- Export test as template (without answers for students)
- Export answer key separately (for teachers)
- Batch export multiple tests

**Implementation Notes:**
- URL encoding for share links
- localStorage for shared test cache
- Firebase Cloud Functions for share code generation (optional)
- Base64 encoding for URL sharing (no backend needed)
- QR code generation using library or API

---

### 6. 🧠 Smart Study Features (PRIORITY: HIGH)

**Intelligent Learning Tools:**

#### 6.1 Flashcard Mode
- Convert test questions to flashcards
- Flip card interaction
- Shuffle cards
- Mark cards as "known" or "review"
- Flashcard progress tracking

#### 6.2 Spaced Repetition
- Schedule reviews based on performance
- Leitner system implementation
- Review notifications/reminders
- Optimal review timing suggestions
- Track retention rates

#### 6.3 Adaptive Testing
- Adjust difficulty based on performance
- Start with medium difficulty
- Increase difficulty on correct answers
- Decrease on incorrect answers
- Personalized question selection

#### 6.4 Practice vs. Exam Mode
- **Practice Mode:**
  - Immediate feedback
  - See correct answer after each question
  - No time pressure
  - Hints available
- **Exam Mode:**
  - Timed
  - No feedback until completion
  - Simulate real exam conditions
  - Final review only

#### 6.5 Review Wrong Answers
- "Practice Mistakes" mode
- Only show previously incorrect questions
- Track improvement on difficult questions
- Mark questions for later review
- Bookmark favorite questions

**Implementation Notes:**
- New study modes in test config
- Spaced repetition algorithm (simple Leitner or SM-2)
- Store review schedules in Firebase/localStorage
- Flashcard UI component
- Mode selector before starting test

---

### 7. 📱 Enhanced UX/UI (PRIORITY: HIGH)

**Rich Content Support:**

#### 7.1 Rich Text Editor
- Bold, italic, underline
- Bullet/numbered lists
- Headers
- Links
- Simple formatting toolbar
- ContentEditable or lightweight library (Quill/TinyMCE)

#### 7.2 Math Equation Support
- LaTeX rendering with KaTeX or MathJax
- Inline math: `$equation$`
- Block math: `$$equation$$`
- Visual math editor (optional)
- Common math symbols toolbar

#### 7.3 Code Syntax Highlighting
- Highlight.js or Prism.js
- Support common languages:
  - JavaScript, Python, Java, C++, HTML, CSS
- Line numbers
- Copy code button
- Theme-aware highlighting

#### 7.4 Advanced Filtering/Search
- Multi-field search (title, course, topic, content)
- Filter combinations
- Sort by: date, score, attempts, title
- Tag system for tests
- Recently viewed tests

#### 7.5 Bulk Operations
- Select multiple tests (checkboxes)
- Bulk delete
- Bulk export
- Bulk tag/categorize
- Move to folders

#### 7.6 Test Organization
- Folder/category system
- Nested folders
- Drag-and-drop organization
- Color coding
- Favorites/starred tests

**Implementation Notes:**
- Load libraries from CDN (maintain no-build approach)
- Lazy load heavy libraries (MathJax, Highlight.js)
- Keep core fast, enhance progressively
- Feature detection for browser support

---

### 8. 📈 Advanced Test Management (PRIORITY: MEDIUM)

**Test Configuration:**

#### 8.1 Test Scheduling
- Calendar view of scheduled tests
- Set test date/time
- Reminders (browser notifications)
- Recurring tests (weekly quiz)
- Study schedule planner

#### 8.2 Question Randomization
- Shuffle questions
- Shuffle answer options
- Random question selection from pool
- Different test each time

#### 8.3 Question Pools
- Define question pool (e.g., 50 questions)
- Random selection (e.g., pick 20 from pool)
- Ensure coverage (pick N from each section)
- Difficulty balancing

#### 8.4 Custom Scoring Rules
- Weighted questions
- Negative marking
- Partial credit system
- Custom passing score
- Grade scaling/curves

#### 8.5 Test Settings
- Allow review: yes/no
- Show correct answers: yes/no
- Allow backtracking: yes/no
- Require all questions: yes/no
- Auto-submit on time: yes/no
- Show score immediately: yes/no

**Implementation Notes:**
- Test config object expanded
- Calendar library for scheduling (FullCalendar or custom)
- Notification API for reminders
- Random selection algorithms
- Flexible scoring engine

---

## TECHNICAL ARCHITECTURE CHANGES

### New File Structure

```
/test-simulator/
├── index.html                 # Main HTML (expanded)
├── app.js                     # Core TestSimulator (expanded)
├── pomodoro.js               # Pomodoro timer
├── style.css                 # Styles (expanded with new components)
├── firebase-config.js        # Firebase config
├── firebase-service.js       # Firebase service
├── service-worker.js         # PWA service worker (updated cache)
│
├── NEW FILES:
├── analytics.js              # Analytics & insights engine
├── gamification.js           # Achievements, XP, streaks
├── test-builder.js           # Visual test builder
├── study-modes.js            # Flashcards, spaced repetition
├── question-types.js         # Extended question type handlers
├── sharing.js                # Share/import functionality
├── utils.js                  # Shared utilities
│
├── DOCUMENTATION:
├── CLAUDE.md                 # Updated project instructions
├── EXPANSION_PLAN.md         # This file
├── EXPANSION_PROGRESS.md     # Progress tracking
├── CHANGELOG.md              # Version history
│
└── /lib/ (NEW)               # Third-party libraries (CDN fallback)
    ├── katex/               # Math rendering
    ├── highlight/           # Code highlighting
    └── qrcode/              # QR code generation
```

### New Classes/Modules

1. **AnalyticsEngine** - Performance tracking and insights
2. **GamificationManager** - Achievements, XP, streaks
3. **TestBuilder** - Visual test creation
4. **StudyModeManager** - Flashcards, spaced repetition
5. **QuestionTypeRegistry** - Extensible question type system
6. **SharingManager** - Share/import functionality
7. **ScheduleManager** - Test scheduling and reminders

### Data Model Extensions

#### Test Entry (Enhanced)
```javascript
{
  id: string,
  title: string,
  course: string,
  topic: string,
  tags: string[],                    // NEW
  folder: string,                    // NEW
  testData: {...},
  attempts: [...],
  settings: {                        // NEW
    mode: 'practice' | 'exam',
    allowReview: boolean,
    showCorrectAnswers: boolean,
    allowBacktrack: boolean,
    shuffleQuestions: boolean,
    shuffleOptions: boolean,
    scoringRule: {...}
  },
  dateSaved: timestamp,
  lastAttempt: timestamp,
  updatedAt: timestamp,
  metadata: {                        // NEW
    difficulty: 'easy' | 'medium' | 'hard',
    estimatedTime: number,
    questionCount: number,
    questionTypes: string[],
    version: string
  }
}
```

#### Analytics Data
```javascript
{
  userId: string,
  testAttempts: [...],
  aggregateStats: {
    totalTests: number,
    averageScore: number,
    totalTime: number,
    bySubject: {...},
    byQuestionType: {...},
    performanceTrend: [...]
  },
  questionStats: {
    [questionId]: {
      attempts: number,
      correctCount: number,
      averageTime: number
    }
  }
}
```

#### Gamification Data
```javascript
{
  userId: string,
  xp: number,
  level: number,
  achievements: [
    {
      id: string,
      unlockedAt: timestamp,
      progress: number
    }
  ],
  streaks: {
    current: number,
    longest: number,
    lastActivity: timestamp,
    freezeAvailable: boolean
  },
  stats: {
    testsCompleted: number,
    perfectScores: number,
    totalStudyTime: number
  }
}
```

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation & Enhanced Question Types ⏳
**Checkpoint 1**
- Create documentation (EXPANSION_PLAN.md, EXPANSION_PROGRESS.md)
- Audit codebase
- Implement True/False questions
- Implement Fill-in-the-Blank questions
- Implement Essay/Short Answer questions
- Implement Ordering/Sequencing questions
- Update validation, scoring, and review logic
- **COMMIT & PUSH TO GITHUB**

### Phase 2: Visual Test Builder 🎨
**Checkpoint 2**
- Design Test Builder UI
- Implement question editor forms
- Drag-and-drop question ordering
- Import existing test to edit
- Export to JSON
- Template system basics
- **COMMIT & PUSH TO GITHUB**

### Phase 3: Smart Study Features 🧠
**Checkpoint 3**
- Flashcard mode implementation
- Practice vs. Exam modes
- Review wrong answers feature
- Spaced repetition basics
- **COMMIT & PUSH TO GITHUB**

### Phase 4: Gamification System 🎮
**Checkpoint 4**
- Achievement definitions
- XP and leveling system
- Streak tracking
- Achievement UI and notifications
- **COMMIT & PUSH TO GITHUB**

### Phase 5: Analytics Dashboard 📊
**Checkpoint 5**
- Analytics data collection
- Dashboard UI
- Charts and visualizations
- Performance insights
- Study recommendations
- **COMMIT & PUSH TO GITHUB**

### Phase 6: Enhanced UX/UI 📱
**Checkpoint 6**
- Rich text editor integration
- Math equation support (KaTeX)
- Code syntax highlighting
- Advanced filtering/search
- Bulk operations
- Test organization (folders/tags)
- **COMMIT & PUSH TO GITHUB**

### Phase 7: Collaboration & Sharing 🤝
**Checkpoint 7**
- Share link generation
- Import functionality
- QR code generation
- Privacy settings
- **COMMIT & PUSH TO GITHUB**

### Phase 8: Advanced Test Management 📈
**Checkpoint 8**
- Test scheduling
- Question randomization
- Question pools
- Custom scoring rules
- Advanced test settings
- **COMMIT & PUSH TO GITHUB**

### Phase 9: Image Support & Code Questions 🖼️
**Checkpoint 9**
- Image-based questions
- Image hotspot functionality
- Code questions with highlighting
- Image upload/embedding
- **COMMIT & PUSH TO GITHUB**

### Phase 10: Polish & Optimization ✨
**Checkpoint 10**
- Performance optimization
- Mobile responsiveness review
- Accessibility audit
- Error handling improvements
- Documentation updates
- **FINAL COMMIT & PUSH**

---

## BACKWARD COMPATIBILITY

**Critical Requirements:**
- All existing tests must work without modification
- Current JSON format fully supported
- Graceful degradation for missing features
- Migration tools for new formats
- Version detection in test data

**Migration Strategy:**
- Detect test version
- Auto-upgrade on load if needed
- Preserve original data
- User notification of upgrades
- Rollback option

---

## TESTING CHECKLIST (Per Phase)

- [ ] Existing tests still work
- [ ] New features work in authenticated mode
- [ ] New features work in non-authenticated mode
- [ ] Offline functionality maintained
- [ ] Service worker cache updated
- [ ] Mobile responsive
- [ ] Accessibility (keyboard nav, screen readers)
- [ ] Console has no errors
- [ ] Firebase sync working
- [ ] LocalStorage fallback working

---

## SESSION RECOVERY INSTRUCTIONS

**If session breaks, new AI should:**

1. Read this file (EXPANSION_PLAN.md)
2. Read EXPANSION_PROGRESS.md for current status
3. Check git log for last commit
4. Continue from last incomplete phase
5. Update EXPANSION_PROGRESS.md after each checkpoint
6. Commit and push regularly

**Quick Start Commands:**
```bash
# Check current branch
git status

# See recent work
git log --oneline -10

# Continue working
# (Pick up from EXPANSION_PROGRESS.md)
```

---

## ROLLBACK PLAN

If issues arise:
```bash
# See what's changed
git diff

# Revert specific file
git checkout -- <file>

# Revert to last commit
git reset --hard HEAD

# Revert to specific commit
git reset --hard <commit-hash>
```

---

## NOTES & DECISIONS

- **Styling:** Continue using CSS variables for theming
- **Libraries:** Only use lightweight, CDN-hosted libraries
- **No npm:** Maintain zero build tool requirement
- **Progressive Enhancement:** Core features work everywhere, enhancements layer on
- **Performance Budget:** Keep initial load under 1MB
- **Browser Support:** Modern browsers (last 2 years), graceful degradation for older

---

**Last Updated:** 2025-11-18
**Status:** In Progress - Phase 1
**Next Checkpoint:** Checkpoint 1 - Enhanced Question Types
