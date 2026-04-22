# Terminal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive terminal-style developer portfolio for Krishna Bhardwaj — deployed on Vercel, 20+ commands, Three.js particle background, mobile responsive.

**Architecture:** Custom React terminal (no xterm.js rendering) with Zustand state, command registry pattern, line-by-line Framer Motion animations, and a Three.js `@react-three/fiber` particle field background. Single Next.js App Router page.

**Tech Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS 4 · Three.js + @react-three/fiber + @react-three/drei · Framer Motion · Zustand · canvas-confetti · Lucide React · clsx + tailwind-merge

---

## File Map

| File | Responsibility |
|---|---|
| `src/app/layout.tsx` | Root layout — JetBrains Mono font, SEO meta, Analytics |
| `src/app/page.tsx` | Single page — positions Background + Terminal |
| `src/app/globals.css` | CRT scanlines, custom scrollbar, keyframe animations |
| `src/lib/data/krishna.ts` | All portfolio data (bio, projects, skills, certs) |
| `src/lib/commands/types.ts` | CommandDef, OutputLine, TerminalState types |
| `src/lib/commands/handlers.ts` | All 20+ command handler functions |
| `src/lib/commands/index.ts` | Command registry Map |
| `src/lib/utils/sanitize.ts` | Strip HTML/script from user input |
| `src/lib/utils/cn.ts` | clsx + tailwind-merge helper |
| `src/store/terminalStore.ts` | Zustand store — lines, booting, effects, history |
| `src/hooks/useTerminal.ts` | Command dispatch, input handling, autocomplete |
| `src/components/background/ParticleField.tsx` | Three.js canvas particle animation |
| `src/components/terminal/BootSequence.tsx` | Timed boot lines + ASCII art |
| `src/components/terminal/OutputLine.tsx` | Single animated output line |
| `src/components/terminal/CommandInput.tsx` | Input bar — history nav, tab autocomplete |
| `src/components/terminal/Terminal.tsx` | Orchestrates boot → idle → command loop |
| `src/components/effects/MatrixRain.tsx` | Canvas matrix rain (5s Easter egg) |
| `src/components/effects/ConfettiEffect.tsx` | canvas-confetti wrapper |
| `src/components/mobile/QuickCommands.tsx` | Horizontal scrollable command pills |
| `public/robots.txt` | Allow all crawlers |
| `public/resume.pdf` | Placeholder PDF |
| `vercel.json` | Vercel config |
| `krishna.md` | Session log |
| `README.md` | Project README |

---

## Task 1: Project Setup

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `.gitignore`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd /Users/krishnabhardwaj/developer/my-portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes --no-git
```

Expected: Next.js project created with `src/` directory, `app/` router, TypeScript, Tailwind.

- [ ] **Step 2: Install all dependencies**

```bash
npm install framer-motion @xterm/xterm @xterm/addon-fit @xterm/addon-web-links three @types/three @react-three/fiber @react-three/drei zustand next-themes @vercel/analytics clsx tailwind-merge react-syntax-highlighter @types/react-syntax-highlighter lucide-react canvas-confetti @types/canvas-confetti
```

- [ ] **Step 3: Verify install**

```bash
npm run build 2>&1 | tail -5
```

Expected: build succeeds (default Next.js page).

- [ ] **Step 4: Set git remote**

```bash
git remote add origin https://github.com/Krishna09Bhardwaj/krishna-portfolio.git 2>/dev/null || git remote set-url origin https://github.com/Krishna09Bhardwaj/krishna-portfolio.git
```

---

## Task 2: Types and Data Layer

**Files:**
- Create: `src/lib/commands/types.ts`
- Create: `src/lib/data/krishna.ts`
- Create: `src/lib/utils/cn.ts`
- Create: `src/lib/utils/sanitize.ts`

- [ ] **Step 1: Create type definitions**

Create `src/lib/commands/types.ts`:

```typescript
import { ReactNode } from 'react';

export type OutputLineType = 'input' | 'output' | 'error' | 'system' | 'success';

