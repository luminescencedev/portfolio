import Link from "next/link";

export default function CarabineUI() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 font-sans">
      <div className="w-full max-w-sm py-16 flex flex-col gap-10">
        {/* Back */}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← home
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-normal tracking-tight text-black">
            carabine/ui
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            UI component library for React — styled by default, headless when
            you want. Ships with accessible, themeable components built on Radix
            primitives.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <a
              href="https://ui.carabine.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              docs ↗
            </a>
            <a
              href="https://github.com/luminescencedev/ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              github ↗
            </a>
            <a
              href="https://www.npmjs.com/package/@carabine/ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              npm ↗
            </a>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 text-sm text-gray-600 leading-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">what it is</h2>
            <p>
              A component library that gives you fully styled, accessible
              components out of the box, with an escape hatch to go fully
              headless when your design requires it. Every component exposes an{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                unstyled
              </code>{" "}
              prop and a clean className API.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">stack</h2>
            <p>
              Built on top of Radix Primitives for accessibility (focus
              trapping, keyboard navigation, ARIA). Styled with Tailwind CSS v4.
              Ships as both ESM and CJS via tsup, with full TypeScript
              declarations.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">status</h2>
            <p>
              Active development. Currently at v0.2.4. Used in production across
              carabine.studio and other personal projects.
            </p>
          </div>
        </div>

        {/* Writing link */}
        <div className="pt-2 border-t border-gray-100">
          <Link
            href="/how-i-built-a-ui-library"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            read: how I built a UI library →
          </Link>
        </div>
      </div>
    </main>
  );
}
