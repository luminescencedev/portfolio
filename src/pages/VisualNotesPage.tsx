import { motion } from "motion/react";
import { TbArrowBack } from "react-icons/tb";
import { useNavigate } from "react-router";
import CustomCursor from "../components/CustomCursor";
import { visualNotes } from "../data/visualNotes";

export default function VisualNotesPage() {
  const navigate = useNavigate();

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
        <div className="flex w-full max-w-140 shrink-0 flex-col gap-10">
          <button
            onClick={() => navigate("/")}
            className="flex w-fit cursor-pointer items-center gap-1.5 px-2 text-neutral-500 transition-colors hover:text-neutral-900"
            aria-label="Home"
          >
            <TbArrowBack size={15} style={{ strokeWidth: 1.5 }} />
            <span className="text-sm">Home</span>
          </button>

          <div className="flex flex-col gap-2 px-2">
            <h1 className="text-sm font-medium text-neutral-800">
              Visual notes
            </h1>
            <p className="text-sm leading-relaxed text-neutral-500">
              Things I notice outside the screen.
            </p>
          </div>

          {visualNotes.length === 0 ? (
            <p className="px-2 pb-12 font-mono text-[10px] text-neutral-400">
              nothing here yet.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 pb-12 sm:grid-cols-2">
              {visualNotes.map((note) => (
                <li key={note.id} className="flex flex-col gap-2">
                  <img
                    src={note.src}
                    alt={note.alt}
                    width={note.width}
                    height={note.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-xl border border-neutral-200 object-cover"
                    style={{ aspectRatio: `${note.width} / ${note.height}` }}
                  />
                  {(note.caption || note.location || note.date) && (
                    <p className="px-1 text-xs text-neutral-400">
                      {[note.caption, note.location, note.date]
                        .filter(Boolean)
                        .join(" — ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1" />
      </div>
    </motion.main>
  );
}