export interface OutputLine {
  id: string;
  type: OutputLineType;
  content: ReactNode;
  delay?: number;
  isPrompt?: boolean;
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
```

- [ ] **Step 2: Create portfolio data**

Create `src/lib/data/krishna.ts`:

```typescript
export const bio = {
  name: 'Krishna Bhardwaj',
  role: 'Data Engineer',
  education: 'Final Year CSE @ Chandigarh University',
  location: 'Chandigarh, Punjab, India',
  email: 'krishna09bhardwaj@gmail.com',
  phone: '+91 70730-70311',
  github: 'https://github.com/Krishna09Bhardwaj',
  linkedin: 'https://linkedin.com/in/krishna-bhardwaj-16306824a',
  summary: [
    'Final-year Computer Science engineer specialising in Big Data Analytics.',
    'Expert in real-time data pipelines, ETL workflows, and transforming',
    'large-scale datasets into actionable intelligence.',
    'Published IEEE researcher. Active industry experience in automation',
    'integrations and analytics-instrumented web platforms.',
  ],
};

export const skills = [
  { category: 'Languages',      items: ['Python', 'SQL', 'Bash'],                                          level: 90 },
  { category: 'Data Platforms', items: ['Apache Kafka', 'PySpark', 'Airflow', 'Hadoop', 'Snowflake'],      level: 85 },
  { category: 'Infra & DevOps', items: ['PostgreSQL', 'Docker', 'Linux', 'Git'],                           level: 80 },
  { category: 'Visualization',  items: ['Power BI', 'OpenCV'],                                             level: 75 },
  { category: 'Web',            items: ['Node.js', 'Express.js', 'Next.js'],                               level: 65 },
];

export const projects = [
  {
    id: 'pipeline',
    name: 'Real-Time Data Pipeline',
    date: 'Nov 2025',
    stack: ['Kafka', 'PySpark', 'Airflow', 'Snowflake', 'Docker'],
    description: 'End-to-end streaming data pipeline handling massive throughput with full fault tolerance.',
    metrics: [
      '10,000+ events/minute throughput',
      '<2 second end-to-end latency',
      '50 GB+ data processed',
      '100% recoverability with checkpointing',
    ],
    github: 'https://github.com/Krishna09Bhardwaj',
  },
  {
    id: 'dashboard',
    name: 'Sales Insight Dashboard',
    date: 'Jun 2025',
    stack: ['Python', 'Power BI', 'SQL'],
    description: 'Interactive analytics dashboard transforming raw sales data into strategic insights.',
    metrics: [
      '95% data quality improvement',
      '50% faster insight generation',
      'Identified 12% regional sales gap',
      'Automated ETL reducing manual work by 80%',
    ],
    github: 'https://github.com/Krishna09Bhardwaj',
  },
  {
    id: 'realive',
    name: 'Re-Alive – Real-Time Animation Tool',
    date: 'Dec 2024',
    stack: ['Python', 'OpenCV', 'Mediapipe', 'PyQt'],
    description: 'Real-time motion capture and animation tool using computer vision.',
    metrics: [
      '30+ FPS real-time rendering',
      'Sub-50ms motion capture latency',
      '35% improvement in animation realism',
      'Desktop GUI with PyQt5',
    ],
    github: 'https://github.com/Krishna09Bhardwaj',
  },
];

export const experience = [
  {
    role: 'Software Developer Intern',
    company: 'JineeGreenCard',
    period: 'Feb 2026 – Present',
    location: 'Remote',
    highlights: [
      'Built real-time WhatsApp monitoring system across 500+ groups',
      'Built and QA\'d meritmap.ai onboarding website end-to-end',
      'Configured Google Analytics for full-funnel conversion tracking',
    ],
  },
];

export const research = {
  title: 'Predicting Network Condition Events Using Supervised Machine Learning',
  journal: 'IEEE',
  date: 'February 2025',
  doi: '10.1109/ACROSET66531.2025.11280883',
  conference: 'ACROSET 2025',
  abstract: 'Research on applying supervised ML algorithms to predict network condition events, enabling proactive network management and reducing downtime.',
};

export const certifications = [
  {
    name: 'Oracle Cloud Infrastructure 2024 Generative AI Certified Professional',
    issuer: 'Oracle',
    year: '2024',
  },
  {
    name: 'Python Data Analytics',
    issuer: 'Coursera',
    year: '2023',
  },
  {
    name: 'Data Science at Scale',
    issuer: 'Coursera',
    year: '2023',
  },
  {
    name: 'Meta Data Analyst',
    issuer: 'Meta / Coursera',
    year: '2023',
  },
];
```

- [ ] **Step 3: Create utility helpers**

Create `src/lib/utils/cn.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `src/lib/utils/sanitize.ts`:
```typescript
export function sanitizeInput(input: string): string {
  return input
    .slice(0, 200)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}
```

- [ ] **Step 4: TypeScript check**

```bash
cd /Users/krishnabhardwaj/developer/my-portfolio && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

## Task 3: Zustand Store

**Files:**
- Create: `src/store/terminalStore.ts`

- [ ] **Step 1: Create store**

Create `src/store/terminalStore.ts`:

```typescript
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

---

## Task 4: Command Registry and Handlers

**Files:**
- Create: `src/lib/commands/handlers.ts`
- Create: `src/lib/commands/index.ts`

- [ ] **Step 1: Create command handlers**

Create `src/lib/commands/handlers.ts`:

```typescript
'use client';
import { OutputLine, CommandDef } from './types';
import { bio, skills, projects, experience, research, certifications } from '@/lib/data/krishna';

let idCounter = 0;
function makeId() { return `line-${++idCounter}-${Date.now()}`; }

function line(content: React.ReactNode, type: OutputLine['type'] = 'output', delay = 0): OutputLine {
  return { id: makeId(), type, content, delay };
}

function blank(): OutputLine {
  return line(' ');
}

function section(text: string): OutputLine {
  return line(text, 'system');
}

// ── help / ls ────────────────────────────────────────────────────────────────
const HELP_LINES = [
  blank(),
  section('┌─────────────────────────────────────────────────────────┐'),
  section('│            KRISHNA@PORTFOLIO — AVAILABLE COMMANDS        │'),
  section('└─────────────────────────────────────────────────────────┘'),
  blank(),
  line('  whois krishna      →  Bio, role, location, summary'),
  line('  cat resume         →  View resume + download PDF'),
  line('  ls projects        →  List all projects'),
  line('  open <name>        →  Open project details  (pipeline|dashboard|realive)'),
  line('  ls skills          →  Skill tree with proficiency bars'),
  line('  ls experience      →  Work experience timeline'),
  line('  cat research       →  IEEE paper details'),
  line('  cat certifications →  All certifications'),
  line('  contact            →  Email, GitHub, LinkedIn'),
  line('  github             →  Open GitHub profile'),
  line('  linkedin           →  Open LinkedIn profile'),
  line('  uptime             →  How long Krishna has been coding'),
  line('  ping krishna       →  Check availability'),
  line('  history            →  Last 10 commands'),
  line('  whoami             →  Philosophical one-liner'),
  line('  ssh connect        →  Open contact form'),
  line('  clear              →  Clear terminal'),
  blank(),
  section('  ── Easter Eggs ──────────────────────────────────────────'),
  line('  sudo hire krishna  →  ???'),
  line('  matrix             →  Enter the matrix'),
  blank(),
];

// ── whois ────────────────────────────────────────────────────────────────────
const WHOIS_LINES = [
  blank(),
  section('╔══════════════════════════════════════════════════════════╗'),
  section('║                    KRISHNA BHARDWAJ                      ║'),
  section('╚══════════════════════════════════════════════════════════╝'),
  blank(),
  line(`  Role        :  ${bio.role}`),
  line(`  Education   :  ${bio.education}`),
  line(`  Location    :  ${bio.location}`),
  line(`  Email       :  ${bio.email}`),
  line(`  Phone       :  ${bio.phone}`),
  blank(),
  section('  Summary:'),
  ...bio.summary.map(s => line(`  ${s}`)),
  blank(),
];

// ── ls projects ──────────────────────────────────────────────────────────────
function makeProjectListLines(): OutputLine[] {
  return [
    blank(),
    section('  Projects — type "open <id>" for full details'),
    blank(),
    ...projects.map(p => line(
      `  [${p.id.padEnd(10)}]  ${p.name.padEnd(35)}  [${p.date}]`
    )),
    blank(),
    line('  Stacks:'),
    ...projects.map(p => line(`  ${p.id.padEnd(12)} ${p.stack.map(s => `[${s}]`).join(' ')}`)),
    blank(),
  ];
}

// ── open <project> ───────────────────────────────────────────────────────────
function makeOpenProjectLines(id: string): OutputLine[] {
  const p = projects.find(pr => pr.id === id);
  if (!p) {
    return [
      blank(),
      line(`  Error: project "${id}" not found.`, 'error'),
      line(`  Available: ${projects.map(pr => pr.id).join(', ')}`),
      blank(),
    ];
  }
  return [
    blank(),
    section(`  ▶ ${p.name}  (${p.date})`),
    blank(),
    line(`  ${p.description}`),
    blank(),
    section('  Stack:'),
    line(`  ${p.stack.map(s => `[${s}]`).join('  ')}`),
    blank(),
    section('  Metrics:'),
    ...p.metrics.map(m => line(`  ✓  ${m}`, 'success')),
    blank(),
    line(`  GitHub → ${p.github}`, 'system'),
    blank(),
  ];
}

// ── ls skills ────────────────────────────────────────────────────────────────
function makeSkillsLines(): OutputLine[] {
  const bar = (pct: number) => {
    const filled = Math.round(pct / 5);
    return '█'.repeat(filled) + '░'.repeat(20 - filled) + `  ${pct}%`;
  };
  return [
    blank(),
    section('  SKILL TREE'),
    blank(),
    ...skills.flatMap(s => [
      section(`  ${s.category}`),
      line(`  ${bar(s.level)}`),
      line(`  ${s.items.join('  ·  ')}`),
      blank(),
    ]),
  ];
}

// ── ls experience ────────────────────────────────────────────────────────────
function makeExperienceLines(): OutputLine[] {
  return [
    blank(),
    section('  EXPERIENCE TIMELINE'),
    blank(),
    ...experience.flatMap(e => [
      section(`  ▶ ${e.role}  @  ${e.company}`),
      line(`    ${e.period}  ·  ${e.location}`),
      blank(),
      ...e.highlights.map(h => line(`    ✓  ${h}`, 'success')),
      blank(),
    ]),
  ];
}

// ── cat research ─────────────────────────────────────────────────────────────
const RESEARCH_LINES = [
  blank(),
  section('  PUBLISHED RESEARCH'),
  blank(),
  section(`  "${research.title}"`),
  blank(),
  line(`  Publisher   :  ${research.journal}`),
  line(`  Conference  :  ${research.conference}`),
  line(`  Published   :  ${research.date}`),
  line(`  DOI         :  ${research.doi}`),
  blank(),
  line(`  Abstract:`),
  line(`  ${research.abstract}`),
  blank(),
  line(`  View paper → https://doi.org/${research.doi}`, 'system'),
  blank(),
];

