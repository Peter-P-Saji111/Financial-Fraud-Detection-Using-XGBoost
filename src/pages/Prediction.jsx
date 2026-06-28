import React, { useState } from 'react';
import { predictFraud } from '../services/api';

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
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: '#475569',
    marginBottom: '36px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    maxWidth: '960px',
  },
  formCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '28px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    marginTop: '8px',
  },
  resultCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  meterWrap: {
    position: 'relative',
    width: '160px',
    height: '160px',
    marginBottom: '20px',
  },
  meterScore: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterNum: {
    fontSize: '36px',
    fontWeight: '900',
    lineHeight: 1,
    fontFamily: "'JetBrains Mono', monospace",
  },
  meterMax: {
    fontSize: '12px',
    color: '#475569',
    marginTop: '2px',
  },
  levelBadge: {
    fontSize: '14px',
    fontWeight: '800',
    padding: '8px 24px',
    borderRadius: '30px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  reasonsBox: {
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '18px',
  },
  reasonsLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  reasonItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: 1.4,
  },
  emptyResult: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '12px', opacity: 0.5 },
  emptyText: { fontSize: '13px', color: '#334155', maxWidth: '200px', lineHeight: 1.5 },
};

function getRiskConfig(level) {
  if (level === 'HIGH') return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', label: '🔴 HIGH RISK', pulse: true };
  if (level === 'MEDIUM') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', label: '🟡 MEDIUM RISK', pulse: false };
  return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: '🟢 LOW RISK', pulse: false };
}

function RiskMeter({ score, color }) {
  const radius = 66;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const dash = pct * circ;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
      <circle
        cx="80" cy="80" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset="0"
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }}
        filter={`drop-shadow(0 0 6px ${color})`}
      />
    </svg>
  );
}

export default function Prediction() {
  const [formData, setFormData] = useState({
    amount: '',
    merchant_category: '',
    merchant_risk: 0.5,
    country: '',
    is_foreign: 0,
    hour: 12,
    device_trust: 0.8,
    previous_fraud: 0,
    transaction_velocity: 1
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        merchant_risk: parseFloat(formData.merchant_risk),
        is_foreign: parseInt(formData.is_foreign),
        hour: parseInt(formData.hour),
        device_trust: parseFloat(formData.device_trust),
        previous_fraud: parseInt(formData.previous_fraud),
        transaction_velocity: parseInt(formData.transaction_velocity)
      };
      const response = await predictFraud(payload);
      setResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to get prediction. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const riskConfig = result ? getRiskConfig(result.risk_level) : null;

  return (
    <div style={styles.root}>
      <style>{`
        .pred-input:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .pred-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
        .pred-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes criticalPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.eyebrow}>ML Risk Engine</div>
      <h1 style={styles.title}>Simulate Transaction</h1>
      <p style={styles.subtitle}>Run a transaction through the XGBoost fraud model to get a real-time risk assessment.</p>

      <div style={styles.grid}>
        {/* Form Card */}
        <div style={styles.formCard}>
          <div style={styles.cardTitle}>Transaction Details</div>

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input
                className="pred-input"
                type="number"
                required
                placeholder="e.g. 25000"
                style={styles.input}
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Merchant Category</label>
              <select
                className="pred-input"
                required
                style={styles.input}
                value={formData.merchant_category}
                onChange={e => setFormData({ ...formData, merchant_category: e.target.value })}
              >
                <option value="">Select category...</option>
                <option value="Grocery">Grocery</option>
                <option value="Electronics">Electronics</option>
                <option value="Fuel">Fuel</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Merchant Risk (0-1)</label>
              <input
                className="pred-input"
                type="number"
                step="0.01"
                min="0"
                max="1"
                required
                placeholder="e.g. 0.5"
                style={styles.input}
                value={formData.merchant_risk}
                onChange={e => setFormData({ ...formData, merchant_risk: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Country</label>
              <select
                className="pred-input"
                required
                style={styles.input}
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="">Select country...</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UAE">UAE</option>
                <option value="Singapore">Singapore</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Is Foreign (0=No, 1=Yes)</label>
              <input
                className="pred-input"
                type="number"
                min="0"
                max="1"
                required
                placeholder="e.g. 0 or 1"
                style={styles.input}
                value={formData.is_foreign}
                onChange={e => setFormData({ ...formData, is_foreign: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Hour (0-23)</label>
              <input
                className="pred-input"
                type="number"
                min="0"
                max="23"
                required
                placeholder="e.g. 12"
                style={styles.input}
                value={formData.hour}
                onChange={e => setFormData({ ...formData, hour: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Device Trust (0-1)</label>
              <input
                className="pred-input"
                type="number"
                step="0.01"
                min="0"
                max="1"
                required
                placeholder="e.g. 0.8"
                style={styles.input}
                value={formData.device_trust}
                onChange={e => setFormData({ ...formData, device_trust: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Previous Fraud (0=No, 1=Yes)</label>
              <input
                className="pred-input"
                type="number"
                min="0"
                max="1"
                required
                placeholder="e.g. 0 or 1"
                style={styles.input}
                value={formData.previous_fraud}
                onChange={e => setFormData({ ...formData, previous_fraud: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Transaction Velocity</label>
              <input
                className="pred-input"
                type="number"
                min="1"
                required
                placeholder="e.g. 1"
                style={styles.input}
                value={formData.transaction_velocity}
                onChange={e => setFormData({ ...formData, transaction_velocity: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pred-btn"
              style={{
                ...styles.submitBtn,
                background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: '#fff',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Analyzing...
                </span>
              ) : '⚡ Run Fraud Analysis'}
            </button>
          </form>
        </div>

        {/* Result Card */}
        <div style={styles.resultCard}>
          {result ? (
            <>
              <div style={styles.cardTitle}>Analysis Result</div>

              <div style={styles.meterWrap}>
                <RiskMeter score={result.risk_score} color={riskConfig.color} />
                <div style={styles.meterScore}>
                  <div style={{ ...styles.meterNum, color: riskConfig.color }}>{result.risk_score}</div>
                  <div style={styles.meterMax}>/100</div>
                </div>
              </div>

              <div style={{
                ...styles.levelBadge,
                background: riskConfig.bg,
                color: riskConfig.color,
                border: `1px solid ${riskConfig.border}`,
                animation: riskConfig.pulse ? 'criticalPulse 2s infinite' : 'none',
              }}>
                {riskConfig.label}
              </div>

              <div style={styles.reasonsBox}>
                <div style={styles.reasonsLabel}>Flags / Reasons</div>
                {result.reasons && result.reasons.length > 0 ? (
                  result.reasons.map((reason, i) => (
                    <div key={i} style={{ ...styles.reasonItem, borderBottom: i === result.reasons.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: riskConfig.color, flexShrink: 0 }}>⚠</span>
                      <span>{reason}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ ...styles.reasonItem, borderBottom: 'none', color: '#10b981' }}>
                    <span>✓</span>
                    <span>No suspicious indicators detected by ML model.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.emptyResult}>
              <div style={styles.emptyIcon}>🔍</div>
              <div style={styles.emptyText}>Submit a transaction to see the risk analysis here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
