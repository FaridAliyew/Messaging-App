import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/user';

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
  const [hasError, setHasError] = useState(false);

  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.username.slice(0, 2).toUpperCase();

  if (user.avatarUrl && !hasError) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.displayName || user.username}
        onError={() => setHasError(true)}
        className="h-12 w-12 rounded-full border border-slate-200 object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm">
      {initials}
    </div>
  );
};

export const UsersPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const { data: users, isLoading, isError, error } = useUsers(searchInput);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Discover and connect with members of the messaging community
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by username or name..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Failed to load users</p>
          <p className="mt-1 text-xs text-red-600">{(error as Error)?.message}</p>
        </div>
      )}

      {/* Users list */}
      {!isLoading && !isError && users && (
        <>
          {users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-base font-semibold text-slate-800">No users found</p>
              <p className="mt-1 text-sm text-slate-500">
                {searchInput
                  ? `No members match "${searchInput}". Try adjusting your search query.`
                  : 'There are currently no other users registered.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/users/${user._id}`}
                  className="group flex items-start space-x-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <UserAvatar user={user} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                      {user.displayName || user.username}
                    </h3>
                    <p className="truncate text-xs text-slate-500">@{user.username}</p>
                    {user.bio ? (
                      <p className="mt-2 line-clamp-2 text-xs text-slate-600">{user.bio}</p>
                    ) : (
                      <p className="mt-2 text-xs italic text-slate-400">No bio provided</p>
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
