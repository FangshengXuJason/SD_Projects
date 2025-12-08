# How to Verify Google OAuth Authentication

This guide will help you verify that Google OAuth authentication is working correctly.

## ✅ Prerequisites Checklist

Before testing, make sure you have:

1. **Environment Variables Set:**
   - Frontend `.env.local` has:
     - `NEXTAUTH_URL`
     - `NEXTAUTH_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `NEXT_PUBLIC_API_URL`
   - Backend `.env` has:
     - `NEXTAUTH_SECRET` (same as frontend)
     - `DATABASE_URL`
     - `JWT_SECRET` (optional, can use NEXTAUTH_SECRET)

2. **Google OAuth Credentials:**
   - Created in Google Cloud Console
   - Redirect URI set to: `http://localhost:3000/api/auth/callback/google`

3. **Servers Running:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## 🧪 Testing Steps

### Step 1: Test Frontend Authentication

1. **Start your frontend:**
   ```bash
   cd front-end
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3000`

3. **Expected Behavior:**
   - You should see "Sign in with Google" button
   - Click the button
   - You should be redirected to Google sign-in page
   - After signing in, you should be redirected back
   - Your name/email should appear in the header
   - Welcome message should show your name

### Step 2: Use the Test Page

1. **Navigate to:** `http://localhost:3000/test-auth`

2. **This page shows:**
   - Frontend session status
   - User information from NextAuth
   - Backend API test results
   - Verification checklist

3. **What to Check:**
   - ✅ Status should be "authenticated"
   - ✅ User ID, email, and name should be displayed
   - ✅ Backend API test should succeed
   - ✅ User should be synced to database

### Step 3: Test Backend API Directly

1. **Open browser console** (F12) on `http://localhost:3000`

2. **Run this in console:**
   ```javascript
   // Get session
   fetch('/api/auth/session')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Test backend API:**
   ```javascript
   // This should work if you're authenticated
   fetch('http://localhost:5000/api/auth/me', {
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN_HERE'
     }
   })
     .then(r => r.json())
     .then(console.log)
   ```

   Note: The API client automatically handles tokens, so use the test page instead.

### Step 4: Check Database

1. **Open Prisma Studio:**
   ```bash
   cd back-end
   npm run db:studio
   ```

2. **Navigate to:** `http://localhost:5555`

3. **Check the `users` table:**
   - You should see your user record
   - `email` should match your Google account
   - `image` should have your profile picture URL (if available)
   - `emailVerified` should have a timestamp

### Step 5: Test Sign Out

1. **Click "Sign Out"** in the header
2. **Expected:**
   - You should be redirected to home page
   - "Sign in with Google" button should appear again
   - Session should be cleared

## 🔍 Troubleshooting

### Issue: "Invalid credentials" error
- **Check:** Google OAuth credentials are correct
- **Check:** Redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- **Check:** Environment variables are set correctly

### Issue: Frontend shows "unauthenticated" after sign-in
- **Check:** `NEXTAUTH_SECRET` is set in frontend `.env.local`
- **Check:** `NEXTAUTH_URL` matches your frontend URL
- **Check:** Browser console for errors

### Issue: Backend API returns 401
- **Check:** Backend has `NEXTAUTH_SECRET` set (same as frontend)
- **Check:** Frontend `NEXT_PUBLIC_API_URL` points to correct backend URL
- **Check:** Backend CORS allows frontend origin
- **Check:** Token exchange endpoint is working

### Issue: User not appearing in database
- **Check:** Database connection is working
- **Check:** Prisma migrations are applied
- **Check:** Backend logs for errors during user creation

## 📊 Expected Results

When everything is working correctly:

1. **Frontend:**
   - ✅ Sign in button works
   - ✅ Google OAuth flow completes
   - ✅ User profile appears in header
   - ✅ Session persists on page refresh

2. **Backend:**
   - ✅ `/api/auth/exchange-token` creates backend JWT
   - ✅ `/api/auth/me` returns user data
   - ✅ User is created/updated in database

3. **Database:**
   - ✅ User record exists with correct email
   - ✅ OAuth fields (image, emailVerified) are populated

## 🎯 Quick Test Commands

```bash
# Check if frontend is running
curl http://localhost:3000

# Check if backend is running
curl http://localhost:5000/health

# Check NextAuth session endpoint
curl http://localhost:3000/api/auth/session
```

## 📝 Notes

- The test page at `/test-auth` provides the most comprehensive verification
- All authentication happens automatically - no manual token handling needed
- Sessions persist for 30 days (configurable in NextAuth config)
- Backend tokens are automatically exchanged and cached

