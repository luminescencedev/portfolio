import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LabExperiment } from "../../data/labExperiments";

interface LabCarouselProps {
  experiments: LabExperiment[];
  onSelect: (experiment: LabExperiment) => void;
  /** Fires whenever the centred card changes. */
  onActiveChange?: (experiment: LabExperiment) => void;
}

/** Wheel gestures are throttled to one card at a time. */
const STEP_LOCK_MS = 220;
/** How much the centred card grows over the rest. */
const ACTIVE_SCALE = 1.16;

function cardsOf(scroller: HTMLElement) {
  return Array.from(scroller.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
}

/** Index of the card closest to the middle of the scroller. */
function nearestIndex(scroller: HTMLElement) {
  const cards = cardsOf(scroller);
  const centre = scroller.scrollLeft + scroller.clientWidth / 2;

  let nearest = 0;
  let best = Infinity;

  cards.forEach((card, index) => {
    const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - centre);
    if (distance < best) {
      best = distance;
      nearest = index;
    }
  });

  return nearest;
}

/**
 * Horizontal reel, centre-anchored. The card in the middle of the screen is the
 * active one: it scales up and is the only one that opens. Clicking any other
 * card scrolls it to the centre first, so selecting always means centring. The
 * `px-[50%]` gutters are what let the first and last cards reach the middle.
 *
 * Each card carries its own double bezel — outer shell holds the padding, an
 * inset ring and the ambient shadow, inner core holds the frame.
 */
export default function LabCarousel({
  experiments,
  onSelect,
  onActiveChange,
}: LabCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lockedUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const centreOn = useCallback((card: HTMLElement, smooth: boolean) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  // Centre the first card on arrival. scrollTo rather than scrollIntoView,
  // which would also nudge the page vertically.
  useEffect(() => {
    const first = scrollerRef.current?.firstElementChild;
    if (first instanceof HTMLElement) centreOn(first, false);
  }, [experiments, centreOn]);

  // Track the centred card. Measured once per frame while scrolling, and state
  // only changes when the index actually flips.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const next = nearestIndex(scroller);
      setActiveIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    measure();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [experiments]);

  useEffect(() => {
    const active = experiments[activeIndex];
    if (active) onActiveChange?.(active);
  }, [activeIndex, experiments, onActiveChange]);

  // A vertical wheel steps one card sideways. Raw scrollLeft would fight the
  // mandatory snap, which pulls the reel back to the nearest centre.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      // Leave genuine horizontal gestures (trackpads) to the browser.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();

      const now = performance.now();
      if (now < lockedUntilRef.current) return;
      lockedUntilRef.current = now + STEP_LOCK_MS;

      const cards = cardsOf(scroller);
      if (cards.length === 0) return;

      const next = Math.min(
        Math.max(nearestIndex(scroller) + (event.deltaY > 0 ? 1 : -1), 0),
        cards.length - 1,
      );

      centreOn(cards[next], true);
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });

    return () => scroller.removeEventListener("wheel", onWheel);
  }, [centreOn]);

  return (
    <div className="-mx-4 sm:-mx-8">
      <div
        ref={scrollerRef}
        // data-lenis-prevent keeps Lenis from scrolling the page while the
        // pointer is over the reel.
        data-lenis-prevent
        className="no-scrollbar flex h-88 snap-x snap-mandatory items-center gap-10 overflow-x-auto px-[50%] sm:h-96 sm:gap-16"
      >
        {experiments.map((experiment, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={experiment.slug}
              onClick={(event) => {
                // Off-centre cards centre themselves instead of opening.
                if (isActive) onSelect(experiment);
                else centreOn(event.currentTarget, true);
              }}
              // Keyboard focus keeps the reel centred too.
              onFocus={(event) => centreOn(event.currentTarget, true)}
              aria-current={isActive || undefined}
              aria-label={`${experiment.title} — ${experiment.year}`}
              className="group shrink-0 snap-center cursor-pointer focus-visible:outline-none"
              style={{ y: experiment.card.shift ?? 0 }}
            >
              <motion.div
                className="rounded-[18px] border border-black/5 bg-black/2 p-1.5 shadow-bezel ring-1 ring-inset ring-black/5 group-focus-visible:ring-2 group-focus-visible:ring-neutral-800"
                animate={{ scale: isActive ? ACTIVE_SCALE : 1 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
              >
                <div
                  className="overflow-hidden rounded-xl border border-black/10 bg-neutral-200"
                  style={{
                    width: experiment.card.width,
                    aspectRatio: experiment.card.ratio,
                  }}
                >
                  {experiment.card.src && (
                    <img
                      src={experiment.card.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </motion.div>

            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
