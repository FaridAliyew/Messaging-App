import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import User from '../models/User';
import { updateProfileSchema } from '../validators/userSchemas';

const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = req.user?._id;
    const filter: Record<string, any> = { _id: { $ne: currentUserId } };

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    if (search) {
      const escaped = escapeRegex(search);
      const searchRegex = new RegExp(escaped, 'i');
      filter.$or = [
        { username: searchRegex },
        { displayName: searchRegex },
      ];
    }

    const users = await User.find(filter).sort({ username: 1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: { message: 'Invalid user ID format' },
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        error: { message: 'User not found' },
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Mass-assignment protection: explicitly whitelist only allowed profile fields
    const whitelistedData: Record<string, any> = {};
    if (req.body.displayName !== undefined) {
      whitelistedData.displayName = req.body.displayName;
    }
    if (req.body.bio !== undefined) {
      whitelistedData.bio = req.body.bio;
    }
    if (req.body.avatarUrl !== undefined) {
      whitelistedData.avatarUrl = req.body.avatarUrl;
    }

    const validatedData = updateProfileSchema.parse(whitelistedData);

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        error: { message: 'User not found' },
      });
      return;
    }

    res.status(200).json(updatedUser);
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
