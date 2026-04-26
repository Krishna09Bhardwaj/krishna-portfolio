'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { bio, research } from '@/lib/data/krishna';

const ASCII = `
 ██╗  ██╗██████╗ ██╗███████╗██╗  ██╗███╗   ██╗ █████╗
 ██║ ██╔╝██╔══██╗██║██╔════╝██║  ██║████╗  ██║██╔══██╗
 █████╔╝ ██████╔╝██║███████╗███████║██╔██╗ ██║███████║
 ██╔═██╗ ██╔══██╗██║╚════██║██╔══██║██║╚██╗██║██╔══██║
 ██║  ██╗██║  ██║██║███████║██║  ██║██║ ╚████║██║  ██║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝`.trim();

export default function About() {
  const ref = useScrollReveal<HTMLElement>();

  const rows: [string, React.ReactNode][] = [
    ['OS',         'Next.js 16 · Vercel'],
    ['Role',       bio.role],
    ['University', bio.educationUniversity],
    ['Degree',     `${bio.education} — CGPA ${bio.cgpa}`],
    ['Location',   bio.location],
    ['Status',     'Available from June 2026'],
    ['Email',      bio.email],
    ['IEEE',       (
      <a
        href={`https://doi.org/${research.doi}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--cyan)', textDecoration: 'underline' }}
      >
        {research.doi}
      </a>
    )],
  ];

  return (
    <section id="about" ref={ref} className="reveal kp-section" style={{ paddingTop: 96 }}>
      <div className="section-head">
        <span className="sigil">//</span>
        <span>about</span>
      </div>

      {/* Neofetch layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 32,
        alignItems: 'start',
        marginBottom: 24,
      }}>
        <pre style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--accent)',
          lineHeight: 1.18,
          textShadow: '0 0 8px var(--accent-glow)',
          whiteSpace: 'pre',
          margin: 0,
        }}>
          {ASCII}
        </pre>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {rows.map(([key, val]) => (
            <div key={key as string}>
              <span style={{ color: 'var(--accent)', display: 'inline-block', width: 100 }}>{key}</span>
              <span style={{ color: 'var(--fg-1)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: 18 }}>
        {bio.summary.map((text, i) =>
          text === '' ? (
            <div key={i} style={{ height: 10 }} />
          ) : (
            <p key={i} style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--fg-2)',
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: 640,
              margin: 0,
            }}>
              {text}
            </p>
          )
        )}
      </div>
    </section>
  );
}
