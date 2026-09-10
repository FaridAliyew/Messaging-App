import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, MessageSquare, ArrowRight, Activity } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/ui/Avatar';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  // Health check query is kept present (same query key) but not rendered in the UI
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _health } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.get<HealthResponse>('/health');
      return res.data;
    },
    retry: false,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Greeting */}
      <div className="flex items-center gap-4">
        <Avatar user={user ?? undefined} size="xl" />
        <div>
          <h1
            className="text-2xl font-semibold text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            Welcome back,{' '}
            <span className="text-accent">{user?.displayName || user?.username}</span>
          </h1>
          {user && (
            <p className="mt-0.5 font-mono text-sm text-muted">@{user.username}</p>
          )}
          {user?.bio && (
            <p className="mt-2 text-sm leading-relaxed text-muted">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/users"
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-colors duration-150 hover:bg-surface-2 hover:border-muted/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-accent transition-colors group-hover:bg-background">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Users</p>
              <p className="text-xs text-muted">Browse and connect with members</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-muted" />
        </Link>

        <Link
          to="/messages"
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-colors duration-150 hover:bg-surface-2 hover:border-muted/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-accent transition-colors group-hover:bg-background">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Messages</p>
              <p className="text-xs text-muted">Your direct conversations</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-muted" />
        </Link>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <span className="text-xs text-muted">
          Connected · REST polling active
        </span>
      </div>
    </div>
  );
};

export default HomePage;
