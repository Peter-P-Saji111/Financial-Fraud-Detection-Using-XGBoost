import React, { useState, useEffect } from 'react';
import { getAnalyticsData } from '../services/api';

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
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: '0 0 32px 0',
    letterSpacing: '-0.02em',
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  summaryCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '18px 20px',
    position: 'relative',
  },
  summaryLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '26px',
    fontWeight: '800',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  chartCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: '6px',
  },
  chartSub: {
    fontSize: '12px',
    color: '#475569',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionTitleLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
  },
};

export default function Analytics() {
  const [data, setData] = useState({});

  useEffect(() => {
    getAnalyticsData()
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  const totalSafe = data.low_risk || 0;
  const totalFraud = data.high_risk || 0;
  const totalMedium = data.medium_risk || 0;
  const total = data.total_transactions || 0;

  return (
    <div style={styles.root}>

      <div style={styles.eyebrow}>Intelligence & Insights</div>
      <h1 style={styles.title}>Fraud Analytics & Trends</h1>

      {/* Summary Stats */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Transactions</div>
          <div style={{ ...styles.summaryValue, color: '#e2e8f0' }}>{total.toLocaleString()}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Low Risk</div>
          <div style={{ ...styles.summaryValue, color: '#34d399' }}>{totalSafe.toLocaleString()}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Medium Risk</div>
          <div style={{ ...styles.summaryValue, color: '#fbbf24' }}>{totalMedium.toLocaleString()}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>High Risk</div>
          <div style={{ ...styles.summaryValue, color: '#f87171' }}>{totalFraud.toLocaleString()}</div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div style={styles.sectionTitle}>
        <span>Risk Distribution</span>
        <div style={styles.sectionTitleLine} />
      </div>
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>Transaction Risk Levels</div>
        <div style={styles.chartSub}>Distribution of transactions by risk category</div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#34d399' }}>{totalSafe}</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>Low Risk</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{total > 0 ? ((totalSafe / total) * 100).toFixed(1) : 0}%</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(251,191,36,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#fbbf24' }}>{totalMedium}</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>Medium Risk</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{total > 0 ? ((totalMedium / total) * 100).toFixed(1) : 0}%</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(248,113,113,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#f87171' }}>{totalFraud}</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>High Risk</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{total > 0 ? ((totalFraud / total) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
