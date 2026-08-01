import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { TbArrowBack } from "react-icons/tb";
import { useNavigate } from "react-router";
import LabCarousel from "../components/LabCarousel";
import LabDrawer from "../components/LabDrawer";
import { PLACEHOLDER_CARDS, labExperiments } from "../data/labExperiments";
import type { LabExperiment } from "../data/labExperiments";
import { usePlainBackground } from "../hooks/usePlainBackground";

export default function LabPage() {
  const navigate = useNavigate();
  const [openExperiment, setOpenExperiment] = useState<LabExperiment | null>(
    null,
  );

  // Flat white here — the fade is timed to the page transition.
  usePlainBackground();

  const isPlaceholder = labExperiments.length === 0;
  const experiments = isPlaceholder ? PLACEHOLDER_CARDS : labExperiments;

  const [activeExperiment, setActiveExperiment] = useState<LabExperiment>(
    experiments[0],
  );

  // Stable, so the carousel's effect doesn't refire on every render.
  const handleActiveChange = useCallback((experiment: LabExperiment) => {
    setActiveExperiment(experiment);
  }, []);

  // Catalogue number: position in the reel, 1-based and zero-padded.
  const activeNumber = String(
    experiments.findIndex((item) => item.slug === activeExperiment.slug) + 1,
  ).padStart(3, "0");

  return (
    <motion.main
      className="min-h-screen px-4 py-12 sm:px-8 sm:py-24"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* Type sits in the Home column; the reel breaks out of it. */}
      <div className="flex w-full items-start">
        <div className="flex-1" />

        <div className="flex w-full max-w-140 shrink-0 flex-col gap-10">
          <button
            onClick={() => navigate("/")}
            className="flex w-fit cursor-pointer items-center gap-1.5 px-2 text-neutral-500 transition-colors hover:text-neutral-900"
            aria-label="Home"
          >
            <TbArrowBack size={15} style={{ strokeWidth: 1.5 }} />
            <span className="text-sm">Home</span>
          </button>

          <h1 className="px-2 text-sm font-medium text-neutral-800">Lab</h1>
        </div>

        <div className="flex-1" />
      </div>
      <div className="mt-10">
        <LabCarousel
          experiments={experiments}
          onSelect={setOpenExperiment}
          onActiveChange={handleActiveChange}
        />
      </div>
      {/* Reads out the centred card. Below the drawer's z-index. */}
      <div
        className="pointer-events-none fixed bottom-6 left-4 z-30 sm:bottom-8 sm:left-8"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExperiment.slug}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <p
              className={`font-mono text-[10px] ${
                isPlaceholder ? "text-neutral-300" : "text-neutral-400"
              }`}
            >
              Lab-{activeNumber} — {activeExperiment.year}
            </p>
            <p
              className={`text-5xl leading-none font-medium tracking-tight sm:text-7xl ${
                isPlaceholder ? "text-neutral-300" : "text-neutral-800"
              }`}
            >
              {activeExperiment.title}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <LabDrawer
        experiment={openExperiment}
        onClose={() => setOpenExperiment(null)}
      />
    </motion.main>
  );
}
