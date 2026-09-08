import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User, { IUserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        error: { message: 'Authentication required. No token provided.' },
      });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        error: { message: 'Invalid authentication token. User not found.' },
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: { message: 'Invalid or expired authentication token.' },
    });
  }
};

export default authenticate;
