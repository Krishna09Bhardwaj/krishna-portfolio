'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TerminalWindow from './TerminalWindow';
import { skills } from '@/lib/data/krishna';

function bar(level: number): string {
  const filled = Math.round(level / 5);
  return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

export default function Skills() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="skills" ref={ref} className="reveal kp-section">
      <div className="section-head">
        <span className="sigil">$</span>
        <span>
          skills{' '}
          <span style={{ color: 'var(--fg-dim)', fontSize: 14 }}>--list</span>
        </span>
      </div>

      <TerminalWindow filename="skills.json">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {skills.map((s) => (
            <div key={s.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)' }}>
                  {s.category}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
                  {s.level}%
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg-1)', marginBottom: 5 }}>
                {bar(s.level)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
                {s.items.join('  ·  ')}
              </div>
            </div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}
