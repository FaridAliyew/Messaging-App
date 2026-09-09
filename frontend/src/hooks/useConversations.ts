import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
} from '../services/conversationService';
import { Conversation, Message, GetMessagesParams } from '../types/conversation';

export const useConversations = () => {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: getConversations,
    refetchInterval: 5000, // Light polling for inbox updates
  });
};

export const useMessages = (conversationId?: string, params?: GetMessagesParams) => {
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId, params?.before],
    queryFn: () => {
      if (!conversationId) return Promise.resolve([]);
      return getMessages(conversationId, params);
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Light polling every 3s for active conversation
  });
};

export const useSendMessage = (conversationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, string>({
    mutationFn: (content: string) => {
      if (!conversationId) throw new Error('No active conversation selected');
      return sendMessage(conversationId, content);
    },
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, string>({
    mutationFn: (recipientId: string) => getOrCreateConversation(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
