# Viewing User Statistics in Google Cloud Console

## 📊 What Google Cloud Console Actually Shows

Google Cloud Console provides **limited** OAuth usage statistics, but **NOT** a direct user count. Here's what you can see:

### 1. OAuth Consent Screen Statistics

**Location:** Google Cloud Console → **APIs & Services** → **OAuth consent screen**

**What it shows:**
- **Test Users** (if app is in "Testing" mode)
  - List of test user emails you've added
  - **NOT** users who actually signed in
- **Publishing Status**
  - Whether your app is published or in testing
- **Scopes** being requested
- **App Information** (name, logo, etc.)

**Limitations:**
- ❌ Doesn't show actual user count
- ❌ Doesn't show who signed in
- ❌ Only shows test users you manually added (if in testing mode)

### 2. API Usage Metrics

**Location:** Google Cloud Console → **APIs & Services** → **Dashboard** or **Credentials**

**What it shows:**
- **API Request Counts**
  - Total OAuth requests made
  - But this includes ALL requests (sign-ins, token refreshes, etc.)
  - Not unique users
- **Quota Usage**
  - API call limits
  - Not user-specific

**Limitations:**
- ❌ Shows request counts, not user counts
- ❌ One user can generate multiple requests
- ❌ Not accurate for counting unique users

### 3. Google Analytics (If Integrated)

**If you've set up Google Analytics:**
- You might see user metrics there
- But this requires separate setup
- Not directly in Cloud Console

## ✅ Better Way: Check Your Own Database

**Your database is the source of truth!**

### Quick User Count Query

**Using Prisma Studio:**
```bash
cd back-end
npm run db:studio
```
- Open "User" model
- See total count at the top
- See all users listed

**Using SQL directly:**
```sql
SELECT COUNT(*) FROM users;
```

**Using your Backend API:**
You could create an admin endpoint:
```typescript
// GET /api/admin/users/count
export const getUserCount = async (req: Request, res: Response) => {
  const count = await prisma.user.count();
  res.json({ count });
};
```

## 🔍 How to Check OAuth Usage in Google Cloud Console

### Step 1: OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. You'll see:
   - **Publishing status** (Testing/In production)
   - **Test users** (if in testing mode)
   - **Scopes** being used

### Step 2: API Metrics (Limited)

1. Go to **APIs & Services** → **Dashboard**
2. Look for **Google+ API** or **Google Identity API**
3. You might see:
   - Request counts
   - Error rates
   - But NOT unique user counts

### Step 3: Credentials Usage

1. Go to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. You might see:
   - Usage statistics
   - But again, request counts, not user counts

## 💡 Why Your Database is Better

| Metric | Google Cloud Console | Your Database |
|--------|---------------------|---------------|
| **User Count** | ❌ Not available | ✅ Exact count |
| **User Details** | ❌ Not available | ✅ All user info |
| **Sign-in History** | ❌ Not available | ✅ Created timestamps |
| **User Emails** | ❌ Not available | ✅ All emails |
| **Custom Data** | ❌ Not available | ✅ Your app's data |

## 🎯 Recommended Approach

**For accurate user statistics, use your database:**

### Option 1: Prisma Studio (Easiest)
```bash
cd back-end
npm run db:studio
```
- Visual interface
- See all users
- Count is displayed

### Option 2: Create Admin Endpoint
Add to your backend:
```typescript
// routes/admin.ts
router.get('/users/count', protect, async (req, res) => {
  const count = await prisma.user.count();
  res.json({ count, message: `Total users: ${count}` });
});
```

### Option 3: Database Query
```sql
-- Total users
SELECT COUNT(*) as total_users FROM users;

-- Users by date
SELECT DATE("createdAt") as date, COUNT(*) as users
FROM users
GROUP BY DATE("createdAt")
ORDER BY date DESC;

-- Recent users
SELECT email, name, "createdAt"
FROM users
ORDER BY "createdAt" DESC
LIMIT 10;
```

## 📝 Summary

**Google Cloud Console:**
- ✅ Shows OAuth configuration
- ✅ Shows API request counts (not user counts)
- ✅ Shows test users (if in testing mode)
- ❌ Does NOT show actual user count
- ❌ Does NOT show who signed in

**Your Database:**
- ✅ Shows exact user count
- ✅ Shows all user details
- ✅ Shows sign-in history
- ✅ Source of truth for your app

## 🎓 Bottom Line

**Google Cloud Console is NOT designed to track your app's users.** It's for managing OAuth credentials and API access.

**Your PostgreSQL database is where you should check user statistics** - it's more accurate, detailed, and designed for this purpose.

For development, **Prisma Studio is your best friend** for viewing users! 🎉

