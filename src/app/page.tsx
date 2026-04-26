'use client';
import dynamic from 'next/dynamic';
import Nav from '@/components/nav/Nav';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), { ssr: false });

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100dvh', position: 'relative' }}>
      <Nav />

      {/* ── Terminal — first viewport ─────────────────────────────────────── */}
      <section
        id="terminal"
        style={{ height: '100dvh', position: 'relative', zIndex: 10 }}
      >
        <Terminal />
      </section>

      {/* ── Glass sections ────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 32px',
      }}>
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />

        <footer style={{
          padding: '32px 0 64px',
          borderTop: '1px dashed var(--glass-border)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-dim)' }}>
            <span style={{ color: 'var(--accent)' }}>krishna@portfolio</span>:~$ logout
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-dim)', marginTop: 6 }}>
            Connection to portfolio closed. Built by hand · 2026.
          </div>
        </footer>
      </div>
    </main>
  );
}