// ── cat certifications ───────────────────────────────────────────────────────
function makeCertLines(): OutputLine[] {
  return [
    blank(),
    section('  CERTIFICATIONS'),
    blank(),
    ...certifications.map((c, i) =>
      line(`  ${String(i + 1).padStart(2)}.  ${c.name}  ·  ${c.issuer}  (${c.year})`)
    ),
    blank(),
  ];
}

// ── contact ──────────────────────────────────────────────────────────────────
const CONTACT_LINES = [
  blank(),
  section('  CONTACT'),
  blank(),
  line(`  Email    →  ${bio.email}`),
  line(`  GitHub   →  ${bio.github}`, 'system'),
  line(`  LinkedIn →  ${bio.linkedin}`, 'system'),
  line(`  Phone    →  ${bio.phone}`),
  blank(),
  line("  Type 'ssh connect' to open the contact form.", 'output'),
  blank(),
];

// ── uptime ───────────────────────────────────────────────────────────────────
function makeUptimeLines(): OutputLine[] {
  const start = new Date('2019-06-01');
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  return [
    blank(),
    line(`  krishna@portfolio — uptime: ${years} years, ${months} months`),
    line(`  System: online since first line of Python (2019)`),
    line(`  Status: currently building real-time data systems`, 'success'),
    blank(),
  ];
}

