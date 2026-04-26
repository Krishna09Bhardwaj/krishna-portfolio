'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TerminalWindow from './TerminalWindow';
import { experience } from '@/lib/data/krishna';

const HASHES = ['a3f9c2b', 'd81e04f', '7cc3a19', 'b2f8e55', '9a1d3c7'];

export default function Experience() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="reveal kp-section">
      <div className="section-head">
        <span className="sigil">$</span>
        <span>
          git log{' '}
          <span style={{ color: 'var(--fg-dim)', fontSize: 14 }}>--oneline</span>
        </span>
      </div>

      <TerminalWindow filename="experience.log">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {experience.map((e, i) => (
            <div key={i}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {HASHES[i] ?? 'a3f9c2b'}
                </span>
                <span style={{ color: 'var(--fg-muted)' }}>(HEAD → main)</span>
                <span style={{ color: 'var(--fg-1)' }}>
                  {e.role} @ {e.company}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10 }}>
                {e.period} · {e.location}
              </div>
              <ul style={{ listStyle: 'none', padding: '0 0 0 24px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {e.highlights.map((h, j) => (
                  <li key={j} style={{ color: 'var(--fg-2)' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span>{'  '}{h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}
