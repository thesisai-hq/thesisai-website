'use client';

import { useRouter } from 'next/navigation';
import type { UserPreferences } from '../lib/api/preferences';
import { getSuggestedPrompts } from '../lib/utils/aiPersonalization';

interface PersonalizedSuggestionsProps {
  prefs: UserPreferences | null;
}

export function PersonalizedSuggestions({ prefs }: PersonalizedSuggestionsProps) {
  const router = useRouter();

  const prompts = getSuggestedPrompts(
    prefs
      ? {
          experience_level: prefs.experience_level,
          risk_tolerance: prefs.risk_tolerance,
          interests: prefs.interests,
        }
      : null,
  ).slice(0, 3);

  return (
    <div className="ps-wrap">
      <span className="ps-label">Quick asks</span>
      <div className="ps-pills">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            className="ps-pill"
            onClick={() => router.push(`/ai?q=${encodeURIComponent(prompt)}`)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <style jsx>{`
        .ps-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ps-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .ps-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ps-pill {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-primary);
          background: var(--surface);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: border-color 150ms ease, background 150ms ease, color 150ms ease;
          white-space: nowrap;
        }
        .ps-pill:hover {
          border-color: rgba(59, 158, 255, 0.45);
          background: rgba(59, 158, 255, 0.08);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
