'use client';

import { useSession } from 'next-auth/react';
import { SignInButton } from '@/components/auth/SignInButton';
import { UserProfile } from '@/components/auth/UserProfile';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Google Drive Clone</h1>
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : status === 'authenticated' ? (
              <UserProfile />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {status === 'loading' ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Google Drive Clone
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sign in with Google to get started
            </p>
            <div className="flex justify-center">
              <SignInButton />
            </div>
          </div>
        ) : (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your files will appear here once you start uploading.
            </p>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Start
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Authentication is set up and working</li>
                <li>📁 File upload functionality coming next</li>
                <li>🔒 Your API calls are automatically authenticated</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
