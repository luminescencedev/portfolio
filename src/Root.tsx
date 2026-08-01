import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import AnimatedRoutes from "./AnimatedRoutes";
import CustomCursor from "./components/CustomCursor";
import GlobalLoader from "./components/GlobalLoader";
import { criticalAssets } from "./data/criticalAssets";
import { useLenisScroll } from "./hooks/useLenisScroll";
import { preloadAssets, timeout } from "./utils/preloadAssets";

/** Long enough for the shape sequence to read, short enough not to feel like a wait. */
const MIN_LOAD_MS = 1100;
/** Failsafe — a stalled asset must never trap the page behind the loader. */
const MAX_LOAD_MS = 4000;
/** Beat on the frozen shape at 100%, to mark the end of the load. */
const HOLD_MS = 250;
/** Matches the loader's exit fade. */
const EXIT_MS = 400;
/**
 * Ceiling on the displayed value until everything is actually ready. Without
 * it, a fast connection would park the counter on 100 and wait there.
 */
const HOLD_AT = 95;

export default function Root() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const activeRef = useRef(true);

  // Lenis only starts once the loader is gone, so it can never scroll the page
  // underneath it.
  useLenisScroll(!isLoading);

  useEffect(() => {
    activeRef.current = true;

    async function load() {
      await Promise.all([
        Promise.race([
          preloadAssets({
            assets: criticalAssets,
            onProgress: (value) => {
              if (activeRef.current) setProgress(Math.min(value, HOLD_AT));
            },
          }),
          timeout(MAX_LOAD_MS),
        ]),
        timeout(MIN_LOAD_MS),
      ]);

      // Releases the counter to 100 — including on the failsafe path, where
      // some assets never resolved.
      if (activeRef.current) setProgress(100);
    }

    load();

    return () => {
      activeRef.current = false;
    };
  }, []);

  // Called by the loader the moment its counter shows 100. The shapes freeze
  // there; the fade only starts after a short beat on the still form, so the
  // end of the load registers instead of being swallowed by the transition.
  const handleSettled = useCallback(async () => {
    if (!activeRef.current) return;

    await timeout(HOLD_MS);

    if (!activeRef.current) return;

    setIsComplete(true);
    await timeout(EXIT_MS);

    if (activeRef.current) setIsLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = isLoading ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <GlobalLoader
            progress={progress}
            isComplete={isComplete}
            onSettled={handleSettled}
          />
        )}
      </AnimatePresence>

      {/* One instance for the whole app. Mounted per page it would unmount on
          every route change and reappear at 0,0 until the next mousemove. */}
      <CustomCursor />

      <div inert={isLoading ? true : undefined}>
        <AnimatedRoutes />
      </div>
    </>
  );
}
