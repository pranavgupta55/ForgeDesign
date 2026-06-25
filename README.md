# ForgeDesign

A static HTML + CSS design showcase for **Forge** — its typography, color tokens,
and primitive components in one page. Open `index.html` in a browser; no build step.

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
