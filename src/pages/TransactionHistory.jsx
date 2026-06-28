import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';

const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0a1628 100%)',
    padding: '32px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#e2e8f0',
  },
  eyebrow: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.15em',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  filterRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  searchWrap: {
    position: 'relative',
    marginBottom: '20px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#334155',
    fontSize: '14px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '12px 14px 12px 38px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  tableWrap: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr 0.9fr 1.2fr 0.8fr 1fr',
    padding: '14px 24px',
    background: 'rgba(0,0,0,0.25)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    color: '#334155',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr 0.9fr 1.2fr 0.8fr 1fr',
    padding: '15px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    alignItems: 'center',
    transition: 'background 0.15s',
  },
  cell: {
    fontSize: '13px',
    color: '#94a3b8',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: '8px',
  },
  idCell: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '12px',
    color: '#475569',
  },
  amountCell: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  riskScore: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
  },
  scoreBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  scoreTrack: {
    width: '48px',
    height: '4px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  emptyState: {
    padding: '60px 24px',
    textAlign: 'center',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: '12px',
    color: '#475569',
  },
  pageBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: '#64748b',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
};

const PAGE_SIZE = 12;

function getScoreColor(score) {
  if (score >= 0.7) return '#ef4444';
  if (score >= 0.4) return '#f59e0b';
  return '#10b981';
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTransactions()
      .then(res => setTransactions(res.data))
      .catch(console.error);
  }, []);

  const filtered = transactions.filter(txn => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'fraud' && txn.risk_level === 'HIGH') ||
      (filter === 'safe' && txn.risk_level !== 'HIGH');
    const matchSearch =
      !search ||
      String(txn.id).toLowerCase().includes(search.toLowerCase()) ||
      txn.merchant_category?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filters = [
    { key: 'all', label: 'All Transactions' },
    { key: 'fraud', label: '🚨 Fraud Only' },
    { key: 'safe', label: '✅ Safe Only' },
  ];

  return (
    <div style={styles.root}>
      <style>{`
        .txn-row:hover { background: rgba(255,255,255,0.03) !important; }
        .filter-btn.active { background: rgba(99,102,241,0.15) !important; color: #a5b4fc !important; border-color: rgba(99,102,241,0.35) !important; }
        .filter-btn:hover { border-color: rgba(255,255,255,0.18) !important; color: #94a3b8 !important; }
        .search-input:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; }
        .page-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.18) !important; color: #94a3b8 !important; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>

      <div style={styles.eyebrow}>Audit Log</div>
      <div style={styles.titleRow}>
        <h1 style={styles.title}>Transaction History</h1>
        <div style={styles.filterRow}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? ' active' : ''}`}
              style={styles.filterBtn}
              onClick={() => { setFilter(f.key); setPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          className="search-input"
          style={styles.searchInput}
          type="text"
          placeholder="Search by transaction ID or merchant..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <div style={styles.tableHead}>
          <span>Txn ID</span>
          <span>Date & Time</span>
          <span>Amount</span>
          <span>Merchant</span>
          <span>Status</span>
          <span>ML Score</span>
        </div>

        {paginated.length > 0 ? (
          paginated.map((txn, index) => {
            const scoreColor = getScoreColor(txn.risk_score / 100);
            const pct = txn.risk_score;
            return (
              <div
                key={txn.id}
                className="txn-row"
                style={{
                  ...styles.tableRow,
                  borderBottom: index === paginated.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ ...styles.cell, ...styles.idCell }}>#{txn.id}</div>
                <div style={styles.cell}>
                  {new Date(txn.created_at).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
                <div style={{ ...styles.cell, ...styles.amountCell }}>
                  ₹{txn.amount.toFixed(2)}
                </div>
                <div style={styles.cell}>{txn.merchant_category}</div>
                <div style={styles.cell}>
                  <span style={{
                    ...styles.statusBadge,
                    background: txn.risk_level === 'HIGH' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                    color: txn.risk_level === 'HIGH' ? '#f87171' : '#34d399',
                    border: `1px solid ${txn.risk_level === 'HIGH' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
                  }}>
                    {txn.risk_level === 'HIGH' ? '⛔ Declined' : '✓ Approved'}
                  </span>
                </div>
                <div style={{ ...styles.cell, ...styles.scoreBar }}>
                  <div style={styles.scoreTrack}>
                    <div style={{ height: '100%', width: `${pct}%`, background: scoreColor, transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ ...styles.riskScore, color: scoreColor }}>
                    {txn.risk_score}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.3 }}>📭</div>
            <div style={{ fontSize: '14px', color: '#334155' }}>No transactions match your filters.</div>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div style={styles.pagination}>
            <span>
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} transactions
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="page-btn"
                style={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Prev
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: '#6366f1', fontWeight: '600' }}>
                {page} / {totalPages}
              </span>
              <button
                className="page-btn"
                style={styles.pageBtn}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
