import api from '../lib/api';
import { User, UpdateProfileInput } from '../types/user';

export const getUsers = async (search?: string): Promise<User[]> => {
  const response = await api.get<User[]>('/users', {
    params: search ? { search } : undefined,
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const updateProfile = async (payload: UpdateProfileInput): Promise<User> => {
  const response = await api.patch<User>('/users/me', payload);
  return response.data;
};
