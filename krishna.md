# Krishna Portfolio — Session Log

## Session 1 — 2026-04-22

### ✅ Done
- Initialized Next.js 16.2.4 (App Router, TypeScript, Tailwind CSS 4, ESLint, src/ dir)
- Installed all dependencies: framer-motion, @react-three/fiber, @react-three/drei, three, zustand, @vercel/analytics, clsx, tailwind-merge, canvas-confetti, lucide-react, @xterm/xterm
- Set git remote → https://github.com/Krishna09Bhardwaj/krishna-portfolio.git
- Created full directory structure: components/, lib/, store/, hooks/
- Built type system: OutputLine, CommandDef, TerminalState
- Built data layer: krishna.ts with all bio, projects, skills, experience, research, certifications
- Built Zustand terminal store (lines, history, effects state)
- Implemented all 20+ commands in handlers.ts + command registry in index.ts
- Commands: help, ls (projects/skills/experience), whois, cat (resume/research/certifications), open <id>, contact, github, linkedin, clear, uptime, ping, history, whoami, sudo hire, matrix, ssh connect
- Built Three.js particle field background (@react-three/fiber, 1200 particles, slow drift)
- Built CRT scanline overlay via CSS (globals.css)
- Built boot sequence: BIOS lines → ASCII art → last login → welcome message
- Built OutputLine component with Framer Motion staggered animations
- Built CommandInput with tab autocomplete, arrow key history nav, Ctrl+L clear
- Built MatrixRain canvas Easter egg (5 seconds of Japanese characters)
- Built ConfettiEffect Easter egg for sudo hire krishna
- Built QuickCommands mobile pill strip (horizontal scroll)
- Built Terminal orchestrator wiring all components + command dispatch
- Built main page with dynamic SSR-disabled imports + Three.js gradient backdrop
- Wrote SEO metadata (title, description, keywords, OG, Twitter cards)
- Created robots.txt, vercel.json, resume.pdf placeholder
- Build passes ✓ — Next.js 16 static output, no TypeScript errors

### 🔄 In Progress
- Nothing

### ⏳ Pending
- Replace public/resume.pdf with your actual resume PDF
- Git push to GitHub (remote is configured)
- Vercel deployment (connect GitHub repo)
- Add real resume PDF download file

### 🐛 Known Issues
- Resume download will fail until you replace public/resume.pdf with your actual PDF
- The ASCII art in BootSequence may wrap on very narrow mobile screens (< 360px)

### 🎯 Next Session
- Replace resume.pdf with actual file
- Vercel deploy and test production
- Optional: Add smooth scroll-to-top on clear command
- Optional: Add typing sound effect (subtle click on keypress)
- Optional: Add more Easter eggs (cowsay, sl, etc.)
- Optional: Custom 404 page as "bash: page not found"

---

## Session 2 — 2026-04-23

### ✅ Done

**FIX 1 — GitHub repos (real links)**
- Fetched actual repos from github.com/Krishna09Bhardwaj via GitHub API
- `open pipeline` → linked to real repo: github.com/Krishna09Bhardwaj/real-time-data-pipeline ✓
- `open dashboard` → no dedicated repo found → links to main profile (github.com/Krishna09Bhardwaj)
- `open realive` → no dedicated repo found → links to main profile (github.com/Krishna09Bhardwaj)
- All GitHub links in `open <project>` output are now clickable (isExternalLink) and open in new tab

**FIX 2 — cat command (broken fallback)**
- Was: `cat: <missing>: No such file or directory` for unknown/empty args
- Now: Shows usage: `Usage: cat <file>` + `Available files: resume · research · certifications`

**FIX 3 — cat resume (full rewrite)**
- Replaced plain text with a full ASCII box format (┌─┐ borders)
- Content: Education, Experience, Stack, Research DOI, Certifications summary, GitHub/LinkedIn
- `[ 📄 Download Full Resume — PDF ]` line is a real clickable button (isDownloadButton: true)
- PDF auto-triggers on `cat resume` command AND is manually clickable in the output box
- "Clicking download? Good taste." — stays

**FIX 4 — cat certifications (full rewrite)**
- Replaced numbered list with full ASCII box
- Each cert has: name, issuer, status/validity, plain-English explanation
- Added "🔄 More certifications incoming" entry at bottom
- All 4 certs: Oracle OCI GenAI, Meta Data Analyst, Python Data Analytics, Data Science at Scale

