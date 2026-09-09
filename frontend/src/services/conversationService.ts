import api from '../lib/api';
import { Conversation, Message, GetMessagesParams } from '../types/conversation';

export const getOrCreateConversation = async (
  recipientId: string
): Promise<Conversation> => {
  const response = await api.post<Conversation>('/conversations', {
    recipientId,
  });
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get<Conversation[]>('/conversations');
  return response.data;
};

export const getMessages = async (
  conversationId: string,
  params?: GetMessagesParams
): Promise<Message[]> => {
  const response = await api.get<Message[]>(
    `/conversations/${conversationId}/messages`,
    { params }
  );
  return response.data;
};

export const sendMessage = async (
  conversationId: string,
  content: string
): Promise<Message> => {
  const response = await api.post<Message>(
    `/conversations/${conversationId}/messages`,
    { content }
  );
  return response.data;
};
