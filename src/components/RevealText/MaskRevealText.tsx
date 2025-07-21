import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "../../utils/cn";

interface MaskRevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: "auto" | "hover" | "visible";
  splitBy?: "lines" | "words" | "chars";
  direction?: "up" | "down" | "left" | "right";
  maskEffect?: "slide" | "clip" | "scale" | "wave";
  ease?: string;
}

const MaskRevealText = ({
  children,
  className,
  delay = 0,
  duration = 1.2,
  stagger = 0.05,
  trigger = "auto",
  splitBy = "chars",
  direction = "up",
  maskEffect = "slide",
  ease = "power4.out",
}: MaskRevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const textContent =
      typeof children === "string" ? children : container.textContent || "";

    container.innerHTML = "";

    const elements: HTMLElement[] = [];
    const wrappers: HTMLElement[] = [];

    if (splitBy === "chars") {
      const chars = textContent.split("");

      chars.forEach((char) => {
        const wrapper = document.createElement("span");
        wrapper.className = "char-wrapper";
        wrapper.style.cssText = `
          display: inline-block;
          overflow: hidden;
          position: relative;
        `;

        const inner = document.createElement("span");
        inner.className = "char-inner";
        inner.textContent = char === " " ? "\u00A0" : char;
        inner.style.cssText = `
          display: inline-block;
          position: relative;
        `;

        // Create mask element for each character
        const mask = document.createElement("span");
        mask.className = "char-mask";
        mask.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: currentColor;
          z-index: 1;
        `;

        wrapper.appendChild(inner);
        wrapper.appendChild(mask);
        container.appendChild(wrapper);
        elements.push(inner);
        wrappers.push(mask);
      });
    } else if (splitBy === "words") {
      const words = textContent.split(" ");

      words.forEach((word, index) => {
        const wrapper = document.createElement("span");
        wrapper.className = "word-wrapper";
        wrapper.style.cssText = `
          display: inline-block;
          overflow: hidden;
          position: relative;
          margin-right: ${index < words.length - 1 ? "0.3em" : "0"};
        `;

        const inner = document.createElement("span");
        inner.className = "word-inner";
        inner.textContent = word;
        inner.style.cssText = `
          display: inline-block;
          position: relative;
        `;

        const mask = document.createElement("span");
        mask.className = "word-mask";
        mask.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: currentColor;
          z-index: 1;
        `;

        wrapper.appendChild(inner);
        wrapper.appendChild(mask);
        container.appendChild(wrapper);
        elements.push(inner);
        wrappers.push(mask);
      });
    } else if (splitBy === "lines") {
      const lines = textContent.split("\n").filter((line) => line.trim());

      lines.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.className = "line-wrapper";
        wrapper.style.cssText = `
          display: block;
          overflow: hidden;
          position: relative;
        `;

        const inner = document.createElement("div");
        inner.className = "line-inner";
        inner.textContent = line;
        inner.style.cssText = `
          display: block;
          position: relative;
        `;

        const mask = document.createElement("div");
        mask.className = "line-mask";
        mask.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: currentColor;
          z-index: 1;
        `;

        wrapper.appendChild(inner);
        wrapper.appendChild(mask);
        container.appendChild(wrapper);
        elements.push(inner);
        wrappers.push(mask);
      });
    }

    // Set initial states based on mask effect
    const getTextInitialState = () => {
      switch (maskEffect) {
        case "slide":
          return direction === "up" || direction === "down"
            ? { y: direction === "up" ? "100%" : "-100%" }
            : { x: direction === "left" ? "100%" : "-100%" };
        case "scale":
          return { scale: 0, transformOrigin: "center" };
        case "wave":
          return { y: "50%", rotation: 3 };
        default:
          return { y: "100%" };
      }
    };

    const getMaskInitialState = () => {
      switch (direction) {
        case "up":
          return { scaleY: 1, transformOrigin: "bottom" };
        case "down":
          return { scaleY: 1, transformOrigin: "top" };
        case "left":
          return { scaleX: 1, transformOrigin: "right" };
        case "right":
          return { scaleX: 1, transformOrigin: "left" };
        default:
          return { scaleY: 1, transformOrigin: "bottom" };
      }
    };

    // Set initial states
    gsap.set(elements, getTextInitialState());
    gsap.set(wrappers, getMaskInitialState());

    const animate = () => {
      const tl = gsap.timeline();

      // Animate text into position
      tl.to(elements, {
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: duration * 0.6,
        stagger,
        ease,
        delay,
      });

      // Animate masks out
      tl.to(
        wrappers,
        {
          scaleY: direction === "up" || direction === "down" ? 0 : 1,
          scaleX: direction === "left" || direction === "right" ? 0 : 1,
          duration: duration * 0.8,
          stagger: stagger * 0.8,
          ease: "power3.inOut",
        },
        delay + 0.1
      );
    };

    const animateOut = () => {
      gsap.set(wrappers, getMaskInitialState());
      gsap.set(elements, getTextInitialState());
    };

    // Handle triggers
    if (trigger === "auto") {
      setTimeout(animate, 100);
    } else if (trigger === "hover") {
      container.addEventListener("mouseenter", animate);
      container.addEventListener("mouseleave", animateOut);

      return () => {
        container.removeEventListener("mouseenter", animate);
        container.removeEventListener("mouseleave", animateOut);
      };
    } else if (trigger === "visible") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, [
    children,
    delay,
    duration,
    stagger,
    trigger,
    splitBy,
    direction,
    maskEffect,
    ease,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
      style={{
        lineHeight: "1.2em",
      }}
    >
      {/* Content will be dynamically generated */}
    </div>
  );
};

export default MaskRevealText;
