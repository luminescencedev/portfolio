import type { IconType } from "react-icons";
import {
  SiCss,
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
  /** width/height are the intrinsic pixel size — they reserve the box so the
   *  page never jumps when the image lands. */
  | {
      type: "image";
      src: string;
      width: number;
      height: number;
      caption?: string;
    };

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
        width: 2535,
        height: 1455,
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
        width: 2541,
        height: 1344,
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
        width: 2541,
        height: 1345,
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
    desc: "Scaffold any project in seconds",
    url: "https://github.com/luminescencedev/InitMyRepo",
    icons: [
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiNodedotjs, color: "#339933" },
      { Icon: SiNpm, color: "#CB3837" },
    ],
    caseStudy: [
      {
        type: "text",
        content:
          "Every project starts with the same ritual — scaffold the framework, add TypeScript, configure ESLint, wire up Tailwind, write the CI file, commit the initial state. It's not hard, just slow. InitMyRepo is a CLI that collapses that entire setup into a single interactive command.",
      },
      {
        type: "text",
        content:
          "The wizard walks you through a short sequence of choices: what kind of project are you building, which framework, and — for Vite-based stacks — whether you want TypeScript or JavaScript and Tailwind CSS v4 or vanilla CSS. 30 templates in total, spread across web, mobile, backend, full-stack, and monorepo. The output is not a minimal hello-world — it's a repo configured the way you'd actually want it, ready to push.",
      },
      {
        type: "image",
        src: "/projects/initmyrepo.gif",
        width: 1200,
        height: 720,
        caption: "npx initmyrepo@latest — your repo is ready in seconds.",
      },
      {
        type: "text",
        content:
          "There's also a favorites system. If you have a private template or a custom git repository you go back to often, you can save it as a favorite — give it a name, an emoji, and next time run --fav to skip the wizard entirely and jump straight to it. Favorites are stored locally via conf, no account needed.",
      },
      {
        type: "text",
        content:
          "Under the hood: TypeScript 5.6, @clack/prompts for the terminal UI, commander for the CLI surface, execa to shell out git and package manager commands, and tsup to bundle the whole thing. Available via npx, a global npm install, or Homebrew on macOS and Linux.",
      },
    ],
  },
];
