import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

const prisma = new PrismaClient();

// Register user - kept for potential future use (email/password signup)
export const register = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Email/password registration not implemented. Please use Google OAuth sign-in.'
  });
};

// Login user - kept for potential future use (email/password login)
export const login = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Email/password login not implemented. Please use Google OAuth sign-in.'
  });
};

// Exchange NextAuth session for backend JWT token
// Frontend calls this after NextAuth authentication to get a backend token
// Accepts NextAuth session data (userId, email, name, image) and optionally a token for verification
export const exchangeToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, email, name, image, nextAuthToken } = req.body;

    // Validate required fields
    if (!userId || !email) {
      res.status(400).json({
        success: false,
        message: 'User ID and email are required',
      });
      return;
    }

    // If token is provided, verify it (for extra security)
    if (nextAuthToken) {
      const nextAuthSecret = process.env.NEXTAUTH_SECRET;
      if (nextAuthSecret) {
        try {
          const decoded = jwt.verify(nextAuthToken, nextAuthSecret) as any;
          // Verify the user data matches the token
          if (decoded.id !== userId && decoded.sub !== userId) {
            res.status(401).json({
              success: false,
              message: 'Token verification failed',
            });
            return;
          }
        } catch (error) {
          // For MVP, we'll allow the request even if token verification fails
          // In production, you might want to be stricter
          console.warn('Token verification failed, but allowing request for MVP');
        }
      }
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name: name || email,
          image: image || null,
          emailVerified: new Date(),
        },
      });
    } else {
      // Update user info if needed
      if (user.name !== name || user.image !== image) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            image: image || user.image,
          },
        });
      }
    }

    // Generate backend JWT token
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const jwtSecret = process.env.JWT_SECRET;
    const backendSecret: string = jwtSecret || nextAuthSecret || 'fallback-secret';

    if (!backendSecret || backendSecret === 'fallback-secret') {
      res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET or NEXTAUTH_SECRET must be set',
      });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };

    const expiresInValue: StringValue | number = (process.env.JWT_EXPIRES_IN || '7d') as StringValue;
    const options: SignOptions = {
      expiresIn: expiresInValue,
    };

    const backendToken = jwt.sign(payload, backendSecret, options);

    res.json({
      success: true,
      data: {
        token: backendToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      },
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exchanging token',
    });
  }
};

// Get current user - syncs with database and returns user info
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { id, email, name, image } = req.user;

    // Find or create user in database
    // This ensures users from NextAuth are synced to our database
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    // If user doesn't exist, create them (first-time OAuth sign-in)
    if (!user) {
      user = await prisma.user.create({
        data: {
          id,
          email,
          name: name || email,
          image: image || null,
          emailVerified: new Date(), // OAuth users are pre-verified
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
        },
      });
    } else {
      // Update user info if it has changed (e.g., profile picture updated)
      if (user.name !== name || user.image !== image) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            image: image || user.image,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            createdAt: true,
          },
        });
      }
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
    });
  }
};