'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '../../../context/AuthContext';
// (auth) group — no sidebar/header wrapper

export default function SignInPage() {
  const { signIn, signInAsGuest, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    try {
      await signIn(email, password);
      posthog.identify(email.trim().toLowerCase(), { email: email.trim().toLowerCase() });
      posthog.capture('user_signed_in', { email: email.trim().toLowerCase(), method: 'email' });
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
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
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        <button
          className="auth-guest-btn"
          type="button"
          onClick={() => { signInAsGuest(); posthog.capture('user_signed_in', { method: 'guest' }); router.replace('/dashboard'); }}
        >
          Continue as Guest
        </button>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="auth-link">Sign up</Link>
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
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .auth-divider-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .auth-guest-btn {
          width: 100%;
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 11px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .auth-guest-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
        :global(.auth-link) { color: var(--accent); text-decoration: none; font-weight: 600; }
        :global(.auth-link:hover) { text-decoration: underline; }
      `}</style>
    </div>
  );
}
