import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";

export function useLocomotiveScroll() {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      },
    });

    return () => {
      scroll.destroy();
    };
  }, []);
}
