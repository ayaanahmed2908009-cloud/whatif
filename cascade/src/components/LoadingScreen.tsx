"use client";

import { useEffect, useState } from "react";
import { DivergenceLevel } from "@/lib/types";

const TREE_LINES = [
  "Tracing the first ripple...",
  "Extrapolating economic divergence...",
  "Following the social fallout...",
  "Extrapolating technological divergence...",
  "Considering the human cost...",
  "Branching into the third order...",
];

const IMAGE_LINES = [
  "Rendering the first divergence...",
  "Painting the economic thread...",
  "Illustrating the social fallout...",
  "Visualizing the third order...",
];

export type LoadingPhase = "tree" | "images";

export default function LoadingScreen({
  premise,
  level,
  phase = "tree",
}: {
  premise: string;
  level: DivergenceLevel;
  phase?: LoadingPhase;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const lines = phase === "images" ? IMAGE_LINES : TREE_LINES;

  useEffect(() => {
    setLineIndex(0);
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % lines.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [lines]);

  return (
    <main className="relative flex min-h-screen flex-col bg-white text-black">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-5 sm:px-8 sm:py-6 md:px-12">
        <div className="flex items-center gap-2 text-[12px] tracking-[0.05em] sm:gap-3 sm:text-[13px]">
          <span className="font-bold">Ripplecast</span>
          <span className="hidden text-black/20 sm:inline">|</span>
          <span className="hidden uppercase tracking-[0.15em] text-black/50 sm:inline">
            Cascade Engine
          </span>
        </div>
        <span className="whitespace-nowrap rounded-full border border-black/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-black/60 sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.1em]">
          {level}
        </span>
      </header>

      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="relative z-10 flex max-w-[860px] flex-col items-center gap-8 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-black/35">
            {phase === "images" ? "Rendering visuals" : "Analyzing hypothesis"}
          </p>
          <p className="font-serif text-[40px] italic leading-[1.25] text-black sm:text-[52px] md:text-[64px]">
            &ldquo;{premise}&rdquo;
          </p>
          <div className="h-px w-12 bg-black/15" />
          <p
            key={lineIndex}
            className="animate-[fadeIn_0.5s_ease-in-out] font-serif text-[17px] italic text-black/40 sm:text-[19px]"
          >
            {lines[lineIndex]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
