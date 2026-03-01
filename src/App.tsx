"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageDithering } from "@paper-design/shaders-react";
import { useWindowSize } from "./utils/useWindowSize";
import Lenis from "lenis";
import Reveal from "./components/Reveal";
import Project from "./components/Project";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scroller, setScroller] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current!,
      content: scrollContainerRef.current!,
    });

    lenisRef.current = lenis;
    setScroller(scrollContainerRef.current);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.defaults({
      scroller: scrollContainerRef.current!,
    });

    document.body.style.overflow = "hidden";
    lenis.stop();

    return () => {
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  const blackDivRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const whiteBarRef = useRef<HTMLDivElement>(null);

  const { width, height } = useWindowSize();
  const isMobile = width <= 768;

  const handleClick = () => {
    const tl = gsap.timeline();

    tl.to(blackDivRef.current, {
      scale: isMobile ? 0.9 : 0.8,
      duration: 1.5,
      ease: "circ.inOut",
      delay: 0.2,
    });

    tl.to(
      whiteBarRef.current,
      {
        right: "auto",
        left: -6,
        duration: 2,
        ease: "circ.inOut",
        keyframes: {
          width: [6, 60, 6],
          duration: 2,
          ease: "circ.inOut",
          onComplete: () => {
            gsap.set(whiteBarRef.current, { display: "none" });
          },
        },
      },
      "+=0.3",
    )
      .to(
        portfolioRef.current,
        { left: 0, right: "auto", duration: 2, ease: "circ.inOut" },
        "<",
      )
      .to(blackDivRef.current, {
        scale: 1,
        duration: 1.5,
        ease: "circ.inOut",
        onComplete: () => {
          lenisRef.current?.start();
          ScrollTrigger.refresh();
        },
      })
      .set(scrollContainerRef.current, { visibility: "visible" }, "<")
      .call(
        () => {
          window.dispatchEvent(new Event("portfolioOpen"));
        },
        [],
        "<",
      );
  };

  // Expose scrollTo for ProjectsSection thumbnail clicks
  const handleScrollTo = useCallback((value: number) => {
    lenisRef.current?.scrollTo(value, {
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  }, []);

  const image = "/bansai.png";

  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden inset-0">
      <div
        ref={blackDivRef}
        className={`w-full h-full grid relative overflow-hidden z-20 ${
          isMobile
            ? "grid-cols-5 grid-rows-5 gap-1"
            : "grid-cols-8 grid-rows-8 gap-2"
        }`}
      >
        {/* ── Logo / Enter ─────────────────────────────────────────── */}
        <div
          className={`${
            isMobile ? "col-start-4 row-start-4" : "col-start-7 row-start-7"
          } relative flex items-center justify-center`}
        >
          <div
            className={`${
              isMobile ? "col-start-4 row-start-4" : "col-start-7 row-start-7"
            } relative p-4 cursor-pointer group flex items-center justify-center`}
            onClick={handleClick}
          >
            <div className="aspect-square w-full max-h-full">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-full h-full object-contain group-hover:scale-95 transition-transform duration-300"
              />
            </div>
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-zinc-700 transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-zinc-700 transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-zinc-700 transition-all duration-300 group-hover:-translate-x-2 group-hover:translate-y-2" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-zinc-700 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          </div>
        </div>

        <div
          ref={whiteBarRef}
          className="h-full w-0 absolute right-0 bg-white z-10"
        />

        {/* ── Portfolio ─────────────────────────────────────────────── */}
        <div
          ref={portfolioRef}
          className="w-full h-full absolute -right-full bg-[#09090b] overflow-hidden"
        >
          <div
            ref={scrollContainerRef}
            className="h-full w-full overflow-y-auto overflow-x-hidden"
            style={{ visibility: "hidden" }}
          >
            {/* ── 1. Hero ─────────────────────────────────────────── */}
            <section className="h-screen w-full flex flex-col justify-between px-6 md:px-16 py-12 text-white border-b border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest">
                <Reveal>
                  <span>Portfolio</span>
                </Reveal>
                <Reveal delay={0.1}>
                  <span>2024</span>
                </Reveal>
              </div>

              <div className="flex flex-col gap-4">
                <Reveal stagger={0.06}>
                  <h1 className="text-[clamp(3rem,10vw,9rem)] font-light leading-none tracking-tight">
                    Creative
                  </h1>
                </Reveal>
                <Reveal delay={0.05} stagger={0.06}>
                  <h1 className="text-[clamp(3rem,10vw,9rem)] font-light leading-none tracking-tight text-zinc-500">
                    Developer
                  </h1>
                </Reveal>
                <Reveal delay={0.1} stagger={0.06}>
                  <h1 className="text-[clamp(3rem,10vw,9rem)] font-light leading-none tracking-tight">
                    & Designer
                  </h1>
                </Reveal>
              </div>

              <div className="flex items-end justify-between">
                <Reveal delay={0.3}>
                  <p className="text-zinc-400 text-sm max-w-xs">
                    Based in Paris — crafting digital experiences that live
                    between design and code.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <span className="text-zinc-600 text-xs uppercase tracking-widest">
                    Scroll ↓
                  </span>
                </Reveal>
              </div>
            </section>

            {/* ── 2. About ─────────────────────────────────────────── */}
            <section className="min-h-screen w-full flex flex-col justify-center px-6 md:px-16 py-24 text-white border-b border-zinc-800 gap-16">
              <div className="flex items-center gap-6">
                <Reveal>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">
                    About
                  </span>
                </Reveal>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                <div>
                  <Reveal stagger={0.05}>
                    <p className="text-2xl md:text-3xl font-light leading-snug text-zinc-200">
                      I design and build digital products with a focus on
                      motion, typography, and interaction.
                    </p>
                  </Reveal>
                </div>
                <div className="flex flex-col gap-6 justify-end">
                  <Reveal delay={0.1}>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      With over 5 years of experience, I work at the
                      intersection of design and engineering — turning ideas
                      into polished, memorable web experiences.
                    </p>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      I collaborate with studios, agencies, and startups across
                      Europe and beyond.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="flex gap-8 pt-4 text-xs text-zinc-500 uppercase tracking-widest">
                      <span>React</span>
                      <span>GSAP</span>
                      <span>Figma</span>
                      <span>Three.js</span>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* ── 3. Projects (sticky scroll) ──────────────────────── */}
            <Project scroller={scroller} onScrollTo={handleScrollTo} />

            {/* ── 4. Contact ───────────────────────────────────────── */}
            <section className="min-h-screen w-full flex flex-col justify-center px-6 md:px-16 py-24 text-white gap-16">
              <div className="flex items-center gap-6">
                <Reveal>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">
                    Contact
                  </span>
                </Reveal>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <div className="flex flex-col gap-8">
                <Reveal stagger={0.04}>
                  <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-light leading-none">
                    Let's work together.
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <a
                    href="mailto:hello@you.com"
                    className="text-zinc-400 text-lg hover:text-white transition-colors duration-300 w-fit border-b border-zinc-700 pb-1"
                  >
                    hello@you.com
                  </a>
                </Reveal>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-600 uppercase tracking-widest">
                <Reveal delay={0.1}>
                  <span>© 2024</span>
                </Reveal>
                <div className="flex gap-8">
                  <Reveal delay={0.15}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors duration-300"
                    >
                      Twitter
                    </a>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors duration-300"
                    >
                      Linkedin
                    </a>
                  </Reveal>
                  <Reveal delay={0.25}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors duration-300"
                    >
                      Github
                    </a>
                  </Reveal>
                </div>
              </div>
            </section>
          </div>
        </div>

        <ImageDithering
          width={width}
          height={height}
          image={image}
          colorBack="#09090b"
          colorFront="#3f3f46"
          colorHighlight="#09090b"
          originalColors={false}
          inverted={false}
          type="2x2"
          size={2.4}
          colorSteps={2}
          fit="cover"
          className="absolute top-0 left-0 w-full h-full -z-1"
        />
      </div>
    </div>
  );
};

export default App;
