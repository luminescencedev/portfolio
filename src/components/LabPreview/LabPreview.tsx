import { motion } from "motion/react";
import { useNavigate } from "react-router";

/** One row on the Home, linking to the Lab hub. The arrow reacts on hover. */
export default function LabPreview() {
  const navigate = useNavigate();

  return (
    <section className="mb-12 w-full rounded-2xl p-4" aria-label="Lab">
      <motion.button
        onClick={() => navigate("/lab")}
        aria-label="Lab — view all experiments"
        className="flex w-full cursor-pointer items-baseline justify-between rounded-xl px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
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
      </motion.button>
    </section>
  );
}