// ── ping ─────────────────────────────────────────────────────────────────────
const PING_LINES = [
  blank(),
  line('  PING krishna.bhardwaj (available-for-opportunities): 56 bytes'),
  line('  64 bytes from krishna: icmp_seq=1 ttl=64 time=0.1 ms', 'success'),
  line('  64 bytes from krishna: icmp_seq=2 ttl=64 time=0.1 ms', 'success'),
  line('  64 bytes from krishna: icmp_seq=3 ttl=64 time=0.1 ms', 'success'),
  blank(),
  line('  --- krishna ping statistics ---'),
  line('  3 packets transmitted, 3 received, 0% packet loss'),
  line('  PONG — Krishna is available for new opportunities! 🟢', 'success'),
  blank(),
];

// ── whoami ───────────────────────────────────────────────────────────────────
const WHOAMI_LINES = [
  blank(),
  line('  An engineer who turns raw data chaos into structured insight.'),
  line('  Caffeine-powered. Pipeline-obsessed. Latency intolerant.'),
  blank(),
];

// ── sudo hire krishna ────────────────────────────────────────────────────────
const HIRE_LINES = [
  blank(),
  section('  [sudo] password for recruiter: **************'),
  section('  Authenticating...'),
  line('  ✓ Authorization granted — excellent taste confirmed.', 'success'),
  blank(),
  section('  ╔════════════════════════════════════════════════════╗'),
  section('  ║      YOU HAVE DECIDED TO HIRE KRISHNA BHARDWAJ     ║'),
  section('  ║                                                    ║'),
  section('  ║  Specialises in:  Real-time pipelines              ║'),
  section('  ║                   Big Data Engineering             ║'),
  section('  ║                   Distributed Systems              ║'),
  section('  ║                                                    ║'),
  section('  ║  Available:  Immediately                           ║'),
  section('  ║  Contact  :  krishna09bhardwaj@gmail.com           ║'),
  section('  ╚════════════════════════════════════════════════════╝'),
  blank(),
];

// ── ssh connect ──────────────────────────────────────────────────────────────
const SSH_LINES = [
  blank(),
  section('  Establishing secure connection...'),
  line('  ▸ Resolving krishna.bhardwaj...'),
  line('  ▸ Negotiating encryption (AES-256)...'),
  line('  ▸ Verifying host key...'),
  line('  ✓ Connection established!', 'success'),
  blank(),
  line('  Contact form opening...'),
  blank(),
];

// ── cat resume ───────────────────────────────────────────────────────────────
const RESUME_LINES = [
  blank(),
  section('  KRISHNA BHARDWAJ — RESUME'),
  section('  ─────────────────────────────────────────────────'),
  blank(),
  section('  CONTACT'),
  line(`  Email: ${bio.email}  ·  Phone: ${bio.phone}`),
  line(`  GitHub: github.com/Krishna09Bhardwaj  ·  LinkedIn: in/krishna-bhardwaj-16306824a`),
  blank(),
  section('  EDUCATION'),
  line('  B.Tech — Computer Science & Engineering (Hons.)'),
  line('  Chandigarh University  ·  CGPA: 7.38/10  ·  2022–2026'),
  blank(),
  section('  EXPERIENCE'),
  line('  Software Developer Intern — JineeGreenCard  (Feb 2026 – Present)'),
  line('  ✓ Real-time WhatsApp monitoring across 500+ groups', 'success'),
  line('  ✓ Built and QA\'d meritmap.ai onboarding website', 'success'),
  line('  ✓ Google Analytics full-funnel tracking', 'success'),
  blank(),
  section('  SKILLS'),
  line('  Python · SQL · Bash · Kafka · PySpark · Airflow · Snowflake'),
  line('  Docker · PostgreSQL · Linux · Power BI · Node.js · Next.js'),
  blank(),
  section('  ─────────────────────────────────────────────────'),
  line('  ⬇  Downloading resume.pdf...', 'success'),
  blank(),
];

// ── Exports ──────────────────────────────────────────────────────────────────
export {
  HELP_LINES,
  WHOIS_LINES,
  RESEARCH_LINES,
  CONTACT_LINES,
  PING_LINES,
  WHOAMI_LINES,
  HIRE_LINES,
  SSH_LINES,
  RESUME_LINES,
  makeProjectListLines,
  makeOpenProjectLines,
  makeSkillsLines,
  makeExperienceLines,
  makeUptimeLines,
  makeCertLines,
};
```

- [ ] **Step 2: Create command registry**

Create `src/lib/commands/index.ts`:

```typescript
import { CommandDef, OutputLine } from './types';
import {
  HELP_LINES, WHOIS_LINES, RESEARCH_LINES, CONTACT_LINES,
  PING_LINES, WHOAMI_LINES, HIRE_LINES, SSH_LINES, RESUME_LINES,
  makeProjectListLines, makeOpenProjectLines, makeSkillsLines,
  makeExperienceLines, makeUptimeLines, makeCertLines,
} from './handlers';

