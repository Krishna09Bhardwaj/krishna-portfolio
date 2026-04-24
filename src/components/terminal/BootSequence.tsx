'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/store/terminalStore';

// Block-letter ASCII — hand-verified, every row 60 chars wide
// KRISHNA (6 rows) then blank then BHARDWAJ (6 rows)
const ASCII_ART = `
 ██╗  ██╗██████╗ ██╗███████╗██╗  ██╗███╗   ██╗ █████╗
 ██║ ██╔╝██╔══██╗██║██╔════╝██║  ██║████╗  ██║██╔══██╗
 █████╔╝ ██████╔╝██║███████╗███████║██╔██╗ ██║███████║
 ██╔═██╗ ██╔══██╗██║╚════██║██╔══██║██║╚██╗██║██╔══██║
 ██║  ██╗██║  ██║██║███████║██║  ██║██║ ╚████║██║  ██║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝

 ██████╗ ██╗  ██╗ █████╗ ██████╗ ██████╗ ██╗    ██╗ █████╗      ██╗
 ██╔══██╗██║  ██║██╔══██╗██╔══██╗██╔══██╗██║    ██║██╔══██╗     ██║
 ██████╔╝███████║███████║██████╔╝██║  ██║██║ █╗ ██║███████║     ██║
 ██╔══██╗██╔══██║██╔══██║██╔══██╗██║  ██║██║███╗██║██╔══██║██   ██║
 ██████╔╝██║  ██║██║  ██║██║  ██║██████╔╝╚███╔███╔╝██║  ██║╚█████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝ ╚════╝`.trim();

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
  tag?: string;
  isAscii?: boolean;
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
    { text: 'Booting portfolio.sh...',                     tag: '[ OK ]',      delay: 0 },
    { text: 'Loading: krishna.config',                     tag: '[ OK ]',      delay: 160 },
    { text: 'Mounting: /projects /skills /experience',     tag: '[ OK ]',      delay: 320 },
    { text: 'Checking caffeine levels...',                  tag: '[ HIGH ]',    delay: 480 },
    { text: 'Verifying deadline pressure...',              tag: '[ OPTIMAL ]', delay: 640 },
    { text: 'IEEE paper found in /research',               tag: '[ OK ]',      delay: 800 },
    { text: 'Internship active — JineeGreenCard',          tag: '[ LIVE ]',    delay: 960 },
    { text: 'Warning: This terminal bites back.',          tag: '[ !! ]',      delay: 1120 },
    { text: 'System ready.',                               tag: '',            delay: 1280 },
    { text: '',                                                                delay: 1380 },
    { text: '__ASCII__',                                   isAscii: true,      delay: 1460 },
    { text: '',                                                                delay: 1880 },
    { text: `Last login: ${ts} IST on ttys001`,                               delay: 1980 },
    { text: '',                                                                delay: 2080 },
    { text: "  Type 'help' to see all commands, or 'ls' to get started.",     delay: 2160 },
    { text: '',                                                                delay: 2260 },
  ];
}

export default function BootSequence() {
  const [visibleCount, setVisibleCount] = useState(0);
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
              transition={{ duration: 0.3 }}
              style={{
                fontSize: isWide ? '8px' : '13px',
                lineHeight: isWide ? '1.2' : '1.55',
                color: '#00ff88',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                whiteSpace: 'pre',
                display: 'block',
                overflowX: 'auto',
                textShadow: '0 0 8px rgba(0,255,136,0.55)',
                marginBottom: '4px',
              }}
            >
              {isWide ? ASCII_ART : ASCII_ART_NARROW}
            </motion.div>
          );
        }

        const tagColor = bl.tag === '[ !! ]' ? '#ff6b6b'
          : bl.tag === '[ HIGH ]' || bl.tag === '[ OPTIMAL ]' || bl.tag === '[ LIVE ]' ? '#ffd54f'
          : '#00ff88';

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            style={{
              fontSize: '14px',
              lineHeight: '1.65',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              whiteSpace: 'pre',
              color: bl.text === '' ? 'transparent' : '#e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            {bl.text || ' '}
            {bl.tag ? (
              <span style={{ color: tagColor, flexShrink: 0 }}>{bl.tag}</span>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
