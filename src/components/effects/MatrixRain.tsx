'use client';
import { useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminalStore';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetMatrix = useTerminalStore((s) => s.resetMatrix);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const FONT_SIZE = 14;
    const cols = Math.floor(canvas.width / FONT_SIZE);
    const drops = Array<number>(cols).fill(1);
    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF></?!@#$%^&*';

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    const timeout  = setTimeout(() => {
      clearInterval(interval);
      resetMatrix();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [resetMatrix]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-overlay"
      style={{ opacity: 0.88 }}
      aria-hidden="true"
    />
  );
}
