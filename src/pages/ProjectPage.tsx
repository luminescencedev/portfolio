import { motion } from "motion/react";
import { TbArrowBack } from "react-icons/tb";
import { useNavigate, useParams } from "react-router";
import CustomCursor from "../components/CustomCursor";
import { works } from "../data/works";

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = works.find((w) => w.slug === slug);

  if (!project) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-8 sm:py-24 flex items-center justify-center">
        <p className="font-mono text-[10px] text-neutral-400">projet introuvable.</p>
      </main>
    );
  }

  return (
    <motion.main
      className="min-h-screen px-4 py-12 sm:px-8 sm:py-24"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <CustomCursor />

      <div className="flex w-full">
        <div className="flex-1" />
        <div className="w-full max-w-140 shrink-0 flex flex-col gap-10">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors w-fit px-2 cursor-pointer"
            aria-label="Home"
          >
            <TbArrowBack size={15} style={{ strokeWidth: 1.5 }} />
            <span className="text-sm">Home</span>
          </button>

          <div className="px-2 flex flex-col gap-2">
            {project.year && (
              <p className="text-sm text-neutral-400">{project.year}</p>
            )}
            <h1 className="text-sm font-medium text-neutral-800">{project.title}</h1>
            <p className="text-sm text-neutral-400">{project.desc}</p>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex gap-3 items-center">
              {project.icons.map(({ Icon, color }, i) => (
                <Icon key={i} size={13} color={color} />
              ))}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              visit ↗
            </a>
          </div>

          <div className="flex flex-col gap-8 pb-12">
            {project.caseStudy.map((block, i) =>
              block.type === "text" ? (
                <p key={i} className="px-2 text-sm leading-loose text-neutral-500">
                  {block.content}
                </p>
              ) : (
                <figure key={i} className="flex flex-col gap-2">
                  <img
                    src={block.src}
                    alt={block.caption ?? project.title}
                    className="w-full rounded-xl border border-neutral-200 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {block.caption && (
                    <figcaption className="px-2 text-xs text-neutral-400">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )
            )}
          </div>

        </div>
        <div className="flex-1" />
      </div>
    </motion.main>
  );
}
