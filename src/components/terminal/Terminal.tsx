'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminalStore';
import { commandRegistry } from '@/lib/commands/index';
import { OutputLine } from '@/lib/commands/types';
import { bio } from '@/lib/data/krishna';
import BootSequence from './BootSequence';
import OutputLineComponent from './OutputLine';
import CommandInput from './CommandInput';
import QuickCommands from '@/components/mobile/QuickCommands';
import MatrixRain from '@/components/effects/MatrixRain';
import ConfettiEffect from '@/components/effects/ConfettiEffect';

let lineId = 0;
function uid() { return `t${++lineId}-${Date.now()}`; }

function inputEcho(cmd: string): OutputLine {
  return { id: uid(), type: 'input', content: `krishna@portfolio:~$ ${cmd}` };
}

function notFound(cmd: string): OutputLine {
  return {
    id: uid(),
    type: 'error',
    content: `bash: ${cmd}: command not found. Type 'help' for available commands.`,
  };
}

export default function Terminal() {
  const {
    lines,
    isBooting,
    addLines,
    clearLines,
    commandHistory,
    addToHistory,
    showMatrix,
    triggerMatrix,
    showConfetti,
    triggerConfetti,
  } = useTerminalStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = useCallback(
    (rawCmd: string) => {
      const trimmed = rawCmd.trim();
      if (!trimmed) return;

      addToHistory(trimmed);

      const parts = trimmed.toLowerCase().split(/\s+/);
      const cmd   = parts[0];
      const args  = parts.slice(1);

      // Always echo the prompt line first
      addLines([inputEcho(trimmed)]);

      // ── Special in-component handlers ────────────────────────────────

      if (cmd === 'clear') {
        clearLines();
        return;
      }

      if (cmd === 'history') {
        const histLines: OutputLine[] = [
          { id: uid(), type: 'output', content: ' ' },
          ...commandHistory.slice(0, 10).map((h, i) => ({
            id: uid(),
            type: 'output' as const,
            content: `  ${String(i + 1).padStart(3)}  ${h}`,
          })),
          { id: uid(), type: 'output', content: ' ' },
        ];
        addLines(histLines);
        return;
      }

      if (cmd === 'github') {
        window.open(bio.github, '_blank', 'noopener,noreferrer');
        addLines([{
          id: uid(),
          type: 'system',
          content: `  Opening ${bio.github} in new tab...`,
        }]);
        return;
      }

      if (cmd === 'linkedin') {
        window.open(bio.linkedin, '_blank', 'noopener,noreferrer');
        addLines([{
          id: uid(),
          type: 'system',
          content: `  Opening ${bio.linkedin} in new tab...`,
        }]);
        return;
      }

      if (cmd === 'matrix') {
        addLines([{
          id: uid(),
          type: 'system',
          content: '  Entering the Matrix...  (hold on for 5 seconds)',
        }]);
        triggerMatrix();
        return;
      }

      if (cmd === 'sudo' && args[0] === 'hire' && args[1] === 'krishna') {
        const handler = commandRegistry.get('sudo');
        if (handler) {
          addLines(handler.execute(args, addLines));
          triggerConfetti();
        }
        return;
      }

      if (cmd === 'cat' && args[0] === 'resume') {
        const handler = commandRegistry.get('cat');
        if (handler) {
          addLines(handler.execute(args, addLines)); // makeResumeLines() inside
          // Trigger PDF download after a short delay
          setTimeout(() => {
            const a = document.createElement('a');
            a.href     = '/resume.pdf';
            a.download = 'Krishna_Bhardwaj_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, 600);
        }
        return;
      }

      if (cmd === 'ssh' && args[0] === 'connect') {
        const handler = commandRegistry.get('ssh');
        if (handler) {
          addLines(handler.execute(args, addLines));
          // Open mailto after the animation plays
          setTimeout(() => {
            window.open(
              `mailto:${bio.email}?subject=Opportunity for Krishna Bhardwaj&body=Hi Krishna,`,
              '_blank',
              'noopener,noreferrer',
            );
          }, 2200);
        }
        return;
      }

      // ── Registry lookup ───────────────────────────────────────────────
      const handler = commandRegistry.get(cmd);
      if (handler) {
        const result = handler.execute(args, addLines);
        addLines(result);
      } else {
        addLines([notFound(trimmed)]);
      }
    },
    [addLines, clearLines, commandHistory, addToHistory, triggerMatrix, triggerConfetti],
  );

  return (
    <>
      {showMatrix  && <MatrixRain />}
      {showConfetti && <ConfettiEffect />}

      <div className="terminal-wrapper">
        {isBooting ? (
          <BootSequence />
        ) : (
          <>
            <div className="terminal-output">
              {lines.map((line, i) => (
                <OutputLineComponent
                  key={line.id}
                  line={line}
                  index={i}
                  onCommandClick={handleCommand}
                />
              ))}
              <div ref={bottomRef} />
            </div>
            <QuickCommands onCommand={handleCommand} />
            <CommandInput onSubmit={handleCommand} />
          </>
        )}
      </div>
    </>
  );
}
