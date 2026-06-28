import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';

const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0a1628 100%)',
    padding: '32px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#e2e8f0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '36px',
  },
  titleGroup: {},
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
    margin: 0,
    letterSpacing: '-0.02em',
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#a5b4fc',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 8px #10b981',
    animation: 'pulse 2s infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '36px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s, border-color 0.2s',
    cursor: 'default',
  },
  cardAccentTotal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #6366f1, #818cf8)',
  },
  cardAccentFraud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #ef4444, #f87171)',
  },
  cardAccentSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #10b981, #34d399)',
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  cardValue: {
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  cardSub: {
    fontSize: '12px',
    color: '#475569',
    marginTop: '8px',
  },
  cardIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '32px',
    opacity: 0.15,
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
  alertsBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  alertsHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    color: '#475569',
    textTransform: 'uppercase',
  },
  alertRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    alignItems: 'center',
    transition: 'background 0.15s',
  },
  txnId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '13px',
    color: '#94a3b8',
  },
  riskBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  riskBarTrack: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
    maxWidth: '80px',
  },
  riskBadge: {
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    padding: '3px 8px',
    borderRadius: '6px',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#334155',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
    opacity: 0.4,
  },
  emptyText: {
    fontSize: '14px',
    color: '#475569',
  },
};

function StatCard({ label, value, color, accent, icon, sub }) {
  return (
    <div style={styles.card}>
      <div style={accent} />
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color }}>{value.toLocaleString()}</div>
      {sub && <div style={styles.cardSub}>{sub}</div>}
      <div style={styles.cardIcon}>{icon}</div>
    </div>
  );
}

function getRiskColor(score) {
  if (score >= 70) return '#ef4444';
  if (score >= 40) return '#f59e0b';
  return '#10b981';
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, flagged: 0, safe: 0, recentAlerts: [] });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    getDashboardStats()
      .then(res => { if (res && res.data) setStats(res.data); })
      .catch(err => console.error('Dashboard data fetch failed:', err));
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const detectionRate = stats.total > 0 ? ((stats.flagged / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #10b981} 50%{opacity:0.5;box-shadow:0 0 2px #10b981} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .alert-row:hover { background: rgba(255,255,255,0.04) !important; }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.14) !important; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.eyebrow}>Security Operations Center</div>
          <h1 style={styles.title}>Fraud Detection Dashboard</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={styles.liveBadge}>
            <div style={styles.liveDot} />
            Live Monitoring
          </div>
          <div style={{ fontSize: '12px', color: '#334155', fontFamily: 'monospace' }}>
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard
          label="Total Transactions"
          value={stats.total}
          color="#e2e8f0"
          accent={styles.cardAccentTotal}
          icon="📊"
          sub="All time processed"
        />
        <StatCard
          label="Fraud Flags · 24h"
          value={stats.flagged}
          color="#f87171"
          accent={styles.cardAccentFraud}
          icon="🚨"
          sub={`${detectionRate}% detection rate`}
        />
        <StatCard
          label="Safe Transactions"
          value={stats.safe}
          color="#34d399"
          accent={styles.cardAccentSafe}
          icon="✅"
          sub="Cleared by ML model"
        />
      </div>

      {/* Alerts Feed */}
      <div style={styles.sectionTitle}>
        <span>High-Risk Alert Feed</span>
        <div style={styles.sectionTitleLine} />
        <span style={{ color: '#ef4444', fontSize: '11px' }}>⬤ {stats.recentAlerts?.length || 0} active</span>
      </div>

      <div style={styles.alertsBox}>
        <div style={styles.alertsHeader}>
          <span>Transaction ID</span>
          <span>Risk Score</span>
          <span>Threat Level</span>
        </div>

        {stats.recentAlerts && stats.recentAlerts.length > 0 ? (
          stats.recentAlerts.map((alert, index) => {
            const score = alert.risk_score ?? 0;
            const riskColor = getRiskColor(score);
            const level = score >= 70 ? 'CRITICAL' : score >= 40 ? 'ELEVATED' : 'LOW';
            return (
              <div
                key={index}
                className="alert-row"
                style={{ ...styles.alertRow, animation: `fadeIn 0.3s ease ${index * 0.06}s both` }}
              >
                <div style={styles.txnId}>#{alert.transaction_id || alert.id}</div>
                <div style={styles.riskBar}>
                  <div style={styles.riskBarTrack}>
                    <div style={{ height: '100%', width: `${score}%`, background: riskColor, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px', color: riskColor, fontWeight: '700' }}>
                    {score}
                  </span>
                </div>
                <div>
                  <span style={{ ...styles.riskBadge, background: `${riskColor}22`, color: riskColor, border: `1px solid ${riskColor}44` }}>
                    {level}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛡️</div>
            <div style={styles.emptyText}>No high-risk alerts detected · System nominal</div>
          </div>
        )}
      </div>
    </div>
  );
}
