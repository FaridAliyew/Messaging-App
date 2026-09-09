import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.username.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm">
              M
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Messaging App
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/users" className={navLinkClass}>
              Users
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Edit Profile
            </NavLink>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-3">
          <Link
            to="/profile"
            className="flex items-center space-x-2.5 rounded-full p-1 transition hover:bg-slate-100"
            title="Edit your profile"
          >
            {user?.avatarUrl && !avatarError ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName || user.username}
                onError={() => setAvatarError(true)}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-sm">
                {initials}
              </div>
            )}
            <span className="hidden text-xs font-medium text-slate-700 sm:inline-block">
              {user?.displayName || user?.username}
            </span>
          </Link>

          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-red-600 disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
