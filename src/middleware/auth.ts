import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'historicalwalksecret';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
        type: 'admin' | 'user';
      };
    }
  }
}

// Export verifyToken for use in Socket.io and other services
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided. Please include a Bearer token in the Authorization header.' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string; type: 'admin' | 'user' };

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      type: decoded.type || 'user', // Default to 'user' for backward compatibility
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    res.status(500).json({ message: 'Error authenticating user' });
  }
};

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string; type: 'admin' | 'user' };

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        type: decoded.type || 'user',
      };
    }
    next();
  } catch (error) {
    // Invalid token or expired, but we don't block request
    next();
  }
};


