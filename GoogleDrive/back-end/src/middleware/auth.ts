import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
}

// Authentication middleware - verifies NextAuth JWT tokens
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
      return;
    }

    // Verify token - try backend JWT secret first, then NextAuth secret as fallback
    const backendSecret = process.env.JWT_SECRET;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;

    if (!backendSecret && !nextAuthSecret) {
      console.error('JWT_SECRET or NEXTAUTH_SECRET must be set in environment variables');
      res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
      return;
    }

    // Try to verify with backend secret first (for exchanged tokens)
    // Fall back to NextAuth secret (for direct NextAuth tokens)
    let decoded: any;
    try {
      decoded = jwt.verify(token, backendSecret || nextAuthSecret!);
    } catch (backendError) {
      // If backend secret fails and we have NextAuth secret, try that
      if (nextAuthSecret && backendSecret) {
        try {
          decoded = jwt.verify(token, nextAuthSecret);
        } catch (nextAuthError) {
          throw backendError; // Throw original error
        }
      } else {
        throw backendError;
      }
    }

    const decodedToken = decoded as {
      id?: string;
      email?: string;
      name?: string;
      picture?: string;
      image?: string;
      sub?: string; // NextAuth uses 'sub' for user ID
    };

    // Extract user information from token
    // NextAuth uses 'sub' for user ID, but we also check 'id'
    const userId = decodedToken.id || decodedToken.sub;
    const email = decodedToken.email;
    const name = decodedToken.name;
    const image = decodedToken.picture || decodedToken.image;

    if (!userId || !email) {
      res.status(401).json({
        success: false,
        message: 'Invalid token: missing user information',
      });
      return;
    }

    // Attach user to request object
    req.user = {
      id: userId,
      email,
      name: name || email,
      image,
    };

    next();
    return;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
      });
      return;
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
    return;
  }
};