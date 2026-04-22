'use client';

const QUICK_CMDS = [
  'help',
  'whois krishna',
  'ls projects',
  'ls skills',
  'cat resume',
  'ls experience',
  'cat research',
  'contact',
  'sudo hire krishna',
  'matrix',
];

interface Props {
  onCommand: (cmd: string) => void;
}

export default function QuickCommands({ onCommand }: Props) {
  return (
    <div className="quick-commands md:hidden">
      {QUICK_CMDS.map((cmd) => (
        <button
          key={cmd}
          className="quick-cmd-pill"
          onClick={() => onCommand(cmd)}
          type="button"
        >
          {cmd}
        </button>
      ))}
    </div>
  );
}
