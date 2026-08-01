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

**Routes** (`AnimatedRoutes.tsx`, wrapped in `AnimatePresence mode="wait"`): `/`, `/work/:slug`, `/visual-notes`. Scroll is reset per navigation via `getLenis()` (falls back to `window.scrollTo`).

**Page components:** `pages/App.tsx` (Home — centered `max-w-140` column: `About`, `WorkTimeline`, `Works`, `LabPreview`, `VisualNotesPreview`, `Links`, `Clock`), `ProjectPage`, `VisualNotesPage`.

**Component responsibilities:**
- **`Works`** — project list with hover effects. On hover, tech-stack icons (from `react-icons/si`) burst out to the right as confetti particles using Framer Motion springs. Click navigates to `/work/:slug`.
- **`GlobalLoader`** — white overlay at `z-[10000]`, centred. One black shape swaps every 200 ms (square → cross → triangle → circle) as a **hard cut**: no `AnimatePresence`, no crossfade, no scale/rotate — the swap is deliberately raw, and the fixed 40×40 box keeps anything from moving. Below it a monospace `000%` counter: real progress lands in coarse steps, so it goes through `useSpring` and is written to a DOM ref via `useMotionValueEvent` (no re-render per frame, no jumping). The cycle and the fade are tied to the counter, not to a timer: when the sprung value crosses 99.5 the loader freezes the current shape and calls `onSettled`. `Root` then holds 300 ms on that still form — the beat that marks the end of the load — before flipping `isComplete`. Only the overlay itself animates then: a 0.4 s fade, over a Home that is already rendered underneath, so the page does not fade in a second time.
- **`CustomCursor`** — fixed element tracking mouse position via `useMotionValue` + `useSpring`, batched into one `requestAnimationFrame` per frame; coordinates written straight to DOM refs. Easter egg: near (67, 67)px the coords swap to a "six... sevennn" wobble (`setIsEgg` only fires on transitions, guarded by `isEggRef`).
- **`LabPreview`** — a single placeholder row (`Lab` + `View all →`, arrow springs on hover). No route, no data, no content: experiments will be added one at a time later. Do not build a `/lab` section unless asked.
- **`VisualNotesPreview`** — Home teaser driven by `src/data/visualNotes.ts`; returns `null` while the array is empty.

**Data lives in `src/data/`:** `works.ts`, `visualNotes.ts`, `criticalAssets.ts`.

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
