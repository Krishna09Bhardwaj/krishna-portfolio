# Terminal Portfolio — Design Spec
**Date:** 2026-04-22  
**Project:** Krishna Bhardwaj Developer Portfolio  
**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · Three.js · Framer Motion · Zustand

---

## 1. Overview

A terminal-style single-page portfolio deployed on Vercel. The visitor lands in a simulated shell — no navbar, no hero section, no traditional UI. The entire experience is a fully interactive terminal with 20+ commands, animated output, Easter eggs, and a Three.js particle background.

---

## 2. Architecture

```
src/
  app/
    layout.tsx              # Root layout — fonts, SEO meta, viewport
    page.tsx                # Single page — Background + Terminal
    globals.css             # CRT scanline overlay, scrollbar, keyframes
  components/
    Terminal/
      Terminal.tsx          # Orchestrator — boot → idle → command loop
      BootSequence.tsx      # Timed boot lines + ASCII art typewriter
      OutputLine.tsx        # Single animated output line (text | JSX)
      CommandInput.tsx      # Input with autocomplete, history nav
    Background/
      ParticleField.tsx     # Three.js canvas — slow-moving particles
    Effects/
      MatrixRain.tsx        # Matrix rain overlay (Easter egg, 5s)
      ConfettiEffect.tsx    # canvas-confetti wrapper (Easter egg)
    Mobile/
      QuickCommands.tsx     # Swipeable command pill suggestions
  lib/
    commands/
      index.ts              # Command registry Map<string, CommandDef>
      commands.ts           # All command handler functions
      types.ts              # CommandDef, OutputLine, TerminalState types
    data/
      krishna.ts            # All bio, projects, skills, certs data
    utils/
      sanitize.ts           # Strip HTML/script from user input
  hooks/
    useTerminal.ts          # Core terminal state + command dispatch
    useCommandHistory.ts    # Session history (last 50, arrow nav)
    useAutocomplete.ts      # Tab cycle through matching commands
  store/
    terminalStore.ts        # Zustand — lines[], isBooting, effects state
public/
  resume.pdf                # Krishna's resume (to be added by user)
  robots.txt
  favicon.ico
```

---

## 3. Visual Design

| Property | Value |
|---|---|
| Background | `#0a0e1a` base, Three.js particles in `#1a237e` / `#00ff88` |
| Primary text | `#e0e0e0` |
| Command text | `#00ff88` (matrix green) |
| Error text | `#ff6b6b` |
| Accent | `#4fc3f7` (cyan, for links and labels) |
| Font | JetBrains Mono (Google Fonts) |
| Prompt | `krishna@portfolio:~$` |
| CRT effect | CSS repeating-linear-gradient scanlines, 0.03 opacity |

---

## 4. Terminal Behaviour

### Boot Sequence (3–4 seconds total)
1. BIOS-style lines: kernel version, memory check, loading modules
2. ASCII art "KRISHNA BHARDWAJ" — typed character by character
3. `Last login: [current timestamp]`
4. `Welcome message + "type 'help' to get started"`
5. Prompt appears, cursor blinks

### Command Lifecycle
1. User types → sanitized → dispatched to command registry
2. Output is an array of `OutputLine` objects rendered one-by-one with staggered Framer Motion fade-in
3. Unknown command → `bash: [cmd]: command not found`
4. History stored in Zustand + sessionStorage (up to 50 entries)

### Input UX
- **Tab**: cycle autocomplete through matching commands
- **Arrow Up/Down**: navigate session history
- **Enter**: execute command
- **Ctrl+L / `clear`**: clear terminal
- **Click any command in output**: auto-execute it
- **Mobile**: fixed input bar at bottom, horizontal scroll of quick-command pills above keyboard

---

## 5. Command Definitions

| Command | Output |
|---|---|
| `help` / `ls` | Formatted help menu — all commands with descriptions |
| `whois krishna` | Bio card — role, location, summary |
| `cat resume` | Formatted resume + triggers PDF download |
| `ls projects` | All 3 projects with tech stack tags |
| `open <project>` | Full project detail — metrics, GitHub link |
| `ls skills` | ASCII progress bars by category |
| `ls experience` | Timeline — JineeGreenCard internship |
| `cat research` | IEEE paper details + DOI link |
| `contact` | Email, GitHub, LinkedIn — all clickable |
| `github` | Opens github.com/Krishna09Bhardwaj in new tab |
| `linkedin` | Opens LinkedIn in new tab |
| `clear` | Clears all terminal output |
| `sudo hire krishna` | Confetti + special message Easter egg |
| `matrix` | Matrix rain for 5 seconds Easter egg |
| `ssh connect` | Animated "establishing secure connection" + contact form |
| `cat certifications` | All 4 certifications |
| `uptime` | Calculates coding years from 2019 |
| `ping krishna` | Animated ping/pong with availability message |
| `history` | Last 10 commands this session |
| `whoami` | Philosophical one-liner |

---

## 6. Security

- Input sanitized: strip `<script>`, HTML tags, limit to 200 chars before processing
- All external links: `target="_blank" rel="noopener noreferrer"`
- No secrets hardcoded anywhere
- Resume PDF at `/resume.pdf` — linked but path not exposed in visible UI
- No `console.log` in production

---

## 7. SEO & Meta

- `title`: Krishna Bhardwaj | Data Engineer Portfolio
- `description`: Final-year CSE @ Chandigarh University. Expert in Kafka, PySpark, Airflow, Snowflake. Published IEEE researcher.
- Open Graph tags
- `robots.txt`: allow all crawlers
- Canonical URL

---

## 8. Deployment

- `vercel.json` with framework: nextjs
- `@vercel/analytics` injected in root layout
- First commit: `feat: initial terminal portfolio — Krishna Bhardwaj`
- Public GitHub repo: `github.com/Krishna09Bhardwaj/krishna-portfolio`
