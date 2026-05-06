export default function About() {
  return (
    <section
      className="w-full rounded-2xl p-4"
      aria-label="About Arthur Garnier"
    >
      <div className="mb-20">
        <h1 className="px-2 text-sm font-medium text-neutral-800">Arthur Garnier</h1>
        <p className="px-2 text-sm text-neutral-500">Frontend engineer</p>
      </div>

      <h2 className="mb-3 px-2 text-sm font-medium text-neutral-800">Today</h2>

      <div className="space-y-3 px-2 mb-12">
        <p className="text-sm leading-relaxed text-neutral-500">
          I work as an intern on{" "}
          <a
            href="https://biokortex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-sm"
          >
            Biokortex
          </a>
          's development team. I like to design and build interfaces and apps
          I'd want to use.
        </p>
        <p className="text-sm leading-relaxed text-neutral-500">
          Currently studying at{" "}
          <a
            href="https://efrei.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-sm"
          >
            Efrei Paris
          </a>
          .
        </p>
      </div>
    </section>
  );
}
