'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/store/terminalStore';

const ASCII_ART = String.raw`
 ██╗  ██╗██████╗ ██╗███████╗██╗  ██╗███╗   ██╗ █████╗
 ██║ ██╔╝██╔══██╗██║██╔════╝██║  ██║████╗  ██║██╔══██╗
 █████╔╝ ██████╔╝██║███████╗███████║██╔██╗ ██║███████║
 ██╔═██╗ ██╔══██╗██║╚════██║██╔══██║██║╚██╗██║██╔══██║
 ██║  ██╗██║  ██║██║███████║██║  ██║██║ ╚████║██║  ██║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝

 ██████╗ ██╗  ██╗ █████╗ ██████╗ ██████╗      ██╗
 ██╔══██╗██║  ██║██╔══██╗██╔══██╗██╔══██╗    ███║
 ██████╔╝███████║███████║██████╔╝██║  ██║    ╚██║
 ██╔══██╗██╔══██║██╔══██║██╔══██╗██║  ██║     ██║
 ██████╔╝██║  ██║██║  ██║██║  ██║██████╔╝     ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝      ╚═╝`.trim();

interface BootLine {
  text: string;
  delay: number;
  isAscii?: boolean;
  isFaint?: boolean;
}

function getBootLines(): BootLine[] {
  const ts = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return [
    { text: 'Portfolio OS v2026.04  —  Booting...', delay: 0, isFaint: true },
    { text: 'CPU: DataEngineerCore™ (PySpark-Optimised, 10k events/s)', delay: 100, isFaint: true },
    { text: 'Memory check: 50 GB+ pipeline buffer  [  OK  ]', delay: 220, isFaint: true },
    { text: 'Loading modules: kafka.ko  airflow.ko  snowflake.ko  [  OK  ]', delay: 360, isFaint: true },
    { text: 'Mounting: /projects  /skills  /experience  /research  [  OK  ]', delay: 500, isFaint: true },
    { text: 'Starting network interfaces...  [  OK  ]', delay: 640, isFaint: true },
    { text: '', delay: 760 },
    { text: ASCII_ART, delay: 880, isAscii: true },
    { text: '', delay: 1300 },
    { text: `Last login: ${ts} IST on ttys001`, delay: 1420 },
    { text: '', delay: 1540 },
    { text: "  Type 'help' to see all commands, or 'ls' to get started.", delay: 1640 },
    { text: '', delay: 1760 },
  ];
}

export default function BootSequence() {
  const [visibleCount, setVisibleCount] = useState(0);
  const setBooting = useTerminalStore((s) => s.setBooting);

  const bootLines = getBootLines();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    bootLines.forEach((bl, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === bootLines.length - 1) {
            setTimeout(() => setBooting(false), 350);
          }
        }, bl.delay),
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="terminal-output">
      {bootLines.slice(0, visibleCount).map((bl, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          className={[
            'text-sm leading-relaxed font-mono whitespace-pre',
            bl.isAscii
              ? 'text-[#00ff88] text-[10px] leading-tight'
              : bl.isFaint
              ? 'text-[#4fc3f7] opacity-70'
              : 'text-[#e0e0e0]',
          ].join(' ')}
        >
          {bl.text || ' '}
        </motion.div>
      ))}
    </div>
  );
}
