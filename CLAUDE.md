# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server (Vite HMR)
bun run build     # Type-check (tsc -b) then Vite production build
bun run lint      # ESLint on all TS/TSX files
bun run preview   # Preview production build locally
bun add <pkg>     # Add dependency
bun remove <pkg>  # Remove dependency
```

## Architecture

Single-page portfolio (no router). Entry: `index.html` → `src/main.tsx` → `src/App.tsx`.

**Flow**: A grid-based animated portal (logo click) triggers a GSAP timeline that reveals three sections — Hero, About, Contact — dispatching a `"portfolioOpen"` custom event that activates `Reveal` animations.

**Key integrations**:
- **Lenis** (`lenis 1.3.17`) intercepts native scroll for physics-based smoothing; initialized in `App.tsx` with a RAF loop
- **GSAP + ScrollTrigger** driven by Lenis: `lenis.on('scroll', ScrollTrigger.update)` keeps them in sync
- **`@paper-design/shaders-react`** provides the `ImageDithering` background shader
- **Three.js** is installed but currently unused in production

**Component structure**: `src/components/` for reusable components (each in its own `PascalCase/` folder with an `index.ts` re-export), `src/utils/` for hooks and helpers, `src/lab/` for experiments.

## GSAP / Lenis patterns

Always register plugins before use:
```typescript
gsap.registerPlugin(ScrollTrigger, SplitText);
```

Lenis setup (canonical pattern from `App.tsx`):
```typescript
const lenis = new Lenis({ ... });
function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
ScrollTrigger.defaults({ scroller: scrollContainerRef.current });
// cleanup:
return () => { lenis.destroy(); ScrollTrigger.killAll(); };
```

For scroll-driven repeated animations, use `gsap.quickTo()` — never create new tweens inside a scroll handler. Never call `setState` in scroll handlers (causes lag).

Always clean up animations and event listeners in `useEffect` return functions.

## Code conventions

- **Components**: PascalCase files/folders (`Reveal/Reveal.tsx`)
- **Utils/hooks**: camelCase (`useWindowSize.ts`, `cn.ts`)
- **Custom hooks**: `use` prefix, live in `src/utils/` (generic) or co-located (specific)
- **Types/Interfaces**: PascalCase; use `interface` for component props, `type` for unions
- Prefer `useRef` over `useState` for values that don't need to trigger re-renders
- Use `@/` path alias for all `src/` imports (configured in `tsconfig.app.json` and `vite.config.ts`)

## Styling

Tailwind CSS 4 (JIT via Vite plugin). Use `cn()` from `src/utils/cn.ts` for conditional class merging (wraps `clsx` + `tailwind-merge`). Mobile-first. GPU-accelerated animations: animate only `transform` and `opacity`, add `will-change: transform` on animated elements.

## Images

- `/public/Gradient/` — gradient images (Gradient1–17.jpg)
- Format: JPG for photos/gradients, PNG for logos, SVG for vectors
- Preload via `new Image()` in `useEffect`; always transition opacity when swapping (`opacity 0 → swap src → opacity 1`)
- Keep images ≤500 KB

## Anti-patterns to avoid

- Creating new GSAP tweens inside scroll handlers (use `quickTo`)
- Forgetting to kill ScrollTriggers and destroy Lenis on cleanup
- Reading refs during render (use state + `useEffect` instead)
- Leaving `ScrollTrigger.create({ markers: true })` — debug only
- Leaving `console.log` in committed code
