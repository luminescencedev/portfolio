import { AnimatePresence, motion } from "motion/react";
import { useCursorStore } from "../../cursorStore";

export default function ProjectPreview() {
  const activeProject = useCursorStore((s) => s.activeProject);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {activeProject ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full overflow-hidden"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={activeProject.image}
                src={activeProject.image}
                alt={`Screenshot of ${activeProject.title}`}
                decoding="async"
                className="w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, position: "absolute", inset: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              />
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
