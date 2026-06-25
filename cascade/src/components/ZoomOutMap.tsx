import { CascadeNode, CascadeTree } from "@/lib/types";
import { gradientForId } from "@/lib/visuals";

const PROBABILITY_DOT: Record<CascadeNode["probability"], string> = {
  likely: "bg-likely",
  possible: "bg-possible",
  speculative: "bg-speculative",
};

function truncate(text: string, max = 60): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function MapNode({
  node,
  visitedIds,
  currentNodeId,
  onSelect,
}: {
  node: CascadeNode;
  visitedIds: Set<string>;
  currentNodeId: string;
  onSelect: (id: string) => void;
}) {
  const visitedChildren = node.children.filter((c) => visitedIds.has(c.id));
  const isCurrent = node.id === currentNodeId;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={`relative w-36 overflow-hidden rounded-md border p-2.5 text-left transition-transform hover:-translate-y-0.5 ${
          isCurrent ? "border-secondary ring-2 ring-secondary" : "border-outline-variant"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ background: gradientForId(node.id) }}
        />
        <div className="relative flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${PROBABILITY_DOT[node.probability]}`} />
          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
            {node.lens}
          </span>
        </div>
        <p className="relative mt-1.5 text-[11px] leading-[14px] text-on-surface">
          {truncate(node.text)}
        </p>
        {isCurrent && (
          <span className="relative mt-1.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-secondary">
            You are here
          </span>
        )}
      </button>
      {visitedChildren.length > 0 && (
        <div className="flex gap-5 border-t-[0.5px] border-outline-variant pt-3">
          {visitedChildren.map((child) => (
            <MapNode
              key={child.id}
              node={child}
              visitedIds={visitedIds}
              currentNodeId={currentNodeId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ZoomOutMap({
  tree,
  visitedIds,
  currentNodeId,
  onSelect,
  onClose,
}: {
  tree: CascadeTree;
  visitedIds: Set<string>;
  currentNodeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const visitedBranches = tree.branches.filter((b) => visitedIds.has(b.id));

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-8 overflow-auto bg-background/95 px-6 py-12 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-container items-center justify-between">
        <p className="text-[20px] font-bold text-on-surface">{tree.premise}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-primary px-5 py-2 text-[14px] font-semibold text-on-primary hover:bg-secondary"
        >
          Close map
        </button>
      </div>
      <div className="mx-auto flex flex-wrap justify-center gap-10">
        {visitedBranches.length === 0 && (
          <p className="text-on-surface-variant">
            Explore a branch to start building your map.
          </p>
        )}
        {visitedBranches.map((branch) => (
          <MapNode
            key={branch.id}
            node={branch}
            visitedIds={visitedIds}
            currentNodeId={currentNodeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
