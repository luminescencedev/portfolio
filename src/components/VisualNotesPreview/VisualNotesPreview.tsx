import { useNavigate } from "react-router";
import { visualNotes } from "../../data/visualNotes";

const MAX_ITEMS = 2;

export default function VisualNotesPreview() {
  const navigate = useNavigate();
  const preview = visualNotes.slice(0, MAX_ITEMS);

  // Nothing to show yet — the section stays out of the layout entirely.
  if (preview.length === 0) return null;

  return (
    <section className="mb-12 w-full rounded-2xl p-4" aria-label="Visual notes">
      <div className="mb-3 flex items-baseline justify-between px-2">
        <h2 className="text-sm font-medium text-neutral-800">Visual notes</h2>
        <button
          onClick={() => navigate("/visual-notes")}
          className="cursor-pointer rounded-sm text-sm text-neutral-400 transition-colors hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
        >
          View all →
        </button>
      </div>

      <p className="mb-3 px-2 text-sm leading-relaxed text-neutral-500">
        Things I notice outside the screen.
      </p>

      <div className="grid grid-cols-2 gap-3 px-2">
        {preview.map((note) => (
          <img
            key={note.id}
            src={note.src}
            alt={note.alt}
            width={note.width}
            height={note.height}
            loading="lazy"
            decoding="async"
            className="w-full rounded-xl border border-neutral-200 object-cover"
            style={{ aspectRatio: `${note.width} / ${note.height}` }}
          />
        ))}
      </div>
    </section>
  );
}
