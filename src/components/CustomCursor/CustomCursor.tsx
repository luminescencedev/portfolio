import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness: 600, damping: 45 });
  const y = useSpring(mouseY, { stiffness: 600, damping: 45 });

  const xTextRef = useRef<HTMLDivElement>(null);
  const yTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + 18);
      mouseY.set(e.clientY - 24);
      if (xTextRef.current) xTextRef.current.textContent = `x: ${e.clientX}px`;
      if (yTextRef.current) yTextRef.current.textContent = `y: ${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-9999 will-change-transform hidden lg:block"
      style={{ x, y }}
    >
      <div className="font-mono text-[10px] leading-tight text-black">
        <div ref={xTextRef}>x: 0px</div>
        <div ref={yTextRef}>y: 0px</div>
      </div>
    </motion.div>
  );
}
