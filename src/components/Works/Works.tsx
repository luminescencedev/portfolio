import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { works } from "../../data/works";
import type { WorkProject } from "../../data/works";

export type { WorkProject };

type IconParticle = {
  id: number;
  Icon: WorkProject["icons"][number]["Icon"];
  color: string;
  dx: number;
  dy: number;
  delay: number;
};

function makeParticles(icons: WorkProject["icons"]): IconParticle[] {
  const n = icons.length;
  return icons.map(({ Icon, color }, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const angleDeg = (t - 0.5) * 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const dist = i % 2 === 0 ? 30 : 42;
    const jitter = (Math.random() - 0.5) * 6;
    return {
      id: i,
      Icon,
      color,
      dx: Math.cos(angleRad) * dist + 14 + jitter,
      dy: Math.sin(angleRad) * dist + jitter,
      delay: i * 0.05,
    };
  });
}

export default function Works() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [particles, setParticles] = useState<IconParticle[]>([]);
  const [particleKey, setParticleKey] = useState(0);
  const bgY = useMotionValue(0);

  const handleEnter = (index: number) => {
    const nextY = index * 40;
    if (hoveredIndex === null) bgY.set(nextY);
    else animate(bgY, nextY, { type: "spring", stiffness: 420, damping: 38 });
    setHoveredIndex(index);
    setParticleKey((k) => k + 1);
    setParticles(makeParticles(works[index].icons));
  };

  return (
    <section className="w-full rounded-2xl p-4 mb-12 text-neutral-800" aria-label="Selected work">
      <h2 className="mb-3 px-2 text-sm font-medium text-neutral-800">Projects</h2>

      <ul className="relative" onMouseLeave={() => setHoveredIndex(null)}>
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

        <AnimatePresence>
          {hoveredIndex !== null &&
            particles.map((p) => (
              <motion.span
                key={`${particleKey}-${p.id}`}
                aria-hidden="true"
                className="pointer-events-none absolute select-none"
                style={{ right: 0, top: hoveredIndex * 40 + 20, translateY: "-50%" }}
                initial={{ x: 0, opacity: 0, scale: 0.2 }}
                animate={{ x: p.dx, y: p.dy, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.1 } }}
                transition={{ type: "spring", stiffness: 340, damping: 20, delay: p.delay }}
              >
                <p.Icon size={13} color={p.color} />
              </motion.span>
            ))}
        </AnimatePresence>

        {works.map((item, index) => (
          <li key={item.slug}>
            <button
              onClick={() => navigate(`/work/${item.slug}`)}
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
