'use client';

import type { ConversationSummary } from '../lib/api/conversations';

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ConversationSidebar({
  conversations,
  activeId,
  loading,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <div className="conv-sidebar">
      <button className="conv-new-btn" type="button" onClick={onNew}>
        + New Chat
      </button>

      <div className="conv-list">
        {loading && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="conv-skeleton" />
            ))}
          </>
        )}

        {!loading && conversations.length === 0 && (
          <p className="conv-empty">No conversations yet</p>
        )}

        {!loading &&
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conv-item${conv.id === activeId ? ' conv-item-active' : ''}`}
              onClick={() => onSelect(conv.id)}
              role="button"
            >
              <div className="conv-item-body">
                <span className="conv-item-title">{conv.title}</span>
                <span className="conv-item-date">{relativeDate(conv.updated_at)}</span>
              </div>
              <button
                type="button"
                className="conv-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                title="Delete conversation"
              >
                ×
              </button>
            </div>
          ))}
      </div>

      <style jsx>{`
        .conv-sidebar {
          width: 260px;
          flex-shrink: 0;
          border-right: 1px solid var(--border);
          background: var(--surface);
          overflow-y: auto;
          padding: 16px 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .conv-new-btn {
          width: 100%;
          padding: 9px 14px;
          background: rgba(59, 158, 255, 0.1);
          border: 1px solid rgba(59, 158, 255, 0.25);
          border-radius: 8px;
          color: var(--accent);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .conv-new-btn:hover {
          background: rgba(59, 158, 255, 0.18);
        }
        .conv-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-height: 0;
        }
        .conv-skeleton {
          height: 52px;
          border-radius: 8px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .conv-empty {
          font-size: 0.82rem;
          color: var(--text-muted);
          text-align: center;
          margin: 20px 0;
          padding: 0 8px;
        }
        .conv-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.12s;
          position: relative;
        }
        .conv-item:hover {
          background: var(--surface-2);
        }
        .conv-item-active {
          background: rgba(59, 158, 255, 0.12);
        }
        .conv-item-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .conv-item-title {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .conv-item-date {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .conv-delete-btn {
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 2px;
          line-height: 1;
          opacity: 0;
          transition: opacity 0.12s, color 0.12s;
        }
        .conv-item:hover .conv-delete-btn {
          opacity: 1;
        }
        .conv-delete-btn:hover {
          color: #f87171;
        }
      `}</style>
    </div>
  );
}
