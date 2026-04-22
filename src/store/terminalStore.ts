import { create } from 'zustand';
import { TerminalState, OutputLine } from '@/lib/commands/types';

export const useTerminalStore = create<TerminalState>((set) => ({
  lines: [],
  isBooting: true,
  commandHistory: [],
  historyIndex: -1,
  showMatrix: false,
  showConfetti: false,

  addLines: (newLines: OutputLine[]) =>
    set((state) => ({ lines: [...state.lines, ...newLines] })),

  clearLines: () => set({ lines: [] }),

  setBooting: (v: boolean) => set({ isBooting: v }),

  addToHistory: (cmd: string) =>
    set((state) => ({
      commandHistory: [cmd, ...state.commandHistory.slice(0, 49)],
      historyIndex: -1,
    })),

  setHistoryIndex: (i: number) => set({ historyIndex: i }),

  triggerMatrix: () => set({ showMatrix: true }),
  resetMatrix: () => set({ showMatrix: false }),

  triggerConfetti: () => set({ showConfetti: true }),
  resetConfetti: () => set({ showConfetti: false }),
}));
