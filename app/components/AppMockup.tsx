'use client';

/** Three CSS-only iPhone frames showcasing Dashboard, AI Chat, and Portfolio screens. */
export default function AppMockup() {
  return (
    <section className="section-wrap app-mockup-section" id="app">
      <p className="eyebrow reveal">The App</p>
      <h2 className="reveal reveal-delay-1">
        Your investment research,<br />reimagined for mobile.
      </h2>
      <p className="subline reveal reveal-delay-2">
        Three screens. Instant context. Everything you need to act with conviction.
      </p>

      <div className="iphone-row reveal reveal-delay-3">
        {/* ── iPhone 1: Dashboard ── */}
        <div className="iphone-frame iphone-left" aria-label="Dashboard screen">
          <div className="iphone-notch-bar">
            <div className="iphone-notch" />
            <span className="iphone-status-time">9:41</span>
            <div className="iphone-status-icons">
              <div className="iphone-status-dot" />
              <div className="iphone-status-dot" />
              <div className="iphone-status-dot" />
            </div>
          </div>

          <div className="iphone-screen">
            <div className="iscreen-header">Good morning</div>
            <div className="iscreen-title">Market Brief</div>

            {/* Market regime card */}
            <div className="iscreen-card">
              <div className="iscreen-label">Today&apos;s Regime</div>
              <div className="iscreen-row">
                <span>Risk-on</span>
                <span className="iscreen-badge bull">82% conf</span>
              </div>
              <div className="iscreen-muted">Breadth expanding · Yields stable</div>
            </div>

            {/* Holdings strip */}
            <div className="iscreen-card">
              <div className="iscreen-label">Holdings</div>
              <div className="iscreen-row">
                <span>NVDA</span>
                <span className="iscreen-up">▲ +2.4%</span>
              </div>
              <div className="iscreen-divider" />
              <div className="iscreen-row">
                <span>AAPL</span>
                <span className="iscreen-down">▼ −0.8%</span>
              </div>
              <div className="iscreen-divider" />
              <div className="iscreen-row">
                <span>MSFT</span>
                <span className="iscreen-up">▲ +1.1%</span>
              </div>
            </div>

            {/* AI insight teaser */}
            <div className="iscreen-card glow">
              <div className="iscreen-label">AI Insight</div>
              <div className="iscreen-muted">Semis bull case strengthened on data center demand beat.</div>
            </div>
          </div>

          <div className="iphone-home-bar">
            <div className="iphone-home-indicator" />
          </div>
        </div>

        {/* ── iPhone 2: AI Chat (center, elevated) ── */}
        <div className="iphone-frame iphone-center" aria-label="AI Chat screen">
          <div className="iphone-notch-bar">
            <div className="iphone-notch" />
            <span className="iphone-status-time">9:41</span>
            <div className="iphone-status-icons">
              <div className="iphone-status-dot" />
              <div className="iphone-status-dot" />
              <div className="iphone-status-dot" />
            </div>
          </div>

          <div className="iphone-screen">
            <div className="iscreen-title">Ask Thesis</div>

            {/* User message bubble */}
            <div className="iscreen-bubble">
              What&apos;s driving NVDA today?
            </div>

            {/* AI response card */}
            <div className="iscreen-card glow">
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div className="iscreen-badge bull">Bull</div>
                <div className="iscreen-muted">86% confidence</div>
              </div>
              <div className="iscreen-muted" style={{ fontSize: '0.62rem', lineHeight: 1.5 }}>
                Data center revenue +112% YoY. Blackwell ramp ahead of schedule.
                Export restriction risk priced in.
              </div>
              {/* Confidence bar */}
              <div className="iscreen-confidence-bar">
                <div className="iscreen-confidence-fill" style={{ width: '86%' }} />
              </div>
              <div className="iscreen-muted" style={{ fontSize: '0.58rem', color: 'var(--accent)' }}>
                3 sources cited ↗
              </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Input bar */}
            <div className="iscreen-input-bar">
              <span>Ask about any stock…</span>
              <div className="iscreen-send">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 7L7 1M7 1H2M7 1V6" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="iphone-home-bar">
            <div className="iphone-home-indicator" />
          </div>
        </div>

        {/* ── iPhone 3: Portfolio ── */}
        <div className="iphone-frame iphone-right" aria-label="Portfolio screen">
          <div className="iphone-notch-bar">
            <div className="iphone-notch" />
            <span className="iphone-status-time">9:41</span>
            <div className="iphone-status-icons">
              <div className="iphone-status-dot" />
              <div className="iphone-status-dot" />
              <div className="iphone-status-dot" />
            </div>
          </div>

          <div className="iphone-screen">
            <div className="iscreen-header">Portfolio</div>

            {/* Total value */}
            <div className="iscreen-card">
              <div className="iscreen-label">Total Value</div>
              <div className="iscreen-row" style={{ fontSize: '1rem', fontWeight: 700 }}>
                <span>$124,532</span>
                <span className="iscreen-up">+1.02%</span>
              </div>
              <div className="iscreen-muted">+$1,272 today</div>
            </div>

            {/* Holdings list */}
            <div className="iscreen-card">
              <div className="iscreen-label">Positions</div>
              <div className="iscreen-row">
                <span>NVDA</span>
                <span className="iscreen-muted">42%</span>
                <span className="iscreen-up">+2.4%</span>
              </div>
              <div className="iscreen-divider" />
              <div className="iscreen-row">
                <span>AAPL</span>
                <span className="iscreen-muted">28%</span>
                <span className="iscreen-down">−0.8%</span>
              </div>
              <div className="iscreen-divider" />
              <div className="iscreen-row">
                <span>MSFT</span>
                <span className="iscreen-muted">18%</span>
                <span className="iscreen-up">+1.1%</span>
              </div>
            </div>

            {/* CTA */}
            <div className="iscreen-btn">Get AI Analysis →</div>
          </div>

          <div className="iphone-home-bar">
            <div className="iphone-home-indicator" />
          </div>
        </div>
      </div>
    </section>
  );
}
