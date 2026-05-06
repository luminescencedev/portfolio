import { useState } from "react";
import Works, { type WorkProject } from "../components/Works";
import About from "../components/About";
import WorkTimeline from "../components/WorkTimeline";
import Links from "../components/Links";
import CustomCursor from "../components/CustomCursor";
import ProjectModal from "../components/ProjectModal";

export default function App() {
  const [openProject, setOpenProject] = useState<WorkProject | null>(null);

  return (
    <main
      className="min-h-screen px-4 py-12 sm:px-8 sm:py-24"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <CustomCursor />
      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />

      <div className="flex w-full items-start">
        <div className="flex-1" />
        <div className="w-full max-w-140 shrink-0">
          <About />
          <WorkTimeline />
          <Works onProjectOpen={setOpenProject} />
          <Links />
        </div>
        <div className="flex-1" />
      </div>
    </main>
  );
}
