"use client";

import Image from "next/image";
import { useEffect } from "react";
import Lenis from "lenis";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-zinc-100">
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg bg-white">
          {/* Hero Section */}
          <div className="relative z-10 h-screen flex flex-col justify-end items-end px-2 lg:px-6">
            <div className="absolute inset-0">
              <Image
                src="/onev1.png"
                alt="Background"
                fill
                className="object-cover hidden lg:block lg:opacity-60 lg:scale-140 xl:scale-120 2xl:scale-100"
                priority
              />
            </div>
            <div className="h-[7vh] w-full absolute bottom-0 left-0 bg-gradient-to-t from-white to-transparent"></div>
            <h1 className="text-[7rem] lg:text-[13rem] font-[jenson-italic] leading-[0.7] text-zinc-900 z-10 text-right">
              ART
              <span className="font-[PPMondwest] text-[5rem] lg:text-[9rem]">
                ⚗✨
              </span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
