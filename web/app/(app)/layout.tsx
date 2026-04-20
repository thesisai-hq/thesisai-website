'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { AppHeader } from '../../components/AppHeader';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/watchlist': 'Watchlist',
  '/watchlist/compare': 'Compare Stocks',
  '/portfolio': 'Portfolio',
  '/news': 'News',
  '/insights': 'Insights',
  '/ai': 'AI Chat',
  '/settings': 'Settings',
  '/settings/billing': 'Billing',
  '/onboarding': 'Get Started',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoading, isSignedIn, router]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <span className="app-loading-dot" />
        <style jsx>{`
          .app-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: var(--bg);
          }
          .app-loading-dot {
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

  if (!isSignedIn) return null;

  const stockMatch = pathname.match(/^\/stock\/([A-Z]{1,5})$/i);
  const title = stockMatch
    ? stockMatch[1].toUpperCase()
    : ROUTE_TITLES[pathname] ?? 'Thesis AI';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <AppHeader title={title} />
        <main className="app-content">{children}</main>
      </div>
      <style jsx>{`
        .app-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--bg);
        }
        .app-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        .app-content {
          flex: 1;
          min-height: 0;
          padding: 28px 32px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
