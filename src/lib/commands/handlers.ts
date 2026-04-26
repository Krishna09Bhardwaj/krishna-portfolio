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

function line(content: string, type: OutputLine['type'] = 'output'): OutputLine {
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

// ── Box helpers (63-char inner width, shared by research / certs / resume) ────
const BOX_TOP = '  ┌─────────────────────────────────────────────────────────────┐';
const BOX_MID = '  ├─────────────────────────────────────────────────────────────┤';
const BOX_BOT = '  └─────────────────────────────────────────────────────────────┘';
const BOX_L   = '  │';
function bl(content: string): string {
  return `${BOX_L}${content.padEnd(63)}│`;
}

// ── help ──────────────────────────────────────────────────────────────────────

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
  line('  sudo hire krishna   →  [ you really want to try this one ]'),
  line('  matrix              →  Enter the matrix'),
  blank(),
];

// ── whois — reads from krishna.ts bio ─────────────────────────────────────────

export const WHOIS_LINES: OutputLine[] = [
  blank(),
  line(`  Name       :  ${bio.name}`),
  line('  Currently  :  Final Year CSE @ Chandigarh University'),
  line('  Fuel       :  Coffee ☕ + Deadlines ⚡'),
  line('  Status     :  Building. Breaking. Fixing. Repeating.'),
  line(`  Location   :  ${bio.location}`),
  line(`  Email      :  ${bio.email}`),
  line(`  Phone      :  ${bio.phone}`),
  blank(),
  sys('  Summary:'),
  blank(),
  ...bio.summary.map((s) => (s === '' ? blank() : line(`  ${s}`))),
  blank(),
];

// ── projects list — reads from krishna.ts projects[] ──────────────────────────

export function makeProjectListLines(): OutputLine[] {
  return [
    blank(),
    sys('  Projects  —  type "open <id>" for full details'),
    blank(),
    ...projects.map((p) =>
      line(`  [${p.id.padEnd(10)}]  ${p.name.padEnd(35)}  [${p.date}]`),
    ),
    blank(),
    sys('  Stacks:'),
    ...projects.map((p) =>
      line(`  ${p.id.padEnd(12)} ${p.stack.map((s) => `[${s}]`).join(' ')}`),
    ),
    blank(),
  ];
}

// ── open project — reads from krishna.ts projects[] ───────────────────────────

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
    { id: uid(), type: 'success' as const, content: `  GitHub →  ${p.github}`, isExternalLink: p.github },
    blank(),
  ];
}

// ── skills — reads from krishna.ts skills[] ───────────────────────────────────

