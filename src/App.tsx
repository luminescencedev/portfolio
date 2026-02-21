import { useRef } from "react";
import gsap from "gsap";
import { ImageDithering } from "@paper-design/shaders-react";
import React from "react";

const App = () => {
  const blackDivRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const whiteBarRef = useRef<HTMLDivElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const tl = gsap.timeline();

    tl.to(blackDivRef.current, {
      scale: 0.8,
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
            tl.to(whiteBarRef.current, {
              display: "none",
            });
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
        scale: 0.8,
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
    });
  };

  const image = "/bansai.png";

  const [width, setWidth] = React.useState<number>(window.innerWidth);
  const [height, setHeight] = React.useState<number>(window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div
        ref={blackDivRef}
        className="w-full h-full grid grid-cols-8 grid-rows-8 gap-2 relative overflow-hidden z-20"
      >
        <div
          className="col-start-7 row-start-7 relative py-4 cursor-pointer group"
          onClick={handleClick}
        >
          <img
            className="h-full w-full group-hover:scale-95 transition-transform duration-300"
            src="/logo.svg"
            alt="Logo"
          />
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-zinc-700 transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-zinc-700 transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-zinc-700 transition-all duration-300 group-hover:-translate-x-2 group-hover:translate-y-2"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-zinc-700 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
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

      <div
        ref={portfolioRef}
        className="absolute inset-0 z-10 opacity-0 bg-[#09090b] text-white flex justify-center items-center"
      >
        <h1 className="text-4xl font-[PPValve]">Welcome to my Portfolio</h1>
      </div>
    </div>
  );
};

export default App;
