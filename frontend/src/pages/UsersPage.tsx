import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/user';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';

export const UsersPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const { data: users, isLoading, isError, error } = useUsers(searchInput);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            Users
          </h1>
          <p className="mt-1 text-sm text-muted">
            Discover and connect with members of the community
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by username or name…"
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-foreground placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          <p className="font-semibold">Failed to load users</p>
          <p className="mt-1 text-xs opacity-80">{(error as Error)?.message}</p>
        </div>
      )}

      {/* Users list */}
      {!isLoading && !isError && users && (
        <>
          {users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-sm font-semibold text-foreground">No users found</p>
              <p className="mt-1 text-xs text-muted">
                {searchInput
                  ? `No members match "${searchInput}". Try adjusting your search.`
                  : 'There are currently no other users registered.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user: User) => (
                <Link
                  key={user._id}
                  to={`/users/${user._id}`}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors duration-150 hover:bg-surface-2 hover:border-muted/40"
                >
                  <Avatar user={user} size="md" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {user.displayName || user.username}
                    </h3>
                    <p className="font-mono truncate text-xs text-faint">
                      @{user.username}
                    </p>
                    {user.bio ? (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                        {user.bio}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs italic text-faint">No bio provided</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
