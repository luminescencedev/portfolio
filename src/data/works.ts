import type { IconType } from "react-icons";
import {
  SiCss,
  SiGit,
  SiGooglechrome,
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiNpm,
  SiReact,
  SiTypescript,
  SiVite,
} from "react-icons/si";

export type WorkProject = {
  slug: string;
  year: string;
  title: string;
  desc: string;
  longDesc: string;
  url: string;
  icons: Array<{ Icon: IconType; color: string }>;
  images: string[];
};

const ALL_IMAGES = [
  "/projects/initmyfolio.png",
  "/projects/linkshelf.png",
  "/projects/carabine-ui.png",
  "/projects/initmyrepo.png",
];

export const works: WorkProject[] = [
  {
    slug: "initmyfolio",
    year: "2026",
    title: "InitMyFolio",
    desc: "Portfolio generator",
    longDesc:
      "InitMyFolio lets developers spin up a personal portfolio in seconds. Pick a template, fill in your info, and get a fully deployed site — no config, no boilerplate. Built with React and Vite, it generates a static site you can drop on any CDN.",
    url: "https://initmyfolio.vercel.app",
    icons: [
      { Icon: SiReact, color: "#61DAFB" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiVite, color: "#646CFF" },
      { Icon: SiCss, color: "#1572B6" },
      { Icon: SiNpm, color: "#CB3837" },
    ],
    images: ALL_IMAGES,
  },
  {
    slug: "linkshelf",
    year: "2026",
    title: "LinkShelf",
    desc: "Extension for bookmarking",
    longDesc:
      "LinkShelf is a browser extension that replaces the default new tab with a clean, minimal bookmark manager. Save links with one click, organize them into shelves, and find them instantly — all without leaving the browser.",
    url: "https://github.com/luminescencedev/linkshelf",
    icons: [
      { Icon: SiJavascript, color: "#F7DF1E" },
      { Icon: SiHtml5, color: "#E34F26" },
      { Icon: SiCss, color: "#1572B6" },
      { Icon: SiGooglechrome, color: "#4285F4" },
    ],
    images: ALL_IMAGES,
  },
  {
    slug: "carabine-ui",
    year: "2026",
    title: "Carabine UI",
    desc: "React component library",
    longDesc:
      "Carabine UI is an opinionated React component library focused on developer experience and visual polish. Components are unstyled at their core but ship with a default theme that's easy to override — designed to look good out of the box without getting in the way.",
    url: "https://ui.carabine.studio",
    icons: [
      { Icon: SiReact, color: "#61DAFB" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiCss, color: "#1572B6" },
      { Icon: SiNpm, color: "#CB3837" },
      { Icon: SiVite, color: "#646CFF" },
    ],
    images: ALL_IMAGES,
  },
  {
    slug: "initmyrepo",
    year: "2025",
    title: "InitMyRepo",
    desc: "Initialize git repos with templates",
    longDesc:
      "InitMyRepo is a CLI tool that scaffolds new Git repositories from curated templates. Run one command, pick a stack, and get a repo with CI, linting, and commit conventions already wired up — so you can start shipping instead of configuring.",
    url: "https://github.com/luminescencedev/InitMyRepo",
    icons: [
      { Icon: SiGit, color: "#F05032" },
      { Icon: SiNodedotjs, color: "#339933" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiNpm, color: "#CB3837" },
    ],
    images: ALL_IMAGES,
  },
];
