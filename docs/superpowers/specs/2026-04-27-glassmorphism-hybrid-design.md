# Glassmorphism Hybrid Portfolio — Design Spec
**Date:** 2026-04-27  
**Status:** Approved  
**Approach:** Option 1 — Additive scroll (single page, terminal + glass sections)

---

## 1. Goal

Transform the current single-screen interactive terminal into a hybrid portfolio: the existing terminal remains as the first full-viewport section, followed by scrollable glassmorphism sections (About, Skills, Experience, Projects, Certifications, Contact). A floating glass nav links the two halves. Three.js particle field replaced by CSS scanlines + radial glow.

**Live site:** https://krishna-portfolio-sandy.vercel.app  
**Design source:** `/Users/krishnabhardwaj/Downloads/Krishna Bhardwaj Portfolio Design System/`

---

## 2. Architecture

### Page scroll order
```
[Floating Nav — position: fixed]
[#terminal  — 100dvh, existing interactive terminal]
[#about     — About / neofetch card]
[#skills    — Skill tree]
[#experience — git log timeline]
[#projects  — Glass project cards]
[#certifications — Cert list]
[#contact   — Terminal-prompt contact form]
[Footer]
```

### File map

| File | Action |
|---|---|
| `src/app/globals.css` | Add design tokens + scanline/radial CSS; update terminal colour references to tokens |
| `src/app/layout.tsx` | Add Google Fonts (JetBrains Mono 300-700, Inter 300-700) |
| `src/app/page.tsx` | Full scrolling page: Nav + TerminalSection + 6 sections + Footer; remove Three.js import |
| `src/components/background/ParticleField.tsx` | **Delete** |
| `src/components/terminal/Terminal.tsx` | Wrap output in glass title bar (traffic lights + filename) |
| `src/components/nav/Nav.tsx` | **New** — floating glass nav |
| `src/components/sections/TerminalWindow.tsx` | **New** — shared glass panel with title bar |
| `src/components/sections/About.tsx` | **New** |
| `src/components/sections/Skills.tsx` | **New** |
| `src/components/sections/Experience.tsx` | **New** |
| `src/components/sections/Projects.tsx` | **New** |
| `src/components/sections/Certifications.tsx` | **New** |
| `src/components/sections/Contact.tsx` | **New** |

### Data flow
All sections read exclusively from `src/lib/data/krishna.ts`. No data is hardcoded in components. Update `krishna.ts` → all sections update on next deploy.

---

## 3. CSS / Design Tokens (`globals.css`)

### Background (replaces Three.js)
```css
body::before  /* radial glows */
  radial-gradient(circle at 85% 8%,  rgba(0,255,159,0.06), transparent 45%)
  radial-gradient(circle at 12% 90%, rgba(34,211,238,0.04), transparent 50%)

body::after   /* CRT scanlines */
  repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.035) 2px 4px)
```

### Color tokens
```css
--bg-base:             #0a0e17
--bg-elev-1:           #0d1117
--bg-elev-2:           #11161f
--glass-1:             rgba(255,255,255,0.04)
--glass-2:             rgba(255,255,255,0.06)
--glass-3:             rgba(255,255,255,0.08)
--glass-border:        rgba(255,255,255,0.10)
--glass-border-strong: rgba(255,255,255,0.16)
--glass-blur:          blur(14px)
--accent:              #00ff9f
--accent-soft:         rgba(0,255,159,0.14)
--accent-glow:         rgba(0,255,159,0.35)
--accent-line:         rgba(0,255,159,0.22)
--cyan:                #22d3ee
--cyan-soft:           rgba(34,211,238,0.14)
--warn:                #fbbf24
--error:               #ff6b6b
--fg-1:                #e2e8f0
--fg-2:                #cbd5e1
--fg-muted:            #94a3b8
--fg-dim:              #64748b
--fg-faint:            #475569
--shadow-glass:        0 1px 0 0 rgba(255,255,255,0.04) inset,
                       0 0 0 1px rgba(255,255,255,0.02) inset,
                       0 8px 24px -8px rgba(0,0,0,0.5)
--glow-accent:         0 0 16px rgba(0,255,159,0.18)
--glow-accent-strong:  0 0 24px rgba(0,255,159,0.32)
--font-mono:           'JetBrains Mono', 'Fira Code', ui-monospace, Menlo, monospace
--font-sans:           'Inter', system-ui, sans-serif
```

### Glass panel mixin (applied via `.tw` class)
```css
background:       var(--glass-1)
backdrop-filter:  blur(14px)
border:           1px solid var(--glass-border)
border-radius:    6px
box-shadow:       var(--shadow-glass)
```

