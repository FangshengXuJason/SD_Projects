'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [backendUser, setBackendUser] = useState<any>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testBackendAuth = async () => {
    setLoading(true);
    setBackendError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      console.log('Testing backend at:', apiUrl);

      // First test if backend is reachable
      try {
        const healthCheck = await fetch(`${apiUrl}/health`);
        console.log('Health check:', await healthCheck.json());
      } catch (healthError) {
        console.error('Health check failed:', healthError);
        setBackendError(`Backend server not reachable at ${apiUrl}. Make sure the backend is running on port 5001.`);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/auth/me');
      setBackendUser(response.data.data.user);
    } catch (error: any) {
      console.error('Backend API error:', error);
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setBackendError(`Network Error: Cannot connect to backend at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}. Make sure the backend server is running.`);
      } else if (error.response) {
        setBackendError(`Backend Error (${error.response.status}): ${error.response.data?.message || error.message}`);
      } else {
        setBackendError(error.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      testBackendAuth();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth Verification</h1>

        {/* Frontend Session Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frontend Session (NextAuth)</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                status === 'authenticated' ? 'bg-green-100 text-green-800' :
                status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </div>
            {session && (
              <>
                <div><span className="font-medium">User ID:</span> {session.user?.id}</div>
                <div><span className="font-medium">Email:</span> {session.user?.email}</div>
                <div><span className="font-medium">Name:</span> {session.user?.name || 'N/A'}</div>
                <div><span className="font-medium">Image:</span> {session.user?.image ? '✅ Present' : '❌ Not available'}</div>
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <span className="font-medium">Full Session:</span>
                  <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Backend API Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Backend API Test</h2>
          <div className="mb-4 text-sm text-gray-600">
            <div>Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}</code></div>
            <div className="mt-2">Make sure your backend server is running on port 5001</div>
          </div>
          {status !== 'authenticated' ? (
            <p className="text-gray-600">Please sign in first to test backend authentication.</p>
          ) : (
            <>
              <button
                onClick={testBackendAuth}
                disabled={loading}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Backend Auth'}
              </button>
              {backendError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 mb-4">
                  <strong>Error:</strong> {backendError}
                  <div className="mt-3 text-sm">
                    <strong>Troubleshooting Steps:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Check if backend server is running: <code className="bg-red-100 px-1 rounded">cd back-end && npm run dev</code></li>
                      <li>Verify backend is accessible: <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/health`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open Health Check</a></li>
                      <li>Check browser console (F12) for detailed error messages</li>
                      <li>Verify <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_API_URL</code> in your <code className="bg-red-100 px-1 rounded">.env.local</code> file</li>
                    </ul>
                  </div>
                </div>
              )}
              {backendUser && (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 mb-4">
                    ✅ Backend authentication successful!
                  </div>
                  <div><span className="font-medium">User ID:</span> {backendUser.id}</div>
                  <div><span className="font-medium">Email:</span> {backendUser.email}</div>
                  <div><span className="font-medium">Name:</span> {backendUser.name}</div>
                  <div><span className="font-medium">Image:</span> {backendUser.image || 'N/A'}</div>
                  <div><span className="font-medium">Created At:</span> {new Date(backendUser.createdAt).toLocaleString()}</div>
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <span className="font-medium">Full Response:</span>
                    <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(backendUser, null, 2)}</pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Verification Checklist */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Checklist</h2>
          <ul className="space-y-2">
            <li className={status === 'authenticated' ? 'text-green-600' : 'text-gray-400'}>
              {status === 'authenticated' ? '✅' : '❌'} Frontend session is active
            </li>
            <li className={session?.user?.id ? 'text-green-600' : 'text-gray-400'}>
              {session?.user?.id ? '✅' : '❌'} User ID is present in session
            </li>
            <li className={session?.user?.email ? 'text-green-600' : 'text-gray-400'}>
              {session?.user?.email ? '✅' : '❌'} Email is present in session
            </li>
            <li className={backendUser ? 'text-green-600' : 'text-gray-400'}>
              {backendUser ? '✅' : '⏳'} Backend API authentication works
            </li>
            <li className={backendUser?.id ? 'text-green-600' : 'text-gray-400'}>
              {backendUser?.id ? '✅' : '⏳'} User synced to database
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

