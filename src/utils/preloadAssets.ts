export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();

    // Resolve on error too — a missing asset must never block the portfolio.
    image.onload = () => resolve();
    image.onerror = () => resolve();

    image.src = src;
  });
}

export function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

interface PreloadAssetsOptions {
  assets: string[];
  onProgress?: (progress: number) => void;
}

export async function preloadAssets({
  assets,
  onProgress,
}: PreloadAssetsOptions): Promise<void> {
  const fontsReady: Promise<void> = document.fonts
    ? document.fonts.ready.then(() => undefined)
    : Promise.resolve();

  const tasks = [...assets.map((src) => preloadImage(src)), fontsReady];

  let loaded = 0;

  await Promise.all(
    tasks.map(async (task) => {
      await task;

      loaded += 1;

      onProgress?.(Math.round((loaded / tasks.length) * 100));
    }),
  );
}
