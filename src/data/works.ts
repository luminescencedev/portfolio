import type { IconType } from "react-icons";
import {
  SiCss,
  SiGit,
  SiGooglechrome,
  SiNodedotjs,
  SiNpm,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";

export type CaseStudyBlock =
  | { type: "text"; content: string }
  | { type: "image"; src: string; caption?: string };

export type WorkProject = {
  slug: string;
  year: string;
  title: string;
  desc: string;
  url: string;
  icons: Array<{ Icon: IconType; color: string }>;
  caseStudy: CaseStudyBlock[];
};

export const works: WorkProject[] = [
  {
    slug: "initmyfolio",
    year: "2026",
    title: "InitMyFolio",
    desc: "Portfolio generator",

    url: "https://initmyfolio.vercel.app",
    icons: [
      { Icon: SiReact, color: "#61DAFB" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiVite, color: "#646CFF" },
      { Icon: SiCss, color: "#1572B6" },
      { Icon: SiNpm, color: "#CB3837" },
    ],
    caseStudy: [
      {
        type: "text",
        content:
          "Every developer needs a portfolio, but setting one up from scratch takes hours of boilerplate — Vite config, routing, deployment, responsive layout. InitMyFolio removes all of that. You pick a template, fill in your details, and walk away with a fully deployed site.",
      },
      {
        type: "image",
        src: "/projects/initmyfolio.png",
        caption: "Template picker — choose a layout and preview it live before generating.",
      },
      {
        type: "text",
        content:
          "The generator is built with React and Vite. Templates are plain static sites that get cloned, filled with your data via a small JSON config, and pushed to Vercel in one step. No server, no database — just a CDN-ready build you own entirely.",
      },
    ],
  },
  {
    slug: "linkshelf",
    year: "",
    title: "LinkShelf",
    desc: "Save, organize and rediscover your web",
    url: "https://github.com/luminescencedev/linkshelf",
    icons: [
      { Icon: SiReact, color: "#61DAFB" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiVite, color: "#646CFF" },
      { Icon: SiTailwindcss, color: "#06B6D4" },
      { Icon: SiGooglechrome, color: "#4285F4" },
    ],
    caseStudy: [
      {
        type: "text",
        content:
          "The browser's default new tab is wasted space. LinkShelf replaces it with a full library dashboard — save any page with one click from the popup, organize resources into collections, and find them again instantly with fuzzy search powered by Fuse.js.",
      },
      {
        type: "image",
        src: "/projects/linkshelf.png",
        caption: "New tab dashboard — collections on the left, library on the right.",
      },
      {
        type: "text",
        content:
          "Built with React 18, TypeScript, Vite 6, Tailwind CSS v4, and shadcn/ui. State is managed by Zustand and synced directly to chrome.storage.local — no server, no account. The extension follows Manifest v3 with a service worker handling background tasks.",
      },
    ],
  },
  {
    slug: "carabine-ui",
    year: "",
    title: "Carabine UI",
    desc: "React component library",
    url: "https://ui.carabine.studio",
    icons: [
      { Icon: SiReact, color: "#61DAFB" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiCss, color: "#1572B6" },
      { Icon: SiNpm, color: "#CB3837" },
      { Icon: SiVite, color: "#646CFF" },
    ],
    caseStudy: [
      {
        type: "text",
        content:
          "Most component libraries are either too opinionated (hard to customize) or too bare (you rebuild everything yourself). Carabine UI sits in between — components ship with a default theme that looks polished out of the box, but every token is overridable via CSS variables.",
      },
      {
        type: "image",
        src: "/projects/carabine-ui.png",
        caption: "Component catalogue — Button, Input, Select, and Modal variants.",
      },
      {
        type: "text",
        content:
          "The library is built on React and TypeScript, bundled with Vite in library mode. Each component is unstyled at its core and layered with a default theme on top — so stripping styles is a single import away. Published to npm, docs are generated automatically from JSDoc.",
      },
    ],
  },
  {
    slug: "initmyrepo",
    year: "2025",
    title: "InitMyRepo",
    desc: "Initialize git repos with templates",
    url: "https://github.com/luminescencedev/InitMyRepo",
    icons: [
      { Icon: SiGit, color: "#F05032" },
      { Icon: SiNodedotjs, color: "#339933" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiNpm, color: "#CB3837" },
    ],
    caseStudy: [
      {
        type: "text",
        content:
          "Starting a new repo always involves the same fifteen minutes of setup: ESLint, Prettier, Husky, commit conventions, CI config. InitMyRepo collapses that into one command. Run it, pick a stack, and your repo is ready to push — with everything wired up and working.",
      },
      {
        type: "image",
        src: "/projects/initmyrepo.png",
        caption: "CLI prompt — stack selection and optional CI / commit-lint flags.",
      },
      {
        type: "text",
        content:
          "The CLI is written in Node.js and TypeScript, distributed via npm. Templates live in a separate curated repo and are fetched at generation time — so they stay up to date without requiring a new CLI release. The scaffold runs fully offline once the templates are cached.",
      },
    ],
  },
];
