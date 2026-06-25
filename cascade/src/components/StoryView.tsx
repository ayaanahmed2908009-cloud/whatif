"use client";

import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { CascadeNode, DivergenceLevel } from "@/lib/types";
import { imageForId } from "@/lib/visuals";
import { getCachedNodeImage, requestNodeImage } from "@/lib/nodeImage";

const PROBABILITY_DOT: Record<CascadeNode["probability"], string> = {
  likely: "bg-likely",
  possible: "bg-possible",
  speculative: "bg-speculative",
};

export default function StoryView({
  node,
  siblings,
  index,
  depth,
  premise,
  level,
  visitedIds,
  canGoBack,
  onPrev,
  onNext,
  onDescend,
  onBack,
  onShowMap,
  onExit,
}: {
  node: CascadeNode;
  siblings: CascadeNode[];
  index: number;
  depth: number;
  premise: string;
  level: DivergenceLevel;
  visitedIds: Set<string>;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDescend: () => void;
  onBack: () => void;
  onShowMap: () => void;
  onExit: () => void;
}) {
  const hasChildren = node.children.length > 0;
  const canPrev = index > 0;
  const canNext = index < siblings.length - 1;
  const swipe = useSwipe(canPrev ? onPrev : undefined, canNext ? onNext : undefined);
  const imageSrc = useNodeImage(node);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black text-white"
      onTouchStart={swipe.onTouchStart}
      onTouchEnd={swipe.onTouchEnd}
    >
      <CrossfadeImage src={imageSrc} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute inset-x-0 top-0 flex flex-col gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex gap-1.5">
          {siblings.map((s, i) => (
            <div
              key={s.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className={`h-full rounded-full bg-white transition-all duration-300 ease-out ${
                  visitedIds.has(s.id) || i === index ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={canGoBack ? onBack : onExit}
            aria-label={canGoBack ? "Back" : "Exit to start"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition-opacity hover:bg-black/40"
          >
            <span className="material-symbols-outlined text-[22px]">
              {canGoBack ? "chevron_left" : "home"}
            </span>
          </button>

          <button
            type="button"
            onClick={onShowMap}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 truncate rounded-full bg-black/20 px-4 py-2 text-[11px] font-medium tracking-[0.02em] text-white/70 backdrop-blur-sm transition-colors hover:bg-black/35 hover:text-white"
          >
            <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em]">
              {level}
            </span>
            <span className="truncate">&ldquo;{premise}&rdquo;</span>
          </button>

          <button
            type="button"
            onClick={onShowMap}
            aria-label="Zoom out map"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition-opacity hover:bg-black/40"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
          </button>
        </div>
      </div>

      <OnboardingHint />

      {canPrev && (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous"
          className="group absolute inset-y-0 left-0 z-10 flex w-14 items-center justify-start pl-2 sm:w-20 sm:pl-4"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/0 text-white/60 transition-all group-hover:bg-black/25 group-hover:text-white">
            <span className="material-symbols-outlined text-[26px]">chevron_left</span>
          </span>
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next"
          className="group absolute inset-y-0 right-0 z-10 flex w-14 items-center justify-end pr-2 sm:w-20 sm:pr-4"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/0 text-white/60 transition-all group-hover:bg-black/25 group-hover:text-white">
            <span className="material-symbols-outlined text-[26px]">chevron_right</span>
          </span>
        </button>
      )}

      <div
        key={node.id}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-12 pt-10 text-center sm:px-12 sm:pb-16"
        style={{ animation: "storyContentIn 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] backdrop-blur-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${PROBABILITY_DOT[node.probability]}`} />
            {node.probability}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55">
            {node.lens}
          </span>
        </div>

        <p className="max-w-[760px] text-[24px] font-semibold leading-[1.35] sm:text-[32px] md:text-[38px]">
          {node.text}
        </p>

        {hasChildren ? (
          <button
            type="button"
            onClick={onDescend}
            className="mt-2 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Continue the cascade
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
        ) : (
          <span className="mt-2 text-[12px] font-bold uppercase tracking-[0.1em] text-white/40">
            End of this thread
          </span>
        )}
      </div>

      <style>{`
        @keyframes storyContentIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function useNodeImage(node: CascadeNode): string {
  const [src, setSrc] = useState(() => getCachedNodeImage(node.id) ?? imageForId(node.id));

  useEffect(() => {
    const cached = getCachedNodeImage(node.id);
    if (cached) {
      setSrc(cached);
      return;
    }

    setSrc(imageForId(node.id));
    let cancelled = false;

    requestNodeImage(node).then((generated) => {
      if (!cancelled && generated) setSrc(generated);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]);

  return src;
}

const SWIPE_THRESHOLD = 50;

function useSwipe(onSwipeRight?: () => void, onSwipeLeft?: () => void) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    startRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(e: TouchEvent) {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx > 0) onSwipeRight?.();
    else onSwipeLeft?.();
  }

  return { onTouchStart, onTouchEnd };
}

const ONBOARDING_KEY = "cascade-onboarded";

function OnboardingHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(ONBOARDING_KEY)) return;

    setVisible(true);
    const dismiss = () => {
      setVisible(false);
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    };

    const timeout = setTimeout(dismiss, 5000);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3 px-6 text-center">
      <div className="flex items-center gap-4 rounded-full bg-black/40 px-5 py-3 text-[13px] font-medium backdrop-blur-md animate-[fadeInOut_5s_ease-in-out_both]">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">swipe</span>
          Swipe to explore
        </span>
        <span className="h-4 w-px bg-white/30" />
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          Tap to go deeper
        </span>
      </div>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(6px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function CrossfadeImage({ src }: { src: string }) {
  const [layers, setLayers] = useState<{ src: string; id: number }[]>([
    { src, id: 0 },
  ]);
  const nextId = useRef(1);
  const currentSrc = useRef(src);

  useEffect(() => {
    if (currentSrc.current === src) return;
    currentSrc.current = src;
    const id = nextId.current++;
    setLayers((prev) => [...prev, { src, id }]);

    const timeout = setTimeout(() => {
      setLayers((prev) => (prev.length > 1 ? prev.slice(-1) : prev));
    }, 600);
    return () => clearTimeout(timeout);
  }, [src]);

  return (
    <div className="absolute inset-0">
      {layers.map((layer, i) => (
        <ImageLayer key={layer.id} src={layer.src} isTop={i === layers.length - 1} />
      ))}
    </div>
  );
}

function ImageLayer({ src, isTop }: { src: string; isTop: boolean }) {
  const [opacity, setOpacity] = useState(isTop ? 0 : 1);

  useEffect(() => {
    if (!isTop) return;
    const frame = requestAnimationFrame(() => setOpacity(1));
    return () => cancelAnimationFrame(frame);
  }, [isTop]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
      style={{ opacity }}
    />
  );
}
