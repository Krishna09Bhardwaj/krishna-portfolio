'use client';
import dynamic from 'next/dynamic';

const ParticleField = dynamic(
  () => import('@/components/background/ParticleField'),
  { ssr: false },
);

const Terminal = dynamic(
  () => import('@/components/terminal/Terminal'),
  { ssr: false },
);

export default function Home() {
  return (
    <main
      style={{
        background: '#0a0e1a',
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial gradient backdrop — deep navy bleeding through */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at 15% 60%, rgba(26,35,126,0.18) 0%, transparent 55%),' +
            'radial-gradient(ellipse at 85% 20%, rgba(0,255,136,0.04) 0%, transparent 45%),' +
            'radial-gradient(ellipse at 50% 90%, rgba(26,35,126,0.10) 0%, transparent 50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Three.js particle field */}
      <ParticleField />

      {/* Terminal interface */}
      <div style={{ position: 'relative', zIndex: 10, height: '100dvh' }}>
        <Terminal />
      </div>
    </main>
  );
}
