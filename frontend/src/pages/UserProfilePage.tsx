import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useStartConversation } from '../hooks/useConversations';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, isError, error } = useUser(id || '');
  const startConversationMutation = useStartConversation();
  const [avatarError, setAvatarError] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    const is404 = (error as any)?.response?.status === 404;
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          {is404 ? 'User Not Found' : 'Failed to Load Profile'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {is404
            ? 'The user you are looking for does not exist or has been removed.'
            : (error as Error)?.message || 'An unexpected error occurred.'}
        </p>
        <Link
          to="/users"
          className="mt-6 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  const isSelf = currentUser?._id === user._id;

  const handleStartMessage = async () => {
    try {
      const conv = await startConversationMutation.mutateAsync(user._id);
      navigate(`/messages?conversationId=${conv._id}`);
    } catch (err: any) {
      console.error('Failed to start conversation:', err);
    }
  };

  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.username.slice(0, 2).toUpperCase();

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/users"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900" />

        <div className="px-6 pb-6 pt-0">
          {/* Avatar and info header */}
          <div className="relative -mt-16 mb-4 flex items-end justify-between">
            <div className="relative">
              {user.avatarUrl && !avatarError ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName || user.username}
                  onError={() => setAvatarError(true)}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-md">
                  {initials}
                </div>
              )}
            </div>

            {/* Action buttons: Message button */}
            {!isSelf && (
              <button
                onClick={handleStartMessage}
                disabled={startConversationMutation.isPending}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
              >
                <span>💬</span>
                <span>{startConversationMutation.isPending ? 'Opening...' : 'Message'}</span>
              </button>
            )}
            {isSelf && (
              <Link
                to="/profile"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {user.displayName || user.username}
            </h1>
            <p className="text-sm text-slate-500">@{user.username}</p>
            {joinedDate && (
              <p className="mt-1 text-xs text-slate-400">Member since {joinedDate}</p>
            )}
          </div>

          {/* Bio section */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              About
            </h2>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">
              {user.bio ? (
                <p className="whitespace-pre-line">{user.bio}</p>
              ) : (
                <p className="italic text-slate-400">This user hasn't written a bio yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
