import type { Metadata } from 'next';
import SiteNav from '../../components/SiteNav';

export const metadata: Metadata = {
  title: 'Long Hold Privacy Policy — Thesis AI',
  description: 'Privacy policy for Long Hold, the iOS investment consistency app by Thesis AI.',
};

export default function LongHoldPrivacyPage() {
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
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--muted)',
              marginBottom: '0.75rem',
            }}
          >
            <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Thesis AI
            </a>
            {' › '}
            <a href="/long-hold" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Long Hold
            </a>
            {' › Privacy Policy'}
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            This policy applies to the Long Hold iOS app.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section-wrap" style={{ padding: '3rem 0 5rem', maxWidth: '720px' }}>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--muted)',
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          Effective date: April 19, 2026 &nbsp;·&nbsp; Developer: Thesis AI
        </p>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Overview</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Long Hold is built for investors who value privacy. We collect only what&apos;s needed
            to make the app work and never sell your personal data to third parties.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Information We Collect</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            When you create an account, we collect:
          </p>
          <ul
            style={{
              paddingLeft: '1.25rem',
              color: 'var(--muted)',
              lineHeight: 1.7,
              marginBottom: '0.75rem',
            }}
          >
            <li>
              <strong style={{ color: 'var(--text)' }}>Email address</strong> — used for account
              creation and authentication
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>Password</strong> — stored as a secure hash;
              we never see your plaintext password
            </li>
          </ul>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            When you use the app, we store:
          </p>
          <ul
            style={{
              paddingLeft: '1.25rem',
              color: 'var(--muted)',
              lineHeight: 1.7,
              marginBottom: '0.75rem',
            }}
          >
            <li>
              <strong style={{ color: 'var(--text)' }}>Contribution logs</strong> — the amounts and
              dates of contributions you log
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>Profile preferences</strong> — contribution
              frequency, reminder settings, expected return rate
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>Goals (Pro)</strong> — investment goals you
              create within the app
            </li>
          </ul>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            All data is tied to your account and accessible only to you.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
            How We Use Your Information
          </h2>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            <li>To provide and sync app features across your devices</li>
            <li>To send contribution reminders (only if you enable them)</li>
            <li>To calculate streaks, projections, and discipline scores within the app</li>
            <li>To restore purchases when you reinstall the app</li>
          </ul>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: '0.75rem', margin: 0 }}>
            We do not use your data for advertising, analytics sold to third parties, or any purpose
            beyond operating the app.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
            Data Storage and Security
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Your data is stored securely using{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Supabase
            </a>
            , a Postgres-based backend with row-level security. Database policies enforce that only
            your authenticated account can read or write your data.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Authentication is handled by Supabase Auth. Passwords are never stored in plaintext.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>In-App Purchases</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Long Hold Pro subscriptions are processed entirely through Apple&apos;s App Store. We do
            not store or process payment information. Apple&apos;s{' '}
            <a
              href="https://www.apple.com/legal/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Privacy Policy
            </a>{' '}
            governs payment data.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Push Notifications</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            If you enable contribution reminders, the app schedules local notifications on your
            device. We do not send push notifications through a remote server — all reminders are
            triggered locally and require no additional data collection.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
            Data Retention and Deletion
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Your data is retained as long as your account is active. To delete your account and all
            associated data, email us at{' '}
            <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
              support@thesisai.app
            </a>{' '}
            with the subject &quot;Delete my account.&quot; We will process your request within 30
            days.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Children&apos;s Privacy</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Long Hold is not directed at children under 13. We do not knowingly collect personal
            information from children under 13. If you believe a child has provided us with personal
            information, please contact us and we will delete it promptly.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Third-Party Services</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Long Hold uses the following third-party services:
          </p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            <li>
              <strong style={{ color: 'var(--text)' }}>Supabase</strong> — data storage and
              authentication (
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
              >
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>Apple StoreKit</strong> — in-app purchases
              (
              <a
                href="https://www.apple.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
              >
                Apple Privacy Policy
              </a>
              )
            </li>
          </ul>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: '0.75rem', margin: 0 }}>
            We do not integrate any advertising SDKs, analytics platforms, or tracking frameworks.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Your Rights</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            You have the right to:
          </p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
          </ul>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: '0.75rem', margin: 0 }}>
            To exercise any of these rights, email{' '}
            <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
              support@thesisai.app
            </a>
            .
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
            Changes to This Policy
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            If we make material changes to this privacy policy, we will update the effective date at
            the top of this page. Continued use of the app after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Contact</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Questions about this privacy policy? Reach us at{' '}
            <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
              support@thesisai.app
            </a>
            .
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer section-wrap">
        <p>© {new Date().getFullYear()} Thesis AI</p>
        <nav>
          <a href="/">Home</a>
          <a href="/long-hold">Long Hold</a>
          <a href="/long-hold/support">Support</a>
          <a href="mailto:support@thesisai.app">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
