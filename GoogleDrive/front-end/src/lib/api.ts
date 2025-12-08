import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store backend token in memory (in production, consider using secure storage)
let backendToken: string | null = null;

// Helper function to get backend JWT token
// This exchanges NextAuth session for a backend token
async function getBackendToken(): Promise<string | null> {
  try {
    // If we already have a token, return it
    if (backendToken) {
      return backendToken;
    }

    // Get NextAuth session
    const session = await getSession();
    if (!session) return null;

    // Exchange NextAuth session for backend token
    // We'll use the session data to get a backend token
    // Note: In a real app, you might want to cache this or store it securely
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/exchange-token`,
        {
          // Send session user data
          userId: session.user?.id,
          email: session.user?.email,
          name: session.user?.name || null,
          image: session.user?.image || null,
          nextAuthToken: (session as any).accessToken || null, // Optional, for verification
        }
      );

      if (response.data.success && response.data.data.token) {
        backendToken = response.data.data.token;
        return backendToken;
      }
    } catch (error) {
      console.error('Error exchanging token:', error);
      // If exchange fails, try to use session directly
      // Backend middleware will handle NextAuth token verification
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error getting backend token:', error);
    return null;
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get backend JWT token
    const token = await getBackendToken();

    // Add JWT token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear cached token
      backendToken = null;
      // NextAuth will handle re-authentication
      console.error('Unauthorized - please sign in again');
    }
    return Promise.reject(error);
  }
);

export default api;

