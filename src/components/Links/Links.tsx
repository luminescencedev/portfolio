import { ArrowUpRight } from "lucide-react";

export default function Links() {
  return (
    <section className="w-full rounded-2xl p-4" aria-label="Links">
      <p className="px-2 text-sm leading-relaxed text-neutral-500">
        You can reach me via email at{" "}
        <a
          href="mailto:arthur.garnier1090@gmail.com"
          className="inline-flex items-center gap-0.5 text-neutral-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 rounded-sm"
        >
          arthur.garnier1090@gmail.com
          <ArrowUpRight size={11} className="shrink-0" />
        </a>
        {" "}or check my work on my{" "}
        <a
          href="https://github.com/luminescencedev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-neutral-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 rounded-sm"
        >
          github
          <ArrowUpRight size={11} className="shrink-0" />
        </a>
        .
      </p>
    </section>
  );
}
