# Debugging Firebase Sync Issues

This guide will help you troubleshoot Firebase authentication and sync issues.

## 🔍 Step 1: Check Browser Console

1. Open your app in the browser
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. **Refresh the page** (F5 or Ctrl+R)

### What to Look For:

#### ✅ Successful Initialization:
You should see these messages in order:
```
🚀 Initializing Firebase...
✅ Firebase config found: {projectId: "...", authDomain: "..."}
✅ Firebase app initialized (or already initialized)
✅ Firebase Auth and Firestore initialized
💾 Enabling offline persistence...
👂 Setting up auth state listener...
✅ Firebase initialization complete!
Firebase initialized successfully
🔐 Auth state changed: Not signed in
❌ User not authenticated
🎨 Updating auth UI: Signed OUT
🔓 Showing signed-out state
✅ Auth UI updated: signed-out div visible, signed-in div hidden
```

#### ❌ Failed Initialization:
If you see any of these, there's a problem:
```
❌ Firebase SDK not loaded!
❌ Firebase initialization failed: [error]
⚠️ Firebase not configured. Using localStorage only.
```

## 🔑 Step 2: Test Sign-In

1. Click "Sign in with Google" button
2. Watch the console while signing in

### What to Look For:

#### ✅ Successful Sign-In:
```
🔐 Starting Google sign-in...
📱 Opening Google sign-in popup...
✅ Sign-in successful! your.email@gmail.com
🔐 Auth state changed: Signed in as your.email@gmail.com
✅ User authenticated: {uid: "...", email: "your.email@gmail.com", ...}
🎨 Updating auth UI: Signed IN
👤 Showing signed-in state for: your.email@gmail.com
✅ Auth UI updated: signed-in div visible, signed-out div hidden
```

#### ❌ Failed Sign-In:
```
❌ Sign in failed: [error]
Error code: auth/popup-blocked (popup was blocked)
Error code: auth/unauthorized-domain (domain not authorized)
Error code: auth/operation-not-allowed (Google sign-in not enabled)
```

### Common Sign-In Issues:

| Error | Solution |
|-------|----------|
| `auth/popup-blocked` | Allow popups for this site in browser settings |
| `auth/unauthorized-domain` | Add your domain in Firebase Console → Authentication → Settings → Authorized domains |
| `auth/operation-not-allowed` | Enable Google sign-in in Firebase Console → Authentication → Sign-in method |
| Popup closes immediately | Check for JavaScript errors earlier in the console |

## 💾 Step 3: Test Saving Data

1. Make sure you're signed in (see your name/photo in top corner)
2. Complete a test
3. Click "Save Test" and fill in the form
4. Watch the console while clicking "Save"

### What to Look For:

#### ✅ Successful Save:
```
☁️ saveTestToFirebase() called for test: [timestamp]
🔍 Checking if firebaseService exists: true
🔍 Checking if user is signed in...
🔍 isSignedIn() check: true | currentUser: your.email@gmail.com
🔍 isSignedIn result: true
✅ User is signed in, attempting Firebase save...
💾 saveTest() called for: [timestamp]
🔍 isSignedIn() check: true | currentUser: your.email@gmail.com
📝 Saving to Firestore path: users/[your-uid]/tests/[test-id]
📤 Writing data to Firestore... [list of fields]
✅ Test saved to Firebase successfully!
✅ Test synced to Firebase successfully: [test-id]
```

Then you should see an alert: **"Test saved successfully and synced to cloud!"**

#### ❌ Failed Save (Not Signed In):
```
☁️ saveTestToFirebase() called for test: [timestamp]
🔍 Checking if firebaseService exists: true
🔍 Checking if user is signed in...
🔍 isSignedIn() check: false | currentUser: null
⚠️ User not signed in - test saved locally only
```

Then you should see an alert: **"Test saved locally! Tip: Sign in with Google to sync your tests across devices."**

**This is the problem you're experiencing!** Even though you signed in, `isSignedIn()` is returning `false`.

#### ❌ Failed Save (Permission Denied):
```
✅ User is signed in, attempting Firebase save...
💾 saveTest() called for: [timestamp]
📝 Saving to Firestore path: users/[your-uid]/tests/[test-id]
📤 Writing data to Firestore...
❌ Failed to save test to Firebase: FirebaseError: Missing or insufficient permissions
Error code: permission-denied
```

This means your Firestore security rules are blocking the write.

## 🔧 Step 4: Common Fixes

### Problem: UI shows "signed in" but data saves locally only

**Root Cause**: The auth state isn't persisting properly

**Solutions**:
1. **Hard refresh**: Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear site data**:
   - F12 → Application tab → Storage → Clear site data
   - Refresh the page
   - Sign in again
3. **Check for JavaScript errors**: Look for red errors in console before you sign in

### Problem: "Permission denied" when saving

**Root Cause**: Firestore security rules are blocking writes

**Solution**: Check your Firestore Rules in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Make sure the rules match this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // ... other rules
  }
}
```

5. Click **Publish**

### Problem: "Firebase SDK not loaded"

**Root Cause**: Firebase scripts aren't loading

**Solution**:
1. Check your internet connection
2. Check if CDN is blocked (firewall/ad blocker)
3. Try a different browser
4. Check browser console for script loading errors

### Problem: Sign-in popup doesn't open or closes immediately

**Root Cause**: Browser is blocking popups or there's a JavaScript error

**Solution**:
1. Allow popups for your site
2. Check console for errors that happen before sign-in
3. Try incognito/private browsing mode

## 📊 Step 5: Verify in Firebase Console

After successfully saving (getting the "synced to cloud" message):

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. You should see:
   ```
   users (collection)
     └─ [your-user-id] (document)
          └─ tests (collection)
               └─ [test-id] (document)
                    ├─ id: "..."
                    ├─ title: "..."
                    ├─ course: "..."
                    ├─ topic: "..."
                    ├─ testData: {...}
                    ├─ attempts: [...]
                    └─ updatedAt: [timestamp]
   ```

**Note**: Collections are created automatically when first document is written. If you don't see the "users" collection, it means no data has been successfully written yet.

## 🐛 Step 6: Report Issues

If you've tried everything above and it's still not working, please provide:

1. **Console logs**: Copy everything from console (starting from page load)
2. **Error screenshots**: Screenshot any errors in red
3. **Auth state**: Does the console show `isSignedIn() check: true` or `false`?
4. **Browser**: Which browser and version are you using?
5. **Domain**: Are you testing on localhost, GitHub Pages, or custom domain?

## 📝 Quick Checklist

Before reporting an issue, verify:

- [ ] Firebase SDK scripts are loading (check Network tab in DevTools)
- [ ] Firebase config in `firebase-config.js` has real values (not YOUR_API_KEY_HERE)
- [ ] Google sign-in is enabled in Firebase Console → Authentication
- [ ] Your domain is authorized in Firebase Console → Authentication → Settings
- [ ] Firestore security rules are published
- [ ] Browser console shows "Firebase initialized successfully"
- [ ] After signing in, console shows `isSignedIn() check: true`
- [ ] No JavaScript errors in console (red text)
- [ ] You've tried hard refresh (Ctrl+Shift+R)

---

**The detailed logging added in this update should help identify exactly where the issue is occurring!**
