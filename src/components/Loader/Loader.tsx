import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

const Loader = () => {
  const blackDivRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const numberDivRef = useRef<HTMLDivElement>(null);
  const [loadingNumber, setLoadingNumber] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();
    const numberObj = { value: 0 };

    tl.set(numberDivRef.current, { y: "0vh" });
    tl.set(numberRef.current, { top: "auto" });
    tl.set(numberObj, { value: 0 });

    tl.to(numberObj, {
      value: 13,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setLoadingNumber(Math.floor(numberObj.value)),
    })
      .to(
        numberDivRef.current,
        { y: "16.67vh", duration: 0.9, ease: "power2.inOut" },
        "<",
      )
      .to(
        numberRef.current,
        { bottom: "83.33%", duration: 0.9, ease: "power2.inOut" },
        "<",
      );

    tl.to(numberObj, {
      value: 42,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setLoadingNumber(Math.floor(numberObj.value)),
    })
      .to(
        numberDivRef.current,
        { y: "33.33vh", duration: 0.9, ease: "power2.inOut" },
        "<",
      )
      .to(
        numberRef.current,
        { bottom: "50%", duration: 0.9, ease: "power2.inOut" },
        "<",
      );

    tl.to(numberObj, {
      value: 64,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setLoadingNumber(Math.floor(numberObj.value)),
    })
      .to(
        numberDivRef.current,
        { y: "50vh", duration: 0.9, ease: "power2.inOut" },
        "<",
      )
      .to(
        numberRef.current,
        { bottom: "33.33%", duration: 0.9, ease: "power2.inOut" },
        "<",
      );

    tl.to(numberObj, {
      value: 92,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => setLoadingNumber(Math.floor(numberObj.value)),
    })
      .to(
        numberDivRef.current,
        { y: "66.67vh", duration: 0.9, ease: "power2.inOut" },
        "<",
      )
      .to(
        numberRef.current,
        { bottom: "16.67%", duration: 0.9, ease: "power2.inOut" },
        "<",
      );

    tl.to(numberObj, {
      value: 100,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => setLoadingNumber(Math.floor(numberObj.value)),
    })
      .to(
        numberDivRef.current,
        { y: "83.33vh", duration: 1.2, ease: "power2.inOut" },
        "<",
      )
      .to(
        numberRef.current,
        { bottom: 0, duration: 1.2, ease: "power2.inOut" },
        "<",
      );

    return () => {
      tl.kill();
    };
  }, []);

  const handleClick = () => {
    const tl = gsap.timeline();

    tl.to(blackDivRef.current, {
      scale: 0.8,
      duration: 1.5,
      ease: "power2.inOut",
      delay: 0.2,
    });
  };

  return (
    <div className="h-screen w-screen bg-white flex justify-center items-center">
      <div
        ref={blackDivRef}
        className="h-full w-full bg-black grid grid-cols-6 grid-rows-6 overflow-hidden"
      >
        <div ref={numberDivRef} className="row-start-1 col-start-1">
          <p ref={numberRef} className="text-white text-9xl absolute">
            {loadingNumber}
          </p>
        </div>
        <div
          onClick={handleClick}
          className="row-start-6 col-start-6 text-white flex items-end justify-start"
        >
          <div className="h-[50%] w-[50%] flex items-end">
            <p className="text-5xl hover:scale-150 transition-all">A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
