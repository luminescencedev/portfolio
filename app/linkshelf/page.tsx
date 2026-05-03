import Link from "next/link";

export default function Linkshelf() {
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
            linkshelf
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            A Chrome extension that replaces your new tab with a personal
            library. Save, tag, and rediscover web resources with fuzzy search.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <a
              href="https://github.com/luminescencedev/linkshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              github ↗
            </a>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 text-sm text-gray-600 leading-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">what it is</h2>
            <p>
              Every time you open a new tab you see your saved links instead of
              a blank page. A popup lets you save the current page in one click.
              Tags and fuzzy search make it fast to find anything later.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">stack</h2>
            <p>
              React 18 + TypeScript + Vite. Tailwind CSS v4 for styling.
              Zustand for state synced to{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                chrome.storage.local
              </code>
              . Fuse.js for fuzzy search. Built as a Manifest v3 extension.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-black">how to install</h2>
            <ol className="flex flex-col gap-1 list-decimal list-inside text-gray-500">
              <li>Clone the repo and run <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">pnpm build</code></li>
              <li>Open <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">chrome://extensions</code></li>
              <li>Enable Developer mode</li>
              <li>Load unpacked → select the <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">dist/</code> folder</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
