import { motion } from "motion/react";
import Works from "../components/Works";
import About from "../components/About";
import WorkTimeline from "../components/WorkTimeline";
import Links from "../components/Links";
import CustomCursor from "../components/CustomCursor";

export default function App() {
  return (
    <motion.main
      className="min-h-screen px-4 py-12 sm:px-8 sm:py-24"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <CustomCursor />

      <div className="flex w-full items-start">
        <div className="flex-1" />
        <div className="w-full max-w-140 shrink-0">
          <About />
          <WorkTimeline />
          <Works />
          <Links />
        </div>
        <div className="flex-1" />
      </div>
    </motion.main>
  );
}
