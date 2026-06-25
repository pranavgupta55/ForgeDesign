# AGENT.md — Forge Design build guide for AI agents

You are about to build a dashboard in the Forge aesthetic. This repo is the
template. **Read this file → view every PNG in `screenshots/` → read
`styles.css :root` and `<section id="layout">` in `index.html` →
read `script.js` for the JS-rendered primitives → then generate.**
Anchoring on screenshots first prevents you from re-deriving spacing, type,
and color from text alone.

## Loading the visual ground truth

The reference PNGs are in `screenshots/`, generated from the live HTML.
Read them in this order: `overview.png` → `colors.png` → `typography.png`
→ `components.png` → `layout.png` → `section-windows.png` →
`action-cluster.png`. If a screenshot disagrees with this file, **the
screenshot wins** — update this file. (To regenerate after a visual change:
`npm install && npm run screenshots`. See "Regenerating screenshots" below.)

## Build order

Don't build sequentially; **compose from primitives**. Pick the page
skeleton, then drop in named primitives by class. The static primitives
(Stats Row eyebrow + sub-rule, Filter Bar markup, Action Cluster, Stack
Pairs, Status Dots) live as inline HTML inside `<section id="layout">` of
`index.html`. The dynamic ones (Section Window, Data Row, the live Stats
Row counts) are **rendered by `script.js`** from a small state object —
copy the `renderRow` / `renderTables` / `renderStats` functions, not
inline markup, for those. Order of attention when you start a new page:

1. `:root` tokens (palette + fonts) → copy verbatim.
2. Page skeleton: `<header>` (h1 + meta strip) → `.summary` → `.projects`
   filter bar → `<main>` with `.window-demo` sections.
3. Drop the relevant primitive(s) into `<main>`.
4. Wire interactivity last (filter toggles, action buttons).

## Visual identity — the non-negotiables

These five rules make UI feel "Forge". Break any one and it stops matching
the template.

- **Sharp corners only.** `border-radius: 0` on every element — buttons,
  chips, badges, cards, dots. The 7×7 status marker is a **square**, never
  a circle.
- **Plum-into-red dark palette.** Background is `#09030a` (never `#000`).
  Reds carry action; plums carry surface. No bright greens or blues except
  the single `--accent-green` token used for "done" status.
- **Dense, minimal chrome.** 1 px borders, no shadows, no gradients, no
  rounded fills. Two border weights: `--border-subtle` (rgba white 6 %) for
  low-contrast separators, `--border-strong` (14 %) for emphasis dividers.
- **Type triad, strict roles.**
  - **Inter** — every title, body, UI label, and `<h1>` including the
    hero. This is the default voice.
  - **JetBrains Mono** — every ID, hash, hex, timestamp, count, and
    uppercase-tracked eyebrow label. Mono carries data.
  - **Playfair Display** — large serif numerals only (the `.n` in
    `.stats-demo`) plus the italic-700 wordmark accent
    (`.hero h1 .accent`). Never use it for body or row content.
- **Square status dots, 7 × 7 px.** Used in section heads and inline
  lists. Color from `--accent-red-bright | red | orange | green | plum`.

## Token reference (canonical values live in `styles.css :root`)

Tiered the way the search guidance recommends — primitive at top, semantic
below. **Don't redefine these; import the file or copy `:root` verbatim.**

| token | value | role |
|---|---|---|
| `--bg-base`           | `#09030a` | page background |
| `--bg-card`           | `#1a0a18` | header strips, chip surface |
| `--bg-elev`           | `#2D142C` | hover fill on interactive elements |
| `--bg-elev-2`         | `#3a1c38` | deepest surface (rare) |
| `--accent-red`        | `#CB2943` | primary, project pill |
| `--accent-red-bright` | `#EE4541` | active status, hover stroke |
| `--accent-red-dim`    | `#811339` | secondary outlines, chip borders |
| `--accent-red-deep`   | `#530B32` | danger fill (purge-button hover) |
| `--accent-green`      | `#73C990` | done / success |
| `--accent-orange`     | `#C87A3A` | pending, custom tag, no-project |
| `--text-main / dim / mute` | `#ece6dc / #9b8a92 / #5a4a55` | text tiers |

