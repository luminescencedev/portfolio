import { animate, motion, useMotionValue } from "motion/react";
import { useState } from "react";
import { useCursorStore } from "../../cursorStore";

const works = [
  {
    year: "2026",
    title: "InitMyFolio",
    desc: "Portfolio generator",
    image: "/projects/initmyfolio.png",
    url: "https://initmyfolio.vercel.app",
  },
  {
    year: "",
    title: "LinkShelf",
    desc: "Extension for bookmarking",
    image: "/projects/linkshelf.png",
    url: "https://github.com/luminescencedev/linkshelf",
  },
  {
    year: "",
    title: "Carabine UI",
    desc: "React component library",
    image: "/projects/carabine-ui.png",
    url: "https://ui.carabine.studio",
  },
  {
    year: "2025",
    title: "InitMyRepo",
    desc: "Initialize git repos with templates",
    image: "/projects/initmyrepo.png",
    url: "https://github.com/luminescencedev/InitMyRepo",
  },
];

export default function Works() {
  const [hovered, setHovered] = useState<number | null>(null);
  const setActiveProject = useCursorStore((s) => s.setActiveProject);
  const clearActiveProject = useCursorStore((s) => s.clearActiveProject);

  const bgY = useMotionValue(0);

  const handleEnter = (index: number) => {
    const nextY = index * 40;
    if (hovered === null) {
      bgY.set(nextY);
    } else {
      animate(bgY, nextY, { type: "spring", stiffness: 420, damping: 38 });
    }
    setHovered(index);
    setActiveProject({ title: works[index].title, image: works[index].image });
  };

  const handleLeave = () => {
    setHovered(null);
    clearActiveProject();
  };

  return (
    <section className="w-full rounded-2xl p-4 mb-12 text-neutral-800" aria-label="Selected work">
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute size-0 overflow-hidden"
      >
        {works.map((item) => (
          <img key={item.image} src={item.image} alt="" decoding="async" fetchPriority="high" />
        ))}
      </div>

      <h2 className="mb-3 px-2 text-sm font-medium text-neutral-800">
        Projects
      </h2>

      <ul className="relative" onMouseLeave={handleLeave}>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 h-10 rounded-xl bg-black/5"
          style={{ y: bgY }}
          animate={{
            opacity: hovered === null ? 0 : 1,
            scale: hovered === null ? 0.96 : 1,
          }}
          transition={{
            opacity: { duration: 0.18, ease: "easeOut" },
            scale: { duration: 0.22, ease: "easeOut" },
          }}
        />

        {works.map((item, index) => (
          <li key={item.title}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title} — ${item.desc}`}
              onMouseEnter={() => handleEnter(index)}
              className="relative z-10 grid h-10 items-center gap-2 rounded-xl px-2
                grid-cols-[1fr_auto]
                sm:grid-cols-[44px_1fr_auto]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
            >
              <span className="hidden sm:block text-sm text-neutral-400">{item.year}</span>
              <span className="text-sm font-medium text-neutral-800">{item.title}</span>
              <span className="truncate text-right text-sm text-neutral-400">{item.desc}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
