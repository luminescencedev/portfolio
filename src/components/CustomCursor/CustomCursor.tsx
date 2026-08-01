import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASTER_X = 67;
const EASTER_Y = 67;
const RADIUS = 15;

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness: 600, damping: 45 });
  const y = useSpring(mouseY, { stiffness: 600, damping: 45 });

  const xTextRef = useRef<HTMLDivElement>(null);
  const yTextRef = useRef<HTMLDivElement>(null);
  const [isEgg, setIsEgg] = useState(false);

  const isEggRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const latestMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // One update per frame, even if several mousemove events land in the same
    // frame. setIsEgg only fires when the value actually flips.
    const updateCursor = () => {
      const { x: clientX, y: clientY } = latestMouseRef.current;

      mouseX.set(clientX + 18);
      mouseY.set(clientY - 24);

      if (xTextRef.current) xTextRef.current.textContent = `x: ${clientX}px`;
      if (yTextRef.current) yTextRef.current.textContent = `y: ${clientY}px`;

      const dx = clientX - EASTER_X;
      const dy = clientY - EASTER_Y;
      const insideEgg = dx * dx + dy * dy <= RADIUS * RADIUS;

      if (insideEgg !== isEggRef.current) {
        isEggRef.current = insideEgg;
        setIsEgg(insideEgg);
      }

      frameRef.current = null;
    };

    const onMove = (e: MouseEvent) => {
      latestMouseRef.current = { x: e.clientX, y: e.clientY };

      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(updateCursor);
      }
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-9999 will-change-transform hidden lg:block"
      style={{ x, y }}
    >
      <AnimatePresence mode="wait">
        {isEgg ? (
          <motion.div
            key="egg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[10px] leading-snug text-black"
          >
            <motion.div
              animate={{ x: [-1, 1, -2, 2, -1, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              six...
            </motion.div>
            <motion.div
              animate={{ x: [1, -1, 2, -2, 1, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 0.3,
              }}
            >
              sevennn
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="coords"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="font-mono text-[10px] leading-tight text-black"
          >
            <div ref={xTextRef}>x: 0px</div>
            <div ref={yTextRef}>y: 0px</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