export const commandRegistry = new Map<string, CommandDef>([
  ['help',   { description: 'Show all available commands', execute: () => HELP_LINES }],
  ['ls',     { description: 'List commands or projects (ls projects)', execute: (args) => args[0] === 'projects' ? makeProjectListLines() : args[0] === 'skills' ? makeSkillsLines() : args[0] === 'experience' ? makeExperienceLines() : HELP_LINES }],
  ['whois',  { description: 'Print bio and summary', usage: 'whois krishna', execute: () => WHOIS_LINES }],
  ['cat',    { description: 'Read a file (cat resume | cat research | cat certifications)', execute: (args) => args[0] === 'resume' ? RESUME_LINES : args[0] === 'research' ? RESEARCH_LINES : args[0] === 'certifications' ? makeCertLines() : [{ id: 'e1', type: 'error' as const, content: `  cat: ${args[0]}: No such file` }] }],
  ['open',   { description: 'Open project detail', usage: 'open pipeline|dashboard|realive', execute: (args) => makeOpenProjectLines(args[0] || '') }],
  ['contact',{ description: 'Show contact info', execute: () => CONTACT_LINES }],
  ['github', { description: 'Open GitHub profile', execute: () => [{ id: `gh-${Date.now()}`, type: 'system' as const, content: '  Opening github.com/Krishna09Bhardwaj ...' }] }],
  ['linkedin',{ description: 'Open LinkedIn profile', execute: () => [{ id: `li-${Date.now()}`, type: 'system' as const, content: '  Opening linkedin.com/in/krishna-bhardwaj-16306824a ...' }] }],
  ['clear',  { description: 'Clear terminal', execute: () => [] }],
  ['uptime', { description: 'How long Krishna has been coding', execute: () => makeUptimeLines() }],
  ['ping',   { description: 'Check availability', usage: 'ping krishna', execute: () => PING_LINES }],
  ['history',{ description: 'Show last 10 commands', execute: () => [] }],
  ['whoami', { description: 'Who are you?', execute: () => WHOAMI_LINES }],
  ['sudo',   { description: 'Elevated privileges', usage: 'sudo hire krishna', execute: (args) => args[0] === 'hire' && args[1] === 'krishna' ? HIRE_LINES : [{ id: `s-${Date.now()}`, type: 'error' as const, content: '  sudo: permission denied. Try: sudo hire krishna' }] }],
  ['matrix', { description: 'Enter the matrix', execute: () => [{ id: `m-${Date.now()}`, type: 'system' as const, content: '  Entering the Matrix...' }] }],
  ['ssh',    { description: 'Connect via SSH', usage: 'ssh connect', execute: (args) => args[0] === 'connect' ? SSH_LINES : [{ id: `ssh-e-${Date.now()}`, type: 'error' as const, content: '  Usage: ssh connect' }] }],
]);

export const commandNames = Array.from(commandRegistry.keys());
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

---

## Task 5: Global Styles, Layout, and Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `public/robots.txt`

- [ ] **Step 1: Rewrite globals.css**

Replace all content in `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a0e1a;
  --green: #00ff88;
  --text: #e0e0e0;
  --cyan: #4fc3f7;
  --red: #ff6b6b;
  --dim: #555;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

/* CRT scanlines */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: var(--green); }

/* Terminal text colors */
.text-green  { color: var(--green); }
.text-cyan   { color: var(--cyan); }
.text-dim    { color: var(--dim); }
.text-error  { color: var(--red); }
.text-system { color: var(--cyan); }
.text-success { color: var(--green); }

/* Cursor blink */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.cursor {
  display: inline-block;
  width: 9px;
  height: 1.1em;
  background: var(--green);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
}

/* Glow effects */
.glow-green { text-shadow: 0 0 8px var(--green); }
.glow-cyan  { text-shadow: 0 0 8px var(--cyan); }

/* Terminal window */
.terminal-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  padding-bottom: 0;
  scroll-behavior: smooth;
}

.terminal-input-row {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  border-top: 1px solid rgba(0, 255, 136, 0.1);
  background: rgba(10, 14, 26, 0.8);
  backdrop-filter: blur(4px);
  position: sticky;
  bottom: 0;
  z-index: 20;
}

.terminal-input-row input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--green);
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  caret-color: var(--green);
}

.prompt {
  color: var(--green);
  margin-right: 0.5rem;
  white-space: nowrap;
  user-select: none;
}

/* Autocomplete dropdown */
.autocomplete {
  position: absolute;
  bottom: 100%;
  left: 1.5rem;
  background: rgba(10, 14, 26, 0.95);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  min-width: 200px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 30;
}
.autocomplete-item {
  padding: 0.3rem 0.75rem;
  cursor: pointer;
  color: var(--text);
  font-size: 13px;
}
.autocomplete-item:hover,
.autocomplete-item.active {
  background: rgba(0, 255, 136, 0.1);
  color: var(--green);
}

/* Matrix canvas overlay */
.matrix-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.line-enter {
  animation: fadeIn 0.15s ease forwards;
}
```

