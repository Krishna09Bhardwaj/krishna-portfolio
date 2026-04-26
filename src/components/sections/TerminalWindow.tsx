import React from 'react';

interface Props {
  filename?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function TerminalWindow({ filename, children, className = '', style }: Props) {
  return (
    <div className={`tw ${className}`} style={style}>
      <div className="tw-bar">
        <span className="tw-dot" style={{ background: '#ff6b6b' }} />
        <span className="tw-dot" style={{ background: '#fbbf24' }} />
        <span className="tw-dot" style={{ background: '#00ff9f' }} />
        {filename && <span className="tw-filename">{filename}</span>}
      </div>
      <div className="tw-body">{children}</div>
    </div>
  );
}
