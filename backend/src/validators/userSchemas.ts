import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name cannot be empty')
    .max(50, 'Display name cannot exceed 50 characters')
    .optional(),
  bio: z
    .string()
    .trim()
    .max(300, 'Bio cannot exceed 300 characters')
    .optional(),
  avatarUrl: z
    .string()
    .trim()
    .url('Avatar URL must be a valid URL')
    .or(z.literal(''))
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
