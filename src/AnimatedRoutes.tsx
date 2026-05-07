import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router";
import App from "./pages/App";
import ProjectPage from "./pages/ProjectPage";

export default function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
      </Routes>
    </AnimatePresence>
  );
}
