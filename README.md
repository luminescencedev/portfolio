# Portfolio — Arthur Garnier

Personal portfolio. A single quiet column of text, a dithered background, a custom cursor that
reads out its own coordinates.

**Live:** [arthur.carabine.studio](https://arthur.carabine.studio)

## Stack

| | |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (Vite plugin, no config file) |
| Animation | [Motion](https://motion.dev) (`motion/react`) |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Routing | React Router 7 (`BrowserRouter`) |
| Icons | `react-icons`, `lucide-react` |
| Package manager | pnpm (only — no npm/bun lockfiles) |
| Hosting | Vercel (SPA rewrite in `vercel.json`) |

## Getting started

```bash
pnpm install
pnpm run dev        # Vite dev server + HMR → http://localhost:5173
```

```bash
pnpm run build      # tsc -b, then production build to dist/
pnpm run preview    # serve dist/ locally
pnpm run lint       # ESLint over all TS/TSX
```

## Routes

| Path | Page | What it is |
| --- | --- | --- |
| `/` | `pages/App.tsx` | Home — about, work timeline, projects, Lab + Visual notes teasers, links, local time |
| `/work/:slug` | `pages/ProjectPage.tsx` | Project case study, from `data/works.ts` |
| `/visual-notes` | `pages/VisualNotesPage.tsx` | Photo selection |

All routes are wrapped in `AnimatePresence mode="wait"` for cross-fade transitions, and scroll is
reset on every navigation.

## Structure

```text
public/
├── background.png          # fixed background layer (preloaded from index.html)
└── projects/               # case-study screenshots

src/
├── main.tsx                # createRoot + BrowserRouter
├── Root.tsx                # initial load sequence + Lenis lifecycle
├── AnimatedRoutes.tsx      # routes, page transitions, scroll reset
├── index.css               # Tailwind entry, @font-face, background layer
├── components/             # one folder per component + index.ts re-export
├── pages/                  # one file per route
├── data/                   # all content lives here
├── hooks/useLenisScroll.ts
└── utils/preloadAssets.ts
```

## How things work

### Initial load

`Root.tsx` runs one sequence on first mount:

1. Preload `data/criticalAssets.ts` and wait on `document.fonts.ready`, reporting progress.
2. `GlobalLoader` — a white overlay at `z-[10000]` — swaps one black shape every 200 ms
   (square → cross → triangle → circle) on **hard cuts**: no crossfade, no scale, no rotation. The
   box is fixed at 40×40 so nothing moves between forms. Below it, a monospace percentage: real
   progress arrives in coarse steps, so it is fed through a `useSpring` and written straight to a
   DOM ref, climbing continuously instead of jumping. `prefers-reduced-motion` freezes the shape.
3. The exit is driven by the counter, not by a timer: the instant the displayed value reaches 100,
   the shape cycle stops on whatever form is showing. The loader then holds **300 ms** on that
   still shape — the beat that marks the end of the load — and fades out over 0.4 s. The Home page
   is already rendered underneath, so it simply appears rather than fading in again.
4. Guardrails: **1100 ms minimum** so the counter has time to read, **4 s failsafe** so a stalled
   asset can't trap the page. A missing image resolves rather than rejects, and the displayed value
   is held at 95 until both are satisfied — so the counter never sits on 100 waiting for a timer.
4. Scroll is locked (`documentElement.overflow`) and the content below is `inert`.

The Home page renders *underneath* the opaque loader, so the loader fading out is the only
transition — no blank frame, no second global fade.

### Background

A fixed `body::before` layer over a flat `#ffffff` on `html`, preloaded from `index.html`. The flat
colour matches the image's dominant tone, so the swap is imperceptible.

The fallback colour goes on `html` only. A `background-color` on `body` would hide the layer
entirely: negative-`z-index` descendants paint *before* their parent's own background.

`background-attachment: fixed` is deliberately **not** used — it caused repaints during smooth
scroll and flashes on mobile Safari.

### Smooth scroll

One global Lenis instance, created in `hooks/useLenisScroll.ts` with an intentionally light config
(`lerp: 0.12`, `wheelMultiplier: 0.9`, no touch syncing) so it stays close to native and never feels
like hijacking. It starts only once the loader is gone, is skipped entirely under
`prefers-reduced-motion: reduce`, and is destroyed on unmount. Read the live instance with
`getLenis()` instead of creating a second one.

### Custom cursor

Desktop only (`hidden lg:block`), `pointer-events-none`. Position goes through
`useMotionValue` + `useSpring`; coordinate text is written straight to DOM refs. All `mousemove`
events are collapsed into one `requestAnimationFrame` per frame, and the easter-egg state only calls
`setState` when it actually flips.

Move the cursor to roughly `(67, 67)` to find the easter egg.

## Editing content

All content is data — no JSX edits needed for routine updates.

**A project** → `src/data/works.ts`. Add a `WorkProject`: `slug`, `year`, `title`, `desc`, `url`,
`icons` (from `react-icons/si`, with brand colours), and a `caseStudy` array of `text` / `image`
blocks. Screenshots go in `public/projects/`.

**A visual note** → drop the file in `public/images/visual-notes/` and add an entry to
`src/data/visualNotes.ts`. `width`/`height` are required: they reserve the space and prevent layout
shift.

**Lab** is a placeholder for now — `components/LabPreview` renders one row (`Lab` + `View all →`,
arrow springs on hover) with no route and no data behind it. Experiments will be added one at a
time.

## Adding images

Anything visible on first paint must go into `src/data/criticalAssets.ts` so the loader waits for it.
Everything else uses `loading="lazy" decoding="async"` with its dimensions or `aspect-ratio`
reserved.

Format order: AVIF for photos and backgrounds, WebP as fallback, SVG for marks, PNG only when raster
transparency is genuinely needed.

## Conventions

- **pnpm only.** `pnpm add` / `pnpm remove`.
- **No path aliases** — relative imports throughout.
- One folder per component with an `index.ts` re-export.
- `AnimatePresence` around anything that needs an exit animation.
- `useMotionValue` / `useSpring` for per-frame values — never `useState`.
- No `console.log` in committed code.

See [`CLAUDE.md`](./CLAUDE.md) for the same ground rules written for coding agents.

## Deployment

Pushing to `main` deploys via Vercel. `vercel.json` rewrites every path to `/` so client-side
routing survives a hard refresh on a deep link.
