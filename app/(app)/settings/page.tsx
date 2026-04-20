'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserPreferences } from '../../../lib/api/preferences';
import { getPreferences, updatePreferences } from '../../../lib/api/preferences';
import { useAuth } from '../../../context/AuthContext';
import {
  clearActions,
  formatRelativeTime,
  getRecentActions,
} from '../../../lib/utils/actionTracker';
import type { ActionEvent } from '../../../lib/utils/actionTracker';

const DEFAULT_PREFS: UserPreferences = {
  risk_tolerance: null,
  experience_level: null,
  trading_frequency: null,
  goals: [],
  interests: [],
};

const GOAL_OPTIONS = [
  'Long-term growth',
  'Dividend income',
  'Swing trading',
  'Capital preservation',
  'Speculation',
];

const AI_AGENTS = [
  'Fundamentals',
  'Price Trend',
  'News',
  'Macro',
  'Portfolio',
];

type RiskOption = 'conservative' | 'moderate' | 'aggressive';
type ExperienceOption = 'beginner' | 'intermediate' | 'advanced';
type FrequencyOption = 'daily' | 'weekly' | 'monthly' | 'rarely';

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="pref-field">
      <span className="pref-field-label">{label}</span>
      <div className="pref-pills">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`pref-pill${value === opt.value ? ' pref-pill-active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <style jsx>{`
        .pref-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pref-field-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .pref-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pref-pill {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pref-pill:hover {
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--text-primary);
        }
        .pref-pill-active {
          background: rgba(59, 158, 255, 0.12);
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Agents section
  const [showAgentDetails, setShowAgentDetails] = useState(false);

  // Activity log section
  const [actions, setActions] = useState<ActionEvent[]>([]);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    getPreferences()
      .then(setPrefs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setActions(getRecentActions(10));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedAt(null);
    try {
      const updated = await updatePreferences(prefs);
      setPrefs(updated);
      setSavedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  function toggleGoal(goal: string) {
    setPrefs((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  }

  function handleClearActivity() {
    clearActions();
    setActions([]);
    forceUpdate((n) => n + 1);
  }

  function handleSignOut() {
    signOut();
    router.replace('/sign-in');
  }

  if (loading) {
    return (
      <div className="settings-page">
        <div className="skel-block" />
        <div className="skel-block" />
        <style jsx>{`
          .settings-page { display: flex; flex-direction: column; gap: 20px; max-width: 720px; }
          .skel-block {
            height: 200px;
            border-radius: 12px;
            background: var(--surface);
            border: 1px solid var(--border);
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  const savedTime = savedAt
    ? savedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="settings-page">
      {/* Section 1: Trading Profile */}
      <div className="settings-card">
        <h2 className="settings-card-title">Trading Profile</h2>

        <RadioGroup<RiskOption>
          label="Risk Tolerance"
          options={[
            { value: 'conservative', label: 'Conservative' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'aggressive', label: 'Aggressive' },
          ]}
          value={prefs.risk_tolerance}
          onChange={(v) => setPrefs((p) => ({ ...p, risk_tolerance: v }))}
        />

        <RadioGroup<ExperienceOption>
          label="Experience Level"
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
          value={prefs.experience_level}
          onChange={(v) => setPrefs((p) => ({ ...p, experience_level: v }))}
        />

        <RadioGroup<FrequencyOption>
          label="Trading Frequency"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'rarely', label: 'Rarely' },
          ]}
          value={prefs.trading_frequency}
          onChange={(v) => setPrefs((p) => ({ ...p, trading_frequency: v }))}
        />
      </div>

      {/* Section 2: Interests & Goals */}
      <div className="settings-card">
        <h2 className="settings-card-title">Interests &amp; Goals</h2>
        <div className="pref-field">
          <span className="pref-field-label">Goals</span>
          <div className="pref-pills">
            {GOAL_OPTIONS.map((goal) => (
              <button
                key={goal}
                type="button"
                className={`pref-pill${prefs.goals.includes(goal) ? ' pref-pill-active' : ''}`}
                onClick={() => toggleGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save row */}
      <div className="settings-save-row">
        {savedTime && (
          <span className="settings-saved">Saved at {savedTime}</span>
        )}
        {error && (
          <span className="settings-error">{error}</span>
        )}
        <button
          type="button"
          className="settings-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>

      {/* Section 3: AI Agents */}
      <div className="settings-card">
        <h2 className="settings-card-title">AI Agents</h2>
        <div className="agent-toggle-row">
          <span className="agent-toggle-label">Show AI routing details</span>
          <button
            type="button"
            className={`toggle-switch${showAgentDetails ? ' toggle-on' : ''}`}
            onClick={() => setShowAgentDetails((v) => !v)}
            role="switch"
            aria-checked={showAgentDetails}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {showAgentDetails && (
          <div className="agent-details">
            <p className="agent-desc">
              Your queries are routed to specialized agents: Fundamentals, Price Trend, News, Macro, Portfolio
            </p>
            <div className="agent-pills">
              {AI_AGENTS.map((agent) => (
                <span key={agent} className="agent-pill">{agent}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Activity Log */}
      <div className="settings-card">
        <h2 className="settings-card-title">Recent Activity</h2>
        {actions.length === 0 ? (
          <p className="activity-empty">No recent activity</p>
        ) : (
          <div className="activity-list">
            {actions.map((action) => (
              <div key={action.id} className="activity-row">
                <span className="activity-dot">●</span>
                <span className="activity-name">{action.name}</span>
                <span className="activity-time">{formatRelativeTime(action.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          className="activity-clear-btn"
          onClick={handleClearActivity}
        >
          Clear Activity
        </button>
      </div>

      {/* Section 5: Plan & Billing */}
      <div className="settings-card">
        <h2 className="settings-card-title">Plan &amp; Billing</h2>
        <div className="billing-row">
          <span className="billing-label">Current Plan</span>
          <span className="billing-badge">Beta Access</span>
        </div>
        <a className="billing-manage-link" href="/settings/billing">
          Manage Subscription
        </a>
        <button
          type="button"
          className="signout-btn"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      <style jsx>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 720px;
        }
        .settings-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .settings-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .pref-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pref-field-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .pref-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pref-pill {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pref-pill:hover {
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--text-primary);
        }
        .pref-pill-active {
          background: rgba(59, 158, 255, 0.12);
          border-color: var(--accent);
          color: var(--accent);
        }
        .settings-save-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
        }
        .settings-saved {
          font-size: 0.82rem;
          color: var(--success, #2db48d);
        }
        .settings-error {
          font-size: 0.82rem;
          color: #f87171;
        }
        .settings-save-btn {
          padding: 9px 22px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .settings-save-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }

        /* AI Agents section */
        .agent-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .agent-toggle-label {
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .toggle-switch {
          position: relative;
          width: 40px;
          height: 22px;
          border-radius: 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          flex-shrink: 0;
          padding: 0;
        }
        .toggle-switch.toggle-on {
          background: var(--accent);
          border-color: var(--accent);
        }
        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s;
        }
        .toggle-switch.toggle-on .toggle-thumb {
          transform: translateX(18px);
        }
        .agent-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
          background: var(--surface-2);
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .agent-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .agent-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .agent-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 10px;
          background: rgba(59, 158, 255, 0.1);
          color: var(--accent);
          border: 1px solid rgba(59, 158, 255, 0.25);
        }

        /* Activity Log */
        .activity-empty {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0;
          text-align: center;
          padding: 12px 0;
        }
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .activity-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        .activity-dot {
          font-size: 0.5rem;
          color: var(--accent);
          flex-shrink: 0;
        }
        .activity-name {
          flex: 1;
          font-size: 0.825rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .activity-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .activity-clear-btn {
          align-self: flex-start;
          padding: 6px 14px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .activity-clear-btn:hover {
          border-color: #f87171;
          color: #f87171;
        }

        /* Plan & Billing */
        .billing-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .billing-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .billing-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 10px;
          background: rgba(59, 158, 255, 0.12);
          color: var(--accent);
          border: 1px solid rgba(59, 158, 255, 0.25);
        }
        .billing-manage-link {
          display: inline-block;
          font-size: 0.875rem;
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.15s;
        }
        .billing-manage-link:hover { opacity: 0.75; }
        .signout-btn {
          align-self: flex-start;
          padding: 8px 20px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid #f87171;
          color: #f87171;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .signout-btn:hover {
          background: rgba(248, 113, 113, 0.1);
          color: #fca5a5;
        }
      `}</style>
    </div>
  );
}
