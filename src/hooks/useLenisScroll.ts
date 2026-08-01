import { useEffect } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

/** Shared Lenis instance — null when smooth scroll is off (reduced motion). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Single global Lenis instance. Light configuration on purpose: the scroll must
 * stay close to native, without hijacking or noticeable inertia.
 */
export function useLenisScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      // Touch devices keep their native scroll — smoothing it feels wrong.
      syncTouch: false,
    });

    instance = lenis;

    let frameId = requestAnimationFrame(raf);

    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, [enabled]);
}
