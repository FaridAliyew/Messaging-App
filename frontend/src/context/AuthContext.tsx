import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from '../services/authService';
import { User, LoginInput, RegisterInput } from '../types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<User>;
  register: (data: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (err: any) {
        if (err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const login = async (data: LoginInput): Promise<User> => {
    return loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterInput): Promise<User> => {
    return registerMutation.mutateAsync(data);
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const isAuthenticated = !isLoading && !isError && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
