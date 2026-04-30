'use client';

import { useState } from 'react';

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar section-wrap">
      {/* Logo → / */}
      <a
        href="/"
        className="brand"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <img
          src="/branding/Light mode-Thesis AI Logo - transparent.png"
          alt="Thesis AI logo"
          className="brand-logo"
        />
        <span>Thesis AI</span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Products dropdown */}
        <div
          style={{ position: 'relative', paddingBottom: '8px' }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 4px',
              fontFamily: 'inherit',
            }}
          >
            Products{' '}
            <span
              style={{
                fontSize: '0.6rem',
                transition: 'transform 0.15s',
                transform: open ? 'rotate(180deg)' : 'none',
                display: 'inline-block',
              }}
            >
              ▾
            </span>
          </button>

          {open && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-soft)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '6px',
                minWidth: '210px',
                boxShadow: '0 16px 40px -12px rgba(0,0,0,0.5)',
                zIndex: 50,
              }}
            >
              <a
                href="/#platform"
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    'var(--glass)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'none')
                }
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}
                >
                  Thesis AI Platform
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  AI Research · In Beta
                </div>
              </a>
              <a
                href="/long-hold"
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    'var(--glass)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'none')
                }
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}
                >
                  Long Hold
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  iOS App · Available Now
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Dashboard */}
        <a
          href="/dashboard"
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
            padding: '7px 16px',
            border: '1px solid rgba(59,158,255,0.4)',
            borderRadius: '8px',
            transition: 'background 0.15s',
          }}
        >
          Dashboard →
        </a>

        {/* Request Access CTA */}
        <a className="cta cta-small" href="/#waitlist">
          Request Access
        </a>
      </div>
    </header>
  );
}
