import { OutputLine } from './types';
import {
  bio,
  skills,
  projects,
  experience,
  research,
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
    {
      id: uid(),
      type: 'success' as const,
      content: `  GitHub →  ${p.github}`,
      isExternalLink: p.github,
    },
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
  sys('  ┌─────────────────────────────────────────────────────────────┐'),
  sys('  │  IEEE PUBLISHED RESEARCH                                    │'),
  sys('  ├─────────────────────────────────────────────────────────────┤'),
  sys('  │                                                             │'),
  sys('  │  Title   :  Predicting Network Condition Events Using      │'),
  sys('  │             Supervised Machine Learning and Network        │'),
  sys('  │             Analysis Techniques                             │'),
  sys('  │                                                             │'),
  sys('  │  Publisher : IEEE                                           │'),
  sys('  │  Conference: ACROSET 2025                                   │'),
  sys('  │  Status    : Peer-Reviewed & Published — February 2025     │'),
  sys('  │                                                             │'),
  line('  │  What it means in plain English:                           │'),
  line('  │  Predicted when networks would choke under load —          │'),
  line('  │  before they actually did.                                  │'),
  line('  │  Real data. Real model. Real results.                       │'),
  line('  │  Published in one of the most respected                     │'),
  line('  │  engineering bodies in the world.                           │'),
  sys('  │                                                             │'),
  sys(`  │  DOI     : ${research.doi}              │`),
  {
    id: uid(),
    type: 'success',
    content: `  │  Link    : https://doi.org/${research.doi} │`,
    isExternalLink: `https://doi.org/${research.doi}`,
  },
  sys('  │                                                             │'),
  sys('  └─────────────────────────────────────────────────────────────┘'),
  blank(),
];

// ── certifications ────────────────────────────────────────────────────────────

export function makeCertLines(): OutputLine[] {
  return [
    blank(),
    sys('  ┌─────────────────────────────────────────────────────────────┐'),
    sys('  │  CERTIFICATIONS                                             │'),
    sys('  ├─────────────────────────────────────────────────────────────┤'),
    sys('  │                                                             │'),
    ok( '  │  ✅  Oracle OCI Generative AI Certified Professional        │'),
    line('  │      Issued by  : Oracle                                    │'),
    line('  │      Valid until: July 2026                                 │'),
    line('  │      What it means: Certified to build and work            │'),
    line('  │      with enterprise-grade Gen AI on Oracle Cloud           │'),
    sys('  │                                                             │'),
    ok( '  │  ✅  Meta Data Analyst                                      │'),
    line('  │      Issued by  : Meta via Coursera                        │'),
    line('  │      Status     : Completed                                 │'),
    line('  │      What it means: End-to-end data analysis —             │'),
    line('  │      from raw data to business decisions                    │'),
    sys('  │                                                             │'),
    ok( '  │  ✅  Python Data Analytics                                  │'),
    line('  │      Status     : Completed                                 │'),
    line('  │      What it means: Data wrangling, analysis               │'),
    line('  │      and insight generation using Python                    │'),
    sys('  │                                                             │'),
    ok( '  │  ✅  Data Science at Scale                                  │'),
    line('  │      Status     : Completed                                 │'),
    line('  │      What it means: Large-scale data processing            │'),
    line('  │      and scalable ML pipelines                              │'),
    sys('  │                                                             │'),
    sys('  │  🔄  More certifications incoming — be patient.            │'),
    sys('  │      The stack is still being conquered.                    │'),
    sys('  │                                                             │'),
    sys('  └─────────────────────────────────────────────────────────────┘'),
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
  blank(),
  ok('  ✅ ACCESS GRANTED — ROOT PRIVILEGES APPROVED'),
  blank(),
  line('  Initialising hire sequence...'),
  blank(),
  line(`  Candidate     :  Krishna Bhardwaj`),
  line(`  Clearance     :  Data Engineering · Analytics · Automation`),
  line(`  Pipeline      :  Real-Time · Fault-Tolerant · Production-Grade`),
  ok( `  Research      :  IEEE Published ✅`),
  line(`  Status        :  Available from June 2026`),
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

// ── resume ────────────────────────────────────────────────────────────────────

export const RESUME_LINES: OutputLine[] = [
  blank(),
  sys('  ┌─────────────────────────────────────────────────────────────┐'),
  sys('  │  KRISHNA BHARDWAJ                                           │'),
  sys('  │  Data Engineering & Analytics                               │'),
  sys('  ├─────────────────────────────────────────────────────────────┤'),
  sys('  │                                                             │'),
  line('  │  Education  :  B.Tech CSE — Big Data Analytics             │'),
  line('  │                Chandigarh University                        │'),
  line('  │                2022 – June 2026  |  CGPA: 7.38             │'),
  sys('  │                                                             │'),
  line('  │  Experience :  Software Developer Intern                    │'),
  line('  │                JineeGreenCard  |  Feb 2026 – Present        │'),
  sys('  │                                                             │'),
  line('  │  Stack      :  Python · SQL · Kafka · PySpark              │'),
  line('  │                Airflow · Snowflake · Docker · Power BI      │'),
  sys('  │                                                             │'),
  line('  │  Research   :  IEEE Published — Network Congestion          │'),
  line('  │                Prediction using Machine Learning            │'),
  line(`  │                DOI: ${research.doi}     │`),
  sys('  │                                                             │'),
  ok( '  │  Certified  :  Oracle OCI Gen AI Professional              │'),
  ok( '  │                Meta Data Analyst — Coursera ✅              │'),
  ok( '  │                Python Data Analytics ✅                     │'),
  line('  │                More incoming — stay tuned 🔄               │'),
  sys('  │                                                             │'),
  sys(`  │  GitHub     :  github.com/Krishna09Bhardwaj                │`),
  sys(`  │  LinkedIn   :  linkedin.com/in/krishna-bhardwaj-16306824a  │`),
  sys('  │                                                             │'),
  sys('  ├─────────────────────────────────────────────────────────────┤'),
  {
    id: uid(),
    type: 'success',
    content: '  │  [ 📄 Download Full Resume — PDF ]                          │',
    isDownloadButton: true,
  },
  ok( '  │  Clicking download? Good taste.                             │'),
  sys('  └─────────────────────────────────────────────────────────────┘'),
  blank(),
];
