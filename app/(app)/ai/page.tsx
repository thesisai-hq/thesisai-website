'use client';

import { useEffect, useState } from 'react';
import { AiChatPanel } from '../../../components/AiChatPanel';
import { ConversationSidebar } from '../../../components/ConversationSidebar';
import type { ConversationSummary, ChatMessageItem } from '../../../lib/api/conversations';
import {
  getConversations,
  getConversationMessages,
  deleteConversation,
} from '../../../lib/api/conversations';
import { getWatchlists } from '../../../lib/api/watchlist';

export default function AiPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [convLoading, setConvLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessageItem[] | undefined>();
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);

  useEffect(() => {
    void Promise.allSettled([
      getConversations()
        .then((r) => setConversations(r.items))
        .catch(() => {})
        .finally(() => setConvLoading(false)),
      getWatchlists()
        .then((wls) => setWatchlistSymbols(wls[0]?.items.map((i) => i.symbol) ?? []))
        .catch(() => {}),
    ]);
  }, []);

  async function handleSelectConversation(id: string) {
    setActiveConvId(id);
    setMessagesLoading(true);
    try {
      const data = await getConversationMessages(id);
      setInitialMessages(data.messages);
    } catch {
      setInitialMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }

  function handleNewChat() {
    setActiveConvId(null);
    setInitialMessages(undefined);
  }

  function handleConversationCreated(id: string) {
    setActiveConvId(id);
    // Reload conversation list to include the new one
    getConversations()
      .then((r) => setConversations(r.items))
      .catch(() => {});
  }

  async function handleDeleteConversation(id: string) {
    try {
      await deleteConversation(id);
    } catch { /* best-effort */ }
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      handleNewChat();
    }
  }

  return (
    <div className="ai-page">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConvId}
        loading={convLoading}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
      />
      <div className="ai-chat-area">
        {messagesLoading ? (
          <div className="ai-loading">
            <span className="ai-loading-dot" />
          </div>
        ) : (
          <AiChatPanel
            conversationId={activeConvId ?? undefined}
            initialMessages={initialMessages}
            onConversationCreated={handleConversationCreated}
            symbols={watchlistSymbols}
          />
        )}
      </div>

      <style jsx>{`
        .ai-page {
          display: flex;
          height: calc(100vh - 56px - 56px);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .ai-chat-area {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .ai-loading {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
