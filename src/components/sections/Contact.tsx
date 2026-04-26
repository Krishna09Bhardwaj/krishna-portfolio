'use client';
import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { bio } from '@/lib/data/krishna';

interface Field { value: string; error: boolean; }

const initField = (): Field => ({ value: '', error: false });

export default function Contact() {
  const ref = useScrollReveal<HTMLElement>();
  const [name,    setName]    = useState<Field>(initField());
  const [email,   setEmail]   = useState<Field>(initField());
  const [message, setMessage] = useState<Field>(initField());
  const [log,     setLog]     = useState<{ text: string; ok: boolean }[]>([]);
  const [sending, setSending] = useState(false);

  const submit = () => {
    const ne = name.value.trim() === '';
    const ee = email.value.trim() === '';
    const me = message.value.trim() === '';
    setName((f)    => ({ ...f, error: ne }));
    setEmail((f)   => ({ ...f, error: ee }));
    setMessage((f) => ({ ...f, error: me }));
    if (ne || ee || me) return;

    setSending(true);
    setLog([{ text: 'Establishing connection...', ok: false }]);
    setTimeout(() => setLog((l) => [...l, { text: `Routing to ${bio.email}...`, ok: false }]), 600);
    setTimeout(() => setLog((l) => [...l, { text: 'Encrypting payload...', ok: false }]), 1200);
    setTimeout(() => {
      setLog((l) => [...l, { text: '✓ Message sent. Krishna will get back to you.', ok: true }]);
      setSending(false);
      window.open(
        `mailto:${bio.email}?subject=Opportunity for Krishna Bhardwaj&body=Hi Krishna,%0A%0A${encodeURIComponent(message.value)}%0A%0A— ${encodeURIComponent(name.value)} (${encodeURIComponent(email.value)})`,
        '_blank',
        'noopener,noreferrer',
      );
    }, 2000);
  };

  const fieldBox = (hasError: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px',
    background: 'var(--glass-1)',
    border: `1px solid ${hasError ? 'var(--error)' : 'var(--glass-border)'}`,
    borderRadius: 4,
    transition: 'border-color 200ms, box-shadow 200ms',
    boxShadow: hasError ? '0 0 10px rgba(255,107,107,0.15)' : 'none',
  });

  const inputBase: React.CSSProperties = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--fg-1)', fontFamily: 'var(--font-mono)', fontSize: 13,
    paddingTop: 2,
  };

  return (
    <section id="contact" ref={ref} className="reveal kp-section">
      <div className="section-head">
        <span className="sigil">./</span>
        <span>contact</span>
      </div>

      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)', marginBottom: 4 }}>
          $ ./send_message.sh
        </div>

        {/* Name */}
        <div style={fieldBox(name.error)}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13, paddingTop: 2 }}>{'>'}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', minWidth: 68, paddingTop: 2 }}>name</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-dim)', paddingTop: 2 }}>=</span>
          <input
            style={inputBase}
            value={name.value}
            onChange={(e) => setName({ value: e.target.value, error: false })}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div style={fieldBox(email.error)}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13, paddingTop: 2 }}>{'>'}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', minWidth: 68, paddingTop: 2 }}>email</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-dim)', paddingTop: 2 }}>=</span>
          <input
            style={inputBase}
            type="email"
            value={email.value}
            onChange={(e) => setEmail({ value: e.target.value, error: false })}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        {/* Message */}
        <div style={fieldBox(message.error)}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13, paddingTop: 2 }}>{'>'}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', minWidth: 68, paddingTop: 2 }}>message</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-dim)', paddingTop: 2 }}>=</span>
          <textarea
            style={{ ...inputBase, resize: 'vertical', minHeight: '5em' }}
            value={message.value}
            onChange={(e) => setMessage({ value: e.target.value, error: false })}
            placeholder="What's on your mind?"
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={submit}
            disabled={sending}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 18px',
              borderRadius: 4, background: 'var(--accent-soft)',
              border: '1px solid var(--accent-line)', color: 'var(--accent)',
              cursor: sending ? 'wait' : 'pointer',
              boxShadow: 'var(--glow-accent)',
              transition: 'background 200ms, box-shadow 200ms',
              opacity: sending ? 0.65 : 1,
            }}
            onMouseEnter={(e) => { if (!sending) e.currentTarget.style.background = 'rgba(0,255,159,0.22)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
          >
            ./send_message.sh
          </button>
          <a
            href={`mailto:${bio.email}?subject=Opportunity for Krishna Bhardwaj`}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 18px',
              borderRadius: 4, background: 'var(--glass-1)',
              border: '1px solid var(--glass-border)', color: 'var(--fg-1)',
              textDecoration: 'none',
            }}
          >
            direct email
          </a>
        </div>

        {/* Terminal log */}
        {log.length > 0 && (
          <div style={{
            marginTop: 6, padding: 14,
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--glass-border)',
            borderRadius: 4, fontSize: 12,
            fontFamily: 'var(--font-mono)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {log.map((l, i) => (
              <div key={i} style={{ color: l.ok ? 'var(--accent)' : 'var(--fg-2)' }}>{l.text}</div>
            ))}
          </div>
        )}

        {/* Direct links */}
        <div style={{
          marginTop: 14, paddingTop: 14,
          borderTop: '1px dashed var(--glass-border)',
          fontFamily: 'var(--font-mono)', fontSize: 12,
          display: 'flex', flexDirection: 'column', gap: 5,
          color: 'var(--fg-muted)',
        }}>
          <div>
            Email →{' '}
            <a href={`mailto:${bio.email}`} style={{ color: 'var(--accent)' }}>{bio.email}</a>
          </div>
          <div>
            GitHub →{' '}
            <a href={bio.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
              {bio.github.replace('https://', '')}
            </a>
          </div>
          <div>
            LinkedIn →{' '}
            <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
              {bio.linkedin.replace('https://', '')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
