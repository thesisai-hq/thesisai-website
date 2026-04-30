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

            <section id="accounts" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>5. Accounts</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                To access certain features you must create an account using accurate, complete
                information. You are responsible for:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  Maintaining the confidentiality of your credentials.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  All activity that occurs under your account.
                </li>
                <li>
                  Notifying us immediately at{' '}
                  <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
                    support@thesisai.app
                  </a>{' '}
                  if you suspect unauthorized access.
                </li>
              </ul>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: '0.75rem', margin: 0 }}>
                We reserve the right to suspend or terminate accounts that violate these Terms or
                that we reasonably believe pose a risk to Thesis AI or other users.
              </p>
            </section>

            <section id="acceptable-use" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>6. Acceptable Use</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                You agree not to:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  Use the Services for any unlawful purpose or in violation of any applicable law.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Scrape, crawl, or programmatically extract data from the Services without prior
                  written permission.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Attempt to gain unauthorized access to any part of the Services or their
                  underlying infrastructure.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Impersonate any person, entity, or Thesis AI employee.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Upload or transmit malicious code, viruses, or any software intended to damage
                  the Services.
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the Services.
                </li>
              </ul>
            </section>

            <section id="ip" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                7. Intellectual Property
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                The Services — including all software, design, text, and AI-generated outputs — are
                owned by Thesis AI and protected by applicable intellectual property laws. You retain
                ownership of any personal data you submit.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                AI-generated research outputs are licensed to you for personal, non-commercial use
                only. You may not redistribute, resell, or publish outputs without prior written
                consent from Thesis AI.
              </p>
            </section>

            <section id="not-financial-advice" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                8. Not Financial Advice
              </h2>
              <p
                style={{
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  marginBottom: '0.75rem',
                  fontWeight: 600,
                }}
              >
                THE THESIS AI PLATFORM PROVIDES RESEARCH ASSISTANCE AND INFORMATIONAL CONTENT ONLY.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Nothing on the Platform constitutes personalized investment advice, a recommendation
                to buy or sell any security, or the provision of investment advisory services. Thesis
                AI is not a registered investment adviser under the Investment Advisers Act of 1940
                or any state law.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                Always consult a qualified financial professional before making any investment
                decision. Past performance of any security or strategy discussed on the Platform
                does not guarantee future results.
              </p>
            </section>

            <section id="ai-content" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                9. AI-Generated Content
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Research outputs on the Thesis AI Platform are generated by AI models. Thesis AI
                does not guarantee the accuracy, completeness, timeliness, or fitness for any
                purpose of AI-generated content. Outputs may be incomplete, outdated, or incorrect.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                You assume full responsibility for evaluating AI-generated content and for any
                investment decisions you make based on it.
              </p>
            </section>

            <section id="privacy" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>10. Privacy</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                Our collection and use of personal information is governed by our{' '}
                <a href="/privacy" style={{ color: 'var(--accent)' }}>
                  Privacy Policy
                </a>
                . By using the Services, you consent to the data practices described in the Privacy
                Policy.
              </p>
            </section>

            <section id="disclaimers" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>11. Disclaimers</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
                SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER
                HARMFUL COMPONENTS.
              </p>
            </section>

            <section id="liability" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                12. Limitation of Liability
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THESIS AI&apos;S TOTAL LIABILITY
                TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICES SHALL NOT EXCEED THE
                GREATER OF (A) THE AMOUNTS YOU PAID TO THESIS AI IN THE TWELVE MONTHS PRECEDING THE
                CLAIM OR (B) ONE HUNDRED DOLLARS ($100).
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                IN NO EVENT SHALL THESIS AI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR
                GOODWILL, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section id="indemnification" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>13. Indemnification</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                You agree to indemnify, defend, and hold harmless Thesis AI and its officers,
                directors, employees, and agents from any claims, damages, losses, liabilities, or
                expenses (including reasonable attorneys&apos; fees) arising from your use of the
                Services, your violation of these Terms, or your infringement of any third-party
                rights.
              </p>
            </section>

            <section id="changes" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>14. Changes to Terms</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                We may update these Terms at any time. If we make material changes, we will notify
                you by email or through the Services at least 14 days before the changes take
                effect. Continued use of the Services after the effective date constitutes acceptance
                of the updated Terms. The current effective date is always shown at the top of this
                page.
              </p>
            </section>

            <section id="governing-law" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>15. Governing Law</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                These Terms are governed by the laws of the State of California, without regard to
                its conflict-of-law principles. Any disputes arising from or relating to these Terms
                or the Services shall be resolved exclusively in the state or federal courts located
                in Santa Clara County, California, and you consent to personal jurisdiction in those
                courts.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                Before initiating any formal legal proceeding, both parties agree to attempt
                resolution informally by contacting{' '}
                <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
                  support@thesisai.app
                </a>{' '}
                and giving the other party 30 days to respond.
              </p>
            </section>

            <section id="contact">
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>16. Contact</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                Questions about these Terms? Reach us at{' '}
                <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
                  support@thesisai.app
                </a>
                .
              </p>
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
          <a href="mailto:support@thesisai.app">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
