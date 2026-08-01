import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { getLenis } from "./hooks/useLenisScroll";
import App from "./pages/App";
import LabPage from "./pages/LabPage";
import ProjectPage from "./pages/ProjectPage";
import VisualNotesPage from "./pages/VisualNotesPage";

export default function AnimatedRoutes() {
  const location = useLocation();

  // Lenis owns the scroll position, so reset it explicitly on navigation.
  useEffect(() => {
    const lenis = getLenis();

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/visual-notes" element={<VisualNotesPage />} />
      </Routes>
    </AnimatePresence>
  );
}
