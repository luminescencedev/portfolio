import Works from "../components/Works";
import About from "../components/About";
import WorkTimeline from "../components/WorkTimeline";
import Links from "../components/Links";
import CustomCursor from "../components/CustomCursor";
import ProjectPreview from "../components/ProjectPreview/ProjectPreview";

export default function App() {
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

      <div className="flex w-full items-start">
        <div className="flex-1" />
        <div className="w-full max-w-140 shrink-0">
          <About />
          <WorkTimeline />
          <Works />
          <Links />
        </div>
        <div className="flex-1 self-end hidden lg:flex pl-8 pb-20">
          <div className="w-96">
            <ProjectPreview />
          </div>
        </div>
      </div>
    </main>
  );
}