- [ ] **Step 2: Update layout.tsx**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Krishna Bhardwaj | Data Engineer Portfolio',
  description:
    'Final-year CSE @ Chandigarh University. Expert in Apache Kafka, PySpark, Airflow, Snowflake. Published IEEE researcher. Available for Data Engineering roles.',
  keywords: ['Krishna Bhardwaj', 'Data Engineer', 'Kafka', 'PySpark', 'Airflow', 'Snowflake', 'portfolio'],
  authors: [{ name: 'Krishna Bhardwaj' }],
  openGraph: {
    title: 'Krishna Bhardwaj | Data Engineer Portfolio',
    description: 'Real-time data pipelines · ETL workflows · Published IEEE researcher',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create robots.txt**

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://krishna-portfolio.vercel.app/sitemap.xml
```

---

## Task 6: Three.js Particle Background

**Files:**
- Create: `src/components/background/ParticleField.tsx`

- [ ] **Step 1: Create particle field**

Create `src/components/background/ParticleField.tsx`:

```tsx
'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const COUNT = 1200;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = 0;
    }
    return { positions, velocities };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      // wrap around
      if (pos[i * 3] > 20)  pos[i * 3] = -20;
      if (pos[i * 3] < -20) pos[i * 3] = 20;
      if (pos[i * 3 + 1] > 20)  pos[i * 3 + 1] = -20;
      if (pos[i * 3 + 1] < -20) pos[i * 3 + 1] = 20;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#00ff88"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
```

---

## Task 7: Effects — Matrix Rain and Confetti

**Files:**
- Create: `src/components/effects/MatrixRain.tsx`
- Create: `src/components/effects/ConfettiEffect.tsx`

- [ ] **Step 1: Matrix rain canvas**

Create `src/components/effects/MatrixRain.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminalStore';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetMatrix = useTerminalStore(s => s.resetMatrix);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px JetBrains Mono, monospace';
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    const timeout = setTimeout(() => {
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
      style={{ opacity: 0.9 }}
    />
  );
}
```

- [ ] **Step 2: Confetti effect**

Create `src/components/effects/ConfettiEffect.tsx`:

```tsx
'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTerminalStore } from '@/store/terminalStore';

export default function ConfettiEffect() {
  const resetConfetti = useTerminalStore(s => s.resetConfetti);

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00ff88', '#4fc3f7', '#ffffff'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00ff88', '#4fc3f7', '#ffffff'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
      else resetConfetti();
    };

    requestAnimationFrame(frame);
  }, [resetConfetti]);

  return null;
}
```

---

## Task 8: OutputLine Component

**Files:**
- Create: `src/components/terminal/OutputLine.tsx`

- [ ] **Step 1: Create output line**

Create `src/components/terminal/OutputLine.tsx`:

```tsx
'use client';
import { motion } from 'framer-motion';
import { OutputLine as OutputLineType } from '@/lib/commands/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  line: OutputLineType;
  index: number;
  onCommandClick?: (cmd: string) => void;
}

const typeClass: Record<OutputLineType['type'], string> = {
  input:   'text-green glow-green',
  output:  'text-[#e0e0e0]',
  error:   'text-error',
  system:  'text-cyan',
  success: 'text-success',
};

export default function OutputLineComponent({ line, index, onCommandClick }: Props) {
  const isClickableCommand =
    line.type === 'output' &&
    typeof line.content === 'string' &&
    /^\s{2,}(help|ls|whois|cat|open|contact|github|linkedin|clear|uptime|ping|whoami|ssh|sudo|matrix|history)/.test(line.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12, delay: Math.min(index * 0.015, 0.5) }}
      className={cn(
        'whitespace-pre-wrap break-all leading-relaxed text-sm font-mono line-enter',
        typeClass[line.type],
        isClickableCommand && 'cursor-pointer hover:underline hover:text-green transition-colors'
      )}
      onClick={() => {
        if (isClickableCommand && onCommandClick) {
          const match = (line.content as string).match(/^\s+(\S+)/);
          if (match) onCommandClick(match[1]);
        }
      }}
    >
      {line.content}
    </motion.div>
  );
}
```

---

## Task 9: Boot Sequence

**Files:**
- Create: `src/components/terminal/BootSequence.tsx`

- [ ] **Step 1: Create boot sequence**

Create `src/components/terminal/BootSequence.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/store/terminalStore';

const ASCII_ART = `
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
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝      ╚═╝
`.trim();

const BOOT_LINES = [
  { text: 'BIOS Version 2026.04 — Krishna Portfolio OS', delay: 0 },
  { text: 'CPU: Data Engineer Core (PySpark Optimised)', delay: 120 },
  { text: 'Memory: 10K+ events/min buffer allocated...  OK', delay: 240 },
  { text: 'Loading modules: kafka.ko airflow.ko snowflake.ko...  OK', delay: 400 },
  { text: 'Mounting filesystem: /projects /skills /experience...  OK', delay: 560 },
  { text: 'Starting network interfaces...  OK', delay: 720 },
  { text: '', delay: 900 },
  { text: ASCII_ART, delay: 1000, isAscii: true },
  { text: '', delay: 1400 },
  { text: `Last login: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} on ttys001`, delay: 1500 },
  { text: '', delay: 1650 },
  { text: "Welcome. Type 'help' or 'ls' to explore.", delay: 1750 },
  { text: '', delay: 1850 },
];

