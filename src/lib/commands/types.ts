import { ReactNode } from 'react';

export type OutputLineType = 'input' | 'output' | 'error' | 'system' | 'success';

export interface OutputLine {
  id: string;
  type: OutputLineType;
  content: ReactNode;
  delay?: number;
  isPrompt?: boolean;
  isDownloadButton?: boolean;
  isExternalLink?: string;
  triggerCommand?: string; // clicking the line runs this command silently
}

export interface CommandDef {
  description: string;
  usage?: string;
  execute: (args: string[], addLines: (lines: OutputLine[]) => void) => OutputLine[];
}

export interface TerminalState {
  lines: OutputLine[];
  isBooting: boolean;
  commandHistory: string[];
  historyIndex: number;
  showMatrix: boolean;
  showConfetti: boolean;
  addLines: (lines: OutputLine[]) => void;
  clearLines: () => void;
  setBooting: (v: boolean) => void;
  addToHistory: (cmd: string) => void;
  setHistoryIndex: (i: number) => void;
  triggerMatrix: () => void;
  triggerConfetti: () => void;
  resetMatrix: () => void;
  resetConfetti: () => void;
}
