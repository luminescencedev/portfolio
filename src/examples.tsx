import { RevealText, MaskRevealText } from "./components";

const ExamplePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          Text Reveal Components
        </h1>

        {/* Standard RevealText Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Standard RevealText
          </h2>

          <div className="space-y-8">
            {/* Characters from up */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Character reveal from up
              </h3>
              <RevealText
                className="text-6xl font-bold text-blue-600"
                splitBy="chars"
                direction="up"
                duration={1}
                stagger={0.05}
                delay={0.2}
                trigger="auto"
              >
                AWWWARDS
              </RevealText>
            </div>

            {/* Words from left */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Words reveal from left
              </h3>
              <RevealText
                className="text-3xl font-medium text-green-600"
                splitBy="words"
                direction="left"
                duration={0.8}
                stagger={0.1}
                delay={0.5}
                trigger="auto"
              >
                Beautiful text animations with GSAP
              </RevealText>
            </div>

            {/* Lines from down */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Lines reveal from down
              </h3>
              <RevealText
                className="text-xl text-purple-600 max-w-md leading-relaxed"
                splitBy="lines"
                direction="down"
                duration={1}
                stagger={0.3}
                delay={1}
                trigger="auto"
              >
                {`Line one reveals first\nThen comes line two\nFinally the third line appears`}
              </RevealText>
            </div>
          </div>
        </section>

        {/* Mask RevealText Examples */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Mask RevealText (Awwwards Style)
          </h2>

          <div className="space-y-8">
            {/* Mask slide up effect */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Mask slide reveal (up)
              </h3>
              <MaskRevealText
                className="text-5xl font-bold text-orange-600"
                splitBy="chars"
                direction="up"
                maskEffect="slide"
                duration={1.2}
                stagger={0.05}
                delay={0.3}
                trigger="auto"
              >
                MASKED
              </MaskRevealText>
            </div>

            {/* Mask slide from right */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Mask slide from right
              </h3>
              <MaskRevealText
                className="text-3xl font-semibold text-red-600"
                splitBy="words"
                direction="right"
                maskEffect="slide"
                duration={1}
                stagger={0.1}
                delay={0.6}
                trigger="auto"
              >
                Premium Animation Effects
              </MaskRevealText>
            </div>

            {/* Wave effect */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Wave mask effect
              </h3>
              <MaskRevealText
                className="text-4xl font-bold text-indigo-600"
                splitBy="chars"
                direction="up"
                maskEffect="wave"
                duration={1.5}
                stagger={0.04}
                delay={1}
                trigger="auto"
              >
                WAVE EFFECT
              </MaskRevealText>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Interactive Examples
          </h2>

          <div className="space-y-8">
            {/* Hover trigger */}
            <div>
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Hover to reveal
              </h3>
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
                <RevealText
                  className="text-3xl font-bold text-pink-600 cursor-pointer"
                  splitBy="chars"
                  direction="up"
                  duration={0.6}
                  stagger={0.03}
                  trigger="hover"
                >
                  Hover Me!
                </RevealText>
              </div>
            </div>

            {/* Scroll trigger */}
            <div className="mt-32">
              <h3 className="text-lg font-medium text-gray-600 mb-4">
                Scroll to reveal
              </h3>
              <MaskRevealText
                className="text-4xl font-bold text-emerald-600"
                splitBy="words"
                direction="left"
                maskEffect="slide"
                duration={1}
                stagger={0.1}
                trigger="visible"
              >
                Scroll Animation Triggered!
              </MaskRevealText>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamplePage;
