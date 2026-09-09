import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useConversations, useMessages, useSendMessage } from '../hooks/useConversations';
import { Conversation, Message } from '../types/conversation';
import { User } from '../types/user';

const Avatar: React.FC<{ user?: User; size?: 'sm' | 'md' | 'lg' }> = ({
  user,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.username.slice(0, 2).toUpperCase() || '?';

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  if (user?.avatarUrl && !imgError) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.displayName || user.username}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-full border border-slate-200 object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-slate-900 font-bold text-white shadow-sm shrink-0`}
    >
      {initials}
    </div>
  );
};

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversationId = searchParams.get('conversationId') || '';

  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const { data: messages, isLoading: loadingMessages } = useMessages(activeConversationId);
  const sendMessageMutation = useSendMessage(activeConversationId);

  const [messageText, setMessageText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of message list on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to find the other participant in 1:1 conversation
  const getOtherParticipant = (conversation: Conversation): User | undefined => {
    return (
      conversation.participants.find((p) => p._id !== user?._id) ||
      conversation.participants[0]
    );
  };

  const activeConversation = conversations?.find(
    (c) => c._id === activeConversationId
  );
  const otherUser = activeConversation ? getOtherParticipant(activeConversation) : undefined;

  const handleSelectConversation = (id: string) => {
    setSearchParams({ conversationId: id });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = messageText.trim();
    if (!content || sendMessageMutation.isPending) return;

    setSendError(null);
    try {
      await sendMessageMutation.mutateAsync(content);
      setMessageText('');
    } catch (err: any) {
      setSendError(
        err.response?.data?.error?.message ||
          err.message ||
          'Failed to send message'
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* LEFT PANE: Conversations list */}
      <div className="flex w-full flex-col border-r border-slate-200 sm:w-80 md:w-96 shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Chats</h2>
            {conversations && conversations.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {conversations.length}
              </span>
            )}
          </div>
          <Link
            to="/users"
            className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            + New Chat
          </Link>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {loadingConversations ? (
            <div className="flex justify-center p-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-r-transparent"></div>
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No conversations yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Start a chat by visiting any user's profile in the Users directory.
              </p>
              <Link
                to="/users"
                className="mt-4 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Browse Users
              </Link>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isSelected = conv._id === activeConversationId;
              const lastMsg = conv.lastMessage;
              const formattedTime = conv.updatedAt
                ? new Date(conv.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <button
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv._id)}
                  className={`flex w-full items-center space-x-3 p-3.5 text-left transition hover:bg-slate-50 ${
                    isSelected ? 'bg-slate-50 border-l-4 border-slate-900 pl-3' : ''
                  }`}
                >
                  <Avatar user={other} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {other?.displayName || other?.username || 'User'}
                      </h3>
                      {formattedTime && (
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                          {formattedTime}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-slate-500 mt-0.5">
                      {lastMsg ? (
                        <>
                          {lastMsg.sender?._id === user?._id && 'You: '}
                          {lastMsg.content}
                        </>
                      ) : (
                        <span className="italic text-slate-400">No messages yet</span>
                      )}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: Messages & Input */}
      <div className="flex flex-1 flex-col bg-slate-50/50">
        {!activeConversationId ? (
          /* Empty state: No conversation selected */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              💬
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              Select a conversation
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Choose an existing chat from the left sidebar or start a new direct message from the Users page.
            </p>
            <Link
              to="/users"
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Find Users
            </Link>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
              <div className="flex items-center space-x-3">
                <Avatar user={otherUser} size="sm" />
                <div>
                  <Link
                    to={`/users/${otherUser?._id}`}
                    className="text-sm font-bold text-slate-900 hover:underline"
                  >
                    {otherUser?.displayName || otherUser?.username}
                  </Link>
                  <p className="text-[11px] text-slate-500">@{otherUser?.username}</p>
                </div>
              </div>
              <Link
                to={`/users/${otherUser?._id}`}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium"
              >
                View Profile →
              </Link>
            </div>

            {/* Messages thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center p-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-r-transparent"></div>
                </div>
              ) : !messages || messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <p className="text-sm font-medium text-slate-700">No messages yet</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Send a message below to start the conversation! 👋
                  </p>
                </div>
              ) : (
                messages.map((msg: Message) => {
                  const isMe = msg.sender?._id === user?._id;
                  const time = new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMe
                            ? 'bg-slate-900 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <span className="mt-1 text-[10px] text-slate-400 px-1">
                        {time}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error banner if send failed */}
            {sendError && (
              <div className="bg-red-50 px-6 py-2 border-t border-red-200 text-xs text-red-600 font-medium">
                ✕ {sendError}
              </div>
            )}

            {/* Message input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-slate-200 bg-white p-4"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Message ${otherUser?.displayName || otherUser?.username || ''}...`}
                  maxLength={2000}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
