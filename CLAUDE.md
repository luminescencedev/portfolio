# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev       # Start dev server (Vite HMR)
pnpm run build     # Type-check (tsc -b) then Vite production build
pnpm run lint      # ESLint on all TS/TSX files
pnpm run preview   # Preview production build locally
pnpm add <pkg>     # Add dependency
pnpm remove <pkg>  # Remove dependency
```

## Architecture

Entry: `index.html` → `src/main.tsx` → `src/Root.tsx` → `src/AnimatedRoutes.tsx`.

**Root.tsx** owns the initial-load sequence: it preloads `criticalAssets` (+ `document.fonts.ready`) behind a 1100 ms minimum and a 4 s failsafe (the displayed value is capped at 95 until both are done, so the counter never parks on 100 and waits), drives `GlobalLoader`, locks `documentElement` overflow while loading, and only starts Lenis once the loader is gone (`useLenisScroll(!isLoading)`). The Home page renders *under* the opaque loader so the loader fade is the only transition.

**Routes** (`AnimatedRoutes.tsx`, wrapped in `AnimatePresence mode="wait"`): `/`, `/work/:slug`, `/lab`, `/visual-notes`. Scroll is reset per navigation via `getLenis()` (falls back to `window.scrollTo`).

**Page components:** `pages/App.tsx` (Home — centered `max-w-140` column: `About`, `WorkTimeline`, `Works`, `LabPreview`, `VisualNotesPreview`, `Links`, `Clock`), `ProjectPage`, `VisualNotesPage`.

**Component responsibilities:**
- **`Works`** — project list with hover effects. On hover, tech-stack icons (from `react-icons/si`) burst out to the right as confetti particles using Framer Motion springs. Click navigates to `/work/:slug`.
- **`GlobalLoader`** — white overlay at `z-[10000]`, one centred black mark, nothing else (no counter, no text). Four custom marks (zigzag, blob, star, grid) each keep their own `viewBox` and swap every 200 ms as a **hard cut**: no `AnimatePresence`, no crossfade, no scale/rotate — the swap is deliberately raw, and the shared 112×112 box with default `xMidYMid meet` keeps anything from moving. `fillRule="evenodd"` is set so nested subpaths keep their holes regardless of winding direction. Progress still runs through a `useSpring` even though it is never displayed: its arrival at 99.5 is what freezes the shape and calls `onSettled`. `Root` then holds 250 ms on that still form — the beat that marks the end of the load — before flipping `isComplete`. Only the overlay itself animates then: a 0.4 s fade, over a Home that is already rendered underneath, so the page does not fade in a second time.
- **`CustomCursor`** — fixed element tracking mouse position via `useMotionValue` + `useSpring`, batched into one `requestAnimationFrame` per frame; coordinates written straight to DOM refs. Easter egg: near (67, 67)px the coords swap to a "six... sevennn" wobble (`setIsEgg` only fires on transitions, guarded by `isEggRef`).
- **`LabPreview`** — one Home row (`Lab` + `View all →`, arrow springs on hover) linking to `/lab`.
- **`LabPage`** (`/lab`) — the Lab hub. Type (back button, `Lab`) sits in the same centred `max-w-140` column as the Home; the carousel breaks out of it and runs full width. Cards come from `src/data/labExperiments.ts`; while that array is empty it falls back to `PLACEHOLDER_CARDS` so the reel and the drawer stay judgeable. There is no `/lab/:slug` route — an experiment opens in the drawer, not on its own page.
- **`LabCarousel`** — the hub's reel: small sharp-edged cards at varied width/`aspect-ratio`, each offset vertically by `shift` so the row never reads as a grid. Full-bleed (`-mx-4 sm:-mx-8`), fixed-height band so the offsets can't push the page around, `overflow-x-auto` + `snap-proximity`, bar hidden via `.no-scrollbar` (`index.css`). Captions are hidden at rest and fade in on hover/focus. Clicking a card opens the drawer.
- **`LabDrawer`** — panel on the right at `lg+` (`lg:w-140`), full screen below that, so on a phone it reads as its own page. Spring slide from the right, backdrop click or Escape to close, `getLenis()?.stop()` plus `documentElement.overflow` while open. The playable demo sits in the **double bezel** ported from `dev/mirae`: outer shell carries `p-2`, a hairline border, `ring-1 ring-inset` and `shadow-bezel` (defined in `@theme`), inner core at a tighter radius (`28px` outside / `20px` inside) on white. Demos are resolved from `src/lab/registry.ts` by the experiment's `component` key and rendered in `Suspense`; without one the bezel shows `nothing to test yet`. It calls `usePlainBackground()`, which drops the dithered layer to flat white; the fade is CSS on `body::before` (0.28 s) and matches the page transition so both move together.
- **`VisualNotesPreview`** — Home teaser driven by `src/data/visualNotes.ts`; returns `null` while the array is empty.

**Data lives in `src/data/`:** `works.ts`, `labExperiments.ts`, `visualNotes.ts`, `criticalAssets.ts`.

**State:** no global store. `cursorStore.ts` (Zustand) and `ProjectPreview/` are legacy — unused.

## Key patterns

**Framer Motion** (`motion` package) is used throughout. Always use `AnimatePresence` for conditional renders that need exit animations. For values that animate on every frame (cursor position), use `useMotionValue` + `useSpring` — never `useState`.

**Smooth scroll** is Lenis, one global instance created in `src/hooks/useLenisScroll.ts` (light config: `lerp: 0.12`, `wheelMultiplier: 0.9`, no touch syncing). It is skipped entirely under `prefers-reduced-motion: reduce`. Never create a second instance; read the current one with `getLenis()`.

**Images:** anything visible on first paint goes into `src/data/criticalAssets.ts`; everything else uses `loading="lazy" decoding="async"` with reserved dimensions (`width`/`height` or `aspect-ratio`).

**WorkProject type** is defined and exported from `Works/Works.tsx` and re-exported via `Works/index.ts`. It carries `icons: Array<{ Icon: IconType; color: string }>` for the confetti effect.

**No path aliases** — all imports use relative paths. The `@/` alias mentioned in old docs does not exist in the current tsconfig.

## Styling

Tailwind CSS 4 (JIT via Vite plugin). No `cn()` utility exists currently. Mobile-first; custom cursor and confetti are `hidden lg:block` / desktop-only. Custom Inter font loaded via `@font-face` in `src/index.css`.

The page background is a fixed `body::before` layer (`/background.png`) over a flat `#ffffff` fallback on `html`, preloaded from `index.html`. Two things not to break: don't reintroduce `background-attachment: fixed` (repaints during smooth scroll, flashes on mobile Safari), and never put a `background-color` on `body` — negative-`z-index` descendants paint before their parent's own background, so a body background hides the layer completely.

## Anti-patterns to avoid

- Using `useState` for cursor position or any per-frame value — use `useMotionValue`
- Forgetting `AnimatePresence` wrapper when an element needs an exit animation
- Installing packages with `bun add` — this project uses pnpm exclusively
- Leaving `console.log` in committed code
- Calling `setState` on every `mousemove`/`scroll` event — batch into a `requestAnimationFrame` and only set state when the value actually changes
- Creating a second Lenis instance, or using Lenis as an animation system (Motion handles component animation)
- Adding a heavy image to the Home without either adding it to `criticalAssets.ts` or lazy-loading it
