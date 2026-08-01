export interface VisualNote {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  location?: string;
  date?: string;
  /** Intrinsic size — used to reserve space before the image loads. */
  width: number;
  height: number;
}

/**
 * A short editorial selection (aim for 6–12 images), not a photo gallery.
 * Drop the files in `public/images/visual-notes/` and add an entry here.
 *
 * Example:
 * {
 *   id: "signage-01",
 *   src: "/images/visual-notes/signage-01.avif",
 *   alt: "Enamel street sign on a white wall",
 *   caption: "Signage",
 *   location: "Paris",
 *   date: "2026",
 *   width: 1600,
 *   height: 1200,
 * }
 */
export const visualNotes: VisualNote[] = [];
