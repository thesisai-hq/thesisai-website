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

          {/* Sections */}
          <div style={{ flex: 1, minWidth: 0 }}>

            <section id="acceptance" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                By accessing or using the Thesis AI website, Thesis AI Platform, or Long Hold iOS app
                (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of
                Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the
                Services. These Terms apply to all users, including visitors, registered users, and
                subscribers.
              </p>
            </section>

            <section id="services" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                2. Description of Services
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Thesis AI, Inc. (&ldquo;Thesis AI,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) operates two products:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text)' }}>Thesis AI Platform</strong> — a web and
                  iOS application that uses AI to synthesize investment research from macro data,
                  fundamentals, news, and price action into a clear, portfolio-aware thesis.
                </li>
                <li>
                  <strong style={{ color: 'var(--text)' }}>Long Hold</strong> — an iOS app for
                  tracking investment contributions, building savings discipline, and visualizing
                  long-term compound growth.
                </li>
              </ul>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: '0.75rem', margin: 0 }}>
                Each product may be subject to the additional product-specific terms described below.
              </p>
            </section>

            <section id="platform-beta" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                3. Thesis AI Platform — Beta Terms
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                The Thesis AI Platform is currently in private beta and available by invitation only.
                During the beta period:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  Access may be modified, suspended, or discontinued at any time without notice.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  We do not guarantee uptime, availability, or data persistence.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Features, outputs, and pricing are subject to change before general release.
                </li>
                <li>
                  Beta access does not create any obligation for Thesis AI to provide a
                  production-ready service or any specific functionality.
                </li>
              </ul>
            </section>

            <section id="long-hold-billing" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                4. Long Hold — App Store Billing
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Long Hold Pro subscriptions are purchased and managed exclusively through
                Apple&apos;s App Store. By subscribing:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  All billing, renewals, and refunds are handled by Apple and governed by
                  Apple&apos;s{' '}
                  <a
                    href="https://www.apple.com/legal/internet-services/itunes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)' }}
                  >
                    Media Services Terms and Conditions
                  </a>
                  .
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Thesis AI does not process or store payment information.
                </li>
                <li>
                  To cancel or manage your subscription, use your Apple ID account settings.
                  Thesis AI cannot issue refunds for App Store purchases.
                </li>
              </ul>
            </section>

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
