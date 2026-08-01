import { motion } from "motion/react";

/**
 * Placeholder row. No route, no content yet — experiments get added one at a
 * time. The arrow reacts on hover, nothing else happens.
 */
export default function LabPreview() {
  return (
    <section className="mb-12 w-full rounded-2xl p-4" aria-label="Lab">
      <motion.div
        className="flex items-baseline justify-between px-2"
        initial="rest"
        animate="rest"
        whileHover="hover"
      >
        <h2 className="text-sm font-medium text-neutral-800">Lab</h2>

        <span className="flex items-center gap-1 text-sm text-neutral-400">
          View all
          <motion.span
            aria-hidden="true"
            className="inline-block"
            variants={{ rest: { x: 0 }, hover: { x: 3 } }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            →
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
