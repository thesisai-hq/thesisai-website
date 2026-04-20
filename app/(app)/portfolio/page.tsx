'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PortfolioTable } from '../../../components/PortfolioTable';
import { PortfolioAnalyticsPanel } from '../../../components/PortfolioAnalyticsPanel';
import { PortfolioRiskPanel } from '../../../components/PortfolioRiskPanel';
import type { PortfolioRead, PortfolioSnapshotResponse } from '../../../lib/api/portfolio';
import {
  addHolding,
  createPortfolio,
  deletePortfolio,
  getPortfolioSnapshot,
  getPortfolios,
  removeHolding,
} from '../../../lib/api/portfolio';
import { MOCK_PORTFOLIO_SNAPSHOT } from '../../../lib/mock-data';

type TabId = 'holdings' | 'analytics' | 'risks';

const TABS: { id: TabId; label: string }[] = [
  { id: 'holdings', label: 'Holdings' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'risks', label: 'Risks' },
];

const MOCK_ANALYTICS = {
  beta: 1.31,
  sharpe: 1.94,
  volatility: 0.21,
  max_drawdown: -0.14,
  correlation_sp500: 0.84,
  correlation_nasdaq: 0.93,
  sector_exposure: [
    { sector: 'Technology', weight: 0.52 },
    { sector: 'Consumer Disc', weight: 0.10 },
    { sector: 'Communication', weight: 0.12 },
    { sector: 'Industrials', weight: 0.08 },
    { sector: 'Energy', weight: 0.06 },
    { sector: 'Healthcare', weight: 0.07 },
    { sector: 'Other', weight: 0.05 },
  ],
  factor_exposure: [
    { factor: 'Growth', score: 0.82 },
    { factor: 'Momentum', score: 0.68 },
    { factor: 'Quality', score: 0.55 },
    { factor: 'Size', score: -0.31 },
    { factor: 'Value', score: -0.44 },
    { factor: 'Low Vol', score: -0.29 },
  ],
};

