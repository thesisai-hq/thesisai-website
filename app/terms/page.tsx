import type { Metadata } from 'next';
import SiteNav from '../components/SiteNav';

export const metadata: Metadata = {
  title: 'Terms of Service — Thesis AI',
  description:
    'Terms of service governing use of Thesis AI products including the Thesis AI Platform and Long Hold iOS app.',
};

const tocSections = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'services', label: '2. Description of Services' },
  { id: 'platform-beta', label: '3. Platform Beta Terms' },
  { id: 'long-hold-billing', label: '4. Long Hold Billing' },
  { id: 'accounts', label: '5. Accounts' },
  { id: 'acceptable-use', label: '6. Acceptable Use' },
  { id: 'ip', label: '7. Intellectual Property' },
  { id: 'not-financial-advice', label: '8. Not Financial Advice' },
  { id: 'ai-content', label: '9. AI-Generated Content' },
  { id: 'privacy', label: '10. Privacy' },
  { id: 'disclaimers', label: '11. Disclaimers' },
  { id: 'liability', label: '12. Limitation of Liability' },
  { id: 'indemnification', label: '13. Indemnification' },
  { id: 'changes', label: '14. Changes to Terms' },
  { id: 'governing-law', label: '15. Governing Law' },
  { id: 'contact', label: '16. Contact' },
];

export default function TermsPage() {
  return (
    <main className="page">
      <SiteNav />

      {/* Page Header */}
      <div
        style={{
          background: 'var(--bg-soft)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '3.5rem 0 2.5rem',
        }}
      >
        <div className="section-wrap">
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
            <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Thesis AI
            </a>
            {' › Terms of Service'}
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.5rem' }}>
            Terms of Service
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Covers the Thesis AI Platform and Long Hold iOS app.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section-wrap" style={{ padding: '3rem 0 5rem' }}>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--muted)',
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          Effective date: April 28, 2026 &nbsp;·&nbsp; Last updated: April 28, 2026 &nbsp;·&nbsp;
          Thesis AI, Inc.
        </p>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Sticky TOC */}
          <nav
            className="tos-sidebar"
            style={{
              position: 'sticky',
              top: '2rem',
              width: '200px',
              flexShrink: 0,
              background: 'var(--bg-mid)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              padding: '1rem',
            }}
          >
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--muted)',
                marginBottom: '0.75rem',
              }}
            >
              Contents
            </p>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tocSections.map((s) => (
                <li key={s.id} style={{ marginBottom: '0.35rem' }}>
                  <a
                    href={`#${s.id}`}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--muted)',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                      display: 'block',
                    }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections — content added in next tasks */}
          <div style={{ flex: 1, minWidth: 0 }}>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer section-wrap">
        <p>© {new Date().getFullYear()} Thesis AI</p>
        <nav>
          <a href="/docs">Docs</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:hello@thesisai.app">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
