import { Request, Response, NextFunction, CookieOptions } from 'express';
import { ZodError } from 'zod';
import User from '../models/User';
import { signToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../validators/authSchemas';

const COOKIE_NAME = 'token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: SEVEN_DAYS_MS,
  path: '/',
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      $or: [{ email: validatedData.email }, { username: validatedData.username }],
    });

    if (existingUser) {
      const isEmailTaken = existingUser.email === validatedData.email;
      res.status(409).json({
        error: {
          message: isEmailTaken
            ? 'An account with this email already exists'
            : 'Username is already taken',
        },
      });
      return;
    }

    const user = new User(validatedData);
    await user.save();

    const token = signToken(user._id.toString());
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(201).json({
      user: user.toJSON(),
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          message: error.errors[0]?.message || 'Validation failed',
          details: error.errors,
        },
      });
      return;
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      res.status(409).json({
        error: {
          message: `An account with this ${field} already exists.`,
        },
      });
      return;
    }

    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = {
      usernameOrEmail: req.body.usernameOrEmail || req.body.email || req.body.username,
      password: req.body.password,
    };

    const validatedData = loginSchema.parse(payload);
    const identifier = validatedData.usernameOrEmail;

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    }).select('+password');

    if (!user) {
      res.status(401).json({
        error: { message: 'Invalid username/email or password' },
      });
      return;
    }

    const isMatch = await user.comparePassword(validatedData.password);
    if (!isMatch) {
      res.status(401).json({
        error: { message: 'Invalid username/email or password' },
      });
      return;
    }

    const token = signToken(user._id.toString());
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(200).json({
      user: user.toJSON(),
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: {
          message: error.errors[0]?.message || 'Validation failed',
          details: error.errors,
        },
      });
      return;
    }

    next(error);
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      error: { message: 'Not authenticated' },
    });
    return;
  }

  res.status(200).json({
    user: req.user.toJSON(),
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({
    message: 'Logged out successfully',
  });
};
