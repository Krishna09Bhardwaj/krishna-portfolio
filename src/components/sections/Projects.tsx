'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { projects } from '@/lib/data/krishna';

const CODE_BG: Record<string, string> = {
  pipeline: `from kafka import KafkaConsumer\nimport pyspark\n\nconsumer = KafkaConsumer(\n    'events',\n    bootstrap_servers=['localhost:9092']\n)\n\nfor msg in consumer:\n    process(msg.value)\n    sink.write(msg)`,
  dashboard: `import pandas as pd\n\ndf = pd.read_sql(\n    "SELECT region, SUM(revenue)"\n    " FROM sales GROUP BY region",\n    con=engine\n)\n\ndf.to_powerbi(workspace_id)`,
  realive: `import cv2, mediapipe as mp\n\nmp_pose = mp.solutions.pose\ncap = cv2.VideoCapture(0)\n\nwith mp_pose.Pose() as pose:\n    while cap.isOpened():\n        ret, frame = cap.read()\n        results = pose.process(frame)`,
};

function toFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '') + '.py';
}

export default function Projects() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="projects" ref={ref} className="reveal kp-section">
      <div className="section-head">
        <span className="sigil">&gt;</span>
        <span>projects</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 18,
      }}>
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} codeBg={CODE_BG[p.id] ?? ''} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project: p,
  codeBg,
}: {
  project: typeof projects[0];
  codeBg: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--glass-1)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 6,
        boxShadow: 'var(--shadow-glass)',
        overflow: 'hidden',
        transition: 'border-color 200ms, box-shadow 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-line)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glass), 0 0 20px rgba(0,255,159,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
      }}
    >
      {/* Code watermark */}
      <pre style={{
        position: 'absolute', inset: 0, margin: 0,
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--fg-faint)', opacity: 0.09,
        padding: 24, whiteSpace: 'pre', pointerEvents: 'none', overflow: 'hidden',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 65%)',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 65%)',
      }}>
        {codeBg}
      </pre>

      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 14px',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        {(['#ff6b6b', '#fbbf24', '#00ff9f'] as const).map((c) => (
          <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', opacity: 0.85 }} />
        ))}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-dim)', marginLeft: 8 }}>
          {toFilename(p.name)}
        </span>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', padding: '20px 22px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, color: 'var(--fg-1)', fontWeight: 500 }}>
            {p.name}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-dim)' }}>
            {p.date}
          </span>
        </div>

        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.55, marginBottom: 14 }}>
          {p.description}
        </p>

        {/* Stack pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {p.stack.map((s) => (
            <span key={s} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '3px 8px',
              background: 'var(--glass-2)', border: '1px solid var(--glass-border)',
              borderRadius: 4, color: 'var(--fg-2)',
            }}>
              [{s}]
            </span>
          ))}
        </div>

        {/* Metrics */}
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
          {p.metrics.map((m) => (
            <li key={m}><span style={{ color: 'var(--accent)' }}>✓</span>{'  '}{m}</li>
          ))}
        </ul>

        {/* Footer link */}
        <div style={{ paddingTop: 12, borderTop: '1px dashed var(--glass-border)' }}>
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)', textDecoration: 'none' }}
          >
            → github
          </a>
        </div>
      </div>
    </div>
  );
}
