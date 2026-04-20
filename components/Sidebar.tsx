'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" />
      <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" />
      <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" />
      <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function IconWatchlist() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 9C1.5 9 4.5 3.5 9 3.5C13.5 3.5 16.5 9 16.5 9C16.5 9 13.5 14.5 9 14.5C4.5 14.5 1.5 9 1.5 9Z" />
      <circle cx="9" cy="9" r="2.5" />
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="10" width="4" height="6.5" rx="1" />
      <rect x="7" y="6.5" width="4" height="9.5" rx="1" />
      <rect x="12.5" y="2.5" width="4" height="13.5" rx="1" />
    </svg>
  );
}

function IconNews() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2.5" width="14" height="13" rx="2" />
      <line x1="5" y1="7" x2="13" y2="7" />
      <line x1="5" y1="10.5" x2="13" y2="10.5" />
    </svg>
  );
}

function IconInsights() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2.5H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-2" />
      <path d="M7 1.5h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" />
      <line x1="5" y1="8" x2="13" y2="8" />
      <line x1="5" y1="11.5" x2="10" y2="11.5" />
    </svg>
  );
}

function IconAiChat() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 2.5H2.5C1.95 2.5 1.5 2.95 1.5 3.5V12.5C1.5 13.05 1.95 13.5 2.5 13.5H6L9 16.5L12 13.5H15.5C16.05 13.5 16.5 13.05 16.5 12.5V3.5C16.5 2.95 16.05 2.5 15.5 2.5Z" />
      <line x1="5" y1="7" x2="13" y2="7" />
      <line x1="5" y1="10" x2="10" y2="10" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.45 3.45l1.42 1.42M13.13 13.13l1.42 1.42M14.55 3.45l-1.42 1.42M4.87 13.13l-1.42 1.42" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3.2" />
      <line x1="9" y1="1.5" x2="9" y2="3" />
      <line x1="9" y1="15" x2="9" y2="16.5" />
      <line x1="1.5" y1="9" x2="3" y2="9" />
      <line x1="15" y1="9" x2="16.5" y2="9" />
      <line x1="3.93" y1="3.93" x2="4.99" y2="4.99" />
      <line x1="13.01" y1="13.01" x2="14.07" y2="14.07" />
      <line x1="14.07" y1="3.93" x2="13.01" y2="4.99" />
      <line x1="4.99" y1="13.01" x2="3.93" y2="14.07" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 10.5A7 7 0 0 1 7.5 2.5a7 7 0 1 0 8 8z" />
    </svg>
  );
}

function IconSignOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4" />
      <polyline points="12 13 17 9 12 5" />
      <line x1="17" y1="9" x2="7" y2="9" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10 3 5 8 10 13" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 3 11 8 6 13" />
    </svg>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────

