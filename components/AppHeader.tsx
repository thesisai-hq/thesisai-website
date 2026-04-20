'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push('/sign-in');
  }

  return (
    <header className="app-header">
      <h1 className="app-header-title">{title}</h1>
      <div className="app-header-right">
        {user && (
          <span className="app-header-email">{user.email}</span>
        )}
        <button className="app-header-signout" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <style jsx>{`
        .app-header {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          flex-shrink: 0;
        }
        .app-header-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .app-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .app-header-email {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .app-header-signout {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 4px 10px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .app-header-signout:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
      `}</style>
    </header>
  );
}
