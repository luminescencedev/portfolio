import { cn } from "./utils/cn";
import { RevealText } from "./components";

const App = () => {
  return (
    <>
      <div className="h-screen w-screen p-8">
        <div className="h-screen w-max">
          <RevealText
            className={cn("text-9xl font-[ROXBOROUGH] text-[#1C1C1C]")}
            splitBy="chars"
            direction="up"
            duration={0.8}
            stagger={0.05}
            delay={0.2}
            trigger="auto"
          >
            Arthur
          </RevealText>

          <div className="mt-12">
            <RevealText
              className="text-2xl text-gray-600"
              splitBy="words"
              direction="up"
              duration={0.6}
              stagger={0.1}
              delay={1.2}
              trigger="auto"
            >
              Creative Developer & Designer
            </RevealText>
          </div>

          <div className="mt-8">
            <RevealText
              className="text-lg text-gray-500 max-w-md"
              splitBy="lines"
              direction="up"
              duration={0.8}
              stagger={0.2}
              delay={2}
              trigger="auto"
            >
              {`Crafting digital experiences\nwith passion and precision\nthrough code and design`}
            </RevealText>
          </div>

          <nav className="mt-16">
            <RevealText
              className="text-xl text-[#1C1C1C] cursor-pointer hover:opacity-70 transition-opacity"
              splitBy="chars"
              direction="left"
              duration={0.5}
              stagger={0.03}
              delay={3}
              trigger="auto"
            >
              Portfolio
            </RevealText>
          </nav>
        </div>
      </div>
    </>
  );
};

export default App;
