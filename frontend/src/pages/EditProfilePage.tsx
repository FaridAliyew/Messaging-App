import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/useUsers';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

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
  const watchedAvatarUrl = useWatch({ control, name: 'avatarUrl' });
  const watchedDisplayName = useWatch({ control, name: 'displayName' });
  const watchedBio = useWatch({ control, name: 'bio' });

  // Reset avatar load error state when URL changes
  useEffect(() => {
    setAvatarLoadError(false);
  }, [watchedAvatarUrl]);

  // Build a preview user for the Avatar primitive
  const previewUser = {
    displayName: watchedDisplayName || undefined,
    username: user?.username || '',
    avatarUrl: watchedAvatarUrl && !avatarLoadError ? watchedAvatarUrl : undefined,
  };

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
        <h1
          className="text-2xl font-semibold tracking-tight text-foreground"
          style={{ letterSpacing: '-0.02em' }}
        >
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your public profile information and avatar
        </p>
      </div>

      {/* Success alert */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-600/30 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Server error alert */}
      {serverError && (
        <div className="flex items-center gap-2.5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        {/* Live Avatar Preview */}
        <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
          <div className="relative">
            {/* Use a hidden img to detect load errors on the watched URL */}
            {watchedAvatarUrl && (
              <img
                src={watchedAvatarUrl}
                alt=""
                aria-hidden
                className="hidden"
                onError={() => setAvatarLoadError(true)}
              />
            )}
            <Avatar user={previewUser} size="lg" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {watchedDisplayName || user?.username || 'Preview'}
            </p>
            <p className="font-mono text-xs text-faint">@{user?.username}</p>
            <p className="mt-1 text-xs text-muted">
              {watchedAvatarUrl && !avatarLoadError
                ? 'Previewing image from URL'
                : 'Using initials badge'}
            </p>
            {avatarLoadError && watchedAvatarUrl && (
              <p className="mt-0.5 text-xs text-danger">
                ⚠ Unable to load image from URL
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Non-editable Username & Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Username"
              type="text"
              disabled
              value={user?.username || ''}
              hint="Username cannot be changed"
            />
            <Input
              label="Email"
              type="text"
              disabled
              value={user?.email || ''}
              hint="Email cannot be changed"
            />
          </div>

          <Input
            label="Display Name *"
            type="text"
            placeholder="e.g. Jane Doe"
            error={errors.displayName?.message}
            {...register('displayName')}
          />

          <Input
            label="Avatar URL"
            type="url"
            placeholder="https://images.unsplash.com/photo-…"
            error={errors.avatarUrl?.message}
            hint="Paste a direct image link. Leave blank for default initials."
            {...register('avatarUrl')}
          />

          <TextArea
            label="Bio"
            rows={3}
            placeholder="Tell others a bit about yourself…"
            error={errors.bio?.message}
            maxLength={300}
            charCount={watchedBio?.length ?? 0}
            {...register('bio')}
          />

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={updateProfileMutation.isPending}
              disabled={!isDirty}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
