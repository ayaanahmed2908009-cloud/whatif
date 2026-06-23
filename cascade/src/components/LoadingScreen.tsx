"use client";

import { useEffect, useState } from "react";

const CYCLING_LINES = [
  "Tracing the first ripple...",
  "Weighing economic consequence...",
  "Following the social fallout...",
  "Mapping technological drift...",
  "Considering the human cost...",
  "Branching into the third order...",
];

export default function LoadingScreen({ premise }: { premise: string }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % CYCLING_LINES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center">
      <BranchingAnimation />
      <div className="flex max-w-[600px] flex-col items-center gap-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
          Diverging from
        </p>
        <p className="text-[20px] leading-[32px] text-on-surface">
          “{premise}”
        </p>
        <p
          key={lineIndex}
          className="mt-4 animate-[fadeIn_0.4s_ease-in-out] text-[16px] leading-[24px] text-secondary"
        >
          {CYCLING_LINES[lineIndex]}
        </p>
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

function BranchingAnimation() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
      <circle cx="90" cy="14" r="6" fill="#020220">
        <animate attributeName="r" values="6;8;6" dur="1.6s" repeatCount="indefinite" />
      </circle>
      {[
        { x2: 30, delay: "0s" },
        { x2: 90, delay: "0.2s" },
        { x2: 150, delay: "0.4s" },
      ].map((branch, i) => (
        <g key={i}>
          <line
            x1="90"
            y1="14"
            x2={branch.x2}
            y2="70"
            stroke="#c8c5ce"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="16;0"
              dur="1.2s"
              repeatCount="indefinite"
              begin={branch.delay}
            />
          </line>
          <circle cx={branch.x2} cy="70" r="5" fill="#4648D4" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.3;0.9;0.3"
              dur="1.6s"
              repeatCount="indefinite"
              begin={branch.delay}
            />
          </circle>
          <line
            x1={branch.x2}
            y1="70"
            x2={branch.x2 + (branch.x2 - 90 === 0 ? 0 : (branch.x2 - 90) / Math.abs(branch.x2 - 90)) * 18}
            y2="126"
            stroke="#c8c5ce"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="16;0"
              dur="1.2s"
              repeatCount="indefinite"
              begin={branch.delay}
            />
          </line>
        </g>
      ))}
    </svg>
  );
}
