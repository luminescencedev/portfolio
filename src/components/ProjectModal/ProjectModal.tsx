import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { WorkProject } from "../Works/Works";

interface Props {
  project: WorkProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* backdrop */}
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-[9998] cursor-pointer"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* sheet */}
          <motion.div
            key="modal-sheet"
            className="fixed inset-x-0 bottom-0 z-[9999] bg-white rounded-t-2xl flex flex-col"
            style={{ maxHeight: "88vh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-8 h-0.5 rounded-full bg-neutral-200" />
            </div>

            {/* header */}
            <div className="flex items-start justify-between px-8 pt-5 pb-6 flex-shrink-0">
              <div>
                <h2 className="font-mono text-sm font-bold text-neutral-900">{project.title}</h2>
                <p className="font-mono text-[10px] text-neutral-400 mt-1">
                  {[project.year, project.desc].filter(Boolean).join(" — ")}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[10px] text-neutral-400 hover:text-neutral-900 transition-colors mt-2 inline-block"
                >
                  visit ↗
                </a>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-lg text-neutral-300 hover:text-neutral-900 transition-colors leading-none mt-0.5"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* carousel */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto pb-10 px-8 gap-4 flex-shrink-0"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {project.images.map((img, i) => (
                <motion.div
                  key={img + i}
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{
                    scrollSnapAlign: "start",
                    width: project.images.length === 1 ? "100%" : "80%",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: "easeOut" }}
                >
                  <img
                    src={img}
                    alt={`${project.title} — screenshot ${i + 1}`}
                    className="w-full h-auto object-cover"
                    decoding="async"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
