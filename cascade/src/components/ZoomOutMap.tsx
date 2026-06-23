import { CascadeNode, CascadeTree } from "@/lib/types";
import { gradientForId } from "@/lib/visuals";

function MapNode({
  node,
  visitedIds,
  onSelect,
}: {
  node: CascadeNode;
  visitedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  const visitedChildren = node.children.filter((c) => visitedIds.has(c.id));

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className="relative w-44 overflow-hidden rounded-md border-[0.5px] border-outline-variant bg-surface-container-lowest p-3 text-left transition-transform hover:-translate-y-0.5"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ background: gradientForId(node.id) }}
        />
        <p className="relative line-clamp-3 text-[12px] leading-[16px] text-on-surface">
          {node.text}
        </p>
      </button>
      {visitedChildren.length > 0 && (
        <div className="flex gap-6 border-t-[0.5px] border-outline-variant pt-3">
          {visitedChildren.map((child) => (
            <MapNode
              key={child.id}
              node={child}
              visitedIds={visitedIds}
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
  onSelect,
  onClose,
}: {
  tree: CascadeTree;
  visitedIds: Set<string>;
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
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
