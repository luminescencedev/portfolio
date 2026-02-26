import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";

type Metrics = {
  itemSize: number;
  indicatorSize: number;
  maxScroll: number;
  isHorizontal: boolean;
};

type UseMinimapReturn = {
  containerRef: React.RefObject<HTMLElement | null>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  indicatorRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number;
  scrollToIndex: (index: number) => void;
};

type UseMinimapOptions = {
  onProgress?: (progressIndex: number) => void;
};

const BREAKPOINT = 1024;
const SNAP_DELAY_MS = 140;
const SNAP_VELOCITY_EPSILON = 0.02;
const PROGRESS_EPSILON = 0.002;
const clamp = gsap.utils.clamp;
const scrollEase = gsap.parseEase("power3.out");

export const useMinimap = (
  itemCount: number,
  options?: UseMinimapOptions,
): UseMinimapReturn => {
  const initialIsHorizontal =
    typeof window !== "undefined" ? window.innerWidth < BREAKPOINT : true;
  const containerRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastScrollTsRef = useRef<number>(0);
  const snapPendingRef = useRef<boolean>(false);
  const snappedRef = useRef<boolean>(true);
  const lastProgressRef = useRef<number>(-1);
  const activeIndexRef = useRef(0);
  const onProgressRef = useRef<((progressIndex: number) => void) | undefined>(
    options?.onProgress,
  );
  const orientationRef = useRef<boolean>(initialIsHorizontal);
  const metricsRef = useRef<Metrics>({
    itemSize: 0,
    indicatorSize: 0,
    maxScroll: 0,
    isHorizontal: initialIsHorizontal,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    onProgressRef.current = options?.onProgress;
  }, [options?.onProgress]);

  const getMetrics = useCallback(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    const indicator = indicatorRef.current;

    if (!viewport || !list || !indicator) {
      return null;
    }

    const firstItem = list.querySelector<HTMLElement>("[data-item]");
    if (!firstItem) {
      return null;
    }

    const isHorizontal = window.innerWidth < BREAKPOINT;
    const itemRect = firstItem.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();

    const itemSize = isHorizontal ? itemRect.width : itemRect.height;
    const indicatorSize = isHorizontal ? indicatorRect.width : indicatorRect.height;
    const maxScroll = isHorizontal
      ? Math.max(0, list.scrollWidth - viewport.clientWidth)
      : Math.max(0, list.scrollHeight - viewport.clientHeight);

    const metrics: Metrics = {
      itemSize,
      indicatorSize,
      maxScroll,
      isHorizontal,
    };

    metricsRef.current = metrics;
    return metrics;
  }, []);

  const getTargetForIndex = useCallback((index: number) => {
    const { itemSize, indicatorSize, maxScroll } = metricsRef.current;
    if (itemSize <= 0) {
      return 0;
    }
    const offset = (indicatorSize - itemSize) / 2;
    return clamp(0, maxScroll, index * itemSize - offset);
  }, []);

  const getIndexForScroll = useCallback(
    (scroll: number) => {
      const { itemSize, indicatorSize } = metricsRef.current;
      if (itemSize <= 0) {
        return 0;
      }
      const offset = (indicatorSize - itemSize) / 2;
      const raw = (scroll + offset) / itemSize;
      return clamp(0, itemCount - 1, Math.round(raw));
    },
    [itemCount],
  );

  const getProgressForScroll = useCallback(
    (scroll: number) => {
      const { itemSize, indicatorSize } = metricsRef.current;
      if (itemSize <= 0) {
        return 0;
      }
      const offset = (indicatorSize - itemSize) / 2;
      return clamp(0, itemCount - 1, (scroll + offset) / itemSize);
    },
    [itemCount],
  );

  const setActive = useCallback((index: number) => {
    if (index === activeIndexRef.current) {
      return;
    }
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const emitProgress = useCallback(
    (progress: number) => {
      if (Math.abs(progress - lastProgressRef.current) < PROGRESS_EPSILON) {
        return;
      }
      lastProgressRef.current = progress;
      onProgressRef.current?.(progress);
    },
    [],
  );

  const snapToNearest = useCallback(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      return;
    }
    const nearest = getIndexForScroll(lenis.scroll);
    const target = getTargetForIndex(nearest);
    lenis.scrollTo(target, {
      duration: 0.45,
      easing: (t: number) => scrollEase(t),
      lock: true,
      force: true,
    });
  }, [getIndexForScroll, getTargetForIndex]);

  const destroyLenis = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    snapPendingRef.current = false;
    snappedRef.current = true;
    lastProgressRef.current = -1;
    lastScrollTsRef.current = 0;
    lenisRef.current?.destroy();
    lenisRef.current = null;
  }, []);

  const createLenis = useCallback(() => {
    destroyLenis();

    const container = containerRef.current;
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) {
      return;
    }

    const metrics = getMetrics();
    if (!metrics) {
      return;
    }

    const lenis = new Lenis({
      wrapper: viewport,
      content: list,
      eventsTarget: container ?? viewport,
      orientation: metrics.isHorizontal ? "horizontal" : "vertical",
      gestureOrientation: "both",
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 1,
      lerp: 0.13,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    orientationRef.current = metrics.isHorizontal;
    snappedRef.current = true;
    snapPendingRef.current = false;

    const initialTarget = getTargetForIndex(activeIndexRef.current);
    lenis.scrollTo(initialTarget, { immediate: true, force: true });
    emitProgress(getProgressForScroll(initialTarget));

    lenis.on("scroll", ({ scroll, velocity }) => {
      setActive(getIndexForScroll(scroll));
      emitProgress(getProgressForScroll(scroll));
      lastScrollTsRef.current = performance.now();
      snapPendingRef.current = true;
      if (Math.abs(velocity) > SNAP_VELOCITY_EPSILON) {
        snappedRef.current = false;
      }
    });

    const raf = (time: number) => {
      lenis.raf(time);
      if (
        snapPendingRef.current &&
        !snappedRef.current &&
        time - lastScrollTsRef.current > SNAP_DELAY_MS
      ) {
        snappedRef.current = true;
        snapPendingRef.current = false;
        snapToNearest();
      }
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);
  }, [
    destroyLenis,
    getIndexForScroll,
    getMetrics,
    getProgressForScroll,
    getTargetForIndex,
    emitProgress,
    snapToNearest,
    setActive,
  ]);

  const handleResize = useCallback(() => {
    const nextIsHorizontal = window.innerWidth < BREAKPOINT;
    const currentIsHorizontal = orientationRef.current;

    if (nextIsHorizontal !== currentIsHorizontal) {
      createLenis();
      return;
    }

    const lenis = lenisRef.current;
    if (!lenis) {
      createLenis();
      return;
    }

    const metrics = getMetrics();
    if (!metrics) {
      return;
    }

    lenis.resize();
    const target = getTargetForIndex(activeIndexRef.current);
    lenis.scrollTo(target, {
      immediate: true,
      force: true,
    });
    emitProgress(getProgressForScroll(target));
  }, [createLenis, emitProgress, getMetrics, getProgressForScroll, getTargetForIndex]);

  useEffect(() => {
    createLenis();

    const onResize = () => {
      handleResize();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      destroyLenis();
    };
  }, [createLenis, destroyLenis, handleResize]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const lenis = lenisRef.current;
      if (!lenis) {
        return;
      }

      const safeIndex = clamp(0, itemCount - 1, index);
      setActive(safeIndex);
      const target = getTargetForIndex(safeIndex);
      emitProgress(getProgressForScroll(target));
      snappedRef.current = true;
      snapPendingRef.current = false;

      lenis.scrollTo(target, {
        duration: 0.55,
        easing: (t: number) => scrollEase(t),
        lock: true,
        force: true,
      });
    },
    [emitProgress, getProgressForScroll, getTargetForIndex, itemCount, setActive],
  );

  return {
    containerRef,
    viewportRef,
    listRef,
    indicatorRef,
    activeIndex,
    scrollToIndex,
  };
};
