import { useEffect } from "react";

/**
 * Drops the dithered background layer for as long as the calling page is
 * mounted, leaving flat white. The fade itself lives in `index.css` and is
 * timed to the page transition, so both move together.
 */
export function usePlainBackground() {
  useEffect(() => {
    document.body.dataset.background = "plain";

    return () => {
      delete document.body.dataset.background;
    };
  }, []);
}
