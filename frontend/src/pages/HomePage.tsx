import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const HomePage: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.get<HealthResponse>('/health');
      return res.data;
    },
    retry: false,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Messaging App
            </h1>
            <p className="text-sm text-slate-500">The Odin Project Full-Stack Assignment</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
              Phase 2 Active
            </span>
          </div>
        </div>

        {/* Authenticated User Card */}
        {user && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-sm">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {user.displayName || user.username}
                  </h2>
                  <p className="text-xs text-slate-500">@{user.username} • {user.email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-red-600 disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
            {user.bio && (
              <p className="mt-3 text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                {user.bio}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Architecture Status
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-800">
              Authentication & MongoDB Integration Completed
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700">Backend Health API Check</h3>
              <button
                onClick={() => refetch()}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
              >
                Test Endpoint
              </button>
            </div>

            <div className="mt-3 text-xs">
              {isLoading && (
                <p className="text-slate-500">Checking backend status...</p>
              )}
              {isError && (
                <div className="rounded bg-amber-50 p-2.5 text-amber-800 border border-amber-200">
                  <p className="font-semibold">Backend not detected or offline</p>
                  <p className="mt-0.5 text-[11px] text-amber-700">
                    Make sure the backend server is running on port 5000 (`npm run dev` in backend directory).
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-amber-600">
                    {(error as Error)?.message}
                  </p>
                </div>
              )}
              {data && (
                <div className="rounded bg-emerald-50 p-2.5 text-emerald-800 border border-emerald-200 font-mono text-[11px]">
                  <p>Status: {data.status}</p>
                  <p>Environment: {data.environment}</p>
                  <p>Server Time: {data.timestamp}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
          Ready for Phase 3: Users, Friends, and Profiles
        </div>
      </div>
    </div>
  );
};

export default HomePage;
