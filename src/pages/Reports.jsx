import React from 'react';

export default function Reports() {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '40px', textAlign: 'center', background: 'var(--white)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '12px' }}>Performance Analytics & Reports</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px' }}>
          Analyze sales commissions, client retention charts, and compliance auditing metrics.
        </p>
        <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--aag-accent)', borderRadius: 'var(--radius-md)', color: 'var(--aag-primary-light)', fontWeight: 500 }}>
          🚧 Under Development — Coming in Phase 2
        </div>
      </div>
    </div>
  );
}
