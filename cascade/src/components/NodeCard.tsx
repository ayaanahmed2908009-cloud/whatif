import { CascadeNode } from "@/lib/types";
import { gradientForId } from "@/lib/visuals";

const PROBABILITY_STYLES: Record<CascadeNode["probability"], string> = {
  likely: "bg-likely-bg text-likely",
  possible: "bg-possible-bg text-possible",
  speculative: "bg-speculative-bg text-speculative",
};

export default function NodeCard({
  node,
  revealed,
  onClick,
}: {
  node: CascadeNode;
  revealed: boolean;
  onClick?: () => void;
}) {
  const hasChildren = node.children.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-lg border-[0.5px] border-outline-variant bg-surface-container-lowest p-5 text-left transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(2,2,32,0.08)]"
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          revealed ? "opacity-20 group-hover:opacity-30" : "opacity-50"
        }`}
        style={{ background: gradientForId(node.id) }}
      />

      <div className="relative flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.1em] ${PROBABILITY_STYLES[node.probability]}`}
        >
          {node.probability}
        </span>
        <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
          {node.lens}
        </span>
      </div>

      {revealed ? (
        <>
          <p className="relative mt-4 animate-[revealFade_0.45s_ease-out] text-[16px] leading-[24px] text-on-surface">
            {node.text}
          </p>
          {hasChildren ? (
            <span className="relative mt-4 text-[12px] font-bold uppercase tracking-[0.1em] text-secondary">
              Explore further →
            </span>
          ) : (
            <span className="relative mt-4 text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50">
              End of this thread
            </span>
          )}
        </>
      ) : (
        <div className="relative mt-4 flex flex-1 flex-col items-center justify-center gap-2 py-4 text-center">
          <span className="material-symbols-outlined text-[28px] text-on-surface-variant/60">
            visibility
          </span>
          <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/70">
            Click to reveal
          </span>
        </div>
      )}

      <style>{`
        @keyframes revealFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </button>
  );
}