export default function BootSequence() {
  const [visibleCount, setVisibleCount] = useState(0);
  const setBooting = useTerminalStore(s => s.setBooting);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((bootLine, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === BOOT_LINES.length - 1) {
            setTimeout(() => setBooting(false), 400);
          }
        }, bootLine.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [setBooting]);

  return (
    <div className="terminal-output">
      {BOOT_LINES.slice(0, visibleCount).map((bootLine, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className={`text-sm leading-relaxed font-mono whitespace-pre ${
            bootLine.isAscii ? 'text-green glow-green text-xs' : 'text-cyan'
          }`}
        >
          {bootLine.text || ' '}
        </motion.div>
      ))}
    </div>
  );
}
```

---

## Task 10: Command Input Component

**Files:**
- Create: `src/components/terminal/CommandInput.tsx`

- [ ] **Step 1: Create command input**

Create `src/components/terminal/CommandInput.tsx`:

```tsx
'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
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
  const { commandHistory, historyIndex, setHistoryIndex } = useTerminalStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (v: string) => {
    setValue(v);
    if (v.trim()) {
      const matches = commandNames.filter(c => c.startsWith(v.trim().toLowerCase()));
      setSuggestions(matches.length > 0 && matches[0] !== v.trim() ? matches : []);
    } else {
      setSuggestions([]);
    }
    setActiveSuggestion(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = sanitizeInput(value);
      if (cmd) {
        onSubmit(cmd);
        setValue('');
        setSuggestions([]);
        setHistoryIndex(-1);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setValue(suggestions[activeSuggestion]);
        setSuggestions([]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIdx);
      setValue(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIdx);
      setValue(nextIdx === -1 ? '' : commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      setActiveSuggestion(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onSubmit('clear');
      setValue('');
    }
  };

  return (
    <div className="relative">
      {suggestions.length > 0 && (
        <div className="autocomplete">
          {suggestions.map((s, i) => (
            <div
              key={s}
              className={`autocomplete-item${i === activeSuggestion ? ' active' : ''}`}
              onClick={() => { setValue(s); setSuggestions([]); inputRef.current?.focus(); }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
      <div className="terminal-input-row">
        <span className="prompt">krishna@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
        <span className="cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
```

---

## Task 11: Mobile Quick Commands

**Files:**
- Create: `src/components/mobile/QuickCommands.tsx`

- [ ] **Step 1: Create quick commands bar**

Create `src/components/mobile/QuickCommands.tsx`:

```tsx
'use client';

const QUICK_CMDS = ['help', 'whois krishna', 'ls projects', 'ls skills', 'cat resume', 'contact', 'sudo hire krishna'];

interface Props { onCommand: (cmd: string) => void; }

export default function QuickCommands({ onCommand }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-3 py-2 md:hidden"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {QUICK_CMDS.map(cmd => (
        <button
          key={cmd}
          onClick={() => onCommand(cmd)}
          className="flex-shrink-0 px-3 py-1 rounded border text-xs font-mono transition-colors"
          style={{
            border: '1px solid rgba(0,255,136,0.3)',
            color: '#00ff88',
            background: 'rgba(0,255,136,0.05)',
          }}
        >
          {cmd}
        </button>
      ))}
    </div>
  );
}
```

---

## Task 12: Terminal Orchestrator

**Files:**
- Create: `src/components/terminal/Terminal.tsx`

- [ ] **Step 1: Create terminal orchestrator**

Create `src/components/terminal/Terminal.tsx`:

```tsx
'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminalStore';
import { commandRegistry } from '@/lib/commands/index';
import { OutputLine } from '@/lib/commands/types';
import BootSequence from './BootSequence';
import OutputLineComponent from './OutputLine';
import CommandInput from './CommandInput';
import QuickCommands from '@/components/mobile/QuickCommands';
import MatrixRain from '@/components/effects/MatrixRain';
import ConfettiEffect from '@/components/effects/ConfettiEffect';
import { bio } from '@/lib/data/krishna';

let idCounter = 0;
function uid() { return `t-${++idCounter}-${Date.now()}`; }

function makeInputEcho(cmd: string): OutputLine {
  return { id: uid(), type: 'input', content: `krishna@portfolio:~$ ${cmd}` };
}

function makeNotFound(cmd: string): OutputLine {
  return { id: uid(), type: 'error', content: `bash: ${cmd}: command not found. Type 'help' for available commands.` };
}

export default function Terminal() {
  const {
    lines, isBooting, addLines, clearLines,
    commandHistory, addToHistory,
    showMatrix, triggerMatrix,
    showConfetti, triggerConfetti,
  } = useTerminalStore();

  const bottomRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = useCallback((rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    addToHistory(trimmed);

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    // echo prompt
    addLines([makeInputEcho(trimmed)]);

    // special cases: clear, history, github, linkedin, matrix, sudo hire
    if (cmd === 'clear') {
      clearLines();
      return;
    }

    if (cmd === 'history') {
      const histLines: OutputLine[] = [
        { id: uid(), type: 'output', content: '' },
        ...commandHistory.slice(0, 10).map((h, i) =>
          ({ id: uid(), type: 'output' as const, content: `  ${String(i + 1).padStart(3)}  ${h}` })
        ),
        { id: uid(), type: 'output', content: '' },
      ];
      addLines(histLines);
      return;
    }

    if (cmd === 'github') {
      window.open(bio.github, '_blank', 'noopener,noreferrer');
      addLines([{ id: uid(), type: 'system', content: '  Opening github.com/Krishna09Bhardwaj in new tab...' }]);
      return;
    }

    if (cmd === 'linkedin') {
      window.open(bio.linkedin, '_blank', 'noopener,noreferrer');
      addLines([{ id: uid(), type: 'system', content: '  Opening linkedin.com/in/krishna-bhardwaj-16306824a in new tab...' }]);
      return;
    }

    if (cmd === 'matrix') {
      addLines([{ id: uid(), type: 'system', content: '  Entering the Matrix... (5 seconds)' }]);
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
        addLines(handler.execute(args, addLines));
        // trigger PDF download
        const a = document.createElement('a');
        a.href = '/resume.pdf';
        a.download = 'Krishna_Bhardwaj_Resume.pdf';
        a.click();
      }
      return;
    }

    if (cmd === 'ssh' && args[0] === 'connect') {
      const handler = commandRegistry.get('ssh');
      if (handler) {
        addLines(handler.execute(args, addLines));
        setTimeout(() => {
          window.open(`mailto:${bio.email}?subject=Opportunity for Krishna Bhardwaj`, '_blank', 'noopener,noreferrer');
        }, 2000);
      }
      return;
    }

    const handler = commandRegistry.get(cmd);
    if (handler) {
      const result = handler.execute(args, addLines);
      addLines(result);
    } else {
      addLines([makeNotFound(trimmed)]);
    }
  }, [addLines, clearLines, commandHistory, addToHistory, triggerMatrix, triggerConfetti]);

  const handleCommandClick = useCallback((cmd: string) => {
    handleCommand(cmd);
  }, [handleCommand]);

  return (
    <>
      {showMatrix && <MatrixRain />}
      {showConfetti && <ConfettiEffect />}
      <div className="terminal-wrapper">
        {isBooting ? (
          <BootSequence />
        ) : (
          <>
            <div ref={outputRef} className="terminal-output">
              {lines.map((line, i) => (
                <OutputLineComponent
                  key={line.id}
                  line={line}
                  index={i}
                  onCommandClick={handleCommandClick}
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
```

---

## Task 13: Main Page and App Assembly

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create main page**

Replace `src/app/page.tsx`:

```tsx
import dynamic from 'next/dynamic';

const ParticleField = dynamic(() => import('@/components/background/ParticleField'), {
  ssr: false,
});

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  ssr: false,
});

export default function Home() {
  return (
    <main
      style={{ background: '#0a0e1a', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Gradient backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(26,35,126,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,255,136,0.04) 0%, transparent 50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* Three.js particles */}
      <ParticleField />
      {/* Terminal */}
      <div style={{ position: 'relative', zIndex: 10, height: '100dvh' }}>
        <Terminal />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Build verification**

```bash
npm run build 2>&1 | tail -30
```

Expected: successful build, no TypeScript errors.

---

## Task 14: Configuration Files

**Files:**
- Create: `vercel.json`
- Create: `krishna.md`
- Create: `README.md`
- Update: `.gitignore`

- [ ] **Step 1: Create vercel.json**

Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "cleanUrls": true
}
```

- [ ] **Step 2: Create krishna.md**

Create `krishna.md` — the living session log.

- [ ] **Step 3: Create README.md**

- [ ] **Step 4: Update .gitignore**

Ensure `.gitignore` includes:
```
node_modules/
.next/
.env
.env.local
.env*.local
out/
dist/
```

---

## Task 15: Final Git Commit

- [ ] **Step 1: Stage and commit all files**

```bash
git add .
git commit -m "feat: initial terminal portfolio — Krishna Bhardwaj"
```

- [ ] **Step 2: Push to origin**

```bash
git push -u origin main
```

---

## Self-Review Against Spec

| Requirement | Covered |
|---|---|
| Boot sequence with ASCII art | ✓ Task 9 |
| `help` / `ls` command | ✓ Task 4 |
| `whois krishna` | ✓ Task 4 |
| `cat resume` + PDF download | ✓ Tasks 4, 12 |
| `ls projects` | ✓ Task 4 |
| `open <project>` | ✓ Task 4 |
| `ls skills` ASCII bars | ✓ Task 4 |
| `ls experience` | ✓ Task 4 |
| `cat research` + DOI | ✓ Task 4 |
| `contact` | ✓ Task 4 |
| `github` / `linkedin` new tab | ✓ Task 12 |
| `clear` | ✓ Task 12 |
| `sudo hire krishna` Easter egg + confetti | ✓ Tasks 4, 7, 12 |
| `matrix` Easter egg | ✓ Tasks 4, 7, 12 |
| `ssh connect` | ✓ Tasks 4, 12 |
| `cat certifications` | ✓ Task 4 |
| `uptime` | ✓ Task 4 |
| `ping krishna` | ✓ Task 4 |
| `history` | ✓ Task 12 |
| `whoami` | ✓ Task 4 |
| Tab autocomplete | ✓ Task 10 |
| Arrow key history navigation | ✓ Task 10 |
| Click command to run | ✓ Task 8 |
| Mobile quick commands | ✓ Task 11 |
| Three.js particle background | ✓ Task 6 |
| CRT scanline overlay | ✓ Task 5 |
| XSS sanitization | ✓ Task 2 |
| External links rel=noopener | ✓ Throughout |
| SEO meta tags | ✓ Task 5 |
| robots.txt | ✓ Task 5 |
| vercel.json | ✓ Task 14 |
| @vercel/analytics | ✓ Task 5 |
| krishna.md session log | ✓ Task 14 |
| Git commit + push | ✓ Task 15 |
