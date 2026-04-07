# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server (Vite)
bun run build     # TypeScript check + Vite build
bun run lint      # ESLint
bun run preview   # Preview production build

bun install       # Install dependencies
bun add <pkg>     # Add dependency
bun remove <pkg>  # Remove dependency
```

No test suite is configured.

## Architecture

Single-page creative portfolio with animation-driven navigation (no React Router). The entry point is `src/main.tsx` → `src/App.tsx`, which contains all three sections (Hero, About, Contact) and owns the animation/scroll initialization.

**Key interaction model:**
- Initial state shows a black grid with logo
- Clicking the logo triggers an entrance animation (white bar transition)
- A custom `portfolioOpen` DOM event is dispatched to coordinate child components
- Scroll is handled by **Lenis** (smooth scrolling), synchronized with **GSAP ScrollTrigger** via a RAF loop

**Scroll/animation setup pattern** (always in `App.tsx`):
```typescript
const lenis = new Lenis({ /* config */ });
function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
ScrollTrigger.defaults({ scroller: scrollContainerRef.current });
// cleanup: lenis.destroy() + ScrollTrigger.killAll()
```

**`src/components/`** — Reusable components, each in `PascalCase/` folder with barrel `index.ts`
**`src/utils/`** — Generic hooks and utilities (`cn.ts`, `useWindowSize.ts`)
**`src/lab/`** — Experimental/WIP components, not used in production
**`public/Gradient/`** — Gradient images (Gradient1–17.jpg) for transitions

## Code Conventions

**Naming:**
- Components/folders: `PascalCase`
- Utils/hooks: `camelCase`, hooks prefixed with `use`
- Screens: `PascalCase` + `Screen` suffix
- Constants: `SCREAMING_SNAKE_CASE`
- Import alias: `@/` maps to `src/`

**React/GSAP rules:**
- Use `useRef` for values that don't need re-render; never read refs during render
- Always `gsap.registerPlugin(ScrollTrigger)` before use
- Use `gsap.quickTo()` for scroll-driven animations (not new tweens in scroll handlers)
- Never call `setState` in scroll handlers (causes lag)
- Always kill ScrollTriggers and destroy Lenis in `useEffect` cleanup
- Remove `ScrollTrigger.markers: true` before committing

**Performance:**
- GPU-accelerate animated elements: `will-change: transform`, `transform: translateZ(0)`, `backface-visibility: hidden`
- Preload images via `new Image()` in `useEffect`
- Smooth image transitions: fade out → swap src → fade in (0.15s each)
- Target <16ms frame time (60fps); avoid `setState` in RAF/scroll callbacks

**Styling:**
- Tailwind CSS 4 utility classes (mobile-first)
- Respect `prefers-reduced-motion` for all animations

## `.agent.md`

The project has a `.agent.md` at the root which mirrors much of this content and tracks an architecture changelog. Update it (with date `YYYY-MM-DD HH:MM` and bumped version) after any significant architectural change.