### Hover state (cards, nav links)
```css
border-color: var(--accent-line)
box-shadow:   var(--shadow-glass), 0 0 20px rgba(0,255,159,0.12)
transition:   border-color 200ms, box-shadow 200ms
```

### Typography
- JetBrains Mono: all mono labels, section heads, terminal chrome, nav
- Inter: body paragraphs > 3 lines (About summary, project descriptions)
- Section sigil headers: `$ experience`, `// about`, `> projects`, `./contact`
- Accent on sigil character, rest `--fg-1`

### Radii
- Buttons, inputs, pills: `4px`
- Glass panels: `6px`
- Large hero cards: `10px`
- No pill/fully-rounded shapes

### Motion
- Scroll reveal: `opacity 0→1 + translateY 16px→0`, `280ms cubic-bezier(0.2,0.8,0.2,1)`, triggered by `IntersectionObserver` at 15% visibility
- Hover: `200ms` ease — border + glow only, no transform > 2px
- Cursor blink: `1s step-end infinite`
- Typewriter hero: `28ms/char`

---

## 4. Component Specs

### 4.1 Nav (`src/components/nav/Nav.tsx`)
- `position: fixed`, `top: 24px`, `left: 50%`, `transform: translateX(-50%)`
- `width: calc(100% - 48px)`, `max-width: 760px`, `z-index: 50`
- Inner: glass panel (`rgba(10,14,23,0.60)` + blur(14px) + border), `padding: 10px 18px`
- Brand left: `krishna@portfolio:~$` — `krishna` and `:~$` in `--accent`
- Links right: `./about  ./skills  ./experience  ./projects  ./certifications  ./contact`
- Active link: `color: var(--accent)`, `text-shadow: 0 0 6px var(--accent-glow)`
- Scroll detection: `IntersectionObserver` on each section, updates active link
- Click: `scrollIntoView({ behavior: 'smooth', block: 'start' })` with 80px offset for nav height
- Mobile (< 720px): brand hidden, links wrap

### 4.2 TerminalWindow (`src/components/sections/TerminalWindow.tsx`)
Reusable glass panel. Props: `filename`, `children`, `className?`, `style?`
```
┌ ● ● ●  filename.ext ──────────────────┐  ← title bar (tw-bar)
│                                        │
│  {children}                            │
│                                        │
└────────────────────────────────────────┘
```
- Title bar: 10px dots (red `#ff6b6b`, yellow `#fbbf24`, green `#00ff9f`), `border-bottom: 1px solid var(--glass-border)`
- Filename: 11px mono, `--fg-dim`
- Body padding: `22px 24px`

### 4.3 Terminal chrome update (`Terminal.tsx`)
Add a title bar (`tw-bar`: traffic lights + filename) as a sibling `div` directly above `.terminal-output` inside `.terminal-wrapper`. Do **not** wrap in `TerminalWindow` component — that would add a second glass background on top of the existing terminal CSS and cause double-borders. The `.terminal-wrapper` already fills the viewport; we only prepend the title bar row inside it. Terminal output and input areas are **not modified**.

### 4.4 About (`src/components/sections/About.tsx`)
Section id: `about`. Sigil: `//`

**Neofetch layout** (CSS grid, 2 cols on desktop, 1 col mobile):
- Left: ASCII art block (`color: var(--accent)`, `font-size: 11px`, text-shadow glow) — reuse the same block from BootSequence
- Right: key-value rows in mono 13px:
  ```
  OS          Next.js 16 · Vercel
  Role        Data Engineer & Analytics
  University  Chandigarh University
  Location    bio.location
  Status      Available from June 2026
  IEEE        research.doi (clickable link)
  Email       bio.email
  ```

Below: `border-top: 1px dashed var(--glass-border)`, then `bio.summary[]` paragraphs in Inter, `--fg-2`, max-width 640px. Empty strings in the array render as paragraph breaks.

### 4.5 Skills (`src/components/sections/Skills.tsx`)
Section id: `skills`. Sigil: `$`. Filename: `skills.json`

Inside a `TerminalWindow`. For each item in `skills[]`:
```
Languages                              90%
████████████████████░░░░   [90]
Python  ·  SQL  ·  Bash
```
- Bar: `Math.round(level/5)` filled blocks (`█`) + remaining empty (`░`), total 20 chars
- Items: joined with `  ·  `, `--fg-muted`, 12px
- Category: `--accent`, 13px mono

### 4.6 Experience (`src/components/sections/Experience.tsx`)
Section id: `experience`. Sigil: `$`. Command: `git log --oneline`

