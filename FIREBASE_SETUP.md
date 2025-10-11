# Firebase Setup Guide

## Fix "Missing or insufficient permissions" Error

This error occurs when Firestore security rules block your requests.

### Quick Fix (Development Only)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **objecttransfersystem**
3. Navigate to **Firestore Database** → **Rules**
4. Use one of the rule sets below
5. Click **Publish**

---

## Option 1: Development Rules (Recommended)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow create: if true;  // Allow signup
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;  // Allow reading other users
    }
    
    // All other collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Option 2: Open Access (Testing Only - INSECURE)

⚠️ **WARNING: Only use for testing! Remove before production!**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## How to Update Rules

### Method 1: Firebase Console (Easiest)
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Paste the rules
5. Click **Publish**

### Method 2: Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

---

## Production Rules (Use before deploying)

See `firestore.rules` file for production-ready security rules with proper access control.

---

## Common Errors

### "Missing or insufficient permissions"
- **Cause**: Firestore rules are blocking the request
- **Fix**: Update rules in Firebase Console

### "Permission denied"
- **Cause**: User not authenticated or trying to access unauthorized data
- **Fix**: Ensure user is logged in and accessing their own data

### "PERMISSION_DENIED"
- **Cause**: Same as above
- **Fix**: Check authentication and rules

---

## Testing Rules

After updating rules, test your app:
1. Try signing up a new user
2. Try logging in
3. Try accessing user data
4. Check console for any permission errors

---

## Need Help?

If you still see permission errors:
1. Check Firebase Console → Authentication → Users (verify user is created)
2. Check Firestore → Data (verify data is being written)
3. Check browser console for detailed error messages
4. Verify Firebase config in `firebase.js` is correct
