'use client';

import { useEffect, useRef, useState } from 'react';
import type { AiMessage } from '../lib/api/ai';
import { streamChat } from '../lib/api/ai';
import type { ChatMessageItem } from '../lib/api/conversations';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatPanelProps {
  conversationId?: string;
  initialMessages?: ChatMessageItem[];
  onConversationCreated?: (id: string) => void;
  symbols?: string[];
}

export function AiChatPanel({
  conversationId: conversationIdProp,
  initialMessages,
  onConversationCreated,
  symbols,
}: AiChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(conversationIdProp);
  const [dismissedSymbols, setDismissedSymbols] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset messages when conversation switches
  useEffect(() => {
    if (initialMessages !== undefined) {
      setMessages(
        initialMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      );
    } else {
      setMessages([]);
    }
    setConversationId(conversationIdProp);
  }, [initialMessages, conversationIdProp]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStreaming(true);

    const activeSymbols = symbols?.filter((s) => !dismissedSymbols.has(s)) ?? [];

    try {
      const history: AiMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      history.push({ role: 'user', content: text });

      // Placeholder for the streaming assistant message
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let convIdSet = false;

      for await (const chunk of streamChat({
        messages: history,
        conversation_id: conversationId,
        symbols: activeSymbols.length > 0 ? activeSymbols : undefined,
      })) {
        if (chunk.conversation_id && !convIdSet) {
          convIdSet = true;
          setConversationId(chunk.conversation_id);
          onConversationCreated?.(chunk.conversation_id);
        }
        if (chunk.delta) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk.delta,
              };
            }
            return updated;
          });
        }
      }

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Request failed';
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'assistant' && last.content === '') {
          updated[updated.length - 1] = { role: 'assistant', content: `Error: ${errMsg}` };
        } else {
          updated.push({ role: 'assistant', content: `Error: ${errMsg}` });
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  const visibleSymbols = symbols?.filter((s) => !dismissedSymbols.has(s)) ?? [];

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="chat-empty-title">Ask Thesis AI anything</p>
            <p className="chat-empty-sub">
              Market analysis, portfolio questions, macro outlook — just ask.
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isLastAssistant =
            msg.role === 'assistant' && i === messages.length - 1 && streaming;
          return (
            <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
              <span className="chat-msg-label">{msg.role === 'user' ? 'You' : 'Thesis AI'}</span>
              <p className={`chat-msg-content${isLastAssistant ? ' chat-msg-streaming' : ''}`}>
                {msg.content}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {visibleSymbols.length > 0 && (
        <div className="chat-symbols">
          <span className="chat-symbols-label">Context:</span>
          {visibleSymbols.map((sym) => (
            <span key={sym} className="chat-symbol-chip">
              {sym}
              <button
                type="button"
                className="chat-symbol-dismiss"
                onClick={() =>
                  setDismissedSymbols((prev) => new Set([...prev, sym]))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          className="chat-input"
          type="text"
          placeholder="Ask about your portfolio, watchlist, market conditions…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
        />
        <button className="chat-send" type="submit" disabled={streaming || !input.trim()}>
          Send
        </button>
      </form>

      <style jsx>{`
        .chat-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
        }
        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 8px;
          text-align: center;
        }
        .chat-empty-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .chat-empty-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
          max-width: 340px;
        }
        .chat-msg {
          display: flex;
          flex-direction: column;
          gap: 5px;
          max-width: 75%;
        }
        .chat-msg-user { align-self: flex-end; align-items: flex-end; }
        .chat-msg-assistant { align-self: flex-start; }
        .chat-msg-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .chat-msg-content {
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .chat-msg-user .chat-msg-content {
          background: var(--accent);
          color: #fff;
          border-radius: 10px 10px 2px 10px;
        }
        .chat-msg-assistant .chat-msg-content {
          background: var(--surface-2);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: 10px 10px 10px 2px;
        }
        .chat-msg-streaming::after {
          content: '▋';
          animation: blink 1s step-end infinite;
          color: var(--accent);
          margin-left: 2px;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .chat-symbols {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          padding: 8px 20px;
          border-top: 1px solid var(--border);
          background: var(--surface);
        }
        .chat-symbols-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
          flex-shrink: 0;
        }
        .chat-symbol-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent);
          background: rgba(59, 158, 255, 0.1);
          border: 1px solid rgba(59, 158, 255, 0.25);
          border-radius: 4px;
          padding: 2px 6px;
        }
        .chat-symbol-dismiss {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.85rem;
          padding: 0;
          line-height: 1;
        }
        .chat-symbol-dismiss:hover { color: var(--text-primary); }
        .chat-input-row {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid var(--border);
          background: var(--surface);
          flex-shrink: 0;
        }
        .chat-input {
          flex: 1;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
        }
        .chat-input:focus { border-color: var(--accent); }
        .chat-input:disabled { opacity: 0.6; }
        .chat-send {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .chat-send:disabled { opacity: 0.4; cursor: default; }
      `}</style>
    </div>
  );
}
