import Link from "next/link";

const projects = [
  {
    name: "carabine/ui",
    description:
      "UI component library for React — styled by default, headless when you want.",
    href: "/carabine-ui",
  },
  {
    name: "linkshelf",
    description:
      "A Chrome extension to save, tag, and rediscover web resources.",
    href: "/linkshelf",
  },
];

const articles = [
  {
    title: "how I built a UI library",
    date: "May 2026",
    href: "/how-i-built-a-ui-library",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 font-sans">
      <div className="w-full max-w-sm py-16 flex flex-col gap-14">
        {/* Identity */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-normal tracking-tight text-black">
            Arthur
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Software engineer focused on interfaces and developer tooling. I
            build open-source React libraries, Chrome extensions, and the
            occasional side project. Based in France.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a
              href="https://github.com/luminescencedev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              github ↗
            </a>
          </div>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              projects
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                className="flex flex-col gap-1 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
              >
                <span className="text-sm font-medium text-black group-hover:text-gray-700 transition-colors">
                  {project.name}
                </span>
                <span className="text-xs text-gray-500">
                  {project.description}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Writing */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              writing
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="flex items-baseline justify-between gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
              >
                <span className="text-sm text-black group-hover:text-gray-700 transition-colors">
                  {article.title}
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {article.date}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
