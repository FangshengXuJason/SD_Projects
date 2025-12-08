# How to Verify Users Are Saved in Backend Database

This guide shows multiple ways to verify that users are being saved to your PostgreSQL database.

## Method 1: Prisma Studio (Visual Database Browser) ⭐ Recommended

**Easiest and most visual method**

1. **Open a new terminal** and run:
   ```bash
   cd back-end
   npm run db:studio
   ```

2. **Prisma Studio will open** in your browser at `http://localhost:5555`

3. **Click on the "User" model** in the left sidebar

4. **You should see:**
   - All users that have signed in
   - Their email, name, image, and other fields
   - Created/updated timestamps

5. **What to look for:**
   - ✅ Your Google account email
   - ✅ Your name from Google
   - ✅ Profile picture URL (if available)
   - ✅ `emailVerified` timestamp
   - ✅ `createdAt` timestamp

## Method 2: Test Auth Page (Frontend)

**Quick verification through the UI**

1. **Navigate to:** `http://localhost:3000/test-auth`

2. **Sign in with Google** (if not already signed in)

3. **Click "Test Backend Auth"** button

4. **Check the "Backend API Test" section:**
   - ✅ Should show "Backend authentication successful!"
   - ✅ Should display your user data (ID, email, name, image)
   - ✅ Should show "Created At" timestamp

5. **This confirms:**
   - User exists in database
   - Backend API can retrieve user data
   - Authentication is working end-to-end

## Method 3: Backend API Direct Test

**Using curl or browser**

1. **First, get your backend token** (from browser console after signing in):
   - Open browser DevTools (F12)
   - Go to Network tab
   - Sign in and look for `/api/auth/exchange-token` request
   - Copy the token from the response

2. **Test the `/api/auth/me` endpoint:**
   ```bash
   curl -X GET http://localhost:5001/api/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json"
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": "...",
         "email": "your-email@gmail.com",
         "name": "Your Name",
         "image": "https://...",
         "createdAt": "2024-..."
       }
     }
   }
   ```

## Method 4: Check Backend Console Logs

**See database operations in real-time**

1. **Look at your backend terminal** where `npm run dev` is running

2. **When you sign in, you should see:**
   - Database queries in the logs (if using Prisma logging)
   - Any errors that occur during user creation

3. **Enable Prisma logging** to see SQL queries:
   - Add this to your Prisma client initialization:
   ```typescript
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

## Method 5: Direct Database Query (PostgreSQL)

**For advanced users**

1. **Connect to your PostgreSQL database:**
   ```bash
   psql -U your_username -d google_drive_db
   ```

2. **Query the users table:**
   ```sql
   SELECT id, email, name, image, "emailVerified", "createdAt"
   FROM users
   ORDER BY "createdAt" DESC;
   ```

3. **You should see:**
   - All users in the database
   - Their OAuth information
   - When they were created

## Method 6: Check Database After Sign-In Flow

**Step-by-step verification:**

1. **Before signing in:**
   - Open Prisma Studio: `npm run db:studio`
   - Note how many users exist

2. **Sign in with Google** on the frontend

3. **After signing in:**
   - Refresh Prisma Studio
   - You should see a new user record
   - Or an existing user record updated

4. **Check the user record:**
   - Email matches your Google account
   - Name matches your Google profile
   - Image URL points to your Google profile picture
   - `emailVerified` has a timestamp
   - `createdAt` shows when you first signed in

## Expected User Record Structure

When a user signs in, the database should have:

```typescript
{
  id: "clx1234567890",           // Unique ID (CUID)
  email: "user@gmail.com",       // Google email
  password: null,                 // null for OAuth users
  name: "User Name",              // From Google profile
  image: "https://lh3.googleusercontent.com/...", // Profile picture URL
  emailVerified: "2024-11-16T...", // Timestamp
  createdAt: "2024-11-16T...",   // When user was created
  updatedAt: "2024-11-16T...",    // Last update time
}
```

## Troubleshooting

### User not appearing in database?

1. **Check backend logs** for errors
2. **Verify database connection** in backend `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   ```
3. **Check if token exchange is working:**
   - Look at browser Network tab
   - Check `/api/auth/exchange-token` request
4. **Verify Prisma migrations are applied:**
   ```bash
   cd back-end
   npm run db:migrate
   ```

### User appears but fields are null?

- This is normal for some fields:
  - `password` is null for OAuth users ✅
  - `image` might be null if Google account has no picture
- Check that `email` and `name` are populated

## Quick Verification Checklist

- [ ] Prisma Studio shows user record
- [ ] User email matches Google account
- [ ] User name is populated
- [ ] `createdAt` timestamp exists
- [ ] `/api/auth/me` returns user data
- [ ] Test auth page shows user info

## Next Steps

Once verified, you can:
- ✅ Use the user data in your file upload features
- ✅ Associate files with users
- ✅ Implement user-specific file access
- ✅ Add user profile management

