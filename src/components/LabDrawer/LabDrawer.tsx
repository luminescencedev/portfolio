import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect } from "react";
import { X } from "lucide-react";
import type { LabExperiment } from "../../data/labExperiments";
import { getLenis } from "../../hooks/useLenisScroll";
import { labRegistry } from "../../lab/registry";

interface LabDrawerProps {
  experiment: LabExperiment | null;
  onClose: () => void;
}

/**
 * Panel on the right at lg+, full screen below it — on a phone it reads as its
 * own page. The demo sits in a double bezel: outer shell holds the padding, an
 * inset ring and the ambient shadow, inner core holds the experiment.
 */
export default function LabDrawer({ experiment, onClose }: LabDrawerProps) {
  const isOpen = experiment !== null;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    // Lenis owns the scroll, so it has to be told to stand down.
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const Demo = experiment?.component
    ? labRegistry[experiment.component]
    : undefined;

  return (
    <AnimatePresence>
      {experiment && (
        <>
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={experiment.title}
            className="fixed top-0 right-0 z-50 flex h-full w-full flex-col overflow-y-auto border-black/10 bg-white lg:w-140 lg:border-l"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex flex-col gap-8 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-[10px] text-neutral-400">
                    {experiment.year}
                  </p>
                  <h2 className="text-sm font-medium text-neutral-800">
                    {experiment.title}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="cursor-pointer rounded-lg p-1 text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Playable area. The bezel lives on the carousel cards, not here. */}
              <div className="min-h-72 overflow-hidden rounded-xl border border-black/10 bg-white">
                {Demo ? (
                  <Suspense
                    fallback={<div className="min-h-72 animate-pulse" />}
                  >
                    <Demo />
                  </Suspense>
                ) : (
                  <div className="grid min-h-72 place-items-center">
                    <p className="font-mono text-[10px] text-neutral-300">
                      nothing to test yet
                    </p>
                  </div>
                )}
              </div>

              <p className="text-sm leading-relaxed text-neutral-500">
                {experiment.description}
              </p>

              {experiment.tags && experiment.tags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
