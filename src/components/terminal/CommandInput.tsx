'use client';
import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useCallback,
} from 'react';
import { commandNames } from '@/lib/commands/index';
import { useTerminalStore } from '@/store/terminalStore';
import { sanitizeInput } from '@/lib/utils/sanitize';

interface Props {
  onSubmit: (command: string) => void;
}

export default function CommandInput({ onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandHistory = useTerminalStore((s) => s.commandHistory);
  const historyIndex   = useTerminalStore((s) => s.historyIndex);
  const setHistoryIndex = useTerminalStore((s) => s.setHistoryIndex);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus on any click on the page
  useEffect(() => {
    const refocus = () => inputRef.current?.focus();
    window.addEventListener('click', refocus);
    return () => window.removeEventListener('click', refocus);
  }, []);

  const updateSuggestions = useCallback((v: string) => {
    const trimmed = v.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    const matches = commandNames.filter(
      (c) => c.startsWith(trimmed) && c !== trimmed,
    );
    setSuggestions(matches.slice(0, 8));
    setActiveSuggestion(0);
  }, []);

  const handleChange = (raw: string) => {
    setValue(raw);
    updateSuggestions(raw);
  };

  const submit = (cmd: string) => {
    const safe = sanitizeInput(cmd);
    if (!safe) return;
    onSubmit(safe);
    setValue('');
    setSuggestions([]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0 && activeSuggestion >= 0) {
        // if user pressed enter on an autocomplete hint, submit that
        const sel = suggestions[activeSuggestion];
        if (value.trim() !== sel) {
          // only autocomplete if they haven't typed the full cmd yet
        }
      }
      submit(value);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setValue(suggestions[activeSuggestion]);
        setSuggestions([]);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestion((p) => (p - 1 + suggestions.length) % suggestions.length);
        return;
      }
      const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIdx);
      setValue(commandHistory[nextIdx] ?? '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestion((p) => (p + 1) % suggestions.length);
        return;
      }
      const nextIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIdx);
      setValue(nextIdx === -1 ? '' : commandHistory[nextIdx] ?? '');
      return;
    }

    if (e.key === 'Escape') {
      setSuggestions([]);
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onSubmit('clear');
      setValue('');
      setSuggestions([]);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {suggestions.length > 0 && (
        <div className="autocomplete">
          {suggestions.map((s, i) => (
            <div
              key={s}
              className={`autocomplete-item${i === activeSuggestion ? ' active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                setValue(s);
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
      <div className="terminal-input-row">
        <span className="prompt">krishna@portfolio:~$&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
        <span className="cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
