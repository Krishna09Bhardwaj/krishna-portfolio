import { CommandDef, OutputLine } from './types';
import {
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
} from './handlers';

function err(msg: string): OutputLine {
  return { id: `err-${Date.now()}`, type: 'error', content: msg };
}

export const commandRegistry = new Map<string, CommandDef>([
  [
    'help',
    {
      description: 'Show all available commands',
      execute: () => HELP_LINES,
    },
  ],
  [
    'ls',
    {
      description: 'List commands or sub-sections  (ls projects | ls skills | ls experience)',
      execute: (args) => {
        if (args[0] === 'projects') return makeProjectListLines();
        if (args[0] === 'skills') return makeSkillsLines();
        if (args[0] === 'experience') return makeExperienceLines();
        return HELP_LINES;
      },
    },
  ],
  [
    'whois',
    {
      description: 'Print bio and summary',
      usage: 'whois krishna',
      execute: () => WHOIS_LINES,
    },
  ],
  [
    'cat',
    {
      description: 'Read a file  (cat resume | cat research | cat certifications)',
      execute: (args) => {
        if (args[0] === 'resume') return RESUME_LINES;
        if (args[0] === 'research') return RESEARCH_LINES;
        if (args[0] === 'certifications') return makeCertLines();
        return [err(`  cat: ${args[0] ?? '<missing>'}:  No such file or directory`)];
      },
    },
  ],
  [
    'open',
    {
      description: 'Open project details',
      usage: 'open pipeline | open dashboard | open realive',
      execute: (args) => makeOpenProjectLines(args[0] ?? ''),
    },
  ],
  [
    'contact',
    {
      description: 'Show contact information',
      execute: () => CONTACT_LINES,
    },
  ],
  [
    'github',
    {
      description: 'Open GitHub profile in new tab',
      execute: () => [
        { id: `gh-${Date.now()}`, type: 'system' as const, content: '  Opening github.com/Krishna09Bhardwaj ...' },
      ],
    },
  ],
  [
    'linkedin',
    {
      description: 'Open LinkedIn profile in new tab',
      execute: () => [
        { id: `li-${Date.now()}`, type: 'system' as const, content: '  Opening linkedin.com/in/krishna-bhardwaj-16306824a ...' },
      ],
    },
  ],
  [
    'clear',
    {
      description: 'Clear terminal output',
      execute: () => [],
    },
  ],
  [
    'uptime',
    {
      description: 'How long Krishna has been coding',
      execute: () => makeUptimeLines(),
    },
  ],
  [
    'ping',
    {
      description: 'Check availability',
      usage: 'ping krishna',
      execute: () => PING_LINES,
    },
  ],
  [
    'history',
    {
      description: 'Show last 10 commands this session',
      execute: () => [],
    },
  ],
  [
    'whoami',
    {
      description: 'Who is running this shell?',
      execute: () => WHOAMI_LINES,
    },
  ],
  [
    'sudo',
    {
      description: 'Elevated privileges',
      usage: 'sudo hire krishna',
      execute: (args) => {
        if (args[0] === 'hire' && args[1] === 'krishna') return HIRE_LINES;
        return [err('  sudo: permission denied.  Try: sudo hire krishna')];
      },
    },
  ],
  [
    'matrix',
    {
      description: 'Enter the matrix',
      execute: () => [
        { id: `mx-${Date.now()}`, type: 'system' as const, content: '  Entering the Matrix...  (5 seconds)' },
      ],
    },
  ],
  [
    'ssh',
    {
      description: 'Connect via SSH',
      usage: 'ssh connect',
      execute: (args) => {
        if (args[0] === 'connect') return SSH_LINES;
        return [err('  Usage: ssh connect')];
      },
    },
  ],
]);

export const commandNames = Array.from(commandRegistry.keys());
