import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  displayName: z
    .string()
    .trim()
    .max(50, 'Display name cannot exceed 50 characters')
    .optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isAuthenticated, isRegistering } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data);
      navigate('/', { replace: true });
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message || 'Registration failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground text-lg font-bold">
            F
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Create an account
          </h1>
          <p className="mt-1 text-sm text-muted">Join Forge and start messaging</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-surface p-8">
          {serverError && (
            <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Username *"
              type="text"
              autoComplete="username"
              placeholder="e.g. cool_user"
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Email Address *"
              type="email"
              autoComplete="email"
              placeholder="e.g. user@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Display Name (Optional)"
              type="text"
              autoComplete="name"
              placeholder="e.g. Cool User"
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label="Password *"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isRegistering}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
