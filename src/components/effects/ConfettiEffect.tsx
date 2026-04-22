'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTerminalStore } from '@/store/terminalStore';

export default function ConfettiEffect() {
  const resetConfetti = useTerminalStore((s) => s.resetConfetti);

  useEffect(() => {
    const end = Date.now() + 3200;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00ff88', '#4fc3f7', '#ffffff', '#e0e0e0'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00ff88', '#4fc3f7', '#ffffff', '#e0e0e0'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        resetConfetti();
      }
    };

    requestAnimationFrame(frame);
  }, [resetConfetti]);

  return null;
}
