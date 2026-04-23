'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/store/terminalStore';

// Full block-letter art — 54 chars wide (KRISHNA) + 51 chars wide (BHARDWAJ)
// Rendered at 8.5px so it fits on any screen ≥ 480px wide
const ASCII_ART_FULL = String.raw`
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

// Narrow fallback for mobile / very small viewports
const ASCII_ART_NARROW = `
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   K R I S H N A   B H A R D W A J                ║
  ║                                                   ║
  ║   Data Engineer  ·  IEEE Researcher  ·  2026      ║
  ║   Final Year CSE  @  Chandigarh University        ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝`.trim();

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
    { text: 'CPU: DataEngineerCore™  (PySpark-Optimised, 10k events/s)', delay: 100, isFaint: true },
    { text: 'Memory check: 50 GB+ pipeline buffer  [  OK  ]', delay: 220, isFaint: true },
    { text: 'Loading modules: kafka.ko  airflow.ko  snowflake.ko  [  OK  ]', delay: 360, isFaint: true },
    { text: 'Mounting: /projects  /skills  /experience  /research  [  OK  ]', delay: 500, isFaint: true },
    { text: 'Starting network interfaces...  [  OK  ]', delay: 640, isFaint: true },
    { text: '', delay: 760 },
    { text: '__ASCII__', delay: 880, isAscii: true },
    { text: '', delay: 1320 },
    { text: `Last login: ${ts} IST on ttys001`, delay: 1440 },
    { text: '', delay: 1560 },
    { text: "  Type 'help' to see all commands, or 'ls' to get started.", delay: 1660 },
    { text: '', delay: 1780 },
  ];
}

export default function BootSequence() {
  const [visibleCount, setVisibleCount] = useState(0);
  // Use full art on screens ≥ 600px, narrow box on mobile
  const [isWide, setIsWide] = useState(true);
  const setBooting = useTerminalStore((s) => s.setBooting);

  const bootLines = getBootLines();

  useEffect(() => {
    setIsWide(window.innerWidth >= 600);
  }, []);

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
    <div
      className="terminal-output"
      style={{ overflowX: isWide ? 'auto' : 'hidden' }}
    >
      {bootLines.slice(0, visibleCount).map((bl, i) => {
        if (bl.isAscii) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                // Inline style — guaranteed to apply regardless of Tailwind build
                fontSize: isWide ? '8.5px' : '13px',
                lineHeight: isWide ? '1.22' : '1.55',
                color: '#00ff88',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                whiteSpace: 'pre',
                display: 'block',
                overflowX: 'auto',
                textShadow: '0 0 8px rgba(0,255,136,0.55)',
              }}
            >
              {isWide ? ASCII_ART_FULL : ASCII_ART_NARROW}
            </motion.div>
          );
        }

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            style={{
              fontSize: '14px',
              lineHeight: '1.65',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              whiteSpace: 'pre',
              color: bl.isFaint ? '#4fc3f7' : '#e0e0e0',
              opacity: bl.isFaint ? 0.75 : 1,
            }}
          >
            {bl.text || ' '}
          </motion.div>
        );
      })}
    </div>
  );
}
