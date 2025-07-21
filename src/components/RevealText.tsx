import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface RevealTextProps {
  children: string;
  className?: string;
  splitBy?: "chars" | "words" | "lines";
  duration?: number;
  stagger?: number;
  delay?: number;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const RevealText = ({
  children,
  className = "",
  splitBy = "chars",
  duration = 1,
  stagger = 0.1,
  delay = 0.5,
  onComplete,
}: RevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitTextRef = useRef<SplitText | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Set the text content directly
    container.textContent = children;

    // Create SplitText instance with modern onSplit syntax
    splitTextRef.current = SplitText.create(container, {
      type:
        splitBy === "chars" ? "chars" : splitBy === "words" ? "words" : "lines",
      charsClass: "split-char",
      wordsClass: "split-word",
      linesClass: "split-line",
      autoSplit: true,
      aria: "auto",
      onSplit(self) {
        // Initial state: hide elements
        gsap.set(self[splitBy], {
          y: "100%",
        });

        // Create reveal animation
        return gsap.to(self[splitBy], {
          duration,
          y: 0,

          stagger,
          delay,
          ease: "power2.out",
          onComplete: () => {
            onComplete?.();
          },
        });
      },
    });

    // ScrollTrigger to reset when element leaves viewport
    ScrollTrigger.create({
      trigger: container,
      start: "bottom top",
      onLeave: () => {
        if (splitTextRef.current) {
          // Reset elements
          gsap.set(splitTextRef.current[splitBy], {
            y: "100%",
          });

          // Re-run the reveal animation
          gsap.delayedCall(0.1, () => {
            if (splitTextRef.current) {
              gsap.to(splitTextRef.current[splitBy], {
                duration,
                y: 0,

                stagger,
                ease: "power2.out",
              });
            }
          });
        }
      },
      onEnterBack: () => {
        if (splitTextRef.current) {
          // Reset when scrolling back
          gsap.set(splitTextRef.current[splitBy], {
            y: "100%",
          });

          gsap.delayedCall(0.1, () => {
            if (splitTextRef.current) {
              gsap.to(splitTextRef.current[splitBy], {
                duration,
                y: 0,

                stagger,
                ease: "power2.out",
              });
            }
          });
        }
      },
    });

    // Cleanup
    return () => {
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [children, splitBy, duration, stagger, delay, onComplete]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden flex flex-row", className)}
    />
  );
};

export default RevealText;
