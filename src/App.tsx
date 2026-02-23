import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageDithering } from "@paper-design/shaders-react";
import { useWindowSize } from "./utils/useWindowSize";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

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
  // const blackOverlayRef = useRef<HTMLDivElement>(null);

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
        {
          left: 0,
          right: "auto",
          duration: 2,
          ease: "circ.inOut",
        },
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
          ref={portfolioRef}
          className="w-full h-full absolute -right-full bg-[#09090b] overflow-hidden"
        >
          <div
            ref={scrollContainerRef}
            className="h-full w-full overflow-hidden"
          >
            <section className="h-screen w-screen text-white">
              Section 1
            </section>

            <section className="h-screen w-screen text-white">
              Section 2
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
