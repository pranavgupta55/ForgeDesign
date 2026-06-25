# AGENT.md — Forge Design build guide for AI agents

You are about to build a dashboard in the Forge aesthetic. This repo is the
template. Read this file, then read `styles.css` (tokens) and `index.html`
(every component you'll need exists in it). View the PNGs in `screenshots/`
before generating CSS so you anchor on the real look, not your guess of it.

## Build order (one-shot prompts work when you follow this)

1. **Copy `:root` from `styles.css` verbatim** — palette + font stack. Never
   invent colors; the 8 tokens cover every state. Add new tokens only for
   functional needs (success / warning), not visual variety.
2. **Load fonts**: Inter 400-700, JetBrains Mono 400/500, Playfair 600-800.
3. **Pick your primitives**, in this order, from `<section id="layout">`:
   Stats Row → Filter Bar → Section Window → Stack Pairs → Action Cluster.
4. **Wire behaviour** (bucket-shift below) only after the static look matches
   the screenshots.

## Visual identity — the non-negotiables

These are the signals that make a UI feel "Forge". Break any of them and
it stops looking like the template.

- **Sharp corners only.** `border-radius: 0` everywhere. Dots, badges,
  buttons, cards — all squared.
- **Plum-into-red dark palette.** `#09030A` background, never pure black.
  Red is for action, plum is for surface.
- **Dense, minimal chrome.** 1 px borders, no shadows, no gradients. Use
  `border-subtle` (rgba 6 %) for low contrast, `border-strong` (14 %) for
  emphasis.
- **Type triad, strict roles.** Inter = UI / titles / body. JetBrains Mono =
  IDs, hex, timestamps, hashes, eyebrow labels (uppercase + letter-spacing
  ≥ 0.10 em). Playfair = hero numerals only (`stats-demo .n` and `hero h1`).
  Italic Playfair is the wordmark accent.
- **Status dots are 7×7 squares.** Never circles. Use the dot in section
  heads, inline lists, anywhere a colored marker is needed.

## Tokens (read `styles.css :root` for canonical values)

| token | hex / value | use |
|---|---|---|
| `--bg-base`      | `#09030A` | page background |
| `--bg-card`      | `#1A0A18` | header strips, chip surface |
| `--bg-elev`      | `#2D142C` | hover-fill on interactive elements |
| `--accent-red`        | `#CB2943` | primary brand, blocked, project pill |
| `--accent-red-bright` | `#EE4541` | active status, hover stroke |
| `--accent-red-dim`    | `#811339` | secondary outlines |
| `--accent-red-deep`   | `#530B32` | danger fill (purge hover) |
| `--accent-green`      | `#73C990` | done / passing |
| `--accent-orange`     | `#C87A3A` | pending / custom / no-project |
| `--text-main / dim / mute` | `#ECE6DC / #9B8A92 / #5A4A55` | text hierarchy |

## Components — what each is for

Every primitive ships as both **HTML** in `index.html` and **CSS** in
`styles.css`. Copy the markup, don't re-derive.

- **Stats Row** (`.stats-demo`). Big serif numerals + uppercase labels with
  1 px right-borders. Drive counts from state; color the numeral by status,
  not the label.
- **Bookended Filter Bar** (`.filter-bar-demo`). `[SELECT ALL]` / centered
  chips / `[SELECT NONE]`. Chips support a `.custom` orange variant for
  cross-cutting tags. Bookends sync with chip state — see `script.js`.
- **Section Window** (`.window-demo`). Bordered card. Header strip is
  `[dot] label .................. count`. Below the strip: a mono
  `.row-header-demo` with column captions, then `.row-demo`s.
- **Data Row** (`.row-demo`). 13-track grid (7 content + 6 explicit gap
  tracks). Cells that need a trailing vertical divider must stretch
  (`align-self: stretch`). Divider is a `::after` pseudo at `right: -7px;
  top: 20 %; bottom: 20 %`.
- **2 × 2 Action Cluster** (`.ac-cluster`). Four square icon buttons in a
  flex-wrap layout, `gap: 1px` (= border width, so borders never overlap).
  Icons are stroke-based SVGs — see Pitfall 1.
- **Stack Pair** (`.stack-card`). Two-line stack: bold Inter title above
  smaller mono ID. Use for any "primary label + secondary identifier"
  pattern (title+sessionID, TOC+timestamp).

## Behaviour — bucket-shift action buttons

Match the live dashboard. Four icons in fixed positions (`↑ ✓ ↓ ⌫`); per-row
enabled state depends on which bucket the row is in:

| bucket | ↑ up | ✓ done | ↓ down | ⌫ purge |
|---|---|---|---|---|
| active   | — (top)        | → done    | → pending  | —              |
| pending  | → active       | → done    | → archived | —              |
| done     | → pending      | —         | → archived | —              |
| archived | → pending      | —         | — (bottom) | → remove       |

Disabled buttons stay in their slot at 22 % opacity. **The cluster's
footprint never changes** — never collapse the grid when something is
disabled.

## Pitfalls — these all bit us; you will hit them too

1. **Inline SVGs render as filled black shapes by default.** Every action
   icon must carry `class="ic"` so the `svg.ic { stroke: currentColor;
   fill: none; stroke-width: 1.75 }` rule applies. Easy way to spot the bug:
   triangles where arrows should be.
2. **`margin-left: -Npx` on a right-justified grid item is a visual no-op.**
   The outer edge stays pinned to the track's right edge. To actually
   shrink a column gap, restructure the grid into explicit-spacer columns
   (`gap: 0` + dedicated track for each gap).
3. **Setting `btn.textContent = '…'` for a loading state wipes the SVG
   inside.** Use `btn.classList.add('pending')` and a CSS rule for the
   visual instead.
4. **Right-aligned card + `min-width` = blank left half.** Right-aligned
   content in a min-width box looks empty on the left. Use
   `width: max-content` so the card sizes to its content.
5. **Border-collapse via `nth-child` zero-borders looks like overlap.**
   Don't share borders. Use `gap: 1px` (equal to border width) between
   buttons so each keeps its own outline.
6. **Cells with dividers need `align-self: stretch`.** Otherwise the cell
   sizes to content and the `::after` divider (top:0/bottom:0) only spans
   the short cell, not the full row height.
7. **Use padding inside cells, never margin.** With `box-sizing: border-box`
   the cell footprint stays constant — divider x-positions don't shift.
   Margin would move the cell.
8. **`file://` blocks `fetch()`.** If the dashboard ships as a static HTML
   file the user opens directly, fetch JSON via `<script src="data.js?t=" +
   Date.now()>` injection (CORS-exempt). Otherwise run a tiny local
   `http.server`. Don't waste a half hour wondering why CORS fires.
9. **Never use `<meta http-equiv="refresh">` for live data.** It full-page
   reloads → visible snap. Poll JSON, fingerprint the result, and only
   re-render rows when the fingerprint changes. No flicker.
10. **The "stale" status does not exist.** Old data may carry it; map it to
    `archived` on read. Status enum is `in_progress / pending / done /
    cancelled / archived`.

## Screenshots (visual ground truth)

Before writing any CSS, read these so you anchor to the real look. They
live in `screenshots/`:

- `screenshots/overview.png` — full dashboard layout
- `screenshots/section-window.png` — section header + column captions + rows
- `screenshots/action-cluster.png` — 2 × 2 button group, enabled/disabled
- `screenshots/stats-row.png` — Playfair numerals + uppercase labels
- `screenshots/palette.png` — 8-token swatch grid

If a screenshot disagrees with this file, **the screenshot wins** — update
this file. Source of truth flows: PNG → `styles.css` → `AGENT.md`.

## When in doubt

- Read `:root` in `styles.css` before inventing any color or font.
- Read `<section id="layout">` in `index.html` before composing a new
  layout — every primitive you need is already there.
- Sharp corners. Mono for numerics. Inter for prose. Playfair for numerals.
- If the user asks for "the green / yellow color", they mean
  `--accent-green` / `--accent-orange`.
