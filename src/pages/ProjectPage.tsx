import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TbArrowBack, TbChevronLeft, TbChevronRight, TbX } from "react-icons/tb";
import { useNavigate, useParams } from "react-router";
import CustomCursor from "../components/CustomCursor";
import { works } from "../data/works";

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const indexRef = useRef(index);
  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  // wheel scroll
  useEffect(() => {
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - last < 450) return;
      last = now;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta > 0) onNext();
      else onPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onPrev, onNext]);

  const handleDragEnd = (_: never, info: PanInfo) => {
    if (info.offset.x < -60) onNext();
    else if (info.offset.x > 60) onPrev();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ padding: "4vh 4vw" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      {/* close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-neutral-600 hover:text-neutral-900 transition-colors z-10 cursor-pointer"
        aria-label="Close"
      >
        <TbX size={18} style={{ strokeWidth: 1.5 }} />
      </button>

      {/* image */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="relative flex items-center justify-center"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt={`screenshot ${index + 1}`}
            className="block object-contain rounded-lg border border-neutral-200 pointer-events-none select-none"
            style={{ maxHeight: "90vh", maxWidth: "92vw" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            draggable={false}
          />
        </AnimatePresence>

        {/* prev */}
        {index > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 text-neutral-500 hover:text-neutral-900 transition-colors pointer-events-auto cursor-pointer"
            aria-label="Previous"
          >
            <TbChevronLeft size={22} style={{ strokeWidth: 1.5 }} />
          </button>
        )}

        {/* next */}
        {index < images.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 text-neutral-500 hover:text-neutral-900 transition-colors pointer-events-auto cursor-pointer"
            aria-label="Next"
          >
            <TbChevronRight size={22} style={{ strokeWidth: 1.5 }} />
          </button>
        )}

        {/* counter */}
        <span className="absolute bottom-3 right-4 text-sm text-neutral-400 pointer-events-none">
          {index + 1} / {images.length}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

function Carousel({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const indexRef = useRef(0);
  const dragging = useRef(false);

  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setSlideWidth(el.offsetWidth);
    const ro = new ResizeObserver(() => setSlideWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, images.length - 1))),
    [images.length],
  );

  const lbGoTo = useCallback(
    (i: number) => setExpanded(Math.max(0, Math.min(i, images.length - 1))),
    [images.length],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - last < 450) return;
      last = now;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta > 0) goTo(indexRef.current + 1);
      else goTo(indexRef.current - 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60) goTo(index + 1);
    else if (info.offset.x > 60) goTo(index - 1);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div
            ref={containerRef}
            className="overflow-hidden rounded-lg border border-neutral-200"
          >
            {slideWidth > 0 && (
              <motion.div
                className="flex"
                style={{ width: slideWidth * images.length }}
                animate={{ x: -(index * slideWidth) }}
                transition={{ type: "spring", stiffness: 320, damping: 36 }}
                drag="x"
                dragConstraints={{ left: -(images.length - 1) * slideWidth, right: 0 }}
                dragElastic={0.08}
                onDragStart={() => { dragging.current = true; }}
                onDragEnd={(e, info) => { handleDragEnd(e, info); setTimeout(() => { dragging.current = false; }, 0); }}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    style={{ width: slideWidth }}
                    className="shrink-0 aspect-video overflow-hidden relative group cursor-zoom-in"
                    onClick={() => { if (!dragging.current) setExpanded(i); }}
                  >
                    <img
                      src={img}
                      alt={`screenshot ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                      draggable={false}
                      decoding="async"
                    />
                    {/* voir + hint */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                      <span className="font-mono text-[8px] text-white/80 bg-black/25 px-1.5 py-0.5 rounded">
                        voir +
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-0 cursor-pointer"
          >
            <TbChevronLeft size={18} style={{ strokeWidth: 1.5 }} />
          </button>

          <button
            onClick={() => goTo(index + 1)}
            disabled={index === images.length - 1}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-0 cursor-pointer"
          >
            <TbChevronRight size={18} style={{ strokeWidth: 1.5 }} />
          </button>
        </div>

        {/* dots + counter */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex gap-1.5 items-center">
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Image ${i + 1}`} className="cursor-pointer">
                <div
                  className="rounded-full bg-neutral-800 transition-all duration-200"
                  style={{ width: i === index ? 14 : 4, height: 4, opacity: i === index ? 1 : 0.18 }}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-neutral-400">
            {index + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {expanded !== null && (
          <Lightbox
            images={images}
            index={expanded}
            onClose={() => setExpanded(null)}
            onPrev={() => lbGoTo(expanded - 1)}
            onNext={() => lbGoTo(expanded + 1)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = works.find((w) => w.slug === slug);

  if (!project) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-8 sm:py-24 flex items-center justify-center">
        <p className="font-mono text-[10px] text-neutral-400">projet introuvable.</p>
      </main>
    );
  }

  return (
    <motion.main
      className="min-h-screen px-4 py-12 sm:px-8 sm:py-24"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <CustomCursor />

      <div className="flex w-full">
        <div className="flex-1" />
        <div className="w-full max-w-140 shrink-0 flex flex-col gap-10">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors w-fit px-2 cursor-pointer"
            aria-label="Back"
          >
            <TbArrowBack size={16} style={{ strokeWidth: 1.5 }} />
            <span className="text-sm">back</span>
          </button>

          <div className="px-2 flex flex-col gap-2">
            {project.year && (
              <p className="text-sm text-neutral-400">{project.year}</p>
            )}
            <h1 className="text-sm font-medium text-neutral-800">{project.title}</h1>
            <p className="text-sm text-neutral-400">{project.desc}</p>
          </div>

          <p className="px-2 text-sm leading-loose text-neutral-500">{project.longDesc}</p>

          <div className="flex items-center justify-between px-2">
            <div className="flex gap-3 items-center">
              {project.icons.map(({ Icon, color }, i) => (
                <Icon key={i} size={13} color={color} />
              ))}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              visit ↗
            </a>
          </div>

          <Carousel images={project.images} />

        </div>
        <div className="flex-1" />
      </div>
    </motion.main>
  );
}
