"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  num: string;
  title: string;
  type: string;
  year: string;
  desc: string;
  image: string;
}

const projects: Project[] = [
  {
    num: "01",
    title: "Arcane Studio",
    type: "Branding & Web",
    year: "2024",
    desc: "Visual identity and digital experience for a creative studio based in Paris.",
    image: "/Gradient/Gradient1.jpg",
  },
  {
    num: "02",
    title: "Forma",
    type: "Product Design",
    year: "2024",
    desc: "End-to-end product design for a SaaS platform focused on design systems.",
    image: "/Gradient/Gradient5.jpg",
  },
  {
    num: "03",
    title: "Noir Editorial",
    type: "Art Direction",
    year: "2023",
    desc: "Art direction and web presence for an independent fashion publication.",
    image: "/Gradient/Gradient9.jpg",
  },
  {
    num: "04",
    title: "Onyx",
    type: "Motion & Web",
    year: "2023",
    desc: "Motion design and interactive website for a luxury watch brand.",
    image: "/Gradient/Gradient13.jpg",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

// Wrap each word/sentence in a mask div so yPercent clips it
function TextLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        className={`reveal-line ${className ?? ""}`}
        style={{ transform: "translateY(105%)" }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProjectProps {
  scroller: HTMLElement | null;
  onScrollTo: (value: number) => void;
}

export default function Projet({ scroller, onScrollTo }: ProjectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);

  const count = projects.length;
  const thumbW = 100 / count;

  // ── animate in/out ──────────────────────────────────────────────────────

  const revealPanel = useCallback((el: HTMLDivElement) => {
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(
      el.querySelectorAll<HTMLElement>(".reveal-line"),
      { yPercent: 105 },
      { yPercent: 0, duration: 0.85, ease: "power4.out", stagger: 0.07 },
    );
  }, []);

  const hidePanel = useCallback((el: HTMLDivElement, immediate = false) => {
    if (immediate) {
      gsap.set(el, { autoAlpha: 0 });
      gsap.set(el.querySelectorAll<HTMLElement>(".reveal-line"), {
        yPercent: 105,
      });
    } else {
      gsap.to(el.querySelectorAll<HTMLElement>(".reveal-line"), {
        yPercent: 105,
        duration: 0.45,
        ease: "power3.in",
        stagger: 0.03,
        onComplete: () => {
          gsap.set(el, { autoAlpha: 0 });
        },
      });
    }
  }, []);

  // ── transition ──────────────────────────────────────────────────────────

  const goTo = useCallback(
    (next: number, instant = false) => {
      const prev = activeRef.current;
      if (next === prev && !instant) return;
      if (animatingRef.current && !instant) return;
      animatingRef.current = true;
      activeRef.current = next;
      setActiveIndex(next);

      // Minimap
      if (indicatorRef.current)
        gsap.to(indicatorRef.current, {
          left: `${(next / (count - 1)) * (100 - thumbW)}%`,
          duration: instant ? 0 : 0.55,
          ease: "power3.inOut",
        });
      if (progressRef.current)
        gsap.to(progressRef.current, {
          scaleX: next / (count - 1),
          duration: instant ? 0 : 0.55,
          ease: "power3.inOut",
        });

      const prevImg = imageRefs.current[prev];
      const nextImg = imageRefs.current[next];
      const prevLeft = leftRefs.current[prev];
      const nextLeft = leftRefs.current[next];
      const prevRight = rightRefs.current[prev];
      const nextRight = rightRefs.current[next];

      if (instant) {
        [prevImg, prevLeft, prevRight].forEach(
          (el) => el && gsap.set(el, { autoAlpha: 0, clipPath: undefined }),
        );
        [nextImg].forEach(
          (el) =>
            el && gsap.set(el, { autoAlpha: 1, clipPath: "inset(0 0 0 0)" }),
        );
        [nextLeft, nextRight].forEach((el) => {
          if (!el) return;
          gsap.set(el, { autoAlpha: 1 });
          gsap.set(el.querySelectorAll(".reveal-line"), { yPercent: 0 });
        });
        animatingRef.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      // Hide prev
      if (prev !== next) {
        if (prevLeft) hidePanel(prevLeft);
        if (prevRight) hidePanel(prevRight);
        if (prevImg)
          tl.to(
            prevImg,
            { autoAlpha: 0, duration: 0.35, ease: "power2.in" },
            0,
          );
      }

      // Reveal next image (clip wipe from bottom)
      if (nextImg)
        tl.fromTo(
          nextImg,
          { autoAlpha: 1, clipPath: "inset(100% 0 0% 0)" },
          {
            clipPath: "inset(0% 0 0% 0)",
            duration: 0.65,
            ease: "power3.inOut",
          },
          0.1,
        );

      // Reveal next text
      tl.call(
        () => {
          if (nextLeft) revealPanel(nextLeft);
          if (nextRight) revealPanel(nextRight);
        },
        [],
        0.25,
      );
    },
    [count, thumbW, revealPanel, hidePanel],
  );

  // ── ScrollTrigger ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!wrapperRef.current || !scroller) return;

    // Init state
    imageRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, clipPath: "inset(0 0 0 0)" });
    });
    leftRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
      if (i === 0)
        gsap.set(el.querySelectorAll(".reveal-line"), { yPercent: 0 });
      else gsap.set(el.querySelectorAll(".reveal-line"), { yPercent: 105 });
    });
    rightRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
      if (i === 0)
        gsap.set(el.querySelectorAll(".reveal-line"), { yPercent: 0 });
      else gsap.set(el.querySelectorAll(".reveal-line"), { yPercent: 105 });
    });
    if (indicatorRef.current) gsap.set(indicatorRef.current, { left: "0%" });
    if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0 });

    // Extra 100vh at end → last snap is at count/(count+1) of total progress

    // Total height = count+1 units of 100vh. Each project occupies count/(count+1) of total progress.
    const totalProgress = count / (count + 1);
    const snapValues = projects.map((_, i) =>
      i === 0 ? 0 : (i / (count - 1)) * totalProgress,
    );
    let lastSnapped = -1;

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      scroller,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: snapValues,
        duration: { min: 0.35, max: 0.65 },
        ease: "power3.inOut",
        delay: 0.04,
      },
      onUpdate: (self) => {
        const raw = Math.min(
          (self.progress / totalProgress) * (count - 1),
          count - 1,
        );
        const nearest = Math.round(raw);
        if (nearest !== lastSnapped && Math.abs(raw - nearest) < 0.06) {
          lastSnapped = nearest;
          goTo(nearest);
        }
      },
    });

    return () => st.kill();
  }, [scroller, count, goTo]);

  // ── Click minimap ────────────────────────────────────────────────────────

  const scrollToProject = useCallback(
    (i: number) => {
      if (!wrapperRef.current || !scroller) return;
      const top = wrapperRef.current.offsetTop;
      const range = wrapperRef.current.offsetHeight - scroller.clientHeight;
      const totalProgress = count / (count + 1);
      onScrollTo(top + (i / (count - 1)) * totalProgress * range);
    },
    [scroller, count, onScrollTo],
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div ref={wrapperRef} style={{ height: `${count * 100 + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#09090b] flex flex-col text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-16 pt-10 pb-4 shrink-0">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">
            Selected Work
          </span>
          <span className="text-xs text-zinc-600 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} —{" "}
            {String(count).padStart(2, "0")}
          </span>
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center px-6 md:px-16 gap-6 md:gap-12 min-h-0">
          {/* Left — num + meta */}
          <div className="hidden md:block relative h-56">
            {projects.map((p, i) => (
              <div
                key={p.num}
                ref={(el) => {
                  leftRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center gap-4"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                <TextLine className="text-[7rem] font-light leading-none text-zinc-800/70 select-none tabular-nums">
                  {p.num}
                </TextLine>
                <div className="flex flex-col gap-1">
                  <TextLine className="text-xs text-zinc-500 uppercase tracking-widest">
                    {p.type}
                  </TextLine>
                  <TextLine className="text-xs text-zinc-700">
                    {p.year}
                  </TextLine>
                </div>
              </div>
            ))}
          </div>

          {/* Center — image */}
          <div className="relative w-full h-[55vh] md:h-[65vh]">
            {projects.map((p, i) => (
              <div
                key={p.num}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* Right — title + desc */}
          <div className="hidden md:block relative h-56">
            {projects.map((p, i) => (
              <div
                key={p.num}
                ref={(el) => {
                  rightRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center gap-4"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                <TextLine className="text-2xl font-light leading-tight">
                  {p.title}
                </TextLine>
                <TextLine className="text-sm text-zinc-400 leading-relaxed">
                  {p.desc}
                </TextLine>
                <TextLine className="text-xs text-zinc-600 uppercase tracking-widest mt-2">
                  View project →
                </TextLine>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile title */}
        <div className="md:hidden px-6 pb-4 relative h-16 shrink-0">
          {projects.map((p, i) => (
            <div
              key={p.num}
              className="absolute inset-x-6 flex items-center justify-between transition-opacity duration-300"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
            >
              <div>
                <h2 className="text-base font-light">{p.title}</h2>
                <span className="text-xs text-zinc-500">
                  {p.type} — {p.year}
                </span>
              </div>
              <span className="text-zinc-600 text-xs">→</span>
            </div>
          ))}
        </div>

        {/* Minimap */}
        <div className="px-6 md:px-16 pb-8 shrink-0">
          <div className="relative h-14 flex gap-1">
            <div
              ref={indicatorRef}
              className="absolute top-0 h-full border border-white/25 z-10 pointer-events-none"
              style={{ width: `calc(${thumbW}% - 4px)`, left: 0 }}
            />
            {projects.map((p, i) => (
              <button
                key={p.num}
                onClick={() => scrollToProject(i)}
                type="button"
                className="relative flex-1 h-full overflow-hidden group cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    i === activeIndex
                      ? "opacity-15"
                      : "opacity-40 group-hover:opacity-60"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute bottom-1 left-1.5 text-[8px] text-zinc-500 uppercase tracking-widest">
                  {p.num}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 h-px bg-zinc-800 relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-0 bg-zinc-500 origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