type NavItem = { href: string; label: string; Icon: () => React.ReactElement };

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { href: '/watchlist', label: 'Watchlist', Icon: IconWatchlist },
  { href: '/portfolio', label: 'Portfolio', Icon: IconPortfolio },
  { href: '/news', label: 'News', Icon: IconNews },
  { href: '/insights', label: 'Insights', Icon: IconInsights },
  { href: '/ai', label: 'AI Chat', Icon: IconAiChat },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: '/settings', label: 'Settings', Icon: IconSettings },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    if (stored === 'true') setCollapsed(true);
    setMounted(true);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
  }

  function handleSignOut() {
    signOut();
    router.push('/sign-in');
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'AI';

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  function renderLink(item: NavItem) {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`nav-link${active ? ' nav-link-active' : ''}${collapsed ? ' nav-link-icon-only' : ''}`}
        title={collapsed ? item.label : undefined}
      >
        <span className={`nav-icon${active ? ' nav-icon-active' : ''}`}>
          <item.Icon />
        </span>
        {!collapsed && <span className="nav-label">{item.label}</span>}
        {active && !collapsed && <span className="nav-pip" />}
      </Link>
    );
  }

  const sidebarWidth = !mounted ? 224 : collapsed ? 68 : 224;

  return (
    <aside className="sidebar" style={{ width: sidebarWidth }}>
      {/* Brand */}
      <div className={`sidebar-brand${collapsed ? ' sidebar-brand-collapsed' : ''}`}>
        <div className="brand-mark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <defs>
              <linearGradient id="brand-grad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b9eff" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <rect width="20" height="20" rx="6" fill="url(#brand-grad)" />
            <path d="M6 13 L10 7 L14 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M7.5 10.5h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <span className="brand-text">
            Thesis<span className="brand-accent"> AI</span>
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {NAV_ITEMS.map(renderLink)}
        </div>
        <div className="sidebar-spacer" />
        <div className="nav-section">
          {BOTTOM_NAV_ITEMS.map(renderLink)}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-divider" />
      <div className={`sidebar-footer${collapsed ? ' sidebar-footer-collapsed' : ''}`}>
        {!collapsed ? (
          <>
            <div className="user-card">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <span className="user-email" title={user?.email ?? ''}>{user?.email ?? 'Guest'}</span>
                <span className="user-role">Investor</span>
              </div>
              <button className="collapse-btn" onClick={toggleCollapse} title="Collapse sidebar">
                <IconChevronLeft />
              </button>
            </div>
            <div className="footer-actions">
              <button
                className="footer-action-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <IconSun /> : <IconMoon />}
                <span className="footer-action-label">
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </span>
              </button>
              <button
                className="footer-action-btn footer-action-signout"
                onClick={handleSignOut}
                title="Sign out"
              >
                <IconSignOut />
                <span className="footer-action-label">Sign out</span>
              </button>
            </div>
          </>
        ) : (
          <div className="footer-collapsed">
            <div className="user-avatar user-avatar-sm">{initials}</div>
            <button
              className="collapse-btn-icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <button className="collapse-btn-icon" onClick={toggleCollapse} title="Expand sidebar">
              <IconChevronRight />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .sidebar {
          min-height: 100vh;
          background: var(--bg-soft);
          border-right: 1px solid rgba(103, 129, 156, 0.14);
          display: flex;
          flex-direction: column;
          padding: 20px 0 16px;
          flex-shrink: 0;
          transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        /* Brand */
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px 0;
          margin-bottom: 16px;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-brand-collapsed {
          justify-content: center;
          padding: 0;
        }
        .brand-mark {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .brand-text {
          font-size: 1.08rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .brand-accent {
          color: var(--accent);
        }

        /* Divider */
        .sidebar-divider {
          height: 1px;
          background: rgba(103, 129, 156, 0.12);
          margin: 0 12px;
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px 10px 10px;
          gap: 2px;
          overflow: hidden;
        }
        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .sidebar-spacer {
          flex: 1;
        }
        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 9px;
          font-size: 0.83rem;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition: background 0.12s ease, color 0.12s ease;
          white-space: nowrap;
          overflow: hidden;
          letter-spacing: 0.005em;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }
        .nav-link-active {
          background: rgba(59, 158, 255, 0.1);
          color: var(--text-primary);
          font-weight: 600;
        }
        .nav-link-active:hover {
          background: rgba(59, 158, 255, 0.14);
        }
        .nav-link-icon-only {
          justify-content: center;
          padding: 9px 0;
        }

        /* Icon container */
        .nav-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.12s ease;
          background: transparent;
        }
        .nav-link:hover .nav-icon {
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-icon-active {
          background: rgba(59, 158, 255, 0.14);
          color: var(--accent);
        }
        .nav-link-active:hover .nav-icon-active {
          background: rgba(59, 158, 255, 0.2);
        }

        .nav-label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Active pip */
        .nav-pip {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          opacity: 0.8;
        }

        /* Footer */
        .sidebar-footer {
          padding: 12px 10px 0;
        }
        .sidebar-footer-collapsed {
          padding: 12px 0 0;
        }
        .user-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(103, 129, 156, 0.12);
          overflow: hidden;
        }
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(59,158,255,0.25), rgba(167,139,250,0.2));
          border: 1px solid rgba(59, 158, 255, 0.2);
          color: var(--accent);
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }
        .user-avatar-sm {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          font-size: 0.65rem;
        }
        .user-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .user-email {
          font-size: 0.73rem;
          font-weight: 500;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user-role {
          font-size: 0.65rem;
          color: var(--text-muted);
          opacity: 0.7;
        }
        .collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: none;
          border: 1px solid rgba(103, 129, 156, 0.15);
          color: var(--text-muted);
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.12s, color 0.12s, border-color 0.12s;
        }
        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
          border-color: rgba(103, 129, 156, 0.3);
        }
        .footer-collapsed {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0 0 0;
        }
        .collapse-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(103, 129, 156, 0.12);
          color: var(--text-muted);
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .collapse-btn-icon:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
        }

        /* Footer action row */
        .footer-actions {
          display: flex;
          gap: 4px;
          margin-top: 6px;
        }
        .footer-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 8px;
          border-radius: 8px;
          background: none;
          border: 1px solid rgba(103, 129, 156, 0.12);
          color: var(--text-muted);
          font-size: 0.71rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.12s, color 0.12s, border-color 0.12s;
          white-space: nowrap;
          overflow: hidden;
          font-family: inherit;
        }
        .footer-action-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border-color: rgba(103, 129, 156, 0.25);
        }
        .footer-action-signout:hover {
          color: #f87171;
          border-color: rgba(248, 113, 113, 0.3);
          background: rgba(248, 113, 113, 0.06);
        }
        .footer-action-label {
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
      `}</style>
    </aside>
  );
}
