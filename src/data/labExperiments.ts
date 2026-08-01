/** The small card in the carousel — sharp-edged, varied size, staggered. */
export interface LabCardVisual {
  /** Rendered width in px. */
  width: number;
  /** CSS aspect-ratio, width / height. Below 1 is portrait. */
  ratio: number;
  /** Vertical offset in px — what breaks the row out of a flat line. */
  shift?: number;
  src?: string;
}

export interface LabExperiment {
  slug: string;
  title: string;
  year: string;
  /** Shown in the drawer, a couple of sentences at most. */
  description: string;
  card: LabCardVisual;
  /** Key in `src/lab/registry.ts` — the playable demo. Omit while sketching. */
  component?: string;
  tags?: string[];
}

/**
 * Added one at a time. Each entry is one card in the carousel and one drawer.
 * While this is empty the hub falls back to PLACEHOLDER_CARDS.
 */
export const labExperiments: LabExperiment[] = [];

/**
 * Grey stand-ins so the carousel and drawer stay judgeable — and scrollable —
 * before there is any content. Delete once the reel has real cards.
 */
const PLACEHOLDER_SHAPES: LabCardVisual[] = [
  { width: 112, ratio: 5 / 6, shift: 16 },
  { width: 176, ratio: 1, shift: -20 },
  { width: 128, ratio: 3 / 4, shift: 8 },
  { width: 104, ratio: 4 / 5, shift: -12 },
  { width: 144, ratio: 5 / 4, shift: 18 },
  { width: 96, ratio: 1, shift: -6 },
  { width: 160, ratio: 4 / 5, shift: 10 },
  { width: 120, ratio: 1, shift: -14 },
  { width: 136, ratio: 6 / 5, shift: 20 },
  { width: 104, ratio: 3 / 4, shift: -8 },
  { width: 152, ratio: 1, shift: 12 },
  { width: 112, ratio: 5 / 4, shift: -18 },
];

export const PLACEHOLDER_CARDS: LabExperiment[] = PLACEHOLDER_SHAPES.map(
  (card, index) => ({
    slug: `soon-${index + 1}`,
    title: "Untitled",
    year: "2026",
    description: "Nothing here yet.",
    card,
  }),
);
