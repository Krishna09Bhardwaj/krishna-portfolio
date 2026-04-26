'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { certifications } from '@/lib/data/krishna';

export default function Certifications() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="certifications" ref={ref} className="reveal kp-section">
      <div className="section-head">
        <span className="sigil">$</span>
        <span>ls ./certs</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {certifications.map((c) => (
          <div key={c.name} style={{ padding: '4px 0' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 4 }}>
              <span style={{
                display: 'inline-block', fontSize: 10, padding: '3px 8px', marginRight: 10,
                border: `1px solid ${c.validUntil ? 'var(--warn)' : 'var(--accent)'}`,
                color: c.validUntil ? 'var(--warn)' : 'var(--accent)',
                borderRadius: 3, letterSpacing: '0.08em', verticalAlign: 2, whiteSpace: 'nowrap',
              }}>
                {c.validUntil ? '[ LIVE ]' : '[ OK ]'}
              </span>
              <span style={{ fontWeight: 500, color: 'var(--fg-1)' }}>{c.name}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', margin: '2px 0 6px', paddingLeft: 2 }}>
              {c.issuer} · {c.year}
              {c.validUntil ? ` · Valid until ${c.validUntil}` : ''}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-2)' }}>
              {c.description}
            </div>
          </div>
        ))}

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)', paddingTop: 4 }}>
          🔄{'  '}More certifications incoming — be patient.
        </div>
      </div>
    </section>
  );
}
