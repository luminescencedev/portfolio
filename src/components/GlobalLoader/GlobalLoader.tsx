import { motion, useMotionValueEvent, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface GlobalLoaderProps {
  /** 0–100, share of critical assets settled. */
  progress: number;
  isComplete: boolean;
  /** Fires once, the frame the displayed counter reaches 100. */
  onSettled: () => void;
}

/**
 * Optically balanced rather than geometrically equal — a square reads heavier
 * than a circle at the same bounding box.
 */
const SHAPES: ReactNode[] = [
  <path key="square" d="M6 6H34V34H6Z" />,
  <path key="cross" d="M13 0H27V13H40V27H27V40H13V27H0V13H13Z" />,
  <path key="triangle" d="M20 3 37 36H3Z" />,
  <circle key="circle" cx="20" cy="20" r="17" />,
];

/** Steady cadence, hard cuts — no crossfade between shapes. */
const SHAPE_MS = 200;
/** The spring settles asymptotically; treat this as 100. */
const SETTLED_AT = 99.5;

export default function GlobalLoader({
  progress,
  isComplete,
  onSettled,
}: GlobalLoaderProps) {
  const [index, setIndex] = useState(0);
  const [hasSettled, setHasSettled] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const settledRef = useRef(false);

  // Real progress lands in coarse steps, so it is sprung into a continuous
  // value and written to a DOM ref — no re-render per frame.
  const smoothed = useSpring(0, { stiffness: 70, damping: 20, restDelta: 0.4 });

  useEffect(() => {
    smoothed.set(progress);
  }, [progress, smoothed]);

  const settle = () => {
    if (settledRef.current) return;
    settledRef.current = true;

    if (counterRef.current) counterRef.current.textContent = "100";

    // Freeze the shapes and start the fade on the same frame.
    setHasSettled(true);
    onSettled();
  };

  useMotionValueEvent(smoothed, "change", (value) => {
    if (counterRef.current) {
      counterRef.current.textContent = String(Math.round(value)).padStart(
        3,
        "0",
      );
    }

    if (value >= SETTLED_AT) settle();
  });

  // The spring can already be at its target when progress jumps to 100 (no
  // change event would follow).
  useEffect(() => {
    if (progress >= 100 && smoothed.get() >= SETTLED_AT) settle();
  });

  useEffect(() => {
    if (hasSettled || isComplete) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % SHAPES.length),
      SHAPE_MS,
    );

    return () => window.clearInterval(id);
  }, [hasSettled, isComplete]);

  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-5 bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isComplete ? 0.4 : 0, ease: "easeOut" }}
    >
      {/* Fixed box, shapes centred inside it: the cuts swap the form without
          moving anything on screen. */}
      <svg
        viewBox="0 0 40 40"
        // Same ink as the page's primary type — never pure black.
        className="h-10 w-10 fill-neutral-800"
        aria-hidden="true"
      >
        {SHAPES[index]}
      </svg>

      <p className="font-mono text-[10px] text-neutral-400">
        <span ref={counterRef} className="tabular-nums">
          000
        </span>
        %
      </p>
    </motion.div>
  );
}
