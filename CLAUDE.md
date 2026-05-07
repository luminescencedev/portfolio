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

Single-page portfolio. Entry: `index.html` → `src/main.tsx` → `src/pages/App.tsx`.

**App.tsx** owns the only piece of global React state: `openProject` (the project currently shown in the modal). It renders the full layout — centered `max-w-140` column with `About`, `WorkTimeline`, `Works`, and `Links` — plus `CustomCursor` and `ProjectModal` as fixed overlays.

**Component responsibilities:**
- **`Works`** — project list with hover effects. On hover, tech-stack icons (from `react-icons/si`) burst out to the right as confetti particles using Framer Motion springs. On click, calls `onProjectOpen(project)` to lift state up to `App`.
- **`ProjectModal`** — bottom-sheet modal (spring slide-up). Receives `project: WorkProject | null`. Has a CSS scroll-snap horizontal image carousel. Locks `document.body` scroll while open. Closes on Escape or backdrop click.
- **`CustomCursor`** — fixed element tracking mouse position via `useMotionValue` + `useSpring`. Displays `x/y` coordinates in monospace with `mix-blend-mode: difference`. Easter egg: when cursor reaches ~(67, 67)px, coords swap to a "six... sevennn" wobble animation (meme ref).

**State:** `openProject` lives in `App.tsx` as `useState`. `cursorStore.ts` (Zustand) and `ProjectPreview/` are legacy — unused in the current layout.

## Key patterns

**Framer Motion** (`motion` package) is used throughout. Always use `AnimatePresence` for conditional renders that need exit animations. For values that animate on every frame (cursor position), use `useMotionValue` + `useSpring` — never `useState`.

**WorkProject type** is defined and exported from `Works/Works.tsx` and re-exported via `Works/index.ts`. It carries `icons: Array<{ Icon: IconType; color: string }>` for the confetti effect.

**No path aliases** — all imports use relative paths. The `@/` alias mentioned in old docs does not exist in the current tsconfig.

## Styling

Tailwind CSS 4 (JIT via Vite plugin). No `cn()` utility exists currently. Mobile-first; custom cursor and confetti are `hidden lg:block` / desktop-only. Custom Inter font loaded via `@font-face` in `src/index.css`.

## Anti-patterns to avoid

- Using `useState` for cursor position or any per-frame value — use `useMotionValue`
- Forgetting `AnimatePresence` wrapper when an element needs an exit animation
- Installing packages with `bun add` — this project uses pnpm exclusively
- Leaving `console.log` in committed code
