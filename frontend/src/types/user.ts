export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}
