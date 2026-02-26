import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useMinimap } from "./useMinimap";

const Project = () => {
  const images = useMemo(
    () =>
      Array.from({ length: 17 }, (_, i) => `/Gradient/Gradient${i + 1}.jpg`),
    [],
  );

  const previewTrackRef = useRef<HTMLDivElement | null>(null);
  const previewSetterRef = useRef<((value: number) => unknown) | null>(null);

  const handleProgress = useCallback((progressIndex: number) => {
    const step = 100 / images.length;
    previewSetterRef.current?.(-progressIndex * step);
  }, [images.length]);

  const {
    containerRef,
    viewportRef,
    listRef,
    indicatorRef,
    activeIndex,
    scrollToIndex,
  } = useMinimap(images.length, { onProgress: handleProgress });

  useEffect(() => {
    if (!previewTrackRef.current) {
      return;
    }

    const setter = gsap.quickSetter(previewTrackRef.current, "yPercent") as (
      value: number,
    ) => unknown;
    previewSetterRef.current = setter;
    setter(0);

    return () => {
      previewSetterRef.current = null;
    };
  }, []);

  return (
    <>
      <main
        ref={containerRef}
        className="relative h-screen w-screen overflow-hidden bg-zinc-100 touch-none lg:touch-auto"
      >
        <nav className="fixed top-0 left-0 w-screen p-[1.5em] flex justify-between items-center">
          <p>Arthur</p>
          <p>Menu</p>
        </nav>

        <div className="absolute -translate-x-1/2 lg:translate-x-0 top-[1.5em] lg:top-1/2 left-1/2 lg:left-[1.5em] flex gap-1">
          <p>AR13</p>
          <span className="text-zinc-400">
            <p>Responsive Minimap</p>
          </span>
        </div>

        <div className="img-preview absolute top-[45%] lg:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 lg:w-1/2 h-1/2 lg:h-3/4 overflow-hidden">
          <div
            ref={previewTrackRef}
            className="relative h-full w-full will-change-transform"
            style={{ height: `${images.length * 100}%` }}
          >
            {images.map((src, i) => (
              <div
                className="w-full"
                key={src}
                style={{ height: `${100 / images.length}%` }}
              >
                <img
                  className="h-full w-full object-contain"
                  src={src}
                  alt={`Preview ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-auto lg:top-1/2 right-auto lg:right-[8em] bottom-[8em] lg:bottom-auto left-1/2 lg:left-auto h-20 lg:h-[60vh] w-[70vw] max-w-[24rem] lg:w-20">
          <div
            ref={indicatorRef}
            className="indicator pointer-events-none absolute top-0 left-0 h-full lg:h-16 w-16 lg:w-full border z-10"
          ></div>
          <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
            <div
              ref={listRef}
              className="items relative h-full w-max lg:w-full flex flex-row lg:flex-col gap-0"
            >
              {images.map((src, i) => (
                <button
                  data-item
                  type="button"
                  className="item w-16 lg:w-full h-full lg:h-16 p-1.5 cursor-pointer shrink-0"
                  key={src}
                  onClick={() => scrollToIndex(i)}
                >
                  <img
                    className={`h-full w-full object-cover transition-opacity duration-150 ${
                      i === activeIndex ? "opacity-30" : "opacity-100"
                    }`}
                    src={src}
                    alt={`Preview ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Project;
