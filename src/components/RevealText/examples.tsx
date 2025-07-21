import { RevealText } from "../index";

const RevealTextExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">RevealText Examples</h2>

      {/* Character reveal from up */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Character Reveal (Up)
        </h3>
        <RevealText
          className="text-4xl font-bold text-blue-600"
          splitBy="chars"
          direction="up"
          duration={0.8}
          stagger={0.05}
          trigger="auto"
        >
          Hello World
        </RevealText>
      </div>

      {/* Word reveal from left */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Word Reveal (Left)
        </h3>
        <RevealText
          className="text-3xl font-medium text-green-600"
          splitBy="words"
          direction="left"
          duration={0.6}
          stagger={0.1}
          delay={0.5}
          trigger="auto"
        >
          This is a word-by-word reveal animation
        </RevealText>
      </div>

      {/* Line reveal from down */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Line Reveal (Down)
        </h3>
        <RevealText
          className="text-xl text-purple-600 max-w-md"
          splitBy="lines"
          direction="down"
          duration={0.8}
          stagger={0.3}
          delay={1}
          trigger="auto"
        >
          {`This is line one\nThis is line two\nThis is line three`}
        </RevealText>
      </div>

      {/* Hover triggered reveal */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Hover to Reveal</h3>
        <RevealText
          className="text-2xl font-bold text-red-600 cursor-pointer border-2 border-red-200 p-4 rounded"
          splitBy="chars"
          direction="up"
          duration={0.5}
          stagger={0.03}
          trigger="hover"
        >
          Hover me!
        </RevealText>
      </div>

      {/* Scroll triggered reveal */}
      <div className="space-y-2 mt-20">
        <h3 className="text-lg font-semibold text-gray-700">
          Scroll to Reveal
        </h3>
        <RevealText
          className="text-3xl font-bold text-orange-600"
          splitBy="words"
          direction="right"
          duration={0.7}
          stagger={0.1}
          trigger="visible"
          animateOnScroll={true}
        >
          Scroll down to see this animation
        </RevealText>
      </div>
    </div>
  );
};

export default RevealTextExamples;
