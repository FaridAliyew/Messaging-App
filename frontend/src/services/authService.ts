import api from '../lib/api';
import { User, AuthResponse, RegisterInput, LoginInput, MessageResponse } from '../types/user';

export const register = async (data: RegisterInput): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data.user;
};

export const login = async (data: LoginInput): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data.user;
};

export const logout = async (): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>('/auth/logout');
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<AuthResponse>('/auth/me');
  return response.data.user;
};
