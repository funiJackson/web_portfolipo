# Portfolio v2 — terminal edition

Jackson Zhou Fandi's portfolio, rebuilt as a React + TypeScript app: a
terminal / tiling-window-manager layout (Omarchy flavoured) dropped into an
HD-2D night diorama (Octopath Traveler flavoured).

The original site at the repo root is untouched and keeps its own URL — this is
a separate build with its own deploy.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the build
npm run lint
```

## Deploying

The build is path-agnostic (`base: './'` in `vite.config.ts`), so `dist/` works
at a domain root, under a sub-path, or opened straight from disk.

**Netlify** — create a *new* site from this repo (don't touch the existing one)
and set **Base directory = `v2`**. `netlify.toml` supplies the rest:
`npm run build`, publish `dist`.

**Vercel** — new project from this repo, **Root Directory = `v2`**. Vite is
detected automatically.

## What's in here

```
src/
  App.tsx              layout, global keyboard shortcuts
  components/
    StatusBar.tsx      the Waybar-style top bar (workspaces, theme, clock)
    Window.tsx         section chrome — title bar, traffic lights, lit border
    Hero.tsx           typewriter intro + shortcut hints
    Skills.tsx         the stack table
    Projects.tsx       card list
    ProjectCard.tsx    one card
    Mosaic.tsx         renders a 10x10 bitmap as an SVG pixel mosaic
    CommandPalette.tsx ⌘K / Ctrl+K palette
    Terminal.tsx       the interactive shell
    Diorama.tsx        the background scene — lanterns, dust, skyline
  data/
    projects.ts        every project, skill row and contact detail
    icons.ts           the icon bitmaps
  hooks/               scroll spy, reveal-on-scroll
  lib/platform.ts      ⌘ vs Ctrl
  styles.css           the palette, the scene, and all styling
```

### Editing content

Everything the page says comes from `src/data/projects.ts`. Adding a project
means adding one object to `PROJECTS` — the card, the terminal's `ls` / `cat` /
`open`, and the command palette all pick it up.

A project's `icon` points at a bitmap in `src/data/icons.ts`: a 10x10 grid where
`#` is a solid accent tile, `*` a highlight, `.` an empty (faint) tile. Draw a
new one in any text editor.

### Type

Two faces, both from Google Fonts:

- **Cascadia Mono** for everything you read — the same typeface Omarchy uses in
  its terminal. If the visitor has the Nerd Font build installed locally
  (`CaskaydiaMono Nerd Font`) that one wins, so Omarchy users see their exact
  font.
- **Press Start 2P** for headings and window chrome — the 8-bit display face,
  which is where the retro-digital read comes from. It has no `⌘`/`◈`, so those
  glyphs are pinned back to the mono face (`.glyph`, `kbd.sym`).

Both live in `--mono` / `--pixel` at the top of `styles.css`.

### The theme

One fixed theme, no switcher: Omarchy green (`#9ece6a`, straight off
omarchy.org) on its near-black, with bone-white text, over a pixel forest at
night. Every colour is a CSS variable at the top of `styles.css` — change
`--green` and the page follows.

The background is `Diorama.tsx`, drawn as SVG rects on a 4-unit block grid —
the same grid the project icons use, so the whole page reads as one piece of
pixel art. No images, no filters:

- three bands of firs — far, mid, near — each taller and darker than the one
  behind it, laid out by a seeded PRNG so the same forest grows every visit
- soft green haze between the bands, a blocky moon, a scatter of stars (a few
  of them twinkling green)
- fireflies drifting through the near air, mostly green with the odd amber one
- the bands parallax at different rates as you scroll

Window panels sit in front as lit glass (`backdrop-filter`), so the forest
shows through without ever fighting the text. All motion honours
`prefers-reduced-motion`.

To make the forest louder or quieter: `--forest-far` / `--forest-mid` /
`--forest-near` set the three greens, and the `.band-*` / `.fog-*` opacities in
`styles.css` set how much of it comes through.

### Keyboard

| key | does |
| --- | --- |
| `⌘K` / `Ctrl+K` | command palette — sections, project links, copy email |
| `1` `2` `3` `4` | jump to home / skills / projects / shell |
| `/` | focus the shell |
| `esc` | close the palette |

### The shell

`help`, `ls`, `cat <project>`, `open <project>`, `whoami`, `skills`,
`contact`, `neofetch`, `date`, `clear`. Tab completes commands and project
ids, `↑`/`↓` walks the history.
