import { create } from "zustand";

export type Project = {
  title: string;
  image: string;
};

type CursorState = {
  // null = no project hovered, cursor shows coords
  activeProject: Project | null;
};

type CursorActions = {
  setActiveProject: (project: Project | null) => void;
  clearActiveProject: () => void;
};

export const useCursorStore = create<CursorState & CursorActions>((set) => ({
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  clearActiveProject: () => set({ activeProject: null }),
}));
