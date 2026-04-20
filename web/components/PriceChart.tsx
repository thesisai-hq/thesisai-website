interface PriceChartProps {
  closes: number[];
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export function PriceChart({
  closes,
  height = 120,
  color = '#3b9eff',
  showGrid = false,
}: PriceChartProps) {
  if (closes.length === 0) {
    return (
      <div className="pc-empty">
        <span>No price data available</span>
        <style jsx>{`
          .pc-empty {
            height: ${height}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: var(--text-muted);
            background: var(--surface-2);
            border-radius: 8px;
            border: 1px solid var(--border);
          }
        `}</style>
      </div>
    );
  }

  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const w = 600;
  const h = height;
  const padding = 5;

  const points = closes
    .map(
      (c, i) =>
        `${(i / (closes.length - 1)) * w},${h - ((c - min) / range) * (h - padding * 2) - padding}`,
    )
    .join(' ');

  // Build filled area path (polyline + closing path)
  const areaPath =
    `M ${(0 / (closes.length - 1)) * w},${h - ((closes[0] - min) / range) * (h - padding * 2) - padding} ` +
    closes
      .map(
        (c, i) =>
          `L ${(i / (closes.length - 1)) * w},${h - ((c - min) / range) * (h - padding * 2) - padding}`,
      )
      .join(' ') +
    ` L ${w},${h} L 0,${h} Z`;

  const gridLines = showGrid ? [0.25, 0.5, 0.75] : [];

  return (
    <div className="pc-wrap">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: `${h}px`, display: 'block' }}
      >
        <defs>
          <linearGradient id="pc-fill-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((pct) => {
          const y = h - pct * (h - padding * 2) - padding;
          return (
            <line
              key={pct}
              x1="0"
              y1={y}
              x2={w}
              y2={y}
              stroke="rgba(148,163,184,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Fill area */}
        <path d={areaPath} fill="url(#pc-fill-gradient)" />

        {/* Baseline */}
        <line
          x1="0"
          y1={h - padding}
          x2={w}
          y2={h - padding}
          stroke="rgba(148,163,184,0.14)"
          strokeWidth="1"
        />

        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Last-point dot */}
        {closes.length > 0 && (
          <circle
            cx={w}
            cy={h - ((closes[closes.length - 1] - min) / range) * (h - padding * 2) - padding}
            r="3"
            fill={color}
          />
        )}
      </svg>

      <style jsx>{`
        .pc-wrap {
          width: 100%;
          overflow: hidden;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
