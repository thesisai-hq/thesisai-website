import type { Metadata } from 'next';
import SiteNav from '../components/SiteNav';

export const metadata: Metadata = {
  title: 'Long Hold — Invest Consistently | Thesis AI',
  description:
    'Track contributions, build streaks, and visualize long-term compound growth. Long Hold is an iOS app for disciplined, consistent investors.',
};

const features = [
  {
    title: 'Contribution Tracking',
    description: 'Log every investment in seconds. Build a complete record of your long-term commitment.',
    icon: '📊',
  },
  {
    title: 'Streak System',
    description: 'Build investing streaks that create accountability and reinforce consistent behavior.',
    icon: '🔥',
  },
  {
    title: 'Growth Projections',
    description: 'A 30-year compound calculator that shows what consistent investing actually produces.',
    icon: '📈',
  },
  {
    title: 'Crash Mode',
    description: 'Historical context during market downturns — so you stay the course when it matters most.',
    icon: '🛡️',
  },
  {
    title: 'Education',
    description: 'Bite-sized investing fundamentals that build real financial knowledge over time.',
    icon: '📚',
  },
  {
    title: 'Goal Tracking',
    description: 'Set retirement, house, and emergency fund goals. Track your progress toward each one.',
    icon: '🎯',
    pro: true,
  },
];

const proFeatures = [
  'Full education library (unlimited cards)',
  'Custom initial balance & time horizon',
  'Scenario comparison (multiple return rates)',
  'Inflation-adjusted projections',
  'Discipline Score (0–100 consistency rating)',
  'Milestones & achievement badges',
  'Goal-based investing',
];

export default function LongHoldPage() {
  return (
    <main className="page">
      <SiteNav />

      {/* ── Hero ─────────────────────────────────── */}
      <section
        className="section-wrap"
        style={{ padding: '5rem 0 3.5rem', textAlign: 'center' }}
      >
        {/* App Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            margin: '0 auto 1.5rem',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #0f2540 0%, #1a4a7a 100%)',
            border: '1px solid rgba(59,158,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px -12px rgba(59,158,255,0.5)',
          }}
        >
          <svg
            viewBox="0 0 48 48"
            fill="none"
            style={{ width: 40, height: 40 }}
          >
            <polyline
              points="4,36 16,22 26,28 44,8"
              stroke="#3b9eff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="44"
              y1="8"
              x2="44"
              y2="16"
              stroke="#3b9eff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="36"
              y1="8"
              x2="44"
              y2="8"
              stroke="#3b9eff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="eyebrow">Available on iOS</p>
        <h1 className="grad-text" style={{ marginBottom: '0.8rem' }}>
          Build wealth through consistency.
        </h1>
        <p className="subline" style={{ margin: '0 auto 2rem', maxWidth: '44ch' }}>
          Track investments, build streaks, and watch compounding do its work.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Replace href with real App Store URL when available */}
          <a
            href="https://apps.apple.com/app/long-hold/id6746467356"
            className="cta"
            style={{ padding: '0.72rem 1.5rem' }}
          >
            Download on App Store
          </a>
          <a href="#features" className="ghost" style={{ padding: '0.72rem 1.25rem' }}>
            Learn more ↓
          </a>
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────── */}
      <section
        id="features"
        className="section-wrap"
        style={{ padding: '4rem 0' }}
      >
        <p className="eyebrow">Features</p>
        <h2 style={{ marginBottom: '2rem' }}>Everything you need to stay consistent.</h2>

        <div className="feature-grid">
          {features.map((f) => (
            <article className="feature" key={f.title}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>{f.icon}</div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {f.title}
                {f.pro && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: 'linear-gradient(120deg, #1a72d4, #3b9eff)',
                      color: '#fff',
                    }}
                  >
                    Pro
                  </span>
                )}
              </h3>
              <p>{f.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pro Callout ──────────────────────────── */}
      <section className="section-wrap" style={{ padding: '1rem 0 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15,28,48,0.95) 0%, rgba(11,23,41,0.98) 100%)',
            border: '1px solid rgba(59,158,255,0.35)',
            borderRadius: '1.3rem',
            padding: '2.5rem',
            boxShadow: '0 0 60px -20px rgba(59,158,255,0.3)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  background: 'linear-gradient(120deg, #1a72d4, #3b9eff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Long Hold Pro
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  margin: '0.5rem 0 0.75rem',
                }}
              >
                Go deeper on your journey.
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Unlock advanced tools that give you a complete picture of your investing discipline
                and long-term trajectory.
              </p>
              <p
                style={{
                  marginTop: '1.5rem',
                  color: 'var(--muted)',
                  fontSize: '0.85rem',
                }}
              >
                Upgrade to Pro in-app via Settings.
              </p>
            </div>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gap: '0.6rem',
              }}
            >
              {proFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                  }}
                >
                  <span style={{ color: '#2db48d', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="footer section-wrap">
        <p>© {new Date().getFullYear()} Thesis AI</p>
        <nav>
          <a href="/">Thesis AI</a>
          <a href="/long-hold/support">Support</a>
          <a href="/long-hold/privacy">Privacy Policy</a>
          <a href="mailto:support@thesisai.app">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
