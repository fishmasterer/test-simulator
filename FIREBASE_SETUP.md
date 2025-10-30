# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `test-simulator` (or any name you prefer)
4. **Disable Google Analytics** (optional, not needed for this app)
5. Click **"Create project"** and wait for it to finish

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **web icon** `</>`
2. Enter app nickname: `Test Simulator Web`
3. **Check the box** "Also set up Firebase Hosting" (optional but recommended)
4. Click **"Register app"**
5. You'll see a code snippet with your Firebase configuration - **KEEP THIS OPEN**

## Step 3: Add Your Firebase Config

1. Open the file `firebase-config.js` in your project
2. You'll see placeholder values like this:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. **Replace these values** with your actual config from Firebase Console
4. Example of what it should look like (with your real values):
```javascript
const firebaseConfig = {
    apiKey: "AbCdEf_your_actual_api_key_here_123456",
    authDomain: "your-project-name.firebaseapp.com",
    projectId: "your-project-name",
    storageBucket: "your-project-name.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456789"
};
```

## Step 4: Enable Google Authentication

1. In Firebase Console, go to **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Click on **"Google"** provider
5. Toggle **"Enable"**
6. Enter your support email (your Gmail)
7. Click **"Save"**

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Select your location (choose closest to you, e.g., `us-central` or `europe-west`)
5. Click **"Enable"**

## Step 6: Configure Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with this (allows users to only access their own data):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public tests are readable by all authenticated users
    match /publicTests/{testId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.resource.data.createdBy == request.auth.uid;
      allow delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }

    // Shared tests can be read by anyone with the link
    match /sharedTests/{shareCode} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## Step 7: Test Your Setup

1. Open your app in a browser
2. You should see a **"Sign in with Google"** button
3. Click it and sign in with your Google account
4. Once signed in, try saving a test
5. Open the app on another device or browser, sign in with the same Google account
6. Your tests should sync automatically!

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your domain (e.g., `fishmasterer.github.io`)
- For local testing, `localhost` should already be authorized

### Tests not syncing
- Check browser console for errors (F12)
- Make sure you're signed in on both devices
- Check your internet connection
- Firestore Database should show your data in Firebase Console

### "Permission denied" errors
- Make sure security rules are published correctly
- Sign out and sign back in
- Check that you're signed in (look for user profile in top corner)

## Free Tier Limits

You're on Firebase's **free Spark plan**:
- **Firestore reads**: 50,000/day
- **Firestore writes**: 20,000/day
- **Storage**: 1GB
- **Authentication**: Unlimited users

For storing tests, you'll **never hit these limits** in normal usage. Even if you save/load 100 tests per day, you'd only use a tiny fraction.

## Optional: Deploy to Firebase Hosting

If you want to host your app on Firebase instead of GitHub Pages:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
