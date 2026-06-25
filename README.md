# ForgeDesign

A static HTML + CSS design showcase for **Forge** — its typography, color tokens,
and primitive components in one page. Open `index.html` in a browser; no build step.

<img width="1512" height="826" alt="Screenshot 2026-06-25 at 1 14 16 AM" src="https://github.com/user-attachments/assets/ce007114-3e4d-46dc-a8a0-4918e2058c23" />
<img width="1512" height="826" alt="Screenshot 2026-06-25 at 1 14 36 AM" src="https://github.com/user-attachments/assets/c1a95afa-c79e-4a1c-8d9c-925fbb1c348e" />
<img width="1512" height="826" alt="Screenshot 2026-06-25 at 1 14 46 AM" src="https://github.com/user-attachments/assets/d5a11470-22d5-4405-8eda-b6b85bb03959" />
<img width="1512" height="796" alt="Screenshot 2026-06-25 at 1 15 14 AM" src="https://github.com/user-attachments/assets/2cef6262-afa4-4ecb-a6de-72ef20d07dac" />
<img width="1512" height="826" alt="Screenshot 2026-06-25 at 1 15 27 AM" src="https://github.com/user-attachments/assets/98463fe7-fea8-480f-b7bf-9e67f872467f" />

## Stack
Plain HTML, CSS, and ~80 lines of vanilla JS. Fonts pulled from Google Fonts.

## Design language
- **Typography:** Playfair Display (serif), Inter (sans), JetBrains Mono (mono)
- **Surfaces:** sharp corners (no border-radius), thin borders, layered grid + noise background
- **Animations:** windowed slide transitions using `cubic-bezier(0.4, 0, 0.2, 1)`
- **Palette:** five-token red / plum system
  - `#BF2A45` — primary accent
  - `#8C1642` — rouge dim
  - `#590C3E` — deep plum
  - `#261126` — page background
  - `#F24444` — bright highlight / hover

Inspired by [DitherTemplate](https://github.com/pranavgupta55/DitherTemplate) and
the Scribe graph UI.

## Files
```
index.html   single-page showcase
styles.css   design tokens + components
script.js    bottom-sheet, view-toggle, scroll-spy
```
