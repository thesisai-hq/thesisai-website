import type { Metadata } from 'next';
import SiteNav from '../../components/SiteNav';

export const metadata: Metadata = {
  title: 'Long Hold Support — Thesis AI',
  description: 'Get help with Long Hold, the investment consistency tracker from Thesis AI.',
};

const faqs = [
  {
    q: 'What is Long Hold?',
    a: 'Long Hold is an investment consistency tracker for long-term investors. It helps you log contributions, build investing streaks, visualize compound growth projections, and stay disciplined through market volatility.',
  },
  {
    q: "What's included in the free tier?",
    a: 'The free version includes unlimited contribution logging, streak tracking, 5 education cards, the basic projection calculator, and Crash Mode — historical context for market downturns.',
  },
  {
    q: 'What does Long Hold Pro include?',
    a: 'Pro unlocks the full education library, custom initial balance and time horizon in the calculator, scenario comparison, inflation-adjusted projections, Discipline Score, milestones, achievements, and goal-based investing.',
  },
  {
    q: 'How do I restore my Pro subscription?',
    a: 'Open Long Hold → Settings → tap "Restore Purchases." Your subscription is tied to your Apple ID and will restore automatically if you sign in with the same Apple ID on a new device.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Subscriptions are managed through Apple. Go to Settings → [Your Name] → Subscriptions on your iPhone, find Long Hold, and tap Cancel Subscription. You\'ll keep Pro access until the end of your billing period.',
  },
  {
    q: 'I forgot my password. How do I reset it?',
    a: 'On the sign-in screen, tap "Forgot password?" below the password field. Enter your email address and we\'ll send you a reset link.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your account data is stored securely using Supabase with row-level security — only you can access your contributions and profile. We never sell your data. See our Privacy Policy for details.',
  },
  {
    q: 'How is the projection calculated?',
    a: 'The calculator uses compound interest math: each month your balance grows by 1/12 of your annual return, then your contribution is added. The default return rate is 10% annually, which reflects the long-run historical average of the S&P 500.',
  },
  {
    q: 'What is the Discipline Score?',
    a: 'The Discipline Score (Pro) rates your investing consistency from 0–100 based on how regularly you contribute, your streak length, and how consistent your contribution amounts are. It measures the habit, not the amount.',
  },
];

export default function LongHoldSupportPage() {
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
            {' › Support'}
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.5rem' }}>
            Long Hold Support
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            We&apos;re here to help. Find answers below or reach out directly.
          </p>
        </div>
      </div>

      <div className="section-wrap" style={{ padding: '3rem 0 5rem' }}>

        {/* Contact Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a72d4, #5856d6)',
            borderRadius: '1rem',
            padding: '2.25rem',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Need help?</h2>
          <p style={{ opacity: 0.85, marginBottom: '1.25rem', color: '#fff' }}>
            Can&apos;t find what you&apos;re looking for? Send us an email and we&apos;ll get back to you.
          </p>
          <a
            href="mailto:support@thesisai.app"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#1a72d4',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '11px 24px',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            support@thesisai.app
          </a>
        </div>

        {/* App Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          {[
            { label: 'App', value: 'Long Hold' },
            { label: 'Platform', value: 'iOS' },
            { label: 'Current Version', value: '1.0' },
            { label: 'Developer', value: 'Thesis AI' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--bg-soft)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.9rem',
                padding: '1.1rem 1.25rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.35rem',
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2
            style={{
              fontSize: '1.4rem',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--glass-border)',
            }}
          >
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {faqs.map((item) => (
              <div key={item.q}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.45rem' }}>
                  {item.q}
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {item.a}
                </p>
              </div>
            ))}

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.45rem' }}>
                Still need help?
              </h3>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Email us at{' '}
                <a href="mailto:support@thesisai.app" style={{ color: 'var(--accent)' }}>
                  support@thesisai.app
                </a>{' '}
                and we&apos;ll respond within 1–2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer section-wrap">
        <p>© {new Date().getFullYear()} Thesis AI</p>
        <nav>
          <a href="/">Home</a>
          <a href="/long-hold">Long Hold</a>
          <a href="/long-hold/privacy">Privacy Policy</a>
          <a href="mailto:support@thesisai.app">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
