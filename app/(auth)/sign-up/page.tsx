'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '../../../context/AuthContext';
// (auth) group — no sidebar/header wrapper

export default function SignUpPage() {
  const { signUp, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    try {
      await signUp(email, password);
      posthog.identify(email.trim().toLowerCase(), { email: email.trim().toLowerCase() });
      posthog.capture('user_signed_up', { email: email.trim().toLowerCase() });
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      posthog.captureException(err);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">Thesis</span>
          <span className="auth-logo-accent"> AI</span>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start getting AI-powered market insights today</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/sign-in" className="auth-link">Sign in</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 24px;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-brand {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .auth-logo { color: var(--text-primary); }
        .auth-logo-accent { color: var(--accent); }
        .auth-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
        }
        .auth-sub {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0 0 20px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 14px; }
        .auth-field { display: flex; flex-direction: column; gap: 6px; }
        .auth-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
        .auth-input {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.15s;
        }
        .auth-input:focus { border-color: var(--accent); }
        .auth-error { font-size: 0.8rem; color: #f87171; margin: 0; }
        .auth-btn {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 4px;
          transition: opacity 0.15s;
        }
        .auth-btn:disabled { opacity: 0.6; cursor: default; }
        .auth-footer {
          font-size: 0.825rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 12px;
        }
        :global(.auth-link) { color: var(--accent); text-decoration: none; font-weight: 600; }
        :global(.auth-link:hover) { text-decoration: underline; }
      `}</style>
    </div>
  );
}
