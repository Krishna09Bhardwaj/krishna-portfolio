import { OutputLine } from './types';
import {
  bio,
  skills,
  projects,
  experience,
  research,
  certifications,
} from '@/lib/data/krishna';

let idCounter = 0;
function uid(): string {
  return `line-${++idCounter}-${Date.now()}`;
}

function line(
  content: string,
  type: OutputLine['type'] = 'output',
): OutputLine {
  return { id: uid(), type, content };
}

function blank(): OutputLine {
  return { id: uid(), type: 'output', content: ' ' };
}

function sys(content: string): OutputLine {
  return { id: uid(), type: 'system', content };
}

function ok(content: string): OutputLine {
  return { id: uid(), type: 'success', content };
}

// ── help / ls ────────────────────────────────────────────────────────────────

export const HELP_LINES: OutputLine[] = [
  blank(),
  sys('┌─────────────────────────────────────────────────────────────┐'),
  sys('│           krishna@portfolio — AVAILABLE COMMANDS             │'),
  sys('└─────────────────────────────────────────────────────────────┘'),
  blank(),
  line('  whois krishna       →  Bio, role, location, summary'),
  line('  cat resume          →  View resume + trigger PDF download'),
  line('  ls projects         →  List all projects with tech stacks'),
  line('  open <id>           →  Full project details  (pipeline|dashboard|realive)'),
  line('  ls skills           →  Skill tree with proficiency bars'),
  line('  ls experience       →  Work experience timeline'),
  line('  cat research        →  IEEE paper + DOI link'),
  line('  cat certifications  →  All certifications'),
  line('  contact             →  Email, GitHub, LinkedIn'),
  line('  github              →  Open GitHub profile in new tab'),
  line('  linkedin            →  Open LinkedIn profile in new tab'),
  line('  uptime              →  How long Krishna has been coding'),
  line('  ping krishna        →  Check availability status'),
  line('  history             →  Last 10 commands this session'),
  line('  whoami              →  Who is running this shell?'),
  line('  ssh connect         →  Open contact form'),
  line('  clear               →  Clear terminal'),
  blank(),
  sys('  ── Easter Eggs ───────────────────────────────────────────────'),
  line('  sudo hire krishna   →  ???'),
  line('  matrix              →  Enter the matrix'),
  blank(),
];

// ── whois ─────────────────────────────────────────────────────────────────────

export const WHOIS_LINES: OutputLine[] = [
  blank(),
  sys('╔════════════════════════════════════════════════════════════╗'),
  sys('║                   KRISHNA BHARDWAJ                         ║'),
  sys('╚════════════════════════════════════════════════════════════╝'),
  blank(),
  line(`  Role        :  ${bio.role}`),
  line(`  Education   :  ${bio.education}`),
  line(`  Location    :  ${bio.location}`),
  line(`  Email       :  ${bio.email}`),
  line(`  Phone       :  ${bio.phone}`),
  blank(),
  sys('  Summary:'),
  ...bio.summary.map((s) => line(`  ${s}`)),
  blank(),
];

// ── projects list ─────────────────────────────────────────────────────────────

export function makeProjectListLines(): OutputLine[] {
  return [
    blank(),
    sys('  Projects  —  type "open <id>" for full details'),
    blank(),
    ...projects.map((p) =>
      line(
        `  [${p.id.padEnd(10)}]  ${p.name.padEnd(35)}  [${p.date}]`,
      ),
    ),
    blank(),
    sys('  Stacks:'),
    ...projects.map((p) =>
      line(`  ${p.id.padEnd(12)} ${p.stack.map((s) => `[${s}]`).join(' ')}`),
    ),
    blank(),
  ];
}

// ── open project ──────────────────────────────────────────────────────────────

