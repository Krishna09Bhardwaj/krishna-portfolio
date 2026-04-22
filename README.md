# Krishna Bhardwaj — Terminal Portfolio

A fully interactive terminal-style developer portfolio. Visitors are dropped into a live shell — no navbar, no hero section, pure terminal UI.

**Live:** [krishna-portfolio.vercel.app](https://krishna-portfolio.vercel.app) _(deploy to activate)_

---

## Stack

| Technology | Role |
|---|---|
| Next.js 16 App Router | Framework |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Three.js + @react-three/fiber | Particle background |
| Framer Motion | Line-by-line animations |
| Zustand | Terminal state management |
| canvas-confetti | Easter egg effects |
| @vercel/analytics | Analytics |

---

## Terminal Commands

```
help / ls              Show all available commands
whois krishna          Bio, role, location, summary
cat resume             View resume + download PDF
ls projects            List all projects with tech stacks
open <id>              Full project details  (pipeline | dashboard | realive)
ls skills              Skill tree with ASCII proficiency bars
ls experience          Work experience timeline
cat research           IEEE paper details + DOI link
cat certifications     All certifications
contact                Email, GitHub, LinkedIn
github                 Open GitHub profile in new tab
linkedin               Open LinkedIn profile in new tab
uptime                 How long Krishna has been coding
ping krishna           Check availability status
history                Last 10 commands this session
whoami                 Who is running this shell?
ssh connect            Open contact form
clear                  Clear terminal
```

### Easter Eggs

```
sudo hire krishna      Confetti + special message
matrix                 5-second matrix rain animation
```

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Tab` | Autocomplete command |
| `↑ / ↓` | Navigate command history |
| `Ctrl + L` | Clear terminal |
| `Enter` | Execute command |

---

## Running Locally

```bash
git clone https://github.com/Krishna09Bhardwaj/krishna-portfolio.git
cd krishna-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

This project is pre-configured for Vercel.

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Deploy — zero config required (`vercel.json` handles it)

---

## Adding Your Resume

Replace `public/resume.pdf` with your actual resume file. The `cat resume` command triggers an automatic download.

---

## Project Structure

```
src/
  app/             # Next.js App Router
  components/
    background/    # Three.js particle field
    effects/       # Matrix rain, confetti
    mobile/        # Quick commands pill strip
    terminal/      # Boot sequence, input, output, orchestrator
  lib/
    commands/      # Command registry + all handlers
    data/          # Portfolio data (bio, projects, etc.)
    utils/         # sanitize, cn helpers
  store/           # Zustand terminal store
```

---

Built with obsession by [Krishna Bhardwaj](https://github.com/Krishna09Bhardwaj).
