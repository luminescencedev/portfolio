import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageDithering } from "@paper-design/shaders-react";
import { useWindowSize } from "./utils/useWindowSize";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.refresh();

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
  const blackOverlayRef = useRef<HTMLDivElement>(null);

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
    ).to(
      blackOverlayRef.current,
      {
        left: 0,
        right: "auto",
        duration: 2,
        ease: "circ.inOut",
      },
      "<",
    );

    tl.add(() => {
      gsap.set(portfolioRef.current, {
        scale: isMobile ? 0.9 : 0.8,
        opacity: 1,
      });

      gsap.set(blackDivRef.current, {
        display: "none",
      });
    });

    tl.to(portfolioRef.current, {
      scale: 1,
      duration: 1.5,
      ease: "circ.inOut",
      onComplete: () => {
        document.body.style.overflow = "auto";
        lenisRef.current?.start();
        ScrollTrigger.refresh();
      },
    });
  };

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

            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-zinc-700 transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-zinc-700 transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-zinc-700 transition-all duration-300 group-hover:-translate-x-2 group-hover:translate-y-2"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-zinc-700 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
          </div>
        </div>

        <div
          ref={whiteBarRef}
          className="h-full w-0 absolute right-0 bg-white z-10"
        ></div>

        <div
          ref={blackOverlayRef}
          className="w-full h-full absolute -right-full bg-[#09090b]"
        ></div>

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

      <div ref={portfolioRef} className="absolute inset-0 z-10 opacity-0">
        <section
          id="section1"
          className="h-[200vh] w-screen bg-[#09090b] text-white"
        >
          Section 1
        </section>
      </div>
    </div>
  );
};

export default App;
