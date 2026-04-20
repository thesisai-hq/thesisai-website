import type { MacroSnapshot } from '../lib/api/macro';

interface MacroRegimeCardProps {
  macro: MacroSnapshot;
}

function fmt(v: number | null | undefined, digits = 2, suffix = ''): string {
  if (v == null) return '—';
  return `${v.toFixed(digits)}${suffix}`;
}

interface RegimeInfo {
  label: string;
  color: string;
}

function deriveRegime(snap: MacroSnapshot['snapshot']): RegimeInfo {
  if (!snap) return { label: 'Neutral', color: 'var(--text-muted)' };
  const { yield_10y, yield_2y, cpi_yoy } = snap;

  if (yield_10y != null && yield_2y != null && yield_10y < yield_2y) {
    return { label: 'Risk-Off', color: '#f87171' };
  }
  if (
    cpi_yoy != null &&
    yield_10y != null &&
    yield_2y != null &&
    cpi_yoy < 3.5 &&
    yield_10y > yield_2y
  ) {
    return { label: 'Risk-On', color: '#4ade80' };
  }
  if (cpi_yoy != null && cpi_yoy >= 3.5 && cpi_yoy < 4.5) {
    return { label: 'Transition', color: '#fbbf24' };
  }
  return { label: 'Neutral', color: 'var(--text-muted)' };
}

function deriveConfidence(snap: MacroSnapshot['snapshot']): number {
  if (!snap) return 50;
  const spread = Math.abs((snap.yield_10y ?? 0) - (snap.yield_2y ?? 0));
  return Math.min(95, 50 + spread * 10);
}

const REGIME_SECTORS: Record<string, { favored: string[]; underweight: string[] }> = {
  'Risk-On': { favored: ['Tech', 'Consumer Disc', 'Industrials'], underweight: ['Utilities', 'Staples'] },
  'Risk-Off': { favored: ['Utilities', 'Staples', 'Healthcare'], underweight: ['Tech', 'Financials'] },
  'Transition': { favored: ['Healthcare', 'Energy'], underweight: ['Growth', 'Small-cap'] },
  'Neutral': { favored: ['Quality', 'Dividend'], underweight: [] },
};

