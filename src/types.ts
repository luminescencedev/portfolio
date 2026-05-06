// Re-export from store — single source of truth
export type { Project } from "./cursorStore";

/** @deprecated use Project from cursorStore */
export type ActiveProject = import("./cursorStore").Project | null;
