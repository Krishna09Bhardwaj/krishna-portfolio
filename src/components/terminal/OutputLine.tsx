'use client';
import { motion } from 'framer-motion';
import { OutputLine as OutputLineType } from '@/lib/commands/types';

interface Props {
  line: OutputLineType;
  index: number;
  onCommandClick?: (cmd: string) => void;
}

const typeStyle: Record<OutputLineType['type'], string> = {
  input:   'text-[#00ff88]',
  output:  'text-[#e0e0e0]',
  error:   'text-[#ff6b6b]',
  system:  'text-[#4fc3f7]',
  success: 'text-[#00ff88]',
};

// Extract the full command from a help-menu line: "  cmd args    →  description"
// Returns null for non-clickable lines (descriptions, blanks, placeholders with <>)
function getClickableCmd(content: unknown): string | null {
  if (typeof content !== 'string') return null;
  // Help lines: 2+ leading spaces, command text, 2+ spaces, then "→"
  const m = content.match(/^\s{2,}([a-zA-Z][a-zA-Z\s\-]*?)\s{2,}→/);
  if (m) {
    const cmd = m[1].trim().toLowerCase();
    // Skip template placeholders like "open <id>"
    if (cmd.includes('<') || cmd.includes('>')) return null;
    return cmd;
  }
  return null;
}

function triggerDownload() {
  const a = document.createElement('a');
  a.href = '/resume.pdf';
  a.download = 'Krishna_Bhardwaj_Resume.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const motionProps = (index: number) => ({
  initial: { opacity: 0, y: 3 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.1, delay: Math.min(index * 0.012, 0.4) },
});

export default function OutputLineComponent({ line, index, onCommandClick }: Props) {
  // ── Download button ───────────────────────────────────────────────────────
  if (line.isDownloadButton) {
    return (
      <motion.div {...motionProps(index)}>
        <button
          onClick={triggerDownload}
          className={[
            'whitespace-pre-wrap font-mono text-sm leading-relaxed select-text',
            'text-[#00ff88] cursor-pointer',
            'hover:brightness-150 hover:underline transition-all',
          ].join(' ')}
          style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', display: 'block', width: '100%' }}
          type="button"
          title="Download Resume PDF"
        >
          {line.content}
        </button>
      </motion.div>
    );
  }

  // ── External link ─────────────────────────────────────────────────────────
  if (line.isExternalLink) {
    return (
      <motion.div {...motionProps(index)}>
        <a
          href={line.isExternalLink}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'whitespace-pre-wrap font-mono text-sm leading-relaxed select-text block',
            typeStyle[line.type],
            'hover:brightness-150 hover:underline transition-all cursor-pointer',
          ].join(' ')}
        >
          {line.content}
        </a>
      </motion.div>
    );
  }

  // ── Standard line ─────────────────────────────────────────────────────────
  const clickCmd = getClickableCmd(line.content);

  return (
    <motion.div
      {...motionProps(index)}
      className={[
        'whitespace-pre-wrap break-words leading-relaxed text-sm font-mono select-text',
        typeStyle[line.type],
        clickCmd && onCommandClick
          ? 'cursor-pointer hover:underline hover:brightness-125 transition-all'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        if (clickCmd && onCommandClick) onCommandClick(clickCmd);
      }}
    >
      {line.content}
    </motion.div>
  );
}
