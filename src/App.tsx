import { cn } from "./utils/cn";
import { RevealText, Terminal } from "./components";
import gsap from "gsap";

const App = () => {
  const handleRevealComplete = () => {
    gsap.to(".title", {
      left: "0%",
      bottom: "0%",
      fontSize: "14rem",
      duration: 2.5,
      ease: "power2.inOut",
      translateY: "0%",
      translateX: "50%",
    });
  };
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center relative">
        <Terminal />

        <RevealText
          className={cn(
            " text-[28rem] font-[ROXBOROUGH] text-zinc-900 leading-[90%] absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 title"
          )}
          splitBy="chars"
          duration={1}
          stagger={0.1}
          delay={0.5}
          onComplete={handleRevealComplete}
        >
          Arthur.
        </RevealText>
      </div>
    </>
  );
};

export default App;
