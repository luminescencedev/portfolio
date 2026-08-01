import type { ComponentType, LazyExoticComponent } from "react";

/**
 * Playable demos, keyed by the `component` field of `labExperiments.ts`. Each
 * one is a `lazy(() => import("./MyExperiment"))` so a heavy prototype never
 * lands in the initial bundle.
 *
 * Empty for now — filled one experiment at a time.
 */
export const labRegistry: Record<
  string,
  LazyExoticComponent<ComponentType>
> = {};
