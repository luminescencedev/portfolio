import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useRef, useState } from "react";

export type WorkProject = {
  year: string;
  title: string;
  desc: string;
  url: string;
  icons: string[];
  images: string[];
};

const works: WorkProject[] = [
  {
    year: "2026",
    title: "InitMyFolio",
    desc: "Portfolio generator",
    url: "https://initmyfolio.vercel.app",
    icons: ["React", "TS", "Vite", "✦", "◆", "CSS"],
    images: ["/projects/initmyfolio.png"],
  },
  {
    year: "",
    title: "LinkShelf",
    desc: "Extension for bookmarking",
    url: "https://github.com/luminescencedev/linkshelf",
    icons: ["JS", "HTML", "CSS", "⬡", "✧", "Ext"],
    images: ["/projects/linkshelf.png"],
  },
  {
    year: "",
    title: "Carabine UI",
    desc: "React component library",
    url: "https://ui.carabine.studio",
    icons: ["React", "TS", "CSS", "◈", "✦", "UI"],
    images: ["/projects/carabine-ui.png"],
  },
  {
    year: "2025",
    title: "InitMyRepo",
    desc: "Initialize git repos with templates",
    url: "https://github.com/luminescencedev/InitMyRepo",
    icons: ["CLI", "Git", "Node", "◆", "✧", "TS"],
    images: ["/projects/initmyrepo.png"],
  },
];

type IconParticle = {
  id: number;
  label: string;
  dx: number;
  dy: number;
  delay: number;
};

function makeParticles(icons: string[]): IconParticle[] {
  return icons.map((label, i) => ({
    id: i,
    label,
    dx: 14 + Math.random() * 56,
    dy: (Math.random() - 0.5) * 56,
    delay: i * 0.045,
  }));
}

interface WorksProps {
  onProjectOpen: (project: WorkProject) => void;
}

export default function Works({ onProjectOpen }: WorksProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [particles, setParticles] = useState<IconParticle[]>([]);
  const particleKey = useRef(0);

  const bgY = useMotionValue(0);

  const handleEnter = (index: number) => {
    const nextY = index * 40;
    if (hoveredIndex === null) {
      bgY.set(nextY);
    } else {
      animate(bgY, nextY, { type: "spring", stiffness: 420, damping: 38 });
    }
    setHoveredIndex(index);
    particleKey.current += 1;
    setParticles(makeParticles(works[index].icons));
  };

  const handleLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="w-full rounded-2xl p-4 mb-12 text-neutral-800" aria-label="Selected work">
      <h2 className="mb-3 px-2 text-sm font-medium text-neutral-800">Projects</h2>

      <ul className="relative" onMouseLeave={handleLeave}>
        {/* hover background pill */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 h-10 rounded-xl bg-black/5"
          style={{ y: bgY }}
          animate={{
            opacity: hoveredIndex === null ? 0 : 1,
            scale: hoveredIndex === null ? 0.96 : 1,
          }}
          transition={{
            opacity: { duration: 0.18, ease: "easeOut" },
            scale: { duration: 0.22, ease: "easeOut" },
          }}
        />

        {/* confetti icon particles */}
        <AnimatePresence>
          {hoveredIndex !== null &&
            particles.map((p) => (
              <motion.span
                key={`${particleKey.current}-${p.id}`}
                aria-hidden="true"
                className="pointer-events-none absolute font-mono text-[9px] text-neutral-400 whitespace-nowrap select-none"
                style={{
                  right: 0,
                  top: hoveredIndex * 40 + 20,
                  translateY: "-50%",
                }}
                initial={{ x: 0, opacity: 0, scale: 0.4 }}
                animate={{ x: p.dx, y: p.dy, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.12 } }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 22,
                  delay: p.delay,
                }}
              >
                {p.label}
              </motion.span>
            ))}
        </AnimatePresence>

        {works.map((item, index) => (
          <li key={item.title}>
            <button
              onClick={() => onProjectOpen(item)}
              onMouseEnter={() => handleEnter(index)}
              aria-label={`${item.title} — ${item.desc}`}
              className="relative z-10 grid h-10 w-full items-center gap-2 rounded-xl px-2 text-left cursor-pointer
                grid-cols-[1fr_auto]
                sm:grid-cols-[44px_1fr_auto]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
            >
              <span className="hidden sm:block text-sm text-neutral-400">{item.year}</span>
              <span className="text-sm font-medium text-neutral-800">{item.title}</span>
              <span className="truncate text-right text-sm text-neutral-400">{item.desc}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
