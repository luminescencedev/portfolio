import Link from "next/link";

export default function HowIBuiltAUILibrary() {
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
            how I built a UI library
          </h1>
          <p className="text-sm text-gray-400">May 2026 · 8 min read</p>
        </div>

        {/* Article body */}
        <div className="flex flex-col gap-6 text-sm text-gray-600 leading-7">
          <p>
            I started{" "}
            <a
              href="https://ui.carabine.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
            >
              carabine/ui
            </a>{" "}
            because I kept rebuilding the same components across every project —
            a dialog here, a dropdown there, always fighting with accessibility
            and keyboard navigation. I wanted something that worked out of the
            box but didn't lock me into a design system I'd eventually fight
            against.
          </p>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">the core idea</h2>
            <p>
              Most component libraries make you choose: either fully styled
              (opinionated, hard to customize) or fully headless (you own
              everything, a lot of work). I wanted a middle ground — styled by
              default with sane defaults, but easy to override or go headless
              when the design requires it.
            </p>
            <p>
              The API ended up as: every component ships with default styles,
              but exposes a{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                unstyled
              </code>{" "}
              prop and a clean className API so you can restyle from scratch
              without fighting specificity.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">
              building on Radix
            </h2>
            <p>
              Writing accessible components from scratch — focus trapping,
              screen reader announcements, keyboard navigation — is genuinely
              hard and time-consuming to get right. Radix Primitives solved this
              perfectly: purely behavioral, zero styles. I layered my design
              system on top of it.
            </p>
            <p>
              This meant I could ship a fully accessible Dialog, DropdownMenu,
              and Select on day one, and spend my time on design and API rather
              than ARIA attributes.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">tooling</h2>
            <p>
              The build pipeline uses{" "}
              <strong className="text-gray-800 font-medium">tsup</strong> — it
              compiles to both CJS and ESM with a single config, handles
              declaration files, and is fast enough that I never think about it.
              TypeScript strict mode throughout. Tailwind CSS for the default
              styles.
            </p>
            <p>
              For testing, I use Vitest + Testing Library. Not extensive
              coverage yet — mostly smoke tests and interaction tests for the
              trickier components like combobox.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">
              publishing to npm
            </h2>
            <p>
              The package is scoped under{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                @carabine/ui
              </code>
              . Getting the exports field right in{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                package.json
              </code>{" "}
              was the most painful part — making sure both ESM and CJS consumers
              get proper types, that tree-shaking works, and that bundlers don't
              get confused. The key was splitting the exports config carefully
              and using{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                moduleResolution: bundler
              </code>{" "}
              in TypeScript.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">
              what I'd do differently
            </h2>
            <p>
              I'd invest in a proper docs site earlier. I built it much later
              than I should have, and a lot of early friction for potential
              users came from poor documentation rather than the library itself.
            </p>
            <p>
              I'd also think harder about the theming story from day one. CSS
              custom properties work well, but the integration with Tailwind CSS
              v4 changed the calculus significantly — you can express far more
              in the theme config now.
            </p>
          </div>

          <p className="text-gray-400 text-xs pt-2 border-t border-gray-100">
            carabine/ui is{" "}
            <a
              href="https://github.com/luminescencedev/ui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors underline underline-offset-2"
            >
              open source
            </a>
            . docs at{" "}
            <a
              href="https://ui.carabine.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors underline underline-offset-2"
            >
              ui.carabine.studio
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