export function makeOpenProjectLines(id: string): OutputLine[] {
  const p = projects.find((pr) => pr.id === id.toLowerCase());
  if (!p) {
    return [
      blank(),
      { id: uid(), type: 'error', content: `  Error: project "${id}" not found.` },
      line(`  Available IDs: ${projects.map((pr) => pr.id).join(' | ')}`),
      blank(),
    ];
  }
  return [
    blank(),
    sys(`  ▶  ${p.name}  (${p.date})`),
    blank(),
    line(`  ${p.description}`),
    blank(),
    sys('  Stack:'),
    line(`  ${p.stack.map((s) => `[${s}]`).join('  ')}`),
    blank(),
    sys('  Metrics:'),
    ...p.metrics.map((m) => ok(`  ✓  ${m}`)),
    blank(),
    sys(`  GitHub →  ${p.github}`),
    blank(),
  ];
}

// ── skills ────────────────────────────────────────────────────────────────────

export function makeSkillsLines(): OutputLine[] {
  const bar = (pct: number): string => {
    const filled = Math.round(pct / 5);
    return '█'.repeat(filled) + '░'.repeat(20 - filled) + `  ${pct}%`;
  };
  return [
    blank(),
    sys('  SKILL TREE'),
    blank(),
    ...skills.flatMap((s) => [
      sys(`  ${s.category}`),
      line(`  ${bar(s.level)}`),
      line(`  ${s.items.join('  ·  ')}`),
      blank(),
    ]),
  ];
}

// ── experience ────────────────────────────────────────────────────────────────

export function makeExperienceLines(): OutputLine[] {
  return [
    blank(),
    sys('  EXPERIENCE TIMELINE'),
    blank(),
    ...experience.flatMap((e) => [
      sys(`  ▶  ${e.role}  @  ${e.company}`),
      line(`     ${e.period}  ·  ${e.location}`),
      blank(),
      ...e.highlights.map((h) => ok(`     ✓  ${h}`)),
      blank(),
    ]),
  ];
}

// ── research ──────────────────────────────────────────────────────────────────

export const RESEARCH_LINES: OutputLine[] = [
  blank(),
  sys('  PUBLISHED RESEARCH'),
  blank(),
  sys(`  "${research.title}"`),
  blank(),
  line(`  Publisher   :  ${research.journal}`),
  line(`  Conference  :  ${research.conference}`),
  line(`  Published   :  ${research.date}`),
  line(`  DOI         :  ${research.doi}`),
  blank(),
  line('  Abstract:'),
  line(`  ${research.abstract}`),
  blank(),
  sys(`  View paper  →  https://doi.org/${research.doi}`),
  blank(),
];

// ── certifications ────────────────────────────────────────────────────────────

export function makeCertLines(): OutputLine[] {
  return [
    blank(),
    sys('  CERTIFICATIONS'),
    blank(),
    ...certifications.map((c, i) =>
      line(
        `  ${String(i + 1).padStart(2)}.  ${c.name}  ·  ${c.issuer}  (${c.year})`,
      ),
    ),
    blank(),
  ];
}

// ── contact ───────────────────────────────────────────────────────────────────

export const CONTACT_LINES: OutputLine[] = [
  blank(),
  sys('  CONTACT'),
  blank(),
  line(`  Email    →  ${bio.email}`),
  sys(`  GitHub   →  ${bio.github}`),
  sys(`  LinkedIn →  ${bio.linkedin}`),
  line(`  Phone    →  ${bio.phone}`),
  blank(),
  line("  Type 'ssh connect' to open the contact form."),
  blank(),
];

// ── uptime ────────────────────────────────────────────────────────────────────

export function makeUptimeLines(): OutputLine[] {
  const start = new Date('2019-06-01');
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
  );
  return [
    blank(),
    line(`  krishna@portfolio — uptime: ${years} years, ${months} months`),
    line('  System: online since first line of Python  (2019)'),
    ok('  Status: currently building real-time data systems'),
    blank(),
  ];
}

// ── ping ──────────────────────────────────────────────────────────────────────

export const PING_LINES: OutputLine[] = [
  blank(),
  line('  PING krishna.bhardwaj (available-for-opportunities): 56 bytes'),
  ok('  64 bytes from krishna: icmp_seq=1 ttl=64 time=0.1 ms'),
  ok('  64 bytes from krishna: icmp_seq=2 ttl=64 time=0.1 ms'),
  ok('  64 bytes from krishna: icmp_seq=3 ttl=64 time=0.1 ms'),
  blank(),
  line('  --- krishna ping statistics ---'),
  line('  3 packets transmitted, 3 received, 0% packet loss'),
  ok('  PONG — Krishna is available for new opportunities!'),
  blank(),
];

