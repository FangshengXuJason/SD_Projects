# NextAuth.js with Google OAuth - Setup Guide

This guide will walk you through setting up NextAuth.js with Google OAuth for your Google Drive clone.

## ✅ What's Already Implemented

- ✅ NextAuth.js installed and configured
- ✅ Google OAuth provider setup
- ✅ Frontend auth components (SignIn, SignOut, UserProfile)
- ✅ Backend JWT verification middleware
- ✅ Token exchange endpoint
- ✅ User sync with Prisma database
- ✅ API client with automatic token injection

## 📋 Setup Steps

### 1. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Save this value - you'll need it for both frontend and backend.

### 2. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google+ API** (or **Google Identity API**)
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Configure the OAuth consent screen:
   - User Type: **External** (for MVP)
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
7. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Google Drive Clone (or your app name)
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production URL (when deploying)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the **Client ID** and **Client Secret**

### 3. Configure Frontend Environment Variables

Create `/front-end/.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-from-step-1

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Configure Backend Environment Variables

Update `/back-end/.env`:

```env
# ... existing variables ...

# NextAuth (must match frontend NEXTAUTH_SECRET)
NEXTAUTH_SECRET=your-generated-secret-from-step-1
```

### 5. Update Database Schema

Run Prisma migration to update the User model:

```bash
cd back-end
npm run db:migrate
```

Or if you prefer to push changes directly:

```bash
cd back-end
npm run db:push
```

### 6. Test the Setup

1. **Start the backend:**
   ```bash
   cd back-end
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd front-end
   npm run dev
   ```

3. **Test authentication:**
   - Navigate to `http://localhost:3000`
   - Click "Sign in with Google"
   - Complete Google OAuth flow
   - You should be redirected back and authenticated

## 🎯 Usage Examples

### Using Auth Components

```tsx
import { SignInButton } from '@/components/auth/SignInButton';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { UserProfile } from '@/components/auth/UserProfile';
import { useSession } from 'next-auth/react';

export default function MyPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (status === 'unauthenticated') {
    return <SignInButton />;
  }

  return (
    <div>
      <UserProfile />
      <SignOutButton />
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import api from '@/lib/api';

// The API client automatically adds the auth token
const response = await api.get('/api/files');
const files = response.data;
```

### Protecting API Routes

Your Express routes are already protected with the `protect` middleware:

```typescript
import { protect } from '../middleware/auth';

router.get('/api/files', protect, getFiles);
```

## 🔐 How It Works

1. **User clicks "Sign in with Google"**
   - Frontend redirects to Google OAuth
   - User authenticates with Google
   - Google redirects back to `/api/auth/callback/google`

2. **NextAuth creates session**
   - NextAuth creates a JWT session
   - Session is stored in HTTP-only cookie
   - User is redirected to your app

3. **Frontend exchanges session for backend token**
   - When making API calls, the frontend calls `/api/auth/exchange-token`
   - Backend verifies the session and creates a backend JWT
   - Backend JWT is used for subsequent API calls

4. **Backend verifies tokens**
   - Express middleware verifies JWT tokens
   - User info is attached to request object
   - Protected routes can access `req.user`

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

1. Set environment variables in your hosting platform
2. Update `NEXTAUTH_URL` to your production URL
3. Add production redirect URI in Google Cloud Console

### Backend (AWS/DigitalOcean)

1. Set environment variables on your server
2. Ensure `NEXTAUTH_SECRET` matches frontend
3. Update CORS settings for production frontend URL

### Google OAuth

1. Add production URLs to authorized origins and redirect URIs
2. Submit OAuth consent screen for verification (if needed)

## 🐛 Troubleshooting

### "Invalid credentials" error
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify redirect URI matches exactly in Google Cloud Console

### "NEXTAUTH_SECRET is not set"
- Make sure `.env.local` exists in frontend
- Restart the Next.js dev server after adding env vars

### Token exchange fails
- Check that backend is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend logs for errors

### CORS errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL
- Check CORS configuration in `back-end/src/index.ts`

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)

