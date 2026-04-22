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

const CLICKABLE_CMDS = [
  'help', 'ls', 'whois', 'cat', 'open', 'contact', 'github',
  'linkedin', 'clear', 'uptime', 'ping', 'whoami', 'ssh',
  'sudo', 'matrix', 'history',
];

function isClickable(content: unknown): string | null {
  if (typeof content !== 'string') return null;
  const match = content.match(/^\s{2,}([\w]+)/);
  if (!match) return null;
  const word = match[1].toLowerCase();
  if (CLICKABLE_CMDS.includes(word)) return word;
  return null;
}

export default function OutputLineComponent({ line, index, onCommandClick }: Props) {
  const clickCmd = isClickable(line.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, delay: Math.min(index * 0.012, 0.4) }}
      className={[
        'whitespace-pre-wrap break-words leading-relaxed text-sm font-mono line-enter select-text',
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
