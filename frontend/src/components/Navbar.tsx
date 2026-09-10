import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Users, MessageSquare, UserCog, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from './ui/Avatar';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/messages', label: 'Messages', icon: MessageSquare, end: false },
  { to: '/users', label: 'Users', icon: Users, end: false },
  { to: '/profile', label: 'Profile', icon: UserCog, end: false },
] as const;

export const Navbar: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
      isActive
        ? 'bg-surface-2 text-foreground'
        : 'text-muted hover:text-foreground hover:bg-surface-2',
    ].join(' ');

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
      isActive
        ? 'bg-surface-2 text-foreground border-l-2 border-accent pl-[10px]'
        : 'text-muted hover:text-foreground hover:bg-surface-2',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-bold">
              F
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Forge
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navLinkClass}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              to="/profile"
              className="hidden items-center gap-2 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-surface-2 sm:flex"
              title="Edit your profile"
            >
              <Avatar user={user} size="sm" />
              <span className="text-xs font-medium text-muted">
                {user.displayName || user.username}
              </span>
            </Link>
          )}

          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:bg-danger/10 hover:text-danger disabled:opacity-50 sm:flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoggingOut ? 'Signing out…' : 'Sign Out'}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          {user && (
            <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar user={user} size="sm" />
                <span className="text-xs font-medium text-muted">
                  {user.displayName || user.username}
                </span>
              </div>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                disabled={isLoggingOut}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
