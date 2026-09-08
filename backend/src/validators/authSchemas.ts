import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  displayName: z
    .string()
    .trim()
    .max(50, 'Display name cannot exceed 50 characters')
    .optional(),
});

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .trim()
    .min(1, 'Username or email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
