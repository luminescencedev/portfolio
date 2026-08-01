import { motion, useMotionValueEvent, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface GlobalLoaderProps {
  /** 0–100, share of critical assets settled. */
  progress: number;
  isComplete: boolean;
  /** Fires once, the frame the smoothed progress reaches 100. */
  onSettled: () => void;
}

interface Shape {
  key: string;
  viewBox: string;
  d: string;
}

/**
 * Each mark keeps its own viewBox and is rendered into the same square box with
 * the default `xMidYMid meet`, so the cuts never resize or shift anything.
 */
const SHAPES: Shape[] = [
  {
    key: "zigzag",
    viewBox: "0 0 96.54 108.89",
    d: "M48.27,30.91v15.57c0,4.81,2.91,9.14,7.37,10.96l38.43,15.63c1.49.61,2.46,2.05,2.46,3.66v19.68c0,2.8-2.84,4.72-5.44,3.66l-38.55-15.68c-2.05-.83-4.28.67-4.28,2.88v17.67c0,2.8-2.84,4.72-5.44,3.66L2.46,92.18c-1.49-.61-2.46-2.05-2.46-3.66v-19.68c0-2.8,2.84-4.72,5.44-3.66l38.54,15.68c2.05.83,4.28-.67,4.28-2.88v-15.57c0-4.81-2.91-9.14-7.37-10.96L2.47,35.82C.98,35.21,0,33.77,0,32.16V12.49C0,9.68,2.84,7.77,5.44,8.83l38.54,15.68c2.05.83,4.28-.67,4.28-2.88V3.95c0-2.8,2.84-4.72,5.44-3.66l40.37,16.42c1.49.61,2.46,2.05,2.46,3.66v19.68c0,2.8-2.84,4.72-5.44,3.66l-38.55-15.68c-2.05-.83-4.28.67-4.28,2.88Z",
  },
  {
    key: "blob",
    viewBox: "0 0 107.01 108.89",
    d: "M46.95.45c74.64-8.48,82.19,105.67,8.69,108.4C-13.15,111.4-20.57,8.13,46.95.45ZM61.52,10.96c-3.77.59-9.75,3.49-12.79,5.86-7.35,5.73-26.08,24.66-32.02,32.04-22.9,28.41,13.85,65.99,43.41,41.77,6.75-5.53,31.36-30.07,34.46-36.9,10.37-22.85-8.36-46.62-33.06-42.77Z",
  },
  {
    key: "star",
    viewBox: "0 0 108.19 84.17",
    d: "M96.06,76.41l-17.82-17.82c-4.09-4.09-1.19-11.08,4.59-11.08h25.36v-10.82h-25.36c-5.78,0-8.68-6.99-4.59-11.08l17.93-17.93L88.52.02l-22.87,22.87c-6.38,6.38-16.72,6.38-23.1,0L19.65,0l-7.65,7.65,17.96,17.96c4.09,4.09,1.19,11.08-4.59,11.08H0v10.82h25.36c5.78,0,8.68,6.99,4.59,11.08l-17.94,17.94,7.65,7.65,22.87-22.87c6.38-6.38,16.72-6.38,23.1,0l22.76,22.76,7.65-7.65Z",
  },
  {
    key: "grid",
    viewBox: "0 0 108.89 108.89",
    d: "M23.55,95.09v13.8s7.34,0,7.34,0v-13.8c0-5.39,4.37-9.75,9.75-9.75h27.6c5.38,0,9.75,4.37,9.75,9.75v13.8h7.34v-13.8c0-5.39,4.37-9.75,9.75-9.75h13.8v-7.34h-13.8c-5.39,0-9.75-4.37-9.75-9.75v-27.6c0-5.39,4.37-9.75,9.75-9.75h.03s13.77,0,13.77,0v-7.34h-13.8c-5.39,0-9.75-4.37-9.75-9.75V0h-7.34v13.8c0,5.39-4.37,9.75-9.75,9.75h-27.6c-5.39,0-9.75-4.37-9.75-9.75V0h-7.34v13.8c0,5.39-4.37,9.75-9.75,9.75h-.03s-13.77,0-13.77,0v7.34h13.8c5.39,0,9.75,4.37,9.75,9.75v13.8s0,13.8,0,13.8c0,5.39-4.37,9.75-9.75,9.75H0v7.34h13.8c5.39,0,9.75,4.37,9.75,9.75ZM78,54.45v-13.8c0-5.39-4.37-9.75-9.75-9.75h-.03s-13.77,0-13.77,0h-13.8c-5.39,0-9.75,4.37-9.75,9.75v27.6c0,5.39,4.37,9.75,9.75,9.75h27.6c5.38,0,9.75-4.37,9.75-9.75v-13.8Z",
  },
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
  const settledRef = useRef(false);

  // Nothing is displayed from this: the spring exists so the load reads as
  // continuous, and its arrival at 100 is what ends the loader.
  const smoothed = useSpring(0, { stiffness: 70, damping: 20, restDelta: 0.4 });

  useEffect(() => {
    smoothed.set(progress);
  }, [progress, smoothed]);

  const settle = () => {
    if (settledRef.current) return;
    settledRef.current = true;

    // Freeze the shapes; the parent holds a beat before starting the fade.
    setHasSettled(true);
    onSettled();
  };

  useMotionValueEvent(smoothed, "change", (value) => {
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

  const shape = SHAPES[index];

  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isComplete ? 0.4 : 0, ease: "easeOut" }}
    >
      <svg
        viewBox={shape.viewBox}
        // Site ink, not pure black.
        className="h-28 w-28 fill-neutral-800"
        aria-hidden="true"
        // evenodd keeps the holes open in the nested marks whatever the
        // subpath winding direction is.
        fillRule="evenodd"
      >
        <path d={shape.d} />
      </svg>
    </motion.div>
  );
}
