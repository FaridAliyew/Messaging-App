import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/useUsers';

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name cannot be empty')
    .max(50, 'Display name cannot exceed 50 characters'),
  bio: z
    .string()
    .trim()
    .max(300, 'Bio cannot exceed 300 characters')
    .optional(),
  avatarUrl: z
    .string()
    .trim()
    .url('Please enter a valid URL (e.g. https://example.com/avatar.jpg)')
    .or(z.literal(''))
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  // Re-sync form if user query updates
  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user, reset]);

  // Live avatarUrl watcher for preview
  const watchedAvatarUrl = useWatch({
    control,
    name: 'avatarUrl',
  });

  const watchedDisplayName = useWatch({
    control,
    name: 'displayName',
  });

  // Reset avatar load error state when URL changes
  useEffect(() => {
    setAvatarLoadError(false);
  }, [watchedAvatarUrl]);

  const initials = watchedDisplayName
    ? watchedDisplayName.slice(0, 2).toUpperCase()
    : user?.username.slice(0, 2).toUpperCase() || 'U';

  const onSubmit = async (data: ProfileFormData) => {
    setSuccessMessage(null);
    setServerError(null);

    try {
      await updateProfileMutation.mutateAsync({
        displayName: data.displayName.trim(),
        bio: data.bio ? data.bio.trim() : '',
        avatarUrl: data.avatarUrl ? data.avatarUrl.trim() : '',
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        (err as Error).message ||
        'Failed to update profile';
      setServerError(message);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your public profile information and avatar
        </p>
      </div>

      {/* Success alert */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          ✓ {successMessage}
        </div>
      )}

      {/* Server error alert */}
      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ✕ {serverError}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Live Avatar Preview */}
        <div className="mb-6 flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="relative">
            {watchedAvatarUrl && !avatarLoadError ? (
              <img
                src={watchedAvatarUrl}
                alt="Avatar preview"
                onError={() => setAvatarLoadError(true)}
                className="h-16 w-16 rounded-full border border-slate-200 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-sm">
                {initials}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Avatar Preview</h2>
            <p className="text-xs text-slate-500">
              {watchedAvatarUrl && !avatarLoadError
                ? 'Previewing image from URL'
                : 'Using fallback initials badge'}
            </p>
            {avatarLoadError && watchedAvatarUrl && (
              <p className="mt-0.5 text-xs text-amber-600">
                ⚠️ Unable to load image from URL (falling back to initials)
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Non-editable Username & Email info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Username
              </label>
              <input
                type="text"
                disabled
                value={user?.username || ''}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-slate-400">Username cannot be changed</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-slate-400">Email cannot be changed</p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Display Name *
            </label>
            <input
              type="text"
              {...register('displayName')}
              placeholder="e.g. Jane Doe"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Avatar URL
            </label>
            <input
              type="url"
              {...register('avatarUrl')}
              placeholder="https://images.unsplash.com/photo-..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.avatarUrl && (
              <p className="mt-1 text-xs text-red-600">{errors.avatarUrl.message}</p>
            )}
            <p className="mt-1 text-[11px] text-slate-500">
              Paste a direct image link (e.g. from Unsplash or GitHub). Leave blank for default initials.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Bio
            </label>
            <textarea
              rows={3}
              {...register('bio')}
              placeholder="Tell others a bit about yourself..."
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>
            )}
            <p className="mt-1 text-[11px] text-slate-500">Max 300 characters.</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending || !isDirty}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
