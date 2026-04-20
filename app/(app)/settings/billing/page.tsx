'use client';

export default function BillingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h2 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 700 }}>Billing &amp; Subscription</h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
          You are on the <strong>Beta Access</strong> plan. Full access is complimentary during the beta period.
        </p>
      </div>
    </div>
  );
}
