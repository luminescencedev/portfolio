"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  stagger = 0.08,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let split: SplitText | null = null;
    let observer: IntersectionObserver | null = null;

    const init = () => {
      if (!ref.current || split) return;

      // Split maintenant que l'élément est visible et a un layout correct
      split = new SplitText(ref.current, {
        type: "lines",
        maskType: "lines",
      });

      split.lines.forEach((line) => {
        const mask = (line as HTMLElement).parentElement;
        if (mask) mask.style.overflow = "hidden";
      });

      const lines = split.lines as HTMLElement[];
      gsap.set(lines, { yPercent: 100 });

      const play = () => {
        gsap.set(lines, { yPercent: 100 });
        requestAnimationFrame(() => {
          gsap.to(lines, {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger,
            delay,
          });
        });
      };

      const reset = () => gsap.set(lines, { yPercent: 100 });

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) play();
          else reset();
        },
        { threshold: 0.1 },
      );

      observer.observe(ref.current);
    };

    // Écouter le signal que le portfolio est ouvert
    window.addEventListener("portfolioOpen", init);

    return () => {
      window.removeEventListener("portfolioOpen", init);
      observer?.disconnect();
      split?.revert();
    };
  }, [delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