## Spacing & motion

- **Gap scale (px):** `4 / 7 / 14 / 20 / 28`. 14 is the row default; 4 is
  for tightly-coupled neighbours (day ↔ time); 28 is for breathing room
  (session ↔ id). Don't introduce new gaps; pick from this list.
- **Padding:** rows use `16px 16px`; section heads use `12px 16px`;
  buttons fit content with `0` padding (size set by `width`/`height`).
- **Border width:** 1 px everywhere. Never 2 px.
- **Animation curve:** `cubic-bezier(0.4, 0, 0.2, 1)`. Used for
  `slide-down` (section entry) and `fade-in` (`<main>` entry). No bounce,
  no spring.

## Components — what each is for + states

Every primitive ships as **HTML** in `index.html` + **CSS** in
`styles.css`. Copy the markup. States listed below are the only ones
each primitive has — anything else is off-spec.

- **Stats Row** (`.stats-demo`) — Playfair numerals + uppercase Inter
  labels with 1 px right-borders. Drive counts from state. Numeral color
  switches by status (`.n.active`, `.n.pending`, `.n.done`); the **label
  stays mute** — never recolor the label.
- **Bookended Filter Bar** (`.filter-bar-demo`) — `[SELECT ALL]` / centered
  chips / `[SELECT NONE]`. Chips: default → hover → `.active`. Custom
  variant `.filter-chip.custom` paints orange. Bookend buttons must sync
  with chip state (all chips active → `Select all` active; none → `Select
  none` active).
- **Section Window** (`.window-demo`) — bordered card with `[dot] label
  ........ count` header, mono `.row-header-demo` column captions, then
  `.row-demo`s. Use one window per status bucket. **JS-rendered** — see
  `renderTables()` in `script.js` for the markup template.
- **Data Row** (`.row-demo`) — 13-track grid: 7 content + 6 explicit-gap
  tracks. Cells with a trailing vertical divider (`.ac-cluster`, `.r-id`,
  `.r-title`) must `align-self: stretch`. Divider is a `::after` pseudo at
  `right: -7px; top: 20%; bottom: 20%`. Row hover fills with
  `var(--accent-red-tint)`. **JS-rendered** — see `renderRow()` in
  `script.js`.
- **2 × 2 Action Cluster** (`.ac-cluster`) — four 26×26 square icon buttons
  in flex-wrap, `gap: 1px` (= border width, no overlap). States: default
  → hover (bg-elev + accent-red-bright stroke) → `.disabled` (22 % opacity,
  `pointer-events: none`, stays in slot — the cluster's footprint never
  changes). `.act-done:hover` gets a green tint; `.act-purge:hover` gets
  the `--accent-red-deep` danger fill.
- **Stack Pair** (`.stack-card`) — two-line stack: bold Inter title above
  smaller mono ID. Use for any "primary label + secondary identifier"
  combo (title+sessionID, TOC+timestamp). Sizes to content
  (`width: max-content`) — never apply `min-width`, see Pitfall 4.
- **Status Dots** (`.dot-item`) — 7×7 square swatch + lowercase Inter
  label. Six pre-defined colorways: `.dot-active / blocked / pending /
  done / cancelled / archived`.

## Behaviour — bucket-shift action buttons (example)

This is the semantic the Tasks dashboard uses. Treat as a template for
any 4-bucket workflow.

| bucket | ↑ up | ✓ done | ↓ down | ⌫ purge |
|---|---|---|---|---|
| active   | — (top)        | → done    | → pending  | —        |
| pending  | → active       | → done    | → archived | —        |
| done     | → pending      | —         | → archived | —        |
| archived | → pending      | —         | — (bottom) | → remove |

Disabled buttons keep their slot at 22 % opacity. **Never collapse the
cluster when something is disabled** — the 53×53 footprint is part of the
identity.

