import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
}

export const signToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  return jwt.sign({ userId }, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.verify(token, secret) as TokenPayload;
};
