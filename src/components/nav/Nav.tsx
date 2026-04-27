'use client';
import { useState, useEffect } from 'react';

const LINKS = [
  { id: 'about',          label: './about' },
  { id: 'skills',         label: './skills' },
  { id: 'experience',     label: './experience' },
  { id: 'projects',       label: './projects' },
  { id: 'certifications', label: './certs' },
  { id: 'contact',        label: './contact' },
];

export default function Nav() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers = LINKS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -55% 0px' },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Immediately reveal so section is visible during scroll animation
    el.classList.add('visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)', maxWidth: 760, zIndex: 50,
    }}>
      <div style={{
        background: 'rgba(10,14,23,0.70)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 6,
        boxShadow: 'var(--shadow-glass)',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}>
        {/* Brand */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--accent)' }}>krishna</span>
          <span style={{ color: 'var(--fg-dim)' }}>@</span>
          <span>portfolio</span>
          <span style={{ color: 'var(--accent)' }}>:~$</span>
        </div>
        {/* Links */}
        <div style={{ display: 'flex', gap: 18, marginLeft: 'auto', flexWrap: 'wrap' }}>
          {LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--font-mono)', fontSize: 13,
                color: active === id ? 'var(--accent)' : 'var(--fg-muted)',
                textShadow: active === id ? '0 0 6px var(--accent-glow)' : 'none',
                transition: 'color 200ms',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
