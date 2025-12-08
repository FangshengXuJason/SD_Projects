import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Error handler middleware - boilerplate
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Implement error handling logic
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};