const massiveEndpoints = [
  { endpoint: 'Quotes', description: 'Real-time bid/ask, last price, volume, and change' },
  { endpoint: 'OHLC Bars', description: 'Intraday and daily candlestick data' },
  { endpoint: 'Fundamentals', description: 'P/E, P/B, ROE, debt ratios, operating margins, EPS' },
  { endpoint: 'News', description: 'Headline feed with relevance scoring by symbol' },
  { endpoint: 'Technicals', description: 'RSI, MACD, moving averages, momentum indicators' },
  { endpoint: 'Market Movers', description: 'Top gainers, losers, and volume leaders' },
  { endpoint: 'Dividends & Splits', description: 'Corporate actions history and upcoming events' },
];

const fredSeries = [
  { series: 'FEDFUNDS', description: 'Federal funds effective rate' },
  { series: 'CPIAUCSL', description: 'Consumer Price Index (all urban, all items)' },
  { series: 'UNRATE', description: 'US civilian unemployment rate' },
  { series: 'GDP', description: 'Real gross domestic product (quarterly, annualized)' },
  { series: 'DGS2', description: '2-Year Treasury constant maturity rate' },
  { series: 'DGS10', description: '10-Year Treasury constant maturity rate' },
  { series: 'T10Y2Y', description: '10-Year minus 2-Year Treasury spread (yield curve)' },
];

export default function DocsDataSources() {
  return (
    <article>
      <p className="docs-eyebrow">Data</p>
      <h1>Data Sources</h1>
      <p className="docs-lead">
        Thesis AI integrates two primary external data providers: Massive API for market and
        company data, and FRED API for macroeconomic indicators. All agent analysis is grounded in
        data from these sources — no data is invented or interpolated.
      </p>

      <h2>Massive API</h2>
      <p>
        Massive is the primary market data vendor. It provides real-time and historical equity data
        across quotes, price bars, company fundamentals, news, and technical indicators. The
        Fundamentals Agent, News Agent, and Price & Trend Agent all draw from Massive.
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Data Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {massiveEndpoints.map((row) => (
              <tr key={row.endpoint}>
                <td><strong>{row.endpoint}</strong></td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="docs-callout note">
        <p className="docs-callout-title">Coverage</p>
        <p>
          Massive API coverage is currently focused on US equities (NYSE, NASDAQ). Coverage of
          ETFs, international markets, and options is planned for future phases.
        </p>
      </div>

      <h2>FRED API</h2>
      <p>
        The Federal Reserve Bank of St. Louis provides the FRED (Federal Reserve Economic Data)
        API, which is the authoritative source for US macroeconomic indicators. The Macro Agent
        uses a curated set of FRED series to construct its macro snapshot.
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Series ID</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {fredSeries.map((row) => (
              <tr key={row.series}>
                <td><code>{row.series}</code></td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The macro snapshot is assembled each time the Macro Agent runs. A Celery background task
        refreshes the cached snapshot hourly during market hours to reduce per-request latency.
      </p>

      <h2>Caching Strategy</h2>
      <p>
        To minimize vendor API costs and ensure fast response times, Thesis uses a two-tier caching
        strategy backed by Redis:
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Data Type</th>
              <th>Cache TTL</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Real-time quotes</td>
              <td>15 seconds</td>
              <td>Refreshed on each request if stale</td>
            </tr>
            <tr>
              <td>OHLC bars (intraday)</td>
              <td>1 minute</td>
              <td>Stale bars served during off-market hours</td>
            </tr>
            <tr>
              <td>News headlines</td>
              <td>5 minutes</td>
              <td>Longer TTL acceptable for narrative analysis</td>
            </tr>
            <tr>
              <td>Fundamentals snapshot</td>
              <td>24 hours</td>
              <td>Fundamental ratios change infrequently</td>
            </tr>
            <tr>
              <td>Macro snapshot (FRED)</td>
              <td>1 hour</td>
              <td>Refreshed by Celery beat scheduler</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Data Integrity</h2>
      <p>
        All agent prompts explicitly constrain agents to use only the provided data snapshot. If a
        required data field is missing or stale beyond acceptable bounds, the agent notes the
        limitation in its output rather than extrapolating or inventing figures. This ensures every
        piece of analysis in a thesis is traceable to a real data point.
      </p>

      <div className="docs-page-nav">
        <a href="/docs/workflow">
          <span className="docs-page-nav-dir">Previous</span>
          <span>Research Workflow</span>
        </a>
        <a href="/docs/roadmap" className="next">
          <span className="docs-page-nav-dir">Next</span>
          <span>Roadmap</span>
        </a>
      </div>
    </article>
  );
}