// ── whoami ────────────────────────────────────────────────────────────────────

export const WHOAMI_LINES: OutputLine[] = [
  blank(),
  line('  An engineer who turns raw data chaos into structured insight.'),
  line('  Caffeine-powered. Pipeline-obsessed. Latency intolerant.'),
  blank(),
];

// ── hire easter egg ───────────────────────────────────────────────────────────

export const HIRE_LINES: OutputLine[] = [
  blank(),
  sys('  [sudo] password for recruiter: **************'),
  sys('  Authenticating...'),
  ok('  Authorization granted — excellent taste confirmed.'),
  blank(),
  sys('  ╔════════════════════════════════════════════════════════╗'),
  sys('  ║      YOU HAVE DECIDED TO HIRE KRISHNA BHARDWAJ         ║'),
  sys('  ║                                                        ║'),
  sys('  ║  Specialises in:  Real-time pipelines                  ║'),
  sys('  ║                   Big Data Engineering                 ║'),
  sys('  ║                   Distributed Systems                  ║'),
  sys('  ║                                                        ║'),
  sys('  ║  Available:  Immediately                               ║'),
  sys(`  ║  Contact  :  ${bio.email}           ║`),
  sys('  ╚════════════════════════════════════════════════════════╝'),
  blank(),
];

// ── ssh connect ───────────────────────────────────────────────────────────────

export const SSH_LINES: OutputLine[] = [
  blank(),
  sys('  Establishing secure connection...'),
  line('  ▸ Resolving krishna.bhardwaj...'),
  line('  ▸ Negotiating encryption  (AES-256-GCM)...'),
  line('  ▸ Verifying host fingerprint...'),
  ok('  Connection established!'),
  blank(),
  line('  Opening contact form...'),
  blank(),
];

// ── resume ────────────────────────────────────────────────────────────────────

export const RESUME_LINES: OutputLine[] = [
  blank(),
  sys('  KRISHNA BHARDWAJ — RESUME'),
  sys('  ──────────────────────────────────────────────────────'),
  blank(),
  sys('  CONTACT'),
  line(`  Email: ${bio.email}  ·  Phone: ${bio.phone}`),
  line(
    '  GitHub: github.com/Krishna09Bhardwaj  ·  LinkedIn: in/krishna-bhardwaj-16306824a',
  ),
  blank(),
  sys('  EDUCATION'),
  line('  B.Tech — Computer Science & Engineering (Hons.)'),
  line('  Chandigarh University  ·  CGPA: 7.38/10  ·  2022–2026'),
  blank(),
  sys('  EXPERIENCE'),
  line('  Software Developer Intern — JineeGreenCard  (Feb 2026 – Present)'),
  ok("  ✓ Real-time WhatsApp monitoring across 500+ groups"),
  ok("  ✓ Built and QA'd meritmap.ai onboarding website"),
  ok("  ✓ Google Analytics full-funnel tracking configured"),
  blank(),
  sys('  PROJECTS'),
  line('  Real-Time Data Pipeline   · Kafka · PySpark · Airflow · Snowflake · Docker'),
  line('  Sales Insight Dashboard   · Python · Power BI · SQL'),
  line('  Re-Alive Animation Tool   · Python · OpenCV · Mediapipe · PyQt'),
  blank(),
  sys('  SKILLS'),
  line('  Python · SQL · Bash · Kafka · PySpark · Airflow · Snowflake'),
  line('  Docker · PostgreSQL · Linux · Power BI · Node.js · Next.js'),
  blank(),
  sys('  RESEARCH'),
  line('  "Predicting Network Condition Events Using Supervised ML" — IEEE, Feb 2025'),
  blank(),
  sys('  ──────────────────────────────────────────────────────'),
  ok('  Downloading Krishna_Bhardwaj_Resume.pdf...'),
  blank(),
];
