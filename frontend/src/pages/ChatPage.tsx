import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, MessageSquare, PenSquare, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useConversations, useMessages, useSendMessage } from '../hooks/useConversations';
import { Conversation, Message } from '../types/conversation';
import { User } from '../types/user';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';

// Helper: find the other participant in a 1:1 conversation
function getOtherParticipant(conversation: Conversation, currentUserId?: string): User | undefined {
  return (
    conversation.participants.find((p) => p._id !== currentUserId) ||
    conversation.participants[0]
  );
}

// Format timestamp for conversation list (short)
function formatConvTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Format timestamp for message bubbles
function formatMsgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversationId = searchParams.get('conversationId') || '';

  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const { data: messages, isLoading: loadingMessages } = useMessages(activeConversationId);
  const sendMessageMutation = useSendMessage(activeConversationId);

  const [messageText, setMessageText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  // On mobile: whether to show thread pane (true) or list pane (false)
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of message list on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When a conversation is selected, show thread on mobile
  useEffect(() => {
    if (activeConversationId) {
      setMobileShowThread(true);
    }
  }, [activeConversationId]);

  const activeConversation = conversations?.find((c) => c._id === activeConversationId);
  const otherUser = activeConversation ? getOtherParticipant(activeConversation, user?._id) : undefined;

  const handleSelectConversation = (id: string) => {
    setSearchParams({ conversationId: id });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = messageText.trim();
    if (!content || sendMessageMutation.isPending) return;

    setSendError(null);
    try {
      await sendMessageMutation.mutateAsync(content);
      setMessageText('');
      textareaRef.current?.focus();
    } catch (err: any) {
      setSendError(
        err.response?.data?.error?.message ||
          err.message ||
          'Failed to send message',
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Left pane: Conversation list ─────────────────────────────────────────
  const LeftPane = (
    <div
      className={[
        'flex flex-col border-r border-border bg-surface',
        // On mobile: full width; hidden when thread is shown
        mobileShowThread ? 'hidden sm:flex sm:w-72 md:w-80 shrink-0' : 'flex w-full sm:w-72 md:w-80 shrink-0',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">Chats</h2>
          {conversations && conversations.length > 0 && (
            <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted">
              {conversations.length}
            </span>
          )}
        </div>
        <Link
          to="/users"
          title="Start a new conversation"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
        >
          <PenSquare className="h-3.5 w-3.5" />
          New
        </Link>
      </div>

      {/* Conversation items */}
      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="flex justify-center p-8">
            <Spinner size="sm" />
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-faint" />
            <p className="mt-3 text-sm font-semibold text-foreground">No conversations yet</p>
            <p className="mt-1 text-xs text-muted">
              Start a chat from any user's profile.
            </p>
            <Link
              to="/users"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Browse Users
            </Link>
          </div>
        ) : (
          conversations.map((conv: Conversation) => {
            const other = getOtherParticipant(conv, user?._id);
            const isSelected = conv._id === activeConversationId;
            const lastMsg = conv.lastMessage;

            return (
              <button
                key={conv._id}
                onClick={() => handleSelectConversation(conv._id)}
                className={[
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150',
                  isSelected
                    ? 'border-l-2 border-accent bg-surface-2 pl-[14px]'
                    : 'border-l-2 border-transparent hover:bg-surface-2',
                ].join(' ')}
              >
                <Avatar user={other} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-sm font-medium text-foreground">
                      {other?.displayName || other?.username || 'User'}
                    </span>
                    {conv.updatedAt && (
                      <span className="shrink-0 font-mono text-[10px] text-faint">
                        {formatConvTime(conv.updatedAt)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {lastMsg ? (
                      <>
                        {lastMsg.sender?._id === user?._id && (
                          <span className="text-faint">You: </span>
                        )}
                        {lastMsg.content}
                      </>
                    ) : (
                      <span className="italic text-faint">No messages yet</span>
                    )}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // ─── Right pane: Thread ────────────────────────────────────────────────────
  const RightPane = (
    <div
      className={[
        'flex flex-1 flex-col bg-background',
        // On mobile: full width; hidden when list is shown
        !mobileShowThread ? 'hidden sm:flex' : 'flex w-full',
      ].join(' ')}
    >
      {!activeConversationId ? (
        // No conversation selected
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2">
            <MessageSquare className="h-7 w-7 text-faint" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Select a conversation
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted">
              Choose a chat from the left sidebar or start a new message from the Users page.
            </p>
          </div>
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Find Users
          </Link>
        </div>
      ) : (
        <>
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <button
                onClick={() => setMobileShowThread(false)}
                className="mr-1 rounded-md p-1 text-muted hover:bg-surface-2 hover:text-foreground transition-colors sm:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Avatar user={otherUser} size="sm" />
              <div>
                <Link
                  to={`/users/${otherUser?._id}`}
                  className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
                >
                  {otherUser?.displayName || otherUser?.username}
                </Link>
                <p className="font-mono text-[10px] text-faint">
                  @{otherUser?.username}
                </p>
              </div>
            </div>
            <Link
              to={`/users/${otherUser?._id}`}
              className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Profile</span>
            </Link>
          </div>

          {/* Messages thread */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
            {loadingMessages ? (
              <div className="flex justify-center p-8">
                <Spinner size="sm" />
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center gap-2 p-8">
                <MessageSquare className="h-8 w-8 text-faint" />
                <p className="text-sm font-medium text-foreground">No messages yet</p>
                <p className="text-xs text-muted">
                  Send a message below to say hi 👋
                </p>
              </div>
            ) : (
              messages.map((msg: Message) => {
                const isMe = msg.sender?._id === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={[
                        'max-w-xs rounded-xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-sm md:max-w-md',
                        isMe
                          ? 'bg-accent text-accent-foreground rounded-br-sm'
                          : 'bg-surface-2 text-foreground rounded-bl-sm',
                      ].join(' ')}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-faint px-1">
                      {formatMsgTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send error banner */}
          {sendError && (
            <div className="border-t border-danger/20 bg-danger/10 px-4 py-2 text-xs font-medium text-danger">
              {sendError}
            </div>
          )}

          {/* Message input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-border bg-surface px-4 py-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${otherUser?.displayName || otherUser?.username || ''}…`}
                maxLength={2000}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              <button
                type="submit"
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {sendMessageMutation.isPending ? (
                  <Spinner size="sm" className="text-accent-foreground" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-faint">
              Press <kbd className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send · <kbd className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[10px]">Shift+Enter</kbd> for new line
            </p>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden rounded-xl border border-border">
      {LeftPane}
      {RightPane}
    </div>
  );
};

export default ChatPage;