export function makeSkillsLines(): OutputLine[] {
  const bar = (pct: number): string =>
    '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5)) + `  ${pct}%`;
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

// ── experience — reads from krishna.ts experience[] ───────────────────────────

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

// ── research — reads from krishna.ts research ─────────────────────────────────

export const RESEARCH_LINES: OutputLine[] = [
  blank(),
  sys(BOX_TOP),
  sys(bl('  IEEE PUBLISHED RESEARCH')),
  sys(BOX_MID),
  sys(bl('')),
  sys(bl('  Title   :  Predicting Network Condition Events Using')),
  sys(bl('             Supervised Machine Learning and Network')),
  sys(bl('             Analysis Techniques')),
  sys(bl('')),
  sys(bl('  Publisher : IEEE')),
  sys(bl(`  Conference: ${research.conference}`)),
  sys(bl(`  Status    : Peer-Reviewed & Published — ${research.date}`)),
  sys(bl('')),
  line(bl('  What it means in plain English:')),
  line(bl('  Predicted when networks would choke under load —')),
  line(bl('  before they actually did.')),
  line(bl('  Real data. Real model. Real results.')),
  line(bl('  Published in one of the most respected')),
  line(bl('  engineering bodies in the world.')),
  sys(bl('')),
  sys(bl(`  DOI  : ${research.doi}`)),
  {
    id: uid(),
    type: 'success',
    content: bl(`  Link : https://doi.org/${research.doi}`),
    isExternalLink: `https://doi.org/${research.doi}`,
  },
  sys(bl('')),
  sys(BOX_BOT),
  blank(),
];

// ── certifications — reads from krishna.ts certifications[] ──────────────────

export function makeCertLines(): OutputLine[] {
  const rows: OutputLine[] = [
    blank(),
    sys(BOX_TOP),
    sys(bl('  CERTIFICATIONS')),
    sys(BOX_MID),
  ];

  certifications.forEach((cert) => {
    rows.push(sys(bl('')));
    rows.push(ok(bl(`  ✅  ${cert.name}`)));
    rows.push(line(bl(`      Issued by  : ${cert.issuer}`)));
    if (cert.validUntil) {
      rows.push(line(bl(`      Valid until: ${cert.validUntil}`)));
    } else {
      rows.push(line(bl('      Status     : Completed')));
    }
    rows.push(line(bl(`      ${cert.description}`)));
  });

  rows.push(sys(bl('')));
  rows.push(sys(bl('  🔄  More certifications incoming — be patient.')));
  rows.push(sys(bl('      The stack is still being conquered.')));
  rows.push(sys(bl('')));
  rows.push(sys(BOX_BOT));
  rows.push(blank());
  return rows;
}

// ── resume — derives everything from krishna.ts ───────────────────────────────
// Update krishna.ts and this auto-updates when you redeploy.

export function makeResumeLines(): OutputLine[] {
  const exp = experience[0];

  // Build stack from Languages + Data Platforms skill categories
  const langItems   = skills.find((s) => s.category === 'Languages')?.items ?? [];
  const dataItems   = skills.find((s) => s.category === 'Data Platforms')?.items ?? [];
  const infraItems  = skills.find((s) => s.category === 'Infra & DevOps')?.items.slice(0, 2) ?? [];
  const allStack    = [...langItems, ...dataItems, ...infraItems];
  const stack1      = allStack.slice(0, 5).join(' · ');
  const stack2      = allStack.slice(5, 9).join(' · ');

  const ghShort = bio.github.replace('https://', '');
  const liShort = bio.linkedin.replace('https://', '');

  const certRows = certifications.slice(0, 3).map((c) =>
    ok(bl(`  ✅  ${c.name}`)),
  );

  return [
    blank(),
    sys(BOX_TOP),
    sys(bl(`  ${bio.name}`)),
    sys(bl(`  ${bio.role}`)),
    sys(BOX_MID),
    sys(bl('')),
    line(bl(`  Education  :  ${bio.education}`)),
    line(bl(`               ${bio.educationUniversity}`)),
    line(bl(`               ${bio.educationPeriod}  |  CGPA: ${bio.cgpa}`)),
    sys(bl('')),
    line(bl(`  Experience :  ${exp.role}`)),
    line(bl(`               ${exp.company}  |  ${exp.period}`)),
    sys(bl('')),
    line(bl(`  Stack      :  ${stack1}`)),
    ...(stack2 ? [line(bl(`               ${stack2}`))] : []),
    sys(bl('')),
    line(bl('  Research   :  IEEE Published — Network Congestion')),
    line(bl('               Prediction using Machine Learning')),
    line(bl(`               DOI: ${research.doi}`)),
    sys(bl('')),
    sys(bl('  Certified  :')),
    ...certRows,
    line(bl('               More incoming — stay tuned 🔄')),
    sys(bl('')),
    sys(bl(`  GitHub     :  ${ghShort}`)),
    sys(bl(`  LinkedIn   :  ${liShort}`)),
    sys(bl('')),
    sys(BOX_MID),
    {
      id: uid(),
      type: 'success',
      content: bl('  [ 📄 Download Full Resume — PDF ]'),
      isDownloadButton: true,
    },
    ok(bl('  Clicking download? Good taste.')),
    sys(BOX_BOT),
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
  return [
    blank(),
    line('  krishna@portfolio — uptime: every late night since 2023'),
    line('  System   : online since first "hello world" hit different'),
    ok('  Status   : deadline active — performing as expected'),
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
  blank(),
  ok('  ✅ ACCESS GRANTED — ROOT PRIVILEGES APPROVED'),
  blank(),
  line('  Initialising hire sequence...'),
  blank(),
  line('  Candidate     :  Krishna Bhardwaj'),
  line('  Clearance     :  Data Engineering · Analytics · Automation'),
  line('  Pipeline      :  Real-Time · Fault-Tolerant · Production-Grade'),
  ok( '  Research      :  IEEE Published ✅'),
  line('  Status        :  Available from June 2026'),
  blank(),
  ok('  You just made a great decision.'),
  blank(),
  sys(`  Next step → ${bio.email}`),
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
