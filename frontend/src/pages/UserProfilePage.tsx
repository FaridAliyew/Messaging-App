import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Pencil } from 'lucide-react';
import { useUser } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { useStartConversation } from '../hooks/useConversations';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { data: user, isLoading, isError, error } = useUser(id || '');
  const startConversationMutation = useStartConversation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    const is404 = (error as any)?.response?.status === 404;
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <span className="text-xl">!</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {is404 ? 'User Not Found' : 'Failed to Load Profile'}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {is404
            ? 'The user you are looking for does not exist or has been removed.'
            : (error as Error)?.message || 'An unexpected error occurred.'}
        </p>
        <Link
          to="/users"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-4 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Users
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

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Users
      </Link>

      {/* Profile card */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-surface to-surface-2" />

        <div className="px-6 pb-6 pt-0">
          {/* Avatar + actions row */}
          <div className="relative -mt-14 mb-4 flex items-end justify-between">
            <div className="ring-4 ring-background rounded-full">
              <Avatar user={user} size="xl" />
            </div>

            {!isSelf && (
              <Button
                variant="primary"
                size="sm"
                loading={startConversationMutation.isPending}
                onClick={handleStartMessage}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {startConversationMutation.isPending ? 'Opening…' : 'Message'}
              </Button>
            )}
            {isSelf && (
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-background"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Link>
            )}
          </div>

          {/* Name / meta */}
          <div>
            <h1
              className="text-xl font-semibold text-foreground"
              style={{ letterSpacing: '-0.02em' }}
            >
              {user.displayName || user.username}
            </h1>
            <p className="font-mono text-sm text-muted">@{user.username}</p>
            {joinedDate && (
              <p className="mt-1 font-mono text-xs text-faint">Member since {joinedDate}</p>
            )}
          </div>

          {/* Bio */}
          <div className="mt-5 border-t border-border pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">About</h2>
            <div className="mt-2 text-sm leading-relaxed text-muted">
              {user.bio ? (
                <p className="whitespace-pre-line text-foreground/80">{user.bio}</p>
              ) : (
                <p className="italic text-faint">This user hasn't written a bio yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
