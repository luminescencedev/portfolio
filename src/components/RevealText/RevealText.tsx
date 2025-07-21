import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "../../utils/cn";

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  animateOnScroll?: boolean;
  trigger?: "auto" | "hover" | "visible";
  splitBy?: "lines" | "words" | "chars";
  direction?: "up" | "down" | "left" | "right";
  ease?: string;
}

const RevealText = ({
  children,
  className,
  delay = 0,
  duration = 1,
  stagger = 0.1,
  animateOnScroll = true,
  trigger = "auto",
  splitBy = "lines",
  direction = "up",
  ease = "power4.out",
}: RevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    elementsRef.current = [];

    // Get text content from children
    const textContent =
      typeof children === "string" ? children : container.textContent || "";

    // Clear container
    container.innerHTML = "";

    const elements: HTMLElement[] = [];

    if (splitBy === "lines") {
      // Split by lines
      const lines = textContent.split("\n").filter((line) => line.trim());

      lines.forEach((line) => {
        const lineElement = document.createElement("div");
        lineElement.className = "line-wrapper";
        lineElement.style.overflow = "hidden";
        lineElement.style.display = "block";

        const lineInner = document.createElement("div");
        lineInner.className = "line-inner";
        lineInner.textContent = line;
        lineInner.style.display = "block";

        lineElement.appendChild(lineInner);
        container.appendChild(lineElement);
        elements.push(lineInner);
      });
    } else if (splitBy === "words") {
      // Split by words
      const words = textContent.split(" ");

      words.forEach((word, index) => {
        const wordElement = document.createElement("span");
        wordElement.className = "word-wrapper";
        wordElement.style.display = "inline-block";
        wordElement.style.overflow = "hidden";
        wordElement.style.marginRight =
          index < words.length - 1 ? "0.3em" : "0";

        const wordInner = document.createElement("span");
        wordInner.className = "word-inner";
        wordInner.textContent = word;
        wordInner.style.display = "inline-block";

        wordElement.appendChild(wordInner);
        container.appendChild(wordElement);
        elements.push(wordInner);
      });
    } else if (splitBy === "chars") {
      // Split by characters
      const chars = textContent.split("");

      chars.forEach((char) => {
        const charElement = document.createElement("span");
        charElement.className = "char-wrapper";
        charElement.style.display = "inline-block";
        charElement.style.overflow = "hidden";

        const charInner = document.createElement("span");
        charInner.className = "char-inner";
        charInner.textContent = char === " " ? "\u00A0" : char;
        charInner.style.display = "inline-block";

        charElement.appendChild(charInner);
        container.appendChild(charElement);
        elements.push(charInner);
      });
    }

    elementsRef.current = elements;

    // Set initial state
    const getInitialState = () => {
      switch (direction) {
        case "up":
          return { y: "100%", opacity: 0 };
        case "down":
          return { y: "-100%", opacity: 0 };
        case "left":
          return { x: "100%", opacity: 0 };
        case "right":
          return { x: "-100%", opacity: 0 };
        default:
          return { y: "100%", opacity: 0 };
      }
    };

    const getAnimationProps = () => {
      switch (direction) {
        case "up":
        case "down":
          return { y: 0, opacity: 1 };
        case "left":
        case "right":
          return { x: 0, opacity: 1 };
        default:
          return { y: 0, opacity: 1 };
      }
    };

    // Set initial state
    gsap.set(elements, getInitialState());

    const animate = () => {
      gsap.to(elements, {
        ...getAnimationProps(),
        duration,
        stagger,
        ease,
        delay,
      });
    };

    const animateOut = () => {
      gsap.to(elements, {
        ...getInitialState(),
        duration: duration * 0.6,
        stagger: stagger * 0.5,
        ease: "power3.in",
      });
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
    } else if (trigger === "visible" || animateOnScroll) {
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
    animateOnScroll,
    trigger,
    splitBy,
    direction,
    ease,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        lineHeight: "1.2em",
      }}
    >
      {/* Content will be dynamically generated */}
    </div>
  );
};

export default RevealText;