**FIX 5 — cat research (full rewrite with real DOI)**
- Replaced abstract blob with clean ASCII box format
- Plain English explanation: "Predicted when networks would choke under load — before they actually did"
- DOI line: `10.1109/ACROSET66531.2025.11280883`
- Link line: `https://doi.org/10.1109/ACROSET66531.2025.11280883` — clickable, opens in new tab (isExternalLink)

**FIX 6 — sudo hire krishna (Easter egg fixed)**
- Was: old ╔═╗ box format
- Now: line-by-line animated output:
  - `✅ ACCESS GRANTED — ROOT PRIVILEGES APPROVED`
  - Hire sequence with Candidate / Clearance / Pipeline / Research / Status fields
  - "You just made a great decision."
  - `Next step → krishna09bhardwaj@gmail.com`
- Confetti still triggers correctly

**FIX 7 — LinkedIn URL (verified correct everywhere)**
- `bio.linkedin` = `https://linkedin.com/in/krishna-bhardwaj-16306824a` — correct in all files
- Terminal.tsx `linkedin` command uses `bio.linkedin` → opens correct URL in new tab ✓
- CONTACT_LINES uses `bio.linkedin` ✓
- No incorrect LinkedIn URLs found anywhere

**FIX 8 — whois certifications reference**
- WHOIS_LINES draws from `bio.summary` — no certification references (correct)
- No "SnowPro" or incorrect cert references found anywhere in codebase

**Infrastructure improvements**
- Added `isDownloadButton?: boolean` to OutputLine type → renders as `<button>` that triggers PDF download
- Added `isExternalLink?: string` to OutputLine type → renders as `<a target="_blank">` that opens URL
- Updated OutputLineComponent to handle both special render cases cleanly
- Removed unused `certifications` import from handlers.ts
- Build passes ✓ — zero TypeScript errors, zero ESLint errors

### 🔄 In Progress
- Nothing

### ⏳ Pending
- Replace public/resume.pdf with actual resume PDF (placeholder is 329 bytes, will show blank)
- Vercel deployment (connect GitHub repo at vercel.com/new)
- Test on mobile device

### 🐛 Known Issues
- public/resume.pdf is still a placeholder — download button works but downloads an empty/blank PDF
  → ACTION REQUIRED: Replace /public/resume.pdf with your real resume before deploying

### 🎯 Next Session
- Replace resume.pdf with actual file (placeholder still in place)
- Optional: typing sound on keypress
- Optional: custom 404 as terminal error page

---

## Session 3 — 2026-04-24

### ✅ Done

**FIX 1 — ASCII art (KRISHNA BHARDWAJ)**
- Was: rendering cut off as "KRISHNA BHARD 1" due to font/width issue
- Now: full block-letter art for KRISHNA (row 1) + BHARDWAJ (row 2), both complete
- Narrow fallback (< 600px) unchanged

**FIX 2 — Boot sequence (full rewrite)**
- Removed technical/niche bios messages
- New sequence: 9 status lines with colored tags ([ OK ] / [ HIGH ] / [ OPTIMAL ] / [ LIVE ] / [ !! ])
- Tags are right-aligned with flexbox layout
- Warning line and "System ready." line added
- ASCII art follows, then Last login timestamp, then help hint
- Total boot time: ~2.3s

**FIX 3 — whois krishna (full rewrite)**
- Removed old bio.role/bio.education template fields
- New output: Name / Currently / Fuel / Status / Location / Email / Phone
- Full personal summary paragraph (8 sections, first-person voice)
- No external data dependencies — all inline

**FIX 4 — cat research box alignment**
- Introduced rline() helper: pads inner content to exactly 63 chars so right │ border is perfectly straight
- Every line now has identical total width
- Build passes ✓

### 🔄 In Progress
- Nothing

### ⏳ Pending
- Replace public/resume.pdf with actual PDF (currently a placeholder)
- Optional: typing sound on keypress
- Optional: custom 404 as terminal error page

### 🐛 Known Issues
- public/resume.pdf is still a placeholder (329 bytes) — download button works but PDF is blank
  → ACTION REQUIRED: Replace /public/resume.pdf with your real resume