export default function PortfolioPage() {
  const { user } = useAuth();

  const [portfolios, setPortfolios] = useState<PortfolioSnapshotResponse[]>([]);
  const [portfolioCrud, setPortfolioCrud] = useState<PortfolioRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('holdings');

  // New Portfolio modal
  const [showNewPortfolio, setShowNewPortfolio] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [creating, setCreating] = useState(false);

  // Add Holding modal
  const [addHoldingPortfolioId, setAddHoldingPortfolioId] = useState<string | null>(null);
  const [holdingSymbol, setHoldingSymbol] = useState('');
  const [holdingQty, setHoldingQty] = useState('');
  const [holdingCost, setHoldingCost] = useState('');
  const [addingHolding, setAddingHolding] = useState(false);

  useEffect(() => {
    async function loadAll() {
      try {
        const [snapResult, crudResult] = await Promise.allSettled([
          getPortfolioSnapshot(),
          getPortfolios(),
        ]);
        if (snapResult.status === 'fulfilled') {
          setPortfolios(snapResult.value);
        } else {
          setPortfolios(MOCK_PORTFOLIO_SNAPSHOT);
        }
        if (crudResult.status === 'fulfilled') {
          setPortfolioCrud(crudResult.value);
        }
      } finally {
        setLoading(false);
      }
    }
    void loadAll();
  }, []);

  async function handleCreatePortfolio() {
    if (!newPortfolioName.trim() || !user) return;
    setCreating(true);
    try {
      const created = await createPortfolio(user.id, newPortfolioName.trim());
      setPortfolioCrud((prev) => [...prev, created]);
      setShowNewPortfolio(false);
      setNewPortfolioName('');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeletePortfolio(id: string) {
    if (!confirm('Delete this portfolio?')) return;
    await deletePortfolio(id);
    setPortfolioCrud((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleAddHolding() {
    if (!addHoldingPortfolioId || !holdingSymbol.trim() || !holdingQty || !holdingCost) return;
    setAddingHolding(true);
    try {
      const holding = await addHolding(
        addHoldingPortfolioId,
        holdingSymbol.trim().toUpperCase(),
        parseFloat(holdingQty),
        parseFloat(holdingCost)
      );
      setPortfolioCrud((prev) =>
        prev.map((p) =>
          p.id === addHoldingPortfolioId ? { ...p, holdings: [...p.holdings, holding] } : p
        )
      );
      setAddHoldingPortfolioId(null);
      setHoldingSymbol('');
      setHoldingQty('');
      setHoldingCost('');
    } finally {
      setAddingHolding(false);
    }
  }

  async function handleRemoveHolding(portfolioId: string, holdingId: string) {
    if (!confirm('Remove this holding?')) return;
    await removeHolding(portfolioId, holdingId);
    setPortfolioCrud((prev) =>
      prev.map((p) =>
        p.id === portfolioId
          ? { ...p, holdings: p.holdings.filter((h) => h.id !== holdingId) }
          : p
      )
    );
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="pf-page">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'holdings' && (
        <div className="pf-holdings">
          {/* Snapshot view */}
          {portfolios.map((pf) => (
            <div key={pf.portfolio_id} className="pf-section">
              <h2 className="pf-name">{pf.portfolio_name}</h2>
              <PortfolioTable portfolio={pf} />
            </div>
          ))}

          {/* CRUD management section */}
          <div className="pf-section pf-manage">
            <div className="pf-manage-header">
              <h2 className="pf-name">Manage Portfolios</h2>
              <button className="btn-primary" onClick={() => setShowNewPortfolio(true)}>
                + New Portfolio
              </button>
            </div>

            {portfolioCrud.length === 0 ? (
              <p className="pf-empty-sub">No portfolios yet. Create one above.</p>
            ) : (
              portfolioCrud.map((pf) => (
                <div key={pf.id} className="pf-crud-card">
                  <div className="pf-crud-header">
                    <span className="pf-crud-name">{pf.name}</span>
                    <div className="pf-crud-actions">
                      <button
                        className="btn-sm btn-accent"
                        onClick={() => setAddHoldingPortfolioId(pf.id)}
                      >
                        + Add Holding
                      </button>
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => handleDeletePortfolio(pf.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {pf.holdings.length === 0 ? (
                    <p className="pf-empty-sub">No holdings yet.</p>
                  ) : (
                    <table className="pf-holdings-table">
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Qty</th>
                          <th>Avg Cost</th>
                          <th>Added</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pf.holdings.map((h) => (
                          <tr key={h.id}>
                            <td className="pf-sym">{h.symbol}</td>
                            <td>{h.quantity}</td>
                            <td>${h.avg_cost.toFixed(2)}</td>
                            <td>{new Date(h.created_at).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="btn-sm btn-danger"
                                onClick={() => handleRemoveHolding(pf.id, h.id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="pf-panel-wrap">
          <PortfolioAnalyticsPanel analytics={MOCK_ANALYTICS} />
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="pf-panel-wrap">
          <PortfolioRiskPanel analytics={MOCK_ANALYTICS} />
        </div>
      )}

      {/* New Portfolio Modal */}
      {showNewPortfolio && (
        <div className="modal-overlay" onClick={() => setShowNewPortfolio(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">New Portfolio</h3>
            <input
              className="modal-input"
              placeholder="Portfolio name"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePortfolio()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-sm" onClick={() => setShowNewPortfolio(false)}>
                Cancel
              </button>
              <button
                className="btn-primary btn-sm"
                onClick={handleCreatePortfolio}
                disabled={creating || !newPortfolioName.trim()}
              >
                {creating ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Holding Modal */}
      {addHoldingPortfolioId && (
        <div className="modal-overlay" onClick={() => setAddHoldingPortfolioId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add Holding</h3>
            <input
              className="modal-input"
              placeholder="Symbol (e.g. AAPL)"
              value={holdingSymbol}
              onChange={(e) => setHoldingSymbol(e.target.value.toUpperCase())}
            />
            <input
              className="modal-input"
              type="number"
              placeholder="Quantity"
              value={holdingQty}
              onChange={(e) => setHoldingQty(e.target.value)}
            />
            <input
              className="modal-input"
              type="number"
              placeholder="Avg cost per share"
              value={holdingCost}
              onChange={(e) => setHoldingCost(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-sm" onClick={() => setAddHoldingPortfolioId(null)}>
                Cancel
              </button>
              <button
                className="btn-primary btn-sm"
                onClick={handleAddHolding}
                disabled={addingHolding || !holdingSymbol || !holdingQty || !holdingCost}
              >
                {addingHolding ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pf-page { display: flex; flex-direction: column; gap: 20px; }
        .pf-holdings { display: flex; flex-direction: column; gap: 32px; }
        .pf-section {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 24px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .pf-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; }
        .pf-panel-wrap {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 24px;
        }
        .pf-manage-header {
          display: flex; justify-content: space-between; align-items: center;
        }
        .pf-empty-sub { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
        .pf-crud-card {
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: 8px; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .pf-crud-header {
          display: flex; justify-content: space-between; align-items: center;
        }
        .pf-crud-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        .pf-crud-actions { display: flex; gap: 8px; }
        .pf-holdings-table {
          width: 100%; border-collapse: collapse; font-size: 0.82rem;
        }
        .pf-holdings-table th {
          text-align: left; padding: 7px 10px;
          font-size: 0.7rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--text-muted); border-bottom: 1px solid var(--border);
        }
        .pf-holdings-table td {
          padding: 8px 10px; border-bottom: 1px solid var(--border);
          color: var(--text-muted);
        }
        .pf-sym { font-weight: 700; color: var(--text-primary) !important; font-family: 'SF Mono', 'Fira Code', monospace; }

        /* Buttons */
        .btn-primary {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 8px 16px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.85; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-sm {
          font-size: 0.78rem; font-weight: 600; border-radius: 6px;
          padding: 5px 11px; cursor: pointer; border: 1px solid var(--border);
          background: none; color: var(--text-muted); transition: color 0.15s;
        }
        .btn-sm:hover { color: var(--text-primary); }
        .btn-accent { border-color: var(--accent); color: var(--accent); }
        .btn-danger { border-color: #ef4444; color: #ef4444; }
        .btn-danger:hover { background: rgba(239,68,68,0.08); }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
        }
        .modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px 24px;
          width: 360px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .modal-title {
          font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0;
        }
        .modal-input {
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: 7px; padding: 8px 12px;
          font-size: 0.875rem; color: var(--text-primary);
          outline: none; width: 100%; box-sizing: border-box;
        }
        .modal-input:focus { border-color: var(--accent); }
        .modal-actions {
          display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px;
        }
      `}</style>
    </div>
  );
}

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}) {
  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      <style jsx>{`
        .tab-bar {
          display: flex;
          gap: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 4px;
          width: fit-content;
        }
        .tab-btn {
          background: none; border: none; border-radius: 6px;
          padding: 7px 18px; font-size: 0.825rem; font-weight: 600;
          color: var(--text-muted); cursor: pointer;
          transition: background 0.15s, color 0.15s; white-space: nowrap;
        }
        .tab-btn:hover { color: var(--text-primary); }
        .tab-btn-active {
          background: var(--surface-2); color: var(--text-primary);
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="skel">
      <div className="skel-card" style={{ height: 240 }} />
      <style jsx>{`
        .skel { display: flex; flex-direction: column; gap: 14px; }
        .skel-card {
          border-radius: 12px; background: var(--surface); border: 1px solid var(--border);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