For each item in `experience[]`:
```
a3f9c2b  (HEAD → main)  Software Developer Intern @ JineeGreenCard
           Feb 2026 – Present · Remote
│
├─ ✓  Built real-time WhatsApp monitoring system across 500+ groups
├─ ✓  Built and QA'd meritmap.ai onboarding website end-to-end
└─ ✓  Configured Google Analytics for full-funnel conversion tracking
```
- Hash: random 7-char hex, `--accent`, 500 weight
- Branch tag: `--fg-muted`
- Highlights: `--fg-2`, preceded by `✓` in `--accent`
- Separator between entries: vertical `│` line, `--fg-dim`

### 4.7 Projects (`src/components/sections/Projects.tsx`)
Section id: `projects`. Sigil: `>`. Command: `ls ./projects`

Responsive grid: `repeat(auto-fit, minmax(320px, 1fr))`, gap 18px.

Each card (`project-card`):
- Absolute-positioned faint code-snippet watermark (9px mono, 8% opacity, gradient mask)
- Title bar: traffic lights + `filename.py` derived from project name
- Project name: 18px mono, `--fg-1`
- Description: 13px Inter, `--fg-2`
- Stack pills: `[Kafka]  [PySpark]` — glass-2 bg, border, 11px
- Metrics: `✓` prefix, 12px, `--fg-2`
- Footer: dashed border-top, GitHub link (`isExternalLink`)
- Hover: `border-color: var(--accent-line)`, glow shadow

Reads from `projects[]`.

### 4.8 Certifications (`src/components/sections/Certifications.tsx`)
Section id: `certifications`. Sigil: `$`. Command: `ls ./certs`

Flat list, no grid. Each row:
```
[ LIVE ]  Oracle OCI Generative AI Certified Professional
          Oracle · 2024 · Valid until July 2026
          Certified to build and work with enterprise-grade Gen AI
```
- `[ LIVE ]` tag: `--warn` border + color for certs with `validUntil`; `[ OK ]` in `--accent` for completed
- Name: 500 weight, `--fg-1`
- Meta: 11px, `--fg-muted`
- Description: 13px, `--fg-2`

Reads from `certifications[]`. Ends with `🔄  More incoming — be patient.` row.

### 4.9 Contact (`src/components/sections/Contact.tsx`)
Section id: `contact`. Sigil: `./`

Three terminal-prompt input rows:
```
>  name     =  [                              ]
>  email    =  [                              ]
>  message  =  [                              ]
```
- Each row: glass-1 bg, border, border-radius 4px, `padding: 10px 14px`
- Focus: border → `var(--accent-line)`, box-shadow `0 0 16px rgba(0,255,159,0.12)`
- Inputs: transparent bg, mono 13px, `--fg-1`

Submit button `./send_message.sh`:
- On click: if any field is empty, border turns `--error` red with shake animation; if valid, fires `window.open(mailto:...)` with name/message pre-filled, shows terminal log sequence below the form
- Terminal log: "Establishing connection…", "Sending…", "✓ Message sent" — same SSH animation style as existing `ssh connect` command

Direct links below dashed divider:
- Email (fires mailto), GitHub (external link), LinkedIn (external link)
- Same styling as `contact` command output in the terminal

### 4.10 Footer
```
krishna@portfolio:~$ logout
Connection to portfolio closed. Built by hand · 2026.
```
- 12px mono, `--fg-dim`
- `border-top: 1px dashed var(--glass-border)`, padding 32px

---

## 5. Scroll Reveal

All sections (except terminal, which is always visible) animate in on scroll:
```
initial:   opacity: 0,  transform: translateY(16px)
animated:  opacity: 1,  transform: translateY(0)
duration:  280ms
easing:    cubic-bezier(0.2, 0.8, 0.2, 1)
trigger:   IntersectionObserver threshold 0.15
```
Implemented via a `useScrollReveal` hook that adds a CSS class when the section enters the viewport. No Framer Motion for sections (keeps bundle smaller — Framer Motion stays only for the existing terminal lines).

---

## 6. Implementation Order

1. `globals.css` — tokens + background
2. `layout.tsx` — fonts
3. `TerminalWindow.tsx` — shared panel component
4. `Nav.tsx` — floating nav
5. `page.tsx` — wire together terminal + sections + nav; delete ParticleField
6. `Terminal.tsx` — add glass chrome wrapper
7. `About.tsx`
8. `Skills.tsx`
9. `Experience.tsx`
10. `Projects.tsx`
11. `Certifications.tsx`
12. `Contact.tsx`
13. Build check + push

---

## 7. Out of Scope

- `simple-icons` brand marks — not added (not in existing codebase; confirmed skip)
- Backend for contact form — mailto only, same as existing behavior
- Dark/light mode toggle — single dark theme
- Additional pages/routes — single page only