## Pitfalls — these all bit us; you will hit them too

1. **Inline `<svg>` renders as filled black shapes by default.** Every
   icon needs `class="ic"` so the `svg.ic { stroke: currentColor;
   fill: none; stroke-width: 1.75 }` rule applies. Symptom: triangles
   where arrows should be.
2. **`margin-left: -Npx` on a right-justified grid item is a visual
   no-op.** The outer edge stays pinned to the track's right edge. To
   actually shrink a column gap, restructure into explicit-spacer columns
   (`gap: 0` + dedicated 14 px (or 4 px / 28 px) track for each gap).
3. **`btn.textContent = '…'` wipes the inline SVG inside a button.** Use
   `btn.classList.add('pending')` + a CSS rule for the loading visual.
4. **Right-aligned card + `min-width` = blank left half.** Right-aligned
   content in a min-width box looks empty on the left. Use
   `width: max-content` so the card sizes to its content.
5. **`nth-child` border-collapse looks like overlap.** Don't share borders
   between adjacent buttons. Use `gap: 1px` (= border width) so each
   keeps its own outline.
6. **Cells with dividers need `align-self: stretch`.** Otherwise the cell
   sizes to content and the `::after` divider (top: 0 / bottom: 0) only
   spans the short cell, not the full row height.
7. **Use padding inside cells, never margin, to offset content.** With
   `box-sizing: border-box` the cell footprint is constant — divider
   x-positions don't shift. Margin moves the cell and the divider with it.
8. **`file://` blocks `fetch()`.** If the dashboard ships as a static HTML
   file the user opens directly, load JSON via
   `<script src="data.js?t=" + Date.now()>` injection (CORS-exempt).
   Otherwise run a tiny `http.server` on `127.0.0.1`. Don't burn a half
   hour wondering why CORS fires.
9. **Never `location.reload()` or `<meta http-equiv="refresh">` for live
   data.** Page snap on every tick. Poll JSON, fingerprint the result,
   only re-render rows when the fingerprint changed. No flicker.
10. **Schema migrations.** If you inherit a "stale" status from old data,
    map it to `archived` on read. The current status enum is
    `in_progress / pending / blocked / done / cancelled / archived`.

## Screenshots — visual ground truth

Located in `screenshots/`. Generated from the live HTML by Playwright; do
not hand-edit. View these in order before generating any CSS:

| File | What it shows |
|---|---|
| `overview.png`        | full page top to bottom |
| `typography.png`      | the type triad with samples |
| `colors.png`          | 10-token swatch grid (4 × 2) |
| `components.png`      | badges, code links, level filter, icon grid |
| `layout.png`          | all layout primitives, top to bottom |
| `stats-row.png`       | live-state numeric stats |
| `filter-bar.png`      | bookended Select all / chips / Select none |
| `section-windows.png` | the four live tables stacked |
| `action-cluster.png`  | 2×2 cluster in all-enabled / partial / archived |
| `icon-grid.png`       | the static 8-icon reference grid |
| `status-dots.png`     | 6 status dot colorways |

## Regenerating screenshots

**Always re-run after a visual change**, then commit the PNGs in the same
change as the CSS/HTML edit. CI-less consistency means "the PNGs in the
repo match the HTML in the repo at this commit."

```sh
npm install            # one-time — pulls Playwright + Chromium
npm run screenshots    # writes 11 PNGs into screenshots/
```

The runner lives at `tools/screenshots.mjs`. Add a new `TARGETS` entry
there to capture a new section. Each target is either `{ name, full: true }`
(full-page) or `{ name, sel: '#selector' }` (element bounding-box).

## When in doubt

- Read `:root` in `styles.css` before inventing a color.
- Read `<section id="layout">` in `index.html` before composing a new
  layout — every primitive you need is there.
- Sharp corners. Mono for numerics. Inter for prose. Playfair for big
  serif numerals + the italic wordmark accent.
- User says "green" / "yellow" → `--accent-green` / `--accent-orange`.
- User says "red" with no qualifier → `--accent-red` (primary).
