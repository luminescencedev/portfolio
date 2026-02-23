import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ImageDithering } from "@paper-design/shaders-react";
import { useWindowSize } from "./utils/useWindowSize";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Helper : cache un élément, l'anime avec SplitText chars, retourne la timeline/tween
function splitAnimChars(
  el: Element,
  tlOrGsap: gsap.core.Timeline | typeof gsap,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  position?: gsap.Position,
) {
  (el as HTMLElement).style.visibility = "visible";
  const split = new SplitText(el as HTMLElement, { type: "chars" });
  if (tlOrGsap instanceof gsap.core.Timeline) {
    tlOrGsap.fromTo(split.chars, fromVars, toVars, position);
  } else {
    gsap.fromTo(split.chars, fromVars, toVars);
  }
}

function splitAnimWords(
  el: Element,
  tlOrGsap: gsap.core.Timeline | typeof gsap,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  position?: gsap.Position,
) {
  (el as HTMLElement).style.visibility = "visible";
  const split = new SplitText(el as HTMLElement, { type: "words" });
  if (tlOrGsap instanceof gsap.core.Timeline) {
    tlOrGsap.fromTo(split.words, fromVars, toVars, position);
  } else {
    gsap.fromTo(split.words, fromVars, toVars);
  }
}

const App = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current!,
      content: scrollContainerRef.current!,
    });

    lenisRef.current = lenis;

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

  const animatePortfolioIn = () => {
    const scroller = scrollContainerRef.current!;

    // ── Section 1 Hero : séquence de haut en bas ──────────────────────
    const tl = gsap.timeline();

    // 1. Overline
    const overlineEl = document.querySelector("[data-s1-overline]");
    if (overlineEl) {
      splitAnimWords(
        overlineEl,
        tl,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 },
        0,
      );
    }

    // 2. Titre
    const titleEl = document.querySelector("[data-s1-title]");
    if (titleEl) {
      splitAnimChars(
        titleEl,
        tl,
        { y: 90, opacity: 0, rotateX: -50 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.025,
        },
        0.3,
      );
    }

    // 3. Ligne décorative
    const lineEl = document.querySelector("[data-s1-line]");
    if (lineEl) {
      (lineEl as HTMLElement).style.visibility = "visible";
      tl.fromTo(
        lineEl,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.2, ease: "expo.out" },
        0.9,
      );
    }

    // 4. Sous-titre
    const subEl = document.querySelector("[data-s1-sub]");
    if (subEl) {
      splitAnimWords(
        subEl,
        tl,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.04 },
        1.1,
      );
    }

    // 5. Scroll hint (dernier)
    const scrollHint = document.querySelector("[data-s1-scroll]");
    if (scrollHint) {
      (scrollHint as HTMLElement).style.visibility = "visible";
      tl.fromTo(
        scrollHint,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
        1.6,
      );
    }

    // ── Section 2 — ScrollTrigger ──────────────────────────────────────

    const s2Label = document.querySelector("[data-s2-label]");
    if (s2Label) {
      (s2Label as HTMLElement).style.visibility = "visible";
      gsap.fromTo(
        s2Label,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: s2Label, scroller, start: "top 88%" },
        },
      );
    }

    const s2TitleEl = document.querySelector("[data-s2-title]");
    if (s2TitleEl) {
      splitAnimChars(
        s2TitleEl,
        gsap,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          stagger: 0.025,
          scrollTrigger: { trigger: s2TitleEl, scroller, start: "top 85%" },
        },
      );
    }

    document.querySelectorAll("[data-s2-card]").forEach((el, i) => {
      (el as HTMLElement).style.visibility = "visible";
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: el, scroller, start: "top 90%" },
        },
      );
    });

    // ── Section 3 — ScrollTrigger ──────────────────────────────────────

    const s3Label = document.querySelector("[data-s3-label]");
    if (s3Label) {
      (s3Label as HTMLElement).style.visibility = "visible";
      gsap.fromTo(
        s3Label,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: s3Label, scroller, start: "top 88%" },
        },
      );
    }

    const s3TitleEl = document.querySelector("[data-s3-title]");
    if (s3TitleEl) {
      splitAnimChars(
        s3TitleEl,
        gsap,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          stagger: 0.025,
          scrollTrigger: { trigger: s3TitleEl, scroller, start: "top 85%" },
        },
      );
    }

    const s3Sub = document.querySelector("[data-s3-sub]");
    if (s3Sub) {
      splitAnimWords(
        s3Sub,
        gsap,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.04,
          scrollTrigger: { trigger: s3Sub, scroller, start: "top 88%" },
        },
      );
    }

    const s3Line = document.querySelector("[data-s3-line]");
    if (s3Line) {
      (s3Line as HTMLElement).style.visibility = "visible";
      gsap.fromTo(
        s3Line,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: s3Line, scroller, start: "top 90%" },
        },
      );
    }

    document.querySelectorAll("[data-s3-tech]").forEach((el, i) => {
      (el as HTMLElement).style.visibility = "visible";
      gsap.fromTo(
        el,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: el, scroller, start: "top 95%" },
        },
      );
    });
  };

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
          animatePortfolioIn();
        },
      });
  };

  const image = "/bansai.png";

  // Style inline appliqué sur chaque élément animé : caché jusqu'à l'animation
  const hidden: React.CSSProperties = { visibility: "hidden" };

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
        {/* Logo / trigger */}
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

        {/* White wipe bar */}
        <div
          ref={whiteBarRef}
          className="h-full w-0 absolute right-0 bg-white z-10"
        />

        {/* ─── Portfolio Panel ─── */}
        <div
          ref={portfolioRef}
          className="w-full h-full absolute -right-full bg-[#09090b] overflow-hidden"
        >
          <div
            ref={scrollContainerRef}
            className="h-full w-full overflow-y-scroll overflow-x-hidden"
          >
            {/* ── Section 1 — Hero ── */}
            <section className="relative h-screen w-full flex flex-col justify-center px-12 md:px-24 overflow-hidden">
              {/* Grid lines bg */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-zinc-800/30"
                    style={{ left: `${(i + 1) * (100 / 7)}%` }}
                  />
                ))}
              </div>

              <p
                data-s1-overline
                style={hidden}
                className="text-zinc-500 tracking-[0.3em] text-xs uppercase mb-6"
              >
                Portfolio — 2025
              </p>

              <h1
                data-s1-title
                style={{ ...hidden, perspective: "600px" }}
                className="text-white font-light text-6xl md:text-8xl leading-none mb-6"
              >
                Creative
                <br />
                <span className="text-zinc-500">Developer</span>
              </h1>

              <div
                data-s1-line
                style={hidden}
                className="h-px bg-zinc-700 w-48 mb-8"
              />

              <p
                data-s1-sub
                style={hidden}
                className="text-zinc-400 text-base md:text-lg max-w-md leading-relaxed"
              >
                Crafting immersive digital experiences at the intersection of
                design and code.
              </p>

              <div
                data-s1-scroll
                style={hidden}
                className="absolute bottom-12 left-12 md:left-24 flex items-center gap-3 text-zinc-600 text-xs tracking-widest uppercase"
              >
                <div className="w-8 h-px bg-zinc-700" />
                Scroll
              </div>
            </section>

            {/* ── Section 2 — Work ── */}
            <section className="relative min-h-screen w-full px-12 md:px-24 py-32">
              <p
                data-s2-label
                style={hidden}
                className="text-zinc-600 tracking-[0.3em] text-xs uppercase mb-4"
              >
                Selected Work
              </p>
              <h2
                data-s2-title
                style={hidden}
                className="text-white font-light text-5xl md:text-7xl leading-none mb-20"
              >
                Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { num: "01", title: "Brand Identity", tag: "Visual Design" },
                  { num: "02", title: "Web Experience", tag: "Front-end" },
                  { num: "03", title: "Motion System", tag: "Animation" },
                  { num: "04", title: "3D Interface", tag: "WebGL" },
                ].map((item) => (
                  <div
                    key={item.num}
                    data-s2-card
                    style={hidden}
                    className="group relative border border-zinc-800 p-8 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-zinc-900 scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100" />
                    <div className="relative z-10">
                      <span className="text-zinc-700 text-xs tracking-widest block mb-6">
                        {item.num}
                      </span>
                      <h3 className="text-white text-2xl font-light mb-3 group-hover:translate-x-2 transition-transform duration-300">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm tracking-wider uppercase">
                        {item.tag}
                      </p>
                    </div>
                    <div className="absolute bottom-8 right-8 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      ↗
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 3 — About ── */}
            <section className="relative min-h-screen w-full px-12 md:px-24 py-32 flex flex-col justify-center">
              <p
                data-s3-label
                style={hidden}
                className="text-zinc-600 tracking-[0.3em] text-xs uppercase mb-4"
              >
                About
              </p>
              <h2
                data-s3-title
                style={hidden}
                className="text-white font-light text-5xl md:text-7xl leading-none mb-12"
              >
                Crafted with
                <br />
                <span className="text-zinc-500">intention</span>
              </h2>
              <p
                data-s3-sub
                style={hidden}
                className="text-zinc-400 text-lg max-w-xl leading-relaxed mb-8"
              >
                Every pixel, every transition, every interaction is considered.
                I build things that feel as good as they look — fast,
                accessible, and alive.
              </p>
              <div
                data-s3-line
                style={hidden}
                className="h-px bg-zinc-800 w-full mt-8"
              />
              <div className="flex gap-16 mt-12">
                {["React", "GSAP", "WebGL", "Three.js"].map((tech) => (
                  <span
                    key={tech}
                    data-s3-tech
                    style={hidden}
                    className="text-zinc-600 text-sm tracking-widest uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Dithered background */}
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
