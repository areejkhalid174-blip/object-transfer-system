# Admin Login Troubleshooting Guide

## Issue: Admin Login Button Not Working

### What We Fixed:
1. ✅ Added "🔐 Admin Login" button to CustomerLogin page
2. ✅ Fixed Firebase import paths in all admin files
3. ✅ Added AdminLogin to navigation stack
4. ✅ Added error handling and console logs

---

## How to Test Admin Login

### Step 1: Reload the App
```bash
# In Metro Bundler terminal, press:
r  # Reload
```

### Step 2: Check Console Logs
When you press "🔐 Admin Login" button, you should see:
```
Admin Login button pressed
```

If you don't see this, the button is not being pressed.

### Step 3: Create Admin User in Firebase

**Option A: Using Firebase Console**

1. Go to Firebase Console → Firestore Database
2. Go to `users` collection
3. Click "Add Document"
4. Add this data:
```javascript
{
  email: "admin@test.com",
  role: "Admin",
  firstName: "Admin",
  lastName: "User",
  createdAt: "2024-01-01"
}
```

5. Go to Authentication → Users → Add User
   - Email: `admin@test.com`
   - Password: `admin123`

**Option B: Convert Existing User to Admin**

1. Firebase Console → Firestore → users
2. Find your existing user
3. Edit the document
4. Change `role` field to `"Admin"`

### Step 4: Test Login Flow

1. Open app
2. You should see CustomerLogin page
3. Scroll down
4. Click "🔐 Admin Login" button
5. You should navigate to AdminLogin page
6. Enter credentials:
   - Email: `admin@test.com`
   - Password: `admin123`
7. Click "Login"
8. If role is "Admin", you'll see AdminDashboard

---

## Common Issues & Solutions

### Issue 1: Button Not Visible
**Solution:** Scroll down on CustomerLogin page. Button is at the bottom.

### Issue 2: Navigation Error
**Check:**
- Is AdminLogin imported in `app/index.js`? ✅ Yes
- Is AdminLogin in the Stack.Navigator? ✅ Yes
- Console shows error? Check the error message

### Issue 3: Login Fails
**Check:**
- Does admin user exist in Firebase Authentication?
- Does user document have `role: "Admin"` in Firestore?
- Check console for Firebase errors

### Issue 4: "Access Denied" Message
**Solution:** User exists but role is not "Admin". Update role in Firestore.

### Issue 5: Firebase Import Error
**Fixed:** All admin files now use `../../firebase` path ✅

---

## Verification Checklist

### Navigation Setup:
- [x] AdminLogin imported in app/index.js
- [x] AdminLogin added to default Stack
- [x] AdminDashboard imported in app/index.js
- [x] AdminStack created
- [x] Admin role case added to switch statement

### Firebase Setup:
- [ ] Admin user created in Firebase Authentication
- [ ] Admin user document in Firestore with role: "Admin"
- [ ] Firebase config file exists at root (firebase.js)

### Code Setup:
- [x] Admin Login button in CustomerLogin
- [x] Firebase imports fixed (../../firebase)
- [x] Error handling added
- [x] Console logs added

---

## Quick Test Commands

### Check if files exist:
```bash
# Check AdminLogin
ls app/pages/AdminLogin.js

# Check AdminDashboard
ls app/pages/AdminDashboard.js

# Check Firebase config
ls firebase.js
```

### Check imports:
```bash
# Check if AdminLogin is imported
grep -n "AdminLogin" app/index.js

# Check Firebase import in AdminLogin
grep -n "firebase" app/pages/AdminLogin.js
```

---

## Expected Behavior

### When Button is Pressed:
1. Console shows: "Admin Login button pressed"
2. Screen navigates to AdminLogin page
3. AdminLogin page shows:
   - Shield icon
   - "Admin Portal" title
   - Email input
   - Password input
   - Login button
   - "Back to User Login" link

### After Successful Login:
1. User role is verified as "Admin"
2. Redux state is updated
3. Navigation replaces to AdminDashboard
4. AdminDashboard shows 5 tabs:
   - Overview
   - Users
   - Riders
   - Trips
   - Settings

---

## Debug Steps

### Step 1: Check Button Press
Add this to CustomerLogin button:
```javascript
onPress={() => {
  console.log("Button pressed!");
  alert("Button works!");
  navigation.navigate("AdminLogin");
}}
```

### Step 2: Check Navigation
If button press works but navigation fails:
```javascript
console.log("Navigation object:", navigation);
console.log("Available routes:", navigation.getState());
```

### Step 3: Check AdminLogin Render
Add to AdminLogin component:
```javascript
console.log("AdminLogin component rendered");
```

### Step 4: Check Firebase
Add to handleLogin:
```javascript
console.log("Login attempt:", email);
console.log("Auth object:", auth);
```

---

## Manual Navigation Test

If button doesn't work, try direct navigation:

1. Open app
2. In Metro Bundler, press `d` for dev menu
3. Or shake device
4. Select "Debug JS Remotely"
5. In browser console, type:
```javascript
// This won't work directly, but you can test navigation in code
```

---

## File Locations

```
app/
├── index.js                        # Main navigation (AdminLogin added ✅)
├── pages/
│   ├── CustomerLogin.js           # Has Admin Login button ✅
│   ├── AdminLogin.js              # Admin login screen ✅
│   ├── AdminDashboard.js          # Admin dashboard ✅
│   ├── AdminUsersManagement.js    # Users CRUD ✅
│   ├── AdminRidersManagement.js   # Riders approval ✅
│   └── AdminTripsManagement.js    # Trips management ✅
└── redux/
    └── Slices/
        └── HomeDataSlice.js       # Redux state

firebase.js                         # Firebase config (root) ✅
```

---

## Success Indicators

✅ Button visible on CustomerLogin
✅ Console log shows "Admin Login button pressed"
✅ Navigation to AdminLogin works
✅ AdminLogin page renders
✅ Login with admin credentials works
✅ AdminDashboard opens with tabs
✅ Statistics load from Firebase

---

## Next Steps if Still Not Working

1. **Clear Metro Cache:**
```bash
npx react-native start --reset-cache
```

2. **Reinstall Dependencies:**
```bash
npm install
```

3. **Check React Navigation Version:**
```bash
npm list @react-navigation/native
```

4. **Verify Firebase Setup:**
- Check firebase.js exists
- Check Firebase credentials are correct
- Test Firebase connection with existing login

5. **Check Console for Errors:**
- Open Metro Bundler terminal
- Look for red error messages
- Check browser console if debugging

---

## Contact Points

If issue persists, check:
1. Metro Bundler terminal for errors
2. Browser console (if debugging)
3. Firebase Console for auth errors
4. React Navigation documentation

---

**Most Common Solution:**
Just reload the app with `r` in Metro Bundler after making changes! 🔄
