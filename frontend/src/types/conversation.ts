import { User } from './user';

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  participantsKey: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  content: string;
}

export interface GetMessagesParams {
  limit?: number;
  before?: string;
}