export function MacroRegimeCard({ macro }: MacroRegimeCardProps) {
  const snap = macro.snapshot;
  const { label: regime, color: regimeColor } = deriveRegime(snap);
  const confidence = deriveConfidence(snap);
  const sectors = REGIME_SECTORS[regime] ?? REGIME_SECTORS['Neutral'];

  const cpi = snap?.cpi_yoy ?? null;
  const cpiStatus = cpi == null ? '—' : cpi > 4.5 ? 'High' : cpi > 3 ? 'Elevated' : 'Normal';
  const cpiStatusColor =
    cpi == null ? 'var(--text-muted)' : cpi > 4.5 ? '#f87171' : cpi > 3 ? '#fbbf24' : '#4ade80';

  const spread =
    snap?.yield_10y != null && snap?.yield_2y != null
      ? snap.yield_10y - snap.yield_2y
      : null;

  return (
    <div className="mrcard">
      <div className="mrcard-header">
        <span className="mrcard-label">Macro Regime</span>
        <span className="mrcard-regime" style={{ color: regimeColor }}>{regime}</span>
      </div>

      <div className="mrcard-conf">
        <div className="mrcard-conf-bar">
          <div
            className="mrcard-conf-fill"
            style={{ width: `${confidence.toFixed(0)}%`, background: regimeColor }}
          />
        </div>
        <span className="mrcard-conf-label">{confidence.toFixed(0)}% confidence</span>
      </div>

      <div className="mrcard-indicators">
        <div className="mrcard-ind-row">
          <span className="mrcard-ind-name">CPI YoY</span>
          <span className="mrcard-ind-val">{fmt(cpi, 1, '%')}</span>
          <span className="mrcard-ind-status" style={{ color: cpiStatusColor }}>{cpiStatus}</span>
        </div>
        <div className="mrcard-ind-row">
          <span className="mrcard-ind-name">Unemployment</span>
          <span className="mrcard-ind-val">{fmt(snap?.unemployment, 1, '%')}</span>
          <span className="mrcard-ind-status" style={{ color: 'var(--text-muted)' }}>—</span>
        </div>
        <div className="mrcard-ind-row">
          <span className="mrcard-ind-name">Yield Spread</span>
          <span className="mrcard-ind-val">
            {spread != null ? `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%` : '—'}
          </span>
          <span
            className="mrcard-ind-status"
            style={{ color: spread != null && spread < 0 ? '#f87171' : '#4ade80' }}
          >
            {spread != null ? (spread < 0 ? 'Inverted' : 'Normal') : '—'}
          </span>
        </div>
      </div>

      <div className="mrcard-factors">
        {[
          { label: 'Fed Funds', val: fmt(snap?.fed_funds_rate, 2, '%') },
          { label: 'CPI YoY', val: fmt(cpi, 1, '%') },
          { label: 'GDP Growth', val: fmt(snap?.gdp_growth, 1, '%') },
          {
            label: 'Yield Spread',
            val: spread != null ? `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%` : '—',
          },
        ].map(({ label, val }) => (
          <div key={label} className="mrcard-factor">
            <span className="mrcard-factor-label">{label}</span>
            <span className="mrcard-factor-val">{val}</span>
          </div>
        ))}
      </div>

      <div className="mrcard-sectors">
        <div className="mrcard-sector-col">
          <span className="mrcard-sector-heading" style={{ color: '#4ade80' }}>Favored</span>
          <div className="mrcard-chips">
            {sectors.favored.map((s) => (
              <span key={s} className="mrcard-chip favored">{s}</span>
            ))}
          </div>
        </div>
        {sectors.underweight.length > 0 && (
          <div className="mrcard-sector-col">
            <span className="mrcard-sector-heading" style={{ color: '#f87171' }}>Underweight</span>
            <div className="mrcard-chips">
              {sectors.underweight.map((s) => (
                <span key={s} className="mrcard-chip underweight">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mrcard-footer">
        <a href="/ai" className="mrcard-link">Deep dive →</a>
      </div>

      <style jsx>{`
        .mrcard {
          padding: 18px 20px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mrcard-header { display: flex; align-items: center; justify-content: space-between; }
        .mrcard-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .mrcard-regime { font-size: 0.95rem; font-weight: 700; }
        .mrcard-conf { display: flex; flex-direction: column; gap: 5px; }
        .mrcard-conf-bar {
          height: 4px;
          border-radius: 2px;
          background: rgba(148,163,184,0.14);
          overflow: hidden;
        }
        .mrcard-conf-fill { height: 100%; border-radius: 2px; }
        .mrcard-conf-label { font-size: 0.72rem; color: var(--text-muted); }
        .mrcard-indicators { display: flex; flex-direction: column; gap: 8px; }
        .mrcard-ind-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 8px;
          align-items: center;
        }
        .mrcard-ind-name { font-size: 0.75rem; color: var(--text-muted); }
        .mrcard-ind-val { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); text-align: right; }
        .mrcard-ind-status { font-size: 0.7rem; font-weight: 600; text-align: right; min-width: 52px; }
        .mrcard-factors {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }
        .mrcard-factor { display: flex; flex-direction: column; gap: 2px; }
        .mrcard-factor-label {
          font-size: 0.67rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .mrcard-factor-val { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
        .mrcard-sectors { display: flex; gap: 12px; }
        .mrcard-sector-col { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .mrcard-sector-heading {
          font-size: 0.67rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .mrcard-chips { display: flex; flex-wrap: wrap; gap: 4px; }
        .mrcard-chip {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .favored {
          background: rgba(74,222,128,0.08);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .underweight {
          background: rgba(248,113,113,0.08);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.2);
        }
        .mrcard-footer { display: flex; justify-content: flex-end; }
        .mrcard-link {
          font-size: 0.78rem;
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 150ms;
        }
        .mrcard-link:hover { opacity: 0.75; }
      `}</style>
    </div>
  );
}
