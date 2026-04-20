'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserPreferences } from '../../../lib/api/preferences';
import { updatePreferences } from '../../../lib/api/preferences';

const TOTAL_STEPS = 9;

const GOAL_OPTIONS = [
  'Long-term growth',
  'Dividend income',
  'Swing trading',
  'Capital preservation',
  'Speculation',
];

const INTEREST_OPTIONS = [
  'Technology',
  'AI/ML',
  'Healthcare',
  'Energy',
  'Financials',
  'Consumer',
  'Industrials',
];

type Experience = 'novice' | 'intermediate' | 'expert';
type Risk = 'conservative' | 'balanced' | 'growth' | 'aggressive';
type Frequency = 'daily' | 'weekly' | 'monthly' | 'rarely';

function RadioPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="radio-pills">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`radio-pill${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      <style jsx>{`
        .radio-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .radio-pill {
          padding: 10px 22px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .radio-pill:hover {
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--text-primary);
        }
        .radio-pill.active {
          background: rgba(59, 158, 255, 0.14);
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function MultiSelectPills({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="multi-pills">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`multi-pill${selected.includes(opt) ? ' active' : ''}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
      <style jsx>{`
        .multi-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .multi-pill {
          padding: 10px 20px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .multi-pill:hover {
          border-color: rgba(59, 158, 255, 0.4);
          color: var(--text-primary);
        }
        .multi-pill.active {
          background: rgba(59, 158, 255, 0.14);
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function CalibrationStep({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const calledDone = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100 && !calledDone.current) {
        calledDone.current = true;
        clearInterval(interval);
        setTimeout(onDone, 200);
      }
    }, 30);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cal-step">
      <div className="cal-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="var(--border)" strokeWidth="2" />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
      </div>
      <p className="cal-label">Calibrating your AI…</p>
      <div className="cal-bar-wrap">
        <div className="cal-bar-track">
          <div className="cal-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="cal-pct">{Math.round(progress)}%</span>
      </div>
      <style jsx>{`
        .cal-step { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .cal-icon { margin-bottom: 4px; }
        .cal-label { font-size: 0.95rem; color: var(--text-muted); margin: 0; }
        .cal-bar-wrap { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 300px; }
        .cal-bar-track {
          flex: 1; height: 6px; background: var(--surface-2); border-radius: 6px; overflow: hidden;
          border: 1px solid var(--border);
        }
        .cal-bar-fill {
          height: 100%; background: var(--accent); border-radius: 6px;
          transition: width 0.05s linear;
        }
        .cal-pct { font-size: 0.75rem; color: var(--text-muted); min-width: 32px; }
      `}</style>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [experience, setExperience] = useState<Experience | null>(null);
  const [risk, setRisk] = useState<Risk | null>(null);
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleGoal(g: string) {
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }
  function toggleInterest(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  function canAdvance(): boolean {
    if (step === 2) return name.trim().length > 0;
    if (step === 3) return experience !== null;
    if (step === 4) return risk !== null;
    if (step === 5) return frequency !== null;
    if (step === 6) return goals.length > 0;
    if (step === 7) return interests.length > 0;
    return true;
  }

  async function handleComplete() {
    setSaving(true);
    try {
      const riskMap: Record<Risk, UserPreferences['risk_tolerance']> = {
        conservative: 'conservative',
        balanced: 'moderate',
        growth: 'aggressive',
        aggressive: 'aggressive',
      };
      const expMap: Record<Experience, UserPreferences['experience_level']> = {
        novice: 'beginner',
        intermediate: 'intermediate',
        expert: 'advanced',
      };
      const freqMap: Record<Frequency, UserPreferences['trading_frequency']> = {
        daily: 'daily',
        weekly: 'weekly',
        monthly: 'monthly',
        rarely: 'rarely',
      };
      await updatePreferences({
        risk_tolerance: risk ? riskMap[risk] : null,
        experience_level: experience ? expMap[experience] : null,
        trading_frequency: frequency ? freqMap[frequency] : null,
        goals,
        interests,
      });
    } catch {
      // non-blocking — proceed anyway
    } finally {
      setSaving(false);
      router.push('/dashboard');
    }
  }

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="ob-page">
      {/* Progress bar */}
      <div className="ob-progress-wrap">
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="ob-step-label">Step {step} of {TOTAL_STEPS}</span>
      </div>

      {/* Card */}
      <div className="ob-card">
        {/* Step content */}
        {step === 1 && (
          <div className="ob-step ob-step-center">
            <div className="ob-brand">
              <span className="ob-brand-main">Thesis</span>
              <span className="ob-brand-accent"> AI</span>
            </div>
            <h1 className="ob-title">Welcome to Thesis AI</h1>
            <p className="ob-sub">Let&apos;s personalize your experience</p>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">What&apos;s your name?</h2>
            <p className="ob-sub">We&apos;ll use this to personalize your AI advisor</p>
            <input
              className="ob-input"
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">Your experience level</h2>
            <p className="ob-sub">How familiar are you with investing?</p>
            <RadioPills<Experience>
              options={[
                { value: 'novice', label: 'Novice' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'expert', label: 'Expert' },
              ]}
              value={experience}
              onChange={setExperience}
            />
          </div>
        )}

        {step === 4 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">Risk tolerance</h2>
            <p className="ob-sub">How much risk are you comfortable with?</p>
            <RadioPills<Risk>
              options={[
                { value: 'conservative', label: 'Conservative' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'growth', label: 'Growth' },
                { value: 'aggressive', label: 'Aggressive' },
              ]}
              value={risk}
              onChange={setRisk}
            />
          </div>
        )}

        {step === 5 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">Trading frequency</h2>
            <p className="ob-sub">How often do you plan to trade?</p>
            <RadioPills<Frequency>
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'rarely', label: 'Rarely' },
              ]}
              value={frequency}
              onChange={setFrequency}
            />
          </div>
        )}

        {step === 6 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">Your investment goals</h2>
            <p className="ob-sub">Select all that apply</p>
            <MultiSelectPills
              options={GOAL_OPTIONS}
              selected={goals}
              onToggle={toggleGoal}
            />
          </div>
        )}

        {step === 7 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">Your interests</h2>
            <p className="ob-sub">Which sectors interest you most?</p>
            <MultiSelectPills
              options={INTEREST_OPTIONS}
              selected={interests}
              onToggle={toggleInterest}
            />
          </div>
        )}

        {step === 8 && (
          <div className="ob-step ob-step-center">
            <h2 className="ob-title">Almost there!</h2>
            <p className="ob-sub">We&apos;re calibrating your AI advisor</p>
            <CalibrationStep onDone={() => setStep(9)} />
          </div>
        )}

        {step === 9 && (
          <div className="ob-step ob-step-center">
            <div className="ob-complete-icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="26" fill="rgba(59,158,255,0.12)" stroke="var(--accent)" strokeWidth="2" />
                <path d="M18 28l8 8 12-14" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="ob-title">You&apos;re ready!</h2>
            <p className="ob-sub">Your AI advisor is calibrated{name ? ` for ${name}` : ''}.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="ob-nav">
          {step > 1 && step < 8 && (
            <button
              className="ob-back-btn"
              type="button"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
          <div className="ob-nav-spacer" />
          {step < 7 && (
            <button
              className={`ob-next-btn${canAdvance() ? '' : ' ob-next-disabled'}`}
              type="button"
              onClick={() => { if (canAdvance()) setStep((s) => s + 1); }}
              disabled={!canAdvance()}
            >
              {step === 1 ? 'Get Started' : 'Continue'}
            </button>
          )}
          {step === 7 && (
            <button
              className={`ob-next-btn${canAdvance() ? '' : ' ob-next-disabled'}`}
              type="button"
              onClick={() => { if (canAdvance()) setStep(8); }}
              disabled={!canAdvance()}
            >
              Continue
            </button>
          )}
          {step === 9 && (
            <button
              className="ob-next-btn"
              type="button"
              onClick={handleComplete}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Go to Dashboard'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .ob-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 24px;
          gap: 20px;
        }
        .ob-progress-wrap {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ob-progress-track {
          height: 4px;
          background: var(--surface-2);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .ob-progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .ob-step-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          align-self: flex-end;
        }
        .ob-card {
          width: 100%;
          max-width: 480px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .ob-step {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ob-step-center {
          align-items: center;
          text-align: center;
        }
        .ob-brand {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .ob-brand-main { color: var(--text-primary); }
        .ob-brand-accent { color: var(--accent); }
        .ob-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }
        .ob-sub {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0;
        }
        .ob-input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
          text-align: center;
        }
        .ob-input::placeholder { color: var(--text-muted); }
        .ob-input:focus { border-color: var(--accent); }
        .ob-complete-icon { margin-bottom: 4px; }
        .ob-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 8px;
          border-top: 1px solid var(--border);
        }
        .ob-nav-spacer { flex: 1; }
        .ob-back-btn {
          padding: 9px 20px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .ob-back-btn:hover {
          border-color: var(--text-muted);
          color: var(--text-primary);
        }
        .ob-next-btn {
          padding: 10px 28px;
          border-radius: 8px;
          background: var(--accent);
          border: none;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .ob-next-btn:disabled,
        .ob-next-disabled {
          opacity: 0.45;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
